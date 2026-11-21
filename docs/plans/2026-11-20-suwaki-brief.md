# Brief: suwaki i karta „Dziś” w prawdziwej Miarze | 20.11.2026

Zgłoszenie: „przenieś suwaki” oraz „dostosuj stronę Szybki wpis dnia; po wybraniu Dodaj w pytaniu o wagę nie widzę ostatniej wartości, tylko puste pole”.
Wzór: demo `wpisy-demo.js` (karta „Dziś” w `#demo-prosty`), zaakceptowane.

## Co zrobić
Nowy plik produkcyjny `wpisy.js` (`globalThis.WPISY`), komponent karty „Dziś” z wierszami Sen, Kroki, Waga:
- Wiersz: etykieta; wartość jako przycisk (dotknięcie → pole tekstowe w miejscu: sen „7:15”, „7,25” lub „7”; kroki liczba; waga 0,1 kg;
  Enter i utrata fokusu zatwierdza, Escape cofa, błąd → komunikat `role=alert`, stara wartość zostaje); − i + obok siebie po prawej.
- Sen: suwak 3–12 h co 15 min; Kroki: suwak 0–20 000 co 500; Waga: bez suwaka, ±0,1 z przyspieszeniem przy przytrzymaniu,
  pod nią zawsze widoczny wykres 14 dni z pasem ±0,35% wokół średniej 7 dni, dzisiejszym punktem na żywo i jednym zdaniem o wahaniu
  (Turicchi i in. 2020, PMID 32353079; „średnio w badaniu”, ten sam ton przy wzroście i spadku). Wykres tylko gdy są co najmniej 2 ważenia.
- **Wartość startowa (poprawka błędu):** dzisiejsza, jeśli jest; inaczej ostatnia zapisana (wyszarzona, podpowiedź „jak wczoraj?”, pod wartością „ostatnio: <data>”);
  dla wagi bez żadnej historii: waga z profilu `S.kg` z podpisem „z Twoich danych”; nigdy puste pole.
- Główny przycisk karty jak w demo: „Jak wczoraj” → „Zatwierdź (N)” → „✓ Zapisane · Cofnij” (5 s) → „Zobacz, co się zmieniło” (rozwija krótkie podsumowanie
  dnia w miejscu) → „Gotowe na dziś”; bez przesuwania przycisku, bez zmiany kontekstu, etykieta ogłaszana (`aria-live`).
  Po zapisie − i + zastępuje „Zmień”. „Jak wczoraj” zapisuje tylko wiersze, które mają wczorajszą (ostatnią) wartość; nigdy nie zgaduje.
- Zapis do tych samych danych co dziś: `meas.<dziś>.w`, `.sleep`, `.steps`, przez tę samą ścieżkę co obecne pola (`data-k` / funkcja zapisu w app.js),
  żeby działały reakcje zwierzaka (`weigh`, `sleepok`), toasty, `measDue`, pierwsze kroki, kopie.
- Wartości robocze przed „Zatwierdź” przeżywają przerysowanie ekranu (zmienna modułu z kluczem dnia); zmiana dnia je czyści.
- Kolejność wierszy wg pory dnia jak w demo.

## Gdzie
- **Pełny widok, Pomiary dnia:** pola wagi, snu i kroków zastępuje karta „Dziś”. Reszta Pomiarów dnia bez zmian. Identyfikatory celów nawigacji
  zostają: `m_w`, `m_sleep`, `m_steps` wskazują przycisk wartości danego wiersza (skróty „Zważ się rano”, `#dodaj-waga`, „Dodaj wpis”).
- **Prosty widok:** odkryte `waga` i `sen` pokazują tę samą kartę tylko z odkrytymi wierszami (kroki zostają w karcie „Szybki wpis dnia” jako żetony).
- `wpisy-demo.js` i jego sekcja w `#demo-prosty` znikają (komponent jest już w aplikacji); `zwierzaki-demo.js` zostaje.
- Scenariusz `prosty`: dopisz zmyśloną historię wagi z 14 dni i snu, żeby po „Dodaj” było widać ostatnią wartość i wykres. Scenariusz `wpisy`: zaktualizuj tekst `chk` do nowej karty.

## Testy (TDD, najpierw RED)
- Smoke: wartość startowa (dzisiejsza / ostatnia / z profilu, nigdy pusta); parser snu („7:15”, „7,25”, „7”, „abc”); zaokrąglanie i zakresy;
  automat stanów przycisku jako czysta funkcja; pas wahania; zapis przez „Zatwierdź” ustawia `meas.<dziś>.*` i woła `PET.react`; w prostym widoku tylko odkryte wiersze.
- Playwright: zaktualizuj istniejące testy, które zakładały stare pola (m.in. `klawiatura.spec.js`, `wpisy.spec.js`, `pola.spec.js`, scenariusz `wpisy`:
  „+ przy wadze wstawia wczorajsze”, przytrzymanie przyspiesza, sen cyframi, błąd przy złych minutach) tak, żeby sprawdzały to samo zachowanie na nowej karcie,
  nie usuwaj sprawdzanych zachowań. Nowe: `#demo-prosty` → „Dodaj” przy wadze → wiersz wagi pokazuje ostatnią wartość, nie puste pole; wykres widoczny;
  320 px bez poziomego przewijania; cele ≥ 44 px; przycisk główny bez przesunięcia; tryb jasny i ciemny.
- Pełny Playwright raz na koniec (wszystkie linie podsumowania); jeśli coś zmienisz po nim, uruchom pełny zestaw ponownie.
