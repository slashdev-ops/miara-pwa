// F0 planu ADHD (22.11.2026): cel dotyku co najmniej 44 × 44 px (WCAG 2.5.5, AAA) dla każdego przycisku, linku, pola, wyboru i nagłówka zwijanej sekcji
// na wszystkich ekranach. Wyjątek ze standardu: link w środku zdania (inline). Pole wyboru w etykiecie: liczy się etykieta.
const { test, expect } = require('@playwright/test');
const TABS = ['day', 'meals', 'train', 'health', 'set', 'labs', 'sos', 'review', 'krok', 'knee', 'mob', 'impact', 'pet', 'help', 'visit'];

test('cele dotyku 44 × 44 px na wszystkich ekranach (poza linkami w zdaniu)', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('/index.html#demo-pokaz');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  const bad = [];
  for (const tab of TABS) {
    await page.evaluate((t) => { SHEET = false; S.lite = false; S.guide = { hidden: true, dataOk: true, seenPet: true }; S.tab = t; render(); document.querySelectorAll('#main details').forEach((d) => { d.open = true; }); }, tab);
    const small = await page.evaluate(() => [...document.querySelectorAll('#main button, #main a[href], #main input:not([type=hidden]), #main select, #main textarea, #main summary, nav.tabs button')]
      .filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; })
      .map((e) => { const t = (e.tagName === 'INPUT' && /checkbox|radio/.test(e.type) && e.closest('label')) ? e.closest('label') : e, r = t.getBoundingClientRect();
        const inline = e.tagName === 'A' && getComputedStyle(e).display === 'inline' && /\S/.test((e.parentElement || {}).textContent.replace(e.textContent, ''));
        return { e: (e.getAttribute('aria-label') || e.textContent || e.id || e.tagName).trim().slice(0, 40), w: Math.round(r.width), h: Math.round(r.height), inline }; })
      .filter((x) => (x.w < 44 || x.h < 44) && !x.inline));
    small.forEach((x) => bad.push(`${tab}: „${x.e}” ${x.w}×${x.h}`));
  }
  expect(bad, bad.join('\n')).toEqual([]);
});
