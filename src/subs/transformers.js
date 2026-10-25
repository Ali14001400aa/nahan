/*
 * Project Nahan - Unified Proxy Transformer & Subscription Models
 */

import { state, usageTotalBytes, limitReqToBytes, getTransportParams } from "../config.js";
import { registerConfigEntry, generateConfigUuid } from "../crypto.js";
import { preloadIpFlags, getGeoInfo } from "./geo.js";

export function getAllProfiles(targetSub = null) {
    let list = [{ id: state.activeDeviceId, name: "Default" }];
    if (state.sysConfig.users && state.sysConfig.users.length > 0) {
        const now = Date.now();
        state.sysConfig.users.forEach((u) => {
            let skip = false;
            if (u.expiryMs && now > u.expiryMs) skip = true;
            if (u.isPaused) skip = true;
            const uIdClean = u.id.replace(/-/g, "").toLowerCase();
            const sysU = state.sysUsageCache?.users?.[uIdClean];
            if (u.limitTotalReq && sysU && sysU.reqs >= u.limitTotalReq) skip = true;
            if (u.limitDailyReq && sysU && sysU.lastDay === new Date().toISOString().split("T")[0] && sysU.dReqs >= u.limitDailyReq) {
                skip = true;
            }
            if (!skip) {
                list.push({
                    id: u.id,
                    name: u.name,
                    proxyIp: u.proxyIp,
                    cleanIp: u.cleanIp || null,
                    userMode: u.userMode || null,
                    userPorts: u.userPorts || null,
                    maxConfigs: u.maxConfigs || null,
                    proxyIpGeo: u.proxyIpGeo || null,
                    userNodes: u.userNodes || null,
                    nat64: u.nat64 || null,
                    connLimit: u.connLimit || null,
                    userPanelUrl: u.userPanelUrl || null,
                    segMode: u.segMode,
                    segPackets: u.segPackets,
                    segLengths: u.segLengths,
                    segDelays: u.segDelays,
                    segMaxSplit: u.segMaxSplit,
                    segManual: u.segManual,
                    tlsMask: u.tlsMask,
                });
                registerConfigEntry(u.id, u.id, u.proxyIp || "");
            }
        });
    }
    if (targetSub) {
        list = list.filter((p) => p.name.toLowerCase() === targetSub.toLowerCase() || p.id === targetSub);
    }
    return list;
}

export function getSubscriptionStats(targetSub = null) {
    let name = "Default";
    let id = state.activeDeviceId;
    let limitTotalReq = 0;
    let expiryMs = 0;

    const hasMultiUser = state.sysConfig.users && state.sysConfig.users.length > 0;
    if (hasMultiUser && targetSub) {
        const user = state.sysConfig.users.find(
            (u) => u.name.toLowerCase() === targetSub.toLowerCase() || u.id === targetSub,
        );
        if (user) {
            name = user.name;
            id = user.id;
            limitTotalReq = user.limitTotalReq || 0;
            expiryMs = user.expiryMs || 0;
        }
    } else if (!hasMultiUser) {
        limitTotalReq = state.sysConfig.limitTotalReq || 0;
        expiryMs = state.sysConfig.expiryMs || 0;
    }

    const idClean = id.replace(/-/g, "").toLowerCase();
    const sysU = state.sysUsageCache?.users?.[idClean] || { reqs: 0, dReqs: 0 };
    const totalBytesUsed = usageTotalBytes(sysU);
    const totalGb = (totalBytesUsed / 1073741824).toFixed(2);
    const limitTotalGb = limitTotalReq ? (limitReqToBytes(limitTotalReq) / 1073741824).toFixed(2) : "Unlimited";

    let expiryDateTxt = "Never Expire";
    let remDaysTxt = "Never Expire";
    if (expiryMs) {
        expiryDateTxt = new Date(expiryMs).toISOString().split("T")[0];
        const remDays = Math.ceil((expiryMs - Date.now()) / (1000 * 60 * 60 * 24));
        remDaysTxt = remDays >= 0 ? `${remDays} Days Left` : "Expired";
    }

    return {
        usedStr: `Used: ${totalGb} GB / ${limitTotalGb} GB`,
        expiryStr: `Expiry: ${expiryDateTxt} (${remDaysTxt})`,
    };
}

export function getFakeConfigNames(targetSub = null) {
    const stats = getSubscriptionStats(targetSub);
    const configs = state.sysConfig.fakeConfigs || [
        { name: "📊 {usage}", enabled: true },
        { name: "📅 {expiry}", enabled: true },
    ];
    return configs
        .filter((f) => f && f.enabled && f.name)
        .map((f) => f.name.replace(/\{usage\}/g, stats.usedStr).replace(/\{expiry\}/g, stats.expiryStr));
}

export function getCleanIps(hostName, userCleanIps = null) {
    const rawIps = userCleanIps || state.sysConfig.cleanIps;
    let ips = rawIps
        ? rawIps.split(/[\r\n,;]+/).map((s) => s.trim().split("#")[0].trim()).filter(Boolean)
        : [];
    if (ips.length === 0) ips = [hostName.endsWith(".pages.dev") ? state.sysConfig.metricNode : hostName];
    return ips;
}

export function getCleanIpsWithNames(hostName, userCleanIps = null) {
    const rawIps = userCleanIps || state.sysConfig.cleanIps;
    let entries = rawIps
        ? rawIps
              .split(/[\r\n,;]+/)
              .map((s) => {
                  const t = s.trim();
                  if (!t) return null;
                  const parts = t.split("#");
                  const ip = parts[0].trim();
                  const name = (parts[1] || "").trim();
                  return ip ? { ip, name } : null;
              })
              .filter(Boolean)
        : [];
    if (entries.length === 0) {
        entries = [{ ip: hostName.endsWith(".pages.dev") ? state.sysConfig.metricNode : hostName, name: "" }];
    }
    return entries;
}

export function linkedPanelHost(p) {
    let raw = p && typeof p === "object" ? p.url || "" : p || "";
    raw = String(raw).trim().replace(/^[a-zA-Z]+:\/\//, "").split("/")[0].split("@").pop();
    if (raw.startsWith("[")) return raw.slice(0, raw.indexOf("]") + 1);
    return raw.split(":")[0];
}

export function getGlobalNodeHosts() {
    const hosts = [];
    if (state.sysConfig.slaveNodes) {
        hosts.push(...state.sysConfig.slaveNodes.split(/[\r\n,;]+/).map((s) => s.trim()).filter(Boolean));
    }
    if (Array.isArray(state.sysConfig.linkedPanels)) {
        hosts.push(...state.sysConfig.linkedPanels.map(linkedPanelHost).filter(Boolean));
    }
    return [...new Set(hosts)];
}

export function getProfileHostNames(hostName, profile) {
    const primaryHost = profile && profile.userPanelUrl ? profile.userPanelUrl : hostName;
    const names = [];
    if (profile && profile.userNodes && profile.userNodes.trim()) {
        names.push(
            ...profile.userNodes.split(/[\r\n,;]+/).map((s) => linkedPanelHost(s.trim())).filter(Boolean),
        );
    } else {
        names.push(linkedPanelHost(primaryHost));
        names.push(...getGlobalNodeHosts());
    }
    return [...new Set(names)];
}

export function getProxyIpsArray(proxyIpString) {
    if (!proxyIpString) return [];
    return proxyIpString
        .split(/[\r\n,;]+/)
        .map((s) => {
            const trimmed = s.trim();
            if (!trimmed) return "";
            const hostPort = trimmed.split("#")[0].split("@")[0];
            if (hostPort.includes(":") && !hostPort.includes("]")) return hostPort.split(":")[0];
            if (hostPort.startsWith("[") && hostPort.includes("]")) return hostPort.split("]")[0].replace("[", "");
            return hostPort;
        })
        .filter(Boolean);
}

export function ipv4ToNat64(ipv4, prefix) {
    if (!prefix || !ipv4) return null;
    const parts = ipv4.split(".");
    if (parts.length !== 4 || parts.some((p) => isNaN(parseInt(p)))) return null;
    const hex = parts.map((p) => parseInt(p).toString(16).padStart(2, "0")).join("");
    const suffix = hex.match(/.{1,4}/g).join(":");
    return prefix.replace(/\/\d+$/, "").replace(/:$/, "") + "::" + suffix;
}

export function getProxyIpsWithNat64(proxyIpString, nat64Prefix) {
    let ips = getProxyIpsArray(proxyIpString);
    if (nat64Prefix) {
        const prefixes = nat64Prefix.split(/[\r\n,;]+/).map((s) => s.trim()).filter(Boolean);
        const nat64Ips = [];
        prefixes.forEach((prefix) => {
            ips.forEach((ip) => {
                if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)) {
                    const nat64 = ipv4ToNat64(ip, prefix);
                    if (nat64) nat64Ips.push(nat64);
                }
            });
        });
        ips = ips.concat(nat64Ips);
    }
    return ips;
}

export function getEffectiveNat64(userNat64) {
    const parts = [];
    if (userNat64) parts.push(...userNat64.split(/[\r\n,;]+/).map((s) => s.trim()).filter(Boolean));
    if (state.sysConfig.nat64Prefix) parts.push(...state.sysConfig.nat64Prefix.split(/[\r\n,;]+/).map((s) => s.trim()).filter(Boolean));
    return [...new Set(parts)].join(",") || null;
}

export function getEffectivePips(p) {
    const effectiveNat64 = getEffectiveNat64(p.nat64);
    let pips = getProxyIpsWithNat64(p.proxyIp, effectiveNat64);
    if (pips.length === 0 && state.sysConfig.backupRelay) {
        pips = getProxyIpsWithNat64(state.sysConfig.backupRelay, effectiveNat64);
    }
    if (pips.length === 0 && state.sysConfig.customRelay) {
        pips = getProxyIpsWithNat64(state.sysConfig.customRelay, effectiveNat64);
    }
    return pips;
}

export function calcEffectiveIps(ips, maxCfg, effectiveMode, effectivePorts, pipsCount = 1) {
    if (!maxCfg) return ips;
    const protoCount = effectiveMode === "both" ? 2 : 1;
    const portCount = effectivePorts.length;
    const directMultiplier = state.sysConfig.enableDirectConfigs ? 2 : 1;
    const multiplier = protoCount * portCount * directMultiplier * Math.max(1, pipsCount);
    const neededIps = Math.max(1, Math.floor(maxCfg / multiplier));
    return ips.slice(0, neededIps);
}

export function getConfigName(type, profileName, port, hostName, ip, proxyIp = null, configIndex = 0, ipName = "", isDirect = false) {
    const prefix = state.sysConfig.namePrefix || "Core";
    const strategy = state.sysConfig.nameStrategy || "default";
    const cleanName = profileName === "Default" ? "" : `-${profileName}`;
    const typeLab = type === "alpha" ? "V" : "T";

    if (strategy.includes("{") && strategy.includes("}")) {
        const lookupIp = proxyIp || ip;
        const geoInfo = getGeoInfo(lookupIp);
        const protoLab = type === "alpha" ? "VLESS" : "Trojan";
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        const workerName = state.sysConfig.cfWorkerName || state.sysConfig.name || hostName || "";
        const flagToUse = isDirect ? "☁️" : geoInfo.flag;
        return strategy
            .replace(/{FLAG}/g, flagToUse)
            .replace(/{COUNTRY}/g, geoInfo.country)
            .replace(/{CITY}/g, geoInfo.city)
            .replace(/{ISP}/g, geoInfo.isp)
            .replace(/{PROTOCOL}/g, protoLab)
            .replace(/{USER}/g, profileName)
            .replace(/{PORT}/g, port)
            .replace(/{PREFIX}/g, prefix)
            .replace(/{IP}/g, ip || "")
            .replace(/{IP_NAME}/g, ipName || "")
            .replace(/{HOST}/g, hostName || "")
            .replace(/{DATE}/g, dateStr)
            .replace(/{INDEX}/g, String(configIndex))
            .replace(/{WORKER}/g, workerName);
    }
    if (strategy === "type-user-port") return `${type === "alpha" ? "vless" : "trojan"}-${profileName}-${port}`;
    if (strategy === "user-port") return `${profileName}-${port}`;
    if (strategy === "host-port-user") return `${hostName}-${port}${cleanName}`;
    if (strategy === "prefix-user-port") return `${prefix}${cleanName}-${port}`;
    if (strategy === "ip") return ip || "unknown";
    return `${typeLab}-Core-${port}${cleanName}`;
}

export function parseSegRangeList(s, maxItems) {
    try {
        const items = String(s || "").split(",").map((x) => x.trim()).filter(Boolean).slice(0, maxItems);
        if (!items.length) return null;
        for (const it of items) if (!/^\d{1,5}(-\d{1,5})?$/.test(it)) return null;
        return items;
    } catch (e) {
        return null;
    }
}

export function resolveSegFragment(p) {
    try {
        if (!p) return null;
        const mode = String(p.segMode || "off").toLowerCase();
        if (mode === "builder") {
            const packets = String(p.segPackets || "").trim().slice(0, 32);
            if (!packets || (packets !== "tlshello" && !/^\d{1,3}-\d{1,3}$/.test(packets))) return null;
            const lengths = parseSegRangeList(p.segLengths, 8);
            const delays = parseSegRangeList(p.segDelays, 8);
            const maxSplit = String(p.segMaxSplit ?? "").trim();
            if (!lengths || !delays || !/^\d{1,6}$/.test(maxSplit)) return null;
            return { kind: "fm", value: { tcp: [{ type: "fragment", settings: { packets, lengths, delays, maxSplit } }] } };
        }
        if (mode === "manual") {
            const raw = String(p.segManual || "").trim().slice(0, 4000);
            if (!raw) return null;
            if (raw.charAt(0) === "{") {
                const obj = JSON.parse(raw);
                if (!obj || typeof obj !== "object" || !Array.isArray(obj.tcp) || obj.tcp.length === 0) return null;
                return { kind: "fm", value: { tcp: obj.tcp } };
            }
            if (/^\d{1,5}-\d{1,5},\d{1,5}-\d{1,5},(tlshello|\d{1,3}-\d{1,3})$/.test(raw)) {
                return { kind: "classic", value: raw };
            }
        }
        return null;
    } catch (e) {
        return null;
    }
}

export function buildSegFragmentParam(p) {
    try {
        const r = resolveSegFragment(p);
        if (!r) return "";
        if (r.kind === "fm") return "&fm=" + encodeURIComponent(JSON.stringify(r.value));
        return "&fragment=" + encodeURIComponent(String(r.value));
    } catch (e) {
        return "";
    }
}

export function getSegStreamExtra(p) {
    try {
        const r = resolveSegFragment(p);
        if (!r) return {};
        if (r.kind === "fm") return { finalmask: r.value };
        const m = String(r.value).split(",");
        return { fragment: { packets: m[2], length: m[0], interval: m[1] } };
    } catch (e) {
        return {};
    }
}

export function buildTlsMaskParam(p) {
    try {
        if (!p || !p.tlsMask) return "";
        const v = String(p.tlsMask).trim().slice(0, 2000);
        if (!/^(TLS_[A-Za-z0-9_]+)(:TLS_[A-Za-z0-9_]+)*$/.test(v)) return "";
        return "&cs=" + encodeURIComponent(v);
    } catch (e) {
        return "";
    }
}

export function isSegEnabled(p) {
    try {
        if (!p) return false;
        const mode = String(p.segMode || "off").toLowerCase();
        if (mode !== "builder" && mode !== "manual") return false;
        return buildSegFragmentParam(p) !== "";
    } catch (e) {
        return false;
    }
}

export function parseVlessUri(uri) {
    if (!uri || typeof uri !== "string" || !uri.trim().startsWith("vless://")) return null;
    try {
        let rest = uri.trim().slice(8);
        let fragment = "";
        const hashIdx = rest.indexOf("#");
        if (hashIdx !== -1) {
            fragment = decodeURIComponent(rest.slice(hashIdx + 1));
            rest = rest.slice(0, hashIdx);
        }
        let queryStr = "";
        const qIdx = rest.indexOf("?");
        if (qIdx !== -1) {
            queryStr = rest.slice(qIdx + 1);
            rest = rest.slice(0, qIdx);
        }
        const params = {};
        if (queryStr) {
            queryStr.split("&").forEach((pair) => {
                const [k, v] = pair.split("=");
                if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || "");
            });
        }
        const atIdx = rest.indexOf("@");
        if (atIdx === -1) return null;
        const uuid = rest.slice(0, atIdx);
        const hostPort = rest.slice(atIdx + 1);
        let server, port;
        if (hostPort.startsWith("[")) {
            const bracketEnd = hostPort.indexOf("]");
            server = hostPort.slice(1, bracketEnd);
            port = parseInt(hostPort.slice(bracketEnd + 2)) || 443;
        } else {
            const colonIdx = hostPort.lastIndexOf(":");
            server = hostPort.slice(0, colonIdx);
            port = parseInt(hostPort.slice(colonIdx + 1)) || 443;
        }
        return {
            uuid,
            server,
            port,
            name: fragment || "Upstream",
            security: params.security || "tls",
            sni: params.sni || params.servername || server,
            host: params.host || server,
            path: params.path || "/",
            type: params.type || "ws",
            fp: params.fp || params["client-fingerprint"] || "random",
            allowInsecure: params.allowInsecure === "1" || params.allowInsecure === "true",
            pbk: params.pbk || "",
            sid: params.sid || "",
            flow: params.flow || "",
            encryption: params.encryption || "none",
            alpn: params.alpn || "",
            raw: uri,
        };
    } catch (e) {
        return null;
    }
}

export function upstreamToSingboxOb(parsed) {
    if (!parsed) return null;
    const ob = {
        type: "vless",
        tag: "🔗 " + parsed.name,
        server: parsed.server,
        server_port: parsed.port,
        uuid: parsed.uuid,
        packet_encoding: "xudp",
        network: parsed.type || "ws",
        tls: {
            enabled: parsed.security === "tls" || parsed.security === "reality",
            server_name: parsed.sni,
            insecure: parsed.allowInsecure,
            utls: { enabled: true, fingerprint: parsed.fp || "randomized" },
        },
        transport: {
            type: parsed.type || "ws",
            path: parsed.path || "/",
            headers: { Host: parsed.host || parsed.sni },
        },
    };
    if (parsed.flow) ob.flow = parsed.flow;
    if (parsed.pbk) {
        ob.tls.reality = { enabled: true, public_key: parsed.pbk, short_id: parsed.sid || "" };
    }
    if (parsed.alpn) ob.tls.alpn = parsed.alpn.split(",");
    return ob;
}

export function upstreamToClashProxy(parsed) {
    if (!parsed) return null;
    const proxy = {
        name: parsed.name,
        type: "vless",
        server: parsed.server,
        port: parsed.port,
        uuid: parsed.uuid,
        udp: true,
        tls: parsed.security === "tls" || parsed.security === "reality",
        servername: parsed.sni,
        "client-fingerprint": parsed.fp || "random",
        "skip-cert-verify": parsed.allowInsecure,
        network: parsed.type || "ws",
        "ws-opts": { path: parsed.path || "/", headers: { Host: parsed.host || parsed.sni } },
    };
    if (parsed.flow) proxy.flow = parsed.flow;
    if (parsed.pbk) {
        proxy["reality-opts"] = { "public-key": parsed.pbk, "short-id": parsed.sid || "" };
    }
    if (parsed.alpn) proxy.alpn = parsed.alpn.split(",");
    return proxy;
}

export function upstreamToV2RayOb(parsed) {
    if (!parsed) return null;
    return {
        tag: "🔗 " + parsed.name,
        protocol: "vless",
        settings: {
            vnext: [
                {
                    address: parsed.server,
                    port: parsed.port,
                    users: [{ id: parsed.uuid, encryption: parsed.encryption || "none", flow: parsed.flow || "" }],
                },
            ],
        },
        streamSettings: {
            network: parsed.type || "ws",
            security: parsed.security === "tls" || parsed.security === "reality" ? "tls" : "none",
            tlsSettings: parsed.security === "tls" ? { serverName: parsed.sni, allowInsecure: parsed.allowInsecure, fingerprint: parsed.fp || "random" } : undefined,
            realitySettings: parsed.security === "reality" ? { serverName: parsed.sni, publicKey: parsed.pbk || "", shortId: parsed.sid || "", fingerprint: parsed.fp || "random" } : undefined,
            wsSettings: { path: parsed.path || "/", headers: { Host: parsed.host || parsed.sni } },
        },
    };
}

export async function generateUnifiedProxies(hostName, targetSub = null, allowInsecure = false) {
    const ports = state.sysConfig.socketPorts
        ? state.sysConfig.socketPorts.split(",").map((s) => s.trim()).filter(Boolean)
        : ["443"];
    const profiles = getAllProfiles(targetSub);
    const allHostNames = [...new Set(profiles.flatMap((p) => getProfileHostNames(hostName, p)))];

    const cleanIpsList = [];
    const proxyIpsList = [];
    profiles.forEach((p) => {
        allHostNames.forEach((h) => cleanIpsList.push(...getCleanIps(h, p.cleanIp)));
        if (p.proxyIp) proxyIpsList.push(...getProxyIpsArray(p.proxyIp));
    });
    if (state.sysConfig.backupRelay) proxyIpsList.push(...getProxyIpsArray(state.sysConfig.backupRelay));
    if (state.sysConfig.customRelay) proxyIpsList.push(...getProxyIpsArray(state.sysConfig.customRelay));
    await preloadIpFlags(cleanIpsList, proxyIpsList);

    const proxies = [];
    const nameCounts = {};
    const getUniqueName = (base) => {
        if (!nameCounts[base]) { nameCounts[base] = 1; return base; }
        const c = nameCounts[base];
        nameCounts[base] = c + 1;
        return `${base}-${c}`;
    };

    let configIndex = 0;
    profiles.forEach((p) => {
        const pips = getEffectivePips(p);
        const effectiveMode = p.userMode || state.sysConfig.mode;
        const effectivePorts = p.userPorts ? p.userPorts.split(",").map((s) => s.trim()).filter(Boolean) : ports;
        const maxCfg = p.maxConfigs || null;
        const profileHostNames = getProfileHostNames(hostName, p);

        profileHostNames.forEach((hName) => {
            const ipEntries = getCleanIpsWithNames(hName, p.cleanIp);
            const allIps = ipEntries.map((e) => e.ip);
            const ips = calcEffectiveIps(allIps, maxCfg, effectiveMode, effectivePorts, pips.length);
            const ipNameMap = {};
            ipEntries.forEach((e) => { ipNameMap[e.ip] = e.name; });

            effectivePorts.forEach((port) => {
                const sec = getTransportParams(port) === "tls";
                ips.forEach((ip) => {
                    const _pips = pips.length > 0 ? pips : [null];
                    _pips.forEach((selectedProxyIp) => {
                        const ipName = ipNameMap[ip] || "";
                        const isVless = effectiveMode === "alpha" || effectiveMode === "both";
                        const isTrojan = effectiveMode === "beta" || effectiveMode === "both";

                        const makeEntry = (proto, isDirect = false) => {
                            const tagStr = getUniqueName(
                                getConfigName(proto === "vless" ? "alpha" : "beta", p.name, port, hName, ip, isDirect ? null : selectedProxyIp, configIndex, ipName, isDirect),
                            );
                            const configUuid = generateConfigUuid(p.id, configIndex);
                            if (proto === "vless") {
                                registerConfigEntry(configUuid, p.id, isDirect ? "" : (selectedProxyIp || ""));
                            }
                            const randomJunk = Array.from({ length: 11 }, () =>
                                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 62)],
                            ).join("");
                            const payload = {
                                junk: randomJunk,
                                protocol: proto === "vless" ? "vl" : "tr",
                                mode: "proxyip",
                                panelIPs: [],
                                relayIdx: configIndex,
                            };
                            const pathStr = "/" + btoa(JSON.stringify(payload));
                            const geo = getGeoInfo(isDirect ? ip : (selectedProxyIp || ip));

                            return {
                                proto,
                                tag: tagStr,
                                server: ip,
                                port: parseInt(port),
                                uuid: configUuid,
                                password: p.id,
                                tls: sec,
                                servername: hName,
                                path: pathStr,
                                geo,
                                isDirect,
                                profile: p,
                            };
                        };

                        if (isVless) proxies.push(makeEntry("vless"));
                        if (isTrojan) proxies.push(makeEntry("trojan"));
                        configIndex++;

                        if (state.sysConfig.enableDirectConfigs && pips.length > 0 && selectedProxyIp === pips[0]) {
                            if (isVless) proxies.push(makeEntry("vless", true));
                            if (isTrojan) proxies.push(makeEntry("trojan", true));
                            configIndex++;
                        }
                    });
                });
            });
        });
    });

    return proxies;
}
