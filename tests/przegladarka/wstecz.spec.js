// Z13 (27.11.2026): gest i przycisk Wstecz systemu (Android, iOS) zamykają najpierw arkusz „Dodaj wpis”, zamiast opuścić aplikację;
// po zamknięciu arkusza przyciskiem w historii nie zostaje pusty wpis (kolejne Wstecz działa jak zwykle).
const { test, expect } = require('@playwright/test');

async function open(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  await page.goto('about:blank');
  await page.goto('/index.html#demo-pokaz');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object' && S.onb);
  return errors;
}
const sheet = (page) => page.locator('#sheet [role="dialog"]');
const histLen = (page) => page.evaluate(() => history.length);

test('Wstecz przy otwartym arkuszu zamyka arkusz i zostaje w aplikacji; fokus wraca na przycisk dodawania', async ({ page }) => {
  const errors = await open(page);
  const url = page.url();
  await page.locator('nav.tabs [data-addsheet="1"]').click();
  await expect(sheet(page)).toBeVisible();
  await page.goBack();
  await expect(sheet(page)).toHaveCount(0);
  expect(page.url()).toBe(url);
  await expect(page.locator('nav.tabs [data-addsheet="1"]')).toBeFocused();
  expect(errors).toEqual([]);
});

test('zamknięcie przyciskiem, Escape albo wyborem z arkusza nie zostawia wpisu w historii', async ({ page }) => {
  const errors = await open(page);
  const n0 = await histLen(page);
  for (const close of [
    () => page.locator('#sheet .sheetbox [data-sheetclose="1"]').click(),
    () => page.keyboard.press('Escape'),
    () => page.locator('#sheet [data-tab="meals"]').click(),
  ]) {
    await page.locator('nav.tabs [data-addsheet="1"]').click();
    await expect(sheet(page)).toBeVisible();
    await close();
    await expect(sheet(page)).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => !!(history.state && history.state.miaraSheet))).toBe(false);
  }
  // historia nie rośnie z każdym otwarciem: po 3 otwarciach i zamknięciach wpis arkusza nie jest bieżący
  expect(await histLen(page)).toBeLessThanOrEqual(n0 + 1);
  expect(errors).toEqual([]);
});

test('Wstecz bez otwartego arkusza nie jest przechwytywane', async ({ page }) => {
  const errors = await open(page);
  await page.goto('/index.html#demo-pokaz');
  const before = await page.evaluate(() => S.tab);
  await page.goBack();
  // poprzedni wpis historii to ta sama strona z innym zaczepem albo about:blank: aplikacja nie wstrzymała nawigacji
  expect(await page.evaluate(() => (typeof SHEET === 'undefined' ? false : SHEET))).toBe(false);
  expect(typeof before).toBe('string');
  expect(errors).toEqual([]);
});
