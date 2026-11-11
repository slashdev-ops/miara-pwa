# Testy w przeglądarce: instrukcja krok po kroku

Testy uruchamiają Miarę w prawdziwych przeglądarkach: Chromium i WebKit (silnik Safari). Każdy test idzie w 6 wariantach: tryb jasny i ciemny, telefon (iPhone 13) i najwęższy ekran 320 px. Testy używają wyłącznie danych pokazowych, nigdy Twoich.

## 1. Przygotowanie (raz, na nowym komputerze)

1. Zainstaluj Node.js w wersji LTS ze strony <https://nodejs.org/>.
2. Otwórz PowerShell w katalogu testów:
   ```powershell
   cd <katalog repozytorium>\tests\przegladarka
   ```
3. Zainstaluj zależności testów:
   ```powershell
   npm ci
   ```
4. Pobierz przeglądarki testowe:
   ```powershell
   npx playwright install chromium webkit
   ```

## 2. Uruchomienie z oknami (domyślnie)

1. W katalogu `tests\przegladarka` wpisz:
   ```powershell
   npx playwright test
   ```
2. Na pulpicie otwierają się okna przeglądarek. Kilka testów idzie naraz, więc okna pojawiają się i znikają.
3. Na końcu w PowerShell zobaczysz wynik, np. `114 passed`. Linia z `failed` oznacza błąd, a nazwa testu mówi, co się nie zgadza.

Chcesz oglądać jeden test po drugim, bez kilku okien naraz:
```powershell
npx playwright test --workers=1
```

## 3. Tryb z odtwarzaniem kroków (najwygodniejszy do oglądania)

1. Wpisz:
   ```powershell
   npx playwright test --ui
   ```
2. Otworzy się okno z listą testów. Kliknij trójkąt przy teście albo przy całym pliku.
3. Po przebiegu kliknij dowolny krok na osi czasu: zobaczysz ekran aplikacji dokładnie w tej chwili.
4. Zamknij okno, gdy skończysz.

## 4. Jak wyłączyć i włączyć okna

| Co chcesz | Jak |
| --- | --- |
| Jedno uruchomienie bez okien | `$env:HEADLESS=1; npx playwright test; Remove-Item Env:HEADLESS` |
| Jedno uruchomienie z oknami | `npx playwright test` (domyślnie) |
| Na stałe bez okien | w `playwright.config.js` zmień `headless: !!process.env.CI \|\| !!process.env.HEADLESS` na `headless: true` |
| Na stałe z oknami (stan obecny) | `headless: !!process.env.CI \|\| !!process.env.HEADLESS` |

W GitHub Actions (CI) testy zawsze idą bez okien: tam nie ma ekranu.

## 5. Tylko wybrane testy

- Tylko jeden wariant, np. telefon w trybie jasnym w Chromium:
  ```powershell
  npx playwright test --project=chromium-jasny
  ```
- Tylko testy, których nazwa zawiera dane słowo:
  ```powershell
  npx playwright test -g "dymek"
  ```

## 6. Raport ze zrzutami

1. Po przebiegu wpisz:
   ```powershell
   npx playwright show-report
   ```
2. W przeglądarce otworzy się raport z ostatniego przebiegu: lista testów, czasy i, przy teście z błędem, zrzut ekranu i ślad kroków.
3. Raport z GitHuba, gdy test nie przejdzie: w pull requeście otwórz zakładkę **Checks**, wybierz przebieg **CI**, a na dole strony w **Artifacts** pobierz `raport-przegladarka`.

## 7. Gdy coś nie działa

| Objaw | Co zrobić |
| --- | --- |
| `Executable doesn't exist` | Przeglądarki nie są pobrane: wróć do kroku 1.4. |
| `No tests found` | Jesteś w złym katalogu: przejdź do `tests\przegladarka`. |
| Port 8805 zajęty | Zamknij poprzedni przebieg testów (okno PowerShell) i uruchom ponownie. |
