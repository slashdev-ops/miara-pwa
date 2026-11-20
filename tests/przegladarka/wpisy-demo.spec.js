// Propozycja wpisu (demo) w scenariuszu #demo-prosty: jedna karta „Dziś” z suwakami, wpisem z klawiatury i wagą.
const { test, expect } = require('@playwright/test');

async function open(page, w) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  if (w) await page.setViewportSize({ width: w, height: 844 });
  await page.clock.install({ time: new Date('2026-11-20T13:00:00') }); // stała pora dnia: kolejność Sen, Kroki, Waga
  await page.goto('/index.html#demo-prosty');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object' && S.lite === true);
  await page.evaluate(() => { SHEET = false; render(); });
  await expect(page.locator('#wpisydemo')).toBeVisible();
  return errors;
}

test('wpisy-demo: sekcja widoczna, bez poziomego przewijania, bez kółka i żetonów', async ({ page }) => {
  const errors = await open(page);
  await expect(page.locator('#wpisydemo_h')).toHaveText('Propozycje wpisu do wyboru (demo)');
  const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, r: document.querySelector('#wpisydemo').getBoundingClientRect().right, wheel: document.querySelectorAll('#wpisydemo .wd-wheel, #wpisydemo .chip').length }));
  expect(o.sw).toBeLessThanOrEqual(o.cw);
  expect(o.r).toBeLessThanOrEqual(o.cw);
  expect(o.wheel).toBe(0);
  expect(errors).toEqual([]);
});

test('wpisy-demo: „Jak wczoraj” od razu, zmiana wiersza daje „Zatwierdź (1)”, zapis i Cofnij', async ({ page }) => {
  const errors = await open(page);
  const main = page.locator('#wd_main');
  await expect(main).toHaveText('Jak wczoraj');
  await expect(page.locator('#wd_hs')).toHaveText('jak wczoraj?');
  await expect(page.locator('#wd_vs')).toHaveText('7 h 15 min');
  await page.getByRole('button', { name: 'Sen o 15 minut więcej' }).click();
  await expect(page.locator('#wd_vs')).toHaveText('7 h 30 min');
  await expect(page.locator('#wd_hs')).toHaveText('+15 min od wczoraj');
  await expect(main).toHaveText('Zatwierdź (1)');
  await main.scrollIntoViewIfNeeded();
  const box0 = await main.boundingBox();
  await main.click();
  await expect(main).toHaveText('✓ Zapisane · Cofnij');
  expect(await main.boundingBox()).toEqual(box0);
  await expect(page.locator('#wd_sumtxt')).toContainText('Zapisane na dziś: Sen 7 h 30 min · Kroki 6');
  await expect(page.locator('#wd_live')).toHaveText('✓ Zapisane · Cofnij');
  await main.click(); // Cofnij
  await expect(main).toHaveText('Zatwierdź (1)');
  await expect(page.locator('#wd_vs')).toHaveText('7 h 30 min');
  await expect(page.locator('#wd_sumtxt')).toContainText('Nic jeszcze nie zapisano');
  expect(await page.evaluate(() => localStorage.getItem(LS))).toBeNull();
  expect(errors).toEqual([]);
});

test('wpisy-demo: po 5 s „Zobacz, co się zmieniło” otwiera podsumowanie, potem „Gotowe na dziś”; −/+ zastępuje „Zmień”', async ({ page }) => {
  const errors = await open(page);
  const main = page.locator('#wd_main');
  await main.click(); // Jak wczoraj
  await expect(main).toHaveText('✓ Zapisane · Cofnij');
  await expect(page.locator('#wd_card .wd-r.saved')).toHaveCount(3);
  await expect(page.locator('#wd_card .wd-pm .wd-sq:visible')).toHaveCount(0);
  await expect(page.locator('#wd_card .wd-chg:visible')).toHaveCount(3);
  await main.scrollIntoViewIfNeeded();
  const box0 = await main.boundingBox();
  await page.clock.fastForward(5100);
  await expect(main).toHaveText('Zobacz, co się zmieniło');
  expect(await main.boundingBox()).toEqual(box0);
  await expect(page.locator('#wd_stan')).toBeHidden();
  await main.click();
  await expect(page.locator('#wd_stan')).toBeVisible();
  await expect(main).toHaveText('Gotowe na dziś');
  await main.click();
  await expect(page.locator('#wd_stan')).toBeHidden();
  await expect(main).toHaveText('Zobacz, co się zmieniło');
  await page.locator('#wd_card .wd-chg[data-wd="chg:s"]').click();
  await expect(page.locator('#wd_card .wd-r[data-k="s"] .wd-sq:visible')).toHaveCount(2);
  expect(errors).toEqual([]);
});

test('wpisy-demo: „Co to znaczy?” tylko gdy zapisana waga leży poza pasmem', async ({ page }) => {
  const errors = await open(page);
  await page.locator('#wd_main').click();
  await expect(page.locator('#wd_wwb')).toBeHidden();
  await page.locator('#wd_card .wd-chg[data-wd="chg:w"]').click();
  await page.locator('#wd_vw').click();
  await page.keyboard.type('78');
  await page.keyboard.press('Enter');
  await page.locator('#wd_main').click();
  await expect(page.locator('#wd_wwb')).toBeVisible();
  await page.locator('#wd_wwb').click();
  await expect(page.locator('#wd_ww')).toContainText('Turicchi 2020');
  expect(errors).toEqual([]);
});

test('wpisy-demo: kolejność wierszy zależy od pory dnia', async ({ page }) => {
  for (const [t, ord] of [['08:00', 'wsk'], ['13:00', 'skw'], ['19:00', 'ksw']]) {
    const p = await page.context().newPage();
    await p.clock.install({ time: new Date('2026-11-20T' + t + ':00') });
    await p.goto('/index.html#demo-prosty');
    await p.waitForFunction(() => typeof render === 'function' && S.lite === true);
    await p.evaluate(() => { SHEET = false; render(); });
    expect(await p.evaluate(() => [...document.querySelectorAll('#wd_card .wd-r')].map((r) => r.dataset.k).join(''))).toBe(ord);
    await p.close();
  }
});

test('wpisy-demo: dotknięcie wartości otwiera pole z zaznaczeniem, 8:30 + Enter ustawia sen i suwak', async ({ page }) => {
  const errors = await open(page);
  await expect(page.locator('#wd_vs')).toHaveAccessibleName('Sen: 7 h 15 min, dotknij, aby wpisać');
  await page.locator('#wd_vs').click();
  const inp = page.locator('#wd_in');
  await expect(inp).toBeFocused();
  expect(await page.evaluate(() => { const i = document.getElementById('wd_in'); return i.selectionEnd - i.selectionStart === i.value.length && i.value.length > 0; })).toBe(true);
  await page.keyboard.type('8:30');
  await page.keyboard.press('Enter');
  await expect(page.locator('#wd_vs')).toHaveText('8 h 30 min');
  await expect(page.locator('#wd_rs')).toHaveValue('510');
  await expect(page.locator('#wd_in')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('wpisy-demo: zły wpis pokazuje komunikat i zostawia starą wartość, Escape anuluje, kroki i waga z klawiatury', async ({ page }) => {
  const errors = await open(page);
  await page.locator('#wd_vs').click();
  await page.keyboard.type('abc');
  await page.keyboard.press('Enter');
  await expect(page.locator('#wd_es')).toHaveAttribute('role', 'alert');
  await expect(page.locator('#wd_es')).not.toBeEmpty();
  await expect(page.locator('#wd_vs')).toHaveText('7 h 15 min');
  await page.locator('#wd_vs').click();
  await page.keyboard.type('9');
  await page.keyboard.press('Escape');
  await expect(page.locator('#wd_vs')).toHaveText('7 h 15 min');
  await expect(page.locator('#wd_es')).toBeEmpty();
  await page.locator('#wd_vk').click();
  await expect(page.locator('#wd_in')).toHaveAttribute('inputmode', 'numeric');
  await page.keyboard.type('8250');
  await page.keyboard.press('Enter');
  await expect(page.locator('#wd_rk')).toHaveValue('8500');
  await page.locator('#wd_vw').click();
  await expect(page.locator('#wd_in')).toHaveAttribute('inputmode', 'decimal');
  await page.keyboard.type('77,1');
  await page.locator('#wd_vk').focus(); // blur zatwierdza
  await expect(page.locator('#wd_vw')).toContainText('77,1');
  await expect(page.locator('#wd_band')).toContainText('więcej niż zwykłe wahanie');
  expect(errors).toEqual([]);
});

test('wpisy-demo: waga + trzy razy zmienia pasmo; wykres 14 dni widoczny od razu', async ({ page }) => {
  const errors = await open(page);
  await expect(page.locator('#wd_band')).toContainText('mieści się w zwykłym wahaniu');
  const plus = page.getByRole('button', { name: '0,1 kg więcej' });
  for (let i = 0; i < 3; i++) await plus.click();
  await expect(page.locator('#wd_vw')).toContainText('77,1');
  await expect(page.locator('#wd_band')).toContainText('więcej niż zwykłe wahanie');
  const sp = page.locator('#wd_spark');
  await expect(sp).toBeVisible();
  await expect(sp).toHaveAttribute('role', 'img');
  const lab = await sp.getAttribute('aria-label');
  expect(lab).toContain('średnia 7 dni');
  expect(lab).toContain('+0,3 kg od wczoraj');
  expect(await sp.evaluate((e) => e.getBoundingClientRect().height)).toBeLessThanOrEqual(130);
  expect(await page.locator('#wd_spark .wd-zone').count()).toBe(1);
  expect(errors).toEqual([]);
});

test('wpisy-demo: − i + obok siebie w prawej połowie karty, sterowanie co najmniej 44 px', async ({ page }) => {
  const errors = await open(page);
  const o = await page.evaluate(() => {
    const card = document.querySelector('#wd_card').getBoundingClientRect(), half = card.left + card.width / 2;
    const pm = [...document.querySelectorAll('#wd_card .wd-r')].map((r) => { const b = r.querySelectorAll('.wd-pm button'), a = b[0].getBoundingClientRect(), c = b[1].getBoundingClientRect(); return { gap: c.left - a.right, left: a.left >= half }; });
    const ctl = [...document.querySelectorAll('#wpisydemo button, #wpisydemo summary, #wpisydemo input')].filter((e) => e.getClientRects().length).map((e) => ({ t: e.getAttribute('aria-label') || e.textContent || e.id, h: e.getBoundingClientRect().height, w: e.getBoundingClientRect().width }));
    return { pm, ctl };
  });
  expect(o.pm.length).toBe(3);
  for (const r of o.pm) { expect(r.gap).toBeLessThan(16); expect(r.left).toBe(true); }
  for (const c of o.ctl) { expect(c.h, c.t).toBeGreaterThanOrEqual(44); expect(c.w, c.t).toBeGreaterThanOrEqual(44); }
  expect(errors).toEqual([]);
});

test('wpisy-demo: przy 390 px karta Dziś najwyżej 780 px, przy 320 px bez poziomego przewijania', async ({ page }) => {
  const errors = await open(page, 390);
  expect(await page.evaluate(() => document.querySelector('#wd_card').getBoundingClientRect().height)).toBeLessThanOrEqual(780);
  await page.setViewportSize({ width: 320, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('wpisy-demo: po ponownym narysowaniu widoku sekcja nadal działa', async ({ page }) => {
  const errors = await open(page);
  await page.evaluate(() => render());
  await page.getByRole('button', { name: 'Sen o 15 minut więcej' }).click();
  await expect(page.locator('#wd_vs')).toHaveText('7 h 30 min');
  expect(errors).toEqual([]);
});
