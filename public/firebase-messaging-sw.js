// 서비스 워커 파일
self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function () {
  console.log("fcm sw activate");
});

self.addEventListener('push', function(event) {
  const jsonData = event.data.json();
  console.log(jsonData)
  const options = {
    body: jsonData.data.message,
    icon: 'favicon.ico',
    badge: 'favicon.ico'
  };
  event.waitUntil(
      self.registration.showNotification('Melody&Voice 알림', options)
  );
});
