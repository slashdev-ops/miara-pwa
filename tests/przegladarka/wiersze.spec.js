// Wiersze wartości poza kartą „Dziś” (zadanie 5, 20.11.2026): Trening, obwody, skład ciała, sprawność i profil w tym samym komponencie (wpisy.js).
// Układ przy 320 i 390 px w jasnym i ciemnym: bez przewijania w bok, wartość i − + razem po prawej, cele co najmniej 44 px; zachowanie wpisu i zapisu.
const { test, expect } = require('@playwright/test');

// Test sam ustawia szerokość i schemat kolorów, więc wystarczy jeden projekt na silnik
test.beforeEach(({}, info) => { test.skip(!/-jasny$/.test(info.project.name), 'szerokość i schemat ustawia sam test'); });

async function open(page, w, scheme, hash = '#demo-pokaz') {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('konsola: ' + m.text()); });
  await page.emulateMedia({ colorScheme: scheme });
  await page.setViewportSize({ width: w, height: 844 });
  await page.goto('about:blank');
  await page.goto('/index.html' + hash);
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  return errors;
}
const today = () => new Date().toLocaleDateString('sv-SE');

// Pomiar każdego wiersza .wp-f na ekranie: wartość, − i + w jednej linii po prawej, cele dotyku, brak wyjścia poza ekran
const measure = (page) => page.evaluate(() => [...document.querySelectorAll('#main .wp-f')].filter((x) => x.offsetParent && !x.closest('.dcells')).map((q) => {
  const r = (el) => el.getBoundingClientRect(), v = q.querySelector('.wp-val'), [mi, pl] = q.querySelectorAll('.wp-sq'), rg = q.querySelector('.wp-range'), lab = q.querySelector('.wp-lab');
  const V = r(v), M = r(mi), P = r(pl);
  return { lab: lab.textContent, vR: V.right, vH: V.height, vW: V.width, vMid: V.top + V.height / 2, mL: M.left, mW: M.width, mH: M.height, pW: P.width, pH: P.height, pR: P.right, pMid: P.top + P.height / 2,
    rgH: rg ? r(rg).height : null, rgW: rg ? r(rg).width : null, rowR: r(q).right, grey: v.classList.contains('wp-y'), txt: v.textContent,
    oneLine: Math.abs((r(lab).top + r(lab).height / 2) - (V.top + V.height / 2)) < 12, rowH: r(q.querySelector('.wp-r')).height };
}));
const noHScroll = (page) => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);

const GROUPS = [
  ['trening', async (page) => page.evaluate(() => { S.tab = 'train'; SHEET = false; render(); }), ['Czas z zegarka', 'Kalorie z zegarka', 'Czas treningu']],
  ['pomiary', async (page) => page.evaluate(() => { S.tab = 'day'; S.lite = false; SHEET = false; OPEN_F.add('obwody'); OPEN_F.add('tanita'); OPEN_F.add('sprawnosc'); render(); }),
    ['Talia', 'Biodra', 'Udo', 'Nadgarstek', 'Kostka', /^Tłuszcz \(/, /^FFM \(/, /^ECW\/TBW \(/, /^BMR \(/, 'VO2max (zegarek)', 'Tętno spoczynkowe', 'Tętno maksymalne (jeśli zmierzone)']], // skład ciała: nazwa urządzenia tylko w wersji prywatnej
  ['ustawienia', async (page) => page.evaluate(() => { S.tab = 'set'; SHEET = false; render(); }), ['Waga', 'Talia', 'Waga docelowa']],
  ['start', async (page) => page.evaluate(() => { S.onb = false; S.tab = 'intro'; S.introStep = 0; S.touched = {}; SHEET = false; render(); }), ['Waga', 'Wzrost', 'Wiek', 'Waga docelowa']],
];
for (const [name, go, labels] of GROUPS) for (const w of [320, 390]) for (const scheme of ['light', 'dark']) {
  test(`wiersze ${name} ${w}px ${scheme}: bez przewijania w bok, wartość i − + razem po prawej, cele co najmniej 44 px, nigdy puste`, async ({ page }) => {
    const errors = await open(page, w, scheme);
    await go(page);
    const rows = await measure(page);
    expect(rows.length).toBe(labels.length);
    labels.forEach((l, i) => { if (l instanceof RegExp) expect(rows[i].lab).toMatch(l); else expect(rows[i].lab).toBe(l); });
    for (const x of rows) {
      expect(x.txt.trim(), x.lab + ': wartość').toMatch(/\d/);
      expect(x.mL - x.vR, x.lab + ': odstęp wartości od −').toBeGreaterThanOrEqual(0);
      expect(x.mL - x.vR, x.lab + ': odstęp wartości od −').toBeLessThanOrEqual(16);
      expect(Math.abs(x.vMid - x.pMid), x.lab + ': wartość i + w jednej linii').toBeLessThanOrEqual(4);
      expect(x.pR, x.lab + ': + przy prawej krawędzi wiersza').toBeGreaterThan(x.rowR - 24);
      expect(x.pR, x.lab + ': + na ekranie').toBeLessThanOrEqual(w);
      for (const [k, v] of [['vH', x.vH], ['vW', x.vW], ['mW', x.mW], ['mH', x.mH], ['pW', x.pW], ['pH', x.pH]]) expect(v, x.lab + ' ' + k).toBeGreaterThanOrEqual(44);
      if (x.rgH != null) expect(x.rgH, x.lab + ': suwak').toBeGreaterThanOrEqual(44);
      // Zwarty wiersz: krótka etykieta w linii z wartością, wysokość bez suwaka najwyżej 72 px (z podpisem „ostatnio: data”)
      if (x.oneLine) expect(x.rowH, x.lab + ': wysokość wiersza').toBeLessThanOrEqual(72);
    }
    expect(await noHScroll(page)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('pomiary: dotknięcie talii otwiera wpis, Enter zapisuje dziś w formacie pól i przechodzi do bioder; − i + zapisują od razu z komunikatem', async ({ page }) => {
  const errors = await open(page, 390, 'light');
  await page.evaluate(() => { S.tab = 'day'; S.lite = false; SHEET = false; OPEN_F.add('obwody'); const k = todayKey(); S.meas[k] = { ...(S.meas[k] || {}) }; delete S.meas[k].waist; delete S.meas[k].hip; render(); });
  await expect(page.locator('#m_waist')).toHaveClass(/wp-y/);
  await expect(page.locator('#ms_dwaist')).toContainText('ostatnio:');
  await page.locator('#m_waist').click();
  await expect(page.locator('#ms_in')).toBeFocused();
  await expect(page.locator('#ms_in')).toHaveAttribute('enterkeyhint', 'next');
  await page.keyboard.type('84,5');
  await page.keyboard.press('Enter');
  await expect(page.locator('#m_hip')).toBeFocused();
  expect(await page.evaluate((k) => S.meas[k].waist, today())).toBe('84,5');
  await expect(page.locator('#m_waist')).not.toHaveClass(/wp-y/);
  await expect(page.locator('#m_waist')).toHaveText('84,5 cm');
  await page.locator('[data-wps="ms"][data-wpk="waist"] [data-wp="pm:waist:1"]').click();
  expect(await page.evaluate((k) => S.meas[k].waist, today())).toBe('85');
  await expect(page.locator('#sr')).toHaveText(/^Talia: 85,0 cm(\. .+)?$/); // wartość, a po niej reakcja zwierzaka, jeśli była
  await expect(page.locator('[data-wps="ms"][data-wpk="waist"] [data-wp="pm:waist:1"]')).toBeFocused();
  expect(errors).toEqual([]);
});

test('pomiary: wartość startowa zamknięta bez zmiany (Escape i wyjście z pola) nic nie zapisuje; błędny wpis pokazuje komunikat', async ({ page }) => {
  const errors = await open(page, 390, 'light');
  await page.evaluate(() => { S.tab = 'day'; S.lite = false; SHEET = false; OPEN_F.add('tanita'); const k = todayKey(); S.meas[k] = { ...(S.meas[k] || {}) }; delete S.meas[k].ffm; render(); });
  await page.locator('#m_ffm').click();
  await page.keyboard.press('Escape');
  await page.locator('#m_ffm').click();
  await page.evaluate(() => document.activeElement.blur());
  await page.waitForTimeout(100);
  expect(await page.evaluate((k) => S.meas[k].ffm, today())).toBeUndefined();
  await page.locator('#m_ffm').click();
  await page.keyboard.type('500');
  await page.keyboard.press('Enter');
  await expect(page.locator('#ms_effm [role="alert"]')).toContainText('Dozwolone');
  expect(await page.evaluate((k) => S.meas[k].ffm, today())).toBeUndefined();
  expect(errors).toEqual([]);
});

test('trening: kalorie z zegarka z ostatniego treningu wyszarzone, + wpisuje do formularza, trening dodaje dopiero przycisk; czas szacunku z suwaka przelicza wynik', async ({ page }) => {
  const errors = await open(page, 390, 'dark');
  await page.evaluate(() => { const k = nAgo(2); S.days[k] = [...(S.days[k] || []), { kind: 't', label: 'Trening z zegarka', min: 50, gross: 420, net: 300, src: 'zegarek' }]; S.tr.wk = ''; S.tr.wmin = ''; S.tr.min = '45'; S.tab = 'train'; SHEET = false; render(); });
  const n0 = await page.evaluate(() => day().length);
  await expect(page.locator('[id="f_tr.wk"]')).toHaveText('420 kcal');
  await expect(page.locator('[id="f_tr.wk"]')).toHaveClass(/wp-y/);
  await page.locator('[data-wps="tr"][data-wpk="wk"] [data-wp="pm:wk:1"]').click();
  expect(await page.evaluate(() => [S.tr.wk, day().length])).toEqual(['430', n0]);
  await page.locator('[data-setv="tr.wmin"][data-v="60"]').click();
  await page.locator('[data-addwatch="1"]').click();
  expect(await page.evaluate(() => { const e = day().at(-1); return [day().length, e.gross, e.min, e.src, S.tr.wk]; })).toEqual([n0 + 1, 430, 60, 'zegarek', '']);
  await page.evaluate(() => { S.tab = 'train'; render(); });
  const res = page.locator('.readout .res');
  const before = await res.textContent();
  await page.locator('#tr_rmin').focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => page.evaluate(() => S.tr.min)).toBe('46'); // strzałka: krok dokładny 1 min (suwaki z krokiem zależnym od prędkości)
  await expect(res).not.toHaveText(before);
  await expect(res).toContainText('46 min');
  expect(errors).toEqual([]);
});

test('profil: ekran startowy pokazuje wartości startowe wyszarzone; suwak wzrostu ustawia wzrost jako Twój; Zapisz i sprawdź w Ustawieniach wskazuje przycisk wartości', async ({ page }) => {
  const errors = await open(page, 320, 'light');
  await page.evaluate(() => { S.onb = false; S.tab = 'intro'; S.introStep = 0; S.touched = {}; S.sex = 'K'; SHEET = false; render(); });
  await expect(page.locator('#f_cm')).toHaveClass(/wp-y/);
  await expect(page.locator('#pf_dcm')).toHaveText('wartość startowa');
  // Wartość startowa: wyjście z pola i Enter bez wpisu tylko przechodzą dalej (S.touched bez zmian, podpis „wartość startowa” zostaje);
  // wpisana wartość, także równa startowej, ustawia ją jako Twoją
  await page.locator('#f_age').click();
  await page.evaluate(() => document.activeElement.blur());
  await page.waitForTimeout(100);
  for (const id of ['#f_kg', '#f_cm', '#f_age', '#f_goal']) { await page.locator(id).click(); await page.keyboard.press('Enter'); await page.waitForTimeout(80); }
  expect(await page.evaluate(() => JSON.stringify(S.touched || {}))).toBe('{}');
  for (const id of ['#pf_dcm', '#pf_dage', '#pf_dgoal']) await expect(page.locator(id)).toHaveText('wartość startowa');
  await expect(page.locator('#pf_dkg')).toHaveText('typowo w Polsce, wpisz swoją');
  await page.locator('#f_age').click();
  await page.keyboard.type('35');
  await page.keyboard.press('Enter');
  await expect.poll(() => page.evaluate(() => [S.age, !!(S.touched || {}).age, !!(S.touched || {}).kg])).toEqual(['35', true, false]);
  await expect(page.locator('#sr')).toHaveText(/^Wiek: 35 lat/);
  await expect(page.locator('#f_age')).not.toHaveClass(/wp-y/);
  await page.locator('#pf_rcm').focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => page.evaluate(() => [S.cm, !!(S.touched || {}).cm, !!(S.touched || {}).kg])).toEqual(['166', true, false]);
  await expect(page.locator('#f_cm')).not.toHaveClass(/wp-y/);
  await expect(page.locator('#f_cm')).toHaveText('166 cm');
  await page.evaluate(() => { S.onb = true; S.tab = 'set'; S.goal = '300'; S.touched.goal = true; render(); });
  await page.locator('[data-datasave="1"]').click();
  await expect(page.locator('#toast')).toContainText('Waga docelowa: wpisz wartość od 35 do 250 kg');
  await expect(page.locator('#f_goal')).toHaveText('300,0 kg');
  expect(errors).toEqual([]);
});

test('trend: talia i FFM z punktami i średnią 4 tygodni bez pasa wahania; waga w karcie Dziś zostaje z pasem', async ({ page }) => {
  const errors = await open(page, 390, 'light');
  await page.evaluate(() => { S.tab = 'day'; S.lite = false; SHEET = false; OPEN_F.add('obwody'); OPEN_F.add('tanita'); [40, 26, 12].forEach((n, i) => { const k = nAgo(n); S.meas[k] = { ...(S.meas[k] || {}), waist: String(88 - i), ffm: String(50 + i / 2) }; }); render(); });
  for (const id of ['ms_tw', 'ms_tf']) {
    const svg = page.locator('#' + id);
    await expect(svg).toBeVisible();
    await expect(svg).toHaveAttribute('aria-label', /12 tygodni: \d+ pomiar/);
    await expect(svg.locator('.wp-zone')).toHaveCount(0);
    await expect(svg.locator('text.wp-avgl')).toHaveText('średnia 4 tygodni');
    expect(await svg.locator('circle').count()).toBeGreaterThanOrEqual(3);
  }
  expect(await noHScroll(page)).toBe(true);
  expect(errors).toEqual([]);
});

// U2a (27.11.2026, makieta Ustawień v13): wiek i wzrost w nagłówku „Twoje dane” obok płci jako dwie komórki „dotknij i wpisz” w jednym rzędzie
for (const w of [320, 390]) test(`Ustawienia ${w}px: wiek i wzrost w jednym rzędzie, przyciski wartości co najmniej 44 px, bez przewijania w bok`, async ({ page }) => {
  const errors = await open(page, w, 'light');
  await page.evaluate(() => { S.tab = 'set'; SHEET = false; render(); });
  const c = await page.evaluate(() => [...document.querySelectorAll('.dcells .wp-val')].map((v) => { const r = v.getBoundingClientRect(); return { t: r.top, h: r.height, w: r.width, x: r.right }; }));
  expect(c.length).toBe(2);
  expect(Math.abs(c[0].t - c[1].t)).toBeLessThanOrEqual(2);
  for (const x of c) { expect(x.h).toBeGreaterThanOrEqual(44); expect(x.w).toBeGreaterThanOrEqual(44); expect(x.x).toBeLessThanOrEqual(w); }
  await expect(page.locator('.dhead [data-sex="K"]')).toBeVisible();
  expect(await noHScroll(page)).toBe(true);
  expect(errors).toEqual([]);
});
