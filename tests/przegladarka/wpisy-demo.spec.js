// Propozycje wpisu (demo) w scenariuszu #demo-prosty: suwak, waga, karta, układ przy 320 px.
const { test, expect } = require('@playwright/test');

async function open(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  await page.goto('/index.html#demo-prosty');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object' && S.lite === true);
  await page.evaluate(() => { SHEET = false; render(); });
  await expect(page.locator('#wpisydemo')).toBeVisible();
  return errors;
}

test('wpisy-demo: sekcja widoczna, bez poziomego przewijania, bez błędów', async ({ page }) => {
  const errors = await open(page);
  await expect(page.locator('#wpisydemo_h')).toHaveText('Propozycje wpisu do wyboru (demo)');
  const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, r: document.querySelector('#wpisydemo').getBoundingClientRect().right }));
  expect(o.sw).toBeLessThanOrEqual(o.cw);
  expect(o.r).toBeLessThanOrEqual(o.cw);
  expect(errors).toEqual([]);
});

test('wpisy-demo: + przy śnie zmienia wartość o 15 minut, Zatwierdź pokazuje „Zapisane”', async ({ page }) => {
  const errors = await open(page);
  await expect(page.locator('#wd_vs')).toHaveText('7 h 15 min');
  await page.getByRole('button', { name: 'Sen o 15 minut więcej' }).click();
  await expect(page.locator('#wd_vs')).toHaveText('7 h 30 min');
  await page.locator('#wpisydemo [data-wd="ok1"]').click();
  await expect(page.locator('#wd_d1')).toContainText('Zapisane');
  await expect(page.locator('#wd_sumtxt')).toContainText('Zapisane na dziś: Sen 7 h 30 min');
  expect(await page.evaluate(() => localStorage.getItem(LS))).toBeNull();
  expect(errors).toEqual([]);
});

test('wpisy-demo: waga + trzy razy zmienia pasmo na „więcej niż zwykłe wahanie”', async ({ page }) => {
  const errors = await open(page);
  await expect(page.locator('#wd_band')).toContainText('mieści się w zwykłym wahaniu');
  const plus = page.getByRole('button', { name: '0,1 kg więcej' });
  for (let i = 0; i < 3; i++) await plus.click();
  await expect(page.locator('#wd_vw')).toContainText('77,1');
  await expect(page.locator('#wd_band')).toContainText('więcej niż zwykłe wahanie');
  expect(errors).toEqual([]);
});

test('wpisy-demo: przyciski i żetony co najmniej 44 px wysokości, kółko działa strzałkami', async ({ page }) => {
  const errors = await open(page);
  const hs = await page.evaluate(() => [...document.querySelectorAll('#wpisydemo button')].map((b) => ({ t: b.getAttribute('aria-label') || b.textContent, h: b.getBoundingClientRect().height, w: b.getBoundingClientRect().width })));
  expect(hs.length).toBeGreaterThan(15);
  for (const b of hs) { expect(b.h, b.t).toBeGreaterThanOrEqual(44); expect(b.w, b.t).toBeGreaterThanOrEqual(44); }
  await page.locator('#wd_wh').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#wd_v2')).toHaveText('8 h 15 min');
  await page.locator('#wpisydemo [data-wd="opensum"]').click();
  await expect(page.locator('#wd_stan')).toBeVisible();
  expect(errors).toEqual([]);
});

test('wpisy-demo: po ponownym narysowaniu widoku sekcja nadal działa', async ({ page }) => {
  const errors = await open(page);
  await page.evaluate(() => render());
  await page.getByRole('button', { name: 'Sen o 15 minut więcej' }).click();
  await expect(page.locator('#wd_vs')).toHaveText('7 h 30 min');
  expect(errors).toEqual([]);
});
