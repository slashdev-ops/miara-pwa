// Ramki i stan „Zjem” w przeglądarce (15.11.2026): przyciski nie dotykają krawędzi ramki, „Zjem” od razu pokazuje stan.
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

// Przyciski .btn w ramce (.panel, details.fold) co najmniej 12 px od lewej i prawej krawędzi najbliższej ramki.
// Pomijane: przyciski w poziomo przewijanych rzędach (chipy), niewidoczne.
const tightBtns = (page) => page.evaluate(() => {
  document.querySelectorAll('details').forEach((d) => { d.open = true; });
  const scrollRow = (el) => { for (let p = el.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if ((o === 'auto' || o === 'scroll') && p.scrollWidth > p.clientWidth) return true; } return false; };
  const out = [];
  document.querySelectorAll('button.btn, a.btn').forEach((b) => {
    const f = b.closest('.panel, details.fold'); if (!f) return;
    const r = b.getBoundingClientRect(); if (!r.width || !r.height || getComputedStyle(b).visibility === 'hidden') return;
    if (scrollRow(b)) return;
    const fr = f.getBoundingClientRect(), l = r.left - fr.left, rr = fr.right - r.right;
    if (l < 12 || rr < 12) out.push(`${(b.textContent || '').trim().slice(0, 40)} (${Math.round(l)}/${Math.round(rr)} px)`);
  });
  return out;
});

for (const tab of ['day', 'meals', 'train', 'health', 'set', 'add', 'pet']) {
  test(`ramki: przyciski w ramkach z odstępem od krawędzi (${tab})`, async ({ page }) => {
    const errors = await open(page);
    await page.evaluate((t) => { S.prof.cond.gut = true; if (t === 'add') { S.tab = 'day'; SHEET = true; } else { S.tab = t; SHEET = false; } render(); }, tab);
    expect(await tightBtns(page)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('Zjem: wiersz planu od razu pokazuje „✓ Zjedzone” z aria-pressed, co najmniej 44 px; drugie dotknięcie cofa', async ({ page }) => {
  const errors = await open(page);
  await page.evaluate(() => { S.tab = 'meals'; S.days[todayKey()] = []; SHEET = false; render(); });
  const id = await page.locator('.prow [data-addmeal]').first().getAttribute('data-addmeal');
  await page.locator(`.prow [data-addmeal="${id}"]`).click();
  const eaten = page.locator(`.prow [data-uneat="${id}"]`);
  await expect(eaten).toBeVisible();
  await expect(eaten).toHaveText('✓ Zjedzone');
  await expect(eaten).toHaveAttribute('aria-pressed', 'true');
  expect((await eaten.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await expect(page.locator('#toast')).toContainText('Dodano do dnia');
  await eaten.click();
  await expect(page.locator(`.prow [data-addmeal="${id}"]`)).toBeVisible();
  await expect(page.locator('#toast')).toContainText('Usunięto z dnia');
  await expect(page.locator('#toast [data-undo]')).toBeVisible();
  expect(errors).toEqual([]);
});
