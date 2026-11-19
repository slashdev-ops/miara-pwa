// Prosty start (19.11.2026): karta „Dziś, 3 dotknięcia” w scenariuszu #demo-prosty przy 320 px.
const { test, expect } = require('@playwright/test');

async function open(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/index.html#demo-prosty');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object' && S.lite === true);
  await page.evaluate(() => { SHEET = false; render(); });
  return errors;
}

test('prosty: karta bez poziomego przewijania, żetony co najmniej 44 px, tekst w jednej linii', async ({ page }) => {
  const errors = await open(page);
  const card = page.locator('#lite');
  await expect(card).toBeVisible();
  const o = await page.evaluate(() => {
    const chips = [...document.querySelectorAll('#lite .chip')].map((c) => {
      const r = c.getBoundingClientRect(), range = document.createRange(); range.selectNodeContents(c);
      const lines = new Set([...range.getClientRects()].map((x) => Math.round(x.top))).size;
      return { t: c.textContent, h: r.height, lines };
    });
    return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, r: document.querySelector('#lite').getBoundingClientRect().right, chips };
  });
  expect(o.cw).toBe(320);
  expect(o.sw).toBeLessThanOrEqual(o.cw);
  expect(o.r).toBeLessThanOrEqual(o.cw);
  expect(o.chips.length).toBe(10);
  for (const c of o.chips) { expect(c.h, c.t).toBeGreaterThanOrEqual(44); expect(c.lines, c.t).toBe(1); }
  expect(errors).toEqual([]);
});

test('prosty: propozycja Dodać wagę? widoczna', async ({ page }) => {
  const errors = await open(page);
  await expect(page.locator('#main')).toContainText('Dodać wagę?');
  expect(errors).toEqual([]);
});

test('prosty: 3 dotknięcia dają Dzień zapisany i aria-pressed', async ({ page }) => {
  const errors = await open(page);
  for (const f of ['stepsB:mid', 'feel:dobrze', 'redz:0']) await page.locator(`[data-lite="${f}"]`).click();
  await expect(page.locator('#lite')).toContainText('✓ Dzień zapisany.');
  for (const f of ['stepsB:mid', 'feel:dobrze', 'redz:0']) await expect(page.locator(`[data-lite="${f}"]`)).toHaveAttribute('aria-pressed', 'true');
  expect(errors).toEqual([]);
});
