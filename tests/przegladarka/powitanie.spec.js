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

for (const w of [320, 390]) {
  test(`W2 samouczek ${w}px: latarka obejmuje element, dymek w ekranie, przyciski 44 px, Escape kończy i oddaje fokus`, async ({ page }) => {
    const errors = await fresh(page, w);
    await page.evaluate(() => { S.onb = true; S.wel = null; S.lite = false; S.seenNew = {}; S.updToast = true; S.tab = 'set'; OPEN_F.add('pierwsze'); render(); });
    await page.locator('[data-tourstart="all"]').click();
    await expect(page.locator('#tbh')).toHaveText('Liczba kcal da się dotknąć');
    await expect(page.locator('#tbh')).toBeFocused();
    for (let i = 0; i < 4; i++) {
      const g = await page.evaluate(() => { const k = TOUR.k[TOUR.i], t = document.querySelector(TOUR_S[k][0]), h = document.getElementById('thole').getBoundingClientRect(), b = document.getElementById('tbub').getBoundingClientRect();
        const r = t && t.getBoundingClientRect(); return { k, cover: !!r && h.left <= r.left && h.top <= r.top && h.right >= r.right && h.bottom >= r.bottom, inView: b.top >= 0 && b.bottom <= innerHeight && b.left >= 0 && b.right <= innerWidth }; });
      expect(g.cover, g.k).toBe(true); expect(g.inView, g.k).toBe(true);
      const btn = page.locator('.tbrow .btn'); const r = await btn.boundingBox(); expect(r.height).toBeGreaterThanOrEqual(44);
      if (i < 3) await btn.click();
    }
    await page.keyboard.press('Escape');
    await expect(page.locator('#thole')).toHaveCount(0);
    expect(await page.evaluate(() => document.activeElement && document.activeElement.matches('#main [data-addmeal]'))).toBe(true);
    expect(await page.evaluate(() => [S.seenNew.kcal, S.seenNew.mac, S.seenNew.dop])).toEqual([true, true, true]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('W2 po aktualizacji: komunikat „N nowe funkcje” z Pokaż prowadzi tylko po nowościach', async ({ page }) => {
  const errors = await fresh(page, 390);
  await page.evaluate(() => { localStorage.setItem(LS, JSON.stringify({ onb: true, lite: false, seenNew: { kcal: true } })); });
  await page.reload(); await page.waitForFunction(() => typeof S === 'object');
  await expect(page.locator('#toast')).toContainText('2 nowe funkcje');
  await page.locator('#toast [data-tourstart="new"]').click();
  await expect(page.locator('.tcnt')).toHaveText('1 z 2');
  await expect(page.locator('#tbh')).toHaveText('Makra otwierają rachunek dnia');
  await page.locator('[data-tourend]').first().click();
  await page.reload(); await page.waitForFunction(() => typeof S === 'object');
  await expect(page.locator('#toast')).not.toContainText('nowe funkcje');
  expect(errors).toEqual([]);
});
