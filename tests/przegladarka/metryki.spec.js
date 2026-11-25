// Inne kroje pisma (CI na Linuksie, 20.11.2026): bez Segoe UI przeglądarka bierze szerszy krój bezszeryfowy (np. DejaVu Sans).
// Telefon z innym krojem albo większym tekstem trafia na to samo, więc układ nie może zależeć od metryk jednego systemu.
// Tutaj szeroki krój wymuszony stylem (Verdana na Windows, DejaVu Sans na Linuksie), oprócz kroju domyślnego.
const { test, expect } = require('@playwright/test');

test.beforeEach(({}, info) => { test.skip(!/-jasny$/.test(info.project.name), 'szerokość i krój ustawia sam test'); });

// DejaVu Sans (CI na Linuksie) jest szerszy od Verdany: na Windows szersze znaki symuluje dodatkowy odstęp liter
const FONTS = ['', '"Verdana","DejaVu Sans",sans-serif', '"Trebuchet MS","DejaVu Sans",sans-serif', 'Arial,"Liberation Sans",sans-serif', '"Verdana","DejaVu Sans",sans-serif;letter-spacing:.05em'];
async function open(page, w, font) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  await page.setViewportSize({ width: w, height: 844 });
  await page.goto('/index.html#demo-pokaz');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  if (font) await page.addStyleTag({ content: `body{font-family:${font}}` });
  return errors;
}
const noHScroll = (page) => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);

for (const font of FONTS) {
  test(`krój ${font || 'domyślny'}: 320 px bez przewijania w bok na każdej zakładce i na ekranie startowym`, async ({ page }) => {
    const errors = await open(page, 320, font);
    const bad = [];
    for (const t of ['day', 'meals', 'train', 'health', 'set', 'labs', 'intro']) {
      await page.evaluate((x) => { if (x === 'intro') { S.onb = false; S.introStep = 0; } S.tab = x; SHEET = false; render(); }, t);
      if (!(await noHScroll(page))) bad.push(t + ': ' + (await page.evaluate(() => document.documentElement.scrollWidth)));
    }
    expect(bad).toEqual([]);
    expect(errors).toEqual([]);
  });

  // Osobny test na szerokość i jedno wywołanie strony na pomiar: przy pełnym przebiegu WebKit jeden test na obie szerokości przekraczał 60 s
  for (const w of [390, 320]) test(`krój ${font || 'domyślny'}: wpis w wierszu wartości nie przesuwa etykiety ani wartości (${w} px)`, async ({ page }) => {
    const errors = await open(page, w, font);
    await page.evaluate(() => { S.tab = 'day'; S.lite = false; SHEET = false; OPEN_F.add('obwody'); OPEN_F.add('tanita'); OPEN_F.add('sprawnosc'); render(); });
    const ids = await page.evaluate(() => [...document.querySelectorAll('#main .wp-f button.wp-val')].map((b) => b.id));
    expect(ids.length).toBeGreaterThan(10);
    await page.evaluate(() => { window.__pos = (e) => { const row = e.closest('.wp-r'), l = row.querySelector('.wp-lab'); return { v: Math.round(e.getBoundingClientRect().top), l: Math.round(l.getBoundingClientRect().top), h: Math.round(row.getBoundingClientRect().height) }; }; });
    for (const id of ids) {
      const a = await page.evaluate((i) => { const e = document.getElementById(i); e.scrollIntoView({ block: 'center' }); return window.__pos(e); }, id);
      // force: element jest już przewinięty i zmierzony; pod obciążeniem WebKit potrafi nie dać klatki przez ponad 5 s (sonda 25.11.2026:
      // 0 wywołań requestAnimationFrame przy visibilityState „visible”), a sprawdzanie stabilności Playwright czeka na klatki. Test mierzy układ, nie klikalność.
      await page.locator(`[id="${id}"]`).click({ force: true });
      const b = await page.evaluate(() => window.__pos(document.querySelector('.wp-in')));
      await page.keyboard.press('Escape');
      expect(Math.abs(b.v - a.v), `${w} px ${id}: wartość po otwarciu wpisu`).toBeLessThanOrEqual(2);
      expect(Math.abs(b.l - a.l), `${w} px ${id}: etykieta po otwarciu wpisu`).toBeLessThanOrEqual(2);
      expect(Math.abs(b.h - a.h), `${w} px ${id}: wysokość wiersza`).toBeLessThanOrEqual(2);
    }
    expect(errors).toEqual([]);
  });
}

// Zdarzenie toggle przychodzi po kliknięciu w osobnym zadaniu; przerysowanie w tym samym zadaniu nie może zwinąć sekcji
test('„Dlaczego?” otwarte kliknięciem zostaje otwarte, gdy przerysowanie przychodzi przed zdarzeniem toggle', async ({ page }) => {
  const errors = await open(page, 390, '');
  const open1 = await page.evaluate(() => { S.tab = 'set'; render(); const s = [...document.querySelectorAll('#main details.fold > summary')].find((x) => x.textContent === 'Dlaczego?'), f = s.parentElement.dataset.fold; s.click(); render(); return { f, open: document.querySelector(`#main details[data-fold="${f}"]`).open }; });
  expect(open1.open, open1.f).toBe(true);
  const close1 = await page.evaluate((f) => { const d = document.querySelector(`#main details[data-fold="${f}"]`); d.querySelector(':scope > summary').click(); render(); return document.querySelector(`#main details[data-fold="${f}"]`).open; }, open1.f);
  expect(close1).toBe(false);
  expect(errors).toEqual([]);
});
