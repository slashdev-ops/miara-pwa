// Miara w prawdziwej przeglądarce: błędy strony i CSP, szerokość ekranu, kontrast z wyliczonych kolorów (WCAG 1.4.3, 1.4.11),
// zaznaczanie wartości w polu, kopia bez danych o zdrowiu, praca bez sieci. Uruchomienie: npm test (w tym katalogu).
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..', '..');
const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const CSP = vercel.headers.flatMap((h) => h.headers).find((h) => h.key === 'Content-Security-Policy').value
  // upgrade-insecure-requests pominięte: WebKit przenosi wtedy lokalne http://127.0.0.1 na https; produkcja działa na https
  .split(';').map((d) => d.trim()).filter((d) => d && d !== 'upgrade-insecure-requests').join('; ');
const VIEWS = ['meals', 'train', 'day', 'health', 'set', 'sos', 'labs', 'review', 'knee', 'impact', 'challenge', 'pet', 'krok'];
const MAIN = ['meals', 'train', 'day', 'health', 'set', 'pet'];

// Nagłówek CSP jak na Vercelu; błędy strony, konsoli i naruszenia CSP zbierane do sprawdzenia na końcu testu
async function open(page, hash = '#demo-pokaz') {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('konsola: ' + m.text()); });
  await page.addInitScript(() => document.addEventListener('securitypolicyviolation', (e) => console.error('CSP: ' + e.violatedDirective + ' ' + e.blockedURI)));
  await page.route('**/*', async (route) => {
    const res = await route.fetch();
    await route.fulfill({ response: res, headers: { ...res.headers(), 'content-security-policy': CSP } });
  });
  await page.goto('/index.html' + hash);
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  return errors;
}
const show = (page, tab) => page.evaluate((t) => { S.tab = t; render(); window.scrollTo(0, 0); }, tab);

// Kontrast liczony w stronie: kolor przez canvas (obsługuje rgb, color(srgb …), color-mix), tło z najbliższego
// nieprzezroczystego przodka; element z gradientem, obrazem albo półprzezroczystością po drodze jest pomijany.
const CONTRAST_JS = () => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true });
  const rgba = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const lum = (c) => { const v = c.slice(0, 3).map((x) => x / 255).map((x) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4))); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const bgOf = (el) => {
    for (let e = el; e; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.backgroundImage !== 'none' || Number(s.opacity) < 1) return null;
      const c = rgba(s.backgroundColor);
      if (c[3] === 1) return c;
      if (c[3] > 0) return null;
    }
    return rgba(getComputedStyle(document.body).backgroundColor);
  };
  const visible = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
  return { rgba, ratio, bgOf, visible };
};

test('każdy widok bez błędów strony i CSP, bez przewijania w poziomie', async ({ page }) => {
  const errors = await open(page);
  const wide = [];
  for (const v of VIEWS) {
    await show(page, v);
    const w = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
    if (w[0] > w[1]) wide.push(`${v}: ${w[0]} > ${w[1]}`);
  }
  expect(wide, 'przewijanie w poziomie').toEqual([]);
  expect(errors, 'błędy strony').toEqual([]);
});

test('tekst ma kontrast co najmniej 4,5:1 (duży 3:1) na głównych ekranach', async ({ page }) => {
  const errors = await open(page);
  const bad = [];
  for (const v of MAIN) {
    await show(page, v);
    const found = await page.evaluate((src) => {
      const { rgba, ratio, bgOf, visible } = eval(src)();
      const out = [];
      for (const el of document.querySelectorAll('body *')) {
        if (!visible(el) || el.closest('svg,[aria-hidden="true"],:disabled')) continue;
        const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (!own) continue;
        const s = getComputedStyle(el), bg = bgOf(el);
        if (!bg) continue;
        const fg = rgba(s.color);
        if (fg[3] < 1) continue;
        const size = parseFloat(s.fontSize), bold = Number(s.fontWeight) >= 700;
        const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5, r = ratio(fg, bg);
        if (r < need) out.push(`${el.tagName.toLowerCase()}.${el.className} „${el.textContent.trim().slice(0, 30)}” ${r.toFixed(2)}`);
      }
      return out;
    }, `(${CONTRAST_JS})`);
    for (const f of found) bad.push(`${v}: ${f}`);
  }
  expect([...new Set(bad)], 'za słaby kontrast').toEqual([]);
  expect(errors).toEqual([]);
});

test('obramowanie pól co najmniej 3:1 względem tła (WCAG 1.4.11)', async ({ page }) => {
  const errors = await open(page);
  const bad = [];
  for (const v of ['set', 'health', 'train', 'day']) {
    await show(page, v);
    const found = await page.evaluate((src) => {
      const { rgba, ratio, bgOf, visible } = eval(src)();
      const out = [];
      for (const el of document.querySelectorAll('input[type=text],input[type=date],input[type=password],select,textarea')) {
        if (!visible(el)) continue;
        const s = getComputedStyle(el);
        if (parseFloat(s.borderTopWidth) === 0) continue;
        const bg = bgOf(el.parentElement);
        if (!bg) continue;
        const r = ratio(rgba(s.borderTopColor), bg);
        if (r < 3) out.push(`#${el.id || el.tagName.toLowerCase()} ${r.toFixed(2)}`);
      }
      return out;
    }, `(${CONTRAST_JS})`);
    for (const f of found) bad.push(`${v}: ${f}`);
  }
  expect(bad, 'za słabe obramowanie').toEqual([]);
  expect(errors).toEqual([]);
});

test('dotknięcie pola zaznacza wartość, wpis ją zastępuje', async ({ page }) => {
  const errors = await open(page);
  await show(page, 'set');
  const kg = page.locator('#f_kg');
  await kg.scrollIntoViewIfNeeded();
  await kg.click();
  await page.keyboard.type('75');
  await expect(kg).toHaveValue('75');
  expect(errors).toEqual([]);
});

test('kopia bez danych o zdrowiu ma tylko ustawienia, wczytanie nie kasuje danych', async ({ page }) => {
  const errors = await open(page);
  const r = await page.evaluate(() => {
    const keys = Object.keys(JSON.parse(bkBuild(true)).data).sort();
    const before = [S.kg, Object.keys(S.meas).length];
    BK_PENDING = JSON.parse(bkBuild(true)); BK_PENDING.data.discreet = true; S.tab = 'set'; render();
    document.querySelector('[data-bkapply="1"]').click();
    return { keys, before, after: [S.kg, Object.keys(S.meas).length], discreet: S.discreet };
  });
  expect(r.keys).toEqual(['discreet', 'ord', 'pet', 'prices', 'tips', 'toastLen']);
  expect(r.after).toEqual(r.before);
  expect(r.discreet).toBe(true);
  expect(errors).toEqual([]);
});

test.describe('bez sieci', () => {
  test.use({ serviceWorkers: 'allow' });
  test('po pierwszym otwarciu aplikacja działa bez sieci', async ({ page, context }) => {
    await page.goto('/index.html');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    await page.evaluate(() => navigator.serviceWorker.ready);
    await context.setOffline(true);
    await page.reload();
    await expect(page.locator('header h1')).toHaveText(/.+/);
    await context.setOffline(false);
  });
});
