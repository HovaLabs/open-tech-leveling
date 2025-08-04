// Service Worker for Open Tech Leveling
// Implements efficient caching strategies

const CACHE_NAME = "open-tech-leveling-v1.0.0";
const STATIC_CACHE_NAME = "static-v1.0.0";
const DYNAMIC_CACHE_NAME = "dynamic-v1.0.0";

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/index.css?v=1.0.0",
  "/cookie-banner.js?v=1.0.0",
  "/opentechleveling.svg?v=1.0.0",
  "/mobile.svg?v=1.0.0",
  "/hovalabs.svg?v=1.0.0",
  "/favicon.ico",
];

// Cache strategies by file type
const CACHE_STRATEGIES = {
  html: "networkFirst",
  css: "cacheFirst",
  js: "cacheFirst",
  images: "cacheFirst",
  fonts: "cacheFirst",
};

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return (
                cacheName.startsWith("open-tech-leveling-") &&
                cacheName !== CACHE_NAME &&
                cacheName !== STATIC_CACHE_NAME &&
                cacheName !== DYNAMIC_CACHE_NAME
              );
            })
            .map((cacheName) => {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only handle GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip cross-origin requests except fonts
  if (url.origin !== location.origin && !isFontRequest(event.request)) {
    return;
  }

  event.respondWith(handleRequest(event.request));
});

// Handle different types of requests
async function handleRequest(request) {
  const url = new URL(request.url);
  const extension = getFileExtension(url.pathname);

  // Determine cache strategy based on file type
  if (isHTMLRequest(request)) {
    return networkFirst(request, DYNAMIC_CACHE_NAME);
  } else if (isStaticAsset(extension)) {
    return cacheFirst(request, STATIC_CACHE_NAME);
  } else {
    return networkFirst(request, DYNAMIC_CACHE_NAME);
  }
}

// Cache first strategy - good for static assets
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log("Cache first failed:", error);
    return new Response("Offline content not available", { status: 503 });
  }
}

// Network first strategy - good for HTML content
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log("Network first falling back to cache:", error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response("Content not available offline", { status: 503 });
  }
}

// Helper functions
function getFileExtension(pathname) {
  return pathname.split(".").pop().toLowerCase();
}

function isHTMLRequest(request) {
  return request.headers.get("accept").includes("text/html");
}

function isStaticAsset(extension) {
  const staticExtensions = [
    "css",
    "js",
    "png",
    "jpg",
    "jpeg",
    "gif",
    "svg",
    "ico",
    "webp",
    "woff",
    "woff2",
    "ttf",
    "otf",
  ];
  return staticExtensions.includes(extension);
}

function isFontRequest(request) {
  const fontExtensions = ["woff", "woff2", "ttf", "otf", "eot"];
  const url = new URL(request.url);
  const extension = getFileExtension(url.pathname);
  return fontExtensions.includes(extension);
}
