/* =====================================================================
   core.js  ตัวแปรกลาง ฟังก์ชันช่วย และการโหลดข้อมูล
   ไฟล์อื่นทุกไฟล์เรียกใช้ผ่านตัวแปร App
   ===================================================================== */
(function () {
  'use strict';
  var S = window.SETTINGS, TEXT = window.TEXT;

  var App = window.App = {
    groups: window.LAYER_GROUPS || [],
    layers: {},                 // id -> ค่าตั้งของชั้นข้อมูล
    order: [],                  // id ตามลำดับในแผงชั้นข้อมูล
    manifest: window.MANIFEST || {},
    stats: window.PRESTATS || {},
    tambonStats: window.TSTATS || {},
    tambons: window.TAMBONS || [],
    rasterIndex: window.RASTER_INDEX || {},
    amphoeStats: {},
    amphoes: [],
    data: {},                   // id -> GeoJSON ที่โหลดแล้ว
    rasterCanvas: {},           // id -> canvas ของภาพราสเตอร์
    dem: null,                  // แบบจำลองความสูงสำหรับ 3 มิติ
    loading: {},
    state: {
      visible: {},
      levels: { 1: true, 2: true, 3: true, 4: true, 5: true },
      model: 'study',
      scope: '',
      rasterOpacity: S.rasterOpacity,
      panel: null,              // 'layers' | 'search' | 'measure' | null
      is3D: false,
      imagery: null             // true = ภาพดาวเทียมใช้ได้, false = ถูกปิดกั้น
    },
    levelName: {}, levelColor: {}
  };
  S.levels.forEach(function (l) { App.levelName[l.n] = l.name; App.levelColor[l.n] = l.color; });
  App.LEVELS = S.levels.map(function (l) { return l.n; });   // [5,4,3,2,1]

  /* ---------- ฟังก์ชันช่วยทั่วไป ---------- */
  App.$ = function (id) { return document.getElementById(id); };
  App.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  App.fmt = function (n, d) {
    return (typeof n === 'number' && isFinite(n)) ? n.toLocaleString('th-TH', { maximumFractionDigits: d == null ? 0 : d }) : '–';
  };
  /* ดึงข้อความจาก TEXT เช่น App.t('summary.title') และเติมค่าใน {…} */
  App.t = function (path, vars) {
    var v = path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, TEXT);
    if (v == null) return path;
    if (vars) Object.keys(vars).forEach(function (k) { v = String(v).split('{' + k + '}').join(vars[k]); });
    return v;
  };
  App.toast = function (msg, isError) {
    var el = document.createElement('div');
    el.className = 'toast' + (isError ? ' err' : '');
    el.textContent = msg;
    App.$('toasts').appendChild(el);
    setTimeout(function () { el.remove(); }, isError ? 9000 : 6000);
  };
  App.sum = function (arr) { return arr ? arr.reduce(function (a, b) { return a + b; }, 0) : 0; };

  /* ---------- ค่าตั้งของชั้นข้อมูล ---------- */
  App.groups.forEach(function (g, gi) {
    g.layers.forEach(function (l) {
      l.group = gi;
      App.layers[l.id] = l;
      App.order.push(l.id);
      App.state.visible[l.id] = S.defaultVisible.indexOf(l.id) >= 0;
      var r = App.rasterIndex[l.id];
      if (r && l.legend) {
        if (r.extra && l.legend.classes) r.extra.forEach(function (x) { l.legend.classes.push({ label: x.label + ' ' + App.t('popup.notInArcgis'), color: x.color }); });
        if (r.max != null) { l.legend.min = r.min; l.legend.max = r.max; l.legend.note = r.note; }
      }
    });
  });
  App.isDense = function (id) { return S.denseLayers.indexOf(id) >= 0; };
  App.isRaster = function (id) { return App.layers[id].type === 'raster'; };
  App.has = function (id) { return !!(App.manifest[id] || App.rasterIndex[id]); };
  App.ready = function (id) { return !!(App.data[id] || App.rasterCanvas[id]); };
  App.levelField = function (id) { var c = App.layers[id]; return (c.render && c.render.field) || 'gridcode'; };
  App.isClassified = function (id) { var c = App.layers[id]; return App.isDense(id) || !!(c.render && c.render.kind === 'unique'); };

  /* ---------- สถิติรายอำเภอ รวมจากรายตำบล ---------- */
  App.tambons.forEach(function (tb) {
    var t = App.tambonStats[tb[0]]; if (!t) return;
    var a = App.amphoeStats[tb[2]];
    if (!a) { a = App.amphoeStats[tb[2]] = { n: 0 }; App.amphoes.push(tb[2]); }
    a.n++;
    Object.keys(t).forEach(function (k) {
      var d = a[k] || (a[k] = [0, 0, 0, 0, 0, 0]);
      t[k].forEach(function (v, i) { d[i] += v; });
    });
  });
  App.amphoes.sort(function (x, y) { return x.localeCompare(y, 'th'); });

  /* ---------- การโหลดข้อมูล ---------- */
  /* ชื่อตำบลและอำเภอถูกย่อเป็นเลขลำดับ (_t) เพื่อลดขนาดไฟล์ ขยายกลับที่นี่ */
  function expandTambon(fc) {
    fc.features.forEach(function (f) {
      var t = f.properties._t;
      if (t != null && App.tambons[t]) { f.properties.TAM_NAM_T = App.tambons[t][1]; f.properties.AMPHOE_T = App.tambons[t][2]; delete f.properties._t; }
    });
    return fc;
  }
  Object.keys(window.EMBEDDED || {}).forEach(function (id) { if (App.layers[id]) App.data[id] = expandTambon(window.EMBEDDED[id]); });

  function loadScript(src, onError) {
    var sc = document.createElement('script');
    sc.src = src; sc.onerror = onError;
    document.head.appendChild(sc);
  }
  /* โหลดชั้นข้อมูลที่ยังไม่อยู่ในหน่วยความจำ เสร็จแล้วเรียก App.onLayerReady(id) */
  App.load = function (id) {
    if (App.loading[id] || App.ready(id)) return;
    var file = (App.manifest[id] && App.manifest[id].file ? 'data/layers/' + App.manifest[id].file.split('/').pop() : null) || (App.rasterIndex[id] && App.rasterIndex[id].file);
    if (!file) return;
    App.loading[id] = true;
    loadScript(file, function () {
      delete App.loading[id]; App.state.visible[id] = false;
      App.toast(App.t('layerPanel.loadFailed', { name: App.layers[id].name }), true);
      if (App.onLayerReady) App.onLayerReady(id, true);
    });
    if (App.onLoadingChange) App.onLoadingChange();
  };
  function done(id) { delete App.loading[id]; if (App.onLayerReady) App.onLayerReady(id); }

  /* ไฟล์ data/layers/*.js เรียกฟังก์ชันเหล่านี้เมื่อโหลดเสร็จ */
  window.__reg = function (id, fc) { App.data[id] = expandTambon(fc); done(id); };
  window.__regDense = function (id, o) {
    var bin = atob(o.b64), n = o.n, rec = o.rec, buf = new Uint8Array(bin.length), bb = o.bbox, i, feats = new Array(n);
    for (i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    var dv = new DataView(buf.buffer);
    for (i = 0; i < n; i++) {
      var lon = bb[0] + dv.getUint16(i * rec, true) / 65535 * (bb[2] - bb[0]);
      var lat = bb[1] + dv.getUint16(i * rec + 2, true) / 65535 * (bb[3] - bb[1]);
      var p = { gridcode: buf[i * rec + 4], t: buf[i * rec + 5] };
      if (o.pop) p.pop = dv.getUint16(i * rec + 6, true) / 1000;
      feats[i] = { type: 'Feature', properties: p, geometry: { type: 'Point', coordinates: [lon, lat] } };
    }
    App.data[id] = { type: 'FeatureCollection', features: feats };
    done(id);
  };
  window.__regRaster = function (id, dataUrl) {
    var img = new Image();
    img.onload = function () {
      var c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      App.rasterCanvas[id] = c; done(id);
    };
    img.src = dataUrl;
  };

  /* แบบจำลองความสูง: เก็บ tile ไว้ในหน่วยความจำ แล้วให้ MapLibre ขอผ่านโพรโทคอล nandem:// */
  var demWaiters = [];
  window.__regDem = function (o) { App.dem = o; demWaiters.splice(0).forEach(function (cb) { cb(true); }); };
  App.loadDem = function (cb) {
    if (App.dem) { cb(true); return; }
    demWaiters.push(cb);
    if (demWaiters.length > 1) return;
    loadScript('data/dem.js', function () { demWaiters.splice(0).forEach(function (f) { f(false); }); });
  };
  App.demTile = function (key) {
    var b64 = App.dem && (App.dem.tiles[key] || App.dem.flat); if (!b64) return null;   // นอกพื้นที่ DEM ใช้ระดับราบ
    var bin = atob(b64), buf = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    return buf.buffer;
  };
})();
