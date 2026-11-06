/* TurnierPro Service Worker
 *
 * Strategie:
 *   - Seiten (index.html und die Rechtstexte): NETWORK FIRST.
 *     So bekommt jeder Nutzer beim naechsten Start automatisch die aktuelle
 *     Version. Der Cache dient nur noch als Offline-Fallback. Jede Seite wird
 *     unter ihrem eigenen Namen gespeichert (frueher landete jede Navigation,
 *     z. B. datenschutz.html, faelschlich als index.html im Cache).
 *   - Uebrige Assets (Icons, lib/): CACHE FIRST,
 *     da sie sich praktisch nie aendern und offline sofort da sein muessen.
 */
const CACHE_NAME = 'turnierpro-v1.2';
const SHELL = './index.html';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './image.png',
  './icon_maskable.png',
  './datenschutz.html',
  './impressum.html',
  './datenschutz-en.html',
  './impressum-en.html',
  './lib/tp-zxing.js',
  './lib/tp-zxing.wasm'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      // einzeln cachen: eine fehlende Datei darf die Installation nicht kippen
      .then(cache => Promise.all(ASSETS.map(url => cache.add(url).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)))
      .then(() => self.clients.claim())
  );
});

function putInCache(request, response) {
  if (!response || !response.ok || response.type === 'opaque') return response;
  const copy = response.clone();
  caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => {});
  return response;
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const path = new URL(req.url).pathname;
  const isShell = path.endsWith('/') || path.endsWith('/index.html');
  const isPage = isShell || req.mode === 'navigate' || path.endsWith('.html');

  if (isPage) {
    // NETWORK FIRST - immer die neueste Seite, Cache nur als Fallback.
    // Die App selbst unter SHELL, alle anderen Seiten unter ihrer eigenen Adresse.
    const key = isShell ? SHELL : req;
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.ok && !res.redirected) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(key, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(key, { ignoreSearch: true })
          .then(hit => hit || (isShell ? caches.match('./') : caches.match(SHELL))))
    );
    return;
  }

  // CACHE FIRST fuer alles andere
  event.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req)
        .then(res => putInCache(req, res))
        .catch(() => undefined);
    })
  );
});
