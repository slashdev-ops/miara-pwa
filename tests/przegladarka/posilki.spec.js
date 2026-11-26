// Posiłki w przeglądarce: makro i błonnik w planie dnia bez otwierania przepisu (13.11.2026).
// Osobny plik testów na temat, uruchomienie: npm test (README.md).
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

// Karta posiłku według „Wersji zwartej” (krok 9b, 26.11.2026): makra W6 w jednej linii, Zmień i Zjem w jednym wierszu, cele co najmniej 44 px
test('plan dnia: makra W6 w jednej linii, Zmień i Zjem obok siebie i nieucięte, co najmniej 44 px, Zjem ze skutkiem', async ({ page }) => {
  const errors = await open(page);
  await page.evaluate(() => { S.days[todayKey()] = []; S.tab = 'meals'; render(); });
  const rows = await page.evaluate(() => [...document.querySelectorAll('.prow')].map((r) => {
    const z = r.querySelector('[data-addmeal]'), c = r.querySelector('[data-swap]'), cs = [...r.querySelectorAll('.mml .mc')], t0 = cs[0].getBoundingClientRect().top;
    const zr = z.getBoundingClientRect(), cr = c.getBoundingClientRect();
    return { n: cs.length, oneLine: cs.every((x) => Math.abs(x.getBoundingClientRect().top - t0) < 2), inRow: cs.every((x) => x.getBoundingClientRect().right <= r.getBoundingClientRect().right + 1),
      zFit: z.scrollWidth <= z.clientWidth + 1, lFit: (() => { const l = z.querySelector('.act-l'); return l.scrollWidth <= l.clientWidth; })(), cFit: c.scrollWidth <= c.clientWidth + 1, zH: zr.height, cH: cr.height, sameRow: Math.abs(zr.top - cr.top) < 2, zRight: zr.left > cr.left, zWider: zr.width > cr.width,
      sub: (z.querySelector('.act-s') || {}).textContent || '' };
  }));
  expect(rows.length).toBeGreaterThan(2);
  for (const r of rows) {
    expect(r.n).toBe(4);
    expect(r.oneLine).toBe(true);
    expect(r.inRow).toBe(true);
    expect(r.zFit).toBe(true);
    expect(r.lFit).toBe(true);
    expect(r.cFit).toBe(true);
    expect(r.zH).toBeGreaterThanOrEqual(44);
    expect(r.cH).toBeGreaterThanOrEqual(44);
    expect(r.sameRow).toBe(true);
    expect(r.zRight).toBe(true);
    expect(r.zWider).toBe(true);
    expect(r.sub).toMatch(/^zostanie \d[\d\s\u00a0]* kcal$/);
  }
  // po zapisie napis „✓ Zjedzone · Cofnij” mieści się w tym samym przycisku (bez ucięcia)
  await page.locator('.prow [data-addmeal]').first().click();
  const after = await page.evaluate(() => { const l = document.querySelector('.prow [data-addmeal] .act-l'); return { t: l.textContent, fit: l.scrollWidth <= l.clientWidth }; });
  expect(after.t).toContain('Cofnij');
  expect(after.fit).toBe(true);
  const over = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(over).toBe(false);
  expect(errors).toEqual([]);
});

test('Posiłki: lista przepisów przed listą zakupów i zamówionym jedzeniem', async ({ page }) => {
  await open(page);
  await page.evaluate(() => { S.tab = 'meals'; render(); });
  const y = await page.evaluate(() => ['mlist', 'zakupy', 'zamowione'].map((id) => document.getElementById(id).getBoundingClientRect().top));
  expect(y[0]).toBeLessThan(y[1]);
  expect(y[1]).toBeLessThan(y[2]);
});

test('karta przepisu: czas i znaczniki w jednym wierszu, bez osobnego wiersza znaczników', async ({ page }) => {
  await open(page);
  await page.evaluate(() => { S.tab = 'meals'; S.f.type = 'obiad'; render(); });
  const r = await page.evaluate(() => [...document.querySelectorAll('#mlist article.meal')].slice(0, 6).map((a) => {
    const m = a.querySelector('.meta'), t = m.querySelector('.mtag');
    return { tag: !!t, sameLine: !t || Math.abs(t.getBoundingClientRect().top - m.getBoundingClientRect().top) < 20 };
  }));
  expect(r.some((x) => x.tag)).toBe(true);
  for (const x of r) expect(x.sameLine).toBe(true);
  expect(await page.locator('#mlist .mtags').count()).toBe(0);
});
