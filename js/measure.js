/* =====================================================================
   measure.js  เครื่องมือวัดระยะทางและพื้นที่
   ===================================================================== */
(function () {
  'use strict';
  var App = window.App, S = window.SETTINGS, t = App.t, fmt = App.fmt;
  var mode = null;        // 'distance' | 'area' | null
  var pts = [];           // จุดที่คลิกแล้ว [lon, lat]
  var hover = null;       // ตำแหน่งเมาส์ระหว่างวาด
  var finished = false;
  var Mz = App.measure = {};

  Mz.mode = function () { return mode; };

  function draw() {
    var map = App.map.gl, all = pts.slice(), feats = [];
    if (!finished && hover && pts.length) all.push(hover);
    if (all.length >= 2) {
      if (mode === 'area' && all.length >= 3) feats.push({ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [all.concat([all[0]])] } });
      feats.push({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: mode === 'area' && all.length >= 3 ? all.concat([all[0]]) : all } });
    }
    pts.forEach(function (p) { feats.push({ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: p } }); });
    map.getSource('measure').setData({ type: 'FeatureCollection', features: feats });
    if (App.ui) App.ui.renderMeasure();
  }

  /* ผลการวัดสำหรับแสดงในแผง */
  Mz.result = function () {
    var all = pts.slice();
    if (!finished && hover && pts.length) all.push(hover);
    if (!mode || all.length < 2) return null;
    if (mode === 'distance') return { length: App.geo.pathLength(all, false) };
    return { perimeter: App.geo.pathLength(all, true), area: all.length >= 3 ? App.geo.polygonArea(all) : 0 };
  };
  Mz.resultHTML = function () {
    var r = Mz.result(); if (!r) return '';
    function dist(m) { return m >= 1000 ? fmt(m / 1000, 3) + ' ' + t('measure.km') : fmt(m, 1) + ' ' + t('measure.m'); }
    if (r.length != null) return '<dl class="readout"><dt>' + t('measure.length') + '</dt><dd>' + dist(r.length) + '</dd></dl>';
    return '<dl class="readout"><dt>' + t('measure.areaLabel') + '</dt><dd>' + fmt(r.area / 1e6, 4) + ' ' + t('measure.sqkm') + '</dd>'
      + '<dt></dt><dd>' + fmt(r.area / S.sqmPerRai, 2) + ' ' + t('measure.rai') + '</dd>'
      + '<dt>' + t('measure.perimeter') + '</dt><dd>' + dist(r.perimeter) + '</dd></dl>';
  };

  Mz.start = function (m) {
    mode = m; pts = []; hover = null; finished = false;
    App.map.closePopup();
    App.map.gl.getCanvas().style.cursor = 'crosshair';
    draw();
  };
  Mz.clear = function () { pts = []; hover = null; finished = false; draw(); };
  Mz.stop = function () {
    mode = null; pts = []; hover = null; finished = false;
    App.map.gl.getCanvas().style.cursor = '';
    draw();
  };

  Mz.init = function () {
    var map = App.map.gl;
    map.addSource('measure', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    map.addLayer({ id: 'measure-fill', type: 'fill', source: 'measure', filter: ['==', ['geometry-type'], 'Polygon'], paint: { 'fill-color': '#ffd400', 'fill-opacity': 0.25 } });
    map.addLayer({ id: 'measure-line', type: 'line', source: 'measure', filter: ['==', ['geometry-type'], 'LineString'], paint: { 'line-color': '#ffd400', 'line-width': 2.5, 'line-dasharray': [2, 1.5] } });
    map.addLayer({ id: 'measure-pts', type: 'circle', source: 'measure', filter: ['==', ['geometry-type'], 'Point'], paint: { 'circle-radius': 4.5, 'circle-color': '#ffffff', 'circle-stroke-color': '#b38600', 'circle-stroke-width': 2 } });

    map.on('click', function (e) {
      if (!mode) return;
      if (finished) { pts = []; finished = false; }      // คลิกหลังวัดจบ = เริ่มรูปใหม่
      var p = [e.lngLat.lng, e.lngLat.lat], last = pts[pts.length - 1];
      if (!last || last[0] !== p[0] || last[1] !== p[1]) pts.push(p);
      draw();
    });
    map.on('dblclick', function () {
      if (!mode || pts.length < 2) return;
      // ดับเบิลคลิกจะเกิดคลิกสองครั้งที่จุดใกล้กัน ตัดจุดสุดท้ายที่ซ้ำออก
      var pa = map.project(pts[pts.length - 1]), pb = map.project(pts[pts.length - 2]);
      if (pts.length > 2 && Math.hypot(pa.x - pb.x, pa.y - pb.y) < 8) pts.pop();
      finished = true; hover = null; draw();
    });
    map.on('mousemove', function (e) {
      if (!mode || finished || !pts.length) return;
      hover = [e.lngLat.lng, e.lngLat.lat]; draw();
    });
  };
})();
