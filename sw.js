const CACHE = 'dhbw-vs-study-hub-v0.3.0';
const FILES = ['./','./index.html','./styles.css','./app.js','./core.js','./content.js','./study-material.js','./icon.svg','./manifest.webmanifest'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('dhbw-vs-study-hub-') && key!==CACHE).map(key=>caches.delete(key))))));
self.addEventListener('fetch',event=>{
  const url = new URL(event.request.url);
  if (event.request.method!=='GET' || url.origin!==self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  event.respondWith(fetch(event.request).then(response=>response).catch(()=>caches.match(event.request).then(cached=>cached || (event.request.mode==='navigate' ? caches.match('./index.html') : new Response('Offline: Datei nicht verfügbar.',{status:503})))));
});
