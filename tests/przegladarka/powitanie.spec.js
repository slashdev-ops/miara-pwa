// Powitanie W1 (makieta „Pierwsze kroki”, zaakceptowana): nowa osoba, pusty telefon, 3 plansze przed danymi.
const { test, expect } = require('@playwright/test');

async function fresh(page, w) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  await page.setViewportSize({ width: w, height: 760 });
  await page.goto('/index.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  return errors;
}

for (const w of [320, 390]) {
  test(`powitanie ${w}px: plansze bez poziomego przewijania, przyciski co najmniej 44 px, fokus na nagłówku planszy`, async ({ page }) => {
    const errors = await fresh(page, w);
    await expect(page.locator('#wh')).toHaveText('Miara podpowiada, co zjeść');
    await expect(page.locator('#tabs')).toBeHidden();
    for (const [btn, head] of [['[data-welnext]', 'Dane zostają w tym telefonie'], ['[data-welskip]', 'Zacznij od jednej rzeczy']]) {
      const b = page.locator(btn); const r = await b.boundingBox();
      expect(r.height).toBeGreaterThanOrEqual(44); expect(r.width).toBeGreaterThanOrEqual(44);
      await b.click(); await expect(page.locator('#wh')).toHaveText(head);
      await expect(page.locator('#wh')).toBeFocused();
    }
    for (const sel of ['[data-introdone="1"]', '[data-weldane]']) { const r = await page.locator('.welacts ' + sel).boundingBox(); expect(r.height).toBeGreaterThanOrEqual(44); }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('powitanie: „Najpierw moje dane” otwiera ekran danych, „Zacznij od szybkiego wpisu” Mój dzień; po ponownym otwarciu bez powitania', async ({ page }) => {
  const errors = await fresh(page, 390);
  await page.locator('[data-welskip]').click();
  await page.locator('[data-weldane]').click();
  await expect(page.locator('#f_kg')).toBeVisible();
  await page.evaluate(() => { S.wel = 2; render(); });
  await page.locator('.welacts [data-introdone="1"]').click();
  expect(await page.evaluate(() => [S.tab, S.onb, S.wel == null])).toEqual(['day', true, true]);
  await page.reload(); await page.waitForFunction(() => typeof S === 'object');
  expect(await page.evaluate(() => S.tab)).toBe('day');
  await expect(page.locator('#wh')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('W3a: przełącznik „Oznaczaj nowe funkcje znakiem NOWE” ukrywa znaki NOWE na Posiłkach', async ({ page }) => {
  const errors = await fresh(page, 390);
  await page.evaluate(() => { S.onb = true; S.wel = null; S.lite = false; S.seenNew = {}; S.tab = 'set'; OPEN_F.add('pierwsze'); render(); });
  const sw = page.locator('#nowe'); await expect(sw).toBeChecked();
  await sw.click(); await expect(sw).not.toBeChecked();
  await page.evaluate(() => { S.tab = 'meals'; render(); });
  expect(await page.locator('.nowe').count()).toBeGreaterThan(0);
  expect(await page.locator('.nowe:visible').count()).toBe(0);
  expect(errors).toEqual([]);
});
