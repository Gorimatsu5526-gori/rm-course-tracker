// App shell only. Race data stays in localStorage, not the cache.
const CACHE_NAME = 'rm-track-pwa-v4';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', event => {event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));});
self.addEventListener('activate', event => {event.waitUntil(Promise.all([caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('rm-track-pwa-') && k !== CACHE_NAME).map(k => caches.delete(k)))), self.clients.claim()]));});
self.addEventListener('fetch', event => {const req = event.request; if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
 event.respondWith(fetch(req).then(response => { if (response.ok) {const copy=response.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(req,copy));} return response; }).catch(()=>caches.match(req).then(hit=>hit || (req.mode==='navigate' ? caches.match('./index.html') : Response.error()))));
});
