/* SkipStone service worker: offline after the first visit.
   The build (vite.config.js) fills in VERSION and the list of every built file, so the whole game
   (code, stone scan, rock models, icons) is cached on install. Fonts are cached the first time they load. */
const VERSION = '1793102602007';
const PRECACHE = [
 "./assets/index-2mB-oxFo.js",
 "./assets/index-BZ0gqWa7.css",
 "./assets/models/namaqualand_boulder_02/namaqualand_boulder_02.bin",
 "./assets/models/namaqualand_boulder_02/namaqualand_boulder_02.gltf",
 "./assets/models/namaqualand_boulder_02/textures/namaqualand_boulder_02_arm_1k.jpg",
 "./assets/models/namaqualand_boulder_02/textures/namaqualand_boulder_02_diff_1k.jpg",
 "./assets/models/namaqualand_boulder_02/textures/namaqualand_boulder_02_nor_gl_1k.jpg",
 "./assets/models/rock_moss_set_01/rock_moss_set_01.bin",
 "./assets/models/rock_moss_set_01/rock_moss_set_01.gltf",
 "./assets/models/rock_moss_set_01/textures/rock_moss_set_01_diff_1k.jpg",
 "./assets/models/rock_moss_set_01/textures/rock_moss_set_01_nor_gl_1k.jpg",
 "./assets/models/rock_moss_set_01/textures/rock_moss_set_01_rough_1k.jpg",
 "./assets/stone/rock_surface_diff_1k.jpg",
 "./assets/stone/rock_surface_nor_gl_1k.jpg",
 "./assets/stone/rock_surface_rough_1k.jpg",
 "./icons/icon-180.png",
 "./icons/icon-192.png",
 "./icons/icon-512.png",
 "./icons/icon-maskable-512.png",
 "./index.html",
 "./manifest.webmanifest"
];
const CACHE = 'skipstone-' + VERSION;
const FONTS = 'skipstone-fonts';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('skipstone-') && k !== CACHE && k !== FONTS).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // fonts: cache first, fill on first use
  if (url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONTS).then((c) => c.match(req).then((hit) => hit || fetch(req).then((res) => { c.put(req, res.clone()); return res; }))));
    return;
  }
  if (url.origin !== location.origin || !url.pathname.startsWith(new URL('./', self.registration.scope).pathname)) return;
  // the page: network first so updates arrive, cache when offline
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((res) => { caches.open(CACHE).then((c) => c.put('./index.html', res.clone())); return res; }).catch(() => caches.match('./index.html')));
    return;
  }
  // everything else is versioned by the build: cache first
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; })));
});
