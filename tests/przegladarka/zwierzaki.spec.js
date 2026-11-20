// Nowe zwierzaki w aplikacji (20.11.2026): gąska, kaczuszka, kapibara i kotek na karcie w Moim dniu i na ekranie zwierzaka,
// wybór 4 gatunków w kafelkach z podpisem, bez animacji przy ograniczeniu ruchu (reakcja to wtedy krótki napis).
const { test, expect } = require('@playwright/test');
const path = require('node:path');

// Szerokość, schemat i ograniczenie ruchu ustawia sam test, więc wystarczy jeden projekt na silnik
test.beforeEach(({}, info) => { test.skip(!/-jasny$/.test(info.project.name), 'szerokość i schemat ustawia sam test'); });

const KINDS = { gaska: 'Gąska', kaczka: 'Kaczuszka', kapibara: 'Kapibara', kotek: 'Kotek' };
const SHOTS = process.env.PET_SHOTS || '';

async function open(page, o = {}) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  await page.emulateMedia({ colorScheme: o.scheme || 'light', reducedMotion: o.reduce ? 'reduce' : 'no-preference' });
  await page.setViewportSize({ width: o.w || 390, height: 844 });
  await page.goto('/index.html#demo-pokaz');
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  return errors;
}
const setPet = (page, kind, tab) => page.evaluate(([k, t]) => { SHEET = false; S.lite = false; S.pet = { kind: k, name: 'Kluska', since: '2026-10-01', peak: 40 }; S.tab = t; render(); window.scrollTo(0, 0); }, [kind, tab]);
const noHScroll = (page) => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
const anims = (page) => page.evaluate(() => [...document.querySelectorAll('#main .pet, #main .pet *')].reduce((n, e) => n + e.getAnimations().length, 0));

for (const w of [320, 390]) for (const scheme of ['light', 'dark']) {
  test(`zwierzaki ${w}px ${scheme}: karta w Moim dniu i ekran zwierzaka dla każdego gatunku bez poziomego przewijania`, async ({ page }) => {
    const errors = await open(page, { w, scheme });
    for (const [k, n] of Object.entries(KINDS)) {
      await setPet(page, k, 'day');
      const card = page.locator('#main .petcard');
      await expect(card.locator('svg.pet')).toHaveAttribute('aria-label', new RegExp('^' + n + ': '));
      await expect(card.locator('svg.pet')).toHaveClass(new RegExp('pet-' + k));
      expect(await noHScroll(page), k + ' karta').toBe(true);
      const box = await card.locator('svg.pet').boundingBox();
      expect(box.width, k).toBeGreaterThan(80);
      if (w === 390 && SHOTS) { await card.scrollIntoViewIfNeeded(); await card.screenshot({ path: path.join(SHOTS, `pet-${k}-karta-${scheme}.png`) }); }
      await setPet(page, k, 'pet');
      const big = page.locator('#main .petstage svg.pet.big');
      await expect(big).toHaveAttribute('aria-label', new RegExp('^' + n + ': '));
      await expect(page.locator('#main .petstage')).toContainText(k === 'kotek' ? /Dorosły/ : /Dorosła/);
      expect(await noHScroll(page), k + ' ekran').toBe(true);
      if (w === 390 && SHOTS) await page.screenshot({ path: path.join(SHOTS, `pet-${k}-ekran-${scheme}.png`) });
    }
    expect(errors).toEqual([]);
  });
}

test('zwierzaki: wybór 4 gatunków w kafelkach z widocznym podpisem, podgląd i „Wybieram: Kapibara”', async ({ page }) => {
  const errors = await open(page, { w: 320 });
  await page.evaluate(() => { S.pet = null; S.onb = true; S.tab = 'pet'; render(); });
  const grp = page.getByRole('group', { name: 'Rodzaj towarzysza' });
  for (const n of Object.values(KINDS)) {
    const b = grp.getByRole('button', { name: n, exact: true });
    await expect(b).toBeVisible();
    await expect(b).toHaveText(n);
    const bb = await b.boundingBox();
    expect(bb.height, n).toBeGreaterThanOrEqual(44);
  }
  expect(await noHScroll(page)).toBe(true);
  await grp.getByRole('button', { name: 'Kotek', exact: true }).click();
  await expect(page.getByRole('img', { name: /^Kotek: / })).toBeVisible();
  await page.getByRole('group', { name: 'Rodzaj towarzysza' }).getByRole('button', { name: 'Kapibara', exact: true }).click();
  await page.getByRole('button', { name: 'Wybieram: Kapibara' }).click();
  expect(await page.evaluate(() => S.pet && S.pet.kind)).toBe('kapibara');
  expect(errors).toEqual([]);
});

test('zwierzaki: postać oddycha, a przy ograniczeniu ruchu nie ma animacji; reakcja to krótki napis', async ({ page }) => {
  let errors = await open(page);
  await setPet(page, 'kotek', 'day');
  expect(await anims(page)).toBeGreaterThan(0);
  await page.close();
  const p2 = await page.context().newPage();
  errors = await open(p2, { reduce: true });
  for (const k of Object.keys(KINDS)) {
    await setPet(p2, k, 'day');
    expect(await anims(p2), k).toBe(0);
  }
  await p2.evaluate(() => { PET.react('weigh'); render(); });
  await expect(p2.locator('#main .petcard .petfx')).toHaveText('Zanotowane');
  await expect(p2.locator('#main .pet')).not.toHaveClass(/react-weigh/);
  expect(await p2.evaluate(() => getComputedStyle(document.querySelector('#main .petfx')).animationName)).toBe('none');
  expect(errors).toEqual([]);
});

// Zadanie 2: reakcje na wpisy zdrowotne (pomiary ciała w Pomiarach dnia, ból głowy); napis na karcie zwierzaka
const RSHOTS = process.env.PET_SHOTS || '';
const today = () => new Date().toLocaleDateString('sv-SE');
async function healthOpen(page, o = {}) {
  const errors = await open(page, o);
  await page.evaluate((d) => { SHEET = false; S.lite = false; S.discreet = !!d.discreet; S.pain = {}; S.pet = { kind: d.kind || 'kotek', name: '', since: '2026-10-01', peak: 40 }; S.petSeen = PET.milestones(petCtx()); S.petCeleb = null; S.meas = Object.fromEntries(Object.entries(S.meas || {}).map(([k, v]) => [k, { ...v, waist: undefined, hip: undefined, thigh: undefined }])); S.meas[nAgo(5)] = { ...(S.meas[nAgo(5)] || {}), ffm: '50', fat: '25' }; render(); }, o);
  return errors;
}
const toDay = (page) => page.evaluate(() => { S.tab = 'day'; render(); window.scrollTo(0, 0); });
const shot = async (page, name) => { if (!RSHOTS) return; const c = page.locator('#main .petcard'); await c.scrollIntoViewIfNeeded(); await c.screenshot({ path: path.join(RSHOTS, name) }); };

for (const scheme of ['light', 'dark']) {
  test(`reakcje Zdrowia ${scheme}: wpis FFM daje „Zanotowane”, zalecany obwód serduszka, „Boli mnie głowa” daje „Odpocznij dziś”`, async ({ page }) => {
    const errors = await healthOpen(page, { scheme });
    await page.evaluate(() => { S.tab = 'day'; OPEN_F.add('tanita'); OPEN_F.add('obwody'); render(); }); // pomiary ciała są w Moim dniu (Pomiary dnia)
    await page.locator('#m_ffm').fill('52,4');
    await page.locator('#m_ffm').blur();
    await toDay(page);
    await expect(page.locator('#main .petcard .petfx')).toHaveText('Zanotowane');
    await shot(page, `react-zanotowane-${scheme}.png`);
    await page.locator('#m_waist').fill('81');
    await page.locator('#m_waist').blur();
    await toDay(page);
    await expect(page.locator('#main .petcard .petfx.hearts')).toBeVisible();
    await expect(page.locator('#main .petcard .petfx.hearts')).toContainText('♥');
    await shot(page, `react-serduszka-${scheme}.png`);
    await page.getByRole('button', { name: 'Boli mnie głowa' }).click();
    await expect(page.locator('#main .petcard .petfx')).toHaveText('Odpocznij dziś');
    await shot(page, `react-odpocznij-${scheme}.png`);
    await expect(page.locator('#sr')).toHaveText('Odpocznij dziś'); // ogłoszenie przez istniejący region na żywo
    await expect(page.locator('#main .petcard .petfx')).toHaveAttribute('aria-hidden', 'true');
    expect(await noHScroll(page)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('reakcje Zdrowia: w trybie dyskretnym „Boli mnie głowa” bez napisu „Odpocznij dziś”, bez zmiany punktów dnia', async ({ page }) => {
  const errors = await healthOpen(page, { discreet: true });
  await toDay(page);
  await page.getByRole('button', { name: 'Boli mnie głowa' }).click();
  await page.waitForTimeout(300);
  await expect(page.locator('#main .petcard .petfx')).toHaveCount(0);
  await expect(page.locator('#main .petcard')).not.toContainText('Odpocznij dziś');
  expect(errors).toEqual([]);
});

test('reakcje Zdrowia: „rest” nie zmienia punktów dnia ani serii', async ({ page }) => {
  const errors = await healthOpen(page);
  await toDay(page);
  const before = await page.evaluate(() => { S.pain[todayKey()] = { aura: false, med: false }; const c = petCtx(); const r = [c.dayPts(todayKey()), c.streak()]; delete S.pain[todayKey()]; render(); return r; });
  await page.getByRole('button', { name: 'Boli mnie głowa' }).click();
  await expect(page.locator('#main .petcard .petfx')).toHaveText('Odpocznij dziś');
  const after = await page.evaluate(() => { const c = petCtx(); return [c.dayPts(todayKey()), c.streak()]; });
  expect(after).toEqual(before);
  expect(errors).toEqual([]);
});

test('dymek „czeka na wpis” nie zachodzi na uszy kotka i kapibary', async ({ page }) => {
  const errors = await open(page);
  for (const k of ['kotek', 'kapibara', 'gaska', 'kaczka']) for (const stage of ['chick', 'young', 'adult']) {
    const hit = await page.evaluate(([k, stage]) => {
      document.getElementById('main').innerHTML = '<div class="petstage">' + PET.svg(k, stage, 'hungry', null, true) + '</div>';
      const out = [];
      for (const c of document.querySelectorAll('#main .bubble > circle')) {
        const r = c.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, R = r.width / 2 + 1;
        for (let i = 0; i < 32; i++) { const a = (i / 32) * Math.PI * 2; for (const e of document.elementsFromPoint(cx + R * Math.cos(a), cy + R * Math.sin(a))) if (e.closest('.zw-head')) out.push(e.tagName); }
      }
      return out;
    }, [k, stage]);
    expect(hit, k + ' ' + stage).toEqual([]);
  }
  expect(errors).toEqual([]);
});
