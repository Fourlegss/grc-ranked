/* Service worker: deixa o app funcionar offline. Com internet, sempre busca a versão mais nova. */
const VERSION = "grc-ranked-v4";
const SHELL = ["./","index.html","styles.css","app.js","content.js","sync.js","tutorial.js","config.js","manifest.webmanifest",
  "icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.hostname.endsWith("supabase.co")) return; // dados de sincronia sempre pela rede
  // Rede primeiro (atualizações chegam na hora); sem internet, usa a cópia salva.
  e.respondWith(caches.open(VERSION).then(async cache => {
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
      return res;
    } catch (err) {
      const hit = await cache.match(req, { ignoreSearch: url.origin === location.origin });
      return hit || Response.error();
    }
  }));
});
