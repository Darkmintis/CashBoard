/**
 * KashBoard Service Worker
 * Basic offline functionality and caching
 */

const CACHE_NAME = 'kashboard-v1';

// Files to cache for offline use
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/css/normalize.css',
  '/css/styles.css',
  '/css/components.css',
  '/css/dashboard.css',
  '/js/app.js',
  '/js/utils/storage.js',
  '/js/models/models.js',
  '/js/services/dataService.js',
  '/js/services/kashbotService.js',
  '/js/components/ui.js',
  '/js/components/charts.js',
  '/manifest.json'
];

// Install event - cache files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((thisCacheName) => {
          if (thisCacheName !== CACHE_NAME) {
            return caches.delete(thisCacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
