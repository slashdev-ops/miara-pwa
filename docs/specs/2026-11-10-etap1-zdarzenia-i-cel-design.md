# Etap 1: „Co się wydarzyło” i jeden cel aktywny z mapą wpływów

Data: 10.11.2026. Kierunek: `rada/2026-11-10_miary-cele-i-opieka.md` (lokalnie). Decyzje użytkownika z 10.11.2026:
- jeden cel aktywny naraz;
- ścieżki schorzeń kolejno: Hashimoto, lipodemia, migrena z aurą, migrena, insulinooporność, plus ścieżka ich łączenia
  (etap 3);
- nowe miary, które mają sens (etap 2);
- start od etapu 1.

## Cel etapu

Osoba otwiera Mój dzień i widzi:
1. jeden swój cel z postępem w tym tygodniu i listą „na co jeszcze wpływa ten cel” ze źródłami;
2. „Co się wydarzyło” w ostatnich 28 dniach: zmiany w jej danych i to, co działo się w tym samym czasie, bez obwiniania.

Etap 1 nie dodaje nowych miar. Wszystko liczy się z danych, które Miara już zapisuje.

## Zasady (z mapy powiązań i rady)

- Wpływ i działanie pokazujemy tylko z wiersza `mapa_powiazan.md` ze statusem „Sprawdzone: tak”, z siłą dowodów i linkiem.
  Wiersze 8 i 16 (częściowo) oraz 14 (wycofane wytyczne) nie są używane.
- Zdarzenie podaje, z ilu danych wynika. Za mało danych oznacza brak zdarzenia, a nie zgadywanie.
- Działania z tego samego okresu opisujemy jako „w tym czasie”, nigdy „z powodu” (zasada 1 mapy).
- Sygnał „do lekarza” stoi nad celem i nie da się go ukryć. Nie może być celem.
- Bez porad o lekach i dawkach (zasada 3 mapy).

## Cele (katalog etapu 1)

| Id | Cel | Miara postępu w tygodniu | Kiedy Miara go proponuje | Wiersze mapy |
| --- | --- | --- | --- | --- |
| `sen` | Mniej krótkich nocy | noce z co najmniej 6 h snu z 7 | co najmniej 2 noce krótsze niż 6 h w ostatnich 7 dniach | 4; przy migrenie też 5 |
| `bialko` | Białko w każdym dniu | dni z białkiem co najmniej celu dnia z Miary | mniej niż 4 dni z celem białka w 7 dniach z posiłkami | 13 |
| `ruch` | Więcej kroków | średnia kroków z 7 dni wobec progu z wiersza 12 | średnia poniżej progu, co najmniej 3 dni z krokami | 12; przy migrenie też 11 |
| `zapisy` | Regularne zapisy | dni z jakimkolwiek wpisem z 7 | mniej niż 4 dni z wpisem | 9 (siła: słabe dowody, podana wprost) |
| `bol` | Mniej dni z bólem głowy | dni z bólem w ostatnich 28 dniach | profil z migreną i co najmniej 1 dzień z bólem | 5, 11, 15 |
| `waga` | Waga docelowa | średnia z 7 dni wobec poprzedniego tygodnia i celu | domyślnie, gdy żaden inny cel nie jest proponowany | 7 |

Kolejność propozycji:
1. bezpieczeństwo: tylko jako sygnał, nie jako cel;
2. `bol` przy migrenie;
3. `sen`;
4. `bialko`;
5. `ruch`;
6. `zapisy`;
7. `waga`.

Miara proponuje pierwszy pasujący cel, a osoba wybiera dowolny z listy. Zmiana celu zaczyna nowy tydzień postępu i nie
kasuje danych.

Próg kroków wynika z wiersza 12 (Paluch i in., 2022: wypłaszczenie korzyści przy ok. 6-10 tys. zależnie od wieku).
Dokładne progi dla grup wieku trzeba zacytować z artykułu przed kodem (działanie T1).

## Sygnały „najpierw lekarz” (nad celem)

| Sygnał | Warunek | Wiersz |
| --- | --- | --- |
| Migrena z aurą i tabletki z estrogenem | profil `aura` i antykoncepcja z estrogenem | 1 |
| Dużo dni z lekiem przeciwbólowym | co najmniej 10 dni z lekiem w 30 dniach | 3 |

Te warunki już działają w kartach `aura` i liście na wizytę. Etap 1 tylko przenosi je nad cel.

## „Co się wydarzyło” (zdarzenia z ostatnich 28 dni)

| Id | Zdarzenie | Warunek | Potrzebne dane |
| --- | --- | --- | --- |
| `waga_zmiana` | Średnia wagi zmieniła się | średnia z 7 dni wobec średniej sprzed 3 tygodni, różnica co najmniej 0,5 kg | co najmniej 3 ważenia w każdym tygodniu |
| `waga_stoi` | Waga stoi | warunek karty `waga_stoi` (bez zmian w logice) | jak w karcie |
| `krotki_sen` | Krótkie noce | 2 noce z rzędu poniżej 6 h | 2 wpisy snu |
| `bol_dni` | Więcej dni z bólem | co najmniej 3 dni z bólem w 7 dniach | wpisy bólu |
| `kroki_zmiana` | Kroki wzrosły albo spadły | średnia z 7 dni wobec poprzednich 7, różnica co najmniej 1000 | co najmniej 4 dni z krokami w każdym tygodniu |
| `krok_zaliczony` | Krok tygodnia zaliczony | `kProg` wykonany | Krok po kroku aktywny |
| `cel_tydzien` | Tydzień celu | koniec tygodnia aktywnego celu: wynik i jedno zdanie | aktywny cel |
| `powrot` | Powrót po przerwie | pierwszy wpis po co najmniej 3 dniach bez wpisów | wpisy |

Każde zdarzenie ma:
- datę, tytuł i jedno zdanie;
- „z czego”: liczbę danych;
- „w tym czasie”: treningi, zapisane posiłki i aktywny krok tygodnia z tego samego okresu;
- najwyżej jedno działanie, tylko gdy jest wiersz mapy.

`powrot` mówi „Dobrze, że jesteś”, bez liczenia przerwy (psycholog).

Na Moim dniu widać 3 najnowsze zdarzenia, a pozostałe po rozwinięciu „Wszystkie z 28 dni”.

## Mapa wpływów przy celu

Lista tekstowa, a nie sam wykres (WCAG 1.1.1 i 1.4.1). Format pozycji: „Sen → apetyt: krótki sen wiązał się z większym
spożyciem (ok. +385 kcal na dobę). Siła: umiarkowane. Źródło: link”. Wartości i siła pochodzą z cytatów w
`rada/2026-11-08_zrodla.md`. Pozycje zależne od profilu (np. migrena) pokazują się tylko przy tym profilu. Plan
„jeśli…, to…” (wiersz 10) jest przy każdym celu jako sposób realizacji.

## Architektura

- Nowy plik `zdarzenia.js` z czystymi funkcjami bez DOM:
  - `ZD.events(S, dzis)` zwraca listę zdarzeń;
  - `ZD.goals` to katalog celów;
  - `ZD.suggest(S, dzis)` zwraca id proponowanego celu;
  - `ZD.progress(S, cel, dzis)` zwraca postęp;
  - `ZD.impact(cel, prof)` zwraca listę wpływów.

  Ten sam wzór co `pet.js`. Plik trafia do `index.html`, `sw.js` (ASSETS) i testów.
- W stanie aplikacji nowe pole `cel: {id, since}`, domyślnie `null` (w `DEF`). Kopia bez danych o zdrowiu go pomija,
  a strażnik w testach wymusza to przypisanie.
- `app.js` tylko renderuje: karta celu i sekcja „Co się wydarzyło” na Moim dniu pod Stanem dziś, wybór celu w karcie.

## Testy

- `tests/smoke.js`:
  - każde zdarzenie na granicy warunku (tuż poniżej i tuż powyżej progu);
  - za mało danych daje brak zdarzenia;
  - granica 28 dni i zmiana tygodnia;
  - kolejność propozycji celu;
  - wpływy tylko z wierszy sprawdzonych;
  - zmiana celu nie kasuje danych;
  - kopia bez danych o zdrowiu bez `cel`.
- `tests/przegladarka`:
  - sekcja i karta celu w obu silnikach, trybach i przy 320 px;
  - kontrast;
  - wybór celu dotykiem;
  - lista wpływów czytelna jako tekst.

## Działania przed kodem

| Nr | Działanie | Kto |
| --- | --- | --- |
| T1 | Zacytować progi kroków dla grup wieku z Paluch i in. 2022 (wiersz 12) do `2026-11-08_zrodla.md` | Claude |
| T2 | Sprawdzić w kodzie warunki kart `waga_stoi`, `aura` i licznika dni z lekiem, żeby zdarzenia używały tych samych funkcji | Claude |

## Poza etapem 1

- Etap 2: jedno wejście „Dodaj” i nowe miary. Kandydaci do oceny przez radę ze źródłami: ciśnienie, nastrój i energia
  w skali, ból w skali 0-10, glukoza przy insulinooporności, tętno spoczynkowe.
- Etap 3: ścieżki schorzeń w kolejności Hashimoto, lipodemia, migrena z aurą, migrena, insulinooporność, a na końcu
  ścieżka łączenia. Przy kilku schorzeniach obowiązuje kolejność:
  1. bezpieczeństwo i sprzeczności (np. aura i estrogen);
  2. wspólne podstawy;
  3. kroki dla danego schorzenia.

  Sformułowanie: „wsparcie stylu życia przy opiece lekarza”.

## Głos opiekuna rozwoju (nowy członek rady)

- **Proponuje:** na koniec tygodnia aktywnego celu krótki „list od Miary” (zdarzenie `cel_tydzien`). Tłumaczy prostym
  językiem, co się działo i co to znaczy, jak nauczyciel, bez oceniania.
- **Technika:** zdarzenia liczone w telefonie przy otwarciu (bez serwera i powiadomień). Później ewentualnie
  przypomnienia na żądanie (Web Push na iOS działa tylko dla aplikacji z ekranu głównego; do sprawdzenia ze źródłem
  przed etapem 2).
- **Medycyna chińska i naturalna:** w etapie 1 bez treści. W etapie 3 każde takie podejście przy schorzeniu dostaje
  ocenę „ma dowody / niejasne / przegrywa z leczeniem konwencjonalnym / może szkodzić” ze źródłem; nic nie zastępuje
  leczenia.
