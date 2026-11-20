// Propozycja wpisu (demo): jedna karta „Dziś” z suwakami (sen, kroki), wagą od wczoraj, wpisem z klawiatury i kartą podsumowania.
// Tylko do scenariusza #demo-prosty. Dane przykładowe, nic się nie zapisuje, żadnych danych z aplikacji.
(function () {
  'use strict';
  var HIST = [77.4, 77.1, 77.3, 77.0, 76.9, 77.4, 77.6, 77.2, 77.0, 76.8, 77.1, 76.9, 77.3, 76.8]; // 14 dni, ostatni = wczoraj
  var NB = String.fromCharCode(160);
  var MINUS = '−';
  var CHECK = '<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="11" fill="var(--green)"/><path d="M6 11.5l3.2 3L16 8" stroke="var(--on-green)" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>';
  var PET = '<svg width="44" height="44" viewBox="0 0 56 56" aria-hidden="true"><ellipse cx="28" cy="36" rx="18" ry="14" fill="var(--duck)"/><circle cx="34" cy="20" r="10" fill="var(--duck)"/><circle cx="37" cy="18" r="2" fill="var(--ink)"/><path d="M43 21l8 2-8 3z" fill="var(--brass)"/></svg>';

  var sleepTxt = function (m) { return Math.floor(m / 60) + ' h ' + (m % 60) + ' min'; };
  var fmtK = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NB); };
  var fmtW = function (x) { return x.toFixed(1).replace('.', ','); };
  var avg7 = function (arr) { var a = arr.slice(-7); return a.reduce(function (s, x) { return s + x; }, 0) / a.length; };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  // Wpis z klawiatury: null, gdy tekstu nie da się odczytać; inaczej wartość w zakresie i zaokrąglona do kroku.
  function parseSleep(t) {
    t = String(t).trim().replace(/\s+/g, ''); var m;
    if ((m = /^(\d{1,2}):(\d{1,2})$/.exec(t))) { if (+m[2] > 59) return null; return clamp(Math.round((+m[1] * 60 + +m[2]) / 15) * 15, 180, 720); }
    if (/^\d{1,2}([.,]\d{1,2})?$/.test(t)) return clamp(Math.round(parseFloat(t.replace(',', '.')) * 60 / 15) * 15, 180, 720);
    return null;
  }
  function parseSteps(t) {
    t = String(t).replace(/\s/g, '');
    return /^\d{1,6}$/.test(t) ? clamp(Math.round(+t / 500) * 500, 0, 20000) : null;
  }
  function parseWeight(t) {
    t = String(t).trim().replace(',', '.');
    return /^\d{2,3}(\.\d{1,2})?$/.test(t) ? clamp(Math.round(parseFloat(t) * 10) / 10, 30, 250) : null;
  }

  // Pasmo wahań wagi: ok. 0,35% masy od wczoraj mieści się w zwykłym wahaniu tygodnia (Turicchi i in. 2020).
  function band(w, y) {
    var d = Math.round((w - y) * 10) / 10, lim = y * 0.0035;
    var ds = (d > 0 ? '+' : d < 0 ? MINUS : '±') + fmtW(Math.abs(d)) + ' kg od wczoraj';
    var inside = Math.abs(d) <= lim + 1e-9;
    return { inside: inside, ds: ds, text: ds + ': ' + (inside ? 'mieści się w zwykłym wahaniu (ok. 0,35% masy).' : 'więcej niż zwykłe wahanie. Liczy się średnia 7 dni.') };
  }
  function bandText(w, y) { return band(w, y).text; }

  var NAME = { s: 'Sen', k: 'Kroki', w: 'Waga' };
  var YEST = { s: 435, k: 6500, w: 76.8 };
  var WW = 'Pojedyncze ważenie może odbiegać od średniej; w badaniu tygodniowe wahanie wynosiło średnio 0,35% masy (Turicchi 2020). Patrz na linię średniej.';

  // Kolejność wierszy zależy od pory dnia: rano waga, wieczorem kroki.
  function rowOrder(h) { return h < 12 ? ['w', 's', 'k'] : h >= 18 ? ['k', 's', 'w'] : ['s', 'k', 'w']; }

  // Główny przycisk: automat stanów. Zmiana wiersza ma pierwszeństwo, bo wymaga nowego zatwierdzenia.
  function mainLabel(o) {
    if (o.changed > 0) return 'Zatwierdź (' + o.changed + ')';
    if (o.saved) return o.summaryOpen ? 'Gotowe na dziś' : o.msSinceSave < 5000 ? '\u2713 Zapisane \u00b7 Cofnij' : 'Zobacz, co się zmieniło';
    return o.hasYesterday ? 'Jak wczoraj' : 'Zatwierdź';
  }

  function row(k, minus, plus, init) {
    var wk = k === 'w';
    return '<div class="wd-r" data-k="' + k + '"><span class="wd-lab" id="wd_l' + k + '">' + NAME[k] + '</span>' +
      '<button class="wd-val wd-y" id="wd_v' + k + '" data-wd="edit:' + k + '">' + init + '</button>' +
      '<span class="wd-pm"><button class="wd-sq" data-wd="' + (wk ? 'wm' : 'step:' + k + ':-1') + '" aria-label="' + minus + '">' + MINUS + '</button>' +
      '<button class="wd-sq" data-wd="' + (wk ? 'wp' : 'step:' + k + ':1') + '" aria-label="' + plus + '">+</button>' +
      '<button class="wd-chg" data-wd="chg:' + k + '" aria-label="Zmień: ' + NAME[k].toLowerCase() + '">Zmień</button></span><span class="wd-hint" id="wd_h' + k + '">jak wczoraj?</span></div>';
  }
  function range(id, lab, min, max, step, val) {
    return '<input class="wd-range" type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" aria-labelledby="' + lab + '">';
  }
  var err = function (k) { return '<p class="wd-err" id="wd_e' + k + '" role="alert"></p>'; };
  function group(k) {
    var g = '<div class="wd-g" data-g="' + k + '">';
    if (k === 's') return g + row('s', 'Sen o 15 minut mniej', 'Sen o 15 minut więcej', '7 h 15 min') + range('wd_rs', 'wd_ls', 180, 720, 15, 435) + err('s') + '</div>';
    if (k === 'k') return g + row('k', '500 kroków mniej', '500 kroków więcej', '6' + NB + '500') + range('wd_rk', 'wd_lk', 0, 20000, 500, 6500) + err('k') + '</div>';
    return g + row('w', '0,1 kg mniej', '0,1 kg więcej', '76,8 kg') + err('w') +
      '<p class="wd-band" id="wd_band" role="status"></p>' +
      '<svg class="wd-spark" id="wd_spark" viewBox="0 0 320 84" role="img" aria-label=""></svg>' +
      '<p class="wd-src">Wahanie tygodnia ok. 0,35% masy, w weekend w górę, w tygodniu w dół: Turicchi i in., PLoS One 2020, <a href="https://pubmed.ncbi.nlm.nih.gov/32353079/" target="_blank" rel="noopener">PMID 32353079</a>.</p></div>';
  }

  function html(hour) {
    var h = typeof hour === 'number' ? hour : new Date().getHours();
    return '<article class="wd-card" id="wd_card" aria-labelledby="wd_h1"><h3 id="wd_h1">Dziś</h3>' + rowOrder(h).map(group).join('') +
      '<button class="btn wd-main" id="wd_main" data-wd="main">Jak wczoraj</button><span class="wd-sr" id="wd_live" role="status" aria-live="polite"></span>' +
      '<button class="btn ghost wd-wwb" id="wd_wwb" data-wd="ww" aria-expanded="false" aria-controls="wd_ww" hidden>Co to znaczy?</button><p class="wd-note" id="wd_ww" hidden>' + WW + '</p></article>' +

      '<article class="wd-card" aria-labelledby="wd_hp"><div class="wd-pet" id="wd_pet">' + PET + '<div><h3 id="wd_hp">Twój stan</h3><b id="wd_petline">Gąska czeka na wpis.</b> <span class="wd-note">Seria: 4 dni</span></div></div>' +
      '<div class="wd-done" id="wd_sum">' + CHECK + '<span id="wd_sumtxt">Nic jeszcze nie zapisano na dziś.</span></div>' +
      '<div id="wd_stan" hidden><h3 id="wd_stanh">Ostatnie 7 dni</h3>' +
      '<div class="wd-dots" role="img" aria-label="Dni z wpisem: 5 z 7"><i class="on">pn</i><i class="on">wt</i><i>śr</i><i class="on">cz</i><i class="on">pt</i><i>sb</i><i class="on">nd</i></div>' +
      '<dl class="wd-kv"><dt>Sen, średnio</dt><dd id="wd_ksen">7 h 0 min</dd><dt>Kroki, średnio</dt><dd id="wd_kk">6' + NB + '200</dd><dt>Samopoczucie „dobrze”</dt><dd>4 dni</dd><dt>Ból głowy</dt><dd>1 dzień</dd><dt>Średnia waga 7 dni</dt><dd id="wd_kw">77,0 kg</dd></dl>' +
      '<p class="wd-band">Za 2 dni z wpisami gąska zaproponuje: <b>posiłki z planu</b>.</p></div></article>';
  }

  function mount(root) {
    if (!root || typeof root.querySelector !== 'function' || root._wd) return;
    root._wd = true;
    var $ = function (id) { return root.querySelector('#' + id); };
    var K = ['s', 'k', 'w'];
    var st = { sen: null, kroki: null, waga: null };
    var w = YEST.w, hold = 0, rep = 0, hopT = 0, ed = null, timer = 0;
    var ref = { s: YEST.s, k: YEST.k, w: YEST.w }, everSaved = false, saved = false, grace = false, summaryOpen = false, snap = null, last = 'Jak wczoraj';
    var rowSaved = { s: false, k: false, w: false };
    var rs = $('wd_rs'), rk = $('wd_rk');
    var cur = function (k) { return k === 's' ? +rs.value : k === 'k' ? +rk.value : w; };
    var val = function (k) { return k === 's' ? sleepTxt(+rs.value) : k === 'k' ? fmtK(+rk.value) : fmtW(w) + ' kg'; };
    var changedN = function () { return K.filter(function (k) { return Math.abs(cur(k) - ref[k]) > 1e-9; }).length; };
    var outside = function () { var all = HIST.concat([w]), a = avg7(all); return Math.abs(w - a) > a * 0.0035 + 1e-9; };

    function hop(line) {
      var p = $('wd_pet'); p.classList.remove('hop'); void p.offsetWidth; p.classList.add('hop');
      clearTimeout(hopT); hopT = setTimeout(function () { p.classList.remove('hop'); }, 450); if (line) $('wd_petline').textContent = line;
    }
    function dx(k) {
      var d = cur(k) - YEST[k];
      if (Math.abs(d) < 1e-9) return 'jak wczoraj';
      var sg = d > 0 ? '+' : MINUS, a = Math.abs(d);
      return sg + (k === 's' ? (a < 60 ? a + ' min' : Math.floor(a / 60) + ' h' + (a % 60 ? ' ' + (a % 60) + ' min' : '')) : k === 'k' ? fmtK(a) : fmtW(a) + ' kg') + ' od wczoraj';
    }
    function setRows() {
      K.forEach(function (k) {
        var b = $('wd_v' + k), t = val(k), r = root.querySelector('.wd-r[data-k="' + k + '"]'), g = root.querySelector('.wd-g[data-g="' + k + '"]');
        b.textContent = t; b.setAttribute('aria-label', NAME[k] + ': ' + t + ', dotknij, aby wpisać');
        var same = Math.abs(cur(k) - YEST[k]) < 1e-9;
        b.classList.toggle('wd-y', !everSaved && same && !rowSaved[k]);
        $('wd_h' + k).textContent = rowSaved[k] ? '✓ ' + dx(k) : !everSaved && same ? 'jak wczoraj?' : dx(k);
        r.classList.toggle('saved', rowSaved[k]); g.classList.toggle('saved', rowSaved[k]);
      });
      rs.disabled = rowSaved.s; rk.disabled = rowSaved.k;
      var show = rowSaved.w && saved && outside();
      $('wd_wwb').hidden = !show; if (!show) { $('wd_ww').hidden = true; $('wd_wwb').setAttribute('aria-expanded', 'false'); }
      $('wd_stan').hidden = !(saved && summaryOpen);
    }
    function setMain() {
      var l = mainLabel({ changed: changedN(), saved: saved, summaryOpen: summaryOpen, hasYesterday: !everSaved, msSinceSave: grace ? 0 : 1e9 });
      if (l !== last) { last = l; $('wd_main').textContent = l; $('wd_live').textContent = l; hop(); }
    }
    function sumUpdate() {
      var parts = [];
      if (st.sen != null) parts.push('Sen ' + sleepTxt(st.sen));
      if (st.kroki != null) parts.push('Kroki ' + fmtK(st.kroki));
      if (st.waga != null) parts.push('Waga ' + fmtW(st.waga) + ' kg');
      $('wd_sumtxt').textContent = parts.length ? 'Zapisane na dziś: ' + parts.join(' · ') : 'Nic jeszcze nie zapisano na dziś.';
      if (st.sen != null) $('wd_ksen').textContent = sleepTxt(Math.round((420 * 6 + st.sen) / 7 / 15) * 15);
      if (st.kroki != null) $('wd_kk').textContent = fmtK(Math.round((6200 * 6 + st.kroki) / 7 / 100) * 100);
    }
    function drawSpark(b) {
      var all = HIST.concat([w]), avg = avg7(all), lim = avg * 0.0035, n = all.length - 1;
      var mn = Math.min.apply(null, all.concat([avg - lim])) - 0.2, mx = Math.max.apply(null, all.concat([avg + lim])) + 0.2;
      var X = function (i) { return 12 + i * (296 / n); }, Y = function (v) { return 6 + (mx - v) / (mx - mn) * 52; };
      var pts = all.map(function (v, i) { return X(i).toFixed(1) + ',' + Y(v).toFixed(1); }).join(' '), av = [];
      for (var i = 6; i <= n; i++) av.push(X(i).toFixed(1) + ',' + Y(avg7(all.slice(0, i + 1))).toFixed(1));
      var sp = $('wd_spark');
      sp.innerHTML = '<rect class="wd-zone" x="0" width="320" y="' + Y(avg + lim).toFixed(1) + '" height="' + (Y(avg - lim) - Y(avg + lim)).toFixed(1) + '"/>' +
        '<polyline points="' + pts + '" fill="none" stroke="var(--line)" stroke-width="2"/>' +
        '<polyline points="' + av.join(' ') + '" fill="none" stroke="var(--green)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        all.map(function (v, i) { return i === n ? '' : '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(v).toFixed(1) + '" r="2.5" fill="var(--muted)"/>'; }).join('') +
        '<circle cx="' + X(n).toFixed(1) + '" cy="' + Y(w).toFixed(1) + '" r="5.5" fill="var(--brass)" stroke="var(--surface)" stroke-width="2"/>' +
        '<text x="4" y="80">14 dni temu</text><text x="316" y="80" text-anchor="end">dziś</text><text class="wd-avgl" x="160" y="80" text-anchor="middle">średnia 7 dni</text>';
      sp.setAttribute('aria-label', 'Waga z 14 dni, średnia 7 dni ' + fmtW(avg) + ' kg, dziś ' + fmtW(w) + ' kg, ' + b.ds + '. Pasmo to zwykłe wahanie tygodnia.');
      $('wd_kw').textContent = fmtW(avg) + ' kg';
    }
    function showW() { var b = band(w, YEST.w); $('wd_band').textContent = b.text; drawSpark(b); }
    // Każda zmiana wartości unieważnia zapis; nic nie przełącza się samo (WCAG 3.2.2), podsumowanie tylko się zwija
    function changed() {
      saved = false; grace = false; summaryOpen = false; clearTimeout(timer); showW(); setRows(); setMain();
    }
    function bump(d) { w = Math.round((w + d) * 10) / 10; changed(); }
    function holdEnd() { clearTimeout(hold); clearTimeout(rep); window.removeEventListener('pointerup', holdEnd); window.removeEventListener('pointercancel', holdEnd); }

    function save() {
      snap = { s: +rs.value, k: +rk.value, w: w, ref: { s: ref.s, k: ref.k, w: ref.w }, ever: everSaved, rows: { s: rowSaved.s, k: rowSaved.k, w: rowSaved.w }, st: { sen: st.sen, kroki: st.kroki, waga: st.waga } };
      ref = { s: +rs.value, k: +rk.value, w: w }; everSaved = true; saved = true; grace = true; summaryOpen = false;
      st.sen = ref.s; st.kroki = ref.k; st.waga = ref.w; K.forEach(function (k) { rowSaved[k] = true; });
      clearTimeout(timer); timer = setTimeout(function () { grace = false; setMain(); }, 5000);
      sumUpdate(); setRows(); hop('Gąska się wysypia razem z Tobą.'); setMain();
    }
    function undo() {
      if (!snap) return;
      rs.value = String(snap.s); rk.value = String(snap.k); w = snap.w; ref = snap.ref; everSaved = snap.ever; rowSaved = snap.rows; st = snap.st;
      saved = false; grace = false; summaryOpen = false; clearTimeout(timer); snap = null;
      sumUpdate(); showW(); setRows(); setMain();
    }
    function mainClick() {
      if (changedN() > 0 || !saved) save();
      else if (grace) undo();
      else { summaryOpen = !summaryOpen; setRows(); setMain(); }
    }

    // Wpis z klawiatury w miejscu wartości
    var MSG = { s: 'Wpisz sen jako 7:15, 7,25 albo 7 (godziny).', k: 'Wpisz liczbę kroków, np. 8000.', w: 'Wpisz wagę w kilogramach, np. 76,8.' };
    var PARSE = { s: parseSleep, k: parseSteps, w: parseWeight };
    function startEdit(k) {
      if (ed) endEdit(true);
      $('wd_e' + k).textContent = '';
      var b = $('wd_v' + k), i = document.createElement('input');
      i.id = 'wd_in'; i.className = 'wd-in'; i.type = 'text'; i.autocomplete = 'off';
      i.setAttribute('inputmode', k === 'w' ? 'decimal' : 'numeric'); i.setAttribute('enterkeyhint', 'done');
      i.setAttribute('aria-label', NAME[k] + ': wpisz wartość, Enter zatwierdza, Escape anuluje');
      i.value = k === 's' ? Math.floor(+rs.value / 60) + ':' + String(+rs.value % 60).padStart(2, '0') : k === 'k' ? String(+rk.value) : fmtW(w);
      b.hidden = true; b.parentNode.insertBefore(i, b.nextSibling); ed = { k: k, i: i, b: b };
      i.focus(); i.select();
    }
    function endEdit(apply, refocus) {
      if (!ed) return; var e = ed; ed = null;
      var v = apply ? PARSE[e.k](e.i.value) : undefined;
      if (e.i.parentNode) e.i.parentNode.removeChild(e.i);
      e.b.hidden = false;
      if (apply) {
        if (v === null) $('wd_e' + e.k).textContent = MSG[e.k];
        else {
          $('wd_e' + e.k).textContent = '';
          if (v !== cur(e.k)) { if (e.k === 's') rs.value = String(v); else if (e.k === 'k') rk.value = String(v); else w = v; changed(); }
        }
      }
      if (refocus) e.b.focus();
    }

    root.addEventListener('input', function (e) { e.stopPropagation(); if (e.target === rs || e.target === rk) changed(); });
    root.addEventListener('focusout', function (e) { if (ed && e.target === ed.i) endEdit(true, false); });
    root.addEventListener('keydown', function (e) {
      e.stopPropagation();
      if (ed && e.target === ed.i) {
        if (e.key === 'Enter') { e.preventDefault(); endEdit(true, true); }
        else if (e.key === 'Escape') { e.preventDefault(); endEdit(false, true); }
      }
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
      if (c === 'edit') startEdit(a[1]);
      else if (c === 'step') { var r = a[1] === 's' ? rs : rk; r.value = String(+r.value + (+a[2]) * (+r.step)); changed(); }
      else if (c === 'main') mainClick();
      else if (c === 'chg') { rowSaved[a[1]] = false; setRows(); var f = root.querySelector('.wd-r[data-k="' + a[1] + '"] .wd-val'); if (f) f.focus(); }
      else if (c === 'ww') { var p = $('wd_ww'), open = p.hidden; p.hidden = !open; b.setAttribute('aria-expanded', String(open)); }
      else if (c === 'wm' || c === 'wp') { if (e.detail === 0) bump(c === 'wp' ? 0.1 : -0.1); } // myszą i dotykiem zmienia pointerdown; Enter i spacja dają detail 0
    });
    showW(); setRows(); setMain();
  }

  globalThis.WPISY_DEMO = { html: html, mount: mount, band: band, bandText: bandText, parseSleep: parseSleep, parseSteps: parseSteps, parseWeight: parseWeight, mainLabel: mainLabel, rowOrder: rowOrder };
})();
