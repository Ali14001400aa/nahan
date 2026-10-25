/*
 * Project Nahan - IP Geo & Flag Resolution
 */

import { fetchT } from "../config.js";

export const ipGeoCache = new Map();

export async function preloadIpFlags(cleanIpsList, proxyIpsList) {
    const uniqueIps = new Set([...cleanIpsList, ...proxyIpsList]);
    const uncached = Array.from(uniqueIps).filter((ip) => ip && !ipGeoCache.has(ip));
    for (let i = 0; i < uncached.length; i += 100) {
        const batch = uncached.slice(i, i + 100);
        const queries = batch.map((ip) => {
            const clean = ip.split(":")[0].replace(/[\[\]]/g, "").split("#")[0].trim();
            return { query: clean, fields: "status,country,countryCode,city,isp,org" };
        });
        try {
            const res = await fetchT("http://ip-api.com/batch?fields=status,country,countryCode,city,isp,org", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(queries),
            });
            const results = await res.json();
            batch.forEach((ip, idx) => {
                const data = results[idx];
                if (data && data.status === "success") {
                    const codePoints = data.countryCode
                        .toUpperCase()
                        .split("")
                        .map((char) => 127397 + char.charCodeAt());
                    ipGeoCache.set(ip, {
                        flag: String.fromCodePoint(...codePoints),
                        country: data.country || "Unknown",
                        countryCode: data.countryCode || "",
                        city: data.city || "",
                        isp: data.isp || data.org || "",
                    });
                } else {
                    ipGeoCache.set(ip, { flag: "🌐", country: "Unknown", countryCode: "", city: "", isp: "" });
                }
            });
        } catch (e) {
            batch.forEach((ip) => {
                if (!ipGeoCache.has(ip)) {
                    ipGeoCache.set(ip, { flag: "🌐", country: "Unknown", countryCode: "", city: "", isp: "" });
                }
            });
        }
    }
}

export function getGeoInfo(ip) {
    if (!ip) return { flag: "🌐", country: "Unknown", countryCode: "", city: "", isp: "" };
    const clean = ip.split(":")[0].replace(/[\[\]]/g, "").split("#")[0].trim();
    return ipGeoCache.get(ip) || ipGeoCache.get(clean) || { flag: "🌐", country: "Unknown", countryCode: "", city: "", isp: "" };
}

export function getEmojiFlag(ip) {
    return getGeoInfo(ip).flag || "🌐";
}

export async function fetchIpGeoData(ip) {
    if (!ip) return null;
    const clean = ip.split(":")[0].replace(/[\[\]]/g, "").split("#")[0].trim();
    try {
        const res = await fetchT(`http://ip-api.com/json/${clean}?fields=status,country,countryCode,city,isp,org`);
        const data = await res.json();
        if (data && data.status === "success") {
            const codePoints = data.countryCode.toUpperCase().split("").map((c) => 127397 + c.charCodeAt());
            return {
                flag: String.fromCodePoint(...codePoints),
                country: data.country || "Unknown",
                countryCode: data.countryCode || "",
                city: data.city || "",
                isp: data.isp || data.org || "",
            };
        }
    } catch (e) {}
    return null;
}
