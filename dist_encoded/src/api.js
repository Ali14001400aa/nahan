// @ts-nocheck
import { state, CURRENT_VERSION, fetchT, usageTotalBytes, usageDailyBytes, limitReqToBytes } from "./config.js";
import { cachedD1Put, d1Get, d1Put, logActivity } from "./db.js";
import { generateApiKey } from "./crypto.js";
import { relayHealthSnapshotAsync } from "./relays.js";
import { sendTelegramMessage } from "./telegram/bot.js";
import { getAllProfiles } from "./subs/transformers.js";
const _0x_key = 79;
const _0x_tbl = ["KCs5", "ISE6", "KSc/Pz8=", "KyshKT8v", "IQ==", "PCs5", "PCc3KQ==", "LCIoLTk=", "Py8jKScLOSEMIzw8", "PDc+DyQkLyEg", "Jj0MPjkrMA==", "PCEgKQ==", "JCs0", "JyssKC44Og==", "Djs5JCQ4IDImMiwgIA==", "", "PSs9ICopLA==", "DSssPi44aQ==", "ICwnKSg+", "LChgLyQkJy0kMiwhKWAlOw==", "GiAmIiQ9Jw==", "Ii8+OC44Ai0+", "JT0iIg==", "PDo/JSUtIC4+", "PDsuLy45Og==", "Kjw/Izk=", "GyEibCYrJzFnJzE7KyA8Pzk=", "PDosOD45", "OC8kOB4kPSEr", "Djs5JGsZPCskIzY8", "HDsuLy45Oi4yKmUjISolJWovOigrZQ==", "KiA5PiIvOg==", "OjskKB45KC8i", "LCEjIi4pPTs=", "Li05JT0vCicpKDY=", "LCEjKiIt", "FB4fAx8PChwCAhg=", "LCgMPCIeJiMiKA==", "LCgMLyglPCYzDyE=", "LCgaIzkhLDoJJygq", "OykZIyAvJw==", "OykOJCo+ACw=", "OykMKCYjJwEj", "PDcjLwo6IAMiPw==", "Kys7JSgvACw=", "Li05JT0vDS0xLyYqByk=", "ISs5OyQ4Ig==", "Jj4=", "LCEhIw==", "LCg=", "Oj0sKy4=", "PDc+GTgrLi0=", "Oj0oPjg=", "PDc+GTgrLi0EJyYnKw==", "OSs/PyIlJw==", "PzwiKiImLDs=", "Ii89", "IS8gKQ==", "Jio=", "PDcjLw==", "Jzo5PDhwZmc=", "YA==", "Lj4kHiQ/PS0=", "CysrLT4mPQ==", "cD04LnY=", "DCEjOC4kPWUTPzUq", "Lj49ICIpKDwuKStgJD4jJQ==", "Djs5JGsMKCErIyE=", "CS8kIC4uaSQoISwhbiw4Py8kODNmIz0hIGw=", "CS8kIC4uaSQoISwhbiw4Py8kODM=", "ICIpBy4z", "GiAsOT8iJjouPCAr", "PDc+EyglJy4uIQ==", "DCEjKiItaRs+KCYqKg==", "HDc+OC4naSsoKCMmKTg+Kj4gJylmNjYgLikvaj8hJmYEHwc=", "Iis+PyotLA==", "Ojwh", "Iis5JCQu", "PCssPigiGSk1Jyg8", "Li05JSQk", "CAsZ", "OyEBIzwvOwsmNSA=", "Yg==", "KA==", "PSs8Pw==", "KxwoPTg=", "OyE5LSc=", "IycgJT8=", "IycgJT8eJjwmKhcqPw==", "Ky8kIDI=", "HwEeGA==", "PS8jKCQnHB0OAg==", "HDsvPyg4ICoiNA==", "OzwsKi0jKgQuKyw7", "KSIiIzk=", "KjY9JTkzBDs=", "KjY9JTkzDSk+NQ==", "ISE5KTg=", "LDwoLT8vLQkz", "Pzs+JA==", "Oj0oPg==", "CwsBCR8P", "KScjKAIkLS0/", "ASE5bC0lPCYj", "PD4hJSgv", "KyshKT8vLQ==", "OyEqKycv", "KScjKA==", "Jj0dLT45LCw=", "PSs+KT8=", "PDc+Ez45KC8i", "GzwsKi0jKmg1IzYqOg==", "BiA7LScjLWgmJTEmISM=", "IysjKz8i", "KSchOC44", "Jj0iICo+LBszJzc7GiQhLg==", "PDosODg=", "Li05JT0v", "PDc+OC4n", "Oj45JSYvGi0kKSsrPQ==", "Li05JT0vCicpKCAsOiQjJTk=", "PSshLTI5", "OzwkIQ==", "ETg=", "PD4hJT8=", "YQ==", "Ii81", "Ii8kIhQnJiwyKiA=", "EDkiPiAvO2YtNQ==", "LCEgPCo+ICouKiw7NxIoKj4s", "fX5/eGZ6emV3dw==", "LCEgPCo+ICouKiw7NxIqJysuOw==", "LiIhIzwVLD4mKhorOz8lJS0WOzMnNzs7PQ==", "Lj49KSUu", "Iis5LS8rPSk=", "Ozc9KQ==", "Lj49ICIpKDwuKStgJCw6KjkqOi42MWQjIig+Jiw=", "Jzo5PDhwZmcmNixhLSEjPi4vJCY0IGEtIiFkKSUhIigxYDh5YyopKicyKDE8YQ==", "YDkiPiAvOztoNSY9Jz04OGU=", "HxsZ", "LSEpNQ==", "KCc5JD4oGy03KQ==", "Jjo+NS4oLCMvI2ohLyUtJQ==", "Jzo5PDh1cxRoGmooJzkkPigVZiQpKBNh", "LCYoLyA=", "Jzo5PDhwZmc1JzJhKSQ4Iz8rPTQjNywhIzguJD1mJCkoYA==", "YCMsJSVlPy01NSwgIA==", "ICU=", "Oys1OA==", "LDs/Pi4kPR4iNDYmISM=", "PSsgIz8vHy01NSwgIA==", "Jy8+GTsuKDwi", "Di05JSQkaSYoMmU8Oz08JDg9LSM=", "JCs0HDkvPyEiMQ==", "PCIkLy4=", "YWBj", "JCs0Pw==", "LDwoLT8v", "BiA7LScjLWg1IzQ6Kz44", "PSsuKSI8LCw="];
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
const var_a = new Map();
export { var_a as LOGIN_ATTEMPTS };
const var_b = 15;
export { var_b as LOGIN_FAIL_LIMIT };
const var_c = 15 * 60 * 1000;
export { var_c as LOGIN_WINDOW_MS };
function func_a(var_d) {
  try {
    const var_e = var_a[func_dec(0)](var_d);
    if (!var_e) return false;
    if (Date[func_dec(1)]() - var_e[func_dec(2)] > var_c) {
      var_a[func_dec(3)](var_d);
      return false;
    }
    return var_e[func_dec(4)] >= var_b;
  } catch (var_f) {
    return false;
  }
}
export { func_a as authBlocked };
function func_b(var_g) {
  try {
    const var_h = Date[func_dec(1)]();
    let var_i = var_a[func_dec(0)](var_g);
    if (!var_i || var_h - var_i[func_dec(2)] > var_c) var_i = {
      [func_dec(4)]: 0,
      [func_dec(2)]: var_h
    };
    var_i[func_dec(4)]++;
    var_a[func_dec(5)](var_g, var_i);
    if (var_a[func_dec(6)] > 10000) var_a[func_dec(7)]();
  } catch (var_j) {}
}
export { func_b as authFail };
function func_c(var_k) {
  try {
    var_a[func_dec(3)](var_k);
  } catch (var_l) {}
}
export { func_c as authClear };
function func_d(var_m) {
  if (!var_m || !state[func_dec(9)][func_dec(8)] || !Array[func_dec(10)](state[func_dec(9)][func_dec(8)])) return false;
  return state[func_dec(9)][func_dec(8)][func_dec(11)](var_n => var_n[func_dec(12)] === var_m);
}
export { func_d as isPanelApiKey };
function func_e(var_o, var_p) {
  const var_q = var_o[func_dec(13)][func_dec(0)](func_dec(14)) || func_dec(15);
  const var_r = var_q[func_dec(16)](func_dec(17), func_dec(15)) || func_dec(15);
  let var_s = func_dec(15);
  if (var_p && typeof var_p === func_dec(18)) var_s = var_p[func_dec(12)] || func_dec(15);
  return var_r || var_s;
}
export { func_e as extractAuthKey };
function func_f(var_t, var_u) {
  try {
    const var_v = var_t?.[func_dec(13)]?.[func_dec(0)](func_dec(19)) || func_dec(20);
    if (func_a(var_v)) return false;
    const var_w = func_e(var_t, var_u);
    const var_x = var_w === state[func_dec(9)][func_dec(21)] || func_d(var_w);
    if (!var_x) func_b(var_v);
    return var_x;
  } catch (var_y) {
    return false;
  }
}
export { func_f as isAuthorized };
async function func_g(var_z, var_aa, var_ab, var_ac) {
  try {
    const var_ad = await var_z[func_dec(22)]();
    const var_ae = var_z[func_dec(13)][func_dec(0)](func_dec(19)) || func_dec(20);
    if (func_a(var_ae)) {
      return new Response(JSON[func_dec(23)]({
        [func_dec(24)]: false,
        [func_dec(25)]: func_dec(26)
      }), {
        [func_dec(27)]: 429
      });
    }
    const var_af = func_e(var_z, var_ad);
    if (var_af === state[func_dec(9)][func_dec(21)] || func_d(var_af)) {
      func_c(var_ae);
      var_ab?.[func_dec(28)](logActivity(var_ac, func_dec(29), func_dec(30) + var_ae + func_dec(15)));
      let var_ag = {};
      for (let [var_ah, var_ai] of state[func_dec(32)][func_dec(31)]()) {
        var_ag[var_ah] = {
          ...var_ai,
          [func_dec(33)]: state[func_dec(34)][func_dec(0)](var_ah) || 0
        };
      }
      return new Response(JSON[func_dec(23)]({
        [func_dec(24)]: true,
        [func_dec(35)]: func_d(var_af) ? {
          ...state[func_dec(9)],
          [func_dec(21)]: func_dec(36),
          [func_dec(8)]: func_dec(36),
          [func_dec(37)]: func_dec(36),
          [func_dec(38)]: func_dec(36),
          [func_dec(39)]: func_dec(36),
          [func_dec(40)]: func_dec(36),
          [func_dec(41)]: func_dec(36),
          [func_dec(42)]: func_dec(36),
          [func_dec(43)]: func_dec(36)
        } : state[func_dec(9)],
        [func_dec(44)]: state[func_dec(45)],
        [func_dec(46)]: {
          [func_dec(47)]: var_ae,
          [func_dec(48)]: var_z[func_dec(49)]?.[func_dec(48)] || func_dec(20)
        },
        [func_dec(50)]: var_ag,
        [func_dec(51)]: state[func_dec(53)]?.[func_dec(52)] || {},
        [func_dec(54)]: CURRENT_VERSION,
        [func_dec(55)]: getAllProfiles()[func_dec(56)](var_aj => ({
          [func_dec(57)]: var_aj[func_dec(57)],
          [func_dec(58)]: var_aj[func_dec(58)],
          [func_dec(59)]: func_dec(60) + var_aa + func_dec(61) + state[func_dec(9)][func_dec(62)] + func_dec(15) + (var_aj[func_dec(57)] === func_dec(63) ? func_dec(15) : func_dec(64) + encodeURIComponent(var_aj[func_dec(57)])) + func_dec(15)
        }))
      }), {
        [func_dec(27)]: 200,
        [func_dec(13)]: {
          [func_dec(65)]: func_dec(66)
        }
      });
    }
    var_ab?.[func_dec(28)](logActivity(var_ac, func_dec(67), func_dec(68) + var_ae + func_dec(15)));
    func_b(var_ae);
    if (var_ab) var_ab[func_dec(28)](sendTelegramMessage(var_z, func_dec(69), var_aa));
    return new Response(JSON[func_dec(23)]({
      [func_dec(24)]: false
    }), {
      [func_dec(27)]: 401
    });
  } catch (var_ak) {
    return new Response(JSON[func_dec(23)]({
      [func_dec(24)]: false
    }), {
      [func_dec(27)]: 400
    });
  }
}
export { func_g as handleAuth };
async function func_h(var_al, var_am, var_an) {
  try {
    const var_ao = await var_al[func_dec(22)]();
    const var_ap = var_al[func_dec(13)][func_dec(0)](func_dec(19)) || func_dec(20);
    if (func_a(var_ap)) {
      return new Response(JSON[func_dec(23)]({
        [func_dec(24)]: false,
        [func_dec(25)]: func_dec(26)
      }), {
        [func_dec(27)]: 429
      });
    }
    const var_aq = var_ao[func_dec(12)] === state[func_dec(9)][func_dec(21)] || var_ao[func_dec(70)] && var_ao[func_dec(70)] === state[func_dec(9)][func_dec(21)] || func_d(var_ao[func_dec(12)]) || func_d(var_ao[func_dec(70)]);
    if (!var_aq) {
      func_b(var_ap);
      return new Response(JSON[func_dec(23)]({
        [func_dec(24)]: false,
        [func_dec(25)]: func_dec(71)
      }), {
        [func_dec(27)]: 401
      });
    }
    func_c(var_ap);
    if (var_ao[func_dec(35)]) {
      state[func_dec(9)] = {
        ...state[func_dec(9)],
        ...var_ao[func_dec(35)]
      };
      await cachedD1Put(var_am, func_dec(72), JSON[func_dec(23)](state[func_dec(9)]));
      var_an?.[func_dec(28)](logActivity(var_am, func_dec(73), func_dec(74)));
    }
    return new Response(JSON[func_dec(23)]({
      [func_dec(24)]: true,
      [func_dec(35)]: state[func_dec(9)]
    }), {
      [func_dec(13)]: {
        [func_dec(65)]: func_dec(66)
      }
    });
  } catch (var_ar) {
    return new Response(JSON[func_dec(23)]({
      [func_dec(24)]: false,
      [func_dec(25)]: var_ar[func_dec(75)]
    }), {
      [func_dec(27)]: 500
    });
  }
}
export { func_h as handleConfigSync };
async function func_i(var_as, var_at, var_au) {
  try {
    const var_av = new URL(var_as[func_dec(76)]);
    const var_aw = var_as[func_dec(77)];
    const var_ax = var_av[func_dec(78)][func_dec(0)](func_dec(58));
    const var_ay = var_av[func_dec(78)][func_dec(0)](func_dec(79));
    const var_az = var_as[func_dec(13)][func_dec(0)](func_dec(19)) || func_dec(20);
    if (func_a(var_az)) {
      return new Response(JSON[func_dec(23)]({
        [func_dec(24)]: false,
        [func_dec(25)]: func_dec(26)
      }), {
        [func_dec(27)]: 429
      });
    }
    const var_ba = func_e(var_as, null);
    if (var_ba !== state[func_dec(9)][func_dec(21)] && !func_d(var_ba)) {
      func_b(var_az);
      return new Response(JSON[func_dec(23)]({
        [func_dec(24)]: false,
        [func_dec(25)]: func_dec(71)
      }), {
        [func_dec(27)]: 401
      });
    }
    func_c(var_az);
    if (var_aw === func_dec(80) && !var_ax) {
      const var_bb = (state[func_dec(9)][func_dec(52)] || [])[func_dec(56)](var_bc => {
        const var_bd = var_bc[func_dec(58)][func_dec(16)](new RegExp(func_dec(82), func_dec(83)), func_dec(15))[func_dec(81)]();
        const var_be = state[func_dec(53)]?.[func_dec(52)]?.[var_bd] || {
          [func_dec(84)]: 0,
          [func_dec(85)]: 0
        };
        return {
          ...var_bc,
          [func_dec(50)]: {
            [func_dec(86)]: usageTotalBytes(var_be),
            [func_dec(87)]: limitReqToBytes(var_bc[func_dec(88)]),
            [func_dec(89)]: var_be[func_dec(85)] || 0
          }
        };
      });
      return new Response(JSON[func_dec(23)]({
        [func_dec(24)]: true,
        [func_dec(52)]: var_bb
      }), {
        [func_dec(13)]: {
          [func_dec(65)]: func_dec(66)
        }
      });
    }
    if (var_aw === func_dec(90) && !var_ax) {
      const var_bf = await var_as[func_dec(22)]();
      const var_bg = crypto[func_dec(91)]();
      const var_bh = {
        [func_dec(58)]: var_bg,
        [func_dec(57)]: var_bf[func_dec(57)] || func_dec(92),
        [func_dec(88)]: var_bf[func_dec(93)] ? Math[func_dec(94)](parseFloat(var_bf[func_dec(93)]) * 6000) : null,
        [func_dec(95)]: var_bf[func_dec(96)] ? Date[func_dec(1)]() + parseInt(var_bf[func_dec(96)]) * 86400000 : null,
        [func_dec(97)]: var_bf[func_dec(97)] || func_dec(15),
        [func_dec(98)]: Date[func_dec(1)]()
      };
      if (!state[func_dec(9)][func_dec(52)]) state[func_dec(9)][func_dec(52)] = [];
      state[func_dec(9)][func_dec(52)][func_dec(99)](var_bh);
      await cachedD1Put(var_at, func_dec(72), JSON[func_dec(23)](state[func_dec(9)]));
      return new Response(JSON[func_dec(23)]({
        [func_dec(24)]: true,
        [func_dec(100)]: var_bh
      }), {
        [func_dec(27)]: 201
      });
    }
    if (var_aw === func_dec(101) && var_ax) {
      const var_bi = (state[func_dec(9)][func_dec(52)] || [])[func_dec(102)](var_bk => var_bk[func_dec(58)] === var_ax);
      if (var_bi === -1) return new Response(JSON[func_dec(23)]({
        [func_dec(24)]: false,
        [func_dec(25)]: func_dec(103)
      }), {
        [func_dec(27)]: 404
      });
      const var_bj = state[func_dec(9)][func_dec(52)][func_dec(104)](var_bi, 1)[0];
      await cachedD1Put(var_at, func_dec(72), JSON[func_dec(23)](state[func_dec(9)]));
      return new Response(JSON[func_dec(23)]({
        [func_dec(24)]: true,
        [func_dec(105)]: var_bj[func_dec(58)]
      }));
    }
    if (var_aw === func_dec(90) && var_ax && var_ay === func_dec(106)) {
      const var_bl = (state[func_dec(9)][func_dec(52)] || [])[func_dec(107)](var_bm => var_bm[func_dec(58)] === var_ax);
      if (!var_bl) return new Response(JSON[func_dec(23)]({
        [func_dec(24)]: false,
        [func_dec(25)]: func_dec(103)
      }), {
        [func_dec(27)]: 404
      });
      var_bl[func_dec(108)] = !var_bl[func_dec(108)];
      await cachedD1Put(var_at, func_dec(72), JSON[func_dec(23)](state[func_dec(9)]));
      return new Response(JSON[func_dec(23)]({
        [func_dec(24)]: true,
        [func_dec(100)]: var_bl
      }));
    }
    if (var_aw === func_dec(90) && var_ax && var_ay === func_dec(109)) {
      const var_bn = var_ax[func_dec(16)](new RegExp(func_dec(82), func_dec(83)), func_dec(15))[func_dec(81)]();
      if (state[func_dec(53)][func_dec(52)]?.[var_bn]) {
        state[func_dec(53)][func_dec(52)][var_bn][func_dec(84)] = 0;
        state[func_dec(53)][func_dec(52)][var_bn][func_dec(85)] = 0;
        await cachedD1Put(var_at, func_dec(110), JSON[func_dec(23)](state[func_dec(53)]));
      }
      return new Response(JSON[func_dec(23)]({
        [func_dec(24)]: true,
        [func_dec(75)]: func_dec(111)
      }));
    }
    return new Response(JSON[func_dec(23)]({
      [func_dec(24)]: false,
      [func_dec(25)]: func_dec(112)
    }), {
      [func_dec(27)]: 400
    });
  } catch (var_bo) {
    return new Response(JSON[func_dec(23)]({
      [func_dec(24)]: false,
      [func_dec(25)]: var_bo[func_dec(75)]
    }), {
      [func_dec(27)]: 500
    });
  }
}
export { func_i as handleUsersApi };
async function func_j(var_bp, var_bq) {
  try {
    const var_br = state[func_dec(9)][func_dec(52)] || [];
    const var_bs = var_br[func_dec(114)](var_bu => !var_bu[func_dec(108)])[func_dec(113)];
    const var_bt = Math[func_dec(94)]((Date[func_dec(1)]() - state[func_dec(115)]) / 1000);
    return new Response(JSON[func_dec(23)]({
      [func_dec(24)]: true,
      [func_dec(116)]: {
        [func_dec(52)]: {
          [func_dec(86)]: var_br[func_dec(113)],
          [func_dec(117)]: var_bs
        },
        [func_dec(118)]: {
          [func_dec(119)]: var_bt,
          [func_dec(120)]: state[func_dec(120)],
          [func_dec(54)]: CURRENT_VERSION
        },
        [func_dec(121)]: await relayHealthSnapshotAsync(var_bq)
      }
    }), {
      [func_dec(13)]: {
        [func_dec(65)]: func_dec(66)
      }
    });
  } catch (var_bv) {
    return new Response(JSON[func_dec(23)]({
      [func_dec(24)]: false,
      [func_dec(25)]: var_bv[func_dec(75)]
    }), {
      [func_dec(27)]: 500
    });
  }
}
export { func_j as handleStatsApi };
function func_k(var_bw, var_bx) {
  const func_p = var_ca => String(var_ca)[func_dec(16)](new RegExp(func_dec(123), func_dec(15)), func_dec(15))[func_dec(122)]();
  const var_by = func_p(var_bw)[func_dec(124)](func_dec(125))[func_dec(56)](Number);
  const var_bz = func_p(var_bx)[func_dec(124)](func_dec(125))[func_dec(56)](Number);
  for (let var_cb = 0; var_cb < Math[func_dec(126)](var_by[func_dec(113)], var_bz[func_dec(113)]); var_cb++) {
    const var_cc = var_by[var_cb] || 0,
      var_cd = var_bz[var_cb] || 0;
    if (var_cc > var_cd) return 1;
    if (var_cd > var_cc) return -1;
  }
  return 0;
}
export { func_k as cmpVersions };
async function func_l(var_ce, var_cf, var_cg, var_ch) {
  const var_ci = {
    [func_dec(127)]: func_dec(128),
    [func_dec(129)]: func_dec(130),
    [func_dec(131)]: [func_dec(132)]
  };
  const var_cj = new FormData();
  var_cj[func_dec(133)](func_dec(134), new Blob([JSON[func_dec(23)](var_ci)], {
    [func_dec(135)]: func_dec(66)
  }));
  var_cj[func_dec(133)](func_dec(128), new Blob([var_ch], {
    [func_dec(135)]: func_dec(136)
  }), func_dec(128));
  return await fetchT(func_dec(137) + var_ce + func_dec(138) + encodeURIComponent(var_cg) + func_dec(15), {
    [func_dec(77)]: func_dec(139),
    [func_dec(13)]: {
      [func_dec(14)]: func_dec(17) + var_cf + func_dec(15)
    },
    [func_dec(140)]: var_cj
  }, 30000);
}
export { func_l as deployWorkerToCloudflare };
async function func_m(var_ck, var_cl, var_cm) {
  try {
    const var_cn = await var_ck[func_dec(22)]();
    const var_co = (state[func_dec(9)][func_dec(141)] || func_dec(142))[func_dec(16)](new RegExp(func_dec(143), func_dec(15)), func_dec(15))[func_dec(122)]();
    if (var_cn[func_dec(79)] === func_dec(144)) {
      const var_cp = await fetchT(func_dec(145) + var_co + func_dec(146));
      const var_cq = var_cp[func_dec(147)] ? (await var_cp[func_dec(148)]())[func_dec(122)]() : null;
      return new Response(JSON[func_dec(23)]({
        [func_dec(24)]: true,
        [func_dec(149)]: CURRENT_VERSION,
        [func_dec(150)]: var_cq,
        [func_dec(151)]: var_cq ? func_k(CURRENT_VERSION, var_cq) < 0 : false
      }), {
        [func_dec(13)]: {
          [func_dec(65)]: func_dec(66)
        }
      });
    }
    return new Response(JSON[func_dec(23)]({
      [func_dec(24)]: false,
      [func_dec(25)]: func_dec(152)
    }), {
      [func_dec(27)]: 400
    });
  } catch (var_cr) {
    return new Response(JSON[func_dec(23)]({
      [func_dec(24)]: false,
      [func_dec(25)]: var_cr[func_dec(75)]
    }), {
      [func_dec(27)]: 500
    });
  }
}
export { func_m as handleUpdateApi };
async function func_n(var_cs, var_ct, var_cu) {
  try {
    const var_cv = var_cs[func_dec(77)];
    if (var_cv === func_dec(80)) {
      const var_cw = (state[func_dec(9)][func_dec(8)] || [])[func_dec(56)](var_cx => ({
        [func_dec(58)]: var_cx[func_dec(58)],
        [func_dec(57)]: var_cx[func_dec(57)],
        [func_dec(153)]: var_cx[func_dec(12)][func_dec(154)](0, 8) + func_dec(155) + var_cx[func_dec(12)][func_dec(154)](-4)
      }));
      return new Response(JSON[func_dec(23)]({
        [func_dec(24)]: true,
        [func_dec(156)]: var_cw
      }), {
        [func_dec(13)]: {
          [func_dec(65)]: func_dec(66)
        }
      });
    }
    if (var_cv === func_dec(90)) {
      const var_cy = await var_cs[func_dec(22)]();
      if (var_cy[func_dec(79)] === func_dec(157)) {
        const var_cz = generateApiKey(var_cy[func_dec(57)]);
        if (!state[func_dec(9)][func_dec(8)]) state[func_dec(9)][func_dec(8)] = [];
        state[func_dec(9)][func_dec(8)][func_dec(99)](var_cz);
        await cachedD1Put(var_ct, func_dec(72), JSON[func_dec(23)](state[func_dec(9)]));
        return new Response(JSON[func_dec(23)]({
          [func_dec(24)]: true,
          [func_dec(12)]: var_cz
        }), {
          [func_dec(27)]: 201
        });
      }
    }
    return new Response(JSON[func_dec(23)]({
      [func_dec(24)]: false,
      [func_dec(25)]: func_dec(158)
    }), {
      [func_dec(27)]: 400
    });
  } catch (var_da) {
    return new Response(JSON[func_dec(23)]({
      [func_dec(24)]: false,
      [func_dec(25)]: var_da[func_dec(75)]
    }), {
      [func_dec(27)]: 500
    });
  }
}
export { func_n as handleApiKeys };
async function func_o(var_db, var_dc, var_dd) {
  try {
    const var_de = await var_db[func_dec(22)]();
    return new Response(JSON[func_dec(23)]({
      [func_dec(24)]: true,
      [func_dec(159)]: var_de
    }), {
      [func_dec(27)]: 200
    });
  } catch (var_df) {
    return new Response(JSON[func_dec(23)]({
      [func_dec(24)]: false
    }), {
      [func_dec(27)]: 400
    });
  }
}
export { func_o as handleSyncPanel };