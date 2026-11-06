// Test dymny: uruchamia app.js z atrapą DOM i sprawdza widoki oraz spójność danych.
// Uruchom: node tests/smoke.js   (kod wyjścia 1 przy błędzie)
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const els = {}, lis = {};
const mk = (id) => els[id] || (els[id] = { id, innerHTML: '', textContent: '', value: '', checked: false, style: {}, classList: { add() {}, remove() {} }, insertAdjacentHTML(pos, h) { this.innerHTML = h + this.innerHTML; } });
const sandbox = {
  document: { getElementById: mk, querySelector: () => null, addEventListener(t, f) { (lis[t] = lis[t] || []).push(f); } },
  window: { scrollTo() {} },
  localStorage: { getItem: () => null, setItem() {} },
  navigator: {},
  console, setTimeout, clearTimeout, setInterval, clearInterval, Date, Math, JSON, Promise, URL, Blob,
  crypto: globalThis.crypto, TextEncoder, TextDecoder, btoa, atob,
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
const petPath = path.join(root, 'pet.js');
if (fs.existsSync(petPath)) vm.runInContext(fs.readFileSync(petPath, 'utf8'), sandbox);
vm.runInContext(code + '\n;globalThis.__T={S:()=>S,render,MEALS,STEPS,PLAN,ING,LABS,num,checkNum,level,esc,save,setDemo:(v)=>{DEMO=v},setRedraw:(v)=>{REDRAW=v},ch:()=>CH,chSync,petCtx,dayPts,todayKey,guideSteps:()=>guideSteps(),guideToast:(b)=>guideToast(b),streak,bkBuild,kopiaDerive,kopiaEncrypt,kopiaDecrypt,kopiaSetup,KS,kopiaDue,kopiaSend,kopiaAuto};', sandbox);
const T = sandbox.__T;

let ok = 0, bad = 0;
const check = (name, cond, info) => { if (cond) ok++; else bad++; console.log((cond ? 'OK   ' : 'BLAD ') + name + (info ? ' -> ' + info : '')); };

check('index.html: brak skryptów i stylów wstawionych w HTML (CSP)', !/<script>|<style>|\son[a-z]+=/i.test(html));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
const missing = manifest.icons.map((i) => i.src.split('?')[0]).concat(['icons/apple-touch-icon.png']).filter((f) => !fs.existsSync(path.join(root, f)));
check('manifest: nazwa Miara i wszystkie ikony istnieją', manifest.name === 'Miara' && !missing.length, missing.join(', '));
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const swMissing = [...sw.matchAll(/'\.\/([^']+)'/g)].map((m) => m[1].split('?')[0]).filter((f) => f && !fs.existsSync(path.join(root, f)));
check('service worker: każdy plik z listy istnieje', !swMissing.length, swMissing.join(', '));
check('zgodność danych: klucz pamięci i identyfikator kopii bez zmian', code.includes("'talerz-trening-v1'") && code.includes("app:'talerz-i-trening'"));
check('app.js: brak atrybutów on...= (CSP)', !/\son[a-z]+=["']/i.test(code));
check('każde danie ma kroki przygotowania', T.MEALS.every((m) => Array.isArray(T.STEPS[m.id]) && T.STEPS[m.id].length >= 2));
check('każdy składnik dania istnieje w bazie', T.MEALS.every((m) => m.ing.every(([id]) => T.ING[id])));
check('plan tygodnia wskazuje istniejące dania', Object.values(T.PLAN).every((d) => d.every((id) => T.MEALS.some((m) => m.id === id))));
check('kroki bez płyty grzewczej', !T.MEALS.some((m) => /patel|smaż|garn|płyt/i.test(T.STEPS[m.id].join(' '))));

// Testy wpisów E1-E11 z testu użytkownika (05.11.2026)
const cn = (k, v) => T.checkNum(k, v);
check('E1-E2 sen 7:30, 7h30, 7 h 30 min to 7,5 h', ['7:30', '7h30', '7 h 30 min', '7,5'].every((v) => !cn('meas.d.sleep', v).err && T.num(v) === 7.5));
check('E3-E5 sen 450, -3, abc odrzucone', ['450', '-3', 'abc'].every((v) => cn('meas.d.sleep', v).err));
check('E6 waga -80, 0, 820 odrzucone; 82,4 i 82,4 kg przyjęte', ['-80', '0', '820'].every((v) => cn('meas.d.w', v).err) && T.num(cn('meas.d.w', '82,4 kg').s) === 82.4);
check('E7 kroki 10 000 i 10.000 to 10000', ['10 000', '10.000', '10\u00a0000'].every((v) => T.num(cn('meas.d.steps', v).s) === 10000));
check('E8-E9 kroki -500 i 12abc odrzucone', ['-500', '12abc'].every((v) => cn('meas.d.steps', v).err));
check('E10-E11 wzrost 1720 i wiek -5 odrzucone', cn('cm', '1720').err && cn('age', '-5').err);
check('puste pole dozwolone', !cn('meas.d.w', '').err);

// Zwierzak: stan (pet.js). mkCtx() buduje ctx: 40 zwykłych dni historii, dziś pusto, chyba że opcje mówią inaczej.
const tryc = (name, fn) => { let r = false, info = ''; try { r = fn(); } catch (e) { info = e.message; } check(name, r, info); };
const SEEN_ALL = ['week1', 'streak7', 'streak14', 'streak30', 'w2', 'w5', 'review1', 'level-Brąz', 'level-Srebro', 'level-Złoto', 'level-Platyna'];
const NORMAL = { meals: 3, pts: 40, sleep: 7, steps: 7000 };
function mkCtx(o = {}) {
  const now = new Date(`2026-11-05T${o.now || '14:00'}:00`);
  const key = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const ago = (n) => key(new Date(now.getFullYear(), now.getMonth(), now.getDate() - n, 12));
  const hist = o.history != null ? o.history : (o.active != null ? (o.empty || 0) + o.active : 40);
  const D = {};
  for (let i = 1; i <= hist; i++) D[ago(i)] = i <= (o.empty || 0) ? {} : { ...NORMAL };
  (o.days || []).forEach((d) => { D[ago(d.ago)] = { ...d }; });
  D[ago(0)] = { ...(o.today || {}) };
  return {
    now, key, seen: o.seen || SEEN_ALL, reviewed: !!o.reviewed,
    pet: { kind: 'gaska', name: o.name != null ? o.name : 'Kluska', since: ago(hist), peak: o.peak || 0 },
    dayPts: (k) => (D[k] || {}).pts || 0,
    entries: (k) => { const x = D[k] || {}; return [...Array(x.meals || 0)].map(() => ({ kind: 'm' })).concat(x.train ? [{ kind: 't' }] : []); },
    meas: (k) => { const x = D[k] || {}; return { w: x.w, steps: x.steps, sleep: x.sleep }; },
    habs: () => ({}), urges: () => [],
    streak: () => o.streak || 0, weekPts: () => o.weekPts || 0, level: T.level,
    stage: () => (o.pct != null ? { pct: o.pct } : null),
    avgW: (a) => (a === 0 && o.avgW != null ? o.avgW : null), startW: o.startW != null ? o.startW : null,
    num: T.num, once: !!o.once, pain: o.painAll ? () => true : undefined,
  };
}
const st = (c) => sandbox.PET.state(c);
tryc('pet: 3 dni pustki => sad, wskaźniki >= 10', () => { const s = st(mkCtx({ empty: 3 })); return s.mood === 'sad' && Object.values(s.meters).every((v) => v >= 10); });
tryc('pet: po 1 posiłku dziś nie sad', () => st(mkCtx({ empty: 3, today: { meals: 1 } })).mood !== 'sad');
tryc('pet: 3 posiłki => food 100', () => st(mkCtx({ today: { meals: 3 } })).meters.food === 100);
tryc('pet: przed 9:00 bez posiłków i bez przerwy => food 50', () => st(mkCtx({ now: '08:30' })).meters.food === 50);
tryc('pet: 23:00 => sleep', () => st(mkCtx({ now: '23:00' })).mood === 'sleep');
tryc('pet: 00:30 => sleep, przerwa 0 (wczoraj z wpisami)', () => { const s = st(mkCtx({ now: '00:30', history: 2, days: [{ ago: 1, meals: 3 }, { ago: 2 }] })); return s.mood === 'sleep' && s.przerwa === 0; });
tryc('pet: -2% średniej wagi, w2 niewidziane => celebrate', () => { const s = st(mkCtx({ startW: 82, avgW: 80.3, seen: ['week1'] })); return s.mood === 'celebrate' && s.milestone === 'w2'; });
tryc('pet: wzrost wagi nie zmienia humoru', () => st(mkCtx({ today: { pts: 40, w: 80 } })).meters.mood === st(mkCtx({ today: { pts: 40, w: 84 } })).meters.mood);
tryc('pet: 30 aktywnych dni + 10 pustych => adult', () => st(mkCtx({ active: 30, empty: 10 })).stage === 'adult');
tryc('pet: Brąz w tygodniu => szalik', () => st(mkCtx({ weekPts: 120 })).acc === 'szalik');
tryc('pet: zdanie stanu z imieniem, rodzaj żeński', () => st(mkCtx({ today: { sleep: 7, steps: 7000 }, seen: ['week1'] })).line === 'Kluska czeka na wpis posiłku.');
tryc('pet: nowy zwierzak bez historii nie tęskni (przerwa liczona od startu)', () => { const s = st(mkCtx({ history: 0, empty: 0 })); return s.przerwa === 0 && s.mood !== 'sad'; });

// Zwierzak: wygląd (PET.svg, PET.card, PET.screen, CSS)
const KINDS = ['gaska', 'kaczka'], STAGES = ['egg', 'chick', 'young', 'adult'], MOODS = ['celebrate', 'sleep', 'sad', 'hungry', 'tired', 'happy', 'ok'];
const P = () => sandbox.PET;
tryc('pet.svg: 2 zwierzaki × 4 etapy × 7 min, klasa miny', () => KINDS.every((k) => STAGES.every((s) => MOODS.every((m) => { const v = P().svg(k, s, m, null); return v.startsWith('<svg') && v.includes('pet-' + m); }))));
tryc('pet.svg: jajo bez dzioba', () => !P().svg('gaska', 'egg', 'ok', null).includes('class="beak'));
tryc('pet.svg: kaczka dziób płaski, gąska długi', () => P().svg('kaczka', 'young', 'ok', null).includes('class="beak flat"') && P().svg('gaska', 'young', 'ok', null).includes('class="beak long"'));
tryc('pet.svg: dodatek korona', () => P().svg('gaska', 'adult', 'ok', 'korona').includes('class="acc korona"'));
tryc('pet.card: imię escapowane', () => P().card(st(mkCtx({ name: '<b>' })), { kind: 'gaska', name: '<b>' }, T.esc).includes('&lt;b&gt;'));
const SUM = { today: { done: 2, pts: 35 }, week: { pts: 120, level: 'Brąz', next: { name: 'Srebro', need: 60 } }, all: { active: 12, streak: 5, dw: -1.4, waist: -2, pct: 40 }, badges: [] };
tryc('pet.badgeList: etykiety i zdobyte', () => { const b = P().badgeList(['streak7', 'level-Brąz']); return b.length === 11 && b.find((x) => x.id === 'streak7').got && b.find((x) => x.id === 'level-Brąz').label === 'Tydzień na poziomie Brąz' && !b.find((x) => x.id === 'w5').got; });
tryc('pet.screen: postęp i odznaki', () => { const h = P().screen(st(mkCtx()), { kind: 'kaczka', name: 'Kluska' }, { ...SUM, badges: P().badgeList(['streak7']) }, T.esc); return h.includes('Seria 7 dni') && h.includes('class="badge got"') && h.includes('-1,4 kg') && h.includes('do poziomu Srebro brakuje 60 pkt'); });
tryc('pet.screen: odmiana „aktywny dzień / aktywne dni / aktywnych dni”', () => {
  const at = (n) => P().screen({ ...st(mkCtx()), stage: 'young', active: 30 - n }, { kind: 'gaska', name: 'A' }, { ...SUM, badges: [] }, T.esc);
  return at(1).includes('1 aktywny dzień') && at(3).includes('3 aktywne dni') && at(5).includes('5 aktywnych dni') && at(12).includes('12 aktywnych dni') && at(22).includes('22 aktywne dni');
});
// Zwierzak: reakcje (kolejka PET.react, odtwarzanie PET.flush po render)
const fx = { cls: [], fx: [] };
const fakePet = { classList: { add: (c) => fx.cls.push(c), remove() {} }, closest: () => ({ insertAdjacentHTML: (_, h) => fx.fx.push(h), querySelector: () => null }) };
const withPet = (on, fn) => { const q = sandbox.document.querySelector; sandbox.document.querySelector = (s) => (on && s === '#main .pet' ? fakePet : null); try { return fn(); } finally { sandbox.document.querySelector = q; } };
tryc('pet.react: bez widocznej postaci czeka w kolejce', () => { P().react('meal'); const a = withPet(false, () => P().flush()); const b = withPet(true, () => P().flush()); return a === false && b === true && fx.cls.includes('react-meal'); });
tryc('pet.react: reakcja starsza niż 10 min przepada', () => { P().react('train'); return withPet(true, () => P().flush(new Date(Date.now() + 11 * 60000))) === false; });
tryc('pet.react: nawyk pokazuje +punkty', () => { P().react('habit', 10); withPet(true, () => P().flush()); return fx.fx.some((h) => h.includes('+10')); });
const appCss = fs.readFileSync(path.join(root, "app.css"), "utf8");
check('app.css: prefers-reduced-motion wyłącza animacje zwierzaka', /prefers-reduced-motion[^{]*\{[^@]*\.pet[^{]*\{[^}]*animation:none/.test(appCss));

const views = ['meals', 'train', 'day', 'health', 'set', 'sos', 'labs', 'intro', 'review', 'recipe', 'knee', 'impact', 'challenge', 'pet'];
let renderErr = '';
for (const tab of views) for (const sex of ['K', 'M']) for (const mode of ['redukcja', 'utrzymanie']) {
  const S = T.S(); S.onb = true; S.tab = tab; S.sex = sex; S.mode = mode; S.recipe = 'o1';
  try { T.render(); if (!els.main || !els.main.innerHTML) renderErr = renderErr || `${tab}/${sex}/${mode}: pusty widok`; }
  catch (e) { renderErr = renderErr || `${tab}/${sex}/${mode}: ${e.message}`; }
}
check(`${views.length} widoków × 2 płcie × 2 tryby bez błędu`, !renderErr, renderErr);

// Zwierzak w aplikacji: karta, ekran, wprowadzenie, stare dane, odznaka raz
const mainHtml = () => els.main.innerHTML;
const click = (data) => (lis.click || []).forEach((f) => f({ target: { closest: () => ({ dataset: data }) } }));
const view = (tab, set) => { const S = T.S(); S.onb = true; S.tab = tab; Object.assign(S, set || {}); T.render(); return mainHtml(); };
tryc('stare dane bez zwierzaka: karta zaprasza do wyboru', () => view('day', { pet: null }).includes('data-petpick'));
tryc('karta: puste imię to Kluska', () => view('day', { pet: { kind: 'gaska', name: '', since: '2026-11-01' } }).includes('Kluska'));
tryc('karta: imię escapowane', () => { const h = view('day', { pet: { kind: 'kaczka', name: '<i>x</i>', since: '2026-11-01' } }); return h.includes('&lt;i&gt;x&lt;/i&gt;') && !h.includes('<i>x</i>'); });
tryc('ekran pet: obie postaci bez błędu', () => ['gaska', 'kaczka'].every((k) => view('pet', { pet: { kind: k, name: 'A', since: '2026-11-01' } }).includes('class="badges"')));
tryc('odznaka świętowana raz (petSeen)', () => {
  const first = view('pet', { pet: { kind: 'gaska', name: 'A', since: '2026-11-01' }, petSeen: [], reviews: { r: { a: 'x', d: '2026-11-01' } } });
  const seen = T.S().petSeen.includes('review1'), second = view('pet');
  return first.includes('pet-celebrate') && seen && !second.includes('pet-celebrate');
});
tryc('wprowadzenie: 5 kroków, krok 3 to wybór zwierzaka', () => view('intro', { introStep: 2 }).includes('data-petkind') && view('intro', { introStep: 4 }).includes('Krok 5 z 5'));
const swSrc = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
check('sw.js: pet.js i krój pisma w pamięci podręcznej, CACHE miara-v3 (przebudowa)', swSrc.includes("'./pet.js'") && swSrc.includes("'miara-v3'") && swSrc.includes("'./fonts/fraunces-latin-ext-600-normal.woff2'"));
check('index.html: pet.js przed app.js', /pet\.js[\s\S]*app\.js/.test(html));

// Zwierzak: sylwetka z pomiarów (opcjonalna)
const B = (m) => P().body(m, new Date('2026-11-05T12:00:00'), T.num);
const OB = (w, h, t) => ({ waist: String(w), hip: String(h), thigh: String(t) });
tryc('pet.body: 1 pomiar => Za mało pomiarów', () => { const b = B({ '2026-11-01': OB(90, 100, 58) }); return !b.ok && b.msg === 'Za mało pomiarów'; });
tryc('pet.body: 2 pomiary co 10 dni => za mało', () => !B({ '2026-10-20': OB(92, 102, 60), '2026-10-30': OB(90, 100, 58) }).ok);
tryc('pet.body: 2 pomiary co 20 dni => kontury start i teraz, bez liczb w tekście', () => { const b = B({ '2026-10-10': OB(94, 104, 61), '2026-10-30': OB(90, 100, 58) }); return b.ok && b.svg.includes('class="body-start"') && b.svg.includes('class="body-now"') && !/>[^<]*\d[^<]*</.test(b.svg); });
tryc('ustawienia: przełącznik sylwetki przy zwierzaku', () => view('set', { pet: { kind: 'gaska', name: 'A', since: '2026-11-01' } }).includes('data-k="body"'));
tryc('ekran pet: sylwetka włączona bez pomiarów => informacja', () => view('pet', { body: true, meas: {} }).includes('Za mało pomiarów'));
tryc('ekran pet: sylwetka wyłączona => brak sekcji', () => !view('pet', { body: false }).includes('Sylwetka'));

// Zwierzak: tryb pokazowy #demo
tryc('pet.demo: klatki obejmują 7 min, 4 etapy, 2 zwierzaki i dodatek', () => { const f = P().demo(new Date('2026-11-05T12:00:00')).frames; const u = (k) => new Set(f.map((x) => x[k])); return u('mood').size === 7 && u('stage').size === 4 && u('kind').size === 2 && f.some((x) => x.acc); });
tryc('pet.demo: dane przykładowe przechodzą render wszystkich widoków', () => { const d = P().demo(new Date()).S; let err = ''; for (const tab of views) { try { view(tab, JSON.parse(JSON.stringify(d))); } catch (e) { err = err || tab + ': ' + e.message; } } if (err) throw new Error(err); return true; });
tryc('pet.screen: brak podpowiedzi etapu, gdy nic nie brakuje', () => !P().screen({ ...st(mkCtx()), stage: 'chick', active: 9 }, { kind: 'gaska', name: 'A' }, { ...SUM, badges: [] }, T.esc).includes('Do etapu'));
tryc('pet.demo: talia i kontur zmieniają się między startem a teraz', () => { const d = P().demo(new Date('2026-11-05T12:00:00')).S; const b = P().body(d.meas, new Date('2026-11-05T12:00:00'), T.num); const m = b.svg.match(/d="([^"]+)"/g); return b.ok && m.length === 2 && m[0] !== m[1]; });
tryc('tryb demo: save() nie zapisuje', () => { let n = 0; const o = sandbox.localStorage.setItem; sandbox.localStorage.setItem = () => { n++; }; T.setDemo(true); T.save(); T.setDemo(false); T.save(); sandbox.localStorage.setItem = o; return n === 1; });

// Poprawki po przeglądzie końcowym (I1-I5)
const PETA = { kind: 'gaska', name: 'A', since: '2026-11-01' }, REV = { r: { a: 'x', d: '2026-11-01' } };
const CLEAN = () => ({ days: {}, meas: {}, hab: {}, urges: {}, reviews: {}, mode: 'redukcja', petCeleb: null }), NOREV = SEEN_ALL.filter((x) => x !== 'review1');
tryc('I1: świętowanie trwa do obejrzenia ekranu zwierzaka', () => {
  const d1 = view('day', { ...CLEAN(), pet: { ...PETA }, petSeen: [...NOREV], reviews: REV }), d2 = view('day');
  const p1 = view('pet'), d3 = view('day');
  return d1.includes('pet-celebrate') && d2.includes('pet-celebrate') && p1.includes('pet-celebrate') && !d3.includes('pet-celebrate') && T.S().petSeen.includes('review1');
});
tryc('I1: przerysowanie przy wpisywaniu nie zalicza kamienia milowego', () => { T.setRedraw(true); try { view('day', { ...CLEAN(), pet: { ...PETA }, petSeen: [...NOREV], reviews: REV }); } finally { T.setRedraw(false); } return !T.S().petSeen.includes('review1'); });
tryc('I2: etap nie cofa się po usunięciu starych dni (peak)', () => st(mkCtx({ history: 0, peak: 40 })).stage === 'adult');
tryc('I2: aplikacja zapamiętuje najwyższą liczbę aktywnych dni', () => { view('day', { ...CLEAN(), pet: { ...PETA, peak: 33 }, petSeen: [...SEEN_ALL] }); return T.S().pet.peak === 33 && view('pet').includes('Dorosła'); });
tryc('I3: zdobyta odznaka zostaje po przerwaniu serii', () => view('pet', { ...CLEAN(), pet: { ...PETA }, petSeen: ['streak30'] }).includes('<span class="badge got">Seria 30 dni</span>'));
tryc('I4: tryb demo nie wysyła punktów do wspólnego wyzwania', () => {
  const C = T.ch(), keep = { state: C.state, me: C.me, db: C.db, lastSent: C.lastSent }; let n = 0;
  Object.assign(C, { state: 'on', me: 'x', lastSent: '', db: { doc: () => ({ set: () => { n++; return Promise.resolve(); } }) } });
  T.setDemo(true); try { T.chSync(); } finally { T.setDemo(false); Object.assign(C, keep); }
  return n === 0;
});
tryc('I5: punkty zwierzaka bez nawyku „średnia waga w paśmie”', () => {
  const S = T.S(), k = T.todayKey(); S.mode = 'utrzymanie'; S.maintRef = '80'; S.hab[k] = {}; S.days[k] = [];
  for (let i = 0; i < 7; i++) { const d = new Date(Date.now() - i * 864e5); const kk = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); S.meas[kk] = { ...(S.meas[kk] || {}), w: '80' }; }
  const r = T.dayPts(k) - T.petCtx().dayPts(k); S.mode = 'redukcja'; return r === 10;
});

// Drobiazgi przed scaleniem (M2, M4)
tryc('M2: nieznany rodzaj zwierzaka z kopii nie trafia do HTML', () => { const v = P().svg('x"><img src=x>', 'young', 'ok', null); return !v.includes('<img') && v.includes('pet-gaska'); });
tryc('M4: etykieta karty zawiera zdanie stanu', () => P().card(st(mkCtx({ today: { sleep: 7, steps: 7000 } })), { kind: 'gaska', name: 'Kluska' }, T.esc).includes('aria-label="Mój zwierzak: Kluska. Kluska czeka na wpis posiłku."'));

// Prowadzenie nowej osoby: pierwsze kroki, czytelne „Dziś”, bez ślepych zaułków
const NEWU = () => ({ ...CLEAN(), pet: null, petSeen: [...SEEN_ALL], guide: { hidden: false, dataOk: false, seenPet: false }, onb: true });
const today = () => T.todayKey();
tryc('guide: nowa osoba ma 6 kroków, żaden niezaliczony, pierwszy to dane', () => { view('day', NEWU()); const g = T.guideSteps(); return g.length === 6 && g.every((x) => !x.done) && g[0].id === 'data'; });
tryc('guide: kroki zaliczają się z danych', () => {
  view('day', { ...NEWU(), pet: { ...PETA }, meas: { [today()]: { w: '82', steps: '6000' } }, days: { [today()]: [{ kind: 'm', label: 'x', k: 400, p: 30, f: 10, c: 40 }] } });
  const d = Object.fromEntries(T.guideSteps().map((x) => [x.id, x.done])); return d.pet && d.weight && d.meal && d.move && !d.data && !d.seepet;
});
tryc('guide: panel na górze dnia, przycisk ochoty pod listą „Dziś”', () => { const h = view('day', NEWU()); return h.includes('class="guide') && h.indexOf('Pierwsze kroki') < h.indexOf('Dziś:') && h.indexOf('Dziś:') < h.indexOf('Mam ochotę coś przekąsić'); });
// Rada 07.11.2026 (przebudowa): przycisk ochoty ma stałe miejsce pod zwierzakiem; na górze jest Stan dziś
tryc('guide: po ukończeniu panel znika, na górze Stan dziś, przycisk ochoty raz, pod Dziś', () => {
  const h = view('day', { ...NEWU(), pet: { ...PETA }, guide: { hidden: false, dataOk: true, seenPet: true }, meas: { [today()]: { w: '82', steps: '6000' } }, days: { [today()]: [{ kind: 'm', label: 'x', k: 400, p: 30, f: 10, c: 40 }] } });
  return !h.includes('Pierwsze kroki') && h.indexOf('Stan dziś') < h.indexOf('Dziś:') && h.indexOf('Dziś:') < h.indexOf('Mam ochotę coś przekąsić') && h.split('Mam ochotę coś przekąsić').length === 2;
});
tryc('guide: ukryty panel się nie pokazuje', () => !view('day', { ...NEWU(), guide: { hidden: true, dataOk: false, seenPet: false } }).includes('Pierwsze kroki'));
tryc('guide: Zapisz w Ustawieniach zalicza dane, ekran zwierzaka zalicza poznanie', () => { view('set', { ...NEWU(), kg: '82', cm: '170', age: '40', goal: '74', mode: 'redukcja' }); click({ datasave: '1' }); const a = T.S().guide.dataOk; view('pet', { pet: { ...PETA } }); return a && T.S().guide.seenPet; });
tryc('Dziś: podpowiedź akcji i wyróżniony następny krok', () => { const h = view('day', NEWU()); return h.includes('Otwórz Posiłki i naciśnij Zjem') && h.includes('class="opt hab next"'); });
tryc('bez ślepych zaułków: przyciski do Treningu i Posiłków', () => { const h = view('day', NEWU()); return !h.includes('w zakładce Trening') && h.includes('Przejdź do Treningu') && h.includes('Przejdź do Posiłków'); });
tryc('karta: jajo mówi, jak się wykluć', () => view('day', { ...NEWU(), pet: { ...PETA } }).includes('wykluje się'));
tryc('wprowadzenie: ostatni ekran zapowiada pierwsze kroki', () => view('intro', { introStep: 4 }).includes('pierwsze kroki'));
tryc('komunikat po akcji wskazuje następny krok', () => { view('day', { ...NEWU(), pet: { ...PETA } }); return T.guideToast('Dodano do dnia') === 'Dodano do dnia. Dalej: sprawdź swoje dane.'; });

// Rada 05.11.2026, P1: wskaźnik mierzy zapisywanie, nie jedzenie; wybór zwierzaka nie świętuje dawnych osiągnięć
tryc('P1-1: pasek nazywa się Posiłki, bez słowa Najedzenie', () => { const h = P().card(st(mkCtx({ today: { sleep: 7, steps: 7000 } })), { kind: 'gaska', name: 'Kluska' }, T.esc); return h.includes('Posiłki') && !h.includes('Najedzenie'); });
tryc('P1-1: mina bez posiłku nie mówi o głodzie i nie pokazuje miski', () => { const s = st(mkCtx({ today: { sleep: 7, steps: 7000 } })), c = { kind: 'gaska', name: 'Kluska' }; const h = P().card(s, c, T.esc) + P().screen(s, c, { today: { done: 0, pts: 0 }, week: { pts: 0, level: 'Start', next: null }, all: { active: 1, streak: 0, dw: null, waist: null, pct: null }, badges: [], body: '' }, T.esc); return s.mood === 'hungry' && !/głodn/i.test(h) && !h.includes('class="bowl"') && h.includes('class="note"'); });
tryc('P1-2: pierwszy wybór zwierzaka zalicza dawne osiągnięcia bez świętowania', () => {
  view('set', { ...CLEAN(), pet: null, petSeen: [], reviews: REV }); click({ petkind: 'gaska' });
  return T.S().petSeen.includes('review1') && !view('day').includes('pet-celebrate');
});
tryc('P1-2: to samo po odtworzeniu starej kopii bez petSeen', () => {
  const S = T.S(); view('set', { ...CLEAN(), pet: null, reviews: REV }); delete S.petSeen; click({ petkind: 'kaczka' });
  return (T.S().petSeen || []).includes('review1') && !view('day').includes('pet-celebrate');
});
tryc('P1-2: zmiana rodzaju istniejącego zwierzaka nie zmienia odznak', () => { view('set', { ...CLEAN(), pet: { ...PETA }, petSeen: ['week1'], reviews: REV }); click({ petkind: 'kaczka' }); return T.S().petSeen.join() === 'week1' && T.S().pet.kind === 'kaczka'; });

// Rada 06.11.2026, P1: trening z zegarka i tryb „raz dziennie” dla osoby, którą zniechęca częste wpisywanie
const lastE = () => { const d = T.S().days[T.todayKey()] || []; return d[d.length - 1]; }, nE = () => (T.S().days[T.todayKey()] || []).length;
const HID = { hidden: true, dataOk: true, seenPet: true };
tryc('P1-2z: trening z zegarka: kalorie z zegarka jako brutto, netto bez spoczynku', () => {
  view('train', { ...CLEAN(), tr: { ...T.S().tr, wmin: '45', wk: '400' } }); click({ addwatch: '1' }); const e = lastE();
  return e && e.kind === 't' && e.label === 'Trening z zegarka' && e.min === 45 && e.gross === 400 && e.net > 0 && e.net < 400;
});
tryc('P1-2z: bez kalorii z zegarka nic nie dodaje', () => { view('train', { ...CLEAN(), tr: { ...T.S().tr, wmin: '45', wk: '' } }); click({ addwatch: '1' }); return nE() === 0; });
tryc('P1-2z: kalorie poza zakresem odrzucone', () => { view('train', { ...CLEAN(), tr: { ...T.S().tr, wmin: '45', wk: '9000' } }); click({ addwatch: '1' }); return nE() === 0; });
tryc('P1-2z: panel z zegarka jest nad szacunkiem z rodzaju', () => { const h = view('train', CLEAN()); return h.includes('data-addwatch') && h.indexOf('data-addwatch') < h.indexOf('data-addtrain'); });
tryc('P1-3: tryb raz dziennie: o 14:00 bez posiłku zwierzak nie czeka na wpis', () => { const s = st(mkCtx({ today: { sleep: 7, steps: 7000 }, once: true })); return s.mood !== 'hungry' && s.meters.food === 50; });
tryc('P1-3: tryb raz dziennie: o 19:30 bez posiłku czeka na wpis', () => st(mkCtx({ now: '19:30', today: { sleep: 7, steps: 7000 }, once: true })).mood === 'hungry');
tryc('P1-3: petCtx przekazuje tryb raz dziennie', () => { T.S().once = true; const r = T.petCtx().once === true; T.S().once = false; return r; });
tryc('P1-3: Ustawienia mają przełącznik raz dziennie', () => view('set', CLEAN()).includes('data-k="once"'));
tryc('P1-3: Dziś w trybie raz dziennie: wpis dnia z Według planu i Inaczej', () => { const h = view('day', { ...CLEAN(), once: true, pet: { ...PETA }, petSeen: [...SEEN_ALL], guide: { ...HID } }); return h.includes('Wpis dnia') && h.includes('data-dayplan') && h.includes('data-dayother'); });
tryc('P1-3: Według planu dodaje posiłki z planu tylko raz', () => {
  view('day', { ...CLEAN(), once: true, pet: { ...PETA }, petSeen: [...SEEN_ALL], guide: { ...HID } }); click({ dayplan: '1' }); click({ dayplan: '1' });
  return (T.S().days[T.todayKey()] || []).filter((e) => e.kind === 'm').length === T.PLAN[new Date().getDay()].length;
});
tryc('P1-3: Inaczej otwiera szybki wpis', () => { view('day', { ...CLEAN(), once: true, pet: { ...PETA }, petSeen: [...SEEN_ALL], guide: { ...HID } }); click({ dayother: '1' }); return mainHtml().includes('data-fold="szybki" open'); });
// Zgłoszenie 06.11.2026: po wpisaniu danych brak przycisku, dokąd przejść, i brak informacji, czy dane są poprawne
const NX = (h) => (h.match(/class="nextbar"/g) || []).length, OKD = { kg: '82', cm: '170', age: '40', goal: '74', mode: 'redukcja' };
tryc('dane: wejście w Ustawienia nie zalicza kroku Sprawdź swoje dane', () => { view('set', { ...NEWU(), ...OKD }); return T.S().guide.dataOk === false; });
tryc('dane: niezatwierdzone dane mają przycisk Zapisz i sprawdź', () => view('set', { ...NEWU(), ...OKD }).includes('data-datasave'));
tryc('dane: Zapisz z poprawnymi danymi zalicza krok i prowadzi do sekcji Towarzysz', () => {
  view('set', { ...NEWU(), ...OKD }); click({ datasave: '1' }); const h = mainHtml();
  return T.S().guide.dataOk === true && h.includes('Dane zapisane') && h.includes('data-goto="towarzysz"') && h.includes('id="towarzysz"');
});
tryc('dane: pusta waga nie przechodzi i mówi, co uzupełnić', () => { view('set', { ...NEWU(), ...OKD, kg: '' }); click({ datasave: '1' }); return T.S().guide.dataOk === false && mainHtml().includes('Uzupełnij wagę'); });
tryc('dane: w redukcji cel musi być niższy od wagi', () => { view('set', { ...NEWU(), ...OKD, goal: '90' }); click({ datasave: '1' }); return T.S().guide.dataOk === false && mainHtml().includes('Waga docelowa w redukcji powinna być niższa od obecnej'); });
tryc('dane: cel z BMI poniżej 18,5 daje ostrzeżenie, ale zapisuje', () => { view('set', { ...NEWU(), ...OKD, goal: '50' }); click({ datasave: '1' }); return T.S().guide.dataOk === true && mainHtml().includes('BMI poniżej 18,5'); });
tryc('dalej: ze zwierzakiem prowadzi do następnego kroku w Moim dniu', () => view('set', { ...NEWU(), ...OKD, pet: { ...PETA }, guide: { hidden: false, dataOk: true, seenPet: false } }).includes('<button class="btn" data-tab="day" style="width:100%">Dalej: wpisz dzisiejszą wagę</button>'));
tryc('dalej: po pierwszych krokach dwa przyciski do Mojego dnia w Ustawieniach', () => { const h = view('set', { ...CLEAN(), ...OKD, pet: { ...PETA }, petSeen: [...SEEN_ALL], guide: { hidden: true, dataOk: true, seenPet: true } }); return NX(h) === 2 && h.includes('Przejdź do Mojego dnia'); });
tryc('dalej: ekran zwierzaka kończy się przyciskiem do Mojego dnia', () => { const h = view('pet', { ...CLEAN(), pet: { ...PETA }, petSeen: [...SEEN_ALL], guide: { hidden: true, dataOk: true, seenPet: true } }); return NX(h) === 1 && h.includes('Przejdź do Mojego dnia'); });

tryc('P1-3: ukończony Wpis dnia mówi, że dzień zapisany, i prowadzi do zwierzaka', () => {
  const k = T.todayKey(), h = view('day', { ...CLEAN(), once: true, pet: { ...PETA }, petSeen: [...SEEN_ALL], guide: { ...HID }, days: { [k]: [{ kind: 'm', id: 's1', label: 'x', k: 300, p: 20, f: 5, c: 30 }, { kind: 't', label: 'Trening z zegarka', min: 40, gross: 300, net: 200 }] }, meas: { [k]: { steps: '8000' } } });
  return h.includes('Dzień zapisany') && /Wpis dnia[\s\S]*data-tab="pet"[^>]*>Zobacz zwierzaka/.test(h);
});
// Rada 06.11.2026 (pierwsze wejście, długie korzystanie): punkty trybu raz dziennie, wskazówki pierwszego wejścia
const yKey = () => { const d = new Date(); d.setDate(d.getDate() - 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const ONCE_DAY = () => [{ kind: 'm', id: 's1', label: 'x', k: 400, p: 20, f: 5, c: 30, plan: true }];
const onceState = (once) => { const k = T.todayKey(), y = yKey(); return { ...CLEAN(), once, pet: { kind: 'gaska', name: 'A', since: y }, petSeen: [...SEEN_ALL], guide: { ...HID }, days: { [k]: ONCE_DAY(), [y]: ONCE_DAY() }, meas: { [k]: { steps: '8000' }, [y]: { steps: '7000' } } }; };
tryc('P1-2r: tryb raz dziennie: wpis dnia (posiłki i kroki) liczy się do serii', () => { view('day', onceState(true)); return T.streak() === 2; });
tryc('P1-2r: tryb raz dziennie: zwierzak wykluwa się po wpisach dnia', () => { view('day', onceState(true)); return P().state(T.petCtx()).stage === 'chick'; });
tryc('P1-2r: zwykły tryb: ten sam dzień poniżej 30 pkt nie jest aktywny', () => { view('day', onceState(false)); return T.streak() === 0 && P().state(T.petCtx()).stage === 'egg'; });
const TIPST = () => ({ ...CLEAN(), ...OKD, pet: { ...PETA }, petSeen: [...SEEN_ALL], guide: { hidden: true, dataOk: true, seenPet: true }, tips: {} });
tryc('wskazówki: każdy ekran ma wskazówkę przy pierwszym wejściu', () => ['meals', 'train', 'health', 'set', 'pet', 'day'].every((t) => view(t, TIPST()).includes(`data-tipok="${t}"`)));
tryc('wskazówki: po Rozumiem znika na stałe', () => { view('train', TIPST()); click({ tipok: 'train' }); return T.S().tips.train === true && !mainHtml().includes('data-tipok') && !view('train').includes('data-tipok'); });
tryc('wskazówki: na Moim dniu nie ma jej, gdy są pierwsze kroki', () => !view('day', { ...TIPST(), guide: { hidden: false, dataOk: false, seenPet: false } }).includes('data-tipok'));
tryc('wskazówki: w trybie demo ich nie ma', () => { T.setDemo(true); let h = ''; try { h = view('meals', TIPST()); } finally { T.setDemo(false); } return !h.includes('data-tipok'); });
tryc('wskazówki: Ustawienia przywracają wskazówki', () => { view('set', { ...TIPST(), tips: { meals: true, set: true } }); click({ tipsreset: '1' }); return Object.keys(T.S().tips).length === 0; });

// Rada 06.11.2026 (ekran startowy): dzień z bólem głowy i karty „Co się dzieje”
const dk = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const BASE = (o) => ({ ...CLEAN(), consent: null, kopia: null, pet: { ...PETA }, petSeen: [...SEEN_ALL], guide: { ...HID }, tips: { day: true, health: true, set: true }, pain: {}, cardsOk: {}, discreet: false, once: false, visit: null, ...o });
const cards = (h) => (h.match(/data-card="[a-z_]+"/g) || []).map((x) => x.slice(11, -1));
const ONCE_OK = () => [{ kind: 'm', id: 's1', label: 'x', k: 400, p: 20, f: 5, c: 30 }];
tryc('ból: Mój dzień ma przycisk Boli mnie głowa', () => view('day', BASE()).includes('data-pain="today"'));
tryc('ból: zapis dnia, aura, lek i cofnięcie', () => {
  view('day', BASE()); click({ pain: 'today' }); const k = T.todayKey(), a = !!T.S().pain[k];
  click({ painaura: '1' }); click({ painmed: '1' }); const b = T.S().pain[k].aura === true && T.S().pain[k].med === true;
  click({ painoff: '1' }); return a && b && !T.S().pain[k];
});
tryc('ból: Wczoraj bolała zapisuje wczoraj', () => { view('day', BASE()); click({ pain: 'yday' }); return !!T.S().pain[dk(1)] && !T.S().pain[T.todayKey()]; });
tryc('ból: dwa dni z bólem nie przerywają serii', () => {
  const days = { [dk(0)]: ONCE_OK(), [dk(3)]: ONCE_OK(), [dk(4)]: ONCE_OK() }, meas = { [dk(0)]: { steps: '7000' }, [dk(3)]: { steps: '7000' }, [dk(4)]: { steps: '7000' } };
  view('day', BASE({ once: true, days, meas, pain: { [dk(1)]: {}, [dk(2)]: {} } })); const withPain = T.streak();
  view('day', BASE({ once: true, days, meas, pain: {} })); return withPain === 3 && T.streak() === 1;
});
tryc('ból: zwierzak odpoczywa w dniu z bólem', () => { view('day', BASE({ pain: { [dk(0)]: {} } })); const s = P().state(T.petCtx()); return s.mood === 'sleep' && s.line.includes('odpoczywa'); });
tryc('ból: dni z bólem nie liczą się do przerwy zwierzaka', () => st(mkCtx({ empty: 3, painAll: true })).przerwa === 0);
tryc('ból: dzień z bólem jest bez celu deficytu', () => view('day', BASE({ pain: { [dk(0)]: {} } })).includes('Dziś bez celu deficytu'));
tryc('ból: kopia bez danych zdrowotnych nie zawiera dni z bólem', () => { view('day', BASE({ pain: { [dk(0)]: { aura: true } } })); return Object.keys(JSON.parse(T.bkBuild(true)).data.pain || {}).length === 0 && !!JSON.parse(T.bkBuild(false)).data.pain[dk(0)]; });
tryc('karty: ból w dniach bez hormonów pokazuje się tylko z zaznaczonym cyklem', () => cards(view('day', BASE({ pain: { [dk(0)]: {} }, meas: { [dk(0)]: { cyc: 'P' } } }))).includes('bol_hormony') && !cards(view('day', BASE({ pain: { [dk(0)]: {} } }))).includes('bol_hormony'));
tryc('karty: aura w ostatnich 90 dniach, starsza nie', () => cards(view('health', BASE({ pain: { [dk(10)]: { aura: true } } }))).includes('aura') && !cards(view('health', BASE({ pain: { [dk(120)]: { aura: true } } }))).includes('aura'));
tryc('karty: zła noc po 2 krótkich nocach, nie przy braku jednej', () => cards(view('day', BASE({ meas: { [dk(0)]: { sleep: '5' }, [dk(1)]: { sleep: '5,5' } } }))).includes('zla_noc') && !cards(view('day', BASE({ meas: { [dk(0)]: { sleep: '5' } } }))).includes('zla_noc'));
tryc('karty: stres po 2 ochotach w 3 dni', () => cards(view('day', BASE({ urges: { [dk(0)]: [{ out: 'plan' }], [dk(2)]: [{ out: 'plan' }] } }))).includes('stres') && !cards(view('day', BASE({ urges: { [dk(0)]: [{ out: 'plan' }] } }))).includes('stres'));
tryc('karty: mało sił w dniu z bólem', () => cards(view('day', BASE({ pain: { [dk(0)]: {} } }))).includes('bez_sil'));
tryc('karty: skok wagi od 0,8 kg nad średnią, nie przy 2 ważeniach', () => {
  const m = { [dk(0)]: { w: '81' }, [dk(1)]: { w: '80' }, [dk(2)]: { w: '80' }, [dk(3)]: { w: '80' } }, m2 = { [dk(0)]: { w: '81' }, [dk(1)]: { w: '80' }, [dk(2)]: { w: '80' } };
  return cards(view('health', BASE({ meas: m }))).includes('skok_wagi') && !cards(view('health', BASE({ meas: m2 }))).includes('skok_wagi');
});
tryc('karty: waga stoi przez 3 tygodnie, nie przy spadku ani za małej liczbie ważeń', () => {
  const m = (now) => ({ [dk(1)]: { w: now }, [dk(3)]: { w: now }, [dk(22)]: { w: '80' }, [dk(24)]: { w: '80' } });
  return cards(view('health', BASE({ meas: m('80,1') }))).includes('waga_stoi') && !cards(view('health', BASE({ meas: m('79') }))).includes('waga_stoi') && !cards(view('health', BASE({ meas: { [dk(1)]: { w: '80' }, [dk(22)]: { w: '80' } } }))).includes('waga_stoi');
});
const MANY = () => BASE({ pain: { [dk(0)]: {} }, meas: { [dk(0)]: { cyc: 'P', sleep: '5' }, [dk(1)]: { sleep: '5' } }, urges: { [dk(0)]: [{ out: 'plan' }, { out: 'plan' }] } });
tryc('karty: najwyżej 2 na Moim dniu, wszystkie w Zdrowiu', () => cards(view('day', MANY())).length === 2 && cards(view('health', MANY())).length >= 4);
tryc('karty: Rozumiem chowa kartę z Mojego dnia do końca dnia, Zdrowie ją zostawia', () => {
  view('day', BASE({ meas: { [dk(0)]: { sleep: '5' }, [dk(1)]: { sleep: '5' } } })); click({ cardok: 'zla_noc' });
  return !cards(mainHtml()).includes('zla_noc') && cards(view('health')).includes('zla_noc');
});
tryc('karty: tryb dyskretny chowa karty wrażliwe z Mojego dnia', () => { const o = { pain: { [dk(0)]: {} }, meas: { [dk(0)]: { cyc: 'P' } } }; return cards(view('day', BASE(o))).includes('bol_hormony') && !cards(view('day', BASE({ ...o, discreet: true }))).includes('bol_hormony') && cards(view('health', BASE({ ...o, discreet: true }))).includes('bol_hormony'); });
tryc('karty: każda karta mówi, na czym się opiera, i podaje siłę dowodów', () => { const h = view('health', MANY()), n = cards(h).length; return n >= 4 && (h.match(/Na podstawie: /g) || []).length === n && (h.match(/class="ev"/g) || []).length === n; });
tryc('Ustawienia: przełącznik trybu dyskretnego', () => view('set', BASE()).includes('data-k="discreet"'));

// Ikona na ekranie początkowym i favicon jak logo: łuki zielony, złoty, niebieski i ciemny trend na białym kafelku
const LOGO_COLORS = ['#2B6A55', '#C08A2E', '#5563B0', '#16231C'];
const brandSvg = (f) => fs.readFileSync(path.join(root, 'brand', f), 'utf8');
tryc('ikona i favicon: kolory logo na białym kafelku', () => ['miara-ikona.svg', 'miara-favicon.svg'].every((f) => { const s = brandSvg(f); return LOGO_COLORS.every((c) => s.includes(`"${c}"`)) && /<rect[^>]*fill="#FFFFFF"/.test(s) && /<path d="M[\d.]+ [\d.]+L/.test(s); }));
tryc('favicon: zaokrąglony kafel i grubsza kreska niż ikona', () => /<rect[^>]*rx="22"/.test(brandSvg('miara-favicon.svg')) && /stroke-width="12"/.test(brandSvg('miara-favicon.svg')));
tryc('ikony z wersją omijają pamięć podręczną (brand/ i icons/ mają max-age 7 dni)', () => /<link rel="icon" href="brand\/miara-favicon\.svg\?v=2"/.test(html) && /<link rel="apple-touch-icon" href="icons\/apple-touch-icon\.png\?v=2"/.test(html) && (fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8').match(/\.png\?v=2"/g) || []).length === 3);

tryc('ikona ekranu początkowego = favicon bez zaokrąglenia (iOS sam zaokrągla rogi)', () => brandSvg('miara-ikona.svg') === brandSvg('miara-favicon.svg').replace(' rx="22"', ''));
// Rada 06.11.2026 (kopia w chmurze): zgoda zgodna z RODO i szyfrowanie kopii w telefonie (AES-GCM, PBKDF2)
let chain = Promise.resolve();
const tryAsync = (name, fn) => { chain = chain.then(fn).then((r) => check(name, r, ''), (e) => check(name, false, e.message)); };
tryc('zgoda: treść z wersją, celem, prawami i niezaznaczonym polem', () => { const h = view('set', BASE({ consent: null, kopia: null })); return h.includes('Zgoda na zaszyfrowaną kopię danych dla rady (wersja 1)') && h.includes('wycofać') && h.includes('dane o zdrowiu') && /<input type="checkbox" id="c_ok">/.test(h) && h.includes('data-consent="1"'); });
tryc('zgoda: bez zaznaczenia nie zapisuje, z zaznaczeniem zapisuje wersję i datę', () => {
  view('set', BASE({ consent: null, kopia: null })); els.c_ok = { checked: false }; click({ consent: '1' }); const none = !T.S().consent;
  els.c_ok = { checked: true }; click({ consent: '1' }); const c = T.S().consent; return none && c.v === 1 && /^\d{4}-\d{2}-\d{2}T/.test(c.at);
});
tryc('zgoda: nowa wersja treści wymaga ponownej zgody', () => view('set', BASE({ consent: { v: 0, at: '2026-01-01T00:00:00Z' } })).includes('data-consent="1"'));
tryc('zgoda: wycofanie usuwa zgodę i ustawienia klucza', () => { view('set', BASE({ consent: { v: 1, at: '2026-11-06T10:00:00Z' }, kopia: { salt: 'eA==', at: '2026-11-06T10:00:00Z' } })); click({ consentoff: '1' }); return !T.S().consent && !T.S().kopia; });
const PASS = 'dobre-haslo-123', TXT = JSON.stringify({ app: 'talerz-i-trening', v: 1, data: { kg: '80', pain: { '2026-11-06': { aura: true } }, n: 'zażółć' } });
tryAsync('szyfrowanie: odszyfrowanie hasłem daje te same dane, szyfrogram bez treści', async () => {
  const salt = crypto.getRandomValues(new Uint8Array(16)), key = await T.kopiaDerive(PASS, salt), env = await T.kopiaEncrypt(key, salt, TXT);
  return (await T.kopiaDecrypt(PASS, env)) === TXT && !env.includes('aura') && JSON.parse(env).app === 'miara-szyfr' && JSON.parse(env).iter >= 600000;
});
tryAsync('szyfrowanie: złe hasło daje czytelny błąd', async () => {
  const salt = crypto.getRandomValues(new Uint8Array(16)), env = await T.kopiaEncrypt(await T.kopiaDerive(PASS, salt), salt, TXT);
  try { await T.kopiaDecrypt('zle-haslo-0000', env); return false; } catch (e) { return e.message.startsWith('Złe hasło'); }
});
tryAsync('szyfrowanie: ta sama treść daje za każdym razem inny szyfrogram', async () => {
  const salt = crypto.getRandomValues(new Uint8Array(16)), key = await T.kopiaDerive(PASS, salt);
  return JSON.parse(await T.kopiaEncrypt(key, salt, TXT)).data !== JSON.parse(await T.kopiaEncrypt(key, salt, TXT)).data;
});
tryAsync('klucz: hasło za krótkie albo różne w dwóch polach odrzucone', async () => {
  view('set', BASE({ consent: { v: 1, at: '2026-11-06T10:00:00Z' }, kopia: null }));
  els.k_p1 = { value: 'krotkie' }; els.k_p2 = { value: 'krotkie' }; let a = false, b = false;
  try { await T.kopiaSetup(); } catch (e) { a = e.message.includes('12 znaków'); }
  els.k_p1 = { value: PASS }; els.k_p2 = { value: PASS + 'x' };
  try { await T.kopiaSetup(); } catch (e) { b = e.message.includes('różnią'); }
  return a && b && !T.S().kopia;
});
tryAsync('klucz: zapisany w telefonie, hasło nigdzie nie zostaje, pola wyczyszczone', async () => {
  view('set', BASE({ consent: { v: 1, at: '2026-11-06T10:00:00Z' }, kopia: null })); els.k_p1 = { value: PASS }; els.k_p2 = { value: PASS }; els.k_tok = { value: 'tajny-token-urzadzenia-123456' };
  await T.kopiaSetup(); const k = await T.KS.get();
  return !!T.S().kopia && !!T.S().kopia.salt && !!k && !JSON.stringify(T.S()).includes(PASS) && els.k_p1.value === '' && els.k_p2.value === '';
});
tryAsync('klucz: bez zgody nie da się ustawić', async () => { view('set', BASE({ consent: null, kopia: null })); els.k_p1 = { value: PASS }; els.k_p2 = { value: PASS }; try { await T.kopiaSetup(); return false; } catch (e) { return e.message.includes('zgod'); } });

// Funkcja Vercel api/kopia.js: token, kształt koperty, zapis prywatny, limity, 4 ostatnie kopie
const API = require(path.join(root, 'api', 'kopia.js'));
const TOK = 'tajny-token-urzadzenia-123456';
const ENV1 = { app: 'miara-szyfr', v: 1, kdf: 'PBKDF2-SHA-256', iter: 600000, salt: 'AAAA', iv: 'AAAA', consentV: 1, created: '2026-11-06T10:00:00Z', data: 'QUJD' };
const fakeRes = () => ({ statusCode: 0, headers: {}, body: '', setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, end(b) { this.body = b; } });
const mkApi = (blobs = []) => { const calls = { put: [], del: [] }; return { calls, h: API.makeHandler({ token: () => TOK, list: async () => ({ blobs }), put: async (n, b, o) => { calls.put.push({ n, b, o }); }, del: async (u) => { calls.del.push(u); } }) }; };
const apiReq = (o) => ({ method: 'POST', headers: { 'x-miara-token': TOK, 'content-type': 'application/json' }, body: ENV1, ...o });
const ago = (d) => new Date(Date.now() - d * 864e5).toISOString();
tryAsync('api: tylko POST', async () => { const { h } = mkApi(), r = fakeRes(); await h(apiReq({ method: 'GET' }), r); return r.statusCode === 405 && r.headers.allow === 'POST'; });
tryAsync('api: zły albo brak tokenu = 401 i nic nie zapisuje', async () => {
  const { h, calls } = mkApi(), r1 = fakeRes(), r2 = fakeRes();
  await h(apiReq({ headers: { 'x-miara-token': 'zly', 'content-type': 'application/json' } }), r1); await h(apiReq({ headers: { 'content-type': 'application/json' } }), r2);
  return r1.statusCode === 401 && r2.statusCode === 401 && calls.put.length === 0;
});
tryAsync('api: odrzuca jawną treść, za mało iteracji i dane spoza base64', async () => API.validEnvelope(ENV1) && !API.validEnvelope({ ...ENV1, meas: { w: 80 } }) && !API.validEnvelope({ ...ENV1, iter: 1000 }) && !API.validEnvelope({ ...ENV1, data: '{"kg":80}' }) && !API.validEnvelope([ENV1]));
tryAsync('api: koperta z jawną treścią = 422', async () => { const { h, calls } = mkApi(), r = fakeRes(); await h(apiReq({ body: { ...ENV1, pain: {} } }), r); return r.statusCode === 422 && calls.put.length === 0; });
tryAsync('api: zapis prywatny pod losową nazwą, bez pamięci podręcznej', async () => {
  const { h, calls } = mkApi(), r = fakeRes(); await h(apiReq(), r); const c = calls.put[0];
  return r.statusCode === 201 && c.o.access === 'private' && /^kopie\/\d{4}-\d{2}-\d{2}-[0-9a-f]{32}\.json$/.test(c.n) && JSON.parse(c.b).data === 'QUJD' && r.headers['cache-control'] === 'no-store';
});
tryAsync('api: trzyma 4 ostatnie kopie (usuwa najstarszą)', async () => {
  const blobs = [10, 11, 12, 13].map((d) => ({ url: 'u' + d, uploadedAt: ago(d) })), { h, calls } = mkApi(blobs), r = fakeRes();
  await h(apiReq(), r); return r.statusCode === 201 && calls.del.length === 1 && calls.del[0].length === 1 && calls.del[0][0] === 'u13';
});
tryAsync('api: limit 3 wysyłek na dobę = 429', async () => { const { h, calls } = mkApi([1, 2, 3].map((i) => ({ url: 'n' + i, uploadedAt: ago(0.1 * i) }))), r = fakeRes(); await h(apiReq(), r); return r.statusCode === 429 && calls.put.length === 0; });
tryAsync('api: kopia powyżej 1 MB = 413', async () => { const { h } = mkApi(), r = fakeRes(); await h(apiReq({ body: JSON.stringify({ ...ENV1, data: 'A'.repeat(1100000) }) }), r); return r.statusCode === 413; });

// Aplikacja: token wysyłki, termin co 7 dni, wysyłka zaszyfrowanej kopii
const KOPIA_OK = () => BASE({ consent: { v: 1, at: '2026-11-06T10:00:00Z' }, kopia: { salt: 'AAAAAAAAAAAAAAAAAAAAAA==', at: '2026-11-06T10:00:00Z', token: TOK } });
tryAsync('klucz: bez tokenu wysyłki odrzucone', async () => { view('set', BASE({ consent: { v: 1, at: '2026-11-06T10:00:00Z' }, kopia: null })); els.k_p1 = { value: PASS }; els.k_p2 = { value: PASS }; els.k_tok = { value: '' }; try { await T.kopiaSetup(); return false; } catch (e) { return e.message.includes('token'); } });
tryc('kopia: token wysyłki nie trafia do pliku kopii', () => { view('set', KOPIA_OK()); return !T.bkBuild(false).includes(TOK) && T.S().kopia.token === TOK; });
tryc('kopia: termin co 7 dni, tylko przy zgodzie', () => {
  const st = (o) => { view('set', KOPIA_OK()); Object.assign(T.S().kopia, o.kopia || {}); if ('consent' in o) T.S().consent = o.consent; return T.kopiaDue(); };
  return st({}) === true && st({ kopia: { sent: ago(8) } }) === true && st({ kopia: { sent: ago(2) } }) === false && st({ consent: null }) === false;
});
tryAsync('kopia: wysyłka szyfruje, wysyła z tokenem i zapisuje datę', async () => {
  view('set', KOPIA_OK()); const salt = crypto.getRandomValues(new Uint8Array(16)); await T.KS.set(await T.kopiaDerive(PASS, salt)); T.S().kopia.salt = Buffer.from(salt).toString('base64');
  let call = null; sandbox.fetch = async (u, o) => { call = { u, o }; return { ok: true, json: async () => ({ ok: true }) }; };
  try { await T.kopiaSend(); } finally { delete sandbox.fetch; }
  const body = JSON.parse(call.o.body);
  return call.u === 'api/kopia' && call.o.method === 'POST' && call.o.headers['x-miara-token'] === TOK && body.app === 'miara-szyfr' && !call.o.body.includes('"kg"') && JSON.parse(await T.kopiaDecrypt(PASS, call.o.body)).app === 'talerz-i-trening' && !!T.S().kopia.sent;
});
tryAsync('kopia: błąd serwera zapisany do pokazania, bez daty wysyłki', async () => {
  view('set', KOPIA_OK()); const salt = crypto.getRandomValues(new Uint8Array(16)); await T.KS.set(await T.kopiaDerive(PASS, salt));
  sandbox.fetch = async () => ({ ok: false, json: async () => ({ error: 'Brak uprawnień' }) });
  let r; try { r = await T.kopiaAuto(); } finally { delete sandbox.fetch; }
  return r === false && T.S().kopia.err.includes('Brak uprawnień') && !T.S().kopia.sent && view('set').includes('Brak uprawnień');
});

// Rada 06.11.2026 (do czasu wizyty): umówiona wizyta, karta z 3 działaniami na dziś, lista na wizytę z dziennika
const ahead = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
tryc('wizyta: karta z liczbą dni do wizyty i listą na wizytę', () => { const h = view('day', BASE({ visit: { who: 'ginekolog', date: ahead(12) } })); return cards(h).includes('wizyta') && h.includes('za 12 dni') && h.includes('data-tab="visit"'); });
tryc('wizyta: bez wizyty i bez aury karty nie ma; po terminie też nie', () => !cards(view('health', BASE())).includes('wizyta') && !cards(view('health', BASE({ visit: { who: 'x', date: dk(3) } }))).includes('wizyta'));
tryc('wizyta: po dniu z aurą karta jest także bez umówionej wizyty i mówi, by nie czekać', () => { const h = view('health', BASE({ pain: { [dk(5)]: { aura: true } } })); return cards(h).includes('wizyta') && h.includes('nie czekaj miesięcy'); });
tryc('wizyta: nazwa lekarza escapowana', () => { const h = view('health', BASE({ visit: { who: '<b>x</b>', date: ahead(3) } })); return h.includes('&lt;b&gt;x&lt;/b&gt;') && !h.includes('<b>x</b>'); });
tryc('wizyta: zapis z formularza w Zdrowiu, zła data odrzucona', () => {
  view('health', BASE()); els.v_who = { value: 'ginekolog' }; els.v_date = { value: 'jutro' }; click({ visitsave: '1' }); const bad = !T.S().visit;
  els.v_date = { value: ahead(20) }; click({ visitsave: '1' }); return bad && T.S().visit.who === 'ginekolog' && T.S().visit.date === ahead(20) && view('health').includes('data-visitsave');
});
tryc('lista na wizytę: liczby z dziennika i cyklu, bez zgadywania', () => {
  const pain = { [dk(1)]: { aura: true, med: true }, [dk(2)]: { med: true }, [dk(40)]: {} }, meas = {};
  for (let i = 0; i < 12; i++) meas[dk(i)] = { cyc: i < 6 ? 'P' : '2', sleep: '7' };
  const h = view('visit', BASE({ pain, meas }));
  return h.includes('Dni z bólem głowy: 3; z aurą: 1; z lekiem: 2') && h.includes('Dni z lekiem w ostatnich 30 dniach: 2') && h.includes('Ból w dniach bez hormonów: 2 z 6') && h.includes('Sen: średnio 7 h z 12 nocy') && h.includes('data-visitcopy');
});
tryc('lista na wizytę: za mało dni cyklu daje „za mało danych”', () => view('visit', BASE({ pain: { [dk(1)]: {} } })).includes('Cykl: za mało zaznaczonych dni'));
tryc('wizyta: kopia bez danych zdrowotnych nie zawiera wizyty', () => { view('health', BASE({ visit: { who: 'x', date: ahead(5) } })); return !JSON.parse(T.bkBuild(true)).data.visit && !!JSON.parse(T.bkBuild(false)).data.visit; });

tryc('lista na wizytę: ekran ma tytuł w nagłówku', () => { view('visit', BASE()); return (els.title || {}).textContent === 'Lista na wizytę'; });
// System wyglądu: zmienne w obu motywach, kontrast WCAG AA z wartości zmiennych, lokalny krój, porządek skali
const sysCss = fs.readFileSync(path.join(root, "app.css"), "utf8");
const themeBlocks = () => { const light = sysCss.match(/:root\{([^}]*)\}/)[1], darkMq = sysCss.match(/:root:not\(\[data-theme="light"\]\)\{([^}]*)\}/)[1], dark = sysCss.match(/:root\[data-theme="dark"\]\{([^}]*)\}/)[1]; return { light, darkMq, dark }; };
const tok = (block, name) => { const m = block.match(new RegExp('--' + name + ':\\s*([^;]+);')); return m ? m[1].trim() : null; };
const lum = (hex) => { const v = hex.replace('#', '').match(/../g).map((x) => parseInt(x, 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const SYS = ['bg', 'surface', 'surface2', 'ink', 'muted', 'line', 'green', 'on-green', 'brass', 'brass-ink', 'clay', 'warn-ink', 'warn-bg', 'shadow'];
tryc('wygląd: zmienne systemu w motywie jasnym i w obu ciemnych', () => { const b = themeBlocks(); return [b.light, b.darkMq, b.dark].every((x) => SYS.every((n) => tok(x, n))) && b.darkMq.replace(/\s/g, '') === b.dark.replace(/\s/g, ''); });
tryc('wygląd: kontrast tekstu co najmniej 4,5:1 (WCAG AA) w obu motywach', () => {
  const pairs = [['ink', 'bg'], ['ink', 'surface'], ['muted', 'bg'], ['muted', 'surface'], ['green', 'surface'], ['green', 'bg'], ['on-green', 'green'], ['brass-ink', 'surface'], ['brass-ink', 'bg'], ['clay', 'surface'], ['warn-ink', 'warn-bg']];
  const b = themeBlocks(), bad = [];
  for (const [name, blk] of [['jasny', b.light], ['ciemny', b.dark]]) for (const [f, g] of pairs) { const c = contrast(tok(blk, f), tok(blk, g)); if (c < 4.5) bad.push(`${name} ${f}/${g} ${c.toFixed(2)}`); }
  if (bad.length) throw new Error(bad.join('; '));
  return true;
});
tryc('wygląd: krój nagłówków z własnej domeny, pliki istnieją, licencja dołączona', () => {
  const urls = [...sysCss.matchAll(/url\((fonts\/[^)]+\.woff2)\)/g)].map((m) => m[1]);
  return urls.length === 2 && urls.every((u) => fs.existsSync(path.join(root, u))) && fs.existsSync(path.join(root, 'fonts', 'Fraunces-OFL.txt')) && !/https?:\/\//.test(sysCss);
});
tryc('wygląd: przycisk ochoty w palecie logo (mosiądz), bez fioletu', () => { const r = sysCss.match(/\.btn\.sos\{([^}]*)\}/); return !!r && r[1].includes('var(--brass') && !sysCss.includes('--plum') && !code.includes('--plum'); });
tryc('wygląd: najwyżej 5 zaokrągleń i 8 rozmiarów pisma w całym CSS', () => {
  const radii = new Set([...sysCss.matchAll(/border-radius:\s*([^;}]+)/g)].map((m) => m[1].trim())), sizes = new Set([...sysCss.matchAll(/font-size:\s*([^;}]+)/g)].map((m) => m[1].trim()));
  if (radii.size > 5 || sizes.size > 8) throw new Error(`zaokrąglenia ${[...radii].join(' ')} | pismo ${[...sizes].join(' ')}`);
  return true;
});

// Stan dziś: każda wartość ze źródłem i liczbą danych, „brak danych” zamiast zera; nowy układ Mojego dnia
const stan = (h) => { const m = h.match(/<section class="stan[^"]*"[\s\S]*?<\/section>/); return m ? m[0] : ''; };
const ML = (n, k, pr) => Array.from({ length: n }, () => ({ kind: 'm', id: 'x', label: 'x', k, p: pr, f: 0, c: 0 }));
tryc('stan: bez danych każda wartość mówi „brak danych” i co wpisać', () => { const h = stan(view('day', BASE())); return h.includes('Stan dziś') && (h.match(/brak danych/g) || []).length >= 3 && h.includes('wpisz wagę') && !h.includes('Ból i cykl'); });
tryc('stan: waga jako średnia 7 dni ze źródłem i zmianą do poprzedniego tygodnia', () => {
  const meas = { [dk(0)]: { w: '80' }, [dk(1)]: { w: '80' }, [dk(2)]: { w: '80' }, [dk(3)]: { w: '80' }, [dk(8)]: { w: '81' }, [dk(9)]: { w: '81' } };
  const h = stan(view('day', BASE({ meas }))); return h.includes('80 kg') && h.includes('średnia z 4 ważeń w 7 dni') && h.includes('−1 kg') && h.includes('tydzień wcześniej 81 kg z 2');
});
tryc('stan: jedzenie z celem, liczbą posiłków i białkiem', () => { const h = stan(view('day', BASE({ days: { [dk(0)]: ML(2, 500, 30) } }))); return /1\s?000 z [\d\s]+ kcal/.test(h) && h.includes('2 posiłki zapisane, białko 60 g'); });
tryc('stan: w dniu z bólem jedzenie bez celu deficytu', () => stan(view('day', BASE({ pain: { [dk(0)]: {} }, days: { [dk(0)]: ML(1, 500, 30) } }))).includes('dziś bez celu deficytu'));
tryc('stan: sen ostatniej nocy i średnia z liczbą nocy', () => { const h = stan(view('day', BASE({ meas: { [dk(0)]: { sleep: '6,5' }, [dk(1)]: { sleep: '7,5' } } }))); return h.includes('6,5 h') && h.includes('średnia 7 h z 2 nocy'); });
tryc('stan: ruch z krokami i treningiem', () => { const h = stan(view('day', BASE({ meas: { [dk(0)]: { steps: '8123' } }, days: { [dk(0)]: [{ kind: 't', label: 'x', min: 40, gross: 300, net: 200 }] } }))); return /8\s?123 kroków/.test(h) && h.includes('trening 40 min'); });
tryc('stan: ból i cykl tylko przy danych', () => { const h = stan(view('day', BASE({ pain: { [dk(0)]: { aura: true } }, meas: { [dk(0)]: { cyc: 'P' } } }))); return h.includes('Ból i cykl') && h.includes('dzień z bólem, aura') && h.includes('dni bez hormonów'); });
tryc('układ: Stan dziś na górze, karty pod nim, potem Dziś, zwierzak niżej; Więcej zwinięte', () => {
  const h = view('day', BASE({ pain: { [dk(0)]: {} }, meas: { [dk(0)]: { cyc: 'P' } } })), i = (x) => h.indexOf(x);
  return i('class="stan') > -1 && i('class="stan') < i('data-card=') && i('data-card=') < i('<h2>Dziś') && i('<h2>Dziś') < i('class="petcard') && /<details class="fold" data-fold="wiecej">/.test(h) && h.indexOf('data-fold="prognoza"') > i('data-fold="wiecej"');
});

tryc('układ Treningu: główne zadanie na górze, program kolana niżej jako przycisk konturowy', () => { const h = view('train', BASE()), k = h.indexOf('data-tab="knee"'); return k > h.indexOf('data-addtrain') && h.indexOf('data-addwatch') < h.indexOf('data-addtrain') && /<button class="btn ghost" data-tab="knee"/.test(h); });

chain.then(() => {
  console.log(`WYNIK: ${ok} OK, ${bad} BLAD`);
  process.exit(bad ? 1 : 0);
});
