import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "verify-dark-file.spec.ts",
  use: { trace: "on-first-retry", launchOptions: { args: ['--disable-dev-shm-usage', '--disable-gpu'] } },
  projects: [{ name: "firefox", use: { browserName: 'firefox', viewport: { width: 1280, height: 800 } } }],
});
