<p><img src="brand/miara-logo.svg" alt="Miara" width="280"></p>

Aplikacja webowa (PWA) wspierająca redukcję masy ciała: plan posiłków z przepisami, kalkulator treningów,
pomiary, wyniki badań, 12-tygodniowy program ćwiczeń kolana, przegląd tygodnia i widok „Mój wpływ”.
Działa offline, instaluje się na ekranie początkowym telefonu i nie wysyła danych poza urządzenie.

**Wersja na żywo:** [miara-pwa.vercel.app](https://miara-pwa.vercel.app) (najlepiej na telefonie: Safari, „Dodaj do ekranu początkowego”)

**EN summary:** offline-first Progressive Web App in plain JavaScript (no framework, no npm dependencies).
Health data never leaves the device. Hardened with a strict Content Security Policy and security headers,
tested in GitHub Actions, deployable on Vercel or nginx.

## Zwierzak i postęp

Gąska albo kaczuszka w stylu Tamagotchi reaguje na wpisy użytkownika. Trzy wskaźniki (Najedzenie, Energia, Humor)
wynikają z zapisanych posiłków, snu, ruchu i nawyków, nigdy z wagi ani kalorii. W dni bez wpisów wskaźniki spadają,
po powrocie odrabiają straty w 1-2 dni; zwierzak nie umiera i nie cofa się w rozwoju (jajo, pisklę, młoda, dorosła).
Ekran postępu pokazuje dzień, tydzień i całość od startu z odznakami kamieni milowych; sylwetka z obwodów jest opcjonalna.

**Tryb pokazowy:** [miara-pwa.vercel.app/#demo](https://miara-pwa.vercel.app/#demo) przechodzi przez wszystkie stany
na danych przykładowych, bez zapisu w telefonie.

Stan zwierzaka nie jest zapisywany: liczy go czysta funkcja `PET.state(ctx)` w `pet.js` z danych aplikacji,
więc moduł jest testowany bez przeglądarki (`tests/smoke.js`). Projekt i plan: `docs/specs/`, `docs/plans/`.

## Założenia projektu

| Obszar | Rozwiązanie |
| --- | --- |
| Prywatność | dane tylko w `localStorage` telefonu; brak backendu, analityki i zasobów z zewnętrznych domen |
| Bezpieczeństwo | CSP z `script-src 'self'` i `connect-src 'self'`, HSTS, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Permissions-Policy`, COOP |
| Powierzchnia ataku | `.vercelignore` publikuje tylko pliki aplikacji; testy, narzędzia i konfiguracja serwera zwracają 404 |
| Offline | service worker w strategii „najpierw sieć, potem pamięć podręczna”: zawsze najnowsza wersja, a bez sieci kopia lokalna |
| Jakość | CI: składnia JS, poprawność JSON konfiguracji, test dymny 13 widoków; Dependabot aktualizuje akcje GitHub |
| Dane | eksport i import kopii JSON z podglądem przed zastąpieniem; opcja kopii bez danych zdrowotnych |
| Zależności | zero: brak `node_modules`, brak łańcucha dostaw do aktualizowania poza akcjami CI |

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

## Struktura

| Plik | Rola |
| --- | --- |
| `index.html` | szkielet strony, manifest, ikony |
| `app.js`, `app.css` | logika i wygląd aplikacji |
| `pet.js` | zwierzak: stan, rysunek SVG, reakcje, ekran postępu, tryb pokazowy |
| `sw.js`, `sw-register.js` | działanie offline; rejestracja tylko na HTTPS lub localhost |
| `manifest.webmanifest`, `icons/` | instalacja na ekranie początkowym |
| `brand/` | logo w SVG: logotyp jasny i ciemny, znak, ikona, favicon |
| `vercel.json`, `.vercelignore` | nagłówki bezpieczeństwa i lista plików publikowanych na Vercel |
| `deploy/nginx.conf` | te same nagłówki dla własnego serwera (nginx 1.24+) |
| `tests/smoke.js`, `.github/` | test dymny w GitHub Actions, Dependabot |
| `tools/` | generator logo (`make_logo.py`) i ikon PNG (`render_icons.py`, wymaga Playwright) |

## Uruchomienie lokalnie

```bash
python3 -m http.server 8000
# http://localhost:8000
node tests/smoke.js
```

Wdrożenie na Vercel, własny serwer nginx i instalacja na iPhonie: [WDROZENIE.md](WDROZENIE.md).

## Zgodność danych

Klucz pamięci (`talerz-trening-v1`) i identyfikator kopii (`talerz-i-trening`) pochodzą z pierwszej nazwy aplikacji.
Zostały bez zmian, żeby działały istniejące dane i kopie. Zmiana wymaga migracji; test dymny to sprawdza.

## Ograniczenia

- Treści zdrowotne mają charakter informacyjny, ze źródłami i oznaczeniem siły dowodów. Aplikacja nie zastępuje lekarza.
- Śledzenie objawów nóg i program kolana włącza użytkownik; dane domyślne w kodzie to wartości przykładowe.
- Funkcja „Wspólne wyzwanie” korzysta ze środowiska artefaktów claude.ai; na własnym adresie pokazuje, że jest niedostępna.
