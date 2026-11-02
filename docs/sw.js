const CACHE_NAME = 'vozdafe-v1';
const urlsToCache = [
  '/',
  '/index.html'
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
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match('/');
      }
    })
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
