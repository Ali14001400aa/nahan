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
const _0x_tbl = ["KCs5", "PCssPigiGSk1Jyg8", "PDsv", "Oj0oPg==", "OyEmKSU=", "Jio=", "KiApPxwjPSA=", "YSY5ISc=", "PCIkLy4=", "YD04Lg==", "YD04LjgpOyE3MiwgIA==", "", "PDosPj85HiEzLg==", "YD04LmQ=", "YD04LjgpOyE3MiwgIGI=", "IysjKz8i", "YA==", "Ky8+JA==", "Lj4k", "Oyk=", "JiAuID4uLDs=", "YQ==", "Jj0MPjkrMA==", "Oj0oPjg=", "KScjKA==", "OyEBIzwvOwsmNSA=", "IS8gKQ==", "PSs9ICopLA==", "Yg==", "KA==", "Jj0eOSkYJj0zIw==", "Oy8/Ky4+Gj0l", "HBsPHwgYABgTDwoBERgeBw==", "ICU=", "Oys1OA==", "Dh0eCR8Z", "KSs5LyM=", "YD04LjgpOyE3MiwgIGMkPycl", "PDosOD45", "CysrLT4mPQ==", "Li05JT0vDS0xLyYqByk=", "f359fHt6eXhqdnV/fmB8e3p5ZXd2dX9jfXx7enl4d3Z1f359", "PDc+GTgrLi0EJyYnKw==", "PSs8Pw==", "KxwoPTg=", "Iy8+OA8rMA==", "PD4hJT8=", "OyEEHwQZPTouKCI=", "Gw==", "IycgJT8eJjwmKhcqPw==", "IycgJT8OKCErPxcqPw==", "OyELJTMvLQ==", "GiAhJSYjPS0j", "KjY9JTkzBDs=", "bw==", "OyEZJSYvGjw1Lyso", "ISE6", "Li05JT0v", "Jj0dLT45LCw=", "Kyc+LSkmLCwVIyQ8ISM=", "Ky8kIDI=", "Ky8kIDIGICUuMg==", "OzwsKi0jKg==", "PjsiOCo=", "IycgJT8=", "KjY9JTk=", "KjY9JTkvLQ==", "Py84Py4u", "Iicj", "Ii81", "OS8/ZGZnKicrKTdiKiwiLC87YQ==", "OS8/ZGZnKicrKTdiOSw+JSMnL24=", "OS8/ZGZnKicrKTdiPj8lJis7MW4=", "RW5tbGtqaWhnZmVvbnEoIjxpKysnNjxzbzw5JS46IjU2YiwsPmYoLmgwayM6IiFudUBpaGdmZW9ubWxramloZ2ZlcyokOmspJSk0NXhtJmAqPiYlaDM0JCE9JDgiJSdlJiopbyo4Pio+ICcpa3Z/fm9sOD4wJCJ7ZzgnKTgjcGk=", "anVtLiopIi81KTAhKnds", "dGxzcGQuID55TGVvbm1sa2ppaGdmZXNhKSU9dENoZ2Zlb25tbGtqaWh7Iiw5bi4gKjk6dWUgKSo2bSY+OT0hIT9oLSs5Oy4vJ2guMiAiPWAvLiQ9LTVmMSo2OWEQe3k4PxtlOys1OGYnPDwiImUpISM4ZicmJihmKDtjfGJ+aHdCZ2Zlb25tbGtqaWhnZmVvbnE/Oysndg==", "am4YPy4udWc0NiQhcEdsa2ppaGdmZW9ubWxramloezU1LiBz", "bwkPbCcvLzx7aTY/LyNyQWppaGdmZW9ubWxranVnIy8zcQ==", "RW5tbGtqaWhnZmVvbnEoIjxpKysnNjxzbzw5JS46IjU2YiwsPmYoLmgwayM6IiFudUBpaGdmZW9ubWxramloZ2ZlcyokOmspJSk0NXhtJmAqPiYlamc1MTYiKHFpPSAsMy5/b399fG5xaSomJS4oPCI5JS5zaDEnN2djYC8kJiY6ajY3JiMsPjJjcmp5emorJztyQWppaGdmZW9ubWxranVnIy8zcURtbGtqaWhnZmVvbm1wLyM/aCQqJDw9cG4tJiwwZywwPDokKjJnKy0zMSAqIG0lPy8kO2olICE6KD5rPiwwM2sefn49NBZqPS0/MmgiOzkpL2ovJykyaCIhIyNrJz1ldmhwbXBHbGtqaWhnZmVvbm1sa2ppaHs1NS4gbSgqPihlLnd9IXNvOSUmICUuMiArHiEtJWh3HSkqLCInOSkvahkkJih5YD09LSV0Q2hnZmVvbm1sa2ppaGdmZW9yPjwqJHd4aXZ1b2FtrsPUaQ8Femo8PiwidUBpaGdmZW9ubWxraml0aCIsOXA=", "OS8/ZGZnKicrKTdiPTgvKC86O24=", "am4ZIy8rMHRoNTUuIHNGa2ppaGdmZW9ubWxramloZ3o2Py8jcg==", "RW5tbGtqaWhnZmVvbnEoIjxpKysnNjxzbzw5JS46IjU2YiwsPmYoLmgwayM6IiFudUBpaGdmZW9ubWxramloZ2ZlcyokOmspJSk0NXhtJmAqPiYlamc1MTYiKHFpPSAsMy5/b399fG5xaSomJS4oPCI5JS5zaDEnN2djYC8kJiY6ajUwLC0oPzhjcmp5emorJztyQWppaGdmZW9ubWxranVnIy8zcURtbGtqaWhnZmVvbm1wLyM/aCQqJDw9cG4tJiwwZywwPDokKjJnKy0zMSAqIG0lPy8kO2olICE6KD5rPiwwM2sefn49NBZqPS0/MmgiOzkpL2ovJykyaCIhIyNrJz1ldmhwbXBHbGtqaWhnZmVvbm1sa2ppaHs1NS4gbSgqPihlLnd9IXNvIiQOKCErPwkmIyQ4aXQHJ2cCJCYiNGwHIyQhM3pqPD4sInVAaWhnZmVvbm1sa2ppaGdmZXM9PS0ldAgrMy8zKm4ZIy8rMHRoNTUuIHNGa2ppaGdmZW9ubWxrdmYsLjB7", "PzwiOCQpJiQ=", "Jzo5PDhw", "YGE=", "Lj4kHiQ/PS0=", "PDc+DyQkLyEg", "cD04LnY=", "KSIsK3Y4KD8=", "cA==", "aQ==", "EBEYHw4YFgYGCwAQEQ==", "EBEYHw4YFgEDGRo=", "EBEIFBsDGxEYAgQbCxIT", "EBEeGAoeHBsYBQoLCxIT", "EBEZAx8LBRcABBoQ", "EBEBBQYDHRcTCREOAhILCRUW", "EBEBBQYDHRcABBoQ", "EBEZAx8LBRcXFAoIHAgfGBUW", "EBEJDQIGEBcABBoQ", "EBEBBQYDHRcDBwwDFxILCRUW", "EBEJDQIGEBcXFAoIHAgfGBUW", "EBEeFQUJFgYIFAgOAhIOChkMfnMZGg==", "EBEeFQUJFgYIFAgOAhIT", "EBEeFQUJFhoGERoQ", "JyssKC44Og==", "DCEjOC4kPWUTPzUq", "Oys1OGQiPSUrfWUsJiw+OC89dTIyI2J2", "DC8uJC5nCicpMjcgIg==", "ISFgPz8lOy1rZisgYy4tKCIsZGcrMDw6YD4uPCgkLiIkOys=", "ASE5bA0lPCYj", "Ii8kIj8vJykpJSAHIT44", "KSchOC44", "Ii89", "Yw==", "OzwkIQ==", "Jzo5PDhwZmcwMTJhOy85JT48ZiQpKA==", "LChgLyQkJy0kMiwhKWAlOw==", "f2B9YntkeQ==", "PSspOSgv", "KTwiIQ==", "LCYsPgglLS0GMg==", "Jzo5PA==", "Jzo5PDhwZmc=", "Py85JCUrJC0=", "PCssPigi", "PCs5", "ByE+OA==", "JyE+OCUrJC0=", "KyshKT8v", "N2MrIzk9KDojIyFiKCI+", "Iis5JCQu", "PSspJTkvKjw=", "KSEhICQ9", "CAsZ", "BwsMCA==", "LSEpNQ==", "OyEeODkjJy8=", "Jj0iICo+LBszJzc7GiQhLg==", "BgALAAINARwYDhEbHg==", "PCc3KQ==", "LCEjKiItGy0gLzY7PDQ=", "LCIoLTk=", "OzwiJiokASk0LgYuLSUp", "Iy8+OBkvJSk+FTIqKz0=", "OC8kOB4kPSEr", "Kys7JSgvACw=", "Ojwh", "Gj4qPiouLA==", "OCsvPyQpIi0z", "YCosPyM=", "YC89JWQrPDwv", "YC89JWQ5MCYk", "YDoq", "YDoqYzgzJysYNiQhKyE=", "YC89JWQmJi80", "YC89JWQ/Oi01NQ==", "YC89JWQ5PSkzNQ==", "YC89JWQ/OSwmMiA=", "YC89JWQhLDE0", "YCcjKC4yZyAzKyk=", "YCooPCclMA==", "YCoiLzg=", "YDkkJyI=", "YCYoIDs=", "Ii8kIj8vJykpJSACISkp", "Ai8kIj8vJykpJSBvJyNsOzgmLzUjNjxibT4uPjsxZyokOys/", "HSs5PjJnCC4zIzc=", "fnx9", "Cw8eBAkFCBoDGRAdAg==", "YCosPyMoJik1ImsnOiAg", "Jzo5PDhwZmc1JzJhKSQ4Iz8rPTQjNywhIzguJD1mJCkoYCc5PzIvKy0sLiBgICwkKiRmJSYvK2AqLD8jKCYpNSJrJzogIA==", "EBEOGRkYDAYTGRMKHB4FBAQWFw==", "EBEFDRgVDQoYEQQdAAQCDBUW", "BgEZEw8I", "cyokOmspJSk0NXhtIy9hfmo5ZXNmNyA7IyguLmR6PyplKSIoNGsjPS0qNWg8Oiw+P2ouKTdrdm1uPjgyJix1ZSQkLCUqPiQ/Jyx9NCItL2V+eHNlfn9qc3difWJ7cmBzJSk3Kys/dno6MWg0KSkmKm0+LCgoYHV1fGN4dWB9cmV4aXRsdGxzcDg6KCZnNTE2IihxaSkmJCg0f2wodXt6fXhzZXin1e6i9MR2Zjs3Jytxcj48KiRpKysnNjxzbzguMj1lNCtnbz05NScvdGokKSkgPHdvLSkofSZzfm1wCS0/KyspNCNlISE5bCglJyYiJTEqKmNsGC89PC4oIjxuOiMlbT1oJSNlPC87KS9kdWc0NiQhcHFjLyM/dg==", "Oys1OGQiPSUrfSYnLz8/Lj50PTMgaHc=", "CS8kIC4uaTwoZikgLylsLys6ICUpJD0q", "AB4ZBQQEGg==", "Di0uKTg5ZAsoKDE9ISFhCiYlJzBrCj0nKiUl", "ZQ==", "Di0uKTg5ZAsoKDE9ISFhCiYlJzBrCCo6JSMvOQ==", "HwEeGGdqBhgTDwoBHQ==", "Di0uKTg5ZAsoKDE9ISFhCiYlJzBrDSovKSk5OQ==", "DCEjOC4kPWUTPzUqYm0NPj4hJzUvPy46JCMl", "HwEeGA==", "e354", "Gj0oPmYLLi0pMg==", "KSIsKw==", "KSE/ISo+", "Di0uKTs+", "HCsuYQ0vPSsvawEqPTk=", "LCIsPyM=", "PCcjK2YoJjA=", "PCcjKyklMQ==", "JycpKCIsMA==", "OXw/LTI=", "PCYsKCQ9OyckLSA7", "PDo/KSI5KCYj", "Iis5LQ==", "IiclIyYl", "KyEuOSYvJzw=", "Oys1OGQiPSUr", "IiE3JScmKA==", "LCY/IyYv", "PC8rLTkj", "JzogIA==", "OScoOw==", "CSE/LiIuLS0p", "JiA+KSg/Oy0=", "Ozw4KQ==", "ISFgPz8lOy0=", "JT0iIg==", "JiArIw==", "PDo/JSUtIC4+", "Oj0oPgUrJC0=", "Oj0oPgIu", "OyE5LScNKw==", "IycgJT8eJjwmKgIt", "Ky8kIDINKw==", "IycgJT8OKCErPwIt", "KjY9JTkzDSkzIw==", "PDosOD45CicjIw==", "PDcjLwUlOyUmKg==", "PDcjLxkrPg==", "PDcjLwUlOyUmKgcuPSh6fw==", "Lj49ICIpKDwuKStgJD4jJXFpKy8nNzwrOXE+Pi9lfw==", "Ni8gIA==", "PCcjKw==", "PCw=", "LCIsPyNnIzsoKA==", "LQ==", "OSQ+IyU=", "OQ==", "PS86", "Ojwk", "Oys1OGQzKCUrfWUsJiw+OC89dTIyI2J2", "Oys1OGQ6JSkuKH5vLSUtOTksPHozMSljdQ==", "OiAmIiQ9Jw==", "PSsrOTgv", "GyEibCYrJzFnNCA+Oyg/Pzk=", "Oy8/PCI+", "PSc=", "PC0lKS8/JS0j", "Ljs5Ix46LSkzIw=="];
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
  const var_f = var_a[func_dec(6)](func_dec(7)) ? var_a[func_dec(8)](0, -5) : var_a;
  const var_g = var_a === var_b || var_f === func_dec(9) || var_f === func_dec(10) || var_f === func_dec(11) + var_b + func_dec(9) || var_f[func_dec(12)](func_dec(13)) || var_f[func_dec(12)](func_dec(14)) || var_f[func_dec(12)](func_dec(11) + var_b + func_dec(13));
  if (!var_e) {
    if (var_f[func_dec(12)](func_dec(11) + var_b + func_dec(13))) {
      var_e = decodeURIComponent(var_f[func_dec(8)]((func_dec(11) + var_b + func_dec(13))[func_dec(15)]));
    } else if (var_f[func_dec(12)](func_dec(13))) {
      var_e = decodeURIComponent(var_f[func_dec(8)](5));
    } else if (var_f[func_dec(12)](func_dec(14))) {
      var_e = decodeURIComponent(var_f[func_dec(8)](14));
    } else if (var_f[func_dec(12)](func_dec(11) + var_b + func_dec(16))) {
      const var_h = decodeURIComponent(var_f[func_dec(8)](var_b[func_dec(15)] + 1));
      if (!var_h[func_dec(12)](func_dec(17)) && !var_h[func_dec(12)](func_dec(18)) && !var_h[func_dec(12)](func_dec(19))) {
        var_e = var_h;
      }
    } else if (var_f[func_dec(15)] > 1 && var_f !== func_dec(16) && !var_f[func_dec(20)](func_dec(21))) {
      const var_i = decodeURIComponent(var_f[func_dec(8)](1));
      if (Array[func_dec(22)](var_d[func_dec(23)])) {
        const var_j = var_d[func_dec(23)][func_dec(24)](var_k => var_k[func_dec(26)][func_dec(25)]() === var_i[func_dec(25)]() || var_k[func_dec(5)][func_dec(25)]() === var_i[func_dec(25)]() || var_k[func_dec(5)][func_dec(27)](new RegExp(func_dec(28), func_dec(29)), func_dec(11))[func_dec(25)]() === var_i[func_dec(27)](new RegExp(func_dec(28), func_dec(29)), func_dec(11))[func_dec(25)]());
        if (var_j) var_e = var_j[func_dec(26)];
      }
    }
  }
  return {
    [func_dec(30)]: var_g || Boolean(var_e),
    [func_dec(31)]: var_e
  };
}
async function func_b(var_l, var_m, var_n, var_o, var_p) {
  let var_q = func_dec(11);
  if (var_p[func_dec(32)]) {
    try {
      const var_aq = await fetchT(var_p[func_dec(32)], {}, 4000);
      if (var_aq[func_dec(33)]) var_q = await var_aq[func_dec(34)]();
    } catch (var_ar) {}
  }
  if (!var_q) {
    var_q = getSubscriptionHtml();
  }
  if (!var_q && var_p[func_dec(35)]) {
    try {
      const var_as = await var_p[func_dec(35)][func_dec(36)](new Request(new URL(func_dec(37), var_m)));
      if (var_as[func_dec(38)] < 400) var_q = await var_as[func_dec(34)]();
    } catch (var_at) {}
  }
  const var_r = var_n[func_dec(26)] || func_dec(39);
  const var_s = var_n[func_dec(5)] || state[func_dec(40)] || func_dec(41);
  const var_t = var_s[func_dec(27)](new RegExp(func_dec(28), func_dec(29)), func_dec(11))[func_dec(25)]();
  const var_u = state[func_dec(42)]?.[func_dec(23)]?.[var_t] || {
    [func_dec(43)]: 0,
    [func_dec(44)]: 0,
    [func_dec(45)]: func_dec(11)
  };
  const var_v = new Date()[func_dec(47)]()[func_dec(46)](func_dec(48))[0];
  const var_w = usageTotalBytes(var_u);
  const var_x = usageDailyBytes(var_u, var_v);
  const var_y = limitReqToBytes(var_n[func_dec(49)] || 0);
  const var_z = limitReqToBytes(var_n[func_dec(50)] || 0);
  const var_aa = (var_w / 1073741824)[func_dec(51)](2);
  const var_ab = var_n[func_dec(49)] ? (var_y / 1073741824)[func_dec(51)](2) : func_dec(52);
  const var_ac = (var_x / 1073741824)[func_dec(51)](2);
  const var_ad = var_n[func_dec(50)] ? (var_z / 1073741824)[func_dec(51)](2) : func_dec(52);
  let var_ae = func_dec(52);
  let var_af = false;
  if (var_n[func_dec(53)]) {
    const var_au = new Date(var_n[func_dec(53)]);
    var_ae = var_au[func_dec(47)]()[func_dec(46)](func_dec(48))[0] + func_dec(54) + var_au[func_dec(55)]()[func_dec(46)](func_dec(54))[0][func_dec(8)](0, 5);
    if (Date[func_dec(56)]() > var_n[func_dec(53)]) {
      var_af = true;
    }
  }
  let var_ag = func_dec(57);
  if (var_n[func_dec(58)] && var_n[func_dec(59)]) {
    const var_av = var_n[func_dec(59)][func_dec(25)]();
    if (var_av[func_dec(20)](func_dec(60))) var_ag = func_dec(61);else if (var_av[func_dec(20)](func_dec(62)) || var_av[func_dec(20)](func_dec(63)) || var_av[func_dec(20)](func_dec(64))) var_ag = func_dec(64);else if (var_av[func_dec(20)](func_dec(65))) var_ag = func_dec(66);else var_ag = func_dec(67);
  } else if (var_n[func_dec(58)]) {
    var_ag = func_dec(67);
  } else if (var_af) {
    var_ag = func_dec(66);
  } else if (var_n[func_dec(49)] && var_w >= var_y) {
    var_ag = func_dec(64);
  } else if (var_n[func_dec(50)] && var_x >= var_z) {
    var_ag = func_dec(61);
  }
  let var_ah = func_dec(11);
  if (var_n[func_dec(49)] && var_y > 0) {
    const var_aw = Math[func_dec(68)](100, Math[func_dec(69)](0, var_w / var_y * 100));
    const var_ax = var_aw > 90 ? func_dec(70) : var_aw > 75 ? func_dec(71) : func_dec(72);
    const var_ay = (Math[func_dec(69)](0, var_y - var_w) / 1073741824)[func_dec(51)](2);
    var_ah = func_dec(73) + var_aw[func_dec(51)](1) + func_dec(74) + var_ax + func_dec(75) + var_aw[func_dec(51)](1) + func_dec(76) + var_ay + func_dec(77);
  } else {
    var_ah = func_dec(78);
  }
  let var_ai = func_dec(11);
  if (var_n[func_dec(50)] && var_z > 0) {
    const var_az = Math[func_dec(68)](100, Math[func_dec(69)](0, var_x / var_z * 100));
    const var_ba = var_az > 90 ? func_dec(70) : var_az > 75 ? func_dec(71) : func_dec(79);
    const var_bb = (Math[func_dec(69)](0, var_z - var_x) / 1073741824)[func_dec(51)](2);
    var_ai = func_dec(73) + var_az[func_dec(51)](1) + func_dec(74) + var_ba + func_dec(75) + var_az[func_dec(51)](1) + func_dec(80) + var_bb + func_dec(77);
  } else {
    var_ai = func_dec(81);
  }
  const var_aj = var_m[func_dec(82)] || func_dec(83);
  const var_ak = func_dec(11) + var_aj + func_dec(84) + var_o + func_dec(16) + encodeURI(state[func_dec(86)][func_dec(85)]) + func_dec(11);
  const var_al = Array[func_dec(22)](state[func_dec(86)][func_dec(23)]) && state[func_dec(86)][func_dec(23)][func_dec(15)] > 0;
  const var_am = var_n[func_dec(26)] === func_dec(39) && !var_al ? var_ak : func_dec(11) + var_ak + func_dec(87) + encodeURIComponent(var_n[func_dec(26)] || var_n[func_dec(5)]) + func_dec(11);
  const var_an = safeBtoa(var_am);
  const var_ao = func_dec(11) + var_am + func_dec(11) + (var_am[func_dec(20)](func_dec(89)) ? func_dec(90) : func_dec(89)) + func_dec(88);
  const var_ap = var_q[func_dec(27)](new RegExp(func_dec(91), func_dec(29)), var_r)[func_dec(27)](new RegExp(func_dec(92), func_dec(29)), var_s)[func_dec(27)](new RegExp(func_dec(93), func_dec(29)), var_ae)[func_dec(27)](new RegExp(func_dec(94), func_dec(29)), var_ag)[func_dec(27)](new RegExp(func_dec(95), func_dec(29)), var_aa)[func_dec(27)](new RegExp(func_dec(96), func_dec(29)), var_ab)[func_dec(27)](new RegExp(func_dec(97), func_dec(29)), var_ab)[func_dec(27)](new RegExp(func_dec(98), func_dec(29)), var_ah)[func_dec(27)](new RegExp(func_dec(99), func_dec(29)), var_ac)[func_dec(27)](new RegExp(func_dec(100), func_dec(29)), var_ad)[func_dec(27)](new RegExp(func_dec(101), func_dec(29)), var_ai)[func_dec(27)](new RegExp(func_dec(102), func_dec(29)), var_an)[func_dec(27)](new RegExp(func_dec(103), func_dec(29)), var_am)[func_dec(27)](new RegExp(func_dec(104), func_dec(29)), var_ao);
  return new Response(var_ap, {
    [func_dec(105)]: {
      [func_dec(106)]: func_dec(107),
      [func_dec(108)]: func_dec(109)
    }
  });
}
async function func_c(var_bc, var_bd) {
  if (breakerLevel() >= 1) return new Response(func_dec(110), {
    [func_dec(38)]: 404
  });
  const var_be = state[func_dec(86)][func_dec(111)] ? state[func_dec(86)][func_dec(111)][func_dec(46)](func_dec(114))[func_dec(113)](var_bi => var_bi[func_dec(115)]())[func_dec(112)](Boolean) : [func_dec(116)];
  const var_bf = var_bc[func_dec(105)][func_dec(0)](func_dec(117)) || func_dec(118);
  const var_bg = Array[func_dec(120)](var_bf)[func_dec(119)]((var_bj, var_bk) => var_bj + var_bk[func_dec(121)](0), 0);
  const var_bh = var_be[var_bg % var_be[func_dec(15)]][func_dec(12)](func_dec(122)) ? var_be[var_bg % var_be[func_dec(15)]] : func_dec(123) + var_be[var_bg % var_be[func_dec(15)]] + func_dec(11);
  try {
    const var_bl = new URL(var_bh);
    if (var_bd[func_dec(124)] !== func_dec(16)) var_bl[func_dec(124)] = var_bd[func_dec(124)];
    var_bl[func_dec(125)] = var_bd[func_dec(125)];
    const var_bm = new Headers(var_bc[func_dec(105)]);
    var_bm[func_dec(126)](func_dec(127), var_bl[func_dec(128)]);
    var_bm[func_dec(129)](func_dec(117));
    var_bm[func_dec(129)](func_dec(130));
    const var_bn = {
      [func_dec(131)]: var_bc[func_dec(131)],
      [func_dec(105)]: var_bm,
      [func_dec(132)]: func_dec(133)
    };
    if (var_bc[func_dec(131)] !== func_dec(134) && var_bc[func_dec(131)] !== func_dec(135)) var_bn[func_dec(136)] = var_bc[func_dec(136)];
    return await fetchT(new Request(var_bl[func_dec(137)](), var_bn));
  } catch (var_bo) {
    return new Response(func_dec(110), {
      [func_dec(38)]: 404
    });
  }
}
export default {
  [func_dec(36)]: async function (var_bp, var_bq, var_br) {
    try {
      if (!state[func_dec(138)]) state[func_dec(138)] = Date[func_dec(56)]();
      state[func_dec(139)]++;
      if (state[func_dec(141)][func_dec(140)] > 10000) {
        state[func_dec(141)][func_dec(142)]();
        state[func_dec(143)][func_dec(142)]();
      }
      await loadSysConfig(var_bq, var_br);
      const var_bs = Date[func_dec(56)]();
      if (var_bs - state[func_dec(144)] > 60000) {
        state[func_dec(144)] = var_bs;
        if (var_br?.[func_dec(145)]) {
          var_br[func_dec(145)]((async () => {
            try {
              await probeDeadRelays(var_bq);
            } catch (var_cc) {}
            try {
              await probeGraveyard(var_bq);
            } catch (var_cd) {}
          })());
        }
      }
      state[func_dec(40)] = state[func_dec(86)][func_dec(146)] || generateHardwareId(state[func_dec(86)][func_dec(85)]);
      const var_bt = new URL(var_bp[func_dec(147)]);
      const var_bu = var_bp[func_dec(105)][func_dec(0)](func_dec(148));
      const var_bv = var_bu && var_bu[func_dec(25)]() === func_dec(149);
      let var_bw = var_bt[func_dec(124)];
      if (var_bw[func_dec(6)](func_dec(16)) && var_bw[func_dec(15)] > 1) var_bw = var_bw[func_dec(8)](0, -1);
      const var_bx = func_dec(16) + encodeURI(state[func_dec(86)][func_dec(85)]) + func_dec(11);
      const {
        [func_dec(30)]: var_by,
        [func_dec(31)]: var_bz
      } = func_a(var_bw, var_bx, var_bt, state[func_dec(86)]);
      const var_ca = var_by || var_bw === func_dec(11) + var_bx + func_dec(150) || var_bw === func_dec(11) + var_bx + func_dec(151) || var_bw === func_dec(11) + var_bx + func_dec(152) || var_bw === func_dec(11) + var_bx + func_dec(153) || var_bw === func_dec(11) + var_bx + func_dec(154) || var_bw === func_dec(11) + var_bx + func_dec(155) || var_bw[func_dec(6)](func_dec(152)) || var_bw[func_dec(6)](func_dec(156)) || var_bw[func_dec(6)](func_dec(157)) || var_bw[func_dec(6)](func_dec(158)) || var_bw[func_dec(6)](func_dec(159));
      const var_cb = var_bw === func_dec(16) || var_bw === func_dec(160) || var_bw === func_dec(161) || var_bw === func_dec(162) || var_bw === func_dec(163) || var_bw === func_dec(164);
      if (var_cb && !var_bv) {
        if (var_bq[func_dec(35)]) {
          try {
            const var_ce = await var_bq[func_dec(35)][func_dec(36)](var_bp);
            if (var_ce[func_dec(38)] < 400) return var_ce;
          } catch (var_cf) {}
        }
        return new Response(getPortalHtml(), {
          [func_dec(105)]: {
            [func_dec(106)]: func_dec(107)
          }
        });
      }
      if (!var_bv && !var_ca) {
        return func_c(var_bp, var_bt);
      }
      if (state[func_dec(86)][func_dec(165)] && (var_bv || var_bw === var_bx)) {
        if (var_bv) return new Response(null, {
          [func_dec(38)]: 503
        });
        return new Response(func_dec(166), {
          [func_dec(38)]: 503,
          [func_dec(105)]: {
            [func_dec(167)]: func_dec(168)
          }
        });
      }
      if (!var_bv) {
        if (var_bw === func_dec(11) + var_bx + func_dec(150)) {
          let var_cg = func_dec(11);
          if (var_bq[func_dec(169)]) {
            try {
              const var_ch = await fetchT(var_bq[func_dec(169)], {}, 4000);
              if (var_ch[func_dec(33)]) var_cg = await var_ch[func_dec(34)]();
            } catch (var_ci) {}
          }
          if (!var_cg && var_bq[func_dec(35)]) {
            try {
              const var_cj = await var_bq[func_dec(35)][func_dec(36)](new Request(new URL(func_dec(170), var_bt)));
              if (var_cj[func_dec(38)] < 400) var_cg = await var_cj[func_dec(34)]();
            } catch (var_ck) {}
          }
          if (!var_cg) {
            try {
              const var_cl = func_dec(171);
              const var_cm = await fetchT(var_cl, {}, 5000);
              if (var_cm[func_dec(33)]) var_cg = await var_cm[func_dec(34)]();
            } catch (var_cn) {}
          }
          if (var_cg) {
            var_cg = var_cg[func_dec(27)](new RegExp(func_dec(172), func_dec(29)), CURRENT_VERSION);
            var_cg = var_cg[func_dec(27)](func_dec(173), var_bq[func_dec(174)] !== undefined ? func_dec(11) : func_dec(175));
            return new Response(var_cg, {
              [func_dec(105)]: {
                [func_dec(106)]: func_dec(176)
              }
            });
          }
          return new Response(func_dec(177), {
            [func_dec(38)]: 502
          });
        }
        if (var_bw === func_dec(11) + var_bx + func_dec(151)) return await handleAuth(var_bp, var_bt[func_dec(128)], var_br, var_bq);
        if (var_bw === func_dec(11) + var_bx + func_dec(152) || var_bw[func_dec(6)](func_dec(152))) {
          if (var_bp[func_dec(131)] === func_dec(178)) {
            return new Response(null, {
              [func_dec(38)]: 204,
              [func_dec(105)]: {
                [func_dec(179)]: func_dec(180),
                [func_dec(181)]: func_dec(182),
                [func_dec(183)]: func_dec(184)
              }
            });
          }
          if (var_bp[func_dec(131)] !== func_dec(185)) return new Response(func_dec(186), {
            [func_dec(38)]: 405
          });
          const var_co = await handleConfigSync(var_bp, var_bq, var_br);
          var_co[func_dec(105)][func_dec(126)](func_dec(179), func_dec(180));
          return var_co;
        }
        if (var_bw === func_dec(11) + var_bx + func_dec(155)) return await handleLogs(var_bp, var_bq, isAuthorized);
        if (var_bw[func_dec(6)](func_dec(156))) return await handleUsersApi(var_bp, var_bq, var_br);
        if (var_bw[func_dec(6)](func_dec(157))) return await handleStatsApi(var_bp, var_bq);
        if (var_bw[func_dec(6)](func_dec(158))) return await handleUpdateApi(var_bp, var_bq, var_br);
        if (var_bw[func_dec(6)](func_dec(159))) return await handleApiKeys(var_bp, var_bq, var_br);
        if (var_bw === func_dec(11) + var_bx + func_dec(154)) return await handleSyncPanel(var_bp, var_bq, var_br);
        if (var_bw === func_dec(11) + var_bx + func_dec(153)) return await handleTelegramWebhook(var_bp, var_bq, var_bt[func_dec(128)], var_br);
        if (var_by) {
          const var_cp = (var_bp[func_dec(105)][func_dec(0)](func_dec(187)) || func_dec(11))[func_dec(25)]();
          const var_cq = var_bp[func_dec(105)][func_dec(0)](func_dec(127)) || var_bt[func_dec(128)];
          const var_cr = Array[func_dec(22)](state[func_dec(86)][func_dec(23)]) && state[func_dec(86)][func_dec(23)][func_dec(15)] > 0;
          let var_cs = null;
          let var_ct = false;
          if (var_cr) {
            if (var_bz) {
              const var_di = var_bz[func_dec(115)]();
              var_cs = state[func_dec(86)][func_dec(23)][func_dec(24)](var_dj => var_dj[func_dec(26)][func_dec(25)]() === var_di[func_dec(25)]() || var_dj[func_dec(5)][func_dec(25)]() === var_di[func_dec(25)]() || var_dj[func_dec(5)][func_dec(27)](new RegExp(func_dec(28), func_dec(29)), func_dec(11))[func_dec(25)]() === var_di[func_dec(27)](new RegExp(func_dec(28), func_dec(29)), func_dec(11))[func_dec(25)]());
              if (var_cs) var_ct = true;
            }
            if (!var_cs && state[func_dec(86)][func_dec(23)][func_dec(15)] === 1) {
              var_cs = state[func_dec(86)][func_dec(23)][0];
              var_ct = true;
            }
          } else {
            var_ct = true;
            var_cs = {
              [func_dec(5)]: state[func_dec(40)],
              [func_dec(26)]: func_dec(39)
            };
          }
          const var_cu = (var_bt[func_dec(1)][func_dec(0)](func_dec(188)) || var_bt[func_dec(1)][func_dec(0)](func_dec(189)) || func_dec(11))[func_dec(25)]();
          const var_cv = (var_bp[func_dec(105)][func_dec(0)](func_dec(190)) || func_dec(11))[func_dec(25)]();
          const var_cw = (var_bp[func_dec(105)][func_dec(0)](func_dec(191)) || func_dec(11))[func_dec(25)]();
          const var_cx = Boolean(var_cu);
          const var_cy = var_cp[func_dec(20)](func_dec(192)) || var_cp[func_dec(20)](func_dec(193)) || var_cp[func_dec(20)](func_dec(194)) || var_cp[func_dec(20)](func_dec(195)) || var_cp[func_dec(20)](func_dec(196)) || var_cp[func_dec(20)](func_dec(197)) || var_cp[func_dec(20)](func_dec(198)) || var_cp[func_dec(20)](func_dec(199)) || var_cp[func_dec(20)](func_dec(200)) || var_cp[func_dec(20)](getGamma());
          const var_cz = !var_cx && !var_cy && (var_cw === func_dec(201) || var_cv[func_dec(20)](func_dec(202)) || var_cp[func_dec(20)](func_dec(203)) || var_cp[func_dec(20)](func_dec(204)) || var_cp[func_dec(20)](func_dec(205)));
          if (var_cz || var_cu === func_dec(206) || var_bt[func_dec(1)][func_dec(0)](func_dec(207)) === func_dec(206)) {
            if (var_ct || var_cr && !var_cs) {
              const var_dk = var_cs || state[func_dec(86)][func_dec(23)][0];
              return await func_b(var_bp, var_bt, var_dk, var_cq, var_bq);
            }
            return func_c(var_bp, var_bt);
          }
          if (var_cr && !var_ct) {
            return new Response(func_dec(208), {
              [func_dec(38)]: 403
            });
          }
          const var_da = var_bt[func_dec(1)][func_dec(0)](func_dec(209)) === func_dec(210);
          const var_db = new Headers();
          var_db[func_dec(126)](func_dec(108), func_dec(211));
          var_db[func_dec(126)](func_dec(179), func_dec(180));
          if (var_cu === func_dec(212) || var_cu === func_dec(213)) {
            const var_dl = var_cs?.[func_dec(26)] || func_dec(39);
            const var_dm = var_cs?.[func_dec(5)] || state[func_dec(40)] || func_dec(41);
            const var_dn = var_dm[func_dec(27)](new RegExp(func_dec(28), func_dec(29)), func_dec(11))[func_dec(25)]();
            const var_do = state[func_dec(42)]?.[func_dec(23)]?.[var_dn] || {
              [func_dec(43)]: 0,
              [func_dec(44)]: 0,
              [func_dec(45)]: func_dec(11)
            };
            const var_dp = new Date()[func_dec(47)]()[func_dec(46)](func_dec(48))[0];
            const var_dq = usageTotalBytes(var_do);
            const var_dr = usageDailyBytes(var_do, var_dp);
            const var_ds = limitReqToBytes(var_cs?.[func_dec(49)] || 0);
            const var_dt = limitReqToBytes(var_cs?.[func_dec(50)] || 0);
            const var_du = var_bt[func_dec(82)] || func_dec(83);
            const var_dv = func_dec(11) + var_du + func_dec(84) + var_cq + func_dec(16) + encodeURI(state[func_dec(86)][func_dec(85)]) + func_dec(11);
            const var_dw = Array[func_dec(22)](state[func_dec(86)][func_dec(23)]) && state[func_dec(86)][func_dec(23)][func_dec(15)] > 0;
            const var_dx = var_cs?.[func_dec(26)] === func_dec(39) && !var_dw ? var_dv : func_dec(11) + var_dv + func_dec(87) + encodeURIComponent(var_cs?.[func_dec(26)] || var_cs?.[func_dec(5)] || func_dec(11)) + func_dec(11);
            const var_dy = func_dec(11) + var_dx + func_dec(11) + (var_dx[func_dec(20)](func_dec(89)) ? func_dec(90) : func_dec(89)) + func_dec(88);
            let var_dz = func_dec(52);
            if (var_cs?.[func_dec(53)]) {
              const var_ea = new Date(var_cs[func_dec(53)]);
              var_dz = var_ea[func_dec(47)]()[func_dec(46)](func_dec(48))[0] + func_dec(54) + var_ea[func_dec(55)]()[func_dec(46)](func_dec(54))[0][func_dec(8)](0, 5);
            }
            return new Response(JSON[func_dec(214)]({
              [func_dec(215)]: var_dl,
              [func_dec(216)]: var_dm,
              [func_dec(217)]: (var_dq / 1073741824)[func_dec(51)](2),
              [func_dec(218)]: var_cs?.[func_dec(49)] ? (var_ds / 1073741824)[func_dec(51)](2) : func_dec(52),
              [func_dec(219)]: (var_dr / 1073741824)[func_dec(51)](2),
              [func_dec(220)]: var_cs?.[func_dec(50)] ? (var_dt / 1073741824)[func_dec(51)](2) : func_dec(52),
              [func_dec(221)]: var_dz,
              [func_dec(222)]: var_cs?.[func_dec(58)] ? func_dec(67) : func_dec(57),
              [func_dec(223)]: var_dx,
              [func_dec(224)]: var_dy,
              [func_dec(225)]: safeBtoa(var_dx)
            }), {
              [func_dec(105)]: {
                [func_dec(106)]: func_dec(226),
                [func_dec(179)]: func_dec(180)
              }
            });
          }
          let var_dc = var_cu === func_dec(192) || var_cu === func_dec(227) || var_cu === func_dec(199);
          let var_dd = var_cu === func_dec(228) || var_cu === func_dec(194) || var_cu === func_dec(193) || var_cu === func_dec(229);
          let var_de = var_cu === func_dec(230) || var_cu === func_dec(231);
          let var_df = var_cu === func_dec(232) || var_cu === func_dec(233);
          let var_dg = var_cu === func_dec(234) || var_cu === func_dec(34) || var_cu === func_dec(235);
          if (!var_dc && !var_dd && !var_de && !var_df && !var_dg) {
            if (var_cp[func_dec(20)](getGamma()) || var_cp[func_dec(20)](func_dec(199)) || var_cp[func_dec(20)](func_dec(200))) var_dc = true;else if (var_cp[func_dec(20)](func_dec(193)) || var_cp[func_dec(20)](func_dec(194)) || var_cp[func_dec(20)](func_dec(195))) var_dd = true;
          }
          const var_dh = var_cs?.[func_dec(26)] || var_bz;
          if (var_dc) {
            var_db[func_dec(126)](func_dec(106), func_dec(236));
            return new Response(await buildYamlProfile(var_cq, var_dh, var_da), {
              [func_dec(105)]: var_db
            });
          } else if (var_dd) {
            var_db[func_dec(126)](func_dec(106), func_dec(226));
            return new Response(JSON[func_dec(214)](await buildSingBoxJsonProfile(var_cq, var_dh, var_da), null, 2), {
              [func_dec(105)]: var_db
            });
          } else if (var_de) {
            var_db[func_dec(126)](func_dec(106), func_dec(226));
            return new Response(JSON[func_dec(214)](await buildClashJsonProfile(var_cq, var_dh, var_da), null, 2), {
              [func_dec(105)]: var_db
            });
          } else if (var_df) {
            var_db[func_dec(126)](func_dec(106), func_dec(226));
            return new Response(JSON[func_dec(214)](await buildVJsonProfile(var_cq, var_dh, var_da), null, 2), {
              [func_dec(105)]: var_db
            });
          } else if (var_dg) {
            var_db[func_dec(126)](func_dec(106), func_dec(237));
            return new Response(await buildUriProfile(var_cq, var_dh, var_da), {
              [func_dec(105)]: var_db
            });
          } else {
            var_db[func_dec(126)](func_dec(106), func_dec(237));
            return new Response(safeBtoa(await buildUriProfile(var_cq, var_dh, var_da)), {
              [func_dec(105)]: var_db
            });
          }
        }
      }
      if (var_bv) {
        if (state[func_dec(86)][func_dec(58)]) return new Response(null, {
          [func_dec(38)]: 503
        });
        const var_eb = var_bp[func_dec(105)][func_dec(0)](func_dec(117)) || func_dec(238);
        const var_ec = wsRateCheck(var_eb);
        if (var_ec === func_dec(239)) return new Response(func_dec(240), {
          [func_dec(38)]: 429
        });
        if (var_ec === func_dec(241)) await sleepMs(1500);
        let var_ed = -1;
        const var_ee = var_bt[func_dec(1)][func_dec(0)](func_dec(242));
        if (var_ee !== null) var_ed = parseInt(var_ee, 10);
        return await processTelemetryStream(var_bq, var_br, var_ed);
      }
      return new Response(null, {
        [func_dec(38)]: 404
      });
    } catch (var_ef) {
      return new Response(null, {
        [func_dec(38)]: 404
      });
    } finally {
      state[func_dec(139)] = Math[func_dec(69)](0, state[func_dec(139)] - 1);
    }
  },
  [func_dec(243)]: async function (var_eg, var_eh, var_ei) {
    try {
      await loadSysConfig(var_eh, var_ei);
      if (state[func_dec(86)][func_dec(244)]) {}
    } catch (var_ej) {}
  }
};