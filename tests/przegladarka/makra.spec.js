// Makra W6 z paletą A′ (krok 9a planu ekranów, 26.11.2026): jedna linia od 320 px dla największych wartości z bazy dań,
// tekst co najmniej 7:1 na tle makra w obu motywach, bez przewijania w poziomie. Uruchomienie: npm test (README.md).
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

// Najgorszy przypadek z bazy: największe wartości każdego makra osobno, największa porcja (×1,5) i mnożnik węglowodanów po treningu (×1,5), znak „+” przy błonniku
const WORST = () => { const xs = MEALS.map((m) => macros(m, 1.5, 1.5)), mx = (k) => Math.max(...xs.map((x) => x[k]));
  return { k: mx('k'), p: mx('p'), f: mx('f'), c: mx('c'), fib: mx('fib'), fibNA: true }; };

// Wiersz W6 w jednej linii: wszystkie etykiety na tej samej wysokości i w granicach rodzica
const oneLine = (el) => { const cs = [...el.querySelectorAll('.mc')], t0 = cs[0].getBoundingClientRect().top, box = el.closest('.meal,.panel').getBoundingClientRect();
  return { n: cs.length, same: cs.every((c) => Math.abs(c.getBoundingClientRect().top - t0) < 2), inside: cs.every((c) => c.getBoundingClientRect().right <= box.right + 1) }; };

for (const where of ['lista', 'przepis']) {
  test(`${where}: makra W6 w jednej linii przy 320 px dla największych wartości z bazy`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    const errors = await open(page);
    const r = await page.evaluate(({ where, worst, line }) => {
      const W = new Function('return ' + worst)(), L = new Function('return ' + line)();
      if (where === 'lista') { S.f.type = 'all'; S.tab = 'meals'; } else { S.recipe = MEALS[0].id; S.tab = 'recipe'; }
      render();
      const el = document.querySelector('.mml');
      el.outerHTML = macChips(W());
      return { ...L(document.querySelector('.mml')), hs: document.documentElement.scrollWidth > document.documentElement.clientWidth };
    }, { where, worst: WORST.toString(), line: oneLine.toString() });
    expect(r.n).toBe(4);
    expect(r.same).toBe(true);
    expect(r.inside).toBe(true);
    expect(r.hs).toBe(false);
    expect(errors).toEqual([]);
  });
}

test('makra W6: tekst co najmniej 7:1 na tle każdego makra (motyw z projektu)', async ({ page }) => {
  const errors = await open(page);
  const ratios = await page.evaluate(() => {
    S.f.type = 'all'; S.tab = 'meals'; render();
    const cv = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    // Kolor przeliczony przez przeglądarkę (także color-mix) na sRGB przez narysowanie piksela
    const rgb = (c) => { cv.clearRect(0, 0, 1, 1); cv.fillStyle = '#000'; cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); return [...cv.getImageData(0, 0, 1, 1).data].slice(0, 3); };
    const lum = (c) => { const v = rgb(c).map((u) => { u /= 255; return u <= 0.03928 ? u / 12.92 : ((u + 0.055) / 1.055) ** 2.4; }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
    const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    return [...document.querySelectorAll('#mlist .mml')].slice(0, 3).flatMap((l) => [...l.querySelectorAll('.mc')].map((c) => { const s = getComputedStyle(c); return cr(s.color, s.backgroundColor); }));
  });
  expect(ratios.length).toBe(12);
  for (const x of ratios) expect(x).toBeGreaterThanOrEqual(7);
  expect(errors).toEqual([]);
});
