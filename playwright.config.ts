import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
    // Chromium in this sandbox blocks socketpair; avoid SIGTRAP.
    launchOptions: {
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--no-zygote", "--disable-dev-shm-usage"],
    },
  },
  projects: [
    { name: "mobile-360", use: { viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true } },
    { name: "mobile-430", use: { viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true } },
    { name: "tablet-768", use: { viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: "desktop-1280", use: { viewport: { width: 1280, height: 800 } } },
    { name: "wide-1536", use: { viewport: { width: 1536, height: 960 } } },
  ],
  webServer: {
    command: "npm --prefix demo run dev -- --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    env: {
      NO_PROXY: "*",
      no_proxy: "*",
      HTTP_PROXY: "",
      http_proxy: "",
      HTTPS_PROXY: "",
      https_proxy: "",
      ALL_PROXY: "",
      all_proxy: "",
      NODE_USE_ENV_PROXY: "0",
    },
  },
})
