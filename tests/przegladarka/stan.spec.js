// Podsumowanie po szybkim wpisie „Twój stan” (plan łatwości 20.11.2026, zadanie 4): pełna karta zwija się w miejscu do
// „✓ Zapisane na dziś”, fokus na „Zobacz podsumowanie”; podsumowanie rozwija się w miejscu bez zmiany ekranu (WCAG 3.2.2).
const { test, expect } = require('@playwright/test');

async function open(page, w) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('konsola: ' + m.text()); });
  if (w) await page.setViewportSize({ width: w, height: 800 });
  await page.goto('/index.html#demo-prosty');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object' && S.lite === true);
  await page.evaluate(() => { SHEET = false; render(); });
  return errors;
}
const fill = async (page) => {
  await page.getByRole('button', { name: '50 kroków więcej' }).click();
  await page.locator('[data-lite="feel:dobrze"]').click();
  await page.locator('[data-lite="redz:0"]').click();
};

test('stan: ostatni wybór zwija kartę w miejscu, fokus na Zobacz podsumowanie, zwinięcie ogłoszone, dane zostają', async ({ page }) => {
  const errors = await open(page);
  await fill(page);
  const card = page.locator('#lite');
  await expect(card).toContainText(/✓ Zapisane na dziś: Kroki 5\s050 · Dobrze · Jedzenie kaloryczne 0/);
  await expect(page.locator('#lite [data-lite]')).toHaveCount(0);
  await expect(page.locator('#lite_see')).toBeFocused();
  await expect(page.locator('#lite_see')).toHaveText('Podsumowanie');
  await expect(page.locator('#lite_see')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#sr')).toHaveText(/^Dzień zapisany\. Szybki wpis zwinięty: /);
  await expect(page.locator('#toast')).not.toContainText('Dzień zapisany');
  expect(await page.evaluate(() => { const m = S.meas[todayKey()]; return [m.steps, m.feel, m.redz]; })).toEqual(['5050', 'dobrze', 0]);
  expect(errors).toEqual([]);
});

test('stan: kroki zapisane jako ostatnie (suwak) też zwijają kartę z fokusem na Zobacz podsumowanie', async ({ page }) => {
  const errors = await open(page);
  await page.locator('[data-lite="feel:inne"]').click();
  await page.locator('[data-lite="redz:2"]').click();
  await expect(page.locator('#lite [data-lite]')).toHaveCount(7);
  const r = page.locator('#q_rsteps');
  await r.focus();
  await r.fill('7500');
  await expect(page.locator('#lite')).toContainText(/Kroki 7\s500 · Inne · Jedzenie kaloryczne 2 lub więcej/);
  await expect(page.locator('#lite_see')).toBeFocused();
  expect(errors).toEqual([]);
});

test('stan: Zobacz podsumowanie rozwija Twój stan w miejscu: 7 kropek, liczby, wykres wagi z pasem, seria, co dalej', async ({ page }) => {
  const errors = await open(page, 320);
  await fill(page);
  const url = page.url(), see = page.locator('#lite_see');
  await see.click();
  expect(page.url()).toBe(url);
  expect(await page.evaluate(() => S.tab)).toBe('day');
  const st = page.locator('#lite_stan');
  await expect(st).toBeVisible();
  await expect(see).toBeFocused();
  await expect(see).toHaveAttribute('aria-expanded', 'true');
  await expect(see).toHaveText('Podsumowanie');
  await expect(st.locator('.lite-dot').first()).toContainText(/^(pn|wt|śr|cz|pt|sb|nd)/);
  await expect(st.locator('h3')).toHaveText('Twój stan');
  await expect(st.locator('.lite-dot')).toHaveCount(7);
  await expect(st.locator('.lite-dot.on')).toHaveCount(4); // 3 dni ze scenariusza i dziś
  await expect(st).toContainText('Szybki wpis w 4 z 7 dni');
  await expect(st.locator('p', { hasText: 'Samopoczucie:' })).toHaveText('Samopoczucie: Dobrze 3 dni · Brzuch 1 dzień');
  await expect(st).toContainText('0 razy 2 dni · 1 raz 1 dzień · 2 lub więcej 1 dzień');
  await expect(st).toContainText(/Sen średnio \d h/);
  await expect(st.locator('svg.wp-spark .wp-zone')).toHaveCount(1);
  await expect(st).toContainText('Seria: ');
  await expect(st).toContainText('Co dalej: Dodać wagę?');
  const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, r: document.querySelector('#lite').getBoundingClientRect().right,
    t: [...document.querySelectorAll('#lite button')].map((b) => { const r = b.getBoundingClientRect(); return { h: r.height, w: r.width, fit: b.scrollWidth <= b.clientWidth + 1 }; }) }));
  expect(o.sw).toBeLessThanOrEqual(o.cw);
  expect(o.r).toBeLessThanOrEqual(o.cw);
  for (const b of o.t) { expect(b.h).toBeGreaterThanOrEqual(44); expect(b.w).toBeGreaterThanOrEqual(44); expect(b.fit).toBe(true); }
  await see.click();
  await expect(st).toBeHidden();
  await expect(see).toHaveAttribute('aria-expanded', 'false');
  expect(errors).toEqual([]);
});

test('stan: Zmień rozwija kontrolki z wyborami, fokus na krokach; Gotowe zwija z powrotem', async ({ page }) => {
  const errors = await open(page);
  await fill(page);
  await page.locator('[data-liteedit]').click();
  await expect(page.locator('[data-lite="feel:dobrze"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-lite="redz:0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#q_steps')).toHaveText(/^5\s050$/);
  await expect(page.locator('#q_steps')).toBeFocused();
  await page.locator('[data-lite="redz:1"]').click();
  await expect(page.locator('[data-lite="redz:1"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-litedone]').click();
  await expect(page.locator('#lite')).toContainText('Jedzenie kaloryczne 1');
  await expect(page.locator('#lite_see')).toBeFocused();
  expect(errors).toEqual([]);
});
