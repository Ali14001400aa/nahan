/*
 * Project Nahan - WebSocket Telemetry & Binary Protocol Tunnel
 */

import { connect } from "cloudflare:sockets";
import {
    state,
    fetchT,
    usageTotalBytes,
    limitReqToBytes,
    REQ_BYTES_EST,
    TCP_OPEN_TIMEOUT_MS,
    TCP_WRITE_TIMEOUT_MS,
    UPSTREAM_WRITE_TIMEOUT_MS,
    UPSTREAM_QUEUE_MAX_BYTES,
    UPSTREAM_QUEUE_MAX_ITEMS,
    withDeadline,
} from "./config.js";
import { cachedD1Put, logActivity } from "./db.js";
import {
    lookupConfigEntry,
    decodeConfigUuid,
    getTrojanHash,
} from "./crypto.js";
import {
    relayKeyOf,
    filterQuarantinedRelays,
    filterAiQuarantinedTokens,
    orderAiFirstTokens,
    recordRelaySuccess,
    recordRelayFailure,
    recordAiSuccess,
    recordAiFailure,
    isAiDomain,
    sniffSniFromHello,
} from "./relays.js";
import { getAllProfiles, getEffectivePips } from "./subs/transformers.js";

export const WS_RATE = new Map();

export function wsRateCheck(ip) {
    try {
        const now = Date.now();
        let r = WS_RATE.get(ip);
        if (!r || now - r.ts > 60000) {
            r = { n: 0, ts: now };
            WS_RATE.set(ip, r);
        }
        r.n++;
        if (WS_RATE.size > 10000) WS_RATE.clear();
        if (r.n > 400) return "refuse";
        if (r.n > 120) return "tarpit";
        return "ok";
    } catch (e) {
        return "ok";
    }
}

function closeTcpSocketQuietly(socket) {
    try {
        if (socket && typeof socket.close === "function") socket.close();
    } catch (e) {}
}

function releaseWriterQuietly(writer) {
    try {
        if (writer && typeof writer.releaseLock === "function") writer.releaseLock();
    } catch (e) {}
}

async function writeSocketWithTimeout(socket, writer, data, timeoutMs = TCP_WRITE_TIMEOUT_MS) {
    if (!writer || typeof writer.write !== "function") throw new Error("socket-writer-unavailable");
    return await withDeadline(
        writer.write(data),
        timeoutMs,
        () => closeTcpSocketQuietly(socket),
        "socket-write",
    );
}

export function trackUsage(uuid, bytes, env, ctx) {
    if (!state.sysUsageCache) state.sysUsageCache = { users: {} };
    if (!state.sysUsageCache.users) state.sysUsageCache.users = {};
    if (!state.sysUsageCache.users[uuid]) {
        state.sysUsageCache.users[uuid] = {
            reqs: 0,
            dReqs: 0,
            bytes: 0,
            dBytes: 0,
            lastDay: new Date().toISOString().split("T")[0],
        };
    }

    let u = state.sysUsageCache.users[uuid];
    let today = new Date().toISOString().split("T")[0];
    if (u.lastDay !== today) {
        u.dReqs = 0;
        u.dBytes = 0;
        u.lastDay = today;
    }
    if (u.reqs === undefined) u.reqs = 0;
    if (u.dReqs === undefined) u.dReqs = 0;
    if (typeof u.bytes !== "number" || u.bytes < 0) u.bytes = Math.floor((u.reqs || 0) * REQ_BYTES_EST);
    if (typeof u.dBytes !== "number" || u.dBytes < 0) {
        u.dBytes = u.lastDay === today ? Math.floor((u.dReqs || 0) * REQ_BYTES_EST) : 0;
    }

    if (bytes === 0) {
        u.reqs += 1;
        u.dReqs += 1;
    } else if (typeof bytes === "number" && bytes > 0) {
        u.bytes += Math.floor(bytes);
        u.dBytes += Math.floor(bytes);
    }

    const now = Date.now();
    if (now - state.lastSysUsageSync > 30000) {
        state.lastSysUsageSync = now;
        if (env && env.IOT_DB) {
            let changedConfig = false;
            if (state.sysConfig.users && state.sysConfig.users.length > 0) {
                state.sysConfig.users.forEach((usr) => {
                    let uId = usr.id.replace(/-/g, "").toLowerCase();
                    let sysU = state.sysUsageCache.users[uId];
                    if (!usr.isPaused) {
                        let reason = null;
                        if (usr.expiryMs && Date.now() > usr.expiryMs) {
                            reason = `Expiration date reached (${new Date(usr.expiryMs).toLocaleDateString()})`;
                        } else if (
                            sysU &&
                            usr.limitTotalReq &&
                            usageTotalBytes(sysU) >= limitReqToBytes(usr.limitTotalReq)
                        ) {
                            let usedGB = (usageTotalBytes(sysU) / 1073741824).toFixed(2);
                            let limitGB = (limitReqToBytes(usr.limitTotalReq) / 1073741824).toFixed(2);
                            reason = `Traffic limit exceeded (${usedGB}GB / ${limitGB}GB)`;
                        }
                        if (reason) {
                            usr.isPaused = true;
                            usr.disabledReason = reason;
                            usr.disabledAt = Date.now();
                            changedConfig = true;
                            ctx?.waitUntil(
                                logActivity(
                                    env,
                                    "User Auto-Disabled",
                                    `User "${usr.name}" (${usr.id}) disabled: ${reason}`,
                                ).catch(() => {}),
                            );
                            if (state.sysConfig.tgToken && (state.sysConfig.tgAdminId || state.sysConfig.tgChatId)) {
                                const tgMsg = `⚠️ <b>User Auto-Disabled</b>\n\n👤 <b>User:</b> ${usr.name}\n🆔 <b>ID:</b> <code>${usr.id}</code>\n📝 <b>Reason:</b> ${reason}`;
                                const notifyChatId = state.sysConfig.tgAdminId || state.sysConfig.tgChatId;
                                ctx?.waitUntil(
                                    fetchT(`https://api.telegram.org/bot${state.sysConfig.tgToken}/sendMessage`, {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ chat_id: notifyChatId, text: tgMsg, parse_mode: "HTML" }),
                                    }).catch(() => {}),
                                );
                            }
                        }
                    }
                });
            }

            if (changedConfig) {
                ctx?.waitUntil(cachedD1Put(env, "sys_config", JSON.stringify(state.sysConfig)).catch(() => {}));
            }
            ctx?.waitUntil(cachedD1Put(env, "sys_usage", JSON.stringify(state.sysUsageCache)).catch(() => {}));
        }
    }
}

export async function processTelemetryStream(env, ctx, wsRelayIdx) {
    const [client, webSocket] = Object.values(new WebSocketPair());
    webSocket.accept();
    webSocket.binaryType = "arraybuffer";
    startDataPipe(webSocket, env, ctx, wsRelayIdx);
    return new Response(null, { status: 101, webSocket: client });
}

export async function startDataPipe(webSocket, env, ctx, wsRelayIdx) {
    state.activeConnections++;
    state.OPEN_WS++;
    let connBytesUp = 0;
    let connBytesDown = 0;
    let activeRelay = null;
    let relayConfirmed = false;
    let pendingUpBytes = 0;
    let pendingUpItems = 0;
    let activeClientHash = null;

    webSocket.addEventListener("close", () => {
        state.activeConnections--;
        state.OPEN_WS = Math.max(0, state.OPEN_WS - 1);
        if (activeClientHash) {
            let cur = state.activeConns.get(activeClientHash) || 0;
            if (cur > 0) state.activeConns.set(activeClientHash, cur - 1);
        }
        try {
            const totalConnBytes = connBytesUp + connBytesDown;
            if (activeClientHash && totalConnBytes > 0) {
                trackUsage(activeClientHash, totalConnBytes, env, ctx);
            }
        } catch (e) {}
    });

    webSocket.addEventListener("error", () => {});

    let remoteSocket,
        dataWriter,
        isInit = true,
        queue = Promise.resolve();

    webSocket.addEventListener("message", (event) => {
        const size = event.data?.byteLength || 0;
        pendingUpBytes += size;
        pendingUpItems++;
        if (pendingUpBytes > UPSTREAM_QUEUE_MAX_BYTES || pendingUpItems > UPSTREAM_QUEUE_MAX_ITEMS) {
            try { webSocket.close(); } catch (e) {}
            return;
        }
        queue = queue.then(async () => {
            pendingUpBytes = Math.max(0, pendingUpBytes - size);
            pendingUpItems = Math.max(0, pendingUpItems - 1);
            try {
                if (isInit) {
                    isInit = false;
                    const isModeAlpha = await parseSensorData(event.data, wsRelayIdx);
                    if (isModeAlpha) webSocket.send(new Uint8Array([0, 0]));
                } else if (dataWriter) {
                    try {
                        await writeSocketWithTimeout(
                            remoteSocket,
                            dataWriter,
                            event.data,
                            UPSTREAM_WRITE_TIMEOUT_MS,
                        );
                    } catch (werr) {
                        closeTcpSocketQuietly(remoteSocket);
                        releaseWriterQuietly(dataWriter);
                        dataWriter = null;
                        try { webSocket.close(); } catch (e) {}
                        return;
                    }
                    connBytesUp += event.data?.byteLength || 0;
                }
            } catch (err) {
                webSocket.close();
            }
        });
    });

    async function parseSensorData(bufferData, wsRelayIdx) {
        const view = new Uint8Array(bufferData);
        let targetAddr = "",
            targetPort = 0,
            offset = 0,
            isModeAlpha = false,
            activeProfile = null;

        if (view[0] === 0x00) {
            isModeAlpha = true;
            let clientHash = Array.from(view.slice(1, 17))
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
            let configEntry = lookupConfigEntry(clientHash);

            if (configEntry) {
                activeClientHash = configEntry.userId.replace(/-/g, "").toLowerCase();
                activeProfile = getAllProfiles().find(
                    (p) => p.id.replace(/-/g, "").toLowerCase() === activeClientHash,
                );
                if (!activeProfile) return false;
                if (configEntry.relayIp) activeProfile = { ...activeProfile, proxyIp: configEntry.relayIp };
            } else {
                let decoded = decodeConfigUuid(clientHash);
                if (decoded) {
                    activeProfile = getAllProfiles().find((p) =>
                        p.id.replace(/-/g, "").toLowerCase().startsWith(decoded.userFingerprint),
                    );
                    if (activeProfile && decoded.relayIpIndex >= 0) {
                        const effectivePips = getEffectivePips(activeProfile);
                        if (effectivePips.length > 0) {
                            const idx = decoded.relayIpIndex % effectivePips.length;
                            activeProfile = { ...activeProfile, proxyIp: effectivePips[idx] };
                        }
                    }
                }
                if (!activeProfile) {
                    activeProfile = getAllProfiles().find(
                        (p) => p.id.replace(/-/g, "").toLowerCase() === clientHash,
                    );
                }
                if (!activeProfile) return false;
                activeClientHash = activeProfile.id.replace(/-/g, "").toLowerCase();
            }
            trackUsage(activeClientHash, 0, env, ctx);

            let currentConns = state.activeConns.get(activeClientHash) || 0;
            if (activeProfile && activeProfile.connLimit && currentConns >= activeProfile.connLimit) {
                webSocket.close();
                return isModeAlpha;
            }
            state.activeConns.set(activeClientHash, currentConns + 1);

            let uTrack = state.uuidUsage.get(activeClientHash) || { connects: 0, last: 0 };
            uTrack.connects++;
            uTrack.last = Date.now();
            state.uuidUsage.set(activeClientHash, uTrack);

            const optLen = view[17];
            const pPos = 18 + optLen + 1;
            targetPort = new DataView(bufferData.slice(pPos, pPos + 2)).getUint16(0);
            const aType = view[pPos + 2];
            let vPos = pPos + 3, aLen = 0;

            if (aType === 1) {
                aLen = 4;
                targetAddr = view.slice(vPos, vPos + aLen).join(".");
            } else if (aType === 2) {
                aLen = view[vPos];
                vPos++;
                targetAddr = new TextDecoder().decode(view.slice(vPos, vPos + aLen));
            } else if (aType === 3) {
                aLen = 16;
                const dv = new DataView(bufferData.slice(vPos, vPos + aLen));
                targetAddr = Array.from({ length: 8 }, (_, i) => dv.getUint16(i * 2).toString(16)).join(":");
            }
            offset = vPos + aLen;
        } else {
            let ePos = bufferData.byteLength;
            for (let i = 0; i < bufferData.byteLength; i++) {
                if (view[i] === 0x0d && view[i + 1] === 0x0a) {
                    ePos = i;
                    break;
                }
            }

            let clientHashHex = new TextDecoder().decode(view.slice(0, ePos));
            let configEntry = lookupConfigEntry(clientHashHex);

            if (configEntry) {
                activeClientHash = configEntry.userId.replace(/-/g, "").toLowerCase();
                activeProfile = getAllProfiles().find(
                    (p) => p.id.replace(/-/g, "").toLowerCase() === activeClientHash,
                );
                if (!activeProfile) return false;
                if (configEntry.relayIp) activeProfile = { ...activeProfile, proxyIp: configEntry.relayIp };
            } else {
                activeProfile = getAllProfiles().find((p) => getTrojanHash(p.id) === clientHashHex);
                if (!activeProfile) return false;
                activeClientHash = activeProfile.id.replace(/-/g, "").toLowerCase();
                if (wsRelayIdx >= 0) {
                    const effectivePips = getEffectivePips(activeProfile);
                    if (effectivePips.length > 0) {
                        activeProfile = {
                            ...activeProfile,
                            proxyIp: effectivePips[wsRelayIdx % effectivePips.length],
                        };
                    }
                }
            }
            trackUsage(activeClientHash, 0, env, ctx);
            let currentConns = state.activeConns.get(activeClientHash) || 0;
            if (activeProfile && activeProfile.connLimit && currentConns >= activeProfile.connLimit) {
                webSocket.close();
                return isModeAlpha;
            }
            state.activeConns.set(activeClientHash, currentConns + 1);

            let uTrack = state.uuidUsage.get(activeClientHash) || { connects: 0, last: 0 };
            uTrack.connects++;
            uTrack.last = Date.now();
            state.uuidUsage.set(activeClientHash, uTrack);

            let hPos = ePos + 3;
            let aType = view[hPos];
            hPos++;
            let aLen = 0;

            if (aType === 1) {
                aLen = 4;
                targetAddr = view.slice(hPos, hPos + aLen).join(".");
            } else if (aType === 3) {
                aLen = view[hPos];
                hPos++;
                targetAddr = new TextDecoder().decode(view.slice(hPos, hPos + aLen));
            } else if (aType === 4) {
                aLen = 16;
                const dv = new DataView(bufferData.slice(hPos, hPos + aLen));
                targetAddr = Array.from({ length: 8 }, (_, i) => dv.getUint16(i * 2).toString(16)).join(":");
            }

            hPos += aLen;
            targetPort = new DataView(bufferData.slice(hPos, hPos + 2)).getUint16(0);
            offset = hPos + 4;
        }

        let isDomain = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(targetAddr) || /^[a-zA-Z0-9-]+$/.test(targetAddr);
        let connectAddr = targetAddr;
        let aiEgress = false;
        try {
            if (isDomain) aiEgress = isAiDomain(targetAddr);
            else if (targetPort === 443 && offset < bufferData.byteLength) {
                aiEgress = isAiDomain(sniffSniFromHello(bufferData.slice(offset)));
            }
        } catch (e) {}

        if (isDomain && state.sysConfig.customDns) {
            try {
                const dohUrl = new URL(state.sysConfig.customDns);
                dohUrl.searchParams.set("name", targetAddr);
                dohUrl.searchParams.set("type", "A");
                let dnsRes = await fetchT(dohUrl.toString(), { headers: { accept: "application/dns-json" } });
                let dnsJson = await dnsRes.json();
                if (dnsJson.Answer && dnsJson.Answer.length > 0) connectAddr = dnsJson.Answer[0].data;
            } catch (e) {}
        }

        try {
            remoteSocket = connect({ hostname: connectAddr, port: targetPort });
            await withDeadline(remoteSocket.opened, TCP_OPEN_TIMEOUT_MS, () => closeTcpSocketQuietly(remoteSocket), "direct-open");
            activeRelay = null;
            relayConfirmed = false;
        } catch {
            let pips = [];
            if (activeProfile && activeProfile.proxyIp) {
                pips = activeProfile.proxyIp.split(/[\r\n,;]+/).map((s) => s.trim()).filter(Boolean);
            }
            if (pips.length === 0 && state.sysConfig.backupRelay) {
                pips = state.sysConfig.backupRelay.split(/[\r\n,;]+/).map((s) => s.trim()).filter(Boolean);
            }
            if (pips.length === 0 && state.sysConfig.customRelay) {
                pips = state.sysConfig.customRelay.split(/[\r\n,;]+/).map((s) => s.trim()).filter(Boolean);
            }

            let startIndex = 0;
            let aiPinned = false;
            try {
                if (aiEgress) {
                    const ord = orderAiFirstTokens(pips);
                    if (ord.moved) { pips = ord.list; aiPinned = true; }
                }
            } catch (e) {}
            if (pips.length > 1 && !aiPinned) {
                let hash = 0;
                let hashStr = activeProfile ? activeProfile.id : "";
                for (let i = 0; i < hashStr.length; i++) {
                    hash = hashStr.charCodeAt(i) + ((hash << 5) - hash);
                }
                startIndex = Math.abs(hash) % pips.length;
            }

            let connected = false;
            let tryPips = filterQuarantinedRelays(pips);
            try {
                if (aiEgress && tryPips.length > 1) tryPips = filterAiQuarantinedTokens(tryPips);
            } catch (e) {}

            for (let attempt = 0; attempt < Math.min(tryPips.length, 3); attempt++) {
                let currentIndex = (startIndex + attempt) % tryPips.length;
                let currentProxy = tryPips[currentIndex];
                const rkFail = relayKeyOf(currentProxy);
                try {
                    const [altIP0, altPortStr0] = currentProxy.split(":");
                    const altPortClean = altPortStr0 ? altPortStr0.split("#")[0].trim() : altPortStr0;
                    const altIP = rkFail && rkFail.host ? rkFail.host : altIP0;
                    remoteSocket = connect({
                        hostname: altIP,
                        port: altPortClean ? Number(altPortClean) : targetPort,
                    });
                    await withDeadline(remoteSocket.opened, TCP_OPEN_TIMEOUT_MS, () => closeTcpSocketQuietly(remoteSocket), "relay-open");
                    connected = true;
                    relayConfirmed = false;
                    activeRelay = rkFail ? { host: rkFail.host, port: rkFail.port, ai: aiEgress } : null;
                    break;
                } catch (e) {
                    if (rkFail) {
                        try {
                            if (aiEgress) recordAiFailure(rkFail.host, rkFail.port);
                            else recordRelayFailure(rkFail.host, rkFail.port);
                        } catch (ee) {}
                    }
                }
            }
            if (!connected) {
                webSocket.close();
                return isModeAlpha;
            }
        }

        dataWriter = remoteSocket.writable.getWriter();
        if (offset < bufferData.byteLength) {
            let chunk = bufferData.slice(offset);
            try {
                await writeSocketWithTimeout(remoteSocket, dataWriter, chunk, TCP_WRITE_TIMEOUT_MS);
            } catch (e) {
                closeTcpSocketQuietly(remoteSocket);
                releaseWriterQuietly(dataWriter);
                dataWriter = null;
                try { webSocket.close(); } catch (_) {}
                return isModeAlpha;
            }
            connBytesUp += chunk.byteLength || 0;
        }

        try {
            remoteSocket.readable
                .pipeTo(
                    new WritableStream({
                        write(chunk) {
                            try {
                                connBytesDown += chunk?.byteLength || 0;
                                const n = (chunk && chunk.byteLength) || 0;
                                if (n > 0 && activeRelay && !relayConfirmed) {
                                    relayConfirmed = true;
                                    try { recordRelaySuccess(activeRelay.host, activeRelay.port, true); } catch (e) {}
                                    try { if (activeRelay.ai) recordAiSuccess(activeRelay.host, activeRelay.port); } catch (e) {}
                                }
                            } catch (e) {}
                            try { webSocket.send(chunk); } catch (e) {}
                        },
                        close() {},
                        abort() {},
                    }),
                )
                .catch(() => {})
                .finally(() => {
                    closeTcpSocketQuietly(remoteSocket);
                    try { webSocket.close(); } catch (e) {}
                });
        } catch (e) {}

        return isModeAlpha;
    }
}
