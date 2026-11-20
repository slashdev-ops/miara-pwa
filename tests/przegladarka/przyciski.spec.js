// Przyciski, które reagują poza kartą „Dziś” (20.11.2026, plan „Łatwość” pkt 6): Posiłki „Zjem”, Trening „Dodaj do dnia”, Badania „Zapisz wynik”.
// Ten sam automat co karta „Dziś” (WPISY.actBtn): zapis → „✓ … · Cofnij” → po oknie „… jeszcze raz / kolejny / następny”.
// Każdy test: kolejność napisów, drugie dotknięcie w 700 ms nic nie robi, Cofnij usuwa dokładnie dodany wpis, przycisk w tym samym miejscu
// i rozmiarze (±1 px po przejściach CSS), fokus zostaje na przycisku (bez zmiany kontekstu), napis w #sr, 320 px bez poziomego przewijania.
// Projekty z playwright.config.js: jasny i ciemny, iPhone 13 i 320 px. Czas pod kontrolą zegara Playwright (okno „Cofnij” 5 s przy zwykłych komunikatach).
const { test, expect } = require('@playwright/test');

async function open(page, tab, prep) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('konsola: ' + m.text()); });
  await page.clock.install({ time: new Date('2026-11-20T13:00:00') });
  await page.goto('/index.html#demo-wpisy');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object' && typeof WPISY === 'object');
  await page.clock.pauseAt(new Date('2026-11-20T13:00:10')); // czas stoi: dwa dotknięcia trafiają w to samo okno 700 ms
  await page.evaluate((t) => { SHEET = false; S.lite = false; S.once = false; S.toastLen = 'std'; S.guide = { hidden: true, dataOk: true, seenPet: true }; S.tab = t; }, tab);
  if (prep) await page.evaluate(prep);
  await page.evaluate(() => document.fonts.ready.then(() => render())); // czcionki wczytane: kafelki i napisy nie zmieniają już szerokości
  return errors;
}
const settled = (loc) => loc.evaluate((e) => Promise.all(e.ownerDocument.getAnimations().filter((a) => a.effect && a.effect.getComputedTiming().endTime !== Infinity).map((a) => a.finished.catch(() => null))));
const near = (a, b) => !!a && !!b && ['x', 'y', 'width', 'height'].every((k) => Math.abs(a[k] - b[k]) <= 1);
async function expectSameBox(loc, box0, at) {
  await settled(loc); let b = null;
  await expect.poll(async () => near((b = await loc.boundingBox()), box0), { message: 'przycisk w tym samym miejscu i rozmiarze (±1 px)' }).toBe(true).catch(() => { throw new Error((at || '') + ': ' + JSON.stringify(b) + ' zamiast ' + JSON.stringify(box0)); });
}
const label = (btn) => btn.locator('.act-l');
const badge = (page) => page.evaluate(() => { const b = document.querySelector('nav.tabs [data-tab="day"] .badge'); return b ? +b.textContent : 0; });
async function noHScroll(page) { const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth })); expect(o.sw).toBeLessThanOrEqual(o.cw); }
// Wspólny przebieg: zapis, drugie dotknięcie, Cofnij, ponowny zapis, koniec okna
async function cycle(page, btn, L, o) {
  await btn.scrollIntoViewIfNeeded();
  await settled(btn);
  await expect(label(btn)).toHaveText(L[0]);
  const box0 = await btn.boundingBox(), n0 = await o.count(), b0 = await badge(page);
  await btn.click();
  await expect(label(btn)).toHaveText(L[1]);
  await expect(btn).toBeFocused();
  await expect(page.locator('#sr')).toHaveText(new RegExp('^' + L[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  expect(await o.count()).toBe(n0 + 1);
  if (o.badge) expect(await badge(page)).toBe(b0 - 1); // licznik na zakładce od razu
  await expectSameBox(btn, box0, 'zapis');
  await btn.click(); // drugie dotknięcie zaraz po zapisie: nic nie cofa
  await expect(label(btn)).toHaveText(L[1]);
  expect(await o.count()).toBe(n0 + 1);
  await page.clock.runFor(1000);
  await btn.click(); // Cofnij
  await expect(label(btn)).toHaveText(L[0]);
  await expect(btn).toBeFocused();
  await expect(page.locator('#sr')).toHaveText(new RegExp('^' + L[0]));
  expect(await o.count()).toBe(n0);
  if (o.badge) expect(await badge(page)).toBe(b0);
  if (o.afterUndo) await o.afterUndo();
  await expectSameBox(btn, box0, 'cofnij');
  if (o.refill) await o.refill();
  await btn.click();
  await expect(label(btn)).toHaveText(L[1]);
  await page.clock.runFor(5100); // koniec okna „Cofnij”: napis zmieniony w miejscu
  await expect(label(btn)).toHaveText(L[2]);
  await expect(btn).toBeFocused();
  expect(await o.count()).toBe(n0 + 1);
  await expectSameBox(btn, box0, 'po oknie');
  await noHScroll(page);
}

test('przyciski: Posiłki „Zjem” → „✓ Zjedzone · Cofnij” → „Zjem jeszcze raz”, licznik na zakładce od razu, Cofnij usuwa dokładnie dodany wpis', async ({ page }) => {
  const errors = await open(page, 'meals', () => { S.days[todayKey()] = [{ kind: 'm', label: 'inne 1', k: 300, p: 10, f: 5, c: 30 }, { kind: 'm', label: 'inne 2', k: 300, p: 10, f: 5, c: 30 }]; });
  const id = await page.locator('.prow [data-addmeal]').first().getAttribute('data-addmeal');
  const btn = page.locator(`.prow [data-addmeal="${id}"]`);
  const count = { count: () => page.evaluate((i) => (S.days[todayKey()] || []).filter((e) => e.id === i).length, id) };
  await cycle(page, btn, ['Zjem', '✓ Zjedzone · Cofnij', 'Zjem jeszcze raz'], { ...count, badge: true });
  expect(await page.evaluate(() => S.days[todayKey()].slice(0, 2).map((e) => e.label))).toEqual(['inne 1', 'inne 2']);
  expect((await btn.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await expect(page.locator('#toast')).not.toContainText('Dodano do dnia');
  expect(errors).toEqual([]);
});

test('przyciski: Trening „Dodaj do dnia” → „✓ Zapisano · Cofnij” → „Dodaj kolejny”, licznik na zakładce od razu, Cofnij usuwa dokładnie dodany wpis', async ({ page }) => {
  const errors = await open(page, 'train', () => { S.days[todayKey()] = []; S.meas[todayKey()] = {}; S.tr.min = '45'; S.tr.cat = 'silownia'; });
  const btn = page.locator('[data-addtrain="1"]');
  await cycle(page, btn, ['Dodaj do dnia', '✓ Zapisano · Cofnij', 'Dodaj kolejny'], { count: () => page.evaluate(() => (S.days[todayKey()] || []).filter((e) => e.kind === 't').length), badge: true });
  // zegarek: ten sam automat; nowy zapis kończy okno „Dodaj do dnia”
  await page.evaluate(() => { S.tr.wmin = '45'; S.tr.wk = '400'; render(); });
  const w = page.locator('[data-addwatch="1"]');
  await w.scrollIntoViewIfNeeded();
  await expect(label(w)).toHaveText('Dodaj trening z zegarka');
  await w.click();
  await expect(label(w)).toHaveText('✓ Zapisano · Cofnij');
  await expect(label(btn)).toHaveText('Dodaj kolejny');
  await page.clock.runFor(1000);
  await w.click();
  await expect(label(w)).toHaveText('Dodaj trening z zegarka');
  expect(await page.evaluate(() => ({ n: S.days[todayKey()].length, wk: S.tr.wk }))).toEqual({ n: 1, wk: '400' });
  expect(errors).toEqual([]);
});

test('przyciski: Badania „Zapisz wynik” → „✓ Zapisano · Cofnij” → „Dodaj następny wynik” z tą samą datą i jednostką', async ({ page }) => {
  const errors = await open(page, 'labs', () => { S.labs = []; S.labSel = 'tsh'; });
  const btn = page.locator('[data-labsave="1"]');
  // Wpis bez przewijania (fill przewija do pola, a pomiar położenia przycisku liczy się od pierwszego zapisu)
  const fill = () => page.evaluate(() => { document.getElementById('l_val').value = '2,5'; document.getElementById('l_date').value = '2026-11-10'; document.getElementById('l_unit').value = 'mIU/ml'; });
  await fill();
  await cycle(page, btn, ['Zapisz wynik', '✓ Zapisano · Cofnij', 'Dodaj następny wynik'], {
    count: () => page.evaluate(() => S.labs.length),
    afterUndo: async () => { await expect(page.locator('#l_val')).toHaveValue('2,5'); },
    refill: fill,
  });
  await expect(page.locator('#l_date')).toHaveValue('2026-11-10');
  await expect(page.locator('#l_unit')).toHaveValue('mIU/ml');
  await expect(page.locator('#l_val')).toHaveValue('');
  expect(await page.evaluate(() => S.labs.map((e) => [e.date, e.val, e.unit]))).toEqual([['2026-11-10', '2.5', 'mIU/ml']]);
  expect(errors).toEqual([]);
});
