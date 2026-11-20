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
