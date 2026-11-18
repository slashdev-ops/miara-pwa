// Zakupy z promocji w przeglądarce (18.11.2026): osoba wkleja fragment gazetki, zatwierdza propozycję,
// promocja pojawia się przy pozycji listy zakupów i w „Dania z produktów w promocji”. Produkty i ceny zmyślone.
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

// Lista zakupów otwarta, bez promocji i dnia zakupów, jeden sklep z linkiem do gazetki
async function shopOpen(page) {
  await page.evaluate(() => { S.tab = 'meals'; S.promos = []; S.shopDay = null; S.stores = [{ n: 'Sklep testowy', u: 'https://example.com/gazetka' }]; OPEN_F.add('zakupy'); OPEN_F.add('sklepy'); render(); });
  await page.locator('#zakupy').scrollIntoViewIfNeeded();
}

test('wklejenie, propozycja, Zapisz: dopisek na liście i danie z produktu w promocji', async ({ page }) => {
  const errors = await open(page);
  await shopOpen(page);
  await page.getByLabel('Wklej fragment gazetki').fill('Twaróg półtłusty 250 g 3,99 zł');
  await page.getByRole('button', { name: 'Rozpoznaj' }).click();
  await expect(page.locator('#toast')).toContainText('Znaleziono 1 pozycję');
  await expect(page.locator('#promo_h')).toBeFocused();
  await expect(page.getByLabel('Składnik dla: Twaróg półtłusty 250 g')).toHaveValue('twarog');
  expect(await page.evaluate(() => JSON.stringify(S).includes('3,99') || Object.values(localStorage).some((v) => String(v).includes('3,99')))).toBe(false);
  await page.getByRole('button', { name: 'Zapisz: Twaróg półtłusty 250 g' }).click();
  const row = page.locator('#zakupy .panel .entry').filter({ hasText: 'Twaróg półtłusty' }).first();
  await expect(row).toContainText(/promocja 3,99 zł do \d\d\.\d\d/);
  await expect(page.getByRole('heading', { name: 'Twoje promocje' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Dania z produktów w promocji' })).toBeVisible();
  const dish = page.locator('#zakupy .entry').filter({ hasText: 'w promocji: Twaróg półtłusty' }).first();
  await expect(dish.locator('[data-recipe]')).toBeVisible();
  const link = page.getByRole('link', { name: 'Otwórz gazetkę: Sklep testowy' });
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  expect(errors).toEqual([]);
});

test('dzień zakupów zmienia nagłówek listy, lista zostaje otwarta', async ({ page }) => {
  await open(page);
  await shopOpen(page);
  await page.locator('[data-shopday="5"]').click();
  await expect(page.locator('#zakupy > summary')).toContainText(/Lista zakupów na 7 dni od piątku \d\d\.\d\d/);
  await expect(page.locator('#zakupy')).toHaveAttribute('open', '');
  await expect(page.locator('[data-shopday="5"]')).toHaveAttribute('aria-pressed', 'true');
});

test('zakupy: bez przewijania w poziomie, cele dotyku co najmniej 44 px', async ({ page }) => {
  await open(page);
  await shopOpen(page);
  await page.getByLabel('Wklej fragment gazetki').fill('Pierś z kurczaka bardzo długa nazwa produktu z opisem 19,99 zł/kg\nSkyr naturalny 2,49 zł do 30.12');
  await page.getByRole('button', { name: 'Rozpoznaj' }).click();
  await page.getByRole('button', { name: 'Zapisz: Skyr naturalny' }).click();
  const r = await page.evaluate(() => {
    const sel = '#zakupy .promo button, #zakupy .promo a, #zakupy .promo select, #zakupy .promo input, #zakupy .promo textarea';
    const small = [...document.querySelectorAll(sel)].filter((el) => el.offsetParent).map((el) => [el.textContent.trim() || el.id || el.tagName, Math.round(el.getBoundingClientRect().height)]).filter(([, h]) => h < 44);
    const wide = [...document.querySelectorAll('#zakupy .promo *')].filter((el) => el.offsetParent && el.getBoundingClientRect().right > document.documentElement.clientWidth + 1 && !el.closest('.seg.scroll')).map((el) => el.className || el.tagName);
    return { small, wide, over: document.documentElement.scrollWidth > document.documentElement.clientWidth };
  });
  expect(r.small).toEqual([]);
  expect(r.wide).toEqual([]);
  expect(r.over).toBe(false);
});
