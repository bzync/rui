# @bzync/rui

Composable React UI components with scoped, fully customizable light and dark themes.

[![npm version](https://img.shields.io/npm/v/@bzync/rui.svg)](https://www.npmjs.com/package/@bzync/rui)
[![npm downloads](https://img.shields.io/npm/dm/@bzync/rui.svg)](https://www.npmjs.com/package/@bzync/rui)
[![gzip size](https://img.shields.io/bundlephobia/minzip/@bzync/rui.svg)](https://bundlephobia.com/package/@bzync/rui)
[![types included](https://img.shields.io/npm/types/@bzync/rui.svg)](https://www.npmjs.com/package/@bzync/rui)
[![license](https://img.shields.io/npm/l/@bzync/rui.svg)](./LICENSE)

`@bzync/rui` (**r**eact **ui**) is the component library behind [Bzync](https://www.bzync.com).
It ships 79 components plus a small SVG chart set, a token-driven theming system, and
production-grade lifecycle primitives — with **zero runtime dependencies**.

- **Zero runtime dependencies.** `dependencies` is empty. `react`, `react-dom`, and
  `framer-motion` are peer dependencies you already control.
- **Scoped theming.** `ThemeProvider` renders a `.rui-theme` scope, so you can run
  multiple themes on one page or theme a subtree without touching `<html>`.
- **Token-driven.** Override accent and neutral scales, radii, fonts, spacing, shadows,
  or any CSS variable through a single `palette` prop — per theme.
- **Light and dark, controlled or uncontrolled.** System-preference tracking and
  persistent selection are built in.
- **Accessible by default.** Native semantics, keyboard behavior, focus management,
  focus trapping, scroll-lock restoration, and `prefers-reduced-motion` support.
- **ESM and CJS.** Dual builds, per-component subpath exports, `sideEffects` metadata
  for tree-shaking, and readable (unminified) published output.
- **Typed.** Written in TypeScript; declaration files ship with the package.
- **RSC-friendly.** Client components are marked `"use client"`; server components can
  import and render them directly.
- **React 18.2 and React 19.**

## Table of contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [The stylesheet](#the-stylesheet)
- [Theming](#theming)
- [Importing components](#importing-components)
- [Server components and SSR](#server-components-and-ssr)
- [Accessibility and motion](#accessibility-and-motion)
- [Component catalog](#component-catalog)
- [Common recipes](#common-recipes)
- [Charts](#charts)
- [Hooks and utilities](#hooks-and-utilities)
- [TypeScript](#typescript)
- [Browser and React support](#browser-and-react-support)
- [Versioning](#versioning)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## Installation

```sh
npm install @bzync/rui framer-motion
```

```sh
pnpm add @bzync/rui framer-motion
```

```sh
yarn add @bzync/rui framer-motion
```

`react` and `react-dom` (`^18.2.0 || ^19.0.0`) and `framer-motion` (`^13.1.0`) are peer
dependencies. `framer-motion` powers the animated overlays (Modal, Drawer, Popover,
Snackbar); it is kept off the critical path and loaded only by the components that use it.

## Quick start

```tsx
import { Button, ThemeProvider, ThemeToggle } from "@bzync/rui"
import "@bzync/rui/styles.css"

const violet = {
  50: "#f5f3ff", 100: "#ede9fe", 200: "#ddd6fe", 300: "#c4b5fd",
  400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9",
  800: "#5b21b6", 900: "#4c1d95", 950: "#2e1065",
} as const

export function App() {
  return (
    <ThemeProvider
      applyToRoot
      palette={{ accent: violet }}
      lightPalette={{ tokens: { "--color-bg": "#fafafa", "--color-surface": "#fff" } }}
      darkPalette={{ tokens: { "--color-bg": "#09090b", "--color-surface": "#18181b" } }}
    >
      <ThemeToggle />
      <Button>Custom primary</Button>
    </ThemeProvider>
  )
}
```

Every component accepts `className` (and native element props where applicable), so
one-off changes compose with the defaults instead of fighting them.

## The stylesheet

Import the core stylesheet once, near the application root:

```tsx
import "@bzync/rui/styles.css"
```

It defines the semantic design tokens, the `.rui-theme` scope, the dark-mode variant,
and component styles. It does **not** download or bundle webfonts — `@bzync/rui` uses
system fallbacks by default to keep the stylesheet small and avoid unexpected network
requests. Load any font in your application and override `--font-sans`, `--font-display`,
and `--font-mono` on `.rui-theme` (or via `ThemeProvider`'s `fonts` option).

## Theming

### ThemeProvider

`ThemeProvider` establishes a theme scope. Place one near the root, or wrap any subtree
to give it its own theme.

```tsx
import { ThemeProvider } from "@bzync/rui"

<ThemeProvider
  defaultTheme="system"      // "light" | "dark" | "system"
  storageKey="app-theme"     // localStorage key, or false to disable persistence
  applyToRoot                // also toggle the `dark` class on <html>
  palette={{ accent, neutral, radius, fonts, spacing, shadows, colors, tokens }}
  lightPalette={{ /* overrides applied only in light mode */ }}
  darkPalette={{ /* overrides applied only in dark mode */ }}
>
  {children}
</ThemeProvider>
```

Controlled usage is supported by passing `theme` and `onThemeChange` instead of
`defaultTheme`.

**Palette shape** (`ThemePalette`, all fields optional):

| Field | Type | Purpose |
|---|---|---|
| `accent` | `Partial<Record<50‥950, string>>` | Primary/action color scale |
| `neutral` | `Partial<Record<50‥950, string>>` | Grayscale / surfaces / borders |
| `colors` | `ThemeColors` | Named semantic colors (bg, surface, foreground, border, status colors, focus ring…) |
| `radius` | `Partial<Record<"sm"‥"2xl" \| "full", string>>` | Corner radii |
| `fonts` | `ThemeFonts` | `sans`, `display`, `mono` families |
| `spacing` | `Record<string, string>` | Spacing scale entries |
| `shadows` | `Partial<Record<"xs"‥"2xl", string>>` | Elevation shadows |
| `tokens` | `Partial<Record<\`--${string}\`, string \| number>>` | Any CSS custom property, escape hatch |

### useTheme

```tsx
import { useTheme } from "@bzync/rui"

function Example() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()
  // theme:         "light" | "dark" | "system"  (the user's selection)
  // resolvedTheme: "light" | "dark"             (after resolving "system")
  return <button onClick={toggleTheme}>Now: {resolvedTheme}</button>
}
```

`useTheme` must be called inside a `ThemeProvider`.

### ThemeToggle

```tsx
import { ThemeToggle } from "@bzync/rui"

<ThemeToggle
  showLabel
  lightLabel="Light"
  darkLabel="Dark"
  lightIcon={<SunIcon />}
  darkIcon={<MoonIcon />}
/>
```

Renders a button with `aria-pressed` and an `aria-label` that reflects the current state.

### Semantic tokens

Author custom components against the semantic tokens rather than raw palette values:
`bg`, `surface`, `surface-raised`, `surface-muted`, `foreground`, `muted-foreground`,
`border`, `border-strong`, `primary`, `primary-foreground`, `destructive`, the status
colors, and `focus-ring`. They adapt to light/dark and to any palette override
automatically.

## Importing components

The root entry re-exports everything for convenience:

```tsx
import { Button, Modal, DataTable } from "@bzync/rui"
```

Per-component subpath entries let a bundler pull in only what an application uses:

```tsx
import { Button } from "@bzync/rui/button"
import { Modal } from "@bzync/rui/modal"
import { BarChart } from "@bzync/rui/charts"
```

Both forms are tree-shakeable — the package sets `"sideEffects": ["**/*.css"]` and ships
ESM — but subpath imports keep dependency graphs smallest and are the recommended default
for libraries and performance-sensitive apps.

## Server components and SSR

Client components are marked with the `"use client"` directive, so React Server
Components and frameworks like Next.js App Router can import and render them directly.
`ThemeProvider` reads `localStorage` only on the client and resolves `"system"` with
`matchMedia`; render it in a client boundary and pass a `defaultTheme` so the server and
first client paint agree.

## Accessibility and motion

- Interactive components expose native element semantics and keyboard behavior.
- Modal dialogs label their content, trap keyboard focus, close on <kbd>Escape</kbd>,
  restore focus to the previously focused element on close, and preserve the page's
  prior scroll-lock state.
- Menus, listboxes, tabs, and toggles implement roving focus and arrow-key navigation.
- Non-essential animation inside the `.rui-theme` scope is disabled when the user has
  `prefers-reduced-motion: reduce` set.
- Icon-only controls (`IconButton`, `InfoButton`, `CopyButton`) require an accessible
  `label`.

## Component catalog

Import any of these from the root or from `@bzync/rui/<kebab-name>`.

### Providers and theming

| Component / export | Notes |
|---|---|
| `ThemeProvider` | Token-driven theme scope; light/dark, controlled or uncontrolled, persistence, `applyToRoot` |
| `useTheme()` | `{ theme, resolvedTheme, setTheme, toggleTheme }` |
| `ThemeToggle` | Accessible light/dark switch with custom icons and labels |
| `SnackbarProvider` / `useSnackbar()` | Programmatic toast notifications |
| `CommandProvider` / `CommandPalette` | App-wide searchable command palette |
| `cn()` | `clsx` + `tailwind-merge` class combiner |

### Actions

| Component | Key props |
|---|---|
| `Button` | `variant: primary \| secondary \| ghost \| outline \| destructive \| link`, `size: sm \| md \| lg \| icon`, `loading`, `icon`, `iconPosition` |
| `ButtonGroup` | `orientation`, `aria-label`; wraps `Button` children with `role="group"` |
| `IconButton` / `InfoButton` | `label` (required for a11y), icon |
| `CopyButton` | `value` (text to copy), `label`, `timeout` |
| `Toggle` / `ToggleGroup` / `ToggleGroupItem` | `pressed` / `defaultPressed`, `onPressedChange`, `type: single \| multiple`, `variant`, `size`, `orientation`, `loop` |
| `BillingIntervalToggle` | `value: monthly \| yearly`, `onChange` |

### Forms

| Component | Key props |
|---|---|
| `Input` | `label`, `hint`, `error`, `prefix` / `suffix`, `size` |
| `Textarea` | `label`, `hint`, `error`, `rows` |
| `NumberInput` | `value` / `defaultValue`, `min`, `max`, `step`, `onChange` |
| `OtpInput` | `length`, `value`, `onChange`, `label` |
| `Select` | `options`, `label`, `multiple`, groups, searchable, `onChange` |
| `Autocomplete` | `options`, `multiple`, custom filter, single/multi triggers |
| `Checkbox` | `label`, `checked` / `defaultChecked`, `onCheckedChange` |
| `Radio` / `RadioGroup` | `value`, `onChange`, `options` |
| `Switch` | `label`, `checked`, `onCheckedChange` |
| `Slider` | `value` / `defaultValue`, `min`, `max`, `step`, `label` |
| `Rating` | `value` / `defaultValue`, `max`, `size`, `readOnly`, `onValueChange` |
| `DatePicker` | `label`, `value`, `onChange` |
| `Calendar` | `value: Date`, `onChange`, month/week views |
| `TimePicker` | `value` / `defaultValue`, `format: 12 \| 24`, `minuteStep`, `showSeconds`, `min` / `max`, `clearable` |
| `FileUpload` | `label`, `accept`, `multiple`, `onFilesChange` |
| `Label` | `htmlFor`, `required`, `hint` |
| `FormField` | `label`, `htmlFor`, `required`, `hint`, `error` — wraps a control |
| `Stepper` | `steps`, `activeStep` |
| `Kbd` | keyboard-key children |

### Display

| Component | Key props |
|---|---|
| `Badge` / `Tag` | `variant`, `dot`; `Tag` adds `onRemove` |
| `Avatar` / `AvatarGroup` / `AvatarGroupOverflow` | `name`, `src`, `size`, initials fallback; group `spacing`, `count` |
| `Card` (`CardHeader` / `CardTitle` / `CardDescription` / `CardBody` / `CardFooter`) | composition |
| `Callout` / `Alert` | `title`, `variant`; `Alert` adds `dismissable`, `onDismiss` |
| `Stat` / `StatusDot` | `Stat`: `label`, `value`, `trend`, `trendValue`; `StatusDot`: `status`, `label` |
| `Tooltip` | `content`, trigger child |
| `Link` | `href`, `variant` |
| `Typography`: `Heading` / `Text` / `Prose` / `Time` | `Heading`: `as h1‥h6`, `size`, `tone`, `weight`, `balance`; `Text`: `variant`, `size`, number/date/currency formatting; `Time`: renders `<time datetime>` |
| `Code` / `InlineCode` / `CodeBlock` / `CodeEditor` | `code`, `filename`, `showLineNumbers`, `value` / `onChange` |
| `Blockquote` | `variant`, `size`, `cite`, `source` / `sourceHref` |
| `Currency` | `value: number \| bigint`, `currency`, `locale`, `accounting`, `tone`, `size` |
| `DescriptionList` (`DescriptionItem` / `DescriptionTerm` / `DescriptionDetails`) | `columns: 1 \| 2 \| 3`, `density`, `orientation` |
| `List` / `ListItem`, `Timeline`, `Tree` | item collections; `Tree` is expandable |
| `Table` (`TableHeader` / `TableHead` / `TableBody` / `TableRow` / `TableCell`) | styled primitive table |
| `Divider` / `Separator` | `orientation`, `variant`, `spacing`, optional `label` |
| `ScrollArea` | `orientation: vertical \| horizontal \| both`, `hideScrollbar`, `keyboardNavigable` |
| `AspectRatio` | `ratio: number` |
| `Skeleton` (+ `SkeletonAvatar` / `SkeletonCard` / `SkeletonTable` / `SkeletonText` / `SkeletonTopbar`) | loading placeholders |
| `Spinner` / `Progressbar` | `size`; `value`, `max` |
| `EmptyState` / `ErrorState` | `title`, `description`, `error`, action slot |
| `RichText` / `RichTextEditor` | rendered content and editor |
| `AuthBackdrop` | decorative auth-screen background |

### Overlays and feedback

| Component | Key props |
|---|---|
| `Modal` (`ModalHeader` / `ModalTitle` / `ModalDescription` / `ModalBody` / `ModalFooter`) | `open`, `onClose`, `title`, `size: sm‥7xl \| full`, `ModalBody` `scrollable` |
| `Drawer` | `open`, `onClose`, `title`, `size`, focus trap |
| `ConfirmDialog` | `open`, `onConfirm`, `onCancel`, `title` |
| `Popover` / `PopoverContent` | trigger, `open` / `onOpenChange` |
| `DropdownMenu` | `trigger`, `items: { label, onClick }[]` |
| `Command` / `CommandPalette` / `CommandProvider` | searchable command palette |
| `SnackbarProvider` / `useSnackbar()` | queue and dismiss toasts programmatically |
| `Tabs` (`TabsList` / `TabsTrigger` / `TabsContent`) | `value`, `onValueChange` |
| `Accordion` | `items: { id, trigger, content }[]` |
| `Pagination` | `page`, `totalPages`, `onPageChange` |
| `Terminal` / `TerminalBlock` / `TerminalEmulator` | virtual filesystem, runnable shell commands |

### Navigation and layout

| Component | Key props |
|---|---|
| `AppShell` (`AppShellHeader` / `AppShellBody` / `AppShellMain` / `Footer`) | app frame; `sticky`, `scrollable`, `fixed` |
| `Container` | `size: sm‥xl \| full`, `gutter` |
| `Stack` / `Inline` / `PageHeader` | spacing and header primitives |
| `Navbar` / `Sidebar` / `Topbar` / `BottomBar` | `items: NavigationItem[]`, `activeId`, `onSelect` |
| `NavigationLink` | `id`, `label`, `href`, `icon`, `badge`, `active`, `compact` |
| `Breadcrumb` | `items` |
| `SEO` | document head tags |

### Data

| Component | Key props |
|---|---|
| `DataTable<T>` | `columns: ColumnDef<T>[]` (`{ key, header, cell, sortable?, searchable?, align?, width? }`), `data: T[]`, `searchable`, `searchPlaceholder`, `pageSizeOptions`, `density`, `loading`, `emptyMessage`, `onRowClick`, `unstyled` — built-in sort, search, and pagination. `T` must have an `id`. |

## Common recipes

### Button

```tsx
import { Button } from "@bzync/rui/button"

<Button variant="primary" size="lg" loading={isSaving} onClick={save}>
  Save changes
</Button>

<Button variant="outline" icon={<PlusIcon />} iconPosition="left">
  New item
</Button>
```

### A labelled, validated field

```tsx
import { FormField } from "@bzync/rui/form-field"
import { Input } from "@bzync/rui/input"

<FormField label="Email" htmlFor="email" required error={errors.email}>
  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
</FormField>
```

### Select

```tsx
import { Select } from "@bzync/rui/select"

<Select
  label="Environment"
  options={[
    { label: "Production", value: "prod" },
    { label: "Staging", value: "staging" },
    { label: "Development", value: "dev" },
  ]}
  value={env}
  onChange={setEnv}
/>
```

### Modal

```tsx
import { Modal, ModalBody, ModalFooter } from "@bzync/rui/modal"
import { Button } from "@bzync/rui/button"

const [open, setOpen] = useState(false)

<Modal open={open} onClose={() => setOpen(false)} title="Delete project" size="sm">
  <ModalBody>This action cannot be undone.</ModalBody>
  <ModalFooter>
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
  </ModalFooter>
</Modal>
```

### Toasts

```tsx
import { SnackbarProvider, useSnackbar } from "@bzync/rui/snackbar"

function Root() {
  return (
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  )
}

function SaveButton() {
  const { show } = useSnackbar()
  return <Button onClick={() => show({ title: "Saved", variant: "success" })}>Save</Button>
}
```

`useSnackbar()` returns `{ show, dismiss, dismissAll }`. `show(opts)` returns the toast id;
pass a stable `id` in `opts` to replace an existing toast in place instead of stacking.

### DataTable

```tsx
import { DataTable } from "@bzync/rui/datatable"

type Row = { id: string; name: string; role: string; seats: number }

<DataTable<Row>
  data={members}
  columns={[
    { key: "name", header: "Name", cell: (r) => r.name, sortable: true, searchable: true },
    { key: "role", header: "Role", cell: (r) => r.role, sortable: true },
    { key: "seats", header: "Seats", cell: (r) => r.seats, align: "right", sortable: true },
  ]}
  searchable
  pageSizeOptions={[10, 25, 50]}
  onRowClick={(row) => open(row.id)}
/>
```

## Charts

The chart set is a separate subpath entry so it stays out of the main graph unless used.
Every chart renders plain SVG and takes data arrays — no canvas, no chart engine.

```tsx
import { BarChart, LineChart, DonutChart } from "@bzync/rui/charts"

<BarChart data={[{ label: "Jan", value: 42 }, { label: "Feb", value: 55 }]} />
```

Available: `BarChart`, `LineChart`, `MultiLineChart`, `DonutChart`, `ScatterChart`,
`GanttChart`, `HeatmapChart`, `RadarChart`, `FunnelChart`, `WaterfallChart`. See
[`src/components/charts`](./src/components/charts) for exact per-chart props.

## Hooks and utilities

Lifecycle-correct hooks (mount/update/unmount with cleanup), re-exported from the root:

| Hook | Purpose |
|---|---|
| `useIsMounted()` | Guard async setState after unmount |
| `useIsomorphicLayoutEffect()` | `useLayoutEffect` on the client, `useEffect` on the server |
| `usePrevious(value)` | Previous render's value |
| `useUpdateEffect(fn, deps)` | Effect that skips the first render |
| `useEventCallback(fn)` | Stable callback identity with fresh closure |
| `useControllableState(opts)` | Controlled/uncontrolled state pattern |
| `useMediaQuery(query)` | Subscribe to a media query |
| `useAbortSignal()` | Abort in-flight work on unmount |
| `useFocusTrap(ref, active)` | Trap focus within a container |
| `useOutsideClick(ref, handler)` | Detect clicks outside an element |

Utilities: `cn()`, focus helpers, `Portal`, and assertion helpers from `@bzync/rui/utils`;
`ErrorBoundary` from the root; `createSafeEffect` and mount helpers from `@bzync/rui`'s
lifecycle exports; `KEY`, `DURATIONS`, and `FOCUSABLE_SELECTOR` constants.

## TypeScript

`@bzync/rui` is written in TypeScript and ships `.d.ts` files for the root and every
subpath entry. Prop types, variant unions (`ButtonVariant`, `ButtonSize`, …), and the
theming types (`Theme`, `ThemePalette`, `ThemeColors`, `ColorShade`, …) are all exported.
No `@types/*` package is required.

## Browser and React support

- **React** `^18.2.0 || ^19.0.0`
- **Modern evergreen browsers.** The library relies on CSS custom properties, `matchMedia`,
  and standard DOM APIs; no polyfills are bundled.
- **SSR / RSC** via the `"use client"` boundary described above.

## Bundle and dependencies

- `dependencies`: **none**. `clsx`/`tailwind-merge` logic is inlined; icons are inlined SVG.
- Published output is **not minified** — readable ESM and CJS ship to the registry so the
  code is auditable; your bundler minifies the final app build.
- `sideEffects` is limited to `**/*.css`, so unused components are dropped by any
  tree-shaking bundler.

## Versioning

`@bzync/rui` follows [semantic versioning](https://semver.org/). While the major version
is `0`, minor releases may contain breaking changes; pin a version or a tight range and
review the release notes before upgrading. Releases are published from CI with npm
[provenance](https://docs.npmjs.com/generating-provenance-statements) attestations.

## Documentation

Full component documentation and live, themeable demos are published at
**[bzync.github.io/rui](https://bzync.github.io/rui/)**. A push to `main` deploys the
latest docs via GitHub Pages.

## Contributing

Bug reports, accessibility fixes, documentation improvements, and focused component
contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the development
setup, the verification gate, and the release process, and
[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## Security

Report vulnerabilities privately using the process in [SECURITY.md](./SECURITY.md).
Please do not open public issues for security reports.

## License

[ISC](./LICENSE) © 2026 Bzync

## Maintainer

`@bzync/rui` is maintained by [Rayan Reynaldo](https://www.bzync.com), Founder of Bzync
([www.bzync.com](https://www.bzync.com)).

If `@bzync/rui` is useful to you, you can support its continued development on
[Buy Me a Coffee](https://buymeacoffee.com/adminjw).
