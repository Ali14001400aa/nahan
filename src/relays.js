/*
 * Project Nahan - Relay Health, Probing, Quarantine & Graveyard
 */

import { connect } from "cloudflare:sockets";
import {
    state,
    breakerLevel,
    withTimeout,
    withDeadline,
    TCP_OPEN_TIMEOUT_MS,
    TCP_WRITE_TIMEOUT_MS,
} from "./config.js";
import {
    d1Get,
    d1Put,
    d1PutStrict,
    acquireNahanRunnerLock,
    releaseNahanRunnerLock,
} from "./db.js";

export const RELAY_Q = new Map();
export const RELAY_QUARANTINE_MS = 15 * 60 * 1000;
export const RELAY_FAIL_STREAK = 5;

export const RELAY_TLS_PORTS = new Set(["443", "2053", "2083", "2087", "2096", "8443"]);
export const PROBE_INTERVAL_MS = 10 * 60 * 1000;
export const PROBE_MAX_PER_ROUND = 6;
export const PROBE_FAIL_LIMIT = 3;
export const GRAVE_INTERVAL_MS = 30 * 60 * 1000;
export const GRAVE_MAX_PER_ROUND = 3;
export const GRAVE_HEALTHY_NEED = 3;
export const FLAP_WINDOW_MS = 24 * 60 * 60 * 1000;
export const FLAP_LIMIT = 3;

let lastProbeTs = 0;
let lastGraveTs = 0;
let lastHealthSave = 0;
let probeCursor = 0;
let graveCursor = 0;
let RELAY_SNAPSHOT_LOADED = false;
let lastResurrectChanged = false;

export const AI_RELAY_Q = new Map();
export const AI_FAIL_STREAK = 3;
export const AI_QUARANTINE_MS = 30 * 60 * 1000;

export const AI_LLM_SUFFIXES = [
    "gemini.google.com",
    "generativelanguage.googleapis.com",
    "ai.google.dev",
    "bard.google.com",
    "openai.com",
    "chatgpt.com",
    "anthropic.com",
    "claude.ai",
    "copilot.microsoft.com",
    "bing.com",
    "meta.ai",
    "x.ai",
    "grok.com",
    "deepseek.com",
    "perplexity.ai",
    "poe.com",
    "character.ai",
    "you.com",
    "mistral.ai",
    "chat.mistral.ai",
];

export function relayKeyOf(tok) {
    try {
        let s = String(tok || "").trim();
        if (!s) return null;
        s = s.replace(/^[a-zA-Z]+:\/\//, "");
        if (s.includes("@")) s = s.substring(s.lastIndexOf("@") + 1);
        const hi = s.indexOf("#");
        if (hi !== -1) s = s.substring(0, hi).trim();
        if (!s) return null;
        if (s.charAt(0) === "[") {
            const ci = s.indexOf("]");
            if (ci === -1) return null;
            const host = s.substring(1, ci).toLowerCase();
            let port = 443;
            if (s.length > ci + 1 && s.charAt(ci + 1) === ":") {
                const p = parseInt(s.substring(ci + 2), 10);
                if (!isNaN(p) && p >= 1 && p <= 65535) port = p;
            }
            if (!host) return null;
            return { host, port, key: host + "|" + port };
        }
        const firstColon = s.indexOf(":");
        const lastColon = s.lastIndexOf(":");
        if (firstColon !== -1 && firstColon !== lastColon) {
            const host = s.toLowerCase();
            if (!host || host.length > 253) return null;
            return { host, port: 443, key: host + "|443" };
        }
        let host = s;
        let port = 443;
        if (lastColon !== -1) {
            const tail = s.substring(lastColon + 1).trim();
            if (/^\d+$/.test(tail)) {
                const p = parseInt(tail, 10);
                if (!isNaN(p) && p >= 1 && p <= 65535) {
                    host = s.substring(0, lastColon);
                    port = p;
                } else return null;
            } else return null;
        }
        host = host.toLowerCase();
        if (!host || host.length > 253) return null;
        if (!/^[a-z0-9.\-]+$/.test(host)) return null;
        return { host, port, key: host + "|" + port };
    } catch (e) {
        return null;
    }
}

export function isRelayQuarantined(host, port) {
    try {
        const e = RELAY_Q.get(String(host || "").toLowerCase() + "|" + (port || 443));
        if (!e || !e.until) return false;
        if (Date.now() > e.until) {
            RELAY_Q.delete(String(host || "").toLowerCase() + "|" + (port || 443));
            return false;
        }
        return true;
    } catch (err) {
        return false;
    }
}

export function recordRelaySuccess(host, port, full) {
    try {
        const k = String(host || "").toLowerCase() + "|" + (port || 443);
        const e = RELAY_Q.get(k);
        if (!e) return;
        e.fail = 0;
        if (full) {
            e.probeFail = 0;
            e.until = 0;
            if (!e.fail && !e.probeFail) RELAY_Q.delete(k);
        }
    } catch (err) {}
}

export function recordRelayFailure(host, port) {
    try {
        const k = String(host || "").toLowerCase() + "|" + (port || 443);
        let e = RELAY_Q.get(k);
        if (!e) {
            e = { fail: 0, until: 0, probeFail: 0 };
            RELAY_Q.set(k, e);
        }
        e.fail = (e.fail || 0) + 1;
        if (e.fail >= RELAY_FAIL_STREAK) {
            e.until = Date.now() + RELAY_QUARANTINE_MS;
        }
        if (RELAY_Q.size > 2000) RELAY_Q.clear();
    } catch (err) {}
}

export function isAiQuarantined(host, port) {
    try {
        const k = String(host || "").toLowerCase() + "|" + (port || 443);
        const e = AI_RELAY_Q.get(k);
        if (!e) return false;
        if (e.until) {
            if (Date.now() < e.until) return true;
            try { AI_RELAY_Q.delete(k); } catch (err) {}
            return false;
        }
        return false;
    } catch (err) {
        return false;
    }
}

export function recordAiFailure(host, port) {
    try {
        const k = String(host || "").toLowerCase() + "|" + (port || 443);
        const now = Date.now();
        const e = AI_RELAY_Q.get(k) || { fail: 0, until: 0 };
        if (e.until && now < e.until) return;
        e.fail++;
        if (e.fail >= AI_FAIL_STREAK) {
            e.until = now + AI_QUARANTINE_MS;
            e.fail = 0;
        }
        AI_RELAY_Q.set(k, e);
    } catch (err) {}
}

export function recordAiSuccess(host, port) {
    try {
        AI_RELAY_Q.delete(String(host || "").toLowerCase() + "|" + (port || 443));
    } catch (err) {}
}

export function filterAiQuarantinedTokens(list) {
    try {
        return (list || []).filter((t) => {
            const rk = relayKeyOf(t);
            if (!rk) return true;
            return !isAiQuarantined(rk.host, rk.port);
        });
    } catch (e) {
        return [];
    }
}

export function filterQuarantinedRelays(list) {
    try {
        return (list || []).filter((t) => {
            const rk = relayKeyOf(t);
            if (!rk) return true;
            return !isRelayQuarantined(rk.host, rk.port);
        });
    } catch (e) {
        return [];
    }
}

export function isAiDomain(d) {
    try {
        const v = String(d || "").toLowerCase().replace(/\.$/, "").trim();
        if (!v || v.length > 253) return false;
        for (const sfx of AI_LLM_SUFFIXES) {
            if (v === sfx || v.endsWith("." + sfx)) return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

export function sniffSniFromHello(data) {
    try {
        const raw = data instanceof Uint8Array ? data : new Uint8Array(data || []);
        if (!raw || raw.byteLength <= 43) return null;
        if (raw[0] !== 0x16 || raw[5] !== 0x01) return null;
        let pos = 43;
        if (pos + 1 > raw.byteLength) return null;
        const sessionIdLen = raw[pos];
        pos += 1 + sessionIdLen;
        if (pos + 2 > raw.byteLength) return null;
        const cipherSuitesLen = (raw[pos] << 8) | raw[pos + 1];
        pos += 2 + cipherSuitesLen;
        if (pos + 1 > raw.byteLength) return null;
        const compMethodsLen = raw[pos];
        pos += 1 + compMethodsLen;
        if (pos + 2 > raw.byteLength) return null;
        const extensionsLen = (raw[pos] << 8) | raw[pos + 1];
        pos += 2;
        const endPos = Math.min(pos + extensionsLen, raw.byteLength);
        while (pos + 4 <= endPos) {
            const extType = (raw[pos] << 8) | raw[pos + 1];
            const extLen = (raw[pos + 2] << 8) | raw[pos + 3];
            pos += 4;
            if (extType === 0x0000) {
                if (pos + 2 > raw.byteLength) return null;
                const sniPos = pos + 2;
                if (raw[sniPos] === 0x00) {
                    if (sniPos + 3 > raw.byteLength) return null;
                    const sniLen = (raw[sniPos + 1] << 8) | raw[sniPos + 2];
                    if (sniLen <= 0 || sniLen > 253) return null;
                    if (sniPos + 3 + sniLen > raw.byteLength) return null;
                    try {
                        return new TextDecoder().decode(raw.slice(sniPos + 3, sniPos + 3 + sniLen));
                    } catch (e) {
                        return null;
                    }
                }
                return null;
            }
            pos += extLen;
        }
        return null;
    } catch (e) {
        return null;
    }
}

export function relayAiFlag(tok) {
    try {
        const s = String(tok || "");
        const hi = s.indexOf("#");
        if (hi === -1) return false;
        const toks = s.slice(hi + 1).split(/[\s,;]+/);
        for (const t of toks) {
            if (String(t).toLowerCase() === "ai") return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

export function orderAiFirstTokens(pips) {
    try {
        const list = Array.isArray(pips) ? pips : [];
        const ai = [];
        const rest = [];
        for (const t of list) {
            if (relayAiFlag(t)) ai.push(t);
            else rest.push(t);
        }
        if (ai.length === 0) return { list, moved: false };
        return { list: ai.concat(rest), moved: true };
    } catch (e) {
        return { list: [], moved: false };
    }
}

export function buildProbeHello(sni) {
    try {
        const sn = new TextEncoder().encode(String(sni || "cloudflare-dns.com")).slice(0, 64);
        const rnd = new Uint8Array(32);
        try { crypto.getRandomValues(rnd); } catch (e) {}
        const body = [0x03, 0x03];
        for (let i = 0; i < 32; i++) body.push(rnd[i]);
        body.push(0x00);
        const cs = [0xc0, 0x2b, 0xc0, 0x2f, 0xcc, 0xa8, 0xc0, 0x13];
        body.push((cs.length >> 8) & 0xff, cs.length & 0xff);
        for (const b of cs) body.push(b);
        body.push(0x01, 0x00);
        const ext = [0x00, 0x00];
        const namePart = [0x00, (sn.length >> 8) & 0xff, sn.length & 0xff];
        for (let i = 0; i < sn.length; i++) namePart.push(sn[i]);
        const entry = [(namePart.length >> 8) & 0xff, namePart.length & 0xff].concat(namePart);
        const extBlock = [(entry.length >> 8) & 0xff, entry.length & 0xff].concat(entry);
        for (const b of extBlock) ext.push(b);
        const extraExts = [
            0x00, 0x0a, 0x00, 0x06, 0x00, 0x04, 0x00, 0x1d, 0x00, 0x17,
            0x00, 0x0b, 0x00, 0x02, 0x01, 0x00,
            0x00, 0x0d, 0x00, 0x08, 0x00, 0x06, 0x04, 0x03, 0x08, 0x04, 0x04, 0x01,
        ];
        for (const b of extraExts) ext.push(b);
        body.push((ext.length >> 8) & 0xff, ext.length & 0xff);
        for (const b of ext) body.push(b);
        const out = [0x16, 0x03, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00];
        out[3] = ((body.length + 4) >> 8) & 0xff;
        out[4] = (body.length + 4) & 0xff;
        out[6] = (body.length >> 16) & 0xff;
        out[7] = (body.length >> 8) & 0xff;
        out[8] = body.length & 0xff;
        return new Uint8Array(out.concat(body));
    } catch (e) {
        return null;
    }
}

export async function probeRelayOnce(host, port, timeoutMs) {
    let sock = null;
    const PM = timeoutMs > 0 ? timeoutMs : 4000;
    try {
        const probePort = port || 443;
        sock = connect({ hostname: host, port: probePort });
        await withTimeout(sock.opened, PM, "probe-timeout");
        if (!RELAY_TLS_PORTS.has(String(probePort))) return true;
        const hello = buildProbeHello("cloudflare-dns.com");
        if (!hello) return false;
        const writer = sock.writable.getWriter();
        try {
            await withDeadline(writer.write(hello), PM, () => sock.close(), "probe-write");
        } finally {
            try { writer.releaseLock(); } catch (e) {}
        }
        const reader = sock.readable.getReader();
        try {
            const res = await withTimeout(reader.read(), PM, "probe-timeout");
            if (!res || res.done || !res.value) return false;
            const b = new Uint8Array(res.value);
            return b.length >= 2 && b[0] === 0x16 && b[1] === 0x03;
        } finally {
            try { reader.releaseLock(); } catch (e) {}
        }
    } catch (e) {
        return false;
    } finally {
        try { if (sock) sock.close(); } catch (e) {}
    }
}

export async function probeRelayVerdict(host, port) {
    try {
        if (await probeRelayOnce(host, port, 4000)) return true;
    } catch (e) {}
    try {
        return await probeRelayOnce(host, port, 7000);
    } catch (e) {
        return false;
    }
}

export function collectRelayInventory() {
    const out = new Map();
    const addRaw = (raw) => {
        try {
            String(raw || "")
                .split(/[\r\n,;]+/)
                .forEach((t) => {
                    const rk = relayKeyOf(t);
                    if (rk && !out.has(rk.key)) out.set(rk.key, { host: rk.host, port: rk.port });
                });
        } catch (e) {}
    };
    try {
        addRaw(state.sysConfig.backupRelay);
        addRaw(state.sysConfig.customRelay);
        (state.sysConfig.users || []).forEach((u) => {
            try { addRaw(u.proxyIp); } catch (e) {}
        });
    } catch (e) {}
    return Array.from(out.values());
}

export function pruneAutomationOff() {
    try {
        const v = state.sysConfig.autoPruneRelays;
        if (v === undefined || v === null) return false;
        const s = String(v).trim().toLowerCase();
        return s === "0" || s === "off" || s === "no" || s === "false";
    } catch (e) {
        return false;
    }
}

export async function loadRelayHealthSnapshot(env) {
    try {
        if (RELAY_SNAPSHOT_LOADED) return;
        if (RELAY_Q.size > 0) {
            RELAY_SNAPSHOT_LOADED = true;
            return;
        }
        const raw = await d1Get(env, "relay_health");
        if (!raw) return;
        const snap = JSON.parse(raw);
        const now = Date.now();
        const q = snap.q || {};
        for (const k of Object.keys(q)) {
            if (q[k] && q[k] > now && RELAY_Q.size < 2000)
                RELAY_Q.set(k, { fail: 0, until: q[k], probeFail: 0 });
        }
        RELAY_SNAPSHOT_LOADED = true;
    } catch (e) {}
}

export async function saveRelayHealthSnapshot(env) {
    try {
        if (Date.now() - lastHealthSave < PROBE_INTERVAL_MS) return;
        lastHealthSave = Date.now();
        const q = {};
        let active = 0;
        for (const [k, v] of RELAY_Q.entries()) {
            if (v && v.until && v.until > Date.now()) {
                q[k] = v.until;
                active++;
            }
        }
        if (active > 0) {
            const entries = Object.entries(q).sort((a, b) => a[1] - b[1]);
            let payload = JSON.stringify({ q });
            while (payload.length > 8000 && entries.length > 0) {
                delete q[entries.shift()[0]];
                payload = JSON.stringify({ q });
            }
            await d1Put(env, "relay_health", payload);
        }
    } catch (e) {}
}

export function relayHealthSnapshot() {
    const out = { quarantined: [], graveyard: [], aiQuarantine: [] };
    try {
        const now = Date.now();
        for (const [k, e] of RELAY_Q) {
            if (e && e.until && e.until > now) out.quarantined.push(k);
        }
    } catch (e) {}
    try {
        for (const [k, e] of AI_RELAY_Q) {
            if (e && e.until && Date.now() < e.until) out.aiQuarantine.push(k);
        }
    } catch (e) {}
    return out;
}

export async function relayHealthSnapshotAsync(env) {
    const out = relayHealthSnapshot();
    try {
        if (env && env.IOT_DB) {
            const g = JSON.parse((await d1Get(env, "relay_graveyard")) || "{}");
            for (const [k, e] of Object.entries(g || {})) {
                out.graveyard.push({
                    key: k,
                    streak: (e && e.healthyStreak) || 0,
                    unstable: !!(e && e.unstable),
                    lists: (e && e.lists && e.lists.length) || 0,
                });
            }
        }
    } catch (e) {}
    return out;
}

export async function probeDeadRelays(env) {
    try {
        if (pruneAutomationOff()) return;
        if (!env || !env.IOT_DB) return;
        await loadRelayHealthSnapshot(env);
        const lease = await acquireNahanRunnerLock(env, "dead_relays", PROBE_INTERVAL_MS);
        if (!lease) return;
        try {
            const now = Date.now();
            if (now - lastProbeTs < PROBE_INTERVAL_MS) return;
            lastProbeTs = now;
            const inv = collectRelayInventory();
            if (inv.length === 0) return;
            let cap = PROBE_MAX_PER_ROUND;
            if (breakerLevel() >= 1) cap = Math.max(1, Math.floor(cap / 2));
            const targets = [];
            for (let i = 0; i < cap && i < inv.length; i++) {
                targets.push(inv[(probeCursor + i) % inv.length]);
            }
            probeCursor = (probeCursor + cap) % inv.length;
            await Promise.all(
                targets.map(async (r) => {
                    const ok = await probeRelayVerdict(r.host, r.port);
                    if (ok) recordRelaySuccess(r.host, r.port, true);
                    else recordRelayFailure(r.host, r.port);
                }),
            );
            await saveRelayHealthSnapshot(env);
        } finally {
            await releaseNahanRunnerLock(env, lease);
        }
    } catch (e) {}
}

export async function resurrectRelay(env, key, entry) {
    lastResurrectChanged = false;
    try {
        const host = String(entry.host || "").toLowerCase();
        if (!host) return false;
        const port = entry.port || 443;
        let token = host + (port && port !== 443 ? ":" + port : "");
        if (entry.ai === true) token += "#AI";
        const addToken = (raw) => {
            const parts = String(raw || "").split(/[\r\n,;]+/).map((s) => s.trim()).filter(Boolean);
            for (const t of parts) {
                const rk = relayKeyOf(t);
                if (rk && rk.key === key) return String(raw || "");
            }
            return (raw && String(raw).trim() ? String(raw).replace(/,+$/, "") + "," : "") + token;
        };
        let restoreChanged = false;
        for (const l of entry.lists || []) {
            if (l === "global:backupRelay") {
                const after = addToken(state.sysConfig.backupRelay);
                if (after !== state.sysConfig.backupRelay) { state.sysConfig.backupRelay = after; restoreChanged = true; }
            } else if (l === "global:customRelay") {
                const after = addToken(state.sysConfig.customRelay);
                if (after !== state.sysConfig.customRelay) { state.sysConfig.customRelay = after; restoreChanged = true; }
            } else if (l.startsWith("user:")) {
                const nm = l.slice(5);
                const u = (state.sysConfig.users || []).find((x) => x && (x.name === nm || x.id === nm));
                if (u) {
                    const after = addToken(u.proxyIp);
                    if (after !== u.proxyIp) { u.proxyIp = after; restoreChanged = true; }
                }
            }
        }
        if (!restoreChanged) return true;
        await d1PutStrict(env, "sys_config", JSON.stringify(state.sysConfig));
        lastResurrectChanged = true;
        return true;
    } catch (e) {
        return false;
    }
}

export async function probeGraveyard(env) {
    try {
        if (pruneAutomationOff()) return;
        if (!env || !env.IOT_DB) return;
        const runnerLease = await acquireNahanRunnerLock(env, "graveyard", GRAVE_INTERVAL_MS);
        if (!runnerLease) return;
        try {
            const now = Date.now();
            if (now - lastGraveTs < GRAVE_INTERVAL_MS) return;
            lastGraveTs = now;
            let g = {};
            try { g = JSON.parse((await d1Get(env, "relay_graveyard")) || "{}"); } catch (e) { return; }
            const keys = Object.keys(g).slice(0, 200);
            keys.sort((a, b) => ((g[a] && g[a].buriedAt) || 0) - ((g[b] && g[b].buriedAt) || 0));
            if (keys.length === 0) return;
            let graveCap = GRAVE_MAX_PER_ROUND;
            if (breakerLevel() >= 1) graveCap = Math.max(1, Math.floor(graveCap / 2));
            const targets = [];
            for (let i = 0; i < graveCap && i < keys.length; i++) {
                targets.push(keys[(graveCursor + i) % keys.length]);
            }
            graveCursor = (graveCursor + graveCap) % keys.length;
            let dirty = false;
            for (const k of targets) {
                const entry = g[k];
                if (!entry || !entry.host) { delete g[k]; dirty = true; continue; }
                const ok = await probeRelayVerdict(entry.host, entry.port || 443);
                if (ok) {
                    entry.healthyStreak = (entry.healthyStreak || 0) + 1;
                    if (entry.healthyStreak >= GRAVE_HEALTHY_NEED) {
                        const okR = await resurrectRelay(env, k, entry);
                        if (okR) {
                            recordRelaySuccess(entry.host, entry.port || 443, true);
                            delete g[k];
                        }
                    }
                    dirty = true;
                } else {
                    entry.healthyStreak = 0;
                    dirty = true;
                }
            }
            if (dirty) await d1Put(env, "relay_graveyard", JSON.stringify(g));
        } finally {
            await releaseNahanRunnerLock(env, runnerLease);
        }
    } catch (e) {}
}
