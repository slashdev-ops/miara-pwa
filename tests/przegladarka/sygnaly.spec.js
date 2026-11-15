// Sygnały z brzucha w przeglądarce: alarm 112 i dymek reguły Miary (13.11.2026).
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..', '..');
const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const CSP = vercel.headers.flatMap((h) => h.headers).find((h) => h.key === 'Content-Security-Policy').value
  .split(';').map((d) => d.trim()).filter((d) => d && d !== 'upgrade-insecure-requests').join('; ');

async function open(page, hash = '#demo-pokaz') {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('konsola: ' + m.text()); });
  await page.route('**/*', async (route) => { const res = await route.fetch(); await route.fulfill({ response: res, headers: { ...res.headers(), 'content-security-policy': CSP } }); });
  await page.goto('/index.html' + hash);
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  return errors;
}

const noOverflow = (page) => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);

test('alarm 112: widoczny, link co najmniej 44 px, w oknie widoku po kliknięciu', async ({ page }) => {
  const errors = await open(page);
  await page.evaluate(() => { S.tab = 'day'; S.prof.cond.gut = true; S.discreet = false; S.gut = {}; OPEN_F.add('brzuch'); render(); });
  await page.locator('[data-guta="krew"]').first().click();
  const alert = page.locator('[role="alert"]', { has: page.locator('a[href="tel:112"]') }).first();
  await expect(alert).toBeVisible();
  const link = alert.locator('a[href="tel:112"]').first();
  const lb = await link.boundingBox();
  expect(lb.height).toBeGreaterThanOrEqual(44);
  const ab = await alert.boundingBox();
  const vh = page.viewportSize().height;
  expect(ab.y).toBeGreaterThanOrEqual(0);
  expect(ab.y + ab.height).toBeLessThanOrEqual(vh);
  expect(await noOverflow(page)).toBe(true);
  expect(errors).toEqual([]);
});

test('alarm 112 bez zwierzaka: ostrzeżenie .note.warn z tel:112, bez .pet-alert', async ({ page }) => {
  const errors = await open(page);
  await page.evaluate(() => { S.tab = 'day'; S.prof.cond.gut = true; S.discreet = false; S.gut = {}; S.pet = null; OPEN_F.add('brzuch'); render(); });
  await page.locator('[data-guta="krew"]').first().click();
  await expect(page.locator('.note.warn[role="alert"] a[href="tel:112"]').first()).toBeVisible();
  await expect(page.locator('.pet-alert')).toHaveCount(0);
  expect(await noOverflow(page)).toBe(true);
  expect(errors).toEqual([]);
});

test('sygnał spokojny: jeden dymek „reguła Miary”, przyciski co najmniej 44 px', async ({ page }) => {
  const errors = await open(page);
  await page.evaluate(() => {
    S.tab = 'day'; S.prof.cond.gut = true; S.discreet = false; S.gut = {}; OPEN_F.add('brzuch');
    for (let i = 0; i < 16; i++) S.gut[nAgo(i)] = { u: ['piecze'] };
    render();
  });
  const bubble = page.locator('.petsay', { hasText: 'reguła Miary' });
  await expect(bubble).toHaveCount(1);
  await expect(bubble).toBeVisible();
  const hs = await bubble.locator('button, a').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
  expect(hs.length).toBeGreaterThan(0);
  for (const h of hs) expect(h).toBeGreaterThanOrEqual(44);
  expect(await noOverflow(page)).toBe(true);
  expect(errors).toEqual([]);
});

test('alarm 112: po kliknięciu krwi fokus trafia na link tel:112', async ({ page }) => {
  const errors = await open(page);
  await page.evaluate(() => { S.tab = 'day'; S.prof.cond.gut = true; S.discreet = false; S.gut = {}; OPEN_F.add('brzuch'); render(); });
  await page.locator('[data-guta="krew"]').first().click();
  await expect(page.locator('a[href="tel:112"]').first()).toBeFocused();
  expect(errors).toEqual([]);
});

test('alarm 112 aktywny: zaznaczenie zgagi nie przesuwa strony do alarmu', async ({ page }) => {
  const errors = await open(page);
  await page.evaluate(() => { S.tab = 'day'; S.prof.cond.gut = true; S.discreet = false; S.gut = {}; S.gut[todayKey()] = { a: ['krew'] }; OPEN_F.add('brzuch'); render(); });
  const chip = page.locator('[data-gutu="zgaga"]').first();
  await chip.scrollIntoViewIfNeeded();
  await chip.click();
  const b = await page.locator('[data-gutu="zgaga"]').first().boundingBox();
  const vh = page.viewportSize().height;
  expect(b.y).toBeGreaterThanOrEqual(0);
  expect(b.y + b.height).toBeLessThanOrEqual(vh);
  await expect(page.locator('a[href="tel:112"]').first()).not.toBeFocused();
  expect(errors).toEqual([]);
});

test('alarm 112: ogłaszany raz, po kolejnym przerysowaniu region „Pilne” bez role=alert', async ({ page }) => {
  const errors = await open(page);
  await page.evaluate(() => { S.tab = 'day'; S.prof.cond.gut = true; S.discreet = false; S.gut = {}; OPEN_F.add('brzuch'); render(); });
  await page.locator('[data-guta="krew"]').first().click();
  await expect(page.locator('[role="alert"] a[href="tel:112"]').first()).toBeVisible();
  const chip = page.locator('[data-gutu="zgaga"]').first();
  await chip.scrollIntoViewIfNeeded();
  await chip.click();
  await expect(page.locator('[role="region"][aria-label="Pilne"] a[href="tel:112"]').first()).toBeVisible();
  await expect(page.locator('#main [role="alert"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('lista na wizytę: przełącznik w dymku i w Zdrowiu (aria-pressed), czyszczenie z „Cofnij”', async ({ page }) => {
  const errors = await open(page);
  await page.evaluate(() => {
    S.tab = 'day'; S.prof.cond.gut = true; S.discreet = false; S.gut = {}; S.sygSeen = {}; S.wizList = []; OPEN_F.add('brzuch');
    for (let i = 0; i < 16; i++) S.gut[nAgo(i)] = { u: ['piecze'] };
    render();
  });
  const wb = page.locator('.petsay [data-sygwiz="hp_test"]');
  await expect(wb).toHaveAttribute('aria-pressed', 'false');
  await wb.click();
  await expect(wb).toHaveAttribute('aria-pressed', 'true');
  await expect(wb).toHaveText('✓ Na liście na wizytę');
  await wb.click();
  await expect(wb).toHaveAttribute('aria-pressed', 'false');
  await page.evaluate(() => { S.tab = 'health'; render(); });
  const hb = page.locator('#syg_hp_test [data-sygwiz="hp_test"]');
  await hb.scrollIntoViewIfNeeded();
  await hb.click();
  await expect(hb).toHaveAttribute('aria-pressed', 'true');
  expect((await hb.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await page.evaluate(() => { S.tab = 'visit'; render(); });
  await page.locator('[data-wizclear]').click();
  await expect(page.locator('[data-wizclear]')).toHaveCount(0);
  expect(await page.evaluate(() => S.wizList.length)).toBe(0);
  await page.locator('#toast [data-undo]').click();
  expect(await page.evaluate(() => S.wizList.join())).toBe('hp_test');
  expect(errors).toEqual([]);
});
