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
const _0x_tbl = ["KCs5", "PCssPigiGSk1Jyg8", "PDsv", "Oj0oPg==", "OyEmKSU=", "Jio=", "YD04Lg==", "YD04LjgpOyE3MiwgIA==", "", "PDosPj85HiEzLg==", "YD04LmQ=", "YD04LjgpOyE3MiwgIGI=", "PCIkLy4=", "IysjKz8i", "YA==", "Ky8+JA==", "Lj4k", "Oyk=", "JiAuID4uLDs=", "YQ==", "Jj0MPjkrMA==", "Oj0oPjg=", "KScjKA==", "OyEBIzwvOwsmNSA=", "IS8gKQ==", "PSs9ICopLA==", "Yg==", "KA==", "Jj0eOSkYJj0zIw==", "Oy8/Ky4+Gj0l", "HBsPHwgYABgTDwoBERgeBw==", "ICU=", "Oys1OA==", "Dh0eCR8Z", "KSs5LyM=", "YD04LjgpOyE3MiwgIGMkPycl", "PDosOD45", "CysrLT4mPQ==", "Li05JT0vDS0xLyYqByk=", "f359fHt6eXhqdnV/fmB8e3p5ZXd2dX9jfXx7enl4d3Z1f359", "PDc+GTgrLi0EJyYnKw==", "PSs8Pw==", "KxwoPTg=", "Iy8+OA8rMA==", "PD4hJT8=", "OyEEHwQZPTouKCI=", "Gw==", "IycgJT8eJjwmKhcqPw==", "IycgJT8OKCErPxcqPw==", "OyELJTMvLQ==", "GiAhJSYjPS0j", "KjY9JTkzBDs=", "bw==", "OyEZJSYvGjw1Lyso", "ISE6", "Li05JT0v", "Jj0dLT45LCw=", "Kyc+LSkmLCwVIyQ8ISM=", "Ky8kIDI=", "Ky8kIDIGICUuMg==", "OzwsKi0jKg==", "PjsiOCo=", "IycgJT8=", "KjY9JTk=", "KjY9JTkvLQ==", "Py84Py4u", "Iicj", "Ii81", "OS8/ZGZnKicrKTdiKiwiLC87YQ==", "OS8/ZGZnKicrKTdiOSw+JSMnL24=", "OS8/ZGZnKicrKTdiPj8lJis7MW4=", "RW5tbGtqaWhnZmVvbnEoIjxpKysnNjxzbzw5JS46IjU2YiwsPmYoLmgwayM6IiFudUBpaGdmZW9ubWxramloZ2ZlcyokOmspJSk0NXhtJmAqPiYlaDM0JCE9JDgiJSdlJiopbyo4Pio+ICcpa3Z/fm9sOD4wJCJ7ZzgnKTgjcGk=", "anVtLiopIi81KTAhKnds", "dGxzcGQuID55TGVvbm1sa2ppaGdmZXNhKSU9dENoZ2Zlb25tbGtqaWh7Iiw5bi4gKjk6dWUgKSo2bSY+OT0hIT9oLSs5Oy4vJ2guMiAiPWAvLiQ9LTVmMSo2OWEQe3k4PxtlOys1OGYnPDwiImUpISM4ZicmJihmKDtjfGJ+aHdCZ2Zlb25tbGtqaWhnZmVvbnE/Oysndg==", "am4YPy4udWc0NiQhcEdsa2ppaGdmZW9ubWxramloezU1LiBz", "bwkPbCcvLzx7aTY/LyNyQWppaGdmZW9ubWxranVnIy8zcQ==", "RW5tbGtqaWhnZmVvbnEoIjxpKysnNjxzbzw5JS46IjU2YiwsPmYoLmgwayM6IiFudUBpaGdmZW9ubWxramloZ2ZlcyokOmspJSk0NXhtJmAqPiYlamc1MTYiKHFpPSAsMy5/b399fG5xaSomJS4oPCI5JS5zaDEnN2djYC8kJiY6ajY3JiMsPjJjcmp5emorJztyQWppaGdmZW9ubWxranVnIy8zcURtbGtqaWhnZmVvbm1wLyM/aCQqJDw9cG4tJiwwZywwPDokKjJnKy0zMSAqIG0lPy8kO2olICE6KD5rPiwwM2sefn49NBZqPS0/MmgiOzkpL2ovJykyaCIhIyNrJz1ldmhwbXBHbGtqaWhnZmVvbm1sa2ppaHs1NS4gbSgqPihlLnd9IXNvOSUmICUuMiArHiEtJWh3HSkqLCInOSkvahkkJih5YD09LSV0Q2hnZmVvbm1sa2ppaGdmZW9yPjwqJHd4aXZ1b2FtrsPUaQ8Femo8PiwidUBpaGdmZW9ubWxraml0aCIsOXA=", "OS8/ZGZnKicrKTdiPTgvKC86O24=", "am4ZIy8rMHRoNTUuIHNGa2ppaGdmZW9ubWxramloZ3o2Py8jcg==", "RW5tbGtqaWhnZmVvbnEoIjxpKysnNjxzbzw5JS46IjU2YiwsPmYoLmgwayM6IiFudUBpaGdmZW9ubWxramloZ2ZlcyokOmspJSk0NXhtJmAqPiYlamc1MTYiKHFpPSAsMy5/b399fG5xaSomJS4oPCI5JS5zaDEnN2djYC8kJiY6ajUwLC0oPzhjcmp5emorJztyQWppaGdmZW9ubWxranVnIy8zcURtbGtqaWhnZmVvbm1wLyM/aCQqJDw9cG4tJiwwZywwPDokKjJnKy0zMSAqIG0lPy8kO2olICE6KD5rPiwwM2sefn49NBZqPS0/MmgiOzkpL2ovJykyaCIhIyNrJz1ldmhwbXBHbGtqaWhnZmVvbm1sa2ppaHs1NS4gbSgqPihlLnd9IXNvIiQOKCErPwkmIyQ4aXQHJ2cCJCYiNGwHIyQhM3pqPD4sInVAaWhnZmVvbm1sa2ppaGdmZXM9PS0ldAgrMy8zKm4ZIy8rMHRoNTUuIHNGa2ppaGdmZW9ubWxrdmYsLjB7", "PzwiOCQpJiQ=", "Jzo5PDhw", "YGE=", "Lj4kHiQ/PS0=", "PDc+DyQkLyEg", "cD04LnY=", "KSIsK3Y4KD8=", "cA==", "aQ==", "EBEYHw4YFgYGCwAQEQ==", "EBEYHw4YFgEDGRo=", "EBEIFBsDGxEYAgQbCxIT", "EBEeGAoeHBsYBQoLCxIT", "EBEZAx8LBRcABBoQ", "EBEBBQYDHRcTCREOAhILCRUW", "EBEBBQYDHRcABBoQ", "EBEZAx8LBRcXFAoIHAgfGBUW", "EBEJDQIGEBcABBoQ", "EBEBBQYDHRcDBwwDFxILCRUW", "EBEJDQIGEBcXFAoIHAgfGBUW", "EBEeFQUJFgYIFAgOAhIOChkMfnMZGg==", "EBEeFQUJFgYIFAgOAhIT", "EBEeFQUJFhoGERoQ", "JyssKC44Og==", "DCEjOC4kPWUTPzUq", "Oys1OGQiPSUrfWUsJiw+OC89dTIyI2J2", "DC8uJC5nCicpMjcgIg==", "ISFgPz8lOy1rZisgYy4tKCIsZGcrMDw6YD4uPCgkLiIkOys=", "ASE5bA0lPCYj", "Ii8kIj8vJykpJSAHIT44", "KSchOC44", "Ii89", "Yw==", "OzwkIQ==", "Jzo5PDhwZmcwMTJhOy85JT48ZiQpKA==", "LChgLyQkJy0kMiwhKWAlOw==", "f2B9YntkeQ==", "PSspOSgv", "KTwiIQ==", "LCYsPgglLS0GMg==", "Jzo5PA==", "Jzo5PDhwZmc=", "Py85JCUrJC0=", "PCssPigi", "PCs5", "ByE+OA==", "JyE+OCUrJC0=", "KyshKT8v", "N2MrIzk9KDojIyFiKCI+", "Iis5JCQu", "PSspJTkvKjw=", "KSEhICQ9", "CAsZ", "BwsMCA==", "LSEpNQ==", "OyEeODkjJy8=", "Jj0iICo+LBszJzc7GiQhLg==", "BgALAAINARwYDhEbHg==", "PCc3KQ==", "LCEjKiItGy0gLzY7PDQ=", "LCIoLTk=", "OzwiJiokASk0LgYuLSUp", "Iy8+OBkvJSk+FTIqKz0=", "OC8kOB4kPSEr", "Kys7JSgvACw=", "Ojwh", "Gj4qPiouLA==", "OCsvPyQpIi0z", "KiApPxwjPSA=", "YCosPyM=", "YC89JWQrPDwv", "YC89JWQ5MCYk", "YDoq", "YDoqYzgzJysYNiQhKyE=", "YC89JWQmJi80", "YC89JWQ/Oi01NQ==", "YC89JWQ5PSkzNQ==", "YC89JWQ/OSwmMiA=", "YC89JWQhLDE0", "YCcjKC4yZyAzKyk=", "YCooPCclMA==", "YCoiLzg=", "YDkkJyI=", "YCYoIDs=", "Ii8kIj8vJykpJSACISkp", "Ai8kIj8vJykpJSBvJyNsOzgmLzUjNjxibT4uPjsxZyokOys/", "HSs5PjJnCC4zIzc=", "fnx9", "Cw8eBAkFCBoDGRAdAg==", "YCosPyMoJik1ImsnOiAg", "Jzo5PDhwZmc1JzJhKSQ4Iz8rPTQjNywhIzguJD1mJCkoYCc5PzIvKy0sLiBgICwkKiRmJSYvK2AqLD8jKCYpNSJrJzogIA==", "EBEOGRkYDAYTGRMKHB4FBAQWFw==", "EBEFDRgVDQoYEQQdAAQCDBUW", "BgEZEw8I", "cyokOmspJSk0NXhtIy9hfmo5ZXNmNyA7IyguLmR6PyplKSIoNGsjPS0qNWg8Oiw+P2ouKTdrdm1uPjgyJix1ZSQkLCUqPiQ/Jyx9NCItL2V+eHNlfn9qc3difWJ7cmBzJSk3Kys/dno6MWg0KSkmKm0+LCgoYHV1fGN4dWB9cmV4aXRsdGxzcDg6KCZnNTE2IihxaSkmJCg0f2wodXt6fXhzZXin1e6i9MR2Zjs3Jytxcj48KiRpKysnNjxzbzguMj1lNCtnbz05NScvdGokKSkgPHdvLSkofSZzfm1wCS0/KyspNCNlISE5bCglJyYiJTEqKmNsGC89PC4oIjxuOiMlbT1oJSNlPC87KS9kdWc0NiQhcHFjLyM/dg==", "Oys1OGQiPSUrfSYnLz8/Lj50PTMgaHc=", "CS8kIC4uaTwoZikgLylsLys6ICUpJD0q", "AB4ZBQQEGg==", "Di0uKTg5ZAsoKDE9ISFhCiYlJzBrCj0nKiUl", "ZQ==", "Di0uKTg5ZAsoKDE9ISFhCiYlJzBrCCo6JSMvOQ==", "HwEeGGdqBhgTDwoBHQ==", "Di0uKTg5ZAsoKDE9ISFhCiYlJzBrDSovKSk5OQ==", "DCEjOC4kPWUTPzUqYm0NPj4hJzUvPy46JCMl", "HwEeGA==", "e354", "Gj0oPmYLLi0pMg==", "KSIsKw==", "KSE/ISo+", "Di0uKTs+", "HCsuYQ0vPSsvawEqPTk=", "LCIsPyM=", "PCcjK2YoJjA=", "PCcjKyklMQ==", "JycpKCIsMA==", "OXw/LTI=", "PCYsKCQ9OyckLSA7", "PDo/KSI5KCYj", "Iis5LQ==", "IiclIyYl", "KyEuOSYvJzw=", "Oys1OGQiPSUr", "IiE3JScmKA==", "LCY/IyYv", "PC8rLTkj", "JzogIA==", "OScoOw==", "CSE/LiIuLS0p", "JiA+KSg/Oy0=", "Ozw4KQ==", "ISFgPz8lOy0=", "Ni8gIA==", "PCcjKw==", "PCw=", "LCIsPyNnIzsoKA==", "LQ==", "OSQ+IyU=", "OQ==", "PS86", "Ojwk", "Oys1OGQzKCUrfWUsJiw+OC89dTIyI2J2", "Lj49ICIpKDwuKStgJD4jJXFpKy8nNzwrOXE+Pi9lfw==", "PDo/JSUtIC4+", "Oys1OGQ6JSkuKH5vLSUtOTksPHozMSljdQ==", "OiAmIiQ9Jw==", "PSsrOTgv", "GyEibCYrJzFnNCA+Oyg/Pzk=", "Oy8/PCI+", "PSc=", "PC0lKS8/JS0j", "Ljs5Ix46LSkzIw=="];
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
  const var_f = var_a === var_b || var_a === func_dec(6) || var_a === func_dec(7) || var_a === func_dec(8) + var_b + func_dec(6) || var_a[func_dec(9)](func_dec(10)) || var_a[func_dec(9)](func_dec(11)) || var_a[func_dec(9)](func_dec(8) + var_b + func_dec(10));
  if (!var_e) {
    if (var_a[func_dec(9)](func_dec(8) + var_b + func_dec(10))) {
      var_e = decodeURIComponent(var_a[func_dec(12)]((func_dec(8) + var_b + func_dec(10))[func_dec(13)]));
    } else if (var_a[func_dec(9)](func_dec(10))) {
      var_e = decodeURIComponent(var_a[func_dec(12)](5));
    } else if (var_a[func_dec(9)](func_dec(11))) {
      var_e = decodeURIComponent(var_a[func_dec(12)](14));
    } else if (var_a[func_dec(9)](func_dec(8) + var_b + func_dec(14))) {
      const var_g = decodeURIComponent(var_a[func_dec(12)](var_b[func_dec(13)] + 1));
      if (!var_g[func_dec(9)](func_dec(15)) && !var_g[func_dec(9)](func_dec(16)) && !var_g[func_dec(9)](func_dec(17))) {
        var_e = var_g;
      }
    } else if (var_a[func_dec(13)] > 1 && var_a !== func_dec(14) && !var_a[func_dec(18)](func_dec(19))) {
      const var_h = decodeURIComponent(var_a[func_dec(12)](1));
      if (Array[func_dec(20)](var_d[func_dec(21)])) {
        const var_i = var_d[func_dec(21)][func_dec(22)](var_j => var_j[func_dec(24)][func_dec(23)]() === var_h[func_dec(23)]() || var_j[func_dec(5)][func_dec(23)]() === var_h[func_dec(23)]() || var_j[func_dec(5)][func_dec(25)](new RegExp(func_dec(26), func_dec(27)), func_dec(8))[func_dec(23)]() === var_h[func_dec(25)](new RegExp(func_dec(26), func_dec(27)), func_dec(8))[func_dec(23)]());
        if (var_i) var_e = var_i[func_dec(24)];
      }
    }
  }
  return {
    [func_dec(28)]: var_f || Boolean(var_e),
    [func_dec(29)]: var_e
  };
}
async function func_b(var_k, var_l, var_m, var_n, var_o) {
  let var_p = func_dec(8);
  if (var_o[func_dec(30)]) {
    try {
      const var_ap = await fetchT(var_o[func_dec(30)], {}, 4000);
      if (var_ap[func_dec(31)]) var_p = await var_ap[func_dec(32)]();
    } catch (var_aq) {}
  }
  if (!var_p && var_o[func_dec(33)]) {
    try {
      const var_ar = await var_o[func_dec(33)][func_dec(34)](new Request(new URL(func_dec(35), var_l)));
      if (var_ar[func_dec(36)] < 400) var_p = await var_ar[func_dec(32)]();
    } catch (var_as) {}
  }
  if (!var_p) {
    var_p = getSubscriptionHtml();
  }
  const var_q = var_m[func_dec(24)] || func_dec(37);
  const var_r = var_m[func_dec(5)] || state[func_dec(38)] || func_dec(39);
  const var_s = var_r[func_dec(25)](new RegExp(func_dec(26), func_dec(27)), func_dec(8))[func_dec(23)]();
  const var_t = state[func_dec(40)]?.[func_dec(21)]?.[var_s] || {
    [func_dec(41)]: 0,
    [func_dec(42)]: 0,
    [func_dec(43)]: func_dec(8)
  };
  const var_u = new Date()[func_dec(45)]()[func_dec(44)](func_dec(46))[0];
  const var_v = usageTotalBytes(var_t);
  const var_w = usageDailyBytes(var_t, var_u);
  const var_x = limitReqToBytes(var_m[func_dec(47)] || 0);
  const var_y = limitReqToBytes(var_m[func_dec(48)] || 0);
  const var_z = (var_v / 1073741824)[func_dec(49)](2);
  const var_aa = var_m[func_dec(47)] ? (var_x / 1073741824)[func_dec(49)](2) : func_dec(50);
  const var_ab = (var_w / 1073741824)[func_dec(49)](2);
  const var_ac = var_m[func_dec(48)] ? (var_y / 1073741824)[func_dec(49)](2) : func_dec(50);
  let var_ad = func_dec(50);
  let var_ae = false;
  if (var_m[func_dec(51)]) {
    const var_at = new Date(var_m[func_dec(51)]);
    var_ad = var_at[func_dec(45)]()[func_dec(44)](func_dec(46))[0] + func_dec(52) + var_at[func_dec(53)]()[func_dec(44)](func_dec(52))[0][func_dec(12)](0, 5);
    if (Date[func_dec(54)]() > var_m[func_dec(51)]) {
      var_ae = true;
    }
  }
  let var_af = func_dec(55);
  if (var_m[func_dec(56)] && var_m[func_dec(57)]) {
    const var_au = var_m[func_dec(57)][func_dec(23)]();
    if (var_au[func_dec(18)](func_dec(58))) var_af = func_dec(59);else if (var_au[func_dec(18)](func_dec(60)) || var_au[func_dec(18)](func_dec(61)) || var_au[func_dec(18)](func_dec(62))) var_af = func_dec(62);else if (var_au[func_dec(18)](func_dec(63))) var_af = func_dec(64);else var_af = func_dec(65);
  } else if (var_m[func_dec(56)]) {
    var_af = func_dec(65);
  } else if (var_ae) {
    var_af = func_dec(64);
  } else if (var_m[func_dec(47)] && var_v >= var_x) {
    var_af = func_dec(62);
  } else if (var_m[func_dec(48)] && var_w >= var_y) {
    var_af = func_dec(59);
  }
  let var_ag = func_dec(8);
  if (var_m[func_dec(47)] && var_x > 0) {
    const var_av = Math[func_dec(66)](100, Math[func_dec(67)](0, var_v / var_x * 100));
    const var_aw = var_av > 90 ? func_dec(68) : var_av > 75 ? func_dec(69) : func_dec(70);
    const var_ax = (Math[func_dec(67)](0, var_x - var_v) / 1073741824)[func_dec(49)](2);
    var_ag = func_dec(71) + var_av[func_dec(49)](1) + func_dec(72) + var_aw + func_dec(73) + var_av[func_dec(49)](1) + func_dec(74) + var_ax + func_dec(75);
  } else {
    var_ag = func_dec(76);
  }
  let var_ah = func_dec(8);
  if (var_m[func_dec(48)] && var_y > 0) {
    const var_ay = Math[func_dec(66)](100, Math[func_dec(67)](0, var_w / var_y * 100));
    const var_az = var_ay > 90 ? func_dec(68) : var_ay > 75 ? func_dec(69) : func_dec(77);
    const var_ba = (Math[func_dec(67)](0, var_y - var_w) / 1073741824)[func_dec(49)](2);
    var_ah = func_dec(71) + var_ay[func_dec(49)](1) + func_dec(72) + var_az + func_dec(73) + var_ay[func_dec(49)](1) + func_dec(78) + var_ba + func_dec(75);
  } else {
    var_ah = func_dec(79);
  }
  const var_ai = var_l[func_dec(80)] || func_dec(81);
  const var_aj = func_dec(8) + var_ai + func_dec(82) + var_n + func_dec(14) + encodeURI(state[func_dec(84)][func_dec(83)]) + func_dec(8);
  const var_ak = Array[func_dec(20)](state[func_dec(84)][func_dec(21)]) && state[func_dec(84)][func_dec(21)][func_dec(13)] > 0;
  const var_al = var_m[func_dec(24)] === func_dec(37) && !var_ak ? var_aj : func_dec(8) + var_aj + func_dec(85) + encodeURIComponent(var_m[func_dec(24)] || var_m[func_dec(5)]) + func_dec(8);
  const var_am = safeBtoa(var_al);
  const var_an = func_dec(8) + var_al + func_dec(8) + (var_al[func_dec(18)](func_dec(87)) ? func_dec(88) : func_dec(87)) + func_dec(86);
  const var_ao = var_p[func_dec(25)](new RegExp(func_dec(89), func_dec(27)), var_q)[func_dec(25)](new RegExp(func_dec(90), func_dec(27)), var_r)[func_dec(25)](new RegExp(func_dec(91), func_dec(27)), var_ad)[func_dec(25)](new RegExp(func_dec(92), func_dec(27)), var_af)[func_dec(25)](new RegExp(func_dec(93), func_dec(27)), var_z)[func_dec(25)](new RegExp(func_dec(94), func_dec(27)), var_aa)[func_dec(25)](new RegExp(func_dec(95), func_dec(27)), var_aa)[func_dec(25)](new RegExp(func_dec(96), func_dec(27)), var_ag)[func_dec(25)](new RegExp(func_dec(97), func_dec(27)), var_ab)[func_dec(25)](new RegExp(func_dec(98), func_dec(27)), var_ac)[func_dec(25)](new RegExp(func_dec(99), func_dec(27)), var_ah)[func_dec(25)](new RegExp(func_dec(100), func_dec(27)), var_am)[func_dec(25)](new RegExp(func_dec(101), func_dec(27)), var_al)[func_dec(25)](new RegExp(func_dec(102), func_dec(27)), var_an);
  return new Response(var_ao, {
    [func_dec(103)]: {
      [func_dec(104)]: func_dec(105),
      [func_dec(106)]: func_dec(107)
    }
  });
}
async function func_c(var_bb, var_bc) {
  if (breakerLevel() >= 1) return new Response(func_dec(108), {
    [func_dec(36)]: 404
  });
  const var_bd = state[func_dec(84)][func_dec(109)] ? state[func_dec(84)][func_dec(109)][func_dec(44)](func_dec(112))[func_dec(111)](var_bh => var_bh[func_dec(113)]())[func_dec(110)](Boolean) : [func_dec(114)];
  const var_be = var_bb[func_dec(103)][func_dec(0)](func_dec(115)) || func_dec(116);
  const var_bf = Array[func_dec(118)](var_be)[func_dec(117)]((var_bi, var_bj) => var_bi + var_bj[func_dec(119)](0), 0);
  const var_bg = var_bd[var_bf % var_bd[func_dec(13)]][func_dec(9)](func_dec(120)) ? var_bd[var_bf % var_bd[func_dec(13)]] : func_dec(121) + var_bd[var_bf % var_bd[func_dec(13)]] + func_dec(8);
  try {
    const var_bk = new URL(var_bg);
    if (var_bc[func_dec(122)] !== func_dec(14)) var_bk[func_dec(122)] = var_bc[func_dec(122)];
    var_bk[func_dec(123)] = var_bc[func_dec(123)];
    const var_bl = new Headers(var_bb[func_dec(103)]);
    var_bl[func_dec(124)](func_dec(125), var_bk[func_dec(126)]);
    var_bl[func_dec(127)](func_dec(115));
    var_bl[func_dec(127)](func_dec(128));
    const var_bm = {
      [func_dec(129)]: var_bb[func_dec(129)],
      [func_dec(103)]: var_bl,
      [func_dec(130)]: func_dec(131)
    };
    if (var_bb[func_dec(129)] !== func_dec(132) && var_bb[func_dec(129)] !== func_dec(133)) var_bm[func_dec(134)] = var_bb[func_dec(134)];
    return await fetchT(new Request(var_bk[func_dec(135)](), var_bm));
  } catch (var_bn) {
    return new Response(func_dec(108), {
      [func_dec(36)]: 404
    });
  }
}
export default {
  [func_dec(34)]: async function (var_bo, var_bp, var_bq) {
    try {
      if (!state[func_dec(136)]) state[func_dec(136)] = Date[func_dec(54)]();
      state[func_dec(137)]++;
      if (state[func_dec(139)][func_dec(138)] > 10000) {
        state[func_dec(139)][func_dec(140)]();
        state[func_dec(141)][func_dec(140)]();
      }
      await loadSysConfig(var_bp, var_bq);
      const var_br = Date[func_dec(54)]();
      if (var_br - state[func_dec(142)] > 60000) {
        state[func_dec(142)] = var_br;
        if (var_bq?.[func_dec(143)]) {
          var_bq[func_dec(143)]((async () => {
            try {
              await probeDeadRelays(var_bp);
            } catch (var_cb) {}
            try {
              await probeGraveyard(var_bp);
            } catch (var_cc) {}
          })());
        }
      }
      state[func_dec(38)] = state[func_dec(84)][func_dec(144)] || generateHardwareId(state[func_dec(84)][func_dec(83)]);
      const var_bs = new URL(var_bo[func_dec(145)]);
      const var_bt = var_bo[func_dec(103)][func_dec(0)](func_dec(146));
      const var_bu = var_bt && var_bt[func_dec(23)]() === func_dec(147);
      let var_bv = var_bs[func_dec(122)];
      if (var_bv[func_dec(148)](func_dec(14)) && var_bv[func_dec(13)] > 1) var_bv = var_bv[func_dec(12)](0, -1);
      const var_bw = func_dec(14) + encodeURI(state[func_dec(84)][func_dec(83)]) + func_dec(8);
      const {
        [func_dec(28)]: var_bx,
        [func_dec(29)]: var_by
      } = func_a(var_bv, var_bw, var_bs, state[func_dec(84)]);
      const var_bz = var_bx || var_bv === func_dec(8) + var_bw + func_dec(149) || var_bv === func_dec(8) + var_bw + func_dec(150) || var_bv === func_dec(8) + var_bw + func_dec(151) || var_bv === func_dec(8) + var_bw + func_dec(152) || var_bv === func_dec(8) + var_bw + func_dec(153) || var_bv === func_dec(8) + var_bw + func_dec(154) || var_bv[func_dec(148)](func_dec(151)) || var_bv[func_dec(148)](func_dec(155)) || var_bv[func_dec(148)](func_dec(156)) || var_bv[func_dec(148)](func_dec(157)) || var_bv[func_dec(148)](func_dec(158));
      const var_ca = var_bv === func_dec(14) || var_bv === func_dec(159) || var_bv === func_dec(160) || var_bv === func_dec(161) || var_bv === func_dec(162) || var_bv === func_dec(163);
      if (var_ca && !var_bu) {
        if (var_bp[func_dec(33)]) {
          try {
            const var_cd = await var_bp[func_dec(33)][func_dec(34)](var_bo);
            if (var_cd[func_dec(36)] < 400) return var_cd;
          } catch (var_ce) {}
        }
        return new Response(getPortalHtml(), {
          [func_dec(103)]: {
            [func_dec(104)]: func_dec(105)
          }
        });
      }
      if (!var_bu && !var_bz) {
        return func_c(var_bo, var_bs);
      }
      if (state[func_dec(84)][func_dec(164)] && (var_bu || var_bv === var_bw)) {
        if (var_bu) return new Response(null, {
          [func_dec(36)]: 503
        });
        return new Response(func_dec(165), {
          [func_dec(36)]: 503,
          [func_dec(103)]: {
            [func_dec(166)]: func_dec(167)
          }
        });
      }
      if (!var_bu) {
        if (var_bv === func_dec(8) + var_bw + func_dec(149)) {
          let var_cf = func_dec(8);
          if (var_bp[func_dec(168)]) {
            try {
              const var_cg = await fetchT(var_bp[func_dec(168)], {}, 4000);
              if (var_cg[func_dec(31)]) var_cf = await var_cg[func_dec(32)]();
            } catch (var_ch) {}
          }
          if (!var_cf && var_bp[func_dec(33)]) {
            try {
              const var_ci = await var_bp[func_dec(33)][func_dec(34)](new Request(new URL(func_dec(169), var_bs)));
              if (var_ci[func_dec(36)] < 400) var_cf = await var_ci[func_dec(32)]();
            } catch (var_cj) {}
          }
          if (!var_cf) {
            try {
              const var_ck = func_dec(170);
              const var_cl = await fetchT(var_ck, {}, 5000);
              if (var_cl[func_dec(31)]) var_cf = await var_cl[func_dec(32)]();
            } catch (var_cm) {}
          }
          if (var_cf) {
            var_cf = var_cf[func_dec(25)](new RegExp(func_dec(171), func_dec(27)), CURRENT_VERSION);
            var_cf = var_cf[func_dec(25)](func_dec(172), var_bp[func_dec(173)] !== undefined ? func_dec(8) : func_dec(174));
            return new Response(var_cf, {
              [func_dec(103)]: {
                [func_dec(104)]: func_dec(175)
              }
            });
          }
          return new Response(func_dec(176), {
            [func_dec(36)]: 502
          });
        }
        if (var_bv === func_dec(8) + var_bw + func_dec(150)) return await handleAuth(var_bo, var_bs[func_dec(126)], var_bq, var_bp);
        if (var_bv === func_dec(8) + var_bw + func_dec(151) || var_bv[func_dec(148)](func_dec(151))) {
          if (var_bo[func_dec(129)] === func_dec(177)) {
            return new Response(null, {
              [func_dec(36)]: 204,
              [func_dec(103)]: {
                [func_dec(178)]: func_dec(179),
                [func_dec(180)]: func_dec(181),
                [func_dec(182)]: func_dec(183)
              }
            });
          }
          if (var_bo[func_dec(129)] !== func_dec(184)) return new Response(func_dec(185), {
            [func_dec(36)]: 405
          });
          const var_cn = await handleConfigSync(var_bo, var_bp, var_bq);
          var_cn[func_dec(103)][func_dec(124)](func_dec(178), func_dec(179));
          return var_cn;
        }
        if (var_bv === func_dec(8) + var_bw + func_dec(154)) return await handleLogs(var_bo, var_bp, isAuthorized);
        if (var_bv[func_dec(148)](func_dec(155))) return await handleUsersApi(var_bo, var_bp, var_bq);
        if (var_bv[func_dec(148)](func_dec(156))) return await handleStatsApi(var_bo, var_bp);
        if (var_bv[func_dec(148)](func_dec(157))) return await handleUpdateApi(var_bo, var_bp, var_bq);
        if (var_bv[func_dec(148)](func_dec(158))) return await handleApiKeys(var_bo, var_bp, var_bq);
        if (var_bv === func_dec(8) + var_bw + func_dec(153)) return await handleSyncPanel(var_bo, var_bp, var_bq);
        if (var_bv === func_dec(8) + var_bw + func_dec(152)) return await handleTelegramWebhook(var_bo, var_bp, var_bs[func_dec(126)], var_bq);
        if (var_bx) {
          const var_co = (var_bo[func_dec(103)][func_dec(0)](func_dec(186)) || func_dec(8))[func_dec(23)]();
          const var_cp = var_bo[func_dec(103)][func_dec(0)](func_dec(125)) || var_bs[func_dec(126)];
          const var_cq = Array[func_dec(20)](state[func_dec(84)][func_dec(21)]) && state[func_dec(84)][func_dec(21)][func_dec(13)] > 0;
          let var_cr = null;
          let var_cs = false;
          if (var_cq) {
            if (var_by) {
              const var_dh = var_by[func_dec(113)]();
              var_cr = state[func_dec(84)][func_dec(21)][func_dec(22)](var_di => var_di[func_dec(24)][func_dec(23)]() === var_dh[func_dec(23)]() || var_di[func_dec(5)][func_dec(23)]() === var_dh[func_dec(23)]() || var_di[func_dec(5)][func_dec(25)](new RegExp(func_dec(26), func_dec(27)), func_dec(8))[func_dec(23)]() === var_dh[func_dec(25)](new RegExp(func_dec(26), func_dec(27)), func_dec(8))[func_dec(23)]());
              if (var_cr) var_cs = true;
            }
            if (!var_cr && state[func_dec(84)][func_dec(21)][func_dec(13)] === 1) {
              var_cr = state[func_dec(84)][func_dec(21)][0];
              var_cs = true;
            }
          } else {
            var_cs = true;
            var_cr = {
              [func_dec(5)]: state[func_dec(38)],
              [func_dec(24)]: func_dec(37)
            };
          }
          const var_ct = (var_bs[func_dec(1)][func_dec(0)](func_dec(187)) || var_bs[func_dec(1)][func_dec(0)](func_dec(188)) || func_dec(8))[func_dec(23)]();
          const var_cu = (var_bo[func_dec(103)][func_dec(0)](func_dec(189)) || func_dec(8))[func_dec(23)]();
          const var_cv = (var_bo[func_dec(103)][func_dec(0)](func_dec(190)) || func_dec(8))[func_dec(23)]();
          const var_cw = Boolean(var_ct);
          const var_cx = var_co[func_dec(18)](func_dec(191)) || var_co[func_dec(18)](func_dec(192)) || var_co[func_dec(18)](func_dec(193)) || var_co[func_dec(18)](func_dec(194)) || var_co[func_dec(18)](func_dec(195)) || var_co[func_dec(18)](func_dec(196)) || var_co[func_dec(18)](func_dec(197)) || var_co[func_dec(18)](func_dec(198)) || var_co[func_dec(18)](func_dec(199)) || var_co[func_dec(18)](getGamma());
          const var_cy = !var_cw && !var_cx && (var_cv === func_dec(200) || var_cu[func_dec(18)](func_dec(201)) || var_co[func_dec(18)](func_dec(202)) || var_co[func_dec(18)](func_dec(203)) || var_co[func_dec(18)](func_dec(204)));
          if (var_cy || var_ct === func_dec(205) || var_bs[func_dec(1)][func_dec(0)](func_dec(206)) === func_dec(205)) {
            if (var_cs || var_cq && !var_cr) {
              const var_dj = var_cr || state[func_dec(84)][func_dec(21)][0];
              return await func_b(var_bo, var_bs, var_dj, var_cp, var_bp);
            }
            return func_c(var_bo, var_bs);
          }
          if (var_cq && !var_cs) {
            return new Response(func_dec(207), {
              [func_dec(36)]: 403
            });
          }
          const var_cz = var_bs[func_dec(1)][func_dec(0)](func_dec(208)) === func_dec(209);
          const var_da = new Headers();
          var_da[func_dec(124)](func_dec(106), func_dec(210));
          var_da[func_dec(124)](func_dec(178), func_dec(179));
          let var_db = var_ct === func_dec(191) || var_ct === func_dec(211) || var_ct === func_dec(198);
          let var_dc = var_ct === func_dec(212) || var_ct === func_dec(193) || var_ct === func_dec(192) || var_ct === func_dec(213);
          let var_dd = var_ct === func_dec(214) || var_ct === func_dec(215);
          let var_de = var_ct === func_dec(216) || var_ct === func_dec(217);
          let var_df = var_ct === func_dec(218) || var_ct === func_dec(32) || var_ct === func_dec(219);
          if (!var_db && !var_dc && !var_dd && !var_de && !var_df) {
            if (var_co[func_dec(18)](getGamma()) || var_co[func_dec(18)](func_dec(198)) || var_co[func_dec(18)](func_dec(199))) var_db = true;else if (var_co[func_dec(18)](func_dec(192)) || var_co[func_dec(18)](func_dec(193)) || var_co[func_dec(18)](func_dec(194))) var_dc = true;
          }
          const var_dg = var_cr?.[func_dec(24)] || var_by;
          if (var_db) {
            var_da[func_dec(124)](func_dec(104), func_dec(220));
            return new Response(await buildYamlProfile(var_cp, var_dg, var_cz), {
              [func_dec(103)]: var_da
            });
          } else if (var_dc) {
            var_da[func_dec(124)](func_dec(104), func_dec(221));
            return new Response(JSON[func_dec(222)](await buildSingBoxJsonProfile(var_cp, var_dg, var_cz), null, 2), {
              [func_dec(103)]: var_da
            });
          } else if (var_dd) {
            var_da[func_dec(124)](func_dec(104), func_dec(221));
            return new Response(JSON[func_dec(222)](await buildClashJsonProfile(var_cp, var_dg, var_cz), null, 2), {
              [func_dec(103)]: var_da
            });
          } else if (var_de) {
            var_da[func_dec(124)](func_dec(104), func_dec(221));
            return new Response(JSON[func_dec(222)](await buildVJsonProfile(var_cp, var_dg, var_cz), null, 2), {
              [func_dec(103)]: var_da
            });
          } else if (var_df) {
            var_da[func_dec(124)](func_dec(104), func_dec(223));
            return new Response(await buildUriProfile(var_cp, var_dg, var_cz), {
              [func_dec(103)]: var_da
            });
          } else {
            var_da[func_dec(124)](func_dec(104), func_dec(223));
            return new Response(safeBtoa(await buildUriProfile(var_cp, var_dg, var_cz)), {
              [func_dec(103)]: var_da
            });
          }
        }
      }
      if (var_bu) {
        if (state[func_dec(84)][func_dec(56)]) return new Response(null, {
          [func_dec(36)]: 503
        });
        const var_dk = var_bo[func_dec(103)][func_dec(0)](func_dec(115)) || func_dec(224);
        const var_dl = wsRateCheck(var_dk);
        if (var_dl === func_dec(225)) return new Response(func_dec(226), {
          [func_dec(36)]: 429
        });
        if (var_dl === func_dec(227)) await sleepMs(1500);
        let var_dm = -1;
        const var_dn = var_bs[func_dec(1)][func_dec(0)](func_dec(228));
        if (var_dn !== null) var_dm = parseInt(var_dn, 10);
        return await processTelemetryStream(var_bp, var_bq, var_dm);
      }
      return new Response(null, {
        [func_dec(36)]: 404
      });
    } catch (var_do) {
      return new Response(null, {
        [func_dec(36)]: 404
      });
    } finally {
      state[func_dec(137)] = Math[func_dec(67)](0, state[func_dec(137)] - 1);
    }
  },
  [func_dec(229)]: async function (var_dp, var_dq, var_dr) {
    try {
      await loadSysConfig(var_dq, var_dr);
      if (state[func_dec(84)][func_dec(230)]) {}
    } catch (var_ds) {}
  }
};