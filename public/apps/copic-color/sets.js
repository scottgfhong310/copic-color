/**
 * sets — 套組收錄對照（第二頁的控制器）
 *
 * 這一頁只回答一個問題：**選一個套組，其他套組涵蓋了它幾成？**
 * 形制沿用 faber-castell-color/sets.html（家族第一支雙頁 app 收斂出來的）：
 * 選一個基準組 → 只留下它收錄的色 → 橫向掃其他組 → 表頭寫「相對基準組還缺幾色」。
 *
 * COPIC 有 62 組（FC 是 40），全部並排會寬到不能用，故**預設只比同一條產品線**
 * ——拿 Sketch 的套組去比 Ciao 的套組，本來就不是會發生的購買決策。
 */
(function () {
  'use strict';

  var L = window.CopicColorLib;
  var COLORS = window.COPIC_COLORS || [];
  var SETS = window.COPIC_SETS || [];
  var META = window.COPIC_META || {};
  var byCode = {};
  COLORS.forEach(function (c) { byCode[c.code] = c; });

  var $base = document.getElementById('base-set');
  var $line = document.getElementById('line-filter');
  var $wrap = document.getElementById('matrix-wrap');

  function t(key, fb) {
    if (!window.I18n || !I18n.t) return fb;
    var v = I18n.t(key);
    return (v && v !== key) ? v : fb;
  }

  function setLabel(s) {
    return s.name + '（' + s.colors.length + '）' + (s.complete ? '' : ' ＊');
  }

  // ---- 選單 ---------------------------------------------------------------

  function fillPickers() {
    var q = new URLSearchParams(location.search).get('set');
    $base.innerHTML = '';
    SETS.forEach(function (s) {
      var o = document.createElement('option');
      o.value = s.code;
      o.textContent = setLabel(s);
      $base.appendChild(o);
    });
    if (q && SETS.some(function (s) { return s.code === q; })) $base.value = q;

    $line.innerHTML = '';
    var same = document.createElement('option');
    same.value = 'same';
    same.textContent = t('sets.sameLine', '只比同產品線');
    $line.appendChild(same);
    var all = document.createElement('option');
    all.value = 'all';
    all.textContent = t('sets.allLines', '比全部 62 組');
    $line.appendChild(all);
  }

  // ---- 矩陣 ---------------------------------------------------------------

  function render() {
    var baseCode = $base.value;
    var base = SETS.filter(function (s) { return s.code === baseCode; })[0];
    if (!base) return;

    var cols = $line.value === 'all'
      ? SETS.slice()
      : SETS.filter(function (s) { return s.line === base.line; });

    // 差額一律以全集計算後再取用——只傳可見的欄會讓基準組本身可能不在集合裡
    var gaps = L.columnGaps(SETS, baseCode);

    var rows = L.assortmentMatrix(SETS, baseCode);

    var tbl = document.createElement('table');
    tbl.className = 'matrix';

    // ── 表頭：套組名（直排） ──
    var thead = document.createElement('thead');
    var hr = document.createElement('tr');
    ['c-swatch', 'c-code'].forEach(function (cls) {
      var th = document.createElement('th');
      th.className = cls;
      hr.appendChild(th);
    });
    cols.forEach(function (s) {
      var th = document.createElement('th');
      var d = document.createElement('div');
      d.className = 'set-col' + (s.code === baseCode ? ' is-base' : '');
      d.textContent = setLabel(s);
      d.title = (s.section ? s.section + ' — ' : '') + s.name + (s.note ? '\n' + s.note : '');
      th.appendChild(d);
      hr.appendChild(th);
    });
    thead.appendChild(hr);

    // ── 差額列：相對基準組還缺幾色 ──
    var gr = document.createElement('tr');
    gr.className = 'gap-row';
    var g0 = document.createElement('th');
    g0.className = 'c-swatch';
    gr.appendChild(g0);
    var g1 = document.createElement('th');
    g1.className = 'c-code gap-label';
    g1.textContent = t('sets.gapRow', '相對基準組還缺幾色');
    gr.appendChild(g1);
    cols.forEach(function (s) {
      var td = document.createElement('th');
      var n = gaps[s.code];
      td.className = 'gap-cell ' + (n === 0 ? 'gap-0' : 'gap-n');
      td.textContent = n === 0 ? '0' : '−' + n;
      gr.appendChild(td);
    });
    thead.appendChild(gr);
    tbl.appendChild(thead);

    // ── 內容：基準組的每一個色 ──
    var tb = document.createElement('tbody');
    rows.forEach(function (r) {
      var c = byCode[r.code];
      var tr = document.createElement('tr');

      var tdS = document.createElement('td');
      tdS.className = 'c-swatch';
      var sw = document.createElement('div');
      sw.className = 'm-sw';
      sw.style.background = c ? c.hex : 'transparent';
      sw.title = r.code + ' ' + (c && c.name ? c.name : '');
      sw.addEventListener('click', function () { openDetail(c); });
      tdS.appendChild(sw);
      tr.appendChild(tdS);

      var tdC = document.createElement('td');
      tdC.className = 'c-code';
      var code = document.createElement('span');
      code.className = 'm-code';
      code.textContent = r.code;
      code.addEventListener('click', function () { openDetail(c); });
      tdC.appendChild(code);
      tr.appendChild(tdC);

      cols.forEach(function (s) {
        var td = document.createElement('td');
        var on = r.cells[s.code];
        td.className = on ? 'hit' : 'miss';
        td.textContent = on ? '●' : '·';
        tr.appendChild(td);
      });
      tb.appendChild(tr);
    });
    tbl.appendChild(tb);

    $wrap.innerHTML = '';
    $wrap.appendChild(tbl);
  }

  function openDetail(c) {
    if (!c) return;
    window.CopicDetail.open(c, {
      sets: SETS,
      // 差異行為交給呼叫端：這一頁不跳走，就地換基準組（篩選與捲動位置都保住）
      onSetClick: function (s) {
        $base.value = s.code;
        render();
        M.Modal.getInstance(document.getElementById('cp-detail-modal')).close();
      }
    });
  }

  // ---- 側鍵 ---------------------------------------------------------------

  function initTools() {
    document.getElementById('setting-mode').addEventListener('click', function () {
      var mode = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      var r = document.documentElement;
      r.dataset.theme = mode;
      r.classList.toggle('dark-mode', mode === 'dark');
      r.classList.toggle('light-mode', mode === 'light');
      localStorage.setItem('copic-color-theme', mode);
    });
    document.getElementById('setting-lang').addEventListener('click', function () {
      var next = I18n.cycle();
      M.toast({ html: I18n.t('toast.lang', { name: I18n.name(next) }), displayLength: 1400 });
    });
    document.addEventListener('i18n:changed', function () { fillPickers(); render(); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (window.I18n) I18n.apply(document);
    fillPickers();
    initTools();
    $base.addEventListener('change', render);
    $line.addEventListener('change', render);
    render();
  });
})();
