"use client"

import * as R from "@bzync/rui"
import { Activity, Box, ChevronRight, Database, Home, Settings, Trash2 } from "lucide-react"
import { Fragment, type ReactNode, useState } from "react"
import { RuiBrandMark } from "../_shared/brand"
import type { ApiProp } from "./primitives"

export interface SupplementalDetail {
  code: string
  preview: ReactNode
  props: ApiProp[]
  accessibility: string
}

type PropRow = [name: string, type: string, description: string, defaultValue?: string]

const api = (...rows: PropRow[]): ApiProp[] => rows.map(([name, type, description, defaultValue]) => ({
  name,
  type,
  description,
  ...(defaultValue ? { default: defaultValue } : {}),
}))

const detail = (code: string, preview: ReactNode, props: ApiProp[], accessibility: string): SupplementalDetail => ({
  code,
  preview,
  props,
  accessibility,
})

function BillingPreview() {
  const [value, setValue] = useState<R.BillingInterval>("yearly")
  return <R.BillingIntervalToggle value={value} onChange={setValue} options={[{ value: "monthly", label: "Monthly" }, { value: "quarterly", label: "Quarterly" }, { value: "yearly", label: "Annually", badge: "Save 20%" }]} />
}

function SnackbarPreview() {
  const { show } = R.useSnackbar()
  return <div className="demo-row"><R.Button onClick={() => show({ message: "Deployment completed successfully.", variant: "success" })}>Show success</R.Button><R.Button variant="secondary" onClick={() => show({ message: "Build quota is almost full.", variant: "warning" })}>Show warning</R.Button></div>
}

function ConfirmPreview() {
  const [open, setOpen] = useState(false)
  return <><R.Button variant="destructive" icon={<Trash2 size={15} />} onClick={() => setOpen(true)}>Delete environment</R.Button><R.ConfirmDialog open={open} onClose={() => setOpen(false)} onConfirm={() => setOpen(false)} title="Delete production environment?" description="This permanently removes its containers and volumes." confirmLabel="Delete environment" destructive /></>
}

function CommandTrigger() {
  const { setOpen } = R.useCommand()
  return <R.Button onClick={() => setOpen(true)}>Open command palette</R.Button>
}

function CommandPreview() {
  return <R.CommandProvider><CommandTrigger /><R.CommandPalette items={[{ id: "projects", label: "Open projects", group: "Navigation", icon: <Box size={15} />, onSelect: () => {} }, { id: "settings", label: "Open settings", group: "Navigation", icon: <Settings size={15} />, onSelect: () => {} }]} /></R.CommandProvider>
}

function TreePreview() {
  const [selected, setSelected] = useState("button")
  return <R.Tree className="w-full max-w-xs" selected={selected} onSelect={setSelected} defaultExpanded={["src", "components"]} nodes={[{ id: "src", label: "src", children: [{ id: "components", label: "components", children: [{ id: "button", label: "button.tsx" }, { id: "modal", label: "modal.tsx" }] }, { id: "index", label: "index.ts" }] }]} />
}

function NavigationPreview() {
  const [active, setActive] = useState("overview")
  const items: R.NavigationItem[] = [{ id: "overview", label: "Overview", href: "#overview", icon: <Home size={15} /> }, { id: "projects", label: "Projects", href: "#projects", icon: <Box size={15} /> }, { id: "activity", label: "Activity", href: "#activity", icon: <Activity size={15} /> }]
  return <R.Navbar className="w-full rounded-xl" items={items} activeId={active} onSelect={setActive}><R.BrandLink href="#overview" mark={<RuiBrandMark />}>@bzync/rui</R.BrandLink></R.Navbar>
}

function CodeEditorPreview() {
  const [value, setValue] = useState("export const status = \"ready\"\n")
  return <R.CodeEditor className="w-full" language="ts" value={value} onChange={setValue} />
}

function RichTextPreview() {
  const [value, setValue] = useState("<p>Write a deployment note…</p>")
  return <R.RichTextEditor className="w-full" value={value} onChange={setValue} />
}

const tableRows = [
  { id: 1, name: "api-gateway", status: "Healthy", region: "us-east-1" },
  { id: 2, name: "worker", status: "Building", region: "eu-west-1" },
  { id: 3, name: "web", status: "Healthy", region: "ap-south-1" },
]

const tableColumns: R.ColumnDef<(typeof tableRows)[number]>[] = [
  { key: "name", header: "Service", sortable: true, searchable: true, cell: (row) => row.name },
  { key: "status", header: "Status", sortable: true, cell: (row) => <R.Badge variant={row.status === "Healthy" ? "success" : "warning"}>{row.status}</R.Badge> },
  { key: "region", header: "Region", searchable: true, cell: (row) => row.region },
]

function TablePreview() {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(() => new Set([1]))

  function toggleRow(id: number) {
    setExpandedRows((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <R.Table aria-label="Services with deployment details" className="min-w-[560px]">
      <R.TableHeader>
        <R.TableRow>
          <R.TableHead className="w-10"><span className="sr-only">Expand row</span></R.TableHead>
          <R.TableHead>Service</R.TableHead>
          <R.TableHead>Status</R.TableHead>
          <R.TableHead>Region</R.TableHead>
        </R.TableRow>
      </R.TableHeader>
      <R.TableBody>
        {tableRows.map((row) => {
          const expanded = expandedRows.has(row.id)
          const detailsId = `service-${row.id}-details`
          return (
            <Fragment key={row.id}>
              <R.TableRow aria-selected={expanded}>
                <R.TableCell className="pr-0">
                  <R.Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    aria-label={`${expanded ? "Collapse" : "Expand"} ${row.name} details`}
                    aria-expanded={expanded}
                    aria-controls={detailsId}
                    onClick={() => toggleRow(row.id)}
                  >
                    <ChevronRight size={14} className={R.cn("transition-transform", expanded && "rotate-90")} aria-hidden="true" />
                  </R.Button>
                </R.TableCell>
                <R.TableCell className="font-medium">{row.name}</R.TableCell>
                <R.TableCell><R.Badge variant={row.status === "Healthy" ? "success" : "warning"}>{row.status}</R.Badge></R.TableCell>
                <R.TableCell>{row.region}</R.TableCell>
              </R.TableRow>
              <R.TableRow id={detailsId} hidden={!expanded} className="hover:bg-transparent">
                <R.TableCell colSpan={4} className="bg-surface-muted/60 px-5 py-4 whitespace-normal">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div><span className="block text-[11px] text-muted-foreground">Last deployment</span><strong className="text-xs">8 minutes ago</strong></div>
                    <div><span className="block text-[11px] text-muted-foreground">Runtime</span><strong className="text-xs">Node.js 22</strong></div>
                    <div><span className="block text-[11px] text-muted-foreground">Version</span><strong className="text-xs">v2.4.{row.id}</strong></div>
                  </div>
                </R.TableCell>
              </R.TableRow>
            </Fragment>
          )
        })}
      </R.TableBody>
    </R.Table>
  )
}

const chartProps = api(
  ["data", "chart data", "Values rendered by the chart."],
  ["height", "number", "Chart height in pixels."],
  ["className", "string", "Composes layout styles on the chart root."],
)

export const supplementalDetails: Record<string, () => SupplementalDetail> = {
  "components/heading": () => detail(
    `<Heading as="h1" size="xl">Operational clarity at every scale.</Heading>`,
    <R.Heading as="h2" size="xl" className="max-w-2xl">Operational clarity at every scale.</R.Heading>,
    api(["as", '"h1" | "h2" | "h3" | "h4" | "h5" | "h6"', "Semantic heading level.", '"h2"'], ["size", '"xs" | "sm" | "md" | "lg" | "xl" | "2xl"', "Responsive visual scale; defaults from the heading level."], ["tone", '"default" | "muted" | "accent"', "Semantic text color.", '"default"'], ["weight", '"normal" | "medium" | "semibold" | "bold"', "Font weight.", '"semibold"'], ["balance", "boolean", "Balances multi-line headings where supported.", "true"]),
    "The as prop preserves the document outline independently from visual size. Choose levels in logical order and do not select them only for appearance.",
  ),
  "components/text": () => detail(
    `<Text variant="lead">Monitor deployments without losing operational context.</Text>
<Text variant="date" value="2026-08-27" />
<Text variant="time" value="13:45" hour12 />
<Text variant="currency" value={12840.5} currency="USD" />`,
    <div className="demo-stack max-w-lg"><R.Text variant="lead">Monitor deployments without losing operational context.</R.Text><R.Text>Semantic styles keep interface copy readable from mobile through wide operational screens.</R.Text><div className="demo-row"><R.Text variant="date" value="2026-08-27" /><R.Text variant="time" value="13:45" hour12 /><R.Text variant="time" value="13:45" hour12={false} /><R.Text variant="currency" value={12840.5} currency="USD" /></div><R.Text variant="overline">Live operations</R.Text><R.Text variant="caption">Updated 2 minutes ago</R.Text></div>,
    api(["as", '"p" | "span" | "div" | "time"', "Rendered element; date/time variants default to time."], ["variant", '"body" | "lead" | "muted" | "caption" | "overline" | "date" | "time" | "currency"', "Purpose-oriented or formatted-value style.", '"body"'], ["value", "Date | number | bigint | string", "Value formatted by date, time, and currency variants."], ["locale / timeZone", "string", "Locale and IANA timezone for temporal formatting."], ["hour12", "boolean", "Forces 12- or 24-hour time output."], ["formatOptions", "Intl.DateTimeFormatOptions", "Date/time formatting options."], ["currency / accounting", "string / boolean", "Currency code and negative-value notation."], ["currencyOptions", "CurrencyFormatOptions", "Intl currency formatting options."], ["size", '"xs" | "sm" | "md" | "lg"', "Optional size override."], ["weight", '"normal" | "medium" | "semibold" | "bold"', "Optional weight override."], ["align", '"left" | "center" | "right"', "Text alignment.", '"left"'], ["wrap", '"normal" | "nowrap" | "balance" | "pretty"', "Wrapping and truncation behavior."]),
    "Text keeps HTML semantics explicit through as. Date and time variants render a machine-readable time element by default; calendar-only YYYY-MM-DD values do not shift across timezones.",
  ),
  "components/prose": () => detail(
    `<Prose as="article" width="sm">
  <h2>Deployment policy</h2>
  <p>Every production change requires an audit trail.</p>
</Prose>`,
    <R.Prose className="w-full" as="article" width="sm"><h2>Deployment policy</h2><p>Every production change requires an audit trail and a documented recovery path.</p><ul><li>Review the release diff.</li><li>Confirm health checks and rollback ownership.</li></ul><blockquote>Reliable operations favor explicit state over hidden assumptions.</blockquote></R.Prose>,
    api(["as", '"div" | "article" | "section"', "Document container element.", '"article"'], ["size", '"sm" | "md" | "lg"', "Long-form reading scale.", '"md"'], ["width", '"none" | "sm" | "md" | "lg"', "Maximum reading width.", '"sm"'], ["className", "string", "Composes content layout styles."]),
    "Prose styles semantic child markup without changing it. Keep heading order logical, describe images, and use table headers for tabular content.",
  ),
  "components/inline-code": () => detail(
    `<Text>Run <InlineCode>npm run release:check</InlineCode> before publishing.</Text>`,
    <R.Text>Run <R.InlineCode>npm run release:check</R.InlineCode> before publishing.</R.Text>,
    api(["children", "ReactNode", "Inline technical content."], ["className", "string", "Composes one-off text and surface styles."], ["...props", "HTMLAttributes<HTMLElement>", "Native code-element attributes."]),
    "Renders a semantic code element and allows long tokens to wrap instead of forcing viewport overflow.",
  ),
  "components/time-picker": () => detail(
    `<TimePicker
  label="Deployment time"
  defaultValue="09:30"
  minuteStep={15}
  hint="Times use the workspace timezone"
/>`,
    <R.TimePicker className="w-full max-w-xs" label="Deployment time" defaultValue="09:30" minuteStep={15} hint="Times use the workspace timezone" />,
    api(["value / defaultValue", "string", "Controlled or initial HH:mm or HH:mm:ss value."], ["onValueChange", "(value: string) => void", "Called after Apply or Clear."], ["format", '"12" | "24"', "Displayed hour format.", '"12"'], ["minuteStep", "number", "Minute selection increment from 1 through 30.", "5"], ["showSeconds", "boolean", "Adds a seconds column.", "false"], ["min / max", "string", "Inclusive selectable time boundaries."], ["side", '"top" | "bottom"', "Popover placement.", '"bottom"'], ["label / hint / error", "string", "Accessible field messaging."], ["name", "string", "Adds a hidden form submission value."]),
    "The custom trigger controls a labeled dialog. Time columns expose listbox/option semantics with arrow, Home, and End navigation; Escape dismisses and restores trigger focus.",
  ),
  "components/currency": () => detail(
    `<Currency value={12840.5} currency="USD" />
<Currency value={-920} currency="EUR" locale="de-DE" accounting />
<Currency value={1840000} options={{ notation: "compact" }} />`,
    <div className="demo-row"><R.Currency value={12840.5} currency="USD" /><R.Currency value={-920} currency="EUR" locale="de-DE" accounting /><R.Currency value={1840000} options={{ notation: "compact", maximumFractionDigits: 1 }} tone="positive" /></div>,
    api(["value", "number | bigint", "Monetary value to format."], ["currency", "string", "ISO 4217 currency code.", '"USD"'], ["locale", "Intl.LocalesArgument", "Formatting locale.", '"en-US"'], ["accounting", "boolean", "Uses accounting notation for negative values.", "false"], ["options", "CurrencyFormatOptions", "Intl number-format options such as notation and fraction digits."], ["tone", '"auto" | "default" | "positive" | "negative" | "muted"', "Semantic text treatment.", '"auto"'], ["fallback", "ReactNode", "Content shown for invalid values or format options.", '"—"']),
    "Currency renders readable text and tabular numerals. Compact notation receives a full-value accessible label, while negative values use the destructive semantic token by default.",
  ),
  "components/avatar-group": () => detail(
    `<AvatarGroup aria-label="Project members">
  <Avatar name="Maya Chen" />
  <Avatar name="Jordan Kim" />
  <AvatarGroupOverflow count={4} />
</AvatarGroup>`,
    <R.AvatarGroup aria-label="Project members"><R.Avatar name="Maya Chen" /><R.Avatar name="Jordan Kim" /><R.Avatar name="Sam Rivera" /><R.AvatarGroupOverflow count={4} /></R.AvatarGroup>,
    api(["spacing", '"tight" | "normal" | "loose"', "Amount of overlap between avatars.", '"normal"'], ["children", "ReactNode", "Avatar and AvatarGroupOverflow elements."], ["className", "string", "Composes layout styles."], ["AvatarGroupOverflow.count", "number", "Number of additional people not shown."]),
    "The root is a named group. AvatarGroupOverflow exposes a readable label such as “4 more people” instead of only its visual +4 text.",
  ),
  "components/button-group": () => detail(
    `<ButtonGroup aria-label="Document actions">
  <Button variant="secondary">Save</Button>
  <Button variant="secondary">Duplicate</Button>
  <Button variant="secondary">Archive</Button>
</ButtonGroup>`,
    <R.ButtonGroup aria-label="Document actions"><R.Button variant="secondary">Save</R.Button><R.Button variant="secondary">Duplicate</R.Button><R.Button variant="secondary">Archive</R.Button></R.ButtonGroup>,
    api(["orientation", '"horizontal" | "vertical"', "Visual grouping direction.", '"horizontal"'], ["children", "ReactNode", "Related button controls."], ["className", "string", "Composes group layout styles."], ["aria-label", "string", "Accessible name describing the related actions."]),
    "Uses role=\"group\" while preserving each child button's native keyboard and disabled behavior. Give the group a concise accessible name.",
  ),
  "components/description-list": () => detail(
    `<DescriptionList columns={2}>
  <DescriptionItem>
    <DescriptionTerm>Region</DescriptionTerm>
    <DescriptionDetails>US East</DescriptionDetails>
  </DescriptionItem>
</DescriptionList>`,
    <R.DescriptionList className="w-full max-w-lg" columns={2}><R.DescriptionItem><R.DescriptionTerm>Region</R.DescriptionTerm><R.DescriptionDetails>US East</R.DescriptionDetails></R.DescriptionItem><R.DescriptionItem><R.DescriptionTerm>Runtime</R.DescriptionTerm><R.DescriptionDetails>Node.js 22</R.DescriptionDetails></R.DescriptionItem><R.DescriptionItem><R.DescriptionTerm>Status</R.DescriptionTerm><R.DescriptionDetails><R.Badge variant="success" size="sm">Healthy</R.Badge></R.DescriptionDetails></R.DescriptionItem><R.DescriptionItem><R.DescriptionTerm>Version</R.DescriptionTerm><R.DescriptionDetails>v2.4.1</R.DescriptionDetails></R.DescriptionItem></R.DescriptionList>,
    api(["columns", "1 | 2 | 3", "Responsive column count.", "1"], ["density", '"compact" | "default" | "relaxed"', "Space between entries.", '"default"'], ["DescriptionItem.orientation", '"stacked" | "inline"', "Term/value arrangement.", '"stacked"'], ["className", "string", "Composes list layout styles."]),
    "Renders native dl, dt, and dd elements so term/value relationships remain available to assistive technology.",
  ),
  "components/rating": () => detail(
    `<Rating label="Service rating" defaultValue={4} showValue onValueChange={setRating} />`,
    <R.Rating label="Service rating" defaultValue={4} showValue />,
    api(["label", "string", "Required accessible group label."], ["value / defaultValue", "number", "Controlled or initial rating."], ["onValueChange", "(value: number) => void", "Rating selection callback."], ["max", "number", "Number of rating choices.", "5"], ["readOnly", "boolean", "Prevents changes while preserving the value for reading.", "false"], ["size", '"sm" | "md" | "lg"', "Star size.", '"md"']),
    "Uses a labeled native radio group. Every choice has a textual star count, supports standard radio-keyboard behavior, and exposes read-only state.",
  ),
  "components/blockquote": () => detail(
    `<Blockquote
  variant="accent"
  cite="https://example.com/report"
  source="2026 reliability report"
  sourceHref="/reports/reliability"
>
  Reliable systems make failure visible.
</Blockquote>`,
    <R.Blockquote className="w-full max-w-lg" variant="accent" source="2026 reliability report">Reliable systems make failure visible, understandable, and recoverable.</R.Blockquote>,
    api(["variant", '"default" | "accent" | "subtle"', "Visual treatment.", '"default"'], ["size", '"sm" | "md" | "lg"', "Quote typography and spacing.", '"md"'], ["cite", "string", "Native URL identifying the quotation source."], ["source", "ReactNode", "Visible source attribution."], ["sourceHref", "string", "Optional link for the visible attribution."]),
    "Renders a semantic blockquote. The native cite attribute identifies the source in markup; source renders a visible attribution and can be linked.",
  ),
  "components/toggle": () => detail(
    `<Toggle defaultPressed onPressedChange={setBold}>Bold</Toggle>`,
    <div className="demo-row"><R.Toggle defaultPressed>Bold</R.Toggle><R.Toggle variant="outline">Italic</R.Toggle><R.Toggle disabled>Disabled</R.Toggle></div>,
    api(["pressed / defaultPressed", "boolean", "Controlled or initial pressed state."], ["onPressedChange", "(pressed: boolean) => void", "Called when the user changes the pressed state."], ["variant", '"default" | "outline"', "Visual treatment.", '"default"'], ["size", '"sm" | "md" | "lg" | "icon"', "Control density.", '"md"']),
    "Uses a native button with aria-pressed, visible focus treatment, and native disabled behavior.",
  ),
  "components/toggle-group": () => detail(
    `<ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Formatting">
  <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
  <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
  <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
</ToggleGroup>`,
    <R.ToggleGroup type="multiple" defaultValue={["bold"]} variant="outline" aria-label="Formatting"><R.ToggleGroupItem value="bold">Bold</R.ToggleGroupItem><R.ToggleGroupItem value="italic">Italic</R.ToggleGroupItem><R.ToggleGroupItem value="underline">Underline</R.ToggleGroupItem></R.ToggleGroup>,
    api(["type", '"single" | "multiple"', "Selection behavior.", '"single"'], ["value / defaultValue", "string | string[]", "Controlled or initial selected values."], ["onValueChange", "(value: string | string[]) => void", "Selection callback."], ["orientation", '"horizontal" | "vertical"', "Layout and arrow-key axis.", '"horizontal"'], ["loop", "boolean", "Wraps arrow-key focus at group boundaries.", "true"]),
    "The group and native toggle buttons expose pressed states. Arrow keys move focus along the configured orientation; Home and End move to the boundaries.",
  ),
  "components/aspect-ratio": () => detail(
    `<AspectRatio ratio={16 / 9} className="rounded-xl bg-surface-muted">
  <img src="/dashboard.png" alt="Deployment dashboard" />
</AspectRatio>`,
    <R.AspectRatio ratio={16 / 9} className="w-full max-w-lg rounded-xl border border-border bg-surface-muted"><div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">16:9 application preview</div></R.AspectRatio>,
    api(["ratio", "number", "Width divided by height.", "16 / 9"], ["className", "string", "Composes sizing, surface, and overflow styles."], ["style", "CSSProperties", "Native inline styles merged after the computed ratio."], ["children", "ReactNode", "Media or content constrained by the ratio."]),
    "AspectRatio is a visual layout primitive. Give contained images meaningful alt text, or empty alt text when decorative.",
  ),
  "components/scroll-area": () => detail(
    `<ScrollArea className="h-52" aria-label="Recent deployments">
  {deployments.map(deployment => <DeploymentRow key={deployment.id} />)}
</ScrollArea>`,
    <R.ScrollArea className="h-52 w-full max-w-sm rounded-xl border border-border bg-surface p-2" aria-label="Recent deployments"><div className="demo-stack">{Array.from({ length: 8 }, (_, index) => <div className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2 text-sm" key={index}><span>Deployment #{842 - index}</span><R.Badge variant={index < 2 ? "success" : "muted"} size="sm">{index < 2 ? "Ready" : "Archived"}</R.Badge></div>)}</div></R.ScrollArea>,
    api(["orientation", '"vertical" | "horizontal" | "both"', "Allowed scroll axis.", '"vertical"'], ["hideScrollbar", "boolean", "Visually hides the native scrollbar while retaining scrolling.", "false"], ["keyboardNavigable", "boolean", "Adds the region to the tab order for keyboard scrolling.", "true"], ["className", "string", "Sets the region dimensions and composes visual styles."]),
    "Keyboard navigation is enabled by default. Supply aria-label or aria-labelledby when the scroll area is a meaningful standalone region.",
  ),
  "components/divider": () => detail(
    `<Divider label="OR" />
<Divider orientation="vertical" aria-label="Section divider" />
<Divider variant="dashed" spacing="lg" />`,
    <div className="demo-stack w-full max-w-lg"><div className="rounded-xl border border-border bg-surface p-4"><p className="text-sm text-muted-foreground">Deployment pipeline</p><R.Divider label="Production gate" /><p className="text-sm text-muted-foreground">Release ready</p></div><div className="flex h-24 items-stretch gap-4 rounded-xl border border-border bg-surface p-4"><span className="text-sm">Build</span><R.Divider orientation="vertical" decorative={false} aria-label="Section divider" /><span className="text-sm">Deploy</span></div></div>,
    api(["orientation", '"horizontal" | "vertical"', "Rule direction.", '"horizontal"'], ["variant", '"solid" | "dashed" | "dotted"', "Line style.", '"solid"'], ["spacing", '"none" | "sm" | "md" | "lg"', "Outer margin.", '"md"'], ["label", "ReactNode", "Optional centered label."], ["decorative", "boolean", "Hides the rule from assistive technology.", "true"]),
    "Divider renders presentational rules by default. Set decorative={false} and provide an accessible name when the separation conveys meaning.",
  ),
  "components/copy-button": () => detail(
    `<CopyButton value="sk_live_abc123" label="Copy API key" />`,
    <div className="demo-row"><code>sk_live_abc123</code><R.CopyButton value="sk_live_abc123" label="Copy API key" /></div>,
    api(["value", "string", "Text written to the clipboard."], ["label", "string", "Visible and accessible action label."], ["timeout", "number", "Copied-state duration in milliseconds.", "2000"]),
    "Uses a native button and announces its copied state through visible button text.",
  ),
  "components/info-button": () => detail(
    `<InfoButton label="About usage limits" onClick={openHelp} />`,
    <R.InfoButton label="About usage limits" onClick={() => {}} />,
    api(["label", "string", "Accessible name for the icon-only button."], ["onClick", "() => void", "Action invoked on activation."]),
    "Requires a descriptive label because its icon has no text alternative.",
  ),
  "components/billing-interval-toggle": () => detail(
    `<BillingIntervalToggle value={interval} onChange={setInterval} options={[\n  { value: "monthly", label: "Monthly" },\n  { value: "yearly", label: "Annually", badge: "Save 20%" },\n]} />`,
    <BillingPreview />,
    api(["value", "BillingInterval", "Controlled selected interval."], ["onChange", "(value) => void", "Selection callback."], ["options", "BillingIntervalToggleOption[]", "Intervals displayed by the segmented control."], ["size", '"sm" | "lg"', "Control density.", '"sm"']),
    "Each option is a native button with focus-visible treatment and disabled semantics.",
  ),
  "components/autocomplete": () => detail(
    `<Autocomplete label="Runtime" placeholder="Search runtimes…" options={[\n  { value: "node", label: "Node.js 22" },\n  { value: "go", label: "Go 1.25" },\n]} onSelect={setRuntime} />`,
    <div className="w-full max-w-sm"><R.Autocomplete label="Runtime" placeholder="Search runtimes…" hint="Type to filter options" options={[{ value: "node", label: "Node.js 22" }, { value: "go", label: "Go 1.25" }, { value: "rust", label: "Rust" }]} /></div>,
    api(["options", "AutocompleteOption[]", "Searchable option values and labels."], ["multiple", "boolean", "Enables multi-selection.", "false"], ["inputValue", "string", "Controlled query text."], ["onSelect", "(option, all?) => void", "Selection callback."], ["label / hint / error", "string", "Accessible field messaging."]),
    "Exposes combobox/listbox semantics with arrow-key navigation, Enter selection, Escape dismissal, and associated field messages.",
  ),
  "components/slider": () => detail(
    `<Slider label="Memory" min={128} max={4096} step={128} defaultValue={1024} formatValue={(value) => \`${"${value}"} MB\`} />`,
    <R.Slider className="w-full max-w-sm" label="Memory" min={128} max={4096} step={128} defaultValue={1024} formatValue={(value) => `${value} MB`} />,
    api(["min / max / step", "number", "Native range boundaries and increment."], ["value / defaultValue", "number", "Controlled or initial value."], ["formatValue", "(value) => string", "Accessible and visible value formatter."], ["showValue", "boolean", "Shows the current output.", "true"]),
    "Uses a native range input and supplies aria-valuetext from the formatted value.",
  ),
  "components/number-input": () => detail(
    `<NumberInput label="Replicas" min={1} max={10} defaultValue={3} />`,
    <R.NumberInput label="Replicas" min={1} max={10} defaultValue={3} hint="Containers running in each region" />,
    api(["value / defaultValue", "number", "Controlled or initial numeric value."], ["min / max / step", "number", "Clamping boundaries and increment."], ["onChange", "(value: number) => void", "Called after a committed change."], ["size", '"sm" | "md" | "lg"', "Control density.", '"md"']),
    "The labeled native number field works with keyboard entry; increment and decrement buttons have accessible names.",
  ),
  "components/otp-input": () => detail(
    `<OtpInput label="Verification code" length={6} onComplete={verifyCode} />`,
    <R.OtpInput label="Verification code" length={6} hint="Paste or type the six-digit code" />,
    api(["length", "number", "Number of digit fields.", "6"], ["value", "string", "Controlled code value."], ["onChange / onComplete", "(value: string) => void", "Edit and completion callbacks."], ["masked", "boolean", "Masks entered digits.", "false"]),
    "Fields use numeric input modes, one-time-code autocomplete, paste support, and arrow-key navigation.",
  ),
  "components/file-upload": () => detail(
    `<FileUpload label="Configuration" accept=".json,.yaml" maxSizeMB={5} onFilesChange={setFiles} />`,
    <R.FileUpload className="w-full max-w-md" label="Configuration" accept=".json,.yaml" maxSizeMB={5} hint="JSON or YAML, up to 5 MB" />,
    api(["accept", "string", "Accepted file types."], ["multiple", "boolean", "Allows multiple files."], ["maxSizeMB", "number", "Maximum size per file."], ["onFilesChange", "(files: File[]) => void", "Called when the file list changes."]),
    "Uses a labeled native file input and exposes validation through aria-invalid and associated messages.",
  ),
  "components/date-picker": () => detail(
    `<DatePicker label="Deployment date" value={date} onChange={setDate} />`,
    <R.DatePicker className="w-full max-w-xs" label="Deployment date" hint="Choose a release window" />,
    api(["value", "Date | null", "Controlled selected date."], ["onChange", "(date: Date | null) => void", "Selection callback."], ["minDate / maxDate", "Date", "Selectable date boundaries."], ["clearable", "boolean", "Allows clearing the value.", "true"]),
    "The trigger exposes dialog state, field messages are associated, and Escape dismisses the calendar.",
  ),
  "components/calendar": () => detail(
    `<Calendar defaultValue={new Date()} defaultView="month" events={events} />`,
    <R.Calendar className="w-full" defaultValue={new Date()} defaultView="month" events={[{ id: "deploy", title: "Deploy API", date: new Date(), time: "10:00", color: "blue" }]} />,
    api(["value / defaultValue", "Date | null", "Controlled or initial selected date."], ["view / defaultView", '"month" | "week"', "Controlled or initial calendar view."], ["events", "CalendarEvent[]", "Events rendered on dates."], ["editable", "boolean", "Enables event creation and editing.", "false"]),
    "Date controls are native buttons with labels; disabled dates cannot be selected.",
  ),
  "components/label": () => detail(
    `<Label htmlFor="project-name" required hint="64 characters maximum">Project name</Label>`,
    <R.Label htmlFor="label-demo" required hint="64 characters maximum">Project name</R.Label>,
    api(["htmlFor", "string", "ID of the associated form control."], ["required", "boolean", "Displays required-state text."], ["hint", "ReactNode", "Compact supplementary label content."], ["className", "string", "Composes label styles."]),
    "Renders a native label; htmlFor should match the target control ID.",
  ),
  "components/form-field": () => detail(
    `<FormField label="Project name" htmlFor="project" hint="Used in URLs" required>\n  <Input id="project" />\n</FormField>`,
    <R.FormField className="w-full max-w-sm" label="Project name" htmlFor="project-demo" hint="Used in URLs and logs" required><R.Input id="project-demo" placeholder="api-gateway" /></R.FormField>,
    api(["label", "ReactNode", "Visible field label."], ["htmlFor", "string", "ID of the child control."], ["hint", "ReactNode", "Supporting field text."], ["error", "string", "Validation message."], ["required", "boolean", "Displays a required marker."]),
    "Connect htmlFor to the child control and let the child expose its own invalid and described-by attributes.",
  ),
  "components/avatar": () => detail(
    `<Avatar name="Maya Chen" size="lg" status="online" />`,
    <div className="demo-row"><R.Avatar name="Maya Chen" size="lg" status="online" /><R.Avatar name="Alex Rivera" size="lg" status="away" /><R.Avatar name="Sam Lee" size="lg" status="busy" /></div>,
    api(["name", "string", "Name used for fallback initials and accessible text."], ["src", "string", "Optional image source."], ["size", '"xs" | "sm" | "md" | "lg" | "xl"', "Avatar size.", '"md"'], ["status", "AvatarStatus", "Optional presence indicator."]),
    "Images include an accessible name; fallback initials are derived from the supplied name.",
  ),
  "components/callout": () => detail(
    `<Callout variant="warning" title="Approaching limit">You have used 92% of build minutes.</Callout>`,
    <R.Callout className="w-full max-w-lg" variant="warning" title="Approaching limit">You have used 92% of this month&apos;s build minutes.</R.Callout>,
    api(["variant", '"default" | "info" | "success" | "warning" | "error"', "Semantic treatment.", '"info"'], ["title", "ReactNode", "Optional heading."], ["icon", "ReactNode", "Custom leading icon."], ["children", "ReactNode", "Callout message."]),
    "Keep a textual title or message so meaning is not communicated by color alone.",
  ),
  "components/tag": () => detail(
    `<Tag variant="success" onRemove={removeRegion}>us-east-1</Tag>`,
    <div className="demo-row"><R.Tag>Node.js 22</R.Tag><R.Tag variant="success" onRemove={() => {}}>us-east-1</R.Tag><R.Tag variant="info" onRemove={() => {}}>preview</R.Tag></div>,
    api(["variant", "TagVariant", "Semantic visual style."], ["size", '"sm" | "md"', "Tag density.", '"md"'], ["icon", "ReactNode", "Leading icon."], ["onRemove", "() => void", "Adds and handles the remove button."]),
    "The optional remove action is a named native button; retain visible tag text.",
  ),
  "components/kbd": () => detail(
    `<Kbd keys={["⌘", "K"]} />`,
    <div className="demo-row"><span>Open search</span><R.Kbd keys={["⌘", "K"]} /><span>Dismiss</span><R.Kbd keys="ESC" /></div>,
    api(["keys", "string | string[]", "One key or a chord."], ["size", '"sm" | "md"', "Keycap size.", '"sm"'], ["className", "string", "Composes keycap styles."]),
    "Kbd is presentational; describe what the shortcut does in nearby text.",
  ),
  "components/status-dot": () => detail(
    `<StatusDot status="online" label="Operational" pulse />`,
    <div className="demo-row"><R.StatusDot status="online" label="Operational" pulse /><R.StatusDot status="pending" label="Deploying" pulse /><R.StatusDot status="error" label="Failed" /></div>,
    api(["status", "Status", "Operational state."], ["label", "string", "Visible state label."], ["pulse", "boolean", "Animates live states.", "false"], ["size", '"sm" | "md" | "lg"', "Indicator size.", '"md"']),
    "Provide a label or adjacent text so status is not conveyed by color alone.",
  ),
  "components/stat": () => detail(
    `<Stat label="Requests" value="1.2M" trend="up" trendValue="+14%" description="vs last month" />`,
    <div className="grid w-full max-w-lg gap-3 sm:grid-cols-2"><R.Stat label="Requests" value="1.2M" trend="up" trendValue="+14%" description="vs last month" /><R.Stat label="Latency" value="38" unit="ms" trend="down" trendValue="-4ms" /></div>,
    api(["label", "ReactNode", "Metric label."], ["value", "ReactNode", "Primary metric value."], ["unit", "ReactNode", "Optional unit."], ["trend", '"up" | "down" | "neutral"', "Trend direction."], ["trendValue", "ReactNode", "Visible change amount."]),
    "Use descriptive labels and trend text; arrows and color should reinforce rather than replace meaning.",
  ),
  "components/link": () => detail(
    `<Link href="/docs" variant="underline">Read the documentation</Link>`,
    <div className="demo-row"><R.Link href="#components">Default link</R.Link><R.Link href="#components" variant="muted">Muted link</R.Link><R.Link href="https://example.com" external>External link</R.Link></div>,
    api(["href", "string", "Native link destination."], ["variant", '"default" | "muted" | "underline"', "Visual treatment.", '"default"'], ["external", "boolean", "Adds external-link behavior and icon."], ["className", "string", "Composes anchor styles."]),
    "Renders a native anchor; link text should describe its destination.",
  ),
  "components/list": () => detail(
    `<List>\n  <ListItem href="/projects" icon={<Box />}>Projects</ListItem>\n  <ListItem description="3 members">Team</ListItem>\n</List>`,
    <R.List className="w-full max-w-sm"><R.ListItem href="#projects" icon={<Box size={15} />} trailing={<R.Badge size="sm">3</R.Badge>}>Projects</R.ListItem><R.ListItem href="#settings" icon={<Settings size={15} />} description="Workspace preferences">Settings</R.ListItem></R.List>,
    api(["divided", "boolean", "Shows separators between items.", "true"], ["icon", "ReactNode", "ListItem leading icon."], ["description", "ReactNode", "ListItem supporting text."], ["trailing", "ReactNode", "ListItem trailing content."], ["href", "string", "Renders the item as a link."]),
    "Uses list semantics; linked items render anchors and interactive items preserve keyboard behavior.",
  ),
  "components/timeline": () => detail(
    `<Timeline events={[\n  { id: "1", title: "Deployed", timestamp: "2m ago", variant: "success" },\n  { id: "2", title: "Build started", timestamp: "5m ago" },\n]} />`,
    <R.Timeline className="w-full max-w-md" events={[{ id: "1", title: "Deployed to production", description: "api-gateway v2.4.1 is live", timestamp: "2m ago", variant: "success" }, { id: "2", title: "Build completed", timestamp: "4m ago", variant: "info" }, { id: "3", title: "Deploy triggered", timestamp: "6m ago" }]} />,
    api(["events", "TimelineEvent[]", "Ordered event data."], ["title", "ReactNode", "Event heading."], ["description", "ReactNode", "Optional event details."], ["timestamp", "ReactNode", "Event time label."], ["variant", "TimelineVariant", "Semantic marker treatment."]),
    "Events remain in meaningful DOM order; include text for event state and time.",
  ),
  "components/tree": () => detail(
    `<Tree nodes={nodes} selected={selectedId} onSelect={setSelectedId} defaultExpanded={["src"]} />`,
    <TreePreview />,
    api(["nodes", "TreeNode[]", "Hierarchical node data."], ["selected", "string", "Controlled selected node ID."], ["onSelect", "(id: string) => void", "Node selection callback."], ["defaultExpanded", "string[]", "Initially expanded node IDs."]),
    "Expandable nodes expose buttons with expanded state; selectable rows remain keyboard reachable.",
  ),
  "components/snackbar": () => detail(
    `<SnackbarProvider>\n  <App />\n</SnackbarProvider>\n\nconst { show } = useSnackbar()\nshow({ message: "Deployed", variant: "success" })`,
    <SnackbarPreview />,
    api(["position", "SnackbarPosition", "Viewport placement.", '"bottom-right"'], ["maxVisible", "number", "Maximum simultaneous toasts.", "5"], ["show", "(options) => string", "Displays a toast and returns its ID."], ["dismiss / dismissAll", "functions", "Removes one or all toasts."]),
    "Toasts use live-region semantics, include named dismiss controls, and can remain persistent when duration is zero.",
  ),
  "components/spinner": () => detail(
    `<Spinner size="md" />`,
    <div className="demo-row"><R.Spinner size="xs" /><R.Spinner size="sm" /><R.Spinner size="md" /><R.Spinner size="lg" /><span>Loading deployments…</span></div>,
    api(["size", '"xs" | "sm" | "md" | "lg"', "Indicator size.", '"md"'], ["className", "string", "Composes color and layout styles."]),
    "Pair the decorative spinner with visible text or an accessible busy label on its containing region.",
  ),
  "components/empty-state": () => detail(
    `<EmptyState icon={<Database />} title="No databases yet" description="Create one to store application data." action={<Button>Create database</Button>} />`,
    <R.EmptyState icon={<Database />} title="No databases yet" description="Create a database to store application data." action={<R.Button>Create database</R.Button>} />,
    api(["title", "string", "Empty-state heading."], ["description", "string", "Explanation or guidance."], ["icon", "ReactNode", "Decorative illustration."], ["action", "ReactNode", "Primary next action."], ["size", '"sm" | "md" | "lg"', "Empty-state spacing.", '"md"']),
    "Use a specific title and action label; decorative icons should not carry unique meaning.",
  ),
  "components/error-state": () => detail(
    `<ErrorState title="Failed to load deployments" error={error} onRetry={reload} />`,
    <R.ErrorState className="w-full max-w-md" title="Failed to load deployments" description="The API could not be reached." error="connect ECONNREFUSED" onRetry={() => {}} />,
    api(["title", "string", "Error heading."], ["description", "string", "Recovery guidance."], ["error", "string | Error", "Optional diagnostic detail."], ["onRetry", "() => void", "Displays and handles a retry action."], ["action", "ReactNode", "Additional recovery action."]),
    "The root uses role=alert and retry is a named native button.",
  ),
  "components/confirm-dialog": () => detail(
    `<ConfirmDialog open={open} onClose={close} onConfirm={remove} title="Delete environment?" destructive />`,
    <ConfirmPreview />,
    api(["open", "boolean", "Controls dialog presence."], ["onClose", "() => void", "Dismiss callback."], ["onConfirm", "() => void", "Confirmation callback."], ["destructive", "boolean", "Uses destructive confirmation styling."], ["loading", "boolean", "Shows pending confirmation state."]),
    "Built on the modal focus trap with dialog labeling, Escape handling, scroll lock, and focus restoration.",
  ),
  "components/popover": () => detail(
    `<Popover trigger={<Button>Filters</Button>} side="bottom">\n  <PopoverContent>Filter controls</PopoverContent>\n</Popover>`,
    <R.Popover trigger={<R.Button variant="secondary">Filter options</R.Button>} side="bottom"><R.PopoverContent className="w-64"><p className="mb-3 text-sm font-semibold">Status</p><div className="demo-stack"><R.Checkbox label="Healthy" defaultChecked /><R.Checkbox label="Building" /></div></R.PopoverContent></R.Popover>,
    api(["trigger", "ReactNode", "Element that toggles the panel."], ["open", "boolean", "Controlled open state."], ["onOpenChange", "(open: boolean) => void", "Open-state callback."], ["side", '"top" | "right" | "bottom" | "left"', "Preferred placement.", '"bottom"'], ["align", '"start" | "center" | "end"', "Cross-axis alignment.", '"center"']),
    "The trigger exposes expanded state; Escape and outside pointer interaction dismiss the panel.",
  ),
  "components/command": () => detail(
    `<CommandProvider>\n  <CommandTrigger />\n  <CommandPalette items={commands} />\n</CommandProvider>`,
    <CommandPreview />,
    api(["items", "CommandItem[]", "Searchable commands and groups."], ["shortcut", "string", "Modifier-key shortcut.", '"k"'], ["placeholder", "string", "Search input placeholder."], ["ariaLabel", "string", "Accessible dialog name.", '"Command palette"']),
    "The palette is a labeled modal dialog with a focus trap, searchable listbox behavior, arrow navigation, Escape dismissal, and focus restoration.",
  ),
  "components/breadcrumb": () => detail(
    `<Breadcrumb items={[{ label: "Projects", href: "/projects" }, { label: "Atlas", href: "/atlas" }, { label: "Deployments" }]} />`,
    <R.Breadcrumb items={[{ label: "Projects", href: "#projects" }, { label: "Atlas", href: "#atlas" }, { label: "Deployments" }]} />,
    api(["items", "BreadcrumbItem[]", "Ordered hierarchy items."], ["separator", "ReactNode", "Custom visual separator."], ["className", "string", "Composes navigation styles."]),
    "Renders a named navigation landmark; the final item exposes aria-current=page.",
  ),
  "components/stepper": () => detail(
    `<Stepper current={1} steps={[{ label: "Configure" }, { label: "Review" }, { label: "Deploy" }]} />`,
    <R.Stepper className="w-full max-w-lg" current={1} steps={[{ label: "Configure", description: "Service settings" }, { label: "Review", description: "Confirm changes" }, { label: "Deploy", description: "Release service" }]} />,
    api(["steps", "StepperStep[]", "Ordered workflow steps."], ["current", "number", "Zero-based current step."], ["orientation", '"horizontal" | "vertical"', "Layout direction.", '"horizontal"'], ["className", "string", "Composes layout styles."]),
    "Text labels identify completed, current, and upcoming steps without relying on color alone.",
  ),
  "components/navigation": () => detail(
    `<Navbar items={items} activeId={active} onSelect={setActive}>\n  <BrandLink href="/" mark={<img src="/rui-icon-192.png" alt="" />}>\n    @bzync/rui\n  </BrandLink>\n</Navbar>`,
    <NavigationPreview />,
    api(["items", "NavigationItem[]", "Links with IDs, labels, hrefs, icons, and badges."], ["activeId", "string", "Current navigation item ID."], ["onSelect", "(id: string) => void", "Selection callback."], ["header / footer", "ReactNode", "Sidebar composition slots."]),
    "Navigation primitives use native landmarks and anchors, with aria-current on the active destination.",
  ),
  "components/table": () => detail(
    `const [expanded, setExpanded] = useState<number | null>(1)\n\n<Table aria-label="Services with deployment details">\n  <TableHeader>...</TableHeader>\n  <TableBody>\n    {services.map((service) => (\n      <Fragment key={service.id}>\n        <TableRow>\n          <TableCell>\n            <Button\n              variant="ghost"\n              size="icon"\n              aria-expanded={expanded === service.id}\n              aria-controls={\`service-\${service.id}-details\`}\n              onClick={() => setExpanded(expanded === service.id ? null : service.id)}\n            >\n              <ChevronRight />\n            </Button>\n          </TableCell>\n          <TableCell>{service.name}</TableCell>\n          <TableCell>{service.status}</TableCell>\n        </TableRow>\n        {expanded === service.id && (\n          <TableRow id={\`service-\${service.id}-details\`}>\n            <TableCell colSpan={3}>Deployment details</TableCell>\n          </TableRow>\n        )}\n      </Fragment>\n    ))}\n  </TableBody>\n</Table>`,
    <TablePreview />,
    api(["containerClassName", "string", "Composes styles on the bordered container."], ["scrollAreaClassName", "string", "Composes styles on the horizontal scroll area."], ["density", '"compact" | "comfortable"', "Controls cell spacing.", '"comfortable"'], ["className", "string", "Composes table styles."]),
    "Expandable rows use a native button with aria-expanded and aria-controls; the detail content is rendered as an adjacent table row.",
  ),
  "components/data-table": () => detail(
    `<DataTable columns={columns} data={services} searchable pageSizeOptions={false} />`,
    <div className="w-full"><R.DataTable ariaLabel="Services" columns={tableColumns} data={tableRows} searchable searchPlaceholder="Search services…" pageSizeOptions={false} /></div>,
    api(["columns", "ColumnDef<T>[]", "Column definitions, cells, sort, and search settings."], ["data", "T[]", "Rows with stable IDs."], ["searchable", "boolean", "Displays the search field."], ["loading", "boolean", "Displays table skeletons."], ["pageSizeOptions", "number[] | false", "Page-size selector values or disabled state."]),
    "Provides a named native table, labeled search control, sortable headers, and keyboard-operable pagination.",
  ),
  "components/code-block": () => detail(
    `<CodeBlock language="ts" filename="status.ts" showLineNumbers code={'export const status = "ready"'} />`,
    <R.CodeBlock className="w-full" language="ts" filename="status.ts" showLineNumbers code={'export const status = "ready"\n\nconsole.log(status)'} />,
    api(["code", "string", "Source text to display and copy."], ["language", "string", "Tokenizer language.", '"js"'], ["filename", "string", "Optional header filename."], ["showLineNumbers", "boolean", "Displays line numbers.", "false"]),
    "The copy action is a native button with visible state feedback; source remains selectable text.",
  ),
  "components/code-editor": () => detail(
    `<CodeEditor language="ts" value={code} onChange={setCode} />`,
    <CodeEditorPreview />,
    api(["value", "string", "Controlled source value."], ["onChange", "(value: string) => void", "Edit callback."], ["language", "string", "Language label."], ["minRows / maxRows", "number", "Editor height constraints."], ["readOnly", "boolean", "Prevents editing."]),
    "Uses a textarea with keyboard support for indentation and paired characters; readOnly preserves text navigation.",
  ),
  "components/rich-text": () => detail(
    `<RichTextEditor value={html} onChange={setHtml} placeholder="Write release notes…" />`,
    <RichTextPreview />,
    api(["value", "string", "Controlled HTML value."], ["onChange", "(html: string) => void", "Edit callback."], ["placeholder", "string", "Empty editor guidance."], ["disabled", "boolean", "Disables editing controls."], ["className", "string", "Composes editor layout styles."]),
    "Toolbar controls are named buttons and the editable surface supports keyboard text editing.",
  ),
  "components/terminal": () => detail(
    `<TerminalEmulator title="user@production" user="user" hostname="production" />`,
    <R.TerminalEmulator className="w-full" title="user@production" user="user" hostname="production" />,
    api(["title", "string", "Terminal window title."], ["user", "string", "Prompt user name."], ["hostname", "string", "Prompt host name."], ["initialPath", "string", "Initial working directory."], ["className", "string", "Composes terminal dimensions."]),
    "The command input has an accessible label and supports command history and standard keyboard editing.",
  ),
  "components/bar-chart": () => detail(
    `<BarChart data={[{ label: "API", value: 1200 }, { label: "Web", value: 840 }]} showValues />`,
    <R.BarChart className="w-full" height={220} showValues data={[{ label: "API", value: 1200 }, { label: "Web", value: 840 }, { label: "Worker", value: 560 }, { label: "Jobs", value: 320 }]} />,
    chartProps,
    "Provide the same values in nearby text or a table when exact chart values are essential.",
  ),
  "components/line-chart": () => detail(
    `<LineChart data={[{ label: "Mon", value: 820 }, { label: "Tue", value: 1040 }]} />`,
    <R.LineChart className="w-full" height={220} data={[{ label: "Mon", value: 820 }, { label: "Tue", value: 1040 }, { label: "Wed", value: 960 }, { label: "Thu", value: 1280 }, { label: "Fri", value: 1510 }]} />,
    chartProps,
    "Pair the visual trend with a textual summary or accessible data table.",
  ),
  "components/multi-line-chart": () => detail(
    `<MultiLineChart labels={["Mon", "Tue", "Wed"]} series={[{ label: "CPU", data: [28, 42, 38] }, { label: "Memory", data: [55, 58, 62] }]} />`,
    <R.MultiLineChart className="w-full" height={220} labels={["Mon", "Tue", "Wed", "Thu", "Fri"]} series={[{ label: "CPU", color: "#3b82f6", data: [28, 42, 38, 55, 48] }, { label: "Memory", color: "#10b981", data: [55, 58, 62, 65, 68] }]} />,
    api(["labels", "string[]", "Shared x-axis labels."], ["series", "LineSeries[]", "Named value series."], ["height", "number", "Chart height in pixels."], ["formatValue", "(value) => string", "Tooltip value formatter."]),
    "Give every series a name and provide exact values in text or a table when users need them.",
  ),
  "components/donut-chart": () => detail(
    `<DonutChart data={[{ label: "US East", value: 42 }, { label: "EU West", value: 28 }]} />`,
    <R.DonutChart data={[{ label: "US East", value: 42 }, { label: "EU West", value: 28 }, { label: "AP South", value: 18 }, { label: "Other", value: 12 }]} centerLabel={<div className="text-center"><strong>100%</strong><small className="block">traffic</small></div>} />,
    api(["data", "DonutDataPoint[]", "Labeled segment values."], ["size", "number", "Chart diameter."], ["thickness", "number", "Ring thickness."], ["centerLabel", "ReactNode", "Content displayed inside the ring."]),
    "Segment labels remain visible in the legend; add a table when precise comparison is required.",
  ),
  "components/scatter-chart": () => detail(
    `<ScatterChart series={[{ label: "API", data: [{ x: 12, y: 420, label: "GET /users" }] }]} />`,
    <R.ScatterChart className="w-full" height={220} xLabel="Latency (ms)" series={[{ label: "API", color: "#3b82f6", data: [{ x: 12, y: 420, label: "GET /users" }, { x: 28, y: 280, label: "POST /auth" }, { x: 45, y: 110, label: "POST /deploy" }] }, { label: "Worker", color: "#10b981", data: [{ x: 55, y: 140, label: "push:registry" }, { x: 90, y: 60, label: "build:docker" }] }]} />,
    api(["series", "ScatterSeries[]", "Named point series."], ["xLabel", "string", "Horizontal axis label."], ["formatX / formatY", "(value) => string", "Axis and tooltip formatters."], ["height", "number", "Chart height."]),
    "Label both axes and expose exact point values in an alternate textual form when essential.",
  ),
  "components/gantt-chart": () => detail(
    `<GanttChart xLabels={["Mon", "Tue", "Wed"]} tasks={[{ id: "api", label: "API design", start: 0, end: 2 }]} />`,
    <R.GanttChart className="w-full" xLabels={["Mon", "Tue", "Wed", "Thu", "Fri"]} tasks={[{ id: "api", label: "API design", start: 0, end: 2 }, { id: "db", label: "DB schema", start: 1, end: 3 }, { id: "deploy", label: "Deploy", start: 3, end: 5 }]} />,
    api(["tasks", "GanttTask[]", "Labeled task ranges."], ["xLabels", "string[]", "Timeline column labels."], ["className", "string", "Composes chart dimensions."]),
    "Task names and timeline labels should remain available as text; supplement complex schedules with a table.",
  ),
  "components/heatmap-chart": () => detail(
    `<HeatmapChart rowLabels={["Mon", "Tue"]} colLabels={["0h", "6h", "12h"]} data={[[2, 8, 18], [3, 10, 22]]} />`,
    <R.HeatmapChart rowLabels={["Mon", "Tue", "Wed", "Thu"]} colLabels={["0h", "6h", "12h", "18h"]} data={[[2, 8, 18, 12], [3, 10, 22, 14], [1, 9, 20, 16], [4, 12, 24, 18]]} />,
    api(["data", "number[][]", "Matrix of cell values."], ["rowLabels", "string[]", "Labels for matrix rows."], ["colLabels", "string[]", "Labels for matrix columns."], ["color", "string", "Base intensity color."], ["formatValue", "(value) => string", "Tooltip formatter."]),
    "Keep row and column labels descriptive and provide an accessible table for exact matrix values.",
  ),
  "components/radar-chart": () => detail(
    `<RadarChart axes={["Uptime", "Latency", "Errors"]} series={[{ label: "API", data: [92, 85, 95] }]} />`,
    <R.RadarChart axes={["Uptime", "Throughput", "Latency", "Errors", "Saturation"]} series={[{ label: "API", color: "#3b82f6", data: [92, 78, 85, 95, 70] }, { label: "Worker", color: "#10b981", data: [88, 65, 72, 90, 60] }]} />,
    api(["axes", "string[]", "Dimension labels."], ["series", "RadarSeries[]", "Named values across every axis."], ["max", "number", "Maximum axis value."], ["size", "number", "Chart diameter."]),
    "Name every axis and series; provide an alternate comparison table for precise interpretation.",
  ),
  "components/funnel-chart": () => detail(
    `<FunnelChart data={[{ label: "Triggered", value: 1200 }, { label: "Healthy", value: 960 }]} />`,
    <R.FunnelChart className="w-full" height={220} data={[{ label: "Triggered", value: 1200 }, { label: "Built", value: 1140 }, { label: "Pushed", value: 1080 }, { label: "Deployed", value: 1020 }, { label: "Healthy", value: 960 }]} />,
    chartProps,
    "Stage names and values should also be available as text when conversion details drive decisions.",
  ),
  "components/waterfall-chart": () => detail(
    `<WaterfallChart data={[{ label: "Base", value: 200 }, { label: "Compute", value: 120 }, { label: "Total", value: 0, total: true }]} />`,
    <R.WaterfallChart className="w-full" height={220} data={[{ label: "Base", value: 200 }, { label: "Compute", value: 120 }, { label: "Storage", value: 45 }, { label: "Discount", value: -60 }, { label: "Total", value: 0, total: true }]} formatValue={(value) => `$${Math.abs(value)}`} />,
    chartProps,
    "Positive, negative, and total values need textual labels; add a table for accounting-critical figures.",
  ),
}
