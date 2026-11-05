// Test dymny: uruchamia app.js z atrapą DOM i sprawdza widoki oraz spójność danych.
// Uruchom: node tests/smoke.js   (kod wyjścia 1 przy błędzie)
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const els = {};
const mk = (id) => els[id] || (els[id] = { id, innerHTML: '', textContent: '', value: '', checked: false, style: {}, classList: { add() {}, remove() {} } });
const sandbox = {
  document: { getElementById: mk, querySelector: () => null, addEventListener() {} },
  window: { scrollTo() {} },
  localStorage: { getItem: () => null, setItem() {} },
  navigator: {},
  console, setTimeout, clearTimeout, setInterval, clearInterval, Date, Math, JSON, Promise, URL, Blob,
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(code + '\n;globalThis.__T={S:()=>S,render,MEALS,STEPS,PLAN,ING,LABS};', sandbox);
const T = sandbox.__T;

let ok = 0, bad = 0;
const check = (name, cond, info) => { if (cond) ok++; else bad++; console.log((cond ? 'OK   ' : 'BLAD ') + name + (info ? ' -> ' + info : '')); };

check('index.html: brak skryptów i stylów wstawionych w HTML (CSP)', !/<script>|<style>|\son[a-z]+=/i.test(html));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
const missing = manifest.icons.map((i) => i.src).concat(['icons/apple-touch-icon.png']).filter((f) => !fs.existsSync(path.join(root, f)));
check('manifest: nazwa Miara i wszystkie ikony istnieją', manifest.name === 'Miara' && !missing.length, missing.join(', '));
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const swMissing = [...sw.matchAll(/'\.\/([^']+)'/g)].map((m) => m[1]).filter((f) => f && !fs.existsSync(path.join(root, f)));
check('service worker: każdy plik z listy istnieje', !swMissing.length, swMissing.join(', '));
check('zgodność danych: klucz pamięci i identyfikator kopii bez zmian', code.includes("'talerz-trening-v1'") && code.includes("app:'talerz-i-trening'"));
check('app.js: brak atrybutów on...= (CSP)', !/\son[a-z]+=["']/i.test(code));
check('każde danie ma kroki przygotowania', T.MEALS.every((m) => Array.isArray(T.STEPS[m.id]) && T.STEPS[m.id].length >= 2));
check('każdy składnik dania istnieje w bazie', T.MEALS.every((m) => m.ing.every(([id]) => T.ING[id])));
check('plan tygodnia wskazuje istniejące dania', Object.values(T.PLAN).every((d) => d.every((id) => T.MEALS.some((m) => m.id === id))));
check('kroki bez płyty grzewczej', !T.MEALS.some((m) => /patel|smaż|garn|płyt/i.test(T.STEPS[m.id].join(' '))));

const views = ['meals', 'train', 'day', 'health', 'set', 'sos', 'labs', 'intro', 'review', 'recipe', 'knee', 'impact', 'challenge'];
let renderErr = '';
for (const tab of views) for (const sex of ['K', 'M']) for (const mode of ['redukcja', 'utrzymanie']) {
  const S = T.S(); S.onb = true; S.tab = tab; S.sex = sex; S.mode = mode; S.recipe = 'o1';
  try { T.render(); if (!els.main || !els.main.innerHTML) renderErr = renderErr || `${tab}/${sex}/${mode}: pusty widok`; }
  catch (e) { renderErr = renderErr || `${tab}/${sex}/${mode}: ${e.message}`; }
}
check(`${views.length} widoków × 2 płcie × 2 tryby bez błędu`, !renderErr, renderErr);

console.log(`WYNIK: ${ok} OK, ${bad} BLAD`);
process.exit(bad ? 1 : 0);
