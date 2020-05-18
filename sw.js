var CACHE_NAME = 'movie-site-cache-v1';
var urlsToCache = [
  '/',
  '/fallback.json',
  '/css/main.css',
  '/js/main.js',
  '/js/jquery.min.js',
  '/images/ic_launcher.png'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Install service worker cache opened.');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {

  var request = event.request
  var url = new URL(request.url)

  if(url.origin == location.origin) {
    event.respondWith(
      caches.match(request).then(function(response){
        return response || fetch(request)
      })
    )
  }else{
    event.respondWith(
      caches.open('movies-cache').then(function(cache){
        return fetch(request).then(function(liveResponse){
          cache.put(request, liveResponse.clone())
          return liveResponse
        }).catch(function(){
          return caches.match(request).then(function(response){
            if(response) return response
            return caches.match('/fallback.json')
          })
        })
      })
    )
  }
});
   /* event.respondWith(
      caches.open('movies-cache').then(function(cache){
        return fetch(request).then(function(liveResponse){
          cache.put(request, liveResponse.clone())
          return liveResponse
        }).catch(function(){
          return caches.match(request).then(function(response){
            if(response) return response
            return caches.match('/fallback.json')
          })
        })
      })
    }*/

self.addEventListener('activate', function(event) {

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheNames){
          return  cacheNames != CACHE_NAME
        }).map(function(cacheNames){
          return caches.delete(cacheNames)
        })
      );
    })
  );
});