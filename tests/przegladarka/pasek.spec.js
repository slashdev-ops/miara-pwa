// P2 Pasek nad menu (krok 9c, 27.11.2026): leży tuż nad zakładkami i ich nie zasłania; kcal i makra jako cele dotyku co najmniej 44 px;
// przełączenie K1/K2 nie przesuwa komórki pod palcem (Z12); przy 320 px bez przewijania w poziomie; arkusz „Dziś” zamyka Wstecz (Z13).
const { test, expect } = require('@playwright/test');

async function open(page, tab) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  await page.goto('about:blank');
  await page.goto('/index.html#demo-pokaz');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object' && S.onb);
  await page.evaluate((t) => { S.tab = t; S.lite = false; render(); }, tab || 'day');
  return errors;
}

test('pasek nad zakładkami, bez nachodzenia; cele dotyku 44 px; bez przewijania w poziomie', async ({ page }) => {
  const errors = await open(page, 'meals');
  const bar = page.locator('#dbar .dbm');
  await expect(bar).toBeVisible();
  const b = await bar.boundingBox(), n = await page.locator('nav.tabs').boundingBox();
  expect(Math.abs(b.y + b.height - n.y)).toBeLessThanOrEqual(1);
  for (const sel of ['#dbar [data-k2]', '#dbar .mcells']) { const r = await page.locator(sel).boundingBox(); expect(r.height).toBeGreaterThanOrEqual(44); expect(r.width).toBeGreaterThanOrEqual(44); }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  expect(await page.evaluate(() => { const d = document.querySelector('#dbar .dbm'); return d.scrollWidth - d.clientWidth; })).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});

test('kcal: przełączenie na zjedzone z celu nie przesuwa komórki (Z12); w Treningu paska nie ma', async ({ page }) => {
  const errors = await open(page, 'day');
  const k = page.locator('#dbar [data-k2]');
  const a = await k.boundingBox();
  await k.click();
  await expect(page.locator('#dbar [data-k2]')).toHaveAttribute('aria-pressed', 'true');
  const c = await page.locator('#dbar [data-k2]').boundingBox();
  expect(Math.abs(c.x - a.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(c.y - a.y)).toBeLessThanOrEqual(1);
  await page.evaluate(() => { S.tab = 'train'; render(); });
  await expect(page.locator('#dbar .dbm')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('makra otwierają „Dziś”; Wstecz zamyka i oddaje fokus', async ({ page }) => {
  const errors = await open(page, 'day');
  const url = page.url();
  await page.locator('#dbar .mcells').click();
  await expect(page.locator('#sheet [role="dialog"] h2')).toHaveText('Dziś');
  await page.goBack();
  await expect(page.locator('#sheet [role="dialog"]')).toHaveCount(0);
  expect(page.url()).toBe(url);
  await expect(page.locator('#dbar [data-today]').first()).toBeFocused();
  expect(errors).toEqual([]);
});

test('plakietki NOWE nie nachodzą na wartości w pasku', async ({ page }) => {
  const errors = await open(page, 'meals');
  await page.evaluate(() => { S.seenNew = {}; render(); });
  const hit = await page.evaluate(() => [...document.querySelectorAll('#dbar .dbnew')].map((n) => { const r = n.getBoundingClientRect(), t = n.parentElement.querySelector('.tx').getBoundingClientRect(); return r.bottom > t.top + 1 && r.left < t.right && r.right > t.left; }));
  expect(hit).toEqual([false, false]);
  expect(errors).toEqual([]);
});
