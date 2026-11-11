// Szybkie wpisy w przeglądarce: „Dodaj” w pasku, braki na zakładce, skróty ikony aplikacji.
// Osobny plik testów na temat (zamiast dopisywania na końcu miara.spec.js), uruchomienie: npm test (README.md).
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

test('dodaj: arkusz z paska, fokus w arkuszu, waga jednym wyborem z fokusem w polu, Escape zamyka', async ({ page }) => {
  const errors = await open(page);
  await page.evaluate(() => { S.tab = 'meals'; S.meas[todayKey()] = {}; render(); });
  await page.locator('nav.tabs [data-addsheet="1"]').click();
  const sheet = page.locator('#sheet [role="dialog"]');
  await expect(sheet).toBeVisible();
  expect(await page.evaluate(() => !!document.activeElement.closest('#sheet'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(sheet).toHaveCount(0);
  await page.locator('nav.tabs [data-addsheet="1"]').click();
  await page.locator('#sheet [data-nav="day#m_w"]').click();
  await page.waitForTimeout(900);
  const r = await page.evaluate(() => ({ tab: S.tab, id: document.activeElement.id, open: !!document.querySelector('#sheet [role="dialog"]') }));
  expect(r).toEqual({ tab: 'day', id: 'm_w', open: false });
  expect(errors).toEqual([]);
});

test('pasek: 6 pozycji mieści się bez ucinania podpisów, cele dotyku co najmniej 44 px, liczba braków widoczna', async ({ page }) => {
  await open(page);
  await page.evaluate(() => { S.tab = 'set'; S.meas[todayKey()] = {}; S.days[todayKey()] = []; S.pain = {}; render(); });
  const r = await page.evaluate(() => [...document.querySelectorAll('nav.tabs button')].map((b) => {
    const q = b.getBoundingClientRect(), l = [...b.querySelectorAll('span.l,span.s')].find((x) => getComputedStyle(x).display !== 'none');
    return { w: q.width, h: q.height, cut: l ? l.scrollWidth > b.clientWidth + 1 : false, txt: b.textContent.trim() };
  }));
  expect(r.length).toBe(6);
  for (const b of r) { expect(b.w, b.txt).toBeGreaterThanOrEqual(44); expect(b.h, b.txt).toBeGreaterThanOrEqual(44); expect(b.cut, b.txt).toBe(false); }
  await expect(page.locator('nav.tabs [data-tab="day"] .badge')).toHaveText('3');
});

// Skrót z ikony przy otwartej aplikacji zmienia adres (#dodaj-…); nowa osoba bez wprowadzenia zostaje na wprowadzeniu
test('skrót ikony: #dodaj-waga otwiera Mój dzień z fokusem w polu wagi, #dodaj-trening Trening, adres wraca bez #', async ({ page }) => {
  await open(page);
  await page.evaluate(() => { S.tab = 'set'; render(); location.hash = '#dodaj-waga'; });
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => ({ tab: S.tab, id: document.activeElement.id, hash: location.hash }))).toEqual({ tab: 'day', id: 'm_w', hash: '' });
  await page.evaluate(() => { location.hash = '#dodaj-trening'; });
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => S.tab)).toBe('train');
});
