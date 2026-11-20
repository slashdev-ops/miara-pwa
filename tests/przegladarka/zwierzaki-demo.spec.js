// Galeria nowych zwierzaków (demo) w scenariuszu #demo-prosty: 4 gatunki, wspólne nastroje, reakcja na dotknięcie.
const { test, expect } = require('@playwright/test');

async function open(page, o = {}) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  if (o.w) await page.setViewportSize({ width: o.w, height: 844 });
  if (o.reduce) await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/index.html#demo-prosty');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object' && S.lite === true);
  await page.evaluate(() => { SHEET = false; render(); });
  await expect(page.locator('#zwdemo')).toBeVisible();
  return errors;
}
const anims = (page) => page.evaluate(() => [...document.querySelectorAll('#zwdemo .zw-svg, #zwdemo .zw-svg *')].reduce((n, e) => n + e.getAnimations().length, 0));

test('zwierzaki-demo: sekcja pod propozycjami wpisu, 4 karty, postacie z opisem', async ({ page }) => {
  const errors = await open(page);
  await expect(page.locator('#zwdemo_h')).toHaveText('Nowe zwierzaki do wyboru (demo)');
  await expect(page.locator('#zwdemo')).toContainText('Własne postacie w stylu popularnych uroczych zwierzaków. Dotknij nastroju, żeby zobaczyć reakcję.');
  const after = await page.evaluate(() => !!(document.querySelector('#wpisydemo').compareDocumentPosition(document.querySelector('#zwdemo')) & Node.DOCUMENT_POSITION_FOLLOWING));
  expect(after).toBe(true);
  await expect(page.locator('#zwdemo .zw-card')).toHaveCount(4);
  for (const n of ['Gąska', 'Kaczuszka', 'Kapibara', 'Kotek']) await expect(page.getByRole('img', { name: n + ': spokój', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Spokój', exact: true })).toHaveAttribute('aria-pressed', 'true');
  expect(errors).toEqual([]);
});

test('zwierzaki-demo: „Seria” dodaje serduszka, zmienia opis i ogłasza zmianę; „Drzemka” zamyka oczy', async ({ page }) => {
  const errors = await open(page);
  await expect(page.locator('#zwdemo .zw-heart')).toHaveCount(0);
  await page.getByRole('button', { name: 'Seria', exact: true }).click();
  await expect(page.locator('#zwdemo .zw-heart')).toHaveCount(12);
  await expect(page.getByRole('button', { name: 'Seria', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Spokój', exact: true })).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('img', { name: 'Kotek: seria', exact: true })).toBeVisible();
  await expect(page.locator('#zw_live')).not.toBeEmpty();
  await page.getByRole('button', { name: 'Drzemka', exact: true }).click();
  await expect(page.getByRole('img', { name: 'Kapibara: drzemka', exact: true })).toBeVisible();
  await expect(page.locator('#zwdemo .zw-heart')).toHaveCount(0);
  await expect(page.locator('#zwdemo .zw-z')).toHaveCount(8);
  expect(errors).toEqual([]);
});

test('zwierzaki-demo: dotknięcie karty daje krótką reakcję, widok aplikacji się nie zmienia', async ({ page }) => {
  const errors = await open(page);
  const tab = await page.evaluate(() => S.tab);
  const card = page.locator('#zwdemo .zw-card').nth(3);
  await card.click();
  await expect(card).toHaveClass(/zw-tap/);
  await expect(page.locator('#zw_live')).toHaveText('Kotek podskakuje.');
  expect(await page.evaluate(() => S.tab)).toBe(tab);
  await expect(page.locator('#zwdemo')).toBeVisible();
  expect(errors).toEqual([]);
});

test('zwierzaki-demo: cele co najmniej 44 px, 2 karty w rzędzie, bez poziomego przewijania przy 320 px', async ({ page }) => {
  const errors = await open(page, { w: 320 });
  const o = await page.evaluate(() => {
    const ctl = [...document.querySelectorAll('#zwdemo button')].map((e) => ({ t: e.textContent.trim() || e.getAttribute('aria-label'), h: e.getBoundingClientRect().height, w: e.getBoundingClientRect().width }));
    const tops = [...document.querySelectorAll('#zwdemo .zw-card')].map((c) => Math.round(c.getBoundingClientRect().top));
    return { ctl, tops, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, r: document.querySelector('#zwdemo').getBoundingClientRect().right };
  });
  expect(o.ctl.length).toBe(10);
  for (const c of o.ctl) { expect(c.h, c.t).toBeGreaterThanOrEqual(44); expect(c.w, c.t).toBeGreaterThanOrEqual(44); }
  expect(o.tops[0]).toBe(o.tops[1]);
  expect(o.tops[2]).toBe(o.tops[3]);
  expect(o.tops[2]).toBeGreaterThan(o.tops[0]);
  expect(o.sw).toBeLessThanOrEqual(o.cw);
  expect(o.r).toBeLessThanOrEqual(o.cw);
  expect(errors).toEqual([]);
});

test('zwierzaki-demo: postacie oddychają, a przy ograniczeniu ruchu nie mają animacji', async ({ page }) => {
  let errors = await open(page);
  expect(await anims(page)).toBeGreaterThan(0);
  await page.close();
  const p2 = await page.context().newPage();
  errors = await open(p2, { reduce: true });
  expect(await anims(p2)).toBe(0);
  for (const m of ['Zapis!', 'Seria', 'Drzemka', 'Radość', 'Ciekawość']) {
    await p2.getByRole('button', { name: m, exact: true }).click();
    expect(await anims(p2), m).toBe(0);
  }
  await p2.locator('#zwdemo .zw-card').first().click();
  expect(await anims(p2)).toBe(0);
  await expect(p2.locator('#zwdemo .zw-heart')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('zwierzaki-demo: po ponownym narysowaniu widoku nastroje nadal działają', async ({ page }) => {
  const errors = await open(page);
  await page.evaluate(() => render());
  await page.getByRole('button', { name: 'Radość', exact: true }).click();
  await expect(page.getByRole('img', { name: 'Gąska: radość', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
