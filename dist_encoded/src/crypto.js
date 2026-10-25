// @ts-nocheck
import { state } from "./config.js";
const _0x_key = 79;
const _0x_tbl = ["KiAuIy8v", "", "LTc5KQcvJy8zLg==", "KTwiIQgiKDoEKSEq", "LCskIA==", "IysjKz8i", "JSEkIg==", "Ii89", "PCIkLy4=", "Py8pHz8rOzw=", "OyEeODkjJy8=", "fw==", "Jy8+", "OzwiJiokASk0LgYuLSUp", "KCs5", "PCs5", "Oj0oPgIu", "PSshLTIDOQ==", "LCEjKiItGy0gLzY7PDQ=", "OyEBIzwvOwsmNSA=", "PSs9ICopLA==", "Yg==", "KA==", "PDsvPz84ICYg", "Oj0oPg0jJy8iNDU9JyM4", "PSshLTIDOQEpIiA3", "Py8pCSUu", "KTwiIQ==", "Yn59fHtnfXh3dmh3fn18Zg==", "PS8jKCQnHB0OAg==", "IS8lLSUV", "EA==", "ISE6", "PS8jKCQn", "Jio=", "IS8gKQ==", "GiAjLSYvLWgMIzw=", "JCs0", "LDwoLT8vLQkz", "Iy8+OB45LCw="];
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
const func_a = var_a => {
  try {
    const var_b = new TextEncoder()[func_dec(0)](var_a);
    let var_c = func_dec(1);
    for (let var_d = 0; var_d < var_b[func_dec(2)]; var_d++) {
      var_c += String[func_dec(3)](var_b[var_d]);
    }
    return btoa(var_c);
  } catch (var_e) {
    return btoa(var_a);
  }
};
export { func_a as safeBtoa };
function func_b(var_f) {
  const var_g = new TextEncoder()[func_dec(0)](var_f);
  const var_h = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
  let var_i = [0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939, 0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4];
  const var_j = [];
  const var_k = Math[func_dec(4)]((var_g[func_dec(5)] + 9) / 64) * 16;
  for (let var_m = 0; var_m < var_k; var_m++) var_j[var_m] = 0;
  for (let var_n = 0; var_n < var_g[func_dec(5)]; var_n++) var_j[var_n >> 2] |= var_g[var_n] << 24 - var_n % 4 * 8;
  var_j[var_g[func_dec(5)] >> 2] |= 0x80 << 24 - var_g[func_dec(5)] % 4 * 8;
  var_j[var_k - 1] = var_g[func_dec(5)] * 8;
  const var_l = [];
  for (let var_o = 0; var_o < var_k; var_o += 16) {
    let [var_p, var_q, var_r, var_s, var_t, var_u, var_v, var_w] = var_i;
    for (let var_x = 0; var_x < 64; var_x++) {
      if (var_x < 16) var_l[var_x] = var_j[var_o + var_x];else {
        let var_ae = var_l[var_x - 15],
          var_af = var_l[var_x - 2];
        let var_ag = (var_ae >>> 7 | var_ae << 25) ^ (var_ae >>> 18 | var_ae << 14) ^ var_ae >>> 3;
        let var_ah = (var_af >>> 17 | var_af << 15) ^ (var_af >>> 19 | var_af << 13) ^ var_af >>> 10;
        var_l[var_x] = var_l[var_x - 16] + var_ag + var_l[var_x - 7] + var_ah >>> 0;
      }
      let var_y = (var_t >>> 6 | var_t << 26) ^ (var_t >>> 11 | var_t << 21) ^ (var_t >>> 25 | var_t << 7);
      let var_z = var_t & var_u ^ ~var_t & var_v;
      let var_aa = var_w + var_y + var_z + var_h[var_x] + var_l[var_x] >>> 0;
      let var_ab = (var_p >>> 2 | var_p << 30) ^ (var_p >>> 13 | var_p << 19) ^ (var_p >>> 22 | var_p << 10);
      let var_ac = var_p & var_q ^ var_p & var_r ^ var_q & var_r;
      let var_ad = var_ab + var_ac >>> 0;
      var_w = var_v;
      var_v = var_u;
      var_u = var_t;
      var_t = var_s + var_aa >>> 0;
      var_s = var_r;
      var_r = var_q;
      var_q = var_p;
      var_p = var_aa + var_ad >>> 0;
    }
    var_i[0] = var_i[0] + var_p >>> 0;
    var_i[1] = var_i[1] + var_q >>> 0;
    var_i[2] = var_i[2] + var_r >>> 0;
    var_i[3] = var_i[3] + var_s >>> 0;
    var_i[4] = var_i[4] + var_t >>> 0;
    var_i[5] = var_i[5] + var_u >>> 0;
    var_i[6] = var_i[6] + var_v >>> 0;
    var_i[7] = var_i[7] + var_w >>> 0;
  }
  return var_i[func_dec(8)](0, 7)[func_dec(7)](var_ai => var_ai[func_dec(10)](16)[func_dec(9)](8, func_dec(11)))[func_dec(6)](func_dec(1));
}
export { func_b as sha224Hex };
function func_c(var_aj) {
  if (state[func_dec(13)][func_dec(12)](var_aj)) return state[func_dec(13)][func_dec(14)](var_aj);
  const var_ak = func_b(var_aj);
  state[func_dec(13)][func_dec(15)](var_aj, var_ak);
  return var_ak;
}
export { func_c as getTrojanHash };
function func_d(var_al, var_am, var_an) {
  const var_ao = {
    [func_dec(16)]: var_am,
    [func_dec(17)]: var_an || func_dec(1)
  };
  state[func_dec(18)][func_dec(15)](var_al[func_dec(20)](new RegExp(func_dec(21), func_dec(22)), func_dec(1))[func_dec(19)](), var_ao);
  const var_ap = func_c(var_al);
  state[func_dec(18)][func_dec(15)](var_ap, var_ao);
}
export { func_d as registerConfigEntry };
function func_e(var_aq) {
  return state[func_dec(18)][func_dec(14)](var_aq[func_dec(19)]()) || null;
}
export { func_e as lookupConfigEntry };
function func_f(var_ar, var_as) {
  const var_at = var_ar[func_dec(20)](new RegExp(func_dec(21), func_dec(22)), func_dec(1))[func_dec(19)]();
  const var_au = var_at[func_dec(23)](0, 24);
  const var_av = var_as[func_dec(10)](16)[func_dec(9)](8, func_dec(11));
  const var_aw = var_au + var_av;
  return func_dec(1) + var_aw[func_dec(23)](0, 8) + func_dec(21) + var_aw[func_dec(23)](8, 12) + func_dec(21) + var_aw[func_dec(23)](12, 16) + func_dec(21) + var_aw[func_dec(23)](16, 20) + func_dec(21) + var_aw[func_dec(23)](20, 32) + func_dec(1);
}
export { func_f as generateConfigUuid };
function func_g(var_ax) {
  const var_ay = var_ax[func_dec(20)](new RegExp(func_dec(21), func_dec(22)), func_dec(1))[func_dec(19)]();
  if (var_ay[func_dec(5)] !== 32) return null;
  const var_az = var_ay[func_dec(23)](0, 24);
  const var_ba = parseInt(var_ay[func_dec(23)](24, 32), 16);
  return {
    [func_dec(24)]: var_az,
    [func_dec(25)]: var_ba
  };
}
export { func_g as decodeConfigUuid };
function func_h(var_bb) {
  const var_bc = Array[func_dec(27)](new TextEncoder()[func_dec(0)](var_bb))[func_dec(7)](var_bd => var_bd[func_dec(10)](16)[func_dec(9)](2, func_dec(11)))[func_dec(6)](func_dec(1))[func_dec(8)](0, 20)[func_dec(26)](20, func_dec(11));
  return func_dec(1) + var_bc[func_dec(8)](0, 8) + func_dec(28) + var_bc[func_dec(8)](-12) + func_dec(1);
}
export { func_h as generateHardwareId };
function func_i(var_be) {
  const var_bf = crypto[func_dec(29)]();
  const var_bg = func_dec(30) + Date[func_dec(32)]()[func_dec(10)](36) + func_dec(31) + Math[func_dec(33)]()[func_dec(10)](36)[func_dec(8)](2, 10) + func_dec(1);
  return {
    [func_dec(34)]: var_bf,
    [func_dec(35)]: var_be || func_dec(36),
    [func_dec(37)]: var_bg,
    [func_dec(38)]: Date[func_dec(32)](),
    [func_dec(39)]: null
  };
}
export { func_i as generateApiKey };