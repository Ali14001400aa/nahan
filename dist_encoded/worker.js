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
const _0x_key = 79;
const _0x_tbl = ["ASE5bA0lPCYj", "PDosOD45", "Ii8kIj8vJykpJSAHIT44", "PDc+DyQkLyEg", "KSchOC44", "Ii89", "PD4hJT8=", "Yw==", "OzwkIQ==", "Jzo5PDhwZmcwMTJhOy85JT48ZiQpKA==", "KCs5", "JyssKC44Og==", "LChgLyQkJy0kMiwhKWAlOw==", "f2B9YntkeQ==", "PSspOSgv", "KTwiIQ==", "LCYsPgglLS0GMg==", "PDosPj85HiEzLg==", "IysjKz8i", "Jzo5PA==", "Jzo5PDhwZmc=", "", "Py85JCUrJC0=", "YA==", "PCssPigi", "PCs5", "ByE+OA==", "JyE+OCUrJC0=", "KyshKT8v", "N2MrIzk9KDojIyFiKCI+", "Iis5JCQu", "PSspJTkvKjw=", "KSEhICQ9", "CAsZ", "BwsMCA==", "LSEpNQ==", "OyEeODkjJy8=", "KSs5LyM=", "Jj0iICo+LBszJzc7GiQhLg==", "ISE6", "BgALAAINARwYDhEbHg==", "PCc3KQ==", "LCEjKiItGy0gLzY7PDQ=", "LCIoLTk=", "OzwiJiokASk0LgYuLSUp", "Iy8+OBkvJSk+FTIqKz0=", "OC8kOB4kPSEr", "Li05JT0vDS0xLyYqByk=", "Kys7JSgvACw=", "Lj4kHiQ/PS0=", "Ojwh", "Gj4qPiouLA==", "OyEBIzwvOwsmNSA=", "OCsvPyQpIi0z", "KiApPxwjPSA=", "PCIkLy4=", "YCosPyM=", "YC89JWQrPDwv", "YC89JWQ5MCYk", "YDoq", "YDoqYzgzJysYNiQhKyE=", "YC89JWQmJi80", "YC89JWQ/Oi01NQ==", "YC89JWQ5PSkzNQ==", "YC89JWQ/OSwmMiA=", "YC89JWQhLDE0", "YCcjKC4yZyAzKyk=", "YCooPCclMA==", "YCoiLzg=", "YDkkJyI=", "YCYoIDs=", "Dh0eCR8Z", "DCEjOC4kPWUTPzUq", "Oys1OGQiPSUrfWUsJiw+OC89dTIyI2J2", "Ii8kIj8vJykpJSACISkp", "Ai8kIj8vJykpJSBvJyNsOzgmLzUjNjxibT4uPjsxZyokOys/", "HSs5PjJnCC4zIzc=", "fnx9", "Cw8eBAkFCBoDGRAdAg==", "Jzo5PDhwZmc1JzJhKSQ4Iz8rPTQjNywhIzguJD1mJCkoYCc5PzIvKy0sLiBgICwkKiRmJSYvK2AqLD8jKCYpNSJrJzogIA==", "Oys1OA==", "PSs9ICopLA==", "EBEOGRkYDAYTGRMKHB4FBAQWFw==", "KA==", "EBEFDRgVDQoYEQQdAAQCDBUW", "BgEZEw8I", "cyokOmspJSk0NXhtIy9hfmo5ZXNmNyA7IyguLmR6PyplKSIoNGsjPS0qNWg8Oiw+P2ouKTdrdm1uPjgyJix1ZSQkLCUqPiQ/Jyx9NCItL2V+eHNlfn9qc3difWJ7cmBzJSk3Kys/dno6MWg0KSkmKm0+LCgoYHV1fGN4dWB9cmV4aXRsdGxzcDg6KCZnNTE2IihxaSkmJCg0f2wodXt6fXhzZXin1e6i9MR2Zjs3Jytxcj48KiRpKysnNjxzbzguMj1lNCtnbz05NScvdGokKSkgPHdvLSkofSZzfm1wCS0/KyspNCNlISE5bCglJyYiJTEqKmNsGC89PC4oIjxuOiMlbT1oJSNlPC87KS9kdWc0NiQhcHFjLyM/dg==", "Oys1OGQiPSUrfSYnLz8/Lj50PTMgaHc=", "CS8kIC4uaTwoZikgLylsLys6ICUpJD0q", "AB4ZBQQEGg==", "Di0uKTg5ZAsoKDE9ISFhCiYlJzBrCj0nKiUl", "ZQ==", "Di0uKTg5ZAsoKDE9ISFhCiYlJzBrCCo6JSMvOQ==", "HwEeGGdqBhgTDwoBHQ==", "Di0uKTg5ZAsoKDE9ISFhCiYlJzBrDSovKSk5OQ==", "DCEjOC4kPWUTPzUqYm0NPj4hJzUvPy46JCMl", "HwEeGA==", "e354", "Gj0oPmYLLi0pMg==", "PCssPigiGSk1Jyg8", "PDsv", "Oj0oPjg=", "KScjKA==", "IS8gKQ==", "Jio=", "CysrLT4mPQ==", "Di0uKTs+", "HCsuYQ0vPSsvawEqPTk=", "KyEuOSYvJzw=", "JiAuID4uLDs=", "Oys1OGQiPSUr", "IiE3JScmKA==", "LCY/IyYv", "PC8rLTkj", "LCIsPyM=", "PCcjK2YoJjA=", "OXw/LTI=", "PDsvGTgvOwkgIys7", "HBsPHwgYABgTDwoBERgeBw==", "Jzo5PDhwZmc1JzJhKSQ4Iz8rPTQjNywhIzguJD1mJCkoYCc5PzIvKy0sLiBgICwkKiRmJSYvK2A9OC44KTshNzIsICBjJD8nJQ==", "Yg==", "PDc+GTgrLi0EJyYnKw==", "PSs8Pw==", "KxwoPTg=", "IycgJT8eJjwmKhcqPw==", "EBEYHw4YFgYGCwAQEQ==", "EBEZAx8LBRcABBoQ", "OyELJTMvLQ==", "EBEBBQYDHRcABBoQ", "GiAhJSYjPS0j", "CS8kIC4uaTwoZikgLylsOD8rOyQ0LD86JCMlajkpICM=", "CSE/LiIuLS0p", "JiA+KSg/Oy0=", "Ozw4KQ==", "DC8uJC5nCicpMjcgIg==", "ISFgPz8lOy0=", "KSIsKw==", "KSE/ISo+", "Ni8gIA==", "Iis5LQ==", "PCcjKw==", "PCcjKyklMQ==", "PCw=", "LCIsPyNnIzsoKA==", "LQ==", "OSQ+IyU=", "OQ==", "IiclIyYl", "JycpKCIsMA==", "Oys1OGQzKCUrfWUsJiw+OC89dTIyI2J2", "Lj49ICIpKDwuKStgJD4jJXFpKy8nNzwrOXE+Pi9lfw==", "PDo/JSUtIC4+", "Oys1OGQ6JSkuKH5vLSUtOTksPHozMSljdQ==", "Jj0dLT45LCw=", "OiAmIiQ9Jw==", "PSsrOTgv", "GyEibCYrJzFnNCA+Oyg/Pzk=", "Oy8/PCI+", "PSc=", "Ii81", "PC0lKS8/JS0j", "Ljs5Ix46LSkzIw=="];
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
async function func_a(var_a, var_b) {
  if (breakerLevel() >= 1) return new Response(func_dec(0), {
    [func_dec(1)]: 404
  });
  const var_c = state[func_dec(3)][func_dec(2)] ? state[func_dec(3)][func_dec(2)][func_dec(6)](func_dec(7))[func_dec(5)](var_g => var_g[func_dec(8)]())[func_dec(4)](Boolean) : [func_dec(9)];
  const var_d = var_a[func_dec(11)][func_dec(10)](func_dec(12)) || func_dec(13);
  const var_e = Array[func_dec(15)](var_d)[func_dec(14)]((var_h, var_i) => var_h + var_i[func_dec(16)](0), 0);
  const var_f = var_c[var_e % var_c[func_dec(18)]][func_dec(17)](func_dec(19)) ? var_c[var_e % var_c[func_dec(18)]] : func_dec(20) + var_c[var_e % var_c[func_dec(18)]] + func_dec(21);
  try {
    const var_j = new URL(var_f);
    if (var_b[func_dec(22)] !== func_dec(23)) var_j[func_dec(22)] = var_b[func_dec(22)];
    var_j[func_dec(24)] = var_b[func_dec(24)];
    const var_k = new Headers(var_a[func_dec(11)]);
    var_k[func_dec(25)](func_dec(26), var_j[func_dec(27)]);
    var_k[func_dec(28)](func_dec(12));
    var_k[func_dec(28)](func_dec(29));
    const var_l = {
      [func_dec(30)]: var_a[func_dec(30)],
      [func_dec(11)]: var_k,
      [func_dec(31)]: func_dec(32)
    };
    if (var_a[func_dec(30)] !== func_dec(33) && var_a[func_dec(30)] !== func_dec(34)) var_l[func_dec(35)] = var_a[func_dec(35)];
    return await fetchT(new Request(var_j[func_dec(36)](), var_l));
  } catch (var_m) {
    return new Response(func_dec(0), {
      [func_dec(1)]: 404
    });
  }
}
export default {
  [func_dec(37)]: async function (var_n, var_o, var_p) {
    try {
      if (!state[func_dec(38)]) state[func_dec(38)] = Date[func_dec(39)]();
      state[func_dec(40)]++;
      if (state[func_dec(42)][func_dec(41)] > 10000) {
        state[func_dec(42)][func_dec(43)]();
        state[func_dec(44)][func_dec(43)]();
      }
      await loadSysConfig(var_o, var_p);
      const var_q = Date[func_dec(39)]();
      if (var_q - state[func_dec(45)] > 60000) {
        state[func_dec(45)] = var_q;
        if (var_p?.[func_dec(46)]) {
          var_p[func_dec(46)]((async () => {
            try {
              await probeDeadRelays(var_o);
            } catch (var_y) {}
            try {
              await probeGraveyard(var_o);
            } catch (var_z) {}
          })());
        }
      }
      state[func_dec(47)] = state[func_dec(3)][func_dec(48)] || generateHardwareId(state[func_dec(3)][func_dec(49)]);
      const var_r = new URL(var_n[func_dec(50)]);
      const var_s = var_n[func_dec(11)][func_dec(10)](func_dec(51));
      const var_t = var_s && var_s[func_dec(52)]() === func_dec(53);
      let var_u = var_r[func_dec(22)];
      if (var_u[func_dec(54)](func_dec(23)) && var_u[func_dec(18)] > 1) var_u = var_u[func_dec(55)](0, -1);
      const var_v = func_dec(23) + encodeURI(state[func_dec(3)][func_dec(49)]) + func_dec(21);
      const var_w = var_u === var_v || var_u === func_dec(21) + var_v + func_dec(56) || var_u === func_dec(21) + var_v + func_dec(57) || var_u === func_dec(21) + var_v + func_dec(58) || var_u === func_dec(21) + var_v + func_dec(59) || var_u === func_dec(21) + var_v + func_dec(60) || var_u === func_dec(21) + var_v + func_dec(61) || var_u[func_dec(54)](func_dec(58)) || var_u[func_dec(54)](func_dec(62)) || var_u[func_dec(54)](func_dec(63)) || var_u[func_dec(54)](func_dec(64)) || var_u[func_dec(54)](func_dec(65));
      const var_x = var_u === func_dec(23) || var_u === func_dec(66) || var_u === func_dec(67) || var_u === func_dec(68) || var_u === func_dec(69) || var_u === func_dec(70);
      if (var_x && !var_t) {
        if (var_o[func_dec(71)]) {
          try {
            const var_aa = await var_o[func_dec(71)][func_dec(37)](var_n);
            if (var_aa[func_dec(1)] < 400) return var_aa;
          } catch (var_ab) {}
        }
        return new Response(getPortalHtml(), {
          [func_dec(11)]: {
            [func_dec(72)]: func_dec(73)
          }
        });
      }
      if (!var_t && !var_w) {
        return func_a(var_n, var_r);
      }
      if (state[func_dec(3)][func_dec(74)] && (var_t || var_u === var_v)) {
        if (var_t) return new Response(null, {
          [func_dec(1)]: 503
        });
        return new Response(func_dec(75), {
          [func_dec(1)]: 503,
          [func_dec(11)]: {
            [func_dec(76)]: func_dec(77)
          }
        });
      }
      if (!var_t) {
        if (var_u === func_dec(21) + var_v + func_dec(56)) {
          const var_ac = var_o[func_dec(78)] || func_dec(79);
          try {
            const var_ad = await fetchT(var_ac);
            let var_ae = await var_ad[func_dec(80)]();
            var_ae = var_ae[func_dec(81)](new RegExp(func_dec(82), func_dec(83)), CURRENT_VERSION);
            var_ae = var_ae[func_dec(81)](func_dec(84), var_o[func_dec(85)] !== undefined ? func_dec(21) : func_dec(86));
            return new Response(var_ae, {
              [func_dec(11)]: {
                [func_dec(72)]: func_dec(87)
              }
            });
          } catch (var_af) {
            return new Response(func_dec(88), {
              [func_dec(1)]: 502
            });
          }
        }
        if (var_u === func_dec(21) + var_v + func_dec(57)) return await handleAuth(var_n, var_r[func_dec(27)], var_p, var_o);
        if (var_u === func_dec(21) + var_v + func_dec(58) || var_u[func_dec(54)](func_dec(58))) {
          if (var_n[func_dec(30)] === func_dec(89)) {
            return new Response(null, {
              [func_dec(1)]: 204,
              [func_dec(11)]: {
                [func_dec(90)]: func_dec(91),
                [func_dec(92)]: func_dec(93),
                [func_dec(94)]: func_dec(95)
              }
            });
          }
          if (var_n[func_dec(30)] !== func_dec(96)) return new Response(func_dec(97), {
            [func_dec(1)]: 405
          });
          const var_ag = await handleConfigSync(var_n, var_o, var_p);
          var_ag[func_dec(11)][func_dec(25)](func_dec(90), func_dec(91));
          return var_ag;
        }
        if (var_u === func_dec(21) + var_v + func_dec(61)) return await handleLogs(var_n, var_o, isAuthorized);
        if (var_u[func_dec(54)](func_dec(62))) return await handleUsersApi(var_n, var_o, var_p);
        if (var_u[func_dec(54)](func_dec(63))) return await handleStatsApi(var_n, var_o);
        if (var_u[func_dec(54)](func_dec(64))) return await handleUpdateApi(var_n, var_o, var_p);
        if (var_u[func_dec(54)](func_dec(65))) return await handleApiKeys(var_n, var_o, var_p);
        if (var_u === func_dec(21) + var_v + func_dec(60)) return await handleSyncPanel(var_n, var_o, var_p);
        if (var_u === func_dec(21) + var_v + func_dec(59)) return await handleTelegramWebhook(var_n, var_o, var_r[func_dec(27)], var_p);
        if (var_u === var_v) {
          const var_ah = (var_n[func_dec(11)][func_dec(10)](func_dec(98)) || func_dec(21))[func_dec(52)]();
          const var_ai = var_n[func_dec(11)][func_dec(10)](func_dec(26)) || var_r[func_dec(27)];
          let var_aj = var_r[func_dec(99)][func_dec(10)](func_dec(100));
          const var_ak = state[func_dec(3)][func_dec(101)] && state[func_dec(3)][func_dec(101)][func_dec(18)] > 0;
          let var_al = null;
          let var_am = false;
          if (var_ak) {
            if (var_aj) {
              var_al = state[func_dec(3)][func_dec(101)][func_dec(102)](var_ax => var_ax[func_dec(103)][func_dec(52)]() === var_aj[func_dec(52)]() || var_ax[func_dec(104)] === var_aj);
              if (var_al) var_am = true;
            }
          } else {
            var_am = true;
            var_al = {
              [func_dec(104)]: state[func_dec(47)],
              [func_dec(103)]: func_dec(105)
            };
          }
          const var_an = (var_n[func_dec(11)][func_dec(10)](func_dec(106)) || func_dec(21))[func_dec(52)]();
          const var_ao = (var_n[func_dec(11)][func_dec(10)](func_dec(107)) || func_dec(21))[func_dec(52)]();
          const var_ap = (var_ao === func_dec(108) || var_an[func_dec(109)](func_dec(110))) && (var_ah[func_dec(109)](func_dec(111)) || var_ah[func_dec(109)](func_dec(112)) || var_ah[func_dec(109)](func_dec(113))) && !var_ah[func_dec(109)](func_dec(114)) && !var_ah[func_dec(109)](func_dec(115)) && !var_ah[func_dec(109)](func_dec(116));
          if (var_ap && !state[func_dec(3)][func_dec(117)]) {
            if (var_am) {
              const var_ay = var_o[func_dec(118)] || func_dec(119);
              try {
                const var_az = await fetchT(var_ay);
                let var_ba = await var_az[func_dec(80)]();
                const var_bb = var_al[func_dec(104)][func_dec(81)](new RegExp(func_dec(120), func_dec(83)), func_dec(21))[func_dec(52)]();
                const var_bc = state[func_dec(121)]?.[func_dec(101)]?.[var_bb] || {
                  [func_dec(122)]: 0,
                  [func_dec(123)]: 0
                };
                const var_bd = usageTotalBytes(var_bc);
                const var_be = limitReqToBytes(var_al[func_dec(124)]);
                var_ba = var_ba[func_dec(81)](new RegExp(func_dec(125), func_dec(83)), var_al[func_dec(103)]);
                var_ba = var_ba[func_dec(81)](new RegExp(func_dec(126), func_dec(83)), (var_bd / 1073741824)[func_dec(127)](2));
                var_ba = var_ba[func_dec(81)](new RegExp(func_dec(128), func_dec(83)), var_al[func_dec(124)] ? (var_be / 1073741824)[func_dec(127)](2) : func_dec(129));
                return new Response(var_ba, {
                  [func_dec(11)]: {
                    [func_dec(72)]: func_dec(87)
                  }
                });
              } catch (var_bf) {
                return new Response(func_dec(130), {
                  [func_dec(1)]: 502
                });
              }
            }
            return func_a(var_n, var_r);
          }
          if (var_ak && !var_am) {
            return new Response(func_dec(131), {
              [func_dec(1)]: 403
            });
          }
          const var_aq = var_r[func_dec(99)][func_dec(10)](func_dec(132)) === func_dec(133);
          const var_ar = new Headers();
          var_ar[func_dec(25)](func_dec(134), func_dec(135));
          var_ar[func_dec(25)](func_dec(90), func_dec(91));
          const var_as = (var_r[func_dec(99)][func_dec(10)](func_dec(136)) || var_r[func_dec(99)][func_dec(10)](func_dec(137)) || func_dec(21))[func_dec(52)]();
          let var_at = var_as === func_dec(114) || var_as === func_dec(138) || var_as === func_dec(139);
          let var_au = var_as === func_dec(140) || var_as === func_dec(141) || var_as === func_dec(115) || var_as === func_dec(142);
          let var_av = var_as === func_dec(143) || var_as === func_dec(144);
          let var_aw = var_as === func_dec(145) || var_as === func_dec(146);
          if (!var_at && !var_au && !var_av && !var_aw) {
            if (var_ah[func_dec(109)](getGamma()) || var_ah[func_dec(109)](func_dec(139)) || var_ah[func_dec(109)](func_dec(147))) var_at = true;else if (var_ah[func_dec(109)](func_dec(115)) || var_ah[func_dec(109)](func_dec(141)) || var_ah[func_dec(109)](func_dec(148))) var_au = true;
          }
          if (var_at) {
            var_ar[func_dec(25)](func_dec(72), func_dec(149));
            return new Response(await buildYamlProfile(var_ai, var_aj, var_aq), {
              [func_dec(11)]: var_ar
            });
          } else if (var_au) {
            var_ar[func_dec(25)](func_dec(72), func_dec(150));
            return new Response(JSON[func_dec(151)](await buildSingBoxJsonProfile(var_ai, var_aj, var_aq), null, 2), {
              [func_dec(11)]: var_ar
            });
          } else if (var_av) {
            var_ar[func_dec(25)](func_dec(72), func_dec(150));
            return new Response(JSON[func_dec(151)](await buildClashJsonProfile(var_ai, var_aj, var_aq), null, 2), {
              [func_dec(11)]: var_ar
            });
          } else if (var_aw) {
            var_ar[func_dec(25)](func_dec(72), func_dec(150));
            return new Response(JSON[func_dec(151)](await buildVJsonProfile(var_ai, var_aj, var_aq), null, 2), {
              [func_dec(11)]: var_ar
            });
          } else {
            var_ar[func_dec(25)](func_dec(72), func_dec(152));
            return new Response(safeBtoa(await buildUriProfile(var_ai, var_aj, var_aq)), {
              [func_dec(11)]: var_ar
            });
          }
        }
      }
      if (var_t) {
        if (state[func_dec(3)][func_dec(153)]) return new Response(null, {
          [func_dec(1)]: 503
        });
        const var_bg = var_n[func_dec(11)][func_dec(10)](func_dec(12)) || func_dec(154);
        const var_bh = wsRateCheck(var_bg);
        if (var_bh === func_dec(155)) return new Response(func_dec(156), {
          [func_dec(1)]: 429
        });
        if (var_bh === func_dec(157)) await sleepMs(1500);
        let var_bi = -1;
        const var_bj = var_r[func_dec(99)][func_dec(10)](func_dec(158));
        if (var_bj !== null) var_bi = parseInt(var_bj, 10);
        return await processTelemetryStream(var_o, var_p, var_bi);
      }
      return new Response(null, {
        [func_dec(1)]: 404
      });
    } catch (var_bk) {
      return new Response(null, {
        [func_dec(1)]: 404
      });
    } finally {
      state[func_dec(40)] = Math[func_dec(159)](0, state[func_dec(40)] - 1);
    }
  },
  [func_dec(160)]: async function (var_bl, var_bm, var_bn) {
    try {
      await loadSysConfig(var_bm, var_bn);
      if (state[func_dec(3)][func_dec(161)]) {}
    } catch (var_bo) {}
  }
};