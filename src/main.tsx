import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

const isInIframe = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
})();

const host = window.location.hostname;
const isPreviewHost =
  host.includes("id-preview--") ||
  host.includes("lovableproject.com") ||
  host === "localhost" ||
  host === "127.0.0.1";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();

    if (isInIframe || isPreviewHost) {
      await Promise.all(registrations.map((registration) => registration.unregister()));
      return;
    }

    await Promise.all(
      registrations
        .filter((registration) => !registration.active?.scriptURL.includes("/sw.js?v=2"))
        .map((registration) => registration.unregister()),
    );

    navigator.serviceWorker
      .register("/sw.js?v=2", { scope: "/", updateViaCache: "none" })
      .then((registration) => registration.update())
      .catch(() => {});
  });
}
