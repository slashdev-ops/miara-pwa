# Brief: przyciski, które reagują, poza kartą „Dziś” (plan „Łatwość”, pkt 6) | 20.11.2026

Wzorzec z karty „Dziś” (`wpisy.js`: stan przycisku jako czysta funkcja, bez przesunięcia, etykieta ogłaszana przez `#sr`, bez zmiany kontekstu,
okno „Cofnij” z długości komunikatów, blokada podwójnego dotknięcia ok. 700 ms). Wydziel ten wzorzec do wspólnej małej funkcji (np. `actBtn(spec)`),
zamiast kopiować; karta „Dziś” korzysta z tej samej funkcji.

- Posiłki „Zjem” → „✓ Zjedzone · Cofnij” (okno cofania) → „Zjem jeszcze raz”; licznik posiłków dnia na zakładce aktualizuje się od razu; cofnięcie usuwa dokładnie dodany wpis.
- Trening „Zapisz” (oraz „Dodaj do dnia” z zegarka) → „✓ Zapisano · Cofnij” → „Dodaj kolejny”.
- Badania „Zapisz wynik” → „✓ Zapisano · Cofnij” → „Dodaj następny wynik” (data i jednostka zostają z poprzedniego wpisu).
- Reakcje zwierzaka i punkty jak dotąd (cofnięcie zdejmuje też wpływ na punkty, bo liczą się z danych).
- Testy: czysta funkcja stanów (smoke, wszystkie przejścia), Playwright dla każdego z 3 miejsc (napis, cofnięcie, brak przesunięcia, 320 px, jasny/ciemny).
