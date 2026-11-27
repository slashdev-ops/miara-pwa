// ---------- Dane: produkty (wartości na 100 g, orientacyjne, typowe wartości z tabel) ----------
// Błonnik (fib, g/100 g): duńska baza Frida 6.1 (DTU, CC BY 4.0), hummus z CoFID 2021; mieszanka warzyw bez wartości w obu tabelach.
// Frida FoodID: kurczak_piers 907, kurczak_udko 882, indyk_piers 732, indyk_miel 1613, dorsz 72, losos 30, makrela 1220, tunczyk 825, jajko 1663, twarog 1678, skyr 1693, jogurt 1597, mleko 33, tofu 272, soczewica 1799, ciecierzyca 1812, fasola 1810, kasza_gr 67, bulgur 283, jaglana 385, kasza_jecz 1730, ryz 156, ziemniaki 4, bataty 714, platki 480, chleb 379, makaron 377, brokul 17, fasolka 764, szpinak 50, kapusta 26, papryka 38, pomidor 52, pom_puszka 596, ogorek 388, cukinia 56, cebula 716, marchew 24, pieczarki 961, rzodkiewka 39, oliwa 1467, orzechy 647, siemie 149, maslo_orz 1162, hummus CoFID 13-556, owoce 1831, jablko 2, banan 3, mandarynka 560
const ING={
  kurczak_piers:{n:'Pierś z kurczaka',k:110,p:23,f:1.5,c:0,fib:0,chip:'Kurczak'},
  kurczak_udko:{n:'Udko z kurczaka bez skóry',k:130,p:19,f:6,c:0,fib:0,chip:'Kurczak'},
  indyk_piers:{n:'Pierś z indyka',k:105,p:23,f:1,c:0,fib:0,chip:'Indyk'},
  indyk_miel:{n:'Mięso mielone z indyka',k:150,p:19,f:8,c:0,fib:0,chip:'Indyk'},
  dorsz:{n:'Dorsz lub mintaj',k:78,p:18,f:0.7,c:0,fib:0,chip:'Ryba'},
  losos:{n:'Łosoś',k:200,p:20,f:13,c:0,fib:0,chip:'Ryba'},
  makrela:{n:'Makrela wędzona',k:220,p:21,f:15,c:0,fib:0,chip:'Ryba'},
  tunczyk:{n:'Tuńczyk w sosie własnym',k:110,p:25,f:1,c:0,fib:0,chip:'Ryba'},
  jajko:{n:'Jajka (1 szt. ok. 60 g)',k:140,p:12.5,f:10,c:0.7,fib:0,chip:'Jajka'},
  twarog:{n:'Twaróg półtłusty',k:130,p:18,f:4.5,c:3.5,fib:0,chip:'Twaróg'},
  skyr:{n:'Skyr naturalny',k:63,p:11,f:0.2,c:4,fib:0,chip:'Skyr lub jogurt'},
  jogurt:{n:'Jogurt naturalny 2%',k:60,p:4.3,f:2,c:6,fib:0,chip:'Skyr lub jogurt'},
  mleko:{n:'Mleko 2%',k:50,p:3.3,f:2,c:4.8,fib:0},
  tofu:{n:'Tofu naturalne',k:120,p:12,f:7,c:2,fib:2.5,chip:'Tofu'},
  soczewica:{n:'Soczewica czerwona (sucha)',k:340,p:24,f:1.5,c:50,fib:18.5,chip:'Strączki'},
  ciecierzyca:{n:'Ciecierzyca z puszki (odsączona)',k:120,p:7,f:2.5,c:15,fib:7.8,chip:'Strączki'},
  fasola:{n:'Fasola czerwona z puszki (odsączona)',k:100,p:7,f:0.5,c:14,fib:8.0,chip:'Strączki'},
  kasza_gr:{n:'Kasza gryczana niepalona, jasna (sucha)',k:340,p:13,f:3,c:62,fib:5.8,chip:'Kasza'},
  bulgur:{n:'Kasza bulgur (sucha)',k:340,p:12,f:1.3,c:64,fib:9.9,chip:'Kasza'},
  jaglana:{n:'Kasza jaglana (sucha)',k:350,p:11,f:3,c:68,fib:2.6,chip:'Kasza'},
  kasza_jecz:{n:'Kasza jęczmienna (sucha)',k:330,p:9,f:2,c:68,fib:13.4,chip:'Kasza'},
  ryz:{n:'Ryż brązowy (suchy)',k:360,p:7.5,f:2.7,c:73,fib:4.2,chip:'Ryż'},
  ziemniaki:{n:'Ziemniaki',k:77,p:2,f:0.1,c:17,fib:1.4,chip:'Ziemniaki lub bataty'},
  bataty:{n:'Bataty',k:86,p:1.6,f:0.1,c:20,fib:2.7,chip:'Ziemniaki lub bataty'},
  platki:{n:'Płatki owsiane',k:370,p:13,f:7,c:58,fib:10.3,chip:'Płatki owsiane'},
  chleb:{n:'Chleb żytni razowy',k:220,p:6,f:1.5,c:42,fib:8.4,chip:'Pieczywo'},
  makaron:{n:'Makaron pełnoziarnisty (suchy)',k:350,p:13,f:2.5,c:63,fib:9.6,chip:'Makaron'},
  warzywa:{n:'Mieszanka warzyw (mrożona)',k:40,p:2.5,f:0.3,c:6},
  brokul:{n:'Brokuł',k:34,p:2.8,f:0.4,c:5,fib:3.2},
  fasolka:{n:'Fasolka szparagowa',k:31,p:1.8,f:0.2,c:5,fib:3.0},
  szpinak:{n:'Szpinak',k:23,p:2.9,f:0.4,c:1.4,fib:1.9},
  kapusta:{n:'Kapusta biała',k:25,p:1.3,f:0.1,c:4.5,fib:2.3},
  papryka:{n:'Papryka',k:30,p:1,f:0.3,c:5,fib:1.7},
  pomidor:{n:'Pomidor',k:18,p:0.9,f:0.2,c:3,fib:1.4},
  pom_puszka:{n:'Pomidory krojone z puszki',k:22,p:1.2,f:0.2,c:3.5,fib:0.9},
  ogorek:{n:'Ogórek',k:15,p:0.7,f:0.1,c:3,fib:0.8},
  cukinia:{n:'Cukinia',k:17,p:1.2,f:0.3,c:2.7,fib:1.2},
  cebula:{n:'Cebula',k:40,p:1.1,f:0.1,c:8,fib:1.9},
  marchew:{n:'Marchew',k:41,p:0.9,f:0.2,c:8,fib:2.9},
  pieczarki:{n:'Pieczarki',k:22,p:3.1,f:0.3,c:3.3,fib:0.8},
  rzodkiewka:{n:'Rzodkiewka',k:16,p:0.7,f:0.1,c:3.4,fib:1.3},
  oliwa:{n:'Oliwa lub olej rzepakowy',k:884,p:0,f:100,c:0,fib:0},
  orzechy:{n:'Orzechy włoskie',k:650,p:15,f:65,c:7,fib:7.0},
  siemie:{n:'Siemię lniane mielone',k:534,p:18,f:42,c:2,fib:30.4},
  maslo_orz:{n:'Masło orzechowe 100%',k:600,p:25,f:50,c:12,fib:7.6},
  hummus:{n:'Hummus',k:200,p:7,f:15,c:9,fib:4.9},
  owoce:{n:'Owoce leśne (mrożone)',k:45,p:0.8,f:0.4,c:9,fib:3.4},
  jablko:{n:'Jabłko',k:52,p:0.3,f:0.2,c:12,fib:2.2},
  banan:{n:'Banan',k:89,p:1.1,f:0.3,c:21,fib:1.6},
  mandarynka:{n:'Mandarynka',k:53,p:0.8,f:0.3,c:13,fib:1.4}
};

// ---------- Dane: posiłki. Trzeci element 1 = źródło węglowodanów, skalowane pod trening ----------
const MEALS=[
  {id:'o1',t:'obiad',n:'Udko z kurczaka, kasza gryczana i pieczone warzywa',min:15,prep:1,ing:[['kurczak_udko',150],['kasza_gr',60,1],['warzywa',250],['oliwa',8]],how:'Udka i warzywa z blachy z zapasu, kasza z zapasu. Podgrzać w mikrofali 2-3 min. Kasza niepalona ma łagodniejszy smak niż palona; przed gotowaniem wypłukać ją na sicie.'},
  {id:'o2',t:'obiad',n:'Pulpety z indyka w sosie pomidorowym z ryżem',min:30,prep:1,ing:[['indyk_miel',150],['pom_puszka',200],['cebula',50],['ryz',60,1],['oliwa',5]],how:'Pulpety ułożyć w naczyniu żaroodpornym, zalać pomidorami z cebulą, piec 25 min w 190°C. Ryż z mikrofali.'},
  {id:'o3',t:'obiad',n:'Gulasz z czerwonej soczewicy ze skyrem',min:25,prep:1,ing:[['soczewica',70],['pom_puszka',200],['marchew',80],['cebula',50],['oliwa',8],['skyr',80],['chleb',40,1]],how:'Soczewicę, startą marchew, cebulę, pomidory i 300 ml wody w dużej misce do mikrofali, pod przykryciem 15-18 min, mieszając co 5 min. Podać z łyżką skyru.'},
  {id:'o4',t:'obiad',n:'Pieczony dorsz, ziemniaki i fasolka szparagowa',min:25,ing:[['dorsz',200],['ziemniaki',200,1],['fasolka',200],['oliwa',8]],how:'Ziemniaki w ćwiartkach piec 30 min w 200°C, dorsza z ziołami i fasolkę dołożyć na ostatnie 15 min.'},
  {id:'o5',t:'obiad',n:'Łosoś z batatami i brokułem',min:30,ing:[['losos',130],['bataty',200,1],['brokul',200]],how:'Bataty w kostce piec 25 min w 200°C, łososia dołożyć na ostatnie 12 min. Brokuł w mikrofali z 2 łyżkami wody, pod przykryciem 4 min.'},
  {id:'o6',t:'obiad',n:'Makaron pełnoziarnisty z tuńczykiem, cukinią i pomidorami',min:20,ing:[['makaron',70,1],['tunczyk',120],['pom_puszka',200],['cukinia',150],['oliwa',5]],how:'Makaron w misce zalać wodą o 3 cm ponad poziom, mikrofala 10-12 min z mieszaniem, odcedzić. Cukinię z pomidorami podgrzać 5 min, dodać tuńczyka i makaron.'},
  {id:'o7',t:'obiad',n:'Tofu z warzywami z patelni i ryżem',min:20,ing:[['tofu',180],['warzywa',250],['ryz',60,1],['oliwa',8]],how:'Tofu w kostce i mrożone warzywa wymieszać z olejem, czosnkiem i imbirem, piec 25 min w 210°C. Ryż z mikrofali.'},
  {id:'o8',t:'obiad',n:'Leczo z kurczakiem i kaszą jęczmienną',min:30,prep:1,ing:[['kurczak_piers',150],['papryka',150],['cukinia',150],['pom_puszka',150],['cebula',50],['kasza_jecz',50,1],['oliwa',8]],how:'Kurczaka, warzywa i pomidory z papryką słodką piec pod przykryciem 30 min w 190°C. Kasza z mikrofali.'},
  {id:'o9',t:'obiad',n:'Chili z indykiem i fasolą',min:30,prep:1,ing:[['indyk_miel',120],['fasola',120],['pom_puszka',200],['papryka',100],['cebula',50],['ryz',50,1]],how:'Mięso rozdrobnić w naczyniu żaroodpornym z cebulą, papryką, pomidorami, fasolą i kminem, piec 35 min w 190°C, raz przemieszać.'},
  {id:'o10',t:'obiad',n:'Sałatka z ciecierzycą, jajkiem i warzywami',min:10,ing:[['jajko',120],['ciecierzyca',120],['ogorek',100],['papryka',100],['pomidor',100],['oliwa',10],['chleb',40,1]],how:'Jajka na twardo z zapasu (z piekarnika, w foremce do muffinek ok. 30 min w 160°C), warzywa pokroić, wymieszać z ciecierzycą i oliwą.'},
  {id:'o11',t:'obiad',n:'Omlet ze szpinakiem i papryką z ziemniakami',min:20,ing:[['jajko',180],['szpinak',100],['papryka',80],['ziemniaki',200,1],['oliwa',5]],how:'Ziemniaki w plastrach piec 20 min w 200°C, zalać jajkami roztrzepanymi ze szpinakiem i papryką, piec kolejne 15 min.'},
  {id:'o12',t:'obiad',n:'Kurczak curry z ciecierzycą i szpinakiem',min:25,ing:[['kurczak_piers',130],['ciecierzyca',80],['pom_puszka',150],['jogurt',80],['szpinak',100],['ryz',50,1]],how:'Kurczaka z curry, pomidorami, ciecierzycą i szpinakiem piec pod przykryciem 30 min w 190°C. Jogurt wmieszać po wyjęciu.'},
  {id:'o13',t:'obiad',n:'Makrela, ziemniaki i surówka z kapusty',min:20,ing:[['makrela',100],['ziemniaki',200,1],['kapusta',150],['marchew',50]],how:'Ziemniaki w misce z 3 łyżkami wody, mikrofala pod przykryciem 8-10 min. Kapustę i marchew zetrzeć, skropić octem jabłkowym.'},
  {id:'o14',t:'obiad',n:'Ziemniaki z twarożkiem i ogórkiem',min:20,ing:[['twarog',200],['jogurt',50],['ziemniaki',250,1],['ogorek',150]],how:'Ziemniaki w misce z 3 łyżkami wody, mikrofala pod przykryciem 8-10 min. Twaróg wymieszać z jogurtem, szczypiorkiem i koperkiem.'},
  {id:'o15',t:'obiad',n:'Kasza jęczmienna z kurczakiem i pieczarkami',min:25,ing:[['kurczak_piers',150],['pieczarki',150],['cebula',50],['kasza_jecz',60,1],['jogurt',50],['oliwa',8]],how:'Kurczaka, pieczarki i cebulę piec 25 min w 200°C, wymieszać z kaszą z mikrofali i jogurtem.'},
  {id:'o16',t:'obiad',n:'Indyk z cukinią i kaszą gryczaną',min:20,ing:[['indyk_piers',150],['cukinia',200],['kasza_gr',60,1],['oliwa',8]],how:'Indyka w paskach i cukinię z ziołami piec 20 min w 210°C. Kasza z mikrofali.'},
  {id:'s1',sw:1,t:'sniadanie',n:'Owsianka białkowa z owocami leśnymi',min:7,ing:[['platki',50,1],['mleko',200],['skyr',150],['owoce',100],['orzechy',10]],how:'Płatki z mlekiem w dużym kubku do mikrofali, 2 min z przerwą na zamieszanie, potem wmieszać skyr, owoce i orzechy.'},
  {id:'s2',t:'sniadanie',n:'Jajecznica ze szpinakiem i chlebem żytnim',min:10,ing:[['jajko',180],['szpinak',100],['chleb',50,1],['pomidor',100],['oliwa',3]],how:'Jajka roztrzepać ze szpinakiem w misce, mikrofala 2-3 min, mieszając co 30 s.'},
  {id:'s3',sw:1,t:'sniadanie',n:'Miska skyru z płatkami, siemieniem i jabłkiem',min:3,ing:[['skyr',300],['platki',30,1],['siemie',10],['jablko',120]],how:'Wymieszać w misce. Można przygotować wieczorem.'},
  {id:'s4',t:'sniadanie',n:'Kanapki z twarożkiem i warzywami',min:5,ing:[['chleb',80,1],['twarog',150],['papryka',100],['ogorek',100]],how:'Twaróg z ziołami na chleb, warzywa obok.'},
  {id:'s5',sw:1,t:'sniadanie',n:'Muffinki owsiane z jogurtem',min:15,ing:[['platki',50,1],['jajko',120],['banan',60],['jogurt',100]],how:'Płatki, jajka i banan zmiksować blenderem, przelać do foremek na muffinki, piec 18-20 min w 180°C. Starcza na 3 dni.'},
  {id:'k1',t:'kolacja',n:'Twarożek z rzodkiewką i chlebem żytnim',min:5,ing:[['twarog',200],['rzodkiewka',80],['chleb',40,1]],how:'Twaróg ze szczypiorkiem, rzodkiewka w plastrach.'},
  {id:'k2',t:'kolacja',n:'Sałatka z tuńczykiem i fasolą',min:7,ing:[['tunczyk',120],['fasola',80],['ogorek',100],['pomidor',100],['oliwa',8]],how:'Wymieszać, doprawić cytryną i pieprzem.'},
  {id:'k3',t:'kolacja',n:'Omlet z warzywami',min:12,ing:[['jajko',180],['warzywa',150],['oliwa',5],['chleb',30,1]],how:'Warzywa i roztrzepane jajka w misce, mikrofala 3 min, mieszając co minutę.'},
  {id:'k4',t:'kolacja',n:'Pasta z makreli i jajka na chlebie',min:7,ing:[['makrela',70],['jajko',60],['jogurt',30],['chleb',60,1],['ogorek',100]],how:'Makrelę bez ości rozgnieść z jajkiem i jogurtem, dodać szczypiorek.'},
  {id:'k5',t:'kolacja',n:'Tofu z warzywami z patelni',min:15,ing:[['tofu',150],['warzywa',200],['oliwa',5]],how:'Tofu i warzywa z czosnkiem piec 25 min w 210°C.'},
  {id:'p1',sw:1,t:'przekaska',n:'Skyr z owocami leśnymi',min:2,ing:[['skyr',150],['owoce',100]],how:'Owoce rozmrozić w mikrofali albo dodać zamrożone.'},
  {id:'p2',t:'przekaska',n:'Jajka na twardo i ogórek',min:1,ing:[['jajko',120],['ogorek',150]],how:'Z zapasu w lodówce.'},
  {id:'p3',t:'przekaska',n:'Marchewka z hummusem',min:3,ing:[['marchew',150],['hummus',50]],how:'Marchew w słupki.'},
  {id:'p4',sw:1,t:'przekaska',n:'Jabłko z masłem orzechowym',min:2,ing:[['jablko',150],['maslo_orz',15]],how:'Jabłko w ćwiartkach, łyżka masła orzechowego.'},
  {id:'p5',t:'przekaska',n:'Orzechy i mandarynka',min:1,ing:[['orzechy',20],['mandarynka',100]],how:'Odliczona garść, nie z całej paczki.'},
  {id:'o17',t:'obiad',n:'Zupa krem z soczewicy i marchewki z jajkiem',min:25,ing:[['soczewica',60],['marchew',200],['cebula',50],['oliwa',8],['jajko',60],['chleb',40,1]],how:'Soczewicę, marchew i cebulę w plastrach zalać 600 ml wody w dużej misce, mikrofala pod przykryciem 18-20 min, zmiksować blenderem. Jajko na twardo z zapasu.'},
  {id:'o18',t:'obiad',n:'Bulgur z pieczonym kurczakiem i papryką',min:30,ing:[['kurczak_piers',150],['papryka',200],['cebula',50],['bulgur',60,1],['jogurt',50],['oliwa',8]],how:'Kurczaka, paprykę i cebulę piec 25 min w 200°C. Bulgur zalać podwójną ilością wrzątku z mikrofali i przykryć na 15 min.'},
  {id:'s6',sw:1,t:'sniadanie',n:'Jaglanka z jabłkiem, cynamonem i skyrem',min:12,ing:[['jaglana',40,1],['mleko',250],['jablko',120],['skyr',150]],how:'Kaszę przelać wrzątkiem na sicie (usuwa gorycz), z mlekiem do mikrofali na 8-10 min, mieszając co 2 min. Dodać starte jabłko, cynamon i skyr.'},
  {id:'o19',t:'obiad',n:'Kurczak z papryką, cukinią i kaszą gryczaną',min:20,ing:[['kurczak_piers',150],['papryka',150],['cukinia',150],['kasza_gr',40,1],['oliwa',8]],how:'Kurczaka i warzywa w kostce wymieszać z oliwą i przyprawami, piec 18 min w 220°C. Kasza z mikrofali albo z zapasu.'},
  {id:'o20',t:'obiad',n:'Sałatka z tuńczykiem, fasolą i chlebem żytnim',min:10,ing:[['tunczyk',120],['fasola',100],['pomidor',150],['ogorek',100],['chleb',40,1],['oliwa',8]],how:'Fasolę z puszki opłukać, wymieszać z tuńczykiem, pomidorem, ogórkiem i oliwą z cytryną. Chleb obok.'},
  {id:'o21',t:'obiad',n:'Dorsz z batatami i brokułem',min:30,ing:[['dorsz',200],['bataty',150,1],['brokul',200],['oliwa',8]],how:'Bataty w kostce piec 15 min w 200°C, dołożyć dorsza z oliwą i ziołami, piec kolejne 15 min. Brokuł w mikrofali z 2 łyżkami wody, 4 min.'},
  {id:'s7',sw:1,t:'sniadanie',n:'Pieczone placuszki twarogowe z jabłkiem i cynamonem',min:20,ing:[['twarog',150],['jajko',60],['platki',30,1],['jablko',100]],how:'Twaróg, jajko i płatki rozgnieść widelcem, dodać starte jabłko i cynamon. Łyżką nakładać małe placki na blachę z papierem do pieczenia, piec 15 min w 190°C. Słodycz daje jabłko, bez cukru.'},
  {id:'s8',sw:1,t:'sniadanie',n:'Twarożek waniliowy z owocami i orzechami',min:3,ing:[['twarog',200],['owoce',150],['orzechy',10]],how:'Twaróg rozetrzeć z łyżką mleka i kilkoma kroplami aromatu waniliowego, na wierzch owoce i posiekane orzechy. Bez cukru: słodycz dają owoce.'},
  {id:'s9',sw:1,t:'sniadanie',n:'Owsianka nocna z jabłkiem i cynamonem',min:5,ing:[['platki',40,1],['skyr',150],['mleko',100],['jablko',100],['orzechy',10]],how:'Wieczorem wymieszać w słoiku płatki, skyr, mleko i starte jabłko z cynamonem, rano posypać orzechami. Na zimno albo 1 min w mikrofali.'},
  {id:'p6',sw:1,t:'przekaska',n:'Koktajl ze skyru, owoców i płatków',min:3,ing:[['skyr',200],['owoce',100],['platki',20,1]],how:'Zmiksować blenderem z odrobiną wody.'}
];

// ---------- Dane: aktywności. MET z Compendium; "niesprawdzone" = wartość nie weryfikowana ze źródłem ----------
const SRC_2024='Compendium 2024';
const ACT={
  silownia:{label:'Siłownia',note:'Compendium nie rozróżnia partii mięśniowych. Plecy, klatka i ramiona mają tę samą wartość dla treningu 8-15 powtórzeń; nogi z przysiadem i martwym ciągiem mają wyższą.',opts:[
    {id:'nogi',n:'Nogi i pośladki (przysiad, martwy ciąg, hip thrust)',met:5.0,src:SRC_2024+', kod 02052',knee:'Przysiad tylko w zakresie bez bólu, bez wykroków i głębokich zgięć przy bólu lub urazie kolana.'},
    {id:'plecy',n:'Plecy (wiosłowanie, ściąganie drążka)',met:3.5,src:SRC_2024+', kod 02054'},
    {id:'klatka',n:'Klatka i barki (wyciskanie)',met:3.5,src:SRC_2024+', kod 02054'},
    {id:'ramiona',n:'Ramiona (biceps, triceps)',met:3.5,src:SRC_2024+', kod 02054'},
    {id:'fbw',n:'Całe ciało (FBW), 8-15 powtórzeń',met:3.5,src:SRC_2024+', kod 02054'},
    {id:'obwod',n:'Obwód, superserie z krótkimi przerwami',met:5.8,src:SRC_2024+', kod 02055'},
    {id:'mix',n:'Siły i cardio w jednej wizycie',met:5.0,src:SRC_2024+', kod 02061'}
  ]},
  plywanie:{label:'Pływanie',note:'Wartości dla pływania pochodzą z wiedzy ogólnej (Compendium 2011) i nie były sprawdzane ze źródłem.',opts:[
    {id:'kraul1',n:'Kraul, wolno lub umiarkowanie',met:5.8,src:'Compendium 2011, niesprawdzone'},
    {id:'kraul2',n:'Kraul, szybko',met:9.8,src:'Compendium 2011, niesprawdzone'},
    {id:'grzbiet',n:'Grzbietowy',met:4.8,src:'Compendium 2011, niesprawdzone'},
    {id:'zabka',n:'Żabka',met:5.3,src:'Compendium 2011, niesprawdzone',knee:'Kopnięcie żabką obciąża kolano skrętnie. Przy podejrzeniu uszkodzenia łąkotki lepiej kraul lub grzbiet.'},
    {id:'rekr',n:'Pływanie rekreacyjne',met:6.0,src:'Compendium 2011, niesprawdzone'},
    {id:'aqua',n:'Aqua aerobik',met:5.5,src:'Compendium 2011, niesprawdzone'}
  ]},
  inne:{label:'Inne',opts:[
    {id:'nordic',n:'Nordic walking',met:4.8,src:'Compendium 2011, niesprawdzone'},
    {id:'orbitrek',n:'Orbitrek, umiarkowanie',met:5.0,src:'Compendium 2011, niesprawdzone'},
    {id:'wioslarz',n:'Ergometr wioślarski, ok. 100 W',met:7.0,src:'Compendium 2011, kod 02072'},
    {id:'obwod_mc',n:'Obwód z masą ciała',met:6.0,src:SRC_2024+', kod 02032'},
    {id:'joga',n:'Joga hatha',met:2.3,src:SRC_2024+', kod 02150'}
  ]}
};
const SPIN=[
  {id:'spin',n:'Zajęcia spinning (RPM)',met:9.0,src:SRC_2024+', kod 01270'},
  {id:'virt',n:'Rower z ekranem, trening wirtualny',met:8.8,src:SRC_2024+', kod 01290'},
  {id:'hiit',n:'Interwały na rowerze',met:8.8,src:SRC_2024+', kod 01305'}
];

// ---------- Plan tygodnia: stały jadłospis, mniej decyzji ----------
// Dwa rytmy: w dni robocze obiad do 20 min, w sobotę i niedzielę jedno większe danie
const PLAN={1:['s1','o1','k1','p2'],2:['s2','o6','k4','p1'],3:['s3','o16','k2','p5'],4:['s1','o14','k3','p3'],5:['s4','o7','k1','p6'],6:['s2','o9','k2','p4'],0:['s5','o5','k5','p1']};
const SLOT_T={sniadanie:'Śniadanie',obiad:'Obiad',kolacja:'Kolacja',przekaska:'Przekąska'};
function slotNow(){const h=new Date().getHours();return h<11?'sniadanie':h<18?'obiad':'kolacja'}
function targetKcal(){const R=rmr(),M=measuredTdee(),f=S.mode==='utrzymanie'?1:S.mode==='masa'?1.1:0.8;if(M)return Math.max(R,M.tdee*f);return Math.max(R,(R*1.3+trainNet())*f)}
// Klucz dnia i dni temu: dni kalendarza od dzisiejszego południa, nie co 24 h od teraz (przy zmianie czasu dzień się powtarzał albo znikał)
function keyAgo(i){const d=new Date(Date.now());d.setHours(12,0,0,0);d.setDate(d.getDate()-i);return keyOf(d)}
function lastKeys(n){const a=[];for(let i=0;i<n;i++)a.push(keyAgo(i));return a}
function measuredTdee(){
  const ks=lastKeys(28).reverse(),W=[],I=[];
  ks.forEach((k,i)=>{const m=(S.meas||{})[k];if(m&&num(m.w)>0&&!measCp(m,'w'))W.push([i,num(m.w)]);const ms=(S.days[k]||[]).filter(e=>e.kind==='m');if(ms.length>=3)I.push(ms.reduce((a,e)=>a+e.k,0))});
  if(W.length<6||I.length<10||W[W.length-1][0]-W[0][0]<14)return null;
  const n=W.length,mx=W.reduce((a,p)=>a+p[0],0)/n,my=W.reduce((a,p)=>a+p[1],0)/n;
  const slope=W.reduce((a,p)=>a+(p[0]-mx)*(p[1]-my),0)/W.reduce((a,p)=>a+(p[0]-mx)**2,0);
  const avgI=I.reduce((a,b)=>a+b,0)/I.length;
  return {tdee:avgI-slope*7700,slope,nW:n,nI:I.length,avgI};
}
function dataGap(){let w=0,i=0;lastKeys(28).forEach(k=>{const m=(S.meas||{})[k];if(m&&num(m.w)>0&&!measCp(m,'w'))w++;if((S.days[k]||[]).filter(e=>e.kind==='m').length>=3)i++});return {w,i}}
// Sen jako czas trwania w godzinach; zapis „g:mm” (karta „Dziś” w wpisy.js przyjmuje 715, 7:15, 7,25 i 7)
function hm(v){let H=Math.floor(v),M=Math.round((v-H)*60);if(M===60){H++;M=0}return [H,M]}
function fmtSleep(v){const [H,M]=hm(v);return M?`${H} h ${M} min`:`${H} h`}
function sleepFmt(v){const [H,M]=hm(v);return `${H}:${String(M).padStart(2,'0')}`}
// Ostatnia zapisana wartość pomiaru przed dniem k: [dzień, wartość]; karta „Dziś” zaczyna od niej (wpisy.js)
function lastMeasK(f,k){const ks=Object.keys(S.meas||{}).filter(x=>x<k&&String((S.meas[x]||{})[f]||'').trim()!=='').sort();return ks.length?[ks[ks.length-1],String(S.meas[ks[ks.length-1]][f])]:null}
// Szybkie wpisy (11.11.2026): rano, gdy brakuje dzisiejszej wagi albo snu, pomiary są pod listą Dziś
// Reakcja zwierzaka na wpis w Zdrowiu (rada 20.11.2026): bez nagradzania bólu, bez oceny wyników badań, tryb dyskretny.
// key: data-k pola (meas.<dzień>.ffm, frame.wrist, vo2…) albo pain, cyc, gutb, gutu, guta, leg:b, leg:c, lab; o={discreet, due, out}.
// Wynik 'note' | 'rest' | 'series' | null; reakcja nie zmienia punktów, serii ani nastroju.
const HR_NOTE=['ffm','fat','waist','hip','thigh','frame.wrist','frame.ankle','vo2','hrRest','hrMax'],HR_BODY=['ffm','fat','waist','hip','thigh'];
function healthReact(key,value,prev,o){o=o||{};const k=String(key||'').replace(/^meas\.[^.]+\./,'');
  if(k==='pain')return o.discreet?null:'rest';
  if(k==='cyc')return o.discreet||!value?null:'note';
  if(k==='gutb'||k==='leg:b'||k==='leg:c')return +value>=5&&!(prev!=null&&prev!==''&&+prev>=5)?'rest':null;
  if(k==='gutu')return value==='piecze'?'rest':null;
  if(k==='lab')return o.out?null:'note';
  if(HR_NOTE.includes(k)){if(!(num(value)>0)||(prev!=null&&String(prev).trim()!==''&&num(prev)===num(value)))return null; // ta sama liczba w innym zapisie (52.4 i 52,4) to nie nowy wpis
  return HR_BODY.includes(k)&&o.due?'series':'note'}
  return null}
// Pomiar zalecany przed zapisem: obwody bez wpisu w 13 poprzednich dniach (co 2 tygodnie), skład ciała w 27 (co 4 tygodnie); dziś się nie liczy.
// Rytm jak w nagłówkach pomiarów (measHtml) i w podsumowaniu zmian ciała: obwody co 2 tygodnie, skład ciała co 4 tygodnie.
function bodyDue(key){const k=String(key||'').replace(/^meas\.[^.]+\./,''),obw=['waist','hip','thigh'],tan=['ffm','fat'],g=obw.includes(k)?obw:tan.includes(k)?tan:null;if(!g)return false;
  const t=todayKey(),from=nAgo(g===obw?13:27);return !Object.keys(S.meas||{}).some(d=>d<t&&d>=from&&g.some(f=>num((S.meas[d]||{})[f])>0))}
function petHealth(key,value,prev,o){const r=healthReact(key,value,prev,Object.assign({discreet:!!S.discreet,due:bodyDue(key)},o||{}));if(r)PET.react(r);return r}
function measDue(){const m=(S.meas||{})[todayKey()]||{},has=x=>String(m[x]||'').trim()!=='';return !(has('w')&&has('sleep'))}
// Karta „Dziś” (wpisy.js, 20.11.2026): app.js buduje opisy wierszy (spec) z własnych zakresów LIM, formatów i zapisu.
// Zapis tą samą ścieżką co pola pomiarów: meas.<dziś>, reakcje zwierzaka (onSaved), save() z kopią i przerysowanie.
const WP_F={w:'w',s:'sleep',k:'steps'},WF=WPISY_FMT();
function WPISY_FMT(){return typeof WPISY!=='undefined'?WPISY.FMT:{k:x=>String(x),w:x=>String(x),sleep:x=>String(x),dur:x=>String(x)}}
function wpRows(){if(!S.lite)return ['w','s','k'];const u=S.unlock||[];return [u.includes('waga')?'w':'',u.includes('sen')?'s':''].filter(Boolean)}
function wpVal(f,raw){const t=String(raw==null?'':raw).trim();if(t==='')return null;const n=num(t);if(f==='steps')return n>=0?Math.round(n):null;if(!(n>0))return null;return f==='sleep'?Math.round(n*60):Math.round(n*10)/10}
// Wartość skopiowana „Jak wczoraj” (meas[k].cp) nie jest pomiarem: obliczenia z pomiarów ją pomijają
const measCp=(m,f)=>!!(m&&Array.isArray(m.cp)&&m.cp.includes(f));
// Wpis z klawiatury: {v} albo {err}. Sen: 715 albo 7:15 (godziny i minuty), 7,25 albo 7 (godziny); zakresy z LIM
function wpParse(key,t){let s=String(t==null?'':t).replace(/\s+/g,'');
  if(key==='s'){const m=/^(\d{1,2}):(\d{1,2})$/.exec(s)||/^(\d{1,2})(\d{2})$/.exec(s);let v;if(m){if(+m[2]>59)return {err:'Minuty od 0 do 59.'};v=+m[1]*60+(+m[2])}
    else if(/^\d{1,2}([.,]\d{1,2})?$/.test(s))v=Math.round(parseFloat(s.replace(',','.'))*60);else return {err:'Wpisz sen jako 715 albo 7,25 (godziny).'};
    return v>LIM.sleep[1]*60?{err:'Sen najwyżej '+LIM.sleep[1]+' godzin.'}:{v}}
  if(key==='k'){s=s.replace(/[.,](?=\d{3}$)/,'');if(!/^\d{1,6}$/.test(s))return {err:'Wpisz liczbę kroków, np. 8000.'};const v=+s;return v>LIM.steps[1]?{err:'Kroki od 0 do '+WF.k(LIM.steps[1])+'.'}:{v}}
  s=s.replace(/kg$/i,'').replace(',','.');if(!/^\d{1,3}(\.\d{1,2})?$/.test(s))return {err:'Wpisz wagę w kilogramach, np. 76,8.'};const v=Math.round(parseFloat(s)*10)/10;
  return v<LIM.w[0]||v>LIM.w[1]?{err:'Waga od '+LIM.w[0]+' do '+LIM.w[1]+' kg.'}:{v}}
// Zapis w formacie pól pomiarów: waga „80,5”, sen „6:13”, kroki „8500”
function wpStore(key,v){return key==='w'?stpFmt(v,.1):key==='s'?sleepFmt(v/60):String(Math.round(v))}
function wpLast(f,k){const l=lastMeasK(f,k),v=l?wpVal(f,l[1]):null;return v!=null?{v,date:fmtDate(l[0]),y:l[0]===nAgo(1)}:null}
// Pas wahania: ±0,35% wokół średniej 7 poprzednich dni (Turicchi i in. 2020, PMID 32353079); to samo zdanie przy wzroście i spadku
function wpBand(w,ref){const d=Math.round((w-ref)*10)/10,inside=Math.abs(w-ref)<=ref*0.0035+1e-9;
  const ds=(d>0?'+':d<0?'−':'±')+WF.w(Math.abs(d))+' kg od średniej 7 dni';
  return {inside,ds,text:ds+(inside?': w zwykłym wahaniu, które w badaniu wynosiło średnio ok. 0,35% masy w tygodniu.':': poza zwykłym wahaniem, które w badaniu wynosiło średnio ok. 0,35% masy w tygodniu; liczy się średnia z kilku dni.')}}
function wpWInfo(live){const h=lastKeys(14).reverse().map(x=>wpVal('w',(S.meas[x]||{}).w)),ok=a=>a.filter(x=>x!=null),prev=ok(h.slice(6,13)),older=ok(h.slice(0,13)),base=prev.length?prev:older.length?older:[live];
  return {show:ok(h).length>=2,ref:base.reduce((s,x)=>s+x,0)/base.length,vals:h.slice(0,13).concat([live])}}
const WP_WW='Pojedyncze ważenie może odbiegać od średniej; w badaniu tygodniowe wahanie wynosiło średnio 0,35% masy (Turicchi 2020). Patrz na linię średniej.';
// Pod wagą: pas, wykres 14 dni i źródło; „Co to znaczy?” tylko przy zapisanej dziś wadze poza pasem
function wpWeightExtra(live,c){const I=wpWInfo(live);if(!I.show)return '';const b=wpBand(live,I.ref),ww=c.saved&&!b.inside;
  return `<p class="wp-band" id="wp_band">${b.text}</p><svg class="wp-spark" id="wp_spark" viewBox="0 0 320 84" role="img" aria-label="Waga z 14 dni, średnia 7 dni ${WF.w(I.ref)} kg, dziś ${WF.w(live)} kg, ${b.ds}. Pas to zwykłe wahanie tygodnia.">${WPISY.spark(I.vals,{ref:I.ref,pct:0.0035})}</svg>`
    +'<p class="wp-src">Wahanie tygodnia: Turicchi i in., PLoS One 2020, <a href="https://pubmed.ncbi.nlm.nih.gov/32353079/" target="_blank" rel="noopener">PMID 32353079</a>.</p>'
    +(ww?`<button class="btn ghost small wp-wwb" id="wp_wwb" data-wp="x:w" aria-expanded="${c.open}" aria-controls="wp_ww">Co to znaczy?</button>`+(c.open?`<p class="wp-note" id="wp_ww">${WP_WW}</p>`:''):'')}
// Opis wiersza karty: zakres, krok, format, wpis, wartość startowa (dzisiejsza, ostatnia, waga z Twoich danych tylko po ich ustawieniu)
function wpSpec(r){const k=todayKey(),m=(S.meas||{})[k]||{},f=WP_F[r],today=wpVal(f,m[f]),last=wpLast(f,k);
  const prof=r==='w'&&(S.touched||{}).kg&&num(S.kg)>0,start=today!=null?{v:today,src:'today'}:last?{v:last.v,src:'last'}:prof?{v:Math.round(num(S.kg)*10)/10,src:'profile'}:{v:r==='w'?Math.round((num(S.kg)||70)*10)/10:r==='s'?420:5000,src:'default'};
  const base={key:r,day:k,today,last,start,parse:t=>wpParse(r,t)};
  if(r==='w')return Object.assign(base,{id:'m_w',label:'Waga',step:.1,lim:LIM.w,grid:false,inputmode:'decimal',copy:false,pm:['0,1 kg mniej','0,1 kg więcej'],
    fmt:v=>WF.w(v)+' kg',fmtDelta:v=>WF.w(v)+' kg',editText:v=>WF.w(v),hintDefault:'wpisz dzisiejszą wagę',extra:wpWeightExtra});
  if(r==='s')return Object.assign(base,{id:'m_sleep',label:'Sen',step:5,coarse:15,range:[180,720],lim:[0,LIM.sleep[1]*60],grid:true,inputmode:'decimal',pm:['Sen o 5 minut mniej','Sen o 5 minut więcej'],
    fmt:WF.sleep,fmtDelta:WF.dur,editText:v=>sleepFmt(v/60),hintDefault:'przesuń suwak albo dotknij liczby'});
  return Object.assign(base,{id:'m_steps',label:'Kroki',step:50,coarse:500,range:[0,20000],lim:LIM.steps,grid:true,inputmode:'numeric',pm:['50 kroków mniej','50 kroków więcej'],
    fmt:WF.k,editText:v=>String(Math.round(v)),hintDefault:'przesuń suwak albo dotknij liczby'})}
function wpSummary(){const k=todayKey(),ks=WPISY.rowOrder(new Date().getHours()).filter(x=>wpRows().includes(x)),R=ks.map(wpSpec),done=R.filter(x=>x.today!=null);
  if(!done.length)return '<p>Nic jeszcze nie zapisano na dziś.</p>';
  const dxs=done.filter(x=>x.last).map(x=>{const d=Math.round((x.today-x.last.v)*10)/10;return x.label.toLowerCase()+' '+(Math.abs(d)<1e-9?(x.last.y?'jak wczoraj':'jak ostatnio'):(d>0?'+':'−')+(x.fmtDelta||x.fmt)(Math.abs(d))+(x.last.y?' od wczoraj':' od ostatniego wpisu'))});
  const avg=f=>{const a=lastKeys(7).map(x=>wpVal(f,(S.meas[x]||{})[f])).filter(x=>x!=null);return a.length?a.reduce((s,x)=>s+x,0)/a.length:null};
  const av=R.map(x=>{const a=avg(WP_F[x.key]);return a==null?'':x.label.toLowerCase()+' '+(x.key==='s'?WF.sleep(a):x.key==='k'?WF.k(Math.round(a/100)*100):WF.w(a)+' kg')}).filter(Boolean);
  return '<p><b>Zapisane na dziś:</b> '+done.map(x=>x.label+' '+x.fmt(x.today)).join(' · ')+'</p>'+(dxs.length?'<p>Zmiana: '+dxs.join(', ')+'.</p>':'')+(av.length?'<p>Średnio z 7 dni: '+av.join(', ')+'.</p>':'')}
function wpCfg(){const rows=WPISY.rowOrder(new Date().getHours()).filter(x=>wpRows().includes(x)).map(wpSpec);return {scope:'wp',day:todayKey(),title:'Dziś',rows,api:WP_API}}
// Zapis zatwierdzonych wierszy; meta.copied: wiersze skopiowane „Jak wczoraj” (pochodzenie w meas.cp, zmieniony wiersz przestaje być kopią)
function wpCommit(vals,meta){buzz();const k=todayKey(),m=S.meas[k]=S.meas[k]||{},prev={cp:m.cp?m.cp.slice():undefined},cp=new Set(m.cp||[]);
  Object.keys(vals).forEach(r=>{const f=WP_F[r];prev[f]=m[f];m[f]=wpStore(r,vals[r]);if(((meta||{}).copied||[]).includes(r))cp.add(f);else cp.delete(f)});
  if(cp.size)m.cp=[...cp];else delete m.cp;save();render();return prev}
function wpRestore(prev){const k=todayKey(),m=S.meas[k]=S.meas[k]||{};Object.keys(prev).forEach(f=>{if(prev[f]==null)delete m[f];else m[f]=prev[f]});save();render()}
function wpOnSaved(key,v){if(key==='w')PET.react('weigh');if(key==='s'&&v>=420)PET.react('sleepok')}
// „Cofnij” tak długo jak komunikat (Ustawienia: czas komunikatów), co najmniej 5 s; „do zamknięcia” = do następnej zmiany (WCAG 2.2.1)
function wpGrace(){return S.toastLen==='stay'?Infinity:Math.max(5000,toastMs('✓ Zapisane · Cofnij'))}
const WP_API={commit:wpCommit,restore:wpRestore,onSaved:wpOnSaved,summary:()=>wpSummary(),grace:wpGrace,say:t=>{const sr=document.getElementById('sr');if(sr)sr.textContent=t}};
function wpCardHtml(){return typeof WPISY!=='undefined'&&wpRows().length?WPISY.card(wpCfg()):''}
function measHtml(part){
  const k=todayKey(),m=S.meas[k]||(S.meas[k]={});
  let h='<h2>Pomiary dnia</h2><p class="small muted">Waga rano, przed jedzeniem. Kroki i sen z zegarka.</p>'+wpCardHtml()+'<p><button class="btn ghost small" data-imppaste="1">Wklej ze Skrótu</button></p>';const top=h;h=cycHtml(k)+'<details class="fold" data-fold="obwody"'+(OPEN_F.has('obwody')?' open':'')+'><summary>Obwody, co 2 tygodnie</summary><div class="panel">'+rwHtml('ms',['waist','hip','thigh','wrist','ankle'])+RW_TIP+'<p class="small muted" style="padding:0 16px">Nadgarstek i kostka: mierz najwęższe miejsce, wystarczy raz. Potrzebne do oceny potencjału mięśniowego.</p></div>'+trendSpark('waist','Talia','cm','ms_tw')+'</details><details class="fold" data-fold="tanita"'+(OPEN_F.has('tanita')?' open':'')+'><summary>Skład ciała (BIA), raz na 4 tygodnie</summary><div class="panel">'+rwHtml('ms',['fat','ffm','ecw','bmr'])+RW_TIP+'</div>'+trendSpark('ffm','FFM','kg','ms_tf')+'<p class="small muted" style="padding:0 16px">Pomiar BIA najlepiej rano, na czczo, po toalecie, bez treningu dzień wcześniej (wiedza ogólna). BMR z pomiaru BIA zastępuje wzór przez 90 dni, waga z pomiarów zastępuje wagę z ustawień.</p></details><details class="fold" data-fold="sprawnosc"'+(OPEN_F.has('sprawnosc')?' open':'')+'><summary>Sprawność, z zegarka</summary><div class="panel">'+rwHtml('ms',['vo2','hrRest','hrMax'])+RW_TIP+'</div><p class="small muted" style="padding:0 16px">VO2max wpisz z zegarka. Bez niego Miara oszacuje go z tętna spoczynkowego.</p></details>';
  // Trendy z pomiarów: wartości skopiowane „Jak wczoraj” (meas.cp) się nie liczą (także waga, choć karta jej nie kopiuje)
  const ks=lastKeys(28).reverse(),val=(x,key)=>{const m=S.meas[x]||{};if(measCp(m,key))return null;const v=num(m[key]);return v>0?v:null};
  const avg=a=>{const v=a.filter(x=>x!=null);return v.length?v.reduce((s,x)=>s+x,0)/v.length:null};
  const ws=ks.map(x=>val(x,'w')),w1=avg(ws.slice(-7)),w0=avg(ws.slice(-14,-7)),st=avg(ks.slice(-7).map(x=>val(x,'steps'))),sl=avg(ks.slice(-7).map(x=>val(x,'sleep')));
  const t=[];
  if(w1!=null)t.push(`Średnia wagi z 7 dni: ${fmt1(w1)} kg${w0!=null?`, tydzień wcześniej ${fmt1(w0)} kg, zmiana ${w1-w0>0?'+':''}${fmt1(w1-w0)} kg`:''}.`);
  [['waist','Talia','cm'],['hip','Biodra','cm'],['thigh','Udo','cm']].forEach(([key,lab,u])=>{const s=ks.map(x=>val(x,key)).filter(v=>v!=null);if(s.length>=2)t.push(`${lab}: z ${fmt1(s[0])} na ${fmt1(s[s.length-1])} ${u} w ostatnich 28 dniach.`)});
  const k90=lastKeys(90).reverse();[['fat','Tłuszcz','%'],['ffm','FFM','kg'],['ecw','ECW/TBW','%']].forEach(([key,lab,u])=>{const s=k90.map(x=>val(x,key)).filter(v=>v!=null);if(s.length===1)t.push(`${lab}: ${fmt1(s[0])} ${u} (jeden pomiar).`);else if(s.length>=2)t.push(`${lab}: z ${fmt1(s[0])} na ${fmt1(s[s.length-1])} ${u} w ostatnich 90 dniach.`)});
  if(st!=null)t.push(`Kroki, średnia z 7 dni: ${fmt(st)}.`);
  if(sl!=null)t.push(`Sen, średnia z 7 dni: ${fmtSleep(sl)}.`);
  const pc=ks.slice(-7).filter(x=>(S.meas[x]||{}).cyc==='P'&&val(x,'w')!=null).length;if(pc)t.push(`${pc} ${pc===1?'ważenie':'ważenia'} z ostatnich 7 dni w przerwie w tabletkach: woda może wtedy podnieść wagę (wiedza ogólna).`);
  const pts=ws.map((v,i)=>v==null?null:[i,v]).filter(Boolean);let svg='',svgCap='';
  if(pts.length>=5){const ys=pts.map(p=>p[1]),mn=Math.min(...ys),mx=Math.max(...ys),r=mx-mn||1;svgCap=`<p class="small muted">Waga z 28 dni: od ${fmt1(mn)} do ${fmt1(mx)} kg.</p>`;svg=`<svg viewBox="0 0 280 60" width="100%" height="60" role="img" aria-label="Waga z 28 dni"><polyline fill="none" stroke="var(--green)" stroke-width="2" points="${pts.map(p=>`${(p[0]/27*270+5).toFixed(1)},${(55-(p[1]-mn)/r*50).toFixed(1)}`).join(' ')}"/></svg>`}
  if(t.length||svg)h+=fold('trendy','Trendy pomiarów',`<div class="note" style="margin:0">${svg}${svgCap}${t.map(x=>`<p>${x}</p>`).join('')}<p class="small muted">Decyduje średnia z tygodnia, nie pojedyncze ważenie.</p></div>`);
  return part==='top'?top:part==='rest'?h:top+h;
}
// Plan dnia według profilu: przy IO danie spoza reguły zamienia się na danie tego samego rodzaju, które ją spełnia,
// najpierw w tym samym rytmie (obiad do 20 min w dni robocze, od 25 min w weekend), potem najbliższe kalorycznie
function planFor(dw){const base=PLAN[dw];if(!((S.prof||{}).cond||{}).io)return base.slice();const we=[0,6].includes(dw),kc=m=>macros(m,1,1).k;
  return base.map(id=>{const m=MEALS.find(x=>x.id===id);if(ioFit(m,macros(m,1,1)))return id;const off=o=>o.t==='obiad'&&(we?o.min<25:o.min>20)?1:0;
    const c=MEALS.filter(o=>o.t===m.t&&!base.includes(o.id)&&ioFit(o,macros(o,1,1))).sort((a,b)=>off(a)-off(b)||Math.abs(kc(a)-kc(m))-Math.abs(kc(b)-kc(m))||a.id.localeCompare(b.id));return c.length?c[0].id:id})}
function planIds(){const sw=(S.swaps||{})[todayKey()]||{};return planFor(new Date().getDay()).map((id,i)=>sw[i]||id)}
function shopAgg(){const agg={};for(const d of [0,1,2,3,4,5,6])planFor(d).forEach(id=>MEALS.find(m=>m.id===id).ing.forEach(([i,g])=>{agg[i]=(agg[i]||0)+g}));return agg}
function shopKeys(){const agg=shopAgg();return Object.keys(ING).filter(i=>agg[i])}
function shopLines(){const agg=shopAgg();return Object.keys(ING).filter(i=>agg[i]).map(i=>i==='jajko'?`Jajka: ${Math.ceil(agg[i]/60)} szt.`:`${ING[i].n}: ${Math.ceil(agg[i]/10)*10} g`)}
function shopHtml(){const L=shopLines(),K=shopKeys();return `<details class="fold" id="zakupy" data-fold="zakupy"${OPEN_F.has('zakupy')?' open':''}><summary>${shopHead()} (${L.length} pozycji)</summary><div class="panel">`+L.map((l,i)=>{const [a,b]=l.split(': ');return `<div class="entry"><span class="txt">${a}${promoNote(K[i])}</span><span class="val">${b}</span></div>`}).join('')+'</div><p class="small muted" style="padding:0 16px">Ilości dla 7 dni planu, bez zamian i bez dodatkowych porcji węglowodanów po treningu. Przyprawy, sól i cytryna poza listą.</p><p style="padding:0 16px 12px"><button class="btn ghost" data-shop="1">Kopiuj listę</button></p>'+promoHtml()+'</details>'}
// ---------- Zakupy z promocji (brief 18.11.2026): osoba sama ogląda gazetkę i wkleja fragment; Miara rozpoznaje go lokalnie, nic nie pobiera
// z sieci i zapisuje tylko pozycje zatwierdzone przez osobę. Wklejony tekst nie trafia do stanu, kopii ani localStorage (tylko PROMO_PENDING). ----------
let PROMO_PENDING=null,PR_ING=null;
const PR_MON=['sty','lut','mar','kwi','maj','cze','lip','sie','wrz','paz','lis','gru'],PR_DOWG=['niedzieli','poniedziałku','wtorku','środy','czwartku','piątku','soboty'];
const PR_B='(^|[^a-ząćęłńóśźż\\d.,])',PR_DAY='(0?[1-9]|[12]\\d|3[01])',PR_MO='(0?[1-9]|1[0-2])',PR_END='(?!\\d|[,.]\\d|\\s*z[łl])',PR_SEP='\\s*(?:-|–|—|do)\\s*';
const PR_MW='(sty(?:cznia|czeń|czen)?|lut(?:ego|y)?|mar(?:ca|zec)?|kwi(?:etnia|ecień|ecien)?|maj(?:a)?|cze(?:rwca|rwiec)?|lip(?:ca|iec)?|sie(?:rpnia|rpień|rpien)?|wrz(?:eśnia|esnia|esień|esien)?|pa[zź](?:dziernika|dziernik)?|lis(?:topada|topad)?|gru(?:dnia|dzień|dzien)?)\\.?(?![a-ząćęłńóśźż])';
// Kolejność ma znaczenie: zakres liczbowy, zakres słowny, pojedyncza data „od”/„do” liczbowo, potem słownie
const PR_DATES=[
  [new RegExp(PR_B+'(?:od\\s+)?'+PR_DAY+'\\.'+PR_MO+'(?:\\.(\\d{4}))?'+PR_SEP+PR_DAY+'\\.'+PR_MO+'(?:\\.(\\d{4}))?'+PR_END,'gi'),m=>[{d:+m[2],m:+m[3],y:+m[4]||0},{d:+m[5],m:+m[6],y:+m[7]||0}]],
  [new RegExp(PR_B+'(?:od\\s+)?'+PR_DAY+'(?:\\s+'+PR_MW+')?(?:\\s+(\\d{4}))?'+PR_SEP+PR_DAY+'\\s+'+PR_MW+'(?:\\s+(\\d{4}))?','gi'),m=>[{d:+m[2],m:m[3]?prMon(m[3]):prMon(m[6]),y:+m[4]||0},{d:+m[5],m:prMon(m[6]),y:+m[7]||0}]],
  [new RegExp(PR_B+'(od|do)\\s+'+PR_DAY+'\\.'+PR_MO+'(?:\\.(\\d{4}))?'+PR_END,'gi'),m=>{const x={d:+m[3],m:+m[4],y:+m[5]||0};return m[2].toLowerCase()==='od'?[x,null]:[null,x]}],
  [new RegExp(PR_B+'(od|do)\\s+'+PR_DAY+'\\s+'+PR_MW+'(?:\\s+(\\d{4}))?','gi'),m=>{const x={d:+m[3],m:prMon(m[4]),y:+m[5]||0};return m[2].toLowerCase()==='od'?[x,null]:[null,x]}]];
// Cena: 12,99 / 12.99 / 12,99 zł / 5 49 zł / 549 zł (3-4 cyfry przed zł to grosze); nie: 0,75 l, 1,50 kg, 50%; opcjonalnie /kg albo /szt.
const PR_PRICE=new RegExp(PR_B.replace('a-ząćęłńóśźż','')+'(?:(\\d{1,4})[,.](\\d{2})(?!\\d|[,.]\\d|\\s*(?:%|(?:kg|g|dag|ml|l|szt)(?![a-ząćęłńóśźż])))|(\\d{1,3}) (\\d{2})(?=\\s*z[łl])|(\\d{3,4})(?=\\s*z[łl]))(\\s*z[łl](?![a-ząćęłńóśźż]))?(?:\\s*\\/\\s*(kg|szt)\\.?)?','gi');
function prMon(s){return PR_MON.indexOf(String(s).slice(0,3).toLowerCase().replace('ź','z'))+1}
function prKey(y,m,d){const t=new Date(y,m-1,d,12);return t.getFullYear()===y&&t.getMonth()===m-1&&t.getDate()===d?keyOf(t):''}
function prAdd(k,n){const d=new Date(k+'T12:00:00');d.setDate(d.getDate()+n);return keyOf(d)}
function prDM(k){return k?k.slice(8,10)+'.'+k.slice(5,7):''}
function prZl(p){return (Math.round(p.p*100)/100).toFixed(2).replace('.',',')+' zł'+(p.u==='kg'?' za kg':p.u==='szt'?' za szt.':'')}
// Rok z tekstu, a gdy go brak: ten, przy którym data jest najbliżej dzisiaj (28.12 i „do 02.01” daje następny rok)
function prNear(m,d,today){const ty=+today.slice(0,4),t0=new Date(today+'T12:00:00');let best='',bd=Infinity;for(const y of [ty-1,ty,ty+1]){const k=prKey(y,m,d);if(!k)continue;const df=Math.abs(new Date(k+'T12:00:00')-t0);if(df<bd){bd=df;best=k}}return best}
function prRange(a,b,today){let to='',from='';
  if(b){if(b.y)to=prKey(b.y,b.m,b.d);else if(a&&a.y){to=prKey(a.y,b.m,b.d);const f=prKey(a.y,a.m,a.d);if(to&&f&&to<f)to=prKey(a.y+1,b.m,b.d)}else to=prNear(b.m,b.d,today)}
  if(a){if(a.y)from=prKey(a.y,a.m,a.d);else if(to){const ty=+to.slice(0,4);from=prKey(ty,a.m,a.d);if(from&&from>to)from=prKey(ty-1,a.m,a.d)}else from=prNear(a.m,a.d,today)}
  if(from&&to&&to<from)to=prKey(+to.slice(0,4)+1,+to.slice(5,7),+to.slice(8,10))||to;
  return {od:from,do:to}}
const prNorm=s=>String(s).toLowerCase().replace(/[ąćęłńóśźż]/g,c=>'acelnoszz'['ąćęłńóśźż'.indexOf(c)]);
function prIngs(){if(!PR_ING){const used=new Set();MEALS.forEach(m=>m.ing.forEach(i=>used.add(i[0])));PR_ING=Object.keys(ING).filter(k=>used.has(k)).map(k=>[k,(prNorm(ING[k].n).match(/[a-z]+/g)||[]).filter(w=>w.length>=4)])}return PR_ING}
// Składnik z nazwy: słowa od 4 liter z nazwy składnika, pasuje pierwsze 5 liter; najwięcej trafień, remis: mniej słów, dalej kolejność w ING
function promoMatch(name){const t=prNorm(name);let best='',bh=0,bw=0;prIngs().forEach(([k,ws])=>{const h=ws.filter(w=>t.includes(w.slice(0,5))).length;if(h>bh||(h&&h===bh&&ws.length<bw)){best=k;bh=h;bw=ws.length}});return best}
function nextShop(today){const sd=S.shopDay;if(sd==null||!(sd>=0&&sd<=6))return '';const d=new Date(today+'T12:00:00');d.setDate(d.getDate()+(sd-d.getDay()+7)%7);return keyOf(d)}
function prClean(r){return r.replace(/-?\s*\d+(?:[,.]\d+)?\s*%/g,' ').replace(/(^|[^a-ząćęłńóśźż])(zł|zl|cena|ceny|taniej|promocja|promocji)(?![a-ząćęłńóśźż])/gi,'$1 ').replace(/\s+/g,' ').replace(/^[\s\-–—:;,.|/*!+]+|[\s\-–—:;,|/*!+]+$/g,'').trim()}
function promoParse(text,today){const out=[];let cand='',glob=null;
  String(text||'').replace(/\u00a0/g,' ').split(/\r?\n/).map(l=>l.trim()).filter(Boolean).forEach(line=>{
    let r=' '+line+' ',dt=null;
    PR_DATES.forEach(([re,f])=>{r=r.replace(re,(...m)=>{if(!dt){const [a,b]=f(m),x=prRange(a,b,today);if(x.od||x.do)dt=x}return m[1]+' '})});
    const pr=[];r=r.replace(PR_PRICE,(...m)=>{const v=m[2]!=null?+(m[2]+'.'+m[3]):m[4]!=null?+(m[4]+'.'+m[5]):+m[6]/100;pr.push({p:Math.round(v*100)/100,u:m[8]?m[8].toLowerCase():''});return m[1]+' '});
    const nm=prClean(r),ok=pr.filter(x=>x.p>0&&x.p<10000);
    if(!ok.length){if(dt)glob=dt;else if((nm.match(/[a-ząćęłńóśźż]/gi)||[]).length>=3)cand=nm;return}
    const best=ok.reduce((a,b)=>b.p<a.p?b:a),n=(nm||cand).slice(0,60).trim();cand='';
    if(n)out.push({n,p:best.p,u:best.u,od:dt?dt.od:'',do:dt?dt.do:'',own:!!dt})});
  const base=nextShop(today)||today;
  return out.slice(0,20).map(o=>{const x={n:o.n,p:o.p,u:o.u,od:o.od,do:o.do,ing:promoMatch(o.n)};if(!o.own&&glob){x.od=glob.od;x.do=glob.do}
    if(!x.do){x.do=prAdd(base,6);if(x.od&&x.do<x.od)x.do=prAdd(x.od,6);x.guess=true}return x})}
function promosActive(k){return (Array.isArray(S.promos)?S.promos:[]).filter(p=>(!p.od||p.od<=k)&&k<=p.do)}
// Dania z bazy Miary przez filtry osoby (wykluczenia, Dla mnie, makro), bez zawężenia do rodzaju posiłku i tempa
function promoDishes(k){const on=new Set(promosActive(k).map(p=>p.ing).filter(Boolean));if(!on.size)return [];
  return filtered({allTypes:true}).map((o,i)=>({m:o.m,i,hit:[...new Set(o.m.ing.map(x=>x[0]).filter(x=>on.has(x)))]})).filter(o=>o.hit.length).sort((a,b)=>b.hit.length-a.hit.length||a.i-b.i).slice(0,5).map(o=>({m:o.m,hit:o.hit}))}
const PR_DK=/^\d{4}-\d{2}-\d{2}$/;
function promoFix(s,today){if(!s||typeof s!=='object')return s;
  s.shopDay=Number.isInteger(s.shopDay)&&s.shopDay>=0&&s.shopDay<=6?s.shopDay:null;
  s.stores=(Array.isArray(s.stores)?s.stores:[]).filter(x=>x&&typeof x==='object'&&typeof x.n==='string'&&typeof x.u==='string').slice(0,3).map(x=>({n:x.n.slice(0,30),u:x.u.slice(0,500)}));
  s.promos=(Array.isArray(s.promos)?s.promos:[]).filter(p=>p&&typeof p==='object'&&typeof p.n==='string'&&p.n.trim()&&typeof p.p==='number'&&p.p>0&&p.p<10000&&typeof p.do==='string'&&PR_DK.test(p.do)&&p.do>=today&&(!p.od||(typeof p.od==='string'&&PR_DK.test(p.od))))
    .slice(0,40).map((p,i)=>({id:typeof p.id==='string'&&p.id?p.id.slice(0,40):'p'+i+'_'+p.do,n:p.n.trim().slice(0,60),ing:typeof p.ing==='string'&&ING[p.ing]?p.ing:'',p:Math.round(p.p*100)/100,od:p.od||'',do:p.do,u:p.u==='kg'||p.u==='szt'?p.u:''}));
  return s}
function promoSave(idx){if(!PROMO_PENDING)return;S.promos=Array.isArray(S.promos)?S.promos:[];const done=new Set();let full=false;
  for(const i of idx){const p=PROMO_PENDING[i];if(!p)continue;const key=p.n.toLowerCase(),j=S.promos.findIndex(x=>String(x.n).toLowerCase()===key&&x.do===p.do),o={n:p.n.slice(0,60),ing:ING[p.ing]?p.ing:'',p:p.p,od:p.od||'',do:p.do,u:p.u||''};
    if(j>=0)S.promos[j]=Object.assign({id:S.promos[j].id},o);else if(S.promos.length>=40){full=true;break}else S.promos.push(Object.assign({id:'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)},o));done.add(i)}
  PROMO_PENDING=PROMO_PENDING.filter((_,i)=>!done.has(i));if(!PROMO_PENDING.length)PROMO_PENDING=null;OPEN_F.add('zakupy');
  toast(full?'Masz już 40 promocji. Usuń stare, żeby dodać nowe.':done.size===1?'Zapisano promocję':`Zapisano promocje: ${done.size}`)}
function shopHead(){const nx=nextShop(todayKey());return nx?`Lista zakupów na 7 dni od ${PR_DOWG[S.shopDay]} ${prDM(nx)}`:'Lista zakupów na tydzień z planu'}
// Dopisek przy pozycji listy: promocja w dniu zakupów (albo dziś), inaczej uwaga, że kończy się przed zakupami
function promoNote(k){const t=todayKey(),ref=nextShop(t)||t,L=(Array.isArray(S.promos)?S.promos:[]).filter(p=>p.ing===k&&p.do>=t);
  const a=L.filter(p=>(!p.od||p.od<=ref)&&ref<=p.do).sort((x,y)=>x.p-y.p)[0];if(a)return `<span class="pnote">promocja ${prZl(a)} do ${prDM(a.do)}</span>`;
  const b=L.filter(p=>p.do<ref).sort((x,y)=>x.do<y.do?1:-1)[0];return b?`<span class="pnote">promocja kończy się przed zakupami (${prDM(b.do)})</span>`:''}
function promoHtml(){const t=todayKey(),ref=nextShop(t)||t,st=Array.isArray(S.stores)?S.stores:[],P=Array.isArray(S.promos)?S.promos:[];
  let h='<div class="promo"><h3 class="rh">Dzień zakupów</h3>'+seg([[1,'pn'],[2,'wt'],[3,'śr'],[4,'cz'],[5,'pt'],[6,'sb'],[0,'nd'],['none','Nie ustawiam']],S.shopDay==null?'none':S.shopDay,'shopday','scroll','Dzień zakupów');
  const ok=st.map((x,i)=>[x,i]).filter(([x])=>/^https:\/\/\S+$/.test(x.u||''));
  h+='<h3 class="rh">Gazetki</h3>'+(ok.length?'<div class="plinks">'+ok.map(([x,i])=>`<a class="btn ghost small plink" href="${esc(x.u)}" target="_blank" rel="noopener noreferrer">Otwórz gazetkę: ${esc(x.n.trim()||'sklep '+(i+1))}</a>`).join('')+'</div>':'<p class="small muted">Link do gazetki swojego sklepu dodasz w „Twoje sklepy”.</p>');
  h+=fold('sklepy','Twoje sklepy',st.map((x,i)=>`<div class="field"><label for="st_n${i}">Sklep ${i+1}: nazwa</label><input type="text" id="st_n${i}" data-k="stores.${i}.n" maxlength="30" autocomplete="off" value="${esc(x.n)}"></div><div class="field"><label for="st_u${i}">Sklep ${i+1}: link do gazetki</label><input type="url" id="st_u${i}" data-k="stores.${i}.u" maxlength="500" inputmode="url" autocomplete="off" placeholder="https://" value="${esc(x.u)}"></div>`).join('')+(st.length<3?'<p><button class="btn ghost small" data-storeadd="1">Dodaj sklep</button></p>':'')+'<p class="small muted">Link otwiera się w nowej karcie; działa tylko adres zaczynający się od https://.</p>');
  h+='<h3 class="rh">Wklej z gazetki</h3><label for="promo_txt" class="plabel">Wklej fragment gazetki</label><textarea id="promo_txt" class="ptxt" rows="4" placeholder="np. Twaróg półtłusty 250 g 3,99 zł do 21.11"></textarea><p><button class="btn small" data-promoparse="1">Rozpoznaj</button></p>';
  if(PROMO_PENDING){if(!PROMO_PENDING.length)h+='<p class="small" id="promo_h" tabindex="-1">Nie znalazłem ceny. Wklej linię z nazwą i ceną, np. Twaróg 250 g 3,99 zł</p>';
    else h+='<h3 class="rh" id="promo_h" tabindex="-1">Propozycje do zatwierdzenia</h3><div class="panel">'+PROMO_PENDING.map((p,i)=>`<div class="pprop"><div class="ptop2"><span>${esc(p.n)}</span><b>${prZl(p)}</b></div><p class="small muted">${p.guess?'data nieznana, przyjęto do '+prDM(p.do):(p.od?'od '+prDM(p.od)+' ':'')+'do '+prDM(p.do)}</p><select data-promoing="${i}" aria-label="Składnik dla: ${esc(p.n)}"><option value="">bez dopasowania</option>${prIngs().map(([k])=>`<option value="${k}"${k===p.ing?' selected':''}>${ING[k].n}</option>`).join('')}</select><div class="pbtns"><button class="btn small" data-promosave="${i}" aria-label="Zapisz: ${esc(p.n)}">Zapisz</button><button class="btn ghost small" data-promoskip="${i}" aria-label="Pomiń: ${esc(p.n)}">Pomiń</button></div></div>`).join('')+'</div><p><button class="btn small" data-promosaveall="1">Zapisz wszystkie</button></p>'}
  const mine=P.filter(p=>p.do>=t).sort((a,b)=>a.do<b.do?-1:a.do>b.do?1:0);
  if(mine.length)h+='<h3 class="rh">Twoje promocje</h3><div class="panel">'+mine.map(p=>`<div class="entry"><span class="txt">${esc(p.n)}<span class="pnote">${prZl(p)}, ${p.od&&p.od>t?'od '+prDM(p.od)+' ':''}do ${prDM(p.do)}, ${ING[p.ing]?ING[p.ing].n:'bez dopasowania'}</span></span><button class="btn ghost small" data-promodel="${esc(p.id)}" aria-label="Usuń: ${esc(p.n)}">Usuń</button></div>`).join('')+'</div>';
  const ds=promoDishes(ref);
  if(ds.length)h+='<h3 class="rh">Dania z produktów w promocji</h3><div class="panel">'+ds.map(o=>`<div class="entry"><span class="txt">${o.m.n}<span class="pnote">w promocji: ${o.hit.map(k=>ING[k].n).join(', ')}</span></span><button class="btn ghost small" data-recipe="${o.m.id}">Przepis</button></div>`).join('')+'</div>';
  return h+'<p class="small muted">Ceny wpisujesz sam z gazetki lub półki. Miara nic nie pobiera z internetu; promocje usuwają się po terminie.</p></div>'}
// ---------- Zamówione: jedzenie z dostawy jednym dotknięciem; wartości orientacyjne dietetyka, przedział ±30% (rada/2026-11-08_zamowione-i-zakresy) ----------
const plN=(n,a,b,c)=>n===1?a:(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?b:c;
const ORD={
  sushi:{n:'Sushi',opts:[6,8,12,16,24],def:12,lab:x=>`${x} szt.`,per:{k:28,p:0.9,f:0.2,c:5.5},ref:'fdcMaki',alt:{lab:'nigiri',per:{k:35,p:3.4,f:0.1,c:4.7},ref:'fdcNigiri'},
    tip:'Wartości dla rolki maki (kawałek ok. 30 g) albo nigiri (ok. 35 g) z bazy USDA.'},
  kurczak:{n:'Kurczak po koreańsku',opts:[3,4,5,6,8,10],def:5,lab:x=>`${x} ${plN(x,'kawałek','kawałki','kawałków')}`,per:{k:148,p:6.5,f:8.2,c:12},ref:'fdcChicken',
    tip:'Bazy składu żywności nie mają kurczaka po koreańsku: wartości z najbliższego dania, kurczaka smażonego w glazurze (kawałek ok. 50 g).'},
  tofu:{n:'Tofu',opts:[['0.7','mała porcja'],['1','zwykła porcja'],['1.3','duża porcja']],def:'1',per:{k:322,p:14.4,f:23.5,c:16.4},ref:'fdcTofu',
    tip:'Wartości dla tofu z warzywami w sosie sojowym (porcja ok. 350 g) z bazy USDA.'}};
const ORD_ADD=[['ryz','ryż',{k:258,p:5.3,f:0.6,c:56},'ryżem','fdcRice'],['fry','frytki',{k:468,p:5.1,f:22.1,c:62.2},'frytkami','fdcFries'],['sal','coleslaw',{k:239,p:1.3,f:17.7,c:18.5},'coleslawem','fdcSlaw']];
function ordDish(){const o=S.ord||{};return ORD[o.dish]?o.dish:'sushi'}
function ordQty(){const o=S.ord||{},dk=ordDish();return dk==='tofu'?String(o.tofu||'1'):(+o[dk]||ORD[dk].def)}
function ordCalc(){const o=S.ord||{},dk=ordDish(),d=ORD[dk],q=num(ordQty()),per=dk==='sushi'&&o.alt?d.alt.per:d.per,t={k:per.k*q,p:per.p*q,f:per.f*q,c:per.c*q};
  ORD_ADD.forEach(([id,,v])=>{if((o.add||{})[id]){t.k+=v.k;t.p+=v.p;t.f+=v.f;t.c+=v.c}});return t}
function ordLabel(){const o=S.ord||{},dk=ordDish(),d=ORD[dk],q=ordQty(),ad=ORD_ADD.filter(([id])=>(o.add||{})[id]).map(x=>x[3]);
  return `${d.n}, ${dk==='tofu'?d.opts.find(x=>x[0]===q)[1]:d.lab(q)}${dk==='sushi'&&o.alt?', nigiri':''}${ad.length?', z '+ad.join(', '):''}`}
function orderHtml(){const o=S.ord||{},dk=ordDish(),d=ORD[dk],q=String(ordQty()),t=ordCalc();
  return `<details class="fold" id="zamowione" data-fold="zamowione"${OPEN_F.has('zamowione')?' open':''}><summary>Zamówione jedzenie</summary><div style="padding:0 16px">`+whyP('zamowione')+(o.dish?`<p class="small muted">Zapamiętane z ostatniego razu: ${esc(ordLabel())}.</p>`:'')+'<div class="panel" style="padding:12px 16px">'+seg(Object.entries(ORD).map(([k,v])=>[k,v.n]),dk,'orddish','scroll')
    +'<div class="chips">'+d.opts.map(x=>{const [v,l]=Array.isArray(x)?x:[String(x),d.lab(x)];return `<button class="chip${v===q?' inc':''}" data-ordn="${v}" aria-pressed="${v===q}">${l}</button>`}).join('')+'</div>'
    +(d.alt?`<div class="chips"><button class="chip${o.alt?' inc':''}" data-ordalt="1" aria-pressed="${!!o.alt}">${d.alt.lab}</button></div>`:'')
    +'<p class="small" style="margin:8px 0 4px">Dodatki</p><div class="chips">'+ORD_ADD.map(([id,n])=>`<button class="chip${(o.add||{})[id]?' inc':''}" data-ordadd="${id}" aria-pressed="${!!(o.add||{})[id]}">${n}</button>`).join('')+'</div>'
    +`<p><b>ok. ${fmt(t.k)} kcal (${fmt(t.k*0.7)}-${fmt(t.k*1.3)})</b>, białko ${fmt(t.p)} g</p><p class="ordtip">${d.tip}</p>${srcHtml([dk==='sushi'&&o.alt?d.alt.ref:d.ref,...ORD_ADD.filter(([id])=>(o.add||{})[id]).map(x=>x[4])])}<p>${actHtml('ord','data-ordsave="1"',ACT_L.ord,false)}</p></div></div></details>`}
// Przyciski, które reagują (20.11.2026, plan „Łatwość” pkt 6): Zjem, trening, wynik badania, zamówione i „Według planu”.
// Stan z WPISY.actBtn, tego samego automatu co główny przycisk karty „Dziś”: zapis → „✓ … · Cofnij” przez wpGrace → „… jeszcze raz / kolejny”.
// ACTS[klucz] = {at, end, undo, live}: czas zapisu, okno zakończone nowym zapisem innego przycisku (cofa się ostatni zapis), cofnięcie dokładnie
// dodanego wpisu, test, czy wpis jeszcze jest (usunięty inaczej: bez okna). Ten sam przycisk (te same data-) we wszystkich stanach, więc actDone
// oddaje go pod palec z fokusem (WCAG 3.2.2); miarka .act-z ze wszystkich napisów trzyma szerokość; napis przez #sr z reakcją zwierzaka (WCAG 4.1.3).
const ACTS={},AB={},ACT_OK='✓ Zapisano · Cofnij';let ACT_T=0;
const ACT_L={meal:l=>[l,'✓ Zjedzone · Cofnij','Zjem jeszcze raz'],train:['Dodaj do dnia',ACT_OK,'Dodaj kolejny'],watch:['Dodaj trening z zegarka',ACT_OK,'Dodaj kolejny'],
  lab:['Zapisz wynik',ACT_OK,'Dodaj następny wynik'],ord:['Zapisz zamówione',ACT_OK,'Zapisz kolejne'],plan:['Według planu',ACT_OK,'✓ Plan zapisany']};
function actOf(key){let a=ACTS[key];if(a&&a.live&&!a.live()){delete ACTS[key];a=null}const o=AB[key]||{L:['','',''],saved:false};
  return WPISY.actBtn({ms:a?(a.end?Infinity:Date.now()-a.at):null,saved:o.saved||!!a,grace:wpGrace(),idle:o.L[0],done:o.L[1],again:o.L[2]})}
// sub: skutek przed zapisem (Z4), tylko przed pierwszym zapisem; jest częścią nazwy przycisku dla czytnika ekranu
function actHtml(key,attr,L,saved,cls,sub){AB[key]={L,saved:!!saved};const r=actOf(key);
  return `<button class="btn ab${cls||''}" ${attr} data-ab="${esc(key)}"><span class="act-l">${esc(r.label)}</span><span class="act-z" aria-hidden="true">${L.map(x=>`<i data-l="${esc(x)}"></i>`).join('')}</span>${sub&&r.st==='idle'?`<small class="act-s">${esc(sub)}</small>`:''}</button>`}
// Po zapisie i cofnięciu: przerysowanie, przycisk wraca pod palec, napis ogłaszany razem z reakcją zwierzaka (PET.flush w render)
// Kolejne dotknięcia tego samego przycisku bez przewinięcia przez osobę: miejsce z pierwszego dotknięcia (błąd zaokrąglenia się nie sumuje)
let ACT_AY=null;
// Krótka wibracja po zapisie, tam gdzie urządzenie ją obsługuje; niezależna od ograniczenia ruchu (to nie ruch na ekranie), wyłączana w Ustawieniach
function buzz(){if(S.vibr===false)return;try{if(typeof navigator!=='undefined'&&typeof navigator.vibrate==='function')navigator.vibrate(15)}catch(_){}}
function actSay(key,at){const sr=document.getElementById('sr');if(sr)sr.textContent='';if(ACT_AY&&ACT_AY.key===key&&ACT_AY.sy===at.sy&&at.y!=null)at.y=ACT_AY.y;save();render();actDone(at);if(at.y!=null&&typeof window.scrollY==='number')ACT_AY={key,y:at.y,sy:window.scrollY};const p=sr?String(sr.textContent||''):'',l=AB[key]?actOf(key).label:'';if(sr&&l)sr.textContent=l+(p?'. '+p:'')}
function actSave(key,undo,live,at){buzz();Object.values(ACTS).forEach(a=>{a.end=true});ACTS[key]={at:Date.now(),end:false,undo,live};clearTimeout(ACT_T);const g=wpGrace();if(isFinite(g))ACT_T=setTimeout(actPaint,g+20);actSay(key,at)}
function actUndo(key,at){const a=ACTS[key];delete ACTS[key];clearTimeout(ACT_T);if(a&&a.undo)a.undo();actSay(key,at)}
// Po oknie „Cofnij”: napis zmieniany w miejscu, bez przerysowania; ogłaszany, gdy przycisk ma fokus
function actPaint(){if(typeof document.querySelectorAll!=='function')return;const sr=document.getElementById('sr');
  document.querySelectorAll('#main button[data-ab]').forEach(b=>{const k=b.dataset.ab;if(!AB[k])return;const l=actOf(k).label,el=b.querySelector('.act-l');if(el&&el.textContent!==l){el.textContent=l;if(sr&&document.activeElement===b)sr.textContent=l}if(k.indexOf('meal:')===0){const n=document.querySelector('#main [data-eatn="'+k.slice(5)+'"]');if(n)n.hidden=actOf(k).st!=='again'}})}
// Usuwany dokładnie dodany wpis: ten sam obiekt, a gdy dane wczytano od nowa (synchronizacja), ostatni identyczny
function actIdx(arr,e){if(!Array.isArray(arr))return -1;let i=arr.indexOf(e);if(i<0){const s=JSON.stringify(e);for(let j=arr.length-1;j>=0;j--)if(JSON.stringify(arr[j])===s){i=j;break}}return i}
function actDrop(arr,e){const i=actIdx(arr,e);if(i>=0)arr.splice(i,1)}
// Wpisy es dodane do dnia k: cofnięcie usuwa je (more: np. oddanie wpisanej wartości), okno trwa, dopóki choć jeden jest w dniu
function actDay(key,k,es,at,more){actSave(key,()=>{es.forEach(e=>actDrop(S.days[k],e));if(more)more()},()=>es.some(e=>actIdx(S.days[k],e)>=0),at)}
// Komunikat tylko z następnym krokiem pierwszych kroków; poza nimi potwierdzeniem jest sam przycisk
function actGuide(t){const g=guideAct();if(g)toast(guideToast(t),g)}
let ATE_FLASH='';
const mealEaten=id=>day().some(e=>e.kind==='m'&&e.id===id);
function eatBtn(id,lab,cls,sub){return actHtml('meal:'+id,`data-addmeal="${esc(id)}"`,ACT_L.meal(lab),mealEaten(id),cls,sub)}
// Pod „Zjem jeszcze raz”: ile razy danie jest dziś zapisane i „Usuń” ostatniego wpisu (przez undoable, 8 s „Cofnij”); w oknie „Cofnij” ukryte, bo cofa przycisk
const eatN=id=>day().filter(e=>e.kind==='m'&&e.id===id).length;
function eatLine(id){const n=eatN(id);if(!n)return '';return `<p class="small muted eatn" data-eatn="${esc(id)}"${actOf('meal:'+id).st==='again'?'':' hidden'}>Zjedzone dziś: ${n}× · <button class="linkbtn small" data-eatrm="${esc(id)}">Usuń</button></p>`}
function planHtml(){
  const ids=planIds(),d=day(),cm=carbMult(),por=num(S.f.portion)||1,ms=d.filter(e=>e.kind==='m'),logged=new Set(ms.map(e=>e.id));
  const left=targetKcal()-ms.reduce((a,e)=>a+e.k,0),now=slotNow();
  const rec=ids.map(id=>MEALS.find(m=>m.id===id)).find(m=>m.t===now&&!logged.has(m.id));
  let h=`<p><button class="btn sos" data-tab="sos">Mam ochotę coś przekąsić</button></p>`+repeatHtml()+`<h2 id="plan">Dziś według planu</h2><p class="small muted">${S.focus?'':([0,6].includes(new Date().getDay())?'Weekend: jedno większe danie, jest więcej czasu. ':'Dzień roboczy: obiad do 20 min. ')}${left>=0?`Zostało ok. ${fmt(left)} kcal na dziś.`:`Cel dnia przekroczony o ok. ${fmt(-left)} kcal.`}</p><div class="panel">`;
  const pk=ids.map(id=>macros(MEALS.find(m=>m.id===id),cm,por,dopOf(id))),tk=pk.reduce((a,b)=>a+b.k,0),tp=pk.reduce((a,b)=>a+b.p,0),tf=pk.reduce((a,b)=>a+b.fib,0),tfNA=pk.some(b=>b.fibNA),room=targetKcal()-tk;
  const base=planFor(new Date().getDay()),orig=PLAN[new Date().getDay()];
  // Karta posiłku według „Wersji zwartej” (krok 9b, 26.11.2026): nazwa i kcal w jednym wierszu, makra W6, Zmień i Zjem obok siebie;
  // Zjem pokazuje skutek przed zapisem (Z4): ile zostanie do celu, a po przekroczeniu neutralnie „razem X z Y” (Z6)
  const eaten=ms.reduce((a,e)=>a+e.k,0),goal=targetKcal();
  const rows=ids.map((id,i)=>{const m=MEALS.find(x=>x.id===id),dj=dopOf(id),x=macros(m,cm,por,dj),dz=dj?((((S.adj||{})[todayKey()]||{})[id])?', zmienione dziś':', Twoja wersja'):'',done=logged.has(id),lk=goal-eaten-x.k,sub=lk>=0?`zostanie ${fmt(lk)} kcal`:`razem ${fmt(eaten+x.k)} z ${fmt(goal)} kcal`;
    return `<div class="entry prow${ATE_FLASH===id?' ate':''}"><div class="ptop"><span class="small muted">${SLOT_T[m.t]}${m.t==='kolacja'&&postTrain()?', po treningu':''}${id!==base[i]?', Twój wybór':base[i]!==orig[i]?', dopasowane do IO':''}${rec&&rec.id===id?', polecane teraz':''}${dz}</span></div><div class="prow2"><button class="linkbtn pname" data-recipe="${id}">${m.n}</button><span class="pk"><b>${fmt(x.k)}</b> kcal</span></div><button class="dopbtn" data-dop="${esc(id)}" aria-label="Dopasuj makro dania: ${esc(m.n)}">${macChips(x)}${(S.seenNew||{}).dop?'':'<span class="nowe" aria-hidden="true">NOWE</span>'}</button><div class="pbot">${done?'<span class="pz" aria-hidden="true"></span>':`<button class="btn ghost pz" data-swap="${i}">Zmień</button>`}${eatBtn(id,'Zjem','',done?'':sub)}</div>${eatLine(id)}</div>`});
  const tot=`<p class="small muted" style="padding:0 16px 12px">Plan dnia: ${fmt(tk)} kcal, ${fmt(tp)} g białka i ${tfNA?'co najmniej ':''}${fmt(tf)} g błonnika (EFSA: 25 g dziennie) przy celu ${fmt(targetKcal())} kcal${tgtApx()?' ('+tgtApx()+')':''}.${room>=50?` Zostaje ok. ${fmt(room)} kcal na dodatek albo większą porcję.`:''}</p>`;
  if(!S.focus)return h+rows.join('')+tot+'</div>';
  // Skupienie (F1c, rada 23.11.2026): na wierzchu jedno danie: zapisane przed chwilą (zostaje w oknie „Cofnij”), polecane teraz albo pierwsze niezjedzone; reszta i podsumowanie dnia zwinięte
  const g=wpGrace(),fresh=id=>{const a=ACTS['meal:'+id];return !!a&&!a.end&&(!a.live||a.live())&&Date.now()-a.at<g};
  let top=ids.findIndex(fresh);if(top<0&&rec)top=ids.indexOf(rec.id);if(top<0)top=ids.findIndex(id=>!logged.has(id));
  const rest=ids.map((_,i)=>i).filter(i=>i!==top);
  return h+(top>=0?rows[top]:'<p style="padding:12px 16px;margin:0">Wszystkie posiłki z planu są zapisane.</p>')+'</div>'+`<details class="fold" data-fold="skupplan"${OPEN_F.has('skupplan')?' open':''}><summary>${top>=0?'Reszta planu dnia':'Cały plan dnia'} (${rest.length})</summary><div class="panel">`+rest.map(i=>rows[i]).join('')+tot+'</div></details>';
}

// ---------- Wpływ wyborów i ochota na przekąskę ----------
let sosT=null,sosEnd=0;
const TRIG=[['stres','Stres w pracy'],['nuda','Nuda'],['zmecz','Zmęczenie'],['glod','Głód fizyczny'],['inne','Coś innego']];
const TRIGN=Object.fromEntries(TRIG);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const mmss=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
function eatenToday(){return day().filter(e=>e.kind==='m').reduce((a,e)=>a+e.k,0)}
function walkPerMin(){return (3.5-1)*baseH()/60}
function balanceFor(k){const e=S.days[k]||[],ms=e.filter(x=>x.kind==='m');if(!ms.length)return null;const net=e.filter(x=>x.kind==='t').reduce((a,x)=>a+x.net,0);const M=measuredTdee();return ms.reduce((a,x)=>a+x.k,0)-(M?M.tdee:rmr()*1.3+net)}
function projHtml(){
  const bs=[];for(let i=1;i<=7;i++){const b=balanceFor(keyAgo(i));if(b!=null)bs.push(b)}
  const goal=num(S.goal)||68,toLose=kg()-goal,M=measuredTdee(),planDef=(M?M.tdee:rmr()*1.3)-targetKcal();
  const line=(def,lab)=>{if(def<=0)return `<p>${lab}: bilans zerowy lub dodatni, masa ciała nie spada.</p>`;const w=def*7/7700;return `<p>${lab}: deficyt ok. ${fmt(def)} kcal dziennie, czyli ok. ${fmt1(w)} kg tygodniowo${toLose>0?`; ${fmt1(goal)} kg za ok. ${fmt(Math.ceil(toLose/w))} tyg.`:'.'}</p>`};
  let h='<h2>Dokąd prowadzą wybory</h2><div class="note">';
  h+=bs.length?line(-bs.reduce((a,b)=>a+b,0)/bs.length,`Średnia z ${bs.length} ${bs.length===1?'zapisanego dnia':'zapisanych dni'} z ostatniego tygodnia`):'<p>Po kilku dniach zapisów pojawi się tu tempo liczone z Twoich danych.</p>';
  const G=dataGap();
  h+=M?`<p><b>Zapotrzebowanie zmierzone: ok. ${fmt(M.tdee)} kcal.</b> Średnio ${fmt(M.avgI)} kcal jedzenia, trend wagi ${M.slope>0?'+':''}${fmt1(M.slope*7)} kg tygodniowo; ${M.nW} ważeń, ${M.nI} pełnych dni.</p>${M.slope<0&&-M.slope*7>kg()*0.01?'<p>Tempo powyżej 1% masy ciała tygodniowo: rozważ mniejszy deficyt (wiedza ogólna).</p>':''}`:`<p>Zapotrzebowanie na razie ze wzoru. Do pomiaru potrzeba w ostatnich 28 dniach co najmniej 6 ważeń rozłożonych na 14 dni i 10 dni z co najmniej 3 zapisanymi posiłkami. Jest: ${G.w} ważeń, ${G.i} takich dni.</p>`;
  h+=S.mode==='utrzymanie'?maintHtml():S.mode==='masa'?masaHtml():line(planDef,'Przy trzymaniu się celu dnia');
  h+=`<p class="small muted">Codzienna przekąska 200 kcal ponad plan to ok. ${fmt1(200*30/7700)} kg mniej spadku w miesiącu. Przelicznik 7700 kcal na kg to uproszczenie, a niepełny zapis dnia zawyża deficyt.</p></div>`;
  return h;
}
function logUrge(out){const k=todayKey();(S.urges[k]=S.urges[k]||[]).push({h:new Date().getHours(),trig:S.sosTrig,out})}
function urgeStats(){
  const all=[];for(let i=0;i<14;i++){(S.urges[keyAgo(i)]||[]).forEach(u=>all.push(u))}
  if(!all.length)return '<p class="small muted">Brak zapisanych ochot z ostatnich 14 dni.</p>';
  const ok=all.filter(u=>u.out!=='inne').length,cnt={},hr={};all.forEach(u=>{cnt[u.trig]=(cnt[u.trig]||0)+1;const b=Math.floor(u.h/2)*2;hr[b]=(hr[b]||0)+1});
  const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0],th=Object.entries(hr).sort((a,b)=>b[1]-a[1])[0];
  return `<p>Ostatnie 14 dni: ochota ${all.length} razy, w tym ${ok} bez jedzenia spoza planu. Najczęstszy powód: ${TRIGN[top[0]]||'nie podano'}. Najczęstsza pora: ${th[0]}:00-${+th[0]+2}:00.</p>`;
}
function renderSos(){
  const st=S.sosStep;
  let h='<p><button class="btn ghost" data-tab="day">Wróć</button></p>';
  if(st==='trig'){
    h+='<h2>Co się teraz dzieje?</h2><div class="panel">'+TRIG.map(([k,l])=>`<button class="opt" data-trig="${k}"><span>${l}</span></button>`).join('')+'</div><p class="small muted">Nazwanie powodu to też zapis. Po kilku tygodniach zobaczysz, kiedy ochota przychodzi najczęściej.</p>';
  }else{
    if(S.sosTrig==='glod')h+='<div class="note warn">Jeśli od ostatniego posiłku minęło ponad 3-4 godziny, to może być zwykły głód. Wtedy zjedz posiłek albo planowaną przekąskę bez czekania.</div>';
    h+=`<h2>Twój plan</h2><div class="panel" style="padding:10px 16px"><textarea data-k="ifthen" rows="3" aria-label="Twój plan na ochotę" style="width:100%;font:inherit;border:1px solid var(--field);border-radius:10px;padding:8px;background:var(--bg);color:var(--ink)">${esc(S.ifthen)}</textarea></div>`;
    const left=Math.max(0,Math.ceil((sosEnd-Date.now())/1000));
    h+=sosEnd?`<section class="readout"><h3>Przerwa przed decyzją</h3><div class="big" id="sosclock" style="font-size:44px;font-weight:700;text-align:center">${mmss(left)}</div></section>`:'<p><button class="btn" data-sosstart="1">Start 10 minut przerwy</button></p>';
    h+='<h2>Po przerwie</h2><div class="panel"><button class="opt" data-sosout="minela"><span>Ochota minęła</span></button><button class="opt" data-sosout="plan"><span>Zjem planowaną przekąskę</span></button><button class="opt" data-sosout="inne"><span>Zjem coś innego</span></button></div>';
    if(st==='inne')h+=`<div class="panel"><div class="field"><label for="s_n">Co</label><input type="text" id="s_n" style="width:170px;text-align:left" placeholder="np. ciastka"></div><div class="field"><label for="s_k">Ile, w przybliżeniu</label><input type="text" inputmode="numeric" enterkeyhint="done" id="s_k" placeholder="0"><span class="unit">kcal</span></div>${kcalChips('s_k')}</div><p><button class="btn" data-sossave="1">Zapisz</button></p><p class="small muted">Zapis jest ważniejszy niż sam wybór. Dla skali: 100 kcal to ok. ${fmt(100/walkPerMin())} min spaceru, ${(()=>{const l=targetKcal()-eatenToday();return l>=0?`a dziś zostało ok. ${fmt(l)} kcal.`:`a cel dnia jest już przekroczony o ok. ${fmt(-l)} kcal; zapis i tak się liczy.`})()}</p>`;
  }
  h+='<h2 id="ochoty">Twoje ochoty</h2>'+whyP('ochoty')+'<div class="note">'+urgeStats()+'</div>';
  document.getElementById('main').innerHTML=h;
}

// ---------- Zdrowie: suplementy, badania, białko za złotówkę ----------
// Przykładowa cena regularna: [cena zł, waga opakowania g, opis opakowania]; tylko podpowiedź i placeholder, nigdy dane osoby
const PROT_EX_DATE='listopad 2026';
const PROT=[['twarog','Twaróg półtłusty',18,[5.88,250,'250 g']],['jajka','Jajka (10 szt. to ok. 600 g)',12.5,[16.99,600,'10 szt. (ok. 600 g)']],['skyr','Skyr naturalny',11,[6.89,300,'300 g']],['kurczak','Pierś z kurczaka',23,[44.88,1000,'1 kg']],['soczewica','Soczewica czerwona (sucha)',24],['tunczyk','Tuńczyk w sosie własnym (masa po odsączeniu)',25],['tofu','Tofu naturalne',12,[5.49,180,'180 g']],['wpc','Odżywka białkowa WPC (sprawdź etykietę)',75]];
// Suplementy (brief 17.11.2026): pora, odstępy i górne dawki tylko z cytatów otwartych 15-17.11.2026 (NHS, MedlinePlus, ChPL z rejestru
// leków, EFSA, NCCIH, ISSN, Quest Diagnostics). Pozycje po substancji, bez nazw handlowych. Gdy źródła brak: SUPP_BRAK.
// pora: rano (Rano na czczo), posilek (Z posiłkiem), miedzy (Między posiłkami), brak (Pora bez zalecenia), tylko według słów źródła.
const SUPP_BRAK='Brak sprawdzonego źródła: zapytaj farmaceutę.',SUPP_LEK='Ustal z lekarzem lub farmaceutą.';
const SUPP_AK='Przy lekach przeciwzakrzepowych (np. warfaryna) powiedz lekarzowi: ';
const SUPP=[
  {id:'witd',n:'Witamina D3',v:'Warto',typ:'suplement',pora:'posilek',d:'Według polskich wytycznych z 2023 r. 1000-2000 j.m. dziennie, gdy brakuje słońca; przy nadwadze często dawka podwójna. Najlepiej dobrać po badaniu 25(OH)D.',e:'Wytyczne krajowe.',
    kiedy:'Z największym posiłkiem: w małym badaniu (17 osób) poziom 25(OH)D wzrósł wtedy o około 50%. NHS: każdy powinien rozważyć codzienną witaminę D jesienią i zimą.',nie:SUPP_BRAK,src:['s_vitd','s_nhsD']},
  {id:'kreatyna',n:'Kreatyna (monohydrat)',v:'Warto przy treningu siłowym',typ:'suplement',pora:'brak',d:'3-5 g dziennie, codziennie.',e:'Mocne: stanowisko ISSN, także dla kobiet.',
    kiedy:'Według doniesień (ISSN) kreatyna z węglowodanami albo z węglowodanami i białkiem częściej zwiększa jej zatrzymanie w mięśniach. W jednym opisanym badaniu lepsze wyniki dało branie tuż przed treningiem i po nim niż rano i wieczorem, ale podawano ją razem z węglowodanami i białkiem.',nie:SUPP_BRAK,src:['s_issnKre','s_issnTim']},
  {id:'bialko',n:'Odżywka białkowa',v:'Wygoda, nie konieczność',typ:'suplement',pora:'brak',d:'Porcja 20-30 g białka, gdy z jedzenia brakuje do celu dnia.',e:'Białko z jedzenia działa tak samo; odżywka to wygodne źródło.',w:'Opłacalność sprawdzisz w kalkulatorze poniżej.',
    kiedy:'ISSN: porcja około 0,25 g białka na kg masy ciała albo 20-40 g, najlepiej rozłożona równo co 3-4 godziny w ciągu dnia. Kazeina przed snem (30-40 g) zwiększa nocną syntezę białek mięśniowych.',nie:SUPP_BRAK,src:['s_issnProt']},
  {id:'magnez',n:'Magnez',v:'Po badaniu lub z zalecenia lekarza',typ:'suplement',pora:'posilek',d:'Dawkę przy niedoborze ustala lekarz. Zapotrzebowanie kobiety to 310-320 mg dziennie łącznie z dietą.',e:'Bez potwierdzonego niedoboru korzyść niepewna (wniosek).',
    kiedy:'ChPL produktu z magnezem i witaminą B6: w 2 lub 3 dawkach podzielonych, podczas posiłków.',
    nie:'Soli wapnia i fosforanów nie zaleca się brać razem z magnezem, bo hamują jego wchłanianie (ChPL). Doustne tetracykliny: magnez co najmniej 3 godziny po nich; chinolony co najmniej 2 godziny przed magnezem albo 6 godzin po nim (ChPL).',
    ul:'NHS: do 400 mg dziennie z suplementów raczej nie szkodzi; ponad 400 mg przez krótki czas może dać biegunkę. EFSA: 250 mg dziennie z suplementów (łatwo rozpuszczalne sole).',src:['s_chplMg','s_nhsOth','s_efsa']},
  {id:'selen',n:'Selen',v:'Do rozmowy z lekarzem',typ:'suplement',pora:'brak',d:'W badaniach 80-400 µg dziennie przez 2-12 miesięcy.',e:'Umiarkowane: obniża TSH u osób bez lewotyroksyny i przeciwciała anty-TPO; nie ma go w wytycznych.',
    w:'NHS: jeśli jesz mięso, ryby lub orzechy, zwykle dostajesz z codziennej diety cały potrzebny selen.',kiedy:SUPP_BRAK,nie:SUPP_BRAK,src:['s_nhsOth']},
  {id:'zelazo',n:'Żelazo',v:'Tylko przy niskiej ferrytynie',typ:'suplement',pora:'miedzy',d:'Dawkę ustala lekarz po badaniu.',
    kiedy:'NHS: siarczan żelaza działa najlepiej na czczo; jeśli możesz, 30 minut przed jedzeniem albo 2 godziny po nim. Jeśli podrażnia żołądek, możesz brać go z jedzeniem lub po nim. Witamina C prawdopodobnie zwiększa wchłanianie żelaza; lekarz lub farmaceuta może zalecić branie go z sokiem pomarańczowym albo witaminą C.',
    nie:'Nie bierz go z herbatą, kawą, jajkami ani nabiałem, bo zmniejszają wchłanianie żelaza: zostaw 2 godziny przerwy (NHS). Z lewotyroksyną: co najmniej 4 godziny przed nią albo po niej (MedlinePlus, siarczan żelaza); ChPL: lewotyroksyna co najmniej 2 godziny przed żelazem. Odstęp ustal z lekarzem. Związki wapnia mogą zmniejszać wchłanianie produktów z żelazem (ChPL).',
    src:['s_nhsFe','s_medlt4','s_chplLt4','s_chplCa']},
  {id:'blonnik',n:'Błonnik (łuska babki jajowatej, ispaghula)',v:'Rozważ, jeśli warzyw i kasz jest mało',typ:'suplement',pora:'posilek',d:'Zacznij od 1 łyżeczki z dużą szklanką wody, zwiększaj powoli.',
    kiedy:'Strona NHS o preparacie z łuski babki jajowatej: najlepiej po posiłku lub przekąsce, wieczorną porcję co najmniej godzinę przed snem, do szklanki co najmniej 150 ml zimnej wody.',
    nie:'Strona NHS o preparacie z łuski babki jajowatej: inny lek lub suplement weź ponad godzinę przed nim albo po nim, bo preparat może zmieniać wchłanianie leków, witamin i suplementów. Druga strona NHS o tym preparacie podaje co najmniej 30 minut od innych leków.',
    src:['s_nhsIspT','s_nhsIspW']},
  {id:'betaalanina',n:'Beta-alanina',v:'Niski priorytet',typ:'suplement',pora:'posilek',d:'4-6 g dziennie przez co najmniej 4 tygodnie.',e:'Umiarkowane, ale tylko dla wysiłków trwających 1-4 min (ISSN).',
    kiedy:'Z posiłkiem w czasie ładowania: tak skuteczniej podnosi poziom karnozyny w mięśniach (ISSN).',nie:SUPP_BRAK,src:['s_issnBa']},
  {id:'cytrulina',n:'Cytrulina',v:'Najniższy priorytet',typ:'suplement',pora:'brak',e:'Słabe: efekt mały i niespójny.',w:'Pieniądze lepiej wydać na białko z jedzenia (wniosek).',
    kiedy:'W jednym badaniu (12 osób) przyjmowano ją godzinę przed treningiem; to protokół badania, nie zalecenie.',nie:SUPP_BRAK,src:['s_cytr']},
  {id:'probiotyki',n:'Probiotyki, enzymy trawienne',v:'Bez zalecenia nie',typ:'suplement',pora:'brak',d:'Tylko przy konkretnych dolegliwościach, po rozmowie z lekarzem.',e:'NCCIH: czas stosowania i najlepsze dawki są niepewne.',w:'Na trawienie najpierw: błonnik stopniowo, woda, regularne posiłki. NCCIH: w analizie z 2017 r. dotyczącej zakażeń C. difficile branie probiotyków razem z antybiotykami wydawało się bezpieczne.',
    kiedy:SUPP_BRAK,nie:SUPP_BRAK,src:['s_nccihProb']},
  {id:'biotyna',n:'Biotyna (też w preparatach na włosy)',v:'Uwaga przed badaniami',typ:'suplement',pora:'brak',w:'Sprawdź skład multiwitamin.',
    kiedy:'Przed badaniem krwi, według laboratorium Quest Diagnostics: przy zwykłych dawkach krew pobiera się co najmniej 8 godzin po ostatniej dawce biotyny, przy bardzo dużych dawkach co najmniej 72 godziny po niej.',nie:SUPP_BRAK,
    ul:'NHS: do 0,9 mg dziennie z suplementów raczej nie szkodzi.',src:['s_quest','s_nhsB']},
  {id:'jod',n:'Jod w tabletkach',v:'Zapytaj lekarza lub farmaceutę',typ:'suplement',pora:'posilek',    kiedy:'ChPL jodku potasu: po posiłku, z połową szklanki wody.',nie:SUPP_BRAK,ul:'NHS: do 0,5 mg dziennie z suplementów raczej nie szkodzi. EFSA: 600 µg dziennie u dorosłych.',src:['s_chplJod','s_nhsJod','s_efsa']},
  {id:'omega3',n:'Kwasy omega-3',typ:'suplement',pora:'posilek',
    kiedy:'ChPL leku z kwasami omega-3: kapsułki można brać z jedzeniem, żeby uniknąć dolegliwości żołądkowych.',nie:SUPP_BRAK,
    w:SUPP_AK+'według ChPL leku z omega-3 przy takim połączeniu i przy odstawieniu trzeba kontrolować czas protrombinowy. Olej z wątroby ryb ma też dużo witaminy A (NHS).',
    ul:'EFSA: za mało danych, by ustalić górną dawkę (DHA, EPA, DPA).',src:['s_chplOm3','s_nhsA','s_efsa']},
  {id:'wapn',n:'Wapń',typ:'suplement',pora:'posilek',kiedy:'ChPL węglanu wapnia: podczas posiłku.',
    nie:'Związki wapnia mogą zmniejszać wchłanianie produktów z żelazem (ChPL). Tetracykliny i związki fluoru: odstęp około 2 godzin (ChPL). Z lewotyroksyną: co najmniej 4 godziny przed nią albo po niej (MedlinePlus, węglan wapnia); ChPL: lewotyroksyna co najmniej 2 godziny przed solami wapnia. Odstęp ustal z lekarzem.',
    ul:'EFSA: 2500 mg dziennie u dorosłych. NHS: ponad 1500 mg dziennie może powodować ból brzucha i biegunkę.',src:['s_chplCa','s_medlt4','s_chplLt4','s_nhsCa','s_efsa']},
  {id:'witc',n:'Witamina C',typ:'suplement',pora:'brak',kiedy:SUPP_BRAK,nie:SUPP_BRAK,
    w:'NHS: witamina C prawdopodobnie zwiększa wchłanianie żelaza. '+SUPP_AK+'ChPL warfaryny wymienia witaminę C wśród środków, które zmniejszają jej działanie.',
    ul:'NHS: mniej niż 1000 mg dziennie z suplementów raczej nie szkodzi. EFSA: za mało danych, by ustalić górną dawkę.',src:['s_chplWarf','s_nhsFe','s_nhsC','s_efsa']},
  {id:'b12',n:'Witamina B12',typ:'suplement',pora:'rano',kiedy:'ChPL witaminy B12: połykać w całości, popijając wodą, najlepiej rano, na czczo.',
    nie:'Wchłanianie witaminy B12 mogą pogorszyć m.in. inhibitory pompy protonowej (np. omeprazol), antagoniści receptora H2, kolchicyna, cholestyramina, niektóre leki przeciwpadaczkowe, sole potasu, metylodopa i alkohol. Stężenie B12 może być niższe przy doustnej antykoncepcji i metforminie (ChPL).',
    ul:'NHS: do 2 mg dziennie z suplementów raczej nie szkodzi. EFSA: nie opisano określonych działań niepożądanych.',src:['s_chplB12','s_nhsB','s_efsa']},
  {id:'glicyna',n:'Glicyna',typ:'suplement',pora:'brak',kiedy:SUPP_BRAK,nie:SUPP_BRAK,src:[]},
  {id:'cynk',n:'Cynk',typ:'suplement',pora:'posilek',kiedy:'ChPL cynku: po posiłku, popijając wodą.',
    nie:'ChPL cynku: nie brać z tetracyklinami, kwasem acetylosalicylowym, ibuprofenem, indometacyną, tiazydowymi lekami moczopędnymi, glikokortykosteroidami ani związkami wapnia. Związki wapnia, żelaza, miedzi i dieta mleczna zmniejszają wchłanianie cynku. Długie stosowanie może prowadzić do niedoboru miedzi.',
    ul:'NHS: nie więcej niż 25 mg dziennie z suplementów, chyba że lekarz zaleci inaczej; duże dawki zmniejszają wchłanianie miedzi. EFSA: 25 mg dziennie.',src:['s_chplZn','s_nhsOth','s_efsa']},
  {id:'krzem',n:'Krzem',typ:'suplement',pora:'brak',kiedy:SUPP_BRAK,nie:SUPP_BRAK,ul:'EFSA: za mało danych, by ustalić górną dawkę.',src:['s_efsa']},
  {id:'bor',n:'Bor',typ:'suplement',pora:'brak',kiedy:SUPP_BRAK,nie:SUPP_BRAK,ul:'EFSA: 10 mg dziennie u dorosłych.',src:['s_efsa']},
  {id:'kolagen',n:'Kolagen',typ:'suplement',pora:'brak',kiedy:SUPP_BRAK,nie:SUPP_BRAK,src:[]},
  {id:'k2',n:'Witamina K2 (MK-7)',typ:'suplement',pora:'brak',kiedy:SUPP_BRAK,nie:SUPP_BRAK,
    w:SUPP_AK+'według ChPL warfaryny duża ilość witaminy K ogranicza jej działanie, a suplementy diety trzeba wtedy stosować ostrożnie.',
    ul:'NHS: do 1 mg witaminy K dziennie z suplementów raczej nie szkodzi. EFSA: za mało danych, by ustalić górną dawkę.',src:['s_chplWarf','s_nhsK','s_efsa']},
  {id:'witae',n:'Witaminy A i E',typ:'suplement',pora:'brak',kiedy:SUPP_BRAK,
    nie:'Preparaty żelaza osłabiają działanie witaminy E: zachowaj kilkugodzinny odstęp (ChPL). Nie bierz innych leków z witaminą A, bo grozi nadmiar witaminy A; w czasie przyjmowania nie pij alkoholu (ChPL).',
    w:SUPP_AK+'witaminy A i E nasilają działanie doustnych leków przeciwzakrzepowych z grupy kumaryny (ChPL).',
    ul:'Witamina A: NHS: łącznie z diety i suplementów nie więcej niż 1,5 mg (1500 µg); EFSA: 3000 µg dziennie u dorosłych. Witamina E: NHS: do 540 mg (800 j.m.) dziennie z suplementów raczej nie szkodzi; EFSA: 300 mg dziennie.',src:['s_chplAE','s_nhsA','s_nhsE','s_efsa']},
  {id:'glukozamina',n:'Glukozamina z chondroityną (i MSM)',typ:'suplement',pora:'brak',
    kiedy:'Dla leku z samym siarczanem chondroityny ChPL podaje: przed posiłkiem, w trakcie lub po nim; jeśli inny lek podrażnił wcześniej żołądek, po posiłku.',nie:SUPP_BRAK,
    w:SUPP_AK+'glukozamina i siarczan chondroityny mogą zwiększać wskaźnik INR (ChPL warfaryny), a NCCIH wiąże je z większym ryzykiem krwawienia. Glukozamina może u części osób podnosić poziom cukru we krwi (NCCIH).',
    src:['s_chplChon','s_chplWarf','s_nccihGlu']},
  {id:'kasztanowiec',n:'Wyciąg z kasztanowca z ruszczykiem (i bromelainą)',typ:'suplement',pora:'brak',kiedy:SUPP_BRAK,nie:SUPP_BRAK,src:[]},
  {id:'osseina',n:'Kompleks osseina-hydroksyapatyt',typ:'lek',pora:'brak',kiedy:'ChPL: tabletki połykać, popijając niewielką ilością wody; pory ani związku z posiłkiem ChPL nie podaje. '+SUPP_LEK,
    nie:'ChPL: produkty z żelazem i cynkiem, lewotyroksyna, tetracykliny, bisfosfoniany i chinolony: odstęp co najmniej 2 godzin. Z witaminą D: ChPL zaleca ścisłe sprawdzanie stężenia wapnia w surowicy i w moczu. '+SUPP_LEK,src:['s_chplOss']},
  {id:'ppi',n:'Inhibitor pompy protonowej (np. pantoprazol)',typ:'lek',pora:'rano',kiedy:'ChPL pantoprazolu: 1 godzinę przed posiłkiem, połknąć w całości, popić wodą. NHS: zwykle raz dziennie, z samego rana. '+SUPP_LEK,
    nie:'ChPL: może zmniejszać wchłanianie witaminy B12. Przy stosowaniu co najmniej 3 miesiące rzadko opisywano ciężki niedobór magnezu; NHS: po ponad 3 miesiącach poziom magnezu we krwi może spaść. Może zmniejszać wchłanianie lewotyroksyny (ChPL lewotyroksyny). '+SUPP_LEK,
    src:['s_chplPanto','s_nhsPanto','s_nhsPantoQ','s_chplLt4']},
  {id:'lewotyroksyna',n:'Lewotyroksyna',typ:'lek',pora:'rano',kiedy:'MedlinePlus: zwykle raz dziennie, na czczo, 30 minut do godziny przed śniadaniem. ChPL: rano, na czczo, pół godziny przed śniadaniem, z niewielką ilością płynu. '+SUPP_LEK,
    nie:'Wapń (węglan wapnia) i żelazo (siarczan żelaza): co najmniej 4 godziny przed lewotyroksyną albo po niej (MedlinePlus); ChPL: lewotyroksyna co najmniej 2 godziny przed żelazem i solami wapnia. Odstęp ustal z lekarzem. Niektóre pokarmy i napoje, zwłaszcza z soją, orzechami włoskimi i błonnikiem, mogą wpływać na działanie lewotyroksyny (MedlinePlus). '+SUPP_LEK,
    src:['s_medlt4','s_chplLt4']}
];
// Pary do planu: tylko te, które podaje źródło. 'kawa' to pozycja pomocnicza (kawa, herbata, nabiał), nie do wyboru; '*' to dowolna inna wybrana pozycja.
const SUPP_PSEUDO=['kawa'];
const SUPP_PARY=[
  {a:'lewotyroksyna',b:'wapn',txt:'Lewotyroksyna i wapń: MedlinePlus podaje co najmniej 4 godziny przed lewotyroksyną albo po niej (węglan wapnia); ChPL: lewotyroksyna co najmniej 2 godziny przed solami wapnia. Odstęp ustal z lekarzem.',src:['s_medlt4','s_chplLt4']},
  {a:'lewotyroksyna',b:'zelazo',txt:'Lewotyroksyna i żelazo: MedlinePlus podaje co najmniej 4 godziny przed lewotyroksyną albo po niej (siarczan żelaza); ChPL: lewotyroksyna co najmniej 2 godziny przed żelazem. Odstęp ustal z lekarzem.',src:['s_medlt4','s_chplLt4']},
  {a:'osseina',b:'lewotyroksyna',txt:'Kompleks osseina-hydroksyapatyt i lewotyroksyna: według ChPL odstęp co najmniej 2 godzin. '+SUPP_LEK,src:['s_chplOss']},
  {a:'osseina',b:'zelazo',txt:'Kompleks osseina-hydroksyapatyt i żelazo: według ChPL odstęp co najmniej 2 godzin. '+SUPP_LEK,src:['s_chplOss']},
  {a:'osseina',b:'cynk',txt:'Kompleks osseina-hydroksyapatyt i cynk: według ChPL odstęp co najmniej 2 godzin. '+SUPP_LEK,src:['s_chplOss']},
  {a:'ppi',b:'b12',txt:'Inhibitor pompy protonowej może zmniejszać wchłanianie witaminy B12 (ChPL). '+SUPP_LEK,src:['s_chplPanto','s_chplB12']},
  {a:'ppi',b:'magnez',txt:'Przy inhibitorze pompy protonowej branym ponad 3 miesiące poziom magnezu we krwi może spaść (NHS). '+SUPP_LEK,src:['s_nhsPantoQ','s_chplPanto']},
  {a:'witae',b:'zelazo',txt:'Witaminy A i E oraz żelazo: żelazo osłabia działanie witaminy E, zachowaj kilkugodzinny odstęp (ChPL).',src:['s_chplAE']},
  {a:'zelazo',b:'wapn',txt:'Żelazo i wapń: związki wapnia mogą zmniejszać wchłanianie produktów z żelazem (ChPL węglanu wapnia).',src:['s_chplCa']},
  {a:'cynk',b:'wapn',txt:'Cynk i wapń: związki wapnia zmniejszają wchłanianie cynku, a ChPL cynku odradza branie ich razem.',src:['s_chplZn']},
  {a:'cynk',b:'zelazo',txt:'Cynk i żelazo: związki żelaza zmniejszają wchłanianie cynku (ChPL cynku).',src:['s_chplZn']},
  {a:'magnez',b:'wapn',txt:'Magnez i wapń: ChPL produktu z magnezem nie zaleca brania ich razem, bo sole wapnia hamują wchłanianie magnezu.',src:['s_chplMg']},
  {a:'ppi',b:'lewotyroksyna',txt:'Inhibitor pompy protonowej i lewotyroksyna: jednoczesne stosowanie może zmniejszyć wchłanianie hormonów tarczycy, bo inhibitor zwiększa pH soku żołądkowego (ChPL lewotyroksyny). '+SUPP_LEK,src:['s_chplLt4']},
  {a:'blonnik',b:'*',txt:'Błonnik (łuska babki jajowatej): inne leki i suplementy weź ponad godzinę przed nim albo po nim (NHS).',src:['s_nhsIspT']},
  {a:'zelazo',b:'kawa',txt:'Żelaza nie bierz z herbatą, kawą, jajkami ani nabiałem, bo zmniejszają jego wchłanianie: zostaw 2 godziny przerwy (NHS).',src:['s_nhsFe']}
];
const SUPP_PORA=[['rano','Rano na czczo'],['posilek','Z posiłkiem'],['miedzy','Między posiłkami'],['brak','Pora bez zalecenia']];
const suppIds=()=>SUPP.map(s=>s.id);
// Po wczytaniu i imporcie kopii: tylko znane id, bez powtórzeń
function suppFix(s){if(s&&typeof s==='object'){const ids=suppIds();s.suppTake=(Array.isArray(s.suppTake)?s.suppTake:[]).filter((x,i,a)=>typeof x==='string'&&ids.includes(x)&&a.indexOf(x)===i)}return s}
const suppOn=id=>Array.isArray(S.suppTake)&&S.suppTake.includes(id);
function suppCard(s){const on=suppOn(s.id),row=(l,t)=>t?`<p class="small"><b>${l}:</b> ${esc(t)}</p>`:'';
  return `<article class="meal" id="supp_${esc(s.id)}"><div class="mhead"><div class="name">${esc(s.n)}</div><div class="meta">${esc(s.v||(s.typ==='lek'?'Lek':'Suplement'))}</div></div><div class="mdet" style="border-top:0">`
    +row('Dawka',s.d)+row('Dowody',s.e)+row('Kiedy',s.kiedy)+row('Nie łącz z',s.nie)+row('Górna dawka dzienna',s.ul)+row('Uwaga',s.w)+srcHtml(s.src)
    +`<p><button class="btn ghost small" data-supp="${esc(s.id)}" aria-pressed="${on}" aria-label="Biorę: ${esc(s.n)}">${on?'<span aria-hidden="true">✓ </span>':''}Biorę</button></p></div></article>`}
// Mój plan suplementów: grupy pory dnia, pod grupą najwyżej jedna uwaga (pierwsza pasująca para), reszta w zwinięciu; bez serii i liczenia pominięć
function suppPlanHtml(){const take=(Array.isArray(S.suppTake)?S.suppTake:[]).filter(id=>SUPP.some(s=>s.id===id));if(!take.length)return '';
  const hit=(x,y)=>take.includes(x)&&(take.includes(y)||SUPP_PSEUDO.includes(y)||(y==='*'&&take.some(i=>i!==x))),pairs=SUPP_PARY.filter(p=>hit(p.a,p.b)||hit(p.b,p.a));
  const line=p=>esc(p.txt)+srcHtml(p.src);
  let h='<div class="panel" id="suppplan" style="padding:4px 16px 12px"><h3 style="margin-top:12px">Mój plan suplementów</h3><p class="small muted">Odstępy tylko z podanych źródeł. Zmiany w lekach ustal z lekarzem lub farmaceutą.</p>';
  // Każda para raz: pod grupą tej z dwóch pozycji, która w planie jest wcześniej (kolejność grup SUPP_PORA)
  const ord=id=>{const s=SUPP.find(x=>x.id===id);return s&&take.includes(id)?SUPP_PORA.findIndex(([k])=>k===s.pora):99},gOf=p=>Math.min(ord(p.a),ord(p.b));
  SUPP_PORA.forEach(([k,t],gi)=>{const its=SUPP.filter(s=>take.includes(s.id)&&s.pora===k);if(!its.length)return;
    const ps=pairs.filter(p=>gOf(p)===gi);
    h+=`<section class="sgrp"><h4 style="margin:12px 0 4px">${t}</h4><p class="small">${its.map(s=>esc(s.n)).join(', ')}</p>`;
    if(ps.length)h+=`<div class="note">${line(ps[0])}</div>`;
    if(ps.length>1)h+=fold('suppall_'+k,`Pokaż wszystkie odstępy (${ps.length-1})`,ps.slice(1).map(p=>`<p class="small sp">${line(p)}</p>`).join(''));
    h+='</section>'});
  return h+'</div><!--/suppplan-->'}
function protCost(){return PROT.map(([id,n,pp,ex])=>{const r=S.prices[id]||{},p=num(r.p),g=num(r.g);return {id,n,pp,ex,c:p>0&&g>0?p/(g*pp/100)*20:null}})}
function renderHealth(){
  let h=(profSet()?healthPlanHtml()+sygCardHtml()+profHtml():profHtml()+healthPlanHtml()+sygCardHtml())+fold('tygodnie','12 tygodni: czego się spodziewać',weeksHtml())+'<p><button class="btn" data-tab="labs">Moje badania</button></p><div class="note"><b>Co realne.</b> Przy chorobach przewlekłych, np. tarczycy, celem jest dobra kontrola wyników i objawów, nie wyleczenie. Insulinooporność często wyraźnie się poprawia przy spadku masy ciała, ruchu i śnie. Niedobory wyrównuje się według wyników badań.</div>';
  h+=cardsHtml('health')+visitHtml();
  const box=(title,items)=>`<details class="fold"><summary>${title}</summary><div class="panel">`+items.map(([a,b])=>`<div class="entry"><span class="txt"><b>${a}.</b> ${b}</span></div>`).join('')+'</div></details>';
  h+=box('Woda, uda i pośladki',[
    ['Waga skacze z dnia na dzień',`Glikogen wiąże wodę: każdy gram to 2,7-4 g wody. Dlatego aplikacja patrzy na średnią z tygodnia i trend z 2-4 tygodni, a nie na pojedyncze ważenie. Źródło: ${srcA('glyc')}.`],
    ['Lipodemia',`Kompresja razem z ruchem zmniejsza ból, a ćwiczenia w wodzie są szczególnie skuteczne; kompresja nie zmniejsza tkanki. Przy nadwadze redukcja masy zmniejsza też objętość nóg. Źródło: ${srcA('s2k')}.`],
    ['Uda i pośladki',`W badaniu 12 tygodni treningu jednej nogi tłuszcz w tej nodze nie spadł, choć spadł w całym ciele. Mierz obwody uda i bioder, nie tylko wagę. Źródło: ${srcA('spot')}.`]
  ]);
  h+=box('Dzień pracy przy biurku',[
    ['Przy komputerze','Wstawanie co 45-60 minut na 2-3 minuty: woda, rozciąganie, schody. Rozmowy telefoniczne na stojąco albo w ruchu.'],
    ['Wyjazdy i spotkania w terenie','Liczą się w krokach z zegarka. W torbie przekąska białkowa i woda, żeby nie kupować jedzenia w biegu.'],
    ['Spotkania i prezentacje','Posiłek przed spotkaniem, nie po. Kawa z mlekiem szybkim wpisem.'],
    ['Terminy i stres','Przekąski z biurka do szafki. Przy ochocie przycisk „Mam ochotę coś przekąsić”.']
  ]);
  h+=box('Zegarek sportowy: które dane brać pod uwagę',[
    ['Kroki','Najbardziej wiarygodna liczba z zegarka. Wpisuj ją w pomiarach dnia.'],
    ['Kalorie z zegarka','Nie do liczenia bilansu: zegarki na nadgarstku mylą się w kaloriach znacznie. Aplikacja liczy zapotrzebowanie z jedzenia i trendu wagi.'],
    ['Sen, tętno spoczynkowe, wskaźnik energii','Do obserwacji trendów regeneracji i stresu.'],
    ['Siłownia i rower','Przy ćwiczeniach bez ruchu nadgarstka zegarek myli się bardziej. Na spinningu wiarygodniejsza jest moc z monitora roweru.']
  ]);
  h+='<h2>Start w 3 krokach</h2><div class="panel"><div class="entry"><span class="txt"><b>1. Badania i lekarz.</b> Zakres ustal z lekarzem, np. TSH, fT4, fT3, anty-TPO, glukoza i insulina na czczo, HbA1c, 25(OH)D, ferrytyna, magnez, wapń.</span></div><div class="entry"><span class="txt"><b>2. Witamina D3</b> według wytycznych. Pozostałe suplementy dopiero po wynikach.</span></div><div class="entry"><span class="txt"><b>3. Białko z jedzenia</b> według planu. Kreatyna 3-5 g dziennie, jeśli trenujesz siłowo.</span></div></div>';
  h+=fold('suple','Suplementy ('+SUPP.length+')',suppPlanHtml()+SUPP.map(suppCard).join(''));
  h+='<h2 id="sylwetka">Sylwetka i sprawność</h2>'+potHtml()+fitHtml();
  h+='<h2 id="bialko">Białko za złotówkę</h2>'+whyP('bialko')+'<p class="small muted">Wpisz cenę z półki lub paragonu i wagę opakowania. Wynik to koszt 20 g białka. Ceny zapisują się w telefonie.</p><div class="panel">'+protCost().map(r=>{const d=DEF.prices[r.id]||{},fm=x=>String(x).replace('.',','),ph='cena';return `<div class="field prot"><label for="f_prices.${r.id}.p">${r.n}</label>${r.ex?`<span class="small muted hint">np. ${fm(r.ex[0].toFixed(2))} zł za ${r.ex[2]} (${PROT_EX_DATE})</span>`:''}<span class="pair"><input type="text" inputmode="decimal" enterkeyhint="next" id="f_prices.${r.id}.p" data-k="prices.${r.id}.p" value="${esc(S.prices[r.id].p)}" placeholder="${ph}" aria-label="Cena: ${r.n}"><span class="unit">zł</span></span><span class="pair"><input type="text" inputmode="numeric" enterkeyhint="next" id="f_prices.${r.id}.g" data-k="prices.${r.id}.g" value="${esc(S.prices[r.id].g)}" aria-label="Waga opakowania: ${r.n}"><span class="unit">g</span></span></div>`}).join('')+'</div><p class="small muted">Przykładowe ceny regularne ze sklepu internetowego dużej sieci, '+PROT_EX_DATE+'. Wpisz cenę ze swojego sklepu.</p>';
  const ranked=protCost().filter(r=>r.c!=null).sort((a,b)=>a.c-b.c);
  if(ranked.length)h+='<h2>Ranking</h2><div class="panel">'+ranked.map((r,i)=>`<div class="entry"><span class="txt">${i+1}. ${r.n}</span><span class="val">${r.c.toFixed(2).replace('.',',')} zł za 20 g</span></div>`).join('')+'</div>';
  h+='<h2>Źródła</h2><ol class="src"><li><a href="https://pubmed.ncbi.nlm.nih.gov/36771403/" target="_blank" rel="noopener">Wytyczne witaminy D w Polsce, aktualizacja 2023</a></li><li><a href="https://pubmed.ncbi.nlm.nih.gov/37221858/" target="_blank" rel="noopener">Stanowisko ISSN: żywienie kobiet aktywnych fizycznie (kreatyna)</a></li><li><a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4501114/" target="_blank" rel="noopener">Stanowisko ISSN: beta-alanina</a></li><li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10951571" target="_blank" rel="noopener">Metaanaliza: selen w Hashimoto (Thyroid 2024)</a></li></ol><p class="small muted">Aplikacja nie zastępuje lekarza. Suplementy omawiaj z lekarzem, zwłaszcza przy zmianie leków.</p>';
  document.getElementById('main').innerHTML=h;
}

// ---------- Badania: wyniki z laboratorium, normy wyłącznie z wydruku ----------
const LABS=[
  {id:'tsh',n:'TSH',u:'µIU/ml',thy:1},
  {id:'ft4',n:'fT4',u:'ng/dl',thy:1,note:'Jednostka zależy od laboratorium (ng/dl albo pmol/l); przepisz ją z wydruku.'},
  {id:'ft3',n:'fT3',u:'pg/ml',thy:1,note:'Jednostka zależy od laboratorium (pg/ml albo pmol/l); przepisz ją z wydruku.'},
  {id:'atpo',n:'Anty-TPO',u:'IU/ml',thy:1},
  {id:'glu',n:'Glukoza na czczo',u:'mg/dl',note:'HOMA-IR policzy się sam, gdy wpiszesz glukozę i insulinę z tej samej daty.'},
  {id:'ins',n:'Insulina na czczo',u:'µIU/ml',note:'HOMA-IR policzy się sam, gdy wpiszesz glukozę i insulinę z tej samej daty.'},
  {id:'hba1c',n:'HbA1c',u:'%'},
  {id:'vitd',n:'Witamina D, 25(OH)D',u:'ng/ml'},
  {id:'ferr',n:'Ferrytyna',u:'ng/ml'},
  {id:'mg',n:'Magnez',u:'mg/dl'},
  {id:'ca',n:'Wapń',u:'mg/dl'},
  {id:'chol',n:'Cholesterol całkowity',u:'mg/dl'},
  {id:'ldl',n:'LDL',u:'mg/dl'},
  {id:'hdl',n:'HDL',u:'mg/dl'},
  {id:'tg',n:'Trójglicerydy',u:'mg/dl'},
  {id:'kreat',n:'Kreatynina',u:'mg/dl'},
  {id:'testo',n:'Testosteron (M, przy objawach)',u:'ng/dl',note:'Badanie służy głównie ocenie objawów niskiego testosteronu; krew pobiera się zwykle rano, między 7 a 10.',src:'medtesto'}
];
const LABN=Object.fromEntries(LABS.map(x=>[x.id,x]));
function fmtDate(d){return d?d.slice(8,10)+'.'+d.slice(5,7)+'.'+d.slice(0,4):''}
function labStatus(e){const L=LABN[e.test],T=L&&L.tg;if(!T)return {t:'brak jednego zakresu docelowego; oceniaj trend z lekarzem',w:0};const v=toCanon(T,e),tt=tgTxt(T);if(v==null)return {t:'jednostka nierozpoznana, nie da się porównać z celem ('+tt+')',w:1};const lo=typeof T.lo==='function'?T.lo():T.lo;if(lo!=null&&v<lo)return {t:'poniżej zakresu docelowego: '+tt,w:1};if((T.hi!=null&&v>T.hi)||(T.lt!=null&&v>=T.lt))return {t:'powyżej zakresu docelowego: '+tt,w:1};return {t:'w zakresie docelowym: '+tt,w:0}}
// eGFR z kreatyniny (18.11.2026): równanie CKD-EPI 2021 ze strony NIDDK „GFR equations, adults” (SCr w mg/dl, wiek ≥ 18 lat);
// kategorie z NHS „Kidney disease: diagnosis” (przegląd 22.03.2023). Wiek z profilu, bez wartości startowej.
function egfrOf(cr,age,fem){const k=fem?0.7:0.9,a=fem?-0.241:-0.302,r=cr/k;return 142*Math.pow(Math.min(r,1),a)*Math.pow(Math.max(r,1),-1.2)*Math.pow(0.9938,age)*(fem?1.012:1)}
function egfrRows(){const age=num(S.age);if(isStart('age')||!(age>=18))return [];return S.labs.filter(e=>e.test==='kreat'&&/mg/i.test(e.unit||'')&&num(e.val)>0).map(e=>({date:e.date,v:egfrOf(num(e.val),age,S.sex!=='M'),cr:!!e.cr})).sort((a,b)=>b.date.localeCompare(a.date))}
function egfrCat(v){return v>=90?'powyżej 90: wynik prawidłowy (stadium 1 tylko przy innych oznakach uszkodzenia nerek)':v>=60?'60-89: lekko obniżony (stadium 2 tylko przy innych oznakach uszkodzenia nerek)':v>=45?'45-59: stadium 3a':v>=30?'30-44: stadium 3b':v>=15?'15-29: stadium 4':'poniżej 15: stadium 5'}
// Cholesterol nie-HDL = całkowity − HDL (NHS „Cholesterol levels”, przegląd 13.03.2026); wartość orientacyjna NHS tylko w mmol/l, bez przeliczania jednostek
function nonHdlRows(){const out=[],hd=S.labs.filter(e=>e.test==='hdl');S.labs.filter(e=>e.test==='chol').forEach(x=>{const mm=/mmol/i.test(x.unit||''),y=hd.find(z=>z.date===x.date&&/mmol/i.test(z.unit||'')===mm);if(y&&num(x.val)>0&&num(y.val)>0)out.push({date:x.date,v:num(x.val)-num(y.val),mmol:mm})});return out.sort((a,b)=>b.date.localeCompare(a.date))}
function homaRows(){const out=[],ins=S.labs.filter(e=>e.test==='ins');S.labs.filter(e=>e.test==='glu').forEach(x=>{const y=ins.find(z=>z.date===x.date);if(y)out.push({date:x.date,v:num(x.val)*num(y.val)/(/mmol/i.test(x.unit)?22.5:405)})});return out.sort((a,b)=>b.date.localeCompare(a.date))}
function nextControl(){const ds=S.labs.map(e=>e.date).filter(Boolean).sort();if(!ds.length)return null;const last=ds.at(-1),n=new Date(Date.parse(last)+90*864e5).toISOString().slice(0,10);return {last,n,overdue:n<todayKey()}}
// „Dodaj następny wynik” (20.11.2026): data pobrania i jednostka zostają z poprzedniego wpisu (ten sam wydruk); po cofnięciu wraca wpisana wartość
let LAB_KEEP=null;
function labDrop(e){S.labs=S.labs.filter(x=>x!==e&&x.id!==e.id);if(LAB_KEEP)LAB_KEEP.back=true}
// Pamięć daty i jednostki tylko tego dnia i tylko na zakładce Badania; po Cofnij wraca cały wpis (granica, na czczo, biotyna, cykl, kreatyna)
const labFresh=()=>{if(LAB_KEEP&&LAB_KEEP.day!==todayKey())LAB_KEEP=null};
function renderLabs(){
  const sel=LABN[S.labSel]?S.labSel:'tsh',L=LABN[sel],inp='font:inherit;font-size:16px;padding:6px 8px;min-height:44px;box-sizing:border-box;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink)';
  let h='<p><button class="btn ghost" data-tab="health">Wróć</button></p>';
  const nc=nextControl();
  h+=nc?`<div class="note ${nc.overdue?'warn':''}">Ostatnie badania: ${fmtDate(nc.last)}. Następna kontrola według planu, co 3 miesiące: ${fmtDate(nc.n)}${nc.overdue?'; termin minął':''}.</div>`:'<div class="note">Brak wyników. Zacznij od kompletu: TSH, fT4, fT3, anty-TPO, glukoza i insulina na czczo, HbA1c, 25(OH)D, ferrytyna, magnez, wapń.</div>';
  h+='<h2>Dodaj wynik</h2><div class="panel">';
  h+=`<div class="field"><label for="l_test">Badanie</label><select id="l_test" data-labsel="1" style="${inp};max-width:210px">${LABS.map(x=>`<option value="${x.id}" ${x.id===sel?'selected':''}>${x.n}</option>`).join('')}</select></div>`;
  labFresh();const lk=LAB_KEEP,lu=lk&&lk.test===sel?lk.unit:L.u,bk=lk&&lk.back&&lk.test===sel?lk:null,lv=bk?bk.raw:'',fb=bk&&bk.f||{};if(lk)lk.back=false;
  h+=`<div class="field"><label for="l_date">Data pobrania</label><input type="date" id="l_date" value="${esc(lk?lk.date:todayKey())}" style="${inp}"></div>`;
  h+=`<div class="field"><label for="l_val">Wynik</label><input type="text" inputmode="decimal" enterkeyhint="next" id="l_val"${lv?` value="${esc(lv)}"`:''}><span class="unit"></span></div>`;
  h+=`<div class="field"><label for="l_unit">Jednostka z wydruku</label><input type="text" id="l_unit" value="${esc(lu)}"><span class="unit"></span></div>`;
  h+='<div class="field"><label for="l_lo">Dolna granica normy z wydruku (opcjonalnie)</label><input type="text" inputmode="decimal" enterkeyhint="next" id="l_lo"'+(fb.lo?` value="${esc(fb.lo)}"`:'')+'><span class="unit"></span></div>';
  h+='<div class="field"><label for="l_fast">Na czczo</label><input type="checkbox" class="switch" id="l_fast"'+(fb.fast?' checked':'')+'></div>';
  if(L.thy)h+='<div class="field"><label for="l_bio">Biotyna odstawiona co najmniej 2-3 dni</label><input type="checkbox" class="switch" id="l_bio"'+(fb.bio?' checked':'')+'></div>';
  if(S.sex==='K')h+='<div class="field"><label for="l_cyc">Tydzień cyklu lub przerwa w tabletkach</label><input type="text" id="l_cyc" placeholder="np. 2"'+(fb.cyc?` value="${esc(fb.cyc)}"`:'')+'><span class="unit"></span></div>';
  if(sel==='kreat')h+='<div class="field"><label for="l_cr">Przyjmuję kreatynę</label><input type="checkbox" class="switch" id="l_cr"'+(fb.cr?' checked':'')+'></div>';
  h+='</div><p>'+actHtml('lab','data-labsave="1"',ACT_L.lab,false)+'</p>';
  h+=L.tg?`<p class="small"><b>Zakres docelowy:</b> ${tgTxt(L.tg)}. Źródło: ${L.tg.src}.</p>`:'<p class="small muted">Dla tego badania nie ma jednego zakresu docelowego: wynik zależy od metody laboratorium. Aplikacja pokaże trend, ocenę zostaw lekarzowi.</p>';
  if(L.note)h+=`<p class="small muted">${L.note}</p>`+srcHtml(L.src);
  const tested=LABS.filter(x=>S.labs.some(e=>e.test===x.id));
  if(tested.length)h+='<h2>Wyniki</h2>'+tested.map(x=>{const es=S.labs.filter(e=>e.test===x.id).sort((a,b)=>b.date.localeCompare(a.date));return `<article class="meal"><div class="mhead"><div class="name">${x.n}</div></div><div class="mdet" style="border-top:0">`+es.map((e,i)=>{const st=labStatus(e),prev=es.at(i+1),d=prev?num(e.val)-num(prev.val):null,norm='',ctx=[e.fast?'na czczo':'',x.thy&&e.bio===false?'biotyna nieodstawiona':'',e.cyc?`tydzień cyklu ${esc(e.cyc)}`:'',e.cr?'przy kreatynie':''].filter(Boolean).join(', ');return `<div class="entry" style="padding:8px 0"><span class="txt">${fmtDate(e.date)}: <b>${esc(e.val)} ${esc(e.unit)}</b>${d!=null?` <span class="small muted">(${d>0?'+':''}${fmt1(d)} od poprzedniego)</span>`:''}<br><span class="small" style="color:${st.w?'var(--clay)':'var(--muted)'}">${st.t}${norm}${ctx?'; '+ctx:''}</span></span><button class="del" data-labdel="${e.id}" aria-label="Usuń wynik">×</button></div>`}).join('')+'</div></article>'}).join('');
  const hr=homaRows();
  if(hr.length)h+=`<div class="note"><b>HOMA-IR</b>, z glukozy i insuliny z tego samego dnia (wzór Matthewsa): ${hr.map(r=>`${fmtDate(r.date)}: ${fmt1(r.v)}`).join('; ')}. Progi interpretacji różnią się między źródłami; ocenia lekarz.</div>`;
  const eg=egfrRows();
  if(eg.length)h+=`<div class="note"><b>eGFR</b>, szacowany przesącz kłębuszkowy z kreatyniny, wieku (${esc(S.age)} lat z profilu) i płci, wzór CKD-EPI 2021 (NIDDK): ${eg.map(r=>`${fmtDate(r.date)}: ${fmt(Math.round(r.v))} ml/min/1,73 m², ${egfrCat(r.v)}${r.cr?'; zaznaczono przyjmowanie kreatyny, powiedz o tym lekarzowi':''}`).join('; ')}. Kategorie według NHS. Jeden wynik nie rozstrzyga; omów go z lekarzem.</div>`;
  const nh=nonHdlRows();
  if(nh.length)h+=`<div class="note"><b>Cholesterol nie-HDL</b>, całkowity minus HDL z tego samego dnia: ${nh.map(r=>`${fmtDate(r.date)}: ${fmt1(r.v)} ${r.mmol?'mmol/l':'mg/dl'}`).join('; ')}. ${nh.some(r=>r.mmol)?'NHS podaje dla zdrowych dorosłych wartość orientacyjną poniżej 4 mmol/l; cel zależy od wieku, chorób i ryzyka sercowo-naczyniowego.':'NHS podaje wartość orientacyjną tylko w mmol/l, więc dla wyników w mg/dl aplikacja pokazuje samą wartość.'} Ocenia lekarz.</div>`;
  if(S.labs.length)h+='<p><button class="btn ghost" data-labcopy="1">Kopiuj wyniki dla lekarza</button></p>';
  h+='<p class="small muted">Status liczony względem zakresów docelowych z wytycznych i badań, nie norm laboratorium. Jednostkę przepisz z wydruku: aplikacja przelicza najczęstsze. Aplikacja nie stawia rozpoznań. Wyniki zostają tylko w tym telefonie.</p>';
  document.getElementById('main').innerHTML=h;
}

// ---------- Zakresy docelowe badań: wytyczne i badania, nie normy laboratoriów ----------
const TGT={
  tsh:{cv:[['iu',1]],lo:0.4,hi:4.0,t:'0,4-4,0 mIU/l',src:'typowy zakres dla dorosłych; przy planowaniu ciąży lekarze często celują poniżej 2,5 (wiedza ogólna, niesprawdzone)'},
  glu:{cv:[['mmol',18],['mg',1]],lo:70,lt:100,t:'70-99 mg/dl',src:'kryteria ADA dla glukozy na czczo (wiedza ogólna, niesprawdzone)'},
  hba1c:{cv:[['mmol',v=>0.09148*v+2.152],['%',1]],lt:5.7,t:'poniżej 5,7%',src:'kryteria ADA (wiedza ogólna, niesprawdzone)'},
  vitd:{cv:[['nmol',0.4],['ng',1]],lo:30,hi:50,t:'30-50 ng/ml',src:'polskie wytyczne 2023, stężenie optymalne'},
  ferr:{cv:[['ng|µg|ug',1]],lo:30,t:'co najmniej 30 ng/ml, przy objawach niedoboru co najmniej 50',src:'wytyczne diagnostyki niedoboru żelaza z 2026 r.'},
  mg:{cv:[['mmol',1],['mg',0.411]],lo:0.85,hi:0.95,t:'0,85-0,95 mmol/l',src:'propozycja ekspertów MaGNet, Eur J Nutr 2022 (nie standard laboratoriów)'},
  chol:{cv:[['mmol',38.67],['mg',1]],lt:190,t:'poniżej 190 mg/dl',src:'wytyczne ESC (wiedza ogólna, niesprawdzone)'},
  ldl:{cv:[['mmol',38.67],['mg',1]],lt:116,t:'poniżej 116 mg/dl przy niskim ryzyku',src:'wytyczne ESC (wiedza ogólna, niesprawdzone)'},
  hdl:{cv:[['mmol',38.67],['mg',1]],lo:()=>S.sex==='M'?40:50,t:()=>S.sex==='M'?'co najmniej 40 mg/dl':'co najmniej 50 mg/dl',src:'wytyczne ESC (wiedza ogólna, niesprawdzone)'},
  tg:{cv:[['mmol',88.57],['mg',1]],lt:150,t:'poniżej 150 mg/dl',src:'wytyczne ESC (wiedza ogólna, niesprawdzone)'}
};
LABS.forEach(x=>{if(TGT[x.id])x.tg=TGT[x.id]});
const tgTxt=T=>typeof T.t==='function'?T.t():T.t;
function toCanon(T,e){const v=num(e.val),u=String(e.unit||'').toLowerCase();for(const [re,f] of T.cv){if(new RegExp(re,'i').test(u))return typeof f==='function'?f(v):v*f}return null}

// ---------- Dziś, jakość danych, przegląd tygodnia, wprowadzenie ----------
// Tryb „raz dziennie”: jeden wieczorny wpis zamiast listy zadań na cały dzień
function onceHtml(){const k=todayKey(),m=S.meas[k]||{},ms=day().filter(e=>e.kind==='m').length,tr=day().some(isMove),st=num(m.steps)>0;
  const row=(ok,lab,val,btns,keep)=>`<div class="step${ok?' done':''}"><span class="box">${ok?'✓':''}</span><span class="lab">${lab}<small class="hint">${val}</small></span>${ok&&!keep?'':'<span class="sbtns">'+btns+'</span>'}</div>`;
  return '<h2>Wpis dnia</h2><div class="panel" style="padding:4px 16px">'
    +row(ms>0,'Posiłki',ms?ms+' zapisane':'Jak wyglądało dziś jedzenie?',actHtml('plan','data-dayplan="1"',ACT_L.plan,false,' small')+'<button class="btn small ghost" data-dayother="1">Inaczej</button>',!!ACTS.plan&&actOf('plan').st==='grace')
    +row(tr,'Trening',tr?'zapisany':'Tylko jeśli dziś był','<button class="btn small ghost" data-tab="train">Z zegarka</button>')
    +row(st,'Kroki',st?fmt(num(m.steps))+' kroków':'Liczba z telefonu','<button class="btn small ghost" data-goto="m_steps">Wpisz</button>')+'</div>'
    +(ms>0&&(tr||st)?'<div class="note">✓ Dzień zapisany. Do jutra wieczorem.</div><p class="nextbar"><button class="btn" data-tab="pet">Zobacz zwierzaka</button></p>':'')}
function focusHtml(){if(S.once)return onceHtml();const k=todayKey(),m=S.meas[k]||{},ms=day().filter(e=>e.kind==='m').length,tr=day().some(isMove),st=num(m.steps)>0;const items=[[num(m.w)>0,'Zważ się rano',num(m.w)>0?fmt1(num(m.w))+' kg':'','goto','m_w','Wpisz wagę w Pomiarach dnia niżej'],[ms>=3,'Zapisz 3 posiłki',ms+' z 3','tab','meals','Otwórz Posiłki i naciśnij Zjem przy daniu'],[tr||st,(S.knee&&S.knee.start&&S.knee.days.includes(new Date().getDay())?'Ruch: dziś sesja kolana':'Ruch: trening albo kroki'),tr?'trening':(st?fmt(num(m.steps))+' kroków':''),'tab','train','Dodaj trening albo wpisz kroki w Pomiarach dnia']];const done=items.filter(x=>x[0]).length,nx=items.findIndex(x=>!x[0]);return `<h2>Dziś: ${done} z 3</h2><div class="panel">`+items.map(([ok,lab,val,act,arg,hint],i)=>`<button class="opt hab ${ok?'on':(i===nx?'next':'')}" data-${act}="${arg}"><span class="box">${ok?'✓':''}</span><span class="lab">${lab}${ok?'':`<small class="hint">${hint}</small>`}</span><span class="met">${val}</span><span class="chev" aria-hidden="true">›</span></button>`).join('')+'</div>'}
function firstDataDay(){const ks=Object.keys(S.days||{}).filter(k=>(S.days[k]||[]).some(e=>e.kind==='m')).sort();return ks[0]||null}
function reliability(){const f=firstDataDay();if(!f)return null;const span=Math.max(1,Math.min(14,Math.round((Date.parse(todayKey())-Date.parse(f))/864e5)+1));let md=0,wd=0;lastKeys(span).forEach(k=>{if((S.days[k]||[]).filter(e=>e.kind==='m').length>=3)md++;if(num((S.meas[k]||{}).w)>0)wd++});return {span,md,wd,pct:Math.round(md/span*100)}}
function relHtml(){const r=reliability();if(!r||r.span<7)return '';const M=measuredTdee(),G=dataGap(),low=r.pct<60;return `<details class="fold"${low?' open':''}><summary>Jakość danych: ${r.pct}% dni z pełnym zapisem</summary><div class="panel" style="padding:4px 16px 12px"><p>Ostatnie ${r.span} ${r.span===1?'dzień':'dni'}: pełny zapis posiłków (co najmniej 3) w ${r.md}, ważenie w ${r.wd}.</p>${low?'<p><b>Poniżej 60%.</b> Uprość: zapisuj z planu dnia przyciskiem „Zjem”, resztę szybkim wpisem.</p>':''}<p>${M?'Zapotrzebowanie liczone z Twoich danych: aktywne.':`Do zapotrzebowania z Twoich danych brakuje w ostatnich 28 dniach: ${Math.max(0,6-G.w)} ważeń (rozłożonych na co najmniej 14 dni) i ${Math.max(0,10-G.i)} dni z pełnym zapisem.`}</p><p class="small muted">Próg 60% to założenie planu, nie wynik badań.</p></div></details>`}
function mondayOf(d){const x=new Date(d);x.setHours(12,0,0,0);x.setDate(x.getDate()-((x.getDay()+6)%7));return keyOf(x)}
function reviewKey(){const d=new Date();return d.getDay()===0?mondayOf(d):mondayOf(new Date(keyAgo(7)+'T12:00:00'))}
function weekStats(mk){const base=Date.parse(mk+'T12:00:00'),ks=Array.from({length:7},(_,i)=>keyOf(new Date(base+i*864e5))),pk=Array.from({length:7},(_,i)=>keyOf(new Date(base+(i-7)*864e5)));const aw=a=>{const v=a.map(k=>num((S.meas[k]||{}).w)).filter(x=>x>0);return v.length?v.reduce((s,x)=>s+x,0)/v.length:null};let md=0,pts=0,ur=0,uok=0;ks.forEach(k=>{if((S.days[k]||[]).filter(e=>e.kind==='m').length>=3)md++;pts+=dayPts(k);(S.urges[k]||[]).forEach(u=>{ur++;if(u.out!=='inne')uok++})});return {ks,w:aw(ks),pw:aw(pk),md,pts,ur,uok}}
function reviewPromptHtml(){const dw=new Date().getDay();if(![0,1,2].includes(dw)||(S.reviews||{})[reviewKey()])return '';return '<p><button class="btn" data-tab="review">Przegląd tygodnia, 2 minuty</button></p>'}
function changeHtml(){const r=Object.entries(S.reviews||{}).sort((a,b)=>b[0].localeCompare(a[0]))[0];if(!r||!r[1].c||Date.now()-Date.parse(r[0]+'T12:00:00')>14*864e5)return '';return `<div class="note"><b>Twoja zmiana na ten tydzień:</b> ${esc(r[1].c)}</div>`}
// ---------- Krok po kroku: rozpoznanie przeszkód i ścieżka gotowania, jeden krok na tydzień (rada/2026-11-08_sciezka-krokow) ----------
const DQ=[['cook','Jak często przygotowujesz posiłek?',[['0','prawie nigdy'],['1','1-3 razy w tygodniu'],['2','prawie codziennie']]],
  ['bar','Co najbardziej przeszkadza w gotowaniu?',[['umiej','nie wiem, co i jak'],['czas','brak czasu'],['sila','brak siły wieczorem'],['skl','brak składników w domu'],['nie','nic nie przeszkadza']]],
  ['ord','Ile razy w tygodniu zamawiasz albo jesz na mieście?',[['0','0-1'],['1','2-3'],['2','4 i więcej']]],
  ['when','Kiedy najczęściej jesz poza planem?',[['rano','rano'],['pop','po południu'],['wiecz','wieczorem'],['roz','różnie'],['rzad','rzadko']]],
  ['why','Z jakiego powodu najczęściej?',[['stres','stres'],['zmecz','zmęczenie'],['nuda','nuda'],['glod','głód'],['nw','nie wiem']]]];
const EQ=[['mikrofala','Mikrofala'],['piekarnik','Piekarnik'],['blender','Blender'],['czajnik','Czajnik'],['zamrazarka','Zamrażarka lub zamrażalnik'],['plyta','Płyta grzewcza'],['airfryer','Frytkownica beztłuszczowa'],['pojemniki','Pojemniki na zapas']];
// Podstawy kroku 2 to składniki dań z kroku 1; krok 1 to posiłki (nie przekąski) bez żadnego gotowania, także bez jajek na twardo z zapasu
const ZAP=[['skyr','Skyr'],['twarog','Twaróg'],['chleb','Chleb żytni'],['tunczyk','Tuńczyk w puszce'],['fasola','Fasola w puszce']];
const NOCOOK=m=>m.t!=='przekaska'&&m.min<=10&&eqOf(m)[0]==='bez gotowania'&&!/na twardo|z zapasu/i.test((STEPS[m.id]||[m.how]).join(' '));
const KROKI=[
  {n:'Bez gotowania',co:'3 razy w tygodniu posiłek złożony bez gotowania, do 10 minut',cel:3,lz:1,f:NOCOOK,nie:'Powtórz krok w łatwiejszej wersji: 1 danie w tygodniu.',
    jt:['Jeśli wracam po 18 i nie mam pomysłu, to najpierw jem danie z listy, a potem decyduję o zamówieniu.','Jeśli rano nie mam czasu, to biorę miskę skyru z płatkami.']},
  {n:'Zapas w domu',co:'kup 5 podstaw i zaznacz je „mam w domu”, zjedz 3 dania z kroku 1',cel:3,lz:3,zt:5,lzt:3,f:NOCOOK,nie:'Łatwiejsza wersja: 3 podstawy zamiast 5.',
    jt:['Jeśli robię zakupy, to najpierw biorę podstawy z listy.','Jeśli w domu kończy się podstawa, to od razu dopisuję ją do listy zakupów.']},
  {n:'Mikrofala',eq:'mikrofala',co:'2 razy w tygodniu danie z mikrofali',cel:2,lz:1,f:m=>{const e=eqOf(m);return m.t!=='przekaska'&&m.min>=7&&e.includes('mikrofala')&&!e.includes('piekarnik')&&!m.prep},nie:'Zostań przy kroku 2 i dodaj 1 danie z mikrofali.',
    jt:['Jeśli wracam bez siły, to robię danie z mikrofali z listy.','Jeśli mam 10 minut, to robię jajecznicę w mikrofali.']},
  {n:'Jedna blacha na 2 dni',eq:'piekarnik',co:'1 danie z piekarnika, zjedzone w 2 dni',cel:2,lz:2,same:1,f:(m,e)=>!m.prep&&eqOf(m).includes('piekarnik')&&(!e||m.min<=20),nie:'Łatwiejsza wersja: danie z piekarnika do 20 minut.',
    jt:['Jeśli jest niedziela wieczorem, to wkładam do piekarnika jedną blachę na 2 dni.','Jeśli piekarnik się grzeje, to od razu kroję warzywa na drugi dzień.']},
  {n:'Na zapas w weekend',co:'1 gotowanie w weekend, potem 3 posiłki z zapasu w tygodniu',cel:3,lz:2,f:m=>!!m.prep,nie:'Łatwiejsza wersja: 2 posiłki z zapasu.',
    jt:['Jeśli jest sobota przed południem, to gotuję jedno danie na zapas.','Jeśli w tygodniu brakuje czasu, to sięgam po pudełko z zapasu.']}];
function krokMeals(i,easy){const K=KROKI[i],e=(S.krok||{}).eq||{},own=Object.keys(e).filter(k=>e[k]);
  return MEALS.filter(m=>K.f(m,easy)&&(!own.length||eqOf(m).every(x=>x==='bez gotowania'||own.includes(x))))}
function kNext(i){for(let j=i+1;j<KROKI.length;j++)if(krokMeals(j).length)return j;return -1}
function kProg(mk){const k=S.krok,K=KROKI[k.step],ids=new Set(krokMeals(k.step,k.easy).map(m=>m.id)),base=Date.parse(mk+'T12:00:00'),cnt={};let n=0;
  for(let i=0;i<7;i++){const dk=keyOf(new Date(base+i*864e5));if(k.since&&dk<k.since)continue;(S.days[dk]||[]).forEach((e,j)=>{if(dk===k.since&&j<(k.from||0))return;if(e.kind==='m'&&ids.has(e.id)){n++;cnt[e.id]=(cnt[e.id]||new Set()).add(i)}})}
  if(K.same)n=Math.max(0,...Object.values(cnt).map(s=>s.size));
  const cel=k.easy?K.lz:K.cel,zt=K.zt?(k.easy?K.lzt:K.zt):0,z=ZAP.filter(([id])=>(k.zap||{})[id]).length;return {n,cel,z,zt,ok:n>=cel&&z>=zt}}
function kChain(){const a=S.krok.ans,L=[];const bar={umiej:'nie wiesz, co i jak ugotować',czas:'brak czasu na gotowanie',sila:'brak siły wieczorem',skl:'brak składników w domu'}[a.bar];
  if(bar)L.push(bar);else if(a.cook==='0')L.push('rzadkie gotowanie');
  if(a.ord==='2')L.push('zamawianie 4 i więcej razy w tygodniu');else if(a.ord==='1')L.push('zamawianie 2-3 razy w tygodniu');
  if(a.when!=='rzad')L.push('jedzenie poza planem '+{rano:'rano',pop:'po południu',wiecz:'wieczorem',roz:'o różnych porach'}[a.when]+({stres:' ze stresu',zmecz:' ze zmęczenia',nuda:' z nudy',glod:' z głodu'}[a.why]||''));
  return L}
function kData(){let o=0,u=0;const t={};for(let i=0;i<14;i++){const k=keyAgo(i);(S.days[k]||[]).forEach(e=>{if(e.ord)o++});(S.urges[k]||[]).forEach(x=>{u++;t[x.trig]=(t[x.trig]||0)+1})}
  const top=Object.entries(t).sort((a,b)=>b[1]-a[1])[0];return o||u?`Z Twoich zapisów z 14 dni: zamówienia ${o}, ochoty ${u}${top&&TRIGN[top[0]]?` (najczęściej: ${TRIGN[top[0]]})`:''}.`:'Brak zapisów z 14 dni, więc łańcuch wynika tylko z odpowiedzi.'}
function krokCardHtml(){const k=S.krok;if(!k||!k.conf){const c=changeHtml(),t=!S.onb?'':!k?'Co mi utrudnia? 2 minuty':'Dokończ rozpoznanie',bt='<button class="btn ghost'+(c?' small':'')+'" data-tab="krok">'+t+'</button>';
  // Mniej ramek: zmiana tygodnia i rozpoznanie w jednym kafelku
  return !t?c:c?c.replace(/<\/div>$/,'<p class="cardact">'+bt+'</p></div>'):'<p>'+bt+'</p>'}
  if(k.fin)return '<div class="note"><b>Ścieżka gotowania ukończona.</b> Kolejne ścieżki (zamawianie, ochoty) pojawią się w następnym etapie.</div>';
  const K=KROKI[k.step],p=kProg(mondayOf(new Date()));
  return `<div class="note"><b>Twój krok na ten tydzień:</b> ${K.n} (${k.step+1} z 5)${k.easy?', łatwiejsza wersja':''}<br>${K.co}. Postęp: ${p.n} z ${p.cel}${p.zt?`, zapas ${p.z} z ${p.zt}`:''}.${p.ok?' <b>Krok wykonany.</b>':''}${k.jt!=null&&K.jt[k.jt]?`<br>Twój plan: ${K.jt[k.jt]}`:''}</div><p><button class="btn ghost" data-tab="krok">${p.ok?'Następny krok':'Co zrobić w tym kroku'}</button></p>`+changeHtml()}
function renderKrok(){const k=S.krok,chip=(on,data,l,c)=>`<button class="chip${c?' '+c:''}${on?' inc':''}" ${data} aria-pressed="${!!on}">${l}</button>`;
  let h='<p><button class="btn ghost" data-tab="day">Wróć</button></p>';
  if(!k||!k.done){const a=(k||{}).ans||{},e=(k||{}).eq||{};
    h+='<h2>Co Ci utrudnia?</h2><p>5 pytań, każde na jedno dotknięcie. Pytamy o to, czego brakuje: wiedzy, czasu, siły, składników. Odpowiedzi zostają w telefonie.</p>';
    h+=DQ.map(([q,t,o])=>`<p style="margin:12px 4px 4px"><b>${t}</b></p><div class="chips">`+o.map(([v,l])=>chip(a[q]===v,`data-kq="${q}:${v}"`,l)).join('')+'</div>').join('');
    h+='<p style="margin:12px 4px 4px"><b>Co masz w kuchni?</b> Zaznacz wszystko, co masz. Bez zaznaczenia pokażemy wszystkie dania.</p><div class="chips">'+EQ.map(([v,l])=>chip(e[v],`data-keq="${v}"`,l)).join('')+'</div>';
    h+='<p><button class="btn" data-kres="1">Pokaż, co mi utrudnia</button></p>'+srcHtml('michie');
  }else if(!k.conf){const L=kChain(),cookOk=k.ans.cook==='2'&&k.ans.bar==='nie';
    h+=`<h2>Twoje przeszkody</h2><div class="note">${L.length?`<b>${esc(L.join(' → '))}</b>`:'Z odpowiedzi nie wynika wyraźna przeszkoda.'}</div><p>${kData()}</p><p>To przypuszczenie z Twoich odpowiedzi, nie ocena. Czy to o Tobie?</p>`;
    if(cookOk)h+='<p class="small muted">Gotowanie nie wygląda na przeszkodę. Ścieżki dla zamawiania i ochot powstaną w kolejnym etapie; możesz już teraz zacząć od gotowania.</p>';
    h+='<p><button class="btn" data-kconf="1">Tak, zaczynam od gotowania</button></p><p><button class="btn ghost" data-kdiag="1">Nie całkiem: zmień</button></p>'+srcHtml(['michie','wolfson']);
  }else if(k.fin){h+='<div class="note"><b>Ścieżka gotowania ukończona.</b></div><p><button class="btn ghost" data-kdiag="1">Rozpoznanie od nowa</button></p>'}
  else{const K=KROKI[k.step],p=kProg(mondayOf(new Date())),ms=krokMeals(k.step,k.easy);
    h+=`<h2>Krok ${k.step+1} z 5: ${K.n}</h2><div class="note"><b>W tym tygodniu:</b> ${K.co}.<br>Postęp z Twoich zapisów: ${p.n} z ${p.cel}${p.zt?`, zapas ${p.z} z ${p.zt}`:''}.${p.ok?' <b>Krok wykonany.</b>':''}</div>`;
    if(K.zt)h+='<p style="margin:12px 4px 4px"><b>Podstawy do kupienia</b></p><div class="chips">'+ZAP.map(([v,l])=>chip((k.zap||{})[v],`data-kzap="${v}"`,(k.zap||{})[v]?l+': mam w domu':l)).join('')+'</div>';
    h+='<h3 class="rh" style="margin:12px 4px 8px">Dania tego kroku</h3><div class="panel">'+ms.map(m=>`<div class="entry"><span class="txt">${m.n}, ${m.min} min</span><button class="btn ghost small" data-recipe="${m.id}">Przepis</button></div>`).join('')+'</div>';
    h+='<p style="margin:12px 4px 4px"><b>Twój plan „jeśli…, to…”</b>'+(k.jt==null?' Wybierz jeden: zobaczysz go w Moim dniu.':'')+'</p><div class="chips">'+K.jt.map((t,i)=>chip(k.jt===i,`data-kjt="${i}"`,t,'opt')).join('')+'</div>';
    h+=`<p><b>Gdy się nie uda:</b> ${K.nie} Pominięty dzień nie przerywa kroku.</p>`;
    if(p.ok)h+='<p><button class="btn" data-kroknext="1">Następny krok</button></p>';
    h+='<p class="small muted">Miara sama sprawdza krok w przeglądzie tygodnia. Jedna nowa rzecz naraz.</p>'+srcHtml(['harkin','gollw','lally'])+'<p><button class="btn ghost" data-kdiag="1">Rozpoznanie od nowa</button></p>'}
  document.getElementById('main').innerHTML=h}
function kStart(i){const k=S.krok,t=todayKey();k.step=i;k.easy=false;k.since=t;k.from=(S.days[t]||[]).length;k.jt=null}
// Potwierdzenie przeszkód: pierwszy raz albo po ukończeniu od kroku 1; przy powtórce rozpoznania bieżący krok zostaje (z postępem), chyba że brak do niego sprzętu
function kConfirm(){const k=S.krok,fresh=k.step==null||k.fin,i=fresh?kNext(-1):krokMeals(k.step).length?k.step:kNext(k.step);k.conf=true;k.zap=k.zap||{};if(!fresh&&i===k.step)return;k.fin=i<0;if(i>=0)kStart(i)}
function krokRevHtml(mk,end){const k=S.krok;if(!k||!k.conf||k.fin||k.since>end)return '';const K=KROKI[k.step],p=kProg(mk),base=Date.parse(mk+'T12:00:00'),act=Array.from({length:7},(_,i)=>keyOf(new Date(base+i*864e5))).filter(x=>x>=k.since).length;
  if(act<4&&!p.ok)return `<h2>Twój krok: ${K.n}</h2><div class="note">Krok trwa od ${fmtDate(k.since)}, za krótko na ocenę: oceni go następny przegląd. Postęp liczy się dalej w tym tygodniu.</div>`;
  return `<h2>Twój krok: ${K.n}</h2><div class="note">${p.ok?'<b>Krok wykonany</b>':'Krok jeszcze nie wyszedł'}: ${p.n} z ${p.cel}${p.zt?`, zapas ${p.z} z ${p.zt}`:''}.${p.ok?'':' To informacja, nie ocena.'}</div>`+(p.ok?'<p><button class="btn" data-kroknext="1">Następny krok</button></p>':'<div class="navrow"><button class="btn ghost" data-krokrep="1">Powtórz krok</button><button class="btn ghost" data-krokeasy="1">Łatwiejsza wersja</button><button class="btn ghost" data-krokdiag="1">Inna przeszkoda</button></div>')}
// Zwierzak podsumowuje tydzień jednym zdaniem z danych; bez ocen i kar (punkt 3)
// Sygnały brzucha (sygnaly.js): jeden sygnał na ekranie; alarm 112 także bez zwierzaka (zwykła karta note warn)
const sygEm=t=>esc(t).replace(/\*([^*]+)\*/g,'<i>$1</i>'),sygPew=x=>x.rm?'reguła Miary':'z wytycznej';
function sygCoHtml(x){const L=x.co.filter(c=>!x.x.includes(String(c).trim().replace(/\.$/,'')));return L.length?`<p><b>Działanie:</b></p><ul>${L.map(c=>`<li>${sygEm(c)}</li>`).join('')}</ul>`:''}
// Alarm ogłaszany raz (rada P2, 15.11.2026): render() podmienia #main, więc role="alert" tylko przy pierwszym wyświetleniu w danym dniu
// w tej sesji strony; potem ten sam wygląd jako region „Pilne”, żeby czytnik ekranu nie powtarzał go po każdym dotknięciu
let SYG_AL='';
// Lista na wizytę jako przełącznik (rada P2, 15.11.2026): drugie dotknięcie zdejmuje sygnał z listy
function wizBtn(id){const on=Array.isArray(S.wizList)&&S.wizList.includes(id);return `<button class="btn ghost small" data-sygwiz="${esc(id)}" aria-pressed="${on}">${on?'✓ Na liście na wizytę':'Dodaj do listy na wizytę'}</button>`}
function sygHtml(){if(typeof SYG==='undefined')return '';const x=SYG.visible(S,todayKey())[0];if(!x)return '';const al=x.lvl==='112',pet=!!S.pet;
  if(al){const body=`<p><b>${pet?esc(PET.nameOf(S.pet))+':':esc(x.t)}</b> ${sygEm(x.x)}</p><p><b>Dane:</b> ${sygEm(x.d)}</p><p class="cardact"><a class="btn" href="tel:112">Zadzwoń 112</a> albo jedź na SOR</p>`;
    const role=SYG_AL!==todayKey()?'role="alert"':'role="region" aria-label="Pilne"';SYG_AL=todayKey();
    return pet?`<div class="petsay syg alert" ${role}>${PET.svg(S.pet.kind,'chick','alert',null)}<div>${body}</div></div>`:`<div class="note warn" ${role}>${body}</div>`}
  const body=`<p><b>${pet?esc(PET.nameOf(S.pet))+':':esc(x.t)}</b> ${sygEm(x.x)}</p><p><b>Dane:</b> ${sygEm(x.d)}</p><p><b>Pewność:</b> ${sygPew(x)}</p>${sygCoHtml(x)}`
    +`<p class="cardact"><button class="btn ghost small" data-sygsrc="${esc(x.id)}">Źródło i szczegóły</button> ${wizBtn(x.id)} <button class="btn ghost small" data-sygseen="${esc(x.id)}">Przeczytane</button></p>`;
  return pet?`<div class="petsay syg">${PET.svg(S.pet.kind,'chick','ok',null)}<div>${body}</div></div>`:`<div class="note">${body}</div>`}
const HPS=[['zlecone','zlecił badanie'],['potw','<i>H. pylori</i> potwierdzone'],['leczone','po leczeniu'],['wykl','wykluczone'],['nic','nic nie zlecił']];
function sygCardHtml(){if(!((S.prof||{}).cond||{}).gut||typeof SYG==='undefined')return '';const L=SYG.ocen(S,todayKey(),{all:true}),hp=(S.wizyta||{}).hp||'brak';
  return '<section class="plan" id="sygnaly"><h2>Sygnały z Twoich wpisów</h2>'+(L.length?L.map(x=>`<div class="act" id="syg_${esc(x.id)}" tabindex="-1"><h3>${esc(x.t)}</h3><p>${sygEm(x.x)}</p><p class="small"><b>Dane:</b> ${sygEm(x.d)}</p><ul>${x.co.map(c=>`<li>${sygEm(c)}</li>`).join('')}</ul>${['wkrotce','badanie','sam'].includes(x.lvl)?`<p class="cardact">${wizBtn(x.id)}</p>`:''}<span class="ev">${sygPew(x)}</span>${srcHtml(x.src)}</div>`).join(''):'<p class="small muted">Brak sygnałów z ostatnich 28 dni.</p>')
    +'<h3>Co ustalił lekarz?</h3><div class="chips" role="group" aria-label="Co ustalił lekarz?">'+HPS.map(([v,n])=>`<button class="chip${hp===v?' inc':''}" data-hp="${v}" aria-pressed="${hp===v}">${n}</button>`).join('')+'</div></section>'}
function petSay(ks){if(!S.pet)return '';const n=ks.filter(k=>(S.days[k]||[]).length||Object.values(S.meas[k]||{}).some(v=>num(v)>0)).length;
  const t=n===0?'Jestem tu. Jeden wpis w nowym tygodniu i znów rosnę.':n===7?'Wszystkie 7 dni z wpisami: to był nasz wspólny tydzień.':n>=4?`${n} dni z wpisami: rosnę razem z Tobą.`:`${n} ${n===1?'dzień':'dni'} z wpisami: każdy taki dzień to dla mnie krok do przodu.`;
  return `<div class="petsay">${PET.svg(S.pet.kind,'chick','happy',null)}<p><b>${esc(PET.nameOf(S.pet))}:</b> ${t}</p></div>`}
// ---------- Dane ze Skrótu (Apple Zdrowie): adres #import?w=…&kroki=…&sen=…&data=… albo tekst w schowku (rada/2026-11-09_integracja-zdrowie) ----------
// Część adresu po „#” nie trafia na serwer (MDN); zapis dopiero po potwierdzeniu, te same zakresy co wpis ręczny
const IMP_K={w:'w',waga:'w',weight:'w',kroki:'steps',steps:'steps',sen:'sleep',sleep:'sleep'},IMP_N={w:'Waga',steps:'Kroki',sleep:'Sen'};
function parseImport(t){const r={date:todayKey(),vals:{},bad:[]};
  String(t||'').split(String.fromCharCode(10)).join('&').split(/[&;]/).forEach(p=>{const i=p.indexOf('=');if(i<1)return;const k=p.slice(0,i).trim().toLowerCase();let v=p.slice(i+1).trim();try{v=decodeURIComponent(v.split('+').join(' '))}catch(e){}
    if(k==='data'||k==='date'){if(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(v)&&v<=todayKey())r.date=v;return}
    const f=IMP_K[k];if(!f||v==='')return;const c=checkNum('meas.d.'+f,v);if(c.err)r.bad.push(`${IMP_N[f]}: ${v}`);else r.vals[f]=c.s});
  return r}
function impFromHash(h){h=String(h||'');if(!/^#import[?]/.test(h))return false;S.imp=parseImport(h.slice(8));S.tab='import';
  try{if(typeof history!=='undefined'&&history.replaceState)history.replaceState(null,'',location.pathname+location.search)}catch(e){}return true}
const impShow=(f,v)=>f==='w'?fmt1(num(v))+' kg':f==='steps'?fmt(num(v)):fmtSleep(num(v));
function renderImport(){const I=S.imp;let h='<h2>Dane ze Skrótu</h2>';
  if(!I){document.getElementById('main').innerHTML=h+'<p>Brak danych do zapisania.</p><p><button class="btn ghost" data-tab="day">Mój dzień</button></p>';return}
  const m=S.meas[I.date]||{},ks=Object.keys(I.vals);
  if(ks.length)h+=`<div class="note">Dzień ${fmtDate(I.date)}:<br>`+ks.map(f=>`${IMP_N[f]}: <b>${impShow(f,I.vals[f])}</b>${num(m[f])>0?` (obecnie ${impShow(f,m[f])}, zostanie zastąpione)`:''}`).join('<br>')+'</div><p>Zapisać?</p><p><button class="btn" data-impsave="1">Zapisz</button></p>';
  else h+='<div class="note warn">Brak wartości do zapisania.</div>';
  if(I.bad.length)h+=`<p class="small muted">Pominięte, bo poza zakresem: ${esc(I.bad.join(', '))}.</p>`;
  h+='<p><button class="btn ghost" data-impskip="1">Pomiń</button></p><p class="small muted">Dane przyszły w adresie albo w schowku tego telefonu i nie trafiają na serwer. Instrukcja Skrótu jest w Pomocy.</p>';
  document.getElementById('main').innerHTML=h}
function skrotHelpHtml(){const base=typeof location!=='undefined'&&location.origin&&location.origin!=='null'?location.origin+location.pathname:'https://miara-pwa.vercel.app/';
  return `<h2 id="skrot">Pobieraj wagę, kroki i sen z Apple Zdrowie</h2><div class="panel" style="padding:4px 16px 12px"><p class="small"><b>Dla Miary z ikony na ekranie głównym</b> (dane i kopia zostają w tej aplikacji):</p><ol class="small" style="padding-left:20px">`
    +'<li>Otwórz aplikację Skróty i dodaj nowy skrót.</li>'
    +'<li>Dodaj działania, które pobierają dane zdrowia (w wyszukiwarce działań wpisz „Zdrowie”): ostatnią wagę, sumę kroków z dziś i sen z ostatniej nocy w godzinach i minutach.</li>'
    +'<li>Dodaj działanie „Kopiuj do schowka” z tekstem <code>w=[waga]&amp;kroki=[kroki]&amp;sen=[sen]</code>, w nawiasy wstaw wyniki z kroku 2.</li>'
    +'<li>Dodaj działanie „Pokaż powiadomienie” z tekstem „Dane dla Miary w schowku”.</li>'
    +'<li>Otwórz Miarę z ikony: Mój dzień, Pomiary dnia, Wklej ze Skrótu, sprawdź wartości i naciśnij Zapisz. Bez tego nic się nie zapisze.</li>'
    +'<li>Codziennie samo: w Skrótach Automatyzacja, Pora dnia, np. 21:00, i ten skrót; wieczorem zostaje jedno dotknięcie w Mierze.</li></ol>'
    +`<p class="small muted">Inna droga, dla Miary w Safari: zamiast kroków 3-4 działanie „Otwórz URL” z adresem <code style="word-break:break-all">${esc(base)}#import?w=[waga]&amp;kroki=[kroki]&amp;sen=[sen]</code>. Adres otwiera się w Safari (sprawdzone na iPhonie), które ma inne dane niż Miara z ikony, więc przy ekranie głównym wybierz schowek. Nazwy działań mogą się różnić w wersjach iOS.</p></div>`}
function renderReview(){
  const mk=reviewKey(),st=weekStats(mk),ex=(S.reviews||{})[mk]||{},end=st.ks.at(-1);
  const ta=(id,lab,ph,v)=>`<h2>${lab}</h2><div class="panel" style="padding:10px 16px"><textarea id="${id}" rows="2" placeholder="${ph}" aria-label="${lab}" style="width:100%;font:inherit;border:1px solid var(--field);border-radius:10px;padding:8px;background:var(--bg);color:var(--ink)">${esc(v||'')}</textarea></div>`;
  let h='<p><button class="btn ghost" data-tab="day">Wróć</button></p>';
  h+=`<div class="note"><b>Tydzień ${fmtDate(mk)}-${fmtDate(end)}</b><br>Pełny zapis posiłków: ${st.md} z 7 dni. Punkty: ${fmt(st.pts)}. Ochoty: ${st.ur}${st.ur?`, w tym ${st.uok} bez jedzenia spoza planu`:''}.${st.w!=null?` Średnia waga: ${fmt1(st.w)} kg${st.pw!=null?`, tydzień wcześniej ${fmt1(st.pw)} kg`:''}.`:' Brak ważeń w tym tygodniu.'}</div>`+petSay(st.ks)+(!st.md&&st.w==null&&!st.ur&&!st.pts?'<div class="note">Pierwszy przegląd ma sens po tygodniu wpisów. Zacznij od wagi i posiłków w Moim dniu, a za tydzień zobaczysz tu podsumowanie.</div><p><button class="btn" data-tab="day">Przejdź do Mojego dnia</button></p>':'')+krokRevHtml(mk,end);
  h+=ta('r_a','Co zadziałało?','np. przekąska w torbie w pracy',ex.a)+ta('r_b','Co nie zadziałało?','np. podjadanie po 15:00',ex.b)+(S.krok&&S.krok.conf&&!S.krok.fin?'<details class="fold"><summary>Własna zmiana (opcjonalnie)</summary>'+ta('r_c','Własna zmiana na przyszły tydzień','np. herbata o 15:00 zamiast ciastka',ex.c)+'</details>':ta('r_c','Jedna zmiana na przyszły tydzień','np. herbata o 15:00 zamiast ciastka',ex.c));
  h+='<p><button class="btn" data-revsave="1">Zapisz przegląd</button></p><p class="small muted">Jedna zmiana naraz. Zobaczysz ją przez tydzień na górze Mojego dnia.</p>';
  document.getElementById('main').innerHTML=h;
}
// Wprowadzenie (rada/2026-11-09_pierwsze-uruchomienie): jeden ekran danych, bez kart z samym opisem (NN/g odradza);
// „3 rzeczy dziennie” prowadzą Pierwsze kroki, a zwierzaka zapowiada komunikat po Zaczynam
// Na ekran główny: kroki z Podręcznika użytkownika iPhone'a (Safari) i Pomocy Google Chrome (Android), otwarte 10.11.2026
function isApp(){try{return navigator.standalone===true||(typeof matchMedia==='function'&&matchMedia('(display-mode: standalone)').matches)}catch(e){return false}}
function ekranHtml(inner){
  if(isApp())return (inner?'':'<h2 id="ekran">Na ekranie głównym</h2>')+'<p class="small">Miara jest na ekranie głównym i otwierasz ją z ikony. Dane zostają w tym telefonie.</p>';
  const and=String(navigator.userAgent||'').includes('Android');
  // Kroki każdego telefonu w zwiniętej sekcji ze źródłem (plan „Łatwość”, zadanie 7); we wprowadzeniu sekcja tego telefonu otwarta
  const ef=(id,t,body,own)=>`<details class="fold" data-fold="ekran_${id}"${(inner&&own)||OPEN_F.has('ekran_'+id)?' open':''}><summary>${t}</summary><div class="panel" style="padding:4px 16px 12px">${body}</div></details>`;
  const ios=ef('ios','iPhone (Safari)','<ol class="steps"><li>Otwórz tę stronę w Safari.</li><li>Stuknij w przycisk menu strony (…), a potem w Udostępnij. Przy układzie kart Na dole lub Na górze od razu stuknij w przycisk udostępniania.</li><li>Przewiń listę w dół i stuknij w „Do ekranu głównego”. Jeśli jej nie ma, na dole listy stuknij w „Edytuj czynności” i dodaj „Do ekranu głównego”.</li><li>Wybierz „Otwórz jako aplikację www”, jeśli widzisz tę opcję, i stuknij w „Dodaj”.</li></ol><p class="srcl">Źródło: <a href="https://support.apple.com/pl-pl/guide/iphone/iph42ab2f3a7/ios" target="_blank" rel="noopener">Podręcznik użytkownika iPhone’a</a></p>',!and);
  const an=ef('and','Android (Chrome)','<ol class="steps"><li>Otwórz tę stronę w Chrome.</li><li>Na prawo od paska adresu stuknij w Więcej (⋮), potem w „Zainstaluj i utwórz skrót”, a potem w „Zainstaluj”.</li><li>Postępuj zgodnie z instrukcjami na ekranie.</li></ol><p class="srcl">Źródło: <a href="https://support.google.com/chrome/answer/9658361?hl=pl&amp;co=GENIE.Platform%3DAndroid" target="_blank" rel="noopener">Pomoc Google Chrome</a></p>',and);
  return (inner?'':'<h2 id="ekran">Na ekran główny</h2>')+'<p class="small">Z ikony Miara otwiera się jak aplikacja i działa bez internetu. Otwieraj ją zawsze z ikony: ikona i przeglądarka mogą mieć osobne dane.</p>'+(and?an+ios:ios+an)+'<p class="small muted">Masz już dane w przeglądarce? Przenieś je plikiem kopii (Ustawienia, Kopia danych).</p>';
}
function renderIntro(){
  let h='<h2 style="font-size:24px">Twoje dane</h2><p>Miara podpowiada, co zjeść, i liczy kalorie z Twoich danych. Dane zostają tylko w tym telefonie.</p>'+(S.lite?'<p><button class="btn" data-introdone="1">Zacznij od szybkiego wpisu</button></p>':'')+seg([['K','Kobieta'],['M','Mężczyzna']],S.sex,'sex','','Płeć')+'<div class="panel">'+rwHtml('pf',['kg','cm','age','goal'])+RW_TIP+'</div>'+goalHint()+goalPctHtml()+'<p class="small muted">Zmienisz je w każdej chwili w Ustawieniach.</p>'+'<p><button class="btn" data-introdone="ok">Zaczynam</button></p>';
  if(!isApp())h+=fold('ekranintro','Jak dodać Miarę do ekranu głównego',ekranHtml(true));
  if(!S.lite)h+='<p style="text-align:center"><button class="btn ghost" data-introdone="1">Pomiń</button></p>';
  document.getElementById('main').innerHTML=h;
}

// ---------- Profil płci, cykl, nogi ----------
function stageInfo(){const ks=Object.keys(S.meas||{}).filter(k=>num(S.meas[k].w)>0).sort();if(!ks.length)return null;const start=num(S.meas[ks[0]].w),now=kg(),goal=start*0.95;return {start,now,goal,pct:Math.max(0,Math.min(100,(start-now)/(start-goal)*100)),since:ks[0]}}
function ffmTrend(){const ks=Object.keys(S.meas||{}).filter(k=>num(S.meas[k].ffm)>0).sort();if(ks.length<2)return null;return {a:num(S.meas[ks[0]].ffm),b:num(S.meas[ks.at(-1)].ffm),from:ks[0],to:ks.at(-1)}}
function sexHtml(){
  const si=stageInfo(),pT=Math.round(protTarget());let h='<h2>Twój priorytet</h2><div class="note">';
  if(S.sex==='K'){
    h+=`<p><b>Ochrona mięśni.</b> W badaniu PREVIEW kobiety traciły przy redukcji więcej masy beztłuszczowej niż mężczyźni. Dlatego: białko ok. ${pT} g dziennie i 2 treningi siłowe w tygodniu.</p>`;
    const f=ffmTrend();
    if(f){const d=f.b-f.a;h+=d<=-0.5?`<p><b>FFM spadła o ${fmt1(-d)} kg</b> (${fmtDate(f.from)} do ${fmtDate(f.to)}). Sprawdź białko i treningi. Pojedynczy pomiar BIA może się mylić, potwierdź go kolejnym w tych samych warunkach.</p>`:`<p>FFM: z ${fmt1(f.a)} na ${fmt1(f.b)} kg, bez wyraźnego spadku.</p>`}
    else h+='<p class="small muted">Wpisuj FFM z pomiaru BIA co 4 tygodnie, żeby aplikacja pilnowała mięśni.</p>';
  }else if(S.mode==='masa'){
    h+=`<p><b>Przyrost masy.</b> Priorytet: trening siłowy, białko ok. ${fmt(protTarget())} g dziennie i powolny przyrost masy, żeby rosły głównie mięśnie.</p>`;
  }else if(S.mode==='utrzymanie'){
    h+='<p><b>Utrzymanie masy.</b> Priorytet: trening siłowy, średnia waga w paśmie ±1 kg i kontrola badań. Gdyby kiedyś zaczął się etap redukcji: w badaniu DiOGenes mężczyźni szybciej chudli, ale częściej odzyskiwali masę.</p>';
  }else{
    h+='<p><b>Utrzymanie po szybkim starcie.</b> W badaniu DiOGenes mężczyźni chudli szybciej, ale w ciągu 6 miesięcy odzyskiwali więcej masy niż kobiety. Dlatego po etapie 5% przejdź do utrzymania, zanim zaczniesz kolejny etap.</p>';
  }
  if(si&&S.mode==='redukcja')h+=`<p>Etap 5%: z ${fmt1(si.start)} na ${fmt1(si.goal)} kg, wykonano ${Math.round(si.pct)}%.${si.pct>=100?(S.sex==='M'?' <b>Etap osiągnięty: czas na utrzymanie.</b>':' <b>Etap osiągnięty.</b> Ocena z lekarzem i decyzja: utrzymanie albo kolejny etap.'):''}</p>`;
  return h+'</div>';
}
function cycHtml(k){if(S.sex!=='K')return '';const c=(S.meas[k]||{}).cyc||'';return '<p id="cykl" style="margin:10px 4px 4px">Tydzień cyklu dziś</p>'+whyP('cykl')+'<div class="chips">'+[['1','Tydzień 1'],['2','Tydzień 2'],['3','Tydzień 3'],['4','Tydzień 4'],['P','Przerwa w tabletkach']].map(([v,l])=>`<button class="chip ${c===v?'inc':''}" data-cyc="${v}" aria-pressed="${c===v}">${l}</button>`).join('')+'</div>'}
// Wiersze z zapisem od razu (wpisy.js, runda 2): kroki w szybkim wpisie i skale 0-10; zapis w dotychczasowym formacie danych
function qSet(act,v,meta){const k=todayKey();v=Math.round(+v);if(!isFinite(v))return;
  // Kroki: kopia ostatniej wartości (dotknięcie suwaka) ze znacznikiem meas.cp; prawdziwa wartość go zdejmuje
  if(act==='steps'){const m=S.meas[k]=S.meas[k]||{},wf=liteFull(k),cp=new Set(m.cp||[]);m.steps=String(Math.max(0,Math.min(LIM.steps[1],v)));if(meta&&meta.copied)cp.add('steps');else cp.delete('steps');if(cp.size)m.cp=[...cp];else delete m.cp;if(!wf&&liteFull(k)){PET.react('weigh');liteCollapse(k,true)}return}
  v=Math.max(0,Math.min(10,v));
  if(act==='leg:b'||act==='leg:c'){S.legs=S.legs||{};S.legs[k]=S.legs[k]||{};const pv=S.legs[k][act.slice(4)];S.legs[k][act.slice(4)]=v;petHealth(act,v,pv)}
  else if(act==='gutb'){S.gut=S.gut||{};const g=S.gut[k]=S.gut[k]||{},pv=g.b;g.b=v;petHealth('gutb',v,pv)}
  else if(act==='kpain'){S.knee.tmpPain=v}
  else if(act==='footpain'){S.insole=S.insole||{days:{},pain:{}};S.insole.pain=S.insole.pain||{};S.insole.pain[k]=v}}
// Start: dzisiejsza wartość albo ostatnia wyszarzona z „ostatnio: X”; wpis dopiero po dotknięciu (puszczenie suwaka, − albo +)
function qSpec(o){return Object.assign({day:todayKey(),edit:false,grid:true,step:1,lim:[0,10],range:[0,10],fmt:v=>String(v),vt:v=>v+' z 10',pm:[o.label+': mniej',o.label+': więcej'],lastLab:l=>String(l.v),hintLast:'',
  put:(v,meta)=>qSet(o.act,v,meta),start:o.today!=null?{v:o.today,src:'today'}:o.last?{v:o.last.v,src:'last'}:{v:o.def||0,src:'default'}},o)}
function scaleHtml(act,label,today,last,hi){return WPISY.rows('q',todayKey(),[qSpec({key:act.replace(':',''),act,label,today:today==null?null:+today,last:last==null?null:{v:+last},ends:['0 brak','10 '+(hi||'najgorszy')]})])}
function stepsRowHtml(m,k){const ts=String(m.steps==null?'':m.steps).trim(),l=wpLast('steps',k);
  return WPISY.rows('q',k,[qSpec({key:'steps',act:'steps',label:'Kroki',today:ts!==''?Math.round(num(ts)):null,last:l,def:5000,edit:true,step:50,coarse:500,range:[0,20000],lim:LIM.steps,inputmode:'numeric',fmt:WF.k,vt:v=>WF.k(v)+' kroków',
    lastLab:x=>x.date,hintLast:'jak ostatnio?',copyTap:true,hintDefault:'przesuń suwak albo dotknij liczby',parse:t=>wpParse('k',t),editText:v=>String(Math.round(v)),pm:['50 kroków mniej','50 kroków więcej']})])}
// Wiersze wartości poza kartą „Dziś” (zadanie 5, 20.11.2026): Trening, obwody, skład ciała, sprawność i profil jako wiersze wpisy.js (ten sam komponent).
// Zapis od razu (save:'immediate') do tej samej ścieżki danych co dawne pole: format stpFmt, wpis przez checkNum i zakresy LIM, reakcje Zdrowia jak po polu.
// Trening: wiersze to wartości formularza (S.tr), nie pomiary; trening dodaje dopiero przycisk, więc wiersz nie potrzebuje osobnego zatwierdzenia.
// Start: dzisiejsza (zapisana) wartość, inaczej ostatnia wyszarzona z datą, inaczej typowa wyszarzona; wyszarzona trafia do danych dopiero po zmianie albo potwierdzeniu.
const RW_DEF={waist:[80,92],hip:[100,100],thigh:[55,55],wrist:[15.5,17.5],ankle:[21,23],fat:[30,20],ffm:[46,62],ecw:[39,39],vo2:[33,40],hrRest:[65,65]};
function rwNum(st){return v=>numStep(v,st,true)}
function rwSpec(o){const st=o.step,nf=rwNum(st),u=o.unit,raw=stpVal(o.path),stT=nf(st);
  const today=o.today!==undefined?o.today:raw!=null&&String(raw).trim()!==''&&num(raw)>0?num(raw):null,last=o.last||null;
  const start=today!=null?{v:today,src:'today'}:last?{v:last.v,src:'last'}:{v:o.def,src:'default'};
  return Object.assign({key:o.key,id:o.id,day:todayKey(),label:o.label,today,last,start,step:st,coarse:o.coarse,range:o.range,lim:o.lim||LIM[o.path.split('.').pop()],grid:st>=.5,edit:true,copy:false,enterNext:true,
    inputmode:st<1?'decimal':'numeric',fmt:v=>nf(v)+' '+u,editText:v=>st<1?nf(v):String(Math.round(v)),lastLab:l=>l.date,hintLast:'',hintDefault:'',
    pm:[o.label+' o '+stT+' '+u+' mniej',o.label+' o '+stT+' '+u+' więcej'],
    parse:t=>{const c=checkNum(o.path,String(t==null?'':t));if(c.err)return {err:c.err+'.'};if(c.s==='')return {err:'Wpisz liczbę.'};return {v:num(c.s)}},
    put:v=>rwPut(o,v),announce:v=>rwSay(o,v)},o.x||{})}
function rwPut(o,v){const a=o.path.split('.'),prev=stpVal(o.path);if(a[0]==='meas')S.meas[a[1]]=S.meas[a[1]]||{};if(a[0]==='frame')S.frame=S.frame||{};
  const s=stpFmt(v,o.step);setPath(o.path,s);if(START_K.includes(o.path))(S.touched=S.touched||{})[o.path]=true;if(o.after)o.after(s,prev);
  const sr=document.getElementById('sr');if(sr)sr.textContent=''}
// Nowa wartość dla czytnika ekranu (WCAG 4.1.3) po przerysowaniu, razem z reakcją zwierzaka, jeśli ją ogłoszono (PET.flush w render)
function rwSay(o,v){const sr=document.getElementById('sr'),p=sr?String(sr.textContent||''):'';return o.label+': '+rwNum(o.step)(v)+' '+o.unit+(p?'. '+p:'')}
// Reakcja Zdrowia i mięśnie jak po wyjściu z dawnego pola (petHealth z poprzednią wartością, muscleToast po FFM i wzroście)
const rwHealth=path=>(s,prev)=>{petHealth(path,s,prev==null?'':String(prev));if(/\.ffm$/.test(path))muscleToast()};
function lastWatch(){const ks=Object.keys(S.days||{}).sort().reverse();for(const k of ks){const e=(S.days[k]||[]).filter(x=>x&&x.kind==='t'&&x.src==='zegarek').at(-1);if(e&&num(e.gross)>0)return {min:num(e.min),gross:num(e.gross),date:fmtDate(k)}}return null}
function trRows(){const t=S.tr||{},w=lastWatch(),one=(key,id,label,unit,step,o)=>rwSpec(Object.assign({key,id,label,unit,step,path:'tr.'+key},o));
  return [one('min','f_tr.min','Czas treningu','min',1,{coarse:5,range:[5,180],today:num(t.min)>0?num(t.min):null,def:STP0.min,x:{vt:v=>v+' minut'}}),
    one('wmin','f_tr.wmin','Czas z zegarka','min',5,{last:w&&w.min>0?{v:w.min,date:w.date}:null,def:STP0.wmin,x:{confirmMsg:v=>'Wpisano jak ostatnio: '+v+' min'}}),
    one('wk','f_tr.wk','Kalorie z zegarka','kcal',10,{last:w?{v:w.gross,date:w.date}:null,def:STP0.wk,x:{confirmMsg:v=>'Wpisano jak ostatnio: '+WF.k(v)+' kcal'}}),
    // Bieżnia i spinning: wartości formularza szacunku (nachylenie 0 to wartość, nie brak)
    one('speed','f_tr.speed','Prędkość','km/h',.5,{today:num(t.speed)>0?num(t.speed):null,def:STP0.speed}),
    one('grade','f_tr.grade','Nachylenie','%',.5,{today:String(t.grade==null?'':t.grade).trim()!==''?num(t.grade):null,def:STP0.grade}),
    one('watts','f_tr.watts','Średnia moc','W',5,{today:num(t.watts)>0?num(t.watts):null,def:STP0.watts})]}
function msRows(){const k=todayKey(),m=(S.meas||{})[k]||{},sx=S.sex==='M'?1:0,F=S.frame||{},val=x=>{const t=String(x==null?'':x).trim();return t!==''&&num(t)>0?num(t):null};
  const ms=(key,label,unit,step,o)=>{const l=lastMeasK(key,k),lv=l&&num(l[1])>0?{v:num(l[1]),date:fmtDate(l[0]),y:l[0]===nAgo(1)}:null,path='meas.'+k+'.'+key;
    return rwSpec(Object.assign({key,id:'m_'+key,label,unit,step,path,today:val(m[key]),last:lv,def:(RW_DEF[key]||[])[sx],after:rwHealth(path)},o||{}))};
  const fr=(key,label)=>rwSpec({key,id:'f_frame.'+key,label,unit:'cm',step:.5,path:'frame.'+key,today:val(F[key]),last:null,def:RW_DEF[key][sx],after:rwHealth('frame.'+key)});
  return [ms('waist','Talia','cm',.5),ms('hip','Biodra','cm',.5),ms('thigh','Udo','cm',.5),fr('wrist','Nadgarstek'),fr('ankle','Kostka'),
    ms('fat','Tłuszcz (BIA)','%',.1),ms('ffm','FFM (BIA)','kg',.1),ms('ecw','ECW/TBW (BIA)','%',.1),ms('bmr','BMR (BIA, kJ ÷ 4,184)','kcal',10,{def:Math.round(rmr()/10)*10}),
    ms('vo2','VO2max (zegarek)','ml/kg/min',1),ms('hrRest','Tętno spoczynkowe','ud./min',1),ms('hrMax','Tętno maksymalne (jeśli zmierzone)','ud./min',1,{def:isStart('age')?180:Math.round(208-0.7*num(S.age))})]}
// Profil: ustawienia, nie pomiar dnia. Wartość startowa (isStart) wyszarzona z podpisem „wartość startowa”; zmiana albo wpis bez zmiany ustawia S.touched
const PF_U={kg:'kg',goal:'kg',cm:'cm',age:'lat'};
// Pusta wartość z dawnych danych (np. S.kg '') nie jest pokazywana jako 0: wyszarzona wartość startowa jak przy nieustawionej
function pfRows(){const b=START[S.sex]||START.K,fb={kg:b.kg,cm:b.cm,age:b.age,goal:Math.round((num(S.kg)||b.kg)*0.95*2)/2},one=(key,label,step,range,coarse)=>{const v=num(S[key]),ok=v>0;
    return rwSpec({key,id:'f_'+key,label,unit:PF_U[key],step,range,coarse,path:key,today:isStart(key)||!ok?null:v,def:ok?v:fb[key],
    after:key==='cm'?()=>muscleToast():null,x:{subStart:'wartość startowa',greyLab:''}})};
  return [one('kg','Waga',.1),one('cm','Wzrost',1,[140,210],5),one('age','Wiek',1,[16,90],5),one('goal','Waga docelowa',.5)]}
function rowSpecs(g){return g==='tr'?trRows():g==='ms'?msRows():g==='pf'?pfRows():[]}
const rwHtml=(g,keys)=>{const R=rowSpecs(g);return WPISY.rows(g,todayKey(),keys.map(k=>R.find(x=>x.key===k)),'wp-f')};
// Jeden podpis na ramkę zamiast podpowiedzi w każdym wierszu
const RW_TIP='<p class="small muted wp-pc">Dotknij liczby, aby ją wpisać.</p>';
// Trend talii i FFM: punkty pomiarów i średnia 4 tygodni, bez pasa wahania (brak sprawdzonego źródła o zwykłym wahaniu tych pomiarów, zasada „badania tylko z linków”)
// Wykres serii z opisem dla czytnika: „<tytuł>: n pomiarów, od X do Y <jednostka><dalej>.”
function sparkSvg(cls,id,head,ok,word,u,f,tail,vals,band,o){const n=ok.length,lab=`${head}: ${n} ${n<5?word[0]:word[1]}, od ${f(Math.min(...ok))} do ${f(Math.max(...ok))} ${u}${tail}`;
  return `<svg class="${cls}"${id?` id="${id}"`:''} viewBox="0 0 320 84" role="img" aria-label="${lab}">${typeof WPISY!=='undefined'?WPISY.spark(vals,band,o):''}</svg>`}
function trendSpark(key,lab,u,id){const vals=lastKeys(84).reverse().map(x=>{const m=S.meas[x]||{},v=num(m[key]);return measCp(m,key)||!(v>0)?null:v}),ok=vals.filter(v=>v!=null),n=ok.length;
  if(n<2)return '';const r=vals.slice(-28).filter(v=>v!=null),av=r.length?r.reduce((s,x)=>s+x,0)/r.length:null;
  return `<p class="small muted wp-tl">${lab} z 12 tygodni: punkty to pomiary, zielona linia to średnia 4 tygodni.</p>`+sparkSvg('wp-spark wp-trend',id,lab+' z 12 tygodni',ok,['pomiary','pomiarów'],u,fmt1,`, ostatni ${fmt1(ok[n-1])} ${u}${av!=null?`, średnia 4 tygodni ${fmt1(av)} ${u}`:''}.`,vals,null,{win:28,avgLab:'średnia 4 tygodni',fromLab:'12 tygodni temu',lastPt:true})}
function legHtml(){
  if(S.sex!=='K'||!S.lip)return '';
  const L=S.legs||{},ks=Object.keys(L).filter(k=>L[k].b!=null&&L[k].c!=null).sort(),last=ks.at(-1),k=todayKey(),cur=L[k]||{};
  const ago=last?Math.round((Date.parse(k)-Date.parse(last))/864e5):null,trend=ks.length>=2?` Pierwszy wpis ${fmtDate(ks[0])}: ból ${L[ks[0]].b}, ciężkość ${L[ks[0]].c}.`:'';
  if(last&&last!==k&&ago<7)return `<details class="fold"><summary>Nogi: ból ${L[last].b}, ciężkość ${L[last].c} (${fmtDate(last)})</summary><div class="panel" style="padding:4px 16px 12px"><p>Następny wpis za ${7-ago} ${7-ago===1?'dzień':'dni'}.${trend}</p></div></details>`;
  const row=(key,lab,hi)=>{const lk=Object.keys(L).filter(x=>x<k&&L[x]&&L[x][key]!=null).sort().at(-1);return scaleHtml('leg:'+key,lab,cur[key],lk?L[lk][key]:null,hi)};
  // Zwinięte, gdy czas na wpis; rozwinięte, gdy dzisiejszy wpis jest zaczęty
  const op=cur.b!=null||cur.c!=null||OPEN_F.has('nogi');
  return `<details class="fold" id="fold_nogi" data-fold="nogi"${op?' open':''}><summary>Nogi, raz w tygodniu: czas na wpis</summary><div class="panel" style="padding:4px 16px 12px">${row('b','Ból nóg','najgorszy')}${row('c','Uczucie ciężkości nóg','najgorsze')}<p class="small muted">Przy lipodemii obwód uda spada wolno; ból i ciężkość pokazują, czy ruch i kompresja działają.${trend}</p></div></details>`;
}

// ---------- Tryb utrzymania ----------
function avg7at(k){const b=Date.parse(k+'T12:00:00'),v=[];for(let i=0;i<7;i++){const x=num((S.meas[keyOf(new Date(b-i*864e5))]||{}).w);if(x>0)v.push(x)}return v.length?v.reduce((a,c)=>a+c,0)/v.length:null}
function avg7(){return avg7at(todayKey())}
function flat3w(){const W=[];lastKeys(21).reverse().forEach((k,i)=>{const v=num((S.meas[k]||{}).w);if(v>0)W.push([i,v])});if(W.length<6||W.at(-1)[0]-W[0][0]<14)return false;const n=W.length,mx=W.reduce((a,p)=>a+p[0],0)/n,my=W.reduce((a,p)=>a+p[1],0)/n,sl=W.reduce((a,p)=>a+(p[0]-mx)*(p[1]-my),0)/W.reduce((a,p)=>a+(p[0]-mx)**2,0);return Math.abs(sl*7)<0.1}
function modeHtml(){if(S.mode==='masa')return '<div class="note">'+masaHtml()+'</div>';if(S.mode!=='redukcja')return '';const si=stageInfo(),done=si&&si.pct>=100,flat=flat3w();if(!done&&!flat)return '';return `<div class="note"><b>${done?'Etap 5% osiągnięty.':'Waga stoi od 3 tygodni.'}</b> Zamiast dokręcać dietę, przejdź na 4-8 tygodni utrzymania: cel bez deficytu, średnia waga w paśmie ±1 kg.<p><button class="btn" data-mode="utrzymanie">Przejdź na utrzymanie</button></p></div>`}
// Przyrost masy: nadwyżka ok. 10% (dolna granica 10-20%) i przyrost 0,25-0,5% masy ciała tygodniowo (Iraki i in. 2019), białko 1,6 g/kg (ISSN 2017: 1,4-2,0)
function masaHtml(){const w=kg();return `<p><b>Przyrost masy.</b> Cel kalorii ok. 10% powyżej zapotrzebowania (przegląd badań: 10-20%). Tempo: 0,25-0,5% masy ciała tygodniowo, czyli ok. ${fmt1(w*0.0025)}-${fmt1(w*0.005)} kg; szybszy przyrost to częściej tłuszcz. Białko ok. ${fmt(protTarget())} g dziennie i trening siłowy.</p>`+srcHtml(['iraki','issn'])+'<p><button class="btn ghost" data-mode="utrzymanie">Przejdź na utrzymanie</button></p>'}
// Cel białka: 1,4 g/kg wagi docelowej w redukcji i utrzymaniu, 1,6 g/kg obecnej masy przy przyroście masy
function protTarget(){return S.mode==='masa'?1.6*kg():1.4*(num(S.goal)||68)}
// Propozycja trybu z danych: cel niżej o ponad 1 kg redukcja, ±1 kg utrzymanie, wyżej o ponad 1 kg albo BMI poniżej 18,5 masa
function modeSuggest(){const w=num(S.kg),g=num(S.goal),h=num(S.cm)/100,bmi=w>0&&h>0?w/(h*h):0;if(bmi&&bmi<18.5)return {m:'masa',low:true};if(!(w>0)||!(g>0))return {m:S.mode||'redukcja'};return {m:g>w+1?'masa':g<w-1?'redukcja':'utrzymanie'}}
const MODE_PL={redukcja:'Redukcja',utrzymanie:'Utrzymanie',masa:'Przyrost masy'};
const modeSig=()=>[S.kg,S.goal,S.cm].join('|');
function modePropHtml(){const p=modeSuggest(),cur=S.mode||'redukcja';if(p.m===cur||S.modeKeep===modeSig())return '';
  const why={redukcja:'Waga docelowa jest niższa od obecnej o ponad 1 kg. Cel kalorii ok. 20% poniżej zapotrzebowania.',utrzymanie:'Waga docelowa różni się od obecnej najwyżej o 1 kg. Cel kalorii równy zapotrzebowaniu, waga w paśmie ±1 kg.',masa:p.low?'BMI poniżej 18,5. Przyrost masy: cel kalorii ok. 10% powyżej zapotrzebowania, białko i trening siłowy.':'Waga docelowa jest wyższa od obecnej o ponad 1 kg. Cel kalorii ok. 10% powyżej zapotrzebowania, białko i trening siłowy.'}[p.m];
  return `<section class="note" id="trybprop" aria-label="Proponowany tryb"><b>Proponowany tryb z Twoich danych: ${MODE_PL[p.m]}.</b> ${why}${p.low?' Przy BMI poniżej 18,5 porozmawiaj z lekarzem, zanim zaczniesz.':''} Teraz: ${MODE_PL[cur]}.<p class="cardact"><button class="btn small" data-mode="${p.m}">Wybieram: ${MODE_PL[p.m]}</button><button class="btn ghost small" data-modekeep="1">Zostaję przy: ${MODE_PL[cur]}</button></p></section>`}
function maintHtml(){const r=num(S.maintRef)||kg(),a=avg7();return `<p><b>Tryb utrzymania${S.maintSince?' od '+fmtDate(S.maintSince):''}.</b> Pasmo: ${fmt1(r-1)}-${fmt1(r+1)} kg. ${a!=null?`Średnia z 7 dni: ${fmt1(a)} kg, ${Math.abs(a-r)<=1?'w paśmie':'poza pasmem'}.`:'Brak ważeń z ostatnich 7 dni.'}</p><p><button class="btn ghost" data-mode="redukcja">Wróć do redukcji</button></p>`}

// ---------- Przepisy krok po kroku (piekarnik, mikrofala, blender) ----------
const RICE='Ryż: 1 część ryżu na 2 części wody w dużej misce, pod przykryciem, mikrofala ok. 20 min na średniej mocy, mieszaj co 5 min.';
const GROATS='Kasza: wypłucz na sicie, 1 część kaszy na 2 części wody w dużej misce, pod przykryciem, mikrofala 12-15 min na średniej mocy, mieszaj co 5 min.';
const POT='Ziemniaki w misce z 3 łyżkami wody, przykryj, mikrofala 8-10 min, aż będą miękkie.';
const STEPS={
  o1:['Jeśli robisz na zapas: udka natrzyj oliwą, solą, papryką i czosnkiem, ułóż na blasze z warzywami.','Piecz 40 min w 200°C, aż mięso puści przezroczysty sok.',GROATS,'Na co dzień: nałóż porcję z pudełka i podgrzej w mikrofali 2-3 min.'],
  o2:['Mięso wymieszaj z solą, pieprzem i majerankiem, uformuj 8-10 pulpetów.','Ułóż je w naczyniu żaroodpornym posmarowanym oliwą, dodaj posiekaną cebulę i pomidory z puszki.','Piecz pod przykryciem 25 min w 190°C.',RICE],
  o3:['Soczewicę wypłucz na sicie.','W dużej misce do mikrofali wymieszaj soczewicę, startą marchew, posiekaną cebulę, pomidory, 300 ml wody, kumin i paprykę.','Gotuj pod przykryciem 15-18 min, mieszając co 5 min, aż soczewica się rozpadnie.','Dodaj oliwę i sól. Podaj z łyżką skyru i kromką chleba.'],
  o4:['Ziemniaki pokrój w ćwiartki, wymieszaj z połową oliwy i solą, piecz 15 min w 200°C.','Dołóż na blachę rozmrożonego dorsza skropionego resztą oliwy i ziołami oraz fasolkę.','Piecz kolejne 15 min.','Skrop cytryną i podawaj.'],
  o5:['Bataty pokrój w kostkę, wymieszaj z przyprawami, piecz 13 min w 200°C.','Dołóż łososia i piecz jeszcze 12 min.','Brokuł w misce z 2 łyżkami wody, przykryj, mikrofala 4 min.'],
  o6:['Makaron w dużej misce zalej wodą o 3 cm ponad poziom, posol, mikrofala 10-12 min, mieszaj co 4 min, odcedź.','Cukinię w kostce i pomidory z puszki podgrzej w misce 5 min.','Dodaj odsączonego tuńczyka, oliwę i makaron, wymieszaj, dopraw oregano.'],
  o7:['Tofu odsącz i pokrój w kostkę.','Wymieszaj tofu i mrożone warzywa z olejem, czosnkiem i imbirem.','Piecz 25 min w 210°C, w połowie przemieszaj.',RICE],
  o8:['Kurczaka, paprykę, cukinię i cebulę pokrój w kostkę.','Wymieszaj w naczyniu żaroodpornym z pomidorami, oliwą, papryką słodką i solą.','Piecz pod przykryciem 30 min w 190°C.',GROATS],
  o9:['W naczyniu żaroodpornym rozdrobnij mięso widelcem.','Dodaj posiekaną cebulę, paprykę, pomidory, odsączoną fasolę, kumin i paprykę słodką.','Piecz 35 min w 190°C, po 20 min przemieszaj.',RICE],
  o10:['Ciecierzycę odsącz i opłucz.','Pokrój ogórka, paprykę i pomidora. Jajka na twardo z zapasu pokrój w ćwiartki.','Wymieszaj z oliwą, solą, pieprzem i sokiem z cytryny. Podaj z chlebem.'],
  o11:['Ziemniaki w plastrach wymieszaj z oliwą w naczyniu żaroodpornym, piecz 20 min w 200°C.','Jajka roztrzep z solą, dodaj szpinak i pokrojoną paprykę.','Zalej ziemniaki, piecz 15 min, aż masa się zetnie.'],
  o12:['Kurczaka w kostce wymieszaj z curry i solą w naczyniu żaroodpornym.','Dodaj pomidory, odsączoną ciecierzycę i szpinak.','Piecz pod przykryciem 30 min w 190°C.','Po wyjęciu wmieszaj jogurt.',RICE],
  o13:[POT,'Kapustę i marchew zetrzyj, skrop octem jabłkowym, posol.','Makrelę oczyść z ości i podaj obok.'],
  o14:[POT,'Twaróg rozgnieć z jogurtem, solą, szczypiorkiem i koperkiem.','Ogórka pokrój w plastry i podaj razem.'],
  o15:['Kurczaka, pieczarki i cebulę pokrój, wymieszaj z olejem i solą.','Piecz 25 min w 200°C.',GROATS,'Wymieszaj wszystko z jogurtem.'],
  o16:['Indyka pokrój w paski, cukinię w półplasterki, wymieszaj z oliwą i ziołami.','Piecz 20 min w 210°C.',GROATS],
  o17:['Soczewicę wypłucz. Marchew i cebulę pokrój w plastry.','W dużej misce zalej 600 ml wody, przykryj, mikrofala 18-20 min, mieszaj co 5 min.','Dodaj oliwę, sól i kumin, zmiksuj blenderem na gładko.','Podaj z jajkiem na twardo z zapasu i chlebem.'],
  o18:['Kurczaka, paprykę i cebulę pokrój, wymieszaj z oliwą i przyprawami, piecz 25 min w 200°C.','Wodę zagotuj w mikrofali. Bulgur zalej podwójną ilością wrzątku, przykryj na 15 min.','Wymieszaj z kurczakiem i warzywami, podaj z jogurtem.'],
  s1:['Płatki i mleko wsyp do dużej miski, co najmniej dwa razy większej niż zawartość.','Mikrofala 2 min, w połowie zamieszaj.','Wmieszaj skyr, dodaj owoce i orzechy.'],
  s2:['Jajka roztrzep w misce z solą i oliwą, dodaj szpinak.','Mikrofala 2-3 min, mieszaj co 30 s, aż się zetnie.','Podaj z chlebem i pomidorem.'],
  s3:['Do skyru wsyp płatki i siemię, wymieszaj.','Dodaj pokrojone jabłko.','Możesz przygotować wieczorem i trzymać w lodówce.'],
  s4:['Twaróg rozgnieć z solą i ziołami.','Posmaruj chleb.','Paprykę i ogórka pokrój i podaj obok.'],
  s5:['Płatki, jajka i banana zmiksuj blenderem na gładko.','Przelej do foremek na muffinki do 3/4 wysokości.','Piecz 18-20 min w 180°C.','Podawaj z jogurtem. Zapas wystarczy na 3 dni w lodówce.'],
  o19:['Kurczaka, paprykę i cukinię pokrój w kostkę, wymieszaj z oliwą, solą, papryką i czosnkiem.','Rozłóż na blasze z papierem, piecz 18 min w 220°C.',GROATS],
  o20:['Fasolę z puszki przepłucz na sicie.','Wymieszaj z tuńczykiem, pokrojonym pomidorem i ogórkiem, oliwą, sokiem z cytryny i pieprzem.','Chleb żytni podaj obok.'],
  o21:['Bataty pokrój w kostkę, wymieszaj z połową oliwy, piecz 15 min w 200°C.','Dołóż dorsza skropionego resztą oliwy, z ziołami i solą, piecz kolejne 15 min.','Brokuł w misce z 2 łyżkami wody, mikrofala pod przykryciem 4 min.'],
  s7:['Twaróg, jajko i płatki rozgnieć widelcem w misce.','Dodaj starte jabłko i cynamon, wymieszaj.','Łyżką nałóż 6-8 małych placków na blachę z papierem do pieczenia.','Piecz 15 min w 190°C. Słodycz daje jabłko, bez cukru.'],
  s8:['Twaróg rozetrzyj widelcem z łyżką mleka i kilkoma kroplami aromatu waniliowego.','Na wierzch wyłóż owoce, mrożone rozmroź 1 min w mikrofali.','Posyp posiekanymi orzechami. Bez cukru: słodycz dają owoce.'],
  s9:['Wieczorem wymieszaj w słoiku płatki, skyr, mleko, starte jabłko i cynamon.','Zamknij i wstaw do lodówki na noc.','Rano posyp orzechami. Jedz na zimno albo podgrzej 1 min w mikrofali.'],
  s6:['Kaszę przelej wrzątkiem na sicie, to usuwa gorycz.','Z mlekiem do dużej miski, mikrofala 8-10 min, mieszaj co 2 min.','Dodaj starte jabłko, cynamon i skyr.'],
  k1:['Twaróg rozgnieć ze szczypiorkiem i solą.','Rzodkiewkę pokrój w plasterki.','Podaj z chlebem.'],
  k2:['Odsącz tuńczyka i fasolę.','Pokrój ogórka i pomidora.','Wymieszaj z oliwą, sokiem z cytryny i pieprzem.'],
  k3:['Mrożone warzywa rozmroź w misce w mikrofali 2 min.','Dodaj roztrzepane jajka z solą i oliwą.','Mikrofala 3 min, mieszaj co minutę. Podaj z chlebem.'],
  k4:['Makrelę oczyść z ości.','Rozgnieć widelcem z jajkiem na twardo i jogurtem, dodaj szczypiorek.','Posmaruj chleb, ogórka podaj obok.'],
  k5:['Tofu pokrój w kostkę.','Wymieszaj z warzywami, olejem i czosnkiem.','Piecz 25 min w 210°C, w połowie przemieszaj.'],
  p1:['Owoce rozmroź 1 min w mikrofali albo dodaj zamrożone.','Wymieszaj ze skyrem.'],
  p2:['Weź jajka na twardo z zapasu.','Ogórka pokrój w plastry.'],
  p3:['Marchew pokrój w słupki.','Podaj z hummusem.'],
  p4:['Jabłko pokrój w ćwiartki.','Podaj z łyżką masła orzechowego.'],
  p5:['Odlicz garść orzechów do miseczki, nie jedz z paczki.','Obierz mandarynkę.'],
  p6:['Skyr, owoce i płatki wrzuć do blendera, dodaj ok. 50 ml wody.','Miksuj 30-40 s.']
};
function eqOf(m){const s=(STEPS[m.id]||[m.how]).join(' '),e=[];if(/°C/.test(s))e.push('piekarnik');if(/mikrofal/i.test(s))e.push('mikrofala');if(/blender/i.test(s))e.push('blender');return e.length?e:['bez gotowania']}
function hhm(id,g){const r=Math.round(g/5)*5,half=v=>Math.round(v*2)/2,f=n=>String(n).replace('.',','),pl=(n,a,b)=>n===1?a:b;if(id==='jajko'){const n=Math.max(1,half(g/60));return `${f(n)} szt. (${r} g)`}if(id==='oliwa'){const n=Math.max(0.5,half(g/10));return `${f(n)} ${pl(n,'łyżka','łyżki')} (${r} g)`}if(id==='chleb'){const n=Math.max(0.5,half(g/40));return `${f(n)} ${pl(n,'kromka','kromki')} (${r} g)`}return `${r} g`}
// Ruch dnia: wpis treningu bez rozgrzewki i mobilności (decyzje 24.11.2026: obie są dodatkiem do treningu albo kroków, nie zastępują ich)
function isMove(e){return !!e&&e.kind==='t'&&!e.warm&&!e.mob}
function postTrain(){const dw=new Date().getDay();return day().some(isMove)||dw===2||dw===4}
function tipsHtml(m,x){
  const oven=eqOf(m).includes('piekarnik'),s=(STEPS[m.id]||[m.how]).join(' '),t=[];
  if(m.t==='kolacja'&&postTrain())t.push(['Trening',`Dziś dzień treningowy: to posiłek po treningu, białko ${fmt(x.p)} g.`]);
  if(oven)t.push(['Kolano','Piecz na środkowej półce i wyjmuj blachę z lekkim ugięciem bioder, bez głębokiego przysiadu.']);
  if(oven&&S.sex==='K'&&S.lip)t.push(['Nogi','Gdy piekarnik pracuje: 10 minut spaceru albo wspięcia na palce przy blacie, potem kilka minut z nogami w górze (praktyka przy lipodemii, dowody słabe).']);
  if(/sol/i.test(s))t.push(['Tarczyca','Sól jodowana i oszczędnie (wiedza ogólna).']);
  return t.length?'<div class="note small">'+t.map(([a,b])=>`<p><b>${a}:</b> ${b}</p>`).join('')+'</div>':'';
}
function leftTxt(k){const l=targetKcal()-eatenToday()-k;return l>=0?`Po tym posiłku zostanie ok. ${fmt(l)} kcal na dziś.`:`Ten posiłek przekroczy dzisiejszy cel o ok. ${fmt(-l)} kcal. Jeden dzień nie zmienia trendu; ważny jest zapis.`}
function renderRecipe(){
  const m=MEALS.find(x=>x.id===S.recipe)||MEALS[0],cm=carbMult(),por=num(S.f.portion)||1,x=macros(m,cm,por),tot=x.p*4+x.f*9+x.c*4||1,steps=STEPS[m.id]||[m.how];
  let h=`<p><button class="btn ghost" data-tab="${S.recipeBack||'meals'}">Wróć</button></p><div class="rec"><h2 class="rt">${m.n}</h2><div class="chips">`+[`${m.min} min`,...eqOf(m),...(m.prep?['z zapasu']:[]),...mealTags(m,x).map(t=>t[0])].map(t=>`<span class="chip">${t}</span>`).join('')+'</div>';
  h+=`<div class="panel" style="padding:12px 16px"><div class="mnum" style="padding:0"><span><b>${fmt(x.k)}</b> kcal</span>${macChips(x)}</div>${propBar(x,'margin:10px 0 0')}</div>`;
  if(((S.prof||{}).cond||{}).io&&m.t!=='przekaska'&&!ioFit(m,x)){const cs=x.items.filter(i=>i.isC).map(i=>i.n.toLowerCase());h+=`<div class="note"><b>Przy insulinooporności:</b> to danie ma ${fmt(x.c)} g węglowodanów i ${fmt(x.p)} g białka. ${cs.length?`Zmniejsz porcję: ${cs.join(', ')} ×0,75`:'Zmniejsz porcję produktu skrobiowego'}${x.p<20?' i dołóż 100 g skyru':''}: wtedy pasuje do reguły „Przy IO”.</div>`}
  h+='<h3 class="rh">Składniki, 1 porcja</h3><div class="panel">'+x.items.map((it,i)=>`<div class="entry"><span class="txt">${it.n}</span><span class="val">${hhm(m.ing[i][0],it.g)}</span></div>`).join('')+'</div>';
  if(cm!==1||por!==1)h+=`<p class="small muted">Porcja przeliczona: węglowodany ×${fmt1(cm)}, wielkość ×${fmt1(por)}.</p>`;
  h+='<h3 class="rh">Przygotowanie</h3><ol class="steps">'+steps.map(s=>`<li>${s}</li>`).join('')+'</ol>';
  h+=tipsHtml(m,x);
  h+=`<p class="small muted">${leftTxt(x.k)}</p>${m.ing.some(i=>i[0]==='tofu')?'<p class="small muted">Jeśli przyjmujesz lewotyroksynę: soję jedz w odstępie od leku, bo może zmniejszać jego wchłanianie (opisy przypadków, wytyczne ATA 2014).</p>':''}${planIds().includes(m.id)?(mealEaten(m.id)?'':'<p class="small muted">W planie na dziś. Wieczorem „Według planu” zapisze to danie.</p>'):`<p><button class="btn" data-cook="${m.id}">Gotuję to dziś</button></p>`}<p>${eatBtn(m.id,'Zjem, zapisz',planIds().includes(m.id)?'':' ghost')}</p>${eatLine(m.id)}<p><button class="btn ghost" data-copy="${m.id}">Kopiuj składniki</button></p><p class="small muted">Gramatury produktów suchych przed ugotowaniem. Miary domowe są przybliżone: łyżka oleju ok. 10 g, kromka chleba ok. 40 g, jajko ok. 60 g.</p></div>`;
  document.getElementById('main').innerHTML=h;
}

// ---------- Program kolana: struktura z badania Kise i wsp. (BMJ 2016) ----------
const KNEE_EX={
  nm:[['Stanie na jednej nodze przy blacie',['3 × 20 s na nogę','3 × 30 s na nogę','3 × 30 s, z zamkniętymi oczami']],['Przenoszenie ciężaru w przód, w bok i w tył',['2 × 8 w każdą stronę','2 × 10, kolano nad stopą','3 × 10, wolniej']],['Krok w bok z gumą nad kolanami',['2 × 8 kroków w każdą stronę','2 × 10 kroków','3 × 10, mocniejsza guma']],['Wejście na niski stopień z kontrolą kolana',['2 × 6 na nogę, kolano nie ucieka do środka','2 × 8 na nogę','3 × 8 na nogę']]],
  st:[['Przysiad do krzesła w zakresie bez bólu',['2 × 10','3 × 10','3 × 8 z plecakiem z wodą']],['Most biodrowy',['2 × 12','3 × 12','3 × 10 na jednej nodze']],['Wyprost kolana w siadzie z gumą',['2 × 12','3 × 12','3 × 10, mocniejsza guma']],['Uginanie kolana z gumą',['2 × 12','3 × 12','3 × 10, mocniejsza guma']],['Wspięcia na palce',['2 × 15','3 × 15','3 × 12 na jednej nodze']]]
};
function kneeWeek(){const s=S.knee.start;if(!s)return 0;return Math.max(1,Math.min(12,Math.floor((Date.parse(todayKey())-Date.parse(s))/(7*864e5))+1))}
function kneeBannerHtml(){const K=S.knee;if(!K.start)return '';const dw=new Date().getDay(),t=todayKey(),done=K.sessions.some(x=>x.d===t),last=K.sessions.at(-1),y=keyAgo(1);let h='';if(last&&last.d===y&&!K.morning[t])h+='<div class="note"><b>Kolano rano po wczorajszej sesji:</b><div class="chips" style="margin-top:8px">'+['lepiej','tak samo','gorzej'].map(v=>`<button class="chip" data-kmorn="${v}">${v}</button>`).join('')+'</div></div>';if(K.days.includes(dw)&&!done)h+='<p><button class="btn" data-tab="knee">Dziś sesja programu kolana</button></p>';return h}
function renderKnee(){
  const K=S.knee,wk=kneeWeek(),n=K.sessions.length,ph=wk<=4?0:wk<=8?1:2,today=todayKey(),done=K.sessions.find(x=>x.d===today);
  let h='<p><button class="btn ghost" data-tab="train">Wróć</button></p><div class="note warn">Program z badania dotyczył osób w wieku 35-60 lat ze zwyrodnieniowym uszkodzeniem łąkotki potwierdzonym rezonansem. Przed startem: diagnoza u ortopedy, a ćwiczenia zatwierdza fizjoterapeuta.</div>';
  h+=K.start?`<div class="note"><b>Tydzień ${wk} z 12. Sesje: ${n} z 24.</b> ${n>=24?'Pełny program jak w badaniu.':n>=19?'Poziom zadowalający według badania (19-23 sesje); każda kolejna się liczy.':'Każda sesja się liczy; po przerwie wracasz od ostatniego poziomu.'}</div>`:'<p><button class="btn" data-kstart="1">Zaczynam program 12 tygodni</button></p>';
  const last=K.sessions.at(-1);
  if(last){const nd=keyOf(new Date(Date.parse(last.d+'T12:00:00')+864e5)),mo=K.morning[nd];const r=(last.pain>3||mo==='gorzej')?'Zostań na obecnym poziomie albo zrób krok wstecz. Jeśli to się powtórzy w 2 kolejnych sesjach: fizjoterapeuta.':mo?'Kolano dobrze znosi obciążenie: w następnej sesji możesz dodać serię albo trudniejszą wersję.':last.d===today?'Jutro rano oceń kolano: od tego zależy progresja.':'Brak oceny poranka po ostatniej sesji: zostań na obecnym poziomie.';h+=`<div class="note"><b>Ostatnia sesja ${fmtDate(last.d)}: ból ${last.pain}/10${mo?', rano '+mo:''}.</b> ${r}</div>`}
  const cr=K.sessions.filter(x=>x.cramp&&Date.parse(today)-Date.parse(x.d)<14*864e5).length;
  if(cr>=2)h+=`<div class="note warn">Skurcze mięśni w ${cr} sesjach z ostatnich 14 dni. Przy tężyczce sprawdź magnez i wapń w Moich badaniach.</div>`;
  h+='<h2>Sesja według protokołu z badania</h2><div class="panel">'+[['Rozgrzewka','ok. 10 min rowerka stacjonarnego'],['Ćwiczenia nerwowo-mięśniowe','20-30 min: równowaga i kontrola kolana'],['Ćwiczenia siłowe','20-30 min, z progresją'],['Schłodzenie','ok. 10 min rowerka']].map(([a,b])=>`<div class="entry"><span class="txt"><b>${a}.</b> ${b}</span></div>`).join('')+'</div><p class="small muted">W badaniu: 12 tygodni, 2-3 sesje tygodniowo po 60-80 minut, łącznie ok. 20 minut rozgrzewki i schłodzenia na rowerku.</p>';
  const ex=(title,L)=>`<details class="fold"><summary>${title}</summary><div class="panel">`+L.map(([a,b])=>`<div class="entry"><span class="txt"><b>${a}</b><br><span class="small muted">${b[ph]}</span></span></div>`).join('')+'</div></details>';
  h+=ex(`Nerwowo-mięśniowe, poziom ${ph+1} z 3`,KNEE_EX.nm)+ex(`Siłowe, poziom ${ph+1} z 3`,KNEE_EX.st);
  h+='<p class="small muted">Lista ćwiczeń z badania jest w rycinach publikacji, których nie sprawdziłem. Powyższe to przykłady do zatwierdzenia przez fizjoterapeutę (wniosek), z poziomami na tygodnie 1-4, 5-8 i 9-12.</p>';
  const cp=K.tmpPain!=null?K.tmpPain:(done?done.pain:null),cc=K.tmpCramp!=null?K.tmpCramp:(done?done.cramp:false);
  h+=`<h2>${done?'Dzisiejsza sesja zapisana':'Zapisz dzisiejszą sesję'}</h2><div class="panel" style="padding:4px 16px 12px">`+scaleHtml('kpain','Ból kolana w trakcie',cp,((K.sessions||[]).filter(x=>x.d<todayKey()&&x.pain!=null).sort((a,b)=>a.d.localeCompare(b.d)).at(-1)||{}).pain,'najgorszy')+`<p style="margin:12px 0 4px">Skurcze mięśni w trakcie</p><div class="chips"><button class="chip ${cc?'inc':''}" data-kcramp="1" aria-pressed="${!!cc}">tak, były skurcze</button></div><p class="small muted">Ból kolana oceniaj osobno od bólu nóg przy lipodemii.</p></div><p><button class="btn" data-ksave="1">${done?'Popraw zapis sesji':'Zapisz sesję (60 min)'}</button></p>`;
  h+='<h2>Dni sesji</h2><div class="chips">'+[[1,'pn','poniedziałek'],[2,'wt','wtorek'],[3,'śr','środa'],[4,'cz','czwartek'],[5,'pt','piątek'],[6,'sb','sobota'],[0,'nd','niedziela']].map(([v,l,f])=>`<button class="chip ${K.days.includes(v)?'inc':''}" data-kday="${v}" aria-label="${f}" aria-pressed="${K.days.includes(v)}">${l}</button>`).join('')+'</div><p class="small muted">Sesja zastępuje trening siłowy z planu w te dni, nie dochodzi do niego. Na rowerku przy lipodemii pomaga kompresja, jeśli lekarz ją zalecił.</p>';
  h+='<h2>Po 12 tygodniach</h2><div class="note">Ból do 3/10 i rano bez pogorszenia: powrót wykroków i głębszych przysiadów. W przeciwnym razie: ortopeda.</div>';
  document.getElementById('main').innerHTML=h;
}

// ---------- Rutyna mobilności (decyzja 11.11.2026): opisy z NHS i CSP, częstotliwość z ACSM 2011 i NHS ----------
// Tekst ćwiczeń to opis własnymi słowami stron źródłowych; dawka tylko tam, gdzie źródło ją podaje
const MOB=[
  {id:'m_mied',part:'hip',n:'Pochylenie miednicy',src:'csp',dose:'powoli, bez bólu',how:'Leżąc na plecach z ugiętymi kolanami napnij dół brzucha i dno miednicy, przechyl miednicę, spłaszczając plecy, i powoli wróć. Potem lekko wygnij plecy w drugą stronę i wróć do środka. Zatrzymaj się na chwilę w pozycji środkowej.'},
  {id:'m_kol',part:'hip',n:'Kolano do klatki',src:'csp',dose:'powoli, bez bólu',how:'Leżąc na plecach, stopy na podłodze, przyciągnij jedno kolano do klatki, trzymając dłonie pod udem. Wróć i powtórz tą samą nogą, potem drugą.'},
  {id:'m_udo',part:'hip',n:'Rozciąganie przodu uda na boku',src:'csp',dose:'łącznie ok. 60 s na nogę (ACSM)',how:'Leżąc na boku, dolna noga ugięta z przodu, złap kostkę górnej nogi i przyciągnij piętę do pośladka, aż poczujesz rozciąganie z przodu uda. Kolano trzymaj nisko; możesz użyć ręcznika na kostce.'},
  {id:'m_pieta',part:'hip',n:'Wysuwanie pięty',src:'csp',dose:'powoli, bez bólu',how:'Leżąc na plecach z ugiętymi kolanami napnij dno miednicy i mięśnie brzucha, oddychaj spokojnie i wysuń jedną stopę, aż noga się wyprostuje. Wróć powoli, potem druga noga. Plecy nie zmieniają ułożenia.'},
  {id:'m_wstan',part:'str',n:'Wstawanie z krzesła',src:'nhsstr',dose:'5 powtórzeń; im wolniej, tym lepiej',how:'Usiądź na brzegu stabilnego krzesła, stopy na szerokość bioder, lekko pochyl się do przodu. Wstań siłą nóg, nie rąk, i powoli usiądź.'},
  {id:'m_przys',part:'str',n:'Mini przysiad',src:'nhsstr',dose:'5 razy',how:'Trzymając oparcie krzesła, stopy na szerokość bioder, ugnij kolana na tyle, na ile wygodnie, plecy proste. Wstając, napnij pośladki.'},
  {id:'m_bok',part:'str',n:'Unoszenie nogi w bok',src:'nhsstr',dose:'5 razy każdą nogą',how:'Trzymając oparcie krzesła, unieś prostą nogę w bok, biodra i plecy proste, bez przechylania. Wróć i zmień nogę.'},
  {id:'m_tyl',part:'str',n:'Wyprost nogi w tył',src:'nhsstr',dose:'do 5 s, 5 razy każdą nogą',how:'Trzymając oparcie krzesła, unieś prostą nogę w tył bez wyginania pleców. Pracuje tył uda i pośladek.'},
  {id:'m_sklon',part:'flex',n:'Skłon w bok',src:'nhsflex',dose:'2 s, 3 razy na stronę',how:'Stojąc, stopy na szerokość bioder, przesuń jedną rękę w dół wzdłuż boku, na ile wygodnie. Potem druga strona.'},
  {id:'m_lydka',part:'flex',n:'Rozciąganie łydki',src:'nhsflex',dose:'3 razy na nogę',how:'Dłonie na ścianie, przednia noga ugięta, tylna prosta, obie stopy płasko. Pięta tylnej nogi zostaje na podłodze. Potem druga noga.'},
  {id:'m_obrot',part:'flex',n:'Obrót szyi',src:'nhsflex',dose:'5 s, 3 razy na stronę',how:'Siedząc prosto, ramiona w dół, powoli obróć głowę w stronę ramienia, na ile wygodnie, zatrzymaj i wróć. Potem druga strona.'},
  {id:'m_szyja',part:'flex',n:'Rozciąganie szyi',src:'nhsflex',dose:'5 s, 3 razy na stronę',how:'Siedząc prosto, dłonią przytrzymaj przeciwne ramię w dół i powoli przechyl głowę w bok. Potem druga strona.'}];
const MOB_PART={hip:'Biodra i miednica, leżąc',str:'Siła bioder i pośladków, przy krześle',flex:'Rozciąganie'};
// ---------- Rozgrzewka w Treningu (plan rada/plany/2026-11-24-rozgrzewka-plan.md; mapa powiązań 59-62) ----------
// Opisy własnymi słowami stron źródłowych; dawka tylko tam, gdzie podaje ją źródło. short = tryb krótki (domyślny).
const WARM_SRC={nhsw:{t:'NHS, rozgrzewka',u:'https://www.nhs.uk/live-well/exercise/how-to-warm-up-before-exercising/',map:59},
  borders:{t:'NHS Borders, rozejście mięśni brzucha',u:'https://www.rightdecisions.scot.nhs.uk/patient-information-leaflets/primary-community-services/physiotherapy/separation-of-the-abdominal-muscles-in-pregnancy-and-beyond',map:60},
  bmc:{t:'BMC Musculoskelet Disord 2024; czas: ACSM 2011 jak w Mobilności',u:'https://doi.org/10.1186/s12891-024-07988-9',map:62}};
const WARM=[
  {id:'w_marsz',part:1,short:1,src:'nhsw',fig:'march',sec:180,n:'Marsz w miejscu',dose:'3 min',how:'Maszeruj w miejscu, potem kilka kroków do przodu i do tyłu.'},
  {id:'w_pieta',part:1,short:1,src:'nhsw',fig:'heel',sec:60,n:'Pięta do przodu',dose:'60 razy w 60 s',how:'Na zmianę stawiaj piętę przed sobą, palce stopy w górę; dłonie wysuwaj lekko do przodu.'},
  {id:'w_kolano',part:1,short:1,src:'nhsw',fig:'knee',sec:30,n:'Kolano w górę',dose:'30 razy w 30 s',how:'Na zmianę unoś kolano do przeciwnej dłoni.'},
  {id:'w_barki',part:1,short:1,src:'nhsw',fig:'roll',n:'Krążenie barków',dose:'2 × 10',how:'5 razy do przodu i 5 razy do tyłu.'},
  {id:'w_przysiad',part:1,short:1,src:'nhsw',fig:'bend',n:'Lekki przysiad',dose:'10 razy, najwyżej 10 cm w dół',how:'Ugnij kolana tylko trochę i wróć.'},
  {id:'w_brzuch',part:2,short:1,src:'borders',fig:'belly',n:'Wciągnięcie dołu brzucha',dose:'5–10 s, 5–10 razy',how:'Leżąc z ugiętymi kolanami, przy wydechu delikatnie wciągnij dół brzucha w stronę kręgosłupa; możesz też napiąć dno miednicy. Plecy i miednica bez ruchu, oddychaj normalnie.'},
  {id:'w_miednica',part:2,short:0,src:'borders',mob:'m_mied',fig:'tilt',n:'Przechylenie miednicy',dose:'5–10 s, 5–10 razy',how:'Bez wstrzymywania oddechu przechyl miednicę, dociskając dół pleców do podłogi, i napnij przy tym dół brzucha; powoli wróć.'},
  {id:'w_kolana',part:2,short:0,src:'borders',fig:'rock',n:'Kołysanie kolan',dose:'powoli, w wygodnym zakresie',how:'Leżąc z ugiętymi kolanami, powoli przechylaj kolana na boki, tylko tak daleko, jak jest wygodnie.'},
  {id:'w_biodro',part:3,short:0,src:'bmc',fig:'hip',n:'Rozciąganie przodu biodra w klęku',dose:'bez bólu; łącznie ok. 60 s na stronę',how:'W klęku jednonóż napnij pośladek tylnej nogi i dół brzucha, podwiń miednicę i przesuń ją lekko do przodu, nie wyginając dołu pleców. Czujesz rozciąganie z przodu biodra tylnej nogi.'}];
const WARM_PART={1:'Rozgrzanie, co najmniej 6 min',2:'Głębokie mięśnie brzucha',3:'Biodro i miednica'};
// Stan tylko w pamięci (nie w S, nie w kopii): krok, pominięcie dziś, zatrzymany ruch, licznik, blokada wygaszania ekranu
const WARM_UI={step:null,skip:'',paused:false,left:null,timer:0,lock:null,locked:false,focus:false};
// Postać: SVG w kodzie (CSP bez zmian); ruch tylko z klasą an (tryb krok po kroku), bez ruchu przy prefers-reduced-motion
function warmFig(f,an,lab){const A=(o,n,ex)=>`<g class="${an?'an ':''}mv" style="transform-origin:${o};animation-name:${n}${ex||''}">`,st='<line class="fl" x1="20" y1="94" x2="100" y2="94"/><circle cx="60" cy="14" r="7"/><line x1="60" y1="22" x2="60" y2="54"/>',ly='<line class="fl" x1="8" y1="78" x2="112" y2="78"/><circle cx="16" cy="70" r="7"/>';
  const B={march:st+'<line x1="60" y1="28" x2="48" y2="46"/><line x1="60" y1="28" x2="72" y2="46"/>'+A('60px 54px','wsw')+'<line x1="60" y1="54" x2="60" y2="92"/></g>'+A('60px 54px','wsw',';animation-delay:-1.6s')+'<line x1="60" y1="54" x2="60" y2="92"/></g>',
    heel:st+'<line x1="60" y1="28" x2="46" y2="42"/><line x1="60" y1="28" x2="74" y2="42"/><line x1="60" y1="54" x2="60" y2="92"/>'+A('60px 54px','wheel')+'<line x1="60" y1="54" x2="60" y2="92"/></g>',
    knee:st+'<line x1="60" y1="28" x2="48" y2="46"/><line x1="60" y1="28" x2="70" y2="50"/><line x1="60" y1="54" x2="60" y2="92"/>'+A('60px 54px','wlift')+'<line x1="60" y1="54" x2="60" y2="74"/><line x1="60" y1="74" x2="60" y2="92"/></g>',
    roll:st+'<line x1="60" y1="54" x2="52" y2="92"/><line x1="60" y1="54" x2="68" y2="92"/>'+A('60px 30px','wroll')+'<line x1="60" y1="27" x2="46" y2="48"/><line x1="60" y1="27" x2="74" y2="48"/></g>',
    bend:'<line class="fl" x1="20" y1="94" x2="100" y2="94"/>'+A('60px 14px','wbob')+'<circle cx="60" cy="14" r="7"/><line x1="60" y1="22" x2="60" y2="54"/><line x1="60" y1="28" x2="76" y2="36"/></g><line x1="60" y1="54" x2="66" y2="74"/><line x1="66" y1="74" x2="60" y2="92"/>',
    belly:ly+'<line x1="24" y1="72" x2="62" y2="72"/><line x1="62" y1="72" x2="80" y2="52"/><line x1="80" y1="52" x2="94" y2="74"/>'+A('44px 72px','wbelly')+'<path d="M32 72 Q44 60 58 72"/></g>',
    tilt:ly+'<line x1="24" y1="72" x2="50" y2="72"/>'+A('62px 72px','wtilt')+'<line x1="50" y1="72" x2="62" y2="72"/><line x1="62" y1="72" x2="80" y2="52"/><line x1="80" y1="52" x2="94" y2="74"/></g>',
    rock:ly+'<line x1="24" y1="72" x2="62" y2="72"/>'+A('62px 72px','wrock')+'<line x1="62" y1="72" x2="80" y2="52"/><line x1="80" y1="52" x2="94" y2="74"/></g>',
    hip:'<line class="fl" x1="8" y1="90" x2="112" y2="90"/>'+A('56px 56px','wtuck')+'<circle cx="56" cy="16" r="7"/><line x1="56" y1="24" x2="56" y2="56"/></g><line x1="56" y1="56" x2="80" y2="58"/><line x1="80" y1="58" x2="80" y2="88"/><line x1="56" y1="56" x2="40" y2="88"/><line x1="40" y1="88" x2="22" y2="88"/>'};
  return `<svg class="wf" viewBox="0 0 120 100" role="img" aria-label="${esc(lab)}">${B[f]||''}</svg>`}
function warmList(){const full=!!(S.warm||{}).full;return WARM.filter(x=>full||x.short)}
function warmDone(k){return ((S.days||{})[k||todayKey()]||[]).some(e=>e.warm)}
function warmSec(s){return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function warmLock(on){try{if(on&&navigator.wakeLock&&navigator.wakeLock.request){navigator.wakeLock.request('screen').then(l=>{WARM_UI.lock=l;WARM_UI.locked=true;const n=document.getElementById('warm_lock');if(n)n.hidden=false}).catch(()=>{WARM_UI.locked=false})}else if(!on){if(WARM_UI.lock&&WARM_UI.lock.release)WARM_UI.lock.release().catch(()=>{});WARM_UI.lock=null;WARM_UI.locked=false}}catch(_){WARM_UI.locked=false}}
function warmTimer(on){if(WARM_UI.timer){clearInterval(WARM_UI.timer);WARM_UI.timer=0}WARM_UI.left=null;const x=warmList()[WARM_UI.step];if(!on||!x||!x.sec||typeof setInterval!=='function')return;WARM_UI.left=x.sec;
  WARM_UI.timer=setInterval(()=>{if(WARM_UI.left>0)WARM_UI.left--;const t=document.getElementById('warm_t');if(t)t.textContent=warmSec(WARM_UI.left);
    if(!WARM_UI.left){clearInterval(WARM_UI.timer);WARM_UI.timer=0;const L=warmList(),nx=L[WARM_UI.step+1],sr=document.getElementById('sr');if(sr)sr.textContent='Koniec ćwiczenia. '+(nx?'Następne: '+nx.n:'To ostatnie ćwiczenie.')}},1000)}
function warmStepHtml(){const L=warmList(),i=Math.min(WARM_UI.step,L.length-1),x=L[i],last=i===L.length-1,nx=L[i+1];
  return `<section class="warm warm-step" data-warm="step"><p class="warm-n">Rozgrzewka · ${i+1} z ${L.length}</p><div class="warm-prog" aria-hidden="true"><i style="width:${Math.round((i+1)*100/L.length)}%"></i></div>`
    +`<div class="warm-big${WARM_UI.paused?' paused':''}">${warmFig(x.fig,true,x.n)}</div><h2 id="warm_h" tabindex="-1">${esc(x.n)}</h2><p class="warm-d">${esc(x.dose)}</p><p>${esc(x.how)}</p>`
    +(x.sec?`<p class="warm-timer"><span id="warm_t">${warmSec(WARM_UI.left!=null?WARM_UI.left:x.sec)}</span> <span class="small muted">zostało</span></p>`:'')
    +`<div class="warm-ctl"><button class="btn ghost" data-warmprev="1"${i?'':' disabled'}>Wstecz</button><button class="btn ghost" data-warmpause="1" aria-pressed="${WARM_UI.paused}">Zatrzymaj ruch</button>`
    +(last?'<button class="btn" data-warmdone="1">Zakończ</button>':'<button class="btn" data-warmnext="1">Dalej</button>')+'</div>'
    +`<p class="small muted">${nx?'Dalej: '+esc(nx.n)+'.':'To ostatnie ćwiczenie.'} <span id="warm_lock"${WARM_UI.locked?'':' hidden'}>Ekran nie gaśnie w trakcie rozgrzewki.</span></p><p><button class="linkbtn small" data-warmexit="1">Przerwij rozgrzewkę</button></p></section>`}
function warmHtml(){const k=todayKey();if(WARM_UI.step!=null)return warmStepHtml();
  if(warmDone(k))return '<section class="warm warm-line" data-warm="card"><span>Rozgrzewka zrobiona</span><button class="btn ghost small" data-warmagain="1">Powtórz</button></section>';
  if(WARM_UI.skip===k)return '<section class="warm warm-line" data-warm="card"><span>Rozgrzewka pominięta dziś</span><button class="btn ghost small" data-warmshow="1">Pokaż</button></section>';
  const full=!!(S.warm||{}).full,L=warmList();let h=`<section class="warm" data-warm="card"><h2>Rozgrzewka</h2><p class="small muted warm-meta">ok. ${full?10:6} min · ${L.length} ćwiczeń</p>`
    +`<div class="warm-mode" role="group" aria-label="Długość rozgrzewki"><button data-warmmode="short" aria-pressed="${!full}">Krótka, 6 min</button><button data-warmmode="full" aria-pressed="${full}">Pełna, 10 min</button></div>`
    +'<p class="small muted">Przed treningiem. Ruch bez bólu; jeśli coś boli, pomiń to ćwiczenie.</p>';
  let p=0;L.forEach(x=>{if(x.part!==p){p=x.part;h+=`<h3 class="warm-part">${p}. ${WARM_PART[p]}</h3>`}const s=WARM_SRC[x.src];
    h+=`<div class="warm-ex" data-warmex="${x.id}">${warmFig(x.fig,false,x.n)}<div><b>${esc(x.n)}</b><p class="warm-d">${esc(x.dose)}</p><p class="small">${esc(x.how)}</p><p class="small muted">Źródło: <a href="${s.u}" target="_blank" rel="noopener">${esc(s.t)}</a></p></div></div>`});
  if(!full)h+='<p class="small muted">W pełnej dochodzą: przechylenie miednicy, kołysanie kolan, rozciąganie przodu biodra.</p>';
  h+='<p class="warm-warn"><b>Bez brzuszków.</b> Przy rozejściu mięśni brzucha unikaj ćwiczeń, przy których brzuch uwypukla się do przodu, np. brzuszków; wstawaj z leżenia przez bok. Plan ćwiczeń przy rozejściu ustala fizjoterapeuta.</p>'
    +fold('warmlim','Czego Miara nie obiecuje','<ul class="small"><li>Nie ma badania, które pokazuje, że te ćwiczenia korygują przodopochylenie miednicy; zestaw rozgrzewa i uczy ustawienia miednicy.</li><li>Ćwiczenia brzucha po porodzie zmniejszają odstęp między mięśniami w niewielkim stopniu, a pewność dowodów jest niska.</li><li>W ciąży albo niedługo po porodzie zapytaj najpierw o ruch.</li></ul>')
    +'<div class="warm-go"><button class="btn ghost" data-warmskip="1">Pomiń dziś</button><button class="btn" data-warmgo="1">Zaczynam rozgrzewkę</button></div></section>';
  return h}
// Mój plan od specjalisty: ćwiczenia wpisane z zaleceń; Miara przypomina i odhacza, niczego nie zaleca
const DAYS_PL=[[1,'pn','poniedziałek'],[2,'wt','wtorek'],[3,'śr','środa'],[4,'cz','czwartek'],[5,'pt','piątek'],[6,'sb','sobota'],[0,'nd','niedziela']];
function specPlanHtml(){const P=S.plan||{items:[],done:{}},wd=new Date().getDay(),dn=(P.done||{})[todayKey()]||[],t=S.tmpPlan||{n:'',dose:'',days:[]},td=P.items.filter(x=>(x.days||[]).includes(wd));
  let h='<h2>Mój plan od specjalisty</h2>';
  if(!P.items.length)h+='<p class="small">Wpisz ćwiczenia z zaleceń fizjoterapeuty albo podiatry. Miara przypomni o nich w wybrane dni i odhaczy wykonane.</p>';
  else h+=td.length?'<div class="panel">'+td.map(x=>{const on=dn.includes(x.id);return `<div class="entry"><button class="opt hab ${on?'on':''}" data-planex="${x.id}" aria-pressed="${on}"><span class="box">${on?'✓':''}</span><span class="lab"><b>${esc(x.n)}</b><span class="small muted">${esc(x.dose)}</span></span></button><button class="del" data-plandel="${x.id}" aria-label="Usuń: ${esc(x.n)}">×</button></div>`}).join('')+'</div>':'<p class="small">Dziś bez ćwiczeń z planu.</p>';
  return h+fold('planadd','Dodaj zalecenie od specjalisty',`<div class="panel"><div class="field"><label for="pl_n">Zalecenie</label><input type="text" id="pl_n" data-k="tmpPlan.n" value="${esc(t.n||'')}" maxlength="60" placeholder="np. wyprost kolana, babka po kolacji"></div><div class="field"><label for="pl_d">Ile</label><input type="text" id="pl_d" data-k="tmpPlan.dose" value="${esc(t.dose||'')}" maxlength="40" placeholder="np. 3 × 10"></div></div><div class="chips" role="group" aria-label="Dni ćwiczenia">`+DAYS_PL.map(([v,l,f])=>{const on=(t.days||[]).includes(v);return `<button class="chip ${on?'inc':''}" data-planday="${v}" aria-label="${f}" aria-pressed="${on}">${l}</button>`}).join('')+'</div><p><button class="btn" data-planadd="1">Dodaj do planu</button></p>')}
// Wkładki: tylko przy płaskostopiu w profilu; dni we wkładkach i ból stopy 0-10 raz w tygodniu, podsumowanie 28 dni na wizytę
function insoleHtml(){if(!((S.prof||{}).cond||{}).flat)return '';const I=S.insole||{days:{},pain:{}},k=todayKey(),on=!!(I.days||{})[k],n=lastKeys(28).filter(x=>(I.days||{})[x]).length,pk=Object.keys(I.pain||{}).sort(),last=pk.at(-1),due=!last||Date.parse(k)-Date.parse(last)>=7*864e5||last===k;
  return '<h2>Wkładki</h2><div class="panel">'+`<button class="opt hab ${on?'on':''}" data-insole="1" aria-pressed="${on}"><span class="box">${on?'✓':''}</span><span class="lab"><b>Dziś chodzę we wkładkach</b><span class="small muted">${n} z 28 dni we wkładkach</span></span></button>`+'</div>'
    +(due?'<div class="wp-qbox">'+scaleHtml('footpain','Ból stopy w tym tygodniu',(I.pain||{})[k],(()=>{const lp=pk.filter(x=>x<k).at(-1);return lp?I.pain[lp]:null})(),'najgorszy')+'</div>':`<p class="small muted">Ból stopy: ${I.pain[last]} (${fmtDate(last)}). Następny wpis za tydzień.</p>`)
    +'<p class="small muted">Zabierz te dane na wizytę: specjalista oceni, czy wkładki pomagają.</p>'}
// Dziennik brzucha (profil „Wzdęcia i jelita”): wzdęcie 0-10, stolec w 3 uproszczonych grupach, liczba wypróżnień; ukryty w trybie dyskretnym
const GUT_F=[['twardy','twardy, grudki'],['uform','uformowany'],['luzny','luźny, wodnisty']];
function gutSum(){const G=S.gut||{},ks=lastKeys(28).filter(k=>G[k]),hi=ks.filter(k=>G[k].b>=5).length,none=ks.filter(k=>G[k].n===0).length,lz=ks.filter(k=>G[k].f==='luzny').length;return {n:ks.length,hi,none,lz}}
const GUT_U=[['piecze','pieczenie lub ból w nadbrzuszu'],['pelnosc','pełność po jedzeniu'],['zgaga','zgaga']],GUT_A=[['krew','krew w stolcu lub czarny stolec'],['wymkrew','wymioty krwią lub jak fusy od kawy'],['bol','nagły silny ból brzucha lub w klatce'],['polyk','trudność z połykaniem'],['wymioty','częste wymioty']];
function gutHtml(){if(!((S.prof||{}).cond||{}).gut||S.discreet)return '';const k=todayKey(),g=(S.gut||{})[k]||{},m=gutSum(),y=(S.gut||{})[nAgo(1)],cp=y&&!Object.keys(g).length&&y.b!=null?`<p class="cardact"><button class="btn ghost small" data-gutcopy="1">Jak wczoraj: wzdęcie ${y.b}${y.f?', '+(GUT_F.find(x=>x[0]===y.f)||[,''])[1]:''}</button></p>`:'';
  const row=(lab,attr,vals,cur)=>`<p style="margin:10px 0 4px">${lab}</p><div class="chips" role="group" aria-label="${lab}">`+vals.map(([v,l])=>{const on=String(cur)===String(v);return `<button class="chip ${on?'inc':''}" data-${attr}="${v}" aria-pressed="${on}">${l}</button>`}).join('')+'</div>';
  const multi=(lab,attr,vals,cur)=>`<p style="margin:10px 0 4px">${lab}</p><div class="chips" role="group" aria-label="${lab}">`+vals.map(([v,l])=>{const on=(cur||[]).includes(v);return `<button class="chip ${on?'inc':''}" data-${attr}="${v}" aria-pressed="${on}">${l}</button>`}).join('')+'</div>';
  return `<details class="fold" id="fold_brzuch" data-fold="brzuch"${OPEN_F.has('brzuch')?' open':''}><summary>Brzuch dziś${g.b!=null?`: wzdęcie ${g.b}`:''}</summary><div class="panel" style="padding:4px 16px 12px">`+cp
    +scaleHtml('gutb','Wzdęcie',g.b,(()=>{const G=S.gut||{},lk=Object.keys(G).filter(x=>x<k&&G[x]&&G[x].b!=null).sort().at(-1);return lk?G[lk].b:null})(),'najgorsze')+row('Stolec','gutf',GUT_F,g.f)+row('Wypróżnienia dziś','gutn',[[0,'0'],[1,'1'],[2,'2'],[3,'3 lub więcej']],g.n)+row('Stresujący dzień','guts',[[1,'tak'],[0,'nie']],g.s)+multi('Z żołądka','gutu',GUT_U,g.u)+multi('Objawy alarmowe','guta',GUT_A,g.a)
    +`<p class="small muted">${m.hi} z 28 dni z wzdęciem 5 lub więcej; dni bez wypróżnienia: ${m.none}; dni z luźnym stolcem: ${m.lz} (${m.n} dni z wpisem). Pokaż to na wizycie.</p></div></details>`}
function mobWeek(){let n=0;for(let i=0;i<7;i++)n+=((S.days||{})[nAgo(i)]||[]).filter(e=>e.kind==='t'&&e.mob).length;return n}
function renderMob(){
  const M=S.mob||{done:{}},dn=(M.done||{})[todayKey()]||[],saved=day().some(e=>e.kind==='t'&&e.mob),n=mobWeek();
  let h='<p><button class="btn ghost" data-tab="train">Wróć</button></p>'+specPlanHtml()+insoleHtml()+'<h2>Rutyna mobilności</h2>';
  if(((S.prof||{}).cond||{}).acl)h+='<div class="note warn">Po rekonstrukcji ACL: zanim zrobisz ćwiczenia z tej rutyny, zapytaj fizjoterapeutę, czy pasują do Twojej fazy.</div>'+srcHtml('aspetar');
  h+=`<p>Co najmniej 2 razy w tygodniu, ok. 10 minut. W tym tygodniu: <b>${n} z 2 sesji w 7 dniach</b>.</p>`+whyFold('mobczest','<p>Częstość i czas z zaleceń dla ćwiczeń rozciągających.</p>'+srcHtml(['acsm','nhsflex']));
  h+='<div class="note warn">Przerwij, gdy ból się nasila, i porozmawiaj z lekarzem. Dzwoń 112, gdy pojawi się drętwienie lub osłabienie obu nóg, utrata czucia w okolicy krocza albo zmiany w oddawaniu moczu lub stolca. Masz ból albo rozpoznanie? Pokaż tę rutynę fizjoterapeucie.</div>'+srcHtml(['nhsback','csp']);
  h+=fold('mobdow','Przodopochylenie miednicy: co mówią badania','<p class="small">Przegląd badań nie znalazł dowodów, że ćwiczenia zmniejszają nadmierne przodopochylenie miednicy; jakość dowodów była bardzo niska. Ćwiczenia korekcyjne zmieniały kąt lordozy w odcinku lędźwiowym w umiarkowanym stopniu. Ta rutyna jest dla ruchomości i siły.</p>'+srcHtml(['falk','lordoza']));
  for(const [pk,pt] of Object.entries(MOB_PART)){
    h+=`<h3 class="rh" style="margin:16px 4px 8px">${pt}</h3><div class="panel">`+MOB.filter(x=>x.part===pk).map(x=>{const on=dn.includes(x.id);return `<button class="opt hab ${on?'on':''}" data-mobex="${x.id}" aria-pressed="${on}"><span class="box">${on?'✓':''}</span><span class="lab"><b>${x.n}</b><span class="small">${x.how}</span><span class="small muted">${x.dose}</span></span></button>`}).join('')+'</div>';
  }
  h+=whyFold('mobzrodla','<p>Źródło nie podaje liczby powtórzeń przy ćwiczeniach z dawką „powoli, bez bólu”.</p>'+srcHtml(['csp','nhsstr','nhsflex']));
  h+=saved?'<div class="note">Dzisiejsza sesja zapisana. Mobilność nie zalicza ruchu dnia: to dodatek do treningu albo kroków.</div>':'<p><button class="btn" data-mobsave="1">Zapisz sesję</button></p>';
  document.getElementById('main').innerHTML=h;
}

// ---------- Mój wpływ: decyzje i zmierzone efekty ----------
function avgAgo(a,b,key){const v=[];for(let i=a;i<b;i++){const m=S.meas[keyAgo(i)]||{};if(measCp(m,key||'w'))continue;const x=num(m[key||'w']);if(x>0)v.push(x)}return v.length?v.reduce((s,x)=>s+x,0)/v.length:null}
function ser(key,n){return lastKeys(n).reverse().map(k=>num((S.meas[k]||{})[key])).filter(v=>v>0)}
function impactData(){const T=targetKcal(),pT=protTarget();let full=0,planDays=0,protDays=0,planned=0,extra=0,trainN=0,urAll=0,urOk=0;lastKeys(28).forEach(k=>{const e=S.days[k]||[],ms=e.filter(x=>x.kind==='m');if(ms.length>=3){full++;if(ms.reduce((a,x)=>a+x.k,0)<=T)planDays++;if(ms.reduce((a,x)=>a+(x.p||0),0)>=pT)protDays++}ms.forEach(x=>{if(x.id)planned++;else extra+=x.k});trainN+=e.filter(isMove).length;(S.urges[k]||[]).forEach(u=>{urAll++;if(u.out!=='inne')urOk++})});return {full,planDays,protDays,planned,extra,trainN,urAll,urOk,pT}}
function renderImpact(){
  const D=impactData(),M=measuredTdee(),goal=num(S.goal)||68,toLose=kg()-goal,maint=S.mode!=='redukcja',W=S.wi||{snack:0,steps:0,train:0};
  const planDef=(M?M.tdee:rmr()*1.3)-targetKcal(),base=maint?0:(M?-M.slope*7:planDef*7/7700),kps=walkPerMin()/100,tn=kcal({met:3.5},60).net;
  const dW=(-(W.snack*200)+W.steps*7*kps+W.train*tn)/7700,nw=base+dW,wk=p=>p>0&&toLose>0?`, ${fmt1(goal)} kg za ok. ${fmt(Math.ceil(toLose/p))} tygodni`:'';
  const chips=(key,vals,lab)=>`<p style="margin:12px 0 4px">${lab}</p><div class="chips">`+vals.map(v=>`<button class="chip ${W[key]===v?'inc':''}" data-wi="${key}:${v}" aria-pressed="${W[key]===v}">${fmt(v)}</button>`).join('')+'</div>';
  let h='<p><button class="btn ghost" data-tab="day">Wróć</button></p><h2>Co jeśli</h2><div class="panel" style="padding:4px 16px 12px">'+chips('snack',[0,1,3,5,7],'Przekąska spoza planu, ok. 200 kcal, razy w tygodniu')+chips('steps',[0,2000,4000],'Dodatkowe kroki dziennie')+chips('train',[0,1,2],'Dodatkowy trening w tygodniu, 60 min');
  if(maint)h+=Math.abs(dW)<0.005?'<p><b>Te decyzje nie zmieniają wagi.</b></p>':`<p><b>W utrzymaniu te decyzje zmieniają wagę o ok. ${dW>0?'-':'+'}${fmt1(Math.abs(dW)*4.3)} kg w miesiącu</b> względem pasma ±1 kg.</p>`;
  else h+=`<p>Teraz (${M?'z Twoich danych':'z planu, do czasu pomiaru'}): ok. ${fmt1(base)} kg tygodniowo${wk(base)}.</p><p><b>Z tymi decyzjami: ${nw>0?`ok. ${fmt1(nw)} kg tygodniowo${wk(nw)}`:'masa ciała nie spada'}.</b></p>`;
  h+='<p class="small muted">Szacunek: 7700 kcal na kg, ok. 100 kroków na minutę spaceru, trening o MET 3,5. W praktyce tempo z czasem maleje.</p></div>';
  const duo=(title,dec,eff)=>`<h2>${title}</h2><div class="duo"><div><h4>Twoje decyzje, 28 dni</h4>${dec.map(x=>`<p class="small">${x}</p>`).join('')}</div><div><h4>Zmierzony efekt</h4>${eff.map(x=>`<p class="small">${x}</p>`).join('')}</div></div>`;
  const wa=avgAgo(0,7),wb=avgAgo21();
  h+=duo('Cel',[`${D.full} dni z pełnym zapisem, w tym ${D.planDays} w celu kalorii`,`${D.planned} posiłków z planu`,`${fmt(D.extra)} kcal spoza planu`,`${D.urOk} z ${D.urAll} ochot bez jedzenia spoza planu`],[wa!=null&&wb!=null?`Waga, średnia 7 dni: z ${fmt1(wb)} na ${fmt1(wa)} kg (${wa-wb>0?'+':''}${fmt1(wa-wb)} kg)`:'Za mało ważeń: potrzebne w pierwszym i ostatnim tygodniu okresu',`Tryb: ${maint?'utrzymanie':'redukcja'}`]);
  const body=[];[['waist','Talia'],['hip','Biodra'],['thigh','Udo']].forEach(([k2,l])=>{const s=ser(k2,28);if(s.length>=2)body.push(`${l}: ${s[0]-s.at(-1)>=0?'-':'+'}${fmt1(Math.abs(s.at(-1)-s[0]))} cm`)});
  const f=ffmTrend();if(f)body.push(`FFM: ${f.b-f.a>=0?'+':'-'}${fmt1(Math.abs(f.b-f.a))} kg (${fmtDate(f.from)} do ${fmtDate(f.to)})`);
  if(S.sex==='K'&&S.lip){const L=S.legs||{},lk=Object.keys(L).filter(k2=>L[k2].b!=null&&Date.now()-Date.parse(k2)<29*864e5).sort();if(lk.length>=2)body.push(`Ból nóg: z ${L[lk[0]].b} na ${L[lk.at(-1)].b}/10`)}
  const ks=(S.knee.sessions||[]).filter(x=>Date.now()-Date.parse(x.d)<29*864e5),half=Math.floor(ks.length/2);if(ks.length>=4){const av=a=>a.reduce((s,x)=>s+x.pain,0)/a.length;body.push(`Ból kolana w sesjach: z ${fmt1(av(ks.slice(0,half)))} na ${fmt1(av(ks.slice(half)))}/10`)}
  if(!body.length)body.push('Brak dwóch pomiarów w okresie: obwody co 2 tygodnie, pomiar BIA co 4');
  h+=duo('Ciało',[`${D.trainN} treningów i sesji`,`${D.protDays} dni z białkiem co najmniej ${fmt(D.pT)} g`,`${ks.length} sesji programu kolana`],body);
  const st=avgAgo(0,7,'steps'),sl=avgAgo(0,7,'sleep'),labs=[];LABS.filter(x=>x.tg).forEach(x=>{const es=S.labs.filter(e=>e.test===x.id).sort((a,b)=>b.date.localeCompare(a.date));if(es.length){const c=es.length>=2?`, zmiana ${num(es[0].val)-num(es[1].val)>0?'+':''}${fmt1(num(es[0].val)-num(es[1].val))}`:'';labs.push(`${x.n}: ${esc(es[0].val)} ${esc(es[0].unit)}, ${labStatus(es[0]).t.split(':')[0]}${c}`)}});
  if(!labs.length)labs.push('Brak wyników z zakresem docelowym: wpisz je w Moich badaniach');
  h+=duo('Zdrowie',[st!=null?`Kroki, średnia 7 dni: ${fmt(st)}`:'Kroki: brak wpisów z 7 dni',sl!=null?`Sen, średnia 7 dni: ${fmtSleep(sl)}`:'Sen: brak wpisów z 7 dni'],labs);
  h+='<p class="small muted">Liczby pokazują, co zostało zrobione i co się zmierzyło w tym samym czasie. To obserwacja, nie dowód, że jedno wywołało drugie. Każda decyzja się liczy, nawet gdy efekt widać dopiero po kilku tygodniach.</p>';
  document.getElementById('main').innerHTML=h;
}
function avgAgo21(){return avgAgo(21,28)}

// ---------- Wspólne wyzwanie: tylko punkty za zachowania, w bazie artefaktu ----------
const CH={state:'off',db:null,user:null,me:null,rows:{},names:{},lastSent:'',loaded:false,err:''};
function chWeek(){return mondayOf(new Date())}
function chMine(){const wk=chWeek(),ks=Array.from({length:7},(_,i)=>keyOf(new Date(Date.parse(wk+'T12:00:00')+i*864e5))).filter(k=>k<=todayKey());return {wk,pts:ks.reduce((a,k)=>a+dayPts(k),0),days:ks.filter(k=>dayPts(k)>=30).length}}
function chSync(){if(DEMO||CH.state!=='on'||!CH.me)return;const m=chMine(),sig=m.wk+'|'+m.pts+'|'+m.days;if(sig===CH.lastSent)return;CH.lastSent=sig;CH.db.doc('scores/'+CH.me).set({wk:m.wk,pts:m.pts,days:m.days,t:Date.now()}).then(()=>{CH.err=''}).catch(e=>{CH.lastSent='';CH.err=String((e&&e.code)||'błąd zapisu')})}
function chRerender(){if(S.tab==='challenge')render()}
// Tekst „Udostępnij”: zaproszenie do wyzwania tylko tam, gdzie wyzwanie działa (baza artefaktu); inaczej same liczby tygodnia
function shareText(){const wp=weekPts();return `Mój tydzień w aplikacji Miara: ${wp} pkt, poziom ${level(wp)[1]}, seria ${streak()} dni.`+(CH.state==='on'?' Robimy wspólne wyzwanie na przyszły tydzień?':'')}
async function chNames(){try{const ids=Object.keys(CH.rows);if(!ids.length)return;const ps=await CH.user.profiles(ids);ids.forEach(i=>{CH.names[i]=(ps[i]&&ps[i].name)||''});chRerender()}catch(e){}}
async function chInit(){
  const c=globalThis.claude;if(!c||typeof c.use!=='function'){CH.state='off';return}
  try{
    const [db,u]=await Promise.all([c.use('db'),c.use('user')]);if(!db||!u){CH.state='off';chRerender();return}
    const id=await u.id();if(!id){CH.state='off';chRerender();return}
    CH.db=db;CH.user=u;CH.me=id;CH.state='on';if(S.tab==='day')render();
    const tm=setTimeout(()=>{if(!CH.loaded){CH.err='brak odpowiedzi bazy';chRerender()}},10000);
    db.collection('scores').onSnapshot(snap=>{clearTimeout(tm);CH.loaded=true;CH.err='';const r={};snap.docs.forEach(d=>{if(d.exists)r[d.id]=d.data()});CH.rows=r;chNames();chRerender()},e=>{clearTimeout(tm);CH.err=String((e&&e.code)||'błąd');chRerender()});
    chSync();
  }catch(e){CH.state='off';chRerender()}
}
function renderChallenge(){
  const wk=chWeek(),m=chMine(),goalPer=180;
  let h='<p><button class="btn ghost" data-tab="day">Wróć</button></p>';
  if(CH.state!=='on'){
    h+=`<div class="note">Wspólne wyzwanie działa w opublikowanej aplikacji po zalogowaniu, gdy obie osoby mają do niej dostęp z prawem do interakcji. Twoje punkty w tym tygodniu: <b>${fmt(m.pts)}</b>, dobre dni (co najmniej 30 pkt): <b>${m.days}</b>.</div>`;
  }else{
    const rows=Object.entries(CH.rows).filter(([,r])=>r&&r.wk===wk).map(([id,r])=>({id,pts:+r.pts||0,days:+r.days||0,me:id===CH.me}));
    const mine=rows.find(r=>r.me);if(mine){mine.pts=m.pts;mine.days=m.days}else rows.push({id:CH.me,pts:m.pts,days:m.days,me:true});
    const nm=r=>r.me?'Ty':(CH.names[r.id]||'Druga osoba'),n=rows.length,pool=rows.reduce((a,r)=>a+r.pts,0),goal=goalPer*Math.max(2,n);
    h+=seg([['wspolpraca','Współpraca'],['rywalizacja','Rywalizacja']],S.chMode,'chmode','','Tryb wyzwania');
    if(!CH.loaded&&!CH.err)h+='<p class="small muted">Ładuję wyniki…</p>';
    if(CH.err)h+=`<div class="note warn">Nie udało się połączyć z bazą (${esc(CH.err)}). Twoje punkty liczą się dalej lokalnie.</div>`;
    if(S.chMode==='rywalizacja'){
      const so=[...rows].sort((a,b)=>b.pts-a.pts||a.id.localeCompare(b.id)),top=so[0].pts,me=so.find(r=>r.me);
      h+='<div class="panel">'+so.map((r,i)=>`<div class="entry"><span class="txt">${i+1}. ${esc(nm(r))}</span><span class="val">${fmt(r.pts)} pkt, ${r.days} ${r.days===1?'dobry dzień':'dobre dni'}</span></div>`).join('')+'</div>';
      h+=me.pts<top?`<p>Do prowadzenia brakuje <b>${fmt(top-me.pts)} pkt</b>. Najszybciej: nawyki, których dziś jeszcze nie ma.</p>`:(n>1?'<p><b>Prowadzisz.</b> Utrzymaj tempo do niedzieli.</p>':'<p>Czekamy na drugą osobę.</p>');
    }else{
      const pc=Math.min(100,pool/goal*100);
      h+=`<div class="panel" style="padding:8px 16px"><div class="prog"><div class="top"><span>Wspólna pula tygodnia</span><span>${fmt(pool)} / ${fmt(goal)} pkt</span></div><div class="track"><div class="fill" style="width:${pc}%"></div></div></div>`+[...rows].sort((a,b)=>(b.me-a.me)||a.id.localeCompare(b.id)).map(r=>`<div class="entry" style="padding:8px 0"><span class="txt">${esc(nm(r))}</span><span class="val">${fmt(r.pts)} pkt, ${r.days} ${r.days===1?'dobry dzień':'dobre dni'}</span></div>`).join('')+`</div><p class="small muted">Cel puli: ${goalPer} pkt na osobę, czyli poziom Srebro (założenie).</p>`;
    }
  }
  h+='<details class="fold"><summary>Co jest udostępniane</summary><div class="panel" style="padding:4px 16px 12px"><p>Tylko punkty z bieżącego tygodnia i liczba dobrych dni. Waga, obwody, posiłki, badania i ochoty zostają w tym telefonie.</p><p>Punkty są za zachowania, nigdy za wagę: każde ciało reaguje inaczej. Trening daje punkty raz dziennie, więc dodatkowe sesje dla punktów nie przeciążają kolana.</p><p>Punkty zerują się w poniedziałek. Tryb (współpraca albo rywalizacja) wybiera każda osoba u siebie.</p></div></details>';
  document.getElementById('main').innerHTML=h;
}

// ---------- UX: zwijane sekcje z zapamiętanym stanem ----------
const OPEN_F=new Set(['zapisane']);
function fold(id,title,inner){return `<details class="fold" id="fold_${id}" data-fold="${id}"${OPEN_F.has(id)?' open':''}><summary>${title}</summary><div style="padding:0 12px 12px">${inner}</div></details>`}
document.addEventListener('toggle',e=>{const t=e.target;if(t&&t.dataset&&t.dataset.fold){t.open?OPEN_F.add(t.dataset.fold):OPEN_F.delete(t.dataset.fold)}},true);
// toggle przychodzi w osobnym zadaniu po kliknięciu: stan sekcji zapisany już przy kliknięciu nagłówka, więc przerysowanie zaraz po nim jej nie zwija
document.addEventListener('click',e=>{const s=e.target&&e.target.closest&&e.target.closest('summary'),d=s&&s.parentElement;if(!d||d.tagName!=='DETAILS'||!d.dataset.fold||d.querySelector(':scope > summary')!==s)return;
  if(e.defaultPrevented)return;d.open?OPEN_F.delete(d.dataset.fold):OPEN_F.add(d.dataset.fold)});

// ---------- Kopia danych: eksport i import pliku (np. przez iCloud Drive) ----------
const BK_SKIP=['imp','tab','introStep','sosStep','sosTrig','recipe','recipeBack','labSel'];
// Kopia bez danych o zdrowiu: lista tego, co zostaje; każde nowe pole stanu jest domyślnie pomijane (rada 09.11.2026, kopia bez danych o zdrowiu)
const BK_NH_KEEP=['toastLen','tips','discreet','pet','prices','ord','shopDay','stores','promos','lite','unlock','unlockAt','unlockSnooze','pmLeft','vibr','petNames','focus','still'];
let BK_PENDING=null;
function bkBuild(noHealth){let d=JSON.parse(JSON.stringify(S));BK_SKIP.forEach(k=>delete d[k]);if(d.kopia)delete d.kopia.token;if(d.knee){d.knee.tmpPain=null;d.knee.tmpCramp=null}if(noHealth){const o={};BK_NH_KEEP.forEach(k=>{if(k in d)o[k]=d[k]});d=o}return JSON.stringify({app:'talerz-i-trening',v:1,created:new Date().toISOString(),noHealth:!!noHealth,data:d})}
function bkParse(text){try{const o=JSON.parse(text);if(!o||o.app!=='talerz-i-trening'||o.v!==1||!o.data||typeof o.data!=='object'||Array.isArray(o.data))return null;return o}catch(e){return null}}
function bkSummary(d){return `${Object.keys(d.days||{}).length} dni z wpisami, ${Object.keys(d.meas||{}).length} dni z pomiarami, ${(d.labs||[]).length} wyników badań, ${((d.knee||{}).sessions||[]).length} sesji kolana, ${Object.keys(d.legs||{}).length} wpisów nóg`}
async function bkExport(){
  const txt=bkBuild(S.bkNoHealth),c=globalThis.claude;let dl=null;
  try{dl=c&&typeof c.use==='function'?await c.use('downloads'):null}catch(e){dl=null}
  if(dl){try{await dl.save({filename:`miara-kopia-${todayKey()}.json`,data:txt});S.lastBackup=todayKey();save();toast('Kopia gotowa: zapisz ją w Plikach na iCloud Drive');render();return}catch(e){if(e&&e.code==='declined'){toast('Anulowano');return}}}
  if(!dl&&!(c&&typeof c.use==='function')){try{const u=URL.createObjectURL(new Blob([txt],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download=`miara-kopia-${todayKey()}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5000);S.lastBackup=todayKey();save();toast('Pobrano kopię: znajdziesz ją w Plikach, w Pobranych');render();return}catch(e){}}
  if(typeof navigator!=='undefined'&&navigator.clipboard){try{await navigator.clipboard.writeText(txt);S.lastBackup=todayKey();save();toast('Skopiowano kopię do schowka');render();return}catch(e){}}
  toast('Zapis pliku i schowek są niedostępne w tym widoku');
}
function bkHtml(){
  let h=`<h2 id="kopia">Kopia danych</h2><div class="panel" style="padding:4px 16px 12px"><p class="small">Kopia to plik ze wszystkimi danymi z tego telefonu. Zapisz go w aplikacji Pliki na iCloud Drive, a na drugim telefonie wczytaj z tego samego miejsca.</p><p class="small muted">Ostatnia kopia: ${S.lastBackup?fmtDate(S.lastBackup):'jeszcze nie było'}. Dobry moment: dzień pomiaru BIA, raz na 4 tygodnie.</p><div class="field" style="padding:8px 0"><label for="bk_nh">Tylko ustawienia i ceny: bez wagi, pomiarów, posiłków i odpowiedzi</label><input type="checkbox" class="switch" id="bk_nh" data-k="bkNoHealth" ${S.bkNoHealth?'checked':''}></div><p><button class="btn" data-bkexp="1">Zapisz kopię</button></p><p style="margin:14px 0 6px">Wczytaj kopię</p><label class="btn ghost" style="display:flex;align-items:center;justify-content:center;width:100%">Wybierz plik kopii z Plików<input type="file" id="bk_file" accept=".json,application/json" style="display:none"></label>`;
  h+=fold('bkpaste','albo wklej tekst kopii','<textarea id="bk_text" rows="3" aria-label="Tekst kopii" style="width:100%;font:inherit;border:1px solid var(--field);border-radius:10px;padding:8px;background:var(--bg);color:var(--ink)"></textarea><p><button class="btn ghost" data-bkpaste="1">Sprawdź kopię</button></p>');
  if(BK_PENDING)h+=`<div class="note warn"><b>Kopia z ${fmtDate(String(BK_PENDING.created||'').slice(0,10))}${BK_PENDING.noHealth?', tylko ustawienia i ceny':''}:</b> ${BK_PENDING.noHealth?'Wczytanie zmieni tylko ustawienia i ceny; Twoje dane w tym telefonie zostaną.':bkSummary(BK_PENDING.data)+'. Wczytanie zastąpi wszystkie dane w tym telefonie.'}<p><button class="btn" data-bkapply="1">${BK_PENDING.noHealth?'Wczytaj ustawienia':'Zastąp dane'}</button> <button class="btn ghost" data-bkcancel="1">Anuluj</button></p></div>`;
  h+='<p class="small muted">Plik nie jest zaszyfrowany i zawiera dane o zdrowiu: trzymaj go w prywatnym folderze.</p></div>';
  return h+radaKopiaHtml();
}
document.addEventListener('change',e=>{const t=e.target;if(!t||t.id!=='bk_file'||!t.files||!t.files[0])return;const r=new FileReader();r.onload=()=>{const o=bkParse(String(r.result));if(!o){BK_PENDING=null;toast('To nie jest kopia tej aplikacji');return}BK_PENDING=o;render()};r.readAsText(t.files[0])});

// ---------- Stan ----------
const LS='talerz-trening-v1';
const DEF={petNames:1,focus:false,still:false,frame:{wrist:'',ankle:''},kg:'70',cm:'165',age:'35',sex:'K',goal:'66,5',touched:{},wizyta:{hp:'brak'},sygSeen:{},wizList:[],suppTake:[],goalWay:'proc',muscle:false,muscleAuto:true,muscleAutoLast:null,bmiCut:'auto',korekta:true,tab:'meals',
  f:{type:'obiad',chips:{},tags:{},minP:0,maxK:1000,maxC:130,carb:'auto',portion:1,sort:'p'},
  tr:{wmin:'',wk:'',cat:'silownia',opt:{silownia:'nogi',plywanie:'kraul1',inne:'nordic'},bMode:'marsz',speed:'5',grade:'3',sMode:'w',watts:'100',sClass:'spin',min:'45'},
  days:{},swaps:{},cel:null,modeKeep:'',mob:{done:{}},plan:{items:[],done:{}},insole:{days:{},pain:{}},gut:{},tmpPlan:{n:'',dose:'',days:[1,2,3,4,5,6,0]},hab:{},urges:{},meas:{},labs:[],labSel:'tsh',onb:false,introStep:0,reviews:{},pet:null,lite:false,unlock:[],unlockAt:'',unlockSnooze:'',body:false,once:false,toastLen:'std',pmLeft:false,vibr:true,ord:{dish:'sushi',sushi:12,kurczak:5,tofu:'1',alt:false,add:{}},prof:{cond:{},pill:''},tips:{},pain:{},cardsOk:{},discreet:false,consent:null,kopia:null,visit:null,petSeen:[],petCeleb:null,krok:null,guide:{hidden:false,dataOk:false,seenPet:false},legs:{},lip:false,mode:'redukcja',maintRef:0,maintSince:'',knee:{start:'',sessions:[],morning:{},days:[2,4,6],tmpPain:null,tmpCramp:null},wi:{snack:0,steps:0,train:0},chMode:'wspolpraca',bkNoHealth:false,lastBackup:'',prices:{twarog:{p:'',g:'250'},jajka:{p:'',g:'600'},skyr:{p:'',g:'150'},kurczak:{p:'',g:'1000'},soczewica:{p:'',g:'400'},tunczyk:{p:'',g:'120'},tofu:{p:'',g:'180'},wpc:{p:'',g:'700'}},shopDay:null,stores:[],promos:[],sosStep:'trig',sosTrig:'',ifthen:'Jeśli w pracy czuję stres i ochotę na przekąskę, to najpierw piję herbatę i wychodzę na 5 minut, a potem, jeśli dalej chcę, jem przygotowaną przekąskę białkową.'};
function clone(o){return JSON.parse(JSON.stringify(o))}
function merge(a,b){for(const k in b){if(b[k]&&typeof b[k]==='object'&&!Array.isArray(b[k])&&a[k]&&typeof a[k]==='object'&&!Array.isArray(a[k]))merge(a[k],b[k]);else a[k]=b[k];}return a}
// Wartości startowe (rada/2026-11-09_wartosci-startowe): punkt startowy do ustawiania przyciskami, zależny od płci; to założenie
// aplikacji, nie średnia (GUS 2019 podaje dla dorosłych tylko rozkład BMI). Cel startowy: 5% mniej niż waga (NHLBI: 5-10% w ok. 6 miesięcy).
// Nieustawione wartości nie są potwierdzonymi danymi: podpis „wartość startowa”, krok „Sprawdź swoje dane” niezaliczony.
const START={K:{kg:70,cm:165,age:35},M:{kg:85,cm:178,age:35}},START_K=['kg','cm','age','goal'];
const isStart=k=>!(S.touched||{})[k];
// Cel kalorii liczony z wartości startowych (waga, wzrost lub wiek): podpis przy każdym pokazaniu celu
const APX_T='cel w przybliżeniu, wpisz wagę, wzrost i wiek',tgtApx=()=>['kg','cm','age'].some(isStart)?APX_T:'';
// Opis wartości suwaka dla czytnika ekranu (WCAG 4.1.2, aria-valuetext w APG slider)
function rTxt(k,v){v=num(v);return k==='minP'?`co najmniej ${v} g białka`:k==='maxK'?(v>=1000?'kalorie bez limitu':`najwyżej ${v} kcal`):k==='maxC'?(v>=130?'węglowodany bez limitu':`najwyżej ${v} g węglowodanów`):`porcja ${fmt1(v)} ×`}
// Gotowe cele: 5-10% (NHLBI) i 7% (DPP); zaznaczony ten, który odpowiada obecnemu celowi
const goalOf=p=>Math.round(num(S.kg)*(1-p/100)*2)/2;
function goalPctHtml(){if(S.mode!=='redukcja')return '';return '<div class="chips">'+[5,7,10].map(p=>{const on=Math.abs(num(S.goal)-goalOf(p))<0.01;return `<button class="chip${on?' inc':''}" data-goalpct="${p}" aria-pressed="${on}">${p}% mniej</button>`}).join('')+'</div>'+srcHtml(['nhlbi','dpp'])}
// Gotowe wartości kalorii przy szacunku (NN/g: wartości domyślne zmniejszają wysiłek); wpis zostaje
const kcalChips=id=>'<div class="chips quick">'+[100,200,300,500].map(v=>`<button class="chip" data-kcalset="${id}:${v}">${v} kcal</button>`).join('')+'</div>';
// Cel z BMI i składu ciała (rada/2026-11-09_cel-bmi-sklad-ciala): trzy drogi celu; progi BMI WHO (25, 30) albo NHS (23, 27,5),
// automatycznie z regionu telefonu; najniższa śmiertelność przy BMI 20-25, zależnie od wieku 22/23/24 (Lancet 2016); talia poniżej połowy wzrostu (NHS)
const BMI_LOW=['IN','PK','BD','LK','NP','BT','MV','AF','CN','HK','MO','TW','JP','KR','KP','MN','SG','MY','TH','VN','PH','ID','KH','LA','MM','BN','TL','SA','AE','QA','KW','BH','OM','YE','IR','IQ','JO','LB','SY','PS','IL','EG','NG','GH','KE','ET','ZA','SN','CI','CM','UG','TZ','JM','TT','BB','HT'];
function bmiCutFor(lang){const r=(String(lang||'').split(/[-_]/)[1]||'').toUpperCase();return BMI_LOW.includes(r)?'nhs':'who'}
function bmiCut(){return S.bmiCut==='who'||S.bmiCut==='nhs'?S.bmiCut:bmiCutFor(typeof navigator!=='undefined'&&navigator.language)}
const bmiOf=kg=>num(kg)/Math.pow((num(S.cm)||165)/100,2);
function bmiCat(b){const n=bmiCut()==='nhs',[o,ob]=n?[23,27.5]:[25,30];return b<18.5?'niedowaga':b<o?'norma':b<ob?'nadwaga':'otyłość'}
const fmt2=x=>(Math.round(x*100)/100).toFixed(2).replace('.',',');
function lastM(key){const k=Object.keys(S.meas||{}).filter(x=>num(S.meas[x][key])>0).sort().pop();return k?num(S.meas[k][key]):0}
const lastWaist=()=>lastM('waist');
function wskTxt(){const b=bmiOf(S.kg),w=lastWaist();return `BMI ${fmt1(b)}: ${bmiCat(b)} (progi ${bmiCut()==='nhs'?'NHS: 23 i 27,5':'WHO: 25 i 30'})`+(w?`, talia do wzrostu ${fmt2(w/(num(S.cm)||165))} (cel poniżej 0,50)`:'')+'.'+(S.muscle?' BMI nie odróżnia mięśni od tłuszczu (NHS), więc przy dużej masie mięśniowej lepszą miarą jest talia.':'')+bodyCompTxt()}
// Skład ciała z wagi BIA: FFMI z medianą odniesienia (Schutz 2002, 5635 osób), tłuszcz % jako trend, bo uznanych zakresów brak (Gallagher 2000)
function bodyCompTxt(){const ffm=lastM('ffm'),fat=lastM('fat');if(!ffm&&!fat)return '';const h2=Math.pow((num(S.cm)||165)/100,2);
  return (ffm?` FFMI ${fmt1(ffm/h2)} (beztłuszczowa masa ciała na m²; mediana w wieku 18-34 lat: ${S.sex==='M'?'18,9 u mężczyzn':'15,4 u kobiet'}).`:'')+(fat?` Tłuszcz ${fmt1(fat)}%: pokazujemy jako trend, bo uznanych zakresów procentu tłuszczu brak.`:'')+srcHtml(['schutz','gallagher'])}
function goalWayHtml(){if(S.mode!=='redukcja')return '';const w=S.goalWay||'proc',h2=Math.pow((num(S.cm)||165)/100,2);
  let h='<p style="margin:12px 4px 4px"><b>Jak ustalić cel?</b></p>'+seg([['proc','5-10% mniej'],['bmi','Zdrowe BMI'],['talia','Obwód talii']],w,'goalway','','Sposób ustalenia celu');
  if(w==='proc')return h+goalHint()+goalPctHtml();
  if(w==='bmi'){const n=bmiCut()==='nhs',up=n?22.9:24.9,a=num(S.age),nd=a>=70?24:a>=50?23:a>=35?22:0,o=[[up,`poniżej ${n?23:25}`]];if(nd&&nd<up)o.push([nd,'najniżej dla wieku']);
    h+='<div class="chips">'+o.map(([v,l])=>{const g=Math.round(v*h2*2)/2,on=Math.abs(num(S.goal)-g)<0.01;return `<button class="chip opt${on?' inc':''}" data-goalbmi="${v}" aria-pressed="${on}">BMI ${fmt1(v)} (${l}): ${fmt1(g)} kg</button>`}).join('')+'</div>';
    h+=`<p class="small muted">${bmiOf(S.kg)<up?`Twoje BMI już jest poniżej ${n?23:25}.`:'Przy dużej różnicy zacznij od 5-10% mniej.'}</p>`+whyFold('bmicel','<p>Najniższa śmiertelność w badaniach przy BMI 20-25; dolna część normy (18,5-20) wiązała się z wyższą. Najniżej: BMI 22 w wieku 35-49 lat, 23 w wieku 50-69, 24 w wieku 70-89.</p>'+srcHtml(['bmimort','whoob'].concat(n?['nhsob']:[])));return h}
  const c=num(S.cm)||165,lw=lastWaist();
  return h+`<div class="note">Cel: talia poniżej ${fmt(c/2)} cm (połowa wzrostu).${lw?` Ostatni pomiar: ${fmt1(lw)} cm, talia do wzrostu ${fmt2(lw/c)}.`:' Zmierz talię w Pomiarach dnia, w obwodach.'} Waga docelowa jest tu opcjonalna: postęp pokaże talia.</div>`+srcHtml('nhsob')}
function bmiSetHtml(){const a=bmiCutFor(typeof navigator!=='undefined'&&navigator.language);return '<p style="margin:12px 4px 4px"><b>Progi BMI</b></p>'+seg([['auto','Kraj telefonu'],['who','WHO'],['nhs','NHS']],S.bmiCut||'auto','bmicut','','Progi BMI')+`<p class="small muted">Kraj telefonu: progi ${a==='nhs'?'NHS':'WHO'}.</p>`+whyFold('bmicut','<p>WHO: nadwaga od BMI 25, otyłość od 30. NHS: od 23 i 27,5 dla osób pochodzenia azjatyckiego, bliskowschodniego, afrykańskiego i afrykańsko-karaibskiego.</p>')+muscleHtml()}
// Dużo mięśni z danych (15.11.2026): FFMI = ostatnia FFM / wzrost w m do kwadratu wobec mediany 18-34 lat z Schutz 2002 (PMID 12080449, abstrakt):
// 18,9 kg/m² u mężczyzn, 15,4 u kobiet. Tabela centyli niedostępna, więc tylko mediana. Reguła Miary: powyżej mediany = włączone.
function muscleRec(){const ffm=lastM('ffm'),cm=num(S.cm);if(!(ffm>0)||!(cm>0)||isStart('cm'))return null;const ffmi=ffm/Math.pow(cm/100,2),med=S.sex==='M'?18.9:15.4;return {ffmi,med,above:ffmi>med}}
// Automat (S.muscleAuto, domyślnie włączony): „Dużo mięśni” idzie za zaleceniem; ręczna zmiana przełącznika go wyłącza.
// Działa tylko przy zmianie zalecenia względem ostatnio zastosowanego (S.muscleAutoLast): −/+ wokół mediany nie powtarza komunikatu
// i nie nadpisuje sposobu celu wybranego ręcznie. Zwraca komunikat ('' bez zmiany); import i kopia dokładają go do własnego komunikatu.
// Potencjał mięśniowy (rada 18.11.2026): pułap FFMI 25 z korektą wzrostu (Kouri 1995, PMID 7496846) i wzór Butta ze źródła wtórnego (nadgarstek, kostka, tłuszcz); tylko mężczyźni, wzrost spoza wartości startowej
function potKouri(){const ffm=lastM('ffm'),cm=num(S.cm);if(S.sex!=='M'||!(ffm>0)||!(cm>0)||isStart('cm'))return null;const h=cm/100,h2=h*h,ffmi=ffm/h2,adj=6.3*(1.8-h),cap=25,ffmCap=(cap-adj)*h2;return {ffm,ffmi,ffmiN:ffmi+adj,cap,ffmCap,gap:Math.max(0,ffmCap-ffm),pct:100*ffm/ffmCap}}
function potButt(){const ffm=lastM('ffm'),cm=num(S.cm),w=num((S.frame||{}).wrist),a=num((S.frame||{}).ankle),f=lastM('fat');if(S.sex!=='M'||!(ffm>0)||!(cm>0)||isStart('cm')||!(w>0)||!(a>0)||!(f>0))return null;const m=Math.pow(cm,1.5)*(Math.sqrt(w)/322.4+Math.sqrt(a)/241.9)*(f/224+1);return {m,m95:0.95*m,gap:Math.max(0,m-ffm),gap95:Math.max(0,0.95*m-ffm),pct:100*ffm/m,f}}
function potDate(key){const d=Object.keys(S.meas||{}).filter(x=>num(S.meas[x][key])>0).sort().pop();return d?fmtDate(d):''}
// Karta „Potencjał mięśniowy” (rada 18.11.2026): oś FFM w kg z markerami; pułap to granica z badań, nie cel. Liczby także w liście tekstowej pod osią.
function potHtml(){const ffm=lastM('ffm');if(!(ffm>0))return '';
  const head='<section id="potencjal"><h3>Potencjał mięśniowy</h3>',E='</section>';
  if(S.sex!=='M')return head+'<div class="panel"><p class="small muted" style="padding:8px 16px;margin:0">Oba modele (pułap FFMI i wzór Butta) opisano tylko u mężczyzn, więc ich tu nie liczę. Sprawdź swoje FFMI wobec mediany: przełącznik „Dużo mięśni” w Ustawieniach.</p></div>'+E;
  const k=potKouri(),b=potButt();
  if(!k)return head+'<div class="panel"><p class="small muted" style="padding:8px 16px;margin:0">Wpisz wzrost w Ustawieniach, a Miara pokaże pułap z badań dla Twojego wzrostu.</p></div>'+E;
  const h2=Math.pow(num(S.cm)/100,2),med=muscleRec().med*h2;
  const pts=[['Teraz',ffm,'now',''],['Mediana 18-34 lat',med,'med','']];
  pts.push(['Pułap FFMI 25 (Kouri 1995)',k.ffmCap,'cap','kouri']);
  if(b){pts.push(['95% maksimum (Butt)',b.m95,'b95','butt']);pts.push(['Maksimum (Butt)',b.m,'bmax','butt'])}
  const lo=Math.min(ffm,med)-5,hi=Math.max(b?b.m:0,k.ffmCap)+5,W=260,X0=8,X1=252,x=v=>X0+(v-lo)/(hi-lo)*(X1-X0);
  // Etykiety z lewej połowy nad osią (tekst w prawo), z prawej pod osią (tekst w lewo); w obu grupach rosnąco, więc tekst nie przecina żadnego znacznika
  const all=pts.map(p=>({p,xx:x(p[1])})),up=all.filter(r=>r.xx<=W/2).sort((a,c)=>a.xx-c.xx),dn=all.filter(r=>r.xx>W/2).sort((a,c)=>a.xx-c.xx);
  const ay=16+up.length*20+4,H=ay+dn.length*20+28;
  const short={now:'Teraz',med:'Mediana',cap:'Pułap 25',b95:'95% Butt',bmax:'Maks. Butt'},lab=r=>`${short[r.p[2]]} ${fmt1(r.p[1])}`,X=r=>r.xx.toFixed(1);
  let g=`<svg class="potax" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Oś masy beztłuszczowej w kg: ${pts.map(p=>p[0]+' '+fmt1(p[1])).join(', ')}"><line class="axl" x1="${X0}" y1="${ay}" x2="${X1}" y2="${ay}"/>`;
  up.forEach((r,i)=>{const y=16+i*20;g+=`<line class="mk ${r.p[2]}" x1="${X(r)}" y1="${y-8}" x2="${X(r)}" y2="${ay}"/><text x="${(r.xx+4).toFixed(1)}" y="${y+3}" font-size="13">${lab(r)}</text>`});
  dn.forEach((r,i)=>{const y=ay+20+i*20;g+=`<line class="mk ${r.p[2]}" x1="${X(r)}" y1="${ay}" x2="${X(r)}" y2="${y+4}"/><text x="${(r.xx-4).toFixed(1)}" y="${y+3}" text-anchor="end" font-size="13">${lab(r)}</text>`});
  g+=`<text x="${X0}" y="${H-4}" font-size="13">${fmt1(lo)} kg</text><text x="${X1}" y="${H-4}" text-anchor="end" font-size="13">${fmt1(hi)} kg</text></svg>`;
  const li=(l,v,sub)=>`<li><span>${l}</span><span>${fmt1(v)} kg${sub||''}</span></li>`;
  let ul='<ul class="potl">'+li('Teraz',ffm,'')+li('Mediana 18-34 lat',med,'')+li('Pułap FFMI 25 (Kouri 1995)',k.ffmCap,` (do pułapu z badań: ${fmt1(k.gap)} kg)`);
  if(b)ul+=li('95% maksimum (Butt)',b.m95,` (do pułapu z badań: ${fmt1(b.gap95)} kg)`)+li('Maksimum (Butt)',b.m,` (do pułapu z badań: ${fmt1(b.gap)} kg)`);
  ul+='</ul>';
  const dF=potDate('ffm'),dT=potDate('fat');
  const over=k.gap===0||(b&&b.gap===0)?' Powyżej pułapu z badania: sprawdź pomiar lub zapytaj specjalistę.':'';const note=`<p class="small muted">Pułap to górna granica z badań, nie cel. Wiele osób łączy siłę z wytrzymałością i świadomie zostaje poniżej. Twoje FFMI: ${fmt1(k.ffmi)} kg/m², z korektą wzrostu ${fmt1(k.ffmiN)}. Masa beztłuszczowa z pomiaru z ${dF}${b&&dT?`, tłuszcz (${fmt1(b.f)}%) z ${dT}`:''}. Liczby są szacunkiem z badań na wybranych grupach, nie wynikiem dla Ciebie.${over}</p>`;
  const bh=b?'<p class="small muted">Wzór Butta pochodzi ze źródła wtórnego: wzór przepisany przez kalkulator, strona autora niedostępna.</p>':'<p class="small muted">Wpisz nadgarstek i kostkę w Pomiarach dnia, w obwodach, a Miara doliczy też wzór Butta.</p>';
  return head+'<div class="panel" style="padding:12px 16px">'+g+ul+note+bh+srcHtml(b?['kouri','butt']:['kouri'])+'</div>'+E}
// Sprawność (rada 18.11.2026): VO2max z zegarka albo szacunek Uth 2004 (PMID 14624296): 15,3 x HRmax / HRspoczynkowe, SEE około 4,5% przy zmierzonym HRmax i 7,8% przy HRmax z wieku;
// HRmax z wieku: 208 - 0,7 x wiek (Tanaka 2001); 1 MET = 3,5 ml/kg/min (Jetté 1990); progi 7,9 i 10,9 MET z metaanalizy Kodama 2009 (PMID 19454641)
function fitNow(){const ds=Object.keys(S.meas||{}).sort(),last=key=>{const d=ds.filter(x=>num(S.meas[x][key])>0).pop();return d?{d,v:num(S.meas[d][key])}:null};
  const z=last('vo2');let vo2,src,date,hs=null;
  if(z){vo2=z.v;src='zegarek';date=z.d}else{const r=last('hrRest');if(!r)return null;const hm=last('hrMax'),age=num(S.age);let mx;
    if(hm){mx=hm.v;hs='wpis'}else if(!isStart('age')&&age>=18){mx=208-0.7*age;hs='wiek'}else return null;
    vo2=15.3*mx/r.v;src='szacunek';date=r.d}
  const met=vo2/3.5,cat=met<7.9?'niska':met<10.9?'średnia':'wysoka',toNext=met<7.9?7.9-met:met<10.9?10.9-met:0;
  return {vo2,src,date,hrMaxSrc:hs,met,cat,toNext}}
function fitHtml(){const head='<section id="sprawnosc"><h3>Sprawność</h3>',E='</section>',r=fitNow();
  if(!r)return head+'<div class="panel"><p class="small muted" style="padding:8px 16px;margin:0">Wpisz VO2max z zegarka albo tętno spoczynkowe w Mój dzień, Sprawność. Miara pokaże poziom wydolności i krok do następnego progu.</p></div>'+E;
  const est=r.src==='szacunek',nx=r.cat==='niska'?'średniej':'wysokiej';
  let p=`<p style="margin:0"><b>${fmt1(r.vo2)} ml/kg/min</b>${est?' (szacunek z tętna)':' (z zegarka)'}, czyli ${fmt1(r.met)} MET. Wydolność ${r.cat} według progów z metaanalizy.</p>`;
  p+='<p class="small muted">'+(r.toNext>0?`Do następnego progu: ${fmt1(r.toNext)} MET (do ${nx} wydolności). `:'Powyżej ostatniego progu z metaanalizy. ')+'1 MET to realny krok: 1 MET więcej wiązał się w metaanalizie z ryzykiem zgonu niższym o 13% (33 badania, 102 980 osób). To związek z badań, nie obietnica dla Ciebie.</p>';
  if(est){const mx=r.hrMaxSrc==='wpis'?'Tętno maksymalne z Twojego wpisu: błąd około 4,5%.':'Tętno maksymalne z wieku (208 − 0,7 × wiek): błąd około 8%.';
    p+=`<p class="small muted">To szacunek, nie pomiar. ${mx} Badanie objęło tylko wytrenowanych mężczyzn, więc wzór jest sprawdzony tylko u nich.${S.sex!=='M'?' Dlatego wynik jest u Ciebie mniej pewny.':''} Wpisz VO2max z zegarka, a Miara użyje go zamiast szacunku.</p>`}
  p+=`<p class="small muted">Z wpisu z ${fmtDate(r.date)}.</p>`;
  return head+'<div class="panel" style="padding:12px 16px">'+p+srcHtml(est?['uth','tanaka','jette','kodama']:['jette','kodama'])+'</div>'+E}
function muscleSync(){const r=muscleRec();if(S.muscleAuto===false||!r||S.muscleAutoLast===r.above)return '';S.muscleAutoLast=r.above;if(!!S.muscle===r.above)return '';S.muscle=r.above;
  if(r.above){S.goalWay='talia';return 'Masa beztłuszczowa powyżej mediany: włączono „Dużo mięśni”, cel liczony z talii. Zmienisz to w Ustawieniach.'}
  return 'Masa beztłuszczowa poniżej mediany: wyłączono „Dużo mięśni”. Sposób liczenia celu sprawdź w Ustawieniach.'}
function muscleToast(){const m=muscleSync();if(m)toast(m);return !!m}
// Stare dane bez muscleAuto: zapisane „włączone” to wybór ręczny, „wyłączone” albo brak to automat (przegląd 17.11.2026)
// Imiona według gatunku (21.11.2026): zwierzak zapisany wcześniej bez imienia (poza kotkiem, który miał już Mruczka) zachowuje dotychczasową Kluskę
function petNameFix(raw,s){if(raw&&typeof raw==='object'&&!('petNames' in raw)){const p=s.pet;if(p&&typeof p==='object'&&!String(p.name||'').trim()&&p.kind!=='kotek')p.name='Kluska';s.petNames=1}return s}
// Jeden wybór „Mój dzień” (22.11.2026): zapisane „raz dziennie” (once bez pola focus) przechodzi w Skupienie
function viewFix(raw,s){if(raw&&typeof raw==='object'&&raw.once===true&&!('focus' in raw)){s.focus=true;s.lite=true;s.once=false}return s}
function muscleFix(raw,s){if(raw&&typeof raw==='object'&&!('muscleAuto' in raw))s.muscleAuto=!s.muscle;return s}
function muscleHtml(){const r=muscleRec(),on=!!S.muscle,a=num(S.age);
  let h=`<div class="panel"><div class="field"><label for="muscle">Dużo mięśni: oceniaj cel talią, nie samym BMI</label><input type="checkbox" class="switch" id="muscle" data-k="muscle" ${on?'checked':''}></div><div style="padding:0 16px 12px">`;
  if(!r)return h+(lastM('ffm')>0&&isStart('cm')?'<p class="small muted">Brak wzrostu. Wpisz wzrost w Ustawieniach, a Miara podpowie ustawienie.</p>':'<p class="small muted">Brak pomiaru masy beztłuszczowej (FFM). Wpisz FFM z wagi składu ciała w Mój dzień, Skład ciała, a Miara podpowie ustawienie.</p>')+'</div></div>';
  const f=fmt1(r.ffmi)===fmt1(r.med)?fmt2:fmt1;
  h+=`<p class="small muted">Twoje FFMI: ${f(r.ffmi)} kg/m² (masa beztłuszczowa na m² wzrostu). Mediana w badaniu dla ${S.sex==='M'?'mężczyzn':'kobiet'} 18-34 lat: ${f(r.med)}. Masz ${r.above?'więcej':'mniej'} niż połowa badanych, więc zalecamy: ${r.above?'włączone':'wyłączone'}. Reguła Miary: powyżej mediany = włączone.${a&&!isStart('age')&&(a<18||a>34)?' Mediana dotyczy wieku 18-34 lat; w badaniu u mężczyzn nie zmieniała się z wiekiem, u kobiet lekko rosła.':''}</p>`;
  if(on!==r.above)h+='<p><button class="btn ghost small" data-musclerec="1">Ustaw zalecane</button></p>';
  return h+srcHtml(['schutz'])+'</div></div>'}
function goalHint(){return S.mode!=='redukcja'||!isStart('goal')?'':'<p class="small muted">Cel startowy: 5% mniej niż obecna waga. Specjaliści zalecają na początek 5-10% w około 6 miesięcy; ustaw własny albo wybierz niżej.</p>'}
function fixTouched(o){if(o&&!o.touched)o.touched={kg:true,cm:true,age:true,goal:true};return o}
function startSync(){const b=START[S.sex]||START.K;['kg','cm','age'].forEach(k=>{if(isStart(k))S[k]=String(b[k])});if(isStart('goal'))S.goal=stpFmt(Math.round(num(S.kg)*0.95*2)/2,.5)}
// Rodzaj zwierzaka z kopii: tylko znane gatunki (stare kaczka zostaje kaczuszką), nieznany to gąska
function petFix(s){if(s&&s.pet&&typeof s.pet==='object'&&!PET.kinds().includes(s.pet.kind))s.pet.kind='gaska';return s}
function syFix(s){s=petFix(suppFix(s));s=promoFix(s,todayKey());try{return typeof SYG!=='undefined'?SYG.fix(s):s}catch(e){return s}}
function load(){let r=null;try{r=localStorage.getItem(LS);if(r){const o=JSON.parse(r);return syFix(viewFix(o,petNameFix(o,muscleFix(o,merge(clone(DEF),fixTouched(o))))))}}catch(e){}const f=clone(DEF);if(!r)f.lite=true;return f}
function save(){if(DEMO)return;try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}try{chSync()}catch(e){}}
// Tryb pokazowy (#demo): dane przykładowe w pamięci, bez zapisu; zwierzak co 3 s pokazuje kolejny stan
// ---------- Scenariusze do sprawdzania: dane przykładowe pod #demo-<nazwa>, nic się nie zapisuje ----------
// Dane testowe osoby wysportowanej i zdrowej (18.11.2026): wartości zmyślone, typowe dla profilu; badania z jednej daty w zakresach TGT
const SIL_M={label:'Siłownia, całe ciało',min:60,gross:380,net:300},SIL_K={label:'Siłownia, całe ciało',min:60,gross:300,net:240};
const SPORT={
  m:{sex:'M',age:'30',cm:'180',w:80,fat:'12',ffm:'70,4',ecw:'38',waist:'82',hip:'96',thigh:'58',wrist:'17,5',ankle:'22,5',vo2:'48',hr:'55',st:[9000,12000],tr:[null,SIL_M,null,SIL_M,null,SIL_M,null],
    lab:{tsh:'1.8',glu:'88',ins:'6',hba1c:'5.1',vitd:'38',ferr:'120',chol:'170',ldl:'95',hdl:'58',tg:'80',kreat:'1.0'}},
  k:{sex:'K',age:'30',cm:'168',w:60,fat:'22',ffm:'46,8',ecw:'39',waist:'68',hip:'94',thigh:'54',wrist:'15',ankle:'20,5',vo2:'42',hr:'58',st:[9000,12000],tr:[null,SIL_K,null,SIL_K,null,SIL_K,null],
    lab:{tsh:'1.6',glu:'84',ins:'5',hba1c:'5.0',vitd:'40',ferr:'60',chol:'175',ldl:'90',hdl:'68',tg:'70',kreat:'0.8'}},
  h:{sex:'M',age:'32',cm:'178',w:74,fat:'11',ffm:'65,9',ecw:'38',waist:'78',hip:'93',thigh:'55',wrist:'17',ankle:'22',vo2:'56',hr:'48',st:[12000,15000],
    tr:[{label:'Bieg',min:45,gross:560,net:490},SIL_M,{label:'Rower',min:60,gross:600,net:520},{label:'Bieg',min:40,gross:500,net:440},SIL_M,null,null],
    lab:{tsh:'1.5',glu:'86',ins:'4',hba1c:'5.0',vitd:'42',ferr:'90',chol:'166',ldl:'90',hdl:'62',tg:'70',kreat:'1.0'}}};
// 28 dni: waga ±0,5 kg, kroki i sen w paśmie profilu, VO2max i tętno co tydzień, obwody i skład dzień temu. P (opcjonalnie): odczyt {date,sex,age,cm,goal,mode,m} zamiast składu z profilu.
function sportS(o,b,P){const meas={},days={},cw=x=>x.toFixed(1).replace('.',','),ref=P?num(P.m.w):o.w;
  for(let i=0;i<28;i++){const k=nAgo(i),t=o.tr&&o.tr[i%7];
    meas[k]={w:cw(ref+((i*7)%5-2)*0.25),steps:String(o.st[0]+(i*1237)%(o.st[1]-o.st[0]+1)),sleep:String(7+(i%3)*0.5).replace('.',',')};
    if(o.vo2&&i%7===1)Object.assign(meas[k],{vo2:o.vo2,hrRest:o.hr});
    days[k]=(((b&&b.days)||{})[k]||[]).filter(e=>e.kind!=='t').concat(t?[Object.assign({kind:'t'},t)]:[])}
  Object.assign(meas[nAgo(1)],{waist:o.waist,hip:o.hip,thigh:o.thigh},P?{}:{fat:o.fat,ffm:o.ffm,ecw:o.ecw});
  if(P)meas[P.date]=Object.assign({},meas[P.date]||{},P.m);
  const ld=nAgo(7),labs=Object.entries(o.lab).map(([test,val])=>({id:'demo-'+test,test,date:ld,val,unit:LABN[test].u,fast:true}));
  const X=P||{sex:o.sex,age:o.age,cm:o.cm,goal:cw(o.w),mode:'utrzymanie',date:nAgo(27)};
  return Object.assign({sex:X.sex,age:X.age,cm:X.cm,kg:cw(ref),goal:X.goal,mode:X.mode,maintRef:X.mode==='utrzymanie'?ref:0,maintSince:X.mode==='utrzymanie'?X.date:'',
    frame:{wrist:o.wrist,ankle:o.ankle},touched:{kg:true,cm:true,age:true,goal:true},meas,days,labs},P?{}:{muscle:true})}
const SCEN={
  prosty:{t:'Prosty start: szybki wpis',tab:'day',chk:'Mój dzień: tylko karta „Szybki wpis dnia” z suwakiem kroków, zwierzak i Pokaż całą Miarę; 3 dni z kartą za sobą, więc zwierzak proponuje wagę.',
    f:b=>{const m={},W=['71,9','71,6','71,8','71,5','71,3','71,7','72,0','71,6','71,4','71,2','71,5','71,3','71,6','71,4'],SL=['7:15','6:45','7:30','7:00','6:30','7:45','7:15'];
      for(let n=1;n<=14;n++)m[nAgo(n)]=Object.assign({w:W[14-n]},n<=7?{sleep:SL[7-n]}:{});[1,2,3].forEach((n,i)=>{Object.assign(m[nAgo(n)],{stepsB:['lo','mid','hi'][i],feel:['dobrze','brzuch','dobrze'][i],redz:[1,0,2][i]})});m[nAgo(0)]={};return {lite:true,unlock:[],unlockAt:'',meas:m,pain:{},days:{}}}},
  start:{t:'Pierwsze wejście',chk:'Wprowadzenie, potem karta „Szybki wpis dnia” w Moim dniu i wskazówka „Pierwszy raz tutaj?” na każdym ekranie.',f:()=>({lite:true,onb:false,touched:{},guide:{hidden:false,dataOk:false,seenPet:false},tips:{},pet:null,petSeen:[],days:{},meas:{},hab:{},reviews:{}})},
  wpisy:{t:'Wpisy dnia',tab:'day',chk:'Mój dzień, Pomiary dnia, karta „Dziś”: waga od razu pokazuje wczorajsze 80,4 kg, + dodaje 0,1 kg, przytrzymanie zmienia wartość coraz szybciej, sen wpisujesz cyframi po dotknięciu liczby (6:13 albo 613), minuty 75 pokazują błąd pod wierszem i zostaje poprzednia wartość; „Jak wczoraj” zapisuje wczorajsze wartości.',
    f:b=>{const m=Object.assign({},b.meas);m[nAgo(0)]={};m[nAgo(1)]=Object.assign({},m[nAgo(1)],{w:'80,4',sleep:'6:13',steps:'8500'});return {meas:m}}},
  migrena:{t:'Migrena z aurą i Yaz',tab:'health',chk:'Zdrowie: „Najpierw” każe porozmawiać z ginekologiem, bo Yaz zawiera estrogen; licznik 10 dni z lekiem w 30 dniach; w 12 tygodniach ocena 3 cykli. Mój dzień: dzień z bólem i karta „Po krótkich nocach”.',f:b=>migPain(b,'yaz')},
  minitabletka:{t:'Migrena z aurą i minitabletka',tab:'health',chk:'Zdrowie: bez przeciwwskazania; zamiast niego kategorie UKMEC 2025 (2) i WHO 2025 (2 przy rozpoczęciu, 3 przy kontynuacji) i prośba o rozmowę z lekarzem; „Najpierw” to licznik dni z lekiem.',f:b=>migPain(b,'cerazette')},
  hashimoto:{t:'Hashimoto, lipodemia, insulinooporność',tab:'health',chk:'Zdrowie: TSH 6-8 tygodni po zmianie tabletek (Yasmin) do omówienia z lekarzem, pora leku na tarczycę z lekarzem lub farmaceutą, talia i uda osobno, cel co najmniej 7% masy ciała; w 12 tygodniach przedziały wagi.',f:()=>({prof:{cond:{hashi:true,lip:true,io:true},pill:'yasmin'},lip:true,goal:'70'})},
  polaczenia:{t:'Połączenia: IO, migrena i Hashimoto',tab:'meals',chk:'Posiłki: „Dla mnie” włączone, plan dnia z daniami „dopasowane do IO”. Zdrowie: zdania „Razem: …” dla par schorzeń. Mój dzień po 12:00: karta „Długa przerwa w jedzeniu”.',
    f:b=>{const d=Object.assign({},b.days);d[nAgo(0)]=[];return {prof:{cond:{io:true,mig:true,hashi:true},pill:'cerazette'},days:d}}},
  sciezka:{t:'Krok po kroku',tab:'krok',chk:'Krok po kroku: krok 1 „Bez gotowania”, postęp 2 z 3, dania bez gotowania, plan „jeśli…, to…”. Mój dzień: „Twój krok na ten tydzień”. Przegląd tygodnia: ocena kroku i własna zmiana jako opcja.',
    f:b=>{const d=Object.assign({},b.days),m=MEALS.find(x=>x.id==='s3'),x=macros(m,1,1),e={kind:'m',id:'s3',label:m.n,k:x.k,p:x.p,f:x.f,c:x.c};d[nAgo(0)]=[e,{...e}];return {krok:{ans:{cook:'0',bar:'skl',ord:'2',when:'wiecz',why:'zmecz'},eq:{mikrofala:true,piekarnik:true,blender:true},done:true,conf:true,step:0,since:mondayOf(new Date()),easy:false,jt:0,zap:{}},days:d}}},
  jelita:{t:'Wzdęcia i jelita',tab:'day',chk:'Mój dzień: zwinięty „Brzuch dziś” z 14 dniami wpisów i podsumowaniem 28 dni. Zdrowie: „Brzuch: kiedy do lekarza”, „co robić już teraz” i „Środki z badań” z dawkami i źródłami. Lista na wizytę: liczby z dziennika.',
    f:()=>{const gut={};for(let i=1;i<=14;i++)gut[nAgo(i)]={b:(i*3)%8,f:['twardy','uform','luzny'][i%3],n:i%4===0?0:1};return {prof:{cond:{gut:true},pill:''},gut}}},
  wszystkie:{t:'Wszystkie schorzenia i Yaz',tab:'day',chk:'Mój dzień: „Najpierw lekarz” z UKMEC 2025 (migrena bez aury, Yaz), tydzień celu „Regularne zapisy” zaliczony i „Następny cel”, „Twoje schorzenia razem”, zwierzak świętuje i mówi, co się zmieni.',
    f:()=>{const pain={};[2,6,11,17,23].forEach((n,i)=>{pain[nAgo(n)]={aura:false,med:i<2}});return {prof:{cond:{hashi:true,lip:true,io:true,mig:true},pill:'yaz'},lip:true,goal:'70',pain,cel:{id:'zapisy',since:nAgo(8)}}}},
  pokaz:{t:'Pełny pokaz',tab:'day',chk:'70 dni danych: Stan dziś, trendy, zwierzak z odznakami, przegląd tygodnia; zakładki działają jak na co dzień.',f:()=>({})},
  'sport-m':{t:'Wysportowany, zdrowy (dane zmyślone)',tab:'health',chk:'Zdrowie: karta „Potencjał mięśniowy” z pułapem FFMI 25 i wzorem Butta (FFMI ok. 21,7), karta „Sprawność” z poziomem wysokim (VO2max 48). Moje badania: wszystkie wyniki w zakresie, eGFR z kreatyniny i cholesterol nie-HDL. Tryb utrzymania, waga w paśmie.',f:b=>sportS(SPORT.m,b)},
  'sport-k':{t:'Wysportowana, zdrowa (dane zmyślone)',tab:'health',chk:'Zdrowie: karta „Potencjał mięśniowy” ze zdaniem, że oba modele opisano tylko u mężczyzn, i wskazaniem FFMI (ok. 16,6, powyżej mediany dla kobiet); Sprawność wysoka (VO2max 42). Moje badania: wyniki w zakresie, eGFR i nie-HDL.',f:b=>sportS(SPORT.k,b)},
  'sport-h':{t:'Sprawny, wytrzymały (dane zmyślone)',tab:'health',chk:'Zdrowie: potencjał mięśniowy umiarkowany (FFMI ok. 20,8, daleko od pułapu), karta „Sprawność” z poziomem wysokim (VO2max 56), 5 treningów mieszanych w tygodniu: bieg, siłownia, rower. Moje badania: wyniki w zakresie, eGFR i nie-HDL.',f:b=>sportS(SPORT.h,b)}};
function migPain(b,pill){const pain={},m=Object.assign({},b.meas);for(let i=0;i<12;i++)pain[nAgo(i*2)]={aura:i<3,med:i<10};[1,3,5].forEach(i=>{m[nAgo(i)]=Object.assign({},m[nAgo(i)],{cyc:'P'})});
  m[nAgo(0)]=Object.assign({},m[nAgo(0)],{sleep:'5:20'});m[nAgo(1)]=Object.assign({},m[nAgo(1)],{sleep:'5:45'});return {prof:{cond:{aura:true,mig:true},pill},pain,meas:m}}
function scenS(n){const b=PET.demo().S,sc=SCEN[n];if(!sc)return b;return Object.assign(b,sc.f(b),sc.tab?{tab:sc.tab}:{})}
let DEMO_N=typeof location!=='undefined'&&/^#demo-/.test(location.hash)&&SCEN[location.hash.slice(6)]?location.hash.slice(6):'';
let DEMO=typeof location!=='undefined'&&(location.hash==='#demo'||!!DEMO_N),DEMO_I=0;
let S=DEMO?merge(clone(DEF),fixTouched(DEMO_N?scenS(DEMO_N):PET.demo().S)):load();
try{dopPrune()}catch(_){}
// Karta „Dziś”: wartości robocze w sessionStorage tylko poza trybem pokazowym (tam nic się nie zapisuje)
if(typeof WPISY!=='undefined')WPISY.persistOn(!DEMO);
if(DEMO&&!DEMO_N)setInterval(()=>{DEMO_I++;const a=document.activeElement;if((S.tab==='day'||S.tab==='pet')&&!(typeof WPISY!=='undefined'&&WPISY.busy())&&!(a&&a.dataset&&a.dataset.k))render()},3000);
const open=new Set();

// ---------- Obliczenia ----------
const num=v=>{const s=String(v).trim().replace(/(\d)[\s\u00a0]+(?=\d{3}(\D|$))/g,'$1'),t=s.match(/^(\d{1,2})\s*(?::|h)\s*(\d{1,2})?\s*(?:m|min)?$/i);if(t)return +t[1]+(+(t[2]||0))/60;const x=parseFloat(s.replace(',','.'));return isFinite(x)?x:0};
// Wartości typowe formularza treningu (wiersze wartości, gdy pole jest puste)
const STP0={wmin:45,wk:300,min:45,speed:5,grade:0,watts:100};
function stpVal(k){return k.split('.').reduce((o,x)=>o==null?o:o[x],S)}
// Błąd widoczny od razu pod polem i powiązany z nim (WCAG 3.3.1, 3.3.3)
function fieldErr(el,msg){const f=el.closest&&el.closest('.field');if(!f)return;let s=f.querySelector('.err');
  if(msg){if(!s){s=document.createElement('small');s.className='err';s.id='err_'+(el.id||'pole');f.appendChild(s)}s.textContent=msg;f.classList.add('haserr');el.setAttribute('aria-describedby',s.id)}
  else if(s){s.remove();f.classList.remove('haserr');el.removeAttribute('aria-describedby')}}
function lastMeas(f,k){const ks=Object.keys(S.meas||{}).filter(x=>x<k&&String((S.meas[x]||{})[f]||'').trim()!=='').sort();return ks.length?String(S.meas[ks[ks.length-1]][f]):''}
// Liczba z krokiem: zapis (82,5 albo 82; całkowite bez odstępów) i wyświetlanie (82,0; 1 530 z odstępem tysięcy)
function numStep(v,st,disp){const r=Math.round(v*10)/10;return st<1?(disp?r.toFixed(1):String(r)).replace('.',','):disp?WF.k(v):String(Math.round(v))}
function stpFmt(v,st){return numStep(v,st,false)}
const LIM={kg:[35,250],goal:[35,250],w:[35,250],cm:[120,220],age:[16,90],steps:[0,60000],sleep:[0,16],waist:[30,200],hip:[30,200],thigh:[20,120],fat:[3,60],ffm:[25,120],ecw:[30,50],bmr:[900,3000],min:[1,300],wmin:[1,300],wk:[10,3000],speed:[1,20],grade:[0,25],watts:[20,500],wrist:[10,40],ankle:[10,40],vo2:[10,90],hrRest:[30,120],hrMax:[120,230]};
const INT_K=new Set(['steps','bmr','age','min','wmin','wk']);
// Pola ca\u0142kowite: separator tysi\u0119cy spacj\u0105, kropk\u0105 albo przecinkiem (10 500, 10.500, 10,500), bez u\u0142amk\u00f3w;
// czas treningu tak\u017ce jak w zegarku: 1:15 albo 1:15:30 (godziny:minuty[:sekundy]) zamieniany na minuty
const NUM_EX={steps:'8500',wk:'420',wmin:'45 albo 1:15',min:'45 albo 1:15',age:'28',bmr:'1450'},DUR_K=new Set(['min','wmin']);
const intErr=key=>'Wpisz liczb\u0119 ca\u0142kowit\u0105, np. '+(NUM_EX[key]||'10');
function checkNum(k,raw){const key=String(k).split('.').pop();let s=String(raw).trim();if(s==='')return {s};
  if(DUR_K.has(key)){const t=s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);if(t){if(+t[2]>59||+(t[3]||0)>59)return {s,err:'Minuty i sekundy od 0 do 59'};s=String(+t[1]*60+(+t[2])+Math.round(+(t[3]||0)/60))}}
  if(INT_K.has(key))s=s.replace(/[\s\u00a0.,](?=\d{3}(\D|$))/g,'');const core=key==='sleep'?s:s.replace(/\s*(kg|cm|h|%|kcal|lat|min|km\/h|w|g|zł)$/i,'');const ok=key==='sleep'?/^(\d{1,2}([.,]\d+)?|\d{1,2}\s*(:|h)\s*(\d{1,2})?\s*(m|min)?)$/i.test(s):/^\d+([.,]\d+)?$/.test(core);if(!ok)return {s,err:key==='sleep'?'Sen w godzinach i minutach, np. 7:30':INT_K.has(key)?intErr(key):'Wpisz samą liczbę, np. 82,4'};if(INT_K.has(key)&&/[.,]/.test(core))return {s,err:intErr(key)};if(key==='sleep'){const mm=s.match(/(?::|h)\s*(\d{1,2})/i);if(mm&&+mm[1]>59)return {s,err:'Minuty od 0 do 59'}}const r=LIM[key],v=num(core);if(r&&(v<r[0]||v>r[1]))return {s,err:'Dozwolone '+fmt1(r[0])+'-'+fmt1(r[1])};return {s:core}}
const fmt=x=>Math.round(x).toLocaleString('pl-PL');
const fmt1=x=>(Math.round(x*10)/10).toLocaleString('pl-PL');
const kg=()=>{const ks=Object.keys(S.meas||{}).sort().reverse();for(const k of ks){const v=num(S.meas[k].w);if(v>0)return v}return num(S.kg)||78};
function bmrMeasured(){const ks=Object.keys(S.meas||{}).sort().reverse();for(const k of ks){const v=num(S.meas[k].bmr);if(v>0&&Date.now()-new Date(k).getTime()<90*864e5)return v}return 0}
function rmr(){return bmrMeasured()||(10*kg()+6.25*(num(S.cm)||165)-5*(num(S.age)||28)+(S.sex==='M'?5:-161))}
function baseH(){return S.korekta?rmr()/24:kg()}
function todayKey(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function day(){const k=todayKey();if(!S.days[k])S.days[k]=[];return S.days[k]}
function trainNet(){return day().filter(e=>e.kind==='t').reduce((a,e)=>a+e.net,0)}

// ---------- Nawyki i punkty: tylko za zachowania, nigdy za wagę ani kalorie ----------
const HABITS=[
  {id:'sniad',n:'Śniadanie z białkiem',pts:10},
  {id:'kroki',n:'Cel kroków na ten tydzień',pts:10},
  {id:'spacer',n:'Spacer 10 min po obiedzie',pts:5},
  {id:'wstawanie',n:'Przerwa od biurka co godzinę',pts:5},
  {id:'trening',n:'Trening (liczy się sam z dziennika dnia)',pts:15,auto:'t'},
  {id:'zapis',n:'Co najmniej 3 zapisane posiłki (liczy się samo)',pts:10,auto:'m'},
  {id:'pasmo',n:'Średnia waga w paśmie ±1 kg (liczy się samo)',pts:10,auto:'u'},
  {id:'woda',n:'Woda do każdego posiłku',pts:5},
  {id:'stres',n:'Przy ochocie najpierw plan (liczy się samo z przycisku ochoty)',pts:10,auto:'s'},
  {id:'sen',n:'Sen 7 h lub dłużej (liczy się sam z pomiarów)',pts:10,auto:'z'}
];
const LEVELS=[[0,'Start'],[100,'Brąz'],[180,'Srebro'],[260,'Złoto'],[340,'Platyna']];
function keyOf(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function habOn(x,h,ents,k){if(x.auto==='z')return (sleepAt(k)||0)>=7||!!h[x.id];if(x.auto==='t')return ents.some(isMove)||!!h[x.id];if(x.auto==='m')return ents.filter(e=>e.kind==='m').length>=3;if(x.auto==='s')return ((S.urges||{})[k]||[]).some(u=>u.out!=='inne')||!!h[x.id];if(x.auto==='u'){if(S.mode!=='utrzymanie')return false;const a=avg7at(k),r=num(S.maintRef)||kg();return a!=null&&Math.abs(a-r)<=1}return !!h[x.id]}
function dayPts(k){const h=(S.hab&&S.hab[k])||{},ents=S.days[k]||[];return HABITS.reduce((a,x)=>a+(habOn(x,h,ents,k)?x.pts:0),0)}
function weekPts(){const d=new Date(),dow=(d.getDay()+6)%7;let s=0;for(let i=0;i<=dow;i++){const x=new Date(d);x.setDate(d.getDate()-i);s+=dayPts(keyOf(x))}return s}
function level(p){let l=LEVELS[0];for(const x of LEVELS)if(p>=x[0])l=x;return l}
// Wskazówki pierwszego wejścia: jedna na ekran, raz, do „Rozumiem”
const TIPS={day:'Tu jest Twój dzień: co zrobić dziś i jak idzie. Naciśnij kartę zwierzaka, żeby zobaczyć postęp.',
  meals:'Przy daniu, które jesz, naciśnij Zjem. Nie trzeba gotować wszystkiego z planu: zjedzone inaczej zapiszesz szybkim wpisem w Moim dniu.',
  train:'Masz zegarek? Wpisz czas i kalorie z zegarka na górze. Bez zegarka wybierz niżej rodzaj treningu i czas.',
  health:'Badania, suplementy i wiedza. Nic tu nie jest obowiązkowe, zajrzyj, gdy potrzebujesz.',
  set:'Twoje dane liczą kalorie: sprawdź je i naciśnij Zapisz i sprawdź. Tu też włączysz wpisywanie raz dziennie.',
  krok:'Odpowiedz na 5 pytań jednym dotknięciem. Miara pokaże możliwy łańcuch przyczyn i jeden mały krok na ten tydzień.',
  pet:'Zwierzak rośnie z dni z wpisami. Nie umiera i nie cofa się w rozwoju, nawet po przerwie.'};
function tipHtml(tab){if(DEMO||S.focus||!TIPS[tab]||(S.tips||{})[tab]||(tab==='day'&&guideActive()))return '';return `<div class="tip panel" role="note"><p><b>Pierwszy raz tutaj?</b> ${TIPS[tab]}</p><button class="btn small" data-tipok="${tab}">Rozumiem</button></div>`}
// Dzień aktywny: 30 pkt albo, w trybie raz dziennie, zapisany wpis dnia (posiłki oraz trening albo kroki)
function onceDone(k){const e=S.days[k]||[];return e.some(x=>x.kind==='m')&&(e.some(x=>x.kind==='t')||num((S.meas[k]||{}).steps)>0)}
function dayOk(k){return dayPts(k)>=30||(!!S.once&&onceDone(k))||liteFull(k)}
function streak(){let n=0,miss=0;const d=new Date();for(let i=0;i<366;i++){const x=new Date(d);x.setDate(d.getDate()-i);if(dayOk(keyOf(x))){n++;miss=0}else if(i===0||(S.pain||{})[keyOf(x)]){continue}else{miss++;if(miss>=2)break}}return n}
function habitsHtml(trained){
  const hk=todayKey(),hh=S.hab[hk]||{},wp=weekPts(),lv=level(wp),nx=LEVELS.find(x=>x[0]>wp);
  let g='<h2>Nawyki dnia</h2><div class="panel">'+HABITS.filter(x=>x.auto!=='u'||S.mode==='utrzymanie').map(x=>{const on=habOn(x,hh,day(),hk);return `<button class="opt hab ${on?'on':''}" data-hab="${x.id}" aria-pressed="${!!on}"><span class="box">${on?'✓':''}</span><span>${x.n}</span><span class="met">+${x.pts}</span></button>`}).join('')+'</div>';
  g+=`<div class="note"><b>${fmt(dayPts(hk))} pkt dziś, ${fmt(wp)} w tym tygodniu. Poziom: ${lv[1]}.</b> ${nx?`Do poziomu ${nx[1]} brakuje ${fmt(nx[0]-wp)} pkt.`:'To najwyższy poziom.'} Seria: ${streak()} dni z co najmniej 30 pkt; jeden słabszy dzień jej nie przerywa. Punkty zaczynają się od zera w każdy poniedziałek.</div><p><button class="btn ghost" data-share="1">Udostępnij tydzień</button></p>`;
  return g;
}

function spec(){
  const t=S.tr;
  if(t.cat==='bieznia'){
    const sp=Math.max(0,num(t.speed)),gr=Math.max(0,num(t.grade)),v=sp*1000/60,g=gr/100,run=t.bMode==='bieg';
    const vo2=run?0.2*v+0.9*v*g+3.5:0.1*v+1.8*v*g+3.5;
    let warn=null;
    if(!run&&sp>6.5)warn='Równanie dla marszu jest dokładne do ok. 6,5 km/h.';
    if(run&&sp<8)warn='Równanie dla biegu jest dokładne od ok. 8 km/h.';
    return {label:(run?'Bieg':'Marsz')+' na bieżni, '+fmt1(sp)+' km/h, nachylenie '+fmt1(gr)+'%',met:vo2/3.5,
      src:'równanie metaboliczne ACSM dla '+(run?'biegu':'marszu')+' (wiedza ogólna, niesprawdzone w źródle)',
      knee:run?'Bieg obciąża kolano znacznie mocniej niż marsz. Przy bólu lub urazie kolana wybierz marsz pod górę.':(gr>8?'Duże nachylenie mocniej obciąża przód kolana. Zacznij od 3-6%.':null),warn};
  }
  if(t.cat==='spinning'){
    if(t.sMode==='w'){const w=Math.max(0,num(t.watts));return {label:'Spinning, średnia moc '+fmt(w)+' W',watts:w,src:'moc z monitora roweru, sprawność brutto 20% (założenie, typowo 18-25%)',knee:'Siodełko na wysokości, przy której kolano w dolnym punkcie jest lekko ugięte.'}}
    const o=SPIN.find(x=>x.id===t.sClass)||SPIN[0];return Object.assign({},o,{label:'Spinning: '+o.n.toLowerCase()});
  }
  const A=ACT[t.cat],o=A.opts.find(x=>x.id===t.opt[t.cat])||A.opts[0];
  return Object.assign({},o,{label:A.label+': '+o.n.charAt(0).toLowerCase()+o.n.slice(1)});
}
function kcal(sp,min){
  const h=min/60,b=baseH();
  if(sp.watts!=null){const gross=sp.watts*3600/(0.2*4184)*h;return {gross,net:Math.max(0,gross-b*h)}}
  return {gross:sp.met*b*h,net:Math.max(0,(sp.met-1)*b*h)};
}
function carbMult(){if(S.f.carb!=='auto')return num(S.f.carb);const n=trainNet();return n>=300?1.5:(n>=150?1.25:1)}
function macros(m,cm,por,adj){
  let k=0,p=0,f=0,c=0,fib=0,fibNA=false;
  const items=m.ing.map(([id,g,isC])=>{const gg=g*(isC?cm:1)*por*((adj&&adj[id])||1),i=ING[id];k+=i.k*gg/100;p+=i.p*gg/100;f+=i.f*gg/100;c+=i.c*gg/100;if(typeof i.fib==='number')fib+=i.fib*gg/100;else fibNA=true;return {n:i.n,g:gg,isC:!!isC}});
  return {k,p,f,c,fib,fibNA,items};
}
// ---------- Dopasuj danie (P1, makieta zaakceptowana 26.11.2026; plan rada/plany/2026-11-27-wdrozenie-posilki-trening-plan.md) ----------
// Dopasowanie to mnożniki gramów składników (1 = przepis, zakres 0,5-2): S.adj[dzień][danie] tylko na ten dzień, S.ver[danie] „Twoja wersja” na kolejne dni.
// Dźwignie (reguła aplikacji): białko: składnik z największym udziałem białka; tłuszcz i węglowodany: największy udział z pominięciem dźwigni białka
// i węglowodanów (żeby suwaki nie ruszały tego samego składnika); dźwignią tłuszczu tylko składnik tłusty (co najmniej 10 g tłuszczu na 100 g), bez niego suwaka tłuszczu nie ma (f = null). Węglowodany najpierw porcja z przepisu.
function dopLevers(m){const top=(k,no,strict)=>{const c=m.ing.filter(x=>!no.includes(x[0])&&ING[x[0]][k]>0),l=c.length?c:strict?[]:m.ing;return l.length?l.reduce((a,x)=>ING[x[0]][k]*x[1]>ING[a[0]][k]*a[1]?x:a)[0]:null},
  p=top('p',[]),cp=m.ing.find(x=>x[2]),c=cp?cp[0]:top('c',[p]),fat=m.ing.filter(x=>ING[x[0]].f<10).map(x=>x[0]);return {p,c,f:top('f',[p,c,...fat],true)}}
function dopBase(m,id,cm,por){const x=m.ing.find(y=>y[0]===id);return x[1]*(x[2]?cm:1)*por}
const dopStep=b=>b<20?1:5;
// Gramy po zaokrągleniu do kroku i w zakresie 0,5-2× przepisu, jako mnożnik
function dopClamp(b,g){const s=dopStep(b),lo=Math.ceil(b*0.5/s)*s,hi=Math.floor(b*2/s)*s;return Math.max(lo,Math.min(hi,Math.round(g/s)*s))/b}
function dopShift(m,adj,mac,d,cm,por){const id=dopLevers(m)[mac];if(!id)return null;const b=dopBase(m,id,cm,por),f0=(adj&&adj[id])||1,dens=ING[id][mac]/100;if(!dens)return null;
  const f=dopClamp(b,b*f0+d/dens);if(Math.abs(f-f0)<1e-9)return null;return Object.assign({},adj,{[id]:f})}
// „Lżej” o ok. 100 kcal: najpierw dźwignia węglowodanów (najwyżej do połowy porcji), potem tłuszczu
function dopLighter(m,adj,cm,por){const L=dopLevers(m),o=Object.assign({},adj);let need=100;
  [L.c,L.f].filter(Boolean).forEach(id=>{if(need<=0)return;const b=dopBase(m,id,cm,por),per=ING[id].k/100,f0=o[id]||1,f=dopClamp(b,b*f0-need/per);need-=(f0-f)*b*per;o[id]=f});return o}
function dopOf(id){const a=((S.adj||{})[todayKey()]||{})[id]||(S.ver||{})[id];return a&&Object.keys(a).length?a:null}
// Wpisy „tylko dziś” starsze niż 7 dni są zbędne (rada 27.11.2026)
function dopPrune(){if(!S.adj)return;const lim=nAgo(7);Object.keys(S.adj).forEach(k=>{if(k<lim)delete S.adj[k]})}
// Makro jednym wierszem: skróty widoczne, pełne słowa dla czytnika ekranu
function fibG(x){return `${fmt(x.fib)}${x.fibNA?'+':''} g`}
// Makra W6 (krok 9a, 26.11.2026): litera i liczba na jasnym tle koloru makra z kreską 2 px, „g” raz po błonniku; czytnik ekranu dostaje pełne słowa z jednostką
function macChips(x){const c=(l,v,t,g)=>`<span class="mc" style="--c:var(--${t})">${l}\u00a0<b>${v}</b>${g?'\u00a0g':''}</span>`;
  return `<span class="mml"><span aria-hidden="true">${c('B',fmt(x.p),'mB')}${c('T',fmt(x.f),'mT')}${c('W',fmt(x.c),'mW')}${c('Bł',fmt(x.fib)+(x.fibNA?'+':''),'mBl',1)}</span><span class="sr">białko ${fmt(x.p)} g, tłuszcz ${fmt(x.f)} g, węglowodany ${fmt(x.c)} g, błonnik ${x.fibNA?'co najmniej ':''}${fmt(x.fib)} g</span></span>`}
// Pasek proporcji kalorii z makr w kolorach makr, odstęp 2 px między odcinkami
function propBar(x,st){const tot=x.p*4+x.f*9+x.c*4||1;return `<div class="bar mbar"${st?` style="${st}"`:''} aria-hidden="true"><i style="width:${x.p*4/tot*100}%;background:var(--mB)"></i><i style="width:${x.f*9/tot*100}%;background:var(--mT)"></i><i style="width:${x.c*4/tot*100}%;background:var(--mW)"></i></div>`}
const FIBE=x=>({fib:x.fib,...(x.fibNA?{fibNA:1}:{})});
const CHIPS=[...new Set(Object.values(ING).map(i=>i.chip).filter(Boolean))];
function chipsOf(m){return new Set(m.ing.map(x=>ING[x[0]].chip).filter(Boolean))}
// Oznaczenia przepisów liczone z reguł (rada/2026-11-06_oznaczenia-przepisow); tylko oznaczenia pozytywne
// „Dla mnie”: zasady jedzenia z profilu; dziś tylko IO ma regułę dla składu dań, reszta schorzeń nie (rada/2026-11-06_posilki-dla-mnie)
function forMe(){return !!((S.prof||{}).cond||{}).io&&S.f.forme!==false}
function forMeHtml(){const c=(S.prof||{}).cond||{};if(!Object.values(c).some(Boolean))return '';
  if(!c.io)return '<p class="small muted" style="margin:4px 8px">Twój profil nie zmienia doboru dań: dla Hashimoto, migreny i lipodemii nie ma diety z dowodami. Liczą się regularne posiłki i cały plan; soję przy Hashimoto oznaczamy.</p>';
  return `<div class="chips"><button class="chip${forMe()?' inc':''}" data-forme="1" aria-pressed="${forMe()}">Dla mnie</button></div><p class="small muted" style="margin:4px 8px">${forMe()?'Pokazuję dania zgodne z Twoim profilem: reguła Przy IO. Plan dnia też jest do niej dopasowany.':'Pokazuję wszystkie dania.'}</p>`}
function ioFit(m,x){return m.t==='przekaska'?x.c<=20&&(x.p>=10||x.f>=8):x.p>=20&&x.c<=50}
function mealTags(m,x){const t=[];if(m.sw)t.push(['Słodkie','danie na słodko, słodycz z owoców']);
  if(ioFit(m,x))t.push(['Przy IO',m.t==='przekaska'?'do 20 g węglowodanów z białkiem albo tłuszczem':'co najmniej 20 g białka i do 50 g węglowodanów']);
  const fr=x.k>0?x.fib/x.k*100:0;if(fr>=3)t.push(['Dużo błonnika','co najmniej 3 g błonnika na 100 kcal (próg UE dla wysokiej zawartości)']);else if(fr>=1.5)t.push(['Źródło błonnika','co najmniej 1,5 g błonnika na 100 kcal (próg UE dla źródła błonnika)']);
  if(((S.prof||{}).cond||{}).hashi&&m.ing.some(i=>i[0]==='tofu'))t.push(['Soja: odstęp od leku','soja może zmniejszać wchłanianie lewotyroksyny (opisy przypadków, wytyczne ATA)']);return t}
function tagsHtml(m,x){return mealTags(m,x).map(([l,w])=>`<span class="msep"><span aria-hidden="true"> | </span><span class="sr">, </span></span><span class="mtag" title="${w}">${l}</span>`).join('')}
function filtered(o){
  const cm=carbMult(),por=num(S.f.portion)||1;
  const inc=Object.keys(S.f.chips).filter(k=>S.f.chips[k]===1),exc=Object.keys(S.f.chips).filter(k=>S.f.chips[k]===-1);
  const sorters={p:(a,b)=>b.x.p/b.x.k-a.x.p/a.x.k,k:(a,b)=>a.x.k-b.x.k,t:(a,b)=>a.m.min-b.m.min};
  const pc=S.f.pace||'all';
  return MEALS.filter(m=>(o&&o.allTypes)||((S.f.type==='all'||m.t===S.f.type)&&(pc==='all'||(pc==='quick'?m.min<=20:m.min>=25))))
    .map(m=>({m,x:macros(m,cm,por),ch:chipsOf(m)}))
    .filter(o=>(!(S.f.tags||{}).sw||o.m.sw)&&(!(S.f.tags||{}).io||ioFit(o.m,o.x))&&(!forMe()||ioFit(o.m,o.x)))
    .filter(o=>!exc.some(c=>o.ch.has(c)))
    .filter(o=>!inc.length||inc.some(c=>o.ch.has(c)))
    .filter(o=>o.x.p>=S.f.minP&&o.x.k<=S.f.maxK&&o.x.c<=S.f.maxC)
    .map(o=>Object.assign(o,{hits:inc.filter(c=>o.ch.has(c)).length}))
    .sort((a,b)=>(b.hits-a.hits)||sorters[S.f.sort](a,b));
}

// ---------- Zwierzak (pet.js): dane dla PET.state, karta, wybór, ekran postępu ----------
function petPts(k){const x=HABITS.find(h=>h.id==='pasmo');return dayPts(k)-(habOn(x,(S.hab||{})[k]||{},S.days[k]||[],k)?x.pts:0)}
function petCtx(now){return {now:now||new Date(),lite:!!S.lite,liteFull:k=>liteFull(k),pet:S.pet,once:!!S.once,pain:k=>!!(S.pain||{})[k],seen:S.petSeen||[],celeb:S.petCeleb&&S.petCeleb.day===todayKey()?S.petCeleb.id:null,key:keyOf,dayPts:k=>(S.once&&onceDone(k))||liteFull(k)?Math.max(30,petPts(k)):petPts(k),entries:k=>S.days[k]||[],meas:k=>S.meas[k]||{},habs:k=>(S.hab||{})[k]||{},urges:k=>(S.urges||{})[k]||[],reviewed:Object.keys(S.reviews||{}).length>0,streak,weekPts,level,stage:stageInfo,avgW:(a,b)=>avgAgo(a,b,'w'),startW:(stageInfo()||{}).start||null,num,goalDone:!!(celWeek()||{}).done,goal:petGoal(),nextLevel:(()=>{const wp=weekPts(),nx=LEVELS.find(x=>x[0]>wp);return nx?{name:nx[1],need:nx[0]-wp}:null})()}}
// Cel dla zapowiedzi zwierzaka: nazwa, stan z ZD.progress i pierwszy wpływ z mapy powiązań
function petGoal(){const g=S.cel&&ZD.goalOf(S.cel.id);if(!g)return null;const wk=celWeek(),im=ZD.impact(g.id,S.prof)[0];const ok=!!(wk&&wk.done),nx=ok?ZD.goalOf(ZD.suggest(S,todayKey(),zdCtx(),[g.id])):null;return {t:g.t,left:ok?'tydzień zaliczony':'teraz '+ZD.progress(S,g.id,todayKey(),zdCtx()).txt,nx:nx?nx.t:'',gain:im?im.t:''}}
// Kamień milowy zaliczany poza przerysowaniem przy wpisywaniu (REDRAW); świętowanie widoczne do obejrzenia ekranu zwierzaka
function petState(){if(DEMO&&!DEMO_N){const fr=PET.demo().frames,f=fr[DEMO_I%fr.length];S.pet.kind=f.kind;return PET.state(Object.assign(petCtx(),{force:f}))}const st=PET.state(petCtx());let ch=false;if(st.milestone&&!REDRAW){S.petSeen=(S.petSeen||[]).concat(st.milestone);S.petCeleb={id:st.milestone,day:todayKey()};ch=true}if(S.pet&&st.active>(S.pet.peak||0)){S.pet.peak=st.active;ch=true}const wk=celWeek();if(S.pet&&wk&&wk.done){const id=S.cel.id+':'+wk.end;S.pet.stones=S.pet.stones||[];if(S.pet.pathSeen==null)S.pet.pathSeen=S.pet.stones.length;if(!S.pet.stones.includes(id)){S.pet.stones.push(id);ch=true}}if(ch)save();return st}
// Pogoda na ścieżce kamieni: wiatr w dzień z bólem głowy, mgła po 2 krótkich nocach; nigdy kara
function petWeather(){if((S.pain||{})[todayKey()])return 'wiatr';const a=sleepAt(todayKey()),b=sleepAt(nAgo(1));return a!=null&&b!=null&&a<6&&b<6?'mgla':''}
// Jajko pęka z Pierwszymi krokami (dane, waga, posiłek, ruch): rada/2026-11-09_pierwsze-uruchomienie, punkt 2
function liteDays(from){return Object.keys(S.meas||{}).filter(k=>(!from||k>from)&&liteFull(k)).length}
function eggCrack(){return Math.max(guideSteps().filter(x=>['data','weight','meal','move'].includes(x.id)&&x.done).length,Math.min(4,liteDays()))}
// Prosty widok: karta „Szybki wpis dnia”. Kroki z suwaka (liczba) albo dawny zakres stepsB; liczba ma pierwszeństwo.
function stepsBand(k){const m=(S.meas||{})[k]||{},n=num(m.steps);if(String(m.steps==null?'':m.steps).trim()!==''&&n>=0)return n<5000?'lo':n<=8000?'mid':'hi';return ['lo','mid','hi'].includes(m.stepsB)?m.stepsB:''}
function liteFull(k){const m=(S.meas||{})[k]||{};return stepsBand(k)!==''&&!!m.feel&&[0,1,2].includes(m.redz)}
// Stopniowe odkrywanie: po 3 dniach z pełną kartą od ostatniego odkrycia Miara proponuje jeden kolejny element; „Nie teraz” niczego nie usuwa
const UNLOCK=['waga','posilki','sen','cala'];
const UNLOCK_TXT={waga:'Dodać wagę? Jedno pole rano. Bez wagi kalorie są liczone w przybliżeniu.',posilki:'Dodać posiłki z planu? „Zjem” przy daniu zapisuje posiłek jednym dotknięciem.',sen:'Dodać sen? Jedno pole: ile godzin spałaś lub spałeś.',cala:'Chcesz zobaczyć całą Miarę? Wszystko, co dodasz, zostaje.'};
function unlockNext(){if(!S.lite)return null;const id=UNLOCK.find(x=>!(S.unlock||[]).includes(x));if(!id||liteDays(S.unlockAt)<3)return null;if(S.unlockSnooze&&todayKey()<S.unlockSnooze)return null;return id}
function unlockHtml(){const k=todayKey(),m=(S.meas||{})[k]||{},u=S.unlock||[];let h='';
  h+=wpCardHtml();
  if(u.includes('posilki')){const n=(S.days[k]||[]).filter(e=>e.kind==='m').length;h+=`<div class="panel"><div class="field"><span>Posiłki z planu</span><span class="small">Zapisane dziś: ${n}</span><button class="btn ghost small" data-tab="meals">Posiłki</button></div></div>`}
  const nx=unlockNext();
  if(nx)h+=unlockPropHtml(nx);
  return h}
// ---------- Tryb skupienia (F1a planu ADHD, 22.11.2026, wersja B): jedno zadanie naraz w Moim dniu ----------
// Kolejka: wiersze szybkiego wpisu i odkryte elementy; wpisane już (np. kroki ze Skrótu) od razu zrobione. „Później” i „Pokaż resztę dnia”
// to stan widoku (bez zapisu); mine = zadania zrobione na tej karcie, do licznika „N z M”. Bez reakcji zwierzaka, wskazówek i ruchu.
function unlockPropHtml(nx){return `<div class="note"><p style="margin:0 0 8px">${UNLOCK_TXT[nx]}</p><p style="margin:0"><button class="btn small" data-unlock="${nx}">${nx==='cala'?'Pokaż':'Dodaj'}</button> <button class="btn ghost small" data-unlocklater="1">Nie teraz</button></p></div>`}
const SKUP_UI={day:'',skip:[],mine:[],cur:'',rest:'',say:''};
const SKUP_Q={k:'Ile kroków dziś?',feel:'Jak się czujesz?',redz:'Jedzenie kaloryczne dziś',w:'Ile ważysz rano?',s:'Ile spałaś lub spałeś?',posilki:'Jak wyglądało dziś jedzenie?'};
function skupChips(f,cur,opts,lab){return `<div class="chips" role="group" aria-label="${lab}">`+opts.map(([v,l])=>`<button class="chip${String(cur)===String(v)?' inc':''}" data-lite="${f}:${v}" aria-pressed="${String(cur)===String(v)}">${l}</button>`).join('')+'</div>'}
function skupItems(k){const m=(S.meas||{})[k]||{},u=S.unlock||[],ms=(S.days[k]||[]).filter(e=>e.kind==='m').length,lv=liteVals(k),wcfg=f=>({scope:'wp',day:k,title:SKUP_Q[f],rows:[wpSpec(f)],api:WP_API});
  const wv=measCp(m,'w')?null:wpVal('w',m.w),sl=sleepAt(k),wp=typeof WPISY!=='undefined';
  const R={k:{label:'Kroki',done:stepsBand(k)!=='',val:lv[0].replace(/^Kroki /,''),html:()=>'<div class="wp-qbox">'+stepsRowHtml(m,k)+'</div>'},
    w:{label:'Waga',done:wv!=null,val:wv!=null?WF.w(wv)+' kg':'',html:()=>wp?WPISY.card(wcfg('w')):''},
    s:{label:'Sen',done:sl!=null,val:sl!=null?WF.sleep(sl*60):'',html:()=>wp?WPISY.card(wcfg('s')):''}};
  const top=(wp?WPISY.rowOrder(new Date().getHours()):['w','s','k']).filter(x=>x==='k'||(x==='w'&&u.includes('waga'))||(x==='s'&&u.includes('sen')));
  const L=top.map(id=>({id,...R[id]}));
  L.push({id:'feel',label:'Samopoczucie',done:!!m.feel,val:lv[1],html:()=>skupChips('feel',m.feel||'',LITE_FEEL,'Jak się czujesz?')});
  L.push({id:'redz',label:'Jedzenie kaloryczne',done:[0,1,2].includes(m.redz),val:(LITE_REDZ.find(x=>x[0]===m.redz)||[,''])[1],html:()=>'<p class="small muted" style="margin:0 0 8px">słodycze, fast food, słone przekąski, alkohol</p>'+skupChips('redz',m.redz==null?'':m.redz,LITE_REDZ.map(([v,l])=>[v,l]),'Jedzenie kaloryczne dziś')});
  if(u.includes('posilki'))L.push({id:'posilki',label:'Posiłki',done:ms>0,val:ms?ms+' zapisane':'',html:()=>'<p class="skup-two">'+actHtml('plan','data-dayplan="1"',ACT_L.plan,false,'')+'<button class="btn ghost" data-tab="meals">Inaczej</button></p>'});
  return L}
function skupView(){const k=todayKey();if(SKUP_UI.day!==k)Object.assign(SKUP_UI,{day:k,skip:[],mine:[],cur:'',rest:''});
  const items=skupItems(k),q=SKUP.queue(items,SKUP_UI.skip),dn=new Set(q.done);
  if(SKUP_UI.cur&&dn.has(SKUP_UI.cur)&&!SKUP_UI.mine.includes(SKUP_UI.cur))SKUP_UI.mine.push(SKUP_UI.cur);
  SKUP_UI.mine=SKUP_UI.mine.filter(x=>dn.has(x));
  return {k,items,todo:q.todo,done:q.done}}
function skupDoneHtml(v){const D=v.items.filter(x=>x.done);if(!D.length)return '';
  return '<ul class="skup-done panel" aria-label="Zrobione dziś">'+D.map(x=>`<li><span class="skup-tick" aria-hidden="true">✓</span><span><b>${x.label}</b>${x.val?' · '+esc(x.val):''}</span></li>`).join('')+'</ul>'}
function skupDayHtml(){const v=skupView();if(SKUP_UI.rest===v.k)return null;
  if(!v.todo.length){SKUP_UI.cur='';const p=S.pet?`<p class="skup-pet">${PET.svg(S.pet.kind,'young','happy',null)}<span>${esc(PET.nameOf(S.pet))}: dzień zapisany.</span></p>`:'',nx=unlockNext();
    return `<section class="panel skup-fin" id="skup" aria-labelledby="skup_h"><h2 id="skup_h" tabindex="-1">Gotowe na dziś</h2>${p}<p><button class="btn ghost" data-skuprest="1">Pokaż resztę dnia</button></p></section>`+(nx?unlockPropHtml(nx):'')+skupDoneHtml(v)}
  const id=v.todo[0],it=v.items.find(x=>x.id===id),n=v.todo.length+SKUP_UI.mine.length,pos=SKUP_UI.mine.length+1;
  if(SKUP_UI.cur!==id){if(SKUP_UI.cur)SKUP_UI.say=`${pos} z ${n}: ${SKUP_Q[id]}`;SKUP_UI.cur=id}
  return `<section class="panel skup-card" id="skup" aria-labelledby="skup_h"><p class="skup-n">${pos} z ${n}</p><h2 id="skup_h" tabindex="-1">${SKUP_Q[id]}</h2>${it.html()}`
    +`<p class="skup-act"><button class="btn ghost" data-skuplater="${id}">Później</button></p></section>`+skupDoneHtml(v)}
// Po zmianie zadania: fokus na nagłówku nowej karty i jedno ogłoszenie w #sr (WCAG 2.4.3, 4.1.3); bez przewijania strony
// F1b: tytuł głównej karty zakładki w Skupieniu; pusty = zakładka bez zmian (Ustawienia to lista wyborów przeglądana celowo)
function skupMain(tab){return tab==='meals'?'Dziś według planu':tab==='train'?'Trening z zegarka':tab==='health'?(profSet()?'Twój plan':'Mój profil zdrowia'):''}
function skupAfter(){const t=SKUP_UI.say;if(!t||typeof document==='undefined'||!document.querySelector)return;SKUP_UI.say='';const sr=document.getElementById('sr');if(sr)sr.textContent=t;const h=document.getElementById('skup_h');if(h&&h.focus)h.focus({preventScroll:true})}
// Podsumowanie po szybkim wpisie (plan łatwości 20.11.2026, zadanie 4): pełny dzień zwija kartę w miejscu do „✓ Zapisane na dziś”;
// „Twój stan” rozwija się w miejscu, bez zmiany ekranu (WCAG 3.2.2). Same liczby, ten sam neutralny wygląd dla każdej wartości.
// LITE_UI to stan widoku, nie dane: open = dzień rozwinięty przez „Zmień”, sum = podsumowanie otwarte, focus i say = fokus i komunikat po przerysowaniu
const LITE_UI={open:'',sum:'',focus:'',say:''};
const LITE_FEEL=[['dobrze','Dobrze'],['glowa','Ból głowy'],['brzuch','Brzuch'],['inne','Inne']],LITE_REDZ=[[0,'0','0 razy'],[1,'1','1 raz'],[2,'2 lub więcej','2 lub więcej']];
const dniPl=n=>n===1?'1 dzień':n+' dni',zDni=n=>n===1?'z 1 dnia':'z '+n+' dni';
function liteVals(k){const m=(S.meas||{})[k]||{},ts=String(m.steps==null?'':m.steps).trim(),n=num(ts),SB={lo:'poniżej '+WF.k(5000),mid:'od '+WF.k(5000)+' do '+WF.k(8000),hi:'powyżej '+WF.k(8000)};
  return ['Kroki '+(ts!==''&&n>=0?WF.k(Math.round(n)):SB[m.stepsB]||''),(LITE_FEEL.find(x=>x[0]===m.feel)||[,''])[1],'Jedzenie kaloryczne '+(LITE_REDZ.find(x=>x[0]===m.redz)||[,''])[1]]}
// Zwinięcie karty: fokus na „Podsumowanie”, jedno ogłoszenie w #sr po przerysowaniu (liteAfter); przy przejściu do pełnego dnia
// to ogłoszenie zastępuje komunikat „Dzień zapisany”, żeby dwa regiony na żywo nie nadpisywały się nawzajem
function liteCollapse(k,fresh){LITE_UI.open='';LITE_UI.sum='';LITE_UI.focus='lite_see';LITE_UI.say=(fresh?'Dzień zapisany. ':'')+'Szybki wpis zwinięty: '+liteVals(k).join(', ')+'.'}
function liteAfter(){const id=LITE_UI.focus;if(!id)return false;const say=LITE_UI.say;LITE_UI.focus='';LITE_UI.say='';const sr=document.getElementById('sr');if(sr&&say)sr.textContent=say;
  const el=document.getElementById(id);if(!el||!el.focus)return false;const r=el.getBoundingClientRect&&el.getBoundingClientRect();if(r&&(r.top<0||r.bottom>innerHeight)&&el.scrollIntoView)el.scrollIntoView({block:'center'});focusEl(el);return true}
// Waga z 14 dni przez WPISY.spark z pasem ±0,35% (to samo źródło co karta „Dziś”) tylko przy co najmniej 2 ważeniach; jedno ważenie to sama liczba
function liteWHtml(){const ks=lastKeys(14).reverse(),vals=ks.map(x=>{const m=(S.meas||{})[x]||{};return measCp(m,'w')?null:wpVal('w',m.w)}),ok=vals.filter(x=>x!=null);
  if(!ok.length)return '';if(ok.length<2){const i=vals.findIndex(x=>x!=null);return `<p>Waga ${WF.w(ok[0])} kg (${fmtDate(ks[i])}).</p>`}
  const l7=vals.slice(7).filter(x=>x!=null),b=l7.length?l7:ok,ref=b.reduce((s,x)=>s+x,0)/b.length,n=ok.length;
  return `<p>Waga z 14 dni, średnia 7 dni ${WF.w(ref)} kg. Pas to zwykłe wahanie tygodnia, ok. 0,35% masy.</p>`+sparkSvg('wp-spark','','Waga z 14 dni',ok,['ważenia','ważeń'],'kg',WF.w,`, średnia 7 dni ${WF.w(ref)} kg. Pas to zwykłe wahanie tygodnia.`,vals,{ref,pct:0.0035})
    +'<p class="wp-src">Wahanie tygodnia: Turicchi i in., PLoS One 2020, <a href="https://pubmed.ncbi.nlm.nih.gov/32353079/" target="_blank" rel="noopener">PMID 32353079</a>.</p>'}
function liteStanHtml(k){const D=lastKeys(7).reverse(),M=x=>(S.meas||{})[x]||{},WD=['niedziela','poniedziałek','wtorek','środa','czwartek','piątek','sobota'],IN=['nd','pn','wt','śr','cz','pt','sb'];
  const td=liteVals(k),w=wpVal('w',M(k).w),sl=sleepAt(k);if(w!=null)td.push('Waga '+WF.w(w)+' kg');if(sl!=null)td.push('Sen '+WF.sleep(sl*60));
  const dots=D.map(x=>{const d=new Date(x+'T12:00:00').getDay(),on=liteFull(x);return `<li class="lite-dot${on?' on':''}"><span class="lite-d" aria-hidden="true"></span><span aria-hidden="true">${IN[d]}</span><span class="wp-sr">${WD[d]} ${fmtDate(x)}: ${on?'szybki wpis':'bez wpisu'}</span></li>`}).join('');
  const nz=L=>L.filter(x=>x[1]>0).map(([l,n])=>l+' '+dniPl(n)).join(' · ')||'brak wpisów';
  const cnt=(f,v)=>D.filter(x=>M(x)[f]===v).length,nS=D.filter(x=>!measCp(M(x),'steps')&&num(M(x).steps)>0).length,nL=D.filter(x=>sleepAt(x)!=null).length,aS=avgAgo(0,7,'steps'),aL=avgAgo(0,7,'sleep');
  let h=`<h3 id="lite_stan_h">Twój stan</h3><p><b>Dziś:</b> ${td.join(' · ')}</p><p><b>Ostatnie 7 dni:</b> Szybki wpis w ${D.filter(liteFull).length} z 7 dni</p><ol class="lite-dots" aria-label="Ostatnie 7 dni">${dots}</ol>`
    +`<p><b>Samopoczucie:</b> ${nz(LITE_FEEL.map(([v,l])=>[l,cnt('feel',v)]))}</p><p><b>Jedzenie kaloryczne:</b> ${nz(LITE_REDZ.map(([v,,l])=>[l,cnt('redz',v)]))}</p>`;
  if(aS!=null&&nS)h+=`<p>Kroki średnio ${WF.k(Math.round(aS/100)*100)} (${zDni(nS)})</p>`;
  if(aL!=null&&nL)h+=`<p>Sen średnio ${WF.sleep(aL*60)} (z ${nL} nocy)</p>`;
  h+=liteWHtml();
  const pet=S.pet?` · ${esc(PET.nameOf(S.pet))}: aktywne dni ${PET.state(petCtx()).active}`:'';
  h+=`<p>Seria: ${dniPl(streak())}${pet}</p>`;
  const nx=unlockNext();if(nx)h+=`<p><b>Co dalej:</b> ${UNLOCK_TXT[nx]}</p>`;
  return h}
function liteDoneHtml(k){const op=LITE_UI.sum===k;
  return `<section id="lite" class="panel" style="padding:4px 16px 12px"><h2 style="margin:12px 0 0">Szybki wpis dnia</h2><p class="lite-line"><b>✓ Zapisane na dziś:</b> ${liteVals(k).join(' · ')}</p>`
    +`<div class="lite-act"><button class="btn ghost" id="lite_see" data-litesum="1" aria-expanded="${op}" aria-controls="lite_stan">Podsumowanie</button><button class="btn ghost" id="lite_edit" data-liteedit="1">Zmień</button></div>`
    +`<div class="wp-sum lite-stan" id="lite_stan" role="region" aria-labelledby="lite_stan_h"${op?'':' hidden'}>${op?liteStanHtml(k):''}</div></section>`}
function liteCardHtml(){const k=todayKey(),m=(S.meas||{})[k]||{};
  if(liteFull(k)&&LITE_UI.open!==k)return liteDoneHtml(k);
  const row=(t,sub,f,cur,opts)=>`<p style="margin:12px 4px 4px"><b>${t}</b>${sub?`<br><span class="small muted">${sub}</span>`:''}</p><div class="chips" role="group" aria-label="${t}">`+opts.map(([v,l])=>`<button class="chip${String(cur)===String(v)?' inc':''}" data-lite="${f}:${v}" aria-pressed="${String(cur)===String(v)}">${l}</button>`).join('')+'</div>';
  return `<section id="lite" class="panel" style="padding:4px 16px 12px"><h2 style="margin:12px 0 0">Szybki wpis dnia</h2>`
    +'<div class="wp-qbox">'+stepsRowHtml(m,k)+'</div>'
    +'<p class="small muted lite-fold">Po odpowiedziach karta zwinie się do podsumowania dnia.</p>'
    +row('Jak się czujesz?','','feel',m.feel||'',[['dobrze','Dobrze'],['glowa','Ból głowy'],['brzuch','Brzuch'],['inne','Inne']])
    +row('Jedzenie kaloryczne dziś','słodycze, fast food, słone przekąski, alkohol','redz',m.redz==null?'':m.redz,[[0,'0'],[1,'1'],[2,'2 lub więcej']])
    +(liteFull(k)?'<div class="note lite-ok"><span>✓ Dzień zapisany.</span><button class="btn ghost small" data-litedone="1">Gotowe</button></div>':'')
    +'<p class="small muted" style="margin:12px 0 0">Wstępne badania: krótki zapis codziennie działał podobnie jak pełny.</p>'+srcHtml(['patel','nezami'])+'</section>'}
function petCardHtml(){const c=eggCrack();if(!S.pet)return `<button class="petcard" data-petpick="1">${PET.svg('gaska','egg','ok',null,false,c)}<span class="petinfo"><b>Wybierz towarzysza</b><span class="small">${c>=4?'Jajko gotowe do wyklucia: wybierz, kto z niego wyjdzie.':`Jajko pęka z każdym ${S.lite?'dniem z szybkim wpisem':'pierwszym krokiem'}: ${c} z 4. Wybierz, kto się wykluje.`}</span></span></button>`;const st=petState();st.crack=c;st.lite=!!S.lite;st.next=PET.next(st,petCtx());return PET.card(st,S.pet,esc)+ruchNoteHtml()}
// Jednorazowa notka o zmianie liczenia ruchu dnia (24.11.2026, działa wstecz): tylko gdy był wpis rozgrzewki lub mobilności
function ruchNoteHtml(){if(S.ruchNote||!Object.values(S.days||{}).some(d=>(d||[]).some(e=>e&&e.kind==='t'&&(e.warm||e.mob))))return '';return '<p class="small muted ruch-note" role="note">Od 24.11 Mobilność i rozgrzewka nie liczą się jako ruch dnia: to dodatek do treningu albo kroków. <button class="btn ghost" data-ruchnote="1">Rozumiem</button></p>'}
// Pierwszy wybór: dotknięcie rodzaju to tylko podgląd (PET_PREV, bez zapisu); zatwierdza przycisk „Wybieram: …”.
// Przy istniejącym zwierzaku zmiana rodzaju to zwykłe ustawienie, które da się od razu zmienić z powrotem.
let PET_PREV='';
function petPickHtml(){const p=S.pet,KN={gaska:'Gąska',kaczka:'Kaczuszka',kapibara:'Kapibara',kotek:'Kotek'},KI=PET.kinds().map(k=>[k,KN[k]]);if(!p){const v=PET_PREV;return `<div class="petstage">${PET.svg(v||'gaska',v?'chick':'egg','happy',null)}</div>`+seg(KI,v,'petprev','','Rodzaj towarzysza')+(v?`<p class="small">Dotknij innego, żeby porównać. Wybór zatwierdzasz przyciskiem.</p><p><button class="btn" data-petok="1">Wybieram: ${KN[v]}</button></p>`:'<p class="small">Dotknij, żeby zobaczyć. Możesz porównać wszystkie, zanim wybierzesz.</p>')}return `<div class="petstage">${PET.svg(p.kind,'chick','happy',null)}</div>`+seg(KI,p.kind,'petkind','','Rodzaj towarzysza')+(p?`<div class="panel"><div class="field"><label for="petname">Imię</label><input type="text" id="petname" data-k="pet.name" value="${esc(p.name||'')}" placeholder="${PET.nameOf({kind:p.kind})}" maxlength="20"></div></div>`:'')}
function waistDelta(){const ks=Object.keys(S.meas||{}).filter(k=>num(S.meas[k].waist)>0).sort();if(ks.length<2)return null;const t0=Date.parse(ks[0]),t1=Date.parse(ks.at(-1));if(t1-t0<14*864e5)return null;const av=a=>a.reduce((s,k)=>s+num(S.meas[k].waist),0)/a.length;return av(ks.filter(k=>Date.parse(k)>=t1-27*864e5))-av(ks.filter(k=>Date.parse(k)<=t0+27*864e5))}
function petSum(st){const k=todayKey(),m=S.meas[k]||{},d=day(),done=[num(m.w)>0,d.filter(e=>e.kind==='m').length>=3,d.some(isMove)||num(m.steps)>0].filter(Boolean).length,wp=weekPts(),nx=LEVELS.find(x=>x[0]>wp),si=stageInfo(),a7=avgAgo(0,7,'w');
  return {today:{done,pts:dayPts(k)},week:{pts:wp,level:level(wp)[1],next:nx?{name:nx[1],need:nx[0]-wp}:null},all:{active:st.active,streak:streak(),dw:si&&a7!=null?a7-si.start:null,waist:waistDelta(),pct:si?si.pct:null},badges:PET.badgeList([...new Set([...(S.petSeen||[]),...PET.milestones(petCtx())])]),body:S.body?petBodyHtml():''}}
function petBodyHtml(){const b=PET.body(S.meas,new Date(),num);return '<h2>Sylwetka</h2>'+(b.ok?`<div class="panel petbody">${b.svg}<p class="small muted">Linia przerywana: start (pierwsze 4 tygodnie pomiarów). Pełna: ostatnie 4 tygodnie. Kontur ze średnich obwodów talii, bioder i uda.</p></div>`:`<p class="small muted">${b.msg}. Potrzebne są 2 pomiary obwodów odległe o co najmniej 14 dni.</p>`)}
function renderPet(){if(!S.pet){document.getElementById('main').innerHTML='<h2>Wybierz towarzysza</h2><p>Gąska, kaczuszka, kapibara albo kotek reaguje na Twoje wpisy: posiłki, ruch, sen i nawyki. Rośnie z dni z wpisami i nie cofa się po przerwie.</p>'+petPickHtml();return}const st=petState();st.crack=eggCrack();st.lite=!!S.lite;st.next=PET.next(st,petCtx());{const pn=(S.pet.stones||[]).length;if(S.pet.pathSeen==null){S.pet.pathSeen=pn;save()}/* po aktualizacji bez fałszywego podskoku */const hop=S.pet.pathSeen<pn;if(hop){S.pet.pathSeen=pn;save()}/* podskok raz po przybyciu kamienia */const sc=PET.screen(st,S.pet,petSum(st),esc),i=sc.indexOf('</div>',sc.indexOf('petstage'))+6;document.getElementById('main').innerHTML=sc.slice(0,i)+PET.path(pn,petWeather(),PET.nameOf(S.pet),S.pet.kind,hop)+sc.slice(i)}if(S.petCeleb&&!DEMO){S.petCeleb=null;save()}if(S.guide&&!S.guide.seenPet){S.guide.seenPet=true;save()}document.getElementById('main').innerHTML+=nextHtml('pet')}
// ---------- Pierwsze kroki: prowadzenie nowej osoby, kroki zaliczane z danych ----------
function guideSteps(){const g=S.guide||{},anyMeas=f=>Object.values(S.meas||{}).some(m=>num((m||{})[f])>0),anyDay=kind=>Object.values(S.days||{}).some(d=>(d||[]).some(e=>e.kind===kind)),past=Object.keys(S.days||{}).some(k=>k<todayKey()&&(S.days[k]||[]).length);
  return [
    {id:'data',label:'Sprawdź swoje dane',hint:'Waga, wzrost, wiek i cel liczą Twoje kalorie. Na końcu naciśnij Zapisz i sprawdź.',btn:'Ustawienia',act:'tab',arg:'set',done:!!g.dataOk||past},
    {id:'pet',label:'Wybierz towarzysza',hint:'Gąska, kaczuszka, kapibara albo kotek będzie reagować na Twoje wpisy.',btn:'Wybierz',act:'tab',arg:'pet',done:!!S.pet},
    {id:'weight',label:'Wpisz dzisiejszą wagę',hint:'Wiersz Waga w karcie Dziś w Pomiarach dnia, niżej na tym ekranie.',btn:'Wpisz wagę',act:'nav',arg:'day#m_w',done:anyMeas('w')},
    {id:'meal',label:'Zapisz pierwszy posiłek',hint:'W Posiłkach naciśnij Zjem przy daniu.',btn:'Posiłki',act:'tab',arg:'meals',done:anyDay('m')},
    {id:'move',label:'Dodaj ruch',hint:'Zapisz trening albo wpisz kroki w Pomiarach dnia.',btn:'Trening',act:'tab',arg:'train',done:anyDay('t')||anyMeas('steps')},
    {id:'seepet',label:'Poznaj zwierzaka',hint:'Zobacz, jak rośnie i co zdobywa.',btn:'Mój zwierzak',act:'tab',arg:'pet',done:!!g.seenPet}]}
function guideActive(){return !S.lite&&!(S.guide||{}).hidden&&guideSteps().some(x=>!x.done)}
function guideHtml(){if(!guideActive())return '';const st=guideSteps(),n=st.filter(x=>x.done).length,nx=st.find(x=>!x.done);
  return `<div class="guide panel"><div class="guidehead"><h2>Pierwsze kroki</h2><span class="met">${n} z ${st.length}</span></div><div class="petbar"><i style="width:${Math.round(n/st.length*100)}%"></i></div>`
    +st.map(x=>`<div class="step${x.done?' done':''}${x===nx?' next':''}"><span class="box">${x.done?'✓':''}</span><span class="lab">${x.label}${x.done?'':`<small class="hint">${x.hint}</small>`}</span>${x.done?'':`<button class="btn small${x===nx?'':' ghost'}" data-${x.act}="${x.arg}">${x.btn}</button>`}</div>`).join('')
    +'<p style="text-align:right;margin:8px 0 0"><button class="btn ghost small" data-guidehide="1">Ukryj</button></p></div>'}
// Komunikat po akcji z następnym krokiem, dopóki trwają pierwsze kroki
function guideAct(){if(!guideActive())return null;const nx=guideSteps().find(x=>!x.done);return {act:nx.act,arg:nx.arg,label:nx.btn}}
function guideToast(base){if(!guideActive())return base;const nx=guideSteps().find(x=>!x.done);return `${base}. Dalej: ${nx.label.charAt(0).toLowerCase()+nx.label.slice(1)}.`}
// ---------- Karty „Co się dzieje”: reguły z danych w telefonie; każda mówi, na czym się opiera ----------
function nAgo(n){const d=new Date();d.setDate(d.getDate()-n);return keyOf(d)}
// Sen skopiowany „Jak wczoraj” (meas.cp) nie jest pomiarem: karty krótkich nocy, pogoda zwierzaka i nawyk snu go pomijają
function sleepAt(k){const m=(S.meas||{})[k]||{};if(measCp(m,'sleep'))return null;const v=num(m.sleep);return v>0?v:null}
function wAt(k){const v=num((S.meas[k]||{}).w);return v>0?v:null}
function wAvg(a,b){const v=[];for(let i=a;i<=b;i++){const x=wAt(nAgo(i));if(x)v.push(x)}return {n:v.length,avg:v.length?v.reduce((s,x)=>s+x,0)/v.length:null}}
function painAt(k){return (S.pain||{})[k]||null}
function auraDays(){return Object.entries(S.pain||{}).filter(([k,p])=>p&&p.aura&&k>=nAgo(90)).length}
function urges3(){return [0,1,2].reduce((a,i)=>a+((S.urges||{})[nAgo(i)]||[]).length,0)}
// ---------- Źródła sprawdzone 08.11.2026 (rada/2026-11-08_zrodla.md): link otwarty w sesji, wartość zgodna z cytatem ----------
const SRC={
  kouri:['https://pubmed.ncbi.nlm.nih.gov/7496846/','Kouri i in. 1995, Clin J Sport Med'],
  uth:['https://pubmed.ncbi.nlm.nih.gov/14624296/','Uth i in. 2004, Eur J Appl Physiol'],
  tanaka:['https://pubmed.ncbi.nlm.nih.gov/11153730/','Tanaka i in. 2001, J Am Coll Cardiol'],
  jette:['https://pubmed.ncbi.nlm.nih.gov/2204507/','Jetté i in. 1990, Clin Cardiol'],
  kodama:['https://pubmed.ncbi.nlm.nih.gov/19454641/','Kodama i in. 2009, JAMA'],
  patel:['https://pubmed.ncbi.nlm.nih.gov/36512404/','Patel ML i in. 2022, JMIR Form Res'],
  nezami:['https://pubmed.ncbi.nlm.nih.gov/35146942/','Nezami BT i in. 2022, Obesity'],
  harvey:['https://pubmed.ncbi.nlm.nih.gov/30801989/','Harvey J i in. 2019, Obesity'],
  burke:['https://pubmed.ncbi.nlm.nih.gov/21185970/','Burke LE i in. 2011, J Am Diet Assoc'],
  butt:['https://weighttraining.nz','weighttraining.nz: kalkulator odtwarzający wzór Caseya Butta'],
  // Suplementy (brief 17.11.2026): strony otwarte 15-17.11.2026; podpisy ogólne, bez nazw handlowych
  s_medlt4:['https://medlineplus.gov/druginfo/meds/a682461.html','MedlinePlus: lewotyroksyna'],
  s_chplLt4:['https://rejestry.ezdrowie.gov.pl/api/rpl/medicinal-products/12231/characteristic','ChPL (lewotyroksyna, rejestr leków)'],
  s_vitd:['https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:20200983%20AND%20SRC:MED&resultType=core&format=json','Badanie: witamina D z największym posiłkiem (PMID 20200983)'],
  s_nhsD:['https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-d/','NHS: witamina D'],
  s_issnKre:['https://www.ebi.ac.uk/europepmc/webservices/rest/PMC5469049/fullTextXML','Stanowisko ISSN: kreatyna (2017)'],
  s_issnTim:['https://www.ebi.ac.uk/europepmc/webservices/rest/PMC5596471/fullTextXML','Stanowisko ISSN: pora przyjmowania składników'],
  s_issnProt:['https://www.ebi.ac.uk/europepmc/webservices/rest/PMC5477153/fullTextXML','Stanowisko ISSN: białko'],
  s_issnBa:['https://www.ebi.ac.uk/europepmc/webservices/rest/PMC4501114/fullTextXML','Stanowisko ISSN: beta-alanina (2015)'],
  s_cytr:['https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:41900522%20AND%20SRC:MED&resultType=core&format=json','Badanie: cytrulina przed treningiem (PMID 41900522)'],
  s_nhsOth:['https://www.nhs.uk/conditions/vitamins-and-minerals/others/','NHS: inne witaminy i minerały'],
  s_nhsFe:['https://www.nhs.uk/medicines/ferrous-sulfate/how-and-when-to-take-ferrous-sulfate/','NHS: siarczan żelaza'],
  // Wyjątek od zasady bez nazw handlowych (decyzja 17.11.2026): jedyne działające źródło NHS o łusce babki jajowatej; nazwa jest tylko w adresie i nie dotyczy listy preparatów właściciela
  s_nhsIspT:['https://www.nhs.uk/medicines/fybogel-ispaghula-husk/taking-fybogel-with-other-medicines-and-herbal-supplements','NHS: łuska babki jajowatej i inne leki'],
  s_nhsIspW:['https://www.nhs.uk/medicines/fybogel-ispaghula-husk/how-and-when-to-take-fybogel','NHS: łuska babki jajowatej, jak i kiedy'],
  s_nccihProb:['https://www.nccih.nih.gov/health/probiotics-usefulness-and-safety','NCCIH: probiotyki'],
  s_quest:['https://www.questdiagnostics.com/healthcare-professionals/clinical-education-center/faq/faq202','Laboratorium Quest Diagnostics: biotyna a badania'],
  s_nhsB:['https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-b/','NHS: witaminy z grupy B'],
  s_chplPanto:['https://rejestry.ezdrowie.gov.pl/api/rpl/medicinal-products/21581/characteristic','ChPL (pantoprazol, rejestr leków)'],
  s_nhsPanto:['https://www.nhs.uk/medicines/pantoprazole/how-and-when-to-take-pantoprazole/','NHS: pantoprazol, jak i kiedy'],
  s_nhsPantoQ:['https://www.nhs.uk/medicines/pantoprazole/common-questions-about-pantoprazole/','NHS: pantoprazol, częste pytania'],
  s_chplOss:['https://leki.pl/chpl/100050035','ChPL (kompleks osseina-hydroksyapatyt)'],
  s_chplChon:['https://rejestry.ezdrowie.gov.pl/api/rpl/medicinal-products/32872/characteristic','ChPL (siarczan chondroityny, rejestr leków)'],
  s_chplWarf:['https://rejestry.ezdrowie.gov.pl/api/rpl/medicinal-products/16431/characteristic','ChPL (warfaryna, rejestr leków)'],
  s_nccihGlu:['https://www.nccih.nih.gov/health/glucosamine-and-chondroitin-for-osteoarthritis-what-you-need-to-know','NCCIH: glukozamina i chondroityna'],
  s_chplCa:['https://rejestry.ezdrowie.gov.pl/api/rpl/medicinal-products/11651/characteristic','ChPL (węglan wapnia, rejestr leków)'],
  s_nhsCa:['https://www.nhs.uk/conditions/vitamins-and-minerals/calcium/','NHS: wapń'],
  s_efsa:['https://www.efsa.europa.eu/sites/default/files/assets/UL_Summary_tables.pdf','EFSA: górne poziomy spożycia (2025)'],
  s_chplMg:['https://rejestry.ezdrowie.gov.pl/api/rpl/medicinal-products/8784/characteristic','ChPL (magnez z witaminą B6, rejestr leków)'],
  s_chplZn:['https://rejestry.ezdrowie.gov.pl/api/rpl/medicinal-products/7433/characteristic','ChPL (cynk, rejestr leków)'],
  s_chplB12:['https://rejestry.ezdrowie.gov.pl/api/rpl/medicinal-products/48472/characteristic','ChPL (witamina B12, rejestr leków)'],
  s_chplJod:['https://rejestry.ezdrowie.gov.pl/api/rpl/medicinal-products/3257/characteristic','ChPL (jodek potasu, rejestr leków)'],
  s_nhsJod:['https://www.nhs.uk/conditions/vitamins-and-minerals/iodine/','NHS: jod'],
  s_chplOm3:['https://rejestry.ezdrowie.gov.pl/api/rpl/medicinal-products/16261/characteristic','ChPL (kwasy omega-3, rejestr leków)'],
  s_chplAE:['https://rejestry.ezdrowie.gov.pl/api/rpl/medicinal-products/9852/characteristic','ChPL (witaminy A i E, rejestr leków)'],
  s_nhsA:['https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-a/','NHS: witamina A'],
  s_nhsE:['https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-e/','NHS: witamina E'],
  s_nhsC:['https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-c/','NHS: witamina C'],
  s_nhsK:['https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-k/','NHS: witamina K'],
  who6:['https://iris.who.int/server/api/core/bitstreams/9f048e30-0d14-4187-b167-9c24b9102092/content','WHO MEC, wyd. 6 (2025)'],
  ukmec:['https://www.cosrh.org/Common/Uploaded%20files/documents/UKMEC_2025.pdf','UKMEC 2025'],
  ema:['https://www.ema.europa.eu/en/news/benefits-combined-hormonal-contraceptives-chcs-continue-outweigh-risks-chmp-endorses-prac-recommendation','EMA 2013'],
  cochr:['https://www.cochrane.org/evidence/CD003987_combination-contraceptives-effects-weight','Cochrane 2014'],
  moh:['https://ichd-3.org/8-headache-attributed-to-a-substance-or-its-withdrawal/8-2-medication-overuse-headache-moh/','ICHD-3, 8.2'],
  mm:['https://ichd-3.org/appendix/a1-migraine/a1-1-migraine-without-aura/a1-1-1-pure-menstrual-migraine-without-aura/','ICHD-3, A1.1.1'],
  mig11:['https://ichd-3.org/1-migraine/1-1-migraine-without-aura/','ICHD-3, 1.1'],
  aura12:['https://ichd-3.org/1-migraine/1-2-migraine-with-aura/','ICHD-3, 1.2'],
  caff:['https://ichd-3.org/8-headache-attributed-to-a-substance-or-its-withdrawal/8-3-headache-attributed-to-substance-withdrawal/8-3-1-caffeine-withdrawal-headache/','ICHD-3, 8.3.1'],
  prev:['https://americanheadachesociety.org/news/updated-guideline-on-migraine-prevention-medications-for-adults','AAN/AHS 2026'],
  varkey:['https://pmc.ncbi.nlm.nih.gov/articles/PMC3236524/','Varkey i in. 2011'],
  lemmens:['https://pmc.ncbi.nlm.nih.gov/articles/PMC6734345/','Lemmens i in. 2019'],
  kelman:['https://pubmed.ncbi.nlm.nih.gov/17403039/','Kelman 2007'],
  fast:['https://pubmed.ncbi.nlm.nih.gov/23996724/','Dalkara i Kılıç 2013'],
  nhs:['https://www.nhs.uk/conditions/stroke/symptoms/','NHS: objawy udaru'],
  ata:['https://pmc.ncbi.nlm.nih.gov/articles/PMC4267409/','Wytyczne ATA 2014'],
  lt4:['https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1e11ad30-1041-4520-10b0-8f9d30d30fcc','Ulotka lewotyroksyny'],
  gluten:['https://pubmed.ncbi.nlm.nih.gov/37554764/','Piticchio i in. 2023'],
  selen:['https://pubmed.ncbi.nlm.nih.gov/32257959/','ETA 2020'],
  dpp:['https://pubmed.ncbi.nlm.nih.gov/11832527/','DPP 2002'],
  acsm:['https://pubmed.ncbi.nlm.nih.gov/21694556/','ACSM 2011'],
  nhsflex:['https://www.nhs.uk/live-well/exercise/strength-and-flexibility-exercises/flexibility-exercises/','NHS: ćwiczenia rozciągające'],
  nhsstr:['https://www.nhs.uk/live-well/exercise/strength-and-flexibility-exercises/strength-exercises/','NHS: ćwiczenia siłowe'],
  csp:['https://www.csp.org.uk/conditions/back-pain/video-exercises-back-pain','CSP: ćwiczenia przy bólu pleców'],
  nhsback:['https://www.nhs.uk/live-well/exercise/exercises-for-back-pain/','NHS: ból pleców'],
  nhsflat:['https://www.nhs.uk/conditions/flat-feet/','NHS: płaskostopie'],
  medtesto:['https://medlineplus.gov/lab-tests/testosterone-levels-test/','MedlinePlus: badanie testosteronu'],
  nhsbloat:['https://www.nhs.uk/conditions/bloating/','NHS: wzdęcia'],
  ptge23:['https://www.termedia.pl/Diagnostic-and-therapeutic-recommendations-on-Helicobacter-pylori-infection-Recommendations-of-the-Working-Group-of-the-Polish-Society-of-Gastroenterology,41,51623,1,1.html','PTG-E 2023: H. pylori'],
  nhsgastritis:['https://www.nhs.uk/conditions/gastritis/','NHS: zapalenie żołądka'],
  nhsindig:['https://www.nhs.uk/conditions/indigestion/','NHS: niestrawność'],
  nhsulcer:['https://www.nhs.uk/conditions/stomach-ulcer/','NHS: wrzód żołądka'],
  nhscoeliac:['https://www.nhs.uk/conditions/coeliac-disease/diagnosis/','NHS: celiakia, diagnoza'],
  porcari25:['https://pubmed.ncbi.nlm.nih.gov/39647502/','Porcari i in. 2025'],
  nhsibs:['https://www.nhs.uk/conditions/irritable-bowel-syndrome-ibs/treatment/','NHS: IBS, dieta i leki'],
  bda25:['https://pubmed.ncbi.nlm.nih.gov/41081513/','BDA 2025: zaparcia'],
  acg21:['https://pubmed.ncbi.nlm.nih.gov/33315591/','ACG 2021: IBS'],
  mint:['https://pubmed.ncbi.nlm.nih.gov/24100754/','Khanna i in. 2014: olejek miętowy'],
  emamint:['https://www.ema.europa.eu/en/medicines/herbal/menthae-piperitae-aetheroleum','EMA: monografia olejku miętowego'],
  lt4fib:['https://pubmed.ncbi.nlm.nih.gov/9737361/','Chiu i Sherman 1998: błonnik a lewotyroksyna'],
  orth23:['https://pubmed.ncbi.nlm.nih.gov/36611153/','Oerlemans i in. 2023 (wkładki)'],
  aspetar:['https://pubmed.ncbi.nlm.nih.gov/36731908/','Aspetar 2023 (rehabilitacja po ACL)'],
  falk:['https://pubmed.ncbi.nlm.nih.gov/32071772/','Falk Brekke i in. 2020'],
  lordoza:['https://pmc.ncbi.nlm.nih.gov/articles/PMC9025799/','Metaanaliza ćwiczeń korekcyjnych 2022'],
  iraki:['https://pmc.ncbi.nlm.nih.gov/articles/PMC6680710/','Iraki i in. 2019 (przyrost masy)'],
  issn:['https://pmc.ncbi.nlm.nih.gov/articles/PMC5477153/','ISSN 2017: białko'],
  order:['https://pmc.ncbi.nlm.nih.gov/articles/PMC4876745/','Shukla i in. 2015'],
  ada:['https://pmc.ncbi.nlm.nih.gov/articles/PMC6908414/','ADA 2016'],
  sleepIR:['https://pubmed.ncbi.nlm.nih.gov/20371664/','Donga i in. 2010'],
  s2k:['https://register.awmf.org/assets/guidelines/037_D_Ges_fuer_Phlebologie/037-012le_S2k_Lipoedema__2024-08.pdf','Wytyczne S2k lipodemii 2024'],
  lipcons:['https://pmc.ncbi.nlm.nih.gov/articles/PMC8652358/','Konsensus lipodemii 2021'],
  sleepEI:['https://pubmed.ncbi.nlm.nih.gov/27804960/','Al Khatib i in. 2017'],
  stress:['https://pubmed.ncbi.nlm.nih.gov/17543357/','Adam i Epel 2007'],
  hall:['https://pubmed.ncbi.nlm.nih.gov/17848938/','Hall 2008'],
  glyc:['https://pubmed.ncbi.nlm.nih.gov/27231310/','Shiose i in. 2016'],
  spot:['https://pubmed.ncbi.nlm.nih.gov/23222084/','Ramírez-Campillo i in. 2013'],
  meds:['https://pubmed.ncbi.nlm.nih.gov/18640463/','Taylor 2008'],
  fdcMaki:['https://fdc.nal.usda.gov/food-details/2708961/nutrients','USDA: sushi roll'],
  fdcNigiri:['https://fdc.nal.usda.gov/food-details/2708971/nutrients','USDA: nigiri'],
  fdcChicken:['https://fdc.nal.usda.gov/food-details/2706794/nutrients','USDA: kurczak w glazurze'],
  fdcTofu:['https://fdc.nal.usda.gov/food-details/2707476/nutrients','USDA: tofu z warzywami'],
  fdcRice:['https://fdc.nal.usda.gov/food-details/2708408/nutrients','USDA: ryż'],
  fdcFries:['https://fdc.nal.usda.gov/food-details/2709461/nutrients','USDA: frytki'],
  fdcSlaw:['https://fdc.nal.usda.gov/food-details/2709814/nutrients','USDA: coleslaw'],
  schutz:['https://pubmed.ncbi.nlm.nih.gov/12080449/','Schutz 2002 (FFMI)'],
  gallagher:['https://pubmed.ncbi.nlm.nih.gov/10966886/','Gallagher 2000 (tłuszcz %)'],
  bmimort:['https://pmc.ncbi.nlm.nih.gov/articles/PMC4995441/','Lancet 2016: BMI a śmiertelność'],
  whoob:['https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight','WHO: otyłość i nadwaga'],
  nhsob:['https://www.nhs.uk/conditions/obesity/','NHS: nadwaga i otyłość'],
  nhlbi:['https://www.nhlbi.nih.gov/health/heart-healthy-living/healthy-weight','NHLBI: zdrowa waga'],
  michie:['https://pmc.ncbi.nlm.nih.gov/articles/PMC3096582/','Michie 2011 (COM-B)'],
  lally:['https://pmc.ncbi.nlm.nih.gov/articles/PMC11641623/','Singh 2024 (czas tworzenia nawyku)'],
  harkin:['https://pubmed.ncbi.nlm.nih.gov/26479070/','Harkin 2016 (zapisywanie postępu)'],
  gollw:['https://kops.uni-konstanz.de/entities/publication/2e749bfb-8533-437c-8203-7e788c910c5f','Gollwitzer 2006 (plan jeśli-to)'],
  wolfson:['https://pubmed.ncbi.nlm.nih.gov/25399031/','Wolfson 2015 (gotowanie w domu)'],
  reicks:['https://pubmed.ncbi.nlm.nih.gov/28958671/','Reicks 2018 (nauka gotowania)'],
  frida:['https://doi.org/10.11583/DTU.32312844','Duńska baza składu żywności Frida 6.1 (DTU)'],
  cofid:['https://www.gov.uk/government/publications/composition-of-foods-integrated-dataset-cofid','CoFID 2021 (McCance i Widdowson)'],
  efsaFib:['https://www.efsa.europa.eu/en/press/news/nda100326','EFSA 2010: błonnik 25 g dziennie'],
  eu1924:['https://eur-lex.europa.eu/legal-content/PL/TXT/HTML/?uri=CELEX:02006R1924-20141213','Rozporządzenie UE 1924/2006: progi błonnika'],
  fibGE:['https://pubmed.ncbi.nlm.nih.gov/24901089/','Yu i in. 2014: błonnik a opróżnianie żołądka'],
  reynolds:['https://pubmed.ncbi.nlm.nih.gov/30638909/','Reynolds i in. 2019: błonnik 25-29 g']};
const srcA=k=>SRC[k]?`<a href="${SRC[k][0]}" target="_blank" rel="noopener noreferrer">${SRC[k][1]}</a>`:'';
function srcHtml(keys){const k=[].concat(keys||[]).filter(x=>SRC[x]);return k.length?'<p class="srcl">Źródło: '+k.map(srcA).join(', ')+'</p>':''}
const EV={m:'dowody mocne',u:'dowody umiarkowane',s:'dowody słabe',w:'wiedza ogólna'};
// ---------- Profil zdrowia i plan działań: reguły z dowodami (rada/2026-11-06_profil-zdrowia-plan) ----------
const CONDS=[['hashi','Hashimoto'],['lip','Lipodemia'],['aura','Migrena z aurą'],['mig','Migrena lub silne bóle głowy'],['io','Insulinooporność'],['flat','Płaskostopie'],['acl','Po rekonstrukcji ACL'],['gut','Wzdęcia i jelita']];
// [id, nazwa, estrogen, grupa ryzyka zakrzepicy wg EMA 2013 (b: 9-12, a: 5-7 na 10 000), przerwa w opakowaniu]
const PILLS=[['','Nie biorę tabletek',0,0,0],['yaz','Yaz (drospirenon, estrogen)',1,'b',1],['yasmin','Yasmin (drospirenon, estrogen)',1,'b',1],['yasminelle','Yasminelle (drospirenon, estrogen)',1,'b',1],
  ['jeanine','Jeanine (dienogest, estrogen)',1,0,1],['microgynon','Microgynon, Rigevidon (lewonorgestrel, estrogen)',1,'a',1],['novynette','Novynette (dezogestrel, estrogen)',1,'b',1],
  ['belara','Belara (chlormadinon, estrogen)',1,0,1],['qlaira','Qlaira (dienogest, estradiol)',1,0,1],['zoely','Zoely (nomegestrol, estradiol)',1,0,1],
  ['cerazette','Cerazette, Azalia, Lactinette (minitabletka, bez estrogenu)',0,0,0],['slynd','Slynd (drospirenon, bez estrogenu)',0,0,1],['inna_e','Inna z estrogenem',1,0,1],['inna_p','Inna bez estrogenu',0,0,0]];
function pillOf(){return PILLS.find(x=>x[0]===((S.prof||{}).pill||''))||PILLS[0]}
function painDays(n){return Object.keys(S.pain||{}).filter(k=>k>=nAgo(n-1)&&S.pain[k]).length}
function medDays(n){return Object.entries(S.pain||{}).filter(([k,p])=>k>=nAgo(n-1)&&p&&p.med).length}
function breakPain(){const ks=Object.keys(S.pain||{}).filter(k=>k>=nAgo(89)&&S.pain[k]);return {all:ks.length,brk:ks.filter(k=>(S.meas[k]||{}).cyc==='P').length}}
function planActs(){const c=(S.prof||{}).cond||{},P=pillOf(),pn=P[1].split(' (')[0],est=!!P[2],aura=!!c.aura||auraDays()>0,mig=aura||!!c.mig,md=medDays(30),pd=painDays(30),bp=breakPain(),A=[],a=(pri,t,why,ev,src)=>A.push({pri,t,why,ev,src});
  if(aura&&est)a(0,'Porozmawiaj z ginekologiem o zmianie tabletek w ciągu kilku dni',`${pn} zawiera estrogen. Przy migrenie z aurą to kategoria 4 (przeciwwskazanie) w kryteriach WHO i brytyjskich: kobiety z migreną stosujące takie tabletki mają ok. 2-4 razy częściej udar niedokrwienny. Nie odstawiaj tabletek bez innej antykoncepcji: metodę ustala lekarz.`,'m',['who6','ukmec']);
  if(!aura&&c.mig&&est)a(0,'Migrena bez aury i tabletki z estrogenem: porozmawiaj z ginekologiem',`${pn} to tabletka złożona (z estrogenem). UKMEC 2025, migrena bez aury: rozpoczęcie kategoria 2, kontynuacja kategoria 3, czyli ryzyko zwykle przewyższa korzyści. Nie odstawiaj tabletek bez innej antykoncepcji: metodę ustala lekarz.`,'m','ukmec');
  if(aura&&P[0]&&!est)a(9,'Minitabletka przy aurze: omów z lekarzem dalsze stosowanie',`${pn} nie zawiera estrogenu. UKMEC 2025: kategoria 2. WHO 2025: kategoria 2 przy rozpoczęciu i 3 przy kontynuacji. Zapytaj lekarza, co to oznacza dla Ciebie.`,'m',['ukmec','who6']);
  if(md>=10)a(1,`${md} dni z lekiem w 30 dniach: ryzyko bólu z nadużywania leków`,'Według ICHD-3 ból z nadużywania leków rozpoznaje się, gdy ból głowy jest przez 15 lub więcej dni w miesiącu, a tryptany przyjmuje się przez 10 lub więcej dni albo nieopioidowe leki przeciwbólowe przez 15 lub więcej dni, dłużej niż 3 miesiące. Pokaż lekarzowi licznik z dziennika.','m','moh');
  if(mig){if(pd>=4)a(2,`${pd} dni z bólem w 30 dniach: zapytaj o leczenie zapobiegawcze`,'Wytyczne AAN/AHS z 2026 r. doradzają leczenie zapobiegawcze przy 4 lub więcej dniach z migreną w miesiącu albo gdy migrena utrudnia pracę i codzienne zadania. Lek dobiera lekarz.','m','prev');
    a(3,'Zaznaczaj każdy ból, aurę i lek','ICHD-3 opisuje migrenę związaną z miesiączką: napady od 2 dni przed do 3. dnia miesiączki w co najmniej 2 z 3 cykli. Po 3 cyklach dziennik to pokaże, a lista na wizytę zbierze dane.','m','mm');
    if(est&&P[4]&&!aura&&bp.brk>=2)a(4,`${bp.brk} z ${bp.all} dni z bólem przypada na przerwę w tabletkach`,'To może być wzorzec migreny związanej z miesiączką (ICHD-3). Pokaż dziennik lekarzowi i zapytaj, czy zmiana schematu przyjmowania tabletek ma dla Ciebie sens.','u','mm');
    a(6,'Stały rytm dnia','W dużym badaniu najczęstszymi wyzwalaczami migreny były stres (80% osób), niejedzenie (57%) i zaburzenia snu (50%). Jedz regularnie i śpij o stałej porze. Kofeinę trzymaj na stałym poziomie: nagłe odstawienie po ponad 2 tygodniach picia ponad 200 mg dziennie może wywołać ból głowy.','u',['kelman','caff']);
    a(12,'Ruch 3 razy w tygodniu po 40 minut','W badaniu porównawczym taki trening zmniejszył liczbę napadów podobnie jak lek zapobiegawczy (topiramat), a w metaanalizie ruch tlenowy dawał średnio o 0,6 dnia z migreną mniej w miesiącu. W czasie napadu zwykła aktywność nasila ból, więc wtedy odpocznij.','u',['varkey','lemmens','mig11'])}
  if(c.hashi){if(est)a(5,'Zapytaj lekarza o TSH 6-8 tygodni po zmianie tabletek','Estrogen doustny zwiększa stężenie białka wiążącego hormony tarczycy, więc wynik TSH może się zmienić. Zapisz, kiedy zmieniłaś tabletki, i powiedz o tym lekarzowi: to on zdecyduje, czy i kiedy zlecić kontrolę TSH (wytyczne ATA: po rozpoczęciu i po odstawieniu estrogenu, gdy wyniki się ustabilizują, zwykle po ok. 6 tygodniach; ulotka leku: 6-8 tygodni).','m',['ata','lt4']);
    a(7,'Pora leku na tarczycę: zapytaj lekarza lub farmaceutę','Porę przyjmowania leku i odstęp od posiłku, kawy, soi, wapnia i żelaza ustal z lekarzem lub farmaceutą, bo zależą od preparatu. Zapisz ustalony schemat w „Mój plan od specjalisty”; interakcje suplementów z lekami sprawdzisz w sekcji Suplementy w Zdrowiu.','m',['ata','lt4']);
    a(14,'Bez diet eliminacyjnych na zapas','Dieta bezglutenowa przy Hashimoto bez celiakii: za mało dowodów, by ją zalecać (metaanaliza 2023). Selenu europejskie wytyczne (ETA) nie zalecają.','u',['gluten','selen'])}
  if(c.lip){a(8,'Mierz talię i uda osobno','Tkanka przy lipodemii słabo reaguje na dietę i ćwiczenia, ale przy nadwadze redukcja masy zmniejsza też objętość nóg. Mierz talię i uda osobno i zapisuj ból i ciężkość nóg w dzienniku nóg.','s',['lipcons','s2k']);
    a(10,'Ruch w wodzie i kompresja','Kompresja razem z ruchem poprawia jakość życia i zmniejsza ból, a ćwiczenia w wodzie są szczególnie skuteczne. Kompresja nie zmniejsza tkanki tłuszczowej.','s','s2k');
    if(est)a(15,'Hormony a objawy lipodemii','Objawy pojawiają się albo nasilają prawie zawsze w okresach zmian hormonalnych. Powiedz o lipodemii przy wyborze antykoncepcji.','s','s2k')}
  if(c.io){a(11,`Cel: co najmniej 7% mniej masy ciała, czyli ok. ${fmt1(kg()*0.07)} kg`,'W programie DPP taki cel razem ze 150 minutami ruchu tygodniowo zmniejszył zachorowania na cukrzycę o 58%.','m','dpp');
    a(12,'Słodkie śniadanie może zostać','Reguła Miary „Przy IO”: co najmniej 20 g białka i do 50 g węglowodanów, owoce w całości zamiast cukru. W badaniu pilotażowym (11 osób) białko i warzywa zjedzone przed węglowodanami obniżały glukozę po posiłku. W Posiłkach filtr „Słodkie” i „Przy IO” pokazuje takie przepisy.','s','order');
    a(13,'150 minut ruchu tygodniowo i pełny sen','Trening tlenowy i siłowy poprawia działanie insuliny także bez spadku masy ciała, a jedna noc z 4 godzinami snu obniżyła wrażliwość na insulinę o ok. 25%.','m',['ada','sleepIR'])}
  if(c.io&&mig)a(18,'Razem: insulinooporność i migrena','Bez postu przerywanego i długich przerw w jedzeniu: niejedzenie i post to dobrze opisane wyzwalacze migreny, a przy insulinooporności cel osiąga się deficytem kalorii i ruchem.','u',['fast','dpp']);
  if(c.io&&c.hashi)a(19,'Razem: insulinooporność i Hashimoto','Zasady się nie wykluczają: porę leku względem śniadania ustal z lekarzem, a śniadanie zgodne z regułą „Przy IO”.','u','ata');
  if(c.lip&&c.io)a(20,'Razem: lipodemia i insulinooporność','Redukcja pomaga przy insulinooporności, a przy nadwadze zmniejsza też objętość nóg; tkanka lipodemiczna reaguje słabiej, więc oceniaj talię, ból i ciężkość nóg, nie tylko obwód uda.','s',['dpp','s2k']);
  if(c.flat)a(21,'Płaskostopie: kiedy nic nie robić, kiedy do lekarza','Płaskostopie, które nie powodują dolegliwości, nie wymaga leczenia (NHS). Do lekarza albo podiatry: gdy stopy bolą, są sztywne, słabe lub drętwieją, przy częstych urazach stopy lub kostki, kłopotach z chodzeniem lub równowagą, gdy płaskostopie jest nowe albo dotyczy tylko jednej stopy. Wkładki, obuwie i ćwiczenia stopy dobiera specjalista; nie zmieniają kształtu stopy, ale mogą pomóc przy bólu lub sztywności.','m',['nhsflat','orth23']);
  if(c.acl)a(22,'Po rekonstrukcji ACL: plan od fizjoterapeuty','Wytyczne Aspetar 2023: ćwiczenia są podstawą rehabilitacji, ale brakuje dowodów na dawkę i na kryteria przejścia do kolejnej fazy, więc o progresji decyduje fizjoterapeuta. Wpisz jego zalecenia w Trening, Mobilność, Mój plan od specjalisty.','m','aspetar');
  if(c.gut){a(1.5,'Brzuch: kiedy do lekarza','Do lekarza: wzdęcia regularnie albo mimo zmiany jedzenia, z niezamierzoną utratą wagi albo krew w stolcu. Pilnie: wzdęcie z wymiotami, biegunką lub zaparciem, z bólem brzucha albo gorączką, guz w brzuchu, brak moczu, stolca lub gazów. 112: nagły silny ból brzucha, wymioty krwią albo jak fusy od kawy, duszność.','m','nhsbloat');
    a(13.5,'Brzuch i stolec: co robić już teraz','Przed wizytą i po niej: ok. 1,5 l płynów dziennie, mniejsze i częstsze posiłki, bez dużego posiłku późnym wieczorem, najwyżej 3 kawy lub herbaty i 3 porcje owoców po 80 g dziennie, bez słodzika sorbitolu i dużej ilości napojów gazowanych. Przy zaparciu błonnik rozpuszczalny: owies, siemię lniane do 1 łyżki dziennie. Przy IBS lekarz może zaproponować krótką próbę diety low FODMAP z dietetykiem i terapię ukierunkowaną na jelita.','m',['nhsbloat','nhsibs','acg21']);
    a(14.5,'Środki z badań: forma, ilość, czas','Błonnik w suplemencie (np. babka płesznik, proszek rozpuszczony w wodzie): ponad 10 g dziennie przez co najmniej 4 tygodnie, z dodatkowym piciem; może nasilić gazy. Probiotyk: wybrana marka według producenta, co najmniej 4 tygodnie, potem ocena. Kiwi: 2-3 kiwi dziennie przez co najmniej 4 tygodnie. Olejek miętowy przy IBS (monografia EMA): kapsułki dojelitowe 0,2-0,4 ml, 2-3 razy dziennie (0,6-1,2 ml na dobę), 30 minut przed posiłkiem, połknięte w całości; do ustąpienia objawów, zwykle tydzień lub dwa, najwyżej 3 miesiące. Nie razem z jedzeniem; leki zobojętniające przyjmuj osobno, a leków zmniejszających kwas żołądkowy unikaj (kapsułka może się rozpuścić za wcześnie). Nie przy chorobach wątroby, kamica żółciowa i inne choroby dróg żółciowych to przeciwwskazanie. Częsty skutek uboczny to zgaga. Tlenek magnezu: 0,5-1,5 g dziennie przez co najmniej 4 tygodnie, zwiększany co tydzień, tylko po rozmowie z lekarzem (to środek przeczyszczający).'+(c.hashi?' Przy lewotyroksynie: w małym badaniu babka przyjęta razem z lekiem nie zmieniła istotnie wchłaniania, ale suplementy i magnez trzymaj z dala od leku; odstęp ustal z lekarzem.':'')+(est?` Wymioty albo silna biegunka mogą osłabić działanie tabletki ${pn}: sprawdź w ulotce, co wtedy robić, albo zapytaj farmaceutę.`:''),'m',c.hashi?['bda25','nhsibs','mint','emamint','lt4fib']:['bda25','nhsibs','mint','emamint']);
    a(14.7,'Testy mikrobiomu','Testy mikrobiomu kupowane samodzielnie nie mają udowodnionej wartości klinicznej.','u',['porcari25'])}
  if(est)a(16,'Tabletki z estrogenem: ryzyko zakrzepicy',(P[3]==='b'?'Ok. 9-12 na 10 000 kobiet rocznie przy tabletkach z drospirenonem, gestodenem albo dezogestrelem; 5-7 przy lewonorgestrelu; ok. 2 bez tabletek (EMA 2013).':P[3]==='a'?'Ok. 5-7 na 10 000 kobiet rocznie przy tabletkach z lewonorgestrelem; ok. 2 bez tabletek (EMA 2013).':'Dla tego składu komunikat EMA nie podaje osobnej liczby; przy lewonorgestrelu 5-7, a bez tabletek ok. 2 na 10 000 kobiet rocznie (EMA 2013).')+' Pilnie do lekarza przy silnym bólu albo obrzęku nogi, nagłej duszności, szybkim oddechu albo kaszlu, bólu w klatce piersiowej, osłabieniu albo drętwieniu twarzy, ręki lub nogi.','m','ema');
  if(P[0])a(17,'Waga a tabletki','Przegląd Cochrane: dowody nie wystarczają, by ocenić wpływ tabletek na masę ciała, ale dużego efektu nie widać.','m','cochr');
  return A.sort((x,y)=>x.pri-y.pri)}
function profSet(){const p=S.prof||{};return Object.values(p.cond||{}).some(Boolean)||!!p.pill}
function profHtml(){const p=S.prof||{},c=p.cond||{},body=profBody();if(!profSet())return '<h2 id="profil">Mój profil zdrowia</h2>'+whyP('profil')+body;
  const names=CONDS.filter(([id])=>c[id]).map(x=>x[1]).concat(p.pill?[(PILLS.find(x=>x[0]===p.pill)||[,''])[1]]:[]).filter(Boolean);
  return '<h2 id="profil">Mój profil zdrowia</h2><p class="small">'+esc(names.join(', '))+'</p>'+fold('profil','Zmień profil',body)}
const GPROF=[['g45','45 lat lub więcej'],['nlpz','regularnie biorę ibuprofen lub aspirynę'],['rodzRak','rak żołądka u rodzica, rodzeństwa lub dziecka']];
function profBody(){const p=S.prof||{},c=p.cond||{};return '<div class="chips">'+CONDS.map(([id,n])=>`<button class="chip${c[id]?' inc':''}" data-cond="${id}" aria-pressed="${!!c[id]}">${n}</button>`).join('')
  +'</div>'+(c.gut?'<div class="chips" role="group" aria-label="Brzuch: dodatkowe pytania">'+GPROF.map(([id,n])=>`<button class="chip${p[id]?' inc':''}" data-gprof="${id}" aria-pressed="${!!p[id]}">${n}</button>`).join('')+'</div>':'')+`<div class="panel"><div class="field"><label for="pill">Tabletki antykoncepcyjne</label><select id="pill" data-k="prof.pill">${PILLS.map(([v,n])=>`<option value="${v}"${v===(p.pill||'')?' selected':''}>${n}</option>`).join('')}</select></div></div>`}
function healthPlanHtml(){const A=planActs();if(!A.length)return '<section class="plan" id="twojplan"><h2>Twój plan</h2><p class="small muted">Zaznacz wyżej choroby i tabletki, a tu pojawią się działania dla Ciebie.</p></section>';
  return '<section class="plan" id="twojplan"><h2>Twój plan</h2>'+A.map((x,i)=>`<div class="act${i===0?' first':''}">${i===0?'<p class="tag">Najpierw</p>':''}<h3>${x.t}</h3><p>${x.why}</p><span class="ev">${EV[x.ev]}</span>${srcHtml(x.src)}</div>`).join('')+'</section>'}
// 12 tygodni: waga w przedziale z deficytu planu (±25%), kamienie milowe z badań; wyniki badań, ból i samopoczucie tylko z wpisów
function weeksHtml(){const c=(S.prof||{}).cond||{},est=!!pillOf()[2],mig=!!c.aura||!!c.mig||auraDays()>0,w0=avg7()||kg(),goal=num(S.goal)||0,M=measuredTdee(),def=(M?M.tdee:rmr()*1.3)-targetKcal(),wk=Math.max(0,def*7/7700),ms={};
  const m=(w,t)=>(ms[w]=ms[w]||[]).push(t);
  m(1,'Waga spada szybciej: to woda i glikogen, nie tylko tłuszcz.');m(2,'Pierwszy pomiar obwodów: talia, biodra, uda.');
  m(4,'Porównanie średnich wagi i obwodów; sylwetka w ekranie zwierzaka.');if(c.lip)m(4,'Uda mogą zmieniać się wolniej niż talia.');
  if(c.hashi&&est)m(6,'Powiedz lekarzowi, jeśli w ostatnich tygodniach zmieniły się tabletki albo leki, i zapytaj o TSH.');m(8,'Przegląd tempa: jeśli waga stoi 3 tygodnie, sprawdź zapis jedzenia.');
  if(mig)m(12,'Ocena 3 cykli dziennika bólu: czy bóle trzymają się dni miesiączki albo przerwy.');if(c.io)m(12,'Glukoza i insulina na czczo albo HbA1c z lekarzem.');m(12,'Przegląd z lekarzem: lista na wizytę zbierze dane.');
  let h='<table class="weeks"><tr><th>Tydz.</th><th>Waga</th><th>Co sprawdzić</th></tr>';
  for(let i=1;i<=12;i++){const lo=Math.max(goal,w0-wk*1.25*i),hi=Math.max(goal,w0-wk*0.75*i);h+=`<tr class="wk"><td>${i}</td><td>${wk>0?`${fmt1(lo)}-${fmt1(hi)} kg`:'bez zmian'}</td><td>${(ms[i]||[]).join(' ')}</td></tr>`}
  return h+`</table><p class="small muted">Waga z deficytu planu (${fmt(Math.max(0,def))} kcal dziennie), przedział ±25%. Miara nie prognozuje wyników badań, bólu ani samopoczucia; pokazuje je z Twoich wpisów w Stanie dziś i ekranie zwierzaka.</p>${srcHtml(['hall','glyc'])}`}
function migGap(h){const c=(S.prof||{}).cond||{};return (!!c.mig||!!c.aura||auraDays()>0)&&!S.once&&h>=12&&!day().some(e=>e.kind==='m')}
const CARDS=[
  {id:'przerwa',sens:1,ev:'u',ref:['kelman','fast'],when:()=>migGap(new Date().getHours()),src:()=>'profil: migrena; dziś brak zapisanego posiłku po 12:00',
    t:'Długa przerwa w jedzeniu',why:'Niejedzenie to jeden z najczęstszych wyzwalaczy migreny: zgłosiło go 57% osób w dużym badaniu. Zjedz coś, nawet małego.',todo:['Posiłki','tab','meals']},
  {id:'aura',sens:1,ev:'m',ref:['who6','aura12','nhs'],when:()=>auraDays()>0,src:()=>`${auraDays()} ${auraDays()===1?'dzień':'dni'} z aurą w ostatnich 90 dniach (dziennik bólu)`,
    t:'Migrena z aurą: porozmawiaj z ginekologiem',why:'Przy migrenie z aurą tabletki z estrogenem to kategoria 4 (przeciwwskazanie) w kryteriach WHO: kobiety z migreną, które je stosują, mają ok. 2-4 razy częściej udar niedokrwienny. Nie odstawiaj ich bez innej antykoncepcji: zmianę ustala lekarz.',
    more:'Pojedynczy objaw typowej aury trwa 5-60 minut. Dzwoń 112, gdy objaw trwa dłużej albo jest inny niż zwykle, i przy objawach udaru: opadający kącik ust, słabość ręki, zaburzenia mowy.'},
  {id:'wizyta',sens:1,ev:'u',ref:'kelman',when:()=>visitDays()!=null||auraDays()>0,
    src:()=>(visitDays()!=null?`wizyta ${fmtDate(S.visit.date)}`:'brak umówionej wizyty')+`; dni z aurą w 90 dniach: ${auraDays()}`,
    t:()=>{const n=visitDays();return n==null?'Do czasu wizyty':`Do czasu wizyty (${esc(S.visit.who||'lekarz')}, za ${n} ${n===1?'dzień':'dni'})`},
    why:'Na dziś 3 rzeczy: sen o stałej porze, regularne posiłki i stała ilość kofeiny. Niejedzenie i zaburzenia snu zgłosiło jako wyzwalacze migreny 57% i 50% osób w dużym badaniu.',
    more:()=>auraDays()>0?'Przy migrenie z aurą nie czekaj miesięcy: umów teleporadę ginekologiczną albo lekarza rodzinnego w ciągu dni. Nie odstawiaj tabletek bez planu innej antykoncepcji.':'Zaznaczaj dni z bólem jednym dotknięciem; lista na wizytę zbierze je za Ciebie.',
    todo:['Lista na wizytę','tab','visit']},
  {id:'bol_hormony',sens:1,ev:'m',ref:'mm',when:()=>{const k=todayKey();return !!painAt(k)&&(S.meas[k]||{}).cyc==='P'},src:()=>'dziś: dzień z bólem głowy i zaznaczone dni bez hormonów',
    t:'Ból głowy w dniach bez hormonów',why:'ICHD-3 opisuje migrenę związaną z miesiączką: napady od 2 dni przed do 3. dnia miesiączki. Zaznaczaj takie dni, a po 3 cyklach dziennik pokaże, czy to Twój wzorzec.',todo:['Zaznacz aurę i lek','goto','painrow']},
  {id:'bez_sil',ev:'u',ref:['mig11','lemmens'],when:()=>!!painAt(todayKey())||(sleepAt(todayKey())!=null&&sleepAt(todayKey())<6),src:()=>painAt(todayKey())?'dziś: dzień z bólem głowy':`sen ostatniej nocy: ${fmtSleep(sleepAt(todayKey()))} (pomiary dnia)`,
    t:'Mało sił na trening',why:'W czasie napadu migreny zwykła aktywność nasila ból, więc dziś odpocznij. Regularny ruch w lepsze dni dawał w badaniach średnio o 0,6 dnia z migreną mniej w miesiącu.',todo:['Dziś odpoczywam','cardok','bez_sil']},
  {id:'zla_noc',ev:'u',ref:'sleepEI',when:()=>{const a=sleepAt(todayKey()),b=sleepAt(nAgo(1));return a!=null&&b!=null&&a<6&&b<6},src:()=>`sen: ${fmtSleep(sleepAt(nAgo(1)))} i ${fmtSleep(sleepAt(todayKey()))} (2 ostatnie noce, pomiary dnia)`,
    t:'Po krótkich nocach chce się jeść więcej',why:'Po skróconym śnie ludzie jedli w badaniach średnio o ok. 385 kcal więcej na dobę. To fizjologia, nie brak silnej woli.',todo:['Śniadanie z białkiem','tab','meals']},
  {id:'stres',ev:'s',ref:'stress',when:()=>urges3()>=2,src:()=>`${urges3()} wpisy ochoty w 3 dni (przycisk ochoty)`,
    t:'Stres i ochota na jedzenie',why:'Według proponowanego modelu przewlekły stres, przez kortyzol i układ nagrody, przesuwa wybory w stronę jedzenia kalorycznego.',todo:['Plan na ochotę','tab','sos']},
  {id:'skok_wagi',ev:'m',ref:['glyc','hall'],when:()=>{const w=wAt(todayKey()),a=wAvg(1,7);return w!=null&&a.n>=3&&w-a.avg>=0.8},src:()=>{const a=wAvg(1,7);return `dziś ${fmt1(wAt(todayKey()))} kg, średnia z ${a.n} ważeń w 7 dni ${fmt1(a.avg)} kg`},
    t:'Skok wagi to zwykle woda',why:'Węglowodany wiążą wodę: każdy gram glikogenu to 2,7-4 g wody. Kilogram tłuszczu to ok. 7700 kcal, więc jeden dzień go nie zrobi.'},
  {id:'waga_stoi',ev:'u',ref:['glyc','meds'],when:()=>{const a=wAvg(0,6),b=wAvg(21,27);return a.n>=2&&b.n>=2&&Math.abs(a.avg-b.avg)<0.2},src:()=>{const a=wAvg(0,6),b=wAvg(21,27);return `średnia teraz ${fmt1(a.avg)} kg (${a.n} ważeń), 3 tygodnie temu ${fmt1(b.avg)} kg (${b.n} ważeń)`},
    t:'Waga stoi mimo starań',why:'Glikogen z wodą zmienia wagę niezależnie od tłuszczu, a część leków (np. na migrenę) zmienia masę ciała. Obwód talii pokazuje zmianę niezależnie od wody.',todo:['Wpisz obwód talii','goto','m_waist']}
];
function cardHtml(c,day){return `<div class="card panel" data-card="${c.id}"><h3>${typeof c.t==='function'?c.t():c.t}</h3><p>${typeof c.why==='function'?c.why():c.why}</p>${c.more?`<p class="small">${typeof c.more==='function'?c.more():c.more}</p>`:''}<p class="small muted">Na podstawie: ${c.src()}. <span class="ev">${EV[c.ev]}</span></p>${srcHtml(c.ref)}`
  +((c.todo||day)?`<p class="cardact">${c.todo?`<button class="btn small" data-${c.todo[1]}="${c.todo[2]}">${c.todo[0]}</button>`:''}${day&&!(c.todo&&c.todo[1]==='cardok')?`<button class="btn ghost small" data-cardok="${c.id}">Rozumiem</button>`:''}</p>`:'')+'</div>'}
function cardsHtml(where){const all=CARDS.filter(c=>c.when());
  if(where==='health')return '<h2>Dlaczego tak się czuję</h2>'+(all.length?all.map(c=>cardHtml(c,false)).join(''):'<p class="small muted">Teraz nic szczególnego. Karty pojawią się, gdy dane coś pokażą.</p>');
  const ok=S.cardsOk||{},list=all.filter(c=>ok[c.id]!==todayKey()&&!(S.discreet&&c.sens)).slice(0,2);
  return list.length?'<h2>Co się dzieje</h2>'+list.map(c=>cardHtml(c,true)).join(''):''}
// Dzień z bólem głowy: neutralny dla serii i zwierzaka, bez celu deficytu
function painHtml(){const k=todayKey(),p=painAt(k),py=painAt(nAgo(1));
  if(!p)return `<p class="painrow" id="painrow"><button class="btn ghost small" data-pain="today">Boli mnie głowa</button>${py?'':' <button class="btn ghost small" data-pain="yday">Wczoraj bolała mnie głowa</button>'}</p>`;
  return `<div class="note painrow" id="painrow"><b>Dzień z bólem głowy.</b> Dziś bez celu deficytu: jedz regularnie i pij wodę. Seria się nie przerywa.<p class="cardact"><button class="btn small${p.aura?'':' ghost'}" data-painaura="1" aria-pressed="${!!p.aura}">Była aura</button><button class="btn small${p.med?'':' ghost'}" data-painmed="1" aria-pressed="${!!p.med}">Lek przyjęty</button><button class="btn ghost small" data-painoff="1">Cofnij</button></p></div>`}
// ---------- Kopia dla rady: zgoda (RODO art. 7 i 9 ust. 2 lit. a) i szyfrowanie w telefonie (AES-GCM 256, klucz z hasła PBKDF2) ----------
const CONSENT_V=1,KDF_ITER=600000;
const CONSENT_TXT=['<b>Co:</b> wszystkie dane z Miary w tym telefonie, w tym dane o zdrowiu (waga, sen, cykl, ból głowy, wizyty).',
  '<b>Po co:</b> przegląd przez właściciela aplikacji i radę projektu, żeby dobrać wskazówki i ulepszać aplikację. Nie do innych celów i nie dla innych osób.',
  '<b>Jak:</b> kopia jest szyfrowana w tym telefonie hasłem, które zna tylko właściciel aplikacji. Na serwerze (Vercel) leży wyłącznie zaszyfrowany plik.',
  '<b>Jak długo:</b> najwyżej 4 ostatnie kopie; każda jest usuwana po przeglądzie.',
  '<b>Twoje prawa:</b> zgoda jest dobrowolna. Możesz ją wycofać w każdej chwili w tym miejscu; wycofanie zatrzymuje wysyłanie i jest prośbą o usunięcie kopii. Nie wpływa na zgodność z prawem wcześniejszego przetwarzania. Masz prawo dostępu do danych, ich sprostowania i usunięcia.'];
function b64(u){let s='';for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s)}
function unb64(s){const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
// Klucz w telefonie: obiekt CryptoKey bez możliwości odczytu (IndexedDB), w testach w pamięci
function idbKey(mode,fn){return new Promise((res,rej)=>{const o=indexedDB.open('miara-klucz',1);o.onupgradeneeded=()=>o.result.createObjectStore('k');o.onerror=()=>rej(o.error);o.onsuccess=()=>{const tx=o.result.transaction('k',mode),r=fn(tx.objectStore('k'));tx.oncomplete=()=>res(r&&r.result);tx.onerror=()=>rej(tx.error)}})}
const KS={mem:null,get:()=>globalThis.indexedDB?idbKey('readonly',s=>s.get('kopia')):Promise.resolve(KS.mem),
  set:k=>globalThis.indexedDB?idbKey('readwrite',s=>s.put(k,'kopia')):Promise.resolve(KS.mem=k),
  del:()=>globalThis.indexedDB?idbKey('readwrite',s=>s.delete('kopia')):Promise.resolve(KS.mem=null)};
async function kopiaDerive(pass,salt,iter){const c=crypto.subtle,base=await c.importKey('raw',new TextEncoder().encode(pass),'PBKDF2',false,['deriveKey']);
  return c.deriveKey({name:'PBKDF2',hash:'SHA-256',salt,iterations:iter||KDF_ITER},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
async function kopiaEncrypt(key,salt,text){const iv=crypto.getRandomValues(new Uint8Array(12)),ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(text));
  return JSON.stringify({app:'miara-szyfr',v:1,kdf:'PBKDF2-SHA-256',iter:KDF_ITER,salt:b64(salt),iv:b64(iv),consentV:CONSENT_V,created:new Date().toISOString(),data:b64(new Uint8Array(ct))})}
async function kopiaDecrypt(pass,env){const o=JSON.parse(env);if(!o||o.app!=='miara-szyfr'||o.v!==1)throw new Error('To nie jest zaszyfrowana kopia Miary');
  try{const key=await kopiaDerive(pass,unb64(o.salt),o.iter);return new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(o.iv)},key,unb64(o.data)))}
  catch(e){throw new Error('Złe hasło albo uszkodzona kopia')}}
async function kopiaSetup(){const c=S.consent;if(!c||c.v!==CONSENT_V)throw new Error('Najpierw potrzebna jest zgoda');
  const g=id=>document.getElementById(id),p1=String(g('k_p1').value||''),p2=String(g('k_p2').value||'');
  if(p1.length<12)throw new Error('Hasło musi mieć co najmniej 12 znaków');if(p1!==p2)throw new Error('Hasła w obu polach różnią się');
  const tok=String((g('k_tok')||{}).value||'').trim();if(tok.length<20)throw new Error('Wpisz token wysyłki (MIARA_UPLOAD_TOKEN z ustawień Vercel)');
  const salt=crypto.getRandomValues(new Uint8Array(16));await KS.set(await kopiaDerive(p1,salt));
  g('k_p1').value='';g('k_p2').value='';g('k_tok').value='';S.kopia={salt:b64(salt),at:new Date().toISOString(),token:tok}}
// Wysyłka na Vercel (api/kopia): przy otwarciu aplikacji, najwyżej raz na 7 dni, tylko przy ważnej zgodzie
function kopiaDue(){const k=S.kopia,c=S.consent;return !DEMO&&!!c&&c.v===CONSENT_V&&!!k&&!!k.token&&(!k.sent||Date.now()-Date.parse(k.sent)>=7*864e5)}
async function kopiaSend(){const k=S.kopia,c=S.consent;if(DEMO||!c||c.v!==CONSENT_V||!k||!k.token)throw new Error('Kopia dla rady nie jest skonfigurowana');
  const key=await KS.get();if(!key)throw new Error('Brak klucza w tym telefonie: ustaw hasło kopii ponownie');
  const env=await kopiaEncrypt(key,unb64(k.salt),bkBuild(false));
  const r=await fetch('api/kopia',{method:'POST',headers:{'content-type':'application/json','x-miara-token':k.token},body:env});
  if(!r.ok){let m='';try{m=(await r.json()).error||''}catch(e){}throw new Error('Wysyłka nieudana'+(m?': '+m:''))}
  k.sent=new Date().toISOString();delete k.err;save()}
function kopiaAuto(){if(!kopiaDue()||typeof fetch!=='function'||(typeof navigator!=='undefined'&&navigator.onLine===false))return Promise.resolve(false);
  return kopiaSend().then(()=>true,e=>{if(S.kopia){S.kopia.err=e.message;save()}return false})}

function radaKopiaHtml(){const c=S.consent;let h='<h3>Kopia dla rady (zaszyfrowana)</h3>';
  // Bez zgody cała sekcja zwinięta (plan „Łatwość”, zadanie 7): po rozwinięciu pełna treść zgody i pole wyboru razem, nic nie jest skracane
  if(!c||c.v!==CONSENT_V)return `<details class="fold" id="fold_radakopia" data-fold="radakopia"${OPEN_F.has('radakopia')?' open':''}><summary>Kopia dla rady (zaszyfrowana)</summary><div class="note"><p><b>Zgoda na zaszyfrowaną kopię danych dla rady (wersja ${CONSENT_V})</b></p><ul>${CONSENT_TXT.map(x=>`<li>${x}</li>`).join('')}</ul><p><label><input type="checkbox" id="c_ok"> Przeczytałam(-em) i wyrażam zgodę na przetwarzanie moich danych o zdrowiu w tym celu.</label></p><p><button class="btn small" data-consent="1">Wyrażam zgodę</button></p></div></details>`;
  h+=`<p class="small">Zgoda z ${fmtDate(String(c.at).slice(0,10))}, wersja ${c.v}. <button class="btn ghost small" data-consentshow="1">Pokaż treść</button></p>`;
  if(S.consentShow)h+=`<div class="note"><ul>${CONSENT_TXT.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
  h+=S.kopia?`<p class="small">Klucz zapisany w tym telefonie ${fmtDate(String(S.kopia.at).slice(0,10))}. Kopia wysyła się sama przy otwarciu aplikacji, najwyżej raz na 7 dni. Ostatnia wysyłka: ${S.kopia.sent?fmtDate(S.kopia.sent.slice(0,10)):'jeszcze nie było'}.</p>${S.kopia.err?`<div class="note warn">${esc(S.kopia.err)}</div>`:''}<p><button class="btn small" data-kopiasend="1">Wyślij teraz</button></p>`
    :'<div class="panel"><div class="field"><label for="k_p1">Hasło kopii</label><input type="password" id="k_p1" autocomplete="new-password" style="width:170px"></div><div class="field"><label for="k_p2">Powtórz hasło</label><input type="password" id="k_p2" autocomplete="new-password" style="width:170px"></div><div class="field"><label for="k_tok">Token wysyłki</label><input type="password" id="k_tok" autocomplete="off" style="width:170px"></div><p class="small muted">Co najmniej 12 znaków. Hasło zna tylko właściciel aplikacji; bez niego kopii nie da się odczytać. Telefon zapisuje klucz, którego nie da się z niego odczytać, a nie hasło.</p><p><button class="btn small" data-kopiakey="1">Zapisz klucz w tym telefonie</button></p></div>';
  return h+'<p><button class="btn ghost small" data-consentoff="1">Wycofaj zgodę</button></p>'}
// Umówiona wizyta i lista na wizytę z dziennika (rada: mapa powiązań nr 1-3, 5, 15)
function visitDays(){const v=S.visit;if(!v||!v.date||v.date<todayKey())return null;return Math.round((Date.parse(v.date+'T12:00:00')-Date.parse(todayKey()+'T12:00:00'))/864e5)}
function visitHtml(){const v=S.visit||{};return `<h2>Wizyta u lekarza</h2><div class="panel"><div class="field"><label for="v_who">U kogo</label><input type="text" id="v_who" maxlength="40" value="${esc(v.who||'')}" placeholder="np. ginekolog" style="width:170px;text-align:left"></div><div class="field"><label for="v_date">Kiedy</label><input type="date" id="v_date" value="${esc(v.date||'')}"></div><p class="cardact"><button class="btn small" data-visitsave="1">Zapisz wizytę</button><button class="btn ghost small" data-tab="visit">Lista na wizytę</button></p></div>`}
function visitLines(){const ks=Array.from({length:90},(_,i)=>nAgo(i)),P=S.pain||{},pk=ks.filter(k=>P[k]),a=pk.filter(k=>P[k].aura).length,m=pk.filter(k=>P[k].med).length,m30=ks.slice(0,30).filter(k=>P[k]&&P[k].med).length;
  const cyc=k=>(S.meas[k]||{}).cyc,pl=ks.filter(k=>cyc(k)==='P'),ot=ks.filter(k=>['1','2','3','4'].includes(cyc(k))),sl=ks.map(sleepAt).filter(x=>x!=null),w=wAvg(0,6);
  const L=[`Okres: ostatnie 90 dni, do ${fmtDate(todayKey())}.`,`Dni z bólem głowy: ${pk.length}; z aurą: ${a}; z lekiem: ${m}.`,`Dni z lekiem w ostatnich 30 dniach: ${m30}.`,
    pl.length>=5&&ot.length>=5?`Ból w dniach bez hormonów: ${pl.filter(k=>P[k]).length} z ${pl.length}; w pozostałych zaznaczonych dniach: ${ot.filter(k=>P[k]).length} z ${ot.length}.`:'Cykl: za mało zaznaczonych dni do porównania (potrzeba po 5).',
    sl.length?`Sen: średnio ${fmtSleep(sl.reduce((s,x)=>s+x,0)/sl.length)} z ${sl.length} nocy.`:'Sen: brak danych.',
    w.n?`Waga: średnia ${fmt1(w.avg)} kg z ${w.n} ważeń w ostatnich 7 dniach.`:'Waga: brak ważeń w ostatnich 7 dniach.'];
  if(((S.prof||{}).cond||{}).gut){const g=gutSum();L.push(`Brzuch (28 dni, ${g.n} dni z wpisem): wzdęcie 5 lub więcej w ${g.hi} dniach; dni bez wypróżnienia: ${g.none}; dni z luźnym stolcem: ${g.lz}.`);L.push('Powiedz lekarzowi, jeśli było: krew w stolcu, niezamierzona utrata wagi, wymioty, gorączka albo guz w brzuchu.');gutVisitLines(L)}
  if(a)L.push('Do zapytania: czy przy migrenie z aurą mogę dalej brać tabletki antykoncepcyjne z estrogenem i jaka metoda będzie bezpieczna?');
  return L}
function gutVisitLines(L){const G=S.gut||{},al=Array.from({length:28},(_,i)=>nAgo(i)).filter(k=>G[k]&&Array.isArray(G[k].a)&&G[k].a.length);
  if(al.length)L.push('Objawy alarmowe: '+al.map(k=>fmtDate(k)+' ('+G[k].a.map(id=>(GUT_A.find(x=>x[0]===id)||[0,id])[1]).join(', ')+')').join('; ')+'.');
  if(typeof SYG==='undefined')return;const all=SYG.ocen(S,todayKey(),{all:true}),seen=new Set(),q=x=>{if(x&&!seen.has(x.id)){seen.add(x.id);L.push('Do omówienia: '+x.t)}};
  all.filter(x=>x.lvl==='wkrotce'||x.lvl==='badanie').forEach(q);(Array.isArray(S.wizList)?S.wizList:[]).forEach(id=>q(all.find(x=>x.id===id)));
  const pr=S.prof||{};if(pr.nlpz)L.push('Biorę regularnie ibuprofen lub aspirynę.');if(pr.rodzRak)L.push('Rak żołądka u rodzica, rodzeństwa lub dziecka.');
  if(all.some(x=>x.id==='zelazo')){const f=(S.labs||[]).filter(x=>x&&x.test==='ferr').sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))).pop();L.push('Ferrytyna poniżej zakresu z wydruku'+(f&&f.date?' ('+fmtDate(f.date)+')':'')+'.')}}
function renderVisit(){const v=S.visit||{};document.getElementById('main').innerHTML=`<h2>Lista na wizytę${v.who?': '+esc(v.who):''}${v.date?', '+fmtDate(v.date):''}</h2><div class="panel card">`+visitLines().map(x=>`<p>${esc(x)}</p>`).join('')
  +'<p class="small muted">Liczby z dziennika bólu, cyklu i pomiarów w tym telefonie. Pokaż je lekarzowi albo skopiuj.</p></div><p class="cardact"><button class="btn" data-visitcopy="1">Kopiuj listę</button><button class="btn ghost" data-tab="health">Wróć do Zdrowia</button>'+(Array.isArray(S.wizList)&&S.wizList.length?'<button class="btn ghost" data-wizclear="1">Wyczyść pytania po wizycie</button>':'')+'</p>'}
// ---------- Widoki ----------
const TABS=[
  ['meals','Posiłki','<path d="M4 11h16a8 8 0 0 1-16 0Z"/><path d="M8 7c0-1.5 1-2 1-3.5M12 7c0-1.5 1-2 1-3.5M16 7c0-1.5 1-2 1-3.5"/>'],
  ['train','Trening','<path d="M2 12h2M20 12h2M6 8v8M18 8v8M9 10v4M15 10v4M9 12h6"/>'],
  ['day','Mój dzień','<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>'],
  ['health','Zdrowie','<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>'],
  ['set','Ustawienia','<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>']
];
function renderTabs(){const tb=document.getElementById('tabs');if(tb&&tb.style)tb.style.display=S.tab==='intro'?'none':'';
  const SV=ic=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ic}</svg>`,SH={day:'Dzień',set:'Ustaw.'},left=dayLeft();
  document.getElementById('tabs').innerHTML=TABS.map(([k,l,ic])=>{const n=k==='day'&&!S.focus?left:0;return `<button class="${S.tab===k?'on':''}" data-tab="${k}" aria-label="${l}${n?`, ${n} do zrobienia`:''}">${SV(ic)}<span class="l${SH[k]?' hs':''}">${l}</span>${SH[k]?`<span class="s">${SH[k]}</span>`:''}${n?`<span class="badge" aria-hidden="true">${n}</span>`:''}</button>`
    +(k==='day'?`<button class="add${SHEET?' on':''}" data-addsheet="1" aria-label="Dodaj wpis" aria-haspopup="dialog" aria-expanded="${SHEET}">${SV('<path d="M12 5v14M5 12h14"/>')}<span class="l">Dodaj</span></button>`:'')}).join('');
  document.getElementById('title').textContent=(TABS.find(x=>x[0]===S.tab)||[0,{help:'Pomoc',sos:'Ochota na przekąskę',labs:'Moje badania',visit:'Lista na wizytę',intro:'Wprowadzenie',review:'Przegląd tygodnia',krok:'Krok po kroku',import:'Dane ze Skrótu',recipe:'Przepis',knee:'Program kolana',mob:'Mobilność',impact:'Mój wpływ',challenge:'Wspólne wyzwanie',pet:'Mój zwierzak'}[S.tab]||''])[1];
  document.getElementById('who').textContent=new Date().toLocaleDateString('pl-PL',{weekday:'short',day:'numeric',month:'numeric'});
}
// Grupa wyboru jednej opcji: nazwa grupy (label) jest obowiązkowa, stan opcji w aria-pressed (test strażnika w smoke.js)
function seg(items,cur,attr,cls,label){return `<div class="seg ${cls||''}" role="group" aria-label="${label}">`+items.map(([v,l])=>{const on=String(cur)===String(v);return `<button class="${on?'on':''}" data-${attr}="${v}" aria-pressed="${on}">${l}</button>`}).join('')+'</div>'}
function optList(list,cur,attr){return '<div class="panel">'+list.map(o=>`<button class="opt ${o.id===cur?'on':''}" data-${attr}="${o.id}"><span class="dot"></span><span>${o.n}</span>${o.met?`<span class="met">MET ${fmt1(o.met)}</span>`:''}</button>`).join('')+'</div>'}

function renderMeals(){
  const cm=carbMult(),n=trainNet();
  const carbTxt=S.f.carb==='auto'?(n>0?`Automatycznie z dzisiejszych treningów (${fmt(n)} kcal netto): węglowodany ×${fmt1(cm)}.`:'Automatycznie: brak treningu w dzienniku dnia, węglowodany ×1.'):`Ustawione ręcznie: węglowodany ×${fmt1(cm)}.`;
  let h=planHtml()+'<h2>Albo wybierz sam</h2>'+seg([['sniadanie','Śniadanie'],['obiad','Obiad'],['kolacja','Kolacja'],['przekaska','Przekąska'],['all','Wszystkie']],S.f.type,'type','scroll','Rodzaj posiłku')+forMeHtml()+'<div id="oznaczenia"><p class="small" style="margin:8px 8px 4px"><b>Oznaczenia</b></p>'+whyP('oznaczenia')+'<div class="chips">'+[['sw','Słodkie'],['io','Przy IO']].map(([v,l])=>`<button class="chip${(S.f.tags||{})[v]?' inc':''}" data-ftag="${v}" aria-pressed="${!!(S.f.tags||{})[v]}">${l}</button>`).join('')+'</div></div>'+'<div id="rytm">'+seg([['all','Każdy czas'],['quick','Na co dzień, do 20 min'],['big','Na weekend, więcej czasu']],S.f.pace||'all','pace','scroll','Czas przygotowania')+'</div>';
  h+='<details class="fold" data-fold="filtry"'+(OPEN_F.has('filtry')?' open':'')+'><summary>Filtry i sortowanie</summary><div style="padding:0 12px 12px">';
  h+='<h2>Produkty</h2><p class="small muted">Dotknij raz: chcę. Drugi raz: bez tego. Trzeci: bez znaczenia.</p><div class="chips">'+CHIPS.map(c=>{const s=S.f.chips[c]||0;return `<button class="chip ${s===1?'inc':s===-1?'exc':''}" data-chip="${c}" aria-pressed="${s===1?'true':s===-1?'mixed':'false'}">${c}${s===1?' (chcę)':s===-1?' (bez)':''}</button>`}).join('')+'</div>';
  h+='<h2 id="podtrening">Pod trening</h2>'+whyP('podtrening')+seg([['auto','Auto: z treningów dnia'],['1','Bez treningu'],['1.25','Lekki trening'],['1.5','Siłownia, cardio']],S.f.carb,'carb','scroll','Węglowodany pod trening')+`<p class="small muted">${carbTxt} Zmienia tylko porcję kaszy, ryżu, ziemniaków, pieczywa i płatków.</p>`;
  h+='<h2 id="makro">Makro na porcję</h2>'+whyP('makro')+'<div class="panel">'+
    `<div class="slider"><div class="top"><span>Białko co najmniej</span><b id="l_minP">${S.f.minP} g</b></div><input type="range" min="0" max="60" step="5" value="${S.f.minP}" data-r="minP" aria-label="Białko co najmniej" aria-valuetext="${rTxt('minP',S.f.minP)}"></div>`+
    `<div class="slider"><div class="top"><span>Kalorie najwyżej</span><b id="l_maxK">${S.f.maxK>=1000?'bez limitu':S.f.maxK+' kcal'}</b></div><input type="range" min="150" max="1000" step="25" value="${S.f.maxK}" data-r="maxK" aria-label="Kalorie najwyżej" aria-valuetext="${rTxt('maxK',S.f.maxK)}"></div>`+
    `<div class="slider"><div class="top"><span>Węglowodany najwyżej</span><b id="l_maxC">${S.f.maxC>=130?'bez limitu':S.f.maxC+' g'}</b></div><input type="range" min="0" max="130" step="5" value="${S.f.maxC}" data-r="maxC" aria-label="Węglowodany najwyżej" aria-valuetext="${rTxt('maxC',S.f.maxC)}"></div>`+
    `<div class="slider"><div class="top"><span>Wielkość porcji</span><b id="l_portion">×${fmt1(S.f.portion)}</b></div><input type="range" min="0.7" max="1.5" step="0.05" value="${S.f.portion}" data-r="portion" aria-label="Wielkość porcji" aria-valuetext="${rTxt('portion',S.f.portion)}"></div>`+
    '</div>';
  h+='<h2>Sortuj</h2>'+seg([['p','Najwięcej białka na kcal'],['k','Najmniej kcal'],['t','Najszybsze']],S.f.sort,'sort','scroll','Sortowanie przepisów');
  h+='</div></details><div id="mlist"></div>'+shopHtml()+orderHtml();
  document.getElementById('main').innerHTML=h;
  renderMealList();
}
function renderMealList(){renderMealList0();tileLabels(document.getElementById('mlist'))}
function renderMealList0(){
  const L=filtered(),el=document.getElementById('mlist');if(!el)return;
  const TN={sniadanie:'Śniadanie',obiad:'Obiad',kolacja:'Kolacja',przekaska:'Przekąska'};
  if(!L.length){el.innerHTML='<div class="note">Żaden posiłek nie spełnia tych warunków. Poluzuj limit kalorii lub białka albo odznacz produkt wykluczony.</div>';return}
  el.innerHTML=`<h2>${L.length} ${L.length===1?'propozycja':(L.length%10>=2&&L.length%10<=4&&(L.length%100<10||L.length%100>=20)?'propozycje':'propozycji')}</h2>`+L.map(({m,x},i)=>{
    const tot=x.p*4+x.f*9+x.c*4||1,isOpen=open.has(m.id);
    return (i===6?`<details class="fold" id="fold_mreszta" data-fold="mreszta"${OPEN_F.has('mreszta')?' open':''}><summary>Pokaż pozostałe (${L.length-6})</summary>`:'')+`<article class="meal"><button class="mhead" data-recipe="${m.id}"><div class="name">${m.n}</div><div class="meta">${S.f.type==='all'?TN[m.t]+', ':''}${m.min} min${m.prep?', z gotowania na zapas':''}${tagsHtml(m,x)}</div><div class="small" style="color:var(--green);margin-top:4px;text-decoration:underline;text-underline-offset:3px">Składniki i przygotowanie</div></button>
      <div class="mnum"><span><b>${fmt(x.k)}</b> kcal</span>${macChips(x)}</div>
      ${propBar(x)}
      ${isOpen?`<div class="mdet"><ul>${x.items.map(i=>`<li><span>${i.n}</span><span>${fmt(Math.round(i.g/5)*5)} g</span></li>`).join('')}</ul><p class="small">${m.how}</p><p class="small muted">${leftTxt(x.k)} ${fmt(x.k)} kcal to ok. ${fmt(x.k/walkPerMin())} min spaceru.</p><p>${eatBtn(m.id,'Dodaj do dnia')} <button class="btn ghost" data-copy="${m.id}">Kopiuj składniki do Fitatu</button></p>${eatLine(m.id)}</div>`:''}
    </article>`}).join('')+(L.length>6?'</details>':'')+fold('mlinfo','Skąd te wartości','<p class="small muted">Wartości odżywcze orientacyjne, z typowych tabel składu. Gramatury produktów suchych (kasza, ryż, makaron, soczewica) przed ugotowaniem. Kasza i ryż z mikrofali: 1 część na 2 części wody, duża miska pod przykryciem, ok. 12-20 min na średniej mocy z mieszaniem; czas zależy od mikrofali, więc przy pierwszym razie sprawdź miękkość.</p>'+'<p class="small muted">Błonnik (Bł) z duńskiej bazy składu żywności Frida 6.1, hummus z brytyjskiej CoFID; polskie tabele składu nie są dostępne jako otwarte dane. Mrożona mieszanka warzyw nie ma wartości błonnika w żadnej z tych tabel, dlatego przy daniach z nią jest znak +: błonnika jest co najmniej tyle. Oznaczenia „Źródło błonnika” (od 1,5 g na 100 kcal) i „Dużo błonnika” (od 3 g na 100 kcal) to progi z rozporządzenia UE, tu liczone na porcję.</p>'+'<p class="small muted">Błonnik rozpuszczalny (owies, strączki, siemię) spowalnia opróżnianie żołądka i zmniejsza skok cukru po posiłku; pokazało to badanie na 40 osobach po jednym posiłku. EFSA uznaje 25 g błonnika dziennie za ilość wystarczającą dla prawidłowej pracy jelit, a w metaanalizach największe zmniejszenie ryzyka chorób serca i cukrzycy typu 2 wiązało się z 25-29 g dziennie.</p>'+srcHtml(['frida','cofid','eu1924','fibGE','efsaFib','reynolds']));
}

function renderTrain(){
  const t=S.tr;
  let h=warmHtml()
    +'<h2>Trening z zegarka</h2><div class="panel">'+rwHtml('tr',['wmin'])+'<div class="chips quick">'+[30,45,60,90].map(v=>`<button class="chip${String(t.wmin)===String(v)?' inc':''}" data-setv="tr.wmin" data-v="${v}" aria-pressed="${String(t.wmin)===String(v)}">${v} min</button>`).join('')+'</div>'+rwHtml('tr',['wk'])+RW_TIP+'<p>'+actHtml('watch','data-addwatch="1"',ACT_L.watch,false)+'</p></div>'
    +'<p class="small muted">Zegarek też szacuje kalorie, zwykle z tętna, a błąd bywa większy niż 20%. Do bilansu liczy się netto: kalorie z zegarka minus spoczynek w tym czasie.</p><h2>Albo oszacuj z rodzaju treningu</h2>'+seg([['silownia','Siłownia'],['plywanie','Pływanie'],['bieznia','Bieżnia'],['spinning','Spinning'],['inne','Inne']],t.cat,'cat','scroll','Rodzaj treningu');
  if(t.cat==='bieznia'){
    h+=seg([['marsz','Marsz'],['bieg','Bieg']],t.bMode,'bmode','','Marsz czy bieg');
    h+='<div class="panel">'+rwHtml('tr',['speed','grade'])+RW_TIP+'</div>';
  }else if(t.cat==='spinning'){
    h+=seg([['w','Moc z monitora'],['k','Rodzaj zajęć']],t.sMode,'smode','','Spinning: skąd liczyć kalorie');
    if(t.sMode==='w')h+='<div class="panel">'+rwHtml('tr',['watts'])+RW_TIP+'</div><p class="small muted">Monitor roweru pokazuje średnią moc z całych zajęć. Ta wartość daje dokładniejszy wynik niż rodzaj zajęć.</p>';
    else h+=optList(SPIN,t.sClass,'sclass');
  }else{
    h+=optList(ACT[t.cat].opts,t.opt[t.cat],'opt');
    if(ACT[t.cat].note)h+=`<p class="small muted">${ACT[t.cat].note}</p>`;
  }
  const sp=spec(),m=Math.max(0,num(t.min)),km=kcal(sp,m);
  h+='<div class="panel">'+rwHtml('tr',['min'])+RW_TIP+'</div>';
  h+=`<section class="readout"><h3>${sp.label}</h3><div class="trio">`+[30,45,60].map(mm=>{const k=kcal(sp,mm);return `<div class="cell"><div class="min">${mm} min</div><div class="big">${fmt(k.gross)}</div><div class="sub">netto ${fmt(k.net)}</div></div>`}).join('')+
    `</div><p class="unit">kcal brutto przy ${fmt1(kg())} kg${S.korekta?', z korektą na spoczynkowe zużycie energii':''}. Netto to część ponad spoczynek.</p>
    <div class="custom"><span class="res">${fmt(m)} min: ${fmt(km.gross)} kcal, netto ${fmt(km.net)}</span>${actHtml('train','data-addtrain="1"',ACT_L.train,false)}</div></section>`;
  if(sp.knee)h+=`<div class="note warn">Kolano: ${sp.knee}</div>`;
  if(sp.warn)h+=`<div class="note warn">${sp.warn}</div>`;
  h+=`<p class="small muted">Źródło wartości: ${sp.src}${sp.met?`, MET ${fmt1(sp.met)}`:''}. Wynik jest szacunkiem dla przeciętnej osoby; rzeczywiste spalanie może różnić się o kilkadziesiąt procent.</p>`;
  h+='<p><button class="btn ghost" data-tab="knee">Program kolana, 12 tygodni</button></p><p><button class="btn ghost" data-tab="mob">Mobilność, ok. 10 min</button></p>';
  document.getElementById('main').innerHTML=h;
  if(WARM_UI.focus){WARM_UI.focus=false;const wh=document.getElementById('warm_h');if(wh&&wh.focus)wh.focus()}
}

// Stan dziś: punkt centralny Mojego dnia; każda wartość ze źródłem i liczbą danych, brak danych pokazany wprost
function plPos(n){return n===1?'posiłek':(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?'posiłki':'posiłków'}
function stanHtml(){const k=todayKey(),m=S.meas[k]||{},d=day(),ml=d.filter(e=>e.kind==='m'),tr=d.filter(e=>e.kind==='t'),p=painAt(k),cyc=m.cyc;
  const row=(lab,val,src)=>`<div class="stan-row"><span class="stan-lab">${lab}</span><span class="stan-val">${val}</span><span class="stan-src">${src}</span></div>`;
  const a=wAvg(0,6),b=wAvg(7,13),dw=a.n&&b.n?a.avg-b.avg:null;
  let h=row('Waga',a.n?`${fmt1(a.avg)} kg${dw!=null?` <small>${dw<=0?'−':'+'}${fmt1(Math.abs(dw))} kg</small>`:''}`:'brak danych',a.n?`średnia z ${a.n} ważeń w 7 dni${b.n?`; tydzień wcześniej ${fmt1(b.avg)} kg z ${b.n}`:''}`:'wpisz wagę w Pomiarach dnia niżej');
  const eat=ml.reduce((s,e)=>s+e.k,0),prot=ml.reduce((s,e)=>s+e.p,0),fk=ml.filter(e=>typeof e.fib==='number'),fb=fk.reduce((s,e)=>s+e.fib,0),fna=fk.length<ml.length||fk.some(e=>e.fibNA);
  h+=row('Jedzenie',ml.length?(p?`${fmt(eat)} kcal`:`${fmt(eat)} z ${fmt(targetKcal())} kcal`):'brak danych',ml.length?`${ml.length} ${plPos(ml.length)} zapisane, białko ${fmt(prot)} g${fk.length?`, błonnik ${fna?'co najmniej ':''}${fmt(fb)} g z 25 g`:''}`+(p?'; dziś bez celu deficytu':tgtApx()?'; '+tgtApx():''):(p?'dziś bez celu deficytu; ':'')+'zapisz posiłek w Posiłkach');
  const sl=sleepAt(k),s7=Array.from({length:7},(_,i)=>sleepAt(nAgo(i))).filter(x=>x!=null);
  h+=row('Sen',sl!=null?fmtSleep(sl):'brak danych',s7.length?`${sl!=null?'ostatnia noc; ':''}średnia ${fmtSleep(s7.reduce((s,x)=>s+x,0)/s7.length)} z ${s7.length} nocy`:'wpisz sen w Pomiarach dnia niżej');
  const st=num(m.steps),tm=tr.reduce((s,e)=>s+num(e.min),0),mv=[st>0?`${fmt(st)} kroków`:'',tr.length?`trening ${fmt(tm)} min`:''].filter(Boolean).join(', ');
  h+=row('Ruch',mv||'brak danych',mv?'dzisiejsze pomiary i treningi':'wpisz kroki albo dodaj trening');
  if(p||cyc)h+=row('Ból i cykl',p?'dzień z bólem'+(p.aura?', aura':''):'bez bólu',cyc?(cyc==='P'?'dni bez hormonów':'tydzień cyklu '+esc(cyc)):'cykl nie zaznaczony dziś');
  return `<section class="stan panel" id="stan" aria-label="Stan dziś"><h2>Stan dziś</h2>${h}</section>`}
// Etap 1: cel aktywny i „Co się wydarzyło” (zdarzenia.js liczy, app.js tylko pokazuje)
function zdCtx(){
  const k=S.krok;
  return {pT:protTarget(),est:!!pillOf()[2],krokDone:!!(k&&k.conf&&kProg(mondayOf(new Date())).ok)};
}
function zdSrc(x){return `<a href="${x.url}" target="_blank" rel="noopener">źródło</a>, siła dowodów: ${x.sila}`}
// Ostatni pełny tydzień aktywnego celu: koniec tygodnia i czy zaliczony (ZD.done)
function celWeek(){const c=S.cel;if(!c||!c.since||!ZD.goalOf(c.id))return null;const t0=Date.parse(c.since+'T12:00:00'),n=Math.floor((Date.parse(todayKey()+'T12:00:00')-t0)/(7*864e5));if(n<1)return null;
  const end=keyOf(new Date(t0+(7*n-1)*864e5));return {n,end,done:ZD.done(S,c.id,end,zdCtx())}}
function celHtml(){
  const ctx=zdCtx(),sig=ZD.signals(S,todayKey(),ctx),cur=S.cel&&ZD.goalOf(S.cel.id);
  const pick=(id,lab)=>`<button class="chip${cur&&cur.id===id?' inc':''}" data-cel="${id}" aria-pressed="${cur&&cur.id===id}">${lab}</button>`;
  let h=sig.map(x=>`<div class="note warn"><b>Najpierw lekarz: ${esc(x.t)}.</b> ${esc(x.x)}</div>`).join('');
  h+='<section class="panel zdsec" id="cel" aria-label="Twój cel"><h2>Twój cel</h2>';
  if(!cur){
    const sug=ZD.suggest(S,todayKey(),ctx),g=ZD.goalOf(sug);
    h+=`<p>Proponowany cel: <b>${g.t}</b>.</p><p>${pick(sug,'Wybieram ten cel')}</p>`;
    h+=fold('celwybor','Inne cele',`<div class="chips">${ZD.goals.filter(x=>x.id!==sug).map(x=>pick(x.id,x.t)).join('')}</div>`);
  }else{
    const p=ZD.progress(S,cur.id,todayKey(),ctx);
    h+=`<p><b>${cur.t}</b>, od ${fmtDate(S.cel.since)}</p><p class="small">W tym tygodniu: ${esc(p.txt)}.</p>`;
    const wk=celWeek();
    if(wk&&wk.done){const nx=ZD.suggest(S,todayKey(),ctx,[cur.id]),g=ZD.goalOf(nx);h+=`<div class="note"><b>Tydzień zaliczony.</b> Następny cel z Twoich danych: <b>${g.t}</b>. Możesz też zostać przy obecnym.<p class="cardact">${pick(nx,'Przechodzę do następnego celu')}</p></div>`}
    else if(wk)h+=`<p class="small muted">Tydzień ${wk.n} się skończył bez zaliczenia. To częste: zostań przy celu albo wybierz łatwiejszy.</p>`;
    h+=`<h3>Na co jeszcze wpływa</h3><ul class="zd">${ZD.impact(cur.id,S.prof).map(x=>`<li><b>${x.to}:</b> ${x.t} <span class="small muted">(${zdSrc(x)})</span></li>`).join('')}</ul>`;
    h+=fold('celwybor','Zmień cel',`<p class="small muted">Zmiana celu nie kasuje danych.</p><div class="chips">${ZD.goals.map(x=>pick(x.id,x.t)).join('')}</div>`);
  }
  return h+'</section>';
}
// Kilka schorzeń: najpierw bezpieczeństwo, potem wspólne podstawy (pozycje Zdrowia, planActs)
function razemHtml(){const c=(S.prof||{}).cond||{};if(CONDS.filter(([id])=>c[id]).length<2)return '';const A=planActs(),L=A.filter(x=>x.pri<=2).concat(A.filter(x=>/^Razem:/.test(x.t)||x.t==='Stały rytm dnia'));
  return fold('razem','Twoje schorzenia razem',`<p class="small">Kolejność: najpierw bezpieczeństwo, potem wspólne podstawy. Wsparcie stylu życia przy opiece lekarza.</p><ul class="zd">${L.map(x=>`<li><b>${x.t}.</b> <span class="small">${x.why}</span></li>`).join('')}</ul><p><button class="btn ghost small" data-tab="health">Wszystko w Zdrowiu</button></p>`)}
function zdHtml(){
  const ev=ZD.events(S,todayKey(),zdCtx());
  const one=e=>`<li><b>${esc(e.t)}</b> <span class="small muted">${fmtDate(e.k)}</span><br><span class="small">${esc(e.x)}</span><br><span class="small muted">Z czego: ${esc(e.z)}; ${esc(e.w)}.${e.act&&e.act.url?' '+zdSrc(e.act)+'.':''}</span></li>`;
  let h='<section class="panel zdsec" id="zdarzenia" aria-label="Co się wydarzyło"><h2>Co się wydarzyło</h2>';
  if(!ev.length)h+='<p class="small">Zdarzenia pojawią się, gdy zapiszesz kilka dni: wagę, sen, kroki albo posiłki.</p>';
  else{
    h+=`<ul class="zd">${ev.slice(0,3).map(one).join('')}</ul>`;
    if(ev.length>3)h+=fold('zdall',`Wszystkie z 28 dni (${ev.length})`,`<ul class="zd">${ev.slice(3).map(one).join('')}</ul>`);
  }
  return h+'</section>';
}
function renderDay(){
  if(S.lite){if(S.focus){const sh=skupDayHtml();if(sh!=null){document.getElementById('main').innerHTML=sh;skupAfter();return}}document.getElementById('main').innerHTML=liteCardHtml()+unlockHtml()+petCardHtml()+'<p><button class="btn ghost" data-litefull="1">Pokaż całą Miarę</button></p>';return}
  const d=day(),tr=d.filter(e=>e.kind==='t'),ml=d.filter(e=>e.kind==='m');
  const net=tr.reduce((a,e)=>a+e.net,0),eat={k:0,p:0,f:0,c:0};ml.forEach(e=>{eat.k+=e.k;eat.p+=e.p;eat.f+=e.f;eat.c+=e.c});
  const R=rmr(),target=targetKcal(),pT=protTarget();
  const bar=(lab,v,max,unit)=>{const pc=Math.min(100,v/max*100);return `<div class="prog"><div class="top"><span>${lab}</span><span>${fmt(v)} / ${fmt(max)} ${unit}</span></div><div class="track"><div class="fill ${v>max*1.05?'over':''}" style="width:${pc}%"></div></div></div>`};
  const sos='<p><button class="btn sos" data-tab="sos">Mam ochotę coś przekąsić</button></p>';
  const due=measDue();
  const gh=gutHtml(),sy=sygHtml(),gb=gh?sy+gh:'';
  let h=(gh?'':sy)+guideHtml()+modePropHtml()+focusHtml()+painHtml()+(due?measHtml('top')+gb:'')+cardsHtml('day')+stanHtml()+celHtml()+razemHtml()+zdHtml()+krokCardHtml()+reviewPromptHtml()+petCardHtml()+sos+(due?measHtml('rest'):measHtml())+legHtml()+(due?'':gb)+kneeBannerHtml();
  let more=modeHtml()+`<h3 class="rh" style="margin:4px 4px 8px">Energia i białko dziś</h3><div class="panel" style="padding:8px 16px">${bar('Energia z posiłków',eat.k,target,'kcal')}${bar('Białko',eat.p,pT,'g')}<p class="small muted">Tłuszcz ${fmt(eat.f)} g, węglowodany ${fmt(eat.c)} g. Treningi dziś: ${fmt(net)} kcal netto.${tgtApx()?' Cel: '+tgtApx()+'.':''}</p></div>`;
  more+=fold('nawyki','Nawyki i punkty: '+fmt(dayPts(todayKey()))+' pkt dziś',habitsHtml(tr.length>0));
  more+=fold('prognoza','Prognoza i Twój priorytet',projHtml()+sexHtml());
  more+=relHtml();
  // F2c: ochoty z „Mam ochotę coś przekąsić” dają się usunąć tak jak posiłki (stare wpisy bez godziny i wyzwalacza: „bez godziny”)
  const ur=(S.urges||{})[todayKey()]||[],urLab=u=>(isFinite(u.h)&&u.h!==null?String(u.h).padStart(2,'0')+':00':'bez godziny')+((TRIG.find(x=>x[0]===u.trig)||[])[1]?', '+TRIG.find(x=>x[0]===u.trig)[1]:'');
  const urH=ur.length?'<h3 class="rh" style="margin:12px 16px 8px">Ochoty</h3><div class="panel">'+ur.map((u,i)=>`<div class="entry"><span class="txt">${esc(urLab(u))}</span><span class="val"></span><button class="del" data-delurge="${i}" aria-label="Usuń ochotę: ${esc(urLab(u))}">×</button></div>`).join('')+'</div>':'';
  h+='<details class="fold" data-fold="zapisane"'+(OPEN_F.has('zapisane')?' open':'')+'><summary>Zapisane dziś: posiłki '+ml.length+', treningi '+tr.length+(ur.length?', ochoty '+ur.length:'')+'</summary>'+(tr.length?'<h3 class="rh" style="margin:4px 16px 8px">Treningi</h3><div class="panel">'+tr.map(e=>`<div class="entry"><span class="txt">${e.label}, ${fmt(e.min)} min</span><span class="val">${fmt(e.gross)} kcal</span><button class="del" data-del="${d.indexOf(e)}" aria-label="Usuń">×</button></div>`).join('')+'</div>':'<p style="margin:4px 16px"><button class="btn ghost small" data-tab="train">Przejdź do Treningu</button></p>');
  h+='<h3 class="rh" style="margin:12px 16px 8px">Posiłki</h3><div class="panel">'+(ml.length?ml.map(e=>`<div class="entry"><span class="txt">${e.label}</span><span class="val">${fmt(e.k)} kcal, B ${fmt(e.p)} g</span><button class="del" data-del="${d.indexOf(e)}" aria-label="Usuń">×</button></div>`).join(''):'<div class="empty">Brak posiłków. <button class="btn ghost small" data-tab="meals">Przejdź do Posiłków</button></div>')+'</div>'+urH+'</details>';
  h+=`<details class="fold" data-fold="szybki"${OPEN_F.has('szybki')?' open':''}><summary>Szybki wpis albo powtórz wczoraj</summary><div class="panel"><div class="field"><label for="q_n">Co</label><input type="text" id="q_n" style="width:170px;text-align:left" placeholder="np. kawa z mlekiem"></div><div class="field"><label for="q_k">Ile</label><input type="text" inputmode="numeric" enterkeyhint="done" id="q_k" placeholder="0"><span class="unit">kcal</span></div>${kcalChips('q_k')}</div><p><button class="btn" data-quick="1">Zapisz</button> <button class="btn ghost" data-repeat="1">Powtórz wczorajsze posiłki</button><button class="btn ghost" data-nav="meals#zamowione#zamowione">Zamówione jedzenie</button></p><p class="small muted">Wpis przybliżony wystarczy. W badaniach z wynikiem redukcji wiązała się częstość zapisywania, nie jego dokładność.</p></details>`;
  more+='<div class="navrow"><button class="btn ghost" data-tab="impact">Mój wpływ</button>'+(CH.state==='on'?'<button class="btn ghost" data-tab="challenge">Wspólne wyzwanie</button>':'')+'<button class="btn ghost" data-tab="review">Przegląd tygodnia</button></div>';
  if(d.length)more+='<p><button class="btn ghost" data-clear="1">Wyczyść dzień</button></p>';
  more+=`<details class="fold" data-fold="cel"${OPEN_F.has('cel')?' open':''}><summary>Jak liczony jest cel</summary><div class="note small" style="margin:0 12px 12px">${S.mode==='masa'?'Przyrost masy: cel to zapotrzebowanie plus ok. 10%, '+(measuredTdee()?'zapotrzebowanie zmierzone z jedzenia i trendu wagi.':'na razie zapotrzebowanie ze wzoru (spoczynkowe zużycie × 1,3 plus treningi netto).'):S.mode==='utrzymanie'?'Tryb utrzymania: cel to zapotrzebowanie bez deficytu, '+(measuredTdee()?'zmierzone z jedzenia i trendu wagi.':'na razie ze wzoru (spoczynkowe zużycie × 1,3 plus treningi netto).'):measuredTdee()?'Jak liczony jest cel: zmierzone zapotrzebowanie (jedzenie i trend wagi) minus 20%.':`Jak liczony jest cel: na start szacunek, czyli spoczynkowe zużycie energii ${fmt(R)} kcal (wzór Mifflina-St Jeora) × 1,3 dla pracy siedzącej, plus treningi netto, minus 20%. Po 2-4 tygodniach ważenia i zapisywania aplikacja przejdzie na zapotrzebowanie zmierzone.`} Nigdy poniżej spoczynkowego zużycia. Białko: 1,4 g na kg wagi docelowej. Mnożnik 1,3 i deficyt 20% to założenia planu, nie pomiar. Zapisuj na bieżąco, najlepiej zaraz po każdym posiłku.</div></details>`;
  h+=fold('wiecej','Więcej: nawyki, prognoza, przeglądy',more);
  document.getElementById('main').innerHTML=h;
}

// Dane osoby: sprawdzenie przed zapisem i przycisk „dalej” tam, gdzie kończy się ekran
const DATA_F=[['kg','wagę','Waga','kg'],['cm','wzrost','Wzrost','cm'],['age','wiek','Wiek','lat'],['goal','wagę docelową','Waga docelowa','kg']];
function dataCheck(){const err=[],warn=[];let first=null;
  DATA_F.forEach(([k,acc,nom,u])=>{const v=num(S[k]),[a,b]=LIM[k];if(!(v>0)){err.push('Uzupełnij '+acc+'.');first=first||k}else if(v<a||v>b){err.push(`${nom}: wpisz wartość od ${a} do ${b} ${u}.`);first=first||k}});
  if(!err.length&&S.mode==='redukcja'&&num(S.goal)>=num(S.kg)){err.push('Waga docelowa w redukcji powinna być niższa od obecnej.');first='goal'}
  if(!err.length&&S.mode==='masa'&&num(S.goal)<num(S.kg))warn.push('Waga docelowa w przyroście masy powinna być wyższa od obecnej albo równa.');
  if(!err.length&&num(S.goal)/Math.pow(num(S.cm)/100,2)<18.5)warn.push('Waga docelowa daje BMI poniżej 18,5. Ustal cel z lekarzem lub dietetykiem.');
  else if(!err.length&&S.mode==='redukcja'&&num(S.goal)/Math.pow(num(S.cm)/100,2)<20)warn.push('Waga docelowa daje BMI poniżej 20: w badaniach dolna część normy (18,5-20) wiązała się z wyższą śmiertelnością niż BMI 20-25.');
  return {err,warn,first}}
function dataHtml(){const c=dataCheck(),ok=S.guide&&S.guide.dataOk,w=c.warn.map(x=>`<div class="note warn">${x}</div>`).join(''),btn='<p><button class="btn" data-datasave="1">Zapisz i sprawdź</button></p>';
  if(c.err.length)return `<div class="note warn"><b>Do poprawy:</b> ${c.err.join(' ')}</div>`+btn;
  if(!ok)return '<p class="small muted">Sprawdź, czy to Twoje wartości, a nie przykładowe, i naciśnij Zapisz i sprawdź.</p>'+w+btn;
  return `<div class="note">✓ Dane zapisane: ${fmt1(num(S.kg))} kg, ${fmt(num(S.cm))} cm, wiek ${fmt(num(S.age))}, cel ${fmt1(num(S.goal))} kg.</div>`+w+nextHtml('set')}
function nextHtml(cur){const g=guideActive()?guideSteps().find(x=>!x.done):null,lc=x=>x.charAt(0).toLowerCase()+x.slice(1);let a='tab',v='day',t='Przejdź do Mojego dnia';
  if(g){if(cur==='set'&&g.id==='data'){a='goto';v='dane';t='Dalej: sprawdź i zapisz dane na górze'}else if(cur==='set'&&g.id==='pet'){a='goto';v='towarzysz';t='Dalej: wybierz towarzysza niżej'}else if(!(g.act==='tab'&&g.arg===cur)){a=g.act==='nav'?'nav':'tab';v=g.act==='goto'?'day':g.arg;t='Dalej: '+lc(g.label)}}
  else if(cur==='day')return '';
  return `<p class="nextbar"><button class="btn" data-${a}="${v}">${t}</button></p>`}
function renderSet(){
  const bmi=kg()/Math.pow((num(S.cm)||165)/100,2);
  let h='<h2 id="dane">Twoje dane</h2><div class="panel">'+rwHtml('pf',['kg','cm','age','goal'])+RW_TIP+'</div>'+goalWayHtml()+bmiSetHtml();
  h+=seg([['K','Kobieta'],['M','Mężczyzna']],S.sex,'sex','','Płeć')+dataHtml();
  h+='<h2 id="wpisy">Wpisy</h2>'+seg([['prosty','Prosty'],['skup','Skupienie'],['cala','Cała Miara']],S.focus?'skup':S.lite?'prosty':'cala','view','','Mój dzień')+'<p class="small muted">Skupienie pokazuje jedną rzecz naraz, bez wskazówek i ruchu; dane zostają przy każdym widoku.</p>';
  h+=`<div class="panel"><div class="field"><label for="still">Bez ruchu</label><input type="checkbox" class="switch" id="still" data-k="still" ${S.still?'checked':''}></div></div><p class="small muted">Bez animacji w całej Miarze, a w Skupieniu zawsze.</p>`;
  h+='<h2 id="komunikaty">Komunikaty</h2>'+seg([['std','Zwykły czas'],['long','Dłużej'],['stay','Do zamknięcia']],S.toastLen||'std','toastlen','','Czas wyświetlania komunikatów')+'<p class="small muted">Jak długo widać dymek po zapisie.</p>';
  h+=`<div class="panel"><div class="field"><label for="discreet">Tryb dyskretny: karty o migrenie i antykoncepcji tylko w Zdrowiu</label><input type="checkbox" class="switch" id="discreet" data-k="discreet" ${S.discreet?'checked':''}></div></div>`;
  h+=`<div class="panel"><div class="field"><label for="pmLeft">Przyciski − i + po lewej</label><input type="checkbox" class="switch" id="pmLeft" data-k="pmLeft" ${S.pmLeft?'checked':''}></div>${typeof navigator!=='undefined'&&typeof navigator.vibrate==='function'?`<div class="field"><label for="vibr">Wibracja po zapisie</label><input type="checkbox" class="switch" id="vibr" data-k="vibr" ${S.vibr!==false?'checked':''}></div>`:''}</div>`;
  h+='<h2 id="towarzysz">Towarzysz</h2>'+petPickHtml()+(S.pet?`<div class="panel"><div class="field"><label for="body">Sylwetka z pomiarów na ekranie zwierzaka</label><input type="checkbox" class="switch" id="body" data-k="body" ${S.body?'checked':''}></div></div>`:'');
  h+='<h2 id="tryb">Tryb</h2>'+whyP('tryb')+seg([['redukcja','Redukcja'],['utrzymanie','Utrzymanie'],['masa','Przyrost masy']],S.mode,'mode','','Tryb')+modePropHtml();
  h+=`<div class="panel"><div class="field"><label for="korekta">Korekta na spoczynkowe zużycie energii</label><input type="checkbox" class="switch" id="korekta" data-k="korekta" ${S.korekta?'checked':''}></div>
${S.sex==='K'?`<div class="field"><label for="lip">Śledź objawy nóg (lipodemia)</label><input type="checkbox" class="switch" id="lip" data-k="lip" ${S.lip?'checked':''}></div>`:''}</div>
  <p class="small muted">Korekta liczy spoczynek w kaloriach z treningu ze wzoru dla Twojej płci, wieku i wagi.</p>${whyFold('korekta','<p>Korekta liczy spoczynek wzorem Mifflina-St Jeora zamiast stałego 1 kcal na kg na godzinę. Dla kobiet zwykle daje niższe wyniki (wniosek z definicji MET, niesprawdzony pomiarem).</p>')}
  <div class="note">${wskTxt()} Spoczynkowe zużycie energii ok. ${fmt(rmr())} kcal na dobę.</div>
  ${ekranHtml()}
  ${bkHtml()}
  <h2>Fitatu</h2><p class="small">Składniki z gramaturą kopiujesz w karcie posiłku i wpisujesz w Fitatu.</p>${whyFold('fitatu','<p>Bezpośredniego połączenia nie ma. Fitatu wymienia dane przez Apple Zdrowie, a strona otwarta w przeglądarce nie ma do niego dostępu. Najprostsza droga: posiłek wybierasz tutaj, w karcie posiłku kopiujesz składniki z gramaturą i wpisujesz je w Fitatu. Treningi z zegarka lub telefonu Fitatu pobiera samo.</p>')}
  <h2>Źródła</h2><p class="small">Skąd Miara bierze wydatek energii i wartości odżywcze.</p>${whyFold('zrodla',`<ol class="src">
  <li><a href="https://pacompendium.com/wp-content/uploads/2024/01/2024-adult-compendium_1_2024.pdf" target="_blank" rel="noopener">2024 Adult Compendium of Physical Activities</a>: siłownia, spinning, joga, obwód.</li>
  <li><a href="https://fitmum.ku.dk/2011_Compendium_of_Physical_Activities.pdf" target="_blank" rel="noopener">2011 Compendium of Physical Activities</a>: ergometr wioślarski. Pływanie, nordic walking i orbitrek z wiedzy ogólnej, niesprawdzone.</li>
  <li>Równania metaboliczne ACSM dla marszu i biegu, wzór Mifflina-St Jeora, sprawność brutto jazdy na rowerze ok. 20%: wiedza ogólna, niesprawdzone w tej aplikacji ze źródłem.</li>
  <li>Wartości odżywcze: typowe wartości z tabel składu, orientacyjne.</li></ol>`)}
  ${nextHtml('set')}<p><button class="btn ghost" data-intro="1">Pokaż wprowadzenie</button></p><p><button class="btn ghost" data-tipsreset="1">Pokaż wskazówki ponownie</button></p><p><button class="btn ghost" data-reset="1">Przywróć ustawienia domyślne</button></p>`;
  document.getElementById('main').innerHTML=h;
}

// ---------- Przewodnik „Co chcesz zrobić?”: każde zadanie przenosi na ekran i podświetla miejsce ----------
// „Po co”: ta sama treść pod nagłówkiem sekcji i w Pomocy („Co to znaczy?”)
const GLOSS=[
  ['jesli','Plan „jeśli…, to…”','Zdanie, które z góry łączy sytuację z działaniem, np. „Jeśli wracam po 18, to najpierw jem danie z listy”. Takie plany pomagają osiągać cele (metaanaliza 94 badań). Wybierasz go jednym dotknięciem w kroku tygodnia.','krok','gollw'],
  ['bialko','Białko za złotówkę','Porównujesz, z którego produktu białko wychodzi najtaniej: koszt 20 g białka, mniej więcej tyle, ile ma 100 g piersi z kurczaka. Ranking pokaże najtańsze źródła na zakupy.','health#bialko'],
  ['makro','Makro na porcję','Zawęża listę dań do tych, które pasują do Twojego dnia: co najmniej tyle białka, najwyżej tyle kalorii i węglowodanów na porcję. Wielkość porcji przelicza gramatury.','meals#makro#filtry'],
  ['podtrening','Pod trening','W dni z treningiem zwiększa porcję kaszy, ryżu, ziemniaków, pieczywa i płatków, żeby ciało miało z czego się regenerować. Auto bierze trening zapisany dziś.','meals#podtrening#filtry'],
  ['stan','Stan dziś','Jedno spojrzenie na wagę, jedzenie, sen i ruch. Przy każdej wartości widać, z ilu danych pochodzi.','day#stan'],
  ['karty','Co się dzieje','Karty z Twoich danych: co się zmieniło, dlaczego i co z tym zrobić. Każda podaje, na czym się opiera. Wszystkie są w Zdrowiu.','health'],
  ['netto','kcal netto','Kalorie z treningu ponad to, co ciało spaliłoby w tym czasie w spoczynku. Tylko ta część trafia do bilansu dnia.','train'],
  ['nawyki','Nawyki i punkty','Codzienne małe działania z punktami dla zwierzaka. Punkty nie zależą od wagi ani kalorii.','day#fold_nawyki#wiecej,nawyki'],
  ['prognoza','Prognoza i Twój priorytet','Kiedy dojdziesz do celu przy obecnym tempie i która jedna zmiana da teraz najwięcej.','day#fold_prognoza#wiecej,prognoza'],
  ['wplyw','Mój wpływ','Dokąd prowadzą Twoje wybory: średni bilans z zapisanych dni przeliczony na tempo zmiany wagi.','impact'],
  ['ochoty','Twoje ochoty','Podsumowanie zapisanych ochot na przekąskę. Pomaga zauważyć, kiedy przychodzą najczęściej, i zaplanować coś wcześniej.','sos#ochoty'],
  ['tryb','Tryb: redukcja, utrzymanie albo przyrost masy','Redukcja: cel kalorii ok. 20% poniżej zapotrzebowania. Utrzymanie: cel równy zapotrzebowaniu. Przyrost masy: ok. 10% powyżej, 0,25-0,5% masy ciała tygodniowo. Miara proponuje tryb z Twoich danych.','set#tryb',['iraki','issn']],
  ['korekta','Korekta na spoczynkowe zużycie energii','Dokładniejsze kalorie z treningu: spoczynek liczony ze wzoru dla Twojej płci, wieku i wagi zamiast przybliżenia 1 kcal na kg na godzinę.','set#korekta'],
  ['zamowione','Zamówione','Zapis dania z dostawy lub restauracji: wybierz danie, ilość i dodatki, a Miara poda kalorie i białko z przedziałem ±30%. Regularny zapis liczy się bardziej niż dokładność.','meals#zamowione','fdcMaki'],
  ['oznaczenia','Oznaczenia przepisów','Słodkie: danie na słodko lub słodycz z owoców. Przy IO (reguła Miary): porcja co najmniej 20 g białka i do 50 g węglowodanów, przekąska do 20 g.','meals#oznaczenia'],
  ['cykl','Tydzień cyklu dziś','Tydzień cyklu albo opakowania; „Przerwa w tabletkach” to dni bez hormonów. ICHD-3: napady od 2 dni przed do 3. dnia miesiączki w 2 z 3 cykli.','day#cykl','mm'],
  ['profil','Mój profil zdrowia','Zaznacz choroby i tabletki, a Miara ułoży plan działań z Twoich wpisów i zaleceń. Profil zostaje w tym telefonie; kopia bez danych zdrowotnych go pomija.','health#profil'],
  ['dyskretny','Tryb dyskretny','Karty o migrenie i antykoncepcji pokazują się tylko w Zdrowiu, nie na ekranie Mój dzień.','set#discreet']];
// „Dlaczego?” (rada 11.11.2026, działania 6-7): pod wyborem jedno zdanie, dłuższe wyjaśnienie i źródła w zwiniętej sekcji (stan otwarcia w OPEN_F)
function whyFold(id,inner,topic){return inner?`<details class="fold" data-fold="why_${id}"${OPEN_F.has('why_'+id)?' open':''}><summary aria-label="Dlaczego: ${esc(topic||WHY_T[id]||id)}">Dlaczego?</summary><div class="panel" style="padding:4px 16px 12px">${inner}</div></details>`:''}
// Krótsze „Po co” tam, gdzie pierwsze zdanie opisu nie mówi całości; pełny opis zostaje w „Dlaczego?”
// Temat „Dlaczego?” dla czytnika ekranu tam, gdzie nie wynika z hasła słowniczka (GLOSS)
const WHY_T={mobczest:'częstość i czas ćwiczeń mobilności',mobzrodla:'źródła ćwiczeń mobilności',bmicel:'cel BMI',bmicut:'progi BMI',korekta:'korekta na spoczynek',fitatu:'kopiowanie składników',zrodla:'źródła'};
const WHY_SHORT={tryb:'Tryb ustala, czy cel kalorii jest poniżej zapotrzebowania, równy mu czy powyżej.',oznaczenia:'Słodkie to danie na słodko, Przy IO to porcja według reguły Miary dla insulinooporności.'};
function whyP(id){const g=GLOSS.find(x=>x[0]===id);if(!g)return '';const t=g[2],m=t.match(/^(.+?[.!?])\s+(?=[A-ZĄĆĘŁŃÓŚŹŻ])/),own=WHY_SHORT[id],first=own||(m?m[1]:t),rest=own?t:m?t.slice(m[0].length):'';
  return `<p class="why"><b>Po co:</b> ${first}</p>`+whyFold(id,(rest?`<p>${rest}</p>`:'')+(g[4]?srcHtml(g[4]):''),g[1])}
const HELP=[
  ['Posiłki','Zapisać zjedzony posiłek','W planie dnia naciśnij Zjem przy daniu.','meals#plan'],
  ['Posiłki','Wybrać, co gotuję dziś','Otwórz przepis i naciśnij Gotuję to dziś. Wieczorem Według planu zapisze to danie.','meals#plan'],
  ['Posiłki','Znaleźć szybkie danie albo większe na weekend','Nad listą dań wybierz Na co dzień albo Na weekend.','meals#rytm'],
  ['Mój dzień','Sprawdzić, co mi utrudnia, i dostać krok na tydzień','Krok po kroku: 5 pytań, potem jeden krok na tydzień z postępem z Twoich zapisów.','krok'],
  ['Ustawienia','Dodać Miarę do ekranu głównego','Ikona na ekranie głównym. iPhone: Safari, Udostępnij, Do ekranu głównego. Android: Chrome, Więcej, Zainstaluj i utwórz skrót.','set#ekran'],
  ['Mój dzień','Pobierać wagę, kroki i sen z Apple Zdrowie','Skrót w aplikacji Skróty pobiera dane i otwiera Miarę; zapisujesz jednym przyciskiem.','help#skrot'],
  ['Posiłki','Zapisać jedzenie z dostawy','Zamówione: danie, ilość, dodatki i jeden przycisk.','meals#zamowione'],
  ['Posiłki','Zrobić zakupy na tydzień','Lista zakupów z planu jest pod planem dnia.','meals#zakupy'],
  ['Mój dzień','Wpisać wagę','Pomiary dnia, karta Dziś: waga zaczyna od ostatniego ważenia, − i + zmieniają o 0,1 kg.','day#m_w'],
  ['Mój dzień','Wpisać sen i kroki','Pomiary dnia, karta Dziś: suwak albo dotknij liczby i przepisz z zegarka lub telefonu.','day#m_sleep'],
  ['Mój dzień','Zapisać ból głowy','Naciśnij Boli mnie głowa, potem zaznacz aurę i lek.','day#painrow'],
  ['Mój dzień','Zapisać obwody','Co 2 tygodnie: talia, biodra, udo.','day#m_waist#obwody'],
  ['Mój dzień','Poradzić sobie z ochotą na przekąskę','10 minut z podpowiedziami, bez oceniania.','sos'],
  ['Trening','Dodać trening z zegarka','Czas wybierzesz jednym dotknięciem, kalorie przepisz z zegarka.','train#f_tr.wmin'],
  ['Zdrowie','Przygotować listę na wizytę','Objawy i pytania do skopiowania dla lekarza.','visit'],
  ['Ustawienia','Zmienić wagę, wzrost, wiek albo cel','Twoje dane. Na końcu naciśnij Zapisz i sprawdź.','set#dane'],
  ['Ustawienia','Wpisywać raz dziennie','Jeden wieczorny wpis zamiast kilku w ciągu dnia.','set#wpisy'],
  ['Ustawienia','Ustawić, jak długo widać komunikaty','Zwykle, dłużej albo do zamknięcia.','set#komunikaty'],
  ['Ustawienia','Zrobić kopię danych','Plik kopii albo zaszyfrowana kopia.','set#kopia']];
// Pomoc z wyszukiwaniem (NN/g: pomoc „easy to search”): słowa bez polskich znaków, każde słowo musi wystąpić
const fold0=t=>String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l');
const hStep=(lab,how,attr,btn)=>`<div class="step"><span class="lab">${lab}<small class="hint">${how}</small></span><button class="btn small ghost" ${attr}>${btn}</button></div>`;
const hNav=to=>`data-${to.includes('#')?'nav':'tab'}="${to}"`;
function helpRes(q){const w=fold0(q||'').split(/\s+/).filter(x=>x.length>1),hit=(...t)=>{const x=fold0(t.join(' '));return w.every(v=>x.includes(v))};
  const H=HELP.filter(x=>hit(x[0],x[1],x[2])),G=GLOSS.filter(x=>hit(x[1],x[2])),C=Object.entries(SCEN).filter(([,x])=>hit(x.t,x.chk));
  if(w.length&&!H.length&&!G.length&&!C.length)return '<p>Nic nie znaleziono. Spróbuj innego słowa albo zacznij od najczęstszych zadań:</p><div class="panel" style="padding:0 16px">'+HELP.slice(0,3).map(([,lab,how,to])=>hStep(lab,how,hNav(to),'Pokaż')).join('')+'</div>';
  let h='',g='';
  if(H.length){h+='<h2>Co chcesz zrobić?</h2><p class="small muted">Naciśnij Pokaż: Miara przeniesie Cię na właściwy ekran i podświetli miejsce.</p>';H.forEach(([grp,lab,how,to])=>{if(grp!==g){h+=(g?'</div>':'')+`<h3 class="rh">${grp}</h3><div class="panel" style="padding:0 16px">`;g=grp}h+=hStep(lab,how,hNav(to),'Pokaż')});h+='</div>'}
  if(G.length)h+='<h2>Co to znaczy?</h2><div class="panel" style="padding:0 16px">'+G.map(([,t,x,to])=>hStep(t,x,hNav(to),'Pokaż')).join('')+'</div>';
  if(C.length)h+='<h2>Sprawdź działanie</h2><p class="small muted">Dane przykładowe: nic się nie zapisuje, Twoje dane zostają. Wyjdź wraca do nich.</p><div class="panel" style="padding:0 16px">'+C.map(([n,x])=>hStep(x.t,x.chk,`data-scen="${n}"`,'Otwórz')).join('')+'</div>';
  return h}
function renderHelp(){let h=`<div class="panel" style="padding:4px 16px"><div class="field"><label for="help_q">Szukaj w Pomocy</label><input type="search" id="help_q" style="width:180px;text-align:left" placeholder="np. białko, sen" value="${esc(S.helpQ||'')}"></div></div><div id="helpres">${helpRes(S.helpQ)}</div>`;
  h+=skrotHelpHtml()+'<h2>Od początku</h2><p><button class="btn ghost" data-guideshow="1">Pokaż pierwsze kroki</button></p><p><button class="btn ghost" data-tipsreset="1">Pokaż wskazówki ponownie</button></p><p><button class="btn ghost" data-intro="1">Pokaż wprowadzenie</button></p>';
  document.getElementById('main').innerHTML=h}
// Kafelki wyboru: napis w .lbl z niewidoczną pogrubioną kopią (::after, data-t), więc zaznaczenie nie zmienia zawijania ani wysokości kafelka.
// Wołane na końcu render() i częściowych przerysowań (lista posiłków), bez obserwatora całego dokumentu.
function tileLabels(root){if(!root||typeof root.querySelectorAll!=='function')return;for(const b of root.querySelectorAll('.chip:not(.rec .chip),.seg button')){if(b.firstElementChild&&b.firstElementChild.classList.contains('lbl')&&b.firstElementChild.dataset.t===b.textContent)continue;
  const old=b.querySelector(':scope>.lbl');if(old)old.replaceWith(...old.firstElementChild.childNodes);const l=document.createElement('span'),i=document.createElement('span');l.className='lbl';l.dataset.t=b.textContent;i.append(...b.childNodes);l.append(i);b.append(l)}tileFit(root)}
// Najdłuższe słowo musi zmieścić się w kafelku (przeglądarki nie dzielą polskich wyrazów): wtedy mniej kolumn, słowo nie pęka w środku
function tileFit(root){if(!root||typeof root.querySelectorAll!=='function'||typeof getComputedStyle!=='function')return;const cv=tileFit.cv||(tileFit.cv=document.createElement('canvas')),cx=cv.getContext&&cv.getContext('2d');if(!cx)return;
  for(const g of root.querySelectorAll('.chips,.seg')){if(g.closest('.rec'))continue;if(g.dataset.fit){g.style.removeProperty('--cols');delete g.dataset.fit}const kids=[...g.children],w=g.clientWidth;if(!w||!kids.length)continue;
    const t0=Math.round(kids[0].getBoundingClientRect().top),cols=kids.filter(x=>Math.round(x.getBoundingClientRect().top)===t0).length;if(cols<2)continue;
    const cs=getComputedStyle(kids[0]),pad=parseFloat(cs.paddingLeft)+parseFloat(cs.paddingRight)+parseFloat(cs.borderLeftWidth)+parseFloat(cs.borderRightWidth),inner=kids[0].getBoundingClientRect().width-pad,gap=parseFloat(getComputedStyle(g).columnGap)||8;
    cx.font='700 '+cs.fontSize+' '+cs.fontFamily;let mw=0;for(const x of kids)for(const word of x.textContent.split(/\s+/))if(word)mw=Math.max(mw,cx.measureText(word).width);
    if(mw<=inner+0.5)continue;const nc=Math.max(1,Math.floor((w+gap)/(mw+pad+1+gap)));if(nc<cols){g.style.setProperty('--cols',String(nc));g.dataset.fit='1'}}}
// Po załadowaniu czcionek szerokość słów jest inna: kolumny kafelków liczone ponownie
if(typeof document!=='undefined'&&document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>tileFit(document.getElementById('main'))).catch(()=>{});
if(typeof window!=='undefined'&&window.addEventListener){window.addEventListener('resize',()=>tileFit(document.getElementById('main')));document.addEventListener('toggle',()=>tileFit(document.getElementById('main')),true)}
function render(){if(S.tab!=='day'){LITE_UI.focus='';LITE_UI.say=''}if(S.tab!=='labs')LAB_KEEP=null;if(typeof document!=='undefined'&&document.documentElement&&document.documentElement.dataset){document.documentElement.dataset.pm=S.pmLeft?'l':'r';document.documentElement.dataset.still=(S.still||S.focus)?'1':''}if(S.focus&&typeof PET!=='undefined'&&PET.drop)PET.drop();startSync();renderTabs();{const sh=document.getElementById('sheet');if(sh)sh.innerHTML=SHEET?sheetHtml():DOP?dopHtml():TODAY?todayHtml():'';const db=document.getElementById('dbar');if(db){const bh=barHtml();db.innerHTML=bh;if(document.body&&document.body.classList)document.body.classList.toggle('hasbar',!!bh);navH()}}({help:renderHelp,meals:renderMeals,train:renderTrain,day:renderDay,set:renderSet,sos:renderSos,health:renderHealth,labs:renderLabs,visit:renderVisit,intro:renderIntro,review:renderReview,krok:renderKrok,import:renderImport,recipe:renderRecipe,knee:renderKnee,mob:renderMob,impact:renderImpact,challenge:renderChallenge,pet:renderPet}[S.tab]||renderDay)();{const t=tipHtml(S.tab),el=document.getElementById('main');if(t)el.innerHTML=t+el.innerHTML}if(DEMO)document.getElementById('main').insertAdjacentHTML('afterbegin','<div class="note demo"><span>'+(DEMO_N?`<b>Scenariusz: ${SCEN[DEMO_N].t}.</b> Sprawdź: ${SCEN[DEMO_N].chk} Nic się nie zapisuje.`:'<b>Tryb pokazowy, dane przykładowe.</b> Zmiany się nie zapisują.')+'</span><button class="btn ghost small" data-demoexit="1">Wyjdź</button></div>');if(S.focus){const mt=skupMain(S.tab);if(mt)SKUP.fold(document.getElementById('main'),mt,'skupmore-'+S.tab,OPEN_F.has('skupmore-'+S.tab),'Więcej na tym ekranie')}if(typeof WPISY!=='undefined')WPISY.mount(document.getElementById('main'),{done:id=>{save();renderKeep((id&&document.getElementById(id))||document.activeElement);liteAfter()},say:t=>{const sr=document.getElementById('sr');if(sr)sr.textContent=t}});tileLabels(document.getElementById('main'));tileLabels(document.getElementById('sheet'));PET.flush()}
// Komunikat: czas z długości tekstu, 3-12 s, wydłużany albo wyłączany w Ustawieniach (WCAG 2.2.1); zawsze z zamknięciem.
// Drugi argument: liczba (najkrótszy czas w ms) albo {act,arg,label} (przycisk przejścia), {focus} (pole do pokazania)
function toastMs(t){const m={std:1,long:2,stay:0}[S.toastLen];return (m==null?1:m)*Math.min(12000,Math.max(3000,1500+String(t).length*60))}
function toastHide(){const el=document.getElementById('toast');clearTimeout(toast._t);el.classList.remove('show')}
function toast(t,o){const el=document.getElementById('toast'),a=o&&typeof o==='object'&&o.act?o:null;
  el.innerHTML=`<span class="tmsg">${esc(t)}</span><button class="tclose" data-toastclose="1" aria-label="Zamknij komunikat">×</button>`+(a?`<button class="btn small" data-${a.act}="${esc(a.arg)}">${esc(a.label)}</button>`:'');
  el.classList.add('show');clearTimeout(toast._t);const ms=toastMs(t);if(ms)toast._t=setTimeout(()=>el.classList.remove('show'),Math.max(ms,typeof o==='number'?o:0,(a&&a.ms)||0));
  if(o&&o.focus){const f=document.getElementById(o.focus);if(f&&f.scrollIntoView)f.scrollIntoView({behavior:'smooth',block:'center'});if(f&&f.focus)f.focus({preventScroll:true})}}
// Cofanie: każde usunięcie danych jednym dotknięciem zapisuje stan sprzed zmiany i pokazuje „Cofnij” (test strażnika w smoke.js)
let UNDO=null;
function undoable(msg){UNDO=JSON.stringify(S);toast(msg,{act:'undo',arg:'1',label:'Cofnij',ms:8000})}
function setPath(p,v){const a=p.split('.');let o=S;for(let i=0;i<a.length-1;i++)o=o[a[i]];o[a[a.length-1]]=v}

// ---------- Zdarzenia ----------
// ---------- Szybkie wpisy z każdego ekranu (11.11.2026) ----------
// A: arkusz „Dodaj wpis” z paska; B: liczba braków z listy Dziś na zakładce; C: powtórz wczoraj; D: skróty ikony (#dodaj-…)
let SHEET=false,QUICK_PENDING=false,QUICK_ID='';
// Z13: gest i przycisk Wstecz systemu zamykają arkusz zamiast opuścić aplikację; wpis w historii istnieje tylko, gdy arkusz jest otwarty
let SHEET_H=false;
function sheetPush(){if(SHEET_H||typeof history==='undefined'||!history.pushState)return;try{history.pushState({miaraSheet:1},'');SHEET_H=true}catch(_){}}
function sheetPop(){if(!SHEET_H)return;SHEET_H=false;try{if(history.state&&history.state.miaraSheet)history.back()}catch(_){}}
if(typeof window!=='undefined'&&window.addEventListener)window.addEventListener('popstate',()=>{if(!SHEET_H)return;SHEET_H=false;if(SHEET){SHEET=false;render();addFocus()}else if(typeof DOP!=='undefined'&&DOP){const id=DOP.id;DOP=null;render();dopFocus(`[data-dop="${id}"]`)}else if(typeof TODAY!=='undefined'&&TODAY){TODAY=false;render();dopFocus('#dbar [data-today]')}});
function dayLeft(){if(S.lite)return liteFull(todayKey())||painAt(todayKey())?0:1;if(S.once||painAt(todayKey()))return 0;const k=todayKey(),m=(S.meas||{})[k]||{},d=day();
  return [num(m.w)>0,d.filter(e=>e.kind==='m').length>=3,d.some(e=>e.kind==='t')||num(m.steps)>0].filter(x=>!x).length}
function yMeals(){return ((S.days||{})[nAgo(1)]||[]).filter(e=>e.kind==='m')}
function repeatHtml(){const y=yMeals();return y.length&&!day().some(e=>e.kind==='m')?`<p><button class="btn ghost" data-repeat="1">Powtórz wczorajsze posiłki (${y.length})</button></p>`:''}
function sheetHtml(){const gut=!!((S.prof||{}).cond||{}).gut,y=yMeals(),it=(a,t,h)=>`<button class="opt" ${a}><span class="txt">${t}</span>${h?`<span class="small muted">${h}</span>`:''}</button>`;
  const un=S.unlock||[],lt=!!S.lite;
  const L=[lt?it('data-nav="day#lite"','Szybki wpis dnia'):'',!lt||un.includes('waga')?it('data-nav="day#m_w"','Waga',lastMeas('w',todayKey())?'ostatnio '+lastMeas('w',todayKey())+' kg':''):'',!lt||un.includes('sen')?it('data-nav="day#m_sleep"','Sen'):'',lt?'':it('data-nav="day#m_steps"','Kroki'),
    it('data-tab="meals"','Posiłek'),y.length?it('data-repeat="1"',`Powtórz wczorajsze posiłki (${y.length})`):'',it('data-tab="train"','Trening'),
    painAt(todayKey())?'':it('data-pain="today"','Boli mnie głowa','zapis jednym dotknięciem'),gut&&!lt?it('data-nav="day#fold_brzuch#brzuch"','Brzuch dziś'):''];
  return `<button class="sheetbg" data-sheetclose="1" aria-label="Zamknij" tabindex="-1"></button><div class="sheetbox" role="dialog" aria-modal="true" aria-labelledby="sheet_t"><h2 id="sheet_t">Dodaj wpis</h2><div class="panel">${L.join('')}</div><p><button class="btn ghost" data-sheetclose="1">Zamknij</button></p></div>`}
// Arkusz „Dopasuj danie” (P1): DOP = {id, a: mnożniki albo null (przepis), keep: zapis jako Twoja wersja, t: zaznaczone kafelki}
let DOP=null;
const DOP_M={p:['Białko','mB'],c:['Węglowodany','mW'],f:['Tłuszcz','mT']};
function dopCtx(){const m=MEALS.find(x=>x.id===DOP.id),cm=carbMult(),por=num(S.f.portion)||1;return {m,cm,por,x:macros(m,cm,por,DOP.a),o:macros(m,cm,por)}}
function dopDelta(a,b){const d=Math.round(a)-Math.round(b);return d?` <span class="dopd">${d>0?'+':'−'}${fmt(Math.abs(d))}</span>`:''}
function dopLeft(x){const e=eatenToday(),g=targetKcal(),l=g-e-x.k;return l>=0?`zostanie ${fmt(l)} kcal`:`razem ${fmt(e+x.k)} z ${fmt(g)} kcal`}
function dopSum(c){return `<p class="dopk"><b>${fmt(c.x.k)}</b> kcal${dopDelta(c.x.k,c.o.k)} <span class="small muted">· ${dopLeft(c.x)}</span></p>${macChips(c.x)}`}
function dopSaveTxt(){return DOP.keep?'Zapisz moją wersję':'Zapisz na dziś'}
function dopRange(c,id){const b=dopBase(c.m,id,c.cm,c.por),s=dopStep(b);return {b,s,lo:Math.ceil(b*0.5/s)*s,hi:Math.floor(b*2/s)*s,g:Math.round(b*((DOP.a&&DOP.a[id])||1))}}
function dopChanged(c){return c.m.ing.filter(x=>Math.abs(((DOP.a||{})[x[0]]||1)-1)>1e-9).length}
function dopHtml(){const c=dopCtx(),L=dopLevers(c.m),T=[['p','Więcej białka','+10 g białka'],['c','Mniej węglowodanów','−15 g węglowodanów'],['l','Lżej','ok. −100 kcal']];
  const mac=['p','c','f'].filter(k=>L[k]).map(k=>{const id=L[k],r=dopRange(c,id);return `<div class="dopsl"><div class="doptop2"><span><span class="mc" style="--c:var(--${DOP_M[k][1]})">${DOP_M[k][0]}</span><small>przez: ${esc(ING[id].n.toLowerCase())}</small></span><b id="dop_v${k}">${fmt(c.x[k])} g${dopDelta(c.x[k],c.o[k])}</b></div>`
    +`<input type="range" data-dopsl="a" data-m="${k}" data-i="${id}" min="${r.lo}" max="${r.hi}" step="${r.s}" value="${r.g}" aria-label="${DOP_M[k][0]}, przez: ${esc(ING[id].n)}" aria-valuetext="${fmt(c.x[k])} g"></div>`}).join('');
  const ing=c.m.ing.map(([id])=>{const r=dopRange(c,id),ch=r.g!==Math.round(r.b);return `<div class="dopsl${ch?' ch':''}" id="dop_r_${id}"><div class="doptop2"><span>${esc(ING[id].n)}<small>z przepisu ${fmt(r.b)} g</small></span><b id="dop_g_${id}">${fmt(r.g)} g${dopDelta(r.g,r.b)}</b></div>`
    +`<input type="range" data-dopsl="c" data-i="${id}" min="${r.lo}" max="${r.hi}" step="${r.s}" value="${r.g}" aria-label="${esc(ING[id].n)}" aria-valuetext="${fmt(r.g)} gramów"></div>`}).join('');
  const n=dopChanged(c);
  return `<button class="sheetbg" data-dopclose="1" aria-label="Zamknij" tabindex="-1"></button><div class="sheetbox dopbox" role="dialog" aria-modal="true" aria-labelledby="dop_t">`
    +`<div class="doptop"><div class="dophd"><h2 id="dop_t" tabindex="-1">Dopasuj danie</h2><button class="btn ghost dopx" data-dopclose="1" aria-label="Zamknij">×</button></div><p class="small muted dopn">${esc(c.m.n)}</p>`
    +`<div id="dop_sum">${dopSum(c)}</div><div class="field dopscope"><label for="dop_keep" id="dop_kl">Zapamiętaj dla tego dania</label><input type="checkbox" class="switch" role="switch" id="dop_keep" data-dopkeep="1" aria-checked="${DOP.keep}"${DOP.keep?' checked':''}></div>`
    +`<button class="btn" data-dopsave="1" id="dop_save">${dopSaveTxt()}</button></div>`
    +`<div class="doptiles">${T.map(t=>`<button class="doptile${DOP.t[t[0]]?' on':''}" data-doptile="${t[0]}" aria-pressed="${!!DOP.t[t[0]]}"><span>${t[1]}</span><small>${t[2]}</small></button>`).join('')}<button class="doptile" data-dopreset="1"><span>Jak w przepisie</span><small>bez zmian</small></button></div>`
    +`<h3 class="dopsh">Makro</h3>${mac}<details class="fold dopfold"><summary id="dop_ings">Składniki (${n?'zmienione: '+n:'bez zmian'})</summary>${ing}</details></div>`}
// Przesuwanie suwaka: odświeżane tylko liczby, bez przerysowania arkusza (suwak zostaje pod palcem, Z12)
function dopRefresh(){if(!DOP||typeof document.getElementById!=='function')return;const c=dopCtx(),q=id=>document.getElementById(id);
  const sm=q('dop_sum');if(sm)sm.innerHTML=dopSum(c);
  ['p','c','f'].forEach(k=>{const e=q('dop_v'+k);if(e)e.innerHTML=`${fmt(c.x[k])} g${dopDelta(c.x[k],c.o[k])}`});
  document.querySelectorAll('#sheet input[data-dopsl]').forEach(i=>{const id=i.dataset.i,r=dopRange(c,id);i.value=r.g;i.setAttribute('aria-valuetext',i.dataset.dopsl==='a'?`${fmt(c.x[i.dataset.m])} g`:`${fmt(r.g)} gramów`)});
  c.m.ing.forEach(([id])=>{const r=dopRange(c,id),e=q('dop_g_'+id),w=q('dop_r_'+id);if(e)e.innerHTML=`${fmt(r.g)} g${dopDelta(r.g,r.b)}`;if(w&&w.classList)w.classList.toggle('ch',r.g!==Math.round(r.b))});
  const n=dopChanged(c),su=q('dop_ings');if(su)su.textContent=`Składniki (${n?'zmienione: '+n:'bez zmian'})`;
  if(typeof document.querySelectorAll==='function')document.querySelectorAll('#sheet [data-doptile]').forEach(x=>{const on=!!DOP.t[x.dataset.doptile];x.setAttribute('aria-pressed',String(on));if(x.classList)x.classList.toggle('on',on)});
  const sv=q('dop_save');if(sv)sv.textContent=dopSaveTxt();const kp=q('dop_keep');if(kp){kp.checked=DOP.keep;kp.setAttribute('aria-checked',String(DOP.keep))}}
// Zmiana w arkuszu: w przeglądarce tylko odświeżenie (Z12), w atrapie testów pełne rysowanie
function dopUpd(){if(typeof document!=='undefined'&&typeof document.getElementById==='function'&&document.getElementById('dop_sum')&&document.getElementById('dop_sum').innerHTML!==undefined&&typeof document.querySelectorAll==='function'&&document.querySelectorAll('#sheet [data-doptile]').length)dopRefresh();else render()}
function dopFromTiles(){const c=dopCtx();let a=null;if(DOP.t.p)a=dopShift(c.m,a,'p',10,c.cm,c.por)||a;if(DOP.t.c)a=dopShift(c.m,a,'c',-15,c.cm,c.por)||a;if(DOP.t.l)a=dopLighter(c.m,a,c.cm,c.por);return a}
function dopOpen(id){S.seenNew=Object.assign({},S.seenNew,{dop:true});save();DOP={id,a:dopOf(id)?Object.assign({},dopOf(id)):null,keep:false,t:{}};sheetPush();render();dopFocus('#dop_t')}
function dopFocus(sel){if(typeof document.querySelector!=='function')return;const e=document.querySelector(sel);if(e&&e.focus)e.focus({preventScroll:true})}
function dopClose(){if(!DOP)return;const id=DOP.id;DOP=null;sheetPop();render();dopFocus(`[data-dop="${id}"]`)}
function dopSave(){const id=DOP.id,a=DOP.a&&Object.keys(DOP.a).some(k=>Math.abs(DOP.a[k]-1)>1e-9)?DOP.a:null,k=todayKey();
  if(DOP.keep){S.ver=S.ver||{};if(a)S.ver[id]=a;else delete S.ver[id];if(S.adj&&S.adj[k])delete S.adj[k][id]}
  else{S.adj=S.adj||{};S.adj[k]=S.adj[k]||{};if(a)S.adj[k][id]=a;else delete S.adj[k][id]}
  save();DOP=null;sheetPop();render();dopFocus(`[data-dop="${id}"]`)}
// Suwaki: krok zależny od prędkości jak w Dziś (WPISY.snapBySpeed); prędkość z czasu zdarzeń input w oknie 150 ms
let DOP_IN=[];
if(typeof document!=='undefined'&&document.addEventListener)document.addEventListener('input',e=>{const t=e.target;if(!DOP||!t||!t.dataset||!t.dataset.dopsl)return;
  const c=dopCtx(),id=t.dataset.i,r=dopRange(c,id),raw=+t.value,now=e.timeStamp||Date.now();DOP_IN.push([now,raw]);while(DOP_IN.length>2&&now-DOP_IN[0][0]>150)DOP_IN.shift();
  const dt=(now-DOP_IN[0][0])/1000,px=(t.getBoundingClientRect?t.getBoundingClientRect().width:1)/((r.hi-r.lo)||1),sp=DOP_IN.length<2?0:dt>0.001?(raw-DOP_IN[0][1])/dt*px:0;
  const g=typeof WPISY!=='undefined'&&WPISY.snapBySpeed?WPISY.snapBySpeed(raw,sp,{step:r.s,coarse:r.s*5,range:[r.lo,r.hi]}):raw;
  DOP.a=Object.assign({},DOP.a,{[id]:g/r.b});DOP.t={};if(typeof document.querySelectorAll==='function')document.querySelectorAll('#sheet [data-doptile]').forEach(x=>{x.setAttribute('aria-pressed','false');x.classList.remove('on')});dopRefresh()});
// ---------- Pasek nad menu (P2, krok 9c; makieta „Pierwsze kroki”, akcent: kreska pod wartością, decyzja 26.11.2026) ----------
// Kcal: K1 „zostaje”, dotknięcie pokazuje K2 „zjedzone/cel”, po przekroczeniu celu K2 sam. Makra B/T/W/Bł: kreska 2 px pod wartością, długość = część celu.
// Cele: białko z protTarget(), błonnik 25 g (EFSA), tłuszcz i węglowodany względem planu dnia (brak źródła celów dziennych, plan §12.1).
let BAR_K2=false,TODAY=false;
const DUMB='<svg class="dbic" viewBox="0 0 12 12" aria-hidden="true"><path d="M1.5 4.5v3M3.5 3v6M8.5 3v6M10.5 4.5v3M3.5 6h5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
// Dodatek do celu kcal po dzisiejszym treningu (część targetKcal z trainNet); przy zmierzonym wydatku z wagi 0
function trainPlus(){if(measuredTdee())return 0;const R=rmr(),f=S.mode==='utrzymanie'?1:S.mode==='masa'?1.1:0.8;return Math.max(0,targetKcal()-Math.max(R,R*1.3*f))}
function dayEat(){return day().filter(e=>e.kind==='m').reduce((a,e)=>({k:a.k+(e.k||0),p:a.p+(e.p||0),f:a.f+(e.f||0),c:a.c+(e.c||0),b:a.b+(e.fib||0)}),{k:0,p:0,f:0,c:0,b:0})}
function dayGoals(){const cm=carbMult(),por=num(S.f.portion)||1,pk=planIds().map(id=>macros(MEALS.find(m=>m.id===id),cm,por,dopOf(id)));
  return {k:targetKcal(),plus:trainPlus(),p:protTarget(),f:pk.reduce((a,x)=>a+x.f,0),c:pk.reduce((a,x)=>a+x.c,0),b:25}}
function barHtml(){if(!['day','meals'].includes(S.tab)||S.lite)return '';
  const G=dayGoals(),E=dayEat(),g=Math.round(G.k),e=Math.round(E.k),over=e>g,left=g-e,k2=over||BAR_K2,plus=Math.round(G.plus),sn=S.seenNew||{},NW='<span class="nowe dbnew" aria-hidden="true">NOWE</span>';
  const pct=(a,b)=>b>0?Math.max(0,Math.min(100,a/b*100)):0,ln=x=>`<i class="trk"></i><i class="hl" style="right:calc(${(100-x).toFixed(0)}% - 2px)"></i>`;
  const pl=plus?`, cel wyższy o ${fmt(plus)} po treningu`:'',l1=`Zostaje ${fmt(left)} z ${fmt(g)} kcal${pl}`,l2=`Zjedzone ${fmt(e)} z ${fmt(g)} kcal${over?`, cel dnia osiągnięty, ${fmt(e-g)} kcal więcej niż cel`:''}${pl}`;
  const txt=k2?`<b>${fmt(e)}</b>/${fmt(g)}\u00a0kcal`:`<b>${fmt(left)}</b>\u00a0kcal`,tr=plus?`<span class="dbpl">${DUMB}+${fmt(plus)}</span>`:'';
  const kin=`<span class="tx">${txt}${ln(pct(Math.min(e,g),g))}</span>${tr}${sn.kcal?'':NW}`;
  const kc=over?`<button class="cell kcell" style="--c:var(--green)" data-today="1" aria-label="${l2}. Pokaż szczegóły dnia">${kin}</button>`
    :`<button class="cell kcell" style="--c:var(--green)" data-k2="1" aria-pressed="${k2}" aria-label="${k2?l2+'. Pokaż, ile zostaje':l1+'. Pokaż zjedzone z celu'}">${kin}</button>`;
  const M=[['B','p','mB','Białko'],['T','f','mT','tłuszcz'],['W','c','mW','węglowodany'],['Bł','b','mBl','błonnik']];
  const mc=M.map(([l,k,c],i)=>`<span class="cell" style="--c:var(--${c})"><span class="tx">${l}\u00a0<b>${fmt(E[k])}</b>${i===3?'\u202fg':''}${ln(pct(E[k],G[k]))}</span></span>`).join('');
  const ml=M.map(([,k,,n])=>`${n} ${fmt(E[k])} z ${fmt(G[k])} g`).join(', ');
  return `<div class="dbm">${kc}<button class="cell mcells" data-today="1" aria-label="${ml}. Pokaż rachunek dnia"><span class="mg">${mc}</span>${sn.mac?'':NW}</button></div>`}
function todayHtml(){const G=dayGoals(),E=dayEat(),g=G.k,plus=G.plus,row=(a,b,s)=>`<span${s?' class="s"':''}>${a}</span><b${s?' class="s"':''}>${b}</b>`;
  let r='';if(plus>=1)r+=row('Cel bez treningu',`${fmt(g-plus)} kcal`)+row('Po treningu',`+${fmt(plus)} kcal`);
  r+=row('Cel dziś',`${fmt(g)} kcal`,1)+row('Zjedzone',`${fmt(E.k)} kcal`)+row(E.k>g?'Ponad cel':'Zostaje',`${fmt(Math.abs(g-E.k))} kcal`,1);
  const mm=[['Białko','p','cel białka'],['Tłuszcz','f','plan dnia'],['Węglowodany','c','plan dnia'],['Błonnik','b','EFSA']].map(([n,k,src])=>row(`${n} <small class="muted">(${src})</small>`,`${fmt(E[k])} z ${fmt(G[k])} g`)).join('');
  return `<button class="sheetbg" data-todayclose="1" aria-label="Zamknij" tabindex="-1"></button><div class="sheetbox" role="dialog" aria-modal="true" aria-labelledby="td_t"><div class="dophd"><h2 id="td_t" tabindex="-1">Dziś</h2><button class="btn ghost dopx" data-todayclose="1" aria-label="Zamknij">×</button></div><div class="tdg">${r}</div><h3 class="dopsh">Makro</h3><div class="tdg">${mm}</div></div>`}
// Pasek leży tuż nad zakładkami: ich wysokość zależy od czcionki systemu, więc mierzona przy rysowaniu i zmianie rozmiaru
function navH(){if(typeof document==='undefined'||!document.documentElement||!document.documentElement.style)return;const n=document.getElementById('tabs');if(n&&n.offsetHeight)document.documentElement.style.setProperty('--navh',n.offsetHeight+'px')}
if(typeof window!=='undefined'&&window.addEventListener)window.addEventListener('resize',navH);
function todayClose(){if(!TODAY)return;TODAY=false;sheetPop();render();dopFocus('#dbar [data-today]')}
function sheetFocus(){if(!SHEET||typeof document.querySelector!=='function')return;const f=document.querySelector('#sheet .sheetbox button');if(f&&f.focus)f.focus()}
function addFocus(){if(typeof document.querySelector!=='function')return;const a=document.querySelector('nav.tabs [data-addsheet]');if(a&&a.focus)a.focus()}
// Prosty widok: pola, których tam nie ma, nie wyglądają na zepsute; komunikat prowadzi do całej Miary
function liteMiss(id){if(!S.lite)return false;const u=S.unlock||[];return (id==='m_w'&&!u.includes('waga'))||(id==='m_sleep'&&!u.includes('sen'))||id==='m_steps'||id==='fold_brzuch'}
function liteMissToast(){toast('To pole jest w całej Miarze',{act:'litefull',arg:'1',label:'Pokaż całą Miarę'})}
const QUICK={'#dodaj-waga':['day','m_w'],'#dodaj-posilek':['meals','plan'],'#dodaj-trening':['train','']};
function quickFromHash(h){const q=QUICK[String(h||'')];if(!q)return false;S.tab=q[0];QUICK_ID=q[1];SHEET=false;if(q[0]==='day'&&liteMiss(q[1])){QUICK_ID='';liteMissToast()}
  try{if(typeof history!=='undefined'&&history.replaceState)history.replaceState(null,'',location.pathname+location.search)}catch(_){}return true}
function quickFocus(){if(typeof document.querySelector!=='function')return;window.scrollTo(0,0);const el=QUICK_ID&&document.getElementById(QUICK_ID);
  if(el){if(el.scrollIntoView)el.scrollIntoView({block:'center'});focusEl(el)}else focusEl(document.querySelector('header h1'))}
document.addEventListener('keydown',e=>{if(DOP&&e.key==='Escape'){dopClose();return}if(TODAY&&e.key==='Escape'){todayClose();return}if(!SHEET)return;if(e.key==='Escape'){SHEET=false;sheetPop();render();addFocus();return}
  if(e.key==='Tab'){const bs=[...document.querySelectorAll('#sheet .sheetbox button')];if(!bs.length)return;const i=bs.indexOf(document.activeElement);
    if(e.shiftKey&&i<=0){e.preventDefault();bs[bs.length-1].focus()}else if(!e.shiftKey&&i===bs.length-1){e.preventDefault();bs[0].focus()}}});
// Po akcji (przegląd ekranów 11.11.2026, WCAG 2.4.3): przed przerysowaniem zapamiętaj przycisk, jego miejsce na ekranie
// i nagłówek sekcji; po przerysowaniu ten sam przycisk wraca pod palec z fokusem. Gdy przycisku nie ma, fokus na nagłówek
// sekcji; po zmianie ekranu na tytuł ekranu. Celowe przewinięcie (data-goto, data-nav, scrollTo w obsłudze) zostaje.
function btnSel(b){const a=[...(b.attributes||[])].filter(x=>/^data-/.test(x.name)).map(x=>`[${x.name}="${String(x.value).replace(/["\\]/g,'\\$&')}"]`).join('');return a?'button'+a:null}
function headOf(el){const m=document.getElementById('main');if(!m||!m.querySelectorAll||!el.compareDocumentPosition)return '';let t='';
  for(const h of m.querySelectorAll('h2,h3'))if(h.compareDocumentPosition(el)&4)t=h.textContent;return t}
function actAt(b){return {tab:S.tab,sel:btnSel(b),y:b.getBoundingClientRect?b.getBoundingClientRect().top:null,sy:window.scrollY,sh:document.documentElement?document.documentElement.scrollHeight:0,head:headOf(b),fold:(()=>{const d=b.closest&&b.closest('details[data-fold]');return d&&d.dataset?d.dataset.fold:''})(),own:!!(b.dataset.goto||b.dataset.nav)}}
function focusEl(el){if(!el||!el.focus)return;if(!/^(BUTTON|INPUT|SELECT|TEXTAREA|A|SUMMARY)$/.test(el.tagName))el.setAttribute('tabindex','-1');el.focus({preventScroll:true})}
function actDone(at){if(!document.querySelector)return;
  if(S.tab!==at.tab){window.scrollTo(0,0);focusEl(document.querySelector('header h1'));return}
  if(at.rev&&typeof SYG!=='undefined'){const x=SYG.visible(S,todayKey())[0],l=x&&x.lvl==='112'&&document.querySelector('#main a[href="tel:112"]'),al=l&&l.closest('.petsay.syg,.note.warn');if(al&&al.scrollIntoView){al.scrollIntoView({block:'center',behavior:'auto'});focusEl(l);return}}
  // Usunięty wiersz (przycisk zniknął): przeglądarka (zakotwiczenie przewinięcia) potrafi przewinąć dalej, niż skróciła się strona,
  // np. przy pasku nad menu na niskim ekranie; przewinięcie zmienia się najwyżej o skrócenie strony (27.11.2026)
  {const de0=document.documentElement,gone=at.sel&&!document.querySelector(at.sel),cut=de0&&at.sh?at.sh-de0.scrollHeight:0;
    const fix=()=>{if(at.sy-window.scrollY>cut+1)window.scrollTo(0,Math.max(0,at.sy-cut))};
    // zakotwiczenie działa przy następnej klatce, więc sprawdzenie teraz i w dwóch kolejnych klatkach
    if(gone&&cut>0){fix();if(typeof requestAnimationFrame==='function')requestAnimationFrame(()=>{fix();requestAnimationFrame(fix)})}}
  // Strona krótsza po usunięciu wiersza przy końcu: przeglądarka sama cofa przewinięcie do nowego końca. To nie jest przewinięcie przez akcję, fokus wraca (F2c, 23.11.2026).
  const de=document.documentElement,clamp=de&&window.scrollY<at.sy&&Math.abs(window.scrollY-(de.scrollHeight-window.innerHeight))<=1;
  if(at.own||(window.scrollY!==at.sy&&!clamp))return;
  const b=at.sel&&document.querySelector(at.sel);
  // Przewinięcie o pełne piksele (połowa zawsze od zera), drugi przebieg poprawia resztę, gdy przeglądarka przewinęła inaczej (WebKit)
  if(b&&b.getBoundingClientRect&&at.y!=null){for(let i=0;i<2;i++){const dy=b.getBoundingClientRect().top-at.y;if(Math.abs(dy)>=0.5)window.scrollTo(0,window.scrollY+Math.sign(dy)*Math.round(Math.abs(dy)))}focusEl(b);return}
  const hs=typeof document.querySelectorAll==='function'?[...(document.querySelectorAll('#main h2,#main h3')||[])]:[],hh=at.head&&hs.find(x=>x.textContent===at.head);
  // Sekcja z przyciskiem zniknęła razem z ostatnim wpisem: fokus na nagłówek zwijanej sekcji, w której była akcja, nie na górę strony (rada 24.11.2026, WCAG 2.4.3)
  if(!hh&&at.fold){const s=document.querySelector(`#main details[data-fold="${at.fold}"] > summary`);if(s&&s.getBoundingClientRect){const r=s.getBoundingClientRect();if((r.top<0||r.bottom>innerHeight)&&s.scrollIntoView)s.scrollIntoView({block:'nearest'});focusEl(s);return}}
  const h=hh||hs[0];
  if(h){if(h.scrollIntoView){const r=h.getBoundingClientRect();if(r.top<0||r.bottom>innerHeight)h.scrollIntoView({block:'start'})}focusEl(h)}}
document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;const d=b.dataset;const at=actAt(b);if(d.guta&&['krew','wymkrew','bol'].includes(d.guta)&&!(((S.gut||{})[todayKey()]||{}).a||[]).includes(d.guta))at.rev=1;
  if(d.addsheet){SHEET=true;sheetPush();render();sheetFocus();return}
  if(d.dop&&!DOP){dopOpen(d.dop);return}
  if(d.k2){BAR_K2=!BAR_K2;S.seenNew=Object.assign({},S.seenNew,{kcal:true});save();render();dopFocus('#dbar [data-k2]');return}
  if(d.today&&!TODAY){S.seenNew=Object.assign({},S.seenNew,{mac:true});save();TODAY=true;sheetPush();render();dopFocus('#td_t');return}
  if(TODAY&&d.todayclose){todayClose();return}
  if(DOP){if(d.dopclose){dopClose();return}if(d.dopsave){dopSave();return}if(d.dopkeep){DOP.keep=!DOP.keep;dopUpd();return}
    if(d.dopreset){DOP.a=null;DOP.t={};dopUpd();return}
    if(d.doptile){DOP.t[d.doptile]=!DOP.t[d.doptile];DOP.a=dopFromTiles();dopUpd();return}}
  if(SHEET){SHEET=false;sheetPop();if(d.sheetclose){render();addFocus();return}}
  if(d.toastclose){toastHide();return}
  if(d.odswiez){if(typeof location!=='undefined'&&location.reload)location.reload();return}
  if(d.undo){if(UNDO){const tab=S.tab;S=JSON.parse(UNDO);S.tab=tab;UNDO=null;save();render();toast('Przywrócono')}else toastHide();return}
  // Przycisk, który reaguje: w oknie „Cofnij” dotknięcie cofa ostatni zapis, drugie dotknięcie w 700 ms po zapisie nic nie robi
  if(d.ab&&AB[d.ab]){const r=actOf(d.ab);if(r.tap==='skip')return;if(r.tap==='undo'){actUndo(d.ab,at);return}}
  if(d.preset||d.datasave)S.touched={kg:true,cm:true,age:true,goal:true};
  if(b.parentNode&&b.parentNode.id==='toast')toastHide();
  if(d.nav||d.sygsrc){const [tab,id,fd]=(d.nav||'health#syg_'+d.sygsrc).split('#');if(tab==='day'&&liteMiss(id)){S.tab='day';SHEET=false;render();liteMissToast();return}S.tab=tab;if(fd)fd.split(',').forEach(x=>OPEN_F.add(x));save();render();const el=id&&document.getElementById(id);
    if(el){SKUP.reveal(el);if(el.scrollIntoView)el.scrollIntoView({behavior:'smooth',block:'center'});focusEl(el);if(el.classList){el.classList.add('flash');setTimeout(()=>el.classList.remove('flash'),2400)}}else window.scrollTo(0,0);return}
  if(d.cook){const m=MEALS.find(x=>x.id===d.cook),k=todayKey(),base=planFor(new Date().getDay()),i=m?base.findIndex(id=>MEALS.find(x=>x.id===id).t===m.t):-1;if(i<0)return;
    S.swaps=S.swaps||{};S.swaps[k]=S.swaps[k]||{};if(base[i]===m.id)delete S.swaps[k][i];else S.swaps[k][i]=m.id;save();render();
    toast(`${SLOT_T[m.t]} na dziś: ${m.n}. Wieczorem „Według planu” zapisze to danie.`,{act:'tab',arg:'meals',label:'Plan dnia'});return}
  if(d.tab){S.tab=d.tab;if(d.tab==='sos'){S.sosStep='trig';sosEnd=0;clearInterval(sosT)}window.scrollTo(0,0)}
  else if(d.trig){S.sosTrig=d.trig;S.sosStep='plan'}
  else if(d.sosstart){sosEnd=Date.now()+600000;clearInterval(sosT);sosT=setInterval(()=>{const l=Math.max(0,Math.ceil((sosEnd-Date.now())/1000)),el=document.getElementById('sosclock');if(el)el.textContent=mmss(l);if(l<=0){clearInterval(sosT);toast('Minęło 10 minut')}},1000)}
  else if(d.sosout){const out=d.sosout;if(out==='inne'){S.sosStep='inne'}else{logUrge(out);PET.react('urge');if(out==='plan'){const pid=PLAN[new Date().getDay()][3],m=MEALS.find(x=>x.id===pid),x=macros(m,1,1);day().push({kind:'m',id:pid,label:m.n,k:x.k,p:x.p,f:x.f,c:x.c,...FIBE(x)})}S.tab='day';sosEnd=0;clearInterval(sosT);toast(out==='minela'?'Zapisano: ochota minęła':'Zapisano przekąskę')}}
  else if(d.sossave){const k=num(document.getElementById('s_k').value),n=document.getElementById('s_n').value.trim();if(k>0)day().push({kind:'m',label:n||'Przekąska',k,p:0,f:0,c:0});logUrge('inne');S.tab='day';sosEnd=0;clearInterval(sosT);toast('Zapisano')}
  else if(d.type){S.f.type=d.type}
  else if(d.chip){const s=S.f.chips[d.chip]||0;const n=s===0?1:s===1?-1:0;if(n)S.f.chips[d.chip]=n;else delete S.f.chips[d.chip]}
  else if(d.carb){S.f.carb=d.carb}
  else if(d.sort){S.f.sort=d.sort}
  else if(d.toggle){open.has(d.toggle)?open.delete(d.toggle):open.add(d.toggle);renderMealList();return}
  else if(d.addmeal){const m=MEALS.find(x=>x.id===d.addmeal);if(!m)return;const x=macros(m,carbMult(),num(S.f.portion)||1,dopOf(m.id)),e={kind:'m',id:m.id,label:m.n,k:x.k,p:x.p,f:x.f,c:x.c,...FIBE(x)};day().push(e);PET.react('meal');ATE_FLASH=m.id;try{actDay('meal:'+m.id,todayKey(),[e],at)}finally{ATE_FLASH=''}actGuide('Dodano do dnia');return}
  else if(d.eatrm){const a=day();let i=a.length-1;while(i>=0&&!(a[i].kind==='m'&&a[i].id===d.eatrm))i--;if(i<0)return;const lb=a[i].label;undoable('Usunięto ostatni wpis: '+lb);a.splice(i,1)}
  else if(d.cat){S.tr.cat=d.cat}
  else if(d.opt){S.tr.opt[S.tr.cat]=d.opt}
  else if(d.bmode){S.tr.bMode=d.bmode;if(d.bmode==='bieg'&&num(S.tr.speed)<8)S.tr.speed='8';if(d.bmode==='marsz'&&num(S.tr.speed)>6.5)S.tr.speed='5'}
  else if(d.smode){S.tr.sMode=d.smode}
  else if(d.sclass){S.tr.sClass=d.sclass}
  else if(d.addwatch){const m=num(S.tr.wmin),w=num(S.tr.wk);if(!(m>=1&&m<=300)){toast('Wpisz czas w minutach',{focus:'f_tr.wmin'});return}if(!(w>=10&&w<=3000)){toast('Wpisz kalorie z zegarka, od 10 do 3000',{focus:'f_tr.wk'});return}const e={kind:'t',label:'Trening z zegarka',min:m,gross:w,net:Math.max(0,Math.round(w-baseH()*m/60)),src:'zegarek'},wk=S.tr.wk;day().push(e);S.tr.wk='';PET.react('train');actDay('watch',todayKey(),[e],at,()=>{S.tr.wk=wk});actGuide('Dodano do dnia');return}
  else if(d.dayplan){const lg=new Set(day().filter(e=>e.kind==='m').map(e=>e.id)),es=planIds().filter(id=>!lg.has(id)&&lg.add(id)).map(id=>{const m=MEALS.find(x=>x.id===id),x=macros(m,carbMult(),num(S.f.portion)||1);return {kind:'m',id,label:m.n,k:x.k,p:x.p,f:x.f,c:x.c,...FIBE(x),plan:true}});es.forEach(e=>day().push(e));const n=es.length;
    if(!n){toast('Plan na dziś jest już zapisany');return}PET.react('meal');actDay('plan',todayKey(),es,at);actGuide(`Dodano ${n} ${n===1?'posiłek':'posiłki'} z planu, wartości szacunkowe`);return}
  else if(d.dayother){OPEN_F.add('szybki')}
  else if(d.addtrain){const sp=spec(),m=num(S.tr.min);if(m<=0){toast('Wpisz czas w minutach');return}const k=kcal(sp,m),e={kind:'t',label:sp.label,min:m,gross:k.gross,net:k.net};day().push(e);PET.react('train');actDay('train',todayKey(),[e],at);actGuide('Dodano do dnia');return}
  else if(d.del!=null){undoable('Usunięto wpis');day().splice(+d.del,1)}
  else if(d.delurge!=null){const k=todayKey(),L=(S.urges||{})[k]||[],i=+d.delurge;if(L[i]){undoable('Usunięto ochotę');L.splice(i,1);if(!L.length)delete S.urges[k]}}
  else if(d.clear){undoable('Wyczyszczono wpisy z dziś');S.days[todayKey()]=[]}
  else if(d.lite){const [f,v]=String(d.lite).split(':'),k=todayKey(),wf=liteFull(k);if(!({stepsB:['lo','mid','hi'],feel:['dobrze','glowa','brzuch','inne'],redz:['0','1','2']}[f]||[]).includes(v))return;buzz();const m=(S.meas[k]=S.meas[k]||{});
    if(f==='stepsB'){if(num(m.steps)>0){toast('Kroki są już wpisane liczbą');return}m.stepsB=v}
    else if(f==='feel'){const was=m.feel==='glowa';m.feel=v;if(v==='glowa'){S.pain=S.pain||{};if(!S.pain[k])S.pain[k]={aura:false,med:false,card:true}}else if(was&&S.pain&&S.pain[k]&&S.pain[k].card&&!S.pain[k].aura&&!S.pain[k].med)delete S.pain[k]}
    else m.redz=+v
    if(!wf&&liteFull(k)){PET.react('weigh');liteCollapse(k,true)}}
  else if(d.litefull){S.lite=false}
  else if(d.litesum){const k=todayKey();LITE_UI.sum=LITE_UI.sum===k?'':k}
  else if(d.liteedit){LITE_UI.open=todayKey();LITE_UI.sum='';LITE_UI.focus='q_steps';LITE_UI.say='Szybki wpis rozwinięty do zmiany.'}
  else if(d.litedone){liteCollapse(todayKey())}
  else if(d.unlock){if(!UNLOCK.includes(d.unlock))return;S.unlock=S.unlock||[];if(!S.unlock.includes(d.unlock))S.unlock.push(d.unlock);S.unlockAt=todayKey();if(d.unlock==='cala')S.lite=false}
  else if(d.unlocklater){const t=new Date();t.setDate(t.getDate()+7);S.unlockAt=todayKey();S.unlockSnooze=keyOf(t)}
  else if(d.introdone){const ok=d.introdone==='ok',st=['kg','cm','age'].filter(isStart);if(ok&&st.length){S.onb=true;S.introStep=0;S.tab='day';window.scrollTo(0,0);save();render();const nm=st.map(k=>({kg:'waga',cm:'wzrost',age:'wiek'})[k]),lst=nm.length>1?nm.slice(0,-1).join(', ')+' i '+nm.at(-1):nm[0];toast(`${lst[0].toUpperCase()+lst.slice(1)} ${nm.length>1?'są':'jest'} na wartościach startowych. Ustaw swoje w Ustawieniach, żeby kalorie były liczone dla Ciebie.`,{act:'tab',arg:'set',label:'Ustawienia'});return}if(ok&&S.guide)S.guide.dataOk=true;S.onb=true;S.introStep=0;S.tab='day';window.scrollTo(0,0);if(ok){save();render();toast(`Twój cel na start: ${fmt(targetKcal())} kcal dziennie.`+(S.pet?'':' W Moim dniu czeka jajko: wybierz, kto się z niego wykluje.'),S.pet?0:{act:'tab',arg:'pet',label:'Wybierz'});return}}
  else if(d.intro){S.introStep=0;S.tab='intro';window.scrollTo(0,0)}
  else if(d.goto){const el=document.getElementById(d.goto);if(el){SKUP.reveal(el);if(el.scrollIntoView)el.scrollIntoView({behavior:'smooth',block:'center'});if(el.focus)el.focus({preventScroll:true})}return}
  else if(d.kq){const [q,v]=d.kq.split(':');S.krok=S.krok||{ans:{},eq:{},done:false,conf:false,zap:{}};S.krok.ans[q]=v}
  else if(d.keq){S.krok=S.krok||{ans:{},eq:{},done:false,conf:false,zap:{}};S.krok.eq[d.keq]=!S.krok.eq[d.keq]}
  else if(d.kres){const a=(S.krok||{}).ans||{},miss=DQ.filter(([q])=>!a[q]);if(miss.length){toast('Odpowiedz jeszcze na: '+miss.map(x=>x[1].toLowerCase()).join('; '));return}S.krok.done=true;window.scrollTo(0,0)}
  else if(d.kconf){kConfirm();window.scrollTo(0,0)}
  else if(d.kdiag||d.krokdiag){S.krok.done=false;S.krok.conf=false;S.tab='krok';window.scrollTo(0,0)}
  else if(d.kjt){S.krok.jt=+d.kjt}
  else if(d.kzap){S.krok.zap=S.krok.zap||{};S.krok.zap[d.kzap]=!S.krok.zap[d.kzap]}
  else if(d.kroknext){const j=kNext(S.krok.step);if(j<0)S.krok.fin=true;else kStart(j);toast(j<0?'Ścieżka gotowania ukończona':'Nowy krok: '+KROKI[j].n)}
  else if(d.cel){const g=ZD.goalOf(d.cel);if(!g)return;S.cel={id:g.id,since:todayKey()};toast('Twój cel: '+g.t)}
else if(d.krokrep){kStart(S.krok.step);toast('Powtarzasz krok od tego tygodnia')}
  else if(d.krokeasy){kStart(S.krok.step);S.krok.easy=true;toast('Łatwiejsza wersja kroku od tego tygodnia')}
  else if(d.impsave){const I=S.imp;if(I){const m=S.meas[I.date]=S.meas[I.date]||{};Object.entries(I.vals).forEach(([f,v])=>{m[f]=f==='sleep'?sleepFmt(num(v)):v;if(Array.isArray(m.cp)){m.cp=m.cp.filter(x=>x!==f);if(!m.cp.length)delete m.cp}})}S.imp=null;S.tab='day';const mm=muscleSync();toast('Zapisano dane ze Skrótu'+(mm?'. '+mm:''))}
  else if(d.impskip){S.imp=null;S.tab='day'}
  else if(d.musclerec){S.muscleAuto=true;S.muscleAutoLast=null;muscleToast()}
  else if(d.imppaste){if(typeof navigator!=='undefined'&&navigator.clipboard&&navigator.clipboard.readText)navigator.clipboard.readText().then(t=>{S.imp=parseImport(t);S.tab='import';save();render()},()=>toast('Nie udało się odczytać schowka. Zezwól na wklejenie albo użyj adresu ze Skrótu.'));else toast('Ta przeglądarka nie pozwala odczytać schowka.');return}
  else if(d.goalway){S.goalWay=d.goalway}
  else if(d.bmicut){S.bmiCut=d.bmicut}
  else if(d.goalbmi){S.goal=stpFmt(Math.round(+d.goalbmi*Math.pow((num(S.cm)||165)/100,2)*2)/2,.5);(S.touched=S.touched||{}).goal=true}
  else if(d.goalpct){S.goal=stpFmt(goalOf(+d.goalpct),.5);(S.touched=S.touched||{}).goal=true}
  else if(d.kcalset){const [id,v]=d.kcalset.split(':'),el=document.getElementById(id);if(el){el.value=v;if(el.focus)el.focus()}return}
  else if(d.revsave){const g=id=>document.getElementById(id).value.trim();S.reviews=S.reviews||{};S.reviews[reviewKey()]={a:g('r_a'),b:g('r_b'),c:g('r_c'),d:todayKey()};S.tab='day';toast('Zapisano przegląd');window.scrollTo(0,0)}
  else if(d.mode){S.mode=d.mode;if(d.mode==='utrzymanie'){S.maintRef=Math.round((avg7()||kg())*10)/10;S.maintSince=todayKey()}else{S.maintSince=''}toast(d.mode==='utrzymanie'?'Tryb utrzymania':d.mode==='masa'?'Tryb przyrostu masy':'Tryb redukcji')}
  else if(d.modekeep){S.modeKeep=modeSig();toast('Zostajesz przy obecnym trybie. Propozycja wróci po zmianie danych.')}
  else if(d.cyc){const k=todayKey();S.meas[k]=S.meas[k]||{};const pv=S.meas[k].cyc||'';S.meas[k].cyc=pv===d.cyc?'':d.cyc;petHealth('cyc',S.meas[k].cyc,pv)}
  else if(d.bkexp){bkExport();return}
  else if(d.bkpaste){const o=bkParse(document.getElementById('bk_text').value.trim());if(!o){BK_PENDING=null;toast('To nie jest kopia tej aplikacji');return}BK_PENDING=o}
  else if(d.bkapply){if(!BK_PENDING)return;if(BK_PENDING.noHealth)BK_NH_KEEP.forEach(k=>{if(!(k in BK_PENDING.data))return;const v=clone(BK_PENDING.data[k]);S[k]=v&&typeof v==='object'&&!Array.isArray(v)?merge(clone(DEF[k]||{}),v):v});else S=muscleFix(BK_PENDING.data,merge(clone(DEF),fixTouched(BK_PENDING.data)));S=syFix(viewFix(BK_PENDING.data,petNameFix(BK_PENDING.data,S)));S.onb=true;S.tab='set';BK_PENDING=null;const mm=muscleSync();undoable('Wczytano kopię'+(mm?'. '+mm:''))}
  else if(d.bkcancel){BK_PENDING=null}
  else if(d.chmode){S.chMode=d.chmode}
  else if(d.wi){const [a,b]=d.wi.split(':');S.wi=S.wi||{snack:0,steps:0,train:0};S.wi[a]=+b}
  else if(d.kstart){S.knee.start=todayKey()}
  else if(d.kcramp){const K=S.knee,dn=K.sessions.find(x=>x.d===todayKey()),cur=K.tmpCramp!=null?K.tmpCramp:(dn?dn.cramp:false);K.tmpCramp=!cur}
  else if(d.ksave){const K=S.knee,t=todayKey(),dn=K.sessions.find(x=>x.d===t),pain=K.tmpPain!=null?K.tmpPain:(dn?dn.pain:null);if(pain==null){toast('Zaznacz ból kolana 0-10');return}const cramp=K.tmpCramp!=null?K.tmpCramp:(dn?dn.cramp:false);if(!K.start)K.start=t;if(dn){dn.pain=pain;dn.cramp=cramp}else{K.sessions.push({d:t,pain,cramp});const sp={met:3.5},kk=kcal(sp,60);day().push({kind:'t',label:'Program kolana (rower, ćwiczenia nerwowo-mięśniowe i siłowe)',min:60,gross:kk.gross,net:kk.net,knee:1})}K.tmpPain=null;K.tmpCramp=null;PET.react('train');toast('Zapisano sesję')}
  else if(d.kmorn){S.knee.morning[todayKey()]=d.kmorn;toast('Zapisano')}
  else if(d.kday){const v=+d.kday,a=S.knee.days;S.knee.days=a.includes(v)?a.filter(x=>x!==v):[...a,v]}
  else if(d.swap!=null){const i=+d.swap,k=todayKey(),orig=planFor(new Date().getDay())[i],cur=planIds()[i],t=MEALS.find(m=>m.id===orig).t,bk=macros(MEALS.find(m=>m.id===orig),1,1).k,c=MEALS.filter(m=>m.t===t).sort((a,b)=>(a.id===orig?-1:b.id===orig?1:0)||Math.abs(macros(a,1,1).k-bk)-Math.abs(macros(b,1,1).k-bk)||a.id.localeCompare(b.id)).map(m=>m.id),nx=c[(c.indexOf(cur)+1)%c.length];S.swaps=S.swaps||{};S.swaps[k]=S.swaps[k]||{};if(nx===orig)delete S.swaps[k][i];else S.swaps[k][i]=nx}
  else if(d.shop){const t='Lista zakupów na tydzień\n'+shopLines().join('\n');if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>toast('Skopiowano listę'),()=>toast('Nie udało się skopiować'));else toast('Kopiowanie niedostępne w tej przeglądarce');return}
  else if(d.shopday){S.shopDay=d.shopday==='none'?null:+d.shopday;OPEN_F.add('zakupy')}
  else if(d.storeadd){S.stores=Array.isArray(S.stores)?S.stores:[];if(S.stores.length<3)S.stores.push({n:'',u:''});OPEN_F.add('zakupy');OPEN_F.add('sklepy')}
  else if(d.promoparse){const el=document.getElementById('promo_txt');PROMO_PENDING=promoParse(el?String(el.value||''):'',todayKey());OPEN_F.add('zakupy');render();const n=PROMO_PENDING.length;toast(`Znaleziono ${n} ${plN(n,'pozycję','pozycje','pozycji')}`,{focus:'promo_h'});return}
  else if(d.promosave){promoSave([+d.promosave])}
  else if(d.promosaveall){promoSave((PROMO_PENDING||[]).map((_,i)=>i))}
  else if(d.promoskip){if(PROMO_PENDING){const i=+d.promoskip;PROMO_PENDING=PROMO_PENDING.filter((_,j)=>j!==i);if(!PROMO_PENDING.length)PROMO_PENDING=null}OPEN_F.add('zakupy')}
  else if(d.promodel){undoable('Usunięto promocję');S.promos=(Array.isArray(S.promos)?S.promos:[]).filter(p=>p.id!==d.promodel);OPEN_F.add('zakupy')}
  else if(d.recipe){if(S.tab!=='recipe')S.recipeBack=S.tab;S.recipe=d.recipe;S.tab='recipe';window.scrollTo(0,0)}
  else if(d.labsave){const g=id=>document.getElementById(id),v=g('l_val').value.trim(),dt=g('l_date').value,lo0=g('l_lo')?g('l_lo').value.trim().replace(',','.'):'',lo=lo0&&isFinite(parseFloat(lo0))?lo0:'';if(!v||!isFinite(parseFloat(v.replace(',','.')))){toast('Wpisz wynik liczbowo');return}if(!dt){toast('Wpisz datę');return}const e={id:Date.now().toString(36),test:LABN[S.labSel]?S.labSel:'tsh',date:dt,val:v.replace(',','.'),...(lo?{lo}:{}),unit:g('l_unit').value.trim(),fast:g('l_fast').checked,bio:g('l_bio')?g('l_bio').checked:undefined,cyc:g('l_cyc')?g('l_cyc').value.trim():'',cr:g('l_cr')?g('l_cr').checked:false};S.labs.push(e);petHealth('lab',v,null,{out:labStatus(e).w===1});LAB_KEEP={test:e.test,date:dt,unit:e.unit,raw:v,back:false,day:todayKey(),f:{lo:g('l_lo')?g('l_lo').value.trim():'',fast:e.fast,bio:e.bio,cyc:e.cyc,cr:e.cr}};actSave('lab',()=>labDrop(e),()=>S.labs.some(x=>x===e||x.id===e.id),at);return}
  else if(d.labdel){undoable('Usunięto wynik badania');S.labs=S.labs.filter(e=>e.id!==d.labdel)}
  else if(d.labcopy){const t=LABS.map(x=>{const es=S.labs.filter(e=>e.test===x.id).sort((a,b)=>a.date.localeCompare(b.date));return es.length?x.n+': '+es.map(e=>fmtDate(e.date)+' '+e.val+' '+e.unit).join('; '):''}).filter(Boolean).join('\n');if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>toast('Skopiowano'),()=>toast('Nie udało się skopiować'));else toast('Kopiowanie niedostępne w tej przeglądarce');return}
  else if(d.quick){const n=document.getElementById('q_n').value.trim(),k=num(document.getElementById('q_k').value);if(k<=0){toast('Wpisz liczbę kalorii');return}buzz();day().push({kind:'m',label:n||'Szybki wpis',k,p:0,f:0,c:0})}
  else if(d.repeat){const y=(S.days[keyAgo(1)]||[]).filter(e=>e.kind==='m');if(!y.length){toast('Wczoraj nie ma zapisanych posiłków');return}y.forEach(e=>day().push(Object.assign({},e)));PET.react('meal')}
  else if(d.copy){const m=MEALS.find(x=>x.id===d.copy),x=macros(m,carbMult(),num(S.f.portion)||1),t=m.n+'\n'+x.items.map(i=>i.n+': '+Math.round(i.g/5)*5+' g').join('\n');if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>toast('Skopiowano składniki'),()=>toast('Nie udało się skopiować'));else toast('Kopiowanie niedostępne w tej przeglądarce');return}
  else if(d.hab){const k=todayKey();S.hab[k]=S.hab[k]||{};S.hab[k][d.hab]=!S.hab[k][d.hab];if(S.hab[k][d.hab])PET.react('habit',(HABITS.find(x=>x.id===d.hab)||{}).pts||0)}
  else if(d.share){const t=shareText();
    if(navigator.share){navigator.share({text:t}).catch(()=>{})}
    else if(navigator.clipboard){navigator.clipboard.writeText(t).then(()=>toast('Skopiowano do schowka'),()=>toast('Nie udało się skopiować'))}
    return}
  else if(d.petprev){if(!PET.kinds().includes(d.petprev))return;PET_PREV=d.petprev;render();return}
  else if(d.petok){if(!PET_PREV)return;S.pet={kind:PET_PREV,name:'',since:todayKey()};PET_PREV='';S.petSeen=[...new Set([...(S.petSeen||[]),...PET.milestones(petCtx())])];toast('Witaj, '+PET.form(S.pet.kind,'voc')+'! Imię nadasz w Ustawieniach.')}
  else if(d.mobex){S.mob=S.mob||{done:{}};S.mob.done=S.mob.done||{};const k=todayKey(),L=S.mob.done[k]||[];S.mob.done[k]=L.includes(d.mobex)?L.filter(x=>x!==d.mobex):L.concat(d.mobex)}
  // Rozgrzewka: tryb, pominięcie (tylko w pamięci), krok po kroku; zapis jednej sesji 0 kcal na dziś
  else if(d.warmmode){S.warm=S.warm||{};S.warm.full=d.warmmode==='full'}
  else if(d.warmskip){WARM_UI.skip=todayKey()}
  else if(d.warmshow){WARM_UI.skip=''}
  else if(d.warmgo||d.warmagain){WARM_UI.step=0;WARM_UI.paused=false;WARM_UI.focus=true;at.own=true;warmLock(true);warmTimer(true)}
  else if(d.warmnext||d.warmprev){WARM_UI.step=Math.max(0,Math.min(warmList().length-1,WARM_UI.step+(d.warmnext?1:-1)));WARM_UI.focus=true;at.own=true;warmTimer(true)}
  else if(d.warmpause){WARM_UI.paused=!WARM_UI.paused}
  else if(d.warmexit){WARM_UI.step=null;warmTimer(false);warmLock(false)}
  else if(d.warmdone){const full=!!(S.warm||{}).full;if(!warmDone())day().push({kind:'t',label:'Rozgrzewka',min:full?10:6,gross:0,net:0,warm:1});WARM_UI.step=null;warmTimer(false);warmLock(false);toast('Rozgrzewka zapisana')}
  else if(d.ruchnote){S.ruchNote=1}
  else if(d.mobsave){if(!day().some(e=>e.kind==='t'&&e.mob)){day().push({kind:'t',label:'Mobilność (rutyna)',min:10,gross:0,net:0,mob:1});PET.react('train')}toast('Zapisano sesję mobilności')}
  else if(d.planday!=null){const t=S.tmpPlan=S.tmpPlan||{n:'',dose:'',days:[]},v=+d.planday;t.days=(t.days||[]).includes(v)?t.days.filter(x=>x!==v):(t.days||[]).concat(v)}
  else if(d.planadd){const t=S.tmpPlan||{},n=String(t.n||'').trim();if(!n){toast('Wpisz nazwę ćwiczenia',{focus:'pl_n'});return}if(!(t.days||[]).length){toast('Wybierz co najmniej jeden dzień');return}S.plan=S.plan||{items:[],done:{}};S.plan.items.push({id:'p'+Date.now().toString(36)+S.plan.items.length,n,dose:String(t.dose||'').trim(),days:t.days.slice()});S.tmpPlan={n:'',dose:'',days:[1,2,3,4,5,6,0]};toast('Dodano do planu')}
  else if(d.planex){const P=S.plan,k=todayKey(),L=(P.done=P.done||{})[k]||[];P.done[k]=L.includes(d.planex)?L.filter(x=>x!==d.planex):L.concat(d.planex)}
  else if(d.plandel){undoable('Usunięto ćwiczenie z planu');S.plan.items=S.plan.items.filter(x=>x.id!==d.plandel)}
  else if(d.insole){S.insole=S.insole||{days:{},pain:{}};const k=todayKey();S.insole.days[k]=!S.insole.days[k]}
  else if(d.gutcopy){const y=(S.gut||{})[nAgo(1)]||{};S.gut=S.gut||{};S.gut[todayKey()]={b:y.b,f:y.f,n:y.n};OPEN_F.add('brzuch')}
  else if(d.gutu||d.guta){S.gut=S.gut||{};const k=todayKey(),g=S.gut[k]=S.gut[k]||{},f=d.gutu?'u':'a',v=d.gutu||d.guta;g[f]=Array.isArray(g[f])?g[f]:[];const on=!g[f].includes(v);g[f]=on?[...g[f],v]:g[f].filter(x=>x!==v);if(on)petHealth(d.gutu?'gutu':'guta',v,null)}
  else if(d.gutf||d.gutn!=null||d.guts!=null){S.gut=S.gut||{};const k=todayKey(),g=S.gut[k]=S.gut[k]||{};if(d.gutf)g.f=d.gutf;if(d.gutn!=null)g.n=+d.gutn;if(d.guts!=null)g.s=+d.guts}
  else if(d.petkind){if(!S.pet||!PET.kinds().includes(d.petkind))return;S.pet.kind=d.petkind}
  else if(d.petpick){S.tab='pet';window.scrollTo(0,0)}
  else if(d.datasave){const c=dataCheck();if(c.err.length){toast(c.err[0],3200);const el=document.getElementById('f_'+c.first);if(el&&el.focus)el.focus()}else{S.guide=S.guide||{};S.guide.dataOk=true;save();toast('Dane zapisane')}}
  else if(d.pain){const k=d.pain==='yday'?nAgo(1):todayKey();S.pain=S.pain||{};const was=!!S.pain[k];S.pain[k]=S.pain[k]||{aura:false,med:false};if(d.pain!=='yday'&&!was)petHealth('pain',d.pain,null);toast(d.pain==='yday'?'Wczoraj zapisany jako dzień z bólem':'Dzień z bólem: seria się nie przerwie',2400)}
  else if(d.painaura||d.painmed){const p=painAt(todayKey());if(p){const f=d.painaura?'aura':'med';p[f]=!p[f]}}
  else if(d.painoff){if(S.pain&&S.pain[todayKey()]){undoable('Usunięto dzień z bólem');delete S.pain[todayKey()]}}
  else if(d.consent){if(!(document.getElementById('c_ok')||{}).checked){toast('Zaznacz pole zgody');return}S.consent={v:CONSENT_V,at:new Date().toISOString()};toast('Zgoda zapisana. Teraz ustaw hasło kopii.',2400)}
  else if(d.consentshow){S.consentShow=!S.consentShow}
  else if(d.consentoff){S.consent=null;S.kopia=null;KS.del().catch(()=>{});toast('Zgoda wycofana. Wysyłanie zatrzymane; kopie zostaną usunięte.',3200)}
  else if(d.kopiasend){kopiaSend().then(()=>{toast('Kopia wysłana');render()},e=>{if(S.kopia){S.kopia.err=e.message;save()}toast(e.message,3200);render()});return}
  else if(d.kopiakey){kopiaSetup().then(()=>{toast('Klucz zapisany w tym telefonie');save();render()},e=>toast(e.message,3200));return}
  else if(d.visitsave){const g=id=>document.getElementById(id),who=String(g('v_who').value||'').trim().slice(0,40),dt=String(g('v_date').value||'').trim();if(!/^\d{4}-\d{2}-\d{2}$/.test(dt)){toast('Wybierz datę wizyty');return}S.visit={who,date:dt};toast('Zapisano wizytę')}
  else if(d.visitcopy){const t=visitLines().join('\n');if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>toast('Skopiowano listę'),()=>toast('Nie udało się skopiować'));return}
  else if(d.cardok){S.cardsOk=S.cardsOk||{};S.cardsOk[d.cardok]=todayKey()}
  else if(d.tipok){S.tips=S.tips||{};S.tips[d.tipok]=true}
  else if(d.tipsreset){S.tips={};toast('Wskazówki pokażą się ponownie')}
  else if(d.guidehide){S.guide.hidden=true}
  else if(d.guideshow){S.guide=S.guide||{};S.guide.hidden=false;S.tab='day';window.scrollTo(0,0);if(!guideActive())toast('Wszystkie pierwsze kroki są już zrobione')}
  else if(d.view){S.lite=d.view!=='cala';S.focus=d.view==='skup';S.once=false;SKUP_UI.rest=''}
  else if(d.skuplater){SKUP_UI.skip=SKUP.later(SKUP_UI.skip,d.skuplater)}
  else if(d.skuprest){SKUP_UI.rest=todayKey()}
  else if(d.toastlen){S.toastLen=d.toastlen;toast(d.toastlen==='stay'?'Komunikat zostanie, dopóki go nie zamkniesz.':'Tak długo będzie widać komunikat.')}
  else if(d.setv){setPath(d.setv,d.v)}
  else if(d.pace){S.f.pace=d.pace}
  else if(d.orddish){S.ord=S.ord||{add:{}};S.ord.dish=d.orddish}
  else if(d.ordn){S.ord=S.ord||{add:{}};const dk=ordDish();S.ord[dk]=dk==='tofu'?d.ordn:+d.ordn}
  else if(d.ordalt){S.ord.alt=!S.ord.alt}
  else if(d.ordadd){S.ord.add=S.ord.add||{};S.ord.add[d.ordadd]=!S.ord.add[d.ordadd]}
  else if(d.ordsave){const t=ordCalc(),e={kind:'m',id:'zam_'+ordDish(),label:ordLabel()+' (zamówione)',k:Math.round(t.k),p:Math.round(t.p),f:Math.round(t.f),c:Math.round(t.c),ord:1};day().push(e);PET.react('meal');actDay('ord',todayKey(),[e],at);actGuide('Zapisano zamówione');return}
  else if(d.forme){S.f.forme=!forMe()}
  else if(d.ftag){S.f.tags=S.f.tags||{};S.f.tags[d.ftag]=!S.f.tags[d.ftag]}
  else if(d.sygseen){S.sygSeen=S.sygSeen||{};S.sygSeen[d.sygseen]=todayKey()}
  else if(d.sygwiz){S.wizList=Array.isArray(S.wizList)?S.wizList:[];const on=S.wizList.includes(d.sygwiz);S.wizList=on?S.wizList.filter(x=>x!==d.sygwiz):S.wizList.concat(d.sygwiz);toast(on?'Usunięto z listy na wizytę':'Dodano do listy na wizytę')}
  else if(d.supp){if(!suppIds().includes(d.supp))return;S.suppTake=Array.isArray(S.suppTake)?S.suppTake:[];const on=S.suppTake.includes(d.supp);S.suppTake=on?S.suppTake.filter(x=>x!==d.supp):S.suppTake.concat(d.supp);OPEN_F.add('suple');toast(on?'Usunięto z planu suplementów':'Dodano do planu suplementów')}
  else if(d.wizclear){undoable('Wyczyszczono pytania na wizytę');S.wizList=[]}
  else if(d.hp){S.wizyta=(S.wizyta||{}).hp===d.hp?{hp:'brak'}:{hp:d.hp,d:todayKey()}}
  else if(d.gprof){S.prof=S.prof||{cond:{},pill:''};S.prof[d.gprof]=!S.prof[d.gprof]}
  else if(d.cond){OPEN_F.add('profil');S.prof=S.prof||{cond:{},pill:''};S.prof.cond=S.prof.cond||{};S.prof.cond[d.cond]=!S.prof.cond[d.cond];if(d.cond==='lip'&&S.prof.cond.lip)S.lip=true}
  else if(d.demoexit){location.hash='';location.reload();return}
  else if(d.scen){location.hash='#demo-'+d.scen;location.reload();return}
  else if(d.sex){S.sex=d.sex;muscleToast()}
  else if(d.reset){undoable('Przywrócono ustawienia domyślne');const days=S.days;S=clone(DEF);S.days=days;S.tab='set'}
  else return;
  save();render();if(!liteAfter())actDone(at);
});
document.addEventListener('input',e=>{
  const el=e.target;
  if(el.id==='help_q'){S.helpQ=el.value;document.getElementById('helpres').innerHTML=helpRes(el.value);return}
  if(el.dataset.r){const k=el.dataset.r,v=num(el.value);S.f[k]=v;save();
    const lab=document.getElementById('l_'+k);
    if(lab)lab.textContent=k==='minP'?v+' g':k==='maxK'?(v>=1000?'bez limitu':v+' kcal'):k==='maxC'?(v>=130?'bez limitu':v+' g'):'×'+fmt1(v);
    el.setAttribute('aria-valuetext',rTxt(k,v));
    renderMealList();return}
  const k=el.dataset.k;if(!k)return;
  if(START_K.includes(k))(S.touched=S.touched||{})[k]=true;
  if(el.type==='checkbox'){setPath(k,el.checked);if(k==='muscle'){S.muscleAuto=false;if(el.checked)S.goalWay='talia'}if(k==='body'&&el.checked)toast('Sylwetka pokazuje trend 4 tygodni. Pojedyncze pomiary się wahają.');save();render();return}
  let v=el.value;const im=el.getAttribute('inputmode');
  if(im==='decimal'||im==='numeric'){const c=checkNum(k,v);el.classList.toggle('bad',!!c.err);el.setAttribute('aria-invalid',c.err?'true':'false');el.title=c.err||'';fieldErr(el,c.err||'');if(c.err)return}
  setPath(k,v);save();
  const pos=el.selectionStart;REDRAW=true;try{renderKeep(el)}finally{REDRAW=false}
  const n=document.querySelector(`[data-k="${k}"]`);if(n){n.focus({preventScroll:true});try{n.setSelectionRange(pos,pos)}catch(_){}}
});
// Kotwica przewijania (15.11.2026): treść nad polem (np. „Co się dzieje” po wadze, panel „Dziś”) zmienia wysokość po przerysowaniu,
// więc pole wraca w to samo miejsce okna. Kotwica: pole edytowane; po wyjściu z pola nowo aktywne pole, inaczej pole opuszczone.
function anchorOf(el){if(!el||!el.getBoundingClientRect)return null;return {id:el.id||'',k:(el.dataset&&el.dataset.k)||'',top:el.getBoundingClientRect().top}}
function anchorFind(a){if(!a)return null;return (a.id&&document.getElementById(a.id))||(a.k&&document.querySelector(`[data-k="${a.k}"]`))||null}
// Fokus: element aktywny w chwili przerysowania (pole albo przycisk) dostaje fokus z powrotem w nowej wersji (po id, data-k albo btnSel z actAt).
function renderKeep(el){const act=typeof document!=='undefined'&&document.activeElement,fo=act&&act!==document.body&&act.getBoundingClientRect?{id:act.id||'',k:(act.dataset&&act.dataset.k)||'',sel:act.tagName==='BUTTON'?btnSel(act):null}:null,a=anchorOf(el);
  const r0=REDRAW;REDRAW=true;try{render()}finally{REDRAW=r0}
  const n=anchorFind(a);if(n&&typeof window!=='undefined'&&window.scrollBy){const d=n.getBoundingClientRect().top-a.top;if(Math.abs(d)>1)window.scrollBy(0,d)}
  if(fo){const m=anchorFind(fo)||(fo.sel&&document.querySelector(fo.sel));if(m&&m!==document.activeElement&&m.focus)m.focus({preventScroll:true})}}
function fieldNow(el){const a=document.activeElement;return a&&a!==el&&a.matches&&a.matches('input,textarea,select')?a:el}
// Wartość sprzed edycji pola: render() po każdym znaku odtwarza pole i ponownie wywołuje focusin, więc zapis tylko przy zmianie pola
let EDIT=null,REDRAW=false;
// Wejście w pole liczbowe zaznacza całą wartość: wpis zastępuje, wyjście bez wpisu zostawia (rada/2026-11-09_pole-po-dotknieciu; WCAG 3.2.1, 3.3.7).
// Tylko przy wejściu w nowe pole: render() po każdym znaku odtwarza pole i znowu wywołuje focusin
let SEL_ID=null,SEL_PTR=0,SEL_HOLD=null;
// Zaznaczenie od razu (klawiatura) i przy kliknięciu po dotknięciu, bo kursor z dotknięcia nadpisuje zaznaczenie z fokusu,
// a zajęty procesor może obsłużyć pierwszy klawisz przed setTimeout(…, 0) (CI 09.11.2026: „8750,1”); setTimeout zostaje dla iOS.
// WebKit ustawia kursor z dotknięcia już po kliknięciu: przez 500 ms zwinięte zaznaczenie wraca do całości, do wpisu albo kolejnego dotknięcia.
// Klawiatura (18.11.2026): klasa kbd na body, gdy fokus jest w polu, które otwiera klawiaturę; CSS chowa wtedy dolne menu na telefonie.
// Sprawdzenie po focusout w setTimeout, bo render() po każdym znaku odtwarza pole i oddaje mu fokus.
const KBD_SEL='input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=button]):not([type=file]),textarea,select';
const kbdOn=el=>!!(el&&el.matches&&el.matches(KBD_SEL));
document.addEventListener('focusin',e=>{if(kbdOn(e.target)&&document.body)document.body.classList.add('kbd')});
document.addEventListener('focusout',()=>setTimeout(()=>{if(document.body&&!kbdOn(document.activeElement))document.body.classList.remove('kbd')},0));
document.addEventListener('pointerdown',()=>{SEL_PTR=Date.now();SEL_HOLD=null},true);
document.addEventListener('beforeinput',()=>{SEL_HOLD=null},true);
document.addEventListener('selectionchange',()=>{const h=SEL_HOLD;if(!h)return;const el=h.el;if(Date.now()>h.until||document.activeElement!==el){SEL_HOLD=null;return}if(el.selectionStart===el.selectionEnd)h.all()});
// Klawisz Dalej (Enter) w polu liczby: zapis i fokus na następnym widocznym polu liczby na ekranie (w #main albo w otwartym arkuszu),
// także bez id; w ostatnim zamyka klawiaturę
function numScope(el){const sc=el.closest&&el.closest('#sheet')?'#sheet':'#main';return [...document.querySelectorAll(`${sc} input[inputmode="decimal"],${sc} input[inputmode="numeric"]`)].filter(x=>x.offsetParent!==null&&!x.classList.contains('wp-in'))}
document.addEventListener('keydown',e=>{const el=e.target;if(e.key!=='Enter'||!el||el.tagName!=='INPUT'||!/^(decimal|numeric)$/.test(el.getAttribute('inputmode')||''))return;
  e.preventDefault();const all=numScope(el),i=all.indexOf(el),n=i>=0?all[i+1]:null;
  el.blur();if(n&&n.isConnected){n.focus();if(n.scrollIntoView){const r=n.getBoundingClientRect();if(r.bottom>innerHeight-90)n.scrollIntoView({block:'center'})}}});
// Klawisz na klawiaturze: „Dalej” w polu liczby, „Gotowe” w ostatnim widocznym polu liczby na ekranie (zgodnie z działaniem Enter powyżej)
document.addEventListener('focusin',e=>{const el=e.target,im=el&&el.getAttribute&&el.getAttribute('inputmode');if(REDRAW||(im!=='decimal'&&im!=='numeric'))return;const all=numScope(el);if(all.indexOf(el)<0)return;el.setAttribute('enterkeyhint',all[all.length-1]===el?'done':'next')});
// Zaznaczenie wartości po wejściu w pole; opóźnione powtórzenia tylko, gdy nic jeszcze nie wpisano (szybkie pisanie nie traci pierwszego znaku)
document.addEventListener('focusin',e=>{const el=e.target,im=el&&el.getAttribute&&el.getAttribute('inputmode');if(!el||(im!=='decimal'&&im!=='numeric')||el.id===SEL_ID)return;SEL_ID=el.id;const v0=String(el.value),all=()=>{if(String(el.value)!==v0)return;try{el.setSelectionRange(0,String(el.value).length)}catch(_){}};all();setTimeout(all,0);if(el.addEventListener&&Date.now()-SEL_PTR<1000){el.addEventListener('click',all,{once:true});SEL_HOLD={el,all,until:Date.now()+500}}});
document.addEventListener('focusout',()=>{if(!REDRAW)SEL_ID=null});
document.addEventListener('focusin',e=>{const k=e.target.dataset&&e.target.dataset.k;if(k&&(!EDIT||EDIT.k!==k))EDIT={k,v:k.split('.').reduce((o,x)=>o==null?o:o[x],S)}});
// Wyjście z pola liczbowego: błędny wpis wraca do wartości sprzed edycji, poprawny jest normalizowany (10 000 -> 10000, 82,4 kg -> 82,4).
// Pełne przerysowanie dopiero, gdy żadne pole nie jest aktywne, żeby nie zamykać klawiatury przy przejściu do następnego pola.
document.addEventListener('focusout',e=>{const el=e.target,k=el.dataset&&el.dataset.k,im=el.getAttribute&&el.getAttribute('inputmode');if(REDRAW||!k||(im!=='decimal'&&im!=='numeric'))return;
  if(el.classList.contains('bad')){const v=EDIT&&EDIT.k===k&&EDIT.v!=null?EDIT.v:'';setPath(k,v);el.value=v;el.classList.remove('bad');el.setAttribute('aria-invalid','false');toast((el.title||'Popraw wartość')+'. Zostaje poprzednia wartość.')}
  else{const c=checkNum(k,el.value);if(c.s!==el.value){setPath(k,c.s);el.value=c.s}
    if(/^meas\.[^.]+\.w$/.test(k)&&num(c.s)>0)PET.react('weigh');if(/^meas\.[^.]+\.sleep$/.test(k)&&num(c.s)>=7)PET.react('sleepok');if(/^(meas\.[^.]+\.ffm|cm)$/.test(k))muscleToast();{const pv=EDIT&&EDIT.k===k&&EDIT.v!=null&&String(EDIT.v).trim()!==''?checkNum(k,String(EDIT.v)).s:'';petHealth(k,c.s,pv)}}
  EDIT=null;save();setTimeout(()=>{const a=document.activeElement;if(!(a&&a.dataset&&a.dataset.k))renderKeep(fieldNow(el))},0)});
document.addEventListener('change',e=>{if(e.target.dataset&&e.target.dataset.labsel){S.labSel=e.target.value;save();render()}});
// Wybór składnika w propozycji z wklejenia: tylko w PROMO_PENDING, bez przerysowania
document.addEventListener('change',e=>{const t=e.target;if(!t||!t.dataset||t.dataset.promoing==null||!PROMO_PENDING)return;const p=PROMO_PENDING[+t.dataset.promoing];if(p)p.ing=ING[t.value]?t.value:''});
// usuń dni starsze niż 60
(function(){const lim=Date.now()-60*864e5;for(const k in S.days){if(new Date(k).getTime()<lim)delete S.days[k]}save()})();
if(!S.onb){S.tab='intro';S.introStep=0}
if(S.onb&&muscleToast())save();
if(typeof location!=='undefined'&&S.onb&&!impFromHash(location.hash)&&quickFromHash(location.hash))QUICK_PENDING=true;
if(typeof window!=='undefined'&&window.addEventListener)window.addEventListener('hashchange',()=>{if(!S.onb)return;if(impFromHash(location.hash))render();else if(quickFromHash(location.hash)){render();quickFocus()}});
render();
if(QUICK_PENDING){QUICK_PENDING=false;quickFocus()}
if(!DEMO)chInit();
// Automatyczna wysyłka kopii dla rady po starcie (bez blokowania widoku)
if(typeof window!=='undefined'&&typeof window.addEventListener==='function')setTimeout(()=>{kopiaAuto().then(ok=>{if(ok&&S.tab==='set')render()})},3000);
