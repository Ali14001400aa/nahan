// @ts-nocheck
import { state, fetchT, getAlpha, getBeta } from "../config.js";
import { getFakeConfigNames, generateUnifiedProxies, parseVlessUri, upstreamToClashProxy, upstreamToSingboxOb, upstreamToV2RayOb, buildSegFragmentParam, buildTlsMaskParam, getSegStreamExtra } from "./transformers.js";
const _0x_key = 79;
const _0x_tbl = ["KCc5JD4oGy03KQ==", "PDc+DyQkLyEg", "Jjo+NS4oLCMvI2ohLyUtJQ==", "Jzo5PDhwZmc1JzJhKSQ4Iz8rPTQjNywhIzguJD1mJCkoYA==", "YCMsJSVlKiQmNS1hNyAg", "ICU=", "Oys1OA==", "YCMsJSVlOiEpIScgNmMmOCUn", "JT0iIg==", "YCMsJSVlP2YtNSoh", "LDs+OCQnGycyMiwhKQ==", "", "KSchOC44", "Ii89", "PD4hJT8=", "RQ==", "OzwkIQ==", "OyEBIzwvOwsmNSA=", "PDosPj85HiEzLg==", "KCsiJTtw", "Pzs+JA==", "OyEYPDsvOwsmNSA=", "PDsvPz84ICYg", "KCsiPyI+LHI=", "Ii85LyM=", "ERV9YXIWZxRofBhkag==", "KyEgLSIkOg==", "Jj4+", "KCsiJTs5", "KCsiPyI+LDs=", "KSE/CSopIQ==", "OzwiJiokc2dodnV/fn18e3pkeHd2dWJ+fXx7Z3l4d3Zof359fHt6eXh3dnV/Dnx+fGR5ZndodHV/fXR7dTotJDM3Jjo0cSUlJy1k", "YA==", "Lj4kHiQ/PS0=", "PCsuOTkjPTF6", "aT0jJXY=", "aSg9cQ==", "aTo0PC53PjthLio8OnA=", "aT4sOCN3", "OyI+", "ISEjKQ==", "PCs/Oi44JykqIw==", "LikoIj8=", "KiAsLicvBjgzdA==", "aT4vJ3YvJyklKiAr", "aS8hICQ9ACY0IyY6PChx", "fg==", "fw==", "PzwiKiImLA==", "PzwiOCQ=", "OSIoPzg=", "dWFi", "Dw==", "dQ==", "cCsjLzkzOTwuKStyICIiLmw=", "bA==", "OjskKA==", "PCs/Oi44", "PyE/OA==", "Oy8q", "Py85JA==", "cA==", "Py8+PzwlOyw=", "Oj4+ODkvKCUSNCw=", "OiA+JCIsPQ==", "PS86", "JSEkIg==", "Ym4jLSYvc2hl", "bURtbD8zOS19Zg==", "RW5tPy44Py01fGV+fHpie2R5ZnZMZW8+Ij4/cGlwd0xlbz4sPzg9JjojfGVt", "bURtbD4uOXJnMjc6K0dsaz4lO31mIy4iPik=", "Li05JT0vDS0xLyYqByk=", "bQ==", "LCE4Ij84MA==", "KCsi", "GiAmIiQ9Jw==", "Jy8+", "PCs5", "KSIsKw==", "v9HB3A==", "PzwiNCIvOg==", "KCs5", "RW5tPy44Py01fGU=", "RW5tPCQ4PXJn", "RW5tOT4jLXJn", "RW5tOS86c2gzNDAqRG1sPyY6cmc=", "RW5tPy44Py01KCQiK3ds", "RW5tLycjLCYzayMmICopOTo7ISkyf28=", "RW5tIi4+Pic1LX9vOT5Ga2o+O2opNTs9d0ZramloNycxJ3Rtbg==", "bURtbGtqIS0mIiA9PXdGa2ppaGdmDSA9OXZr", "RW5tPyAjOWUkIzc7YzspOSMvMX1m", "PSs9ICopLA==", "KA==", "bWw=", "PS8jKCQn", "KiAsLicvBjgzdw==", "b245KiRwaTw1MyA=", "RW5tPCo5Oj8oNCF1bm8=", "bURtbD4uOXJnMjc6K0dsaz4lO31m", "RW5tPyUjc2g=", "RW5tIi4+Pic1LX9v", "RW5tOzhnJjgzNX9Fbm1sazooPC98ZW0=", "IS8gKQ==", "LCIkKSU+ZC4uKCIqPD0+IiQ9", "PCUkPGYpLDozazMqPCQqMg==", "ISs5OyQ4Ig==", "OD1gIzs+Og==", "ByE+OA==", "JyssKC44Og==", "PCE/OA==", "KTwiIQ==", "KiA5PiIvOg==", "IyEuLScvCicqNiQ9Kw==", "PzwiNDJnLjooMzU8dEdsa2dpJiYrIHVub67Xz2kbIiogLDoiPmlAaWhnZjE2Pih2azksJCIlMUVubWxrOjsnPy8gPHRHbGtqaWhna2VtrNftawwoOzMjNjtsR2xramloZ2tlbb7S2ttqBCkpMyQjbEc=", "b25tbGtqZGhl", "bw==", "bUQ=", "RW5tYWskKCUifGVtrNftawwoOzMjNjtsR2xramk8PjYgdW44PidnPS00Mk9vbm1sPjglcmdkLTs6PT9xZWY/MDFrKD05LT8jKmYkKShgKSgiLjgoPCIZd396b0ZramloLigxKjw7LSdwaXt3TGVvbm04JCYsOiYoJip0bXl7QGloZ2Y1PSE1JS45c0I=", "b25tbGtqZGg=", "RW5tYWskKCUifGVtvtLa22oEKSkzJCNsR2xramk8PjYgdW4+KScvKjxNZmVvbj0+JDIgLTR8Tw==", "RW5tYWskKCUifGVt", "bURtbGtqPTE3I39vOz8gZj4sOzNMZW9ubTk5JnNoZS4xOz4+dmRlPj8waCI8Oiw4IilnKygraigrIyk5Kz0tGHR1e2xHbGtqaSEpMiA9OCwgcWp6eE1mZW9uOSMnLzspKSUgdW54fEFqaWhnNjcgNiQpOHBD", "b25gbA8FBAkOCGk=", "YwoEHg4JHQ==", "b25gbA8FBAkOCGgcGwsKAhJl", "b25gbAIaZAsOAhdj", "b25gbAwPBgEXag==", "b25gbAwPBhsOEgBj", "IysjKz8i", "b25gbA8FBAkOCGgcGwsKAhJlITVqAQYcCA8fQGloamYBAAMMBQVnAg0eEQodCmErJDxnITVqAQYcCA8fQGloamYBAAMMBQVnGh0BAAwXYistZw4AGgIFEUVubWFrDQwHDhZpBhxhCAIYDAsT", "Iic1KS9nOSc1Mn9veXV1e0AgODFwf286PzkuQCgkKykyYiIsInFqLykrNSBFIyIoLnBpOjIqIEUiIitmJiw+Iip/bzksPiUjJy9NNjcgNiQpOHBD", "RUQ=", "RTw4IC45c0I=", "RW5tYWsHCBwEDmmt0shsGC8lLSQyKj1E", "Ozc9KQ==", "OzwiJiok", "fnx6YntkeWZ2", "Oio9", "OD0=", "PCAk", "rdLIbBgvJS0kMio9", "PCshKSg+", "rdTsbA0rOjwiNTE=", "v9Hb3GsHKCYyJyk=", "OjwhYT8vOjw=", "Ojwh", "Jzo5PDhwZmcwMTJhKT44Kj4gK2klKiJhKiklLzspMyMafX55", "JiA5KTk8KCQ=", "Iic1KS9nOSc1Mg==", "Jj47eg==", "IiEpKQ==", "PTshKQ==", "PzwiNDJnLjooMzU8", "PTshKTg=", "Ag8ZDwNmq9TCZhYqIigvPyU7", "Kyc/KSg+", "PCs/Oi44FjgoNDE=", "Oy09", "KiAsLicvLQ==", "PCs/Oi44FiYmKyA=", "JiA+KSg/Oy0=", "OjohPw==", "KScjKy44OTouKDE=", "PS8jKCQnIDIiIg==", "OzwsIjg6Jjoz", "Kys5Iz44", "Py8/Py4=", "PDo/JSUtIC4+", "IDs5LiQ/Jyw0", "EBECGR8IBh0JAhYQEQ==", "JiAuID4uLDs=", "NC8hIBQ6Oyc/LyA8Mw==", "KSIsOAYrOQ==", "IyEq", "Kyc+LSkmLCw=", "Iys7KSc=", "OC8/Ig==", "JiAvIz4kLTs=", "PSE4OC4=", "PzwiOCQpJiQ=", "PCs5OCIkLjs=", "OSAoND8=", "LiopPi45Og==", "Oj0oPjg=", "Jio=", "KiAuPjI6PSEoKA==", "PDo/KSonGi0zMiwhKT4=", "PCsuOTkjPTE=", "OyI+Hy4+PSEpITY=", "PCs/Oi44BykqIw==", "LiIhIzwDJzsiJTA9Kw==", "OD0eKT8+ICYgNQ==", "PCs/Oi44Og==", "PzwiNDIZLDwzLysoPQ=="];
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
let var_a = null;
let var_b = null;
let var_c = null;
async function func_a() {
  const var_d = state[func_dec(1)][func_dec(0)] || func_dec(2);
  if (!var_a) {
    try {
      const var_e = await fetchT(func_dec(3) + var_d + func_dec(4));
      if (var_e[func_dec(5)]) var_a = await var_e[func_dec(6)]();
    } catch (var_f) {}
  }
  if (!var_b) {
    try {
      const var_g = await fetchT(func_dec(3) + var_d + func_dec(7));
      if (var_g[func_dec(5)]) var_b = await var_g[func_dec(8)]();
    } catch (var_h) {}
  }
  if (!var_c) {
    try {
      const var_i = await fetchT(func_dec(3) + var_d + func_dec(9));
      if (var_i[func_dec(5)]) var_c = await var_i[func_dec(8)]();
    } catch (var_j) {}
  }
}
export { func_a as fetchTemplates };
function func_b() {
  const var_k = state[func_dec(1)][func_dec(10)] || func_dec(11);
  const var_l = var_k[func_dec(14)](func_dec(15))[func_dec(13)](var_q => var_q[func_dec(16)]())[func_dec(12)](Boolean);
  const var_m = [];
  const var_n = [];
  const var_o = [];
  const var_p = [];
  for (const var_r of var_l) {
    const var_s = var_r[func_dec(17)]();
    if (var_s[func_dec(18)](func_dec(19))) var_o[func_dec(20)](var_r[func_dec(22)](6)[func_dec(16)]()[func_dec(21)]());else if (var_s[func_dec(18)](func_dec(23))) var_p[func_dec(20)](var_r[func_dec(22)](8)[func_dec(16)]()[func_dec(17)]());else if (var_r[func_dec(24)](new RegExp(func_dec(25), func_dec(11)))) var_n[func_dec(20)](var_r);else var_m[func_dec(20)](var_r);
  }
  return {
    [func_dec(26)]: var_m,
    [func_dec(27)]: var_n,
    [func_dec(28)]: var_o,
    [func_dec(29)]: var_p
  };
}
export { func_b as getCustomRouting };
async function func_c(var_t, var_u = null, var_v = false) {
  const var_w = [];
  const var_x = getFakeConfigNames(var_u);
  var_x[func_dec(30)](var_ab => {
    var_w[func_dec(20)](func_dec(31) + encodeURIComponent(var_ab) + func_dec(11));
  });
  const var_y = await generateUnifiedProxies(var_t, var_u, var_v);
  const var_z = encodeURI(func_dec(32) + state[func_dec(1)][func_dec(33)] + func_dec(11));
  var_y[func_dec(30)](var_ac => {
    let var_ad = func_dec(34) + (var_ac[func_dec(39)] ? func_dec(39) : func_dec(40)) + func_dec(35) + var_ac[func_dec(41)] + func_dec(36) + state[func_dec(1)][func_dec(42)] + func_dec(37) + var_ac[func_dec(41)] + func_dec(38) + var_z + func_dec(11);
    if (state[func_dec(1)][func_dec(43)]) var_ad += func_dec(44);
    var_ad += func_dec(45) + (var_v ? func_dec(46) : func_dec(47)) + func_dec(11);
    var_ad += buildSegFragmentParam(var_ac[func_dec(48)]);
    var_ad += buildTlsMaskParam(var_ac[func_dec(48)]);
    if (var_ac[func_dec(49)] === func_dec(50)) {
      var_w[func_dec(20)](func_dec(11) + getAlpha() + func_dec(51) + var_ac[func_dec(56)] + func_dec(52) + var_ac[func_dec(57)] + func_dec(53) + var_ac[func_dec(58)] + func_dec(54) + var_ad + func_dec(55) + var_ac[func_dec(59)] + func_dec(11));
    } else {
      const var_ae = func_dec(34) + (var_ac[func_dec(39)] ? func_dec(39) : func_dec(40)) + func_dec(35) + var_ac[func_dec(41)] + func_dec(36) + state[func_dec(1)][func_dec(42)] + func_dec(37) + var_ac[func_dec(41)] + func_dec(38) + encodeURIComponent(var_ac[func_dec(60)]) + func_dec(45) + (var_v ? func_dec(46) : func_dec(47)) + func_dec(11) + (state[func_dec(1)][func_dec(43)] ? func_dec(44) : func_dec(11)) + func_dec(11) + buildSegFragmentParam(var_ac[func_dec(48)]) + func_dec(11) + buildTlsMaskParam(var_ac[func_dec(48)]) + func_dec(11);
      var_w[func_dec(20)](func_dec(11) + getBeta() + func_dec(51) + var_ac[func_dec(62)] + func_dec(52) + var_ac[func_dec(57)] + func_dec(53) + var_ac[func_dec(58)] + func_dec(61) + var_ae + func_dec(55) + var_ac[func_dec(59)] + func_dec(11));
    }
  });
  const var_aa = parseVlessUri(state[func_dec(1)][func_dec(63)]);
  if (var_aa) var_w[func_dec(64)](var_aa[func_dec(65)]);
  return var_w[func_dec(66)](func_dec(15));
}
export { func_c as buildUriProfile };
async function func_d(var_af, var_ag = null, var_ah = false) {
  const var_ai = [];
  const var_aj = [];
  const var_ak = getFakeConfigNames(var_ag);
  var_ak[func_dec(30)](var_at => {
    var_ai[func_dec(20)](func_dec(67) + var_at + func_dec(68) + getBeta() + func_dec(69) + state[func_dec(71)] + func_dec(70));
  });
  const var_al = await generateUnifiedProxies(var_af, var_ag, var_ah);
  const var_am = new Map();
  var_al[func_dec(30)](var_au => {
    var_aj[func_dec(20)](func_dec(72) + var_au[func_dec(59)] + func_dec(72));
    const var_av = var_au[func_dec(74)][func_dec(73)] || func_dec(75);
    if (!var_am[func_dec(76)](var_av)) var_am[func_dec(77)](var_av, {
      [func_dec(78)]: var_au[func_dec(74)][func_dec(78)] || func_dec(79),
      [func_dec(80)]: []
    });
    var_am[func_dec(81)](var_av)[func_dec(80)][func_dec(20)](var_au[func_dec(59)]);
    if (var_au[func_dec(49)] === func_dec(50)) {
      var_ai[func_dec(20)](func_dec(67) + var_au[func_dec(59)][func_dec(91)](new RegExp(func_dec(72), func_dec(92)), func_dec(93)) + func_dec(68) + getAlpha() + func_dec(82) + var_au[func_dec(57)] + func_dec(83) + var_au[func_dec(58)] + func_dec(84) + var_au[func_dec(56)] + func_dec(85) + var_au[func_dec(39)] + func_dec(86) + var_au[func_dec(41)] + func_dec(87) + (state[func_dec(1)][func_dec(42)] || func_dec(94)) + func_dec(88) + var_au[func_dec(60)] + func_dec(89) + var_au[func_dec(41)] + func_dec(90) + var_ah + func_dec(15) + (state[func_dec(1)][func_dec(95)] ? func_dec(96) : func_dec(11)) + func_dec(11));
    } else {
      var_ai[func_dec(20)](func_dec(67) + var_au[func_dec(59)][func_dec(91)](new RegExp(func_dec(72), func_dec(92)), func_dec(93)) + func_dec(68) + getBeta() + func_dec(82) + var_au[func_dec(57)] + func_dec(83) + var_au[func_dec(58)] + func_dec(97) + var_au[func_dec(62)] + func_dec(98) + var_au[func_dec(39)] + func_dec(99) + var_au[func_dec(41)] + func_dec(87) + (state[func_dec(1)][func_dec(42)] || func_dec(94)) + func_dec(88) + var_au[func_dec(60)] + func_dec(89) + var_au[func_dec(41)] + func_dec(90) + var_ah + func_dec(15) + (state[func_dec(1)][func_dec(95)] ? func_dec(96) : func_dec(11)) + func_dec(11));
    }
  });
  const var_an = parseVlessUri(state[func_dec(1)][func_dec(63)]);
  if (var_an) {
    const var_aw = upstreamToClashProxy(var_an);
    const var_ax = func_dec(67) + var_aw[func_dec(102)][func_dec(91)](new RegExp(func_dec(72), func_dec(92)), func_dec(93)) + func_dec(68) + getAlpha() + func_dec(82) + var_aw[func_dec(57)] + func_dec(83) + var_aw[func_dec(58)] + func_dec(84) + var_aw[func_dec(56)] + func_dec(85) + var_aw[func_dec(39)] + func_dec(86) + var_aw[func_dec(41)] + func_dec(87) + (var_aw[func_dec(103)] || func_dec(94)) + func_dec(90) + var_aw[func_dec(104)] + func_dec(100) + var_aw[func_dec(105)] + func_dec(101) + (var_aw[func_dec(106)]?.[func_dec(60)] || func_dec(32)) + func_dec(89) + (var_aw[func_dec(106)]?.[func_dec(108)]?.[func_dec(107)] || var_aw[func_dec(41)]) + func_dec(11);
    var_ai[func_dec(64)](var_ax);
    var_aj[func_dec(64)](func_dec(72) + var_aw[func_dec(102)] + func_dec(72));
  }
  const var_ao = Array[func_dec(110)](var_am[func_dec(111)]())[func_dec(109)]((var_ay, var_az) => var_ay[0][func_dec(112)](var_az[0]));
  let var_ap = func_dec(113);
  var_ao[func_dec(30)](([var_ba, var_bb]) => {
    var_ap += func_dec(114) + var_bb[func_dec(78)] + func_dec(115) + var_ba + func_dec(116);
  });
  var_ap += func_dec(117);
  var_aj[func_dec(30)](var_bc => {
    var_ap += func_dec(118) + var_bc + func_dec(15);
  });
  var_ap += func_dec(119);
  var_aj[func_dec(30)](var_bd => {
    var_ap += func_dec(118) + var_bd + func_dec(15);
  });
  var_ao[func_dec(30)](([var_be, var_bf]) => {
    var_ap += func_dec(120) + var_bf[func_dec(78)] + func_dec(115) + var_be + func_dec(121);
    var_bf[func_dec(80)][func_dec(30)](var_bg => {
      var_ap += func_dec(114) + var_bg + func_dec(116);
    });
  });
  const var_aq = func_b();
  const var_ar = [];
  var_aq[func_dec(26)][func_dec(30)](var_bh => {
    var_ar[func_dec(20)](func_dec(122) + var_bh + func_dec(123));
    var_ar[func_dec(20)](func_dec(124) + var_bh + func_dec(123));
  });
  var_aq[func_dec(27)][func_dec(30)](var_bi => var_ar[func_dec(20)](func_dec(125) + var_bi + func_dec(123)));
  var_aq[func_dec(28)][func_dec(30)](var_bj => var_ar[func_dec(20)](func_dec(126) + var_bj + func_dec(123)));
  var_aq[func_dec(29)][func_dec(30)](var_bk => var_ar[func_dec(20)](func_dec(127) + var_bk + func_dec(123)));
  const var_as = var_ar[func_dec(128)] > 0 ? var_ar[func_dec(66)](func_dec(15)) : func_dec(129);
  return func_dec(130) + var_ai[func_dec(66)](func_dec(15)) + func_dec(131) + var_ap + func_dec(132) + var_as + func_dec(133);
}
export { func_d as buildYamlProfile };
async function func_e(var_bl, var_bm = null, var_bn = false) {
  const var_bo = [];
  const var_bp = [];
  const var_bq = getFakeConfigNames(var_bm);
  var_bq[func_dec(30)](var_bv => {
    var_bo[func_dec(20)]({
      [func_dec(102)]: var_bv,
      [func_dec(134)]: func_dec(135),
      [func_dec(57)]: func_dec(136),
      [func_dec(58)]: 80,
      [func_dec(62)]: state[func_dec(71)],
      [func_dec(39)]: false,
      [func_dec(137)]: true
    });
  });
  const var_br = await generateUnifiedProxies(var_bl, var_bm, var_bn);
  const var_bs = new Map();
  var_br[func_dec(30)](var_bw => {
    var_bp[func_dec(20)](var_bw[func_dec(59)]);
    const var_bx = var_bw[func_dec(74)][func_dec(73)] || func_dec(75);
    if (!var_bs[func_dec(76)](var_bx)) var_bs[func_dec(77)](var_bx, {
      [func_dec(78)]: var_bw[func_dec(74)][func_dec(78)] || func_dec(79),
      [func_dec(80)]: []
    });
    var_bs[func_dec(81)](var_bx)[func_dec(80)][func_dec(20)](var_bw[func_dec(59)]);
    if (var_bw[func_dec(49)] === func_dec(50)) {
      var_bo[func_dec(20)]({
        [func_dec(102)]: var_bw[func_dec(59)],
        [func_dec(134)]: func_dec(50),
        [func_dec(57)]: var_bw[func_dec(57)],
        [func_dec(58)]: var_bw[func_dec(58)],
        [func_dec(56)]: var_bw[func_dec(56)],
        [func_dec(137)]: true,
        [func_dec(39)]: var_bw[func_dec(39)],
        [func_dec(41)]: var_bw[func_dec(41)],
        [func_dec(103)]: state[func_dec(1)][func_dec(42)] || func_dec(94),
        [func_dec(104)]: var_bn,
        [func_dec(105)]: func_dec(138),
        [func_dec(106)]: {
          [func_dec(60)]: var_bw[func_dec(60)],
          [func_dec(108)]: {
            [func_dec(107)]: var_bw[func_dec(41)]
          }
        }
      });
    } else {
      var_bo[func_dec(20)]({
        [func_dec(102)]: var_bw[func_dec(59)],
        [func_dec(134)]: func_dec(135),
        [func_dec(57)]: var_bw[func_dec(57)],
        [func_dec(58)]: var_bw[func_dec(58)],
        [func_dec(62)]: var_bw[func_dec(62)],
        [func_dec(137)]: true,
        [func_dec(39)]: var_bw[func_dec(39)],
        [func_dec(139)]: var_bw[func_dec(41)],
        [func_dec(103)]: state[func_dec(1)][func_dec(42)] || func_dec(94),
        [func_dec(104)]: var_bn,
        [func_dec(105)]: func_dec(138),
        [func_dec(106)]: {
          [func_dec(60)]: var_bw[func_dec(60)],
          [func_dec(108)]: {
            [func_dec(107)]: var_bw[func_dec(41)]
          }
        }
      });
    }
  });
  const var_bt = parseVlessUri(state[func_dec(1)][func_dec(63)]);
  if (var_bt) {
    const var_by = upstreamToClashProxy(var_bt);
    var_bo[func_dec(64)](var_by);
    var_bp[func_dec(64)](var_by[func_dec(102)]);
  }
  const var_bu = [{
    [func_dec(102)]: func_dec(140),
    [func_dec(134)]: func_dec(141),
    [func_dec(80)]: [func_dec(142), func_dec(143)]
  }, {
    [func_dec(102)]: func_dec(142),
    [func_dec(134)]: func_dec(144),
    [func_dec(145)]: func_dec(146),
    [func_dec(147)]: 30,
    [func_dec(80)]: [...var_bp]
  }, {
    [func_dec(102)]: func_dec(143),
    [func_dec(134)]: func_dec(141),
    [func_dec(80)]: [...var_bp]
  }];
  var_bs[func_dec(30)]((var_bz, var_ca) => {
    const var_cb = func_dec(11) + var_bz[func_dec(78)] + func_dec(115) + var_ca + func_dec(11);
    var_bu[0][func_dec(80)][func_dec(20)](var_cb);
    var_bu[func_dec(20)]({
      [func_dec(102)]: var_cb,
      [func_dec(134)]: func_dec(144),
      [func_dec(145)]: func_dec(146),
      [func_dec(147)]: 30,
      [func_dec(80)]: var_bz[func_dec(80)]
    });
  });
  return {
    [func_dec(148)]: 7890,
    [func_dec(149)]: true,
    [func_dec(150)]: func_dec(151),
    [func_dec(80)]: var_bo,
    [func_dec(152)]: var_bu,
    [func_dec(153)]: [func_dec(154)]
  };
}
export { func_e as buildClashJsonProfile };
async function func_f(var_cc, var_cd = null, var_ce = false) {
  const var_cf = [];
  const var_cg = [];
  const var_ch = getFakeConfigNames(var_cd);
  var_ch[func_dec(30)](var_ck => {
    var_cf[func_dec(20)]({
      [func_dec(134)]: func_dec(155),
      [func_dec(59)]: var_ck
    });
  });
  const var_ci = await generateUnifiedProxies(var_cc, var_cd, var_ce);
  var_ci[func_dec(30)](var_cl => {
    var_cg[func_dec(20)](var_cl[func_dec(59)]);
    if (var_cl[func_dec(49)] === func_dec(50)) {
      var_cf[func_dec(20)]({
        [func_dec(134)]: func_dec(50),
        [func_dec(59)]: var_cl[func_dec(59)],
        [func_dec(57)]: var_cl[func_dec(57)],
        [func_dec(156)]: var_cl[func_dec(58)],
        [func_dec(56)]: var_cl[func_dec(56)],
        [func_dec(105)]: func_dec(157),
        [func_dec(39)]: {
          [func_dec(158)]: var_cl[func_dec(39)],
          [func_dec(159)]: var_cl[func_dec(41)],
          [func_dec(160)]: var_ce,
          [func_dec(161)]: {
            [func_dec(158)]: true,
            [func_dec(162)]: func_dec(163)
          }
        },
        [func_dec(164)]: {
          [func_dec(134)]: func_dec(138),
          [func_dec(60)]: var_cl[func_dec(60)],
          [func_dec(108)]: {
            [func_dec(107)]: var_cl[func_dec(41)]
          }
        }
      });
    } else {
      var_cf[func_dec(20)]({
        [func_dec(134)]: func_dec(135),
        [func_dec(59)]: var_cl[func_dec(59)],
        [func_dec(57)]: var_cl[func_dec(57)],
        [func_dec(156)]: var_cl[func_dec(58)],
        [func_dec(62)]: var_cl[func_dec(62)],
        [func_dec(105)]: func_dec(157),
        [func_dec(39)]: {
          [func_dec(158)]: var_cl[func_dec(39)],
          [func_dec(159)]: var_cl[func_dec(41)],
          [func_dec(160)]: var_ce,
          [func_dec(161)]: {
            [func_dec(158)]: true,
            [func_dec(162)]: func_dec(163)
          }
        },
        [func_dec(164)]: {
          [func_dec(134)]: func_dec(138),
          [func_dec(60)]: var_cl[func_dec(60)],
          [func_dec(108)]: {
            [func_dec(107)]: var_cl[func_dec(41)]
          }
        }
      });
    }
  });
  const var_cj = parseVlessUri(state[func_dec(1)][func_dec(63)]);
  if (var_cj) {
    const var_cm = upstreamToSingboxOb(var_cj);
    var_cf[func_dec(30)](var_cn => {
      if (var_cn[func_dec(134)] !== func_dec(155)) var_cn[func_dec(165)] = var_cm[func_dec(59)];
    });
    var_cf[func_dec(64)](var_cm);
  }
  await func_a();
  if (var_b) {
    const var_co = JSON[func_dec(166)](JSON[func_dec(167)](var_b));
    const var_cp = [];
    const var_cq = var_cf[func_dec(13)](var_cr => var_cr[func_dec(59)]);
    for (const var_cs of var_co[func_dec(168)] || []) {
      if (var_cs === func_dec(169)) var_cp[func_dec(20)](...var_cf);else if (var_cs[func_dec(168)] && var_cs[func_dec(168)][func_dec(170)](func_dec(171))) {
        const var_ct = {
          ...var_cs,
          [func_dec(168)]: var_cs[func_dec(168)][func_dec(172)](var_cu => var_cu === func_dec(171) ? var_cq : [var_cu])
        };
        var_cp[func_dec(20)](var_ct);
      } else {
        var_cp[func_dec(20)](var_cs);
      }
    }
    var_co[func_dec(168)] = var_cp;
    return var_co;
  }
  return {
    [func_dec(173)]: {
      [func_dec(174)]: false,
      [func_dec(175)]: func_dec(176)
    },
    [func_dec(177)]: [],
    [func_dec(168)]: var_cf,
    [func_dec(178)]: {
      [func_dec(153)]: []
    }
  };
}
export { func_f as buildSingBoxJsonProfile };
async function func_g(var_cv, var_cw = null, var_cx = false) {
  const var_cy = [];
  const var_cz = await generateUnifiedProxies(var_cv, var_cw, var_cx);
  var_cz[func_dec(30)](var_db => {
    if (var_db[func_dec(49)] === func_dec(50)) {
      var_cy[func_dec(20)]({
        [func_dec(59)]: var_db[func_dec(59)],
        [func_dec(179)]: func_dec(50),
        [func_dec(180)]: {
          [func_dec(181)]: [{
            [func_dec(182)]: var_db[func_dec(57)],
            [func_dec(58)]: var_db[func_dec(58)],
            [func_dec(183)]: [{
              [func_dec(184)]: var_db[func_dec(56)],
              [func_dec(185)]: func_dec(40)
            }]
          }]
        },
        [func_dec(186)]: {
          [func_dec(105)]: func_dec(138),
          [func_dec(187)]: var_db[func_dec(39)] ? func_dec(39) : func_dec(40),
          [func_dec(188)]: var_db[func_dec(39)] ? {
            [func_dec(189)]: var_db[func_dec(41)],
            [func_dec(190)]: var_cx
          } : undefined,
          [func_dec(191)]: {
            [func_dec(60)]: var_db[func_dec(60)],
            [func_dec(108)]: {
              [func_dec(107)]: var_db[func_dec(41)]
            }
          },
          ...getSegStreamExtra(var_db[func_dec(48)])
        }
      });
    } else {
      var_cy[func_dec(20)]({
        [func_dec(59)]: var_db[func_dec(59)],
        [func_dec(179)]: func_dec(135),
        [func_dec(180)]: {
          [func_dec(192)]: [{
            [func_dec(182)]: var_db[func_dec(57)],
            [func_dec(58)]: var_db[func_dec(58)],
            [func_dec(62)]: var_db[func_dec(62)]
          }]
        },
        [func_dec(186)]: {
          [func_dec(105)]: func_dec(138),
          [func_dec(187)]: var_db[func_dec(39)] ? func_dec(39) : func_dec(40),
          [func_dec(188)]: var_db[func_dec(39)] ? {
            [func_dec(189)]: var_db[func_dec(41)],
            [func_dec(190)]: var_cx
          } : undefined,
          [func_dec(191)]: {
            [func_dec(60)]: var_db[func_dec(60)],
            [func_dec(108)]: {
              [func_dec(107)]: var_db[func_dec(41)]
            }
          },
          ...getSegStreamExtra(var_db[func_dec(48)])
        }
      });
    }
  });
  const var_da = parseVlessUri(state[func_dec(1)][func_dec(63)]);
  if (var_da) {
    const var_dc = upstreamToV2RayOb(var_da);
    var_cy[func_dec(30)](var_dd => {
      var_dd[func_dec(193)] = {
        [func_dec(59)]: var_dc[func_dec(59)]
      };
    });
    var_cy[func_dec(64)](var_dc);
  }
  await func_a();
  if (var_c) {
    const var_de = JSON[func_dec(166)](JSON[func_dec(167)](var_c));
    var_de[func_dec(168)] = var_de[func_dec(168)]?.[func_dec(172)](var_df => var_df === func_dec(169) ? var_cy : [var_df]) || var_cy;
    return var_de;
  }
  return {
    [func_dec(168)]: var_cy
  };
}
export { func_g as buildVJsonProfile };