# @bzync/rui — 2026 visual redesign

A token-led redesign that keeps the library's "infrastructure product" identity
and sharpens it. The heavy lifting happens in the token layer
(`src/styles/globals.css`, `src/lib/component-styles.ts`, `src/lib/motion.ts`);
every component already consumes semantic tokens, so palette, elevation, focus,
and typography changes propagate without per-component rewrites. Component-level
edits in this pass are limited to removing hardcoded values and aligning states.

## Direction

rui is built for admin consoles, billing portals, and internal tools — surfaces
people live in for a full workday. The redesign commits to:

1. **A chosen accent, not a defaulted one.** The old accent aliased raw Tailwind
   blue (`--color-accent-* = var(--color-blue-*)`). It is now **Cobalt
   `#345DEE`** — a violet-leaning blue that harmonizes with the navy brand
   anchor and is distinct from every other blue component library.
2. **Navy as the dark-mode ground.** Dark mode now sits on the brand navy
   (`--color-bg: #060c1a`, navy-900) with surfaces stepping up in the same hue,
   rather than a generic slate.
3. **Typographic restraint.** One sans (Inter) does display and body work through
   weight and a `-0.015em` heading tracking. `--font-display` still exists and
   still mirrors `--font-sans`, so consumers can inject a display face through
   `ThemeProvider` without touching body copy.
4. **One signature: focus.** Every interactive surface shares a single
   `focus-visible` treatment — a 1px inset hairline plus a 3px cobalt halo held
   off the control by a 2px gap in the page ground (`.focus-ring` in
   `globals.css`). Keyboard navigation is the one place the design raises its
   voice.
5. **Discipline everywhere else.** 4px grid, five radii (4/6/8/10/12), four
   elevation levels with a navy cast (`rgb(9 14 28)`), one shared spring easing
   for overlays and menus.

## Tokens (source of truth)

| Layer | File | What changed |
|---|---|---|
| Color, radius, elevation, type, motion vars | `src/styles/globals.css` | Cobalt accent ramp (50–950), retuned neutrals, navy dark ground + surfaces, navy-cast shadow scale, `--tracking-display`, `--font-display` → Inter stack, `--chart-1..6` categorical series (light + dark), signature `.focus-ring` utility, cobalt `::selection` |
| Control anatomy | `src/lib/component-styles.ts` | `focusRingStyles` now routes through `.focus-ring`; `controlBaseStyles` ring 2px → 3px; added `peerFocusRingStyles` for proxy-input controls |
| Motion | `src/lib/motion.ts` | unchanged — already centralized; snackbar now consumes `spring.snappy` instead of an inline spring |

### Palette

| Token | Light | Dark | Role |
|---|---|---|---|
| `--color-accent-600` | `#345dee` | `#345dee` | primary actions, links, focus halo, selection |
| `--color-bg` | `#f7f8fb` | `#060c1a` | app background |
| `--color-surface` | `#ffffff` | `#0e1826` | cards, inputs, menus |
| `--color-foreground` | `#141a26` | `#f2f4f7` | primary text |
| `--color-muted-foreground` | `#64708a` | `#97a3b4` | secondary text, icons |
| `--color-border` | `#dce2ec` | `#253141` | hairlines, dividers |

Status colors (emerald / amber / red / sky) are unchanged. `--color-blue-*`
stays at Tailwind defaults for back-compat; components consume `--color-accent-*`.

### Chart series (`--chart-1..6`)

Fixed-order categorical set anchored on cobalt, validated for CVD separation and
lightness against each mode's chart surface (see `scripts/validate_palette.js` in
the dataviz skill). Light: `#345dee #0d9488 #c17d1a #db2f74 #7c5cd6 #2f8f4e`.
Dark steps are re-picked, not flipped. `charts/shared.tsx` exports `CHART_SERIES`
(categorical), `CHART_SEQUENTIAL` (single-hue cobalt ramp, used by FunnelChart),
`CHART_POSITIVE` / `CHART_NEGATIVE` (waterfall).

## Accessibility

- **Focus** — `.focus-ring` uses `box-shadow` so the halo follows
  `border-radius`; a transparent `outline` is retained for Windows
  forced-colors / high-contrast mode. Focus-ring contrast: cobalt-500 halo at 38%
  over both grounds clears the 3:1 non-text UI threshold. Transition is gated
  behind `prefers-reduced-motion: no-preference`.
- **Contrast** — white on cobalt-600 is 5.34:1 (AA normal text); link color
  cobalt-700 on white is 7.3:1. `--color-muted-foreground` on `--color-bg` is
  ≥ 4.6:1 in both modes.
- **Motion** — the existing `globals.css` reduced-motion block (inside
  `.rui-theme`) still nulls all animation/transition durations; the new focus
  transition and `.focus-ring` respect it.
- Per-component keyboard/ARIA contracts are unchanged — see
  `docs/ACCESSIBILITY.md` / `resources/accessibility` in the demo. This pass
  touched styling only.

## Changelog by area

### Foundations
- `globals.css`: accent → cobalt ramp; neutrals retuned; dark ground → navy-900
  with hue-consistent surfaces; shadow scale recolored to `rgb(9 14 28)` and
  `--shadow-floating` tightened; `--font-display` → Inter stack;
  `--tracking-display: -0.015em` applied to all headings; `--chart-1..6` added;
  `.focus-ring` upgraded from a 2px outline to the inset-hairline + 3px halo
  signature; `::selection` → cobalt via `color-mix`.
- `component-styles.ts`: unified 3px focus geometry; `peerFocusRingStyles` added.

### Actions
- `button`, `button-group`, `theme-toggle`, `info-button` — no change needed
  (already fully tokenized); inherit cobalt + new focus halo.
- `copy-button` — idle/copied states moved off raw `slate`/`black-alpha` to
  `muted` / `success` tokens; radius tokens; added `.focus-ring` and an
  `aria-label` when unlabeled.
- `billing-interval-toggle` — focus ring 2px → 3px at the signature tint.

### Feedback
- `callout` — every variant moved to semantic tokens; icon colors darkened for
  light-mode AA (`text-*-600 dark:text-*-400`); title → `text-foreground`, body →
  `text-muted-foreground`; radius token.
- `error-state` — default copy rewritten from "Something went wrong" /
  "An unexpected error occurred. Please try again." to specific, user-POV copy.
- `snackbar` — inline spring → `motionTokens.spring.snappy`.
- `alert` — unchanged (rich per-variant treatment retained); the 3px accent bar
  now rhymes with the focus halo.

### Editors
- `code` (CodeBlock + inline), `terminal-emulator`, `terminal-block` — dark
  surface `#0d1117`/`#0e1117` (GitHub-dark) → brand `navy-900`; borders →
  `border-border`; radius → `--radius-xl` to match `Card`.

### Charts
- All ten charts: local hardcoded color arrays (`#3b82f6`, `#10b981`, …) replaced
  with `CHART_SERIES` / `CHART_SEQUENTIAL` / `CHART_POSITIVE|NEGATIVE` from
  `shared.tsx`. Single-series defaults (`bar`, `line`, `heatmap`) → `--chart-1`.
  `FunnelChart` moved from a multi-hue set to the single-hue cobalt ramp (correct
  form for one decreasing measure).
- `ChartTooltip` — moved to `surface-raised` / `border-border` / `shadow-floating`
  / `text-foreground`.

### Display / Navigation
- `avatar` — deterministic palette slot 1 `bg-blue-600` → `bg-accent-600`.
- `autocomplete` highlight `<mark>` — `blue` → `accent`.
- `stepper` — `text-gray-900 dark:text-white` → `text-foreground`;
  `border-black/15` → `border-border-strong`.
- Library-wide sweep: `text-gray-900 dark:text-white` → `text-foreground`
  (functionally identical, removes a stray idiom).

### Focus-ring sweep (25 files)
`focus-visible:ring-2` / `peer-focus-visible:ring-2` / input `focus:ring-2` →
3px at the signature tint across `radio`, `checkbox`, `switch`, `rating`,
`slider`, `textarea`, `select/*`, `datatable`, `datepicker`, `calendar/*`,
`file-upload`, `otp-input`, `typography`, `visually-hidden`, `datatable/rows-dropdown`.

### Demo
- Chart section examples and `component-details` previews: `#3b82f6`/`#10b981` →
  `var(--chart-1)` / `var(--chart-2)`.
- Foundations docs: shadow-token display strings updated to navy-cast values;
  typography "Families" corrected ("Geist Sans" → "Inter Variable") and given a
  one-typeface note; `App.css` shadow-sample chrome recolored.

## Verification

`npm run release:check` — typecheck + unit (78) + library build + demo build +
Playwright e2e (86 passed, 5 viewports). One unit assertion updated
(`charts.test.tsx`: heatmap default token `--color-accent-500` → `--chart-1`).
