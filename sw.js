// Service worker: app shell cached for offline use; lessons are cached as they're fetched.
// New content packs are fetched network-first so updates arrive automatically.
const VERSION = 'trial-v1';
const SHELL = ['./', './index.html', './css/app.css', './manifest.webmanifest',
  './js/app.js', './js/util.js', './js/store.js', './js/engine.js', './js/content.js', './js/session.js', './js/keypad.js', './js/scratch.js', './js/parent.js', './js/sync.js', './js/mathcheck.js',
  './vendor/katex/katex.min.js', './vendor/katex/katex.min.css', './vendor/marked.min.js', './vendor/firebase.js',
  './vendor/fonts/atkinson-hyperlegible-latin-400-normal.woff2', './vendor/fonts/atkinson-hyperlegible-latin-700-normal.woff2',
  './vendor/fonts/source-serif-4-latin-400-normal.woff2', './vendor/fonts/source-serif-4-latin-600-normal.woff2', './vendor/fonts/source-serif-4-latin-400-italic.woff2',
  './content/course.json', './content/manifest.json', './icons/icon-192.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  const networkFirst = url.pathname.includes('/content/') || url.pathname.endsWith('/js/app.js') || url.pathname.endsWith('.html') || url.pathname.endsWith('/');
  if (networkFirst) {
    e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
  } else {
    e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((r) => { const copy = r.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy)); return r; })));
  }
});
