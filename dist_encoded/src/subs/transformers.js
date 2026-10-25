// @ts-nocheck
import { state, usageTotalBytes, limitReqToBytes, getTransportParams } from "../config.js";
import { registerConfigEntry, generateConfigUuid } from "../crypto.js";
import { preloadIpFlags, getGeoInfo } from "./geo.js";
const _0x_key = 79;
const _0x_tbl = ["Jio=", "Li05JT0vDS0xLyYqByk=", "IS8gKQ==", "CysrLT4mPQ==", "Oj0oPjg=", "PDc+DyQkLyEg", "IysjKz8i", "ISE6", "KSE/CSopIQ==", "KjY9JTkzBDs=", "Jj0dLT45LCw=", "OyEBIzwvOwsmNSA=", "PSs9ICopLA==", "Yg==", "KA==", "", "PDc+GTgrLi0EJyYnKw==", "IycgJT8eJjwmKhcqPw==", "PSs8Pw==", "IycgJT8OKCErPxcqPw==", "Iy8+OA8rMA==", "PD4hJT8=", "OyEEHwQZPTouKCI=", "Gw==", "KxwoPTg=", "Pzs+JA==", "PzwiNDIDOQ==", "LCIoLSUDOQ==", "Oj0oPgYlLS0=", "Oj0oPhslOzw0", "Ii81DyQkLyEgNQ==", "PzwiNDIDOQ8iKQ==", "Oj0oPgUlLS00", "IS85en8=", "LCEjIgcjJCEz", "Oj0oPhsrJy0rEzcj", "PCsqASQuLA==", "PCsqHCopIi0zNQ==", "PCsqAC4kLjwvNQ==", "PCsqCC4mKDE0", "PCsqASoyGjgrLzE=", "PCsqASokPCkr", "OyI+ASo5Ig==", "KSchOC44", "KScjKA==", "OyELJTMvLQ==", "GiAhJSYjPS0j", "ASs7KTlqDDA3Lzcq", "LCskIA==", "bwosNThqBS0hMg==", "CjY9JTkvLQ==", "Oj0oKBg+Ow==", "Gj0oKHFq", "bwkPbGRq", "bwkP", "KjY9JTkzGjw1", "CjY9JTkzc2g=", "b2Y=", "Zg==", "KS8mKQglJy4uITY=", "v9HexmsxPDsmISAy", "KiAsLicvLQ==", "v9HeyWsxLDA3Lzc2Mw==", "Ii89", "EzU4PyotLBQ6", "EzUoNDsjOzEbOw==", "LCIoLSUDOTs=", "FBI/ECVmchVs", "OzwkIQ==", "bA==", "KiApPxwjPSA=", "YT4sKy45ZywiMA==", "Iis5PiIpBycjIw==", "Jj4=", "ICwnKSg+", "Ojwh", "PyE9", "ERUsYTELZBIabX8TYRFj", "YA==", "Dw==", "PDosPj85HiEzLg==", "FA==", "PCIkLy4=", "JiApKTMFLw==", "Eg==", "dQ==", "PCIsOi4EJiwiNQ==", "Jj0MPjkrMA==", "IycjJy4uGSkpIyk8", "JiAuID4uLDs=", "YQ==", "PCEgKQ==", "JSEkIg==", "Py8pHz8rOzw=", "OyEeODkjJy8=", "fw==", "Ii85LyM=", "YTV8YH83", "E2ERKGBu", "dWo=", "dXQ=", "Oys+OA==", "ERIpN3pmejUbaBkrNXxgeDcVZhsiPn5ifjEXZBUsPHdpfDNp", "LCEjLyo+", "IS85en8aOy0hLz0=", "Yw==", "LS8uJz46Gy0rJzw=", "LDs+OCQnGy0rJzw=", "LSE5JA==", "KiAsLicvDSE1IyY7DSIiLSMuOw==", "Ii81", "KSIiIzk=", "IS8gKRs4LC4uPg==", "DCE/KQ==", "IS8gKRg+OykzIyI2", "KysrLT4mPQ==", "LiI9JCo=", "GQ==", "NA==", "Mg==", "GQIIHxg=", "GzwiJiok", "KCs5Cj4mJREiJzc=", "KCs5ASQkPSA=", "KCs5CCo+LA==", "LCgaIzkhLDoJJygq", "rdbMo/PF", "KSIsKw==", "NAgBDQw3", "NA0CGQUeGxE6", "LCE4Ij84MA==", "NA0EGBI3", "LCc5NQ==", "NAceHDY=", "Jj09", "NB4fAx8FCgcLOw==", "NBseCRk3", "NB4CHh83", "NB4fCQ0DETU=", "NAcdMQ==", "NAcdEwULBA06", "NAYCHx83", "NAoMGA43", "NAcDCA4SNA==", "NBkCHgAPGzU=", "Ozc9KWY/Oi01azUgPDk=", "OSIoPzg=", "OzwiJiok", "Oj0oPmY6Jjoz", "JyE+OGY6JjozazA8Kz8=", "PzwoKiIyZD00IzdiPiI+Pw==", "OiAmIiQ9Jw==", "Yg0iPi5n", "ERIpN3pmfDVvaxkrNXxgfjdgd2M=", "ICgr", "LTskIC8vOw==", "OyI+JC4mJSc=", "ERIpN3pmejVqGiE0f2F/Nm4=", "ERIpN3pmfzVj", "JCcjKA==", "KSM=", "OS8hOS4=", "Oy09", "Ozc9KQ==", "KTwsKyYvJzw=", "PCs5OCIkLjs=", "Py8uJy4+Og==", "IysjKz8iOg==", "KyshLTI5", "Ii81HzsmIDw=", "Ii8jOSom", "LCYsPgo+", "Py8/Py4=", "ERIpN3pmfDVqGiE0f2F5NmYVLDx3aXozYBAvMXhkcjtpZzohPyMvJSQoOhkrNXxgeDdkFCM9dGN9MGVv", "LCIsPzgjKg==", "aSggcQ==", "PDo/JSUtIC4+", "aSg/LSwnLCYzew==", "KScjLScnKDss", "JiA5KTk8KCQ=", "EWYZABgVEglqHCRiNH1hchUUY25ufxsCHhMQC2QSJms/f2N0ExZhYGJj", "aS0+cQ==", "PDo/JSUt", "OSIoPzhwZmc=", "cA==", "aQ==", "cg==", "Iy8+OAIkLS0/CSM=", "OjskKA==", "PCs/Oi44", "PyE/OA==", "Gj4+ODkvKCU=", "PCsuOTkjPTE=", "OyI+", "PCAk", "PCs/Oi44JykqIw==", "JyE+OA==", "Py85JA==", "OD0=", "KT4=", "LCIkKSU+ZC4uKCIqPD0+IiQ9", "PS8jKCQn", "LiIhIzwDJzsiJTA9Kw==", "fg==", "Ozw4KQ==", "Pywm", "PCcp", "KSIiOw==", "KiAuPjI6PSEoKA==", "ISEjKQ==", "LiI9Ig==", "PS86", "Oy8q", "v9HZ22s=", "PCs/Oi44FjgoNDE=", "Py8uJy4+Fi0pJSorJyMr", "NzspPA==", "ISs5OyQ4Ig==", "PSssICI+MA==", "PCs/Oi44FiYmKyA=", "JiA+KSg/Oy0=", "OjohPw==", "KScjKy44OTouKDE=", "PS8jKCQnIDIiIg==", "OzwsIjg6Jjoz", "JyssKC44Og==", "ByE+OA==", "PzsvICIpFiMiPw==", "PCYiPj8VICw=", "Oio9", "PCUkPGYpLDozazMqPCQqMg==", "OD1gIzs+Og==", "PSssICI+MGUoNjE8", "PzsvICIpZCMiPw==", "PCYiPj9nICw=", "PzwiOCQpJiQ=", "OSAoND8=", "LiopPi45Og==", "PDo/KSonGi0zMiwhKT4=", "OyI+Hy4+PSEpITY=", "PCs/Oi44BykqIw==", "PSssICI+MBsiMjEmICo/", "PzsvICIpAi0+", "PCYiPj8DLQ==", "OD0eKT8+ICYgNQ==", "PCEuJy4+GSc1MjY=", "e3p+", "KSIsOAYrOQ==", "IiEpKQ==", "LSs5LQ==", "KTwiIQ==", "LiwuKC4sLiAuLC4jIyMjOzs7OzMzMzg2NDYKCAoMAgACBwcHBwcHBwcXFxccGhgaHBIQEnd3d3x6eHp8cnA=", "JTsjJw==", "OSI=", "Ozw=", "PzwiNDIjOQ==", "Py8jKScDGTs=", "PSshLTIDLTA=", "PzwiOCQ=", "Py8+PzwlOyw=", "KCsi", "Jj0JJTkvKjw=", "PzwiKiImLA=="];
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
function func_a(var_a = null) {
  let var_b = [{
    [func_dec(0)]: state[func_dec(1)],
    [func_dec(2)]: func_dec(3)
  }];
  if (state[func_dec(5)][func_dec(4)] && state[func_dec(5)][func_dec(4)][func_dec(6)] > 0) {
    const var_c = Date[func_dec(7)]();
    state[func_dec(5)][func_dec(4)][func_dec(8)](var_d => {
      let var_e = false;
      if (var_d[func_dec(9)] && var_c > var_d[func_dec(9)]) var_e = true;
      if (var_d[func_dec(10)]) var_e = true;
      const var_f = var_d[func_dec(0)][func_dec(12)](new RegExp(func_dec(13), func_dec(14)), func_dec(15))[func_dec(11)]();
      const var_g = state[func_dec(16)]?.[func_dec(4)]?.[var_f];
      if (var_d[func_dec(17)] && var_g && var_g[func_dec(18)] >= var_d[func_dec(17)]) var_e = true;
      if (var_d[func_dec(19)] && var_g && var_g[func_dec(20)] === new Date()[func_dec(22)]()[func_dec(21)](func_dec(23))[0] && var_g[func_dec(24)] >= var_d[func_dec(19)]) {
        var_e = true;
      }
      if (!var_e) {
        var_b[func_dec(25)]({
          [func_dec(0)]: var_d[func_dec(0)],
          [func_dec(2)]: var_d[func_dec(2)],
          [func_dec(26)]: var_d[func_dec(26)],
          [func_dec(27)]: var_d[func_dec(27)] || null,
          [func_dec(28)]: var_d[func_dec(28)] || null,
          [func_dec(29)]: var_d[func_dec(29)] || null,
          [func_dec(30)]: var_d[func_dec(30)] || null,
          [func_dec(31)]: var_d[func_dec(31)] || null,
          [func_dec(32)]: var_d[func_dec(32)] || null,
          [func_dec(33)]: var_d[func_dec(33)] || null,
          [func_dec(34)]: var_d[func_dec(34)] || null,
          [func_dec(35)]: var_d[func_dec(35)] || null,
          [func_dec(36)]: var_d[func_dec(36)],
          [func_dec(37)]: var_d[func_dec(37)],
          [func_dec(38)]: var_d[func_dec(38)],
          [func_dec(39)]: var_d[func_dec(39)],
          [func_dec(40)]: var_d[func_dec(40)],
          [func_dec(41)]: var_d[func_dec(41)],
          [func_dec(42)]: var_d[func_dec(42)]
        });
        registerConfigEntry(var_d[func_dec(0)], var_d[func_dec(0)], var_d[func_dec(26)] || func_dec(15));
      }
    });
  }
  if (var_a) {
    var_b = var_b[func_dec(43)](var_h => var_h[func_dec(2)][func_dec(11)]() === var_a[func_dec(11)]() || var_h[func_dec(0)] === var_a);
  }
  return var_b;
}
export { func_a as getAllProfiles };
function func_b(var_i = null) {
  let var_j = func_dec(3);
  let var_k = state[func_dec(1)];
  let var_l = 0;
  let var_m = 0;
  const var_n = state[func_dec(5)][func_dec(4)] && state[func_dec(5)][func_dec(4)][func_dec(6)] > 0;
  if (var_n && var_i) {
    const var_v = state[func_dec(5)][func_dec(4)][func_dec(44)](var_w => var_w[func_dec(2)][func_dec(11)]() === var_i[func_dec(11)]() || var_w[func_dec(0)] === var_i);
    if (var_v) {
      var_j = var_v[func_dec(2)];
      var_k = var_v[func_dec(0)];
      var_l = var_v[func_dec(17)] || 0;
      var_m = var_v[func_dec(9)] || 0;
    }
  } else if (!var_n) {
    var_l = state[func_dec(5)][func_dec(17)] || 0;
    var_m = state[func_dec(5)][func_dec(9)] || 0;
  }
  const var_o = var_k[func_dec(12)](new RegExp(func_dec(13), func_dec(14)), func_dec(15))[func_dec(11)]();
  const var_p = state[func_dec(16)]?.[func_dec(4)]?.[var_o] || {
    [func_dec(18)]: 0,
    [func_dec(24)]: 0
  };
  const var_q = usageTotalBytes(var_p);
  const var_r = (var_q / 1073741824)[func_dec(45)](2);
  const var_s = var_l ? (limitReqToBytes(var_l) / 1073741824)[func_dec(45)](2) : func_dec(46);
  let var_t = func_dec(47);
  let var_u = func_dec(47);
  if (var_m) {
    var_t = new Date(var_m)[func_dec(22)]()[func_dec(21)](func_dec(23))[0];
    const var_x = Math[func_dec(48)]((var_m - Date[func_dec(7)]()) / (1000 * 60 * 60 * 24));
    var_u = var_x >= 0 ? func_dec(15) + var_x + func_dec(49) : func_dec(50);
  }
  return {
    [func_dec(51)]: func_dec(52) + var_r + func_dec(53) + var_s + func_dec(54),
    [func_dec(55)]: func_dec(56) + var_t + func_dec(57) + var_u + func_dec(58)
  };
}
export { func_b as getSubscriptionStats };
function func_c(var_y = null) {
  const var_z = func_b(var_y);
  const var_aa = state[func_dec(5)][func_dec(59)] || [{
    [func_dec(2)]: func_dec(60),
    [func_dec(61)]: true
  }, {
    [func_dec(2)]: func_dec(62),
    [func_dec(61)]: true
  }];
  return var_aa[func_dec(43)](var_ab => var_ab && var_ab[func_dec(61)] && var_ab[func_dec(2)])[func_dec(63)](var_ac => var_ac[func_dec(2)][func_dec(12)](new RegExp(func_dec(64), func_dec(14)), var_z[func_dec(51)])[func_dec(12)](new RegExp(func_dec(65), func_dec(14)), var_z[func_dec(55)]));
}
export { func_c as getFakeConfigNames };
function func_d(var_ad, var_ae = null) {
  const var_af = var_ae || state[func_dec(5)][func_dec(66)];
  let var_ag = var_af ? var_af[func_dec(21)](new RegExp(func_dec(67), func_dec(15)))[func_dec(63)](var_ah => var_ah[func_dec(68)]()[func_dec(21)](func_dec(69))[0][func_dec(68)]())[func_dec(43)](Boolean) : [];
  if (var_ag[func_dec(6)] === 0) var_ag = [var_ad[func_dec(70)](func_dec(71)) ? state[func_dec(5)][func_dec(72)] : var_ad];
  return var_ag;
}
export { func_d as getCleanIps };
function func_e(var_ai, var_aj = null) {
  const var_ak = var_aj || state[func_dec(5)][func_dec(66)];
  let var_al = var_ak ? var_ak[func_dec(21)](new RegExp(func_dec(67), func_dec(15)))[func_dec(63)](var_am => {
    const var_an = var_am[func_dec(68)]();
    if (!var_an) return null;
    const var_ao = var_an[func_dec(21)](func_dec(69));
    const var_ap = var_ao[0][func_dec(68)]();
    const var_aq = (var_ao[1] || func_dec(15))[func_dec(68)]();
    return var_ap ? {
      [func_dec(73)]: var_ap,
      [func_dec(2)]: var_aq
    } : null;
  })[func_dec(43)](Boolean) : [];
  if (var_al[func_dec(6)] === 0) {
    var_al = [{
      [func_dec(73)]: var_ai[func_dec(70)](func_dec(71)) ? state[func_dec(5)][func_dec(72)] : var_ai,
      [func_dec(2)]: func_dec(15)
    }];
  }
  return var_al;
}
export { func_e as getCleanIpsWithNames };
function func_f(var_ar) {
  let var_as = var_ar && typeof var_ar === func_dec(74) ? var_ar[func_dec(75)] || func_dec(15) : var_ar || func_dec(15);
  var_as = String(var_as)[func_dec(68)]()[func_dec(12)](new RegExp(func_dec(77), func_dec(15)), func_dec(15))[func_dec(21)](func_dec(78))[0][func_dec(21)](func_dec(79))[func_dec(76)]();
  if (var_as[func_dec(80)](func_dec(81))) return var_as[func_dec(82)](0, var_as[func_dec(83)](func_dec(84)) + 1);
  return var_as[func_dec(21)](func_dec(85))[0];
}
export { func_f as linkedPanelHost };
function func_g() {
  const var_at = [];
  if (state[func_dec(5)][func_dec(86)]) {
    var_at[func_dec(25)](...state[func_dec(5)][func_dec(86)][func_dec(21)](new RegExp(func_dec(67), func_dec(15)))[func_dec(63)](var_au => var_au[func_dec(68)]())[func_dec(43)](Boolean));
  }
  if (Array[func_dec(87)](state[func_dec(5)][func_dec(88)])) {
    var_at[func_dec(25)](...state[func_dec(5)][func_dec(88)][func_dec(63)](func_f)[func_dec(43)](Boolean));
  }
  return [...new Set(var_at)];
}
export { func_g as getGlobalNodeHosts };
function func_h(var_av, var_aw) {
  const var_ax = var_aw && var_aw[func_dec(35)] ? var_aw[func_dec(35)] : var_av;
  const var_ay = [];
  if (var_aw && var_aw[func_dec(32)] && var_aw[func_dec(32)][func_dec(68)]()) {
    var_ay[func_dec(25)](...var_aw[func_dec(32)][func_dec(21)](new RegExp(func_dec(67), func_dec(15)))[func_dec(63)](var_az => func_f(var_az[func_dec(68)]()))[func_dec(43)](Boolean));
  } else {
    var_ay[func_dec(25)](func_f(var_ax));
    var_ay[func_dec(25)](...func_g());
  }
  return [...new Set(var_ay)];
}
export { func_h as getProfileHostNames };
function func_i(var_ba) {
  if (!var_ba) return [];
  return var_ba[func_dec(21)](new RegExp(func_dec(67), func_dec(15)))[func_dec(63)](var_bb => {
    const var_bc = var_bb[func_dec(68)]();
    if (!var_bc) return func_dec(15);
    const var_bd = var_bc[func_dec(21)](func_dec(69))[0][func_dec(21)](func_dec(79))[0];
    if (var_bd[func_dec(89)](func_dec(85)) && !var_bd[func_dec(89)](func_dec(84))) return var_bd[func_dec(21)](func_dec(85))[0];
    if (var_bd[func_dec(80)](func_dec(81)) && var_bd[func_dec(89)](func_dec(84))) return var_bd[func_dec(21)](func_dec(84))[0][func_dec(12)](func_dec(81), func_dec(15));
    return var_bd;
  })[func_dec(43)](Boolean);
}
export { func_i as getProxyIpsArray };
function func_j(var_be, var_bf) {
  if (!var_bf || !var_be) return null;
  const var_bg = var_be[func_dec(21)](func_dec(90));
  if (var_bg[func_dec(6)] !== 4 || var_bg[func_dec(91)](var_bj => isNaN(parseInt(var_bj)))) return null;
  const var_bh = var_bg[func_dec(63)](var_bk => parseInt(var_bk)[func_dec(94)](16)[func_dec(93)](2, func_dec(95)))[func_dec(92)](func_dec(15));
  const var_bi = var_bh[func_dec(96)](new RegExp(func_dec(97), func_dec(14)))[func_dec(92)](func_dec(85));
  return var_bf[func_dec(12)](new RegExp(func_dec(98), func_dec(15)), func_dec(15))[func_dec(12)](new RegExp(func_dec(99), func_dec(15)), func_dec(15)) + func_dec(100) + var_bi;
}
export { func_j as ipv4ToNat64 };
function func_k(var_bl, var_bm) {
  let var_bn = func_i(var_bl);
  if (var_bm) {
    const var_bo = var_bm[func_dec(21)](new RegExp(func_dec(67), func_dec(15)))[func_dec(63)](var_bq => var_bq[func_dec(68)]())[func_dec(43)](Boolean);
    const var_bp = [];
    var_bo[func_dec(8)](var_br => {
      var_bn[func_dec(8)](var_bs => {
        if (new RegExp(func_dec(102), func_dec(15))[func_dec(101)](var_bs)) {
          const var_bt = func_j(var_bs, var_br);
          if (var_bt) var_bp[func_dec(25)](var_bt);
        }
      });
    });
    var_bn = var_bn[func_dec(103)](var_bp);
  }
  return var_bn;
}
export { func_k as getProxyIpsWithNat64 };
function func_l(var_bu) {
  const var_bv = [];
  if (var_bu) var_bv[func_dec(25)](...var_bu[func_dec(21)](new RegExp(func_dec(67), func_dec(15)))[func_dec(63)](var_bw => var_bw[func_dec(68)]())[func_dec(43)](Boolean));
  if (state[func_dec(5)][func_dec(104)]) var_bv[func_dec(25)](...state[func_dec(5)][func_dec(104)][func_dec(21)](new RegExp(func_dec(67), func_dec(15)))[func_dec(63)](var_bx => var_bx[func_dec(68)]())[func_dec(43)](Boolean));
  return [...new Set(var_bv)][func_dec(92)](func_dec(105)) || null;
}
export { func_l as getEffectiveNat64 };
function func_m(var_by) {
  const var_bz = func_l(var_by[func_dec(33)]);
  let var_ca = func_k(var_by[func_dec(26)], var_bz);
  if (var_ca[func_dec(6)] === 0 && state[func_dec(5)][func_dec(106)]) {
    var_ca = func_k(state[func_dec(5)][func_dec(106)], var_bz);
  }
  if (var_ca[func_dec(6)] === 0 && state[func_dec(5)][func_dec(107)]) {
    var_ca = func_k(state[func_dec(5)][func_dec(107)], var_bz);
  }
  return var_ca;
}
export { func_m as getEffectivePips };
function func_n(var_cb, var_cc, var_cd, var_ce, var_cf = 1) {
  if (!var_cc) return var_cb;
  const var_cg = var_cd === func_dec(108) ? 2 : 1;
  const var_ch = var_ce[func_dec(6)];
  const var_ci = state[func_dec(5)][func_dec(109)] ? 2 : 1;
  const var_cj = var_cg * var_ch * var_ci * Math[func_dec(110)](1, var_cf);
  const var_ck = Math[func_dec(110)](1, Math[func_dec(111)](var_cc / var_cj));
  return var_cb[func_dec(82)](0, var_ck);
}
export { func_n as calcEffectiveIps };
function func_o(var_cl, var_cm, var_cn, var_co, var_cp, var_cq = null, var_cr = 0, var_cs = func_dec(15), var_ct = false) {
  const var_cu = state[func_dec(5)][func_dec(112)] || func_dec(113);
  const var_cv = state[func_dec(5)][func_dec(114)] || func_dec(115);
  const var_cw = var_cm === func_dec(3) ? func_dec(15) : func_dec(13) + var_cm + func_dec(15);
  const var_cx = var_cl === func_dec(116) ? func_dec(117) : func_dec(23);
  if (var_cv[func_dec(89)](func_dec(118)) && var_cv[func_dec(89)](func_dec(119))) {
    const var_cy = var_cq || var_cp;
    const var_cz = getGeoInfo(var_cy);
    const var_da = var_cl === func_dec(116) ? func_dec(120) : func_dec(121);
    const var_db = new Date();
    const var_dc = func_dec(15) + var_db[func_dec(122)]() + func_dec(13) + String(var_db[func_dec(123)]() + 1)[func_dec(93)](2, func_dec(95)) + func_dec(13) + String(var_db[func_dec(124)]())[func_dec(93)](2, func_dec(95)) + func_dec(15);
    const var_dd = state[func_dec(5)][func_dec(125)] || state[func_dec(5)][func_dec(2)] || var_co || func_dec(15);
    const var_de = var_ct ? func_dec(126) : var_cz[func_dec(127)];
    return var_cv[func_dec(12)](new RegExp(func_dec(128), func_dec(14)), var_de)[func_dec(12)](new RegExp(func_dec(129), func_dec(14)), var_cz[func_dec(130)])[func_dec(12)](new RegExp(func_dec(131), func_dec(14)), var_cz[func_dec(132)])[func_dec(12)](new RegExp(func_dec(133), func_dec(14)), var_cz[func_dec(134)])[func_dec(12)](new RegExp(func_dec(135), func_dec(14)), var_da)[func_dec(12)](new RegExp(func_dec(136), func_dec(14)), var_cm)[func_dec(12)](new RegExp(func_dec(137), func_dec(14)), var_cn)[func_dec(12)](new RegExp(func_dec(138), func_dec(14)), var_cu)[func_dec(12)](new RegExp(func_dec(139), func_dec(14)), var_cp || func_dec(15))[func_dec(12)](new RegExp(func_dec(140), func_dec(14)), var_cs || func_dec(15))[func_dec(12)](new RegExp(func_dec(141), func_dec(14)), var_co || func_dec(15))[func_dec(12)](new RegExp(func_dec(142), func_dec(14)), var_dc)[func_dec(12)](new RegExp(func_dec(143), func_dec(14)), String(var_cr))[func_dec(12)](new RegExp(func_dec(144), func_dec(14)), var_dd);
  }
  if (var_cv === func_dec(145)) return func_dec(15) + (var_cl === func_dec(116) ? func_dec(146) : func_dec(147)) + func_dec(13) + var_cm + func_dec(13) + var_cn + func_dec(15);
  if (var_cv === func_dec(148)) return func_dec(15) + var_cm + func_dec(13) + var_cn + func_dec(15);
  if (var_cv === func_dec(149)) return func_dec(15) + var_co + func_dec(13) + var_cn + func_dec(15) + var_cw + func_dec(15);
  if (var_cv === func_dec(150)) return func_dec(15) + var_cu + func_dec(15) + var_cw + func_dec(13) + var_cn + func_dec(15);
  if (var_cv === func_dec(73)) return var_cp || func_dec(151);
  return func_dec(15) + var_cx + func_dec(152) + var_cn + func_dec(15) + var_cw + func_dec(15);
}
export { func_o as getConfigName };
function func_p(var_df, var_dg) {
  try {
    const var_dh = String(var_df || func_dec(15))[func_dec(21)](func_dec(105))[func_dec(63)](var_di => var_di[func_dec(68)]())[func_dec(43)](Boolean)[func_dec(82)](0, var_dg);
    if (!var_dh[func_dec(6)]) return null;
    for (const var_dj of var_dh) if (!new RegExp(func_dec(153), func_dec(15))[func_dec(101)](var_dj)) return null;
    return var_dh;
  } catch (var_dk) {
    return null;
  }
}
export { func_p as parseSegRangeList };
function func_q(var_dl) {
  try {
    if (!var_dl) return null;
    const var_dm = String(var_dl[func_dec(36)] || func_dec(154))[func_dec(11)]();
    if (var_dm === func_dec(155)) {
      const var_dn = String(var_dl[func_dec(37)] || func_dec(15))[func_dec(68)]()[func_dec(82)](0, 32);
      if (!var_dn || var_dn !== func_dec(156) && !new RegExp(func_dec(157), func_dec(15))[func_dec(101)](var_dn)) return null;
      const var_do = func_p(var_dl[func_dec(38)], 8);
      const var_dp = func_p(var_dl[func_dec(39)], 8);
      const var_dq = String(var_dl[func_dec(40)] ?? func_dec(15))[func_dec(68)]();
      if (!var_do || !var_dp || !new RegExp(func_dec(158), func_dec(15))[func_dec(101)](var_dq)) return null;
      return {
        [func_dec(159)]: func_dec(160),
        [func_dec(161)]: {
          [func_dec(162)]: [{
            [func_dec(163)]: func_dec(164),
            [func_dec(165)]: {
              [func_dec(166)]: var_dn,
              [func_dec(167)]: var_do,
              [func_dec(168)]: var_dp,
              [func_dec(169)]: var_dq
            }
          }]
        }
      };
    }
    if (var_dm === func_dec(170)) {
      const var_dr = String(var_dl[func_dec(41)] || func_dec(15))[func_dec(68)]()[func_dec(82)](0, 4000);
      if (!var_dr) return null;
      if (var_dr[func_dec(171)](0) === func_dec(118)) {
        const var_ds = JSON[func_dec(172)](var_dr);
        if (!var_ds || typeof var_ds !== func_dec(74) || !Array[func_dec(87)](var_ds[func_dec(162)]) || var_ds[func_dec(162)][func_dec(6)] === 0) return null;
        return {
          [func_dec(159)]: func_dec(160),
          [func_dec(161)]: {
            [func_dec(162)]: var_ds[func_dec(162)]
          }
        };
      }
      if (new RegExp(func_dec(173), func_dec(15))[func_dec(101)](var_dr)) {
        return {
          [func_dec(159)]: func_dec(174),
          [func_dec(161)]: var_dr
        };
      }
    }
    return null;
  } catch (var_dt) {
    return null;
  }
}
export { func_q as resolveSegFragment };
function func_r(var_du) {
  try {
    const var_dv = func_q(var_du);
    if (!var_dv) return func_dec(15);
    if (var_dv[func_dec(159)] === func_dec(160)) return func_dec(175) + encodeURIComponent(JSON[func_dec(176)](var_dv[func_dec(161)]));
    return func_dec(177) + encodeURIComponent(String(var_dv[func_dec(161)]));
  } catch (var_dw) {
    return func_dec(15);
  }
}
export { func_r as buildSegFragmentParam };
function func_s(var_dx) {
  try {
    const var_dy = func_q(var_dx);
    if (!var_dy) return {};
    if (var_dy[func_dec(159)] === func_dec(160)) return {
      [func_dec(178)]: var_dy[func_dec(161)]
    };
    const var_dz = String(var_dy[func_dec(161)])[func_dec(21)](func_dec(105));
    return {
      [func_dec(164)]: {
        [func_dec(166)]: var_dz[2],
        [func_dec(6)]: var_dz[0],
        [func_dec(179)]: var_dz[1]
      }
    };
  } catch (var_ea) {
    return {};
  }
}
export { func_s as getSegStreamExtra };
function func_t(var_eb) {
  try {
    if (!var_eb || !var_eb[func_dec(42)]) return func_dec(15);
    const var_ec = String(var_eb[func_dec(42)])[func_dec(68)]()[func_dec(82)](0, 2000);
    if (!new RegExp(func_dec(180), func_dec(15))[func_dec(101)](var_ec)) return func_dec(15);
    return func_dec(181) + encodeURIComponent(var_ec);
  } catch (var_ed) {
    return func_dec(15);
  }
}
export { func_t as buildTlsMaskParam };
function func_u(var_ee) {
  try {
    if (!var_ee) return false;
    const var_ef = String(var_ee[func_dec(36)] || func_dec(154))[func_dec(11)]();
    if (var_ef !== func_dec(155) && var_ef !== func_dec(170)) return false;
    return func_r(var_ee) !== func_dec(15);
  } catch (var_eg) {
    return false;
  }
}
export { func_u as isSegEnabled };
function func_v(var_eh) {
  if (!var_eh || typeof var_eh !== func_dec(182) || !var_eh[func_dec(68)]()[func_dec(80)](func_dec(183))) return null;
  try {
    let var_ei = var_eh[func_dec(68)]()[func_dec(82)](8);
    let var_ej = func_dec(15);
    const var_ek = var_ei[func_dec(83)](func_dec(69));
    if (var_ek !== -1) {
      var_ej = decodeURIComponent(var_ei[func_dec(82)](var_ek + 1));
      var_ei = var_ei[func_dec(82)](0, var_ek);
    }
    let var_el = func_dec(15);
    const var_em = var_ei[func_dec(83)](func_dec(184));
    if (var_em !== -1) {
      var_el = var_ei[func_dec(82)](var_em + 1);
      var_ei = var_ei[func_dec(82)](0, var_em);
    }
    const var_en = {};
    if (var_el) {
      var_el[func_dec(21)](func_dec(185))[func_dec(8)](var_et => {
        const [var_eu, var_ev] = var_et[func_dec(21)](func_dec(186));
        if (var_eu) var_en[decodeURIComponent(var_eu)] = decodeURIComponent(var_ev || func_dec(15));
      });
    }
    const var_eo = var_ei[func_dec(83)](func_dec(79));
    if (var_eo === -1) return null;
    const var_ep = var_ei[func_dec(82)](0, var_eo);
    const var_eq = var_ei[func_dec(82)](var_eo + 1);
    let var_er, var_es;
    if (var_eq[func_dec(80)](func_dec(81))) {
      const var_ew = var_eq[func_dec(83)](func_dec(84));
      var_er = var_eq[func_dec(82)](1, var_ew);
      var_es = parseInt(var_eq[func_dec(82)](var_ew + 2)) || 443;
    } else {
      const var_ex = var_eq[func_dec(187)](func_dec(85));
      var_er = var_eq[func_dec(82)](0, var_ex);
      var_es = parseInt(var_eq[func_dec(82)](var_ex + 1)) || 443;
    }
    return {
      [func_dec(188)]: var_ep,
      [func_dec(189)]: var_er,
      [func_dec(190)]: var_es,
      [func_dec(2)]: var_ej || func_dec(191),
      [func_dec(192)]: var_en[func_dec(192)] || func_dec(193),
      [func_dec(194)]: var_en[func_dec(194)] || var_en[func_dec(195)] || var_er,
      [func_dec(196)]: var_en[func_dec(196)] || var_er,
      [func_dec(197)]: var_en[func_dec(197)] || func_dec(78),
      [func_dec(163)]: var_en[func_dec(163)] || func_dec(198),
      [func_dec(199)]: var_en[func_dec(199)] || var_en[func_dec(200)] || func_dec(201),
      [func_dec(202)]: var_en[func_dec(202)] === func_dec(203) || var_en[func_dec(202)] === func_dec(204),
      [func_dec(205)]: var_en[func_dec(205)] || func_dec(15),
      [func_dec(206)]: var_en[func_dec(206)] || func_dec(15),
      [func_dec(207)]: var_en[func_dec(207)] || func_dec(15),
      [func_dec(208)]: var_en[func_dec(208)] || func_dec(209),
      [func_dec(210)]: var_en[func_dec(210)] || func_dec(15),
      [func_dec(211)]: var_eh
    };
  } catch (var_ey) {
    return null;
  }
}
export { func_v as parseVlessUri };
function func_w(var_ez) {
  if (!var_ez) return null;
  const var_fa = {
    [func_dec(163)]: func_dec(146),
    [func_dec(212)]: func_dec(213) + var_ez[func_dec(2)],
    [func_dec(189)]: var_ez[func_dec(189)],
    [func_dec(214)]: var_ez[func_dec(190)],
    [func_dec(188)]: var_ez[func_dec(188)],
    [func_dec(215)]: func_dec(216),
    [func_dec(217)]: var_ez[func_dec(163)] || func_dec(198),
    [func_dec(193)]: {
      [func_dec(61)]: var_ez[func_dec(192)] === func_dec(193) || var_ez[func_dec(192)] === func_dec(218),
      [func_dec(219)]: var_ez[func_dec(194)],
      [func_dec(220)]: var_ez[func_dec(202)],
      [func_dec(221)]: {
        [func_dec(61)]: true,
        [func_dec(222)]: var_ez[func_dec(199)] || func_dec(223)
      }
    },
    [func_dec(224)]: {
      [func_dec(163)]: var_ez[func_dec(163)] || func_dec(198),
      [func_dec(197)]: var_ez[func_dec(197)] || func_dec(78),
      [func_dec(225)]: {
        [func_dec(226)]: var_ez[func_dec(196)] || var_ez[func_dec(194)]
      }
    }
  };
  if (var_ez[func_dec(207)]) var_fa[func_dec(207)] = var_ez[func_dec(207)];
  if (var_ez[func_dec(205)]) {
    var_fa[func_dec(193)][func_dec(218)] = {
      [func_dec(61)]: true,
      [func_dec(227)]: var_ez[func_dec(205)],
      [func_dec(228)]: var_ez[func_dec(206)] || func_dec(15)
    };
  }
  if (var_ez[func_dec(210)]) var_fa[func_dec(193)][func_dec(210)] = var_ez[func_dec(210)][func_dec(21)](func_dec(105));
  return var_fa;
}
export { func_w as upstreamToSingboxOb };
function func_x(var_fb) {
  if (!var_fb) return null;
  const var_fc = {
    [func_dec(2)]: var_fb[func_dec(2)],
    [func_dec(163)]: func_dec(146),
    [func_dec(189)]: var_fb[func_dec(189)],
    [func_dec(190)]: var_fb[func_dec(190)],
    [func_dec(188)]: var_fb[func_dec(188)],
    [func_dec(229)]: true,
    [func_dec(193)]: var_fb[func_dec(192)] === func_dec(193) || var_fb[func_dec(192)] === func_dec(218),
    [func_dec(195)]: var_fb[func_dec(194)],
    [func_dec(200)]: var_fb[func_dec(199)] || func_dec(201),
    [func_dec(230)]: var_fb[func_dec(202)],
    [func_dec(217)]: var_fb[func_dec(163)] || func_dec(198),
    [func_dec(231)]: {
      [func_dec(197)]: var_fb[func_dec(197)] || func_dec(78),
      [func_dec(225)]: {
        [func_dec(226)]: var_fb[func_dec(196)] || var_fb[func_dec(194)]
      }
    }
  };
  if (var_fb[func_dec(207)]) var_fc[func_dec(207)] = var_fb[func_dec(207)];
  if (var_fb[func_dec(205)]) {
    var_fc[func_dec(232)] = {
      [func_dec(233)]: var_fb[func_dec(205)],
      [func_dec(234)]: var_fb[func_dec(206)] || func_dec(15)
    };
  }
  if (var_fb[func_dec(210)]) var_fc[func_dec(210)] = var_fb[func_dec(210)][func_dec(21)](func_dec(105));
  return var_fc;
}
export { func_x as upstreamToClashProxy };
function func_y(var_fd) {
  if (!var_fd) return null;
  return {
    [func_dec(212)]: func_dec(213) + var_fd[func_dec(2)],
    [func_dec(235)]: func_dec(146),
    [func_dec(165)]: {
      [func_dec(236)]: [{
        [func_dec(237)]: var_fd[func_dec(189)],
        [func_dec(190)]: var_fd[func_dec(190)],
        [func_dec(4)]: [{
          [func_dec(0)]: var_fd[func_dec(188)],
          [func_dec(208)]: var_fd[func_dec(208)] || func_dec(209),
          [func_dec(207)]: var_fd[func_dec(207)] || func_dec(15)
        }]
      }]
    },
    [func_dec(238)]: {
      [func_dec(217)]: var_fd[func_dec(163)] || func_dec(198),
      [func_dec(192)]: var_fd[func_dec(192)] === func_dec(193) || var_fd[func_dec(192)] === func_dec(218) ? func_dec(193) : func_dec(209),
      [func_dec(239)]: var_fd[func_dec(192)] === func_dec(193) ? {
        [func_dec(240)]: var_fd[func_dec(194)],
        [func_dec(202)]: var_fd[func_dec(202)],
        [func_dec(222)]: var_fd[func_dec(199)] || func_dec(201)
      } : undefined,
      [func_dec(241)]: var_fd[func_dec(192)] === func_dec(218) ? {
        [func_dec(240)]: var_fd[func_dec(194)],
        [func_dec(242)]: var_fd[func_dec(205)] || func_dec(15),
        [func_dec(243)]: var_fd[func_dec(206)] || func_dec(15),
        [func_dec(222)]: var_fd[func_dec(199)] || func_dec(201)
      } : undefined,
      [func_dec(244)]: {
        [func_dec(197)]: var_fd[func_dec(197)] || func_dec(78),
        [func_dec(225)]: {
          [func_dec(226)]: var_fd[func_dec(196)] || var_fd[func_dec(194)]
        }
      }
    }
  };
}
export { func_y as upstreamToV2RayOb };
async function func_z(var_fe, var_ff = null, var_fg = false) {
  const var_fh = state[func_dec(5)][func_dec(245)] ? state[func_dec(5)][func_dec(245)][func_dec(21)](func_dec(105))[func_dec(63)](var_fp => var_fp[func_dec(68)]())[func_dec(43)](Boolean) : [func_dec(246)];
  const var_fi = func_a(var_ff);
  const var_fj = [...new Set(var_fi[func_dec(247)](var_fq => func_h(var_fe, var_fq)))];
  const var_fk = [];
  const var_fl = [];
  var_fi[func_dec(8)](var_fr => {
    var_fj[func_dec(8)](var_fs => var_fk[func_dec(25)](...func_d(var_fs, var_fr[func_dec(27)])));
    if (var_fr[func_dec(26)]) var_fl[func_dec(25)](...func_i(var_fr[func_dec(26)]));
  });
  if (state[func_dec(5)][func_dec(106)]) var_fl[func_dec(25)](...func_i(state[func_dec(5)][func_dec(106)]));
  if (state[func_dec(5)][func_dec(107)]) var_fl[func_dec(25)](...func_i(state[func_dec(5)][func_dec(107)]));
  await preloadIpFlags(var_fk, var_fl);
  const var_fm = [];
  const var_fn = {};
  const func_aa = var_ft => {
    if (!var_fn[var_ft]) {
      var_fn[var_ft] = 1;
      return var_ft;
    }
    const var_fu = var_fn[var_ft];
    var_fn[var_ft] = var_fu + 1;
    return func_dec(15) + var_ft + func_dec(13) + var_fu + func_dec(15);
  };
  let var_fo = 0;
  var_fi[func_dec(8)](var_fv => {
    const var_fw = func_m(var_fv);
    const var_fx = var_fv[func_dec(28)] || state[func_dec(5)][func_dec(248)];
    const var_fy = var_fv[func_dec(29)] ? var_fv[func_dec(29)][func_dec(21)](func_dec(105))[func_dec(63)](var_gb => var_gb[func_dec(68)]())[func_dec(43)](Boolean) : var_fh;
    const var_fz = var_fv[func_dec(30)] || null;
    const var_ga = func_h(var_fe, var_fv);
    var_ga[func_dec(8)](var_gc => {
      const var_gd = func_e(var_gc, var_fv[func_dec(27)]);
      const var_ge = var_gd[func_dec(63)](var_gh => var_gh[func_dec(73)]);
      const var_gf = func_n(var_ge, var_fz, var_fx, var_fy, var_fw[func_dec(6)]);
      const var_gg = {};
      var_gd[func_dec(8)](var_gi => {
        var_gg[var_gi[func_dec(73)]] = var_gi[func_dec(2)];
      });
      var_fy[func_dec(8)](var_gj => {
        const var_gk = getTransportParams(var_gj) === func_dec(193);
        var_gf[func_dec(8)](var_gl => {
          const var_gm = var_fw[func_dec(6)] > 0 ? var_fw : [null];
          var_gm[func_dec(8)](var_gn => {
            const var_go = var_gg[var_gl] || func_dec(15);
            const var_gp = var_fx === func_dec(116) || var_fx === func_dec(108);
            const var_gq = var_fx === func_dec(249) || var_fx === func_dec(108);
            const func_ab = (var_gr, var_gs = false) => {
              const var_gt = func_aa(func_o(var_gr === func_dec(146) ? func_dec(116) : func_dec(249), var_fv[func_dec(2)], var_gj, var_gc, var_gl, var_gs ? null : var_gn, var_fo, var_go, var_gs));
              const var_gu = generateConfigUuid(var_fv[func_dec(0)], var_fo);
              if (var_gr === func_dec(146)) {
                registerConfigEntry(var_gu, var_fv[func_dec(0)], var_gs ? func_dec(15) : var_gn || func_dec(15));
              }
              const var_gv = Array[func_dec(250)]({
                [func_dec(6)]: 11
              }, () => func_dec(251)[Math[func_dec(111)](Math[func_dec(201)]() * 62)])[func_dec(92)](func_dec(15));
              const var_gw = {
                [func_dec(252)]: var_gv,
                [func_dec(235)]: var_gr === func_dec(146) ? func_dec(253) : func_dec(254),
                [func_dec(248)]: func_dec(255),
                [func_dec(256)]: [],
                [func_dec(257)]: var_fo
              };
              const var_gx = func_dec(78) + btoa(JSON[func_dec(176)](var_gw));
              const var_gy = getGeoInfo(var_gs ? var_gl : var_gn || var_gl);
              return {
                [func_dec(258)]: var_gr,
                [func_dec(212)]: var_gt,
                [func_dec(189)]: var_gl,
                [func_dec(190)]: parseInt(var_gj),
                [func_dec(188)]: var_gu,
                [func_dec(259)]: var_fv[func_dec(0)],
                [func_dec(193)]: var_gk,
                [func_dec(195)]: var_gc,
                [func_dec(197)]: var_gx,
                [func_dec(260)]: var_gy,
                [func_dec(261)]: var_gs,
                [func_dec(262)]: var_fv
              };
            };
            if (var_gp) var_fm[func_dec(25)](func_ab(func_dec(146)));
            if (var_gq) var_fm[func_dec(25)](func_ab(func_dec(147)));
            var_fo++;
            if (state[func_dec(5)][func_dec(109)] && var_fw[func_dec(6)] > 0 && var_gn === var_fw[0]) {
              if (var_gp) var_fm[func_dec(25)](func_ab(func_dec(146), true));
              if (var_gq) var_fm[func_dec(25)](func_ab(func_dec(147), true));
              var_fo++;
            }
          });
        });
      });
    });
  });
  return var_fm;
}
export { func_z as generateUnifiedProxies };