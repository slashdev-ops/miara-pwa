# Brief: kafelki wyboru zamiast pigułek | 20.11.2026

Zgłoszenie: opcje wyboru w kształcie pigułek (np. Spokój, Radość, Zapis!, Seria) „słabo wyglądają, kształty nie są praktyczne”.
Zaakceptowane: kafelki w równej siatce; wybrana opcja = wypełnienie + wewnętrzny obrys 2 px + pogrubiony napis, bez ✓ i bez zmiany rozmiaru.

## Zakres
- Wszystkie wybory „jedno z kilku” i przełączniki-żetony (`.chip`, `seg(...)`, `data-lite`, nastroje galerii, rodzaj zwierzaka, tydzień cyklu,
  skale 0–10 nogi/brzuch, wybory w Ustawieniach). Przyciski działań (`.btn`) bez zmian.
- Układ: siatka równych kolumn; 2–4 opcje w jednym rzędzie; 5–6 opcji: rzędy po 3; skale 0–10: rzędy po 6 i 5 (ta sama szerokość kafelka);
  nigdy nierówne łamanie. Przy 320 px tekst w jednej linii albo zawijany w obrębie kafelka (bez wychodzenia poza kafelek, bez poziomego przewijania).
- Kształt: `border-radius: var(--r-s)` (12 px); wysokość ≥ 48 px; cała powierzchnia kafelka klikalna.
- Wybrany: tło `--green`, napis `--on-green` pogrubiony, wewnętrzny obrys 2 px (`box-shadow: inset 0 0 0 2px …` z tokenu kontrastowego);
  szerokość pogrubionego napisu zarezerwowana (np. pseudo-element z pogrubioną kopią napisu o zerowej wysokości), żeby nic nie skakało.
- Niewybrany: tło `--surface`, obrys 1 px `--line`. Fokus klawiatury widoczny i odróżnialny od wyboru.
- `aria-pressed` / `role="radio"` bez zmian semantyki.

## Testy
- Smoke: strażnik „pigułka tylko dla chipów” → „brak `var(--pill)` w regułach wyboru” (pigułka może zostać tylko tam, gdzie nie jest wyborem, jeśli takie miejsce istnieje — wypisz je w raporcie);
  strażnik 5 zaokrągleń i 8 rozmiarów pisma dalej przechodzi.
- Playwright: dla kart z wyborami przy 320 px i 390 px (jasny, ciemny): kafelki w jednym rzędzie mają równą szerokość (±1 px), żaden napis nie wychodzi poza kafelek
  (scrollWidth ≤ clientWidth), wysokość ≥ 48 px, przełączenie wyboru nie zmienia rozmiaru kafelka (boundingBox przed i po), wybrany ma obrys inset.
- Pełny Playwright na koniec, wszystkie linie podsumowania.
