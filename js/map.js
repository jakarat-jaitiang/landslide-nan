/* =====================================================================
   map.js  ตัวแผนที่ (MapLibre GL): แผนที่ฐาน ชั้นข้อมูล สัญลักษณ์ popup
           ทิศเหนือ และมุมมอง 3 มิติ
   ===================================================================== */
(function () {
  'use strict';
  var App = window.App, S = window.SETTINGS, $ = App.$, esc = App.esc, fmt = App.fmt, t = App.t;
  var map, added = {}, layerOwner = {}, popup = null, styleLoaded = false;
  var M = App.map = {};

  /* ---------- ตัวช่วยอ่านสัญลักษณ์จาก layers-config ---------- */
  function rgba(c, mul) {
    if (!c) return 'rgba(0,0,0,0)';
    var h = c.hex, a = c.a * (mul == null ? 1 : mul);
    return 'rgba(' + parseInt(h.slice(1, 3), 16) + ',' + parseInt(h.slice(3, 5), 16) + ',' + parseInt(h.slice(5, 7), 16) + ',' + a + ')';
  }
  function isGlyph(sym) { return !!(sym && sym.markers && sym.markers.some(function (m) { return m.shape === 'poly'; })); }
  function symbolColor(sym) {
    if (sym.markers) return sym.markers[0].fill.hex;
    if (sym.kind === 'line') return sym.stroke.hex;
    return sym.fill && sym.fill.a ? sym.fill.hex : (sym.stroke ? sym.stroke.hex : '#828282');
  }
  function firstSymbol(c) { return c.render.kind === 'simple' ? c.render.symbol : c.render.classes[0].symbol; }
  /* สีตามระดับ: นิพจน์ match ของ MapLibre หรือสีเดียว */
  function colorExpr(id) {
    var c = App.layers[id];
    if (c.render.kind === 'simple') return symbolColor(c.render.symbol);
    var ex = ['match', ['to-number', ['get', c.render.field], 0]];
    c.render.classes.forEach(function (k) { ex.push(Number(k.value), symbolColor(k.symbol)); });
    ex.push('#828282');
    return ex;
  }
  M.isGlyph = isGlyph; M.symbolColor = symbolColor; M.firstSymbol = firstSymbol;
  M.glyphSVG = function (sym, px) {
    var out = '<svg xmlns="http://www.w3.org/2000/svg" class="glyph" width="' + px + '" height="' + px + '" viewBox="0 0 17 17">';
    sym.markers.slice().reverse().forEach(function (m) {
      if (m.shape === 'circle') out += '<circle cx="8.5" cy="8.5" r="8" fill="' + m.fill.hex + '" stroke="' + (m.stroke ? m.stroke.hex : 'none') + '" stroke-width="' + (m.width || 0) + '"/>';
      else out += '<path fill-rule="evenodd" d="' + m.rings.map(function (r) { return 'M' + r.map(function (p) { return p[0] + ' ' + (17 - p[1]); }).join('L') + 'Z'; }).join('') + '" fill="' + m.fill.hex + '"/>';
    });
    return out + '</svg>';
  };

  /* ---------- สร้างชั้นของ MapLibre จากค่าตั้งของแต่ละชั้นข้อมูล ---------- */
  function zoomWidth(w) { return ['interpolate', ['linear'], ['zoom'], 8, Math.max(0.6, w * 0.9), 14, Math.max(1, w * 2)]; }
  function buildLayers(id) {
    var c = App.layers[id], src = 's-' + id;
    if (c.type === 'raster') {
      return [{ id: id + '-r', type: 'raster', source: src, paint: { 'raster-opacity': App.state.rasterOpacity, 'raster-fade-duration': 0, 'raster-resampling': c.legend.kind === 'classes' ? 'nearest' : 'linear' } }];
    }
    var sym = firstSymbol(c), col = colorExpr(id);
    if (App.isDense(id)) {
      var big = id === 'Pop_Nan_point';
      return [{ id: id + '-circle', type: 'circle', source: src, paint: { 'circle-color': col, 'circle-radius': ['interpolate', ['exponential', 2], ['zoom'], 8, 0.8, 17, big ? 26 : 7], 'circle-opacity': 0.9 } }];
    }
    if (c.geom === 'polygon') {
      if (c.group === 0) {                       // ขอบเขตการปกครอง: วาดเฉพาะเส้น
        var line = { id: id + '-line', type: 'line', source: src, layout: { 'line-join': 'round' }, paint: { 'line-color': sym.stroke ? sym.stroke.hex : '#ffffff', 'line-width': zoomWidth(sym.width || 1) } };
        if (sym.dash) line.paint['line-dasharray'] = sym.dash.map(function (d) { return Math.max(0.5, d / Math.max(1, sym.width || 1) / 1.5); });
        var out = [line];
        // ชั้นโปร่งใสไว้รับการคลิกเพื่อเปิดสรุปรายตำบล อยู่ล่างสุดของชั้นเวกเตอร์
        if (id === 'Nan_Tambon') out.unshift({ id: id + '-catch', type: 'fill', source: src, slot: 'slot-catch', paint: { 'fill-color': '#000000', 'fill-opacity': 0 } });
        return out;
      }
      var op = (id === S.studyLayer || id === S.dmrLayer) ? S.susceptibilityOpacity : 1;
      var fill = { id: id + '-fill', type: 'fill', source: src, paint: { 'fill-color': col, 'fill-opacity': (sym.fill ? sym.fill.a : 1) * op } };
      if (sym.stroke && sym.stroke.a > 0 && sym.width > 0) fill.paint['fill-outline-color'] = rgba(sym.stroke, 0.5);
      return [fill];
    }
    if (c.geom === 'line') {
      return [{ id: id + '-line', type: 'line', source: src, layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': col, 'line-width': zoomWidth(sym.width || 1) } }];
    }
    if (isGlyph(sym)) {
      return [{ id: id + '-sym', type: 'symbol', source: src, layout: { 'icon-image': 'g-' + id, 'icon-allow-overlap': true, 'icon-size': ['interpolate', ['linear'], ['zoom'], 8, 0.7, 13, 1.1] } }];
    }
    var m = sym.markers[0], s = m.size || 4;
    return [{ id: id + '-circle', type: 'circle', source: src, paint: {
      'circle-color': col, 'circle-opacity': m.fill.a,
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, Math.max(1.3, s * 0.4), 12, s * 0.75, 15, s * 1.2],
      'circle-stroke-color': m.stroke ? m.stroke.hex : '#000000', 'circle-stroke-opacity': m.stroke ? m.stroke.a : 0,
      'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 8, 0.3, 13, m.stroke && m.stroke.a ? Math.max(0.6, (m.width || 0) * 1.2) : 0]
    } }];
  }
  function levelFilter(id) {
    var act = App.LEVELS.filter(function (n) { return App.state.levels[n]; }).concat([0]);
    return ['in', ['to-number', ['get', App.levelField(id)], 0], ['literal', act]];
  }
  function addToMap(id) {
    var c = App.layers[id], src = 's-' + id;
    if (c.type === 'raster') {
      var b = App.rasterIndex[id].bounds;   // [[S,W],[N,E]]
      map.addSource(src, { type: 'canvas', canvas: App.rasterCanvas[id], animate: false, coordinates: [[b[0][1], b[1][0]], [b[1][1], b[1][0]], [b[1][1], b[0][0]], [b[0][1], b[0][0]]] });
    } else {
      // tolerance 0 สำหรับรูปหลายเหลี่ยม เพื่อไม่ให้ช่องกริดเล็ก ๆ หายไปเมื่อซูมออก
      map.addSource(src, { type: 'geojson', data: App.data[id], tolerance: c.geom === 'polygon' ? 0 : 0.2 });
    }
    added[id] = buildLayers(id).map(function (ly) {
      var slot = ly.slot || 'slot-' + id; delete ly.slot;
      if (App.isClassified(id) && ly.type !== 'raster') ly.filter = levelFilter(id);
      map.addLayer(ly, slot);
      layerOwner[ly.id] = id;
      return ly.id;
    });
  }

  /* ---------- เปิดปิดชั้นข้อมูล ---------- */
  M.shouldShow = function (id) {
    if (!App.has(id) || !App.state.visible[id]) return false;
    if (id === S.studyLayer) return App.state.model === 'study';
    if (id === S.dmrLayer) return App.state.model === 'dmr';
    return true;
  };
  M.refresh = function (id) {
    if (!map || !M.loaded) return;
    var show = M.shouldShow(id);
    if (show && !App.ready(id)) { App.load(id); return; }
    if (show && !added[id]) addToMap(id);
    if (added[id]) added[id].forEach(function (l) { map.setLayoutProperty(l, 'visibility', show ? 'visible' : 'none'); });
  };
  M.refreshAll = function () { App.order.forEach(M.refresh); };
  M.applyLevelFilter = function () {
    Object.keys(added).forEach(function (id) {
      if (App.isClassified(id)) added[id].forEach(function (l) { if (map.getLayer(l).type !== 'raster') map.setFilter(l, levelFilter(id)); });
    });
  };
  M.setRasterOpacity = function (v) {
    App.state.rasterOpacity = v;
    Object.keys(added).forEach(function (id) { if (App.isRaster(id)) map.setPaintProperty(id + '-r', 'raster-opacity', v); });
  };

  /* ---------- popup ---------- */
  function levelChip(n) { return '<span class="lvl"><i style="background:' + App.levelColor[n] + '"></i>' + App.levelName[n] + ' (' + n + ')</span>'; }
  M.popupHTML = function (id, props) {
    var c = App.layers[id], rows = '', lf = App.levelField(id), used = {}, alias = window.TEXT.fieldAlias;
    if (App.isDense(id)) {
      var n = Number(props.gridcode), tb = App.tambons[props.t];
      if (props.pop != null) rows += '<dt>' + t('popup.popPerCell') + '</dt><dd>' + fmt(Number(props.pop), 2) + '</dd>';
      rows += '<dt>' + t('level.field') + '</dt><dd>' + (n ? levelChip(n) : t('level.none')) + '</dd>';
      if (tb) rows += '<dt>' + t('popup.tambon') + '</dt><dd>' + esc(tb[1]) + '</dd><dt>' + t('popup.amphoe') + '</dt><dd>' + esc(tb[2]) + '</dd>';
    } else {
      var fields = (c.fields && c.fields.length ? c.fields : []).slice();
      Object.keys(props).forEach(function (k) { if (alias[k] && !fields.some(function (f) { return f.f === k; }) && (!c.fields || !c.fields.length || id === 'Nan_Tambon')) fields.push({ f: k, alias: alias[k] }); });
      fields.forEach(function (fd) {
        if (used[fd.f]) return; used[fd.f] = 1;
        var v = props[fd.f]; if (v == null || v === '' || v === ' ') return;
        var shown = esc(typeof v === 'number' ? fmt(v, 4) : v), lv = Math.round(Number(v));
        if (fd.f === lf && App.levelName[lv]) shown = levelChip(lv);
        rows += '<dt>' + esc(fd.alias === fd.f && alias[fd.f] ? alias[fd.f] : fd.alias) + '</dt><dd>' + shown + '</dd>';
      });
    }
    var extra = id === 'Nan_Tambon' && App.ui ? App.ui.statTable(App.tambonStats[props.TAMBON_IDN]) : '';
    return '<div class="pop"><h3>' + esc(c.name) + '</h3><dl>' + (rows || '<dt>' + t('popup.noAttributes') + '</dt><dd></dd>') + '</dl>' + extra + '</div>';
  };
  M.openPopup = function (lngLat, html) {
    if (popup) popup.remove();
    popup = new maplibregl.Popup({ maxWidth: '360px', closeButton: true }).setLngLat(lngLat).setHTML(html).addTo(map);
  };
  M.closePopup = function () { if (popup) { popup.remove(); popup = null; } };
  function onClick(e) {
    if (App.measure && App.measure.mode()) return;
    // ทุกชั้นคลิกได้ ยกเว้นเส้นขอบเขตการปกครอง
    var ids = Object.keys(layerOwner).filter(function (l) { return map.getLayer(l) && !(App.layers[layerOwner[l]].group === 0 && /-line$/.test(l)); });
    var pad = 4, hits = map.queryRenderedFeatures([[e.point.x - pad, e.point.y - pad], [e.point.x + pad, e.point.y + pad]], { layers: ids });
    if (!hits.length) return;
    M.openPopup(e.lngLat, M.popupHTML(layerOwner[hits[0].layer.id], hits[0].properties));
  }

  /* ---------- ซูมไปยังรูปร่าง พร้อมเน้นขอบ ---------- */
  var hlTimer = null;
  M.flyTo = function (feature, html) {
    var bb = App.geo.bbox(feature), wide = window.innerWidth > 900;
    map.fitBounds(bb, { padding: { top: 70, bottom: 70, left: wide ? 500 : 40, right: wide ? 90 : 40 }, maxZoom: 13.5, duration: 900 });
    map.getSource('hl').setData(feature);
    clearTimeout(hlTimer); hlTimer = setTimeout(function () { map.getSource('hl').setData({ type: 'FeatureCollection', features: [] }); }, 3000);
    if (html) M.openPopup([(bb[0][0] + bb[1][0]) / 2, (bb[0][1] + bb[1][1]) / 2], html);
  };
  M.fitProvince = function () { map.fitBounds(S.bounds, { padding: { top: 30, bottom: 30, left: window.innerWidth > 900 ? 480 : 30, right: 70 }, duration: 700 }); };

  /* ---------- แบบจำลองความสูง: เงาภูมิประเทศ และมุมมอง 3 มิติ ---------- */
  function demSource() {
    return { type: 'raster-dem', tiles: ['nandem://{z}/{x}/{y}'], tileSize: App.dem.tileSize, minzoom: App.dem.minzoom, maxzoom: App.dem.zoom, encoding: 'terrarium', bounds: App.dem.bounds };
  }
  function showHillshade() {
    App.loadDem(function (ok) {
      if (!ok || map.getLayer('hillshade')) return;
      map.addSource('dem-shade', demSource());
      map.setPaintProperty('bg', 'background-color', '#59645f');
      map.addLayer({ id: 'hillshade', type: 'hillshade', source: 'dem-shade', paint: { 'hillshade-exaggeration': 0.55, 'hillshade-shadow-color': '#10171a', 'hillshade-highlight-color': '#e8efe9', 'hillshade-accent-color': '#1f2a2c' } }, 'slot-catch');
    });
  }
  M.set3D = function (on) {
    if (!on) {
      App.state.is3D = false;
      map.easeTo({ pitch: 0, bearing: 0, duration: 700 });
      setTimeout(function () { if (!App.state.is3D) map.setTerrain(null); }, 750);
      if (App.ui) App.ui.renderTools();
      return;
    }
    App.toast(t('view3d.loading'));
    App.loadDem(function (ok) {
      if (!ok) { App.toast(t('view3d.failed'), true); return; }
      if (!map.getSource('dem-3d')) map.addSource('dem-3d', demSource());
      map.setTerrain({ source: 'dem-3d', exaggeration: S.terrainExaggeration });
      map.easeTo({ pitch: S.pitch3D, duration: 900 });
      App.state.is3D = true;
      App.toast(t('view3d.on'));
      if (App.ui) App.ui.renderTools();
    });
  };

  /* ---------- เริ่มต้นแผนที่ ---------- */
  M.init = function (onReady) {
    maplibregl.addProtocol('nandem', function (params) {
      var buf = App.demTile(params.url.replace('nandem://', ''));
      return buf ? Promise.resolve({ data: buf }) : Promise.reject(new Error('no tile'));
    });
    map = M.gl = new maplibregl.Map({
      container: 'map',
      style: {
        version: 8,
        sources: { esri: { type: 'raster', tiles: [S.esriUrl], tileSize: 256, maxzoom: 18 } },
        layers: [{ id: 'bg', type: 'background', paint: { 'background-color': S.backgroundColor } }, { id: 'esri', type: 'raster', source: 'esri', layout: { visibility: 'none' } }]
      },
      bounds: S.bounds, fitBoundsOptions: { padding: { top: 30, bottom: 30, left: window.innerWidth > 900 ? 480 : 30, right: 70 } },
      minZoom: S.minZoom, maxZoom: S.maxZoom, maxPitch: 75, attributionControl: false
    });
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 140, unit: 'metric' }), 'bottom-right');
    map.doubleClickZoom.disable();

    map.on('load', function () {
      styleLoaded = true;
      // ช่องวางชั้นข้อมูลตามลำดับการวาด (ชั้นจริงจะถูกแทรกไว้หน้า slot ของตัวเอง)
      var slots = ['slot-catch'];
      S.drawOrder.forEach(function (id) {
        if (id === '*rasters*') App.order.forEach(function (r) { if (App.isRaster(r)) slots.push('slot-' + r); });
        else slots.push('slot-' + id);
      });
      App.order.forEach(function (id) { if (slots.indexOf('slot-' + id) < 0) slots.push('slot-' + id); });
      slots.push('slot-top');
      slots.forEach(function (sid) { map.addLayer({ id: sid, type: 'background', layout: { visibility: 'none' } }); });
      map.addSource('hl', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({ id: 'hl-line', type: 'line', source: 'hl', paint: { 'line-color': '#ffffff', 'line-width': 3.5 } });

      // รูปสัญลักษณ์ของชั้นจุดที่ใช้ไอคอน (สถานพยาบาล ศูนย์พักพิง)
      var glyphs = App.order.filter(function (id) { var c = App.layers[id]; return c.type === 'vector' && c.geom === 'point' && isGlyph(firstSymbol(c)); }), pending = glyphs.length;
      function go() { M.loaded = true; M.refreshAll(); if (onReady) onReady(); }
      if (!pending) go();
      glyphs.forEach(function (id) {
        var img = new Image(36, 36);
        img.onload = function () { map.addImage('g-' + id, img, { pixelRatio: 2 }); if (--pending === 0) go(); };
        img.onerror = function () { if (--pending === 0) go(); };
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(M.glyphSVG(firstSymbol(App.layers[id]), 36));
      });
    });

    map.on('click', onClick);
    map.on('mousemove', function (e) { if (App.ui) App.ui.showCoord(e.lngLat); });
    map.on('zoom', function () { if (App.ui) App.ui.showZoom(); });
    map.on('rotate', function () { $('compass-needle').style.transform = 'rotate(' + (-map.getBearing()) + 'deg)'; });

    // ตรวจว่าโหลดภาพดาวเทียม Esri ได้หรือไม่ ถ้าไม่ได้ให้แสดงเงาภูมิประเทศแทน
    var probe = new Image(), settled = false, timer = setTimeout(function () { fail(); }, 8000);
    function fail() {
      if (settled) return; settled = true; clearTimeout(timer); App.state.imagery = false;
      if (styleLoaded) showHillshade(); else map.once('load', showHillshade);
      if (App.ui) App.ui.renderStatus();
    }
    probe.onload = function () {
      if (settled) return; settled = true; clearTimeout(timer); App.state.imagery = true;
      var show = function () { map.setLayoutProperty('esri', 'visibility', 'visible'); };
      if (styleLoaded) show(); else map.once('load', show);
      if (App.ui) App.ui.renderStatus();
    };
    probe.onerror = fail;
    probe.src = S.esriUrl.replace('{z}', 7).replace('{y}', 57).replace('{x}', 99);
  };

  App.onLayerReady = function (id, failed) {
    if (!failed) M.refresh(id);
    if (App.ui) App.ui.renderAll();
  };
  App.onLoadingChange = function () { if (App.ui) App.ui.renderSide(); };
})();
