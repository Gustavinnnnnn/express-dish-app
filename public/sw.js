// Service Worker mínimo só pra habilitar instalação como PWA.
// Não faz cache agressivo pra evitar conflitos com builds novas.
const VERSION = "v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // network-first simples; deixa o navegador tratar normalmente
  return;
});
