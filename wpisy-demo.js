// Propozycje wpisu do wyboru (demo): suwak, kółko, żetony, waga z wyjaśnieniem wahań i karta podsumowania.
// Tylko do scenariusza #demo-prosty. Dane przykładowe, nic się nie zapisuje, żadnych danych z aplikacji.
(function () {
  'use strict';
  var H = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12], M = [0, 15, 30, 45];
  var HIST = [77.4, 77.1, 77.3, 77.0, 76.9, 77.4, 77.6, 77.2, 77.0, 76.8, 77.1, 76.9, 77.3, 76.8]; // 14 dni, ostatni = wczoraj
  var NB = String.fromCharCode(160);
  var CHECK = '<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="11" fill="var(--green)"/><path d="M6 11.5l3.2 3L16 8" stroke="var(--on-green)" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>';
  var PET = '<svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true"><ellipse cx="28" cy="36" rx="18" ry="14" fill="var(--duck)"/><circle cx="34" cy="20" r="10" fill="var(--duck)"/><circle cx="37" cy="18" r="2" fill="var(--ink)"/><path d="M43 21l8 2-8 3z" fill="var(--brass)"/></svg>';

  var sleepTxt = function (m) { return Math.floor(m / 60) + ' h ' + (m % 60) + ' min'; };
  var fmtK = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NB); };
  var fmtW = function (x) { return x.toFixed(1).replace('.', ','); };
  var avg7 = function (arr) { var a = arr.slice(-7); return a.reduce(function (s, x) { return s + x; }, 0) / a.length; };

  // Pasmo wahań wagi: ok. 0,35% masy od wczoraj mieści się w zwykłym wahaniu tygodnia (Turicchi i in. 2020).
  function band(w, y) {
    var d = Math.round((w - y) * 10) / 10, lim = y * 0.0035;
    var ds = (d > 0 ? '+' : d < 0 ? '−' : '±') + fmtW(Math.abs(d)) + ' kg od wczoraj';
    var inside = Math.abs(d) <= lim + 1e-9;
    return {
      inside: inside,
      text: ds + ': ' + (inside
        ? 'mieści się w zwykłym wahaniu tygodnia (ok. 0,35%, tu ok. ' + fmtW(lim) + ' kg). Liczy się średnia 7 dni.'
        : 'więcej niż zwykłe wahanie tygodnia. Pojedyncze ważenie to jeszcze nie trend; zobacz średnią 7 dni.'),
      ds: ds
    };
  }
  function bandText(w, y) { return band(w, y).text; }

  function wheelHtml(id, vals, txt, label) {
    return '<div class="wd-wheel" id="' + id + '" tabindex="0" role="listbox" aria-label="' + label + '"><div class="wd-pad"></div>' +
      vals.map(function (v) { return '<div role="option" data-v="' + v + '">' + txt(v) + '</div>'; }).join('') + '<div class="wd-pad"></div></div>';
  }
  function slider(idv, idr, lab, min, max, step, val, minus, plus, ends, key) {
    return '<p class="wd-lab" id="' + idr + '_l">' + lab + '</p><p class="wd-big" id="' + idv + '" aria-live="polite"></p>' +
      '<div class="wd-slider"><button class="wd-sq" data-wd="step:' + key + ':-1" aria-label="' + minus + '">−</button>' +
      '<input type="range" id="' + idr + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" aria-labelledby="' + idr + '_l">' +
      '<button class="wd-sq" data-wd="step:' + key + ':1" aria-label="' + plus + '">+</button></div>' +
      '<div class="wd-ends" aria-hidden="true"><span>' + ends[0] + '</span><span>' + ends[1] + '</span></div>';
  }
  function chips(key, lab, items, on) {
    return '<p class="wd-lab" id="wd_g' + key + '">' + lab + '</p><div class="wd-chips" role="group" aria-labelledby="wd_g' + key + '" data-wd-g="' + key + '">' +
      items.map(function (t, i) { return '<button class="chip" data-wd="chip:' + key + ':' + i + '" aria-pressed="' + (i === on) + '">' + t + '</button>'; }).join('') + '</div>';
  }

  function html() {
    return '' +
      '<article class="wd-card" aria-labelledby="wd_h1"><div class="wd-lead"><h3 id="wd_h1">1. Suwak i zatwierdzenie</h3><span class="wd-rec">polecany</span></div>' +
      '<p class="wd-note">Przesuń albo dotknij toru; − i + zmieniają o jeden krok. Zapis dopiero po „Zatwierdź”.</p>' +
      slider('wd_vs', 'wd_rs', 'Sen', 180, 720, 15, 435, 'Sen o 15 minut mniej', 'Sen o 15 minut więcej', ['3 h', '12 h'], 's') +
      slider('wd_vk', 'wd_rk', 'Kroki', 0, 20000, 500, 6500, '500 kroków mniej', '500 kroków więcej', ['0', '20 tys.'], 'k') +
      '<button class="btn" data-wd="ok1">Zatwierdź</button><div class="wd-done" id="wd_d1" hidden></div></article>' +

      '<article class="wd-card" aria-labelledby="wd_h2"><div class="wd-lead"><h3 id="wd_h2">2. Kółko jak w budziku</h3></div>' +
      '<p class="wd-note">Przewiń godziny i minuty. Przyciski obok dla osób, które nie przewijają.</p><p class="wd-lab">Sen</p>' +
      '<div class="wd-wheelbox">' + wheelHtml('wd_wh', H, function (v) { return v; }, 'Godziny snu') + '<span class="wd-sep" aria-hidden="true">:</span>' +
      wheelHtml('wd_wm', M, function (v) { return String(v).padStart(2, '0'); }, 'Minuty snu') + '</div>' +
      '<div class="wd-row"><button class="wd-sq" data-wd="wheel:wd_wh:-1" aria-label="Godzina mniej">−</button><button class="wd-sq" data-wd="wheel:wd_wh:1" aria-label="Godzina więcej">+</button>' +
      '<button class="wd-sq" data-wd="wheel:wd_wm:-1" aria-label="15 minut mniej">−</button><button class="wd-sq" data-wd="wheel:wd_wm:1" aria-label="15 minut więcej">+</button></div>' +
      '<p class="wd-big" id="wd_v2" aria-live="polite"></p><button class="btn" data-wd="ok2">Zatwierdź</button><div class="wd-done" id="wd_d2" hidden></div></article>' +

      '<article class="wd-card" aria-labelledby="wd_h3"><div class="wd-lead"><h3 id="wd_h3">3. Żetony</h3></div>' +
      '<p class="wd-note">Jedno dotknięcie, bez zatwierdzania. Najszybsze, ale mniej dokładne.</p>' +
      chips('s', 'Sen', ['5 h', '6 h', '7 h', '8 h', '9 h lub więcej'], 2) + chips('k', 'Kroki', ['poniżej 5 tys.', '5–8 tys.', 'ponad 8 tys.'], 1) +
      '<div class="wd-done" id="wd_d3"></div></article>' +

      '<article class="wd-card" aria-labelledby="wd_hw"><div class="wd-lead"><h3 id="wd_hw">Waga: od ostatniej, ±0,1</h3></div>' +
      '<p class="wd-note">Startuje od wczorajszej wagi. Dotknij − albo +, przytrzymanie zmienia coraz szybciej.</p>' +
      '<div class="wd-weight"><button class="wd-sq" data-wd="wm" aria-label="0,1 kg mniej">−</button><p class="wd-big" id="wd_vw" aria-live="polite"></p>' +
      '<button class="wd-sq" data-wd="wp" aria-label="0,1 kg więcej">+</button></div>' +
      '<div class="wd-band" id="wd_band" role="status"></div>' +
      '<svg class="wd-spark" id="wd_spark" viewBox="0 0 320 120" role="img" aria-label="Waga z 14 dni i średnia 7 dni"></svg>' +
      '<button class="btn" data-wd="okw">Zatwierdź</button><div class="wd-done" id="wd_dw" hidden></div>' +
      '<p class="wd-src">Wahanie tygodnia ok. 0,35% masy, w weekend w górę, w tygodniu w dół: Turicchi i in., PLoS One 2020, <a href="https://pubmed.ncbi.nlm.nih.gov/32353079/" target="_blank" rel="noopener">PMID 32353079</a>.</p></article>' +

      '<article class="wd-card" aria-labelledby="wd_hp"><div class="wd-lead"><h3 id="wd_hp">Po zapisie: Twój stan</h3><span class="wd-rec">zaakceptowane</span></div>' +
      '<p class="wd-note">Karta zwija się do potwierdzenia. Podsumowanie otwiera się przyciskiem, nie samo.</p>' +
      '<div class="wd-pet" id="wd_pet">' + PET + '<div><b id="wd_petline">Gąska czeka na wpis.</b><span class="wd-note">Seria: 4 dni</span></div></div>' +
      '<div class="wd-done" id="wd_sum">' + CHECK + '<span id="wd_sumtxt">Zatwierdź coś w wariancie 1, 2 albo przy wadze.</span></div>' +
      '<div class="wd-row"><button class="btn" data-wd="opensum">Zobacz podsumowanie</button><button class="btn ghost" data-wd="change">Zmień</button></div>' +
      '<div id="wd_stan" hidden><h3 id="wd_stanh" tabindex="-1">Ostatnie 7 dni</h3>' +
      '<div class="wd-dots" role="img" aria-label="Dni z wpisem: 5 z 7"><i class="on">pn</i><i class="on">wt</i><i>śr</i><i class="on">cz</i><i class="on">pt</i><i>sb</i><i class="on">nd</i></div>' +
      '<dl class="wd-kv"><dt>Sen, średnio</dt><dd id="wd_ksen">7 h 0 min</dd><dt>Kroki, średnio</dt><dd id="wd_kk">6' + NB + '200</dd><dt>Samopoczucie „dobrze”</dt><dd>4 dni</dd><dt>Ból głowy</dt><dd>1 dzień</dd><dt>Średnia waga 7 dni</dt><dd id="wd_kw">77,0 kg</dd></dl>' +
      '<div class="wd-band">Za 2 dni z wpisami gąska zaproponuje: <b>posiłki z planu</b>.</div></div></article>';
  }

  function mount(root) {
    if (!root || typeof root.querySelector !== 'function' || root._wd) return;
    root._wd = true;
    var $ = function (id) { return root.querySelector('#' + id); };
    var st = { sen: null, kroki: null, waga: null };
    var w = HIST[HIST.length - 1], hold = 0, rep = 0, hopT = 0;
    var reduce = function () { return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches; };
    var done = function (el, txt) { el.hidden = false; el.innerHTML = CHECK + '<span>' + txt + '</span>'; };
    function hop(line) {
      var p = $('wd_pet'); p.classList.remove('hop'); void p.offsetWidth; p.classList.add('hop');
      clearTimeout(hopT); hopT = setTimeout(function () { p.classList.remove('hop'); }, 450); $('wd_petline').textContent = line;
    }
    function sumUpdate() {
      var parts = [];
      if (st.sen != null) parts.push('Sen ' + sleepTxt(st.sen));
      if (st.kroki != null) parts.push('Kroki ' + fmtK(st.kroki));
      if (st.waga != null) parts.push('Waga ' + fmtW(st.waga) + ' kg');
      $('wd_sumtxt').textContent = parts.length ? 'Zapisane na dziś: ' + parts.join(' · ') : 'Zatwierdź coś w wariancie 1, 2 albo przy wadze.';
      if (st.sen != null) $('wd_ksen').textContent = sleepTxt(Math.round((420 * 6 + st.sen) / 7 / 15) * 15);
      if (st.kroki != null) $('wd_kk').textContent = fmtK(Math.round((6200 * 6 + st.kroki) / 7 / 100) * 100);
    }
    // 1. suwaki
    var rs = $('wd_rs'), rk = $('wd_rk');
    function show1() {
      $('wd_vs').textContent = sleepTxt(+rs.value); rs.setAttribute('aria-valuetext', sleepTxt(+rs.value));
      $('wd_vk').textContent = fmtK(+rk.value); rk.setAttribute('aria-valuetext', fmtK(+rk.value) + ' kroków');
      $('wd_d1').hidden = true;
    }
    // 2. kółko
    var idx = function (el) { return Math.round(el.scrollTop / 50); };
    var val2 = function () { return H[Math.max(0, Math.min(H.length - 1, idx($('wd_wh'))))] * 60 + M[Math.max(0, Math.min(M.length - 1, idx($('wd_wm'))))]; };
    function show2() { $('wd_v2').textContent = sleepTxt(val2()); $('wd_d2').hidden = true; }
    function move(id, d) {
      var el = $(id), max = (id === 'wd_wh' ? H.length : M.length) - 1, i = Math.max(0, Math.min(max, idx(el) + d));
      if (typeof el.scrollTo === 'function') el.scrollTo({ top: i * 50, behavior: reduce() ? 'auto' : 'smooth' }); else el.scrollTop = i * 50;
      setTimeout(show2, reduce() ? 30 : 300);
    }
    // 3. żetony
    var CH = { s: ['5 h', '6 h', '7 h', '8 h', '9 h lub więcej'], k: ['poniżej 5 tys.', '5–8 tys.', 'ponad 8 tys.'] };
    function show3() {
      var s = root.querySelector('[data-wd-g="s"] [aria-pressed="true"]'), k = root.querySelector('[data-wd-g="k"] [aria-pressed="true"]');
      done($('wd_d3'), 'Zapisane od razu: sen ' + s.textContent + ', kroki ' + k.textContent);
    }
    // waga
    function drawSpark() {
      var all = HIST.concat([w]), mn = Math.min.apply(null, all) - 0.3, mx = Math.max.apply(null, all) + 0.3, n = all.length - 1;
      var X = function (i) { return 16 + i * (288 / n); }, Y = function (v) { return 12 + (mx - v) / (mn === mx ? 1 : mx - mn) * 84; };
      var pts = all.map(function (v, i) { return X(i).toFixed(1) + ',' + Y(v).toFixed(1); }).join(' '), av = [];
      for (var i = 6; i <= n; i++) av.push(X(i).toFixed(1) + ',' + Y(avg7(all.slice(0, i + 1))).toFixed(1));
      $('wd_spark').innerHTML = '<polyline points="' + pts + '" fill="none" stroke="var(--line)" stroke-width="2"/>' +
        all.map(function (v, i) { return '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(v).toFixed(1) + '" r="' + (i === n ? 5 : 3) + '" fill="' + (i === n ? 'var(--brass)' : 'var(--muted)') + '"/>'; }).join('') +
        '<polyline points="' + av.join(' ') + '" fill="none" stroke="var(--green)" stroke-width="3" stroke-linecap="round"/>' +
        '<text x="16" y="114">14 dni temu</text><text x="304" y="114" text-anchor="end">dziś</text><text x="304" y="' + (Y(avg7(all)) - 8).toFixed(1) + '" text-anchor="end" fill="var(--green)">średnia 7 dni</text>';
      $('wd_kw').textContent = fmtW(avg7(all)) + ' kg';
    }
    function showW() {
      var b = band(w, HIST[HIST.length - 1]);
      $('wd_vw').innerHTML = fmtW(w) + ' <small>kg</small>';
      $('wd_band').innerHTML = '<b>' + b.ds + '</b>' + b.text.slice(b.ds.length);
      $('wd_dw').hidden = true; drawSpark();
    }
    function bump(d) { w = Math.round((w + d) * 10) / 10; showW(); }
    function holdEnd() { clearTimeout(hold); clearTimeout(rep); window.removeEventListener('pointerup', holdEnd); window.removeEventListener('pointercancel', holdEnd); }

    root.addEventListener('input', function (e) { e.stopPropagation(); if (e.target === rs || e.target === rk) show1(); });
    root.addEventListener('scroll', function (e) {
      var t = e.target; if (t.id !== 'wd_wh' && t.id !== 'wd_wm') return;
      clearTimeout(t._t); t._t = setTimeout(show2, 80);
    }, true);
    root.addEventListener('keydown', function (e) {
      e.stopPropagation();
      var t = e.target;
      if ((t.id === 'wd_wh' || t.id === 'wd_wm') && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) { e.preventDefault(); move(t.id, e.key === 'ArrowDown' ? 1 : -1); }
    });
    root.addEventListener('pointerdown', function (e) {
      var b = e.target.closest && e.target.closest('[data-wd="wm"],[data-wd="wp"]'); if (!b || (e.button || 0) > 0) return;
      e.preventDefault(); holdEnd();
      var d = b.getAttribute('data-wd') === 'wp' ? 0.1 : -0.1, n = 0;
      bump(d);
      hold = setTimeout(function go() { bump(d); n++; rep = setTimeout(go, Math.max(40, 160 - n * 12)); }, 400);
      window.addEventListener('pointerup', holdEnd); window.addEventListener('pointercancel', holdEnd);
    });
    root.addEventListener('click', function (e) {
      e.stopPropagation();
      var b = e.target.closest && e.target.closest('[data-wd]'); if (!b) return;
      var a = b.getAttribute('data-wd').split(':'), c = a[0];
      if (c === 'step') { var r = a[1] === 's' ? rs : rk; r.value = String(+r.value + (+a[2]) * (+r.step)); show1(); }
      else if (c === 'ok1') { st.sen = +rs.value; st.kroki = +rk.value; done($('wd_d1'), 'Zapisane: sen ' + sleepTxt(st.sen) + ', kroki ' + fmtK(st.kroki)); hop('Gąska się wysypia razem z Tobą.'); sumUpdate(); }
      else if (c === 'wheel') move(a[1], +a[2]);
      else if (c === 'ok2') { st.sen = val2(); done($('wd_d2'), 'Zapisane: sen ' + sleepTxt(st.sen)); hop('Gąska ziewa z zadowoleniem.'); sumUpdate(); }
      else if (c === 'chip') {
        var g = b.parentNode; [].forEach.call(g.querySelectorAll('.chip'), function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        show3(); hop('Gąska kiwa głową.');
      }
      else if (c === 'wm' || c === 'wp') { if (e.detail === 0) bump(c === 'wp' ? 0.1 : -0.1); } // myszą i dotykiem zmienia pointerdown; Enter i spacja dają detail 0
      else if (c === 'okw') { st.waga = w; done($('wd_dw'), 'Zapisane: ' + fmtW(w) + ' kg'); hop('Gąska notuje wagę.'); sumUpdate(); }
      else if (c === 'opensum') { $('wd_stan').hidden = false; $('wd_stanh').focus(); }
      else if (c === 'change') { $('wd_stan').hidden = true; rs.focus(); }
    });
    show1(); show3(); showW();
    $('wd_wh').scrollTop = 4 * 50; $('wd_wm').scrollTop = 1 * 50; show2();
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(function () { $('wd_wh').scrollTop = 4 * 50; $('wd_wm').scrollTop = 1 * 50; show2(); });
  }

  globalThis.WPISY_DEMO = { html: html, mount: mount, band: band, bandText: bandText };
})();
