<p><img src="brand/miara-logo.svg" alt="Miara" width="280"></p>

[![CI](https://github.com/slashdev-ops/miara-pwa/actions/workflows/ci.yml/badge.svg)](https://github.com/slashdev-ops/miara-pwa/actions/workflows/ci.yml)

## Engineering overview

Offline-first Progressive Web App in plain JavaScript: no framework and no runtime dependencies in the browser.
User data stays on the device. The rest of this README is in Polish and describes the application itself.

| Area | What is in the repository | Where |
| --- | --- | --- |
| CI pipeline | GitHub Actions on every push and pull request: JavaScript syntax check, validation of the JSON configuration, smoke test in Node, then the browser suite | [.github/workflows/ci.yml](.github/workflows/ci.yml) |
| Browser tests | Playwright, over 1,000 tests in 6 configurations: Chromium and WebKit, light and dark mode, 320 px width. Covers page and CSP errors, contrast, backup and offline work | [tests/przegladarka/](tests/przegladarka/) |
| CI resilience | Browser cache, time limits and retries for system packages, separate worker counts for Chromium and WebKit, HTML report uploaded on failure | [.github/workflows/ci.yml](.github/workflows/ci.yml) |
| Security headers | CSP with `script-src 'self'`, HSTS, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, COOP. The same set for both deployment targets | [vercel.json](vercel.json), [deploy/nginx.conf](deploy/nginx.conf) |
| nginx | HTTP to HTTPS redirect, TLS 1.2 and 1.3, `server_tokens off`, cache rules per file type, headers repeated in every `location` that sets its own | [deploy/nginx.conf](deploy/nginx.conf) |
| Published surface | Only application files are deployed; tests, tools and server configuration return 404 | [.vercelignore](.vercelignore) |
| Dependencies | Dependabot for GitHub Actions and test dependencies; one server-side dependency pinned to an exact version with a lock file and an override for a vulnerable transitive package | [.github/dependabot.yml](.github/dependabot.yml), [package.json](package.json) |
| Encrypted backup | Optional and consent-based: AES-GCM 256 in the browser (WebCrypto, PBKDF2-SHA-256, 600,000 iterations); the serverless function accepts ciphertext only, compares the device token in constant time and limits size and daily uploads | [api/kopia.js](api/kopia.js) |
| Deployment guide | Vercel and self-hosted nginx, with a header check after deployment | [WDROZENIE.md](WDROZENIE.md) |

Check the headers on the live deployment:

```bash
curl -sI https://miara-pwa.vercel.app | grep -iE 'content-security|strict-transport|x-content-type|referrer|permissions|x-frame|x-robots'
```

## O aplikacji

Aplikacja webowa (PWA) wspierająca redukcję masy ciała: plan posiłków z przepisami, kalkulator treningów,
pomiary, wyniki badań, 12-tygodniowy program ćwiczeń kolana, przegląd tygodnia i widok „Mój wpływ”.
Działa offline, instaluje się na ekranie początkowym telefonu i nie wysyła danych poza urządzenie.

**Wersja na żywo:** [miara-pwa.vercel.app](https://miara-pwa.vercel.app) (najlepiej na telefonie: Safari, „Dodaj do ekranu początkowego”)

## Zwierzak i postęp

Gąska, kaczuszka, kapibara albo kotek (własne postacie, rysowane w SVG) reaguje na wpisy użytkownika, także na wpisy w Zdrowiu (bez nagradzania bólu i bez oceny wyników badań). Trzy wskaźniki (Posiłki, Energia, Humor)
wynikają z zapisanych posiłków, snu, ruchu i nawyków, nigdy z wagi ani kalorii. W dni bez wpisów wskaźniki spadają,
po powrocie odrabiają straty w 1-2 dni; zwierzak nie umiera i nie cofa się w rozwoju (jajo, pisklę, młoda, dorosła).
Ekran postępu pokazuje dzień, tydzień i całość od startu z odznakami kamieni milowych; sylwetka z obwodów jest opcjonalna.

**Tryb pokazowy:** [miara-pwa.vercel.app/#demo](https://miara-pwa.vercel.app/#demo) przechodzi przez wszystkie stany
na danych przykładowych, bez zapisu w telefonie.

Stan zwierzaka nie jest zapisywany: liczy go czysta funkcja `PET.state(ctx)` w `pet.js` z danych aplikacji,
więc moduł jest testowany bez przeglądarki (`tests/smoke.js`). Projekt i plan: `docs/specs/`, `docs/plans/`.

## System wyglądu

Jasny, funkcjonalny, nowoczesny organiczny: paleta z logo jak materiały (szałwiowa zieleń, mosiądz, przygaszony błękit,
len, glina), siatka 8 px, zaokrąglenia 16 px (karty) i 12 px (pola i przyciski), wybory jako kafelki w równej siatce, cienie zamiast ramek,
krój Fraunces w nagłówkach i liczbach (lokalnie, licencja OFL w `fonts/`), tekst w kroju systemowym.

- Wszystkie kolory to zmienne w `app.css` z wersją jasną i ciemną; `tests/smoke.js` liczy kontrast WCAG AA z wartości
  zmiennych dla obu motywów i pilnuje liczby zaokrągleń i rozmiarów pisma.
- „Mój dzień” zaczyna się od „Stanu dziś” (waga, jedzenie, sen, ruch, ból i cykl): każda wartość podaje źródło
  i liczbę danych, a brak danych jest pokazany wprost; rzadziej używane rzeczy są zwinięte w „Więcej”.
- Przyciski: jeden kształt dla działań (zaokrąglenie 12 px jak pola, 48 px, tekst w jednej linii do 28 znaków,
  w sekcji na pełną szerokość, jeden pod drugim), najwyżej jedno wypełnione działanie w sekcji; pigułka tylko dla chipów
  (zaznaczanie i szybkie wartości), przełączniki segmentowe dla wyboru jednej opcji. Zasady pilnują testy.
- „Po co” pod nagłówkiem sekcji z pojęciem do zrozumienia (np. „Białko za złotówkę”); ta sama treść w Pomocy,
  w części „Co to znaczy?”.

## Mniej wpisów

Dla osób, które nie chcą wpisywać danych kilka razy dziennie:

- **Wpisuję raz dziennie** (Ustawienia): „Mój dzień” pokazuje jeden wieczorny wpis dnia (posiłki „Według planu”
  albo „Inaczej”, trening, kroki), a zwierzak przypomina o posiłkach dopiero od 19:00.
- **Trening z zegarka:** czas i kalorie z zegarka sportowego zamiast wyboru rodzaju treningu; do bilansu trafia netto,
  czyli kalorie z zegarka minus spoczynek w tym czasie. Pola mają limity i tę samą walidację co reszta aplikacji.

## Przewodnik i wpisy bez klawiatury

- **Pomoc** w nagłówku każdego ekranu: lista „Co chcesz zrobić?”; każde zadanie przenosi na właściwy ekran,
  rozwija zwinięty fragment i podświetla miejsce. Test sprawdza, że każdy cel istnieje na ekranie docelowym.
- **Komunikaty** trwają 3-12 s zależnie od długości tekstu, mają przycisk zamknięcia i przejścia do następnego kroku;
  w Ustawieniach można je wydłużyć albo zostawić do zamknięcia (WCAG 2.2.1, `role="status"`).
- **Pola liczbowe** mają przyciski − i +: puste pole zaczyna od ostatniej wartości (waga z ostatniego ważenia),
  krok zależy od pola, limity jak przy wpisywaniu. Czas treningu jednym dotknięciem: 30, 45, 60, 90 min.
- **Przytrzymanie − i +** zmienia wartość coraz szybciej; po puszczeniu fokus zostaje na przycisku, przycisk nie przesuwa
  się pod palcem, a nowa wartość trafia do czytnika ekranu. Strzałki w górę i w dół działają w polu, błąd widać od razu
  pod polem (WCAG 2.2: 2.4.3, 2.4.11, 3.3.1, 3.3.7, 4.1.3).
- **Scenariusze do sprawdzania** (Pomoc → Sprawdź działanie, albo adres np. `#demo-wpisy` lub `#demo-start`): gotowe
  dane przykładowe z opisem, co powinno się pokazać; nic się nie zapisuje.
- **Zamówione:** sushi, kurczak po koreańsku i tofu z ilością i dodatkami jednym dotknięciem; szacunek kalorii z przedziałem
  ±30% i białka, ostatni wybór zapamiętany. Sen i kroki mają chipy typowych wartości i „jak wczoraj”.
- **Gotuję to dziś** w przepisie wstawia danie do planu dnia; plan tygodnia ma dwa rytmy: obiady do 20 min
  w dni robocze i jedno większe danie w weekend, z filtrem „Na co dzień” i „Na weekend”.

## Profil zdrowia i plan działań

- W Zdrowiu osoba zaznacza kilka chorób przewlekłych i stosowane leki hormonalne; profil zostaje w telefonie,
  kopia bez danych zdrowotnych go pomija.
- „Twój plan” to reguły z dowodami i liczbami z wpisów, np. połączenie choroby i leku, którego wytyczne (kryteria WHO)
  nie zalecają, jako pierwsze działanie z prośbą o rozmowę z lekarzem. Każde działanie podaje siłę dowodów.
- „Dla mnie” w Posiłkach i plan tygodnia według profilu: danie spoza reguł profilu zamienia się na danie tego samego
  rodzaju i rytmu, które je spełnia; zdania „Razem: …” łączą zalecenia dla par schorzeń.
- „12 tygodni”: waga w przedziale z deficytu planu i kamienie milowe; aplikacja celowo nie prognozuje wyników badań,
  bólu ani samopoczucia, tylko pokazuje je z wpisów.

## Źródła treści zdrowotnych

- Każda liczba i zalecenie zdrowotne ma link „Źródło” (wytyczne WHO, UKMEC, EMA, ICHD-3, ATA, przeglądy w PubMed/PMC,
  baza USDA FoodData Central); źródła sprawdzone w sesji z cytatem wartości, nie z pamięci.
- `tests/smoke.js` pilnuje, że plan działań, karty i Zamówione mają źródła, a liczby bez źródła nie wracają;
  działanie linków sprawdza osobny skrypt (strony USDA są aplikacją w przeglądarce, więc skrypt sprawdza ich dane).

## Założenia projektu

| Obszar | Rozwiązanie |
| --- | --- |
| Prywatność | dane w `localStorage` telefonu; jedyny element serwerowy to opcjonalna funkcja `api/kopia.js` (zaszyfrowana kopia za zgodą, serwer nie zna klucza); brak analityki i zasobów z zewnętrznych domen |
| Bezpieczeństwo | CSP z `script-src 'self'` i `connect-src 'self'`, HSTS, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Permissions-Policy`, COOP |
| Powierzchnia ataku | `.vercelignore` publikuje tylko pliki aplikacji; testy, narzędzia i konfiguracja serwera zwracają 404 |
| Offline | service worker w strategii „najpierw sieć, potem pamięć podręczna”: zawsze najnowsza wersja, a bez sieci kopia lokalna |
| Jakość | CI: składnia JS, poprawność JSON konfiguracji, test dymny w Node (`tests/smoke.js`) i testy w przeglądarce (Playwright: Chromium i WebKit, 320 px, jasny i ciemny); Dependabot aktualizuje akcje GitHub |
| Dane | eksport i import kopii JSON z podglądem przed zastąpieniem; opcja kopii bez danych zdrowotnych |
| Zależności | aplikacja w przeglądarce bez zależności; jedna zależność funkcji kopii (`@vercel/blob`) oraz Playwright w testach; Dependabot aktualizuje akcje GitHub i zależności testów |

## Bezpieczeństwo w szczegółach

- `index.html` i `app.js` nie zawierają skryptów ani obsługi zdarzeń w atrybutach HTML (`on...=`), co pozwala
  ograniczyć `script-src` do własnych plików. Test dymny pilnuje tego przy każdym pushu.
- Dane wpisywane przez użytkownika są escapowane przed wstawieniem do HTML.
- `style-src` zawiera `'unsafe-inline'`, bo widoki ustawiają atrybuty `style` w generowanym HTML.
  To świadomy kompromis: skrypty pozostają ograniczone do własnej domeny.
- `X-Robots-Tag: noindex, nofollow`: aplikacja nie trafia do wyszukiwarek.
- Te same nagłówki są w `vercel.json` i w `deploy/nginx.conf`. Do sprawdzenia po wdrożeniu:

  ```bash
  curl -sI https://miara-pwa.vercel.app | grep -iE 'content-security|strict-transport|x-content-type|referrer|permissions|x-frame|x-robots'
  ```

- Kopie danych (`miara-kopia-*.json`) zawierają dane zdrowotne, dlatego `.gitignore` blokuje je przed commitem.

### Zaszyfrowana kopia dla właściciela (opcjonalna, za zgodą)

- **Zgoda** (RODO art. 7 i 9 ust. 2 lit. a): osobna, z wersją treści, celem, czasem przechowywania i prawami; pole
  niezaznaczone domyślnie; nowa wersja treści wymaga ponownej zgody; wycofanie zatrzymuje wysyłkę i usuwa klucz.
- **Szyfrowanie end-to-end w telefonie**: AES-GCM 256, klucz z hasła PBKDF2-SHA-256 (600 000 iteracji, losowa sól),
  losowy IV dla każdej kopii (WebCrypto). Hasło nie jest zapisywane; telefon trzyma `CryptoKey` z `extractable: false`
  w IndexedDB.
- **Funkcja `api/kopia.js`** (Vercel): token urządzenia porównywany w stałym czasie, przyjmuje wyłącznie kopertę
  z szyfrogramem (lista dozwolonych pól, base64, minimalna liczba iteracji), limit 1 MB i 3 wysyłek na dobę,
  zapis w magazynie Vercel Blob z dostępem prywatnym pod losową nazwą, przechowywane 4 ostatnie kopie, `Cache-Control: no-store`.
- Serwer i magazyn nie znają klucza: wyciek tokenu magazynu albo adresu pliku nie ujawnia danych.
- Zależność funkcji `@vercel/blob` w dokładnej wersji z plikiem blokady; podatna zależność pośrednia wymuszona na
  poprawioną wersję (`overrides`); aplikacja w przeglądarce nadal nie ma zależności.

## Struktura

| Plik | Rola |
| --- | --- |
| `index.html` | szkielet strony, manifest, ikony |
| `app.js`, `app.css` | logika i wygląd aplikacji |
| `wpisy.js` | karta „Dziś” w Pomiarach dnia i szybki wpis: suwaki snu i kroków, wpis po dotknięciu wartości, waga z wykresem 14 dni i pasem zwykłego wahania; zapis przez `app.js`, testowana w `tests/smoke.js` |
| `zdarzenia.js` | „Co się wydarzyło” i jeden cel aktywny z mapą wpływów: czyste funkcje bez DOM, testowane w `tests/smoke.js` |
| `pet.js` | zwierzak: stan, rysunek SVG, reakcje, ekran postępu, tryb pokazowy |
| `sw.js`, `sw-register.js` | działanie offline; rejestracja tylko na HTTPS lub localhost |
| `manifest.webmanifest`, `icons/` | instalacja na ekranie początkowym |
| `brand/` | logo w SVG: logotyp jasny i ciemny, znak, ikona, favicon |
| `vercel.json`, `.vercelignore` | nagłówki bezpieczeństwa i lista plików publikowanych na Vercel |
| `deploy/nginx.conf` | te same nagłówki dla własnego serwera (nginx 1.24+) |
| `tests/smoke.js`, `.github/` | test dymny w GitHub Actions, Dependabot |
| `tests/przegladarka/` | testy w przeglądarce (Playwright): Chromium i WebKit, tryb jasny i ciemny, 320 px; błędy strony i CSP, kontrast z wyliczonych kolorów, kopia, praca bez sieci |
| `tools/` | generator logo (`make_logo.py`) i ikon PNG (`render_icons.py`, wymaga Playwright) |

## Uruchomienie lokalnie

```bash
python3 -m http.server 8000
# http://localhost:8000
node tests/smoke.js
```

Testy w przeglądarce (Chromium i WebKit):

```bash
cd tests/przegladarka
npm ci
npx playwright install chromium webkit
npx playwright test
```

Wdrożenie na Vercel, własny serwer nginx i instalacja na iPhonie: [WDROZENIE.md](WDROZENIE.md).

## Zgodność danych

Klucz pamięci (`talerz-trening-v1`) i identyfikator kopii (`talerz-i-trening`) pochodzą z pierwszej nazwy aplikacji.
Zostały bez zmian, żeby działały istniejące dane i kopie. Zmiana wymaga migracji; test dymny to sprawdza.

## Ograniczenia

- Treści zdrowotne mają charakter informacyjny, ze źródłami i oznaczeniem siły dowodów. Aplikacja nie zastępuje lekarza.
- Śledzenie objawów nóg i program kolana włącza użytkownik; dane domyślne w kodzie to wartości przykładowe.
- Funkcja „Wspólne wyzwanie” korzysta ze środowiska artefaktów claude.ai; na własnym adresie pokazuje, że jest niedostępna.
