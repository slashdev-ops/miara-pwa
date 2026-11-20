// Mniej tekstu na pierwszy rzut oka (rada 11.11.2026, działania 6-7; plan „Łatwość” 20.11.2026, zadanie 7).
// Słowa widoczne na każdej zakładce (scenariusz #demo-pokaz, #main.innerText bez tekstu tylko dla czytnika .sr; zwinięte sekcje się nie liczą) poniżej progu.
// Pomiar 20.11.2026 (390 px, Chromium), przed → po: Posiłki 413 → 401, Ustawienia 805 → 427, Ruch 535 → 504, Zdrowie 485 → 470, Mój dzień 395 → 378.
// Ruch zostaje blisko 500: opisy ćwiczeń i ostrzeżenie z numerem 112 są potrzebne w trakcie ćwiczeń, więc nie są zwijane.
// Dłuższe wyjaśnienia i źródła są w zwiniętym „Dlaczego?”: zamknięte na starcie, po otwarciu tekst widać.
const { test, expect } = require('@playwright/test');

const VIEWS = ['meals', 'train', 'day', 'health', 'set', 'sos', 'labs', 'review', 'knee', 'impact', 'challenge', 'pet', 'krok', 'mob'];
const LIMIT = 520; // żadna zakładka nie wraca powyżej ok. 500 słów (rada 11.11: Posiłki 857, Ustawienia 819)
const LIMIT_TAB = { set: 460, meals: 440 }; // zakładki z zadania 7: próg z pomiaru po zmianie z zapasem ok. 35 słów

async function open(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('konsola: ' + m.text()); });
  await page.goto('/index.html#demo-pokaz');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  return errors;
}
const words = (page, tab) => page.evaluate((t) => { S.tab = t; render(); window.scrollTo(0, 0);
  const n = (x) => x.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length, m = document.getElementById('main');
  return n(m.innerText) - [...m.querySelectorAll('.sr')].reduce((a, e) => a + n(e.innerText), 0); }, tab);

test('każda zakładka: widocznych słów poniżej progu', async ({ page }) => {
  const errors = await open(page);
  const over = [];
  for (const t of VIEWS) { const n = await words(page, t), max = LIMIT_TAB[t] || LIMIT; if (n > max) over.push(`${t}: ${n} > ${max}`); }
  expect(over).toEqual([]);
  expect(errors).toEqual([]);
});

// Lista kontrolna przeniesionych tekstów: zakładka i fragment, który ma być w „Dlaczego?”, ukryty do otwarcia
const MOVED = [
  ['set', 'Utrzymanie: cel równy zapotrzebowaniu.'],
  ['set', 'NHS: od 23 i 27,5'],
  ['set', 'Dla kobiet zwykle daje niższe wyniki'],
  ['set', 'Fitatu wymienia dane przez Apple Zdrowie'],
  ['set', '2024 Adult Compendium of Physical Activities'],
  ['meals', 'Przy IO (reguła Miary)'],
  ['health', 'Ranking pokaże najtańsze źródła na zakupy.'],
  ['mob', 'Źródło nie podaje liczby powtórzeń'],
];
test('„Dlaczego?”: przeniesiony tekst ukryty do otwarcia, po otwarciu widoczny', async ({ page }) => {
  const errors = await open(page);
  for (const [tab, t] of MOVED) {
    await page.evaluate((x) => { S.tab = x; render(); }, tab);
    const fold = page.locator('#main details.fold', { has: page.locator(':scope > summary', { hasText: /^Dlaczego\?$/ }) }).filter({ hasText: t }).first();
    await expect(fold, `${tab}: ${t}`).toHaveCount(1);
    expect(await fold.evaluate((d) => d.open), `${tab}: zamknięte na starcie`).toBe(false);
    const txt = fold.getByText(t, { exact: false }).first();
    await expect(txt).toBeHidden();
    await fold.locator(':scope > summary').click();
    await expect(txt).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('„Dlaczego?” ma cel dotyku co najmniej 24 px i zostaje otwarte po przerysowaniu', async ({ page }) => {
  const errors = await open(page);
  await page.evaluate(() => { S.tab = 'set'; render(); });
  const sum = page.locator('#main details.fold > summary', { hasText: /^Dlaczego\?$/ }).first();
  const b = await sum.boundingBox();
  expect(b.height).toBeGreaterThanOrEqual(24);
  await sum.click();
  await page.evaluate(() => render());
  expect(await page.locator('#main details.fold', { has: page.locator(':scope > summary', { hasText: /^Dlaczego\?$/ }) }).first().evaluate((d) => d.open)).toBe(true);
  expect(errors).toEqual([]);
});
