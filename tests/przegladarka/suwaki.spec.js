// Suwaki z krokiem zależnym od prędkości (20.11.2026): wolne przesunięcie daje każdą wartość dokładną (sen co 5 min, kroki co 50),
// szybkie przesunięcie siatkę zgrubną (sen co 15 min, kroki co 500); − i + krokiem dokładnym, przytrzymanie po ok. 1 s zgrubnym, Page Up zgrubnym.
const { test, expect } = require('@playwright/test');

// Test sam ustawia szerokość i schemat kolorów, więc wystarczy jeden projekt na silnik
test.beforeEach(({}, info) => { test.skip(!/-jasny$/.test(info.project.name), 'szerokość i schemat ustawia sam test'); });

async function open(page, w, scheme) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('konsola: ' + m.text()); });
  await page.emulateMedia({ colorScheme: scheme });
  await page.setViewportSize({ width: w, height: 844 });
  await page.goto('about:blank');
  await page.goto('/index.html#demo-pokaz');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  await page.evaluate(() => { S.tab = 'day'; S.lite = false; SHEET = false; const k = todayKey(); S.meas[k] = { ...(S.meas[k] || {}) }; delete S.meas[k].sleep; delete S.meas[k].steps; WPISY.reset(); render(); });
  return errors;
}
// Położenie kciuka suwaka na ekranie (x) dla bieżącej wartości
const thumb = (page, sel) => page.evaluate((s) => { const r = document.querySelector(s), b = r.getBoundingClientRect(), p = (r.value - r.min) / (r.max - r.min); return { x: b.left + 12 + p * (b.width - 24), y: b.top + b.height / 2, v: +r.value }; }, sel);
const val = (page, sel) => page.evaluate((s) => +document.querySelector(s).value, sel);

// Zdarzenia wskaźnika z podanym czasem (timeStamp) i położeniem (clientX): prędkość nie zależy od obciążenia komputera.
// moves: [[ms od pointerdown, px od startu]], value: wartość suwaka ustawiona po ruchach (zdarzenie input), potem pointerup.
const synth = (page, sel, moves, value) => page.evaluate(({ sel, moves, value }) => {
  const r = document.querySelector(sel), b = r.getBoundingClientRect(), x0 = b.left + 20, T0 = 100000;
  const fire = (type, dx, dt) => { const e = new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x0 + dx, clientY: b.top + b.height / 2, pointerId: 7, isPrimary: true, button: 0 }); Object.defineProperty(e, 'timeStamp', { value: T0 + dt }); r.dispatchEvent(e); };
  fire('pointerdown', 0, 0);
  moves.forEach(([dt, dx]) => fire('pointermove', dx, dt));
  r.value = String(value);
  r.dispatchEvent(new Event('input', { bubbles: true }));
  const out = { v: +r.value, last: WPISY.lastDrag() };
  const m = moves[moves.length - 1] || [0, 0];
  fire('pointerup', m[1], m[0] + 5);
  r.dispatchEvent(new Event('change', { bubbles: true })); // jak przeglądarka po puszczeniu suwaka (zapis od razu przez change)
  return out;
}, { sel, moves, value });
// Prawdziwa mysz: ruchy po 1 px odstępem co najmniej 60 ms mierzonym zegarem (nie stałym czekaniem)
async function slowMouse(page, x, y, n) {
  for (let i = 1; i <= n; i++) { const t0 = Date.now(); await page.mouse.move(x + i, y); while (Date.now() - t0 < 60) await page.waitForTimeout(10); }
}

for (const w of [320, 390]) for (const scheme of ['light', 'dark']) {
  test(`suwak snu ${w}px ${scheme}: prędkość z czasu zdarzeń: wolno (20 i 250 px/s) wartość dokładna spoza siatki, szybko (400 i 10 000 px/s) siatka 15 min`, async ({ page }) => {
    const errors = await open(page, w, scheme);
    await page.locator('#wp_rs').scrollIntoViewIfNeeded();
    const draft = () => page.evaluate(() => WPISY.draft('wp', todayKey()).s);
    // Wolno: 2 px co 100 ms (20 px/s) i 25 px w 100 ms (250 px/s): 425 zostaje (krok dokładny 5 min, poza siatką 15 min)
    let o = await synth(page, '#wp_rs', [[100, 2], [200, 4], [300, 6], [400, 8]], 425);
    expect(o.v).toBe(425); expect(await draft()).toBe(425); expect(o.last.speed).toBeCloseTo(20, 0);
    o = await synth(page, '#wp_rs', [[100, 25]], 430);
    expect(o.v).toBe(430); expect(o.last.speed).toBeCloseTo(250, 0);
    // Szybko: 40 px w 100 ms (400 px/s) i 100 px w 10 ms: 425 i 430 trafiają na siatkę 15 min
    o = await synth(page, '#wp_rs', [[100, 40]], 425);
    expect(o.v).toBe(420); expect(await draft()).toBe(420);
    o = await synth(page, '#wp_rs', [[10, 100]], 430);
    expect(o.v).toBe(435); expect(await draft()).toBe(435);
    expect(errors).toEqual([]);
  });
}

test('suwak snu, prawdziwa mysz: szybkie machnięcie 200 px kończy na siatce 15 min, wolne przeciąganie po 1 px na kroku dokładnym bez przyciągania', async ({ page }) => {
  const errors = await open(page, 390, 'light');
  const r = page.locator('#wp_rs');
  await r.scrollIntoViewIfNeeded();
  // Prędkość liczy aplikacja z czasu zdarzeń wskaźnika (prawdziwy czas). Pod obciążeniem (pełny przebieg, WebKit) zdarzenia potrafią przyjść
  // ponad 0,9 s po sobie i machnięcie wychodzi wolne: wtedy powtórka gestu (do 5 razy). Każda próba sprawdza zgodność: siatka 15 min tylko przy szybkim.
  // Progi i przyciąganie bez zależności od czasu sprawdzają testy zdarzeń syntetycznych wyżej.
  let t, v, L, fast = 0;
  for (let i = 0; i < 5 && !fast; i++) {
    await r.focus();
    await page.keyboard.press('Home');
    t = await thumb(page, '#wp_rs');
    await page.mouse.move(t.x, t.y);
    await page.mouse.down();
    await page.mouse.move(t.x + 260, t.y); // prawie cały tor jednym ruchem
    await page.mouse.up();
    v = await val(page, '#wp_rs'); L = await page.evaluate(() => WPISY.lastDrag());
    if (L.speed > 300) { fast = 1; expect(v % 15, 'szybko: siatka 15 min').toBe(0); } else expect(L.v, `próba ${i + 1}: wolne machnięcie (${Math.round(L.speed)} px/s) bez przyciągania`).toBe(L.raw);
  }
  expect(fast, 'w 5 próbach co najmniej jedno machnięcie szybsze niż próg 300 px/s').toBe(1);
  t = await thumb(page, '#wp_rs');
  await page.mouse.move(t.x, t.y);
  await page.mouse.down();
  await slowMouse(page, t.x, t.y, 8);
  await page.mouse.up();
  v = await val(page, '#wp_rs'); L = await page.evaluate(() => WPISY.lastDrag());
  expect(v % 5, 'wolno: krok dokładny 5 min').toBe(0);
  expect(L.speed, 'wolne przeciąganie poniżej progu').toBeLessThan(300);
  expect(L.v, 'wolno: bez przyciągania do siatki').toBe(L.raw);
  expect(await page.evaluate(() => WPISY.draft('wp', todayKey()).s)).toBe(v);
  expect(errors).toEqual([]);
});

test('suwak kroków: wolne przeciągnięcie daje kroki co 50 spoza siatki 500, szybkie siatkę 500; − i + co 50; Page Up co 500', async ({ page }) => {
  const errors = await open(page, 390, 'light');
  await page.locator('#wp_rk').scrollIntoViewIfNeeded();
  let t = await thumb(page, '#wp_rk');
  await page.mouse.move(t.x, t.y);
  await page.mouse.down();
  let x = t.x, v = await val(page, '#wp_rk');
  for (let i = 0; i < 30 && (i < 4 || v % 500 === 0); i++) { x += 1; await page.mouse.move(x, t.y); await page.waitForTimeout(60); v = await val(page, '#wp_rk'); }
  await page.waitForTimeout(200);
  await page.mouse.up();
  v = await val(page, '#wp_rk');
  expect(v % 50).toBe(0);
  expect(v % 500).not.toBe(0);
  // Szybko: zdarzenia z podanym czasem (100 px w 10 ms), bez zależności od obciążenia; 6550 trafia na siatkę 500
  const o = await synth(page, '#wp_rk', [[10, 100]], 6550);
  v = o.v;
  expect(v).toBe(6500);
  expect(await page.evaluate(() => WPISY.draft('wp', todayKey()).k)).toBe(6500);
  await page.getByRole('button', { name: '50 kroków więcej' }).click();
  expect(await page.evaluate(() => WPISY.draft('wp', todayKey()).k)).toBe(v + 50);
  await page.locator('#wp_rk').focus();
  await page.keyboard.press('PageUp');
  expect(await page.evaluate(() => WPISY.draft('wp', todayKey()).k)).toBe(v + 500);
  await page.keyboard.press('ArrowRight');
  expect(await page.evaluate(() => WPISY.draft('wp', todayKey()).k)).toBe(v + 550);
  expect(await page.evaluate(() => document.getElementById('wp_rk').getAttribute('aria-valuetext').replace(/\D/g, ''))).toBe(String(v + 550)); // wartość dokładna w aria-valuetext
  expect(errors).toEqual([]);
});

test('przytrzymanie + przy śnie: najpierw co 5 min, po ok. 1 s co 15 min (siatka)', async ({ page }) => {
  const errors = await open(page, 390, 'light');
  const plus = page.getByRole('button', { name: 'Sen o 5 minut więcej' });
  await plus.scrollIntoViewIfNeeded();
  const v0 = await val(page, '#wp_rs');
  const b = await plus.boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  // Pierwszy krok odczytany zaraz po obsłudze pointerdown (setTimeout 0 przed powtórzeniem po 300 ms), niezależnie od obciążenia komputera
  await page.evaluate(() => { window.V1 = null; window.addEventListener('pointerdown', () => setTimeout(() => { window.V1 = WPISY.draft('wp', todayKey()).s; }, 0), { once: true }); });
  await page.mouse.down();
  await expect.poll(() => page.evaluate(() => window.V1)).not.toBeNull();
  const v1 = await page.evaluate(() => window.V1);
  // Przyspieszenie zależy od zegarów strony (pod obciążeniem w CI wolniejszych): czekanie na krok zgrubny zamiast stałych 1,6 s
  await expect.poll(() => page.evaluate((a) => WPISY.draft('wp', todayKey()).s - a, v0), { timeout: 10000 }).toBeGreaterThan(9 * 5);
  await page.mouse.up();
  const v2 = await page.evaluate(() => WPISY.draft('wp', todayKey()).s);
  expect(v1 - v0, 'pierwszy krok dokładny').toBe(5);
  expect(v2 % 15, 'po ok. 1 s siatka 15 min').toBe(0);
  expect(v2 - v0, 'przyspieszenie').toBeGreaterThan(9 * 5);
  expect(errors).toEqual([]);
});

test('wzrost (zapis od razu): wolne przeciągnięcie daje każdy centymetr spoza siatki 5 cm, szybkie machnięcie siatkę 5 cm', async ({ page }) => {
  const errors = await open(page, 320, 'light');
  await page.evaluate(() => { S.tab = 'set'; S.cm = '170'; S.touched = { kg: true, cm: true, age: true, goal: true }; render(); });
  await page.locator('#pf_rcm').scrollIntoViewIfNeeded();
  let t = await thumb(page, '#pf_rcm');
  await page.mouse.move(t.x, t.y);
  await page.mouse.down();
  let x = t.x, v = await val(page, '#pf_rcm');
  // Zwykłe wolne przeciągnięcie: ok. 100 px/s
  for (let i = 0; i < 40 && (i < 4 || v % 5 === 0); i++) { x += 2; await page.mouse.move(x, t.y); await page.waitForTimeout(20); v = await val(page, '#pf_rcm'); }
  await page.waitForTimeout(200);
  await page.mouse.up();
  await expect.poll(() => page.evaluate(() => +S.cm % 5)).not.toBe(0);
  await page.locator('#pf_rcm').focus();
  await page.keyboard.press('Home');
  await expect.poll(() => page.evaluate(() => S.cm)).toBe('140');
  // Szybko: zdarzenia z podanym czasem (100 px w 10 ms); 172 trafia na siatkę 5 cm i zapisuje się po puszczeniu
  expect((await synth(page, '#pf_rcm', [[10, 100]], 172)).v).toBe(170);
  await expect.poll(() => page.evaluate(() => S.cm)).toBe('170');
  expect(errors).toEqual([]);
});

test('przytrzymanie + w wierszu z zapisem od razu (kroki w szybkim wpisie): podgląd bez zapisu, jeden zapis po puszczeniu, po ok. 1 s siatka 500', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  await page.goto('/index.html#demo-prosty');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object' && S.lite === true);
  await page.evaluate(() => { SHEET = false; render(); window.PUTS = 0; const q = qSet; window.qSet = (...a) => { if (a[0] === 'steps') PUTS++; return q(...a); }; });
  const plus = page.getByRole('button', { name: '50 kroków więcej' });
  const b = await plus.boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.down();
  // Zegary strony pod obciążeniem CI bywają wolniejsze: czekanie na widoczny podgląd (zmiana, potem siatka 500 po przyspieszeniu) zamiast stałych czasów
  const preview = () => page.evaluate(() => +document.getElementById('q_steps').textContent.replace(/\D/g, ''));
  await expect.poll(preview).not.toBe(5000);
  expect(await page.evaluate(() => (S.meas[todayKey()] || {}).steps), 'w trakcie przytrzymania bez zapisu').toBeUndefined();
  await expect.poll(async () => { const v = await preview(); return v - 5000 > 9 * 50 && v % 500 === 0; }, { timeout: 10000 }).toBe(true);
  expect(await page.evaluate(() => (S.meas[todayKey()] || {}).steps), 'nadal bez zapisu przed puszczeniem').toBeUndefined();
  await page.mouse.up();
  await expect.poll(() => page.evaluate(() => (S.meas[todayKey()] || {}).steps)).toBeDefined();
  await page.waitForTimeout(300);
  const st = await page.evaluate(() => +S.meas[todayKey()].steps);
  expect(st % 500, 'po ok. 1 s siatka 500').toBe(0);
  expect(st - 5000, 'przyspieszenie').toBeGreaterThan(9 * 50);
  expect(await page.evaluate(() => PUTS), 'jeden zapis').toBe(1);
  expect(errors).toEqual([]);
});

test('czas treningu (zapis od razu): Page Up co 5 min, strzałka co 1 min, szybkie przesunięcie na siatce 5 min', async ({ page }) => {
  const errors = await open(page, 320, 'dark');
  await page.evaluate(() => { S.tab = 'train'; S.tr.min = '45'; render(); });
  const r = page.locator('#tr_rmin');
  await r.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => page.evaluate(() => S.tr.min)).toBe('46');
  await page.keyboard.press('PageUp');
  await expect.poll(() => page.evaluate(() => S.tr.min)).toBe('50');
  await expect(page.locator('#tr_rmin')).toBeFocused();
  await r.scrollIntoViewIfNeeded();
  expect((await synth(page, '#tr_rmin', [[10, 100]], 87)).v).toBe(85); // szybko: siatka 5 min
  await expect.poll(() => page.evaluate(() => S.tr.min)).toBe('85');
  expect(await page.evaluate(() => +S.tr.min)).toBeGreaterThan(50);
  expect(errors).toEqual([]);
});

// Przegląd gałęzi (C1, I3): pointercancel i puszczenie poza przyciskiem nie zapisują; prędkość z input, gdy WebKit przerwie wskaźnik
const lite = async (page) => {
  await page.goto('/index.html#demo-prosty');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object' && S.lite === true);
  await page.evaluate(() => { SHEET = false; render(); window.PUTS = 0; const q = qSet; window.qSet = (...a) => { if (a[0] === 'steps') PUTS++; return q(...a); }; });
};
test('przytrzymanie + w zapisie od razu: pointercancel (np. przewijanie) nic nie zapisuje, podgląd wraca do wartości sprzed przytrzymania', async ({ page }) => {
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await lite(page);
  await page.evaluate(() => { const b = document.querySelector('[data-wps="q"] [data-wp="pm:steps:1"]'), r = b.getBoundingClientRect(); b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, clientX: r.left + 5, clientY: r.top + 5, pointerId: 3, isPrimary: true, button: 0 })); });
  await page.waitForTimeout(600);
  await expect(page.locator('#q_steps')).not.toHaveText(/^5\s000$/);
  await page.evaluate(() => window.dispatchEvent(new PointerEvent('pointercancel', { pointerId: 3 })));
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => [PUTS, (S.meas[todayKey()] || {}).steps])).toEqual([0, undefined]);
  await expect(page.locator('#q_steps')).toHaveText(/^5\s000$/);
  expect(errors).toEqual([]);
});
test('przytrzymanie + w zapisie od razu: zsunięcie palca z przycisku i puszczenie obok nic nie zapisuje; puszczenie na przycisku zapisuje raz', async ({ page }) => {
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await lite(page);
  const plus = page.getByRole('button', { name: '50 kroków więcej' }), b = await plus.boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(500);
  await page.mouse.move(b.x + b.width / 2, b.y - 150);
  await page.mouse.up();
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => [PUTS, (S.meas[todayKey()] || {}).steps])).toEqual([0, undefined]);
  await expect(page.locator('#q_steps')).toHaveText(/^5\s000$/);
  await plus.click();
  await expect.poll(() => page.evaluate(() => [PUTS, (S.meas[todayKey()] || {}).steps])).toEqual([1, '5050']);
  expect(errors).toEqual([]);
});
test('suwak snu po pointercancel (natywne przeciąganie w WebKit): prędkość z czasu zdarzeń input, wolno wartość dokładna, szybko siatka 15 min', async ({ page }) => {
  const errors = await open(page, 390, 'light');
  await page.locator('#wp_rs').scrollIntoViewIfNeeded();
  const out = await page.evaluate(() => {
    const r = document.querySelector('#wp_rs'), b = r.getBoundingClientRect(), T0 = 50000, res = [];
    const pe = (type, tgt) => { const e = new PointerEvent(type, { bubbles: true, cancelable: true, clientX: b.left + 30, clientY: b.top + 10, pointerId: 9, isPrimary: true, button: 0 }); Object.defineProperty(e, 'timeStamp', { value: T0 }); tgt.dispatchEvent(e); };
    const inp = (v, dt) => { r.value = String(v); const e = new Event('input', { bubbles: true }); Object.defineProperty(e, 'timeStamp', { value: T0 + dt }); r.dispatchEvent(e); res.push([+r.value, Math.round(WPISY.lastDrag().speed)]); };
    pe('pointerdown', r); pe('pointercancel', r);
    inp(425, 10); inp(430, 510); inp(470, 520);
    r.dispatchEvent(new Event('change', { bubbles: true }));
    return { res, d: WPISY.draft('wp', todayKey()).s };
  });
  expect(out.res[0][0], 'pierwsze zdarzenie: prędkość 0, wartość dokładna').toBe(425);
  expect(out.res[1][0], 'wolno (5 min w 500 ms): wartość dokładna').toBe(430);
  expect(out.res[1][1]).toBeLessThan(300);
  expect(out.res[2][0], 'szybko (40 min w 10 ms): siatka 15 min').toBe(465);
  expect(out.d).toBe(465);
  expect(errors).toEqual([]);
});
