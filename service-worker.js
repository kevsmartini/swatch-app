/* Swatch · service worker: precarga la app y la sirve sin conexión.
   Sube CACHE_VERSION cada vez que cambies algún archivo de la app. */
const CACHE_VERSION = "swatch-v4";

const APP_SHELL = [
  "./",
  "index.html",
  "styles.css",
  "scripts.js",
  "manifest.json",
  "fonts/gloock-latin.woff2",
  "fonts/figtree-latin.woff2",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Primero la caché; en segundo plano se refresca desde la red para la próxima visita.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_VERSION).then((cache) =>
      cache.match(req, { ignoreSearch: true }).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached || (req.mode === "navigate" ? cache.match("index.html") : Response.error()));
        return cached || network;
      })
    )
  );
});
