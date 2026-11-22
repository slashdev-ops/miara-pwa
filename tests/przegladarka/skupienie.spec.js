// Tryb skupienia (F1a planu ADHD, 22.11.2026, wersja B): jedna karta zadania w Moim dniu, „Później”, zapis przechodzi dalej z fokusem
// i ogłoszeniem, „Gotowe na dziś”, „Pokaż resztę dnia”, bez ruchu; 320 px bez przewijania w poziomie, cele dotyku 44 px (strażnik F0).
const { test, expect } = require('@playwright/test');

async function open(page, prep) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('konsola: ' + m.text()); });
  await page.goto('/index.html#demo-pokaz');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object' && typeof SKUP === 'object');
  await page.evaluate((p) => {
    SHEET = false; S.lite = true; S.focus = true; S.unlock = ['waga', 'sen', 'posilki']; S.tab = 'day'; S.guide = { hidden: true, dataOk: true, seenPet: true };
    const k = todayKey(); S.meas[k] = {}; S.days[k] = []; Object.assign(SKUP_UI, { day: '', skip: [], mine: [], cur: '', rest: '', say: '' });
    if (p) p.forEach(([f, v]) => { S.meas[k][f] = v; });
    render();
  }, prep || null);
  await page.evaluate(() => document.fonts.ready);
  return errors;
}
const head = (page) => page.locator('#skup_h');
const counter = (page) => page.locator('.skup-n');
async function goTo(page, title) {
  for (let i = 0; i < 8; i++) { if ((await head(page).textContent()) === title) return; await page.locator('[data-skuplater]').click(); }
  throw new Error('brak zadania ' + title);
}

test('skupienie: jedna karta, „Później” bez zmiany danych, zapis przechodzi dalej z fokusem i ogłoszeniem', async ({ page }) => {
  const errors = await open(page);
  await expect(page.locator('.skup-card')).toHaveCount(1);
  await expect(counter(page)).toHaveText(/^1 z 6$/);
  await expect(page.locator('.petcard, [data-unlock], .tip')).toHaveCount(0);
  const before = await page.evaluate(() => JSON.stringify(S.meas));
  const t0 = await head(page).textContent();
  await page.locator('[data-skuplater]').click();
  await expect(head(page)).not.toHaveText(t0);
  await expect(counter(page)).toHaveText(/^1 z 6$/);
  expect(await page.evaluate(() => JSON.stringify(S.meas))).toBe(before);
  await goTo(page, 'Jak się czujesz?');
  await page.locator('[data-lite="feel:dobrze"]').click();
  await expect(counter(page)).toHaveText(/^2 z 6$/);
  await expect(head(page)).toBeFocused();
  await expect(page.locator('#sr')).toHaveText(/^2 z 6: /);
  await expect(page.locator('.skup-done')).toContainText('Samopoczucie');
  expect(errors).toEqual([]);
});

test('skupienie: kroki ze Skrótu od razu zrobione; po wszystkim „Gotowe na dziś”, „Pokaż resztę dnia” daje szybki wpis', async ({ page }) => {
  const errors = await open(page, [['steps', '8214']]);
  await expect(counter(page)).toHaveText(/^1 z 5$/);
  await expect(page.locator('.skup-done')).toContainText(/Kroki · 8\s?214/);
  await page.evaluate(() => { const k = todayKey(); Object.assign(S.meas[k], { feel: 'dobrze', redz: 0, w: '80.4', sleep: '7.25' }); S.days[k] = [{ kind: 'm', id: 'x', label: 'Test', k: 300, p: 20, f: 10, c: 30 }]; render(); });
  await expect(head(page)).toHaveText('Gotowe na dziś');
  await expect(page.locator('.skup-done li')).toHaveCount(6);
  await page.locator('[data-skuprest]').click();
  await expect(page.locator('#lite')).toBeVisible();
  expect(await page.evaluate(() => S.focus)).toBe(true);
  expect(errors).toEqual([]);
});

test('skupienie: bez ruchu, 320 px bez przewijania w poziomie, cele dotyku co najmniej 44 px', async ({ page }) => {
  await open(page);
  expect(await page.evaluate(() => document.documentElement.dataset.still)).toBe('1');
  await page.locator('[data-skuplater]').click();
  expect(await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length)).toBe(0);
  for (let i = 0; i < 6; i++) {
    const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
      small: [...document.querySelectorAll('#main button, #main input, #main summary')].filter((e) => { const r = e.getBoundingClientRect(); return r.height > 0 && (r.height < 43.5 || r.width < 43.5); }).map((e) => (e.textContent || e.id).trim()) }));
    expect(o.sw).toBeLessThanOrEqual(o.cw);
    expect(o.small, await head(page).textContent()).toEqual([]);
    await page.locator('[data-skuplater]').click();
  }
});
