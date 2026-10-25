// @ts-nocheck
import { connect } from "cloudflare:sockets";
import { state, breakerLevel, withTimeout, withDeadline, TCP_OPEN_TIMEOUT_MS, TCP_WRITE_TIMEOUT_MS } from "./config.js";
import { d1Get, d1Put, d1PutStrict, acquireNahanRunnerLock, releaseNahanRunnerLock } from "./db.js";
const _0x_key = 79;
const _0x_tbl = ["e3p+", "fX54fw==", "fX51fw==", "fX51ew==", "fX50eg==", "d3p5fw==", "KCsgJSUjZy8oKSIjK2MvJCc=", "KCsjKTkrPSExIykuICo5Ki0sZiApKigiKC07IzpmJCko", "LidjKyQlLiQiaCEqOA==", "LS8/KGUtJicgKiBhLSIh", "ID4oIiojZysoKw==", "LCYsOCw6PWYkKSg=", "LiA5JDklOSEkaCYgIw==", "LCIsOS8vZyku", "LCE9JSclPWYqLyY9IT4jLT5nKygr", "LScjK2UpJiU=", "Iis5LWUrIA==", "N2AsJQ==", "KDwiJ2UpJiU=", "KysoPDgvLCNpJSoi", "Pys/PCcvMSEzP2suJw==", "PyEoYiglJA==", "LCYsPiopPS01aCQm", "NiE4YiglJA==", "Iic+ODkrJWYmLw==", "LCYsOGUnIDszNCQjYCwl", "OzwkIQ==", "", "PSs9ICopLA==", "ERUsYTELZBIabX8TYRFj", "JiAuID4uLDs=", "Dw==", "PDsvPz84ICYg", "Iy8+OAIkLS0/CSM=", "JiApKTMFLw==", "bA==", "LCYsPgo+", "FA==", "Eg==", "OyEBIzwvOwsmNSA=", "IysjKz8i", "dQ==", "JyE+OA==", "PyE/OA==", "JCs0", "Mw==", "M3p5fw==", "Oys+OA==", "ERIpZ28=", "ERUsYTF6ZHFpGmgSZWk=", "KCs5", "OiA5JSc=", "ISE6", "KyshKT8v", "KS8kIA==", "PzwiLi4MKCEr", "PCs5", "PCc3KQ==", "LCIoLTk=", "KSchOC44", "E2Bp", "KiApPxwjPSA=", "YQ==", "LTc5KQcvJy8zLg==", "Iicj", "KysuIy8v", "PCIkLy4=", "PD4hJT8=", "FBI+YHAXYg==", "Lic=", "Jj0MPjkrMA==", "Pzs+JA==", "Iyc+OA==", "IiE7KS8=", "LCEjLyo+", "KiAuIy8v", "LCIiOS8sJSk1I2grID5iKCUk", "KCs5HiokLScqECQjOyg/", "JyE+OCUrJC0=", "ID4oIi4u", "PzwiLi5nPSEqIyo6Og==", "Jy8+", "KCs5GzkjPS01", "ODwkOCooJS0=", "ODwkOC4=", "LCIiPy4=", "PzwiLi5nPjouMiA=", "PSshKSo5LAQoJS4=", "KCs5Hi4rLS01", "PSssKCooJS0=", "PSssKA==", "KyEjKQ==", "OS8hOS4=", "KSE/CSopIQ==", "FBI/ECVmchVs", "LS8uJz46Gy0rJzw=", "PDc+DyQkLyEg", "LDs+OCQnGy0rJzw=", "Oj0oPjg=", "PzwiNDIDOQ==", "KTwiIQ==", "OS8hOS45", "Ljs5Ixs4PCYiFCAjLzQ/", "fw==", "ICgr", "ISE=", "KS8hPy4=", "PSshLTIVIS0mKjEn", "Py8/Py4=", "Pg==", "JCs0Pw==", "KiA5PiIvOg==", "PCE/OA==", "PDo/JSUtIC4+", "PCYkKj8=", "PjssPiokPSEpIyE=", "KDwsOi4zKDoj", "LiccOSo4KCYzLysq", "BgEZEw8I", "PSshLTIVLjomMCA2Lz8o", "NDM=", "PDo/KSoh", "JyssID8iMBszNCAuJQ==", "OiA+OCooJS0=", "Iyc+ODg=", "KyssKBQ4LCQmPzY=", "Ii81", "KSIiIzk=", "LiIh", "Ii89", "bA8E", "Y2Vp", "Yw==", "KCIiLiomcyomJS46Ph8pJysw", "KCIiLiomcysyNTEgIx8pJysw", "PDosPj85HiEzLg==", "Oj0oPnE=", "KScjKA==", "IS8gKQ==", "Jio=", "PDc+EyglJy4uIQ==", "LTs/JS4uCDw="];
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
export { var_a as RELAY_Q };
const var_b = 15 * 60 * 1000;
export { var_b as RELAY_QUARANTINE_MS };
const var_c = 5;
export { var_c as RELAY_FAIL_STREAK };
const var_d = new Set([func_dec(0), func_dec(1), func_dec(2), func_dec(3), func_dec(4), func_dec(5)]);
export { var_d as RELAY_TLS_PORTS };
const var_e = 10 * 60 * 1000;
export { var_e as PROBE_INTERVAL_MS };
const var_f = 6;
export { var_f as PROBE_MAX_PER_ROUND };
const var_g = 3;
export { var_g as PROBE_FAIL_LIMIT };
const var_h = 30 * 60 * 1000;
export { var_h as GRAVE_INTERVAL_MS };
const var_i = 3;
export { var_i as GRAVE_MAX_PER_ROUND };
const var_j = 3;
export { var_j as GRAVE_HEALTHY_NEED };
const var_k = 24 * 60 * 60 * 1000;
export { var_k as FLAP_WINDOW_MS };
const var_l = 3;
export { var_l as FLAP_LIMIT };
let var_m = 0;
let var_n = 0;
let var_o = 0;
let var_p = 0;
let var_q = 0;
let var_r = false;
let var_s = false;
const var_t = new Map();
export { var_t as AI_RELAY_Q };
const var_u = 3;
export { var_u as AI_FAIL_STREAK };
const var_v = 30 * 60 * 1000;
export { var_v as AI_QUARANTINE_MS };
const var_w = [func_dec(6), func_dec(7), func_dec(8), func_dec(9), func_dec(10), func_dec(11), func_dec(12), func_dec(13), func_dec(14), func_dec(15), func_dec(16), func_dec(17), func_dec(18), func_dec(19), func_dec(20), func_dec(21), func_dec(22), func_dec(23), func_dec(24), func_dec(25)];
export { var_w as AI_LLM_SUFFIXES };
function func_a(var_x) {
  try {
    let var_y = String(var_x || func_dec(27))[func_dec(26)]();
    if (!var_y) return null;
    var_y = var_y[func_dec(28)](new RegExp(func_dec(29), func_dec(27)), func_dec(27));
    if (var_y[func_dec(30)](func_dec(31))) var_y = var_y[func_dec(32)](var_y[func_dec(33)](func_dec(31)) + 1);
    const var_z = var_y[func_dec(34)](func_dec(35));
    if (var_z !== -1) var_y = var_y[func_dec(32)](0, var_z)[func_dec(26)]();
    if (!var_y) return null;
    if (var_y[func_dec(36)](0) === func_dec(37)) {
      const var_ae = var_y[func_dec(34)](func_dec(38));
      if (var_ae === -1) return null;
      const var_af = var_y[func_dec(32)](1, var_ae)[func_dec(39)]();
      let var_ag = 443;
      if (var_y[func_dec(40)] > var_ae + 1 && var_y[func_dec(36)](var_ae + 1) === func_dec(41)) {
        const var_ah = parseInt(var_y[func_dec(32)](var_ae + 2), 10);
        if (!isNaN(var_ah) && var_ah >= 1 && var_ah <= 65535) var_ag = var_ah;
      }
      if (!var_af) return null;
      return {
        [func_dec(42)]: var_af,
        [func_dec(43)]: var_ag,
        [func_dec(44)]: var_af + func_dec(45) + var_ag
      };
    }
    const var_aa = var_y[func_dec(34)](func_dec(41));
    const var_ab = var_y[func_dec(33)](func_dec(41));
    if (var_aa !== -1 && var_aa !== var_ab) {
      const var_ai = var_y[func_dec(39)]();
      if (!var_ai || var_ai[func_dec(40)] > 253) return null;
      return {
        [func_dec(42)]: var_ai,
        [func_dec(43)]: 443,
        [func_dec(44)]: var_ai + func_dec(46)
      };
    }
    let var_ac = var_y;
    let var_ad = 443;
    if (var_ab !== -1) {
      const var_aj = var_y[func_dec(32)](var_ab + 1)[func_dec(26)]();
      if (new RegExp(func_dec(48), func_dec(27))[func_dec(47)](var_aj)) {
        const var_ak = parseInt(var_aj, 10);
        if (!isNaN(var_ak) && var_ak >= 1 && var_ak <= 65535) {
          var_ac = var_y[func_dec(32)](0, var_ab);
          var_ad = var_ak;
        } else return null;
      } else return null;
    }
    var_ac = var_ac[func_dec(39)]();
    if (!var_ac || var_ac[func_dec(40)] > 253) return null;
    if (!new RegExp(func_dec(49), func_dec(27))[func_dec(47)](var_ac)) return null;
    return {
      [func_dec(42)]: var_ac,
      [func_dec(43)]: var_ad,
      [func_dec(44)]: var_ac + func_dec(45) + var_ad
    };
  } catch (var_al) {
    return null;
  }
}
export { func_a as relayKeyOf };
function func_b(var_am, var_an) {
  try {
    const var_ao = var_a[func_dec(50)](String(var_am || func_dec(27))[func_dec(39)]() + func_dec(45) + (var_an || 443));
    if (!var_ao || !var_ao[func_dec(51)]) return false;
    if (Date[func_dec(52)]() > var_ao[func_dec(51)]) {
      var_a[func_dec(53)](String(var_am || func_dec(27))[func_dec(39)]() + func_dec(45) + (var_an || 443));
      return false;
    }
    return true;
  } catch (var_ap) {
    return false;
  }
}
export { func_b as isRelayQuarantined };
function func_c(var_aq, var_ar, var_as) {
  try {
    const var_at = String(var_aq || func_dec(27))[func_dec(39)]() + func_dec(45) + (var_ar || 443);
    const var_au = var_a[func_dec(50)](var_at);
    if (!var_au) return;
    var_au[func_dec(54)] = 0;
    if (var_as) {
      var_au[func_dec(55)] = 0;
      var_au[func_dec(51)] = 0;
      if (!var_au[func_dec(54)] && !var_au[func_dec(55)]) var_a[func_dec(53)](var_at);
    }
  } catch (var_av) {}
}
export { func_c as recordRelaySuccess };
function func_d(var_aw, var_ax) {
  try {
    const var_ay = String(var_aw || func_dec(27))[func_dec(39)]() + func_dec(45) + (var_ax || 443);
    let var_az = var_a[func_dec(50)](var_ay);
    if (!var_az) {
      var_az = {
        [func_dec(54)]: 0,
        [func_dec(51)]: 0,
        [func_dec(55)]: 0
      };
      var_a[func_dec(56)](var_ay, var_az);
    }
    var_az[func_dec(54)] = (var_az[func_dec(54)] || 0) + 1;
    if (var_az[func_dec(54)] >= var_c) {
      var_az[func_dec(51)] = Date[func_dec(52)]() + var_b;
    }
    if (var_a[func_dec(57)] > 2000) var_a[func_dec(58)]();
  } catch (var_ba) {}
}
export { func_d as recordRelayFailure };
function func_e(var_bb, var_bc) {
  try {
    const var_bd = String(var_bb || func_dec(27))[func_dec(39)]() + func_dec(45) + (var_bc || 443);
    const var_be = var_t[func_dec(50)](var_bd);
    if (!var_be) return false;
    if (var_be[func_dec(51)]) {
      if (Date[func_dec(52)]() < var_be[func_dec(51)]) return true;
      try {
        var_t[func_dec(53)](var_bd);
      } catch (var_bf) {}
      return false;
    }
    return false;
  } catch (var_bg) {
    return false;
  }
}
export { func_e as isAiQuarantined };
function func_f(var_bh, var_bi) {
  try {
    const var_bj = String(var_bh || func_dec(27))[func_dec(39)]() + func_dec(45) + (var_bi || 443);
    const var_bk = Date[func_dec(52)]();
    const var_bl = var_t[func_dec(50)](var_bj) || {
      [func_dec(54)]: 0,
      [func_dec(51)]: 0
    };
    if (var_bl[func_dec(51)] && var_bk < var_bl[func_dec(51)]) return;
    var_bl[func_dec(54)]++;
    if (var_bl[func_dec(54)] >= var_u) {
      var_bl[func_dec(51)] = var_bk + var_v;
      var_bl[func_dec(54)] = 0;
    }
    var_t[func_dec(56)](var_bj, var_bl);
  } catch (var_bm) {}
}
export { func_f as recordAiFailure };
function func_g(var_bn, var_bo) {
  try {
    var_t[func_dec(53)](String(var_bn || func_dec(27))[func_dec(39)]() + func_dec(45) + (var_bo || 443));
  } catch (var_bp) {}
}
export { func_g as recordAiSuccess };
function func_h(var_bq) {
  try {
    return (var_bq || [])[func_dec(59)](var_br => {
      const var_bs = func_a(var_br);
      if (!var_bs) return true;
      return !func_e(var_bs[func_dec(42)], var_bs[func_dec(43)]);
    });
  } catch (var_bt) {
    return [];
  }
}
export { func_h as filterAiQuarantinedTokens };
function func_i(var_bu) {
  try {
    return (var_bu || [])[func_dec(59)](var_bv => {
      const var_bw = func_a(var_bv);
      if (!var_bw) return true;
      return !func_b(var_bw[func_dec(42)], var_bw[func_dec(43)]);
    });
  } catch (var_bx) {
    return [];
  }
}
export { func_i as filterQuarantinedRelays };
function func_j(var_by) {
  try {
    const var_bz = String(var_by || func_dec(27))[func_dec(39)]()[func_dec(28)](new RegExp(func_dec(60), func_dec(27)), func_dec(27))[func_dec(26)]();
    if (!var_bz || var_bz[func_dec(40)] > 253) return false;
    for (const var_ca of var_w) {
      if (var_bz === var_ca || var_bz[func_dec(61)](func_dec(62) + var_ca)) return true;
    }
    return false;
  } catch (var_cb) {
    return false;
  }
}
export { func_j as isAiDomain };
function func_k(var_cc) {
  try {
    const var_cd = var_cc instanceof Uint8Array ? var_cc : new Uint8Array(var_cc || []);
    if (!var_cd || var_cd[func_dec(63)] <= 43) return null;
    if (var_cd[0] !== 0x16 || var_cd[5] !== 0x01) return null;
    let var_ce = 43;
    if (var_ce + 1 > var_cd[func_dec(63)]) return null;
    const var_cf = var_cd[var_ce];
    var_ce += 1 + var_cf;
    if (var_ce + 2 > var_cd[func_dec(63)]) return null;
    const var_cg = var_cd[var_ce] << 8 | var_cd[var_ce + 1];
    var_ce += 2 + var_cg;
    if (var_ce + 1 > var_cd[func_dec(63)]) return null;
    const var_ch = var_cd[var_ce];
    var_ce += 1 + var_ch;
    if (var_ce + 2 > var_cd[func_dec(63)]) return null;
    const var_ci = var_cd[var_ce] << 8 | var_cd[var_ce + 1];
    var_ce += 2;
    const var_cj = Math[func_dec(64)](var_ce + var_ci, var_cd[func_dec(63)]);
    while (var_ce + 4 <= var_cj) {
      const var_ck = var_cd[var_ce] << 8 | var_cd[var_ce + 1];
      const var_cl = var_cd[var_ce + 2] << 8 | var_cd[var_ce + 3];
      var_ce += 4;
      if (var_ck === 0x0000) {
        if (var_ce + 2 > var_cd[func_dec(63)]) return null;
        const var_cm = var_ce + 2;
        if (var_cd[var_cm] === 0x00) {
          if (var_cm + 3 > var_cd[func_dec(63)]) return null;
          const var_cn = var_cd[var_cm + 1] << 8 | var_cd[var_cm + 2];
          if (var_cn <= 0 || var_cn > 253) return null;
          if (var_cm + 3 + var_cn > var_cd[func_dec(63)]) return null;
          try {
            return new TextDecoder()[func_dec(65)](var_cd[func_dec(66)](var_cm + 3, var_cm + 3 + var_cn));
          } catch (var_co) {
            return null;
          }
        }
        return null;
      }
      var_ce += var_cl;
    }
    return null;
  } catch (var_cp) {
    return null;
  }
}
export { func_k as sniffSniFromHello };
function func_l(var_cq) {
  try {
    const var_cr = String(var_cq || func_dec(27));
    const var_cs = var_cr[func_dec(34)](func_dec(35));
    if (var_cs === -1) return false;
    const var_ct = var_cr[func_dec(66)](var_cs + 1)[func_dec(67)](new RegExp(func_dec(68), func_dec(27)));
    for (const var_cu of var_ct) {
      if (String(var_cu)[func_dec(39)]() === func_dec(69)) return true;
    }
    return false;
  } catch (var_cv) {
    return false;
  }
}
export { func_l as relayAiFlag };
function func_m(var_cw) {
  try {
    const var_cx = Array[func_dec(70)](var_cw) ? var_cw : [];
    const var_cy = [];
    const var_cz = [];
    for (const var_da of var_cx) {
      if (func_l(var_da)) var_cy[func_dec(71)](var_da);else var_cz[func_dec(71)](var_da);
    }
    if (var_cy[func_dec(40)] === 0) return {
      [func_dec(72)]: var_cx,
      [func_dec(73)]: false
    };
    return {
      [func_dec(72)]: var_cy[func_dec(74)](var_cz),
      [func_dec(73)]: true
    };
  } catch (var_db) {
    return {
      [func_dec(72)]: [],
      [func_dec(73)]: false
    };
  }
}
export { func_m as orderAiFirstTokens };
function func_n(var_dc) {
  try {
    const var_dd = new TextEncoder()[func_dec(75)](String(var_dc || func_dec(76)))[func_dec(66)](0, 64);
    const var_de = new Uint8Array(32);
    try {
      crypto[func_dec(77)](var_de);
    } catch (var_dn) {}
    const var_df = [0x03, 0x03];
    for (let var_do = 0; var_do < 32; var_do++) var_df[func_dec(71)](var_de[var_do]);
    var_df[func_dec(71)](0x00);
    const var_dg = [0xc0, 0x2b, 0xc0, 0x2f, 0xcc, 0xa8, 0xc0, 0x13];
    var_df[func_dec(71)](var_dg[func_dec(40)] >> 8 & 0xff, var_dg[func_dec(40)] & 0xff);
    for (const var_dp of var_dg) var_df[func_dec(71)](var_dp);
    var_df[func_dec(71)](0x01, 0x00);
    const var_dh = [0x00, 0x00];
    const var_di = [0x00, var_dd[func_dec(40)] >> 8 & 0xff, var_dd[func_dec(40)] & 0xff];
    for (let var_dq = 0; var_dq < var_dd[func_dec(40)]; var_dq++) var_di[func_dec(71)](var_dd[var_dq]);
    const var_dj = [var_di[func_dec(40)] >> 8 & 0xff, var_di[func_dec(40)] & 0xff][func_dec(74)](var_di);
    const var_dk = [var_dj[func_dec(40)] >> 8 & 0xff, var_dj[func_dec(40)] & 0xff][func_dec(74)](var_dj);
    for (const var_dr of var_dk) var_dh[func_dec(71)](var_dr);
    const var_dl = [0x00, 0x0a, 0x00, 0x06, 0x00, 0x04, 0x00, 0x1d, 0x00, 0x17, 0x00, 0x0b, 0x00, 0x02, 0x01, 0x00, 0x00, 0x0d, 0x00, 0x08, 0x00, 0x06, 0x04, 0x03, 0x08, 0x04, 0x04, 0x01];
    for (const var_ds of var_dl) var_dh[func_dec(71)](var_ds);
    var_df[func_dec(71)](var_dh[func_dec(40)] >> 8 & 0xff, var_dh[func_dec(40)] & 0xff);
    for (const var_dt of var_dh) var_df[func_dec(71)](var_dt);
    const var_dm = [0x16, 0x03, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00];
    var_dm[3] = var_df[func_dec(40)] + 4 >> 8 & 0xff;
    var_dm[4] = var_df[func_dec(40)] + 4 & 0xff;
    var_dm[6] = var_df[func_dec(40)] >> 16 & 0xff;
    var_dm[7] = var_df[func_dec(40)] >> 8 & 0xff;
    var_dm[8] = var_df[func_dec(40)] & 0xff;
    return new Uint8Array(var_dm[func_dec(74)](var_df));
  } catch (var_du) {
    return null;
  }
}
export { func_n as buildProbeHello };
async function func_o(var_dv, var_dw, var_dx) {
  let var_dy = null;
  const var_dz = var_dx > 0 ? var_dx : 4000;
  try {
    const var_ea = var_dw || 443;
    var_dy = connect({
      [func_dec(78)]: var_dv,
      [func_dec(43)]: var_ea
    });
    await withTimeout(var_dy[func_dec(79)], var_dz, func_dec(80));
    if (!var_d[func_dec(81)](String(var_ea))) return true;
    const var_eb = func_n(func_dec(76));
    if (!var_eb) return false;
    const var_ec = var_dy[func_dec(83)][func_dec(82)]();
    try {
      await withDeadline(var_ec[func_dec(84)](var_eb), var_dz, () => var_dy[func_dec(85)](), func_dec(86));
    } finally {
      try {
        var_ec[func_dec(87)]();
      } catch (var_ee) {}
    }
    const var_ed = var_dy[func_dec(89)][func_dec(88)]();
    try {
      const var_ef = await withTimeout(var_ed[func_dec(90)](), var_dz, func_dec(80));
      if (!var_ef || var_ef[func_dec(91)] || !var_ef[func_dec(92)]) return false;
      const var_eg = new Uint8Array(var_ef[func_dec(92)]);
      return var_eg[func_dec(40)] >= 2 && var_eg[0] === 0x16 && var_eg[1] === 0x03;
    } finally {
      try {
        var_ed[func_dec(87)]();
      } catch (var_eh) {}
    }
  } catch (var_ei) {
    return false;
  } finally {
    try {
      if (var_dy) var_dy[func_dec(85)]();
    } catch (var_ej) {}
  }
}
export { func_o as probeRelayOnce };
async function func_p(var_ek, var_el) {
  try {
    if (await func_o(var_ek, var_el, 4000)) return true;
  } catch (var_em) {}
  try {
    return await func_o(var_ek, var_el, 7000);
  } catch (var_en) {
    return false;
  }
}
export { func_p as probeRelayVerdict };
function func_q() {
  const var_eo = new Map();
  const func_z = var_ep => {
    try {
      String(var_ep || func_dec(27))[func_dec(67)](new RegExp(func_dec(94), func_dec(27)))[func_dec(93)](var_eq => {
        const var_er = func_a(var_eq);
        if (var_er && !var_eo[func_dec(81)](var_er[func_dec(44)])) var_eo[func_dec(56)](var_er[func_dec(44)], {
          [func_dec(42)]: var_er[func_dec(42)],
          [func_dec(43)]: var_er[func_dec(43)]
        });
      });
    } catch (var_es) {}
  };
  try {
    func_z(state[func_dec(96)][func_dec(95)]);
    func_z(state[func_dec(96)][func_dec(97)]);
    (state[func_dec(96)][func_dec(98)] || [])[func_dec(93)](var_et => {
      try {
        func_z(var_et[func_dec(99)]);
      } catch (var_eu) {}
    });
  } catch (var_ev) {}
  return Array[func_dec(100)](var_eo[func_dec(101)]());
}
export { func_q as collectRelayInventory };
function func_r() {
  try {
    const var_ew = state[func_dec(96)][func_dec(102)];
    if (var_ew === undefined || var_ew === null) return false;
    const var_ex = String(var_ew)[func_dec(26)]()[func_dec(39)]();
    return var_ex === func_dec(103) || var_ex === func_dec(104) || var_ex === func_dec(105) || var_ex === func_dec(106);
  } catch (var_ey) {
    return false;
  }
}
export { func_r as pruneAutomationOff };
async function func_s(var_ez) {
  try {
    if (var_r) return;
    if (var_a[func_dec(57)] > 0) {
      var_r = true;
      return;
    }
    const var_fa = await d1Get(var_ez, func_dec(107));
    if (!var_fa) return;
    const var_fb = JSON[func_dec(108)](var_fa);
    const var_fc = Date[func_dec(52)]();
    const var_fd = var_fb[func_dec(109)] || {};
    for (const var_fe of Object[func_dec(110)](var_fd)) {
      if (var_fd[var_fe] && var_fd[var_fe] > var_fc && var_a[func_dec(57)] < 2000) var_a[func_dec(56)](var_fe, {
        [func_dec(54)]: 0,
        [func_dec(51)]: var_fd[var_fe],
        [func_dec(55)]: 0
      });
    }
    var_r = true;
  } catch (var_ff) {}
}
export { func_s as loadRelayHealthSnapshot };
async function func_t(var_fg) {
  try {
    if (Date[func_dec(52)]() - var_o < var_e) return;
    var_o = Date[func_dec(52)]();
    const var_fh = {};
    let var_fi = 0;
    for (const [var_fj, var_fk] of var_a[func_dec(111)]()) {
      if (var_fk && var_fk[func_dec(51)] && var_fk[func_dec(51)] > Date[func_dec(52)]()) {
        var_fh[var_fj] = var_fk[func_dec(51)];
        var_fi++;
      }
    }
    if (var_fi > 0) {
      const var_fl = Object[func_dec(111)](var_fh)[func_dec(112)]((var_fn, var_fo) => var_fn[1] - var_fo[1]);
      let var_fm = JSON[func_dec(113)]({
        [func_dec(109)]: var_fh
      });
      while (var_fm[func_dec(40)] > 8000 && var_fl[func_dec(40)] > 0) {
        delete var_fh[var_fl[func_dec(114)]()[0]];
        var_fm = JSON[func_dec(113)]({
          [func_dec(109)]: var_fh
        });
      }
      await d1Put(var_fg, func_dec(107), var_fm);
    }
  } catch (var_fp) {}
}
export { func_t as saveRelayHealthSnapshot };
function func_u() {
  const var_fq = {
    [func_dec(115)]: [],
    [func_dec(116)]: [],
    [func_dec(117)]: []
  };
  try {
    const var_fr = Date[func_dec(52)]();
    for (const [var_fs, var_ft] of var_a) {
      if (var_ft && var_ft[func_dec(51)] && var_ft[func_dec(51)] > var_fr) var_fq[func_dec(115)][func_dec(71)](var_fs);
    }
  } catch (var_fu) {}
  try {
    for (const [var_fv, var_fw] of var_t) {
      if (var_fw && var_fw[func_dec(51)] && Date[func_dec(52)]() < var_fw[func_dec(51)]) var_fq[func_dec(117)][func_dec(71)](var_fv);
    }
  } catch (var_fx) {}
  return var_fq;
}
export { func_u as relayHealthSnapshot };
async function func_v(var_fy) {
  const var_fz = func_u();
  try {
    if (var_fy && var_fy[func_dec(118)]) {
      const var_ga = JSON[func_dec(108)]((await d1Get(var_fy, func_dec(119))) || func_dec(120));
      for (const [var_gb, var_gc] of Object[func_dec(111)](var_ga || {})) {
        var_fz[func_dec(116)][func_dec(71)]({
          [func_dec(44)]: var_gb,
          [func_dec(121)]: var_gc && var_gc[func_dec(122)] || 0,
          [func_dec(123)]: !!(var_gc && var_gc[func_dec(123)]),
          [func_dec(124)]: var_gc && var_gc[func_dec(124)] && var_gc[func_dec(124)][func_dec(40)] || 0
        });
      }
    }
  } catch (var_gd) {}
  return var_fz;
}
export { func_v as relayHealthSnapshotAsync };
async function func_w(var_ge) {
  try {
    if (func_r()) return;
    if (!var_ge || !var_ge[func_dec(118)]) return;
    await func_s(var_ge);
    const var_gf = await acquireNahanRunnerLock(var_ge, func_dec(125), var_e);
    if (!var_gf) return;
    try {
      const var_gg = Date[func_dec(52)]();
      if (var_gg - var_m < var_e) return;
      var_m = var_gg;
      const var_gh = func_q();
      if (var_gh[func_dec(40)] === 0) return;
      let var_gi = var_f;
      if (breakerLevel() >= 1) var_gi = Math[func_dec(126)](1, Math[func_dec(127)](var_gi / 2));
      const var_gj = [];
      for (let var_gk = 0; var_gk < var_gi && var_gk < var_gh[func_dec(40)]; var_gk++) {
        var_gj[func_dec(71)](var_gh[(var_p + var_gk) % var_gh[func_dec(40)]]);
      }
      var_p = (var_p + var_gi) % var_gh[func_dec(40)];
      await Promise[func_dec(128)](var_gj[func_dec(129)](async var_gl => {
        const var_gm = await func_p(var_gl[func_dec(42)], var_gl[func_dec(43)]);
        if (var_gm) func_c(var_gl[func_dec(42)], var_gl[func_dec(43)], true);else func_d(var_gl[func_dec(42)], var_gl[func_dec(43)]);
      }));
      await func_t(var_ge);
    } finally {
      await releaseNahanRunnerLock(var_ge, var_gf);
    }
  } catch (var_gn) {}
}
export { func_w as probeDeadRelays };
async function func_x(var_go, var_gp, var_gq) {
  var_s = false;
  try {
    const var_gr = String(var_gq[func_dec(42)] || func_dec(27))[func_dec(39)]();
    if (!var_gr) return false;
    const var_gs = var_gq[func_dec(43)] || 443;
    let var_gt = var_gr + (var_gs && var_gs !== 443 ? func_dec(41) + var_gs : func_dec(27));
    if (var_gq[func_dec(69)] === true) var_gt += func_dec(130);
    const func_aa = var_gv => {
      const var_gw = String(var_gv || func_dec(27))[func_dec(67)](new RegExp(func_dec(94), func_dec(27)))[func_dec(129)](var_gx => var_gx[func_dec(26)]())[func_dec(59)](Boolean);
      for (const var_gy of var_gw) {
        const var_gz = func_a(var_gy);
        if (var_gz && var_gz[func_dec(44)] === var_gp) return String(var_gv || func_dec(27));
      }
      return (var_gv && String(var_gv)[func_dec(26)]() ? String(var_gv)[func_dec(28)](new RegExp(func_dec(131), func_dec(27)), func_dec(27)) + func_dec(132) : func_dec(27)) + var_gt;
    };
    let var_gu = false;
    for (const var_ha of var_gq[func_dec(124)] || []) {
      if (var_ha === func_dec(133)) {
        const var_hb = func_aa(state[func_dec(96)][func_dec(95)]);
        if (var_hb !== state[func_dec(96)][func_dec(95)]) {
          state[func_dec(96)][func_dec(95)] = var_hb;
          var_gu = true;
        }
      } else if (var_ha === func_dec(134)) {
        const var_hc = func_aa(state[func_dec(96)][func_dec(97)]);
        if (var_hc !== state[func_dec(96)][func_dec(97)]) {
          state[func_dec(96)][func_dec(97)] = var_hc;
          var_gu = true;
        }
      } else if (var_ha[func_dec(135)](func_dec(136))) {
        const var_hd = var_ha[func_dec(66)](5);
        const var_he = (state[func_dec(96)][func_dec(98)] || [])[func_dec(137)](var_hf => var_hf && (var_hf[func_dec(138)] === var_hd || var_hf[func_dec(139)] === var_hd));
        if (var_he) {
          const var_hg = func_aa(var_he[func_dec(99)]);
          if (var_hg !== var_he[func_dec(99)]) {
            var_he[func_dec(99)] = var_hg;
            var_gu = true;
          }
        }
      }
    }
    if (!var_gu) return true;
    await d1PutStrict(var_go, func_dec(140), JSON[func_dec(113)](state[func_dec(96)]));
    var_s = true;
    return true;
  } catch (var_hh) {
    return false;
  }
}
export { func_x as resurrectRelay };
async function func_y(var_hi) {
  try {
    if (func_r()) return;
    if (!var_hi || !var_hi[func_dec(118)]) return;
    const var_hj = await acquireNahanRunnerLock(var_hi, func_dec(116), var_h);
    if (!var_hj) return;
    try {
      const var_hk = Date[func_dec(52)]();
      if (var_hk - var_n < var_h) return;
      var_n = var_hk;
      let var_hl = {};
      try {
        var_hl = JSON[func_dec(108)]((await d1Get(var_hi, func_dec(119))) || func_dec(120));
      } catch (var_hq) {
        return;
      }
      const var_hm = Object[func_dec(110)](var_hl)[func_dec(66)](0, 200);
      var_hm[func_dec(112)]((var_hr, var_hs) => (var_hl[var_hr] && var_hl[var_hr][func_dec(141)] || 0) - (var_hl[var_hs] && var_hl[var_hs][func_dec(141)] || 0));
      if (var_hm[func_dec(40)] === 0) return;
      let var_hn = var_i;
      if (breakerLevel() >= 1) var_hn = Math[func_dec(126)](1, Math[func_dec(127)](var_hn / 2));
      const var_ho = [];
      for (let var_ht = 0; var_ht < var_hn && var_ht < var_hm[func_dec(40)]; var_ht++) {
        var_ho[func_dec(71)](var_hm[(var_q + var_ht) % var_hm[func_dec(40)]]);
      }
      var_q = (var_q + var_hn) % var_hm[func_dec(40)];
      let var_hp = false;
      for (const var_hu of var_ho) {
        const var_hv = var_hl[var_hu];
        if (!var_hv || !var_hv[func_dec(42)]) {
          delete var_hl[var_hu];
          var_hp = true;
          continue;
        }
        const var_hw = await func_p(var_hv[func_dec(42)], var_hv[func_dec(43)] || 443);
        if (var_hw) {
          var_hv[func_dec(122)] = (var_hv[func_dec(122)] || 0) + 1;
          if (var_hv[func_dec(122)] >= var_j) {
            const var_hx = await func_x(var_hi, var_hu, var_hv);
            if (var_hx) {
              func_c(var_hv[func_dec(42)], var_hv[func_dec(43)] || 443, true);
              delete var_hl[var_hu];
            }
          }
          var_hp = true;
        } else {
          var_hv[func_dec(122)] = 0;
          var_hp = true;
        }
      }
      if (var_hp) await d1Put(var_hi, func_dec(119), JSON[func_dec(113)](var_hl));
    } finally {
      await releaseNahanRunnerLock(var_hi, var_hj);
    }
  } catch (var_hy) {}
}
export { func_y as probeGraveyard };