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
  document: { getElementById: mk, querySelector: () => null, querySelectorAll: () => [], addEventListener(t, f) { (lis[t] = lis[t] || []).push(f); } },
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
const sygPath = path.join(root, 'sygnaly.js');
if (fs.existsSync(sygPath)) vm.runInContext(fs.readFileSync(sygPath, 'utf8'), sandbox);
const skPath = path.join(root, 'skupienie.js');
if (fs.existsSync(skPath)) vm.runInContext(fs.readFileSync(skPath, 'utf8'), sandbox);
const wpPath = path.join(root, 'wpisy.js');
if (fs.existsSync(wpPath)) vm.runInContext(fs.readFileSync(wpPath, 'utf8'), sandbox);
vm.runInContext(code + '\n;globalThis.__T={acts:()=>ACTS,setDemoN:(v)=>{DEMO_N=v},wpModel:()=>wpCfg(),wpCfg:()=>wpCfg(),wpParse:(k,t)=>wpParse(k,t),wpStore:(k,v)=>wpStore(k,v),wpBand:(w,r)=>wpBand(w,r),wpOnSaved:(k,v)=>wpOnSaved(k,v),wpGrace:()=>wpGrace(),measCp:(m,f)=>measCp(m,f),dataGap:()=>dataGap(),wpCommit:(v,o)=>wpCommit(v,o),wpRestore:(p)=>wpRestore(p),qSet:(a,v,o)=>qSet(a,v,o),sleepAt:(k)=>sleepAt(k),avgAgo:(a,b,k)=>avgAgo(a,b,k),guideActive:()=>guideActive(),S:()=>S,egfrRows:()=>typeof egfrRows=="undefined"?[]:egfrRows(),nonHdlRows:()=>typeof nonHdlRows=="undefined"?[]:nonHdlRows(),egfrCat:(v)=>typeof egfrCat=="undefined"?"":egfrCat(v),muscleRec:()=>typeof muscleRec=="undefined"?undefined:muscleRec(),muscleSync:()=>muscleSync(),fitNow:()=>typeof fitNow=="undefined"?undefined:fitNow(),potKouri:()=>typeof potKouri=="undefined"?undefined:potKouri(),potButt:()=>typeof potButt=="undefined"?undefined:potButt(),muscleFix:(r,x)=>muscleFix(r,x),CHIPS,MOB:()=>typeof MOB=="undefined"?[]:MOB,WARM:()=>typeof WARM=="undefined"?[]:WARM,WARM_SRC:()=>typeof WARM_SRC=="undefined"?{}:WARM_SRC,modeSuggest:()=>modeSuggest(),targetKcal:()=>targetKcal(),protTarget:()=>protTarget(),PROT:()=>PROT,DEF:()=>DEF,nhKeep:()=>typeof BK_NH_KEEP=="undefined"?null:BK_NH_KEEP,setPending:(v)=>{BK_PENDING=v},render,MEALS,STEPS,PLAN,ING,LABS,num,checkNum,level,esc,save,setDemo:(v)=>{DEMO=v},setRedraw:(v)=>{REDRAW=v},ch:()=>CH,chSync,petCtx,dayPts,todayKey,guideSteps:()=>guideSteps(),guideToast:(b)=>guideToast(b),streak,bkBuild,kopiaDerive,kopiaEncrypt,kopiaDecrypt,kopiaSetup,KS,kopiaDue,kopiaSend,kopiaAuto,toast,toastMs,filtered,planIds,SCEN,scenS,mealTags,macros,planFor,ioFit,migGap,shopLines,ordCalc,CARDS,SRC,ORD,ORD_ADD,KROKI,kProg,krokMeals,mondayOf,reviewKey,ZAP,helpRes,PET,fixTouched,bmiCutFor,parseImport,impFromHash,setSygAl:(v)=>{SYG_AL=v},quickFromHash:(h)=>typeof quickFromHash=="function"?quickFromHash(h):false,SUPP:typeof SUPP=="undefined"?[]:SUPP,SUPP_PARY:typeof SUPP_PARY=="undefined"?[]:SUPP_PARY,promoParse:typeof promoParse=="undefined"?undefined:promoParse,promoMatch:typeof promoMatch=="undefined"?undefined:promoMatch,nextShop:typeof nextShop=="undefined"?undefined:nextShop,promosActive:typeof promosActive=="undefined"?undefined:promosActive,promoDishes:typeof promoDishes=="undefined"?undefined:promoDishes,promoFix:typeof promoFix=="undefined"?undefined:promoFix,promoPending:()=>typeof PROMO_PENDING=="undefined"?undefined:PROMO_PENDING,labStatus:typeof labStatus=="undefined"?undefined:labStatus,load:typeof load=="undefined"?undefined:load,stepsBand:typeof stepsBand=="undefined"?undefined:stepsBand,liteFull:typeof liteFull=="undefined"?undefined:liteFull,liteCardHtml:typeof liteCardHtml=="undefined"?undefined:liteCardHtml,liteUi:()=>typeof LITE_UI=="undefined"?{}:LITE_UI,liteStanHtml:(k)=>typeof liteStanHtml=="undefined"?"":liteStanHtml(k),unlockTxt:()=>UNLOCK_TXT,dayOk:typeof dayOk=="undefined"?undefined:dayOk,eggCrack:typeof eggCrack=="undefined"?undefined:eggCrack,liteDays:typeof liteDays=="undefined"?undefined:liteDays,dayLeft:typeof dayLeft=="undefined"?undefined:dayLeft,petCardHtml:typeof petCardHtml=="undefined"?undefined:petCardHtml,healthReact:typeof healthReact=="undefined"?undefined:healthReact,bodyDue:typeof bodyDue=="undefined"?undefined:bodyDue,qSet:typeof qSet=="undefined"?undefined:qSet,unlockNext:typeof unlockNext=="undefined"?undefined:unlockNext,unlockHtml:typeof unlockHtml=="undefined"?undefined:unlockHtml,labKeep:()=>LAB_KEEP,rowSpecs:(g)=>typeof rowSpecs=="undefined"?[]:rowSpecs(g),stpFmt:(v,st)=>stpFmt(v,st)};', sandbox);
const T = sandbox.__T;
T.S().lite = false; // dotychczasowe testy zakładają pełny widok

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
const KINDS = ['gaska', 'kaczka', 'kapibara', 'kotek'], STAGES = ['egg', 'chick', 'young', 'adult'], MOODS = ['celebrate', 'sleep', 'sad', 'hungry', 'tired', 'happy', 'ok', 'alert'];
const KIND_N = { gaska: 'Gąska', kaczka: 'Kaczuszka', kapibara: 'Kapibara', kotek: 'Kotek' };
const P = () => sandbox.PET;
tryc('pet.kinds: gąska, kaczuszka, kapibara i kotek', () => P().kinds().join() === 'gaska,kaczka,kapibara,kotek');
tryc('pet.svg: 4 gatunki × 4 etapy × 8 nastrojów: role=img, etykieta z gatunkiem, klasa miny i gatunku, bez on...=', () => {
  const bad = [];
  for (const k of KINDS) for (const s of STAGES) for (const m of MOODS) { const v = P().svg(k, s, m, null); if (!/^<svg[^>]*\srole="img"/.test(v) || !v.includes('aria-label="' + KIND_N[k] + ': ') || !v.includes('pet-' + m) || !v.includes('pet-' + k) || !v.endsWith('</svg>') || /<script|\son[a-z]+=/i.test(v)) bad.push(k + '/' + s + '/' + m); }
  if (bad.length) throw new Error(bad.slice(0, 5).join(' ')); return true;
});
tryc('pet.svg: jajo bez dzioba', () => !P().svg('gaska', 'egg', 'ok', null).includes('class="beak'));
tryc('pet.svg: każdy gatunek ma własny rysunek (cztery różne postacie)', () => new Set(KINDS.map((k) => P().svg(k, 'adult', 'ok', null).replace(/\s(class|id|aria-label|fill)="[^"]*"/g, ''))).size === 4);
tryc('pet.svg: stara kopia z kind kaczka to kaczuszka, nieznany rodzaj to gąska z poprawną etykietą', () => P().svg('kaczka', 'young', 'ok', null).includes('aria-label="Kaczuszka: zadowolona"') && P().svg('zebra', 'young', 'ok', null).includes('aria-label="Gąska: zadowolona"') && P().svg(undefined, 'chick', 'happy', null).includes('pet-gaska'));
tryc('pet.svg: dodatki (szalik, czapka, okulary, korona) dla każdego gatunku, na głowie', () => KINDS.every((k) => ['szalik', 'czapka', 'okulary', 'korona'].every((a) => { const v = P().svg(k, 'adult', 'ok', a); return v.includes('class="acc ' + a) && /class="zw-head"[\s\S]*class="acc /.test(v); })));
tryc('pet.svg: wyraz postaci: happy oczy-łuki, celebrate serduszka i konfetti, sleep „z z”, tired zamknięte oczy bez „z”, sad powieki bez łez, hungry dymek i przechylona główka, alert przechylona główka', () => KINDS.every((k) => {
  const v = (m) => P().svg(k, 'adult', m, null), n = (s, re) => (s.match(re) || []).length;
  return v('happy').includes('zw-arc') && !v('ok').includes('zw-arc') && n(v('celebrate'), /class="zw-heart/g) === 3 && v('celebrate').includes('class="conf')
    && n(v('sleep'), /class="zz/g) === 2 && v('tired').includes('zw-shut') && n(v('tired'), /class="zz/g) === 0 && v('sad').includes('zw-lid') && !/tear|łz/.test(v('sad'))
    && v('hungry').includes('class="bubble"') && /class="zw-head"[^>]*rotate\(-12/.test(v('hungry')) && /class="zw-head"[^>]*rotate\(-12/.test(v('alert')) && !/rotate\(-12/.test(v('ok'));
}));
tryc('pet.svg: etapy skalą 0,7 / 0,85 / 1, jajo bez postaci, pęknięcia jajka', () => KINDS.every((k) => P().svg(k, 'chick', 'ok', null).includes('scale(0.7)') && P().svg(k, 'young', 'ok', null).includes('scale(0.85)') && !P().svg(k, 'adult', 'ok', null).includes('scale(')
  && !P().svg(k, 'egg', 'ok', null).includes('zw-head')) && (P().svg('gaska', 'egg', 'ok', null, false, 3).match(/class="crack"/g) || []).length === 3 && P().svg('gaska', 'egg', 'ok', null, false, 3).includes('pęknięcia 3 z 4'));
const SUM0 = () => ({ today: { done: 2, pts: 35 }, week: { pts: 120, level: 'Brąz', next: { name: 'Srebro', need: 60 } }, all: { active: 12, streak: 5, dw: -1.4, waist: -2, pct: 40 }, badges: [] });
const FEM = /szczęśliwa|zmęczona|zadowolona|Młoda|Dorosła|\bjej\b/;
tryc('pet.form: kotek w rodzaju męskim (etykiety, etapy, linie, zapowiedź), pozostałe w żeńskim', () => {
  const lab = MOODS.map((m) => P().svg('kotek', 'adult', m, null)).join(' ');
  const c = mkCtx({ today: { meals: 2, sleep: 3 } }); c.pet.kind = 'kotek'; const s = st(c);
  const scr = ['young', 'adult', 'chick'].map((g) => P().screen({ ...s, stage: g, active: g === 'chick' ? 3 : 10 }, { kind: 'kotek', name: 'Mruczek' }, { ...SUM0(), badges: [] }, T.esc)).join(' ');
  const nx = P().next({ ...s, stage: 'chick', active: 3 }, { ...c, goal: null, nextLevel: null }).map((x) => x.t).join(' ');
  const g = mkCtx({ today: { meals: 2, sleep: 3 } }), sg = st(g);
  return s.mood === 'tired' && !FEM.test(lab + s.line + scr + nx) && lab.includes('Kotek: zmęczony') && lab.includes('Kotek: szczęśliwy') && lab.includes('Kotek: zadowolony') && scr.includes('Młody') && scr.includes('Dorosły') && nx.includes('będzie Młody')
    && sg.line.includes('zmęczona') && P().form('kotek', 'happy') === 'szczęśliwy' && P().form('kapibara', 'happy') === 'szczęśliwa' && P().form('kaczka', 'adult') === 'Dorosła';
});
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
tryc('pet.svg: nastrój alert ma klasę pet-alert i etykietę „uwaga”', () => { const v = P().svg('gaska', 'chick', 'alert', null); return v.includes('pet-alert') && /aria-label="[^"]*uwaga/.test(v); });
check('app.css: nastrój alert bez animacji (figura i oczy)', appCss.includes('.pet-alert .figure{animation:none') && appCss.includes('.pet-alert .eyes{animation:none'));

const views = ['meals', 'train', 'day', 'health', 'set', 'sos', 'labs', 'intro', 'review', 'recipe', 'knee', 'mob', 'impact', 'challenge', 'pet', 'krok', 'import'];
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
tryc('karta: puste imię gąski to Pianka', () => view('day', { pet: { kind: 'gaska', name: '', since: '2026-11-01' } }).includes('Pianka'));
tryc('karta: imię escapowane', () => { const h = view('day', { pet: { kind: 'kaczka', name: '<i>x</i>', since: '2026-11-01' } }); return h.includes('&lt;i&gt;x&lt;/i&gt;') && !h.includes('<i>x</i>'); });
tryc('ekran pet: obie postaci bez błędu', () => ['gaska', 'kaczka'].every((k) => view('pet', { pet: { kind: k, name: 'A', since: '2026-11-01' } }).includes('class="badges"')));
tryc('odznaka świętowana raz (petSeen)', () => {
  const first = view('pet', { pet: { kind: 'gaska', name: 'A', since: '2026-11-01' }, petSeen: [], reviews: { r: { a: 'x', d: '2026-11-01' } } });
  const seen = T.S().petSeen.includes('review1'), second = view('pet');
  return first.includes('pet-celebrate') && seen && !second.includes('pet-celebrate');
});
tryc('wprowadzenie: 1 ekran danych, Zaczynam, bez kropek postępu i bez wyboru zwierzaka', () => { const a = view('intro', { introStep: 0 }); return a.includes('Twoje dane') && !a.includes('data-intronext') && a.includes('>Zaczynam<') && !a.includes('Krok 1 z') && !a.includes('data-petkind'); });
const swSrc = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
check('sw.js: pet.js i krój pisma w pamięci podręcznej, CACHE miara-v5 (duże wydanie: wiersze wartości, suwaki z prędkością, przyciski, które reagują)', swSrc.includes("'./pet.js'") && swSrc.includes("'miara-v5'") && swSrc.includes("'./fonts/fraunces-latin-ext-600-normal.woff2'"));
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
tryc('pet.demo: klatki obejmują 7 min, 4 etapy, 4 gatunki i dodatek', () => { const f = P().demo(new Date('2026-11-05T12:00:00')).frames; const u = (k) => new Set(f.map((x) => x[k])); return u('mood').size === 7 && u('stage').size === 4 && u('kind').size === 4 && f.some((x) => x.acc); });
tryc('pet.demo: dane przykładowe przechodzą render wszystkich widoków', () => { const d = P().demo(new Date()).S; let err = ''; for (const tab of views) { try { view(tab, JSON.parse(JSON.stringify(d))); } catch (e) { err = err || tab + ': ' + e.message; } } if (err) throw new Error(err); return true; });
tryc('pet.screen: brak podpowiedzi etapu, gdy nic nie brakuje', () => !P().screen({ ...st(mkCtx()), stage: 'chick', active: 9 }, { kind: 'gaska', name: 'A' }, { ...SUM, badges: [] }, T.esc).includes('Do etapu'));
tryc('pet.demo: talia i kontur zmieniają się między startem a teraz', () => { const d = P().demo(new Date('2026-11-05T12:00:00')).S; const b = P().body(d.meas, new Date('2026-11-05T12:00:00'), T.num); const m = b.svg.match(/d="([^"]+)"/g); return b.ok && m.length === 2 && m[0] !== m[1]; });
tryc('tryb demo: save() nie zapisuje', () => { let n = 0; const o = sandbox.localStorage.setItem; sandbox.localStorage.setItem = () => { n++; }; T.setDemo(true); T.save(); T.setDemo(false); T.save(); sandbox.localStorage.setItem = o; return n === 1; });

// Poprawki po przeglądzie końcowym (I1-I5)
const PETA = { kind: 'gaska', name: 'A', since: '2026-11-01' }, REV = { r: { a: 'x', d: '2026-11-01' } };
const CLEAN = () => ({ days: {}, swaps: {}, meas: {}, hab: {}, urges: {}, gut: {}, reviews: {}, mode: 'redukcja', petCeleb: null, krok: null }), NOREV = SEEN_ALL.filter((x) => x !== 'review1');
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
tryc('guide: po ukończeniu panel znika, na górze Dziś, Stan dziś pod nim, przycisk ochoty raz, pod Dziś', () => {
  const h = view('day', { ...NEWU(), pet: { ...PETA }, guide: { hidden: false, dataOk: true, seenPet: true }, meas: { [today()]: { w: '82', steps: '6000' } }, days: { [today()]: [{ kind: 'm', label: 'x', k: 400, p: 30, f: 10, c: 40 }] } });
  return !h.includes('Pierwsze kroki') && h.indexOf('Dziś:') < h.indexOf('Stan dziś') && h.indexOf('Dziś:') < h.indexOf('Mam ochotę coś przekąsić') && h.split('Mam ochotę coś przekąsić').length === 2;
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
tryc('P1-3 (F1a, 22.11.2026): Ustawienia mają wybór Skupienie, który zastąpił przełącznik raz dziennie', () => { const h = view('set', CLEAN()); return h.includes('data-view="skup"') && !h.includes('data-k="once"'); });
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
// Karta „Dziś” (wpisy.js): pomocnicze do testów karty
const WP = () => sandbox.WPISY;
// Napis przycisku, który reaguje (data-ab), z miejsca etykiety .act-l (miarka szerokości ma napisy w atrybutach)
const ABL = (h, key) => { const m = new RegExp('data-ab="' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"[^>]*><span class="act-l">([^<]*)<').exec(h); return m ? m[1] : null; };
const wpDay = (meas, o) => { WP().reset(); return view('day', BASE({ meas: meas || {}, kg: '82', lite: false, touched: {}, ...(o || {}) })); };
const wpS = (k) => T.wpCfg().rows.find((R) => R.key === k), wpD = () => WP().draft('wp', T.todayKey()), wpSet = (d) => WP().commitSet(T.wpCfg(), d || {});
const card = (h) => { const i = h.indexOf('<article class="wp-card"'); return i < 0 ? '' : h.slice(i, h.indexOf('</article>', i) + 10); };
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
tryc('układ: Dziś na górze, karty pod nim, potem Stan dziś, zwierzak niżej; Więcej zwinięte', () => {
  const h = view('day', BASE({ pain: { [dk(0)]: {} }, meas: { [dk(0)]: { cyc: 'P' } } })), i = (x) => h.indexOf(x);
  return i('<h2>Dziś') > -1 && i('<h2>Dziś') < i('data-card=') && i('data-card=') < i('class="stan') && i('class="stan') < i('class="petcard') && /<details class="fold" id="fold_wiecej" data-fold="wiecej">/.test(h) && h.indexOf('data-fold="prognoza"') > i('data-fold="wiecej"');
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
// Zadanie 5 (20.11.2026): profil w wierszach wartości (wpisy.js); waga i waga docelowa co 0,5 kg, wpis z klawiatury dla dokładnej wartości
const PFR = (k) => T.rowSpecs('pf').find((R) => R.key === k), PFS = (k, d) => { const R = PFR(k); R.put(WP().step(R, R.start.v, d)); return T.S()[k]; };
tryc('pola: Ustawienia mają przyciski − i + przy wadze i wzroście', () => { WP().reset(); const h = view('set', BASE()); return ['kg', 'cm'].every((k) => h.includes(`data-wps="pf" data-wpk="${k}"`) && h.includes(`data-wp="pm:${k}:-1"`) && h.includes(`data-wp="pm:${k}:1"`)); });
tryc('pola: + przy wadze dodaje 0,1 kg', () => { view('set', BASE({ kg: '82', touched: { kg: true, cm: true, age: true, goal: true } })); return PFS('kg', 1) === '82,1'; });
tryc('pola: − przy wadze odejmuje 0,1 kg', () => { view('set', BASE({ kg: '82', touched: { kg: true, cm: true, age: true, goal: true } })); return PFS('kg', -1) === '81,9'; });
tryc('pola: krok nie wychodzi poza limit', () => { view('set', BASE({ cm: '220', touched: { kg: true, cm: true, age: true, goal: true } })); return PFS('cm', 1) === '220'; });
tryc('pola: waga dnia zaczyna od ostatniego ważenia, potem krok (karta Dziś)', () => {
  WP().reset(); view('day', BASE({ meas: { [dk(2)]: { w: '80,4' } } })); const R = wpS('w'), a = R.start.v, b = WP().step(R, a, 1); T.wpCommit({ w: b }); return a === 80.4 && T.S().meas[dk(0)].w === '80,5';
});
tryc('pola: sen zaczyna od 7 h i idzie co 5 minut (krok dokładny suwaka)', () => { WP().reset(); view('day', BASE()); const R = wpS('s'), a = R.start.v; T.wpCommit({ s: WP().step(R, a, 1) }); return a === 420 && T.S().meas[dk(0)].sleep === '7:05'; });
tryc('pola: Pomiary dnia mają przyciski przy wadze, krokach i śnie', () => { WP().reset(); const h = view('day', BASE()); return ['w', 's', 'k'].every((x) => h.includes(`data-wp="pm:${x}:-1"`) && h.includes(`data-wp="pm:${x}:1"`)); });
tryc('trening: szybki wybór czasu 30, 45, 60, 90 min', () => { const h = view('train', BASE()); if (![30, 45, 60, 90].every((v) => h.includes(`data-setv="tr.wmin" data-v="${v}"`))) return false; click({ setv: 'tr.wmin', v: '45' }); return T.S().tr.wmin === '45'; });
tryc('przepis: po „Zjem, zapisz” danie z planu nie pokazuje „W planie na dziś”', () => { const S0 = BASE({ swaps: {}, days: {} }); view('recipe', S0); const id = T.planIds()[0]; T.S().recipe = id; const a = view('recipe'); click({ addmeal: id }); const b = view('recipe'); return a.includes('W planie na dziś') && ABL(b, 'meal:' + id) === '✓ Zjedzone · Cofnij' && !b.includes('W planie na dziś'); });
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
tryc('przyciski: − i + w kształcie pól (wiersze wartości)', () => /border-radius:var\(--r-s\)/.test(ruleOf('.wp-sq,.wp-chg')));
tryc('przyciski: brak var(--pill) w regułach wyboru (kafelki 12 px; pigułka tylko dla znaczników .rec .chip, które nie są wyborem)', () => { const bad = [...sysCss.matchAll(/([^{}\n]+)\{[^}]*border-radius:var\(--pill\)/g)].map((m) => m[1].trim()).filter((sel) => /\.btn|\.stp|\.tclose|\.hbtn|button|\.chip|\.seg|\.zw-mood/.test(sel) && !/^\.rec \.chip\b/.test(sel)); if (bad.length) throw new Error(bad.join(' | ')); return true; });
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
const NH_KEEP = ['toastLen', 'tips', 'discreet', 'pet', 'prices', 'ord', 'shopDay', 'stores', 'promos', 'lite', 'unlock', 'unlockAt', 'unlockSnooze', 'pmLeft', 'vibr', 'petNames', 'focus', 'still'];
const NH_DROP = ['kg', 'cm', 'age', 'sex', 'goal', 'touched', 'goalWay', 'muscle', 'muscleAuto', 'muscleAutoLast', 'bmiCut', 'korekta', 'tab', 'f', 'tr', 'days', 'hab', 'urges', 'meas', 'labs', 'labSel', 'onb', 'introStep', 'reviews', 'body', 'once', 'prof', 'cardsOk', 'pain', 'consent', 'kopia', 'visit', 'petSeen', 'petCeleb', 'krok', 'wizyta', 'sygSeen', 'wizList', 'suppTake', 'guide', 'legs', 'lip', 'mode', 'maintRef', 'maintSince', 'knee', 'wi', 'chMode', 'bkNoHealth', 'lastBackup', 'sosStep', 'sosTrig', 'ifthen', 'swaps', 'cel', 'modeKeep', 'mob', 'plan', 'insole', 'tmpPlan', 'gut', 'frame'];
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
const typeSleep = (t) => T.wpParse('s', t);
tryc('sen: jedno pole wpisu cyframi, bez przełączania klawiatury (613 albo 6:13); bez starej pary pól', () => { WP().reset(); const h = view('day', BASE()); return !h.includes('id="m_sleepm"') && !h.includes('data-sl=') && wpS('s').inputmode === 'decimal' && typeSleep('613').v === 373 && typeSleep('6:13').v === 373 && !h.includes('np. 7,5'); });
tryc('sen: 6 h i 13 min zapisuje 6:13', () => { WP().reset(); view('day', BASE()); const r = typeSleep('6:13'); T.wpCommit({ s: r.v }); return !r.err && T.S().meas[dk(0)].sleep === '6:13' && Math.abs(T.num('6:13') - (6 + 13 / 60)) < 1e-9; });
tryc('sen: same minuty 45 to 0:45', () => { WP().reset(); view('day', BASE()); T.wpCommit({ s: typeSleep('0:45').v }); return T.S().meas[dk(0)].sleep === '0:45'; });
tryc('sen: minuty 75 odrzucone, zostaje poprzednia wartość', () => { WP().reset(); view('day', BASE({ meas: { [dk(0)]: { sleep: '7:00' } } })); const r = WP().edit(T.wpCfg(), 's', '6:75'); return !!r.err && wpD().s === undefined && T.S().meas[dk(0)].sleep === '7:00' && /id="m_sleep"[^>]*>7 h</.test(card(view('day', {}))); });
tryc('sen: 17 godzin odrzucone', () => { WP().reset(); view('day', BASE({ meas: { [dk(0)]: { sleep: '7:00' } } })); return !!WP().edit(T.wpCfg(), 's', '17').err && T.S().meas[dk(0)].sleep === '7:00'; });
tryc('sen: litery odrzucone, przecinek to ułamek godziny (6,5 to 6 h 30 min)', () => !!typeSleep('6a').err && !!typeSleep('abc').err && typeSleep('6,5').v === 390);
tryc('sen: stary zapis 7,5 pokazuje 7 h 30 min', () => { WP().reset(); const h = card(view('day', BASE({ meas: { [dk(0)]: { sleep: '7,5' } } }))); return /id="m_sleep"[^>]*>7 h 30 min</.test(h) && /id="wp_rs"[^>]*value="450"/.test(h); });
tryc('sen: Stan dziś pokazuje 6 h 13 min', () => stan(view('day', BASE({ meas: { [dk(0)]: { sleep: '6:13' } } }))).includes('6 h 13 min'));
tryc('sen: błędny wpis wraca do wartości sprzed edycji, nie do cyfry wpisanej po drodze', () => {
  WP().reset(); view('day', BASE({ meas: { [dk(0)]: { sleep: '6:13' } } })); const m = T.wpModel();
  const a = WP().edit(T.wpCfg(), 's', '6:75'), d = wpD();
  return !!a.err && d.s === undefined && T.S().meas[dk(0)].sleep === '6:13' && /id="m_sleep"[^>]*>6 h 13 min</.test(card(view('day', {})));
});
tryc('liczby: kroki 10,500 i 10.500 to dziesięć i pół tysiąca, nie 10,5', () => cn('meas.d.steps', '10,500').s === '10500' && cn('meas.d.steps', '10.500').s === '10500');
tryc('liczby: pola całkowite odrzucają ułamki z jasnym komunikatem', () => ['8,5', '45.5'].every((v) => /całkowit/.test(cn('meas.d.steps', v).err || '')) && /całkowit/.test(cn('age', '28,5').err || ''));
tryc('liczby: czas treningu 1:15 i 1:15:30 z zegarka to 75 i 76 minut', () => cn('tr.wmin', '1:15').s === '75' && cn('tr.wmin', '1:15:30').s === '76' && cn('tr.min', '0:45').s === '45');
tryc('liczby: czas treningu 1:75 odrzucony', () => !!cn('tr.wmin', '1:75').err);
tryc('liczby: komunikat błędu z przykładem dla tego pola, nie wagi', () => !/82,4/.test(cn('meas.d.steps', 'abc').err) && /82,4/.test(cn('meas.d.w', 'abc').err));
tryc('sen: 6:75 w tekście odrzucone przez walidację', () => !!cn('meas.d.sleep', '6:75').err && !cn('meas.d.sleep', '6:59').err);
tryc('sen: karty piszą sen w godzinach i minutach', () => view('day', BASE({ meas: { [dk(0)]: { sleep: '5:20' }, [dk(1)]: { sleep: '5:45' } } })).includes('sen: 5 h 45 min i 5 h 20 min'));

// Zgłoszenie 06.11.2026: przytrzymanie − i +, pola według WCAG 2.2, scenariusze do sprawdzania bez wpisywania
tryc('przytrzymanie: krok ze wspólnej funkcji, większy krok przy długim trzymaniu (waga w profilu bez siatki zgrubnej: ×5 po 30 krokach)', () => { WP().reset(); view('set', BASE({ kg: '82', touched: { kg: true, cm: true, age: true, goal: true } })); const R = T.rowSpecs('pf').find((x) => x.key === 'kg'), h = WP().holdStep; return Math.abs(h(R, 82, 1, 1) - 82.1) < 1e-9 && Math.abs(h(R, 82, 1, 31) - 82.5) < 1e-9; });
tryc('przytrzymanie: obsługa wciśnięcia i puszczenia przycisku (wiersze wartości: pointercancel osobno jako anulowanie)', () => { const w = fs.readFileSync(wpPath, 'utf8'); return /addEventListener\('pointerdown'/.test(w) && /addEventListener\('pointerup', holdEnd\)/.test(w) && /addEventListener\('pointercancel', holdCancel\)/.test(w) && !/addEventListener\('pointercancel', holdEnd\)/.test(w); });
tryc('przytrzymanie: po puszczeniu fokus wraca na ten sam przycisk (fokus na − albo + przed zapisem, przerysowanie oddaje go po data-)', () => { const w = fs.readFileSync(wpPath, 'utf8'); return /document\.activeElement !== b && b\.focus\) b\.focus\(\{ preventScroll: true \}\)/.test(w) && /function btnSel\(/.test(code); });
tryc('przytrzymanie: przyciski bez zaznaczania tekstu i z szybkim dotykiem', () => /\.wp-sq,\.wp-chg\{[^}]*touch-action:manipulation/.test(sysCss) && /\.wp-sq,\.wp-chg\{[^}]*user-select:none/.test(sysCss) && !sysCss.includes('.stp{'));
tryc('klawiatura: wiersze wartości mają suwak natywny (strzałki o krok dokładny) albo − i + jako przyciski; pola z data-k i − + nie zostały', () => { WP().reset(); const h = view('set', BASE({ touched: { kg: true, cm: true, age: true, goal: true } })); return /<input class="wp-range" type="range" id="pf_rcm" min="140" max="210" step="1"/.test(h) && h.includes('data-wp="pm:kg:1"') && !h.includes('data-stp') && !/data-k="(kg|cm|age|goal)"/.test(h); });
tryc('podpowiedź: waga dnia bez dzisiejszego ważenia pokazuje ostatnie ważenie', () => { WP().reset(); return /id="m_w"[^>]*>80,4 kg</.test(card(view('day', BASE({ meas: { [dk(2)]: { w: '80,4' } } })))); });
tryc('fokus niezasłonięty: przewijanie z marginesem na dolny pasek', () => /html\{[^}]*scroll-padding-bottom:/.test(sysCss));
tryc('komunikat dla czytnika: obszar aria-live na wartości pól', () => /id="sr"[^>]*aria-live="polite"|aria-live="polite"[^>]*id="sr"/.test(html));
tryc('błąd pod polem: komunikat powiązany z polem', () => /aria-describedby/.test(code) && /class="err"|className='err'/.test(code));
tryc('scenariusze: co najmniej 5, każdy z opisem, co sprawdzić', () => { const k = Object.keys(T.SCEN); return k.length >= 5 && k.every((n) => T.SCEN[n].t && T.SCEN[n].chk && T.SCEN[n].chk.length > 30); });
tryc('scenariusze: Pomoc ma przyciski do każdego scenariusza', () => { const h = view('help', BASE()); return Object.keys(T.SCEN).every((n) => h.includes(`data-scen="${n}"`)); });
tryc('scenariusz migrena: najpierw przeciwwskazanie, licznik dni z lekiem', () => { const h = view('health', T.scenS('migrena')); return firstAct(h).includes('przeciwwskazanie') && planOf(h).includes('10 dni z lekiem'); });
tryc('scenariusz minitabletka: bez przeciwwskazania, z kategoriami', () => { const h = view('health', T.scenS('minitabletka')); return !planOf(h).includes('przeciwwskazanie') && planOf(h).includes('UKMEC 2025'); });
tryc('scenariusz hashimoto: TSH i talia osobno', () => { const h = planOf(view('health', T.scenS('hashimoto'))); return h.includes('TSH 6-8 tygodni') && h.includes('osobno'); });
// Rada 20.11.2026, P1-4 (zasada 3 mapy): aplikacja wspiera styl życia, nie leczenie; leki tylko jako „powiedz lekarzowi” / „zapytaj lekarza lub farmaceutę”
tryc('leki: brak porad o dawkach przy lekach w tekstach aplikacji (zdanie z „dawk” i lekiem musi mieć lekarza lub farmaceutę)', () => {
  const MED = /\b(lek(u|i|iem|ów|om|ach)?|lewotyroks\w*|tabletk\w*)\b/i;
  const bad = code.split(/(?<=[.;!?]) |\n/).filter((z) => /dawk/i.test(z) && MED.test(z) && !/lekarz|farmaceut/i.test(z)).map((z) => z.trim().slice(0, 80));
  if (bad.length) throw new Error(bad.join(' | '));
  return true;
});
tryc('leki: plan i scenariusz Hashimoto bez pory ani odstępu leku podanych jako porada (tylko „zapytaj lekarza”)', () => {
  const h = planOf(view('health', T.scenS('hashimoto')));
  const chk = T.SCEN.hashimoto.chk;
  return !/Lewotyroksyna na czczo|60 minut przed śniadaniem|dawka lewotyroksyny/.test(h + chk) && /zmieniłaś tabletki, i powiedz o tym lekarzowi/.test(h) && /zapytaj lekarza lub farmaceutę/i.test(h);
});
tryc('scenariusz wpisy: „Jak wczoraj” kopiuje sen i kroki z wczoraj, wagi nie (pomiar), pochodzenie w meas.cp', () => { WP().reset(); view('day', { ...T.scenS('wpisy'), lite: false }); const o = wpSet(); T.wpCommit(o.vals, o); const m = T.S().meas[dk(0)]; return m.w === undefined && m.sleep === '6:13' && m.steps === '8500' && m.cp.sort().join() === 'sleep,steps'; });
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

tryc('przytrzymanie: 15 kroków w mniej niż 1,5 s, 30 kroków w mniej niż 2 s', () => { const tAt = (n) => { let t = WP().HOLD_DELAY; for (let i = 1; i < n - 1; i++) t += WP().holdGap(i); return t; }; return tAt(15) < 1500 && tAt(30) < 2000; });

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
tryc('zamówione: zapamiętany wybór widać jako etykietę, bez zapisu jej nie ma', () => { const a = view('meals', ORDB()); const b = view('meals', BASE({ ord: undefined })); return a.includes('Zapamiętane z ostatniego razu:') && !b.includes('Zapamiętane z ostatniego razu'); });
tryc('zamówione: każde danie ma zdanie dietetyka', () => ['sushi', 'kurczak', 'tofu'].every((d) => /class="why"|class="small muted"/.test(view('meals', ORDB({ dish: d }))) && view('meals', ORDB({ dish: d })).includes('class="ordtip"')));
tryc('zamówione: szybki wpis prowadzi do Zamówione', () => view('day', BASE()).includes('data-nav="meals#zamowione#zamowione"'));
tryc('zamówione: bez nazw lokali', () => !/chingu|kfc|sushi\s*master/i.test(code));
tryc('sen: suwak 3-12 h co 5 minut (siatka 15 minut przy szybkim przesunięciu) ustawia sen', () => { WP().reset(); const h = view('day', BASE()); if (!/id="wp_rs" min="180" max="720" step="5"/.test(h)) return false; wpD().s = 450; const o = wpSet(wpD()); T.wpCommit(o.vals, o); return T.S().meas[dk(0)].sleep === '7:30' && !T.measCp(T.S().meas[dk(0)], 'sleep'); });
tryc('sen: jak wczoraj z wczorajszą wartością', () => { WP().reset(); const h = card(view('day', BASE({ meas: { [dk(1)]: { sleep: '6:13' } } }))); return /id="m_sleep"[^>]*>6 h 13 min</.test(h) && h.includes('jak wczoraj?') && h.includes('>Jak wczoraj<'); });
tryc('kroki: jak wczoraj, gdy dziś pusto; po zapisie bez pytania', () => { WP().reset(); const h = card(view('day', BASE({ meas: { [dk(1)]: { steps: '8500' } } }))); if (!/id="m_steps"[^>]*>8.500</.test(h) || !h.includes('>Jak wczoraj<')) return false; const o = wpSet(); T.wpCommit(o.vals, o); const b = card(view('day', {})); return T.S().meas[dk(0)].steps === '8500' && !b.includes('jak wczoraj?') && !b.includes('>Jak wczoraj<'); });
tryc('kroki: − i + co 50 (krok dokładny suwaka), Page Up co 500', () => { WP().reset(); view('day', BASE({ meas: { [dk(0)]: { steps: '5000' } } })); const R = wpS('k'); T.wpCommit({ k: WP().step(R, R.start.v, 1) }); return T.S().meas[dk(0)].steps === '5050' && WP().pageStep(R, 5050, 1) === 5500; });
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
tryc('start: + i - ustawiają wartość jako Twoją', () => { WP().reset(); view('intro', NEWD()); PFS('kg', 1); return T.S().touched.kg === true && !T.S().touched.cm; });
tryc('start: cel startowy ze źródłem NHLBI (5-10% w ok. 6 miesięcy)', () => { const h = view('intro', NEWD()); return h.includes('nhlbi.nih.gov') && h.includes('5% mniej'); });
tryc('start: Zaczynam z wartościami startowymi nie zalicza danych i prowadzi do Ustawień', () => { view('intro', NEWD({ guide: { hidden: false, dataOk: false, seenPet: false } })); click({ introdone: 'ok' }); const t = els.toast.innerHTML; return !T.S().guide.dataOk && t.includes('wartościach startowych') && t.includes('data-tab="set"'); });
tryc('start: Zapisz i sprawdź w Ustawieniach potwierdza wartości', () => { view('set', { ...NEWD(), onb: true, guide: { hidden: false, dataOk: false, seenPet: false } }); click({ datasave: '1' }); const t = T.S().touched; return t.kg && t.cm && t.age && t.goal && T.S().guide.dataOk; });
tryc('start: zapisane wcześniej dane bez znacznika traktowane jako ustawione', () => { const o = T.fixTouched({ kg: '90', cm: '180' }); return o.touched.kg && o.touched.goal; });
// Rada 09.11.2026 (formy wprowadzania a WCAG 2.2): wartość suwaka z jednostką, Page Up/Down, gotowe wartości celu i kalorii
const TA4 = { kg: true, cm: true, age: true, goal: true };
tryc('suwaki filtrów: aria-valuetext z jednostką (WCAG 4.1.2)', () => { const h = view('meals', BASE({ f: { ...T.S().f, minP: 30, maxK: 1000, maxC: 50, portion: 1.2 } })); return h.includes('aria-valuetext="co najmniej 30 g białka"') && h.includes('aria-valuetext="kalorie bez limitu"') && h.includes('aria-valuetext="najwyżej 50 g węglowodanów"') && h.includes('aria-valuetext="porcja 1,2 ×"'); });
tryc('suwaki filtrów: przesunięcie aktualizuje aria-valuetext', () => { view('meals', BASE()); const el = { dataset: { r: 'minP' }, value: '40', attrs: {}, setAttribute(k, v) { this.attrs[k] = v; }, getAttribute() { return null; } }; (lis.input || []).forEach((f) => f({ target: el })); return el.attrs['aria-valuetext'] === 'co najmniej 40 g białka'; });
const key = (k, kk) => { const el = { dataset: { k: kk }, value: '' }; let p = false; (lis.keydown || []).forEach((f) => f({ key: k, target: el, preventDefault() { p = true; } })); return p; };
tryc('suwaki: Page Up i Page Down zmieniają o krok zgrubny (wzrost co 5 cm, wiek co 5 lat; strzałki natywnie co 1)', () => { WP().reset(); view('set', BASE({ cm: '172', age: '40', touched: { ...TA4 } })); const R = (k) => T.rowSpecs('pf').find((x) => x.key === k), p = WP().pageStep; return p(R('cm'), 172, 1) === 175 && p(R('cm'), 175, -1) === 170 && p(R('age'), 40, 1) === 45 && R('cm').step === 1; });
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
// Mięśnie z FFMI (15.11.2026): mediana FFMI 18-34 lat z Schutz 2002 (PMID 12080449): 18,9 kg/m² u mężczyzn, 15,4 u kobiet; reguła Miary: powyżej mediany = włączone
const GM = (o) => GB({ muscleAuto: true, muscleAutoLast: null, ...o });
const FFM = (v, n = 1) => ({ meas: { [dk(n)]: { ffm: v } } });
const chk = (checked) => ({ dataset: { k: 'muscle' }, type: 'checkbox', checked, value: '', getAttribute() { return null; }, setAttribute() {}, classList: { toggle() {} } });
tryc('mięśnie: muscleRec bez pomiaru FFM albo bez wzrostu daje null', () => { view('set', GM()); const a = T.muscleRec(); view('set', GM({ cm: '', ...FFM('66') })); return a === null && T.muscleRec() === null; });
tryc('mięśnie: mężczyzna, FFM 66 kg, 180 cm: FFMI około 20,4, mediana 18,9, powyżej', () => { view('set', GM({ sex: 'M', cm: '180', ...FFM('66') })); const r = T.muscleRec(); return Math.abs(r.ffmi - 20.37) < 0.01 && r.med === 18.9 && r.above === true; });
tryc('mięśnie: kobieta, FFM 40 kg, 165 cm: FFMI około 14,7, mediana 15,4, poniżej', () => { view('set', GM({ sex: 'K', cm: '165', ...FFM('40') })); const r = T.muscleRec(); return Math.abs(r.ffmi - 14.69) < 0.01 && r.med === 15.4 && r.above === false; });
tryc('mięśnie: domyślnie ocena automatyczna (DEF.muscleAuto), stare dane bez pola też', () => T.DEF().muscleAuto === true);
tryc('mięśnie: automat włącza „Dużo mięśni” i cel talią, gdy FFMI powyżej mediany', () => { view('set', GM({ sex: 'M', cm: '180', muscle: false, goalWay: 'proc', ...FFM('66') })); T.muscleSync(); return T.S().muscle === true && T.S().goalWay === 'talia'; });
tryc('mięśnie: automat wyłącza poniżej mediany, sposób celu bez zmian, komunikat raz', () => { view('set', GM({ sex: 'K', cm: '165', muscle: true, goalWay: 'bmi', ...FFM('40') })); const t1 = T.muscleSync(), t2 = T.muscleSync(); return T.S().muscle === false && T.S().goalWay === 'bmi' && t1 === 'Masa beztłuszczowa poniżej mediany: wyłączono „Dużo mięśni”. Sposób liczenia celu sprawdź w Ustawieniach.' && t2 === ''; });
tryc('mięśnie: zmiana przełącznika ręcznie wyłącza automat i synchronizacja jej nie nadpisuje', () => { view('set', GM({ sex: 'M', cm: '180', muscle: true, ...FFM('66') })); (lis.input || []).forEach((f) => f({ target: chk(false) })); T.muscleSync(); return T.S().muscle === false && T.S().muscleAuto === false; });
tryc('mięśnie: Ustawienia, mężczyzna z FFM: FFMI, mediana 18,9, zalecamy włączone, reguła i źródło', () => { const h = view('set', GM({ sex: 'M', cm: '180', age: '30', ...FFM('66') })); return h.includes('Dużo mięśni: oceniaj cel talią, nie samym BMI') && h.includes('Twoje FFMI: 20,4 kg/m² (masa beztłuszczowa na m² wzrostu). Mediana w badaniu dla mężczyzn 18-34 lat: 18,9. Masz więcej niż połowa badanych, więc zalecamy: włączone.') && h.includes('Reguła Miary: powyżej mediany = włączone.') && h.includes('pubmed.ncbi.nlm.nih.gov/12080449') && !h.includes('Mediana dotyczy wieku'); });
tryc('mięśnie: Ustawienia, kobieta poniżej mediany: zalecamy wyłączone; wiek poza 18-34 z uwagą o wieku', () => { const h = view('set', GM({ sex: 'K', cm: '165', age: '40', ...FFM('40') })); return h.includes('Mediana w badaniu dla kobiet 18-34 lat: 15,4. Masz mniej niż połowa badanych, więc zalecamy: wyłączone.') && h.includes('Mediana dotyczy wieku 18-34 lat; w badaniu u mężczyzn nie zmieniała się z wiekiem, u kobiet lekko rosła.'); });
tryc('mięśnie: Ustawienia bez FFM: podpowiedź, gdzie wpisać FFM, bez progu', () => { const h = view('set', GM()); return h.includes('Brak pomiaru masy beztłuszczowej (FFM). Wpisz FFM z wagi składu ciała w Mój dzień, Skład ciała, a Miara podpowie ustawienie.') && !h.includes('zalecamy') && !h.includes('Ustaw zalecane'); });
tryc('mięśnie: ręczne ustawienie inne niż zalecane: przycisk „Ustaw zalecane” przywraca zalecenie i automat', () => { const h = view('set', GM({ sex: 'M', cm: '180', muscle: false, muscleAuto: false, goalWay: 'proc', ...FFM('66') })); click({ musclerec: '1' }); return h.includes('Ustaw zalecane') && T.S().muscle === true && T.S().muscleAuto === true && T.S().goalWay === 'talia' && !mainHtml().includes('Ustaw zalecane'); });
// Poprawki po przeglądzie (17.11.2026)
tryc('mięśnie: wzrost startowy to nie dane: muscleRec null, przełącznik bez zmian, w Ustawieniach prośba o wzrost', () => { const h = view('set', GM({ sex: 'M', cm: '180', muscle: false, touched: { kg: true, age: true, goal: true }, ...FFM('66') })); const r = T.muscleRec(), m = T.muscleSync(); return r === null && m === '' && T.S().muscle === false && h.includes('Brak wzrostu. Wpisz wzrost w Ustawieniach, a Miara podpowie ustawienie.') && !h.includes('Brak pomiaru masy beztłuszczowej'); });
tryc('mięśnie: odczyt startowy z Ustawień włącza „Dużo mięśni”', () => { const h = view('set', GM({ sex: 'K', muscle: false, meas: {} })); click({ preset: 'M' }); if (!/Wczytano odczyt/.test(els.toast.innerHTML)) return true; /* wersja publiczna nie ma odczytów startowych; w prywatnej regułę pilnuje sanitizer */ return T.S().muscle === true && T.S().goalWay === 'talia'; });
tryc('mięśnie: stare dane bez muscleAuto: zapisane ręczne „włączone” zostaje ręczne, „wyłączone” albo brak to automat', () => { const a = T.muscleFix({ muscle: true }, { muscle: true }), b = T.muscleFix({ muscle: false }, { muscle: false }), c = T.muscleFix({}, { muscle: false }), d = T.muscleFix({ muscle: true, muscleAuto: true }, { muscle: true, muscleAuto: true }); return a.muscleAuto === false && b.muscleAuto === true && c.muscleAuto === true && d.muscleAuto === true; });
tryc('mięśnie: kopia bez muscleAuto z ręcznym „włączone” zostaje ręczna', () => { view('set', GM()); T.setPending({ app: 'talerz-i-trening', v: 1, created: '2026-11-09T10:00:00Z', noHealth: false, data: { sex: 'K', cm: '165', touched: { ...TA4 }, muscle: true, meas: { [dk(1)]: { ffm: '40' } } } }); click({ bkapply: '1' }); return T.S().muscleAuto === false && T.S().muscle === true; });
tryc('mięśnie: automat po włączeniu mówi o tym komunikatem (zmiana płci)', () => { view('set', GM({ sex: 'M', cm: '180', muscle: false, goalWay: 'proc', ...FFM('66') })); els.toast.innerHTML = ''; click({ sex: 'M' }); return T.S().muscle === true && els.toast.innerHTML.includes('Masa beztłuszczowa powyżej mediany: włączono „Dużo mięśni”, cel liczony z talii. Zmienisz to w Ustawieniach.'); });
tryc('mięśnie: wczytanie kopii z automatem i niską FFM: komunikat kopii zawiera informację o wyłączeniu', () => { view('set', GM()); T.setPending({ app: 'talerz-i-trening', v: 1, created: '2026-11-09T10:00:00Z', noHealth: false, data: { sex: 'K', cm: '165', touched: { ...TA4 }, muscle: true, muscleAuto: true, meas: { [dk(1)]: { ffm: '40' } } } }); els.toast.innerHTML = ''; click({ bkapply: '1' }); const t = els.toast.innerHTML; return T.S().muscle === false && t.includes('Wczytano kopię') && t.includes('poniżej mediany') && t.includes('data-undo'); });
tryc('mięśnie: import ze Skrótu z FFM: komunikat importu zawiera informację o zmianie', () => { view('set', GM({ sex: 'M', cm: '180', muscle: false, meas: {} })); T.S().imp = { date: dk(0), vals: { ffm: '66' } }; els.toast.innerHTML = ''; click({ impsave: '1' }); const t = els.toast.innerHTML; return T.S().muscle === true && t.includes('Zapisano dane ze Skrótu') && t.includes('powyżej mediany'); });
tryc('mięśnie: ta sama rekomendacja drugi raz: jeden komunikat, sposób celu wybrany ręcznie zostaje', () => { view('set', GM({ sex: 'M', cm: '180', muscle: false, goalWay: 'proc', ...FFM('66') })); const m1 = T.muscleSync(); T.S().goalWay = 'bmi'; T.S().muscle = false; const m2 = T.muscleSync(); return m1.includes('powyżej mediany') && m2 === '' && T.S().goalWay === 'bmi' && T.S().muscleAutoLast === true; });
tryc('mięśnie: wiek startowy bez uwagi o wieku', () => { const h = view('set', GM({ sex: 'K', cm: '165', age: '40', touched: { kg: true, cm: true, goal: true }, ...FFM('40') })); return h.includes('zalecamy: wyłączone') && !h.includes('Mediana dotyczy wieku'); });
tryc('mięśnie: FFMI i mediana równe po zaokrągleniu: obie liczby z dwoma miejscami', () => { const h = view('set', GM({ sex: 'M', cm: '180', ...FFM('61.3') })); return h.includes('Twoje FFMI: 18,92 kg/m²') && h.includes('18-34 lat: 18,90.'); });
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
// Rada 11.11.2026, działania 6-7 (plan „Łatwość” 20.11, zadanie 7): pod wyborem jedno zdanie, dłuższe wyjaśnienie i źródła w zwiniętym „Dlaczego?”.
// Nic nie znika: każdy przeniesiony tekst (lista niżej) jest w „Dlaczego?” i nie ma go poza nim.
const WHY_RE = /<details class="fold"[^>]*><summary[^>]*>Dlaczego\?<\/summary>([\s\S]*?)<\/details>/g;
const whyIn = (h) => [...h.matchAll(WHY_RE)].map((m) => m[1]).join(' ');
const whyOut = (h) => h.replace(WHY_RE, '');
const sentN = (t) => t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s+(?=[A-ZĄĆĘŁŃÓŚŹŻ])/).filter(Boolean).length;
const poCo = (h) => [...h.matchAll(/<p class="why"><b>Po co:<\/b>([\s\S]*?)<\/p>/g)].map((m) => m[1]);
const WHY_VIEWS = [['set', {}], ['meals', {}], ['health', {}], ['sos', {}], ['day', { sex: 'K' }]];
tryc('dlaczego: każde „Po co” to jedno zdanie bez źródła, reszta w „Dlaczego?”', () => {
  const bad = [];
  let n = 0;
  for (const [tab, o] of WHY_VIEWS) for (const t of poCo(view(tab, BASE(o)))) { n++; if (sentN(t) !== 1 || /Źródło/.test(t)) bad.push(tab + ': ' + t.replace(/<[^>]+>/g, '').slice(0, 60)); }
  if (bad.length) throw new Error(bad.join(' | '));
  return n >= 6;
});
const MOVED = [
  ['set', {}, 'Redukcja: cel kalorii ok. 20% poniżej zapotrzebowania. Utrzymanie: cel równy zapotrzebowaniu. Przyrost masy: ok. 10% powyżej, 0,25-0,5% masy ciała tygodniowo. Miara proponuje tryb z Twoich danych.'],
  ['set', {}, 'Iraki i in. 2019 (przyrost masy)'],
  ['set', {}, 'WHO: nadwaga od BMI 25, otyłość od 30. NHS: od 23 i 27,5 dla osób pochodzenia azjatyckiego, bliskowschodniego, afrykańskiego i afrykańsko-karaibskiego.'],
  ['set', {}, 'Korekta liczy spoczynek wzorem Mifflina-St Jeora zamiast stałego 1 kcal na kg na godzinę. Dla kobiet zwykle daje niższe wyniki (wniosek z definicji MET, niesprawdzony pomiarem).'],
  ['set', {}, 'Bezpośredniego połączenia nie ma. Fitatu wymienia dane przez Apple Zdrowie, a strona otwarta w przeglądarce nie ma do niego dostępu.'],
  ['set', {}, '2024 Adult Compendium of Physical Activities</a>: siłownia, spinning, joga, obwód.'],
  ['set', {}, 'Wartości odżywcze: typowe wartości z tabel składu, orientacyjne.'],
  ['set', { mode: 'redukcja', goalWay: 'bmi' }, 'dolna część normy (18,5-20) wiązała się z wyższą. Najniżej: BMI 22 w wieku 35-49 lat, 23 w wieku 50-69, 24 w wieku 70-89.'],
  ['meals', {}, 'Przy IO (reguła Miary): porcja co najmniej 20 g białka i do 50 g węglowodanów, przekąska do 20 g.'],
  ['health', {}, 'Ranking pokaże najtańsze źródła na zakupy.'],
  ['health', {}, 'Profil zostaje w tym telefonie; kopia bez danych zdrowotnych go pomija.'],
  ['day', { sex: 'K' }, 'ICHD-3: napady od 2 dni przed do 3. dnia miesiączki w 2 z 3 cykli.'],
  ['mob', {}, 'Źródło nie podaje liczby powtórzeń'],
  ['mob', {}, 'ACSM 2011'],
];
tryc('dlaczego: przeniesione teksty i źródła są w „Dlaczego?”, nie poza nim', () => {
  const gw = T.S().goalWay, md = T.S().mode;
  const bad = MOVED.filter(([tab, o, t]) => { const h = view(tab, BASE(o)); return !whyIn(h).includes(t) || whyOut(h).includes(t); }).map(([tab, , t]) => tab + ': ' + t.slice(0, 50));
  T.S().goalWay = gw; T.S().mode = md; // bez przecieku do kolejnych testów Ustawień
  if (bad.length) throw new Error(bad.join(' | '));
  return true;
});
tryc('dlaczego: „Dlaczego?” zwinięte na starcie (bez atrybutu open)', () => { const h = view('set', BASE()); const f = [...h.matchAll(/<details class="fold"([^>]*)><summary[^>]*>Dlaczego\?/g)]; return f.length >= 4 && f.every((m) => !/\sopen/.test(m[1])); });
tryc('ekran główny: kroki każdego telefonu w zwiniętej sekcji ze źródłem', () => {
  UA(IOS); const h = view('set', BASE()); UA('');
  return /<details class="fold"[^>]*><summary>iPhone \(Safari\)<\/summary>(?:(?!<\/details>)[\s\S])*Do ekranu głównego(?:(?!<\/details>)[\s\S])*support\.apple\.com/.test(h)
    && /<details class="fold"[^>]*><summary>Android \(Chrome\)<\/summary>(?:(?!<\/details>)[\s\S])*Zainstaluj i utwórz skrót(?:(?!<\/details>)[\s\S])*support\.google\.com/.test(h);
});
tryc('Ustawienia: opisy pod przełącznikami po jednym zdaniu', () => { const h = whyOut(view('set', BASE())); return ['Skupienie pokazuje jedną rzecz naraz, bez wskazówek i ruchu; dane zostają przy każdym widoku.', 'Bez animacji w całej Miarze, a w Skupieniu zawsze.', 'Jak długo widać dymek po zapisie.'].every((t) => h.includes(t)); });
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
const VERIFIED = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 15, 17, 18, 19, 28];

// Brzuch obok snu i stresu (mapa, wiersz 28): związek „w tym czasie”, nigdy przyczyna
const GZ = (pairs) => { const g = {}; for (const [n, b] of pairs) g[zk(n)] = { b, n: 1, f: 'uform' }; return g; };
tryc('zdarzenia: 3 dni ze wzdęciem 5+ w 7 dniach to „Więcej dni ze wzdęciem”, 2 dni albo wzdęcie 4 nie', () => {
  const a = evId(ZS({ gut: GZ([[0, 6], [2, 5], [4, 7]]) }), 'brzuch_dni'), b = evId(ZS({ gut: GZ([[0, 6], [2, 5], [4, 4]]) }), 'brzuch_dni');
  return a.length === 1 && a[0].k === D0 && a[0].t === 'Więcej dni ze wzdęciem' && a[0].z.includes('3 dni ze wzdęciem 5 lub więcej') && b.length === 0;
});
tryc('zdarzenia: przy brzuchu „w tym czasie” liczy krótkie noce i dni z ochotą ze stresu, bez słów o przyczynie', () => {
  const s = ZS({ gut: GZ([[0, 6], [1, 5], [2, 7]]), meas: MS([[0, { sleep: '5' }], [3, { sleep: '5,5' }], [4, { sleep: '7' }]]), urges: { [zk(1)]: [{ trig: 'stres' }, { trig: 'stres' }], [zk(5)]: [{ trig: 'nuda' }] } });
  const e = evId(s, 'brzuch_dni')[0], all = e.t + e.x + e.z + e.w;
  return e.w.startsWith('w tym czasie') && e.w.includes('2 krótkie noce') && e.w.includes('1 dzień ze stresem')
    && e.act && e.act.row === 28 && e.act.url === 'https://pubmed.ncbi.nlm.nih.gov/35716771/' && e.act.sila === 'umiarkowane'
    && /związek, nie przyczyna/.test(e.x) && !/z powodu|przez (sen|stres)|powoduj|wywołuj/i.test(all);
});
tryc('zdarzenia: stresujący dzień z dziennika brzucha liczy się razem z ochotą ze stresu, ten sam dzień raz', () => {
  const g = GZ([[0, 6], [1, 5], [2, 7]]); g[zk(3)] = { b: 2, s: 1 }; g[zk(1)].s = 1;
  const e = evId(ZS({ gut: g, urges: { [zk(1)]: [{ trig: 'stres' }] } }), 'brzuch_dni')[0];
  return e.w.includes('2 dni ze stresem');
});
tryc('brzuch: przełącznik „Stresujący dzień” zapisuje tak i nie, z aria-pressed', () => {
  view('day', BASE({ prof: { cond: { gut: true }, pill: '' } })); click({ guts: '1' }); const on = T.S().gut[dk(0)].s === 1 && /data-guts="1" aria-pressed="true"/.test(mainHtml());
  click({ guts: '0' }); return on && T.S().gut[dk(0)].s === 0 && mainHtml().includes('aria-label="Stresujący dzień"');
});
tryc('zdarzenia: inne zdarzenia nie dostają snu i stresu w „w tym czasie”', () => {
  const e = evId(ZS({ meas: MS([[0, { sleep: '5' }], [1, { sleep: '5' }]]) }), 'krotki_sen')[0];
  return !e.w.includes('krótk') && !e.w.includes('stresu');
});
tryc('zdarzenia: „Więcej dni ze wzdęciem” na ekranie Mój dzień ze źródłem', () => {
  view('day', BASE({ gut: Object.fromEntries([0, 1, 2].map((n) => [dk(n), { b: 6, n: 1, f: 'uform' }])) }));
  const h = mainHtml(); return h.includes('Więcej dni ze wzdęciem') && h.includes('pubmed.ncbi.nlm.nih.gov/35716771');
});

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
// Układ (przegląd ekranów 11.11.2026): najpierw to, co zrobić dziś, potem podsumowanie
tryc('układ: Mój dzień zaczyna od listy „Dziś” i bólu głowy, Stan dziś pod nimi', () => {
  const h = view('day', BASE()), f = h.indexOf('<h2>Dziś: '), p = h.indexOf('data-pain="today"'), st = h.indexOf('id="stan"');
  return f > -1 && p > f && st > p;
});
tryc('układ: Zdrowie z ustawionym profilem zaczyna od planu, profil zwinięty z listą wybranych', () => {
  const h = view('health', BASE({ prof: { cond: { hashi: true, gut: true }, pill: '' } })), pl = h.indexOf('id="twojplan"'), pr = h.indexOf('id="profil"');
  const f = h.indexOf('id="fold_profil"'), ch = h.indexOf('data-cond="hashi"');
  return pl > 0 && pr > pl && f > pr && ch > f && /Hashimoto, Wzdęcia i jelita/.test(h.slice(pr, f));
});
// Mniej ramek (11.11.2026): jedno obramowanie na grupę zamiast pudełka na każdy wiersz
tryc('mniej ramek: przełączniki w Ustawieniach w jednym panelu', () => {
  const h = view('set', BASE({ sex: 'K' })), k = h.indexOf('for="korekta"'), l = h.indexOf('id="lip"');
  return k > 0 && l > k && !h.slice(k, l).includes('class="panel"');
});
tryc('mniej ramek: „Twoja zmiana na ten tydzień” i „Co mi utrudnia?” w jednym kafelku', () => {
  const h = view('day', BASE({ krok: null, reviews: { [dk(1)]: { c: 'Herbata o 20:00' } } })), i = h.indexOf('Twoja zmiana na ten tydzień'), j = h.indexOf('data-tab="krok"');
  return i > 0 && j > i && !h.slice(i, j).includes('</div>');
});
// Szybkie wpisy (11.11.2026): rano pomiary pod listą Dziś, brzuch „jak wczoraj”, klawisz Dalej
const MDUE = (o) => BASE({ meas: { [dk(1)]: { w: '80,2', sleep: '7', steps: '7431' } }, ...o });
tryc('szybkie wpisy: bez dzisiejszej wagi albo snu Pomiary dnia są pod listą Dziś, nad Stanem dziś; obwody zostają niżej', () => {
  const h = view('day', MDUE()), d = h.indexOf('<h2>Dziś: '), p = h.indexOf('<h2>Pomiary dnia</h2>'), st = h.indexOf('id="stan"'), ob = h.indexOf('data-fold="obwody"');
  return d > -1 && p > d && st > p && ob > st;
});
tryc('szybkie wpisy: z dzisiejszą wagą i snem Pomiary dnia wracają pod Stan dziś', () => {
  const h = view('day', MDUE({ meas: { [dk(1)]: { w: '80,2' }, [dk(0)]: { w: '80', sleep: '7' } } }));
  return h.indexOf('id="stan"') < h.indexOf('<h2>Pomiary dnia</h2>') && h.split('<h2>Pomiary dnia</h2>').length === 2;
});
tryc('szybkie wpisy: brzuch „jak wczoraj” kopiuje wzdęcie, stolec i wypróżnienia, bez stresu', () => {
  const h = view('day', MDUE({ prof: { cond: { gut: true }, pill: '' }, gut: { [dk(1)]: { b: 4, f: 'uform', n: 1, s: 1 } } }));
  if (!/data-gutcopy="1"[^>]*>Jak wczoraj/.test(h)) return false;
  click({ gutcopy: '1' }); const g = T.S().gut[dk(0)];
  return g.b === 4 && g.f === 'uform' && g.n === 1 && g.s === undefined && !mainHtml().includes('data-gutcopy');
});
tryc('szybkie wpisy: bez wczorajszego wpisu brzucha nie ma „jak wczoraj”', () => !view('day', MDUE({ prof: { cond: { gut: true }, pill: '' }, gut: {} })).includes('data-gutcopy'));
tryc('szybkie wpisy: pola pomiarów mają klawisz Dalej', () => { WP().reset(); const h = view('day', MDUE()), rows = T.wpCfg().rows; return h.includes('id="m_w"') && h.includes('id="m_steps"') && rows.slice(0, -1).every((R) => WP().enterHint(rows, R.key) === 'next') && WP().enterHint(rows, rows[2].key) === 'done'; });
// Dodaj, braki na zakładce, powtórz wczoraj, skróty ikony (11.11.2026)
const tabsH = () => els.tabs.innerHTML, sheetH = () => (els.sheet || { innerHTML: '' }).innerHTML;
const NOW0 = (o) => BASE({ meas: { [dk(1)]: { w: '80,2', sleep: '7' } }, days: {}, ...o });
tryc('dodaj: pasek ma 6 pozycji, „Dodaj” otwiera arkusz zamiast zmiany ekranu', () => {
  view('day', NOW0()); const t = tabsH();
  if ((t.match(/<button/g) || []).length !== 6 || !/data-addsheet="1"[^>]*aria-label="Dodaj wpis"/.test(t)) return false;
  click({ addsheet: '1' }); return T.S().tab === 'day' && /role="dialog"/.test(sheetH()) && sheetH().includes('aria-modal="true"');
});
tryc('dodaj: arkusz prowadzi do wagi, snu, kroków, posiłków i treningu, ból głowy zapisuje od razu', () => {
  view('day', NOW0()); click({ addsheet: '1' }); const h = sheetH();
  return ['data-nav="day#m_w"', 'data-nav="day#m_sleep"', 'data-nav="day#m_steps"', 'data-tab="meals"', 'data-tab="train"', 'data-pain="today"', 'data-sheetclose="1"'].every((x) => h.includes(x));
});
tryc('dodaj: brzuch tylko przy profilu z wzdęciami, „Powtórz wczoraj” tylko gdy wczoraj były posiłki', () => {
  view('day', NOW0()); click({ addsheet: '1' }); const a = sheetH();
  view('day', NOW0({ prof: { cond: { gut: true }, pill: '' }, days: { [dk(1)]: [{ kind: 'm', label: 'Owsianka', k: 400, p: 20, f: 10, c: 50 }] } })); click({ addsheet: '1' }); const b = sheetH();
  return !a.includes('fold_brzuch') && !a.includes('data-repeat') && b.includes('data-nav="day#fold_brzuch#brzuch"') && b.includes('data-repeat="1"');
});
tryc('dodaj: wybór z arkusza zamyka arkusz', () => { view('day', NOW0()); click({ addsheet: '1' }); click({ tab: 'meals' }); return !/role="dialog"/.test(sheetH()) && T.S().tab === 'meals'; });
tryc('braki: zakładka Mój dzień pokazuje, ile z listy Dziś zostało, bez liczby przy 0 i w dzień z bólem', () => {
  view('day', NOW0()); const a = tabsH();
  const full = { [dk(0)]: [1, 2, 3].map((i) => ({ kind: 'm', label: 'p' + i, k: 300, p: 20, f: 10, c: 30 })) };
  view('day', NOW0({ meas: { [dk(0)]: { w: '80', steps: '8000' } }, days: full })); const b = tabsH();
  view('day', NOW0({ pain: { [dk(0)]: {} } })); const c = tabsH();
  return /<span class="badge"[^>]*>3<\/span>/.test(a) && /aria-label="Mój dzień, 3 do zrobienia"/.test(a) && !b.includes('class="badge"') && !c.includes('class="badge"');
});
tryc('powtórz wczoraj: na górze Posiłków, gdy dziś nic nie zapisano, a wczoraj były posiłki', () => {
  const y = { [dk(1)]: [{ kind: 'm', label: 'Owsianka', k: 400, p: 20, f: 10, c: 50 }] };
  const h = view('meals', NOW0({ days: y })), r = h.indexOf('data-repeat="1"'), z = h.indexOf('data-addmeal');
  const n = view('meals', NOW0({ days: { ...y, [dk(0)]: [{ kind: 'm', label: 'x', k: 1, p: 1, f: 1, c: 1 }] } }));
  return r > -1 && (z < 0 || r < z) && /Powtórz wczorajsze posiłki \(1\)/.test(h) && !n.slice(0, n.indexOf('Dziś według planu') + 400).includes('data-repeat');
});
tryc('skróty ikony: manifest ma 3 skróty, adres #dodaj-… otwiera właściwy ekran', () => {
  const m = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8')), u = (m.shortcuts || []).map((x) => x.url);
  view('day', NOW0()); const a = T.quickFromHash('#dodaj-trening') && T.S().tab === 'train'; const b = T.quickFromHash('#dodaj-posilek') && T.S().tab === 'meals'; const c = T.quickFromHash('#dodaj-waga') && T.S().tab === 'day';
  return u.length === 3 && ['./#dodaj-waga', './#dodaj-posilek', './#dodaj-trening'].every((x) => u.includes(x)) && a && b && c && !T.quickFromHash('#cos-innego');
});
tryc('układ: Zdrowie bez profilu zaczyna od wyboru chorób, bez zwinięcia', () => {
  const h = view('health', BASE()); return h.indexOf('id="profil"') < h.indexOf('id="twojplan"') && !h.includes('id="fold_profil"');
});
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
// F2c (plan ADHD §9, 23.11.2026): ochoty z „Mam ochotę coś przekąsić” mają drogę usunięcia w „Zapisane dziś”
const UR = () => BASE({ urges: { [dk(0)]: [{ h: 9, trig: 'stres', out: 'plan' }, { h: 21, trig: 'nuda', out: 'minela' }], [dk(1)]: [{ h: 8, trig: 'glod', out: 'plan' }] } });
tryc('F2c: Zapisane dziś pokazuje dzisiejsze ochoty z przyciskiem usuwania', () => {
  const h = view('day', UR());
  return h.includes('ochoty 2') && (h.match(/data-delurge="\d+"/g) || []).length === 2 && h.includes('aria-label="Usuń ochotę: 21:00, Nuda"');
});
tryc('F2c: usunięcie ochoty zmienia tylko wskazany dzisiejszy wpis', () => {
  view('day', UR()); click({ delurge: '1' }); const S = T.S();
  return S.urges[dk(0)].length === 1 && S.urges[dk(0)][0].trig === 'stres' && S.urges[dk(1)].length === 1 && els.toast.innerHTML.includes('Cofnij');
});
tryc('F2c: ochota bez godziny (stare dane) ma czytelny opis', () => {
  const h = view('day', BASE({ urges: { [dk(0)]: [{ out: 'plan' }] } }));
  return h.includes('aria-label="Usuń ochotę: bez godziny"') && !/undefined|NaN/.test(h.split('data-fold="zapisane"')[1] || '');
});
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

// Prostota Posiłków (rada/2026-11-11_prostota.md, P2): rzadko używane zwinięte, lista przepisów krótsza
const openTag = (h, id) => { const i = h.indexOf(`id="${id}"`); return i < 0 ? '' : h.slice(h.lastIndexOf('<', i), h.indexOf('>', i) + 1); };
tryc('Posiłki: „Zamówione jedzenie” zwinięte; skrót z Mojego dnia je otwiera', () => {
  const t = openTag(view('meals', BASE()), 'zamowione');
  if (!t.startsWith('<details') || /\sopen/.test(t)) throw new Error('nie zwinięte: ' + t);
  const d = view('day', BASE()); if (!d.includes('data-nav="meals#zamowione#zamowione"')) throw new Error('skrót');
  click({ nav: 'meals#zamowione#zamowione' });
  return /\sopen/.test(openTag(mainHtml(), 'zamowione'));
});
tryc('Posiłki: plan dnia bez zdania „Jedno dotknięcie zapisuje posiłek”', () => !view('meals', BASE()).includes('Jedno dotknięcie zapisuje posiłek'));
tryc('Posiłki: 6 przepisów widocznych, reszta w „Pokaż pozostałe (N)”, objaśnienie wartości zwinięte', () => {
  view('meals', BASE({ f: { ...JSON.parse(JSON.stringify(T.DEF().f)), type: 'all' } })); const list = (els.mlist || {}).innerHTML || '';
  const f = list.indexOf('id="fold_mreszta"'), before = f < 0 ? list : list.slice(0, f);
  const n = (before.match(/<article class="meal"/g) || []).length, all = (list.match(/<article class="meal"/g) || []).length;
  if (all <= 6) throw new Error('za mało przepisów do testu: ' + all);
  return n === 6 && f > 0 && list.includes(`Pokaż pozostałe (${all - 6})`) && /id="fold_mlinfo"/.test(list) && !before.includes('Gramatury produktów suchych');
});

// Prostota Ustawień (rada/2026-11-11_prostota.md, P2): jedno krótkie objaśnienie na wybór
const hintsOf = (h) => [...h.matchAll(/<p class="(?:small muted|why)"[^>]*>([\s\S]*?)<\/p>/g)].map((m) => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
tryc('strażnik: każde objaśnienie w Ustawieniach ma najwyżej 30 słów', () => {
  const long = hintsOf(view('set', BASE())).map((t) => t.split(/ Źródł[oa]: /)[0]).filter((t) => t.split(' ').length > 30); // źródła są obowiązkowe, nie liczą się
  if (long.length) throw new Error(long.map((t) => t.split(' ').length + ': ' + t.slice(0, 50)).join(' | '));
  return true;
});
// Ten sam strażnik dla Mojego dnia, Posiłków i Zdrowia (rada mówi, 11.11.2026), w danych zwykłych i w scenariuszach
tryc('strażnik: objaśnienia w Moim dniu, Posiłkach i Zdrowiu mają najwyżej 30 słów', () => {
  const long = [];
  for (const tab of ['day', 'meals', 'health']) for (const s of [BASE(), { ...T.scenS('wszystkie'), tab }, { ...T.scenS('jelita'), tab }])
    for (const t of hintsOf(view(tab, s)).map((x) => x.split(/ Źródł[oa]: /)[0])) if (t.split(' ').length > 30 && !long.includes(tab + ' ' + t)) long.push(tab + ' ' + t);
  if (long.length) throw new Error(long.length + ' za długich: ' + long.map((t) => t.split(' ').length + ': ' + t.slice(0, 70)).join(' | '));
  return true;
});
tryc('Ustawienia: bez zdań, które powtarzają przycisk albo są niesprawdzone', () => {
  const h = view('set', BASE());
  return !h.includes('Każdy zamkniesz przyciskiem') && !h.includes('Ustawienie zostaje w telefonie') && !h.includes('Zaawansowana ochrona danych') && h.includes('Kraj telefonu: progi');
});

// Rutyna mobilności (decyzja 11.11.2026; źródła: ACSM 2011, NHS, CSP, Falk Brekke 2020, metaanaliza lordozy 2022)
const MOBB = (o) => BASE({ mob: { done: {} }, ...o });
tryc('mobilność: 12 ćwiczeń w 3 częściach, każde z dawką i źródłem z listy źródeł', () => {
  const M = T.MOB();
  return M.length === 12 && new Set(M.map((x) => x.part)).size === 3 && M.every((x) => x.id && x.n && x.how && x.dose && T.SRC[x.src]);
});
tryc('mobilność: ekran z częstotliwością, bezpieczeństwem (112) i uczciwym opisem dowodów', () => {
  const h = view('mob', MOBB());
  return h.includes('Co najmniej 2 razy w tygodniu') && h.includes('112') && h.includes('fizjoterapeucie') && h.includes('pubmed.ncbi.nlm.nih.gov/32071772')
    && h.includes('PMC9025799') && !/naprawi|skoryguj|wyleczy|gwarant/i.test(h);
});
tryc('mobilność: odhaczenie ćwiczenia zapisuje dzień i stan aria-pressed', () => {
  view('mob', MOBB()); const id = T.MOB()[0].id; click({ mobex: id });
  const h = view('mob');
  return T.S().mob.done[T.todayKey()].includes(id) && h.includes(`data-mobex="${id}" aria-pressed="true"`);
});
tryc('mobilność: zapis sesji dodaje trening „Mobilność” raz dziennie i liczy sesje w 7 dniach', () => {
  view('mob', MOBB({ days: {} })); click({ mobsave: '1' }); click({ mobsave: '1' });
  const t = (T.S().days[T.todayKey()] || []).filter((e) => e.kind === 't' && e.mob);
  return t.length === 1 && t[0].label.startsWith('Mobilność') && view('mob').includes('1 z 2 sesji w 7 dniach');
});
tryc('mobilność: tytuł ekranu w nagłówku', () => { view('mob', MOBB()); return (els.title || {}).textContent === 'Mobilność'; });
tryc('mobilność: wejście z Treningu, pole w DEF, poza kopią bez danych o zdrowiu', () => view('train', BASE()).includes('data-tab="mob"') && JSON.stringify(T.DEF().mob) === '{"done":{}}' && NH_DROP.includes('mob'));

// Mój plan od specjalisty, wkładki, płaskostopie, ACL (decyzja 11.11.2026, punkty 1-4)
const PLB = (o) => BASE({ mob: { done: {} }, plan: { items: [], done: {} }, insole: { days: {}, pain: {} }, ...o });
const wd = () => new Date().getDay();
tryc('plan: dodanie ćwiczenia od specjalisty z ilością i dniami; dziś widoczne, w inny dzień nie', () => {
  view('mob', PLB()); T.S().tmpPlan = { n: 'Wyprost kolana leżąc', dose: '3 × 10', days: [wd()] }; click({ planadd: '1' });
  const it = T.S().plan.items[0]; const h = view('mob');
  const other = view('mob', PLB({ plan: { items: [{ ...it, days: [(wd() + 1) % 7] }], done: {} } }));
  return !!it && it.n === 'Wyprost kolana leżąc' && it.dose === '3 × 10' && h.includes('Mój plan od specjalisty') && h.includes(`data-planex="${it.id}"`) && !other.includes(`data-planex="${it.id}"`);
});
tryc('plan: odhaczenie ćwiczenia z planu zapisuje dzień; usunięcie ma „Cofnij”', () => {
  const it = { id: 'p1', n: 'Most', dose: '2 × 10', days: [0, 1, 2, 3, 4, 5, 6] };
  view('mob', PLB({ plan: { items: [it], done: {} } })); click({ planex: 'p1' });
  if (!(T.S().plan.done[T.todayKey()] || []).includes('p1')) throw new Error('odhaczenie');
  click({ plandel: 'p1' }); if (T.S().plan.items.length) throw new Error('usunięcie');
  if (!(els.toast || {}).innerHTML.includes('data-undo')) throw new Error('brak Cofnij');
  click({ undo: '1' }); return T.S().plan.items.length === 1;
});
tryc('plan: bez planu podpowiedź, że plan wpisuje się z zaleceń fizjoterapeuty lub podiatry', () => view('mob', PLB()).includes('fizjoterapeuty albo podiatry'));
tryc('wkładki: przy płaskostopiu odhaczenie dnia i ból stopy raz w tygodniu; podsumowanie 28 dni', () => {
  view('mob', PLB({ prof: { cond: { flat: true }, pill: '' } })); click({ insole: '1' }); T.qSet('footpain', 3);
  const h = view('mob');
  return T.S().insole.days[T.todayKey()] === true && T.S().insole.pain[T.todayKey()] === 3 && h.includes('1 z 28 dni we wkładkach') && h.includes('data-insole="1" aria-pressed="true"');
});
tryc('wkładki: bez płaskostopia w profilu sekcji nie ma', () => !view('mob', PLB()).includes('data-insole'));
tryc('profil: płaskostopie i po rekonstrukcji ACL do wyboru', () => { const h = view('health', PLB()); return h.includes('data-cond="flat"') && h.includes('data-cond="acl"'); });
tryc('płaskostopie: w Zdrowiu karta NHS (bez dolegliwości nic nie trzeba, kiedy do lekarza)', () => {
  const h = planOf(view('health', PLB({ prof: { cond: { flat: true }, pill: '' } })));
  return h.includes('Płaskostopie') && h.includes('nie powodują dolegliwości') && h.includes('tylko jednej stopy') && h.includes('nhs.uk/conditions/flat-feet');
});
tryc('ACL: rutyna mobilności ostrzega, plan od specjalisty jest nad rutyną', () => {
  const h = view('mob', PLB({ prof: { cond: { acl: true }, pill: '' } }));
  return h.includes('zapytaj fizjoterapeutę, czy pasują do Twojej fazy') && h.indexOf('Mój plan od specjalisty') < h.indexOf('Biodra i miednica');
});
tryc('plan i wkładki w DEF, poza kopią bez danych o zdrowiu', () => JSON.stringify(T.DEF().plan) === '{"items":[],"done":{}}' && JSON.stringify(T.DEF().insole) === '{"days":{},"pain":{}}' && NH_DROP.includes('plan') && NH_DROP.includes('insole'));

// Strażnik (11.11.2026: nowa planHtml nadpisała plan dnia w Posiłkach): bez dwóch funkcji o tej samej nazwie
tryc('strażnik: każda funkcja w app.js, pet.js i zdarzenia.js ma unikalną nazwę', () => {
  const src = [code, fs.readFileSync(path.join(root, 'pet.js'), 'utf8'), fs.readFileSync(path.join(root, 'zdarzenia.js'), 'utf8')].join(String.fromCharCode(10));
  const names = [...src.matchAll(/^\s*function (\w+)\(/gm)].map((m) => m[1]), dup = [...new Set(names.filter((n, i) => names.indexOf(n) !== i))];
  if (dup.length) throw new Error(dup.join(', '));
  return names.length > 100;
});

// Brzuch i jelita (decyzja 11.11.2026): działania z badań przed wizytą, dziennik, alarmy, dawki tylko ze źródła
// Rozgrzewka w Treningu (plan rada/plany/2026-11-24-rozgrzewka-plan.md, testy 1-6; źródła: mapa powiązań, wiersze 59-62)
const WB = (o) => BASE({ warm: { full: false }, ...o });
const WDONE = (k) => ({ [k]: [{ kind: 't', label: 'Rozgrzewka', min: 6, gross: 0, net: 0, warm: 1 }] });
const nWarm = (h) => (h.match(/data-warmex="/g) || []).length;
tryc('Rozgrzewka 1: karta na górze Treningu także bez planu treningów', () => { const h = view('train', WB()); return h.includes('data-warm="card"') && h.indexOf('data-warm="card"') < h.indexOf('Trening z zegarka'); });
tryc('Rozgrzewka 2: domyślnie krótka (6 ćwiczeń), pełna 9, wybór zapisany w S', () => { const a = nWarm(view('train', WB())); click({ warmmode: 'full' }); const b = nWarm(view('train')); const full = T.S().warm.full === true; click({ warmmode: 'short' }); return a === 6 && b === 9 && full && nWarm(view('train')) === 6; });
tryc('Rozgrzewka 3: każde ćwiczenie ma źródło z mapy (59, 60, 62) albo id z Mobilności', () => { const W = T.WARM(), M = T.MOB().map((x) => x.id), SRC = T.WARM_SRC(); return W.length === 9 && W.filter((x) => x.short).length === 6 && W.every((x) => (x.mob && M.includes(x.mob)) || (SRC[x.src] && [59, 60, 62].includes(SRC[x.src].map))); });
tryc('Rozgrzewka 4: ukończenie zapisuje jedną sesję 0 kcal bez zmiany celu; pominięcie nic nie zapisuje', () => { view('train', WB()); const t0 = T.targetKcal(); click({ warmskip: '1' }); const sk = !(T.S().days[dk(0)] || []).length; click({ warmdone: '1' }); click({ warmdone: '1' }); const d = T.S().days[dk(0)] || []; click({ warmshow: '1' }); return sk && d.length === 1 && d[0].warm === 1 && d[0].gross === 0 && d[0].net === 0 && T.targetKcal() === t0; });
tryc('Rozgrzewka 5: ostrzeżenie „Bez brzuszków” w trybie krótkim i pełnym', () => { const a = view('train', WB()).includes('Bez brzuszków'); return a && view('train', WB({ warm: { full: true } })).includes('Bez brzuszków'); });
tryc('Rozgrzewka 6: po dzisiejszej rozgrzewce jedna linia „Rozgrzewka zrobiona” z „Powtórz”; wczorajsza nie zwija karty', () => { const h = view('train', WB({ days: WDONE(dk(0)) })); const a = h.includes('Rozgrzewka zrobiona') && h.includes('data-warmagain') && nWarm(h) === 0; return a && nWarm(view('train', WB({ days: WDONE(dk(1)) }))) === 6; });
// Źródło klęku (BMC 2024, pełny tekst PMC11515218, sprawdzony 26.11.2026): podwinięcie miednicy „while advancing the pelvis forward”, praca „lower abdominal muscles and gluteus maximus”
tryc('Rozgrzewka 7: klęk zgodny ze źródłem: pośladek i dół brzucha, miednica lekko do przodu, bez zakazu przesuwania bioder', () => { const w = T.WARM().find((x) => x.id === 'w_biodro'); return !!w && /dół brzucha/.test(w.how) && /lekko do przodu/.test(w.how) && /nie wyginając dołu pleców/.test(w.how) && !/zamiast przesuwać/.test(w.how); });
// Decyzja 24.11.2026: rozgrzewka nie liczy się jako ruch dnia (karta Dziś, nawyk „trening”, punkty, liczba treningów, „po treningu”)
const WRM = { kind: 't', label: 'Rozgrzewka', min: 6, gross: 0, net: 0, warm: 1 }, TRN = { kind: 't', label: 'Siłownia', min: 45, gross: 300, net: 200 };
const ruchOn = (h) => /<button class="opt hab on"[^>]*>(?:(?!<\/button>)[\s\S])*Ruch: trening/.test(h);
tryc('Rozgrzewka nie jest ruchem dnia: karta Dziś nie odhacza „Ruch”, zwykły trening odhacza', () => { const a = ruchOn(view('day', BASE({ days: { [dk(0)]: [WRM] }, meas: {} }))); const b = ruchOn(view('day', BASE({ days: { [dk(0)]: [TRN] }, meas: {} }))); return !a && b; });
tryc('Rozgrzewka nie jest ruchem dnia: punkty dnia jak bez wpisu, zwykły trening daje punkty', () => { view('day', BASE({ days: { [dk(0)]: [] }, meas: {}, hab: {} })); const p0 = T.dayPts(dk(0)); view('day', BASE({ days: { [dk(0)]: [WRM] }, meas: {}, hab: {} })); const p1 = T.dayPts(dk(0)); view('day', BASE({ days: { [dk(0)]: [TRN] }, meas: {}, hab: {} })); return p1 === p0 && T.dayPts(dk(0)) > p0; });
// Decyzja 24.11.2026: mobilność też nie liczy się jako ruch dnia; ekran Mobilności nie obiecuje „liczy się w Moim dniu”
const MOBE = { kind: 't', label: 'Mobilność (rutyna)', min: 10, gross: 0, net: 0, mob: 1 };
tryc('Mobilność nie jest ruchem dnia: karta Dziś nie odhacza „Ruch”', () => !ruchOn(view('day', BASE({ days: { [dk(0)]: [MOBE] }, meas: {} }))));
tryc('Mobilność nie jest ruchem dnia: punkty dnia jak bez wpisu', () => { view('day', BASE({ days: { [dk(0)]: [] }, meas: {}, hab: {} })); const p0 = T.dayPts(dk(0)); view('day', BASE({ days: { [dk(0)]: [MOBE] }, meas: {}, hab: {} })); return T.dayPts(dk(0)) === p0; });
tryc('Mobilność: po zapisie sesji ekran nie mówi, że liczy się jako ruch dnia', () => { const h = view('mob', MOBB({ days: { [dk(0)]: [MOBE] } })); return h.includes('Dzisiejsza sesja zapisana') && !h.includes('Liczy się w Moim dniu') && h.includes('nie zalicza ruchu dnia'); });
// Decyzja 24.11.2026: zmiana liczenia działa wstecz, więc karta zwierzaka mówi o niej raz (tylko osobom z wpisem rozgrzewki lub mobilności) i znika po „Rozumiem”
const RNOTE = 'Od 24.11 Mobilność i rozgrzewka nie liczą się jako ruch dnia';
tryc('Notka o ruchu dnia: widoczna przy zwierzaku, gdy był wpis mobilności', () => view('day', BASE({ days: { [dk(1)]: [MOBE] }, meas: {}, ruchNote: 0 })).includes(RNOTE));
tryc('Notka o ruchu dnia: „Rozumiem” chowa ją na stałe', () => { view('day', BASE({ days: { [dk(1)]: [WRM] }, meas: {}, ruchNote: 0 })); click({ ruchnote: '1' }); return !!T.S().ruchNote && !view('day', {}).includes(RNOTE); });
tryc('Notka o ruchu dnia: bez wpisów rozgrzewki i mobilności jej nie ma', () => !view('day', BASE({ days: { [dk(1)]: [TRN] }, meas: {}, ruchNote: 0 })).includes(RNOTE));
const GUT = (o) => BASE({ prof: { cond: { gut: true }, pill: '' }, gut: {}, ...o });
tryc('jelita: profil ma „Wzdęcia i jelita”; Zdrowie: alarmy NHS, co robić teraz, środki z dawką i źródłem', () => {
  if (!view('health', BASE()).includes('data-cond="gut"')) throw new Error('profil');
  const h = planOf(view('health', GUT()));
  return h.includes('krew w stolcu') && h.includes('112') && h.includes('1,5 l') && h.includes('ponad 10 g dziennie') && h.includes('co najmniej 4 tygodnie')
    && h.includes('2-3 kiwi') && h.includes('dojelitowe') && h.includes('0,5-1,5 g') && h.includes('po rozmowie z lekarzem')
    && h.includes('pubmed.ncbi.nlm.nih.gov/41081513') && h.includes('nhs.uk/conditions/bloating') && !/wyleczy|na pewno|gwarant/i.test(h);
});
tryc('jelita: przy Hashimoto odstęp suplementów od lewotyroksyny, przy Yaz ulotka przy wymiotach i biegunce', () => {
  const h = planOf(view('health', GUT({ prof: { cond: { gut: true, hashi: true }, pill: 'yaz' } })));
  return h.includes('lewotyroksyn') && h.includes('wymiot') && h.includes('ulotk');
});
tryc('jelita: dziennik w Moim dniu (wzdęcie 0-10, stolec, wypróżnienia), zwinięty; bez profilu go nie ma; ukryty w trybie dyskretnym', () => {
  const a = view('day', GUT()), b = view('day', BASE()), c = view('day', GUT({ discreet: true }));
  return a.includes('id="fold_brzuch"') && a.includes('id="q_rgutb"') && a.includes('data-gutf="luzny"') && a.includes('data-gutn="0"') && !b.includes('fold_brzuch') && !c.includes('fold_brzuch');
});
tryc('jelita: wpis dziennika i podsumowanie 28 dni; lista na wizytę z liczbami i pytaniami o alarmy', () => {
  view('day', GUT()); T.qSet('gutb', 7); click({ gutf: 'twardy' }); click({ gutn: '0' });
  const g = T.S().gut[T.todayKey()];
  if (!(g && g.b === 7 && g.f === 'twardy' && g.n === 0)) throw new Error('wpis ' + JSON.stringify(g));
  const d = view('day'), v = view('visit');
  return d.includes('1 z 28 dni z wzdęciem 5 lub więcej') && v.includes('Brzuch') && v.includes('krew w stolcu');
});
tryc('jelita: pole gut w DEF, poza kopią bez danych o zdrowiu', () => JSON.stringify(T.DEF().gut) === '{}' && NH_DROP.includes('gut'));
tryc('plan od specjalisty przyjmuje każde zalecenie (nie tylko ćwiczenie)', () => view('mob', BASE({ plan: { items: [], done: {} } })).includes('Zalecenie'));

tryc('scenariusz jelita: profil z wzdęciami, 14 dni dziennika, karta w Zdrowiu', () => { const s = T.scenS('jelita'); const d = view('day', s); return !!T.SCEN.jelita && s.prof.cond.gut && Object.keys(s.gut).length >= 14 && d.includes('id="fold_brzuch"') && view('health', { ...T.scenS('jelita'), tab: 'health' }).includes('Środki z badań'); });
tryc('jelita: olejek miętowy z monografii EMA: dawka, pora, czas, interakcje, przeciwwskazania', () => { const h = planOf(view('health', GUT())); return ['0,2-0,4 ml', '0,6-1,2 ml', '30 minut przed posiłkiem', 'w całości', '3 miesiące', 'leki zobojętniające', 'kamica żółciowa', 'ema.europa.eu'].every((x) => h.includes(x)) && !h.includes('dawka według ulotki'); });
// Ścieżka kamieni (rada/2026-11-11_zwierzak-droga.md): kamień za zaliczony tydzień celu, przeszkody to pogoda, nic nie przepada
tryc('kamienie: PET.path rysuje 7 kamieni, opis tekstem, nowe jezioro po 7', () => {
  const a = sandbox.PET.path(3, '', 'Kluska'), b = sandbox.PET.path(9, '', 'Kluska');
  return (a.match(/class="stone[ "]/g) || []).length === 7 && a.includes('Kluska jest na 3. kamieniu z 7') && a.includes('Jezioro 1')
    && b.includes('Jezioro 2') && b.includes('na 2. kamieniu z 7') && a.includes('role="img"');
});
tryc('kamienie: kamień przybywa raz za każdy zaliczony tydzień celu i nie znika po przerwie', () => {
  const m = Object.fromEntries([1, 2, 3, 4, 5, 6, 7].map((n) => [dk(n), { w: '80' }]));
  view('pet', BASE({ pet: { kind: 'gaska', name: 'Kluska', since: dk(30) }, cel: { id: 'zapisy', since: dk(7) }, meas: m }));
  view('pet'); const n1 = (T.S().pet.stones || []).length;
  view('pet', { meas: {} }); const n2 = (T.S().pet.stones || []).length;
  return n1 === 1 && n2 === 1 && mainHtml().includes('na 1. kamieniu z 7');
});
tryc('kamienie: dzień z bólem to wiatr i odpoczynek, krótkie noce to mgła; bez słów o porażce', () => {
  const w = sandbox.PET.path(2, 'wiatr', 'Kluska'), f = sandbox.PET.path(2, 'mgla', 'Kluska');
  return w.includes('odpoczywa na kamieniu') && f.includes('Mgła') && !/przegr|porażk|spad|traci/i.test(w + f);
});
tryc('kamienie: skok tylko bez ograniczenia ruchu', () => /prefers-reduced-motion: ?no-preference\)[^@]*\.stone/.test(appCss));
// Jezioro w nowym stylu (rada/plany/2026-11-20-jezioro-brief.md): kamienie z cieniowaniem, postać na kamieniu, jezioro zależne od numeru, pogoda
const JP = (...a) => sandbox.PET.path(...a);
const svgOf = (h) => (h.match(/<svg[\s\S]*<\/svg>/) || [''])[0];
tryc('jezioro: na kamieniu stoi mała postać właściwego gatunku (nastrój spokój), bez osobnej etykiety obrazka', () => ['gaska', 'kaczka', 'kapibara', 'kotek'].every((k) => {
  const s = svgOf(JP(3, '', 'Kluska', k)); return (s.match(/class="stonepet pet-[a-z]+/g) || []).length === 1 && s.includes('class="stonepet pet-' + k) && /data-stone="3"/.test(s) && s.includes('class="zw-head"') && !s.includes('zw-shut') && (s.match(/role="img"/g) || []).length === 1;
}) && JP(3, '', 'A', 'x"><b>').includes('stonepet pet-gaska') && JP(3, '', 'A').includes('stonepet pet-gaska'));
tryc('jezioro: przebyte kamienie wyraźniejsze (done), kolejne jaśniejsze (next), kamień zwierzaka now; 0 to brzeg, kolejne jezioro od 1. kamienia', () => {
  const s = svgOf(JP(3, '', 'Kluska', 'kotek')), z = svgOf(JP(0, '', 'Kluska', 'kotek')), e = svgOf(JP(9, '', 'Kluska', 'kotek'));
  return (s.match(/class="stone done/g) || []).length === 3 && (s.match(/class="stone next/g) || []).length === 4 && (s.match(/class="stone done now/g) || []).length === 1
    && /data-stone="0"/.test(z) && (z.match(/class="stone next/g) || []).length === 7 && /data-stone="2"/.test(e) && JP(0, '', 'Kluska').includes('Kluska stoi na brzegu');
});
tryc('jezioro: kamienie z gradientem z tokenów i konturem, identyfikatory gradientów unikalne na stronie', () => {
  const a = svgOf(JP(3, '', 'K', 'kotek')), b = svgOf(JP(3, '', 'K', 'kotek')), ids = (s) => [...s.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const all = ids(a).concat(ids(b));
  return all.length >= 2 && new Set(all).size === all.length && /<radialGradient[^>]*>[\s\S]*var\(--zw-stone/.test(a) && /class="stone done[^"]*"[^>]*fill="url\(#/.test(a) && [...a.matchAll(/fill="url\(#([^)]+)\)"/g)].every((m) => ids(a).includes(m[1]));
});
tryc('jezioro: wygląd zależy od numeru jeziora (odcień wody i rośliny), trzy warianty po kolei', () => {
  const v = (n) => (svgOf(JP(n, '', 'K', 'gaska')).match(/class="lake lake-v(\d)"/) || [])[1];
  const plants = (n) => [...svgOf(JP(n, '', 'K', 'gaska')).matchAll(/class="(trzcina|kaczeniec|grzybien|sitowie|lisc)[ "]/g)].map((m) => m[1]).sort().join();
  return v(3) === '0' && v(10) === '1' && v(17) === '2' && v(24) === '0' && new Set([plants(3), plants(10), plants(17)]).size === 3 && plants(3).includes('trzcina') && plants(3).includes('kaczeniec');
});
tryc('jezioro: wiatr pochyla trzcinę i dodaje smugi, mgła to półprzezroczysta warstwa; w obu zwierzak odpoczywa (zamknięte oczy), kamienie zostają', () => {
  const w = svgOf(JP(4, 'wiatr', 'K', 'kapibara')), f = svgOf(JP(4, 'mgla', 'K', 'kapibara')), o = svgOf(JP(4, '', 'K', 'kapibara'));
  return (w.match(/class="wind"/g) || []).length >= 2 && /class="trzcina[^"]*"[^>]*transform="[^"]*rotate\(/.test(w) && !/class="wind"/.test(o) && !/rotate\(/.test((o.match(/<g class="trzcina[^>]*>/) || [''])[0])
    && /class="fog"/.test(f) && !/class="fog"/.test(o) && w.includes('zw-shut') && f.includes('zw-shut') && !o.includes('zw-shut')
    && [w, f, o].every((s) => (s.match(/class="stone[ "]/g) || []).length === 7 && (s.match(/class="stone done/g) || []).length === 4);
});
tryc('jezioro: podskok na nowym kamieniu tylko z flagą hop; teksty i opis dla czytnika bez zmian', () => {
  const h = JP(2, '', 'Mruczek', 'kotek', true), n = JP(2, '', 'Mruczek', 'kotek', false);
  return /class="stonepet pet-kotek hop"/.test(h) && !/ hop"/.test(n) && n.includes('aria-label="Mruczek jest na 2. kamieniu z 7. Jezioro 1."') && n.includes('<p><b>Jezioro 1.</b> Mruczek jest na 2. kamieniu z 7.</p>') && n.includes('Przerwa niczego nie zabiera.');
});
tryc('jezioro: ekran zwierzaka przekazuje gatunek; podskok raz po przybyciu kamienia (pathSeen), potem bez', () => {
  const S = BASE({ pet: { kind: 'kapibara', name: 'A', since: dk(30), stones: ['a', 'b'], pathSeen: 0 } });
  const a = view('pet', S), seen = T.S().pet.pathSeen, b = view('pet');
  return a.includes('stonepet pet-kapibara hop') && seen === 2 && b.includes('stonepet pet-kapibara') && !b.includes('stonepet pet-kapibara hop');
});
tryc('jezioro: ruch (podskok, fala) tylko przy prefers-reduced-motion: no-preference; tokeny jeziora w obu motywach, kontury co najmniej 3:1', () => {
  const noPref = [...sysCss.matchAll(/@media \(prefers-reduced-motion: ?no-preference\)\{((?:[^{}]*\{[^}]*\})*)\}/g)].map((m) => m[1]).join(' ');
  const outside = sysCss.replace(/@media \(prefers-reduced-motion: ?no-preference\)\{(?:[^{}]*\{[^}]*\})*\}/g, '');
  const moving = [...outside.matchAll(/([^{}]+)\{([^}]*)\}/g)].filter((m) => /\.stone|\.lake|\.wave|\.wind/.test(m[1]) && /animation/.test(m[2]));
  const b = themeBlocks(), hex = (blk, n) => (blk.match(new RegExp('--' + n + ':(#[0-9A-Fa-f]{6})')) || [])[1];
  const L = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const cr = (a, c) => { const x = L(a), y = L(c); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const lines = ['zw-stone-ln', 'zw-lake-ln', 'zw-reed-ln'], ok = [b.light, b.dark, b.darkMq].every((blk) => lines.every((n) => hex(blk, n) && cr(hex(blk, n), hex(blk, 'surface')) >= 3));
  if (moving.length) throw new Error(moving.map((m) => m[1].trim()).join(' | '));
  return /\.stonepet\.hop/.test(noPref) && /\.wave/.test(noPref) && ok;
});

// Zgłoszenie 13.11.2026: makro i błonnik bez wchodzenia w posiłek; dane europejskie (Frida 6.1, CoFID), progi z rozporządzenia UE 1924/2006
const FIBF = () => { const S = T.S(); S.f.carb = '1'; S.f.portion = 1; };
tryc('błonnik: każdy składnik ma wartość z tabeli poza mieszanką warzyw', () => Object.entries(T.ING).every(([k, i]) => k === 'warzywa' ? i.fib === undefined : typeof i.fib === 'number' && i.fib >= 0));
tryc('błonnik: wartości z Fridy i CoFID (płatki, soczewica, siemię, hummus)', () => T.ING.platki.fib === 10.3 && T.ING.soczewica.fib === 18.5 && T.ING.siemie.fib === 30.4 && T.ING.hummus.fib === 4.9 && T.ING.kurczak_piers.fib === 0);
tryc('błonnik: macros liczy błonnik i zaznacza brak danych składnika', () => { const a = T.macros(M('o4'), 1, 1), b = T.macros(M('o1'), 1, 1); return Math.abs(a.fib - (200 * 1.4 + 200 * 3) / 100) < 0.01 && a.fibNA === false && b.fibNA === true && b.fib > 0; });
tryc('błonnik: plan dnia pokazuje makro i błonnik przy każdym posiłku', () => { FIBF(); const h = view('meals', BASE()); const n = (h.match(/class="pmac"/g) || []).length; return n === T.planIds().length && /class="pmac"[^]*?B\s\d+\sg[^]*?T\s\d+\sg[^]*?W\s\d+\sg[^]*?Bł\s\d+\+?\sg/.test(h); });
tryc('błonnik: makro w planie czytane pełnymi słowami', () => { FIBF(); const h = view('meals', BASE()); return /class="pmac"><span aria-hidden="true">[^<]*Bł[^<]*<\/span><span class="sr">[^<]*białko \d+ g, tłuszcz \d+ g, węglowodany \d+ g, błonnik (co najmniej )?\d+ g<\/span>/.test(h); });
tryc('błonnik: podsumowanie planu z błonnikiem i odniesieniem 25 g', () => { FIBF(); const h = view('meals', BASE()); return /Plan dnia: [^<]*błonnika[^<]*25 g/.test(h); });
tryc('błonnik: lista przepisów ma błonnik w wierszu makro', () => { FIBF(); view('meals', BASE()); return /class="mnum"[^]*?class="b"[^>]*>Bł \d+\+? g/.test(els.mlist.innerHTML); });
tryc('błonnik: oznaczenia z progów UE na 100 kcal', () => T.MEALS.filter((m) => m.t).every((m) => { const x = T.macros(m, 1, 1), t = T.mealTags(m, x).map((y) => y[0]), r = x.fib / x.k * 100; return (r >= 3) === t.includes('Dużo błonnika') && (r >= 1.5 && r < 3) === t.includes('Źródło błonnika'); }) && T.MEALS.some((m) => T.mealTags(m, T.macros(m, 1, 1)).some((y) => /błonnika/.test(y[0]))));
tryc('błonnik: lista zakupów i zamówione jedzenie pod listą przepisów', () => { FIBF(); const h = view('meals', BASE()); const a = h.indexOf('id="mlist"'); return a > 0 && h.indexOf('id="zakupy"') > a && h.indexOf('id="zamowione"') > a && h.indexOf('Albo wybierz sam') < a; });
tryc('błonnik: dodany posiłek zapisuje błonnik', () => { FIBF(); view('meals', BASE()); click({ addmeal: 'o4' }); const d = T.S().days[dk(0)] || [], e = d[d.length - 1]; return e && Math.abs(e.fib - 8.8) < 0.01 && !e.fibNA; });
tryc('błonnik: Stan dziś pokazuje błonnik dnia z 25 g', () => { const h = view('day', BASE({ days: { [dk(0)]: [{ kind: 'm', label: 'a', k: 500, p: 30, f: 10, c: 50, fib: 12 }] } })); return /błonnik 12 g z 25 g/.test(h); });
tryc('błonnik: wpis bez danych o błonniku daje „co najmniej”', () => { const h = view('day', BASE({ days: { [dk(0)]: [{ kind: 'm', label: 'a', k: 500, p: 30, f: 10, c: 50, fib: 12 }, { kind: 'm', label: 'Szybki wpis', k: 200, p: 0, f: 0, c: 0 }] } })); return /błonnik co najmniej 12 g z 25 g/.test(h); });
tryc('błonnik: źródła w spisie (Frida, CoFID, EFSA, UE 1924/2006)', () => ['frida', 'cofid', 'efsaFib', 'eu1924'].every((k) => T.SRC[k] && /^https:\/\//.test(T.SRC[k][0])));

// Zgłoszenie 13.11.2026: jak w CV, słabo widoczne kropki · zamienione na kreskę |, znaczniki w wierszu z czasem
// Wyjątek (20.11.2026): napis przycisku, który reaguje, „✓ Zjedzone · Cofnij” z briefu przycisków (ten sam wzorzec co „✓ Zapisane · Cofnij” w karcie „Dziś”)
tryc('separatory: ekran Posiłki bez kropek środkowych poza napisem „✓ … · Cofnij”, makro w planie rozdzielone kreską', () => { const h = view('meals', BASE()).replace(/<button class="btn ab[^"]*"[\s\S]*?<\/button>/g, ''); return !h.includes('·') && /kcal \| B\u00a0\d+\u00a0g \| T\u00a0\d+\u00a0g \| W\u00a0\d+\u00a0g \| Bł\u00a0/.test(h); });
tryc('separatory: znaczniki przepisu w wierszu z czasem, po kresce', () => { view('meals', BASE()); return /<div class="meta">[^<]*\d+ min[^<]*<span class="msep"><span aria-hidden="true"> \| <\/span><span class="sr">, <\/span><\/span><span class="mtag"/.test(els.mlist.innerHTML) && !els.mlist.innerHTML.includes('class="mtags"'); });
// Sygnały brzucha (sygnaly.js, docs/specs/2026-11-13-sygnaly-brzuch-design.md): moduł liczy z podanego stanu i dnia k.
const Y = () => sandbox.SYG;
const YS = (o) => ({ gut: {}, labs: [], prof: { cond: { gut: true } }, discreet: false, wizyta: { hp: 'brak' }, sygSeen: {}, ...o });
const gd = (n, f) => { const g = {}; for (let i = 0; i < n; i++) g[Y().back(D0, i)] = f(i); return g; };
tryc('sygnaly: moduł ma ocen, LVL, back', () => !!Y() && typeof Y().ocen === 'function' && Y().LVL.join() === '112,wkrotce,badanie,sam' && Y().back('2026-03-01', 1) === '2026-02-28');
tryc('sygnaly: bez cond.gut pusta lista', () => Y().ocen(YS({ prof: { cond: {} }, gut: { [D0]: { a: ['krew'] } } }), D0).length === 0);
tryc('sygnaly: krew dziś = alarm 112 pierwszy', () => { const r = Y().ocen(YS({ gut: { [D0]: { a: ['krew'], u: ['piecze'] } } }), D0); return r[0].id === 'alarm' && r[0].lvl === '112'; });
tryc('sygnaly: krew wczoraj, dziś nic = bez alarmu', () => !Y().ocen(YS({ gut: { [Y().back(D0, 1)]: { a: ['krew'] } } }), D0).some((x) => x.id === 'alarm'));
tryc('sygnaly: wymkrew i bol też alarm', () => ['wymkrew', 'bol'].every((a) => Y().ocen(YS({ gut: { [D0]: { a: [a] } } }), D0)[0].id === 'alarm'));
tryc('sygnaly: polyk 6 dni temu = pilne, 7 dni temu nie', () => Y().ocen(YS({ gut: { [Y().back(D0, 6)]: { a: ['polyk'] } } }), D0).some((x) => x.id === 'pilne') && !Y().ocen(YS({ gut: { [Y().back(D0, 7)]: { a: ['polyk'] } } }), D0).some((x) => x.id === 'pilne'));
tryc('sygnaly: objaw z żołądka i g45 = gastro45 (wkrotce)', () => { const r = Y().ocen(YS({ prof: { cond: { gut: true }, g45: true }, gut: { [D0]: { u: ['pelnosc'] } } }), D0); return r.some((x) => x.id === 'gastro45' && x.lvl === 'wkrotce'); });
tryc('sygnaly: tryb dyskretny ukrywa wszystko poza dzisiejszym alarmem', () => { const s = YS({ discreet: true, prof: { cond: { gut: true }, g45: true }, gut: { [D0]: { a: ['krew'], u: ['piecze'] } } }); return Y().ocen(s, D0).map((x) => x.id).join() === 'alarm'; });
tryc('sygnaly: stary wpis bez u i a nie psuje', () => Y().ocen(YS({ gut: gd(28, () => ({ b: 2, f: 'uform', n: 1 })) }), D0).length === 0);
check('index.html: sygnaly.js po zdarzenia.js', /zdarzenia\.js[\s\S]*sygnaly\.js[\s\S]*app\.js/.test(html));
check('sw.js: sygnaly.js', swSrc.includes("'./sygnaly.js'"));

const hpU = (n, extra) => YS({ gut: gd(16, (i) => (i < n ? { u: ['piecze'], b: 1 } : { b: 1 })), ...extra });
tryc('sygnaly: 8 dni z żołądkiem z 28 przy 16 wpisach = hp_test', () => Y().ocen(hpU(8), D0).some((x) => x.id === 'hp_test' && x.rm));
tryc('sygnaly: 7 dni = bez hp_test', () => !Y().ocen(hpU(7), D0).some((x) => x.id === 'hp_test'));
tryc('sygnaly: 13 dni z wpisem = bez hp_test, jest zapisuj', () => { const s = YS({ gut: gd(13, () => ({ u: ['piecze'] })) }); const r = Y().ocen(s, D0).map((x) => x.id); return !r.includes('hp_test') && r.includes('zapisuj'); });
tryc('sygnaly: g45 zamienia hp_test na gastro45', () => { const r = Y().ocen(hpU(8, { prof: { cond: { gut: true }, g45: true } }), D0).map((x) => x.id); return !r.includes('hp_test') && r.includes('gastro45'); });
tryc('sygnaly: hp wykl wycisza hp_*, nie celiakia', () => { const s = YS({ wizyta: { hp: 'wykl' }, prof: { cond: { gut: true }, nlpz: true, rodzRak: true }, gut: gd(16, () => ({ u: ['piecze'], b: 6 })) }); const r = Y().ocen(s, D0).map((x) => x.id); return !r.some((i) => i.startsWith('hp_')) && r.includes('celiakia'); });
tryc('sygnaly: nlpz i objaw = hp_nlpz; rodzRak = hp_rodz', () => { const r = Y().ocen(YS({ prof: { cond: { gut: true }, nlpz: true, rodzRak: true }, gut: { [D0]: { u: ['zgaga'] } } }), D0).map((x) => x.id); return r.includes('hp_nlpz') && r.includes('hp_rodz'); });
tryc('sygnaly: celiakia przy 8 dniach wzdęcia 5+ lub luźnego', () => Y().ocen(YS({ gut: gd(16, (i) => (i < 4 ? { b: 5 } : i < 8 ? { f: 'luzny' } : { b: 1 })) }), D0).some((x) => x.id === 'celiakia'));
tryc('sygnaly: Hashimoto i 1 dzień wzdęcia 5+ = celiakia', () => Y().ocen(YS({ prof: { cond: { gut: true, hashi: true } }, gut: { [D0]: { b: 7 } } }), D0).some((x) => x.id === 'celiakia'));
tryc('sygnaly: ferrytyna 12,5 poniżej lo 15 i objaw = zelazo; bez lo nie', () => { const g = { [D0]: { b: 6 } }; const a = Y().ocen(YS({ gut: g, labs: [{ test: 'ferr', date: D0, val: '12,5', lo: '15' }] }), D0).some((x) => x.id === 'zelazo'); const b = Y().ocen(YS({ gut: g, labs: [{ test: 'ferr', date: D0, val: '5' }] }), D0).some((x) => x.id === 'zelazo'); return a && !b; });
tryc('sygnaly: ferrytyna: liczy się ostatni wynik po dacie', () => !Y().ocen(YS({ gut: { [D0]: { b: 6 } }, labs: [{ test: 'ferr', date: '2026-01-01', val: '5', lo: '15' }, { test: 'ferr', date: '2026-10-01', val: '40', lo: '15' }] }), D0).some((x) => x.id === 'zelazo'));
tryc('sygnaly: hp leczone = hp_kontrola', () => Y().ocen(YS({ wizyta: { hp: 'leczone' } }), D0).some((x) => x.id === 'hp_kontrola'));
tryc('sygnaly: objaw z żołądka w 7 dniach = sam_zoladek (sam)', () => Y().ocen(YS({ gut: { [Y().back(D0, 3)]: { u: ['piecze'] } } }), D0).some((x) => x.id === 'sam_zoladek' && x.lvl === 'sam'));
tryc('sygnaly: Przeczytane ukrywa na 14 dni, alarmu nie', () => { const s = YS({ sygSeen: { sam_zoladek: Y().back(D0, 13), alarm: D0 }, gut: { [D0]: { u: ['piecze'], a: ['krew'] } } }); const v = Y().visible(s, D0).map((x) => x.id); s.sygSeen.sam_zoladek = Y().back(D0, 14); const w = Y().visible(s, D0).map((x) => x.id); return !v.includes('sam_zoladek') && v.includes('alarm') && w.includes('sam_zoladek'); });
tryc('sygnaly: fix odrzuca nieznane wartości i uzupełnia braki', () => { const s = Y().fix({ gut: { [D0]: { u: ['piecze', 'x'], a: 'krew' } }, wizyta: { hp: 'zle' }, prof: { g45: 'tak' } }); return s.gut[D0].u.join() === 'piecze' && Array.isArray(s.gut[D0].a) && s.gut[D0].a.length === 0 && s.wizyta.hp === 'brak' && s.prof.g45 === false && typeof s.sygSeen === 'object' && Array.isArray(s.wizList); });
tryc('sygnaly: teksty bez odstaw, masz, dysbioza', () => { const all = [YS({ prof: { cond: { gut: true, hashi: true }, nlpz: true, rodzRak: true }, gut: gd(16, () => ({ u: ['piecze'], b: 6, a: ['krew', 'polyk'] })), labs: [{ test: 'ferr', date: D0, val: '5', lo: '15' }] }), YS({ prof: { cond: { gut: true }, g45: true }, wizyta: { hp: 'leczone' }, gut: gd(13, () => ({ u: ['piecze'] })) })].flatMap((s) => Y().ocen(s, D0)); return all.length >= 10 && all.every((x) => !/odstaw|\bmasz\b|dysbioz/i.test([x.t, x.x, x.d, ...x.co].join(' '))); });

tryc('sygnaly: niemożliwa data w sygSeen nie wycisza', () => { const s = YS({ sygSeen: { sam_zoladek: '2026-99-99' }, gut: { [D0]: { u: ['piecze'] } } }); const v = Y().visible(s, D0).some((x) => x.id === 'sam_zoladek'); Y().fix(s); return v && !('sam_zoladek' in s.sygSeen); });
tryc('sygnały wejście: chipy Z żołądka i Objawy alarmowe w dzienniku, przełączanie wielokrotne, brak w trybie dyskretnym', () => {
  const a = view('day', GUT()), c = view('day', GUT({ discreet: true }));
  if (!(a.includes('data-gutu="piecze"') && a.includes('data-gutu="pelnosc"') && a.includes('data-gutu="zgaga"') && a.includes('data-guta="krew"') && a.includes('data-guta="wymioty"') && a.includes('Z żołądka') && a.includes('Objawy alarmowe') && a.includes('krew w stolcu lub czarny stolec'))) throw new Error('brak chipów');
  if (c.includes('data-guta') || c.includes('data-gutu')) throw new Error('dyskretny');
  click({ guta: 'krew' }); click({ guta: 'bol' }); const g = T.S().gut[T.todayKey()];
  if (JSON.stringify(g.a) !== '["krew","bol"]') throw new Error('a ' + JSON.stringify(g.a));
  const d = view('day', { discreet: false }); if (!d.includes('data-guta="krew" aria-pressed="true"')) throw new Error('aria');
  click({ guta: 'krew' }); click({ guta: 'bol' }); click({ gutu: 'zgaga' }); click({ gutu: 'zgaga' });
  const h = T.S().gut[T.todayKey()]; return h.a.length === 0 && h.u.length === 0;
});
tryc('sygnały wejście: przełączniki profilu g45, nlpz, rodzRak tylko przy cond.gut; klik przełącza boolean', () => {
  const a = view('health', GUT({ tab: 'health' })), b = view('health', BASE({ tab: 'health' }));
  if (!(a.includes('data-gprof="g45"') && a.includes('data-gprof="nlpz"') && a.includes('data-gprof="rodzRak"') && a.includes('45 lat lub więcej'))) throw new Error('brak');
  if (b.includes('data-gprof')) throw new Error('bez gut');
  click({ gprof: 'nlpz' }); const on = T.S().prof.nlpz === true; click({ gprof: 'nlpz' }); return on && !T.S().prof.nlpz;
});
tryc('sygnały wejście: DEF ma wizyta, sygSeen, wizList', () => { const D = T.DEF(); return D.wizyta && D.wizyta.hp === 'brak' && JSON.stringify(D.sygSeen) === '{}' && JSON.stringify(D.wizList) === '[]'; });
tryc('sygnały wejście: wynik ferrytyny z dolną granicą zapisuje lo, bez granicy brak lo', () => {
  view('labs', BASE({ labs: [], labSel: 'ferr' }));
  els.l_val = { value: '9,5' }; els.l_date = { value: '2026-11-10' }; els.l_unit = { value: 'ng/ml' }; els.l_fast = { checked: false }; els.l_lo = { value: '15' };
  click({ labsave: '1' }); const x = T.S().labs[0];
  els.l_lo = { value: '' }; click({ labsave: '1' }); const y = T.S().labs[1];
  return x.lo === '15' && x.val === '9.5' && y && !('lo' in y);
});
tryc('sygnały wejście: formularz wyniku ma pole l_lo', () => view('labs', BASE()).includes('id="l_lo"'));
// Sygnały brzucha, zadanie 6: dymek zwierzaka, alarm 112, karta zastępcza, karta w Zdrowiu, „Co ustalił lekarz?”
const HPG = () => { const g = {}; for (let i = 0; i < 16; i++) g[dk(i)] = i < 8 ? { u: ['piecze'] } : { b: 1 }; return g; };
const SYGB = (h) => (h.match(/<div class="petsay[^]*?<\/div><\/div>/) || [''])[0];
tryc('sygnały dymek: alarm dziś ze zwierzakiem ma role=alert, tel:112, pet-alert, bez Przeczytane', () => {
  T.setSygAl('');
  const h = view('day', GUT({ gut: { [dk(0)]: { a: ['krew'] } } }));
  return h.includes('role="alert"') && h.includes('href="tel:112"') && h.includes('pet-alert') && h.includes('albo jedź na SOR') && !h.includes('data-sygseen') && !h.includes('data-sygwiz');
});
tryc('sygnały dymek: alarm bez zwierzaka = note warn z tel:112, bez maskotki', () => {
  T.setSygAl('');
  const h = view('day', GUT({ pet: null, gut: { [dk(0)]: { a: ['krew'] } } }));
  return /<div class="note warn" role="alert">[^]*href="tel:112"/.test(h) && !h.includes('pet-alert') && !h.includes('class="petsay');
});
tryc('sygnały dymek: hp_test ma Dane, reguła Miary, przyciski; jeden dymek na ekranie', () => {
  const h = view('day', GUT({ gut: HPG() })), b = SYGB(h);
  return b.includes('Dane') && b.includes('reguła Miary') && b.includes('data-sygwiz="hp_test"') && b.includes('data-sygseen="hp_test"') && b.includes('data-sygsrc="hp_test"') && b.includes('pet-ok') && h.split('class="petsay').length === 2;
});
tryc('sygnały dymek: Przeczytane ukrywa dymek, Dodaj do listy bez duplikatów (przełącznik)', () => {
  view('day', GUT({ gut: HPG(), wizList: [] }));
  click({ sygwiz: 'hp_test' }); click({ sygwiz: 'hp_test' }); click({ sygwiz: 'hp_test' });
  if (JSON.stringify(T.S().wizList) !== '["hp_test"]') throw new Error('wizList ' + JSON.stringify(T.S().wizList));
  click({ sygseen: 'hp_test' });
  return T.S().sygSeen.hp_test === T.todayKey() && !mainHtml().includes('data-sygseen="hp_test"');
});
tryc('sygnały dymek: Źródło i szczegóły przechodzi do Zdrowia', () => { view('day', GUT({ gut: HPG() })); click({ sygsrc: 'hp_test' }); return T.S().tab === 'health' && mainHtml().includes('id="syg_hp_test"'); });
tryc('sygnały dymek: imię zwierzaka escapowane', () => {
  const b = SYGB(view('day', GUT({ pet: { ...PETA, name: '<i>Z</i>' }, gut: HPG() })));
  return b.includes('<b>&lt;i&gt;Z&lt;/i&gt;:</b>') && !b.includes('<i>Z</i>');
});
tryc('sygnały Zdrowie: karta sygnałów z kotwicą, mikrobiom, Co ustalił lekarz', () => {
  const h = view('health', GUT({ tab: 'health', gut: HPG() }));
  return h.includes('id="syg_hp_test"') && h.includes('id="syg_sam_zoladek"') && h.includes('Sygnały z Twoich wpisów') && h.includes('Testy mikrobiomu') && h.includes('Co ustalił lekarz?') && h.includes('data-hp="wykl"') && h.includes('pubmed.ncbi.nlm.nih.gov/39647502') && h.includes('termedia.pl');
});
tryc('sygnały Zdrowie: bez sygnałów komunikat; bez cond.gut brak karty', () => view('health', GUT({ tab: 'health', gut: {} })).includes('Brak sygnałów z ostatnich 28 dni.') && !view('health', BASE({ tab: 'health' })).includes('Co ustalił lekarz?'));
tryc('sygnały Zdrowie: klik data-hp ustawia wizyta, ponowny resetuje', () => {
  view('health', GUT({ tab: 'health', gut: HPG(), wizyta: { hp: 'brak' } }));
  click({ hp: 'wykl' }); const w = T.S().wizyta;
  if (!(w.hp === 'wykl' && w.d === T.todayKey() && mainHtml().includes('data-hp="wykl" aria-pressed="true"'))) throw new Error('wykl');
  click({ hp: 'wykl' }); return T.S().wizyta.hp === 'brak';
});
tryc('sygnały: „jak wczoraj” nie kopiuje objawów alarmowych', () => {
  view('day', MDUE({ prof: { cond: { gut: true }, pill: '' }, gut: { [dk(1)]: { b: 5, a: ['krew'] } } }));
  click({ gutcopy: '1' }); const g = T.S().gut[dk(0)];
  return g && !('a' in g) && !sandbox.SYG.ocen(T.S(), T.todayKey()).some((x) => x.id === 'alarm') && !mainHtml().includes('tel:112');
});
const NODUE = (o) => GUT({ meas: { [dk(1)]: { w: '80,2' }, [dk(0)]: { w: '80', sleep: '7' } }, ...o });
tryc('sygnaly: dymek tuż przed Brzuch dziś także bez pomiarów na górze', () => {
  const h = view('day', NODUE({ gut: { [dk(0)]: { a: ['krew'] } } }));
  if (h.includes('<h2>Pomiary dnia</h2>') && h.indexOf('<h2>Pomiary dnia</h2>') < h.indexOf('id="stan"')) throw new Error('due');
  return /<div class="petsay[^]*?<\/div><\/div>\s*<details class="fold" id="fold_brzuch"/.test(h) && h.split('class="petsay').length === 2;
});
tryc('sygnaly: alarm w trybie dyskretnym na początku Mojego dnia', () => {
  T.setSygAl('');
  const h = view('day', NODUE({ discreet: true, gut: { [dk(0)]: { a: ['krew'] } } }));
  return h.includes('role="alert"') && h.includes('href="tel:112"') && !h.includes('id="fold_brzuch"') && h.split('class="petsay').length === 2 && h.indexOf('class="petsay') < h.indexOf('id="stan"');
});
// Sygnały brzucha, zadanie 7: lista na wizytę
const FD = (k) => k.slice(8, 10) + '.' + k.slice(5, 7) + '.' + k.slice(0, 4);
const VG = (o) => { const g = HPG(); g[dk(3)] = { ...g[dk(3)], a: ['krew', 'polyk'] }; return GUT({ prof: { cond: { gut: true }, pill: '', nlpz: true }, gut: g, wizList: ['sam_zoladek'], ...o }); };
const VTXT = (h) => h.replace(/<[^>]+>/g, '\n');
tryc('lista na wizytę: sygnały brzucha, data alarmu, pytania, nlpz', () => {
  const t = VTXT(view('visit', VG()));
  return t.includes('Objawy alarmowe: ' + FD(dk(3)) + ' (krew w stolcu lub czarny stolec, trudność z połykaniem)') && t.includes('Do omówienia: ') && t.includes('Biorę regularnie ibuprofen lub aspirynę.') && t.includes('Do omówienia: Co możesz zrobić sam przy żołądku') && !/dysbioz/i.test(t) && !t.includes('Rak żołądka');
});
tryc('lista na wizytę: Do omówienia z hp_test i bez duplikatów', () => {
  const t = VTXT(view('visit', VG({ wizList: ['hp_test', 'sam_zoladek', 'sam_zoladek'] }))), L = t.split('\n').filter((x) => x.startsWith('Do omówienia:'));
  return L.length >= 2 && new Set(L).size === L.length && L.filter((x) => x.includes('Co możesz zrobić sam')).length === 1;
});
tryc('lista na wizytę: id z wizList bez aktywnego sygnału pomijane', () => !VTXT(view('visit', VG({ wizList: ['zelazo'] }))).includes('Niski wynik ferrytyny'));
tryc('lista na wizytę: bez cond.gut brak sygnałów brzucha', () => { const t = VTXT(view('visit', BASE({ prof: { cond: {}, pill: '', nlpz: true }, gut: HPG(), wizList: ['sam_zoladek'] }))); return !t.includes('Do omówienia') && !t.includes('Biorę regularnie') && !t.includes('Objawy alarmowe'); });
tryc('lista na wizytę: rodzRak i ferrytyna poniżej zakresu z datą', () => {
  const t = VTXT(view('visit', VG({ prof: { cond: { gut: true }, pill: '', rodzRak: true }, labs: [{ id: 'f1', test: 'ferr', date: dk(2), val: '5', lo: '15' }] })));
  return t.includes('Rak żołądka u rodzica, rodzeństwa lub dziecka.') && t.includes('Ferrytyna poniżej zakresu z wydruku (' + FD(dk(2)) + ').') && !t.includes('Biorę regularnie');
});
tryc('lista na wizytę: ekran escapuje linie', () => { const h = view('visit', VG()); return !/<script|<img/.test(h) && T.esc('<b>') === '&lt;b&gt;'; });
check('wyniki: notatki bez wiedzy ogólnej i niesprawdzonych', T.LABS.every(l => !/wiedza ogólna|niesprawdzone/i.test(l.note || '')) && T.LABS.every(l => !l.note || !l.src || T.SRC[l.src]));
// Poprawki po przeglądzie końcowym (13.11.2026)
tryc('sygnały: tryb dyskretny, karta w Zdrowiu pokazuje pilne, dymek w Mój dzień tylko alarm', () => {
  const o = { discreet: true, gut: { [dk(0)]: { a: ['polyk'] } } };
  const hz = view('health', GUT(o)), hd = view('day', GUT(o));
  return hz.includes('id="syg_pilne"') && !hd.includes('Trudność z połykaniem') && !hd.includes('class="petsay syg"');
});
tryc('sygnały: tryb dyskretny, lista na wizytę ma „Do omówienia” dla pilne', () => VTXT(view('visit', GUT({ discreet: true, gut: { [dk(0)]: { a: ['polyk'] } } }))).includes('Do omówienia: Trudność z połykaniem lub częste wymioty'));
tryc('sygnały: ocen z all:true ignoruje discreet, bez all nadal tylko alarm', () => { const s = YS({ discreet: true, gut: { [D0]: { a: ['polyk'] } } }); return Y().ocen(s, D0).length === 0 && Y().ocen(s, D0, { all: true }).some((x) => x.id === 'pilne') && Y().visible(s, D0, { all: true }).some((x) => x.id === 'pilne'); });
tryc('sygnały: hp_test co[0] dosłownie jak x', () => { const s = YS({ gut: gd(16, () => ({ u: ['piecze'] })) }), h = Y().ocen(s, D0).find((x) => x.id === 'hp_test'); return !!h && h.co[0] === h.x; });
tryc('sygnały: wyjątek w SYG.fix nie rusza stanu (syFix)', () => {
  const orig = sandbox.SYG.fix; let r = false;
  try { sandbox.SYG.fix = () => { throw new Error('x'); }; const s = { a: 1 }; r = vm.runInContext('syFix', sandbox)(s) === s; } finally { sandbox.SYG.fix = orig; }
  return r;
});
tryc('sygnały: etykieta pewności reguły Miary bez numeru, wytyczna bez zmian', () => { const h = view('day', GUT({ gut: HPG(), sygSeen: {} })), g = view('health', GUT({ gut: { [dk(0)]: { a: ['polyk'] } } }));return SYGB(h).includes('reguła Miary') && !/reguła Miary \(/.test(h) && g.includes('z wytycznej'); });
tryc('sygnały: dni z pustym u:[] nie liczą się jako dni z wpisem', () => { const s = YS({ gut: gd(16, (i) => (i < 8 ? { u: ['piecze'] } : { u: [] })) }), ids = Y().ocen(s, D0).map((x) => x.id); return !ids.includes('hp_test') && ids.includes('zapisuj'); });
tryc('sygnały: alarm Dane tylko z zaznaczonych objawów', () => {
  const a = Y().ocen(YS({ gut: { [D0]: { a: ['krew'] } } }), D0).find((x) => x.id === 'alarm');
  const b = Y().ocen(YS({ gut: { [D0]: { a: ['bol', 'krew'] } } }), D0).find((x) => x.id === 'alarm');
  return !!a && a.d === 'Dziś: krew w stolcu lub czarny stolec' && !!b && b.d.includes('krew w stolcu lub czarny stolec') && b.d.includes('nagły silny ból brzucha lub w klatce') && !b.d.includes('wymiot');
});
tryc('sygnały dymek: hp_test bez powtórzonego zdania, sam_zoladek bez pustego Działania', () => {
  const g = {}; for (let i = 0; i < 16; i++) g[dk(i)] = { u: ['piecze'] };
  const b = SYGB(view('day', GUT({ gut: g, sygSeen: {}, labs: [] })));
  const g2 = {}; for (let i = 0; i < 3; i++) g2[dk(i)] = { u: ['piecze'] };
  const b2 = SYGB(view('day', GUT({ gut: g2, sygSeen: {}, labs: [] })));
  const z = view('health', GUT({ tab: 'health', gut: g }));
  return b.split('Ustal z lekarzem przerwę').length === 2 && !b.includes('Działanie:') && b2.includes('Śpij z uniesioną głową') && b2.split('Śpij z uniesioną głową').length === 2 && !b2.includes('Działanie:') && z.split('Ustal z lekarzem przerwę').length >= 3;
});
// Przyciski, które reagują (20.11.2026, plan „Łatwość” pkt 6): Zjem, trening, wynik badania, zamówione, Według planu.
// Wspólny automat WPISY.actBtn (ten sam co główny przycisk karty „Dziś”): zapis → „✓ … · Cofnij” w oknie wpGrace → „… jeszcze raz / kolejny”;
// drugie dotknięcie w 700 ms nic nie robi; Cofnij usuwa dokładnie dodany wpis; licznik na zakładce od razu
const MCOUNT = (id) => (T.S().days[dk(0)] || []).filter((e) => e.kind === 'm' && e.id === id).length;
const AGO = (key, ms) => { T.acts()[key].at -= ms; };
const ACLR = () => { const a = T.acts(); Object.keys(a).forEach((k) => delete a[k]); };
const BADGE = () => { const m = /data-tab="day" aria-label="Mój dzień(?:, (\d+) do zrobienia)?"/.exec((els.tabs || {}).innerHTML || ''); return m ? +(m[1] || 0) : -1; };
const TRW0 = (o) => ({ ...T.S().tr, wmin: '', wk: '', min: '45', cat: 'silownia', ...o });
const SR0 = () => String((els.sr || {}).textContent || '').split('. ')[0];
tryc('przyciski: WPISY.actBtn, wszystkie przejścia (zapis, okno Cofnij, blokada 700 ms, po oknie, „do zamknięcia”)', () => {
  const A = WP().actBtn, L = { idle: 'Zjem', done: '✓ Zjedzone · Cofnij', again: 'Zjem jeszcze raz', grace: 5000 }, x = (o) => { const r = A({ ...L, ...o }); return r.st + '|' + r.label + '|' + r.tap; };
  const G = 'grace|✓ Zjedzone · Cofnij|', AG = 'again|Zjem jeszcze raz|save';
  const c = [[{ ms: null }, 'idle|Zjem|save'], [{ ms: Infinity }, 'idle|Zjem|save'], [{ ms: null, saved: true }, AG], [{ ms: 0 }, G + 'skip'], [{ ms: 699 }, G + 'skip'], [{ ms: 700 }, G + 'undo'],
    [{ ms: 4999 }, G + 'undo'], [{ ms: 5000 }, AG], [{ ms: 5000, saved: true }, AG], [{ ms: 6000, grace: 8000 }, G + 'undo'], [{ ms: 9e9, grace: Infinity }, G + 'undo'], [{ ms: 100, grace: 0 }, G + 'skip'], [{ ms: 5001, grace: 0 }, AG]];
  const bad = c.filter(([o, e]) => x(o) !== e); if (bad.length) throw new Error(JSON.stringify(bad.map(([o]) => [o, x(o)])));
  const src = fs.readFileSync(path.join(root, 'wpisy.js'), 'utf8'), at = (f, n) => src.slice(src.indexOf(f), src.indexOf(f) + n);
  return /actBtn\(/.test(at('function mainLabel(', 400)) && /actBtn\(/.test(at('function mainClick(', 300)) && !/lastCommit < AGAIN/.test(src) && /actBtn/.test(at('globalThis.WPISY', 600));
});
tryc('przyciski: Zjem → „✓ Zjedzone · Cofnij” → „Zjem jeszcze raz”; drugie dotknięcie w 700 ms nic nie robi; Cofnij usuwa dokładnie dodany wpis', () => {
  ACLR(); const id = T.planIds()[0], k = 'meal:' + id, old = { kind: 'm', id: 'x9', label: 'inne', k: 50, p: 0, f: 0, c: 0 };
  view('meals', BASE({ days: { [dk(0)]: [old] } })); els.toast.innerHTML = '';
  if (ABL(mainHtml(), k) !== 'Zjem') throw new Error('start ' + ABL(mainHtml(), k));
  click({ addmeal: id, ab: k });
  if (MCOUNT(id) !== 1 || ABL(mainHtml(), k) !== '✓ Zjedzone · Cofnij' || SR0() !== '✓ Zjedzone · Cofnij') throw new Error('zapis ' + ABL(mainHtml(), k) + ' / ' + SR0());
  if (toastHtml().includes('Dodano do dnia')) throw new Error('komunikat zamiast przycisku');
  click({ addmeal: id, ab: k }); if (MCOUNT(id) !== 1) throw new Error('podwójne dotknięcie');
  AGO(k, 1000); click({ addmeal: id, ab: k });
  const d = T.S().days[dk(0)];
  if (MCOUNT(id) !== 0 || d.length !== 1 || d[0] !== old || ABL(mainHtml(), k) !== 'Zjem' || SR0() !== 'Zjem') throw new Error('cofnij ' + JSON.stringify(d) + ' ' + SR0());
  click({ addmeal: id, ab: k }); AGO(k, 6000); view('meals', {});
  return MCOUNT(id) === 1 && ABL(mainHtml(), k) === 'Zjem jeszcze raz' && !mainHtml().includes('data-uneat') && !mainHtml().includes('aria-pressed="true">✓');
});
tryc('przyciski: Zjem przy dwóch takich samych wpisach cofa tylko nowy; trzeci posiłek od razu zmienia licznik na zakładce', () => {
  ACLR(); const id = T.planIds()[0], k = 'meal:' + id, e = (kc) => ({ kind: 'm', id, label: 'x', k: kc, p: 0, f: 0, c: 0 }), a = e(100), b = { kind: 'm', label: 'inne', k: 50, p: 0, f: 0, c: 0 };
  view('meals', BASE({ days: { [dk(0)]: [a, b] }, meas: {} }));
  if (ABL(mainHtml(), k) !== 'Zjem jeszcze raz') throw new Error('zjedzone wcześniej: ' + ABL(mainHtml(), k));
  const n0 = BADGE(); click({ addmeal: id, ab: k }); const n1 = BADGE();
  AGO(k, 1000); click({ addmeal: id, ab: k }); const d = T.S().days[dk(0)];
  return n1 === n0 - 1 && BADGE() === n0 && d.length === 2 && d[0] === a && d[1] === b && ABL(mainHtml(), k) === 'Zjem jeszcze raz';
});
tryc('przyciski: przepis i lista dań: ten sam automat („Zjem, zapisz”, „Dodaj do dnia”), po oknie „Zjem jeszcze raz”', () => {
  ACLR(); const id = 'o1', k = 'meal:' + id, e = { kind: 'm', id, label: 'x', k: 100, p: 0, f: 0, c: 0 };
  const r0 = view('recipe', BASE({ recipe: id, days: {} })), r1 = view('recipe', BASE({ recipe: id, days: { [dk(0)]: [e] } }));
  if (!(ABL(r0, k) && r0.includes(`data-addmeal="${id}"`) && ABL(r1, k) === 'Zjem jeszcze raz' && r1.includes(`data-addmeal="${id}"`))) throw new Error('przepis ' + ABL(r0, k) + ' / ' + ABL(r1, k));
  view('meals', BASE({ days: {} })); const mid = T.filtered()[0].m.id; click({ toggle: mid });
  if (ABL(els.mlist.innerHTML, 'meal:' + mid) !== 'Dodaj do dnia') throw new Error('lista ' + ABL(els.mlist.innerHTML, 'meal:' + mid));
  click({ addmeal: mid, ab: 'meal:' + mid });
  click({ toggle: mid }); click({ toggle: mid });
  return ABL(els.mlist.innerHTML, 'meal:' + mid) === '✓ Zjedzone · Cofnij';
});
tryc('przyciski: trening „Dodaj do dnia” → „✓ Zapisano · Cofnij” → „Dodaj kolejny”; licznik na zakładce od razu; Cofnij usuwa dokładnie dodany wpis', () => {
  ACLR(); WP().reset(); view('train', BASE({ days: {}, meas: {}, tr: TRW0({ min: '45' }) })); els.toast.innerHTML = '';
  const n0 = BADGE(); if (ABL(mainHtml(), 'train') !== 'Dodaj do dnia') throw new Error('start');
  click({ addtrain: '1', ab: 'train' });
  if (nE() !== 1 || ABL(mainHtml(), 'train') !== '✓ Zapisano · Cofnij' || BADGE() !== n0 - 1 || SR0() !== '✓ Zapisano · Cofnij' || toastHtml().includes('Dodano do dnia')) throw new Error('zapis ' + BADGE() + '/' + n0);
  click({ addtrain: '1', ab: 'train' }); if (nE() !== 1) throw new Error('podwójne dotknięcie');
  AGO('train', 1000); click({ addtrain: '1', ab: 'train' });
  if (nE() !== 0 || BADGE() !== n0 || ABL(mainHtml(), 'train') !== 'Dodaj do dnia') throw new Error('cofnij');
  click({ addtrain: '1', ab: 'train' }); AGO('train', 6000); view('train', {});
  return nE() === 1 && ABL(mainHtml(), 'train') === 'Dodaj kolejny';
});
tryc('przyciski: trening z zegarka → „✓ Zapisano · Cofnij” → „Dodaj kolejny”; nowy zapis kończy okno innego przycisku; Cofnij oddaje wpisane kalorie', () => {
  ACLR(); WP().reset(); const t0 = { kind: 't', label: 'wcześniej', min: 20, gross: 100, net: 60 };
  view('train', BASE({ days: { [dk(0)]: [t0] }, tr: TRW0({ min: '45', wmin: '45', wk: '400' }) }));
  click({ addtrain: '1', ab: 'train' }); click({ addwatch: '1', ab: 'watch' });
  if (nE() !== 3 || ABL(mainHtml(), 'watch') !== '✓ Zapisano · Cofnij' || ABL(mainHtml(), 'train') !== 'Dodaj kolejny' || T.S().tr.wk !== '') throw new Error('zapis ' + nE() + ' ' + ABL(mainHtml(), 'watch') + ' ' + T.S().tr.wk);
  AGO('watch', 1000); click({ addwatch: '1', ab: 'watch' }); const d = T.S().days[dk(0)];
  if (!(d.length === 2 && d[0] === t0 && d[1].label !== 'Trening z zegarka' && T.S().tr.wk === '400' && ABL(mainHtml(), 'watch') === 'Dodaj trening z zegarka')) throw new Error('cofnij ' + JSON.stringify(d));
  click({ addwatch: '1', ab: 'watch' }); AGO('watch', 6000); view('train', {});
  return ABL(mainHtml(), 'watch') === 'Dodaj kolejny';
});
tryc('przyciski: „Zapisz wynik” → „✓ Zapisano · Cofnij” → „Dodaj następny wynik” z tą samą datą i jednostką; Cofnij usuwa dokładnie ten wynik i oddaje wpisaną wartość', () => {
  ACLR(); const old = { id: 'a1', test: 'tsh', date: '2026-10-01', val: '2', unit: 'mIU/l' };
  view('labs', BASE({ labs: [old], labSel: 'tsh' })); els.toast.innerHTML = '';
  if (ABL(mainHtml(), 'lab') !== 'Zapisz wynik') throw new Error('start');
  const fill = () => { els.l_val = { value: '2,5' }; els.l_date = { value: '2026-11-10' }; els.l_unit = { value: 'mIU/ml' }; els.l_fast = { checked: false }; els.l_lo = { value: '' }; };
  fill(); click({ labsave: '1', ab: 'lab' });
  const h = mainHtml();
  if (T.S().labs.length !== 2 || ABL(h, 'lab') !== '✓ Zapisano · Cofnij' || toastHtml().includes('Zapisano wynik')) throw new Error('zapis');
  if (!/id="l_date" value="2026-11-10"/.test(h) || !/id="l_unit" value="mIU\/ml"/.test(h)) throw new Error('data i jednostka');
  click({ labsave: '1', ab: 'lab' }); if (T.S().labs.length !== 2) throw new Error('podwójne dotknięcie');
  AGO('lab', 1000); click({ labsave: '1', ab: 'lab' });
  if (!(T.S().labs.length === 1 && T.S().labs[0] === old && /id="l_val" value="2,5"/.test(mainHtml()) && ABL(mainHtml(), 'lab') === 'Zapisz wynik')) throw new Error('cofnij');
  fill(); click({ labsave: '1', ab: 'lab' }); AGO('lab', 6000); const h2 = view('labs', {});
  return ABL(h2, 'lab') === 'Dodaj następny wynik' && /id="l_date" value="2026-11-10"/.test(h2) && !/id="l_val" value=/.test(h2);
});
tryc('przyciski: zamówione i „Według planu” z tym samym automatem; Cofnij usuwa dokładnie dodane wpisy', () => {
  ACLR(); view('meals', ORDB({ days: {} })); T.S().days = {};
  click({ ordsave: '1', ab: 'ord' }); if (nE() !== 1 || ABL(mainHtml(), 'ord') !== '✓ Zapisano · Cofnij') throw new Error('zamówione ' + ABL(mainHtml(), 'ord'));
  AGO('ord', 1000); click({ ordsave: '1', ab: 'ord' }); if (nE() !== 0 || ABL(mainHtml(), 'ord') !== 'Zapisz zamówione') throw new Error('zamówione cofnij');
  const b = { kind: 'm', label: 'inne', k: 50, p: 0, f: 0, c: 0 };
  view('day', { ...CLEAN(), days: { [dk(0)]: [] }, once: true, pet: { ...PETA }, petSeen: [...SEEN_ALL], guide: { ...HID } }); T.S().days[dk(0)].push(b);
  click({ dayplan: '1', ab: 'plan' }); const n = nE();
  if (n < 2 || ABL(mainHtml(), 'plan') !== '✓ Zapisano · Cofnij') throw new Error('plan ' + n + ' ' + ABL(mainHtml(), 'plan'));
  AGO('plan', 1000); click({ dayplan: '1', ab: 'plan' }); const d = T.S().days[dk(0)];
  return d.length === 1 && d[0] === b;
});
tryc('przyciski: stała szerokość (miarka ze wszystkich napisów, ukryta przed czytnikiem), napisy miarki w <i data-l> (btnSel bez zmian)', () => {
  ACLR(); const h = view('train', BASE({ days: {} })), m = /<button class="btn ab"[^>]*data-ab="train"[^>]*>(.*?)<\/button>/.exec(h);
  return !!m && /<span class="act-z" aria-hidden="true">(<i data-l="[^"]+"><\/i>){3}<\/span>/.test(m[1]) && /\.btn\.ab\{[^}]*display:inline-grid/.test(sysCss) && /\.act-z\{[^}]*visibility:hidden/.test(sysCss) && /\.act-z i::before\{content:attr\(data-l\)/.test(sysCss);
});
// Rada P2 (15.11.2026): alarm ogłaszany raz dziennie; kolejne przerysowania tego dnia jako region „Pilne”
tryc('alarm: pierwsze wyświetlenie dnia role=alert, kolejne role=region aria-label=Pilne (ze zwierzakiem)', () => {
  T.setSygAl(''); const o = { gut: { [dk(0)]: { a: ['krew'] } } };
  const a = view('day', GUT(o)), b = view('day', GUT(o));
  return /<div class="petsay syg alert"[^>]*role="alert"/.test(a) && /<div class="petsay syg alert"[^>]*role="region" aria-label="Pilne"/.test(b) && !b.includes('role="alert"') && b.includes('href="tel:112"');
});
tryc('alarm: bez zwierzaka note warn także ogłaszana raz, potem region Pilne', () => {
  T.setSygAl(''); const o = { pet: null, gut: { [dk(0)]: { a: ['krew'] } } };
  const a = view('day', GUT(o)), b = view('day', GUT(o));
  return /<div class="note warn"[^>]*role="alert"/.test(a) && /<div class="note warn"[^>]*role="region" aria-label="Pilne"/.test(b) && !b.includes('role="alert"') && b.includes('href="tel:112"');
});
// Rada P2 (15.11.2026): lista na wizytę jako przełącznik w dymku i w Zdrowiu; czyszczenie pytań po wizycie z „Cofnij”
const WIZON = (h, id) => h.includes(`data-sygwiz="${id}" aria-pressed="true">✓ Na liście na wizytę<`);
const WIZOFF = (h, id) => h.includes(`data-sygwiz="${id}" aria-pressed="false">Dodaj do listy na wizytę<`);
tryc('lista na wizytę: dymek przełącza dodanie i usunięcie, aria-pressed', () => {
  const h0 = SYGB(view('day', GUT({ gut: HPG(), wizList: [], sygSeen: {} })));
  if (!WIZOFF(h0, 'hp_test')) throw new Error('start');
  click({ sygwiz: 'hp_test' });
  if (JSON.stringify(T.S().wizList) !== '["hp_test"]' || !WIZON(SYGB(mainHtml()), 'hp_test')) throw new Error('dodanie');
  click({ sygwiz: 'hp_test' });
  return JSON.stringify(T.S().wizList) === '[]' && WIZOFF(SYGB(mainHtml()), 'hp_test');
});
tryc('lista na wizytę: karta w Zdrowiu ma przełącznik dla badanie i sam, nie dla alarmu', () => {
  const g = HPG(); g[dk(0)] = { ...g[dk(0)], a: ['krew'] };
  const h0 = view('health', GUT({ tab: 'health', gut: g, wizList: [] }));
  if (!(WIZOFF(h0, 'hp_test') && WIZOFF(h0, 'sam_zoladek') && !h0.includes('data-sygwiz="alarm"'))) throw new Error('start');
  click({ sygwiz: 'sam_zoladek' });
  if (!WIZON(mainHtml(), 'sam_zoladek') || JSON.stringify(T.S().wizList) !== '["sam_zoladek"]') throw new Error('dodanie');
  click({ sygwiz: 'sam_zoladek' });
  return WIZOFF(mainHtml(), 'sam_zoladek') && T.S().wizList.length === 0;
});
tryc('lista na wizytę: „Wyczyść pytania po wizycie” tylko z pytaniami, czyści z „Cofnij”', () => {
  if (view('visit', VG({ wizList: [] })).includes('data-wizclear')) throw new Error('pusta lista z przyciskiem');
  const h = view('visit', VG({ wizList: ['hp_test', 'sam_zoladek'] }));
  if (!h.includes('data-wizclear="1"') || !h.includes('Wyczyść pytania po wizycie')) throw new Error('brak przycisku');
  click({ wizclear: '1' });
  if (T.S().wizList.length !== 0 || mainHtml().includes('data-wizclear') || !toastHtml().includes('data-undo')) throw new Error('czyszczenie');
  click({ undo: '1' });
  return JSON.stringify(T.S().wizList) === '["hp_test","sam_zoladek"]';
});
// Suplementy: pora, odstępy, górne dawki ze źródeł, „Biorę” i „Mój plan suplementów” (brief 17.11.2026)
const BRAK = 'Brak sprawdzonego źródła: zapytaj farmaceutę.';
// Lista marek jest poza repozytorium (prywatne/marki.json; w wersji publicznej pilnuje jej hook pre-push). Brak pliku: test sprawdza pustą listę.
const BRANDS = (() => { try { return JSON.parse(fs.readFileSync(path.join(root, '..', 'prywatne', 'marki.json'), 'utf8')); } catch (_) { return []; } })();
const SP = () => T.SUPP;
const SID = (id) => SP().find((s) => s.id === id);
const STXT = (s) => [s.n, s.v, s.d, s.e, s.w, s.kiedy, s.nie, s.ul].filter(Boolean).join(' ');
const SUPV = (take, o) => view('health', BASE({ suppTake: take, ...(o || {}) }));
const PLAN_OF = (h) => { const i = h.indexOf('id="suppplan"'); if (i < 0) return ''; const j = h.indexOf('<!--/suppplan-->', i); return h.slice(i, j < 0 ? undefined : j); };
const PAIR = (a, b) => T.SUPP_PARY.find((p) => (p.a === a && p.b === b) || (p.a === b && p.b === a));
tryc('suplementy: każdy ma id (unikalne), kiedy, nie, typ i źródło albo „Brak sprawdzonego źródła”', () => {
  const S0 = SP(); if (S0.length < 25) throw new Error('za mało pozycji: ' + S0.length);
  const ids = S0.map((s) => s.id), dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) throw new Error('powtórzone id: ' + dup.join());
  const bad = S0.filter((s) => !(s.id && /^[a-z0-9_]+$/.test(s.id) && s.kiedy && s.nie && ['suplement', 'lek'].includes(s.typ)
    && (Array.isArray(s.src) && s.src.length ? s.src.every((k) => T.SRC[k]) : s.kiedy === BRAK && s.nie === BRAK)));
  if (bad.length) throw new Error(bad.map((s) => s.id || s.n).join(', '));
  return true;
});
tryc('suplementy: pozycje z drugiej listy po substancji', () => {
  const need = ['omega3', 'wapn', 'witc', 'b12', 'glicyna', 'cynk', 'krzem', 'bor', 'kolagen', 'k2', 'witae', 'glukozamina', 'kasztanowiec', 'osseina', 'ppi', 'lewotyroksyna', 'magnez', 'jod', 'zelazo', 'witd'];
  const miss = need.filter((id) => !SID(id)); if (miss.length) throw new Error(miss.join());
  return ['osseina', 'ppi', 'lewotyroksyna'].every((id) => SID(id).typ === 'lek') && ['omega3', 'wapn', 'cynk', 'glukozamina', 'kasztanowiec'].every((id) => SID(id).typ === 'suplement');
});
tryc('suplementy: leki tylko ze zdaniem z ChPL i „Ustal z lekarzem lub farmaceutą.” w Kiedy i na końcu Nie łącz z', () => SP().filter((s) => s.typ === 'lek').every((s) => s.kiedy.includes('Ustal z lekarzem lub farmaceutą.') && s.nie.endsWith('Ustal z lekarzem lub farmaceutą.')));
tryc('suplementy: bez nazw handlowych w całym app.js (także w adresach) i w widoku', () => {
  const c = code.toLowerCase(), h = SUPV(SP().map((s) => s.id)).toLowerCase();
  const hit = BRANDS.filter((b) => c.includes(b) || h.includes(b)); if (hit.length) throw new Error(hit.join());
  return true;
});
tryc('suplementy: bez zdań bez źródła przy jodzie i beta-alaninie', () => { const t = SP().map(STXT).join(' ') + code; return !t.includes('Przy Hashimoto bez zalecenia nie suplementować') && !t.includes('Sól jodowana i ryby zwykle wystarczają') && !t.includes('Mrowienie skóry jest nieszkodliwe'); });
tryc('suplementy: wyciąg z kasztanowca bez źródła po usunięciu linku z marką', () => { const s = SID('kasztanowiec'); return s.kiedy === BRAK && s.nie === BRAK && !s.src.length; });
tryc('suplementy: odstęp raz w planie (żelazo i wapń w różnych grupach)', () => {
  if (SID('zelazo').pora === SID('wapn').pora) throw new Error('ta sama grupa');
  const p = PAIR('zelazo', 'wapn'), h = PLAN_OF(SUPV(['zelazo', 'wapn'])), n = h.split(T.esc(p.txt)).length - 1;
  if (n !== 1) throw new Error('wystąpień ' + n);
  return true;
});
tryc('suplementy: „Pokaż wszystkie odstępy (N)” liczy tylko niewidoczne, każdy odstęp raz', () => {
  const take = ['zelazo', 'wapn', 'cynk', 'magnez', 'lewotyroksyna', 'osseina', 'witae', 'ppi', 'b12'], h = PLAN_OF(SUPV(take));
  const has = (x) => take.includes(x) || x === 'kawa', all = T.SUPP_PARY.filter((p) => has(p.a) && has(p.b) && (take.includes(p.a) || take.includes(p.b)));
  const twice = all.filter((p) => h.split(T.esc(p.txt)).length - 1 !== 1); if (twice.length) throw new Error('nie raz: ' + twice.map((p) => p.a + '-' + p.b).join());
  const groups = h.split('<section class="sgrp"').slice(1);
  return groups.every((g) => { const m = g.match(/Pokaż wszystkie odstępy \((\d+)\)/), shown = (g.match(/<div class="note">/g) || []).length, folded = (g.match(/<p class="small sp">/g) || []).length; return (m ? +m[1] : 0) === folded && shown <= 1; });
});
tryc('suplementy: bez „niesprawdzone” i „wiedza ogólna”', () => { const b = SP().filter((s) => /niesprawdzone|wiedza ogólna/i.test(STXT(s))); if (b.length) throw new Error(b.map((s) => s.id).join()); return true; });
tryc('suplementy: biotyna przed badaniami według laboratorium Quest Diagnostics', () => { const s = SID('biotyna'); return s && /według laboratorium Quest Diagnostics/.test(STXT(s)) && s.src.some((k) => T.SRC[k][0].includes('questdiagnostics.com')) && !/2-3 dni/.test(STXT(s)); });
tryc('suplementy: lewotyroksyna 4 h (MedlinePlus) i 2 h (ChPL) z „Odstęp ustal z lekarzem.”', () => { const s = SID('lewotyroksyna'); return /4 godzin/.test(s.nie) && /2 godzin/.test(s.nie) && s.nie.includes('Odstęp ustal z lekarzem.'); });
tryc('suplementy: lewotyroksyna, żywność z soją, orzechami włoskimi i błonnikiem bez godzin (MedlinePlus)', () => { const s = SID('lewotyroksyna'), m = s.nie.match(/[^.]*soj[^.]*\./); return !!m && /orzech/.test(m[0]) && /błonnik/.test(m[0]) && !/godzin/.test(m[0]) && s.nie.includes('Ustal z lekarzem'); });
tryc('suplementy: błonnik bez „2-4 h”, odstęp ponad godzinę i co najmniej 30 minut ze strony NHS o preparacie z łuski babki', () => { const s = SID('blonnik'), t = STXT(s); return !/2-4 h/.test(t) && /ponad godzin/.test(t) && /30 minut/.test(t) && /po posiłku lub przekąsce/.test(t) && /NHS/.test(t) && /łusk/.test(t) && s.src.some((k) => T.SRC[k][0].includes('fybogel')); });
tryc('suplementy: magnez bez niesprawdzonego odstępu 4 h od lewotyroksyny', () => !/4 h/.test(STXT(SID('magnez'))));
tryc('suplementy: warfaryna tylko jako ogólne zdanie przy pozycji', () => ['glukozamina', 'omega3', 'witae'].every((id) => /Przy lekach przeciwzakrzepowych \(np\. warfaryna\) powiedz lekarzowi/.test(STXT(SID(id)))) && !SP().some((s) => /bierzesz warfaryn|przyjmujesz warfaryn/i.test(STXT(s))));
tryc('suplementy: karta ma „Kiedy”, „Nie łącz z”, „Górna dawka dzienna” i przycisk „Biorę”', () => { const h = SUPV([]); return h.includes('<b>Kiedy:</b>') && h.includes('<b>Nie łącz z:</b>') && h.includes('<b>Górna dawka dzienna:</b>') && h.includes('data-supp="cynk" aria-pressed="false"') && !h.includes('id="suppplan"'); });
tryc('suplementy: „Biorę” dodaje i usuwa id, karta planu pojawia się i znika', () => {
  SUPV([]); click({ supp: 'zelazo' });
  if (JSON.stringify(T.S().suppTake) !== '["zelazo"]') throw new Error('dodanie ' + JSON.stringify(T.S().suppTake));
  const h = mainHtml(); if (!(h.includes('id="suppplan"') && h.includes('Mój plan suplementów') && h.includes('data-supp="zelazo" aria-pressed="true" aria-label="Biorę: Żelazo"><span aria-hidden="true">✓ </span>Biorę</button>'))) throw new Error('karta');
  click({ supp: 'zelazo' });
  return T.S().suppTake.length === 0 && !mainHtml().includes('id="suppplan"') && mainHtml().includes('data-supp="zelazo" aria-pressed="false" aria-label="Biorę: Żelazo">Biorę</button>');
});
tryc('suplementy: nieznane id w kliknięciu nic nie dodaje', () => { SUPV([]); click({ supp: 'x' }); return T.S().suppTake.length === 0; });
tryc('suplementy: żelazo z wapniem pokazuje ostrzeżenie żelazo-wapń', () => { const p = PAIR('zelazo', 'wapn'); if (!p) throw new Error('brak pary'); const h = PLAN_OF(SUPV(['zelazo', 'wapn'])); return h.includes(T.esc(p.txt)); });
tryc('suplementy: samo żelazo pokazuje kawę, herbatę i nabiał z 2 godzinami (NHS)', () => { const p = T.SUPP_PARY.find((x) => x.a === 'zelazo' && x.b === 'kawa'); if (!p) throw new Error('brak pary'); const h = PLAN_OF(SUPV(['zelazo'])); return h.includes(T.esc(p.txt)) && /2 godzin/.test(p.txt) && /kaw/.test(p.txt) && /herbat/.test(p.txt) && /nabiał/.test(p.txt) && h.includes('ferrous-sulfate'); });
tryc('suplementy: lewotyroksyna z wapniem pokazuje 2 h i 4 h ze źródłami', () => { const p = PAIR('lewotyroksyna', 'wapn'); if (!p) throw new Error('brak pary'); const h = PLAN_OF(SUPV(['lewotyroksyna', 'wapn'])); return h.includes(T.esc(p.txt)) && /2 godzin/.test(p.txt) && /4 godzin/.test(p.txt) && h.includes('medlineplus.gov/druginfo/meds/a682461') && h.includes('medicinal-products/12231'); });
tryc('suplementy: najwyżej jedno ostrzeżenie w grupie, reszta pod „Pokaż wszystkie odstępy”', () => {
  const h = PLAN_OF(SUPV(['zelazo', 'wapn', 'cynk', 'magnez', 'lewotyroksyna', 'osseina', 'witae', 'ppi', 'b12']));
  const groups = h.split('<section class="sgrp"').slice(1); if (!groups.length || groups.length > 4) throw new Error('grupy ' + groups.length);
  const many = groups.filter((g) => (g.match(/class="note"/g) || []).length > 1); if (many.length) throw new Error('za dużo ostrzeżeń');
  return h.includes('Pokaż wszystkie odstępy (') && !h.includes('note warn') && groups.every((g) => /<h4[^>]*>(Rano na czczo|Z posiłkiem|Między posiłkami|Pora bez zalecenia)<\/h4>/.test(g)) && h.includes('<h3') && !/<h3[^>]*>(Rano|Z posi|Między|Pora)/.test(h);
});
tryc('suplementy: plan bez serii, bez czerwonych oznaczeń i liczenia pominięć', () => { const h = PLAN_OF(SUPV(['zelazo', 'wapn'])); return h && !/seria|pominię|z rzędu|note warn/i.test(h); });
tryc('suplementy: pora tylko z czterech grup', () => SP().every((s) => ['rano', 'posilek', 'miedzy', 'brak'].includes(s.pora)));
tryc('suplementy: suppTake w DEF, pomijane w kopii bez zdrowia', () => { SUPV(['zelazo']); return JSON.stringify(T.DEF().suppTake) === '[]' && !('suppTake' in JSON.parse(T.bkBuild(true)).data) && JSON.stringify(JSON.parse(T.bkBuild(false)).data.suppTake) === '["zelazo"]'; });
tryc('suplementy: wrogi import suppTake naprawiony do znanych id bez powtórzeń', () => {
  view('set', BASE({ suppTake: [] }));
  T.setPending({ app: 'talerz-i-trening', v: 1, created: '2026-11-09T10:00:00Z', noHealth: false, data: { suppTake: ['x', 1, null, 'zelazo', 'zelazo'] } });
  click({ bkapply: '1' });
  return JSON.stringify(T.S().suppTake) === '["zelazo"]';
});
tryc('suplementy: suppTake nie-tablica przy wczytaniu kopii daje pustą listę', () => {
  view('set', BASE({ suppTake: [] }));
  T.setPending({ app: 'talerz-i-trening', v: 1, created: '2026-11-09T10:00:00Z', noHealth: false, data: { suppTake: 'zelazo' } });
  click({ bkapply: '1' });
  return JSON.stringify(T.S().suppTake) === '[]';
});
tryc('suplementy: ChPL lewotyroksyny zawsze „co najmniej 2 godziny przed” żelazem i solami wapnia', () => {
  const t = [PAIR('lewotyroksyna', 'wapn').txt, PAIR('lewotyroksyna', 'zelazo').txt, SID('zelazo').nie, SID('wapn').nie, SID('lewotyroksyna').nie];
  const bad = t.flatMap((x) => x.split(/[.;] /)).filter((z) => /co najmniej 2 godzin/.test(z) && !/lewotyroksyna co najmniej 2 godziny przed (żelazem|solami wapnia)/.test(z));
  if (bad.length) throw new Error(bad.join(' | '));
  return true;
});
tryc('suplementy: nazwa preparatu z MedlinePlus przy żelazie i wapniu', () => SID('zelazo').nie.includes('siarczan żelaza') && SID('wapn').nie.includes('węglan wapnia'));
tryc('suplementy: adres ze słowem fybogel tylko w dwóch linkach NHS (wyjątek, komentarz w kodzie)', () => {
  const L = code.split('\n').filter((l) => /fybogel/i.test(l));
  return L.length === 2 && L.every((l) => /^\s*s_nhsIsp[TW]:\['https:\/\/www\.nhs\.uk\/medicines\/fybogel-ispaghula-husk\//.test(l)) && /wyjątek/i.test(code.split('\n')[code.split('\n').findIndex((l) => /s_nhsIspT:/.test(l)) - 1]);
});
tryc('suplementy: lewotyroksyna bez nieużywanego źródła NHS', () => !SID('lewotyroksyna').src.includes('s_nhsLt4'));
tryc('suplementy: kreatyna z zastrzeżeniem „według doniesień (ISSN)”', () => /według doniesień \(ISSN\)/i.test(SID('kreatyna').kiedy) && !/pewniej zostaje/.test(SID('kreatyna').kiedy));
tryc('suplementy: błonnik jako łuska babki jajowatej (ispaghula), bez „babka płesznik”', () => SID('blonnik').n === 'Błonnik (łuska babki jajowatej, ispaghula)');
tryc('suplementy: błonnik z innym preparatem pokazuje w planie jedną uwagę o odstępie ponad godzinę (NHS)', () => {
  if (PLAN_OF(SUPV(['blonnik'])).includes('ponad godzinę')) throw new Error('sam błonnik');
  const h = PLAN_OF(SUPV(['blonnik', 'jod', 'cynk'])), n = h.split('ponad godzinę').length - 1;
  return n === 1 && h.includes('taking-fybogel-with-other-medicines');
});
tryc('suplementy: cytrulina bez dawki bez cytatu', () => !STXT(SID('cytrulina')).includes('6-8 g') && !SID('cytrulina').d);
tryc('suplementy: probiotyki z antybiotykiem w Uwadze, z kontekstem C. difficile', () => { const s = SID('probiotyki'); return s.nie === BRAK && /antybiotyk/.test(s.w) && /C\. difficile/.test(s.w); });
tryc('suplementy: witamina C, zdanie o żelazie oddzielne od leków przeciwzakrzepowych', () => { const z = SID('witc').w.split(/\. /).find((x) => /żelaz/.test(x)); const w = SID('witc').w; return !!z && !/przeciwzakrzep|warfaryn/.test(z) && w.indexOf(z) < w.indexOf('Przy lekach przeciwzakrzepowych'); });
tryc('suplementy: para inhibitor pompy protonowej i lewotyroksyna z ChPL lewotyroksyny', () => { const p = PAIR('ppi', 'lewotyroksyna'); return !!p && /pH soku żołądkowego/.test(p.txt) && /hormonów tarczycy/.test(p.txt) && p.src.includes('s_chplLt4'); });
tryc('suplementy: pary bez nieużywanego pola h', () => T.SUPP_PARY.every((p) => !('h' in p)));
tryc('suplementy: beta-alanina bez zdania o własnych treningach, jod „Zapytaj lekarza lub farmaceutę”', () => !STXT(SID('betaalanina')).includes('spinningu') && SID('jod').v === 'Zapytaj lekarza lub farmaceutę');
// Zakupy z promocji (brief 18.11.2026): osoba sama wkleja fragment gazetki, Miara rozpoznaje produkt, cenę i daty lokalnie,
// zapisuje tylko zatwierdzone pozycje. Produkty i ceny w testach są zmyślone.
const PADD = (k, n) => { const d = new Date(k + 'T12:00:00'); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const DDMM = (k) => k.slice(8, 10) + '.' + k.slice(5, 7);
const PP = (t, today, shopDay) => { T.S().shopDay = shopDay === undefined ? null : shopDay; return T.promoParse(t, today || '2026-11-18'); };
const P1 = (t, today, shopDay) => (PP(t, today, shopDay) || [])[0] || {};
const PF = () => { const S = T.S(); S.f = JSON.parse(JSON.stringify(T.DEF().f)); S.prof = { cond: {}, pill: '' }; };
const PROMO = (o) => ({ id: 'x' + Math.random().toString(36).slice(2), n: 'Twaróg półtłusty', ing: 'twarog', p: 5.49, od: '', do: PADD(T.todayKey(), 3), u: '', ...o });
const SHOPV = (o) => { PF(); return view('meals', BASE({ shopDay: null, stores: [], promos: [], ...o })); };
tryc('zakupy: pola shopDay, stores, promos w DEF i w kopii bez danych o zdrowiu', () => T.DEF().shopDay === null && JSON.stringify(T.DEF().stores) === '[]' && JSON.stringify(T.DEF().promos) === '[]' && ['shopDay', 'stores', 'promos'].every((k) => (T.nhKeep() || []).includes(k)));
tryc('zakupy: cena z przecinkiem, nazwa bez ceny, składnik i flaga guess', () => { const r = P1('Twaróg półtłusty 250 g 3,99 zł'); return r.n === 'Twaróg półtłusty 250 g' && r.p === 3.99 && r.ing === 'twarog' && r.guess === true && r.u === ''; });
tryc('zakupy: cena z kropką, „5 49 zł” i „549 zł”', () => P1('Ser żółty 12.99').p === 12.99 && P1('Jogurt naturalny 5 49 zł').p === 5.49 && P1('Kasza jaglana 549 zł').p === 5.49 && P1('Skyr naturalny 2,49zł').p === 2.49);
tryc('zakupy: dwie ceny w linii (stara i nowa) daje niższą', () => P1('Pierś z kurczaka 24,99 zł 19,99 zł').p === 19.99 && P1('Pierś z kurczaka 19,99 zł 24,99 zł').p === 19.99);
tryc('zakupy: procenty, gramy, sztuki i liczby bez zł nie są ceną', () => ['Mleko 2% 1 l', 'Taniej -50% na drugi', 'Ser 250 g 2 szt.', 'Jajka 10 szt', 'Twaróg 250'].every((t) => PP(t).length === 0));
tryc('zakupy: „0,75 l” i „1,50 kg” to nie cena', () => P1('Sok jabłkowy 0,75 l 4,99 zł').p === 4.99 && P1('Jabłka 1,50 kg 6,99 zł').p === 6.99 && PP('Woda 0,75 l').length === 0);
tryc('zakupy: cena za kg i za sztukę zostaje z jednostką', () => { const a = P1('Pierś z kurczaka 19,99 zł/kg'), b = P1('Papryka czerwona 2,49 zł/szt.'); return a.p === 19.99 && a.u === 'kg' && b.p === 2.49 && b.u === 'szt' && a.n === 'Pierś z kurczaka' && b.n === 'Papryka czerwona'; });
tryc('zakupy: daty „16.11-21.11” i „16.11.2026 - 21.11.2026”', () => { const a = P1('Twaróg 3,99 zł 16.11-21.11'), b = P1('Twaróg 3,99 zł 16.11.2026 - 21.11.2026'); return a.od === '2026-11-16' && a.do === '2026-11-21' && !a.guess && b.od === '2026-11-16' && b.do === '2026-11-21' && a.n === 'Twaróg'; });
tryc('zakupy: daty słowne „12 - 18 lis 2026”, „16 lis do 21 lis”, „do 21 listopada”', () => { const a = P1('Skyr 2,49 zł 12 - 18 lis 2026'), b = P1('Skyr 2,49 zł 16 lis do 21 lis'), c = P1('Skyr 2,49 zł do 21 listopada'); return a.od === '2026-11-12' && a.do === '2026-11-18' && b.od === '2026-11-16' && b.do === '2026-11-21' && c.do === '2026-11-21' && c.od === '' && a.n === 'Skyr'; });
tryc('zakupy: „do 18.11”, „od 16.11” (data końca przyjęta), „paź” i „paz”', () => { const a = P1('Tofu 4,99 zł do 18.11'), b = P1('Tofu 4,99 zł od 16.11'), c = P1('Tofu 4,99 zł do 30 paź', '2026-10-20'), d = P1('Tofu 4,99 zł do 30 paz', '2026-10-20'); return a.od === '' && a.do === '2026-11-18' && !a.guess && b.od === '2026-11-16' && b.guess === true && b.do >= b.od && c.do === '2026-10-30' && d.do === '2026-10-30'; });
tryc('zakupy: zakres przez Nowy Rok i rok najbliżej dzisiaj', () => { const a = P1('Łosoś 29,99 zł 28.12-03.01', '2026-12-20'), b = P1('Łosoś 29,99 zł do 02.01', '2026-12-28'); return a.od === '2026-12-28' && a.do === '2027-01-03' && b.do === '2027-01-02'; });
tryc('zakupy: nieistniejąca data „31.02” pominięta, nie jest ceną', () => { const r = PP('Ser 4,99 zł do 31.02'); return r.length === 1 && r[0].p === 4.99 && r[0].guess === true; });
tryc('zakupy: linia z samą datą ustawia daty pozycji bez własnej daty', () => { const r = PP('Twaróg półtłusty 3,99 zł\nOferta ważna od 16.11 do 21.11\nSkyr naturalny 2,49 zł\nTofu 4,99 zł do 19.11'); return r.length === 3 && r[0].do === '2026-11-21' && r[0].od === '2026-11-16' && r[1].do === '2026-11-21' && r[2].do === '2026-11-19' && !r[0].guess; });
tryc('zakupy: nazwa z poprzedniej linii bez ceny i bez słów cena, taniej, promocja', () => { const a = P1('Twaróg półtłusty\n3,99 zł'), b = P1('Masło promocja taniej -30% 5,99 zł cena'); return a.n === 'Twaróg półtłusty' && b.n === 'Masło'; });
tryc('zakupy: pozycja bez nazwy pominięta, nazwa przycięta do 60 znaków, najwyżej 20 pozycji', () => { const long = 'Ser '.repeat(30) + '3,99 zł'; const many = Array.from({ length: 25 }, (_, i) => `Produkt ${i} 1,${String(10 + i)} zł`).join('\n'); return PP('3,99 zł').length === 0 && P1(long).n.length <= 60 && PP(many).length === 20; });
tryc('zakupy: brak daty końca: dzień zakupów + 6 albo dziś + 6', () => P1('Tofu 4,99 zł', '2026-11-18').do === '2026-11-24' && P1('Tofu 4,99 zł', '2026-11-18', 5).do === '2026-11-26');
tryc('zakupy: promoMatch bez polskich znaków, tylko składniki z dań', () => { const used = new Set(T.MEALS.flatMap((m) => m.ing.map((i) => i[0]))); return T.promoMatch('Twaróg półtłusty 250 g') === 'twarog' && T.promoMatch('Filet z piersi kurczaka') === 'kurczak_piers' && T.promoMatch('SKYR NATURALNY') === 'skyr' && T.promoMatch('Śrubki do drewna') === '' && ['Kasza gryczana', 'Pomidory krojone', 'Brokuł', 'Mleko'].map(T.promoMatch).every((k) => k === '' || used.has(k)); });
tryc('zakupy: nextShop: dziś, gdy dziś jest dzień zakupów, najbliższy dzień albo pusto', () => { const S = T.S(); S.shopDay = null; const a = T.nextShop('2026-11-18'); S.shopDay = 3; const b = T.nextShop('2026-11-18'); S.shopDay = 1; const c = T.nextShop('2026-11-18'); S.shopDay = null; return a === '' && b === '2026-11-18' && c === '2026-11-23'; });
tryc('zakupy: promosActive z puste od jako brak dolnej granicy', () => { const S = T.S(); S.promos = [PROMO({ od: '', do: '2026-11-21' }), PROMO({ od: '2026-11-20', do: '2026-11-25' }), PROMO({ od: '', do: '2026-11-17' })]; const a = T.promosActive('2026-11-18').length, b = T.promosActive('2026-11-21').length; S.promos = []; return a === 1 && b === 2; });
tryc('zakupy: promoDishes: do 5 dań ze składnikiem w promocji, wszystkie rodzaje posiłków, wykluczenia osoby', () => {
  PF(); const S = T.S(), k = T.todayKey(); S.promos = [PROMO({ ing: 'twarog' })];
  const a = T.promoDishes(k); const types = new Set(a.map((o) => o.m.t));
  if (!(a.length > 0 && a.length <= 5 && a.every((o) => o.m.ing.some((i) => i[0] === 'twarog')))) throw new Error('dania: ' + a.length);
  S.f.chips = { [T.ING.twarog.chip]: -1 }; const b = T.promoDishes(k); PF(); S.promos = [];
  return b.length === 0 && (types.size > 1 || a.length < 2);
});
tryc('zakupy: filtered() bez zmian, filtered({allTypes:true}) pomija rodzaj i tempo', () => { PF(); const S = T.S(); S.f.type = 'obiad'; const a = T.filtered(), b = T.filtered({ allTypes: true }); return a.every((o) => o.m.t === 'obiad') && new Set(b.map((o) => o.m.t)).size > 1 && b.length > a.length; });
tryc('zakupy: promoFix czyści zły kształt, przycina i usuwa po terminie', () => {
  const ok = { id: 'a', n: 'x'.repeat(80), ing: 'twarog', p: 3.99, od: '', do: '2026-11-20', u: 'kg' };
  const s = T.promoFix({ shopDay: 9, stores: [{ n: 'A'.repeat(40), u: 'https://a.example' }, 'zły', { n: 1 }, { n: 'B', u: '' }, { n: 'C', u: '' }, { n: 'D', u: '' }], promos: [ok, { ...ok, id: 'b', do: '2026-11-17' }, { ...ok, id: 'c', p: -1 }, { ...ok, id: 'd', p: 20000 }, { ...ok, id: 'e', do: '18.11' }, { ...ok, id: 'f', ing: 'nieznany', u: 'litr' }, null, ...Array.from({ length: 50 }, (_, i) => ({ ...ok, id: 'z' + i }))] }, '2026-11-18');
  const s2 = T.promoFix({ shopDay: 4, stores: 'x', promos: {} }, '2026-11-18');
  return s.shopDay === null && s.stores.length === 3 && s.stores[0].n.length === 30 && s.promos.length === 40 && s.promos[0].n.length === 60 && !s.promos.some((p) => ['b', 'c', 'd', 'e'].includes(p.id)) && s.promos[1].ing === '' && s.promos[1].u === '' && s2.shopDay === 4 && Array.isArray(s2.stores) && Array.isArray(s2.promos);
});
tryc('zakupy: nagłówek listy od dnia zakupów i wybór dnia (8 przycisków, scroll)', () => {
  const k = T.todayKey(), sd = new Date(k + 'T12:00:00').getDay(); T.S().shopDay = sd; const nx = T.nextShop(k);
  const h = SHOPV({ shopDay: sd }), g = SHOPV({ shopDay: null });
  const seg = (h.match(/<div class="seg scroll" role="group" aria-label="Dzień zakupów">[\s\S]*?<\/div>/) || [''])[0];
  return nx === k && h.includes('Lista zakupów na 7 dni od ') && h.includes(DDMM(k)) && g.includes('Lista zakupów na tydzień z planu') && (seg.match(/data-shopday=/g) || []).length === 8 && seg.includes('Nie ustawiam') && seg.includes('>pn<');
});
tryc('zakupy: dopisek promocji przy pozycji listy i „kończy się przed zakupami”', () => {
  const k = T.todayKey(), sd = (new Date(k + 'T12:00:00').getDay() + 3) % 7;
  const a = SHOPV({ promos: [PROMO({ do: PADD(k, 3) })] }), b = SHOPV({ shopDay: sd, promos: [PROMO({ do: k })] }), c = SHOPV({ promos: [PROMO({ do: PADD(k, 3), p: 19.9, u: 'kg' })] });
  return a.includes(`promocja 5,49 zł do ${DDMM(PADD(k, 3))}`) && b.includes(`promocja kończy się przed zakupami (${DDMM(k)})`) && c.includes('19,90 zł za kg');
});
tryc('zakupy: gazetki tylko z https, nowa karta, escapowane; pola sklepów i „Dodaj sklep” do 3', () => {
  const h = SHOPV({ stores: [{ n: 'Sklep <b>A</b>', u: 'https://example.com/gazetka?a=1&b="2"' }, { n: 'B', u: 'javascript:alert(1)' }, { n: 'C', u: 'http://example.com' }] });
  const links = h.match(/<a [^>]*>Otwórz gazetkę: [^<]*<\/a>/g) || [];
  const h4 = SHOPV({ stores: [{ n: 'A', u: '' }] });
  return links.length === 1 && links[0].includes('target="_blank"') && links[0].includes('rel="noopener noreferrer"') && links[0].includes('&amp;b=&quot;2&quot;') && links[0].includes('Sklep &lt;b&gt;A&lt;/b&gt;') && !/href="(javascript|http):/.test(h) && h.includes('data-k="stores.2.u"') && !h.includes('data-storeadd') && h4.includes('data-storeadd') && h.includes('Twoje sklepy');
});
tryc('zakupy: pole wklejania z etykietą, bez data-k, tekst o braku pobierania', () => { const h = SHOPV(); const ta = (h.match(/<textarea[^>]*>/) || [''])[0]; return ta.includes('id="promo_txt"') && !ta.includes('data-k') && h.includes('<label for="promo_txt"') && h.includes('Wklej fragment gazetki') && h.includes('data-promoparse') && h.includes('Ceny wpisujesz sam z gazetki lub półki. Miara nic nie pobiera z internetu; promocje usuwają się po terminie.'); });
tryc('zakupy: Rozpoznaj: propozycje, toast, select z etykietą, Zapisz i Pomiń z nazwą; tekst nie trafia do stanu', () => {
  SHOPV(); els.promo_txt = { value: 'Twaróg półtłusty 250 g 3,99 zł\nSkyr naturalny 2,49 zł' }; click({ promoparse: '1' });
  const h = mainHtml(), t = els.toast.innerHTML, pend = T.promoPending();
  return pend.length === 2 && t.includes('Znaleziono 2 pozycje') && h.includes('id="promo_h" tabindex="-1"') && h.includes('aria-label="Składnik dla: Twaróg półtłusty 250 g"') && h.includes('aria-label="Zapisz: Twaróg półtłusty 250 g"') && h.includes('aria-label="Pomiń: Skyr naturalny"') && h.includes('Zapisz wszystkie') && h.includes('bez dopasowania') && h.includes('data nieznana, przyjęto do') && !JSON.stringify(T.S()).includes('Skyr naturalny 2,49');
});
tryc('zakupy: Pomiń usuwa propozycję, wybór składnika i Zapisz dodaje promocję', () => {
  click({ promoskip: '1' }); if (T.promoPending().length !== 1) throw new Error('pomiń');
  (lis.change || []).forEach((f) => f({ target: { dataset: { promoing: '0' }, value: 'skyr' } }));
  click({ promosave: '0' }); const S = T.S();
  return S.promos.length === 1 && S.promos[0].ing === 'skyr' && S.promos[0].p === 3.99 && typeof S.promos[0].id === 'string' && !T.promoPending();
});
tryc('zakupy: brak ceny w wklejeniu: komunikat z przykładem', () => { SHOPV(); els.promo_txt = { value: 'Tylko tekst bez ceny' }; click({ promoparse: '1' }); return mainHtml().includes('Nie znalazłem ceny. Wklej linię z nazwą i ceną, np. Twaróg 250 g 3,99 zł'); });
tryc('zakupy: duplikat (nazwa bez wielkości liter, ta sama data do) zastępuje wpis', () => {
  const k = T.todayKey(); SHOPV({ promos: [PROMO({ n: 'Twaróg półtłusty', do: PADD(k, 2), p: 5.49 })] }); els.promo_txt = { value: `TWARÓG PÓŁTŁUSTY 4,49 zł do ${DDMM(PADD(k, 2))}` }; click({ promoparse: '1' }); click({ promosaveall: '1' });
  const S = T.S(); return S.promos.length === 1 && S.promos[0].p === 4.49;
});
tryc('zakupy: limit 40 promocji: toast i brak zapisu', () => {
  SHOPV({ promos: Array.from({ length: 40 }, (_, i) => PROMO({ n: 'P' + i })) }); els.promo_txt = { value: 'Tofu naturalne 4,99 zł' }; click({ promoparse: '1' }); click({ promosave: '0' });
  return T.S().promos.length === 40 && els.toast.innerHTML.includes('Masz już 40 promocji. Usuń stare, żeby dodać nowe.');
});
tryc('zakupy: Twoje promocje, Usuń przez Cofnij, dania z produktów w promocji', () => {
  const p = PROMO({ id: 'pdel', u: 'szt', p: 2.5 }); const h = SHOPV({ promos: [p] }); const none = SHOPV({ promos: [] });
  const sec = h.slice(h.indexOf('Dania z produktów w promocji'));
  view('meals', { promos: [p] }); click({ promodel: 'pdel' }); const gone = T.S().promos.length === 0; click({ undo: '1' });
  return h.includes('Twoje promocje') && h.includes('2,50 zł za szt.') && h.includes('aria-label="Usuń: Twaróg półtłusty"') && /data-recipe="[a-z0-9]+"/.test(sec) && sec.includes('w promocji: Twaróg półtłusty') && !none.includes('Dania z produktów w promocji') && gone && T.S().promos.length === 1;
});
tryc('zakupy: bez pobierania i bez odczytu schowka (liczby jak przed funkcją: jedna kopia w chmurze, jeden import)', () => (code.match(/readText/g) || []).length === 2 && (code.match(/fetch\(|XMLHttpRequest|sendBeacon/g) || []).length === 1 && ['promoParse', 'promoFix', 'promoDishes'].every((f) => typeof T[f] === 'function' && !/readText|clipboard|fetch/.test(String(T[f]))));
tryc('zakupy: spacja niełamliwa z wklejenia ze strony traktowana jak zwykła', () => P1('Twaróg półtłusty 3,99' + String.fromCharCode(160) + 'zł').p === 3.99);

// eGFR (CKD-EPI 2021, NIDDK) i cholesterol nie-HDL (NHS) z wyników w Moich badaniach (18.11.2026); dane zmyślone
const LB = (labs, o) => { const S = T.S(); Object.assign(S, BASE({ labs, age: '40', sex: 'K', touched: { age: true }, ...o })); };
const LE = (test, val, unit, date) => ({ id: test + date + val, test, date: date || '2026-11-02', val, unit });
const near = (a, b) => Math.abs(a - b) < 0.05;
tryc('eGFR: kobieta 40 lat, kreatynina 0,8 mg/dl = 95,46 (gałąź powyżej κ)', () => { LB([LE('kreat', '0,8', 'mg/dl')]); const r = T.egfrRows(); return r.length === 1 && near(r[0].v, 95.46); });
tryc('eGFR: mężczyzna 30 lat, 1,0 mg/dl = 103,84', () => { LB([LE('kreat', '1,0', 'mg/dl')], { age: '30', sex: 'M' }); const r = T.egfrRows(); return r.length === 1 && near(r[0].v, 103.84); });
tryc('eGFR: kobieta 50 lat, 0,6 mg/dl = 109,29 (gałąź poniżej κ)', () => { LB([LE('kreat', '0.6', 'mg/dl')], { age: '50' }); const r = T.egfrRows(); return r.length === 1 && near(r[0].v, 109.29); });
tryc('eGFR: brak przy jednostce innej niż mg/dl, przy wieku startowym i poniżej 18 lat', () => { LB([LE('kreat', '70', 'µmol/l')]); const a = T.egfrRows().length; LB([LE('kreat', '0,8', 'mg/dl')], { touched: {} }); const b = T.egfrRows().length; LB([LE('kreat', '0,8', 'mg/dl')], { age: '16' }); return a === 0 && b === 0 && T.egfrRows().length === 0; });
tryc('eGFR: kategorie NHS (powyżej 90, 60-89, 3a, 3b, 4, 5)', () => [[95, '90'], [70, '60-89'], [52, '3a'], [35, '3b'], [20, '4'], [10, '5']].every(([v, t]) => T.egfrCat(v).includes(t)));
tryc('eGFR: w Moich badaniach z opisem i bez czerwonej ramki', () => { LB([LE('kreat', '0,8', 'mg/dl')]); const h = view('labs', {}); const i = h.indexOf('<b>eGFR</b>'); return i > 0 && h.includes('CKD-EPI 2021') && h.includes('lekarz') && !/class="note warn"[^>]*><b>eGFR/.test(h); });
tryc('nie-HDL: 5,2 − 1,3 mmol/l = 3,9 z wartością orientacyjną NHS poniżej 4 mmol/l', () => { LB([LE('chol', '5,2', 'mmol/l'), LE('hdl', '1,3', 'mmol/l')]); const r = T.nonHdlRows(); const h = view('labs', {}); return r.length === 1 && near(r[0].v, 3.9) && r[0].mmol === true && h.includes('nie-HDL') && h.includes('poniżej 4 mmol/l'); });
tryc('nie-HDL: 200 − 50 mg/dl = 150 bez progu w mg/dl', () => { LB([LE('chol', '200', 'mg/dl'), LE('hdl', '50', 'mg/dl')]); const r = T.nonHdlRows(); return r.length === 1 && near(r[0].v, 150) && r[0].mmol === false; });
tryc('nie-HDL: brak przy różnych datach albo różnych jednostkach', () => { LB([LE('chol', '200', 'mg/dl', '2026-11-02'), LE('hdl', '50', 'mg/dl', '2026-11-03')]); const a = T.nonHdlRows().length; LB([LE('chol', '5,2', 'mmol/l'), LE('hdl', '50', 'mg/dl')]); return a === 0 && T.nonHdlRows().length === 0; });
// Potencjał mięśniowy (18.11.2026): pułap FFMI 25 z korektą wzrostu (Kouri 1995, PMID 7496846) i wzór Butta (źródło wtórne) z nadgarstka, kostki i tłuszczu; wartości zmyślone, wynik liczony niezależnie
const PQ = (o) => GB({ sex: 'M', cm: '180', frame: { wrist: '17,5', ankle: '22,5' }, ...o });
const PN = (ffm, fat, n = 1) => ({ meas: { [dk(n)]: fat ? { ffm, fat } : { ffm } } });
tryc('potencjał Kouri: M 180 cm, FFM 70 -> FFMI 21,60, ffmCap 81,0, gap 11,0', () => { view('set', PQ(PN('70'))); const r = T.potKouri(); return !!r && Math.abs(r.ffmi - 70 / 3.24) < 0.05 && Math.abs(r.ffmiN - 70 / 3.24) < 0.05 && r.cap === 25 && Math.abs(r.ffmCap - 81) < 0.05 && Math.abs(r.gap - 11) < 0.05 && Math.abs(r.pct - 100 * 70 / 81) < 0.1 && Math.abs(r.ffm - 70) < 0.001; });
tryc('potencjał Kouri: M 170 cm, FFM 60 -> ffmiN 21,39, ffmCap 70,43', () => { view('set', PQ({ cm: '170', ...PN('60') })); const r = T.potKouri(); const n = 60 / 2.89 + 6.3 * 0.1, cap = (25 - 0.63) * 2.89; return !!r && Math.abs(n - 21.39) < 0.01 && Math.abs(r.ffmiN - n) < 0.05 && Math.abs(cap - 70.43) < 0.01 && Math.abs(r.ffmCap - cap) < 0.05 && Math.abs(r.gap - (cap - 60)) < 0.05; });
tryc('potencjał Butt: M 180 cm, nadgarstek 17,5, kostka 22,5, tłuszcz 12', () => { view('set', PQ(PN('70', '12'))); const r = T.potButt(); const m = Math.pow(180, 1.5) * (Math.sqrt(17.5) / 322.4 + Math.sqrt(22.5) / 241.9) * (12 / 224 + 1); return !!r && Math.abs(r.m - m) < 0.05 && Math.abs(r.m95 - 0.95 * m) < 0.05 && Math.abs(r.gap - Math.max(0, m - 70)) < 0.05 && Math.abs(r.gap95 - Math.max(0, 0.95 * m - 70)) < 0.05 && Math.abs(r.pct - 100 * 70 / m) < 0.1 && r.f === 12; });
tryc('potencjał: null dla kobiet, przy wzroście startowym, bez FFM; Butt null bez kostki, nadgarstka i tłuszczu', () => {
  view('set', PQ({ sex: 'K', ...PN('70', '12') })); const a = T.potKouri() === null && T.potButt() === null;
  view('set', PQ({ touched: { kg: true, age: true, goal: true }, ...PN('70', '12') })); const b = T.potKouri() === null && T.potButt() === null;
  view('set', PQ()); const c = T.potKouri() === null && T.potButt() === null;
  view('set', PQ({ frame: { wrist: '17,5', ankle: '' }, ...PN('70', '12') })); const d = T.potButt() === null && T.potKouri() !== null;
  view('set', PQ({ frame: { wrist: '', ankle: '22,5' }, ...PN('70', '12') })); const e = T.potButt() === null;
  view('set', PQ(PN('70'))); const g = T.potButt() === null && T.potKouri() !== null;
  return a && b && c && d && e && g; });
tryc('potencjał: FFM powyżej pułapu -> gap 0', () => { view('set', PQ(PN('90', '12'))); const k = T.potKouri(), b = T.potButt(); return k.gap === 0 && b.gap === 0 && b.gap95 === 0 && k.pct > 100; });
tryc('karta potencjału: FFM powyżej pułapu -> zdanie o sprawdzeniu pomiaru', () => { const h = view('health', PQ(PN('90', '12'))); const i = h.indexOf('id="potencjal"'); return i >= 0 && h.slice(i).includes('Powyżej pułapu z badania: sprawdź pomiar lub zapytaj specjalistę.'); });
tryc('frame w DEF i w NH_DROP', () => JSON.stringify(T.DEF().frame) === '{"wrist":"","ankle":""}' && NH_DROP.includes('frame'));
tryc('nadgarstek 45 cm -> błąd pola; 17,5 poprawne; 10 i 40 na granicy', () => T.checkNum('frame.wrist', '45').err && T.checkNum('frame.ankle', '9').err && !T.checkNum('frame.wrist', '17,5').err && !T.checkNum('frame.wrist', '10').err && !T.checkNum('frame.ankle', '40').err);
tryc('potencjał: pola Nadgarstek i Kostka w sekcji obwodów z podpowiedzią najwęższe miejsce', () => { const h = view('day', PQ()); const i = h.indexOf('data-fold="obwody"'), j = h.indexOf('data-fold="tanita"'), s = h.slice(i, j); return /<button class="wp-val[^"]*" id="f_frame\.wrist"/.test(s) && s.includes('data-wpk="wrist"') && /<button class="wp-val[^"]*" id="f_frame\.ankle"/.test(s) && s.includes('data-wpk="ankle"') && s.includes('Nadgarstek') && s.includes('Kostka') && s.includes('najwęższe miejsce'); });
const PH = (o) => view('health', PQ(o));
const potCard = (h) => { const i = h.indexOf('id="potencjal"'), j = h.indexOf('id="bialko"'); return i < 0 || j < i ? '' : h.slice(i, j); };
tryc('potencjał karta: M z danymi ma id=potencjal przed Białkiem, SVG z aria-label i lista tekstowa', () => { const c = potCard(PH(PN('70', '12'))); return c.includes('<svg') && c.includes('role="img"') && /aria-label="[^"]{10,}/.test(c) && ['Teraz', 'Mediana 18-34 lat', 'Pułap FFMI 25 (Kouri 1995)', '95% maksimum (Butt)', 'Maksimum (Butt)'].every((s) => c.includes(s)); });
tryc('potencjał karta: wartości w liście zgodne z potKouri/potButt', () => { view('set', PQ(PN('70', '12'))); const k = T.potKouri(), b = T.potButt(), c = potCard(PH(PN('70', '12'))), f = (x) => (Math.round(x * 10) / 10).toLocaleString('pl-PL'); return c.includes(f(k.ffmCap)) && c.includes(f(b.m)) && c.includes(f(b.m95)) && c.includes(f(70)); });
tryc('potencjał karta: bez Butta przy braku nadgarstka, z podpowiedzią', () => { const c = potCard(PH({ frame: { wrist: '', ankle: '22,5' }, ...PN('70', '12') })); return c.includes('Pułap FFMI 25 (Kouri 1995)') && !c.includes('Maksimum (Butt)') && !c.includes('95% maksimum (Butt)') && c.includes('Wpisz nadgarstek i kostkę'); });
tryc('potencjał karta: Butt z oznaczeniem źródła wtórnego, bez note warn', () => { const c = potCard(PH(PN('70', '12'))); return c.includes('wzór przepisany przez kalkulator, strona autora niedostępna') && !c.includes('class="note warn"') && c.includes('pubmed.ncbi.nlm.nih.gov/7496846') && c.includes('weighttraining.nz'); });
tryc('potencjał karta: „nie cel”, „do pułapu z badań”, bez „brakuje”', () => { const c = potCard(PH(PN('70', '12'))); return c.includes('Pułap to górna granica z badań, nie cel. Wiele osób łączy siłę z wytrzymałością i świadomie zostaje poniżej.') && c.includes('do pułapu z badań') && !c.includes('brakuje'); });
tryc('potencjał karta: notka z datą pomiaru FFM', () => { const c = potCard(PH(PN('70', '12'))); const d = dk(1); return c.includes(d.slice(8, 10) + '.' + d.slice(5, 7) + '.' + d.slice(0, 4)); });
tryc('potencjał karta: K ma zdanie o mężczyznach i wskazanie FFMI / Dużo mięśni, bez osi', () => { const c = potCard(PH({ sex: 'K', ...PN('55', '25') })); return c.includes('id="potencjal"') && c.includes('tylko u mężczyzn') && c.includes('Dużo mięśni') && !c.includes('<svg'); });
tryc('potencjał karta: brak FFM -> brak karty', () => { const h = PH(); return !h.includes('id="potencjal"') && h.includes('id="bialko"'); });
tryc('potencjał karta: FFM powyżej pułapu -> odległość 0, bez „brakuje”', () => { const c = potCard(PH(PN('90', '12'))); return c.includes('id="potencjal"') && !c.includes('brakuje') && !c.includes('NaN'); });
tryc('potencjał karta: SRC ma kouri i butt', () => T.SRC.kouri[0].includes('7496846') && T.SRC.butt[0].includes('weighttraining.nz'));
// Sprawność (18.11.2026): VO2max z zegarka albo szacunek Uth 2004 (15,3 x HRmax / HRspoczynkowe); progi MET z Kodama 2009; wartości zmyślone
const FQ = (m, o) => GB({ sex: 'M', age: '30', meas: m, ...o });
const FV = (v, n = 1) => ({ [dk(n)]: { vo2: v } });
const fh = (h) => { const i = h.indexOf('id="sprawnosc"'), j = h.indexOf('id="bialko"'); return i < 0 || j < i ? '' : h.slice(i, j); };
tryc('sprawność: VO2max 45 z zegarka -> met 12,86, wysoka, toNext 0, src zegarek', () => { view('set', FQ(FV('45'))); const r = T.fitNow(); return !!r && r.src === 'zegarek' && Math.abs(r.met - 45 / 3.5) < 0.01 && r.cat === 'wysoka' && r.toNext === 0 && r.vo2 === 45 && r.hrMaxSrc === null; });
tryc('sprawność: VO2max 30 -> met 8,57, średnia, toNext 2,33', () => { view('set', FQ(FV('30'))); const r = T.fitNow(); return r.cat === 'średnia' && Math.abs(r.met - 8.571) < 0.01 && Math.abs(r.toNext - (10.9 - 30 / 3.5)) < 0.01; });
tryc('sprawność: VO2max 25 -> met 7,14, niska, toNext 0,76', () => { view('set', FQ(FV('25'))); const r = T.fitNow(); return r.cat === 'niska' && Math.abs(r.met - 7.143) < 0.01 && Math.abs(r.toNext - (7.9 - 25 / 3.5)) < 0.01; });
tryc('sprawność: szacunek Uth, tętno spocz. 60, wiek 30 -> hrMax 187, vo2 47,69, hrMaxSrc wiek', () => { view('set', FQ({ [dk(1)]: { hrRest: '60' } })); const r = T.fitNow(); return !!r && r.src === 'szacunek' && r.hrMaxSrc === 'wiek' && Math.abs(r.vo2 - 15.3 * 187 / 60) < 0.01; });
tryc('sprawność: szacunek z wpisanym hrMax 195 i hrRest 65 -> vo2 45,9, hrMaxSrc wpis', () => { view('set', FQ({ [dk(2)]: { hrMax: '195' }, [dk(1)]: { hrRest: '65' } })); const r = T.fitNow(); return r.src === 'szacunek' && r.hrMaxSrc === 'wpis' && Math.abs(r.vo2 - 15.3 * 195 / 65) < 0.01; });
tryc('sprawność: zegarek ma pierwszeństwo przed szacunkiem, także gdy tętno nowsze', () => { view('set', FQ({ [dk(5)]: { vo2: '40' }, [dk(1)]: { hrRest: '60' } })); const r = T.fitNow(); return r.src === 'zegarek' && r.vo2 === 40; });
tryc('sprawność: null bez danych; szacunek null przy wieku startowym bez hrMax', () => { view('set', FQ({})); const a = T.fitNow() === null; view('set', FQ({ [dk(1)]: { hrRest: '60' } }, { touched: {} })); const b = T.fitNow() === null; view('set', FQ({ [dk(1)]: { hrRest: '60', hrMax: '190' } }, { touched: {} })); return a && b && T.fitNow().hrMaxSrc === 'wpis'; });
tryc('karta sprawność: przy szacunku „szacunek”, „błąd około 8%”, tylko wytrenowani mężczyźni', () => { const c = fh(view('health', FQ({ [dk(1)]: { hrRest: '60' } }))); return c.includes('szacunek') && c.includes('błąd około 8%') && c.includes('Badanie objęło tylko wytrenowanych mężczyzn, więc wzór jest sprawdzony tylko u nich.') && (c.match(/wytrenowanych mężczyzn/g) || []).length === 1 && !c.includes('na poziomie niska') && !c.includes('na poziomie średnia') && !c.includes('u Ciebie mniej pewny') && fh(view('health', FQ({ [dk(1)]: { hrRest: '60' } }, { sex: 'K' }))).includes('u Ciebie mniej pewny'); });
tryc('karta sprawność: wpis z zegarka bez zdań o szacunku', () => { const c = fh(view('health', FQ(FV('30')))); return c.includes('id="sprawnosc"') && !c.includes('błąd około 8%') && c.includes('średnia'); });
tryc('karta sprawność: „do następnego progu: X MET”, zdanie o 13%, bez note warn', () => { const c = fh(view('health', FQ(FV('30')))); return c.includes('Do następnego progu: 2,3 MET') && c.includes('1 MET więcej wiązał się w metaanalizie z ryzykiem zgonu niższym o 13%') && !c.includes('class="note warn"') && c.includes('1 MET to realny krok'); });
tryc('karta sprawność: brak danych -> podpowiedź, wspólny nagłówek Sylwetka i sprawność', () => { const h = view('health', FQ({})); const c = fh(h); return c.includes('Wpisz VO2max z zegarka albo tętno spoczynkowe w Mój dzień, Sprawność') && h.includes('<h2 id="sylwetka">Sylwetka i sprawność</h2>') && h.indexOf('id="sylwetka"') < h.indexOf('id="sprawnosc"'); });
tryc('karta sprawność: źródła uth, tanaka, jette, kodama w SRC', () => [['uth', '14624296'], ['tanaka', '11153730'], ['jette', '2204507'], ['kodama', '19454641']].every(([k, p]) => T.SRC[k] && T.SRC[k][0].includes(p)));
tryc('sprawność: pola VO2max, tętno spoczynkowe i maksymalne w sekcji Sprawność po Tanicie', () => { const h = view('day', FQ({})); const i = h.indexOf('data-fold="tanita"'), j = h.indexOf('data-fold="sprawnosc"'); return i > 0 && j > i && ['m_vo2', 'm_hrRest', 'm_hrMax'].every((x) => h.slice(j).includes('id="' + x + '"')); });
tryc('sprawność: zakresy pól vo2 10-90, hrRest 30-120, hrMax 120-230', () => T.checkNum('meas.x.hrRest', '25').err && T.checkNum('meas.x.hrMax', '230').err === undefined && T.checkNum('meas.x.hrMax', '231').err && T.checkNum('meas.x.vo2', '9').err && T.checkNum('meas.x.vo2', '91').err && !T.checkNum('meas.x.vo2', '45').err && !T.checkNum('meas.x.hrRest', '60').err);
// Prosty widok i karta „Szybki wpis dnia”
const LK = () => T.todayKey();
const liteReset = () => { const S = T.S(); S.lite = true; S.meas = {}; S.pain = {}; S.days = {}; S.onb = true; };
// Imiona według gatunku (21.11.2026): zwierzak zapisany przed zmianą, bez nadanego imienia, zachowuje dotychczasową „Kluskę” (kotek miał już „Mruczka”)
tryc('imiona: zapisany stan bez petNames: gąska i kapibara bez imienia dostają na stałe Kluska, kotek i nadane imię bez zmian; nowy stan i kopia z petNames bez migracji', () => {
  const g = sandbox.localStorage.getItem, L = (o) => { sandbox.localStorage.getItem = () => JSON.stringify(o); return T.load(); }; let r;
  try { const fresh = (sandbox.localStorage.getItem = g, T.load());
    const a = L({ pet: { kind: 'gaska', name: '', since: '2026-11-01' } }), b = L({ pet: { kind: 'kapibara', name: '  ', since: '2026-11-01' } }), c = L({ pet: { kind: 'kotek', name: '', since: '2026-11-01' } }),
      d = L({ pet: { kind: 'gaska', name: 'Gęgusia', since: '2026-11-01' } }), e = L({ petNames: 1, pet: { kind: 'gaska', name: '', since: '2026-11-21' } }), f = L({ days: {} });
    r = fresh.petNames === 1 && a.pet.name === 'Kluska' && a.petNames === 1 && b.pet.name === 'Kluska' && c.pet.name === '' && d.pet.name === 'Gęgusia' && e.pet.name === '' && (f.pet == null || !f.pet.name)
      && vm.runInContext('BK_NH_KEEP', sandbox).includes('petNames');
  } finally { sandbox.localStorage.getItem = g; }
  return r;
});
tryc('prosty widok: świeży stan ma lite, zapisany stan bez pola lite go nie dostaje', () => {
  const g = sandbox.localStorage.getItem; let a, b;
  try { a = T.load().lite; sandbox.localStorage.getItem = () => '{"days":{"2026-01-01":[]}}'; b = T.load().lite; } finally { sandbox.localStorage.getItem = g; }
  return a === true && b === false;
});
tryc('prosty widok: Mój dzień ma tylko kartę, zwierzaka i Pokaż całą Miarę', () => {
  liteReset(); const h = view('day', { pet: null });
  return h.includes('id="lite"') && h.includes('data-litefull') && h.includes('Pokaż całą Miarę') && !h.includes('Pierwsze kroki') && !h.includes('data-fold="wiecej"');
});
tryc('karta: szybki wpis zapisuje stepsB (dawny zakres), feel, redz i daje liteFull', () => {
  liteReset(); view('day', {}); const k = LK();
  click({ lite: 'stepsB:mid' }); click({ lite: 'feel:dobrze' }); const half = !T.liteFull(k); click({ lite: 'redz:0' });
  const m = T.S().meas[k], h = mainHtml();
  return half && m.stepsB === 'mid' && m.feel === 'dobrze' && m.redz === 0 && T.liteFull(k) === true && h.includes('✓ Zapisane na dziś:') && !h.includes('data-lite=');
});
tryc('karta: ponowne dotknięcie wybranego żetonu zostawia wybór', () => {
  liteReset(); view('day', {}); const k = LK(); click({ lite: 'redz:2' }); click({ lite: 'redz:2' }); click({ lite: 'stepsB:lo' }); click({ lite: 'stepsB:lo' });
  const m = T.S().meas[k]; return m.redz === 2 && m.stepsB === 'lo';
});
tryc('karta: Ból głowy tworzy dzień z bólem z card, zmiana na Dobrze go usuwa; ręczny dzień z bólem zostaje', () => {
  liteReset(); view('day', {}); const k = LK();
  click({ lite: 'feel:glowa' }); const a = JSON.stringify(T.S().pain[k]) === '{"aura":false,"med":false,"card":true}';
  click({ lite: 'feel:dobrze' }); const b = !T.S().pain[k];
  T.S().pain[k] = { aura: false, med: false }; click({ lite: 'feel:glowa' }); click({ lite: 'feel:brzuch' });
  return a && b && !!T.S().pain[k] && T.S().meas[k].feel === 'brzuch';
});
tryc('karta: liczba kroków 9000 daje stepsBand hi bez zapisu stepsB', () => {
  liteReset(); view('day', {}); const k = LK(); T.S().meas[k] = { steps: '9000' };
  const band = T.stepsBand(k) === 'hi'; click({ lite: 'stepsB:lo' });
  const m = T.S().meas[k]; return band && m.stepsB === undefined && T.stepsBand(k) === 'hi';
});
tryc('karta: zakresy kroków z liczby i z stepsB', () => {
  const S = T.S(); S.meas = { a: { steps: '4999' }, b: { steps: '5000' }, c: { steps: '8000' }, d: { steps: '8001' }, e: { stepsB: 'mid' }, f: {} };
  return ['lo', 'mid', 'mid', 'hi', 'mid', ''].every((v, i) => T.stepsBand('abcdef'[i]) === v);
});
tryc('karta: bez słów o ograniczeniu, z podpisem jedzenia kalorycznego', () => {
  liteReset(); const h = T.liteCardHtml();
  return h.includes('Szybki wpis dnia') && h.includes('słodycze, fast food, słone przekąski, alkohol') && h.includes('2 lub więcej') && !/ograniczon|brakuje|niekompletn/i.test(h) && h.includes('Wstępne badania: krótki zapis codziennie działał podobnie jak pełny.');
});
tryc('kopia bez danych o zdrowiu: lite, unlock, unlockAt, unlockSnooze w BK_NH_KEEP; stepsB, feel, redz poza nią (w meas)', () => {
  liteReset(); const S = T.S(); S.meas[LK()] = { stepsB: 'hi', feel: 'dobrze', redz: 1 };
  const k = T.nhKeep(), d = JSON.parse(T.bkBuild(true)).data;
  return ['lite', 'unlock', 'unlockAt', 'unlockSnooze'].every((x) => k.includes(x)) && !k.includes('meas') && !('meas' in d);
});
const FULL = (k, o) => { T.S().meas[k] = Object.assign({ stepsB: 'mid', feel: 'dobrze', redz: 0 }, o || {}); };
tryc('pełna karta liczy się do serii i daje co najmniej 30 punktów zwierzakowi', () => {
  liteReset(); const k = LK(); FULL(k);
  return T.dayOk(k) === true && T.petCtx().dayPts(k) >= 30;
});
tryc('częściowa karta (tylko feel: inne) nie liczy się do serii', () => {
  liteReset(); const k = LK(); T.S().meas[k] = { feel: 'inne' };
  return T.dayOk(k) === false && T.petCtx().dayPts(k) < 30;
});
tryc('jajko: 2 dni z pełną kartą dają eggCrack 2; przełączenie lite na false nie zmniejsza wyniku', () => {
  liteReset(); FULL('2026-01-01'); FULL('2026-01-02'); const S = T.S();
  const a = T.eggCrack(), b = T.liteDays(), c = T.liteDays('2026-01-01'); S.lite = false;
  return a === 2 && b === 2 && c === 1 && T.eggCrack() >= 2;
});
tryc('licznik na zakładce w prostym widoku: 1 przed kartą, 0 po pełnej karcie', () => {
  liteReset(); const k = LK(); const a = T.dayLeft(); FULL(k); return a === 1 && T.dayLeft() === 0;
});
tryc('zwierzak bez zależności od wartości: stan dla redz 2 i stepsB lo równy stanowi dla redz 0 i stepsB hi', () => {
  const st = (o) => { liteReset(); T.S().pet = { kind: 'gaska', name: 'K' }; FULL(LK(), o); const r = T.PET.state(T.petCtx()); return JSON.stringify(r); };
  return st({ redz: 2, stepsB: 'lo' }) === st({ redz: 0, stepsB: 'hi' });
});
tryc('load: błąd parsowania zapisu nie daje lite, brak zapisu daje', () => {
  const g = sandbox.localStorage.getItem; let a, b;
  try { sandbox.localStorage.getItem = () => '{zepsute'; a = T.load().lite; sandbox.localStorage.getItem = () => null; b = T.load().lite; } finally { sandbox.localStorage.getItem = g; }
  return a === false && b === true;
});
tryc('karta: Ból głowy odtwarza wpis bólu, gdy feel to już glowa, a wpisu brak', () => {
  liteReset(); view('day', {}); const k = LK(); click({ lite: 'feel:glowa' }); delete T.S().pain[k]; click({ lite: 'feel:glowa' });
  return JSON.stringify(T.S().pain[k]) === '{"aura":false,"med":false,"card":true}';
});
tryc('Pokaż całą Miarę wyłącza lite i pokazuje pełny widok', () => {
  liteReset(); const pre = view('day', {}); click({ litefull: '1' }); const h = mainHtml();
  return pre.includes('data-litefull') && T.S().lite === false && h.includes('data-fold="wiecej"');
});
tryc('ustawienia (F1a): wybór Prosty i Cała Miara zmienia S.lite', () => {
  liteReset(); const setH = view('set', {}); click({ view: 'cala' }); const off = T.S().lite === false; click({ view: 'prosty' });
  return setH.includes('data-view="prosty"') && off && T.S().lite === true && T.S().focus === false;
});
tryc('jajko: podpis w prostym widoku mówi o dniach z szybkim wpisem, w pełnym o pierwszych krokach', () => {
  liteReset(); T.S().pet = null; const a = T.petCardHtml(); T.S().lite = false; const b = T.petCardHtml();
  T.S().pet = { kind: 'gaska', name: 'K', since: '2999-01-01' }; T.S().lite = true; const c = T.petCardHtml(); T.S().lite = false; const d = T.petCardHtml();
  return a.includes('Jajko pęka z każdym dniem z szybkim wpisem: ') && b.includes('Jajko pęka z każdym pierwszym krokiem: ')
    && c.includes('Dni z szybkim wpisem: ') && !c.includes('Pierwsze kroki: pęknięcia') && d.includes('Pierwsze kroki: pęknięcia ');
});
// Stopniowe odkrywanie
const dAdd = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return T.todayKey().slice(0, 0) + d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const unlockReset = () => { liteReset(); const S = T.S(); S.unlock = []; S.unlockAt = '2025-12-31'; S.unlockSnooze = ''; };
const fullDays = (a) => a.forEach((k) => FULL(k));
tryc('odkrywanie: brak propozycji przed 3 dniami z pełną kartą; po 3 dniach propozycja waga', () => {
  unlockReset(); fullDays(['2026-01-01', '2026-01-02']); const a = T.unlockNext(); const ha = view('day', {});
  FULL('2026-01-03'); const b = T.unlockNext(); const hb = view('day', {});
  return a === null && !ha.includes('data-unlock=') && b === 'waga' && hb.includes('data-unlock="waga"') && hb.includes('data-unlocklater="1"') && hb.includes('Dodać wagę? Jedno pole rano. Bez wagi kalorie są liczone w przybliżeniu.') && hb.includes('>Dodaj<') && hb.includes('>Nie teraz<');
});
tryc('odkrywanie: Dodaj dopisuje waga, pokazuje pole m_w; kolejna propozycja (posilki) dopiero po 3 nowych dniach', () => {
  unlockReset(); fullDays(['2026-01-01', '2026-01-02', '2026-01-03']); view('day', {}); click({ unlock: 'waga' }); const S = T.S(); const k = LK();
  const h = mainHtml(); const a = S.unlock.join() === 'waga' && S.unlockAt === k && h.includes('id="m_w"') && h.includes('data-row="w"') && !h.includes('Dodać wagę?') && T.unlockNext() === null;
  S.unlockAt = '2026-01-03'; fullDays(['2026-01-04', '2026-01-05']); const mid = T.unlockNext() === null; FULL('2026-01-06');
  const hp = view('day', {});
  return a && mid && T.unlockNext() === 'posilki' && hp.includes('Dodać posiłki z planu? „Zjem” przy daniu zapisuje posiłek jednym dotknięciem.');
});
tryc('odkrywanie: posilki i sen pokazują wiersz posiłków z licznikiem i pole m_sleep', () => {
  unlockReset(); const S = T.S(); S.unlock = ['waga', 'posilki', 'sen']; S.days[LK()] = [{ kind: 'm', id: 'x', label: 'a', k: 1, p: 1, f: 1, c: 1 }, { kind: 't', label: 't' }];
  const h = view('day', {}); const i = h.indexOf('Posiłki z planu');
  return i > 0 && h.includes('data-tab="meals"') && h.includes('id="m_sleep"') && h.includes('data-row="w"') && /Posiłki z planu[\s\S]{0,200}Zapisane dziś: 1/.test(h.slice(i)) && !/<label>Posiłki z planu/.test(h);
});
tryc('odkrywanie: Nie teraz chowa propozycję na 7 dni mimo 3 nowych dni z kartą; po 7 dniach wraca', () => {
  unlockReset(); fullDays(['2026-01-01', '2026-01-02', '2026-01-03']); view('day', {}); const S = T.S(); const before = JSON.stringify(S.unlock);
  click({ unlocklater: '1' }); const k = LK(); const a = S.unlockAt === k && S.unlockSnooze === dAdd(7) && T.unlockNext() === null && JSON.stringify(S.unlock) === before;
  fullDays(['2026-01-04', '2026-01-05', '2026-01-06']); S.unlockAt = '2026-01-03'; const b = T.unlockNext() === null;
  S.unlockSnooze = dAdd(1); const c = T.unlockNext() === null; S.unlockSnooze = k; const d = T.unlockNext() === 'waga';
  return a && b && c && d;
});
tryc('odkrywanie: Pokaż przy cala ustawia lite false; unlock zostaje po ponownym włączeniu lite', () => {
  unlockReset(); const S = T.S(); S.unlock = ['waga', 'posilki', 'sen']; fullDays(['2026-01-01', '2026-01-02', '2026-01-03']);
  const nx = T.unlockNext(); const h = view('day', {}); click({ unlock: 'cala' });
  const a = nx === 'cala' && h.includes('Chcesz zobaczyć całą Miarę? Wszystko, co dodasz, zostaje.') && h.includes('>Pokaż<') && S.lite === false && S.unlock.includes('cala') && S.unlockAt === LK();
  S.lite = true; return a && S.unlock.join() === 'waga,posilki,sen,cala' && T.unlockNext() === null;
});
tryc('odkrywanie: poza prostym widokiem unlockNext zwraca null', () => {
  unlockReset(); fullDays(['2026-01-01', '2026-01-02', '2026-01-03']); const a = T.unlockNext(); T.S().lite = false; return a === 'waga' && T.unlockNext() === null;
});
tryc('zwierzak: petCtx niesie lite i liteFull, ekran jajka w prostym widoku renderuje się z pęknięciami z dni karty', () => {
  liteReset(); T.S().pet = { kind: 'gaska', name: 'K', since: '2999-01-01' }; fullDays(['2026-01-01', '2026-01-02']); const h = view('pet', {});
  return T.petCtx().lite === true && h.includes('petstage') && (h.match(/class="crack"/g) || []).length === 2;
});
// Poprawki końcowe prostego widoku (19.11.2026)
const at15 = () => { const n = new Date(); n.setHours(15, 0, 0, 0); return n; };
tryc('zwierzak w prostym widoku: po 12:00 bez karty nie jest głodny ani zmęczony, mówi „czeka na szybki wpis.”', () => {
  liteReset(); T.S().pet = { kind: 'gaska', name: 'K', since: '2999-01-01' }; const s = T.PET.state(T.petCtx(at15()));
  return s.mood !== 'hungry' && s.mood !== 'tired' && s.line.includes('czeka na szybki wpis.') && !s.line.includes('posiłk');
});
tryc('zwierzak w prostym widoku: po pełnej karcie po 12:00 nie jest głodny ani zmęczony, paski posiłków i energii co najmniej 70', () => {
  liteReset(); T.S().pet = { kind: 'gaska', name: 'K', since: '2999-01-01' }; FULL(LK()); const s = T.PET.state(T.petCtx(at15()));
  return s.mood !== 'hungry' && s.mood !== 'tired' && s.meters.food >= 70 && s.meters.energy >= 70;
});
tryc('zwierzak w prostym widoku: nastrój po 12:00 nie zależy od wybranych wartości', () => {
  const st = (o) => { liteReset(); T.S().pet = { kind: 'gaska', name: 'K' }; FULL(LK(), o); return JSON.stringify(T.PET.state(T.petCtx(at15()))); };
  return st({ redz: 2, stepsB: 'lo', feel: 'inne' }) === st({ redz: 0, stepsB: 'hi', feel: 'dobrze' });
});
tryc('zwierzak w pełnym widoku: po 12:00 bez posiłku nadal czeka na wpis posiłku', () => {
  const S = T.S(); S.lite = false; S.pet = { kind: 'gaska', name: 'K', since: '2999-01-01' }; S.meas = {}; S.days = {}; S.pain = {};
  const s = T.PET.state(T.petCtx(at15())); S.lite = true; return s.mood === 'hungry' && s.line.includes('czeka na wpis posiłku');
});
tryc('karta: przejście do pełnej karty daje komunikat „Dzień zapisany” tylko raz, jednym ogłoszeniem (#sr), bez drugiego w komunikacie toast', () => {
  const sr = () => mk('sr').textContent.includes('Dzień zapisany');
  liteReset(); T.liteUi().open = ''; view('day', {}); els.toast.innerHTML = ''; mk('sr').textContent = ''; click({ lite: 'stepsB:mid' }); click({ lite: 'feel:dobrze' }); const a = sr();
  click({ lite: 'redz:0' }); const b = sr() && !els.toast.innerHTML.includes('Dzień zapisany'); mk('sr').textContent = ''; T.liteUi().open = LK(); click({ lite: 'redz:1' }); const c = sr() || els.toast.innerHTML.includes('Dzień zapisany'); T.liteUi().open = '';
  return !a && b && !c;
});
tryc('prosty widok: guideActive jest nieaktywne, Dalej nie każe wpisać wagi', () => {
  liteReset(); T.S().guide = { hidden: false, dataOk: false, seenPet: false }; return T.guideActive() === false && !T.guideToast('Zapisano').includes('Dalej');
});
tryc('arkusz Dodaj wpis w prostym widoku: karta, bez wagi, snu i kroków przed odkryciem', () => {
  liteReset(); T.S().unlock = []; view('day', {}); click({ addsheet: '1' }); const h = sheetH();
  return h.includes('data-nav="day#lite"') && h.includes('Szybki wpis dnia') && !h.includes('day#m_w') && !h.includes('day#m_sleep') && !h.includes('day#m_steps') && h.includes('data-tab="meals"') && h.includes('data-tab="train"') && h.includes('data-pain="today"');
});
tryc('arkusz Dodaj wpis w prostym widoku: waga i sen po odkryciu, kroki nigdy', () => {
  liteReset(); T.S().unlock = ['waga', 'sen']; view('day', {}); click({ addsheet: '1' }); const h = sheetH(); T.S().unlock = [];
  return h.includes('day#m_w') && h.includes('day#m_sleep') && !h.includes('day#m_steps');
});
tryc('prosty widok: data-nav do pola spoza widoku pokazuje komunikat z Pokaż całą Miarę, a przycisk włącza pełny widok', () => {
  liteReset(); T.S().unlock = []; view('day', {}); els.toast.innerHTML = ''; click({ nav: 'day#m_steps' });
  const h = els.toast.innerHTML, a = h.includes('To pole jest w całej Miarze') && h.includes('data-litefull="1"') && h.includes('Pokaż całą Miarę') && T.S().lite === true;
  click({ litefull: '1' }); return a && T.S().lite === false;
});
tryc('prosty widok: skrót #dodaj-waga bez odkrytej wagi pokazuje komunikat, z odkrytą nie', () => {
  liteReset(); T.S().unlock = []; els.toast.innerHTML = ''; const a = T.quickFromHash('#dodaj-waga'); const m = els.toast.innerHTML.includes('To pole jest w całej Miarze');
  T.S().unlock = ['waga']; els.toast.innerHTML = ''; T.quickFromHash('#dodaj-waga'); const n = els.toast.innerHTML.includes('To pole jest w całej Miarze'); T.S().unlock = [];
  return a && m && !n;
});
tryc('licznik na zakładce w prostym widoku: dzień z bólem głowy daje 0', () => {
  liteReset(); T.S().pain[LK()] = { aura: false, med: false }; return T.dayLeft() === 0;
});
tryc('karta: zmiana z Bólu głowy zostawia wpis, gdy ustawiono aurę lub lek', () => {
  liteReset(); view('day', {}); const k = LK();
  click({ lite: 'feel:glowa' }); T.S().pain[k].aura = true; click({ lite: 'feel:dobrze' }); const a = !!T.S().pain[k];
  delete T.S().pain[k]; click({ lite: 'feel:glowa' }); T.S().pain[k].med = true; click({ lite: 'feel:brzuch' }); return a && !!T.S().pain[k];
});
tryc('scenariusz start: ma lite i opis karty „Szybki wpis dnia”', () => T.scenS('start').lite === true && T.SCEN.start.chk.includes('Szybki wpis dnia') && !T.SCEN.start.chk.includes('0 z 6'));
tryc('zwierzak: podpis jajka w prostym widoku o pierwszym szybkim wpisie, w pełnym bez zmian', () => {
  liteReset(); T.S().pet = { kind: 'gaska', name: 'K', since: '2999-01-01' }; const a = T.petCardHtml(); T.S().lite = false; const b = T.petCardHtml(); T.S().lite = true;
  return a.includes('Jajo wykluje się po pierwszym szybkim wpisie.') && !a.includes('30 punktami') && b.includes('Jajo wykluje się po dniu z co najmniej 30 punktami.');
});
// Scenariusze z danymi testowymi (18.11.2026): sport-m, sport-k, sport-h z danymi zmyślonymi; odczyty startowe tylko w wersji prywatnej, sprawdzane, gdy są
const SPN = ['sport-m', 'sport-k', 'sport-h'], LAB_ID = ['tsh', 'glu', 'ins', 'hba1c', 'vitd', 'ferr', 'chol', 'ldl', 'hdl', 'tg', 'kreat'];
const scenLabsOk = (s) => { view('set', s); return LAB_ID.every((id) => s.labs.some((e) => e.test === id)) && s.labs.every((e) => { const L = T.LABS.find((x) => x.id === e.test); return !L.tg || T.labStatus(e).t.startsWith('w zakresie docelowym'); }) && s.labs.some((e) => e.test === 'kreat' && /mg/i.test(e.unit)) && new Set(s.labs.map((e) => e.date)).size === 1; };
const scenDays = (s, k) => Object.values(s.meas).filter((m) => T.num(m[k]) > 0).length;
const scenBody = (s) => s.frame && T.num(s.frame.wrist) > 0 && T.num(s.frame.ankle) > 0 && Object.values(s.meas).some((m) => T.num(m.ffm) > 0 && T.num(m.fat) > 0) && s.touched.age && s.touched.cm && scenDays(s, 'w') >= 14 && scenDays(s, 'steps') >= 14;
tryc('scenariusze sportowe: sport-m, sport-k, sport-h z tytułem „dane zmyślone”, opisem i przyciskiem w Pomocy', () => { const h = view('help', BASE()); return SPN.every((n) => T.SCEN[n] && T.SCEN[n].t.includes('(dane zmyślone)') && T.SCEN[n].chk.length > 30 && h.includes(`data-scen="${n}"`)); });
tryc('scenariusz sport-m: M, nadgarstek i kostka, pomiar z ffm i tłuszczem, 14+ dni wagi i kroków, wiek ustawiony', () => { const s = T.scenS('sport-m'); return s.sex === 'M' && scenBody(s) && s.muscle === true && s.mode === 'utrzymanie'; });
tryc('scenariusz sport-m: waga ±0,5 kg, kroki 9-12 tys., sen 7-8 h, 3 treningi siłowe w tygodniu', () => { const s = T.scenS('sport-m'), M = Object.entries(s.meas).filter(([k]) => k >= dk(27)), w = M.map(([, m]) => T.num(m.w)), st = M.map(([, m]) => T.num(m.steps)), sl = M.map(([, m]) => T.num(m.sleep)); const tr = Array.from({ length: 7 }, (_, i) => (s.days[dk(i)] || []).filter((e) => e.kind === 't').length).reduce((a, c) => a + c, 0); return M.length >= 28 && Math.max(...w) - Math.min(...w) <= 1.0001 && st.every((v) => v >= 9000 && v <= 12000) && sl.every((v) => v >= 7 && v <= 8) && tr === 3; });
tryc('scenariusz sport-m: badania z jednej daty, wszystkie z celem w zakresie docelowym, kreatynina w mg/dl', () => scenLabsOk(T.scenS('sport-m')));
tryc('scenariusz sport-k: badania w zakresie (HDL dla kobiet)', () => scenLabsOk(T.scenS('sport-k')));
tryc('scenariusz sport-h: badania w zakresie', () => scenLabsOk(T.scenS('sport-h')));
tryc('scenariusz sport-m: karta potencjału z wariantem Butta, eGFR i nie-HDL', () => { const h = view('health', T.scenS('sport-m')); const c = potCard(h); return c.includes('Maksimum (Butt)') && T.egfrRows().length === 1 && T.nonHdlRows().length === 1 && fh(h).includes('wysoka'); });
tryc('scenariusz sport-k: K, karta z „tylko u mężczyzn”, bez osi', () => { const s = T.scenS('sport-k'); const c = potCard(view('health', s)); return s.sex === 'K' && scenBody(s) && c.includes('tylko u mężczyzn') && !c.includes('<svg'); });
tryc('scenariusz sport-h: karta potencjału i karta sprawności, poziom „wysoka”', () => { const s = T.scenS('sport-h'); const h = view('health', s); const r = T.fitNow(); return s.sex === 'M' && scenBody(s) && potCard(h).includes('Maksimum (Butt)') && fh(h).includes('id="sprawnosc"') && !!r && r.cat === 'wysoka' && r.src === 'zegarek'; });
tryc('scenariusze sportowe: VO2max i tętno spoczynkowe co tydzień', () => SPN.every((n) => { const s = T.scenS(n); return scenDays(s, 'vo2') >= 4 && scenDays(s, 'hrRest') >= 4; }));
tryc('scenariusz sport-m w trybie pokazowym: save() nie woła localStorage.setItem', () => { let n = 0; const o = sandbox.localStorage.setItem; sandbox.localStorage.setItem = () => { n++; }; T.setDemo(true); view('health', T.scenS('sport-m')); T.save(); click({ mode: 'utrzymanie' }); T.setDemo(false); sandbox.localStorage.setItem = o; return n === 0; });
tryc('scenariusze z odczytu startowego (tylko wersja prywatna): K i M z pomiarem, obwodami i badaniami', () => { const P = Object.keys(T.SCEN).filter((n) => T.SCEN[n].t.startsWith('Mój odczyt startowy')); if (!P.length) return true; const ss = P.map((n) => T.scenS(n)); return P.length === 2 && ss.map((s) => s.sex).sort().join() === 'K,M' && ss.every((s) => scenBody(s) && scenLabsOk(s) && T.SCEN[P[0]].chk.length > 30); });
tryc('ekran startowy w prostym widoku: przycisk Zacznij od szybkiego wpisu, bez Pomiń', () => {
  liteReset(); const a = view('intro', { onb: false }); const lite = a.includes('Zacznij od szybkiego wpisu') && /class="btn"[^>]*data-introdone="1"|data-introdone="1"[^>]*class="btn"/.test(a) && !a.includes('>Pomiń<');
  T.S().lite = false; const b = view('intro', { onb: false });
  return lite && b.includes('>Pomiń<') && !b.includes('Zacznij od szybkiego wpisu');
});
tryc('źródła patel, nezami, harvey, burke z PMID', () => ['patel:36512404', 'nezami:35146942', 'harvey:30801989', 'burke:21185970'].every((x) => { const [k, id] = x.split(':'); return T.SRC[k] && T.SRC[k][0] === 'https://pubmed.ncbi.nlm.nih.gov/' + id + '/'; }));
tryc('scenariusz prosty: propozycja waga widoczna', () => { const h = view('day', T.scenS('prosty')); return h.includes('id="lite"') && h.includes('Dodać wagę?') && T.S().lite === true; });
// Karta „Dziś” (wpisy.js, 20.11.2026): sen i kroki z suwakiem, waga od ostatniego ważenia, wpis z klawiatury, jeden główny przycisk
tryc('wpisy: wartość startowa: dzisiejsza, inaczej ostatnia, waga z Twoich danych tylko po ich ustawieniu, inaczej typowa wyszarzona; nigdy pusta', () => {
  wpDay({ [dk(1)]: { w: '79' }, [dk(0)]: { w: '80' } }); const a = wpS('w').start; wpDay({ [dk(1)]: { w: '79' } }); const b = wpS('w').start;
  wpDay({}, { touched: { kg: true } }); const c = wpS('w').start; wpDay({}); const d = wpS('w').start, e = wpS('s').start, f = wpS('k').start, h = card(view('day', {}));
  return a.v === 80 && a.src === 'today' && b.v === 79 && b.src === 'last' && c.v === 82 && c.src === 'profile' && d.src === 'default' && d.v > 0 && e.v === 420 && e.src === 'default' && f.v === 5000
    && /<button class="wp-val wp-y" id="m_w"[^>]*>\d+,\d kg</.test(h) && h.includes('wpisz dzisiejszą wagę') && !h.includes('z Twoich danych');
});
tryc('wpisy: Pomiary dnia: wiersz wagi pokazuje ostatnie ważenie wyszarzone z datą i „wpisz dzisiejszą wagę” (waga to pomiar), nie puste pole', () => {
  const h = card(wpDay({ [dk(2)]: { w: '80,4' } }));
  return /<button class="wp-val wp-y" id="m_w"[^>]*>80,4 kg<\/button>/.test(h) && h.includes('wpisz dzisiejszą wagę') && h.includes('ostatnio: ' + dk(2).slice(8, 10) + '.' + dk(2).slice(5, 7) + '.' + dk(2).slice(0, 4)) && !/value=""/.test(h) && !h.includes('<input type="text"');
});
tryc('wpisy: waga bez żadnego ważenia: waga z ustawionych danych z podpisem „z Twoich danych”', () => { const h = card(wpDay({}, { touched: { kg: true } })); return /id="m_w"[^>]*>82,0 kg</.test(h) && h.includes('z Twoich danych'); });
tryc('wpisy: dzisiejsza wartość ma pierwszeństwo, bez wyszarzenia; stary zapis snu 7,5 to 7 h 30 min', () => { const h = card(wpDay({ [dk(1)]: { w: '80,4' }, [dk(0)]: { w: '79,9', sleep: '7,5' } })); return /<button class="wp-val" id="m_w"[^>]*>79,9 kg</.test(h) && /id="m_sleep"[^>]*>7 h 30 min</.test(h); });
tryc('wpisy: Pomiary dnia: karta z wierszami waga, sen, kroki zamiast pól; cele m_w, m_sleep, m_steps to przyciski wartości', () => {
  const full = wpDay({}), h = card(full);
  return ['m_w', 'm_sleep', 'm_steps'].every((id) => new RegExp('<button class="wp-val[^"]*" id="' + id + '"').test(h)) && !full.includes('data-sl=') && !full.includes(`data-k="meas.${dk(0)}.w"`) && !full.includes(`data-k="meas.${dk(0)}.steps"`)
    && full.indexOf('<article class="wp-card"') > full.indexOf('<h2>Pomiary dnia</h2>') && full.indexOf('<article class="wp-card"') < full.indexOf('data-imppaste');
});
tryc('wpisy: sen suwak 3-12 h co 5 min, kroki 0-20 000 co 50 (siatka zgrubna 15 min i 500 przy szybkim przesunięciu), waga bez suwaka; − i + przy każdym wierszu', () => {
  const h = card(wpDay({}));
  return /<input class="wp-range" type="range" id="wp_rs" min="180" max="720" step="5"/.test(h) && /<input class="wp-range" type="range" id="wp_rk" min="0" max="20000" step="50"/.test(h) && !h.includes('id="wp_rw"')
    && ['w', 's', 'k'].every((k) => h.includes(`data-wp="pm:${k}:-1"`) && h.includes(`data-wp="pm:${k}:1"`)) && h.includes('aria-label="0,1 kg więcej"');
});
tryc('wpisy: parser snu: 715, 7:15, 7,25 i 7 godzin, 613 to 6:13, 0:45, zły wpis z komunikatem', () => {
  const p = (t) => T.wpParse('s', t);
  return p('7:15').v === 435 && p('715').v === 435 && p('7,25').v === 435 && p('7').v === 420 && p('613').v === 373 && p('0:45').v === 45 && p('6,5').v === 390
    && /715 albo 7,25/.test(p('abc').err || '') && !!p('6a').err && /Minuty od 0 do 59/.test(p('6:75').err || '') && /Minuty od 0 do 59/.test(p('675').err || '') && /16 godzin/.test(p('17').err || '') && p('7:15').err === undefined;
});
tryc('wpisy: parser kroków i wagi: separator tysięcy, ułamek kroków odrzucony, waga do 0,1 kg, zakres 35-250', () => {
  const p = (k, t) => T.wpParse(k, t);
  return p('k', '8 250').v === 8250 && p('k', '10.500').v === 10500 && p('k', '10' + String.fromCharCode(160) + '000').v === 10000 && !!p('k', '8,5').err && !!p('k', '99999').err && !!p('k', 'x').err
    && p('w', '77,14').v === 77.1 && p('w', '82,4 kg').v === 82.4 && !!p('w', 'w').err && !!p('w', '20').err && !!p('w', '251').err;
});
tryc('wpisy: − i + w siatce kroku i w zakresie, zapis w formacie pól (80,5; 6:13; 8500)', () => {
  wpDay({}); const W = wpS('w'), Sl = wpS('s'), K = wpS('k'), s = WP().step, st = T.wpStore;
  return s(W, 80.4, 1) === 80.5 && s(W, 80.4, -1, 5) === 79.9 && s(W, 250, 1) === 250 && s(Sl, 435, 1) === 440 && s(Sl, 373, 1) === 375 && s(Sl, 373, -1) === 370 && s(Sl, 0, -1) === 0
    && s(K, 8225, 1) === 8250 && s(K, 5000, 1) === 5050 && s(K, 0, -1) === 0 && st('w', 80.5) === '80,5' && st('w', 80) === '80' && st('s', 373) === '6:13' && st('s', 45) === '0:45' && st('k', 8500) === '8500';
});
tryc('wpisy: główny przycisk to automat stanów: Jak wczoraj, Zatwierdź (N), Cofnij 5 s, Zobacz zmiany, Gotowe', () => {
  const L = WP().mainLabel, o = { changed: 0, saved: false, summaryOpen: false, hasYesterday: true, msSinceSave: 0 };
  return L(o) === 'Jak wczoraj' && L({ ...o, hasYesterday: false }) === 'Zatwierdź' && L({ ...o, changed: 1 }) === 'Zatwierdź (1)' && L({ ...o, changed: 3 }) === 'Zatwierdź (3)'
    && L({ ...o, saved: true, msSinceSave: 4999 }) === '✓ Zapisane · Cofnij' && L({ ...o, saved: true, msSinceSave: 5000 }) === 'Zobacz, co się zmieniło'
    && L({ ...o, saved: true, msSinceSave: 9000, summaryOpen: true }) === 'Gotowe na dziś' && L({ ...o, saved: true, msSinceSave: 100, changed: 2 }) === 'Zatwierdź (2)';
});
tryc('wpisy: kolejność wierszy: do 12:00 Waga, Sen, Kroki; od 18:00 Kroki, Sen, Waga; poza tym Sen, Kroki, Waga', () => {
  const R = WP().rowOrder; return R(6).join('') === 'wsk' && R(11).join('') === 'wsk' && R(12).join('') === 'skw' && R(17).join('') === 'skw' && R(18).join('') === 'ksw' && R(23).join('') === 'ksw';
});
tryc('wpisy: pas wahania ±0,35% wokół średniej 7 dni, to samo zdanie przy wzroście i spadku, „średnio w badaniu”', () => {
  const b = T.wpBand, up = b(77, 76.8), dn = b(76.6, 76.8), hi = b(77.1, 76.8), lo = b(76.5, 76.8), tail = (x) => x.text.slice(x.ds.length);
  return up.inside && dn.inside && !hi.inside && !lo.inside && up.ds === '+0,2 kg od średniej 7 dni' && dn.ds === '−0,2 kg od średniej 7 dni' && tail(up) === tail(dn) && tail(hi) === tail(lo) && tail(up) !== tail(hi)
    && /w badaniu wynosiło średnio/.test(up.text) && /w badaniu wynosiło średnio/.test(hi.text) && b(76.8, 76.8).inside;
});
tryc('wpisy: wykres 14 dni z pasem i źródłem PMID 32353079 tylko przy co najmniej 2 ważeniach', () => {
  const two = card(wpDay({ [dk(1)]: { w: '80,4' }, [dk(3)]: { w: '80,8' } })), one = card(wpDay({ [dk(1)]: { w: '80,4' } }));
  return /<svg class="wp-spark" id="wp_spark"[^>]*role="img"[^>]*aria-label="Waga z 14 dni/.test(two) && two.includes('class="wp-zone"') && two.includes('pubmed.ncbi.nlm.nih.gov/32353079/') && two.includes('id="wp_band"') && !one.includes('wp_spark') && !one.includes('id="wp_band"');
});
tryc('wpisy: „Jak wczoraj” zapisuje tylko sen i kroki z ostatnią wartością; onSaved woła PET.react; Cofnij przywraca', () => {
  wpDay({ [dk(1)]: { w: '80,4', sleep: '6:13', steps: '8500' } }); const o = wpSet();
  if (Object.keys(o.vals).sort().join() !== 'k,s' || o.vals.s !== 373 || o.vals.k !== 8500 || o.copied.sort().join() !== 'k,s') throw new Error('set ' + JSON.stringify(o));
  const P = sandbox.PET, r0 = P.react, seen = []; P.react = (x) => { seen.push(x); };
  try { T.wpOnSaved('w', 80.5); T.wpOnSaved('s', 373); const a = seen.join(); T.wpOnSaved('s', 450); if (a !== 'weigh' || !seen.includes('sleepok')) throw new Error(seen.join()); } finally { P.react = r0; }
  const prev = T.wpCommit(o.vals, o), t = T.S().meas[dk(0)], ok = t.sleep === '6:13' && t.steps === '8500' && t.w === undefined && t.cp.length === 2;
  T.wpRestore(prev); const r = T.S().meas[dk(0)];
  return ok && r.sleep === undefined && r.steps === undefined && r.cp === undefined;
});
tryc('wpisy: nic nie jest zgadywane: bez zmiany ani waga z Twoich danych, ani typowa nie trafia do zapisu; zapisuje się tylko zmieniony wiersz', () => {
  wpDay({}); const a = wpSet().vals; wpDay({}, { touched: { kg: true } }); const a2 = wpSet().vals;
  wpDay({ [dk(1)]: { w: '80,4' } }); const b = wpSet({ k: 9000 }).vals, c = wpSet().vals;
  return Object.keys(a).length === 0 && Object.keys(a2).length === 0 && Object.keys(b).join() === 'k' && b.k === 9000 && Object.keys(c).length === 0;
});
tryc('wpisy: wartości robocze przeżywają przerysowanie ekranu, zmiana dnia je czyści', () => {
  wpDay({ [dk(1)]: { w: '80,4' } }); wpD().w = 81.2; const a = card(view('day', {}));
  const b = WP().card({ ...T.wpCfg(), day: '2000-01-01' }), c = card(view('day', {}));
  return /id="m_w"[^>]*>81,2 kg</.test(a) && a.includes('>Zatwierdź (1)<') && !b.includes('81,2 kg') && !c.includes('81,2 kg');
});
tryc('wpisy: pole wpisu: waga z przecinkiem, sen i kroki z cyfr; Dalej w każdym wierszu poza ostatnim', () => {
  wpDay({}); const rows = T.wpCfg().rows, last = rows[rows.length - 1].key;
  return wpS('w').inputmode === 'decimal' && wpS('s').inputmode === 'decimal' && wpS('k').inputmode === 'numeric' && rows.slice(0, -1).every((R) => WP().enterHint(rows, R.key) === 'next') && WP().enterHint(rows, last) === 'done';
});
tryc('wpisy: prosty widok: karta tylko z odkrytymi wierszami, kroki zostają żetonami', () => {
  liteReset(); WP().reset(); const S = T.S(); S.unlock = []; const a = view('day', {}); S.unlock = ['waga']; const b = card(view('day', {})); S.unlock = ['waga', 'sen']; const c = card(view('day', {})); S.unlock = [];
  return !a.includes('wp-card') && b.includes('id="m_w"') && !b.includes('id="m_sleep"') && !b.includes('id="m_steps"') && c.includes('id="m_w"') && c.includes('id="m_sleep"') && !c.includes('id="m_steps"') && !c.includes('wp_rk');
});
tryc('wpisy: scenariusz prosty: po „Dodaj” przy wadze wiersz wagi ma ostatnie ważenie i wykres 14 dni', () => {
  WP().reset(); view('day', T.scenS('prosty')); click({ unlock: 'waga' }); const h = card(mainHtml()), y = T.S().meas[dk(1)] || {};
  const w14 = Array.from({ length: 14 }, (_, i) => (T.S().meas[dk(i + 1)] || {}).w).filter(Boolean).length;
  return !!y.w && new RegExp('id="m_w"[^>]*>' + y.w.replace('.', ',') + ' kg<').test(h) && h.includes('wpisz dzisiejszą wagę') && h.includes('id="wp_spark"') && w14 === 14 && !!y.sleep;
});
tryc('wpisy: scenariusz wpisy: waga startuje od wczorajszych 80,4 kg, + dodaje 0,1 kg; opis scenariusza mówi o karcie', () => {
  WP().reset(); const h = card(view('day', { ...T.scenS('wpisy'), lite: false })), R = wpS('w'), v = R.start.v;
  return /id="m_w"[^>]*>80,4 kg</.test(h) && WP().step(R, v, 1) === 80.5 && /karta „Dziś”/.test(T.SCEN.wpisy.chk) && !/pod polem/.test(T.SCEN.wpisy.chk);
});
tryc('wpisy: sw.js i index.html znają wpisy.js przed app.js; wpisy-demo.js usunięty', () => /'\.\/wpisy\.js'/.test(fs.readFileSync(path.join(root, 'sw.js'), 'utf8')) && html.indexOf('wpisy.js') > 0 && html.indexOf('wpisy.js') < html.indexOf('app.js')
  && !/wpisy-demo/.test(html + fs.readFileSync(path.join(root, 'sw.js'), 'utf8') + code) && !fs.existsSync(path.join(root, 'wpisy-demo.js')) && !code.includes('wpisydemo'));
tryc('wpisy: html() bez skryptów i on...=, przyciski − i + bez zaznaczania tekstu i z szybkim dotykiem', () => { const h = card(wpDay({ [dk(1)]: { w: '80,4' }, [dk(2)]: { w: '80,6' } })); return h.length > 0 && !/<script|\son[a-z]+=/i.test(h) && /\.wp-sq(,[^{]*)?\{[^}]*touch-action:manipulation/.test(sysCss) && /\.wp-sq(,[^{]*)?\{[^}]*user-select:none/.test(sysCss); });
// Nowe zwierzaki w aplikacji (20.11.2026): galeria demo usunięta, postacie w pet.js, wybór 4 gatunków z podpisem
tryc('zwierzaki: zwierzaki-demo.js usunięty (plik, index.html, sw.js, app.js, CSS galerii), w scenariuszu prosty brak sekcji galerii', () => {
  const swS = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
  T.setDemoN('prosty'); let demo; try { liteReset(); demo = view('day', { pet: null }); } finally { T.setDemoN(''); }
  return !fs.existsSync(path.join(root, 'zwierzaki-demo.js')) && !/zwierzaki-demo/.test(html + swS + code) && !/ZW_DEMO|zwdemo/.test(code) && !/zw-moods|zw-card|#zwdemo/.test(sysCss) && typeof sandbox.ZW_DEMO === 'undefined' && !demo.includes('zwdemo');
});
tryc('zwierzaki: wybór pokazuje 4 gatunki w kafelkach z podpisem, podgląd każdego, zatwierdzenie „Wybieram: …”', () => {
  for (const tab of ['pet', 'set']) {
    const h0 = view(tab, BASE({ pet: null }));
    if (!KINDS.every((k) => h0.includes('data-petprev="' + k + '"') && h0.includes('>' + KIND_N[k] + '</button>')) || !/<div class="seg[^"]*" role="group" aria-label="Rodzaj towarzysza">/.test(h0)) throw new Error(tab + ': brak 4 kafelków');
    for (const k of KINDS) { click({ petprev: k }); const h = view(tab); if (T.S().pet !== null || !h.includes('Wybieram: ' + KIND_N[k]) || !h.includes('aria-label="' + KIND_N[k] + ': ')) throw new Error(tab + ': podgląd ' + k); }
    click({ petok: '1' }); if (!T.S().pet || T.S().pet.kind !== 'kotek' || !toastHtml().includes('Witaj, kotku!')) throw new Error(tab + ': zatwierdzenie kotka');
    const h1 = view(tab); if (tab === 'set' && !KINDS.every((k) => h1.includes('data-petkind="' + k + '"'))) throw new Error('zmiana rodzaju: brak 4 kafelków');
  }
  return true;
});
tryc('zwierzaki: zmiana rodzaju na kapibarę działa, nieznany rodzaj z kliknięcia jest ignorowany', () => { view('set', BASE({})); click({ petkind: 'kapibara' }); const a = T.S().pet.kind; click({ petkind: 'zebra' }); return a === 'kapibara' && T.S().pet.kind === 'kapibara'; });
tryc('zwierzaki: kopia z kind kaczka zostaje kaczuszką, nieznany rodzaj z kopii to gąska (load)', () => {
  const g = sandbox.localStorage.getItem, at = (kind) => { sandbox.localStorage.getItem = () => JSON.stringify({ onb: true, pet: { kind, name: 'A', since: '2026-11-01' } }); try { return T.load().pet.kind; } finally { sandbox.localStorage.getItem = g; } };
  return at('kaczka') === 'kaczka' && at('kotek') === 'kotek' && at('x"><img>') === 'gaska' && at(7) === 'gaska';
});
tryc('zwierzaki: teksty wyboru wymieniają 4 gatunki, bez „obu” i „drugiego”', () => { const h = view('pet', BASE({ pet: null })); return h.includes('Gąska, kaczuszka, kapibara albo kotek') && !/porównać oba|Dotknij drugiego/.test(h) && T.guideSteps().find((x) => x.id === 'pet').hint.includes('kapibara'); });
tryc('zwierzaki: CSS kolorów postaci w obu motywach, ruch wyłączony przy prefers-reduced-motion (postać i napis reakcji)', () => {
  const b = themeBlocks(), zw = (blk) => [...blk.matchAll(/--zw-[a-z0-9-]+(?=:)/g)].map((m) => m[0]).sort().join();
  return zw(b.light).length > 0 && zw(b.light) === zw(b.dark) && zw(b.light) === zw(b.darkMq) && /prefers-reduced-motion:\s*reduce\)\{[^}]*\.pet,\.pet \*\{animation:none/.test(sysCss) && /prefers-reduced-motion:\s*reduce\)\{[^@]*\.petfx\{[^}]*animation:none/.test(sysCss);
});
tryc('zwierzaki: przy ograniczeniu ruchu reakcja to krótki napis zamiast ruchu (bez klasy react-*)', () => {
  const mm = sandbox.matchMedia; sandbox.matchMedia = (q) => ({ matches: /reduce/.test(q) }); fx.cls.length = 0; fx.fx.length = 0;
  try { P().react('weigh'); withPet(true, () => P().flush()); P().react('habit', 10); withPet(true, () => P().flush()); P().react('urge'); withPet(true, () => P().flush()); } finally { sandbox.matchMedia = mm; }
  return !fx.cls.some((c) => /^react-/.test(c)) && fx.fx.some((h) => /class="petfx still"[^>]*aria-hidden="true"[^>]*>Zanotowane</.test(h)) && !fx.fx.some((h) => /role="status"/.test(h)) && fx.fx.some((h) => />\+10 pkt</.test(h)) && fx.fx.some((h) => />Zapisane</.test(h));
});
// Runda 2 (20.11.2026): poprawki z przeglądu karty „Dziś”, suwak kroków w szybkim wpisie, suwaki skal 0-10, bez liczby dotknięć w tekstach, kafelki
const fakeSS = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)); }, removeItem: (k) => { m.delete(k); }, _m: m }; };
tryc('r2 wpisy: „Zatwierdź (N)” zapisuje tylko zmienione wiersze, N to liczba zapisywanych; reakcja wagi tylko przy zapisie wagi', () => {
  wpDay({ [dk(1)]: { w: '80,4', sleep: '6:13', steps: '8500' } }); wpD().k = 9000; const o = wpSet(wpD()), lab = card(view('day', {}));
  T.wpCommit(o.vals, o); const t = T.S().meas[dk(0)];
  return Object.keys(o.vals).join() === 'k' && o.vals.k === 9000 && o.copied.length === 0 && lab.includes('>Zatwierdź (1)<') && t.steps === '9000' && t.w === undefined && t.sleep === undefined && !t.cp;
});
tryc('r2 wpisy: „Jak wczoraj” zapisuje tylko wiersze z ostatnią wartością, nigdy wagi (ani ostatniej, ani z profilu)', () => {
  wpDay({ [dk(1)]: { sleep: '7:00', w: '80,1' } }, { touched: { kg: true } }); const o = wpSet(), h = card(view('day', {}));
  return Object.keys(o.vals).join() === 's' && h.includes('>Jak wczoraj<');
});
tryc('r2 wpisy: „jak wczoraj?” i „Jak wczoraj” tylko dla wartości z wczoraj, starsza to „jak ostatnio?” i „Jak ostatnio”', () => {
  const a = card(wpDay({ [dk(1)]: { sleep: '7:00' } })), b = card(wpDay({ [dk(3)]: { sleep: '7:00' } })), c = card(wpDay({ [dk(1)]: { sleep: '7:00' }, [dk(4)]: { steps: '8000' } }));
  const L = WP().mainLabel, o = { changed: 0, saved: false, summaryOpen: false, hasYesterday: true, msSinceSave: 0 };
  return a.includes('jak wczoraj?') && a.includes('>Jak wczoraj<') && b.includes('jak ostatnio?') && !b.includes('jak wczoraj?') && b.includes('>Jak ostatnio<')
    && c.includes('jak wczoraj?') && c.includes('jak ostatnio?') && c.includes('>Jak ostatnio<') && L({ ...o, yday: false }) === 'Jak ostatnio' && L(o) === 'Jak wczoraj';
});
tryc('r2 wpisy: wartości robocze w sessionStorage z kluczem dnia, odtworzone po przeładowaniu, czyszczone po zapisie i przy zmianie dnia', () => {
  const ss = fakeSS(), o = sandbox.sessionStorage; sandbox.sessionStorage = ss;
  try {
    wpDay({ [dk(1)]: { w: '80,4' } }); WP().edit(T.wpCfg(), 'w', '81,2');
    const raw = JSON.parse(ss.getItem('miara-wpisy:wp') || 'null');
    WP().reset(true); const back = card(view('day', {}));
    WP().markSaved('wp', T.todayKey(), { w: 81.2 }); const cleared = ss.getItem('miara-wpisy:wp') === null;
    WP().edit(T.wpCfg(), 'w', '81,6'); const kept = !!ss.getItem('miara-wpisy:wp'); WP().reset(true); WP().card({ ...T.wpCfg(), day: '2000-01-01' }); const other = ss.getItem('miara-wpisy:wp');
    return raw && raw.day === T.todayKey() && raw.draft.w === 81.2 && /id="m_w"[^>]*>81,2 kg</.test(back) && cleared && kept && other === null;
  } finally { sandbox.sessionStorage = o; WP().reset(); }
});
tryc('r2 wpisy: bez sessionStorage (albo z wyjątkiem) karta działa', () => {
  const o = sandbox.sessionStorage; sandbox.sessionStorage = { getItem() { throw new Error('x'); }, setItem() { throw new Error('x'); }, removeItem() { throw new Error('x'); } };
  try { wpDay({}); WP().edit(T.wpCfg(), 'w', '81'); return /id="m_w"[^>]*>81,0 kg</.test(card(view('day', {}))); } finally { sandbox.sessionStorage = o; WP().reset(); }
});
tryc('r2 wpisy: świeża wartość z importu (Skrót) czyści wartość roboczą tego wiersza, inne zostają', () => {
  wpDay({ [dk(1)]: { w: '80,4', steps: '8500' } }); const d = wpD(); WP().edit(T.wpCfg(), 'w', '81,2'); WP().edit(T.wpCfg(), 'k', '9000');
  T.S().imp = { date: T.todayKey(), vals: { w: '79,0' }, bad: [] }; click({ impsave: '1' }); const h = card(view('day', {}));
  return /id="m_w"[^>]*>79,0 kg</.test(h) && d.w === undefined && /id="m_steps"[^>]*>9.000</.test(h);
});
tryc('r2 wpisy: wartość skopiowana (meas.cp) nie liczy się jako pomiar w dataGap i measuredTdee; zmiana wiersza zdejmuje znacznik kopii', () => {
  wpDay({}); const S = T.S(); S.meas[dk(2)] = { w: '80', cp: ['w'] }; S.meas[dk(3)] = { w: '80' }; const g = T.dataGap().w;
  wpDay({ [dk(1)]: { sleep: '7:00' } }); const o = wpSet(); T.wpCommit(o.vals, o); const a = T.S().meas[dk(0)].cp.join(); T.wpCommit({ s: 480 }, { copied: [] });
  return g === 1 && a === 'sleep' && T.S().meas[dk(0)].cp === undefined && T.measCp({ cp: ['sleep'] }, 'sleep') && !T.measCp({}, 'sleep') && /measCp\(m,'w'\)/.test(code.slice(code.indexOf('function measuredTdee('), code.indexOf('function measuredTdee(') + 400));
});
tryc('r2 wpisy: „Cofnij” tak długo jak komunikat, co najmniej 5 s; „do zamknięcia” do następnej zmiany; drugie dotknięcie zaraz po zapisie ignorowane', () => {
  const S = T.S(), o = S.toastLen; try { S.toastLen = 'std'; const a = T.wpGrace(); S.toastLen = 'long'; const b = T.wpGrace(); S.toastLen = 'stay'; const c = T.wpGrace(); return a === 5000 && b >= 6000 && c === Infinity && /AGAIN = 700/.test(fs.readFileSync(path.join(root, 'wpisy.js'), 'utf8')); } finally { S.toastLen = o; }
});
tryc('r2 kafelki: bez obserwatora całego dokumentu; napisy kafelków po render()', () => !/MutationObserver/.test(code) && /tileLabels\(document\.getElementById\('main'\)\)/.test(code));
tryc('r2 wpisy: kontrast: fokus karty w kolorze lasu, obramowania − i + oraz linia dni wykresu w --edge', () => /\.wp-sq,\.wp-chg\{[^}]*border:1px solid var\(--edge\)/.test(sysCss) && /\.wp-main:focus-visible\{outline:3px solid var\(--green\)/.test(sysCss) && !/wp-[a-z]+:focus-visible[^{]*\{outline:3px solid var\(--brass\)/.test(sysCss) && /stroke="var\(--edge\)"/.test(fs.readFileSync(path.join(root, 'wpisy.js'), 'utf8')));
// Suwak kroków w szybkim wpisie (prosty widok)
tryc('r2 szybki wpis: kroki to wiersz z suwakiem 0-20 000 co 50 (siatka 500 przy szybkim przesunięciu), − i +, wartością do wpisu; bez żetonów zakresu', () => {
  liteReset(); T.S().meas[dk(1)] = { steps: '7431' }; const h = view('day', {}), i = h.indexOf('id="lite"'), sec = h.slice(i, h.indexOf('</section>', i));
  return /<input class="wp-range" type="range" id="q_rsteps" min="0" max="20000" step="50"/.test(sec) && sec.includes('data-wp="pm:steps:-1"') && sec.includes('data-wp="pm:steps:1"')
    && /<button class="wp-val wp-y" id="q_steps" data-wp="edit:steps"[^>]*>7.431</.test(sec) && sec.includes('jak ostatnio?') && !sec.includes('data-lite="stepsB:');
});
tryc('r2 szybki wpis: dzień liczy się dopiero po dotknięciu kroków; liczba z suwaka to meas.steps, jak w Pomiarach dnia', () => {
  liteReset(); const k = LK(); T.S().meas[dk(1)] = { steps: '7431' }; view('day', {}); click({ lite: 'feel:dobrze' }); click({ lite: 'redz:0' });
  const before = T.liteFull(k); T.qSet('steps', 7500); const m = T.S().meas[k];
  return !before && m.steps === '7500' && T.liteFull(k) && T.stepsBand(k) === 'mid' && T.num(m.steps) === 7500;
});
tryc('r2 szybki wpis: 0 kroków to też wpis (zakres lo); stare dni z stepsB działają', () => {
  liteReset(); const k = LK(); T.qSet('steps', 0); const a = T.stepsBand(k); const S = T.S(); S.meas.x = { stepsB: 'hi' };
  return T.S().meas[k].steps === '0' && a === 'lo' && T.stepsBand('x') === 'hi';
});
// Suwaki skal 0-10
const scaleOf = (h, id) => { const i = h.indexOf('data-wpk="' + id + '"'); return i < 0 ? '' : h.slice(h.lastIndexOf('<div', i), h.indexOf('</div></div>', i) + 12); };
tryc('r2 skale: ból i ciężkość nóg to suwaki 0-10 co 1 z podpisami końców i aria-valuetext „X z 10”; bez 22 żetonów', () => {
  const S0 = BASE({ lite: false, sex: 'K', lip: true, legs: { [dk(9)]: { b: 5, c: 4 } } }), h = view('day', S0), b = scaleOf(h, 'legb');
  return /<input class="wp-range" type="range" id="q_rlegb" min="0" max="10" step="1" value="5"[^>]*aria-valuetext="5 z 10[",]/.test(h) && h.includes('id="q_rlegc"')
    && b.includes('0 brak') && b.includes('10 najgorszy') && /class="wp-val[^"]* wp-y"[^>]*>5</.test(b) && b.includes('ostatnio: 5') && !h.includes('data-leg="b:');
});
tryc('r2 skale: zapis po dotknięciu w tym samym formacie (nogi, brzuch, kolano, stopa)', () => {
  view('day', BASE({ sex: 'K', lip: true, legs: {} })); T.qSet('leg:b', 4); T.qSet('leg:c', 6); const L = T.S().legs[dk(0)];
  T.qSet('gutb', 7); const g = T.S().gut[dk(0)]; T.S().knee = T.S().knee || {}; T.qSet('kpain', 3); T.qSet('footpain', 2);
  return L.b === 4 && L.c === 6 && g.b === 7 && T.S().knee.tmpPain === 3 && T.S().insole.pain[dk(0)] === 2;
});
tryc('r2 skale: wzdęcie, ból kolana i ból stopy też jako suwaki', () => {
  const g = view('day', BASE({ lite: false, prof: { cond: { gut: true }, pill: '' }, gut: { [dk(1)]: { b: 3 } } }));
  const f = view('mob', BASE({ prof: { cond: { flat: true }, pill: '' }, insole: { days: {}, pain: {} } }));
  return g.includes('id="q_rgutb"') && !g.includes('data-gutb="') && g.includes('ostatnio: 3') && g.includes('10 najgorsze') && f.includes('id="q_rfootpain"') && !f.includes('data-footpain="')
    && /scaleHtml\('kpain'/.test(code) && !/data-kpain="\$\{v\}"/.test(code);
});
// Bez liczby dotknięć w tekstach karty
tryc('r2 teksty: w repozytorium nie ma liczby dotknięć karty (cyfrą ani słowem, także w testach i komentarzach)', () => {
  const bad = [], walk = (d) => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { if (['node_modules', '.git', 'test-results', 'playwright-report', '.superpowers'].includes(f.name)) continue; const p = path.join(d, f.name); if (f.isDirectory()) walk(p); else if (/\.(js|html|css|md|json)$/.test(f.name) && new RegExp('(3|trzy) dotkni' + 'ę', 'i').test(fs.readFileSync(p, 'utf8'))) bad.push(path.relative(root, p)); } };
  walk(root); if (bad.length) throw new Error(bad.join(', ')); return true;
});
tryc('r2 teksty: karta „Szybki wpis dnia”, scenariusz „Prosty start: szybki wpis”, ekran startowy „Zacznij od szybkiego wpisu”', () => {
  liteReset(); const h = view('day', {}), i = view('intro', { onb: false }); T.S().onb = true;
  return h.includes('Szybki wpis dnia') && T.SCEN.prosty.t === 'Prosty start: szybki wpis' && !/dotknię/.test(T.SCEN.prosty.chk) && i.includes('Zacznij od szybkiego wpisu');
});
// Kafelki: zawijanie po polsku, wyrównanie długich opcji, ramka kafelka w kafelku, zapas bez :has()
tryc('r2 kafelki: <html lang="pl">, napisy kafelków z hyphens:auto, długie opcje (.chip.opt) wyrównane do lewej', () => /<html lang="pl">/.test(html) && /\.chip \.lbl,\.seg button \.lbl\{[^}]*hyphens:auto/.test(sysCss) && /\.chip \.lbl,\.seg button \.lbl\{[^}]*-webkit-hyphens:auto/.test(sysCss)
  && /\.chip\.opt \.lbl\{[^}]*justify-items:start[^}]*text-align:start/.test(sysCss));
tryc('r2 kafelki: niewybrany kafelek w kafelku ma obramowanie --edge (WCAG 1.4.11), wybrany obrys inset', () => /:is\(\.panel,\.fold,\.note,\.petcard,\.card\) :is\(\.chip,\.seg button\):not\(\.inc\):not\(\.exc\):not\(\.on\)(:not\(#_\))?\{[^}]*border:1px solid var\(--edge\)/.test(sysCss));
tryc('r2 kafelki: bez obsługi :has() 2 opcje bez pustej kolumny (auto-fit)', () => /@supports not selector\(:has\(\*\)\)\{[^@]*\.chips,\.seg\{grid-template-columns:repeat\(auto-fit,/.test(sysCss));
tryc('r2 kafelki: liczba kolumn zmniejsza się, gdy najdłuższe słowo nie mieści się w kafelku (bez dzielenia słowa)', () => /function tileFit\(/.test(code) && /--cols/.test(code.slice(code.indexOf('function tileFit('), code.indexOf('function tileFit(') + 1500)));
// Runda 3 (20.11.2026): dotknięcie suwaka bez przesunięcia nigdy nie zapisuje wartości typowej
tryc('r3 suwak: dotknięcie bez przesunięcia zapisuje tylko ostatnią wartość kroków (jako kopię z komunikatem), nigdy typowej ani skali', () => {
  const t = WP().tapSave, base = { key: 'steps', label: 'Kroki', fmt: (v) => String(v), copyTap: true };
  const a = t({ ...base, start: { v: 5000, src: 'default' } }), b = t({ ...base, start: { v: 7431, src: 'last' } }), c = t({ ...base, start: { v: 7, src: 'today' } }), d = t({ key: 'legb', label: 'Ból nóg', fmt: String, start: { v: 4, src: 'last' } });
  return !a.save && a.hint === 'przesuń, żeby wpisać' && b.save && b.v === 7431 && b.copied && b.msg === 'Zapisano jak ostatnio: 7431' && !c.save && !c.hint && !d.save && d.hint === 'przesuń, żeby wpisać';
});
tryc('r3 szybki wpis: kopia kroków ma znacznik meas.cp, prawdziwa wartość go zdejmuje', () => {
  liteReset(); const k = LK(); T.qSet('steps', 7431, { copied: true }); const a = (T.S().meas[k].cp || []).join(); T.qSet('steps', 8000); const m = T.S().meas[k];
  return a === 'steps' && m.steps === '8000' && !T.measCp(m, 'steps') && m.cp === undefined;
});
tryc('r3 kafelki: kolumny liczone ponownie po załadowaniu czcionek', () => /document\.fonts&&document\.fonts\.ready/.test(code) && /fonts\.ready\.then\(\(\)=>tileFit\(/.test(code));
// Zadanie 2 (20.11.2026): zwierzak reaguje na wpisy w Zdrowiu (rada): bez nagradzania bólu, bez oceny wyników badań, tryb dyskretny
const HR = (...a) => T.healthReact(...a);
tryc('healthReact: skład ciała, obwody, nadgarstek, kostka, VO2max i tętno to „note”; ten sam wpis albo puste pole to brak reakcji', () => ['ffm', 'fat', 'waist', 'hip', 'thigh', 'frame.wrist', 'frame.ankle', 'vo2', 'hrRest', 'hrMax'].every((k) => HR(k, '50', '', {}) === 'note')
  && HR('meas.' + dk(0) + '.ffm', '55,2', '54', {}) === 'note' && HR('meas.' + dk(0) + '.waist', '80', '80', {}) === null && HR('meas.' + dk(0) + '.fat', '', '20', {}) === null && HR('meas.' + dk(0) + '.w', '80', '', {}) === null);
tryc('healthReact: pomiar obwodów lub składu ciała, gdy był zalecany, to „series”; VO2max, tętno i nadgarstek zostają „note”', () => ['ffm', 'fat', 'waist', 'hip', 'thigh'].every((k) => HR('meas.' + dk(0) + '.' + k, '60', '', { due: true }) === 'series') && HR('vo2', '40', '', { due: true }) === 'note' && HR('frame.wrist', '16', '', { due: true }) === 'note');
tryc('healthReact: wynik badania w zakresie „note”, poza zakresem brak reakcji', () => HR('lab', '2,1', null, { out: false }) === 'note' && HR('lab', '9', null, { out: true }) === null);
tryc('healthReact: ból głowy „rest”, w trybie dyskretnym brak reakcji; cykl w trybie dyskretnym i odznaczony brak reakcji', () => HR('pain', 'today', null, {}) === 'rest' && HR('pain', 'today', null, { discreet: true }) === null && HR('cyc', '2', '', { discreet: true }) === null && HR('cyc', '', '2', {}) === null && HR('cyc', '2', '', {}) === 'note');
tryc('healthReact: wzdęcie, ból i ciężkość nóg od 5 to „rest”, poniżej 5 i ponowny wpis od 5 bez reakcji; pieczenie w nadbrzuszu „rest”, objawy alarmowe bez reakcji', () => HR('gutb', 5, 3, {}) === 'rest' && HR('gutb', 4, 2, {}) === null && HR('gutb', 7, 6, {}) === null
  && HR('leg:b', 6, null, {}) === 'rest' && HR('leg:c', 5, 1, {}) === 'rest' && HR('leg:b', 2, null, {}) === null && HR('gutu', 'piecze', null, {}) === 'rest' && HR('gutu', 'zgaga', null, {}) === null && HR('guta', 'krew', null, {}) === null);
tryc('bodyDue: obwody zalecane bez pomiaru w 13 poprzednich dniach, skład ciała bez pomiaru w 27 dniach; dzisiejszy wpis się nie liczy', () => {
  const S = T.S(), at = (meas, key) => { S.meas = meas; return T.bodyDue('meas.' + dk(0) + '.' + key); };
  return at({}, 'waist') === true && at({ [dk(5)]: { hip: '100' } }, 'waist') === false && at({ [dk(15)]: { waist: '80' } }, 'thigh') === true && at({ [dk(0)]: { waist: '80' } }, 'waist') === true
    && at({ [dk(20)]: { fat: '25' } }, 'ffm') === false && at({ [dk(30)]: { ffm: '50' } }, 'ffm') === true && at({}, 'vo2') === false;
});
const hrFlush = () => { fx.cls.length = 0; fx.fx.length = 0; withPet(true, () => P().flush()); return { cls: fx.cls.slice(), fx: fx.fx.join(' ') }; };
tryc('reakcje Zdrowia: „Boli mnie głowa” daje przytulenie i napis „Odpocznij dziś”, bez serduszek i punktów, bez zmiany serii i odznak; w trybie dyskretnym nic', () => {
  hrFlush(); view('day', BASE({ pain: {} })); click({ pain: 'today' }); const k = dk(0), c0 = T.petCtx(), pts = c0.dayPts(k), sk = c0.streak(), seen = JSON.stringify(T.S().petSeen), r = hrFlush(), c1 = T.petCtx();
  const okA = r.cls.includes('react-rest') && />Odpocznij dziś</.test(r.fx) && !/♥|\+\d/.test(r.fx) && c1.dayPts(k) === pts && c1.streak() === sk && JSON.stringify(T.S().petSeen) === seen;
  view('day', BASE({ pain: {}, discreet: true })); click({ pain: 'today' }); const d = hrFlush();
  return okA && d.cls.length === 0 && !d.fx.includes('Odpocznij');
});
tryc('reakcje Zdrowia: „rest” nie dodaje punktów (dayPts jak przy tym samym wpisie bez reakcji)', () => {
  hrFlush(); view('day', BASE({ pain: {} })); const k = dk(0); click({ pain: 'today' }); const a = T.petCtx().dayPts(k); hrFlush(); const b = T.petCtx().dayPts(k);
  view('day', BASE({ pain: { [k]: { aura: false, med: false } } })); const c = T.petCtx().dayPts(k); return a === b && b === c;
});
tryc('reakcje Zdrowia: cykl poza trybem dyskretnym „Zanotowane”, w dyskretnym bez reakcji', () => { hrFlush(); view('health', BASE({ sex: 'K', discreet: false })); T.S().meas[dk(0)] = {}; click({ cyc: '2' }); const a = hrFlush(); view('health', BASE({ sex: 'K', discreet: true })); T.S().meas[dk(0)] = {}; click({ cyc: '3' }); const b = hrFlush(); return a.fx.includes('Zanotowane') && b.cls.length === 0 && b.fx === ''; });
tryc('reakcje Zdrowia: wzdęcie 6 suwakiem daje „Odpocznij dziś”, wzdęcie 2 nic', () => { hrFlush(); view('day', BASE({ gut: {} })); T.qSet('gutb', 6); const a = hrFlush(); T.S().gut = {}; T.qSet('gutb', 2); const b = hrFlush(); return a.fx.includes('Odpocznij dziś') && b.fx === '' && b.cls.length === 0; });
tryc('reakcje Zdrowia: ból nóg 7 suwakiem daje „Odpocznij dziś”', () => { hrFlush(); view('day', BASE({ legs: {} })); T.qSet('leg:b', 7); return hrFlush().fx.includes('Odpocznij dziś'); });
tryAsync('reakcje Zdrowia: wpis FFM w polu daje „Zanotowane”, zalecany pomiar obwodu daje serduszka', async () => {
  const k = dk(0); hrFlush(); view('health', BASE({ meas: { [dk(3)]: { ffm: '50', fat: '25' } } }));
  T.S().meas[k] = {}; const el = inp('m_ffm', 'meas.' + k + '.ffm', '', 'decimal'); fire('focusin', el); el.value = '51,5'; fire('input', el); fire('focusout', el); await tick(); const a = hrFlush();
  const w = inp('m_waist', 'meas.' + k + '.waist', '', 'decimal'); fire('focusin', w); w.value = '82'; fire('input', w); fire('focusout', w); await tick(); const b = hrFlush();
  if (!a.fx.includes('Zanotowane') || !a.cls.includes('react-note')) throw new Error('ffm: ' + JSON.stringify(a));
  return b.cls.includes('react-series') && /♥/.test(b.fx) && (els.sr || {}).textContent === 'Serduszka: pomiar w zalecanym terminie';
});
tryc('reakcje Zdrowia: zapis wyniku badania w zakresie „Zanotowane”, poza zakresem bez reakcji', () => {
  const save = (val) => { hrFlush(); view('labs', BASE({ labs: [], labSel: 'tsh' })); Object.entries({ l_val: val, l_date: dk(0), l_unit: 'mIU/l' }).forEach(([id, v]) => { sandbox.document.getElementById(id).value = v; }); sandbox.document.getElementById('l_fast').checked = false; click({ labsave: '1' }); return hrFlush(); };
  const a = save('2'), b = save('40'); if (!a.fx.includes('Zanotowane')) throw new Error('w zakresie: ' + JSON.stringify(a)); return T.S().labs.length === 1 && b.fx === '' && b.cls.length === 0;
});
// Poprawki po przeglądzie zadania 1
tryc('pet: domyślne imię według gatunku (gąska Pianka, kaczuszka Kluska, kapibara Kapi, kotek Mruczek), nieznany jak gąska, nadane imię zostaje', () => P().nameOf({ kind: 'kotek', name: '' }) === 'Mruczek' && P().nameOf({ kind: 'kaczka', name: '' }) === 'Kluska' && P().nameOf({ kind: 'gaska', name: ' ' }) === 'Pianka' && P().nameOf({ kind: 'kapibara', name: '' }) === 'Kapi' && P().nameOf({ kind: 'smok', name: '' }) === 'Pianka' && P().nameOf({ kind: 'kotek', name: 'Kluska' }) === 'Kluska'
  && (() => { const c = mkCtx({ name: '' }); c.pet.kind = 'kotek'; return st(c).line.startsWith('Mruczek'); })());
tryc('pet.flush: każdy napis ma własne id i usuwa dokładnie siebie', () => { const h = []; const host = { insertAdjacentHTML: (_, x) => h.push(x), querySelector: () => null }; const el = { classList: { add() {}, remove() {} }, closest: () => host }; const q = sandbox.document.querySelector; sandbox.document.querySelector = (s) => (s === '#main .pet' ? el : null); try { P().react('habit', 5); P().flush(); P().react('habit', 6); P().flush(); } finally { sandbox.document.querySelector = q; } const ids = h.map((x) => (x.match(/id="(petfx\d+)"/) || [])[1]); return ids.length === 2 && !!ids[0] && !!ids[1] && ids[0] !== ids[1] && !/querySelector\('\.petfx'\)/.test(fs.readFileSync(path.join(root, 'pet.js'), 'utf8')); });
tryc('pet.svg: bez EXPR.zapis i bez zmiennych --goose/--goose-line w CSS; obrys gąski w jasnym motywie co najmniej 3:1 do powierzchni', () => {
  const pet = fs.readFileSync(path.join(root, 'pet.js'), 'utf8'), b = themeBlocks(), hex = (blk, n) => (blk.match(new RegExp('--' + n + ':(#[0-9A-Fa-f]{6})')) || [])[1];
  const L = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const cr = (a, c) => { const x = L(a), y = L(c); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  return !/zapis:/.test(pet) && !/--goose(-line)?[:)]/.test(sysCss) && cr(hex(b.light, 'zw-goose-ln'), hex(b.light, 'surface')) >= 3;
});
// Poprawki po przeglądzie zadania 2
const srText = () => (els.sr || {}).textContent || '';
tryc('reakcje Zdrowia: suwaki 0-10 nóg i wzdęcia (zapis qSet) dają „Odpocznij dziś”, ponowne od 5 i poniżej 5 nic', () => {
  hrFlush(); view('day', BASE({ legs: {}, gut: {} })); T.qSet('leg:b', 6); const a = hrFlush(); T.qSet('leg:b', 8); const b = hrFlush(); T.qSet('leg:c', 2); const c = hrFlush();
  T.qSet('gutb', 7); const g = hrFlush(); T.qSet('gutb', 9); const g2 = hrFlush(); T.S().gut = {}; T.qSet('gutb', 3); const g3 = hrFlush();
  return a.fx.includes('Odpocznij dziś') && b.fx === '' && c.fx === '' && g.fx.includes('Odpocznij dziś') && g2.fx === '' && g3.fx === '' && T.S().legs[dk(0)].b === 8 && T.S().gut[dk(0)].b === 3;
});
tryc('reakcje: tekst ogłaszany przez istniejący region na żywo #sr, napis na karcie bez role=status i ukryty dla czytnika', () => {
  hrFlush(); els.sr && (els.sr.textContent = ''); view('day', BASE({ pain: {} })); click({ pain: 'today' }); const r = hrFlush();
  const ok1 = srText() === 'Odpocznij dziś' && !/role="status"/.test(r.fx) && /aria-hidden="true"/.test(r.fx);
  P().react('series'); const s2 = hrFlush(); return ok1 && srText() === 'Serduszka: pomiar w zalecanym terminie' && !/role="status"/.test(s2.fx);
});
tryc('reakcje Zdrowia: „Boli mnie głowa” drugi raz tego samego dnia bez ponownej reakcji', () => { hrFlush(); view('day', BASE({ pain: {} })); click({ pain: 'today' }); const a = hrFlush(); click({ pain: 'today' }); const b = hrFlush(); return a.fx.includes('Odpocznij dziś') && b.fx === '' && b.cls.length === 0; });
tryAsync('reakcje Zdrowia: ta sama wartość w innym zapisie (52.4 i 52,4) bez reakcji', async () => {
  const k = dk(0); hrFlush(); view('day', BASE({ meas: { [k]: { ffm: '52.4' } } }));
  const el = inp('m_ffm', 'meas.' + k + '.ffm', '52.4', 'decimal'); fire('focusin', el); el.value = '52,4'; fire('input', el); fire('focusout', el); await tick(); const a = hrFlush();
  return a.fx === '' && a.cls.length === 0;
});
tryc('bodyDue: komentarz wskazuje rytm z podsumowania (obwody co 2 tygodnie, skład ciała co 4 tygodnie)', () => /co 2 tygodnie[^\n]*co 4[^\n]*\n(\/\/[^\n]*\n)*function bodyDue\(/.test(code));
// Runda końcowa (20.11.2026): pole wpisu bez zmiany nie zgaduje, kopie pomijane w średnich, martwe obsługi usunięte
tryc('rk wpisy: pole wpisu zamknięte bez zmiany: typowa nic, ostatnia kroków jako kopia, zmiana zapisuje, dzisiejsza bez zmiany nic', () => {
  const o = WP().editOutcome, B = { key: 'steps', copyTap: true, fmt: String };
  return o({ ...B, today: null, start: { v: 5000, src: 'default' } }, 5000).kind === 'none' && o({ ...B, today: null, start: { v: 7431, src: 'last' } }, 7431).kind === 'copy'
    && o({ ...B, today: null, start: { v: 7431, src: 'last' } }, 8000).kind === 'put' && o({ ...B, today: 6000, start: { v: 6000, src: 'today' } }, 6000).kind === 'none'
    && o({ key: 'legb', fmt: String, today: null, start: { v: 4, src: 'last' } }, 4).kind === 'none' && o({ ...B, today: null, start: { v: 5000, src: 'default' } }, 5500).kind === 'put';
});
tryc('rk kopie: sen i kroki skopiowane (meas.cp) pomijane w sleepAt i średnich 7 dni; import ze Skrótu zdejmuje znacznik', () => {
  wpDay({}); const S = T.S(); S.meas[dk(1)] = { sleep: '5:00', steps: '2000', cp: ['sleep', 'steps'] }; S.meas[dk(2)] = { sleep: '8:00', steps: '9000' };
  const a = T.sleepAt(dk(1)), b = T.avgAgo(0, 7, 'sleep'), c = T.avgAgo(0, 7, 'steps');
  S.meas[dk(0)] = { sleep: '6:00', cp: ['sleep'] }; S.imp = { date: dk(0), vals: { sleep: '7,5' }, bad: [] }; click({ impsave: '1' }); const m = T.S().meas[dk(0)];
  return a === null && b === 8 && c === 9000 && m.sleep === '7:30' && !T.measCp(m, 'sleep');
});
tryc('rk skale: suwak 0-10 opisany podpowiedzią i ukrytym tekstem końców; niezapisana ostatnia wartość ogłaszana jako „ostatnio, niezapisane”', () => {
  const h = view('day', BASE({ lite: false, sex: 'K', lip: true, legs: { [dk(9)]: { b: 5, c: 4 } } }));
  return /id="q_rlegb"[^>]*aria-describedby="q_hlegb q_dlegb q_nlegb"/.test(h) && /<span class="wp-sr" id="q_nlegb">0 brak, 10 najgorszy<\/span>/.test(h) && /id="q_rlegb"[^>]*aria-valuetext="5 z 10, ostatnio, niezapisane"/.test(h);
});
tryc('rk martwy kod: bez obsług d.leg, d.kpain, d.footpain, d.gutb i gałęzi snu w stpApply/stpDone', () => !/d\.leg\b|d\.kpain|d\.footpain|d\.gutb/.test(code) && !/setPath\(k,f==='sleep'/.test(code) && !/\^meas\\.\[\^\.\]\+\\.sleep\$\/\.test\(k\)&&v>=7/.test(code));
tryc('rk wersja publiczna: rytm składu ciała co 4 tygodnie raz w tekście podsumowania (z nazwą wagi w wersji prywatnej albo „pomiar BIA” w publicznej), komentarze przy bodyDue bez nazwy wagi', () => { const BR = 'Tani' + 'ta', i = code.indexOf('function bodyDue('); return code.split(BR + ' co 4').length - 1 + code.split('pomiar BIA co 4').length - 1 === 1 && !code.slice(i - 400, i).includes(BR); });
tryc('rk kopie: trendy Pomiarów dnia (sen i kroki, średnia z 7 dni) pomijają wartości skopiowane (meas.cp)', () => {
  const h = wpDay({ [dk(1)]: { sleep: '5:00', steps: '2000', cp: ['sleep', 'steps'] }, [dk(2)]: { sleep: '8:00', steps: '9000' } });
  return /Sen, średnia z 7 dni: 8 h\./.test(h) && /Kroki, średnia z 7 dni: 9.?000\./.test(h);
});
// Plan łatwości, zadanie 4 (20.11.2026): pełny szybki wpis zwija kartę; „Twój stan” rozwija się w miejscu; same liczby, bez ocen
const NBS = String.fromCharCode(160);
const liteUiReset = () => { const u = T.liteUi(); u.open = ''; u.sum = ''; u.focus = ''; u.say = ''; };
tryc('stan: pełny szybki wpis zwija kartę do „✓ Zapisane na dziś” z Zobacz podsumowanie i Zmień; zwinięcie ogłoszone', () => {
  liteReset(); liteUiReset(); view('day', {});
  click({ lite: 'feel:dobrze' }); click({ lite: 'redz:0' }); const open = mainHtml().includes('data-lite="feel:dobrze"'); T.qSet('steps', 5500); T.render();
  const h = mainHtml(), m = T.S().meas[LK()];
  return open && h.includes('<b>✓ Zapisane na dziś:</b> Kroki 5' + NBS + '500 · Dobrze · Jedzenie kaloryczne 0') && /id="lite_see" data-litesum="1" aria-expanded="false" aria-controls="lite_stan">Podsumowanie</.test(h) && /<button class="btn ghost" id="lite_see"/.test(h)
    && /data-liteedit="1"[^>]*>Zmień</.test(h) && !h.includes('data-lite=') && !h.includes('q_rsteps') && m.steps === '5500' && T.liteUi().focus === 'lite_see' && /zwinięt/.test(T.liteUi().say);
});
tryc('stan: dawny zakres kroków i „2 lub więcej” w zwiniętej karcie; komunikat w #sr po kliknięciu', () => {
  liteReset(); liteUiReset(); view('day', {}); mk('sr').textContent = '';
  click({ lite: 'stepsB:hi' }); click({ lite: 'feel:glowa' }); click({ lite: 'redz:2' }); const h = mainHtml();
  return h.includes('Kroki powyżej 8' + NBS + '000 · Ból głowy · Jedzenie kaloryczne 2 lub więcej') && /^Dzień zapisany\. Szybki wpis zwinięty: /.test(els.sr.textContent) && !T.liteUi().focus;
});
tryc('stan: Zmień rozwija kontrolki z zapisanymi wyborami, dane zostają; Gotowe zwija z fokusem na Zobacz podsumowanie', () => {
  liteReset(); liteUiReset(); view('day', {}); click({ lite: 'stepsB:mid' }); click({ lite: 'feel:brzuch' }); click({ lite: 'redz:1' });
  const before = JSON.stringify(T.S().meas[LK()]); click({ liteedit: '1' }); const h = mainHtml();
  const a = (h.match(/data-lite="[^"]+" aria-pressed="true"/g) || []).length === 2 && h.includes('q_rsteps') && h.includes('data-litedone="1"') && JSON.stringify(T.S().meas[LK()]) === before;
  click({ lite: 'redz:0' }); const b = mainHtml().includes('data-lite="redz:0" aria-pressed="true"'); mk('sr').textContent = ''; click({ litedone: '1' }); const c = mainHtml();
  return a && b && c.includes('Jedzenie kaloryczne 0') && !c.includes('data-lite=') && /^Szybki wpis zwinięty: /.test(els.sr.textContent);
});
tryc('stan: Zobacz podsumowanie rozwija „Twój stan” w miejscu (ten sam ekran), przycisk Zwiń podsumowanie z aria-expanded', () => {
  liteReset(); liteUiReset(); view('day', {}); FULL(LK()); T.render(); const tab = T.S().tab; click({ litesum: '1' }); const h = mainHtml();
  const a = T.S().tab === tab && /aria-expanded="true" aria-controls="lite_stan">Podsumowanie</.test(h) && /<div class="wp-sum lite-stan" id="lite_stan" role="region" aria-labelledby="lite_stan_h">/.test(h) && h.includes('<h3 id="lite_stan_h">Twój stan</h3>');
  click({ litesum: '1' }); const c = mainHtml(); return a && /id="lite_stan"[^>]*hidden/.test(c) && /aria-expanded="false" aria-controls="lite_stan">Podsumowanie</.test(c);
});
tryc('stan: dziś, 7 kropek z inicjałami dni, liczby dni samopoczucia i jedzenia kalorycznego, średnie kroków i snu bez kopii', () => {
  liteReset(); liteUiReset(); const S = T.S();
  S.meas = { [dk(0)]: { steps: '6000', feel: 'dobrze', redz: 0, w: '71,4' }, [dk(1)]: { steps: '9000', feel: 'brzuch', redz: 1, sleep: '7:00' }, [dk(2)]: { steps: '2000', feel: 'dobrze', redz: 2, cp: ['steps', 'sleep'], sleep: '5:00' }, [dk(3)]: { stepsB: 'lo', feel: 'dobrze', redz: 0, sleep: '8:00' }, [dk(5)]: { feel: 'inne' }, [dk(9)]: { steps: '20000', feel: 'glowa', redz: 2 } };
  const h = T.liteStanHtml(dk(0)), IN = ['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'sb'], ini = [6, 5, 4, 3, 2, 1, 0].map((n) => IN[new Date(dk(n) + 'T12:00:00').getDay()]);
  const dots = [...h.matchAll(/<li class="lite-dot( on)?"><span class="lite-d" aria-hidden="true"><\/span><span aria-hidden="true">(..)<\/span><span class="wp-sr">[^<]+: (szybki wpis|bez wpisu)<\/span><\/li>/g)];
  return dots.length === 7 && dots.map((x) => x[2]).join('') === ini.join('') && dots.map((x) => (x[1] ? 1 : 0)).join('') === '0001111'
    && h.includes('<b>Dziś:</b> Kroki 6' + NBS + '000 · Dobrze · Jedzenie kaloryczne 0 · Waga 71,4 kg') && h.includes('Szybki wpis w 4 z 7 dni')
    && h.includes('<b>Samopoczucie:</b> Dobrze 3 dni · Brzuch 1 dzień · Inne 1 dzień</p>') && h.includes('<b>Jedzenie kaloryczne:</b> 0 razy 2 dni · 1 raz 1 dzień · 2 lub więcej 1 dzień</p>')
    && h.includes('Kroki średnio 7' + NBS + '500 (z 2 dni)') && h.includes('Sen średnio 7 h 30 min (z 2 nocy)');
});
tryc('stan: wykres wagi przez spark z pasem ±0,35% tylko przy co najmniej 2 ważeniach; jedno ważenie to sama liczba', () => {
  liteReset(); liteUiReset(); const S = T.S(); S.meas = { [dk(0)]: { steps: '6000', feel: 'dobrze', redz: 0 }, [dk(3)]: { w: '80,0' } };
  const a = T.liteStanHtml(dk(0)); S.meas[dk(1)] = { w: '80,4' }; const b = T.liteStanHtml(dk(0));
  return !a.includes('<svg') && a.includes('Waga 80,0 kg (' + dk(3).slice(8, 10) + '.') && /<svg class="wp-spark" viewBox="0 0 320 84" role="img" aria-label="Waga z 14 dni: 2 ważenia[^"]*">[\s\S]*class="wp-zone"/.test(b) && b.includes('PMID 32353079');
});
tryc('stan: seria i zwierzak, „co dalej” z propozycją odkrywania albo nic; bez słów oceny i bez kolorów dobrze/źle', () => {
  liteReset(); liteUiReset(); const S = T.S(); S.unlock = []; S.unlockAt = ''; S.unlockSnooze = ''; S.pet = { kind: 'gaska', name: 'Ala', since: dk(10) };
  [0, 1, 2, 3].forEach((n) => FULL(dk(n), { steps: '9000' })); const a = T.liteStanHtml(dk(0)); S.unlock = ['waga', 'posilki', 'sen', 'cala']; const b = T.liteStanHtml(dk(0));
  [0, 1, 2, 3].forEach((n) => FULL(dk(n), { feel: 'glowa', redz: 2, steps: '500' })); const c = T.liteStanHtml(dk(0)); S.pet = null; S.unlock = [];
  const bad = /świetn|brawo|super|gratul|dobry wynik|słab|źle|za mało|za dużo|ograniczon|brakuje|niekompletn|warn|accent|over|low|clay/i;
  const shape = (x) => x.replace(/>[^<]*</g, '><').replace(/aria-label="[^"]*"/g, '');
  return a.includes('Seria: ') && a.includes('Ala: aktywne dni ') && a.includes('<b>Co dalej:</b> ' + T.unlockTxt().waga) && !b.includes('Co dalej') && ![a, b, c].some((x) => bad.test(x)) && shape(b) === shape(c);
});
// Białko za złotówkę (20.11.2026): przykładowe ceny jako podpowiedź i placeholder, nigdy jako dane
const BIAL = () => { const h = view('health', BASE({})); const i = h.indexOf('id="bialko"'); return h.slice(i, h.indexOf('<h2>Źródła</h2>', i) > 0 ? h.indexOf('<h2>Źródła</h2>', i) : undefined); };
tryc('białko: podpowiedź z przykładową ceną i datą pod nazwą produktu, bez ceny dla produktów bez sprawdzonej', () => {
  const h = BIAL(); return h.includes('np. 5,88 zł za 250 g (listopad 2026)') && h.includes('np. 16,99 zł za 10 szt. (ok. 600 g) (listopad 2026)') && h.includes('np. 6,89 zł za 300 g (listopad 2026)') && h.includes('np. 44,88 zł za 1 kg (listopad 2026)') && h.includes('np. 5,49 zł za 180 g (listopad 2026)') && (h.match(/np\. [\d,]+ zł za/g) || []).length === 5;
});
tryc('białko: placeholder „cena” w każdym polu ceny; przykład tylko w linii podpowiedzi', () => {
  const h = BIAL(), ph = (id) => (h.match(new RegExp('data-k="prices\.' + id + '\.p"[^>]*placeholder="([^"]*)"')) || [])[1];
  return ['twarog', 'jajka', 'kurczak', 'tofu', 'skyr', 'soczewica', 'tunczyk', 'wpc'].every((id) => ph(id) === 'cena') && h.includes('np. 5,88 zł za 250 g (listopad 2026)');
});
tryc('białko: pary pole+jednostka nierozdzielne, zdanie o przykładowych cenach pod listą', () => {
  const h = BIAL(); return (h.match(/<span class="pair">/g) || []).length === 16 && h.includes('Przykładowe ceny regularne ze sklepu internetowego dużej sieci, listopad 2026. Wpisz cenę ze swojego sklepu.');
});
tryc('białko: placeholder nie trafia do zapisanych cen, ranking pusty bez wpisów i liczy się tylko z wpisanych cen', () => {
  const S = T.S(); const a = view('health', BASE({})); const clean = Object.values(S.prices).every((r) => r.p === '');
  const b = view('health', BASE({ prices: { ...S.prices, twarog: { p: '5,88', g: '250' } } }));
  return clean && !a.includes('<h2>Ranking</h2>') && b.includes('<h2>Ranking</h2>') && /1\. Twaróg półtłusty/.test(b) && !/2\. /.test(b.slice(b.indexOf('<h2>Ranking</h2>'), b.indexOf('<h2>Źródła</h2>')));
});
tryc('białko: teksty przykładów to tylko cena, opakowanie i data; nazwy produktów rodzajowe, bez sklepów i marek', () => {
  const h = BIAL(), hints = [...h.matchAll(/<span class="small muted hint">([^<]*)<\/span>/g)].map((m) => m[1]);
  const names = T.PROT().map((x) => x[1]);
  return hints.length === 5 && hints.every((x) => /^np\. \d+,\d\d zł za (\d+ (g|kg)|10 szt\. \(ok\. 600 g\)) \(listopad 2026\)$/.test(x))
    && JSON.stringify(names) === JSON.stringify(['Twaróg półtłusty', 'Jajka (10 szt. to ok. 600 g)', 'Skyr naturalny', 'Pierś z kurczaka', 'Soczewica czerwona (sucha)', 'Tuńczyk w sosie własnym (masa po odsączeniu)', 'Tofu naturalne', 'Odżywka białkowa WPC (sprawdź etykietę)']);
});
tryc('stan: liczby tylko niezerowe w każdej kategorii (także Dobrze), bez wpisów „brak wpisów”', () => {
  liteReset(); T.liteUi().open = ''; const S = T.S(); S.meas = { [dk(0)]: { steps: '6000', feel: 'glowa' } };
  const h = T.liteStanHtml(dk(0));
  return h.includes('<b>Samopoczucie:</b> Ból głowy 1 dzień</p>') && h.includes('<b>Jedzenie kaloryczne:</b> brak wpisów</p>');
});
tryc('stan: komunikat i fokus po zwinięciu nie przechodzą na inny ekran (render poza Moim dniem je czyści)', () => {
  liteReset(); const u = T.liteUi(); u.focus = 'lite_see'; u.say = 'x'; view('pet', {}); const a = !u.focus && !u.say; T.S().tab = 'day'; return a;
});
tryc('stan: kropka dnia bez wpisu z obrysem co najmniej 3:1 do tła podsumowania (1.4.11) w obu motywach; wp-sr w kropce z position:relative', () => {
  const b = themeBlocks(), d = ruleOf('.lite-d'), m = /border:2px solid var\(--([a-z0-9-]+)\)/.exec(d), bg = /background:var\(--([a-z0-9-]+)\)/.exec(ruleOf('.wp-sum'));
  return !!m && !!bg && [b.light, b.dark].every((blk) => contrast(tok(blk, m[1]), tok(blk, bg[1])) >= 3) && /position:relative/.test(ruleOf('.lite-dot'));
});
// Wiersze wartości poza kartą „Dziś” (zadanie 5, 20.11.2026): Trening, obwody, skład ciała, sprawność, profil; ten sam komponent (wpisy.js), zapis od razu
const RS = (g) => T.rowSpecs(g), RW = (g, k) => RS(g).find((R) => R.key === k), NBR = String.fromCharCode(160);
const dmy = (k) => k.slice(8, 10) + '.' + k.slice(5, 7) + '.' + k.slice(0, 4);
const isBtn = (h, id) => new RegExp('<button class="wp-val[^"]*" id="' + id.replace('.', '\\.') + '"').test(h);
const TRW = (o) => ({ ...T.S().tr, wmin: '', wk: '', min: '45', cat: 'silownia', ...o });
const ZEG = (n, min, gross) => ({ [dk(n)]: [{ kind: 't', label: 'Trening z zegarka', min, gross, net: gross - 100, src: 'zegarek' }] });
tryc('wiersze trening: czas szacunku z suwakiem 5-180 min co 1 (siatka 5 przy szybkim przesunięciu), czas i kalorie z zegarka bez suwaka; cele f_tr.* to przyciski wartości, bez gołych pól', () => {
  WP().reset(); const h = view('train', BASE({ tr: TRW() }));
  return ['f_tr.min', 'f_tr.wmin', 'f_tr.wk'].every((id) => isBtn(h, id)) && /type="range" id="tr_rmin" min="5" max="180" step="1"/.test(h) && !h.includes('id="tr_rwmin"') && !h.includes('id="tr_rwk"')
    && !h.includes('data-k="tr.min"') && !h.includes('data-k="tr.wk"') && !h.includes('data-k="tr.wmin"') && h.includes('data-addtrain="1"') && h.includes('data-addwatch="1"')
    && ['min', 'wmin', 'wk'].every((k) => h.includes(`data-wp="pm:${k}:-1"`) && h.includes(`data-wp="pm:${k}:1"`)) && h.includes('aria-label="Kalorie z zegarka o 10 kcal więcej"');
});
tryc('wiersze trening: kalorie z zegarka startują od ostatniego treningu z zegarka wyszarzone z datą; wartość z wiersza trafia tylko do formularza, trening dopiero przyciskiem', () => {
  WP().reset(); const h = view('train', BASE({ tr: TRW(), days: ZEG(3, 50, 420) })), wk = RW('tr', 'wk');
  const a = /<button class="wp-val wp-y" id="f_tr\.wk"[^>]*>420 kcal</.test(h) && h.includes('ostatnio: ' + dmy(dk(3))) && wk.start.src === 'last' && wk.today == null;
  click({ addwatch: '1' }); const b = !(T.S().days[dk(0)] || []).length;
  wk.put(430); const c = T.S().tr.wk === '430' && !(T.S().days[dk(0)] || []).length;
  RW('tr', 'wmin').put(55); click({ addwatch: '1' }); const e = (T.S().days[dk(0)] || []).at(-1) || {};
  return a && b && c && e.gross === 430 && e.min === 55 && e.src === 'zegarek' && T.S().tr.wk === '';
});
tryc('wiersze trening: czas szacunku zapisuje S.tr.min; ostatnie kalorie z zegarka po Enter bez zmiany trafiają do formularza z komunikatem, samo wyjście z pola i typowe nigdy', () => {
  WP().reset(); view('train', BASE({ tr: TRW(), days: ZEG(2, 40, 380) }));
  RW('tr', 'min').put(60); const a = T.S().tr.min === '60', o = WP().editOutcome(RW('tr', 'wk'), 380, true), q = WP().editOutcome(RW('tr', 'wk'), 380);
  WP().reset(); view('train', BASE({ tr: TRW(), days: {} })); const d = RW('tr', 'wk'), p = WP().editOutcome(d, d.start.v);
  return a && o.kind === 'copy' && o.v === 380 && /jak ostatnio/.test(o.msg) && q.kind === 'none' && d.start.src === 'default' && p.kind === 'none';
});
tryc('wiersze obwody: talia, biodra, udo, nadgarstek, kostka co 0,5 cm; start od ostatniego pomiaru wyszarzony z datą; cele m_waist, f_frame.wrist to przyciski', () => {
  WP().reset(); const h = view('day', BASE({ lite: false, meas: { [dk(9)]: { waist: '84,5', hip: '101' } }, frame: { wrist: '17' } }));
  const i = h.indexOf('data-fold="obwody"'), s = h.slice(i, h.indexOf('data-fold="tanita"'));
  return ['m_waist', 'm_hip', 'm_thigh', 'f_frame.wrist', 'f_frame.ankle'].every((id) => isBtn(s, id)) && ['waist', 'hip', 'thigh', 'wrist', 'ankle'].every((k) => RW('ms', k).step === 0.5)
    && /class="wp-val wp-y" id="m_waist"[^>]*>84,5 cm</.test(s) && s.includes('ostatnio: ' + dmy(dk(9))) && /class="wp-val" id="f_frame\.wrist"[^>]*>17,0 cm</.test(s)
    && /class="wp-val wp-y" id="m_thigh"[^>]*>\d+,\d cm</.test(s) && s.includes('aria-label="Talia o 0,5 cm więcej"') && !/<input type="text"[^>]*data-k="meas\./.test(s) && !s.includes('data-k="frame.wrist"') && s.includes('najwęższe miejsce');
});
tryc('wiersze skład ciała i sprawność: tłuszcz, FFM, ECW co 0,1, BMR co 10, VO2max i tętno co 1; start od ostatniej wartości z datą; nazwy pól bez zmian', () => {
  WP().reset(); const h = view('day', BASE({ lite: false, meas: { [dk(30)]: { ffm: '52,4', fat: '28', bmr: '1490', hrRest: '62' } } })), st = (k) => RW('ms', k).step;
  return st('fat') === 0.1 && st('ffm') === 0.1 && st('ecw') === 0.1 && st('bmr') === 10 && st('vo2') === 1 && st('hrRest') === 1 && st('hrMax') === 1
    && /class="wp-val wp-y" id="m_ffm"[^>]*>52,4 kg</.test(h) && new RegExp('id="m_bmr"[^>]*>1' + NBR + '490 kcal<').test(h) && /id="m_hrRest"[^>]*>62 ud\.\/min</.test(h) && h.includes('ostatnio: ' + dmy(dk(30)))
    && ['fat', 'ffm', 'ecw', 'bmr', 'vo2', 'hrRest', 'hrMax'].every((k) => h.includes('>' + RW('ms', k).label + '<')) // nazwy pól jak dotąd (w wersji publicznej po sanitizerze)
    && [['fat', /^Tłuszcz \(/], ['ffm', /^FFM \(/], ['ecw', /^ECW\/TBW \(/], ['bmr', /^BMR \(.*kJ ÷ 4,184\)$/], ['vo2', /^VO2max \(zegarek\)$/], ['hrRest', /^Tętno spoczynkowe$/], ['hrMax', /^Tętno maksymalne \(jeśli zmierzone\)$/]].every(([k, re]) => re.test(RW('ms', k).label))
    && ['m_ecw', 'm_vo2', 'm_hrMax'].every((id) => new RegExp('class="wp-val wp-y" id="' + id + '"[^>]*>\\d').test(h));
});
tryc('wiersze: zapis obwodu, FFM i nadgarstka w formacie pól z reakcją Zdrowia (zalecany obwód: serduszka, FFM i nadgarstek: Zanotowane); wartość startowa bez zmiany nic nie zapisuje', () => {
  WP().reset(); hrFlush(); view('day', BASE({ lite: false, meas: { [dk(20)]: { waist: '84,5' }, [dk(10)]: { ffm: '50' } }, frame: {} }));
  const w = RW('ms', 'waist'), o = WP().editOutcome(w, w.start.v), a = o.kind === 'none' && !(T.S().meas[dk(0)] || {}).waist;
  w.put(WP().step(w, w.start.v, 1)); const b = hrFlush();
  RW('ms', 'ffm').put(50.3); const c = hrFlush(); RW('ms', 'wrist').put(17.5); const d = hrFlush();
  return a && T.S().meas[dk(0)].waist === '85' && b.cls.includes('react-series') && T.S().meas[dk(0)].ffm === '50,3' && c.cls.includes('react-note') && T.S().frame.wrist === '17,5' && d.cls.includes('react-note');
});
tryc('wiersze: wpis z klawiatury przez checkNum i LIM (talia 250 i pusty wpis odrzucone, BMR 1500 przyjęte)', () => {
  view('day', BASE({ lite: false })); const p = (k, t) => RW('ms', k).parse(t); return !!p('waist', '250').err && !!p('waist', '').err && p('bmr', '1500').v === 1500 && p('ffm', '52,4').v === 52.4;
});
tryc('spark: okno 28 dni bez pasa: linia średniej, punkty, podpis „średnia 4 tygodni”, bez prostokąta pasa', () => {
  const v = Array(84).fill(null); v[10] = 88; v[30] = 87; v[60] = 86; const s = WP().spark(v, null, { win: 28, avgLab: 'średnia 4 tygodni', fromLab: '12 tygodni temu' });
  return !s.includes('wp-zone') && s.includes('średnia 4 tygodni') && s.includes('12 tygodni temu') && (s.match(/<circle/g) || []).length === 3 && s.includes('stroke="var(--green)"');
});
// Kolejne dni kalendarza także przy zmianie czasu (20.11.2026: o 23:09 w Polsce 25.10 trafiał do listy dwa razy, bo dni liczone co 24 h)
tryc('daty: lastKeys podaje kolejne dni kalendarza bez powtórzeń i luk przez zmianę czasu (o 23:30 i 0:30)', () => {
  const lk = vm.runInContext('lastKeys', sandbox), real = Date.now, prev = (k) => { const d = new Date(k + 'T12:00:00'); d.setDate(d.getDate() - 1); return dk0(d); },
    dk0 = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  try { return [[23, 30], [0, 30]].every(([h, m]) => { const n = new Date(); n.setHours(h, m, 0, 0); Date.now = () => n.getTime(); const a = lk(400);
    return a[0] === dk0(n) && a.every((k, i) => i === 0 || k === prev(a[i - 1])); }); } finally { Date.now = real; }
});
// Strażnik (21.11.2026): klucz dnia nigdy z „teraz minus n × 24 h” (przy zmianie czasu dzień się powtarza albo znika); tylko keyAgo(i) albo od południa (T12:00)
tryc('daty: w kodzie brak kluczy dni liczonych co 24 h od teraz (keyOf/mondayOf z Date.now() minus 864e5), strażnik łapie dawny zapis', () => {
  const bad = /(keyOf|mondayOf)\(new Date\(Date\.now\(\)\s*-[^)]*864e5/g, old = 'function lastKeys(n){const a=[];for(let i=0;i<n;i++)a.push(keyOf(new Date(Date.now()-i*864e5)));return a}';
  const files = ['app.js', 'wpisy.js', 'pet.js', 'zdarzenia.js', 'sygnaly.js'].filter((f) => fs.existsSync(path.join(root, f)));
  const hits = files.flatMap((f) => (fs.readFileSync(path.join(root, f), 'utf8').match(bad) || []).map((m) => f + ': ' + m));
  if (hits.length) console.log('  klucze dni co 24 h:', hits.join(' | '));
  return new RegExp(bad.source).test(old) && hits.length === 0;
});
// Wspólne wyzwanie ukryte tam, gdzie nie działa (decyzja użytkownika 21.11.2026, pytanie rady 4): bez bazy artefaktu brak przycisku i zaproszenia
tryc('wyzwanie: bez bazy (CH.state off) brak przycisku w Moim dniu i zaproszenia w tekście Udostępnij; po włączeniu oba są', () => {
  const CH = vm.runInContext('CH', sandbox), st = CH.state, sh = vm.runInContext('typeof shareText==="function"?shareText:null', sandbox);
  try { CH.state = 'off'; const off = view('day', BASE()), tOff = sh && sh(); CH.state = 'on'; const on = view('day', BASE()), tOn = sh && sh();
    return !!sh && !off.includes('data-tab="challenge"') && on.includes('data-tab="challenge"') && !/wyzwanie/i.test(tOff) && /wspólne wyzwanie/.test(tOn) && /^Mój tydzień w aplikacji Miara: /.test(tOff); } finally { CH.state = st; }
});
// F0 planu ADHD (22.11.2026): kontrast wzmocniony WCAG 1.4.6 (AAA) 7:1 dla każdej pary tekst/tło w obu motywach; oba bloki ciemnego motywu zgodne
tryc('kontrast AAA: tekst 7:1 na tłach w jasnym i ciemnym motywie, napisy na przyciskach 7:1, bloki ciemnego motywu zgodne', () => {
  const grab = (b) => { const o = {}; (b.match(/--[a-z0-9-]+:#[0-9a-fA-F]{6}/g) || []).forEach((s) => { const [k, v] = s.split(':'); o[k] = v.toUpperCase(); }); return o; };
  const blk = (start) => { const i = sysCss.indexOf(start); return i < 0 ? '' : sysCss.slice(i, sysCss.indexOf('}', i)); };
  const light = grab(sysCss.slice(sysCss.indexOf(':root{'), sysCss.indexOf('@media (prefers-color-scheme: dark)'))), dark = grab(blk(':root:not([data-theme="light"])')), dark2 = grab(blk(':root[data-theme="dark"]'));
  const lum = (h) => [1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4))).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
  const R = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const P = [['--ink', ['--bg', '--surface', '--surface2', '--tint']], ['--muted', ['--bg', '--surface', '--surface2', '--tint']], ['--green', ['--bg', '--surface', '--surface2', '--tint']],
    ['--brass-ink', ['--bg', '--surface', '--surface2']], ['--warn-ink', ['--bg', '--surface', '--warn-bg']], ['--accent', ['--bg', '--surface']], ['--clay', ['--bg', '--surface']], ['--on-green', ['--green']], ['--on-accent', ['--accent']]];
  const bad = [];
  for (const [n, t] of [['jasny', light], ['ciemny', dark]]) for (const [fg, bgs] of P) for (const bg of bgs) { const r = t[fg] && t[bg] ? R(t[fg], t[bg]) : 0; if (r < 7) bad.push(`${n} ${fg}/${bg} ${r.toFixed(2)}`); }
  const diff = Object.keys(dark).filter((k) => dark[k] !== dark2[k]);
  if (bad.length || diff.length) throw new Error(bad.concat(diff.map((k) => 'ciemny ≠ data-theme: ' + k)).join('; '));
  return Object.keys(dark).length > 10;
});
tryc('fokus AAA (2.4.13): każdy :focus-visible ma obrys co najmniej 2 px w kolorze tokenu, nigdzie outline:none ani outline:0', () => {
  const rules = sysCss.match(/[^{}]*:focus-visible[^{}]*\{[^}]*\}/g) || [];
  return rules.length > 0 && rules.every((r) => { const m = /outline:\s*(\d+)px solid var\(--[a-z-]+\)/.exec(r); return m && +m[1] >= 2; }) && !/outline:\s*(none|0)\b/.test(sysCss);
});
// F1a planu ADHD (22.11.2026, wersja B): tryb skupienia w Moim dniu, jeden wybór widoku, migracja „raz dziennie”, bez ruchu i bez przerywania
const SK = () => sandbox.SKUP, SKV = (n) => vm.runInContext(n, sandbox), mainNow = () => sandbox.document.getElementById('main').innerHTML;
const skR = () => vm.runInContext("Object.assign(SKUP_UI,{day:'',skip:[],mine:[],cur:'',rest:'',say:''})", sandbox); // stan widoku kolejki, nie dane
tryc('skupienie: SKUP.queue: zrobione osobno, „Później” przesuwa na koniec w kolejności odkładania', () => {
  const q = SK().queue([{ id: 'a', done: false }, { id: 'b', done: true }, { id: 'c', done: false }, { id: 'd', done: false }], ['a', 'c']);
  const e = SK().queue([], []), f = SK().later(['a', 'c'], 'a');
  return JSON.stringify(q) === JSON.stringify({ todo: ['d', 'a', 'c'], done: ['b'] }) && e.todo.length === 0 && JSON.stringify(f) === JSON.stringify(['c', 'a']);
});
tryc('skupienie: zadania z szybkiego wpisu i odkrytych elementów; kroki ze Skrótu od razu zrobione z wartością', () => {
  skR();
  const k = dk(0); view('day', BASE({ lite: true, focus: true, unlock: [], meas: {}, days: {} }));
  const a = SKV('skupItems')(k).map((x) => x.id);
  view('day', BASE({ lite: true, focus: true, unlock: ['waga', 'posilki', 'sen'], meas: { [k]: { steps: '8214' } }, days: {} }));
  const I = SKV('skupItems')(k), ids = I.map((x) => x.id), kr = I.find((x) => x.id === 'k');
  return JSON.stringify(a.slice().sort()) === JSON.stringify(['feel', 'k', 'redz']) && ['w', 's', 'k', 'feel', 'redz', 'posilki'].every((x) => ids.includes(x))
    && ids.indexOf('feel') < ids.indexOf('redz') && ids.indexOf('redz') < ids.indexOf('posilki') && kr.done === true && /Kroki/.test(kr.label) && /8\s?214/.test(kr.val) && I.filter((x) => x.done).length === 1;
});
tryc('skupienie: Mój dzień pokazuje jedną kartę „1 z N”, „Później”, listę zrobionych; bez karty zwierzaka, wskazówek i propozycji odkrywania', () => {
  skR();
  const k = dk(0), h = view('day', BASE({ lite: true, focus: true, unlock: ['waga'], unlockAt: '', meas: { [k]: { steps: '8214' } }, days: {} }));
  const cards = (h.match(/class="[^"]*skup-card/g) || []).length, d = h.indexOf('skup-done');
  return cards === 1 && /1 z 3/.test(h) && h.includes('data-skuplater') && d > -1 && /Kroki/.test(h.slice(d)) && !h.includes('class="petcard') && !h.includes('data-unlock=') && !h.includes('class="tip');
});
tryc('skupienie: po wszystkich zadaniach „Gotowe na dziś”, zdanie zwierzaka bez ruchu, „Pokaż resztę dnia”, propozycja odkrywania dopiero tu', () => {
  skR();
  const k = dk(0), m = { [k]: { steps: '8214', feel: 'dobrze', redz: 0 } };
  for (let i = 1; i <= 4; i++) m[dk(i)] = { stepsB: 'mid', feel: 'dobrze', redz: 0 };
  const h = view('day', BASE({ lite: true, focus: true, unlock: [], unlockAt: '', unlockSnooze: '', pet: { kind: 'kaczka', name: '', since: dk(9) }, meas: m, days: {} }));
  return h.includes('Gotowe na dziś') && h.includes('data-skuprest') && h.includes('Kluska') && h.includes('data-unlock="waga"') && !h.includes('skup-card');
});
tryc('skupienie: „Później” nie zmienia danych i przesuwa zadanie; „Pokaż resztę dnia” daje pełny prosty widok bez zmiany ustawienia', () => {
  skR();
  const S0 = T.S(); view('day', BASE({ lite: true, focus: true, unlock: [], meas: {}, days: {} }));
  const first = SKV('skupView')().todo[0], before = JSON.stringify(S0); click({ skuplater: first }); const h1 = mainNow(), second = SKV('skupView')().todo[0];
  const same = JSON.stringify(S0) === before; click({ skuprest: '1' }); const h2 = mainNow();
  return same && second !== first && /1 z 3/.test(h1) && h2.includes('id="lite"') && S0.focus === true;
});
tryc('widok: jeden wybór „Mój dzień” (Prosty, Skupienie, Cała Miara) zamiast przełączników; wybór ustawia lite i focus', () => {
  const h = view('set', BASE({ lite: false, focus: false })), S0 = T.S();
  const ok1 = /role="group" aria-label="Mój dzień"/.test(h) && ['prosty', 'skup', 'cala'].every((v) => h.includes(`data-view="${v}"`)) && !h.includes('id="once"') && !h.includes('id="lite"');
  click({ view: 'skup' }); const a = [S0.lite, S0.focus]; click({ view: 'prosty' }); const b = [S0.lite, S0.focus]; click({ view: 'cala' }); const c = [S0.lite, S0.focus];
  return ok1 && a.join() === 'true,true' && b.join() === 'true,false' && c.join() === 'false,false';
});
tryc('widok: migracja zapisanego „raz dziennie” (once bez pola focus) → Skupienie; nowy stan i stan z focus bez zmian', () => {
  const g = sandbox.localStorage.getItem, L = (o) => { sandbox.localStorage.getItem = () => JSON.stringify(o); return T.load(); }; let r;
  try { const a = L({ once: true }), b = L({ once: true, focus: false, lite: false }), c = L({ days: {} });
    r = a.focus === true && a.lite === true && a.once === false && b.focus === false && b.once === true && c.focus === false; } finally { sandbox.localStorage.getItem = g; }
  return r;
});
tryc('bez ruchu: przełącznik still dla wszystkich; w Skupieniu zawsze bez ruchu; CSS wyłącza animacje i przejścia; focus i still w kopii bez zdrowia', () => {
  const de = sandbox.document.documentElement || (sandbox.document.documentElement = { dataset: {} }), h = view('set', BASE({ still: false }));
  view('day', BASE({ still: true, focus: false })); const a = de.dataset.still;
  view('day', BASE({ still: false, focus: true, lite: true })); const b = de.dataset.still;
  view('day', BASE({ still: false, focus: false })); const c = de.dataset.still;
  return h.includes('id="still"') && a === '1' && b === '1' && c === '' && /html\[data-still="1"\] \*[^{]*\{[^}]*animation:none!important[^}]*transition:none!important/.test(sysCss)
    && ['focus', 'still'].every((x) => vm.runInContext('BK_NH_KEEP', sandbox).includes(x));
});
tryc('skupienie: PET.drop kasuje oczekującą reakcję', () => { sandbox.PET.react('weigh', 5); if (typeof sandbox.PET.drop !== 'function') return false; sandbox.PET.drop(); return sandbox.PET.flush() === false; });
tryc('skupienie: sw.js i index.html znają skupienie.js przed app.js', () => /'\.\/skupienie\.js'/.test(fs.readFileSync(path.join(root, 'sw.js'), 'utf8')) && (() => { const h = fs.readFileSync(path.join(root, 'index.html'), 'utf8'); return h.indexOf('skupienie.js') > 0 && h.indexOf('skupienie.js') < h.indexOf('app.js'); })());
// F1b planu ADHD (23.11.2026, zweryfikowana wersja): główna karta zakładki w Skupieniu, reszta w „Więcej na tym ekranie”; przejście do celu otwiera zwiniętą sekcję
tryc('skupienie F1b: główna karta: Posiłki „Dziś według planu”, Trening „Trening z zegarka”, Zdrowie „Twój plan” albo bez profilu „Mój profil zdrowia”, inne bez zmian', () => {
  const m = vm.runInContext('skupMain', sandbox); view('health', BASE({ prof: { cond: {}, pill: '' } })); const noProf = m('health');
  view('health', BASE({ prof: { cond: { hashi: true }, pill: '' } })); const prof = m('health');
  return m('meals') === 'Dziś według planu' && m('train') === 'Trening z zegarka' && noProf === 'Mój profil zdrowia' && prof === 'Twój plan' && m('set') === '' && m('day') === '';
});
tryc('skupienie F1b: SKUP.reveal otwiera wszystkie zamknięte sekcje nad celem przejścia', () => {
  const d1 = { tagName: 'DETAILS', open: false }, d2 = { tagName: 'DETAILS', open: false }, div = { tagName: 'DIV' };
  d1.parentElement = null; div.parentElement = d1; d2.parentElement = div; const el = { tagName: 'BUTTON', parentElement: d2 };
  const n = sandbox.SKUP.reveal(el); return n === 2 && d1.open === true && d2.open === true && sandbox.SKUP.reveal(null) === 0;
});
tryc('skupienie F1b: render w Skupieniu zwija zakładkę (SKUP.fold z tytułem głównej karty), przejścia goto i nav odsłaniają cel', () => {
  const src = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  return /if\(S\.focus\)\{const mt=skupMain\(S\.tab\);if\(mt\)SKUP\.fold\(/.test(src) && /d\.goto\)\{const el=document\.getElementById\(d\.goto\);if\(el\)\{SKUP\.reveal\(el\);/.test(src) && /const el=id&&document\.getElementById\(id\);\s*if\(el\)\{SKUP\.reveal\(el\);/.test(src);
});
// F1c (23.11.2026, rada: projektant wpisu na telefonie): w Skupieniu karta planu posiłków pokazuje jedno danie, reszta i podsumowanie dnia w zwiniętym „Reszta planu dnia”
const planTopExp = () => vm.runInContext("(()=>{const ids=planIds(),now=slotNow();return ids.find(id=>MEALS.find(m=>m.id===id).t===now)||ids[0]})()", sandbox);
const planSplit = (h) => { const i = h.indexOf('data-fold="skupplan"'); return { top: i < 0 ? h : h.slice(0, i), rest: i < 0 ? '' : h.slice(i), i }; };
const prows = (s) => (s.match(/class="entry prow/g) || []).length;
const planKeep = (fn) => () => { const S0 = T.S(), l0 = S0.lite, f0 = S0.focus; try { return fn(); } finally { Object.assign(T.S(), { lite: l0, focus: f0 }); } }; // widok Skupienia nie przecieka do kolejnych testów
tryc('skupienie F1c: Posiłki w Skupieniu: na wierzchu jedno danie (polecane teraz albo pierwsze), reszta i podsumowanie dnia w „Reszta planu dnia”; Cała Miara bez zmian', planKeep(() => {
  const n = vm.runInContext('planIds().length', sandbox), exp = planTopExp(), ids = vm.runInContext('planIds()', sandbox);
  const h = view('meals', BASE({ lite: true, focus: true, days: {} })), s = planSplit(h);
  const full = view('meals', BASE({ lite: false, focus: false, days: {} }));
  return s.i > 0 && prows(s.top) === 1 && s.top.includes(`data-addmeal="${exp}"`) && s.top.includes(`data-swap="${ids.indexOf(exp)}"`) && prows(s.rest) === n - 1
    && s.rest.includes(`Reszta planu dnia (${n - 1})`) && s.rest.includes('Plan dnia:') && !s.top.includes('Plan dnia:')
    && !full.includes('skupplan') && prows(full) === n && full.includes('Plan dnia:');
}));
tryc('skupienie F1c: wszystkie dania z planu zapisane: na wierzchu tylko komunikat, cały plan w „Cały plan dnia”', planKeep(() => {
  const ids = vm.runInContext('planIds()', sandbox), d = { [dk(0)]: ids.map((id) => ({ kind: 'm', id, label: 'test ' + id, k: 1, p: 0, f: 0, c: 0 })) };
  const s = planSplit(view('meals', BASE({ lite: true, focus: true, days: d })));
  return prows(s.top) === 0 && s.top.includes('Wszystkie posiłki z planu są zapisane') && s.rest.includes(`Cały plan dnia (${ids.length})`) && prows(s.rest) === ids.length;
}));
tryc('skupienie F1c: danie zapisane przez „Zjem” zostaje na wierzchu w oknie „Cofnij”, następne czeka', planKeep(() => {
  const exp = planTopExp(); view('meals', BASE({ lite: true, focus: true, days: {} })); click({ addmeal: exp });
  const s = planSplit(mainHtml());
  return prows(s.top) === 1 && s.top.includes(`data-addmeal="${exp}"`) && s.top.includes('Zjedzone');
}));
tryc('wiersze: wykres trendu talii i FFM z punktami i średnią 4 tygodni, bez pasa wahania; przy jednym pomiarze bez wykresu', () => {
  WP().reset(); const h = view('day', BASE({ lite: false, meas: { [dk(40)]: { waist: '88', ffm: '50' }, [dk(26)]: { waist: '87' }, [dk(12)]: { waist: '86', ffm: '50,6' } } }));
  const svg = (id) => { const i = h.indexOf('id="' + id + '"'); return i < 0 ? '' : h.slice(i, h.indexOf('</svg>', i)); }, a = svg('ms_tw'), b = svg('ms_tf');
  WP().reset(); const one = view('day', BASE({ lite: false, meas: { [dk(12)]: { waist: '86' } } }));
  return a.includes('średnia 4 tygodni') && !a.includes('wp-zone') && b.includes('średnia 4 tygodni') && !b.includes('wp-zone') && /aria-label="Talia z 12 tygodni: 3 pomiary/.test(a) && !one.includes('id="ms_tw"');
});
tryc('wiersze profil: Ustawienia i ekran startowy: waga co 0,1 i waga docelowa co 0,5 bez suwaka, wzrost suwak 140-210, wiek suwak 16-90; cele f_kg, f_cm, f_age, f_goal to przyciski', () => {
  WP().reset(); const a = view('set', BASE({ kg: '82', cm: '170', age: '40', goal: '78', touched: { ...TA4 } })); WP().reset(); const b = view('intro', NEWD());
  return [a, b].every((h) => ['f_kg', 'f_cm', 'f_age', 'f_goal'].every((id) => isBtn(h, id)) && /type="range" id="pf_rcm" min="140" max="210" step="1"/.test(h) && /type="range" id="pf_rage" min="16" max="90" step="1"/.test(h)
    && !h.includes('id="pf_rkg"') && !h.includes('id="pf_rgoal"') && !h.includes('data-k="kg"') && h.includes('aria-label="Waga o 0,1 kg więcej"') && h.includes('aria-label="Waga docelowa o 0,5 kg więcej"'))
    && /class="wp-val" id="f_kg"[^>]*>82,0 kg</.test(a) && /class="wp-val" id="f_cm"[^>]*>170 cm</.test(a);
});
tryc('wiersze profil: wartość startowa wyszarzona; zmiana zapisuje S.kg i oznacza jako Twoją; wpisana wartość równa startowej ustawia ją jako Twoją, Enter bez wpisu i wyjście z pola nie', () => {
  WP().reset(); const h = view('intro', NEWD()), kg = RW('pf', 'kg');
  const a = /class="wp-val wp-y" id="f_kg"[^>]*>70,0 kg</.test(h) && kg.start.src === 'default' && kg.today == null;
  kg.put(WP().step(kg, kg.start.v, 1)); const b = T.S().kg === '70,1' && T.S().touched.kg === true && !T.S().touched.cm;
  const cm = RW('pf', 'cm'), blur = WP().editOutcome(cm, cm.start.v), en = WP().editOutcome(cm, cm.start.v, true), o = WP().editOutcome(cm, cm.start.v, true, true); if (o.kind === 'put') cm.put(o.v);
  return a && b && blur.kind === 'none' && en.kind === 'none' && o.kind === 'put' && o.v === 165 && T.S().touched.cm === true && T.S().cm === '165';
});
tryc('wiersze profil: wpis z klawiatury przez checkNum i LIM (wzrost 1720 odrzucony, wiek 15 poza zakresem, waga 82,4 kg przyjęta)', () => {
  view('set', BASE({ touched: { ...TA4 } })); const p = (k, t) => RW('pf', k).parse(t);
  return !!p('cm', '1720').err && !!p('age', '15').err && p('kg', '82,4 kg').v === 82.4 && !!p('goal', '').err;
});
// Suwaki z krokiem zależnym od prędkości (20.11.2026): krok dokładny (fine = step) przy wolnym przesuwaniu, siatka zgrubna (coarse) przy szybkim
const SNP = (v, sp, R) => WP().snapBySpeed(v, sp, R);
tryc('suwak: snapBySpeed: wolno zostaje wartość dokładna, szybko siatka zgrubna; skala 0-10 bez zmian; próg domyślny 300 px/s', () => {
  const S5 = { step: 5, coarse: 15, range: [180, 720], lim: [0, 960] }, K = { step: 50, coarse: 500, range: [0, 20000], lim: [0, 60000] }, Q = { step: 1, range: [0, 10], lim: [0, 10] };
  return SNP(425, 100, S5) === 425 && SNP(425, 900, S5) === 420 && SNP(425, -900, S5) === 420 && SNP(6550, 200, K) === 6550 && SNP(6550, 5000, K) === 6500 && SNP(6750, 5000, K) === 7000
    && SNP(7, 5000, Q) === 7 && SNP(425, 299, S5) === 425 && SNP(425, 301, S5) === 420 && SNP(425, 30, { ...S5, fastPx: 20 }) === 420 && SNP(19990, 1e5, K) === 20000;
});
tryc('suwak: krok dokładny i zgrubny w opisach wierszy: sen 5/15 min, kroki 50/500, czas treningu 1/5 min, wzrost 1/5 cm, wiek 1/5, skale 1/1; suwak w kroku dokładnym', () => {
  WP().reset(); const h = view('day', BASE({ lite: false, meas: {} })), s = wpS('s'), k = wpS('k'), tr = T.rowSpecs('tr').find((R) => R.key === 'min'), pf = T.rowSpecs('pf');
  const cm = pf.find((R) => R.key === 'cm'), age = pf.find((R) => R.key === 'age');
  return s.step === 5 && s.coarse === 15 && k.step === 50 && k.coarse === 500 && tr.step === 1 && tr.coarse === 5 && cm.step === 1 && cm.coarse === 5 && age.step === 1 && age.coarse === 5
    && /id="wp_rs" min="180" max="720" step="5"/.test(h) && /id="wp_rk" min="0" max="20000" step="50"/.test(h) && h.includes('aria-label="Sen o 5 minut więcej"') && h.includes('aria-label="50 kroków więcej"');
});
tryc('suwak: przytrzymanie − i + najpierw krokiem dokładnym, po ok. 1 s krokiem zgrubnym (siatka); Page Up i Page Down krokiem zgrubnym', () => {
  const S5 = { step: 5, coarse: 15, grid: true, lim: [0, 960] }, W = { step: 0.1, grid: false, lim: [35, 250] }, hs = WP().holdStep;
  return hs(S5, 425, 1, 1) === 430 && hs(S5, 425, 1, 8) === 430 && hs(S5, 425, 1, 9) === 435 && hs(S5, 435, 1, 12) === 450 && hs(S5, 425, -1, 12) === 420
    && Math.abs(hs(W, 80, 1, 1) - 80.1) < 1e-9 && Math.abs(hs(W, 80, 1, 31) - 80.5) < 1e-9 && WP().pageStep(S5, 425, 1) === 435 && WP().pageStep(S5, 425, -1) === 420;
});
// Poprawki po przeglądzie (20.11.2026): wpis równy wartości startowej to zapis, Enter bez wpisu w profilu tylko przechodzi dalej,
// próg prędkości suwaka w pikselach na sekundę, średnia trendu w dniach pomiarów, waga profilu co 0,1, czas treningu ponad 180 min, pusta waga
tryc('poprawki: wpisana wartość równa startowej zapisuje się (obwód, skład ciała, tętno, kroki, profil); bez wpisu nie', () => {
  WP().reset(); view('day', BASE({ lite: false, meas: { [dk(9)]: { waist: '84,5', ffm: '52', hrRest: '60' } } })); const eo = WP().editOutcome;
  const w = RW('ms', 'waist'), f = RW('ms', 'ffm'), h = RW('ms', 'hrRest'), x = RW('ms', 'vo2');
  const a = ['waist', 'ffm', 'hrRest', 'vo2'].every((k) => { const R = RW('ms', k); return eo(R, R.start.v, true, true).kind === 'put' && eo(R, R.start.v, true, false).kind === 'none'; });
  w.put(84.5); const b = T.S().meas[dk(0)].waist === '84,5';
  const kq = { key: 'steps', today: null, start: { v: 7431, src: 'last' }, copyTap: true, fmt: String }, c = eo(kq, 7431, true, true).kind === 'put' && eo(kq, 7431, true, false).kind === 'copy';
  WP().reset(); view('intro', NEWD()); const cm = RW('pf', 'cm'), d = eo(cm, cm.start.v, true, false).kind === 'none' && eo(cm, cm.start.v, true, true).kind === 'put';
  return a && b && c && d && !!f && !!h && !!x;
});
tryc('poprawki: profil bez wpisu: Enter nie potwierdza (bez confirmMsg), S.touched bez zmian; podpis „wartość startowa” zostaje', () => {
  WP().reset(); const h = view('intro', NEWD()), R = T.rowSpecs('pf');
  return R.every((x) => !x.confirmMsg && WP().editOutcome(x, x.start.v, true, false).kind === 'none') && JSON.stringify(T.S().touched) === '{}' && (h.match(/wartość startowa/g) || []).length === 4;
});
tryc('poprawki: snapBySpeed w pikselach na sekundę (domyślnie 300 px/s): wolne przeciągnięcie wzrostu i kroków zostaje dokładne, szybkie na siatce', () => {
  const CM = { step: 1, coarse: 5, range: [140, 210], lim: [120, 220] }, K = { step: 50, coarse: 500, range: [0, 20000], lim: [0, 60000] }, SNP2 = WP().snapBySpeed;
  return SNP2(172, 120, CM) === 172 && SNP2(172, 900, CM) === 170 && SNP2(6550, 250, K) === 6550 && SNP2(6550, -900, K) === 6500 && SNP2(172, 200, { ...CM, fastPx: 100 }) === 170 && SNP2(7, 5000, { step: 1, range: [0, 10], lim: [0, 10] }) === 7;
});
tryc('poprawki: średnia trendu tylko w dniach pomiarów (bez schodków): tyle punktów linii średniej, ile pomiarów', () => {
  const v = Array(84).fill(null); v[10] = 88; v[30] = 87; v[60] = 86; v[80] = 85; const s = WP().spark(v, null, { win: 28, avgLab: 'średnia 4 tygodni', lastPt: true });
  const m = /<polyline points="([^"]+)" fill="none" stroke="var\(--green\)"/.exec(s); return !!m && m[1].split(' ').length === 4;
});
tryc('poprawki: waga w profilu co 0,1 kg, waga docelowa co 0,5 kg', () => { WP().reset(); view('set', BASE({ kg: '82', goal: '78', touched: { kg: true, cm: true, age: true, goal: true } })); return RW('pf', 'kg').step === 0.1 && RW('pf', 'goal').step === 0.5 && PFS('kg', 1) === '82,1' && PFS('goal', -1) === '77,5'; });
tryc('poprawki: pusta waga z dawnych danych nie jest pokazywana jako 0 (wartość startowa wyszarzona)', () => {
  WP().reset(); const h = view('set', BASE({ kg: '', touched: { kg: true, cm: true, age: true, goal: true } })), R = RW('pf', 'kg');
  return R.today == null && R.start.v > 0 && !/id="f_kg"[^>]*>0,0 kg</.test(h) && /class="wp-val wp-y" id="f_kg"[^>]*>\d+,\d kg</.test(h);
});
tryc('poprawki: czas treningu ponad 180 min: wiersz pokazuje prawdziwą wartość, suwak stoi na końcu zakresu', () => {
  WP().reset(); const h = view('train', BASE({ tr: TRW({ min: '240' }) })); return /id="f_tr\.min"[^>]*>240 min</.test(h) && /id="tr_rmin" min="5" max="180" step="1" value="180"/.test(h);
});
tryc('poprawki: jeden podpis „Dotknij liczby, aby ją wpisać.” na ramkę zamiast w każdym wierszu', () => {
  WP().reset(); const h = view('day', BASE({ lite: false, meas: {} })), i = h.indexOf('data-fold="obwody"'), s = h.slice(i, h.indexOf('data-fold="tanita"'));
  return (s.match(/Dotknij liczby, aby ją wpisać\./g) || []).length === 1 && !/class="wp-hint"[^>]*>dotknij/.test(s);
});
// ---- Drobne (20.11.2026, plan „Łatwość” pkt 8): A1-A5 przyciski, B1-B4 jezioro, C1-C5 zaległe z rady ----
const EATD = (id, n) => Array.from({ length: n }, (_, i) => ({ kind: 'm', id, label: 'x' + i, k: 100 + i, p: 1, f: 1, c: 1 }));
tryc('drobne A1: po oknie Cofnij posiłek zjedzony wcześniej ma „Zjedzone dziś: N× · Usuń”; Usuń kasuje ostatni wpis dania przez Cofnij 8 s', () => {
  ACLR(); const id = T.planIds()[0], other = { kind: 'm', id: 'x9', label: 'inne', k: 50, p: 0, f: 0, c: 0 }, a = EATD(id, 2);
  const h0 = view('meals', BASE({ days: { [dk(0)]: [a[0], other, a[1]] }, meas: {} }));
  if (!h0.includes('Zjedzone dziś: 2×') || !h0.includes(`data-eatrm="${id}"`) || ABL(h0, 'meal:' + id) !== 'Zjem jeszcze raz') throw new Error('linia ' + h0.includes('Zjedzone dziś'));
  if (/data-eatn="[^"]*"[^>]*hidden/.test(h0)) throw new Error('ukryta po oknie');
  els.toast.innerHTML = ''; click({ eatrm: id }); const d = T.S().days[dk(0)];
  if (d.length !== 2 || d[0] !== a[0] || d[1] !== other) throw new Error('usunięto nie ten wpis ' + JSON.stringify(d.map((e) => e.label)));
  if (!/data-undo="1"/.test(toastHtml()) || !/Cofnij/.test(toastHtml())) throw new Error('bez Cofnij');
  if (!mainHtml().includes('Zjedzone dziś: 1×')) throw new Error('licznik po usunięciu');
  click({ undo: '1' }); if (T.S().days[dk(0)].length !== 3 || !mainHtml().includes('Zjedzone dziś: 2×')) throw new Error('cofnięcie');
  const h1 = view('meals', BASE({ days: {}, meas: {} })); ACLR();
  const h2 = view('meals', BASE({ days: { [dk(0)]: [] }, meas: {} })); if (h1.includes('Zjedzone dziś') || h2.includes('Zjedzone dziś')) throw new Error('linia bez wpisów');
  click({ addmeal: id, ab: 'meal:' + id }); const g = mainHtml();
  return /data-eatn="[^"]*"[^>]*hidden/.test(g) && ABL(g, 'meal:' + id) === '✓ Zjedzone · Cofnij';
});
tryc('drobne A1: linia „Zjedzone dziś” także w przepisie; Usuń to osobny przycisk (nie data-ab), przez undoable', () => {
  ACLR(); const id = 'o1', e = EATD(id, 3), h = view('recipe', BASE({ recipe: id, days: { [dk(0)]: e } }));
  const src = fs.readFileSync(path.join(root, 'app.js'), 'utf8'), m = /data-eatrm="[^"]*"/.exec(h);
  return h.includes('Zjedzone dziś: 3×') && !!m && !/data-eatrm="[^"]*"[^>]*data-ab/.test(h) && /d\.eatrm[\s\S]{0,400}undoable\(/.test(src);
});
tryc('drobne A2: „Według planu” bez komunikatu poza pierwszymi krokami (przycisk i #sr wystarczą), w pierwszych krokach komunikat z następnym krokiem', () => {
  ACLR(); view('day', { ...CLEAN(), once: true, pet: { ...PETA }, petSeen: [...SEEN_ALL], guide: { ...HID } }); els.toast.innerHTML = '';
  click({ dayplan: '1', ab: 'plan' }); const a = toastHtml(), n = nE();
  ACLR(); view('day', { ...NEWU(), kg: '82', once: true, pet: { ...PETA }, guide: { hidden: false, dataOk: true, seenPet: false } }); els.toast.innerHTML = '';
  click({ dayplan: '1', ab: 'plan' }); const b = toastHtml();
  return n >= 2 && !/z planu|Dodano/.test(a) && /Dodano|z planu/.test(b) && /Dalej/.test(b);
});
tryc('drobne A5: „Według planu” po oknie pokazuje stan zapisany („✓ Plan zapisany”), nie napis jak na starcie', () => {
  ACLR(); const h = view('day', { ...CLEAN(), once: true, pet: { ...PETA }, petSeen: [...SEEN_ALL], guide: { ...HID } });
  const m = /data-ab="plan"[^>]*>(.*?)<\/button>/.exec(h); if (!m) throw new Error('brak przycisku');
  const labs = [...m[1].matchAll(/data-l="([^"]*)"/g)].map((x) => x[1]);
  return labs.length === 3 && labs[0] === 'Według planu' && labs[2] === '✓ Plan zapisany' && labs[2] !== labs[0];
});
const LABFILL = (o) => { els.l_val = { value: '2,5' }; els.l_date = { value: '2026-11-10' }; els.l_unit = { value: 'mIU/ml' }; els.l_fast = { checked: !!o.fast }; els.l_lo = { value: o.lo || '' }; els.l_bio = { checked: !!o.bio }; els.l_cyc = { value: o.cyc || '' }; els.l_cr = { checked: !!o.cr }; };
tryc('drobne A3: pamięć daty i jednostki w Badaniach znika po nowym dniu i po wyjściu z zakładki', () => {
  ACLR(); view('labs', BASE({ labs: [], labSel: 'tsh' })); LABFILL({}); click({ labsave: '1', ab: 'lab' }); AGO('lab', 6000);
  const keep = view('labs', {}); if (!/id="l_date" value="2026-11-10"/.test(keep)) throw new Error('bez pamięci na tej samej zakładce');
  T.labKeep().day = dk(1); const nd = view('labs', {}); if (!new RegExp(`id="l_date" value="${T.todayKey()}"`).test(nd) || T.labKeep() !== null) throw new Error("nowy dzień " + JSON.stringify(T.labKeep()));
  ACLR(); LABFILL({}); click({ labsave: '1', ab: 'lab' }); view('day', {}); const out = T.labKeep();
  const back = view('labs', {}); return out === null && new RegExp(`id="l_date" value="${T.todayKey()}"`).test(back) && /id="l_unit" value="µIU\/ml"/.test(back);
});
tryc('drobne A4: Cofnij wyniku badania oddaje wszystkie wpisane pola (wartość, dolna granica, na czczo, biotyna, cykl; kreatyna)', () => {
  ACLR(); view('labs', BASE({ labs: [], labSel: 'tsh', sex: 'K' })); LABFILL({ fast: true, lo: '0,4', bio: true, cyc: '2' }); click({ labsave: '1', ab: 'lab' });
  AGO('lab', 1000); click({ labsave: '1', ab: 'lab' }); const h = mainHtml();
  const a = /id="l_val" value="2,5"/.test(h) && /id="l_lo"[^>]*value="0,4"/.test(h) && /id="l_fast"[^>]*checked/.test(h) && /id="l_bio"[^>]*checked/.test(h) && /id="l_cyc"[^>]*value="2"/.test(h);
  ACLR(); view('labs', BASE({ labs: [], labSel: 'kreat', sex: 'M' })); LABFILL({ cr: true }); click({ labsave: '1', ab: 'lab' }); AGO('lab', 1000); click({ labsave: '1', ab: 'lab' });
  return a && /id="l_cr"[^>]*checked/.test(mainHtml()) && !/id="l_fast"[^>]*checked/.test(mainHtml());
});
tryc('drobne B1: bez pathSeen (po aktualizacji) kamienie nie dają fałszywego podskoku; nowy kamień po zapisie pathSeen skacze', () => {
  const S = BASE({ pet: { kind: 'kapibara', name: 'A', since: dk(30), stones: ['a', 'b'] } });
  const a = view('pet', S), seen = T.S().pet.pathSeen, S2 = BASE({ pet: { kind: 'kapibara', name: 'A', since: dk(30), stones: ['a', 'b'], pathSeen: 1 } });
  const b = view('pet', S2);
  return !a.includes('stonepet pet-kapibara hop') && seen === 2 && b.includes('stonepet pet-kapibara hop') && T.S().pet.pathSeen === 2;
});
tryc('drobne B2: strumień i mgła miękkie (gradient zamiast twardej krawędzi), identyfikatory unikalne', () => {
  const m = svgOf(JP(3, 'mgla', 'K', 'gaska')), o = svgOf(JP(3, '', 'K', 'gaska')), ids = (s) => [...s.matchAll(/\sid="([^"]+)"/g)].map((x) => x[1]);
  const fogOk = /class="fog"[^>]*fill="url\(#([^)]+)\)"/.exec(m), stOk = /class="stream"[^>]*fill="url\(#([^)]+)\)"/.exec(o);
  return !!fogOk && !!stOk && ids(m).includes(fogOk[1]) && ids(o).includes(stOk[1]) && new Set(ids(m)).size === ids(m).length && /<linearGradient[^>]*id="[^"]+"[\s\S]*stop-opacity="0"/.test(m) && /<linearGradient[\s\S]*stop-opacity="0"/.test(o);
});
tryc('drobne B3-B4: smuga wiatru co najmniej 3:1 do powierzchni w obu motywach; mgła w ciemnym lżejsza niż w jasnym (token --zw-fog-o)', () => {
  const b = themeBlocks(), hex = (blk, n) => (blk.match(new RegExp('--' + n + ':(#[0-9A-Fa-f]{6})')) || [])[1], num = (blk) => +((blk.match(/--zw-fog-o:\s*([0-9.]+)/) || [])[1]);
  const bad = []; for (const [n, blk] of [['jasny', b.light], ['ciemny', b.dark], ['ciemny-mq', b.darkMq]]) { const c = contrast(hex(blk, 'zw-wind'), hex(blk, 'surface')); if (c < 3) bad.push(n + ' ' + c.toFixed(2)); }
  if (bad.length) throw new Error(bad.join('; '));
  return num(b.dark) > 0 && num(b.dark) < num(b.light) && num(b.darkMq) === num(b.dark) && /\.stones \.fog\{[^}]*opacity:var\(--zw-fog-o\)/.test(sysCss);
});
tryc('drobne C1: w prostym widoku arkusz „Dodaj wpis” bez „Brzuch dziś” (jest kafelek w karcie), w pełnym widoku zostaje', () => {
  liteReset(); T.S().prof = { cond: { gut: true }, pill: '' }; view('day', {}); click({ addsheet: '1' }); const a = sheetH();
  T.S().lite = false; view('day', {}); click({ addsheet: '1' }); const b = sheetH(); T.S().prof = { cond: {}, pill: '' };
  return !a.includes('Brzuch dziś') && !a.includes('fold_brzuch') && b.includes('Brzuch dziś');
});
tryc('drobne C2: prosty widok przed pierwszym szybkim wpisem dnia: wskaźniki zwierzaka neutralne (nie niskie), po wpisie bez zmian', () => {
  const c0 = mkCtx({ empty: 3 }), a = st({ ...c0, lite: true, liteFull: () => false }), b = st({ ...c0, lite: true, liteFull: () => true }), n = st(c0);
  return Object.values(a.meters).every((v) => v >= 50 && v <= 70) && Object.values(b.meters).every((v) => v < 50) && Object.values(n.meters).every((v) => v < 50);
});
tryc('drobne C3: podpis „cel w przybliżeniu” przy celu kalorii, gdy waga, wzrost lub wiek są startowe (Dziś i Posiłki); po wpisaniu własnych znika', () => {
  const m = { kind: 'm', id: 'o1', label: 'x', k: 400, p: 20, f: 10, c: 40 }, T0 = { kg: true, cm: true, age: true, goal: true };
  const a = view('day', BASE({ touched: {}, days: { [dk(0)]: [m] } })), a2 = view('meals', BASE({ touched: {} }));
  const b = view('day', BASE({ touched: T0, days: { [dk(0)]: [m] } })), b2 = view('meals', BASE({ touched: T0 }));
  const c = view('day', BASE({ touched: { kg: true, cm: true }, days: { [dk(0)]: [m] } }));
  return /cel w przybliżeniu, wpisz wagę, wzrost i wiek/.test(a) && /cel w przybliżeniu, wpisz wagę, wzrost i wiek/.test(a2) && !/w przybliżeniu, wpisz/.test(b) && !/w przybliżeniu, wpisz/.test(b2) && /w przybliżeniu, wpisz/.test(c);
});
tryc('drobne C4: ustawienie „Przyciski − i + po lewej” (domyślnie po prawej): S.pmLeft, przełącznik w Ustawieniach, atrybut data-pm na html, kopia bez zdrowia', () => {
  const D = T.DEF(), h = view('set', BASE()), src = fs.readFileSync(path.join(root, 'app.js'), 'utf8'), css = sysCss;
  return D.pmLeft === false && h.includes('data-k="pmLeft"') && h.includes('Przyciski − i + po lewej') && T.nhKeep().includes('pmLeft') && /dataset\.pm=S\.pmLeft\?'l':'r'/.test(src) && /html\[data-pm="l"\] \.wp-pm\{[^}]*order:-1/.test(css);
});
tryc('drobne C5: krótka wibracja po zapisie (navigator.vibrate(15)), tylko gdy włączona i obsługiwana; przełącznik w Ustawieniach domyślnie włączony', () => {
  ACLR(); const calls = []; sandbox.navigator.vibrate = (n) => { calls.push(n); return true; };
  try {
    const id = T.planIds()[0], D = T.DEF(); view('meals', BASE({ days: {}, vibr: true }));
    click({ addmeal: id, ab: 'meal:' + id }); const on = calls.length === 1 && calls[0] === 15;
    ACLR(); view('meals', BASE({ days: {}, vibr: false })); click({ addmeal: id, ab: 'meal:' + id }); const off = calls.length === 1;
    delete sandbox.navigator.vibrate; ACLR(); view('meals', BASE({ days: {}, vibr: true })); click({ addmeal: id, ab: 'meal:' + id });
    const h0 = view('set', BASE({ vibr: true })); sandbox.navigator.vibrate = () => true; const h = view('set', BASE({ vibr: true }));
    // Przełącznik tylko tam, gdzie urządzenie obsługuje wibrację (S.vibr zostaje w danych)
    return on && off && D.vibr === true && !h0.includes('data-k="vibr"') && h.includes('data-k="vibr"') && h.includes('Wibracja po zapisie') && T.nhKeep().includes('vibr');
  } finally { delete sandbox.navigator.vibrate; }
});
// Przegląd gałęzi (C1): przytrzymanie − i + w wierszu z zapisem od razu zapisuje tylko po puszczeniu na przycisku; pointercancel i zsunięcie to anulowanie
tryc('przytrzymanie: zapis tylko po pointerup nad przyciskiem; pointercancel, zsunięcie z przycisku i przerwanie bez zdarzenia nic nie zapisują', () => {
  const o = WP().holdOutcome; return o('pointerup', true) === 'put' && o('pointerup', false) === 'cancel' && o('pointercancel', true) === 'cancel' && o('cancel', false) === 'cancel';
});
// Przegląd gałęzi (drobne): zdanie przed kafelkami szybkiego wpisu, widoczny stan „Plan zapisany”, nazwa „Dlaczego: temat”
tryc('drobne: przed kafelkami szybkiego wpisu widoczne zdanie, że karta zwinie się po odpowiedziach', () => {
  liteReset(); T.S().meas = {}; const h = view('day', {}), i = h.indexOf('id="lite"'), sec = h.slice(i, h.indexOf('</section>', i)), j = sec.indexOf('Po odpowiedziach karta zwinie się');
  return j > 0 && j < sec.indexOf('data-lite="feel:');
});
tryc('drobne: Według planu przy zapisanym już planie pokazuje widoczny komunikat (nie tylko #sr)', () => {
  view('day', { ...CLEAN(), once: true, pet: { ...PETA }, petSeen: [...SEEN_ALL], guide: { ...HID } }); click({ dayplan: '1' }); els.toast.innerHTML = ''; click({ dayplan: '1' });
  return els.toast.innerHTML.includes('Plan na dziś jest już zapisany');
});
tryc('drobne: każde „Dlaczego?” ma nazwę „Dlaczego: temat” (aria-label)', () => {
  const hs = ['set', 'meals', 'health', 'mob'].map((t) => view(t, BASE())).join(''), all = [...hs.matchAll(/<summary([^>]*)>Dlaczego\?<\/summary>/g)];
  return all.length > 3 && all.every((m) => /aria-label="Dlaczego: [^"]{3,}"/.test(m[1]));
});
// Przegląd gałęzi (I2): prędkość, nachylenie i moc w Treningu to wiersze wartości (ten sam komponent, strona − i + jak w Ustawieniach)
tryc('wiersze trening: prędkość i nachylenie bieżni, moc spinningu jako wiersze; nachylenie 0 to wartość; bez pól z − i +', () => {
  WP().reset(); const a = view('train', BASE({ tr: { ...T.S().tr, cat: 'bieznia', speed: '6', grade: '0' } })); WP().reset(); const b = view('train', BASE({ tr: { ...T.S().tr, cat: 'spinning', sMode: 'w', watts: '120' } }));
  const g = T.rowSpecs('tr').find((R) => R.key === 'grade'), sp = T.rowSpecs('tr').find((R) => R.key === 'speed');
  return /class="wp-val" id="f_tr\.speed"[^>]*>6,0 km\/h</.test(a) && /class="wp-val" id="f_tr\.grade"[^>]*>0,0 %</.test(a) && /class="wp-val" id="f_tr\.watts"[^>]*>120 W</.test(b)
    && sp.step === 0.5 && g.today === 0 && !a.includes('class="stp"') && !b.includes('data-stp') && !a.includes('data-k="tr.speed"') && b.includes('pokazuje średnią moc z całych zajęć');
});
tryc('wiersze: jedna funkcja liczby z krokiem dla zapisu i wyświetlania (82,5 / 82,0 / 1 530)', () => T.stpFmt(82.5, 0.5) === '82,5' && T.stpFmt(82, 0.5) === '82' && T.stpFmt(1530, 10) === '1530' && T.rowSpecs('ms').find((R) => R.key === 'bmr').fmt(1530) === '1' + String.fromCharCode(160) + '530 kcal');
chain.then(() => {
  console.log(`WYNIK: ${ok} OK, ${bad} BLAD`);
  process.exit(bad ? 1 : 0);
});
