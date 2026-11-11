// Miara w prawdziwej przeglądarce: błędy strony i CSP, szerokość ekranu, kontrast z wyliczonych kolorów (WCAG 1.4.3, 1.4.11),
// zaznaczanie wartości w polu, kopia bez danych o zdrowiu, praca bez sieci. Uruchomienie: npm test (w tym katalogu).
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..', '..');
const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const CSP = vercel.headers.flatMap((h) => h.headers).find((h) => h.key === 'Content-Security-Policy').value
  // upgrade-insecure-requests pominięte: WebKit przenosi wtedy lokalne http://127.0.0.1 na https; produkcja działa na https
  .split(';').map((d) => d.trim()).filter((d) => d && d !== 'upgrade-insecure-requests').join('; ');
const VIEWS = ['meals', 'train', 'day', 'health', 'set', 'sos', 'labs', 'review', 'knee', 'impact', 'challenge', 'pet', 'krok', 'mob'];
const MAIN = ['meals', 'train', 'day', 'health', 'set', 'pet', 'mob'];

// Nagłówek CSP jak na Vercelu; błędy strony, konsoli i naruszenia CSP zbierane do sprawdzenia na końcu testu
async function open(page, hash = '#demo-pokaz') {
  const errors = [];
  page.on('pageerror', (e) => errors.push('strona: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('konsola: ' + m.text()); });
  await page.addInitScript(() => document.addEventListener('securitypolicyviolation', (e) => console.error('CSP: ' + e.violatedDirective + ' ' + e.blockedURI)));
  await page.route('**/*', async (route) => {
    const res = await route.fetch();
    await route.fulfill({ response: res, headers: { ...res.headers(), 'content-security-policy': CSP } });
  });
  await page.goto('/index.html' + hash);
  await page.waitForFunction(() => typeof render === 'function' && typeof S === 'object');
  return errors;
}
const show = (page, tab) => page.evaluate((t) => { S.tab = t; render(); window.scrollTo(0, 0); }, tab);

// Kontrast liczony w stronie: kolor przez canvas (obsługuje rgb, color(srgb …), color-mix), tło z najbliższego
// nieprzezroczystego przodka; element z gradientem, obrazem albo półprzezroczystością po drodze jest pomijany.
const CONTRAST_JS = () => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true });
  const rgba = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const lum = (c) => { const v = c.slice(0, 3).map((x) => x / 255).map((x) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4))); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const bgOf = (el) => {
    for (let e = el; e; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.backgroundImage !== 'none' || Number(s.opacity) < 1) return null;
      const c = rgba(s.backgroundColor);
      if (c[3] === 1) return c;
      if (c[3] > 0) return null;
    }
    return rgba(getComputedStyle(document.body).backgroundColor);
  };
  const visible = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
  return { rgba, ratio, bgOf, visible };
};

// Elementy tekstu z kontrastem poniżej progu na bieżącym ekranie
const lowContrast = (page) => page.evaluate((src) => {
  const { rgba, ratio, bgOf, visible } = eval(src)();
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el) || el.closest('svg,[aria-hidden="true"],:disabled')) continue;
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own) continue;
    const s = getComputedStyle(el), bg = bgOf(el);
    if (!bg) continue;
    const fg = rgba(s.color);
    if (fg[3] < 1) continue;
    const size = parseFloat(s.fontSize), bold = Number(s.fontWeight) >= 700;
    const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5, r = ratio(fg, bg);
    if (r < need) out.push(`${el.tagName.toLowerCase()}.${el.className} „${el.textContent.trim().slice(0, 30)}” ${r.toFixed(2)}`);
  }
  return out;
}, `(${CONTRAST_JS})`);

test('każdy widok bez błędów strony i CSP, bez przewijania w poziomie', async ({ page }) => {
  const errors = await open(page);
  const wide = [];
  for (const v of VIEWS) {
    await show(page, v);
    const w = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
    if (w[0] > w[1]) wide.push(`${v}: ${w[0]} > ${w[1]}`);
  }
  expect(wide, 'przewijanie w poziomie').toEqual([]);
  expect(errors, 'błędy strony').toEqual([]);
});

test('tekst ma kontrast co najmniej 4,5:1 (duży 3:1) na głównych ekranach', async ({ page }) => {
  const errors = await open(page);
  const bad = [];
  for (const v of MAIN) {
    await show(page, v);
    const found = await lowContrast(page);
    for (const f of found) bad.push(`${v}: ${f}`);
  }
  expect([...new Set(bad)], 'za słaby kontrast').toEqual([]);
  expect(errors).toEqual([]);
});

test('obramowanie pól co najmniej 3:1 względem tła (WCAG 1.4.11)', async ({ page }) => {
  const errors = await open(page);
  const bad = [];
  for (const v of ['set', 'health', 'train', 'day']) {
    await show(page, v);
    const found = await page.evaluate((src) => {
      const { rgba, ratio, bgOf, visible } = eval(src)();
      const out = [];
      for (const el of document.querySelectorAll('input[type=text],input[type=date],input[type=password],select,textarea')) {
        if (!visible(el)) continue;
        const s = getComputedStyle(el);
        if (parseFloat(s.borderTopWidth) === 0) continue;
        const bg = bgOf(el.parentElement);
        if (!bg) continue;
        const r = ratio(rgba(s.borderTopColor), bg);
        if (r < 3) out.push(`#${el.id || el.tagName.toLowerCase()} ${r.toFixed(2)}`);
      }
      return out;
    }, `(${CONTRAST_JS})`);
    for (const f of found) bad.push(`${v}: ${f}`);
  }
  expect(bad, 'za słabe obramowanie').toEqual([]);
  expect(errors).toEqual([]);
});

test('dotknięcie pola zaznacza wartość, wpis ją zastępuje', async ({ page }) => {
  const errors = await open(page);
  await show(page, 'set');
  const kg = page.locator('#f_kg');
  await kg.scrollIntoViewIfNeeded();
  // zajęty procesor: klawisz może przyjść przed setTimeout(…, 0); zaznaczenie nie może od niego zależeć (CI 09.11.2026: „8750,1”)
  await page.evaluate(() => { const st = window.setTimeout; window.setTimeout = (f, d, ...a) => (d ? st(f, d, ...a) : 0); });
  await kg.click();
  await page.keyboard.type('75');
  await expect(kg).toHaveValue('75');
  expect(errors).toEqual([]);
});

test('drugie dotknięcie ustawia kursor do poprawki jednej cyfry', async ({ page }) => {
  const errors = await open(page);
  await show(page, 'set');
  const kg = page.locator('#f_kg');
  await kg.scrollIntoViewIfNeeded();
  await kg.click();
  await expect.poll(() => kg.evaluate((el) => el.selectionEnd - el.selectionStart)).toBe(4);
  await page.waitForTimeout(100);
  await kg.click({ position: { x: 8, y: 10 } });
  await expect.poll(() => kg.evaluate((el) => el.selectionEnd - el.selectionStart)).toBe(0);
  expect(errors).toEqual([]);
});

test('ekran główny: kroki w Ustawieniach, iPhone najpierw na iPhonie', async ({ page }) => {
  const errors = await open(page);
  await show(page, 'set');
  const sec = await page.evaluate(() => { const h = document.getElementById('ekran'); let t = h.textContent, e = h.nextElementSibling; while (e && e.tagName !== 'H2') { t += ' ' + e.textContent; e = e.nextElementSibling; } return { t, ua: navigator.userAgent }; });
  expect(sec.t).toContain('Do ekranu głównego');
  expect(sec.t).toContain('Zainstaluj i utwórz skrót');
  if (sec.ua.includes('iPhone')) expect(sec.t.indexOf('iPhone')).toBeLessThan(sec.t.indexOf('Android'));
  await expect(page.locator('#ekran')).toBeVisible();
  expect(errors).toEqual([]);
});

test('Mój dzień: cel wybrany dotykiem, zdarzenia z danych i lista wpływów ze źródłami', async ({ page }) => {
  const errors = await open(page);
  await page.evaluate(() => { S.cel = null; });
  await show(page, 'day');
  await expect(page.locator('#zdarzenia li').first()).toBeVisible();
  const btn = page.locator('#cel [data-cel]').first();
  await btn.scrollIntoViewIfNeeded();
  await btn.click();
  await expect(page.locator('#cel')).toContainText('Na co jeszcze wpływa');
  await expect(page.locator('#cel a[href^="https://"]').first()).toBeVisible();
  expect(await page.evaluate(() => S.cel && S.cel.since === todayKey())).toBe(true);
  expect(errors).toEqual([]);
});

test('kopia bez danych o zdrowiu ma tylko ustawienia, wczytanie nie kasuje danych', async ({ page }) => {
  const errors = await open(page);
  const r = await page.evaluate(() => {
    const keys = Object.keys(JSON.parse(bkBuild(true)).data).sort();
    const before = [S.kg, Object.keys(S.meas).length];
    BK_PENDING = JSON.parse(bkBuild(true)); BK_PENDING.data.discreet = true; S.tab = 'set'; render();
    document.querySelector('[data-bkapply="1"]').click();
    return { keys, before, after: [S.kg, Object.keys(S.meas).length], discreet: S.discreet };
  });
  expect(r.keys).toEqual(['discreet', 'ord', 'pet', 'prices', 'tips', 'toastLen']);
  expect(r.after).toEqual(r.before);
  expect(r.discreet).toBe(true);
  expect(errors).toEqual([]);
});

test('wybór towarzysza: dotknięcie to podgląd, zatwierdza przycisk „Wybieram”', async ({ page }) => {
  const errors = await open(page, '#demo-start');
  await page.evaluate(() => { S.onb = true; });
  await show(page, 'pet');
  await page.getByRole('button', { name: 'Kaczuszka' }).click();
  await expect(page.getByRole('button', { name: 'Wybieram: Kaczuszka' })).toBeVisible();
  expect(await page.evaluate(() => S.pet)).toBeNull();
  await page.getByRole('button', { name: 'Gąska' }).click();
  await page.getByRole('button', { name: 'Wybieram: Gąska' }).click();
  expect(await page.evaluate(() => S.pet && S.pet.kind)).toBe('gaska');
  expect(errors).toEqual([]);
});

test('usunięcie wpisu ma „Cofnij” w komunikacie i przywraca wpis', async ({ page }) => {
  const errors = await open(page);
  await show(page, 'day');
  const n = await page.evaluate(() => day().length);
  await page.locator('[data-del]').first().scrollIntoViewIfNeeded();
  await page.locator('[data-del]').first().click();
  expect(await page.evaluate(() => day().length)).toBe(n - 1);
  await page.locator('#toast').getByRole('button', { name: 'Cofnij' }).click();
  expect(await page.evaluate(() => day().length)).toBe(n);
  expect(errors).toEqual([]);
});

test('brzuch i jelita (#demo-jelita): dziennik czytelny, kontrast, bez ramki w ramce, bez przewijania w poziomie', async ({ page }) => {
  const errors = await open(page, '#demo-jelita');
  await show(page, 'day');
  await page.locator('#fold_brzuch summary').click();
  await expect(page.locator('#fold_brzuch')).toContainText('dni z wzdęciem 5 lub więcej');
  await page.locator('#fold_brzuch [data-gutb="4"]').click();
  expect(await page.evaluate(() => S.gut[todayKey()].b)).toBe(4);
  await page.evaluate(() => { document.getElementById('fold_brzuch').open = true; });
  expect(await lowContrast(page), 'za słaby kontrast').toEqual([]);
  const nested = await page.evaluate(() => [...document.querySelectorAll('#fold_brzuch .chip:not(.exc)')].filter((el) => { const s = getComputedStyle(el); return parseFloat(s.borderTopWidth) > 0 || s.boxShadow !== 'none'; }).length);
  expect(nested, 'ramka w ramce').toBe(0);
  const w = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  expect(w[0]).toBeLessThanOrEqual(w[1]);
  await show(page, 'health');
  await expect(page.locator('#main')).toContainText('Środki z badań');
  expect(errors).toEqual([]);
});

test('wszystkie schorzenia i Yaz: sygnał UKMEC, następny cel, schorzenia razem, zapowiedź zwierzaka', async ({ page }) => {
  const errors = await open(page, '#demo-wszystkie');
  await show(page, 'day');
  await expect(page.locator('.note.warn').filter({ hasText: 'UKMEC 2025' })).toBeVisible();
  await expect(page.locator('#cel')).toContainText('Następny cel');
  await expect(page.locator('#fold_razem summary')).toHaveText('Twoje schorzenia razem');
  await expect(page.locator('.petnext').first()).toBeVisible();
  expect(await lowContrast(page), 'za słaby kontrast').toEqual([]);
  const w = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  expect(w[0]).toBeLessThanOrEqual(w[1]);
  await show(page, 'pet');
  await expect(page.getByRole('heading', { name: 'Co się zmieni' })).toBeVisible();
  expect(errors).toEqual([]);
});

// Paleta 2+1 (rada/2026-11-10_kolory-2-1.md): piasek i las jako bazy, terakota jako akcent; tło z charakterem; stany
const PAL_JS = () => {
  const { rgba, ratio } = eval(`(${window.__CJS})`)();
  const v = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  return { rgba, ratio, v };
};
async function pal(page) { await page.evaluate((src) => { window.__CJS = src; }, CONTRAST_JS.toString()); }

test('paleta 2+1: akcent, las i obramowanie kafelków z kontrastem do tła', async ({ page }) => {
  const errors = await open(page);
  await pal(page);
  const r = await page.evaluate((src) => {
    const { rgba, ratio, v } = eval(`(${src})`)();
    const bg = rgba(v('--bg')), c = (a, b) => ratio(rgba(v(a)), b ? rgba(v(b)) : bg);
    return { accent: c('--accent'), onAccent: c('--on-accent', '--accent'), green: c('--green'), edge: c('--edge'), edgeSurf: c('--edge', '--surface') };
  }, PAL_JS.toString());
  expect(r.accent, 'akcent do tła').toBeGreaterThanOrEqual(3);
  expect(r.onAccent, 'tekst na akcencie').toBeGreaterThanOrEqual(4.5);
  expect(r.green, 'las do tła').toBeGreaterThanOrEqual(3);
  expect(r.edge, 'obramowanie kafelka do tła').toBeGreaterThanOrEqual(3);
  expect(r.edgeSurf, 'obramowanie kafelka do kafelka').toBeGreaterThanOrEqual(3);
  expect(errors).toEqual([]);
});

test('tło z charakterem: plamy w body::before (najwyżej 0,08), body z jednolitym kolorem', async ({ page }) => {
  const errors = await open(page);
  const r = await page.evaluate(() => {
    const b = getComputedStyle(document.body), p = getComputedStyle(document.body, '::before');
    const alphas = [...p.backgroundImage.matchAll(/rgba?\(([^)]+)\)/g)].map((m) => { const x = m[1].split(/[ ,/]+/).filter(Boolean); return x.length > 3 ? parseFloat(x[3]) : 1; });
    return { bodyImg: b.backgroundImage, img: p.backgroundImage, alphas, pos: p.position, z: p.zIndex, pe: p.pointerEvents };
  });
  expect(r.bodyImg).toBe('none');
  expect(r.img).toContain('gradient');
  expect(r.alphas.length).toBeGreaterThan(0);
  expect(Math.max(...r.alphas)).toBeLessThanOrEqual(0.08);
  expect(r.pos).toBe('fixed');
  expect(r.pe).toBe('none');
  expect(errors).toEqual([]);
});

test('kafelki i przyciski-kafelki mają obramowanie co najmniej 3:1 do tła pod nimi', async ({ page }) => {
  const errors = await open(page);
  const bad = [];
  for (const v of ['day', 'meals', 'set']) {
    await show(page, v);
    const found = await page.evaluate((src) => {
      const { rgba, ratio, bgOf, visible } = eval(src)();
      const out = [];
      for (const el of document.querySelectorAll('.panel,.fold,.chip,.seg,.petcard,.note:not(.warn):not(.demo)')) {
        if (!visible(el)) continue;
        // panel w rozwijanej sekcji albo w innym panelu: obramowanie ma kontener
        if (el.parentElement.closest('.panel,.fold,.note,.petcard,.card')) continue; // wewnątrz kafelka ramkę ma kafelek
        const s = getComputedStyle(el), bg = bgOf(el.parentElement);
        if (!bg) continue;
        const w = parseFloat(s.borderTopWidth), r = ratio(rgba(s.borderTopColor), bg);
        if (!(w >= 1) || r < 3) out.push(`${el.className.split(' ')[0]} ${w}px ${r.toFixed(2)}`);
      }
      return out;
    }, `(${CONTRAST_JS})`);
    for (const f of found) bad.push(`${v}: ${f}`);
  }
  expect([...new Set(bad)], 'za słabe obramowanie kafelka').toEqual([]);
  expect(errors).toEqual([]);
});

test('każdy stan ma reakcję: dotknięcie, fokus z klawiatury w akcencie, wybrany w lesie, wyłączony', async ({ page }) => {
  const errors = await open(page);
  await show(page, 'set');
  const chip = page.locator('.chip').first();
  await chip.scrollIntoViewIfNeeded();
  const look = () => chip.evaluate((el) => { const s = getComputedStyle(el); return [s.backgroundColor, s.transform, s.borderTopColor, s.boxShadow].join('|'); });
  const rest = await look();
  const box = await chip.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  const pressed = await look();
  await page.mouse.up();
  expect(pressed, 'dotknięcie zmienia wygląd').not.toBe(rest);
  // Fokus z klawiatury: obrys co najmniej 3 px w kolorze akcentu
  await page.evaluate(() => document.querySelector('.seg button').scrollIntoView());
  await page.locator('.seg button').first().focus();
  await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
  const f = await page.evaluate(() => { const a = document.activeElement, s = getComputedStyle(a), acc = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(); const cv = document.createElement('canvas').getContext('2d'); cv.fillStyle = acc; return { w: parseFloat(s.outlineWidth), c: s.outlineColor, acc: cv.fillStyle, style: s.outlineStyle }; });
  expect(f.w).toBeGreaterThanOrEqual(3);
  expect(f.style).not.toBe('none');
  const hex = (c) => { const m = c.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number); return '#' + m.map((x) => Math.round(x).toString(16).padStart(2, '0')).join(''); };
  expect(hex(f.c)).toBe(f.acc.toLowerCase());
  // Wybrany: tło w kolorze lasu; wyłączony: przygaszony
  const sel = await page.evaluate(() => { const b = document.querySelector('.seg button[aria-pressed="true"]'), g = getComputedStyle(document.documentElement).getPropertyValue('--green').trim(), cv = document.createElement('canvas').getContext('2d'); cv.fillStyle = g; const bg = getComputedStyle(b).backgroundColor.match(/\d+/g).slice(0, 3).map((x) => (+x).toString(16).padStart(2, '0')).join(''); return { bg: '#' + bg, g: cv.fillStyle.toLowerCase() }; });
  expect(sel.bg).toBe(sel.g);
  const dis = await page.evaluate(() => { const b = document.createElement('button'); b.className = 'btn'; b.disabled = true; b.textContent = 'x'; document.getElementById('main').appendChild(b); return parseFloat(getComputedStyle(b).opacity); });
  expect(dis).toBeLessThan(1);
  expect(errors).toEqual([]);
});

// Strażnik prostoty (rada/2026-11-11_prostota.md): ramka tylko na kafelku najwyższego poziomu, nigdy ramka w ramce
test('bez ramki w ramce: wewnątrz kafelka panel, sekcja, notka, żeton i przełącznik bez obramowania i cienia', async ({ page }) => {
  const errors = await open(page);
  const bad = [];
  for (const v of ['day', 'meals', 'train', 'health', 'set', 'pet', 'mob']) {
    await show(page, v);
    await page.evaluate(() => document.querySelectorAll('details.fold').forEach((d) => { d.open = true; }));
    const found = await page.evaluate(() => {
      const TILE = '.panel,.fold,.note,.petcard,.card', IN = '.panel,.fold,.note,.card,.seg,.chip:not(.exc)';
      const out = [];
      for (const el of document.querySelectorAll('#main ' + IN.split(',').join(',#main '))) {
        if (!el.parentElement.closest(TILE)) continue;
        const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
        const s = getComputedStyle(el);
        if (parseFloat(s.borderTopWidth) > 0 || s.boxShadow !== 'none') out.push(el.className.split(' ').slice(0, 2).join('.'));
      }
      return out;
    });
    for (const f of found) bad.push(`${v}: ${f}`);
  }
  expect([...new Set(bad)], 'ramka w ramce').toEqual([]);
  expect(errors).toEqual([]);
});

test.describe('ograniczenie ruchu', () => {
  test.use({ reducedMotion: 'reduce' });
  test('przy ograniczeniu ruchu dotknięcie nie skaluje przycisku', async ({ page }) => {
    await open(page);
    await show(page, 'set');
    const chip = page.locator('.chip').first();
    await chip.scrollIntoViewIfNeeded();
    const box = await chip.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    const t = await chip.evaluate((el) => getComputedStyle(el).transform);
    await page.mouse.up();
    expect(t).toBe('none');
  });
});

test.describe('bez sieci', () => {
  test.use({ serviceWorkers: 'allow' });
  test('po pierwszym otwarciu aplikacja działa bez sieci', async ({ page, context }) => {
    await page.goto('/index.html');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    await page.evaluate(() => navigator.serviceWorker.ready);
    await context.setOffline(true);
    await page.reload();
    await expect(page.locator('header h1')).toHaveText(/.+/);
    await context.setOffline(false);
  });
});

// Przegląd ekranów 11.11.2026: po akcji na tym samym ekranie przycisk zostaje pod palcem i ma fokus (WCAG 2.4.3);
// gdy przycisk znika, fokus trafia na nagłówek jego sekcji; po zmianie ekranu na tytuł ekranu
test.describe('po akcji wszystko na miejscu', () => {
  const at = (page, sel) => page.evaluate((s) => { const b = document.querySelector(s); b.scrollIntoView({ block: 'center' }); return b.getBoundingClientRect().top; }, sel);
  test('przycisk na tym samym ekranie zostaje w miejscu i ma fokus', async ({ page }) => {
    const errors = await open(page);
    await show(page, 'day');
    for (const sel of ['button[data-cyc="2"]', 'button[data-swap="1"]']) {
      if (sel.includes('swap')) await show(page, 'meals');
      const y0 = await at(page, sel);
      await page.locator(sel).click();
      await page.waitForTimeout(300);
      const r = await page.evaluate((s) => { const b = document.querySelector(s); return { y: b.getBoundingClientRect().top, f: document.activeElement === b }; }, sel);
      expect(Math.abs(r.y - y0), sel).toBeLessThanOrEqual(2);
      expect(r.f, sel + ' fokus').toBe(true);
    }
    expect(errors).toEqual([]);
  });
  test('gdy przycisk znika, fokus trafia na nagłówek jego sekcji, nie na stronę', async ({ page }) => {
    await open(page);
    await show(page, 'day');
    await at(page, 'button[data-pain="today"]');
    await page.locator('button[data-pain="today"]').click();
    await page.waitForTimeout(300);
    const f = await page.evaluate(() => { const a = document.activeElement; return { tag: a.tagName, txt: a.textContent.trim().slice(0, 20), vis: a.getBoundingClientRect().top >= 0 && a.getBoundingClientRect().bottom <= innerHeight }; });
    expect(f.tag).toMatch(/^H[23]$/);
    expect(f.vis).toBe(true);
  });
  test('po przejściu na inny ekran fokus jest na tytule ekranu, strona na górze', async ({ page }) => {
    await open(page);
    await show(page, 'health');
    await at(page, 'button[data-tab="labs"]');
    await page.locator('button[data-tab="labs"]').click();
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => ({ y: scrollY, f: document.activeElement === document.querySelector('header h1') }));
    expect(r.y).toBe(0);
    expect(r.f).toBe(true);
  });
  test('Zdrowie: pierwsza wybrana choroba zostaje widoczna pod palcem z fokusem', async ({ page }) => {
    await open(page);
    await page.evaluate(() => { S.prof = { cond: {}, pill: '' }; S.tab = 'health'; render(); });
    const sel = 'button[data-cond="hashi"]', y0 = await at(page, sel);
    await page.locator(sel).click();
    await page.waitForTimeout(300);
    const r = await page.evaluate((s) => { const b = document.querySelector(s), q = b.getBoundingClientRect(); return { y: q.top, h: q.height, f: document.activeElement === b, on: b.getAttribute('aria-pressed') }; }, sel);
    expect(r.h).toBeGreaterThan(0);
    expect(Math.abs(r.y - y0)).toBeLessThanOrEqual(2);
    expect(r.f).toBe(true);
    expect(r.on).toBe('true');
  });
  test('przejście z Pomocy (Pokaż) daje fokus na miejscu docelowym', async ({ page }) => {
    await open(page);
    await show(page, 'help');
    const nav = await page.evaluate(() => [...document.querySelectorAll('#main button[data-nav]')].map((b) => b.dataset.nav).find((n) => !n.startsWith('help') && n.split('#')[1]));
    await page.locator(`button[data-nav="${nav}"]`).first().click();
    await page.waitForTimeout(900);
    const id = await page.evaluate(() => { const a = document.activeElement; return a.id || (a.closest('[id]') || {}).id; });
    expect(id).toBe(nav.split('#')[1]);
  });
  test('kolejny krok na tym samym ekranie (Ochota) daje fokus na nagłówku kroku', async ({ page }) => {
    await open(page);
    await show(page, 'sos');
    await page.locator('button[data-trig="stres"]').click();
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => document.activeElement.tagName)).toMatch(/^H[123]$/);
  });
  test('Mój dzień: lista „Dziś” widoczna bez przewijania', async ({ page }) => {
    await open(page);
    await show(page, 'day');
    const top = await page.evaluate(() => [...document.querySelectorAll('#main h2')].find((h) => h.textContent.startsWith('Dziś:')).getBoundingClientRect().top);
    expect(top).toBeLessThan(await page.evaluate(() => innerHeight * 0.6));
  });
});

// Mniej ramek: sąsiadujące zwinięte sekcje tworzą jedną listę (jedna ramka, linia między wierszami, bez odstępu i cienia)
test('mniej ramek: sąsiadujące sekcje zwinięte to jedna lista na każdym ekranie', async ({ page }) => {
  await open(page);
  let pairs = 0;
  for (const tab of MAIN) {
    await show(page, tab);
    const bad = await page.evaluate(() => {
      const out = [];
      for (const b of document.querySelectorAll('#main details.fold + details.fold')) {
        const a = b.previousElementSibling, ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(), sa = getComputedStyle(a), sb = getComputedStyle(b);
        if (Math.abs(rb.top - ra.bottom) > 1 || parseFloat(sb.borderTopLeftRadius) > 0 || parseFloat(sa.borderBottomLeftRadius) > 0 || sb.boxShadow !== 'none')
          out.push(b.querySelector('summary').textContent.trim().slice(0, 30));
      }
      return { out, n: document.querySelectorAll('#main details.fold + details.fold').length };
    });
    pairs += bad.n;
    expect(bad.out, tab).toEqual([]);
  }
  expect(pairs).toBeGreaterThan(3);
});
