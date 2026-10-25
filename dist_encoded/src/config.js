// @ts-nocheck
const _0x_key = 79;
const _0x_tbl = ["fGB8Yns=", "KTwiIQgiKDoEKSEq", "IS8gKQ==", "", "Lj4kHiQ/PS0=", "PDcjLw==", "Ii8kIj8vJykpJSAHIT44", "Jzo5PDhwZmcwMTJhOy85JT48ZiQpKGNuJTg/OjpyaGkyODljKCQpIi01aCYgIw==", "LS8uJz46Gy0rJzw=", "LDs+OCQnGy0rJzw=", "Ii8+OC44Ai0+", "LiogJSU=", "Iis5PiIpBycjIw==", "OycgKWUjOg==", "LCIoLSUDOTs=", "PCIsOi4EJiwiNQ==", "Kys7JSgvACw=", "IiEpKQ==", "LiI9JCo=", "LikoIj8=", "LCY/IyYv", "PCEuJy4+GSc1MjY=", "e3p+", "LDs+OCQnDSY0", "Jzo5PDhwZmckKio6KisgKjgsZSMoNmEtIiFkLic7ajcwKjw0", "PSs+Iyc8LAE3", "fmB8YnpkeA==", "LC8+LyouLA==", "KiAsLicvBjgzdw==", "KiAsLicvBjgzdA==", "OykZIyAvJw==", "OykOJCo+ACw=", "OykMKCYjJwEj", "LCgMLyglPCYzDyE=", "LCgMPCIeJiMiKA==", "LCgaIzkhLDoJJygq", "Jj0dLT45LCw=", "PCchKSU+CCQiNDE8", "KCc5JD4oGy03KQ==", "Jjo+NS4oLCMvI2ohLyUtJQ==", "IS8gKRg+OykzIyI2", "KysrLT4mPQ==", "IS8gKRs4LC4uPg==", "DCE/KQ==", "OykPIz8GKCYg", "KS8=", "Oj0oPjg=", "PDsvGTgvOwkgIys7", "LDs+OCQnGSkpIykaPCE=", "IycgJT8eJjwmKhcqPw==", "KjY9JTkzBDs=", "IycjJy4uGSkpIyk8", "JzsvHCokLCQSNCk=", "PDcjLwo6IAMiPw==", "Py8jKScLOSEMIzw8", "IS85en8aOy0hLz0=", "KiAsLicvDSE1IyY7DSIiLSMuOw==", "LDs+OCQnGycyMiwhKQ==", "Oj4+ODkvKCUSNCw=", "Ljs5Ix46LSkzIw==", "Ljs5Ix46LSkzIwMgPCAtPw==", "KiAuIy8vLQ==", "KS8mKQglJy4uITY=", "v9HexmsxPDsmISAy", "KiAsLicvLQ==", "v9HeyWsxLDA3Lzc2Mw==", "Ii8kIj8vJykpJSACISkp", "LiIhIzwYLCUoMiALKz0gJDM=", "Ljs5Ixs4PCYiFCAjLzQ/", "PDc+DyQkLyEg", "Jj0iICo+LBszJzc7GiQhLg==", "Li05JT0vCicpKCAsOiQjJTk=", "BgALAAINARwYDhEbHg==", "AB4IAhQdGg==", "OjskKB45KC8i", "Li05JT0vCicpKDY=", "Li05JT0vDS0xLyYqByk=", "LCEjKiItGy0gLzY7PDQ=", "OzwiJiokASk0LgYuLSUp", "PDc+GTgrLi0EJyYnKw==", "Iy8+OBgzOh00JyIqHTQiKA==", "PDc+DyQkLyEgBSQsJigYIics", "PDc+GTgrLi0EJyYnKxklJi8=", "LS8uJz46ADgEJyYnKw==", "LS8uJz46ADgEJyYnKxklJi8=", "Iy8+OBkvJSk+FTIqKz0=", "OycgKSQ/PQ==", "KScjLScmMA==", "PS8uKQ==", "ID4oPio+ICcp", "KTsjLz8jJiY=", "YjokIS4lPDw=", "Ii81", "OiApKS0jJy0j", "PCcqIiom", "LiwiPj8vLQ==", "LiwiPj8=", "PSssPyQk", "LiopCT0vJzwLLzY7KyMpOQ==", "ICAuKQ==", "PSsgIz0vDD4iKDEDJz44LiQsOg==", "LTc5KTg=", "ITsgLi44", "KSIiIzk=", "PSs8Pw==", "PD4hJT8=", "OyEEHwQZPTouKCI=", "Gw==", "Iy8+OA8rMA==", "Kww0OC45", "KxwoPTg=", "JiAuID4uLDs=", "d34=", "d351fA==", "d3Z1fA==", "fX54fg==", "fX51fg==", "fX51eg==", "fX50eQ==", "OyEeODkjJy8=", "ISEjKQ==", "OyI+"];
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
const var_a = func_dec(0);
export { var_a as CURRENT_VERSION };
const func_a = () => String[func_dec(1)](118, 108, 101, 115, 115);
export { func_a as getAlpha };
const func_b = () => String[func_dec(1)](116, 114, 111, 106, 97, 110);
export { func_b as getBeta };
const func_c = () => String[func_dec(1)](99, 108, 97, 115, 104);
export { func_c as getGamma };
const var_b = 1073741824 / 6000;
export { var_b as REQ_BYTES_EST };
const var_c = {
  [func_dec(2)]: func_dec(3),
  [func_dec(4)]: func_dec(5),
  [func_dec(6)]: func_dec(7),
  [func_dec(8)]: func_dec(3),
  [func_dec(9)]: func_dec(3),
  [func_dec(10)]: func_dec(11),
  [func_dec(12)]: func_dec(13),
  [func_dec(14)]: func_dec(3),
  [func_dec(15)]: func_dec(3),
  [func_dec(16)]: func_dec(3),
  [func_dec(17)]: func_dec(18),
  [func_dec(19)]: func_dec(20),
  [func_dec(21)]: func_dec(22),
  [func_dec(23)]: func_dec(24),
  [func_dec(25)]: func_dec(26),
  [func_dec(27)]: func_dec(3),
  [func_dec(28)]: false,
  [func_dec(29)]: false,
  [func_dec(30)]: func_dec(3),
  [func_dec(31)]: func_dec(3),
  [func_dec(32)]: func_dec(3),
  [func_dec(33)]: func_dec(3),
  [func_dec(34)]: func_dec(3),
  [func_dec(35)]: func_dec(3),
  [func_dec(36)]: false,
  [func_dec(37)]: false,
  [func_dec(38)]: func_dec(39),
  [func_dec(40)]: func_dec(41),
  [func_dec(42)]: func_dec(43),
  [func_dec(44)]: func_dec(45),
  [func_dec(46)]: [],
  [func_dec(47)]: func_dec(3),
  [func_dec(48)]: func_dec(3),
  [func_dec(49)]: 0,
  [func_dec(50)]: 0,
  [func_dec(51)]: [],
  [func_dec(52)]: func_dec(3),
  [func_dec(53)]: func_dec(3),
  [func_dec(54)]: [],
  [func_dec(55)]: func_dec(3),
  [func_dec(56)]: false,
  [func_dec(57)]: func_dec(3),
  [func_dec(58)]: func_dec(3),
  [func_dec(59)]: false,
  [func_dec(60)]: func_dec(61),
  [func_dec(62)]: [{
    [func_dec(2)]: func_dec(63),
    [func_dec(64)]: true
  }, {
    [func_dec(2)]: func_dec(65),
    [func_dec(64)]: true
  }],
  [func_dec(66)]: false,
  [func_dec(67)]: true,
  [func_dec(68)]: true
};
export { var_c as SYSTEM_DEFAULTS };
const var_d = {
  [func_dec(69)]: {
    ...var_c
  },
  [func_dec(70)]: 0,
  [func_dec(71)]: 0,
  [func_dec(72)]: 0,
  [func_dec(73)]: 0,
  [func_dec(74)]: new Map(),
  [func_dec(75)]: new Map(),
  [func_dec(76)]: func_dec(3),
  [func_dec(77)]: new Map(),
  [func_dec(78)]: new Map(),
  [func_dec(79)]: {
    [func_dec(46)]: {}
  },
  [func_dec(80)]: 0,
  [func_dec(81)]: 0,
  [func_dec(82)]: 0,
  [func_dec(83)]: null,
  [func_dec(84)]: 0,
  [func_dec(85)]: 0
};
export { var_d as state };
const var_e = 10000;
export { var_e as CACHE_TTL_CONFIG };
const var_f = 10000;
export { var_f as CACHE_TTL_USAGE };
const var_g = 30000;
export { var_g as CACHE_TTL_BACKUP_IP };
const var_h = 5000;
export { var_h as TCP_OPEN_TIMEOUT_MS };
const var_i = 5000;
export { var_i as TCP_WRITE_TIMEOUT_MS };
const var_j = 7000;
export { var_j as TCP_FIRST_READ_TIMEOUT_MS };
const var_k = 15000;
export { var_k as UPSTREAM_WRITE_TIMEOUT_MS };
const var_l = 120000;
export { var_l as NAHAN_RUNNER_LEASE_TTL_MS };
const var_m = 4 * 1024 * 1024;
export { var_m as UPSTREAM_QUEUE_MAX_BYTES };
const var_n = 256;
export { var_n as UPSTREAM_QUEUE_MAX_ITEMS };
function func_d() {
  try {
    if (var_d[func_dec(72)] > 200 || var_d[func_dec(73)] > 400) return 2;
    if (var_d[func_dec(72)] > 100 || var_d[func_dec(73)] > 200) return 1;
  } catch (var_o) {}
  return 0;
}
export { func_d as breakerLevel };
function func_e(var_p) {
  return new Promise(var_q => setTimeout(var_q, var_p));
}
export { func_e as sleepMs };
function func_f(var_r, var_s, var_t) {
  let var_u = null;
  const var_v = new Promise((var_w, var_x) => {
    var_u = setTimeout(() => {
      try {
        var_x(new Error(var_t || func_dec(86)));
      } catch (var_y) {}
    }, var_s);
  });
  return Promise[func_dec(88)]([var_r, var_v])[func_dec(87)](() => {
    try {
      if (var_u) clearTimeout(var_u);
    } catch (var_z) {}
  });
}
export { func_f as withTimeout };
async function func_g(var_aa, var_ab, var_ac, var_ad = func_dec(89)) {
  let var_ae = null;
  let var_af = false;
  const var_ag = new Promise((var_ah, var_ai) => {
    var_ae = setTimeout(() => {
      if (var_af) return;
      try {
        if (typeof var_ac === func_dec(90)) var_ac();
      } catch (var_aj) {}
      var_ai(new Error(func_dec(3) + var_ad + func_dec(91)));
    }, var_ab);
  });
  try {
    return await Promise[func_dec(88)]([var_aa, var_ag]);
  } finally {
    var_af = true;
    if (var_ae) {
      try {
        clearTimeout(var_ae);
      } catch (var_ak) {}
    }
  }
}
export { func_g as withDeadline };
async function func_h(var_al, var_am = {}, var_an = 10000) {
  const var_ao = Math[func_dec(92)](1, Number(var_an) || 10000);
  let var_ap = null;
  let var_aq = null;
  let var_ar = null;
  let var_as = null;
  try {
    if (typeof AbortController !== func_dec(93)) {
      var_ap = new AbortController();
      var_ar = var_am && var_am[func_dec(94)] ? var_am[func_dec(94)] : null;
      if (var_ar) {
        if (var_ar[func_dec(95)]) var_ap[func_dec(96)](var_ar[func_dec(97)]);else {
          var_as = () => {
            try {
              var_ap[func_dec(96)](var_ar[func_dec(97)]);
            } catch (var_at) {}
          };
          try {
            var_ar[func_dec(98)](func_dec(96), var_as, {
              [func_dec(99)]: true
            });
          } catch (var_au) {}
        }
      }
      var_aq = setTimeout(() => {
        try {
          var_ap[func_dec(96)]();
        } catch (var_av) {}
      }, var_ao);
      return await fetch(var_al, {
        ...var_am,
        [func_dec(94)]: var_ap[func_dec(94)]
      });
    }
    return await fetch(var_al, {
      ...var_am
    });
  } finally {
    if (var_aq) {
      try {
        clearTimeout(var_aq);
      } catch (var_aw) {}
    }
    if (var_ar && var_as) {
      try {
        var_ar[func_dec(100)](func_dec(96), var_as);
      } catch (var_ax) {}
    }
  }
}
export { func_h as fetchT };
function func_i(var_ay) {
  try {
    if (!var_ay) return 0;
    if (typeof var_ay[func_dec(101)] === func_dec(102) && var_ay[func_dec(101)] >= 0) return Math[func_dec(103)](var_ay[func_dec(101)]);
    return Math[func_dec(103)]((var_ay[func_dec(104)] || 0) * var_b);
  } catch (var_az) {
    return 0;
  }
}
export { func_i as usageTotalBytes };
function func_j(var_ba, var_bb) {
  try {
    if (!var_ba) return 0;
    const var_bc = var_bb || new Date()[func_dec(106)]()[func_dec(105)](func_dec(107))[0];
    if ((var_ba[func_dec(108)] || func_dec(3)) !== var_bc) return 0;
    if (typeof var_ba[func_dec(109)] === func_dec(102) && var_ba[func_dec(109)] >= 0) return Math[func_dec(103)](var_ba[func_dec(109)]);
    return Math[func_dec(103)]((var_ba[func_dec(110)] || 0) * var_b);
  } catch (var_bd) {
    return 0;
  }
}
export { func_j as usageDailyBytes };
function func_k(var_be) {
  try {
    return var_be ? Math[func_dec(103)](var_be * var_b) : 0;
  } catch (var_bf) {
    return 0;
  }
}
export { func_k as limitReqToBytes };
function func_l(var_bg) {
  return [func_dec(112), func_dec(113), func_dec(114), func_dec(115), func_dec(116), func_dec(117), func_dec(118)][func_dec(111)](var_bg[func_dec(119)]()) ? func_dec(120) : func_dec(121);
}
export { func_l as getTransportParams };