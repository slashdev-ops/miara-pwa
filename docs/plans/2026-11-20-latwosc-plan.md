# Łatwość na każdym poziomie: przegląd i plan | 20.11.2026

Zasady z rozmowy (19–20.11.2026): łatwy wpis zachęca do uzupełniania; suwak tam, gdzie wystarcza przybliżenie, dotknięcie wartości
pozwala wpisać dokładnie; nigdy puste pole (start od ostatniej wartości); przyciski reagują i zmieniają działanie po akcji; zwarty układ pod jedną rękę;
bez nieczytelnych kształtów (kafelki zamiast pigułek); wykres, który pokazuje zmianę i zwykłe wahanie, przyciąga; nazwa z liczbą dotknięć to przenośnia, nie liczba.

## Kolejka (w tej kolejności, jedna gałąź `lite-wpisy`, przegląd po każdym zadaniu, scalenie na końcu po zielonym CI)
0. W toku: kafelki zamiast pigułek.
1. Poprawki suwaków z przeglądu + suwak kroków w szybkim wpisie + suwaki skal 0–10 + usunięcie liczby dotknięć z tekstów (brief: suwaki-runda2).
2. Nowe zwierzaki w aplikacji (plan 2026-11-20-zwierzaki-zdrowie-plan.md, Task 1).
3. Reakcje zwierzaka na Zdrowie (ten sam plan, Task 2).
4. **Podsumowanie po szybkim wpisie „Twój stan”** (zaakceptowane 19.11, jeszcze nie w aplikacji): karta zwija się do „✓ Zapisane na dziś: …” z przyciskami
   „Zobacz podsumowanie” i „Zmień”; ekran rozwija się w miejscu: dziś, ostatnie 7 dni (kropki, liczby dni samopoczucia i jedzenia kalorycznego, średnie kroków i snu,
   wykres wagi, jeśli jest), seria i zwierzak, „co dalej” (najbliższa propozycja odkrywania). Same liczby, bez ocen; fokus na „Zobacz podsumowanie” po zapisie.
5. **Wiersze wartości wszędzie, gdzie dziś są gołe pola liczb** (ten sam komponent co karta „Dziś”: wartość-przycisk z wpisem po dotknięciu, − i + po prawej,
   start od ostatniej wartości z datą, nigdy puste pole):
   - Trening: czas (suwak 5–180 min co 5), kalorie i czas z zegarka (bez suwaka, ± i wpis).
   - Obwody (talia, biodra, udo, pozostałe), nadgarstek, kostka: ±0,5 cm, start od ostatniego pomiaru.
   - Skład ciała (FFM, tłuszcz, ECW, BMR), VO2max, tętno spoczynkowe i maksymalne: ± w kroku pola, start od ostatniej wartości.
   - Profil (Ustawienia i ekran startowy): waga, waga docelowa (±0,5), wzrost (suwak 140–210 cm), wiek (suwak 16–90).
   - Wykres zmiany z pasem zwykłego wahania tylko tam, gdzie mamy źródło wahania (waga). Dla talii i FFM: wykres trendu z punktami i średnią 4 tygodni,
     bez pasa, dopóki nie ma źródła o wahaniu (zasada „badania tylko z linków”).
6. **Przyciski, które reagują, poza kartą „Dziś”:**
   - Posiłki „Zjem” → „✓ Zjedzone · Cofnij” (5 s) → „Zjem jeszcze raz”; licznik posiłków dnia na zakładce aktualizuje się od razu.
   - Trening „Zapisz” → „✓ Zapisano · Cofnij” → „Dodaj kolejny”.
   - Badania „Zapisz wynik” → „✓ Zapisano · Cofnij” → „Dodaj następny wynik” (z tą samą datą i jednostką).
   - Ten sam wzorzec i ta sama funkcja stanów (bez przesunięcia przycisku, etykieta ogłaszana, bez zmiany kontekstu).
7. **Mniej tekstu na pierwszy rzut oka** (rada 11.11, działanie P2: Posiłki ok. 857 słów, Ustawienia ok. 819): opisy pod wyborami skrócone do jednego zdania,
   dłuższe wyjaśnienia i źródła w rozwijanym „Dlaczego?”.
8. **Drobne z rady (zaległe):** ukryć „Brzuch” w „Dodaj wpis” w prostym widoku; neutralne paski zwierzaka przed pierwszym wpisem w prostym widoku;
   podpis „przybliżenie” przy celu kalorii, gdy waga, wzrost lub wiek są startowe; w Ustawieniach wybór strony przycisków − i + (prawa/lewa ręka);
   krótka wibracja po zapisie tam, gdzie urządzenie ją obsługuje (`navigator.vibrate`, wyłączana w Ustawieniach, domyślnie włączona).

## Zasady dla wszystkich zadań
TDD z dowodem RED; smoke 0 BLAD; pełny Playwright na koniec każdego zadania (wszystkie linie podsumowania); strażnik CSS; tokeny jasny/ciemny; WCAG 2.2 AA
(2.5.7 przeciąganie, 2.5.8 rozmiar celu, 3.2.2 bez zmiany kontekstu, 4.1.3 komunikaty); dane bez migracji (te same pola `S.meas`, `S.days`, `S.labs`);
bez „ograniczony”, „brakuje”, „niekompletny”; bez marek i leków; liczby z badań tylko ze źródeł otwartych w sesji.
