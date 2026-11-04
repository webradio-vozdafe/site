const CACHE_NAME = 'vozdafe-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/') || event.request.url.includes('audio') || event.request.url.includes('stream')) {
    return;
  }

  // NetworkFirst strategy for navigation routes and HTML pages
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match('/') || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // NetworkFirst fallback for application resources, falling back to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Background Sync for offline scheduled reminders / prayer requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-prayer-requests') {
    event.waitUntil(
      // Perform background sync logic or notify clients
      console.log('Background sync triggered for prayer requests')
    );
  }
});

// Push notification listener
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Voz da Fé', body: 'Nova transmissão ao vivo iniciada!' };
  const options = {
    body: data.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico'
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
