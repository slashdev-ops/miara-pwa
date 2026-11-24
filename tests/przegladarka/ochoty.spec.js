// F2c (23.11.2026): usuwanie ochoty w „Zapisane dziś”. Pokaz nie ma dzisiejszych ochot, więc ogólny test celów dotyku
// nie widzi przycisku usuwania: tu wpisujemy dwie ochoty na dziś i sprawdzamy cel 44 px, fokus po usunięciu i „Cofnij”.
const { test, expect } = require('@playwright/test');

async function zOchotami(page) {
  await page.goto('/index.html#demo-pokaz');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  await page.evaluate(() => {
    SHEET = false; S.lite = false; S.guide = { hidden: true, dataOk: true, seenPet: true };
    S.urges[todayKey()] = [{ h: 9, trig: 'stres', out: 'plan' }, { h: 21, trig: 'nuda', out: 'minela' }];
    S.tab = 'day'; render();
    const f = document.querySelector('[data-fold="zapisane"]'); if (f) f.open = true;
  });
}

test('przycisk usuwania ochoty ma cel dotyku co najmniej 44 × 44 px', async ({ page }) => {
  await zOchotami(page);
  const b = page.locator('[data-delurge]');
  await expect(b).toHaveCount(2);
  for (const r of await b.evaluateAll((L) => L.map((e) => e.getBoundingClientRect()).map((r) => ({ w: r.width, h: r.height })))) {
    expect(r.w).toBeGreaterThanOrEqual(44); expect(r.h).toBeGreaterThanOrEqual(44);
  }
});

test('po usunięciu ochoty fokus zostaje w liście, a „Cofnij” przywraca wpis', async ({ page }) => {
  await zOchotami(page);
  await page.locator('[data-delurge="1"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-delurge]')).toHaveCount(1);
  const gdzie = await page.evaluate(() => { const a = document.activeElement; return a && a !== document.body ? (a.getAttribute('aria-label') || a.textContent || a.tagName).trim() : 'BODY'; });
  expect(gdzie).not.toBe('BODY');
  await page.locator('#toast button', { hasText: 'Cofnij' }).click();
  await expect(page.locator('[data-delurge]')).toHaveCount(2);
  expect(await page.evaluate(() => S.urges[todayKey()].map((u) => u.trig))).toEqual(['stres', 'nuda']);
});

// Rada gotowości 24.11.2026 (P1): po usunięciu jedynej ochoty sekcja „Ochoty” znika; fokus ma zostać w „Zapisane dziś”,
// a strona nie może przeskoczyć na górę (przewinięcie zmienia się najwyżej o tyle, o ile skróciła się strona po zniknięciu bloku „Ochoty”).
test('po usunięciu ostatniej ochoty fokus zostaje w „Zapisane dziś”, bez skoku na górę strony', async ({ page }) => {
  await page.goto('/index.html#demo-pokaz');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  await page.evaluate(() => {
    SHEET = false; S.lite = false; S.guide = { hidden: true, dataOk: true, seenPet: true };
    S.urges[todayKey()] = [{ h: 21, trig: 'nuda', out: 'minela' }]; S.tab = 'day'; render();
    document.querySelector('[data-fold="zapisane"]').open = true;
  });
  const del = page.locator('[data-delurge="0"]');
  await del.focus();
  await del.evaluate((b) => b.scrollIntoView({ block: 'center' }));
  const przed = await page.evaluate(() => ({ y: window.scrollY, h: document.documentElement.scrollHeight }));
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-delurge]')).toHaveCount(0);
  const po = await page.evaluate(() => { const a = document.activeElement; return { y: window.scrollY, h: document.documentElement.scrollHeight, txt: (a.textContent || '').trim(), tag: a.tagName }; });
  expect(po.tag).toBe('SUMMARY');
  expect(po.txt.startsWith('Zapisane dziś')).toBe(true);
  expect(Math.abs(przed.y - po.y)).toBeLessThanOrEqual(przed.h - po.h + 1);
});
