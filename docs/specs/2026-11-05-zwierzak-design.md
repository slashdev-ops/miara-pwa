# Zwierzak i podsumowanie postępu: projekt

Data: 05.11.2026. Status: zaakceptowany w rozmowie, do przeglądu jako dokument.

## Cel

Postać w stylu Tamagotchi (gąska albo kaczuszka) i podsumowanie postępu, które:

- motywują do codziennych wpisów przez tygodnie i miesiące,
- dobrze wyglądają w pierwszej minucie (portfolio, tryb pokazowy),
- reagują wyłącznie na działania i pomiary użytkownika, w logicznym powiązaniu z nimi.

## Ograniczenia

- Bez zewnętrznych bibliotek i zasobów (CSP `'self'`), działanie offline, dane tylko w `localStorage`.
- Zgodność danych: klucz `talerz-trening-v1` bez zmian, nowe pola opcjonalne, stare kopie działają.
- `prefers-reduced-motion`: postać statyczna, zmieniają się tylko miny.
- Motyw jasny i ciemny z istniejących zmiennych CSS.

## Decyzje

| Temat | Decyzja |
| --- | --- |
| Odbiorca | codzienne użycie i portfolio po równo |
| Postać | zwierzak domyślnie; sylwetka z pomiarów opcjonalna, domyślnie wyłączona |
| Zwierzak | gąska albo kaczuszka, wybór i imię we wprowadzeniu i w Ustawieniach |
| Spadek | klasyczne Tamagotchi: wskaźniki spadają w dni bez wpisów |
| Bezpieczniki | zwierzak nie umiera, nie choruje trwale, nie cofa się w rozwoju; nastrój nie zależy od wagi ani kalorii |
| Technika | SVG rysowane w kodzie, animacje `@keyframes` w `app.css`, logika w osobnym `pet.js` |

## Model stanu

Stan nie jest zapisywany. Wylicza go czysta funkcja `PET.state(ctx)` z istniejących danych.

Zapisywane nowe pola w `S` (opcjonalne):

```js
pet: {kind: 'gaska' | 'kaczka', name: '', since: 'RRRR-MM-DD'}  // brak = zwierzak jeszcze niewybrany
body: false                                                    // sylwetka włączona
petSeen: []                                                    // id kamieni milowych już pokazanych
```

`ctx` przekazywany z `app.js` (żeby `pet.js` nie zależał od globali): `now` (Date), `key(d)`, `dayPts(k)`,
`entries(k)` (zapisy dnia), `meas(k)` (pomiary dnia), `streak()`, `weekPts()`, `level(p)`, `stage()`
(wynik `stageInfo()`), `num(v)`.

### Wskaźniki 0-100

| Wskaźnik | Dzisiejszy wkład | Nie zależy od |
| --- | --- | --- |
| Najedzenie | zapisane posiłki: 0/1/2/3+ to 0/40/70/100 | kalorii, rodzaju jedzenia |
| Energia | sen: `min(sleep/7,1)*60`; ruch: trening dziś albo kroki ≥ 6000 to +40, kroki 3000-5999 to +20 | wagi |
| Humor | `min(dayPts/50,1)*80` + 20 przy serii ≥ 3 | wagi |

Dzień pusty: brak posiłków, treningu, pomiarów i zaznaczonych nawyków.
`przerwa` = liczba pustych pełnych dni bezpośrednio przed dziś (0-3).

Wartość wskaźnika = `max(10, min(100, wkład dzisiejszy - 35 × przerwa))`.

Skutek: po przerwie pierwszy dzień z wpisami odrabia część strat, drugi dzień (przerwa = 0) przywraca pełne wartości.

Przed 9:00 przy braku posiłków dziś Najedzenie wynosi 50 (bez kary za poranek); kara za przerwę działa nadal.

### Miny (pierwsza pasująca)

1. `celebrate`: dziś pojawił się kamień milowy, którego nie ma w `petSeen`.
2. `sleep`: 22:00-6:00.
3. `sad`: `przerwa` ≥ 2 i dziś jeszcze brak wpisów (po pierwszym wpisie zwierzak przestaje być smutny).
4. `hungry`: po 12:00 brak zapisanego posiłku dziś.
5. `tired`: Energia < 40.
6. `happy`: wszystkie wskaźniki ≥ 70.
7. `ok`: pozostałe przypadki.

Każda mina ma jedno zdanie stanu z podpowiedzią działania (np. `hungry`: „{imię} jest głodna. Zapisz posiłek.”).
Rodzaj gramatyczny: gąska i kaczuszka są rodzaju żeńskiego.

### Rozwój

Aktywny dzień: `dayPts ≥ 30`. Liczba aktywnych dni od `pet.since`:

| Etap | Aktywne dni |
| --- | --- |
| `egg` (jajo) | 0 |
| `chick` (pisklę) | 1-6 |
| `young` (młoda) | 7-29 |
| `adult` (dorosła) | 30+ |

Etap nigdy się nie cofa. Dodatek z poziomu tygodnia (`level(weekPts())`): Brąz szalik, Srebro czapka,
Złoto okulary, Platyna korona.

### Kamienie milowe

`week1` (7 dni od startu z wpisem), `streak7`, `streak14`, `streak30`, `w2` (-2% średniej wagi z 7 dni względem
startu), `w5` (-5%, etap ze `stageInfo`), `review1` (pierwszy zapisany przegląd tygodnia), `level-<nazwa>`
(pierwszy tydzień na danym poziomie). Po pokazaniu świętowania id trafia do `petSeen`.

### Reakcje na działania

`PET.react(typ)` uruchamia animację 1-2 s na widocznej postaci; bez widocznej postaci nic nie robi.

| Akcja w `app.js` | Typ | Animacja |
| --- | --- | --- |
| „Zjem”, „Powtórz wczorajsze posiłki” | `meal` | dziobanie |
| „Dodaj do dnia” (trening), zapis sesji kolana | `train` | podskok, machanie skrzydłami |
| wpisana waga (wyjście z pola) | `weigh` | kiwnięcie |
| sen ≥ 7 h (wyjście z pola) | `sleepok` | przeciąganie się |
| ochota zakończona planem | `urge` | serduszko |
| zaznaczony nawyk | `habit` | „+N” wylatujące w górę |

## Widoki

- Karta na górze „Mojego dnia”: postać ok. 120 px, imię, zdanie stanu, trzy paski. Dotknięcie otwiera ekran `pet`.
- Ekran `pet` („Mój zwierzak”): duża postać, etap, dodatek, podsumowanie postępu, odznaki, opcjonalna sylwetka, „Wróć”.
- Wprowadzenie: nowy krok „Wybierz towarzysza” (gąska/kaczuszka, imię, domyślnie „Kluska”), razem 5 kroków.
- Ustawienia: zmiana zwierzaka i imienia, przełącznik „Sylwetka z pomiarów” z informacją o wahaniach pomiarów.

### Podsumowanie postępu (ekran `pet`)

| Dziś | Ten tydzień | Od startu |
| --- | --- | --- |
| x z 3, punkty dnia | punkty, poziom, pasek do następnego poziomu | aktywne dni, seria, zmiana średniej wagi z 7 dni względem startu, talia (średnia z 4 tygodni względem pierwszych 4), etap -5% |

Odznaki: lista kamieni milowych, zdobyte w kolorze, pozostałe wyszarzone.

### Sylwetka (opcjonalna)

Neutralny kontur SVG „start” i „teraz” z proporcji talii, bioder i uda: średnie z pierwszych i ostatnich 28 dni.
Wymaga 2 pomiarów obwodów odległych o co najmniej 14 dni; wcześniej informacja „Za mało pomiarów”. Bez liczb
na rysunku.

### Tryb pokazowy

Adres z `#demo`: dane przykładowe w pamięci (bez zapisu do `localStorage`), zwierzak przechodzi co 3 s przez
wszystkie miny, etapy, dodatki i świętowanie. Pasek „Tryb pokazowy, dane przykładowe” z wyjściem.

## Pliki

| Plik | Zmiana |
| --- | --- |
| `pet.js` (nowy) | `PET.state`, `PET.svg`, `PET.card`, `PET.screen`, `PET.react`, `PET.milestones`, `PET.body`, `PET.demo` |
| `app.js` | wywołania `PET.react`, karta w `renderDay`, ekran `pet`, krok wprowadzenia, Ustawienia, `#demo`, nowe pola w `DEF` |
| `app.css` | postać, paski, `@keyframes`, `prefers-reduced-motion` |
| `index.html` | `<script src="pet.js">` przed `app.js` |
| `sw.js` | `./pet.js` na liście, `CACHE` `miara-v2` |
| `tests/smoke.js` | ładowanie `pet.js`, testy stanu, render ekranu `pet` |
| `tools/sanitize_miara.py` | bez zmian, o ile `pet.js` nie zawiera treści osobistych |

## Testy

`tests/smoke.js`:

- brak wpisów 3 dni: `sad`, wskaźniki ≥ 10; po jednym posiłku dziś: nie `sad`,
- przed 9:00 bez posiłków i bez przerwy: Najedzenie 50,
- 3 posiłki dziś: Najedzenie 100,
- 23:00: `sleep`,
- -2% średniej wagi, `w2` nie w `petSeen`: `celebrate`,
- wzrost wagi przy tych samych nawykach: Humor bez zmian,
- 30 aktywnych dni, potem 10 bez wpisów: etap `adult` zostaje,
- render `pet` i karty dla obu zwierzaków, z sylwetką i bez,
- brak `S.pet` (stare dane): karta zaprasza do wyboru, bez błędu.

Playwright (`tools/test_uzytkownika.py`): zrzuty wszystkich min w trybie `#demo`, przejście wprowadzenia z wyborem
zwierzaka, reakcja po „Zjem”.

## Wdrożenie

Gałąź `zwierzak` w `miara` i `miara-pwa`; Vercel buduje podgląd gałęzi. Scalenie do `main` po akceptacji podglądu.
