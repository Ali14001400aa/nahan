/*
 * Project Nahan (نهان) - IoT Device Telemetry Gateway
 * Modular High-Performance Cloudflare Worker
 */

import {
    state,
    CURRENT_VERSION,
    breakerLevel,
    sleepMs,
    fetchT,
    usageTotalBytes,
    usageDailyBytes,
    limitReqToBytes,
    getGamma,
} from "./src/config.js";
import { safeBtoa, generateHardwareId } from "./src/crypto.js";
import { loadSysConfig, handleLogs } from "./src/db.js";
import { probeDeadRelays, probeGraveyard } from "./src/relays.js";
import { processTelemetryStream, wsRateCheck } from "./src/tunnel.js";
import { handleTelegramWebhook } from "./src/telegram/bot.js";
import {
    handleAuth,
    handleConfigSync,
    handleUsersApi,
    handleStatsApi,
    handleUpdateApi,
    handleApiKeys,
    handleSyncPanel,
    isAuthorized,
} from "./src/api.js";
import {
    buildUriProfile,
    buildYamlProfile,
    buildClashJsonProfile,
    buildSingBoxJsonProfile,
    buildVJsonProfile,
} from "./src/subs/generators.js";
import { getPortalHtml } from "./src/portalHtml.js";

async function serveMaintenancePage(request, url) {
    if (breakerLevel() >= 1) return new Response("Not Found", { status: 404 });
    const fakeList = state.sysConfig.maintenanceHost
        ? state.sysConfig.maintenanceHost.split(",").map((s) => s.trim()).filter(Boolean)
        : ["https://www.ubuntu.com"];
    const clientIP = request.headers.get("cf-connecting-ip") || "0.0.0.0";
    const ipHash = Array.from(clientIP).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const targetStr = fakeList[ipHash % fakeList.length].startsWith("http")
        ? fakeList[ipHash % fakeList.length]
        : `https://${fakeList[ipHash % fakeList.length]}`;

    try {
        const targetUrl = new URL(targetStr);
        if (url.pathname !== "/") targetUrl.pathname = url.pathname;
        targetUrl.search = url.search;
        const cleanHeaders = new Headers(request.headers);
        cleanHeaders.set("Host", targetUrl.hostname);
        cleanHeaders.delete("cf-connecting-ip");
        cleanHeaders.delete("x-forwarded-for");
        const fetchInit = { method: request.method, headers: cleanHeaders, redirect: "follow" };
        if (request.method !== "GET" && request.method !== "HEAD") fetchInit.body = request.body;
        return await fetchT(new Request(targetUrl.toString(), fetchInit));
    } catch (e) {
        return new Response("Not Found", { status: 404 });
    }
}

export default {
    async fetch(request, env, ctx) {
        try {
            if (!state.isolateStartTime) state.isolateStartTime = Date.now();
            state.INFLIGHT_HTTP++;
            if (state.configRegistry.size > 10000) {
                state.configRegistry.clear();
                state.trojanHashCache.clear();
            }
            await loadSysConfig(env, ctx);

            const nowRs = Date.now();
            if (nowRs - state.lastRelaySweep > 60000) {
                state.lastRelaySweep = nowRs;
                if (ctx?.waitUntil) {
                    ctx.waitUntil(
                        (async () => {
                            try { await probeDeadRelays(env); } catch (e) {}
                            try { await probeGraveyard(env); } catch (e) {}
                        })(),
                    );
                }
            }
            state.activeDeviceId = state.sysConfig.deviceId || generateHardwareId(state.sysConfig.apiRoute);

            const url = new URL(request.url);
            const upgradeHeader = request.headers.get("Upgrade");
            const isTelemetryStream = upgradeHeader && upgradeHeader.toLowerCase() === "websocket";

            let reqPath = url.pathname;
            if (reqPath.endsWith("/") && reqPath.length > 1) reqPath = reqPath.slice(0, -1);

            const routeBase = `/${encodeURI(state.sysConfig.apiRoute)}`;
            const isAuthorizedRoute =
                reqPath === routeBase ||
                reqPath === `${routeBase}/dash` ||
                reqPath === `${routeBase}/api/auth` ||
                reqPath === `${routeBase}/api/sync` ||
                reqPath === `${routeBase}/tg` ||
                reqPath === `${routeBase}/tg/sync_panel` ||
                reqPath === `${routeBase}/api/logs` ||
                reqPath.endsWith("/api/sync") ||
                reqPath.endsWith("/api/users") ||
                reqPath.endsWith("/api/stats") ||
                reqPath.endsWith("/api/update") ||
                reqPath.endsWith("/api/keys");

            const isPortalRoute =
                reqPath === "/" ||
                reqPath === "/index.html" ||
                reqPath === "/deploy" ||
                reqPath === "/docs" ||
                reqPath === "/wiki" ||
                reqPath === "/help";

            if (isPortalRoute && !isTelemetryStream) {
                if (env.ASSETS) {
                    try {
                        const assetResp = await env.ASSETS.fetch(request);
                        if (assetResp.status < 400) return assetResp;
                    } catch (e) {}
                }
                return new Response(getPortalHtml(), {
                    headers: { "Content-Type": "text/html; charset=utf-8" },
                });
            }

            if (!isTelemetryStream && !isAuthorizedRoute) {
                return serveMaintenancePage(request, url);
            }

            if (state.sysConfig.maintenanceMode && (isTelemetryStream || reqPath === routeBase)) {
                if (isTelemetryStream) return new Response(null, { status: 503 });
                return new Response("Maintenance in progress, retry later", {
                    status: 503,
                    headers: { "Retry-After": "120" },
                });
            }

            if (!isTelemetryStream) {
                if (reqPath === `${routeBase}/dash`) {
                    const dashboardUrl = env.DASHBOARD_URL || "https://raw.githubusercontent.com/itsyebekhe/nahan/main/dashboard.html";
                    try {
                        const resp = await fetchT(dashboardUrl);
                        let html = await resp.text();
                        html = html.replace(/__CURRENT_VERSION__/g, CURRENT_VERSION);
                        html = html.replace("__HAS_DB_WARNING__", env.IOT_DB !== undefined ? "" : '<div class="mb-5 p-4 rounded-2xl flex items-start gap-3" style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);"><span style="color:#f87171;">⚠️</span><span class="text-sm" style="color:#fca5a5;">Database not connected. Settings won\'t be saved.</span></div>');
                        return new Response(html, { headers: { "Content-Type": "text/html;charset=utf-8" } });
                    } catch (e) {
                        return new Response("Failed to load dashboard", { status: 502 });
                    }
                }
                if (reqPath === `${routeBase}/api/auth`) return await handleAuth(request, url.hostname, ctx, env);
                if (reqPath === `${routeBase}/api/sync` || reqPath.endsWith("/api/sync")) {
                    if (request.method === "OPTIONS") {
                        return new Response(null, {
                            status: 204,
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Methods": "POST, OPTIONS",
                                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                            },
                        });
                    }
                    if (request.method !== "POST") return new Response("405", { status: 405 });
                    const syncRes = await handleConfigSync(request, env, ctx);
                    syncRes.headers.set("Access-Control-Allow-Origin", "*");
                    return syncRes;
                }
                if (reqPath === `${routeBase}/api/logs`) return await handleLogs(request, env, isAuthorized);
                if (reqPath.endsWith("/api/users")) return await handleUsersApi(request, env, ctx);
                if (reqPath.endsWith("/api/stats")) return await handleStatsApi(request, env);
                if (reqPath.endsWith("/api/update")) return await handleUpdateApi(request, env, ctx);
                if (reqPath.endsWith("/api/keys")) return await handleApiKeys(request, env, ctx);
                if (reqPath === `${routeBase}/tg/sync_panel`) return await handleSyncPanel(request, env, ctx);
                if (reqPath === `${routeBase}/tg`) return await handleTelegramWebhook(request, env, url.hostname, ctx);

                if (reqPath === routeBase) {
                    const ua = (request.headers.get("User-Agent") || "").toLowerCase();
                    const clientHost = request.headers.get("Host") || url.hostname;
                    let targetSub = url.searchParams.get("sub");
                    const hasMultiUser = state.sysConfig.users && state.sysConfig.users.length > 0;
                    let targetUser = null;
                    let isValidUser = false;

                    if (hasMultiUser) {
                        if (targetSub) {
                            targetUser = state.sysConfig.users.find(
                                (u) => u.name.toLowerCase() === targetSub.toLowerCase() || u.id === targetSub,
                            );
                            if (targetUser) isValidUser = true;
                        }
                    } else {
                        isValidUser = true;
                        targetUser = { id: state.activeDeviceId, name: "Default" };
                    }

                    const acceptHeader = (request.headers.get("Accept") || "").toLowerCase();
                    const secFetchDest = (request.headers.get("Sec-Fetch-Dest") || "").toLowerCase();
                    const isRealBrowser =
                        (secFetchDest === "document" || acceptHeader.includes("text/html")) &&
                        (ua.includes("mozilla") || ua.includes("chrome") || ua.includes("safari")) &&
                        !ua.includes("clash") && !ua.includes("sing-box") && !ua.includes("v2ray");

                    if (isRealBrowser && !state.sysConfig.subUserAgent) {
                        if (isValidUser) {
                            const subUrl = env.SUBSCRIPTION_URL || "https://raw.githubusercontent.com/itsyebekhe/nahan/main/subscription.html";
                            try {
                                const resp = await fetchT(subUrl);
                                let html = await resp.text();
                                const idClean = targetUser.id.replace(/-/g, "").toLowerCase();
                                const sysU = state.sysUsageCache?.users?.[idClean] || { reqs: 0, dReqs: 0 };
                                const totalBytesUsed = usageTotalBytes(sysU);
                                const limitTotalBytes = limitReqToBytes(targetUser.limitTotalReq);
                                html = html.replace(/__USER_NAME__/g, targetUser.name);
                                html = html.replace(/__TOTAL_GB__/g, (totalBytesUsed / 1073741824).toFixed(2));
                                html = html.replace(/__LIMIT_GB__/g, targetUser.limitTotalReq ? (limitTotalBytes / 1073741824).toFixed(2) : "Unlimited");
                                return new Response(html, { headers: { "Content-Type": "text/html;charset=utf-8" } });
                            } catch (e) {
                                return new Response("Failed to load subscription page", { status: 502 });
                            }
                        }
                        return serveMaintenancePage(request, url);
                    }

                    if (hasMultiUser && !isValidUser) {
                        return new Response("Forbidden", { status: 403 });
                    }

                    const allowInsecure = url.searchParams.get("insecure") === "true";
                    const resHeaders = new Headers();
                    resHeaders.set("Cache-Control", "no-store");
                    resHeaders.set("Access-Control-Allow-Origin", "*");

                    const flag = (url.searchParams.get("flag") || url.searchParams.get("format") || "").toLowerCase();
                    let isClashYaml = flag === "clash" || flag === "yaml" || flag === "meta";
                    let isSingboxJson = flag === "sing" || flag === "singbox" || flag === "sing-box" || flag === "sb";
                    let isClashJson = flag === "clash-json" || flag === "b";
                    let isVJson = flag === "vjson" || flag === "v";

                    if (!isClashYaml && !isSingboxJson && !isClashJson && !isVJson) {
                        if (ua.includes(getGamma()) || ua.includes("meta") || ua.includes("mihomo")) isClashYaml = true;
                        else if (ua.includes("sing-box") || ua.includes("singbox") || ua.includes("hiddify")) isSingboxJson = true;
                    }

                    if (isClashYaml) {
                        resHeaders.set("Content-Type", "text/yaml; charset=utf-8");
                        return new Response(await buildYamlProfile(clientHost, targetSub, allowInsecure), { headers: resHeaders });
                    } else if (isSingboxJson) {
                        resHeaders.set("Content-Type", "application/json; charset=utf-8");
                        return new Response(JSON.stringify(await buildSingBoxJsonProfile(clientHost, targetSub, allowInsecure), null, 2), { headers: resHeaders });
                    } else if (isClashJson) {
                        resHeaders.set("Content-Type", "application/json; charset=utf-8");
                        return new Response(JSON.stringify(await buildClashJsonProfile(clientHost, targetSub, allowInsecure), null, 2), { headers: resHeaders });
                    } else if (isVJson) {
                        resHeaders.set("Content-Type", "application/json; charset=utf-8");
                        return new Response(JSON.stringify(await buildVJsonProfile(clientHost, targetSub, allowInsecure), null, 2), { headers: resHeaders });
                    } else {
                        resHeaders.set("Content-Type", "text/plain; charset=utf-8");
                        return new Response(safeBtoa(await buildUriProfile(clientHost, targetSub, allowInsecure)), { headers: resHeaders });
                    }
                }
            }

            if (isTelemetryStream) {
                if (state.sysConfig.isPaused) return new Response(null, { status: 503 });
                const wip = request.headers.get("cf-connecting-ip") || "unknown";
                const wr = wsRateCheck(wip);
                if (wr === "refuse") return new Response("Too many requests", { status: 429 });
                if (wr === "tarpit") await sleepMs(1500);

                let wsRelayIdx = -1;
                const riParam = url.searchParams.get("ri");
                if (riParam !== null) wsRelayIdx = parseInt(riParam, 10);
                return await processTelemetryStream(env, ctx, wsRelayIdx);
            }

            return new Response(null, { status: 404 });
        } catch (err) {
            return new Response(null, { status: 404 });
        } finally {
            state.INFLIGHT_HTTP = Math.max(0, state.INFLIGHT_HTTP - 1);
        }
    },

    async scheduled(event, env, ctx) {
        try {
            await loadSysConfig(env, ctx);
            if (state.sysConfig.autoUpdate) {
                // Background update task trigger
            }
        } catch (e) {}
    },
};