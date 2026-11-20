// Prosty start (19.11.2026): karta „Szybki wpis dnia” w scenariuszu #demo-prosty przy 320 px.
const { test, expect } = require('@playwright/test');
// Słowa w kafelkach: każde słowo w jednej linii (przeglądarki nie dzielą polskich wyrazów, więc pęknięcie słowa byłoby bez łącznika)
const splitWords = (page, sel) => page.evaluate((sel) => {
  const out = [];
  for (const t of document.querySelectorAll(sel)) {
    if (!t.offsetParent) continue;
    const host = t.querySelector('.lbl > span') || t;
    const walk = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      const re = /\S+/g; let m;
      while ((m = re.exec(n.data))) { const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length); const tops = new Set([...r.getClientRects()].map((x) => Math.round(x.top))); if (tops.size > 1) out.push(m[0]); }
    }
  }
  return out;
}, sel);

async function open(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/index.html#demo-prosty');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object' && S.lite === true);
  await page.evaluate(() => { SHEET = false; render(); });
  return errors;
}

test('prosty: karta bez poziomego przewijania, kafelki co najmniej 48 px, tekst w obrębie kafelka', async ({ page }) => {
  const errors = await open(page);
  const card = page.locator('#lite');
  await expect(card).toBeVisible();
  const o = await page.evaluate(() => {
    const chips = [...document.querySelectorAll('#lite .chip')].map((c) => {
      const r = c.getBoundingClientRect(), range = document.createRange(); range.selectNodeContents(c);
      const lines = new Set([...range.getClientRects()].map((x) => Math.round(x.top))).size;
      return { t: c.textContent, h: r.height, lines, fit: c.scrollWidth <= c.clientWidth + 1 };
    });
    return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, r: document.querySelector('#lite').getBoundingClientRect().right, chips };
  });
  expect(o.cw).toBe(320);
  expect(o.sw).toBeLessThanOrEqual(o.cw);
  expect(o.r).toBeLessThanOrEqual(o.cw);
  expect(o.chips.length).toBe(7); // kroki to suwak (runda 2), żetony: samopoczucie 4 i jedzenie kaloryczne 3
  for (const c of o.chips) { expect(c.h, c.t).toBeGreaterThanOrEqual(47.5); expect(c.lines, c.t).toBeLessThanOrEqual(3); expect(c.fit, c.t).toBe(true); }
  expect(await splitWords(page, '#main .chip, #main .seg button'), 'słowo pęknięte w kafelku').toEqual([]);
  expect(errors).toEqual([]);
});

test('prosty: kroki to wiersz z suwakiem 0-20 000 co 50 (siatka 500 przy szybkim przesunięciu); dzień liczy się dopiero po dotknięciu; zapis po puszczeniu suwaka z fokusem na suwaku', async ({ page }) => {
  const errors = await open(page);
  const v = page.locator('#q_steps'), r = page.locator('#q_rsteps');
  await expect(v).toHaveText(/^5\s000$/);
  await expect(v).toHaveClass(/wp-y/);
  await expect(r).toHaveAttribute('min', '0'); await expect(r).toHaveAttribute('max', '20000'); await expect(r).toHaveAttribute('step', '50');
  expect(await page.evaluate(() => (S.meas[todayKey()] || {}).steps)).toBeUndefined();
  await r.focus();
  await r.fill('7500');
  await expect(v).toHaveText(/^7\s500$/);
  expect(await page.evaluate(() => S.meas[todayKey()].steps)).toBe('7500');
  await expect(page.locator('#q_rsteps')).toBeFocused();
  await expect(page.locator('#q_rsteps')).toHaveAttribute('aria-valuetext', /7\s500 kroków/);
  await page.locator('#q_steps').click();
  await page.keyboard.type('8732');
  await page.keyboard.press('Enter');
  expect(await page.evaluate(() => S.meas[todayKey()].steps)).toBe('8732');
  await expect(page.locator('#q_steps')).toBeFocused();
  expect(errors).toEqual([]);
});

test('prosty: propozycja Dodać wagę? widoczna', async ({ page }) => {
  const errors = await open(page);
  await expect(page.locator('#main')).toContainText('Dodać wagę?');
  expect(errors).toEqual([]);
});

test('prosty: szybki wpis (kroki suwakiem, samopoczucie, jedzenie) zwija kartę; Zmień pokazuje Dzień zapisany i aria-pressed', async ({ page }) => {
  const errors = await open(page);
  await page.getByRole('button', { name: '50 kroków więcej' }).click();
  for (const f of ['feel:dobrze', 'redz:0']) await page.locator(`[data-lite="${f}"]`).click();
  await expect(page.locator('#lite')).toContainText('✓ Zapisane na dziś:'); // pełna karta zwija się (stan.spec.js); Zmień pokazuje wybory
  await page.locator('[data-liteedit]').click();
  await expect(page.locator('#lite')).toContainText('✓ Dzień zapisany.');
  for (const f of ['feel:dobrze', 'redz:0']) await expect(page.locator(`[data-lite="${f}"]`)).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => S.meas[todayKey()].steps)).toBe('5050');
  expect(errors).toEqual([]);
});

// Runda 3: dotknięcie suwaka bez przesunięcia (pointerdown + pointerup bez zmiany wartości) nie zapisuje wartości typowej
const tap = (page, sel) => page.evaluate((sel) => { const r = document.querySelector(sel), o = { bubbles: true, pointerId: 1, isPrimary: true }; r.dispatchEvent(new PointerEvent('pointerdown', o)); r.dispatchEvent(new PointerEvent('pointerup', o)); }, sel);
test('prosty: dotknięcie suwaka kroków bez przesunięcia: typowa 5000 nie zapisuje się; ostatnia zapisuje się jako kopia z komunikatem', async ({ page }) => {
  const errors = await open(page);
  await tap(page, '#q_rsteps');
  await page.waitForTimeout(100);
  expect(await page.evaluate(() => (S.meas[todayKey()] || {}).steps)).toBeUndefined();
  await expect(page.locator('#q_hsteps')).toHaveText('przesuń, żeby wpisać');
  await page.evaluate(() => { S.meas[nAgo(1)] = Object.assign({}, S.meas[nAgo(1)], { steps: '7431' }); render(); });
  await expect(page.locator('#q_steps')).toHaveText(/^7\s431$/);
  await tap(page, '#q_rsteps');
  await expect.poll(() => page.evaluate(() => (S.meas[todayKey()] || {}).steps)).toBe('7431');
  expect(await page.evaluate(() => S.meas[todayKey()].cp)).toEqual(['steps']);
  await expect(page.locator('#sr')).toHaveText(/^Zapisano jak ostatnio: 7\s431$/);
  expect(errors).toEqual([]);
});

// Runda końcowa: pole wpisu kroków otwarte i zamknięte bez zmiany nie zapisuje wartości typowej; ostatnią zapisuje jako kopię
test('prosty: pole wpisu kroków bez zmiany: bez historii nic nie zapisuje; z historią zapisuje ostatnią jako kopię z komunikatem', async ({ page }) => {
  const errors = await open(page);
  await page.locator('#q_steps').click();
  await expect(page.locator('#q_in')).toBeFocused();
  await page.evaluate(() => document.activeElement.blur());
  await page.waitForTimeout(100);
  expect(await page.evaluate(() => (S.meas[todayKey()] || {}).steps)).toBeUndefined();
  await page.locator('#q_steps').click();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(100);
  expect(await page.evaluate(() => (S.meas[todayKey()] || {}).steps)).toBeUndefined();
  await page.evaluate(() => { S.meas[nAgo(1)] = Object.assign({}, S.meas[nAgo(1)], { steps: '7431' }); render(); });
  await page.locator('#q_steps').click();
  await page.evaluate(() => document.activeElement.blur());
  await expect.poll(() => page.evaluate(() => (S.meas[todayKey()] || {}).steps)).toBe('7431');
  expect(await page.evaluate(() => S.meas[todayKey()].cp)).toEqual(['steps']);
  await expect(page.locator('#sr')).toHaveText(/^Zapisano jak ostatnio: 7\s431$/);
  expect(errors).toEqual([]);
});
