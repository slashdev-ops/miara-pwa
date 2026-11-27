// P4a Warianty dań (27.11.2026, makieta „Dania z wariantami” v6): wybór wariantu nie przesuwa karty ani przycisku pod palcem i nie zmienia wysokości karty (Z12);
// przyciski wariantów co najmniej 44 px; przy 320 px bez przewijania w poziomie; fokus zostaje na wybranym przycisku.
const { test, expect } = require('@playwright/test');

async function open(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  await page.goto('about:blank');
  await page.goto('/index.html#demo-pokaz');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object' && S.onb);
  await page.evaluate(() => { S.tab = 'meals'; S.lite = false; S.vsel = {}; S.f.type = 'sniadanie'; S.f.noeq = []; render(); });
  return errors;
}

test('wybór wariantu: karta i przycisk w miejscu, ta sama wysokość karty (Z12), 44 px, bez przewijania w poziomie', async ({ page }) => {
  const errors = await open(page);
  const grp = page.locator('.vsel[aria-label="Wariant: Pudding chia"]');
  await grp.scrollIntoViewIfNeeded();
  const card = page.locator('article.meal', { has: grp });
  const btns = grp.locator('button');
  const n = await btns.count();
  expect(n).toBeGreaterThanOrEqual(3);
  for (let i = 0; i < n; i++) { const r = await btns.nth(i).boundingBox(); expect(r.height).toBeGreaterThanOrEqual(44); }
  const target = btns.nth(n - 1), id = await target.getAttribute('data-vsel');
  const a = await target.boundingBox(), c0 = await card.boundingBox();
  await target.click();
  const sel = page.locator(`[data-vsel="${id}"]`);
  await expect(sel).toHaveAttribute('aria-pressed', 'true');
  await expect(sel).toBeFocused();
  const b = await sel.boundingBox(), c1 = await page.locator('article.meal', { has: page.locator('.vsel[aria-label="Wariant: Pudding chia"]') }).boundingBox();
  expect(Math.abs(b.y - a.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(b.x - a.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(c1.y - c0.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(c1.height - c0.height)).toBeLessThanOrEqual(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});
