// Tryb skupienia (F1a planu ADHD, 22.11.2026): kolejka zadań Mojego dnia jako czyste funkcje; widok i zapis są w app.js.
// queue(items, skip): items = [{id, done}], skip = id odłożone „Później” w kolejności odkładania.
// Zwraca {todo, done}: najpierw zadania nieodłożone w kolejności items, potem odłożone; zrobione osobno (WCAG 2.2.4: odłożenie bez kary).
(function () {
  function queue(items, skip) {
    const L = Array.isArray(items) ? items : [], open = L.filter((x) => !x.done).map((x) => x.id);
    const sk = (Array.isArray(skip) ? skip : []).filter((id) => open.includes(id));
    return { todo: open.filter((id) => !sk.includes(id)).concat(sk), done: L.filter((x) => x.done).map((x) => x.id) };
  }
  // „Później”: zadanie na koniec odłożonych (ponowne odłożenie przesuwa je znowu na sam koniec)
  function later(skip, id) { return (Array.isArray(skip) ? skip : []).filter((x) => x !== id).concat([id]); }
  // F1b (23.11.2026): w Skupieniu zostaje na wierzchu to, co przed pierwszym nagłówkiem, i główna karta (od jej nagłówka do następnego);
  // reszta trafia do zwiniętego „Więcej na tym ekranie” w tej samej kolejności (nic nie znika, COGA 4.6.3). Sekcje bywają gołym <h2>
  // albo blokiem z <h2> w środku, więc podział na drzewie strony po narysowaniu. Zwraca liczbę przeniesionych elementów.
  function fold(root, title, key, open, label) {
    if (!root || !root.children || typeof document === 'undefined' || !document.createElement) return 0;
    const kids = Array.from(root.children), h2 = (el) => (el.tagName === 'H2' ? el : el.querySelector && el.querySelector(':scope > h2'));
    const heads = kids.map((el, i) => (h2(el) ? i : -1)).filter((i) => i >= 0);
    const mi = heads.find((i) => h2(kids[i]).textContent.trim().indexOf(title) === 0);
    if (mi == null) return 0;
    const nx = heads.find((i) => i > mi), end = nx == null ? kids.length : nx, keep = new Set(kids.slice(0, heads[0]).concat(kids.slice(mi, end)));
    const rest = kids.filter((el) => !keep.has(el));
    if (!rest.length) return 0;
    const d = document.createElement('details'), s = document.createElement('summary');
    d.className = 'fold skup-more'; d.dataset.fold = key; d.open = !!open; s.textContent = label; d.appendChild(s);
    rest.forEach((el) => d.appendChild(el));
    kids[end - 1].after(d);
    return rest.length;
  }
  // Przejście do miejsca (goto, link zakładka#id): otwiera wszystkie zamknięte sekcje nad celem, żeby cel był widoczny i dostał fokus
  function reveal(el) { let n = 0; for (let p = el && el.parentElement; p; p = p.parentElement) if (p.tagName === 'DETAILS' && !p.open) { p.open = true; n++; } return n; }
  globalThis.SKUP = { queue, later, fold, reveal };
})();
