import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import "@bzync/rui/styles.css";
import App from "./App.tsx";
import { registerPwa } from "./pwa";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

registerPwa();
