# Prosty start: szybki wpis i stopniowe odkrywanie | projekt | 19.11.2026

> Od 20.11.2026 karta nazywa się „Szybki wpis dnia”; wcześniejsza nazwa z liczbą dotknięć była przenośnią, nie liczbą (plan „Łatwość”, punkt E w briefie suwaków, runda 2).

## Po co
Nowe osoby widzą w Miarze dużo tekstu i rozległe ekrany. Myślą, że muszą uzupełnić wszystko, a nie wszystko chcą, więc rezygnują.
Cel: na starcie pokazać, że podstawowy dzień to szybki wpis w jednym miejscu, a resztę proponować powoli, bez przymusu.
Sukces: nowa osoba zapisuje dzień szybkim wpisem na jednym ekranie przy 320 px, bez przewijania do karty i bez pisania.

## Dowody (otwarte 19.11.2026)
- Patel ML i in., JMIR Form Res 2022, PMID 36512404 (pilotaż RCT, n=38, 3 mies.): zapis tylko „red zone foods” (kaloryczne, mało
  wartościowe) przez listę: jedzenie zapisywane w 97% dni wobec 49% przy pełnym zapisie; spadek masy -3,3 vs -3,4 kg.
- Nezami BT i in., Obesity 2022, PMID 35146942 (pilotaż RCT, n=72, 6 mies.): uproszczony zapis jedzenia kalorycznego vs liczenie
  kalorii: 4,0% vs 5,7% spadku masy, różnica nieistotna; 5% masy: 42,9% vs 43,2%.
- Harvey J i in., Obesity 2019, PMID 30801989: z wynikiem wiązała się częstość zapisu, nie czas; czas spadał z 23,2 do 14,6 min dziennie.
- Burke LE i in., J Am Diet Assoc 2011, PMID 21185970: samokontrola stale związana ze spadkiem masy, poziom dowodów słaby.
- Nielsen J, NN/g 2006, „Progressive disclosure”: „Initially, show users only a few of the most important options.”
Język w aplikacji: „wstępne badania” (pilotaże), nie pewność.

## Wybór podejścia (19.11.2026): wariant 1
1. **Karta „Szybki wpis dnia” + stopniowe odkrywanie (wybrane).**
2. Tylko istniejący tryb `S.once` jako domyślny dla nowych: najtaniej, ale wciąż wiele pól i brak „szybkiego wpisu w jednym miejscu”.
3. Zwierzak pyta w dymkach po jednym pytaniu: przyjemne, ale rozproszone, nie widać, że całość to szybki wpis.

## Zakres
### Prosty widok (`S.lite`)
- Nowa osoba (brak jakichkolwiek wpisów w `S.days`, `S.meas`, `S.pain` w chwili pierwszego uruchomienia) dostaje `S.lite=true`.
  Istniejące dane przy aktualizacji: `S.lite=false` (nic się nie zmienia u obecnych osób).
- W prostym widoku Mój dzień pokazuje tylko: kartę „Szybki wpis dnia”, kartę zwierzaka, odkryte elementy i przycisk
  „Pokaż całą Miarę”. Reszta ekranu (pierwsze kroki, karty, pomiary, „Więcej”) jest ukryta, nie usunięta.
- „Pokaż całą Miarę” i przełącznik „Prosty widok” w Ustawieniach (sekcja Wpisy) zmieniają `S.lite` w obie strony bez utraty danych.
- Pozostałe zakładki bez zmian.

### Karta „Szybki wpis dnia”
Trzy rzędy żetonów, jeden wybór w rzędzie (ponowne dotknięcie zmienia wybór), zapis od razu, bez przycisku Zapisz:
- **Kroki:** [poniżej 5 tys.] [5–8 tys.] [ponad 8 tys.] → `S.meas[k].stepsB` = 'lo' | 'mid' | 'hi'. Liczba kroków `steps`
  nie jest zgadywana; wpisana liczba ma pierwszeństwo przy obliczeniach.
- **Jak się czujesz:** [Dobrze] [Ból głowy] [Brzuch] [Inne] → `S.meas[k].feel`. „Ból głowy” dodatkowo tworzy dzień z bólem
  w `S.pain[k]` (istniejące zachowanie: seria się nie przerywa); zmiana wyboru z „Ból głowy” na inny usuwa ten dzień z `S.pain`,
  jeśli powstał z karty.
- **Jedzenie kaloryczne dziś** (słodycze, fast food, słone przekąski, alkohol; jak „red zone” u Patel): [0] [1] [2 lub więcej]
  → `S.meas[k].redz` = 0 | 1 | 2. Bez kalorii.
- Po trzech wyborach: „✓ Dzień zapisany” i reakcja zwierzaka. Każda odpowiedź jest dobra: nastrój zwierzaka nie zależy od
  wartości (ani od kroków, ani od jedzenia kalorycznego), tylko od tego, że wpis jest.
- Pod kartą jedno zdanie źródła: „Wstępne badania: krótki zapis codziennie działał podobnie jak pełny.” z odnośnikiem `srcHtml`.

### Zwierzak i punkty
- Dzień z pełną kartą (3 rzędy) liczy się zwierzakowi jak dzień z wpisami (jak `onceDone` w `S.once`: co najmniej 30 punktów).
- W prostym widoku jajko pęka z każdym dniem z pełną kartą (1 z 4 … 4 z 4) zamiast z pierwszych kroków.

### Stopniowe odkrywanie (`S.unlock`)
- Po 3 dniach z pełną kartą (nie muszą być pod rząd) karta zwierzaka proponuje jedną nową rzecz, w stałej kolejności:
  1. Waga (pole wagi z Pomiarów dnia), 2. Posiłki z planu („Zjem” przy daniu), 3. Sen, 4. Cała Miara.
- Propozycja: zdanie korzyści + [Dodaj] [Nie teraz]. „Dodaj” dopisuje element do `S.unlock` i pokazuje go w prostym widoku pod kartą.
  „Nie teraz” chowa propozycję na 7 dni (`S.unlockSnooze`); niczego nie odbiera, bez komunikatów o stracie.
- Najwyżej jedna propozycja naraz; kolejna po następnych 3 dniach z pełną kartą od ostatniej decyzji.

### Ekran startowy
- `renderIntro` w prostym widoku: główny przycisk „Zacznij od szybkiego wpisu” (przechodzi do Mojego dnia bez wypełniania pól)
  nad formularzem; formularz zostaje dla chętnych. Brak wagi, wzrostu lub wieku: obliczenia kalorii z wartości domyślnych
  (istniejący mechanizm `isStart`) są wszędzie podpisane „przybliżenie”, a propozycja „Waga” z odkrywania wyjaśnia, że poprawi wynik.

### Dane
- `stepsB`, `feel`, `redz` w `S.meas`: dane o zdrowiu, więc poza kopią bez danych o zdrowiu (już przez `NH_DROP` dla `meas`).
- `S.lite`, `S.unlock`, `S.unlockSnooze`: ustawienia, zostają w kopii bez danych o zdrowiu (`BK_NH_KEEP`).
- Mapa powiązań: wiersze 49 (Patel 2022), 50 (Nezami 2022), 51 (Harvey 2019 + Burke 2011).

## Poza zakresem
Zmiana innych zakładek; usuwanie funkcji; liczenie kalorii z „jedzenia kalorycznego”; zgadywanie liczby kroków z zakresu;
powiadomienia systemowe; nowe gatunki zwierzaka.

## Antycele
- Prosty widok nie może wyglądać jak kara ani „wersja gorsza”: bez „ograniczony”, „brakuje”, „niekompletny”.
- Zwierzak nigdy nie smutnieje z powodu wyboru „2 lub więcej” ani „poniżej 5 tys.”.
- Obecne osoby nie tracą widoku, do którego są przyzwyczajone.

## Testy
Smoke: nowa osoba dostaje `lite`, istniejące dane nie; szybki wpis zapisuje `stepsB/feel/redz`; „Ból głowy” tworzy i zdejmuje
`S.pain`; dzień z kartą liczy się zwierzakowi; propozycja po 3 dniach, „Nie teraz” na 7 dni; nowe pola w `NH_DROP`/`BK_NH_KEEP`;
wpisana liczba kroków ma pierwszeństwo nad zakresem. Playwright: przy 320 px karta mieści się bez poziomego przewijania,
cele dotyku ≥ 44 px, `aria-pressed` na żetonach, tryb jasny i ciemny, szybki wpis → „Dzień zapisany”; scenariusz `#demo-prosty`.

## Rozstrzygnięcia po recenzji wykonawcy (decyzje wykonawcy, do sprawdzenia)
- **Zakresy kroków** (`stepsB`) liczą się tylko jako „wpis jest” (seria, zwierzak, `dayLeft`); nie zaliczają nawyku „Cel kroków”,
  nie trafiają do spalania, wykresów ani przeglądów. Wpisana liczba `steps`: rząd kroków pokazuje zakres wyliczony z liczby
  (bez zapisu `stepsB`).
- **Pełna karta** = ustawione `stepsB` (albo liczba `steps`), `feel` i `redz`. Nowa gałąź w `dayOk` niezależna od `S.once`.
  W prostym widoku `dayLeft` = 0 przy pełnej karcie.
- **Jajko:** w prostym widoku pęka z dniami z pełną kartą; poza nim bez zmian (`eggCrack`). Stan jajka = większa z obu liczb,
  więc przełączenie widoku go nie cofa. Po 4 z 4: istniejący wybór towarzysza.
- **„Zacznij od szybkiego wpisu”** działa jak istniejące „Pomiń” (`data-introdone`) i ustawia `S.lite=true`. Pierwsze uruchomienie
  = brak zapisanego stanu w pamięci telefonu. Import kopii: `S.lite` z kopii, a gdy go nie ma, `false`.
- **Ból głowy z karty:** `S.pain[k].card=true`; zmiana wyboru usuwa tylko dzień z bólem utworzony przez kartę.
- **Odkrywanie:** „Cała Miara” ustawia `S.lite=false`. `S.unlock` zostaje przy przełączaniu widoku. Jedna propozycja naraz,
  `S.unlockAt` = data ostatniej decyzji; kolejna po 3 różnych dniach z pełną kartą po tej dacie; „Nie teraz” dodatkowo 7 dni.
- **„Inne”** to tylko żeton, bez pola tekstowego. Żetony pokazują zapisany wybór (`aria-pressed`).

## Dla wykonawcy
Teksty dokładne jak wyżej; układ żetonów i wygląd karty z istniejących klas (`chips`, `chip`, `panel`); kolejność odkrywania stała.
