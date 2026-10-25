/*
 * Project Nahan - System Configuration & State Management
 */

export const CURRENT_VERSION = "3.1.0";

export const getAlpha = () => String.fromCharCode(118, 108, 101, 115, 115); // vless
export const getBeta = () => String.fromCharCode(116, 114, 111, 106, 97, 110); // trojan
export const getGamma = () => String.fromCharCode(99, 108, 97, 115, 104); // clash

export const REQ_BYTES_EST = 1073741824 / 6000;

export const SYSTEM_DEFAULTS = {
    name: "",
    apiRoute: "sync",
    maintenanceHost: "https://www.ubuntu.com, https://www.docker.com",
    backupRelay: "",
    customRelay: "",
    masterKey: "admin",
    metricNode: "time.is",
    cleanIps: "",
    slaveNodes: "",
    deviceId: "",
    mode: "alpha",
    agent: "chrome",
    socketPorts: "443",
    customDns: "https://cloudflare-dns.com/dns-query",
    resolveIp: "1.1.1.1",
    cascade: "",
    enableOpt1: false,
    enableOpt2: false,
    tgToken: "",
    tgChatId: "",
    tgAdminId: "",
    cfAccountId: "",
    cfApiToken: "",
    cfWorkerName: "",
    isPaused: false,
    silentAlerts: false,
    githubRepo: "itsyebekhe/nahan",
    nameStrategy: "default",
    namePrefix: "Core",
    tgBotLang: "fa",
    users: [],
    subUserAgent: "",
    customPanelUrl: "",
    limitTotalReq: 0,
    expiryMs: 0,
    linkedPanels: [],
    hubPanelUrl: "",
    syncApiKey: "",
    panelApiKeys: [],
    nat64Prefix: "",
    enableDirectConfigs: false,
    customRouting: "",
    upstreamUri: "",
    autoUpdate: false,
    autoUpdateFormat: "encoded",
    fakeConfigs: [
        { name: "📊 {usage}", enabled: true },
        { name: "📅 {expiry}", enabled: true },
    ],
    maintenanceMode: false,
    allowRemoteDeploy: true,
    autoPruneRelays: true,
};

export const state = {
    sysConfig: { ...SYSTEM_DEFAULTS },
    isolateStartTime: 0,
    activeConnections: 0,
    INFLIGHT_HTTP: 0,
    OPEN_WS: 0,
    uuidUsage: new Map(),
    activeConns: new Map(),
    activeDeviceId: "",
    configRegistry: new Map(),
    trojanHashCache: new Map(),
    sysUsageCache: { users: {} },
    lastSysUsageSync: 0,
    sysConfigCacheTime: 0,
    sysUsageCacheTime: 0,
    backupIpCache: null,
    backupIpCacheTime: 0,
    lastRelaySweep: 0,
};

export const CACHE_TTL_CONFIG = 10000;
export const CACHE_TTL_USAGE = 10000;
export const CACHE_TTL_BACKUP_IP = 30000;

export const TCP_OPEN_TIMEOUT_MS = 5000;
export const TCP_WRITE_TIMEOUT_MS = 5000;
export const TCP_FIRST_READ_TIMEOUT_MS = 7000;
export const UPSTREAM_WRITE_TIMEOUT_MS = 15000;
export const NAHAN_RUNNER_LEASE_TTL_MS = 120000;
export const UPSTREAM_QUEUE_MAX_BYTES = 4 * 1024 * 1024;
export const UPSTREAM_QUEUE_MAX_ITEMS = 256;

export function breakerLevel() {
    try {
        if (state.INFLIGHT_HTTP > 200 || state.OPEN_WS > 400) return 2;
        if (state.INFLIGHT_HTTP > 100 || state.OPEN_WS > 200) return 1;
    } catch (e) {}
    return 0;
}

export function sleepMs(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

export function withTimeout(promise, ms, label) {
    let timer = null;
    const gate = new Promise((_, rej) => {
        timer = setTimeout(() => {
            try {
                rej(new Error(label || "timeout"));
            } catch (e) {}
        }, ms);
    });
    return Promise.race([promise, gate]).finally(() => {
        try {
            if (timer) clearTimeout(timer);
        } catch (e) {}
    });
}

export async function withDeadline(promise, timeoutMs, onTimeout, label = "operation") {
    let timer = null;
    let settled = false;
    const timeoutPromise = new Promise((_, reject) => {
        timer = setTimeout(() => {
            if (settled) return;
            try {
                if (typeof onTimeout === "function") onTimeout();
            } catch (e) {}
            reject(new Error(`${label}-timeout`));
        }, timeoutMs);
    });
    try {
        return await Promise.race([promise, timeoutPromise]);
    } finally {
        settled = true;
        if (timer) {
            try {
                clearTimeout(timer);
            } catch (e) {}
        }
    }
}

export async function fetchT(url, init = {}, timeoutMs = 10000) {
    const timeout = Math.max(1, Number(timeoutMs) || 10000);
    let controller = null;
    let timer = null;
    let callerSignal = null;
    let onCallerAbort = null;
    try {
        if (typeof AbortController !== "undefined") {
            controller = new AbortController();
            callerSignal = init && init.signal ? init.signal : null;
            if (callerSignal) {
                if (callerSignal.aborted) controller.abort(callerSignal.reason);
                else {
                    onCallerAbort = () => {
                        try {
                            controller.abort(callerSignal.reason);
                        } catch (e) {}
                    };
                    try {
                        callerSignal.addEventListener("abort", onCallerAbort, { once: true });
                    } catch (e) {}
                }
            }
            timer = setTimeout(() => {
                try {
                    controller.abort();
                } catch (e) {}
            }, timeout);
            return await fetch(url, { ...init, signal: controller.signal });
        }
        return await fetch(url, { ...init });
    } finally {
        if (timer) {
            try {
                clearTimeout(timer);
            } catch (e) {}
        }
        if (callerSignal && onCallerAbort) {
            try {
                callerSignal.removeEventListener("abort", onCallerAbort);
            } catch (e) {}
        }
    }
}

export function usageTotalBytes(u) {
    try {
        if (!u) return 0;
        if (typeof u.bytes === "number" && u.bytes >= 0) return Math.floor(u.bytes);
        return Math.floor((u.reqs || 0) * REQ_BYTES_EST);
    } catch (e) {
        return 0;
    }
}

export function usageDailyBytes(u, today) {
    try {
        if (!u) return 0;
        const day = today || new Date().toISOString().split("T")[0];
        if ((u.lastDay || "") !== day) return 0;
        if (typeof u.dBytes === "number" && u.dBytes >= 0) return Math.floor(u.dBytes);
        return Math.floor((u.dReqs || 0) * REQ_BYTES_EST);
    } catch (e) {
        return 0;
    }
}

export function limitReqToBytes(limitReq) {
    try {
        return limitReq ? Math.floor(limitReq * REQ_BYTES_EST) : 0;
    } catch (e) {
        return 0;
    }
}

export function getTransportParams(port) {
    return ["80", "8080", "8880", "2052", "2082", "2086", "2095"].includes(port.toString())
        ? "none"
        : "tls";
}
