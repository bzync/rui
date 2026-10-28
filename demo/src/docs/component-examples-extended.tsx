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
  Bell,
  User,
} from "lucide-react"
import { type ReactNode, useEffect, useState } from "react"
import { RuiBrandMark } from "../_shared/brand"
import type { ComponentExample } from "./component-examples"

function NowPlayingSheetExample() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <R.Button variant="secondary" onClick={() => setOpen(!open)}>{open ? "Hide player" : "Show player"}</R.Button>
      <R.Sheet open={open} onOpenChange={setOpen} modal={false} dismissible={false} snapPoints={[132, 0.55]} ariaLabel="Now playing">
        <div className="flex items-center gap-3 px-5 pb-4">
          <div className="size-12 shrink-0 rounded-lg bg-accent-500" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Midnight City</p>
            <p className="truncate text-xs text-muted-foreground">M83 · Hurry Up, We're Dreaming</p>
          </div>
          <R.Badge>Live</R.Badge>
        </div>
        <p className="px-5 text-sm text-muted-foreground">Up next: Wait · Outro · Steve McQueen</p>
      </R.Sheet>
    </>
  )
}

function CollapsibleSidebarExample() {
  const [active, setActive] = useState("home")
  return (
    <div className="flex h-80 w-full overflow-hidden rounded-xl border border-border bg-bg">
      <R.Sidebar
        collapsible
        storageKey="docs-sidebar-rail"
        className="border-y-0 border-l-0"
        activeId={active}
        onSelect={setActive}
        header={(collapsed) => (collapsed ? <Box size={20} aria-label="Acme" /> : <span className="font-semibold">Acme</span>)}
        items={[
          { id: "home", label: "Home", icon: <Home size={16} /> },
          { id: "projects", label: "Projects", icon: <Folder size={16} />, badge: <R.Badge>4</R.Badge> },
          { id: "team", label: "Team", icon: <Users size={16} /> },
          { id: "settings", label: "Settings", icon: <Settings size={16} /> },
        ]}
      />
      <div className="grid flex-1 place-items-center p-6 text-sm text-muted-foreground">Viewing {active}. Collapse the rail; hover an icon for its label.</div>
    </div>
  )
}

function SingleLightboxExample() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <R.Button variant="secondary" onClick={() => setOpen(true)}>View floor plan</R.Button>
      <R.Lightbox open={open} onOpenChange={setOpen} images={[{ src: "/gallery/coastal-cliffs.svg", alt: "Teal cliffs over a calm sea", caption: "Coastal cliffs, full resolution" }]} />
    </>
  )
}

function KanbanBoardExample() {
  const [columns, setColumns] = useState([
    {
      id: "backlog",
      title: "Backlog",
      limit: 4,
      items: [
        { id: "b1", title: "GraphQL schema audit" },
        { id: "b2", title: "Redis cache invalidation" },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      limit: 2,
      items: [
        { id: "p1", title: "OAuth 2.1 PKCE support" },
      ],
    },
    {
      id: "done",
      title: "Done",
      items: [
        { id: "d1", title: "Dark mode tokens" },
        { id: "d2", title: "Vitest migration" },
      ],
    },
  ])
  return (
    <div className="w-full overflow-x-auto py-2">
      <R.Kanban
        columns={columns}
        onChange={(next) => setColumns(next)}
        getLabel={(item) => item.title}
        renderCard={(item) => (
          <div className="text-sm font-medium text-foreground">{item.title}</div>
        )}
      />
    </div>
  )
}

function SortableHorizontalExample() {
  const [tags, setTags] = useState([
    { id: "react", label: "React" },
    { id: "ts", label: "TypeScript" },
    { id: "tailwind", label: "Tailwind" },
    { id: "vite", label: "Vite" },
  ])
  return (
    <R.SortableList
      orientation="horizontal"
      items={tags}
      onReorder={(next) => setTags(next)}
      getLabel={(tag) => tag.label}
      renderItem={(tag) => <span className="text-sm font-medium">{tag.label}</span>}
    />
  )
}

function NotificationCenterCustomExample() {
  const [items, setItems] = useState<R.NotificationItem[]>([
    { id: "m1", title: "@sarah mentioned you in PR #42", description: "Could you check the retry logic here?", timestamp: "12m ago", read: false, category: "mentions", avatar: { name: "Sarah Chen" } },
    { id: "m2", title: "@alex requested your review", description: "feat: add webhook delivery retries", timestamp: "1h ago", read: false, category: "mentions", avatar: { name: "Alex Rivera" } },
    { id: "s1", title: "Weekly security digest", description: "Zero vulnerabilities detected across 14 packages", timestamp: "1d ago", read: true, category: "system", tone: "info" },
  ])
  return (
    <div className="flex items-center gap-4">
      <R.NotificationCenter
        items={items}
        onItemsChange={setItems}
        categories={["all", "mentions", "system"]}
        trigger={<R.Button variant="secondary" size="sm">Inbox ({items.filter((i) => !i.read).length})</R.Button>}
      />
    </div>
  )
}

function TourStepActionExample() {
  const [open, setOpen] = useState(false)
  const steps: R.TourStep[] = [
    {
      target: "#tour-card-1",
      title: "Interactive spotlight",
      content: "Each step anchors seamlessly to any element or selector.",
      placement: "bottom",
      action: { label: "Learn more", onClick: () => alert("Step action triggered") },
    },
    {
      target: "#tour-card-2",
      title: "Step completions",
      content: "Finish or skip steps with keyboard navigation (Escape, Arrow keys).",
      placement: "top",
    },
  ]
  return (
    <div className="demo-stack items-center w-full max-w-md">
      <div className="grid grid-cols-2 gap-4 w-full">
        <div id="tour-card-1" className="p-3 rounded-lg border border-border bg-surface text-xs font-medium">Element Alpha</div>
        <div id="tour-card-2" className="p-3 rounded-lg border border-border bg-surface text-xs font-medium">Element Beta</div>
      </div>
      <R.Button size="sm" onClick={() => setOpen(true)}>Launch guide</R.Button>
      <R.Tour steps={steps} open={open} onOpenChange={setOpen} />
    </div>
  )
}

function MenubarAppExample() {
  const [activeAction, setActiveAction] = useState<string | null>(null)
  return (
    <div className="demo-stack w-full max-w-md">
      <R.Menubar
        menus={[
          {
            label: "Format",
            items: [
              { label: "Bold", shortcut: "⌘B", onClick: () => setActiveAction("Bold") },
              { label: "Italic", shortcut: "⌘I", onClick: () => setActiveAction("Italic") },
              { label: "Strikethrough", onClick: () => setActiveAction("Strikethrough") },
            ],
          },
          {
            label: "Insert",
            items: [
              { label: "Table", onClick: () => setActiveAction("Table inserted") },
              { label: "Image…", onClick: () => setActiveAction("Image picker opened") },
              { label: "Link…", shortcut: "⌘K", onClick: () => setActiveAction("Link dialog opened") },
            ],
          },
        ]}
      />
      <span className="text-sm text-muted-foreground" role="status">
        {activeAction ? `Action selected: ${activeAction}` : "Choose a formatting action from the menu"}
      </span>
    </div>
  )
}

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

const fiscalPresets: R.DateRangePreset[] = [
  { label: "This quarter", range: (today) => ({ from: new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1), to: today }) },
  { label: "Year to date", range: (today) => ({ from: new Date(today.getFullYear(), 0, 1), to: today }) },
  { label: "Last year", range: (today) => ({ from: new Date(today.getFullYear() - 1, 0, 1), to: new Date(today.getFullYear() - 1, 11, 31) }) },
]

type ProfileValues = { username: string; bio: string }

// The same shape Zod returns from safeParse — pass a real Zod schema instead.
const profileSchema: R.FormSchema<ProfileValues> = {
  safeParse(values) {
    const issues: { path: string[]; message: string }[] = []
    if (!/^[a-z0-9_]{3,15}$/.test(values.username)) issues.push({ path: ["username"], message: "3–15 lowercase letters, numbers or underscores." })
    if (values.bio.length > 80) issues.push({ path: ["bio"], message: "Keep it under 80 characters." })
    return issues.length ? { success: false, error: { issues } } : { success: true }
  },
}

function FormSchemaExample() {
  const [saved, setSaved] = useState(false)
  const form = R.useForm<ProfileValues>({ defaultValues: { username: "", bio: "" }, schema: profileSchema, mode: "onChange" })
  return (
    <R.Form form={form} className="w-full max-w-sm" onSubmit={() => setSaved(true)}>
      <R.Input label="Username" prefix="@" {...form.register("username")} />
      <R.Textarea label="Bio" rows={3} hint={`${form.values.bio.length}/80`} {...form.register("bio")} />
      <R.Button type="submit" disabled={!form.isDirty}>Save profile</R.Button>
      {saved && <p className="text-sm text-muted-foreground" role="status">Profile saved</p>}
    </R.Form>
  )
}

type BookingValues = { guests: number; dates: R.DateRange; room: string; newsletter: boolean }

function FormControlsExample() {
  const [summary, setSummary] = useState("")
  const form = R.useForm<BookingValues>({
    defaultValues: { guests: 2, dates: { from: null, to: null }, room: "", newsletter: true },
    validate: (values) => ({
      dates: values.dates.from && values.dates.to ? undefined : "Choose check-in and check-out.",
      room: values.room ? undefined : "Choose a room.",
    }),
  })
  return (
    <R.Form form={form} className="w-full max-w-sm" onSubmit={(values) => setSummary(`${values.guests} guests, ${values.room} room`)}>
      <R.NumberInput label="Guests" min={1} max={6} {...form.control("guests")} />
      <R.DateRangePicker label="Dates" presets={false} numberOfMonths={1} {...form.control("dates")} />
      <R.RadioGroup label="Room" orientation="horizontal" {...form.control("room")}>
        <R.Radio value="standard" label="Standard" />
        <R.Radio value="suite" label="Suite" />
      </R.RadioGroup>
      <R.Switch label="Email me offers" {...form.register("newsletter", { type: "checkbox" })} />
      <R.Button type="submit">Book</R.Button>
      {summary && <p className="text-sm text-muted-foreground" role="status">{`Booked: ${summary}`}</p>}
    </R.Form>
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

const mobileTabs = [
  { id: "home", label: "Home", icon: <Home size={20} />, content: ["Deploys today: 14", "Uptime: 99.98%", "Open incidents: 0"] },
  { id: "projects", label: "Projects", icon: <Box size={20} />, badge: 12, content: ["api-gateway", "web-frontend", "queue-worker"] },
  { id: "inbox", label: "Inbox", icon: <Bell size={20} />, badge: 3, content: ["Build failed on main", "Maya mentioned you", "Invoice paid"] },
  { id: "account", label: "Account", icon: <User size={20} />, content: ["Profile", "Billing", "Sign out"] },
]

function BottomBarPlayground() {
  const [active, setActive] = useState("home")
  const [variant, setVariant] = useState<"bar" | "floating">("floating")
  const [indicator, setIndicator] = useState<"pill" | "line" | "dot" | "none">("pill")
  const [labels, setLabels] = useState<"always" | "active" | "hidden">("always")
  const [withAction, setWithAction] = useState(true)
  const tab = mobileTabs.find((item) => item.id === active)!
  return (
    <div className="grid w-full grid-cols-1 justify-items-center gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
      <div className="grid w-full max-w-sm gap-3">
        <R.FormField label="Variant"><R.ToggleGroup type="single" size="sm" variant="outline" aria-label="Variant" value={variant} onValueChange={(v) => v && setVariant(v as typeof variant)}><R.ToggleGroupItem value="bar">Bar</R.ToggleGroupItem><R.ToggleGroupItem value="floating">Floating</R.ToggleGroupItem></R.ToggleGroup></R.FormField>
        <R.FormField label="Indicator"><R.ToggleGroup type="single" size="sm" variant="outline" aria-label="Indicator" value={indicator} onValueChange={(v) => v && setIndicator(v as typeof indicator)}><R.ToggleGroupItem value="pill">Pill</R.ToggleGroupItem><R.ToggleGroupItem value="line">Line</R.ToggleGroupItem><R.ToggleGroupItem value="dot">Dot</R.ToggleGroupItem><R.ToggleGroupItem value="none">None</R.ToggleGroupItem></R.ToggleGroup></R.FormField>
        <R.FormField label="Labels"><R.ToggleGroup type="single" size="sm" variant="outline" aria-label="Labels" value={labels} onValueChange={(v) => v && setLabels(v as typeof labels)}><R.ToggleGroupItem value="always">Always</R.ToggleGroupItem><R.ToggleGroupItem value="active">Active</R.ToggleGroupItem><R.ToggleGroupItem value="hidden">Hidden</R.ToggleGroupItem></R.ToggleGroup></R.FormField>
        <R.Switch label="Center action" checked={withAction} onCheckedChange={setWithAction} />
      </div>
      <div className="flex h-[480px] w-[360px] max-w-full flex-col overflow-hidden rounded-[28px] border border-border bg-bg shadow-floating">
        <header className="border-b border-border bg-surface px-4 py-3 text-sm font-semibold">{tab.label}</header>
        <ul className="flex-1 divide-y divide-border overflow-y-auto">
          {tab.content.map((line) => <li key={line} className="px-4 py-3 text-sm">{line}</li>)}
        </ul>
        <R.BottomBar
          items={mobileTabs}
          activeId={active}
          onSelect={setActive}
          variant={variant}
          indicator={indicator}
          labels={labels}
          centerAction={withAction ? <R.Button size="icon" className="size-12 rounded-full shadow-floating" aria-label="New project"><Plus size={22} /></R.Button> : undefined}
        />
      </div>
    </div>
  )
}

function BottomBarExample() {
  const [active, setActive] = useState("home")
  const tab = mobileTabs.find((item) => item.id === active)!
  return (
    <div className="flex h-[480px] w-full max-w-[360px] flex-col overflow-hidden rounded-[28px] border border-border bg-bg shadow-floating">
      <header className="border-b border-border bg-surface px-4 py-3 text-sm font-semibold">{tab.label}</header>
      <ul className="flex-1 divide-y divide-border overflow-y-auto">
        {tab.content.map((line) => <li key={line} className="px-4 py-3 text-sm">{line}</li>)}
      </ul>
      <R.BottomBar items={mobileTabs} activeId={active} onSelect={setActive} />
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

function DataTableConditionalExample() {
  return (
    <R.DataTable
      ariaLabel="Invoices with overdue rows highlighted"
      columns={invoiceColumns}
      data={invoices}
      pageSizeOptions={false}
      defaultPageSize={10}
      rowClassName={(row) => (row.status === "Overdue" ? "bg-danger/5" : undefined)}
    />
  )
}

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

function DataTableSelectionExample() {
  const [archived, setArchived] = useState<string[]>([])
  return (
    <div className="demo-stack w-full">
      <R.DataTable
        ariaLabel="Invoices with selection"
        columns={invoiceColumns}
        data={invoices.filter((invoice) => !archived.includes(invoice.customer))}
        selectable
        isRowSelectable={(row) => row.status !== "Paid"}
        getRowLabel={(row) => row.customer}
        pageSizeOptions={false}
        bulkActions={(selected, clear) => (
          <>
            <R.Button size="sm" variant="secondary" onClick={clear}>Clear</R.Button>
            <R.Button size="sm" variant="danger" onClick={() => { setArchived([...archived, ...selected.map((row) => row.customer)]); clear() }}>
              Archive
            </R.Button>
          </>
        )}
      />
      <span className="text-sm text-muted-foreground" role="status">{archived.length ? `Archived: ${archived.join(", ")}` : "Paid invoices cannot be selected"}</span>
    </div>
  )
}

function DataTableColumnsExample() {
  return (
    <R.DataTable
      ariaLabel="Invoices with column tools"
      columns={[
        { ...invoiceColumns[0], pinned: "left", hideable: false },
        invoiceColumns[1],
        invoiceColumns[2],
        { key: "id", header: "Invoice", cell: (row) => `INV-${1000 + row.id}` },
      ]}
      data={invoices}
      columnToggle
      resizableColumns
      pageSizeOptions={false}
    />
  )
}

// A stand-in for your API: filters, sorts and pages on the "server".
function fetchInvoices({ query, sort, page, pageSize }: { query: string; sort: R.DataTableSort; page: number; pageSize: number }) {
  return new Promise<{ rows: Invoice[]; total: number }>((resolve) => {
    window.setTimeout(() => {
      let result = invoices.filter((invoice) => invoice.customer.toLowerCase().includes(query.toLowerCase()))
      if (sort.key && sort.dir) {
        const key = sort.key as keyof Invoice
        result = [...result].sort((a, b) => String(a[key]).localeCompare(String(b[key]), undefined, { numeric: true }) * (sort.dir === "asc" ? 1 : -1))
      }
      resolve({ rows: result.slice((page - 1) * pageSize, page * pageSize), total: result.length })
    }, 400)
  })
}

function DataTableServerExample() {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<R.DataTableSort>({ key: null, dir: null })
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<{ rows: Invoice[]; total: number } | null>(null)
  useEffect(() => {
    let current = true
    fetchInvoices({ query, sort, page, pageSize: 3 }).then((next) => { if (current) setResult(next) })
    return () => { current = false }
  }, [query, sort, page])
  return (
    <R.DataTable
      manual
      ariaLabel="Invoices from the server"
      columns={invoiceColumns}
      data={result?.rows ?? []}
      rowCount={result?.total ?? 0}
      loading={!result}
      searchable
      searchPlaceholder="Search customers…"
      query={query}
      onQueryChange={setQuery}
      sort={sort}
      onSortChange={setSort}
      page={page}
      onPageChange={setPage}
      pageSizeOptions={[3]}
    />
  )
}

const manyEvents = Array.from({ length: 10_000 }, (_, index) => ({
  id: index,
  event: ["deploy.succeeded", "deploy.failed", "build.started", "domain.verified"][index % 4],
  latency: (index * 37) % 900,
}))

function DataTableVirtualExample() {
  return (
    <R.DataTable
      ariaLabel="10,000 events"
      columns={[
        { key: "id", header: "#", sortable: true, cell: (row) => row.id },
        { key: "event", header: "Event", sortable: true, cell: (row) => row.event },
        { key: "latency", header: "Latency", sortable: true, align: "right", cell: (row) => `${row.latency} ms` },
      ]}
      data={manyEvents}
      searchable
      virtualized={{ height: 320, rowHeight: 41 }}
    />
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

function ThemeSwitcherVariantsExample() {
  const [theme, setTheme] = useState<R.Theme>("system")
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Segmented</span>
        <R.ThemeSwitcher variant="segmented" value={theme} onChange={setTheme} />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Dropdown</span>
        <R.ThemeSwitcher variant="dropdown" value={theme} onChange={setTheme} />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Switch</span>
        <R.ThemeSwitcher variant="switch" value={theme} onChange={setTheme} />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Icon button</span>
        <R.ThemeSwitcher variant="icon-button" value={theme} onChange={setTheme} />
      </div>
    </div>
  )
}

function ThemeSwitcherRadioCardsExample() {
  const [theme, setTheme] = useState<R.Theme>("system")
  return (
    <div className="w-full max-w-xl">
      <R.ThemeSwitcher variant="radio" value={theme} onChange={setTheme} />
    </div>
  )
}

function ThemeSwitcherSizesExample() {
  const [theme, setTheme] = useState<R.Theme>("system")
  return (
    <div className="flex flex-wrap items-center gap-4">
      <R.ThemeSwitcher size="sm" value={theme} onChange={setTheme} />
      <R.ThemeSwitcher size="md" value={theme} onChange={setTheme} />
      <R.ThemeSwitcher size="lg" value={theme} onChange={setTheme} />
    </div>
  )
}

function ThemeSwitcherBinaryExample() {
  const [theme, setTheme] = useState<R.Theme>("light")
  return (
    <div className="flex items-center gap-4">
      <R.ThemeSwitcher includeSystem={false} value={theme} onChange={setTheme} />
      <R.ThemeSwitcher variant="switch" value={theme} onChange={setTheme} />
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

  "components/theme-switcher": () => [
    ex("variants", "UI/UX Layout Variants", "Supports segmented track, dropdown menu, sliding switch, and cycling icon button.",
      `function LayoutVariants() {
  const [theme, setTheme] = useState<Theme>("system")
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Segmented</span>
        <ThemeSwitcher variant="segmented" value={theme} onChange={setTheme} />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Dropdown</span>
        <ThemeSwitcher variant="dropdown" value={theme} onChange={setTheme} />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Switch</span>
        <ThemeSwitcher variant="switch" value={theme} onChange={setTheme} />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Icon button</span>
        <ThemeSwitcher variant="icon-button" value={theme} onChange={setTheme} />
      </div>
    </div>
  )
}`,
      <ThemeSwitcherVariantsExample />),
    ex("radio", "Settings Radio Cards", "Full-width preference cards featuring miniature preview illustrations for account settings.",
      `function SettingsRadioCards() {
  const [theme, setTheme] = useState<Theme>("system")
  return (
    <div className="w-full max-w-xl">
      <ThemeSwitcher variant="radio" value={theme} onChange={setTheme} />
    </div>
  )
}`,
      <ThemeSwitcherRadioCardsExample />),
    ex("sizes", "Control Sizes", "Available in sm (32px), md (36px), and lg (40px) matching the library form scale.",
      `function SwitcherSizes() {
  const [theme, setTheme] = useState<Theme>("system")
  return (
    <div className="flex flex-wrap items-center gap-4">
      <ThemeSwitcher size="sm" value={theme} onChange={setTheme} />
      <ThemeSwitcher size="md" value={theme} onChange={setTheme} />
      <ThemeSwitcher size="lg" value={theme} onChange={setTheme} />
    </div>
  )
}`,
      <ThemeSwitcherSizesExample />),
    ex("binary", "Binary Light/Dark Mode", "Disable the system preference option with includeSystem={false} for direct two-way toggling.",
      `function BinaryModes() {
  const [theme, setTheme] = useState<Theme>("light")
  return (
    <div className="flex items-center gap-4">
      <ThemeSwitcher includeSystem={false} value={theme} onChange={setTheme} />
      <ThemeSwitcher variant="switch" value={theme} onChange={setTheme} />
    </div>
  )
}`,
      <ThemeSwitcherBinaryExample />),
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

  "components/date-range-picker": () => [
    ex("presets", "Custom presets", "presets accepts any list of labelled ranges computed from today.",
      `const fiscalPresets: DateRangePreset[] = [
  { label: "This quarter", range: (today) => ({ from: new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1), to: today }) },
  { label: "Year to date", range: (today) => ({ from: new Date(today.getFullYear(), 0, 1), to: today }) },
  { label: "Last year", range: (today) => ({ from: new Date(today.getFullYear() - 1, 0, 1), to: new Date(today.getFullYear() - 1, 11, 31) }) },
]

<DateRangePicker label="Fiscal period" presets={fiscalPresets} />`,
      <div className="w-full max-w-sm"><R.DateRangePicker label="Fiscal period" presets={fiscalPresets} /></div>),
    ex("booking", "Bookings: bounds, one month, no presets", "minDate / maxDate limit the selectable window; numberOfMonths={1} and presets={false} make a compact picker.",
      `<DateRangePicker
  label="Stay"
  placeholder="Check-in – check-out"
  minDate={new Date()}
  maxDate={new Date(new Date().getFullYear() + 1, 0, 1)}
  numberOfMonths={1}
  presets={false}
  hint="Bookings open up to the end of next year"
/>`,
      <div className="w-full max-w-sm"><R.DateRangePicker label="Stay" placeholder="Check-in – check-out" minDate={new Date()} maxDate={new Date(new Date().getFullYear() + 1, 0, 1)} numberOfMonths={1} presets={false} hint="Bookings open up to the end of next year" /></div>),
    ex("sizes", "Sizes and validation", "Shares the field scale and error styling with every other control.",
      `<DateRangePicker size="sm" label="Small" />
<DateRangePicker size="lg" label="Large" error="Choose a range of at most 90 days." />`,
      <div className="demo-form-grid"><R.DateRangePicker size="sm" label="Small" /><R.DateRangePicker size="lg" label="Large" error="Choose a range of at most 90 days." /></div>),
  ],

  "components/form": () => [
    ex("schema", "Schema validation, live", "schema accepts a Zod schema (or anything with the same safeParse shape — shown here without a dependency). mode=\"onChange\" validates as you type.",
      `type ProfileValues = { username: string; bio: string }

// The same shape Zod returns from safeParse — pass a real Zod schema instead.
const profileSchema: FormSchema<ProfileValues> = {
  safeParse(values) {
    const issues: { path: string[]; message: string }[] = []
    if (!/^[a-z0-9_]{3,15}$/.test(values.username)) issues.push({ path: ["username"], message: "3–15 lowercase letters, numbers or underscores." })
    if (values.bio.length > 80) issues.push({ path: ["bio"], message: "Keep it under 80 characters." })
    return issues.length ? { success: false, error: { issues } } : { success: true }
  },
}

function ProfileForm() {
  const [saved, setSaved] = useState(false)
  const form = useForm<ProfileValues>({ defaultValues: { username: "", bio: "" }, schema: profileSchema, mode: "onChange" })
  return (
    <Form form={form} className="w-full max-w-sm" onSubmit={() => setSaved(true)}>
      <Input label="Username" prefix="@" {...form.register("username")} />
      <Textarea label="Bio" rows={3} hint={\`\${form.values.bio.length}/80\`} {...form.register("bio")} />
      <Button type="submit" disabled={!form.isDirty}>Save profile</Button>
      {saved && <p className="text-sm text-muted-foreground" role="status">Profile saved</p>}
    </Form>
  )
}`,
      <FormSchemaExample />),
    ex("controls", "Every kind of control", "control() wires value-based components (NumberInput, DateRangePicker, RadioGroup); register(name, { type: \"checkbox\" }) wires Switch and Checkbox.",
      `type BookingValues = { guests: number; dates: DateRange; room: string; newsletter: boolean }

function BookingForm() {
  const [summary, setSummary] = useState("")
  const form = useForm<BookingValues>({
    defaultValues: { guests: 2, dates: { from: null, to: null }, room: "", newsletter: true },
    validate: (values) => ({
      dates: values.dates.from && values.dates.to ? undefined : "Choose check-in and check-out.",
      room: values.room ? undefined : "Choose a room.",
    }),
  })
  return (
    <Form form={form} className="w-full max-w-sm" onSubmit={(values) => setSummary(\`\${values.guests} guests, \${values.room} room\`)}>
      <NumberInput label="Guests" min={1} max={6} {...form.control("guests")} />
      <DateRangePicker label="Dates" presets={false} numberOfMonths={1} {...form.control("dates")} />
      <RadioGroup label="Room" orientation="horizontal" {...form.control("room")}>
        <Radio value="standard" label="Standard" />
        <Radio value="suite" label="Suite" />
      </RadioGroup>
      <Switch label="Email me offers" {...form.register("newsletter", { type: "checkbox" })} />
      <Button type="submit">Book</Button>
      {summary && <p className="text-sm text-muted-foreground" role="status">{\`Booked: \${summary}\`}</p>}
    </Form>
  )
}`,
      <FormControlsExample />),
  ],

  "components/tag-input": () => [
    ex("limits", "Limits and normalization", "maxTags caps the list; transform normalizes entries; duplicates are rejected with a message.",
      `<TagInput
  label="Topics"
  defaultValue={["react", "design-systems"]}
  maxTags={5}
  transform={(tag) => tag.toLowerCase().replace(/\\s+/g, "-")}
  hint="Up to 5 topics"
/>`,
      <div className="w-full max-w-md"><R.TagInput label="Topics" defaultValue={["react", "design-systems"]} maxTags={5} transform={(tag) => tag.toLowerCase().replace(/\s+/g, "-")} hint="Up to 5 topics" /></div>),
    ex("sizes", "Sizes and states", "Shares the field scale; disabled keeps tags readable.",
      `<TagInput size="sm" label="Small" defaultValue={["alpha"]} />
<TagInput size="lg" label="Large (disabled)" defaultValue={["beta", "gamma"]} disabled />`,
      <div className="demo-form-grid"><R.TagInput size="sm" label="Small" defaultValue={["alpha"]} /><R.TagInput size="lg" label="Large (disabled)" defaultValue={["beta", "gamma"]} disabled /></div>),
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
    ex("collapse", "Collapsing deep paths", "maxItems keeps the first item and the last few, replacing the middle with an accessible ellipsis — ideal on small screens.",
      `<Breadcrumb
  maxItems={3}
  items={[
    { label: "Home", href: "#/docs/introduction" },
    { label: "Organization", href: "#/components" },
    { label: "Platform team", href: "#/components" },
    { label: "Projects", href: "#/components" },
    { label: "Atlas" },
  ]}
/>`,
      <R.Breadcrumb maxItems={3} items={[{ label: "Home", href: "#/docs/introduction" }, { label: "Organization", href: "#/components" }, { label: "Platform team", href: "#/components" }, { label: "Projects", href: "#/components" }, { label: "Atlas" }]} />),
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
    ex("sidebar-rail", "Collapsible icon rail", "collapsible adds a toggle that shrinks the sidebar to an icon rail; labels become hover/focus bubbles and stay the accessible names. storageKey remembers the choice, and header can render differently when collapsed.",
      `function CollapsibleSidebar() {
  const [active, setActive] = useState("home")
  return (
    <div className="flex h-80 w-full overflow-hidden rounded-xl border border-border bg-bg">
      <Sidebar
        collapsible
        storageKey="docs-sidebar-rail"
        className="border-y-0 border-l-0"
        activeId={active}
        onSelect={setActive}
        header={(collapsed) => (collapsed ? <Box size={20} aria-label="Acme" /> : <span className="font-semibold">Acme</span>)}
        items={[
          { id: "home", label: "Home", icon: <Home size={16} /> },
          { id: "projects", label: "Projects", icon: <Folder size={16} />, badge: <Badge>4</Badge> },
          { id: "team", label: "Team", icon: <Users size={16} /> },
          { id: "settings", label: "Settings", icon: <Settings size={16} /> },
        ]}
      />
      <div className="grid flex-1 place-items-center p-6 text-sm text-muted-foreground">Viewing {active}. Collapse the rail; hover an icon for its label.</div>
    </div>
  )
}`,
      <CollapsibleSidebarExample />),
    ex("bottom-bar-layouts", "Bottom bar layouts", "Mix variant (bar / floating), indicator (pill / line / dot / none), labels (always / active / hidden) and a raised centerAction. Try the combinations — the phone updates live.",
      `function BottomBarPlayground() {
  const [active, setActive] = useState("home")
  const [variant, setVariant] = useState<"bar" | "floating">("floating")
  const [indicator, setIndicator] = useState<"pill" | "line" | "dot" | "none">("pill")
  const [labels, setLabels] = useState<"always" | "active" | "hidden">("always")
  const [withAction, setWithAction] = useState(true)
  const tab = mobileTabs.find((item) => item.id === active)!
  return (
    <div className="grid w-full grid-cols-1 justify-items-center gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
      <div className="grid w-full max-w-sm gap-3">
        <FormField label="Variant">
          <ToggleGroup type="single" size="sm" variant="outline" aria-label="Variant" value={variant} onValueChange={(v) => v && setVariant(v as typeof variant)}>
            <ToggleGroupItem value="bar">Bar</ToggleGroupItem>
            <ToggleGroupItem value="floating">Floating</ToggleGroupItem>
          </ToggleGroup>
        </FormField>
        <FormField label="Indicator">
          <ToggleGroup type="single" size="sm" variant="outline" aria-label="Indicator" value={indicator} onValueChange={(v) => v && setIndicator(v as typeof indicator)}>
            <ToggleGroupItem value="pill">Pill</ToggleGroupItem>
            <ToggleGroupItem value="line">Line</ToggleGroupItem>
            <ToggleGroupItem value="dot">Dot</ToggleGroupItem>
            <ToggleGroupItem value="none">None</ToggleGroupItem>
          </ToggleGroup>
        </FormField>
        <FormField label="Labels">
          <ToggleGroup type="single" size="sm" variant="outline" aria-label="Labels" value={labels} onValueChange={(v) => v && setLabels(v as typeof labels)}>
            <ToggleGroupItem value="always">Always</ToggleGroupItem>
            <ToggleGroupItem value="active">Active</ToggleGroupItem>
            <ToggleGroupItem value="hidden">Hidden</ToggleGroupItem>
          </ToggleGroup>
        </FormField>
        <Switch label="Center action" checked={withAction} onCheckedChange={setWithAction} />
      </div>
      <div className="flex h-[480px] w-[360px] max-w-full flex-col overflow-hidden rounded-[28px] border border-border bg-bg shadow-floating">
        <header className="border-b border-border bg-surface px-4 py-3 text-sm font-semibold">{tab.label}</header>
        <ul className="flex-1 divide-y divide-border overflow-y-auto">
          {tab.content.map((line) => <li key={line} className="px-4 py-3 text-sm">{line}</li>)}
        </ul>
        <BottomBar
          items={mobileTabs}
          activeId={active}
          onSelect={setActive}
          variant={variant}
          indicator={indicator}
          labels={labels}
          centerAction={withAction ? <Button size="icon" className="size-12 rounded-full shadow-floating" aria-label="New project"><Plus size={22} /></Button> : undefined}
        />
      </div>
    </div>
  )
}`,
      <BottomBarPlayground />),
    ex("bottom-bar", "Mobile bottom bar", "A native-style tab bar: icon over label, a pill behind the active icon, count badges on the icon corner (announced in the tab name) and 64px touch targets. Pass fixed to pin it to the viewport bottom with safe-area padding.",
      `const mobileTabs = [
  { id: "home", label: "Home", icon: <Home size={20} />, content: ["Deploys today: 14", "Uptime: 99.98%", "Open incidents: 0"] },
  { id: "projects", label: "Projects", icon: <Box size={20} />, badge: 12, content: ["api-gateway", "web-frontend", "queue-worker"] },
  { id: "inbox", label: "Inbox", icon: <Bell size={20} />, badge: 3, content: ["Build failed on main", "Maya mentioned you", "Invoice paid"] },
  { id: "account", label: "Account", icon: <User size={20} />, content: ["Profile", "Billing", "Sign out"] },
]

function MobileApp() {
  const [active, setActive] = useState("home")
  const tab = mobileTabs.find((item) => item.id === active)!
  return (
    <div className="flex h-[480px] w-full max-w-[360px] flex-col overflow-hidden rounded-[28px] border border-border bg-bg shadow-floating">
      <header className="border-b border-border bg-surface px-4 py-3 text-sm font-semibold">{tab.label}</header>
      <ul className="flex-1 divide-y divide-border overflow-y-auto">
        {tab.content.map((line) => <li key={line} className="px-4 py-3 text-sm">{line}</li>)}
      </ul>
      {/* In an app, add fixed to pin it to the viewport bottom. */}
      <BottomBar items={mobileTabs} activeId={active} onSelect={setActive} />
    </div>
  )
}`,
      <BottomBarExample />),
  ],

  "components/data-table": () => [
    ex("selection", "Row selection and bulk actions", "selectable adds a checkbox column with select-all; bulkActions renders a bar while rows are selected. isRowSelectable locks rows (paid invoices here).",
      `function InvoiceTable() {
  const [archived, setArchived] = useState<string[]>([])
  return (
    <>
      <DataTable
        ariaLabel="Invoices with selection"
        columns={invoiceColumns}
        data={invoices.filter((invoice) => !archived.includes(invoice.customer))}
        selectable
        isRowSelectable={(row) => row.status !== "Paid"}
        getRowLabel={(row) => row.customer}
        pageSizeOptions={false}
        bulkActions={(selected, clear) => (
          <>
            <Button size="sm" variant="secondary" onClick={clear}>Clear</Button>
            <Button size="sm" variant="danger" onClick={() => { setArchived([...archived, ...selected.map((row) => row.customer)]); clear() }}>
              Archive
            </Button>
          </>
        )}
      />
      <span role="status">{archived.length ? \`Archived: \${archived.join(", ")}\` : "Paid invoices cannot be selected"}</span>
    </>
  )
}`,
      <DataTableSelectionExample />, "start"),
    ex("columns", "Pin, resize and toggle columns", "pinned keeps a column visible while scrolling sideways; resizableColumns adds drag handles (arrow keys work too); columnToggle adds a Columns menu.",
      `<DataTable
  ariaLabel="Invoices with column tools"
  columns={[
    { ...invoiceColumns[0], pinned: "left", hideable: false },
    invoiceColumns[1],
    invoiceColumns[2],
    { key: "id", header: "Invoice", cell: (row) => \`INV-\${1000 + row.id}\` },
  ]}
  data={invoices}
  columnToggle
  resizableColumns
  pageSizeOptions={false}
/>`,
      <DataTableColumnsExample />, "start"),
    ex("server", "Server-side data", "With manual, the table only reports query, sort and page changes; your API returns the current page and rowCount. This example simulates a 400 ms API.",
      `// A stand-in for your API: filters, sorts and pages on the "server".
function fetchInvoices({ query, sort, page, pageSize }: { query: string; sort: DataTableSort; page: number; pageSize: number }) {
  return new Promise<{ rows: Invoice[]; total: number }>((resolve) => {
    window.setTimeout(() => {
      let result = invoices.filter((invoice) => invoice.customer.toLowerCase().includes(query.toLowerCase()))
      if (sort.key && sort.dir) {
        const key = sort.key as keyof Invoice
        result = [...result].sort((a, b) => String(a[key]).localeCompare(String(b[key]), undefined, { numeric: true }) * (sort.dir === "asc" ? 1 : -1))
      }
      resolve({ rows: result.slice((page - 1) * pageSize, page * pageSize), total: result.length })
    }, 400)
  })
}

function ServerInvoices() {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<DataTableSort>({ key: null, dir: null })
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<{ rows: Invoice[]; total: number } | null>(null)
  useEffect(() => {
    let current = true
    fetchInvoices({ query, sort, page, pageSize: 3 }).then((next) => { if (current) setResult(next) })
    return () => { current = false }
  }, [query, sort, page])
  return (
    <DataTable
      manual
      ariaLabel="Invoices from the server"
      columns={invoiceColumns}
      data={result?.rows ?? []}
      rowCount={result?.total ?? 0}
      loading={!result}
      searchable
      searchPlaceholder="Search customers…"
      query={query}
      onQueryChange={setQuery}
      sort={sort}
      onSortChange={setSort}
      page={page}
      onPageChange={setPage}
      pageSizeOptions={[3]}
    />
  )
}`,
      <DataTableServerExample />, "start"),
    ex("virtualized", "10,000 rows, virtualized", "virtualized renders only the rows in view (with a sticky header), so search and sort stay instant on large data sets.",
      `const manyEvents = Array.from({ length: 10_000 }, (_, index) => ({
  id: index,
  event: ["deploy.succeeded", "deploy.failed", "build.started", "domain.verified"][index % 4],
  latency: (index * 37) % 900,
}))

<DataTable
  ariaLabel="10,000 events"
  columns={[
    { key: "id", header: "#", sortable: true, cell: (row) => row.id },
    { key: "event", header: "Event", sortable: true, cell: (row) => row.event },
    { key: "latency", header: "Latency", sortable: true, align: "right", cell: (row) => \`\${row.latency} ms\` },
  ]}
  data={manyEvents}
  searchable
  virtualized={{ height: 320, rowHeight: 41 }}
/>`,
      <DataTableVirtualExample />, "start"),
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
    ex("conditional", "Conditional row styling", "rowClassName accepts a function, so rows can be styled from their data — here overdue invoices are tinted.",
      `<DataTable
  ariaLabel="Invoices with overdue rows highlighted"
  columns={columns}
  data={invoices}
  pageSizeOptions={false}
  defaultPageSize={10}
  rowClassName={(row) => (row.status === "Overdue" ? "bg-danger/5" : undefined)}
/>`,
      <DataTableConditionalExample />, "start"),
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
    ex("bubbles", "Bubbles with axis labels", "r scales a dot (0.5–2, default 1 = 10px); label both axes and format values.",
      `<ScatterChart
  height={220}
  xLabel="Requests / s"
  yLabel="Latency"
  formatY={(value) => \`\${value} ms\`}
  series={[{
    label: "Services",
    color: "var(--chart-2)",
    data: [
      { x: 120, y: 40, r: 1, label: "auth" },
      { x: 480, y: 95, r: 2, label: "api" },
      { x: 260, y: 160, r: 1.5, label: "search" },
      { x: 60, y: 22, r: 0.6, label: "health" },
    ],
  }]}
/>`,
      <R.ScatterChart className="w-full" height={220} xLabel="Requests / s" yLabel="Latency" formatY={(value) => `${value} ms`} series={[{ label: "Services", color: "var(--chart-2)", data: [{ x: 120, y: 40, r: 1, label: "auth" }, { x: 480, y: 95, r: 2, label: "api" }, { x: 260, y: 160, r: 1.5, label: "search" }, { x: 60, y: 22, r: 0.6, label: "health" }] }]} />),
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

  "components/context-menu": () => [
    ex("table", "On table rows", "Wrap any element — here each row gets its own menu with icons and a disabled item.",
      `<Table aria-label="Files">
  <TableBody>
    {["design.fig", "budget.xlsx", "notes.md"].map((file) => (
      <ContextMenu
        key={file}
        asChild
        items={[
          { label: "Share", icon: <Users size={14} /> },
          { label: "Move to…", icon: <Folder size={14} />, disabled: true },
          { label: "Delete", destructive: true },
        ]}
      >
        <TableRow tabIndex={0}>
          <TableCell>{file}</TableCell>
          <TableCell className="text-right text-muted-foreground">Right-click</TableCell>
        </TableRow>
      </ContextMenu>
    ))}
  </TableBody>
</Table>`,
      <ContextMenuTableExample />),
  ],

  "components/sheet": () => [
    ex("persistent", "Persistent mini player", "modal={false} keeps the page interactive and dismissible={false} keeps the sheet up; it rests at 132px and expands to 55% of the screen.",
      `function NowPlaying() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(!open)}>{open ? "Hide player" : "Show player"}</Button>
      <Sheet open={open} onOpenChange={setOpen} modal={false} dismissible={false} snapPoints={[132, 0.55]} ariaLabel="Now playing">
        <div className="flex items-center gap-3 px-5 pb-4">
          <div className="size-12 shrink-0 rounded-lg bg-accent-500" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Midnight City</p>
            <p className="truncate text-xs text-muted-foreground">M83 · Hurry Up, We're Dreaming</p>
          </div>
          <Badge>Live</Badge>
        </div>
        <p className="px-5 text-sm text-muted-foreground">Up next: Wait · Outro · Steve McQueen</p>
      </Sheet>
    </>
  )
}`,
      <NowPlayingSheetExample />),
  ],

  "components/hover-card": () => [
    ex("sides", "Placement", "Each card prefers a side and flips at the viewport edge. These open faster with openDelay={150}.",
      `<div className="flex flex-wrap items-center gap-3">
  {(["top", "right", "bottom", "left"] as const).map((side) => (
    <HoverCard key={side} side={side} openDelay={150} width={220} content={<p className="text-muted-foreground">Opens on the <strong className="text-foreground">{side}</strong>, flipping when there is no room.</p>}>
      <Button variant="secondary">{side}</Button>
    </HoverCard>
  ))}
</div>`,
      <div className="flex flex-wrap items-center gap-3">
  {(["top", "right", "bottom", "left"] as const).map((side) => (
    <R.HoverCard key={side} side={side} openDelay={150} width={220} content={<p className="text-muted-foreground">Opens on the <strong className="text-foreground">{side}</strong>, flipping when there is no room.</p>}>
      <R.Button variant="secondary">{side}</R.Button>
    </R.HoverCard>
  ))}
</div>),
  ],

  "components/banner": () => [
    ex("tones", "Subtle tones", "Tinted strips for routine notices.",
      `<div className="grid w-full gap-2">
  <Banner title="Default" className="rounded-lg border">Workspace settings were updated.</Banner>
  <Banner tone="info" title="Info" className="rounded-lg border">A new version is available.</Banner>
  <Banner tone="success" title="Success" className="rounded-lg border">Your domain is verified.</Banner>
  <Banner tone="warning" title="Warning" className="rounded-lg border">You have used 90% of your quota.</Banner>
  <Banner tone="danger" title="Danger" className="rounded-lg border">Your last payment failed.</Banner>
</div>`,
      <div className="grid w-full gap-2">
  <R.Banner title="Default" className="rounded-lg border">Workspace settings were updated.</R.Banner>
  <R.Banner tone="info" title="Info" className="rounded-lg border">A new version is available.</R.Banner>
  <R.Banner tone="success" title="Success" className="rounded-lg border">Your domain is verified.</R.Banner>
  <R.Banner tone="warning" title="Warning" className="rounded-lg border">You have used 90% of your quota.</R.Banner>
  <R.Banner tone="danger" title="Danger" className="rounded-lg border">Your last payment failed.</R.Banner>
</div>),
    ex("solid", "Solid tones", "Filled strips for notices that must not be missed.",
      `<div className="grid w-full gap-2">
  <Banner variant="solid" title="Default">Read-only mode while we migrate.</Banner>
  <Banner variant="solid" tone="info" title="Info">Webinar starts in 10 minutes.</Banner>
  <Banner variant="solid" tone="success" title="Success">All systems operational.</Banner>
  <Banner variant="solid" tone="warning" title="Warning">Your trial ends in 3 days.</Banner>
  <Banner variant="solid" tone="danger" title="Danger">Service disruption in eu-west-1.</Banner>
</div>`,
      <div className="grid w-full gap-2">
  <R.Banner variant="solid" title="Default">Read-only mode while we migrate.</R.Banner>
  <R.Banner variant="solid" tone="info" title="Info">Webinar starts in 10 minutes.</R.Banner>
  <R.Banner variant="solid" tone="success" title="Success">All systems operational.</R.Banner>
  <R.Banner variant="solid" tone="warning" title="Warning">Your trial ends in 3 days.</R.Banner>
  <R.Banner variant="solid" tone="danger" title="Danger">Service disruption in eu-west-1.</R.Banner>
</div>),
    ex("persist", "Remembered dismissal", "With storageKey, a dismissed banner stays hidden after a reload.",
      `<div className="w-full overflow-hidden rounded-xl border border-border">
  <Banner tone="info" dismissible storageKey="docs-banner-cookies" action={<a href="#/docs/accessibility">Learn more</a>}>
    Dismiss me, then reload: storageKey keeps me hidden.
  </Banner>
</div>`,
      <div className="w-full overflow-hidden rounded-xl border border-border">
  <R.Banner tone="info" dismissible storageKey="docs-banner-cookies" action={<a href="#/docs/accessibility">Learn more</a>}>
    Dismiss me, then reload: storageKey keeps me hidden.
  </R.Banner>
</div>),
  ],

  "components/password-input": () => [
    ex("login", "Sign-in field", "Without meter or checklist the field uses autocomplete=\"current-password\" for password managers.",
      `<div className="w-full max-w-sm">
  <PasswordInput label="Password" hint="Forgot it? Reset from the sign-in page." />
</div>`,
      <div className="w-full max-w-sm">
  <R.PasswordInput label="Password" hint="Forgot it? Reset from the sign-in page." />
</div>),
  ],

  "components/search-input": () => [
    ex("sizes", "Sizes and a bare-key shortcut", "Press S anywhere on the page (outside a text field) to focus the small field.",
      `<div className="grid w-full max-w-sm gap-3">
  <SearchInput size="sm" aria-label="Small search" shortcut="s" />
  <SearchInput aria-label="Medium search" />
  <SearchInput size="lg" aria-label="Large search" loading defaultValue="pending query" />
</div>`,
      <div className="grid w-full max-w-sm gap-3">
  <R.SearchInput size="sm" aria-label="Small search" shortcut="s" />
  <R.SearchInput aria-label="Medium search" />
  <R.SearchInput size="lg" aria-label="Large search" loading defaultValue="pending query" />
</div>),
  ],

  "components/masked-input": () => [
    ex("currencies", "Currencies and locales", "Symbol position, grouping and decimals follow Intl for each currency and locale.",
      `<div className="grid w-full max-w-sm gap-3">
  <CurrencyInput label="Euro (German)" currency="EUR" locale="de-DE" defaultValue={1234.5} />
  <CurrencyInput label="Yen (no decimals)" currency="JPY" locale="ja-JP" defaultValue={98000} />
  <CurrencyInput label="Refund (negative allowed)" currency="GBP" locale="en-GB" allowNegative defaultValue={-42} />
</div>`,
      <div className="grid w-full max-w-sm gap-3">
  <R.CurrencyInput label="Euro (German)" currency="EUR" locale="de-DE" defaultValue={1234.5} />
  <R.CurrencyInput label="Yen (no decimals)" currency="JPY" locale="ja-JP" defaultValue={98000} />
  <R.CurrencyInput label="Refund (negative allowed)" currency="GBP" locale="en-GB" allowNegative defaultValue={-42} />
</div>),
    ex("masks", "Custom masks", "Dates, postcodes and mixed letter/digit codes.",
      `<div className="grid w-full max-w-sm gap-3">
  <MaskedInput label="Expiry" mask="99/99" placeholder="MM/YY" />
  <MaskedInput label="Licence plate" mask="aaa-9999" />
  <MaskedInput label="Invite code" mask="****-****" />
</div>`,
      <div className="grid w-full max-w-sm gap-3">
  <R.MaskedInput label="Expiry" mask="99/99" placeholder="MM/YY" />
  <R.MaskedInput label="Licence plate" mask="aaa-9999" />
  <R.MaskedInput label="Invite code" mask="****-****" />
</div>),
  ],

  "components/sparkline": () => [
    ex("bars", "Bar strip with a target", "type=\"bar\" emphasizes the latest period; reference draws a dashed target.",
      `<div className="flex items-center gap-3 text-sm">
  <span className="text-muted-foreground">Daily orders</span>
  <Sparkline type="bar" data={[18, 24, 21, 30, 27, 33, 41]} reference={30} width={120} height={32} />
  <span className="font-semibold tabular-nums">41</span>
</div>`,
      <div className="flex items-center gap-3 text-sm">
  <span className="text-muted-foreground">Daily orders</span>
  <R.Sparkline type="bar" data={[18, 24, 21, 30, 27, 33, 41]} reference={30} width={120} height={32} />
  <span className="font-semibold tabular-nums">41</span>
</div>),
  ],

  "components/navigation-menu": () => [
    ex("single-column", "Compact panels", "columns={1} for short lists; plain links sit alongside panels.",
      `<div className="w-full rounded-xl border border-border bg-surface px-3 py-2">
  <NavigationMenu
    ariaLabel="Account"
    items={[
      { label: "Workspace", columns: 1, links: [{ label: "Members", href: "#/components/avatar" }, { label: "Billing", href: "#/components/stat" }, { label: "Audit log", href: "#/components/timeline" }] },
      { label: "Help", href: "#/docs/introduction" },
    ]}
  />
</div>`,
      <div className="w-full rounded-xl border border-border bg-surface px-3 py-2">
  <R.NavigationMenu
    ariaLabel="Account"
    items={[
      { label: "Workspace", columns: 1, links: [{ label: "Members", href: "#/components/avatar" }, { label: "Billing", href: "#/components/stat" }, { label: "Audit log", href: "#/components/timeline" }] },
      { label: "Help", href: "#/docs/introduction" },
    ]}
  />
</div>, "start"),
  ],

  "components/area-chart": () => [
    ex("single", "Single series, linear", "One series needs no legend; curve=\"linear\" draws straight segments.",
      `<AreaChart
  ariaLabel="Requests per hour"
  curve="linear"
  height={200}
  labels={["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"]}
  series={[{ label: "Requests", data: [320, 210, 980, 1640, 1420, 760] }]}
/>`,
      <R.AreaChart
  ariaLabel="Requests per hour"
  curve="linear"
  height={200}
  labels={["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"]}
  series={[{ label: "Requests", data: [320, 210, 980, 1640, 1420, 760] }]}
/>),
  ],

  "components/stacked-bar-chart": () => [
    ex("many", "Many categories", "Labels thin out automatically; every column stays hoverable and keyboard-readable.",
      `<StackedBarChart
  ariaLabel="Tickets by priority per day"
  height={200}
  maxLabels={6}
  labels={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"]}
  series={[
    { label: "Low", data: [8, 6, 9, 7, 10, 4, 3, 9, 8, 11, 7, 6, 5, 9] },
    { label: "High", data: [3, 4, 2, 5, 3, 1, 1, 4, 6, 3, 2, 4, 2, 3] },
  ]}
/>`,
      <R.StackedBarChart
  ariaLabel="Tickets by priority per day"
  height={200}
  maxLabels={6}
  labels={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"]}
  series={[
    { label: "Low", data: [8, 6, 9, 7, 10, 4, 3, 9, 8, 11, 7, 6, 5, 9] },
    { label: "High", data: [3, 4, 2, 5, 3, 1, 1, 4, 6, 3, 2, 4, 2, 3] },
  ]}
/>),
  ],

  "components/gauge": () => [
    ex("tones", "Plain tones and sizes", "Without thresholds the arc uses tone; size scales the whole meter.",
      `<div className="flex flex-wrap items-end justify-center gap-6">
  <Gauge label="Uptime" value={99.9} min={95} max={100} tone="success" size={140} formatValue={(value) => \`\${value}%\`} />
  <Gauge label="Error budget" value={22} tone="warning" size={140} formatValue={(value) => \`\${value}%\`} caption="remaining" />
  <Gauge label="Score" value={640} min={300} max={850} variant="dial" size={140} />
</div>`,
      <div className="flex flex-wrap items-end justify-center gap-6">
  <R.Gauge label="Uptime" value={99.9} min={95} max={100} tone="success" size={140} formatValue={(value) => `${value}%`} />
  <R.Gauge label="Error budget" value={22} tone="warning" size={140} formatValue={(value) => `${value}%`} caption="remaining" />
  <R.Gauge label="Score" value={640} min={300} max={850} variant="dial" size={140} />
</div>),
  ],

  "components/image": () => [
    ex("contain", "Fit and fixed size", "fit=\"contain\" letterboxes inside a fixed box; loading=\"eager\" for above-the-fold images.",
      `<div className="flex flex-wrap items-center gap-4">
  <Image src="/gallery/night-peaks.svg" alt="Dark peaks under a starry sky" width={160} height={160} fit="contain" loading="eager" />
  <Image src="/gallery/pine-valley.svg" alt="Green valley full of pine trees" width={240} height={160} />
</div>`,
      <div className="flex flex-wrap items-center gap-4">
  <R.Image src="/gallery/night-peaks.svg" alt="Dark peaks under a starry sky" width={160} height={160} fit="contain" loading="eager" />
  <R.Image src="/gallery/pine-valley.svg" alt="Green valley full of pine trees" width={240} height={160} />
</div>),
  ],

  "components/lightbox": () => [
    ex("single", "Single image", "With one image there is no counter, arrows or thumbnails.",
      `function SingleImage() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>View floor plan</Button>
      <Lightbox open={open} onOpenChange={setOpen} images={[{ src: "/gallery/coastal-cliffs.svg", alt: "Teal cliffs over a calm sea", caption: "Coastal cliffs, full resolution" }]} />
    </>
  )
}`,
      <SingleLightboxExample />),
  ],

  "components/resizable": () => [
    ex("persisted", "Persisted with a grip", "storageKey remembers the layout across reloads; withHandle shows a grip. Resize, then reload the page.",
      `<div className="h-56 w-full overflow-hidden rounded-xl border border-border bg-surface">
  <Resizable storageKey="docs-mail-layout" withHandle defaultSizes={[35, 65]} minSizes={[25, 35]} panelLabels={["Inbox", "Message"]}>
    <ResizablePanel className="divide-y divide-border text-sm">
      <p className="px-3 py-2 font-medium">Deploy succeeded</p>
      <p className="px-3 py-2">Weekly report</p>
      <p className="px-3 py-2">New comment</p>
    </ResizablePanel>
    <ResizablePanel className="p-4 text-sm text-muted-foreground">api-gateway v2.4.1 is live in all regions.</ResizablePanel>
  </Resizable>
</div>`,
      <div className="h-56 w-full overflow-hidden rounded-xl border border-border bg-surface"><R.Resizable storageKey="docs-mail-layout" withHandle defaultSizes={[35, 65]} minSizes={[25, 35]} panelLabels={["Inbox", "Message"]}><R.ResizablePanel className="divide-y divide-border text-sm"><p className="px-3 py-2 font-medium">Deploy succeeded</p><p className="px-3 py-2">Weekly report</p><p className="px-3 py-2">New comment</p></R.ResizablePanel><R.ResizablePanel className="p-4 text-sm text-muted-foreground">api-gateway v2.4.1 is live in all regions.</R.ResizablePanel></R.Resizable></div>),
  ],

  "components/sortable": () => [
    ex("kanban", "Kanban board", "Multi-column workflow board. Pick up cards with Space, move between columns with Left/Right, reorder with Up/Down, and drop with Space.",
      `function KanbanBoard() {
  const [columns, setColumns] = useState([
    {
      id: "backlog",
      title: "Backlog",
      limit: 4,
      items: [
        { id: "b1", title: "GraphQL schema audit" },
        { id: "b2", title: "Redis cache invalidation" },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      limit: 2,
      items: [
        { id: "p1", title: "OAuth 2.1 PKCE support" },
      ],
    },
    {
      id: "done",
      title: "Done",
      items: [
        { id: "d1", title: "Dark mode tokens" },
        { id: "d2", title: "Vitest migration" },
      ],
    },
  ])
  return (
    <div className="w-full overflow-x-auto py-2">
      <Kanban
        columns={columns}
        onChange={(next) => setColumns(next)}
        getLabel={(item) => item.title}
        renderCard={(item) => (
          <div className="text-sm font-medium text-foreground">{item.title}</div>
        )}
      />
    </div>
  )
}`,
      <KanbanBoardExample />),
    ex("horizontal", "Horizontal reorder", "orientation=\"horizontal\" reorders items in an inline row or flex-wrap layout.",
      `function TagOrder() {
  const [tags, setTags] = useState([
    { id: "react", label: "React" },
    { id: "ts", label: "TypeScript" },
    { id: "tailwind", label: "Tailwind" },
    { id: "vite", label: "Vite" },
  ])
  return (
    <SortableList
      orientation="horizontal"
      items={tags}
      onReorder={(next) => setTags(next)}
      getLabel={(tag) => tag.label}
      renderItem={(tag) => <span className="text-sm font-medium">{tag.label}</span>}
    />
  )
}`,
      <SortableHorizontalExample />),
  ],

  "components/notification-center": () => [
    ex("categories", "Category filters and custom trigger", "Separate notifications into categories like mentions and system alerts with a custom trigger button.",
      `function CustomNotifications() {
  const [items, setItems] = useState<NotificationItem[]>([
    { id: "m1", title: "@sarah mentioned you in PR #42", description: "Could you check the retry logic here?", timestamp: "12m ago", read: false, category: "mentions", avatar: { name: "Sarah Chen" } },
    { id: "m2", title: "@alex requested your review", description: "feat: add webhook delivery retries", timestamp: "1h ago", read: false, category: "mentions", avatar: { name: "Alex Rivera" } },
    { id: "s1", title: "Weekly security digest", description: "Zero vulnerabilities detected across 14 packages", timestamp: "1d ago", read: true, category: "system", tone: "info" },
  ])
  return (
    <div className="flex items-center gap-4">
      <NotificationCenter
        items={items}
        onItemsChange={setItems}
        categories={["all", "mentions", "system"]}
        trigger={<Button variant="secondary" size="sm">Inbox ({items.filter((i) => !i.read).length})</Button>}
      />
    </div>
  )
}`,
      <NotificationCenterCustomExample />),
  ],

  "components/tour": () => [
    ex("actions", "Steps with custom actions", "Steps can embed dedicated action buttons and anchor around targeted card elements.",
      `function GuidedTour() {
  const [open, setOpen] = useState(false)
  const steps: TourStep[] = [
    {
      target: "#tour-card-1",
      title: "Interactive spotlight",
      content: "Each step anchors seamlessly to any element or selector.",
      placement: "bottom",
      action: { label: "Learn more", onClick: () => alert("Step action triggered") },
    },
    {
      target: "#tour-card-2",
      title: "Step completions",
      content: "Finish or skip steps with keyboard navigation (Escape, Arrow keys).",
      placement: "top",
    },
  ]
  return (
    <div className="demo-stack items-center w-full max-w-md">
      <div className="grid grid-cols-2 gap-4 w-full">
        <div id="tour-card-1" className="p-3 rounded-lg border border-border bg-surface text-xs font-medium">Element Alpha</div>
        <div id="tour-card-2" className="p-3 rounded-lg border border-border bg-surface text-xs font-medium">Element Beta</div>
      </div>
      <Button size="sm" onClick={() => setOpen(true)}>Launch guide</Button>
      <Tour steps={steps} open={open} onOpenChange={setOpen} />
    </div>
  )
}`,
      <TourStepActionExample />),
  ],

  "components/menubar": () => [
    ex("editor", "Document actions", "Menubar groups commands into accessible top-level categories with keyboard shortcuts.",
      `function EditorMenubar() {
  const [activeAction, setActiveAction] = useState<string | null>(null)
  return (
    <div className="demo-stack w-full max-w-md">
      <Menubar
        menus={[
          {
            label: "Format",
            items: [
              { label: "Bold", shortcut: "⌘B", onClick: () => setActiveAction("Bold") },
              { label: "Italic", shortcut: "⌘I", onClick: () => setActiveAction("Italic") },
              { label: "Strikethrough", onClick: () => setActiveAction("Strikethrough") },
            ],
          },
          {
            label: "Insert",
            items: [
              { label: "Table", onClick: () => setActiveAction("Table inserted") },
              { label: "Image…", onClick: () => setActiveAction("Image picker opened") },
              { label: "Link…", shortcut: "⌘K", onClick: () => setActiveAction("Link dialog opened") },
            ],
          },
        ]}
      />
      <span className="text-sm text-muted-foreground" role="status">
        {activeAction ? \`Action selected: \${activeAction}\` : "Choose a formatting action from the menu"}
      </span>
    </div>
  )
}`,
      <MenubarAppExample />),
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

  "components/inline-edit": () => [
    ex("validation", "With validation", "Validates input synchronously or asynchronously before committing.",
      `function InlineEditValidation() {
  const [email, setEmail] = useState("admin@company.com")
  return (
    <div className="demo-stack items-start">
      <InlineEdit
        value={email}
        onSave={setEmail}
        validate={(v) => (!v.includes("@") ? "Must be a valid email" : undefined)}
        placeholder="Enter an email…"
      />
    </div>
  )
}`,
      <InlineEditValidationExample />),
    ex("multiline", "Multiline text", "Edits longer text with an auto-expanding textarea, save/cancel buttons, and keyboard shortcuts.",
      `function InlineEditMultiline() {
  const [bio, setBio] = useState("Frontend engineer working on component systems, web performance, and developer tools.")
  return (
    <div className="w-full max-w-md">
      <InlineEdit
        multiline
        value={bio}
        onSave={setBio}
        placeholder="Add a bio…"
      />
    </div>
  )
}`,
      <InlineEditMultilineExample />),
  ],

  "components/range-slider": () => [
    ex("marks", "Tick marks and snapping", "Displays reference marks and snaps to discrete step intervals.",
      `function RangeSliderMarks() {
  const [hours, setHours] = useState<[number, number]>([9, 17])
  return (
    <div className="w-full max-w-md">
      <RangeSlider
        label="Working Hours"
        min={0}
        max={24}
        step={1}
        value={hours}
        onChange={setHours}
        formatValue={(v) => \`\${v}:00\`}
        marks={[
          { value: 0, label: "00:00" },
          { value: 6, label: "06:00" },
          { value: 12, label: "12:00" },
          { value: 18, label: "18:00" },
          { value: 24, label: "24:00" },
        ]}
      />
    </div>
  )
}`,
      <RangeSliderMarksExample />),
    ex("sizes", "Sizes", "Available in small and large track scales.",
      `function RangeSliderSizes() {
  const [val, setVal] = useState<[number, number]>([20, 80])
  return (
    <div className="demo-stack w-full max-w-sm">
      <RangeSlider size="sm" value={val} onChange={setVal} label="Small" />
      <RangeSlider size="lg" value={val} onChange={setVal} label="Large" />
    </div>
  )
}`,
      <RangeSliderSizesExample />),
  ],

  "components/date-time-picker": () => [
    ex("twenty-four-hour", "24-hour time format", "Switches from 12-hour AM/PM to 24-hour military time.",
      `function DateTimePicker24h() {
  const [date, setDate] = useState<Date | null>(new Date())
  return (
    <div className="w-full max-w-sm">
      <DateTimePicker
        label="Server Maintenance Window"
        value={date}
        onChange={setDate}
        is24Hour
        hint="Specified in 24-hour UTC format"
      />
    </div>
  )
}`,
      <DateTimePicker24hExample />),
    ex("presets", "Custom presets", "Provides quick 1-click scheduling shortcuts for common milestones.",
      `function DateTimePickerPresets() {
  const [date, setDate] = useState<Date | null>(new Date())
  const presets = [
    { label: "Sprint Planning", getValue: () => new Date(Date.now() + 2 * 3600 * 1000) },
    { label: "Code Freeze", getValue: () => new Date(Date.now() + 24 * 3600 * 1000) },
    { label: "Release Cutoff", getValue: () => new Date(Date.now() + 48 * 3600 * 1000) },
  ]
  return (
    <div className="w-full max-w-sm">
      <DateTimePicker
        label="Milestone Deadline"
        value={date}
        onChange={setDate}
        presets={presets}
      />
    </div>
  )
}`,
      <DateTimePickerPresetsExample />),
    ex("sizes", "Sizes", "Available in small, medium, and large field scales matching standard inputs.",
      `function DateTimePickerSizes() {
  const [smVal, setSmVal] = useState<Date | null>(new Date())
  const [lgVal, setLgVal] = useState<Date | null>(new Date())
  return (
    <div className="demo-stack w-full max-w-sm">
      <DateTimePicker label="Compact size" size="sm" value={smVal} onChange={setSmVal} />
      <DateTimePicker label="Large size" size="lg" value={lgVal} onChange={setLgVal} />
    </div>
  )
}`,
      <DateTimePickerSizesExample />),
    ex("states", "Error and disabled states", "Shows accessible validation error message and disabled mode.",
      `<div className="demo-stack w-full max-w-sm">
  <DateTimePicker label="Required Start Date" error="Start date and time is required." />
  <DateTimePicker label="Archived Release" defaultValue={new Date()} disabled />
</div>`,
      <div className="demo-stack w-full max-w-sm"><R.DateTimePicker label="Required Start Date" error="Start date and time is required." /><R.DateTimePicker label="Archived Release" defaultValue={new Date()} disabled /></div>),
  ],

  "components/color-picker": () => [
    ex("swatches", "Custom palette swatches", "Provides a curated list of color swatches for fast selection.",
      `function ColorPickerSwatches() {
  const [color, setColor] = useState("#10b981")
  return (
    <div className="w-full max-w-xs">
      <ColorPicker
        label="Badge Color"
        value={color}
        onChange={setColor}
        swatches={["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899"]}
      />
    </div>
  )
}`,
      <ColorPickerSwatchesExample />),
    ex("eyedropper", "EyeDropper integration", "Sample any pixel from the display when supported by the browser.",
      `function ColorPickerEyeDropper() {
  const [color, setColor] = useState("#6366f1")
  return (
    <div className="w-full max-w-xs">
      <ColorPicker
        label="Accent Color"
        value={color}
        onChange={setColor}
        showEyeDropper
      />
    </div>
  )
}`,
      <ColorPickerEyeDropperExample />),
  ],

  "components/responsive-dialog": () => [
    ex("form", "Form inside responsive dialog", "Maintains form state and keyboard accessibility across desktop modal and mobile bottom sheet.",
      `function ResponsiveDialogForm() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger className="inline-flex h-9 items-center justify-center rounded-[var(--radius-md)] bg-accent px-3 text-sm font-semibold text-accent-foreground shadow-xs">
        New Workspace
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent title="New Workspace" description="Create a workspace to collaborate with your team.">
        <div className="space-y-4 py-2">
          <Input label="Workspace name" placeholder="acme-corp" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose className="inline-flex h-8 items-center justify-center rounded-[var(--radius-md)] border border-border px-3 text-xs font-medium">
            Cancel
          </ResponsiveDialogClose>
          <Button size="sm" onClick={() => setOpen(false)}>Create</Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}`,
      <ResponsiveDialogFormExample />),
  ],

  "components/collapsible": () => [
    ex("filters", "Collapsible filter panel", "Reveals advanced search and filter controls on demand.",
      `function CollapsibleFilter() {
  const [open, setOpen] = useState(false)
  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-surface p-4">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Filters & Options</span>
          <CollapsibleTrigger className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface-muted">
            {open ? "Less options" : "More options"}
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-3 pt-4">
          <Checkbox label="Show archived items" />
          <Checkbox label="Include deleted records" />
          <Checkbox label="Send email digest" defaultChecked />
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}`,
      <CollapsibleFilterExample />),
  ],

  "components/drag-and-drop": () => [
    ex("handles", "Dedicated drag handles", "Limits drag initiation to a specialized DragHandle button.",
      `function DndHandleExample() {
  const [items, setItems] = useState(["Deploy API", "Update DNS", "Run Migrations"])
  const [done, setDone] = useState<string[]>([])

  const handleDragEnd = ({ activeId, targetDroppableId }: DragEndEvent) => {
    if (!targetDroppableId) return
    if (targetDroppableId === "done" && items.includes(activeId)) {
      setItems((prev) => prev.filter((i) => i !== activeId))
      setDone((prev) => [...prev, activeId])
    } else if (targetDroppableId === "todo" && done.includes(activeId)) {
      setDone((prev) => prev.filter((i) => i !== activeId))
      setItems((prev) => [...prev, activeId])
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <Droppable id="todo" className="rounded-lg border border-border bg-surface-muted/50 p-3 min-h-[140px] flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">To Do ({items.length})</span>
          {items.map((t) => (
            <Draggable key={t} id={t} className="flex items-center justify-between rounded border border-border bg-surface p-2 text-xs shadow-xs">
              <span>{t}</span>
              <DragHandle className="rounded p-1 hover:bg-surface-muted text-muted-foreground" aria-label={\`Drag \${t}\`} />
            </Draggable>
          ))}
        </Droppable>
        <Droppable id="done" className="rounded-lg border border-border bg-surface-muted/50 p-3 min-h-[140px] flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Done ({done.length})</span>
          {done.map((t) => (
            <Draggable key={t} id={t} className="flex items-center justify-between rounded border border-border bg-surface p-2 text-xs shadow-xs">
              <span>{t}</span>
              <DragHandle className="rounded p-1 hover:bg-surface-muted text-muted-foreground" aria-label={\`Drag \${t}\`} />
            </Draggable>
          ))}
        </Droppable>
      </div>
    </DndContext>
  )
}`,
      <DndHandleExample />),
  ],

  "components/pano-tour": () => [
    ex(
      "studio",
      "Resort & Property 360° Tour Management Studio",
      "Multi-property resort studio with a searchable catalog of Villas, Private Houses, and Event Halls, live hotspot placement (Walk, Note, Media, Link, Button), arrival view camera picker, Copy Tour modal, and full-screen guest preview.",
      `function PanoTourStudioExample() {
  const initialTours: Record<string, PanoScene[]> = {
    hermes: [
      {
        id: "hermes-room",
        name: "Hermes Studio Villa",
        description: "Air-conditioned studio-type villa sleeping 5 with queen bed, pull-out double, kitchen, and smart TV with Netflix.",
        image: "/img/resort/360-villas.jpg",
        preview: "/img/resort/360-villas-preview.jpg",
        yaw: 0,
        pitch: 0,
        fov: 75,
        hotspots: [
          { id: "hm-1", type: "scene", yaw: 28, pitch: -4, target: "hermes-pool", label: "Step out to Poolside", icon: "waves", pulse: true },
          { id: "hm-2", type: "info", yaw: -75, pitch: 5, label: "Queen bed + pull-out double & extra single bed (sleeps 5)", icon: "bed" },
          { id: "hm-3", type: "media", yaw: 115, pitch: 8, icon: "image", media: { kind: "image", src: "/img/resort/card-villas.jpg", caption: "Hermes, Athena & Zeus Villa Row" } },
          { id: "hm-4", type: "action", yaw: -140, pitch: -12, action: "book", label: "Book Hermes Villa · ₱4,500", icon: "calendar" },
        ],
      },
      {
        id: "hermes-pool",
        name: "Shared Pool & Grill Station",
        description: "Swimming pool, kids playground, basketball court, and grill station shared by villa guests.",
        image: "/img/resort/360-pool.jpg",
        preview: "/img/resort/360-pool-preview.jpg",
        yaw: 15,
        pitch: 0,
        fov: 75,
        hotspots: [
          { id: "hm-5", type: "scene", yaw: -35, pitch: -4, target: "hermes-room", label: "Back to Hermes Villa", icon: "door-open" },
        ],
      },
    ],
    apollo: [
      {
        id: "apollo-house",
        name: "Apollo Private House & 4ft Pool",
        description: "Whole private house with its own 4-foot pool, 4 air-conditioned bedrooms (sleeps 13), kitchen, and soundproof videoke room.",
        image: "/img/resort/360-apollo.jpg",
        preview: "/img/resort/360-apollo-preview.jpg",
        yaw: 0,
        pitch: 0,
        fov: 75,
        hotspots: [
          { id: "ap-1", type: "scene", yaw: 32, pitch: -4, target: "apollo-grounds", label: "Resort Grounds & Parking", icon: "trees" },
          { id: "ap-2", type: "info", yaw: -70, pitch: 4, label: "4 AC rooms (13 pax) + soundproof videoke room & private 4ft pool", icon: "sparkles" },
          { id: "ap-3", type: "action", yaw: 130, pitch: -10, action: "book", label: "Book Apollo House · ₱14,500 / 22h", icon: "calendar", pulse: true },
        ],
      },
      {
        id: "apollo-grounds",
        name: "Private Carport & Grounds",
        description: "2 to 3 private carports and direct access to the basketball court and resort grounds.",
        image: "/img/resort/360-grounds.jpg",
        preview: "/img/resort/360-grounds-preview.jpg",
        yaw: 0,
        pitch: 0,
        fov: 75,
        hotspots: [
          { id: "ap-4", type: "scene", yaw: 0, pitch: -4, target: "apollo-house", label: "Apollo Private House", icon: "door-open" },
        ],
      },
    ],
    olympus: [
      {
        id: "olympus-hall",
        name: "Olympus Function Hall",
        description: "Air-conditioned function hall for 60 to 70 seated guests with small lobby, cold kitchen, and wireless mics.",
        image: "/img/resort/360-olympus.jpg",
        preview: "/img/resort/360-olympus-preview.jpg",
        yaw: 0,
        pitch: 0,
        fov: 75,
        hotspots: [
          { id: "ol-1", type: "scene", yaw: 30, pitch: -4, target: "poseidon-pool", label: "Poseidon’s Realm Pool & Pavilions", icon: "waves", pulse: true },
          { id: "ol-2", type: "info", yaw: -65, pitch: 6, label: "Includes 100 infinity chairs, 15–20 tables & 2-hr early catering ingress", icon: "utensils" },
        ],
      },
      {
        id: "poseidon-pool",
        name: "Poseidon’s Realm & Pavilions",
        description: "Complimentary access to the main pool and all four pavilions: Poseidon, Hestia, Nemea, and Selene.",
        image: "/img/resort/360-poseidon.jpg",
        preview: "/img/resort/360-poseidon-preview.jpg",
        yaw: 0,
        pitch: 0,
        fov: 75,
        hotspots: [
          { id: "ol-3", type: "scene", yaw: -30, pitch: -4, target: "olympus-hall", label: "Inside Olympus Hall", icon: "door-open" },
        ],
      },
    ],
    artemis: [
      {
        id: "artemis-main",
        name: "Artemis Private House",
        description: "Whole private house with 4 AC rooms, private 4-foot pool, full kitchen, and videoke room.",
        image: "/img/resort/360-artemis.jpg",
        preview: "/img/resort/360-artemis-preview.jpg",
        yaw: 0,
        pitch: 0,
        fov: 75,
        hotspots: [],
      },
    ],
    athena: [],
    zeus: [],
  }

  const [toursByPlace, setToursByPlace] = useState<Record<string, PanoScene[]>>(initialTours)
  const [placeId, setPlaceId] = useState("hermes")
  const [featuredId, setFeaturedId] = useState<string | number | null>("hermes-room")

  const places: PanoPlaceItem[] = [
    { id: "hermes", name: "Hermes Villa", category: "Villas", scenesCount: (toursByPlace.hermes ?? []).length },
    { id: "athena", name: "Athena Villa", category: "Villas", scenesCount: (toursByPlace.athena ?? []).length },
    { id: "zeus", name: "Zeus Villa (Sleeps 8)", category: "Villas", scenesCount: (toursByPlace.zeus ?? []).length },
    { id: "apollo", name: "Apollo Private House", category: "Private Houses", scenesCount: (toursByPlace.apollo ?? []).length },
    { id: "artemis", name: "Artemis Private House", category: "Private Houses", scenesCount: (toursByPlace.artemis ?? []).length },
    { id: "olympus", name: "Olympus Function Hall", category: "Events & Venues", scenesCount: (toursByPlace.olympus ?? []).length },
  ]

  const currentScenes = toursByPlace[placeId] ?? []

  return (
    <div className="w-full min-w-0">
      <PanoTourEditor
        places={places}
        selectedPlaceId={placeId}
        onSelectPlace={setPlaceId}
        scenes={currentScenes}
        onScenesChange={(next) => setToursByPlace((prev) => ({ ...prev, [placeId]: next }))}
        featuredSceneId={featuredId}
        onFeaturedSceneChange={setFeaturedId}
        onCopyTour={(targetIds, mode) => {
          setToursByPlace((prev) => {
            const copy = { ...prev }
            for (const id of targetIds) {
              const cloned = currentScenes.map((s) => ({ ...s, id: \`\${id}-\${s.id}\` }))
              copy[id] = mode === "replace" ? cloned : [...(copy[id] ?? []), ...cloned]
            }
            return copy
          })
        }}
      />
    </div>
  )
}`,
      <PanoTourStudioExample />,
    ),
    ex(
      "backdrop",
      "Resort Hero 360° Backdrop & Property Listing Cards",
      "Combines an interactive rotating 360° resort hero banner (PanoBackdrop) with property accommodation cards featuring live 360° previews and PanoTourButton triggers.",
      `function PanoBackdropExample() {
  const heroScene: PanoScene = {
    id: "aerial-grounds",
    name: "Resort Grounds & Pool Deck",
    description: "Outdoor garden and poolside view of Happy Homes Candelaria in Quezon.",
    image: "/img/resort/360-grounds.jpg",
    preview: "/img/resort/360-grounds-preview.jpg",
    yaw: 0,
    pitch: -3,
    fov: 65,
    hotspots: [
      { id: "g1", type: "info", yaw: 24, pitch: -6, label: "Ceremony & reception grounds for up to 150 guests", icon: "trees" },
    ],
  }

  const properties = [
    {
      id: "hermes",
      name: "Hermes Studio Villa",
      kind: "Studio Villa · Sleeps 5",
      price: "₱4,500 / day · ₱9,500 / 22 hrs",
      photo: "/img/resort/card-villas.jpg",
      blurb: "Queen bed with pull-out double & single bed, kitchen, heated bath, smart TV with Netflix, and shared pool.",
      scenes: [
        {
          id: "v1",
          name: "Hermes Studio Villa",
          description: "Air-conditioned studio villa with kitchen, Netflix TV, and shared pool access.",
          image: "/img/resort/360-villas.jpg",
          preview: "/img/resort/360-villas-preview.jpg",
          yaw: 0,
          pitch: 0,
          fov: 75,
          hotspots: [
            { id: "vh1", type: "info", yaw: -25, pitch: -6, label: "Queen bed + pull-out double & extra single", icon: "bed" },
            { id: "vh2", type: "action", yaw: 35, pitch: -12, action: "book", label: "Book Hermes Villa", icon: "calendar" },
          ],
        },
      ] as PanoScene[],
    },
    {
      id: "apollo",
      name: "Apollo Private House",
      kind: "Private House · Sleeps 13",
      price: "₱14,500 / 22 hrs (up to 20 pax)",
      photo: "/img/resort/card-apollo.jpg",
      blurb: "Whole house with its own private 4-ft swimming pool, 4 air-conditioned rooms, full kitchen, and soundproof videoke room.",
      scenes: [
        {
          id: "a1",
          name: "Apollo Private House & Pool",
          description: "Private house with 4 AC bedrooms, 4-foot pool, and soundproof videoke room.",
          image: "/img/resort/360-apollo.jpg",
          preview: "/img/resort/360-apollo-preview.jpg",
          yaw: 0,
          pitch: 0,
          fov: 75,
          hotspots: [
            { id: "ah1", type: "info", yaw: -20, pitch: -5, label: "Private 4-ft pool & 2–3 carports", icon: "waves" },
          ],
        },
      ] as PanoScene[],
    },
    {
      id: "olympus",
      name: "Olympus Function Hall",
      kind: "Function Hall · 60–70 Seated",
      price: "₱14,500 Day · ₱15,500 Night",
      photo: "/img/resort/card-olympus.jpg",
      blurb: "Air-conditioned event hall with lobby, cold kitchen, 100 infinity chairs, Bluetooth sound system, and all 4 pool pavilions.",
      scenes: [
        {
          id: "o1",
          name: "Olympus Function Hall",
          description: "Air-conditioned hall with 100 infinity chairs, tables, and complimentary pool & pavilions.",
          image: "/img/resort/360-olympus.jpg",
          preview: "/img/resort/360-olympus-preview.jpg",
          yaw: 0,
          pitch: 0,
          fov: 75,
          hotspots: [
            { id: "oh1", type: "info", yaw: 18, pitch: -4, label: "60–70 seated capacity + cold kitchen", icon: "sparkles" },
          ],
        },
      ] as PanoScene[],
    },
  ]

  return (
    <div className="w-full space-y-4">
      <PanoBackdrop
        scene={heroScene}
        title="Happy Homes Candelaria"
        fallbackPhoto="/img/resort/card-grounds.jpg"
        triggerLabel="Look around: Resort Grounds, Happy Homes Candelaria"
        className="h-72 w-full rounded-xl border border-border shadow-sm sm:h-80 md:h-96"
      >
        <div className="relative z-10 flex h-full flex-col justify-end bg-gradient-to-t from-black/80 via-black/25 to-transparent p-5 text-white">
          <p className="text-xs font-semibold tracking-wider text-white/80 uppercase">Candelaria, Quezon · Villas, Private Houses & Event Halls</p>
          <h4 className="text-xl font-bold">Happy Homes Candelaria Resort</h4>
        </div>
      </PanoBackdrop>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3">
        {properties.map((p) => (
          <div key={p.id} className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-xs">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
              <PanoViewer
                scene={{ ...p.scenes[0], hotspots: [] }}
                autoRotate={1.4}
                showCompass={false}
                className="size-full"
              />
              <PanoTourButton
                title={p.name}
                scenes={p.scenes}
                variant="chip"
                className="absolute top-2.5 right-2.5 z-20"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-2 p-3.5">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-accent-strong uppercase">{p.kind}</span>
                <h5 className="text-sm font-semibold text-foreground">{p.name}</h5>
                <p className="line-clamp-2 text-xs text-muted-foreground">{p.blurb}</p>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2.5">
                <span className="text-xs font-semibold text-foreground">{p.price}</span>
                <PanoTourButton
                  title={p.name}
                  scenes={p.scenes}
                  variant="link"
                  label="Virtual tour"
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}`,
      <PanoBackdropExample />,
    ),
  ],

  "components/icon": () => [
    ex(
      "sizes",
      "Size scale & custom dimensions",
      "Icons scale smoothly through presets ('xs'=14px, 'sm'=16px, 'md'=20px, 'lg'=24px, 'xl'=32px) or explicit numeric pixel values.",
      `<div className="flex flex-wrap items-end gap-6 text-foreground">
  <div className="flex flex-col items-center gap-1.5">
    <Icon name="star" size="xs" />
    <span className="text-[11px] text-muted-foreground">xs (14px)</span>
  </div>
  <div className="flex flex-col items-center gap-1.5">
    <Icon name="star" size="sm" />
    <span className="text-[11px] text-muted-foreground">sm (16px)</span>
  </div>
  <div className="flex flex-col items-center gap-1.5">
    <Icon name="star" size="md" />
    <span className="text-[11px] text-muted-foreground">md (20px)</span>
  </div>
  <div className="flex flex-col items-center gap-1.5">
    <Icon name="star" size="lg" />
    <span className="text-[11px] text-muted-foreground">lg (24px)</span>
  </div>
  <div className="flex flex-col items-center gap-1.5">
    <Icon name="star" size="xl" />
    <span className="text-[11px] text-muted-foreground">xl (32px)</span>
  </div>
  <div className="flex flex-col items-center gap-1.5">
    <Icon name="star" size={40} />
    <span className="text-[11px] text-muted-foreground">40px</span>
  </div>
</div>`,
      <div className="flex flex-wrap items-end gap-6 text-foreground">
        <div className="flex flex-col items-center gap-1.5">
          <R.Icon name="star" size="xs" />
          <span className="text-[11px] text-muted-foreground">xs (14px)</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <R.Icon name="star" size="sm" />
          <span className="text-[11px] text-muted-foreground">sm (16px)</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <R.Icon name="star" size="md" />
          <span className="text-[11px] text-muted-foreground">md (20px)</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <R.Icon name="star" size="lg" />
          <span className="text-[11px] text-muted-foreground">lg (24px)</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <R.Icon name="star" size="xl" />
          <span className="text-[11px] text-muted-foreground">xl (32px)</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <R.Icon name="star" size={40} />
          <span className="text-[11px] text-muted-foreground">40px</span>
        </div>
      </div>,
    ),
    ex(
      "tones",
      "Semantic tones",
      "Tones map to theme status and accent tokens without raw palette dependencies.",
      `<div className="flex flex-wrap items-center gap-4">
  <Icon name="check-circle" tone="success" size="lg" />
  <Icon name="alert-triangle" tone="warning" size="lg" />
  <Icon name="alert-circle" tone="danger" size="lg" />
  <Icon name="info" tone="info" size="lg" />
  <Icon name="sparkles" tone="accent" size="lg" />
  <Icon name="clock" tone="muted" size="lg" />
  <Icon name="bell" tone="default" size="lg" />
</div>`,
      <div className="flex flex-wrap items-center gap-4">
        <R.Icon name="check-circle" tone="success" size="lg" />
        <R.Icon name="alert-triangle" tone="warning" size="lg" />
        <R.Icon name="alert-circle" tone="danger" size="lg" />
        <R.Icon name="info" tone="info" size="lg" />
        <R.Icon name="sparkles" tone="accent" size="lg" />
        <R.Icon name="clock" tone="muted" size="lg" />
        <R.Icon name="bell" tone="default" size="lg" />
      </div>,
    ),
    ex(
      "dictionary",
      "Icon dictionary & actions",
      "Import named icon components directly via the Icons namespace for cleaner JSX and strong typing.",
      `<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
  <div className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-xs text-foreground">
    <Icons.Search className="text-muted-foreground" />
    <span>Icons.Search</span>
  </div>
  <div className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-xs text-foreground">
    <Icons.Copy className="text-muted-foreground" />
    <span>Icons.Copy</span>
  </div>
  <div className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-xs text-foreground">
    <Icons.Download className="text-muted-foreground" />
    <span>Icons.Download</span>
  </div>
  <div className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-xs text-foreground">
    <Icons.Trash className="text-danger-strong" />
    <span>Icons.Trash</span>
  </div>
  <div className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-xs text-foreground">
    <Icons.Sun className="text-warning-strong" />
    <span>Icons.Sun</span>
  </div>
  <div className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-xs text-foreground">
    <Icons.Moon className="text-muted-foreground" />
    <span>Icons.Moon</span>
  </div>
  <div className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-xs text-foreground">
    <Icons.Terminal className="text-accent-strong" />
    <span>Icons.Terminal</span>
  </div>
  <div className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-xs text-foreground">
    <Icons.Loader spin className="text-accent-strong" />
    <span>Icons.Loader (spin)</span>
  </div>
</div>`,
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-xs text-foreground">
          <R.Icons.Search className="text-muted-foreground" />
          <span>Icons.Search</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-xs text-foreground">
          <R.Icons.Copy className="text-muted-foreground" />
          <span>Icons.Copy</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-xs text-foreground">
          <R.Icons.Download className="text-muted-foreground" />
          <span>Icons.Download</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-xs text-foreground">
          <R.Icons.Trash className="text-danger-strong" />
          <span>Icons.Trash</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-xs text-foreground">
          <R.Icons.Sun className="text-warning-strong" />
          <span>Icons.Sun</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-xs text-foreground">
          <R.Icons.Moon className="text-muted-foreground" />
          <span>Icons.Moon</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-xs text-foreground">
          <R.Icons.Terminal className="text-accent-strong" />
          <span>Icons.Terminal</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-xs text-foreground">
          <R.Icons.Loader spin className="text-accent-strong" />
          <span>Icons.Loader (spin)</span>
        </div>
      </div>,
    ),
  ],
}

function ContextMenuTableExample() {
  return (
    <div className="w-full max-w-md">
      <R.Table aria-label="Files">
        <R.TableBody>
          {["design.fig", "budget.xlsx", "notes.md"].map((file) => (
            <R.ContextMenu asChild key={file} items={[{ label: "Share", icon: <Users size={14} /> }, { label: "Move to…", icon: <Folder size={14} />, disabled: true }, { label: "Delete", destructive: true }]}>
              <R.TableRow tabIndex={0}>
                <R.TableCell>{file}</R.TableCell>
                <R.TableCell className="text-right text-muted-foreground">Right-click</R.TableCell>
              </R.TableRow>
            </R.ContextMenu>
          ))}
        </R.TableBody>
      </R.Table>
    </div>
  )
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

function InlineEditValidationExample() {
  const [email, setEmail] = useState("admin@company.com")
  return (
    <div className="demo-stack items-start">
      <R.InlineEdit
        value={email}
        onSave={setEmail}
        validate={(v) => (!v.includes("@") ? "Must be a valid email" : undefined)}
        placeholder="Enter an email…"
      />
    </div>
  )
}

function InlineEditMultilineExample() {
  const [bio, setBio] = useState("Frontend engineer working on component systems, web performance, and developer tools.")
  return (
    <div className="w-full max-w-md">
      <R.InlineEdit
        multiline
        value={bio}
        onSave={setBio}
        placeholder="Add a bio…"
      />
    </div>
  )
}

function RangeSliderMarksExample() {
  const [hours, setHours] = useState<[number, number]>([9, 17])
  return (
    <div className="w-full max-w-md">
      <R.RangeSlider
        label="Working Hours"
        min={0}
        max={24}
        step={1}
        value={hours}
        onChange={setHours}
        formatValue={(v) => `${v}:00`}
        marks={[
          { value: 0, label: "00:00" },
          { value: 6, label: "06:00" },
          { value: 12, label: "12:00" },
          { value: 18, label: "18:00" },
          { value: 24, label: "24:00" },
        ]}
      />
    </div>
  )
}

function RangeSliderSizesExample() {
  const [val, setVal] = useState<[number, number]>([20, 80])
  return (
    <div className="demo-stack w-full max-w-sm">
      <R.RangeSlider size="sm" value={val} onChange={setVal} label="Small" />
      <R.RangeSlider size="lg" value={val} onChange={setVal} label="Large" />
    </div>
  )
}

function DateTimePicker24hExample() {
  const [date, setDate] = useState<Date | null>(new Date())
  return (
    <div className="w-full max-w-sm">
      <R.DateTimePicker
        label="Server Maintenance Window"
        value={date}
        onChange={setDate}
        is24Hour
        hint="Specified in 24-hour UTC format"
      />
    </div>
  )
}

function DateTimePickerPresetsExample() {
  const [date, setDate] = useState<Date | null>(new Date())
  const presets = [
    { label: "Sprint Planning", getValue: () => new Date(Date.now() + 2 * 3600 * 1000) },
    { label: "Code Freeze", getValue: () => new Date(Date.now() + 24 * 3600 * 1000) },
    { label: "Release Cutoff", getValue: () => new Date(Date.now() + 48 * 3600 * 1000) },
  ]
  return (
    <div className="w-full max-w-sm">
      <R.DateTimePicker
        label="Milestone Deadline"
        value={date}
        onChange={setDate}
        presets={presets}
      />
    </div>
  )
}

function DateTimePickerSizesExample() {
  const [smVal, setSmVal] = useState<Date | null>(new Date())
  const [lgVal, setLgVal] = useState<Date | null>(new Date())
  return (
    <div className="demo-stack w-full max-w-sm">
      <R.DateTimePicker label="Compact size" size="sm" value={smVal} onChange={setSmVal} />
      <R.DateTimePicker label="Large size" size="lg" value={lgVal} onChange={setLgVal} />
    </div>
  )
}

function ColorPickerSwatchesExample() {
  const [color, setColor] = useState("#10b981")
  return (
    <div className="w-full max-w-xs">
      <R.ColorPicker
        label="Badge Color"
        value={color}
        onChange={setColor}
        swatches={["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899"]}
      />
    </div>
  )
}

function ColorPickerEyeDropperExample() {
  const [color, setColor] = useState("#6366f1")
  return (
    <div className="w-full max-w-xs">
      <R.ColorPicker
        label="Accent Color"
        value={color}
        onChange={setColor}
        showEyeDropper
      />
    </div>
  )
}

function ResponsiveDialogFormExample() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  return (
    <R.ResponsiveDialog open={open} onOpenChange={setOpen}>
      <R.ResponsiveDialogTrigger className="inline-flex h-9 items-center justify-center rounded-[var(--radius-md)] bg-accent px-3 text-sm font-semibold text-accent-foreground shadow-xs">
        New Workspace
      </R.ResponsiveDialogTrigger>
      <R.ResponsiveDialogContent title="New Workspace" description="Create a workspace to collaborate with your team.">
        <div className="space-y-4 py-2">
          <R.Input label="Workspace name" placeholder="acme-corp" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <R.ResponsiveDialogFooter>
          <R.ResponsiveDialogClose className="inline-flex h-8 items-center justify-center rounded-[var(--radius-md)] border border-border px-3 text-xs font-medium">
            Cancel
          </R.ResponsiveDialogClose>
          <R.Button size="sm" onClick={() => setOpen(false)}>Create</R.Button>
        </R.ResponsiveDialogFooter>
      </R.ResponsiveDialogContent>
    </R.ResponsiveDialog>
  )
}

function CollapsibleFilterExample() {
  const [open, setOpen] = useState(false)
  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-surface p-4">
      <R.Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Filters & Options</span>
          <R.CollapsibleTrigger className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface-muted">
            {open ? "Less options" : "More options"}
          </R.CollapsibleTrigger>
        </div>
        <R.CollapsibleContent className="space-y-3 pt-4">
          <R.Checkbox label="Show archived items" />
          <R.Checkbox label="Include deleted records" />
          <R.Checkbox label="Send email digest" defaultChecked />
        </R.CollapsibleContent>
      </R.Collapsible>
    </div>
  )
}

function DndHandleExample() {
  const [items, setItems] = useState(["Deploy API", "Update DNS", "Run Migrations"])
  const [done, setDone] = useState<string[]>([])

  const handleDragEnd = ({ activeId, targetDroppableId }: R.DragEndEvent) => {
    if (!targetDroppableId) return
    if (targetDroppableId === "done" && items.includes(activeId)) {
      setItems((prev) => prev.filter((i) => i !== activeId))
      setDone((prev) => [...prev, activeId])
    } else if (targetDroppableId === "todo" && done.includes(activeId)) {
      setDone((prev) => prev.filter((i) => i !== activeId))
      setItems((prev) => [...prev, activeId])
    }
  }

  return (
    <R.DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <R.Droppable id="todo" className="rounded-lg border border-border bg-surface-muted/50 p-3 min-h-[140px] flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">To Do ({items.length})</span>
          {items.map((t) => (
            <R.Draggable key={t} id={t} className="flex items-center justify-between rounded border border-border bg-surface p-2 text-xs shadow-xs">
              <span>{t}</span>
              <R.DragHandle className="rounded p-1 hover:bg-surface-muted text-muted-foreground" aria-label={`Drag ${t}`} />
            </R.Draggable>
          ))}
        </R.Droppable>
        <R.Droppable id="done" className="rounded-lg border border-border bg-surface-muted/50 p-3 min-h-[140px] flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Done ({done.length})</span>
          {done.map((t) => (
            <R.Draggable key={t} id={t} className="flex items-center justify-between rounded border border-border bg-surface p-2 text-xs shadow-xs">
              <span>{t}</span>
              <R.DragHandle className="rounded p-1 hover:bg-surface-muted text-muted-foreground" aria-label={`Drag ${t}`} />
            </R.Draggable>
          ))}
        </R.Droppable>
      </div>
    </R.DndContext>
  )
}

function PanoTourStudioExample() {
  const initialTours: Record<string, R.PanoScene[]> = {
    hermes: [
      {
        id: "hermes-room",
        name: "Hermes Studio Villa",
        description: "Air-conditioned studio-type villa sleeping 5 with queen bed, pull-out double, kitchen, and smart TV with Netflix.",
        image: "/img/resort/360-villas.jpg",
        preview: "/img/resort/360-villas-preview.jpg",
        yaw: 0,
        pitch: 0,
        fov: 75,
        hotspots: [
          { id: "hm-1", type: "scene", yaw: 28, pitch: -4, target: "hermes-pool", label: "Step out to Poolside", icon: "waves", pulse: true },
          { id: "hm-2", type: "info", yaw: -75, pitch: 5, label: "Queen bed + pull-out double & extra single bed (sleeps 5)", icon: "bed" },
          { id: "hm-3", type: "media", yaw: 115, pitch: 8, icon: "image", media: { kind: "image", src: "/img/resort/card-villas.jpg", caption: "Hermes, Athena & Zeus Villa Row" } },
          { id: "hm-4", type: "action", yaw: -140, pitch: -12, action: "book", label: "Book Hermes Villa · ₱4,500", icon: "calendar" },
        ],
      },
      {
        id: "hermes-pool",
        name: "Shared Pool & Grill Station",
        description: "Swimming pool, kids playground, basketball court, and grill station shared by villa guests.",
        image: "/img/resort/360-pool.jpg",
        preview: "/img/resort/360-pool-preview.jpg",
        yaw: 15,
        pitch: 0,
        fov: 75,
        hotspots: [
          { id: "hm-5", type: "scene", yaw: -35, pitch: -4, target: "hermes-room", label: "Back to Hermes Villa", icon: "door-open" },
        ],
      },
    ],
    apollo: [
      {
        id: "apollo-house",
        name: "Apollo Private House & 4ft Pool",
        description: "Whole private house with its own 4-foot pool, 4 air-conditioned bedrooms (sleeps 13), kitchen, and soundproof videoke room.",
        image: "/img/resort/360-apollo.jpg",
        preview: "/img/resort/360-apollo-preview.jpg",
        yaw: 0,
        pitch: 0,
        fov: 75,
        hotspots: [
          { id: "ap-1", type: "scene", yaw: 32, pitch: -4, target: "apollo-grounds", label: "Resort Grounds & Parking", icon: "trees" },
          { id: "ap-2", type: "info", yaw: -70, pitch: 4, label: "4 AC rooms (13 pax) + soundproof videoke room & private 4ft pool", icon: "sparkles" },
          { id: "ap-3", type: "action", yaw: 130, pitch: -10, action: "book", label: "Book Apollo House · ₱14,500 / 22h", icon: "calendar", pulse: true },
        ],
      },
      {
        id: "apollo-grounds",
        name: "Private Carport & Grounds",
        description: "2 to 3 private carports and direct access to the basketball court and resort grounds.",
        image: "/img/resort/360-grounds.jpg",
        preview: "/img/resort/360-grounds-preview.jpg",
        yaw: 0,
        pitch: 0,
        fov: 75,
        hotspots: [
          { id: "ap-4", type: "scene", yaw: 0, pitch: -4, target: "apollo-house", label: "Apollo Private House", icon: "door-open" },
        ],
      },
    ],
    olympus: [
      {
        id: "olympus-hall",
        name: "Olympus Function Hall",
        description: "Air-conditioned function hall for 60 to 70 seated guests with small lobby, cold kitchen, and wireless mics.",
        image: "/img/resort/360-olympus.jpg",
        preview: "/img/resort/360-olympus-preview.jpg",
        yaw: 0,
        pitch: 0,
        fov: 75,
        hotspots: [
          { id: "ol-1", type: "scene", yaw: 30, pitch: -4, target: "poseidon-pool", label: "Poseidon’s Realm Pool & Pavilions", icon: "waves", pulse: true },
          { id: "ol-2", type: "info", yaw: -65, pitch: 6, label: "Includes 100 infinity chairs, 15–20 tables & 2-hr early catering ingress", icon: "utensils" },
        ],
      },
      {
        id: "poseidon-pool",
        name: "Poseidon’s Realm & Pavilions",
        description: "Complimentary access to the main pool and all four pavilions: Poseidon, Hestia, Nemea, and Selene.",
        image: "/img/resort/360-poseidon.jpg",
        preview: "/img/resort/360-poseidon-preview.jpg",
        yaw: 0,
        pitch: 0,
        fov: 75,
        hotspots: [
          { id: "ol-3", type: "scene", yaw: -30, pitch: -4, target: "olympus-hall", label: "Inside Olympus Hall", icon: "door-open" },
        ],
      },
    ],
    artemis: [
      {
        id: "artemis-main",
        name: "Artemis Private House",
        description: "Whole private house with 4 AC rooms, private 4-foot pool, full kitchen, and videoke room.",
        image: "/img/resort/360-artemis.jpg",
        preview: "/img/resort/360-artemis-preview.jpg",
        yaw: 0,
        pitch: 0,
        fov: 75,
        hotspots: [],
      },
    ],
    athena: [],
    zeus: [],
  }

  const [toursByPlace, setToursByPlace] = useState<Record<string, R.PanoScene[]>>(initialTours)
  const [placeId, setPlaceId] = useState("hermes")
  const [featuredId, setFeaturedId] = useState<string | number | null>("hermes-room")

  const places: R.PanoPlaceItem[] = [
    { id: "hermes", name: "Hermes Villa", category: "Villas", scenesCount: (toursByPlace.hermes ?? []).length },
    { id: "athena", name: "Athena Villa", category: "Villas", scenesCount: (toursByPlace.athena ?? []).length },
    { id: "zeus", name: "Zeus Villa (Sleeps 8)", category: "Villas", scenesCount: (toursByPlace.zeus ?? []).length },
    { id: "apollo", name: "Apollo Private House", category: "Private Houses", scenesCount: (toursByPlace.apollo ?? []).length },
    { id: "artemis", name: "Artemis Private House", category: "Private Houses", scenesCount: (toursByPlace.artemis ?? []).length },
    { id: "olympus", name: "Olympus Function Hall", category: "Events & Venues", scenesCount: (toursByPlace.olympus ?? []).length },
  ]

  const currentScenes = toursByPlace[placeId] ?? []

  return (
    <div className="w-full min-w-0">
      <R.PanoTourEditor
        places={places}
        selectedPlaceId={placeId}
        onSelectPlace={setPlaceId}
        scenes={currentScenes}
        onScenesChange={(next) => setToursByPlace((prev) => ({ ...prev, [placeId]: next }))}
        featuredSceneId={featuredId}
        onFeaturedSceneChange={setFeaturedId}
        onCopyTour={(targetIds, mode) => {
          setToursByPlace((prev) => {
            const copy = { ...prev }
            for (const id of targetIds) {
              const cloned = currentScenes.map((s) => ({ ...s, id: `${id}-${s.id}` }))
              copy[id] = mode === "replace" ? cloned : [...(copy[id] ?? []), ...cloned]
            }
            return copy
          })
        }}
      />
    </div>
  )
}

function PanoBackdropExample() {
  const heroScene: R.PanoScene = {
    id: "aerial-grounds",
    name: "Resort Grounds & Pool Deck",
    description: "Outdoor garden and poolside view of Happy Homes Candelaria in Quezon.",
    image: "/img/resort/360-grounds.jpg",
    preview: "/img/resort/360-grounds-preview.jpg",
    yaw: 0,
    pitch: -3,
    fov: 65,
    hotspots: [
      { id: "g1", type: "info", yaw: 24, pitch: -6, label: "Ceremony & reception grounds for up to 150 guests", icon: "trees" },
    ],
  }

  const properties = [
    {
      id: "hermes",
      name: "Hermes Studio Villa",
      kind: "Studio Villa · Sleeps 5",
      price: "₱4,500 / day · ₱9,500 / 22 hrs",
      photo: "/img/resort/card-villas.jpg",
      blurb: "Queen bed with pull-out double & single bed, kitchen, heated bath, smart TV with Netflix, and shared pool.",
      scenes: [
        {
          id: "v1",
          name: "Hermes Studio Villa",
          description: "Air-conditioned studio villa with kitchen, Netflix TV, and shared pool access.",
          image: "/img/resort/360-villas.jpg",
          preview: "/img/resort/360-villas-preview.jpg",
          yaw: 0,
          pitch: 0,
          fov: 75,
          hotspots: [
            { id: "vh1", type: "info", yaw: -25, pitch: -6, label: "Queen bed + pull-out double & extra single", icon: "bed" },
            { id: "vh2", type: "action", yaw: 35, pitch: -12, action: "book", label: "Book Hermes Villa", icon: "calendar" },
          ],
        },
      ] as R.PanoScene[],
    },
    {
      id: "apollo",
      name: "Apollo Private House",
      kind: "Private House · Sleeps 13",
      price: "₱14,500 / 22 hrs (up to 20 pax)",
      photo: "/img/resort/card-apollo.jpg",
      blurb: "Whole house with its own private 4-ft swimming pool, 4 air-conditioned rooms, full kitchen, and soundproof videoke room.",
      scenes: [
        {
          id: "a1",
          name: "Apollo Private House & Pool",
          description: "Private house with 4 AC bedrooms, 4-foot pool, and soundproof videoke room.",
          image: "/img/resort/360-apollo.jpg",
          preview: "/img/resort/360-apollo-preview.jpg",
          yaw: 0,
          pitch: 0,
          fov: 75,
          hotspots: [
            { id: "ah1", type: "info", yaw: -20, pitch: -5, label: "Private 4-ft pool & 2–3 carports", icon: "waves" },
          ],
        },
      ] as R.PanoScene[],
    },
    {
      id: "olympus",
      name: "Olympus Function Hall",
      kind: "Function Hall · 60–70 Seated",
      price: "₱14,500 Day · ₱15,500 Night",
      photo: "/img/resort/card-olympus.jpg",
      blurb: "Air-conditioned event hall with lobby, cold kitchen, 100 infinity chairs, Bluetooth sound system, and all 4 pool pavilions.",
      scenes: [
        {
          id: "o1",
          name: "Olympus Function Hall",
          description: "Air-conditioned hall with 100 infinity chairs, tables, and complimentary pool & pavilions.",
          image: "/img/resort/360-olympus.jpg",
          preview: "/img/resort/360-olympus-preview.jpg",
          yaw: 0,
          pitch: 0,
          fov: 75,
          hotspots: [
            { id: "oh1", type: "info", yaw: 18, pitch: -4, label: "60–70 seated capacity + cold kitchen", icon: "sparkles" },
          ],
        },
      ] as R.PanoScene[],
    },
  ]

  return (
    <div className="w-full space-y-4">
      <R.PanoBackdrop
        scene={heroScene}
        title="Happy Homes Candelaria"
        fallbackPhoto="/img/resort/card-grounds.jpg"
        triggerLabel="Look around: Resort Grounds, Happy Homes Candelaria"
        className="h-72 w-full rounded-xl border border-border shadow-sm sm:h-80 md:h-96"
      >
        <div className="relative z-10 flex h-full flex-col justify-end bg-gradient-to-t from-black/80 via-black/25 to-transparent p-5 text-white">
          <p className="text-xs font-semibold tracking-wider text-white/80 uppercase">Candelaria, Quezon · Villas, Private Houses & Event Halls</p>
          <h4 className="text-xl font-bold">Happy Homes Candelaria Resort</h4>
        </div>
      </R.PanoBackdrop>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3">
        {properties.map((p) => (
          <div key={p.id} className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-xs">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
              <R.PanoViewer
                scene={{ ...p.scenes[0], hotspots: [] }}
                autoRotate={1.4}
                showCompass={false}
                className="size-full"
              />
              <R.PanoTourButton
                title={p.name}
                scenes={p.scenes}
                variant="chip"
                className="absolute top-2.5 right-2.5 z-20"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-2 p-3.5">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-accent-strong uppercase">{p.kind}</span>
                <h5 className="text-sm font-semibold text-foreground">{p.name}</h5>
                <p className="line-clamp-2 text-xs text-muted-foreground">{p.blurb}</p>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2.5">
                <span className="text-xs font-semibold text-foreground">{p.price}</span>
                <R.PanoTourButton
                  title={p.name}
                  scenes={p.scenes}
                  variant="link"
                  label="Virtual tour"
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
