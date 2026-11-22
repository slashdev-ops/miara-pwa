// Zwierzak (Tamagotchi): stan liczony z danych aplikacji, bez zapisu. Dane wyłącznie przez ctx z app.js (petCtx),
// żeby moduł dało się testować bez DOM i bez globali aplikacji. Nastrój nie zależy od wagi ani kalorii.
var PET = (function () {
  const LINES = {
    celebrate: '{n} świętuje! Nowa odznaka.', sleep: '{n} śpi. Dobranoc.', sad: '{n} tęskni. Zapisz cokolwiek, a odżyje.',
    hungry: '{n} czeka na wpis posiłku.', rest: '{n} odpoczywa razem z Tobą. Dziś liczy się odpoczynek.', tired: '{n} jest {tired}. Sen albo spacer doda {jej} energii.',
    happy: '{n} jest w świetnej formie.', ok: '{n} ma się dobrze.', goal: '{n} świętuje zaliczony tydzień celu!'
  };
  // Linia nastroju z imieniem i formą rodzajową gatunku ({tired}, {jej})
  const say = (t, name, kind) => t.replace('{n}', name).replace(/\{(tired|jej)\}/g, (_, k) => form(kind, k));
  const ACC = { 'Brąz': 'szalik', 'Srebro': 'czapka', 'Złoto': 'okulary', 'Platyna': 'korona' };
  const clamp = (v) => Math.max(10, Math.min(100, Math.round(v)));

  function dayKey(c, n) { const d = c.now; return c.key(new Date(d.getFullYear(), d.getMonth(), d.getDate() - n, 12)); }
  // Dzień pusty: bez posiłków, treningów, pomiarów, nawyków i ochot
  function isEmpty(c, k) {
    if (c.pain && c.pain(k)) return false; // dzień z bólem głowy nie jest przerwą
    if (c.entries(k).length || c.dayPts(k) > 0 || c.urges(k).length) return false;
    if (Object.values(c.meas(k) || {}).some((v) => c.num(v) > 0)) return false;
    return !Object.values(c.habs(k) || {}).some(Boolean);
  }
  // Puste pełne dni tuż przed dziś, najwyżej 3; dni sprzed startu zwierzaka się nie liczą
  function gap(c) {
    const since = c.pet && c.pet.since;
    let n = 0;
    while (n < 3) { const k = dayKey(c, n + 1); if ((since && k < since) || !isEmpty(c, k)) break; n++; }
    return n;
  }
  // Klucze dni od startu zwierzaka do dziś (najstarszy ostatni)
  function sinceKeys(c) {
    const out = [], since = c.pet && c.pet.since;
    for (let i = 0; i < 3650; i++) { const k = dayKey(c, i); if (since && k < since) break; out.push(k); if (!since) break; }
    return out;
  }

  function milestones(c) {
    const ks = sinceKeys(c), out = [];
    if (ks.filter((k) => !isEmpty(c, k)).length >= 7) out.push('week1');
    const s = c.streak();
    [7, 14, 30].forEach((n) => { if (s >= n) out.push('streak' + n); });
    const a = c.avgW(0, 7), w0 = c.startW;
    if (a != null && w0 > 0 && (w0 - a) / w0 >= 0.02) out.push('w2');
    const g = c.stage();
    if (g && g.pct >= 100) out.push('w5');
    if (c.reviewed) out.push('review1');
    if (c.goalDone) out.push('cel1');
    const lv = c.level(c.weekPts())[1];
    if (ACC[lv]) out.push('level-' + lv);
    return out;
  }

  function state(c) {
    const k = c.key(c.now), h = c.now.getHours(), przerwa = gap(c), ents = c.entries(k), m = c.meas(k) || {};
    const meals = ents.filter((e) => e.kind === 'm').length, train = ents.some((e) => e.kind === 't');
    const sleep = c.num(m.sleep), steps = c.num(m.steps);
    const lite = !!c.lite, lf = lite && !!c.liteFull(k); // prosty widok: karta „Szybki wpis dnia” zastępuje posiłki i kroki
    let food = (c.once ? h < 19 : h < 9) && meals === 0 ? 50 : [0, 40, 70, 100][Math.min(meals, 3)];
    let energy = Math.min(sleep / 7, 1) * 60 + (train || steps >= 6000 ? 40 : steps >= 3000 ? 20 : 0);
    if (lf) { food = Math.max(food, 70); energy = Math.max(energy, 70); }
    const mood = Math.min(c.dayPts(k) / 50, 1) * 80 + (c.streak() >= 3 ? 20 : 0);
    const pen = 35 * przerwa;
    const meters = { food: clamp(food - pen), energy: clamp(energy - pen), mood: clamp(mood - pen) };
    if (lite && !lf) Object.keys(meters).forEach((x) => { meters[x] = Math.max(meters[x], 60); }); // prosty widok przed pierwszym szybkim wpisem dnia: wskaźniki neutralne, nie niskie
    const milestone = milestones(c).find((id) => !(c.seen || []).includes(id)) || null;
    const active = Math.max(sinceKeys(c).filter((x) => c.dayPts(x) >= 30).length, (c.pet && c.pet.peak) || 0);
    const stage = active >= 30 ? 'adult' : active >= 7 ? 'young' : active >= 1 ? 'chick' : 'egg';
    let md = 'ok';
    const rest = !!(c.pain && c.pain(k));
    if (milestone || c.celeb) md = 'celebrate';
    else if (rest) md = 'sleep';
    else if (h >= 22 || h < 6) md = 'sleep';
    else if (przerwa >= 2 && isEmpty(c, k)) md = 'sad';
    else if (!lite && h >= (c.once ? 19 : 12) && meals === 0) md = 'hungry';
    else if (!lite && meters.energy < 40) md = 'tired';
    else if (meters.food >= 70 && meters.energy >= 70 && meters.mood >= 70) md = 'happy';
    const name = nameOf(c.pet);
    // Tryb pokazowy: klatka narzuca minę, etap i dodatek; bez kamienia milowego (nic nie trafia do petSeen)
    if (c.force) return { meters, przerwa, mood: c.force.mood, stage: c.force.stage, acc: c.force.acc || null, active, milestone: null, line: say(LINES[c.force.mood], name, c.force.kind || (c.pet && c.pet.kind)) };
    return { meters, przerwa, mood: md, stage, acc: ACC[c.level(c.weekPts())[1]] || null, active, milestone, line: say(lite && !lf && md === 'ok' ? '{n} czeka na szybki wpis.' : LINES[milestone === 'cel1' ? 'goal' : rest && md === 'sleep' ? 'rest' : md], name, c.pet && c.pet.kind) };
  }

  // ---------- Rysunek: SVG 120×120; postacie (gąska, kaczuszka, kapibara, kotek) w siatce 100×100, kolory z tokenów --zw-* (app.css) ----------
  const SCALE = { chick: 0.7, young: 0.85, adult: 1 };
  const KINDS = ['gaska', 'kaczka', 'kapibara', 'kotek'];
  const KIND_PL = { gaska: 'Gąska', kaczka: 'Kaczuszka', kapibara: 'Kapibara', kotek: 'Kotek' };
  const MOOD_PL = { celebrate: 'świętuje', sleep: 'śpi', sad: 'tęskni', hungry: 'czeka na wpis', tired: 'zmęczona', happy: 'szczęśliwa', ok: 'zadowolona', alert: 'uwaga' };
  // Formy rodzajowe: kotek w rodzaju męskim, pozostałe w żeńskim; voc to wołacz w powitaniu
  const MASC = { tired: 'zmęczony', happy: 'szczęśliwy', ok: 'zadowolony', young: 'Młody', adult: 'Dorosły', jej: 'mu' };
  const FEM = { young: 'Młoda', adult: 'Dorosła', jej: 'jej' };
  const VOC = { gaska: 'gąsko', kaczka: 'kaczuszko', kapibara: 'kapibaro', kotek: 'kotku' };
  const kindOf = (k) => (KINDS.includes(k) ? k : 'gaska'); // rodzaj może pochodzić z importowanej kopii: tylko znane wartości
  function form(kindIn, key) {
    const k = kindOf(kindIn);
    if (key === 'voc') return VOC[k];
    if (k === 'kotek' && MASC[key]) return MASC[key];
    return FEM[key] || MOOD_PL[key] || '';
  }
  // Nastrój aplikacji na wyraz postaci (sad: spokój z opuszczonymi powiekami, tired: drzemka bez „z z”)
  const EXPR = { ok: 'spokoj', happy: 'radosc', celebrate: 'seria', sleep: 'drzemka', sad: 'smutek', tired: 'drzemka', hungry: 'ciekawosc', alert: 'ciekawosc' };
  const COL = { gaska: 'goose', kaczka: 'duck', kapibara: 'capy', kotek: 'cat' };
  const v = (n) => `var(--zw-${n})`;
  let gid = 0; // unikalne id gradientu w każdym rysunku (ukryta kopia nie zabiera gradientu widocznej)

  // Oczy w siatce 100: łuki przy radości, zamknięte przy drzemce, opuszczone powieki przy tęsknocie
  function zEyes(k, m, lx, rx, y, r) {
    const out = [lx, rx].map((x) => {
      if (m === 'radosc' || m === 'seria') return `<path class="zw-arc" d="M${x - r} ${y + 1}Q${x} ${y - r * 1.5} ${x + r} ${y + 1}" fill="none" stroke="${v('eye')}" stroke-width="2.6" stroke-linecap="round"/>`;
      if (m === 'drzemka') return `<path class="zw-shut" d="M${x - r} ${y}Q${x} ${y + r} ${x + r} ${y}" fill="none" stroke="${v('eye')}" stroke-width="2.4" stroke-linecap="round"/>`;
      if (m === 'smutek') return `<ellipse cx="${x}" cy="${y + r * 0.25}" rx="${r}" ry="${r * 0.85}" fill="${v('eye')}"/><path class="zw-lid" d="M${x - r * 1.15} ${y - r * 0.3}Q${x} ${y - r * 0.55} ${x + r * 1.15} ${y - r * 0.3}" fill="none" stroke="${v(COL[k] + '-ln')}" stroke-width="2.2" stroke-linecap="round"/>`;
      const big = m === 'ciekawosc' ? 1.12 : 1;
      return `<ellipse cx="${x}" cy="${y}" rx="${r * big}" ry="${r * 1.18 * big}" fill="${v('eye')}"/>`
        + `<circle cx="${x - r * 0.35}" cy="${y - r * 0.45}" r="${r * 0.42}" fill="${v('hi')}"/><circle cx="${x + r * 0.38}" cy="${y + r * 0.4}" r="${r * 0.18}" fill="${v('hi')}"/>`;
    }).join('');
    const open = m !== 'radosc' && m !== 'seria' && m !== 'drzemka';
    return (open ? `<g class="eyes">${out}</g>` : out)
      + (m === 'ciekawosc' ? `<path d="M${rx - 5} ${y - r - 5}q5 -4 10 -1" fill="none" stroke="${v(COL[k] + '-ln')}" stroke-width="2" stroke-linecap="round"/>` : '');
  }
  const blush = (lx, rx, y) => `<ellipse cx="${lx}" cy="${y}" rx="4.6" ry="2.6" fill="${v('blush')}" opacity=".6"/><ellipse cx="${rx}" cy="${y}" rx="4.6" ry="2.6" fill="${v('blush')}" opacity=".6"/>`;
  function mouth(m, x, y) {
    if (m === 'radosc') return `<path d="M${x - 4.5} ${y}q4.5 7 9 0z" fill="${v('mouth')}" stroke="${v('mouth')}" stroke-width="1.2" stroke-linejoin="round"/>`;
    if (m === 'drzemka' || m === 'ciekawosc') return `<ellipse cx="${x}" cy="${y + 1.5}" rx="1.8" ry="2" fill="${v('mouth')}"/>`;
    return `<path d="M${x - 3.5} ${y}q3.5 3 7 0" fill="none" stroke="${v('mouth')}" stroke-width="1.8" stroke-linecap="round"/>`;
  }
  const beak = (d) => `<path class="zw-beak" d="${d}" fill="${v('beak')}" stroke="${v('beak-ln')}" stroke-width="1.6" stroke-linejoin="round"/>`;
  const feet = (y) => `<ellipse cx="42" cy="${y}" rx="6.5" ry="3" fill="${v('beak')}" stroke="${v('beak-ln')}" stroke-width="1.4"/><ellipse cx="58" cy="${y}" rx="6.5" ry="3" fill="${v('beak')}" stroke="${v('beak-ln')}" stroke-width="1.4"/>`;
  const wings = (k, y) => { const f = ` fill="${v(COL[k] + '-sh')}" stroke="${v(COL[k] + '-ln')}" stroke-width="1.6" stroke-linejoin="round"`; return `<path d="M30 ${y}q-8 6 -2 14q6 -2 6 -11z"${f}/><path d="M70 ${y}q8 6 2 14q-6 -2 -6 -11z"${f}/>`; };
  const open = (m) => m === 'radosc';

  // Głowa każdej postaci (do dodatków): środek, góra głowy, oczy, szyja
  const HEAD = {
    gaska: { cx: 50, top: 16, ey: 34, lx: 41, rx: 59, r: 4, ny: 54, nw: 20 },
    kaczka: { cx: 50, top: 20, ey: 44, lx: 39, rx: 61, r: 4.4, ny: 69, nw: 38 },
    kapibara: { cx: 50, top: 15, ey: 33, lx: 36, rx: 64, r: 3.6, ny: 74, nw: 48 },
    kotek: { cx: 50, top: 22, ey: 45, lx: 39, rx: 61, r: 4.4, ny: 66, nw: 40 }
  };
  // Ciało (pod głową) i głowa w siatce 100×100; fill(k) to gradient z odblaskiem i kontur w ciemniejszym odcieniu
  const PARTS = {
    gaska: (m, fill) => [feet(91) + `<path d="M42 64Q40 52 44 44L56 44Q60 52 58 64Z"${fill}/><ellipse cx="50" cy="76" rx="23" ry="15"${fill}/>` + wings('gaska', 69),
      `<path d="M45 16q-5 -8 0 -10q2 5 0 10M50 15q0 -10 5 -11q1 7 -5 11M55 16q5 -6 8 -5q-2 6 -8 5"${fill} stroke-linejoin="round"/>`
      + `<ellipse cx="50" cy="36" rx="21" ry="20"${fill}/>` + zEyes('gaska', m, 41, 59, 34, 4) + blush(35, 65, 43)
      + beak(open(m) ? 'M42 41Q50 37 58 41Q50 45 42 41ZM44 44Q50 54 56 44Q50 47 44 44Z' : 'M42 41Q50 37 58 41Q53 51 50 52Q47 51 42 41Z')],
    kaczka: (m, fill) => [feet(90) + `<ellipse cx="50" cy="77" rx="21" ry="14"${fill}/>` + wings('kaczka', 70),
      `<path d="M49 22q-3 -10 7 -10q-6 3 -3 10" fill="var(--duck)" stroke="${v('duck-ln')}" stroke-width="2" stroke-linejoin="round"/>`
      + `<circle cx="50" cy="46" r="26"${fill}/>` + zEyes('kaczka', m, 39, 61, 44, 4.4) + blush(31, 69, 53)
      + beak(open(m) ? 'M40 52Q50 46 60 52Q50 55 40 52ZM43 55Q50 62 57 55Q50 57 43 55Z' : 'M40 52Q50 46 60 52Q60 58 50 58Q40 58 40 52Z')],
    // Kapibara (rada 20.11): dłuższy pyszczek i małe uszka wysoko
    kapibara: (m, fill) => {
      const ln = v('capy-ln');
      return [`<rect x="34" y="84" width="10" height="8" rx="4" fill="${v('capy-sh')}" stroke="${ln}" stroke-width="1.4"/><rect x="56" y="84" width="10" height="8" rx="4" fill="${v('capy-sh')}" stroke="${ln}" stroke-width="1.4"/>`
        + `<ellipse cx="50" cy="78" rx="27" ry="13"${fill}/>`,
      `<ellipse cx="33" cy="16" rx="3.6" ry="3.2" fill="${v('capy-sh')}" stroke="${ln}" stroke-width="1.8"/><ellipse cx="67" cy="16" rx="3.6" ry="3.2" fill="${v('capy-sh')}" stroke="${ln}" stroke-width="1.8"/>`
        + `<rect x="21" y="15" width="58" height="61" rx="22"${fill}/>` + zEyes('kapibara', m, 36, 64, 33, 3.6) + blush(28, 72, 44)
        + `<rect x="29" y="41" width="42" height="33" rx="15" fill="${v('capy-mz')}"/><path d="M42 49q2 -2.4 4 0M54 49q2 -2.4 4 0M50 53v6" fill="none" stroke="${ln}" stroke-width="2" stroke-linecap="round"/>`
        + mouth(m, 50, 64)];
    },
    kotek: (m, fill) => {
      const ln = v('cat-ln'), ear = m === 'ciekawosc' ? 'M53 25L70 11L72 36Z' : 'M53 25L69 14L72 36Z';
      return [`<path d="M68 84q17 -1 14 -18q-1 -6 -7 -6" fill="none" stroke="${ln}" stroke-width="9" stroke-linecap="round"/><path d="M68 84q17 -1 14 -18q-1 -6 -7 -6" fill="none" stroke="${v('cat')}" stroke-width="5.5" stroke-linecap="round"/>`
        + `<ellipse cx="50" cy="77" rx="19" ry="14"${fill}/><ellipse cx="43" cy="89" rx="5.5" ry="3.5"${fill}/><ellipse cx="57" cy="89" rx="5.5" ry="3.5"${fill}/>`,
      `<path d="M28 36L31 14L47 25Z${ear}"${fill} stroke-linejoin="round"/><path d="M32 31L33 20L42 26ZM68 31L67 20L58 26Z" fill="${v('pink')}"/>`
        + `<ellipse cx="50" cy="45" rx="27" ry="23"${fill}/>`
        + `<path d="M50 23v6M44 24l1.2 5M56 24l-1.2 5" stroke="${v('cat-sh')}" stroke-width="2.4" stroke-linecap="round"/>`
        + zEyes('kotek', m, 39, 61, 45, 4.4) + blush(32, 68, 53)
        + `<path d="M47.5 51.5h5l-2.5 2.8z" fill="${v('nose')}" stroke="${v('nose')}" stroke-width="1" stroke-linejoin="round"/>`
        + (m === 'spokoj' || m === 'seria' || m === 'smutek' ? `<path d="M45.5 56q2.2 2.4 4.5 0q2.3 2.4 4.5 0" fill="none" stroke="${ln}" stroke-width="1.6" stroke-linecap="round"/>` : mouth(m, 50, 56))
        + `<path d="M26 51l-9 -1.5M26 55l-9 2M74 51l9 -1.5M74 55l9 2" stroke="${ln}" stroke-width="1.2" stroke-linecap="round"/>`];
    }
  };
  // Dodatki za poziomy na głowie każdej postaci (siatka 100)
  function acc(a, H) {
    const { cx, top, ey, lx, rx, r, ny, nw } = H;
    if (a === 'szalik') return `<path class="acc szalik" d="M${cx - nw / 2} ${ny}q${nw / 2} 6 ${nw} 0v6q-${nw / 2} 6 -${nw} 0z"/><path class="acc szalik" d="M${cx + nw / 4} ${ny + 6}l2 13h6l-1 -15z"/>`;
    if (a === 'czapka') return `<path class="acc czapka" d="M${cx - 11} ${top + 5}L${cx} ${top - 14}L${cx + 11} ${top + 5}Z"/><circle class="acc czapka" cx="${cx}" cy="${top - 16}" r="3"/>`;
    if (a === 'okulary') { const R = r + 2.6; return `<g class="acc okulary"><circle cx="${lx}" cy="${ey}" r="${R}"/><circle cx="${rx}" cy="${ey}" r="${R}"/><path d="M${lx + R} ${ey}H${rx - R}"/></g>`; }
    if (a === 'korona') return `<path class="acc korona" d="M${cx - 12} ${top + 3}l-1 -12l7 6l6 -9l6 9l7 -6l-1 12z"/>`;
    return '';
  }
  const HEART = 'M0 3.5C-7 -1.5 -4 -8 0 -4.2C4 -8 7 -1.5 0 3.5Z';
  function fx(mood, m) {
    if (m === 'seria') return [[18, 30], [82, 24], [70, 8]].map((p, i) => `<g transform="translate(${p[0]} ${p[1]})"><path class="zw-heart zw-f${i + 1}" d="${HEART}" fill="${v('heart')}"/></g>`).join('');
    if (mood === 'sleep') return '<text class="zz" x="72" y="24">z</text><text class="zz z2" x="81" y="13">z</text>';
    return '';
  }
  function figure(k, mood, a) {
    const m = EXPR[mood] || 'spokoj', c = COL[k], id = 'zw' + (++gid), fill = ` fill="url(#${id})" stroke="${v(c + '-ln')}" stroke-width="2"`;
    const defs = `<defs><radialGradient id="${id}" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="${v(c + '-hi')}"/><stop offset=".55" stop-color="${k === 'kaczka' ? 'var(--duck)' : v(c)}"/><stop offset="1" stop-color="${v(c + '-sh')}"/></radialGradient></defs>`;
    const p = PARTS[k](m, fill);
    return [defs, `<g transform="translate(10 10)">${p[0]}<g class="zw-head"${m === 'ciekawosc' ? ' transform="rotate(-12 50 62)"' : ''}>${p[1]}${acc(a, HEAD[k])}</g>${fx(mood, m)}</g>`];
  }

  // Jajo: oczy jak dotąd (śpi: kreska i „z z”)
  function eggEyes(mood) {
    if (mood === 'sleep') return '<path class="lid" d="M56 72h8"/><text class="zz" x="70" y="60">z</text><text class="zz z2" x="77" y="52">z</text>';
    return '<circle class="eye" cx="53" cy="72" r="2.4"/><circle class="eye" cx="67" cy="72" r="2.4"/>';
  }
  // Pęknięcia jajka: liczba (0-4) z Pierwszych kroków; bez liczby jedno pęknięcie jak dotąd
  const CRACKS = ['M42 50l7 5l6 -7l6 7l6 -5l8 5', 'M34 74l8 -4l5 6l7 -5', 'M62 88l6 -6l6 5l8 -4', 'M58 36l4 7l-5 5l6 6'];
  function svg(kindIn, stage, mood, a, big, crack) {
    const kind = kindOf(kindIn);
    const cls = `pet pet-${mood} pet-${stage} pet-${kind}${big ? ' big' : ''}`, label = `${KIND_PL[kind]}: ${form(kind, mood)}${stage === 'egg' && crack != null ? `, jajko, pęknięcia ${crack} z 4` : ''}`;
    let fig, defs = '';
    if (stage === 'egg') {
      fig = `<ellipse class="egg" cx="60" cy="70" rx="28" ry="36"/>` + CRACKS.slice(0, crack == null ? 1 : crack).map((d) => `<path class="crack" d="${d}"/>`).join('') + eggEyes(mood);
    } else {
      [defs, fig] = figure(kind, mood, a);
      const s = SCALE[stage] || 1;
      if (s !== 1) fig = `<g transform="translate(${60 * (1 - s)} ${104 * (1 - s)}) scale(${s})">${fig}</g>`;
    }
    const bubble = mood === 'hungry' ? '<g class="bubble" transform="translate(-7 -7)"><circle cx="24" cy="26" r="14"/><circle cx="30" cy="44" r="2.5"/><g class="note"><rect x="16" y="16" width="14" height="19" rx="2"/><path d="M19 22h8M19 26h8M19 30h4M27 34l6-10"/></g></g>' : '';
    const conf = mood === 'celebrate' ? [...Array(12)].map((_, i) => `<rect class="conf c${i % 4}" x="${8 + i * 9}" y="${4 + (i * 7) % 20}" width="5" height="8" style="animation-delay:${(i % 6) * 0.15}s"/>`).join('') : '';
    return `<svg class="${cls}" viewBox="0 0 120 120" role="img" aria-label="${label}">${defs}<ellipse class="shadow" cx="60" cy="105" rx="28" ry="4"/><g class="figure">${fig}</g>${bubble}${conf}</svg>`;
  }

  // ---------- Karta, ekran, odznaki ----------
  const BADGES = [['week1', 'Pierwszy tydzień'], ['streak7', 'Seria 7 dni'], ['streak14', 'Seria 14 dni'], ['streak30', 'Seria 30 dni'],
    ['w2', '-2% wagi'], ['w5', '-5% wagi'], ['review1', 'Pierwszy przegląd'], ['cel1', 'Pierwszy zaliczony cel'],
    ['level-Brąz', 'Tydzień na poziomie Brąz'], ['level-Srebro', 'Tydzień na poziomie Srebro'], ['level-Złoto', 'Tydzień na poziomie Złoto'], ['level-Platyna', 'Tydzień na poziomie Platyna']];
  // Etapy w formie rodzajowej gatunku (kotek: Młody, Dorosły)
  const stagePl = (kind, g) => ({ egg: 'Jajo', chick: 'Pisklę' })[g] || form(kind, g);
  const NEXT_STAGE = { egg: [1, 'chick'], chick: [7, 'young'], young: [30, 'adult'] };
  const ACC_PL = { szalik: 'szalik za Brąz', czapka: 'czapka za Srebro', okulary: 'okulary za Złoto', korona: 'korona za Platynę' };
  const pl1 = (x) => (Math.round(x * 10) / 10).toLocaleString('pl-PL');
  const sign = (x) => (x > 0 ? '+' : x < 0 ? '-' : '') + pl1(Math.abs(x));
  function activeDaysPl(n) {
    if (n === 1) return '1 aktywny dzień';
    const few = n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14);
    return `${n} ${few ? 'aktywne dni' : 'aktywnych dni'}`;
  }

  // Zapowiedź „Co się zmieni”: cel (stan i co pokazały badania), etap zwierzaka, najbliższa odznaka; bez obietnic zdrowotnych
  const ACC_BIE = { szalik: 'szalik', czapka: 'czapkę', okulary: 'okulary', korona: 'koronę' };
  const daysPl = (n) => (n === 1 ? '1 dzień' : `${n} dni`);
  function next(st, c) {
    const out = [], name = nameOf(c.pet), g = c.goal;
    if (g) out.push({ t: `Cel „${g.t}”: ${g.left}.` + (g.nx ? ` Następny cel: ${g.nx}.` : '') + (g.gain ? ` W badaniach: ${g.gain}` : '') });
    const nx = NEXT_STAGE[st.stage];
    if (nx && nx[0] > st.active) {
      const n = nx[0] - st.active;
      out.push({ t: st.stage === 'egg' ? `Jeszcze ${activeDaysPl(n)} (co najmniej 30 pkt) i z jajka wykluje się pisklę.` : `Jeszcze ${activeDaysPl(n)} (co najmniej 30 pkt) i ${name} będzie ${stagePl(c.pet && c.pet.kind, nx[1])}, z nowym wyglądem.` });
    }
    const s = c.streak(), lim = [7, 14, 30].find((x) => s < x);
    if (lim) out.push({ t: `Jeszcze ${daysPl(lim - s)} z wpisem z rzędu do odznaki „Seria ${lim} dni”.` });
    const lv = c.nextLevel;
    if (lv && ACC[lv.name]) out.push({ t: `Jeszcze ${lv.need} pkt w tym tygodniu do poziomu ${lv.name}: ${name} dostanie ${ACC_BIE[ACC[lv.name]]}.` });
    return out.slice(0, 3);
  }
  function badgeList(got) { return BADGES.map(([id, label]) => ({ id, label, got: got.includes(id) })); }
  function bars(m) {
    return '<span class="petbars">' + [['Posiłki', m.food], ['Energia', m.energy], ['Humor', m.mood]].map(([l, v]) =>
      `<span class="petbarrow"><span class="petlab">${l}</span><span class="petbar${v < 40 ? ' low' : ''}" role="meter" aria-label="${l} ${v} ze 100" aria-valuenow="${v}" aria-valuemin="0" aria-valuemax="100"><i style="width:${v}%"></i></span></span>`).join('') + '</span>';
  }
  // Imię: nadane przez osobę, inaczej przykładowe dla gatunku (21.11.2026); nieznany gatunek jak gąska
  const NAMES = { gaska: 'Pianka', kaczka: 'Kluska', kapibara: 'Kapi', kotek: 'Mruczek' };
  function nameOf(pet) { return (pet && String(pet.name || '').trim()) || NAMES[pet && pet.kind] || NAMES.gaska; }

  function card(st, pet, esc) {
    return `<button class="petcard" data-tab="pet" aria-label="Mój zwierzak: ${esc(nameOf(pet))}. ${esc(st.line)}">${svg(pet.kind, st.stage, st.mood, st.acc, false, st.crack)}`
      + `<span class="petinfo"><b>${esc(nameOf(pet))}</b><span class="small">${esc(st.line)}</span>${st.next && st.next.length ? `<span class="small petnext">${esc(st.next[0].t)}</span>` : ''}${st.stage === 'egg' ? `<span class="small muted">${st.crack != null && st.crack < 4 ? `${st.lite ? 'Dni z szybkim wpisem:' : 'Pierwsze kroki: pęknięcia'} ${st.crack} z 4. ` : ''}${st.lite ? 'Jajo wykluje się po pierwszym szybkim wpisie.' : 'Jajo wykluje się po dniu z co najmniej 30 punktami.'}</span>` : ''}${bars(st.meters)}</span></button>`;
  }
  function screen(st, pet, sum, esc) {
    const nx = NEXT_STAGE[st.stage], row = (a, b) => `<div class="entry"><span class="txt">${a}</span><span class="val">${b}</span></div>`;
    let h = `<div class="petstage">${svg(pet.kind, st.stage, st.mood, st.acc, true, st.crack)}<h2>${esc(nameOf(pet))}</h2><p>${esc(st.line)}</p>`
      + `<p class="small muted">${stagePl(pet.kind, st.stage)}${st.acc ? ', ' + ACC_PL[st.acc] : ''}${nx && nx[0] > st.active ? `. Do etapu ${stagePl(pet.kind, nx[1])}: ${activeDaysPl(Math.max(0, nx[0] - st.active))} (co najmniej 30 pkt)` : ''}.</p></div>`;
    h += `<div class="panel" style="padding:8px 16px">${bars(st.meters)}</div>`;
    const w = sum.week, a = sum.all;
    h += '<h2>Dziś</h2><div class="panel">' + row('Podstawy dnia', `${sum.today.done} z 3`) + row('Punkty', `${sum.today.pts} pkt`) + '</div>';
    h += '<h2>Ten tydzień</h2><div class="panel">' + row('Punkty i poziom', `${w.pts} pkt, ${esc(w.level)}`)
      + (w.next ? `<div class="entry"><span class="txt small muted">do poziomu ${esc(w.next.name)} brakuje ${w.next.need} pkt</span></div>` : '') + '</div>';
    h += '<h2>Od startu</h2><div class="panel">' + row('Aktywne dni', a.active) + row('Seria', `${a.streak} dni`)
      + (a.dw != null ? row('Średnia waga (7 dni) względem startu', `${sign(a.dw)} kg`) : '')
      + (a.waist != null ? row('Talia (średnia 4 tygodni)', `${sign(a.waist)} cm`) : '')
      + (a.pct != null ? row('Etap -5%', `${Math.round(a.pct)}%`) : '') + '</div>';
    if (st.next && st.next.length) h += '<h2>Co się zmieni</h2><ul class="zd panel">' + st.next.map((x) => `<li>${esc(x.t)}</li>`).join('') + '</ul>';
    h += '<h2>Odznaki</h2><div class="badges">' + sum.badges.map((b) => `<span class="badge${b.got ? ' got' : ''}">${b.label}</span>`).join('') + '</div>';
    return h + (sum.body || '') + '<p><button class="btn ghost" data-tab="day" style="width:100%">Wróć</button></p>';
  }

  // ---------- Sylwetka (opcjonalna): kontur ze średnich obwodów z pierwszych i ostatnich 28 dni ----------
  const DAY = 864e5, OBW = ['waist', 'hip', 'thigh'];
  function body(meas, now, num) {
    const ks = Object.keys(meas || {}).filter((k) => OBW.some((f) => num((meas[k] || {})[f]) > 0)).sort();
    const t = (k) => Date.parse(k + 'T12:00:00');
    if (ks.length < 2 || t(ks[ks.length - 1]) - t(ks[0]) < 14 * DAY) return { ok: false, msg: 'Za mało pomiarów' };
    const avg = (keys, f) => { const v = keys.map((k) => num(meas[k][f])).filter((x) => x > 0); return v.length ? v.reduce((a, x) => a + x, 0) / v.length : null; };
    const first = ks.filter((k) => t(k) <= t(ks[0]) + 27 * DAY), last = ks.filter((k) => t(k) >= t(ks[ks.length - 1]) - 27 * DAY);
    const s = {}, n = {};
    OBW.forEach((f) => { s[f] = avg(first, f); n[f] = avg(last, f); if (s[f] == null) s[f] = n[f]; if (n[f] == null) n[f] = s[f]; });
    const def = { waist: 80, hip: 100, thigh: 56 };
    OBW.forEach((f) => { if (s[f] == null) { s[f] = def[f]; n[f] = def[f]; } });
    // Wspólna skala dla obu konturów: najszerszy obwód bioder lub talii = 68 px szerokości
    const k = 34 / Math.max(s.waist, s.hip, n.waist, n.hip);
    const outline = (o) => {
      const w = o.waist * k, h = o.hip * k, th = Math.min(h, o.thigh * k * 1.25);
      const L = [[60 - 25, 34], [60 - Math.max(w, 20) * 0.95, 52], [60 - w, 70], [60 - h, 88], [60 - th, 108], [60 - th * 0.55, 140], [57, 140], [60, 112]];
      const R = L.slice(0, 7).reverse().map(([x, y]) => [120 - x, y]);
      return 'M' + L.concat(R).map(([x, y]) => `${x.toFixed(1)} ${y}`).join('L') + 'Z';
    };
    const svgB = `<svg class="petbody-svg" viewBox="0 0 120 150" role="img" aria-label="Sylwetka: kontur ze startu i obecny">`
      + `<circle class="body-head" cx="60" cy="18" r="10"/><path class="body-start" d="${outline(s)}"/><path class="body-now" d="${outline(n)}"/>`
      + '</svg>';
    return { ok: true, svg: svgB };
  }

  // ---------- Reakcje: akcja kolejkuje, render() odtwarza na widocznej postaci (najpóźniej po 10 min) ----------
  let pending = null;
  function react(type, pts) { pending = { type, pts, t: Date.now() }; }
  // Napisy reakcji: każdy z własnym id, usuwany dokładnie ten wstawiony (szybkie kolejne reakcje się nie mieszają)
  const TAG = { note: 'Zanotowane', rest: 'Odpocznij dziś', series: '♥ ♥ ♥' }, SAY = { series: 'Serduszka: pomiar w zalecanym terminie', urge: 'Zapisane' };
  // Napis stały (tag, still) wraca po przerysowaniu widoku, dopóki nie minie jego czas (bez ponownego wejścia)
  let fxN = 0, FX = null;
  // Czytnik ekranu: tekst przez istniejący region na żywo #sr (wstawiony razem z treścią role=status bywa pomijany); napis na karcie ukryty dla czytnika
  function fxAdd(host, html, cls, ms, keep, say) {
    const id = 'petfx' + (++fxN), sr = document.getElementById('sr');
    host.insertAdjacentHTML('beforeend', `<span class="petfx${cls}" id="${id}" aria-hidden="true">${html}</span>`);
    if (sr && say) sr.textContent = say;
    FX = keep ? { id, html, cls, until: Date.now() + ms } : null;
    setTimeout(() => { const f = document.getElementById(id); if (f && f.remove) f.remove(); if (FX && FX.id === id) FX = null; }, ms);
  }
  function reshow(now) {
    if (!FX || (now ? now.getTime() : Date.now()) >= FX.until || document.getElementById(FX.id)) return;
    const el = document.querySelector('#main .pet'), host = el && el.closest('.petcard, .petstage');
    if (host) host.insertAdjacentHTML('beforeend', `<span class="petfx${FX.cls} again" id="${FX.id}" aria-hidden="true">${FX.html}</span>`);
  }
  function flush(now) {
    if (!pending) { reshow(now); return false; }
    if ((now ? now.getTime() : Date.now()) - pending.t > 10 * 60000) { pending = null; return false; }
    const el = document.querySelector('#main .pet');
    if (!el) return false;
    const { type, pts } = pending, cls = 'react-' + type, host = el.closest('.petcard, .petstage');
    pending = null;
    // Ograniczenie ruchu: krótki napis bez animacji zamiast ruchu postaci
    const still = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!still) { el.classList.add(cls); setTimeout(() => el.classList.remove(cls), type === 'rest' ? 2400 : 1600); }
    if (!host) return true;
    // Reakcje Zdrowia (note, rest, series): napis bez punktów; nie zmieniają punktów, serii ani nastroju
    if (TAG[type]) fxAdd(host, TAG[type], ' tag' + (still ? ' still' : '') + (type === 'series' ? ' hearts' : ''), 4000, true, SAY[type] || TAG[type]);
    else if (type === 'habit' || type === 'urge') fxAdd(host, still ? (type === 'urge' ? 'Zapisane' : '+' + (pts || 0) + ' pkt') : (type === 'urge' ? '♥' : '+' + (pts || 0)), still ? ' still' : '', still ? 2500 : 1500, still, type === 'urge' ? SAY.urge : '+' + (pts || 0) + ' pkt');
    else if (still) fxAdd(host, 'Zanotowane', ' still', 2500, true, 'Zanotowane');
    return true;
  }

  // ---------- Tryb pokazowy (#demo): 35 dni danych przykładowych i klatki przeglądu wszystkich stanów ----------
  const FRAMES = [
    { kind: 'kaczka', stage: 'egg', mood: 'ok' }, { kind: 'kaczka', stage: 'chick', mood: 'happy' },
    { kind: 'kapibara', stage: 'young', mood: 'hungry', acc: 'szalik' }, { kind: 'kapibara', stage: 'adult', mood: 'tired', acc: 'czapka' },
    { kind: 'kotek', stage: 'adult', mood: 'sad' }, { kind: 'kotek', stage: 'young', mood: 'sleep' },
    { kind: 'gaska', stage: 'adult', mood: 'celebrate', acc: 'korona' }, { kind: 'gaska', stage: 'adult', mood: 'happy', acc: 'okulary' }
  ];
  function demo(now) {
    const n = now || new Date(), key = (i) => { const d = new Date(n.getFullYear(), n.getMonth(), n.getDate() - i, 12); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
    const days = {}, meas = {}, hab = {};
    const meal = (label, k, p) => ({ kind: 'm', id: 'demo', label, k, p, f: Math.round(k / 30), c: Math.round(k / 9) });
    // 70 dni: dziś 2 posiłki, wcześniej pełne dni; waga 84 -> 80,1 kg, obwody co 14 dni
    for (let i = 0; i <= 70; i++) {
      const k = key(i), w = 80.1 + i * 0.056 + ((i * 7) % 5 - 2) * 0.1;
      const meals = [meal('Owsianka białkowa', 420, 32), meal('Kurczak z kaszą', 610, 45), meal('Twaróg z warzywami', 380, 30)];
      days[k] = (i === 0 ? meals.slice(0, 2) : meals).concat(i % 2 ? [{ kind: 't', label: 'Siłownia, całe ciało', min: 45, gross: 300, net: 240 }] : []);
      meas[k] = { w: w.toFixed(1).replace('.', ','), steps: String(i === 0 ? 5200 : 7000 + (i * 431) % 3000), sleep: String(6.5 + (i % 4) * 0.5).replace('.', ',') };
      if (i % 14 === 0 && i > 0) Object.assign(meas[k], { waist: (89 + i / 14 * 1.2).toFixed(1), hip: (100 + i / 14 * 0.8).toFixed(1), thigh: (58 + i / 14 * 0.5).toFixed(1) });
      hab[k] = { sniad: true, woda: true, spacer: i % 3 === 0 };
    }
    const S = { onb: true, tab: 'day', guide: { hidden: true, dataOk: true, seenPet: true }, sex: 'K', kg: '80,1', cm: '170', age: '35', goal: '72', days, meas, hab, urges: {}, body: true, petSeen: [],
      pet: { kind: 'kaczka', name: 'Kluska', since: key(75) }, reviews: { demo: { a: 'Przekąska w torbie', b: 'Podjadanie wieczorem', c: 'Herbata o 20:00', d: key(7) } } };
    return { S, frames: FRAMES.slice() };
  }

  // ---------- Ścieżka kamieni: kamień za zaliczony tydzień celu, 7 na jezioro, przeszkody to pogoda (nic nie przepada) ----------
  // Styl postaci (rada/plany/2026-11-20-jezioro-brief.md): kamienie z gradientem z tokenów i konturem, postać gatunku na kamieniu,
  // jezioro zależne od numeru (odcień wody i rośliny), wiatr pochyla trzcinę, mgła to półprzezroczysta warstwa. Ruch tylko w CSS (no-preference).
  const LAKE = [['a', 'v0'], ['b', 'v1'], ['c', 'v2']];
  function plants(v, wind) {
    const tilt = (x, y) => (wind ? ` transform="rotate(16 ${x} ${y})"` : '');
    const reed = (x, y, h) => `<g class="trzcina"${tilt(x, y)}><path d="M${x} ${y}v-${h}" fill="none" stroke="${v_('reed-ln')}" stroke-width="1.6" stroke-linecap="round"/><rect x="${x - 2}" y="${y - h - 2}" width="4" height="9" rx="2" fill="${v_('reed')}" stroke="${v_('reed-ln')}" stroke-width="1"/></g>`;
    const rush = (x, y) => `<g class="sitowie"${tilt(x, y)}><path d="M${x} ${y}q-2 -14 -6 -22M${x} ${y}q1 -16 2 -26M${x} ${y}q3 -12 8 -18" fill="none" stroke="${v_('reed-ln')}" stroke-width="1.4" stroke-linecap="round"/></g>`;
    const gold = (x, y) => `<g class="kaczeniec"><path d="M${x} ${y + 8}v-8" stroke="${v_('reed-ln')}" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="3.4" fill="${v_('gold')}" stroke="${v_('reed-ln')}" stroke-width=".8"/></g>`;
    const pad = (x, y) => `<path class="lisc" d="M${x} ${y}m-8 0a8 4 0 1 0 16 0l-8 0z" fill="${v_('leaf')}" stroke="${v_('reed-ln')}" stroke-width="1"/>`;
    if (v === 'v1') return pad(270, 100) + pad(296, 95) + `<g class="grzybien"><circle cx="296" cy="92" r="3.2" fill="${v_('lily')}" stroke="${v_('reed-ln')}" stroke-width=".8"/><circle cx="296" cy="92" r="1.2" fill="${v_('gold')}"/></g>`;
    if (v === 'v2') return rush(258, 90) + rush(312, 92) + reed(304, 90, 20);
    return reed(306, 92, 24) + reed(313, 94, 18) + gold(258, 84) + gold(266, 80);
  }
  const v_ = (n) => `var(--zw-${n})`;
  function path(n, weather, name, kindIn, hop) {
    const lake = n ? Math.floor((n - 1) / 7) + 1 : 1, pos = n ? ((n - 1) % 7) + 1 : 0, kind = kindOf(kindIn);
    const where = pos ? `${name} jest na ${pos}. kamieniu z 7` : `${name} stoi na brzegu`;
    const W = { wiatr: `${name} odpoczywa na kamieniu: dziś wiatr, droga poczeka.`, mgla: 'Mgła po krótkich nocach: idziemy wolniej, kamienie zostają.' };
    const [col, v] = LAKE[(lake - 1) % 3], gs = 'zw' + (++gid), wind = weather === 'wiatr';
    const soft = (id, x2, y2, st) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${st}</linearGradient>`;
    const defs = `<defs>${soft(gs + 's', 1, 0, `<stop offset="0" stop-color="${v_('lake-' + col)}" stop-opacity="0"/><stop offset=".3" stop-color="${v_('lake-' + col)}" stop-opacity="1"/><stop offset="1" stop-color="${v_('lake-' + col)}" stop-opacity="1"/>`)}${soft(gs + 'f', 0, 1, `<stop offset="0" stop-color="${v_('fog')}" stop-opacity="0"/><stop offset=".4" stop-color="${v_('fog')}" stop-opacity="1"/><stop offset="1" stop-color="${v_('fog')}" stop-opacity="1"/>`)}<radialGradient id="${gs}" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="${v_('stone-hi')}"/><stop offset=".55" stop-color="${v_('stone')}"/><stop offset="1" stop-color="${v_('stone-sh')}"/></radialGradient></defs>`;
    let g = '', px = 16, py = 92;
    for (let i = 1; i <= 7; i++) {
      const x = 48 + (i - 1) * 30, y = 100 + (i % 2 ? 0 : -6), done = i <= pos;
      g += `<ellipse class="stone ${done ? 'done' : 'next'}${i === pos ? ' now' : ''}" cx="${x}" cy="${y}" rx="11" ry="6" fill="${done ? `url(#${gs})` : v_('stone-next')}" stroke="${v_('stone-ln')}" stroke-width="${done ? 2 : 1.4}"/>`;
      if (i === pos) { px = x; py = y - 4; }
    }
    // Postać gatunku w skali na kamieniu (przy pogodzie odpoczywa: zamknięte oczy); figura bez własnej etykiety obrazka
    const s = 0.42, [fd, fig] = figure(kind, weather === 'wiatr' || weather === 'mgla' ? 'tired' : 'ok', null);
    const pet = `<g transform="translate(${(px - 60 * s).toFixed(1)} ${(py - 103 * s).toFixed(1)}) scale(${s})">${fd}<g class="stonepet pet-${kind}${hop ? ' hop' : ''}" data-stone="${pos}">${fig}</g></g>`;
    const scene = `<path class="bank" d="M0 120V90Q14 82 30 90Q36 98 36 120Z" fill="${v_('bank')}" stroke="${v_('reed-ln')}" stroke-width="1.4"/>`
      + `<path class="stream" d="M30 112Q140 102 252 106Q258 113 248 120H30Z" fill="url(#${gs}s)" opacity=".7"/>`
      + `<ellipse class="lake lake-${v}" cx="284" cy="98" rx="36" ry="16" fill="${v_('lake-' + col)}" stroke="${v_('lake-ln')}" stroke-width="1.6"/>`
      + `<path class="wave" d="M262 100q5 -3 10 0t10 0t10 0t10 0" fill="none" stroke="${v_('lake-hi')}" stroke-width="1.6" stroke-linecap="round"/>`
      + plants(v, wind)
      + (wind ? [[40, 62], [150, 50], [196, 60]].map(([x, y]) => `<path class="wind" d="M${x} ${y}q16 -6 32 0t30 0" fill="none" stroke="${v_('wind')}" stroke-width="2" stroke-linecap="round"/>`).join('') : '');
    const fog = weather === 'mgla' ? `<rect class="fog" x="0" y="44" width="320" height="76" fill="url(#${gs}f)" opacity=".55"/>` : '';
    return `<div class="panel stones"><svg viewBox="0 44 320 76" role="img" aria-label="${where}. Jezioro ${lake}.">${defs}${scene}${g}${pet}${fog}</svg>`
      + `<p><b>Jezioro ${lake}.</b> ${where}.</p><p class="small muted">${W[weather] || 'Następny kamień po zaliczonym tygodniu celu. Przerwa niczego nie zabiera.'}</p></div>`;
  }

  return { state, milestones, next, path, svg, card, screen, nameOf, badgeList, body, react, flush, demo, kinds: () => KINDS.slice(), form };
})();
