// Service Worker for Portfolio Website
// Provides offline support and intelligent caching

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `portfolio-${CACHE_VERSION}`;

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/blog.html',
  '/404.html',
  '/dist/css/bundle.min.css',
  '/dist/css/blog-bundle.min.css',
  '/dist/js/main.min.js',
  '/dist/sprite.svg'
];

// Font files to cache
const FONT_ASSETS = [
  '/fonts/playfair-display/playfair-display-latin-500-normal.woff2',
  '/fonts/playfair-display/playfair-display-latin-600-normal.woff2',
  '/fonts/inter/inter-latin-400-normal.woff2',
  '/fonts/inter/inter-latin-500-normal.woff2',
  '/fonts/inter/inter-latin-600-normal.woff2'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll([...STATIC_ASSETS, ...FONT_ASSETS]);
      })
      .then(() => {
        console.log('[ServiceWorker] Install complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[ServiceWorker] Install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName.startsWith('portfolio-') && cacheName !== CACHE_NAME;
            })
            .map((cacheName) => {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (external resources)
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[ServiceWorker] Serving from cache:', request.url);
          return cachedResponse;
        }

        // Not in cache - fetch from network
        return fetch(request)
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the fetched resource
            caches.open(CACHE_NAME)
              .then((cache) => {
                // Only cache same-origin requests
                if (url.origin === location.origin) {
                  console.log('[ServiceWorker] Caching new resource:', request.url);
                  cache.put(request, responseToCache);
                }
              });

            return response;
          })
          .catch((error) => {
            console.error('[ServiceWorker] Fetch failed:', error);

            // Return offline page if available
            if (request.mode === 'navigate') {
              return caches.match('/404.html');
            }

            throw error;
          });
      })
  );
});

// Message event - for cache updates from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME)
      .then(() => {
        console.log('[ServiceWorker] Cache cleared');
        event.ports[0].postMessage({ success: true });
      });
  }
});
