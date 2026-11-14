/* =====================================================================
   geo.js  การคำนวณทางภูมิศาสตร์: พิกัด UTM ระยะทาง และพื้นที่
   ===================================================================== */
(function () {
  'use strict';
  var A = 6378137, F = 1 / 298.257223563, B = A * (1 - F), K0 = 0.9996, E2 = F * (2 - F), EP2 = E2 / (1 - E2);
  var rad = Math.PI / 180;

  /* ละติจูด ลองจิจูด (WGS84) -> UTM  ถ้าไม่ระบุโซนจะคำนวณจากลองจิจูด */
  function toUTM(lat, lon, zone) {
    zone = zone || Math.floor((lon + 180) / 6) + 1;
    var lon0 = (zone * 6 - 183) * rad, p = lat * rad, l = lon * rad;
    var N = A / Math.sqrt(1 - E2 * Math.sin(p) * Math.sin(p)), T = Math.tan(p) * Math.tan(p), C = EP2 * Math.cos(p) * Math.cos(p), a = Math.cos(p) * (l - lon0);
    var M = A * ((1 - E2 / 4 - 3 * E2 * E2 / 64 - 5 * E2 * E2 * E2 / 256) * p - (3 * E2 / 8 + 3 * E2 * E2 / 32 + 45 * E2 * E2 * E2 / 1024) * Math.sin(2 * p)
      + (15 * E2 * E2 / 256 + 45 * E2 * E2 * E2 / 1024) * Math.sin(4 * p) - (35 * E2 * E2 * E2 / 3072) * Math.sin(6 * p));
    return {
      e: K0 * N * (a + (1 - T + C) * a * a * a / 6 + (5 - 18 * T + T * T + 72 * C - 58 * EP2) * Math.pow(a, 5) / 120) + 500000,
      n: K0 * (M + N * Math.tan(p) * (a * a / 2 + (5 - T + 9 * C + 4 * C * C) * Math.pow(a, 4) / 24 + (61 - 58 * T + T * T + 600 * C - 330 * EP2) * Math.pow(a, 6) / 720)),
      zone: zone
    };
  }

  /* ระยะทางบนทรงรี WGS84 (สูตร Vincenty) หน่วยเมตร  a, b = [lon, lat] */
  function distance(a, b) {
    var L = (b[0] - a[0]) * rad, U1 = Math.atan((1 - F) * Math.tan(a[1] * rad)), U2 = Math.atan((1 - F) * Math.tan(b[1] * rad));
    var sU1 = Math.sin(U1), cU1 = Math.cos(U1), sU2 = Math.sin(U2), cU2 = Math.cos(U2);
    var lam = L, prev, i = 0, sS, cS, sig, sA, c2A, c2M, C;
    if (a[0] === b[0] && a[1] === b[1]) return 0;
    do {
      var sL = Math.sin(lam), cL = Math.cos(lam);
      sS = Math.sqrt(Math.pow(cU2 * sL, 2) + Math.pow(cU1 * sU2 - sU1 * cU2 * cL, 2));
      if (sS === 0) return 0;
      cS = sU1 * sU2 + cU1 * cU2 * cL; sig = Math.atan2(sS, cS);
      sA = cU1 * cU2 * sL / sS; c2A = 1 - sA * sA; c2M = c2A ? cS - 2 * sU1 * sU2 / c2A : 0;
      C = F / 16 * c2A * (4 + F * (4 - 3 * c2A));
      prev = lam;
      lam = L + (1 - C) * F * sA * (sig + C * sS * (c2M + C * cS * (-1 + 2 * c2M * c2M)));
    } while (Math.abs(lam - prev) > 1e-12 && ++i < 100);
    var u2 = c2A * (A * A - B * B) / (B * B);
    var AA = 1 + u2 / 16384 * (4096 + u2 * (-768 + u2 * (320 - 175 * u2))), BB = u2 / 1024 * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
    var dS = BB * sS * (c2M + BB / 4 * (cS * (-1 + 2 * c2M * c2M) - BB / 6 * c2M * (-3 + 4 * sS * sS) * (-3 + 4 * c2M * c2M)));
    return B * AA * (sig - dS);
  }
  function pathLength(pts, closed) {
    var s = 0, i;
    for (i = 1; i < pts.length; i++) s += distance(pts[i - 1], pts[i]);
    if (closed && pts.length > 2) s += distance(pts[pts.length - 1], pts[0]);
    return s;
  }
  /* พื้นที่ของรูปหลายเหลี่ยม หน่วยตารางเมตร คำนวณบนพิกัด UTM ของโซนที่จุดแรกอยู่ */
  function polygonArea(pts) {
    if (pts.length < 3) return 0;
    var zone = Math.floor((pts[0][0] + 180) / 6) + 1, xy = pts.map(function (p) { return toUTM(p[1], p[0], zone); }), s = 0;
    for (var i = 0; i < xy.length; i++) { var a = xy[i], b = xy[(i + 1) % xy.length]; s += a.e * b.n - b.e * a.n; }
    return Math.abs(s) / 2;
  }
  /* กรอบสี่เหลี่ยมของ feature: [[W,S],[E,N]] */
  function bbox(feature) {
    var w = 180, s = 90, e = -180, n = -90;
    (function walk(c) {
      if (typeof c[0] === 'number') { if (c[0] < w) w = c[0]; if (c[0] > e) e = c[0]; if (c[1] < s) s = c[1]; if (c[1] > n) n = c[1]; }
      else c.forEach(walk);
    })(feature.geometry.coordinates);
    return [[w, s], [e, n]];
  }

  window.App.geo = { toUTM: toUTM, distance: distance, pathLength: pathLength, polygonArea: polygonArea, bbox: bbox };
})();
