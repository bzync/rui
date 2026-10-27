"use client"

/* Lazy documentation registry of live JSX factories, not a Fast Refresh boundary. */
/* eslint-disable react-refresh/only-export-components */

/*
  Examples for the remaining component pages. Same contract as
  component-examples.tsx: `code` is exactly what `preview` renders. Links point
  at real docs routes (the site uses hash routing, so "#anything" would leave
  the page).
*/

import * as R from "@bzync/rui"
import {
  Activity,
  BarChart3,
  Box,
  Database,
  FileCode2,
  FileText,
  Folder,
  Home,
  Moon,
  Plus,
  Rocket,
  Search,
  Settings,
  Users,
  WifiOff,
} from "lucide-react"
import { type ReactNode, useState } from "react"
import { RuiBrandMark } from "../_shared/brand"
import type { ComponentExample } from "./component-examples"

const ex = (id: string, title: string, description: string, code: string, preview: ReactNode, align?: "center" | "start"): ComponentExample =>
  ({ id, title, description, code, preview, align })

// ─── Actions ────────────────────────────────────────────────────────────────

function BillingPricingExample() {
  const [interval, setInterval] = useState<R.BillingInterval>("monthly")
  const price = { monthly: 24, quarterly: 22, yearly: 19 }[interval]
  return (
    <div className="demo-stack items-center">
      <R.BillingIntervalToggle
        value={interval}
        onChange={setInterval}
        options={[
          { value: "monthly", label: "Monthly" },
          { value: "yearly", label: "Yearly", badge: "-20%" },
        ]}
      />
      <p className="text-3xl font-semibold tabular-nums">{`$${price}`}<span className="text-sm font-normal text-muted-foreground"> / seat / month</span></p>
    </div>
  )
}

// ─── Forms ──────────────────────────────────────────────────────────────────

function NumberInputCartExample() {
  const [seats, setSeats] = useState(5)
  return (
    <div className="demo-stack w-full max-w-xs">
      <R.NumberInput label="Seats" min={1} max={50} value={seats} onChange={setSeats} hint="Billed per active seat" />
      <span className="text-sm text-muted-foreground" role="status">{`Total: $${seats * 12}/month`}</span>
    </div>
  )
}

function OtpVerifyExample() {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle")
  return (
    <R.OtpInput
      label="Verification code"
      length={6}
      onChange={() => setStatus("idle")}
      onComplete={(code) => setStatus(code === "123456" ? "ok" : "error")}
      hint={status === "ok" ? "Verified — you're all set." : "Try 123456"}
      error={status === "error" ? "That code is incorrect." : undefined}
    />
  )
}

function FileUploadListExample() {
  const [files, setFiles] = useState<File[]>([])
  return (
    <div className="demo-stack w-full max-w-md">
      <R.FileUpload label="Attachments" multiple accept="image/*,.pdf" maxSizeMB={10} onFilesChange={setFiles} hint="Images or PDF, up to 10 MB each" />
      <span className="text-sm text-muted-foreground" role="status">{files.length ? `${files.length} file(s): ${files.map((file) => file.name).join(", ")}` : "No files selected"}</span>
    </div>
  )
}

function DatePickerRangeExample() {
  const [start, setStart] = useState<Date | null>(null)
  const [end, setEnd] = useState<Date | null>(null)
  return (
    <div className="demo-form-grid">
      <R.DatePicker label="Check-in" value={start} onChange={(date) => { setStart(date); if (end && date && end < date) setEnd(null) }} />
      <R.DatePicker label="Check-out" value={end} onChange={setEnd} minDate={start ?? undefined} hint={start ? undefined : "Pick a check-in date first"} disabled={!start} />
    </div>
  )
}

function TimePicker24Example() {
  const [time, setTime] = useState("14:30:00")
  return (
    <div className="demo-stack w-full max-w-xs">
      <R.TimePicker label="Backup window" format="24" showSeconds value={time} onValueChange={setTime} />
      <span className="text-sm text-muted-foreground" role="status">{`Stored value: "${time}"`}</span>
    </div>
  )
}

function CalendarEditableExample() {
  const [events, setEvents] = useState<R.CalendarEvent[]>(() => {
    const today = new Date()
    return [
      { id: "1", title: "Release v2.5", date: today, time: "10:00", color: "green" },
      { id: "2", title: "Incident review", date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2), time: "15:00", color: "red" },
    ]
  })
  return (
    <div className="demo-stack w-full">
      <R.Calendar editable events={events} onEventsChange={setEvents} defaultView="month" />
      <span className="text-sm text-muted-foreground" role="status">{`${events.length} events`}</span>
    </div>
  )
}

function RatingControlledExample() {
  const [rating, setRating] = useState(0)
  const labels = ["", "Poor", "Fair", "Good", "Great", "Excellent"]
  return (
    <div className="demo-stack items-center">
      <R.Rating label="Rate this release" value={rating} onValueChange={setRating} size="lg" />
      <span className="text-sm text-muted-foreground" role="status">{rating ? labels[rating] : "Not rated yet"}</span>
    </div>
  )
}

// ─── Display ────────────────────────────────────────────────────────────────

function TreeExplorerExample() {
  const [selected, setSelected] = useState("button")
  return (
    <div className="demo-stack w-full max-w-xs">
      <R.Tree
        selected={selected}
        onSelect={setSelected}
        defaultExpanded={["src", "components"]}
        nodes={[
          { id: "src", label: "src", icon: <Folder size={14} />, children: [
            { id: "components", label: "components", icon: <Folder size={14} />, children: [
              { id: "button", label: "button.tsx", icon: <FileCode2 size={14} /> },
              { id: "modal", label: "modal.tsx", icon: <FileCode2 size={14} /> },
            ] },
            { id: "index", label: "index.ts", icon: <FileCode2 size={14} /> },
          ] },
          { id: "readme", label: "README.md", icon: <FileText size={14} /> },
          { id: "secrets", label: ".env (no access)", icon: <FileText size={14} />, disabled: true },
        ]}
      />
      <span className="text-sm text-muted-foreground" role="status">{`Selected: ${selected}`}</span>
    </div>
  )
}

function CopyButtonFieldExample() {
  const token = "rui_pk_live_8f2a91c4e7"
  return (
    <div className="flex w-full max-w-md items-center gap-2">
      <R.Input aria-label="API token" readOnly value={token} wrapperClassName="flex-1" inputClassName="font-mono" />
      <R.CopyButton value={token} label="Copy token" />
    </div>
  )
}

// ─── Feedback ───────────────────────────────────────────────────────────────

function ErrorStateRetryExample() {
  const [attempts, setAttempts] = useState(0)
  const [loading, setLoading] = useState(false)
  function retry() {
    setLoading(true)
    window.setTimeout(() => { setLoading(false); setAttempts((count) => count + 1) }, 900)
  }
  if (loading) return <div className="flex items-center gap-2 text-sm text-muted-foreground"><R.Spinner size="sm" /> Reconnecting…</div>
  if (attempts >= 2) return <R.Alert variant="success" title="Connected" className="w-full max-w-md">Deployments loaded.</R.Alert>
  return (
    <R.ErrorState
      className="w-full max-w-md"
      title="Couldn't load deployments"
      description={attempts ? "Still failing — try once more." : "The API did not respond in time."}
      error="ETIMEDOUT after 10000 ms"
      onRetry={retry}
    />
  )
}

// ─── Overlays ───────────────────────────────────────────────────────────────

function CommandPaletteTrigger() {
  const { setOpen } = R.useCommand()
  return (
    <R.Button variant="secondary" icon={<Search size={15} />} onClick={() => setOpen(true)}>
      Search… <R.Kbd keys={["Ctrl", "J"]} />
    </R.Button>
  )
}

function CommandGroupsExample() {
  const [last, setLast] = useState("nothing yet")
  return (
    <R.CommandProvider shortcut="j">
      <div className="demo-stack items-center">
        <CommandPaletteTrigger />
        <span className="text-sm text-muted-foreground" role="status">{`Last command: ${last}`}</span>
      </div>
      <R.CommandPalette
        placeholder="Type a command or search…"
        emptyText="No commands found."
        items={[
          { id: "new", label: "New project", group: "Actions", icon: <Plus size={15} />, shortcut: ["N"], onSelect: () => setLast("New project") },
          { id: "deploy", label: "Deploy to production", group: "Actions", icon: <Rocket size={15} />, keywords: ["release", "ship"], onSelect: () => setLast("Deploy") },
          { id: "theme", label: "Toggle dark mode", group: "Preferences", icon: <Moon size={15} />, onSelect: () => setLast("Toggle dark mode") },
          { id: "settings", label: "Open settings", description: "Workspace and billing", group: "Navigation", icon: <Settings size={15} />, onSelect: () => setLast("Open settings") },
        ]}
      />
    </R.CommandProvider>
  )
}

// ─── Navigation ─────────────────────────────────────────────────────────────

const navItems: R.NavigationItem[] = [
  { id: "overview", label: "Overview", icon: <Home size={16} /> },
  { id: "projects", label: "Projects", icon: <Box size={16} />, badge: <R.Badge size="sm">12</R.Badge> },
  { id: "activity", label: "Activity", icon: <Activity size={16} /> },
  { id: "team", label: "Team", icon: <Users size={16} />, disabled: true },
]

function SidebarExample() {
  const [active, setActive] = useState("projects")
  return (
    <div className="flex w-full max-w-xl overflow-hidden rounded-xl border border-border">
      <R.Sidebar
        className="rounded-none border-0 border-r"
        items={navItems}
        activeId={active}
        onSelect={setActive}
        header={<R.BrandLink href="#/docs/introduction" mark={<RuiBrandMark size={20} />}>Acme</R.BrandLink>}
        footer={<div className="flex items-center gap-2"><R.Avatar name="Maya Chen" size="sm" /><span className="text-sm">Maya Chen</span></div>}
      />
      <div className="flex-1">
        <R.Topbar><R.TopbarTitle>{navItems.find((item) => item.id === active)?.label}</R.TopbarTitle><R.Button size="sm">New</R.Button></R.Topbar>
        <p className="p-4 text-sm text-muted-foreground">{`Content for ${active}.`}</p>
      </div>
    </div>
  )
}

function BottomBarExample() {
  const [active, setActive] = useState("overview")
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border border-border">
      <p className="h-32 p-4 text-sm text-muted-foreground">{`Mobile screen: ${active}`}</p>
      <R.BottomBar className="rounded-none border-x-0 border-b-0 shadow-none" items={navItems.slice(0, 3)} activeId={active} onSelect={setActive} />
    </div>
  )
}

// ─── Data ───────────────────────────────────────────────────────────────────

type Invoice = { id: number; customer: string; amount: number; status: "Paid" | "Due" | "Overdue" }

const invoices: Invoice[] = [
  { id: 1, customer: "Acme Corp", amount: 1240, status: "Paid" },
  { id: 2, customer: "Globex", amount: 860, status: "Due" },
  { id: 3, customer: "Initech", amount: 2310, status: "Overdue" },
  { id: 4, customer: "Umbrella", amount: 410, status: "Paid" },
  { id: 5, customer: "Hooli", amount: 1980, status: "Due" },
  { id: 6, customer: "Stark Industries", amount: 5120, status: "Paid" },
  { id: 7, customer: "Wayne Enterprises", amount: 3300, status: "Overdue" },
]

const invoiceColumns: R.ColumnDef<Invoice>[] = [
  { key: "customer", header: "Customer", sortable: true, searchable: true, cell: (row) => row.customer },
  { key: "amount", header: "Amount", sortable: true, align: "right", cell: (row) => <R.Currency value={row.amount} /> },
  { key: "status", header: "Status", sortable: true, cell: (row) => <R.Badge variant={row.status === "Paid" ? "success" : row.status === "Due" ? "warning" : "danger"}>{row.status}</R.Badge> },
]

function DataTableFullExample() {
  const [opened, setOpened] = useState<string | null>(null)
  return (
    <div className="demo-stack w-full">
      <R.DataTable
        ariaLabel="Invoices"
        columns={invoiceColumns}
        data={invoices}
        searchable
        searchPlaceholder="Search customers…"
        pageSizeOptions={[3, 5, 10]}
        defaultPageSize={3}
        onRowClick={(row) => setOpened(row.customer)}
        getRowLabel={(row) => `Open invoice for ${row.customer}`}
      />
      <span className="text-sm text-muted-foreground" role="status">{opened ? `Opened invoice for ${opened}` : "Click a row to open it"}</span>
    </div>
  )
}

function DataTableStatesExample() {
  const [loading, setLoading] = useState(true)
  return (
    <div className="demo-stack w-full">
      <R.Switch label="Loading" checked={loading} onCheckedChange={setLoading} />
      <R.DataTable ariaLabel="Invoices (empty)" columns={invoiceColumns} data={[]} loading={loading} emptyMessage="No invoices this month." pageSizeOptions={false} density="compact" />
    </div>
  )
}

// ─── Editors ────────────────────────────────────────────────────────────────

function CodeEditorPreviewExample() {
  const [code, setCode] = useState("{\n  \"name\": \"api-gateway\",\n  \"replicas\": 3\n}")
  let valid = true
  try { JSON.parse(code) } catch { valid = false }
  return (
    <div className="demo-stack w-full">
      <R.CodeEditor language="json" value={code} onChange={setCode} minRows={5} maxRows={12} />
      <R.Badge variant={valid ? "success" : "danger"} dot className="justify-self-start">{valid ? "Valid JSON" : "Invalid JSON"}</R.Badge>
    </div>
  )
}

function RichTextOutputExample() {
  const [html, setHtml] = useState("<p>Release <strong>v2.5</strong> adds audit log exports.</p>")
  return (
    <div className="demo-stack w-full">
      <R.RichTextEditor value={html} onChange={setHtml} placeholder="Write release notes…" minHeight={140} />
      <R.CodeBlock language="html" filename="output.html" code={html} />
    </div>
  )
}

// ─── Registry ───────────────────────────────────────────────────────────────

export const extendedExamples: Record<string, () => ComponentExample[]> = {
  "components/copy-button": () => [
    ex("field", "Copyable field", "Pair a read-only input with CopyButton for tokens, IDs and URLs.",
      `function TokenField() {
  const token = "rui_pk_live_8f2a91c4e7"
  return (
    <div className="flex items-center gap-2">
      <Input aria-label="API token" readOnly value={token} wrapperClassName="flex-1" inputClassName="font-mono" />
      <CopyButton value={token} label="Copy token" />
    </div>
  )
}`,
      <CopyButtonFieldExample />),
    ex("sizes", "Sizes and timeout", "size=\"sm\" for dense rows; timeout controls how long the copied state shows.",
      `<CopyButton value="prj_8f2a91c" label="Copy ID" size="sm" />
<CopyButton value="https://atlas.bzync.app" label="Copy URL" timeout={4000} />`,
      <div className="demo-row"><R.CopyButton value="prj_8f2a91c" label="Copy ID" size="sm" /><R.CopyButton value="https://atlas.bzync.app" label="Copy URL" timeout={4000} /></div>),
  ],

  "components/info-button": () => [
    ex("popover", "With a popover", "InfoButton is a trigger; open richer help in a Popover.",
      `<div className="flex items-center gap-2">
  <span className="text-sm font-medium">Concurrency limit</span>
  <Popover trigger={<InfoButton label="About concurrency limits" />}>
    <PopoverContent className="w-64 text-sm">
      Builds beyond the limit are queued, not dropped. Upgrade to raise it.
    </PopoverContent>
  </Popover>
</div>`,
      <div className="flex items-center gap-2"><span className="text-sm font-medium">Concurrency limit</span><R.Popover trigger={<R.InfoButton label="About concurrency limits" />}><R.PopoverContent className="w-64 text-sm">Builds beyond the limit are queued, not dropped. Upgrade to raise it.</R.PopoverContent></R.Popover></div>),
  ],

  "components/billing-interval-toggle": () => [
    ex("pricing", "Driving a price", "Two options and a discount badge; the price is derived from the interval.",
      `function PlanPrice() {
  const [interval, setInterval] = useState<BillingInterval>("monthly")
  const price = { monthly: 24, quarterly: 22, yearly: 19 }[interval]
  return (
    <>
      <BillingIntervalToggle
        value={interval}
        onChange={setInterval}
        options={[
          { value: "monthly", label: "Monthly" },
          { value: "yearly", label: "Yearly", badge: "-20%" },
        ]}
      />
      <p>{\`$\${price}\`} / seat / month</p>
    </>
  )
}`,
      <BillingPricingExample />),
    ex("disabled", "Disabled", "Lock the interval while a checkout is in progress.",
      `<BillingIntervalToggle value="yearly" onChange={setInterval} disabled />`,
      <R.BillingIntervalToggle value="yearly" onChange={() => {}} disabled />),
  ],

  "components/number-input": () => [
    ex("controlled", "Controlled with a total", "onChange receives a clamped number, ready to use in calculations.",
      `function SeatPicker() {
  const [seats, setSeats] = useState(5)
  return (
    <>
      <NumberInput label="Seats" min={1} max={50} value={seats} onChange={setSeats} hint="Billed per active seat" />
      <span role="status">{\`Total: $\${seats * 12}/month\`}</span>
    </>
  )
}`,
      <NumberInputCartExample />),
    ex("format", "Step, format and sizes", "step for decimals, formatDisplay for units, three sizes.",
      `<NumberInput label="CPU" size="sm" min={0.25} max={8} step={0.25} defaultValue={1} formatDisplay={(v) => \`\${v} vCPU\`} />
<NumberInput label="Memory" size="md" min={256} max={8192} step={256} defaultValue={1024} formatDisplay={(v) => \`\${v} MB\`} />
<NumberInput label="Disk" size="lg" min={10} max={500} step={10} defaultValue={50} error="Exceeds plan quota" />`,
      <div className="demo-form-grid"><R.NumberInput label="CPU" size="sm" min={0.25} max={8} step={0.25} defaultValue={1} formatDisplay={(v) => `${v} vCPU`} /><R.NumberInput label="Memory" size="md" min={256} max={8192} step={256} defaultValue={1024} formatDisplay={(v) => `${v} MB`} /><R.NumberInput label="Disk" size="lg" min={10} max={500} step={10} defaultValue={50} error="Exceeds plan quota" /></div>),
  ],

  "components/otp-input": () => [
    ex("verify", "Verify on complete", "onComplete fires once every digit is filled. Enter 123456 to pass.",
      `function VerifyCode() {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle")
  return (
    <OtpInput
      label="Verification code"
      length={6}
      onChange={() => setStatus("idle")}
      onComplete={(code) => setStatus(code === "123456" ? "ok" : "error")}
      hint={status === "ok" ? "Verified — you're all set." : "Try 123456"}
      error={status === "error" ? "That code is incorrect." : undefined}
    />
  )
}`,
      <OtpVerifyExample />),
    ex("variants", "Length, masked and disabled", "A 4-digit masked PIN and a disabled field.",
      `<OtpInput label="PIN" length={4} masked />
<OtpInput label="Code" length={6} value="482" disabled />`,
      <div className="demo-stack"><R.OtpInput label="PIN" length={4} masked /><R.OtpInput label="Code" length={6} value="482" disabled /></div>),
  ],

  "components/file-upload": () => [
    ex("multiple", "Multiple files", "multiple with accept and maxSizeMB; read the selection from onFilesChange.",
      `function Attachments() {
  const [files, setFiles] = useState<File[]>([])
  return (
    <>
      <FileUpload label="Attachments" multiple accept="image/*,.pdf" maxSizeMB={10} onFilesChange={setFiles} hint="Images or PDF, up to 10 MB each" />
      <span role="status">
        {files.length ? \`\${files.length} file(s): \${files.map((file) => file.name).join(", ")}\` : "No files selected"}
      </span>
    </>
  )
}`,
      <FileUploadListExample />),
    ex("states", "Error and disabled", "Field messaging matches the other form controls.",
      `<FileUpload label="Logo" accept="image/png" error="Logo must be a PNG under 1 MB." />
<FileUpload label="Contract" disabled hint="Uploads are locked after signing." />`,
      <div className="demo-form-grid"><R.FileUpload label="Logo" accept="image/png" error="Logo must be a PNG under 1 MB." /><R.FileUpload label="Contract" disabled hint="Uploads are locked after signing." /></div>),
  ],

  "components/date-picker": () => [
    ex("range", "Dependent range", "Two pickers where check-out is constrained by check-in.",
      `function StayDates() {
  const [start, setStart] = useState<Date | null>(null)
  const [end, setEnd] = useState<Date | null>(null)
  return (
    <>
      <DatePicker
        label="Check-in"
        value={start}
        onChange={(date) => { setStart(date); if (end && date && end < date) setEnd(null) }}
      />
      <DatePicker
        label="Check-out"
        value={end}
        onChange={setEnd}
        minDate={start ?? undefined}
        hint={start ? undefined : "Pick a check-in date first"}
        disabled={!start}
      />
    </>
  )
}`,
      <DatePickerRangeExample />),
    ex("states", "Error and not clearable", "error marks the field invalid; clearable={false} keeps a value selected.",
      `function DateStates() {
  const [renewal, setRenewal] = useState<Date | null>(new Date(2026, 11, 1))
  return (
    <>
      <DatePicker label="Start date" error="Start date is required." />
      <DatePicker label="Renewal date" value={renewal} onChange={setRenewal} clearable={false} />
    </>
  )
}`,
      <DatePickerStatesExample />),
  ],

  "components/time-picker": () => [
    ex("24h", "24-hour with seconds", "The value is always an HH:mm[:ss] string, whatever the display format.",
      `function BackupWindow() {
  const [time, setTime] = useState("14:30:00")
  return (
    <>
      <TimePicker label="Backup window" format="24" showSeconds value={time} onValueChange={setTime} />
      <span role="status">{\`Stored value: "\${time}"\`}</span>
    </>
  )
}`,
      <TimePicker24Example />),
    ex("sizes", "Sizes and alignment", "Three trigger sizes; align=\"end\" anchors the panel to the right edge.",
      `<TimePicker label="Small" size="sm" defaultValue="09:00" />
<TimePicker label="Medium" size="md" defaultValue="12:30" />
<TimePicker label="Large" size="lg" defaultValue="18:45" align="end" />`,
      <div className="demo-form-grid"><R.TimePicker label="Small" size="sm" defaultValue="09:00" /><R.TimePicker label="Medium" size="md" defaultValue="12:30" /><R.TimePicker label="Large" size="lg" defaultValue="18:45" align="end" /></div>),
  ],

  "components/calendar": () => [
    ex("editable", "Editable events", "editable lets people create, move and delete events; keep them in state with onEventsChange.",
      `function TeamCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const today = new Date()
    return [
      { id: "1", title: "Release v2.5", date: today, time: "10:00", color: "green" },
      { id: "2", title: "Incident review", date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2), time: "15:00", color: "red" },
    ]
  })
  return (
    <>
      <Calendar editable events={events} onEventsChange={setEvents} defaultView="month" />
      <span role="status">{\`\${events.length} events\`}</span>
    </>
  )
}`,
      <CalendarEditableExample />),
    ex("constraints", "Week view with disabled dates", "Week view, weekends disabled.",
      `<Calendar
  defaultView="week"
  disabledDates={(date) => date.getDay() === 0 || date.getDay() === 6}
/>`,
      <R.Calendar className="w-full" defaultView="week" disabledDates={(date) => date.getDay() === 0 || date.getDay() === 6} />),
  ],

  "components/label": () => [
    ex("composition", "With a native control", "Label works with any control, including native elements.",
      `<div className="grid gap-1.5">
  <Label htmlFor="label-demo-region" required>Region</Label>
  <select id="label-demo-region" className="h-9 rounded-md border border-border bg-surface px-2 text-sm">
    <option>US East</option>
    <option>EU Central</option>
  </select>
</div>`,
      <div className="grid w-full max-w-xs gap-1.5"><R.Label htmlFor="label-demo-region" required>Region</R.Label><select id="label-demo-region" className="h-9 rounded-md border border-border bg-surface px-2 text-sm"><option>US East</option><option>EU Central</option></select></div>),
  ],

  "components/form-field": () => [
    ex("custom", "Wrapping any control", "FormField supplies label, hint and error around controls that don't have them built in.",
      `<FormField label="Theme" htmlFor="form-field-theme" hint="Applies to every workspace member.">
  <ToggleGroup id="form-field-theme" type="single" defaultValue="system" variant="outline" aria-label="Theme">
    <ToggleGroupItem value="light">Light</ToggleGroupItem>
    <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
    <ToggleGroupItem value="system">System</ToggleGroupItem>
  </ToggleGroup>
</FormField>
<FormField label="Satisfaction" error="Please rate before submitting." required>
  <Rating label="Satisfaction" showLabel={false} />
</FormField>`,
      <div className="demo-stack"><R.FormField label="Theme" htmlFor="form-field-theme" hint="Applies to every workspace member."><R.ToggleGroup id="form-field-theme" type="single" defaultValue="system" variant="outline" aria-label="Theme"><R.ToggleGroupItem value="light">Light</R.ToggleGroupItem><R.ToggleGroupItem value="dark">Dark</R.ToggleGroupItem><R.ToggleGroupItem value="system">System</R.ToggleGroupItem></R.ToggleGroup></R.FormField><R.FormField label="Satisfaction" error="Please rate before submitting." required><R.Rating label="Satisfaction" showLabel={false} /></R.FormField></div>, "start"),
  ],

  "components/rating": () => [
    ex("controlled", "Controlled with labels", "Map the value to words for a clearer result.",
      `function ReleaseRating() {
  const [rating, setRating] = useState(0)
  const labels = ["", "Poor", "Fair", "Good", "Great", "Excellent"]
  return (
    <>
      <Rating label="Rate this release" value={rating} onValueChange={setRating} size="lg" />
      <span role="status">{rating ? labels[rating] : "Not rated yet"}</span>
    </>
  )
}`,
      <RatingControlledExample />),
    ex("variants", "Sizes, max and read-only", "Different scales and a read-only average.",
      `<Rating label="Small" size="sm" defaultValue={3} />
<Rating label="Out of 10" max={10} defaultValue={7} showValue />
<Rating label="Average rating" readOnly defaultValue={4} showValue />`,
      <div className="demo-stack"><R.Rating label="Small" size="sm" defaultValue={3} /><R.Rating label="Out of 10" max={10} defaultValue={7} showValue /><R.Rating label="Average rating" readOnly defaultValue={4} showValue /></div>),
  ],

  "components/aspect-ratio": () => [
    ex("ratios", "Common ratios", "Square, 4:3 and 16:9 frames for media and previews.",
      `<div className="grid grid-cols-3 items-start gap-3">
  <AspectRatio ratio={1} className="rounded-lg border border-border bg-surface-muted">
    <span className="grid h-full place-items-center text-sm text-muted-foreground">1:1</span>
  </AspectRatio>
  <AspectRatio ratio={4 / 3} className="rounded-lg border border-border bg-surface-muted">
    <span className="grid h-full place-items-center text-sm text-muted-foreground">4:3</span>
  </AspectRatio>
  <AspectRatio ratio={16 / 9} className="rounded-lg border border-border bg-surface-muted">
    <span className="grid h-full place-items-center text-sm text-muted-foreground">16:9</span>
  </AspectRatio>
</div>`,
      <div className="grid w-full max-w-xl grid-cols-3 items-start gap-3"><R.AspectRatio ratio={1} className="rounded-lg border border-border bg-surface-muted"><span className="grid h-full place-items-center text-sm text-muted-foreground">1:1</span></R.AspectRatio><R.AspectRatio ratio={4 / 3} className="rounded-lg border border-border bg-surface-muted"><span className="grid h-full place-items-center text-sm text-muted-foreground">4:3</span></R.AspectRatio><R.AspectRatio ratio={16 / 9} className="rounded-lg border border-border bg-surface-muted"><span className="grid h-full place-items-center text-sm text-muted-foreground">16:9</span></R.AspectRatio></div>),
  ],

  "components/avatar-group": () => [
    ex("spacing", "Spacing and overflow", "tight, normal and loose overlap; the overflow chip has a readable label.",
      `<AvatarGroup spacing="tight" aria-label="Reviewers">
  <Avatar name="Maya Chen" size="sm" />
  <Avatar name="Jordan Kim" size="sm" />
  <AvatarGroupOverflow count={3} size="sm" />
</AvatarGroup>
<AvatarGroup spacing="loose" aria-label="Owners">
  <Avatar name="Sam Rivera" size="lg" />
  <Avatar name="Ari Patel" size="lg" />
  <AvatarGroupOverflow count={12} size="lg" label="12 more owners" />
</AvatarGroup>`,
      <div className="demo-row"><R.AvatarGroup spacing="tight" aria-label="Reviewers"><R.Avatar name="Maya Chen" size="sm" /><R.Avatar name="Jordan Kim" size="sm" /><R.AvatarGroupOverflow count={3} size="sm" /></R.AvatarGroup><R.AvatarGroup spacing="loose" aria-label="Owners"><R.Avatar name="Sam Rivera" size="lg" /><R.Avatar name="Ari Patel" size="lg" /><R.AvatarGroupOverflow count={12} size="lg" label="12 more owners" /></R.AvatarGroup></div>),
  ],

  "components/blockquote": () => [
    ex("variants", "Variants and sizes", "default, accent and subtle treatments with a linked source.",
      `<Blockquote size="sm" source="Grace Hopper">The most dangerous phrase is “we've always done it this way.”</Blockquote>
<Blockquote variant="accent" source="Postmortem #42" sourceHref="#/patterns/feedback">Alert on symptoms, not causes.</Blockquote>
<Blockquote variant="subtle" size="lg">Ship small, ship often.</Blockquote>`,
      <div className="demo-stack w-full max-w-lg"><R.Blockquote size="sm" source="Grace Hopper">The most dangerous phrase is “we&apos;ve always done it this way.”</R.Blockquote><R.Blockquote variant="accent" source="Postmortem #42" sourceHref="#/patterns/feedback">Alert on symptoms, not causes.</R.Blockquote><R.Blockquote variant="subtle" size="lg">Ship small, ship often.</R.Blockquote></div>),
  ],

  "components/currency": () => [
    ex("locales", "Locales and currencies", "Formatting follows the locale; accounting wraps negatives in parentheses.",
      `<Currency value={1234567.89} currency="USD" />
<Currency value={1234567.89} currency="EUR" locale="de-DE" />
<Currency value={1234567} currency="JPY" locale="ja-JP" />
<Currency value={1234567.89} currency="PHP" locale="en-PH" />
<Currency value={-4200} currency="USD" accounting />`,
      <div className="demo-stack items-start"><R.Currency value={1234567.89} currency="USD" /><R.Currency value={1234567.89} currency="EUR" locale="de-DE" /><R.Currency value={1234567} currency="JPY" locale="ja-JP" /><R.Currency value={1234567.89} currency="PHP" locale="en-PH" /><R.Currency value={-4200} currency="USD" accounting /></div>),
    ex("tones", "Tones and sizes", "tone=\"auto\" colors negatives; sizes scale for KPIs.",
      `<Currency value={18400} size="xl" tone="positive" />
<Currency value={-920} size="lg" />
<Currency value={0} size="md" tone="muted" />
<Currency value={Number.NaN} fallback="Not available" />`,
      <div className="demo-row"><R.Currency value={18400} size="xl" tone="positive" /><R.Currency value={-920} size="lg" /><R.Currency value={0} size="md" tone="muted" /><R.Currency value={Number.NaN} fallback="Not available" /></div>),
  ],

  "components/description-list": () => [
    ex("inline", "Inline and compact", "orientation=\"inline\" puts term and value side by side for dense panels.",
      `<DescriptionList density="compact">
  <DescriptionItem orientation="inline">
    <DescriptionTerm>Plan</DescriptionTerm>
    <DescriptionDetails>Pro</DescriptionDetails>
  </DescriptionItem>
  <DescriptionItem orientation="inline">
    <DescriptionTerm>Seats</DescriptionTerm>
    <DescriptionDetails>12 of 20</DescriptionDetails>
  </DescriptionItem>
  <DescriptionItem orientation="inline">
    <DescriptionTerm>Renews</DescriptionTerm>
    <DescriptionDetails>Dec 1, 2026</DescriptionDetails>
  </DescriptionItem>
</DescriptionList>`,
      <R.DescriptionList className="w-full max-w-sm" density="compact"><R.DescriptionItem orientation="inline"><R.DescriptionTerm>Plan</R.DescriptionTerm><R.DescriptionDetails>Pro</R.DescriptionDetails></R.DescriptionItem><R.DescriptionItem orientation="inline"><R.DescriptionTerm>Seats</R.DescriptionTerm><R.DescriptionDetails>12 of 20</R.DescriptionDetails></R.DescriptionItem><R.DescriptionItem orientation="inline"><R.DescriptionTerm>Renews</R.DescriptionTerm><R.DescriptionDetails>Dec 1, 2026</R.DescriptionDetails></R.DescriptionItem></R.DescriptionList>),
    ex("three", "Three columns, relaxed", "Responsive columns for detail pages.",
      `<DescriptionList columns={3} density="relaxed">
  <DescriptionItem><DescriptionTerm>Framework</DescriptionTerm><DescriptionDetails>Next.js</DescriptionDetails></DescriptionItem>
  <DescriptionItem><DescriptionTerm>Node</DescriptionTerm><DescriptionDetails>22.x</DescriptionDetails></DescriptionItem>
  <DescriptionItem><DescriptionTerm>Build time</DescriptionTerm><DescriptionDetails>48s</DescriptionDetails></DescriptionItem>
</DescriptionList>`,
      <R.DescriptionList className="w-full" columns={3} density="relaxed"><R.DescriptionItem><R.DescriptionTerm>Framework</R.DescriptionTerm><R.DescriptionDetails>Next.js</R.DescriptionDetails></R.DescriptionItem><R.DescriptionItem><R.DescriptionTerm>Node</R.DescriptionTerm><R.DescriptionDetails>22.x</R.DescriptionDetails></R.DescriptionItem><R.DescriptionItem><R.DescriptionTerm>Build time</R.DescriptionTerm><R.DescriptionDetails>48s</R.DescriptionDetails></R.DescriptionItem></R.DescriptionList>),
  ],

  "components/divider": () => [
    ex("variants", "Line styles and spacing", "solid, dashed and dotted rules with configurable spacing.",
      `<Divider spacing="sm" />
<Divider variant="dashed" spacing="md" label="Optional" />
<Divider variant="dotted" spacing="lg" />`,
      <div className="w-full max-w-md"><R.Divider spacing="sm" /><R.Divider variant="dashed" spacing="md" label="Optional" /><R.Divider variant="dotted" spacing="lg" /></div>),
    ex("toolbar", "Vertical in a toolbar", "Separate toolbar groups with vertical rules.",
      `<div className="flex h-9 items-center gap-1">
  <Button variant="ghost" size="sm">Bold</Button>
  <Button variant="ghost" size="sm">Italic</Button>
  <Divider orientation="vertical" spacing="sm" />
  <Button variant="ghost" size="sm">Link</Button>
</div>`,
      <div className="flex h-9 items-center gap-1"><R.Button variant="ghost" size="sm">Bold</R.Button><R.Button variant="ghost" size="sm">Italic</R.Button><R.Divider orientation="vertical" spacing="sm" /><R.Button variant="ghost" size="sm">Link</R.Button></div>),
  ],

  "components/kbd": () => [
    ex("menu", "Shortcuts in a menu", "Keycaps document shortcuts next to their action.",
      `<ul className="grid gap-2 text-sm">
  <li className="flex justify-between gap-8">Command palette <Kbd keys={["⌘", "K"]} /></li>
  <li className="flex justify-between gap-8">New project <Kbd keys={["⌘", "Shift", "N"]} /></li>
  <li className="flex justify-between gap-8">Close <Kbd keys="Esc" size="md" /></li>
</ul>`,
      <ul className="grid w-full max-w-xs gap-2 text-sm"><li className="flex justify-between gap-8">Command palette <R.Kbd keys={["⌘", "K"]} /></li><li className="flex justify-between gap-8">New project <R.Kbd keys={["⌘", "Shift", "N"]} /></li><li className="flex justify-between gap-8">Close <R.Kbd keys="Esc" size="md" /></li></ul>),
  ],

  "components/link": () => [
    ex("variants", "Variants, icons and external", "Inline links in copy; external opens a new tab with a safe rel.",
      `<p className="text-sm">
  Read the <Link href="#/docs/installation">installation guide</Link>, browse
  the <Link href="#/components" variant="underline">component index</Link>, or
  open the <Link href="https://github.com/bzync/rui" external>repository</Link>.
</p>
<Link href="#/foundations/colors" variant="muted" icon={<Settings size={14} />}>Theme settings</Link>`,
      <div className="demo-stack max-w-md"><p className="text-sm leading-6">Read the <R.Link href="#/docs/installation">installation guide</R.Link>, browse the <R.Link href="#/components" variant="underline">component index</R.Link>, or open the <R.Link href="https://github.com/bzync/rui" external>repository</R.Link>.</p><R.Link href="#/foundations/colors" variant="muted" icon={<Settings size={14} />}>Theme settings</R.Link></div>, "start"),
  ],

  "components/list": () => [
    ex("interactive", "Selectable list", "active marks the current item; onClick makes rows interactive.",
      `function ProjectList() {
  const [active, setActive] = useState("atlas")
  const projects = [
    { id: "atlas", name: "Atlas", meta: "3 deployments today" },
    { id: "nova", name: "Nova", meta: "Last deployed yesterday" },
    { id: "orbit", name: "Orbit", meta: "Paused" },
  ]
  return (
    <List>
      {projects.map((project) => (
        <ListItem
          key={project.id}
          icon={<Box size={15} />}
          description={project.meta}
          active={active === project.id}
          onClick={() => setActive(project.id)}
          trailing={project.id === "orbit" ? <Badge variant="muted" size="sm">Paused</Badge> : undefined}
        >
          {project.name}
        </ListItem>
      ))}
    </List>
  )
}`,
      <ProjectListExample />),
    ex("plain", "Without dividers", "divided={false} for compact sidebars.",
      `<List divided={false}>
  <ListItem icon={<Database size={15} />}>Databases</ListItem>
  <ListItem icon={<BarChart3 size={15} />}>Analytics</ListItem>
  <ListItem icon={<Settings size={15} />}>Settings</ListItem>
</List>`,
      <R.List className="w-full max-w-xs" divided={false}><R.ListItem icon={<Database size={15} />}>Databases</R.ListItem><R.ListItem icon={<BarChart3 size={15} />}>Analytics</R.ListItem><R.ListItem icon={<Settings size={15} />}>Settings</R.ListItem></R.List>),
  ],

  "components/tree": () => [
    ex("explorer", "File explorer", "Icons per node, nested folders and a disabled entry.",
      `function FileExplorer() {
  const [selected, setSelected] = useState("button")
  return (
    <>
      <Tree
        selected={selected}
        onSelect={setSelected}
        defaultExpanded={["src", "components"]}
        nodes={[
          { id: "src", label: "src", icon: <Folder size={14} />, children: [
            { id: "components", label: "components", icon: <Folder size={14} />, children: [
              { id: "button", label: "button.tsx", icon: <FileCode2 size={14} /> },
              { id: "modal", label: "modal.tsx", icon: <FileCode2 size={14} /> },
            ] },
            { id: "index", label: "index.ts", icon: <FileCode2 size={14} /> },
          ] },
          { id: "readme", label: "README.md", icon: <FileText size={14} /> },
          { id: "secrets", label: ".env (no access)", icon: <FileText size={14} />, disabled: true },
        ]}
      />
      <span role="status">{\`Selected: \${selected}\`}</span>
    </>
  )
}`,
      <TreeExplorerExample />),
  ],

  "components/scroll-area": () => [
    ex("horizontal", "Horizontal", "orientation=\"horizontal\" for chip rows and carousels; hideScrollbar keeps it clean.",
      `<ScrollArea orientation="horizontal" hideScrollbar aria-label="Filters" className="w-full max-w-sm rounded-lg border border-border">
  <div className="flex w-max gap-2 p-2">
    {["All", "Production", "Preview", "Development", "Failed", "Cancelled", "Queued", "Building"].map((label) => (
      <Tag key={label}>{label}</Tag>
    ))}
  </div>
</ScrollArea>`,
      <R.ScrollArea orientation="horizontal" hideScrollbar aria-label="Filters" className="w-full max-w-sm rounded-lg border border-border"><div className="flex w-max gap-2 p-2">{["All", "Production", "Preview", "Development", "Failed", "Cancelled", "Queued", "Building"].map((label) => <R.Tag key={label}>{label}</R.Tag>)}</div></R.ScrollArea>),
  ],

  "components/error-state": () => [
    ex("retry", "Retry flow", "onRetry renders a retry button; swap the view when the retry succeeds (here, on the second try).",
      `function Deployments() {
  const [attempts, setAttempts] = useState(0)
  const [loading, setLoading] = useState(false)
  function retry() {
    setLoading(true)
    window.setTimeout(() => { setLoading(false); setAttempts((count) => count + 1) }, 900)
  }
  if (loading) return <div className="flex items-center gap-2"><Spinner size="sm" /> Reconnecting…</div>
  if (attempts >= 2) return <Alert variant="success" title="Connected">Deployments loaded.</Alert>
  return (
    <ErrorState
      title="Couldn't load deployments"
      description={attempts ? "Still failing — try once more." : "The API did not respond in time."}
      error="ETIMEDOUT after 10000 ms"
      onRetry={retry}
    />
  )
}`,
      <ErrorStateRetryExample />),
    ex("action", "Custom action", "Use action for recovery that is not a retry.",
      `<ErrorState
  title="You're offline"
  description="Changes are saved locally and sync when you reconnect."
  action={<Button variant="secondary" icon={<WifiOff size={15} />}>Work offline</Button>}
/>`,
      <R.ErrorState className="w-full max-w-md" title="You're offline" description="Changes are saved locally and sync when you reconnect." action={<R.Button variant="secondary" icon={<WifiOff size={15} />}>Work offline</R.Button>} />),
  ],

  "components/command": () => [
    ex("groups", "Groups, keywords and a custom shortcut", "Items group by group, match on keywords, and the provider listens for Ctrl/⌘ + J.",
      `function CommandTrigger() {
  const { setOpen } = useCommand()
  return (
    <Button variant="secondary" icon={<Search size={15} />} onClick={() => setOpen(true)}>
      Search… <Kbd keys={["Ctrl", "J"]} />
    </Button>
  )
}

function App() {
  const [last, setLast] = useState("nothing yet")
  return (
    <CommandProvider shortcut="j">
      <CommandTrigger />
      <span role="status">{\`Last command: \${last}\`}</span>
      <CommandPalette
        placeholder="Type a command or search…"
        emptyText="No commands found."
        items={[
          { id: "new", label: "New project", group: "Actions", icon: <Plus size={15} />, shortcut: ["N"], onSelect: () => setLast("New project") },
          { id: "deploy", label: "Deploy to production", group: "Actions", icon: <Rocket size={15} />, keywords: ["release", "ship"], onSelect: () => setLast("Deploy") },
          { id: "theme", label: "Toggle dark mode", group: "Preferences", icon: <Moon size={15} />, onSelect: () => setLast("Toggle dark mode") },
          { id: "settings", label: "Open settings", description: "Workspace and billing", group: "Navigation", icon: <Settings size={15} />, onSelect: () => setLast("Open settings") },
        ]}
      />
    </CommandProvider>
  )
}`,
      <CommandGroupsExample />),
  ],

  "components/breadcrumb": () => [
    ex("icons", "Icons and custom separator", "Leading icons and any separator node.",
      `<Breadcrumb
  separator="›"
  items={[
    { label: "Home", href: "#/docs/introduction", icon: <Home size={13} /> },
    { label: "Components", href: "#/components" },
    { label: "Breadcrumb" },
  ]}
/>`,
      <R.Breadcrumb separator="›" items={[{ label: "Home", href: "#/docs/introduction", icon: <Home size={13} /> }, { label: "Components", href: "#/components" }, { label: "Breadcrumb" }]} />),
  ],

  "components/navigation": () => [
    ex("sidebar", "Sidebar with topbar", "Sidebar with header and footer slots, a badge and a disabled item; Topbar reflects the active section.",
      `function AppLayout() {
  const [active, setActive] = useState("projects")
  const items: NavigationItem[] = [
    { id: "overview", label: "Overview", icon: <Home size={16} /> },
    { id: "projects", label: "Projects", icon: <Box size={16} />, badge: <Badge size="sm">12</Badge> },
    { id: "activity", label: "Activity", icon: <Activity size={16} /> },
    { id: "team", label: "Team", icon: <Users size={16} />, disabled: true },
  ]
  return (
    <div className="flex">
      <Sidebar
        items={items}
        activeId={active}
        onSelect={setActive}
        header={<BrandLink href="/" mark={<img src="/logo.svg" alt="" />}>Acme</BrandLink>}
        footer={<div className="flex items-center gap-2"><Avatar name="Maya Chen" size="sm" /> Maya Chen</div>}
      />
      <main className="flex-1">
        <Topbar>
          <TopbarTitle>{items.find((item) => item.id === active)?.label}</TopbarTitle>
          <Button size="sm">New</Button>
        </Topbar>
        <p>{\`Content for \${active}.\`}</p>
      </main>
    </div>
  )
}`,
      <SidebarExample />),
    ex("bottom-bar", "Mobile bottom bar", "BottomBar renders compact icon tabs for small screens.",
      `function MobileNav() {
  const [active, setActive] = useState("overview")
  return (
    <BottomBar
      items={[
        { id: "overview", label: "Overview", icon: <Home size={16} /> },
        { id: "projects", label: "Projects", icon: <Box size={16} />, badge: <Badge size="sm">12</Badge> },
        { id: "activity", label: "Activity", icon: <Activity size={16} /> },
      ]}
      activeId={active}
      onSelect={setActive}
    />
  )
}`,
      <BottomBarExample />),
  ],

  "components/data-table": () => [
    ex("full", "Search, sort, paginate, row click", "Sortable columns, a custom cell renderer, page sizes and an accessible row action.",
      `type Invoice = { id: number; customer: string; amount: number; status: "Paid" | "Due" | "Overdue" }

const columns: ColumnDef<Invoice>[] = [
  { key: "customer", header: "Customer", sortable: true, searchable: true, cell: (row) => row.customer },
  { key: "amount", header: "Amount", sortable: true, align: "right", cell: (row) => <Currency value={row.amount} /> },
  { key: "status", header: "Status", sortable: true, cell: (row) => (
    <Badge variant={row.status === "Paid" ? "success" : row.status === "Due" ? "warning" : "danger"}>{row.status}</Badge>
  ) },
]

function Invoices({ invoices }: { invoices: Invoice[] }) {
  const [opened, setOpened] = useState<string | null>(null)
  return (
    <>
      <DataTable
        ariaLabel="Invoices"
        columns={columns}
        data={invoices}
        searchable
        searchPlaceholder="Search customers…"
        pageSizeOptions={[3, 5, 10]}
        defaultPageSize={3}
        onRowClick={(row) => setOpened(row.customer)}
        getRowLabel={(row) => \`Open invoice for \${row.customer}\`}
      />
      <span role="status">{opened ? \`Opened invoice for \${opened}\` : "Click a row to open it"}</span>
    </>
  )
}`,
      <DataTableFullExample />, "start"),
    ex("states", "Loading and empty", "loading shows skeleton rows; emptyMessage explains an empty result. density=\"compact\" tightens rows.",
      `function InvoicesState() {
  const [loading, setLoading] = useState(true)
  return (
    <>
      <Switch label="Loading" checked={loading} onCheckedChange={setLoading} />
      <DataTable
        ariaLabel="Invoices (empty)"
        columns={columns}
        data={[]}
        loading={loading}
        emptyMessage="No invoices this month."
        pageSizeOptions={false}
        density="compact"
      />
    </>
  )
}`,
      <DataTableStatesExample />, "start"),
  ],

  "components/bar-chart": () => [
    ex("horizontal", "Horizontal with formatting", "orientation=\"horizontal\" suits long labels; formatValue controls value text.",
      `<BarChart
  orientation="horizontal"
  showValues
  height={220}
  formatValue={(value) => \`\${value} ms\`}
  data={[
    { label: "GET /users", value: 42 },
    { label: "POST /auth/login", value: 118 },
    { label: "GET /deployments", value: 76 },
    { label: "POST /deploy", value: 240, color: "var(--chart-4)" },
  ]}
/>`,
      <R.BarChart className="w-full" orientation="horizontal" showValues height={220} formatValue={(value) => `${value} ms`} data={[{ label: "GET /users", value: 42 }, { label: "POST /auth/login", value: 118 }, { label: "GET /deployments", value: 76 }, { label: "POST /deploy", value: 240, color: "var(--chart-4)" }]} />),
  ],

  "components/line-chart": () => [
    ex("area", "Smooth area with dots", "area, smooth and dots, with a value formatter.",
      `<LineChart
  area
  smooth
  dots
  height={220}
  formatValue={(value) => \`\${(value / 1000).toFixed(1)}k\`}
  data={[
    { label: "Jan", value: 4200 }, { label: "Feb", value: 5100 }, { label: "Mar", value: 4800 },
    { label: "Apr", value: 6900 }, { label: "May", value: 7400 }, { label: "Jun", value: 8800 },
  ]}
/>`,
      <R.LineChart className="w-full" area smooth dots height={220} formatValue={(value) => `${(value / 1000).toFixed(1)}k`} data={[{ label: "Jan", value: 4200 }, { label: "Feb", value: 5100 }, { label: "Mar", value: 4800 }, { label: "Apr", value: 6900 }, { label: "May", value: 7400 }, { label: "Jun", value: 8800 }]} />),
  ],

  "components/multi-line-chart": () => [
    ex("area", "Stacked areas", "area and dots across three named series.",
      `<MultiLineChart
  area
  dots
  height={220}
  labels={["Mon", "Tue", "Wed", "Thu", "Fri"]}
  formatValue={(value) => \`\${value}%\`}
  series={[
    { label: "p50", color: "var(--chart-1)", data: [22, 24, 21, 26, 23] },
    { label: "p95", color: "var(--chart-3)", data: [48, 55, 51, 62, 57] },
    { label: "p99", color: "var(--chart-4)", data: [71, 80, 77, 90, 84] },
  ]}
/>`,
      <R.MultiLineChart className="w-full" area dots height={220} labels={["Mon", "Tue", "Wed", "Thu", "Fri"]} formatValue={(value) => `${value}%`} series={[{ label: "p50", color: "var(--chart-1)", data: [22, 24, 21, 26, 23] }, { label: "p95", color: "var(--chart-3)", data: [48, 55, 51, 62, 57] }, { label: "p99", color: "var(--chart-4)", data: [71, 80, 77, 90, 84] }]} />),
  ],

  "components/donut-chart": () => [
    ex("sizes", "Size, thickness and colors", "A compact, thin ring with explicit segment colors.",
      `<DonutChart
  size={140}
  thickness={14}
  centerLabel={<strong>72%</strong>}
  data={[
    { label: "Used", value: 72, color: "var(--chart-1)" },
    { label: "Free", value: 28, color: "var(--color-border)" },
  ]}
/>`,
      <R.DonutChart size={140} thickness={14} centerLabel={<strong>72%</strong>} data={[{ label: "Used", value: 72, color: "var(--chart-1)" }, { label: "Free", value: 28, color: "var(--color-border)" }]} />),
  ],

  "components/scatter-chart": () => [
    ex("bubbles", "Bubbles with axis labels", "r sizes points; label both axes and format values.",
      `<ScatterChart
  height={220}
  xLabel="Requests / s"
  yLabel="Latency"
  formatY={(value) => \`\${value} ms\`}
  series={[{
    label: "Services",
    color: "var(--chart-2)",
    data: [
      { x: 120, y: 40, r: 6, label: "auth" },
      { x: 480, y: 95, r: 12, label: "api" },
      { x: 260, y: 160, r: 9, label: "search" },
      { x: 60, y: 22, r: 4, label: "health" },
    ],
  }]}
/>`,
      <R.ScatterChart className="w-full" height={220} xLabel="Requests / s" yLabel="Latency" formatY={(value) => `${value} ms`} series={[{ label: "Services", color: "var(--chart-2)", data: [{ x: 120, y: 40, r: 6, label: "auth" }, { x: 480, y: 95, r: 12, label: "api" }, { x: 260, y: 160, r: 9, label: "search" }, { x: 60, y: 22, r: 4, label: "health" }] }]} />),
  ],

  "components/gantt-chart": () => [
    ex("colors", "Colored tasks and row height", "Per-task colors, a fixed total and taller rows.",
      `<GanttChart
  total={10}
  rowHeight={36}
  xLabels={["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10"]}
  tasks={[
    { id: "research", label: "Research", start: 0, end: 2, color: "var(--chart-5)" },
    { id: "design", label: "Design", start: 1, end: 4, color: "var(--chart-2)" },
    { id: "build", label: "Build", start: 3, end: 8 },
    { id: "launch", label: "Launch", start: 8, end: 10, color: "var(--chart-4)" },
  ]}
/>`,
      <R.GanttChart className="w-full" total={10} rowHeight={36} xLabels={["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10"]} tasks={[{ id: "research", label: "Research", start: 0, end: 2, color: "var(--chart-5)" }, { id: "design", label: "Design", start: 1, end: 4, color: "var(--chart-2)" }, { id: "build", label: "Build", start: 3, end: 8 }, { id: "launch", label: "Launch", start: 8, end: 10, color: "var(--chart-4)" }]} />),
  ],

  "components/heatmap-chart": () => [
    ex("color", "Custom color and cell size", "A single hue scales with value; formatValue drives the tooltip.",
      `<HeatmapChart
  color="var(--chart-2)"
  cellSize={28}
  formatValue={(value) => \`\${value} deploys\`}
  rowLabels={["Mon", "Tue", "Wed", "Thu", "Fri"]}
  colLabels={["00", "04", "08", "12", "16", "20"]}
  data={[
    [0, 1, 6, 9, 7, 2],
    [1, 0, 8, 12, 9, 3],
    [0, 2, 7, 10, 8, 1],
    [1, 1, 9, 14, 11, 4],
    [0, 0, 4, 6, 3, 0],
  ]}
/>`,
      <R.HeatmapChart color="var(--chart-2)" cellSize={28} formatValue={(value) => `${value} deploys`} rowLabels={["Mon", "Tue", "Wed", "Thu", "Fri"]} colLabels={["00", "04", "08", "12", "16", "20"]} data={[[0, 1, 6, 9, 7, 2], [1, 0, 8, 12, 9, 3], [0, 2, 7, 10, 8, 1], [1, 1, 9, 14, 11, 4], [0, 0, 4, 6, 3, 0]]} />),
  ],

  "components/radar-chart": () => [
    ex("single", "Single profile", "One series, a smaller size and fewer grid rings.",
      `<RadarChart
  size={220}
  gridLines={3}
  axes={["Speed", "Reliability", "Cost", "Security", "DX"]}
  series={[{ label: "Current stack", color: "var(--chart-3)", data: [80, 92, 60, 88, 75] }]}
/>`,
      <R.RadarChart size={220} gridLines={3} axes={["Speed", "Reliability", "Cost", "Security", "DX"]} series={[{ label: "Current stack", color: "var(--chart-3)", data: [80, 92, 60, 88, 75] }]} />),
  ],

  "components/funnel-chart": () => [
    ex("conversion", "Conversion with percentages", "Format stage values as share of the first stage.",
      `<FunnelChart
  height={220}
  formatValue={(value) => \`\${Math.round((value / 12000) * 100)}%\`}
  data={[
    { label: "Visited pricing", value: 12000 },
    { label: "Started trial", value: 4300 },
    { label: "Invited team", value: 2100 },
    { label: "Upgraded", value: 860 },
  ]}
/>`,
      <R.FunnelChart className="w-full" height={220} formatValue={(value) => `${Math.round((value / 12000) * 100)}%`} data={[{ label: "Visited pricing", value: 12000 }, { label: "Started trial", value: 4300 }, { label: "Invited team", value: 2100 }, { label: "Upgraded", value: 860 }]} />),
  ],

  "components/waterfall-chart": () => [
    ex("budget", "Budget bridge", "Positive and negative steps with per-bar colors and a final total.",
      `<WaterfallChart
  height={220}
  formatValue={(value) => \`\${value < 0 ? "-" : ""}$\${Math.abs(value)}k\`}
  data={[
    { label: "Q1 budget", value: 500 },
    { label: "Hiring", value: -180 },
    { label: "Infra savings", value: 60, color: "var(--chart-2)" },
    { label: "Tools", value: -45 },
    { label: "Remaining", value: 0, total: true },
  ]}
/>`,
      <R.WaterfallChart className="w-full" height={220} formatValue={(value) => `${value < 0 ? "-" : ""}$${Math.abs(value)}k`} data={[{ label: "Q1 budget", value: 500 }, { label: "Hiring", value: -180 }, { label: "Infra savings", value: 60, color: "var(--chart-2)" }, { label: "Tools", value: -45 }, { label: "Remaining", value: 0, total: true }]} />),
  ],

  "components/code-block": () => [
    ex("languages", "Languages", "Highlighting for TSX, Bash, Python, SQL and JSON.",
      `<CodeBlock language="bash" code={"# install\\nnpm install @bzync/rui framer-motion"} />
<CodeBlock language="python" code={'def greet(name):\\n    return f"Hello, {name}"'} />
<CodeBlock language="sql" code={"SELECT name, COUNT(*) FROM deployments\\nWHERE status = 'ready'\\nGROUP BY name;"} />`,
      <div className="demo-stack w-full"><R.CodeBlock language="bash" code={"# install\nnpm install @bzync/rui framer-motion"} /><R.CodeBlock language="python" code={'def greet(name):\n    return f"Hello, {name}"'} /><R.CodeBlock language="sql" code={"SELECT name, COUNT(*) FROM deployments\nWHERE status = 'ready'\nGROUP BY name;"} /></div>, "start"),
    ex("jsx", "JSX with line numbers", "Tags, props, strings and comments are colored with theme tokens.",
      `<CodeBlock
  language="tsx"
  filename="app.tsx"
  showLineNumbers
  code={\`// Wrap the app once
export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Button variant="primary" onClick={() => save(42)}>Save</Button>
    </ThemeProvider>
  )
}\`}
/>`,
      <R.CodeBlock className="w-full" language="tsx" filename="app.tsx" showLineNumbers code={`// Wrap the app once
export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Button variant="primary" onClick={() => save(42)}>Save</Button>
    </ThemeProvider>
  )
}`} />),
  ],

  "components/code-editor": () => [
    ex("validate", "Live validation", "Read the value on every change — here to validate JSON.",
      `function ConfigEditor() {
  const [code, setCode] = useState('{\\n  "name": "api-gateway",\\n  "replicas": 3\\n}')
  let valid = true
  try { JSON.parse(code) } catch { valid = false }
  return (
    <>
      <CodeEditor language="json" value={code} onChange={setCode} minRows={5} maxRows={12} />
      <Badge variant={valid ? "success" : "danger"} dot>{valid ? "Valid JSON" : "Invalid JSON"}</Badge>
    </>
  )
}`,
      <CodeEditorPreviewExample />),
    ex("readonly", "Read-only", "readOnly keeps text selectable and navigable without editing.",
      `<CodeEditor readOnly language="bash" value={"git push origin main\\n# deploys automatically"} />`,
      <R.CodeEditor className="w-full" readOnly language="bash" value={"git push origin main\n# deploys automatically"} />),
  ],

  "components/rich-text": () => [
    ex("output", "HTML output", "onChange returns sanitized HTML; render or store it directly.",
      `function ReleaseNotes() {
  const [html, setHtml] = useState("<p>Release <strong>v2.5</strong> adds audit log exports.</p>")
  return (
    <>
      <RichTextEditor value={html} onChange={setHtml} placeholder="Write release notes…" minHeight={140} />
      <CodeBlock language="html" filename="output.html" code={html} />
    </>
  )
}`,
      <RichTextOutputExample />),
  ],

  "components/terminal": () => [
    ex("block", "Static output", "TerminalBlock renders a styled, read-only transcript with typed lines.",
      `<TerminalBlock
  title="deploy.log"
  lines={[
    { type: "command", text: "npm run build" },
    { type: "output", text: "vite v8.2.2 building for production..." },
    { type: "success", text: "✓ built in 3.91s" },
    { type: "command", text: "npm run deploy" },
    { type: "info", text: "Uploading 42 files to us-east-1" },
    { type: "error", text: "warning: 1 asset over 500 kB" },
    { type: "muted", text: "Done in 12.4s" },
  ]}
/>`,
      <R.TerminalBlock className="w-full" title="deploy.log" lines={[{ type: "command", text: "npm run build" }, { type: "output", text: "vite v8.2.2 building for production..." }, { type: "success", text: "✓ built in 3.91s" }, { type: "command", text: "npm run deploy" }, { type: "info", text: "Uploading 42 files to us-east-1" }, { type: "error", text: "warning: 1 asset over 500 kB" }, { type: "muted", text: "Done in 12.4s" }]} />),
  ],

  "components/dev-mode": () => [
    ex("inline", "Inline with custom breakpoints", "floating={false} embeds the inspector in your own debug panel; breakpoints accepts any named scale.",
      `<DevMode
  floating={false}
  hotkey={false}
  storageKey={false}
  breakpoints={{ phone: 0, tablet: 600, laptop: 1024, desktop: 1440 }}
/>`,
      <R.DevMode floating={false} hotkey={false} storageKey={false} breakpoints={{ phone: 0, tablet: 600, laptop: 1024, desktop: 1440 }} />),
    ex("collapsed", "Collapsed pill", "defaultCollapsed starts as a small breakpoint pill; click it to expand.",
      `<DevMode floating={false} hotkey={false} storageKey={false} defaultCollapsed />`,
      <R.DevMode floating={false} hotkey={false} storageKey={false} defaultCollapsed />),
    ex("app", "App-wide setup", "Render it once near the root, gated to development. ⌘/Ctrl + Shift + D hides it; the outline button reveals every layout box.",
      `// main.tsx / app root
<ThemeProvider>
  <App />
  <DevMode enabled={import.meta.env.DEV} defaultPosition="bottom-right" />
</ThemeProvider>`,
      <R.Callout variant="info" title="This docs site runs DevMode in development" className="w-full max-w-lg">Start the docs with <R.InlineCode>npm --prefix demo run dev</R.InlineCode> and the inspector appears in the bottom-left corner.</R.Callout>),
  ],

  "components/heading": () => [
    ex("scale", "Size scale", "Visual size is independent of the semantic level.",
      `<Heading as="h2" size="2xl">2xl heading</Heading>
<Heading as="h2" size="xl">xl heading</Heading>
<Heading as="h3" size="lg">lg heading</Heading>
<Heading as="h4" size="md">md heading</Heading>
<Heading as="h5" size="sm">sm heading</Heading>
<Heading as="h6" size="xs">xs heading</Heading>`,
      <div className="demo-stack items-start"><R.Heading as="h2" size="2xl">2xl heading</R.Heading><R.Heading as="h2" size="xl">xl heading</R.Heading><R.Heading as="h3" size="lg">lg heading</R.Heading><R.Heading as="h4" size="md">md heading</R.Heading><R.Heading as="h5" size="sm">sm heading</R.Heading><R.Heading as="h6" size="xs">xs heading</R.Heading></div>, "start"),
    ex("tone", "Tone and weight", "muted and accent tones; four weights.",
      `<Heading size="lg" tone="accent" weight="bold">Accent, bold</Heading>
<Heading size="lg" weight="medium">Default, medium</Heading>
<Heading size="lg" tone="muted" weight="normal">Muted, normal</Heading>`,
      <div className="demo-stack items-start"><R.Heading size="lg" tone="accent" weight="bold">Accent, bold</R.Heading><R.Heading size="lg" weight="medium">Default, medium</R.Heading><R.Heading size="lg" tone="muted" weight="normal">Muted, normal</R.Heading></div>, "start"),
  ],

  "components/text": () => [
    ex("locale", "Locale-aware values", "The same value formatted for different locales and time zones.",
      `<Text variant="date" value="2026-10-27" locale="en-US" formatOptions={{ dateStyle: "full" }} />
<Text variant="date" value="2026-10-27" locale="fr-FR" formatOptions={{ dateStyle: "full" }} />
<Text variant="time" value={new Date("2026-10-27T14:00:00Z")} timeZone="Asia/Manila" />
<Text variant="number" value={1234567.891} locale="de-DE" />
<Text variant="currency" value={-1840} currency="EUR" locale="de-DE" accounting />`,
      <div className="demo-stack items-start"><R.Text variant="date" value="2026-10-27" locale="en-US" formatOptions={{ dateStyle: "full" }} /><R.Text variant="date" value="2026-10-27" locale="fr-FR" formatOptions={{ dateStyle: "full" }} /><R.Text variant="time" value={new Date("2026-10-27T14:00:00Z")} timeZone="Asia/Manila" /><R.Text variant="number" value={1234567.891} locale="de-DE" /><R.Text variant="currency" value={-1840} currency="EUR" locale="de-DE" accounting /></div>, "start"),
    ex("layout", "Size, alignment and wrapping", "nowrap truncates; balance evens headline-like lines.",
      `<Text size="lg" weight="semibold" align="center" wrap="balance">
  Ship faster with components that already handle the hard parts
</Text>
<Text size="sm" wrap="nowrap" className="max-w-48">
  A very long deployment identifier that should not wrap
</Text>`,
      <div className="demo-stack w-full max-w-sm"><R.Text size="lg" weight="semibold" align="center" wrap="balance">Ship faster with components that already handle the hard parts</R.Text><R.Text size="sm" wrap="nowrap" className="max-w-48">A very long deployment identifier that should not wrap</R.Text></div>),
  ],

  "components/prose": () => [
    ex("sizes", "Sizes and widths", "size scales typography; width caps line length.",
      `<Prose size="sm" width="sm">
  <h3>Small prose</h3>
  <p>Compact reading size for side panels and help text.</p>
</Prose>
<Prose size="lg" width="md">
  <h3>Large prose</h3>
  <p>Comfortable size for long-form articles and changelogs.</p>
</Prose>`,
      <div className="demo-stack w-full"><R.Prose size="sm" width="sm"><h3>Small prose</h3><p>Compact reading size for side panels and help text.</p></R.Prose><R.Prose size="lg" width="md"><h3>Large prose</h3><p>Comfortable size for long-form articles and changelogs.</p></R.Prose></div>, "start"),
    ex("rich", "Code, tables and lists", "Prose styles nested semantic markup consistently.",
      `<Prose>
  <p>Set <code>applyToRoot</code> to theme the whole document.</p>
  <ol><li>Install the package</li><li>Import the styles</li></ol>
  <table>
    <thead><tr><th>Prop</th><th>Default</th></tr></thead>
    <tbody><tr><td>defaultTheme</td><td>system</td></tr></tbody>
  </table>
</Prose>`,
      <R.Prose className="w-full"><p>Set <code>applyToRoot</code> to theme the whole document.</p><ol><li>Install the package</li><li>Import the styles</li></ol><table><thead><tr><th>Prop</th><th>Default</th></tr></thead><tbody><tr><td>defaultTheme</td><td>system</td></tr></tbody></table></R.Prose>, "start"),
  ],

  "components/inline-code": () => [
    ex("contexts", "In headings, lists and long tokens", "Scales with surrounding text and wraps long tokens.",
      `<Heading size="md">Configure <InlineCode>ThemeProvider</InlineCode></Heading>
<ul className="list-disc pl-5 text-sm">
  <li>Set <InlineCode>storageKey={"{false}"}</InlineCode> to disable persistence.</li>
  <li>Token: <InlineCode>example-deploy-token-0000-1111-2222-3333-4444-5555-not-a-secret</InlineCode></li>
</ul>`,
      <div className="demo-stack w-full max-w-sm"><R.Heading size="md">Configure <R.InlineCode>ThemeProvider</R.InlineCode></R.Heading><ul className="list-disc space-y-1 pl-5 text-sm"><li>Set <R.InlineCode>{"storageKey={false}"}</R.InlineCode> to disable persistence.</li><li>Token: <R.InlineCode>example-deploy-token-0000-1111-2222-3333-4444-5555-not-a-secret</R.InlineCode></li></ul></div>, "start"),
  ],
}

function ProjectListExample() {
  const [active, setActive] = useState("atlas")
  const projects = [
    { id: "atlas", name: "Atlas", meta: "3 deployments today" },
    { id: "nova", name: "Nova", meta: "Last deployed yesterday" },
    { id: "orbit", name: "Orbit", meta: "Paused" },
  ]
  return (
    <R.List className="w-full max-w-sm">
      {projects.map((project) => (
        <R.ListItem
          key={project.id}
          icon={<Box size={15} />}
          description={project.meta}
          active={active === project.id}
          onClick={() => setActive(project.id)}
          trailing={project.id === "orbit" ? <R.Badge variant="muted" size="sm">Paused</R.Badge> : undefined}
        >
          {project.name}
        </R.ListItem>
      ))}
    </R.List>
  )
}

function DatePickerStatesExample() {
  const [renewal, setRenewal] = useState<Date | null>(new Date(2026, 11, 1))
  return (
    <div className="demo-form-grid">
      <R.DatePicker label="Start date" error="Start date is required." />
      <R.DatePicker label="Renewal date" value={renewal} onChange={setRenewal} clearable={false} />
    </div>
  )
}
