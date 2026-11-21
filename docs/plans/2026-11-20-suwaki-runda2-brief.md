# Brief: suwaki, runda 2 | 20.11.2026

Buduj na gałęzi `lite-wpisy` (po kafelkach). Komponent `wpisy.js` z poprzedniego zadania.

## A. Poprawki z przeglądu (Important)
1. „Zatwierdź (N)” zapisuje tylko zmienione wiersze; N = liczba wierszy faktycznie zapisywanych. „Jak wczoraj” zapisuje tylko wiersze z ostatnią wartością;
   waga z profilu nigdy nie jest zapisywana przez „Jak wczoraj”. Test: zmiana jednego wiersza przy pozostałych z ostatnią wartością → zapisuje się tylko ten wiersz,
   `PET.react('weigh')` tylko przy zapisie wagi.
2. Wartości robocze kopiowane do `sessionStorage` (klucz dnia, try/catch) i odtwarzane po przeładowaniu; czyszczone po zapisie i przy zmianie dnia.

## B. Poprawki z przeglądu (Minor)
3. Podpowiedź i przycisk: „jak wczoraj?” / „Jak wczoraj” tylko gdy ostatnia wartość jest z wczoraj; inaczej „jak ostatnio?” / „Jak ostatnio”.
4. Import (Skrót, zegarek: `impFromHash`, `quickFromHash`) ma pierwszeństwo: świeża wartość z importu czyści wartość roboczą tego wiersza.
5. Nieaktualny stan edycji po `render()` w trakcie edycji: `busy()` nie może zostać `true` na stałe.
6. Przywróć test Playwright „Co to znaczy?” tylko gdy zapisana waga leży poza pasem.

## C. Suwak kroków w szybkim wpisie (prosty widok)
- Rząd kroków w karcie szybkiego wpisu: wiersz jak w karcie „Dziś” (wartość-przycisk z wpisem po dotknięciu, − i + po prawej, suwak 0–20 000 co 500).
- Zapis bez „Zatwierdź”: po puszczeniu suwaka (`change`), po − i +, po Enter lub utracie fokusu w polu; zapis do `meas.<dziś>.steps` (liczba).
- Start: ostatnia liczba kroków, wyszarzona, „jak ostatnio?”; dzień liczy się (`liteFull`) dopiero po dotknięciu. Stare dni z `stepsB` dalej działają.
- Liczba z suwaka zasila to samo co liczba z Pomiarów dnia (cel kroków, `measuredTdee`, wykresy).

## D. Suwaki skal 0–10
- Ból nóg, ciężkość nóg (`legHtml`, `data-leg`), wzdęcie brzucha (`gut`) i każda inna skala 0–10: jeden wiersz z dużą liczbą, suwak co 1, podpisy końców
  („0 brak”, „10 najgorszy” albo dotychczasowe podpisy skali), − i + po prawej; zapis po puszczeniu / − / +; format danych bez zmian.
- Start: dzisiejsza wartość albo ostatnia wyszarzona z „ostatnio: X”; wpis dopiero po dotknięciu. `aria-valuetext` „3 z 10”.

## E. Bez liczby dotknięć w nazwach
- Karta, ekran startowy, scenariusz i teksty jajka dostają nazwę „Szybki wpis dnia” (np. „Zacznij od szybkiego wpisu”, „Dni z szybkim wpisem: X z 4”);
  w repozytorium nie zostaje żadna liczba dotknięć (także w testach i komentarzach). Nazwy wewnętrzne (`lite`, `liteFull`, `stepsB`) bez zmian.

## Testy i zasady
TDD (RED → GREEN); smoke 0 BLAD; pełny Playwright raz na koniec (wszystkie linie podsumowania); zrzuty 390 i 320 px jasny/ciemny szybkiego wpisu, karty „Dziś”.
