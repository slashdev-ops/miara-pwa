# Sygnały brzucha i żołądka: zwierzak jako pomocnik wizyty

Data: 13.11.2026. Decyzje użytkownika z 13.11.2026: podejście A (osobny moduł reguł), wariant 2 (zwierzak przekazuje
także alarm, w poważnym nastroju), rola „pomocnik wizyty”, próg reguły Miary 8 dni z 28 przy co najmniej 14 dniach z
wpisem. Prośba użytkownika: wskazówki przy wzdęciach, *H. pylori*, zapaleniu żołądka i „dysbiozie”, gdy dane mocno
na coś wskazują; bez wskazywania konkretnej choroby, gdy można się pomylić; „niesprawdzone gorsze niż błędne”.

## Cel nadrzędny

Prośba użytkownika z 13.11.2026: zwierzak ma być pomocnikiem w wychodzeniu z chorób osoby i chorób towarzyszących.
Rola: pomocnik w drodze do poprawy przy opiece lekarza. Zwierzak zauważa sygnały w danych, przygotowuje wizytę,
domyka ustalenia po wizycie i podpowiada, co osoba może zrobić sama. Nigdy nie obiecuje wyleczenia ani remisji.
Ta specyfikacja obejmuje brzuch i żołądek. Ten sam moduł i układ dymku obsłużą w kolejnych etapach pozostałe
schorzenia z profilu (sekcja 9).

## Cel i miara sukcesu

- Osoba z objawami z brzucha wie, co może zrobić sama, o jakie badanie zapytać lekarza i czego nie robić przed
  badaniem, a przy objawie alarmowym od razu widzi 112.
- Na wizytę przychodzi z listą: dane (liczby, daty), pytania, informacje do zgłoszenia.
- Po wizycie zapisuje, co ustalił lekarz, a zwierzak przestaje powtarzać załatwioną wskazówkę.
- Sukces sprawdzają testy: każda reguła włącza się przy swoim warunku i nie włącza się tuż pod progiem.

## Zasady

- Każdy tekst reguły pochodzi ze źródła otwartego 13.11.2026 (sekcja 8) i ma wiersz w `rada/mapa_powiazan.md` ze
  statusem „Sprawdzone: tak”. Treść bez źródła nie trafia do aplikacji.
- Zwierzak nie stawia diagnozy. Nazwa choroby pojawia się tylko jako badanie do sprawdzenia („zapytaj o badanie w
  kierunku celiakii”) albo jako stan wpisany przez osobę po wizycie („*H. pylori* potwierdzone przez lekarza”).
- Leki tylko jako „powiedz lekarzowi” albo „ustal z lekarzem”. Nigdy „odstaw”.
- Progi, których nie podaje wytyczna, mają w treści znacznik „reguła Miary”.
- Sformułowanie: „wsparcie stylu życia przy opiece lekarza”.
- „Dysbioza”: brak reguły i brak tego słowa w dymku (brak zwalidowanego testu klinicznego, sekcja 8).

## 1. Moduł `sygnaly.js`

- Nowy plik obok `zdarzenia.js`, ładowany w `index.html` po `zdarzenia.js`, dopisany do listy plików w `sw.js`.
  Czyste funkcje bez DOM, eksport `SYG`, testy w `tests/smoke.js` (vm sandbox, jak `ZD`).
- `SYG.ocen(S, k)`: zwraca listę aktywnych sygnałów dla dnia `k`, posortowaną po poziomie (najpierw najważniejszy),
  przy równym poziomie w kolejności tabeli z sekcji 3.
- Kształt sygnału zgodny z `ZD.signals` (`zdarzenia.js:172`): `{ id, t, x, row }` plus `lvl` (`'112' | 'wkrotce' |
  'badanie' | 'sam'`), `d` (linia „Dane” z liczbami), `co` (lista kroków), `src` (klucze `SRC`), `rm` (true dla reguły Miary).
- Sygnały migreny zostają w `ZD.signals` bez zmian (sekcja 9: przeniesienie później).
- Zwraca pustą listę, gdy profil nie ma `cond.gut`. Tryb dyskretny (`S.discreet`) ogranicza tylko dymek w „Mój
  dzień” do alarmu z dzisiejszego wpisu (sekcja 4); karta w Zdrowiu i lista na wizytę pokazują wszystkie sygnały,
  bo ustawienie przenosi karty do Zdrowia, a nie je ukrywa (decyzja z 13.11.2026).

## 2. Dane

- Dziennik `S.gut[k]` (istniejące pola `b`, `f`, `n`, `s` bez zmian), nowe pola:
  - `u`: tablica objawów z żołądka: `'piecze'` (pieczenie lub ból w nadbrzuszu), `'pelnosc'` (pełność po jedzeniu),
    `'zgaga'`;
  - `a`: tablica objawów alarmowych: `'krew'` (krew w stolcu lub czarny, lepki stolec), `'wymkrew'` (wymioty krwią
    lub jak fusy od kawy), `'bol'` (nagły silny ból brzucha lub w klatce), `'polyk'` (trudność z połykaniem),
    `'wymioty'` (częste wymioty).
- Profil (`S.prof`), widoczne tylko przy `cond.gut`, przełączniki tak/nie: `g45` (45 lat lub więcej), `nlpz`
  (regularnie ibuprofen lub aspiryna), `rodzRak` (rak żołądka u rodzica, rodzeństwa lub dziecka).
- Po wizycie (`S.wizyta`): `{ hp: 'brak' | 'zlecone' | 'potw' | 'leczone' | 'wykl' | 'nic', d: 'RRRR-MM-DD' }`
  (stan *H. pylori*, data zapisu). Domyślnie `'brak'`.
- Wyciszenie: `S.sygSeen[id] = 'RRRR-MM-DD'` (dzień „Przeczytane”), sygnał ukryty przez 14 dni.
- Lista na wizytę: `S.wizList` (tablica `id` sygnałów).
- Wszystkie nowe pola trafiają do kopii (eksport i import); import starej kopii bez tych pól działa (wartości
  domyślne). Nieznane wartości z importu są odrzucane (tylko wartości z list powyżej).
- Wiek osoby nie jest zapisywany, tylko przełącznik `g45`.
- Formularz wyniku badania: opcjonalne pole „Dolna granica normy z wydruku (opcjonalnie)” zapisywane jako `lo`
  (przecinek zamieniany na kropkę, puste pole pomijane). Bez niego reguła `zelazo` nie ma danych (decyzja z 13.11.2026).

## 3. Reguły

„Objawy z żołądka” = dzień z niepustym `u`. „Próg” (reguła Miary) = co najmniej 8 takich dni w 28 dniach kończących
się dniem `k` przy co najmniej 14 dniach z wpisem w dzienniku brzucha. Poniżej 14 dni z wpisem reguły progowe się
nie włączają, a dymek prosi o dalsze zapisywanie (sygnał `zapisuj`, poziom `sam`, reguła Miary, wiersz 28: przy co
najmniej 1 dniu z `u`, wzdęciem 5+ albo `luzny`; tekst „Zapisuj dalej: po 14 dniach z wpisem powiem więcej.”).

| id | Poziom | Warunek | Tekst i kroki | Źródło |
| --- | --- | --- | --- | --- |
| `alarm` | 112 | dziś `a` zawiera `krew`, `wymkrew` albo `bol` | „To pilne: zadzwoń 112 albo jedź na SOR.” Przycisk `tel:112`. | NHS stomach ulcer, NHS gastritis |
| `pilne` | wkrotce | w 7 dniach `a` zawiera `polyk` albo `wymioty` | „Umów wizytę u lekarza w najbliższych dniach.” | NHS indigestion |
| `gastro45` | wkrotce | objawy z żołądka w 7 dniach i `g45` | „Zapytaj lekarza o skierowanie na gastroskopię.” | PTG-E 2023 st. 6 |
| `hp_test` | badanie | próg objawów z żołądka, bez `g45`, `hp` = `brak` | „Zapytaj lekarza o test na *H. pylori*: antygen w kale (laboratoryjny) albo test oddechowy, nie z krwi. Ustal z lekarzem przerwę przed testem: 14 dni bez leków na kwas (IPP), 4 tygodnie bez antybiotyków.” | PTG-E 2023 st. 4, 5, 16, 17 |
| `hp_nlpz` | badanie | `nlpz` i objawy z żołądka w 28 dniach, `hp` = `brak` | „Powiedz lekarzowi o ibuprofenie lub aspirynie i zapytaj o test na *H. pylori*.” | PTG-E 2023 st. 10; NHS indigestion |
| `hp_rodz` | badanie | `rodzRak`, `hp` = `brak` | „Zapytaj lekarza o test na *H. pylori*.” | PTG-E 2023 st. 9 |
| `celiakia` | badanie | wzdęcie 5+ albo `f` = `luzny` w co najmniej 8 dniach z 28 (przy 14 dniach z wpisem), albo `cond.hashi` i co najmniej 1 taki dzień | „Zapisujesz to często: zapytaj lekarza o badanie w kierunku celiakii. Jedz gluten, dopóki diagnoza nie jest potwierdzona.” | NHS coeliac diagnosis |
| `zelazo` | badanie | ostatni wynik `ferr` poniżej `lo` z wydruku i co najmniej 1 dzień z objawem w 28 dniach | „Zapytaj lekarza, czy szukać przyczyny niedoboru żelaza (m.in. *H. pylori* i celiakia).” | PTG-E 2023 st. 11; NHS coeliac diagnosis |
| `hp_kontrola` | badanie | `hp` = `leczone` | „Zapytaj lekarza o test, czy leczenie zadziałało.” | PTG-E 2023 st. 14 |
| `sam_zoladek` | sam | objawy z żołądka w 7 dniach | „Śpij z uniesioną głową i barkami. Nie bierz ibuprofenu ani aspiryny bez zalecenia.” | NHS indigestion |

- `hp` = `zlecone`, `potw`, `wykl` albo `nic` wycisza tylko reguły `hp_*` (poza `hp_kontrola` przy `leczone`).
  Nie wpływa na `alarm`, `pilne`, `gastro45`, `celiakia`, `zelazo`.
- `zelazo` bez wyniku z `lo` się nie włącza (brak własnego progu Miary).
- Tytuły `t` i kroki `co` to tekst interfejsu bez twierdzeń klinicznych (np. „Nie czekaj na wizytę planową.”); każda
  treść kliniczna pochodzi z kolumny „Tekst i kroki” powyżej. Etykieta pewności: „z wytycznej” albo „reguła Miary”.
- Karta informacyjna w Zdrowiu (bez reguły): „Testy mikrobiomu kupowane samodzielnie nie mają udowodnionej wartości
  klinicznej.” Źródło: Porcari 2025.

## 4. Zwierzak: dymek i alarm

- Dymek pokazuje jeden sygnał, pierwszy z `SYG.ocen`, na górze „Mój dzień” i nad dziennikiem „Brzuch dziś”.
- Układ dymku (jak protokół rady): **Dane** (liczby z wpisów), **Pewność** („z wytycznej” albo „reguła Miary”),
  **Działanie** (`co`), link „Źródło i szczegóły” do karty w Zdrowiu.
- Przyciski spokojnych sygnałów: „Dodaj do listy na wizytę”, „Przeczytane” (wyciszenie na 14 dni). Cel dotyku co
  najmniej 44 px.
- Alarm (`lvl` `112`):
  - nowy nastrój zwierzaka `alert` w `pet.js`: spokojna twarz, bez animacji, opis „uwaga” w `MOOD_PL`;
  - dymek z czerwoną ramką, `role="alert"`, przycisk „Zadzwoń 112” (`tel:112`) i tekst „albo jedź na SOR”;
  - pokazuje się od razu po zaznaczeniu chipu alarmowego, także w trybie dyskretnym, jeśli wpis zrobiono dziś;
  - bez „Przeczytane”; znika następnego dnia bez nowego wpisu alarmowego;
  - gdy zwierzak jest wyłączony (`S.pet` puste), ten sam komunikat jako zwykła karta `note warn` bez maskotki.
- Wszystkie teksty escapowane (`esc`), bez `innerHTML` z danych osoby.

## 5. Wizyta

- „Lista na wizytę” rozszerza istniejące podsumowanie dla lekarza (`app.js:1342`), bez nowego ekranu: dane brzucha
  (już są), daty dni z objawem alarmowym w 28 dniach, pytania z sygnałów z `S.wizList` i aktywnych sygnałów
  `wkrotce` i `badanie`, informacje do zgłoszenia (`nlpz`, `rodzRak`, ferrytyna poniżej zakresu).
- Lista trafia tylko do schowka albo na ekran. Nigdy do adresu URL ani na serwer.
- „Co ustalił lekarz?”: chipy w Zdrowiu w karcie brzucha: „zlecił badanie”, „*H. pylori* potwierdzone”, „po leczeniu”,
  „wykluczone”, „nic nie zlecił”. Zapis do `S.wizyta`.

## 6. Porządki

- Notatki wyników „wiedza ogólna, niesprawdzone” w `LABS` (kreatynina, testosteron, Anty-TPO): źródło otwarte w
  sesji albo usunięcie notatki.
- `rada/mapa_powiazan.md`: wiersze 31-41 (po jednym na regułę z sekcji 3 i kartę mikrobiomu), przed kodem.
- `rada/2026-11-08_zrodla.md`: cytaty z sekcji 8.

## 7. Testy

- Smoke (TDD, najpierw test czerwony):
  - każda reguła z sekcji 3: włącza się przy warunku, nie włącza się tuż pod progiem (7 dni z 28; 13 dni z wpisem);
  - pusta lista bez `cond.gut` i w trybie dyskretnym; wyjątek dla dzisiejszego alarmu;
  - kolejność: `alarm` pierwszy przy kilku aktywnych;
  - `hp` = `wykl` wycisza `hp_*`, nie `celiakia`;
  - `S.sygSeen` ukrywa sygnał na 14 dni, nie ukrywa `alarm`;
  - import kopii bez nowych pól i z nieznanymi wartościami;
  - lista na wizytę zawiera pytania i daty, nie zawiera słowa „dysbioza”;
  - żaden tekst reguły nie zawiera „odstaw” ani „masz”.
- Playwright (6 projektów): zaznaczenie chipu „krew w stolcu” pokazuje dymek `role="alert"` z `tel:112`; cele dotyku
  44 px; brak poziomego przewijania przy 320 px; tryb ciemny; zwierzak wyłączony pokazuje kartę zastępczą.
- Strażnik projektu: nadal co najwyżej 8 rozmiarów pisma.

## 8. Źródła (otwarte 13.11.2026)

- PTG-E 2023: Jaroń i in., Przegląd Gastroenterologiczny 18(3):225-248, DOI 10.5114/pg.2023.131998,
  https://www.termedia.pl/Diagnostic-and-therapeutic-recommendations-on-Helicobacter-pylori-infection-Recommendations-of-the-Working-Group-of-the-Polish-Society-of-Gastroenterology,41,51623,1,1.html
  (stwierdzenia 4, 5, 6, 9, 10, 11, 14, 16, 17; stwierdzenia 24-33 nieprzeczytane, nieużywane).
- Maastricht VI/Florence 2022, Gut 71:1724-1762, PMID 35944925 (kontekst: zakażenie jest chorobą zakaźną).
- NHS: https://www.nhs.uk/conditions/gastritis/ , https://www.nhs.uk/conditions/indigestion/ ,
  https://www.nhs.uk/conditions/stomach-ulcer/ , https://www.nhs.uk/conditions/coeliac-disease/diagnosis/
  (termin przeglądu strony o celiakii minął 31.03.2026: sprawdzić przy kolejnym przeglądzie mapy).
- Porcari i in. 2025, Lancet Gastroenterol Hepatol 10(2):154-167, PMID 39647502.
- Niedostępne: NICE CG184, NG20, NG12 (HTTP 403, nie obchodzono).

## 9. Poza zakresem

- Przeniesienie sygnałów migreny z `ZD.signals` do `sygnaly.js`.
- Probiotyki, dieta przy *H. pylori*, czas badania kontrolnego (PTG-E st. 24-33 nieprzeczytane).
- Inne narządy i objawy spoza brzucha.

## 10. Kolejne etapy (osobne specyfikacje, każda ze źródłami otwartymi w swojej sesji)

1. Choroby towarzyszące: reguły łączące schorzenia z profilu (np. Hashimoto i celiakia z sekcji 3; insulinooporność
   i lipidy; migrena i leki przeciwbólowe), na bazie wspólnej ścieżki z etapu 3 (`docs/specs/2026-11-10-etap3-laczenie-i-zwierzak-design.md`).
2. Hashimoto, insulinooporność, lipidy, migrena: sygnały z wyników badań i dziennika w tym samym kształcie co
   `SYG.ocen`, z listą na wizytę i „Co ustalił lekarz?” dla każdego schorzenia.
3. Przeniesienie `ZD.signals` do `sygnaly.js`, gdy będzie więcej niż jeden moduł sygnałów.
