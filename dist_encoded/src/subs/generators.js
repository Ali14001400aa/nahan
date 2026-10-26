// @ts-nocheck
import { state, fetchT, getAlpha, getBeta } from "../config.js";
import { getFakeConfigNames, generateUnifiedProxies, parseVlessUri, upstreamToClashProxy, upstreamToSingboxOb, upstreamToV2RayOb, buildSegFragmentParam, buildTlsMaskParam, getSegStreamExtra } from "./transformers.js";
const _0x_key = 79;
const _0x_tbl = ["IyEq", "Iys7KSc=", "JiArIw==", "OycgKTg+KCU3", "KyA+", "PCs/Oi44Og==", "Oy8q", "KCEiKycv", "LiopPi45Og==", "OyI+dmRlcWZ/aH1hdg==", "Kys5Iz44", "PCshKSg+", "IyEuLSc=", "fXx+Yn5kfGZy", "Kyc/KSg+", "PTshKTg=", "IDs5LiQ/Jyw=", "LiA0", "PCs/Oi44", "KScjLSc=", "PDo/LT8vLjE=", "PzwoKi44FiE3MHE=", "ID45JSYjOjwuJQ==", "PSs7KTk5LBcqJzU/JyMr", "JiAvIz4kLTs=", "Ozc9KQ==", "Iic1KS8=", "Iic1KS9nICY=", "Iyc+OC4k", "fnx6YntkeWZ2", "Iyc+OC4kFjgoNDE=", "PCs5EzgzOjwiKxo/PCI0Mg==", "IDs5LiQ/Jyw0", "EBECGR8IBh0JAhYQEQ==", "PSE4OC4=", "Jj4SJTgVOTouMCQ7Kw==", "PzwiOCQpJiQ=", "Li05JSQk", "JycnLSghZCwpNQ==", "Ljs5IxQuLDwiJTEQJyM4LjgvKSQj", "KjY9KTkjJC0pMiQj", "LC8uJC4VLyErIw==", "KiAsLicvLQ==", "Py85JA==", "LC8uJC5kLSo=", "PDoiPi4VLSY0", "LCIsPyMVKDgu", "KjY5KTkkKCQYJSohOj8jJyYsOg==", "fnx6YntkeWZ2fHx/d30=", "Li0uKTg5FisoKDE9ISETKiYlJzAZKj0nKiUl", "ZQ==", "Li0uKTg5FisoKDE9ISETKiYlJzAZNT0nOy0/LxYmIjIyIDwm", "IyEqIC48LCQ=", "OC8/IiIkLg==", "PCEuJzhnICY=", "PyE/OA==", "PCEuJzg=", "PCs5OCIkLjs=", "Ljs5JA==", "ISEsOT8i", "Oio9", "PCAkKi0jJy8=", "Kys+OAQ8LDo1LyEq", "Jzo5PA==", "OyI+", "PjskLw==", "Jzo5PGYjJw==", "PSE4OCIkLg==", "KyEgLSIkGjw1JzEqKTQ=", "Dj0EPw==", "KScoIC8=", "IDs5LiQ/JywTJyI=", "LSIiLyA=", "LSc5OCQ4Oy0pMg==", "Jj4=", "KCsiJTtwOTouMCQ7Kw==", "KCsiJTtwKiY=", "KyEgLSIk", "KCsiPyI+LHIkKA==", "KCc5JD4oGy03KQ==", "PDc+DyQkLyEg", "Jjo+NS4oLCMvI2ohLyUtJQ==", "Jzo5PDhwZmc1JzJhKSQ4Iz8rPTQjNywhIzguJD1mJCkoYA==", "YCMsJSVlKiQmNS1hNyAg", "ICU=", "Oys1OA==", "YCMsJSVlOiEpIScgNmMmOCUn", "JT0iIg==", "YCMsJSVlP2YtNSoh", "LDs+OCQnGycyMiwhKQ==", "", "KSchOC44", "Ii89", "PD4hJT8=", "RQ==", "OzwkIQ==", "OyEBIzwvOwsmNSA=", "PDosPj85HiEzLg==", "KCsiJTtw", "Pzs+JA==", "OyEYPDsvOwsmNSA=", "PDsvPz84ICYg", "KCsiPyI+LHI=", "Ii85LyM=", "ERV9YXIWZxRofBhkag==", "KyEgLSIkOg==", "Jj4+", "KCsiJTs5", "KCsiPyI+LDs=", "KSE/CSopIQ==", "OzwiJiokc2dodnV/fn18e3pkeHd2dWJ+fXx7Z3l4d3Zof359fHt6eXh3dnV/Dnx+fGR5ZndodHV/fXR7dTotJDM3Jjo0cSUlJy1k", "YA==", "Lj4kHiQ/PS0=", "PCsuOTkjPTF6", "aT0jJXY=", "aSg9cQ==", "aTo0PC53PjthLio8OnA=", "aT4sOCN3", "ISEjKQ==", "PCs/Oi44JykqIw==", "LikoIj8=", "KiAsLicvBjgzdA==", "aT4vJ3YvJyklKiAr", "aS8hICQ9ACY0IyY6PChx", "fg==", "fw==", "PzwiKiImLA==", "PzwiOCQ=", "OSIoPzg=", "dWFi", "Dw==", "dQ==", "cCsjLzkzOTwuKStyICIiLmw=", "bA==", "OjskKA==", "cA==", "Py8+PzwlOyw=", "Oj4+ODkvKCUSNCw=", "OiA+JCIsPQ==", "PS86", "JSEkIg==", "Ym4jLSYvc2hl", "bURtbD8zOS19Zg==", "RW5tPy44Py01fGV+fHpie2R5ZnZMZW8+Ij4/cGlwd0xlbz4sPzg9JjojfGVt", "bURtbD4uOXJnMjc6K0dsaz4lO31mIy4iPik=", "Li05JT0vDS0xLyYqByk=", "bQ==", "LCE4Ij84MA==", "KCsi", "GiAmIiQ9Jw==", "Jy8+", "PCs5", "KSIsKw==", "v9HB3A==", "PzwiNCIvOg==", "KCs5", "RW5tPy44Py01fGU=", "RW5tPCQ4PXJn", "RW5tOT4jLXJn", "RW5tOS86c2gzNDAqRG1sPyY6cmc=", "RW5tPy44Py01KCQiK3ds", "RW5tLycjLCYzayMmICopOTo7ISkyf28=", "RW5tIi4+Pic1LX9vOT5Ga2o+O2opNTs9d0ZramloNycxJ3Rtbg==", "bURtbGtqIS0mIiA9PXdGa2ppaGdmDSA9OXZr", "RW5tPyAjOWUkIzc7YzspOSMvMX1m", "PSs9ICopLA==", "KA==", "bWw=", "PS8jKCQn", "KiAsLicvBjgzdw==", "b245KiRwaTw1MyA=", "RW5tPCo5Oj8oNCF1bm8=", "bURtbD4uOXJnMjc6K0dsaz4lO31m", "RW5tPyUjc2g=", "RW5tIi4+Pic1LX9v", "RW5tOzhnJjgzNX9Fbm1sazooPC98ZW0=", "IS8gKQ==", "LCIkKSU+ZC4uKCIqPD0+IiQ9", "PCUkPGYpLDozazMqPCQqMg==", "ISs5OyQ4Ig==", "OD1gIzs+Og==", "ByE+OA==", "JyssKC44Og==", "PCE/OA==", "KTwiIQ==", "KiA5PiIvOg==", "IyEuLScvCicqNiQ9Kw==", "PzwiNDJnLjooMzU8dEdsa2dpJiYrIHVub67Xz2kbIiogLDoiPmlAaWhnZjE2Pih2azksJCIlMUVubWxrOjsnPy8gPHRHbGtqaWhna2VtrNftawwoOzMjNjtsR2xramloZ2tlbb7S2ttqBCkpMyQjbEc=", "b25tbGtqZGhl", "bw==", "bUQ=", "RW5tYWskKCUifGVtrNftawwoOzMjNjtsR2xramk8PjYgdW44PidnPS00Mk9vbm1sPjglcmdkLTs6PT9xZWY/MDFrKD05LT8jKmYkKShgKSgiLjgoPCIZd396b0ZramloLigxKjw7LSdwaXt3TGVvbm04JCYsOiYoJip0bXl7QGloZ2Y1PSE1JS45c0I=", "b25tbGtqZGg=", "RW5tYWskKCUifGVtvtLa22oEKSkzJCNsR2xramk8PjYgdW4+KScvKjxNZmVvbj0+JDIgLTR8Tw==", "RW5tYWskKCUifGVt", "bURtbGtqPTE3I39vOz8gZj4sOzNMZW9ubTk5JnNoZS4xOz4+dmRlPj8waCI8Oiw4IilnKygraigrIyk5Kz0tGHR1e2xHbGtqaSEpMiA9OCwgcWp6eE1mZW9uOSMnLzspKSUgdW54fEFqaWhnNjcgNiQpOHBD", "b25gbA8FBAkOCGk=", "YwoEHg4JHQ==", "b25gbA8FBAkOCGgcGwsKAhJl", "b25gbAIaZAsOAhdj", "b25gbAwPBgEXag==", "b25gbAwPBhsOEgBj", "IysjKz8i", "b25gbA8FBAkOCGgcGwsKAhJlITVqAQYcCA8fQGloamYBAAMMBQVnAg0eEQodCmErJDxnITVqAQYcCA8fQGloamYBAAMMBQVnGh0BAAwXYistZw4AGgIFEUVubWFrDQwHDhZpBhxhCAIYDAsT", "Iic1KS9nOSc1Mn9veXV1e0AgODFwf286PzkuQCgkKykyYiIsInFqLykrNSBFIyIoLnBpOjIqIEUiIitmJiw+Iip/bzksPiUjJy9NNjcgNiQpOHBD", "RUQ=", "RTw4IC45c0I=", "RW5tYWsHCBwEDmmt0shsGC8lLSQyKj1E", "OzwiJiok", "OD0=", "PCAk", "rdLIbBgvJS0kMio9", "rdTsbA0rOjwiNTE=", "v9Hb3GsHKCYyJyk=", "OjwhYT8vOjw=", "Ojwh", "Jzo5PDhwZmcwMTJhKT44Kj4gK2klKiJhKiklLzspMyMafX55", "JiA5KTk8KCQ=", "Iic1KS9nOSc1Mg==", "Jj47eg==", "IiEpKQ==", "PTshKQ==", "PzwiNDJnLjooMzU8", "Ag8ZDwNmq9TCZhYqIigvPyU7", "PCs/Oi44FjgoNDE=", "Oy09", "PCs/Oi44FiYmKyA=", "JiA+KSg/Oy0=", "OjohPw==", "KScjKy44OTouKDE=", "PS8jKCQnIDIiIg==", "OzwsIjg6Jjoz", "Py8/Py4=", "PDo/JSUtIC4+", "JiAuID4uLDs=", "NC8hIBQ6Oyc/LyA8Mw==", "KSIsOAYrOQ==", "Kyc+LSkmLCw=", "OC8/Ig==", "OSAoND8=", "Oj0oPjg=", "Jio=", "KiAuPjI6PSEoKA==", "PDo/KSonGi0zMiwhKT4=", "PCsuOTkjPTE=", "OyI+Hy4+PSEpITY=", "PCs/Oi44BykqIw==", "LiIhIzwDJzsiJTA9Kw==", "OD0eKT8+ICYgNQ==", "PzwiNDIZLDwzLysoPQ=="];
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
const var_a = {
  [func_dec(0)]: {
    [func_dec(1)]: func_dec(2),
    [func_dec(3)]: true
  },
  [func_dec(4)]: {
    [func_dec(5)]: [{
      [func_dec(6)]: func_dec(7),
      [func_dec(8)]: func_dec(9),
      [func_dec(10)]: func_dec(11)
    }, {
      [func_dec(6)]: func_dec(12),
      [func_dec(8)]: func_dec(13),
      [func_dec(10)]: func_dec(14)
    }],
    [func_dec(15)]: [{
      [func_dec(16)]: [func_dec(17)],
      [func_dec(18)]: func_dec(12)
    }],
    [func_dec(19)]: func_dec(7),
    [func_dec(20)]: func_dec(21),
    [func_dec(22)]: true,
    [func_dec(23)]: true
  },
  [func_dec(24)]: [{
    [func_dec(25)]: func_dec(26),
    [func_dec(6)]: func_dec(27),
    [func_dec(28)]: func_dec(29),
    [func_dec(30)]: 2080,
    [func_dec(31)]: false
  }],
  [func_dec(32)]: [func_dec(33)],
  [func_dec(34)]: {
    [func_dec(15)]: [{
      [func_dec(35)]: true,
      [func_dec(16)]: func_dec(14)
    }, {
      [func_dec(36)]: func_dec(4),
      [func_dec(37)]: func_dec(38)
    }, {
      [func_dec(37)]: func_dec(34),
      [func_dec(16)]: func_dec(11)
    }],
    [func_dec(19)]: func_dec(11),
    [func_dec(39)]: true
  },
  [func_dec(40)]: {
    [func_dec(41)]: {
      [func_dec(42)]: true,
      [func_dec(43)]: func_dec(44),
      [func_dec(45)]: true
    },
    [func_dec(46)]: {
      [func_dec(47)]: func_dec(48),
      [func_dec(49)]: [func_dec(50)],
      [func_dec(51)]: true
    }
  }
};
const var_b = {
  [func_dec(0)]: {
    [func_dec(52)]: func_dec(53)
  },
  [func_dec(24)]: [{
    [func_dec(6)]: func_dec(54),
    [func_dec(55)]: 10808,
    [func_dec(28)]: func_dec(29),
    [func_dec(36)]: func_dec(56),
    [func_dec(57)]: {
      [func_dec(58)]: func_dec(59),
      [func_dec(60)]: true
    },
    [func_dec(61)]: {
      [func_dec(42)]: true,
      [func_dec(62)]: [func_dec(63), func_dec(64), func_dec(65)]
    }
  }, {
    [func_dec(6)]: func_dec(66),
    [func_dec(55)]: 10809,
    [func_dec(28)]: func_dec(29),
    [func_dec(36)]: func_dec(63),
    [func_dec(57)]: {
      [func_dec(58)]: func_dec(59)
    },
    [func_dec(61)]: {
      [func_dec(42)]: true,
      [func_dec(62)]: [func_dec(63), func_dec(64), func_dec(65)]
    }
  }],
  [func_dec(32)]: [func_dec(33)],
  [func_dec(67)]: {
    [func_dec(68)]: func_dec(69),
    [func_dec(15)]: [{
      [func_dec(25)]: func_dec(70),
      [func_dec(71)]: func_dec(72),
      [func_dec(36)]: [func_dec(73)]
    }, {
      [func_dec(25)]: func_dec(70),
      [func_dec(71)]: func_dec(14),
      [func_dec(74)]: [func_dec(75), func_dec(76)],
      [func_dec(77)]: [func_dec(78)]
    }],
    [func_dec(20)]: func_dec(15)
  }
};
let var_c = null;
let var_d = var_a;
let var_e = var_b;
async function func_a() {
  const var_f = state[func_dec(80)][func_dec(79)] || func_dec(81);
  if (!var_c) {
    try {
      const var_g = await fetchT(func_dec(82) + var_f + func_dec(83));
      if (var_g[func_dec(84)]) var_c = await var_g[func_dec(85)]();
    } catch (var_h) {}
  }
  try {
    const var_i = await fetchT(func_dec(82) + var_f + func_dec(86));
    if (var_i[func_dec(84)]) var_d = await var_i[func_dec(87)]();
  } catch (var_j) {}
  try {
    const var_k = await fetchT(func_dec(82) + var_f + func_dec(88));
    if (var_k[func_dec(84)]) var_e = await var_k[func_dec(87)]();
  } catch (var_l) {}
}
export { func_a as fetchTemplates };
function func_b() {
  const var_m = state[func_dec(80)][func_dec(89)] || func_dec(90);
  const var_n = var_m[func_dec(93)](func_dec(94))[func_dec(92)](var_s => var_s[func_dec(95)]())[func_dec(91)](Boolean);
  const var_o = [];
  const var_p = [];
  const var_q = [];
  const var_r = [];
  for (const var_t of var_n) {
    const var_u = var_t[func_dec(96)]();
    if (var_u[func_dec(97)](func_dec(98))) var_q[func_dec(99)](var_t[func_dec(101)](6)[func_dec(95)]()[func_dec(100)]());else if (var_u[func_dec(97)](func_dec(102))) var_r[func_dec(99)](var_t[func_dec(101)](8)[func_dec(95)]()[func_dec(96)]());else if (var_t[func_dec(103)](new RegExp(func_dec(104), func_dec(90)))) var_p[func_dec(99)](var_t);else var_o[func_dec(99)](var_t);
  }
  return {
    [func_dec(105)]: var_o,
    [func_dec(106)]: var_p,
    [func_dec(107)]: var_q,
    [func_dec(108)]: var_r
  };
}
export { func_b as getCustomRouting };
async function func_c(var_v, var_w = null, var_x = false) {
  const var_y = [];
  const var_z = getFakeConfigNames(var_w);
  var_z[func_dec(109)](var_ad => {
    var_y[func_dec(99)](func_dec(110) + encodeURIComponent(var_ad) + func_dec(90));
  });
  const var_aa = await generateUnifiedProxies(var_v, var_w, var_x);
  const var_ab = encodeURI(func_dec(111) + state[func_dec(80)][func_dec(112)] + func_dec(90));
  var_aa[func_dec(109)](var_ae => {
    let var_af = func_dec(113) + (var_ae[func_dec(64)] ? func_dec(64) : func_dec(118)) + func_dec(114) + var_ae[func_dec(119)] + func_dec(115) + state[func_dec(80)][func_dec(120)] + func_dec(116) + var_ae[func_dec(119)] + func_dec(117) + var_ab + func_dec(90);
    if (state[func_dec(80)][func_dec(121)]) var_af += func_dec(122);
    var_af += func_dec(123) + (var_x ? func_dec(124) : func_dec(125)) + func_dec(90);
    var_af += buildSegFragmentParam(var_ae[func_dec(126)]);
    var_af += buildTlsMaskParam(var_ae[func_dec(126)]);
    if (var_ae[func_dec(127)] === func_dec(128)) {
      var_y[func_dec(99)](func_dec(90) + getAlpha() + func_dec(129) + var_ae[func_dec(134)] + func_dec(130) + var_ae[func_dec(18)] + func_dec(131) + var_ae[func_dec(55)] + func_dec(132) + var_af + func_dec(133) + var_ae[func_dec(6)] + func_dec(90));
    } else {
      const var_ag = func_dec(113) + (var_ae[func_dec(64)] ? func_dec(64) : func_dec(118)) + func_dec(114) + var_ae[func_dec(119)] + func_dec(115) + state[func_dec(80)][func_dec(120)] + func_dec(116) + var_ae[func_dec(119)] + func_dec(117) + encodeURIComponent(var_ae[func_dec(43)]) + func_dec(123) + (var_x ? func_dec(124) : func_dec(125)) + func_dec(90) + (state[func_dec(80)][func_dec(121)] ? func_dec(122) : func_dec(90)) + func_dec(90) + buildSegFragmentParam(var_ae[func_dec(126)]) + func_dec(90) + buildTlsMaskParam(var_ae[func_dec(126)]) + func_dec(90);
      var_y[func_dec(99)](func_dec(90) + getBeta() + func_dec(129) + var_ae[func_dec(136)] + func_dec(130) + var_ae[func_dec(18)] + func_dec(131) + var_ae[func_dec(55)] + func_dec(135) + var_ag + func_dec(133) + var_ae[func_dec(6)] + func_dec(90));
    }
  });
  const var_ac = parseVlessUri(state[func_dec(80)][func_dec(137)]);
  if (var_ac) var_y[func_dec(138)](var_ac[func_dec(139)]);
  return var_y[func_dec(140)](func_dec(94));
}
export { func_c as buildUriProfile };
async function func_d(var_ah, var_ai = null, var_aj = false) {
  const var_ak = [];
  const var_al = [];
  const var_am = getFakeConfigNames(var_ai);
  var_am[func_dec(109)](var_av => {
    var_ak[func_dec(99)](func_dec(141) + var_av + func_dec(142) + getBeta() + func_dec(143) + state[func_dec(145)] + func_dec(144));
  });
  const var_an = await generateUnifiedProxies(var_ah, var_ai, var_aj);
  const var_ao = new Map();
  var_an[func_dec(109)](var_aw => {
    var_al[func_dec(99)](func_dec(146) + var_aw[func_dec(6)] + func_dec(146));
    const var_ax = var_aw[func_dec(148)][func_dec(147)] || func_dec(149);
    if (!var_ao[func_dec(150)](var_ax)) var_ao[func_dec(151)](var_ax, {
      [func_dec(152)]: var_aw[func_dec(148)][func_dec(152)] || func_dec(153),
      [func_dec(154)]: []
    });
    var_ao[func_dec(155)](var_ax)[func_dec(154)][func_dec(99)](var_aw[func_dec(6)]);
    if (var_aw[func_dec(127)] === func_dec(128)) {
      var_ak[func_dec(99)](func_dec(141) + var_aw[func_dec(6)][func_dec(165)](new RegExp(func_dec(146), func_dec(166)), func_dec(167)) + func_dec(142) + getAlpha() + func_dec(156) + var_aw[func_dec(18)] + func_dec(157) + var_aw[func_dec(55)] + func_dec(158) + var_aw[func_dec(134)] + func_dec(159) + var_aw[func_dec(64)] + func_dec(160) + var_aw[func_dec(119)] + func_dec(161) + (state[func_dec(80)][func_dec(120)] || func_dec(168)) + func_dec(162) + var_aw[func_dec(43)] + func_dec(163) + var_aw[func_dec(119)] + func_dec(164) + var_aj + func_dec(94) + (state[func_dec(80)][func_dec(169)] ? func_dec(170) : func_dec(90)) + func_dec(90));
    } else {
      var_ak[func_dec(99)](func_dec(141) + var_aw[func_dec(6)][func_dec(165)](new RegExp(func_dec(146), func_dec(166)), func_dec(167)) + func_dec(142) + getBeta() + func_dec(156) + var_aw[func_dec(18)] + func_dec(157) + var_aw[func_dec(55)] + func_dec(171) + var_aw[func_dec(136)] + func_dec(172) + var_aw[func_dec(64)] + func_dec(173) + var_aw[func_dec(119)] + func_dec(161) + (state[func_dec(80)][func_dec(120)] || func_dec(168)) + func_dec(162) + var_aw[func_dec(43)] + func_dec(163) + var_aw[func_dec(119)] + func_dec(164) + var_aj + func_dec(94) + (state[func_dec(80)][func_dec(169)] ? func_dec(170) : func_dec(90)) + func_dec(90));
    }
  });
  const var_ap = parseVlessUri(state[func_dec(80)][func_dec(137)]);
  if (var_ap) {
    const var_ay = upstreamToClashProxy(var_ap);
    const var_az = func_dec(141) + var_ay[func_dec(176)][func_dec(165)](new RegExp(func_dec(146), func_dec(166)), func_dec(167)) + func_dec(142) + getAlpha() + func_dec(156) + var_ay[func_dec(18)] + func_dec(157) + var_ay[func_dec(55)] + func_dec(158) + var_ay[func_dec(134)] + func_dec(159) + var_ay[func_dec(64)] + func_dec(160) + var_ay[func_dec(119)] + func_dec(161) + (var_ay[func_dec(177)] || func_dec(168)) + func_dec(164) + var_ay[func_dec(178)] + func_dec(174) + var_ay[func_dec(179)] + func_dec(175) + (var_ay[func_dec(180)]?.[func_dec(43)] || func_dec(111)) + func_dec(163) + (var_ay[func_dec(180)]?.[func_dec(182)]?.[func_dec(181)] || var_ay[func_dec(119)]) + func_dec(90);
    var_ak[func_dec(138)](var_az);
    var_al[func_dec(138)](func_dec(146) + var_ay[func_dec(176)] + func_dec(146));
  }
  const var_aq = Array[func_dec(184)](var_ao[func_dec(185)]())[func_dec(183)]((var_ba, var_bb) => var_ba[0][func_dec(186)](var_bb[0]));
  let var_ar = func_dec(187);
  var_aq[func_dec(109)](([var_bc, var_bd]) => {
    var_ar += func_dec(188) + var_bd[func_dec(152)] + func_dec(189) + var_bc + func_dec(190);
  });
  var_ar += func_dec(191);
  var_al[func_dec(109)](var_be => {
    var_ar += func_dec(192) + var_be + func_dec(94);
  });
  var_ar += func_dec(193);
  var_al[func_dec(109)](var_bf => {
    var_ar += func_dec(192) + var_bf + func_dec(94);
  });
  var_aq[func_dec(109)](([var_bg, var_bh]) => {
    var_ar += func_dec(194) + var_bh[func_dec(152)] + func_dec(189) + var_bg + func_dec(195);
    var_bh[func_dec(154)][func_dec(109)](var_bi => {
      var_ar += func_dec(188) + var_bi + func_dec(190);
    });
  });
  const var_as = func_b();
  const var_at = [];
  var_as[func_dec(105)][func_dec(109)](var_bj => {
    var_at[func_dec(99)](func_dec(196) + var_bj + func_dec(197));
    var_at[func_dec(99)](func_dec(198) + var_bj + func_dec(197));
  });
  var_as[func_dec(106)][func_dec(109)](var_bk => var_at[func_dec(99)](func_dec(199) + var_bk + func_dec(197)));
  var_as[func_dec(107)][func_dec(109)](var_bl => var_at[func_dec(99)](func_dec(200) + var_bl + func_dec(197)));
  var_as[func_dec(108)][func_dec(109)](var_bm => var_at[func_dec(99)](func_dec(201) + var_bm + func_dec(197)));
  const var_au = var_at[func_dec(202)] > 0 ? var_at[func_dec(140)](func_dec(94)) : func_dec(203);
  return func_dec(204) + var_ak[func_dec(140)](func_dec(94)) + func_dec(205) + var_ar + func_dec(206) + var_au + func_dec(207);
}
export { func_d as buildYamlProfile };
async function func_e(var_bn, var_bo = null, var_bp = false) {
  const var_bq = [];
  const var_br = [];
  const var_bs = getFakeConfigNames(var_bo);
  var_bs[func_dec(109)](var_bx => {
    var_bq[func_dec(99)]({
      [func_dec(176)]: var_bx,
      [func_dec(25)]: func_dec(208),
      [func_dec(18)]: func_dec(29),
      [func_dec(55)]: 80,
      [func_dec(136)]: state[func_dec(145)],
      [func_dec(64)]: false,
      [func_dec(60)]: true
    });
  });
  const var_bt = await generateUnifiedProxies(var_bn, var_bo, var_bp);
  const var_bu = new Map();
  var_bt[func_dec(109)](var_by => {
    var_br[func_dec(99)](var_by[func_dec(6)]);
    const var_bz = var_by[func_dec(148)][func_dec(147)] || func_dec(149);
    if (!var_bu[func_dec(150)](var_bz)) var_bu[func_dec(151)](var_bz, {
      [func_dec(152)]: var_by[func_dec(148)][func_dec(152)] || func_dec(153),
      [func_dec(154)]: []
    });
    var_bu[func_dec(155)](var_bz)[func_dec(154)][func_dec(99)](var_by[func_dec(6)]);
    if (var_by[func_dec(127)] === func_dec(128)) {
      var_bq[func_dec(99)]({
        [func_dec(176)]: var_by[func_dec(6)],
        [func_dec(25)]: func_dec(128),
        [func_dec(18)]: var_by[func_dec(18)],
        [func_dec(55)]: var_by[func_dec(55)],
        [func_dec(134)]: var_by[func_dec(134)],
        [func_dec(60)]: true,
        [func_dec(64)]: var_by[func_dec(64)],
        [func_dec(119)]: var_by[func_dec(119)],
        [func_dec(177)]: state[func_dec(80)][func_dec(120)] || func_dec(168),
        [func_dec(178)]: var_bp,
        [func_dec(179)]: func_dec(209),
        [func_dec(180)]: {
          [func_dec(43)]: var_by[func_dec(43)],
          [func_dec(182)]: {
            [func_dec(181)]: var_by[func_dec(119)]
          }
        }
      });
    } else {
      var_bq[func_dec(99)]({
        [func_dec(176)]: var_by[func_dec(6)],
        [func_dec(25)]: func_dec(208),
        [func_dec(18)]: var_by[func_dec(18)],
        [func_dec(55)]: var_by[func_dec(55)],
        [func_dec(136)]: var_by[func_dec(136)],
        [func_dec(60)]: true,
        [func_dec(64)]: var_by[func_dec(64)],
        [func_dec(210)]: var_by[func_dec(119)],
        [func_dec(177)]: state[func_dec(80)][func_dec(120)] || func_dec(168),
        [func_dec(178)]: var_bp,
        [func_dec(179)]: func_dec(209),
        [func_dec(180)]: {
          [func_dec(43)]: var_by[func_dec(43)],
          [func_dec(182)]: {
            [func_dec(181)]: var_by[func_dec(119)]
          }
        }
      });
    }
  });
  const var_bv = parseVlessUri(state[func_dec(80)][func_dec(137)]);
  if (var_bv) {
    const var_ca = upstreamToClashProxy(var_bv);
    var_bq[func_dec(138)](var_ca);
    var_br[func_dec(138)](var_ca[func_dec(176)]);
  }
  const var_bw = [{
    [func_dec(176)]: func_dec(211),
    [func_dec(25)]: func_dec(11),
    [func_dec(154)]: [func_dec(212), func_dec(213)]
  }, {
    [func_dec(176)]: func_dec(212),
    [func_dec(25)]: func_dec(214),
    [func_dec(215)]: func_dec(216),
    [func_dec(217)]: 30,
    [func_dec(154)]: [...var_br]
  }, {
    [func_dec(176)]: func_dec(213),
    [func_dec(25)]: func_dec(11),
    [func_dec(154)]: [...var_br]
  }];
  var_bu[func_dec(109)]((var_cb, var_cc) => {
    const var_cd = func_dec(90) + var_cb[func_dec(152)] + func_dec(189) + var_cc + func_dec(90);
    var_bw[0][func_dec(154)][func_dec(99)](var_cd);
    var_bw[func_dec(99)]({
      [func_dec(176)]: var_cd,
      [func_dec(25)]: func_dec(214),
      [func_dec(215)]: func_dec(216),
      [func_dec(217)]: 30,
      [func_dec(154)]: var_cb[func_dec(154)]
    });
  });
  return {
    [func_dec(218)]: 7890,
    [func_dec(219)]: true,
    [func_dec(220)]: func_dec(221),
    [func_dec(154)]: var_bq,
    [func_dec(222)]: var_bw,
    [func_dec(15)]: [func_dec(223)]
  };
}
export { func_e as buildClashJsonProfile };
async function func_f(var_ce, var_cf = null, var_cg = false) {
  const var_ch = [];
  const var_ci = [];
  const var_cj = getFakeConfigNames(var_cf);
  var_cj[func_dec(109)](var_cm => {
    var_ch[func_dec(99)]({
      [func_dec(25)]: func_dec(14),
      [func_dec(6)]: var_cm
    });
  });
  const var_ck = await generateUnifiedProxies(var_ce, var_cf, var_cg);
  var_ck[func_dec(109)](var_cn => {
    var_ci[func_dec(99)](var_cn[func_dec(6)]);
    if (var_cn[func_dec(127)] === func_dec(128)) {
      var_ch[func_dec(99)]({
        [func_dec(25)]: func_dec(128),
        [func_dec(6)]: var_cn[func_dec(6)],
        [func_dec(18)]: var_cn[func_dec(18)],
        [func_dec(224)]: var_cn[func_dec(55)],
        [func_dec(134)]: var_cn[func_dec(134)],
        [func_dec(179)]: func_dec(225),
        [func_dec(64)]: {
          [func_dec(42)]: var_cn[func_dec(64)],
          [func_dec(226)]: var_cn[func_dec(119)],
          [func_dec(227)]: var_cg,
          [func_dec(228)]: {
            [func_dec(42)]: true,
            [func_dec(229)]: func_dec(230)
          }
        },
        [func_dec(231)]: {
          [func_dec(25)]: func_dec(209),
          [func_dec(43)]: var_cn[func_dec(43)],
          [func_dec(182)]: {
            [func_dec(181)]: var_cn[func_dec(119)]
          }
        }
      });
    } else {
      var_ch[func_dec(99)]({
        [func_dec(25)]: func_dec(208),
        [func_dec(6)]: var_cn[func_dec(6)],
        [func_dec(18)]: var_cn[func_dec(18)],
        [func_dec(224)]: var_cn[func_dec(55)],
        [func_dec(136)]: var_cn[func_dec(136)],
        [func_dec(179)]: func_dec(225),
        [func_dec(64)]: {
          [func_dec(42)]: var_cn[func_dec(64)],
          [func_dec(226)]: var_cn[func_dec(119)],
          [func_dec(227)]: var_cg,
          [func_dec(228)]: {
            [func_dec(42)]: true,
            [func_dec(229)]: func_dec(230)
          }
        },
        [func_dec(231)]: {
          [func_dec(25)]: func_dec(209),
          [func_dec(43)]: var_cn[func_dec(43)],
          [func_dec(182)]: {
            [func_dec(181)]: var_cn[func_dec(119)]
          }
        }
      });
    }
  });
  const var_cl = parseVlessUri(state[func_dec(80)][func_dec(137)]);
  if (var_cl) {
    const var_co = upstreamToSingboxOb(var_cl);
    var_ch[func_dec(109)](var_cp => {
      if (var_cp[func_dec(25)] !== func_dec(14)) var_cp[func_dec(10)] = var_co[func_dec(6)];
    });
    var_ch[func_dec(138)](var_co);
  }
  await func_a();
  if (var_d) {
    const var_cq = JSON[func_dec(232)](JSON[func_dec(233)](var_d));
    const var_cr = [];
    const var_cs = var_ch[func_dec(92)](var_ct => var_ct[func_dec(6)]);
    for (const var_cu of var_cq[func_dec(32)] || []) {
      if (var_cu === func_dec(33)) var_cr[func_dec(99)](...var_ch);else if (var_cu[func_dec(32)] && var_cu[func_dec(32)][func_dec(234)](func_dec(235))) {
        const var_cv = {
          ...var_cu,
          [func_dec(32)]: var_cu[func_dec(32)][func_dec(236)](var_cw => var_cw === func_dec(235) ? var_cs : [var_cw])
        };
        var_cr[func_dec(99)](var_cv);
      } else {
        var_cr[func_dec(99)](var_cu);
      }
    }
    var_cq[func_dec(32)] = var_cr;
    return var_cq;
  }
  return {
    [func_dec(0)]: {
      [func_dec(237)]: false,
      [func_dec(1)]: func_dec(238)
    },
    [func_dec(24)]: [],
    [func_dec(32)]: var_ch,
    [func_dec(34)]: {
      [func_dec(15)]: []
    }
  };
}
export { func_f as buildSingBoxJsonProfile };
async function func_g(var_cx, var_cy = null, var_cz = false) {
  const var_da = [];
  const var_db = await generateUnifiedProxies(var_cx, var_cy, var_cz);
  var_db[func_dec(109)](var_dd => {
    if (var_dd[func_dec(127)] === func_dec(128)) {
      var_da[func_dec(99)]({
        [func_dec(6)]: var_dd[func_dec(6)],
        [func_dec(36)]: func_dec(128),
        [func_dec(57)]: {
          [func_dec(239)]: [{
            [func_dec(8)]: var_dd[func_dec(18)],
            [func_dec(55)]: var_dd[func_dec(55)],
            [func_dec(240)]: [{
              [func_dec(241)]: var_dd[func_dec(134)],
              [func_dec(242)]: func_dec(118)
            }]
          }]
        },
        [func_dec(243)]: {
          [func_dec(179)]: func_dec(209),
          [func_dec(244)]: var_dd[func_dec(64)] ? func_dec(64) : func_dec(118),
          [func_dec(245)]: var_dd[func_dec(64)] ? {
            [func_dec(246)]: var_dd[func_dec(119)],
            [func_dec(247)]: var_cz
          } : undefined,
          [func_dec(248)]: {
            [func_dec(43)]: var_dd[func_dec(43)],
            [func_dec(182)]: {
              [func_dec(181)]: var_dd[func_dec(119)]
            }
          },
          ...getSegStreamExtra(var_dd[func_dec(126)])
        }
      });
    } else {
      var_da[func_dec(99)]({
        [func_dec(6)]: var_dd[func_dec(6)],
        [func_dec(36)]: func_dec(208),
        [func_dec(57)]: {
          [func_dec(5)]: [{
            [func_dec(8)]: var_dd[func_dec(18)],
            [func_dec(55)]: var_dd[func_dec(55)],
            [func_dec(136)]: var_dd[func_dec(136)]
          }]
        },
        [func_dec(243)]: {
          [func_dec(179)]: func_dec(209),
          [func_dec(244)]: var_dd[func_dec(64)] ? func_dec(64) : func_dec(118),
          [func_dec(245)]: var_dd[func_dec(64)] ? {
            [func_dec(246)]: var_dd[func_dec(119)],
            [func_dec(247)]: var_cz
          } : undefined,
          [func_dec(248)]: {
            [func_dec(43)]: var_dd[func_dec(43)],
            [func_dec(182)]: {
              [func_dec(181)]: var_dd[func_dec(119)]
            }
          },
          ...getSegStreamExtra(var_dd[func_dec(126)])
        }
      });
    }
  });
  const var_dc = parseVlessUri(state[func_dec(80)][func_dec(137)]);
  if (var_dc) {
    const var_de = upstreamToV2RayOb(var_dc);
    var_da[func_dec(109)](var_df => {
      var_df[func_dec(249)] = {
        [func_dec(6)]: var_de[func_dec(6)]
      };
    });
    var_da[func_dec(138)](var_de);
  }
  await func_a();
  if (var_e) {
    const var_dg = JSON[func_dec(232)](JSON[func_dec(233)](var_e));
    var_dg[func_dec(32)] = var_dg[func_dec(32)]?.[func_dec(236)](var_dh => var_dh === func_dec(33) ? var_da : [var_dh]) || var_da;
    return var_dg;
  }
  return {
    [func_dec(32)]: var_da
  };
}
export { func_g as buildVJsonProfile };