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

test('plan dnia: makro z błonnikiem widoczne, „Zjem” nieucięty i co najmniej 44 px, wartości bez łamania w środku', async ({ page }) => {
  const errors = await open(page);
  await page.evaluate(() => { S.days[todayKey()] = []; S.tab = 'meals'; render(); });
  const rows = await page.evaluate(() => [...document.querySelectorAll('.prow')].map((r) => {
    const b = r.querySelector('[data-addmeal]'), m = r.querySelector('.pmac [aria-hidden="true"]');
    return { btnW: b.scrollWidth <= b.clientWidth + 1, btnH: b.getBoundingClientRect().height, txt: m.textContent,
      inRow: m.getBoundingClientRect().right <= r.getBoundingClientRect().right + 1 };
  }));
  expect(rows.length).toBeGreaterThan(2);
  for (const r of rows) {
    expect(r.btnW).toBe(true);
    expect(r.btnH).toBeGreaterThanOrEqual(44);
    expect(r.inRow).toBe(true);
    expect(r.txt).toMatch(/kcal \| B\u00a0\d+\u00a0g \| T\u00a0\d+\u00a0g \| W\u00a0\d+\u00a0g \| Bł\u00a0\d+\+?\u00a0g/);
  }
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
