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
| `ThemeSwitcher` | `theme-switcher.tsx` | `@bzync/rui` | `variant: segmented\|dropdown\|switch\|radio\|icon-button`, `size: sm\|md\|lg`, `includeSystem`, `showLabels`, `value`, `onChange`. Multiple UI/UX layout options for light, dark, and system preferences. |
| `cn()` | `lib/cn.ts` | `@bzync/rui` | `cn(...ClassValue[]) => twMerge(clsx(...))` |

## Actions

| Component | Key props |
|---|---|
| `Button` | `variant: primary\|secondary\|ghost\|outline\|danger\|link` (`destructive` is a deprecated alias), `size: sm\|md\|lg`, `loading`, `icon`, `iconPosition: left\|right` |
| `IconButton` / `InfoButton` | `label` (aria), icon |
| `CopyButton` | `text`, `onCopy` |
| `BillingIntervalToggle` | `value: monthly\|yearly`, `onChange` |
| `ThemeSwitcher` | `variant: segmented\|dropdown\|switch\|radio\|icon-button`, `size: sm\|md\|lg`, `includeSystem`, `value`, `onChange` |
| `InlineEdit` | `value/defaultValue`, `onSave`, `onCancel`, `validate`, `multiline`, `saveOnBlur`, `placeholder`, `disabled` |
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
| `RangeSlider` | `label`, `value/defaultValue`, `min/max/step`, `onChange/onChangeEnd`, `formatValue`, `showTooltip`, `marks`, `size: sm\|md\|lg` |
| `NumberInput` | `label`, `value/defaultValue`, `onChange`, `min/max/step` |
| `OtpInput` | `length`, `value`, `onChange`, `label` |
| `FileUpload` | `label`, `accept`, `multiple`, `onFilesChange` |
| `DatePicker` | `label`, `value`, `onChange` |
| `DateTimePicker` | `label`, `value/defaultValue`, `onChange`, `format: 12\|24`, `is24Hour`, `presets`, `minDate/maxDate`, `clearable` |
| `TimePicker` | `label`, `value/defaultValue`, `onValueChange`, `format: 12\|24`, `minuteStep`, `showSeconds`, `min/max`, `side: top\|bottom`, `clearable`, `placeholder`, dialog + `listbox/option` time columns |
| `ColorPicker` | `label`, `value/defaultValue`, `onChange`, `presets/swatches`, `showEyeDropper`, `showAlpha`, `size: sm\|md\|lg` |
| `Calendar` | `value: Date`, `onChange`, month/week views |
| `Label` | `htmlFor`, `required`, `hint` |
| `FormField` | `label`, `htmlFor`, `required`, `hint`, `error` |
| `Kbd` | children (keys) |
| `Stepper` | steps, activeStep |
| `Rating` | `label`, `value/defaultValue`, `onValueChange`, `max`, `size: sm\|md\|lg`, `readOnly`, `showLabel/showValue`, `radiogroup` + `radio` |
| `TagInput` | `label`, `value/defaultValue`, `onChange`, `maxTags`, `transform`, `hint`, `error`, `size: sm\|md\|lg` |
| `PasswordInput` | `label`, `hint`, `error`, toggle reveal/hide password action with accessible `aria-label` |
| `SearchInput` | `label`, `value/defaultValue`, `onSearch`, `onClear`, `loading`, clear button, search glyph |
| `MaskedInput` | `mask`, `definitions`, `value/defaultValue`, `onChange`, `unmask`, slot characters |
| `CurrencyInput` | `currency`, `locale`, `value/defaultValue`, `onChange`, formatting on blur/input |
| `PhoneInput` | `defaultCountry`, `countries`, `value/defaultValue`, `onChange` |
| `ToggleGroup` | see Actions — `ToggleGroup` / `ToggleGroupItem` |

## Display

| Component | Key props |
|---|---|
| `Icon` / `Icons` | `name: IconName`, `size: xs\|sm\|md\|lg\|xl\|number`, `tone: default\|muted\|accent\|success\|warning\|danger\|info`, `spin: boolean`, `strokeWidth: number`, `label: string`, 50+ SVG icons, `createIcon` factory |
| `Badge` | `variant`, `dot?`, children |
| `Tag` | `onRemove`, label |
| `Avatar` | `name`, `src`, `size`, fallback initials |
| `Image` | `src`, `alt`, `fallbackSrc`, `aspectRatio`, `placeholder: blur\|skeleton`, `lazy`, fade-in transition |
| `Lightbox` | `images: [{src, alt, caption}]`, `open`, `onOpenChange`, `index`, `onIndexChange`, arrow keys, swipe, thumbnails |
| `Resizable` | `direction: horizontal\|vertical`, `ResizablePanelGroup`, `ResizablePanel {defaultSize, minSize, maxSize}`, `ResizableHandle {withHandle}` |
| `PanoTour` suite | `PanoViewer` (360° WebGL equirectangular viewer, scene navigation, radar compass, hotspots), `PanoTourDialog` (full-screen modal tour with TTS narration and captions), `PanoTourButton`, `PanoTourEditor` (complete tour management studio), `PanoBackdrop` (interactive 360° hero banner) |
| `VisuallyHidden` | screen-reader-only accessible container |
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
| `ResponsiveDialog` | `open`, `onOpenChange`, `breakpoint: sm`, `ResponsiveDialogTrigger/Content/Header/Footer/Close`, modal on desktop, swipeable bottom sheet on mobile |
| `Banner` | `title`, `variant: subtle\|solid`, `tone: info\|success\|warning\|danger`, `dismissible`, `storageKey`, `action` |
| `HoverCard` | `HoverCard`, `HoverCardTrigger`, `HoverCardContent`, preview cards with `openDelay` and `closeDelay` |
| `Drawer` | `open`, `onClose`, `title`, `size`, focus trap |
| `Sheet` | `open`, `onClose`, `snapPoints`, `defaultSnap`, draggable handle |
| `Tour` | `steps: TourStep[]`, `open/onOpenChange`, `step/onStepChange`, `mask`, spotlight, keyboard navigation |
| `NotificationCenter` | `items`, `unreadCount`, `onItemsChange`, `categories`, `onMarkAllAsRead`, `onClearAll` |
| `ConfirmDialog` | `open`, `onConfirm`, `onCancel`, `title` |
| `Popover` + `PopoverContent` | trigger, open/onOpenChange |
| `DropdownMenu` | `trigger`, `items: [{label,onClick}]` |
| `ContextMenu` | `trigger`, `items: [{label,icon,onClick,disabled,destructive}]`, right-click and Shift+F10/Context keyboard activation |
| `Command` / `CommandPalette` + `CommandProvider` | searchable command palette |
| `SnackbarProvider` + `useSnackbar()` | programmatic toasts, `snackbar.promise(promise, {loading, success, error})` helper |
| `Pagination` | `page`, `totalPages`, `onPageChange` |
| `Tabs` / `TabsList/Trigger/Content` | `value`, `onValueChange` |
| `Accordion` | `items: [{id, trigger, content}]` |
| `Collapsible` | `open/onOpenChange`, `CollapsibleTrigger`, `CollapsibleContent`, WAI-ARIA disclosure primitive |
| `Terminal` / `TerminalBlock` / `TerminalEmulator` | `fs`, shell commands, run |

## Navigation & layout

| Component | Key props |
|---|---|
| `AppShell` | `fixed?` |
| `AppShellBody` / `AppShellMain {scrollable?}` / `AppShellHeader {sticky?}` / `Footer {sticky?}` | layout composition |
| `Container` | `size: sm\|md\|lg\|xl\|full`, `gutter?` |
| `Stack` / `Inline` / `PageHeader` | spacing/header |
| `Navbar` / `Sidebar` / `Topbar` / `BottomBar` | `items: NavigationItem[]` (supports nested submenus via `children`), `activeId`, `onSelect`, expandable disclosure in expanded sidebar, portalled flyout menu in rail mode |
| `NavigationMenu` | `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuLink` |
| `Menubar` | `Menubar`, `MenubarMenu`, `MenubarTrigger`, `MenubarContent`, `MenubarItem`, `MenubarSeparator`, `MenubarShortcut`, `MenubarCheckboxItem`, `MenubarRadioGroup`, `MenubarRadioItem` |
| `NavigationLink` | `id`, `label`, `href?`, `icon?`, `badge?`, `active?`, `compact?` |
| `Breadcrumb` | `items` |
| `DropdownMenu` / `Drawer` / `Pagination` / `Stepper` | see above |

## Data

| Component | Key props |
|---|---|
| `Table` family | primitive — `Table/Head/Header/Body/Row/Cell` |
| `DataTable<T>` | `columns: ColumnDef[]`, `data: T[]`, `searchable`, `searchPlaceholder`, `pageSizeOptions`, `defaultPageSize`, `loading`, `emptyMessage`, `onRowClick` — built-in sort/filter/pagination |
| `SortableList` / `Kanban` | `items/columns`, `onReorder/onChange`, `getLabel`, `renderItem/renderCard`, keyboard & pointer drag-and-drop |
| `DndContext` / `Droppable` / `Draggable` / `DragHandle` | `onDragStart/Move/End`, `useDndContext`, `useDroppable`, `useDraggable`, composable kanban/scrum/list drag-and-drop with keyboard & pointer accessibility |

## Charts (`@bzync/rui/charts`)

All render SVG and accept data arrays. Import via `charts` subpath entry.

`BarChart`, `StackedBarChart`, `LineChart`, `MultiLineChart`, `AreaChart`, `DonutChart`, `ScatterChart`, `GanttChart`, `HeatmapChart`, `RadarChart`, `FunnelChart`, `WaterfallChart`, `Sparkline`, `Gauge` — see `src/components/charts/*.tsx` for exact props.

## Hooks (`@bzync/rui` or `@bzync/rui/hooks`)

| Hook | Returns | Notes |
|---|---|---|
| `useHotkeys(combos, callback)` | `void` | Binds global or element-scoped key chords (`meta+k`, `ctrl+s`, `escape`). |
| `useClipboard({ timeout })` | `{ copy, copied, error }` | Copies text to clipboard and resets `copied` state after timeout. |
| `useBreakpoint()` | `{ breakpoint, isMobile, isTablet, isDesktop }` | Responsive breakpoint matching against CSS `@theme` screens (`sm`, `md`, `lg`, `xl`, `2xl`). |
| `useLocalStorage(key, initialValue)` | `[value, setValue, removeValue]` | Persistent state synchronized with `window.localStorage` and across browser tabs. |
| `useDebounce(value, delay)` | `debouncedValue` | Debounces high-frequency input or state changes. |

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
