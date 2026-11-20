// Symulacja uzupełniania każdego pola (20.11.2026): każdy ekran, każde pole i wybór, jak osoba na telefonie.
// Tryb raportu: zbiera problemy do plików JSON i zrzutów w katalogu SYM_OUT, nie blokuje; arkusz „Dodaj” ma tylko przyciski przejścia (bez pól). Uruchomienie: SYM_OUT=<katalog> npx playwright test symulacja-pol.spec.js
const { test } = require('@playwright/test');
test.skip(!process.env.SYM_OUT, 'tylko na żądanie: SYM_OUT=<katalog raportu>'); // narzędzie przeglądu, nie test CI
const fs = require('fs'), path = require('path');

const SCREENS = [
  ['day', {}], ['day-prosty', { lite: true, tab: 'day' }], ['day-wpis', { once: true, tab: 'day' }],
  ['meals', {}], ['train', {}], ['health', {}], ['set', {}], ['labs', {}], ['visit', {}], ['sos', {}], ['review', {}], ['krok', {}],
  ['knee', {}], ['mob', {}], ['impact', {}], ['challenge', {}], ['pet', {}], ['help', {}],
];
const CTRL = '#main input:not([type=hidden]), #main select, #main textarea, #main [role=slider], #main .seg button, #main .chip, #sheet input:not([type=hidden]), #sheet select, #sheet textarea, #sheet .seg button, #sheet .chip';

async function open(page, name, o) {
  await page.goto('/index.html#demo-wpisy');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  await page.evaluate(([t, o]) => { SHEET = !!o.sheet; S.lite = !!o.lite; S.once = !!o.once; S.guide = { hidden: true, dataOk: true, seenPet: true }; S.tab = o.tab || t; render(); }, [name, o]);
  await page.evaluate(() => document.fonts.ready);
  await openFolds(page);
}
const openFolds = (page) => page.evaluate(() => document.querySelectorAll('#main details:not([open]), #sheet details:not([open])').forEach((d) => { d.open = true; }));

// Opis i kontrola jednego pola w przeglądarce (sig: podpis do ponownego odszukania po przerysowaniu)
function inspect(sel) {
  const lum = (c) => { const m = (c.match(/[\d.]+/g) || [0, 0, 0]).slice(0, 3).map(Number).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const bgOf = (e) => { for (let n = e; n; n = n.parentElement) { const b = getComputedStyle(n).backgroundColor; if (b && !/rgba\(.*, 0\)$/.test(b) && b !== 'transparent') return b; } return getComputedStyle(document.body).backgroundColor; };
  const sig = (e) => [e.tagName, e.type || '', e.id || '', e.name || '', ...[...e.attributes].filter((a) => a.name.startsWith('data-') && !/^data-(l|v)$/.test(a.name)).map((a) => a.name + '=' + a.value)].join('|');
  const nameOf = (e) => {
    if (e.getAttribute('aria-label')) return e.getAttribute('aria-label');
    const lb = e.getAttribute('aria-labelledby'); if (lb) return lb.split(' ').map((i) => (document.getElementById(i) || {}).textContent || '').join(' ').trim();
    if (e.labels && e.labels.length) return [...e.labels].map((l) => l.textContent.trim()).join(' ');
    if (/BUTTON/.test(e.tagName)) return e.textContent.trim();
    return e.title || '';
  };
  const vw = document.documentElement.clientWidth, seen = {};
  return [...document.querySelectorAll(sel)].map((e) => {
    const s = sig(e); seen[s] = (seen[s] || 0) + 1;
    const r = e.getBoundingClientRect(), cs = getComputedStyle(e), vis = r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && !e.closest('[hidden]');
    if (!vis) return null;
    const isTxt = /INPUT|SELECT|TEXTAREA/.test(e.tagName) && !/checkbox|radio|range/.test(e.type);
    const o = { sig: s, nth: seen[s] - 1, tag: e.tagName.toLowerCase(), type: e.type || '', name: nameOf(e).slice(0, 80), ph: e.placeholder || '', issues: [] };
    if (!o.name) o.issues.push(o.ph ? 'brak etykiety (tylko placeholder „' + o.ph + '”)' : 'brak etykiety dla czytnika');
    if (r.right > vw + 0.5 || r.left < -0.5) o.issues.push('poza ekranem: ' + Math.round(r.left) + '–' + Math.round(r.right) + ' przy szerokości ' + vw);
    const tr = (/checkbox|radio/.test(e.type) && e.closest('label')) ? e.closest('label').getBoundingClientRect() : r; // pole w etykiecie: dotyka się całej etykiety
    if (tr.height < 43.5) o.issues.push('wysokość celu dotyku ' + Math.round(tr.height) + ' px < 44');
    if (tr.width < 43.5) o.issues.push('szerokość celu dotyku ' + Math.round(tr.width) + ' px < 44');
    if (isTxt && parseFloat(cs.fontSize) < 16) o.issues.push('czcionka ' + cs.fontSize + ' < 16 px (iPhone powiększa stronę przy wpisie)');
    if (e.type !== 'range' && e.type !== 'checkbox' && e.type !== 'radio') { const k = ratio(cs.color, bgOf(e)); if (k < 4.5) o.issues.push('kontrast ' + k.toFixed(2) + ':1 (' + cs.color + ' na ' + bgOf(e) + ')'); }
    o.box = [Math.round(r.left), Math.round(r.top + scrollY), Math.round(r.width), Math.round(r.height)];
    return o;
  }).filter(Boolean);
}

function valueFor(c) {
  if (c.type === 'number') { const mn = c.min !== '' ? +c.min : 0, mx = c.max !== '' ? +c.max : mn + 100, st = c.step && c.step !== 'any' ? +c.step : 1; let v = mn + (mx - mn) / 3; v = Math.round(v / st) * st; return String(+v.toFixed(3)); }
  if (c.type === 'date') return '2026-11-19';
  if (c.type === 'time') return '07:30';
  if (c.type === 'email') return 'osoba@example.com';
  if (c.inputmode === 'decimal' || c.inputmode === 'numeric') return '12';
  return 'test';
}

for (const [name, o] of SCREENS) {
  test('symulacja pól: ' + name, async ({ page }, info) => {
    test.setTimeout(240000);
    const errors = [];
    page.on('pageerror', (e) => errors.push('strona: ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push('konsola: ' + m.text()); });
    page.on('dialog', (d) => d.dismiss().catch(() => null));
    await open(page, name, o);
    const fields = await page.evaluate(inspect, CTRL);
    const results = [];
    for (const f of fields) {
      const before = errors.length, sBefore = await page.evaluate(() => JSON.stringify(S));
      const r = { ...f, act: '', after: [] };
      try {
        const h = await page.evaluateHandle(([sig, nth, sel]) => { const L = [...document.querySelectorAll(sel)].filter((e) => [e.tagName, e.type || '', e.id || '', e.name || '', ...[...e.attributes].filter((a) => a.name.startsWith('data-') && !/^data-(l|v)$/.test(a.name)).map((a) => a.name + '=' + a.value)].join('|') === sig); return L[nth] || null; }, [f.sig, f.nth, CTRL]);
        const el = h.asElement();
        if (!el) { r.act = 'zniknęło po wcześniejszym wpisie'; results.push(r); continue; }
        const meta = await el.evaluate((e) => ({ type: e.type || '', tag: e.tagName, min: e.min || '', max: e.max || '', step: e.step || '', inputmode: e.inputMode || '', ro: e.readOnly || e.disabled, opts: e.options ? e.options.length : 0, role: e.getAttribute('role') }));
        if (meta.ro) { r.act = 'tylko do odczytu / wyłączone'; results.push(r); continue; }
        await el.scrollIntoViewIfNeeded();
        if (meta.tag === 'SELECT') { if (meta.opts > 1) { await el.selectOption({ index: meta.opts - 1 }); r.act = 'wybór ostatniej opcji'; } else r.act = 'select bez opcji'; }
        else if (meta.type === 'checkbox' || meta.type === 'radio') { await el.click(); r.act = 'zaznaczenie'; }
        else if (meta.type === 'range' || meta.role === 'slider') { await el.focus(); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); r.act = 'suwak: 2× strzałka w prawo'; }
        else if (meta.tag === 'BUTTON') { await el.click(); r.act = 'dotknięcie kafelka'; }
        else if (meta.type === 'file') { r.act = 'pominięte (plik)'; results.push(r); continue; }
        else { const v = valueFor(meta); await el.click(); await el.fill(v); await page.keyboard.press('Tab'); r.act = 'wpis „' + v + '” + Tab'; }
        await page.waitForTimeout(120);
        const st = await page.evaluate((v) => ({ changed: JSON.stringify(S) !== v, tab: S.tab, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, inv: [...document.querySelectorAll('[aria-invalid=true]')].map((e) => e.getAttribute('aria-label') || e.id).slice(0, 3), err: [...document.querySelectorAll('#main .err:not([hidden]), #main [role=alert]')].map((e) => e.textContent.trim().slice(0, 100)).slice(0, 2) }), sBefore);
        r.saved = st.changed;
        if (errors.length > before) r.after.push(...errors.slice(before));
        if (st.sw > st.cw) r.after.push('poziome przewijanie: ' + st.sw + ' > ' + st.cw);
        if (st.inv.length) r.after.push('pole oznaczone jako błędne: ' + st.inv.join(', '));
        if (st.err.length) r.after.push('komunikat: ' + st.err.join(' | '));
        const want = o.tab || name;
        if (st.tab !== want || await page.evaluate(() => !!document.querySelector('#sheet[hidden]')) && o.sheet) { r.after.push('zmiana ekranu na ' + st.tab); await open(page, name, o); }
        else await openFolds(page);
      } catch (e) { r.after.push('wyjątek: ' + String(e.message).split('\n')[0].slice(0, 160)); await open(page, name, o).catch(() => null); }
      results.push(r);
    }
    const dir = process.env.SYM_OUT || info.outputDir; fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${info.project.name}__${name}.json`), JSON.stringify({ screen: name, project: info.project.name, n: results.length, errors, results }, null, 1));
    await page.screenshot({ path: path.join(dir, `${info.project.name}__${name}.png`), fullPage: true }).catch(() => null);
  });
}
