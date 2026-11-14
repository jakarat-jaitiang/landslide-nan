/* =====================================================================
   main.js  เริ่มการทำงานของเว็บ และผูกปุ่มต่าง ๆ เข้ากับฟังก์ชัน
   ===================================================================== */
(function () {
  'use strict';
  var App = window.App, S = window.SETTINGS, $ = App.$, t = App.t, UI = App.ui, M = App.map;

  /* ---------- ใส่ข้อความจาก js/text.js ลงในหน้าเว็บ ---------- */
  /* data-text="a.b"  = ข้อความในองค์ประกอบ,  data-title="a.b" = คำอธิบายเมื่อชี้เมาส์,  data-alt = คำอธิบายรูป */
  document.querySelectorAll('[data-text]').forEach(function (el) { el.textContent = t(el.dataset.text); });
  document.querySelectorAll('[data-title]').forEach(function (el) { var v = t(el.dataset.title); el.title = v; el.setAttribute('aria-label', v); });
  document.querySelectorAll('[data-alt]').forEach(function (el) { el.alt = t(el.dataset.alt); });
  document.title = t('site.title');

  /* ---------- สลับหน้า: #map  #overview  #data-layers ---------- */
  var VIEWS = ['map', 'overview', 'data-layers'];
  function route() {
    var v = (location.hash || '#map').slice(1); if (VIEWS.indexOf(v) < 0) v = 'map';
    VIEWS.forEach(function (n) { $('view-' + n).hidden = n !== v; });
    document.querySelectorAll('.nav a').forEach(function (a) { if (a.dataset.view === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    if (v === 'map' && M.gl) setTimeout(function () { M.gl.resize(); }, 30);
  }
  window.addEventListener('hashchange', route);

  /* ---------- แถบควบคุมเหนือแผนที่ ---------- */
  $('group-chips').addEventListener('click', function (e) {
    var b = e.target.closest('[data-g]'); if (!b) return;
    var ids = App.groups[+b.dataset.g].layers.map(function (l) { return l.id; }).filter(App.has), on = ids.some(function (id) { return App.state.visible[id]; });
    ids.forEach(function (id) { App.state.visible[id] = !on; M.refresh(id); });
    UI.renderAll();
  });
  $('model-seg').addEventListener('click', function (e) {
    var b = e.target.closest('[data-model]'); if (!b) return;
    App.state.model = b.dataset.model;
    this.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
    App.state.visible[S.studyLayer] = App.state.visible[S.dmrLayer] = true;
    M.refresh(S.studyLayer); M.refresh(S.dmrLayer); UI.renderAll();
  });
  $('btn-full').addEventListener('click', function () {
    try {
      var p = document.fullscreenElement ? document.exitFullscreen() : $('mapwrap').requestFullscreen();
      if (p && p.catch) p.catch(function () { App.toast(t('strip.fullscreenDenied'), true); });
    } catch (err) { App.toast(t('strip.fullscreenDenied'), true); }
  });
  document.addEventListener('fullscreenchange', function () { setTimeout(function () { M.gl.resize(); }, 100); });

  /* ---------- แผงสรุป ---------- */
  $('levels').addEventListener('click', function (e) {
    var b = e.target.closest('[data-lv]'); if (!b) return;
    var n = +b.dataset.lv; App.state.levels[n] = !App.state.levels[n];
    M.applyLevelFilter(); UI.renderLevels();
  });
  $('sum-table').addEventListener('change', function (e) { if (e.target.id === 'scope') UI.setScope(e.target.value, true); });
  $('amphoe').addEventListener('click', function (e) { var b = e.target.closest('[data-a]'); if (b) UI.setScope(b.dataset.a === App.state.scope ? '' : b.dataset.a, true); });
  $('sum-toggle').addEventListener('click', function () { $('sum-body').hidden = !$('sum-body').hidden; });

  /* ---------- เครื่องมือด้านขวา ---------- */
  document.querySelector('.rail').addEventListener('click', function (e) { var b = e.target.closest('[data-tool]'); if (b) UI.setPanel(b.dataset.tool); });
  $('side-close').addEventListener('click', function () { UI.setPanel(App.state.panel); });
  $('zin').addEventListener('click', function () { M.gl.zoomIn(); });
  $('zout').addEventListener('click', function () { M.gl.zoomOut(); });
  $('zfit').addEventListener('click', function () { M.fitProvince(); });
  $('btn-north').addEventListener('click', function () { M.gl.easeTo({ bearing: 0, duration: 500 }); });
  $('btn-3d').addEventListener('click', function () { M.set3D(!App.state.is3D); });

  /* ---------- แผงชั้นข้อมูล ค้นหา และเครื่องมือวัด ---------- */
  $('side-body').addEventListener('change', function (e) {
    var el = e.target;
    if (el.dataset.layer) { App.state.visible[el.dataset.layer] = el.checked; M.refresh(el.dataset.layer); UI.renderChips(); UI.renderLegend(); }
  });
  $('side-body').addEventListener('input', function (e) {
    if (e.target.id === 'q') UI.runSearch(e.target.value);
    else if (e.target.id === 'ras-op') M.setRasterOpacity(e.target.value / 100);
  });
  $('side-body').addEventListener('click', function (e) {
    var hit = e.target.closest('[data-hit]'), ms = e.target.closest('[data-measure]');
    if (hit) UI.openHit(+hit.dataset.hit);
    else if (ms) { App.measure.start(ms.dataset.measure); UI.renderMeasure(); }
    else if (e.target.id === 'measure-clear') { App.measure.clear(); UI.renderMeasure(); }
  });

  /* ---------- คำอธิบายสัญลักษณ์ และแถบสถานะ ---------- */
  $('legend-btn').addEventListener('click', function () { var l = $('legend'); l.hidden = !l.hidden; this.setAttribute('aria-expanded', !l.hidden); });
  $('crs').addEventListener('change', function () { UI.showCoord(); });

  /* ---------- เริ่มทำงาน ---------- */
  route();
  UI.renderAll();
  M.init(function () {
    App.measure.init();
    UI.renderAll();
    UI.showZoom();
  });
})();
