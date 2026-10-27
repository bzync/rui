#!/usr/bin/env node
// Measures the real published cost of every component from the built `dist/`
// ESM output and writes demo/src/docs/component-metrics.json for the docs.
//
// For each entry in dist/components/*.js:
//   total  = the entry plus every internal module it statically imports,
//            transitively (what a bundler ships if it is the only component used)
//   specific = total minus the shared runtime (the modules every component
//            imports, e.g. cn + bundled tailwind-merge) — the incremental cost
//            of adding this component to an app that already uses the library
//   lazy   = modules reached only through dynamic import() (loaded on interaction)
// Peer/bare imports (react, react-dom, framer-motion) are excluded and listed.
// Sizes are minified bytes, gzip (level 9) and brotli (quality 11).
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { brotliCompressSync, constants, gzipSync } from "node:zlib"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const dist = join(root, "dist")
const componentsDir = join(dist, "components")
const outFile = join(root, "demo/src/docs/component-metrics.json")

if (!existsSync(componentsDir)) {
  console.error("[metrics] dist/components not found — run `npm run build` first")
  process.exit(1)
}

const staticImport = /(?:^|;|\n)\s*(?:import|export)\s*(?:[^'"]*?\sfrom\s*)?["']([^"']+)["']/g
const dynamicImport = /import\(\s*["']([^"']+)["']\s*\)/g
const cache = new Map()

function read(file) {
  if (!cache.has(file)) cache.set(file, readFileSync(file))
  return cache.get(file)
}

function imports(file) {
  const code = read(file).toString("utf8")
  const statics = [...code.matchAll(staticImport)].map((m) => m[1])
  const dynamics = [...code.matchAll(dynamicImport)].map((m) => m[1])
  return { statics, dynamics }
}

function walk(entry) {
  const own = new Set()
  const lazy = new Set()
  const peers = new Set()
  const visit = (file, into) => {
    if (into.has(file)) return
    into.add(file)
    const { statics, dynamics } = imports(file)
    for (const spec of statics) {
      if (spec.startsWith(".")) visit(resolve(dirname(file), spec), into)
      else peers.add(spec.split("/")[0].startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0])
    }
    for (const spec of dynamics) {
      if (spec.startsWith(".")) visit(resolve(dirname(file), spec), lazy)
    }
  }
  visit(entry, own)
  for (const file of own) lazy.delete(file)
  return { files: own, lazy, peers }
}

function size(files) {
  const buffer = Buffer.concat([...files].map(read))
  return {
    raw: buffer.length,
    gzip: gzipSync(buffer, { level: 9 }).length,
    brotli: brotliCompressSync(buffer, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length,
  }
}

function exportedNames(file) {
  const code = read(file).toString("utf8")
  const names = new Set()
  for (const block of code.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of block[1].split(",")) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim()
      if (name && /^[A-Z]/.test(name)) names.add(name)
    }
  }
  return [...names]
}

const entries = readdirSync(componentsDir).filter((f) => f.endsWith(".js")).sort().map((fileName) => {
  const entry = join(componentsDir, fileName)
  return { fileName, entry, ...walk(entry) }
})

// The shared runtime: modules imported by every component that has any
// internal dependency (cn, which bundles tailwind-merge).
const withDeps = entries.filter((e) => e.files.size > 1)
const shared = new Set([...withDeps[0].files].filter((file) => !file.startsWith(componentsDir) && withDeps.every((e) => e.files.has(file))))

const components = {}
for (const { fileName, entry, files, lazy, peers } of entries) {
  const specificFiles = [...files].filter((file) => !shared.has(file))
  const metrics = {
    entry: `components/${fileName}`,
    total: size(files),
    specific: size(specificFiles),
    lazy: lazy.size ? size(lazy) : null,
    modules: files.size,
    peers: [...peers].filter((p) => p !== "react" && p !== "react-dom").sort(),
  }
  for (const name of exportedNames(entry)) {
    if (!components[name]) components[name] = metrics
  }
}

const css = join(dist, "styles.css")
const output = {
  version: JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version,
  stylesheet: existsSync(css) ? size([css]) : null,
  sharedRuntime: { ...size(shared), modules: [...shared].map((file) => file.replace(`${dist}/`, "")) },
  components,
}

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, `${JSON.stringify(output, null, 2)}\n`)
console.log(`[metrics] ${Object.keys(components).length} components measured → ${outFile.replace(`${root}/`, "")}`)
