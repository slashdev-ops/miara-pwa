# Brief: „Białko za złotówkę” — jednostki w jednej linii i przykładowe ceny | 20.11.2026

Zgłoszenie: „popraw białko za złotówkę, bo jednostki spadają do nowej linii, i ustaw tam aktualne ceny proponowanych produktów jako placeholder”.

## 1. Układ
- Dziś (`app.js`, sekcja `id="bialko"`): `.field` z `flex-wrap:wrap`; przy wąskim ekranie „zł” i „g” przeskakują pod pole.
- Ma być: etykieta produktu w pierwszej linii, w drugiej dwie pary „pole + jednostka” obok siebie, każda para nierozdzielna
  (np. `<span class="pair">` z `white-space:nowrap` / `inline-flex`), pola o stałej, wystarczającej szerokości; przy 320 px bez poziomego przewijania,
  jednostka nigdy nie oddzielona od pola. Rozważ wiersze wartości z `wpisy.js` tylko jeśli to prostsze — nie jest wymagane.
- Test Playwright 320 i 390 px, jasny i ciemny: dla każdego produktu jednostka „zł” w tej samej linii co pole ceny (ta sama wartość `top` ±2 px), „g” obok pola wagi.

## 2. Przykładowe ceny (placeholder, nie zapisywane)
Źródło: sklep internetowy dużej sieci, strony produktów otwarte 20.11.2026 (identyfikatory ofert wskazują 18-19.11.2026); ceny regularne (bez promocji),
gdzie strona je podaje. W aplikacji i repozytorium **bez nazwy sklepu i bez marek produktów**.

| Produkt (`PROT` id) | Przykład | Opakowanie |
|---|---|---|
| twarog | 5,88 zł | 250 g |
| jajka | 16,99 zł | 10 szt. (ok. 600 g) |
| skyr | 6,89 zł | 300 g |
| kurczak | 44,88 zł | 1 kg (przeliczone z ceny za kilogram podanej na stronie) |
| tofu | 5,49 zł | 180 g |
| soczewica, tunczyk, wpc | brak sprawdzonej ceny — bez przykładu | — |

- Pod nazwą produktu krótka podpowiedź: „np. 5,88 zł za 250 g (listopad 2026)”. W polu ceny placeholder z liczbą (np. „5,88”) tylko wtedy,
  gdy domyślna waga opakowania produktu jest równa wadze z przykładu; inaczej placeholder „cena”.
- Pod listą jedno zdanie: „Przykładowe ceny regularne ze sklepu internetowego dużej sieci, listopad 2026. Wpisz cenę ze swojego sklepu.”
- Ranking liczy się tylko z wpisanych cen (placeholder nie wchodzi do obliczeń).
- Dane przykładów w jednym miejscu w kodzie (np. pole w `PROT` albo osobna stała z datą), łatwe do aktualizacji.

## Testy i zasady
TDD (RED → GREEN), smoke 0 BLAD (m.in. placeholder nie trafia do `S.prices`, ranking pusty bez wpisów, brak nazw sklepów i marek w tekstach).
