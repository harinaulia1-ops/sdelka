const CACHE='sdelka-v5'
const ASSETS=['/sdelka/','/sdelka/index.html']
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}))
  self.skipWaiting()
})
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))))
  self.clients.claim()
})
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)))
})
self.addEventListener('push',e=>{
  const d=e.data?e.data.json():{title:'Сделка CRM',body:'Новое уведомление'}
  e.waitUntil(self.registration.showNotification(d.title||'Сделка CRM',{
    body:d.body||'',icon:'/sdelka/icon-192.png',badge:'/sdelka/icon-192.png',vibrate:[200,100,200],tag:d.tag||'sdelka',data:d
  }))
})
self.addEventListener('notificationclick',e=>{
  e.notification.close()
  e.waitUntil(clients.openWindow('/sdelka/'))
})
