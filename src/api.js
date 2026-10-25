/*
 * Project Nahan - Management REST APIs & Panel Sync Handlers
 */

import {
    state,
    CURRENT_VERSION,
    fetchT,
    usageTotalBytes,
    usageDailyBytes,
    limitReqToBytes,
} from "./config.js";
import { cachedD1Put, d1Get, d1Put, logActivity } from "./db.js";
import { generateApiKey } from "./crypto.js";
import { relayHealthSnapshotAsync } from "./relays.js";
import { sendTelegramMessage } from "./telegram/bot.js";
import { getAllProfiles } from "./subs/transformers.js";

export const LOGIN_ATTEMPTS = new Map();
export const LOGIN_FAIL_LIMIT = 15;
export const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export function authBlocked(ip) {
    try {
        const r = LOGIN_ATTEMPTS.get(ip);
        if (!r) return false;
        if (Date.now() - r.first > LOGIN_WINDOW_MS) {
            LOGIN_ATTEMPTS.delete(ip);
            return false;
        }
        return r.n >= LOGIN_FAIL_LIMIT;
    } catch (e) {
        return false;
    }
}

export function authFail(ip) {
    try {
        const now = Date.now();
        let r = LOGIN_ATTEMPTS.get(ip);
        if (!r || now - r.first > LOGIN_WINDOW_MS) r = { n: 0, first: now };
        r.n++;
        LOGIN_ATTEMPTS.set(ip, r);
        if (LOGIN_ATTEMPTS.size > 10000) LOGIN_ATTEMPTS.clear();
    } catch (e) {}
}

export function authClear(ip) {
    try {
        LOGIN_ATTEMPTS.delete(ip);
    } catch (e) {}
}

export function isPanelApiKey(key) {
    if (!key || !state.sysConfig.panelApiKeys || !Array.isArray(state.sysConfig.panelApiKeys)) return false;
    return state.sysConfig.panelApiKeys.some((k) => k.key === key);
}

export function extractAuthKey(request, data) {
    const authHeader = request.headers.get("Authorization") || "";
    const authKey = authHeader.replace("Bearer ", "") || "";
    let bodyKey = "";
    if (data && typeof data === "object") bodyKey = data.key || "";
    return authKey || bodyKey;
}

export function isAuthorized(request, data) {
    try {
        const ip = request?.headers?.get("cf-connecting-ip") || "Unknown";
        if (authBlocked(ip)) return false;
        const key = extractAuthKey(request, data);
        const ok = key === state.sysConfig.masterKey || isPanelApiKey(key);
        if (!ok) authFail(ip);
        return ok;
    } catch (e) {
        return false;
    }
}

export async function handleAuth(request, hostName, ctx, env) {
    try {
        const data = await request.json();
        const ip = request.headers.get("cf-connecting-ip") || "Unknown";
        if (authBlocked(ip)) {
            return new Response(JSON.stringify({ success: false, error: "Too many attempts" }), { status: 429 });
        }
        const loginKey = extractAuthKey(request, data);
        if (loginKey === state.sysConfig.masterKey || isPanelApiKey(loginKey)) {
            authClear(ip);
            ctx?.waitUntil(logActivity(env, "Auth Success", `Successful login from ${ip}`));
            let usageData = {};
            for (let [k, v] of state.uuidUsage.entries()) {
                usageData[k] = { ...v, connects: state.activeConns.get(k) || 0 };
            }
            return new Response(
                JSON.stringify({
                    success: true,
                    config: isPanelApiKey(loginKey)
                        ? {
                              ...state.sysConfig,
                              masterKey: "[PROTECTED]",
                              panelApiKeys: "[PROTECTED]",
                              cfApiToken: "[PROTECTED]",
                              cfAccountId: "[PROTECTED]",
                              cfWorkerName: "[PROTECTED]",
                              tgToken: "[PROTECTED]",
                              tgChatId: "[PROTECTED]",
                              tgAdminId: "[PROTECTED]",
                              syncApiKey: "[PROTECTED]",
                          }
                        : state.sysConfig,
                    deviceId: state.activeDeviceId,
                    network: { ip, colo: request.cf?.colo || "Unknown" },
                    usage: usageData,
                    sysUsage: state.sysUsageCache?.users || {},
                    version: CURRENT_VERSION,
                    profiles: getAllProfiles().map((p) => ({
                        name: p.name,
                        id: p.id,
                        sync: `https://${hostName}/${state.sysConfig.apiRoute}${p.name === "Default" ? "" : "?sub=" + encodeURIComponent(p.name)}`,
                    })),
                }),
                { status: 200, headers: { "Content-Type": "application/json" } },
            );
        }
        ctx?.waitUntil(logActivity(env, "Auth Failed", `Failed login attempt from ${ip}`));
        authFail(ip);
        if (ctx) ctx.waitUntil(sendTelegramMessage(request, "Failed login attempt", hostName));
        return new Response(JSON.stringify({ success: false }), { status: 401 });
    } catch (e) {
        return new Response(JSON.stringify({ success: false }), { status: 400 });
    }
}

export async function handleConfigSync(request, env, ctx) {
    try {
        const data = await request.json();
        const syncGateIp = request.headers.get("cf-connecting-ip") || "Unknown";
        if (authBlocked(syncGateIp)) {
            return new Response(JSON.stringify({ success: false, error: "Too many attempts" }), { status: 429 });
        }
        const isAuthSync =
            data.key === state.sysConfig.masterKey ||
            (data.oldKey && data.oldKey === state.sysConfig.masterKey) ||
            isPanelApiKey(data.key) ||
            isPanelApiKey(data.oldKey);
        if (!isAuthSync) {
            authFail(syncGateIp);
            return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
        }
        authClear(syncGateIp);

        if (data.config) {
            state.sysConfig = { ...state.sysConfig, ...data.config };
            await cachedD1Put(env, "sys_config", JSON.stringify(state.sysConfig));
            ctx?.waitUntil(logActivity(env, "Config Synced", "System configuration synced via API"));
        }
        return new Response(JSON.stringify({ success: true, config: state.sysConfig }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500 });
    }
}

export async function handleUsersApi(request, env, ctx) {
    try {
        const url = new URL(request.url);
        const method = request.method;
        const userId = url.searchParams.get("id");
        const action = url.searchParams.get("action");
        const gateIp = request.headers.get("cf-connecting-ip") || "Unknown";

        if (authBlocked(gateIp)) {
            return new Response(JSON.stringify({ success: false, error: "Too many attempts" }), { status: 429 });
        }
        const authKey = extractAuthKey(request, null);
        if (authKey !== state.sysConfig.masterKey && !isPanelApiKey(authKey)) {
            authFail(gateIp);
            return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
        }
        authClear(gateIp);

        if (method === "GET" && !userId) {
            const enriched = (state.sysConfig.users || []).map((u) => {
                const idClean = u.id.replace(/-/g, "").toLowerCase();
                const sysU = state.sysUsageCache?.users?.[idClean] || { reqs: 0, dReqs: 0 };
                return {
                    ...u,
                    usage: {
                        total: usageTotalBytes(sysU),
                        limit: limitReqToBytes(u.limitTotalReq),
                        daily: sysU.dReqs || 0,
                    },
                };
            });
            return new Response(JSON.stringify({ success: true, users: enriched }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        if (method === "POST" && !userId) {
            const body = await request.json();
            const newId = crypto.randomUUID();
            const newUser = {
                id: newId,
                name: body.name || "Subscriber",
                limitTotalReq: body.trafficLimit ? Math.floor(parseFloat(body.trafficLimit) * 6000) : null,
                expiryMs: body.expiryDays ? Date.now() + parseInt(body.expiryDays) * 86400000 : null,
                notes: body.notes || "",
                createdAt: Date.now(),
            };
            if (!state.sysConfig.users) state.sysConfig.users = [];
            state.sysConfig.users.push(newUser);
            await cachedD1Put(env, "sys_config", JSON.stringify(state.sysConfig));
            return new Response(JSON.stringify({ success: true, user: newUser }), { status: 201 });
        }

        if (method === "DELETE" && userId) {
            const idx = (state.sysConfig.users || []).findIndex((u) => u.id === userId);
            if (idx === -1) return new Response(JSON.stringify({ success: false, error: "Not found" }), { status: 404 });
            const deleted = state.sysConfig.users.splice(idx, 1)[0];
            await cachedD1Put(env, "sys_config", JSON.stringify(state.sysConfig));
            return new Response(JSON.stringify({ success: true, deleted: deleted.id }));
        }

        if (method === "POST" && userId && action === "toggle") {
            const u = (state.sysConfig.users || []).find((usr) => usr.id === userId);
            if (!u) return new Response(JSON.stringify({ success: false, error: "Not found" }), { status: 404 });
            u.isPaused = !u.isPaused;
            await cachedD1Put(env, "sys_config", JSON.stringify(state.sysConfig));
            return new Response(JSON.stringify({ success: true, user: u }));
        }

        if (method === "POST" && userId && action === "reset") {
            const uIdClean = userId.replace(/-/g, "").toLowerCase();
            if (state.sysUsageCache.users?.[uIdClean]) {
                state.sysUsageCache.users[uIdClean].reqs = 0;
                state.sysUsageCache.users[uIdClean].dReqs = 0;
                await cachedD1Put(env, "sys_usage", JSON.stringify(state.sysUsageCache));
            }
            return new Response(JSON.stringify({ success: true, message: "Traffic reset" }));
        }

        return new Response(JSON.stringify({ success: false, error: "Invalid action" }), { status: 400 });
    } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500 });
    }
}

export async function handleStatsApi(request, env) {
    try {
        const users = state.sysConfig.users || [];
        const activeUsers = users.filter((u) => !u.isPaused).length;
        const upSeconds = Math.floor((Date.now() - state.isolateStartTime) / 1000);

        return new Response(
            JSON.stringify({
                success: true,
                stats: {
                    users: { total: users.length, active: activeUsers },
                    system: { uptimeSeconds: upSeconds, activeConnections: state.activeConnections, version: CURRENT_VERSION },
                    relays: await relayHealthSnapshotAsync(env),
                },
            }),
            { headers: { "Content-Type": "application/json" } },
        );
    } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500 });
    }
}

export function cmpVersions(a, b) {
    const strip = (v) => String(v).replace(/^v/, "").trim();
    const pa = strip(a).split(".").map(Number);
    const pb = strip(b).split(".").map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const na = pa[i] || 0, nb = pb[i] || 0;
        if (na > nb) return 1;
        if (nb > na) return -1;
    }
    return 0;
}

export async function deployWorkerToCloudflare(accountId, apiToken, workerName, code) {
    const metadata = {
        main_module: "_worker.js",
        compatibility_date: "2024-03-01",
        compatibility_flags: ["allow_eval_during_startup"],
    };
    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    form.append("_worker.js", new Blob([code], { type: "application/javascript+module" }), "_worker.js");
    return await fetchT(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${encodeURIComponent(workerName)}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${apiToken}` },
        body: form,
    }, 30000);
}

export async function handleUpdateApi(request, env, ctx) {
    try {
        const data = await request.json();
        const repo = (state.sysConfig.githubRepo || "itsyebekhe/nahan").replace(/https?:\/\/github\.com\//, "").trim();
        if (data.action === "check") {
            const res = await fetchT(`https://raw.githubusercontent.com/${repo}/main/version`);
            const remoteVer = res.ok ? (await res.text()).trim() : null;
            return new Response(JSON.stringify({
                success: true,
                currentVersion: CURRENT_VERSION,
                remoteVersion: remoteVer,
                hasUpdate: remoteVer ? cmpVersions(CURRENT_VERSION, remoteVer) < 0 : false,
            }), { headers: { "Content-Type": "application/json" } });
        }
        return new Response(JSON.stringify({ success: false, error: "Action not supported" }), { status: 400 });
    } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500 });
    }
}

export async function handleApiKeys(request, env, ctx) {
    try {
        const method = request.method;
        if (method === "GET") {
            const keys = (state.sysConfig.panelApiKeys || []).map((k) => ({
                id: k.id,
                name: k.name,
                keyPreview: k.key.slice(0, 8) + "..." + k.key.slice(-4),
            }));
            return new Response(JSON.stringify({ success: true, keys }), { headers: { "Content-Type": "application/json" } });
        }
        if (method === "POST") {
            const body = await request.json();
            if (body.action === "create") {
                const newKey = generateApiKey(body.name);
                if (!state.sysConfig.panelApiKeys) state.sysConfig.panelApiKeys = [];
                state.sysConfig.panelApiKeys.push(newKey);
                await cachedD1Put(env, "sys_config", JSON.stringify(state.sysConfig));
                return new Response(JSON.stringify({ success: true, key: newKey }), { status: 201 });
            }
        }
        return new Response(JSON.stringify({ success: false, error: "Invalid request" }), { status: 400 });
    } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500 });
    }
}

export async function handleSyncPanel(request, env, ctx) {
    try {
        const payload = await request.json();
        return new Response(JSON.stringify({ success: true, received: payload }), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ success: false }), { status: 400 });
    }
}
