// Kafelki wyboru zamiast pigułek (20.11.2026): .chips i .seg to siatka równych kolumn, kafelek 12 px, min. 48 px,
// wybrany z wypełnieniem, wewnętrznym obrysem 2 px i pogrubieniem; przełączenie nie zmienia rozmiaru kafelka.
const { test, expect } = require('@playwright/test');

// Test sam ustawia szerokość i schemat kolorów, więc wystarczy jedna przeglądarka-projekt na silnik
test.beforeEach(({}, info) => { test.skip(!/-jasny$/.test(info.project.name), 'szerokość i schemat ustawia sam test'); });

async function open(page, hash, w, scheme) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  await page.emulateMedia({ colorScheme: scheme });
  await page.setViewportSize({ width: w, height: 844 });
  await page.goto('about:blank');
  await page.goto('/index.html' + hash);
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  await page.evaluate(() => { SHEET = false; render(); });
  await page.evaluate(() => document.querySelectorAll('details.fold').forEach((d) => { d.open = true; }));
  return errors;
}

// Grupy wyboru na ekranie: pomiar każdego kafelka
const measure = (page) => page.evaluate(() => {
  const groups = [...document.querySelectorAll('#main .chips, #main .seg')].filter((g) => g.offsetParent && !g.closest('.rec'));
  return groups.map((g) => {
    const tiles = [...g.children].map((c) => { const r = c.getBoundingClientRect(), s = getComputedStyle(c); return { t: c.textContent.trim(), w: r.width, h: r.height, top: Math.round(r.top), sw: c.scrollWidth, cw: c.clientWidth, rad: s.borderTopLeftRadius, right: r.right }; });
    return { cls: g.className, n: tiles.length, tiles, gridRight: g.getBoundingClientRect().right, display: getComputedStyle(g).display, fit: g.dataset.fit === '1' };
  });
});

// Słowa w kafelkach: każde słowo w jednej linii (przeglądarki nie dzielą polskich wyrazów, więc pęknięcie słowa byłoby bez łącznika)
const splitWords = (page, sel) => page.evaluate((sel) => {
  const out = [];
  for (const t of document.querySelectorAll(sel)) {
    if (!t.offsetParent) continue;
    const host = t.querySelector('.lbl > span') || t;
    const walk = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      const re = /\S+/g; let m;
      while ((m = re.exec(n.data))) { const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length); const tops = new Set([...r.getClientRects()].map((x) => Math.round(x.top))); if (tops.size > 1) out.push(m[0]); }
    }
  }
  return out;
}, sel);
const CASES = [['#demo-prosty', 'prosty'], ['#demo-wszystkie', 'wszystkie'], ['#demo-jelita', 'jelita'], ['#demo-hashimoto', 'hashimoto']];
for (const [hash, name] of CASES) for (const w of [320, 390]) for (const scheme of ['light', 'dark']) {
  test(`kafelki ${name} ${w}px ${scheme}: siatka równych kafelków, bez wychodzenia poza kafelek`, async ({ page }) => {
    const errors = await open(page, hash, w, scheme);
    if (name === 'hashimoto') await page.evaluate(() => { S.tab = 'health'; render(); document.querySelectorAll('details.fold').forEach((d) => { d.open = true; }); });
    const groups = await measure(page);
    expect(groups.length).toBeGreaterThan(0);
    for (const g of groups) {
      expect(g.display, g.cls).toBe('grid');
      const rows = new Map();
      for (const t of g.tiles) { expect(t.rad, t.t).toBe('12px'); expect(t.h, t.t).toBeGreaterThanOrEqual(47.5); expect(t.sw, t.t).toBeLessThanOrEqual(t.cw + 1); expect(t.right, t.t).toBeLessThanOrEqual(w + 0.5); (rows.get(t.top) || rows.set(t.top, []).get(t.top)).push(t); }
      const widths = g.tiles.map((t) => t.w), w0 = widths[0];
      for (const x of widths) expect(Math.abs(x - w0), g.cls + ' ' + g.tiles.map((t) => t.t).join('|')).toBeLessThanOrEqual(1);
      const perRow = [...rows.values()].map((r) => r.length);
      // Mniej kolumn tylko wtedy, gdy najdłuższe słowo nie mieści się w kafelku (data-fit); wtedy pełne rzędy po równo
      if (g.fit) expect(perRow.slice(0, -1).every((n) => n === perRow[0]) && perRow.at(-1) <= perRow[0], g.tiles.map((t) => t.t).join('|')).toBe(true);
      else if (g.n >= 2 && g.n <= 4) expect(perRow, g.tiles.map((t) => t.t).join('|')).toEqual([g.n]);
      if (!g.fit && g.n === 11) expect(perRow).toEqual([6, 5]);
      if (!g.fit && (g.n === 5 || g.n === 6)) expect(perRow.slice(0, -1).every((n) => n === 3) && perRow.at(-1) <= 3, g.tiles.map((t) => t.t).join('|')).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    expect(await splitWords(page, '#main .chip:not(.rec .chip), #main .seg button'), 'słowo pęknięte w kafelku').toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('kafelki: długie opcje (.chip.opt, cele BMI) z napisem od lewej', async ({ page }) => {
  await open(page, '#demo-pokaz', 390, 'light');
  await page.evaluate(() => { S.tab = 'set'; S.mode = 'redukcja'; S.goalWay = 'bmi'; render(); document.querySelectorAll('details.fold').forEach((d) => { d.open = true; }); });
  const o = await page.evaluate(() => [...document.querySelectorAll('#main .chip.opt')].filter((b) => b.offsetParent).map((b) => { const t = b.querySelector('.lbl > span') || b, r = document.createRange(); r.selectNodeContents(t); const tr = r.getClientRects()[0], br = b.getBoundingClientRect(), s = getComputedStyle(b); return { t: b.textContent.trim().slice(0, 30), d: tr.left - br.left - parseFloat(s.paddingLeft) - parseFloat(s.borderLeftWidth) }; }));
  expect(o.length).toBeGreaterThan(0);
  for (const x of o) expect(Math.abs(x.d), x.t).toBeLessThanOrEqual(1.5);
  await page.locator('#main .chip.opt').first().scrollIntoViewIfNeeded();
  await page.locator('#main .chip.opt').first().locator('xpath=..').screenshot({ path: test.info().outputPath('chip-opt.png') });
});

test('kafelki: karta Dziś, wybór 4 gatunków zwierzaka, skala nóg i tydzień cyklu są na ekranie', async ({ page }) => {
  await open(page, '#demo-prosty', 390, 'light');
  expect(await page.locator('#lite .chips').count()).toBe(2); // kroki to suwak (runda 2)
  expect(await page.locator('#zwdemo').count()).toBe(0); // galeria demo zwierzaków przeszła do aplikacji
  await page.evaluate(() => { S.pet = null; S.tab = 'pet'; render(); });
  expect(await page.locator('.seg [data-petprev]').count()).toBe(4);
  await open(page, '#demo-wszystkie', 390, 'light');
  await page.evaluate(() => { S.tab = 'day'; render(); document.querySelectorAll('details.fold').forEach((d) => { d.open = true; }); });
  expect(await page.locator('[data-wpk^="leg"]').count() + await page.locator('[data-cyc]').count()).toBeGreaterThan(0);
});

for (const w of [320, 390]) for (const scheme of ['light', 'dark']) {
  test(`kafelki ${w}px ${scheme}: przełączenie wyboru nie zmienia rozmiaru, wybrany ma obrys inset i pogrubienie`, async ({ page }) => {
    await open(page, '#demo-prosty', w, scheme);
    for (const sel of ['#lite [data-lite^="redz:"]', '#lite [data-lite^="feel:"]']) {
      const loc = page.locator(sel), n = await loc.count();
      for (let i = 0; i < n; i++) {
        const b = loc.nth(i);
        const before = await b.boundingBox();
        await b.click();
        const b2 = page.locator(sel).nth(i);
        await page.waitForTimeout(300); // przejście box-shadow .15 s
        const after = await b2.boundingBox();
        expect(Math.abs(after.width - before.width), sel + i).toBeLessThanOrEqual(1);
        expect(Math.abs(after.height - before.height), sel + i).toBeLessThanOrEqual(1);
        const st = await b2.evaluate((e) => { const s = getComputedStyle(e); return { on: e.getAttribute('aria-pressed'), bs: s.boxShadow, bw: parseFloat(s.borderTopWidth), fw: +s.fontWeight, bg: s.backgroundColor }; });
        expect(st.on).toBe('true');
        // Wybrany (przegląd motywu A, 28.11.2026): obrys w zieleni razem 2 px = ramka 1 px + cień wewnętrzny 1 px, bez zmiany rozmiaru
        expect(st.bs, 'obrys wewnętrzny').toMatch(/inset/);
        expect(st.bw + parseFloat((st.bs.match(/(\d+(?:\.\d+)?)px inset/) || [0, 0])[1]), 'obrys razem co najmniej 2 px').toBeGreaterThanOrEqual(2);
        expect(st.fw).toBeGreaterThanOrEqual(600);
      }
    }
    // Niewybrany: bez inset 2 px
    const off = await page.locator('#lite [data-lite^="feel:"][aria-pressed="false"]').first().evaluate((e) => getComputedStyle(e).boxShadow);
    expect(off).not.toMatch(/ 2px/);
  });
}
