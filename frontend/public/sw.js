// public/sw.js
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installed!');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activated!');
    return self.clients.claim();
});

// Перехвачик запросов (пока просто пропускает всё в сеть)
self.addEventListener('fetch', (event) => {
    // Тут в будущем можно рулить кешем для офлайн-режима
});
