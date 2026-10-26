// @ts-nocheck
import { state, CURRENT_VERSION, breakerLevel, sleepMs, fetchT, usageTotalBytes, usageDailyBytes, limitReqToBytes, getGamma } from "./src/config.js";
import { safeBtoa, generateHardwareId } from "./src/crypto.js";
import { loadSysConfig, handleLogs } from "./src/db.js";
import { probeDeadRelays, probeGraveyard } from "./src/relays.js";
import { processTelemetryStream, wsRateCheck } from "./src/tunnel.js";
import { handleTelegramWebhook } from "./src/telegram/bot.js";
import { handleAuth, handleConfigSync, handleUsersApi, handleStatsApi, handleUpdateApi, handleApiKeys, handleSyncPanel, isAuthorized } from "./src/api.js";
import { buildUriProfile, buildYamlProfile, buildClashJsonProfile, buildSingBoxJsonProfile, buildVJsonProfile } from "./src/subs/generators.js";
import { getPortalHtml } from "./src/portalHtml.js";
import { getSubscriptionHtml } from "./src/subscriptionHtml.js";
const _0x_key = 79;
const _0x_tbl = ["KCs5", "PCssPigiGSk1Jyg8", "PDsv", "Oj0oPg==", "OyEmKSU=", "Jio=", "PDcjLw==", "PDsvPyg4IDgzLyoh", "Ky8+JA==", "Lj4k", "Oyk=", "Kys9ICQz", "KyEuPw==", "OCcmJQ==", "JyshPA==", "JiApKTM=", "Ky8+JCklKDoj", "JiAuID4uLDs=", "OzwkIQ==", "OyEBIzwvOwsmNSA=", "KiApPxwjPSA=", "YSY5ISc=", "PCIkLy4=", "YD04Lg==", "YD04LjgpOyE3MiwgIA==", "", "PDosPj85HiEzLg==", "YD04LmQ=", "YD04LjgpOyE3MiwgIGI=", "IysjKz8i", "YA==", "YQ==", "Jj0MPjkrMA==", "Oj0oPjg=", "KScjKA==", "IS8gKQ==", "PSs9ICopLA==", "Yg==", "KA==", "Jj0eOSkYJj0zIw==", "Oy8/Ky4+Gj0l", "HBsPHwgYABgTDwoBERgeBw==", "ICU=", "Oys1OA==", "Dh0eCR8Z", "KSs5LyM=", "YD04LjgpOyE3MiwgIGMkPycl", "PDosOD45", "CysrLT4mPQ==", "Li05JT0vDS0xLyYqByk=", "f359fHt6eXhqdnV/fmB8e3p5ZXd2dX9jfXx7enl4d3Z1f359", "PDc+GTgrLi0EJyYnKw==", "PSs8Pw==", "KxwoPTg=", "Iy8+OA8rMA==", "PD4hJT8=", "OyEEHwQZPTouKCI=", "Gw==", "IycgJT8eJjwmKhcqPw==", "IycgJT8OKCErPxcqPw==", "OyELJTMvLQ==", "GiAhJSYjPS0j", "KjY9JTkzBDs=", "bw==", "OyEZJSYvGjw1Lyso", "ISE6", "Li05JT0v", "Jj0dLT45LCw=", "Kyc+LSkmLCwVIyQ8ISM=", "Ky8kIDI=", "Ky8kIDIGICUuMg==", "OzwsKi0jKg==", "PjsiOCo=", "IycgJT8=", "KjY9JTk=", "KjY9JTkvLQ==", "Py84Py4u", "Iicj", "Ii81", "OS8/ZGZnKicrKTdiKiwiLC87YQ==", "OS8/ZGZnKicrKTdiOSw+JSMnL24=", "OS8/ZGZnKicrKTdiPj8lJis7MW4=", "RW5tbGtqaWhnZmVvbnEoIjxpKysnNjxzbzw5JS46IjU2YiwsPmYoLmgwayM6IiFudUBpaGdmZW9ubWxramloZ2ZlcyokOmspJSk0NXhtJmAqPiYlaDM0JCE9JDgiJSdlJiopbyo4Pio+ICcpa3Z/fm9sOD4wJCJ7ZzgnKTgjcGk=", "anVtLiopIi81KTAhKnds", "dGxzcGQuID55TGVvbm1sa2ppaGdmZXNhKSU9dENoZ2Zlb25tbGtqaWh7Iiw5bi4gKjk6dWUgKSo2bSY+OT0hIT9oLSs5Oy4vJ2guMiAiPWAvLiQ9LTVmMSo2OWEQe3k4PxtlOys1OGYnPDwiImUpISM4ZicmJihmKDtjfGJ+aHdCZ2Zlb25tbGtqaWhnZmVvbnE/Oysndg==", "am4YPy4udWc0NiQhcEdsa2ppaGdmZW9ubWxramloezU1LiBz", "bwkPbCcvLzx7aTY/LyNyQWppaGdmZW9ubWxranVnIy8zcQ==", "RW5tbGtqaWhnZmVvbnEoIjxpKysnNjxzbzw5JS46IjU2YiwsPmYoLmgwayM6IiFudUBpaGdmZW9ubWxramloZ2ZlcyokOmspJSk0NXhtJmAqPiYlamc1MTYiKHFpPSAsMy5/b399fG5xaSomJS4oPCI5JS5zaDEnN2djYC8kJiY6ajY3JiMsPjJjcmp5emorJztyQWppaGdmZW9ubWxranVnIy8zcURtbGtqaWhnZmVvbm1wLyM/aCQqJDw9cG4tJiwwZywwPDokKjJnKy0zMSAqIG0lPy8kO2olICE6KD5rPiwwM2sefn49NBZqPS0/MmgiOzkpL2ovJykyaCIhIyNrJz1ldmhwbXBHbGtqaWhnZmVvbm1sa2ppaHs1NS4gbSgqPihlLnd9IXNvOSUmICUuMiArHiEtJWh3HSkqLCInOSkvahkkJih5YD09LSV0Q2hnZmVvbm1sa2ppaGdmZW9yPjwqJHd4aXZ1b2FtrsPUaQ8Femo8PiwidUBpaGdmZW9ubWxraml0aCIsOXA=", "OS8/ZGZnKicrKTdiPTgvKC86O24=", "am4ZIy8rMHRoNTUuIHNGa2ppaGdmZW9ubWxramloZ3o2Py8jcg==", "RW5tbGtqaWhnZmVvbnEoIjxpKysnNjxzbzw5JS46IjU2YiwsPmYoLmgwayM6IiFudUBpaGdmZW9ubWxramloZ2ZlcyokOmspJSk0NXhtJmAqPiYlamc1MTYiKHFpPSAsMy5/b399fG5xaSomJS4oPCI5JS5zaDEnN2djYC8kJiY6ajUwLC0oPzhjcmp5emorJztyQWppaGdmZW9ubWxranVnIy8zcURtbGtqaWhnZmVvbm1wLyM/aCQqJDw9cG4tJiwwZywwPDokKjJnKy0zMSAqIG0lPy8kO2olICE6KD5rPiwwM2sefn49NBZqPS0/MmgiOzkpL2ovJykyaCIhIyNrJz1ldmhwbXBHbGtqaWhnZmVvbm1sa2ppaHs1NS4gbSgqPihlLnd9IXNvIiQOKCErPwkmIyQ4aXQHJ2cCJCYiNGwHIyQhM3pqPD4sInVAaWhnZmVvbm1sa2ppaGdmZXM9PS0ldAgrMy8zKm4ZIy8rMHRoNTUuIHNGa2ppaGdmZW9ubWxrdmYsLjB7", "PzwiOCQpJiQ=", "Jzo5PDhw", "YGE=", "Lj4kHiQ/PS0=", "PDc+DyQkLyEg", "cD04LnY=", "KSIsK3Y4KD8=", "cA==", "aQ==", "EBEYHw4YFgYGCwAQEQ==", "EBEYHw4YFgEDGRo=", "EBEIFBsDGxEYAgQbCxIT", "EBEeGAoeHBsYBQoLCxIT", "EBEZAx8LBRcABBoQ", "EBEBBQYDHRcTCREOAhILCRUW", "EBEBBQYDHRcABBoQ", "EBEZAx8LBRcXFAoIHAgfGBUW", "EBEJDQIGEBcABBoQ", "EBEBBQYDHRcDBwwDFxILCRUW", "EBEJDQIGEBcXFAoIHAgfGBUW", "EBEeFQUJFgYIFAgOAhIOChkMfnMZGg==", "EBEeFQUJFgYIFAgOAhIT", "EBEeFQUJFhoGERoQ", "JyssKC44Og==", "DCEjOC4kPWUTPzUq", "Oys1OGQiPSUrfWUsJiw+OC89dTIyI2J2", "DC8uJC5nCicpMjcgIg==", "ISFgPz8lOy1rZisgYy4tKCIsZGcrMDw6YD4uPCgkLiIkOys=", "ASE5bA0lPCYj", "Ii8kIj8vJykpJSAHIT44", "KSchOC44", "Ii89", "Yw==", "Jzo5PDhwZmcwMTJhOy85JT48ZiQpKA==", "LChgLyQkJy0kMiwhKWAlOw==", "f2B9YntkeQ==", "PSspOSgv", "KTwiIQ==", "LCYsPgglLS0GMg==", "Jzo5PA==", "Jzo5PDhwZmc=", "Py85JCUrJC0=", "PCssPigi", "PCs5", "ByE+OA==", "JyE+OCUrJC0=", "KyshKT8v", "N2MrIzk9KDojIyFiKCI+", "Iis5JCQu", "PSspJTkvKjw=", "KSEhICQ9", "CAsZ", "BwsMCA==", "LSEpNQ==", "OyEeODkjJy8=", "Jj0iICo+LBszJzc7GiQhLg==", "BgALAAINARwYDhEbHg==", "PCc3KQ==", "LCEjKiItGy0gLzY7PDQ=", "LCIoLTk=", "OzwiJiokASk0LgYuLSUp", "Iy8+OBkvJSk+FTIqKz0=", "OC8kOB4kPSEr", "Kys7JSgvACw=", "Ojwh", "Gj4qPiouLA==", "OCsvPyQpIi0z", "YCosPyM=", "YC89JWQrPDwv", "YC89JWQ5MCYk", "YDoq", "YDoqYzgzJysYNiQhKyE=", "YC89JWQmJi80", "YC89JWQ/Oi01NQ==", "YC89JWQ5PSkzNQ==", "YC89JWQ/OSwmMiA=", "YC89JWQhLDE0", "YCcjKC4yZyAzKyk=", "YCooPCclMA==", "YCoiLzg=", "YDkkJyI=", "YCYoIDs=", "Ii8kIj8vJykpJSACISkp", "Ai8kIj8vJykpJSBvJyNsOzgmLzUjNjxibT4uPjsxZyokOys/", "HSs5PjJnCC4zIzc=", "fnx9", "Cw8eBAkFCBoDGRAdAg==", "YCosPyMoJik1ImsnOiAg", "Jzo5PDhwZmc1JzJhKSQ4Iz8rPTQjNywhIzguJD1mJCkoYCc5PzIvKy0sLiBgICwkKiRmJSYvK2AqLD8jKCYpNSJrJzogIA==", "EBEOGRkYDAYTGRMKHB4FBAQWFw==", "EBEFDRgVDQoYEQQdAAQCDBUW", "BgEZEw8I", "cyokOmspJSk0NXhtIy9hfmo5ZXNmNyA7IyguLmR6PyplKSIoNGsjPS0qNWg8Oiw+P2ouKTdrdm1uPjgyJix1ZSQkLCUqPiQ/Jyx9NCItL2V+eHNlfn9qc3difWJ7cmBzJSk3Kys/dno6MWg0KSkmKm0+LCgoYHV1fGN4dWB9cmV4aXRsdGxzcDg6KCZnNTE2IihxaSkmJCg0f2wodXt6fXhzZXin1e6i9MR2Zjs3Jytxcj48KiRpKysnNjxzbzguMj1lNCtnbz05NScvdGokKSkgPHdvLSkofSZzfm1wCS0/KyspNCNlISE5bCglJyYiJTEqKmNsGC89PC4oIjxuOiMlbT1oJSNlPC87KS9kdWc0NiQhcHFjLyM/dg==", "Oys1OGQiPSUrfSYnLz8/Lj50PTMgaHc=", "CS8kIC4uaTwoZikgLylsLys6ICUpJD0q", "AB4ZBQQEGg==", "Di0uKTg5ZAsoKDE9ISFhCiYlJzBrCj0nKiUl", "ZQ==", "Di0uKTg5ZAsoKDE9ISFhCiYlJzBrCCo6JSMvOQ==", "HwEeGGdqBhgTDwoBHQ==", "Di0uKTg5ZAsoKDE9ISFhCiYlJzBrDSovKSk5OQ==", "DCEjOC4kPWUTPzUqYm0NPj4hJzUvPy46JCMl", "HwEeGA==", "e354", "Gj0oPmYLLi0pMg==", "KSIsKw==", "KSE/ISo+", "Di0uKTs+", "HCsuYQ0vPSsvawEqPTk=", "LCIsPyM=", "PCcjK2YoJjA=", "PCcjKyklMQ==", "JycpKCIsMA==", "OXw/LTI=", "PCYsKCQ9OyckLSA7", "PDo/KSI5KCYj", "Iis5LQ==", "IiclIyYl", "KyEuOSYvJzw=", "Oys1OGQiPSUr", "IiE3JScmKA==", "LCY/IyYv", "PC8rLTkj", "JzogIA==", "OScoOw==", "CSE/LiIuLS0p", "JiA+KSg/Oy0=", "Ozw4KQ==", "ISFgPz8lOy0=", "JT0iIg==", "JiArIw==", "PDo/JSUtIC4+", "Oj0oPgUrJC0=", "Oj0oPgIu", "OyE5LScNKw==", "IycgJT8eJjwmKgIt", "Ky8kIDINKw==", "IycgJT8OKCErPwIt", "KjY9JTkzDSkzIw==", "PDosOD45CicjIw==", "PDcjLwUlOyUmKg==", "PDcjLxkrPg==", "PDcjLwUlOyUmKgcuPSh6fw==", "Lj49ICIpKDwuKStgJD4jJXFpKy8nNzwrOXE+Pi9lfw==", "Ni8gIA==", "PCcjKw==", "PCw=", "LCIsPyNnIzsoKA==", "LQ==", "OSQ+IyU=", "OQ==", "PS86", "Ojwk", "Oys1OGQzKCUrfWUsJiw+OC89dTIyI2J2", "Oys1OGQ6JSkuKH5vLSUtOTksPHozMSljdQ==", "OiAmIiQ9Jw==", "PSsrOTgv", "GyEibCYrJzFnNCA+Oyg/Pzk=", "Oy8/PCI+", "PSc=", "PC0lKS8/JS0j", "Ljs5Ix46LSkzIw=="];
const _0x_cache = new Map();
function func_dec(idx) {
  let val = _0x_cache.get(idx);
  if (val !== undefined) return val;
  const bin = atob(_0x_tbl[idx]);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i) ^ (_0x_key ^ i % 11);
  }
  val = new TextDecoder().decode(bytes);
  _0x_cache.set(idx, val);
  return val;
}
function func_a(var_a, var_b, var_c, var_d) {
  let var_e = var_c[func_dec(1)][func_dec(0)](func_dec(2)) || var_c[func_dec(1)][func_dec(0)](func_dec(3)) || var_c[func_dec(1)][func_dec(0)](func_dec(4)) || var_c[func_dec(1)][func_dec(0)](func_dec(5));
  const var_f = [func_dec(6), func_dec(2), func_dec(7), func_dec(8), func_dec(9), func_dec(10), func_dec(11), func_dec(12), func_dec(13), func_dec(14), func_dec(15), func_dec(16)];
  if (var_e && var_f[func_dec(17)](var_e[func_dec(19)]()[func_dec(18)]())) {
    var_e = null;
  }
  const var_g = var_a[func_dec(20)](func_dec(21)) ? var_a[func_dec(22)](0, -5) : var_a;
  const var_h = var_a === var_b || var_g === func_dec(23) || var_g === func_dec(24) || var_g === func_dec(25) + var_b + func_dec(23) || var_g[func_dec(26)](func_dec(27)) || var_g[func_dec(26)](func_dec(28)) || var_g[func_dec(26)](func_dec(25) + var_b + func_dec(27));
  if (!var_e) {
    if (var_g[func_dec(26)](func_dec(25) + var_b + func_dec(27))) {
      var_e = decodeURIComponent(var_g[func_dec(22)]((func_dec(25) + var_b + func_dec(27))[func_dec(29)]));
    } else if (var_g[func_dec(26)](func_dec(27))) {
      var_e = decodeURIComponent(var_g[func_dec(22)](5));
    } else if (var_g[func_dec(26)](func_dec(28))) {
      var_e = decodeURIComponent(var_g[func_dec(22)](14));
    } else if (var_g[func_dec(26)](func_dec(25) + var_b + func_dec(30))) {
      const var_i = decodeURIComponent(var_g[func_dec(22)](var_b[func_dec(29)] + 1));
      if (!var_i[func_dec(26)](func_dec(8)) && !var_i[func_dec(26)](func_dec(9)) && !var_i[func_dec(26)](func_dec(10))) {
        var_e = var_i;
      }
    } else if (var_g[func_dec(29)] > 1 && var_g !== func_dec(30) && !var_g[func_dec(17)](func_dec(31))) {
      const var_j = decodeURIComponent(var_g[func_dec(22)](1));
      if (Array[func_dec(32)](var_d[func_dec(33)])) {
        const var_k = var_d[func_dec(33)][func_dec(34)](var_l => var_l[func_dec(35)][func_dec(19)]() === var_j[func_dec(19)]() || var_l[func_dec(5)][func_dec(19)]() === var_j[func_dec(19)]() || var_l[func_dec(5)][func_dec(36)](new RegExp(func_dec(37), func_dec(38)), func_dec(25))[func_dec(19)]() === var_j[func_dec(36)](new RegExp(func_dec(37), func_dec(38)), func_dec(25))[func_dec(19)]());
        if (var_k) var_e = var_k[func_dec(35)];
      }
    }
  }
  if (var_e && var_f[func_dec(17)](var_e[func_dec(19)]()[func_dec(18)]())) {
    var_e = null;
  }
  return {
    [func_dec(39)]: var_h || Boolean(var_e),
    [func_dec(40)]: var_e
  };
}
async function func_b(var_m, var_n, var_o, var_p, var_q) {
  let var_r = func_dec(25);
  if (var_q[func_dec(41)]) {
    try {
      const var_ar = await fetchT(var_q[func_dec(41)], {}, 4000);
      if (var_ar[func_dec(42)]) var_r = await var_ar[func_dec(43)]();
    } catch (var_as) {}
  }
  if (!var_r) {
    var_r = getSubscriptionHtml();
  }
  if (!var_r && var_q[func_dec(44)]) {
    try {
      const var_at = await var_q[func_dec(44)][func_dec(45)](new Request(new URL(func_dec(46), var_n)));
      if (var_at[func_dec(47)] < 400) var_r = await var_at[func_dec(43)]();
    } catch (var_au) {}
  }
  const var_s = var_o[func_dec(35)] || func_dec(48);
  const var_t = var_o[func_dec(5)] || state[func_dec(49)] || func_dec(50);
  const var_u = var_t[func_dec(36)](new RegExp(func_dec(37), func_dec(38)), func_dec(25))[func_dec(19)]();
  const var_v = state[func_dec(51)]?.[func_dec(33)]?.[var_u] || {
    [func_dec(52)]: 0,
    [func_dec(53)]: 0,
    [func_dec(54)]: func_dec(25)
  };
  const var_w = new Date()[func_dec(56)]()[func_dec(55)](func_dec(57))[0];
  const var_x = usageTotalBytes(var_v);
  const var_y = usageDailyBytes(var_v, var_w);
  const var_z = limitReqToBytes(var_o[func_dec(58)] || 0);
  const var_aa = limitReqToBytes(var_o[func_dec(59)] || 0);
  const var_ab = (var_x / 1073741824)[func_dec(60)](2);
  const var_ac = var_o[func_dec(58)] ? (var_z / 1073741824)[func_dec(60)](2) : func_dec(61);
  const var_ad = (var_y / 1073741824)[func_dec(60)](2);
  const var_ae = var_o[func_dec(59)] ? (var_aa / 1073741824)[func_dec(60)](2) : func_dec(61);
  let var_af = func_dec(61);
  let var_ag = false;
  if (var_o[func_dec(62)]) {
    const var_av = new Date(var_o[func_dec(62)]);
    var_af = var_av[func_dec(56)]()[func_dec(55)](func_dec(57))[0] + func_dec(63) + var_av[func_dec(64)]()[func_dec(55)](func_dec(63))[0][func_dec(22)](0, 5);
    if (Date[func_dec(65)]() > var_o[func_dec(62)]) {
      var_ag = true;
    }
  }
  let var_ah = func_dec(66);
  if (var_o[func_dec(67)] && var_o[func_dec(68)]) {
    const var_aw = var_o[func_dec(68)][func_dec(19)]();
    if (var_aw[func_dec(17)](func_dec(69))) var_ah = func_dec(70);else if (var_aw[func_dec(17)](func_dec(71)) || var_aw[func_dec(17)](func_dec(72)) || var_aw[func_dec(17)](func_dec(73))) var_ah = func_dec(73);else if (var_aw[func_dec(17)](func_dec(74))) var_ah = func_dec(75);else var_ah = func_dec(76);
  } else if (var_o[func_dec(67)]) {
    var_ah = func_dec(76);
  } else if (var_ag) {
    var_ah = func_dec(75);
  } else if (var_o[func_dec(58)] && var_x >= var_z) {
    var_ah = func_dec(73);
  } else if (var_o[func_dec(59)] && var_y >= var_aa) {
    var_ah = func_dec(70);
  }
  let var_ai = func_dec(25);
  if (var_o[func_dec(58)] && var_z > 0) {
    const var_ax = Math[func_dec(77)](100, Math[func_dec(78)](0, var_x / var_z * 100));
    const var_ay = var_ax > 90 ? func_dec(79) : var_ax > 75 ? func_dec(80) : func_dec(81);
    const var_az = (Math[func_dec(78)](0, var_z - var_x) / 1073741824)[func_dec(60)](2);
    var_ai = func_dec(82) + var_ax[func_dec(60)](1) + func_dec(83) + var_ay + func_dec(84) + var_ax[func_dec(60)](1) + func_dec(85) + var_az + func_dec(86);
  } else {
    var_ai = func_dec(87);
  }
  let var_aj = func_dec(25);
  if (var_o[func_dec(59)] && var_aa > 0) {
    const var_ba = Math[func_dec(77)](100, Math[func_dec(78)](0, var_y / var_aa * 100));
    const var_bb = var_ba > 90 ? func_dec(79) : var_ba > 75 ? func_dec(80) : func_dec(88);
    const var_bc = (Math[func_dec(78)](0, var_aa - var_y) / 1073741824)[func_dec(60)](2);
    var_aj = func_dec(82) + var_ba[func_dec(60)](1) + func_dec(83) + var_bb + func_dec(84) + var_ba[func_dec(60)](1) + func_dec(89) + var_bc + func_dec(86);
  } else {
    var_aj = func_dec(90);
  }
  const var_ak = var_n[func_dec(91)] || func_dec(92);
  const var_al = func_dec(25) + var_ak + func_dec(93) + var_p + func_dec(30) + encodeURI(state[func_dec(95)][func_dec(94)]) + func_dec(25);
  const var_am = Array[func_dec(32)](state[func_dec(95)][func_dec(33)]) && state[func_dec(95)][func_dec(33)][func_dec(29)] > 0;
  const var_an = var_o[func_dec(35)] === func_dec(48) && !var_am ? var_al : func_dec(25) + var_al + func_dec(96) + encodeURIComponent(var_o[func_dec(35)] || var_o[func_dec(5)]) + func_dec(25);
  const var_ao = safeBtoa(var_an);
  const var_ap = func_dec(25) + var_an + func_dec(25) + (var_an[func_dec(17)](func_dec(98)) ? func_dec(99) : func_dec(98)) + func_dec(97);
  const var_aq = var_r[func_dec(36)](new RegExp(func_dec(100), func_dec(38)), var_s)[func_dec(36)](new RegExp(func_dec(101), func_dec(38)), var_t)[func_dec(36)](new RegExp(func_dec(102), func_dec(38)), var_af)[func_dec(36)](new RegExp(func_dec(103), func_dec(38)), var_ah)[func_dec(36)](new RegExp(func_dec(104), func_dec(38)), var_ab)[func_dec(36)](new RegExp(func_dec(105), func_dec(38)), var_ac)[func_dec(36)](new RegExp(func_dec(106), func_dec(38)), var_ac)[func_dec(36)](new RegExp(func_dec(107), func_dec(38)), var_ai)[func_dec(36)](new RegExp(func_dec(108), func_dec(38)), var_ad)[func_dec(36)](new RegExp(func_dec(109), func_dec(38)), var_ae)[func_dec(36)](new RegExp(func_dec(110), func_dec(38)), var_aj)[func_dec(36)](new RegExp(func_dec(111), func_dec(38)), var_ao)[func_dec(36)](new RegExp(func_dec(112), func_dec(38)), var_an)[func_dec(36)](new RegExp(func_dec(113), func_dec(38)), var_ap);
  return new Response(var_aq, {
    [func_dec(114)]: {
      [func_dec(115)]: func_dec(116),
      [func_dec(117)]: func_dec(118)
    }
  });
}
async function func_c(var_bd, var_be) {
  if (breakerLevel() >= 1) return new Response(func_dec(119), {
    [func_dec(47)]: 404
  });
  const var_bf = state[func_dec(95)][func_dec(120)] ? state[func_dec(95)][func_dec(120)][func_dec(55)](func_dec(123))[func_dec(122)](var_bj => var_bj[func_dec(18)]())[func_dec(121)](Boolean) : [func_dec(124)];
  const var_bg = var_bd[func_dec(114)][func_dec(0)](func_dec(125)) || func_dec(126);
  const var_bh = Array[func_dec(128)](var_bg)[func_dec(127)]((var_bk, var_bl) => var_bk + var_bl[func_dec(129)](0), 0);
  const var_bi = var_bf[var_bh % var_bf[func_dec(29)]][func_dec(26)](func_dec(130)) ? var_bf[var_bh % var_bf[func_dec(29)]] : func_dec(131) + var_bf[var_bh % var_bf[func_dec(29)]] + func_dec(25);
  try {
    const var_bm = new URL(var_bi);
    if (var_be[func_dec(132)] !== func_dec(30)) var_bm[func_dec(132)] = var_be[func_dec(132)];
    var_bm[func_dec(133)] = var_be[func_dec(133)];
    const var_bn = new Headers(var_bd[func_dec(114)]);
    var_bn[func_dec(134)](func_dec(135), var_bm[func_dec(136)]);
    var_bn[func_dec(137)](func_dec(125));
    var_bn[func_dec(137)](func_dec(138));
    const var_bo = {
      [func_dec(139)]: var_bd[func_dec(139)],
      [func_dec(114)]: var_bn,
      [func_dec(140)]: func_dec(141)
    };
    if (var_bd[func_dec(139)] !== func_dec(142) && var_bd[func_dec(139)] !== func_dec(143)) var_bo[func_dec(144)] = var_bd[func_dec(144)];
    return await fetchT(new Request(var_bm[func_dec(145)](), var_bo));
  } catch (var_bp) {
    return new Response(func_dec(119), {
      [func_dec(47)]: 404
    });
  }
}
export default {
  [func_dec(45)]: async function (var_bq, var_br, var_bs) {
    try {
      if (!state[func_dec(146)]) state[func_dec(146)] = Date[func_dec(65)]();
      state[func_dec(147)]++;
      if (state[func_dec(149)][func_dec(148)] > 10000) {
        state[func_dec(149)][func_dec(150)]();
        state[func_dec(151)][func_dec(150)]();
      }
      await loadSysConfig(var_br, var_bs);
      const var_bt = Date[func_dec(65)]();
      if (var_bt - state[func_dec(152)] > 60000) {
        state[func_dec(152)] = var_bt;
        if (var_bs?.[func_dec(153)]) {
          var_bs[func_dec(153)]((async () => {
            try {
              await probeDeadRelays(var_br);
            } catch (var_cd) {}
            try {
              await probeGraveyard(var_br);
            } catch (var_ce) {}
          })());
        }
      }
      state[func_dec(49)] = state[func_dec(95)][func_dec(154)] || generateHardwareId(state[func_dec(95)][func_dec(94)]);
      const var_bu = new URL(var_bq[func_dec(155)]);
      const var_bv = var_bq[func_dec(114)][func_dec(0)](func_dec(156));
      const var_bw = var_bv && var_bv[func_dec(19)]() === func_dec(157);
      let var_bx = var_bu[func_dec(132)];
      if (var_bx[func_dec(20)](func_dec(30)) && var_bx[func_dec(29)] > 1) var_bx = var_bx[func_dec(22)](0, -1);
      const var_by = func_dec(30) + encodeURI(state[func_dec(95)][func_dec(94)]) + func_dec(25);
      const {
        [func_dec(39)]: var_bz,
        [func_dec(40)]: var_ca
      } = func_a(var_bx, var_by, var_bu, state[func_dec(95)]);
      const var_cb = var_bz || var_bx === func_dec(25) + var_by + func_dec(158) || var_bx === func_dec(25) + var_by + func_dec(159) || var_bx === func_dec(25) + var_by + func_dec(160) || var_bx === func_dec(25) + var_by + func_dec(161) || var_bx === func_dec(25) + var_by + func_dec(162) || var_bx === func_dec(25) + var_by + func_dec(163) || var_bx[func_dec(20)](func_dec(160)) || var_bx[func_dec(20)](func_dec(164)) || var_bx[func_dec(20)](func_dec(165)) || var_bx[func_dec(20)](func_dec(166)) || var_bx[func_dec(20)](func_dec(167));
      const var_cc = var_bx === func_dec(30) || var_bx === func_dec(168) || var_bx === func_dec(169) || var_bx === func_dec(170) || var_bx === func_dec(171) || var_bx === func_dec(172);
      if (var_cc && !var_bw) {
        if (var_br[func_dec(44)]) {
          try {
            const var_cf = await var_br[func_dec(44)][func_dec(45)](var_bq);
            if (var_cf[func_dec(47)] < 400) return var_cf;
          } catch (var_cg) {}
        }
        return new Response(getPortalHtml(), {
          [func_dec(114)]: {
            [func_dec(115)]: func_dec(116)
          }
        });
      }
      if (!var_bw && !var_cb) {
        return func_c(var_bq, var_bu);
      }
      if (state[func_dec(95)][func_dec(173)] && (var_bw || var_bx === var_by)) {
        if (var_bw) return new Response(null, {
          [func_dec(47)]: 503
        });
        return new Response(func_dec(174), {
          [func_dec(47)]: 503,
          [func_dec(114)]: {
            [func_dec(175)]: func_dec(176)
          }
        });
      }
      if (!var_bw) {
        if (var_bx === func_dec(25) + var_by + func_dec(158)) {
          let var_ch = func_dec(25);
          if (var_br[func_dec(177)]) {
            try {
              const var_ci = await fetchT(var_br[func_dec(177)], {}, 4000);
              if (var_ci[func_dec(42)]) var_ch = await var_ci[func_dec(43)]();
            } catch (var_cj) {}
          }
          if (!var_ch && var_br[func_dec(44)]) {
            try {
              const var_ck = await var_br[func_dec(44)][func_dec(45)](new Request(new URL(func_dec(178), var_bu)));
              if (var_ck[func_dec(47)] < 400) var_ch = await var_ck[func_dec(43)]();
            } catch (var_cl) {}
          }
          if (!var_ch) {
            try {
              const var_cm = func_dec(179);
              const var_cn = await fetchT(var_cm, {}, 5000);
              if (var_cn[func_dec(42)]) var_ch = await var_cn[func_dec(43)]();
            } catch (var_co) {}
          }
          if (var_ch) {
            var_ch = var_ch[func_dec(36)](new RegExp(func_dec(180), func_dec(38)), CURRENT_VERSION);
            var_ch = var_ch[func_dec(36)](func_dec(181), var_br[func_dec(182)] !== undefined ? func_dec(25) : func_dec(183));
            return new Response(var_ch, {
              [func_dec(114)]: {
                [func_dec(115)]: func_dec(184)
              }
            });
          }
          return new Response(func_dec(185), {
            [func_dec(47)]: 502
          });
        }
        if (var_bx === func_dec(25) + var_by + func_dec(159)) return await handleAuth(var_bq, var_bu[func_dec(136)], var_bs, var_br);
        if (var_bx === func_dec(25) + var_by + func_dec(160) || var_bx[func_dec(20)](func_dec(160))) {
          if (var_bq[func_dec(139)] === func_dec(186)) {
            return new Response(null, {
              [func_dec(47)]: 204,
              [func_dec(114)]: {
                [func_dec(187)]: func_dec(188),
                [func_dec(189)]: func_dec(190),
                [func_dec(191)]: func_dec(192)
              }
            });
          }
          if (var_bq[func_dec(139)] !== func_dec(193)) return new Response(func_dec(194), {
            [func_dec(47)]: 405
          });
          const var_cp = await handleConfigSync(var_bq, var_br, var_bs);
          var_cp[func_dec(114)][func_dec(134)](func_dec(187), func_dec(188));
          return var_cp;
        }
        if (var_bx === func_dec(25) + var_by + func_dec(163)) return await handleLogs(var_bq, var_br, isAuthorized);
        if (var_bx[func_dec(20)](func_dec(164))) return await handleUsersApi(var_bq, var_br, var_bs);
        if (var_bx[func_dec(20)](func_dec(165))) return await handleStatsApi(var_bq, var_br);
        if (var_bx[func_dec(20)](func_dec(166))) return await handleUpdateApi(var_bq, var_br, var_bs);
        if (var_bx[func_dec(20)](func_dec(167))) return await handleApiKeys(var_bq, var_br, var_bs);
        if (var_bx === func_dec(25) + var_by + func_dec(162)) return await handleSyncPanel(var_bq, var_br, var_bs);
        if (var_bx === func_dec(25) + var_by + func_dec(161)) return await handleTelegramWebhook(var_bq, var_br, var_bu[func_dec(136)], var_bs);
        if (var_bz) {
          const var_cq = (var_bq[func_dec(114)][func_dec(0)](func_dec(195)) || func_dec(25))[func_dec(19)]();
          const var_cr = var_bq[func_dec(114)][func_dec(0)](func_dec(135)) || var_bu[func_dec(136)];
          const var_cs = Array[func_dec(32)](state[func_dec(95)][func_dec(33)]) && state[func_dec(95)][func_dec(33)][func_dec(29)] > 0;
          let var_ct = null;
          let var_cu = false;
          if (var_cs) {
            if (var_ca) {
              const var_dj = var_ca[func_dec(18)]();
              var_ct = state[func_dec(95)][func_dec(33)][func_dec(34)](var_dk => var_dk[func_dec(35)][func_dec(19)]() === var_dj[func_dec(19)]() || var_dk[func_dec(5)][func_dec(19)]() === var_dj[func_dec(19)]() || var_dk[func_dec(5)][func_dec(36)](new RegExp(func_dec(37), func_dec(38)), func_dec(25))[func_dec(19)]() === var_dj[func_dec(36)](new RegExp(func_dec(37), func_dec(38)), func_dec(25))[func_dec(19)]());
              if (var_ct) var_cu = true;
            }
            if (!var_ct && state[func_dec(95)][func_dec(33)][func_dec(29)] > 0) {
              var_ct = state[func_dec(95)][func_dec(33)][0];
              var_cu = true;
            }
          } else {
            var_cu = true;
            var_ct = {
              [func_dec(5)]: state[func_dec(49)],
              [func_dec(35)]: func_dec(48)
            };
          }
          const var_cv = (var_bu[func_dec(1)][func_dec(0)](func_dec(196)) || var_bu[func_dec(1)][func_dec(0)](func_dec(197)) || func_dec(25))[func_dec(19)]();
          const var_cw = (var_bq[func_dec(114)][func_dec(0)](func_dec(198)) || func_dec(25))[func_dec(19)]();
          const var_cx = (var_bq[func_dec(114)][func_dec(0)](func_dec(199)) || func_dec(25))[func_dec(19)]();
          const var_cy = Boolean(var_cv);
          const var_cz = var_cq[func_dec(17)](func_dec(200)) || var_cq[func_dec(17)](func_dec(201)) || var_cq[func_dec(17)](func_dec(202)) || var_cq[func_dec(17)](func_dec(203)) || var_cq[func_dec(17)](func_dec(204)) || var_cq[func_dec(17)](func_dec(205)) || var_cq[func_dec(17)](func_dec(206)) || var_cq[func_dec(17)](func_dec(207)) || var_cq[func_dec(17)](func_dec(208)) || var_cq[func_dec(17)](getGamma());
          const var_da = !var_cy && !var_cz && (var_cx === func_dec(209) || var_cw[func_dec(17)](func_dec(210)) || var_cq[func_dec(17)](func_dec(211)) || var_cq[func_dec(17)](func_dec(212)) || var_cq[func_dec(17)](func_dec(213)));
          if (var_da || var_cv === func_dec(214) || var_bu[func_dec(1)][func_dec(0)](func_dec(215)) === func_dec(214)) {
            if (var_cu || var_cs && !var_ct) {
              const var_dl = var_ct || state[func_dec(95)][func_dec(33)][0];
              return await func_b(var_bq, var_bu, var_dl, var_cr, var_br);
            }
            return func_c(var_bq, var_bu);
          }
          if (var_cs && !var_cu) {
            return new Response(func_dec(216), {
              [func_dec(47)]: 403
            });
          }
          const var_db = var_bu[func_dec(1)][func_dec(0)](func_dec(217)) === func_dec(218);
          const var_dc = new Headers();
          var_dc[func_dec(134)](func_dec(117), func_dec(219));
          var_dc[func_dec(134)](func_dec(187), func_dec(188));
          if (var_cv === func_dec(220) || var_cv === func_dec(221)) {
            const var_dm = var_ct?.[func_dec(35)] || func_dec(48);
            const var_dn = var_ct?.[func_dec(5)] || state[func_dec(49)] || func_dec(50);
            const var_do = var_dn[func_dec(36)](new RegExp(func_dec(37), func_dec(38)), func_dec(25))[func_dec(19)]();
            const var_dp = state[func_dec(51)]?.[func_dec(33)]?.[var_do] || {
              [func_dec(52)]: 0,
              [func_dec(53)]: 0,
              [func_dec(54)]: func_dec(25)
            };
            const var_dq = new Date()[func_dec(56)]()[func_dec(55)](func_dec(57))[0];
            const var_dr = usageTotalBytes(var_dp);
            const var_ds = usageDailyBytes(var_dp, var_dq);
            const var_dt = limitReqToBytes(var_ct?.[func_dec(58)] || 0);
            const var_du = limitReqToBytes(var_ct?.[func_dec(59)] || 0);
            const var_dv = var_bu[func_dec(91)] || func_dec(92);
            const var_dw = func_dec(25) + var_dv + func_dec(93) + var_cr + func_dec(30) + encodeURI(state[func_dec(95)][func_dec(94)]) + func_dec(25);
            const var_dx = Array[func_dec(32)](state[func_dec(95)][func_dec(33)]) && state[func_dec(95)][func_dec(33)][func_dec(29)] > 0;
            const var_dy = var_ct?.[func_dec(35)] === func_dec(48) && !var_dx ? var_dw : func_dec(25) + var_dw + func_dec(96) + encodeURIComponent(var_ct?.[func_dec(35)] || var_ct?.[func_dec(5)] || func_dec(25)) + func_dec(25);
            const var_dz = func_dec(25) + var_dy + func_dec(25) + (var_dy[func_dec(17)](func_dec(98)) ? func_dec(99) : func_dec(98)) + func_dec(97);
            let var_ea = func_dec(61);
            if (var_ct?.[func_dec(62)]) {
              const var_eb = new Date(var_ct[func_dec(62)]);
              var_ea = var_eb[func_dec(56)]()[func_dec(55)](func_dec(57))[0] + func_dec(63) + var_eb[func_dec(64)]()[func_dec(55)](func_dec(63))[0][func_dec(22)](0, 5);
            }
            return new Response(JSON[func_dec(222)]({
              [func_dec(223)]: var_dm,
              [func_dec(224)]: var_dn,
              [func_dec(225)]: (var_dr / 1073741824)[func_dec(60)](2),
              [func_dec(226)]: var_ct?.[func_dec(58)] ? (var_dt / 1073741824)[func_dec(60)](2) : func_dec(61),
              [func_dec(227)]: (var_ds / 1073741824)[func_dec(60)](2),
              [func_dec(228)]: var_ct?.[func_dec(59)] ? (var_du / 1073741824)[func_dec(60)](2) : func_dec(61),
              [func_dec(229)]: var_ea,
              [func_dec(230)]: var_ct?.[func_dec(67)] ? func_dec(76) : func_dec(66),
              [func_dec(231)]: var_dy,
              [func_dec(232)]: var_dz,
              [func_dec(233)]: safeBtoa(var_dy)
            }), {
              [func_dec(114)]: {
                [func_dec(115)]: func_dec(234),
                [func_dec(187)]: func_dec(188)
              }
            });
          }
          let var_dd = var_cv === func_dec(200) || var_cv === func_dec(235) || var_cv === func_dec(207);
          let var_de = var_cv === func_dec(236) || var_cv === func_dec(202) || var_cv === func_dec(201) || var_cv === func_dec(237);
          let var_df = var_cv === func_dec(238) || var_cv === func_dec(239);
          let var_dg = var_cv === func_dec(240) || var_cv === func_dec(241);
          let var_dh = var_cv === func_dec(242) || var_cv === func_dec(43) || var_cv === func_dec(243);
          if (!var_dd && !var_de && !var_df && !var_dg && !var_dh) {
            if (var_cq[func_dec(17)](getGamma()) || var_cq[func_dec(17)](func_dec(207)) || var_cq[func_dec(17)](func_dec(208))) var_dd = true;else if (var_cq[func_dec(17)](func_dec(201)) || var_cq[func_dec(17)](func_dec(202)) || var_cq[func_dec(17)](func_dec(203))) var_de = true;
          }
          const var_di = var_ct?.[func_dec(35)] || var_ca;
          if (var_dd) {
            var_dc[func_dec(134)](func_dec(115), func_dec(244));
            return new Response(await buildYamlProfile(var_cr, var_di, var_db), {
              [func_dec(114)]: var_dc
            });
          } else if (var_de) {
            var_dc[func_dec(134)](func_dec(115), func_dec(234));
            return new Response(JSON[func_dec(222)](await buildSingBoxJsonProfile(var_cr, var_di, var_db), null, 2), {
              [func_dec(114)]: var_dc
            });
          } else if (var_df) {
            var_dc[func_dec(134)](func_dec(115), func_dec(234));
            return new Response(JSON[func_dec(222)](await buildClashJsonProfile(var_cr, var_di, var_db), null, 2), {
              [func_dec(114)]: var_dc
            });
          } else if (var_dg) {
            var_dc[func_dec(134)](func_dec(115), func_dec(234));
            return new Response(JSON[func_dec(222)](await buildVJsonProfile(var_cr, var_di, var_db), null, 2), {
              [func_dec(114)]: var_dc
            });
          } else if (var_dh) {
            var_dc[func_dec(134)](func_dec(115), func_dec(245));
            return new Response(await buildUriProfile(var_cr, var_di, var_db), {
              [func_dec(114)]: var_dc
            });
          } else {
            var_dc[func_dec(134)](func_dec(115), func_dec(245));
            return new Response(safeBtoa(await buildUriProfile(var_cr, var_di, var_db)), {
              [func_dec(114)]: var_dc
            });
          }
        }
      }
      if (var_bw) {
        if (state[func_dec(95)][func_dec(67)]) return new Response(null, {
          [func_dec(47)]: 503
        });
        const var_ec = var_bq[func_dec(114)][func_dec(0)](func_dec(125)) || func_dec(246);
        const var_ed = wsRateCheck(var_ec);
        if (var_ed === func_dec(247)) return new Response(func_dec(248), {
          [func_dec(47)]: 429
        });
        if (var_ed === func_dec(249)) await sleepMs(1500);
        let var_ee = -1;
        const var_ef = var_bu[func_dec(1)][func_dec(0)](func_dec(250));
        if (var_ef !== null) var_ee = parseInt(var_ef, 10);
        return await processTelemetryStream(var_br, var_bs, var_ee);
      }
      return new Response(null, {
        [func_dec(47)]: 404
      });
    } catch (var_eg) {
      return new Response(null, {
        [func_dec(47)]: 404
      });
    } finally {
      state[func_dec(147)] = Math[func_dec(78)](0, state[func_dec(147)] - 1);
    }
  },
  [func_dec(251)]: async function (var_eh, var_ei, var_ej) {
    try {
      await loadSysConfig(var_ei, var_ej);
      if (state[func_dec(95)][func_dec(252)]) {}
    } catch (var_ek) {}
  }
};