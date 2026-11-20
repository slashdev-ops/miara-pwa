// Wiersze wpisu z suwakiem (20.11.2026): opis wiersza (spec) buduje app.js z własnych zakresów; tutaj rysowanie, stan i obsługa.
// Dwa tryby: save:'commit' (karta „Dziś” z głównym przyciskiem, wartości robocze, Cofnij) i save:'immediate' (zapis od razu:
// kroki w szybkim wpisie, skale 0-10). Stan w mapie z kluczem „zakres:dzień”; identyfikatory z przedrostkiem zakresu.
// Obsługa zdarzeń raz na #main (delegowana), więc przerysowanie ekranu niczego nie odpina.
(function () {
  'use strict';
  const NB = String.fromCharCode(160), MINUS = '−';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const dec = (st) => (String(st).split('.')[1] || '').length;
  const rnd = (v, st) => { const f = Math.pow(10, dec(st)); return Math.round(v * f) / f; };
  const FMT = {
    k: (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, NB),
    w: (x) => (Math.round(x * 10) / 10).toFixed(1).replace('.', ','),
    sleep: (m) => { m = Math.round(m); const H = Math.floor(m / 60), M = m % 60; return M ? H + ' h ' + M + ' min' : H + ' h'; },
    dur: (m) => { m = Math.round(m); const H = Math.floor(m / 60), M = m % 60; return H ? H + ' h' + (M ? ' ' + M + ' min' : '') : M + ' min'; },
  };
  // Przytrzymanie − i +: krok od razu, po 0,3 s co 0,08 s, po 8 krokach co 0,04 s, po 30 krokach krokiem ×5 (jak pola w app.js)
  const HOLD_DELAY = 300, holdGap = (n) => (n > 8 ? 40 : 80), holdMult = (n) => (n > 30 ? 5 : 1), GRACE = 5000, AGAIN = 700;

  // − i +: bez siatki co krok (waga 0,1 kg); z siatką (sen, kroki) wartość spoza siatki dochodzi najpierw do najbliższej kreski w tę stronę
  function step(R, v, d, mult) {
    const L = R.lim, g = R.step, x = mult || 1;
    if (!R.grid) return clamp(rnd(v + d * g * x, g), L[0], L[1]);
    const q = v / g, on = Math.abs(q - Math.round(q)) < 1e-9;
    return clamp(on ? Math.round(q) * g + d * g * x : (d > 0 ? Math.ceil(q) : Math.floor(q)) * g, L[0], L[1]);
  }
  // Suwak z krokiem zależnym od prędkości (20.11.2026): R.step to krok dokładny (suwak, − i +, strzałki), R.coarse siatka zgrubna
  // (szybkie przesunięcie, Page Up i Page Down, przytrzymanie po ok. 1 s). speed: prędkość kciuka w pikselach na sekundę,
  // R.fastPx próg (domyślnie 300 px/s): zwykłe wolne przeciągnięcie zostaje dokładne, szybkie machnięcie trafia na siatkę zgrubną.
  // Wpis z klawiatury zostaje sposobem na dokładną wartość.
  function snapBySpeed(v, speed, R) {
    const f = R.step, c = R.coarse || f, G = R.range || R.lim, th = R.fastPx != null ? R.fastPx : 300;
    if (c > f && Math.abs(speed) > th) return clamp(Math.round(v / c) * c, G[0], G[1]);
    return clamp(rnd(Math.round(v / f) * f, f), G[0], G[1]);
  }
  const coarseOf = (R) => ({ lim: R.lim, step: R.coarse || R.step, grid: true });
  function pageStep(R, v, d) { return step(coarseOf(R), v, d, 1); }
  // Przytrzymanie − i +: n-ty krok; z siatką zgrubną najpierw krok dokładny, po 8 powtórzeniach (ok. 1 s) siatka zgrubna; bez niej jak dotąd (×5 po 30 krokach)
  function holdStep(R, v, d, n) {
    if (R.coarse && R.coarse > R.step) return n > 8 ? step(coarseOf(R), v, d, 1) : step(R, v, d, 1);
    return step(R, v, d, holdMult(n));
  }
  // Kolejność wierszy karty zależy od pory dnia: rano waga, wieczorem kroki
  function rowOrder(h) { return h < 12 ? ['w', 's', 'k'] : h >= 18 ? ['k', 's', 'w'] : ['s', 'k', 'w']; }
  // Przycisk, który reaguje (20.11.2026): wspólny automat głównego przycisku karty „Dziś” i przycisków Posiłków, Treningu i Badań (app.js).
  // o {ms: czas od zapisu w ms (null: bez zapisu w tej sesji), saved: wpis już jest, grace: okno „Cofnij” w ms (Infinity: do następnej zmiany), idle, done, again: napisy}
  // Wynik {st: 'idle' | 'grace' | 'again', label, tap}: tap 'save' zapisuje, 'undo' cofa, 'skip' to drugie dotknięcie w AGAIN ms po zapisie (WCAG 2.2.1: bez cofnięcia przez pomyłkę)
  function actBtn(o) {
    const ms = o.ms == null ? Infinity : o.ms, g = o.grace > 0 ? o.grace : GRACE;
    if (ms < g) return { st: 'grace', label: o.done, tap: ms < AGAIN ? 'skip' : 'undo' };
    return o.saved || ms < Infinity ? { st: 'again', label: o.again, tap: 'save' } : { st: 'idle', label: o.idle, tap: 'save' };
  }
  // Główny przycisk: automat stanów. Zmiana wiersza ma pierwszeństwo, bo wymaga nowego zatwierdzenia.
  function mainLabel(o) {
    if (o.changed > 0) return 'Zatwierdź (' + o.changed + ')';
    if (o.saved) return actBtn({ ms: o.msSinceSave, saved: true, grace: o.grace, done: '✓ Zapisane · Cofnij', again: o.summaryOpen ? 'Gotowe na dziś' : 'Zobacz, co się zmieniło' }).label;
    return o.hasYesterday ? (o.yday === false ? 'Jak ostatnio' : 'Jak wczoraj') : 'Zatwierdź';
  }
  // Wykres serii (ostatnia wartość = dziś na żywo); band {ref, pct} opcjonalny: pas wokół wartości odniesienia.
  // o {win, avgLab, fromLab, lastPt} (trend talii i FFM): średnia z okna win dni liczona w dniach pomiarów (bez schodków), wyróżniony ostatni pomiar zamiast dzisiejszego dnia
  function spark(vals, band, o) {
    o = o || {};
    let hi = vals.length - 1;
    if (o.lastPt) while (hi > 0 && vals[hi] == null) hi--;
    const n = vals.length - 1, f = (x) => x.toFixed(1), live = vals[hi], W = o.win || 7;
    const pts = vals.map((v, i) => (v == null ? null : [i, v])).filter(Boolean), ys = pts.map((p) => p[1]);
    const lim = band ? band.ref * band.pct : 0, ext = band ? [band.ref - lim, band.ref + lim] : [];
    const mn = Math.min.apply(null, ys.concat(ext)) - 0.2, mx = Math.max.apply(null, ys.concat(ext)) + 0.2;
    const X = (i) => 12 + i * (296 / Math.max(1, n)), Y = (v) => 6 + (mx - v) / (mx - mn) * 52, av = [];
    const i0 = o.win ? Math.max(0, vals.findIndex((x) => x != null)) : W - 1;
    for (let i = i0; i <= n; i++) { if (o.win && vals[i] == null) continue; const w = vals.slice(Math.max(0, i - W + 1), i + 1).filter((x) => x != null); if (w.length) av.push(f(X(i)) + ',' + f(Y(w.reduce((s, x) => s + x, 0) / w.length))); }
    return (band ? '<rect class="wp-zone" x="0" width="320" y="' + f(Y(band.ref + lim)) + '" height="' + f(Y(band.ref - lim) - Y(band.ref + lim)) + '"/>' : '')
      + '<polyline points="' + pts.map((p) => f(X(p[0])) + ',' + f(Y(p[1]))).join(' ') + '" fill="none" stroke="var(--edge)" stroke-width="2"/>'
      + (av.length > 1 ? '<polyline points="' + av.join(' ') + '" fill="none" stroke="var(--green)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' : '')
      + pts.filter((p) => p[0] !== hi).map((p) => '<circle cx="' + f(X(p[0])) + '" cy="' + f(Y(p[1])) + '" r="2.5" fill="var(--muted)"/>').join('')
      + (live != null ? '<circle cx="' + f(X(hi)) + '" cy="' + f(Y(live)) + '" r="5.5" fill="var(--brass)" stroke="var(--surface)" stroke-width="2"/>' : '')
      + '<text x="4" y="80">' + (o.fromLab || (n + 1) + ' dni temu') + '</text><text x="316" y="80" text-anchor="end">dziś</text><text class="wp-avgl" x="160" y="80" text-anchor="middle">' + (o.avgLab || 'średnia 7 dni') + '</text>';
  }

  // ---------- Stan: mapa „zakres:dzień” ----------
  // base: dzisiejsza wartość w chwili zmiany; inna dzisiejsza wartość (import ze Skrótu, zegarek) czyści wartość roboczą wiersza
  const ST = new Map(), CARDS = {}, ROWS = {};
  let KEEP = true, ED = null, HOLD = null, TIMER = 0, QP = null, DRAG = null, SWALLOW = 0, LAST = null; // LAST: ostatnie przeciągnięcie (prędkość, wartość surowa i po siatce), do diagnostyki i testów
  const SK = (scope) => 'miara-wpisy:' + scope;
  const ss = () => { try { return KEEP && globalThis.sessionStorage ? globalThis.sessionStorage : null; } catch (_) { return null; } };
  const fresh = (scope, day) => ({ scope, day, draft: {}, base: {}, open: {}, err: {}, ext: {}, savedAt: 0, lastCommit: 0, summaryOpen: false, snap: null });
  function persist(s) {
    const st = ss(); if (!st || s.noStore) return;
    try { if (Object.keys(s.draft).length) st.setItem(SK(s.scope), JSON.stringify({ day: s.day, draft: s.draft, base: s.base })); else st.removeItem(SK(s.scope)); } catch (_) {}
  }
  // Wartości robocze z sessionStorage: tylko z tego samego dnia; inny dzień je czyści
  function state(scope, day, noStore) {
    const id = scope + ':' + day;
    if (ST.has(id)) return ST.get(id);
    for (const k of [...ST.keys()]) if (k.split(':')[0] === scope) ST.delete(k);
    const s = fresh(scope, day);
    s.noStore = !!noStore;
    const st = !noStore && ss();
    if (st) {
      try {
        const o = JSON.parse(st.getItem(SK(scope)) || 'null');
        if (o && o.day === day) Object.keys(o.draft || {}).forEach((k) => { if (typeof o.draft[k] === 'number' && isFinite(o.draft[k])) { s.draft[k] = o.draft[k]; s.base[k] = (o.base || {})[k] === undefined ? null : o.base[k]; } });
        else st.removeItem(SK(scope));
      } catch (_) {}
    }
    ST.set(id, s);
    return s;
  }
  function sync(s, rows) {
    let gone = false;
    rows.forEach((R) => {
      if (!(R.key in s.draft)) return;
      const now = R.today == null ? null : R.today;
      if (s.base[R.key] === undefined) s.base[R.key] = now;
      else if (s.base[R.key] !== now) { delete s.draft[R.key]; delete s.base[R.key]; gone = true; }
    });
    if (gone) persist(s);
  }
  function setDraft(s, R, v) { if (!(R.key in s.draft)) s.base[R.key] = R.today == null ? null : R.today; s.draft[R.key] = v; s.savedAt = 0; s.summaryOpen = false; persist(s); }
  function draft(scope, day) { return state(scope, day).draft; }
  // reset(true): jak przeładowanie strony (pamięć znika, sessionStorage zostaje); reset(): także sessionStorage
  function reset(keepStore) {
    clearTimeout(TIMER); holdEnd(false); ED = null;
    if (!keepStore) { const st = ss(); try { if (st) for (const s of ST.values()) st.removeItem(SK(s.scope)); if (st) st.removeItem(SK('wp')); } catch (_) {} }
    ST.clear();
  }
  function persistOn(on) { KEEP = !!on; }

  // ---------- Wiersz ----------
  function rowState(R, s) {
    const d = s.draft[R.key], saved = R.today != null, cur = d != null ? d : R.start.v;
    return { cur, src: R.start.src, saved, changed: d != null && Math.abs(d - (saved ? R.today : R.start.v)) > 1e-9 };
  }
  function dx(R, v, l) {
    const d = rnd(v - l.v, R.step), ref = l.y ? 'od wczoraj' : 'od ostatniego wpisu';
    if (Math.abs(d) < 1e-9) return l.y ? 'jak wczoraj' : 'jak ostatnio';
    return (d > 0 ? '+' : MINUS) + (R.fmtDelta || R.fmt)(Math.abs(d)) + ' ' + ref;
  }
  function rowView(R, s, mode) {
    const x = rowState(R, s), l = R.last, show = mode === 'commit' && x.saved && !x.changed && !s.open[R.key], t = R.fmt(x.cur);
    let hint = '';
    if (show) hint = '✓ ' + (l ? dx(R, x.cur, l) : 'zapisane');
    else if (mode === 'commit' && (x.changed || x.saved)) hint = l ? dx(R, x.cur, l) : '';
    else if (x.saved || x.changed) hint = '';
    else if (x.src === 'last') hint = R.hintLast != null ? R.hintLast : R.copy === false ? (R.hintDefault || '') : l.y ? 'jak wczoraj?' : 'jak ostatnio?';
    else if (x.src === 'default') hint = R.hintDefault || '';
    const sub = !show && !x.saved && !x.changed && l ? 'ostatnio: ' + (R.lastLab ? R.lastLab(l) : l.date) : x.src === 'profile' && !x.changed && !x.saved ? 'z Twoich danych' : !x.saved && !x.changed && R.subStart ? R.subStart : '';
    // Wiersz z zapisem od razu: niezapisana wartość (wyszarzona) ogłaszana jako niezapisana, ostatnia także jako „ostatnio”
    const un = mode === 'immediate' && !x.saved && !x.changed ? (R.greyLab != null ? R.greyLab : x.src === 'last' ? ', ostatnio, niezapisane' : ', niezapisane') : '';
    return { x, cur: x.cur, txt: t, show, grey: !x.saved && !x.changed, hint, sub, aria: R.label + ': ' + t + un + ', dotknij, aby wpisać', vt: (R.vt ? R.vt(x.cur) : t) + un };
  }
  const ids = (scope, R) => { const P = scope + '_'; return { v: R.id || P + R.key, l: P + 'l' + R.key, r: P + 'r' + R.key, h: P + 'h' + R.key, d: P + 'd' + R.key, e: P + 'e' + R.key, x: P + 'x' + R.key, n: P + 'n' + R.key }; };
  function rowHtml(scope, R, s, mode) {
    const v = rowView(R, s, mode), I = ids(scope, R), G = R.range;
    // wp-ctl: wartość i − + razem (w karcie display:contents, w ramce .wp-f jedna nierozdzielna grupa po prawej)
    return '<div class="wp-g" data-g="' + R.key + '"><div class="wp-r' + (v.show ? ' saved' : '') + '" data-row="' + R.key + '"><span class="wp-lab" id="' + I.l + '">' + R.label + '</span><span class="wp-ctl">'
      + (R.edit !== false ? '<button class="wp-val' + (v.grey ? ' wp-y' : '') + '" id="' + I.v + '" data-wp="edit:' + R.key + '" aria-label="' + v.aria + '" aria-describedby="' + I.h + ' ' + I.d + ' ' + I.e + '">' + v.txt + '</button>'
        : '<span class="wp-val wp-big' + (v.grey ? ' wp-y' : '') + '" id="' + I.v + '" aria-hidden="true">' + v.txt + '</span>')
      + '<span class="wp-pm"><button class="wp-sq" data-wp="pm:' + R.key + ':-1" aria-label="' + R.pm[0] + '">' + MINUS + '</button><button class="wp-sq" data-wp="pm:' + R.key + ':1" aria-label="' + R.pm[1] + '">+</button>'
      + (mode === 'commit' ? '<button class="wp-chg" data-wp="chg:' + R.key + '" aria-label="Zmień: ' + R.label.toLowerCase() + '">Zmień</button>' : '') + '</span></span>'
      + '<span class="wp-hint" id="' + I.h + '">' + v.hint + '</span><span class="wp-sub" id="' + I.d + '">' + v.sub + '</span></div>'
      + (G ? '<input class="wp-range" type="range" id="' + I.r + '" min="' + G[0] + '" max="' + G[1] + '" step="' + R.step + '" value="' + clamp(v.cur, G[0], G[1]) + '" aria-labelledby="' + I.l + '"' + (mode === 'immediate' ? ' aria-describedby="' + I.h + ' ' + I.d + (R.ends ? ' ' + I.n : '') + '"' : '') + ' aria-valuetext="' + v.vt + '" data-wpr="' + R.key + '"' + (v.show ? ' disabled' : '') + '>' : '')
      + '<p class="wp-err" id="' + I.e + '">' + (s.err[R.key] ? '<span role="alert">' + s.err[R.key] + '</span>' : '') + '</p>'
      + (R.ends ? '<span class="wp-sr" id="' + I.n + '">' + R.ends.join(', ') + '</span><div class="wp-ends" aria-hidden="true"><span>' + R.ends[0] + '</span><span>' + R.ends[1] + '</span></div>' : '')
      + (R.extra ? '<div class="wp-x" id="' + I.x + '">' + R.extra(v.cur, { saved: v.x.saved && !v.x.changed, open: !!s.ext[R.key] }) + '</div>' : '') + '</div>';
  }
  // Wiersze z zapisem od razu: każdy w osobnym pojemniku z zakresem; spec zostaje w rejestrze do obsługi zdarzeń
  // cls: dodatkowa klasa pojemnika (wp-f: wiersz w ramce .panel w miejscu dawnego pola)
  function rows(scope, day, list, cls) {
    const s = state(scope, day, true);
    return list.map((R) => { ROWS[scope + ':' + R.key] = R; return '<div class="wp-q' + (cls ? ' ' + cls : '') + '" data-wps="' + scope + '" data-wpk="' + R.key + '">' + rowHtml(scope, R, s, 'immediate') + '</div>'; }).join('');
  }

  // ---------- Karta (save:'commit') ----------
  // cfg: {scope, day, title, rows:[spec], api:{commit(vals, meta) -> poprzednie, restore(poprzednie), onSaved(key, v), say(t), summary() -> html, grace() -> ms}}
  const copyRows = (cfg, s) => cfg.rows.filter((R) => { const x = rowState(R, s); return !x.saved && !x.changed && x.src === 'last' && R.copy !== false; });
  const changedRows = (cfg, s) => cfg.rows.filter((R) => rowState(R, s).changed);
  const allSaved = (cfg) => cfg.rows.every((R) => R.today != null);
  const graceOf = (cfg) => { const g = cfg.api && cfg.api.grace ? cfg.api.grace() : GRACE; return g > 0 ? g : GRACE; };
  const inGrace = (cfg, s) => !!s.savedAt && Date.now() - s.savedAt < graceOf(cfg);
  // Co zapisać: „Zatwierdź (N)” tylko N zmienionych wierszy; bez zmian „Jak wczoraj” tylko kopiowalne wiersze z ostatnią wartością.
  // Nigdy wartości z profilu ani typowej bez zmiany; waga nie jest kopiowana (to pomiar).
  function commitSet(cfg, dr) {
    const s = { draft: dr || {}, open: {} }, ch = changedRows(cfg, s), cp = ch.length ? [] : copyRows(cfg, s), vals = {};
    (ch.length ? ch : cp).forEach((R) => { vals[R.key] = rowState(R, s).cur; });
    return { vals, copied: cp.map((R) => R.key) };
  }
  function labelOf(cfg, s) {
    const cp = copyRows(cfg, s);
    return mainLabel({ changed: changedRows(cfg, s).length, saved: allSaved(cfg) || inGrace(cfg, s), summaryOpen: s.summaryOpen, hasYesterday: cp.length > 0,
      yday: cp.every((R) => R.last.y), msSinceSave: inGrace(cfg, s) ? 0 : Infinity, grace: Infinity });
  }
  function edit(cfg, key, text) {
    const s = state(cfg.scope, cfg.day), R = cfg.rows.find((x) => x.key === key), r = R.parse(text);
    if (r.err) { s.err[key] = r.err; return r; }
    s.err[key] = '';
    const ch = Math.abs(r.v - rowState(R, s).cur) > 1e-9;
    if (ch) setDraft(s, R, r.v);
    return { v: r.v, changed: ch };
  }
  function enterHint(list, key) { return list.map((R) => R.key).indexOf(key) === list.length - 1 ? 'done' : 'next'; }
  function card(cfg) {
    if (!cfg || !cfg.rows.length) return '';
    CARDS[cfg.scope] = cfg;
    const s = state(cfg.scope, cfg.day);
    sync(s, cfg.rows);
    if (ED && !ED.i.isConnected) ED = null;
    const P = cfg.scope + '_';
    return '<article class="wp-card" id="' + P + 'card" data-wps="' + cfg.scope + '" aria-labelledby="' + P + 'hd"><h3 id="' + P + 'hd">' + cfg.title + '</h3>'
      + cfg.rows.map((R) => rowHtml(cfg.scope, R, s, 'commit')).join('')
      + '<button class="btn wp-main" id="' + P + 'main" data-wp="main">' + labelOf(cfg, s) + '</button><span class="wp-sr" id="' + P + 'live" role="status" aria-live="polite"></span>'
      + '<div class="wp-sum" id="' + P + 'sum"' + (allSaved(cfg) && s.summaryOpen ? '' : ' hidden') + '>' + (cfg.api.summary ? cfg.api.summary() : '') + '</div></article>';
  }
  // Po zapisie: wartości robocze zapisanych wierszy znikają (także z sessionStorage)
  function markSaved(scope, day, vals) {
    const s = state(scope, day);
    Object.keys(vals).forEach((k) => { delete s.draft[k]; delete s.base[k]; });
    s.open = {}; s.err = {}; s.savedAt = Date.now(); s.lastCommit = Date.now(); s.summaryOpen = false; s.snap = { vals, prev: null };
    persist(s);
    return s;
  }

  // ---------- Rysowanie w miejscu ----------
  const q = (root, id) => (root && root.querySelector ? root.querySelector('[id="' + id + '"]') : null);
  function errShow(p, msg) {
    if (!p || p.textContent === (msg || '')) return;
    p.textContent = '';
    if (msg) { const sp = document.createElement('span'); sp.setAttribute('role', 'alert'); sp.textContent = msg; p.appendChild(sp); }
  }
  function paintRow(root, scope, R, s, mode) {
    const v = rowView(R, s, mode), I = ids(scope, R), b = q(root, I.v), r = root.querySelector('.wp-r[data-row="' + R.key + '"]'), rg = q(root, I.r), h = q(root, I.h), d = q(root, I.d), x = q(root, I.x);
    if (b) { b.textContent = v.txt; if (b.tagName === 'BUTTON') b.setAttribute('aria-label', v.aria); b.classList.toggle('wp-y', v.grey); }
    if (r) r.classList.toggle('saved', v.show);
    if (h) h.textContent = v.hint;
    if (d) d.textContent = v.sub;
    errShow(q(root, I.e), s.err[R.key]);
    if (rg) { const c = clamp(v.cur, R.range[0], R.range[1]); if (+rg.value !== c) rg.value = String(c); rg.setAttribute('aria-valuetext', v.vt); rg.disabled = v.show; }
    if (x && R.extra) { const hx = R.extra(v.cur, { saved: v.x.saved && !v.x.changed, open: !!s.ext[R.key] }); if (x._h !== hx) { x.innerHTML = hx; x._h = hx; } }
  }
  function paintCard(cfg) {
    const root = document.getElementById(cfg.scope + '_card'); if (!root) return;
    const s = state(cfg.scope, cfg.day), P = cfg.scope + '_';
    cfg.rows.forEach((R) => paintRow(root, cfg.scope, R, s, 'commit'));
    const l = labelOf(cfg, s), mb = q(root, P + 'main'), sm = q(root, P + 'sum');
    if (mb && mb.textContent !== l) { mb.textContent = l; const lv = q(root, P + 'live'); if (lv) lv.textContent = l; }
    if (sm) sm.hidden = !(allSaved(cfg) && s.summaryOpen);
  }

  // ---------- Obsługa zdarzeń (raz na #main) ----------
  // Koniec przytrzymania w wierszu z zapisem od razu: zapis tylko po puszczeniu na przycisku; pointercancel (np. przewijanie zaczęte na − albo +),
  // zsunięcie palca z przycisku i przerwanie bez zdarzenia to anulowanie bez zapisu
  function holdOutcome(type, inside) { return type === 'pointerup' && inside ? 'put' : 'cancel'; }
  const inBox = (el, e) => { if (!el || !el.getBoundingClientRect || !e || e.clientX == null) return false; const r = el.getBoundingClientRect(); return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom; };
  // arg: zdarzenie pointerup (zapis, gdy wskaźnik jest nad przyciskiem), false (anulowanie) albo brak (przerwanie: anulowanie)
  function holdEnd(arg) {
    if (HOLD) {
      clearTimeout(HOLD.t); const h = HOLD; HOLD = null;
      if (h.end) { const ev = arg && arg.type ? arg : null; if (holdOutcome(ev ? ev.type : 'cancel', ev ? inBox(h.box, ev) : false) === 'put') h.end(); else h.cancel(); }
    }
    if (typeof window !== 'undefined' && window.removeEventListener) { window.removeEventListener('pointerup', holdEnd); window.removeEventListener('pointercancel', holdCancel); }
  }
  function holdCancel() { holdEnd(false); }
  // opts.done(id): po zapisie od razu app.js przerysowuje ekran z fokusem na elemencie o tym id
  function mount(main, opts) {
    if (!main || typeof main.addEventListener !== 'function' || main._wp) return;
    main._wp = true;
    opts = opts || {};
    const ctx = (el) => {
      const host = el && el.closest && el.closest('[data-wps]');
      if (!host) return null;
      const scope = host.dataset.wps;
      if (host.dataset.wpk) { const R = ROWS[scope + ':' + host.dataset.wpk]; return R ? { host, scope, mode: 'immediate', rows: [R], s: state(scope, R.day || '', true) } : null; }
      const cfg = CARDS[scope];
      return cfg ? { host, scope, mode: 'commit', cfg, rows: cfg.rows, s: state(scope, cfg.day) } : null;
    };
    const rowOf = (c, key) => c.rows.find((R) => R.key === key);
    function changed(c) { if (c.mode === 'commit') { c.s.savedAt = 0; c.s.summaryOpen = false; clearTimeout(TIMER); paintCard(c.cfg); } }
    // Zapis od razu: wartość przez spec.put, potem przerysowanie z fokusem
    function put(c, R, v, focusId) {
      v = clamp(v, R.lim[0], R.lim[1]);
      R.put(v);
      if (opts.done) opts.done(focusId);
      if (R.announce && opts.say) opts.say(R.announce(v)); // ogłoszenie po przerysowaniu (spec wiersza)
    }
    function setVal(c, R, v, focusId) {
      if (c.mode === 'immediate') return put(c, R, v, focusId);
      setDraft(c.s, R, v); c.s.err[R.key] = ''; changed(c);
    }
    function bump(c, R, d, x) { setVal(c, R, step(R, rowState(R, c.s).cur, d, x), null); }
    function anchor(cfg, y0) {
      const nb = document.getElementById(cfg.scope + '_main');
      if (!nb) return;
      const d = nb.getBoundingClientRect().top - y0;
      if (Math.abs(d) > 1) window.scrollBy(0, d);
      nb.focus({ preventScroll: true });
      if (cfg.api.say) cfg.api.say(nb.textContent);
    }
    function commit(c, vals, copied) {
      const cfg = c.cfg, mb = document.getElementById(cfg.scope + '_main'), y0 = mb ? mb.getBoundingClientRect().top : 0;
      const s = markSaved(cfg.scope, cfg.day, vals);
      clearTimeout(TIMER);
      const g = graceOf(cfg);
      if (isFinite(g)) TIMER = setTimeout(() => { const cf = CARDS[cfg.scope]; if (cf) paintCard(cf); }, g + 20);
      if (cfg.api.onSaved) Object.keys(vals).forEach((k) => cfg.api.onSaved(k, vals[k]));
      s.snap.prev = cfg.api.commit(vals, { copied });
      anchor(CARDS[cfg.scope] || cfg, y0);
    }
    function undo(c) {
      const cfg = c.cfg, s = c.s, sn = s.snap;
      if (!sn || !sn.prev) return;
      const y0 = document.getElementById(cfg.scope + '_main').getBoundingClientRect().top;
      Object.keys(sn.vals).forEach((k) => { s.draft[k] = sn.vals[k]; s.base[k] = undefined; }); // base ustali następne przerysowanie (po cofnięciu)
      s.savedAt = 0; s.summaryOpen = false; s.snap = null; clearTimeout(TIMER); persist(s);
      cfg.api.restore(sn.prev);
      anchor(CARDS[cfg.scope] || cfg, y0);
    }
    function mainClick(c) {
      const cfg = c.cfg, s = c.s;
      if (actBtn({ ms: Date.now() - s.lastCommit, saved: true, grace: Infinity }).tap === 'skip') return; // drugie dotknięcie zaraz po zapisie nie cofa (WCAG 2.2.1: błąd trybu)
      const ch = changedRows(cfg, s);
      if (ch.length) { const o = commitSet(cfg, s.draft); return commit(c, o.vals, o.copied); }
      if (inGrace(cfg, s)) return undo(c);
      if (allSaved(cfg)) { s.summaryOpen = !s.summaryOpen; return paintCard(cfg); }
      const o = commitSet(cfg, s.draft);
      if (Object.keys(o.vals).length) return commit(c, o.vals, o.copied);
      // Nic do zapisania bez zgadywania: fokus na pierwszym niezapisanym wierszu
      const R = cfg.rows.find((x) => x.today == null) || cfg.rows[0], f = document.getElementById(ids(cfg.scope, R).v);
      if (cfg.api.say) cfg.api.say('Najpierw ustaw wartość: ' + R.label.toLowerCase() + '.');
      if (f) f.focus();
    }
    // Wpis z klawiatury w miejscu wartości: Enter zatwierdza i przechodzi dalej, wyjście z pola zatwierdza, Escape cofa
    function startEdit(c, R) {
      if (ED) endEdit(true);
      const I = ids(c.scope, R), b = document.getElementById(I.v), i = document.createElement('input');
      c.s.err[R.key] = ''; errShow(document.getElementById(I.e), '');
      i.id = c.scope + '_in'; i.className = 'wp-in'; i.type = 'text'; i.autocomplete = 'off';
      i.setAttribute('inputmode', R.inputmode || 'decimal'); i.setAttribute('enterkeyhint', c.mode === 'commit' ? enterHint(c.rows, R.key) : R.enterNext && nextVal(b) ? 'next' : 'done'); i.setAttribute('aria-describedby', I.e);
      i.setAttribute('aria-label', R.label + ': wpisz wartość, Enter zatwierdza, Escape anuluje');
      i.value = (R.editText || String)(rowState(R, c.s).cur);
      // W ramce .wp-f pole ma dokładnie szerokość przycisku wartości: etykieta nie przeskakuje do innej linii przy wpisie, także przy innym kroju
      // pisma (szerszy krój zostawia mniej miejsca; pole szersze od przycisku przenosiło etykietę do osobnej linii)
      // Grupa wartość + − + zachowuje zmierzoną szerokość (bez zaokrągleń szerokości pola), pole wypełnia miejsce przycisku
      const ctl = b.closest && b.closest('.wp-f') && b.closest('.wp-ctl');
      if (ctl) { ctl.style.width = ctl.getBoundingClientRect().width + 'px'; i.style.flex = '1 1 0'; i.style.minWidth = '0'; i.style.width = 'auto'; }
      b.hidden = true; b.parentNode.insertBefore(i, b.nextSibling); ED = { c, R, i, b, typed: false };
      i.addEventListener('input', () => { if (ED && ED.i === i) ED.typed = true; }); // wpisana wartość (także równa startowej) to jawny zapis
      i.focus(); i.select();
    }
    function endEdit(apply, go) {
      if (!ED) return;
      const e = ED, c = e.c, R = e.R;
      ED = null;
      if (e.i.parentNode) e.i.parentNode.removeChild(e.i);
      e.b.hidden = false;
      { const ctl = e.b.closest && e.b.closest('.wp-ctl'); if (ctl) ctl.style.width = ''; }
      if (!apply) { if (go) e.b.focus(); return; }
      const r = R.parse(e.i.value);
      if (r.err) { c.s.err[R.key] = r.err; errShow(document.getElementById(ids(c.scope, R).e), r.err); if (go) e.b.focus(); return; }
      c.s.err[R.key] = ''; errShow(document.getElementById(ids(c.scope, R).e), '');
      if (go === 'next' && c.mode === 'immediate') { const nb = nextVal(e.b); (nb || e.b).focus(); }
      else if (go === 'next') { const nx = c.rows[c.rows.indexOf(R) + 1], t = nx ? document.getElementById(ids(c.scope, nx).v) : document.getElementById(c.scope + '_main'); if (t) t.focus(); else e.b.focus(); }
      else if (go) e.b.focus();
      if (c.mode === 'immediate') {
        // Pole zamknięte bez zmiany: nic albo (ostatnia wartość kroków) kopia z komunikatem; nigdy wartość typowa
        const o = editOutcome(R, r.v, !!go, !!e.typed);
        const fid = go ? (document.activeElement && document.activeElement.id) || e.b.id : null;
        if (o.kind === 'put') return put(c, R, r.v, fid);
        if (o.kind === 'copy') { R.put(o.v, { copied: true }); if (opts.done) opts.done(fid); if (opts.say) opts.say(o.msg); }
        return;
      }
      if (Math.abs(r.v - rowState(R, c.s).cur) > 1e-9) { setDraft(c.s, R, r.v); changed(c); } else paintCard(c.cfg);
    }
    main.addEventListener('input', (e) => {
      const t = e.target, c = ctx(t);
      if (!c) return;
      e.stopPropagation();
      if (!t.dataset || !t.dataset.wpr) return;
      const R = rowOf(c, t.dataset.wpr), raw = +t.value;
      let v = raw;
      // Przeciąganie: prędkość kciuka w px/s z ruchów wskaźnika (pointermove, ostatnie ok. 150 ms); szybko siatka zgrubna, wolno każda wartość dokładna
      if (DRAG && DRAG.el === t) {
        let sp = DRAG.speed;
        // Bez ruchów wskaźnika (pointercancel w WebKit przy natywnym przeciąganiu albo brak pointermove): prędkość z czasu zdarzeń input,
        // przeliczona na px/s; pierwsze zdarzenie (np. skok po dotknięciu toru) ma prędkość 0
        if (DRAG.cancelled || !DRAG.moved) {
          const I = DRAG.ip || (DRAG.ip = []), now = e.timeStamp;
          I.push([now, raw]);
          while (I.length > 2 && now - I[0][0] > 150) I.shift(); // najstarszy punkt w oknie 150 ms (co najmniej dwa)
          const dt = (now - I[0][0]) / 1000, du = raw - I[0][1], px = (t.getBoundingClientRect().width || 1) / ((+t.max - +t.min) || 1);
          sp = I.length < 2 ? 0 : dt > 0.001 ? du / dt * px : du ? Infinity : 0;
        }
        v = snapBySpeed(raw, sp, R); LAST = { speed: sp, raw, v }; if (v !== raw) t.value = String(v);
      }
      if (c.mode === 'commit') return setVal(c, R, v);
      // Zapis od razu dopiero po puszczeniu suwaka; w trakcie tylko podgląd liczby
      const tmp = { draft: { [R.key]: v }, err: {}, open: {}, ext: {} };
      paintRow(c.host, c.scope, R, tmp, 'immediate');
    });
    main.addEventListener('change', (e) => {
      const t = e.target, c = ctx(t);
      if (!c || !t.dataset || !t.dataset.wpr || c.mode !== 'immediate') return;
      e.stopPropagation();
      if (QP && QP.el === t) QP.saved = true;
      if (DRAG && DRAG.el === t && DRAG.cancelled) DRAG = null; // koniec przeciągania po przerwanym wskaźniku
      put(c, rowOf(c, t.dataset.wpr), +t.value, t.id);
    });
    main.addEventListener('pointerdown', (e) => {
      const t = e.target;
      if (t && t.dataset && t.dataset.wpr) { QP = { el: t, saved: false, v0: +t.value }; DRAG = { el: t, pts: [[e.timeStamp, e.clientX]], speed: 0 }; return; }
      const b = t.closest && t.closest('[data-wp^="pm:"]'), c = ctx(b);
      if (!b || !c || (e.button || 0) > 0) return;
      e.preventDefault(); holdEnd();
      if (ED) endEdit(true);
      const a = b.dataset.wp.split(':'), R = rowOf(c, a[1]), d = +a[2];
      let n = 0;
      if (c.mode === 'immediate') {
        // Zapis od razu: w trakcie przytrzymania tylko podgląd liczby (bez przerysowania pod palcem), zapis raz po puszczeniu
        if (document.activeElement !== b && b.focus) b.focus({ preventScroll: true });
        const v0 = rowState(R, c.s).cur;
        let v = v0;
        const pv = (k) => { v = clamp(holdStep(R, v, d, k), R.lim[0], R.lim[1]); paintRow(c.host, c.scope, R, { draft: { [R.key]: v }, err: {}, open: {}, ext: {} }, 'immediate'); };
        pv(1);
        HOLD = { box: b, end: () => { SWALLOW = Date.now(); if (Math.abs(v - v0) > 1e-9) put(c, R, v, null); },
          cancel: () => { SWALLOW = Date.now(); paintRow(c.host, c.scope, R, c.s, 'immediate'); }, // podgląd wraca do wartości sprzed przytrzymania
          t: setTimeout(function go() { n++; pv(n); if (HOLD) HOLD.t = setTimeout(go, holdGap(n)); }, HOLD_DELAY) };
        window.addEventListener('pointerup', holdEnd); window.addEventListener('pointercancel', holdCancel);
        return;
      }
      const hb = (k) => setVal(c, R, holdStep(R, rowState(R, c.s).cur, d, k), null);
      hb(1);
      HOLD = { t: setTimeout(function go() { n++; hb(n); if (HOLD) HOLD.t = setTimeout(go, holdGap(n)); }, HOLD_DELAY) };
      window.addEventListener('pointerup', holdEnd); window.addEventListener('pointercancel', holdCancel);
    });
    // Dotknięcie suwaka bez przesunięcia: zapis tylko ostatniej wartości (jako kopia, z komunikatem); wartość typowa nigdy (tapSave)
    // Prędkość przeciągania z czasu zdarzeń wskaźnika (nie z chwili obsługi input, którą opóźnia zajęty procesor)
    main.addEventListener('pointermove', (e) => {
      if (!DRAG) return;
      const P = DRAG.pts, now = e.timeStamp;
      DRAG.moved = true;
      P.push([now, e.clientX]);
      while (P.length > 2 && now - P[0][0] > 150) P.shift();
      const dt = (now - P[0][0]) / 1000, dx = e.clientX - P[0][1];
      DRAG.speed = dt > 0.001 ? dx / dt : dx ? Infinity : 0;
    });
    // Puszczenie także poza suwakiem (nasłuch na oknie): QP i DRAG zawsze czyszczone
    const win = typeof window !== 'undefined' && window.addEventListener ? window : main;
    // pointercancel: przeciąganie suwaka może trwać dalej natywnie (WebKit), więc DRAG zostaje z prędkością z input; QP znika (bez zapisu dotknięcia)
    win.addEventListener('pointercancel', () => { if (DRAG) DRAG.cancelled = true; QP = null; });
    win.addEventListener('pointerup', () => {
      const p = QP, t = p && p.el;
      DRAG = null;
      if (!p) return;
      setTimeout(() => {
        const c = ctx(t);
        if (QP === p && !p.saved && c && c.mode === 'immediate' && t.isConnected) {
          const R = rowOf(c, t.dataset.wpr), o = tapSave(R);
          // WebKit nie wysyła change po przeciągnięciu myszą: przesunięta wartość zapisuje się po puszczeniu
          if (+t.value !== p.v0) put(c, R, +t.value, t.id);
          else if (o.save) { R.put(o.v, { copied: true }); if (opts.done) opts.done(t.id); if (opts.say) opts.say(o.msg); }
          else if (o.hint) { const h = document.getElementById(ids(c.scope, R).h); if (h) h.textContent = o.hint; t.focus(); }
        }
        QP = null;
      }, 0);
    });
    main.addEventListener('click', (e) => {
      const b = e.target.closest && e.target.closest('[data-wp]'), c = ctx(b);
      if (!b || !c) return;
      e.stopPropagation();
      const a = b.dataset.wp.split(':'), k = a[0], R = rowOf(c, a[1]);
      if (k === 'edit') startEdit(c, R);
      else if (k === 'pm') {
        // WebKit nie daje fokusu przyciskowi po kliknięciu: fokus na − albo + przed zapisem, żeby wrócił na ten sam przycisk po przerysowaniu
        if (c.mode === 'immediate' && document.activeElement !== b && b.focus) b.focus({ preventScroll: true });
        // Kliknięcie po przytrzymaniu (myszą i dotykiem zmienia pointerdown, zapis po puszczeniu) pomijane; klawiatura (detail 0) zmienia od razu
        if (e.detail !== 0 && Date.now() - SWALLOW < 1000) { SWALLOW = 0; return; }
        if (e.detail === 0) bump(c, R, +a[2], 1);
      }
      else if (k === 'main') mainClick(c);
      else if (k === 'chg') { c.s.open[R.key] = true; paintCard(c.cfg); const f = document.getElementById(ids(c.scope, R).v); if (f) f.focus(); }
      else if (k === 'x') { c.s.ext[R.key] = !c.s.ext[R.key]; paintCard(c.cfg); }
    });
    main.addEventListener('keydown', (e) => {
      // Page Up i Page Down na suwaku z siatką zgrubną: krok zgrubny (strzałki, Home i End zostają przy przeglądarce)
      const t = e.target;
      if (t && t.dataset && t.dataset.wpr && (e.key === 'PageUp' || e.key === 'PageDown')) {
        const c = ctx(t), R = c && rowOf(c, t.dataset.wpr);
        if (!R || !(R.coarse > R.step)) return;
        e.preventDefault(); e.stopPropagation();
        const w = clamp(pageStep(R, +t.value, e.key === 'PageUp' ? 1 : -1), R.range[0], R.range[1]);
        t.value = String(w);
        if (c.mode === 'commit') return setVal(c, R, w);
        return put(c, R, w, t.id);
      }
      if (!ED || e.target !== ED.i) return;
      e.stopPropagation();
      if (e.key === 'Enter') { e.preventDefault(); endEdit(true, ED.c.mode === 'commit' || (ED.R.enterNext && nextVal(ED.b)) ? 'next' : 'stay'); }
      else if (e.key === 'Escape') { e.preventDefault(); endEdit(false, 'stay'); }
    });
    main.addEventListener('focusout', (e) => { if (ED && e.target === ED.i) endEdit(true); });
  }
  // Dotknięcie suwaka bez przesunięcia w wierszu z zapisem od razu: ostatnia wartość tylko tam, gdzie spec na to pozwala (copyTap, np. kroki);
  // wartość typowa i skale nigdy (zgadywanie bez Cofnij), wtedy tylko podpowiedź
  function tapSave(R) {
    const src = R.start.src;
    if (src === 'today') return { save: false };
    if (src === 'last' && R.copyTap) return { save: true, v: R.start.v, copied: true, msg: 'Zapisano jak ostatnio: ' + R.fmt(R.start.v) };
    return { save: false, hint: 'przesuń, żeby wpisać' };
  }
  // Wynik wpisu z klawiatury w wierszu z zapisem od razu: zmiana to zapis; bez zmiany nic albo kopia ostatniej wartości (tapSave)
  // enter: wpis zamknięty klawiszem Enter; typed: coś wpisano w pole (wartość równa startowej też jest wtedy zapisem, nie kopią)
  function editOutcome(R, v, enter, typed) {
    const saved = R.today != null, cur = saved ? R.today : R.start.v;
    if (Math.abs(v - cur) > 1e-9) return { kind: 'put', v };
    if (saved) return { kind: 'none' };
    if (typed) return { kind: 'put', v };
    // Jawne potwierdzenie wartości startowej wpisem bez zmiany (R.confirmMsg): tylko ze źródeł z R.confirmSrc (domyślnie ostatnia wartość)
    if (enter && R.confirmMsg && (R.confirmSrc || ['last']).includes(R.start.src)) return { kind: 'copy', v: R.start.v, msg: R.confirmMsg(R.start.v) };
    const o = tapSave(R);
    return o.save ? { kind: 'copy', v: o.v, msg: o.msg } : { kind: 'none' };
  }
  // Następny przycisk wartości w tej samej ramce (.panel): Enter w wierszu z R.enterNext przechodzi dalej jak „Dalej” w polach
  function nextVal(b) {
    const box = b && b.closest && b.closest('.panel');
    if (!box) return null;
    const all = [...box.querySelectorAll('button.wp-val')].filter((x) => !x.hidden || x === b);
    return all[all.indexOf(b) + 1] || null;
  }
  // Zajęta karta (wpis, przytrzymanie albo fokus w karcie): app.js nie przerysowuje wtedy ekranu sam z siebie
  function busy() {
    if ((ED && ED.i.isConnected) || HOLD) return true;
    const a = typeof document !== 'undefined' && document.activeElement;
    return !!(a && a.closest && a.closest('[data-wps]'));
  }

  // Stan ostatniego zapisu karty (diagnostyka i testy niezależne od szybkości komputera): czas zapisu, wiek, okno Cofnij, osłona drugiego dotknięcia
  function commitInfo(scope) {
    const cfg = CARDS[scope]; if (!cfg) return null;
    const s = state(scope, cfg.day);
    return { lastCommit: s.lastCommit, age: s.lastCommit ? Date.now() - s.lastCommit : null, again: AGAIN, inGrace: inGrace(cfg, s) };
  }
  globalThis.WPISY = { card, rows, mount, tapSave, commitInfo, snapBySpeed, holdOutcome, lastDrag: () => LAST, holdStep, pageStep, editOutcome, busy, reset, draft, edit, markSaved, persistOn, commitSet, enterHint, step, mainLabel, actBtn, rowOrder, spark, FMT, HOLD_DELAY, holdGap };
})();
