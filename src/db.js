/*
 * Project Nahan - Cloudflare D1 Database & Storage Layer
 */

import {
    state,
    SYSTEM_DEFAULTS,
    CACHE_TTL_CONFIG,
    CACHE_TTL_USAGE,
    CACHE_TTL_BACKUP_IP,
    NAHAN_RUNNER_LEASE_TTL_MS,
} from "./config.js";

export async function d1Init(env) {
    if (env.IOT_DB && !env.IOT_DB_INITIALIZED) {
        try {
            await env.IOT_DB.prepare(
                "CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value TEXT)",
            ).run();
            env.IOT_DB_INITIALIZED = true;
        } catch (e) {
            env.IOT_DB_INITIALIZED = true;
        }
    }
}

export async function d1Get(env, key) {
    if (!env || !env.IOT_DB) return null;
    await d1Init(env);
    try {
        const { results } = await env.IOT_DB.prepare(
            "SELECT value FROM kv_store WHERE key = ?",
        )
            .bind(key)
            .all();
        if (results && results.length > 0) return results[0].value;
    } catch (e) {}
    return null;
}

export async function d1Put(env, key, value) {
    if (!env || !env.IOT_DB) return;
    await d1Init(env);
    try {
        await env.IOT_DB.prepare(
            "INSERT INTO kv_store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
        )
            .bind(key, value)
            .run();
    } catch (e) {}
}

export async function cachedD1Put(env, key, value) {
    await d1Put(env, key, value);
    if (key === "sys_config") state.sysConfigCacheTime = 0;
    else if (key === "sys_usage") state.sysUsageCacheTime = 0;
    else if (key === "backup_ip") state.backupIpCacheTime = 0;
}

export async function d1PutStrict(env, key, value) {
    if (!env || !env.IOT_DB) throw new Error("d1-unavailable");
    await d1Init(env);
    await env.IOT_DB.prepare(
        "INSERT INTO kv_store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
    )
        .bind(key, value)
        .run();
}

export async function acquireNahanRunnerLock(
    env,
    jobKey,
    intervalMs,
    lockGroup = "nahan-relay",
) {
    const physicalKey = "nahan_lock:" + String(lockGroup || "nahan-relay");
    const scheduleKey = "nahan_runner_last_" + String(jobKey || "job");
    let lease = null;
    try {
        if (!env || !env.IOT_DB) return null;
        const now = Date.now();
        const until = now + NAHAN_RUNNER_LEASE_TTL_MS;
        try {
            const r = await env.IOT_DB.prepare(
                "UPDATE kv_store SET value=? WHERE key=? AND CAST(value AS INTEGER)<?",
            )
                .bind(String(until), physicalKey, now)
                .run();
            if (r && r.meta && r.meta.changes > 0)
                lease = { lockKey: physicalKey, until, scheduleKey };
        } catch (e) {}
        if (!lease) {
            try {
                const r = await env.IOT_DB.prepare(
                    "INSERT OR IGNORE INTO kv_store(key,value) VALUES(?,?)",
                )
                    .bind(physicalKey, String(until))
                    .run();
                if (r && r.meta && r.meta.changes > 0)
                    lease = { lockKey: physicalKey, until, scheduleKey };
            } catch (e) {}
        }
        if (!lease) return null;
        let lastRun = 0;
        try {
            const row = await env.IOT_DB.prepare(
                "SELECT value FROM kv_store WHERE key=?",
            )
                .bind(scheduleKey)
                .first();
            lastRun = Number((row && row.value) || 0) || 0;
        } catch (e) {}
        if (intervalMs > 0 && now - lastRun < intervalMs) {
            await releaseNahanRunnerLock(env, lease);
            return null;
        }
        try {
            await env.IOT_DB.prepare(
                "INSERT INTO kv_store(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
            )
                .bind(scheduleKey, String(now))
                .run();
        } catch (e) {
            await releaseNahanRunnerLock(env, lease);
            return null;
        }
        return lease;
    } catch (e) {
        try {
            if (lease) await releaseNahanRunnerLock(env, lease);
        } catch (_) {}
        return null;
    }
}

export async function refreshNahanRunnerLease(env, lease) {
    try {
        if (!lease || !env || !env.IOT_DB) return false;
        const nextUntil = Date.now() + NAHAN_RUNNER_LEASE_TTL_MS;
        const r = await env.IOT_DB.prepare(
            "UPDATE kv_store SET value=? WHERE key=? AND value=?",
        )
            .bind(String(nextUntil), lease.lockKey, String(lease.until))
            .run();
        if (r && r.meta && r.meta.changes > 0) {
            lease.until = nextUntil;
            return true;
        }
    } catch (e) {}
    return false;
}

export async function releaseNahanRunnerLock(env, lease) {
    try {
        if (lease && env && env.IOT_DB) {
            await env.IOT_DB.prepare(
                "DELETE FROM kv_store WHERE key=? AND value=?",
            )
                .bind(lease.lockKey, String(lease.until))
                .run();
        }
    } catch (e) {}
}

export function migrateSlaveNodesToLinkedPanels(config) {
    let modified = false;
    if (config && config.slaveNodes && config.slaveNodes.trim().length > 0) {
        if (!config.linkedPanels) config.linkedPanels = [];
        let nodes = config.slaveNodes
            .split(/[\r\n,;]+/)
            .map((s) => s.trim())
            .filter(Boolean);
        let syncKey = config.syncApiKey || "";
        nodes.forEach((node) => {
            let cleanNode = node
                .replace(/^[a-zA-Z]+:\/\//, "")
                .split("/")[0]
                .split("@")
                .pop()
                .split(":")[0]
                .toLowerCase();
            let exists = config.linkedPanels.some((p) => {
                if (!p || !p.url) return false;
                let cleanUrl = p.url
                    .replace(/^[a-zA-Z]+:\/\//, "")
                    .split("/")[0]
                    .split("@")
                    .pop()
                    .split(":")[0]
                    .toLowerCase();
                return cleanUrl === cleanNode;
            });
            if (!exists) {
                config.linkedPanels.push({ url: node, apiKey: syncKey });
                modified = true;
            }
        });
        config.slaveNodes = "";
        modified = true;
    }
    return modified;
}

let sysConfigLoading = null;
let sysUsageLoading = null;
let backupIpLoading = null;

export async function loadSysConfig(env, ctx = null) {
    const now = Date.now();
    if (env.IOT_DB) {
        if (now - state.sysConfigCacheTime > CACHE_TTL_CONFIG) {
            if (!sysConfigLoading) {
                sysConfigLoading = d1Get(env, "sys_config")
                    .then((stored) => {
                        state.sysConfig = {
                            ...SYSTEM_DEFAULTS,
                            ...(stored ? JSON.parse(stored) : null),
                        };
                        state.sysConfigCacheTime = Date.now();
                        if (migrateSlaveNodesToLinkedPanels(state.sysConfig)) {
                            const promise = cachedD1Put(
                                env,
                                "sys_config",
                                JSON.stringify(state.sysConfig),
                            );
                            if (ctx && typeof ctx.waitUntil === "function") {
                                ctx.waitUntil(promise.catch(() => {}));
                            } else {
                                promise.catch(() => {});
                            }
                        }
                    })
                    .catch(() => {
                        state.sysConfig = { ...SYSTEM_DEFAULTS };
                        state.sysConfigCacheTime = Date.now();
                    })
                    .finally(() => {
                        sysConfigLoading = null;
                    });
            }
            await sysConfigLoading;
        }
        if (now - state.sysUsageCacheTime > CACHE_TTL_USAGE) {
            if (!sysUsageLoading) {
                sysUsageLoading = d1Get(env, "sys_usage")
                    .then((ustored) => {
                        if (ustored) state.sysUsageCache = JSON.parse(ustored);
                        else state.sysUsageCache = { users: {} };
                        state.sysUsageCacheTime = Date.now();
                    })
                    .catch(() => {
                        state.sysUsageCache = { users: {} };
                        state.sysUsageCacheTime = Date.now();
                    })
                    .finally(() => {
                        sysUsageLoading = null;
                    });
            }
            await sysUsageLoading;
        }
    }

    if (now - state.backupIpCacheTime > CACHE_TTL_BACKUP_IP) {
        if (!backupIpLoading) {
            backupIpLoading = (
                env.IOT_DB ? d1Get(env, "backup_ip") : Promise.resolve(null)
            )
                .then((val) => {
                    state.backupIpCache = val;
                    state.backupIpCacheTime = Date.now();
                })
                .catch(() => {
                    state.backupIpCacheTime = Date.now();
                })
                .finally(() => {
                    backupIpLoading = null;
                });
        }
        await backupIpLoading;
    }
    state.sysConfig.customRelay = state.backupIpCache ?? env.RELAY_IP ?? "";
}

export async function logActivity(env, type, detail) {
    if (!env || !env.IOT_DB) return;
    try {
        const ts = new Date().toISOString();
        let logs = [];
        const stored = await d1Get(env, "sys_logs");
        if (stored) logs = JSON.parse(stored);
        logs.unshift({ ts, type, detail });
        if (logs.length > 50) logs = logs.slice(0, 50);
        await d1Put(env, "sys_logs", JSON.stringify(logs));
    } catch (e) {}
}

export async function handleLogs(request, env, isAuthorizedFn) {
    try {
        if (request.method === "POST") {
            const data = await request.json();
            if (!isAuthorizedFn(request, data)) {
                return new Response(JSON.stringify({ success: false }), {
                    status: 401,
                });
            }
            let logs = [];
            if (env.IOT_DB) {
                const stored = await d1Get(env, "sys_logs");
                if (stored) logs = JSON.parse(stored);
            }
            return new Response(JSON.stringify({ success: true, logs }), {
                status: 200,
            });
        }
        return new Response("OK", { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ success: false }), {
            status: 400,
        });
    }
}
