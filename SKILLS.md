# SKILLS.md — Prompt Skills for @bzync/rui

> Drop-in skills for getting great output from any LLM when working with this library. Each skill is a self-contained system prompt fragment — copy the block that matches your task into your agent's instructions. They are tuned to this repo's real contracts (`ThemeProvider`, `cn`, Tailwind v4, `framer-motion` overlays, subpath imports).

---

## How to use

1. Pick the skill(s) for your task (usually 1–2).
2. Paste the **Prompt** block into your LLM's system/context field, or reference this file from `AGENTS.md`.
3. Replace `{placeholders}` and keep the **Constraints** section verbatim — it's where quality comes from.

General rule: **import `styles.css` once, wrap with `ThemeProvider`, compose via `className`.**

```tsx
import "@bzync/rui/styles.css";
import { ThemeProvider } from "@bzync/rui";
```

---

## Skill 1 — `rui-consumer` · Build an app screen with rui

**Use when:** you need a page, dashboard, form, or layout that _uses_ the library — not authoring the library itself.

**Prompt:**

```
You are building with @bzync/rui (React 18/19, Tailwind v4).

Constraints:
- Import styles once: import "@bzync/rui/styles.css"
- Wrap the app (or section) in <ThemeProvider> — prefer scoped themes; use applyToRoot only for full-page apps.
- Use semantic tokens: bg-accent-*, bg-bg, bg-surface, text-slate-*. Never hardcode brand hex inside components.
- Every component accepts className — use cn() (clsx + tailwind-merge) to compose overrides, never string-concat Tailwind conditionals.
- Prefer subpath imports for tree-shaking: import { Button } from "@bzync/rui/button"
- Handle a11y: label every Input/Select, keep focus order, support keyboard (Tab/Escape/Arrow).
- Respect reduced motion — keep animations inside .rui-theme scope.

Available categories (pick from demo/src/App.tsx): Actions (Button, CopyButton), Forms (Input, Textarea, Select, Autocomplete, Checkbox, Switch, Radio, Slider, NumberInput, OtpInput, FileUpload, DatePicker, Calendar), Display (Badge, Avatar, Card, Tooltip, Tag, Kbd, StatusDot, Stat, Callout, Link), Feedback (Alert, Snackbar, Spinner, Skeleton, Modal, Progressbar, ConfirmDialog, EmptyState, ErrorState), Navigation (Navbar, Topbar, Sidebar, BottomBar, Drawer, Breadcrumb, Pagination, Stepper), Overlay (Popover, DropdownMenu, Command), Layout (Separator, Tabs, Accordion, List, Timeline, Tree), Data (Table, DataTable), Editors (CodeBlock, CodeEditor, Terminal, RichText), Charts (Bar, Line, MultiLine, Donut, Scatter, Gantt, Heatmap, Radar, Funnel, Waterfall).

Return runnable TSX (imports + component) and note which demo section it belongs to.
```

**Few-shot starter:**

```tsx
import {
  AppShell,
  AppShellBody,
  AppShellMain,
  Container,
  Card,
  CardHeader,
  CardTitle,
  Button,
  DataTable,
} from "@bzync/rui";
import { ThemeProvider } from "@bzync/rui";

export function Dashboard() {
  return (
    <ThemeProvider defaultTheme="system">
      <AppShell fixed>
        <AppShellBody>
          <AppShellMain scrollable>
            <Container size="lg">
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
              </Card>
            </Container>
          </AppShellMain>
        </AppShellBody>
      </AppShell>
    </ThemeProvider>
  );
}
```

---

## Skill 2 — `rui-author` · Author or fix a library component

**Use when:** you edit `src/components/*.tsx` or add a new component to the library.

**Prompt:**

```
You are authoring a component for @bzync/rui at src/components/<name>.tsx.

Mandatory contract:
1. First line: "use client"
2. Imports: import { cn } from "@/lib/cn"; use forwardRef + useId where a label/input pair exists.
3. Props extend native element props, always include className?: string, and variant/size as Record maps outside the component.
4. Merge classes with cn("base", variants[variant], sizes[size], className) — never omit className.
5. Use semantic Tailwind tokens: bg-accent-*, text-slate-*, bg-bg/bg-surface, dark: variants. Map accent via --color-accent-* (see src/styles/globals.css).
6. Accessibility: native element, associated label (useId), aria-invalid/aria-describedby for errors, role/dialog/listbox where needed, focus-visible:ring.
7. Overlays (Modal/Drawer/Popover): trap focus, close on Escape, restore previouslyFocused, preserve document.body.style.overflow.
8. Export from src/index.ts (barrel). Top-level *.tsx files become subpath entries automatically via vite.config.ts.
9. Add Vitest coverage in src/__tests__/<domain>.test.tsx (render + interaction + controlled/uncontrolled + a11y).
10. Verify: npm run typecheck && npm run test:unit && npm run build

Do not edit dist/, do not bundle fonts, do not use bg-blue-* directly.
```

**Component skeleton:**

```tsx
"use client";
import { cn } from "@/lib/cn";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";
const variants: Record<Variant, string> = {
  primary: "bg-accent-600 hover:bg-accent-500 text-white",
  secondary: "bg-white dark:bg-white/[0.07] text-slate-700 dark:text-slate-200",
  ghost: "bg-transparent hover:bg-black/[0.05] dark:hover:bg-white/[0.06]",
};

export interface FooProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

export const Foo = forwardRef<HTMLDivElement, FooProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-lg border p-4", variants[variant], className)}
      {...props}
    />
  ),
);
Foo.displayName = "Foo";
```

---

## Skill 3 — `rui-theme` · Customize theming & typography

**Use when:** you need custom brand colors, dark-mode tokens, or font choices.

**Prompt:**

```
You are theming @bzync/rui via ThemeProvider.

ThemeProvider API (src/components/theme-provider.tsx):
- palette / lightPalette / darkPalette: { accent?: ColorPalette, neutral?: ColorPalette, tokens?: ThemeTokens }
  ColorPalette = Partial<Record<50|100|200|300|400|500|600|700|800|900|950, string>>
  ThemeTokens = Partial<Record<`--${string}`, string|number>>
  accent -> --color-accent-* + --color-blue-* (back-compat); neutral -> --color-slate-* + --color-gray-*
- defaultTheme: "light"|"dark"|"system" (default "system"), theme (controlled) + onThemeChange, storageKey (string|false), applyToRoot (boolean)
- ThemeToggle: lightIcon/darkIcon, showLabel, lightLabel/darkLabel, className

Constraints:
- Supply full scales where possible; partial scales are allowed but test both light/dark.
- Use tokens for surface/bg/radius/shadow overrides: { tokens: { "--color-bg": "#fafafa", "--radius-lg": "1rem" } }
- For typography, set `fonts` on ThemeProvider palettes or override `--font-sans`, `--font-display`, and `--font-mono`. Webfont loading belongs to the consuming application.
- Always render ThemeToggle inside ThemeProvider (useTheme() requires it).
- Test: light, dark, system, persistence (storageKey=false to disable), applyToRoot scoping.

Return: TypeScript palette object + ThemeProvider wrapper + note on lightPalette vs darkPalette split.
```

**Palette example:**

```tsx
const violet = { 50:"#f5f3ff",100:"#ede9fe",200:"#ddd6fe",300:"#c4b5fd",400:"#a78bfa",500:"#8b5cf6",600:"#7c3aed",700:"#6d28d9",800:"#5b21b6",900:"#4c1d95",950:"#2e1065" } as const

<ThemeProvider palette={{ accent: violet }} lightPalette={{ tokens: {"--color-bg":"#fafafa"} }} darkPalette={{ tokens: {"--color-bg":"#09090b"} }}>
  <ThemeToggle />
</ThemeProvider>
```

---

## Skill 4 — `rui-data` · Tables, forms, and charts

**Use when:** you build data-heavy UI (DataTable, Select/Autocomplete, Calendar/DatePicker, charts).

**Prompt:**

```
You are building data UI with @bzync/rui.

DataTable<T extends {id: string|number}>: columns [{ key, header, cell?, searchable?, align? }], data, searchable, searchPlaceholder, pageSizeOptions (false disables pagination), defaultPageSize, loading, emptyMessage, onRowClick. Sorting is built-in (click header). Use cn for cell styling.

Select / Autocomplete: single vs multiple (multiple flag), options [{value, label, color?}] or groups, label/hint/error, searchable, keyboard (Arrow/Enter/Escape). Autocomplete adds filtering + dropdown subcomponents. Both use role="combobox"/listbox/option and portal the list.

Calendar / DatePicker: Calendar { value: Date, onChange }, DatePicker { label, value, onChange }. Wrap in ThemeProvider for correct dark styles.

Charts (src/components/charts/): BarChart, LineChart, MultiLineChart, DonutChart, FunnelChart, GanttChart, HeatmapChart, RadarChart, ScatterChart, WaterfallChart — each renders SVG; pass data as chart-specific props (see src/components/charts/*.tsx). Import via `import { BarChart } from "@bzync/rui/charts"`.

Always provide: column defs, sample data, empty/loading states, and keyboard/search behavior.
```

---

## Skill 5 — `rui-layout` · App shell & navigation

**Use when:** you compose application chrome.

**Prompt:**

```
You are composing layout with @bzync/rui layout primitives (src/components/layout.tsx, navigation.tsx).

Primitives:
- AppShell { fixed? } — root frame, portal-shell background. Use fixed to let AppShellMain own scroll.
- AppShellBody, AppShellMain { scrollable? }, AppShellHeader { sticky? }, Footer { sticky? }, Container { size: sm|md|lg|xl|full, gutter? }
- Navigation: Navbar, Topbar, Sidebar, BottomBar, Drawer, Breadcrumb, Pagination, Stepper. Navigation items: { id, label, href?, icon?, badge?, disabled? } + activeId + onSelect.
- Stack, Inline, PageHeader utilities for spacing.

Rules:
- Composition order: AppShell > Sidebar? + AppShellBody > (AppShellHeader? + AppShellMain + Footer?)
- Use Container inside AppShellMain for gutters; set AppShell fixed + AppShellMain scrollable for sticky header/footer.
- Style navigation active state via activeId, not manual className. Badge accepts ReactNode.
- Keep responsive: Container gutters + AppShell flex + Sidebar collapse at breakpoints.
```

---

## Skill 6 — `rui-review` · Review & QA

**Use when:** you review a PR or audit a11y/visual quality.

**Checklist (copy into review prompt):**

```
Review with @bzync/rui contracts:
[ ] Every new/modified component accepts className and merges via cn()
[ ] "use client" present where needed; forwardRef + displayName correct
[ ] Tailwind tokens are semantic (accent/slate/bg/surface), not hardcoded blue/red hex
[ ] Label/input association via useId, aria-invalid/describedby for errors
[ ] Overlays trap focus, close on Escape, restore focus, preserve body overflow
[ ] Reduced-motion respected (no animation outside .rui-theme or with !important override)
[ ] ThemeProvider palette/tokens tested in light + dark + system
[ ] Subpath import works (vite.config.ts entry) and barrel export exists
[ ] Vitest coverage added (render + interaction + a11y) and npm run typecheck passes
[ ] No dist/ edits, no font @imports, no package-lock.json churn
```

---

## Skill index (quick reference)

| Skill          | File triggers                                             | Output you get                       |
| -------------- | --------------------------------------------------------- | ------------------------------------ |
| `rui-consumer` | `demo/src/**`, app code                                   | Runnable screen TSX                  |
| `rui-author`   | `src/components/*.tsx`, `src/index.ts`                    | Contract-compliant component + tests |
| `rui-theme`    | `theme-provider.tsx`, `globals.css`                      | Palette + provider TSX               |
| `rui-data`     | `datatable.tsx`, `select.tsx`, `calendar.tsx`, `charts/*` | Table/form/chart TSX with states     |
| `rui-layout`   | `layout.tsx`, `navigation.tsx`                            | AppShell composition                 |
| `rui-review`   | PRs                                                       | Checklist verdict                    |

_See `docs/PROMPTING.md` for copy-paste prompts and `docs/COMPONENTS.md` for the full component inventory._
