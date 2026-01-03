const CACHE_NAME = 'cognixis-v20';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/party-mode.css',
  '/js/languages/en.js',
  '/js/languages/es.js',
  '/js/languages/fr.js',
  '/js/i18n.js',
  '/js/utils.js',
  '/js/storage.js',
  '/js/streak.js',
  '/js/games-list.js',
  '/js/game-limit.js',
  '/js/simple-games.js',
  '/js/game-modes.js',
  '/js/commitment-screen.js',
  '/js/milestones.js',
  '/js/onboarding.js',
  '/js/failure-handling.js',
  '/js/unlock-system.js',
  '/js/stats.js',
  '/js/game.js',
  '/js/ui.js',
  '/js/room-manager.js',
  '/js/party-ui.js',
  '/js/app.js'
];

self.addEventListener('install', event => {
  // Skip waiting to activate immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  // Network first, then cache
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener('activate', event => {
  // Claim clients immediately
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        );
      })
    ])
  );
});
