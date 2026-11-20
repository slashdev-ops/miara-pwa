// Ramki w przeglądarce (15.11.2026): przyciski nie dotykają krawędzi ramki; stan „Zjem” w przyciski.spec.js.
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..', '..');
const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const CSP = vercel.headers.flatMap((h) => h.headers).find((h) => h.key === 'Content-Security-Policy').value
  .split(';').map((d) => d.trim()).filter((d) => d && d !== 'upgrade-insecure-requests').join('; ');

async function open(page, hash = '#demo-pokaz') {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('konsola: ' + m.text()); });
  await page.route('**/*', async (route) => { const res = await route.fetch(); await route.fulfill({ response: res, headers: { ...res.headers(), 'content-security-policy': CSP } }); });
  await page.goto('/index.html' + hash);
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  return errors;
}

// Przyciski .btn w ramce (.panel, details.fold, .note: ramka z tłem, np. pasek trybu pokazowego) co najmniej 12 px od lewej i prawej krawędzi najbliższej ramki.
// Pomijane: przyciski w poziomo przewijanych rzędach (chipy), niewidoczne. Arkusz (.sheetbox) też jest ramką.
// Wynik: naruszenia, liczba sprawdzonych przycisków poza paskiem trybu pokazowego (nM) i liczba widocznych przycisków (.btn, .opt) w arkuszu (nSheet).
const tightBtns = (page) => page.evaluate(() => {
  document.querySelectorAll('details').forEach((d) => { d.open = true; });
  const scrollRow = (el) => { for (let p = el.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if ((o === 'auto' || o === 'scroll') && p.scrollWidth > p.clientWidth) return true; } return false; };
  const out = [];
  let nM = 0;
  const vis = (x) => { const q = x.getBoundingClientRect(); return q.width > 0 && q.height > 0 && getComputedStyle(x).visibility !== 'hidden'; };
  const nSheet = [...document.querySelectorAll('#sheet .btn, #sheet .opt')].filter(vis).length;
  const framedPlain = [...document.querySelectorAll('#main .panel .btn, #main details.fold .btn, #main .note:not(.demo) .btn')].filter(vis).length;
  document.querySelectorAll('button.btn, a.btn').forEach((b) => {
    const f = b.closest('.panel, details.fold, .note, .sheetbox'); if (!f) return;
    const r = b.getBoundingClientRect(); if (!r.width || !r.height || getComputedStyle(b).visibility === 'hidden') return;
    if (scrollRow(b)) return;
    if (!b.closest('.note.demo')) nM++;
    const fr = f.getBoundingClientRect(), l = r.left - fr.left, rr = fr.right - r.right;
    if (l < 12 || rr < 12) out.push(`${(b.textContent || '').trim().slice(0, 40)} (${Math.round(l)}/${Math.round(rr)} px)`);
  });
  return { out, nM, nSheet, framedPlain };
});

for (const tab of ['day', 'meals', 'train', 'health', 'set', 'add', 'pet']) {
  test(`ramki: przyciski w ramkach z odstępem od krawędzi (${tab})`, async ({ page }) => {
    const errors = await open(page);
    await page.evaluate((t) => { S.prof.cond.gut = true; S.tab = t === 'add' ? 'day' : t; SHEET = false; render(); }, tab);
    // Arkusz „Dodaj wpis” otwierany jak przez osobę: przycisk w pasku
    if (tab === 'add') { await page.locator('nav.tabs [data-addsheet="1"]').click(); await expect(page.locator('#sheet [role="dialog"]')).toBeVisible(); }
    const r = await tightBtns(page);
    if (tab === 'add') expect(r.nSheet, 'przyciski sprawdzone w arkuszu Dodaj wpis').toBeGreaterThan(0);
    // Zwierzak: ekran bez przycisków w ramkach (stan, kamienie, punkty i odznaki to tekst; „Wróć” i „Przejdź do Mojego dnia” stoją poza ramką),
    // jedyny przycisk w ramce to „Wyjdź” paska trybu pokazowego, sprawdzany regułą 12 px, ale nie liczony; test pilnuje, że to się nie zmieniło bez sprawdzenia
    else if (tab === 'pet') expect(r.framedPlain, 'zakładka Zwierzak nie ma przycisków w ramkach').toBe(0);
    else expect(r.nM, 'liczba sprawdzonych przycisków poza paskiem trybu pokazowego').toBeGreaterThan(0);
    expect(r.out).toEqual([]);
    expect(errors).toEqual([]);
  });
}

// „Zjem” ze stanem: przyciski.spec.js (20.11.2026, wspólny automat z kartą „Dziś”: „✓ Zjedzone · Cofnij”, potem „Zjem jeszcze raz”)

// 320 px (rada P2, 15.11.2026): etykieta kalorii z zegarka najwyżej w 2 wierszach, jednostka „kcal” co najmniej 8 px od krawędzi ramki.
// Zadanie 5 (20.11.2026): kalorie to wiersz wartości; jednostka jest w wartości, więc od ramki liczy się − + (ostatni element wiersza)
test('320 px: Trening, kalorie z zegarka: etykieta najwyżej 2 wiersze, jednostka 8 px od ramki', async ({ page }) => {
  test.skip((page.viewportSize() || {}).width > 359, 'tylko najwęższy ekran');
  const errors = await open(page);
  await page.evaluate(() => { S.tab = 'train'; SHEET = false; render(); });
  const r = await page.evaluate(() => {
    const el = document.getElementById('f_tr.wk'), f = el.closest('.wp-r'), lab = f.querySelector('.wp-lab'), unit = f.querySelector('.wp-pm'), fr = f.closest('.panel').getBoundingClientRect();
    const lh = parseFloat(getComputedStyle(lab).lineHeight) || parseFloat(getComputedStyle(lab).fontSize) * 1.2;
    return { lines: Math.round(lab.getBoundingClientRect().height / lh), unitGap: fr.right - unit.getBoundingClientRect().right, txt: lab.textContent };
  });
  expect(r.lines, `wiersze etykiety „${r.txt}”`).toBeLessThanOrEqual(2);
  expect(r.unitGap, 'odstęp jednostki od prawej krawędzi ramki').toBeGreaterThanOrEqual(8);
  expect(errors).toEqual([]);
});
