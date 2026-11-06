// ---------- Dane: produkty (wartości na 100 g, orientacyjne, typowe wartości z tabel) ----------
const ING={
  kurczak_piers:{n:'Pierś z kurczaka',k:110,p:23,f:1.5,c:0,chip:'Kurczak'},
  kurczak_udko:{n:'Udko z kurczaka bez skóry',k:130,p:19,f:6,c:0,chip:'Kurczak'},
  indyk_piers:{n:'Pierś z indyka',k:105,p:23,f:1,c:0,chip:'Indyk'},
  indyk_miel:{n:'Mięso mielone z indyka',k:150,p:19,f:8,c:0,chip:'Indyk'},
  dorsz:{n:'Dorsz lub mintaj',k:78,p:18,f:0.7,c:0,chip:'Ryba'},
  losos:{n:'Łosoś',k:200,p:20,f:13,c:0,chip:'Ryba'},
  makrela:{n:'Makrela wędzona',k:220,p:21,f:15,c:0,chip:'Ryba'},
  tunczyk:{n:'Tuńczyk w sosie własnym',k:110,p:25,f:1,c:0,chip:'Ryba'},
  jajko:{n:'Jajka (1 szt. ok. 60 g)',k:140,p:12.5,f:10,c:0.7,chip:'Jajka'},
  twarog:{n:'Twaróg półtłusty',k:130,p:18,f:4.5,c:3.5,chip:'Twaróg'},
  skyr:{n:'Skyr naturalny',k:63,p:11,f:0.2,c:4,chip:'Skyr lub jogurt'},
  jogurt:{n:'Jogurt naturalny 2%',k:60,p:4.3,f:2,c:6,chip:'Skyr lub jogurt'},
  mleko:{n:'Mleko 2%',k:50,p:3.3,f:2,c:4.8},
  tofu:{n:'Tofu naturalne',k:120,p:12,f:7,c:2,chip:'Tofu'},
  soczewica:{n:'Soczewica czerwona (sucha)',k:340,p:24,f:1.5,c:50,chip:'Strączki'},
  ciecierzyca:{n:'Ciecierzyca z puszki (odsączona)',k:120,p:7,f:2.5,c:15,chip:'Strączki'},
  fasola:{n:'Fasola czerwona z puszki (odsączona)',k:100,p:7,f:0.5,c:14,chip:'Strączki'},
  kasza_gr:{n:'Kasza gryczana niepalona, jasna (sucha)',k:340,p:13,f:3,c:62,chip:'Kasza'},
  bulgur:{n:'Kasza bulgur (sucha)',k:340,p:12,f:1.3,c:64,chip:'Kasza'},
  jaglana:{n:'Kasza jaglana (sucha)',k:350,p:11,f:3,c:68,chip:'Kasza'},
  kasza_jecz:{n:'Kasza jęczmienna (sucha)',k:330,p:9,f:2,c:68,chip:'Kasza'},
  ryz:{n:'Ryż brązowy (suchy)',k:360,p:7.5,f:2.7,c:73,chip:'Ryż'},
  ziemniaki:{n:'Ziemniaki',k:77,p:2,f:0.1,c:17,chip:'Ziemniaki lub bataty'},
  bataty:{n:'Bataty',k:86,p:1.6,f:0.1,c:20,chip:'Ziemniaki lub bataty'},
  platki:{n:'Płatki owsiane',k:370,p:13,f:7,c:58,chip:'Płatki owsiane'},
  chleb:{n:'Chleb żytni razowy',k:220,p:6,f:1.5,c:42,chip:'Pieczywo'},
  makaron:{n:'Makaron pełnoziarnisty (suchy)',k:350,p:13,f:2.5,c:63,chip:'Makaron'},
  warzywa:{n:'Mieszanka warzyw (mrożona)',k:40,p:2.5,f:0.3,c:6},
  brokul:{n:'Brokuł',k:34,p:2.8,f:0.4,c:5},
  fasolka:{n:'Fasolka szparagowa',k:31,p:1.8,f:0.2,c:5},
  szpinak:{n:'Szpinak',k:23,p:2.9,f:0.4,c:1.4},
  kapusta:{n:'Kapusta biała',k:25,p:1.3,f:0.1,c:4.5},
  papryka:{n:'Papryka',k:30,p:1,f:0.3,c:5},
  pomidor:{n:'Pomidor',k:18,p:0.9,f:0.2,c:3},
  pom_puszka:{n:'Pomidory krojone z puszki',k:22,p:1.2,f:0.2,c:3.5},
  ogorek:{n:'Ogórek',k:15,p:0.7,f:0.1,c:3},
  cukinia:{n:'Cukinia',k:17,p:1.2,f:0.3,c:2.7},
  cebula:{n:'Cebula',k:40,p:1.1,f:0.1,c:8},
  marchew:{n:'Marchew',k:41,p:0.9,f:0.2,c:8},
  pieczarki:{n:'Pieczarki',k:22,p:3.1,f:0.3,c:3.3},
  rzodkiewka:{n:'Rzodkiewka',k:16,p:0.7,f:0.1,c:3.4},
  oliwa:{n:'Oliwa lub olej rzepakowy',k:884,p:0,f:100,c:0},
  orzechy:{n:'Orzechy włoskie',k:650,p:15,f:65,c:7},
  siemie:{n:'Siemię lniane mielone',k:534,p:18,f:42,c:2},
  maslo_orz:{n:'Masło orzechowe 100%',k:600,p:25,f:50,c:12},
  hummus:{n:'Hummus',k:200,p:7,f:15,c:9},
  owoce:{n:'Owoce leśne (mrożone)',k:45,p:0.8,f:0.4,c:9},
  jablko:{n:'Jabłko',k:52,p:0.3,f:0.2,c:12},
  banan:{n:'Banan',k:89,p:1.1,f:0.3,c:21},
  mandarynka:{n:'Mandarynka',k:53,p:0.8,f:0.3,c:13}
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
  {id:'s1',t:'sniadanie',n:'Owsianka białkowa z owocami leśnymi',min:7,ing:[['platki',50,1],['mleko',200],['skyr',150],['owoce',100],['orzechy',10]],how:'Płatki z mlekiem w dużym kubku do mikrofali, 2 min z przerwą na zamieszanie, potem wmieszać skyr, owoce i orzechy.'},
  {id:'s2',t:'sniadanie',n:'Jajecznica ze szpinakiem i chlebem żytnim',min:10,ing:[['jajko',180],['szpinak',100],['chleb',50,1],['pomidor',100],['oliwa',3]],how:'Jajka roztrzepać ze szpinakiem w misce, mikrofala 2-3 min, mieszając co 30 s.'},
  {id:'s3',t:'sniadanie',n:'Miska skyru z płatkami, siemieniem i jabłkiem',min:3,ing:[['skyr',300],['platki',30,1],['siemie',10],['jablko',120]],how:'Wymieszać w misce. Można przygotować wieczorem.'},
  {id:'s4',t:'sniadanie',n:'Kanapki z twarożkiem i warzywami',min:5,ing:[['chleb',80,1],['twarog',150],['papryka',100],['ogorek',100]],how:'Twaróg z ziołami na chleb, warzywa obok.'},
  {id:'s5',t:'sniadanie',n:'Muffinki owsiane z jogurtem',min:15,ing:[['platki',50,1],['jajko',120],['banan',60],['jogurt',100]],how:'Płatki, jajka i banan zmiksować blenderem, przelać do foremek na muffinki, piec 18-20 min w 180°C. Starcza na 3 dni.'},
  {id:'k1',t:'kolacja',n:'Twarożek z rzodkiewką i chlebem żytnim',min:5,ing:[['twarog',200],['rzodkiewka',80],['chleb',40,1]],how:'Twaróg ze szczypiorkiem, rzodkiewka w plastrach.'},
  {id:'k2',t:'kolacja',n:'Sałatka z tuńczykiem i fasolą',min:7,ing:[['tunczyk',120],['fasola',80],['ogorek',100],['pomidor',100],['oliwa',8]],how:'Wymieszać, doprawić cytryną i pieprzem.'},
  {id:'k3',t:'kolacja',n:'Omlet z warzywami',min:12,ing:[['jajko',180],['warzywa',150],['oliwa',5],['chleb',30,1]],how:'Warzywa i roztrzepane jajka w misce, mikrofala 3 min, mieszając co minutę.'},
  {id:'k4',t:'kolacja',n:'Pasta z makreli i jajka na chlebie',min:7,ing:[['makrela',70],['jajko',60],['jogurt',30],['chleb',60,1],['ogorek',100]],how:'Makrelę bez ości rozgnieść z jajkiem i jogurtem, dodać szczypiorek.'},
  {id:'k5',t:'kolacja',n:'Tofu z warzywami z patelni',min:15,ing:[['tofu',150],['warzywa',200],['oliwa',5]],how:'Tofu i warzywa z czosnkiem piec 25 min w 210°C.'},
  {id:'p1',t:'przekaska',n:'Skyr z owocami leśnymi',min:2,ing:[['skyr',150],['owoce',100]],how:'Owoce rozmrozić w mikrofali albo dodać zamrożone.'},
  {id:'p2',t:'przekaska',n:'Jajka na twardo i ogórek',min:1,ing:[['jajko',120],['ogorek',150]],how:'Z zapasu w lodówce.'},
  {id:'p3',t:'przekaska',n:'Marchewka z hummusem',min:3,ing:[['marchew',150],['hummus',50]],how:'Marchew w słupki.'},
  {id:'p4',t:'przekaska',n:'Jabłko z masłem orzechowym',min:2,ing:[['jablko',150],['maslo_orz',15]],how:'Jabłko w ćwiartkach, łyżka masła orzechowego.'},
  {id:'p5',t:'przekaska',n:'Orzechy i mandarynka',min:1,ing:[['orzechy',20],['mandarynka',100]],how:'Odliczona garść, nie z całej paczki.'},
  {id:'o17',t:'obiad',n:'Zupa krem z soczewicy i marchewki z jajkiem',min:25,ing:[['soczewica',60],['marchew',200],['cebula',50],['oliwa',8],['jajko',60],['chleb',40,1]],how:'Soczewicę, marchew i cebulę w plastrach zalać 600 ml wody w dużej misce, mikrofala pod przykryciem 18-20 min, zmiksować blenderem. Jajko na twardo z zapasu.'},
  {id:'o18',t:'obiad',n:'Bulgur z pieczonym kurczakiem i papryką',min:30,ing:[['kurczak_piers',150],['papryka',200],['cebula',50],['bulgur',60,1],['jogurt',50],['oliwa',8]],how:'Kurczaka, paprykę i cebulę piec 25 min w 200°C. Bulgur zalać podwójną ilością wrzątku z mikrofali i przykryć na 15 min.'},
  {id:'s6',t:'sniadanie',n:'Jaglanka z jabłkiem, cynamonem i skyrem',min:12,ing:[['jaglana',40,1],['mleko',250],['jablko',120],['skyr',150]],how:'Kaszę przelać wrzątkiem na sicie (usuwa gorycz), z mlekiem do mikrofali na 8-10 min, mieszając co 2 min. Dodać starte jabłko, cynamon i skyr.'},
  {id:'p6',t:'przekaska',n:'Koktajl ze skyru, owoców i płatków',min:3,ing:[['skyr',200],['owoce',100],['platki',20,1]],how:'Zmiksować blenderem z odrobiną wody.'}
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
function targetKcal(){const R=rmr(),M=measuredTdee(),f=S.mode==='utrzymanie'?1:0.8;if(M)return Math.max(R,M.tdee*f);return Math.max(R,(R*1.3+trainNet())*f)}
function lastKeys(n){const a=[];for(let i=0;i<n;i++)a.push(keyOf(new Date(Date.now()-i*864e5)));return a}
function measuredTdee(){
  const ks=lastKeys(28).reverse(),W=[],I=[];
  ks.forEach((k,i)=>{const m=(S.meas||{})[k];if(m&&num(m.w)>0)W.push([i,num(m.w)]);const ms=(S.days[k]||[]).filter(e=>e.kind==='m');if(ms.length>=3)I.push(ms.reduce((a,e)=>a+e.k,0))});
  if(W.length<6||I.length<10||W[W.length-1][0]-W[0][0]<14)return null;
  const n=W.length,mx=W.reduce((a,p)=>a+p[0],0)/n,my=W.reduce((a,p)=>a+p[1],0)/n;
  const slope=W.reduce((a,p)=>a+(p[0]-mx)*(p[1]-my),0)/W.reduce((a,p)=>a+(p[0]-mx)**2,0);
  const avgI=I.reduce((a,b)=>a+b,0)/I.length;
  return {tdee:avgI-slope*7700,slope,nW:n,nI:I.length,avgI};
}
function dataGap(){let w=0,i=0;lastKeys(28).forEach(k=>{const m=(S.meas||{})[k];if(m&&num(m.w)>0)w++;if((S.days[k]||[]).filter(e=>e.kind==='m').length>=3)i++});return {w,i}}
function measHtml(){
  const k=todayKey(),m=S.meas[k]||(S.meas[k]={});
  const f=(lab,key,unit,mode,ph)=>`<div class="field"><label for="m_${key}">${lab}</label>${stpWrap(lab,`meas.${k}.${key}`,`<input type="text" inputmode="${mode||'decimal'}" placeholder="${ph||''}" id="m_${key}" data-k="meas.${k}.${key}" value="${esc(m[key]||'')}">`)}<span class="unit">${unit}</span></div>`;
  let h='<h2>Pomiary dnia</h2><p class="small muted">Waga rano, po toalecie, przed jedzeniem. Kroki i sen przepisz z zegarka. Obwody co 2 tygodnie. Sen w godzinach: 7 h 30 min to 7,5 albo 7:30.</p><div class="panel">'+f('Waga','w','kg')+f('Kroki (zegarek)','steps','','numeric')+f('Sen (zegarek)','sleep','h','decimal','np. 7,5')+'</div>'+cycHtml(k)+'<details class="fold" data-fold="obwody"'+(OPEN_F.has('obwody')?' open':'')+'><summary>Obwody, co 2 tygodnie</summary><div class="panel">'+f('Talia','waist','cm')+f('Biodra','hip','cm')+f('Udo','thigh','cm')+'</div></details><details class="fold" data-fold="tanita"'+(OPEN_F.has('tanita')?' open':'')+'><summary>Skład ciała (BIA), raz na 4 tygodnie</summary><div class="panel">'+f('Tłuszcz (BIA)','fat','%')+f('FFM (BIA)','ffm','kg')+f('ECW/TBW (BIA)','ecw','%')+f('BMR (BIA, kJ ÷ 4,184)','bmr','kcal','numeric')+'</div><p class="small muted" style="padding:0 16px">Pomiar BIA najlepiej zawsze w tych samych warunkach: rano, na czczo, po toalecie, bez treningu dzień wcześniej (wiedza ogólna). Wpisany BMR z pomiaru BIA zastępuje wzór przez 90 dni, a waga z pomiarów zastępuje wagę z ustawień.</p></details>';
  const ks=lastKeys(28).reverse(),val=(x,key)=>{const v=num((S.meas[x]||{})[key]);return v>0?v:null};
  const avg=a=>{const v=a.filter(x=>x!=null);return v.length?v.reduce((s,x)=>s+x,0)/v.length:null};
  const ws=ks.map(x=>val(x,'w')),w1=avg(ws.slice(-7)),w0=avg(ws.slice(-14,-7)),st=avg(ks.slice(-7).map(x=>val(x,'steps'))),sl=avg(ks.slice(-7).map(x=>val(x,'sleep')));
  const t=[];
  if(w1!=null)t.push(`Średnia wagi z 7 dni: ${fmt1(w1)} kg${w0!=null?`, tydzień wcześniej ${fmt1(w0)} kg, zmiana ${w1-w0>0?'+':''}${fmt1(w1-w0)} kg`:''}.`);
  [['waist','Talia','cm'],['hip','Biodra','cm'],['thigh','Udo','cm']].forEach(([key,lab,u])=>{const s=ks.map(x=>val(x,key)).filter(v=>v!=null);if(s.length>=2)t.push(`${lab}: z ${fmt1(s[0])} na ${fmt1(s[s.length-1])} ${u} w ostatnich 28 dniach.`)});
  const k90=lastKeys(90).reverse();[['fat','Tłuszcz','%'],['ffm','FFM','kg'],['ecw','ECW/TBW','%']].forEach(([key,lab,u])=>{const s=k90.map(x=>val(x,key)).filter(v=>v!=null);if(s.length===1)t.push(`${lab}: ${fmt1(s[0])} ${u} (jeden pomiar).`);else if(s.length>=2)t.push(`${lab}: z ${fmt1(s[0])} na ${fmt1(s[s.length-1])} ${u} w ostatnich 90 dniach.`)});
  if(st!=null)t.push(`Kroki, średnia z 7 dni: ${fmt(st)}.`);
  if(sl!=null)t.push(`Sen, średnia z 7 dni: ${fmt1(sl)} h.`);
  const pc=ks.slice(-7).filter(x=>(S.meas[x]||{}).cyc==='P'&&val(x,'w')!=null).length;if(pc)t.push(`${pc} ${pc===1?'ważenie':'ważenia'} z ostatnich 7 dni w przerwie w tabletkach: woda może wtedy podnieść wagę (wiedza ogólna).`);
  const pts=ws.map((v,i)=>v==null?null:[i,v]).filter(Boolean);let svg='',svgCap='';
  if(pts.length>=5){const ys=pts.map(p=>p[1]),mn=Math.min(...ys),mx=Math.max(...ys),r=mx-mn||1;svgCap=`<p class="small muted">Waga z 28 dni: od ${fmt1(mn)} do ${fmt1(mx)} kg.</p>`;svg=`<svg viewBox="0 0 280 60" width="100%" height="60" role="img" aria-label="Waga z 28 dni"><polyline fill="none" stroke="var(--green)" stroke-width="2" points="${pts.map(p=>`${(p[0]/27*270+5).toFixed(1)},${(55-(p[1]-mn)/r*50).toFixed(1)}`).join(' ')}"/></svg>`}
  if(t.length||svg)h+=fold('trendy','Trendy pomiarów',`<div class="note" style="margin:0">${svg}${svgCap}${t.map(x=>`<p>${x}</p>`).join('')}<p class="small muted">Pojedyncze ważenie waha się przez wodę nawet o 1-2 kg (wiedza ogólna); decyduje średnia z tygodnia.</p></div>`);
  return h;
}
function planIds(){const sw=(S.swaps||{})[todayKey()]||{};return PLAN[new Date().getDay()].map((id,i)=>sw[i]||id)}
function shopLines(){const agg={};for(const d of [0,1,2,3,4,5,6])PLAN[d].forEach(id=>MEALS.find(m=>m.id===id).ing.forEach(([i,g])=>{agg[i]=(agg[i]||0)+g}));return Object.keys(ING).filter(i=>agg[i]).map(i=>i==='jajko'?`Jajka: ${Math.ceil(agg[i]/60)} szt.`:`${ING[i].n}: ${Math.ceil(agg[i]/10)*10} g`)}
function shopHtml(){const L=shopLines();return `<details class="fold" id="zakupy"><summary>Lista zakupów na tydzień z planu (${L.length} pozycji)</summary><div class="panel">`+L.map(l=>{const [a,b]=l.split(': ');return `<div class="entry"><span class="txt">${a}</span><span class="val">${b}</span></div>`}).join('')+'</div><p class="small muted" style="padding:0 16px">Ilości dla 7 dni planu, bez zamian i bez dodatkowych porcji węglowodanów po treningu. Przyprawy, sól i cytryna poza listą.</p><p style="padding:0 16px 12px"><button class="btn ghost" data-shop="1">Kopiuj listę</button></p></details>'}
function planHtml(){
  const ids=planIds(),d=day(),cm=carbMult(),por=num(S.f.portion)||1,ms=d.filter(e=>e.kind==='m'),logged=new Set(ms.map(e=>e.id));
  const left=targetKcal()-ms.reduce((a,e)=>a+e.k,0),now=slotNow();
  const rec=ids.map(id=>MEALS.find(m=>m.id===id)).find(m=>m.t===now&&!logged.has(m.id));
  let h=`<p><button class="btn sos" data-tab="sos">Mam ochotę coś przekąsić</button></p><h2 id="plan">Dziś według planu</h2><p class="small muted">${[0,6].includes(new Date().getDay())?'Weekend: jedno większe danie, jest więcej czasu.':'Dzień roboczy: obiad do 20 min.'} ${left>=0?`Zostało ok. ${fmt(left)} kcal na dziś.`:`Cel dnia przekroczony o ok. ${fmt(-left)} kcal.`} Jedno dotknięcie zapisuje posiłek.</p><div class="panel">`;
  const pk=ids.map(id=>macros(MEALS.find(m=>m.id===id),cm,por)),tk=pk.reduce((a,b)=>a+b.k,0),tp=pk.reduce((a,b)=>a+b.p,0),room=targetKcal()-tk;
  const base=PLAN[new Date().getDay()];
  h+=ids.map((id,i)=>{const m=MEALS.find(x=>x.id===id),x=macros(m,cm,por),done=logged.has(id);return `<div class="entry"><span class="txt"><span class="small muted">${SLOT_T[m.t]}${m.t==='kolacja'&&postTrain()?', po treningu':''}${id!==base[i]?', Twój wybór':''}${rec&&rec.id===id?', polecane teraz':''}</span><br><button class="linkbtn" data-recipe="${id}">${m.n}</button>${done?'':`<br><button class="linkbtn small" data-swap="${i}" style="color:var(--muted);font-size:13px">zamień na inne</button>`}</span><span class="val">${fmt(x.k)} kcal</span>${done?'<span class="val">✓</span>':`<button class="btn" data-addmeal="${id}">Zjem</button>`}</div>`}).join('');
  h+=`<p class="small muted" style="padding:0 16px 12px">Plan dnia: ${fmt(tk)} kcal i ${fmt(tp)} g białka przy celu ${fmt(targetKcal())} kcal.${room>=50?` Zostaje ok. ${fmt(room)} kcal na dodatek albo większą porcję.`:''}</p>`;
  return h+'</div>';
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
  const bs=[];for(let i=1;i<=7;i++){const b=balanceFor(keyOf(new Date(Date.now()-i*864e5)));if(b!=null)bs.push(b)}
  const goal=num(S.goal)||68,toLose=kg()-goal,M=measuredTdee(),planDef=(M?M.tdee:rmr()*1.3)-targetKcal();
  const line=(def,lab)=>{if(def<=0)return `<p>${lab}: bilans zerowy lub dodatni, masa ciała nie spada.</p>`;const w=def*7/7700;return `<p>${lab}: deficyt ok. ${fmt(def)} kcal dziennie, czyli ok. ${fmt1(w)} kg tygodniowo${toLose>0?`; ${fmt1(goal)} kg za ok. ${fmt(Math.ceil(toLose/w))} tyg.`:'.'}</p>`};
  let h='<h2>Dokąd prowadzą wybory</h2><div class="note">';
  h+=bs.length?line(-bs.reduce((a,b)=>a+b,0)/bs.length,`Średnia z ${bs.length} ${bs.length===1?'zapisanego dnia':'zapisanych dni'} z ostatniego tygodnia`):'<p>Po kilku dniach zapisów pojawi się tu tempo liczone z Twoich danych.</p>';
  const G=dataGap();
  h+=M?`<p><b>Zapotrzebowanie zmierzone: ok. ${fmt(M.tdee)} kcal.</b> Średnio ${fmt(M.avgI)} kcal jedzenia, trend wagi ${M.slope>0?'+':''}${fmt1(M.slope*7)} kg tygodniowo; ${M.nW} ważeń, ${M.nI} pełnych dni.</p>${M.slope<0&&-M.slope*7>kg()*0.01?'<p>Tempo powyżej 1% masy ciała tygodniowo: rozważ mniejszy deficyt (wiedza ogólna).</p>':''}`:`<p>Zapotrzebowanie na razie ze wzoru. Do pomiaru potrzeba w ostatnich 28 dniach co najmniej 6 ważeń rozłożonych na 14 dni i 10 dni z co najmniej 3 zapisanymi posiłkami. Jest: ${G.w} ważeń, ${G.i} takich dni.</p>`;
  h+=S.mode==='utrzymanie'?maintHtml():line(planDef,'Przy trzymaniu się celu dnia');
  h+=`<p class="small muted">Codzienna przekąska 200 kcal ponad plan to ok. ${fmt1(200*30/7700)} kg mniej spadku w miesiącu. Przelicznik 7700 kcal na kg to uproszczenie: tempo z czasem maleje, bo organizm dostosowuje wydatek energii. Niepełny zapis dnia zawyża deficyt.</p></div>`;
  return h;
}
function logUrge(out){const k=todayKey();(S.urges[k]=S.urges[k]||[]).push({h:new Date().getHours(),trig:S.sosTrig,out})}
function urgeStats(){
  const all=[];for(let i=0;i<14;i++){(S.urges[keyOf(new Date(Date.now()-i*864e5))]||[]).forEach(u=>all.push(u))}
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
    h+=`<h2>Twój plan</h2><div class="panel" style="padding:10px 16px"><textarea data-k="ifthen" rows="3" aria-label="Twój plan na ochotę" style="width:100%;font:inherit;border:1px solid var(--line);border-radius:10px;padding:8px;background:var(--bg);color:var(--ink)">${esc(S.ifthen)}</textarea></div>`;
    const left=Math.max(0,Math.ceil((sosEnd-Date.now())/1000));
    h+=sosEnd?`<section class="readout"><h3>Przerwa przed decyzją</h3><div class="big" id="sosclock" style="font-size:44px;font-weight:700;text-align:center">${mmss(left)}</div></section>`:'<p><button class="btn" data-sosstart="1">Start 10 minut przerwy</button></p>';
    h+='<h2>Po przerwie</h2><div class="panel"><button class="opt" data-sosout="minela"><span>Ochota minęła</span></button><button class="opt" data-sosout="plan"><span>Zjem planowaną przekąskę</span></button><button class="opt" data-sosout="inne"><span>Zjem coś innego</span></button></div>';
    if(st==='inne')h+=`<div class="panel"><div class="field"><label for="s_n">Co</label><input type="text" id="s_n" style="width:170px;text-align:left" placeholder="np. ciastka"></div><div class="field"><label for="s_k">Ile, w przybliżeniu</label><input type="text" inputmode="numeric" id="s_k" placeholder="0"><span class="unit">kcal</span></div></div><p><button class="btn" data-sossave="1">Zapisz</button></p><p class="small muted">Zapis jest ważniejszy niż sam wybór. Dla skali: 100 kcal to ok. ${fmt(100/walkPerMin())} min spaceru, ${(()=>{const l=targetKcal()-eatenToday();return l>=0?`a dziś zostało ok. ${fmt(l)} kcal.`:`a cel dnia jest już przekroczony o ok. ${fmt(-l)} kcal; zapis i tak się liczy.`})()}</p>`;
  }
  h+='<h2>Twoje ochoty</h2><div class="note">'+urgeStats()+'</div>';
  document.getElementById('main').innerHTML=h;
}

// ---------- Zdrowie: suplementy, badania, białko za złotówkę ----------
const PROT=[['twarog','Twaróg półtłusty',18],['jajka','Jajka (10 szt. to ok. 600 g)',12.5],['skyr','Skyr naturalny',11],['kurczak','Pierś z kurczaka',23],['soczewica','Soczewica czerwona (sucha)',24],['tunczyk','Tuńczyk w sosie własnym (masa po odsączeniu)',25],['tofu','Tofu naturalne',12],['wpc','Odżywka białkowa WPC (sprawdź etykietę)',75]];
const SUPP=[
  {n:'Witamina D3',v:'Warto',d:'Według polskich wytycznych z 2023 r. 1000-2000 j.m. dziennie, gdy brakuje słońca; przy nadwadze często dawka podwójna. Najlepiej dobrać po badaniu 25(OH)D.',e:'Wytyczne krajowe.',w:'Z posiłkiem zawierającym tłuszcz.'},
  {n:'Kreatyna (monohydrat)',v:'Warto przy treningu siłowym',d:'3-5 g dziennie, codziennie, o dowolnej porze.',e:'Mocne: stanowisko ISSN, także dla kobiet.',w:'Może podnieść kreatyninę w badaniu krwi; powiedz o niej lekarzowi (wiedza ogólna, niesprawdzone).'},
  {n:'Odżywka białkowa',v:'Wygoda, nie konieczność',d:'Porcja 20-30 g białka, gdy z jedzenia brakuje do celu dnia.',e:'Białko z jedzenia działa tak samo; odżywka to wygodne źródło.',w:'Opłacalność sprawdzisz w kalkulatorze poniżej.'},
  {n:'Magnez',v:'Po badaniu lub z zalecenia lekarza',d:'Dawkę przy niedoborze ustala lekarz. Zapotrzebowanie kobiety to 310-320 mg dziennie łącznie z dietą.',e:'Bez potwierdzonego niedoboru korzyść niepewna (wniosek).',w:'Antykoncepcja hormonalna może obniżać magnez. Odstęp 4 h od lewotyroksyny, jeśli ją przyjmujesz.'},
  {n:'Selen',v:'Do rozmowy z lekarzem',d:'W badaniach 80-400 µg dziennie przez 2-12 miesięcy.',e:'Umiarkowane: obniża TSH u osób bez lewotyroksyny i przeciwciała anty-TPO; nie ma go w wytycznych.',w:'Nadmiar selenu szkodzi; nie łączyć kilku preparatów z selenem (wiedza ogólna).'},
  {n:'Żelazo',v:'Tylko przy niskiej ferrytynie',d:'Dawkę ustala lekarz po badaniu.',e:'Bez niedoboru brak korzyści (wiedza ogólna).',w:'Odstęp 4 h od lewotyroksyny.'},
  {n:'Błonnik (babka płesznik, psyllium)',v:'Rozważ, jeśli warzyw i kasz jest mało',d:'Zacznij od 1 łyźeczki z dużą szklanką wody, zwiększaj powoli.',e:'Umiarkowane dla sytości i glikemii (wiedza ogólna, niesprawdzone).',w:'Odstęp 2-4 h od leków i suplementów.'},
  {n:'Beta-alanina',v:'Niski priorytet',d:'4-6 g dziennie przez co najmniej 4 tygodnie.',e:'Umiarkowane, ale tylko dla wysiłków trwających 1-4 min (ISSN).',w:'Mrowienie skóry jest nieszkodliwe. Przy 2-3 treningach w tygodniu korzyść mała (wniosek).'},
  {n:'Cytrulina',v:'Najniższy priorytet',d:'W badaniach 6-8 g ok. godzinę przed treningiem.',e:'Słabe: efekt mały i niespójny.',w:'Pieniądze lepiej wydać na białko z jedzenia (wniosek).'},
  {n:'Probiotyki, enzymy trawienne',v:'Bez zalecenia nie',d:'Tylko przy konkretnych dolegliwościach, po rozmowie z lekarzem.',e:'Słabe i rozproszone dla ogólnego trawienia (wiedza ogólna).',w:'Na trawienie najpierw: błonnik stopniowo, woda, regularne posiłki.'},
  {n:'Biotyna (też w preparatach na włosy)',v:'Uwaga przed badaniami',d:'Odstaw 2-3 dni przed badaniem tarczycy.',e:'Zaburza wyniki TSH i fT4 w części testów (wiedza ogólna, niesprawdzone).',w:'Sprawdź skład multiwitamin.'},
  {n:'Jod w tabletkach',v:'Nie bez lekarza',d:'Przy Hashimoto bez zalecenia nie suplementować.',e:'Wiedza ogólna, niesprawdzone.',w:'Sól jodowana i ryby zwykle wystarczają.'}
];
function protCost(){return PROT.map(([id,n,pp])=>{const r=S.prices[id]||{},p=num(r.p),g=num(r.g);return {id,n,pp,c:p>0&&g>0?p/(g*pp/100)*20:null}})}
function renderHealth(){
  let h='<p><button class="btn" data-tab="labs" style="width:100%">Moje badania</button></p><div class="note"><b>Co realne.</b> Przy chorobach przewlekłych, np. tarczycy, celem jest dobra kontrola wyników i objawów, nie wyleczenie. Insulinooporność często wyraźnie się poprawia przy spadku masy ciała, ruchu i śnie. Niedobory wyrównuje się według wyników badań.</div>';
  h+=cardsHtml('health')+visitHtml();
  const box=(title,items)=>`<details class="fold"><summary>${title}</summary><div class="panel">`+items.map(([a,b])=>`<div class="entry"><span class="txt"><b>${a}.</b> ${b}</span></div>`).join('')+'</div></details>';
  h+=box('Woda, uda i pośladki',[
    ['Waga skacze z dnia na dzień','Wahania o 1-2 kg to głównie woda: sól, węglowodany, cykl, trening (wiedza ogólna). Dlatego aplikacja patrzy na średnią z tygodnia i trend z 2-4 tygodni.'],
    ['Co zmniejsza zatrzymanie wody','Mniej żywności wysoko przetworzonej i słonej, warzywa i strączki, ruch łydek w ciągu dnia, sen (wiedza ogólna). Bez tabletek odwadniających na własną rękę.'],
    ['Kiedy do lekarza','Obrzęk zostawiający dołek po uciśnięciu, nagły obrzęk jednej nogi, obrzęk z dusznością. Niedoczynność tarczycy i antykoncepcja z estrogenem też mogą sprzyjać zatrzymaniu wody (wiedza ogólna, niesprawdzone).'],
    ['Lipodemia to nie woda','Tkanka przy lipodemii jest symetryczna, często bolesna i zwykle oszczędza stopy. Na objawy: ruch, zwłaszcza w wodzie, i kompresja dobrana przez lekarza.'],
    ['Uda i pośladki','Tkanki tłuszczowej nie da się spalić tylko w wybranym miejscu: w badaniu 12 tygodni treningu jednej nogi tłuszcz w tej nodze nie spadł. Działa deficyt plus trening siłowy całego ciała; mierz obwody uda i bioder, nie tylko wagę.']
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
  h+='<details class="fold"><summary>Suplementy ('+SUPP.length+')</summary>'+SUPP.map(s=>`<article class="meal"><div class="mhead"><div class="name">${s.n}</div><div class="meta">${s.v}</div></div><div class="mdet" style="border-top:0"><p class="small"><b>Dawka:</b> ${s.d}</p><p class="small"><b>Dowody:</b> ${s.e}</p><p class="small"><b>Uwaga:</b> ${s.w}</p></div></article>`).join('')+'</details>';
  h+='<h2>Białko za złotówkę</h2><p class="small muted">Wpisz cenę z półki lub paragonu i wagę opakowania. Wynik to koszt 20 g białka. Ceny zapisują się w telefonie.</p><div class="panel">'+protCost().map(r=>`<div class="field" style="flex-wrap:wrap"><label style="flex:1 1 100%">${r.n}</label><input type="text" inputmode="decimal" data-k="prices.${r.id}.p" value="${esc(S.prices[r.id].p)}" placeholder="cena" aria-label="Cena: ${r.n}"><span class="unit">zł</span><input type="text" inputmode="numeric" data-k="prices.${r.id}.g" value="${esc(S.prices[r.id].g)}" aria-label="Waga opakowania: ${r.n}"><span class="unit">g</span></div>`).join('')+'</div>';
  const ranked=protCost().filter(r=>r.c!=null).sort((a,b)=>a.c-b.c);
  if(ranked.length)h+='<h2>Ranking</h2><div class="panel">'+ranked.map((r,i)=>`<div class="entry"><span class="txt">${i+1}. ${r.n}</span><span class="val">${r.c.toFixed(2).replace('.',',')} zł za 20 g</span></div>`).join('')+'</div>';
  h+='<h2>Źródła</h2><ol class="src"><li><a href="https://pubmed.ncbi.nlm.nih.gov/36771403/" target="_blank" rel="noopener">Wytyczne witaminy D w Polsce, aktualizacja 2023</a></li><li><a href="https://pubmed.ncbi.nlm.nih.gov/37221858/" target="_blank" rel="noopener">Stanowisko ISSN: żywienie kobiet aktywnych fizycznie (kreatyna)</a></li><li><a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4501114/" target="_blank" rel="noopener">Stanowisko ISSN: beta-alanina</a></li><li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10951571" target="_blank" rel="noopener">Metaanaliza: selen w Hashimoto (Thyroid 2024)</a></li></ol><p class="small muted">Aplikacja nie zastępuje lekarza. Suplementy omawiaj z lekarzem, zwłaszcza przy zmianie leków.</p>';
  document.getElementById('main').innerHTML=h;
}

// ---------- Badania: wyniki z laboratorium, normy wyłącznie z wydruku ----------
const LABS=[
  {id:'tsh',n:'TSH',u:'µIU/ml',thy:1,note:'Antykoncepcja z estrogenem zmienia głównie białka wiążące hormony tarczycy; wyniki interpretuje lekarz z tą informacją (wiedza ogólna).'},
  {id:'ft4',n:'fT4',u:'ng/dl',thy:1,note:'Jednostka zależy od laboratorium (ng/dl albo pmol/l); przepisz ją z wydruku.'},
  {id:'ft3',n:'fT3',u:'pg/ml',thy:1,note:'Jednostka zależy od laboratorium (pg/ml albo pmol/l); przepisz ją z wydruku.'},
  {id:'atpo',n:'Anty-TPO',u:'IU/ml',thy:1,note:'Przeciwciała służą głównie potwierdzeniu Hashimoto; ich zmiana nie zawsze zmienia leczenie (wiedza ogólna).'},
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
  {id:'kreat',n:'Kreatynina',u:'mg/dl',note:'Kreatyna może podnosić kreatyninę we krwi (wiedza ogólna, niesprawdzone); zaznacz, jeśli ją przyjmujesz.'},
  {id:'testo',n:'Testosteron (M, przy objawach)',u:'ng/dl',note:'U mężczyzn przy objawach, zwykle rano (wiedza ogólna).'}
];
const LABN=Object.fromEntries(LABS.map(x=>[x.id,x]));
function fmtDate(d){return d?d.slice(8,10)+'.'+d.slice(5,7)+'.'+d.slice(0,4):''}
function labStatus(e){const L=LABN[e.test],T=L&&L.tg;if(!T)return {t:'brak jednego zakresu docelowego; oceniaj trend z lekarzem',w:0};const v=toCanon(T,e),tt=tgTxt(T);if(v==null)return {t:'jednostka nierozpoznana, nie da się porównać z celem ('+tt+')',w:1};const lo=typeof T.lo==='function'?T.lo():T.lo;if(lo!=null&&v<lo)return {t:'poniżej zakresu docelowego: '+tt,w:1};if((T.hi!=null&&v>T.hi)||(T.lt!=null&&v>=T.lt))return {t:'powyżej zakresu docelowego: '+tt,w:1};return {t:'w zakresie docelowym: '+tt,w:0}}
function homaRows(){const out=[],ins=S.labs.filter(e=>e.test==='ins');S.labs.filter(e=>e.test==='glu').forEach(x=>{const y=ins.find(z=>z.date===x.date);if(y)out.push({date:x.date,v:num(x.val)*num(y.val)/(/mmol/i.test(x.unit)?22.5:405)})});return out.sort((a,b)=>b.date.localeCompare(a.date))}
function nextControl(){const ds=S.labs.map(e=>e.date).filter(Boolean).sort();if(!ds.length)return null;const last=ds.at(-1),n=new Date(Date.parse(last)+90*864e5).toISOString().slice(0,10);return {last,n,overdue:n<todayKey()}}
function renderLabs(){
  const sel=LABN[S.labSel]?S.labSel:'tsh',L=LABN[sel],inp='font:inherit;font-size:16px;padding:6px 8px;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink)';
  let h='<p><button class="btn ghost" data-tab="health">Wróć</button></p>';
  const nc=nextControl();
  h+=nc?`<div class="note ${nc.overdue?'warn':''}">Ostatnie badania: ${fmtDate(nc.last)}. Następna kontrola według planu, co 3 miesiące: ${fmtDate(nc.n)}${nc.overdue?'; termin minął':''}.</div>`:'<div class="note">Brak wyników. Zacznij od kompletu: TSH, fT4, fT3, anty-TPO, glukoza i insulina na czczo, HbA1c, 25(OH)D, ferrytyna, magnez, wapń.</div>';
  h+='<h2>Dodaj wynik</h2><div class="panel">';
  h+=`<div class="field"><label for="l_test">Badanie</label><select id="l_test" data-labsel="1" style="${inp};max-width:210px">${LABS.map(x=>`<option value="${x.id}" ${x.id===sel?'selected':''}>${x.n}</option>`).join('')}</select></div>`;
  h+=`<div class="field"><label for="l_date">Data pobrania</label><input type="date" id="l_date" value="${todayKey()}" style="${inp}"></div>`;
  h+='<div class="field"><label for="l_val">Wynik</label><input type="text" inputmode="decimal" id="l_val"><span class="unit"></span></div>';
  h+=`<div class="field"><label for="l_unit">Jednostka z wydruku</label><input type="text" id="l_unit" value="${esc(L.u)}"><span class="unit"></span></div>`;
  h+='<div class="field"><label for="l_fast">Na czczo</label><input type="checkbox" class="switch" id="l_fast"></div>';
  if(L.thy)h+='<div class="field"><label for="l_bio">Biotyna odstawiona co najmniej 2-3 dni</label><input type="checkbox" class="switch" id="l_bio"></div>';
  if(S.sex==='K')h+='<div class="field"><label for="l_cyc">Tydzień cyklu lub przerwa w tabletkach</label><input type="text" id="l_cyc" placeholder="np. 2"><span class="unit"></span></div>';
  if(sel==='kreat')h+='<div class="field"><label for="l_cr">Przyjmuję kreatynę</label><input type="checkbox" class="switch" id="l_cr"></div>';
  h+='</div><p><button class="btn" data-labsave="1">Zapisz wynik</button></p>';
  h+=L.tg?`<p class="small"><b>Zakres docelowy:</b> ${tgTxt(L.tg)}. Źródło: ${L.tg.src}.</p>`:'<p class="small muted">Dla tego badania nie ma jednego zakresu docelowego: wynik zależy od metody laboratorium. Aplikacja pokaże trend, ocenę zostaw lekarzowi.</p>';
  if(L.note)h+=`<p class="small muted">${L.note}</p>`;
  const tested=LABS.filter(x=>S.labs.some(e=>e.test===x.id));
  if(tested.length)h+='<h2>Wyniki</h2>'+tested.map(x=>{const es=S.labs.filter(e=>e.test===x.id).sort((a,b)=>b.date.localeCompare(a.date));return `<article class="meal"><div class="mhead"><div class="name">${x.n}</div></div><div class="mdet" style="border-top:0">`+es.map((e,i)=>{const st=labStatus(e),prev=es.at(i+1),d=prev?num(e.val)-num(prev.val):null,norm='',ctx=[e.fast?'na czczo':'',x.thy&&e.bio===false?'biotyna nieodstawiona':'',e.cyc?`tydzień cyklu ${esc(e.cyc)}`:'',e.cr?'przy kreatynie':''].filter(Boolean).join(', ');return `<div class="entry" style="padding:8px 0"><span class="txt">${fmtDate(e.date)}: <b>${esc(e.val)} ${esc(e.unit)}</b>${d!=null?` <span class="small muted">(${d>0?'+':''}${fmt1(d)} od poprzedniego)</span>`:''}<br><span class="small" style="color:${st.w?'var(--clay)':'var(--muted)'}">${st.t}${norm}${ctx?'; '+ctx:''}</span></span><button class="del" data-labdel="${e.id}" aria-label="Usuń wynik">×</button></div>`}).join('')+'</div></article>'}).join('');
  const hr=homaRows();
  if(hr.length)h+=`<div class="note"><b>HOMA-IR</b>, z glukozy i insuliny z tego samego dnia (wzór Matthewsa): ${hr.map(r=>`${fmtDate(r.date)}: ${fmt1(r.v)}`).join('; ')}. Progi interpretacji różnią się między źródłami; ocenia lekarz.</div>`;
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
function onceHtml(){const k=todayKey(),m=S.meas[k]||{},ms=day().filter(e=>e.kind==='m').length,tr=day().some(e=>e.kind==='t'),st=num(m.steps)>0;
  const row=(ok,lab,val,btns)=>`<div class="step${ok?' done':''}"><span class="box">${ok?'✓':''}</span><span class="lab">${lab}<small class="hint">${val}</small></span>${ok?'':btns}</div>`;
  return '<h2>Wpis dnia</h2><div class="panel" style="padding:4px 16px">'
    +row(ms>0,'Posiłki',ms?ms+' zapisane':'Jak wyglądało dziś jedzenie?','<button class="btn small" data-dayplan="1">Według planu</button><button class="btn small ghost" data-dayother="1">Inaczej</button>')
    +row(tr,'Trening',tr?'zapisany':'Tylko jeśli dziś był','<button class="btn small ghost" data-tab="train">Z zegarka</button>')
    +row(st,'Kroki',st?fmt(num(m.steps))+' kroków':'Liczba z telefonu','<button class="btn small ghost" data-goto="m_steps">Wpisz</button>')+'</div>'
    +(ms>0&&(tr||st)?'<div class="note">✓ Dzień zapisany. Do jutra wieczorem.</div><p class="nextbar"><button class="btn" data-tab="pet" style="width:100%">Zobacz zwierzaka</button></p>':'')}
function focusHtml(){if(S.once)return onceHtml();const k=todayKey(),m=S.meas[k]||{},ms=day().filter(e=>e.kind==='m').length,tr=day().some(e=>e.kind==='t'),st=num(m.steps)>0;const items=[[num(m.w)>0,'Zważ się rano',num(m.w)>0?fmt1(num(m.w))+' kg':'','goto','m_w','Wpisz wagę w Pomiarach dnia niżej'],[ms>=3,'Zapisz 3 posiłki',ms+' z 3','tab','meals','Otwórz Posiłki i naciśnij Zjem przy daniu'],[tr||st,(S.knee&&S.knee.start&&S.knee.days.includes(new Date().getDay())?'Ruch: dziś sesja kolana':'Ruch: trening albo kroki'),tr?'trening':(st?fmt(num(m.steps))+' kroków':''),'tab','train','Dodaj trening albo wpisz kroki w Pomiarach dnia']];const done=items.filter(x=>x[0]).length,nx=items.findIndex(x=>!x[0]);return `<h2>Dziś: ${done} z 3</h2><div class="panel">`+items.map(([ok,lab,val,act,arg,hint],i)=>`<button class="opt hab ${ok?'on':(i===nx?'next':'')}" data-${act}="${arg}"><span class="box">${ok?'✓':''}</span><span class="lab">${lab}${ok?'':`<small class="hint">${hint}</small>`}</span><span class="met">${val}</span><span class="chev" aria-hidden="true">›</span></button>`).join('')+'</div>'}
function firstDataDay(){const ks=Object.keys(S.days||{}).filter(k=>(S.days[k]||[]).some(e=>e.kind==='m')).sort();return ks[0]||null}
function reliability(){const f=firstDataDay();if(!f)return null;const span=Math.max(1,Math.min(14,Math.round((Date.parse(todayKey())-Date.parse(f))/864e5)+1));let md=0,wd=0;lastKeys(span).forEach(k=>{if((S.days[k]||[]).filter(e=>e.kind==='m').length>=3)md++;if(num((S.meas[k]||{}).w)>0)wd++});return {span,md,wd,pct:Math.round(md/span*100)}}
function relHtml(){const r=reliability();if(!r||r.span<7)return '';const M=measuredTdee(),G=dataGap(),low=r.pct<60;return `<details class="fold"${low?' open':''}><summary>Jakość danych: ${r.pct}% dni z pełnym zapisem</summary><div class="panel" style="padding:4px 16px 12px"><p>Ostatnie ${r.span} ${r.span===1?'dzień':'dni'}: pełny zapis posiłków (co najmniej 3) w ${r.md}, ważenie w ${r.wd}.</p>${low?'<p><b>Poniżej 60%.</b> Uprość: zapisuj z planu dnia przyciskiem „Zjem”, resztę szybkim wpisem.</p>':''}<p>${M?'Zapotrzebowanie liczone z Twoich danych: aktywne.':`Do zapotrzebowania z Twoich danych brakuje w ostatnich 28 dniach: ${Math.max(0,6-G.w)} ważeń (rozłożonych na co najmniej 14 dni) i ${Math.max(0,10-G.i)} dni z pełnym zapisem.`}</p><p class="small muted">Próg 60% to założenie planu, nie wynik badań.</p></div></details>`}
function mondayOf(d){const x=new Date(d);x.setHours(12,0,0,0);x.setDate(x.getDate()-((x.getDay()+6)%7));return keyOf(x)}
function reviewKey(){const d=new Date();return d.getDay()===0?mondayOf(d):mondayOf(new Date(Date.now()-7*864e5))}
function weekStats(mk){const base=Date.parse(mk+'T12:00:00'),ks=Array.from({length:7},(_,i)=>keyOf(new Date(base+i*864e5))),pk=Array.from({length:7},(_,i)=>keyOf(new Date(base+(i-7)*864e5)));const aw=a=>{const v=a.map(k=>num((S.meas[k]||{}).w)).filter(x=>x>0);return v.length?v.reduce((s,x)=>s+x,0)/v.length:null};let md=0,pts=0,ur=0,uok=0;ks.forEach(k=>{if((S.days[k]||[]).filter(e=>e.kind==='m').length>=3)md++;pts+=dayPts(k);(S.urges[k]||[]).forEach(u=>{ur++;if(u.out!=='inne')uok++})});return {ks,w:aw(ks),pw:aw(pk),md,pts,ur,uok}}
function reviewPromptHtml(){const dw=new Date().getDay();if(![0,1,2].includes(dw)||(S.reviews||{})[reviewKey()])return '';return '<p><button class="btn" data-tab="review" style="width:100%">Przegląd tygodnia: 3 pytania, 2 minuty</button></p>'}
function changeHtml(){const r=Object.entries(S.reviews||{}).sort((a,b)=>b[0].localeCompare(a[0]))[0];if(!r||!r[1].c||Date.now()-Date.parse(r[0]+'T12:00:00')>14*864e5)return '';return `<div class="note"><b>Twoja zmiana na ten tydzień:</b> ${esc(r[1].c)}</div>`}
function renderReview(){
  const mk=reviewKey(),st=weekStats(mk),ex=(S.reviews||{})[mk]||{},end=st.ks.at(-1);
  const ta=(id,lab,ph,v)=>`<h2>${lab}</h2><div class="panel" style="padding:10px 16px"><textarea id="${id}" rows="2" placeholder="${ph}" aria-label="${lab}" style="width:100%;font:inherit;border:1px solid var(--line);border-radius:10px;padding:8px;background:var(--bg);color:var(--ink)">${esc(v||'')}</textarea></div>`;
  let h='<p><button class="btn ghost" data-tab="day">Wróć</button></p>';
  h+=`<div class="note"><b>Tydzień ${fmtDate(mk)}-${fmtDate(end)}</b><br>Pełny zapis posiłków: ${st.md} z 7 dni. Punkty: ${fmt(st.pts)}. Ochoty: ${st.ur}${st.ur?`, w tym ${st.uok} bez jedzenia spoza planu`:''}.${st.w!=null?` Średnia waga: ${fmt1(st.w)} kg${st.pw!=null?`, tydzień wcześniej ${fmt1(st.pw)} kg`:''}.`:' Brak ważeń w tym tygodniu.'}</div>`;
  h+=ta('r_a','Co zadziałało?','np. przekąska w torbie w pracy',ex.a)+ta('r_b','Co nie zadziałało?','np. podjadanie po 15:00',ex.b)+ta('r_c','Jedna zmiana na przyszły tydzień','np. herbata o 15:00 zamiast ciastka',ex.c);
  h+='<p><button class="btn" data-revsave="1" style="width:100%">Zapisz przegląd</button></p><p class="small muted">Jedna zmiana naraz. Zobaczysz ją przez tydzień na górze Mojego dnia.</p>';
  document.getElementById('main').innerHTML=h;
}
function renderIntro(){
  const s=S.introStep||0,next=(a,l)=>`<p><button class="btn" style="width:100%" data-${a}="1">${l}</button></p>`;
  let h='<div style="display:flex;gap:8px;justify-content:center;margin:8px 0 16px" aria-label="Krok '+(s+1)+' z 5">'+[0,1,2,3,4].map(i=>`<span style="width:${i===s?24:8}px;height:8px;border-radius:4px;background:${i===s?'var(--green)':'var(--line)'}"></span>`).join('')+'</div>';
  if(s===0)h+='<h2 style="font-size:24px">Plan na zdrową wagę, bez kartki i wyrzutów</h2><p>Aplikacja podpowiada, co zjeść, liczy kalorie z Twoich danych i pokazuje, dokąd prowadzą wybory.</p>'+next('intronext','Dalej');
  if(s===1)h+='<h2 style="font-size:24px">Codziennie tylko 3 rzeczy</h2><div class="panel"><div class="entry"><span class="txt"><b>1.</b> Zważ się rano</span></div><div class="entry"><span class="txt"><b>2.</b> Zapisz posiłki jednym dotknięciem „Zjem”</span></div><div class="entry"><span class="txt"><b>3.</b> Ruch: trening albo kroki z zegarka</span></div></div><p>Gdy łapie ochota na przekąskę, naciśnij przycisk „Mam ochotę coś przekąsić”. Reszta jest opcjonalna.</p>'+next('intronext','Dalej');
  if(s===2)h+='<h2 style="font-size:24px">Wybierz towarzysza</h2><p>Gąska albo kaczuszka reaguje na Twoje wpisy: posiłki, ruch, sen i nawyki. Imię nadasz od razu albo później w Ustawieniach.</p>'+petPickHtml()+next('intronext','Dalej');
  if(s===3)h+='<h2 style="font-size:24px">Twoje dane</h2><div class="panel">'+field('Waga','kg',S.kg,'kg')+field('Wzrost','cm',S.cm,'cm','numeric')+field('Wiek','age',S.age,'lat','numeric')+field('Waga docelowa','goal',S.goal,'kg')+'</div>'+seg([['K','Kobieta'],['M','Mężczyzna']],S.sex,'sex')+'<p class="small muted">Zmienisz je w każdej chwili w Ustawieniach.</p>'+next('intronext','Dalej');
  if(s>=4)h+='<h2 style="font-size:24px">Gotowe</h2><p>Na górze Mojego dnia czekają pierwsze kroki: pokażą, co uzupełnić i dokąd przejść.</p><p>Dane zostają tylko w tym telefonie. Badania, suplementy i wiedzę znajdziesz w zakładce Zdrowie. Wprowadzenie otworzysz ponownie w Ustawieniach.</p>'+next('introdone','Zaczynam');
  if(s<4)h+='<p style="text-align:center"><button class="btn ghost" data-introdone="1">Pomiń</button></p>';
  document.getElementById('main').innerHTML=h;
}

// ---------- Profil płci, cykl, nogi ----------
function stageInfo(){const ks=Object.keys(S.meas||{}).filter(k=>num(S.meas[k].w)>0).sort();if(!ks.length)return null;const start=num(S.meas[ks[0]].w),now=kg(),goal=start*0.95;return {start,now,goal,pct:Math.max(0,Math.min(100,(start-now)/(start-goal)*100)),since:ks[0]}}
function ffmTrend(){const ks=Object.keys(S.meas||{}).filter(k=>num(S.meas[k].ffm)>0).sort();if(ks.length<2)return null;return {a:num(S.meas[ks[0]].ffm),b:num(S.meas[ks.at(-1)].ffm),from:ks[0],to:ks.at(-1)}}
function sexHtml(){
  const si=stageInfo(),pT=Math.round(1.4*(num(S.goal)||68));let h='<h2>Twój priorytet</h2><div class="note">';
  if(S.sex==='K'){
    h+=`<p><b>Ochrona mięśni.</b> W badaniu PREVIEW kobiety traciły przy redukcji więcej masy beztłuszczowej niż mężczyźni. Dlatego: białko ok. ${pT} g dziennie i 2 treningi siłowe w tygodniu.</p>`;
    const f=ffmTrend();
    if(f){const d=f.b-f.a;h+=d<=-0.5?`<p><b>FFM spadła o ${fmt1(-d)} kg</b> (${fmtDate(f.from)} do ${fmtDate(f.to)}). Sprawdź białko i treningi. Pojedynczy pomiar BIA może się mylić, potwierdź go kolejnym w tych samych warunkach.</p>`:`<p>FFM: z ${fmt1(f.a)} na ${fmt1(f.b)} kg, bez wyraźnego spadku.</p>`}
    else h+='<p class="small muted">Wpisuj FFM z pomiaru BIA co 4 tygodnie, żeby aplikacja pilnowała mięśni.</p>';
  }else if(S.mode==='utrzymanie'){
    h+='<p><b>Utrzymanie masy.</b> Priorytet: trening siłowy, średnia waga w paśmie ±1 kg i kontrola badań. Gdyby kiedyś zaczął się etap redukcji: w badaniu DiOGenes mężczyźni szybciej chudli, ale częściej odzyskiwali masę.</p>';
  }else{
    h+='<p><b>Utrzymanie po szybkim starcie.</b> W badaniu DiOGenes mężczyźni chudli szybciej, ale w ciągu 6 miesięcy odzyskiwali więcej masy niż kobiety. Dlatego po etapie 5% przejdź do utrzymania, zanim zaczniesz kolejny etap.</p>';
  }
  if(si&&S.mode!=='utrzymanie')h+=`<p>Etap 5%: z ${fmt1(si.start)} na ${fmt1(si.goal)} kg, wykonano ${Math.round(si.pct)}%.${si.pct>=100?(S.sex==='M'?' <b>Etap osiągnięty: czas na utrzymanie.</b>':' <b>Etap osiągnięty.</b> Ocena z lekarzem i decyzja: utrzymanie albo kolejny etap.'):''}</p>`;
  return h+'</div>';
}
function cycHtml(k){if(S.sex!=='K')return '';const c=(S.meas[k]||{}).cyc||'';return '<p style="margin:10px 4px 4px">Tydzień cyklu dziś</p><div class="chips">'+[['1','1'],['2','2'],['3','3'],['4','4'],['P','Przerwa w tabletkach']].map(([v,l])=>`<button class="chip ${c===v?'inc':''}" data-cyc="${v}">${l}</button>`).join('')+'</div>'}
function legHtml(){
  if(S.sex!=='K'||!S.lip)return '';
  const L=S.legs||{},ks=Object.keys(L).filter(k=>L[k].b!=null&&L[k].c!=null).sort(),last=ks.at(-1),k=todayKey(),cur=L[k]||{};
  const ago=last?Math.round((Date.parse(k)-Date.parse(last))/864e5):null,trend=ks.length>=2?` Pierwszy wpis ${fmtDate(ks[0])}: ból ${L[ks[0]].b}, ciężkość ${L[ks[0]].c}.`:'';
  if(last&&last!==k&&ago<7)return `<details class="fold"><summary>Nogi: ból ${L[last].b}, ciężkość ${L[last].c} (${fmtDate(last)})</summary><div class="panel" style="padding:4px 16px 12px"><p>Następny wpis za ${7-ago} ${7-ago===1?'dzień':'dni'}.${trend}</p></div></details>`;
  const row=(key,lab)=>`<p style="margin:10px 0 4px">${lab}</p><div class="chips">`+[0,1,2,3,4,5,6,7,8,9,10].map(n=>`<button class="chip ${cur[key]===n?'inc':''}" data-leg="${key}:${n}" style="min-width:38px">${n}</button>`).join('')+'</div>';
  return `<h2>Nogi, raz w tygodniu</h2><div class="panel" style="padding:4px 16px 12px">${row('b','Ból nóg (0 brak, 10 najgorszy)')}${row('c','Uczucie ciężkości nóg')}<p class="small muted">Przy lipodemii obwód uda spada wolno; ból i ciężkość pokazują, czy ruch i kompresja działają.${trend}</p></div>`;
}

// ---------- Tryb utrzymania ----------
function avg7at(k){const b=Date.parse(k+'T12:00:00'),v=[];for(let i=0;i<7;i++){const x=num((S.meas[keyOf(new Date(b-i*864e5))]||{}).w);if(x>0)v.push(x)}return v.length?v.reduce((a,c)=>a+c,0)/v.length:null}
function avg7(){return avg7at(todayKey())}
function flat3w(){const W=[];lastKeys(21).reverse().forEach((k,i)=>{const v=num((S.meas[k]||{}).w);if(v>0)W.push([i,v])});if(W.length<6||W.at(-1)[0]-W[0][0]<14)return false;const n=W.length,mx=W.reduce((a,p)=>a+p[0],0)/n,my=W.reduce((a,p)=>a+p[1],0)/n,sl=W.reduce((a,p)=>a+(p[0]-mx)*(p[1]-my),0)/W.reduce((a,p)=>a+(p[0]-mx)**2,0);return Math.abs(sl*7)<0.1}
function modeHtml(){if(S.mode==='utrzymanie')return '';const si=stageInfo(),done=si&&si.pct>=100,flat=flat3w();if(!done&&!flat)return '';return `<div class="note"><b>${done?'Etap 5% osiągnięty.':'Waga stoi od 3 tygodni.'}</b> Zamiast dokręcać dietę, przejdź na 4-8 tygodni utrzymania: cel bez deficytu, średnia waga w paśmie ±1 kg.<p><button class="btn" data-mode="utrzymanie">Przejdź na utrzymanie</button></p></div>`}
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
function postTrain(){const dw=new Date().getDay();return day().some(e=>e.kind==='t')||dw===2||dw===4}
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
  let h=`<p><button class="btn ghost" data-tab="${S.recipeBack||'meals'}">Wróć</button></p><div class="rec"><h2 class="rt">${m.n}</h2><div class="chips">`+[`${m.min} min`,...eqOf(m),...(m.prep?['z zapasu']:[])].map(t=>`<span class="chip">${t}</span>`).join('')+'</div>';
  h+=`<div class="panel" style="padding:12px 16px"><div class="mnum" style="padding:0"><span><b>${fmt(x.k)}</b> kcal</span><span class="p">B ${fmt(x.p)} g</span><span class="f">T ${fmt(x.f)} g</span><span class="c">W ${fmt(x.c)} g</span></div><div class="bar" style="margin:10px 0 0" aria-hidden="true"><i style="width:${x.p*4/tot*100}%;background:var(--p)"></i><i style="width:${x.f*9/tot*100}%;background:var(--f)"></i><i style="width:${x.c*4/tot*100}%;background:var(--c)"></i></div></div>`;
  h+='<h3 class="rh">Składniki, 1 porcja</h3><div class="panel">'+x.items.map((it,i)=>`<div class="entry"><span class="txt">${it.n}</span><span class="val">${hhm(m.ing[i][0],it.g)}</span></div>`).join('')+'</div>';
  if(cm!==1||por!==1)h+=`<p class="small muted">Porcja przeliczona: węglowodany ×${fmt1(cm)}, wielkość ×${fmt1(por)}.</p>`;
  h+='<h3 class="rh">Przygotowanie</h3><ol class="steps">'+steps.map(s=>`<li>${s}</li>`).join('')+'</ol>';
  h+=tipsHtml(m,x);
  h+=`<p class="small muted">${leftTxt(x.k)}</p>${m.ing.some(i=>i[0]==='tofu')?'<p class="small muted">Jeśli przyjmujesz lewotyroksynę: soję jedz co najmniej 4 godziny po leku (wiedza ogólna, niesprawdzone).</p>':''}${planIds().includes(m.id)?'<p class="small muted">W planie na dziś. Wieczorem „Według planu” zapisze to danie.</p>':`<p><button class="btn" data-cook="${m.id}" style="width:100%">Gotuję to dziś</button></p>`}<p><button class="btn${planIds().includes(m.id)?'':' ghost'}" data-addmeal="${m.id}" style="width:100%">Zjem, zapisz</button></p><p><button class="btn ghost" data-copy="${m.id}" style="width:100%">Kopiuj składniki</button></p><p class="small muted">Gramatury produktów suchych przed ugotowaniem. Miary domowe są przybliżone: łyżka oleju ok. 10 g, kromka chleba ok. 40 g, jajko ok. 60 g.</p></div>`;
  document.getElementById('main').innerHTML=h;
}

// ---------- Program kolana: struktura z badania Kise i wsp. (BMJ 2016) ----------
const KNEE_EX={
  nm:[['Stanie na jednej nodze przy blacie',['3 × 20 s na nogę','3 × 30 s na nogę','3 × 30 s, z zamkniętymi oczami']],['Przenoszenie ciężaru w przód, w bok i w tył',['2 × 8 w każdą stronę','2 × 10, kolano nad stopą','3 × 10, wolniej']],['Krok w bok z gumą nad kolanami',['2 × 8 kroków w każdą stronę','2 × 10 kroków','3 × 10, mocniejsza guma']],['Wejście na niski stopień z kontrolą kolana',['2 × 6 na nogę, kolano nie ucieka do środka','2 × 8 na nogę','3 × 8 na nogę']]],
  st:[['Przysiad do krzesła w zakresie bez bólu',['2 × 10','3 × 10','3 × 8 z plecakiem z wodą']],['Most biodrowy',['2 × 12','3 × 12','3 × 10 na jednej nodze']],['Wyprost kolana w siadzie z gumą',['2 × 12','3 × 12','3 × 10, mocniejsza guma']],['Uginanie kolana z gumą',['2 × 12','3 × 12','3 × 10, mocniejsza guma']],['Wspięcia na palce',['2 × 15','3 × 15','3 × 12 na jednej nodze']]]
};
function kneeWeek(){const s=S.knee.start;if(!s)return 0;return Math.max(1,Math.min(12,Math.floor((Date.parse(todayKey())-Date.parse(s))/(7*864e5))+1))}
function kneeBannerHtml(){const K=S.knee;if(!K.start)return '';const dw=new Date().getDay(),t=todayKey(),done=K.sessions.some(x=>x.d===t),last=K.sessions.at(-1),y=keyOf(new Date(Date.now()-864e5));let h='';if(last&&last.d===y&&!K.morning[t])h+='<div class="note"><b>Kolano rano po wczorajszej sesji:</b><div class="chips" style="margin-top:8px">'+['lepiej','tak samo','gorzej'].map(v=>`<button class="chip" data-kmorn="${v}">${v}</button>`).join('')+'</div></div>';if(K.days.includes(dw)&&!done)h+='<p><button class="btn" data-tab="knee" style="width:100%">Dziś sesja programu kolana</button></p>';return h}
function renderKnee(){
  const K=S.knee,wk=kneeWeek(),n=K.sessions.length,ph=wk<=4?0:wk<=8?1:2,today=todayKey(),done=K.sessions.find(x=>x.d===today);
  let h='<p><button class="btn ghost" data-tab="train">Wróć</button></p><div class="note warn">Program z badania dotyczył osób w wieku 35-60 lat ze zwyrodnieniowym uszkodzeniem łąkotki potwierdzonym rezonansem. Przed startem: diagnoza u ortopedy, a ćwiczenia zatwierdza fizjoterapeuta.</div>';
  h+=K.start?`<div class="note"><b>Tydzień ${wk} z 12. Sesje: ${n} z 24.</b> ${n>=24?'Pełny program jak w badaniu.':n>=19?'Poziom zadowalający według badania (19-23 sesje); każda kolejna się liczy.':'Każda sesja się liczy; po przerwie wracasz od ostatniego poziomu.'}</div>`:'<p><button class="btn" data-kstart="1" style="width:100%">Zaczynam program (12 tygodni)</button></p>';
  const last=K.sessions.at(-1);
  if(last){const nd=keyOf(new Date(Date.parse(last.d+'T12:00:00')+864e5)),mo=K.morning[nd];const r=(last.pain>3||mo==='gorzej')?'Zostań na obecnym poziomie albo zrób krok wstecz. Jeśli to się powtórzy w 2 kolejnych sesjach: fizjoterapeuta.':mo?'Kolano dobrze znosi obciążenie: w następnej sesji możesz dodać serię albo trudniejszą wersję.':last.d===today?'Jutro rano oceń kolano: od tego zależy progresja.':'Brak oceny poranka po ostatniej sesji: zostań na obecnym poziomie.';h+=`<div class="note"><b>Ostatnia sesja ${fmtDate(last.d)}: ból ${last.pain}/10${mo?', rano '+mo:''}.</b> ${r}</div>`}
  const cr=K.sessions.filter(x=>x.cramp&&Date.parse(today)-Date.parse(x.d)<14*864e5).length;
  if(cr>=2)h+=`<div class="note warn">Skurcze mięśni w ${cr} sesjach z ostatnich 14 dni. Przy tężyczce sprawdź magnez i wapń w Moich badaniach.</div>`;
  h+='<h2>Sesja według protokołu z badania</h2><div class="panel">'+[['Rozgrzewka','ok. 10 min rowerka stacjonarnego'],['Ćwiczenia nerwowo-mięśniowe','20-30 min: równowaga i kontrola kolana'],['Ćwiczenia siłowe','20-30 min, z progresją'],['Schłodzenie','ok. 10 min rowerka']].map(([a,b])=>`<div class="entry"><span class="txt"><b>${a}.</b> ${b}</span></div>`).join('')+'</div><p class="small muted">W badaniu: 12 tygodni, 2-3 sesje tygodniowo po 60-80 minut, łącznie ok. 20 minut rozgrzewki i schłodzenia na rowerku.</p>';
  const ex=(title,L)=>`<details class="fold"><summary>${title}</summary><div class="panel">`+L.map(([a,b])=>`<div class="entry"><span class="txt"><b>${a}</b><br><span class="small muted">${b[ph]}</span></span></div>`).join('')+'</div></details>';
  h+=ex(`Nerwowo-mięśniowe, poziom ${ph+1} z 3`,KNEE_EX.nm)+ex(`Siłowe, poziom ${ph+1} z 3`,KNEE_EX.st);
  h+='<p class="small muted">Lista ćwiczeń z badania jest w rycinach publikacji, których nie sprawdziłem. Powyższe to przykłady do zatwierdzenia przez fizjoterapeutę (wniosek), z poziomami na tygodnie 1-4, 5-8 i 9-12.</p>';
  const cp=K.tmpPain!=null?K.tmpPain:(done?done.pain:null),cc=K.tmpCramp!=null?K.tmpCramp:(done?done.cramp:false);
  h+=`<h2>${done?'Dzisiejsza sesja zapisana':'Zapisz dzisiejszą sesję'}</h2><div class="panel" style="padding:4px 16px 12px"><p style="margin:10px 0 4px">Ból kolana w trakcie (0 brak, 10 najgorszy)</p><div class="chips">`+[0,1,2,3,4,5,6,7,8,9,10].map(v=>`<button class="chip ${cp===v?'inc':''}" data-kpain="${v}" style="min-width:38px">${v}</button>`).join('')+`</div><p style="margin:12px 0 4px">Skurcze mięśni w trakcie</p><div class="chips"><button class="chip ${cc?'inc':''}" data-kcramp="1">tak, były skurcze</button></div><p class="small muted">Ból kolana oceniaj osobno od bólu nóg przy lipodemii.</p></div><p><button class="btn" data-ksave="1" style="width:100%">${done?'Popraw zapis sesji':'Zapisz sesję (60 min)'}</button></p>`;
  h+='<h2>Dni sesji</h2><div class="chips">'+[[1,'pn'],[2,'wt'],[3,'śr'],[4,'cz'],[5,'pt'],[6,'sb'],[0,'nd']].map(([v,l])=>`<button class="chip ${K.days.includes(v)?'inc':''}" data-kday="${v}">${l}</button>`).join('')+'</div><p class="small muted">Sesja zastępuje trening siłowy z planu w te dni, nie dochodzi do niego. Na rowerku przy lipodemii pomaga kompresja, jeśli lekarz ją zalecił.</p>';
  h+='<h2>Po 12 tygodniach</h2><div class="note">Ból do 3/10 i rano bez pogorszenia: powrót wykroków i głębszych przysiadów. W przeciwnym razie: ortopeda.</div>';
  document.getElementById('main').innerHTML=h;
}

// ---------- Mój wpływ: decyzje i zmierzone efekty ----------
function avgAgo(a,b,key){const v=[];for(let i=a;i<b;i++){const x=num((S.meas[keyOf(new Date(Date.now()-i*864e5))]||{})[key||'w']);if(x>0)v.push(x)}return v.length?v.reduce((s,x)=>s+x,0)/v.length:null}
function ser(key,n){return lastKeys(n).reverse().map(k=>num((S.meas[k]||{})[key])).filter(v=>v>0)}
function impactData(){const T=targetKcal(),pT=1.4*(num(S.goal)||68);let full=0,planDays=0,protDays=0,planned=0,extra=0,trainN=0,urAll=0,urOk=0;lastKeys(28).forEach(k=>{const e=S.days[k]||[],ms=e.filter(x=>x.kind==='m');if(ms.length>=3){full++;if(ms.reduce((a,x)=>a+x.k,0)<=T)planDays++;if(ms.reduce((a,x)=>a+(x.p||0),0)>=pT)protDays++}ms.forEach(x=>{if(x.id)planned++;else extra+=x.k});trainN+=e.filter(x=>x.kind==='t').length;(S.urges[k]||[]).forEach(u=>{urAll++;if(u.out!=='inne')urOk++})});return {full,planDays,protDays,planned,extra,trainN,urAll,urOk,pT}}
function renderImpact(){
  const D=impactData(),M=measuredTdee(),goal=num(S.goal)||68,toLose=kg()-goal,maint=S.mode==='utrzymanie',W=S.wi||{snack:0,steps:0,train:0};
  const planDef=(M?M.tdee:rmr()*1.3)-targetKcal(),base=maint?0:(M?-M.slope*7:planDef*7/7700),kps=walkPerMin()/100,tn=kcal({met:3.5},60).net;
  const dW=(-(W.snack*200)+W.steps*7*kps+W.train*tn)/7700,nw=base+dW,wk=p=>p>0&&toLose>0?`, ${fmt1(goal)} kg za ok. ${fmt(Math.ceil(toLose/p))} tygodni`:'';
  const chips=(key,vals,lab)=>`<p style="margin:12px 0 4px">${lab}</p><div class="chips">`+vals.map(v=>`<button class="chip ${W[key]===v?'inc':''}" data-wi="${key}:${v}">${fmt(v)}</button>`).join('')+'</div>';
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
  h+=duo('Zdrowie',[st!=null?`Kroki, średnia 7 dni: ${fmt(st)}`:'Kroki: brak wpisów z 7 dni',sl!=null?`Sen, średnia 7 dni: ${fmt1(sl)} h`:'Sen: brak wpisów z 7 dni'],labs);
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
async function chNames(){try{const ids=Object.keys(CH.rows);if(!ids.length)return;const ps=await CH.user.profiles(ids);ids.forEach(i=>{CH.names[i]=(ps[i]&&ps[i].name)||''});chRerender()}catch(e){}}
async function chInit(){
  const c=globalThis.claude;if(!c||typeof c.use!=='function'){CH.state='off';return}
  try{
    const [db,u]=await Promise.all([c.use('db'),c.use('user')]);if(!db||!u){CH.state='off';chRerender();return}
    const id=await u.id();if(!id){CH.state='off';chRerender();return}
    CH.db=db;CH.user=u;CH.me=id;CH.state='on';
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
    h+=seg([['wspolpraca','Współpraca'],['rywalizacja','Rywalizacja']],S.chMode,'chmode');
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
function fold(id,title,inner){return `<details class="fold" data-fold="${id}"${OPEN_F.has(id)?' open':''}><summary>${title}</summary><div style="padding:0 12px 12px">${inner}</div></details>`}
document.addEventListener('toggle',e=>{const t=e.target;if(t&&t.dataset&&t.dataset.fold){t.open?OPEN_F.add(t.dataset.fold):OPEN_F.delete(t.dataset.fold)}},true);

// ---------- Kopia danych: eksport i import pliku (np. przez iCloud Drive) ----------
const BK_SKIP=['tab','introStep','sosStep','sosTrig','recipe','recipeBack','labSel'];
let BK_PENDING=null;
function bkBuild(noHealth){const d=JSON.parse(JSON.stringify(S));BK_SKIP.forEach(k=>delete d[k]);if(d.kopia)delete d.kopia.token;if(d.knee){d.knee.tmpPain=null;d.knee.tmpCramp=null}if(noHealth){d.labs=[];d.urges={};d.legs={};d.pain={};d.visit=null;Object.values(d.meas||{}).forEach(m=>{delete m.fat;delete m.ffm;delete m.ecw;delete m.bmr;delete m.cyc})}return JSON.stringify({app:'talerz-i-trening',v:1,created:new Date().toISOString(),noHealth:!!noHealth,data:d})}
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
  let h=`<h2 id="kopia">Kopia danych</h2><div class="panel" style="padding:4px 16px 12px"><p class="small">Kopia to plik ze wszystkimi danymi z tego telefonu. Zapisz go w aplikacji Pliki na iCloud Drive, a na drugim telefonie wczytaj z tego samego miejsca.</p><p class="small muted">Ostatnia kopia: ${S.lastBackup?fmtDate(S.lastBackup):'jeszcze nie było'}. Dobry moment: dzień pomiaru BIA, raz na 4 tygodnie.</p><div class="field" style="padding:8px 0"><label for="bk_nh">Bez danych zdrowotnych (do udostępnienia innej osobie)</label><input type="checkbox" class="switch" id="bk_nh" data-k="bkNoHealth" ${S.bkNoHealth?'checked':''}></div><p><button class="btn" data-bkexp="1" style="width:100%">Zapisz kopię</button></p><p style="margin:14px 0 6px">Wczytaj kopię</p><label class="btn ghost" style="display:flex;align-items:center;justify-content:center;width:100%">Wybierz plik kopii z Plików<input type="file" id="bk_file" accept=".json,application/json" style="display:none"></label>`;
  h+=fold('bkpaste','albo wklej tekst kopii','<textarea id="bk_text" rows="3" aria-label="Tekst kopii" style="width:100%;font:inherit;border:1px solid var(--line);border-radius:10px;padding:8px;background:var(--bg);color:var(--ink)"></textarea><p><button class="btn ghost" data-bkpaste="1">Sprawdź kopię</button></p>');
  if(BK_PENDING)h+=`<div class="note warn"><b>Kopia z ${fmtDate(String(BK_PENDING.created||'').slice(0,10))}${BK_PENDING.noHealth?', bez danych zdrowotnych':''}:</b> ${bkSummary(BK_PENDING.data)}. Wczytanie zastąpi wszystkie dane w tym telefonie.<p><button class="btn" data-bkapply="1">Zastąp dane</button> <button class="btn ghost" data-bkcancel="1">Anuluj</button></p></div>`;
  h+='<p class="small muted">Plik nie jest zaszyfrowany i zawiera dane zdrowotne. Trzymaj go w prywatnym folderze. Włączona Zaawansowana ochrona danych w iCloud szyfruje iCloud Drive tak, że klucze mają tylko Twoje urządzenia (wiedza ogólna, niesprawdzone).</p></div>';
  return h+radaKopiaHtml();
}
document.addEventListener('change',e=>{const t=e.target;if(!t||t.id!=='bk_file'||!t.files||!t.files[0])return;const r=new FileReader();r.onload=()=>{const o=bkParse(String(r.result));if(!o){BK_PENDING=null;toast('To nie jest kopia tej aplikacji');return}BK_PENDING=o;render()};r.readAsText(t.files[0])});

// ---------- Stan ----------
const LS='talerz-trening-v1';
const DEF={kg:'80',cm:'170',age:'35',sex:'K',goal:'72',korekta:true,tab:'meals',
  f:{type:'obiad',chips:{},minP:0,maxK:1000,maxC:130,carb:'auto',portion:1,sort:'p'},
  tr:{wmin:'',wk:'',cat:'silownia',opt:{silownia:'nogi',plywanie:'kraul1',inne:'nordic'},bMode:'marsz',speed:'5',grade:'3',sMode:'w',watts:'100',sClass:'spin',min:'45'},
  days:{},hab:{},urges:{},meas:{},labs:[],labSel:'tsh',onb:false,introStep:0,reviews:{},pet:null,body:false,once:false,toastLen:'std',tips:{},pain:{},cardsOk:{},discreet:false,consent:null,kopia:null,visit:null,petSeen:[],petCeleb:null,guide:{hidden:false,dataOk:false,seenPet:false},legs:{},lip:false,mode:'redukcja',maintRef:0,maintSince:'',knee:{start:'',sessions:[],morning:{},days:[2,4,6],tmpPain:null,tmpCramp:null},wi:{snack:0,steps:0,train:0},chMode:'wspolpraca',bkNoHealth:false,lastBackup:'',prices:{twarog:{p:'',g:'250'},jajka:{p:'',g:'600'},skyr:{p:'',g:'150'},kurczak:{p:'',g:'1000'},soczewica:{p:'',g:'400'},tunczyk:{p:'',g:'120'},tofu:{p:'',g:'180'},wpc:{p:'',g:'700'}},sosStep:'trig',sosTrig:'',ifthen:'Jeśli w pracy czuję stres i ochotę na przekąskę, to najpierw piję herbatę i wychodzę na 5 minut, a potem, jeśli dalej chcę, jem przygotowaną przekąskę białkową.'};
function clone(o){return JSON.parse(JSON.stringify(o))}
function merge(a,b){for(const k in b){if(b[k]&&typeof b[k]==='object'&&!Array.isArray(b[k])&&a[k]&&typeof a[k]==='object'&&!Array.isArray(a[k]))merge(a[k],b[k]);else a[k]=b[k];}return a}
function load(){try{const r=localStorage.getItem(LS);if(r)return merge(clone(DEF),JSON.parse(r));}catch(e){}return clone(DEF)}
function save(){if(DEMO)return;try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}try{chSync()}catch(e){}}
// Tryb pokazowy (#demo): dane przykładowe w pamięci, bez zapisu; zwierzak co 3 s pokazuje kolejny stan
let DEMO=typeof location!=='undefined'&&location.hash==='#demo',DEMO_I=0;
let S=DEMO?merge(clone(DEF),PET.demo().S):load();
if(DEMO)setInterval(()=>{DEMO_I++;const a=document.activeElement;if((S.tab==='day'||S.tab==='pet')&&!(a&&a.dataset&&a.dataset.k))render()},3000);
const open=new Set();

// ---------- Obliczenia ----------
const num=v=>{const s=String(v).trim().replace(/(\d)[\s\u00a0]+(?=\d{3}(\D|$))/g,'$1'),t=s.match(/^(\d{1,2})\s*(?::|h)\s*(\d{1,2})?\s*(?:m|min)?$/i);if(t)return +t[1]+(+(t[2]||0))/60;const x=parseFloat(s.replace(',','.'));return isFinite(x)?x:0};
// Pola liczbowe: format i zakres (ostatni człon klucza data-k). Wpis błędny lub poza zakresem nie trafia do danych.
const STEP={kg:.1,goal:.5,w:.1,cm:1,age:1,steps:500,sleep:.5,waist:.5,hip:.5,thigh:.5,fat:.1,ffm:.1,ecw:.1,bmr:10,min:5,wmin:5,wk:10,speed:.5,grade:.5,watts:5};
const STP0={sleep:7,steps:5000,wmin:45,wk:300,min:45,speed:5,grade:0,watts:100,cm:165,age:30};
// Pierwsze naciśnięcie pustego pola: ostatnia zapisana wartość (waga z ostatniego ważenia), inaczej typowa
function stpStart(k){const a=k.split('.'),f=a[a.length-1];if(a[0]==='meas'){const ks=Object.keys(S.meas||{}).filter(x=>x<a[1]&&num((S.meas[x]||{})[f])>0).sort();if(ks.length)return num(S.meas[ks[ks.length-1]][f]);if(f==='w')return kg()}if(f==='goal')return kg();if(f==='kg')return kg();return STP0[f]!=null?STP0[f]:LIM[f][0]}
function stpFmt(v,st){return st<1?String(Math.round(v*10)/10).replace('.',','):String(Math.round(v))}
const LIM={kg:[35,250],goal:[35,250],w:[35,250],cm:[120,220],age:[16,90],steps:[0,60000],sleep:[0,16],waist:[30,200],hip:[30,200],thigh:[20,120],fat:[3,60],ffm:[25,120],ecw:[30,50],bmr:[900,3000],min:[1,300],wmin:[1,300],wk:[10,3000],speed:[1,20],grade:[0,25],watts:[20,500]};
const INT_K=new Set(['steps','bmr','age','min','wmin','wk']);
function checkNum(k,raw){const key=String(k).split('.').pop();let s=String(raw).trim();if(s==='')return {s};if(INT_K.has(key))s=s.replace(/[\s\u00a0.](?=\d{3}(\D|$))/g,'');const core=key==='sleep'?s:s.replace(/\s*(kg|cm|h|%|kcal|lat|min|km\/h|w|g|zł)$/i,'');const ok=key==='sleep'?/^(\d{1,2}([.,]\d+)?|\d{1,2}\s*(:|h)\s*(\d{1,2})?\s*(m|min)?)$/i.test(s):/^\d+([.,]\d+)?$/.test(core);if(!ok)return {s,err:key==='sleep'?'Sen w godzinach, np. 7,5 albo 7:30':'Wpisz samą liczbę, np. 82,4'};const r=LIM[key],v=num(core);if(r&&(v<r[0]||v>r[1]))return {s,err:'Dozwolone '+fmt1(r[0])+'-'+fmt1(r[1])};return {s:core}}
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
function habOn(x,h,ents,k){if(x.auto==='z')return num((S.meas[k]||{}).sleep)>=7||!!h[x.id];if(x.auto==='t')return ents.some(e=>e.kind==='t')||!!h[x.id];if(x.auto==='m')return ents.filter(e=>e.kind==='m').length>=3;if(x.auto==='s')return ((S.urges||{})[k]||[]).some(u=>u.out!=='inne')||!!h[x.id];if(x.auto==='u'){if(S.mode!=='utrzymanie')return false;const a=avg7at(k),r=num(S.maintRef)||kg();return a!=null&&Math.abs(a-r)<=1}return !!h[x.id]}
function dayPts(k){const h=(S.hab&&S.hab[k])||{},ents=S.days[k]||[];return HABITS.reduce((a,x)=>a+(habOn(x,h,ents,k)?x.pts:0),0)}
function weekPts(){const d=new Date(),dow=(d.getDay()+6)%7;let s=0;for(let i=0;i<=dow;i++){const x=new Date(d);x.setDate(d.getDate()-i);s+=dayPts(keyOf(x))}return s}
function level(p){let l=LEVELS[0];for(const x of LEVELS)if(p>=x[0])l=x;return l}
// Wskazówki pierwszego wejścia: jedna na ekran, raz, do „Rozumiem”
const TIPS={day:'Tu jest Twój dzień: co zrobić dziś i jak idzie. Naciśnij kartę zwierzaka, żeby zobaczyć postęp.',
  meals:'Przy daniu, które jesz, naciśnij Zjem. Nie trzeba gotować wszystkiego z planu: zjedzone inaczej zapiszesz szybkim wpisem w Moim dniu.',
  train:'Masz zegarek? Wpisz czas i kalorie z zegarka na górze. Bez zegarka wybierz niżej rodzaj treningu i czas.',
  health:'Badania, suplementy i wiedza. Nic tu nie jest obowiązkowe, zajrzyj, gdy potrzebujesz.',
  set:'Twoje dane liczą kalorie: sprawdź je i naciśnij Zapisz i sprawdź. Tu też włączysz wpisywanie raz dziennie.',
  pet:'Zwierzak rośnie z dni z wpisami. Nie umiera i nie cofa się w rozwoju, nawet po przerwie.'};
function tipHtml(tab){if(DEMO||!TIPS[tab]||(S.tips||{})[tab]||(tab==='day'&&guideActive()))return '';return `<div class="tip panel" role="note"><p><b>Pierwszy raz tutaj?</b> ${TIPS[tab]}</p><button class="btn small" data-tipok="${tab}">Rozumiem</button></div>`}
// Dzień aktywny: 30 pkt albo, w trybie raz dziennie, zapisany wpis dnia (posiłki oraz trening albo kroki)
function onceDone(k){const e=S.days[k]||[];return e.some(x=>x.kind==='m')&&(e.some(x=>x.kind==='t')||num((S.meas[k]||{}).steps)>0)}
function dayOk(k){return dayPts(k)>=30||(!!S.once&&onceDone(k))}
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
function macros(m,cm,por){
  let k=0,p=0,f=0,c=0;
  const items=m.ing.map(([id,g,isC])=>{const gg=g*(isC?cm:1)*por,i=ING[id];k+=i.k*gg/100;p+=i.p*gg/100;f+=i.f*gg/100;c+=i.c*gg/100;return {n:i.n,g:gg,isC:!!isC}});
  return {k,p,f,c,items};
}
const CHIPS=[...new Set(Object.values(ING).map(i=>i.chip).filter(Boolean))];
function chipsOf(m){return new Set(m.ing.map(x=>ING[x[0]].chip).filter(Boolean))}
function filtered(){
  const cm=carbMult(),por=num(S.f.portion)||1;
  const inc=Object.keys(S.f.chips).filter(k=>S.f.chips[k]===1),exc=Object.keys(S.f.chips).filter(k=>S.f.chips[k]===-1);
  const sorters={p:(a,b)=>b.x.p/b.x.k-a.x.p/a.x.k,k:(a,b)=>a.x.k-b.x.k,t:(a,b)=>a.m.min-b.m.min};
  const pc=S.f.pace||'all';
  return MEALS.filter(m=>(S.f.type==='all'||m.t===S.f.type)&&(pc==='all'||(pc==='quick'?m.min<=20:m.min>=25)))
    .map(m=>({m,x:macros(m,cm,por),ch:chipsOf(m)}))
    .filter(o=>!exc.some(c=>o.ch.has(c)))
    .filter(o=>!inc.length||inc.some(c=>o.ch.has(c)))
    .filter(o=>o.x.p>=S.f.minP&&o.x.k<=S.f.maxK&&o.x.c<=S.f.maxC)
    .map(o=>Object.assign(o,{hits:inc.filter(c=>o.ch.has(c)).length}))
    .sort((a,b)=>(b.hits-a.hits)||sorters[S.f.sort](a,b));
}

// ---------- Zwierzak (pet.js): dane dla PET.state, karta, wybór, ekran postępu ----------
function petPts(k){const x=HABITS.find(h=>h.id==='pasmo');return dayPts(k)-(habOn(x,(S.hab||{})[k]||{},S.days[k]||[],k)?x.pts:0)}
function petCtx(now){return {now:now||new Date(),pet:S.pet,once:!!S.once,pain:k=>!!(S.pain||{})[k],seen:S.petSeen||[],celeb:S.petCeleb&&S.petCeleb.day===todayKey()?S.petCeleb.id:null,key:keyOf,dayPts:k=>S.once&&onceDone(k)?Math.max(30,petPts(k)):petPts(k),entries:k=>S.days[k]||[],meas:k=>S.meas[k]||{},habs:k=>(S.hab||{})[k]||{},urges:k=>(S.urges||{})[k]||[],reviewed:Object.keys(S.reviews||{}).length>0,streak,weekPts,level,stage:stageInfo,avgW:(a,b)=>avgAgo(a,b,'w'),startW:(stageInfo()||{}).start||null,num}}
// Kamień milowy zaliczany poza przerysowaniem przy wpisywaniu (REDRAW); świętowanie widoczne do obejrzenia ekranu zwierzaka
function petState(){if(DEMO){const fr=PET.demo().frames,f=fr[DEMO_I%fr.length];S.pet.kind=f.kind;return PET.state(Object.assign(petCtx(),{force:f}))}const st=PET.state(petCtx());let ch=false;if(st.milestone&&!REDRAW){S.petSeen=(S.petSeen||[]).concat(st.milestone);S.petCeleb={id:st.milestone,day:todayKey()};ch=true}if(S.pet&&st.active>(S.pet.peak||0)){S.pet.peak=st.active;ch=true}if(ch)save();return st}
function petCardHtml(){if(!S.pet)return `<button class="petcard" data-petpick="1">${PET.svg('gaska','egg','ok',null)}<span class="petinfo"><b>Wybierz towarzysza</b><span class="small">Gąska albo kaczuszka będzie reagować na Twoje wpisy.</span></span></button>`;return PET.card(petState(),S.pet,esc)}
function petPickHtml(){const p=S.pet;return `<div class="petstage">${PET.svg(p?p.kind:'gaska',p?'chick':'egg','happy',null)}</div>`+seg([['gaska','Gąska'],['kaczka','Kaczuszka']],p?p.kind:'','petkind')+(p?`<div class="panel"><div class="field"><label for="petname">Imię</label><input type="text" id="petname" data-k="pet.name" value="${esc(p.name||'')}" placeholder="Kluska" maxlength="20"></div></div>`:'')}
function waistDelta(){const ks=Object.keys(S.meas||{}).filter(k=>num(S.meas[k].waist)>0).sort();if(ks.length<2)return null;const t0=Date.parse(ks[0]),t1=Date.parse(ks.at(-1));if(t1-t0<14*864e5)return null;const av=a=>a.reduce((s,k)=>s+num(S.meas[k].waist),0)/a.length;return av(ks.filter(k=>Date.parse(k)>=t1-27*864e5))-av(ks.filter(k=>Date.parse(k)<=t0+27*864e5))}
function petSum(st){const k=todayKey(),m=S.meas[k]||{},d=day(),done=[num(m.w)>0,d.filter(e=>e.kind==='m').length>=3,d.some(e=>e.kind==='t')||num(m.steps)>0].filter(Boolean).length,wp=weekPts(),nx=LEVELS.find(x=>x[0]>wp),si=stageInfo(),a7=avgAgo(0,7,'w');
  return {today:{done,pts:dayPts(k)},week:{pts:wp,level:level(wp)[1],next:nx?{name:nx[1],need:nx[0]-wp}:null},all:{active:st.active,streak:streak(),dw:si&&a7!=null?a7-si.start:null,waist:waistDelta(),pct:si?si.pct:null},badges:PET.badgeList([...new Set([...(S.petSeen||[]),...PET.milestones(petCtx())])]),body:S.body?petBodyHtml():''}}
function petBodyHtml(){const b=PET.body(S.meas,new Date(),num);return '<h2>Sylwetka</h2>'+(b.ok?`<div class="panel petbody">${b.svg}<p class="small muted">Linia przerywana: start (pierwsze 4 tygodnie pomiarów). Pełna: ostatnie 4 tygodnie. Kontur ze średnich obwodów talii, bioder i uda.</p></div>`:`<p class="small muted">${b.msg}. Potrzebne są 2 pomiary obwodów odległe o co najmniej 14 dni.</p>`)}
function renderPet(){if(!S.pet){S.tab='set';return renderSet()}const st=petState();document.getElementById('main').innerHTML=PET.screen(st,S.pet,petSum(st),esc);if(S.petCeleb&&!DEMO){S.petCeleb=null;save()}if(S.guide&&!S.guide.seenPet){S.guide.seenPet=true;save()}document.getElementById('main').innerHTML+=nextHtml('pet')}
// ---------- Pierwsze kroki: prowadzenie nowej osoby, kroki zaliczane z danych ----------
function guideSteps(){const g=S.guide||{},anyMeas=f=>Object.values(S.meas||{}).some(m=>num((m||{})[f])>0),anyDay=kind=>Object.values(S.days||{}).some(d=>(d||[]).some(e=>e.kind===kind)),past=Object.keys(S.days||{}).some(k=>k<todayKey()&&(S.days[k]||[]).length);
  return [
    {id:'data',label:'Sprawdź swoje dane',hint:'Waga, wzrost, wiek i cel liczą Twoje kalorie. Na końcu naciśnij Zapisz i sprawdź.',btn:'Ustawienia',act:'tab',arg:'set',done:!!g.dataOk||past},
    {id:'pet',label:'Wybierz towarzysza',hint:'Gąska albo kaczuszka będzie reagować na Twoje wpisy.',btn:'Wybierz',act:'tab',arg:'set',done:!!S.pet},
    {id:'weight',label:'Wpisz dzisiejszą wagę',hint:'Pole Waga w Pomiarach dnia, niżej na tym ekranie.',btn:'Wpisz wagę',act:'nav',arg:'day#m_w',done:anyMeas('w')},
    {id:'meal',label:'Zapisz pierwszy posiłek',hint:'W Posiłkach naciśnij Zjem przy daniu.',btn:'Posiłki',act:'tab',arg:'meals',done:anyDay('m')},
    {id:'move',label:'Dodaj ruch',hint:'Zapisz trening albo wpisz kroki w Pomiarach dnia.',btn:'Trening',act:'tab',arg:'train',done:anyDay('t')||anyMeas('steps')},
    {id:'seepet',label:'Poznaj zwierzaka',hint:'Zobacz, jak rośnie i co zdobywa.',btn:'Mój zwierzak',act:'tab',arg:'pet',done:!!g.seenPet}]}
function guideActive(){return !(S.guide||{}).hidden&&guideSteps().some(x=>!x.done)}
function guideHtml(){if(!guideActive())return '';const st=guideSteps(),n=st.filter(x=>x.done).length,nx=st.find(x=>!x.done);
  return `<div class="guide panel"><div class="guidehead"><h2>Pierwsze kroki</h2><span class="met">${n} z ${st.length}</span></div><div class="petbar"><i style="width:${Math.round(n/st.length*100)}%"></i></div>`
    +st.map(x=>`<div class="step${x.done?' done':''}${x===nx?' next':''}"><span class="box">${x.done?'✓':''}</span><span class="lab">${x.label}${x.done?'':`<small class="hint">${x.hint}</small>`}</span>${x.done?'':`<button class="btn small${x===nx?'':' ghost'}" data-${x.act}="${x.arg}">${x.btn}</button>`}</div>`).join('')
    +'<p style="text-align:right;margin:8px 0 0"><button class="btn ghost small" data-guidehide="1">Ukryj</button></p></div>'}
// Komunikat po akcji z następnym krokiem, dopóki trwają pierwsze kroki
function guideAct(){if(!guideActive())return null;const nx=guideSteps().find(x=>!x.done);return {act:nx.act,arg:nx.arg,label:nx.btn}}
function guideToast(base){if(!guideActive())return base;const nx=guideSteps().find(x=>!x.done);return `${base}. Dalej: ${nx.label.charAt(0).toLowerCase()+nx.label.slice(1)}.`}
// ---------- Karty „Co się dzieje”: reguły z danych w telefonie; każda mówi, na czym się opiera ----------
function nAgo(n){const d=new Date();d.setDate(d.getDate()-n);return keyOf(d)}
function sleepAt(k){const v=num((S.meas[k]||{}).sleep);return v>0?v:null}
function wAt(k){const v=num((S.meas[k]||{}).w);return v>0?v:null}
function wAvg(a,b){const v=[];for(let i=a;i<=b;i++){const x=wAt(nAgo(i));if(x)v.push(x)}return {n:v.length,avg:v.length?v.reduce((s,x)=>s+x,0)/v.length:null}}
function painAt(k){return (S.pain||{})[k]||null}
function auraDays(){return Object.entries(S.pain||{}).filter(([k,p])=>p&&p.aura&&k>=nAgo(90)).length}
function urges3(){return [0,1,2].reduce((a,i)=>a+((S.urges||{})[nAgo(i)]||[]).length,0)}
const EV={m:'dowody mocne',u:'dowody umiarkowane',w:'wiedza ogólna'};
const CARDS=[
  {id:'aura',sens:1,ev:'m',when:()=>auraDays()>0,src:()=>`${auraDays()} ${auraDays()===1?'dzień':'dni'} z aurą w ostatnich 90 dniach (dziennik bólu)`,
    t:'Migrena z aurą: porozmawiaj z ginekologiem',why:'Przy migrenie z aurą tabletki antykoncepcyjne z estrogenem zwiększają ryzyko udaru i w zaleceniach WHO są przeciwwskazaniem. Nie odstawiaj ich bez planu innej antykoncepcji: zmianę ustala lekarz.',
    more:'Dzwoń 112, gdy aura trwa dłużej niż godzinę albo jest inna niż zwykle, gdy słabnie lub drętwieje jedna strona ciała, przy zaburzeniach mowy albo nagłym, najsilniejszym w życiu bólu.'},
  {id:'wizyta',sens:1,ev:'u',when:()=>visitDays()!=null||auraDays()>0,
    src:()=>(visitDays()!=null?`wizyta ${fmtDate(S.visit.date)}`:'brak umówionej wizyty')+`; dni z aurą w 90 dniach: ${auraDays()}`,
    t:()=>{const n=visitDays();return n==null?'Do czasu wizyty':`Do czasu wizyty (${esc(S.visit.who||'lekarz')}, za ${n} ${n===1?'dzień':'dni'})`},
    why:'Na dziś 3 rzeczy: sen o stałej porze, posiłki bez długich przerw, woda i stała ilość kofeiny. Migrena reaguje na rytm dnia, więc te zmiany zmniejszają liczbę ataków.',
    more:()=>auraDays()>0?'Przy migrenie z aurą nie czekaj miesięcy: umów teleporadę ginekologiczną albo lekarza rodzinnego w ciągu dni. Nie odstawiaj tabletek bez planu innej antykoncepcji.':'Zaznaczaj dni z bólem jednym dotknięciem; lista na wizytę zbierze je za Ciebie.',
    todo:['Lista na wizytę','tab','visit']},
  {id:'bol_hormony',sens:1,ev:'m',when:()=>{const k=todayKey();return !!painAt(k)&&(S.meas[k]||{}).cyc==='P'},src:()=>'dziś: dzień z bólem głowy i zaznaczone dni bez hormonów',
    t:'Ból głowy w dniach bez hormonów',why:'Spadek estrogenu w dniach bez hormonów często wyzwala migrenę. To znany wzorzec, a nie Twoja słabość.',todo:['Zaznacz aurę i lek','goto','painrow']},
  {id:'bez_sil',ev:'u',when:()=>!!painAt(todayKey())||(sleepAt(todayKey())!=null&&sleepAt(todayKey())<6),src:()=>painAt(todayKey())?'dziś: dzień z bólem głowy':`sen ostatniej nocy: ${fmt1(sleepAt(todayKey()))} h (pomiary dnia)`,
    t:'Mało sił na trening',why:'W dniu ataku migreny ruch zwykle nasila ból, a po złej nocy trening idzie gorzej. Regularny, umiarkowany ruch w lepsze dni może zmniejszać częstość migren.',todo:['Dziś odpoczywam','cardok','bez_sil']},
  {id:'zla_noc',ev:'u',when:()=>{const a=sleepAt(todayKey()),b=sleepAt(nAgo(1));return a!=null&&b!=null&&a<6&&b<6},src:()=>`sen: ${fmt1(sleepAt(nAgo(1)))} h i ${fmt1(sleepAt(todayKey()))} h (2 ostatnie noce, pomiary dnia)`,
    t:'Po krótkich nocach chce się jeść więcej',why:'Krótki sen zwiększa apetyt, zwłaszcza na słodkie i tłuste. To fizjologia, nie brak silnej woli.',todo:['Śniadanie z białkiem','tab','meals']},
  {id:'stres',ev:'u',when:()=>urges3()>=2,src:()=>`${urges3()} wpisy ochoty w 3 dni (przycisk ochoty)`,
    t:'Stres i ochota na jedzenie',why:'Przewlekły stres, w tym kortyzol, często przesuwa wybory w stronę jedzenia kalorycznego i psuje sen. Działa to przez zachowanie, a nie z dnia na dzień.',todo:['Plan na ochotę','tab','sos']},
  {id:'skok_wagi',ev:'m',when:()=>{const w=wAt(todayKey()),a=wAvg(1,7);return w!=null&&a.n>=3&&w-a.avg>=0.8},src:()=>{const a=wAvg(1,7);return `dziś ${fmt1(wAt(todayKey()))} kg, średnia z ${a.n} ważeń w 7 dni ${fmt1(a.avg)} kg`},
    t:'Skok wagi to zwykle woda',why:'Sól, węglowodany, cykl i trening wiążą wodę. Kilogram tłuszczu to około 7700 kcal nadwyżki, więc jeden dzień go nie zrobi.'},
  {id:'waga_stoi',ev:'u',when:()=>{const a=wAvg(0,6),b=wAvg(21,27);return a.n>=2&&b.n>=2&&Math.abs(a.avg-b.avg)<0.2},src:()=>{const a=wAvg(0,6),b=wAvg(21,27);return `średnia teraz ${fmt1(a.avg)} kg (${a.n} ważeń), 3 tygodnie temu ${fmt1(b.avg)} kg (${b.n} ważeń)`},
    t:'Waga stoi mimo starań',why:'Woda i cykl potrafią przez 1-2 tygodnie maskować spadek tłuszczu, a nowe leki mogą zmieniać masę ciała. Obwód talii pokazuje zmianę niezależnie od wody.',todo:['Wpisz obwód talii','goto','m_waist']}
];
function cardHtml(c,day){return `<div class="card panel" data-card="${c.id}"><h3>${typeof c.t==='function'?c.t():c.t}</h3><p>${c.why}</p>${c.more?`<p class="small">${typeof c.more==='function'?c.more():c.more}</p>`:''}<p class="small muted">Na podstawie: ${c.src()}. <span class="ev">${EV[c.ev]}</span></p>`
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
  if(!c||c.v!==CONSENT_V)return h+`<div class="note"><p><b>Zgoda na zaszyfrowaną kopię danych dla rady (wersja ${CONSENT_V})</b></p><ul>${CONSENT_TXT.map(x=>`<li>${x}</li>`).join('')}</ul><p><label><input type="checkbox" id="c_ok"> Przeczytałam(-em) i wyrażam zgodę na przetwarzanie moich danych o zdrowiu w tym celu.</label></p><p><button class="btn small" data-consent="1">Wyrażam zgodę</button></p></div>`;
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
    sl.length?`Sen: średnio ${fmt1(sl.reduce((s,x)=>s+x,0)/sl.length)} h z ${sl.length} nocy.`:'Sen: brak danych.',
    w.n?`Waga: średnia ${fmt1(w.avg)} kg z ${w.n} ważeń w ostatnich 7 dniach.`:'Waga: brak ważeń w ostatnich 7 dniach.'];
  if(a)L.push('Do zapytania: czy przy migrenie z aurą mogę dalej brać tabletki antykoncepcyjne z estrogenem i jaka metoda będzie bezpieczna?');
  return L}
function renderVisit(){const v=S.visit||{};document.getElementById('main').innerHTML=`<h2>Lista na wizytę${v.who?': '+esc(v.who):''}${v.date?', '+fmtDate(v.date):''}</h2><div class="panel card">`+visitLines().map(x=>`<p>${x}</p>`).join('')
  +'<p class="small muted">Liczby z dziennika bólu, cyklu i pomiarów w tym telefonie. Pokaż je lekarzowi albo skopiuj.</p></div><p class="cardact"><button class="btn" data-visitcopy="1">Kopiuj listę</button><button class="btn ghost" data-tab="health">Wróć do Zdrowia</button></p>'}
// ---------- Widoki ----------
const TABS=[
  ['meals','Posiłki','<path d="M4 11h16a8 8 0 0 1-16 0Z"/><path d="M8 7c0-1.5 1-2 1-3.5M12 7c0-1.5 1-2 1-3.5M16 7c0-1.5 1-2 1-3.5"/>'],
  ['train','Trening','<path d="M2 12h2M20 12h2M6 8v8M18 8v8M9 10v4M15 10v4M9 12h6"/>'],
  ['day','Mój dzień','<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>'],
  ['health','Zdrowie','<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>'],
  ['set','Ustawienia','<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>']
];
function renderTabs(){const tb=document.getElementById('tabs');if(tb&&tb.style)tb.style.display=S.tab==='intro'?'none':'';
  document.getElementById('tabs').innerHTML=TABS.map(([k,l,ic])=>`<button class="${S.tab===k?'on':''}" data-tab="${k}" aria-label="${l}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ic}</svg>${l}</button>`).join('');
  document.getElementById('title').textContent=(TABS.find(x=>x[0]===S.tab)||[0,{help:'Pomoc',sos:'Ochota na przekąskę',labs:'Moje badania',visit:'Lista na wizytę',intro:'Wprowadzenie',review:'Przegląd tygodnia',recipe:'Przepis',knee:'Program kolana',impact:'Mój wpływ',challenge:'Wspólne wyzwanie',pet:'Mój zwierzak'}[S.tab]||''])[1];
  document.getElementById('who').textContent=new Date().toLocaleDateString('pl-PL',{weekday:'short',day:'numeric',month:'numeric'});
}
function seg(items,cur,attr,cls=''){return `<div class="seg ${cls}">`+items.map(([v,l])=>`<button class="${String(cur)===String(v)?'on':''}" data-${attr}="${v}">${l}</button>`).join('')+'</div>'}
function optList(list,cur,attr){return '<div class="panel">'+list.map(o=>`<button class="opt ${o.id===cur?'on':''}" data-${attr}="${o.id}"><span class="dot"></span><span>${o.n}</span>${o.met?`<span class="met">MET ${fmt1(o.met)}</span>`:''}</button>`).join('')+'</div>'}
// Przyciski − i + przy polu liczbowym: wpis bez klawiatury; klawiatura zostaje dla chętnych
function stpWrap(label,key,inp){const f=key.split('.').pop();return STEP[f]?`<span class="num"><button class="stp" data-stp="${key}" data-d="-1" aria-label="${label}: mniej">−</button>${inp}<button class="stp" data-stp="${key}" data-d="1" aria-label="${label}: więcej">+</button></span>`:inp}
function field(label,key,val,unit,mode){return `<div class="field"><label for="f_${key}">${label}</label>${stpWrap(label,key,`<input type="text" inputmode="${mode||'decimal'}" id="f_${key}" data-k="${key}" value="${esc(val)}">`)}<span class="unit">${unit}</span></div>`}

function renderMeals(){
  const cm=carbMult(),n=trainNet();
  const carbTxt=S.f.carb==='auto'?(n>0?`Automatycznie z dzisiejszych treningów (${fmt(n)} kcal netto): węglowodany ×${fmt1(cm)}.`:'Automatycznie: brak treningu w dzienniku dnia, węglowodany ×1.'):`Ustawione ręcznie: węglowodany ×${fmt1(cm)}.`;
  let h=planHtml()+shopHtml()+'<h2>Albo wybierz sam</h2>'+seg([['sniadanie','Śniadanie'],['obiad','Obiad'],['kolacja','Kolacja'],['przekaska','Przekąska'],['all','Wszystkie']],S.f.type,'type','scroll')+'<div id="rytm">'+seg([['all','Każdy czas'],['quick','Na co dzień, do 20 min'],['big','Na weekend, więcej czasu']],S.f.pace||'all','pace','scroll')+'</div>';
  h+='<details class="fold" data-fold="filtry"'+(OPEN_F.has('filtry')?' open':'')+'><summary>Filtry i sortowanie</summary><div style="padding:0 12px 12px">';
  h+='<h2>Produkty</h2><p class="small muted">Dotknij raz: chcę. Drugi raz: bez tego. Trzeci: bez znaczenia.</p><div class="chips">'+CHIPS.map(c=>{const s=S.f.chips[c]||0;return `<button class="chip ${s===1?'inc':s===-1?'exc':''}" data-chip="${c}">${c}</button>`}).join('')+'</div>';
  h+='<h2>Pod trening</h2>'+seg([['auto','Auto'],['1','Bez treningu'],['1.25','Lekki'],['1.5','Siłownia, cardio']],S.f.carb,'carb','scroll')+`<p class="small muted">${carbTxt} Zmienia tylko porcję kaszy, ryżu, ziemniaków, pieczywa i płatków.</p>`;
  h+='<h2>Makro na porcję</h2><div class="panel">'+
    `<div class="slider"><div class="top"><span>Białko co najmniej</span><b id="l_minP">${S.f.minP} g</b></div><input type="range" min="0" max="60" step="5" value="${S.f.minP}" data-r="minP" aria-label="Białko co najmniej"></div>`+
    `<div class="slider"><div class="top"><span>Kalorie najwyżej</span><b id="l_maxK">${S.f.maxK>=1000?'bez limitu':S.f.maxK+' kcal'}</b></div><input type="range" min="150" max="1000" step="25" value="${S.f.maxK}" data-r="maxK" aria-label="Kalorie najwyżej"></div>`+
    `<div class="slider"><div class="top"><span>Węglowodany najwyżej</span><b id="l_maxC">${S.f.maxC>=130?'bez limitu':S.f.maxC+' g'}</b></div><input type="range" min="0" max="130" step="5" value="${S.f.maxC}" data-r="maxC" aria-label="Węglowodany najwyżej"></div>`+
    `<div class="slider"><div class="top"><span>Wielkość porcji</span><b id="l_portion">×${fmt1(S.f.portion)}</b></div><input type="range" min="0.7" max="1.5" step="0.05" value="${S.f.portion}" data-r="portion" aria-label="Wielkość porcji"></div>`+
    '</div>';
  h+='<h2>Sortuj</h2>'+seg([['p','Najwięcej białka na kcal'],['k','Najmniej kcal'],['t','Najszybsze']],S.f.sort,'sort','scroll');
  h+='</div></details><div id="mlist"></div>';
  document.getElementById('main').innerHTML=h;
  renderMealList();
}
function renderMealList(){
  const L=filtered(),el=document.getElementById('mlist');if(!el)return;
  const TN={sniadanie:'Śniadanie',obiad:'Obiad',kolacja:'Kolacja',przekaska:'Przekąska'};
  if(!L.length){el.innerHTML='<div class="note">Żaden posiłek nie spełnia tych warunków. Poluzuj limit kalorii lub białka albo odznacz produkt wykluczony.</div>';return}
  el.innerHTML=`<h2>${L.length} ${L.length===1?'propozycja':(L.length%10>=2&&L.length%10<=4&&(L.length%100<10||L.length%100>=20)?'propozycje':'propozycji')}</h2>`+L.map(({m,x})=>{
    const tot=x.p*4+x.f*9+x.c*4||1,isOpen=open.has(m.id);
    return `<article class="meal"><button class="mhead" data-recipe="${m.id}"><div class="name">${m.n}</div><div class="meta">${S.f.type==='all'?TN[m.t]+', ':''}${m.min} min${m.prep?', z gotowania na zapas':''}</div><div class="small" style="color:var(--green);margin-top:4px;text-decoration:underline;text-underline-offset:3px">Składniki i przygotowanie</div></button>
      <div class="mnum"><span><b>${fmt(x.k)}</b> kcal</span><span class="p">B ${fmt(x.p)} g</span><span class="f">T ${fmt(x.f)} g</span><span class="c">W ${fmt(x.c)} g</span></div>
      <div class="bar" aria-hidden="true"><i style="width:${x.p*4/tot*100}%;background:var(--p)"></i><i style="width:${x.f*9/tot*100}%;background:var(--f)"></i><i style="width:${x.c*4/tot*100}%;background:var(--c)"></i></div>
      ${isOpen?`<div class="mdet"><ul>${x.items.map(i=>`<li><span>${i.n}</span><span>${fmt(Math.round(i.g/5)*5)} g</span></li>`).join('')}</ul><p class="small">${m.how}</p><p class="small muted">${leftTxt(x.k)} ${fmt(x.k)} kcal to ok. ${fmt(x.k/walkPerMin())} min spaceru.</p><p><button class="btn" data-addmeal="${m.id}">Dodaj do dnia</button> <button class="btn ghost" data-copy="${m.id}">Kopiuj składniki do Fitatu</button></p></div>`:''}
    </article>`}).join('')+'<p class="small muted">Wartości odżywcze orientacyjne, z typowych tabel składu. Gramatury produktów suchych (kasza, ryż, makaron, soczewica) przed ugotowaniem. Kasza i ryż z mikrofali: 1 część na 2 części wody, duża miska pod przykryciem, ok. 12-20 min na średniej mocy z mieszaniem; czas zależy od mikrofali, więc przy pierwszym razie sprawdź miękkość.</p>';
}

function renderTrain(){
  const t=S.tr;
  let h=''
    +'<h2>Trening z zegarka</h2><div class="panel">'+field('Czas','tr.wmin',t.wmin||'','min','numeric')+'<div class="chips quick">'+[30,45,60,90].map(v=>`<button class="chip${String(t.wmin)===String(v)?' inc':''}" data-setv="tr.wmin" data-v="${v}">${v} min</button>`).join('')+'</div>'+field('Kalorie z zegarka','tr.wk',t.wk||'','kcal','numeric')+'<p><button class="btn" data-addwatch="1" style="width:100%">Dodaj trening z zegarka</button></p></div>'
    +'<p class="small muted">Zegarek też szacuje kalorie, zwykle z tętna, a błąd bywa większy niż 20%. Do bilansu liczy się netto: kalorie z zegarka minus spoczynek w tym czasie.</p><h2>Albo oszacuj z rodzaju treningu</h2>'+seg([['silownia','Siłownia'],['plywanie','Pływanie'],['bieznia','Bieżnia'],['spinning','Spinning'],['inne','Inne']],t.cat,'cat','scroll');
  if(t.cat==='bieznia'){
    h+=seg([['marsz','Marsz'],['bieg','Bieg']],t.bMode,'bmode');
    h+='<div class="panel">'+field('Prędkość','tr.speed',t.speed,'km/h')+field('Nachylenie','tr.grade',t.grade,'%')+'</div>';
  }else if(t.cat==='spinning'){
    h+=seg([['w','Moc z monitora'],['k','Rodzaj zajęć']],t.sMode,'smode');
    if(t.sMode==='w')h+='<div class="panel">'+field('Średnia moc','tr.watts',t.watts,'W')+'</div><p class="small muted">Monitor roweru pokazuje średnią moc z całych zajęć. Ta wartość daje dokładniejszy wynik niż rodzaj zajęć.</p>';
    else h+=optList(SPIN,t.sClass,'sclass');
  }else{
    h+=optList(ACT[t.cat].opts,t.opt[t.cat],'opt');
    if(ACT[t.cat].note)h+=`<p class="small muted">${ACT[t.cat].note}</p>`;
  }
  const sp=spec(),m=Math.max(0,num(t.min)),km=kcal(sp,m);
  h+=`<section class="readout"><h3>${sp.label}</h3><div class="trio">`+[30,45,60].map(mm=>{const k=kcal(sp,mm);return `<div class="cell"><div class="min">${mm} min</div><div class="big">${fmt(k.gross)}</div><div class="sub">netto ${fmt(k.net)}</div></div>`}).join('')+
    `</div><p class="unit">kcal brutto przy ${fmt1(kg())} kg${S.korekta?', z korektą na spoczynkowe zużycie energii':''}. Netto to część ponad spoczynek.</p>
    <div class="custom"><input type="text" inputmode="numeric" data-k="tr.min" value="${t.min}" aria-label="Czas w minutach"><span>min</span><span class="res">${fmt(km.gross)} kcal, netto ${fmt(km.net)}</span><button class="btn" data-addtrain="1">Dodaj do dnia</button></div></section>`;
  if(sp.knee)h+=`<div class="note warn">Kolano: ${sp.knee}</div>`;
  if(sp.warn)h+=`<div class="note warn">${sp.warn}</div>`;
  h+=`<p class="small muted">Źródło wartości: ${sp.src}${sp.met?`, MET ${fmt1(sp.met)}`:''}. Wynik jest szacunkiem dla przeciętnej osoby; rzeczywiste spalanie może różnić się o kilkadziesiąt procent.</p>`;
  h+='<p><button class="btn ghost" data-tab="knee" style="width:100%">Program kolana, 12 tygodni</button></p>';
  document.getElementById('main').innerHTML=h;
}

// Stan dziś: punkt centralny Mojego dnia; każda wartość ze źródłem i liczbą danych, brak danych pokazany wprost
function plPos(n){return n===1?'posiłek':(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?'posiłki':'posiłków'}
function stanHtml(){const k=todayKey(),m=S.meas[k]||{},d=day(),ml=d.filter(e=>e.kind==='m'),tr=d.filter(e=>e.kind==='t'),p=painAt(k),cyc=m.cyc;
  const row=(lab,val,src)=>`<div class="stan-row"><span class="stan-lab">${lab}</span><span class="stan-val">${val}</span><span class="stan-src">${src}</span></div>`;
  const a=wAvg(0,6),b=wAvg(7,13),dw=a.n&&b.n?a.avg-b.avg:null;
  let h=row('Waga',a.n?`${fmt1(a.avg)} kg${dw!=null?` <small>${dw<=0?'−':'+'}${fmt1(Math.abs(dw))} kg</small>`:''}`:'brak danych',a.n?`średnia z ${a.n} ważeń w 7 dni${b.n?`; tydzień wcześniej ${fmt1(b.avg)} kg z ${b.n}`:''}`:'wpisz wagę w Pomiarach dnia niżej');
  const eat=ml.reduce((s,e)=>s+e.k,0),prot=ml.reduce((s,e)=>s+e.p,0);
  h+=row('Jedzenie',ml.length?(p?`${fmt(eat)} kcal`:`${fmt(eat)} z ${fmt(targetKcal())} kcal`):'brak danych',ml.length?`${ml.length} ${plPos(ml.length)} zapisane, białko ${fmt(prot)} g`+(p?'; dziś bez celu deficytu':''):(p?'dziś bez celu deficytu; ':'')+'zapisz posiłek w Posiłkach');
  const sl=sleepAt(k),s7=Array.from({length:7},(_,i)=>sleepAt(nAgo(i))).filter(x=>x!=null);
  h+=row('Sen',sl!=null?`${fmt1(sl)} h`:'brak danych',s7.length?`${sl!=null?'ostatnia noc; ':''}średnia ${fmt1(s7.reduce((s,x)=>s+x,0)/s7.length)} h z ${s7.length} nocy`:'wpisz sen w Pomiarach dnia niżej');
  const st=num(m.steps),tm=tr.reduce((s,e)=>s+num(e.min),0),mv=[st>0?`${fmt(st)} kroków`:'',tr.length?`trening ${fmt(tm)} min`:''].filter(Boolean).join(', ');
  h+=row('Ruch',mv||'brak danych',mv?'dzisiejsze pomiary i treningi':'wpisz kroki albo dodaj trening');
  if(p||cyc)h+=row('Ból i cykl',p?'dzień z bólem'+(p.aura?', aura':''):'bez bólu',cyc?(cyc==='P'?'dni bez hormonów':'tydzień cyklu '+esc(cyc)):'cykl nie zaznaczony dziś');
  return `<section class="stan panel" aria-label="Stan dziś"><h2>Stan dziś</h2>${h}</section>`}
function renderDay(){
  const d=day(),tr=d.filter(e=>e.kind==='t'),ml=d.filter(e=>e.kind==='m');
  const net=tr.reduce((a,e)=>a+e.net,0),eat={k:0,p:0,f:0,c:0};ml.forEach(e=>{eat.k+=e.k;eat.p+=e.p;eat.f+=e.f;eat.c+=e.c});
  const R=rmr(),target=targetKcal(),pT=1.4*(num(S.goal)||68);
  const bar=(lab,v,max,unit)=>{const pc=Math.min(100,v/max*100);return `<div class="prog"><div class="top"><span>${lab}</span><span>${fmt(v)} / ${fmt(max)} ${unit}</span></div><div class="track"><div class="fill ${v>max*1.05?'over':''}" style="width:${pc}%"></div></div></div>`};
  const sos='<p><button class="btn sos" data-tab="sos">Mam ochotę coś przekąsić</button></p>';
  let h=guideHtml()+stanHtml()+cardsHtml('day')+changeHtml()+focusHtml()+painHtml()+reviewPromptHtml()+petCardHtml()+sos+measHtml()+legHtml()+kneeBannerHtml();
  let more=modeHtml()+`<h3 class="rh" style="margin:4px 4px 8px">Energia i białko dziś</h3><div class="panel" style="padding:8px 16px">${bar('Energia z posiłków',eat.k,target,'kcal')}${bar('Białko',eat.p,pT,'g')}<p class="small muted">Tłuszcz ${fmt(eat.f)} g, węglowodany ${fmt(eat.c)} g. Treningi dziś: ${fmt(net)} kcal netto.</p></div>`;
  more+=fold('nawyki','Nawyki i punkty: '+fmt(dayPts(todayKey()))+' pkt dziś',habitsHtml(tr.length>0));
  more+=fold('prognoza','Prognoza i Twój priorytet',projHtml()+sexHtml());
  more+=relHtml();
  h+='<details class="fold" data-fold="zapisane"'+(OPEN_F.has('zapisane')?' open':'')+'><summary>Zapisane dziś: posiłki '+ml.length+', treningi '+tr.length+'</summary><h3 class="rh" style="margin:4px 16px 8px">Treningi</h3><div class="panel">'+(tr.length?tr.map(e=>`<div class="entry"><span class="txt">${e.label}, ${fmt(e.min)} min</span><span class="val">${fmt(e.gross)} kcal</span><button class="del" data-del="${d.indexOf(e)}" aria-label="Usuń">×</button></div>`).join(''):'<div class="empty">Brak treningów. <button class="btn ghost small" data-tab="train">Przejdź do Treningu</button></div>')+'</div>';
  h+='<h3 class="rh" style="margin:12px 16px 8px">Posiłki</h3><div class="panel">'+(ml.length?ml.map(e=>`<div class="entry"><span class="txt">${e.label}</span><span class="val">${fmt(e.k)} kcal, B ${fmt(e.p)} g</span><button class="del" data-del="${d.indexOf(e)}" aria-label="Usuń">×</button></div>`).join(''):'<div class="empty">Brak posiłków. <button class="btn ghost small" data-tab="meals">Przejdź do Posiłków</button></div>')+'</div></details>';
  h+=`<details class="fold" data-fold="szybki"${OPEN_F.has('szybki')?' open':''}><summary>Szybki wpis albo powtórz wczoraj</summary><div class="panel"><div class="field"><label for="q_n">Co</label><input type="text" id="q_n" style="width:170px;text-align:left" placeholder="np. kawa z mlekiem"></div><div class="field"><label for="q_k">Ile</label><input type="text" inputmode="numeric" id="q_k" placeholder="0"><span class="unit">kcal</span></div></div><p><button class="btn" data-quick="1">Zapisz</button> <button class="btn ghost" data-repeat="1">Powtórz wczorajsze posiłki</button></p><p class="small muted">Wpis przybliżony wystarczy. W badaniach z wynikiem redukcji wiązała się częstość zapisywania, nie jego dokładność.</p></details>`;
  more+='<div class="navrow"><button class="btn ghost" data-tab="impact">Mój wpływ</button><button class="btn ghost" data-tab="challenge">Wspólne wyzwanie</button><button class="btn ghost" data-tab="review">Przegląd tygodnia</button></div>';
  if(d.length)more+='<p><button class="btn ghost" data-clear="1">Wyczyść dzień</button></p>';
  more+=`<details class="fold" data-fold="cel"${OPEN_F.has('cel')?' open':''}><summary>Jak liczony jest cel</summary><div class="note small" style="margin:0 12px 12px">${S.mode==='utrzymanie'?'Tryb utrzymania: cel to zapotrzebowanie bez deficytu, '+(measuredTdee()?'zmierzone z jedzenia i trendu wagi.':'na razie ze wzoru (spoczynkowe zużycie × 1,3 plus treningi netto).'):measuredTdee()?'Jak liczony jest cel: zmierzone zapotrzebowanie (jedzenie i trend wagi) minus 20%.':`Jak liczony jest cel: na start szacunek, czyli spoczynkowe zużycie energii ${fmt(R)} kcal (wzór Mifflina-St Jeora) × 1,3 dla pracy siedzącej, plus treningi netto, minus 20%. Po 2-4 tygodniach ważenia i zapisywania aplikacja przejdzie na zapotrzebowanie zmierzone.`} Nigdy poniżej spoczynkowego zużycia. Białko: 1,4 g na kg wagi docelowej. Mnożnik 1,3 i deficyt 20% to założenia planu, nie pomiar. Zapisuj na bieżąco, najlepiej zaraz po każdym posiłku.</div></details>`;
  h+=fold('wiecej','Więcej: nawyki, prognoza, przeglądy',more);
  document.getElementById('main').innerHTML=h;
}

// Dane osoby: sprawdzenie przed zapisem i przycisk „dalej” tam, gdzie kończy się ekran
const DATA_F=[['kg','wagę','Waga','kg'],['cm','wzrost','Wzrost','cm'],['age','wiek','Wiek','lat'],['goal','wagę docelową','Waga docelowa','kg']];
function dataCheck(){const err=[],warn=[];let first=null;
  DATA_F.forEach(([k,acc,nom,u])=>{const v=num(S[k]),[a,b]=LIM[k];if(!(v>0)){err.push('Uzupełnij '+acc+'.');first=first||k}else if(v<a||v>b){err.push(`${nom}: wpisz wartość od ${a} do ${b} ${u}.`);first=first||k}});
  if(!err.length&&S.mode==='redukcja'&&num(S.goal)>=num(S.kg)){err.push('Waga docelowa w redukcji powinna być niższa od obecnej.');first='goal'}
  if(!err.length&&num(S.goal)/Math.pow(num(S.cm)/100,2)<18.5)warn.push('Waga docelowa daje BMI poniżej 18,5. Ustal cel z lekarzem lub dietetykiem.');
  return {err,warn,first}}
function dataHtml(){const c=dataCheck(),ok=S.guide&&S.guide.dataOk,w=c.warn.map(x=>`<div class="note warn">${x}</div>`).join(''),btn='<p><button class="btn" data-datasave="1" style="width:100%">Zapisz i sprawdź</button></p>';
  if(c.err.length)return `<div class="note warn"><b>Do poprawy:</b> ${c.err.join(' ')}</div>`+btn;
  if(!ok)return '<p class="small muted">Sprawdź, czy to Twoje wartości, a nie przykładowe, i naciśnij Zapisz i sprawdź.</p>'+w+btn;
  return `<div class="note">✓ Dane zapisane: ${fmt1(num(S.kg))} kg, ${fmt(num(S.cm))} cm, wiek ${fmt(num(S.age))}, cel ${fmt1(num(S.goal))} kg.</div>`+w+nextHtml('set')}
function nextHtml(cur){const g=guideActive()?guideSteps().find(x=>!x.done):null,lc=x=>x.charAt(0).toLowerCase()+x.slice(1);let a='tab',v='day',t='Przejdź do Mojego dnia';
  if(g){if(cur==='set'&&g.id==='data'){a='goto';v='dane';t='Dalej: sprawdź i zapisz dane na górze'}else if(cur==='set'&&g.id==='pet'){a='goto';v='towarzysz';t='Dalej: wybierz towarzysza niżej'}else if(!(g.act==='tab'&&g.arg===cur)){a=g.act==='nav'?'nav':'tab';v=g.act==='goto'?'day':g.arg;t='Dalej: '+lc(g.label)}}
  else if(cur==='day')return '';
  return `<p class="nextbar"><button class="btn" data-${a}="${v}" style="width:100%">${t}</button></p>`}
function renderSet(){
  const bmi=kg()/Math.pow((num(S.cm)||165)/100,2);
  let h='<h2 id="dane">Twoje dane</h2><div class="panel">'+field('Waga','kg',S.kg,'kg')+field('Wzrost','cm',S.cm,'cm','numeric')+field('Wiek','age',S.age,'lat','numeric')+field('Waga docelowa','goal',S.goal,'kg')+'</div>';
  h+=seg([['K','Kobieta'],['M','Mężczyzna']],S.sex,'sex')+dataHtml();
  h+=`<h2 id="wpisy">Wpisy</h2><div class="panel"><div class="field"><label for="once">Wpisuję raz dziennie, wieczorem</label><input type="checkbox" class="switch" id="once" data-k="once" ${S.once?'checked':''}></div></div><p class="small muted">Mój dzień pokaże jeden wpis dnia, a zwierzak przypomni o posiłkach dopiero od 19:00.</p>`;
  h+='<h2 id="komunikaty">Komunikaty</h2>'+seg([['std','Zwykle'],['long','Dłużej'],['stay','Do zamknięcia']],S.toastLen||'std','toastlen')+'<p class="small muted">Jak długo widać dymek po zapisie. Każdy zamkniesz przyciskiem ×.</p>';
  h+=`<div class="panel"><div class="field"><label for="discreet">Tryb dyskretny: karty o migrenie i antykoncepcji tylko w Zdrowiu</label><input type="checkbox" class="switch" id="discreet" data-k="discreet" ${S.discreet?'checked':''}></div></div>`;
  h+='<h2 id="towarzysz">Towarzysz</h2>'+petPickHtml()+(S.pet?`<div class="panel"><div class="field"><label for="body">Sylwetka z pomiarów na ekranie zwierzaka</label><input type="checkbox" class="switch" id="body" data-k="body" ${S.body?'checked':''}></div></div>`:'');
  h+='<h2>Tryb</h2>'+seg([['redukcja','Redukcja'],['utrzymanie','Utrzymanie']],S.mode,'mode');
  h+=`<div class="panel"><div class="field"><label for="korekta">Korekta na spoczynkowe zużycie energii</label><input type="checkbox" class="switch" id="korekta" data-k="korekta" ${S.korekta?'checked':''}></div></div>
${S.sex==='K'?`<div class="panel"><div class="field"><label for="lip">Śledź objawy nóg (lipodemia)</label><input type="checkbox" class="switch" id="lip" data-k="lip" ${S.lip?'checked':''}></div></div>`:''}
  <p class="small muted">Klasyczny MET zakłada 1 kcal na kg na godzinę w spoczynku. Korekta zastępuje to wartością ze wzoru Mifflina-St Jeora, co dla kobiet i osób z wyższym udziałem tkanki tłuszczowej zwykle daje niższe, bliższe rzeczywistości wyniki (wniosek z definicji MET, niesprawdzony pomiarem).</p>
  <div class="note">BMI ${fmt1(bmi)}. Spoczynkowe zużycie energii ok. ${fmt(rmr())} kcal na dobę.</div>
  <h2>Na ekran początkowy iPhone’a</h2><p class="small">W Safari: Udostępnij, potem „Dodaj do ekranu początkowego”. Dane zostają w tej przeglądarce na tym telefonie.</p>
  ${bkHtml()}
  <h2>Fitatu</h2><p class="small">Bezpośredniego połączenia nie ma. Fitatu wymienia dane przez Apple Zdrowie, a strona otwarta w przeglądarce nie ma do niego dostępu. Najprostsza droga: posiłek wybierasz tutaj, w karcie posiłku kopiujesz składniki z gramaturą i wpisujesz je w Fitatu. Treningi z zegarka lub telefonu Fitatu pobiera samo.</p>
  <h2>Źródła</h2><ol class="src">
  <li><a href="https://pacompendium.com/wp-content/uploads/2024/01/2024-adult-compendium_1_2024.pdf" target="_blank" rel="noopener">2024 Adult Compendium of Physical Activities</a>: siłownia, spinning, joga, obwód.</li>
  <li><a href="https://fitmum.ku.dk/2011_Compendium_of_Physical_Activities.pdf" target="_blank" rel="noopener">2011 Compendium of Physical Activities</a>: ergometr wioślarski. Pływanie, nordic walking i orbitrek z wiedzy ogólnej, niesprawdzone.</li>
  <li>Równania metaboliczne ACSM dla marszu i biegu, wzór Mifflina-St Jeora, sprawność brutto jazdy na rowerze ok. 20%: wiedza ogólna, niesprawdzone w tej aplikacji ze źródłem.</li>
  <li>Wartości odżywcze: typowe wartości z tabel składu, orientacyjne.</li></ol>
  ${nextHtml('set')}<p><button class="btn ghost" data-intro="1">Pokaż wprowadzenie</button></p><p><button class="btn ghost" data-tipsreset="1">Pokaż wskazówki ponownie</button></p><p><button class="btn ghost" data-reset="1">Przywróć ustawienia domyślne</button></p>`;
  document.getElementById('main').innerHTML=h;
}

// ---------- Przewodnik „Co chcesz zrobić?”: każde zadanie przenosi na ekran i podświetla miejsce ----------
const HELP=[
  ['Posiłki','Zapisać zjedzony posiłek','W planie dnia naciśnij Zjem przy daniu.','meals#plan'],
  ['Posiłki','Wybrać, co gotuję dziś','Otwórz przepis i naciśnij Gotuję to dziś. Wieczorem Według planu zapisze to danie.','meals#plan'],
  ['Posiłki','Znaleźć szybkie danie albo większe na weekend','Nad listą dań wybierz Na co dzień albo Na weekend.','meals#rytm'],
  ['Posiłki','Zrobić zakupy na tydzień','Lista zakupów z planu jest pod planem dnia.','meals#zakupy'],
  ['Mój dzień','Wpisać wagę','Pomiary dnia. Przyciski − i + zaczynają od ostatniego ważenia.','day#m_w'],
  ['Mój dzień','Wpisać sen i kroki','Pomiary dnia: przepisz z zegarka albo telefonu.','day#m_sleep'],
  ['Mój dzień','Zapisać ból głowy','Naciśnij Boli mnie głowa, potem zaznacz aurę i lek.','day#painrow'],
  ['Mój dzień','Zapisać obwody','Co 2 tygodnie: talia, biodra, udo.','day#m_waist#obwody'],
  ['Mój dzień','Poradzić sobie z ochotą na przekąskę','10 minut z podpowiedziami, bez oceniania.','sos'],
  ['Trening','Dodać trening z zegarka','Czas wybierzesz jednym dotknięciem, kalorie przepisz z zegarka.','train#f_tr.wmin'],
  ['Zdrowie','Przygotować listę na wizytę','Objawy i pytania do skopiowania dla lekarza.','visit'],
  ['Ustawienia','Zmienić wagę, wzrost, wiek albo cel','Twoje dane. Na końcu naciśnij Zapisz i sprawdź.','set#dane'],
  ['Ustawienia','Wpisywać raz dziennie','Jeden wieczorny wpis zamiast kilku w ciągu dnia.','set#wpisy'],
  ['Ustawienia','Ustawić, jak długo widać komunikaty','Zwykle, dłużej albo do zamknięcia.','set#komunikaty'],
  ['Ustawienia','Zrobić kopię danych','Plik kopii albo zaszyfrowana kopia.','set#kopia']];
function renderHelp(){let h='<h2>Co chcesz zrobić?</h2><p class="small muted">Naciśnij Pokaż: Miara przeniesie Cię na właściwy ekran i podświetli miejsce.</p>',g='';
  HELP.forEach(([grp,lab,how,to])=>{if(grp!==g){h+=(g?'</div>':'')+`<h3 class="rh">${grp}</h3><div class="panel" style="padding:0 16px">`;g=grp}h+=`<div class="step"><span class="lab">${lab}<small class="hint">${how}</small></span><button class="btn small ghost" data-${to.includes('#')?'nav':'tab'}="${to}">Pokaż</button></div>`});
  h+='</div><h2>Od początku</h2><p><button class="btn ghost" data-guideshow="1">Pokaż pierwsze kroki</button></p><p><button class="btn ghost" data-tipsreset="1">Pokaż wskazówki ponownie</button></p><p><button class="btn ghost" data-intro="1">Pokaż wprowadzenie</button></p>';
  document.getElementById('main').innerHTML=h}
function render(){renderTabs();({help:renderHelp,meals:renderMeals,train:renderTrain,day:renderDay,set:renderSet,sos:renderSos,health:renderHealth,labs:renderLabs,visit:renderVisit,intro:renderIntro,review:renderReview,recipe:renderRecipe,knee:renderKnee,impact:renderImpact,challenge:renderChallenge,pet:renderPet}[S.tab]||renderDay)();{const t=tipHtml(S.tab),el=document.getElementById('main');if(t)el.innerHTML=t+el.innerHTML}if(DEMO)document.getElementById('main').insertAdjacentHTML('afterbegin','<div class="note demo"><b>Tryb pokazowy, dane przykładowe.</b> Zmiany się nie zapisują. <button class="btn ghost" data-demoexit="1">Wyjdź</button></div>');PET.flush()}
// Komunikat: czas z długości tekstu, 3-12 s, wydłużany albo wyłączany w Ustawieniach (WCAG 2.2.1); zawsze z zamknięciem.
// Drugi argument: liczba (najkrótszy czas w ms) albo {act,arg,label} (przycisk przejścia), {focus} (pole do pokazania)
function toastMs(t){const m={std:1,long:2,stay:0}[S.toastLen];return (m==null?1:m)*Math.min(12000,Math.max(3000,1500+String(t).length*60))}
function toastHide(){const el=document.getElementById('toast');clearTimeout(toast._t);el.classList.remove('show')}
function toast(t,o){const el=document.getElementById('toast'),a=o&&typeof o==='object'&&o.act?o:null;
  el.innerHTML=`<span class="tmsg">${esc(t)}</span><button class="tclose" data-toastclose="1" aria-label="Zamknij komunikat">×</button>`+(a?`<button class="btn small" data-${a.act}="${esc(a.arg)}">${esc(a.label)}</button>`:'');
  el.classList.add('show');clearTimeout(toast._t);const ms=toastMs(t);if(ms)toast._t=setTimeout(()=>el.classList.remove('show'),Math.max(ms,typeof o==='number'?o:0));
  if(o&&o.focus){const f=document.getElementById(o.focus);if(f&&f.scrollIntoView)f.scrollIntoView({behavior:'smooth',block:'center'});if(f&&f.focus)f.focus({preventScroll:true})}}
function setPath(p,v){const a=p.split('.');let o=S;for(let i=0;i<a.length-1;i++)o=o[a[i]];o[a[a.length-1]]=v}

// ---------- Zdarzenia ----------
document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.toastclose){toastHide();return}
  if(b.parentNode&&b.parentNode.id==='toast')toastHide();
  if(d.nav){const [tab,id,fd]=d.nav.split('#');S.tab=tab;if(fd)OPEN_F.add(fd);save();render();const el=id&&document.getElementById(id);
    if(el){if(el.scrollIntoView)el.scrollIntoView({behavior:'smooth',block:'center'});if(el.classList){el.classList.add('flash');setTimeout(()=>el.classList.remove('flash'),2400)}}else window.scrollTo(0,0);return}
  if(d.stp){const k=d.stp,f=k.split('.').pop(),st=STEP[f],L=LIM[f],a=k.split('.');if(!st)return;if(a[0]==='meas'){S.meas[a[1]]=S.meas[a[1]]||{}}
    const raw=k.split('.').reduce((o,x)=>o==null?o:o[x],S),has=raw!=null&&String(raw).trim()!=='';let v=has?num(raw)+(+d.d)*st:stpStart(k);v=Math.min(L[1],Math.max(L[0],v));setPath(k,stpFmt(v,st));
    if(/^meas\.[^.]+\.w$/.test(k))PET.react('weigh');if(/^meas\.[^.]+\.sleep$/.test(k)&&v>=7)PET.react('sleepok');save();render();return}
  if(d.cook){const m=MEALS.find(x=>x.id===d.cook),k=todayKey(),base=PLAN[new Date().getDay()],i=m?base.findIndex(id=>MEALS.find(x=>x.id===id).t===m.t):-1;if(i<0)return;
    S.swaps=S.swaps||{};S.swaps[k]=S.swaps[k]||{};if(base[i]===m.id)delete S.swaps[k][i];else S.swaps[k][i]=m.id;save();render();
    toast(`${SLOT_T[m.t]} na dziś: ${m.n}. Wieczorem „Według planu” zapisze to danie.`,{act:'tab',arg:'meals',label:'Plan dnia'});return}
  if(d.tab){S.tab=d.tab;if(d.tab==='sos'){S.sosStep='trig';sosEnd=0;clearInterval(sosT)}window.scrollTo(0,0)}
  else if(d.trig){S.sosTrig=d.trig;S.sosStep='plan'}
  else if(d.sosstart){sosEnd=Date.now()+600000;clearInterval(sosT);sosT=setInterval(()=>{const l=Math.max(0,Math.ceil((sosEnd-Date.now())/1000)),el=document.getElementById('sosclock');if(el)el.textContent=mmss(l);if(l<=0){clearInterval(sosT);toast('Minęło 10 minut')}},1000)}
  else if(d.sosout){const out=d.sosout;if(out==='inne'){S.sosStep='inne'}else{logUrge(out);PET.react('urge');if(out==='plan'){const pid=PLAN[new Date().getDay()][3],m=MEALS.find(x=>x.id===pid),x=macros(m,1,1);day().push({kind:'m',id:pid,label:m.n,k:x.k,p:x.p,f:x.f,c:x.c})}S.tab='day';sosEnd=0;clearInterval(sosT);toast(out==='minela'?'Zapisano: ochota minęła':'Zapisano przekąskę')}}
  else if(d.sossave){const k=num(document.getElementById('s_k').value),n=document.getElementById('s_n').value.trim();if(k>0)day().push({kind:'m',label:n||'Przekąska',k,p:0,f:0,c:0});logUrge('inne');S.tab='day';sosEnd=0;clearInterval(sosT);toast('Zapisano')}
  else if(d.type){S.f.type=d.type}
  else if(d.chip){const s=S.f.chips[d.chip]||0;const n=s===0?1:s===1?-1:0;if(n)S.f.chips[d.chip]=n;else delete S.f.chips[d.chip]}
  else if(d.carb){S.f.carb=d.carb}
  else if(d.sort){S.f.sort=d.sort}
  else if(d.toggle){open.has(d.toggle)?open.delete(d.toggle):open.add(d.toggle);renderMealList();return}
  else if(d.addmeal){const m=MEALS.find(x=>x.id===d.addmeal),x=macros(m,carbMult(),num(S.f.portion)||1);day().push({kind:'m',id:m.id,label:m.n,k:x.k,p:x.p,f:x.f,c:x.c});PET.react('meal');save();toast(guideToast('Dodano do dnia'),guideAct()||{act:'tab',arg:'day',label:'Mój dzień'});return}
  else if(d.cat){S.tr.cat=d.cat}
  else if(d.opt){S.tr.opt[S.tr.cat]=d.opt}
  else if(d.bmode){S.tr.bMode=d.bmode;if(d.bmode==='bieg'&&num(S.tr.speed)<8)S.tr.speed='8';if(d.bmode==='marsz'&&num(S.tr.speed)>6.5)S.tr.speed='5'}
  else if(d.smode){S.tr.sMode=d.smode}
  else if(d.sclass){S.tr.sClass=d.sclass}
  else if(d.addwatch){const m=num(S.tr.wmin),w=num(S.tr.wk);if(!(m>=1&&m<=300)){toast('Wpisz czas w minutach',{focus:'f_tr.wmin'});return}if(!(w>=10&&w<=3000)){toast('Wpisz kalorie z zegarka, od 10 do 3000',{focus:'f_tr.wk'});return}day().push({kind:'t',label:'Trening z zegarka',min:m,gross:w,net:Math.max(0,Math.round(w-baseH()*m/60)),src:'zegarek'});S.tr.wk='';PET.react('train');save();toast(guideToast('Dodano do dnia'),guideAct()||{act:'tab',arg:'day',label:'Mój dzień'});return}
  else if(d.dayplan){const lg=new Set(day().filter(e=>e.kind==='m').map(e=>e.id));let n=0;planIds().forEach(id=>{if(lg.has(id))return;const m=MEALS.find(x=>x.id===id),x=macros(m,carbMult(),num(S.f.portion)||1);day().push({kind:'m',id,label:m.n,k:x.k,p:x.p,f:x.f,c:x.c,plan:true});lg.add(id);n++});if(n)PET.react('meal');save();toast(n?`Dodano ${n} ${n===1?'posiłek':'posiłki'} z planu, wartości szacunkowe`:'Plan na dziś jest już zapisany',3200);return}
  else if(d.dayother){OPEN_F.add('szybki')}
  else if(d.addtrain){const sp=spec(),m=num(S.tr.min);if(m<=0){toast('Wpisz czas w minutach');return}const k=kcal(sp,m);day().push({kind:'t',label:sp.label,min:m,gross:k.gross,net:k.net});PET.react('train');save();toast(guideToast('Dodano do dnia'),guideAct()||{act:'tab',arg:'day',label:'Mój dzień'});return}
  else if(d.del!=null){day().splice(+d.del,1)}
  else if(d.clear){S.days[todayKey()]=[]}
  else if(d.intronext){if((S.introStep||0)===3&&S.guide)S.guide.dataOk=true;S.introStep=(S.introStep||0)+1;window.scrollTo(0,0)}
  else if(d.introdone){S.onb=true;S.introStep=0;S.tab='day';window.scrollTo(0,0)}
  else if(d.intro){S.introStep=0;S.tab='intro';window.scrollTo(0,0)}
  else if(d.goto){const el=document.getElementById(d.goto);if(el){if(el.scrollIntoView)el.scrollIntoView({behavior:'smooth',block:'center'});if(el.focus)el.focus({preventScroll:true})}return}
  else if(d.revsave){const g=id=>document.getElementById(id).value.trim();S.reviews=S.reviews||{};S.reviews[reviewKey()]={a:g('r_a'),b:g('r_b'),c:g('r_c'),d:todayKey()};S.tab='day';toast('Zapisano przegląd');window.scrollTo(0,0)}
  else if(d.mode){S.mode=d.mode;if(d.mode==='utrzymanie'){S.maintRef=Math.round((avg7()||kg())*10)/10;S.maintSince=todayKey()}else{S.maintSince=''}toast(d.mode==='utrzymanie'?'Tryb utrzymania':'Tryb redukcji')}
  else if(d.leg){const [key,n]=d.leg.split(':'),k=todayKey();S.legs=S.legs||{};S.legs[k]=S.legs[k]||{};S.legs[k][key]=+n}
  else if(d.cyc){const k=todayKey();S.meas[k]=S.meas[k]||{};S.meas[k].cyc=S.meas[k].cyc===d.cyc?'':d.cyc}
  else if(d.bkexp){bkExport();return}
  else if(d.bkpaste){const o=bkParse(document.getElementById('bk_text').value.trim());if(!o){BK_PENDING=null;toast('To nie jest kopia tej aplikacji');return}BK_PENDING=o}
  else if(d.bkapply){if(!BK_PENDING)return;S=merge(clone(DEF),BK_PENDING.data);S.onb=true;S.tab='set';BK_PENDING=null;toast('Wczytano kopię')}
  else if(d.bkcancel){BK_PENDING=null}
  else if(d.chmode){S.chMode=d.chmode}
  else if(d.wi){const [a,b]=d.wi.split(':');S.wi=S.wi||{snack:0,steps:0,train:0};S.wi[a]=+b}
  else if(d.kstart){S.knee.start=todayKey()}
  else if(d.kpain){S.knee.tmpPain=+d.kpain}
  else if(d.kcramp){const K=S.knee,dn=K.sessions.find(x=>x.d===todayKey()),cur=K.tmpCramp!=null?K.tmpCramp:(dn?dn.cramp:false);K.tmpCramp=!cur}
  else if(d.ksave){const K=S.knee,t=todayKey(),dn=K.sessions.find(x=>x.d===t),pain=K.tmpPain!=null?K.tmpPain:(dn?dn.pain:null);if(pain==null){toast('Zaznacz ból kolana 0-10');return}const cramp=K.tmpCramp!=null?K.tmpCramp:(dn?dn.cramp:false);if(!K.start)K.start=t;if(dn){dn.pain=pain;dn.cramp=cramp}else{K.sessions.push({d:t,pain,cramp});const sp={met:3.5},kk=kcal(sp,60);day().push({kind:'t',label:'Program kolana (rower, ćwiczenia nerwowo-mięśniowe i siłowe)',min:60,gross:kk.gross,net:kk.net,knee:1})}K.tmpPain=null;K.tmpCramp=null;PET.react('train');toast('Zapisano sesję')}
  else if(d.kmorn){S.knee.morning[todayKey()]=d.kmorn;toast('Zapisano')}
  else if(d.kday){const v=+d.kday,a=S.knee.days;S.knee.days=a.includes(v)?a.filter(x=>x!==v):[...a,v]}
  else if(d.swap!=null){const i=+d.swap,k=todayKey(),orig=PLAN[new Date().getDay()][i],cur=planIds()[i],t=MEALS.find(m=>m.id===orig).t,bk=macros(MEALS.find(m=>m.id===orig),1,1).k,c=MEALS.filter(m=>m.t===t).sort((a,b)=>(a.id===orig?-1:b.id===orig?1:0)||Math.abs(macros(a,1,1).k-bk)-Math.abs(macros(b,1,1).k-bk)||a.id.localeCompare(b.id)).map(m=>m.id),nx=c[(c.indexOf(cur)+1)%c.length];S.swaps=S.swaps||{};S.swaps[k]=S.swaps[k]||{};if(nx===orig)delete S.swaps[k][i];else S.swaps[k][i]=nx}
  else if(d.shop){const t='Lista zakupów na tydzień\n'+shopLines().join('\n');if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>toast('Skopiowano listę'),()=>toast('Nie udało się skopiować'));else toast('Kopiowanie niedostępne w tej przeglądarce');return}
  else if(d.recipe){if(S.tab!=='recipe')S.recipeBack=S.tab;S.recipe=d.recipe;S.tab='recipe';window.scrollTo(0,0)}
  else if(d.labsave){const g=id=>document.getElementById(id),v=g('l_val').value.trim(),dt=g('l_date').value;if(!v||!isFinite(parseFloat(v.replace(',','.')))){toast('Wpisz wynik liczbowo');return}if(!dt){toast('Wpisz datę');return}S.labs.push({id:Date.now().toString(36),test:LABN[S.labSel]?S.labSel:'tsh',date:dt,val:v.replace(',','.'),unit:g('l_unit').value.trim(),fast:g('l_fast').checked,bio:g('l_bio')?g('l_bio').checked:undefined,cyc:g('l_cyc')?g('l_cyc').value.trim():'',cr:g('l_cr')?g('l_cr').checked:false});toast('Zapisano wynik')}
  else if(d.labdel){S.labs=S.labs.filter(e=>e.id!==d.labdel)}
  else if(d.labcopy){const t=LABS.map(x=>{const es=S.labs.filter(e=>e.test===x.id).sort((a,b)=>a.date.localeCompare(b.date));return es.length?x.n+': '+es.map(e=>fmtDate(e.date)+' '+e.val+' '+e.unit).join('; '):''}).filter(Boolean).join('\n');if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>toast('Skopiowano'),()=>toast('Nie udało się skopiować'));else toast('Kopiowanie niedostępne w tej przeglądarce');return}
  else if(d.quick){const n=document.getElementById('q_n').value.trim(),k=num(document.getElementById('q_k').value);if(k<=0){toast('Wpisz liczbę kalorii');return}day().push({kind:'m',label:n||'Szybki wpis',k,p:0,f:0,c:0})}
  else if(d.repeat){const y=(S.days[keyOf(new Date(Date.now()-864e5))]||[]).filter(e=>e.kind==='m');if(!y.length){toast('Wczoraj nie ma zapisanych posiłków');return}y.forEach(e=>day().push(Object.assign({},e)));PET.react('meal')}
  else if(d.copy){const m=MEALS.find(x=>x.id===d.copy),x=macros(m,carbMult(),num(S.f.portion)||1),t=m.n+'\n'+x.items.map(i=>i.n+': '+Math.round(i.g/5)*5+' g').join('\n');if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>toast('Skopiowano składniki'),()=>toast('Nie udało się skopiować'));else toast('Kopiowanie niedostępne w tej przeglądarce');return}
  else if(d.hab){const k=todayKey();S.hab[k]=S.hab[k]||{};S.hab[k][d.hab]=!S.hab[k][d.hab];if(S.hab[k][d.hab])PET.react('habit',(HABITS.find(x=>x.id===d.hab)||{}).pts||0)}
  else if(d.share){const wp=weekPts(),t=`Mój tydzień w aplikacji Miara: ${wp} pkt, poziom ${level(wp)[1]}, seria ${streak()} dni. Robimy wspólne wyzwanie na przyszły tydzień?`;
    if(navigator.share){navigator.share({text:t}).catch(()=>{})}
    else if(navigator.clipboard){navigator.clipboard.writeText(t).then(()=>toast('Skopiowano do schowka'),()=>toast('Nie udało się skopiować'))}
    return}
  else if(d.petkind){const first=!S.pet;S.pet={kind:d.petkind,name:(S.pet&&S.pet.name)||'',since:(S.pet&&S.pet.since)||todayKey()};if(first)S.petSeen=[...new Set([...(S.petSeen||[]),...PET.milestones(petCtx())])]}
  else if(d.petpick){S.tab='set';window.scrollTo(0,0)}
  else if(d.datasave){const c=dataCheck();if(c.err.length){toast(c.err[0],3200);const el=document.getElementById('f_'+c.first);if(el&&el.focus)el.focus()}else{S.guide=S.guide||{};S.guide.dataOk=true;save();toast('Dane zapisane')}}
  else if(d.pain){const k=d.pain==='yday'?nAgo(1):todayKey();S.pain=S.pain||{};S.pain[k]=S.pain[k]||{aura:false,med:false};toast(d.pain==='yday'?'Wczoraj zapisany jako dzień z bólem':'Dzień z bólem: seria się nie przerwie',2400)}
  else if(d.painaura||d.painmed){const p=painAt(todayKey());if(p){const f=d.painaura?'aura':'med';p[f]=!p[f]}}
  else if(d.painoff){if(S.pain)delete S.pain[todayKey()]}
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
  else if(d.toastlen){S.toastLen=d.toastlen;toast(d.toastlen==='stay'?'Komunikat zostanie, dopóki go nie zamkniesz.':'Tak długo będzie widać komunikat.')}
  else if(d.setv){setPath(d.setv,d.v)}
  else if(d.pace){S.f.pace=d.pace}
  else if(d.demoexit){location.hash='';location.reload();return}
  else if(d.sex){S.sex=d.sex}
  else if(d.reset){const days=S.days;S=clone(DEF);S.days=days;S.tab='set'}
  else return;
  save();render();
});
document.addEventListener('input',e=>{
  const el=e.target;
  if(el.dataset.r){const k=el.dataset.r,v=num(el.value);S.f[k]=v;save();
    const lab=document.getElementById('l_'+k);
    if(lab)lab.textContent=k==='minP'?v+' g':k==='maxK'?(v>=1000?'bez limitu':v+' kcal'):k==='maxC'?(v>=130?'bez limitu':v+' g'):'×'+fmt1(v);
    renderMealList();return}
  const k=el.dataset.k;if(!k)return;
  if(el.type==='checkbox'){setPath(k,el.checked);if(k==='body'&&el.checked)toast('Sylwetka pokazuje trend 4 tygodni. Pojedyncze pomiary się wahają.');save();render();return}
  let v=el.value;const im=el.getAttribute('inputmode');
  if(im==='decimal'||im==='numeric'){const c=checkNum(k,v);el.classList.toggle('bad',!!c.err);el.setAttribute('aria-invalid',c.err?'true':'false');el.title=c.err||'';if(c.err)return}
  setPath(k,v);save();
  const pos=el.selectionStart;REDRAW=true;try{render()}finally{REDRAW=false}
  const n=document.querySelector(`[data-k="${k}"]`);if(n){n.focus({preventScroll:true});try{n.setSelectionRange(pos,pos)}catch(_){}}
});
// Wartość sprzed edycji pola: render() po każdym znaku odtwarza pole i ponownie wywołuje focusin, więc zapis tylko przy zmianie pola
let EDIT=null,REDRAW=false;
document.addEventListener('focusin',e=>{const k=e.target.dataset&&e.target.dataset.k;if(k&&(!EDIT||EDIT.k!==k))EDIT={k,v:k.split('.').reduce((o,x)=>o==null?o:o[x],S)}});
// Wyjście z pola liczbowego: błędny wpis wraca do wartości sprzed edycji, poprawny jest normalizowany (10 000 -> 10000, 82,4 kg -> 82,4).
// Pełne przerysowanie dopiero, gdy żadne pole nie jest aktywne, żeby nie zamykać klawiatury przy przejściu do następnego pola.
document.addEventListener('focusout',e=>{const el=e.target,k=el.dataset&&el.dataset.k,im=el.getAttribute&&el.getAttribute('inputmode');if(REDRAW||!k||(im!=='decimal'&&im!=='numeric'))return;
  if(el.classList.contains('bad')){const v=EDIT&&EDIT.k===k&&EDIT.v!=null?EDIT.v:'';setPath(k,v);el.value=v;el.classList.remove('bad');el.setAttribute('aria-invalid','false');toast((el.title||'Popraw wartość')+'. Zostaje poprzednia wartość.')}
  else{const c=checkNum(k,el.value);if(c.s!==el.value){setPath(k,c.s);el.value=c.s}
    if(/^meas\.[^.]+\.w$/.test(k)&&num(c.s)>0)PET.react('weigh');if(/^meas\.[^.]+\.sleep$/.test(k)&&num(c.s)>=7)PET.react('sleepok')}
  EDIT=null;save();setTimeout(()=>{const a=document.activeElement;if(!(a&&a.dataset&&a.dataset.k))render()},0)});
document.addEventListener('change',e=>{if(e.target.dataset&&e.target.dataset.labsel){S.labSel=e.target.value;save();render()}});
// usuń dni starsze niż 60
(function(){const lim=Date.now()-60*864e5;for(const k in S.days){if(new Date(k).getTime()<lim)delete S.days[k]}save()})();
if(!S.onb){S.tab='intro';S.introStep=0}
render();
if(!DEMO)chInit();
// Automatyczna wysyłka kopii dla rady po starcie (bez blokowania widoku)
if(typeof window!=='undefined'&&typeof window.addEventListener==='function')setTimeout(()=>{kopiaAuto().then(ok=>{if(ok&&S.tab==='set')render()})},3000);
