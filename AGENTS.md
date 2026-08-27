# AGENTS.md — @bzync/rui

> Instructions for AI agents (and humans acting like one) working in this repo. Follow this file before any other doc when you edit code.

## 1. What this project is

Composable React UI library **`@bzync/rui`** — Tailwind v4 + `clsx`/`tailwind-merge`, no runtime CSS-in-JS. Ships:

- **Per-component ESM + CJS** via `src/index.ts` + `src/components/*.tsx` entries (`vite.config.ts`) + typed declarations (`vite-plugin-dts`).
- **Single stylesheet** `dist/styles.css` (`@import "tailwindcss" source(none)` scoped to `src/components` + `src/lib`).
- **Scoped theming** via `ThemeProvider` — accent/neutral scales + arbitrary CSS tokens, light/dark/mode-specific overrides, `applyToRoot`, localStorage persistence, system preference.
- **Demo app** in `demo/` (Vite + React 19) used as visual spec + Playwright target.

Supports **React 18.2 and 19**, `framer-motion` is peer+dev. 62 direct `src/components/*.tsx` files + chart/terminal/autocomplete sub-modules.

## 2. Repo map

```
src/
  index.ts                  # re-exports every component (barrel)
  vite-end.d.ts             # vite client types
  lib/cn.ts                 # cn(...ClassValue[]) => twMerge(clsx(...))
  styles/globals.css        # Tailwind v4 theme, semantic tokens, .rui-theme, .portal-* utilities
  components/
    *.tsx                   # one file per public component (Button, Modal, etc.)
    accordion.tsx, alert.tsx, avatar.tsx, badge.tsx, button.tsx, calendar.tsx, card.tsx, ...
    autocomplete/           # Autocomplete (single/multi triggers, dropdown, types)
    calendar/               # Calendar month/week views + types
    charts/                 # Bar, Line, MultiLine, Donut, Scatter, Gantt, Heatmap, Radar, Funnel, Waterfall + shared
    datatable/              # DataTable pagination/sort/skeleton subcomponents
    select/                 # Select single/multi + option-list + types
    terminal/               # Terminal emulator, block, fs, shell commands
  __tests__/                # Vitest + Testing Library (jsdom)
    setup.ts
    charts.test.tsx, display-layout.test.tsx, editors-data.test.tsx, form-controls.test.tsx
    interactive-components.test.tsx, overlays-feedback.test.tsx, providers-navigation.test.tsx
    select-autocomplete.test.tsx
demo/
  src/
    App.tsx                 # category nav + section registry
    sections/               # actions, forms, display, feedback, navigation, overlay, layout-section, data, editors, charts, typography
    _shared/icons.tsx
  vite.config.ts, tsconfig.*.json
tests/
  e2e/                      # Playwright (baseURL http://127.0.0.1:4173, 5 viewports)
dist/                       # build output (do not hand-edit)
```

## 3. Commands (use these exactly)

```bash
npm run typecheck            # tsc --noEmit
npm run test:unit            # vitest run  (jsdom, setupFiles src/__tests__/setup.ts)
npm run test                 # alias for test:unit
npm run test:e2e             # playwright test  (auto-starts demo dev server)
npm run build                # vite build -> dist/{index,components/*}.{js,cjs,d.ts} + dist/styles.css
npm run release:check        # typecheck + test:unit + build + demo build + test:e2e
npm --prefix demo run build  # demo production build
npm run dev                  # vite dev (library mode — use demo for visual work)
npm --prefix demo run dev -- --host 127.0.0.1 --port 4173  # demo dev server
```

**Do not** run `npm install` with a different package manager — this repo is npm + `package-lock.json`. If you touch `node_modules`, verify `git status` didn't rewrite `package-lock.json`.

**Path alias:** `@/*` → `src/*` (see `tsconfig.json` + `vite.config.ts`).

## 4. Component authoring contract

Every component in `src/components/*.tsx` must follow this shape:

```tsx
"use client"
import { cn } from "@/lib/cn"
import { forwardRef, useId } from "react"

export interface FooProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  variant?: "primary" | "secondary"
  size?: "sm" | "md" | "lg"
}

export const Foo = forwardRef<HTMLDivElement, FooProps>(({ className, variant="primary", ...props }, ref) => {
  return <div ref={ref} className={cn("base tokens", variantMap[variant], className)} {...props} />
})
Foo.displayName = "Foo"
```

Rules:

- **First line `"use client"`** in every component that uses hooks, events, or `framer-motion`.
- **`cn()` for every class composition.** Never concatenate Tailwind strings manually when `className` is involved — `cn` merges via `twMerge`.
- **Always accept `className` and spread native props.** Users compose one-offs via `className`; breaking this is a breaking change.
- **`forwardRef` when the component renders a single DOM element.** Keep `displayName`.
- **`useId()` for label/input associations** (`htmlFor`/`id` + `aria-describedby` for hint/error). See `Input`, `Select`, `Autocomplete` for the pattern.
- **Variant/size as `Record<Variant, string>`** joined with `.join(" ")` or array — keep the map outside the component.
- **Semantic tokens over raw palette:** use `bg-accent-*`, `text-slate-*`, `bg-bg`, `bg-surface`, `border-black/[0.08]` / `dark:border-white/[0.08]` — not `bg-blue-600` directly unless it's the accent passthrough. Accent is remapped in `globals.css` via `--color-accent-*` (`--color-blue-*` kept for back-compat).
- **No webfonts bundled.** Never `@import` Google Fonts in `globals.css`. Consumers own webfont loading and can configure typography through `ThemeProvider` font values or CSS variables.
- **Exports:** add `export * from "./components/foo"` in `src/index.ts`. Vite auto-discovers `src/components/*.tsx` as subpath entries — no manual `vite.config.ts` edit needed for a new top-level component file. Sub-folders (e.g. `charts/`, `select/`) need an explicit entry if they should be importable as `@bzync/rui/charts`.

## 5. Styling & theming

- **Tailwind v4** — `@tailwindcss/vite` plugin. `globals.css` declares `@theme` (navy scale, `--color-accent-*`, `--color-bg`, `--color-surface`, fonts, shadows) and `@custom-variant dark`.
- **`ThemeProvider` (`src/components/theme-provider.tsx`):**
  - `palette` (theme-independent), `lightPalette`/`darkPalette` (mode-specific), each with `{ accent?: ColorPalette, neutral?: ColorPalette, tokens?: ThemeTokens }`.
  - `ColorPalette` is `Partial<Record<50|100|...|950, string>>`. `accent` maps to both `--color-blue-*` and `--color-accent-*`; `neutral` maps to `--color-slate-*` + `--color-gray-*`.
  - `tokens` are arbitrary `--*` CSS vars (e.g. `--color-bg`, `--radius-lg`).
  - `defaultTheme`, controlled `theme` + `onThemeChange`, `storageKey` (false disables persistence), `applyToRoot` (syncs class/tokens to `<html>`).
  - Renders `<div class="rui-theme [dark]" data-theme={resolvedTheme} style={{colorScheme, ...paletteVars}}>` — all theme CSS is scoped here. Respect this scope when writing CSS (use `.rui-theme` or `.dark` nesting, and the `prefers-reduced-motion` block).
- **Typography:** `ThemeProvider` palette font values configure the sans, mono, display, and heading stacks. Default `--font-sans/mono/display` values are set in `globals.css`.
- **Portal tokens:** `.portal-shell`, `.portal-surface`, `.portal-panel`, `.portal-topbar` are the app-shell chrome (used by `AppShell*` in `layout.tsx`).

## 6. Accessibility & motion (non-negotiable)

- Native semantics first: `<button type="button">`, `<a>`, `<input>` with associated `<label>`, `aria-invalid`, `aria-describedby`, `role="dialog"` + `aria-labelledby/describedby` for `Modal`/`Drawer`, `role="listbox"`/`option` for `Select`/`Autocomplete`.
- **Focus trap + Escape + restore focus** for `Modal` and `Drawer` (see `modal.tsx` — captures `previouslyFocused`, locks `document.body.style.overflow`, listens for `keydown`, restores on unmount). Replicate for any new overlay.
- **Reduced motion:** anything animated with `framer-motion` must degrade under `@media (prefers-reduced-motion: reduce)` — the `globals.css` rule inside `.rui-theme` already nulls `animation/transition` durations. Keep animations inside `ThemeProvider` scope.
- `ThemeToggle` uses `aria-pressed`, `aria-label`/`title` switching between `lightLabel`/`darkLabel`.

## 7. Testing

- **Unit:** Vitest + `@testing-library/react` + `userEvent` (jsdom). Config `vitest.config.ts` includes `src/**/*.test.{ts,tsx}`, `setupFiles: ["./src/__tests__/setup.ts"]`, `restoreMocks: true`.
- **E2E:** Playwright `playwright.config.ts` — `testDir: ./tests/e2e`, `fullyParallel`, 5 projects (mobile-360, mobile-430, tablet-768, desktop-1280, wide-1536), `webServer: npm --prefix demo run dev -- --host 127.0.0.1 --port 4173`.
- **Matchers:** `src/__tests__/setup.ts` installs `jest-dom`. Tests organize by domain, not by file count — follow the existing 8-file grouping (`charts`, `display-layout`, `editors-data`, `form-controls`, `interactive-components`, `overlays-feedback`, `providers-navigation`, `select-autocomplete`).
- **When adding a component:** add cases to the relevant `__tests__/*.test.tsx` or create a new one matching the domain. Cover: render, interaction (click/keyboard), controlled vs uncontrolled, a11y attributes, error/hint states.

## 8. Demo app

`demo/src/App.tsx` is the source of truth for how components compose visually. Categories:
`Actions | Forms | Display | Feedback | Navigation | Overlay | Layout | Data | Editors | Charts | Typography`. Each in `demo/src/sections/*.tsx`. When you build a new component, add a section there first — it's faster than writing a one-off page and it gives Playwright a target.

## 9. Typical tasks

### Add a new component `Foo`
1. Create `src/components/foo.tsx` (`"use client"`, `cn`, `forwardRef`, variant map, a11y).
2. Export from `src/index.ts`.
3. Add a demo in `demo/src/sections/<category>.tsx`.
4. Add Vitest coverage in `src/__tests__/<domain>.test.tsx`.
5. Run `npm run typecheck && npm run test:unit && npm run build` — fix any `dts` errors (they fail the build).

### Change styling / tokens
Edit `src/styles/globals.css` (`@theme` + semantic aliases) or component `variants` maps. Never hardcode hex in components — use `accent-*`, `slate-*`, or `tokens`. Verify in both `light` and `dark` via `ThemeProvider` with `darkPalette`.

### Change ThemeProvider / theming
Edit `src/components/theme-provider.tsx` + `theme-toggle.tsx`. Test controlled + uncontrolled + `storageKey={false}` + `applyToRoot` + `system` preference matrix (`providers-navigation.test.tsx`).

### Fix a11y or overlay bug
Check `modal.tsx` / `drawer.tsx` focus trap, `select/` and `autocomplete/` listbox keyboard handling. Add a regression test that asserts `aria-*`, focus restoration, and `Escape` behavior.

## 10. Pitfalls to avoid

- **Forgetting `className` merge** — breaks consumer overrides silently.
- **Using `bg-blue-*` directly** in new components — use `bg-accent-*` so `palette.accent` theming works.
- **Importing fonts in library CSS** — leaks network requests; leave webfont loading to consumers.
- **Not handling `className` on sub-elements** — if a component has multiple styled parts, expose targeted props (e.g. `triggerClassName`) or document which element `className` targets.
- **Editing `dist/`** — generated; fix source and rebuild.
- **Skipping `typecheck`** — `vite-plugin-dts` is the slowest but most load-bearing step; `npm run build` will fail on type errors.
- **Narrow snapshot verification** — compare full output, not sampled subsets. If your own comparison reports a mismatch (non-zero diff, differing sizes), the artifact is not done.

## 11. PR / commit expectations

- Keep commits focused; don't bundle unrelated component changes.
- Run `npm run release:check` before requesting review — CI mirrors this sequence.
- If you ran an installer/generator, check `git status` and revert collateral `package-lock.json` / `yarn.lock` rewrites you didn't intend.

---
*Teams should also read `SKILLS.md` for prompt recipes and `docs/PROMPTING.md` for copy-paste LLM prompts tuned to this codebase.*
