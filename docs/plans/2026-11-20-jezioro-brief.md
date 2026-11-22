# Brief: ścieżka do jeziora w nowym stylu | 20.11.2026

Zgłoszenie: „jezioro Kluski również jest do poprawy, graficznie zostało w starym miejscu”. Zaakceptowana propozycja (20.11.2026):

- `PET.path(n, weather, name)` w `pet.js` (dziś szare owale kamieni na tle wody, bez zwierzaka) rysuje ścieżkę w stylu nowych postaci:
  kamienie z miękkim cieniowaniem (gradient z tokenów) i konturem w ciemniejszym odcieniu, przebyte kamienie wyraźniejsze, kolejne jaśniejsze;
  na kamieniu, do którego zwierzak dotarł, stoi mała wersja jego postaci (to samo `PET.svg`/figura w skali, ten sam gatunek, nastrój spokój);
  na końcu jezioro: woda z delikatną falą, kilka szczegółów brzegu (trzcina, kaczeńce), wygląd zależny od numeru jeziora (np. inny odcień, inne rośliny).
- Pogoda w tym samym stylu: „wiatr” (dzień z bólem głowy) — pochylona trzcina i smugi; „mgła” (2 krótkie noce) — półprzezroczysta warstwa;
  zwierzak w obu przypadkach odpoczywa na kamieniu; nigdy nie cofa się i kamienie nie znikają.
- Ruch: przy przejściu na kolejny kamień krótki podskok; fala wody; tylko przy `prefers-reduced-motion: no-preference`.
- Teksty i opis dla czytnika (`aria-label`, linie „Jezioro N. … stoi na brzegu”, „Przerwa niczego nie zabiera”) bez zmian, formy rodzajowe jak w `PET.form`.
- Kolory przez tokeny z wariantem ciemnym; kontrast konturów ≥ 3:1; unikalne identyfikatory gradientów na stronie.
- Testy: smoke (SVG ścieżki zawiera figurę zwierzaka właściwego gatunku na kamieniu nr min(n, liczba kamieni); różne jeziora różnią się; pogoda; brak animacji przy reduced motion).
