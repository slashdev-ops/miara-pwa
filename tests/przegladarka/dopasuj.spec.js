// P1 Dopasuj danie (27.11.2026): arkusz otwierany z makr na karcie posiłku; Wstecz zamyka (Z13); suwak i kafelki nie przesuwają układu (Z12);
// cele dotyku co najmniej 44 px; przy 320 px bez przewijania w poziomie; zapis na dziś zmienia kcal na karcie.
const { test, expect } = require('@playwright/test');

async function open(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  await page.goto('about:blank');
  await page.goto('/index.html#demo-pokaz');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object' && S.onb);
  await page.evaluate(() => { S.adj = {}; S.ver = {}; S.tab = 'meals'; render(); });
  return errors;
}
const sheet = (page) => page.locator('#sheet [role="dialog"]');
const firstDop = (page) => page.locator('#main [data-dop]').first();

test('makra otwierają „Dopasuj danie”; Wstecz zamyka i oddaje fokus na makra', async ({ page }) => {
  const errors = await open(page);
  const url = page.url();
  await firstDop(page).click();
  await expect(sheet(page)).toBeVisible();
  await expect(sheet(page).locator('h2')).toHaveText('Dopasuj danie');
  await page.goBack();
  await expect(sheet(page)).toHaveCount(0);
  expect(page.url()).toBe(url);
  await expect(firstDop(page)).toBeFocused();
  expect(errors).toEqual([]);
});

test('kafelek i suwak nie przesuwają elementu pod palcem (Z12); zapis na dziś zmienia kcal na karcie', async ({ page }) => {
  const errors = await open(page);
  const card = page.locator('#main .prow').first();
  const kcal0 = await card.locator('.pk b').textContent();
  await firstDop(page).click();
  const tile = sheet(page).locator('[data-doptile="p"]');
  const b0 = await tile.boundingBox();
  await tile.click();
  const b1 = await sheet(page).locator('[data-doptile="p"]').boundingBox();
  expect(Math.abs(b1.y - b0.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(b1.height - b0.height)).toBeLessThanOrEqual(1);
  const sl = sheet(page).locator('input[data-dopsl="a"][data-m="c"]');
  await sl.focus(); // fokus może przewinąć arkusz do suwaka; mierzymy od chwili, gdy suwak jest pod palcem
  const s0 = await sl.boundingBox();
  await page.keyboard.press('ArrowLeft');
  const s1 = await sl.boundingBox();
  expect(Math.abs(s1.y - s0.y)).toBeLessThanOrEqual(1);
  await sheet(page).locator('[data-dopsave]').click();
  await expect(sheet(page)).toHaveCount(0);
  await expect(card.locator('.ptop')).toContainText('zmienione dziś');
  expect(await card.locator('.pk b').textContent()).not.toBe(kcal0);
  expect(errors).toEqual([]);
});

test('arkusz: cele dotyku co najmniej 44 px, bez przewijania w poziomie', async ({ page }) => {
  const errors = await open(page);
  await firstDop(page).click();
  await expect(sheet(page)).toBeVisible();
  await page.locator('#sheet summary').click();
  const small = await page.evaluate(() => [...document.querySelectorAll('#sheet button:not(.sheetbg), #sheet input, #sheet summary')]
    .filter((e) => e.offsetParent !== null).map((e) => { const r = e.getBoundingClientRect(); return [e.dataset.doptile || e.dataset.dopsl || e.id || e.tagName, Math.round(r.width), Math.round(r.height)]; })
    .filter(([, w, h]) => w < 44 || h < 44));
  expect(small).toEqual([]);
  const over = await page.evaluate(() => { const b = document.querySelector('#sheet .sheetbox'); return b.scrollWidth - b.clientWidth; });
  expect(over).toBeLessThanOrEqual(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});
