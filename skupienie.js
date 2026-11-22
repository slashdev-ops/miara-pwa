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
  globalThis.SKUP = { queue, later };
})();
