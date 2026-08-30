// Post-build step: turn the client-rendered SPA shell into a real HTML document.
//
// 1. Serve dist/ and load "/" in headless Chrome, letting React render the
//    default (Introduction) page in full.
// 2. Snapshot the rendered DOM back into dist/index.html so the LCP content
//    (`p.docs-lede`) ships in the HTML — main.tsx adopts it via hydrateRoot.
// 3. Add modulepreload hints for the JS chunks that page actually needed, so
//    hydration doesn't wait on a request waterfall.
// 4. Inline the above-the-fold CSS with Beasties and load the full stylesheet
//    asynchronously, removing the last render-blocking request.
//
// If Chrome can't launch (e.g. a local build without Playwright browsers), the
// step logs a warning and leaves the plain SPA index.html in place.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { preview } from "vite";
import Beasties from "beasties";

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const ROUTE = "/";
const LCP_SELECTOR = "p.docs-lede";

async function loadChromium() {
  try {
    const { chromium } = await import("@playwright/test");
    return chromium;
  } catch {
    return null;
  }
}

async function snapshot(chromium) {
  if (!chromium) {
    console.warn("[prerender] Playwright not installed — skipping, shipping the SPA shell as-is.");
    return null;
  }

  const server = await preview({
    root: resolve(distDir, ".."),
    preview: { port: 0, strictPort: false, open: false },
    logLevel: "warn",
  });
  const url = server.resolvedUrls?.local?.[0];
  if (!url) {
    server.httpServer.close();
    throw new Error("[prerender] preview server did not report a URL");
  }

  let browser;
  try {
    browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
    const page = await browser.newPage();
    // Tells the app (format-code.ts) to skip client-only enhancements that would
    // otherwise bake post-hydration state into the snapshot.
    await page.addInitScript(() => {
      window.__RUI_PRERENDER__ = true;
    });
    await page.goto(new URL(ROUTE, url).href, { waitUntil: "networkidle", timeout: 30_000 });
    await page.waitForSelector(LCP_SELECTOR, { state: "attached", timeout: 15_000 });

    // Chunks the Introduction page pulled in — preload them so the client has
    // them by the time hydration reaches each lazy boundary.
    const chunks = await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .map((entry) => entry.name)
        .filter((name) => name.endsWith(".js") && name.includes("/assets/")),
    );

    const html = await page.content();
    return { html, origin: new URL(url).origin, chunks: chunks.map((name) => new URL(name).pathname) };
  } finally {
    await browser?.close();
    server.httpServer.close();
  }
}

function cleanRuntimeArtifacts(html, origin) {
  return (
    html
      // Vite's __vitePreload helper injects <link rel="modulepreload" as="script">
      // at runtime with absolute preview-server URLs — drop them; we re-add clean
      // build-relative preloads below.
      .replaceAll(/<link\b[^>]*\brel="modulepreload"[^>]*\bas="script"[^>]*>/g, "")
      // Safety net for any other absolute reference to the preview origin.
      .replaceAll(origin, "")
  );
}

function withModulePreloads(html, chunkPaths) {
  const missing = chunkPaths.filter((path) => !html.includes(`href="${path}"`));
  if (!missing.length) return html;
  const tags = missing
    .map((path) => `    <link rel="modulepreload" crossorigin href="${path}">`)
    .join("\n");
  return html.replace("</head>", `${tags}\n  </head>`);
}

const HYDRATION_ERROR = /hydrat|did not match the client|Minified React error #(?:418|419|420|421|422|423|424|425)\b/i;

// Load the freshly written index.html and fail the build if React reports a
// hydration mismatch — the snapshot must be adopted cleanly, not thrown away
// and re-rendered (which would put the LCP element back behind the JS).
async function validateHydration(chromium) {
  const server = await preview({
    root: resolve(distDir, ".."),
    preview: { port: 0, strictPort: false, open: false },
    logLevel: "warn",
  });
  const url = server.resolvedUrls?.local?.[0];
  const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const problems = [];
  try {
    const page = await browser.newPage();
    page.on("pageerror", (error) => {
      if (HYDRATION_ERROR.test(error.message)) problems.push(error.message.split("\n")[0]);
    });
    page.on("console", (message) => {
      if (message.type() === "error" && HYDRATION_ERROR.test(message.text())) {
        problems.push(message.text().split("\n")[0]);
      }
    });
    await page.goto(new URL(ROUTE, url).href, { waitUntil: "networkidle", timeout: 30_000 });
    await page.waitForTimeout(1500);
  } finally {
    await browser.close();
    server.httpServer.close();
  }
  if (problems.length) {
    throw new Error(
      `[prerender] hydration mismatch in the snapshot — index.html would be re-rendered client-side:\n  - ${[...new Set(problems)].join("\n  - ")}\n` +
        "Common cause: adjacent static + {expression} text in a component on the Introduction route " +
        "(merge them into one expression, e.g. {`v${version}`}).",
    );
  }
  console.log("[prerender] hydration validated — snapshot adopts cleanly");
}

async function run() {
  const chromium = await loadChromium();
  const snap = await snapshot(chromium);
  if (!snap) return;

  let html = withModulePreloads(cleanRuntimeArtifacts(snap.html, snap.origin), snap.chunks);

  const beasties = new Beasties({
    path: distDir,
    publicPath: "/",
    preload: "swap", // full stylesheet loads async, applies on load
    pruneSource: false, // keep the stylesheet whole for below-the-fold styles
    logLevel: "warn",
  });
  html = await beasties.process(html);

  await writeFile(resolve(distDir, "index.html"), html, "utf8");
  console.log(`[prerender] wrote dist/index.html (${(html.length / 1024).toFixed(1)} KiB, ${snap.chunks.length} chunk preloads)`);

  await validateHydration(chromium);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
