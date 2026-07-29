/**
 * colour-detail — 色票明細 Modal（index.html 與 sets.html 兩頁共用）
 *
 * **碰 DOM，所以不進 lib**；但兩頁都要用，所以也不留在任一控制器裡
 * （DESIGN_GUIDELINES §4.1 的第三種：跨頁共用但碰 DOM 的模組）。
 * 沿用 faber-castell-color 的 colour-detail.js 形制：markup 由本模組注入，
 * 差異行為（點了套組要做什麼）用 callback 交給呼叫端，模組不判斷「我在哪一頁」。
 *
 * 用法：CopicDetail.open(color, { sets, onSetClick })
 */
(function (global) {
  'use strict';

  var L = global.CopicColorLib;
  var ID = 'cp-detail-modal';
  var inst = null;

  function t(key, fallback) {
    if (!global.I18n || !global.I18n.t) return fallback;
    var v = global.I18n.t(key);
    return (v && v !== key) ? v : fallback;
  }

  function ensure() {
    if (document.getElementById(ID)) return;
    var el = document.createElement('div');
    el.id = ID;
    el.className = 'modal detail-modal';
    el.innerHTML =
      '<div class="modal-content">' +
        '<div class="d-head">' +
          '<div id="d-swatch" class="d-swatch"></div>' +
          '<div class="d-id">' +
            '<div id="d-code" class="d-code"></div>' +
            '<div id="d-name" class="d-name"></div>' +
            '<div id="d-parse" class="d-parse"></div>' +
          '</div>' +
        '</div>' +
        '<div id="d-copy" class="d-copy"></div>' +
        '<div class="d-block"><div class="d-label" data-i18n="detail.lines">產品線</div>' +
          '<div id="d-lines" class="line-badges"></div></div>' +
        '<div class="d-block"><div class="d-label" data-i18n="detail.sets">收錄於套組</div>' +
          '<div id="d-sets" class="d-sets"></div></div>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<a href="#!" class="modal-close waves-effect btn-flat" data-i18n="detail.close">關閉</a>' +
      '</div>';
    document.body.appendChild(el);
    inst = M.Modal.init(el, { preventScrolling: false });
    if (global.I18n && global.I18n.apply) global.I18n.apply(el);
  }

  function copyBtn(color, kind, label) {
    var v = L.copyValue(color, kind);
    var a = document.createElement('button');
    a.className = 'd-copy-btn';
    a.type = 'button';
    a.innerHTML = '<span class="k">' + label + '</span><span class="v"></span>';
    a.querySelector('.v').textContent = v;
    a.addEventListener('click', function () {
      navigator.clipboard.writeText(v).then(function () {
        M.toast({ html: t('toast.copied', '已複製') + '：' + v, displayLength: 1400 });
      });
    });
    return a;
  }

  function open(color, opts) {
    opts = opts || {};
    ensure();

    var sw = document.getElementById('d-swatch');
    sw.style.background = color.hex;
    sw.style.color = L.pickTextColor(color);
    sw.textContent = color.code;

    document.getElementById('d-code').textContent = color.code;
    document.getElementById('d-name').textContent = color.name || '';

    // 這支 app 的重點：把可分解的色號當場解釋給人看
    var p = document.getElementById('d-parse');
    var fam = (global.COPIC_FAMILIES || []).filter(function (f) { return f.code === color.family; })[0];
    var bits = [];
    if (fam) bits.push('<b>' + color.family + '</b> ' + fam.name);
    if (color.bg !== undefined && color.bg !== null) {
      bits.push(t('detail.bg', 'Blending Group') + ' <b>' + color.bg + '</b>');
      bits.push(t('detail.iv', 'Intensity') + ' <b>' + color.iv + '</b>');
    }
    p.innerHTML = bits.join('<span class="sep">·</span>');

    var cp = document.getElementById('d-copy');
    cp.innerHTML = '';
    cp.appendChild(copyBtn(color, 'hex', 'HEX'));
    cp.appendChild(copyBtn(color, 'rgb', 'RGB'));
    cp.appendChild(copyBtn(color, 'var', 'var()'));
    cp.appendChild(copyBtn(color, 'class', 'class'));

    var ln = document.getElementById('d-lines');
    ln.innerHTML = '';
    ((global.COPIC_META && global.COPIC_META.lines) || []).forEach(function (line) {
      var on = (color.lines || []).indexOf(line.id) >= 0;
      var b = document.createElement('span');
      b.className = 'line-badge' + (on ? ' on' : '');
      b.textContent = line.name + (on ? ' ✓' : ' —');
      ln.appendChild(b);
    });

    var box = document.getElementById('d-sets');
    box.innerHTML = '';
    var mine = L.setsOfColor(opts.sets || global.COPIC_SETS || [], color.code);
    if (!mine.length) {
      box.innerHTML = '<span class="d-none">' + t('detail.noSet', '不在任何已收錄的套組裡') + '</span>';
    } else {
      mine.forEach(function (s) {
        var a = document.createElement('button');
        a.type = 'button';
        a.className = 'set-pill';
        a.textContent = s.name + (s.complete ? '' : ' *');
        a.title = s.complete ? s.name : s.name + ' — ' + (s.note || '');
        a.addEventListener('click', function () {
          if (opts.onSetClick) opts.onSetClick(s);
        });
        box.appendChild(a);
      });
    }

    inst.open();
  }

  global.CopicDetail = { open: open };
})(window);
