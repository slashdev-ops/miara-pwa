// Pola wpisu w przeglądarce (15.11.2026): ekran nie przeskakuje przy wpisywaniu, „Dalej” przechodzi przez wszystkie pola liczbowe.
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

// Położenie pola w oknie (px od góry) i id aktywnego elementu
const where = (page, sel) => page.evaluate((s) => { const el = document.querySelector(s); return { top: el ? el.getBoundingClientRect().top : null, act: document.activeElement && document.activeElement.id }; }, sel);

// Pola, w których wpis zmienia treść nad polem (pomiar 15.11.2026: Waga 319 px, Kroki 170 px, przy 320 px ECW 34 px, Cel 34 px)
const CASES = [
  // Karta „Dziś” (20.11.2026): #m_w i #m_steps to przyciski wartości; dotknięcie otwiera pole wpisu #wp_in w tym samym miejscu
  { name: 'Waga w Mój dzień', tab: 'day', sel: '#m_w', id: 'm_w', text: '82', open: true },
  { name: 'Kroki w Mój dzień', tab: 'day', sel: '#m_steps', id: 'm_steps', text: '8000', open: true },
  // Zadanie 5 (20.11.2026): skład ciała i profil to wiersze wartości; dotknięcie otwiera pole wpisu #ms_in albo #pf_in w tym samym miejscu
  { name: 'ECW/TBW w Skład ciała', tab: 'day', sel: '#m_ecw', id: 'm_ecw', text: '40', fold: true, open: true, in: 'ms_in' },
  { name: 'Waga docelowa w Ustawieniach', tab: 'set', sel: '#f_goal', id: 'f_goal', text: '75', open: true, in: 'pf_in' },
];

for (const c of CASES) {
  test(`bez skoku: wpis w pole ${c.name} nie przesuwa pola ani nie zabiera fokusu, także po wyjściu z pola`, async ({ page }) => {
    const errors = await open(page);
    await page.evaluate((t) => { S.tab = t; SHEET = false; render(); }, c.tab);
    if (c.fold) {
      const det = page.locator(`details:has(${c.sel})`);
      if (!(await det.evaluate((d) => d.open))) await det.locator(':scope > summary').click();
    }
    await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), c.sel);
    await page.locator(c.sel).click();
    await page.waitForTimeout(60);
    const fid = c.open ? c.in || 'wp_in' : c.id, fsel = '#' + fid;
    const a = await where(page, fsel);
    for (const ch of c.text) {
      await page.keyboard.type(ch);
      await page.waitForTimeout(40);
      const b = await where(page, fsel);
      expect(b.act, `fokus po znaku „${ch}”`).toBe(fid);
      expect(Math.abs(b.top - a.top), `przesunięcie po znaku „${ch}”`).toBeLessThanOrEqual(2);
    }
    await page.evaluate(() => document.activeElement.blur());
    await page.waitForTimeout(150);
    const o = await where(page, c.sel);
    expect(o.top, 'pole po wyjściu').not.toBeNull();
    expect(Math.abs(o.top - a.top), 'przesunięcie po wyjściu z pola').toBeLessThanOrEqual(2);
    expect(errors).toEqual([]);
  });
}

// Widoczne pola liczbowe w #main w kolejności dokumentu
// Zadanie 5: także przyciski wartości wierszy (wpis otwiera się po dotknięciu; enterkeyhint ma pole wpisu, nie przycisk)
const numFields = (page) => page.evaluate(() => [...document.querySelectorAll('#main input[inputmode="decimal"],#main input[inputmode="numeric"],#main button.wp-val')]
  .filter((x) => x.offsetParent !== null).map((x) => ({ id: x.id, ek: x.tagName === 'BUTTON' ? 'next' : x.getAttribute('enterkeyhint'), label: (x.labels && x.labels[0] ? x.labels[0].textContent : x.getAttribute('aria-label') || '').trim().slice(0, 40) })));

// Wszystkie zwinięte sekcje otwierane dotknięciem nagłówka (jak osoba), do wyczerpania
async function openFolds(page) {
  for (let i = 0; i < 40; i++) {
    const s = page.locator('#main details:not([open]) > summary').first();
    if (!(await s.count())) return;
    await s.click();
  }
}

for (const tab of ['day', 'train', 'health', 'labs', 'set']) {
  test(`Dalej: każde widoczne pole liczbowe ma unikalne id i enterkeyhint next albo done (${tab})`, async ({ page }) => {
    const errors = await open(page);
    await page.evaluate((t) => { S.tab = t; S.tr.cat = 'bieznia'; SHEET = false; render(); }, tab);
    if (tab === 'day') await openFolds(page);
    const f = await numFields(page);
    expect(f.length).toBeGreaterThan(0);
    for (const x of f) {
      expect(x.id, `id pola „${x.label}”`).not.toBe('');
      expect(['next', 'done'], `enterkeyhint pola „${x.label}” (${x.id})`).toContain(x.ek);
    }
    const ids = f.map((x) => x.id);
    expect(new Set(ids).size, 'id bez powtórzeń').toBe(ids.length);
    expect(errors).toEqual([]);
  });
}

// Trening ma już tylko wiersze wartości (Enter w nich: wiersze.spec.js), więc pola liczbowe sprawdzają Zdrowie i Badania
for (const tab of ['labs', 'health']) {
  test(`Dalej: Enter w polu liczbowym przenosi fokus do następnego widocznego pola liczbowego, także bez id (${tab})`, async ({ page }) => {
    const errors = await open(page);
    await page.evaluate((t) => { S.tab = t; S.tr.cat = 'bieznia'; SHEET = false; render(); }, tab); // Trening: czas i kalorie to wiersze wartości, pola zostają przy bieżni
    const n = await page.evaluate(() => [...document.querySelectorAll('#main input[inputmode="decimal"],#main input[inputmode="numeric"]')].filter((x) => x.offsetParent !== null).length);
    expect(n).toBeGreaterThan(1);
    for (let i = 0; i < n - 1; i++) {
      await page.evaluate((i) => { const all = [...document.querySelectorAll('#main input[inputmode="decimal"],#main input[inputmode="numeric"]')].filter((x) => x.offsetParent !== null); all[i].focus(); }, i);
      await page.keyboard.press('Enter');
      const ok = await page.evaluate((i) => { const all = [...document.querySelectorAll('#main input[inputmode="decimal"],#main input[inputmode="numeric"]')].filter((x) => x.offsetParent !== null); return { ok: document.activeElement === all[i + 1], to: all[i + 1].getAttribute('aria-label') || all[i + 1].id, act: document.activeElement && (document.activeElement.id || document.activeElement.tagName) }; }, i);
      expect(ok.ok, `Enter w polu ${i + 1} z ${n}: oczekiwane „${ok.to}”, aktywne ${ok.act}`).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}

// Mięśnie z FFMI (15.11.2026): wpis FFM w Mój dzień ustawia „Dużo mięśni” według zalecenia; Ustawienia pokazują FFMI i zalecenie
test('mięśnie: po wpisie FFM Ustawienia pokazują FFMI z liczbą, a przełącznik jest w stanie zalecanym', async ({ page }) => {
  const errors = await open(page);
  await page.evaluate(() => { S.tab = 'day'; S.sex = 'M'; S.cm = '180'; S.muscle = false; S.muscleAuto = true; SHEET = false; render(); });
  const det = page.locator('details:has(#m_ffm)');
  if (!(await det.evaluate((d) => d.open))) await det.locator(':scope > summary').click();
  await page.locator('#m_ffm').click();
  await page.keyboard.type('66');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(150);
  await page.evaluate(() => { S.tab = 'set'; render(); });
  const p = page.locator('#main p', { hasText: 'Twoje FFMI:' });
  await expect(p).toBeVisible();
  await expect(p).toContainText(/Twoje FFMI: \d+,\d kg\/m²/);
  await expect(p).toContainText('zalecamy: włączone');
  await expect(page.locator('#muscle')).toBeChecked();
  await expect(page.locator('[data-musclerec]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

// Fokus po przerysowaniu (poprawki po przeglądzie, 17.11.2026): opóźnione przerysowanie po wpisie nie może zgubić fokusu.
// Zadanie 5 (20.11.2026): skład ciała to wiersze wartości; Enter we wpisie FFM zapisuje i przechodzi do następnego wiersza w ramce (ECW)
test('Dalej: fokus po Enter we wpisie FFM zostaje w następnym wierszu także po opóźnionym przerysowaniu', async ({ page }) => {
  const errors = await open(page);
  await page.evaluate(() => { S.tab = 'day'; SHEET = false; render(); });
  await openFolds(page);
  const next = await page.evaluate(() => { const all = [...document.querySelector('#m_ffm').closest('.panel').querySelectorAll('button.wp-val')]; return all[all.findIndex((x) => x.id === 'm_ffm') + 1].id; });
  expect(next).toBe('m_ecw');
  await page.locator('#m_ffm').click();
  await page.keyboard.type('60');
  await page.keyboard.press('Enter');
  expect(await page.evaluate(() => document.activeElement.id)).toBe(next);
  await page.waitForTimeout(100);
  const a = await page.evaluate(() => ({ id: document.activeElement.id, tag: document.activeElement.tagName }));
  expect(a.tag, 'aktywny element po przerysowaniu').not.toBe('BODY');
  expect(a.id).toBe(next);
  expect(errors).toEqual([]);
});
