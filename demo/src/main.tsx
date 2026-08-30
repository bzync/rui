import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./App.css";
import "@bzync/rui/styles.css";
import App from "./App.tsx";
import { registerPwa } from "./pwa";

const container = document.getElementById("root")!;
const tree = (
  <StrictMode>
    <App />
  </StrictMode>
);

// `npm run build` snapshots the fully-rendered root into index.html (see
// scripts/prerender.mjs), so the LCP content ships in the HTML instead of
// waiting on the JS. When that markup is present, adopt it with hydrateRoot;
// otherwise (dev, or a skipped prerender) fall back to a fresh client render.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}

registerPwa();
