// Karta „Dziś” (wpisy.js, 20.11.2026): sen i kroki z suwakiem, waga od ostatniego ważenia z wykresem 14 dni, wpis z klawiatury,
// jeden główny przycisk. Pełny widok: scenariusz #demo-wpisy (wczoraj 80,4 kg, sen 6:13, 8500 kroków); prosty: #demo-prosty.
const { test, expect } = require('@playwright/test');

async function open(page, o = {}) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('konsola: ' + m.text()); });
  if (o.w) await page.setViewportSize({ width: o.w, height: 844 });
  if (o.time !== null) await page.clock.install({ time: new Date('2026-11-20T' + (o.time || '13:00') + ':00') }); // stała pora dnia: kolejność Sen, Kroki, Waga
  await page.goto('/index.html#demo-' + (o.scen || 'wpisy'));
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object' && typeof WPISY === 'object');
  await page.evaluate(() => { SHEET = false; S.tab = 'day'; render(); });
  await expect(page.locator('#wp_card')).toBeVisible();
  await page.locator('#wp_card').scrollIntoViewIfNeeded();
  return errors;
}
// Przycisk nie przesuwa się i nie zmienia rozmiaru: po zakończeniu przejść CSS, z tolerancją 1 px (WebKit zaokrągla ułamki piksela)
const settled = (loc) => loc.evaluate((e) => Promise.all(e.ownerDocument.getAnimations().filter((a) => a.effect && a.effect.getComputedTiming().endTime !== Infinity).map((a) => a.finished.catch(() => null))));
const near = (a, b) => !!a && !!b && ['x', 'y', 'width', 'height'].every((k) => Math.abs(a[k] - b[k]) <= 1);
async function expectSameBox(loc, box0) { await settled(loc); await expect.poll(async () => near(await loc.boundingBox(), box0), { message: 'przycisk w tym samym miejscu i rozmiarze (±1 px)' }).toBe(true); }
const today = (page) => page.evaluate(() => { const m = S.meas[todayKey()] || {}; return { w: m.w, sleep: m.sleep, steps: m.steps }; });

test('karta: prosty widok, „Dodaj” przy wadze pokazuje ostatnie ważenie zamiast pustego pola i wykres 14 dni', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  await page.goto('/index.html#demo-prosty');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object' && S.lite === true);
  await page.evaluate(() => { SHEET = false; render(); });
  await expect(page.locator('#wp_card')).toHaveCount(0);
  await page.locator('[data-unlock="waga"]').click();
  const y = await page.evaluate(() => { const k = Object.keys(S.meas).filter((x) => x < todayKey() && S.meas[x].w).sort().pop(); return { w: S.meas[k].w, d: k.slice(8, 10) + '.' + k.slice(5, 7) + '.' + k.slice(0, 4) }; });
  const v = page.locator('#m_w');
  await expect(v).toHaveText(y.w + ' kg');
  await expect(v).toHaveClass(/wp-y/);
  await expect(page.locator('#wp_hw')).toHaveText('wpisz dzisiejszą wagę'); // waga to pomiar: „Jak wczoraj” jej nie kopiuje
  await expect(page.locator('#wp_dw')).toHaveText('ostatnio: ' + y.d);
  await expect(page.locator('#wp_main')).toHaveText('Zatwierdź');
  await expect(page.locator('#wp_card [data-row]')).toHaveCount(1);
  await expect(page.locator('#m_sleep')).toHaveCount(0);
  await expect(page.locator('#m_steps')).toHaveCount(0);
  await expect(page.locator('#wp_spark')).toBeVisible();
  await expect(page.locator('#wp_card input[type="text"]')).toHaveCount(0);
  // Nic do zapisania bez zgadywania: główny przycisk prowadzi do wiersza wagi
  await page.locator('#wp_main').click();
  await expect(v).toBeFocused();
  expect(await page.evaluate(() => (S.meas[todayKey()] || {}).w)).toBeUndefined();
  await v.click();
  await expect(page.locator('#wp_in')).toHaveValue(y.w);
  expect(errors).toEqual([]);
});

test('karta: 320 px bez poziomego przewijania, cele co najmniej 44 px, kolory z motywu jasnego i ciemnego', async ({ page }, info) => {
  const errors = await open(page, { w: 320 });
  const o = await page.evaluate(() => {
    const card = document.querySelector('#wp_card'), ctl = [...card.querySelectorAll('button, input')].filter((e) => e.getClientRects().length).map((e) => ({ t: e.getAttribute('aria-label') || e.textContent || e.id, h: e.getBoundingClientRect().height, w: e.getBoundingClientRect().width }));
    const bg = getComputedStyle(card).backgroundColor.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number), fg = getComputedStyle(document.querySelector('#m_sleep')).color.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
    return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, r: card.getBoundingClientRect().right, ctl, bg: bg.reduce((a, b) => a + b, 0) / 3, fg: fg.reduce((a, b) => a + b, 0) / 3 };
  });
  expect(o.sw).toBeLessThanOrEqual(o.cw);
  expect(o.r).toBeLessThanOrEqual(o.cw);
  for (const c of o.ctl) { expect(c.h, c.t).toBeGreaterThanOrEqual(44); expect(c.w, c.t).toBeGreaterThanOrEqual(44); }
  if (info.project.use.colorScheme === 'dark') { expect(o.bg).toBeLessThan(90); expect(o.fg).toBeGreaterThan(o.bg); } else { expect(o.bg).toBeGreaterThan(200); expect(o.fg).toBeLessThan(o.bg); }
  expect(errors).toEqual([]);
});

test('karta: „Jak wczoraj” od razu, zmiana wiersza daje „Zatwierdź (1)”, zapis do meas dnia, przycisk bez przesunięcia, Cofnij', async ({ page }) => {
  const errors = await open(page);
  const main = page.locator('#wp_main');
  await expect(main).toHaveText('Jak wczoraj');
  await expect(page.locator('#wp_hs')).toHaveText('jak wczoraj?');
  await expect(page.locator('#m_sleep')).toHaveText('6 h 13 min');
  await page.getByRole('button', { name: 'Sen o 5 minut więcej' }).click();
  await expect(page.locator('#m_sleep')).toHaveText('6 h 15 min');
  await expect(page.locator('#wp_hs')).toHaveText('+2 min od wczoraj');
  await expect(main).toHaveText('Zatwierdź (1)');
  await main.scrollIntoViewIfNeeded();
  const box0 = await main.boundingBox();
  await main.click();
  await expect(main).toHaveText('✓ Zapisane · Cofnij');
  const box1 = await main.boundingBox();
  expect(Math.abs(box1.y - box0.y), 'przycisk w tym samym miejscu ekranu').toBeLessThanOrEqual(2);
  await expect(main).toBeFocused();
  await expect(page.locator('#sr')).toHaveText('✓ Zapisane · Cofnij');
  expect(await today(page), 'zapisuje się tylko zmieniony wiersz').toEqual({ w: undefined, sleep: '6:15', steps: undefined });
  await page.waitForTimeout(800); // drugie dotknięcie zaraz po zapisie jest ignorowane
  await main.click(); // Cofnij
  await expect(main).toHaveText('Zatwierdź (1)');
  await expect(page.locator('#m_sleep')).toHaveText('6 h 15 min');
  expect(await today(page)).toEqual({ w: undefined, sleep: undefined, steps: undefined });
  expect(errors).toEqual([]);
});

test('karta: „Jak wczoraj” kopiuje sen i kroki (nie wagę), po 5 s „Zobacz, co się zmieniło” po zapisie wagi, potem „Gotowe na dziś”; − i + zastępuje „Zmień”', async ({ page }) => {
  const errors = await open(page);
  const main = page.locator('#wp_main');
  await main.click(); // Jak wczoraj
  await expect(main).toHaveText('✓ Zapisane · Cofnij');
  expect(await today(page)).toEqual({ w: undefined, sleep: '6:13', steps: '8500' });
  expect(await page.evaluate(() => S.meas[todayKey()].cp.sort().join())).toBe('sleep,steps');
  await expect(page.locator('#wp_card .wp-r.saved')).toHaveCount(2);
  await expect(page.locator('#wp_card .wp-pm .wp-sq:visible')).toHaveCount(2);
  await expect(page.locator('#wp_card .wp-chg:visible')).toHaveCount(2);
  await page.clock.fastForward(5100);
  await expect(main).toHaveText('Zatwierdź');
  await page.getByRole('button', { name: '0,1 kg więcej' }).click();
  await expect(main).toHaveText('Zatwierdź (1)');
  await main.click();
  await expect(main).toHaveText('✓ Zapisane · Cofnij');
  await expect(page.locator('#wp_card .wp-r.saved')).toHaveCount(3);
  await expect(page.locator('#wp_card .wp-chg:visible')).toHaveCount(3);
  await main.scrollIntoViewIfNeeded();
  await settled(main);
  const box0 = await main.boundingBox();
  await page.clock.fastForward(5100);
  await expect(main).toHaveText('Zobacz, co się zmieniło');
  await expectSameBox(main, box0);
  await expect(page.locator('#wp_sum')).toBeHidden();
  await main.click();
  await expect(page.locator('#wp_sum')).toBeVisible();
  await expect(page.locator('#wp_sum')).toContainText('Zapisane na dziś: Sen 6 h 13 min · Kroki 8');
  await expect(main).toHaveText('Gotowe na dziś');
  await expectSameBox(main, box0);
  await main.click();
  await expect(page.locator('#wp_sum')).toBeHidden();
  await expect(main).toHaveText('Zobacz, co się zmieniło');
  await page.locator('#wp_card .wp-chg[data-wp="chg:s"]').click();
  await expect(page.locator('#wp_card .wp-r[data-row="s"] .wp-sq:visible')).toHaveCount(2);
  await expect(page.locator('#m_sleep')).toBeFocused();
  expect(errors).toEqual([]);
});

test('karta: kolejność wierszy zależy od pory dnia', async ({ page }) => {
  for (const [t, ord] of [['08:00', 'wsk'], ['13:00', 'skw'], ['19:00', 'ksw']]) {
    const p = await page.context().newPage();
    await p.clock.install({ time: new Date('2026-11-20T' + t + ':00') });
    await p.goto('/index.html#demo-wpisy');
    await p.waitForFunction(() => typeof render === 'function' && typeof WPISY === 'object');
    await p.evaluate(() => { SHEET = false; S.tab = 'day'; render(); });
    expect(await p.evaluate(() => [...document.querySelectorAll('#wp_card .wp-r')].map((r) => r.dataset.row).join(''))).toBe(ord);
    await p.close();
  }
});

test('karta: dotknięcie wartości otwiera pole z zaznaczeniem, 8:30 + Enter ustawia sen i suwak, fokus przechodzi dalej', async ({ page }) => {
  const errors = await open(page);
  await expect(page.locator('#m_sleep')).toHaveAccessibleName('Sen: 6 h 13 min, dotknij, aby wpisać');
  await page.locator('#m_sleep').click();
  const inp = page.locator('#wp_in');
  await expect(inp).toBeFocused();
  await expect(inp).toHaveAttribute('enterkeyhint', 'next');
  expect(await page.evaluate(() => { const i = document.getElementById('wp_in'); return i.selectionEnd - i.selectionStart === i.value.length && i.value === '6:13'; })).toBe(true);
  await page.keyboard.type('8:30');
  await page.keyboard.press('Enter');
  await expect(page.locator('#m_sleep')).toHaveText('8 h 30 min');
  await expect(page.locator('#wp_rs')).toHaveValue('510');
  await expect(page.locator('#wp_in')).toHaveCount(0);
  await expect(page.locator('#m_steps')).toBeFocused();
  await expect(page.locator('#wp_main')).toHaveText('Zatwierdź (1)');
  // Sen cyframi bez dwukropka: 613 to 6 h 13 min
  await page.locator('#m_sleep').click();
  await page.keyboard.type('613');
  await page.keyboard.press('Enter');
  await expect(page.locator('#m_sleep')).toHaveText('6 h 13 min');
  expect(errors).toEqual([]);
});

test('karta: zły wpis i złe minuty pokazują komunikat role=alert i zostawiają starą wartość, Escape anuluje, kroki i waga z klawiatury', async ({ page }) => {
  const errors = await open(page);
  await page.locator('#m_sleep').click();
  await page.keyboard.type('abc');
  await page.keyboard.press('Enter');
  await expect(page.locator('#wp_es [role="alert"]')).not.toBeEmpty();
  await expect(page.locator('#m_sleep')).toHaveText('6 h 13 min');
  await expect(page.locator('#m_sleep')).toBeFocused();
  await page.locator('#m_sleep').click();
  await page.keyboard.type('6:75');
  await page.keyboard.press('Enter');
  await expect(page.locator('#wp_es [role="alert"]')).toHaveText('Minuty od 0 do 59.');
  await expect(page.locator('#m_sleep')).toHaveText('6 h 13 min');
  await page.locator('#m_sleep').click();
  await expect(page.locator('#wp_es')).toBeEmpty();
  await page.keyboard.type('9');
  await page.keyboard.press('Escape');
  await expect(page.locator('#m_sleep')).toHaveText('6 h 13 min');
  await expect(page.locator('#m_sleep')).toBeFocused();
  await page.locator('#m_steps').click();
  await expect(page.locator('#wp_in')).toHaveAttribute('inputmode', 'numeric');
  await page.keyboard.type('8250');
  await page.keyboard.press('Enter');
  await expect(page.locator('#m_steps')).toHaveText(/^8\s250$/);
  await page.locator('#m_w').click();
  await expect(page.locator('#wp_in')).toHaveAttribute('inputmode', 'decimal');
  await expect(page.locator('#wp_in')).toHaveAttribute('enterkeyhint', 'done');
  await page.keyboard.type('77,1');
  await page.locator('#m_steps').focus(); // wyjście z pola zatwierdza
  await expect(page.locator('#m_w')).toHaveText('77,1 kg');
  await expect(page.locator('#wp_band')).toContainText('poza zwykłym wahaniem');
  await expect(page.locator('#wp_main')).toHaveText('Zatwierdź (2)');
  expect(await today(page)).toEqual({ w: undefined, sleep: undefined, steps: undefined });
  expect(errors).toEqual([]);
});

test('karta: waga zaczyna od wczorajszych 80,4 kg, + dodaje 0,1 kg; wykres 14 dni z pasem i dzisiejszym punktem', async ({ page }) => {
  const errors = await open(page);
  await expect(page.locator('#m_w')).toHaveText('80,4 kg');
  await expect(page.locator('#m_w')).toHaveClass(/wp-y/);
  const plus = page.getByRole('button', { name: '0,1 kg więcej' });
  await plus.click();
  await expect(page.locator('#m_w')).toHaveText('80,5 kg');
  await plus.click();
  await plus.click();
  await expect(page.locator('#m_w')).toHaveText('80,7 kg');
  await expect(page.locator('#m_w')).not.toHaveClass(/wp-y/);
  await expect(page.locator('#wp_hw')).toHaveText('+0,3 kg od wczoraj');
  const sp = page.locator('#wp_spark');
  await expect(sp).toBeVisible();
  await expect(sp).toHaveAttribute('role', 'img');
  const lab = await sp.getAttribute('aria-label');
  expect(lab).toContain('średnia 7 dni');
  expect(lab).toContain('dziś 80,7 kg');
  expect(await sp.evaluate((e) => e.getBoundingClientRect().height)).toBeLessThanOrEqual(130);
  expect(await page.locator('#wp_spark .wp-zone').count()).toBe(1);
  await expect(page.locator('#wp_band')).toContainText('od średniej 7 dni');
  await expect(page.locator('#wp_card a[href="https://pubmed.ncbi.nlm.nih.gov/32353079/"]')).toBeVisible();
  expect(errors).toEqual([]);
});

test('karta: przytrzymanie + przy wadze zmienia wartość coraz szybciej', async ({ page }) => {
  const errors = await open(page, { time: null });
  const plus = page.getByRole('button', { name: '0,1 kg więcej' });
  await plus.scrollIntoViewIfNeeded();
  const b = await plus.boundingBox();
  const w = () => page.evaluate(() => parseFloat(document.getElementById('m_w').textContent.replace(',', '.')));
  const w0 = await w();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(700);
  const w1 = await w();
  await page.waitForTimeout(700);
  const w2 = await w();
  await page.mouse.up();
  const a = Math.round((w1 - w0) * 10), c = Math.round((w2 - w1) * 10);
  expect(a, 'kroki w pierwszych 0,7 s').toBeGreaterThanOrEqual(3);
  expect(c, 'kroki w kolejnych 0,7 s').toBeGreaterThan(a);
  const w3 = await w();
  await page.waitForTimeout(300);
  expect(await w(), 'po puszczeniu wartość stoi').toBe(w3);
  expect(errors).toEqual([]);
});

test('karta: − i + obok siebie w prawej połowie karty', async ({ page }) => {
  const errors = await open(page);
  const pm = await page.evaluate(() => {
    const card = document.querySelector('#wp_card').getBoundingClientRect(), half = card.left + card.width / 2;
    return [...document.querySelectorAll('#wp_card .wp-r')].map((r) => { const b = r.querySelectorAll('.wp-pm .wp-sq'), a = b[0].getBoundingClientRect(), c = b[1].getBoundingClientRect(); return { gap: c.left - a.right, left: a.left >= half, row: Math.abs(a.top - c.top) < 1 }; });
  });
  expect(pm.length).toBe(3);
  for (const r of pm) { expect(r.gap).toBeLessThan(16); expect(r.left).toBe(true); expect(r.row).toBe(true); }
  expect(errors).toEqual([]);
});

test('karta: przy 390 px najwyżej 780 px wysokości; wartości robocze przeżywają przerysowanie ekranu', async ({ page }) => {
  const errors = await open(page, { w: 390 });
  expect(await page.evaluate(() => document.querySelector('#wp_card').getBoundingClientRect().height)).toBeLessThanOrEqual(780);
  await page.getByRole('button', { name: 'Sen o 5 minut więcej' }).click();
  await page.evaluate(() => render());
  await expect(page.locator('#m_sleep')).toHaveText('6 h 15 min');
  await expect(page.locator('#wp_main')).toHaveText('Zatwierdź (1)');
  await page.getByRole('button', { name: 'Sen o 5 minut więcej' }).click();
  await expect(page.locator('#m_sleep')).toHaveText('6 h 20 min');
  await page.locator('#wp_rk').fill('12000');
  await expect(page.locator('#m_steps')).toHaveText(/^12\s000$/);
  await expect(page.locator('#wp_main')).toHaveText('Zatwierdź (2)');
  expect(errors).toEqual([]);
});

test('karta: drugie dotknięcie głównego przycisku zaraz po zapisie nie cofa zapisu (błąd trybu)', async ({ page }) => {
  const errors = await open(page);
  const main = page.locator('#wp_main');
  await page.getByRole('button', { name: 'Sen o 5 minut więcej' }).click();
  // Dwa dotknięcia jedno po drugim (bez czekania przeglądarki na stabilność przycisku między nimi)
  await page.evaluate(() => { document.getElementById('wp_main').click(); document.getElementById('wp_main').click(); });
  await expect(main).toHaveText('✓ Zapisane · Cofnij');
  expect((await today(page)).sleep).toBe('6:15');
  await page.waitForTimeout(800);
  await main.click();
  await expect(main).toHaveText('Zatwierdź (1)');
  expect((await today(page)).sleep).toBeUndefined();
  expect(errors).toEqual([]);
});

test('karta: „Co to znaczy?” tylko gdy zapisana waga leży poza pasem', async ({ page }) => {
  const errors = await open(page);
  await page.getByRole('button', { name: '0,1 kg więcej' }).click();
  await page.locator('#wp_main').click();
  await expect(page.locator('#wp_main')).toHaveText('✓ Zapisane · Cofnij');
  await expect(page.locator('#wp_wwb')).toHaveCount(0);
  await page.locator('#wp_card .wp-chg[data-wp="chg:w"]').click();
  await page.locator('#m_w').click();
  await page.keyboard.type('78');
  await page.keyboard.press('Enter');
  await expect(page.locator('#wp_wwb')).toHaveCount(0); // niezatwierdzona zmiana: jeszcze bez wyjaśnienia
  await page.waitForTimeout(800);
  await page.locator('#wp_main').click();
  const b = page.locator('#wp_wwb');
  await expect(b).toBeVisible();
  await expect(b).toHaveAttribute('aria-expanded', 'false');
  await b.click();
  await expect(page.locator('#wp_ww')).toContainText('Turicchi 2020');
  await expect(page.locator('#wp_wwb')).toHaveAttribute('aria-expanded', 'true');
  expect(errors).toEqual([]);
});

test('karta: wartości robocze przeżywają przeładowanie strony (sessionStorage), po zapisie znikają', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  await page.goto('/index.html');
  await page.waitForFunction(() => typeof render === 'function' && typeof WPISY === 'object');
  const setup = () => page.evaluate(() => { S.onb = true; S.lite = false; S.tab = 'day'; SHEET = false; render(); });
  await page.evaluate(() => { S.onb = true; S.lite = false; S.tab = 'day'; S.meas = { [nAgo(1)]: { sleep: '6:15' } }; save(); render(); });
  await page.getByRole('button', { name: 'Sen o 5 minut więcej' }).click();
  await expect(page.locator('#m_sleep')).toHaveText('6 h 20 min');
  await page.reload();
  await page.waitForFunction(() => typeof render === 'function' && typeof WPISY === 'object');
  await setup();
  await expect(page.locator('#m_sleep')).toHaveText('6 h 20 min');
  await expect(page.locator('#wp_main')).toHaveText('Zatwierdź (1)');
  await page.locator('#wp_main').click();
  expect(await page.evaluate(() => sessionStorage.getItem('miara-wpisy:wp'))).toBeNull();
  await page.reload();
  await page.waitForFunction(() => typeof render === 'function' && typeof WPISY === 'object');
  await setup();
  await expect(page.locator('#m_sleep')).toHaveText('6 h 20 min');
  expect(await page.evaluate(() => S.meas[todayKey()].sleep)).toBe('6:20');
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  expect(errors).toEqual([]);
});

test('karta: przerysowanie w trakcie wpisu nie zostawia karty „zajętej” na stałe', async ({ page }) => {
  const errors = await open(page);
  await page.locator('#m_sleep').click();
  await expect(page.locator('#wp_in')).toBeFocused();
  expect(await page.evaluate(() => WPISY.busy())).toBe(true);
  expect(await page.evaluate(() => { render(); return WPISY.busy(); })).toBe(false);
  await page.getByRole('button', { name: 'Sen o 5 minut więcej' }).click();
  await expect(page.locator('#m_sleep')).toHaveText('6 h 15 min');
  expect(errors).toEqual([]);
});

test('skale 0-10: ból nóg suwakiem co 1 z podpisami końców, aria-valuetext „X z 10”, zapis po puszczeniu i przy − i +', async ({ page }) => {
  const errors = await open(page, { scen: 'pokaz' });
  await page.evaluate(() => { S.sex = 'K'; S.lip = true; S.legs = {}; S.tab = 'day'; render(); const d = document.getElementById('fold_nogi'); if (d) d.open = true; });
  const r = page.locator('#q_rlegb');
  await r.scrollIntoViewIfNeeded();
  await expect(r).toHaveAttribute('max', '10');
  await expect(page.locator('[data-wpk="legb"] .wp-ends')).toContainText('0 brak');
  await expect(page.locator('[data-wpk="legb"] .wp-ends')).toContainText('10 najgorszy');
  expect(await page.evaluate(() => (S.legs[todayKey()] || {}).b)).toBeUndefined();
  await r.fill('4');
  expect(await page.evaluate(() => S.legs[todayKey()].b)).toBe(4);
  await expect(page.locator('#q_rlegb')).toHaveAttribute('aria-valuetext', '4 z 10');
  await page.getByRole('button', { name: 'Ból nóg: więcej' }).click();
  expect(await page.evaluate(() => S.legs[todayKey()].b)).toBe(5);
  await expect(page.locator('#q_legb')).toHaveText('5');
  expect(errors).toEqual([]);
});
