/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-8d0d8005'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "pwa-maskable-512x512.png",
    "revision": "2bd5d57c8fa460261170e346360fa350"
  }, {
    "url": "pwa-512x512.png",
    "revision": "68405d0bc6f87f1f5e7ddd643ae4ae57"
  }, {
    "url": "pwa-192x192.png",
    "revision": "035f6306f1644a4a930c5d1ba6b297f6"
  }, {
    "url": "index.html",
    "revision": "7496b2144aff6326ec1ed07fa0751259"
  }, {
    "url": "favicon.png",
    "revision": "71b5162430cac246d5e0c5c649775b35"
  }, {
    "url": "favicon.ico",
    "revision": "5e192a0861e236ccc8af470840924c19"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "5ac5f605378dd733a0189075ec1ac525"
  }, {
    "url": "404.html",
    "revision": "d60e17824a55358752d42b0e100a5e25"
  }, {
    "url": "assets/workbox-window.prod.es5-BBnX5xw4.js",
    "revision": null
  }, {
    "url": "assets/index-LjS9B0vc.js",
    "revision": null
  }, {
    "url": "assets/index-CJzzTWjP.css",
    "revision": null
  }, {
    "url": "assets/aistudio/index_51b4d7b8.html",
    "revision": null
  }, {
    "url": "assets/aistudio/image_d904e33a.png",
    "revision": null
  }, {
    "url": "assets/aistudio/image_d7de9992.png",
    "revision": null
  }, {
    "url": "assets/aistudio/image_a6a9958e.png",
    "revision": null
  }, {
    "url": "assets/aistudio/image_992b90f9.png",
    "revision": null
  }, {
    "url": "assets/aistudio/image_8a885566.png",
    "revision": null
  }, {
    "url": "assets/aistudio/image_799fbca7.png",
    "revision": null
  }, {
    "url": "assets/aistudio/image_4220d01d.png",
    "revision": null
  }, {
    "url": "assets/aistudio/image_0d88ec63.png",
    "revision": null
  }, {
    "url": "assets/aistudio/Mockup_elegante_da_Voz_da_F__f7d7ef7a.png",
    "revision": null
  }, {
    "url": "assets/aistudio/Mockup_do_App_Voz_da_F__319fd1a6.png",
    "revision": null
  }, {
    "url": "assets/aistudio/Logotipo_Dourado_Voz_da_F__4a6f8aec.png",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "5ac5f605378dd733a0189075ec1ac525"
  }, {
    "url": "favicon.ico",
    "revision": "5e192a0861e236ccc8af470840924c19"
  }, {
    "url": "favicon.png",
    "revision": "71b5162430cac246d5e0c5c649775b35"
  }, {
    "url": "pwa-192x192.png",
    "revision": "035f6306f1644a4a930c5d1ba6b297f6"
  }, {
    "url": "pwa-512x512.png",
    "revision": "68405d0bc6f87f1f5e7ddd643ae4ae57"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "2bd5d57c8fa460261170e346360fa350"
  }, {
    "url": "manifest.json",
    "revision": "5fefaa0e9d8acb9b6f4c67e3be79f113"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("/index.html"), {
    denylist: [/^\/api/]
  }));
  workbox.registerRoute(({
    request
  }) => request.mode === "navigate", new workbox.NetworkFirst({
    "cacheName": "app-pages-cache",
    "networkTimeoutSeconds": 3,
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 2592000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(({
    url
  }) => url.origin === self.location.origin && !url.pathname.startsWith("/api/"), new workbox.NetworkFirst({
    "cacheName": "app-routes-cache",
    "networkTimeoutSeconds": 3,
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 100,
      maxAgeSeconds: 2592000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
