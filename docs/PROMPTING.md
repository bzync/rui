# PROMPTING.md — Copy-Paste Prompts for @bzync/rui

> Optimized prompts that produce great output on this repo. Paste them as your LLM's system prompt (or as a context block) depending on the task. Each prompt is self-contained and references real files/tokens.

---

## 1. General — Any task in this repo

```
You are working in @bzync/rui — a composable React UI library (React 18/19, Tailwind v4, vite, ts, framer-motion).
Read AGENTS.md and SKILLS.md first. Key facts:
- Path alias @/* -> src/*.
- cn(...ClassValue[]) = twMerge(clsx(...)) at src/lib/cn.ts — use it for every className.
- Styles in src/styles/globals.css: @theme defines --color-accent-*, --color-bg/surface, navy scale, fonts, shadows. Dark via .dark class + @custom-variant dark.
- Components at src/components/*.tsx (each "use client", forwardRef, className, variant maps). Barrel at src/index.ts. Per-component builds via vite.config.ts.
- Theme via ThemeProvider (palette/lightPalette/darkPalette with accent/neutral/colors/fonts/tokens).
- Tests: vitest (jsdom) at src/__tests__/*.test.tsx, plus Playwright e2e against demo/ (port 4173).
- Commands: npm run typecheck, npm run test:unit, npm run build, npm run release:check.

Before coding, name the files you will touch and why. After coding, state how you verified (commands + observed output).
```

---

## 2. Build a screen (consumer)

```
Build a screen using @bzync/rui components.

Requirements:
- import "@bzync/rui/styles.css" once.
- Wrap with <ThemeProvider defaultTheme="system"> (or applyToRoot for full-page).
- Compose with AppShell / Container / Card / DataTable / Input / Select / etc.
- Use semantic tokens (bg-accent-*, bg-bg, text-slate-*) and cn() for any overrides.
- Provide label/hint/error on form fields, keyboard support, empty/loading states.
- Return a single runnable TSX file (imports + exported component) and list the demo section it belongs to (see demo/src/App.tsx categories).

If theming is needed, include a palette object (50..950 scale) and show lightPalette/darkPalette split.
```

**Add-on for themed brand:**

```
Brand palette: {50,100,200,300,400,500,600,700,800,900,950} hex strings.
Map it via <ThemeProvider palette={{ accent: brand }}>. Verify in both light and dark — include darkPalette tokens for --color-bg/surface if the brand needs contrast.
```

---

## 3. Author a new component (library)

```
Author a new component at src/components/<kebab>.tsx for @bzync/rui.

Contract (from AGENTS.md §4):
"use client" first line; import { cn } from "@/lib/cn"; export interface <Name>Props extends native props; variant/size as Record maps; forwardRef + displayName; cn("base", variants[variant], sizes[size], className); spread remaining props; useId for label/input; semantic tokens (accent/slate/bg); a11y (native element, aria-*, focus-visible:ring); export from src/index.ts.

Also:
- Add a demo snippet to demo/src/sections/<category>.tsx
- Add Vitest cases to src/__tests__/<domain>.test.tsx (render + userEvent interaction + controlled/uncontrolled + a11y)
- Run npm run typecheck && npm run test:unit && npm run build and fix errors.

Output: the component file, barrel diff, demo diff, and test diff.
```

---

## 4. Fix a bug / a11y issue

```
Fix the bug described below in @bzync/rui without breaking the contracts in AGENTS.md.

Process:
1. Read the failing component + its test (src/__tests__/*.test.tsx) + globals.css if styling is involved.
2. Reproduce: write a minimal Vitest case that fails on the current code (or cite the existing failing test).
3. Fix at the root cause — keep className via cn(), keep "use client", keep focus-trap/Escape/restore for overlays.
4. Verify: npm run typecheck, npm run test:unit (full file), npm run build. Quote the decisive observed output (test count, build success).
5. If the fix touches theming, verify light + dark + system + storageKey=false.

Do not edit dist/, do not narrow test runs to hide failures, do not bundle fonts.
```

---

## 5. Theming & typography

```
Customize theming for @bzync/rui.

ThemeProvider: palette / lightPalette / darkPalette each support `{ accent, neutral, colors, radius, fonts, spacing, shadows, tokens }`. `colors` is the typed semantic layer: `bg`, `surface`, `surfaceRaised`, `surfaceMuted`, `border`, `borderStrong`, `text`, `muted`, `mutedForeground`, `primary`, `primaryHover`, `primaryForeground`, `danger`, `dangerForeground`, `success`, `warning`, `info`, and `focusRing`. ColorPalette is Partial<Record<50..950,string>> and tokens remains the `--*` escape hatch. accent -> --color-accent-* (+ --color-blue-*), neutral -> --color-slate-* + --color-gray-*. Options: defaultTheme, theme (controlled), onThemeChange, storageKey (false to disable), applyToRoot.

Typography: set `fonts` on ThemeProvider palettes or override `--font-sans`, `--font-display`, and `--font-mono`. Applications own webfont loading.

Show: palette object, ThemeProvider wrapper, and ThemeToggle with custom labels if needed. Note persistence behavior.
```

---

## 6. Data-heavy UI (tables, forms, charts)

```
Build data UI with @bzync/rui.

- DataTable: columns [{key, header, cell?, searchable?, align?}], data (id required), searchable, pageSizeOptions, loading, emptyMessage. Sorting is built-in.
- Select/Autocomplete: options [{value,label}], multiple?, label/hint/error, onChange. Keyboard: Arrow/Enter/Escape, portaled listbox.
- Calendar/DatePicker: Calendar {value:Date,onChange}, DatePicker {label,value,onChange}.
- Charts: import from "@bzync/rui/charts" — Bar/Line/MultiLine/Donut/Funnel/Gantt/Heatmap/Radar/Scatter/Waterfall. Each takes its own data shape (see src/components/charts/*.tsx).

Requirement: handle searchable/filter, pagination, empty state, and loading skeleton. Provide sample data.
```

---

## 7. Review a PR

```
Review this PR against @bzync/rui contracts (AGENTS.md §4-6 + SKILLS.md rui-review).

Check:
- className via cn() everywhere, "use client" where needed, forwardRef/displayName
- Semantic tokens (accent/slate/bg) not raw blue/red hex
- Label/input via useId, aria-* correctness
- Overlay focus trap + Escape + restore + body overflow
- Reduced-motion under .rui-theme
- Theme palette tested light/dark/system/persistence
- Subpath + barrel exports
- Vitest coverage added, typecheck + build pass, no dist/ edits, no font imports, no lockfile churn

Output: table of Pass/Fail per check + required fixes (file:line) or LGTM.
```

---

## 8. Negative prompts (what NOT to do)

Include this fragment when the agent tends to hallucinate:

```
Do not:
- Invent component props that don't exist — read src/components/<name>.tsx first.
- Use bg-blue-* in new components — use bg-accent-*.
- @import fonts in library CSS — webfont loading belongs to the consuming application.
- Edit dist/ or commit package-lock.json churn from npm install in a yarn repo.
- Skip verification — run npm run typecheck && npm run test:unit before declaring done.
- Claim visual correctness without a headless-browser screenshot when verification is permitted.
```

---

## 9. One-liner for quick tasks

```
Use @bzync/rui: import "@bzync/rui/styles.css", wrap with ThemeProvider, compose via className+cn(), semantic tokens, subpath imports, a11y keyboard support.
```

*See `SKILLS.md` for skill cards and `docs/COMPONENTS.md` for the full component inventory with props and import paths.*
