// Etap 1: „Co się wydarzyło” i jeden cel aktywny (docs/specs/2026-11-10-etap1-zdarzenia-i-cel-design.md).
// Czyste funkcje bez DOM: dostają stan aplikacji (S), dzień (klucz RRRR-MM-DD) i ctx z app.js (cel białka, estrogen).
// Wpływy i działania tylko z wierszy mapy powiązań ze statusem „Sprawdzone: tak”; opis okresu „w tym czasie”, nigdy przyczyna.
var ZD = (function () {
  const DAY = 864e5;
  const num = (v) => { const x = parseFloat(String(v == null ? '' : v).replace(',', '.')); return Number.isFinite(x) ? x : 0; };
  const keyOf = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const back = (k, n) => keyOf(new Date(Date.parse(k + 'T12:00:00') - n * DAY));
  const fmt = (v) => String(Math.round(v * 10) / 10).replace('.', ',');
  const fmtInt = (v) => String(Math.round(v));
  const plural = (n, one, few, many) => {
    if (n === 1) return one;
    const d = n % 10, t = n % 100;
    return d >= 2 && d <= 4 && (t < 12 || t > 14) ? few : many;
  };

  // Dane jednego dnia
  const meas = (S, k) => (S.meas || {})[k] || {};
  const weight = (S, k) => num(meas(S, k).w) || null;
  const sleep = (S, k) => num(meas(S, k).sleep) || null;
  const steps = (S, k) => num(meas(S, k).steps) || null;
  const entries = (S, k) => (S.days || {})[k] || [];
  const pain = (S, k) => (S.pain || {})[k] || null;
  const hasEntry = (S, k) => entries(S, k).length > 0 || Object.values(meas(S, k)).some((v) => num(v) > 0) || !!pain(S, k);

  // Średnia z dni [a, b] wstecz od k (0 = k)
  function avg(S, k, a, b, get) {
    const v = [];
    for (let i = a; i <= b; i++) { const x = get(S, back(k, i)); if (x) v.push(x); }
    return { n: v.length, avg: v.length ? v.reduce((s, x) => s + x, 0) / v.length : null };
  }
  const count = (S, k, days, test) => { let n = 0; for (let i = 0; i < days; i++) if (test(S, back(k, i))) n++; return n; };

  // Wiersze mapy powiązań ze statusem „Sprawdzone: tak” (rada/mapa_powiazan.md, cytaty w rada/2026-11-08_zrodla.md)
  const SRC = {
    4: { sila: 'umiarkowane', url: 'https://pubmed.ncbi.nlm.nih.gov/27804960/' },
    5: { sila: 'umiarkowane', url: 'https://pubmed.ncbi.nlm.nih.gov/17403039/' },
    3: { sila: 'mocne', url: 'https://ichd-3.org/8-headache-attributed-to-a-substance-or-its-withdrawal/8-2-medication-overuse-headache-moh/' },
    7: { sila: 'mocne', url: 'https://pubmed.ncbi.nlm.nih.gov/17848938/' },
    9: { sila: 'słabe', url: 'https://pubmed.ncbi.nlm.nih.gov/21185970/' },
    10: { sila: 'mocne', url: 'https://kops.uni-konstanz.de/entities/publication/2e749bfb-8533-437c-8203-7e788c910c5f' },
    11: { sila: 'umiarkowane', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6734345/' },
    12: { sila: 'mocne', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9289978/' },
    13: { sila: 'umiarkowane', url: 'https://pubmed.ncbi.nlm.nih.gov/25926512/' },
    15: { sila: 'mocne', url: 'https://ichd-3.org/8-headache-attributed-to-a-substance-or-its-withdrawal/8-3-headache-attributed-to-substance-withdrawal/8-3-1-caffeine-withdrawal-headache/' },
    18: { sila: 'mocne', url: 'https://www.cosrh.org/Common/Uploaded%20files/documents/UKMEC_2025.pdf' },
    19: { sila: 'umiarkowane', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6908414/' },
  };
  const link = (row, to, t, mig) => ({ row, to, t, mig: !!mig, ...SRC[row] });
  const PLAN = link(10, 'Realizacja celu', 'Plan „jeśli…, to…” pomaga zrobić to, co zaplanowane (średni efekt d = 0,65).');
  const IMPACT = {
    sen: [
      link(4, 'Apetyt i jedzenie', 'Po skróconym śnie osoby jadły więcej, średnio ok. 385 kcal na dobę.'),
      link(5, 'Migrena', 'Nieregularny sen to częsty wyzwalacz migreny.', true),
    ],
    bialko: [link(13, 'Sytość i mięśnie', 'Więcej białka zwiększa sytość i pomaga chronić mięśnie przy redukcji.')],
    ruch: [
      link(12, 'Zdrowie ogólnie', 'Więcej kroków wiązało się z mniejszą śmiertelnością; korzyść rośnie do ok. 8-10 tys. kroków (6-8 tys. od 60 lat).'),
      link(11, 'Migrena', 'Regularny ruch tlenowy zmniejszał liczbę dni z migreną średnio o ok. 0,6 dnia w miesiącu.', true),
    ],
    sila: [
      link(19, 'Insulina', 'Trening siłowy poprawiał działanie insuliny także bez spadku masy ciała.'),
      link(13, 'Mięśnie przy redukcji', 'Razem z białkiem w posiłkach: białko pomaga chronić mięśnie przy redukcji.'),
    ],
    zapisy: [link(9, 'Waga', 'Regularne zapisy jedzenia i ważenie wiązały się z większą utratą masy; dowody są słabe.')],
    bol: [
      link(3, 'Leki przeciwbólowe', 'Leki przeciwbólowe brane w wielu dniach w miesiącu mogą podtrzymywać bóle głowy.'),
      link(5, 'Jedzenie i sen', 'Pomijane posiłki i nieregularny sen to częste wyzwalacze migreny.'),
      link(15, 'Kofeina', 'Nagłe odstawienie kofeiny (ponad 200 mg dziennie przez ponad 2 tygodnie) może wywołać ból głowy.'),
    ],
    waga: [link(7, 'Tempo zmian', 'Kilogram tkanki tłuszczowej to ok. 32,2 MJ (ok. 7700 kcal), dlatego zmienia się powoli i Miara pokazuje średnią z 7 dni.')],
  };

  const goals = [
    { id: 'bol', t: 'Mniej dni z bólem głowy' },
    { id: 'sen', t: 'Mniej krótkich nocy' },
    { id: 'bialko', t: 'Białko w każdym dniu' },
    { id: 'ruch', t: 'Więcej kroków' },
    { id: 'sila', t: 'Trening siłowy 2 razy w tygodniu' },
    { id: 'zapisy', t: 'Regularne zapisy' },
    { id: 'waga', t: 'Waga docelowa' },
  ];
  const goalOf = (id) => goals.find((g) => g.id === id) || null;
  const migProfile = (S) => { const c = (S.prof || {}).cond || {}; return !!c.mig || !!c.aura; };
  // Próg kroków: Paluch i in. 2022, wypłaszczenie korzyści od 8000 (wiek <60) albo 6000 (wiek ≥60)
  const stepGoal = (S) => (num(S.age) >= 60 ? 6000 : 8000);
  // Trening siłowy: wpis „Siłownia” albo sesja programu kolana (część siłowa w protokole)
  const strength = (S, k) => entries(S, k).filter((e) => e.kind === 't' && (e.knee || /siłown/i.test(e.label || ''))).length;
  const strengthDays = (S, k) => { let n = 0; for (let i = 0; i < 7; i++) n += strength(S, back(k, i)); return n; };
  // Dni z bólem w 28 dniach kończących się k oraz w 28 dniach wcześniej
  const painNow = (S, k) => count(S, k, 28, (s, d) => !!pain(s, d)), painBefore = (S, k) => count(S, back(k, 28), 28, (s, d) => !!pain(s, d));
  const protDays = (S, k, pT) => {
    let meals = 0, met = 0;
    for (let i = 0; i < 7; i++) {
      const m = entries(S, back(k, i)).filter((e) => e.kind === 'm');
      if (!m.length) continue;
      meals++;
      if (m.reduce((s, e) => s + num(e.p), 0) >= pT) met++;
    }
    return { meals, met };
  };

  // Postęp celu w 7 dniach kończących się dniem k
  function progress(S, id, k, ctx) {
    const c = ctx || {};
    if (id === 'sen') {
      const n = count(S, k, 7, (s, d) => sleep(s, d) != null), ok = count(S, k, 7, (s, d) => sleep(s, d) >= 6);
      return { ok, n, txt: `${ok} z 7 nocy co najmniej 6 h (${n} ${plural(n, 'noc', 'noce', 'nocy')} z wpisem)` };
    }
    if (id === 'bialko') {
      const p = protDays(S, k, c.pT || 0);
      return { ok: p.met, n: p.meals, txt: `${p.met} z ${p.meals} dni z posiłkami z celem białka (${fmtInt(c.pT || 0)} g)` };
    }
    if (id === 'ruch') {
      const a = avg(S, k, 0, 6, steps), cel = stepGoal(S);
      return { ok: a.avg || 0, n: a.n, cel, txt: a.n ? `średnio ${fmtInt(a.avg)} kroków z ${a.n} dni, próg ${cel}` : 'brak wpisów kroków w tym tygodniu' };
    }
    if (id === 'sila') {
      const ok = strengthDays(S, k);
      return { ok, n: 7, txt: `${ok} z 2 treningów siłowych w 7 dniach` };
    }
    if (id === 'zapisy') {
      const ok = count(S, k, 7, hasEntry);
      return { ok, n: 7, txt: `${ok} z 7 dni z wpisem` };
    }
    if (id === 'bol') {
      const ok = count(S, k, 28, (s, d) => !!pain(s, d));
      return { ok, n: 28, txt: `${ok} ${plural(ok, 'dzień', 'dni', 'dni')} z bólem w ostatnich 28 dniach` };
    }
    const a = avg(S, k, 0, 6, weight), b = avg(S, k, 7, 13, weight), goal = num(S.goal);
    if (!a.n) return { ok: 0, n: 0, txt: 'brak ważeń w tym tygodniu' };
    const d = b.n ? a.avg - b.avg : null;
    return { ok: a.avg, n: a.n, txt: `średnia ${fmt(a.avg)} kg z ${a.n} ważeń` + (d != null ? `, tydzień wcześniej ${fmt(b.avg)} kg` : '') + (goal ? `; cel ${fmt(goal)} kg` : '') };
  }

  // Tydzień celu kończący się dniem k zaliczony (progi w specyfikacji etapu 3); waga to cel długoterminowy
  function done(S, id, k, ctx) {
    const c = ctx || {};
    if (id === 'zapisy') return count(S, k, 7, hasEntry) >= 5;
    if (id === 'sen') return count(S, k, 7, (s, d) => sleep(s, d) >= 6) >= 6;
    if (id === 'bialko') return protDays(S, k, c.pT || 0).met >= 5;
    if (id === 'ruch') { const a = avg(S, k, 0, 6, steps); return a.n >= 4 && a.avg >= stepGoal(S); }
    if (id === 'sila') return strengthDays(S, k) >= 2;
    if (id === 'bol') return painNow(S, k) < painBefore(S, k);
    return false;
  }

  // Pierwszy pasujący cel w kolejności rady: ból, sen, białko, ruch, siła, zapisy, waga; skip pomija podane cele
  function suggest(S, k, ctx, skip) {
    const c = ctx || {}, sk = skip || [], io = !!((S.prof || {}).cond || {}).io;
    const p = protDays(S, k, c.pT || 0), a = avg(S, k, 0, 6, steps);
    const test = {
      bol: () => migProfile(S) && painNow(S, k) >= 1 && painNow(S, k) >= painBefore(S, k),
      sen: () => count(S, k, 7, (s, d) => sleep(s, d) != null && sleep(s, d) < 6) >= 2,
      bialko: () => p.meals >= 3 && p.met < 4,
      ruch: () => a.n >= 3 && a.avg < stepGoal(S),
      sila: () => io && strengthDays(S, k) < 2,
      zapisy: () => count(S, k, 7, hasEntry) < 4,
    };
    for (const id of ['bol', 'sen', 'bialko', 'ruch', 'sila', 'zapisy']) if (!sk.includes(id) && test[id]()) return id;
    return 'waga';
  }

  function impact(id, prof) {
    const mig = !!((prof || {}).cond || {}).mig || !!((prof || {}).cond || {}).aura;
    return (IMPACT[id] || []).filter((x) => !x.mig || mig).concat([PLAN]);
  }

  // Sygnały „najpierw lekarz” (wiersze 1 i 3); nigdy nie są celem
  function signals(S, k, ctx) {
    const out = [], c = (S.prof || {}).cond || {};
    if (c.aura && (ctx || {}).est) out.push({ id: 'aura_estrogen', t: 'Migrena z aurą i tabletki z estrogenem', x: 'Porozmawiaj z lekarzem o antykoncepcji: przy migrenie z aurą estrogen zwiększa ryzyko udaru.', row: 1 });
    // Migrena bez aury (profil i 90 dni dziennika bez aury) i estrogen: UKMEC 2025, kontynuacja kategoria 3 (wiersz 18)
    if (c.mig && !c.aura && (ctx || {}).est && !count(S, k, 90, (s, d) => !!(pain(s, d) || {}).aura)) out.push({ id: 'mig_estrogen', t: 'Migrena bez aury i tabletki z estrogenem', x: 'UKMEC 2025, migrena bez aury i tabletki złożone: rozpoczęcie kategoria 2, kontynuacja kategoria 3 (ryzyko zwykle przewyższa korzyści). Porozmawiaj z ginekologiem o metodzie; nie odstawiaj tabletek bez innej antykoncepcji.', row: 18 });
    const med = count(S, k, 30, (s, d) => !!(pain(s, d) || {}).med);
    if (med >= 10) out.push({ id: 'leki', t: `${med} dni z lekiem przeciwbólowym w 30 dniach`, x: 'Pokaż to lekarzowi: częste leki przeciwbólowe mogą podtrzymywać bóle głowy.', row: 3 });
    return out;
  }

  // „W tym czasie”: działania z 7 dni kończących się dniem zdarzenia
  function during(S, k) {
    let tr = 0, ml = 0;
    for (let i = 0; i < 7; i++) {
      const e = entries(S, back(k, i));
      tr += e.filter((x) => x.kind === 't').length;
      ml += e.filter((x) => x.kind === 'm').length;
    }
    const parts = [`${tr} ${plural(tr, 'trening', 'treningi', 'treningów')}`, `${ml} ${plural(ml, 'zapisany posiłek', 'zapisane posiłki', 'zapisanych posiłków')}`];
    if (S.krok) parts.push('aktywny krok tygodnia');
    return 'w tym czasie: ' + parts.join(', ');
  }

  // Zdarzenia z 28 dni kończących się dniem today, od najnowszego
  function events(S, today, ctx) {
    const out = [];
    const add = (id, k, t, x, z, act) => out.push({ id, k, t, x, z, w: during(S, k), act: act || null });

    for (let i = 0; i < 28; i++) {
      const k = back(today, i), prev = back(k, 1), prev2 = back(k, 2);
      // Krótkie noce: pierwszy dzień serii 2 nocy poniżej 6 h (wiersz 4)
      const short = (d) => sleep(S, d) != null && sleep(S, d) < 6;
      if (short(k) && short(prev) && !short(prev2)) {
        add('krotki_sen', k, 'Krótkie noce', 'Dwie noce z rzędu krócej niż 6 h. Po krótkim śnie łatwiej o większy apetyt.', `sen: ${fmt(sleep(S, prev))} h i ${fmt(sleep(S, k))} h (2 wpisy)`, link(4, 'Apetyt', ''));
      }
      // Ból: 3 dni z bólem w 7 dniach, pierwszy dzień, w którym próg został osiągnięty
      const pd = (d) => count(S, d, 7, (s, x) => !!pain(s, x));
      if (pd(k) >= 3 && pd(prev) < 3) add('bol_dni', k, 'Więcej dni z bólem', 'Trzy dni z bólem w ostatnim tygodniu. Lista na wizytę zbiera je dla lekarza.', `${pd(k)} dni z bólem w 7 dniach (dziennik bólu)`);
      // Powrót po co najmniej 3 dniach bez wpisów, gdy wcześniej były wpisy
      if (hasEntry(S, k) && [1, 2, 3].every((n) => !hasEntry(S, back(k, n)))) {
        let before = false;
        for (let n = 4; n < 60 && !before; n++) before = hasEntry(S, back(k, n));
        if (before) add('powrot', k, 'Powrót', 'Dobrze, że jesteś. Zaczynamy od tego, co dziś.', '1 dzień z wpisem po przerwie');
      }
    }

    // Co tydzień (dziś, 7, 14, 21 dni temu): średnie wagi i kroków; każde zdarzenie najwyżej raz, najnowsze,
    // bo zachodzące okna powtarzałyby ten sam spadek
    let wDone = false, sDone = false;
    for (const off of [0, 7, 14, 21]) {
      const k = back(today, off);
      const a = avg(S, k, 0, 6, weight), b = avg(S, k, 21, 27, weight);
      if (!wDone && a.n >= 3 && b.n >= 3 && Math.abs(a.avg - b.avg) >= 0.5) {
        wDone = true;
        const d = a.avg - b.avg;
        add('waga_zmiana', k, `Średnia wagi ${d < 0 ? 'spadła' : 'wzrosła'} o ${fmt(Math.abs(d))} kg`, 'Porównanie średniej z 7 dni ze średnią sprzed 3 tygodni.', `${a.n} ważeń teraz i ${b.n} ważeń 3 tygodnie wcześniej`, link(7, 'Tempo zmian', ''));
      } else if (off === 0 && a.n >= 2 && b.n >= 2 && Math.abs(a.avg - b.avg) < 0.2) {
        add('waga_stoi', k, 'Waga stoi', 'Średnia prawie bez zmian od 3 tygodni. To częste i nie przekreśla postępu: sprawdź też obwód talii.', `${a.n} ważeń teraz i ${b.n} ważeń 3 tygodnie wcześniej`);
      }
      const s1 = avg(S, k, 0, 6, steps), s0 = avg(S, k, 7, 13, steps);
      if (!sDone && s1.n >= 4 && s0.n >= 4 && Math.abs(s1.avg - s0.avg) >= 1000) {
        sDone = true;
        add('kroki_zmiana', k, `Kroki ${s1.avg > s0.avg ? 'wzrosły' : 'spadły'}`, `Średnio ${fmtInt(s1.avg)} kroków dziennie, tydzień wcześniej ${fmtInt(s0.avg)}.`, `${s1.n} i ${s0.n} dni z krokami`, link(12, 'Zdrowie ogólnie', ''));
      }
    }

    // Krok tygodnia zaliczony (stan z app.js) i tygodnie aktywnego celu
    if ((ctx || {}).krokDone) add('krok_zaliczony', today, 'Krok tygodnia zaliczony', 'Masz za sobą kolejny krok. Na tym budujemy dalej.', `krok ${num((S.krok || {}).step) + 1}, postęp z Twoich zapisów`);
    const cel = S.cel && goalOf(S.cel.id);
    if (cel && S.cel.since) {
      for (let w = 1; w <= 4; w++) {
        const end = back(S.cel.since, -(7 * w - 1));
        if (end > today || end < back(today, 27)) continue;
        const p = progress(S, cel.id, end, ctx);
        add('cel_tydzien', end, `Tydzień celu: ${cel.t}`, `Wynik tygodnia: ${p.txt}.`, `${p.n} ${plural(p.n, 'wpis', 'wpisy', 'wpisów')} w tygodniu`);
      }
    }

    return out.sort((a, b) => (a.k < b.k ? 1 : a.k > b.k ? -1 : 0));
  }

  return { goals, goalOf, events, suggest, done, progress, impact, signals, stepGoal };
})();
