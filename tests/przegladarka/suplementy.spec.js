// Suplementy w przeglądarce (17.11.2026): „Biorę” na dwóch pozycjach z parą ze źródła, karta „Mój plan suplementów”,
// fokus zostaje na dotkniętym przycisku, przyciski co najmniej 12 px od krawędzi ramki (jak ramki.spec.js), także przy 320 px.
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..', '..');
const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const CSP = vercel.headers.flatMap((h) => h.headers).find((h) => h.key === 'Content-Security-Policy').value
  .split(';').map((d) => d.trim()).filter((d) => d && d !== 'upgrade-insecure-requests').join('; ');

async function open(page, hash = '#demo-pokaz') {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('konsola: ' + m.text()); });
  await page.route('**/*', async (route) => { const res = await route.fetch(); await route.fulfill({ response: res, headers: { ...res.headers(), 'content-security-policy': CSP } }); });
  await page.goto('/index.html' + hash);
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  return errors;
}

// Ta sama reguła co ramki.spec.js: przyciski w ramce co najmniej 12 px od lewej i prawej krawędzi najbliższej ramki
const tightBtns = (page) => page.evaluate(() => {
  document.querySelectorAll('details').forEach((d) => { d.open = true; });
  const out = [];
  document.querySelectorAll('#fold_suple button.btn').forEach((b) => {
    const f = b.closest('.panel, details.fold'); if (!f) return;
    const r = b.getBoundingClientRect(); if (!r.width || !r.height) return;
    const fr = f.getBoundingClientRect(), l = r.left - fr.left, rr = fr.right - r.right;
    if (l < 12 || rr < 12) out.push(`${(b.textContent || '').trim().slice(0, 40)} (${Math.round(l)}/${Math.round(rr)} px)`);
  });
  return out;
});

test('suplementy: „Biorę” na żelazie i wapniu pokazuje plan z odstępem, aria-pressed, fokus zostaje, ramki z odstępem', async ({ page }) => {
  const errors = await open(page);
  await page.evaluate(() => { S.tab = 'health'; S.suppTake = []; SHEET = false; OPEN_F.add('suple'); render(); });
  await expect(page.locator('#suppplan')).toHaveCount(0);
  for (const [id, name] of [['zelazo', 'Żelazo'], ['wapn', 'Wapń']]) {
    const b = page.locator(`#fold_suple [data-supp="${id}"]`);
    await b.scrollIntoViewIfNeeded();
    await expect(b).toHaveAttribute('aria-pressed', 'false');
    await b.click();
    await expect(b).toHaveAttribute('aria-pressed', 'true');
    await expect(b).toHaveText('✓ Biorę');
    await expect(b).toHaveAccessibleName('Biorę: ' + name);
    await expect(b.locator('[aria-hidden="true"]')).toHaveText('✓');
    expect((await b.boundingBox()).height).toBeGreaterThanOrEqual(44);
    expect(await page.evaluate(() => document.activeElement && document.activeElement.dataset.supp)).toBe(id);
  }
  const plan = page.locator('#suppplan');
  await expect(plan).toBeVisible();
  await expect(plan).toContainText('Mój plan suplementów');
  await expect(plan.locator('.note', { hasText: 'Żelazo i wapń' }).first()).toBeVisible();
  await expect(plan.locator('.note.warn')).toHaveCount(0);
  await expect(plan.locator('h4', { hasText: 'Między posiłkami' })).toBeVisible();
  await expect(plan.locator('h4', { hasText: 'Z posiłkiem' })).toBeVisible();
  expect(await page.evaluate(() => S.suppTake.join())).toBe('zelazo,wapn');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  expect(await tightBtns(page)).toEqual([]);
  await page.locator('#fold_suple [data-supp="zelazo"]').click();
  await page.locator('#fold_suple [data-supp="wapn"]').click();
  await expect(page.locator('#suppplan')).toHaveCount(0);
  expect(errors).toEqual([]);
});
