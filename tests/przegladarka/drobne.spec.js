// Drobne (20.11.2026, plan „Łatwość” pkt 8): „Zjedzone dziś: N× · Usuń” pod „Zjem jeszcze raz”, podpis „cel w przybliżeniu”,
// ustawienie „Przyciski − i + po lewej” (karta i ramki), jezioro w obu motywach. Projekty: jasny i ciemny, iPhone 13 i 320 px.
const { test, expect } = require('@playwright/test');

async function open(page, tab, prep) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('konsola: ' + m.text()); });
  await page.clock.install({ time: new Date('2026-11-20T13:00:00') });
  await page.goto('/index.html#demo-wpisy');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object' && typeof WPISY === 'object');
  await page.clock.pauseAt(new Date('2026-11-20T13:00:10'));
  await page.evaluate((t) => { SHEET = false; S.lite = false; S.once = false; S.toastLen = 'std'; S.guide = { hidden: true, dataOk: true, seenPet: true }; S.tab = t; }, tab);
  if (prep) await page.evaluate(prep);
  await page.evaluate(() => document.fonts.ready.then(() => render()));
  return errors;
}
async function noHScroll(page) { const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth })); expect(o.sw).toBeLessThanOrEqual(o.cw); }
const box = async (loc) => { await loc.scrollIntoViewIfNeeded(); return loc.boundingBox(); };

test('drobne: „Zjedzone dziś: N× · Usuń” pod „Zjem jeszcze raz”; Usuń kasuje ostatni wpis dania, komunikat z Cofnij przywraca', async ({ page }) => {
  const errors = await open(page, 'meals', () => { const id = planIds()[0]; S.days[todayKey()] = [1, 2].map((i) => ({ kind: 'm', id, label: 'wpis ' + i, k: 300, p: 10, f: 5, c: 30 })); });
  const id = await page.evaluate(() => planIds()[0]);
  const line = page.locator(`[data-eatn="${id}"]`), rm = page.locator(`[data-eatrm="${id}"]`);
  await line.scrollIntoViewIfNeeded();
  await expect(line).toBeVisible();
  await expect(line).toContainText('Zjedzone dziś: 2×');
  const b = await rm.boundingBox();
  expect(b.height).toBeGreaterThanOrEqual(24);
  expect(b.width).toBeGreaterThanOrEqual(24);
  await noHScroll(page);
  await rm.click();
  await expect(line).toContainText('Zjedzone dziś: 1×');
  expect(await page.evaluate(() => S.days[todayKey()].map((e) => e.label))).toEqual(['wpis 1']);
  await expect(page.locator('#toast')).toContainText('Cofnij');
  await page.locator('#toast [data-undo]').click();
  expect(await page.evaluate(() => S.days[todayKey()].length)).toBe(2);
  expect(errors).toEqual([]);
});

test('drobne: podpis „cel w przybliżeniu” przy celu kalorii, gdy dane są startowe; znika po wpisaniu własnych', async ({ page }) => {
  const errors = await open(page, 'day', () => { S.touched = {}; S.days[todayKey()] = [{ kind: 'm', id: 'o1', label: 'x', k: 400, p: 20, f: 10, c: 40 }]; });
  const src = page.locator('.stan-row', { hasText: 'Jedzenie' }).locator('.stan-src');
  await src.scrollIntoViewIfNeeded();
  await expect(src).toContainText('cel w przybliżeniu, wpisz wagę, wzrost i wiek');
  await noHScroll(page);
  await page.evaluate(() => { S.touched = { kg: true, cm: true, age: true, goal: true }; render(); });
  await expect(page.locator('.stan-row', { hasText: 'Jedzenie' }).locator('.stan-src')).not.toContainText('w przybliżeniu');
  expect(errors).toEqual([]);
});

test('drobne: „Przyciski − i + po lewej” przestawia grupę w karcie „Dziś” i w ramkach Ustawień, domyślnie po prawej; bez poziomego przewijania', async ({ page }) => {
  const errors = await open(page, 'day', () => { S.pmLeft = false; });
  const row = page.locator('#wp_card .wp-r').first();
  const geo = async (r) => { const l = await box(r.locator('.wp-lab')), p = await box(r.locator('.wp-pm')), v = await box(r.locator('.wp-val')); return { l, p, v }; };
  let g = await geo(row);
  expect(g.p.x).toBeGreaterThan(g.l.x + g.l.width - 1);
  expect(g.p.x).toBeGreaterThan(g.v.x);
  await noHScroll(page);
  await page.evaluate(() => { S.pmLeft = true; render(); });
  expect(await page.evaluate(() => document.documentElement.dataset.pm)).toBe('l');
  g = await geo(page.locator('#wp_card .wp-r').first());
  expect(g.p.x + g.p.width).toBeLessThanOrEqual(g.l.x + 1);
  expect(g.v.x).toBeGreaterThan(g.l.x);
  await noHScroll(page);
  await page.evaluate(() => { S.tab = 'set'; render(); });
  const f = page.locator('.wp-f .wp-r').first();
  g = await geo(f);
  expect(g.p.x + g.p.width).toBeLessThanOrEqual(g.l.x + 1);
  expect(g.v.x).toBeGreaterThan(g.l.x);
  await noHScroll(page);
  await page.evaluate(() => { S.pmLeft = false; render(); });
  g = await geo(page.locator('.wp-f .wp-r').first());
  expect(g.p.x).toBeGreaterThan(g.l.x);
  expect(await page.evaluate(() => document.documentElement.dataset.pm)).toBe('r');
  expect(errors).toEqual([]);
});

test('drobne: jezioro z wiatrem i mgłą rysuje się w obu motywach (gradient strumienia i mgły), bez błędów', async ({ page }) => {
  const errors = await open(page, 'pet', () => { S.pet = { kind: 'kaczka', name: 'Kluska', since: '2026-09-01', stones: ['a', 'b', 'c'], pathSeen: 3 }; });
  for (const w of ['wiatr', 'mgla', '']) {
    await page.evaluate((x) => { document.querySelector('.stones').outerHTML = PET.path(3, x, 'Kluska', 'kaczka', false); }, w);
    const svg = page.locator('.stones svg');
    await svg.scrollIntoViewIfNeeded();
    await expect(svg).toBeVisible();
    if (w === 'mgla') expect(await page.locator('.stones .fog').evaluate((e) => +getComputedStyle(e).opacity)).toBeGreaterThan(0);
  }
  await noHScroll(page);
  expect(errors).toEqual([]);
});
