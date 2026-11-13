# Sygnały brzucha i żołądka: plan wdrożenia

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zwierzak jako pomocnik wizyty: reguły z danych brzucha i żołądka (alarm 112, lekarz wkrótce, badanie do
zapytania, możesz sam), lista na wizytę i „Co ustalił lekarz?”.

**Architecture:** Nowy moduł `sygnaly.js` (czyste funkcje, eksport `SYG`, jak `zdarzenia.js`/`ZD`). `app.js` tylko
zbiera wejście (chipy, przełączniki) i pokazuje wynik `SYG.visible`/`SYG.ocen`. `pet.js` dostaje nastrój `alert`.

**Tech Stack:** vanilla JS, CSP `script-src 'self'`, `localStorage`, `tests/smoke.js` (vm sandbox, `tryc`),
Playwright `tests/przegladarka/` (6 projektów).

**Spec:** `miara-pwa/docs/specs/2026-11-13-sygnaly-brzuch-design.md`

Repozytorium robocze: `GitHub_portfolio/miara` (prywatne, źródło), gałąź `sygnaly-brzuch` z `main` (po scaleniu
`separatory`). Do `miara-pwa` przez `tools/sanitize_miara.py` i skrypt `ship.sh` na końcu (zadanie 9).

## Global Constraints

- Teksty reguł dosłownie ze specyfikacji, sekcja 3; źródła tylko z sekcji 8 (otwarte 13.11.2026).
- Żaden tekst sygnału nie zawiera słów „odstaw”, „masz”, „dysbioza”.
- Progi spoza wytycznych mają `rm: true` i w dymku etykietę „reguła Miary”.
- Próg: co najmniej 8 dni z objawem w 28 dniach kończących się dniem `k`, przy co najmniej 14 dniach z wpisem w `S.gut`.
- Alarm nie zależy od `S.pet`, nie da się go wyciszyć, ma `role="alert"` i `tel:112`.
- Cele dotyku co najmniej 44 px, co najwyżej 8 rozmiarów pisma, tryb jasny i ciemny, 320 px bez poziomego przewijania.
- Wszystkie teksty z danych przez `esc()`. Nowe pola tylko w `localStorage` i kopii; lista na wizytę tylko do schowka.
- Commity tylko `slashdev-ops <kamil@slashdev.pl>`, bez Co-Authored-By. Bez commitowania `tests/przegladarka/playwright.config.js`.
- Znaki: po każdym zapisie `python -I CV_SOC/tools/check_chars.py <plik>`; NBSP jako `\u00a0`.
- Kolejność poziomów: `LVL = ['112','wkrotce','badanie','sam']`.

## Review Focus

1. Stary wpis dziennika bez `u`/`a` (dane sprzed zmiany) i kopia bez nowych pól: reguły liczą jak puste tablice, nic nie pada (zadanie 3).
2. Wartość ferrytyny z przecinkiem („12,5”) i wynik bez `lo`: porównanie liczbowe po zamianie przecinka; brak `lo` = brak sygnału (zadanie 2).
3. Północ i strefa czasu: okno 28 i 7 dni liczone z kluczy `RRRR-MM-DD`, nie z `Date.now()` (zadanie 1, test z `k` podanym jawnie).
4. Tryb dyskretny włączony po dzisiejszym wpisie alarmowym: alarm nadal widoczny, reszta ukryta (zadanie 1).
5. Zwierzak wyłączony (`S.pet` = null) przy alarmie: karta `note warn` z `tel:112` (zadanie 6, Playwright w zadaniu 8).

---

### Task 1: Mapa powiązań i źródła rady (przed kodem)

**Files:**
- Modify: `GitHub_portfolio/rada/mapa_powiazan.md` (wiersze 31-41, po wierszu 30)
- Modify: `GitHub_portfolio/rada/2026-11-08_zrodla.md` (sekcja „13.11.2026: brzuch i żołądek”)

Pliki rady są lokalne, poza repozytoriami: bez commita.

- [ ] **Step 1:** Dopisz wiersze 31-41 w formacie wierszy 24-30: 31 `alarm`, 32 `pilne`, 33 `gastro45`, 34 `hp_test`,
  35 `hp_nlpz`, 36 `hp_rodz`, 37 `celiakia`, 38 `zelazo`, 39 `hp_kontrola`, 40 `sam_zoladek`, 41 karta mikrobiomu.
  Kolumny: dane w Miarze, związek (ze specyfikacji, sekcja 3), siła (wytyczne PTG-E i NHS: mocne; próg 8 z 28: reguła
  Miary), miejsce w aplikacji (`sygnaly.js`, id), „Sprawdzone: tak” z datą 13.11.2026.
- [ ] **Step 2:** Przenieś cytaty z `scratchpad/zrodla_brzuch.md` do `2026-11-08_zrodla.md` (URL, data, cytat).
- [ ] **Step 3:** `check_chars.py` na obu plikach. Expected: `z problemami: 0`.

### Task 2: `sygnaly.js`: szkielet, alarm, pilne, gastro45

**Files:**
- Create: `miara/sygnaly.js`
- Modify: `miara/index.html` (`<script src="sygnaly.js"></script>` po `zdarzenia.js`), `miara/sw.js` (`'./sygnaly.js'` w `ASSETS`)
- Test: `miara/tests/smoke.js` (ładowanie po linii 27, testy przed `chain.then(() => {`)

**Interfaces:**
- Produces: `SYG.ocen(S, k) -> Sygnal[]`, `SYG.LVL`, `SYG.back(k, i) -> string`.
  `Sygnal = { id, lvl, t, x, d, co: string[], src: string[], rm: boolean, row: number }`
  (`d`: linia „Dane” z liczbami, np. „Objawy z żołądka: 9 z 28 dni (16 dni z wpisem)”).

- [ ] **Step 1: Testy (czerwone).** W smoke: `const Y = () => sandbox.SYG;` i
  `const YS = (o) => ({ gut: {}, labs: [], prof: { cond: { gut: true } }, discreet: false, wizyta: { hp: 'brak' }, sygSeen: {}, ...o });`
  plus `const gd = (n, f) => { const g = {}; for (let i = 0; i < n; i++) g[Y().back(D0, i)] = f(i); return g; };`

```js
tryc('sygnaly: moduł ma ocen, LVL, back', () => !!Y() && typeof Y().ocen === 'function' && Y().LVL.join() === '112,wkrotce,badanie,sam' && Y().back('2026-03-01', 1) === '2026-02-28');
tryc('sygnaly: bez cond.gut pusta lista', () => Y().ocen(YS({ prof: { cond: {} }, gut: { [D0]: { a: ['krew'] } } }), D0).length === 0);
tryc('sygnaly: krew dziś = alarm 112 pierwszy', () => { const r = Y().ocen(YS({ gut: { [D0]: { a: ['krew'], u: ['piecze'] } } }), D0); return r[0].id === 'alarm' && r[0].lvl === '112'; });
tryc('sygnaly: krew wczoraj, dziś nic = bez alarmu', () => !Y().ocen(YS({ gut: { [Y().back(D0, 1)]: { a: ['krew'] } } }), D0).some((x) => x.id === 'alarm'));
tryc('sygnaly: wymkrew i bol też alarm', () => ['wymkrew', 'bol'].every((a) => Y().ocen(YS({ gut: { [D0]: { a: [a] } } }), D0)[0].id === 'alarm'));
tryc('sygnaly: polyk 6 dni temu = pilne, 7 dni temu nie', () => Y().ocen(YS({ gut: { [Y().back(D0, 6)]: { a: ['polyk'] } } }), D0).some((x) => x.id === 'pilne') && !Y().ocen(YS({ gut: { [Y().back(D0, 7)]: { a: ['polyk'] } } }), D0).some((x) => x.id === 'pilne'));
tryc('sygnaly: objaw z żołądka i g45 = gastro45 (wkrotce)', () => { const r = Y().ocen(YS({ prof: { cond: { gut: true }, g45: true }, gut: { [D0]: { u: ['pelnosc'] } } }), D0); return r.some((x) => x.id === 'gastro45' && x.lvl === 'wkrotce'); });
tryc('sygnaly: tryb dyskretny ukrywa wszystko poza dzisiejszym alarmem', () => { const s = YS({ discreet: true, prof: { cond: { gut: true }, g45: true }, gut: { [D0]: { a: ['krew'], u: ['piecze'] } } }); return Y().ocen(s, D0).map((x) => x.id).join() === 'alarm'; });
tryc('sygnaly: stary wpis bez u i a nie psuje', () => Y().ocen(YS({ gut: gd(28, () => ({ b: 2, f: 'uform', n: 1 })) }), D0).length === 0);
```

- [ ] **Step 2:** `node tests/smoke.js`. Expected: nowe testy FAIL (`SYG` undefined), reszta PASS.
- [ ] **Step 3: Implementacja** `sygnaly.js` jako IIFE przypisane do `globalThis.SYG` (wzór: `zdarzenia.js`).
  `back(k, i)`: data z klucza w południe UTC minus `i` dni. Reguły jako tablica obiektów `{ id, lvl, row, src, rm, on(S, k, ctx) -> d|null, t, x, co }`;
  `ocen` liczy `ctx` raz (dni z wpisem, dni z `u`, dni z wzdęciem 5+ lub `luzny`, z 7 i 28 dni), filtruje, sortuje po
  `LVL` stabilnie. Teksty `t`/`x`/`co` dosłownie ze specyfikacji, sekcja 3. `src`: `alarm` → `['nhsulcer','nhsgastritis']`,
  `pilne` → `['nhsindig']`, `gastro45` → `['ptge23']`.
- [ ] **Step 4:** `node tests/smoke.js`. Expected: wszystkie PASS. Także `check('index.html: sygnaly.js po zdarzenia.js', …)` i `check('sw.js: sygnaly.js', …)` w stylu linii 147-148.
- [ ] **Step 5:** Commit „Sygnały brzucha: moduł, alarm 112, lekarz wkrótce”.

### Task 3: Reguły badań, „możesz sam”, wyciszenie, poprawki kopii

**Files:**
- Modify: `miara/sygnaly.js`
- Modify: `miara/app.js` (`load()` linia 891 i `bkapply` linia 1723: wywołanie `SYG.fix(S)` po scaleniu)
- Test: `miara/tests/smoke.js`

**Interfaces:**
- Consumes: `SYG.ocen`, `SYG.back` (zadanie 2).
- Produces: `SYG.visible(S, k) -> Sygnal[]` (bez wyciszonych), `SYG.fix(S) -> S` (normalizacja), `SYG.U`, `SYG.A`
  (dozwolone wartości), `SYG.HP = ['brak','zlecone','potw','leczone','wykl','nic']`.

- [ ] **Step 1: Testy (czerwone).**

```js
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
```

- [ ] **Step 2:** `node tests/smoke.js`. Expected: nowe testy FAIL.
- [ ] **Step 3: Implementacja.** Reguły `hp_test`, `hp_nlpz`, `hp_rodz`, `celiakia`, `zelazo`, `hp_kontrola`,
  `sam_zoladek` (teksty, warunki i źródła ze specyfikacji, sekcja 3; `src`: `ptge23`, `nhsindig`, `nhscoeliac`) oraz
  `zapisuj` (lvl `sam`, `rm: true`, row 28: przy mniej niż 14 dniach z wpisem i co najmniej 1 dniu z `u`, wzdęciem 5+
  lub `luzny`; tekst: „Zapisuj dalej: po 14 dniach z wpisem powiem więcej.”). Liczby z przecinkiem: `parseFloat(String(v).replace(',', '.'))`.
  `fix`: `u`/`a` → tablica tylko z `SYG.U`/`SYG.A`; `prof.g45|nlpz|rodzRak` → boolean (`=== true`);
  `wizyta.hp` spoza `HP` → `'brak'`; `sygSeen` → obiekt z wartościami `RRRR-MM-DD`; `wizList` → tablica znanych `id`.
- [ ] **Step 4:** `node tests/smoke.js`. Expected: wszystkie PASS.
- [ ] **Step 5:** Commit „Sygnały brzucha: badania do zapytania, możesz sam, wyciszenie, poprawki kopii”.

### Task 4: Wejście: chipy w dzienniku i przełączniki w profilu

**Files:**
- Modify: `miara/app.js` (`gutHtml` linia 721, obsługa kliknięć linia 1758, profil przy `CONDS` linia 1194, `DEF` linia 850: `wizyta:{hp:'brak'},sygSeen:{},wizList:[]`)
- Test: `miara/tests/smoke.js`

**Interfaces:**
- Consumes: `SYG.U`, `SYG.A` (etykiety w `app.js`: tablice par `[wartość, etykieta]` ze specyfikacji, sekcja 2).
- Produces: atrybuty `data-gutu`, `data-guta` (przełączają wartość w `S.gut[todayKey()].u|a`), `data-gprof` (`g45|nlpz|rodzRak`).

- [ ] **Step 1: Testy (czerwone)** z `view()`/`BASE()` jak inne testy dziennika: przy `cond.gut` HTML Mój dzień zawiera
  `data-gutu="piecze"`, `data-guta="krew"`, nagłówki „Z żołądka” i „Objawy alarmowe”; klik `data-guta="krew"` dwa razy
  zostawia `a` puste (przełączanie); profil przy `cond.gut` ma `data-gprof="g45"`, bez `cond.gut` nie ma; tryb dyskretny: brak `data-guta`.
- [ ] **Step 2:** smoke. Expected: FAIL.
- [ ] **Step 3: Implementacja:** dwa nowe wiersze chipów w `gutHtml` (wzorem `row`, ale z `aria-pressed` per wartość
  w tablicy), obsługa przełączania, przełączniki w profilu w stylu istniejących chipów `cond`.
- [ ] **Step 4:** smoke. Expected: PASS.
- [ ] **Step 5:** Commit „Dziennik brzucha: objawy z żołądka i alarmowe; profil: 45+, NLPZ, rodzina”.

### Task 5: Zwierzak: nastrój `alert`

**Files:**
- Modify: `miara/pet.js` (`MOOD_PL` linia 79: `alert: 'uwaga'`), `miara/app.css` (`.pet-alert .figure{animation:none}`, `.pet-alert .eyes{animation:none}`)
- Test: `miara/tests/smoke.js`

- [ ] **Step 1: Test (czerwony):** `PET.svg('gaska','chick','alert',null)` zawiera `pet-alert` i `aria-label` z „uwaga”;
  `app.css` zawiera `.pet-alert .figure{animation:none`.
- [ ] **Step 2:** smoke. Expected: FAIL.
- [ ] **Step 3:** Implementacja (bez nowych kształtów: oczy domyślne, bez ruchu).
- [ ] **Step 4:** smoke. Expected: PASS.
- [ ] **Step 5:** Commit „Zwierzak: nastrój uwaga bez animacji”.

### Task 6: Dymek, karta zastępcza, karta w Zdrowiu, „Co ustalił lekarz?”

**Files:**
- Modify: `miara/app.js`: nowe `sygHtml()`; Mój dzień (linia 1491): `sygHtml()` tuż przed `gutHtml()`, gdy `due`,
  inaczej na początku listy; Zdrowie przy `c.gut` (linia 1228): karta „Sygnały z Twoich wpisów” (`a(1.4, …)`) z
  wszystkimi `SYG.ocen`, kroki `co`, `srcHtml(src)`, etykieta „z wytycznej” / „reguła Miary”, kotwica `id="syg_<id>"`;
  chipy „Co ustalił lekarz?” (`data-hp`); karta mikrobiomu `a(14.7, 'Testy mikrobiomu', …, ['porcari25'])`;
  `SRC`: `ptge23`, `nhsgastritis`, `nhsindig`, `nhsulcer`, `nhscoeliac`, `porcari25` (URL ze specyfikacji, sekcja 8;
  format jak `nhsbloat`, linia 1141).
- Modify: `miara/app.css`: `.petsay.alert{border:2px solid var(--danger)}` (zmienna istniejąca; sprawdź `grep -- '--danger\|--warn' app.css` i użyj istniejącej).
- Test: `miara/tests/smoke.js`

**Interfaces:**
- Consumes: `SYG.visible`, `SYG.ocen`, `PET.svg(…,'alert',…)`.
- Produces: `data-sygseen="<id>"` (zapis `S.sygSeen[id]=todayKey()`), `data-sygwiz="<id>"` (dodaje do `S.wizList`
  bez duplikatów), `data-hp="<HP>"` (`S.wizyta={hp, d: todayKey()}`), link „Źródło i szczegóły” (`S.tab='health'`, przewinięcie do `syg_<id>`).

- [ ] **Step 1: Testy (czerwone):**
  - alarm dziś, zwierzak włączony: Mój dzień zawiera `role="alert"`, `href="tel:112"`, `pet-alert`, brak `data-sygseen`;
  - alarm dziś, `S.pet=null`: zawiera `class="note warn"` z `href="tel:112"`, bez `pet-alert`;
  - sygnał `hp_test`: dymek ma „Dane”, „reguła Miary”, `data-sygwiz="hp_test"`, `data-sygseen="hp_test"`; na ekranie jest tylko jeden `class="petsay`;
  - klik `data-sygseen` ukrywa dymek; klik `data-hp="wykl"` ustawia `S.wizyta.hp`;
  - Zdrowie przy `cond.gut`: zawiera `id="syg_hp_test"`, „Testy mikrobiomu”, „Co ustalił lekarz?”;
  - imię zwierzaka z `<b>` jest escapowane w dymku.
- [ ] **Step 2:** smoke. Expected: FAIL.
- [ ] **Step 3:** Implementacja.
- [ ] **Step 4:** smoke. Expected: PASS; strażnik rozmiarów pisma PASS.
- [ ] **Step 5:** Commit „Zwierzak przy sygnałach: dymek, alarm 112, karta w Zdrowiu, Co ustalił lekarz”.

### Task 7: Lista na wizytę

**Files:**
- Modify: `miara/app.js` `visitLines()` (linia 1336-1342, blok `cond.gut`)
- Test: `miara/tests/smoke.js`

- [ ] **Step 1: Testy (czerwone):** przy `cond.gut`, alarmie 3 dni temu, `nlpz`, aktywnym `hp_test` i `S.wizList=['sam_zoladek']`:
  `visitLines().join('\n')` zawiera datę alarmu (`fmtDate`), „Do omówienia:” z tytułem `hp_test` i `sam_zoladek`,
  „Biorę regularnie ibuprofen lub aspirynę”; nie zawiera „dysbioz”; bez `cond.gut` brak „Do omówienia”.
- [ ] **Step 2:** smoke. Expected: FAIL.
- [ ] **Step 3:** Implementacja: daty dni z `a` w 28 dniach, „Do omówienia: <t>” dla `lvl` `wkrotce`/`badanie` i `wizList`
  (bez duplikatów), linie z `nlpz`, `rodzRak`, ferrytyną poniżej zakresu.
- [ ] **Step 4:** smoke. Expected: PASS.
- [ ] **Step 5:** Commit „Lista na wizytę: sygnały brzucha, daty alarmów, pytania”.

### Task 8: Notatki „niesprawdzone” w wynikach i testy przeglądarki

**Files:**
- Modify: `miara/app.js` `LABS` (linie 326-344: notatki z „wiedza ogólna”)
- Create: `miara/tests/przegladarka/sygnaly.spec.js` (wzór `open()` z `posilki.spec.js`)
- Test: `miara/tests/smoke.js`

- [ ] **Step 1: Test (czerwony) smoke:** żaden `LABS[i].note` nie zawiera „wiedza ogólna” ani „niesprawdzone”.
- [ ] **Step 2:** smoke. Expected: FAIL.
- [ ] **Step 3:** Dla kreatyniny, testosteronu i Anty-TPO: otwórz źródło w sesji (NHS lub agencja; bez obchodzenia
  403). Jest cytat: notatka z kluczem `SRC` i wpisem w `2026-11-08_zrodla.md`. Brak: usuń notatkę.
- [ ] **Step 4: Playwright** `sygnaly.spec.js`, `S.tab='day'`, `S.prof.cond.gut=true`, `render()`:
  - klik chipu „krew w stolcu lub czarny stolec” → widoczny `[role="alert"]` z `a[href="tel:112"]`, wysokość przycisku co najmniej 44;
  - `S.pet=null` + alarm → `.note.warn a[href="tel:112"]`;
  - brak poziomego przewijania; brak błędów konsoli.
- [ ] **Step 5:** smoke i `npx playwright test` (bez okien). Expected: smoke wszystkie PASS; Playwright „N passed”, 0 failed (czytać pełne podsumowanie, nie `tail -2`).
- [ ] **Step 6:** Commit „Wyniki badań bez notatek niesprawdzonych; testy przeglądarki sygnałów”.

### Task 9: Wysyłka

- [ ] **Step 1:** `ship.sh sygnaly-brzuch "<tytuł>" "<opis>" <pliki>`: sanitizer `--check`, smoke, PR w obu repozytoriach.
- [ ] **Step 2:** `gh pr checks` w obu. Expected: wszystkie pass.
- [ ] **Step 3:** `/rada sygnały brzucha gotowość`. Scalenie dopiero po „scal”.
