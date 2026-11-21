# Nowe zwierzaki w aplikacji i reakcje na Zdrowie | projekt i plan | 20.11.2026

> For agentic workers: REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox syntax.

**Goal:** prawdziwy zwierzak Miary dostaje nowe postacie z demo (gąska, kaczuszka, kapibara, kotek) i reaguje też na wpisy w Zdrowiu,
zgodnie z radą (bez nagradzania bólu, bez oceny wyników badań, z trybem dyskretnym).

**Architecture:** rysunek postaci z `zwierzaki-demo.js` przechodzi do `pet.js` jako nowe wnętrze `PET.svg(kind, stage, mood, acc, big, crack)`
(ta sama sygnatura; jajko, etapy, dodatki, pogoda i ścieżka zostają). Galeria demo znika. Reakcje Zdrowia to nowe typy `PET.react(...)`
wywoływane z istniejących obsług zapisu w `app.js`.

**Spec (decyzje osoby prowadzącej 20.11.2026):** „tak, zaprojektuj i zbuduj razem z przeniesieniem nowych zwierzaków do aplikacji, zgodnie z radą”
(tabela reakcji z odpowiedzi z 20.11: Zanotowane / Odpocznij dziś / Seria / brak reakcji przy wyniku poza zakresem; tryb dyskretny).

## Decyzje wykonawcy (do sprawdzenia)
- Gatunki w wyborze: gąska, kaczuszka, kapibara, kotek. Zapis `S.pet.kind`: `gaska`, `kaczka`, `kapibara`, `kotek`; nieznany rodzaj z kopii → `gaska`.
- Etapy bez zmian (jajo → pisklę → młody → dorosły, skala 0,7 / 0,85 / 1). Jajo bez zmian.
- Nastroje aplikacji na wyraz postaci: ok → spokój; happy → radość; celebrate → seria (serduszka) + dotychczasowe konfetti; sleep → drzemka;
  sad („tęskni”) → spokój z opuszczonymi powiekami (bez łez); tired → drzemka bez „z z”; hungry → ciekawość + dotychczasowy dymek; alert → ciekawość.
- Dodatki za poziomy (szalik, czapka, okulary, korona) dopasowane do głowy każdego gatunku.
- Formy rodzajowe: kotek rodzaj męski („Kotek: szczęśliwy”, „Młody”, „Dorosły”), pozostałe żeński; dotyczy `MOOD_PL`, `STAGE_PL`, linii nastroju i odmian w tekstach zwierzaka.
- Poprawki z rady przy galerii: kapibara z dłuższym pyszczkiem i małymi uszkami wysoko; przy wyborze gatunku zawsze podpis;
  przy `prefers-reduced-motion: reduce` reakcja pokazuje krótki napis (np. „Zanotowane”) zamiast ruchu.
- Galeria `zwierzaki-demo.js` usunięta (postacie są już w aplikacji); `wpisy-demo.js` zostaje.

## Reakcje na Zdrowie
| Wpis | Typ `PET.react` | Na postaci |
|---|---|---|
| skład ciała (`meas.*.ffm`, `fat`), obwody (`waist`, `hip`, `thigh` i pozostałe pola obwodów), `frame.wrist/ankle`, `vo2`, `hrRest`, `hrMax`, zapis wyniku badania (`data-labsave`) | `note` | wyskok „Zapis!” i napis „Zanotowane” |
| dzień z bólem głowy (`data-pain`), brzuch z bólem lub wzdęciem ≥ 5 (`gut`), ból nóg ≥ 5 (`data-leg`) | `rest` | spokój, przytulenie (skulenie), napis „Odpocznij dziś”; bez punktów i serduszek |
| pomiar obwodów lub składu ciała wpisany, gdy był zalecany (`measDue()` prawdziwe przed zapisem) | `series` | serduszka |
| wynik badania poza zakresem | brak reakcji | (karta w Zdrowiu jak dotąd) |
- Tryb dyskretny (`S.discreet`): brak reakcji `rest` na ból głowy i brak jakiejkolwiek reakcji na cykl (`data-cyc`).
- Reakcja nie zmienia punktów, serii ani nastroju (tylko animacja i napis).

## Global Constraints
- TDD z dowodem RED; smoke `WYNIK: N OK, 0 BLAD`; pełny Playwright raz na koniec zadania, wszystkie linie podsumowania.
- Strażnik CSS: najwyżej 5 zaokrągleń i 8 rozmiarów pisma; pigułka tylko dla żetonów; tokeny z wariantem ciemnym.

## Review Focus
1. Kopia danych z `kind:'kaczka'` sprzed zmiany → nowa kaczuszka, bez błędu (Task 1).
2. Nieznany `kind` z importu → gąska, `aria-label` poprawny (Task 1).
3. Kotek: żadnego żeńskiego „szczęśliwa/Młoda/Dorosła” w etykietach i tekstach (Task 1).
4. Tryb dyskretny + „Boli mnie głowa” → brak napisu „Odpocznij dziś” na karcie zwierzaka (Task 2).
5. Reakcja `rest` nie dodaje punktów ani nie zmienia `dayPts` (Task 2).

---
### Task 1: Nowe postacie w `pet.js`
**Files:** `pet.js` (svg, KIND_PL, MOOD_PL, STAGE_PL, demo FRAMES, linie), `app.js` (`petPickHtml`: 4 gatunki z podpisem; walidacja `kind`), `app.css` (style postaci z demo, reakcje), usunąć `zwierzaki-demo.js` (+ `index.html`, `sw.js` ASSETS, smoke i `tests/przegladarka/zwierzaki-demo.spec.js`), testy.
**Produces:** `PET.svg(kind, stage, mood, acc, big, crack) -> string` (role=img, aria-label „<Gatunek>: <nastrój w odpowiednim rodzaju>”), `PET.kinds() -> ['gaska','kaczka','kapibara','kotek']`, `PET.form(kind, key) -> string` (formy rodzajowe).
- [ ] Testy smoke (RED): 4 gatunki × 8 nastrojów × 4 etapy dają SVG z role=img; `kind:'kaczka'` i nieznany → poprawne; kotek bez form żeńskich; dodatki obecne dla każdego gatunku; wybór pokazuje 4 gatunki z podpisami; brak `zwierzaki-demo.js` w `index.html`/`sw.js`.
- [ ] Playwright (RED): karta zwierzaka i ekran zwierzaka dla każdego gatunku bez poziomego przewijania przy 320 px, jasny i ciemny; przy reduced motion brak animacji postaci.
- [ ] Implementacja; smoke 0 BLAD; pełny Playwright zielony.

### Task 2: Reakcje na Zdrowie
**Files:** `app.js` (obsługi zapisu z tabeli), `pet.js` (`flush`: typy `note`, `rest`, `series`; napisy; reduced motion), `app.css`, testy.
**Consumes:** `PET.react(type, pts)`, `PET.svg` z Task 1. **Produces:** `healthReact(key, value, prev) -> 'note'|'rest'|'series'|null` (czysta funkcja w app.js, testowalna).
- [ ] Testy smoke (RED): `healthReact` dla każdego wiersza tabeli; wynik badania poza zakresem → null; tryb dyskretny: ból głowy → null, cykl → null; `rest` nie zmienia `dayPts`; `measDue` przed zapisem → `series`.
- [ ] Playwright (RED): wpis FFM w Zdrowiu → po powrocie do Mojego dnia na karcie zwierzaka napis „Zanotowane”; „Boli mnie głowa” → „Odpocznij dziś”; w trybie dyskretnym brak tego napisu.
- [ ] Implementacja; smoke 0 BLAD; pełny Playwright zielony.

### Task 3: Wersja publiczna i PR-y (kontroler)
- [ ] PR w obu repozytoriach; scalenie po zielonym CI.
