// UX Mind moved to https://uxmind.ankitpassi.in/.
// Earlier visitors to /uxmind/ have the app's offline service worker installed, which would keep
// serving the cached copy here instead of the redirect. Browsers re-check this file, find this
// version, and it removes itself: clear the caches, unregister, and reload open tabs so they
// pick up the redirect page.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.registration.unregister();
      const tabs = await self.clients.matchAll({ type: 'window' });
      tabs.forEach((tab) => tab.navigate(tab.url));
    })(),
  );
});
