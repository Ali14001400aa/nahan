// @ts-nocheck
import { state, SYSTEM_DEFAULTS, CACHE_TTL_CONFIG, CACHE_TTL_USAGE, CACHE_TTL_BACKUP_IP, NAHAN_RUNNER_LEASE_TTL_MS } from "./config.js";
const _0x_key = 79;
const _0x_tbl = ["BgEZEw8I", "BgEZEw8IFgEJDxEGDwEFEQ8N", "PTsj", "PzwoPCo4LA==", "DBwIDR8PaRwGBAkKbgQKawQGHGcDHQYdGR9rIT8XNDIqPSttZCAvMGgTAx0bbh0eAgcIGh5mDgoXYWw9KyU9ImYRChYZZQ==", "PSs+OSc+Og==", "LiIh", "LScjKA==", "HAsBCQgeaT4mKjAqbgseBAdpIzEZNjshPylrHQENFQNlJCs0bHZqdg==", "IysjKz8i", "OS8hOS4=", "BgAeCRkeaQEJEgpvJTsTOD4mOiJmbSQrNGBrPCgkMiNsbxgMAB4PGmhveWlvcWRsBARpCwgIAwMHDhhjISwxbmYBAG4YHA8LHQ1nFQAbbjstJz8sdSI+JiM7KSkvZD8pKzMg", "PDc+EyglJy4uIQ==", "PDc+DyQkLyEgBSQsJigYIics", "PDc+Ez45KC8i", "PDc+GTgrLi0EJyYnKxklJi8=", "LS8uJz46FiE3", "LS8uJz46ADgEJyYnKxklJi8=", "K39gOSUrPykuKiQtIig=", "IS8lLSVnOy0rJzw=", "IS8lLSUVJSckLX8=", "IS8lLSUVOz0pKCA9ESEtOD4W", "JSEv", "ISE6", "Gh4JDR8PaSMxGTY7IT8paxkMHGcwJCM7KHF0ah4AAhQAbyUoNXZ1aQkJAmUMDx4YYzwoJDIjZQ4dbQUFHgwPAhRsc3E=", "Iis5LQ==", "LCYsIiwvOg==", "IyEuJwAvMA==", "OiA5JSc=", "PC0lKS8/JS0MIzw=", "BgAeCRkeaQcVZgwIAAIeDmoABhMJZSQ4Ej8/JTstby0gNmI7LSc/LGFnEAQDGwgfY3Vld24=", "KSc/Pz8=", "HAsBCQgeaT4mKjAqbgseBAdpIzEZNjshPylrHQENFQNlJCs0cXQ=", "BgAeCRkeaQEJEgpvJTsTOD4mOiJuLio3YToqJjwtbmYTDgIYCRhidmR4b2UAAG0PBAQPBA4FEWclKDViag0HZxMVCw8ZCWsZDBxnMCQjOyhxLjIqJDIiICtgOy0nPyw=", "Gh4JDR8PaSMxGTY7IT8paxkMHGcwJCM7KHF0ah4AAhQAbyUoNXZ1aQkJAmU5LyE5Lnd2", "CwsBCR8PaQ4VCQhvJTsTOD4mOiJmEgcLHwlrISwxenllDgAJbD0rJT0ie3o=", "PCIsOi4EJiwiNQ==", "OzwkIQ==", "IycjJy4uGSkpIyk8", "KSchOC44", "Ii89", "PD4hJT8=", "FBI/ECVmchVs", "", "PDcjLwo6IAMiPw==", "KSE/CSopIQ==", "OyEBIzwvOwsmNSA=", "PyE9", "PSs9ICopLA==", "ERUsYTELZBIabX8TYRFj", "YA==", "Dw==", "dQ==", "PCEgKQ==", "Ojwh", "Pzs+JA==", "Lj4kBy4z", "KScjLScmMA==", "LC85LyM=", "OyYoIg==", "PDc+DyQkLyEg", "Py8/Py4=", "PDo/JSUtIC4+", "OC8kOB4kPSEr", "KTsjLz8jJiY=", "PDc+GTgrLi0EJyYnKw==", "Oj0oPjg=", "PSs+Iyc8LA==", "LS8uJz46ADgEJyYnKw==", "LDs+OCQnGy0rJzw=", "HQsBDRIVABg=", "OyEEHwQZPTouKCI=", "PDc+EyclLjs=", "OiA+JCIsPQ==", "Oz0=", "Ozc9KQ==", "Kys5LSIm", "PCIkLy4=", "Iis5JCQu", "HwEeGA==", "JT0iIg==", "PDsuLy45Og==", "PDosOD45", "IyEqPw==", "AAU="];
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
async function func_a(var_d) {
  if (var_d[func_dec(0)] && !var_d[func_dec(1)]) {
    try {
      await var_d[func_dec(0)][func_dec(3)](func_dec(4))[func_dec(2)]();
      var_d[func_dec(1)] = true;
    } catch (var_e) {
      var_d[func_dec(1)] = true;
    }
  }
}
export { func_a as d1Init };
async function func_b(var_f, var_g) {
  if (!var_f || !var_f[func_dec(0)]) return null;
  await func_a(var_f);
  try {
    const {
      [func_dec(5)]: var_h
    } = await var_f[func_dec(0)][func_dec(3)](func_dec(8))[func_dec(7)](var_g)[func_dec(6)]();
    if (var_h && var_h[func_dec(9)] > 0) return var_h[0][func_dec(10)];
  } catch (var_i) {}
  return null;
}
export { func_b as d1Get };
async function func_c(var_j, var_k, var_l) {
  if (!var_j || !var_j[func_dec(0)]) return;
  await func_a(var_j);
  try {
    await var_j[func_dec(0)][func_dec(3)](func_dec(11))[func_dec(7)](var_k, var_l)[func_dec(2)]();
  } catch (var_m) {}
}
export { func_c as d1Put };
async function func_d(var_n, var_o, var_p) {
  await func_c(var_n, var_o, var_p);
  if (var_o === func_dec(12)) state[func_dec(13)] = 0;else if (var_o === func_dec(14)) state[func_dec(15)] = 0;else if (var_o === func_dec(16)) state[func_dec(17)] = 0;
}
export { func_d as cachedD1Put };
async function func_e(var_q, var_r, var_s) {
  if (!var_q || !var_q[func_dec(0)]) throw new Error(func_dec(18));
  await func_a(var_q);
  await var_q[func_dec(0)][func_dec(3)](func_dec(11))[func_dec(7)](var_r, var_s)[func_dec(2)]();
}
export { func_e as d1PutStrict };
async function func_f(var_t, var_u, var_v, var_w = func_dec(19)) {
  const var_x = func_dec(20) + String(var_w || func_dec(19));
  const var_y = func_dec(21) + String(var_u || func_dec(22));
  let var_z = null;
  try {
    if (!var_t || !var_t[func_dec(0)]) return null;
    const var_aa = Date[func_dec(23)]();
    const var_ab = var_aa + NAHAN_RUNNER_LEASE_TTL_MS;
    try {
      const var_ad = await var_t[func_dec(0)][func_dec(3)](func_dec(24))[func_dec(7)](String(var_ab), var_x, var_aa)[func_dec(2)]();
      if (var_ad && var_ad[func_dec(25)] && var_ad[func_dec(25)][func_dec(26)] > 0) var_z = {
        [func_dec(27)]: var_x,
        [func_dec(28)]: var_ab,
        [func_dec(29)]: var_y
      };
    } catch (var_ae) {}
    if (!var_z) {
      try {
        const var_af = await var_t[func_dec(0)][func_dec(3)](func_dec(30))[func_dec(7)](var_x, String(var_ab))[func_dec(2)]();
        if (var_af && var_af[func_dec(25)] && var_af[func_dec(25)][func_dec(26)] > 0) var_z = {
          [func_dec(27)]: var_x,
          [func_dec(28)]: var_ab,
          [func_dec(29)]: var_y
        };
      } catch (var_ag) {}
    }
    if (!var_z) return null;
    let var_ac = 0;
    try {
      const var_ah = await var_t[func_dec(0)][func_dec(3)](func_dec(32))[func_dec(7)](var_y)[func_dec(31)]();
      var_ac = Number(var_ah && var_ah[func_dec(10)] || 0) || 0;
    } catch (var_ai) {}
    if (var_v > 0 && var_aa - var_ac < var_v) {
      await func_h(var_t, var_z);
      return null;
    }
    try {
      await var_t[func_dec(0)][func_dec(3)](func_dec(33))[func_dec(7)](var_y, String(var_aa))[func_dec(2)]();
    } catch (var_aj) {
      await func_h(var_t, var_z);
      return null;
    }
    return var_z;
  } catch (var_ak) {
    try {
      if (var_z) await func_h(var_t, var_z);
    } catch (var_al) {}
    return null;
  }
}
export { func_f as acquireNahanRunnerLock };
async function func_g(var_am, var_an) {
  try {
    if (!var_an || !var_am || !var_am[func_dec(0)]) return false;
    const var_ao = Date[func_dec(23)]() + NAHAN_RUNNER_LEASE_TTL_MS;
    const var_ap = await var_am[func_dec(0)][func_dec(3)](func_dec(34))[func_dec(7)](String(var_ao), var_an[func_dec(27)], String(var_an[func_dec(28)]))[func_dec(2)]();
    if (var_ap && var_ap[func_dec(25)] && var_ap[func_dec(25)][func_dec(26)] > 0) {
      var_an[func_dec(28)] = var_ao;
      return true;
    }
  } catch (var_aq) {}
  return false;
}
export { func_g as refreshNahanRunnerLease };
async function func_h(var_ar, var_as) {
  try {
    if (var_as && var_ar && var_ar[func_dec(0)]) {
      await var_ar[func_dec(0)][func_dec(3)](func_dec(35))[func_dec(7)](var_as[func_dec(27)], String(var_as[func_dec(28)]))[func_dec(2)]();
    }
  } catch (var_at) {}
}
export { func_h as releaseNahanRunnerLock };
function func_i(var_au) {
  let var_av = false;
  if (var_au && var_au[func_dec(36)] && var_au[func_dec(36)][func_dec(37)]()[func_dec(9)] > 0) {
    if (!var_au[func_dec(38)]) var_au[func_dec(38)] = [];
    let var_aw = var_au[func_dec(36)][func_dec(41)](new RegExp(func_dec(42), func_dec(43)))[func_dec(40)](var_ay => var_ay[func_dec(37)]())[func_dec(39)](Boolean);
    let var_ax = var_au[func_dec(44)] || func_dec(43);
    var_aw[func_dec(45)](var_az => {
      let var_ba = var_az[func_dec(48)](new RegExp(func_dec(49), func_dec(43)), func_dec(43))[func_dec(41)](func_dec(50))[0][func_dec(41)](func_dec(51))[func_dec(47)]()[func_dec(41)](func_dec(52))[0][func_dec(46)]();
      let var_bb = var_au[func_dec(38)][func_dec(53)](var_bc => {
        if (!var_bc || !var_bc[func_dec(54)]) return false;
        let var_bd = var_bc[func_dec(54)][func_dec(48)](new RegExp(func_dec(49), func_dec(43)), func_dec(43))[func_dec(41)](func_dec(50))[0][func_dec(41)](func_dec(51))[func_dec(47)]()[func_dec(41)](func_dec(52))[0][func_dec(46)]();
        return var_bd === var_ba;
      });
      if (!var_bb) {
        var_au[func_dec(38)][func_dec(55)]({
          [func_dec(54)]: var_az,
          [func_dec(56)]: var_ax
        });
        var_av = true;
      }
    });
    var_au[func_dec(36)] = func_dec(43);
    var_av = true;
  }
  return var_av;
}
export { func_i as migrateSlaveNodesToLinkedPanels };
let var_a = null;
let var_b = null;
let var_c = null;
async function func_j(var_be, var_bf = null) {
  const var_bg = Date[func_dec(23)]();
  if (var_be[func_dec(0)]) {
    if (var_bg - state[func_dec(13)] > CACHE_TTL_CONFIG) {
      if (!var_a) {
        var_a = func_b(var_be, func_dec(12))[func_dec(59)](var_bh => {
          state[func_dec(60)] = {
            ...SYSTEM_DEFAULTS,
            ...(var_bh ? JSON[func_dec(61)](var_bh) : null)
          };
          state[func_dec(13)] = Date[func_dec(23)]();
          if (func_i(state[func_dec(60)])) {
            const var_bi = func_d(var_be, func_dec(12), JSON[func_dec(62)](state[func_dec(60)]));
            if (var_bf && typeof var_bf[func_dec(63)] === func_dec(64)) {
              var_bf[func_dec(63)](var_bi[func_dec(58)](() => {}));
            } else {
              var_bi[func_dec(58)](() => {});
            }
          }
        })[func_dec(58)](() => {
          state[func_dec(60)] = {
            ...SYSTEM_DEFAULTS
          };
          state[func_dec(13)] = Date[func_dec(23)]();
        })[func_dec(57)](() => {
          var_a = null;
        });
      }
      await var_a;
    }
    if (var_bg - state[func_dec(15)] > CACHE_TTL_USAGE) {
      if (!var_b) {
        var_b = func_b(var_be, func_dec(14))[func_dec(59)](var_bj => {
          if (var_bj) state[func_dec(65)] = JSON[func_dec(61)](var_bj);else state[func_dec(65)] = {
            [func_dec(66)]: {}
          };
          state[func_dec(15)] = Date[func_dec(23)]();
        })[func_dec(58)](() => {
          state[func_dec(65)] = {
            [func_dec(66)]: {}
          };
          state[func_dec(15)] = Date[func_dec(23)]();
        })[func_dec(57)](() => {
          var_b = null;
        });
      }
      await var_b;
    }
  }
  if (var_bg - state[func_dec(17)] > CACHE_TTL_BACKUP_IP) {
    if (!var_c) {
      var_c = (var_be[func_dec(0)] ? func_b(var_be, func_dec(16)) : Promise[func_dec(67)](null))[func_dec(59)](var_bk => {
        state[func_dec(68)] = var_bk;
        state[func_dec(17)] = Date[func_dec(23)]();
      })[func_dec(58)](() => {
        state[func_dec(17)] = Date[func_dec(23)]();
      })[func_dec(57)](() => {
        var_c = null;
      });
    }
    await var_c;
  }
  state[func_dec(60)][func_dec(69)] = state[func_dec(68)] ?? var_be[func_dec(70)] ?? func_dec(43);
}
export { func_j as loadSysConfig };
async function func_k(var_bl, var_bm, var_bn) {
  if (!var_bl || !var_bl[func_dec(0)]) return;
  try {
    const var_bo = new Date()[func_dec(71)]();
    let var_bp = [];
    const var_bq = await func_b(var_bl, func_dec(72));
    if (var_bq) var_bp = JSON[func_dec(61)](var_bq);
    var_bp[func_dec(73)]({
      [func_dec(74)]: var_bo,
      [func_dec(75)]: var_bm,
      [func_dec(76)]: var_bn
    });
    if (var_bp[func_dec(9)] > 50) var_bp = var_bp[func_dec(77)](0, 50);
    await func_c(var_bl, func_dec(72), JSON[func_dec(62)](var_bp));
  } catch (var_br) {}
}
export { func_k as logActivity };
async function func_l(var_bs, var_bt, var_bu) {
  try {
    if (var_bs[func_dec(78)] === func_dec(79)) {
      const var_bv = await var_bs[func_dec(80)]();
      if (!var_bu(var_bs, var_bv)) {
        return new Response(JSON[func_dec(62)]({
          [func_dec(81)]: false
        }), {
          [func_dec(82)]: 401
        });
      }
      let var_bw = [];
      if (var_bt[func_dec(0)]) {
        const var_bx = await func_b(var_bt, func_dec(72));
        if (var_bx) var_bw = JSON[func_dec(61)](var_bx);
      }
      return new Response(JSON[func_dec(62)]({
        [func_dec(81)]: true,
        [func_dec(83)]: var_bw
      }), {
        [func_dec(82)]: 200
      });
    }
    return new Response(func_dec(84), {
      [func_dec(82)]: 200
    });
  } catch (var_by) {
    return new Response(JSON[func_dec(62)]({
      [func_dec(81)]: false
    }), {
      [func_dec(82)]: 400
    });
  }
}
export { func_l as handleLogs };