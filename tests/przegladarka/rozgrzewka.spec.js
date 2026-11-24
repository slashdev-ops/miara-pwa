// Rozgrzewka (plan rada/plany/2026-11-24-rozgrzewka-plan.md, testy 7-11): ruch tylko krok po kroku, zatrzymanie ruchu,
// licznik bez automatycznego przejścia, fokus na nazwie ćwiczenia, cele dotyku, odmowa blokady ekranu bez fałszywego napisu.
const { test, expect } = require('@playwright/test');

async function trening(page, opts) {
  if (opts && opts.lockFail) await page.addInitScript(() => { Object.defineProperty(navigator, 'wakeLock', { value: { request: () => Promise.reject(new Error('odmowa')) }, configurable: true }); });
  await page.goto('/index.html#demo-pokaz');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  await page.evaluate(() => { SHEET = false; S.lite = false; S.guide = { hidden: true, dataOk: true, seenPet: true }; S.warm = { full: false };
    (S.days[todayKey()] || []).splice(0); WARM_UI.skip = ''; WARM_UI.step = null; S.tab = 'train'; render(); });
}
const anims = (page, sel) => page.evaluate((s) => [...document.querySelectorAll(s)].flatMap((e) => e.getAnimations({ subtree: true })).filter((a) => a.playState === 'running').length, sel);

test('lista rozgrzewki bez ruchu', async ({ page }) => {
  await trening(page);
  await expect(page.locator('[data-warmex]')).toHaveCount(6);
  expect(await anims(page, '[data-warm="card"]')).toBe(0);
});

test('krok po kroku: ruch działa, „Zatrzymaj ruch” go zatrzymuje', async ({ page }) => {
  await trening(page);
  await page.locator('[data-warmgo]').click();
  await expect(page.locator('#warm_h')).toHaveText('Marsz w miejscu');
  expect(await anims(page, '.warm-big')).toBeGreaterThan(0);
  await page.locator('[data-warmpause]').click();
  expect(await anims(page, '.warm-big')).toBe(0);
});

test('krok po kroku: bez ruchu przy ograniczeniu ruchu w systemie', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await trening(page);
  await page.locator('[data-warmgo]').click();
  expect(await anims(page, '.warm-big')).toBe(0);
});

test('licznik nie przechodzi sam dalej; „Dalej” daje fokus na nazwę ćwiczenia', async ({ page }) => {
  await page.clock.install();
  await trening(page);
  await page.locator('[data-warmgo]').click();
  await page.clock.runFor(185000);
  await expect(page.locator('#warm_h')).toHaveText('Marsz w miejscu');
  await expect(page.locator('#warm_t')).toHaveText('0:00');
  await page.locator('[data-warmnext]').click();
  await expect(page.locator('#warm_h')).toHaveText('Pięta do przodu');
  expect(await page.evaluate(() => document.activeElement && document.activeElement.id)).toBe('warm_h');
});

test('cele dotyku 44 px i bez przewijania w poziomie (lista i krok po kroku)', async ({ page }) => {
  await trening(page);
  const small = (sel) => page.evaluate((s) => [...document.querySelectorAll(s)].map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0 && (r.width < 44 || r.height < 44)).length, sel);
  expect(await small('[data-warm] button')).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.locator('[data-warmgo]').click();
  expect(await small('[data-warm] button')).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('odmowa blokady ekranu: brak napisu „Ekran nie gaśnie”', async ({ page }) => {
  await trening(page, { lockFail: true });
  await page.locator('[data-warmgo]').click();
  await expect(page.locator('#warm_lock')).toBeHidden();
});

test('krok po kroku: „Dalej” widoczne bez przewijania nad dolnym menu (telefon 390 × 844)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await trening(page);
  await page.locator('[data-warmgo]').click();
  const r = await page.evaluate(() => { const b = document.querySelector('[data-warmnext]').getBoundingClientRect(), n = document.querySelector('nav.tabs').getBoundingClientRect(); return { b: b.bottom, n: n.top }; });
  expect(r.b).toBeLessThanOrEqual(r.n);
});

test('przegląd kodu: licznik po upływie czasu zostaje na 0:00 po przerysowaniu; „Zatrzymaj ruch” ma stałą nazwę i stan w aria-pressed', async ({ page }) => {
  await page.clock.install();
  await trening(page);
  await page.locator('[data-warmgo]').click();
  await page.clock.runFor(185000);
  await expect(page.locator('#warm_t')).toHaveText('0:00');
  const p = page.locator('[data-warmpause]');
  await p.click();
  await expect(page.locator('#warm_t')).toHaveText('0:00');
  await expect(p).toHaveText('Zatrzymaj ruch');
  await expect(p).toHaveAttribute('aria-pressed', 'true');
});
