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
import { getSubscriptionHtml } from "./src/subscriptionHtml.js";

function resolveSubscriptionTarget(reqPath, routeBase, url, sysConfig) {
    let targetSub = url.searchParams.get("sub") || url.searchParams.get("user") || url.searchParams.get("token") || url.searchParams.get("id");

    const cleanPath = reqPath.endsWith(".html") ? reqPath.slice(0, -5) : reqPath;

    const isSubPath =
        reqPath === routeBase ||
        cleanPath === "/sub" ||
        cleanPath === "/subscription" ||
        cleanPath === `${routeBase}/sub` ||
        cleanPath.startsWith("/sub/") ||
        cleanPath.startsWith("/subscription/") ||
        cleanPath.startsWith(`${routeBase}/sub/`);

    if (!targetSub) {
        if (cleanPath.startsWith(`${routeBase}/sub/`)) {
            targetSub = decodeURIComponent(cleanPath.slice(`${routeBase}/sub/`.length));
        } else if (cleanPath.startsWith("/sub/")) {
            targetSub = decodeURIComponent(cleanPath.slice(5));
        } else if (cleanPath.startsWith("/subscription/")) {
            targetSub = decodeURIComponent(cleanPath.slice(14));
        } else if (cleanPath.startsWith(`${routeBase}/`)) {
            const remainder = decodeURIComponent(cleanPath.slice(routeBase.length + 1));
            if (!remainder.startsWith("dash") && !remainder.startsWith("api") && !remainder.startsWith("tg")) {
                targetSub = remainder;
            }
        } else if (cleanPath.length > 1 && cleanPath !== "/" && !cleanPath.includes(".")) {
            const remainder = decodeURIComponent(cleanPath.slice(1));
            if (Array.isArray(sysConfig.users)) {
                const match = sysConfig.users.find(
                    (u) =>
                        u.name.toLowerCase() === remainder.toLowerCase() ||
                        u.id.toLowerCase() === remainder.toLowerCase() ||
                        u.id.replace(/-/g, "").toLowerCase() === remainder.replace(/-/g, "").toLowerCase(),
                );
                if (match) targetSub = match.name;
            }
        }
    }

    return { isSubRoute: isSubPath || Boolean(targetSub), targetSub };
}


async function renderSubscriberPortal(request, url, targetUser, clientHost, env) {
    let html = "";
    if (env.SUBSCRIPTION_URL) {
        try {
            const resp = await fetchT(env.SUBSCRIPTION_URL, {}, 4000);
            if (resp.ok) html = await resp.text();
        } catch (e) {}
    }
    if (!html) {
        html = getSubscriptionHtml();
    }
    if (!html && env.ASSETS) {
        try {
            const assetResp = await env.ASSETS.fetch(new Request(new URL("/subscription.html", url)));
            if (assetResp.status < 400) html = await assetResp.text();
        } catch (e) {}
    }

    const userName = targetUser.name || "Default";
    const userId = targetUser.id || state.activeDeviceId || "00000000-0000-0000-0000-000000000000";
    const idClean = userId.replace(/-/g, "").toLowerCase();

    const sysU = state.sysUsageCache?.users?.[idClean] || { reqs: 0, dReqs: 0, lastDay: "" };
    const todayStr = new Date().toISOString().split("T")[0];
    const totalBytesUsed = usageTotalBytes(sysU);
    const dailyBytesUsed = usageDailyBytes(sysU, todayStr);

    const limitTotalBytes = limitReqToBytes(targetUser.limitTotalReq || 0);
    const limitDailyBytes = limitReqToBytes(targetUser.limitDailyReq || 0);

    const totalGbStr = (totalBytesUsed / 1073741824).toFixed(2);
    const limitTotalGbStr = targetUser.limitTotalReq ? (limitTotalBytes / 1073741824).toFixed(2) : "Unlimited";

    const dailyGbStr = (dailyBytesUsed / 1073741824).toFixed(2);
    const limitDailyGbStr = targetUser.limitDailyReq ? (limitDailyBytes / 1073741824).toFixed(2) : "Unlimited";

    let expiryDateStr = "Unlimited";
    let isExpired = false;
    if (targetUser.expiryMs) {
        const expDate = new Date(targetUser.expiryMs);
        expiryDateStr = expDate.toISOString().split("T")[0] + " " + expDate.toTimeString().split(" ")[0].slice(0, 5);
        if (Date.now() > targetUser.expiryMs) {
            isExpired = true;
        }
    }

    let statusCode = "active";
    if (targetUser.isPaused && targetUser.disabledReason) {
        const r = targetUser.disabledReason.toLowerCase();
        if (r.includes("daily")) statusCode = "dailyLimit";
        else if (r.includes("traffic") || r.includes("quota") || r.includes("limit")) statusCode = "limit";
        else if (r.includes("expir")) statusCode = "expired";
        else statusCode = "paused";
    } else if (targetUser.isPaused) {
        statusCode = "paused";
    } else if (isExpired) {
        statusCode = "expired";
    } else if (targetUser.limitTotalReq && totalBytesUsed >= limitTotalBytes) {
        statusCode = "limit";
    } else if (targetUser.limitDailyReq && dailyBytesUsed >= limitDailyBytes) {
        statusCode = "dailyLimit";
    }

    let totalProgressHtml = "";
    if (targetUser.limitTotalReq && limitTotalBytes > 0) {
        const totalPercent = Math.min(100, Math.max(0, (totalBytesUsed / limitTotalBytes) * 100));
        const totalColor = totalPercent > 90 ? "var(--color-danger)" : (totalPercent > 75 ? "var(--color-warning)" : "var(--color-primary)");
        const remainingTotalGb = (Math.max(0, limitTotalBytes - totalBytesUsed) / 1073741824).toFixed(2);
        totalProgressHtml = `
            <div class="progress-bar-bg w-full">
                <div class="h-full transition-all duration-300" style="width: ${totalPercent.toFixed(1)}%; background: ${totalColor};"></div>
            </div>
            <div class="flex justify-between items-center text-[10px] text-muted font-mono mt-1.5">
                <span>${totalPercent.toFixed(1)}% Used</span>
                <span>${remainingTotalGb} GB left</span>
            </div>`;
    } else {
        totalProgressHtml = `
            <div class="progress-bar-bg w-full">
                <div class="h-full" style="width: 100%; background: var(--color-primary);"></div>
            </div>
            <div class="flex justify-between items-center text-[10px] text-muted font-mono mt-1.5">
                <span data-i18n="unlimitedPlan">Unlimited Plan</span>
                <span>0.00 / ∞ GB</span>
            </div>`;
    }

    let dailyProgressHtml = "";
    if (targetUser.limitDailyReq && limitDailyBytes > 0) {
        const dailyPercent = Math.min(100, Math.max(0, (dailyBytesUsed / limitDailyBytes) * 100));
        const dailyColor = dailyPercent > 90 ? "var(--color-danger)" : (dailyPercent > 75 ? "var(--color-warning)" : "var(--color-success)");
        const remainingDailyGb = (Math.max(0, limitDailyBytes - dailyBytesUsed) / 1073741824).toFixed(2);
        dailyProgressHtml = `
            <div class="progress-bar-bg w-full">
                <div class="h-full transition-all duration-300" style="width: ${dailyPercent.toFixed(1)}%; background: ${dailyColor};"></div>
            </div>
            <div class="flex justify-between items-center text-[10px] text-muted font-mono mt-1.5">
                <span>${dailyPercent.toFixed(1)}% Today</span>
                <span>${remainingDailyGb} GB left</span>
            </div>`;
    } else {
        dailyProgressHtml = `
            <div class="progress-bar-bg w-full">
                <div class="h-full" style="width: 100%; background: var(--color-success);"></div>
            </div>
            <div class="flex justify-between items-center text-[10px] text-muted font-mono mt-1.5">
                <span data-i18n="noDailyLimit">No Daily Limit</span>
                <span>Active Today</span>
            </div>`;
    }

    const proto = url.protocol || "https:";
    const syncBase = `${proto}//${clientHost}/${encodeURI(state.sysConfig.apiRoute)}`;
    const hasUsers = Array.isArray(state.sysConfig.users) && state.sysConfig.users.length > 0;
    const syncNormal = (targetUser.name === "Default" && !hasUsers)
        ? syncBase
        : `${syncBase}?sub=${encodeURIComponent(targetUser.name || targetUser.id)}`;
    const syncNormalBase64 = safeBtoa(syncNormal);
    const syncRaw = `${syncNormal}${syncNormal.includes("?") ? "&" : "?"}flag=raw`;

    const rendered = html
        .replace(/__USER_NAME__/g, userName)
        .replace(/__USER_ID__/g, userId)
        .replace(/__EXPIRY_DATE__/g, expiryDateStr)
        .replace(/__STATUS_CODE__/g, statusCode)
        .replace(/__TOTAL_GB__/g, totalGbStr)
        .replace(/__LIMIT_TOTAL_GB__/g, limitTotalGbStr)
        .replace(/__LIMIT_GB__/g, limitTotalGbStr)
        .replace(/__TOTAL_PROGRESS__/g, totalProgressHtml)
        .replace(/__DAILY_GB__/g, dailyGbStr)
        .replace(/__LIMIT_DAILY_GB__/g, limitDailyGbStr)
        .replace(/__DAILY_PROGRESS__/g, dailyProgressHtml)
        .replace(/__SYNC_NORMAL_BASE64__/g, syncNormalBase64)
        .replace(/__SYNC_NORMAL__/g, syncNormal)
        .replace(/__SYNC_RAW__/g, syncRaw);

    return new Response(rendered, {
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-store, no-cache, must-revalidate",
        },
    });
}

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
            const { isSubRoute, targetSub } = resolveSubscriptionTarget(reqPath, routeBase, url, state.sysConfig);
            const isAuthorizedRoute =
                isSubRoute ||
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
                    let html = "";
                    if (env.DASHBOARD_URL) {
                        try {
                            const resp = await fetchT(env.DASHBOARD_URL, {}, 4000);
                            if (resp.ok) html = await resp.text();
                        } catch (e) {}
                    }
                    if (!html && env.ASSETS) {
                        try {
                            const assetResp = await env.ASSETS.fetch(new Request(new URL("/dashboard.html", url)));
                            if (assetResp.status < 400) html = await assetResp.text();
                        } catch (e) {}
                    }
                    if (!html) {
                        try {
                            const fallbackUrl = "https://raw.githubusercontent.com/itsyebekhe/nahan/main/dashboard.html";
                            const resp = await fetchT(fallbackUrl, {}, 5000);
                            if (resp.ok) html = await resp.text();
                        } catch (e) {}
                    }
                    if (html) {
                        html = html.replace(/__CURRENT_VERSION__/g, CURRENT_VERSION);
                        html = html.replace("__HAS_DB_WARNING__", env.IOT_DB !== undefined ? "" : '<div class="mb-5 p-4 rounded-2xl flex items-start gap-3" style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);"><span style="color:#f87171;">⚠️</span><span class="text-sm" style="color:#fca5a5;">Database not connected. Settings won\'t be saved.</span></div>');
                        return new Response(html, { headers: { "Content-Type": "text/html;charset=utf-8" } });
                    }
                    return new Response("Failed to load dashboard", { status: 502 });
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

                if (isSubRoute) {
                    const ua = (request.headers.get("User-Agent") || "").toLowerCase();
                    const clientHost = request.headers.get("Host") || url.hostname;
                    const hasMultiUser = Array.isArray(state.sysConfig.users) && state.sysConfig.users.length > 0;
                    let targetUser = null;
                    let isValidUser = false;

                    if (hasMultiUser) {
                        if (targetSub) {
                            const cleanSub = targetSub.trim();
                            targetUser = state.sysConfig.users.find(
                                (u) =>
                                    u.name.toLowerCase() === cleanSub.toLowerCase() ||
                                    u.id.toLowerCase() === cleanSub.toLowerCase() ||
                                    u.id.replace(/-/g, "").toLowerCase() === cleanSub.replace(/-/g, "").toLowerCase(),
                            );
                            if (targetUser) isValidUser = true;
                        }
                        if (!targetUser && state.sysConfig.users.length === 1) {
                            targetUser = state.sysConfig.users[0];
                            isValidUser = true;
                        }
                    } else {
                        isValidUser = true;
                        targetUser = { id: state.activeDeviceId, name: "Default" };
                    }

                    const flag = (url.searchParams.get("flag") || url.searchParams.get("format") || "").toLowerCase();
                    const acceptHeader = (request.headers.get("Accept") || "").toLowerCase();
                    const secFetchDest = (request.headers.get("Sec-Fetch-Dest") || "").toLowerCase();

                    const isExplicitFormat = Boolean(flag);
                    const isClientAgent =
                        ua.includes("clash") ||
                        ua.includes("sing-box") ||
                        ua.includes("singbox") ||
                        ua.includes("hiddify") ||
                        ua.includes("v2ray") ||
                        ua.includes("shadowrocket") ||
                        ua.includes("streisand") ||
                        ua.includes("meta") ||
                        ua.includes("mihomo") ||
                        ua.includes(getGamma());

                    const isRealBrowser =
                        !isExplicitFormat &&
                        !isClientAgent &&
                        (secFetchDest === "document" || acceptHeader.includes("text/html") || ua.includes("mozilla") || ua.includes("chrome") || ua.includes("safari"));

                    if (isRealBrowser || flag === "html" || url.searchParams.get("view") === "html") {
                        if (isValidUser || (hasMultiUser && !targetUser)) {
                            const effectiveUser = targetUser || state.sysConfig.users[0];
                            return await renderSubscriberPortal(request, url, effectiveUser, clientHost, env);
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

                    if (flag === "json" || flag === "info") {
                        const userName = targetUser?.name || "Default";
                        const userId = targetUser?.id || state.activeDeviceId || "00000000-0000-0000-0000-000000000000";
                        const idClean = userId.replace(/-/g, "").toLowerCase();
                        const sysU = state.sysUsageCache?.users?.[idClean] || { reqs: 0, dReqs: 0, lastDay: "" };
                        const todayStr = new Date().toISOString().split("T")[0];
                        const totalBytesUsed = usageTotalBytes(sysU);
                        const dailyBytesUsed = usageDailyBytes(sysU, todayStr);
                        const limitTotalBytes = limitReqToBytes(targetUser?.limitTotalReq || 0);
                        const limitDailyBytes = limitReqToBytes(targetUser?.limitDailyReq || 0);
                        const proto = url.protocol || "https:";
                        const syncBase = `${proto}//${clientHost}/${encodeURI(state.sysConfig.apiRoute)}`;
                        const hasUsers = Array.isArray(state.sysConfig.users) && state.sysConfig.users.length > 0;
                        const syncNormal = (targetUser?.name === "Default" && !hasUsers)
                            ? syncBase
                            : `${syncBase}?sub=${encodeURIComponent(targetUser?.name || targetUser?.id || "")}`;
                        const syncRaw = `${syncNormal}${syncNormal.includes("?") ? "&" : "?"}flag=raw`;

                        let expiryDateStr = "Unlimited";
                        if (targetUser?.expiryMs) {
                            const expDate = new Date(targetUser.expiryMs);
                            expiryDateStr = expDate.toISOString().split("T")[0] + " " + expDate.toTimeString().split(" ")[0].slice(0, 5);
                        }

                        return new Response(JSON.stringify({
                            userName,
                            userId,
                            totalGb: (totalBytesUsed / 1073741824).toFixed(2),
                            limitTotalGb: targetUser?.limitTotalReq ? (limitTotalBytes / 1073741824).toFixed(2) : "Unlimited",
                            dailyGb: (dailyBytesUsed / 1073741824).toFixed(2),
                            limitDailyGb: targetUser?.limitDailyReq ? (limitDailyBytes / 1073741824).toFixed(2) : "Unlimited",
                            expiryDate: expiryDateStr,
                            statusCode: targetUser?.isPaused ? "paused" : "active",
                            syncNormal,
                            syncRaw,
                            syncNormalBase64: safeBtoa(syncNormal)
                        }), { headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" } });
                    }

                    let isClashYaml = flag === "clash" || flag === "yaml" || flag === "meta";
                    let isSingboxJson = flag === "sing" || flag === "singbox" || flag === "sing-box" || flag === "sb";
                    let isClashJson = flag === "clash-json" || flag === "b";
                    let isVJson = flag === "vjson" || flag === "v";
                    let isRaw = flag === "raw" || flag === "text" || flag === "uri";

                    if (!isClashYaml && !isSingboxJson && !isClashJson && !isVJson && !isRaw) {
                        if (ua.includes(getGamma()) || ua.includes("meta") || ua.includes("mihomo")) isClashYaml = true;
                        else if (ua.includes("sing-box") || ua.includes("singbox") || ua.includes("hiddify")) isSingboxJson = true;
                    }

                    const subParam = targetUser?.name || targetSub;

                    if (isClashYaml) {
                        resHeaders.set("Content-Type", "text/yaml; charset=utf-8");
                        return new Response(await buildYamlProfile(clientHost, subParam, allowInsecure), { headers: resHeaders });
                    } else if (isSingboxJson) {
                        resHeaders.set("Content-Type", "application/json; charset=utf-8");
                        return new Response(JSON.stringify(await buildSingBoxJsonProfile(clientHost, subParam, allowInsecure), null, 2), { headers: resHeaders });
                    } else if (isClashJson) {
                        resHeaders.set("Content-Type", "application/json; charset=utf-8");
                        return new Response(JSON.stringify(await buildClashJsonProfile(clientHost, subParam, allowInsecure), null, 2), { headers: resHeaders });
                    } else if (isVJson) {
                        resHeaders.set("Content-Type", "application/json; charset=utf-8");
                        return new Response(JSON.stringify(await buildVJsonProfile(clientHost, subParam, allowInsecure), null, 2), { headers: resHeaders });
                    } else if (isRaw) {
                        resHeaders.set("Content-Type", "text/plain; charset=utf-8");
                        return new Response(await buildUriProfile(clientHost, subParam, allowInsecure), { headers: resHeaders });
                    } else {
                        resHeaders.set("Content-Type", "text/plain; charset=utf-8");
                        return new Response(safeBtoa(await buildUriProfile(clientHost, subParam, allowInsecure)), { headers: resHeaders });
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