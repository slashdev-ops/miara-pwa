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
const mk = (id) => els[id] || (els[id] = { id, innerHTML: '', textContent: '', value: '', checked: false, style: {}, classList: { add() {}, remove() {} } });
const sandbox = {
  document: { getElementById: mk, querySelector: () => null, addEventListener(t, f) { (lis[t] = lis[t] || []).push(f); } },
  window: { scrollTo() {} },
  localStorage: { getItem: () => null, setItem() {} },
  navigator: {},
  console, setTimeout, clearTimeout, setInterval, clearInterval, Date, Math, JSON, Promise, URL, Blob,
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
const petPath = path.join(root, 'pet.js');
if (fs.existsSync(petPath)) vm.runInContext(fs.readFileSync(petPath, 'utf8'), sandbox);
vm.runInContext(code + '\n;globalThis.__T={S:()=>S,render,MEALS,STEPS,PLAN,ING,LABS,num,checkNum,level,esc,save,setDemo:(v)=>{DEMO=v},setRedraw:(v)=>{REDRAW=v},ch:()=>CH,chSync,petCtx,dayPts,todayKey,guideSteps:()=>guideSteps(),guideToast:(b)=>guideToast(b)};', sandbox);
const T = sandbox.__T;

let ok = 0, bad = 0;
const check = (name, cond, info) => { if (cond) ok++; else bad++; console.log((cond ? 'OK   ' : 'BLAD ') + name + (info ? ' -> ' + info : '')); };

check('index.html: brak skryptów i stylów wstawionych w HTML (CSP)', !/<script>|<style>|\son[a-z]+=/i.test(html));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
const missing = manifest.icons.map((i) => i.src).concat(['icons/apple-touch-icon.png']).filter((f) => !fs.existsSync(path.join(root, f)));
check('manifest: nazwa Miara i wszystkie ikony istnieją', manifest.name === 'Miara' && !missing.length, missing.join(', '));
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const swMissing = [...sw.matchAll(/'\.\/([^']+)'/g)].map((m) => m[1]).filter((f) => f && !fs.existsSync(path.join(root, f)));
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
    num: T.num,
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
const css = fs.readFileSync(path.join(root, 'app.css'), 'utf8');
check('app.css: prefers-reduced-motion wyłącza animacje zwierzaka', /prefers-reduced-motion[^{]*\{[^@]*\.pet[^{]*\{[^}]*animation:none/.test(css));

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
check('sw.js: pet.js w pamięci podręcznej, CACHE miara-v2', swSrc.includes("'./pet.js'") && swSrc.includes("'miara-v2'"));
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
tryc('guide: po ukończeniu panel znika, przycisk ochoty wraca na górę', () => {
  const h = view('day', { ...NEWU(), pet: { ...PETA }, guide: { hidden: false, dataOk: true, seenPet: true }, meas: { [today()]: { w: '82', steps: '6000' } }, days: { [today()]: [{ kind: 'm', label: 'x', k: 400, p: 30, f: 10, c: 40 }] } });
  return !h.includes('Pierwsze kroki') && h.indexOf('Mam ochotę coś przekąsić') < h.indexOf('Dziś:');
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

console.log(`WYNIK: ${ok} OK, ${bad} BLAD`);
process.exit(bad ? 1 : 0);
