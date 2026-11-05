// Zwierzak (Tamagotchi): stan liczony z danych aplikacji, bez zapisu. Dane wyłącznie przez ctx z app.js (petCtx),
// żeby moduł dało się testować bez DOM i bez globali aplikacji. Nastrój nie zależy od wagi ani kalorii.
var PET = (function () {
  const LINES = {
    celebrate: '{n} świętuje! Nowa odznaka.', sleep: '{n} śpi. Dobranoc.', sad: '{n} tęskni. Zapisz cokolwiek, a odżyje.',
    hungry: '{n} jest głodna. Zapisz posiłek.', tired: '{n} jest zmęczona. Sen albo spacer doda jej energii.',
    happy: '{n} jest w świetnej formie.', ok: '{n} ma się dobrze.'
  };
  const ACC = { 'Brąz': 'szalik', 'Srebro': 'czapka', 'Złoto': 'okulary', 'Platyna': 'korona' };
  const clamp = (v) => Math.max(10, Math.min(100, Math.round(v)));

  function dayKey(c, n) { const d = c.now; return c.key(new Date(d.getFullYear(), d.getMonth(), d.getDate() - n, 12)); }
  // Dzień pusty: bez posiłków, treningów, pomiarów, nawyków i ochot
  function isEmpty(c, k) {
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
    const lv = c.level(c.weekPts())[1];
    if (ACC[lv]) out.push('level-' + lv);
    return out;
  }

  function state(c) {
    const k = c.key(c.now), h = c.now.getHours(), przerwa = gap(c), ents = c.entries(k), m = c.meas(k) || {};
    const meals = ents.filter((e) => e.kind === 'm').length, train = ents.some((e) => e.kind === 't');
    const sleep = c.num(m.sleep), steps = c.num(m.steps);
    const food = h < 9 && meals === 0 ? 50 : [0, 40, 70, 100][Math.min(meals, 3)];
    const energy = Math.min(sleep / 7, 1) * 60 + (train || steps >= 6000 ? 40 : steps >= 3000 ? 20 : 0);
    const mood = Math.min(c.dayPts(k) / 50, 1) * 80 + (c.streak() >= 3 ? 20 : 0);
    const pen = 35 * przerwa;
    const meters = { food: clamp(food - pen), energy: clamp(energy - pen), mood: clamp(mood - pen) };
    const milestone = milestones(c).find((id) => !(c.seen || []).includes(id)) || null;
    const active = sinceKeys(c).filter((x) => c.dayPts(x) >= 30).length;
    const stage = active >= 30 ? 'adult' : active >= 7 ? 'young' : active >= 1 ? 'chick' : 'egg';
    let md = 'ok';
    if (milestone) md = 'celebrate';
    else if (h >= 22 || h < 6) md = 'sleep';
    else if (przerwa >= 2 && isEmpty(c, k)) md = 'sad';
    else if (h >= 12 && meals === 0) md = 'hungry';
    else if (meters.energy < 40) md = 'tired';
    else if (meters.food >= 70 && meters.energy >= 70 && meters.mood >= 70) md = 'happy';
    const name = (c.pet && String(c.pet.name || '').trim()) || 'Kluska';
    // Tryb pokazowy: klatka narzuca minę, etap i dodatek; bez kamienia milowego (nic nie trafia do petSeen)
    if (c.force) return { meters, przerwa, mood: c.force.mood, stage: c.force.stage, acc: c.force.acc || null, active, milestone: null, line: LINES[c.force.mood].replace('{n}', name) };
    return { meters, przerwa, mood: md, stage, acc: ACC[c.level(c.weekPts())[1]] || null, active, milestone, line: LINES[md].replace('{n}', name) };
  }

  // ---------- Rysunek: SVG 120×120, kolory z CSS (klasy), animacje w app.css ----------
  const SCALE = { chick: 0.7, young: 0.85, adult: 1 };
  const MOOD_PL = { celebrate: 'świętuje', sleep: 'śpi', sad: 'tęskni', hungry: 'głodna', tired: 'zmęczona', happy: 'szczęśliwa', ok: 'zadowolona' };
  const KIND_PL = { gaska: 'Gąska', kaczka: 'Kaczuszka' };

  function eyes(x, y, mood) {
    if (mood === 'sleep') return `<path class="lid" d="M${x - 4} ${y}h8"/><text class="zz" x="${x + 10}" y="${y - 12}">z</text><text class="zz z2" x="${x + 17}" y="${y - 20}">z</text>`;
    if (mood === 'happy' || mood === 'celebrate') return `<path class="lid" d="M${x - 4} ${y + 1}q4 -6 8 0"/>`;
    if (mood === 'tired') return `<path class="lid" d="M${x - 4} ${y}h8"/><circle class="eye" cx="${x}" cy="${y + 2}" r="2"/>`;
    const brow = mood === 'sad' ? `<path class="lid" d="M${x - 5} ${y - 7}l8 3"/>` : '';
    return `<g class="eyes"><circle class="eye" cx="${x}" cy="${y}" r="3.2"/><circle class="glint" cx="${x + 1}" cy="${y - 1}" r="1"/></g>${brow}`;
  }
  function acc(a, hx, hy) {
    if (a === 'szalik') return `<path class="acc szalik" d="M${hx - 14} ${hy + 16}q14 8 28 0v6q-14 8 -28 0z"/>`;
    if (a === 'czapka') return `<path class="acc czapka" d="M${hx - 12} ${hy - 10}l12 -20l12 20z"/><circle class="acc czapka" cx="${hx}" cy="${hy - 31}" r="3"/>`;
    if (a === 'okulary') return `<g class="acc okulary"><circle cx="${hx + 3}" cy="${hy - 3}" r="6"/><path d="M${hx - 3} ${hy - 3}h-6"/></g>`;
    if (a === 'korona') return `<path class="acc korona" d="M${hx - 12} ${hy - 12}l4 -12l6 7l4 -9l4 9l6 -7l-2 12z"/>`;
    return '';
  }
  function svg(kind, stage, mood, a, big) {
    const cls = `pet pet-${mood} pet-${stage} pet-${kind}${big ? ' big' : ''}`, label = `${KIND_PL[kind] || 'Zwierzak'}: ${MOOD_PL[mood] || ''}`;
    let fig;
    if (stage === 'egg') {
      fig = `<ellipse class="egg" cx="60" cy="70" rx="28" ry="36"/><path class="crack" d="M42 50l7 5l6 -7l6 7l6 -5l8 5"/>`
        + (mood === 'sleep' ? eyes(60, 72, 'sleep') : `<circle class="eye" cx="53" cy="72" r="2.4"/><circle class="eye" cx="67" cy="72" r="2.4"/>`);
    } else {
      const goose = kind === 'gaska', hx = goose ? 76 : 74, hy = goose ? 36 : 48;
      const neck = goose ? `<path class="neck-o" d="M66 70C70 58 72 48 74 40"/><path class="neck" d="M66 70C70 58 72 48 74 40"/>` : '';
      const beak = goose ? `<path class="beak long" d="M${hx + 11} ${hy - 3}l17 4l-17 5z"/>` : `<rect class="beak flat" x="${hx + 13}" y="${hy - 2}" width="16" height="8" rx="4"/>`;
      const f = `<path class="feet" d="M48 103h10l-5 -6zM64 103h10l-5 -6z"/>`;
      fig = `${f}<ellipse class="body" cx="58" cy="80" rx="34" ry="25"/>${neck}<circle class="head" cx="${hx}" cy="${hy}" r="${goose ? 13 : 17}"/>`
        + `<ellipse class="wing" cx="50" cy="80" rx="18" ry="11"/>${beak}${eyes(hx + 3, hy - 3, mood)}${acc(a, hx, hy)}`;
      const s = SCALE[stage] || 1;
      if (s !== 1) fig = `<g transform="translate(${60 * (1 - s)} ${104 * (1 - s)}) scale(${s})">${fig}</g>`;
    }
    const bubble = mood === 'hungry' ? '<g class="bubble"><circle cx="24" cy="26" r="14"/><circle cx="38" cy="44" r="3"/><path class="bowl" d="M15 24h18a9 7 0 0 1 -18 0z"/></g>' : '';
    const conf = mood === 'celebrate' ? [...Array(12)].map((_, i) => `<rect class="conf c${i % 4}" x="${8 + i * 9}" y="${4 + (i * 7) % 20}" width="5" height="8" style="animation-delay:${(i % 6) * 0.15}s"/>`).join('') : '';
    return `<svg class="${cls}" viewBox="0 0 120 120" role="img" aria-label="${label}"><ellipse class="shadow" cx="60" cy="106" rx="30" ry="4"/><g class="figure">${fig}</g>${bubble}${conf}</svg>`;
  }

  // ---------- Karta, ekran, odznaki ----------
  const BADGES = [['week1', 'Pierwszy tydzień'], ['streak7', 'Seria 7 dni'], ['streak14', 'Seria 14 dni'], ['streak30', 'Seria 30 dni'],
    ['w2', '-2% wagi'], ['w5', '-5% wagi'], ['review1', 'Pierwszy przegląd'],
    ['level-Brąz', 'Tydzień na poziomie Brąz'], ['level-Srebro', 'Tydzień na poziomie Srebro'], ['level-Złoto', 'Tydzień na poziomie Złoto'], ['level-Platyna', 'Tydzień na poziomie Platyna']];
  const STAGE_PL = { egg: 'Jajo', chick: 'Pisklę', young: 'Młoda', adult: 'Dorosła' };
  const NEXT_STAGE = { egg: [1, 'Pisklę'], chick: [7, 'Młoda'], young: [30, 'Dorosła'] };
  const ACC_PL = { szalik: 'szalik za Brąz', czapka: 'czapka za Srebro', okulary: 'okulary za Złoto', korona: 'korona za Platynę' };
  const pl1 = (x) => (Math.round(x * 10) / 10).toLocaleString('pl-PL');
  const sign = (x) => (x > 0 ? '+' : x < 0 ? '-' : '') + pl1(Math.abs(x));
  function activeDaysPl(n) {
    if (n === 1) return '1 aktywny dzień';
    const few = n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14);
    return `${n} ${few ? 'aktywne dni' : 'aktywnych dni'}`;
  }

  function badgeList(got) { return BADGES.map(([id, label]) => ({ id, label, got: got.includes(id) })); }
  function bars(m) {
    return '<span class="petbars">' + [['Najedzenie', m.food], ['Energia', m.energy], ['Humor', m.mood]].map(([l, v]) =>
      `<span class="petbarrow"><span class="petlab">${l}</span><span class="petbar${v < 40 ? ' low' : ''}" role="meter" aria-label="${l} ${v} ze 100" aria-valuenow="${v}" aria-valuemin="0" aria-valuemax="100"><i style="width:${v}%"></i></span></span>`).join('') + '</span>';
  }
  const nameOf = (pet) => (pet && String(pet.name || '').trim()) || 'Kluska';

  function card(st, pet, esc) {
    return `<button class="petcard" data-tab="pet" aria-label="Mój zwierzak: ${esc(nameOf(pet))}">${svg(pet.kind, st.stage, st.mood, st.acc)}`
      + `<span class="petinfo"><b>${esc(nameOf(pet))}</b><span class="small">${esc(st.line)}</span>${bars(st.meters)}</span></button>`;
  }
  function screen(st, pet, sum, esc) {
    const nx = NEXT_STAGE[st.stage], row = (a, b) => `<div class="entry"><span class="txt">${a}</span><span class="val">${b}</span></div>`;
    let h = `<div class="petstage">${svg(pet.kind, st.stage, st.mood, st.acc, true)}<h2>${esc(nameOf(pet))}</h2><p>${esc(st.line)}</p>`
      + `<p class="small muted">${STAGE_PL[st.stage]}${st.acc ? ', ' + ACC_PL[st.acc] : ''}${nx && nx[0] > st.active ? `. Do etapu ${nx[1]}: ${activeDaysPl(Math.max(0, nx[0] - st.active))} (co najmniej 30 pkt)` : ''}.</p></div>`;
    h += `<div class="panel" style="padding:8px 16px">${bars(st.meters)}</div>`;
    const w = sum.week, a = sum.all;
    h += '<h2>Dziś</h2><div class="panel">' + row('Podstawy dnia', `${sum.today.done} z 3`) + row('Punkty', `${sum.today.pts} pkt`) + '</div>';
    h += '<h2>Ten tydzień</h2><div class="panel">' + row('Punkty i poziom', `${w.pts} pkt, ${esc(w.level)}`)
      + (w.next ? `<div class="entry"><span class="txt small muted">do poziomu ${esc(w.next.name)} brakuje ${w.next.need} pkt</span></div>` : '') + '</div>';
    h += '<h2>Od startu</h2><div class="panel">' + row('Aktywne dni', a.active) + row('Seria', `${a.streak} dni`)
      + (a.dw != null ? row('Średnia waga (7 dni) względem startu', `${sign(a.dw)} kg`) : '')
      + (a.waist != null ? row('Talia (średnia 4 tygodni)', `${sign(a.waist)} cm`) : '')
      + (a.pct != null ? row('Etap -5%', `${Math.round(a.pct)}%`) : '') + '</div>';
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
  function flush(now) {
    if (!pending) return false;
    if ((now ? now.getTime() : Date.now()) - pending.t > 10 * 60000) { pending = null; return false; }
    const el = document.querySelector('#main .pet');
    if (!el) return false;
    const { type, pts } = pending, cls = 'react-' + type;
    pending = null;
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 1600);
    if (type === 'habit' || type === 'urge') {
      const host = el.closest('.petcard, .petstage');
      if (host) {
        host.insertAdjacentHTML('beforeend', `<span class="petfx">${type === 'urge' ? '♥' : '+' + (pts || 0)}</span>`);
        setTimeout(() => { const f = host.querySelector('.petfx'); if (f) f.remove(); }, 1500);
      }
    }
    return true;
  }

  // ---------- Tryb pokazowy (#demo): 35 dni danych przykładowych i klatki przeglądu wszystkich stanów ----------
  const FRAMES = [
    { kind: 'kaczka', stage: 'egg', mood: 'ok' }, { kind: 'kaczka', stage: 'chick', mood: 'happy' },
    { kind: 'kaczka', stage: 'young', mood: 'hungry', acc: 'szalik' }, { kind: 'kaczka', stage: 'adult', mood: 'tired', acc: 'czapka' },
    { kind: 'gaska', stage: 'adult', mood: 'sad' }, { kind: 'gaska', stage: 'young', mood: 'sleep' },
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
    const S = { onb: true, tab: 'day', sex: 'K', kg: '80,1', cm: '170', age: '35', goal: '72', days, meas, hab, urges: {}, body: true, petSeen: [],
      pet: { kind: 'kaczka', name: 'Kluska', since: key(75) }, reviews: { demo: { a: 'Przekąska w torbie', b: 'Podjadanie wieczorem', c: 'Herbata o 20:00', d: key(7) } } };
    return { S, frames: FRAMES.slice() };
  }

  return { state, milestones, svg, card, screen, badgeList, body, react, flush, demo };
})();
