// Mój dzień (18.11.2026): pasek „następny krok” mieści się w zaokrąglonej ramce; przy wpisie dolne menu nie zasłania pola nad klawiaturą.
const { test, expect } = require('@playwright/test');

async function openDay(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  await page.goto('/index.html');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  await page.evaluate(() => { S.onb = true; S.lite = false; S.tab = 'day'; render(); window.scrollTo(0, 0); });
  return errors;
}

// Prostokąt paska: cień wewnętrzny na wierszu (cała wysokość) albo pseudo-element ::before wiersza
const barOf = (page) => page.evaluate(() => {
  const row = document.querySelector('.opt.hab.next'), pan = row && row.closest('.panel');
  if (!row || !pan) return null;
  const rr = row.getBoundingClientRect(), pr = pan.getBoundingClientRect(), r = parseFloat(getComputedStyle(pan).borderTopLeftRadius);
  const sh = getComputedStyle(row).boxShadow, be = getComputedStyle(row, '::before');
  let top = null, bottom = null;
  if (sh && sh !== 'none' && sh.includes('inset')) { top = rr.top; bottom = rr.bottom; }
  else if (be.content && be.content !== 'none' && be.display !== 'none') { const t = parseFloat(be.top), h = parseFloat(be.height); top = rr.top + t; bottom = top + h; }
  return { top, bottom, pTop: pr.top, pBottom: pr.bottom, r, first: row === pan.firstElementChild, last: row === pan.lastElementChild };
});

test('pasek następnego kroku nie wychodzi poza zaokrąglony róg ramki', async ({ page }) => {
  const errors = await openDay(page);
  const b = await barOf(page);
  expect(b, 'wiersz „następny krok” w ramce').not.toBeNull();
  expect(b.top, 'pasek jest widoczny').not.toBeNull();
  // Pasek leży przy lewej krawędzi (x = 1 px od zewnętrznej krawędzi ramki): łuk rogu kończy się tam r - sqrt(r² - (r - 1)²) px od góry
  const edge = b.r - Math.sqrt(b.r * b.r - (b.r - 1) * (b.r - 1));
  expect(b.top - b.pTop, 'od góry ramki').toBeGreaterThanOrEqual(edge);
  expect(b.pBottom - b.bottom, 'od dołu ramki').toBeGreaterThanOrEqual(edge);
  expect(errors).toEqual([]);
});

test('wpis wagi z „Zważ się rano”: dolne menu znika na czas wpisu i wraca po nim', async ({ page }) => {
  const errors = await openDay(page);
  const nav = page.locator('nav.tabs');
  await expect(nav).toBeVisible();
  await page.locator('.opt.hab[data-goto="m_w"]').click();
  await expect(page.locator('#m_w')).toBeFocused();
  // Karta „Dziś” (20.11.2026): #m_w to przycisk wartości; Enter albo dotknięcie otwiera pole wpisu w miejscu wartości
  await page.keyboard.press('Enter');
  await expect(page.locator('#wp_in')).toBeFocused();
  await expect(nav, 'menu nie zasłania pola nad klawiaturą').toBeHidden();
  await page.evaluate(() => document.activeElement.blur());
  await expect(nav, 'menu wraca po wyjściu z pola').toBeVisible();
  // Przełącznik (checkbox) nie otwiera klawiatury, więc menu zostaje
  await page.evaluate(() => { S.tab = 'set'; render(); });
  const sw = page.locator('input[type="checkbox"]').first();
  await sw.focus();
  await expect(nav).toBeVisible();
  expect(errors).toEqual([]);
});
