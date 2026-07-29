/**
 * copic-color — 主頁控制器（碰 DOM 的那一半；純邏輯在 copic-color-lib.js）
 *
 * 這支 app 的招牌是**三軸瀏覽**：選一個色系 → 以 Blending Group（縱）×
 * Intensity（橫）排出矩陣。COPIC 的色號本身就是這三個軸的編碼（BV02 =
 * BV / 群 0 / 明度 2），所以矩陣不是我們發明的版面，是把它原本的體系畫出來。
 *
 * 灰階（C/N/T/W）、無彩（A）、螢光（F）不在那套編號裡 → 自動改用一維色票列。
 * 搜尋時也切一維（跨色系的結果排不進單一矩陣）。
 */
(function () {
  'use strict';

  var L = window.CopicColorLib;
  var COLORS = window.COPIC_COLORS || [];
  var FAMS = window.COPIC_FAMILIES || [];
  var SETS = window.COPIC_SETS || [];
  var META = window.COPIC_META || {};
  var KEY_THEME = 'copic-color-theme';
  var KEY_FAM = 'copic-color-family';
  var KEY_LAYOUT = 'copic-color-layout';

  var state = {
    family: localStorage.getItem(KEY_FAM) || 'BV',
    layout: localStorage.getItem(KEY_LAYOUT) || 'axis',   // 'axis' | 'flat'
    q: ''
  };

  var $fams = document.getElementById('families');
  var $axis = document.getElementById('axis');
  var $flat = document.getElementById('flat');
  var $none = document.getElementById('no-result');
  var $count = document.getElementById('count');

  // i18n.t 找不到鍵時回傳鍵名本身，故以「回傳值 === 鍵名」判定缺字典、才用 fallback
  function t(key, fb) {
    if (!window.I18n || !I18n.t) return fb;
    var v = I18n.t(key);
    return (v && v !== key) ? v : fb;
  }

  // ---- 色系 chips ---------------------------------------------------------

  function chipNode(code, label, n, active, onClick) {
    var el = document.createElement('button');
    el.type = 'button';
    el.className = 'fam-chip' + (active ? ' active' : '');
    el.title = label;
    el.innerHTML = '<span class="fam-code"></span><span class="fam-n"></span>';
    el.querySelector('.fam-code').textContent = code;
    el.querySelector('.fam-n').textContent = n;
    el.addEventListener('click', onClick);
    return el;
  }

  function sepNode() {
    var sep = document.createElement('span');
    sep.className = 'fam-sep';
    return sep;
  }

  function renderFamilies() {
    $fams.innerHTML = '';

    // 「全部」＝取消色系選擇的那顆。分組 chips 恆有一個 active、無法取消，
    // 所以「看全部」必須自己是一顆 chip；否則使用者選了色系就出不去
    // （側鍵的版面切換做得到，但那不是使用者會去找的地方）。
    $fams.appendChild(chipNode(
      t('family.all', '全部'), t('family.all', '全部'), COLORS.length,
      state.layout === 'flat',
      function () {
        state.layout = 'flat';
        localStorage.setItem(KEY_LAYOUT, state.layout);
        render();
      }
    ));
    $fams.appendChild(sepNode());

    var prevChromatic = null;
    FAMS.forEach(function (f) {
      if (prevChromatic !== null && f.chromatic !== prevChromatic) $fams.appendChild(sepNode());
      prevChromatic = f.chromatic;
      var n = COLORS.filter(function (c) { return c.family === f.code; }).length;
      $fams.appendChild(chipNode(
        f.code, f.name, n,
        state.layout !== 'flat' && f.code === state.family,
        function () {
          state.family = f.code;
          state.layout = 'axis';
          localStorage.setItem(KEY_FAM, f.code);
          localStorage.setItem(KEY_LAYOUT, state.layout);
          render();
        }
      ));
    });
  }

  // ---- 三軸矩陣 -----------------------------------------------------------

  function cellNode(c) {
    var d = document.createElement('div');
    d.className = 'cp-cell';
    d.style.background = c.hex;
    d.style.color = L.pickTextColor(c);
    d.title = c.code + ' ' + (c.name || '');
    // 產品線縮寫：S=Sketch C=Classic i=Ciao（哪條線有出，一眼可見）
    var tags = [];
    if ((c.lines || []).indexOf('classic') >= 0) tags.push('C');
    if ((c.lines || []).indexOf('ciao') >= 0) tags.push('i');
    d.innerHTML = '<span class="c-code"></span><span class="c-lines"></span>';
    d.querySelector('.c-code').textContent = c.code;
    d.querySelector('.c-lines').textContent = tags.join('');
    d.addEventListener('click', function () { openDetail(c); });
    return d;
  }

  function renderAxis() {
    var fam = FAMS.filter(function (f) { return f.code === state.family; })[0] || FAMS[0];
    var g = L.axisGrid(COLORS, fam.code);

    $axis.innerHTML = '';
    var title = document.createElement('p');
    title.className = 'axis-title';
    if (g.bgs.length) {
      title.innerHTML = '<strong>' + fam.code + '</strong> ' + fam.name
        + ' — ' + t('axis.explain', '縱軸 Blending Group（飽和層級）、橫軸 Intensity（明度層級）')
        + '（' + g.flat.length + '）';
    } else {
      title.innerHTML = '<strong>' + fam.code + '</strong> ' + fam.name
        + ' — ' + t('axis.noGrid', '此色系不在 Blending Group / Intensity 的編號體系內')
        + '（' + g.flat.length + '）';
    }
    $axis.appendChild(title);

    if (!g.bgs.length) {           // 灰階 / 無彩 / 螢光：改一維
      $axis.style.display = 'block';
      $flat.style.display = 'none';
      // 用矩陣同一種色塊排成一列，不是大張的 .cp-card——同樣是「看一個色系」，
      // 換個色系不該連色票的形制都變。少的是那兩條軸，不是色票的樣子。
      var row = document.createElement('div');
      row.className = 'cell-row';
      L.sortColors(g.flat, 'code', FAMS).forEach(function (c) { row.appendChild(cellNode(c)); });
      $axis.appendChild(row);
      $count.textContent = g.flat.length + ' / ' + COLORS.length;
      $none.style.display = 'none';
      return;
    }

    var table = document.createElement('table');
    table.className = 'axis-table';
    var thead = document.createElement('tr');
    var corner = document.createElement('th');
    corner.className = 'corner';
    corner.textContent = 'BG \\ IV';
    thead.appendChild(corner);
    g.ivs.forEach(function (iv) {
      var th = document.createElement('th');
      th.textContent = iv;
      thead.appendChild(th);
    });
    table.appendChild(thead);

    g.bgs.forEach(function (bg) {
      var tr = document.createElement('tr');
      var th = document.createElement('th');
      th.className = 'row-head';
      th.textContent = bg;
      tr.appendChild(th);
      g.ivs.forEach(function (iv) {
        var td = document.createElement('td');
        var c = g.cell(bg, iv);
        if (c) td.appendChild(cellNode(c));
        else {
          var e = document.createElement('div');
          e.className = 'cell-empty';
          td.appendChild(e);
        }
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
    $axis.appendChild(table);

    $axis.style.display = 'block';
    $flat.style.display = 'none';
    $none.style.display = 'none';
    $count.textContent = g.flat.length + ' / ' + COLORS.length;
  }

  // ---- 一維色票列 ---------------------------------------------------------

  function cardNode(c) {
    var el = document.createElement('div');
    el.className = 'cp-card';
    el.innerHTML =
      '<div class="cp-swatch"></div>' +
      '<div class="cp-meta"><div class="cp-name"></div><div class="cp-hex"></div></div>';
    var sw = el.querySelector('.cp-swatch');
    sw.style.background = c.hex;
    sw.style.color = L.pickTextColor(c);
    sw.textContent = c.code;
    el.querySelector('.cp-name').textContent = c.name || '';
    el.querySelector('.cp-hex').textContent = c.hex;
    el.addEventListener('click', function () { openDetail(c); });
    return el;
  }

  // 大張色票卡（帶色名與 hex）只用在跨色系的清單：「全部」與搜尋結果。
  // 單一色系內一律用矩陣那種色塊（見 renderAxis），形制才一致。
  function renderFlat() {
    var list = L.sortColors(L.filter(COLORS, state.q), 'code', FAMS);
    $axis.style.display = 'none';
    $flat.style.display = list.length ? 'grid' : 'none';
    $none.style.display = list.length ? 'none' : 'block';
    $flat.innerHTML = '';
    list.forEach(function (c) { $flat.appendChild(cardNode(c)); });
    $count.textContent = list.length + ' / ' + COLORS.length;
  }

  function render() {
    // 搜尋中整條 chip bar 收起（DESIGN_GUIDELINES §5.13「分組 chips 不可變成死鍵」）：
    // 搜尋結果跨色系，這時留著一顆亮起的色系 chip 只會讓人以為看到的是那個色系的色。
    // 「全部色票」則相反——它自己就是 bar 裡的第一顆 chip，bar 要留著才取消得掉選擇。
    $fams.style.display = state.q ? 'none' : '';
    if (!state.q) renderFamilies();
    // 搜尋中一律走一維（跨色系的結果排不進單一矩陣）
    if (state.q || state.layout === 'flat') renderFlat();
    else renderAxis();
  }

  function openDetail(c) {
    window.CopicDetail.open(c, {
      sets: SETS,
      onSetClick: function (s) { window.open('./sets.html?set=' + encodeURIComponent(s.code), '_blank'); }
    });
  }

  // ---- 側鍵 ---------------------------------------------------------------

  function applyTheme(mode) {
    var r = document.documentElement;
    r.dataset.theme = mode;
    r.classList.toggle('dark-mode', mode === 'dark');
    r.classList.toggle('light-mode', mode === 'light');
    localStorage.setItem(KEY_THEME, mode);
  }

  function initTools() {
    document.getElementById('setting-layout').addEventListener('click', function () {
      state.layout = state.layout === 'axis' ? 'flat' : 'axis';
      localStorage.setItem(KEY_LAYOUT, state.layout);
      render();
    });

    document.getElementById('setting-mode').addEventListener('click', function () {
      applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    });

    document.getElementById('setting-lang').addEventListener('click', function () {
      var next = I18n.cycle();
      M.toast({ html: I18n.t('toast.lang', { name: I18n.name(next) }), displayLength: 1400 });
    });
    // i18n 引擎切語言後自己 apply DOM，但動態產生的節點要重畫（§4：控制器負責重繪）
    document.addEventListener('i18n:changed', function () { render(); CopicDetail.refresh(); });

    var cssModal = M.Modal.init(document.getElementById('css-modal'), { preventScrolling: false });
    document.getElementById('setting-css').addEventListener('click', function () {
      var css = L.buildCss(COLORS, META);
      document.getElementById('css-pre').textContent = css;
      document.getElementById('css-sub').innerHTML =
        COLORS.length + ' ' + t('css.sub', '色，含 <code>:root</code> 變數與 utility classes');
      cssModal.open();
    });
    document.getElementById('css-copy').addEventListener('click', function () {
      navigator.clipboard.writeText(L.buildCss(COLORS, META)).then(function () {
        M.toast({ html: t('toast.copied', '已複製'), displayLength: 1400 });
      });
    });
    function download() {
      var blob = new Blob([L.buildCss(COLORS, META)], { type: 'text/css' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = L.cssFilename();
      a.click();
      URL.revokeObjectURL(a.href);
    }
    document.getElementById('css-download').addEventListener('click', download);
    document.getElementById('setting-download').addEventListener('click', download);

    initNearest();
  }

  // ---- 最接近色 -----------------------------------------------------------

  function initNearest() {
    var modal = M.Modal.init(document.getElementById('nearest-modal'), { preventScrolling: false });
    var $pick = document.getElementById('nearest-input');
    var $hex = document.getElementById('nearest-hex');
    var $line = document.getElementById('nearest-line');
    var $out = document.getElementById('nearest-result');

    $line.innerHTML = '';
    var all = document.createElement('option');
    all.value = '';
    all.textContent = t('nearest.allLines', '全部 358 色（Sketch / Copic Ink）');
    $line.appendChild(all);
    (META.lines || []).forEach(function (l) {
      if (l.id === 'sketch' || l.id === 'ink') return;    // 這兩條就是全色域
      var o = document.createElement('option');
      o.value = l.id;
      o.textContent = l.name + '（' + l.count + '）';
      $line.appendChild(o);
    });

    function run() {
      var rgb = L.hexToRgb($hex.value);
      if (isNaN(rgb.r)) return;
      var res = L.nearestCOPIC(rgb, { n: 6, line: $line.value || undefined, colors: COLORS });
      $out.innerHTML = '';
      res.forEach(function (m) {
        var c = COLORS.filter(function (x) { return x.code === m.code; })[0];
        var el = document.createElement('div');
        el.className = 'near-item';
        el.innerHTML = '<div class="near-sw"></div><div class="near-meta"></div>';
        var sw = el.querySelector('.near-sw');
        sw.style.background = m.hex;
        sw.style.color = L.pickTextColor(c);
        sw.textContent = m.code;
        el.querySelector('.near-meta').innerHTML =
          (m.name || '') + '<br><span class="near-de band-' + m.band + '">ΔE ' + m.deltaE.toFixed(2) + '</span>';
        el.addEventListener('click', function () { modal.close(); setTimeout(function () { openDetail(c); }, 300); });
        $out.appendChild(el);
      });
    }

    $pick.addEventListener('input', function () { $hex.value = $pick.value; run(); });
    $hex.addEventListener('input', function () {
      if (/^#[0-9a-fA-F]{6}$/.test($hex.value)) { $pick.value = $hex.value.toLowerCase(); run(); }
    });
    $line.addEventListener('change', run);
    document.getElementById('setting-nearest').addEventListener('click', function () { run(); modal.open(); });
  }

  // ---- 起手 ---------------------------------------------------------------

  document.addEventListener('DOMContentLoaded', function () {
    if (window.I18n) I18n.apply(document);
    document.getElementById('search').addEventListener('input', function (e) {
      state.q = e.target.value;
      render();
    });
    initTools();
    render();
  });
})();
