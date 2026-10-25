// @ts-nocheck
import { connect } from "cloudflare:sockets";
import { state, fetchT, usageTotalBytes, limitReqToBytes, REQ_BYTES_EST, TCP_OPEN_TIMEOUT_MS, TCP_WRITE_TIMEOUT_MS, UPSTREAM_WRITE_TIMEOUT_MS, UPSTREAM_QUEUE_MAX_BYTES, UPSTREAM_QUEUE_MAX_ITEMS, withDeadline } from "./config.js";
import { cachedD1Put, logActivity } from "./db.js";
import { lookupConfigEntry, decodeConfigUuid, getTrojanHash } from "./crypto.js";
import { relayKeyOf, filterQuarantinedRelays, filterAiQuarantinedTokens, orderAiFirstTokens, recordRelaySuccess, recordRelayFailure, recordAiSuccess, recordAiFailure, isAiDomain, sniffSniFromHello } from "./relays.js";
import { getAllProfiles, getEffectivePips } from "./subs/transformers.js";
const _0x_key = 79;
const _0x_tbl = ["ISE6", "KCs5", "Oz0=", "IQ==", "PCs5", "PCc3KQ==", "LCIoLTk=", "PSsrOTgv", "Oy8/PCI+", "ICU=", "LCIiPy4=", "KTsjLz8jJiY=", "PSshKSo5LAQoJS4=", "ODwkOC4=", "PCEuJy4+ZD81LzEqPGA5JSs/KS4qJC0iKA==", "PCEuJy4+ZD81LzEq", "PDc+GTgrLi0EJyYnKw==", "Oj0oPjg=", "PSs8Pw==", "KxwoPTg=", "LTc5KTg=", "Kww0OC45", "Iy8+OA8rMA==", "PD4hJT8=", "OyEEHwQZPTouKCI=", "Gw==", "ITsgLi44", "KSIiIzk=", "Iy8+OBgzOh00JyIqHTQiKA==", "BgEZEw8I", "PDc+DyQkLyEg", "IysjKz8i", "KSE/CSopIQ==", "OyEBIzwvOwsmNSA=", "PSs9ICopLA==", "Jio=", "Yg==", "KA==", "", "Jj0dLT45LCw=", "KjY9JTkzBDs=", "CjY9JTkrPSEoKGUrLzkpazgsKSQuICtuZQ==", "Zg==", "OyEBIygrJS0DJzEqHTk+IiQu", "IycgJT8eJjwmKhcqPw==", "OyELJTMvLQ==", "GzwsKi0jKmgrLygmOm0pMyksLSMjIW9m", "CAxtY2s=", "CAxk", "Kyc+LSkmLCwVIyQ8ISM=", "Kyc+LSkmLCwGMg==", "OC8kOB4kPSEr", "LC85LyM=", "Gj0oPmsLPDwoawEmPSwuJy8t", "Gj0oPmto", "bW5l", "Zm4pJTgrKyQiIn9v", "IS8gKQ==", "OykZIyAvJw==", "OykMKCYjJwEj", "OykOJCo+ACw=", "rdTto/PFaXQleBA8Kz9sCj89J2oCLDwvLyAuLnVnJXhPRb7S3e9qdSp5EzYqPHdwZCh3aA==", "Rb7Syt9qdSp5DwF1cmIudWp1KygiIHE=", "c2EuIy8vd0K32dbSbnEudRgsKTQpK3VyYi51ag==", "Jzo5PDhwZmcmNixhOiggLi07KSpoKj0pYi4kPg==", "YD0oIi8HLDs0JyIq", "Iis5JCQu", "HwEeGA==", "JyssKC44Og==", "DCEjOC4kPWUTPzUq", "Lj49ICIpKDwuKStgJD4jJQ==", "LSEpNQ==", "PDo/JSUtIC4+", "LCYsOBQjLQ==", "Oys1OA==", "Py8/Py4VJCcjIw==", "BxoAAA==", "PDc+EyglJy4uIQ==", "PDc+Ez45KC8i", "OS8hOS45", "Li0uKTs+", "LScjLTkzHTE3Iw==", "Ljw/LTIoPC4hIzc=", "PDosOD45", "OCsvHyQpIi0z", "Li05JT0vCicpKCAsOiQjJTk=", "AB4IAhQdGg==", "LiopCT0vJzwLLzY7KyMpOQ==", "Ii81", "Li05JT0vCicpKDY=", "Kjw/Izk=", "PSs+Iyc8LA==", "Iis+PyotLA==", "LTc5KQcvJy8zLg==", "Ky85LQ==", "OyYoIg==", "PCsjKA==", "JSEkIg==", "Ii89", "KTwiIQ==", "PCIkLy4=", "Py8pHz8rOzw=", "OyEeODkjJy8=", "fw==", "Oj0oPgIu", "KScjKA==", "PSshLTIDOQ==", "PzwiNDIDOQ==", "PDosPj85HiEzLg==", "Oj0oPg0jJy8iNDU9JyM4", "PSshLTIDOQEpIiA3", "LCEjIgcjJCEz", "OjskKB45KC8i", "LCEjIi4pPTs=", "Iy8+OA==", "KCs5GSIkPXlx", "YQ==", "KysuIy8v", "dQ==", "Oys+OA==", "EWYWLWYwCGUddmh2YxBnF2RgYxwnaDUPYBYWMXtkOmI=", "ERUsYTELZBJ3a3xiE2Zo", "LDs+OCQnDSY0", "PCssPigiGSk1Jyg8", "Ozc9KQ==", "Dg==", "Lj49ICIpKDwuKStgKiM/ZiA6Jyk=", "JT0iIg==", "DiA+Oy44", "JyE+OCUrJC0=", "PyE/OA==", "ID4oIi4u", "Kyc/KSg+ZCc3Iys=", "KSchOC44", "FBI/ECVmchVs", "OzwkIQ==", "LS8uJz46Gy0rJzw=", "LDs+OCQnGy0rJzw=", "IiE7KS8=", "Iyc+OA==", "LCYsPgglLS0GMg==", "Liw+", "Iicj", "bA==", "JyE+OA==", "PSshLTJnJjgiKA==", "Lic=", "KCs5GzkjPS01", "ODwkOCooJS0=", "KScjLScmMA==", "Pyc9KR8l", "PSssKCooJS0=", "LiwiPj8="];
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
export { var_a as WS_RATE };
function func_a(var_b) {
  try {
    const var_c = Date[func_dec(0)]();
    let var_d = var_a[func_dec(1)](var_b);
    if (!var_d || var_c - var_d[func_dec(2)] > 60000) {
      var_d = {
        [func_dec(3)]: 0,
        [func_dec(2)]: var_c
      };
      var_a[func_dec(4)](var_b, var_d);
    }
    var_d[func_dec(3)]++;
    if (var_a[func_dec(5)] > 10000) var_a[func_dec(6)]();
    if (var_d[func_dec(3)] > 400) return func_dec(7);
    if (var_d[func_dec(3)] > 120) return func_dec(8);
    return func_dec(9);
  } catch (var_e) {
    return func_dec(9);
  }
}
export { func_a as wsRateCheck };
function func_b(var_f) {
  try {
    if (var_f && typeof var_f[func_dec(10)] === func_dec(11)) var_f[func_dec(10)]();
  } catch (var_g) {}
}
function func_c(var_h) {
  try {
    if (var_h && typeof var_h[func_dec(12)] === func_dec(11)) var_h[func_dec(12)]();
  } catch (var_i) {}
}
async function func_d(var_j, var_k, var_l, var_m = TCP_WRITE_TIMEOUT_MS) {
  if (!var_k || typeof var_k[func_dec(13)] !== func_dec(11)) throw new Error(func_dec(14));
  return await withDeadline(var_k[func_dec(13)](var_l), var_m, () => func_b(var_j), func_dec(15));
}
function func_e(var_n, var_o, var_p, var_q) {
  if (!state[func_dec(16)]) state[func_dec(16)] = {
    [func_dec(17)]: {}
  };
  if (!state[func_dec(16)][func_dec(17)]) state[func_dec(16)][func_dec(17)] = {};
  if (!state[func_dec(16)][func_dec(17)][var_n]) {
    state[func_dec(16)][func_dec(17)][var_n] = {
      [func_dec(18)]: 0,
      [func_dec(19)]: 0,
      [func_dec(20)]: 0,
      [func_dec(21)]: 0,
      [func_dec(22)]: new Date()[func_dec(24)]()[func_dec(23)](func_dec(25))[0]
    };
  }
  let var_r = state[func_dec(16)][func_dec(17)][var_n];
  let var_s = new Date()[func_dec(24)]()[func_dec(23)](func_dec(25))[0];
  if (var_r[func_dec(22)] !== var_s) {
    var_r[func_dec(19)] = 0;
    var_r[func_dec(21)] = 0;
    var_r[func_dec(22)] = var_s;
  }
  if (var_r[func_dec(18)] === undefined) var_r[func_dec(18)] = 0;
  if (var_r[func_dec(19)] === undefined) var_r[func_dec(19)] = 0;
  if (typeof var_r[func_dec(20)] !== func_dec(26) || var_r[func_dec(20)] < 0) var_r[func_dec(20)] = Math[func_dec(27)]((var_r[func_dec(18)] || 0) * REQ_BYTES_EST);
  if (typeof var_r[func_dec(21)] !== func_dec(26) || var_r[func_dec(21)] < 0) {
    var_r[func_dec(21)] = var_r[func_dec(22)] === var_s ? Math[func_dec(27)]((var_r[func_dec(19)] || 0) * REQ_BYTES_EST) : 0;
  }
  if (var_o === 0) {
    var_r[func_dec(18)] += 1;
    var_r[func_dec(19)] += 1;
  } else if (typeof var_o === func_dec(26) && var_o > 0) {
    var_r[func_dec(20)] += Math[func_dec(27)](var_o);
    var_r[func_dec(21)] += Math[func_dec(27)](var_o);
  }
  const var_t = Date[func_dec(0)]();
  if (var_t - state[func_dec(28)] > 30000) {
    state[func_dec(28)] = var_t;
    if (var_p && var_p[func_dec(29)]) {
      let var_u = false;
      if (state[func_dec(30)][func_dec(17)] && state[func_dec(30)][func_dec(17)][func_dec(31)] > 0) {
        state[func_dec(30)][func_dec(17)][func_dec(32)](var_v => {
          let var_w = var_v[func_dec(35)][func_dec(34)](new RegExp(func_dec(36), func_dec(37)), func_dec(38))[func_dec(33)]();
          let var_x = state[func_dec(16)][func_dec(17)][var_w];
          if (!var_v[func_dec(39)]) {
            let var_y = null;
            if (var_v[func_dec(40)] && Date[func_dec(0)]() > var_v[func_dec(40)]) {
              var_y = func_dec(41) + new Date(var_v[func_dec(40)])[func_dec(43)]() + func_dec(42);
            } else if (var_x && var_v[func_dec(44)] && usageTotalBytes(var_x) >= limitReqToBytes(var_v[func_dec(44)])) {
              let var_z = (usageTotalBytes(var_x) / 1073741824)[func_dec(45)](2);
              let var_aa = (limitReqToBytes(var_v[func_dec(44)]) / 1073741824)[func_dec(45)](2);
              var_y = func_dec(46) + var_z + func_dec(47) + var_aa + func_dec(48);
            }
            if (var_y) {
              var_v[func_dec(39)] = true;
              var_v[func_dec(49)] = var_y;
              var_v[func_dec(50)] = Date[func_dec(0)]();
              var_u = true;
              var_q?.[func_dec(51)](logActivity(var_p, func_dec(53), func_dec(54) + var_v[func_dec(57)] + func_dec(55) + var_v[func_dec(35)] + func_dec(56) + var_y + func_dec(38))[func_dec(52)](() => {}));
              if (state[func_dec(30)][func_dec(58)] && (state[func_dec(30)][func_dec(59)] || state[func_dec(30)][func_dec(60)])) {
                const var_ab = func_dec(61) + var_v[func_dec(57)] + func_dec(62) + var_v[func_dec(35)] + func_dec(63) + var_y + func_dec(38);
                const var_ac = state[func_dec(30)][func_dec(59)] || state[func_dec(30)][func_dec(60)];
                var_q?.[func_dec(51)](fetchT(func_dec(64) + state[func_dec(30)][func_dec(58)] + func_dec(65), {
                  [func_dec(66)]: func_dec(67),
                  [func_dec(68)]: {
                    [func_dec(69)]: func_dec(70)
                  },
                  [func_dec(71)]: JSON[func_dec(72)]({
                    [func_dec(73)]: var_ac,
                    [func_dec(74)]: var_ab,
                    [func_dec(75)]: func_dec(76)
                  })
                })[func_dec(52)](() => {}));
              }
            }
          }
        });
      }
      if (var_u) {
        var_q?.[func_dec(51)](cachedD1Put(var_p, func_dec(77), JSON[func_dec(72)](state[func_dec(30)]))[func_dec(52)](() => {}));
      }
      var_q?.[func_dec(51)](cachedD1Put(var_p, func_dec(78), JSON[func_dec(72)](state[func_dec(16)]))[func_dec(52)](() => {}));
    }
  }
}
export { func_e as trackUsage };
async function func_f(var_ad, var_ae, var_af) {
  const [var_ag, var_ah] = Object[func_dec(79)](new WebSocketPair());
  var_ah[func_dec(80)]();
  var_ah[func_dec(81)] = func_dec(82);
  func_g(var_ah, var_ad, var_ae, var_af);
  return new Response(null, {
    [func_dec(83)]: 101,
    [func_dec(84)]: var_ag
  });
}
export { func_f as processTelemetryStream };
async function func_g(var_ai, var_aj, var_ak, var_al) {
  state[func_dec(85)]++;
  state[func_dec(86)]++;
  let var_am = 0;
  let var_an = 0;
  let var_ao = null;
  let var_ap = false;
  let var_aq = 0;
  let var_ar = 0;
  let var_as = null;
  var_ai[func_dec(87)](func_dec(10), () => {
    state[func_dec(85)]--;
    state[func_dec(86)] = Math[func_dec(88)](0, state[func_dec(86)] - 1);
    if (var_as) {
      let var_ax = state[func_dec(89)][func_dec(1)](var_as) || 0;
      if (var_ax > 0) state[func_dec(89)][func_dec(4)](var_as, var_ax - 1);
    }
    try {
      const var_ay = var_am + var_an;
      if (var_as && var_ay > 0) {
        func_e(var_as, var_ay, var_aj, var_ak);
      }
    } catch (var_az) {}
  });
  var_ai[func_dec(87)](func_dec(90), () => {});
  let var_at,
    var_au,
    var_av = true,
    var_aw = Promise[func_dec(91)]();
  var_ai[func_dec(87)](func_dec(92), var_ba => {
    const var_bb = var_ba[func_dec(94)]?.[func_dec(93)] || 0;
    var_aq += var_bb;
    var_ar++;
    if (var_aq > UPSTREAM_QUEUE_MAX_BYTES || var_ar > UPSTREAM_QUEUE_MAX_ITEMS) {
      try {
        var_ai[func_dec(10)]();
      } catch (var_bc) {}
      return;
    }
    var_aw = var_aw[func_dec(95)](async () => {
      var_aq = Math[func_dec(88)](0, var_aq - var_bb);
      var_ar = Math[func_dec(88)](0, var_ar - 1);
      try {
        if (var_av) {
          var_av = false;
          const var_bd = await func_h(var_ba[func_dec(94)], var_al);
          if (var_bd) var_ai[func_dec(96)](new Uint8Array([0, 0]));
        } else if (var_au) {
          try {
            await func_d(var_at, var_au, var_ba[func_dec(94)], UPSTREAM_WRITE_TIMEOUT_MS);
          } catch (var_be) {
            func_b(var_at);
            func_c(var_au);
            var_au = null;
            try {
              var_ai[func_dec(10)]();
            } catch (var_bf) {}
            return;
          }
          var_am += var_ba[func_dec(94)]?.[func_dec(93)] || 0;
        }
      } catch (var_bg) {
        var_ai[func_dec(10)]();
      }
    });
  });
  async function func_h(var_bh, var_bi) {
    const var_bj = new Uint8Array(var_bh);
    let var_bk = func_dec(38),
      var_bl = 0,
      var_bm = 0,
      var_bn = false,
      var_bo = null;
    if (var_bj[0] === 0x00) {
      var_bn = true;
      let var_bs = Array[func_dec(99)](var_bj[func_dec(100)](1, 17))[func_dec(98)](var_cb => var_cb[func_dec(102)](16)[func_dec(101)](2, func_dec(103)))[func_dec(97)](func_dec(38));
      let var_bt = lookupConfigEntry(var_bs);
      if (var_bt) {
        var_as = var_bt[func_dec(104)][func_dec(34)](new RegExp(func_dec(36), func_dec(37)), func_dec(38))[func_dec(33)]();
        var_bo = getAllProfiles()[func_dec(105)](var_cc => var_cc[func_dec(35)][func_dec(34)](new RegExp(func_dec(36), func_dec(37)), func_dec(38))[func_dec(33)]() === var_as);
        if (!var_bo) return false;
        if (var_bt[func_dec(106)]) var_bo = {
          ...var_bo,
          [func_dec(107)]: var_bt[func_dec(106)]
        };
      } else {
        let var_cd = decodeConfigUuid(var_bs);
        if (var_cd) {
          var_bo = getAllProfiles()[func_dec(105)](var_ce => var_ce[func_dec(35)][func_dec(34)](new RegExp(func_dec(36), func_dec(37)), func_dec(38))[func_dec(33)]()[func_dec(108)](var_cd[func_dec(109)]));
          if (var_bo && var_cd[func_dec(110)] >= 0) {
            const var_cf = getEffectivePips(var_bo);
            if (var_cf[func_dec(31)] > 0) {
              const var_cg = var_cd[func_dec(110)] % var_cf[func_dec(31)];
              var_bo = {
                ...var_bo,
                [func_dec(107)]: var_cf[var_cg]
              };
            }
          }
        }
        if (!var_bo) {
          var_bo = getAllProfiles()[func_dec(105)](var_ch => var_ch[func_dec(35)][func_dec(34)](new RegExp(func_dec(36), func_dec(37)), func_dec(38))[func_dec(33)]() === var_bs);
        }
        if (!var_bo) return false;
        var_as = var_bo[func_dec(35)][func_dec(34)](new RegExp(func_dec(36), func_dec(37)), func_dec(38))[func_dec(33)]();
      }
      func_e(var_as, 0, var_aj, var_ak);
      let var_bu = state[func_dec(89)][func_dec(1)](var_as) || 0;
      if (var_bo && var_bo[func_dec(111)] && var_bu >= var_bo[func_dec(111)]) {
        var_ai[func_dec(10)]();
        return var_bn;
      }
      state[func_dec(89)][func_dec(4)](var_as, var_bu + 1);
      let var_bv = state[func_dec(112)][func_dec(1)](var_as) || {
        [func_dec(113)]: 0,
        [func_dec(114)]: 0
      };
      var_bv[func_dec(113)]++;
      var_bv[func_dec(114)] = Date[func_dec(0)]();
      state[func_dec(112)][func_dec(4)](var_as, var_bv);
      const var_bw = var_bj[17];
      const var_bx = 18 + var_bw + 1;
      var_bl = new DataView(var_bh[func_dec(100)](var_bx, var_bx + 2))[func_dec(115)](0);
      const var_by = var_bj[var_bx + 2];
      let var_bz = var_bx + 3,
        var_ca = 0;
      if (var_by === 1) {
        var_ca = 4;
        var_bk = var_bj[func_dec(100)](var_bz, var_bz + var_ca)[func_dec(97)](func_dec(116));
      } else if (var_by === 2) {
        var_ca = var_bj[var_bz];
        var_bz++;
        var_bk = new TextDecoder()[func_dec(117)](var_bj[func_dec(100)](var_bz, var_bz + var_ca));
      } else if (var_by === 3) {
        var_ca = 16;
        const var_ci = new DataView(var_bh[func_dec(100)](var_bz, var_bz + var_ca));
        var_bk = Array[func_dec(99)]({
          [func_dec(31)]: 8
        }, (var_cj, var_ck) => var_ci[func_dec(115)](var_ck * 2)[func_dec(102)](16))[func_dec(97)](func_dec(118));
      }
      var_bm = var_bz + var_ca;
    } else {
      let var_cl = var_bh[func_dec(93)];
      for (let var_ct = 0; var_ct < var_bh[func_dec(93)]; var_ct++) {
        if (var_bj[var_ct] === 0x0d && var_bj[var_ct + 1] === 0x0a) {
          var_cl = var_ct;
          break;
        }
      }
      let var_cm = new TextDecoder()[func_dec(117)](var_bj[func_dec(100)](0, var_cl));
      let var_cn = lookupConfigEntry(var_cm);
      if (var_cn) {
        var_as = var_cn[func_dec(104)][func_dec(34)](new RegExp(func_dec(36), func_dec(37)), func_dec(38))[func_dec(33)]();
        var_bo = getAllProfiles()[func_dec(105)](var_cu => var_cu[func_dec(35)][func_dec(34)](new RegExp(func_dec(36), func_dec(37)), func_dec(38))[func_dec(33)]() === var_as);
        if (!var_bo) return false;
        if (var_cn[func_dec(106)]) var_bo = {
          ...var_bo,
          [func_dec(107)]: var_cn[func_dec(106)]
        };
      } else {
        var_bo = getAllProfiles()[func_dec(105)](var_cv => getTrojanHash(var_cv[func_dec(35)]) === var_cm);
        if (!var_bo) return false;
        var_as = var_bo[func_dec(35)][func_dec(34)](new RegExp(func_dec(36), func_dec(37)), func_dec(38))[func_dec(33)]();
        if (var_bi >= 0) {
          const var_cw = getEffectivePips(var_bo);
          if (var_cw[func_dec(31)] > 0) {
            var_bo = {
              ...var_bo,
              [func_dec(107)]: var_cw[var_bi % var_cw[func_dec(31)]]
            };
          }
        }
      }
      func_e(var_as, 0, var_aj, var_ak);
      let var_co = state[func_dec(89)][func_dec(1)](var_as) || 0;
      if (var_bo && var_bo[func_dec(111)] && var_co >= var_bo[func_dec(111)]) {
        var_ai[func_dec(10)]();
        return var_bn;
      }
      state[func_dec(89)][func_dec(4)](var_as, var_co + 1);
      let var_cp = state[func_dec(112)][func_dec(1)](var_as) || {
        [func_dec(113)]: 0,
        [func_dec(114)]: 0
      };
      var_cp[func_dec(113)]++;
      var_cp[func_dec(114)] = Date[func_dec(0)]();
      state[func_dec(112)][func_dec(4)](var_as, var_cp);
      let var_cq = var_cl + 3;
      let var_cr = var_bj[var_cq];
      var_cq++;
      let var_cs = 0;
      if (var_cr === 1) {
        var_cs = 4;
        var_bk = var_bj[func_dec(100)](var_cq, var_cq + var_cs)[func_dec(97)](func_dec(116));
      } else if (var_cr === 3) {
        var_cs = var_bj[var_cq];
        var_cq++;
        var_bk = new TextDecoder()[func_dec(117)](var_bj[func_dec(100)](var_cq, var_cq + var_cs));
      } else if (var_cr === 4) {
        var_cs = 16;
        const var_cx = new DataView(var_bh[func_dec(100)](var_cq, var_cq + var_cs));
        var_bk = Array[func_dec(99)]({
          [func_dec(31)]: 8
        }, (var_cy, var_cz) => var_cx[func_dec(115)](var_cz * 2)[func_dec(102)](16))[func_dec(97)](func_dec(118));
      }
      var_cq += var_cs;
      var_bl = new DataView(var_bh[func_dec(100)](var_cq, var_cq + 2))[func_dec(115)](0);
      var_bm = var_cq + 4;
    }
    let var_bp = new RegExp(func_dec(120), func_dec(38))[func_dec(119)](var_bk) || new RegExp(func_dec(121), func_dec(38))[func_dec(119)](var_bk);
    let var_bq = var_bk;
    let var_br = false;
    try {
      if (var_bp) var_br = isAiDomain(var_bk);else if (var_bl === 443 && var_bm < var_bh[func_dec(93)]) {
        var_br = isAiDomain(sniffSniFromHello(var_bh[func_dec(100)](var_bm)));
      }
    } catch (var_da) {}
    if (var_bp && state[func_dec(30)][func_dec(122)]) {
      try {
        const var_db = new URL(state[func_dec(30)][func_dec(122)]);
        var_db[func_dec(123)][func_dec(4)](func_dec(57), var_bk);
        var_db[func_dec(123)][func_dec(4)](func_dec(124), func_dec(125));
        let var_dc = await fetchT(var_db[func_dec(102)](), {
          [func_dec(68)]: {
            [func_dec(80)]: func_dec(126)
          }
        });
        let var_dd = await var_dc[func_dec(127)]();
        if (var_dd[func_dec(128)] && var_dd[func_dec(128)][func_dec(31)] > 0) var_bq = var_dd[func_dec(128)][0][func_dec(94)];
      } catch (var_de) {}
    }
    try {
      var_at = connect({
        [func_dec(129)]: var_bq,
        [func_dec(130)]: var_bl
      });
      await withDeadline(var_at[func_dec(131)], TCP_OPEN_TIMEOUT_MS, () => func_b(var_at), func_dec(132));
      var_ao = null;
      var_ap = false;
    } catch {
      let var_df = [];
      if (var_bo && var_bo[func_dec(107)]) {
        var_df = var_bo[func_dec(107)][func_dec(23)](new RegExp(func_dec(134), func_dec(38)))[func_dec(98)](var_dk => var_dk[func_dec(135)]())[func_dec(133)](Boolean);
      }
      if (var_df[func_dec(31)] === 0 && state[func_dec(30)][func_dec(136)]) {
        var_df = state[func_dec(30)][func_dec(136)][func_dec(23)](new RegExp(func_dec(134), func_dec(38)))[func_dec(98)](var_dl => var_dl[func_dec(135)]())[func_dec(133)](Boolean);
      }
      if (var_df[func_dec(31)] === 0 && state[func_dec(30)][func_dec(137)]) {
        var_df = state[func_dec(30)][func_dec(137)][func_dec(23)](new RegExp(func_dec(134), func_dec(38)))[func_dec(98)](var_dm => var_dm[func_dec(135)]())[func_dec(133)](Boolean);
      }
      let var_dg = 0;
      let var_dh = false;
      try {
        if (var_br) {
          const var_dn = orderAiFirstTokens(var_df);
          if (var_dn[func_dec(138)]) {
            var_df = var_dn[func_dec(139)];
            var_dh = true;
          }
        }
      } catch (var_do) {}
      if (var_df[func_dec(31)] > 1 && !var_dh) {
        let var_dp = 0;
        let var_dq = var_bo ? var_bo[func_dec(35)] : func_dec(38);
        for (let var_dr = 0; var_dr < var_dq[func_dec(31)]; var_dr++) {
          var_dp = var_dq[func_dec(140)](var_dr) + ((var_dp << 5) - var_dp);
        }
        var_dg = Math[func_dec(141)](var_dp) % var_df[func_dec(31)];
      }
      let var_di = false;
      let var_dj = filterQuarantinedRelays(var_df);
      try {
        if (var_br && var_dj[func_dec(31)] > 1) var_dj = filterAiQuarantinedTokens(var_dj);
      } catch (var_ds) {}
      for (let var_dt = 0; var_dt < Math[func_dec(142)](var_dj[func_dec(31)], 3); var_dt++) {
        let var_du = (var_dg + var_dt) % var_dj[func_dec(31)];
        let var_dv = var_dj[var_du];
        const var_dw = relayKeyOf(var_dv);
        try {
          const [var_dx, var_dy] = var_dv[func_dec(23)](func_dec(118));
          const var_dz = var_dy ? var_dy[func_dec(23)](func_dec(143))[0][func_dec(135)]() : var_dy;
          const var_ea = var_dw && var_dw[func_dec(144)] ? var_dw[func_dec(144)] : var_dx;
          var_at = connect({
            [func_dec(129)]: var_ea,
            [func_dec(130)]: var_dz ? Number(var_dz) : var_bl
          });
          await withDeadline(var_at[func_dec(131)], TCP_OPEN_TIMEOUT_MS, () => func_b(var_at), func_dec(145));
          var_di = true;
          var_ap = false;
          var_ao = var_dw ? {
            [func_dec(144)]: var_dw[func_dec(144)],
            [func_dec(130)]: var_dw[func_dec(130)],
            [func_dec(146)]: var_br
          } : null;
          break;
        } catch (var_eb) {
          if (var_dw) {
            try {
              if (var_br) recordAiFailure(var_dw[func_dec(144)], var_dw[func_dec(130)]);else recordRelayFailure(var_dw[func_dec(144)], var_dw[func_dec(130)]);
            } catch (var_ec) {}
          }
        }
      }
      if (!var_di) {
        var_ai[func_dec(10)]();
        return var_bn;
      }
    }
    var_au = var_at[func_dec(148)][func_dec(147)]();
    if (var_bm < var_bh[func_dec(93)]) {
      let var_ed = var_bh[func_dec(100)](var_bm);
      try {
        await func_d(var_at, var_au, var_ed, TCP_WRITE_TIMEOUT_MS);
      } catch (var_ee) {
        func_b(var_at);
        func_c(var_au);
        var_au = null;
        try {
          var_ai[func_dec(10)]();
        } catch (var_ef) {}
        return var_bn;
      }
      var_am += var_ed[func_dec(93)] || 0;
    }
    try {
      var_at[func_dec(151)][func_dec(150)](new WritableStream({
        [func_dec(13)]: function (var_eg) {
          try {
            var_an += var_eg?.[func_dec(93)] || 0;
            const var_eh = var_eg && var_eg[func_dec(93)] || 0;
            if (var_eh > 0 && var_ao && !var_ap) {
              var_ap = true;
              try {
                recordRelaySuccess(var_ao[func_dec(144)], var_ao[func_dec(130)], true);
              } catch (var_ei) {}
              try {
                if (var_ao[func_dec(146)]) recordAiSuccess(var_ao[func_dec(144)], var_ao[func_dec(130)]);
              } catch (var_ej) {}
            }
          } catch (var_ek) {}
          try {
            var_ai[func_dec(96)](var_eg);
          } catch (var_el) {}
        },
        [func_dec(10)]: function () {},
        [func_dec(152)]: function () {}
      }))[func_dec(52)](() => {})[func_dec(149)](() => {
        func_b(var_at);
        try {
          var_ai[func_dec(10)]();
        } catch (var_em) {}
      });
    } catch (var_en) {}
    return var_bn;
  }
}
export { func_g as startDataPipe };