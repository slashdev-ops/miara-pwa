# Wdrożenie Miary krok po kroku

Nazwy przycisków w GitHub i Vercel mogą się różnić od opisu, bo serwisy zmieniają interfejs.
Kolejność kroków się nie zmienia.

## 1. GitHub: własna kopia

1. Zrób fork repozytorium albo je sklonuj:
   ```bash
   git clone https://github.com/slashdev-ops/miara-pwa.git && cd miara-pwa
   ```
2. Przed każdym commitem sprawdź `git status`: nie może być żadnego pliku `*-kopia-*.json`.
3. W zakładce **Actions** poczekaj na zielony przebieg **CI**: składnia, poprawność JSON, test dymny.
4. W ustawieniach repozytorium włącz alerty Dependabot. Jeśli plan GitHub na to pozwala,
   dodaj regułę ochrony gałęzi `main`: zmiany przez pull request i wymagany zielony **CI**.

## 2. Vercel: publikacja

1. Zaloguj się do Vercel kontem GitHub.
2. Dodaj nowy projekt i zaimportuj swoje repozytorium. Przy instalacji integracji GitHub
   daj Vercel dostęp **tylko do tego repozytorium**.
3. Ustawienia projektu:
   - framework: brak (Other),
   - polecenie budowania: puste,
   - katalog wyjściowy: puste albo `.` (katalog główny),
   - katalog główny projektu: `./`.
4. Wdróż. Dostaniesz adres w rodzaju `miara-xxxx.vercel.app`.
5. Sprawdź nagłówki bezpieczeństwa (powinno wyjść 7 wierszy):
   ```bash
   curl -sI https://TWOJ_ADRES | grep -iE 'content-security|strict-transport|x-content-type|referrer|permissions|x-frame|x-robots'
   ```
6. Sprawdź, że pliki narzędziowe nie są publiczne (oczekiwany kod 404, dzięki `.vercelignore`):
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" https://TWOJ_ADRES/tests/smoke.js
   ```
7. Opcjonalnie podłącz własną domenę w ustawieniach domen projektu i dodaj rekord DNS, który poda Vercel.
   Certyfikat HTTPS wystawi się sam.
8. Od teraz każdy `git push` do `main` wdraża nową wersję, a pull requesty dostają osobny adres podglądu.
   Jeśli chcesz ograniczyć dostęp do adresu, sprawdź w ustawieniach projektu opcje ochrony wdrożeń.

## 3. iPhone: instalacja i dane

1. Otwórz adres aplikacji w **Safari**.
2. Udostępnij, potem **Dodaj do ekranu początkowego**. Od tej chwili otwieraj Miarę tylko z ikony:
   ikona i karta Safari mogą mieć osobną pamięć danych.
3. Przeniesienie danych z innego telefonu lub przeglądarki:
   - w starym miejscu: Ustawienia, **Zapisz kopię**, zapisz plik w Plikach na iCloud Drive,
   - w Miarze z ikony: Ustawienia, **Wybierz plik kopii z Plików**, sprawdź podgląd, **Zastąp dane**.
4. Test offline: otwórz Miarę z ikony z internetem, zamknij, włącz tryb samolotowy i otwórz ponownie.
5. Każda osoba otwiera ten sam adres na swoim telefonie i przechodzi wprowadzenie.
   Dane każdej osoby zostają na jej telefonie.

## 4. Własny serwer zamiast Vercel (alternatywa)

```bash
sudo mkdir -p /var/www/miara
sudo rsync -a --delete --exclude '.git' --exclude '.github' --exclude 'tests' --exclude 'tools' --exclude 'deploy' --exclude '*.md' --exclude '.gitignore' --exclude '.vercelignore' --exclude 'vercel.json' ./ /var/www/miara/
sudo cp deploy/nginx.conf /etc/nginx/sites-available/miara   # podmień TWOJA_DOMENA
sudo ln -s /etc/nginx/sites-available/miara /etc/nginx/sites-enabled/miara
sudo nginx -t && sudo systemctl reload nginx
```

Certyfikat: np. `sudo certbot --nginx -d TWOJA_DOMENA`. Przed `rsync --delete` sprawdź, że ścieżka docelowa to katalog aplikacji.
Konfiguracja jest zgodna z nginx 1.24 (Ubuntu 24.04) i nowszymi.

## 5. Lista kontrolna po wdrożeniu

- [ ] CI na GitHub zielone
- [ ] 7 nagłówków bezpieczeństwa w odpowiedzi
- [ ] `tests/smoke.js` niedostępny pod adresem aplikacji (404)
- [ ] ikona Miary na ekranie iPhone’a
- [ ] dane przeniesione z kopii, podgląd zgodny z liczbą dni i badań
- [ ] Miara otwiera się w trybie samolotowym
