// Silnik postaci Miary (wzorzec ilustracji v33, ten sam co w makiecie Ustawień v13). Używa go „Twoja sylwetka” w Ustawieniach (U2c).
// Dodatki: P.mass (domyślnie 1 = rysunek jak w treningu) skaluje głębokość tułowia i ud, żeby pokazać zmianę masy przy wadze docelowej;
// P.gut (domyślnie 0 = jak w treningu) wysuwa przód brzucha między żebrami a biodrem, żeby było widać zmianę talii.
(function () {
const RD = Math.PI / 180, S = (a) => Math.sin(a * RD), C = (a) => Math.cos(a * RD);
const add = (p, v, k) => [p[0] + v[0] * k, p[1] + v[1] * k];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const lerp = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
const nrm = (v) => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
const dir = (a) => [S(a), C(a)];                    // 0 = w dół, + = do przodu (postać patrzy w prawo)
const rotAbout = (p, o, a) => { const x = p[0] - o[0], y = p[1] - o[1]; return [o[0] + x * C(a) - y * S(a), o[1] + x * S(a) + y * C(a)]; };
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => x * x * (3 - 2 * x);
const f1 = (n) => n.toFixed(1);
// Skala R1: 1 jednostka = 1,08 cm; długości z ANSUR II 2012 (mężczyźni, średnie): udo 40,9 cm, podudzie z kostką 41,9 cm, biodro-C7 61,6 cm, bark-łokieć 36,4 cm (od stawu do stawu ok. 32 cm), łokieć-nadgarstek 26,8 cm
const L = { tor: 57, neck: 5.5, head: 9, ua: 30, fa: 24.8, th: 37.9, sh: 38.8 };
let FIG = 'm';
// Profil głowy w układzie ucha (x do przodu, y do góry): potylica, szczyt, czoło, łuk brwiowy, nasada nosa, nos, usta, broda, żuchwa
const HEADP = {
  m: [[-5.2, -6.2], [-7.6, -3.4], [-8.8, 0.8], [-8.4, 5.6], [-6.2, 9.6], [-2.6, 11.9], [1.6, 12.2], [5.4, 10.8], [8, 8], [9.2, 5], [9.6, 2.6], [9, 1.4], [9.6, 0.2], [11, -1.6], [12, -2.8], [11.2, -3.5], [10.2, -3.8], [10.6, -4.6], [10, -5.3], [10.3, -6], [9.5, -6.8], [10.2, -8.2], [9.5, -9.5], [7, -9.9], [4.2, -9.3], [1.8, -7.6], [-1.4, -6]],
  k: [[-5, -6], [-7.6, -3.2], [-8.9, 1], [-8.4, 5.8], [-6.2, 9.8], [-2.6, 12], [1.6, 12.2], [5.4, 10.8], [8, 8.2], [9, 5.2], [9.3, 2.8], [8.9, 1.6], [9.4, 0.4], [10.5, -1.6], [11.2, -2.6], [10.5, -3.3], [9.7, -3.6], [10.2, -4.4], [9.6, -5.1], [9.9, -5.8], [9.1, -6.6], [9.6, -7.9], [8.8, -9.1], [6.4, -9.4], [3.8, -8.8], [1.8, -7.2], [-1.2, -5.8]] };
// Pędzelkowa kreska: krzywa o grubości rosnącej do środka i zanikającej na końcach
function taper(a, c, b, w) { const Lf = [], Rt = [], N = 8;
  for (let i = 0; i <= N; i++) { const t = i / N, P = [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]], Dv = nrm([2 * (1 - t) * (c[0] - a[0]) + 2 * t * (b[0] - c[0]), 2 * (1 - t) * (c[1] - a[1]) + 2 * t * (b[1] - c[1])]), n = [-Dv[1], Dv[0]], h = (w * Math.sin(Math.PI * t)) / 2;
    Lf.push(add(P, n, h)); Rt.push(add(P, n, -h)); }
  return `<path d="M${[...Lf, ...Rt.reverse()].map((q) => q.map(f1).join(' ')).join('L')}Z" fill="var(--inkS)"/>`; }

// Budowa ciała: profil tułowia [s, przód, tył], promienie kończyn, ubranie, głowa
const BODY = {
  m: { pr: (b, lo, br) => [[-0.17, 7.5, 9.5], [-0.06, 9, 14.2], [0.06, 10.2, 13.4], [0.18, 10.6 + 0.8 * b, 11.2 - 1.6 * lo], [0.3, 9.6 + 1.4 * b, 9.9 - 2.2 * lo], [0.42, 10.2 + 0.6 * b, 10.1 - 1.2 * lo], [0.5, 10.9 + br, 10.6], [0.56, 11.9 + br, 10.95], [0.62, 12.9 + 1.2 * br, 11.4], [0.68, 13.2 + 1.3 * br, 11.6], [0.74, 11.8, 11.4], [0.8, 9, 11.2], [0.87, 5, 10.1], [0.92, 4, 9.2], [0.96, 3.6, 7.9], [1.0, 3, 6.4], [1.05, 1.5, 5], [1.1, 0.5, 4.2]],
    thigh: [7.5, 7, 4.3], calf: [3.8, 4.1, 1.65], ua: [3.9, 3.55, 3], fa: [2.85, 2.7, 1.9], hand: [2.1, 2.4], handL: 13.8, neck: [4.4, 3.9], legwear: 0.74 },
  k: { pr: (b, lo, br) => [[-0.17, 7.5, 10], [-0.06, 8.8, 15.2], [0.06, 9.8, 14.2], [0.18, 10 + 0.8 * b, 10.8 - 1.6 * lo], [0.3, 8.8 + 1.4 * b, 9.6 - 2.2 * lo], [0.42, 8.9 + 0.6 * b, 9.3 - 1.2 * lo], [0.5, 9.6 + br, 9.4], [0.55, 10.4 + br, 9.7], [0.6, 12.6 + 1.1 * br, 10], [0.66, 12.8 + 1.1 * br, 10.6], [0.74, 10.4, 10.7], [0.8, 8.4, 9.9], [0.88, 4.4, 8.4], [0.94, 3.6, 7.2], [1.0, 3, 5.8], [1.05, 1.5, 4.5], [1.1, 0.5, 3.8]],
    thigh: [8, 7.4, 4.6], calf: [4, 4.2, 1.7], ua: [3.4, 3.15, 2.6], fa: [2.5, 2.4, 1.7], hand: [1.9, 2.2], handL: 14.1, neck: [3.7, 3.3], legwear: 0.74 }
};

const ipl = (A, x) => { let i = 0; while (i < A.length - 2 && A[i + 1][0] < x) i++; const a = A[i], b = A[i + 1], k = clamp((x - a[0]) / (b[0] - a[0])); return a[1] + (b[1] - a[1]) * k; };
// Dopasowanie do ANSUR II z obrysem: głębokość klatki, talii (p25) i pośladków
const TSC = { m: [[-0.2, 0.84], [0.2, 0.85], [0.34, 0.88], [0.6, 0.84], [1.2, 0.84]], k: [[-0.2, 0.83], [0.1, 0.83], [0.34, 0.9], [0.62, 0.96], [1.2, 0.96]] };
for (const g of ['m', 'k']) { const pr0 = BODY[g].pr; BODY[g].pr = (b, lo, br) => pr0(b, lo, br).map(([sv, f, k]) => { const c = ipl(TSC[g], sv); return [sv, f * c, k * c]; }); }

// Udo z pośladkiem z profilu: przód = czworogłowy, tył = pośladek wielki, fałd pośladkowy (t ok. 0,2), potem dwugłowy.
// Obwód uda u góry 66 cm (m, 75. centyl) i 61,6 cm (k), nad kolanem 41-43 cm, głębokość pośladków 24-26 cm (ANSUR II).
const THIGH = {
  m: [[-0.18, 8.5, 12.8], [-0.06, 9, 13.8], [0.06, 9.2, 13.2], [0.16, 9.4, 10.8], [0.24, 9.6, 9.2], [0.4, 9.8, 8.6], [0.58, 9, 8], [0.75, 7.6, 6.9], [0.88, 6.6, 6], [1, 5.6, 5.2], [1.06, 5.3, 5.2]],
  k: [[-0.18, 8.2, 12.6], [-0.06, 8.6, 15], [0.06, 8.8, 14.4], [0.16, 9.2, 11.8], [0.24, 9.6, 9.8], [0.4, 9.4, 9], [0.58, 8.6, 8.2], [0.75, 7.4, 7], [0.88, 6.6, 6.2], [1, 5.6, 5.3], [1.06, 5.2, 5]] };
// Dopasowanie do ANSUR II z obrysem: obwód uda u góry i nad kolanem
const THSC = { m: [[-0.2, 0.82], [0.1, 0.82], [0.24, 0.8], [0.5, 0.76], [0.88, 0.68], [1.1, 0.68]], k: [[-0.2, 0.83], [0.1, 0.83], [0.24, 0.83], [0.5, 0.79], [0.88, 0.73], [1.1, 0.73]] };
for (const g of ['m', 'k']) THIGH[g] = THIGH[g].map(([t, f, b]) => { const c = ipl(THSC[g], t); return [t, f * c, b * c]; });

// Fryzury na siłownię (klasyczne cięcia, bez naśladowania konkretnych osób), w układzie ucha: włosy nie opadają na twarz i nie zasłaniają karku.
// pts = obrys włosów (od baczka przez linię nad uchem i karkiem, potem po zewnątrz), lines = pasma
const EAR_M = [[1.4, -0.6], [1.6, 3.6], [-0.8, 4.6], [-3.4, 2.4], [-3.8, -1.4]];
const FRONT = [[8.6, 7.8], [6.6, 7], [4.4, 6.6], [2.8, 4.8]];
const HAIRS = {
  // krótkie cięcie z teksturą: boki krótko, góra lekko postrzępiona
  m: { sharp: true, pts: [...EAR_M, [-5.4, -4.2], [-8.2, -2.4], [-9.3, 1.4], [-9.6, 3.6], [-9.3, 6], [-9.2, 8], [-7.6, 10.2], [-6.6, 11.8], [-4.6, 12.6], [-3, 13.4], [-0.8, 13.1], [1.6, 13.7], [3.8, 13.1], [5.8, 13.1], [7.4, 11.8], [8.8, 11], [9, 9.8], [9.4, 8.6], ...FRONT], lines: [] },
  // wysoki kucyk: włosy gładko do tyłu, związane na czubku z tyłu głowy
  k: { tail: true, pts: [...EAR_M, [-5.4, -4.6], [-8.4, -2.4], [-9.5, 1.8], [-9.1, 6.6], [-7, 10.6], [-2.8, 13], [2, 13.4], [6.4, 12.2], [8.8, 10], [9.2, 8.6], [8.3, 7.8], [6.4, 7.2], [4.2, 6.6], [2.8, 4.8]],
    lines: [[[8.4, 9.4], [2, 12.2], [-6, 10.6]], [[6.4, 8], [0, 10.4], [-7, 8.6]]] }
};

function smooth(pts) {
  const n = pts.length; let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d + 'Z';
}
// Rękaw koszulki (m): okrągły nad barkiem, prosto ucięty w 0,44 ramienia; punkty w układzie postaci (rysunek i sonda kształtu)
const SLEEVE = { top: 0, end: 0.44, r: [1.1, 1.2, 0.2] };
function sleevePts(A, B) {
  const v = nrm(sub(A.el, A.s)), Pp = [add(A.s, v, -SLEEVE.top), lerp(A.s, A.el, 0.16), lerp(A.s, A.el, SLEEVE.end)], Rr = [B.ua[0] + SLEEVE.r[0], B.ua[0] + SLEEVE.r[1], B.ua[1] + SLEEVE.r[2]], Lf = [], Rt = [];
  for (let i = 0; i < 3; i++) { const a = Pp[Math.max(0, i - 1)], b = Pp[Math.min(2, i + 1)], d = nrm(sub(b, a)), nv = [-d[1], d[0]]; Lf.push(add(Pp[i], nv, Rr[i])); Rt.push(add(Pp[i], nv, -Rr[i])); }
  const ds = nrm(sub(Pp[0], Pp[1])), ns = [-ds[1], ds[0]], cap = [1, 2, 3].map((k) => add(add(Pp[0], ns, -Rr[0] * C(k * 45)), ds, Rr[0] * S(k * 45)));
  return [...Lf, ...Rt.reverse(), ...cap];
}
// Oś miednicy w dół (układ postaci): tułów pochylony o P.tor, miednica o P.tilt
const pelvisDown = (P) => rotAbout([-S(P.tor || 0), C(P.tor || 0)], [0, 0], P.tilt || 0);
// Brzeg uda w punkcie t (0 = staw biodrowy, 1 = kolano): [przód, tył] z naddatkiem ad (spodenki); rysunek i sonda kształtu
function thighEdge(Lg, t, ad, P, fig) {
  const ms = (P && P.mass) || 1, TPF = THIGH[fig].map((q) => [q[0], q[1] * ms, q[2] * ms]), v = nrm(sub(Lg.k, Lg.h)), nF = [v[1], -v[0]];
  let i = 0; while (i < TPF.length - 2 && TPF[i + 1][0] < t) i++;
  const a = TPF[i], b = TPF[i + 1], k = clamp((t - a[0]) / (b[0] - a[0])), f = a[1] + (b[1] - a[1]) * k, b0 = a[2] + (b[2] - a[2]) * k, bk = P.rot && t < 0.2 ? b0 * 0.8 : b0;
  // nad stawem (pośladek, pachwina) brzeg należy do miednicy: kierunek przechodzi z osi uda na oś miednicy (w dół tułowia, z pochyleniem), pełny przy t <= -0,06, zanika do t = 0,2
  const w = t <= -0.06 ? 1 : t >= 0.2 ? 0 : (0.2 - t) / 0.26, d = w ? nrm(lerp(v, pelvisDown(P), w)) : v, n = [d[1], -d[0]], c = add(Lg.h, d, t * L.th);
  const r = [add(c, n, f + ad), add(c, n, -(bk + ad))]; r.c = c; return r;
}
function limb(P, Rr) {
  const n = P.length, Lf = [], Rt = [];
  for (let i = 0; i < n; i++) { const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)], d = nrm(sub(b, a)), nv = [-d[1], d[0]]; Lf.push(add(P[i], nv, Rr[i])); Rt.push(add(P[i], nv, -Rr[i])); }
  const cap = (p, d, r, nv) => [1, 2, 3].map((k) => { const t = k * 45; return [p[0] + (nv[0] * C(t) + d[0] * S(t)) * r, p[1] + (nv[1] * C(t) + d[1] * S(t)) * r]; });
  const de = nrm(sub(P[n - 1], P[n - 2])), ne = [-de[1], de[0]], ds = nrm(sub(P[0], P[1])), ns = [-ds[1], ds[0]];
  return smooth([...Lf, ...cap(P[n - 1], de, Rr[n - 1], ne), ...Rt.reverse(), ...cap(P[0], ds, Rr[0], ns)]);
}
function hemLimb(P, Rr) {
  const n = P.length, Lf = [], Rt = [];
  for (let i = 0; i < n; i++) { const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)], d = nrm(sub(b, a)), nv = [-d[1], d[0]]; Lf.push(add(P[i], nv, Rr[i])); Rt.push(add(P[i], nv, -Rr[i])); }
  const ds = nrm(sub(P[0], P[1])), ns = [-ds[1], ds[0]], cap = [1, 2, 3].map((k) => { const t = k * 45; return [P[0][0] + (ns[0] * C(t) + ds[0] * S(t)) * Rr[0], P[0][1] + (ns[1] * C(t) + ds[1] * S(t)) * Rr[0]]; });
  const e1 = Lf[n - 1], e2 = Rt[n - 1];
  return smooth([...Lf, lerp(e1, e2, 0.33), lerp(e1, e2, 0.67), ...Rt.reverse(), ...cap]);
}
function ellipse(c, u, rx, ry) { const v = [-u[1], u[0]], p = []; for (let k = 0; k < 10; k++) { const t = k * 36; p.push([c[0] + u[0] * rx * C(t) + v[0] * ry * S(t), c[1] + u[1] * rx * C(t) + v[1] * ry * S(t)]); } return smooth(p); }

function torsoPts(P, H, u, f, B) {
  const ms = P.mass || 1, gt = P.gut || 0, pr = B.pr(P.belly, P.lord, P.br || 0).map((q) => [q[0], q[1] * ms + gt * 12 * Math.exp(-Math.pow((q[0] - 0.27) / 0.16, 2)), q[2] * ms]);
  const tilt = P.tilt, w = (s) => (s <= 0.16 ? 1 : clamp((0.42 - s) / 0.26));
  const at = (s, k) => rotAbout(add(add(H, u, s * L.tor), f, k), H, tilt * w(s));
  const fl = (q) => (P.rot ? q[2] * (q[0] < 0.14 ? 0.72 : 0.82) : q[2]);
  return { fr: pr.map((q) => at(q[0], q[1])), bk: pr.map((q) => at(q[0], -fl(q))), at, pr };
}

function rig(P) {
  const t = P.tor, u = [S(t), -C(t)], f = [C(t), S(t)], H = [0, 0];
  const nb = add(H, u, L.tor), sho = add(add(H, u, L.tor * 0.81), f, 0.3);
  const ht = t + (P.hd || 0), hu = [S(ht), -C(ht)], hf = [C(ht), S(ht)];
  const pv = add(add(nb, u, 3.5), f, 0.3), O = add(add(pv, hu, 6.5), hf, -1.8);
  const hipJ = rotAbout(add(H, f, 1), H, P.tilt * 0.3);
  const leg = (th, kn, ft) => { const k = add(hipJ, dir(th), L.th), a = add(k, dir(th - kn), L.sh), fa = ft == null ? th - kn + 90 : ft; return { h: hipJ, k, a, fd: dir(fa) }; };
  const arm = (s, e, hs) => { const el = add(sho, dir(s), L.ua), w = add(el, dir(s + e), L.fa); return { s: sho, el, w, hd: dir(s + e + (hs || 0)) }; };
  return { u, f, H, nb, sho, O, hu, hf, N: leg(P.thN, P.knN, P.ftN), F: leg(P.thF, P.knF, P.ftF), aN: arm(P.shN, P.elN, P.hsN), aF: arm(P.shF, P.elF, P.hsF) };
}

// Stopa 27,1 cm i kostka 7,3 cm nad podłogą (ANSUR II): skala 1,33 wzdłuż i 1,5 w pionie
const FS = [1.14, 1.12], HSC = { m: 0.91, k: 0.95 };
function footPts(a, fd) { const v = [-fd[1], fd[0]], q = (x, y) => [a[0] + fd[0] * x * FS[0] + v[0] * y * FS[1], a[1] + fd[1] * x * FS[0] + v[1] * y * FS[1]];
  return { body: smooth([q(-3.2, -2.6), q(-4.6, 1.6), q(-3, 4.3), q(4, 4.5), q(11.5, 4.4), q(14.2, 3.3), q(13.6, 1.4), q(9, 0.2), q(3.5, -1.2), q(0.6, -3.2)]), toes: [[q(11.2, 1.2), q(12.4, 2.6), q(11.6, 4.1)], [q(8.6, 0.4), q(9.6, 2.2), q(9.2, 4.2)]] }; }
let MINI = false, HEADPOS = [0, 0];
// Dłoń z profilu: x wzdłuż dłoni od nadgarstka (0) do czubka palców (13,8), y w stronę kciuka; skala w armShapes/armLines
const HANDP = [[-0.6, 1.9], [1.5, 2.4], [3.5, 3], [5.2, 3.5], [6.9, 3.6], [7.8, 3.1], [7.4, 2.4], [6.6, 2], [8.5, 1.6], [11.2, 1.25], [13.2, 0.75], [13.8, 0], [13.3, -0.85], [11, -1.45], [8.2, -2.05], [5, -2.45], [2, -2.3], [-0.6, -1.9]];
// Dłoń wnętrzem w dół (leżenie, dłoń na kolanie): z boku widać wierzch i brzeg po stronie małego palca, kciuk schowany
const HANDB = [[-0.6, 1.9], [2, 2.1], [5.5, 2.25], [7.6, 2.15], [8.7, 1.55], [11, 1.25], [13, 0.8], [13.8, 0.1], [13.4, -0.6], [11.5, -1.1], [8.7, -1.4], [7.8, -2], [5, -2.4], [2, -2.2], [-0.6, -1.9]];
// Ucho z profilu (układ głowy, środek w E(-1, -0,2)): x do przodu, y w górę, przed pochyleniem
const EARP = [[0.9, 2.4], [1.25, 0.6], [1.1, -0.6], [0.8, -1.9], [0.2, -3], [-0.6, -2.9], [-1.3, -1.6], [-1.9, 0.6], [-1.85, 2.3], [-1.1, 3.15], [0.1, 3.25]];
// Szyja: nasada 3 j. pod C7 i 1,2 j. za osią tułowia, góra pod czaszką za żuchwą (układ ucha); w połowie węższa (kark i gardło)
const NECK = { base: -1.2, top: [-1.2, -5.4], mid: 0.94 }, SHORTS_AD = { m: 0.12, k: 0.1 };
// Odzież kompresyjna: górna krawędź spodenek (wys. tułowia); kobieta: kolarki z wysokim stanem
const WB = { m: 0.16, k: 0.24 };
// Wcięcie mostka pod C7 w jednostkach rysunku (ANSUR II: cervicale - suprasternale = 8,0 cm m, 6,7 cm k; kobieta w skali wzrostu mężczyzny)
const NOTCH = { m: 7.41, k: 6.65 };
function figure(P, ex, idp, fig) {
  const B = BODY[fig], g = rig(P), r = P.rot || 0, ox = ex.hx + (P.dx || 0), oy = ex.hy + (P.bob || 0) + (P.dy || 0);
  const T = (p) => [ox + p[0] * C(r) - p[1] * S(r), oy + p[0] * S(r) + p[1] * C(r)], TT = (arr) => arr.map(T);
  const TV = (v) => [v[0] * C(r) - v[1] * S(r), v[0] * S(r) + v[1] * C(r)];
  const ln = (a, b, w, c) => `<path d="M${a.map(f1).join(' ')}L${b.map(f1).join(' ')}" stroke="${c || 'var(--fl)'}" stroke-width="${w}" stroke-linecap="round"/>`;
  const K = (a, c, b, w) => taper(T(a), T(c), T(b), w * 1.3), dot = (u, v) => u[0] * v[0] + u[1] * v[1], neg = (v) => [-v[0], -v[1]];
  // wypełnienie: biel; dalsze kończyny jeden szary ton; włosy ciemne
  const paperOf = (base) => (base.startsWith('hair') ? 'var(--koHair)' : base.startsWith('cloth') ? (base.endsWith('F') ? 'var(--clothF)' : 'var(--cloth)') : base.endsWith('F') || base.endsWith('FS') ? 'var(--koFar)' : 'var(--paper)');
  const cel = (d, base) => `<path d="${d}" fill="${paperOf(base)}"/>`;
  const layer = (shapes, over) => shapes.map((s) => `<path d="${s.d}" fill="var(--fl)" stroke="var(--fl)" stroke-width="${s.w || 3.4}" stroke-linejoin="round"/>`).join('') + shapes.map((s) => cel(s.d, s.c)).join('') + (over || '');
  const tone = (far, k) => (far ? [k + 'F', k + 'FS'] : [k, k + 'S']);
  const TPF = THIGH[fig].map((q) => [q[0], q[1] * (P.mass || 1), q[2] * (P.mass || 1)]);
  const thighD = (Lg, t0, t1, ad, hem) => { const v = nrm(sub(Lg.k, Lg.h)), nF = [v[1], -v[0]];
    const at = (t) => { let i = 0; while (i < TPF.length - 2 && TPF[i + 1][0] < t) i++; const a = TPF[i], b = TPF[i + 1], k = clamp((t - a[0]) / (b[0] - a[0])); return [a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; };
    const ts = [t0, ...TPF.map((q) => q[0]).filter((t) => t > t0 + 0.01 && t < t1 - 0.01), t1], Fp = [], Bp = [];
    for (const t of ts) { const [fp, bp] = thighEdge(Lg, t, ad, P, fig); Fp.push(fp); Bp.push(bp); }
    const fe = Fp[Fp.length - 1], be = Bp[Bp.length - 1], end = hem ? [lerp(fe, be, 0.33), lerp(fe, be, 0.67)] : [add(add(Lg.h, v, t1 * L.th + 3.2), nF, 0.3)];
    return smooth(TT([...Fp, ...end, ...Bp.reverse(), ((pd) => add(add(Lg.h, pd, t0 * L.th - 3), [pd[1], -pd[0]], -1.5))(pelvisDown(P))])); };
  const legShapes = (Lg, far) => { const thM = lerp(Lg.h, Lg.k, 0.45), w2 = nrm(sub(Lg.a, Lg.k)), n2 = [-w2[1], w2[0]], bkC = dot(n2, nrm(sub(Lg.h, Lg.k))) - dot(n2, Lg.fd) > 0 ? n2 : neg(n2), cf = add(lerp(Lg.k, Lg.a, 0.3), bkC, 1.3), [sk, ss] = tone(far, 'skin'), sh = footPts(T(Lg.a), TV(Lg.fd));
    return { shapes: [{ d: thighD(Lg, 0, 1.06, 0, false), c: sk, s: ss }, { d: limb(TT([Lg.k, cf, Lg.a]), B.calf), c: sk, s: ss }, { d: sh.body, c: 'shoe', s: 'shoeS' }], sole: sh.toes.map((t) => taper(t[0], t[1], t[2], 0.9)).join('') }; };
  const legwear = (Lg, far) => { const [a, b] = tone(far, 'cloth'), e = B.legwear, ad = SHORTS_AD[fig];
    const d = thighD(Lg, -0.18, e, ad, true); const v = nrm(sub(Lg.k, Lg.h)), n = [-v[1], v[0]], hb = lerp(Lg.h, Lg.k, e - 0.045), fold = K(lerp(Lg.h, Lg.k, 0.06), add(lerp(Lg.h, Lg.k, e * 0.5), n, -0.4), lerp(Lg.h, Lg.k, e - 0.02), 0.45) + K(add(hb, n, -3.6), add(hb, n, 0), add(hb, n, 3.2), 0.4);
    if (far === 'parts') return { d, fold };
    return `<path d="${d}" fill="none" stroke="var(--fl)" stroke-width="3.4" stroke-linejoin="round"/>` + cel(d, a) + fold; };
  // Chwyt (ex.grip = noga): palce od kostek (x = 8) zginają się w stronę kolana, kąt narasta do czubków (75°)
  const handFrame = (A) => { const hd = A.hd, nh0 = [-hd[1], hd[0]], nh = dot(nh0, add(g.f, g.u, 1)) >= 0 ? nh0 : neg(nh0), hs = (B.handL + B.hand[1]) / 13.8, hw = B.hand[1] / 2.4;
    const kn = ex.grip ? g[ex.grip].k : null, sg = kn ? clamp(dot(sub(kn, A.w), nh) / 3 + 0.5) * 2 - 1 : 0;
    return (x, y) => { if (kn && x > 8) { const a = sg * 75 * Math.min(1, (x - 8) / 5.8), dx = x - 8; x = 8 + dx * C(a) - y * S(a); y = dx * S(a) + y * C(a); } return add(add(A.w, hd, x * hs), nh, y * hw); }; };
  const armShapes = (A, far) => { const [sk, ss] = tone(far, 'skin'), HQ = handFrame(A);
    const dl = [{ d: ellipse(T(lerp(A.s, A.el, 0.12)), TV(nrm(sub(A.el, A.s))), B.ua[0] + 1.6, B.ua[0] + 1.1), c: sk, s: ss }];
    return [...dl, { d: limb(TT([A.s, lerp(A.s, A.el, 0.45), A.el]), B.ua), c: sk, s: ss }, { d: limb(TT([A.el, lerp(A.el, A.w, 0.35), A.w]), B.fa), c: sk, s: ss }, { d: smooth(TT((ex.palmDown ? HANDB : HANDP).map(([x, y]) => HQ(x, y)))), c: sk, s: ss }]; };
  const sleeve = (A, far) => { if (fig !== 'm') return ''; const d = smooth(TT(sleevePts(A, B))); return `<path d="${d}" fill="var(${far ? '--clothF' : '--cloth'})" stroke="var(--fl)" stroke-width="1.3" stroke-linejoin="round"/>`; };
  // Mięśnie jako kształty: tq(s, k) w tułowiu (k: 0 oś, 1 przód, -1 tył), lq(noga, t, k) w udzie; kind 'work' pełny, 'stretch' paski
  const tq = (sv, k) => { const [fr, bk] = frontAt(sv); return tp.at(sv, k >= 0 ? fr * k : -bk * (P.rot ? (sv < 0.14 ? 0.72 : 0.82) : 1) * -k); };
  const lq = (Lg, t, k) => { const e = thighEdge(Lg, t, 0, P, fig); return lerp(e.c, k >= 0 ? e[0] : e[1], Math.abs(k)); };
  const muscle = (pts, o, kind, fibers) => { if (o <= 0.02) return ''; const st = kind === 'stretch', d = smooth(TT(pts));
    let out = `<path d="${d}" fill="${st ? 'url(#stID)' : 'var(--workFill)'}" fill-opacity="${f1((st ? 1 : 0.8) * o)}" stroke="var(${st ? '--stretchLine' : '--workLine'})" stroke-width="1.2" stroke-linejoin="round" stroke-opacity="${f1(o)}"/>`;
    for (const [a, b, c, w] of fibers || []) { const A = T(a), B2 = T(b), Cc = T(c); out += `<path d="M${A.map(f1).join(' ')}Q${B2.map(f1).join(' ')} ${Cc.map(f1).join(' ')}" fill="none" stroke="var(${st ? '--stretchLine' : '--workLine'})" stroke-width="${w || 0.7}" stroke-linecap="round" stroke-opacity="${f1(0.85 * o)}"/>`; }
    return out; };
  // prosty uda: wrzecionowaty brzusiec na przodzie uda od kolca biodrowego do nad rzepkę, dalej ścięgno do rzepki
  const rectusF = (Lg, o, kind) => muscle([lq(Lg, -0.03, 0.6), lq(Lg, 0.08, 0.9), lq(Lg, 0.3, 0.95), lq(Lg, 0.55, 0.92), lq(Lg, 0.74, 0.82), lq(Lg, 0.82, 0.72), lq(Lg, 0.74, 0.55), lq(Lg, 0.55, 0.42), lq(Lg, 0.3, 0.38), lq(Lg, 0.1, 0.42)], o, kind,
    [[lq(Lg, 0.82, 0.74), lq(Lg, 0.92, 0.8), lq(Lg, 1.0, 0.86), 1.1], [lq(Lg, 0.12, 0.66), lq(Lg, 0.42, 0.7), lq(Lg, 0.72, 0.68), 0.6]]);
  // pośladkowy wielki: od krzyża i tyłu miednicy skośnie w dół i do przodu do pasma na boku uda; włókna skośne
  const gluteMax = (Lg, o) => muscle([tq(0.16, -0.6), tq(0.1, -0.9), tq(-0.02, -0.96), lq(Lg, 0.1, -0.92), lq(Lg, 0.2, -0.72), lq(Lg, 0.27, -0.32), lq(Lg, 0.28, -0.08), lq(Lg, 0.16, -0.12), tq(0.06, -0.38), tq(0.13, -0.44)], o, 'work',
    [[tq(0.12, -0.75), lerp(tq(0.04, -0.6), lq(Lg, 0.12, -0.4), 0.5), lq(Lg, 0.18, -0.15)], [tq(0.02, -0.9), lerp(tq(-0.04, -0.75), lq(Lg, 0.16, -0.6), 0.5), lq(Lg, 0.22, -0.35)]]);
  // dół brzucha (NHS Borders: „deep tummy muscles”, dolna część brzucha): pas wzdłuż przedniej ściany, włókna poprzeczne
  const lowerAbs = (o) => muscle([tq(0.36, 0.6), tq(0.36, 0.92), tq(0.26, 0.95), tq(0.16, 0.95), tq(0.07, 0.9), tq(0.07, 0.6), tq(0.16, 0.62), tq(0.26, 0.62)], o, 'work',
    [0.12, 0.2, 0.28].map((sv) => [tq(sv, 0.66), tq(sv + 0.004, 0.78), tq(sv, 0.9)]));
  // zginacze biodra przy rozciąganiu: biodrowo-lędźwiowy od dołu brzucha przez pachwinę + prosty uda na przodzie uda
  const hipFlexStretch = (Lg, o) => muscle([tq(0.3, 0.38), tq(0.3, 0.6), tq(0.14, 0.86), lq(Lg, 0.04, 0.9), lq(Lg, 0.3, 0.94), lq(Lg, 0.52, 0.88), lq(Lg, 0.52, 0.5), lq(Lg, 0.3, 0.42), lq(Lg, 0.12, 0.3), tq(0.1, 0.36)], o, 'stretch');
  // tułów
  const tp = torsoPts(P, g.H, g.u, g.f, B), ring = TT([...tp.fr, ...tp.bk.slice().reverse()]);
  const wl = WB[fig], cut = tp.pr.findIndex((q) => q[0] > wl), q0 = tp.pr[cut - 1], q1 = tp.pr[cut], kc = (wl - q0[0]) / (q1[0] - q0[0]), wf = q0[1] + (q1[1] - q0[1]) * kc, wb = (q0[2] + (q1[2] - q0[2]) * kc) * (P.rot ? 0.82 : 1);
  const cpId = `cs${idp}`, cp = TT([tp.at(wl, 60), tp.at(wl, -60), tp.at(-1.6, -60), tp.at(-1.6, 60)]);
  const shortsTop = `<clipPath id="${cpId}"><path d="M${cp.map((q) => q.map(f1).join(' ')).join('L')}Z"/></clipPath><path d="${smooth(ring)}" fill="var(--cloth)"/>`;
  const shortsEdge = ((a, b) => `<path d="M${a.map(f1).join(' ')}L${b.map(f1).join(' ')}" stroke="var(--fl)" stroke-width="1.3" stroke-linecap="round"/>`)(T(tp.at(wl, wf)), T(tp.at(wl, -wb)));
  const hsc = HSC[fig], E = (x, y) => add(add(g.O, g.hf, x * hsc), g.hu, y * hsc);
  const nB = add(add(g.nb, g.u, -3), g.f, NECK.base), nT = E(...NECK.top), neck = limb(TT([nB, lerp(nB, nT, 0.5), nT]), [B.neck[0], B.neck[1] * NECK.mid, B.neck[1]]);

  // Linie mięśni: kierunek „przód” kończyny z zgięcia stawu, przy prostym stawie z kierunku tułowia
  const legLines = (Lg, rt) => { if (MINI) return ''; const v = nrm(sub(Lg.k, Lg.h)), n1 = [-v[1], v[0]], d1 = dot(n1, sub(Lg.a, Lg.k)), fr = Math.abs(d1) > 1 ? (d1 > 0 ? neg(n1) : n1) : dot(n1, g.f) >= 0 ? n1 : neg(n1);
    const w2 = nrm(sub(Lg.a, Lg.k)), n2 = [-w2[1], w2[0]], d2 = dot(n2, sub(Lg.h, Lg.k)), bk = Math.abs(d2) > 1 ? (d2 > 0 ? neg(n2) : n2) : dot(n2, g.f) >= 0 ? neg(n2) : n2, LH = (k) => lerp(Lg.h, Lg.k, k), LK = (k) => lerp(Lg.k, Lg.a, k);
    const a = 0.78, c = B.calf[1] / 6.1;
    return K(add(LH(0.22), fr, 2.7 * a), add(LH(0.55), fr, 5.4 * a), add(LH(0.88), fr, 2 * a), 1.2) + K(add(LH(0.32), fr, -1.5 * a), add(LH(0.6), fr, -0.5 * a), add(LH(0.9), fr, -2 * a), 0.8) +
      K(add(add(Lg.k, fr, 2.2), v, -2.4), add(Lg.k, fr, 3.2), add(add(Lg.k, fr, 2.2), v, 2.4), 0.9) +
      K(add(LK(0.12), bk, 2 * c), add(LK(0.32), bk, 4.6 * c), add(LK(0.62), bk, 1.4 * c), 1.1) + K(add(LK(0.22), bk, -2.6 * c), add(LK(0.48), bk, -3 * c), add(LK(0.78), bk, -1.8 * c), 0.6); };
  const armLines = (A) => { const v = nrm(sub(A.el, A.s)), n = [-v[1], v[0]], fw = dot(n, g.f) >= 0 ? n : neg(n), u2 = nrm(sub(A.w, A.el)), n4 = [-u2[1], u2[0]], fw4 = dot(n4, add(g.f, g.u, 1)) >= 0 ? n4 : neg(n4), LS = (k) => lerp(A.s, A.el, k), LE = (k) => lerp(A.el, A.w, k);
    const hd = A.hd, nh0 = [-hd[1], hd[0]], nh = dot(nh0, add(g.f, g.u, 1)) >= 0 ? nh0 : neg(nh0), HW = (a, k) => add(add(A.w, hd, a), nh, k);
    const HQ = handFrame(A), hand = ex.palmDown ? [1, -1].map((y) => K(HQ(9, y * 0.45), HQ(11, y * 0.4), HQ(12.8, y * 0.25), 0.3)).join('')
      : K(HQ(3.2, 1.9), HQ(5, 2.5), HQ(6.5, 2.25), 0.5) + K(HQ(8.8, 0.55), HQ(10.8, 0.45), HQ(12.7, 0.3), 0.38) + K(HQ(8.8, -0.65), HQ(10.8, -0.75), HQ(12.5, -0.8), 0.38);
    if (MINI) return hand;
    const a = B.ua[1] / 5.2, f = B.fa[1] / 4.2;
    return hand + K(add(LS(0.04), fw, 4 * a), add(LS(0.26), fw, 2.6 * a), add(LS(0.44), fw, -0.6 * a), 1.0) + K(add(LS(0.46), fw, 2.4 * a), add(LS(0.66), fw, 3.4 * a), add(LS(0.9), fw, 2 * a), 0.8) +
      K(add(LS(0.4), fw, -3 * a), add(LS(0.62), fw, -3.6 * a), add(LS(0.82), fw, -2.4 * a), 0.7) + K(add(LE(0.1), fw4, 2 * f), add(LE(0.36), fw4, 2.6 * f), add(LE(0.7), fw4, 1 * f), 0.7); };
  const frontAt = (sv) => { const pr = tp.pr; let i = 0; while (i < pr.length - 2 && pr[i + 1][0] < sv) i++; const a = pr[i], b = pr[i + 1], k = clamp((sv - a[0]) / (b[0] - a[0])); return [a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; };
  let torsoLines = '';
  if (!MINI) {
    const A = (sv, k) => tp.at(sv, k), fa = (sv) => frontAt(sv)[0], ba = (sv) => frontAt(sv)[1];
    if (fig === 'm') torsoLines = K(A(0.76, 3), A(0.56, 6.5), A(0.57, fa(0.57) - 0.3), 1.4) + [0.46, 0.37].map((sv) => K(A(sv, fa(sv) - 1.2), A(sv + 0.01, fa(sv) - 2.4), A(sv, fa(sv) - 3.6), 0.6)).join('') +
      K(A(0.5, 2.5), A(0.36, 5), A(0.19, fa(0.19) - 0.8), 0.8) + K(A(0.58, 1.5), A(0.6, 3), A(0.58, 4.5), 0.8) + K(A(0.8, -ba(0.8) + 2.4), A(0.62, -ba(0.62) + 1), A(0.46, -ba(0.46) + 2), 1.0);
    else torsoLines = K(A(0.53, fa(0.53) - 0.2), A(0.52, 0), A(0.53, -ba(0.53) + 0.2), 1.1) +
      K(A(0.44, 2), A(0.33, 4), A(0.2, fa(0.2) - 0.8), 0.8) + [0.4].map((sv) => K(A(sv, fa(sv) - 1.2), A(sv + 0.01, fa(sv) - 2.2), A(sv, fa(sv) - 3.2), 0.5)).join('') + K(A(0.78, -ba(0.78) + 2), A(0.62, -ba(0.62) + 1), A(0.5, -ba(0.5) + 2), 0.8);
    torsoLines += K(A(0.875, frontAt(0.875)[0] - 0.8), A(0.885, 2.4), add(add(g.sho, g.u, 2.8), g.f, 0.4), fig === 'm' ? 0.7 : 0.55);
  }
  // odzież kompresyjna na tułowiu: m koszulka (dekolt okrągły przy wcięciu mostka, z tyłu przy C7), k top do pasa pod biustem z szerokimi ramiączkami
  const ff = (sv) => frontAt(sv)[0], bb = (sv) => frontAt(sv)[1] * (P.rot ? (sv < 0.14 ? 0.72 : 0.82) : 1);
  const span = (a, b, fn) => Array.from({ length: 9 }, (_, i) => fn(a + ((b - a) * i) / 8));
  const nk = 1 - NOTCH[fig] / L.tor;
  const topPts = fig === 'm'
    ? [...span(-0.02, nk, (sv) => tp.at(sv, ff(sv))), tp.at(nk + 0.05, ff(nk) * 0.35), tp.at(0.975, -bb(0.975) * 0.5), ...span(0.975, -0.02, (sv) => tp.at(sv, -bb(sv)))]
    : [...span(0.49, 0.75, (sv) => tp.at(sv, ff(sv))), tp.at(0.8, ff(0.8) - 1.6), tp.at(nk, 2), tp.at(0.95, 0.6), tp.at(0.95, -bb(0.95) * 0.6), ...span(0.95, 0.49, (sv) => tp.at(sv, -bb(sv)))];
  const topD = smooth(TT(topPts));
  let garment = `<path d="${topD}" fill="var(--cloth)" stroke="var(--fl)" stroke-width="1.3" stroke-linejoin="round"/>`;
  if (fig === 'm') garment += K(tp.at(0.74, 0.6), tp.at(0.45, 1.1), tp.at(0.12, 0.8), 0.45);
  // głowa
  const hu = g.hu, hf = g.hf, Q = (pts) => pts.map(([x, y]) => E(x, y));
  HEADPOS = T(g.O);
  const headD = smooth(TT(Q(HEADP[fig])));
  const HS = HAIRS[fig], hairPts = TT(Q(HS.pts));
  const hairD = HS.sharp ? 'M' + hairPts.map((q) => q.map(f1).join(' ')).join('L') + 'Z' : smooth(hairPts);
  const comb = HS.lines.map((l) => { const q = TT(Q(l)); return `<path d="M${q[0].map(f1).join(' ')}Q${q[1].map(f1).join(' ')} ${q[2].map(f1).join(' ')}" fill="none" stroke="#fff" stroke-opacity="0.4" stroke-width="0.55" stroke-linecap="round"/>`; }).join('');
  // twarz: brew, oko (powieki i tęczówka), nozdrze, kącik ust; ucho (małżowina 6 j.); mięsień mostkowo-obojczykowo-sutkowy od ucha do mostka
  const m = fig === 'm', EQ = (x, y) => E(-1 + x * C(12) - y * S(12), -0.2 + x * S(12) + y * C(12)), ear = `<path d="${smooth(TT(EARP.map(([x, y]) => EQ(x, y))))}" fill="var(--paper)" stroke="var(--fl)" stroke-width="0.9" stroke-linejoin="round"/>` +
    K(EQ(0.3, 2.5), EQ(-1.2, 2.2), EQ(-1.35, -0.5), 0.34) + K(EQ(-0.4, 1.6), EQ(-0.75, 0.2), EQ(0.1, -0.9), 0.28) + K(EQ(0.9, 0.9), EQ(0.6, 0.3), EQ(0.95, -0.3), 0.22);
  const face = K(E(6.4, 2.7), E(8, 3.3), E(9.3, 2.9), m ? 0.8 : 0.55) + K(E(6.9, 1.5), E(7.9, 2), E(8.8, 1.3), 0.4) + K(E(7.1, 0.6), E(7.9, 0.4), E(8.6, 0.9), 0.22) +
    `<path d="${ellipse(T(E(8.1, 1.2)), TV(hu), 0.45, 0.4)}" fill="var(--inkS)"/>` + (m ? '' : K(E(8.7, 1.5), E(9.2, 1.9), E(9.4, 2.4), 0.28)) +
    K(E(m ? 10.2 : 9.7, -2.4), E(m ? 10.9 : 10.3, -2.8), E(m ? 10.7 : 10.1, -3.3), 0.35) + K(E(m ? 9.2 : 8.8, -4.9), E(m ? 9.8 : 9.3, -5), E(m ? 10.2 : 9.7, -5), 0.3) +
    (m ? K(E(1.6, -6.4), E(4.6, -8.8), E(8.2, -9.4), 0.35) : '') +
    K(E(-1.4, -3.6), add(lerp(E(-1.4, -3.6), add(g.nb, g.f, 3), 0.5), g.f, 0.6), add(add(g.nb, g.u, -1.5), g.f, 3), 0.7);
  // kucyk: kołysze się z ruchem (ruch drugoplanowy)
  let tail = '';
  if (fig === 'k' && HS.tail) { const sw = P.sway || 0, bk = [-hf[0], -hf[1]], dn = [-hu[0], -hu[1]], p0 = E(-7.6, 9.4), flat = (P.rot || 0) !== 0;
    // na leżąco włosy leżą na macie: kierunek wzdłuż osi głowy, bez wchodzenia w podłogę
    const p1 = flat ? add(add(p0, hu, 4.5), bk, 0.5) : add(add(p0, bk, 4), dn, 1), p2 = flat ? add(add(p1, hu, 5.5), bk, 0.3) : add(add(add(p1, bk, 2.2), dn, 6.5), hf, sw * 0.7), p3 = flat ? add(p2, hu, 5) : add(add(add(p2, dn, 6), bk, 0.4), hf, sw * 1.1);
    const td = limb(TT([p0, p1, p2, p3]), flat ? [2, 2.4, 1.9, 0.8] : [2.1, 2.8, 2.2, 0.8]); tail = `<path d="${td}" fill="var(--fl)" stroke="var(--fl)" stroke-width="2.4" stroke-linejoin="round"/>` + cel(td, 'hair') + `<path d="${ellipse(T(p0), TV(hu), 1.5, 1.1)}" fill="var(--inkS)" stroke="var(--fl)" stroke-width="1"/>`; }
  const torsoLayer = layer([{ d: neck, c: 'skin', s: 'skinS' }, { d: smooth(ring), c: 'shirt', s: 'shirtS' }, { d: headD, c: 'skin', s: 'skinS', w: 1.9 }],
    garment + torsoLines + face + `<path d="${hairD}" fill="var(--fl)" stroke="var(--fl)" stroke-width="1.8" stroke-linejoin="${HS.sharp ? 'miter' : 'round'}" stroke-miterlimit="6"/>` + cel(hairD, 'hair') + comb + ear);
  let s = (ex.ground ? ex.ground(T, g) : '') + '<g class="fb">';
  const lf = legShapes(g.F, 1), lnn = legShapes(g.N, 0);
  s += tail;
  s += layer(armShapes(g.aF, 1), sleeve(g.aF, 1) + armLines(g.aF));
  s += layer(lf.shapes, lf.sole + legLines(g.F, B.thigh[1]) + legwear(g.F, 1));
  s += torsoLayer;
  s += layer(lnn.shapes, lnn.sole + legLines(g.N, B.thigh[1]));
  const sw = legwear(g.N, 'parts'), band = K(tp.at(wl - 0.03, wf - 0.5), tp.at(wl - 0.03, 0), tp.at(wl - 0.03, -wb + 0.5), 0.4);
  s += `<g clip-path="url(#${cpId})"><path d="${sw.d}" fill="var(--fl)" stroke="var(--fl)" stroke-width="3.4" stroke-linejoin="round"/>` + shortsTop + cel(sw.d, 'cloth') + '</g>' + shortsEdge + sw.fold + band;
  s += lowerAbs(P.gBelly || 0) + gluteMax(g.N, P.gGlute || 0) + hipFlexStretch(g.N, P.gHipN || 0);
  s += layer(armShapes(g.aN, 0), sleeve(g.aN, 0) + armLines(g.aN));
  s += '</g>' + (ex.extra ? ex.extra(T, g, P, tp) : '');
  return s;
}
function drawRaw(svg, P, ex, fig) { MINI = !!svg.closest('.keys') || !!ex.plain; const idp = svg.dataset.k; svg.innerHTML = `<defs><marker id="ah${idp}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--move)"/></marker><pattern id="st${idp}" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="3" fill="var(--stretchFill)" opacity=".3"/><rect width="1.5" height="3" fill="var(--stretchFill)"/></pattern></defs>` + figure(P, ex, idp, fig || FIG).split('url(#ahID)').join(`url(#ah${idp})`).split('url(#stID)').join(`url(#st${idp})`); }
// Kadr: obrys postaci ze wszystkich faz ruchu (24 próbki), postać zajmuje 80 % mniejszego wymiaru, podłoga przy dolnej krawędzi
const FRAMES = {};
function frameOf(ex, fig, fit) {
  const key = [ex.id, fig, fit].join('|'); if (FRAMES[key]) return FRAMES[key];
  let ms = document.getElementById('fit-meas');
  if (!ms) { ms = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); ms.id = 'fit-meas'; ms.setAttribute('viewBox', '0 0 200 200'); ms.setAttribute('aria-hidden', 'true'); ms.style.cssText = 'position:absolute;left:-9999px;top:0;width:200px;height:200px'; ms.dataset.k = 'ms'; document.body.appendChild(ms); }
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (let i = 0; i < 24; i++) { const q = poseAt(ex, (ex.period * i) / 24).p; drawRaw(ms, q, ex, fig); const b = ms.querySelector('.fb').getBBox(); x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height); }
  y1 = Math.max(y1, ex.floorY || y1);
  const [aw, ah] = fit.split('/').map(Number), ar = aw / ah, w = x1 - x0, h = y1 - y0;
  let vw = w / 0.8, vh = h / 0.8; if (vw / vh > ar) vh = vw / ar; else vw = vh * ar;
  const vx = (x0 + x1) / 2 - vw / 2, vy = y1 + vh * 0.07 - vh;
  return (FRAMES[key] = `${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`);
}
function draw(svg, P, ex, fig) { drawRaw(svg, P, ex, fig); if (svg.dataset.fit) svg.setAttribute('viewBox', frameOf(ex, fig || FIG, svg.dataset.fit)); }

const floorLine = (y) => (T, g) => { const a = T(g.N.a), b = T(g.F.a), cx = (a[0] + b[0]) / 2 + 6; return `<line x1="-400" y1="${y}" x2="600" y2="${y}" stroke="var(--line)" stroke-width="2"/><ellipse cx="${f1(cx)}" cy="${y}" rx="26" ry="3.6" fill="var(--floorsh)"/>`; };
const mat = (y, x0, x1) => () => `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="7" rx="3.5" fill="var(--mat)"/><line x1="-400" y1="${y + 7}" x2="600" y2="${y + 7}" stroke="var(--line)" stroke-width="2"/>`;
const arrow = (d, o) => (o > 0.05 ? `<path d="${d}" fill="none" stroke="var(--move)" stroke-width="3" stroke-linecap="round" marker-end="url(#ahID)" opacity="${o.toFixed(2)}"/>` : '');
const speed = (p, v, o) => { if (o < 0.08) return ''; const n = [-v[1], v[0]]; let s = ''; [-5, 0, 5].forEach((k, i) => { const a = add(add(p, n, k), v, -(6 + i * 2)), b = add(a, v, -(7 - i)); s += `<path d="M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}" stroke="var(--fl)" stroke-width="1.3" stroke-linecap="round" opacity="${f1(0.7 * o)}"/>`; }); return s; };
const base = { rot: 0, tor: 0, hd: 0, thN: 0, knN: 0, thF: 0, knF: 0, ftN: 90, ftF: 90, shN: 4, elN: 12, shF: -4, elF: 12, hsN: 0, hsF: 0, belly: 0.5, lord: 0.45, tilt: 0, br: 0, bob: 0, sway: 0, gBelly: 0, gGlute: 0, gHipN: 0, gThN: 0, gThF: 0, vN: 0, vF: 0, dx: 0, dy: 0 };
const P = (o) => ({ ...base, ...o });

const FOOT = 6.8, hookTh = 45, hookSh = -Math.asin((167 - FOOT - 156.8 + L.th * S(45)) / L.sh) / RD;
const kneeTh = -6, kneeHy = 176 - 5 - L.th * C(6), frontTh = 90 + Math.asin((kneeHy - (176 - FOOT - L.sh)) / L.th) / RD;

function kneelFwd(d) {
  const kx = L.th * S(kneeTh) - d, thN = Math.asin(kx / L.th) / RD, dy = L.th * C(kneeTh) - L.th * C(thN);
  const ax = L.th * S(frontTh) - d, ay = L.th * C(frontTh) + L.sh - dy, D2 = ax * ax + ay * ay, Dl = Math.sqrt(D2);
  const kn = Math.acos(Math.max(-1, Math.min(1, (D2 - L.th * L.th - L.sh * L.sh) / (2 * L.th * L.sh)))) / RD;
  const thF = Math.atan2(ax, ay) / RD + Math.atan2(L.sh * S(kn), L.th + L.sh * C(kn)) / RD;
  return { dx: d, dy, thN, knN: thN + 90, thF, knF: kn };
}
// marsz: 2 cykle w miejscu, kroki do przodu, do tyłu, znów w miejscu (NHS: „march forwards and backwards”)
const MA = { tor: 1.5, hd: -3, thN: 54, knN: 78, ftN: 74, ftF: 90, shN: -24, elN: 40, shF: 24, elF: 80, hsN: 8, hsF: 8, gThN: 1 },
  MB = { tor: 1.5, hd: -3, thF: 54, knF: 78, ftF: 74, ftN: 90, shN: 24, elN: 80, shF: -24, elF: 40, hsN: 8, hsF: 8, gThF: 1 },
  MDX = [0, 0, 0, 0, 0, 6, 12, 6, 0, 0], MLB = ['Unieś kolano, przeciwna ręka do przodu', 'Zmiana nogi, spokojne tempo marszu', 'Unieś kolano, przeciwna ręka do przodu', 'Zmiana nogi, spokojne tempo marszu',
    'Kilka kroków do przodu', 'Kilka kroków do przodu', 'Kilka kroków do tyłu', 'Kilka kroków do tyłu', 'Znów marsz w miejscu', 'Znów marsz w miejscu'];
const walk = (h, o, sg) => o ? arrow(`M${f1(h[0] - sg * 10)} ${f1(h[1] + 90)}L${f1(h[0] + sg * 14)} ${f1(h[1] + 90)}`, o) : '';
const EX = [
  { id: 'm', plain: true, aria: 'Strzałki: kolano w górę, potem stopa w dół; po chwili kilka kroków do przodu i do tyłu. Ręce zgięte w łokciach, dłonie luźne. Bez zaznaczenia mięśni: źródło ich nie wskazuje.', n: 'Marsz w miejscu', dose: '3 min', src: 'NHS', hx: 98, hy: 181 - L.th - L.sh - FOOT, ground: floorLine(181), floorY: 183, period: 18, stillAt: 0.02,
    keysAt: [[0.95, 'Prawe kolano w górę, lewa ręka do przodu'], [0.02, 'Lewe kolano w górę, prawa ręka do przodu'], [9.5, 'Kilka kroków do przodu, potem do tyłu']],
    keys: [...MDX.flatMap((dx, i) => [{ at: i * 1.8, p: P({ ...MA, dx }), l: MLB[i] }, { at: i * 1.8 + 0.9, p: P({ ...MB, dx: (dx + (MDX[i + 1] ?? 0)) / 2 }), l: MLB[i] }]), { at: 18, p: null }],
    sec: (t, p) => { p.fw = clamp((t - 7.2) / 0.3) * clamp((10.8 - t) / 0.3); p.bw = clamp((t - 10.8) / 0.3) * clamp((14.4 - t) / 0.3); const tc = t % 1.8, win = (a, b) => clamp(Math.min(tc - a, b - tc) / 0.12); p.dnN = win(0.25, 0.8); p.dnF = win(1.15, 1.7); const ph = (t / 0.9) % 1; p.bob = -1.6 * Math.abs(Math.sin(ph * Math.PI)); p.sway = 1.8 * Math.sin((t / 0.9) * Math.PI * 2 - 1); const v = Math.sin(ph * Math.PI); if (t % 1.8 < 0.9) { p.vF = v; p.vN = 0; } else { p.vN = v; p.vF = 0; } },
    extra: (T, g, p) => { const up = (k, o) => { const a = T(k); return arrow(`M${f1(a[0] + 8)} ${f1(a[1] + 9)}L${f1(a[0] + 8)} ${f1(a[1] - 5)}`, o); }, down = (k, o) => { const a = T(k); return arrow(`M${f1(a[0] + 10)} ${f1(a[1] - 16)}L${f1(a[0] + 10)} ${f1(a[1] - 3)}`, o); };
      const kq = 1 - Math.max(p.fw || 0, p.bw || 0);
      return speed(T(g.N.k), [0, -1], p.vN) + speed(T(g.F.k), [0, -1], p.vF) + up(g.N.k, kq * clamp(((p.gThN || 0) - 0.7) / 0.3)) + up(g.F.k, kq * clamp(((p.gThF || 0) - 0.7) / 0.3)) + down(g.N.a, kq * (p.dnN || 0)) + down(g.F.a, kq * (p.dnF || 0)) + walk(T(g.H), p.fw, 1) + walk(T(g.H), p.bw, -1); } },
  { id: 'b', plain: true, palmDown: true, aria: 'Pomarańczowo: dół brzucha (głębokie mięśnie brzucha) pracuje przy wydechu i trzymaniu; plecy i miednica bez ruchu. Strzałki: na wdechu brzuch w górę, na wydechu dół brzucha w stronę kręgosłupa.', n: 'Wciągnięcie dołu brzucha', dose: '5–10 s, 5–10 razy', src: 'NHS Borders', hx: 128, hy: 156.8, ground: mat(167, 14, 192), floorY: 176, period: 12, stillAt: 6.5,
    keysAt: [[1, 'Wdech: brzuch luźny'], [4.2, 'Wydech: dół brzucha w stronę kręgosłupa'], [6.5, 'Trzymaj, oddychaj normalnie']],
    keys: [
      { at: 0, p: P({ rot: -90, thN: hookTh, knN: hookTh - hookSh, ftN: 0, thF: hookTh, knF: hookTh - hookSh, ftF: 0, shN: -2, elN: 0, hsN: -6, shF: -2, elF: 0, hsF: -6, belly: 1, lord: 0.3, br: 0.9, sway: -5 }), l: 'Na plecach, kolana ugięte, stopy płasko; wdech, brzuch luźny' },
      { at: 2.2, p: 'same', l: 'Wydech: delikatnie wciągnij dół brzucha w stronę kręgosłupa' },
      { at: 3.8, p: { belly: 0, br: 0.1, gBelly: 1 }, l: 'Trzymaj 5–10 s i oddychaj normalnie; plecy i miednica bez ruchu' },
      { at: 9, p: 'same', l: 'Rozluźnij brzuch' },
      { at: 10.6, p: { belly: 1, br: 0.9, gBelly: 0 }, l: 'Rozluźnij brzuch' },
      { at: 12, p: null }],
    sec: (t, p) => { p.inh = clamp(Math.min((2.2 - t) / 0.4, 1)) + clamp((t - 10.6) / 0.4); if (t > 3.8 && t < 9) p.br = 0.1 + 0.45 * (0.5 - 0.5 * Math.cos(((t - 3.8) / 2.6) * 2 * Math.PI)); },
    extra: (T, g, p, tp) => { const c = T(tp.at(0.24, 24)); return arrow(`M${f1(c[0])} ${f1(c[1] - 4)}L${f1(c[0])} ${f1(c[1] + 9)}`, p.gBelly) + arrow(`M${f1(c[0])} ${f1(c[1] + 9)}L${f1(c[0])} ${f1(c[1] - 2)}`, (p.inh || 0) * (1 - (p.gBelly || 0))); } },
  { id: 'k', plain: true, palmDown: true, grip: 'F', aria: 'Pomarańczowo: pośladek tylnej nogi i dół brzucha pracują. Niebieskie paski: przód biodra tylnej nogi (zginacze biodra) się rozciąga. Strzałka: miednica podwija się pod siebie i przesuwa lekko do przodu, dół pleców się nie wygina. Dłonie obejmują przednie kolano.', n: 'Rozciąganie przodu biodra w klęku', dose: 'bez bólu; łącznie ok. 60 s na stronę', src: 'BMC 2024', hx: 96, hy: kneeHy, ground: mat(176, 8, 190), floorY: 185, period: 12, stillAt: 7.2,
    keysAt: [[0.6, 'Start: tułów prosto, tylne kolano na macie'], [3, 'Napnij pośladek i dół brzucha'], [7.2, 'Podwiń miednicę, lekko do przodu']],
    keys: [
      { at: 0, p: P({ thF: frontTh, knF: frontTh, ftF: 90, thN: kneeTh, knN: kneeTh + 90, ftN: -90, shN: 34, elN: 10, hsN: 14, shF: 38, elF: 8, hsF: 14, tilt: 9, lord: 1, belly: 0.45, hd: 4 }), l: 'Klęk jednonóż: tylne kolano na macie, tułów prosto' },
      { at: 1.6, p: 'same', l: 'Napnij pośladek tylnej nogi i dół brzucha' },
      { at: 2.6, p: { gGlute: 1, gBelly: 1 }, l: 'Napnij pośladek tylnej nogi i dół brzucha' },
      { at: 3.6, p: 'same', l: 'Podwiń miednicę i przesuń ją lekko do przodu; dół pleców się nie wygina' },
      { at: 5.4, p: { tilt: -13, lord: 0, tor: -1.5, gHipN: 1, gGlute: 0, gBelly: 0, belly: 0.2, ...kneelFwd(5) }, l: 'Czujesz rozciąganie z przodu biodra tylnej nogi; pośladek i brzuch nadal napięte, bez bólu' },
      { at: 9.6, p: 'same', l: 'Rozluźnij' },
      { at: 11.2, p: { tilt: 9, lord: 1, tor: 0, gHipN: 0, belly: 0.45, dx: 0, dy: 0, thN: kneeTh, knN: kneeTh + 90, thF: frontTh, knF: frontTh }, l: 'Rozluźnij' },
      { at: 12, p: null }],
    sec: (t, p) => { if (t > 3.6 && t < 5.4) { const u = (t - 3.6) / 1.8; p.gGlute = p.gBelly = 1 - ease(clamp(u * 2)); p.gHipN = ease(clamp(u * 2 - 1)); } },
    extra: (T, g, p) => {
      const o = clamp((9 - p.tilt) / 22), c = T(add(g.H, g.f, -20));
      return arrow(`M${f1(c[0] + 3)} ${f1(c[1] - 16)}Q${f1(c[0] - 9)} ${f1(c[1] + 2)} ${f1(c[0] + 7)} ${f1(c[1] + 15)}`, clamp(o * 3)); } }
];
for (const ex of EX) { let prev = ex.keys[0].p; for (const k of ex.keys) { if (k.p === 'same') k.p = { ...prev }; else if (k.p === null) k.p = { ...ex.keys[0].p }; else if (!('rot' in k.p)) k.p = { ...prev, ...k.p }; prev = k.p; if (!k.l) k.l = ex.keys[0].l; } }

// Chwyt: nadgarstek trzyma stałe położenie wobec kolana ex.grip (z pozy startowej); bark i łokieć z odwrotnej kinematyki, łokieć zgięty w tę samą stronę
function holdGrip(ex, p) {
  const p0 = ex.keys[0].p, g0 = rig(p0), g = rig(p), k0 = g0[ex.grip].k, k = g[ex.grip].k;
  for (const [s, e, A0, A] of [['shN', 'elN', g0.aN, g.aN], ['shF', 'elF', g0.aF, g.aF]]) {
    const tw = [k[0] + A0.w[0] - k0[0], k[1] + A0.w[1] - k0[1]], vx = tw[0] - A.s[0], vy = tw[1] - A.s[1], D2 = vx * vx + vy * vy;
    const c = Math.max(-1, Math.min(1, (D2 - L.ua * L.ua - L.fa * L.fa) / (2 * L.ua * L.fa))), el = Math.sign(p0[e] || 1) * Math.acos(c) / RD;
    const sh = Math.atan2(vx, vy) / RD - Math.atan2(L.fa * S(el), L.ua + L.fa * C(el)) / RD;
    p[e] = el; p[s] = sh;
  }
}
function poseAt(ex, t) {
  const K = ex.keys; let i = 0; while (i < K.length - 2 && t >= K[i + 1].at) i++;
  const a = K[i], b = K[i + 1], u = ease(clamp((t - a.at) / (b.at - a.at))), o = {};
  for (const k in a.p) o[k] = a.p[k] + (b.p[k] - a.p[k]) * u;
  if (ex.sec) ex.sec(t, o);
  if (ex.grip) holdGrip(ex, o);
  return { p: o, i };
}

window.SYL = { drawRaw: drawRaw, EX: EX, P: P, poseAt: poseAt };
})();
