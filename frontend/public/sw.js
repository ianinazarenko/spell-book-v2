// public/sw.js
self.addEventListener('install', () => {
    console.log('[Service Worker] Installed!');
    self.skipWaiting();
});

self.addEventListener('activate', () => {
    console.log('[Service Worker] Activated!');
    return self.clients.claim();
});

// Перехвачик запросов (пока просто пропускает всё в сеть)
self.addEventListener('fetch', () => {
    // Тут в будущем можно рулить кешем для офлайн-режима
});

self.addEventListener('push', (event) => {
    if (!event.data) {
        console.log('[Service Worker] Push event without data!');
        return;
    }

    try {
        const data = event.data.json();

        const title = data.title || 'Spell Book 🪄';
        const options = {
            body: data.body || 'Spell is completed! ✨',
            icon: '/icons/android-chrome-192x192.png', // Твоя иконка PWA из манифеста
            badge: '/icons/android-chrome-192x192.png',
            data: {
                url: data.url || '/', // Куда перейти при клике (например, /spells/job-id)
            },
        };

        // this is ineresting, is this the same registration?
        event.waitUntil(self.registration.showNotification(title, options));
    } catch (err) {
        console.error('Error handling Push Notification:', err);
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const targetUrl = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Если вкладка с PWA уже открыта — фокусируемся на ней
            for (let client of windowClients) {
                if (client.url.includes(targetUrl) && 'focus' in client) {
                    return client.focus();
                }
            }
            // Если PWA закрыто — открываем новую вкладку/окно PWA
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
