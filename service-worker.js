const CACHE_NAME = 'smart-attendance-v1';
const urlsToCache = [
  '/Smart-Attendance-System/',
  '/Smart-Attendance-System/index.html',
  '/Smart-Attendance-System/brkwd.jpg',
  '/Smart-Attendance-System/icon-192.png',
  '/Smart-Attendance-System/icon-512.png'
];

// تثبيت Service Worker وحفظ الملفات
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('تم فتح الذاكرة المؤقتة');
        return cache.addAll(urlsToCache);
      })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('حذف ذاكرة قديمة:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// التعامل مع الطلبات (Offline First)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا موجود في الذاكرة، استخدمه
        if (response) {
          return response;
        }
        
        // إذا لا، جرب من الإنترنت
        return fetch(event.request).then(response => {
          // تحقق من صحة الرد
          if (!response || response.status !== 200) {
            return response;
          }
          
          // احفظ نسخة في الذاكرة
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        });
      })
  );
});

// مزامنة في الخلفية (Background Sync)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // هنا يتم مزامنة البيانات المحلية مع Firebase
  console.log('مزامنة البيانات...');
}
