// Sygnały brzucha: Miara mówi głosem zwierzaka, kiedy iść do lekarza (docs/specs/2026-11-13-sygnaly-brzuch-design.md).
// Czyste funkcje bez DOM: dostają stan aplikacji (S) i dzień (klucz RRRR-MM-DD); okna liczone od k, nigdy od zegara.
// To wsparcie wizyty u lekarza, nie diagnoza. Nowa reguła = nowy wiersz w RULES (kolejność wiersza = kolejność przy równym poziomie).
var SYG = (function () {
  const DAY = 864e5;
  const LVL = ['112', 'wkrotce', 'badanie', 'sam'];
  const keyOf = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const back = (k, i) => keyOf(new Date(Date.parse(k + 'T12:00:00') - i * DAY));
  const plural = (n, one, few, many) => {
    if (n === 1) return one;
    const d = n % 10, t = n % 100;
    return d >= 2 && d <= 4 && (t < 12 || t > 14) ? few : many;
  };
  const dni = (n) => `${n} ${plural(n, 'dzień', 'dni', 'dni')}`;
  const arr = (v) => (Array.isArray(v) ? v : []);
  const day = (S, k) => ((S || {}).gut || {})[k] || {};

  // Liczby liczone raz na wywołanie ocen; reguły tylko je czytają
  function ctxOf(S, k) {
    const c = { entry28: 0, u28: 0, u7: 0, bf28: 0, obj28: 0, a7: [], aToday: [], hp: ((S.wizyta || {}).hp) || 'brak' };
    for (let i = 0; i < 28; i++) {
      const g = day(S, back(k, i));
      const u = arr(g.u), a = arr(g.a);
      if (g.b != null || g.f != null || g.n != null || g.s != null || u.length || a.length) c.entry28++;
      const bf = g.b >= 5 || g.f === 'luzny';
      if (u.length) { c.u28++; if (i < 7) c.u7++; }
      if (bf) c.bf28++;
      if (u.length || bf) c.obj28++;
      if (i < 7) a.forEach((x) => c.a7.push(x));
      if (i === 0) c.aToday = a;
    }
    return c;
  }

  const HP = ['brak', 'zlecone', 'potw', 'leczone', 'wykl', 'nic'];
  const HP_MUTED = ['zlecone', 'potw', 'wykl', 'nic', 'leczone'];
  const U = ['piecze', 'pelnosc', 'zgaga'];
  const A = ['krew', 'wymkrew', 'bol', 'polyk', 'wymioty'];
  const DATE = /^\d{4}-\d{2}-\d{2}$/;
  const realDay = (v) => typeof v === 'string' && DATE.test(v) && back(v, 0) === v;
  const num = (v) => parseFloat(String(v == null ? '' : v).replace(',', '.'));
  const prog = (c) => c.entry28 >= 14 && c.u28 >= 8;
  const stomach = (c) => `Objawy z żołądka: ${c.u28} z 28 dni (${c.entry28} dni z wpisem)`;
  // Ostatni wynik ferrytyny z własnym progiem z wydruku; bez lo reguła się nie włącza
  const ferrLow = (S) => {
    const l = arr((S || {}).labs).filter((x) => x && x.test === 'ferr').sort((a, b) => String(a.date || '').localeCompare(String(b.date || ''))).pop();
    if (!l) return null;
    const v = num(l.val), lo = num(l.lo);
    return !isNaN(v) && !isNaN(lo) && v < lo ? `Ferrytyna ${l.val} poniżej ${l.lo}` : null;
  };

  const ALARM = [['krew', 'krew w stolcu lub czarny stolec'], ['wymkrew', 'wymioty krwią lub jak fusy od kawy'], ['bol', 'nagły silny ból brzucha lub w klatce']];

  // on(S, k, c) zwraca linię „Dane” (tekst z liczbami) albo null, gdy reguła nie jest aktywna
  const RULES = [
    {
      id: 'alarm', lvl: '112', row: 31, rm: false, src: ['nhsulcer', 'nhsgastritis'],
      t: 'Objaw alarmowy dziś',
      x: 'To pilne: zadzwoń 112 albo jedź na SOR.',
      co: ['Zadzwoń 112 albo jedź na SOR.', 'Nie czekaj na wizytę planową.'],
      on: (S, k, c) => { const l = ALARM.filter((x) => c.aToday.includes(x[0])).map((x) => x[1]); return l.length ? 'Dziś: ' + l.join(', ') : null; },
    },
    {
      id: 'pilne', lvl: 'wkrotce', row: 32, rm: false, src: ['nhsindig'],
      t: 'Trudność z połykaniem lub częste wymioty',
      x: 'Umów wizytę u lekarza w najbliższych dniach.',
      co: ['Umów wizytę u lekarza w najbliższych dniach.', 'Zabierz listę objawów z dziennika.'],
      on: (S, k, c) => {
        const p = c.a7.filter((x) => x === 'polyk').length, w = c.a7.filter((x) => x === 'wymioty').length, parts = [];
        if (p) parts.push(`trudność z połykaniem: ${dni(p)}`);
        if (w) parts.push(`częste wymioty: ${dni(w)}`);
        return parts.length ? 'W 7 dniach ' + parts.join(', ') : null;
      },
    },
    {
      id: 'gastro45', lvl: 'wkrotce', row: 33, rm: false, src: ['ptge23'],
      t: 'Objawy z żołądka po 45. roku życia',
      x: 'Zapytaj lekarza o skierowanie na gastroskopię.',
      co: ['Zapytaj lekarza o skierowanie na gastroskopię.', 'Powiedz, od kiedy trwają objawy.'],
      on: (S, k, c) => (((S.prof || {}).g45 && c.u7) ? `Objawy z żołądka: ${c.u7} z 7 dni` : null),
    },
    {
      id: 'hp_test', lvl: 'badanie', row: 34, rm: true, src: ['ptge23'],
      t: 'Objawy z żołądka od dłuższego czasu',
      x: 'Zapytaj lekarza o test na *H. pylori*: antygen w kale (laboratoryjny) albo test oddechowy, nie z krwi. Ustal z lekarzem przerwę przed testem: 14 dni bez leków na kwas (IPP), 4 tygodnie bez antybiotyków.',
      co: ['Zapytaj lekarza o test na *H. pylori*: antygen w kale (laboratoryjny) albo test oddechowy, nie z krwi. Ustal z lekarzem przerwę przed testem: 14 dni bez leków na kwas (IPP), 4 tygodnie bez antybiotyków.', 'Ustal z lekarzem przerwę przed testem.'],
      on: (S, k, c) => ((prog(c) && !(S.prof || {}).g45 && !HP_MUTED.includes(c.hp)) ? stomach(c) : null),
    },
    {
      id: 'hp_nlpz', lvl: 'badanie', row: 35, rm: false, src: ['ptge23', 'nhsindig'],
      t: 'Objawy z żołądka i ibuprofen lub aspiryna',
      x: 'Powiedz lekarzowi o ibuprofenie lub aspirynie i zapytaj o test na *H. pylori*.',
      co: ['Powiedz lekarzowi o ibuprofenie lub aspirynie.', 'Zapytaj o test na *H. pylori*.'],
      on: (S, k, c) => (((S.prof || {}).nlpz && c.u28 && !HP_MUTED.includes(c.hp)) ? stomach(c) : null),
    },
    {
      id: 'hp_rodz', lvl: 'badanie', row: 36, rm: false, src: ['ptge23'],
      t: 'Rak żołądka w rodzinie',
      x: 'Zapytaj lekarza o test na *H. pylori*.',
      co: ['Zapytaj lekarza o test na *H. pylori*.', 'Powiedz, kto w rodzinie chorował na raka żołądka.'],
      on: (S, k, c) => (((S.prof || {}).rodzRak && !HP_MUTED.includes(c.hp)) ? 'W profilu: rak żołądka u bliskiej osoby' : null),
    },
    {
      id: 'celiakia', lvl: 'badanie', row: 37, rm: true, src: ['nhscoeliac'],
      t: 'Częste wzdęcia lub luźne stolce',
      x: 'Zapisujesz to często: zapytaj lekarza o badanie w kierunku celiakii. Jedz gluten, dopóki diagnoza nie jest potwierdzona.',
      co: ['Zapytaj lekarza o badanie w kierunku celiakii.', 'Jedz gluten, dopóki diagnoza nie jest potwierdzona.'],
      on: (S, k, c) => {
        const hashi = ((S.prof || {}).cond || {}).hashi;
        return ((c.entry28 >= 14 && c.bf28 >= 8) || (hashi && c.bf28 >= 1)) ? `Wzdęcie 5+ lub luźny stolec: ${c.bf28} z 28 dni (${c.entry28} dni z wpisem)` : null;
      },
    },
    {
      id: 'zelazo', lvl: 'badanie', row: 38, rm: false, src: ['ptge23', 'nhscoeliac'],
      t: 'Niski wynik ferrytyny i objawy z brzucha',
      x: 'Zapytaj lekarza, czy szukać przyczyny niedoboru żelaza (m.in. *H. pylori* i celiakia).',
      co: ['Zapytaj lekarza, czy szukać przyczyny niedoboru żelaza.', 'Pokaż ostatni wynik ferrytyny.'],
      on: (S, k, c) => { const f = c.obj28 ? ferrLow(S) : null; return f ? `${f}; objawy z brzucha: ${c.obj28} z 28 dni` : null; },
    },
    {
      id: 'hp_kontrola', lvl: 'badanie', row: 39, rm: false, src: ['ptge23'],
      t: 'Po leczeniu H. pylori',
      x: 'Zapytaj lekarza o test, czy leczenie zadziałało.',
      co: ['Zapytaj lekarza o test, czy leczenie zadziałało.', 'Ustal z lekarzem, kiedy go zrobić.'],
      on: (S, k, c) => (c.hp === 'leczone' ? 'Zapisane po wizycie: leczenie H. pylori' : null),
    },
    {
      id: 'sam_zoladek', lvl: 'sam', row: 40, rm: false, src: ['nhsindig'],
      t: 'Co możesz zrobić sam przy żołądku',
      x: 'Śpij z uniesioną głową i barkami. Nie bierz ibuprofenu ani aspiryny bez zalecenia.',
      co: ['Śpij z uniesioną głową i barkami.', 'Nie bierz ibuprofenu ani aspiryny bez zalecenia.'],
      on: (S, k, c) => (c.u7 ? `Objawy z żołądka: ${c.u7} z 7 dni` : null),
    },
    {
      id: 'zapisuj', lvl: 'sam', row: 28, rm: true, src: [],
      t: 'Zapisuj dalej',
      x: 'Zapisuj dalej: po 14 dniach z wpisem powiem więcej.',
      co: ['Zapisuj dalej: po 14 dniach z wpisem powiem więcej.', 'Zaznaczaj objawy z żołądka i wzdęcia na bieżąco.'],
      on: (S, k, c) => ((c.entry28 < 14 && c.obj28 >= 1) ? `Dni z wpisem: ${c.entry28} z 14` : null),
    },
  ];

  function ocen(S, k, o) {
    if (!S || !((S.prof || {}).cond || {}).gut) return [];
    const c = ctxOf(S, k), out = [];
    RULES.forEach((r, i) => {
      if (S.discreet && !(o && o.all) && r.id !== 'alarm') return;
      const d = r.on(S, k, c);
      if (d != null) out.push({ id: r.id, lvl: r.lvl, t: r.t, x: r.x, d, co: r.co.slice(), src: r.src.slice(), rm: r.rm, row: r.row, i });
    });
    out.sort((a, b) => LVL.indexOf(a.lvl) - LVL.indexOf(b.lvl) || a.i - b.i);
    return out.map((s) => { delete s.i; return s; });
  }

  // Sygnały bez tych, które osoba oznaczyła „Przeczytane” w ciągu ostatnich 14 dni; alarm zostaje zawsze
  function visible(S, k, o) {
    const seen = (S && S.sygSeen) || {};
    return ocen(S, k, o).filter((s) => s.lvl === '112' || !(realDay(seen[s.id]) && k <= back(seen[s.id], -13)));
  }

  // Normalizacja po wczytaniu i imporcie kopii: tylko znane wartości, braki uzupełnione
  function fix(S) {
    if (!S || typeof S !== 'object') return S;
    const keep = (v, list) => arr(v).filter((x, i, a) => list.includes(x) && a.indexOf(x) === i);
    if (S.gut && typeof S.gut === 'object') Object.keys(S.gut).forEach((k) => {
      const g = S.gut[k];
      if (!g || typeof g !== 'object') return;
      g.u = keep(g.u, U);
      g.a = keep(g.a, A);
    });
    if (S.prof && typeof S.prof === 'object') ['g45', 'nlpz', 'rodzRak'].forEach((f) => { S.prof[f] = S.prof[f] === true; });
    const w = S.wizyta && typeof S.wizyta === 'object' ? S.wizyta : {};
    w.hp = HP.includes(w.hp) ? w.hp : 'brak';
    if (typeof w.d !== 'string' || !DATE.test(w.d)) delete w.d;
    S.wizyta = w;
    const seen = S.sygSeen && typeof S.sygSeen === 'object' && !Array.isArray(S.sygSeen) ? S.sygSeen : {};
    Object.keys(seen).forEach((id) => { if (!realDay(seen[id])) delete seen[id]; });
    S.sygSeen = seen;
    const ids = RULES.map((r) => r.id);
    S.wizList = arr(S.wizList).filter((x, i, a) => ids.includes(x) && a.indexOf(x) === i);
    return S;
  }

  return { ocen, visible, fix, LVL, back, HP, U, A };
})();
