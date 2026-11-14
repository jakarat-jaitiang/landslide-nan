/* =====================================================================
   pages.js  หน้า "ภาพรวม" และหน้า "ข้อมูลแผนที่"
   ===================================================================== */
(function () {
  'use strict';
  var App = window.App, S = window.SETTINGS, $ = App.$, esc = App.esc, fmt = App.fmt, t = App.t;
  var P = App.pages = {};

  function swatchRow(c) {
    var cols = [];
    if (c.type === 'vector') {
      if (c.render.kind !== 'unique') return App.ui.swatch(c);
      cols = c.render.classes.map(function (k) { return App.map.symbolColor(k.symbol); });
    } else if (c.legend.kind === 'classes') cols = c.legend.classes.map(function (k) { return k.color; });
    else return '<div class="rampbar" style="width:120px;background:' + App.ui.rampCSS(c) + '"></div>';
    return '<div class="swatches">' + cols.map(function (x) { return '<i style="background:' + x + '"></i>'; }).join('') + '</div>';
  }
  function detail(c) {
    if (c.type === 'vector') return c.render.kind === 'unique' ? t('catalog.byField') + ' <code>' + esc(c.render.field) + '</code>' : t('catalog.single');
    if (c.legend.kind === 'classes') return t('catalog.classes', { n: c.legend.classes.length });
    return t('catalog.continuous', { min: fmt(c.legend.min, 2), max: fmt(c.legend.max, 2) }) + (c.legend.note ? ' ' + esc(c.legend.note) : '');
  }
  function geomLabel(c) { return t('catalog.geom.' + (c.type === 'raster' ? 'raster' : c.geom)); }

  /* ---------- หน้าข้อมูลแผนที่ ---------- */
  P.renderCatalog = function () {
    var cols = t('catalog.cols');
    var h = '<div><h1>' + t('catalog.title') + '</h1><p class="muted lead">' + t('catalog.lead', { n: App.order.length, g: App.groups.length }) + '</p></div>';
    App.groups.forEach(function (g) {
      h += '<div class="card"><h2>' + esc(g.name) + '</h2><div class="scroll"><table class="cat"><thead><tr>' + cols.map(function (c, i) { return '<th' + (i === cols.length - 1 ? ' class="r"' : '') + '>' + c + '</th>'; }).join('') + '</tr></thead><tbody>';
      g.layers.forEach(function (l) {
        var where = l.src.workspace.replace(/^\.\\FinalProject_Landslide_Nan\\?/, '') || t('catalog.projectFolder');
        h += '<tr><td>' + esc(l.name) + '</td><td>' + geomLabel(l) + '</td><td><code>' + esc(l.src.dataset) + '</code></td><td class="small muted">' + esc(where) + '</td><td>' + swatchRow(l) + '</td><td class="small">' + detail(l) + '</td><td class="r">' + App.ui.badge(l.id) + '</td></tr>';
      });
      h += '</tbody></table></div></div>';
    });
    $('catalog').innerHTML = h;
  };

  /* ---------- หน้าภาพรวม ---------- */
  function bars(st, d, unit) {
    var max = Math.max.apply(null, App.LEVELS.map(function (n) { return st.by[n]; })) || 1;
    return '<div class="bars num">' + App.LEVELS.map(function (n) {
      return '<span>' + App.levelName[n] + '</span><span><span class="bar" style="width:' + (st.by[n] / max * 100) + '%;background:' + App.levelColor[n] + '"></span></span><span class="r">' + fmt(st.by[n], d) + ' ' + unit + '</span>';
    }).join('') + '</div>';
  }
  P.renderOverview = function () {
    var o = window.TEXT.overview, sc = App.state.scope;
    var nv = App.order.filter(function (id) { return App.layers[id].type === 'vector'; }).length;
    var h = '<div><h1>' + o.title + '</h1><p class="muted lead">' + o.lead + '</p></div>';
    h += '<div class="tiles"><div class="tile"><b class="num">' + App.order.length + '</b>' + o.tileAll + '</div><div class="tile"><b class="num">' + nv + '</b>' + o.tileVector + '</div><div class="tile"><b class="num">' + (App.order.length - nv) + '</b>' + o.tileRaster + '</div><div class="tile"><b class="num">' + App.amphoes.length + '</b>' + o.tileAmphoe + '</div></div>';

    var which = sc ? esc(sc) + ' · ' + t('strip.modelStudy') : t(App.state.model === 'study' ? 'strip.modelStudy' : 'strip.modelDmr');
    h += '<div class="card"><h2>' + o.byLevel + ' (' + which + ')</h2>' + App.ui.summaryTable(true) + '</div>';

    [[S.studyLayer, o.charts.areaStudy, 1, o.units.sqkm], [S.dmrLayer, o.charts.areaDmr, 1, o.units.sqkm], ['Pop_Nan_point', o.charts.pop, 0, o.units.person],
      ['Building_Nan_Intersect', o.charts.bld, 0, o.units.building], ['village_Nan_Intersect', o.charts.village, 0, o.units.place], ['road_Nan_main_PairwiseInters', o.charts.road, 1, o.units.km]
    ].forEach(function (x) { if (App.stats[x[0]]) h += '<div class="card"><h2>' + x[1] + '</h2>' + bars(App.stats[x[0]], x[2], x[3]) + '</div>'; });

    if (App.amphoes.length) {
      var hi = function (v) { return v ? v[4] + v[5] : 0; };
      var rows = App.amphoes.map(function (a) { return { a: a, t: App.amphoeStats[a], popHi: hi(App.amphoeStats[a].pop) }; }).sort(function (x, y) { return y.popHi - x.popHi; });
      h += '<div class="card"><h2>' + o.amphoeTitle + '</h2><div class="scroll"><table class="cat num"><thead><tr>' + o.amphoeCols.map(function (c, i) { return '<th' + (i ? ' class="r"' : '') + '>' + c + '</th>'; }).join('') + '</tr></thead><tbody>';
      rows.forEach(function (r) {
        var s = r.t, ar = App.sum(s.area), pp = App.sum(s.pop);
        h += '<tr' + (r.a === sc ? ' class="sel"' : '') + '><td>' + esc(r.a) + '</td><td class="r">' + s.n + '</td><td class="r">' + fmt(ar, 0) + '</td><td class="r">' + fmt(hi(s.area), 0) + ' (' + fmt(ar ? hi(s.area) / ar * 100 : 0, 0) + '%)</td><td class="r">' + fmt(pp, 0) + '</td><td class="r">' + fmt(r.popHi, 0) + ' (' + fmt(pp ? r.popHi / pp * 100 : 0, 0) + '%)</td><td class="r">' + fmt(hi(s.bld), 0) + '</td><td class="r">' + fmt(hi(s.village), 0) + '</td><td class="r">' + fmt(hi(s.road), 0) + '</td><td class="r">' + fmt(App.sum(s.inv), 0) + '</td></tr>';
      });
      h += '</tbody></table></div><p class="small muted note-line">' + o.amphoeNote + '</p></div>';
    }

    h += '<div class="card"><h2>' + o.factorTitle + '</h2><div class="scroll"><table class="cat num"><thead><tr><th>' + o.factorCols[0] + '</th><th class="r">' + o.factorCols[1] + '</th><th class="r">' + o.factorCols[2] + '</th><th>' + o.factorCols[3] + '</th></tr></thead><tbody>';
    App.order.forEach(function (id) {
      var c = App.layers[id]; if (c.type !== 'raster' || c.legend.kind !== 'stretch') return;
      h += '<tr><td>' + esc(c.name) + '</td><td class="r">' + fmt(c.legend.min, 2) + '</td><td class="r">' + fmt(c.legend.max, 2) + '</td><td>' + swatchRow(c) + '</td></tr>';
    });
    h += '</tbody></table></div><p class="small muted note-line">' + o.factorNote + '</p></div>';
    $('overview').innerHTML = h;
  };
})();
