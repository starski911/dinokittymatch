/* Super Match service worker: offline play via precache + runtime caching. */
const VERSION = 'v1';
const SHELL_CACHE = `super-match-shell-${VERSION}`;
const RUNTIME_CACHE = `super-match-runtime-${VERSION}`;
// Hosts often send `Vary: Origin`; module scripts send an Origin header, so ignore Vary when matching.
const MATCH = { ignoreVary: true };
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png'];

/** Precache the shell plus every hashed JS/CSS/SVG asset the build references. */
async function precache() {
  const cache = await caches.open(SHELL_CACHE);
  await cache.addAll(SHELL);
  try {
    const html = await (await fetch('/index.html', { cache: 'no-store' })).text();
    const found = new Set(html.match(/\/assets\/[\w.-]+\.(?:js|css)/g) || []);
    for (const path of [...found]) {
      if (!path.endsWith('.js')) continue;
      const js = await (await fetch(path)).text();
      for (const m of js.match(/assets\/[\w.-]+\.svg/g) || []) found.add('/' + m);
    }
    await Promise.all([...found].map((u) => cache.add(u).catch(() => {})));
  } catch (e) {
    /* offline during install: runtime caching will fill in later */
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => ![SHELL_CACHE, RUNTIME_CACHE].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!sameOrigin && !isFont) return;

  // Page navigations: network first, fall back to the cached app shell when offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((c) => c.put('/index.html', copy));
          return res;
        })
        .catch(() => caches.match('/index.html', MATCH).then((r) => r || caches.match('/', MATCH))),
    );
    return;
  }

  // Static assets & fonts: stale-while-revalidate.
  event.respondWith(
    caches.open(RUNTIME_CACHE).then(async (cache) => {
      const cached = (await cache.match(req, MATCH)) || (await caches.match(req, MATCH));
      const network = fetch(req)
        .then((res) => {
          if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
