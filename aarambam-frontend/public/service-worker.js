const CACHE_NAME = 'aarambam-offline-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // 1. IGNORE API CALLS (Let them go straight to the internet)
  // If we try to cache these, the login will fail!
  if (event.request.url.includes('/api/')) {
    return; 
  }

  // 2. Handle Static Files (Images, CSS, JS)
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
         // Return nothing if offline (prevents the crash error)
         return null; 
      });
    })
  );
});