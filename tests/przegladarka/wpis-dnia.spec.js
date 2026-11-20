// Wpis dnia (tryb „raz dziennie”, 20.11.2026): przyciski „Według planu” i „Inaczej” w wierszu Posiłki.
// Zgłoszenie: napis przycisku planu niewidoczny (klasa .act przycisku dziedziczyła wygląd karty .act: tło karty, odstęp 16 px, margines),
// „Inaczej” dochodził do krawędzi ekranu. Sprawdzane: kontrast napisu z tłem przycisku ≥ 4,5:1, oba przyciski w panelu z odstępem,
// ten sam wygląd co zwykły przycisk, 320 px bez poziomego przewijania; projekty jasny i ciemny z playwright.config.js.
const { test, expect } = require('@playwright/test');

async function open(page) {
  await page.goto('/index.html#demo-wpisy');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  await page.evaluate(() => { SHEET = false; S.lite = false; S.once = true; S.guide = { hidden: true, dataOk: true, seenPet: true }; S.tab = 'day'; const k = todayKey(); S.days[k] = (S.days[k] || []).filter((e) => e.kind !== 'm'); });
  await page.evaluate(() => document.fonts.ready.then(() => render()));
}
const lum = (c) => { const m = c.match(/[\d.]+/g).slice(0, 3).map(Number).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

test('Wpis dnia: „Według planu” czytelny, wygląda jak zwykły przycisk, obok „Inaczej” w panelu', async ({ page }) => {
  await open(page);
  const plan = page.locator('[data-dayplan]'), other = page.locator('[data-dayother]');
  await expect(plan.locator('.act-l')).toHaveText('Według planu');
  const st = await plan.evaluate((e) => { const s = getComputedStyle(e), r = getComputedStyle(document.querySelector('.btn:not(.act):not(.ghost)') || e); return { bg: s.backgroundColor, fg: s.color, pad: s.paddingTop, mt: s.marginTop, shadow: s.boxShadow, refBg: r.backgroundColor }; });
  expect(st.bg, 'tło przycisku nieprzezroczyste').not.toMatch(/rgba\(0, 0, 0, 0\)|transparent/);
  expect(ratio(st.fg, st.bg), 'kontrast napisu ' + st.fg + ' na ' + st.bg).toBeGreaterThanOrEqual(4.5);
  expect(st.mt, 'bez marginesu karty').toBe('0px');
  expect(st.pad, 'odstęp jak .btn.small').toBe('8px');
  const panel = await page.locator('.step', { has: plan }).boundingBox(), a = await plan.boundingBox(), b = await other.boundingBox();
  expect(b.x + b.width, '„Inaczej” w wierszu, nie przy krawędzi').toBeLessThanOrEqual(panel.x + panel.width + 0.5);
  const row = Math.abs((a.y + a.height / 2) - (b.y + b.height / 2)) <= 2; // obok siebie albo (wąski ekran, inne czcionki) „Inaczej” pod spodem
  if (row) expect(a.x + a.width + 4, 'odstęp między przyciskami w wierszu').toBeLessThanOrEqual(b.x + 0.5);
  else expect(b.y, '„Inaczej” pod „Według planu”, bez nachodzenia').toBeGreaterThanOrEqual(a.y + a.height + 4 - 0.5);
  expect(b.x, '„Inaczej” nie wychodzi w lewo poza panel').toBeGreaterThanOrEqual(panel.x - 0.5);
  const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  expect(o.sw).toBeLessThanOrEqual(o.cw);
  await page.locator('.step', { has: plan }).screenshot({ path: test.info().outputPath('wpis-dnia.png') });
});

test('Reagujące przyciski (Zjem) nie dziedziczą wyglądu karty .act: czytelny napis, bez marginesu i cienia karty', async ({ page }) => {
  await open(page);
  await page.evaluate(() => { S.once = false; S.tab = 'meals'; render(); });
  const btns = page.locator('#main button[data-ab]');
  expect(await btns.count()).toBeGreaterThan(0);
  const all = await btns.evaluateAll((L) => L.map((e) => { const s = getComputedStyle(e); return { t: e.textContent, bg: s.backgroundColor, fg: s.color, mt: s.marginTop }; }));
  for (const s of all) {
    expect(ratio(s.fg, s.bg), s.t + ': kontrast ' + s.fg + ' na ' + s.bg).toBeGreaterThanOrEqual(4.5);
    expect(s.mt, s.t + ': bez marginesu karty').toBe('0px');
  }
});
