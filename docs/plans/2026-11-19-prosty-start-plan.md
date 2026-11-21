# Prosty start Implementation Plan

> Od 20.11.2026 karta nazywa się „Szybki wpis dnia”; wcześniejsza nazwa z liczbą dotknięć była przenośnią, nie liczbą (plan „Łatwość”, punkt E w briefie suwaków, runda 2).

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nowa osoba widzi w Moim dniu kartę „Szybki wpis dnia” i zwierzaka; resztę Miary odkrywa stopniowo, na propozycję zwierzaka.

**Architecture:** Flaga `S.lite` przełącza `renderDay` na prosty widok. Karta zapisuje 3 wybory w `S.meas[k]` (`stepsB`, `feel`, `redz`).
Funkcja `liteFull(k)` wpina pełną kartę w serię, punkty zwierzaka, jajko i licznik na zakładce. `S.unlock` trzyma odkryte elementy.

**Tech Stack:** vanilla JS (`app.js`), `app.css`, test dymny `tests/smoke.js` (vm, `globalThis.__T`), Playwright `tests/przegladarka`.

## Global Constraints
- TDD: najpierw test RED (pokaż wynik), potem kod. Smoke: `node tests/smoke.js` → `WYNIK: N OK, 0 BLAD`.
- Strażnik wyglądu w smoke: najwyżej 5 promieni zaokrągleń i 8 rozmiarów pisma w CSS; nowe style tylko z istniejących wartości.
- Teksty dokładnie jak w tym planie i w specyfikacji; bez słów „ograniczony”, „brakuje”, „niekompletny”, bez marek i leków.
- Zwierzak nie zależy od wartości wyborów (kroki, jedzenie kaloryczne), tylko od tego, że wpis jest.

## Review Focus
1. Osoba z zapisanymi danymi aktualizuje aplikację → `S.lite` zostaje `false`, widok bez zmian (test w Task 1).
2. Dzień z bólem zaznaczonym przyciskiem „Boli mnie głowa”, potem żeton „Dobrze” → dzień z bólem zostaje (Task 1).
3. Wpisana liczba kroków 9000 → rząd kroków pokazuje „ponad 8 tys.” jako wybrany, `stepsB` nie jest zapisywane (Task 1).
4. Częściowa karta (tylko „Inne”) → dzień nie liczy się do serii (Task 2).
5. „Nie teraz” dziś, a potem 3 dni z kartą w ciągu 7 dni → propozycja się nie pojawia przed upływem 7 dni (Task 3).

---

### Task 1: Prosty widok i karta „Szybki wpis dnia”

**Files:** Modify `app.js` (`DEF` ok. l. 1075, `load` l. 1188, `BK_NH_KEEP` l. 1051, `renderDay` l. 1867, `renderSet` sekcja „Wpisy”, obsługa kliknięć ok. l. 2079–2171), `app.css` (tylko jeśli potrzeba); Test `tests/smoke.js`.

**Interfaces — Produces:**
- `DEF.lite=false`, `DEF.unlock=[]`, `DEF.unlockAt=''`, `DEF.unlockSnooze=''`; `load()` bez zapisanego stanu zwraca `clone(DEF)` z `lite:true`.
- `stepsBand(k) -> 'lo'|'mid'|'hi'|''`: z liczby `S.meas[k].steps` (<5000 lo, 5000–8000 mid, >8000 hi), inaczej z `stepsB`.
- `liteFull(k) -> boolean`: `stepsBand(k)` niepusty, `feel` niepusty i `redz` w {0,1,2}.
- `liteCardHtml() -> string` (sekcja `id="lite"`); atrybuty żetonów: `data-lite="stepsB:lo"`, `data-lite="feel:glowa"`, `data-lite="redz:2"`.
- Kliknięcie `data-lite`: zapis do `S.meas[todayKey()]`; ponowne dotknięcie tego samego żetonu zostawia wybór (bez odznaczania).
  `feel:glowa` tworzy `S.pain[k]={aura:false,med:false,card:true}`, jeśli dnia z bólem nie ma; zmiana na inny `feel` usuwa `S.pain[k]` tylko przy `card:true`.
  Gdy jest liczba `steps`, żeton kroków nie zapisuje `stepsB` i pokazuje toast „Kroki są już wpisane liczbą”.
- `data-litefull="1"` („Pokaż całą Miarę”) ustawia `S.lite=false`. Ustawienia, sekcja Wpisy: przełącznik `id="lite"` `data-k="lite"`.
- `BK_NH_KEEP` += `'lite','unlock','unlockAt','unlockSnooze'`.

Teksty (dokładnie): tytuł „Szybki wpis dnia”; rzędy „Kroki” [„poniżej 5 tys.”, „5–8 tys.”, „ponad 8 tys.”] (wartości lo/mid/hi);
„Jak się czujesz?” [„Dobrze”, „Ból głowy”, „Brzuch”, „Inne”] (dobrze/glowa/brzuch/inne); „Jedzenie kaloryczne dziś” z podpisem
„słodycze, fast food, słone przekąski, alkohol” [„0”, „1”, „2 lub więcej”] (0/1/2); po pełnej karcie „✓ Dzień zapisany.”;
pod kartą „Wstępne badania: krótki zapis codziennie działał podobnie jak pełny.” + `srcHtml(['patel','nezami'])` (klucze dodaje Task 4;
do tego czasu `srcHtml` je pomija); przycisk „Pokaż całą Miarę”; etykieta przełącznika „Prosty widok” i podpis
„Mój dzień pokazuje szybki wpis i to, co dodasz. Dane zostają przy każdym widoku.”

Prosty widok w `renderDay`: `liteCardHtml()` + `unlockHtml()` (Task 3; do tego czasu `''`) + `petCardHtml()` + przycisk „Pokaż całą Miarę”. Nic więcej.

- [ ] **Step 1: Testy smoke (RED).** Na początku zestawu dodaj `T.S().lite=false` (dotychczasowe testy zakładają pełny widok). Nowe testy (`tryc`):
  - `prosty widok: świeży stan ma lite, zapisany stan bez pola lite go nie dostaje` — świeży `load()` → `lite===true`; `load()` z `localStorage` zwracającym `{"days":{"2026-01-01":[]}}` → `lite===false`.
  - `prosty widok: Mój dzień ma tylko kartę, zwierzaka i Pokaż całą Miarę` — `lite=true`, `renderDay()` → zawiera `id="lite"`, `data-litefull`; nie zawiera „Pierwsze kroki” ani `data-fold="wiecej"`.
  - `karta: szybki wpis zapisuje stepsB, feel, redz i daje liteFull` — klik `stepsB:mid`, `feel:dobrze`, `redz:0` → wartości w `S.meas[dziś]`, `liteFull(dziś)===true`, HTML zawiera „✓ Dzień zapisany.”, żetony mają `aria-pressed="true"`.
  - `karta: Ból głowy tworzy dzień z bólem z card, zmiana na Dobrze go usuwa; ręczny dzień z bólem zostaje`.
  - `karta: liczba kroków 9000 daje stepsBand hi bez zapisu stepsB` i żeton kroków przy liczbie nie zapisuje `stepsB`.
  - `kopia bez danych o zdrowiu: lite, unlock, unlockAt, unlockSnooze w BK_NH_KEEP; stepsB, feel, redz poza nią (w meas)`.
- [ ] **Step 2:** `node tests/smoke.js` → nowe testy BLAD (np. „liteCardHtml is not defined”).
- [ ] **Step 3:** Zaimplementuj Interfaces powyżej w `app.js`.
- [ ] **Step 4:** `node tests/smoke.js` → `0 BLAD`.

### Task 2: Pełna karta w serii, zwierzaku, jajku i liczniku

**Files:** Modify `app.js`: `dayOk` (l. 1318), `petCtx` (`dayPts` l. 1392), `eggCrack` (l. 1400), `dayLeft` (ok. l. 2007); Test `tests/smoke.js`.

**Interfaces — Consumes:** `liteFull(k)` (Task 1). **Produces:** `liteDays(fromKey?: string) -> number` = liczba różnych dni z `liteFull` w `S.meas` (opcjonalnie tylko dni `> fromKey`).
- `dayOk(k)`: dodatkowo `|| liteFull(k)` (w obu widokach).
- `petCtx().dayPts(k)`: przy `liteFull(k)` co najmniej 30 (jak `S.once && onceDone`).
- `eggCrack()`: `Math.max(dotychczasowa liczba, Math.min(4, liteDays()))`.
- `dayLeft()`: przy `S.lite` zwraca `liteFull(dziś) ? 0 : 1`.

- [ ] **Step 1: Testy smoke (RED):**
  - `pełna karta liczy się do serii i daje co najmniej 30 punktów zwierzakowi`.
  - `częściowa karta (tylko feel: inne) nie liczy się do serii`.
  - `jajko: 2 dni z pełną kartą dają eggCrack 2; przełączenie lite na false nie zmniejsza wyniku`.
  - `licznik na zakładce w prostym widoku: 1 przed kartą, 0 po pełnej karcie`.
  - `zwierzak bez zależności od wartości: stan dla redz 2 i stepsB lo równy stanowi dla redz 0 i stepsB hi` (porównaj `PET.state(petCtx())` bez pól czasu).
- [ ] **Step 2:** smoke → nowe BLAD.
- [ ] **Step 3:** Zaimplementuj.
- [ ] **Step 4:** smoke → `0 BLAD`.

### Task 3: Stopniowe odkrywanie

**Files:** Modify `app.js` (prosty widok w `renderDay`, obsługa kliknięć); Test `tests/smoke.js`.

**Interfaces — Consumes:** `liteDays(fromKey)` (Task 2). **Produces:**
- `UNLOCK=['waga','posilki','sen','cala']`; `unlockNext() -> string|null`: pierwszy element spoza `S.unlock`, gdy `S.lite`,
  `liteDays(S.unlockAt) >= 3` i (`!S.unlockSnooze` albo dziś `>= S.unlockSnooze`); inaczej `null`.
- `unlockHtml() -> string`: propozycja dla `unlockNext()` z przyciskami `data-unlock="<id>"` i `data-unlocklater="1"`, plus odkryte elementy.
- `data-unlock`: dopisuje id do `S.unlock`, `S.unlockAt=todayKey()`; dla `cala` dodatkowo `S.lite=false`.
- `data-unlocklater`: `S.unlockAt=todayKey()`, `S.unlockSnooze` = dziś + 7 dni (klucz daty).
- Odkryte elementy w prostym widoku (pod kartą): `waga` → pole wagi dnia jak w Pomiarach dnia (`id="m_w"`, ten sam zapis `meas.<dziś>.w`);
  `posilki` → wiersz „Posiłki z planu” z liczbą zapisanych dziś i przyciskiem `data-tab="meals"` „Posiłki”; `sen` → pole snu (`id="m_sleep"`, `meas.<dziś>.sleep`).

Teksty propozycji (dokładnie), przyciski „Dodaj” i „Nie teraz” (dla `cala`: „Pokaż” i „Nie teraz”):
- waga: „Dodać wagę? Jedno pole rano. Bez wagi kalorie są liczone w przybliżeniu.”
- posilki: „Dodać posiłki z planu? „Zjem” przy daniu zapisuje posiłek jednym dotknięciem.”
- sen: „Dodać sen? Jedno pole: ile godzin spałaś lub spałeś.”
- cala: „Chcesz zobaczyć całą Miarę? Wszystko, co dodasz, zostaje.”

- [ ] **Step 1: Testy smoke (RED):**
  - `odkrywanie: brak propozycji przed 3 dniami z pełną kartą; po 3 dniach propozycja waga`.
  - `odkrywanie: Dodaj dopisuje waga, pokazuje pole m_w; kolejna propozycja (posilki) dopiero po 3 nowych dniach`.
  - `odkrywanie: Nie teraz chowa propozycję na 7 dni mimo 3 nowych dni z kartą; po 7 dniach wraca`.
  - `odkrywanie: Pokaż przy cala ustawia lite false; unlock zostaje po ponownym włączeniu lite`.
  - `odkrywanie: poza prostym widokiem unlockNext zwraca null`.
- [ ] **Step 2:** smoke → nowe BLAD.
- [ ] **Step 3:** Zaimplementuj.
- [ ] **Step 4:** smoke → `0 BLAD`.

### Task 4: Ekran startowy, źródła, mapa, scenariusz i test w przeglądarce

**Files:** Modify `app.js` (`renderIntro`, `SRC`, `SCEN`), mapa powiązań (poza repozytorium); Create `tests/przegladarka/prosty.spec.js`.

- `renderIntro` przy `S.lite`: nad formularzem główny przycisk `class="btn"` `data-introdone="1"` „Zacznij od szybkiego wpisu”; dolny „Pomiń” znika
  (przy `!S.lite` bez zmian).
- `SRC`: `patel` (Patel ML i in., JMIR Form Res 2022, https://pubmed.ncbi.nlm.nih.gov/36512404/), `nezami` (Nezami BT i in., Obesity 2022,
  https://pubmed.ncbi.nlm.nih.gov/35146942/), `harvey` (Harvey J i in., Obesity 2019, https://pubmed.ncbi.nlm.nih.gov/30801989/),
  `burke` (Burke LE i in., J Am Diet Assoc 2011, https://pubmed.ncbi.nlm.nih.gov/21185970/), w formacie istniejących wpisów.
- `SCEN.prosty`: `{t:'Prosty start: szybki wpis',tab:'day',chk:'Mój dzień: tylko karta Szybki wpis dnia, zwierzak i Pokaż całą Miarę; 3 dni z kartą za sobą, więc zwierzak proponuje wagę.'}`;
  `f` ustawia `lite:true`, `unlock:[]`, `unlockAt:''`, pełną kartę z wartościami zmyślonymi w 3 poprzednich dniach i pusty dzień dziś.
- Mapa powiązań: wiersze 49 (Patel 2022), 50 (Nezami 2022), 51 (Harvey 2019 + Burke 2011) w formacie wierszy 45–48; „Sprawdzone: tak (19.11.2026)”;
  miejsce w aplikacji: karta „Szybki wpis dnia”, test smoke z Task 1.

- [ ] **Step 1: Testy (RED):** smoke `ekran startowy w prostym widoku: przycisk Zacznij od szybkiego wpisu, bez Pomiń`; `źródła patel, nezami, harvey, burke z PMID`;
  `scenariusz prosty: propozycja waga widoczna`. Playwright `prosty.spec.js` na `#demo-prosty` (chromium i webkit, 320 px, jasny i ciemny):
  karta bez poziomego przewijania; każdy żeton ≥ 44 px wysokości; żaden tekst żetonu nie łamie się na 2 linie; szybki wpis → „✓ Dzień zapisany.”
  i `aria-pressed="true"`; propozycja „Dodać wagę?” widoczna.
- [ ] **Step 2:** smoke i `npx playwright test prosty.spec.js` → BLAD/FAIL.
- [ ] **Step 3:** Zaimplementuj; dopisz wiersze mapy powiązań.
- [ ] **Step 4:** smoke `0 BLAD`; cały Playwright zielony.

### Task 5: Wersja publiczna i PR-y (kontroler)
- [ ] PR w obu repozytoriach (opis bez stopki Claude); zrzuty 320 px jasny/ciemny; scalenie dopiero po słowie „scal” i zielonym CI.
