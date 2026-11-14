/* =====================================================================
   ui.js  แผงต่าง ๆ บนหน้าแผนที่: ปุ่มกลุ่มชั้นข้อมูล ตารางสรุป
          คำอธิบายสัญลักษณ์ แผงชั้นข้อมูล ค้นหา เครื่องมือวัด แถบสถานะ
   ===================================================================== */
(function () {
  'use strict';
  var App = window.App, S = window.SETTINGS, $ = App.$, esc = App.esc, fmt = App.fmt, t = App.t;
  var UI = App.ui = {};
  var lastLngLat = null;

  function levelHead() {
    return App.LEVELS.map(function (n) { return '<th><i style="background:' + App.levelColor[n] + '"></i>' + App.levelName[n] + '</th>'; }).join('');
  }
  function modelLayer() { return App.state.model === 'study' ? S.studyLayer : S.dmrLayer; }

  /* ---------- ปุ่มกลุ่มชั้นข้อมูล และปุ่มระดับ ---------- */
  UI.renderChips = function () {
    $('group-chips').innerHTML = App.groups.map(function (g, i) {
      var ids = g.layers.map(function (l) { return l.id; }).filter(App.has), on = ids.some(function (id) { return App.state.visible[id]; });
      var name = t('strip.groupNames')[i] || g.name;
      return '<button type="button" class="chip" data-g="' + i + '" aria-pressed="' + on + '">' + esc(name) + ' <span class="num">' + ids.length + '</span></button>';
    }).join('');
  };
  UI.renderLevels = function () {
    $('levels').innerHTML = App.LEVELS.map(function (n) {
      return '<button type="button" data-lv="' + n + '" aria-pressed="' + !!App.state.levels[n] + '"><i style="background:' + App.levelColor[n] + '"></i>' + App.levelName[n] + '</button>';
    }).join('');
  };

  /* ---------- ตารางสรุป ---------- */
  /* สถิติของแถวหนึ่ง ตามขอบเขตที่เลือก: {by: [ไม่มีระดับ, 1..5], total, unclassified} */
  function rowStats(row) {
    var sc = App.state.scope;
    if (sc && App.amphoeStats[sc]) {
      var v = App.amphoeStats[sc][row.key] || [0, 0, 0, 0, 0, 0];
      return { by: v, total: App.sum(v), unclassified: v[0] };
    }
    return App.stats[row.layer || modelLayer()] || null;
  }
  UI.summaryTable = function (full) {
    var h = '<div class="scroll"><table class="sum num"><thead><tr><th></th>' + levelHead() + '<th>' + t('summary.total') + '</th></tr></thead><tbody>', unc = [];
    S.summaryRows.forEach(function (row) {
      var st = rowStats(row), d = full ? row.decimals : 0, label = t('summary.rows.' + row.key);
      h += '<tr><td>' + label + '</td>' + App.LEVELS.map(function (n) { return '<td>' + (st ? fmt(st.by[n], d) : '–') + '</td>'; }).join('') + '<td>' + (st ? fmt(st.total, d) : '–') + '</td></tr>';
      if (!App.state.scope && st && st.unclassified > 0.5) unc.push(label + ' ' + fmt(st.unclassified, 0));
    });
    h += '</tbody></table></div>';
    var sc = App.state.scope, inv = App.stats[S.inventoryLayer], invN = inv ? inv.n : null;
    if (sc && App.amphoeStats[sc]) invN = App.sum(App.amphoeStats[sc].inv);
    h += '<div class="small muted" style="margin-top:6px">' + t('summary.inventory') + ': <b class="num ink">' + (invN != null ? fmt(invN) + ' ' + t('summary.inventoryUnit') : '–') + '</b></div>';
    if (sc && App.amphoeStats[sc]) h += '<div class="small muted">' + t('summary.scopeNote', { name: esc(sc), n: App.amphoeStats[sc].n }) + '</div>';
    if (unc.length) h += '<div class="small muted">' + t('summary.unclassified') + ': ' + unc.join(', ') + '</div>';
    return h;
  };
  /* ตารางย่อใน popup ของตำบลและอำเภอ */
  UI.statTable = function (st) {
    if (!st) return '';
    var rows = [['area', 1], ['pop', 0], ['bld', 0], ['village', 0], ['road', 1]];
    var h = '<table class="sum num" style="margin-top:8px"><thead><tr><th></th>' + levelHead() + '</tr></thead><tbody>';
    rows.forEach(function (r) {
      var v = st[r[0]]; if (!v) return;
      h += '<tr><td>' + t('summary.rows.' + r[0]) + '</td>' + App.LEVELS.map(function (n) { return '<td>' + fmt(v[n], r[1]) + '</td>'; }).join('') + '</tr>';
    });
    h += '</tbody></table>';
    var extra = [['inv', 'extraInv'], ['health', 'extraHealth'], ['shelter', 'extraShelter']].map(function (r) { return st[r[0]] ? t('summary.' + r[1]) + ' ' + fmt(App.sum(st[r[0]])) : ''; }).filter(Boolean).join(' · ');
    return h + (extra ? '<div class="small muted" style="margin-top:4px">' + extra + '</div>' : '') + '<div class="small muted">' + t('summary.studyNote') + '</div>';
  };
  UI.amphoeFeatures = function () {
    var fc = App.data.Nan_Amphoe; if (!fc) return [];
    return fc.features.map(function (f) { return { name: String(f.properties.AMPHOE_T || f.properties.AMPHOE_E || ''), f: f }; })
      .sort(function (a, b) { return a.name.localeCompare(b.name, 'th'); });
  };
  UI.amphoePopup = function (name) {
    var a = App.amphoeStats[name]; if (!a) return '';
    return '<div class="pop"><h3>' + esc(name) + '</h3><dl><dt>' + t('summary.tambonCount') + '</dt><dd>' + a.n + '</dd></dl>' + UI.statTable(a) + '</div>';
  };
  UI.renderSummary = function () {
    var sc = App.state.scope;
    $('sum-table').innerHTML = '<div class="opt" style="padding-top:0"><label for="scope" class="small muted">' + t('summary.scope') + '</label><select id="scope"><option value="">' + t('summary.scopeAll') + '</option>'
      + App.amphoes.map(function (a) { return '<option' + (a === sc ? ' selected' : '') + '>' + esc(a) + '</option>'; }).join('') + '</select></div>' + UI.summaryTable(false);
    $('amphoe').innerHTML = App.amphoes.map(function (a) { return '<button type="button" data-a="' + esc(a) + '"' + (a === sc ? ' aria-pressed="true"' : '') + '>' + esc(a) + '</button>'; }).join('');
  };
  UI.setScope = function (name, fly) {
    App.state.scope = App.amphoeStats[name] ? name : '';
    UI.renderSummary(); if (App.pages) App.pages.renderOverview();
    if (!fly) return;
    if (!App.state.scope) { App.map.closePopup(); App.map.fitProvince(); return; }
    var hit = UI.amphoeFeatures().filter(function (a) { return a.name === App.state.scope; })[0];
    if (hit) App.map.flyTo(hit.f, UI.amphoePopup(App.state.scope));
  };

  /* ---------- คำอธิบายสัญลักษณ์ ---------- */
  UI.swatch = function (c, cls) {
    var s = cls ? cls.symbol : c.render.symbol;
    if (!s) return '';
    if (s.kind === 'point') {
      if (App.map.isGlyph(s)) return App.map.glyphSVG(s, 16);
      var m = s.markers[0];
      return '<svg width="20" height="14"><circle cx="10" cy="7" r="' + Math.max(2, Math.min(6, m.size * 0.8)) + '" fill="' + m.fill.hex + '" stroke="' + (m.stroke && m.stroke.a ? m.stroke.hex : 'none') + '"/></svg>';
    }
    if (s.kind === 'line') return '<svg width="20" height="14"><path d="M1 11L8 4l5 5 6-6" fill="none" stroke="' + s.stroke.hex + '" stroke-width="2"/></svg>';
    var onDark = c.group === 0 ? '<rect width="20" height="14" rx="2" fill="#4a5552"/>' : '';   // เส้นขอบเขตสีขาว ต้องมีพื้นเข้มจึงมองเห็น
    return '<svg width="20" height="14">' + onDark + '<rect x="1.5" y="1.5" width="17" height="11" rx="1.5" fill="' + (s.fill && s.fill.a ? s.fill.hex : 'none') + '" stroke="' + (s.stroke && s.stroke.a ? s.stroke.hex : 'none') + '"' + (s.dash ? ' stroke-dasharray="3 2"' : '') + '/></svg>';
  };
  UI.rampCSS = function (c) { return 'linear-gradient(90deg,' + c.legend.stops.map(function (s) { return s[1] + ' ' + (s[0] * 100) + '%'; }).join(',') + ')'; };
  function legendFor(c) {
    var h = '<div class="lg"><h3>' + esc(c.name) + '</h3>';
    if (c.type === 'vector') {
      if (c.render.kind === 'simple') h += '<ul><li>' + UI.swatch(c) + '<span>' + esc(c.name) + '</span></li></ul>';
      else h += '<ul>' + c.render.classes.map(function (k) { return '<li>' + UI.swatch(c, k) + '<span>' + esc(k.label) + '</span></li>'; }).join('') + '</ul>';
    } else if (c.legend.kind === 'classes') {
      h += '<ul>' + c.legend.classes.map(function (k) { return '<li><i class="sw" style="background:' + k.color + '"></i><span>' + esc(k.label) + '</span></li>'; }).join('') + '</ul>';
    } else {
      h += '<div class="rampbar" style="background:' + UI.rampCSS(c) + '"></div><div class="rampends"><span>' + fmt(c.legend.min, 2) + '</span><span>' + fmt(c.legend.max, 2) + '</span></div>'
        + (c.legend.note ? '<div class="small muted">' + esc(c.legend.note) + '</div>' : '');
    }
    return h + '</div>';
  }
  UI.renderLegend = function () {
    var shown = App.order.filter(App.map.shouldShow);
    $('legend-body').innerHTML = shown.length ? shown.map(function (id) { return legendFor(App.layers[id]); }).join('') : '<div class="muted small">' + t('legend.empty') + '</div>';
  };

  /* ---------- แผงด้านขวา: ชั้นข้อมูล ค้นหา เครื่องมือวัด ---------- */
  function badge(id) {
    if (App.loading[id]) return '<span class="badge">' + t('layerPanel.loading') + '</span>';
    if (App.manifest[id]) return '<span class="badge ok num">' + fmt(App.manifest[id].n) + '</span>';
    if (App.rasterIndex[id]) return '<span class="badge ok">' + t('layerPanel.ready') + '</span>';
    return '<span class="badge">' + t('layerPanel.noData') + '</span>';
  }
  UI.badge = badge;
  function searchIndex() {
    var out = [];
    if (App.data.Nan_Tambon) App.data.Nan_Tambon.features.forEach(function (f) {
      var p = f.properties; if (p.TAM_NAM_T) out.push({ label: p.TAM_NAM_T + (p.AMPHOE_T ? ' ' + p.AMPHOE_T : ''), key: p.TAM_NAM_T + ' ' + (p.AMPHOE_T || ''), f: f, tambon: true });
    });
    UI.amphoeFeatures().forEach(function (a) { out.push({ label: a.name, key: a.name, f: a.f, amphoe: a.name }); });
    return out;
  }
  var hits = [];
  UI.runSearch = function (q) {
    var res = $('q-res'); if (!res) return;
    q = q.trim();
    hits = searchIndex().filter(function (x) { return !q || x.key.indexOf(q) >= 0; }).slice(0, 40);
    res.innerHTML = hits.length ? hits.map(function (x, i) { return '<li><button type="button" data-hit="' + i + '">' + esc(x.label) + '</button></li>'; }).join('') : '<li class="muted small">' + t('search.none', { q: esc(q) }) + '</li>';
  };
  UI.openHit = function (i) {
    var x = hits[i]; if (!x) return;
    if (x.amphoe) UI.setScope(x.amphoe, true);
    else App.map.flyTo(x.f, App.map.popupHTML('Nan_Tambon', x.f.properties));
  };
  UI.renderMeasure = function () {
    if (App.state.panel !== 'measure') return;
    var m = App.measure.mode();
    $('measure-hint').textContent = t(m === 'distance' ? 'measure.hintDistance' : m === 'area' ? 'measure.hintArea' : 'measure.hintIdle');
    $('measure-out').innerHTML = App.measure.resultHTML();
    document.querySelectorAll('[data-measure]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.measure === m); });
  };
  UI.renderSide = function () {
    var p = App.state.panel;
    document.querySelectorAll('.rail [data-tool]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.tool === p); });
    $('side').hidden = !p;
    if (!p) return;
    var h = '';
    if (p === 'layers') {
      $('side-title').textContent = t('layerPanel.title', { n: App.order.filter(App.has).length, total: App.order.length });
      h = App.groups.map(function (g, gi) {
        return '<details class="grp" ' + (gi < 3 ? 'open' : '') + '><summary>' + esc(g.name) + '</summary>' + g.layers.map(function (l) {
          var ok = App.has(l.id), cid = 'lyr-' + l.id;
          return '<div class="lyr' + (ok ? '' : ' off') + '"><input type="checkbox" id="' + cid + '" data-layer="' + l.id + '"' + (ok && App.state.visible[l.id] ? ' checked' : '') + (ok ? '' : ' disabled') + '><label for="' + cid + '"><span class="nm">' + esc(l.name) + '</span></label>' + badge(l.id) + '</div>';
        }).join('') + '</details>';
      }).join('')
        + '<div class="opt" style="margin-top:8px"><label for="ras-op" class="small">' + t('layerPanel.opacity') + '</label><input type="range" id="ras-op" min="20" max="100" step="5" value="' + Math.round(App.state.rasterOpacity * 100) + '"></div>'
        + '<p class="small muted" style="margin:4px 0 0">' + t('layerPanel.note') + '</p>';
    } else if (p === 'search') {
      $('side-title').textContent = t('search.title');
      h = '<div class="search"><label class="small muted" for="q">' + t('search.label') + '</label><input id="q" type="search" autocomplete="off" placeholder="' + esc(t('search.placeholder')) + '"><ul class="results" id="q-res"></ul></div>';
    } else if (p === 'measure') {
      $('side-title').textContent = t('measure.title');
      h = '<div class="row"><button type="button" class="btn2" data-measure="distance">' + t('measure.distance') + '</button><button type="button" class="btn2" data-measure="area">' + t('measure.area') + '</button><button type="button" class="btn2" id="measure-clear">' + t('measure.clear') + '</button></div>'
        + '<p class="small muted" id="measure-hint" style="margin:10px 0 6px"></p><div id="measure-out"></div><p class="small muted" style="margin:10px 0 0">' + t('measure.method') + '</p>';
    }
    $('side-body').innerHTML = h;
    if (p === 'search') { UI.runSearch(''); $('q').focus(); }
    if (p === 'measure') UI.renderMeasure();
  };
  UI.setPanel = function (p) {
    if (App.state.panel === 'measure' && p !== 'measure') App.measure.stop();
    App.state.panel = App.state.panel === p ? null : p;
    if (!App.state.panel && p === 'measure') App.measure.stop();
    UI.renderSide();
  };
  UI.renderTools = function () {
    $('btn-3d').setAttribute('aria-pressed', App.state.is3D);
    $('btn-3d-label').textContent = App.state.is3D ? '3D' : '2D';
  };

  /* ---------- แถบสถานะ ---------- */
  UI.showCoord = function (ll) {
    if (ll) lastLngLat = ll;
    if (!lastLngLat) return;
    if ($('crs').value === 'utm') {
      var u = App.geo.toUTM(lastLngLat.lat, lastLngLat.lng);
      $('st-coord').textContent = fmt(Math.round(u.e)) + ' E, ' + fmt(Math.round(u.n)) + ' N (' + t('status.zone') + ' ' + u.zone + 'N)';
    } else $('st-coord').textContent = lastLngLat.lat.toFixed(6) + '° N, ' + lastLngLat.lng.toFixed(6) + '° E';
  };
  UI.showZoom = function () { $('st-zoom').textContent = App.map.gl.getZoom().toFixed(1); };
  UI.renderStatus = function () {
    $('st-loaded').textContent = t('status.loaded', { n: App.order.filter(App.has).length });
    var im = App.state.imagery;
    $('st-note').textContent = (im === false ? t('status.imageryBlocked') : t('status.imagery')) + ' · ' + t('site.disclaimer');
    $('st-note').title = $('st-note').textContent;
  };

  UI.renderAll = function () {
    UI.renderChips(); UI.renderLevels(); UI.renderSummary(); UI.renderLegend(); UI.renderSide(); UI.renderTools(); UI.renderStatus();
    if (App.pages) { App.pages.renderCatalog(); App.pages.renderOverview(); }
  };
})();
