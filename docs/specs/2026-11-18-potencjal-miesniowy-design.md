# Potencjał mięśniowy (warianty B i C) | projekt | 18.11.2026

## Po co
Osoba trenująca siłowo chce wiedzieć, gdzie jest z masą mięśniową względem pułapu opisanego w badaniach i ile jej do niego brakuje,
na danych, które wpisuje (FFM i tłuszcz ze składu ciała, wzrost, nadgarstek, kostka). Informacja, nie cel: pułap to granica z badań, nie zalecenie.

## Wybór podejścia (18.11.2026): B i C
- B: pułap FFMI 25 u mężczyzn bez sterydów (Kouri 1995).
- C: maksymalna beztłuszczowa masa ciała z nadgarstka i kostki (Casey Butt).
- Odrzucone teraz: maksymalne obwody poszczególnych części ciała (ramię, klatka, udo, łydka, szyja) i rysunek sylwetki maksymalnej:
  wzory obwodów nie mają działającego źródła (strona autora zrywa połączenie, kalkulator blokuje roboty, wersje wtórne są sprzeczne).
  Rysunek bez wzorów obwodów byłby wymyślony.

## Źródła (otwarte 18.11.2026)
- Kouri EM i in., Clin J Sport Med 1995;5(4):223-8, PMID 7496846 (abstrakt przez PubMed E-utilities): 157 mężczyzn; FFMI = FFM / wzrost²,
  korekta „6.3 x (1.80 m - height)”; u osób bez sterydów „up to a well-defined limit of 25.0”.
- Wzór Butta z kalkulatora weighttraining.nz (strona przypisuje wzór „Dr Casey Butt”; strona autora weightrainer.net niedostępna):
  M = H^1,5 × (√W ÷ 322,4 + √A ÷ 241,9) × (F ÷ 224 + 1), M w kg, H, W, A w cm, F = % tłuszczu; realnie „95% of the calculated maximum”.
  Oznaczenie w aplikacji: „wzór przepisany przez kalkulator, strona autora niedostępna”.
- Mediana FFMI 18-34 lat (wiersz 42 mapy) jako punkt odniesienia już w Miarze.

## Zakres
- Nowe pola, wpisywane raz (w zwijanej sekcji obwodów): nadgarstek i kostka w cm, `S.frame={wrist:'',ankle:''}`; opis pomiaru:
  „najwęższe miejsce” (bez cytatu z oficjalnej instrukcji, bo jej nie mamy: tekst jako wskazówka Miary).
- Karta „Potencjał mięśniowy” w Zdrowiu, pod składem ciała. Pokazuje się mężczyznom z ostatnim FFM, wzrostem (nie startowym) i tłuszczem;
  dla wariantu C dodatkowo nadgarstek i kostka. Kobiety: jedno zdanie, że oba modele opisano tylko u mężczyzn, i odesłanie do FFMI względem mediany.
- Wyliczenia: FFMI znormalizowane teraz; FFM przy pułapie Kouri = (25 − 6,3 × (1,8 − h)) × h²; M Butta przy obecnym % tłuszczu i 95% M;
  odległość w kg i w % dla każdego.
- Wykres: jedna pozioma oś FFM w kg ze znacznikami: teraz, mediana 18-34 lat, pułap Kouri, 95% M i M Butta; bez kolorów alarmowych;
  pod osią lista tekstowa tych samych liczb (czytnik ekranu, WCAG 1.1.1); paleta i kontrast przez walidator dataviz, tryb jasny i ciemny.
- Język: „pułap opisany w badaniach mężczyzn trenujących bez dopingu”, „nie cel”, „model z kulturystyki, nie wytyczna”.
- Dane: `frame` jest daną o ciele, więc poza kopią bez danych o zdrowiu (`NH_DROP`). Mapa powiązań: wiersze 45 (Kouri) i 46 (Butt, źródło wtórne).

## Poza zakresem
Obwody maksymalne i rysunek sylwetki maksymalnej (czekają na tekst Butta); model dla kobiet (nie ma opublikowanego); zmiana „Dużo mięśni”.

## Testy
Smoke: wzory na zmyślonych wartościach (wyniki liczone niezależnie), brak karty dla kobiet, przy wzroście startowym i bez FFM, brak C bez nadgarstka
lub kostki, `frame` w `NH_DROP`. Playwright: karta przy 320 px bez przewijania w poziomie, lista tekstowa obecna, tryb ciemny.
