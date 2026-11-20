// Galeria nowych zwierzaków (demo, 20.11.2026): gąska, kaczuszka, kapibara i kotek z wspólnymi nastrojami.
// Tylko do scenariusza #demo-prosty. Prawdziwy zwierzak (pet.js) bez zmian. Własne postacie, kolory z tokenów CSS (app.css).
(function () {
  'use strict';
  var KINDS = ['gaska', 'kaczuszka', 'kapibara', 'kotek'];
  var NAME = { gaska: 'Gąska', kaczuszka: 'Kaczuszka', kapibara: 'Kapibara', kotek: 'Kotek' };
  var MOODS = ['spokoj', 'radosc', 'zapis', 'seria', 'drzemka', 'ciekawosc'];
  var MLAB = { spokoj: 'spokój', radosc: 'radość', zapis: 'zapis', seria: 'seria', drzemka: 'drzemka', ciekawosc: 'ciekawość' };
  var MBTN = { spokoj: 'Spokój', radosc: 'Radość', zapis: 'Zapis!', seria: 'Seria', drzemka: 'Drzemka', ciekawosc: 'Ciekawość' };
  var ALL = 'Gąska, kaczuszka, kapibara i kotek ';
  var SAY = { spokoj: 'są spokojne.', radosc: 'się cieszą.', zapis: 'podskakują po zapisie.', seria: 'świętują serię.', drzemka: 'drzemią.', ciekawosc: 'przyglądają się z ciekawością.' };
  var COL = { gaska: 'goose', kaczuszka: 'duck', kapibara: 'capy', kotek: 'cat' };
  var mood = 'spokoj';

  var v = function (n) { return 'var(--zw-' + n + ')'; };
  // Kształt w kolorze postaci: gradient z odblaskiem i kontur w ciemniejszym odcieniu (nie czarny)
  var fill = function (k) { return ' fill="url(#zw-' + k + '-b)" stroke="' + v(COL[k] + '-ln') + '" stroke-width="2"'; };
  function defs(k) {
    var c = COL[k], mid = k === 'kaczuszka' ? 'var(--duck)' : v(c);
    return '<defs><radialGradient id="zw-' + k + '-b" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="' + v(c + '-hi') + '"/><stop offset=".55" stop-color="' + mid + '"/><stop offset="1" stop-color="' + v(c + '-sh') + '"/></radialGradient>' +
      '<radialGradient id="zw-' + k + '-s"><stop offset="0" stop-color="' + v('shadow') + '"/><stop offset="1" stop-color="' + v('shadow') + '" stop-opacity="0"/></radialGradient></defs>';
  }
  // Oczy: błyszczące z dwoma odblaskami, łuki przy radości, zamknięte przy drzemce
  function eyes(k, m, lx, rx, y, r) {
    return [lx, rx].map(function (x) {
      if (m === 'radosc') return '<path class="zw-arc" d="M' + (x - r) + ' ' + (y + 1) + 'Q' + x + ' ' + (y - r * 1.5) + ' ' + (x + r) + ' ' + (y + 1) + '" fill="none" stroke="' + v('eye') + '" stroke-width="2.6" stroke-linecap="round"/>';
      if (m === 'drzemka') return '<path class="zw-shut" d="M' + (x - r) + ' ' + y + 'Q' + x + ' ' + (y + r) + ' ' + (x + r) + ' ' + y + '" fill="none" stroke="' + v('eye') + '" stroke-width="2.4" stroke-linecap="round"/>';
      var big = m === 'ciekawosc' ? 1.12 : 1;
      return '<g class="zw-eye"><ellipse cx="' + x + '" cy="' + y + '" rx="' + (r * big) + '" ry="' + (r * 1.18 * big) + '" fill="' + v('eye') + '"/>' +
        '<circle cx="' + (x - r * 0.35) + '" cy="' + (y - r * 0.45) + '" r="' + (r * 0.42) + '" fill="' + v('hi') + '"/><circle cx="' + (x + r * 0.38) + '" cy="' + (y + r * 0.4) + '" r="' + (r * 0.18) + '" fill="' + v('hi') + '"/></g>';
    }).join('') + (m === 'ciekawosc' ? '<path class="zw-brow" d="M' + (rx - 5) + ' ' + (y - r - 5) + 'q5 -4 10 -1" fill="none" stroke="' + v(COL[k] + '-ln') + '" stroke-width="2" stroke-linecap="round"/>' : '');
  }
  var blush = function (lx, rx, y) { return '<ellipse cx="' + lx + '" cy="' + y + '" rx="4.6" ry="2.6" fill="' + v('blush') + '" opacity=".6"/><ellipse cx="' + rx + '" cy="' + y + '" rx="4.6" ry="2.6" fill="' + v('blush') + '" opacity=".6"/>'; };
  function mouth(m, x, y) {
    if (m === 'radosc' || m === 'zapis') return '<path d="M' + (x - 4.5) + ' ' + y + 'q4.5 7 9 0z" fill="' + v('mouth') + '" stroke="' + v('mouth') + '" stroke-width="1.2" stroke-linejoin="round"/>';
    if (m === 'drzemka' || m === 'ciekawosc') return '<ellipse cx="' + x + '" cy="' + (y + 1.5) + '" rx="1.8" ry="2" fill="' + v('mouth') + '"/>';
    return '<path d="M' + (x - 3.5) + ' ' + y + 'q3.5 3 7 0" fill="none" stroke="' + v('mouth') + '" stroke-width="1.8" stroke-linecap="round"/>';
  }
  var beak = function (d) { return '<path d="' + d + '" fill="' + v('beak') + '" stroke="' + v('beak-ln') + '" stroke-width="1.6" stroke-linejoin="round"/>'; };
  var feet = function (y) { return '<ellipse cx="42" cy="' + y + '" rx="6.5" ry="3" fill="' + v('beak') + '" stroke="' + v('beak-ln') + '" stroke-width="1.4"/><ellipse cx="58" cy="' + y + '" rx="6.5" ry="3" fill="' + v('beak') + '" stroke="' + v('beak-ln') + '" stroke-width="1.4"/>'; };
  var wings = function (k, y) { var f = ' fill="' + v(COL[k] + '-sh') + '" stroke="' + v(COL[k] + '-ln') + '" stroke-width="1.6" stroke-linejoin="round"'; return '<path d="M30 ' + y + 'q-8 6 -2 14q6 -2 6 -11z"' + f + '/><path d="M70 ' + y + 'q8 6 2 14q-6 -2 -6 -11z"' + f + '/>'; };

  // Ciało (pod głową) i głowa każdej postaci w siatce 100 × 100
  var PARTS = {
    gaska: function (m) {
      return [feet(91) + '<path d="M42 64Q40 52 44 44L56 44Q60 52 58 64Z"' + fill('gaska') + '/><ellipse cx="50" cy="76" rx="23" ry="15"' + fill('gaska') + '/>' + wings('gaska', 69),
        '<path d="M45 16q-5 -8 0 -10q2 5 0 10M50 15q0 -10 5 -11q1 7 -5 11M55 16q5 -6 8 -5q-2 6 -8 5"' + fill('gaska') + ' stroke-linejoin="round"/>' +
        '<ellipse cx="50" cy="36" rx="21" ry="20"' + fill('gaska') + '/>' + eyes('gaska', m, 41, 59, 34, 4) + blush(35, 65, 43) +
        beak(m === 'radosc' || m === 'zapis' ? 'M42 41Q50 37 58 41Q50 45 42 41ZM44 44Q50 54 56 44Q50 47 44 44Z' : 'M42 41Q50 37 58 41Q53 51 50 52Q47 51 42 41Z')];
    },
    kaczuszka: function (m) {
      return [feet(90) + '<ellipse cx="50" cy="77" rx="21" ry="14"' + fill('kaczuszka') + '/>' + wings('kaczuszka', 70),
        '<path d="M49 22q-3 -10 7 -10q-6 3 -3 10" fill="var(--duck)" stroke="' + v('duck-ln') + '" stroke-width="2" stroke-linejoin="round"/>' +
        '<circle cx="50" cy="46" r="26"' + fill('kaczuszka') + '/>' + eyes('kaczuszka', m, 39, 61, 44, 4.4) + blush(31, 69, 53) +
        beak(m === 'radosc' || m === 'zapis' ? 'M40 52Q50 46 60 52Q50 55 40 52ZM43 55Q50 62 57 55Q50 57 43 55Z' : 'M40 52Q50 46 60 52Q60 58 50 58Q40 58 40 52Z')];
    },
    kapibara: function (m) {
      var ln = v('capy-ln');
      return ['<rect x="34" y="84" width="10" height="8" rx="4" fill="' + v('capy-sh') + '" stroke="' + ln + '" stroke-width="1.4"/><rect x="56" y="84" width="10" height="8" rx="4" fill="' + v('capy-sh') + '" stroke="' + ln + '" stroke-width="1.4"/>' +
        '<ellipse cx="50" cy="78" rx="27" ry="13"' + fill('kapibara') + '/>',
        '<ellipse cx="28" cy="23" rx="5" ry="4.5" fill="' + v('capy-sh') + '" stroke="' + ln + '" stroke-width="2"/><ellipse cx="72" cy="23" rx="5" ry="4.5" fill="' + v('capy-sh') + '" stroke="' + ln + '" stroke-width="2"/>' +
        '<rect x="21" y="18" width="58" height="56" rx="22"' + fill('kapibara') + '/>' + eyes('kapibara', m, 36, 64, 35, 3.6) + blush(29, 71, 46) +
        '<rect x="30" y="44" width="40" height="27" rx="13" fill="' + v('capy-mz') + '"/><path d="M42 51q2 -2.4 4 0M54 51q2 -2.4 4 0M50 55v4" fill="none" stroke="' + ln + '" stroke-width="2" stroke-linecap="round"/>' +
        mouth(m, 50, 62)];
    },
    kotek: function (m) {
      var ln = v('cat-ln'), ear = m === 'ciekawosc' ? 'M53 25L70 11L72 36Z' : 'M53 25L69 14L72 36Z';
      return ['<path d="M68 84q17 -1 14 -18q-1 -6 -7 -6" fill="none" stroke="' + ln + '" stroke-width="9" stroke-linecap="round"/><path d="M68 84q17 -1 14 -18q-1 -6 -7 -6" fill="none" stroke="' + v('cat') + '" stroke-width="5.5" stroke-linecap="round"/>' +
        '<ellipse cx="50" cy="77" rx="19" ry="14"' + fill('kotek') + '/><ellipse cx="43" cy="89" rx="5.5" ry="3.5"' + fill('kotek') + '/><ellipse cx="57" cy="89" rx="5.5" ry="3.5"' + fill('kotek') + '/>',
        '<path d="M28 36L31 14L47 25Z' + ear + '"' + fill('kotek') + ' stroke-linejoin="round"/><path d="M32 31L33 20L42 26ZM68 31L67 20L58 26Z" fill="' + v('pink') + '"/>' +
        '<ellipse cx="50" cy="45" rx="27" ry="23"' + fill('kotek') + '/>' +
        '<path d="M50 23v6M44 24l1.2 5M56 24l-1.2 5" stroke="' + v('cat-sh') + '" stroke-width="2.4" stroke-linecap="round"/>' +
        eyes('kotek', m, 39, 61, 45, 4.4) + blush(32, 68, 53) +
        '<path d="M47.5 51.5h5l-2.5 2.8z" fill="' + v('nose') + '" stroke="' + v('nose') + '" stroke-width="1" stroke-linejoin="round"/>' +
        (m === 'spokoj' || m === 'seria' ? '<path d="M45.5 56q2.2 2.4 4.5 0q2.3 2.4 4.5 0" fill="none" stroke="' + ln + '" stroke-width="1.6" stroke-linecap="round"/>' : mouth(m, 50, 56)) +
        '<path d="M26 51l-9 -1.5M26 55l-9 2M74 51l9 -1.5M74 55l9 2" stroke="' + ln + '" stroke-width="1.2" stroke-linecap="round"/>'];
    }
  };
  var HEART = 'M0 3.5C-7 -1.5 -4 -8 0 -4.2C4 -8 7 -1.5 0 3.5Z';
  function fx(m) {
    if (m === 'seria') return [[18, 30], [82, 24], [70, 8]].map(function (p, i) { return '<g transform="translate(' + p[0] + ' ' + p[1] + ')"><path class="zw-heart zw-f' + (i + 1) + '" d="' + HEART + '" fill="' + v('heart') + '"/></g>'; }).join('');
    if (m === 'drzemka') return '<text class="zw-z zw-f1" x="72" y="24" font-size="11" font-weight="700" fill="var(--brass)">z</text><text class="zw-z zw-f2" x="81" y="13" font-size="14" font-weight="700" fill="var(--brass)">z</text>';
    return '';
  }

  function svg(kind, m) {
    var k = PARTS[kind] ? kind : 'gaska'; m = MLAB[m] ? m : 'spokoj';
    var p = PARTS[k](m);
    return '<svg class="zw-svg zw-k-' + k + ' zw-m-' + m + '" viewBox="0 0 100 100" role="img" aria-label="' + NAME[k] + ': ' + MLAB[m] + '">' + defs(k) +
      '<ellipse cx="50" cy="93" rx="26" ry="5" fill="url(#zw-' + k + '-s)"/><g class="zw-body">' + p[0] +
      '<g class="zw-head"' + (m === 'ciekawosc' ? ' transform="rotate(-12 50 62)"' : '') + '>' + p[1] + '</g></g>' + fx(m) + '</svg>';
  }

  function html() {
    return '<div class="zw-moods" role="group" aria-label="Nastrój zwierzaków">' + MOODS.map(function (m) {
      return '<button type="button" class="chip zw-mood" data-zwm="' + m + '" aria-pressed="' + (m === mood) + '">' + MBTN[m] + '</button>';
    }).join('') + '</div><div class="zw-grid">' + KINDS.map(function (k) {
      return '<button type="button" class="zw-card" data-zwk="' + k + '"><span class="zw-fig">' + svg(k, mood) + '</span><span class="zw-name" aria-hidden="true">' + NAME[k] + '</span></button>';
    }).join('') + '</div><p class="zw-sr" id="zw_live" role="status" aria-live="polite"></p>';
  }

  function mount(root) {
    if (!root || typeof root.querySelector !== 'function' || root._zw) return;
    root._zw = true;
    var live = root.querySelector('#zw_live'), tapT = {};
    function setMood(m) {
      mood = m;
      [].forEach.call(root.querySelectorAll('[data-zwm]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-zwm') === m)); });
      [].forEach.call(root.querySelectorAll('[data-zwk]'), function (c) { c.querySelector('.zw-fig').innerHTML = svg(c.getAttribute('data-zwk'), m); });
      live.textContent = ALL + SAY[m];
    }
    function tap(c) {
      var k = c.getAttribute('data-zwk');
      c.classList.remove('zw-tap'); void c.offsetWidth; c.classList.add('zw-tap');
      clearTimeout(tapT[k]); tapT[k] = setTimeout(function () { c.classList.remove('zw-tap'); }, 650);
      live.textContent = NAME[k] + ' podskakuje.';
    }
    // Zdarzenia zostają w sekcji: globalne obsługi aplikacji (app.js) ich nie widzą
    ['keydown', 'pointerdown', 'input'].forEach(function (t) { root.addEventListener(t, function (e) { e.stopPropagation(); }); });
    root.addEventListener('click', function (e) {
      e.stopPropagation();
      var b = e.target.closest && e.target.closest('[data-zwm],[data-zwk]'); if (!b) return;
      if (b.hasAttribute('data-zwm')) setMood(b.getAttribute('data-zwm')); else tap(b);
    });
  }

  globalThis.ZW_DEMO = { html: html, mount: mount, svg: svg, kinds: KINDS, moods: MOODS };
})();
