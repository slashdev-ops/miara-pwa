// Białko za złotówkę w przeglądarce (20.11.2026): jednostka „zł” w tej samej linii co pole ceny, „g” obok pola wagi,
// bez poziomego przewijania przy 320 px, jasny i ciemny schemat.
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..', '..');
const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const CSP = vercel.headers.flatMap((h) => h.headers).find((h) => h.key === 'Content-Security-Policy').value
  .split(';').map((d) => d.trim()).filter((d) => d && d !== 'upgrade-insecure-requests').join('; ');
const IDS = ['twarog', 'jajka', 'skyr', 'kurczak', 'soczewica', 'tunczyk', 'tofu', 'wpc'];

async function open(page, w, scheme) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('konsola: ' + m.text()); });
  await page.setViewportSize({ width: w, height: 800 });
  await page.emulateMedia({ colorScheme: scheme });
  await page.route('**/*', async (route) => { const res = await route.fetch(); await route.fulfill({ response: res, headers: { ...res.headers(), 'content-security-policy': CSP } }); });
  await page.goto('/index.html#demo-pokaz');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  await page.evaluate(() => { S.tab = 'health'; render(); });
  await page.locator('#bialko').scrollIntoViewIfNeeded();
  return errors;
}

for (const w of [320, 390]) for (const scheme of ['light', 'dark']) {
  test(`białko ${w} px ${scheme}: jednostki w linii pól, bez przewijania poziomego`, async ({ page }) => {
    const errors = await open(page, w, scheme);
    const rows = await page.evaluate((ids) => ids.map((id) => {
      const r = (el) => el.getBoundingClientRect();
      const p = document.getElementById('f_prices.' + id + '.p'), g = document.getElementById('f_prices.' + id + '.g');
      const up = p.nextElementSibling, ug = g.nextElementSibling;
      return { id, pt: r(p).top, ut: r(up).top, gt: r(g).top, ugt: r(ug).top, pr: r(p).right, ul: r(up).left, gr: r(g).right, ugl: r(ug).left, ur: r(ug).right, up: up.textContent, ug: ug.textContent };
    }), IDS);
    for (const x of rows) {
      expect(Math.abs(x.pt - x.ut), x.id + ' zł').toBeLessThanOrEqual(2);
      expect(Math.abs(x.gt - x.ugt), x.id + ' g').toBeLessThanOrEqual(2);
      expect(x.up).toBe('zł'); expect(x.ug).toBe('g');
      expect(x.ul - x.pr).toBeLessThan(16); expect(x.ugl - x.gr).toBeLessThan(16);
      expect(x.ur).toBeLessThanOrEqual(w);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.locator('#bialko').evaluate((h) => h.scrollIntoView());
    if (process.env.BIALKO_SHOTS) await page.screenshot({ path: path.join(process.env.BIALKO_SHOTS, `bialko-${w}-${scheme}.png`) });
    expect(errors).toEqual([]);
  });
}
