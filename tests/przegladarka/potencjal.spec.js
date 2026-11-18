// Karta „Potencjał mięśniowy” w Zdrowiu (18.11.2026): bez przewijania w poziomie, SVG z opisem, kontrast tekstu osi.
// Testy kart wpisują dane wymyślone do stanu po otwarciu trybu pokazowego; ostatni test otwiera scenariusz #demo-sport-m.
const { test, expect } = require('@playwright/test');

async function open(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  await page.goto('/index.html#demo-pokaz');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  await page.evaluate(() => {
    S.sex = 'M'; S.cm = '180'; S.touched = { ...(S.touched || {}), cm: true };
    S.frame = { wrist: '17,5', ankle: '22,5' };
    S.meas = S.meas || {};
    S.meas[todayKey()] = { ...(S.meas[todayKey()] || {}), ffm: '70', fat: '12' };
    S.tab = 'health'; SHEET = false; render();
  });
  return errors;
}

test('potencjał: karta widoczna, bez przewijania w poziomie, SVG z aria-label', async ({ page }) => {
  const errors = await open(page);
  const card = page.locator('#potencjal');
  await expect(card).toBeVisible();
  const svg = card.locator('svg[role="img"]');
  await expect(svg).toHaveAttribute('aria-label', /.{10,}/);
  await expect(card).toContainText('Pułap FFMI 25 (Kouri 1995)');
  await expect(card).toContainText('Maksimum (Butt)');
  const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, r: document.querySelector('#potencjal').getBoundingClientRect().right }));
  expect(o.sw).toBeLessThanOrEqual(o.cw);
  expect(o.r).toBeLessThanOrEqual(o.cw);
  expect(errors).toEqual([]);
});

test('potencjał: tekst osi i listy ma kontrast co najmniej 4,5:1 wobec tła', async ({ page }) => {
  await open(page);
  const res = await page.evaluate(() => {
    const parse = (c) => { const m = c.match(/[\d.]+/g).map(Number); return { r: m[0], g: m[1], b: m[2], a: m.length > 3 ? m[3] : 1 }; };
    const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const bgOf = (el) => { for (let p = el; p; p = p.parentElement) { const c = parse(getComputedStyle(p).backgroundColor); if (c.a > 0.99) return c; } return parse(getComputedStyle(document.body).backgroundColor); };
    const out = [];
    document.querySelectorAll('#potencjal svg text, #potencjal li, #potencjal p').forEach((el) => {
      if (!(el.textContent || '').trim()) return;
      const fg = parse(getComputedStyle(el).fill && el.namespaceURI.includes('svg') ? getComputedStyle(el).fill : getComputedStyle(el).color);
      const bg = bgOf(el);
      const a = lum(fg), b = lum(bg), cr = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      out.push({ t: el.textContent.trim().slice(0, 30), cr });
    });
    return out;
  });
  expect(res.length).toBeGreaterThan(3);
  for (const x of res) expect(x.cr, x.t).toBeGreaterThanOrEqual(4.5);
});

test('sprawność: karta pod wspólnym nagłówkiem, szacunek z tętna, bez przewijania w poziomie', async ({ page }) => {
  const errors = await open(page);
  await page.evaluate(() => {
    S.age = '30'; S.touched = { ...(S.touched || {}), age: true };
    S.meas[todayKey()] = { ...(S.meas[todayKey()] || {}), hrRest: '60' };
    render();
  });
  await expect(page.locator('#sylwetka')).toHaveText('Sylwetka i sprawność');
  const card = page.locator('#sprawnosc');
  await expect(card).toBeVisible();
  await expect(card).toContainText('szacunek');
  await expect(card).toContainText('błąd około 8%');
  const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  expect(o.sw).toBeLessThanOrEqual(o.cw);
  expect(errors).toEqual([]);
});

test('scenariusz #demo-sport-m: potencjał i sprawność przy 320 px bez przewijania w poziomie', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/index.html#demo-sport-m');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  await page.evaluate(() => { SHEET = false; render(); });
  await expect(page.locator('#potencjal')).toBeVisible();
  await expect(page.locator('#potencjal')).toContainText('Maksimum (Butt)');
  await expect(page.locator('#sprawnosc')).toBeVisible();
  await expect(page.locator('#sprawnosc')).toContainText('wysoka');
  const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, p: document.querySelector('#potencjal').getBoundingClientRect().right, s: document.querySelector('#sprawnosc').getBoundingClientRect().right }));
  expect(o.cw).toBe(320);
  expect(o.sw).toBeLessThanOrEqual(o.cw);
  expect(o.p).toBeLessThanOrEqual(o.cw);
  expect(o.s).toBeLessThanOrEqual(o.cw);
  expect(errors).toEqual([]);
});

test('oś potencjału: etykiety bez nakładania, pismo co najmniej 12 px; tekst Sprawności z marginesem od ramki', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/index.html#demo-sport-m');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  await page.evaluate(() => { SHEET = false; render(); });
  const r = await page.evaluate(() => {
    const svg = document.querySelector('#potencjal svg');
    const T = [...svg.querySelectorAll('text')].map((t) => t.getBoundingClientRect());
    const L = [...svg.querySelectorAll('line.mk')].map((l) => l.getBoundingClientRect());
    let hit = 0;
    for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) { const a = T[i], b = T[j]; if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) hit++; }
    for (const t of T) for (const l of L) { if (l.left > t.left + 1 && l.left < t.right - 1 && l.top < t.bottom - 1 && l.bottom > t.top + 1) hit++; }
    const px = Math.min(...T.map((t) => t.height));
    const pan = document.querySelector('#sprawnosc .panel').getBoundingClientRect();
    const ps = [...document.querySelectorAll('#sprawnosc .panel p')].map((p) => { const range = document.createRange(); range.selectNodeContents(p); const b = range.getBoundingClientRect(); return Math.min(b.left - pan.left, pan.right - b.right); });
    return { hit, px, gap: Math.min(...ps) };
  });
  expect(r.hit).toBe(0);
  expect(r.px).toBeGreaterThanOrEqual(12);
  expect(r.gap).toBeGreaterThanOrEqual(12);
});
