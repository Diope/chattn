/* eslint-disable no-undef */
workbox.setConfig({
  debug: true
});

workbox.routing.registerRoute(
  new RegExp(
    "https://firebasestorage.googleapis.com/v0/b/chattn-who.appspot.com"
  ),
  new workbox.strategies.CacheFirst({
    cacheName: "Images via Firebase Storage ",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "static-resources"
  })
);

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
