# Brief: galeria nowych zwierzaków w demo (#demo-prosty) | 20.11.2026

Cel: pokazać osobie prowadzącej do wyboru nowy styl zwierzaka, zanim zmieni się prawdziwy zwierzak w aplikacji.
Prawdziwy zwierzak (`pet.js`, `PET.svg`) zostaje bez zmian.

## Co zrobić
- Nowy plik `zwierzaki-demo.js` (CSP `script-src 'self'`), `globalThis.ZW_DEMO={html(), mount(root), svg(kind, mood)}`.
- Sekcja w `#demo-prosty` pod sekcją „Propozycje wpisu do wyboru (demo)”: nagłówek „Nowe zwierzaki do wyboru (demo)”,
  zdanie „Własne postacie w stylu popularnych uroczych zwierzaków. Dotknij nastroju, żeby zobaczyć reakcję.”
- 4 gatunki: gąska, kaczuszka, kapibara, kotek. Siatka kart po 2 w rzędzie na telefonie (min. 320 px bez poziomego przewijania).
- Przyciski nastrojów wspólne dla galerii: „Spokój”, „Radość”, „Zapis!” (wyskok), „Seria” (serduszka), „Drzemka”, „Ciekawość” (przechylenie główki).
- Dotknięcie karty gatunku: krótka reakcja (przysiad i wyskok).

## Styl (własne postacie, nie kopie znanych postaci ani memów)
- Okrągłe, miękkie kształty (chibi: duża głowa, małe ciało), duże błyszczące oczy z odblaskiem, rumieńce, miękki cień pod postacią,
  delikatne cieniowanie gradientem SVG, kontur w ciemniejszym odcieniu koloru postaci (nie czarny).
- Kolory z tokenów Miary, gdzie pasują (`--duck`, `--brass`, `--ink`); własne kolory postaci jako zmienne CSS w `:root` z wariantem ciemnym.
- Każda postać rozpoznawalna w 64 px.

## Efekty (SVG + CSS, bez bibliotek)
- Spoczynek: oddech (skala 1 ↔ 1,03, 3 s), mruganie co ok. 4 s.
- Zapis: przysiad i wyskok (squash and stretch), 0,6 s.
- Seria: 3 serduszka unoszące się i znikające.
- Drzemka: zamknięte oczy, „z z” unoszące się.
- Ciekawość: przechylenie głowy o ok. 12°, uniesiona brew lub ucho.
- Radość: oczy-łuki, lekki podskok.
- `prefers-reduced-motion: reduce`: bez ruchu, zmienia się tylko wyraz twarzy.

## Dostępność
- Każde SVG `role="img"` z `aria-label` np. „Kapibara: drzemka”. Przyciski nastrojów `aria-pressed`, ≥ 44 px.
- Zmiana nastroju ogłaszana przez `aria-live="polite"` (jedno zdanie, np. „Kotek się cieszy”).

## Testy
- Smoke: `ZW_DEMO.svg(kind, mood)` dla 4 gatunków × 6 nastrojów zwraca SVG z `role="img"` i właściwym `aria-label`;
  sekcja tylko w `#demo-prosty`; brak inline `on*=` i `<script>`.
- Playwright: sekcja widoczna; 4 karty; dotknięcie „Seria” dodaje serduszka; brak poziomego przewijania przy 320 px;
  cele ≥ 44 px; przy `reducedMotion: 'reduce'` brak animacji (`getAnimations().length === 0` na postaciach); brak błędów strony.
- Strażnik CSS w smoke (5 zaokrągleń, 8 rozmiarów pisma) dalej przechodzi.
