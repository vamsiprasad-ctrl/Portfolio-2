// Simple Service Worker for offline support
const CACHE_NAME = 'vamsi-portfolio-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './js/main.js',
  './assets/profile.jpg',
  './assets/favicon.ico',
  './assets/resume.pdf'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});
