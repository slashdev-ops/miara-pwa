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
const zdPath = path.join(root, 'zdarzenia.js');
if (fs.existsSync(zdPath)) vm.runInContext(fs.readFileSync(zdPath, 'utf8'), sandbox);
vm.runInContext(code + '\n;globalThis.__T={S:()=>S,CHIPS,modeSuggest:()=>modeSuggest(),targetKcal:()=>targetKcal(),protTarget:()=>protTarget(),DEF:()=>DEF,nhKeep:()=>typeof BK_NH_KEEP=="undefined"?null:BK_NH_KEEP,setPending:(v)=>{BK_PENDING=v},render,MEALS,STEPS,PLAN,ING,LABS,num,checkNum,level,esc,save,setDemo:(v)=>{DEMO=v},setRedraw:(v)=>{REDRAW=v},ch:()=>CH,chSync,petCtx,dayPts,todayKey,guideSteps:()=>guideSteps(),guideToast:(b)=>guideToast(b),streak,bkBuild,kopiaDerive,kopiaEncrypt,kopiaDecrypt,kopiaSetup,KS,kopiaDue,kopiaSend,kopiaAuto,toast,toastMs,filtered,planIds,stpApply,SCEN,scenS,mealTags,macros,HOLD_DELAY,holdGap,planFor,ioFit,migGap,shopLines,ordCalc,CARDS,SRC,ORD,ORD_ADD,KROKI,kProg,krokMeals,mondayOf,reviewKey,ZAP,helpRes,PET,fixTouched,stpApply,bmiCutFor,parseImport,impFromHash};', sandbox);
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
tryc('pet.badgeList: etykiety i zdobyte', () => { const b = P().badgeList(['streak7', 'level-Brąz']); return b.length === 12 && b.find((x) => x.id === 'streak7').got && b.find((x) => x.id === 'level-Brąz').label === 'Tydzień na poziomie Brąz' && !b.find((x) => x.id === 'w5').got; });
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

const views = ['meals', 'train', 'day', 'health', 'set', 'sos', 'labs', 'intro', 'review', 'recipe', 'knee', 'impact', 'challenge', 'pet', 'krok', 'import'];
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
tryc('wprowadzenie: 1 ekran danych, Zaczynam, bez kropek postępu i bez wyboru zwierzaka', () => { const a = view('intro', { introStep: 0 }); return a.includes('Twoje dane') && !a.includes('data-intronext') && a.includes('>Zaczynam<') && !a.includes('Krok 1 z') && !a.includes('data-petkind'); });
const swSrc = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
check('sw.js: pet.js i krój pisma w pamięci podręcznej, CACHE miara-v3 (duże wydanie)', swSrc.includes("'./pet.js'") && swSrc.includes("'miara-v3'") && swSrc.includes("'./fonts/fraunces-latin-ext-600-normal.woff2'"));
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
const CLEAN = () => ({ days: {}, swaps: {}, meas: {}, hab: {}, urges: {}, reviews: {}, mode: 'redukcja', petCeleb: null, krok: null }), NOREV = SEEN_ALL.filter((x) => x !== 'review1');
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
// Rada 07.11.2026 (nowy układ): przycisk ochoty ma stałe miejsce pod zwierzakiem; na górze jest Stan dziś
tryc('guide: po ukończeniu panel znika, na górze Stan dziś, przycisk ochoty raz, pod Dziś', () => {
  const h = view('day', { ...NEWU(), pet: { ...PETA }, guide: { hidden: false, dataOk: true, seenPet: true }, meas: { [today()]: { w: '82', steps: '6000' } }, days: { [today()]: [{ kind: 'm', label: 'x', k: 400, p: 30, f: 10, c: 40 }] } });
  return !h.includes('Pierwsze kroki') && h.indexOf('Stan dziś') < h.indexOf('Dziś:') && h.indexOf('Dziś:') < h.indexOf('Mam ochotę coś przekąsić') && h.split('Mam ochotę coś przekąsić').length === 2;
});
tryc('guide: ukryty panel się nie pokazuje', () => !view('day', { ...NEWU(), guide: { hidden: true, dataOk: false, seenPet: false } }).includes('Pierwsze kroki'));
tryc('guide: Zapisz w Ustawieniach zalicza dane, ekran zwierzaka zalicza poznanie', () => { view('set', { ...NEWU(), kg: '82', cm: '170', age: '40', goal: '74', mode: 'redukcja' }); click({ datasave: '1' }); const a = T.S().guide.dataOk; view('pet', { pet: { ...PETA } }); return a && T.S().guide.seenPet; });
tryc('Dziś: podpowiedź akcji i wyróżniony następny krok', () => { const h = view('day', NEWU()); return h.includes('Otwórz Posiłki i naciśnij Zjem') && h.includes('class="opt hab next"'); });
tryc('bez ślepych zaułków: przyciski do Treningu i Posiłków', () => { const h = view('day', NEWU()); return !h.includes('w zakładce Trening') && h.includes('Przejdź do Treningu') && h.includes('Przejdź do Posiłków'); });
tryc('karta: jajo mówi, jak się wykluć', () => view('day', { ...NEWU(), pet: { ...PETA } }).includes('wykluje się'));
tryc('wprowadzenie: cel aplikacji i dane w telefonie na ekranie danych, Pomiń widoczne', () => { const h = view('intro', { introStep: 0 }); return h.includes('liczy kalorie z Twoich danych') && h.includes('tylko w tym telefonie') && h.includes('>Pomiń<'); });
tryc('wprowadzenie: stare dane z krokiem 4 otwierają ekran danych bez błędu', () => view('intro', { introStep: 4 }).includes('Twoje dane'));
tryc('wprowadzenie: po Zaczynam komunikat z celem kalorii i jajkiem do wyboru towarzysza', () => { view('intro', { introStep: 0, onb: false, pet: null, touched: { kg: true, cm: true, age: true, goal: true } }); click({ introdone: 'ok' }); const t = els.toast.innerHTML; return /Twój cel na start: [0-9 ]+ kcal dziennie/.test(t) && t.includes('jajko') && t.includes('data-tab="pet"'); });
tryc('wprowadzenie: z wybranym zwierzakiem komunikat tylko z celem', () => { view('intro', { introStep: 0, onb: false, pet: { ...PETA }, touched: { kg: true, cm: true, age: true, goal: true } }); click({ introdone: 'ok' }); const t = els.toast.innerHTML; return t.includes('kcal dziennie') && !t.includes('jajko'); });
tryc('wprowadzenie: Pomiń bez komunikatu o celu', () => { els.toast.innerHTML = ''; view('intro', { introStep: 0, onb: false }); click({ introdone: '1' }); return !els.toast.innerHTML.includes('kcal dziennie'); });
tryc('wprowadzenie: Zaczynam na danych zalicza dane, Pomiń nie', () => { view('intro', { introStep: 0, onb: false, touched: { kg: true, cm: true, age: true, goal: true }, guide: { hidden: false, dataOk: false, seenPet: false } }); click({ introdone: 'ok' }); const a = T.S().guide.dataOk && T.S().onb; view('intro', { introStep: 0, onb: false, guide: { hidden: false, dataOk: false, seenPet: false } }); click({ introdone: '1' }); return a && !T.S().guide.dataOk; });
tryc('komunikat po akcji wskazuje następny krok', () => { view('day', { ...NEWU(), pet: { ...PETA } }); return T.guideToast('Dodano do dnia') === 'Dodano do dnia. Dalej: sprawdź swoje dane.'; });

// Rada 05.11.2026, P1: wskaźnik mierzy zapisywanie, nie jedzenie; wybór zwierzaka nie świętuje dawnych osiągnięć
tryc('P1-1: pasek nazywa się Posiłki, bez słowa Najedzenie', () => { const h = P().card(st(mkCtx({ today: { sleep: 7, steps: 7000 } })), { kind: 'gaska', name: 'Kluska' }, T.esc); return h.includes('Posiłki') && !h.includes('Najedzenie'); });
tryc('P1-1: mina bez posiłku nie mówi o głodzie i nie pokazuje miski', () => { const s = st(mkCtx({ today: { sleep: 7, steps: 7000 } })), c = { kind: 'gaska', name: 'Kluska' }; const h = P().card(s, c, T.esc) + P().screen(s, c, { today: { done: 0, pts: 0 }, week: { pts: 0, level: 'Start', next: null }, all: { active: 1, streak: 0, dw: null, waist: null, pct: null }, badges: [], body: '' }, T.esc); return s.mood === 'hungry' && !/głodn/i.test(h) && !h.includes('class="bowl"') && h.includes('class="note"'); });
tryc('P1-2: pierwszy wybór zwierzaka zalicza dawne osiągnięcia bez świętowania', () => {
  view('set', { ...CLEAN(), pet: null, petSeen: [], reviews: REV }); click({ petprev: 'gaska' }); click({ petok: '1' });
  return T.S().petSeen.includes('review1') && !view('day').includes('pet-celebrate');
});
tryc('P1-2: to samo po odtworzeniu starej kopii bez petSeen', () => {
  const S = T.S(); view('set', { ...CLEAN(), pet: null, reviews: REV }); delete S.petSeen; click({ petprev: 'kaczka' }); click({ petok: '1' });
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
tryc('dalej: ze zwierzakiem prowadzi do następnego kroku w Moim dniu', () => view('set', { ...NEWU(), ...OKD, pet: { ...PETA }, guide: { hidden: false, dataOk: true, seenPet: false } }).includes('<button class="btn" data-nav="day#m_w">Dalej: wpisz dzisiejszą wagę</button>'));
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
const BASE = (o) => ({ ...CLEAN(), consent: null, kopia: null, prof: { cond: {}, pill: '' }, pet: { ...PETA }, petSeen: [...SEEN_ALL], guide: { ...HID }, tips: { day: true, health: true, set: true }, pain: {}, cardsOk: {}, discreet: false, once: false, visit: null, ...o });
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
const SYS = ['bg', 'surface', 'surface2', 'ink', 'muted', 'line', 'field', 'green', 'on-green', 'on-green-muted', 'tint', 'brass', 'brass-ink', 'clay', 'warn-ink', 'warn-bg', 'shadow'];
const ruleOf = (sel) => { const i = sysCss.indexOf(sel + '{'); return i < 0 ? '' : sysCss.slice(i + sel.length + 1, sysCss.indexOf('}', i)); };
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
tryc('wygląd: obramowanie pól i znaczników wyboru co najmniej 3:1 (WCAG 1.4.11) w obu motywach', () => {
  const b = themeBlocks(), bad = [];
  for (const [name, blk] of [['jasny', b.light], ['ciemny', b.dark]]) for (const g of ['surface', 'bg', 'surface2']) { const c = contrast(tok(blk, 'field'), tok(blk, g)); if (c < 3) bad.push(`${name} field/${g} ${c.toFixed(2)}`); }
  for (const sel of ['.field input[type=text],.field input[type=date],.field input[type=password]', '.field select', '.opt .dot', '.switch', '.hab .box', '.step .box']) if (!ruleOf(sel).includes('var(--field)')) bad.push(sel);
  if (bad.length) throw new Error(bad.join('; '));
  return true;
});
tryc('wygląd: pola w kodzie aplikacji bez słabego obramowania (1.4.11)', () => { const bad = (code.match(/<(textarea|input|select)[^>]*>/g) || []).filter((t) => t.includes('var(--line)')); if (bad.length) throw new Error(bad.length + ' pól: ' + bad.map((t) => t.slice(0, 40)).join(' | ')); return true; });
tryc('wygląd: Stan dziś jako zielona karta, tekst pomocniczy co najmniej 4,5:1 w obu motywach', () => {
  const b = themeBlocks(), bad = [];
  for (const [name, blk] of [['jasny', b.light], ['ciemny', b.dark]]) { const c = contrast(tok(blk, 'on-green-muted'), tok(blk, 'green')); if (c < 4.5) bad.push(`${name} ${c.toFixed(2)}`); }
  const st = ruleOf('.stan');
  if (!st.includes('background:var(--green)') || !st.includes('color:var(--on-green)')) bad.push('.stan');
  for (const sel of ['.stan .stan-lab', '.stan .stan-src', '.stan .stan-val small']) if (!ruleOf(sel).includes('var(--on-green-muted)')) bad.push(sel);
  if (bad.length) throw new Error(bad.join('; '));
  return true;
});
tryc('wygląd: karta zwierzaka z delikatnym tłem, tekst czytelny w obu motywach', () => {
  const b = themeBlocks();
  return ruleOf('.petcard').includes('linear-gradient(135deg,var(--tint)') && [b.light, b.dark].every((blk) => contrast(tok(blk, 'ink'), tok(blk, 'tint')) >= 4.5 && contrast(tok(blk, 'muted'), tok(blk, 'tint')) >= 4.5);
});
tryc('wygląd: nagłówki z akcentem, bez akcentu na zielonej karcie', () => ruleOf('h2::before').includes('background:var(--green)') && ruleOf('.stan h2::before').includes('display:none'));
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
tryc('stan: sen ostatniej nocy i średnia z liczbą nocy', () => { const h = stan(view('day', BASE({ meas: { [dk(0)]: { sleep: '6,5' }, [dk(1)]: { sleep: '7,5' } } }))); return h.includes('6 h 30 min') && h.includes('średnia 7 h z 2 nocy'); });
tryc('stan: ruch z krokami i treningiem', () => { const h = stan(view('day', BASE({ meas: { [dk(0)]: { steps: '8123' } }, days: { [dk(0)]: [{ kind: 't', label: 'x', min: 40, gross: 300, net: 200 }] } }))); return /8\s?123 kroków/.test(h) && h.includes('trening 40 min'); });
tryc('stan: ból i cykl tylko przy danych', () => { const h = stan(view('day', BASE({ pain: { [dk(0)]: { aura: true } }, meas: { [dk(0)]: { cyc: 'P' } } }))); return h.includes('Ból i cykl') && h.includes('dzień z bólem, aura') && h.includes('dni bez hormonów'); });
tryc('układ: Stan dziś na górze, karty pod nim, potem Dziś, zwierzak niżej; Więcej zwinięte', () => {
  const h = view('day', BASE({ pain: { [dk(0)]: {} }, meas: { [dk(0)]: { cyc: 'P' } } })), i = (x) => h.indexOf(x);
  return i('class="stan') > -1 && i('class="stan') < i('data-card=') && i('data-card=') < i('<h2>Dziś') && i('<h2>Dziś') < i('class="petcard') && /<details class="fold" id="fold_wiecej" data-fold="wiecej">/.test(h) && h.indexOf('data-fold="prognoza"') > i('data-fold="wiecej"');
});

tryc('układ Treningu: główne zadanie na górze, program kolana niżej jako przycisk konturowy', () => { const h = view('train', BASE()), k = h.indexOf('data-tab="knee"'); return k > h.indexOf('data-addtrain') && h.indexOf('data-addwatch') < h.indexOf('data-addtrain') && /<button class="btn ghost" data-tab="knee"/.test(h); });

// Zgłoszenie 06.11.2026: przewodnik, komunikaty do przeczytania i zamknięcia, pola bez klawiatury, Gotuję to dziś, dwa rytmy planu
const NAVS = (h) => [...h.matchAll(/data-nav="([^"]+)"/g)].map((m) => m[1]);
tryc('pomoc: przycisk Pomoc w nagłówku każdego ekranu', () => /<header>[\s\S]*data-tab="help"[\s\S]*<\/header>/.test(html));
tryc('przewodnik: co najmniej 10 zadań, każde prowadzi do celu, który istnieje na ekranie docelowym', () => {
  const L = NAVS(view('help', BASE()));
  if (L.length < 10) throw new Error('zadań: ' + L.length);
  const miss = L.filter((n) => { const [tab, id] = n.split('#'); return id && !view(tab, BASE({ sex: 'K', tips: { day: true, health: true, set: true, meals: true, train: true } })).includes(`id="${id}"`); });
  if (miss.length) throw new Error('brak celu: ' + miss.join(' '));
  return true;
});
tryc('przewodnik: przejście ustawia ekran i rozwija zwinięty fragment', () => { view('help', BASE()); click({ nav: 'day#m_waist#obwody' }); return T.S().tab === 'day' && mainHtml().includes('data-fold="obwody" open'); });
tryc('przewodnik: przywraca pierwsze kroki i wskazówki', () => { const h = view('help', BASE()); click({ guideshow: '1' }); return h.includes('data-tipsreset') && T.S().guide.hidden === false; });
tryc('komunikat: czas z długości tekstu, od 3 do 12 s', () => { const a = T.toastMs('Zapisano'), b = T.toastMs('x'.repeat(120)), c = T.toastMs('x'.repeat(2000)); return a >= 3000 && b > a && c === 12000; });
tryc('komunikat: dłużej podwaja czas, do zamknięcia bez czasu', () => { const S = T.S(), a = T.toastMs('Zapisano'); S.toastLen = 'long'; const b = T.toastMs('Zapisano'); S.toastLen = 'stay'; const c = T.toastMs('Zapisano'); S.toastLen = 'std'; return b === 2 * a && c === 0; });
tryc('komunikat: przycisk zamknięcia i przejścia, rola status', () => { T.toast('Dodano', { act: 'tab', arg: 'meals', label: 'Plan dnia' }); const h = els.toast.innerHTML; return h.includes('data-toastclose') && h.includes('data-tab="meals"') && h.includes('Plan dnia') && /id="toast"[^>]*role="status"|role="status"[^>]*id="toast"/.test(html); });
tryc('komunikat: tekst jest escapowany', () => { T.toast('<img src=x>'); return !els.toast.innerHTML.includes('<img'); });
tryc('komunikat: Ustawienia mają wybór czasu komunikatów', () => { const h = view('set', BASE()); return h.includes('id="komunikaty"') && h.includes('data-toastlen="stay"'); });
tryc('komunikat: po zapisie posiłku w pierwszych krokach przycisk do następnego kroku', () => { view('meals', { ...NEWU(), kg: '82', guide: { hidden: false, dataOk: true, seenPet: false }, pet: { ...PETA } }); click({ addmeal: 's1' }); return /data-(tab|goto|nav)="/.test(els.toast.innerHTML); });
tryc('pola: Ustawienia mają przyciski − i + przy wadze i wzroście', () => { const h = view('set', BASE()); return h.includes('data-stp="kg"') && h.includes('data-stp="cm"'); });
tryc('pola: + przy wadze dodaje 0,1 kg', () => { view('set', BASE({ kg: '82' })); click({ stp: 'kg', d: '1' }); return T.S().kg === '82,1'; });
tryc('pola: − przy wadze odejmuje 0,1 kg', () => { view('set', BASE({ kg: '82' })); click({ stp: 'kg', d: '-1' }); return T.S().kg === '81,9'; });
tryc('pola: krok nie wychodzi poza limit', () => { view('set', BASE({ cm: '220' })); click({ stp: 'cm', d: '1' }); return T.S().cm === '220'; });
tryc('pola: puste pole wagi dnia zaczyna od ostatniego ważenia, potem krok', () => {
  const k = `meas.${dk(0)}.w`; view('day', BASE({ meas: { [dk(2)]: { w: '80,4' } } })); click({ stp: k, d: '1' }); const a = T.S().meas[dk(0)].w; click({ stp: k, d: '1' }); return a === '80,4' && T.S().meas[dk(0)].w === '80,5';
});
tryc('pola: sen zaczyna od 7 h i idzie co 15 minut', () => { const k = `meas.${dk(0)}.sleep`; view('day', BASE()); click({ stp: k, d: '1' }); click({ stp: k, d: '1' }); return T.S().meas[dk(0)].sleep === '7:15'; });
tryc('pola: Pomiary dnia mają przyciski przy wadze, krokach i śnie', () => { const h = view('day', BASE()); return ['w', 'steps', 'sleep'].every((x) => h.includes(`data-stp="meas.${dk(0)}.${x}"`)); });
tryc('trening: szybki wybór czasu 30, 45, 60, 90 min', () => { const h = view('train', BASE()); if (![30, 45, 60, 90].every((v) => h.includes(`data-setv="tr.wmin" data-v="${v}"`))) return false; click({ setv: 'tr.wmin', v: '45' }); return T.S().tr.wmin === '45'; });
tryc('gotuję: przepis ma przycisk Gotuję to dziś', () => { T.S().recipe = 'o10'; return view('recipe', BASE()).includes('data-cook="o10"'); });
tryc('gotuję: danie trafia do planu dnia w miejsce posiłku tego samego rodzaju', () => { view('recipe', BASE({ swaps: {} })); click({ cook: 'o10' }); const ids = T.planIds(); return ids.includes('o10') && ids.filter((id) => T.MEALS.find((m) => m.id === id).t === 'obiad').length === 1; });
tryc('gotuję: Według planu zapisuje wybrane danie, plan pokazuje Twój wybór', () => { view('recipe', BASE({ swaps: {}, once: true })); click({ cook: 'o10' }); const h = view('meals', {}); click({ dayplan: '1' }); return h.includes('Twój wybór') && (T.S().days[T.todayKey()] || []).some((e) => e.id === 'o10'); });
tryc('rytm: filtr Na co dzień pokazuje dania do 20 min', () => { const S = T.S(); view('meals', BASE()); S.f.type = 'all'; S.f.pace = 'quick'; const L = T.filtered(); S.f.pace = 'all'; S.f.type = 'obiad'; return L.length > 5 && L.every((o) => o.m.min <= 20); });
tryc('rytm: filtr Na weekend pokazuje dania od 25 min', () => { const S = T.S(); S.f.type = 'obiad'; S.f.pace = 'big'; const L = T.filtered(); S.f.pace = 'all'; return L.length > 3 && L.every((o) => o.m.min >= 25); });
tryc('rytm: Posiłki mają wybór Na co dzień i Na weekend', () => { const h = view('meals', BASE()); return h.includes('id="rytm"') && h.includes('data-pace="quick"') && h.includes('data-pace="big"'); });
tryc('plan: obiady w dni robocze do 20 min, w weekend większe danie', () => [1, 2, 3, 4, 5].every((d) => T.PLAN[d].map((id) => T.MEALS.find((m) => m.id === id)).filter((m) => m.t === 'obiad').every((m) => m.min <= 20)) && [6, 0].every((d) => T.PLAN[d].map((id) => T.MEALS.find((m) => m.id === id)).some((m) => m.t === 'obiad' && m.min >= 25)));

// Zgłoszenie 06.11.2026: jeden styl przycisków pilnowany testami; „Po co” przy niejasnych sekcjach i w Pomocy
const rule = (sel) => { const i = sysCss.indexOf('\n' + sel + '{'); return i < 0 ? '' : sysCss.slice(i + sel.length + 2, sysCss.indexOf('}', i)); };
tryc('przyciski: działania mają kształt pól (12 px) i tekst w jednej linii', () => /border-radius:var\(--r-s\)/.test(rule('.btn')) && /white-space:nowrap/.test(rule('.btn')));
tryc('przyciski: − i + w kształcie pól', () => /border-radius:var\(--r-s\)/.test(rule('.stp')));
tryc('przyciski: pigułka tylko dla chipów', () => { const bad = [...sysCss.matchAll(/([^{}\n]+)\{[^}]*border-radius:var\(--pill\)/g)].map((m) => m[1].trim()).filter((sel) => /\.btn|\.stp|\.tclose|\.hbtn|button/.test(sel) && !/^\.chip\b/.test(sel)); if (bad.length) throw new Error(bad.join(' | ')); return true; });
tryc('przyciski: działania sekcji na pełną szerokość, jedno pod drugim', () => /main p > \.btn:not\(\.small\)\{[^}]*width:100%/.test(sysCss));
tryc('przyciski: bez szerokości w atrybucie style i bez pływania', () => !/class="btn[^"]*"[^>]*style="width:100%"/.test(code) && !/\.btn\{[^}]*float/.test(sysCss) && !/\.btn[^{]*\{[^}]*float:/.test(sysCss));
tryc('przyciski: wyłączone powiększanie tekstu przez przeglądarkę', () => /html\{[^}]*(^|;)text-size-adjust:100%/.test(sysCss));
tryc('przyciski: każdy napis na przyciskach najwyżej 28 znaków', () => {
  const long = new Set();
  for (const tab of ['day', 'meals', 'train', 'health', 'set', 'help', 'sos', 'visit', 'labs', 'knee', 'impact', 'pet', 'review']) {
    const h = view(tab, BASE()); for (const m of h.matchAll(/<button class="btn[^"]*"[^>]*>([^<]*)<\/button>/g)) if (m[1].trim().length > 28) long.add(tab + ': ' + m[1].trim());
  }
  if (long.size) throw new Error([...long].join(' | ')); return true;
});
tryc('po co: Białko za złotówkę mówi, po co jest', () => { const h = view('health', BASE()); return h.includes('id="bialko"') && /id="bialko"[\s\S]{0,200}Po co:[^<]*<\/b>[^<]*najtaniej/.test(h); });
tryc('po co: Pomoc ma część Co to znaczy? z hasłem Białko za złotówkę', () => { const h = view('help', BASE()); return h.includes('Co to znaczy?') && h.includes('data-nav="health#bialko"'); });
tryc('po co: Makro na porcję i Pod trening z wyjaśnieniem', () => { const h = view('meals', BASE()); return /id="makro"[\s\S]{0,120}Po co:/.test(h) && /id="podtrening"[\s\S]{0,120}Po co:/.test(h); });
tryc('po co: przejście otwiera zagnieżdżone zwinięcia', () => { view('help', BASE()); click({ nav: 'day#fold_prognoza#wiecej,prognoza' }); const h = mainHtml(); return h.includes('data-fold="wiecej" open') && h.includes('data-fold="prognoza" open') && h.includes('id="fold_prognoza"'); });

tryc('przyciski: ten sam rozmiar w zwiniętych sekcjach (box-sizing bez dziedziczenia przez details)', () => sysCss.includes('*,*::before,*::after{box-sizing:border-box}') && !sysCss.includes('box-sizing:inherit'));

// Zgłoszenie 06.11.2026: Tydzień cyklu wyjaśniony; profil zdrowia, plan działań z danych, 12 tygodni bez zmyślonych prognoz
const PROF = (cond, pill) => ({ prof: { cond: Object.fromEntries(cond.map((c) => [c, true])), pill: pill || '' } });
const planOf = (h) => { const m = h.match(/<section class="plan[^"]*"[\s\S]*?<\/section>/); return m ? m[0] : ''; };
const firstAct = (h) => { const m = planOf(h).match(/<div class="act first">[\s\S]*?<\/div>/); return m ? m[0] : ''; };
tryc('cykl: Tydzień cyklu dziś ma Po co', () => /Tydzień cyklu dziś[\s\S]{0,120}Po co:/.test(view('day', BASE({ sex: 'K' }))));
tryc('cykl: Pomoc ma hasło Tydzień cyklu', () => view('help', BASE()).includes('Tydzień cyklu dziś'));
tryc('profil: Zdrowie ma wybór chorób i co najmniej 12 tabletek, w tym Yaz i minitabletkę', () => { const h = view('health', BASE()); return h.includes('id="profil"') && ['hashi', 'lip', 'aura', 'mig', 'io'].every((c) => h.includes(`data-cond="${c}"`)) && (h.match(/<option value="[a-z_]+"/g) || []).length >= 12 && h.includes('value="yaz"') && h.includes('value="cerazette"'); });
tryc('profil: zaznaczenie choroby zapisuje się w profilu', () => { view('health', BASE()); click({ cond: 'hashi' }); const a = T.S().prof.cond.hashi === true; click({ cond: 'hashi' }); return a && T.S().prof.cond.hashi === false; });
tryc('plan: bez profilu prosi o zaznaczenie chorób', () => planOf(view('health', BASE({ prof: { cond: {}, pill: '' } }))).includes('Zaznacz wyżej'));
tryc('plan: aura i Yaz: najpierw przeciwwskazanie WHO, kategoria 4', () => { const f = firstAct(view('health', BASE(PROF(['aura'], 'yaz')))); return f.includes('przeciwwskazanie') && f.includes('kategoria 4'); });
tryc('plan: dni z aurą w dzienniku działają jak zaznaczona aura', () => firstAct(view('health', BASE({ ...PROF(['mig'], 'jeanine'), pain: { [dk(3)]: { aura: true } } }))).includes('przeciwwskazanie'));
tryc('plan: aura i minitabletka: kategorie UKMEC i WHO 2025, bez przeciwwskazania', () => { const h = planOf(view('health', BASE(PROF(['aura'], 'cerazette')))); return !h.includes('przeciwwskazanie') && h.includes('UKMEC 2025: kategoria 2') && h.includes('3 przy kontynuacji'); });
tryc('plan: Hashimoto i tabletka z estrogenem: TSH 6-8 tygodni', () => planOf(view('health', BASE(PROF(['hashi'], 'yaz')))).includes('TSH 6-8 tygodni'));
tryc('plan: drospirenon z ryzykiem zakrzepicy w liczbach', () => planOf(view('health', BASE(PROF([], 'yaz')))).includes('9-12 na 10 000'));
tryc('plan: 10 dni z lekiem w 30 dniach: ostrzeżenie o nadużywaniu leków z liczbą', () => {
  const pain = {}; for (let i = 0; i < 10; i++) pain[dk(i * 2)] = { med: true };
  const f = firstAct(view('health', BASE({ ...PROF(['mig'], ''), pain }))); return f.includes('10 dni z lekiem') && f.includes('nadużywania');
});
tryc('plan: 4 dni z bólem w 30 dniach: pytanie o leczenie zapobiegawcze', () => { const pain = {}; for (let i = 0; i < 4; i++) pain[dk(i)] = {}; return planOf(view('health', BASE({ ...PROF(['mig'], ''), pain }))).includes('zapobiegawcze'); });
tryc('plan: lipodemia: talia i uda osobno, kompresja', () => { const h = planOf(view('health', BASE(PROF(['lip'], '')))); return h.includes('kompresja') && h.includes('osobno'); });
tryc('plan: każde działanie podaje siłę dowodów', () => { const h = planOf(view('health', BASE(PROF(['hashi', 'lip', 'mig', 'io'], 'yaz')))), n = (h.match(/<div class="act/g) || []).length, e = (h.match(/class="ev"/g) || []).length; return n >= 8 && n === e; });
tryc('12 tygodni: tabela 12 tygodni z wagą w przedziale', () => { const h = view('health', BASE({ ...PROF(['hashi'], ''), kg: '80', goal: '70' })), m = h.match(/<table class="weeks"[\s\S]*?<\/table>/); return !!m && (m[0].match(/<tr class="wk"/g) || []).length === 12 && /7[0-9],[0-9]-7[0-9],[0-9] kg/.test(m[0]); });
tryc('12 tygodni: bez prognoz wyników badań i samopoczucia', () => { const h = view('health', BASE({ ...PROF(['hashi', 'mig'], 'yaz'), kg: '80', goal: '70' })), m = (h.match(/<table class="weeks"[\s\S]*?<\/table>/) || [''])[0]; return !/TSH (spadnie|wyniesie)|samopoczucie (wzro|popraw)/.test(m) && h.includes('nie prognozuje'); });
tryc('profil: kopia bez danych zdrowotnych usuwa profil', () => { Object.assign(T.S(), PROF(['hashi'], 'yaz')); const d = JSON.parse(T.bkBuild(true)).data; return !d.prof; });
// Kopia bez danych o zdrowiu: lista tego, co zostaje (rada 09.11.2026, kopia bez danych o zdrowiu)
const NH_KEEP = ['toastLen', 'tips', 'discreet', 'pet', 'prices', 'ord'];
const NH_DROP = ['kg', 'cm', 'age', 'sex', 'goal', 'touched', 'goalWay', 'muscle', 'bmiCut', 'korekta', 'tab', 'f', 'tr', 'days', 'hab', 'urges', 'meas', 'labs', 'labSel', 'onb', 'introStep', 'reviews', 'body', 'once', 'prof', 'cardsOk', 'pain', 'consent', 'kopia', 'visit', 'petSeen', 'petCeleb', 'krok', 'guide', 'legs', 'lip', 'mode', 'maintRef', 'maintSince', 'knee', 'wi', 'chMode', 'bkNoHealth', 'lastBackup', 'sosStep', 'sosTrig', 'ifthen', 'swaps', 'cel', 'modeKeep'];
tryc('kopia bez zdrowia: każde pole stanu ma przypisanie (zostaje albo pomijane)', () => { const bad = Object.keys(T.DEF()).filter((k) => NH_KEEP.includes(k) === NH_DROP.includes(k)); if (bad.length) throw new Error('bez przypisania albo w obu: ' + bad.join(', ')); return JSON.stringify(T.nhKeep()) === JSON.stringify(NH_KEEP); });
tryc('kopia bez zdrowia: tylko ustawienia i ceny, bez wagi, pomiarów, posiłków, kolana i odpowiedzi', () => {
  view('day', BASE({ kg: '90', age: '50', sex: 'M', muscle: true, bmiCut: 'nhs', meas: { [dk(0)]: { w: '90', steps: '8000', waist: '100' } }, days: { [dk(0)]: ML(1, 500, 30) }, krok: { step: 1, since: dk(3), ans: { why: 'zmeczenie' } }, knee: { start: dk(3), sessions: [{ d: dk(1), pain: 4 }], morning: {}, days: [2], tmpPain: null, tmpCramp: null } }));
  const o = JSON.parse(T.bkBuild(true)), d = o.data, extra = Object.keys(d).filter((k) => !NH_KEEP.includes(k));
  if (extra.length) throw new Error('w pliku: ' + extra.join(', '));
  const full = JSON.parse(T.bkBuild(false)).data;
  return o.noHealth === true && full.kg === '90' && !!full.meas[dk(0)] && !!full.krok;
});
tryc('kopia bez zdrowia: wczytanie zmienia tylko ustawienia i ceny, dane osoby zostają', () => {
  view('set', BASE({ kg: '82', meas: { [dk(0)]: { w: '82' } }, days: { [dk(0)]: ML(1, 400, 20) }, discreet: false }));
  T.setPending({ app: 'talerz-i-trening', v: 1, created: '2026-11-09T10:00:00Z', noHealth: true, data: { discreet: true, prices: { twarog: { p: '5', g: '250' } } } });
  const h = view('set', T.S()); if (!h.includes('zmieni tylko ustawienia i ceny')) throw new Error('brak opisu wczytania');
  click({ bkapply: '1' }); const s = T.S();
  return s.kg === '82' && s.meas[dk(0)].w === '82' && s.days[dk(0)].length === 1 && s.discreet === true && s.prices.twarog.p === '5';
});
tryc('kopia bez zdrowia: opis przełącznika mówi, co jest w pliku', () => view('set', BASE()).includes('Tylko ustawienia i ceny: bez wagi, pomiarów, posiłków i odpowiedzi'));

// Zgłoszenie 06.11.2026: sen 6 h 13 min nie da się wpisać przecinkiem; sen jako godziny i minuty, bez dwuznaczności
const typeSleep = (h, m) => { mk('m_sleep').value = h; mk('m_sleepm').value = m; let bad = false; const t = { dataset: { sl: 'm', day: dk(0) }, value: m, title: '', classList: { toggle: (c, on) => { if (c === 'bad') bad = !!on; } }, setAttribute() {}, getAttribute: () => 'numeric' }; (lis.input || []).forEach((f) => f({ target: t })); return bad; };
tryc('sen: dwa pola, godziny i minuty, z klawiaturą samych cyfr', () => { const h = view('day', BASE()); return /id="m_sleep"[^>]*inputmode="numeric"|inputmode="numeric"[^>]*id="m_sleep"/.test(h) && /inputmode="numeric"[^>]*id="m_sleepm"/.test(h) && !h.includes('np. 7,5'); });
tryc('sen: 6 h i 13 min zapisuje 6:13', () => { view('day', BASE()); const bad = typeSleep('6', '13'); return !bad && T.S().meas[dk(0)].sleep === '6:13' && Math.abs(T.num('6:13') - (6 + 13 / 60)) < 1e-9; });
tryc('sen: same minuty 45 to 0:45', () => { view('day', BASE()); typeSleep('', '45'); return T.S().meas[dk(0)].sleep === '0:45'; });
tryc('sen: minuty 75 odrzucone, zostaje poprzednia wartość', () => { view('day', BASE({ meas: { [dk(0)]: { sleep: '7:00' } } })); const bad = typeSleep('6', '75'); return bad && T.S().meas[dk(0)].sleep === '7:00'; });
tryc('sen: 17 godzin odrzucone', () => { view('day', BASE({ meas: { [dk(0)]: { sleep: '7:00' } } })); return typeSleep('17', '0') && T.S().meas[dk(0)].sleep === '7:00'; });
tryc('sen: przecinek albo litery odrzucone', () => { view('day', BASE()); return typeSleep('6,5', '') && typeSleep('6', 'a'); });
tryc('sen: stary zapis 7,5 pokazuje 7 h i 30 min w polach', () => { const h = view('day', BASE({ meas: { [dk(0)]: { sleep: '7,5' } } })); return /id="m_sleep"[^>]*value="7"/.test(h) && /id="m_sleepm"[^>]*value="30"/.test(h); });
tryc('sen: Stan dziś pokazuje 6 h 13 min', () => stan(view('day', BASE({ meas: { [dk(0)]: { sleep: '6:13' } } }))).includes('6 h 13 min'));
tryc('sen: błędny wpis wraca do wartości sprzed edycji, nie do cyfry wpisanej po drodze', () => {
  view('day', BASE({ meas: { [dk(0)]: { sleep: '6:13' } } }));
  const t = { dataset: { sl: 'm', day: dk(0) }, classList: { contains: () => true }, title: 'Minuty od 0 do 59' };
  (lis.focusin || []).forEach((f) => f({ target: t })); typeSleep('6', '7'); typeSleep('6', '75'); T.setRedraw(false); (lis.focusout || []).forEach((f) => f({ target: t }));
  return T.S().meas[dk(0)].sleep === '6:13';
});
tryc('liczby: kroki 10,500 i 10.500 to dziesięć i pół tysiąca, nie 10,5', () => cn('meas.d.steps', '10,500').s === '10500' && cn('meas.d.steps', '10.500').s === '10500');
tryc('liczby: pola całkowite odrzucają ułamki z jasnym komunikatem', () => ['8,5', '45.5'].every((v) => /całkowit/.test(cn('meas.d.steps', v).err || '')) && /całkowit/.test(cn('age', '28,5').err || ''));
tryc('liczby: czas treningu 1:15 i 1:15:30 z zegarka to 75 i 76 minut', () => cn('tr.wmin', '1:15').s === '75' && cn('tr.wmin', '1:15:30').s === '76' && cn('tr.min', '0:45').s === '45');
tryc('liczby: czas treningu 1:75 odrzucony', () => !!cn('tr.wmin', '1:75').err);
tryc('liczby: komunikat błędu z przykładem dla tego pola, nie wagi', () => !/82,4/.test(cn('meas.d.steps', 'abc').err) && /82,4/.test(cn('meas.d.w', 'abc').err));
tryc('sen: 6:75 w tekście odrzucone przez walidację', () => !!cn('meas.d.sleep', '6:75').err && !cn('meas.d.sleep', '6:59').err);
tryc('sen: karty piszą sen w godzinach i minutach', () => view('day', BASE({ meas: { [dk(0)]: { sleep: '5:20' }, [dk(1)]: { sleep: '5:45' } } })).includes('sen: 5 h 45 min i 5 h 20 min'));

// Zgłoszenie 06.11.2026: przytrzymanie − i +, pola według WCAG 2.2, scenariusze do sprawdzania bez wpisywania
tryc('przytrzymanie: krok ze wspólnej funkcji, większy krok przy długim trzymaniu', () => { view('set', BASE({ kg: '82' })); T.stpApply('kg', 1, 1); const a = T.S().kg; T.stpApply('kg', 1, 5); return a === '82,1' && T.S().kg === '82,6'; });
tryc('przytrzymanie: obsługa wciśnięcia i puszczenia przycisku', () => /addEventListener\('pointerdown'/.test(code) && /addEventListener\('pointerup'/.test(code) && /addEventListener\('pointercancel'/.test(code));
tryc('przytrzymanie: po puszczeniu fokus wraca na ten sam przycisk', () => /data-stp="\$\{[^}]+\}"\]\[data-d="\$\{[^}]+\}"\]/.test(code) && /\.focus\(\{preventScroll:true\}\)/.test(code));
tryc('przytrzymanie: przyciski bez zaznaczania tekstu i z szybkim dotykiem', () => /\.stp\{[^}]*touch-action:manipulation/.test(sysCss) && /\.stp\{[^}]*user-select:none/.test(sysCss));
tryc('klawiatura: strzałka w górę w polu zwiększa wartość o krok', () => { view('set', BASE({ kg: '82' })); let pd = false; (lis.keydown || []).forEach((f) => f({ key: 'ArrowUp', target: { dataset: { k: 'kg' }, value: '82' }, preventDefault: () => { pd = true; } })); return pd && T.S().kg === '82,1'; });
tryc('podpowiedź: puste pole wagi dnia pokazuje ostatnie ważenie', () => /id="m_w"[^>]*|placeholder="80,4"/.test(view('day', BASE({ meas: { [dk(2)]: { w: '80,4' } } }))) && view('day', BASE({ meas: { [dk(2)]: { w: '80,4' } } })).includes('placeholder="80,4"'));
tryc('fokus niezasłonięty: przewijanie z marginesem na dolny pasek', () => /html\{[^}]*scroll-padding-bottom:/.test(sysCss));
tryc('komunikat dla czytnika: obszar aria-live na wartości pól', () => /id="sr"[^>]*aria-live="polite"|aria-live="polite"[^>]*id="sr"/.test(html));
tryc('błąd pod polem: komunikat powiązany z polem', () => /aria-describedby/.test(code) && /class="err"|className='err'/.test(code));
tryc('scenariusze: co najmniej 5, każdy z opisem, co sprawdzić', () => { const k = Object.keys(T.SCEN); return k.length >= 5 && k.every((n) => T.SCEN[n].t && T.SCEN[n].chk && T.SCEN[n].chk.length > 30); });
tryc('scenariusze: Pomoc ma przyciski do każdego scenariusza', () => { const h = view('help', BASE()); return Object.keys(T.SCEN).every((n) => h.includes(`data-scen="${n}"`)); });
tryc('scenariusz migrena: najpierw przeciwwskazanie, licznik dni z lekiem', () => { const h = view('health', T.scenS('migrena')); return firstAct(h).includes('przeciwwskazanie') && planOf(h).includes('10 dni z lekiem'); });
tryc('scenariusz minitabletka: bez przeciwwskazania, z kategoriami', () => { const h = view('health', T.scenS('minitabletka')); return !planOf(h).includes('przeciwwskazanie') && planOf(h).includes('UKMEC 2025'); });
tryc('scenariusz hashimoto: TSH i talia osobno', () => { const h = planOf(view('health', T.scenS('hashimoto'))); return h.includes('TSH 6-8 tygodni') && h.includes('osobno'); });
tryc('scenariusz wpisy: + przy wadze zaczyna od wczorajszego ważenia', () => { view('day', T.scenS('wpisy')); click({ stp: `meas.${dk(0)}.w`, d: '1' }); return T.S().meas[dk(0)].w === '80,4'; });
tryc('scenariusz start: pierwsze wejście', () => T.scenS('start').onb === false);

// Pytanie 06.11.2026: słodkie śniadania przy insulinooporności; oznaczenia przepisów liczone z reguł
const M = (id) => T.MEALS.find((m) => m.id === id), TG = (id) => T.mealTags(M(id), T.macros(M(id), 1, 1)).map((t) => t[0]);
tryc('oznaczenia: słodkie śniadania z bazy mają Słodkie', () => ['s1', 's3', 's5', 's6'].every((id) => TG(id).includes('Słodkie')) && !TG('s2').includes('Słodkie'));
tryc('oznaczenia: Przy IO z reguły 20 g białka i do 50 g węglowodanów', () => TG('s3').includes('Przy IO') && TG('s5').includes('Przy IO') && !TG('s6').includes('Przy IO') && !TG('s1').includes('Przy IO'));
tryc('oznaczenia: przekąska Przy IO do 20 g węglowodanów z białkiem albo tłuszczem', () => TG('p1').includes('Przy IO') && TG('p5').includes('Przy IO') && !TG('p6').includes('Przy IO'));
tryc('oznaczenia: każde danie z tagiem Przy IO spełnia regułę', () => T.MEALS.filter((m) => m.t).every((m) => { const x = T.macros(m, 1, 1), io = T.mealTags(m, x).some((t) => t[0] === 'Przy IO'); if (!io) return true; return m.t === 'przekaska' ? x.c <= 20 && (x.p >= 10 || x.f >= 8) : x.p >= 20 && x.c <= 50; }));
tryc('oznaczenia: 3 nowe słodkie śniadania Przy IO', () => ['s7', 's8', 's9'].every((id) => M(id) && M(id).t === 'sniadanie' && TG(id).includes('Słodkie') && TG(id).includes('Przy IO')));
tryc('oznaczenia: soja tylko przy Hashimoto w profilu', () => { T.S().prof = { cond: {}, pill: '' }; const a = TG('k5').some((t) => /Soja/.test(t)); T.S().prof = { cond: { hashi: true }, pill: '' }; const b = TG('k5').some((t) => /Soja/.test(t)); T.S().prof = { cond: {}, pill: '' }; return !a && b; });
tryc('oznaczenia: lista dań pokazuje znaczniki, filtr Słodkie i Przy IO', () => { const S = T.S(); view('meals', BASE()); S.f.type = 'sniadanie'; S.f.tags = { sw: true, io: true }; const L = T.filtered(); const h = view('meals', {}); S.f.tags = {}; S.f.type = 'obiad'; return L.length >= 5 && L.every((o) => TG(o.m.id).includes('Słodkie') && TG(o.m.id).includes('Przy IO')) && h.includes('id="oznaczenia"') && h.includes('data-ftag="io"') && els.mlist.innerHTML.includes('class="mtag"'); });
tryc('oznaczenia: przepis poza regułą przy IO podpowiada zmianę porcji', () => { T.S().recipe = 's6'; const h = view('recipe', BASE({ prof: { cond: { io: true }, pill: '' } })); return h.includes('×0,75') && h.includes('60 g węglowodanów'); });
tryc('oznaczenia: plan przy IO mówi, że słodkie śniadanie może zostać', () => planOf(view('health', BASE(PROF(['io'], '')))).includes('Słodkie śniadanie może zostać'));

tryc('przytrzymanie: 15 kroków w mniej niż 1,5 s, 30 kroków w mniej niż 2 s', () => { const tAt = (n) => { let t = T.HOLD_DELAY; for (let i = 1; i < n - 1; i++) t += T.holdGap(i); return t; }; return tAt(15) < 1500 && tAt(30) < 2000; });

// Zgłoszenie 06.11.2026: posiłki według całego profilu, łączenie schorzeń
const fitAll = (ids) => ids.every((id) => { const m = M(id); return T.ioFit(m, T.macros(m, 1, 1)); });
tryc('dla mnie: bez profilu plan tygodnia bez zmian', () => { view('meals', BASE()); return [0, 1, 2, 3, 4, 5, 6].every((d) => T.planFor(d).join() === T.PLAN[d].join()); });
tryc('dla mnie: przy IO każdy posiłek planu tygodnia spełnia regułę', () => { view('meals', BASE(PROF(['io'], ''))); return [0, 1, 2, 3, 4, 5, 6].every((d) => fitAll(T.planFor(d))); });
tryc('dla mnie: zamiany przy IO trzymają rytm obiadów i rodzaj posiłku', () => { view('meals', BASE(PROF(['io'], ''))); return [0, 1, 2, 3, 4, 5, 6].every((d) => T.planFor(d).every((id, i) => M(id).t === M(T.PLAN[d][i]).t) && T.planFor(d).map(M).filter((m) => m.t === 'obiad').every((m) => [0, 6].includes(d) ? m.min >= 25 : m.min <= 20)); });
tryc('dla mnie: plan dnia oznacza dania dopasowane do IO', () => { const h = view('meals', BASE(PROF(['io'], ''))); return T.planFor(new Date().getDay()).join() === T.PLAN[new Date().getDay()].join() || h.includes('dopasowane do IO'); });
tryc('dla mnie: własny wybór wygrywa z dopasowaniem', () => { view('recipe', BASE({ ...PROF(['io'], ''), swaps: {} })); click({ cook: 'o9' }); return T.planIds().includes('o9'); });
tryc('dla mnie: lista zakupów liczy dopasowany plan', () => { view('meals', BASE()); const a = T.shopLines().join(); view('meals', BASE(PROF(['io'], ''))); return T.shopLines().join() !== a; });
tryc('dla mnie: Posiłki mają przełącznik Dla mnie, przy IO włączony i filtrujący', () => { const S = T.S(); const h = view('meals', BASE(PROF(['io'], ''))); S.f.type = 'all'; const L = T.filtered(); S.f.type = 'obiad'; return h.includes('data-forme') && L.length > 10 && L.every((o) => T.ioFit(o.m, o.x)); });
tryc('dla mnie: wyłączenie pokazuje wszystkie dania', () => { const S = T.S(); view('meals', BASE(PROF(['io'], ''))); click({ forme: '1' }); S.f.type = 'all'; const n = T.filtered().length; S.f.type = 'obiad'; click({ forme: '1' }); return n >= 40; });
tryc('dla mnie: profil bez zasad dla jedzenia mówi to wprost', () => view('meals', BASE(PROF(['lip', 'mig'], ''))).includes('nie zmienia doboru dań'));
tryc('razem: IO i migrena bez postu przerywanego', () => planOf(view('health', BASE(PROF(['io', 'mig'], '')))).includes('Bez postu przerywanego'));
tryc('razem: IO i Hashimoto się nie wykluczają', () => planOf(view('health', BASE(PROF(['io', 'hashi'], '')))).includes('nie wykluczają'));
tryc('razem: zdanie bez źródła usunięte (obrzęk przy Hashimoto i lipodemii)', () => !planOf(view('health', BASE(PROF(['lip', 'hashi'], '')))).includes('Obrzęk przy niedoczynności'));
tryc('przerwa: karta przy migrenie po 12:00 bez posiłku, nie rano i nie po posiłku', () => { view('day', BASE(PROF(['mig'], ''))); const a = T.migGap(13), b = T.migGap(9); view('day', BASE({ ...PROF(['mig'], ''), days: { [dk(0)]: [{ kind: 'm', id: 's1', label: 'x', k: 400, p: 20, f: 10, c: 40 }] } })); const c = T.migGap(13); view('day', BASE(PROF([], ''))); return a && !b && !c && !T.migGap(13); });
tryc('przerwa: karta w Zdrowiu pokazuje tekst, nie kod', () => { const h = view('health', BASE(PROF(['mig', 'io'], ''))); return !T.migGap(new Date().getHours()) || (h.includes('Długa przerwa w jedzeniu') && h.includes('wyzwalaczy migreny') && !h.includes('=>')); });
tryc('karty: każde pole why i more da się pokazać jako tekst', () => { const h = view('health', BASE({ ...PROF(['mig', 'io'], ''), pain: { [dk(0)]: { aura: true } }, meas: { [dk(0)]: { cyc: 'P', sleep: '5' }, [dk(1)]: { sleep: '5' } } })); return !/=>|function\s*\(/.test(h); });
tryc('nowe obiady Przy IO: 3 dania, w tym 2 do 20 min', () => { const L = ['o19', 'o20', 'o21'].map(M); return L.every((m) => m && m.t === 'obiad' && T.ioFit(m, T.macros(m, 1, 1))) && L.filter((m) => m.min <= 20).length === 2; });
tryc('scenariusz połączenia: IO, migrena i Hashimoto', () => { const s = T.scenS('polaczenia'); return s.prof.cond.io && s.prof.cond.mig && s.prof.cond.hashi; });

// Polecenie 08.11.2026: Zamówione; chipy snu, „jak wczoraj” przy krokach
const ORDB = (o) => BASE({ ord: { dish: 'kurczak', sushi: 12, kurczak: 5, tofu: '1', alt: false, add: {}, ...o } });
tryc('zamówione: Posiłki mają sekcję z trzema daniami', () => { const h = view('meals', ORDB()); return h.includes('id="zamowione"') && ['sushi', 'kurczak', 'tofu'].every((d) => h.includes(`data-orddish="${d}"`)); });
tryc('zamówione: kurczak 5 kawałków z ryżem to 998 kcal (USDA)', () => { view('meals', ORDB({ add: { ryz: true } })); const c = T.ordCalc(); return Math.round(c.k) === 998 && Math.round(c.p) === 38; });
tryc('zamówione: sushi 16 maki to 448 kcal, nigiri 560 (USDA)', () => { view('meals', ORDB({ dish: 'sushi', sushi: 16 })); const a = T.ordCalc().k; view('meals', ORDB({ dish: 'sushi', sushi: 16, alt: true })); return Math.round(a) === 448 && Math.round(T.ordCalc().k) === 560; });
tryc('zamówione: tofu duża porcja ×1,3 (USDA)', () => { view('meals', ORDB({ dish: 'tofu', tofu: '1.3' })); return Math.round(T.ordCalc().k) === 419; });
tryc('zamówione: szacunek z przedziałem i białkiem', () => { const h = view('meals', ORDB()); return /ok\. 740 kcal \(518-962\)/.test(h) && h.includes('białko 33 g'); });
tryc('zamówione: zapis dodaje posiłek do dnia z etykietą', () => { view('meals', ORDB({ days: {} })); T.S().days = {}; click({ ordsave: '1' }); const e = lastE(); return e && e.kind === 'm' && e.ord === 1 && e.label.includes('Kurczak po koreańsku, 5 kawałków') && e.k === 740; });
tryc('zamówione: wybór zostaje zapamiętany', () => { view('meals', ORDB()); click({ orddish: 'sushi' }); click({ ordn: '16' }); return T.S().ord.dish === 'sushi' && T.S().ord.sushi === 16; });
tryc('zamówione: każde danie ma zdanie dietetyka', () => ['sushi', 'kurczak', 'tofu'].every((d) => /class="why"|class="small muted"/.test(view('meals', ORDB({ dish: d }))) && view('meals', ORDB({ dish: d })).includes('class="ordtip"')));
tryc('zamówione: szybki wpis prowadzi do Zamówione', () => view('day', BASE()).includes('data-nav="meals#zamowione"'));
tryc('zamówione: bez nazw lokali', () => !/chingu|kfc|sushi\s*master/i.test(code));
tryc('sen: chipy 6:00-8:00 ustawiają sen', () => { const k = `meas.${dk(0)}.sleep`, h = view('day', BASE()); if (!['6:00', '6:30', '7:00', '7:30', '8:00'].every((v) => h.includes(`data-setv="${k}" data-v="${v}"`))) return false; click({ setv: k, v: '7:30' }); return T.S().meas[dk(0)].sleep === '7:30'; });
tryc('sen: chip jak wczoraj z wczorajszą wartością', () => view('day', BASE({ meas: { [dk(1)]: { sleep: '6:13' } } })).includes('jak wczoraj (6 h 13 min)'));
tryc('kroki: chip jak wczoraj, gdy dziś pusto', () => { const k = `meas.${dk(0)}.steps`, h = view('day', BASE({ meas: { [dk(1)]: { steps: '8500' } } })); if (!h.includes(`data-setv="${k}" data-v="8500"`) || !/jak wczoraj \(8\s?500\)/.test(h)) return false; click({ setv: k, v: '8500' }); return T.S().meas[dk(0)].steps === '8500' && !view('day', {}).includes(`data-setv="${k}" data-v="8500"`); });
tryc('kroki: − i + co 1000', () => { const k = `meas.${dk(0)}.steps`; view('day', BASE({ meas: { [dk(0)]: { steps: '5000' } } })); click({ stp: k, d: '1' }); return T.S().meas[dk(0)].steps === '6000'; });

// Zasada 08.11.2026: dane z badań tylko ze sprawdzonych linków; każda treść zdrowotna ma źródło
const isUrl = (u) => /^https:\/\/[^\s"'<>]+$/.test(u);
tryc('źródła: każde źródło to link https z opisem', () => Object.values(T.SRC).every(([u, l]) => isUrl(u) && l && l.length > 3));
tryc('źródła: każde działanie planu ma link Źródło', () => { const h = planOf(view('health', BASE({ ...PROF(['hashi', 'lip', 'mig', 'io'], 'yaz'), pain: { [dk(1)]: { aura: true, med: true } } }))); const n = (h.match(/<div class="act/g) || []).length, s = (h.match(/class="srcl"/g) || []).length; return n >= 10 && n === s; });
tryc('źródła: każda karta ma źródło z listy', () => T.CARDS.every((c) => c.ref && [].concat(c.ref).every((k) => T.SRC[k])));
tryc('źródła: karta pokazuje link Źródło', () => /data-card="zla_noc"[\s\S]*?class="srcl"[\s\S]*?href="https:\/\/pubmed/.test(view('health', BASE({ meas: { [dk(0)]: { sleep: '5' }, [dk(1)]: { sleep: '5' } } }))));
tryc('źródła: każde danie i dodatek w Zamówione ma źródło z USDA', () => Object.values(T.ORD).every((d) => d.ref && T.SRC[d.ref] && /fdc\.nal\.usda\.gov/.test(T.SRC[d.ref][0])) && T.ORD_ADD.every((a) => T.SRC[a[4]]));
tryc('źródła: Zamówione pokazuje link do bazy USDA', () => /id="zamowione"[\s\S]*?href="https:\/\/fdc\.nal\.usda\.gov/.test(view('meals', ORDB())));
tryc('źródła: linki otwierają się w nowej karcie bez przekazywania odsyłacza', () => { const h = planOf(view('health', BASE(PROF(['io'], '')))); return /target="_blank" rel="noopener noreferrer"/.test(h); });
tryc('źródła: usunięte liczby bez źródła (1-2 kg, 3-5 godzin, 5 godzin, sen 7 godzin)', () => !/1-2 kg|1-2 tygodni|co 3-5 godzin|dłuższa niż 5 godzin|sen 7 godzin|ferrytynę/.test(code));
tryc('źródła: minitabletka bez słowa dopuszczalna, tempura usunięta', () => !/dopuszczalna przy aurze|tempura albo majonez/.test(code));
tryc('źródła: cel przy IO co najmniej 7% (DPP)', () => planOf(view('health', BASE(PROF(['io'], '')))).includes('co najmniej 7%'));
tryc('źródła: zakrzepica przy dezogestrelu 9-12, przy lewonorgestrelu 5-7', () => planOf(view('health', BASE(PROF([], 'novynette')))).includes('9-12 na 10 000') && planOf(view('health', BASE(PROF([], 'microgynon')))).includes('Ok. 5-7 na 10 000'));

// Rada 08.11.2026 (ścieżka krok po kroku): rozpoznanie przeszkód i ścieżka gotowania, jeden krok na tydzień
const ANS = { cook: '0', bar: 'skl', ord: '2', when: 'wiecz', why: 'zmecz' };
const EQ3 = { mikrofala: true, piekarnik: true, blender: true };
const KR = (o) => ({ ans: { ...ANS }, eq: { ...EQ3 }, done: true, conf: true, step: 0, since: T.mondayOf(new Date()), easy: false, jt: 0, zap: {}, ...o });
const mEnt = (id) => ({ kind: 'm', id, label: id, k: 300, p: 20, f: 10, c: 30 });
const wkKeys = (mk) => Array.from({ length: 7 }, (_, i) => { const d = new Date(mk + 'T12:00:00'); d.setDate(d.getDate() + i); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); });
tryc('krok: Mój dzień bez ścieżki zaprasza do rozpoznania', () => view('day', BASE({ krok: null })).includes('data-tab="krok"'));
tryc('krok: ekran ma tytuł Krok po kroku', () => { view('krok', BASE({ krok: null })); return els.title.textContent === 'Krok po kroku'; });
tryc('krok: rozpoznanie ma 5 pytań i pytanie o sprzęt (8 do wyboru)', () => { const h = view('krok', BASE({ krok: null })); return ['cook', 'bar', 'ord', 'when', 'why'].every((k) => h.includes(`data-kq="${k}:`)) && (h.match(/data-keq="/g) || []).length === 8 && h.includes('Frytkownica'); });
tryc('krok: odpowiedź jednym dotknięciem, wynik dopiero po 5 odpowiedziach', () => { view('krok', BASE({ krok: null })); ['cook:0', 'bar:skl', 'ord:2', 'when:wiecz'].forEach((x) => click({ kq: x })); click({ kres: '1' }); const a = !T.S().krok.done; click({ kq: 'why:zmecz' }); click({ kres: '1' }); return a && T.S().krok.done === true && T.S().krok.ans.bar === 'skl'; });
tryc('krok: sprzęt zaznaczany wielokrotnie', () => { view('krok', BASE({ krok: null })); click({ keq: 'mikrofala' }); click({ keq: 'blender' }); click({ keq: 'blender' }); const e = T.S().krok.eq; return e.mikrofala === true && !e.blender; });
tryc('krok: łańcuch z odpowiedzi jako przypuszczenie do potwierdzenia', () => { const h = view('krok', BASE({ krok: KR({ conf: false }) })); return h.includes('brak składników w domu → zamawianie 4 i więcej razy w tygodniu → jedzenie poza planem wieczorem ze zmęczenia') && h.includes('Czy to o Tobie?') && h.includes('data-kconf'); });
tryc('krok: dane z 14 dni uzupełniają odpowiedzi', () => { const h = view('krok', BASE({ krok: KR({ conf: false }), days: { [dk(1)]: [{ ...mEnt('zam_sushi'), ord: 1 }], [dk(3)]: [{ ...mEnt('zam_tofu'), ord: 1 }] }, urges: { [dk(2)]: [{ h: 21, trig: 'zmecz', out: 'minela' }] } })); return h.includes('zamówienia 2') && h.includes('ochoty 1') && h.includes('najczęściej: Zmęczenie'); });
tryc('krok: łańcuch bez słów oceniających', () => !/leniw|wina|porażk|musisz|powinna/i.test(view('krok', BASE({ krok: KR({ conf: false }) }))));
tryc('krok: Tak zaczyna krok 1, Mój dzień pokazuje Twój krok na ten tydzień', () => { view('krok', BASE({ krok: KR({ conf: false, step: undefined }) })); click({ kconf: '1' }); const k = T.S().krok, h = view('day'); return k.conf && k.step === 0 && h.includes('Twój krok na ten tydzień') && h.includes('Bez gotowania') && h.includes('0 z 3'); });
tryc('krok 1: posiłki bez gotowania do 10 minut, bez przekąsek i bez jajek z zapasu', () => { const m = T.krokMeals(0); return m.length >= 4 && m.some((x) => x.id === 'k2') && m.every((x) => x.min <= 10 && x.t !== 'przekaska' && !/°C|mikrofal|blender|na twardo|z zapasu/i.test(T.STEPS[x.id].join(' '))); });
tryc('krok 2: każda podstawa jest składnikiem dania z kroku 1', () => T.ZAP.length === 5 && T.ZAP.every(([id]) => T.krokMeals(1).some((m) => m.ing.some((x) => x[0] === id))));
tryc('krok 3: dania z mikrofali, bez przekąsek i dań, gdzie mikrofala tylko rozmraża', () => { const m = T.krokMeals(2); return m.length >= 4 && m.every((x) => x.t !== 'przekaska' && x.min >= 7) && !m.some((x) => ['s8', 's9', 'p1'].includes(x.id)); });
tryc('krok 4 i krok 5 nie mają wspólnych dań', () => { const a = new Set(T.krokMeals(4).map((m) => m.id)); return !T.krokMeals(3).some((m) => a.has(m.id)); });
tryc('krok: postęp z zapisanych dań z listy kroku', () => { const id = T.krokMeals(0)[0].id; view('day', BASE({ krok: KR(), days: { [dk(0)]: [mEnt(id), mEnt(id), mEnt('o1')] } })); return T.kProg(T.mondayOf(new Date())).n === 2 && mainHtml().includes('2 z 3'); });
tryc('krok: łatwiejsza wersja obniża próg kroku 1 do 1 dania', () => { view('day', BASE({ krok: KR({ easy: true }) })); return T.kProg(T.mondayOf(new Date())).cel === 1; });
tryc('krok 2: zapas: zaznaczenie „mam w domu” i postęp 5 podstaw', () => { view('krok', BASE({ krok: KR({ step: 1 }) })); click({ kzap: 'skyr' }); click({ kzap: 'chleb' }); const p = T.kProg(T.mondayOf(new Date())); return T.S().krok.zap.skyr === true && p.z === 2 && p.zt === 5 && mainHtml().includes('data-kzap="tunczyk"'); });
tryc('krok 4: sukces, gdy to samo danie z piekarnika jest zapisane 2 dni', () => { const mk = T.mondayOf(new Date()), ks = wkKeys(mk), id = T.krokMeals(3)[0].id; view('day', BASE({ krok: KR({ step: 3, since: mk }), days: { [ks[0]]: [mEnt(id)], [ks[1]]: [mEnt(id)] } })); const p = T.kProg(mk); return p.n === 2 && p.ok; });
tryc('krok 4: dania tylko z piekarnika, łatwiejsza wersja do 20 minut', () => { const a = T.krokMeals(3), e = T.krokMeals(3, true); view('day', BASE({ krok: KR({ step: 3 }) })); return a.length > 0 && a.every((m) => /°C/.test(T.STEPS[m.id].join(' '))) && e.length > 0 && e.every((m) => m.min <= 20); });
tryc('krok 5: dania na zapas', () => T.krokMeals(4).length > 0 && T.krokMeals(4).every((m) => m.prep));
tryc('krok: brak mikrofali pomija krok 3', () => { view('krok', BASE({ krok: KR({ step: 1, eq: { piekarnik: true } }) })); const n = T.krokMeals(2).length; click({ kroknext: '1' }); return n === 0 && T.S().krok.step === 3; });
tryc('krok: bez zaznaczonego sprzętu wszystkie dania', () => { view('krok', BASE({ krok: KR({ eq: {} }) })); return T.krokMeals(2).length > 0 && T.krokMeals(3).length > 0; });
tryc('krok: plan „jeśli…, to…” jednym dotknięciem', () => { view('krok', BASE({ krok: KR() })); click({ kjt: '1' }); return T.S().krok.jt === 1 && /aria-pressed="true"[^>]*>Jeśli rano/.test(mainHtml()); });
tryc('krok: ekran kroku: co zrobić, dania, gdy się nie uda, źródła', () => { const h = view('krok', BASE({ krok: KR() })); return h.includes('Gdy się nie uda') && h.includes('data-recipe="') && h.includes('class="srcl"') && h.includes('pubmed.ncbi.nlm.nih.gov/26479070'); });
tryc('krok: przepis z kroku wraca do kroku', () => { view('krok', BASE({ krok: KR() })); click({ recipe: T.krokMeals(0)[0].id }); return T.S().recipeBack === 'krok'; });
const RK = () => T.reviewKey();
tryc('przegląd: krok zastępuje pole „Jedna zmiana”, własna zmiana jako opcja', () => { const a = view('review', BASE({ krok: KR({ since: '2026-01-05' }) })), b = view('review', BASE({ krok: null })); return /<details[\s\S]*Własna zmiana[\s\S]*id="r_c"/.test(a) && a.includes('Twój krok') && !/<details[\s\S]*id="r_c"/.test(b) && b.includes('Jedna zmiana na przyszły tydzień'); });
tryc('przegląd: krok niewykonany: powtórz, łatwiejsza wersja, inna przeszkoda', () => { const h = view('review', BASE({ krok: KR({ since: '2026-01-05' }) })); return h.includes('data-krokrep') && h.includes('data-krokeasy') && h.includes('data-krokdiag') && !h.includes('data-kroknext'); });
tryc('przegląd: krok wykonany: następny krok', () => { const ks = wkKeys(RK()), ids = T.krokMeals(0).map((m) => m.id); const h = view('review', BASE({ krok: KR({ since: '2026-01-05' }), days: { [ks[0]]: [mEnt(ids[0])], [ks[2]]: [mEnt(ids[1])], [ks[4]]: [mEnt(ids[0])] } })); click({ kroknext: '1' }); return h.includes('data-kroknext') && T.S().krok.step === 1 && T.S().krok.since === T.todayKey(); });
tryc('przegląd: łatwiejsza wersja i powtórka zaczynają krok od tego tygodnia', () => { view('review', BASE({ krok: KR({ since: '2026-01-05' }) })); click({ krokeasy: '1' }); const k = T.S().krok; return k.easy && k.step === 0 && k.since === T.todayKey(); });
tryc('krok: inna przeszkoda wraca do pytań z zachowanymi odpowiedziami', () => { view('review', BASE({ krok: KR({ since: '2026-01-05' }) })); click({ krokdiag: '1' }); const k = T.S().krok; return !k.done && !k.conf && k.ans.bar === 'skl' && T.S().tab === 'krok'; });
tryc('krok: po kroku 5 ścieżka ukończona', () => { view('krok', BASE({ krok: KR({ step: 4 }) })); click({ kroknext: '1' }); return T.S().krok.fin === true && view('day').includes('Ścieżka gotowania ukończona'); });
tryc('krok: scenariusz pokazowy #demo-sciezka', () => { const s = T.scenS('sciezka'); return s.tab === 'krok' && s.krok && s.krok.conf && T.SCEN.sciezka.chk.length > 20; });
tryc('krok: napisy na przyciskach najwyżej 28 znaków na każdym etapie', () => { const long = []; for (const k of [null, KR({ done: false, conf: false }), KR({ conf: false }), KR(), KR({ step: 1 }), KR({ step: 3 }), KR({ fin: true })]) for (const t of ['krok', 'day', 'review']) for (const m of view(t, BASE({ krok: k && { ...k, since: '2026-01-05' } })).matchAll(/<button class="btn[^"]*"[^>]*>([^<]*)<\/button>/g)) if (m[1].trim().length > 28) long.push(m[1]); if (long.length) throw new Error(long.join(' | ')); return true; });
tryc('krok: długie opcje planu zawijają się (klasa opt, styl w app.css)', () => { const h = view('krok', BASE({ krok: KR() })); return (h.match(/class="chip opt[^"]*" data-kjt/g) || []).length === 2 && /\.chip\.opt\{[^}]*white-space:normal/.test(fs.readFileSync(path.join(root, 'app.css'), 'utf8')); });
tryc('krok: dania zapisane przed startem kroku nie liczą się do nowego kroku', () => { const id = T.krokMeals(0)[0].id; view('krok', BASE({ krok: KR(), days: { [dk(0)]: [mEnt(id), mEnt(id), mEnt(id)] } })); click({ kroknext: '1' }); const a = T.kProg(T.mondayOf(new Date())).n; T.S().days[dk(0)].push(mEnt(id)); return T.S().krok.step === 1 && a === 0 && T.kProg(T.mondayOf(new Date())).n === 1; });
tryc('przegląd: krok zaczęty w ostatnich 3 dniach tygodnia nie jest oceniany', () => { const ks = wkKeys(RK()), h = view('review', BASE({ krok: KR({ since: ks[4] }) })); return h.includes('oceni go następny przegląd') && !h.includes('data-krokrep') && !h.includes('data-kroknext'); });
tryc('krok: ponowne rozpoznanie zachowuje bieżący krok', () => { view('krok', BASE({ krok: KR({ step: 2 }) })); click({ kdiag: '1' }); click({ kres: '1' }); click({ kconf: '1' }); return T.S().krok.step === 2 && T.S().krok.conf; });
tryc('krok: bez mikrofali po ponownym rozpoznaniu krok 3 przechodzi do następnego dostępnego', () => { view('krok', BASE({ krok: KR({ step: 2, conf: false, eq: { piekarnik: true } }) })); click({ kconf: '1' }); return T.S().krok.step === 3; });
tryc('krok: po ukończonej ścieżce rozpoznanie zaczyna od kroku 1', () => { view('krok', BASE({ krok: KR({ step: 4, fin: true }) })); click({ kdiag: '1' }); click({ kres: '1' }); click({ kconf: '1' }); const k = T.S().krok; return k.step === 0 && !k.fin; });
tryc('krok: nowy krok bez z góry wybranego planu „jeśli…, to…”', () => { view('krok', BASE({ krok: KR({ jt: 1 }) })); click({ kroknext: '1' }); return T.S().krok.jt === null; });
tryc('Mój dzień: rozpoczęte rozpoznanie ma przycisk Dokończ', () => view('day', BASE({ krok: { ans: { cook: '0' }, eq: {}, done: false, conf: false, zap: {} } })).includes('Dokończ rozpoznanie'));
tryc('Mój dzień: wybrany plan „jeśli…, to…” przypomniany przy kroku', () => view('day', BASE({ krok: KR({ jt: 1 }) })).includes('Jeśli rano') && !view('day', BASE({ krok: KR({ jt: null }) })).includes('Jeśli rano'));
tryc('Mój dzień: własna zmiana widoczna obok kroku', () => view('day', BASE({ krok: KR(), reviews: { [T.mondayOf(new Date())]: { a: '', b: '', c: 'herbata o 15', d: dk(0) } } })).includes('herbata o 15'));
tryc('Pomoc: Krok po kroku i objaśnienie planu „jeśli…, to…” ze źródłem', () => { const h = view('help', BASE()); return h.includes('data-tab="krok"') && h.includes('Plan „jeśli…, to…”'); });
tryc('krok: wskazówka przy pierwszym wejściu', () => view('krok', BASE({ krok: null, tips: {} })).includes('data-tipok="krok"'));
// Rada 09.11.2026 (pierwsze uruchomienie): wyszukiwanie w Pomocy i puste stany
tryc('Pomoc: pole Szukaj w Pomocy z etykietą', () => { const h = view('help', BASE({ helpQ: '' })); return /<label for="help_q"[^>]*>Szukaj w Pomocy<\/label>/.test(h) && h.includes('id="help_q"') && h.includes('id="helpres"'); });
tryc('Pomoc: szukanie bez polskich znaków („bialko” znajduje Białko za złotówkę)', () => { const h = view('help', BASE({ helpQ: 'bialko' })); return h.includes('Białko za złotówkę') && !h.includes('Zapisać zjedzony posiłek'); });
tryc('Pomoc: szukanie po kilku słowach i w opisach', () => { const h = T.helpRes('zjem posiłek'); return h.includes('Zapisać zjedzony posiłek') && !h.includes('Białko za złotówkę'); });
tryc('Pomoc: brak wyników: komunikat i najczęstsze zadania', () => { const h = T.helpRes('xyzqw'); return h.includes('Nic nie znaleziono') && (h.match(/data-(nav|tab)=/g) || []).length === 3; });
tryc('przegląd tygodnia bez wpisów: podpowiedź i przycisk do Mojego dnia', () => { const h = view('review', BASE()); return h.includes('Pierwszy przegląd ma sens po tygodniu wpisów') && h.includes('data-tab="day"'); });
tryc('przegląd tygodnia z wpisami: bez podpowiedzi pustego tygodnia', () => { const ks = wkKeys(RK()); return !view('review', BASE({ meas: { [ks[1]]: { w: '80' } } })).includes('Pierwszy przegląd ma sens'); });
tryc('Zwierzak bez wyboru: wybór na miejscu zamiast przeniesienia do Ustawień', () => { const h = view('pet', BASE({ pet: null })); return T.S().tab === 'pet' && h.includes('Wybierz towarzysza') && h.includes('data-petprev'); });
tryc('Pierwsze kroki: Wybierz towarzysza prowadzi do ekranu zwierzaka', () => T.guideSteps().find((x) => x.id === 'pet').arg === 'pet');
// Rada 09.11.2026 (A+1, punkty 2 i 3): jajko pęka z Pierwszymi krokami, zwierzak mówi jedno zdanie w przeglądzie tygodnia
const GD = (o) => ({ guide: { hidden: false, dataOk: false, seenPet: false, ...o } });
const petCard = (h) => { const m = h.match(/<button class="petcard"[\s\S]*?<\/button>/); return m ? m[0] : ''; };
const cracks = (h) => (petCard(h).match(/class="crack"/g) || []).length;
tryc('jajko bez zwierzaka: bez pierwszych kroków 0 pęknięć i 0 z 4', () => { const h = view('day', BASE({ pet: null, ...GD() })); return cracks(h) === 0 && petCard(h).includes('0 z 4'); });
tryc('jajko bez zwierzaka: dane i waga to 2 pęknięcia', () => { const h = view('day', BASE({ pet: null, ...GD({ dataOk: true }), meas: { [dk(0)]: { w: '80' } } })); return cracks(h) === 2 && petCard(h).includes('pęknięcia 2 z 4'); });
tryc('jajko bez zwierzaka: 4 z 4 gotowe do wyklucia', () => { const h = view('day', BASE({ pet: null, ...GD({ dataOk: true }), meas: { [dk(0)]: { w: '80', steps: '5000' } }, days: { [dk(0)]: [mEnt('s3')] } })); return cracks(h) === 4 && petCard(h).includes('gotowe do wyklucia'); });
tryc('jajko wybranego zwierzaka też pęka z pierwszymi krokami', () => { const h = view('day', BASE(GD({ dataOk: true }))); return petCard(h).includes('pęknięcia 1 z 4') && cracks(h) === 1; });
tryc('jajko: bez liczby pęknięć rysunek jak dotąd (1 pęknięcie)', () => (T.PET.svg('gaska', 'egg', 'ok', null).match(/class="crack"/g) || []).length === 1);
tryc('karta wyboru towarzysza prowadzi do ekranu zwierzaka', () => { view('day', BASE({ pet: null })); click({ petpick: '1' }); return T.S().tab === 'pet'; });
const revDays = (n) => { const ks = wkKeys(RK()); return Object.fromEntries(ks.slice(0, n).map((k) => [k, [mEnt('s3')]])); };
tryc('przegląd: zwierzak mówi jedno zdanie z liczbą dni z wpisami', () => { const h = view('review', BASE({ days: revDays(3) })); return h.includes('<b>A:</b>') && h.includes('3 dni z wpisami') && h.includes('class="petsay"'); });
tryc('przegląd: zdanie zwierzaka bez wpisów i przy pełnym tygodniu', () => view('review', BASE()).includes('Jestem tu') && view('review', BASE({ days: revDays(7) })).includes('Wszystkie 7 dni'));
tryc('przegląd: zdanie zwierzaka bez wstydu i kar', () => [0, 1, 4, 7].every((n) => { const m = view('review', BASE({ days: revDays(n) })).match(/class="petsay"[\s\S]*?<\/div>/); return m && !/szkoda|zawiod|smut|wstyd|niestety|tylko \d/i.test(m[0]); }));
tryc('przegląd: bez zwierzaka bez zdania', () => !view('review', BASE({ pet: null, days: revDays(3) })).includes('class="petsay"'));
// Rada 09.11.2026 (wartości startowe): punkt startowy zależny od płci, cel 5% mniej (NHLBI), wartości startowe nie są potwierdzonymi danymi
const NEWD = (o) => ({ onb: false, introStep: 0, touched: {}, sex: 'K', ...o });
tryc('start: kobieta: 165 cm, 35 lat, 70 kg, cel 66,5 kg', () => { view('intro', NEWD()); const S = T.S(); return T.num(S.cm) === 165 && T.num(S.age) === 35 && T.num(S.kg) === 70 && T.num(S.goal) === 66.5; });
tryc('start: mężczyzna: 178 cm, 35 lat, 85 kg, cel 81 kg', () => { view('intro', NEWD({ sex: 'M' })); const S = T.S(); return T.num(S.cm) === 178 && T.num(S.age) === 35 && T.num(S.kg) === 85 && T.num(S.goal) === 81; });
tryc('start: zmiana płci zmienia tylko nieustawione wartości', () => { view('intro', NEWD({ cm: '160', touched: { cm: true } })); click({ sex: 'M' }); const S = T.S(); return T.num(S.cm) === 160 && T.num(S.kg) === 85; });
tryc('start: cel idzie za wagą, dopóki nie ustawisz celu', () => { view('intro', NEWD({ kg: '90', touched: { kg: true } })); const a = T.num(T.S().goal); view('intro', NEWD({ kg: '90', goal: '80', touched: { kg: true, goal: true } })); return a === 85.5 && T.num(T.S().goal) === 80; });
tryc('start: przy nieustawionej wartości podpis „wartość startowa”', () => { const h = view('intro', NEWD()); const k = view('intro', NEWD({ touched: { kg: true, cm: true, age: true, goal: true } })); return (h.match(/wartość startowa/g) || []).length === 4 && !k.includes('wartość startowa'); });
tryc('start: + i - ustawiają wartość jako Twoją', () => { view('intro', NEWD()); T.stpApply('kg', 1, 1); return T.S().touched.kg === true && !T.S().touched.cm; });
tryc('start: cel startowy ze źródłem NHLBI (5-10% w ok. 6 miesięcy)', () => { const h = view('intro', NEWD()); return h.includes('nhlbi.nih.gov') && h.includes('5% mniej'); });
tryc('start: Zaczynam z wartościami startowymi nie zalicza danych i prowadzi do Ustawień', () => { view('intro', NEWD({ guide: { hidden: false, dataOk: false, seenPet: false } })); click({ introdone: 'ok' }); const t = els.toast.innerHTML; return !T.S().guide.dataOk && t.includes('wartościach startowych') && t.includes('data-tab="set"'); });
tryc('start: Zapisz i sprawdź w Ustawieniach potwierdza wartości', () => { view('set', { ...NEWD(), onb: true, guide: { hidden: false, dataOk: false, seenPet: false } }); click({ datasave: '1' }); const t = T.S().touched; return t.kg && t.cm && t.age && t.goal && T.S().guide.dataOk; });
tryc('start: zapisane wcześniej dane bez znacznika traktowane jako ustawione', () => { const o = T.fixTouched({ kg: '90', cm: '180' }); return o.touched.kg && o.touched.goal; });
// Rada 09.11.2026 (formy wprowadzania a WCAG 2.2): wartość suwaka z jednostką, Page Up/Down, gotowe wartości celu i kalorii
const TA4 = { kg: true, cm: true, age: true, goal: true };
tryc('suwaki filtrów: aria-valuetext z jednostką (WCAG 4.1.2)', () => { const h = view('meals', BASE({ f: { ...T.S().f, minP: 30, maxK: 1000, maxC: 50, portion: 1.2 } })); return h.includes('aria-valuetext="co najmniej 30 g białka"') && h.includes('aria-valuetext="kalorie bez limitu"') && h.includes('aria-valuetext="najwyżej 50 g węglowodanów"') && h.includes('aria-valuetext="porcja 1,2 ×"'); });
tryc('suwaki filtrów: przesunięcie aktualizuje aria-valuetext', () => { view('meals', BASE()); const el = { dataset: { r: 'minP' }, value: '40', attrs: {}, setAttribute(k, v) { this.attrs[k] = v; }, getAttribute() { return null; } }; (lis.input || []).forEach((f) => f({ target: el })); return el.attrs['aria-valuetext'] === 'co najmniej 40 g białka'; });
const key = (k, kk) => { const el = { dataset: { k: kk }, value: '' }; let p = false; (lis.keydown || []).forEach((f) => f({ key: k, target: el, preventDefault() { p = true; } })); return p; };
tryc('pola + i -: Page Up i Page Down zmieniają o 10 kroków (APG spinbutton)', () => { view('set', BASE({ kg: '80', touched: { ...TA4 } })); key('PageUp', 'kg'); const a = T.num(T.S().kg); key('PageDown', 'kg'); key('PageDown', 'kg'); return a === 81 && T.num(T.S().kg) === 79; });
tryc('waga docelowa: przyciski 5, 7 i 10% mniej ze źródłami', () => { const h = view('set', BASE({ kg: '80', mode: 'redukcja', touched: { ...TA4 } })); return ['5', '7', '10'].every((x) => h.includes(`data-goalpct="${x}"`)) && h.includes('nhlbi.nih.gov') && h.includes('pubmed.ncbi.nlm.nih.gov/11832527'); });
tryc('waga docelowa: przycisk 10% mniej ustawia cel zaokrąglony do 0,5 kg i oznacza jako ustawiony', () => { view('set', BASE({ kg: '83', mode: 'redukcja', touched: { kg: true, cm: true, age: true } })); click({ goalpct: '10' }); return T.num(T.S().goal) === 74.5 && T.S().touched.goal === true && /aria-pressed="true"[^>]*>10% mniej/.test(mainHtml()); });
tryc('waga docelowa: w utrzymaniu bez przycisków procentowych', () => !view('set', BASE({ mode: 'utrzymanie', touched: { ...TA4 } })).includes('data-goalpct'));
tryc('szybki wpis: przyciski 100, 200, 300, 500 kcal wypełniają pole', () => { const h = view('day', BASE()); click({ kcalset: 'q_k:300' }); return ['100', '200', '300', '500'].every((x) => h.includes(`data-kcalset="q_k:${x}"`)) && els.q_k.value === '300'; });
tryc('ochota, coś innego: przyciski kcal wypełniają pole', () => { const h = view('sos', BASE({ sosStep: 'inne' })); click({ kcalset: 's_k:200' }); return h.includes('data-kcalset="s_k:500"') && els.s_k.value === '200'; });
// Rada 09.11.2026 (cel z BMI i składu ciała): trzy drogi celu, progi BMI z regionu, talia do wzrostu, przełącznik mięśni
const GB = (o) => BASE({ mode: 'redukcja', kg: '90', cm: '170', age: '40', sex: 'K', touched: { ...TA4 }, goalWay: 'proc', muscle: false, bmiCut: 'auto', ...o });
tryc('cel: trzy drogi do wyboru nad wagą docelową', () => { const h = view('set', GB()); return ['proc', 'bmi', 'talia'].every((x) => h.includes(`data-goalway="${x}"`)); });
tryc('cel BMI: 170 cm i BMI 24,9 to 72 kg; najniższa śmiertelność dla wieku 40 to BMI 22 (63,5 kg)', () => { const h = view('set', GB({ goalWay: 'bmi' })); click({ goalbmi: '24.9' }); const a = T.num(T.S().goal); view('set', GB({ goalWay: 'bmi' })); click({ goalbmi: '22' }); return h.includes('data-goalbmi="24.9"') && h.includes('data-goalbmi="22"') && a === 72 && T.num(T.S().goal) === 63.5 && T.S().touched.goal; });
tryc('cel BMI: wiek 60 to BMI 23, poniżej 35 bez wartości dla wieku', () => view('set', GB({ goalWay: 'bmi', age: '60' })).includes('data-goalbmi="23"') && !view('set', GB({ goalWay: 'bmi', age: '28' })).includes('data-goalbmi="22"'));
tryc('cel BMI: bez celów poniżej BMI 20 i ze źródłem (Lancet 2016)', () => { const h = view('set', GB({ goalWay: 'bmi' })); const v = [...h.matchAll(/data-goalbmi="([0-9.]+)"/g)].map((m) => +m[1]); return v.length && v.every((x) => x >= 20) && h.includes('PMC4995441'); });
tryc('cel BMI: progi NHS (23) dają cel poniżej 23', () => view('set', GB({ goalWay: 'bmi', bmiCut: 'nhs' })).includes('data-goalbmi="22.9"'));
tryc('progi BMI: automatycznie z regionu telefonu (pl-PL: WHO, zh-CN: NHS)', () => T.bmiCutFor('pl-PL') === 'who' && T.bmiCutFor('zh-CN') === 'nhs' && T.bmiCutFor('en-IN') === 'nhs' && T.bmiCutFor('en-GB') === 'who' && T.bmiCutFor('') === 'who');
tryc('cel talia: cel to połowa wzrostu, z ostatnim pomiarem i źródłem NHS', () => { const h = view('set', GB({ goalWay: 'talia', meas: { [dk(3)]: { waist: '92' } } })); return h.includes('poniżej 85 cm') && h.includes('0,54') && h.includes('nhs.uk/conditions/obesity'); });
tryc('wskaźniki: BMI z kategorią według progów i talia do wzrostu', () => { const a = view('set', GB({ meas: { [dk(1)]: { waist: '80' } } })); const b = view('set', GB({ kg: '68', bmiCut: 'nhs' })); return a.includes('BMI 31,1: otyłość') && a.includes('talia do wzrostu 0,47') && b.includes('BMI 23,5: nadwaga'); });
tryc('mam dużo mięśni: włącza drogę talii i zdanie NHS o BMI', () => { view('set', GB()); const el = { dataset: { k: 'muscle' }, type: 'checkbox', checked: true, value: '', getAttribute() { return null; }, setAttribute() {}, classList: { toggle() {} } }; (lis.input || []).forEach((f) => f({ target: el })); const h = view('set'); return T.S().muscle === true && T.S().goalWay === 'talia' && h.includes('nie odróżnia mięśni od tłuszczu'); });
tryc('dane: cel poniżej BMI 20 daje ostrzeżenie o dolnej części normy', () => { view('set', { ...GB(), goal: '56' }); click({ datasave: '1' }); return mainHtml().includes('poniżej 20'); });
tryc('wskaźniki: FFMI z wagi BIA z medianą odniesienia (Schutz 2002) i tłuszcz bez zakresu (Gallagher 2000)', () => { const h = view('set', GB({ sex: 'M', meas: { [dk(2)]: { ffm: '65', fat: '18' } } })); return h.includes('FFMI 22,5') && h.includes('18,9') && h.includes('pubmed.ncbi.nlm.nih.gov/12080449') && h.includes('pubmed.ncbi.nlm.nih.gov/10966886') && h.includes('uznanych zakresów'); });
tryc('wskaźniki: bez pomiaru BIA bez FFMI', () => !view('set', GB()).includes('FFMI'));
// Rada 09.11.2026 (integracja z Apple Zdrowie): dane ze Skrótu w adresie po „#” albo w schowku, zapis dopiero po potwierdzeniu
tryc('import: adres w=80,1&kroki=8000&sen=7:15', () => { const r = T.parseImport('w=80,1&kroki=8000&sen=7:15'); return r.date === dk(0) && T.num(r.vals.w) === 80.1 && T.num(r.vals.steps) === 8000 && T.num(r.vals.sleep) === 7.25 && !r.bad.length; });
tryc('import: kropka i zakodowane spacje (10%20000)', () => { const r = T.parseImport('w=80.1&kroki=10%20000'); return T.num(r.vals.w) === 80.1 && T.num(r.vals.steps) === 10000; });
tryc('import: wartości spoza zakresu odrzucone, nieznane pola pominięte', () => { const r = T.parseImport('w=800&kroki=abc&x=1'); return !Object.keys(r.vals).length && r.bad.length === 2; });
tryc('import: data z adresu, zła data to dziś, przyszła odrzucona', () => T.parseImport('w=70&data=' + dk(1)).date === dk(1) && T.parseImport('w=70&data=jutro').date === dk(0) && T.parseImport('w=70&data=2999-01-01').date === dk(0));
tryc('import: tekst ze schowka w liniach', () => { const r = T.parseImport('Miara\nwaga=80,1\nkroki=8000'); return T.num(r.vals.w) === 80.1 && T.num(r.vals.steps) === 8000; });
tryc('import: adres #import otwiera ekran potwierdzenia bez zapisu', () => { view('day', BASE({ meas: {} })); T.impFromHash('#import?w=80,1&kroki=8000'); T.render(); const h = mainHtml(); return T.S().tab === 'import' && h.includes('Zapisać?') && h.includes('data-impsave') && !(T.S().meas[dk(0)] || {}).w; });
tryc('import: Zapisz wpisuje pomiary dnia i czyści dane importu', () => { view('day', BASE({ meas: {} })); T.impFromHash('#import?w=80,1&kroki=8000&sen=7:15'); T.render(); click({ impsave: '1' }); const m = T.S().meas[dk(0)] || {}; return T.num(m.w) === 80.1 && T.num(m.steps) === 8000 && T.num(m.sleep) === 7.25 && !T.S().imp && T.S().tab === 'day'; });
tryc('import: Pomiń niczego nie zapisuje', () => { view('day', BASE({ meas: {} })); T.impFromHash('#import?w=80,1'); T.render(); click({ impskip: '1' }); return !(T.S().meas[dk(0)] || {}).w && !T.S().imp; });
tryc('import: pokazuje obecną wartość, gdy dzień ma już wpis', () => { view('day', BASE({ meas: { [dk(0)]: { w: '79' } } })); T.impFromHash('#import?w=80,1'); T.render(); return mainHtml().includes('obecnie 79'); });
tryc('import: inny adres niż #import nic nie robi', () => { view('day', BASE()); return T.impFromHash('#demo-start') === false && T.impFromHash('') === false; });
tryc('import: dane importu nie trafiają do kopii', () => /const BK_SKIP=\[[^\]]*'imp'/.test(code));
tryc('Pomoc: instrukcja Skrótu z adresem #import', () => { const h = view('help', BASE({ helpQ: '' })); return h.includes('id="skrot"') && h.includes('#import?w='); });
tryc('Pomiary dnia: przycisk Wklej ze Skrótu', () => view('day', BASE()).includes('data-imppaste'));
// Rada 09.11.2026 (pole po dotknięciu): zaznaczenie całej wartości przy wejściu w pole liczbowe, bez czyszczenia
const inp = (id, k, v, im) => ({ id, dataset: k ? { k } : {}, value: v, sel: null, classList: { contains: () => false, toggle() {}, add() {}, remove() {} }, setAttribute() {}, getAttribute: (a) => (a === 'inputmode' ? im : null), setSelectionRange(a, b) { this.sel = [a, b]; } });
const fire = (t, el) => (lis[t] || []).forEach((f) => f({ target: el }));
const tick = () => new Promise((r) => setTimeout(r, 20));
tryAsync('pole: wejście w pole liczbowe zaznacza całą wartość i jej nie czyści', async () => { view('set', BASE({ touched: { ...TA4 } })); const el = inp('f_kg', 'kg', '80,1', 'decimal'); fire('focusout', inp('x', '', '', null)); fire('focusin', el); await tick(); return el.sel && el.sel[0] === 0 && el.sel[1] === 4 && el.value === '80,1'; });
tryAsync('pole: odtworzenie pola po znaku nie zaznacza ponownie', async () => { const a = inp('f_cm', 'cm', '170', 'numeric'); fire('focusin', a); await tick(); const b = inp('f_cm', 'cm', '1705', 'numeric'); fire('focusin', b); await tick(); return a.sel && b.sel === null; });
tryAsync('pole: po wyjściu z pola i powrocie zaznacza znowu', async () => { const a = inp('f_age', 'age', '35', 'numeric'); fire('focusin', a); await tick(); fire('focusout', a); const b = inp('f_age', 'age', '35', 'numeric'); fire('focusin', b); await tick(); return b.sel && b.sel[1] === 2; });
tryAsync('pole: zwykłe pole tekstowe bez zaznaczania', async () => { const a = inp('q_n', '', 'kawa', null); fire('focusin', a); await tick(); return a.sel === null; });
tryAsync('pole: sen (godziny i minuty) też zaznacza', async () => { const a = { ...inp('m_sleep', '', '7', 'numeric'), dataset: { sl: '1', day: dk(0) } }; fire('focusin', a); await tick(); return a.sel && a.sel[1] === 1; });
tryc('Pomoc: instrukcja Skrótu najpierw przez schowek dla Miary z ekranu początkowego', () => { const h = view('help', BASE({ helpQ: '' })); const i = h.indexOf('id="skrot"'), c = h.indexOf('Kopiuj do schowka', i), u = h.indexOf('#import?w=', i); return i > 0 && c > i && u > c && h.includes('Pokaż powiadomienie') && h.includes('ekranie głównym'); });
// Na ekran główny: kroki z pomocy Apple (Podręcznik iPhone'a, Safari) i Google (Chrome na Androidzie), otwarte 10.11.2026
const UA = (ua, app) => { sandbox.navigator.userAgent = ua; sandbox.navigator.standalone = !!app; };
const IOS = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15', AND = 'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 Chrome/140.0 Mobile Safari/537.36';
const ekran = (h) => { const i = h.indexOf('id="ekran"'); return i < 0 ? '' : h.slice(i, h.indexOf('<h2', i + 10) > 0 ? h.indexOf('<h2', i + 10) : undefined); };
tryc('ekran główny: Ustawienia mają kroki dla iPhone’a i Androida z nazwami Apple i Google oraz źródłami', () => {
  UA(IOS); const h = ekran(view('set', BASE())); UA('');
  return ['Do ekranu głównego', 'Udostępnij', 'Otwórz jako aplikację www', 'Edytuj czynności', 'Dodaj', 'Zainstaluj i utwórz skrót', 'Więcej', 'support.apple.com', 'support.google.com'].every((x) => h.includes(x)) && !view('set', BASE()).includes('Dodaj do ekranu początkowego');
});
tryc('ekran główny: kolejność według telefonu (iPhone najpierw iPhone, Android najpierw Android)', () => {
  UA(IOS); const a = ekran(view('set', BASE())); UA(AND); const b = ekran(view('set', BASE())); UA('');
  return a.indexOf('iPhone') < a.indexOf('Android') && b.indexOf('Android') < b.indexOf('iPhone');
});
tryc('ekran główny: Miara otwarta z ikony nie pokazuje kroków, tylko potwierdzenie', () => { UA(IOS, true); const h = ekran(view('set', BASE())); UA(''); return h.includes('Miara jest na ekranie głównym') && !h.includes('Do ekranu głównego'); });
tryc('ekran główny: wprowadzenie pokazuje kroki w przeglądarce, a z ikony nie', () => {
  UA(IOS); view('intro', { introStep: 0, onb: false }); const a = els.main.innerHTML; UA(IOS, true); view('intro', { introStep: 0, onb: false }); const b = els.main.innerHTML; UA('');
  return a.includes('Do ekranu głównego') && !b.includes('Do ekranu głównego');
});
tryc('ekran główny: Pomoc znajduje instrukcję po słowie „ekran”', () => view('help', BASE({ helpQ: 'ekran główny' })).includes('set#ekran'));
tryc('źródła: ścieżka ma linki do badań zachowania', () => ['michie', 'lally', 'harkin', 'gollw', 'wolfson', 'reicks'].every((k) => T.SRC[k]));

// Etap 1: „Co się wydarzyło” i jeden cel aktywny (zdarzenia.js, docs/specs/2026-11-10-etap1-zdarzenia-i-cel-design.md).
// Moduł liczy z podanego stanu i dnia, więc testy używają stałej daty D0.
const Z = () => sandbox.ZD;
const D0 = '2026-11-10';
const zk = (n) => { const d = new Date(Date.parse(D0 + 'T12:00:00') - n * 864e5); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const ZS = (o) => ({ days: {}, meas: {}, pain: {}, urges: {}, hab: {}, prof: { cond: {}, pill: '' }, krok: null, cel: null, age: '35', goal: '66,5', ...o });
const MS = (pairs) => { const m = {}; for (const [n, v] of pairs) m[zk(n)] = { ...(m[zk(n)] || {}), ...v }; return m; };
const ev = (s, ctx) => Z().events(s, D0, ctx || {});
const evId = (s, id, ctx) => ev(s, ctx).filter((e) => e.id === id);
const VERIFIED = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 15, 17, 18, 19];

tryc('zdarzenia: moduł ma events, goals, suggest, progress, impact, signals', () => !!Z() && ['events', 'suggest', 'progress', 'impact', 'signals'].every((f) => typeof Z()[f] === 'function') && Z().goals.length === 7);
tryc('zdarzenia: 2 noce z rzędu poniżej 6 h to „Krótkie noce”, jedna noc albo 6 h nie', () => {
  const a = evId(ZS({ meas: MS([[0, { sleep: '5,5' }], [1, { sleep: '5,9' }]]) }), 'krotki_sen');
  const b = evId(ZS({ meas: MS([[0, { sleep: '5,5' }], [1, { sleep: '6' }]]) }), 'krotki_sen');
  return a.length === 1 && a[0].k === D0 && b.length === 0;
});
tryc('zdarzenia: 4 krótkie noce z rzędu to jedno zdarzenie', () => evId(ZS({ meas: MS([[0, { sleep: '5' }], [1, { sleep: '5' }], [2, { sleep: '5' }], [3, { sleep: '5' }]]) }), 'krotki_sen').length === 1);
tryc('zdarzenia: średnia wagi zmieniona o 0,5 kg przy 3 ważeniach w każdym tygodniu; 0,4 kg albo 2 ważenia nie', () => {
  const w = (now, old, n) => MS([...Array(n).keys()].map((i) => [i, { w: String(now) }]).concat([...Array(n).keys()].map((i) => [21 + i, { w: String(old) }])));
  const a = evId(ZS({ meas: w(80, 80.5, 3) }), 'waga_zmiana'), b = evId(ZS({ meas: w(80, 80.4, 3) }), 'waga_zmiana'), c = evId(ZS({ meas: w(80, 81, 2) }), 'waga_zmiana');
  return a.length === 1 && a[0].t.includes('spadła') && a[0].z.includes('3 ważeń') && b.length === 0 && c.length === 0;
});
tryc('zdarzenia: zmiana wagi i kroków raz, najnowsza (zachodzące okna nie powtarzają tego samego)', () => {
  const m = MS([...Array(50).keys()].map((i) => [i, { w: String(80 + i * 0.05), steps: String(9000 - i * 100) }]));
  const w = evId(ZS({ meas: m }), 'waga_zmiana'), k = evId(ZS({ meas: m }), 'kroki_zmiana');
  return w.length === 1 && w[0].k === D0 && k.length <= 1;
});
tryc('zdarzenia: waga stoi jak karta (różnica poniżej 0,2 kg, co najmniej 2 ważenia)', () => {
  const m = MS([[0, { w: '80' }], [1, { w: '80,1' }], [21, { w: '80' }], [22, { w: '80,1' }]]);
  return evId(ZS({ meas: m }), 'waga_stoi').length === 1 && evId(ZS({ meas: m }), 'waga_zmiana').length === 0;
});
tryc('zdarzenia: 3 dni z bólem w 7 dniach tak, 2 nie', () => {
  const p = (ds) => Object.fromEntries(ds.map((n) => [zk(n), {}]));
  return evId(ZS({ pain: p([0, 2, 5]) }), 'bol_dni').length === 1 && evId(ZS({ pain: p([0, 5]) }), 'bol_dni').length === 0;
});
tryc('zdarzenia: kroki zmienione o 1000 przy 4 dniach w każdym tygodniu; 3 dni nie', () => {
  const s = (n) => MS([...Array(n).keys()].map((i) => [i, { steps: '7000' }]).concat([...Array(n).keys()].map((i) => [7 + i, { steps: '6000' }])));
  const a = evId(ZS({ meas: s(4) }), 'kroki_zmiana');
  return a.length === 1 && a[0].t.includes('wzrosły') && evId(ZS({ meas: s(3) }), 'kroki_zmiana').length === 0;
});
tryc('zdarzenia: powrót po co najmniej 3 dniach bez wpisów, bez liczenia przerwy', () => {
  const a = evId(ZS({ meas: MS([[0, { w: '80' }], [10, { w: '80' }]]) }), 'powrot'), b = evId(ZS({ meas: MS([[0, { w: '80' }], [2, { w: '80' }]]) }), 'powrot');
  return a.length === 1 && a[0].k === D0 && a[0].x.includes('Dobrze, że jesteś') && !/dni przerwy|nie było Cię/.test(a[0].x) && b.length === 0;
});
tryc('zdarzenia: tylko ostatnie 28 dni', () => evId(ZS({ meas: MS([[30, { sleep: '5' }], [31, { sleep: '5' }]]) }), 'krotki_sen').length === 0);
tryc('zdarzenia: każde ma „z czego” z liczbą i „w tym czasie”, nigdy „z powodu”', () => {
  const s = ZS({ meas: MS([[0, { sleep: '5', steps: '7000', w: '80' }], [1, { sleep: '5', steps: '7000', w: '80' }], [2, { steps: '7000', w: '80' }], [3, { steps: '7000' }], [7, { steps: '5000' }], [8, { steps: '5000' }], [9, { steps: '5000' }], [10, { steps: '5000' }], [21, { w: '81' }], [22, { w: '81' }], [23, { w: '81' }]]), days: { [zk(1)]: [{ kind: 't', min: 30 }] } });
  const e = ev(s);
  if (e.length < 3) throw new Error('za mało zdarzeń: ' + e.map((x) => x.id).join(','));
  return e.every((x) => /[0-9]/.test(x.z) && typeof x.w === 'string' && !JSON.stringify(x).includes('z powodu')) && e.some((x) => x.w.includes('w tym czasie') && x.w.includes('1 trening'));
});
tryc('zdarzenia: tydzień celu z wynikiem po 7 dniach od wyboru', () => {
  const s = ZS({ cel: { id: 'sen', since: zk(7) }, meas: MS([0, 1, 2, 3, 4, 5, 6].map((n) => [n + 1, { sleep: n < 5 ? '7' : '5' }])) });
  const a = evId(s, 'cel_tydzien');
  return a.length === 1 && a[0].x.includes('5 z 7');
});
tryc('cel: propozycja w kolejności ból, sen, białko, ruch, zapisy, waga', () => {
  const S0 = (o) => ZS({ meas: MS([0, 1, 2, 3, 4].map((n) => [n, { w: '80' }])), ...o });
  const pain = { [zk(3)]: {} }, mig = { cond: { mig: true }, pill: '' };
  const meals = (p) => Object.fromEntries([0, 1, 2].map((n) => [zk(n), [{ kind: 'm', p, k: 400 }]]));
  const r = [
    Z().suggest(S0({ prof: mig, pain }), D0, { pT: 90 }),
    Z().suggest(S0({ meas: MS([[0, { sleep: '5', w: '80' }], [2, { sleep: '5', w: '80' }], [3, { w: '80' }], [4, { w: '80' }]]) }), D0, { pT: 90 }),
    Z().suggest(S0({ days: meals(30) }), D0, { pT: 90 }),
    Z().suggest(S0({ meas: MS([0, 1, 2, 3].map((n) => [n, { steps: '5000', w: '80' }])) }), D0, { pT: 90 }),
    Z().suggest(S0({ age: '65', meas: MS([0, 1, 2, 3].map((n) => [n, { steps: '7000', w: '80' }])) }), D0, { pT: 90 }),
    Z().suggest(ZS({ meas: MS([[0, { w: '80' }], [3, { w: '80' }]]) }), D0, { pT: 90 }),
  ];
  if (r.join() !== 'bol,sen,bialko,ruch,waga,zapisy') throw new Error(r.join());
  return true;
});
tryc('cel: postęp snu „5 z 7 nocy”, ruchu z progiem według wieku (Paluch 2022)', () => {
  const s = ZS({ meas: MS([0, 1, 2, 3, 4, 5, 6].map((n) => [n, { sleep: n < 5 ? '7' : '5', steps: '7000' }])) });
  const a = Z().progress(s, 'sen', D0, {}), b = Z().progress(s, 'ruch', D0, {}), c = Z().progress({ ...s, age: '65' }, 'ruch', D0, {});
  return a.txt.includes('5 z 7') && b.cel === 8000 && c.cel === 6000 && b.txt.includes('7000');
});
tryc('cel: wpływy tylko ze sprawdzonych wierszy mapy, z siłą i linkiem; migrena tylko przy profilu', () => {
  const all = Z().goals.flatMap((g) => Z().impact(g.id, { cond: { mig: true } }));
  const okRows = all.every((x) => VERIFIED.includes(x.row) && /^https:/.test(x.url) && ['mocne', 'umiarkowane', 'słabe'].includes(x.sila));
  const noMig = Z().impact('ruch', { cond: {} }).every((x) => !x.mig), withMig = Z().impact('ruch', { cond: { mig: true } }).some((x) => x.mig);
  const plan = Z().goals.every((g) => Z().impact(g.id, { cond: {} }).some((x) => x.row === 10));
  return okRows && noMig && withMig && plan;
});
tryc('cel: sygnały „najpierw lekarz”: aura z estrogenem, co najmniej 10 dni z lekiem w 30', () => {
  const med = (n) => Object.fromEntries([...Array(n).keys()].map((i) => [zk(i), { med: true }]));
  const a = Z().signals(ZS({ prof: { cond: { aura: true }, pill: 'x' } }), D0, { est: true }).map((x) => x.id);
  const b = Z().signals(ZS({ pain: med(10) }), D0, {}).map((x) => x.id), c = Z().signals(ZS({ pain: med(9) }), D0, {}).map((x) => x.id);
  return a.includes('aura_estrogen') && b.includes('leki') && c.length === 0;
});
// Etap 1 w aplikacji: Mój dzień
const secZd = (h) => { const i = h.indexOf('id="zdarzenia"'); return i < 0 ? '' : h.slice(i, h.indexOf('</section>', i)); };
const secCel = (h) => { const i = h.indexOf('id="cel"'); return i < 0 ? '' : h.slice(i, h.indexOf('</section>', i)); };
tryc('Mój dzień: „Co się wydarzyło” pod Stanem dziś, pusty stan z podpowiedzią', () => {
  const h = view('day', BASE()); const z = secZd(h);
  return h.indexOf('id="stan"') < h.indexOf('id="zdarzenia"') && z.includes('Co się wydarzyło') && z.includes('pojawią się');
});
tryc('Mój dzień: zdarzenie z danych osoby z „z czego” i „w tym czasie”', () => {
  const z = secZd(view('day', BASE({ meas: { [dk(0)]: { sleep: '5' }, [dk(1)]: { sleep: '5' } } })));
  return z.includes('Krótkie noce') && z.includes('w tym czasie');
});
tryc('Mój dzień: bez celu propozycja z przyciskiem; wybór zapisuje cel od dziś', () => {
  const c = secCel(view('day', BASE({ cel: null, meas: { [dk(0)]: { sleep: '5' }, [dk(1)]: { sleep: '5' } } })));
  if (!c.includes('data-cel="sen"')) throw new Error('brak propozycji snu');
  click({ cel: 'sen' }); const s = T.S().cel;
  return !!s && s.id === 'sen' && s.since === T.todayKey();
});
tryc('Mój dzień: aktywny cel z postępem, listą wpływów ze źródłami i zmianą celu (6 do wyboru)', () => {
  const c = secCel(view('day', BASE({ cel: { id: 'sen', since: dk(2) } })));
  return c.includes('Mniej krótkich nocy') && c.includes('Na co jeszcze wpływa') && c.includes('https://pubmed.ncbi.nlm.nih.gov/27804960/') && (c.match(/data-cel="/g) || []).length === 7;
});
tryc('Mój dzień: zmiana celu nie kasuje danych', () => {
  view('day', BASE({ cel: { id: 'sen', since: dk(5) }, meas: { [dk(0)]: { w: '80' } } })); click({ cel: 'ruch' });
  const s = T.S(); return s.cel.id === 'ruch' && s.meas[dk(0)].w === '80';
});
tryc('Mój dzień: sygnał „najpierw lekarz” nad celem', () => {
  const pain = Object.fromEntries([...Array(10).keys()].map((i) => [dk(i), { med: true }]));
  const h = view('day', BASE({ pain })); const i = h.indexOf('Najpierw lekarz');
  return i > 0 && i < h.indexOf('id="cel"');
});
tryc('etap 1: pole cel w DEF, zdarzenia.js w index.html przed app.js i w pamięci podręcznej', () => T.DEF().cel === null && html.indexOf('zdarzenia.js') > 0 && html.indexOf('zdarzenia.js') < html.indexOf('app.js') && fs.readFileSync(path.join(root, 'sw.js'), 'utf8').includes("'./zdarzenia.js'"));

// Wybór bez zatwierdzania i cofanie usunięć (błąd 10.11.2026: dotknięcie „Kaczuszka” zatwierdzało wybór na ekranie porównania)
const toastHtml = () => (els.toast || {}).innerHTML || '';
tryc('towarzysz: dotknięcie rodzaju to podgląd, nie wybór; porównanie obu, zatwierdzenie przyciskiem', () => {
  for (const tab of ['pet', 'set']) {
    let h = view(tab, BASE({ pet: null }));
    if (!h.includes('data-petprev="kaczka"') || h.includes('data-petkind')) throw new Error(tab + ': brak podglądu');
    click({ petprev: 'kaczka' }); h = view(tab);
    if (T.S().pet !== null || !h.includes('Wybieram: Kaczuszka') || !h.includes('data-petok')) throw new Error(tab + ': kaczka zatwierdzona albo brak przycisku');
    click({ petprev: 'gaska' }); h = view(tab);
    if (T.S().pet !== null || !h.includes('Wybieram: Gąska')) throw new Error(tab + ': gąska zatwierdzona');
    click({ petok: '1' });
    if (!T.S().pet || T.S().pet.kind !== 'gaska') throw new Error(tab + ': zatwierdzenie nie zapisało gąski');
  }
  return true;
});
tryc('towarzysz: przed podglądem nie ma przycisku zatwierdzenia', () => !view('pet', BASE({ pet: null })).includes('data-petok'));
const UNDO_CASES = [
  ['posiłek', () => BASE({ days: { [dk(0)]: [{ kind: 'm', label: 'Owsianka', k: 400, p: 30 }] } }), { del: '0' }, (S) => S.days[dk(0)].length === 1],
  ['dzień', () => BASE({ days: { [dk(0)]: [{ kind: 'm', label: 'Owsianka', k: 400, p: 30 }] } }), { clear: '1' }, (S) => S.days[dk(0)].length === 1],
  ['wynik badania', () => BASE({ labs: [{ id: 'x1', test: 'tsh', v: '2', u: 'mIU/l', d: dk(3) }] }), { labdel: 'x1' }, (S) => S.labs.length === 1],
  ['ból głowy', () => BASE({ pain: { [dk(0)]: { aura: false, med: true } } }), { painoff: '1' }, (S) => !!S.pain[dk(0)] && S.pain[dk(0)].med],
  ['ustawienia domyślne', () => BASE({ prof: { cond: { io: true }, pill: 'yaz' }, cel: { id: 'sen', since: dk(1) } }), { reset: '1' }, (S) => S.prof.cond.io && S.cel && S.cel.id === 'sen'],
];
for (const [n, mk, act, back] of UNDO_CASES) {
  tryc(`cofnięcie: ${n} usunięte jednym dotknięciem wraca przez „Cofnij”`, () => {
    view('day', mk()); click(act);
    if (back(T.S())) throw new Error('nic nie usunięto');
    if (!toastHtml().includes('data-undo') || !toastHtml().includes('Cofnij')) throw new Error('brak „Cofnij”');
    click({ undo: '1' });
    return back(T.S());
  });
}
// Strażnik: każda obsługa kliknięcia, która usuwa dane (splice, delete, filter na liście, czyszczenie, reset), musi iść przez undoable()
tryc('strażnik: usuwanie danych w obsłudze kliknięć zawsze z „Cofnij”', () => {
  const ALLOW = {
    consentoff: 'wycofanie zgody RODO ma być tak proste jak jej udzielenie; klucz usuwany celowo',
    chip: 'filtr przepisów: przełącza widok, nie usuwa danych',
    swap: 'zamiana dania w planie dnia: kolejne dotknięcie wraca do oryginału',
  };
  const bad = code.split('\n').filter((l) => /^\s*(else )?if\(d\.\w+/.test(l))
    .map((l) => [l.match(/if\(d\.(\w+)/)[1], l])
    .filter(([id, l]) => !ALLOW[id] && /\.splice\(|delete S\.|=\[\]|S\.labs=S\.labs\.filter|clone\(DEF\)/.test(l) && !l.includes('undoable('))
    .map(([id]) => id);
  if (bad.length) throw new Error(bad.join(', '));
  return true;
});
// Etap 3: wspólna ścieżka, kolejka celów, cel „siła”, zwierzak z zapowiedzią (docs/specs/2026-11-10-etap3-laczenie-i-zwierzak-design.md)
const ALL4 = { hashi: true, lip: true, io: true, mig: true };
const tr = (label) => ({ kind: 't', label, min: 45, gross: 300, net: 240 });
tryc('etap 3: sygnał UKMEC przy migrenie bez aury z estrogenem; nie przy aurze, bez estrogenu, bez migreny', () => {
  const sig = (cond, est, pain) => Z().signals(ZS({ prof: { cond, pill: 'yaz' }, pain: pain || {} }), D0, { est }).map((x) => x.id);
  const a = Z().signals(ZS({ prof: { cond: { mig: true }, pill: 'yaz' } }), D0, { est: true });
  const m = a.find((x) => x.id === 'mig_estrogen');
  return !!m && m.x.includes('UKMEC 2025') && m.x.includes('kontynuacja') && m.row === 18
    && !sig({ aura: true, mig: true }, true).includes('mig_estrogen') && !sig({ mig: true }, false).includes('mig_estrogen')
    && !sig({}, true).includes('mig_estrogen') && !sig({ mig: true }, true, { [zk(2)]: { aura: true } }).includes('mig_estrogen');
});
tryc('etap 3: cel „siła” w katalogu, postęp z treningów Siłownia i programu kolana', () => {
  const days = { [zk(0)]: [tr('Siłownia, całe ciało')], [zk(3)]: [{ ...tr('Program kolana'), knee: 1 }], [zk(4)]: [tr('Rower')] };
  const p = Z().progress(ZS({ days }), 'sila', D0, {});
  return Z().goals.length === 7 && !!Z().goalOf('sila') && p.ok === 2 && p.txt.includes('2');
});
tryc('etap 3: progi zaliczenia tygodnia (tuż poniżej i na progu)', () => {
  const D = Z().done, s7 = (n, v) => MS([...Array(7).keys()].map((i) => [i, i < n ? v : {}]));
  const meals = (n, p) => Object.fromEntries([...Array(n).keys()].map((i) => [zk(i), [{ kind: 'm', p, k: 400 }]]));
  const r = [
    D(ZS({ meas: s7(5, { w: '80' }) }), 'zapisy', D0, {}), !D(ZS({ meas: s7(4, { w: '80' }) }), 'zapisy', D0, {}),
    D(ZS({ meas: s7(6, { sleep: '6' }) }), 'sen', D0, {}), !D(ZS({ meas: s7(5, { sleep: '7' }) }), 'sen', D0, {}),
    D(ZS({ days: meals(5, 100) }), 'bialko', D0, { pT: 90 }), !D(ZS({ days: meals(4, 100) }), 'bialko', D0, { pT: 90 }),
    D(ZS({ meas: s7(4, { steps: '8000' }) }), 'ruch', D0, {}), !D(ZS({ meas: s7(4, { steps: '7999' }) }), 'ruch', D0, {}), !D(ZS({ meas: s7(3, { steps: '9000' }) }), 'ruch', D0, {}),
    D(ZS({ days: { [zk(0)]: [tr('Siłownia')], [zk(2)]: [tr('Siłownia')] } }), 'sila', D0, {}), !D(ZS({ days: { [zk(0)]: [tr('Siłownia')] } }), 'sila', D0, {}),
    D(ZS({ pain: { [zk(3)]: {}, [zk(30)]: {}, [zk(31)]: {} } }), 'bol', D0, {}), !D(ZS({ pain: { [zk(3)]: {}, [zk(30)]: {} } }), 'bol', D0, {}),
    !D(ZS({ meas: s7(7, { w: '80' }) }), 'waga', D0, {}),
  ];
  const i = r.indexOf(false); if (i >= 0) throw new Error('próg nr ' + i);
  return true;
});
tryc('etap 3: propozycja „ból” znika, gdy dni z bólem maleją; „siła” tylko przy IO; pominięcie bieżącego celu', () => {
  const base = { meas: MS([0, 1, 2, 3, 4, 5, 6].map((n) => [n, { w: '80', sleep: '7', steps: '9000' }])) };
  const less = Z().suggest(ZS({ ...base, prof: { cond: { mig: true } }, pain: { [zk(3)]: {}, [zk(30)]: {}, [zk(32)]: {} } }), D0, { pT: 0 });
  const more = Z().suggest(ZS({ ...base, prof: { cond: { mig: true } }, pain: { [zk(3)]: {}, [zk(5)]: {}, [zk(30)]: {} } }), D0, { pT: 0 });
  const io = Z().suggest(ZS({ ...base, prof: { cond: { io: true } } }), D0, { pT: 0 }), no = Z().suggest(ZS(base), D0, { pT: 0 });
  const sk = Z().suggest(ZS({ ...base, prof: { cond: { io: true } } }), D0, { pT: 0 }, ['sila']);
  if ([less, more, io, no, sk].join() !== 'waga,bol,sila,waga,waga') throw new Error([less, more, io, no, sk].join());
  return true;
});
tryc('etap 3: wpływy celu „siła” z wierszy 19 i 13; wiersze 18 i 19 sprawdzone', () => {
  const rows = Z().impact('sila', { cond: { io: true } }).map((x) => x.row);
  return rows.includes(19) && rows.includes(13) && Z().impact('sila', {}).every((x) => [10, 13, 18, 19].includes(x.row) && /^https:/.test(x.url));
});
tryc('Mój dzień: sygnał UKMEC nad celem przy migrenie bez aury i Yaz', () => {
  const h = view('day', BASE({ prof: { cond: { mig: true }, pill: 'yaz' } })); const i = h.indexOf('UKMEC 2025');
  return i > 0 && i < h.indexOf('id="cel"');
});
tryc('Zdrowie: pozycja UKMEC przy migrenie bez aury i Yaz, przed listą reszty', () => {
  const h = view('health', BASE({ prof: { cond: { mig: true }, pill: 'yaz' } }));
  return firstAct(h).includes('UKMEC 2025') && firstAct(h).includes('kontynuacja');
});
tryc('Mój dzień: zaliczony tydzień celu pokazuje „Następny cel” z przyciskiem; niezaliczony nie', () => {
  const m = Object.fromEntries([1, 2, 3, 4, 5, 6, 7].map((n) => [dk(n), { w: '80' }]));
  const a = secCel(view('day', BASE({ cel: { id: 'zapisy', since: dk(7) }, meas: m })));
  const b = secCel(view('day', BASE({ cel: { id: 'zapisy', since: dk(7) }, meas: { [dk(1)]: { w: '80' } } })));
  return a.includes('Tydzień zaliczony') && a.includes('Następny cel') && /data-cel="(?!zapisy)/.test(a.slice(a.indexOf('Następny cel'))) && !b.includes('Następny cel');
});
tryc('Mój dzień: „Twoje schorzenia razem” przy 2 schorzeniach, bez przy 1', () => {
  const a = view('day', BASE({ prof: { cond: { io: true, mig: true }, pill: '' } })), b = view('day', BASE({ prof: { cond: { io: true }, pill: '' } }));
  return a.includes('Twoje schorzenia razem') && a.includes('Razem: insulinooporność i migrena') && !b.includes('Twoje schorzenia razem');
});
tryc('scenariusz wszystkie: profil 4 schorzeń i Yaz, sygnał, następny cel, razem, zwierzak z zapowiedzią', () => {
  const s = T.scenS('wszystkie'); const h = view('day', s);
  return !!T.SCEN.wszystkie && s.prof.pill === 'yaz' && Object.keys(ALL4).every((c) => s.prof.cond[c]) && !s.prof.cond.aura
    && h.includes('UKMEC 2025') && h.includes('Następny cel') && h.includes('Twoje schorzenia razem') && h.includes('petnext');
});
// Zwierzak: zapowiedź „Co się zmieni”
const PNX = (o, goal) => sandbox.PET.next(st(mkCtx(o)), { ...mkCtx(o), goal });
tryc('pet: zapowiedź najwyżej 3 pozycje, kolejno cel, etap, odznaka; bez obietnic', () => {
  const g = { t: 'Mniej krótkich nocy', left: '2 noce co najmniej 6 h', gain: 'Po skróconym śnie osoby jadły więcej, średnio ok. 385 kcal na dobę.' };
  const a = PNX({ active: 3, streak: 4, seen: [] }, g);
  const txt = a.map((x) => x.t).join(' | ');
  return a.length === 3 && a[0].t.includes('Mniej krótkich nocy') && a[0].t.includes('W badaniach') && a[1].t.includes('Młoda') && a[1].t.includes('4 aktywne dni')
    && a[2].t.includes('Seria 7 dni') && !/na pewno|wyleczy|gwarant/i.test(txt);
});
tryc('pet: bez celu zapowiedź z etapu i odznaki; dorosła z pełną serią bez pozycji etapu', () => {
  const a = PNX({ active: 3, streak: 4, seen: [] }, null), b = PNX({ active: 40, streak: 31 }, null);
  return a.length === 2 && a[0].t.includes('Młoda') && b.every((x) => !/etap|będzie (Młoda|Dorosła)/.test(x.t));
});
tryc('pet: dorosła z pełną serią: zapowiedź następnego celu i dodatku za poziom tygodnia', () => {
  const c = { ...mkCtx({ active: 40, streak: 31 }), goal: { t: 'Regularne zapisy', left: 'tydzień zaliczony', gain: '', nx: 'Mniej dni z bólem głowy' }, nextLevel: { name: 'Brąz', need: 30 } };
  const a = sandbox.PET.next(st(c), c).map((x) => x.t);
  return a.length === 2 && a[0].includes('Następny cel: Mniej dni z bólem głowy') && a[1].includes('30 pkt') && a[1].includes('szalik');
});
tryc('pet: zaliczony tydzień celu to odznaka „Pierwszy zaliczony cel” i świętowanie', () => {
  const s = st({ ...mkCtx({ seen: SEEN_ALL }), goalDone: true });
  return s.milestone === 'cel1' && s.mood === 'celebrate' && sandbox.PET.badgeList([]).some((b) => b.id === 'cel1' && b.label === 'Pierwszy zaliczony cel');
});
tryc('pet: karta w Moim dniu ma pierwszą zapowiedź, ekran zwierzaka sekcję „Co się zmieni”', () => {
  const s = BASE({ pet: { kind: 'gaska', name: 'Kluska', since: dk(3) }, cel: { id: 'sen', since: dk(2) } });
  const d = view('day', s), p = view('pet', s);
  return d.includes('class="small petnext"') && p.includes('Co się zmieni') && p.includes('Mniej krótkich nocy');
});

// Jasne wybory (10.11.2026): każda grupa opcji ma nazwę, każda opcja mówi, czy jest wybrana, a etykieta zrozumiała bez zgadywania
const allChoiceHtml = () => {
  const out = [];
  for (const v of ['intro', 'meals', 'train', 'day', 'health', 'set', 'pet', 'knee', 'challenge']) out.push(view(v, BASE({ sex: 'K', lip: true, pet: null })));
  out.push(view('set', BASE({ pet: { ...PETA } })));
  for (const cat of ['bieznia', 'spinning']) out.push(view('train', BASE({ tr: { ...T.S().tr, cat } })));
  return out.join('\n');
};
tryc('strażnik: każda grupa wyboru (seg) w kodzie ma nazwę', () => {
  const calls = code.match(/\bseg\(\[\[/g).length, named = (code.match(/\bseg\(\[\[[\s\S]*?\]\],[^,]+,'\w+',(?:'[^']*'|""),'[^']{3,}'\)/g) || []).length;
  if (calls !== named) throw new Error(`${calls - named} z ${calls} bez nazwy`);
  return true;
});
tryc('strażnik: w każdym widoku grupy wyboru mają role="group" z nazwą, opcje aria-pressed', () => {
  const h = allChoiceHtml();
  const segs = h.match(/<div class="seg[^"]*"[^>]*>/g) || [];
  const noName = segs.filter((x) => !/role="group" aria-label="[^"]{3,}"/.test(x));
  // Żeton, który może być zaznaczony (klasa inc w szablonie), musi mieć aria-pressed; żetony akcji (wstaw wartość) nie
  const chips = (code.match(/<button class="chip[^>]*>/g) || []).filter((x) => /inc/.test(x) && !/aria-pressed=/.test(x));
  const segBtns = [...h.matchAll(/<div class="seg[^"]*"[^>]*>([\s\S]*?)<\/div>/g)].flatMap((m) => m[1].match(/<button[^>]*>/g) || []).filter((x) => !/aria-pressed=/.test(x));
  if (!segs.length) throw new Error('brak grup');
  if (noName.length || chips.length || segBtns.length) throw new Error(`bez nazwy ${noName.length}, żetony bez stanu ${chips.length}, opcje bez stanu ${segBtns.length}: ${(chips[0] || segBtns[0] || noName[0] || '').slice(0, 90)}`);
  return true;
});
tryc('jasne etykiety: bez samego „Auto”, „Region”, „Lekki”, „Zwykle”, „Talia” w opcjach', () => {
  const h = allChoiceHtml(), bad = ['Auto', 'Region', 'Lekki', 'Zwykle', 'Talia'].filter((l) => h.includes(`">${l}</button>`));
  if (bad.length) throw new Error(bad.join(', '));
  return h.includes('Auto: z treningów dnia') && h.includes('Lekki trening') && h.includes('Kraj telefonu') && h.includes('Obwód talii');
});
tryc('jasne etykiety: filtr produktów pokazuje stan w tekście (chcę, bez)', () => {
  const S0 = BASE(); const c = T.CHIPS[0]; S0.f = { ...T.S().f, chips: { [c]: 1, [T.CHIPS[1]]: -1 } };
  const h = view('meals', S0);
  return h.includes(`${c} (chcę)`) && h.includes(`${T.CHIPS[1]} (bez)`) && h.includes(`aria-pressed="true"`);
});
tryc('jasne etykiety: tydzień cyklu „Tydzień 1” zamiast „1”, dni sesji pełną nazwą dla czytnika', () => {
  const d = view('day', BASE({ sex: 'K' })), k = view('knee', BASE());
  return d.includes('>Tydzień 1</button>') && k.includes('aria-label="poniedziałek"') && k.includes('aria-label="niedziela"');
});

// Propozycja trybu po wprowadzeniu danych i tryb „Przyrost masy” (decyzja 10.11.2026; Iraki i in. 2019 PMC6680710, ISSN 2017 PMC5477153)
const MB = (o) => BASE({ kg: '70', cm: '170', goal: '66,5', mode: 'redukcja', modeKeep: '', ...o });
const secMode = (h) => { const i = h.indexOf('id="trybprop"'); return i < 0 ? '' : h.slice(i, h.indexOf('</section>', i)); };
tryc('tryb: propozycja z danych na granicach (niżej o 1,1 kg, ±1 kg, wyżej o 1,1 kg, BMI poniżej 18,5)', () => {
  const r = [['68,9', 'redukcja'], ['69', 'utrzymanie'], ['71', 'utrzymanie'], ['71,1', 'masa']].map(([g, m]) => { Object.assign(T.S(), { goal: g, kg: '70', cm: '170' }); return T.modeSuggest().m === m; });
  T.S().kg = '52'; T.S().cm = '170'; T.S().goal = '50'; const low = T.modeSuggest();
  if (r.includes(false)) throw new Error(r.join());
  return low.m === 'masa' && low.low === true;
});
tryc('tryb: karta „Proponowany tryb” w Moim dniu, gdy propozycja różni się od trybu; bez karty, gdy zgodna', () => {
  const a = secMode(view('day', MB({ goal: '75' }))), b = view('day', MB());
  return a.includes('Proponowany tryb') && a.includes('data-mode="masa"') && a.includes('Wybieram: Przyrost masy') && a.includes('data-modekeep') && !b.includes('id="trybprop"');
});
tryc('tryb: karta także w Ustawieniach pod „Tryb”', () => { const h = view('set', MB({ goal: '70,5' })); const i = h.indexOf('id="trybprop"'); return i > h.indexOf('id="tryb"') && secMode(h).includes('data-mode="utrzymanie"'); });
tryc('tryb: wybór z karty ustawia tryb; „Zostaję” ukrywa kartę do zmiany danych', () => {
  view('day', MB({ goal: '75' })); click({ mode: 'masa' });
  if (T.S().mode !== 'masa' || view('day').includes('id="trybprop"')) throw new Error('wybór');
  view('day', MB({ goal: '75' })); click({ modekeep: '1' });
  if (view('day').includes('id="trybprop"')) throw new Error('zostaję');
  T.S().goal = '76'; return view('day').includes('id="trybprop"');
});
tryc('tryb: przy BMI poniżej 18,5 karta mówi o lekarzu', () => secMode(view('day', MB({ kg: '52', goal: '50' }))).includes('porozmawiaj z lekarzem'));
tryc('masa: cel kalorii o 10% wyższy niż w utrzymaniu, białko 1,6 g/kg masy ciała', () => {
  view('day', MB({ mode: 'utrzymanie', goal: '75' })); const u = T.targetKcal();
  view('day', MB({ mode: 'masa', goal: '75' })); const m = T.targetKcal();
  return Math.abs(m - u * 1.1) < 1 && Math.abs(T.protTarget() - 1.6 * 70) < 0.01;
});
tryc('masa: Mój dzień opisuje nadwyżkę, tempo przyrostu i źródła; bez „x% mniej” w Ustawieniach', () => {
  const d = view('day', MB({ mode: 'masa', goal: '75' })), s = view('set', MB({ mode: 'masa', goal: '75' }));
  return d.includes('Przyrost masy') && d.includes('0,25-0,5%') && d.includes('PMC6680710') && !s.includes('% mniej</button>') && s.includes('>Przyrost masy</button>');
});
tryc('masa: waga docelowa niższa od obecnej daje ostrzeżenie', () => { view('set', MB({ mode: 'masa', goal: '65' })); click({ datasave: '1' }); return (els.toast || {}).innerHTML.includes('przyroście masy') || view('set').includes('przyroście masy'); });
tryc('masa: Pomoc opisuje 3 tryby', () => { const h = view('help', BASE({ helpQ: 'tryb' })); return h.includes('Przyrost masy') && h.includes('10%'); });

// Prostota (rada/2026-11-11_prostota.md): mniej słów i przycisków na Moim dniu
tryc('prostota: karta celu bez zdań powtarzających przycisk', () => {
  const c = secCel(view('day', BASE({ cel: null })));
  return c.includes('Proponowany cel: <b>') && !c.includes('Jeden cel naraz') && !c.includes('z Twoich danych');
});
tryc('prostota: dziennik nóg zwinięty, gdy czas na wpis; rozwinięty po pierwszym zaznaczeniu', () => {
  const a = view('day', BASE({ sex: 'K', lip: true, legs: {} }));
  const i = a.indexOf('id="fold_nogi"'), tag = a.slice(i - 60, a.indexOf('>', i) + 1);
  const b = view('day', BASE({ sex: 'K', lip: true, legs: { [dk(0)]: { b: 3 } } }));
  const j = b.indexOf('id="fold_nogi"'), tagB = b.slice(j - 60, b.indexOf('>', j) + 1);
  return i > 0 && a.includes('Nogi, raz w tygodniu: czas na wpis') && !/\sopen/.test(tag) && /\sopen/.test(tagB);
});
tryc('prostota: zapisane dziś bez pustej sekcji „Brak treningów”', () => {
  const h = view('day', BASE({ days: { [dk(0)]: [{ kind: 'm', label: 'Owsianka', k: 400, p: 30 }] } }));
  return !h.includes('Brak treningów') && h.includes('Owsianka');
});

// Prostota P2 (rada/2026-11-11_prostota.md, działanie 7): „Pomiary dnia” bez zdań, które powtarza ekran
tryc('prostota: instrukcja „Pomiary dnia” w 2 krótkich zdaniach, bez powtórzeń nagłówka obwodów i formatu snu', () => {
  const h = view('day', BASE()), i = h.indexOf('<h2>Pomiary dnia</h2>'), p = h.slice(i, h.indexOf('</p>', i));
  return i > 0 && p.includes('Waga rano, przed jedzeniem.') && !p.includes('po toalecie') && !p.includes('Obwody co 2 tygodnie') && !p.includes('tak jak pokazuje zegarek')
    && p.replace(/<[^>]+>/g, ' ').split(/(?<=\.)\s+/).filter((x) => x.trim()).length <= 3;
});

chain.then(() => {
  console.log(`WYNIK: ${ok} OK, ${bad} BLAD`);
  process.exit(bad ? 1 : 0);
});
