// P3 Dania z planów F1 (27.11.2026, makieta „Dania z wariantami” v6): filtr „Mam tylko” i szybkie dania z nazwą zależną od pory.
// Cele dotyku co najmniej 44 px; przełączenie filtra nie przesuwa przycisku pod palcem (Z12); przy 320 px bez przewijania strony w poziomie
// (pas szybkich dań przewija się sam); karta szybkiego dania otwiera przepis; NOWE nie zasłania nazwy sekcji.
const { test, expect } = require('@playwright/test');

async function open(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  await page.goto('about:blank');
  await page.goto('/index.html#demo-pokaz');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object' && S.onb);
  await page.evaluate(() => { S.tab = 'meals'; S.lite = false; S.seenNew = {}; S.f.noeq = []; render(); });
  return errors;
}

test('Mam tylko: 4 przyciski po 44 px, przełączenie nie przesuwa przycisku (Z12), bez przewijania w poziomie', async ({ page }) => {
  const errors = await open(page);
  const btn = page.locator('[data-eqf="piekarnik"]');
  await btn.scrollIntoViewIfNeeded();
  for (const k of ['plyta', 'piekarnik', 'mikro', 'zimne']) { const r = await page.locator(`[data-eqf="${k}"]`).boundingBox(); expect(r.height).toBeGreaterThanOrEqual(44); expect(r.width).toBeGreaterThanOrEqual(44); }
  const a = await btn.boundingBox();
  await btn.click();
  await expect(page.locator('[data-eqf="piekarnik"]')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('[data-eqf="piekarnik"]')).toBeFocused();
  const b = await page.locator('[data-eqf="piekarnik"]').boundingBox();
  expect(Math.abs(b.y - a.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(b.x - a.x)).toBeLessThanOrEqual(1);
  await expect(page.locator('.eqn')).toContainText('Ukryte:');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});

test('szybkie dania: nazwa sekcji z pory, karta 44 px otwiera przepis, NOWE nie zasłania nazwy', async ({ page }) => {
  const errors = await open(page);
  const name = await page.evaluate(() => QUICK_N[quickSlot(new Date())]);
  const h = page.locator('h2.qh');
  await expect(h).toContainText(name);
  const over = await page.evaluate(() => { const h = document.querySelector('h2.qh'), n = h.querySelector('.nowe'); if (!n) return 'brak'; const r = document.createRange(); r.setStart(h.firstChild, 0); r.setEnd(h.firstChild, h.firstChild.length); const t = r.getBoundingClientRect(), b = n.getBoundingClientRect(); return b.left < t.right - 1 && b.right > t.left && b.top < t.bottom && b.bottom > t.top; });
  expect(over).toBe(false);
  const card = page.locator('.qstrip .qc').first();
  await card.scrollIntoViewIfNeeded();
  const r = await card.boundingBox();
  expect(r.height).toBeGreaterThanOrEqual(44);
  const id = await card.getAttribute('data-recipe');
  await card.click();
  await expect(page.locator('h2.rt')).toHaveText(await page.evaluate((i) => MEALS.find((m) => m.id === i).n, id));
  expect(await page.evaluate(() => S.seenNew.quick)).toBe(true);
  expect(errors).toEqual([]);
});

// Uwagi użytkownika 27.11: karty dań na telefonie do krawędzi ekranu jak inne sekcje; „Przepis” w wierszu z nazwą, nie w osobnej linii
for (const w of [320, 390]) {
  test(`karty dań ${w}px: do krawędzi ekranu, „Przepis” w pierwszym wierszu nazwy`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 800 });
    const errors = await open(page);
    const g = await page.evaluate(() => [...document.querySelectorAll('#mlist article.meal')].slice(0, 8).map((a) => {
      const r = a.getBoundingClientRect(), n = a.querySelector('.mhead .name'), l = a.querySelector('.mhead .mlnk');
      const nr = n.getClientRects()[0], lr = l && l.getBoundingClientRect();
      return { left: Math.round(r.left), right: Math.round(innerWidth - r.right), inLine: !!lr && lr.top < nr.bottom && lr.bottom > nr.top, own: !!a.querySelector('.mhead > .small') };
    }));
    expect(g.length).toBeGreaterThan(2);
    for (const x of g) { expect(x.left).toBe(0); expect(x.right).toBe(0); expect(x.inLine).toBe(true); expect(x.own).toBe(false); }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}
