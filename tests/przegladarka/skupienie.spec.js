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

// F1b (23.11.2026): główna karta zakładki w Skupieniu, reszta w zwiniętym „Więcej na tym ekranie”; Cała Miara bez zmian
async function tab(page, t, focus, prof) {
  await page.evaluate(([tt, f, pr]) => { SHEET = false; S.lite = f; S.focus = f; S.tab = tt; S.guide = { hidden: true, dataOk: true, seenPet: true }; OPEN_F.delete('skupmore-' + tt); if (pr != null) S.prof = { cond: pr ? { hashi: true } : {}, pill: '' }; render(); window.scrollTo(0, 0); }, [t, focus, prof == null ? null : prof]);
}
const shown = (page) => page.evaluate(() => { const m = document.querySelector('#main'); return { words: (m.innerText.match(/\S+/g) || []).length, h2: [...m.querySelectorAll('h2')].filter((h) => (h.checkVisibility ? h.checkVisibility() : h.getClientRects().length > 0)).map((h) => h.textContent.trim()) }; });

for (const [t, title, prof] of [['meals', 'Dziś według planu', null], ['train', 'Trening z zegarka', null], ['health', 'Twój plan', true], ['health', 'Mój profil zdrowia', false]]) {
  test(`skupienie F1b: ${t}${prof === false ? ' bez profilu' : ''}: na wierzchu „${title}”, reszta w „Więcej na tym ekranie”, Cała Miara bez zmian`, async ({ page }) => {
    const errors = await open(page);
    await tab(page, t, false, prof); const full = await shown(page);
    await expect(page.locator('.skup-more')).toHaveCount(0);
    await tab(page, t, true, prof); const foc = await shown(page);
    expect(foc.h2).toEqual([title]);
    console.log(`F1b ${t}${prof === false ? ' bez profilu' : ''}: słowa ${full.words} → ${foc.words}`);
    expect(foc.words, `słowa: Skupienie ${foc.words}, Cała Miara ${full.words}`).toBeLessThanOrEqual(full.words * 0.55);
    const more = page.locator('details.skup-more');
    await expect(more).toHaveCount(1);
    await expect(more).not.toHaveAttribute('open', '');
    await more.locator(':scope > summary').click();
    const opened = await shown(page);
    expect(opened.h2.length).toBe(full.h2.length);
    await page.evaluate(() => render());
    await expect(page.locator('details.skup-more')).toHaveAttribute('open', '');
    const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    expect(o.sw).toBeLessThanOrEqual(o.cw);
    expect(errors).toEqual([]);
  });
}

test('skupienie F1b: przejście do miejsca w zwiniętej sekcji otwiera ją i daje fokus', async ({ page }) => {
  await open(page);
  await tab(page, 'health', true, true);
  const id = await page.evaluate(() => { const el = document.querySelector('details.skup-more [id]:not(details):not(summary)'); return el && el.id; });
  expect(id).toBeTruthy();
  await page.evaluate((x) => { const b = document.createElement('button'); b.dataset.goto = x; b.id = 'tgo'; b.textContent = 'idź'; document.querySelector('#main').prepend(b); }, id);
  await page.locator('#tgo').click();
  await expect(page.locator('details.skup-more')).toHaveAttribute('open', '');
  await expect(page.locator('#' + id)).toBeVisible();
});
