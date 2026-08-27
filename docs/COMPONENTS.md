# COMPONENTS.md — Inventory for @bzync/rui

> Generated from `src/index.ts`, `src/components/*.tsx`, and `demo/src/App.tsx`. Import from root or subpath — both work; subpath is better for tree-shaking.

```tsx
// root (convenience)
import { Button } from "@bzync/rui"
// subpath (preferred for small bundles)
import { Button } from "@bzync/rui/button"
import { BarChart } from "@bzync/rui/charts"
import "@bzync/rui/styles.css" // once, near app root
```

## Providers & theming

| Component | File | Import | Notes |
|---|---|---|---|
| `ThemeProvider` | `theme-provider.tsx` | `@bzync/rui` | `palette/lightPalette/darkPalette: {accent, neutral, colors, radius, fonts, spacing, shadows, tokens}`, `defaultTheme/theme/onThemeChange`, `storageKey`, `applyToRoot`. Semantic colors cover backgrounds, foregrounds, surfaces, borders, actions, statuses, and focus. Renders `.rui-theme` scope. |
| `useTheme()` | `theme-provider.tsx` | `@bzync/rui` | `{theme, resolvedTheme, setTheme, toggleTheme}` — must be inside provider. |
| `ThemeToggle` | `theme-toggle.tsx` | `@bzync/rui` | `lightIcon/darkIcon`, `showLabel`, `lightLabel/darkLabel`. `aria-pressed`, `aria-label`. |
| `cn()` | `lib/cn.ts` | `@bzync/rui` | `cn(...ClassValue[]) => twMerge(clsx(...))` |

## Actions

| Component | Key props |
|---|---|
| `Button` | `variant: primary\|secondary\|ghost\|outline\|destructive`, `size: sm\|md\|lg`, `loading`, `icon`, `iconPosition: left\|right` |
| `IconButton` / `InfoButton` | `label` (aria), icon |
| `CopyButton` | `text`, `onCopy` |
| `BillingIntervalToggle` | `value: monthly\|yearly`, `onChange` |
| `ButtonGroup` | `orientation: horizontal\|vertical`, `aria-label`, wraps `Button` children, `role=group` |
| `Toggle` / `ToggleGroup` / `ToggleGroupItem` | `pressed/defaultPressed`, `onPressedChange`, `variant: default\|outline`, `size: sm\|md\|lg\|icon`, `type: single\|multiple`, `orientation`, `loop`, `aria-pressed` |

## Forms

| Component | Key props |
|---|---|
| `Input` | `label`, `hint`, `error`, `prefix/suffix`, `size: sm\|md\|lg`, `id` auto via `useId` |
| `Textarea` | `label`, `hint`, `error`, rows |
| `Select` | `options`, `label`, `multiple?`, `onChange`, groups, searchable, color |
| `Autocomplete` | `options`, `multiple?`, filter, dropdown, triggers |
| `Checkbox` | `label`, `checked/defaultChecked`, `onChange/onCheckedChange` |
| `Switch` | `label`, `checked`, `onCheckedChange` |
| `Radio` / `RadioGroup` | `value`, `onChange`, `label`, `options` |
| `Slider` | `label`, `value/defaultValue`, `min/max/step`, `onChange` |
| `NumberInput` | `label`, `value/defaultValue`, `onChange`, `min/max/step` |
| `OtpInput` | `length`, `value`, `onChange`, `label` |
| `FileUpload` | `label`, `accept`, `multiple`, `onFilesChange` |
| `DatePicker` | `label`, `value`, `onChange` |
| `Calendar` | `value: Date`, `onChange`, month/week views |
| `Label` | `htmlFor`, `required`, `hint` |
| `FormField` | `label`, `htmlFor`, `required`, `hint`, `error` |
| `Kbd` | children (keys) |
| `Stepper` | steps, activeStep |
| `TimePicker` | `label`, `value/defaultValue`, `onValueChange`, `format: 12\|24`, `minuteStep`, `showSeconds`, `min/max`, `side: top\|bottom`, `clearable`, `placeholder`, dialog + `listbox/option` time columns |
| `Rating` | `label`, `value/defaultValue`, `onValueChange`, `max`, `size: sm\|md\|lg`, `readOnly`, `showLabel/showValue`, `radiogroup` + `radio` |
| `ToggleGroup` | see Actions — `ToggleGroup` / `ToggleGroupItem` |

## Display

| Component | Key props |
|---|---|
| `Badge` | `variant`, `dot?`, children |
| `Tag` | `onRemove`, label |
| `Avatar` | `name`, `src`, `size`, fallback initials |
| `Card` + `CardHeader/Title/Description/Body/Footer` | composition |
| `Callout` | `title`, `variant` |
| `Stat` | `label`, `value`, `trend: up\|down`, `trendValue` |
| `StatusDot` | `status: online\|offline\|busy\|away`, `label` |
| `Alert` | `title`, `variant`, `dismissable`, `onDismiss` |
| `Tooltip` | `content`, trigger |
| `Link` | `href`, `variant` |
| `Code` / `InlineCode` / `CodeBlock` / `CodeEditor` | `code`, `filename`, `showLineNumbers`, `value/onChange`, `InlineCode` is `forwardRef<HTMLElement>` + `break-words` |
| `Heading` / `Text` / `Prose` / `Time` | `Heading: as h1..h6, size xs..2xl, tone, weight, balance`, `Text: variant body\|lead\|muted\|caption\|overline\|date\|time\|currency, size, weight, align, wrap, value/locale/timeZone/hour12/formatOptions/currency`, `Prose: as div\|article\|section, size, width`, `Time: value→<time datetime>`, tabular-nums |
| `EmptyState` / `ErrorState` | `title`, `description`, `error`, actions |
| `Skeleton` family | `Skeleton`, `SkeletonAvatar/Card/Table/Text/Topbar` |
| `Spinner` | `size` |
| `Progressbar` | `value`, `max` |
| `AspectRatio` | `ratio: number`, `style`, `data-ratio`, `relative w-full overflow-hidden` |
| `AvatarGroup` / `AvatarGroupOverflow` | `spacing: tight\|normal\|loose`, `count`, `size: xs\|sm\|md\|lg\|xl`, `role=group` + `aria-label` |
| `Blockquote` | `variant: default\|accent\|subtle`, `size: sm\|md\|lg`, `cite`, `source/sourceHref`, footer link |
| `Currency` | `value: number\|bigint`, `currency`, `locale`, `accounting`, `options: CurrencyFormatOptions`, `tone: auto\|default\|positive\|negative\|muted`, `size`, `fallback` |
| `DescriptionList` / `DescriptionItem/Term/Details` | `columns: 1\|2\|3`, `density: compact\|default\|relaxed`, `orientation: stacked\|inline`, `dl/dt/dd` |
| `Divider` | `orientation: horizontal\|vertical`, `variant: solid\|dashed\|dotted`, `spacing: none\|sm\|md\|lg`, `label`, `decorative`, `separator` / `presentation` |
| `ScrollArea` | `orientation: vertical\|horizontal\|both`, `hideScrollbar`, `keyboardNavigable`, `data-orientation`, overscroll-contain |
| `Separator` | `orientation` |
| `List` / `ListItem` | items |
| `Timeline` | items |
| `Tree` | nodes, expandable |
| `Table` family | `Table`, `TableHeader/Head/Body/Row/Cell` — primitive table |
| `AuthBackdrop` | decorative |
| `RichText` / `RichTextEditor` | content, onChange |

## Feedback & overlays

| Component | Key props |
|---|---|
| `Modal` | `open`, `onClose`, `title`, `description`, `size: sm\|md\|lg\|xl\|2xl\|7xl\|full`, `scrollable`, focus trap + Escape |
| `Drawer` | `open`, `onClose`, `title`, `size`, focus trap |
| `ConfirmDialog` | `open`, `onConfirm`, `onCancel`, `title` |
| `Popover` + `PopoverContent` | trigger, open/onOpenChange |
| `DropdownMenu` | `trigger`, `items: [{label,onClick}]` |
| `Command` / `CommandPalette` + `CommandProvider` | searchable command palette |
| `SnackbarProvider` + `useSnackbar()` | programmatic toasts |
| `Pagination` | `page`, `totalPages`, `onPageChange` |
| `Tabs` / `TabsList/Trigger/Content` | `value`, `onValueChange` |
| `Accordion` | `items: [{id, trigger, content}]` |
| `Terminal` / `TerminalBlock` / `TerminalEmulator` | `fs`, shell commands, run |
| `SnackbarProvider` + `useSnackbar()` | programmatic toasts |
| `Pagination` | `page`, `totalPages`, `onPageChange` |
| `Tabs` + `TabsList/Trigger/Content` | `value`, `onValueChange` |
| `Accordion` | `items: [{id, trigger, content}]` |
| `Terminal` / `TerminalBlock` / `TerminalEmulator` | `fs`, shell commands, `run` |

## Navigation & layout

| Component | Key props |
|---|---|
| `AppShell` | `fixed?` |
| `AppShellBody` / `AppShellMain {scrollable?}` / `AppShellHeader {sticky?}` / `Footer {sticky?}` | layout composition |
| `Container` | `size: sm\|md\|lg\|xl\|full`, `gutter?` |
| `Stack` / `Inline` / `PageHeader` | spacing/header |
| `Navbar` / `Sidebar` / `Topbar` / `BottomBar` | `items: NavigationItem[]`, `activeId`, `onSelect` |
| `NavigationLink` | `id`, `label`, `href?`, `icon?`, `badge?`, `active?`, `compact?` |
| `Breadcrumb` | `items` |
| `DropdownMenu` / `Drawer` / `Pagination` / `Stepper` | see above |

## Data

| Component | Key props |
|---|---|
| `Table` family | primitive — `Table/Head/Header/Body/Row/Cell` |
| `DataTable<T>` | `columns: ColumnDef[]`, `data: T[]`, `searchable`, `searchPlaceholder`, `pageSizeOptions`, `defaultPageSize`, `loading`, `emptyMessage`, `onRowClick` — built-in sort/filter/pagination |

## Charts (`@bzync/rui/charts`)

All render SVG and accept data arrays. Import via `charts` subpath entry.

`BarChart`, `LineChart`, `MultiLineChart` (`labels`, `series: {label,data}[]`), `DonutChart` (`data`, `centerLabel`), `ScatterChart` (`series: {label,data:{x,y,label}[]} `), `GanttChart` (`tasks: {id,label,start,end}[]`), `HeatmapChart` (`data:number[][]`, `rowLabels`, `colLabels`), `RadarChart` (`axes`, `series`), `FunnelChart`, `WaterfallChart` — see `src/components/charts/*.tsx` for exact props.

---

## Styling notes

- Global theme in `src/styles/globals.css`: `--color-accent-*` (semantic), `--color-navy-*`, `--color-bg/surface`, `--font-sans/mono/display`, shadows. Use these tokens; avoid raw Tailwind `blue`/`red` in new code.
- Dark mode via `.dark` class (Tailwind `@custom-variant dark`). `ThemeProvider` toggles it locally or on `<html>` with `applyToRoot`.
- Component-facing semantic tokens include `bg`, `foreground`, `surface`, `surface-raised`, `surface-muted`, `border`, `border-strong`, `muted-foreground`, `primary`, `destructive`, status colors, and `focus-ring`. Prefer these over raw neutral palette utilities when authoring new primitives.
- Motion disabled under `@media (prefers-reduced-motion: reduce)` inside `.rui-theme`.
- Webfonts are application-owned. Load them outside the library and configure `ThemeProvider` font values or the `--font-sans`, `--font-display`, and `--font-mono` variables.

## Quick lookup

- Full inventory: `src/components/*.tsx` + `src/components/{autocomplete,calendar,charts,datatable,select,terminal}/*`
- Demo examples: `demo/src/sections/*.tsx`
- Tests (contract reference): `src/__tests__/*.test.tsx`
