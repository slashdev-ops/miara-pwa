# Etap 3 (część 1): wspólna ścieżka kilku schorzeń, kolejka celów i zwierzak z zapowiedzią zmian

Data: 10.11.2026. Decyzja użytkownika z 10.11.2026: punkty 1-5 bez czekania na tydzień używania, a do tego rozwój
zwierzaka: ma być powodem do powrotu, podawać informacje, wspierać i mówić, co się zmieni po kolejnym kroku.

## Zasady

- Bez zmian względem etapu 1: wpływ tylko z wiersza mapy powiązań ze statusem „Sprawdzone: tak”, „w tym czasie”
  zamiast „z powodu”, bez porad o lekach i dawkach.
- Zapowiedź zmiany mówi o tym, co pokazały badania („w badaniach…”) albo o tym, co zmieni się w aplikacji (etap
  zwierzaka, odznaka). Nigdy nie obiecuje wyniku zdrowotnego tej osoby.
- Sformułowanie: „wsparcie stylu życia przy opiece lekarza”.

## 1. Sygnał: migrena bez aury i tabletki z estrogenem

- Warunek: profil `mig`, brak `aura` w profilu i brak dni z aurą w dzienniku, tabletka z estrogenem.
- Treść: UKMEC 2025 (s. 63): migrena bez aury, w każdym wieku, tabletki złożone: rozpoczęcie 2, kontynuacja 3
  („ryzyko zwykle przewyższa korzyści”). Porozmawiaj z ginekologiem; nie odstawiaj tabletek bez innej antykoncepcji.
- Miejsce: nad celem w Moim dniu (`ZD.signals`, id `mig_estrogen`) i na liście „Najpierw” w Zdrowiu.
- Wiersz mapy 18.

## 2. Kolejka celów

- `ZD.done(S, id, k, ctx)`: czy tydzień celu kończący się dniem k jest zaliczony.

  | Cel | Zaliczony |
  | --- | --- |
  | `zapisy` | co najmniej 5 z 7 dni z wpisem |
  | `sen` | co najmniej 6 z 7 nocy z co najmniej 6 h |
  | `bialko` | co najmniej 5 dni z celem białka |
  | `ruch` | średnia kroków co najmniej progu z wiersza 12 (co najmniej 4 dni z krokami) |
  | `sila` | co najmniej 2 treningi siłowe w 7 dniach |
  | `bol` | w ostatnich 28 dniach mniej dni z bólem niż w 28 dniach wcześniej |
  | `waga` | nigdy (cel długoterminowy) |

- `ZD.suggest(S, k, ctx, skip)`:
  - kolejność: ból, sen, białko, ruch, siła, zapisy, waga;
  - `skip` to lista pominiętych id;
  - `bol` tylko przy profilu z migreną, gdy w 28 dniach jest co najmniej tyle dni z bólem co w 28 dniach wcześniej
    i co najmniej 1 dzień z bólem;
  - `sila` tylko przy profilu `io`, gdy w 7 dniach jest mniej niż 2 treningi siłowe.
- Po pełnym tygodniu aktywnego celu karta celu pokazuje wynik. Przy zaliczonym tygodniu dodatkowo pojawia się
  „Następny cel: X” z przyciskiem; następny to `suggest` z pominięciem bieżącego. Osoba może zostać przy obecnym celu.

## 3. Cel „Trening siłowy”

- Id `sila`, „Trening siłowy 2 razy w tygodniu”.
- Postęp: treningi z etykietą „Siłownia” albo z programu kolana (`knee`) w 7 dniach.
- Wpływ: wiersz 19 (trening siłowy poprawia działanie insuliny także bez spadku masy ciała, PMC6908414) i wiersz 13
  (ochrona mięśni przy redukcji).

## 4. Twoje schorzenia razem (Mój dzień)

- Przy co najmniej 2 schorzeniach w profilu sekcja zwinięta „Twoje schorzenia razem” pod celem.
- Kolejność rady:
  1. bezpieczeństwo;
  2. wspólne podstawy;
  3. kroki dla danego schorzenia.
- Treść tylko z istniejących pozycji Zdrowia (`planActs`): najpierw pozycje z priorytetem do 2 (bezpieczeństwo),
  potem „Razem: …” i „Stały rytm dnia”. Link „Wszystko w Zdrowiu”.

## 5. Scenariusz `#demo-wszystkie`

- Profil: Hashimoto, lipodemia, insulinooporność, migrena bez aury, Yaz.
- Dane: ból w 5 dniach bez aury, 2 treningi siłowe w tygodniu, aktywny cel `zapisy` od 8 dni (zaliczony).
- Co widać w Moim dniu:
  - sygnał UKMEC;
  - zaliczony tydzień i „Następny cel”;
  - sekcja „Twoje schorzenia razem”;
  - zwierzak z zapowiedzią.

## 6. Zwierzak: zapowiedź „Co się zmieni”

- `PET.next(st, c)` zwraca do 3 pozycji `{t}` w kolejności:
  1. cel: „Do zaliczenia celu „X” brakuje: …. W badaniach: …” (z `c.goal`, liczone w app.js przez ZD; tekst
     badania z pierwszego wpływu celu);
  2. etap: „Jeszcze N aktywnych dni (co najmniej 30 pkt) i {imię} będzie …”;
  3. najbliższa odznaka serii albo „Pierwszy tydzień”: „Jeszcze N dni z wpisem do odznaki …”.
- Nowa odznaka `cel1` „Pierwszy zaliczony cel” (kamień milowy, świętowanie jak inne).
- Karta zwierzaka w Moim dniu: pierwsza pozycja zapowiedzi pod linią nastroju.
- Ekran zwierzaka: sekcja „Co się zmieni” z całą listą.
- Przy zaliczonym tygodniu celu linia zwierzaka: „{imię} świętuje zaliczony tydzień celu.”

## Testy

- `tests/smoke.js`:
  - progi `done` każdego celu (tuż poniżej i na progu);
  - `bol` znika, gdy dni z bólem maleją;
  - `sila` tylko przy IO;
  - `skip`;
  - sygnał `mig_estrogen` (jest przy migrenie bez aury z estrogenem; nie ma przy aurze, bez estrogenu, bez migreny);
  - sekcja „razem” tylko przy 2 lub więcej schorzeniach;
  - `PET.next` (kolejność, najwyżej 3 pozycje, bez obietnic: brak słów „na pewno”, „wyleczy”);
  - odznaka `cel1`;
  - scenariusz `wszystkie` renderuje się bez błędu.
- `tests/przegladarka`: scenariusz `#demo-wszystkie` w obu silnikach i trybach: sygnał, następny cel, zapowiedź
  zwierzaka, kontrast.
