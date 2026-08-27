import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "verify-dark-file.spec.ts",
  projects: [{ name: "webkit", use: { browserName: 'webkit', viewport: { width: 1280, height: 800 } } }],
});
