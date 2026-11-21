// Pola wpisu na telefonie (20.11.2026, z symulacji uzupełniania każdego pola): czcionka co najmniej 16 px w polach i listach wyboru
// (Safari na iPhonie przy mniejszej powiększa stronę po dotknięciu pola), pole wyszukiwania Pomocy z wyglądem pola i celem dotyku ≥ 44 px.
const { test, expect } = require('@playwright/test');

async function open(page, tab, prep) {
  await page.goto('/index.html#demo-wpisy');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  await page.evaluate(([t, p]) => { SHEET = false; S.lite = false; S.once = false; S.guide = { hidden: true, dataOk: true, seenPet: true }; if (p) S.prof = Object.assign({}, S.prof, { cond: Object.assign({}, (S.prof || {}).cond, { pcos: true, gut: true }) }); S.tab = t; render(); document.querySelectorAll('#main details').forEach((d) => { d.open = true; }); }, [tab, prep]);
}
const fields = (page) => page.locator('#main').evaluate((m) => [...m.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]), select, textarea')]
  .filter((e) => e.getBoundingClientRect().height > 0).map((e) => { const s = getComputedStyle(e), r = e.getBoundingClientRect(); return { id: e.id || e.getAttribute('aria-label') || e.tagName, fs: parseFloat(s.fontSize), h: r.height }; }));

for (const tab of ['help', 'health', 'labs', 'set', 'meals', 'day']) {
  test('pola na ekranie ' + tab + ': czcionka ≥ 16 px, wysokość ≥ 44 px', async ({ page }) => {
    await open(page, tab, tab === 'health');
    const F = await fields(page);
    expect(F.length).toBeGreaterThan(0);
    for (const f of F) {
      expect(f.fs, f.id + ': czcionka').toBeGreaterThanOrEqual(16);
      expect(f.h, f.id + ': wysokość').toBeGreaterThanOrEqual(43.5);
    }
  });
}

// Przełączniki i suwaki filtrów (21.11.2026, z symulacji: 31 px i 28 px): obszar dotyku co najmniej 44 × 44 px, wygląd przełącznika bez zmian (tor 51 × 31)
for (const tab of ['set', 'labs', 'meals']) {
  test('przełączniki i suwaki na ekranie ' + tab + ': cel dotyku ≥ 44 px, tor przełącznika 51 × 31', async ({ page }) => {
    await open(page, tab, false);
    const C = await page.locator('#main').evaluate((m) => [...m.querySelectorAll('input.switch, input[type=range]')].filter((e) => e.getBoundingClientRect().height > 0)
      .map((e) => { const r = e.getBoundingClientRect(), s = getComputedStyle(e), bw = parseFloat(s.borderTopWidth) || 0; return { id: e.id || e.getAttribute('aria-label') || e.dataset.k || e.dataset.r, sw: e.classList.contains('switch'), w: r.width, h: r.height, tw: r.width - 2 * bw, th: r.height - 2 * bw }; }));
    expect(C.length).toBeGreaterThan(0);
    for (const c of C) {
      expect(c.h, c.id + ': wysokość celu').toBeGreaterThanOrEqual(43.5);
      expect(c.w, c.id + ': szerokość celu').toBeGreaterThanOrEqual(43.5);
      if (c.sw) { expect(Math.round(c.tw), c.id + ': tor szer.').toBe(51); expect(Math.round(c.th), c.id + ': tor wys.').toBe(31); }
    }
  });
}
