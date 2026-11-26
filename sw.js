// Service worker: start z pamięci (27.11.2026). Odpowiedź od razu z kopii w telefonie, a w tle pobranie z sieci
// i odświeżenie kopii; bez kopii odpowiada sieć, bez sieci strona główna z pamięci. Gdy z sieci przyjdzie nowa wersja
// app.js albo strony głównej (inny ETag), okna dostają wiadomość „nowa-wersja” (komunikat z przyciskiem Odśwież).
// Wcześniej „najpierw sieć” bez limitu czasu: przy słabym zasięgu start czekał na serwer (czarny ekran).
// Zmiana CACHE czyści stare kopie z pamięci podręcznej; zmieniaj ją przy większych wydaniach (patrz README).
const CACHE = 'miara-v5';
const ASSETS = [
  './',
  './index.html',
  './app.css',
  './app.js',
  './pet.js',
  './zdarzenia.js',
  './sygnaly.js',
  './wpisy.js',
  './skupienie.js',
  './sw-register.js',
  './manifest.webmanifest',
  './brand/miara-favicon.svg?v=2',
  './icons/icon-192.png?v=2',
  './icons/icon-512.png?v=2',
  './icons/apple-touch-icon.png?v=2',
  './fonts/fraunces-latin-600-normal.woff2',
  './fonts/fraunces-latin-ext-600-normal.woff2'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(caches.match(req).then((hit) => {
    const net = fetch(req).then((res) => {
      if (res && res.ok) {
        const copy = res.clone();
        const done = caches.open(CACHE).then((c) => c.put(req, copy)).then(() => {
          if (hit && WATCH.test(new URL(req.url).pathname) && etag(hit) && etag(res) && etag(hit) !== etag(res)) return tell();
        });
        if (e.waitUntil) e.waitUntil(done);
      }
      return res;
    });
    if (hit) { net.catch(() => {}); return hit; }
    return net.catch(() => caches.match('./index.html'));
  }));
});

// Pliki, których nowa wersja oznacza nowe wydanie aplikacji
const WATCH = /\/(index\.html|app\.js)?$/;
const etag = (r) => (r && r.headers && r.headers.get ? r.headers.get('ETag') : null);
function tell() {
  return self.clients.matchAll({ type: 'window' }).then((cs) => cs.forEach((c) => c.postMessage({ type: 'nowa-wersja' })));
}
