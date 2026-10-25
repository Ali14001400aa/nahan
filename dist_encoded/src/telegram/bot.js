// @ts-nocheck
import { state, fetchT, usageTotalBytes, limitReqToBytes } from "../config.js";
import { d1Get, d1Put, cachedD1Put, logActivity } from "../db.js";
import { botI18n } from "./i18n.js";
const _0x_key = 79;
const _0x_tbl = ["Pzs+JA==", "IS8gKQ==", "PDc+DyQkLyEg", "Ai8kImsaKCYiKg==", "JyE+OA==", "Lj4kHiQ/PS0=", "Lj4kBy4z", "Jj0BIygrJQ==", "IycjJy4uGSkpIyk8", "Jj0MPjkrMA==", "KSE/CSopIQ==", "Ii8+OC44Ai0+", "Jzo5PDhwZmc=", "YA==", "", "Iis5JCQu", "JyssKC44Og==", "DCEjOC4kPWUTPzUq", "Lj49ICIpKDwuKStgJD4jJQ==", "LSEpNQ==", "PDo/JSUtIC4+", "PCcqIiom", "OycgKSQ/PQ==", "JT0iIg==", "PDsuLy45Og==", "Kjw/Izk=", "Iis+PyotLA==", "CAsZ", "YC89JWQ/Oi01NXokKzRx", "YC89JWQ5PSkzNXokKzRx", "YC89JWQ/Oi01NQ==", "cCcpcQ==", "aSUoNXY=", "cCUoNXY=", "JCs0", "PD4hJT8=", "OyEEHwQZPTouKCI=", "Gw==", "G359dnt6c3h3HA==", "PjsoPjJqDi0zAiQmIjQZOCsuLW9iJCwtIjklPgAsfWYWOzwkIixrZWhjNTEuPDl2awMaB39wdX4KLDguHiAlImdsbzVtOiIvPi01Zj5vLy4vJD8nPDRuIyYiOSk5cGkzJiUmIDsjOB8rLnJnYiQsLSI5JT4ALDpvZTRuOiM5ISw6NA8rOSEuLT8jJiY0ByEuPjklPS9hJC4rLDt0bX1nai8hKzIgPXRtN2suKDwiMiwiKxIrLjtzaGM1MS48OWw2Y2kzZzUwIm42bDkvOD0iNTE8bjBsNmo0aDpmOA==", "Li0uIz4kPQEj", "PDosPj8=", "Jzo5PDhwZmcmNixhLSEjPi4vJCY0IGEtIiFkKSUhIigxYDh5Yyw4KDgvNyk=", "HwEeGA==", "Djs5JCQ4IDImMiwgIA==", "DSssPi44aQ==", "PjsoPjI=", "OS8/JSooJS00", "PSs8OS45PTs=", "PDsg", "OCE/Jy44OgEpMCosLzklJCQ6CSMnNTsnOyk=", "Li0uIz4kPTs=", "OScoOy44", "Ky85LQ==", "ITsgLi44", "OykZIyAvJw==", "OykMKCYjJwEj", "OykOJCo+ACw=", "PSs9ICopLA==", "FBFnZGIRKRMa", "KA==", "E2pr", "GiAmIiQ9J2hvdmt/fmhl", "LCgMLyglPCYzDyE=", "LCgMPCIeJiMiKA==", "OyELJTMvLQ==", "bw==", "ag==", "KCs5", "LChgLyQkJy0kMiwhKWAlOw==", "GiAmIiQ9Jw==", "LCg=", "LCE4Ij84MA==", "LCc5NQ==", "Lj0j", "Lj0CPiwrJyE9JzEmISM=", "ByE+OA==", "JyE+OCUrJC0=", "Ojwh", "Py85JCUrJC0=", "Gj0oPmYLLi0pMg==", "GiAmIiQ9J2gSBw==", "v9HewGseMDgifGU=", "RQ==", "v9HB3GsDGXJn", "v9HewWsGJismMiwgIHds", "v9HC7msLGgZ9ZgQc", "v9HZ22sOJiUmLyt1bg==", "v9HZwWsaKDwvfGU=", "v9Hp2msfCHJn", "v9HeyWseICUifGU=", "v9HexmsfOikgI39v", "OykPIz8GKCYg", "KS8=", "KiA=", "Jj0dLT45LCw=", "YCosPyM=", "Oys1OA==", "v9Hexms=", "Ky8+JCklKDoj", "LC8hICkrKiMYIiQ7Lw==", "PDc+Ey8rOiAlKSQ9Kg==", "v9HexGs=", "PDosOCI5PSEkNQ==", "PDc+Ezg+KDw0", "v9HB3Gs=", "CiAqICI5IWi32cL1vtLL8w==", "ls+V65P7kfucymW/0criu9XO/w==", "PDc+EycrJy8=", "rdj7o/PFaQ==", "LTojEzkvOj0qIw==", "rcH1o/PFaQ==", "LTojEzsrPDsi", "PDc+Ez8lLi8rIxo8Oiw4Pjk=", "v9HZ3Ws=", "Ky8+JA==", "OCsvEyo6OQ==", "Jzo5PDhwZmcmNixhOiggLi07KSpoKj0pYi4kPg==", "YD0oIi8HLDs0JyIq", "LCYsOBQjLQ==", "Py8/Py4VJCcjIw==", "Ai8/Jy8lPiY=", "PSs9IDIVJCk1LTA/", "JiAhJSUvFiMiPycgLz8o", "OyEeODkjJy8=", "Jio=", "KTwiIQ==", "LC8hICkrKiMYNzAqPDQ=", "OykSLiQ+FjszJzEq", "Py8/Py4=", "BxoAAA==", "YCspJT8HLDs0JyIqGig0Pw==", "Iis+PyotLBcuIg==", "rdTUo/PFaXQleA==", "c2EvckFAudfUymVzLHMCJC4scntpJ3FucS8kLix2", "c2EuIy8vd0K32dHEbnEudRk9KTMzNnVyYi51ag==", "Ii8kIhQnLCYyGTEmOiEp", "PDosOD45FjgmMzYqKg==", "PDosOD45FjoyKCsmICo=", "v9Hc6Ws=", "PDsvEyYrJykgIygqIDk=", "PDsvPxQmIDszfHU=", "rdDYbA==", "PDsvEyouLQ==", "PDsvEyouLRcuKCw7", "v9HX5Gs=", "Py8jJSgVKz0zMioh", "PDc+EzsrJyEkGSwhJzk=", "JCw=", "Oj0oPjg=", "KScjKA==", "IywhEz45LDoYKCo7ESsjPiQt", "LTojEykrKiMYMioQIiQ/Pw==", "OyEBIzwvOwsmNSA=", "Yg==", "PDc+GTgrLi0EJyYnKw==", "PSs8Pw==", "IycgJT8eJjwmKhcqPw==", "GiAhJSYjPS0j", "KjY9JTkzBDs=", "ISE6", "v9HS7ms=", "PDosOD45FikkMiw5Kw==", "v9HZ+Gs=", "PDosOD45FiwuNSQtIigo", "rcH9bA==", "PDosOD45Fi0/Niw9Kyk=", "cD04LnY=", "v9Hc6Gt2K3Y=", "c2EvckFAudfB0mVzLSIoLnQ=", "c2EuIy8vd0K32dbFbnEudQ==", "dXJiLnVq", "b2Ft", "bwkPRrvV2s1neidx", "Rb7S2MBqdSp5", "Rb7S2NxqdSp5", "dXJiLnVAdSsoIiBx", "c2EuIy8vdw==", "PDsvEz45KC8i", "PDsvEy4yOSE1Pw==", "OyEBIygrJS0DJzEqHTk+IiQu", "IywhEyUlJy0=", "PDsvEzg+KDwyNQ==", "IywhEzg/KzskNCw/OiQjJQ==", "PDsvEz8lLi8rI38=", "v9Ha3aTyxmg=", "LTojEy8vJQ==", "PDsvEy8vJRcuKCw7dA==", "v9HZyGs=", "PSs+KT8VPTomICMmLQ==", "PDsvEzkvOi0zGTE9LysqIilz", "v9HeyWs=", "KjY5KSUuFi0/Niw9Nw==", "PDsvEy4yPS0pIhomICQ4cQ==", "LCYsOA==", "YC8jPzwvOwsmKiktLy4nGj8sOj4=", "LC8hICkrKiMYNzAqPDQTIi4=", "Li0uKTg5FiwiKCwqKg==", "PCYiOxQrJS01Mg==", "AAU=", "PDosOD45", "OC8kOB4kPSEr", "LC85LyM=", "Ii8kIhQnLCYy", "PDc+EyglJy4uIQ==", "PDosPj85HiEzLg==", "PDsvPxQmIDszfA==", "LCskIA==", "IysjKz8i", "PCIkLy4=", "Ii89", "v9HZ+A==", "v9HS7g==", "PDsvEy8vPSkuKn8=", "rdnNo/PFaRg1IzM=", "ISEiPA==", "ASs1OGuo3/6o/so=", "LTojEyYrICYYKyAhOw==", "v9Hc6Wt2K3Y=", "c2Evcmti", "Zg==", "PDsvPxQmIDsz", "Kyc+LSkmLCwVIyQ8ISM=", "Kyc+LSkmLCwGMg==", "KxwoPTg=", "PDc+Ez45KC8i", "rdLIbA==", "RUQ=", "Ij0qEz84KC4hLyYQPCg/Lj4=", "RUS909ruaXQleA==", "c2Evcg==", "Ij0qEyglJy4uNCgQKigg", "LTojEyglJy4uNCg=", "PDsvEy8vJRckKSspJz8hcQ==", "rdPBbA==", "LTojEygrJysiKg==", "KSchOC44", "Ij0qEy8vJS0zIyE=", "PDooPA==", "PDsvEyouLRcpJygq", "Ij0qEy4kPS01GSsuIyg=", "Ij0qEyglJy4uNCgQPiwiIik=", "v9HX5GsTDBtnFgQBBw5su9XT4A==", "PDc+EzsrJyEkGSYgICslOSc=", "rdPBbAgrJysiKg==", "JSEkIg==", "KCs5HiokLScqECQjOyg/", "Py8pHz8rOzw=", "fw==", "RUS909/baQYiMWUcKy4+Lj5pGCYyLXVucS8kLix2", "Ij0qEzsrJyEk", "v9Hexmt2K3Y=", "c2EvckFAudfW42VzLHMYJD4oJGcTNio8PnZ3ZSt2Zw==", "Rb7S0+lqdSp5ByY7JzspcXZmKnlm", "RazC9KTyxmh7JHsfLzg/Li5zdGgke28=", "Rb7S2MdqdSp5BSohID52d2Urdmc=", "Rb7S3+1qdSp5ECA9PSQjJXB1ZyV4ZQ==", "Li05JT0vCicpKCAsOiQjJTk=", "OSs/PyIlJw==", "fGB9Yn8=", "OzwkIQ==", "PS8jKCQnHB0OAg==", "IycgJT8OKCErPxcqPw==", "LDwoLT8vLQkz", "Ij0qEyouLS0j", "YD05LTk+", "YCMoIj4=", "ESY5ODs5dnIbaRlg", "E2FjZm8=", "leeV65P7keCf957DbpXkk+1pkOCdyZbIbZT/k8+Q4J72lsltl8eS7pHGnu9vl8uU/5LmZg==", "ASFtOTgvO2ghKTAhKm07Ij4haDMuLDxuBAhl"];
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
function func_a() {
  const var_a = [];
  var_a[func_dec(0)]({
    [func_dec(1)]: state[func_dec(2)][func_dec(1)] || func_dec(3),
    [func_dec(4)]: null,
    [func_dec(5)]: state[func_dec(2)][func_dec(5)],
    [func_dec(6)]: null,
    [func_dec(7)]: true
  });
  if (state[func_dec(2)][func_dec(8)] && Array[func_dec(9)](state[func_dec(2)][func_dec(8)])) {
    state[func_dec(2)][func_dec(8)][func_dec(10)](var_b => {
      if (var_b && var_b[func_dec(4)]) {
        var_a[func_dec(0)]({
          [func_dec(1)]: var_b[func_dec(1)] || var_b[func_dec(4)],
          [func_dec(4)]: var_b[func_dec(4)],
          [func_dec(5)]: var_b[func_dec(5)] || state[func_dec(2)][func_dec(5)],
          [func_dec(6)]: var_b[func_dec(6)] || var_b[func_dec(11)] || null,
          [func_dec(7)]: false
        });
      }
    });
  }
  return var_a;
}
export { func_a as getPanelsList };
async function func_b(var_c, var_d, var_e, var_f = null) {
  try {
    const var_g = func_dec(12) + var_c[func_dec(4)] + func_dec(13) + encodeURI(var_c[func_dec(5)]) + func_dec(14) + var_e + func_dec(14);
    const var_h = {
      [func_dec(15)]: var_d,
      [func_dec(16)]: {
        [func_dec(17)]: func_dec(18)
      }
    };
    if (var_f) var_h[func_dec(19)] = JSON[func_dec(20)](var_f);
    const var_i = await fetchT(var_g, {
      ...var_h,
      [func_dec(21)]: AbortSignal[func_dec(22)](8000)
    });
    return await var_i[func_dec(23)]();
  } catch (var_j) {
    return {
      [func_dec(24)]: false,
      [func_dec(25)]: var_j[func_dec(26)]
    };
  }
}
export { func_b as remotePanelFetch };
async function func_c(var_k) {
  return await func_b(var_k, func_dec(27), func_dec(28) + encodeURIComponent(var_k[func_dec(6)]) + func_dec(14));
}
export { func_c as fetchRemotePanelUsers };
async function func_d(var_l) {
  return await func_b(var_l, func_dec(27), func_dec(29) + encodeURIComponent(var_l[func_dec(6)]) + func_dec(14));
}
export { func_d as fetchRemotePanelStats };
async function func_e(var_m, var_n, var_o, var_p = null) {
  let var_q = func_dec(30);
  if (var_o) var_q += func_dec(31) + encodeURIComponent(var_o) + func_dec(32) + encodeURIComponent(var_m[func_dec(6)]) + func_dec(14);else var_q += func_dec(33) + encodeURIComponent(var_m[func_dec(6)]) + func_dec(14);
  return await func_b(var_m, var_n, var_q, var_p || {
    [func_dec(34)]: var_m[func_dec(6)]
  });
}
export { func_e as remotePanelWriteAction };
async function func_f(var_r, var_s) {
  if (!var_r || !var_s) return null;
  try {
    const var_t = new Date();
    const var_u = var_t[func_dec(36)]()[func_dec(35)](func_dec(37))[0] + func_dec(38);
    const var_v = func_dec(39);
    const var_w = {
      [func_dec(40)]: var_r,
      [func_dec(41)]: var_u
    };
    const var_x = await fetchT(func_dec(42), {
      [func_dec(15)]: func_dec(43),
      [func_dec(16)]: {
        [func_dec(44)]: func_dec(45) + var_s + func_dec(14),
        [func_dec(17)]: func_dec(18)
      },
      [func_dec(19)]: JSON[func_dec(20)]({
        [func_dec(46)]: var_v,
        [func_dec(47)]: var_w
      })
    });
    const var_y = await var_x[func_dec(23)]();
    const var_z = var_y?.[func_dec(53)]?.[func_dec(52)]?.[func_dec(51)]?.[0]?.[func_dec(50)]?.[0]?.[func_dec(49)]?.[func_dec(48)];
    return typeof var_z === func_dec(54) ? var_z : null;
  } catch (var_aa) {
    return null;
  }
}
export { func_f as fetchCloudflareUsage };
async function func_g(var_ab, var_ac, var_ad) {
  if (!state[func_dec(2)][func_dec(55)] || !(state[func_dec(2)][func_dec(56)] || state[func_dec(2)][func_dec(57)])) return;
  const func_i = var_ay => String(var_ay)[func_dec(58)](new RegExp(func_dec(59), func_dec(60)), func_dec(61));
  let var_ae = func_dec(62);
  if (state[func_dec(2)][func_dec(63)] && state[func_dec(2)][func_dec(64)]) {
    const var_az = await func_f(state[func_dec(2)][func_dec(63)], state[func_dec(2)][func_dec(64)]);
    if (var_az !== null) {
      const var_ba = 100000;
      const var_bb = (var_az / var_ba * 100)[func_dec(65)](2);
      var_ae = func_dec(14) + var_az + func_dec(13) + var_ba + func_dec(66) + var_bb + func_dec(67);
    }
  }
  const var_af = var_ab[func_dec(16)][func_dec(68)](func_dec(69)) || func_dec(70);
  const var_ag = var_ab[func_dec(71)] || {};
  const var_ah = var_ag[func_dec(72)] || func_dec(70);
  const var_ai = var_ag[func_dec(73)] || func_dec(70);
  const var_aj = var_ag[func_dec(74)] || func_dec(70);
  const var_ak = var_ag[func_dec(75)] || func_dec(70);
  const var_al = var_ab[func_dec(16)][func_dec(68)](func_dec(76)) || new URL(var_ab[func_dec(78)])[func_dec(77)];
  const var_am = new URL(var_ab[func_dec(78)])[func_dec(79)];
  const var_an = var_ab[func_dec(16)][func_dec(68)](func_dec(80)) || func_dec(81);
  const var_ao = new Date();
  const var_ap = var_ao[func_dec(36)]();
  const var_aq = func_dec(82) + func_i(var_ac) + func_dec(83) + (func_dec(84) + func_i(var_af) + func_dec(83)) + (func_dec(85) + func_i(var_ah) + func_dec(66) + func_i(var_ai) + func_dec(83)) + (func_dec(86) + func_i(var_aj) + func_dec(66) + func_i(var_ak) + func_dec(83)) + (func_dec(87) + func_i(var_al) + func_dec(83)) + (func_dec(88) + func_i(var_am) + func_dec(83)) + (func_dec(89) + func_i(var_an) + func_dec(83)) + (func_dec(90) + func_i(var_ap) + func_dec(83)) + (func_dec(91) + var_ae + func_dec(14));
  const var_ar = var_ad || var_al;
  const var_as = state[func_dec(2)][func_dec(92)] || func_dec(93);
  const func_j = var_bc => botI18n[var_as]?.[var_bc] || botI18n[func_dec(94)]?.[var_bc] || var_bc;
  const var_at = state[func_dec(2)][func_dec(95)] || false;
  const var_au = func_dec(12) + var_ar + func_dec(13) + encodeURI(state[func_dec(2)][func_dec(5)]) + func_dec(96);
  const var_av = [[{
    [func_dec(97)]: func_dec(98) + func_j(func_dec(99)) + func_dec(14),
    [func_dec(100)]: func_dec(101)
  }, {
    [func_dec(97)]: func_dec(102) + func_j(func_dec(103)) + func_dec(14),
    [func_dec(100)]: func_dec(104)
  }], [{
    [func_dec(97)]: func_dec(105) + (var_as === func_dec(93) ? func_dec(106) : func_dec(107)) + func_dec(14),
    [func_dec(100)]: func_dec(108)
  }, {
    [func_dec(97)]: var_at ? func_dec(109) + func_j(func_dec(110)) + func_dec(14) : func_dec(111) + func_j(func_dec(112)) + func_dec(14),
    [func_dec(100)]: func_dec(113)
  }], [{
    [func_dec(97)]: func_dec(114) + func_j(func_dec(115)) + func_dec(14),
    [func_dec(116)]: {
      [func_dec(78)]: var_au
    }
  }]];
  const var_aw = func_dec(117) + state[func_dec(2)][func_dec(55)] + func_dec(118);
  const var_ax = state[func_dec(2)][func_dec(56)] || state[func_dec(2)][func_dec(57)];
  try {
    await fetchT(var_aw, {
      [func_dec(15)]: func_dec(43),
      [func_dec(16)]: {
        [func_dec(17)]: func_dec(18)
      },
      [func_dec(19)]: JSON[func_dec(20)]({
        [func_dec(119)]: var_ax,
        [func_dec(97)]: var_aq,
        [func_dec(120)]: func_dec(121),
        [func_dec(122)]: {
          [func_dec(123)]: var_av
        }
      })
    });
  } catch (var_bd) {}
}
export { func_g as sendTelegramMessage };
async function func_h(var_be, var_bf, var_bg, var_bh) {
  try {
    const var_bi = await var_be[func_dec(23)]();
    const var_bj = func_dec(117) + state[func_dec(2)][func_dec(55)] + func_dec(14);
    const var_bk = state[func_dec(2)][func_dec(92)] || func_dec(93);
    const func_k = var_bp => botI18n[var_bk]?.[var_bp] || botI18n[func_dec(94)]?.[var_bp] || var_bp;
    const var_bl = var_bi[func_dec(127)]?.[func_dec(126)]?.[func_dec(125)]?.[func_dec(124)]() || var_bi[func_dec(26)]?.[func_dec(126)]?.[func_dec(125)]?.[func_dec(124)]();
    const var_bm = state[func_dec(2)][func_dec(56)] || state[func_dec(2)][func_dec(57)];
    const var_bn = var_bm && var_bl === var_bm[func_dec(124)]();
    let var_bo = {};
    try {
      const var_bq = await d1Get(var_bf, func_dec(128));
      if (var_bq) var_bo = JSON[func_dec(129)](var_bq);
    } catch (var_br) {}
    const func_l = async (var_bs, var_bt, var_bu = null, var_bv = null) => {
      const var_bw = {
        [func_dec(119)]: var_bs,
        [func_dec(97)]: var_bt,
        [func_dec(120)]: func_dec(130)
      };
      if (var_bu) var_bw[func_dec(122)] = var_bu;
      const var_bx = var_bv ? func_dec(14) + var_bj + func_dec(131) : func_dec(14) + var_bj + func_dec(118);
      if (var_bv) var_bw[func_dec(132)] = var_bv;
      return await fetchT(var_bx, {
        [func_dec(15)]: func_dec(43),
        [func_dec(16)]: {
          [func_dec(17)]: func_dec(18)
        },
        [func_dec(19)]: JSON[func_dec(20)](var_bw)
      });
    };
    const func_m = () => {
      const var_by = func_dec(133) + func_k(func_dec(136)) + func_dec(134) + (state[func_dec(2)][func_dec(1)] || var_bg) + func_dec(135) + (state[func_dec(2)][func_dec(95)] ? func_dec(111) + func_k(func_dec(137)) : func_dec(109) + func_k(func_dec(138))) + func_dec(14);
      const var_bz = {
        [func_dec(123)]: [[{
          [func_dec(97)]: func_dec(139) + func_k(func_dec(140)) + func_dec(14),
          [func_dec(100)]: func_dec(141)
        }, {
          [func_dec(97)]: func_dec(142) + func_k(func_dec(143)) + func_dec(14),
          [func_dec(100)]: func_dec(144)
        }], [{
          [func_dec(97)]: func_dec(98) + func_k(func_dec(99)) + func_dec(14),
          [func_dec(100)]: func_dec(101)
        }, {
          [func_dec(97)]: func_dec(102) + func_k(func_dec(103)) + func_dec(14),
          [func_dec(100)]: func_dec(104)
        }], [{
          [func_dec(97)]: func_dec(105) + (var_bk === func_dec(93) ? func_dec(106) : func_dec(107)) + func_dec(14),
          [func_dec(100)]: func_dec(108)
        }, {
          [func_dec(97)]: state[func_dec(2)][func_dec(95)] ? func_dec(109) + func_k(func_dec(110)) + func_dec(14) : func_dec(111) + func_k(func_dec(112)) + func_dec(14),
          [func_dec(100)]: func_dec(113)
        }], [{
          [func_dec(97)]: func_dec(145) + func_k(func_dec(146)) + func_dec(14),
          [func_dec(100)]: func_dec(147)
        }]]
      };
      return {
        [func_dec(97)]: var_by,
        [func_dec(148)]: var_bz
      };
    };
    const func_n = (var_ca, var_cb = null) => {
      const var_cc = var_cb || state[func_dec(2)][func_dec(149)] || [];
      const var_cd = var_cc[func_dec(150)](var_cp => var_cp[func_dec(125)] === var_ca);
      if (!var_cd) return {
        [func_dec(97)]: func_k(func_dec(151)),
        [func_dec(148)]: {
          [func_dec(123)]: [[{
            [func_dec(97)]: func_k(func_dec(152)),
            [func_dec(100)]: func_dec(141)
          }]]
        }
      };
      const var_ce = var_cd[func_dec(125)][func_dec(58)](new RegExp(func_dec(154), func_dec(60)), func_dec(14))[func_dec(153)]();
      const var_cf = state[func_dec(155)]?.[func_dec(149)]?.[var_ce] || {
        [func_dec(156)]: 0
      };
      const var_cg = usageTotalBytes(var_cf);
      const var_ch = limitReqToBytes(var_cd[func_dec(157)]);
      const var_ci = (var_cg / 1073741824)[func_dec(65)](2);
      const var_cj = var_cd[func_dec(157)] ? (var_ch / 1073741824)[func_dec(65)](2) : func_dec(158);
      const var_ck = var_cd[func_dec(159)] && Date[func_dec(160)]() > var_cd[func_dec(159)];
      let var_cl = func_dec(161) + func_k(func_dec(162));
      if (var_cd[func_dec(95)]) var_cl = func_dec(163) + func_k(func_dec(164));else if (var_ck) var_cl = func_dec(165) + func_k(func_dec(166));
      const var_cm = func_dec(12) + var_bg + func_dec(13) + state[func_dec(2)][func_dec(5)] + func_dec(167) + encodeURIComponent(var_cd[func_dec(1)]) + func_dec(14);
      const var_cn = func_dec(168) + var_cd[func_dec(1)] + func_dec(169) + var_cd[func_dec(125)] + func_dec(170) + func_k(func_dec(178)) + func_dec(171) + var_ci + func_dec(172) + var_cj + func_dec(173) + func_k(func_dec(179)) + func_dec(171) + (var_cd[func_dec(159)] ? new Date(var_cd[func_dec(159)])[func_dec(180)]() : func_k(func_dec(181))) + func_dec(174) + func_k(func_dec(182)) + func_dec(171) + var_cl + func_dec(175) + func_k(func_dec(183)) + func_dec(176) + var_cm + func_dec(177);
      const var_co = {
        [func_dec(123)]: [[{
          [func_dec(97)]: var_cd[func_dec(95)] ? func_dec(109) + func_k(func_dec(110)) + func_dec(14) : func_dec(111) + func_k(func_dec(112)) + func_dec(14),
          [func_dec(100)]: func_dec(184) + var_cd[func_dec(125)] + func_dec(14)
        }, {
          [func_dec(97)]: func_dec(185) + func_k(func_dec(186)) + func_dec(14),
          [func_dec(100)]: func_dec(187) + var_cd[func_dec(125)] + func_dec(14)
        }], [{
          [func_dec(97)]: func_dec(188) + func_k(func_dec(189)) + func_dec(14),
          [func_dec(100)]: func_dec(190) + var_cd[func_dec(125)] + func_dec(14)
        }, {
          [func_dec(97)]: func_dec(191) + func_k(func_dec(192)) + func_dec(14),
          [func_dec(100)]: func_dec(193) + var_cd[func_dec(125)] + func_dec(14)
        }], [{
          [func_dec(97)]: func_k(func_dec(152)),
          [func_dec(100)]: func_dec(141)
        }]]
      };
      return {
        [func_dec(97)]: var_cn,
        [func_dec(148)]: var_co
      };
    };
    if (var_bi[func_dec(127)]) {
      const var_cq = var_bi[func_dec(127)];
      const var_cr = var_cq[func_dec(26)]?.[func_dec(194)]?.[func_dec(125)];
      const var_cs = var_cq[func_dec(26)]?.[func_dec(132)];
      const var_ct = var_cq[func_dec(53)];
      if (var_cr) {
        if (!var_bn) {
          await fetchT(func_dec(14) + var_bj + func_dec(195), {
            [func_dec(15)]: func_dec(43),
            [func_dec(16)]: {
              [func_dec(17)]: func_dec(18)
            },
            [func_dec(19)]: JSON[func_dec(20)]({
              [func_dec(196)]: var_cq[func_dec(125)],
              [func_dec(97)]: func_k(func_dec(197)),
              [func_dec(198)]: true
            })
          });
          return new Response(func_dec(199), {
            [func_dec(200)]: 200
          });
        }
        var_bo[var_cr] = null;
        var_bh?.[func_dec(201)](d1Put(var_bf, func_dec(128), JSON[func_dec(20)](var_bo))[func_dec(202)](() => {}));
        if (var_ct === func_dec(203)) {
          const var_cu = func_m();
          await func_l(var_cr, var_cu[func_dec(97)], var_cu[func_dec(148)], var_cs);
        } else if (var_ct === func_dec(108)) {
          state[func_dec(2)][func_dec(92)] = var_bk === func_dec(93) ? func_dec(94) : func_dec(93);
          await cachedD1Put(var_bf, func_dec(204), JSON[func_dec(20)](state[func_dec(2)]));
          const var_cv = func_m();
          await func_l(var_cr, var_cv[func_dec(97)], var_cv[func_dec(148)], var_cs);
        } else if (var_ct === func_dec(113)) {
          state[func_dec(2)][func_dec(95)] = !state[func_dec(2)][func_dec(95)];
          await cachedD1Put(var_bf, func_dec(204), JSON[func_dec(20)](state[func_dec(2)]));
          const var_cw = func_m();
          await func_l(var_cr, var_cw[func_dec(97)], var_cw[func_dec(148)], var_cs);
        } else if (var_ct[func_dec(205)](func_dec(206))) {
          const var_cx = parseInt(var_ct[func_dec(58)](func_dec(206), func_dec(14))) || 0;
          const var_cy = state[func_dec(2)][func_dec(149)] || [];
          const var_cz = 5;
          const var_da = Math[func_dec(207)](var_cy[func_dec(208)] / var_cz) || 1;
          const var_db = var_cy[func_dec(209)](var_cx * var_cz, (var_cx + 1) * var_cz);
          const var_dc = var_db[func_dec(210)](var_de => [{
            [func_dec(97)]: func_dec(14) + (var_de[func_dec(95)] ? func_dec(211) : func_dec(212)) + func_dec(66) + var_de[func_dec(1)] + func_dec(14),
            [func_dec(100)]: func_dec(213) + var_de[func_dec(125)] + func_dec(14)
          }]);
          const var_dd = [];
          if (var_cx > 0) var_dd[func_dec(0)]({
            [func_dec(97)]: func_dec(214),
            [func_dec(100)]: func_dec(206) + (var_cx - 1) + func_dec(14)
          });
          var_dd[func_dec(0)]({
            [func_dec(97)]: func_dec(14) + (var_cx + 1) + func_dec(13) + var_da + func_dec(14),
            [func_dec(100)]: func_dec(215)
          });
          if (var_cx + 1 < var_da) var_dd[func_dec(0)]({
            [func_dec(97)]: func_dec(216),
            [func_dec(100)]: func_dec(206) + (var_cx + 1) + func_dec(14)
          });
          var_dc[func_dec(0)](var_dd);
          var_dc[func_dec(0)]([{
            [func_dec(97)]: func_dec(142) + func_k(func_dec(143)) + func_dec(14),
            [func_dec(100)]: func_dec(144)
          }, {
            [func_dec(97)]: func_k(func_dec(217)),
            [func_dec(100)]: func_dec(203)
          }]);
          await func_l(var_cr, func_dec(218) + func_k(func_dec(221)) + func_dec(219) + var_cy[func_dec(208)] + func_dec(220), {
            [func_dec(123)]: var_dc
          }, var_cs);
        } else if (var_ct[func_dec(205)](func_dec(213))) {
          const var_df = var_ct[func_dec(58)](func_dec(213), func_dec(14));
          const var_dg = func_n(var_df);
          await func_l(var_cr, var_dg[func_dec(97)], var_dg[func_dec(148)], var_cs);
        } else if (var_ct[func_dec(205)](func_dec(184))) {
          const var_dh = var_ct[func_dec(58)](func_dec(184), func_dec(14));
          const var_di = (state[func_dec(2)][func_dec(149)] || [])[func_dec(150)](var_dk => var_dk[func_dec(125)] === var_dh);
          if (var_di) {
            var_di[func_dec(95)] = !var_di[func_dec(95)];
            if (!var_di[func_dec(95)]) {
              var_di[func_dec(222)] = null;
              var_di[func_dec(223)] = null;
            }
            await cachedD1Put(var_bf, func_dec(204), JSON[func_dec(20)](state[func_dec(2)]));
          }
          const var_dj = func_n(var_dh);
          await func_l(var_cr, var_dj[func_dec(97)], var_dj[func_dec(148)], var_cs);
        } else if (var_ct[func_dec(205)](func_dec(190))) {
          const var_dl = var_ct[func_dec(58)](func_dec(190), func_dec(14));
          const var_dm = var_dl[func_dec(58)](new RegExp(func_dec(154), func_dec(60)), func_dec(14))[func_dec(153)]();
          if (state[func_dec(155)][func_dec(149)]?.[var_dm]) {
            state[func_dec(155)][func_dec(149)][var_dm][func_dec(156)] = 0;
            state[func_dec(155)][func_dec(149)][var_dm][func_dec(224)] = 0;
            await cachedD1Put(var_bf, func_dec(225), JSON[func_dec(20)](state[func_dec(155)]));
          }
          const var_dn = func_n(var_dl);
          await func_l(var_cr, func_dec(226) + func_k(func_dec(228)) + func_dec(227) + var_dn[func_dec(97)] + func_dec(14), var_dn[func_dec(148)], var_cs);
        } else if (var_ct[func_dec(205)](func_dec(187))) {
          const var_do = var_ct[func_dec(58)](func_dec(187), func_dec(14));
          const var_dp = (state[func_dec(2)][func_dec(149)] || [])[func_dec(150)](var_dt => var_dt[func_dec(125)] === var_do);
          const var_dq = var_dp ? var_dp[func_dec(1)] : func_dec(14);
          const var_dr = func_dec(14) + func_k(func_dec(231)) + func_dec(229) + var_dq + func_dec(230);
          const var_ds = {
            [func_dec(123)]: [[{
              [func_dec(97)]: func_dec(226) + func_k(func_dec(232)) + func_dec(14),
              [func_dec(100)]: func_dec(233) + var_do + func_dec(14)
            }, {
              [func_dec(97)]: func_dec(234) + func_k(func_dec(235)) + func_dec(14),
              [func_dec(100)]: func_dec(213) + var_do + func_dec(14)
            }]]
          };
          await func_l(var_cr, var_dr, var_ds, var_cs);
        } else if (var_ct[func_dec(205)](func_dec(233))) {
          const var_du = var_ct[func_dec(58)](func_dec(233), func_dec(14));
          state[func_dec(2)][func_dec(149)] = (state[func_dec(2)][func_dec(149)] || [])[func_dec(236)](var_dv => var_dv[func_dec(125)] !== var_du);
          await cachedD1Put(var_bf, func_dec(204), JSON[func_dec(20)](state[func_dec(2)]));
          await func_l(var_cr, func_dec(226) + func_k(func_dec(237)) + func_dec(14), {
            [func_dec(123)]: [[{
              [func_dec(97)]: func_k(func_dec(152)),
              [func_dec(100)]: func_dec(141)
            }]]
          }, var_cs);
        } else if (var_ct === func_dec(144)) {
          var_bo[var_cr] = {
            [func_dec(238)]: func_dec(239)
          };
          var_bh?.[func_dec(201)](d1Put(var_bf, func_dec(128), JSON[func_dec(20)](var_bo))[func_dec(202)](() => {}));
          await func_l(var_cr, func_dec(142) + func_k(func_dec(240)) + func_dec(14), {
            [func_dec(123)]: [[{
              [func_dec(97)]: func_dec(234) + func_k(func_dec(235)) + func_dec(14),
              [func_dec(100)]: func_dec(141)
            }]]
          }, var_cs);
        } else if (var_ct === func_dec(147)) {
          await func_l(var_cr, func_dec(14) + func_k(func_dec(241)) + func_dec(14), {
            [func_dec(123)]: [[{
              [func_dec(97)]: func_dec(242),
              [func_dec(100)]: func_dec(243)
            }, {
              [func_dec(97)]: func_dec(244),
              [func_dec(100)]: func_dec(203)
            }]]
          }, var_cs);
        } else if (var_ct === func_dec(243)) {
          state[func_dec(2)][func_dec(5)] = Array[func_dec(126)](crypto[func_dec(246)](new Uint8Array(8)))[func_dec(210)](var_dw => var_dw[func_dec(124)](16)[func_dec(247)](2, func_dec(248)))[func_dec(245)](func_dec(14));
          state[func_dec(2)][func_dec(95)] = true;
          await cachedD1Put(var_bf, func_dec(204), JSON[func_dec(20)](state[func_dec(2)]));
          await func_l(var_cr, func_dec(14) + func_k(func_dec(250)) + func_dec(249) + state[func_dec(2)][func_dec(5)] + func_dec(177), {
            [func_dec(123)]: [[{
              [func_dec(97)]: func_k(func_dec(217)),
              [func_dec(100)]: func_dec(203)
            }]]
          }, var_cs);
        } else if (var_ct === func_dec(101) || var_ct === func_dec(104)) {
          const var_dx = state[func_dec(2)][func_dec(149)] || [];
          const var_dy = var_dx[func_dec(236)](var_eb => !var_eb[func_dec(95)] && (!var_eb[func_dec(159)] || Date[func_dec(160)]() <= var_eb[func_dec(159)]))[func_dec(208)];
          const var_dz = var_dx[func_dec(236)](var_ec => var_ec[func_dec(95)])[func_dec(208)];
          const var_ea = func_dec(251) + func_k(func_dec(99)) + func_dec(252) + var_dx[func_dec(208)] + func_dec(253) + var_dy + func_dec(254) + var_dz + func_dec(255) + state[func_dec(257)] + func_dec(256) + (state[func_dec(2)][func_dec(258)] || func_dec(259)) + func_dec(14);
          await func_l(var_cr, var_ea, {
            [func_dec(123)]: [[{
              [func_dec(97)]: func_k(func_dec(217)),
              [func_dec(100)]: func_dec(203)
            }]]
          }, var_cs);
        }
      }
    } else if (var_bi[func_dec(26)]) {
      const var_ed = var_bi[func_dec(26)];
      const var_ee = var_ed[func_dec(194)]?.[func_dec(125)];
      const var_ef = (var_ed[func_dec(97)] || func_dec(14))[func_dec(260)]();
      if (var_ee && var_bn) {
        const var_eg = var_bo[var_ee];
        if (var_eg && var_eg[func_dec(238)] === func_dec(239)) {
          const var_ei = crypto[func_dec(261)]();
          if (!state[func_dec(2)][func_dec(149)]) state[func_dec(2)][func_dec(149)] = [];
          state[func_dec(2)][func_dec(149)][func_dec(0)]({
            [func_dec(125)]: var_ei,
            [func_dec(1)]: var_ef,
            [func_dec(157)]: null,
            [func_dec(262)]: null,
            [func_dec(159)]: null,
            [func_dec(263)]: Date[func_dec(160)]()
          });
          await cachedD1Put(var_bf, func_dec(204), JSON[func_dec(20)](state[func_dec(2)]));
          var_bo[var_ee] = null;
          var_bh?.[func_dec(201)](d1Put(var_bf, func_dec(128), JSON[func_dec(20)](var_bo))[func_dec(202)](() => {}));
          const var_ej = func_n(var_ei);
          await func_l(var_ee, func_dec(226) + func_k(func_dec(264)) + func_dec(227) + var_ej[func_dec(97)] + func_dec(14), var_ej[func_dec(148)]);
          return new Response(func_dec(199), {
            [func_dec(200)]: 200
          });
        }
        if (var_ef === func_dec(265) || var_ef === func_dec(266)) {
          const var_ek = func_m();
          await func_l(var_ee, var_ek[func_dec(97)], var_ek[func_dec(148)]);
          return new Response(func_dec(199), {
            [func_dec(200)]: 200
          });
        }
        const var_eh = func_m();
        await func_l(var_ee, var_eh[func_dec(97)], var_eh[func_dec(148)]);
      } else if (var_ee) {
        const var_el = var_ef[func_dec(58)](new RegExp(func_dec(267), func_dec(14)), func_dec(14))[func_dec(58)](new RegExp(func_dec(268), func_dec(14)), func_dec(14))[func_dec(260)]();
        const var_em = (state[func_dec(2)][func_dec(149)] || [])[func_dec(150)](var_en => var_en[func_dec(125)] === var_el || var_en[func_dec(1)][func_dec(153)]() === var_el[func_dec(153)]());
        if (var_em) {
          const var_eo = func_n(var_em[func_dec(125)]);
          await func_l(var_ee, var_eo[func_dec(97)], var_eo[func_dec(148)]);
        } else {
          await func_l(var_ee, var_bk === func_dec(93) ? func_dec(269) : func_dec(270));
        }
      }
    }
    return new Response(func_dec(199), {
      [func_dec(200)]: 200
    });
  } catch (var_ep) {
    return new Response(func_dec(199), {
      [func_dec(200)]: 200
    });
  }
}
export { func_h as handleTelegramWebhook };