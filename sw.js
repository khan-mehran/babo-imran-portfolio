/* Rafiq-e-Hujjaj Guide — Service Worker (basic offline shell cache) */
const CACHE = 'rhc-v1';
const PRECACHE = [
  '/',
  '/index.html',
  '/booklet.html',
  '/videos.html',
  '/download.html',
  '/css/style.css',
  '/js/main.js',
  '/assets/arabesque.svg',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
