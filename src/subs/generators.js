/*
 * Project Nahan - Client Configuration Builders (URI, Clash, Singbox, V2Ray)
 */

import { state, fetchT, getAlpha, getBeta } from "../config.js";
import {
    getFakeConfigNames,
    generateUnifiedProxies,
    parseVlessUri,
    upstreamToClashProxy,
    upstreamToSingboxOb,
    upstreamToV2RayOb,
    buildSegFragmentParam,
    buildTlsMaskParam,
    getSegStreamExtra,
} from "./transformers.js";

const DEFAULT_SINGBOX_TEMPLATE = {
  log: { level: "info", timestamp: true },
  dns: {
    servers: [
      { tag: "google", address: "tls://8.8.8.8", detour: "select" },
      { tag: "local", address: "223.5.5.5", detour: "direct" }
    ],
    rules: [{ outbound: ["any"], server: "local" }],
    final: "google",
    strategy: "prefer_ipv4",
    optimistic: true,
    reverse_mapping: true
  },
  inbounds: [{ type: "mixed", tag: "mixed-in", listen: "127.0.0.1", listen_port: 2080, set_system_proxy: false }],
  outbounds: ["__OUTBOUNDS__"],
  route: {
    rules: [
      { ip_is_private: true, outbound: "direct" },
      { protocol: "dns", action: "hijack-dns" },
      { action: "route", outbound: "select" }
    ],
    final: "select",
    auto_detect_interface: true
  },
  experimental: {
    cache_file: { enabled: true, path: "cache.db", store_dns: true },
    clash_api: { external_controller: "127.0.0.1:9090", access_control_allow_origin: ["*"], access_control_allow_private_network: true }
  }
};

const DEFAULT_V_TEMPLATE = {
  log: { loglevel: "warning" },
  inbounds: [
    { tag: "socks-in", port: 10808, listen: "127.0.0.1", protocol: "socks", settings: { auth: "noauth", udp: true }, sniffing: { enabled: true, destOverride: ["http", "tls", "quic"] } },
    { tag: "http-in", port: 10809, listen: "127.0.0.1", protocol: "http", settings: { auth: "noauth" }, sniffing: { enabled: true, destOverride: ["http", "tls", "quic"] } }
  ],
  outbounds: ["__OUTBOUNDS__"],
  routing: {
    domainStrategy: "AsIs",
    rules: [
      { type: "field", outboundTag: "block", protocol: ["bittorrent"] },
      { type: "field", outboundTag: "direct", ip: ["geoip:private", "geoip:cn"], domain: ["geosite:cn"] }
    ],
    strategy: "rules"
  }
};

let clashTemplate = null;
let singboxTemplate = DEFAULT_SINGBOX_TEMPLATE;
let VTemplate = DEFAULT_V_TEMPLATE;

export async function fetchTemplates() {
    const repo = state.sysConfig.githubRepo || "itsyebekhe/nahan";
    if (!clashTemplate) {
        try {
            const res = await fetchT(`https://raw.githubusercontent.com/${repo}/main/clash.yml`);
            if (res.ok) clashTemplate = await res.text();
        } catch (e) {}
    }
    try {
        const res = await fetchT(`https://raw.githubusercontent.com/${repo}/main/singbox.json`);
        if (res.ok) singboxTemplate = await res.json();
    } catch (e) {}
    try {
        const res = await fetchT(`https://raw.githubusercontent.com/${repo}/main/v.json`);
        if (res.ok) VTemplate = await res.json();
    } catch (e) {}
}

export function getCustomRouting() {
    const cr = state.sysConfig.customRouting || "";
    const lines = cr.split("\n").map((l) => l.trim()).filter(Boolean);
    const domains = [];
    const ips = [];
    const geoips = [];
    const geosites = [];
    for (const l of lines) {
        const low = l.toLowerCase();
        if (low.startsWith("geoip:")) geoips.push(l.substring(6).trim().toUpperCase());
        else if (low.startsWith("geosite:")) geosites.push(l.substring(8).trim().toLowerCase());
        else if (l.match(/^[0-9\.\/:]+$/)) ips.push(l);
        else domains.push(l);
    }
    return { domains, ips, geoips, geosites };
}

export async function buildUriProfile(hostName, targetSub = null, allowInsecure = false) {
    const lines = [];
    const fakeNames = getFakeConfigNames(targetSub);
    fakeNames.forEach((name) => {
        lines.push(`trojan://00000000-0000-0000-0000-000000000000@127.0.0.1:1080?security=none#${encodeURIComponent(name)}`);
    });

    const unified = await generateUnifiedProxies(hostName, targetSub, allowInsecure);
    const reqPath = encodeURI(`/${state.sysConfig.apiRoute}`);

    unified.forEach((p) => {
        let ext = `security=${p.tls ? "tls" : "none"}&sni=${p.servername}&fp=${state.sysConfig.agent}&type=ws&host=${p.servername}&path=${reqPath}`;
        if (state.sysConfig.enableOpt2) ext += "&pbk=enabled";
        ext += `&allowInsecure=${allowInsecure ? "1" : "0"}`;
        ext += buildSegFragmentParam(p.profile);
        ext += buildTlsMaskParam(p.profile);

        if (p.proto === "vless") {
            lines.push(`${getAlpha()}://${p.uuid}@${p.server}:${p.port}?encryption=none&${ext}#${p.tag}`);
        } else {
            const trExt = `security=${p.tls ? "tls" : "none"}&sni=${p.servername}&fp=${state.sysConfig.agent}&type=ws&host=${p.servername}&path=${encodeURIComponent(p.path)}&allowInsecure=${allowInsecure ? "1" : "0"}${state.sysConfig.enableOpt2 ? "&pbk=enabled" : ""}${buildSegFragmentParam(p.profile)}${buildTlsMaskParam(p.profile)}`;
            lines.push(`${getBeta()}://${p.password}@${p.server}:${p.port}?${trExt}#${p.tag}`);
        }
    });

    const parsedUpstream = parseVlessUri(state.sysConfig.upstreamUri);
    if (parsedUpstream) lines.unshift(parsedUpstream.raw);
    return lines.join("\n");
}

export async function buildYamlProfile(hostName, targetSub = null, allowInsecure = false) {
    const proxies = [];
    const proxyNames = [];
    const fakeNames = getFakeConfigNames(targetSub);
    fakeNames.forEach((name) => {
        proxies.push(
            `- name: "${name}"\n  type: ${getBeta()}\n  server: 127.0.0.1\n  port: 80\n  password: "${state.activeDeviceId}"\n  udp: true\n  tls: false`,
        );
    });

    const unified = await generateUnifiedProxies(hostName, targetSub, allowInsecure);
    const countryGroups = new Map();

    unified.forEach((p) => {
        proxyNames.push(`"${p.tag}"`);
        const cKey = p.geo.country || "Unknown";
        if (!countryGroups.has(cKey)) countryGroups.set(cKey, { flag: p.geo.flag || "🌐", proxies: [] });
        countryGroups.get(cKey).proxies.push(p.tag);

        if (p.proto === "vless") {
            proxies.push(
                `- name: "${p.tag.replace(/"/g, '""')}"\n  type: ${getAlpha()}\n  server: ${p.server}\n  port: ${p.port}\n  uuid: ${p.uuid}\n  udp: true\n  tls: ${p.tls}\n  servername: ${p.servername}\n  client-fingerprint: ${state.sysConfig.agent || "random"}\n  network: ws\n  ws-opts:\n    path: "${p.path}"\n    headers:\n      Host: ${p.servername}\n  skip-cert-verify: ${allowInsecure}\n${state.sysConfig.enableOpt1 ? "  tfo: true" : ""}`,
            );
        } else {
            proxies.push(
                `- name: "${p.tag.replace(/"/g, '""')}"\n  type: ${getBeta()}\n  server: ${p.server}\n  port: ${p.port}\n  password: "${p.password}"\n  udp: true\n  tls: ${p.tls}\n  sni: ${p.servername}\n  client-fingerprint: ${state.sysConfig.agent || "random"}\n  network: ws\n  ws-opts:\n    path: "${p.path}"\n    headers:\n      Host: ${p.servername}\n  skip-cert-verify: ${allowInsecure}\n${state.sysConfig.enableOpt1 ? "  tfo: true" : ""}`,
            );
        }
    });

    const parsedUpstreamYaml = parseVlessUri(state.sysConfig.upstreamUri);
    if (parsedUpstreamYaml) {
        const upProxy = upstreamToClashProxy(parsedUpstreamYaml);
        const upYaml = `- name: "${upProxy.name.replace(/"/g, '""')}"\n  type: ${getAlpha()}\n  server: ${upProxy.server}\n  port: ${upProxy.port}\n  uuid: ${upProxy.uuid}\n  udp: true\n  tls: ${upProxy.tls}\n  servername: ${upProxy.servername}\n  client-fingerprint: ${upProxy["client-fingerprint"] || "random"}\n  skip-cert-verify: ${upProxy["skip-cert-verify"]}\n  network: ${upProxy.network}\n  ws-opts:\n    path: "${upProxy["ws-opts"]?.path || "/"}"\n    headers:\n      Host: ${upProxy["ws-opts"]?.headers?.Host || upProxy.servername}`;
        proxies.unshift(upYaml);
        proxyNames.unshift(`"${upProxy.name}"`);
    }

    const sortedCountries = Array.from(countryGroups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    let groupsYaml =
        'proxy-groups:\n  - name: "✅ Selector"\n    type: select\n    proxies:\n      - "⚡ Fastest"\n      - "🖐 Manual"\n';
    sortedCountries.forEach(([country, info]) => {
        groupsYaml += `      - "${info.flag} ${country}"\n`;
    });

    groupsYaml += '\n  - name: "⚡ Fastest"\n    type: url-test\n    url: "https://www.gstatic.com/generate_204"\n    interval: 30\n    tolerance: 50\n    proxies:\n';
    proxyNames.forEach((n) => { groupsYaml += `      - ${n}\n`; });

    groupsYaml += '\n  - name: "🖐 Manual"\n    type: select\n    proxies:\n';
    proxyNames.forEach((n) => { groupsYaml += `      - ${n}\n`; });

    sortedCountries.forEach(([country, info]) => {
        groupsYaml += `\n  - name: "${info.flag} ${country}"\n    type: url-test\n    url: "https://www.gstatic.com/generate_204"\n    interval: 30\n    tolerance: 50\n    proxies:\n`;
        info.proxies.forEach((name) => { groupsYaml += `      - "${name}"\n`; });
    });

    const cr = getCustomRouting();
    const customRules = [];
    cr.domains.forEach((d) => { customRules.push(`  - DOMAIN,${d},DIRECT`); customRules.push(`  - DOMAIN-SUFFIX,${d},DIRECT`); });
    cr.ips.forEach((ip) => customRules.push(`  - IP-CIDR,${ip},DIRECT`));
    cr.geoips.forEach((g) => customRules.push(`  - GEOIP,${g},DIRECT`));
    cr.geosites.forEach((g) => customRules.push(`  - GEOSITE,${g},DIRECT`));

    const rulesOutput = customRules.length > 0
        ? customRules.join("\n")
        : `  - DOMAIN-SUFFIX,ir,DIRECT\n  - DOMAIN-KEYWORD,gov.ir,DIRECT\n  - DOMAIN-SUFFIX,fa,DIRECT\n  - GEOIP,IR,DIRECT`;

    return `mixed-port: 7890\nipv6: true\nallow-lan: false\nmode: rule\nlog-level: warning\nproxies:\n${proxies.join("\n")}\n\n${groupsYaml}\nrules:\n${rulesOutput}\n  - MATCH,✅ Selector\n`;
}

export async function buildClashJsonProfile(hostName, targetSub = null, allowInsecure = false) {
    const proxiesArr = [];
    const dynamicTags = [];
    const fakeNames = getFakeConfigNames(targetSub);
    fakeNames.forEach((name) => {
        proxiesArr.push({ name, type: "trojan", server: "127.0.0.1", port: 80, password: state.activeDeviceId, tls: false, udp: true });
    });

    const unified = await generateUnifiedProxies(hostName, targetSub, allowInsecure);
    const countryGroups = new Map();

    unified.forEach((p) => {
        dynamicTags.push(p.tag);
        const cKey = p.geo.country || "Unknown";
        if (!countryGroups.has(cKey)) countryGroups.set(cKey, { flag: p.geo.flag || "🌐", proxies: [] });
        countryGroups.get(cKey).proxies.push(p.tag);

        if (p.proto === "vless") {
            proxiesArr.push({
                name: p.tag,
                type: "vless",
                server: p.server,
                port: p.port,
                uuid: p.uuid,
                udp: true,
                tls: p.tls,
                servername: p.servername,
                "client-fingerprint": state.sysConfig.agent || "random",
                "skip-cert-verify": allowInsecure,
                network: "ws",
                "ws-opts": { path: p.path, headers: { Host: p.servername } },
            });
        } else {
            proxiesArr.push({
                name: p.tag,
                type: "trojan",
                server: p.server,
                port: p.port,
                password: p.password,
                udp: true,
                tls: p.tls,
                sni: p.servername,
                "client-fingerprint": state.sysConfig.agent || "random",
                "skip-cert-verify": allowInsecure,
                network: "ws",
                "ws-opts": { path: p.path, headers: { Host: p.servername } },
            });
        }
    });

    const parsedUpstream = parseVlessUri(state.sysConfig.upstreamUri);
    if (parsedUpstream) {
        const upProxy = upstreamToClashProxy(parsedUpstream);
        proxiesArr.unshift(upProxy);
        dynamicTags.unshift(upProxy.name);
    }

    const groupsJson = [
        { name: "✅ Selector", type: "select", proxies: ["⚡ Fastest", "🖐 Manual"] },
        { name: "⚡ Fastest", type: "url-test", url: "https://www.gstatic.com/generate_204", interval: 30, proxies: [...dynamicTags] },
        { name: "🖐 Manual", type: "select", proxies: [...dynamicTags] },
    ];

    countryGroups.forEach((info, country) => {
        const groupName = `${info.flag} ${country}`;
        groupsJson[0].proxies.push(groupName);
        groupsJson.push({ name: groupName, type: "url-test", url: "https://www.gstatic.com/generate_204", interval: 30, proxies: info.proxies });
    });

    return {
        "mixed-port": 7890,
        ipv6: true,
        mode: "rule",
        proxies: proxiesArr,
        "proxy-groups": groupsJson,
        rules: ["MATCH,✅ Selector"],
    };
}

export async function buildSingBoxJsonProfile(hostName, targetSub = null, allowInsecure = false) {
    const outboundsArr = [];
    const dynamicTags = [];
    const fakeNames = getFakeConfigNames(targetSub);
    fakeNames.forEach((name) => {
        outboundsArr.push({ type: "direct", tag: name });
    });

    const unified = await generateUnifiedProxies(hostName, targetSub, allowInsecure);
    unified.forEach((p) => {
        dynamicTags.push(p.tag);
        if (p.proto === "vless") {
            outboundsArr.push({
                type: "vless",
                tag: p.tag,
                server: p.server,
                server_port: p.port,
                uuid: p.uuid,
                network: "tcp",
                tls: { enabled: p.tls, server_name: p.servername, insecure: allowInsecure, utls: { enabled: true, fingerprint: "randomized" } },
                transport: { type: "ws", path: p.path, headers: { Host: p.servername } },
            });
        } else {
            outboundsArr.push({
                type: "trojan",
                tag: p.tag,
                server: p.server,
                server_port: p.port,
                password: p.password,
                network: "tcp",
                tls: { enabled: p.tls, server_name: p.servername, insecure: allowInsecure, utls: { enabled: true, fingerprint: "randomized" } },
                transport: { type: "ws", path: p.path, headers: { Host: p.servername } },
            });
        }
    });

    const parsedUpstream = parseVlessUri(state.sysConfig.upstreamUri);
    if (parsedUpstream) {
        const upstreamOb = upstreamToSingboxOb(parsedUpstream);
        outboundsArr.forEach((ob) => { if (ob.type !== "direct") ob.detour = upstreamOb.tag; });
        outboundsArr.unshift(upstreamOb);
    }

    await fetchTemplates();
    if (singboxTemplate) {
        const tpl = JSON.parse(JSON.stringify(singboxTemplate));
        const newOutbounds = [];
        const allProxies = outboundsArr.map((o) => o.tag);
        for (const ob of tpl.outbounds || []) {
            if (ob === "__OUTBOUNDS__") newOutbounds.push(...outboundsArr);
            else if (ob.outbounds && ob.outbounds.includes("{all_proxies}")) {
                const obCpy = { ...ob, outbounds: ob.outbounds.flatMap((t) => t === "{all_proxies}" ? allProxies : [t]) };
                newOutbounds.push(obCpy);
            } else {
                newOutbounds.push(ob);
            }
        }
        tpl.outbounds = newOutbounds;
        return tpl;
    }

    return { log: { disabled: false, level: "warn" }, inbounds: [], outbounds: outboundsArr, route: { rules: [] } };
}

export async function buildVJsonProfile(hostName, targetSub = null, allowInsecure = false) {
    const outboundsArr = [];
    const unified = await generateUnifiedProxies(hostName, targetSub, allowInsecure);

    unified.forEach((p) => {
        if (p.proto === "vless") {
            outboundsArr.push({
                tag: p.tag,
                protocol: "vless",
                settings: { vnext: [{ address: p.server, port: p.port, users: [{ id: p.uuid, encryption: "none" }] }] },
                streamSettings: {
                    network: "ws",
                    security: p.tls ? "tls" : "none",
                    tlsSettings: p.tls ? { serverName: p.servername, allowInsecure } : undefined,
                    wsSettings: { path: p.path, headers: { Host: p.servername } },
                    ...getSegStreamExtra(p.profile),
                },
            });
        } else {
            outboundsArr.push({
                tag: p.tag,
                protocol: "trojan",
                settings: { servers: [{ address: p.server, port: p.port, password: p.password }] },
                streamSettings: {
                    network: "ws",
                    security: p.tls ? "tls" : "none",
                    tlsSettings: p.tls ? { serverName: p.servername, allowInsecure } : undefined,
                    wsSettings: { path: p.path, headers: { Host: p.servername } },
                    ...getSegStreamExtra(p.profile),
                },
            });
        }
    });

    const parsedUpstream = parseVlessUri(state.sysConfig.upstreamUri);
    if (parsedUpstream) {
        const upstreamOb = upstreamToV2RayOb(parsedUpstream);
        outboundsArr.forEach((ob) => { ob.proxySettings = { tag: upstreamOb.tag }; });
        outboundsArr.unshift(upstreamOb);
    }

    await fetchTemplates();
    if (VTemplate) {
        const tpl = JSON.parse(JSON.stringify(VTemplate));
        tpl.outbounds = tpl.outbounds?.flatMap((ob) => ob === "__OUTBOUNDS__" ? outboundsArr : [ob]) || outboundsArr;
        return tpl;
    }
    return { outbounds: outboundsArr };
}
