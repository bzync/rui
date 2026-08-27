import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "verify-dark-file.spec.ts",
  use: { trace: "on-first-retry" },
  projects: [{ name: "desktop-1280", use: { viewport: { width: 1280, height: 800 } } }],
});
