const CACHE_NAME = "heartspace-cache-v2";
const ASSETS_TO_CACHE = [
    "./",
"./index.html",
"./index.js",
"./index.wasm",
"./index.pck",
"./icon.svg"
];

// Instalação do Service Worker e Armazenamento Agressivo em Cache
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("☁️ [PWA Service Worker] Mapeando e armazenando binários em Cache Estável...");
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

// Ativação e limpeza de caches antigos da Godot
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log("🗑️ [PWA Service Worker] Destruindo cache zumbi antigo:", key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Estratégia Cache-First: Entrega instantânea, economizando largura de banda do Supabase
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse; // Retorno em 0 milissegundos!
            }
            return fetch(event.request);
        })
    );
});
