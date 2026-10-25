// @ts-nocheck
import { fetchT } from "../config.js";
const _0x_key = 79;
const _0x_tbl = ["KSchOC44", "KTwiIQ==", "Jy8+", "IysjKz8i", "PCIkLy4=", "Ii89", "OzwkIQ==", "PD4hJT8=", "PSs9ICopLA==", "dQ==", "FBIWEBYX", "KA==", "", "bA==", "PjsoPjI=", "KScoIC85", "PDosOD45ZSsoMys7PDRgKCU8JjM0PAwhKSlnKSA8PmosPD5hIzkt", "Jzo5PHFlZiE3ayQ/J2MvJCdmKiYyJidxKyUuJi07ejUxLjo4P2cpJj0pMjc2Yi4jPiQ9Oj4FKisrYS8iPjBkLjU1YyE/Kw==", "Iis5JCQu", "HwEeGA==", "JyssKC44Og==", "DCEjOC4kPWUTPzUq", "Lj49ICIpKDwuKStgJD4jJQ==", "LSEpNQ==", "PDo/JSUtIC4+", "JT0iIg==", "KSE/CSopIQ==", "PDosOD45", "PDsuLy45Og==", "OyEYPDsvOwsmNSA=", "LCE4Ij84MAsoIiA=", "LCYsPgglLS0GMg==", "PCs5", "KSIsKw==", "KTwiIQglLS0XKSwhOg==", "LCE4Ij84MA==", "GiAmIiQ9Jw==", "LCc5NQ==", "Jj09", "IDwq", "v9HB3A==", "KCs5", "Jzo5PHFlZiE3ayQ/J2MvJCdmIjQpK2A=", "cCgkKScuOnU0MiQ7Oz5gKCU8JjM0PGMtIjklPjsxBCkhKmIuJT8zZSE0NmkgPCo="];
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
export { var_a as ipGeoCache };
async function func_a(var_b, var_c) {
  const var_d = new Set([...var_b, ...var_c]);
  const var_e = Array[func_dec(1)](var_d)[func_dec(0)](var_f => var_f && !var_a[func_dec(2)](var_f));
  for (let var_g = 0; var_g < var_e[func_dec(3)]; var_g += 100) {
    const var_h = var_e[func_dec(4)](var_g, var_g + 100);
    const var_i = var_h[func_dec(5)](var_j => {
      const var_k = var_j[func_dec(7)](func_dec(9))[0][func_dec(8)](new RegExp(func_dec(10), func_dec(11)), func_dec(12))[func_dec(7)](func_dec(13))[0][func_dec(6)]();
      return {
        [func_dec(14)]: var_k,
        [func_dec(15)]: func_dec(16)
      };
    });
    try {
      const var_l = await fetchT(func_dec(17), {
        [func_dec(18)]: func_dec(19),
        [func_dec(20)]: {
          [func_dec(21)]: func_dec(22)
        },
        [func_dec(23)]: JSON[func_dec(24)](var_i)
      });
      const var_m = await var_l[func_dec(25)]();
      var_h[func_dec(26)]((var_n, var_o) => {
        const var_p = var_m[var_o];
        if (var_p && var_p[func_dec(27)] === func_dec(28)) {
          const var_q = var_p[func_dec(30)][func_dec(29)]()[func_dec(7)](func_dec(12))[func_dec(5)](var_r => 127397 + var_r[func_dec(31)]());
          var_a[func_dec(32)](var_n, {
            [func_dec(33)]: String[func_dec(34)](...var_q),
            [func_dec(35)]: var_p[func_dec(35)] || func_dec(36),
            [func_dec(30)]: var_p[func_dec(30)] || func_dec(12),
            [func_dec(37)]: var_p[func_dec(37)] || func_dec(12),
            [func_dec(38)]: var_p[func_dec(38)] || var_p[func_dec(39)] || func_dec(12)
          });
        } else {
          var_a[func_dec(32)](var_n, {
            [func_dec(33)]: func_dec(40),
            [func_dec(35)]: func_dec(36),
            [func_dec(30)]: func_dec(12),
            [func_dec(37)]: func_dec(12),
            [func_dec(38)]: func_dec(12)
          });
        }
      });
    } catch (var_s) {
      var_h[func_dec(26)](var_t => {
        if (!var_a[func_dec(2)](var_t)) {
          var_a[func_dec(32)](var_t, {
            [func_dec(33)]: func_dec(40),
            [func_dec(35)]: func_dec(36),
            [func_dec(30)]: func_dec(12),
            [func_dec(37)]: func_dec(12),
            [func_dec(38)]: func_dec(12)
          });
        }
      });
    }
  }
}
export { func_a as preloadIpFlags };
function func_b(var_u) {
  if (!var_u) return {
    [func_dec(33)]: func_dec(40),
    [func_dec(35)]: func_dec(36),
    [func_dec(30)]: func_dec(12),
    [func_dec(37)]: func_dec(12),
    [func_dec(38)]: func_dec(12)
  };
  const var_v = var_u[func_dec(7)](func_dec(9))[0][func_dec(8)](new RegExp(func_dec(10), func_dec(11)), func_dec(12))[func_dec(7)](func_dec(13))[0][func_dec(6)]();
  return var_a[func_dec(41)](var_u) || var_a[func_dec(41)](var_v) || {
    [func_dec(33)]: func_dec(40),
    [func_dec(35)]: func_dec(36),
    [func_dec(30)]: func_dec(12),
    [func_dec(37)]: func_dec(12),
    [func_dec(38)]: func_dec(12)
  };
}
export { func_b as getGeoInfo };
function func_c(var_w) {
  return func_b(var_w)[func_dec(33)] || func_dec(40);
}
export { func_c as getEmojiFlag };
async function func_d(var_x) {
  if (!var_x) return null;
  const var_y = var_x[func_dec(7)](func_dec(9))[0][func_dec(8)](new RegExp(func_dec(10), func_dec(11)), func_dec(12))[func_dec(7)](func_dec(13))[0][func_dec(6)]();
  try {
    const var_z = await fetchT(func_dec(42) + var_y + func_dec(43));
    const var_aa = await var_z[func_dec(25)]();
    if (var_aa && var_aa[func_dec(27)] === func_dec(28)) {
      const var_ab = var_aa[func_dec(30)][func_dec(29)]()[func_dec(7)](func_dec(12))[func_dec(5)](var_ac => 127397 + var_ac[func_dec(31)]());
      return {
        [func_dec(33)]: String[func_dec(34)](...var_ab),
        [func_dec(35)]: var_aa[func_dec(35)] || func_dec(36),
        [func_dec(30)]: var_aa[func_dec(30)] || func_dec(12),
        [func_dec(37)]: var_aa[func_dec(37)] || func_dec(12),
        [func_dec(38)]: var_aa[func_dec(38)] || var_aa[func_dec(39)] || func_dec(12)
      };
    }
  } catch (var_ad) {}
  return null;
}
export { func_d as fetchIpGeoData };