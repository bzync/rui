"use client"

/* Lazy documentation registry of live JSX factories, not a Fast Refresh boundary. */
/* eslint-disable react-refresh/only-export-components */

/*
  Every example's `code` is the exact component rendered in `preview` — same
  props, same state, same handlers — so what a reader copies behaves exactly
  like what they just clicked. Keep the two in lockstep when editing.
*/

import * as R from "@bzync/rui"
import {
  Archive,
  ArrowRight,
  Bell,
  Bold,
  Copy,
  CreditCard,
  Download,
  Inbox,
  Italic,
  Link2,
  LogOut,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Trash2,
  Underline,
  User,
} from "lucide-react"
import { type ReactNode, useEffect, useState } from "react"

export interface ComponentExample {
  id: string
  title: string
  description: string
  code: string
  preview: ReactNode
  align?: "center" | "start"
}

const ex = (id: string, title: string, description: string, code: string, preview: ReactNode, align?: "center" | "start"): ComponentExample =>
  ({ id, title, description, code, preview, align })

// ─── Actions ────────────────────────────────────────────────────────────────

function ButtonLoadingExample() {
  const [saving, setSaving] = useState(false)
  function save() {
    setSaving(true)
    window.setTimeout(() => setSaving(false), 1500)
  }
  return <R.Button loading={saving} onClick={save}>{saving ? "Saving…" : "Save changes"}</R.Button>
}

function ToggleControlledExample() {
  const [muted, setMuted] = useState(false)
  return (
    <div className="demo-row">
      <R.Toggle pressed={muted} onPressedChange={setMuted} variant="outline" aria-label="Mute notifications" size="icon">
        <Bell size={16} aria-hidden="true" />
      </R.Toggle>
      <span className="text-sm text-muted-foreground" role="status">{muted ? "Notifications muted" : "Notifications on"}</span>
    </div>
  )
}

function ToggleGroupSingleExample() {
  const [view, setView] = useState("week")
  return (
    <div className="demo-stack items-center">
      <R.ToggleGroup type="single" value={view} onValueChange={(next) => next && setView(next)} variant="outline" aria-label="Calendar view">
        <R.ToggleGroupItem value="day">Day</R.ToggleGroupItem>
        <R.ToggleGroupItem value="week">Week</R.ToggleGroupItem>
        <R.ToggleGroupItem value="month">Month</R.ToggleGroupItem>
      </R.ToggleGroup>
      <span className="text-sm text-muted-foreground" role="status">{`Showing ${view} view`}</span>
    </div>
  )
}

// ─── Forms ──────────────────────────────────────────────────────────────────

function InputValidationExample() {
  const [email, setEmail] = useState("ops@")
  const error = email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? "Enter a valid email address." : undefined
  return (
    <R.Input
      label="Work email"
      type="email"
      value={email}
      onChange={(event) => setEmail(event.target.value)}
      error={error}
      hint="We send deployment alerts here."
      prefix={<Mail size={15} aria-hidden="true" />}
      wrapperClassName="w-full max-w-sm"
    />
  )
}

function TextareaCounterExample() {
  const [notes, setNotes] = useState("")
  const limit = 280
  return (
    <R.Textarea
      label="Release notes"
      value={notes}
      onChange={(event) => setNotes(event.target.value.slice(0, limit))}
      rows={4}
      placeholder="Summarize customer-visible changes…"
      hint={`${notes.length}/${limit} characters`}
      error={notes.length >= limit ? "You have reached the character limit." : undefined}
      wrapperClassName="w-full max-w-lg"
    />
  )
}

function SelectMultipleExample() {
  const [regions, setRegions] = useState(["iad1", "fra1"])
  return (
    <div className="demo-stack w-full max-w-sm">
      <R.Select
        multiple
        label="Deploy regions"
        value={regions}
        onChange={setRegions}
        clearable
        placeholder="Choose regions"
        options={[
          { group: "Americas", options: [
            { value: "iad1", label: "US East", description: "Washington, D.C." },
            { value: "sfo1", label: "US West", description: "San Francisco" },
          ] },
          { group: "Europe", options: [
            { value: "fra1", label: "EU Central", description: "Frankfurt" },
            { value: "lhr1", label: "EU West", description: "London", disabled: true },
          ] },
        ]}
      />
      <span className="text-sm text-muted-foreground" role="status">{`${regions.length} selected: ${regions.join(", ") || "none"}`}</span>
    </div>
  )
}

function AutocompleteMultipleExample() {
  const [reviewers, setReviewers] = useState<string[]>(["maya"])
  return (
    <div className="w-full max-w-sm">
      <R.Autocomplete<string>
        multiple
        label="Reviewers"
        placeholder="Search teammates…"
        value={reviewers}
        onSelect={(_, all) => setReviewers(all.map((option) => option.value))}
        options={[
          { value: "maya", label: "Maya Chen", description: "Platform" },
          { value: "jordan", label: "Jordan Kim", description: "Security" },
          { value: "sam", label: "Sam Rivera", description: "Frontend" },
          { value: "ari", label: "Ari Patel", description: "Data" },
        ]}
        hint="Each reviewer is notified when the deploy is ready."
      />
    </div>
  )
}

function CheckboxSelectAllExample() {
  const all = ["Deployments", "Billing", "Security"]
  const [checked, setChecked] = useState(["Deployments"])
  const allChecked = checked.length === all.length
  return (
    <div className="demo-stack">
      <R.Checkbox
        label="All notifications"
        checked={allChecked}
        indeterminate={checked.length > 0 && !allChecked}
        onChange={() => setChecked(allChecked ? [] : all)}
      />
      <div className="demo-stack pl-6">
        {all.map((item) => (
          <R.Checkbox
            key={item}
            label={item}
            checked={checked.includes(item)}
            onChange={(event) => setChecked(event.target.checked ? [...checked, item] : checked.filter((value) => value !== item))}
          />
        ))}
      </div>
    </div>
  )
}

function SwitchSettingsExample() {
  const [settings, setSettings] = useState({ previews: true, autoDeploy: false })
  return (
    <R.Card className="w-full max-w-md">
      <R.CardBody className="demo-stack">
        <R.Switch
          label="Preview deployments"
          description="Build every pull request to a unique URL."
          checked={settings.previews}
          onCheckedChange={(previews) => setSettings({ ...settings, previews })}
        />
        <R.Switch
          label="Auto-deploy main"
          description="Promote to production when checks pass."
          checked={settings.autoDeploy}
          onCheckedChange={(autoDeploy) => setSettings({ ...settings, autoDeploy })}
        />
      </R.CardBody>
    </R.Card>
  )
}

function RadioHorizontalExample() {
  const [plan, setPlan] = useState("pro")
  return (
    <R.RadioGroup label="Plan" orientation="horizontal" value={plan} onChange={setPlan} hint="You can change plans at any time.">
      <R.Radio value="hobby" label="Hobby" />
      <R.Radio value="pro" label="Pro" />
      <R.Radio value="enterprise" label="Enterprise" disabled />
    </R.RadioGroup>
  )
}

function SliderControlledExample() {
  const [cpu, setCpu] = useState(2)
  return (
    <div className="demo-stack w-full max-w-sm">
      <R.Slider label="vCPUs" min={1} max={16} step={1} value={cpu} onChange={(event) => setCpu(Number(event.target.value))} formatValue={(value) => `${value} vCPU`} />
      <span className="text-sm text-muted-foreground" role="status">{`Estimated cost: $${(cpu * 12).toFixed(2)}/month`}</span>
    </div>
  )
}

// ─── Display ────────────────────────────────────────────────────────────────

// ─── Feedback ───────────────────────────────────────────────────────────────

function AlertDismissExample() {
  const [visible, setVisible] = useState(true)
  return visible ? (
    <R.Alert className="w-full max-w-lg" variant="info" title="Scheduled maintenance" dismissable onDismiss={() => setVisible(false)}>
      The dashboard will be read-only on Sunday from 02:00 to 03:00 UTC.
    </R.Alert>
  ) : (
    <R.Button variant="secondary" onClick={() => setVisible(true)}>Show alert again</R.Button>
  )
}

function ProgressUploadExample() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (progress === 0 || progress >= 100) return
    const timer = window.setTimeout(() => setProgress((value) => Math.min(100, value + 10)), 200)
    return () => window.clearTimeout(timer)
  }, [progress])
  return (
    <div className="demo-stack w-full max-w-sm">
      <R.Progressbar value={progress} label="Uploading build artifacts" showValue variant={progress >= 100 ? "success" : "default"} />
      <R.Button size="sm" variant="secondary" className="justify-self-start" onClick={() => setProgress(10)} disabled={progress > 0 && progress < 100}>
        {progress >= 100 ? "Upload again" : "Start upload"}
      </R.Button>
    </div>
  )
}

function SkeletonLoadingExample() {
  const [loading, setLoading] = useState(true)
  return (
    <div className="demo-stack w-full max-w-sm">
      <R.Card aria-busy={loading}>
        <R.CardBody className="flex items-center gap-3">
          {loading ? <R.Skeleton className="size-10" rounded="full" /> : <R.Avatar name="Maya Chen" />}
          <div className="flex-1 space-y-2">
            {loading ? <><R.Skeleton className="h-3.5 w-32" /><R.Skeleton className="h-3 w-48" /></> : <><p className="text-sm font-medium">Maya Chen</p><p className="text-sm text-muted-foreground">Deployed api-gateway 2m ago</p></>}
          </div>
        </R.CardBody>
      </R.Card>
      <R.Switch label="Loading" checked={loading} onCheckedChange={setLoading} />
    </div>
  )
}

// ─── Overlays ───────────────────────────────────────────────────────────────

function ModalFormExample() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [created, setCreated] = useState<string | null>(null)
  function submit(event: React.FormEvent) {
    event.preventDefault()
    setCreated(name)
    setOpen(false)
    setName("")
  }
  return (
    <div className="demo-stack items-center">
      <R.Button icon={<Plus size={15} aria-hidden="true" />} onClick={() => setOpen(true)}>New project</R.Button>
      {created && <span className="text-sm text-muted-foreground" role="status">{`Created “${created}”`}</span>}
      <R.Modal open={open} onClose={() => setOpen(false)} title="Create project" description="Projects group deployments, domains and environment variables.">
        <form className="demo-stack" onSubmit={submit}>
          <R.Input label="Project name" value={name} onChange={(event) => setName(event.target.value)} placeholder="api-gateway" required autoFocus />
          <div className="demo-actions">
            <R.Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</R.Button>
            <R.Button type="submit" disabled={!name.trim()}>Create project</R.Button>
          </div>
        </form>
      </R.Modal>
    </div>
  )
}

function ModalSizesExample() {
  const [size, setSize] = useState<"sm" | "lg" | "xl" | null>(null)
  return (
    <div className="demo-row">
      {(["sm", "lg", "xl"] as const).map((value) => (
        <R.Button key={value} variant="secondary" onClick={() => setSize(value)}>{`Open ${value}`}</R.Button>
      ))}
      <R.Modal open={size !== null} onClose={() => setSize(null)} size={size ?? "md"} title={`Modal size “${size}”`} description="Width is capped by the size token and always fits the viewport.">
        <p className="text-sm leading-6 text-muted-foreground">Use sm for confirmations, md for short forms and lg or xl for richer content such as tables or previews.</p>
      </R.Modal>
    </div>
  )
}

function DrawerPositionsExample() {
  const [position, setPosition] = useState<"left" | "right" | "bottom" | null>(null)
  return (
    <div className="demo-row">
      {(["left", "right", "bottom"] as const).map((value) => (
        <R.Button key={value} variant="secondary" onClick={() => setPosition(value)}>{`Open ${value}`}</R.Button>
      ))}
      <R.Drawer open={position !== null} onClose={() => setPosition(null)} position={position ?? "right"} title="Filters">
        <div className="demo-stack p-5">
          <R.Checkbox label="Healthy" defaultChecked />
          <R.Checkbox label="Building" />
          <R.Checkbox label="Failed" />
          <R.Button className="justify-self-start" onClick={() => setPosition(null)}>Apply filters</R.Button>
        </div>
      </R.Drawer>
    </div>
  )
}

function PopoverControlledExample() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [invited, setInvited] = useState<string[]>([])
  return (
    <div className="demo-stack items-center">
      <R.Popover open={open} onOpenChange={setOpen} trigger={<R.Button icon={<User size={15} aria-hidden="true" />}>Invite member</R.Button>}>
        <R.PopoverContent className="w-72">
          <form className="demo-stack" onSubmit={(event) => { event.preventDefault(); setInvited([...invited, email]); setEmail(""); setOpen(false) }}>
            <R.Input label="Email" type="email" size="sm" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <R.Button type="submit" size="sm" disabled={!email}>Send invite</R.Button>
          </form>
        </R.PopoverContent>
      </R.Popover>
      <span className="text-sm text-muted-foreground" role="status">{invited.length ? `Invited: ${invited.join(", ")}` : "No invites sent"}</span>
    </div>
  )
}

function ConfirmAsyncExample() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [archived, setArchived] = useState(false)
  function confirm() {
    setLoading(true)
    window.setTimeout(() => { setLoading(false); setOpen(false); setArchived(true) }, 1200)
  }
  return (
    <div className="demo-stack items-center">
      <R.Button variant="secondary" icon={<Archive size={15} aria-hidden="true" />} onClick={() => setOpen(true)} disabled={archived}>{archived ? "Archived" : "Archive project"}</R.Button>
      <R.ConfirmDialog open={open} onClose={() => setOpen(false)} onConfirm={confirm} loading={loading} title="Archive this project?" description="Deployments stop serving traffic. You can restore it within 30 days." confirmLabel="Archive" />
    </div>
  )
}

// ─── Navigation ─────────────────────────────────────────────────────────────

function TabsControlledExample() {
  const [tab, setTab] = useState("account")
  return (
    <div className="demo-stack w-full max-w-lg">
      <R.Tabs defaultValue="account" value={tab} onValueChange={setTab}>
        <R.TabsList>
          <R.TabsTrigger value="account" icon={<User size={14} aria-hidden="true" />}>Account</R.TabsTrigger>
          <R.TabsTrigger value="billing" icon={<CreditCard size={14} aria-hidden="true" />}>Billing</R.TabsTrigger>
          <R.TabsTrigger value="settings" icon={<Settings size={14} aria-hidden="true" />}>Settings</R.TabsTrigger>
        </R.TabsList>
        <R.TabsContent value="account"><p className="demo-panel-copy">Update your name, avatar and contact email.</p></R.TabsContent>
        <R.TabsContent value="billing"><p className="demo-panel-copy">Manage invoices and payment methods.</p></R.TabsContent>
        <R.TabsContent value="settings"><p className="demo-panel-copy">Configure workspace defaults.</p></R.TabsContent>
      </R.Tabs>
      <R.Button size="sm" variant="ghost" className="justify-self-start" icon={<ArrowRight size={14} aria-hidden="true" />} iconPosition="right" onClick={() => setTab("billing")}>Go to billing</R.Button>
    </div>
  )
}

function PaginationTableExample() {
  const rows = Array.from({ length: 23 }, (_, index) => `Deployment #${1000 - index}`)
  const pageSize = 5
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(rows.length / pageSize)
  return (
    <div className="demo-stack w-full max-w-md">
      <R.List>
        {rows.slice((page - 1) * pageSize, page * pageSize).map((row) => <R.ListItem key={row}>{row}</R.ListItem>)}
      </R.List>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-muted-foreground">{`Page ${page} of ${totalPages}`}</span>
        <R.Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  )
}

function StepperWizardExample() {
  const steps = [{ label: "Repository", description: "Connect Git" }, { label: "Configure", description: "Build settings" }, { label: "Deploy", description: "Go live" }]
  const [current, setCurrent] = useState(0)
  return (
    <div className="demo-stack w-full max-w-lg">
      <R.Stepper steps={steps} current={current} />
      <div className="demo-actions">
        <R.Button variant="secondary" disabled={current === 0} onClick={() => setCurrent(current - 1)}>Back</R.Button>
        <R.Button disabled={current === steps.length - 1} onClick={() => setCurrent(current + 1)}>Continue</R.Button>
      </div>
    </div>
  )
}

function SnackbarActionsExample() {
  const { show } = R.useSnackbar()
  return (
    <div className="demo-row">
      <R.Button variant="secondary" onClick={() => show({ message: "Changes saved.", variant: "success" })}>Success</R.Button>
      <R.Button variant="secondary" onClick={() => show({ message: "Payment method expires soon.", variant: "warning" })}>Warning</R.Button>
      <R.Button variant="secondary" onClick={() => show({ message: "Deployment failed. Check build logs.", variant: "error" })}>Error</R.Button>
      <R.Button variant="secondary" onClick={() => show({ message: "Syncing in the background…", variant: "info" })}>Info</R.Button>
    </div>
  )
}

// ─── Registry ───────────────────────────────────────────────────────────────

export const componentExamples: Record<string, () => ComponentExample[]> = {
  "components/button": () => [
    ex("variants", "Variants", "Use one primary action per view; secondary and outline for alternatives, ghost for low-emphasis actions and danger for destructive ones.",
      `<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="link">Link</Button>`,
      <div className="demo-row"><R.Button>Primary</R.Button><R.Button variant="secondary">Secondary</R.Button><R.Button variant="outline">Outline</R.Button><R.Button variant="ghost">Ghost</R.Button><R.Button variant="danger">Danger</R.Button><R.Button variant="link">Link</R.Button></div>),
    ex("sizes", "Sizes", "sm for dense toolbars and tables, md as the default, lg for prominent calls to action. Icon buttons need an aria-label.",
      `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="icon" variant="secondary" aria-label="Settings">
  <Settings size={16} />
</Button>`,
      <div className="demo-row"><R.Button size="sm">Small</R.Button><R.Button size="md">Medium</R.Button><R.Button size="lg">Large</R.Button><R.Button size="icon" variant="secondary" aria-label="Settings"><Settings size={16} /></R.Button></div>),
    ex("icons", "With icons", "Pass any icon to icon; iconPosition moves it after the label.",
      `<Button icon={<Plus size={15} />}>New project</Button>
<Button variant="secondary" icon={<Download size={15} />}>Export CSV</Button>
<Button variant="ghost" icon={<ArrowRight size={15} />} iconPosition="right">
  Continue
</Button>`,
      <div className="demo-row"><R.Button icon={<Plus size={15} />}>New project</R.Button><R.Button variant="secondary" icon={<Download size={15} />}>Export CSV</R.Button><R.Button variant="ghost" icon={<ArrowRight size={15} />} iconPosition="right">Continue</R.Button></div>),
    ex("loading", "Loading state", "loading disables the button, sets aria-busy and shows a spinner. Click to try it.",
      `function SaveButton() {
  const [saving, setSaving] = useState(false)
  function save() {
    setSaving(true)
    window.setTimeout(() => setSaving(false), 1500)
  }
  return (
    <Button loading={saving} onClick={save}>
      {saving ? "Saving…" : "Save changes"}
    </Button>
  )
}`,
      <ButtonLoadingExample />),
    ex("as-child", "As a link", "asChild renders the button styles onto your own element, such as a router link, keeping native link semantics.",
      `<Button asChild>
  <a href="#/docs/installation">Get started</a>
</Button>
<Button asChild variant="secondary">
  <a href="https://github.com/bzync/rui" target="_blank" rel="noreferrer">
    GitHub
  </a>
</Button>`,
      <div className="demo-row"><R.Button asChild><a href="#/docs/installation">Get started</a></R.Button><R.Button asChild variant="secondary"><a href="https://github.com/bzync/rui" target="_blank" rel="noreferrer">GitHub</a></R.Button></div>),
    ex("disabled", "Disabled", "Native disabled state for every variant.",
      `<Button disabled>Primary</Button>
<Button variant="secondary" disabled>Secondary</Button>
<Button variant="danger" disabled>Danger</Button>`,
      <div className="demo-row"><R.Button disabled>Primary</R.Button><R.Button variant="secondary" disabled>Secondary</R.Button><R.Button variant="danger" disabled>Danger</R.Button></div>),
  ],

  "components/button-group": () => [
    ex("toolbar", "Icon toolbar", "Compact related icon actions; every icon button keeps its own accessible name.",
      `<ButtonGroup aria-label="Clipboard actions">
  <Button variant="secondary" size="icon" aria-label="Copy"><Copy size={15} /></Button>
  <Button variant="secondary" size="icon" aria-label="Share link"><Link2 size={15} /></Button>
  <Button variant="secondary" size="icon" aria-label="Delete"><Trash2 size={15} /></Button>
</ButtonGroup>`,
      <R.ButtonGroup aria-label="Clipboard actions"><R.Button variant="secondary" size="icon" aria-label="Copy"><Copy size={15} /></R.Button><R.Button variant="secondary" size="icon" aria-label="Share link"><Link2 size={15} /></R.Button><R.Button variant="secondary" size="icon" aria-label="Delete"><Trash2 size={15} /></R.Button></R.ButtonGroup>),
    ex("vertical", "Vertical", "orientation=\"vertical\" stacks the actions.",
      `<ButtonGroup orientation="vertical" aria-label="Sort order">
  <Button variant="secondary">Newest first</Button>
  <Button variant="secondary">Oldest first</Button>
  <Button variant="secondary">Name A–Z</Button>
</ButtonGroup>`,
      <R.ButtonGroup orientation="vertical" aria-label="Sort order"><R.Button variant="secondary">Newest first</R.Button><R.Button variant="secondary">Oldest first</R.Button><R.Button variant="secondary">Name A–Z</R.Button></R.ButtonGroup>),
  ],

  "components/toggle": () => [
    ex("controlled", "Controlled", "Drive pressed from state and react to onPressedChange.",
      `function MuteToggle() {
  const [muted, setMuted] = useState(false)
  return (
    <>
      <Toggle
        pressed={muted}
        onPressedChange={setMuted}
        variant="outline"
        size="icon"
        aria-label="Mute notifications"
      >
        <Bell size={16} />
      </Toggle>
      <span role="status">{muted ? "Notifications muted" : "Notifications on"}</span>
    </>
  )
}`,
      <ToggleControlledExample />),
    ex("sizes", "Sizes and variants", "default and outline variants in every size.",
      `<Toggle size="sm" aria-label="Bold"><Bold size={14} /></Toggle>
<Toggle size="md" aria-label="Italic"><Italic size={15} /></Toggle>
<Toggle size="lg" variant="outline" aria-label="Underline"><Underline size={16} /></Toggle>`,
      <div className="demo-row"><R.Toggle size="sm" aria-label="Bold"><Bold size={14} /></R.Toggle><R.Toggle size="md" aria-label="Italic"><Italic size={15} /></R.Toggle><R.Toggle size="lg" variant="outline" aria-label="Underline"><Underline size={16} /></R.Toggle></div>),
  ],

  "components/toggle-group": () => [
    ex("single", "Single selection", "type=\"single\" behaves like a segmented control.",
      `function CalendarView() {
  const [view, setView] = useState("week")
  return (
    <>
      <ToggleGroup
        type="single"
        value={view}
        onValueChange={(next) => next && setView(next)}
        variant="outline"
        aria-label="Calendar view"
      >
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
      </ToggleGroup>
      <span role="status">{\`Showing \${view} view\`}</span>
    </>
  )
}`,
      <ToggleGroupSingleExample />),
    ex("icons", "Formatting toolbar", "type=\"multiple\" with icon-only items.",
      `<ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Text formatting">
  <ToggleGroupItem value="bold" size="icon" aria-label="Bold"><Bold size={15} /></ToggleGroupItem>
  <ToggleGroupItem value="italic" size="icon" aria-label="Italic"><Italic size={15} /></ToggleGroupItem>
  <ToggleGroupItem value="underline" size="icon" aria-label="Underline"><Underline size={15} /></ToggleGroupItem>
</ToggleGroup>`,
      <R.ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Text formatting"><R.ToggleGroupItem value="bold" size="icon" aria-label="Bold"><Bold size={15} /></R.ToggleGroupItem><R.ToggleGroupItem value="italic" size="icon" aria-label="Italic"><Italic size={15} /></R.ToggleGroupItem><R.ToggleGroupItem value="underline" size="icon" aria-label="Underline"><Underline size={15} /></R.ToggleGroupItem></R.ToggleGroup>),
  ],

  "components/input": () => [
    ex("validation", "Live validation", "Derive error from state; it sets aria-invalid and replaces the hint. Fix the address to clear it.",
      `function EmailField() {
  const [email, setEmail] = useState("ops@")
  const error = email && !/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email)
    ? "Enter a valid email address."
    : undefined
  return (
    <Input
      label="Work email"
      type="email"
      value={email}
      onChange={(event) => setEmail(event.target.value)}
      error={error}
      hint="We send deployment alerts here."
      prefix={<Mail size={15} />}
    />
  )
}`,
      <InputValidationExample />),
    ex("affixes", "Prefix and suffix", "Icons, units or static text inside the field.",
      `<Input label="Search" placeholder="Search projects…" prefix={<Search size={15} />} />
<Input label="Subdomain" defaultValue="atlas" suffix=".bzync.app" />
<Input label="Budget" type="number" defaultValue="250" prefix="$" suffix="USD" />`,
      <div className="demo-form-grid"><R.Input label="Search" placeholder="Search projects…" prefix={<Search size={15} />} /><R.Input label="Subdomain" defaultValue="atlas" suffix=".bzync.app" /><R.Input label="Budget" type="number" defaultValue="250" prefix="$" suffix="USD" /></div>),
    ex("sizes", "Sizes", "Match field density to the surrounding layout.",
      `<Input size="sm" placeholder="Small" aria-label="Small input" />
<Input size="md" placeholder="Medium" aria-label="Medium input" />
<Input size="lg" placeholder="Large" aria-label="Large input" />`,
      <div className="demo-stack w-full max-w-sm"><R.Input size="sm" placeholder="Small" aria-label="Small input" /><R.Input size="md" placeholder="Medium" aria-label="Medium input" /><R.Input size="lg" placeholder="Large" aria-label="Large input" /></div>),
    ex("states", "States", "Required, disabled and read-only fields.",
      `<Input label="Project name" required placeholder="api-gateway" />
<Input label="Region" disabled defaultValue="us-east-1" />
<Input label="Project ID" readOnly defaultValue="prj_8f2a91c" />`,
      <div className="demo-form-grid"><R.Input label="Project name" required placeholder="api-gateway" /><R.Input label="Region" disabled defaultValue="us-east-1" /><R.Input label="Project ID" readOnly defaultValue="prj_8f2a91c" /></div>),
  ],

  "components/textarea": () => [
    ex("counter", "Character limit", "Show a live count in the hint and switch to an error at the limit.",
      `function ReleaseNotes() {
  const [notes, setNotes] = useState("")
  const limit = 280
  return (
    <Textarea
      label="Release notes"
      value={notes}
      onChange={(event) => setNotes(event.target.value.slice(0, limit))}
      rows={4}
      placeholder="Summarize customer-visible changes…"
      hint={\`\${notes.length}/\${limit} characters\`}
      error={notes.length >= limit ? "You have reached the character limit." : undefined}
    />
  )
}`,
      <TextareaCounterExample />),
    ex("states", "Error and disabled", "Validation and disabled states share the field contract with Input.",
      `<Textarea label="Reason" error="Tell us why you are cancelling." rows={3} />
<Textarea label="Audit note" disabled defaultValue="Locked by policy." rows={3} />`,
      <div className="demo-form-grid"><R.Textarea label="Reason" error="Tell us why you are cancelling." rows={3} /><R.Textarea label="Audit note" disabled defaultValue="Locked by policy." rows={3} /></div>),
  ],

  "components/select": () => [
    ex("multiple", "Multiple, grouped and clearable", "Groups, descriptions, disabled options and a clear action, all controlled.",
      `function RegionPicker() {
  const [regions, setRegions] = useState(["iad1", "fra1"])
  return (
    <>
      <Select
        multiple
        label="Deploy regions"
        value={regions}
        onChange={setRegions}
        clearable
        placeholder="Choose regions"
        options={[
          { group: "Americas", options: [
            { value: "iad1", label: "US East", description: "Washington, D.C." },
            { value: "sfo1", label: "US West", description: "San Francisco" },
          ] },
          { group: "Europe", options: [
            { value: "fra1", label: "EU Central", description: "Frankfurt" },
            { value: "lhr1", label: "EU West", description: "London", disabled: true },
          ] },
        ]}
      />
      <span role="status">
        {\`\${regions.length} selected: \${regions.join(", ") || "none"}\`}
      </span>
    </>
  )
}`,
      <SelectMultipleExample />),
    ex("aligned", "Sizes that line up", "Every field and button shares one height scale (sm 32 / md 36 / lg 40px), so mixed toolbars align.",
      `<div className="flex flex-wrap items-end gap-2">
  <Input size="sm" label="Search" placeholder="Search…" wrapperClassName="w-40" />
  <Select size="sm" label="Status" defaultValue="all" wrapperClassName="w-36" options={[{ value: "all", label: "All statuses" }, { value: "live", label: "Live" }]} />
  <DatePicker size="sm" label="Since" className="w-40" />
  <Button size="sm">Apply</Button>
</div>`,
      <div className="flex w-full max-w-xl flex-wrap items-end gap-2"><R.Input size="sm" label="Search" placeholder="Search…" wrapperClassName="w-40" /><R.Select size="sm" label="Status" defaultValue="all" wrapperClassName="w-36" options={[{ value: "all", label: "All statuses" }, { value: "live", label: "Live" }]} /><R.DatePicker size="sm" label="Since" className="w-40" /><R.Button size="sm">Apply</R.Button></div>),
    ex("status", "Status options", "Options can carry a semantic color and icon.",
      `<Select
  label="Status"
  defaultValue="active"
  options={[
    { value: "active", label: "Active", color: "success" },
    { value: "paused", label: "Paused", color: "warning" },
    { value: "failed", label: "Failed", color: "danger" },
  ]}
/>`,
      <div className="w-full max-w-sm"><R.Select label="Status" defaultValue="active" options={[{ value: "active", label: "Active", color: "success" }, { value: "paused", label: "Paused", color: "warning" }, { value: "failed", label: "Failed", color: "danger" }]} /></div>),
    ex("states", "Validation and disabled", "Field messaging matches Input.",
      `<Select label="Plan" error="Choose a plan to continue." options={plans} />
<Select label="Owner" disabled defaultValue="maya" options={owners} />`,
      <div className="demo-form-grid"><R.Select label="Plan" error="Choose a plan to continue." options={[{ value: "hobby", label: "Hobby" }, { value: "pro", label: "Pro" }]} /><R.Select label="Owner" disabled defaultValue="maya" options={[{ value: "maya", label: "Maya Chen" }]} /></div>),
  ],

  "components/autocomplete": () => [
    ex("multiple", "Multiple selection", "Selected values render as removable chips; onSelect receives the full selection.",
      `function ReviewerPicker() {
  const [reviewers, setReviewers] = useState<string[]>(["maya"])
  return (
    <Autocomplete<string>
      multiple
      label="Reviewers"
      placeholder="Search teammates…"
      value={reviewers}
      onSelect={(_, all) => setReviewers(all.map((option) => option.value))}
      options={[
        { value: "maya", label: "Maya Chen", description: "Platform" },
        { value: "jordan", label: "Jordan Kim", description: "Security" },
        { value: "sam", label: "Sam Rivera", description: "Frontend" },
        { value: "ari", label: "Ari Patel", description: "Data" },
      ]}
      hint="Each reviewer is notified when the deploy is ready."
    />
  )
}`,
      <AutocompleteMultipleExample />),
    ex("states", "Loading and empty", "Show a loading row while fetching, and a custom empty message.",
      `<Autocomplete label="Repository" placeholder="Searching GitHub…" loading options={[]} />
<Autocomplete label="Team" options={[]} emptyMessage="No teams match your search." />`,
      <div className="demo-form-grid"><R.Autocomplete label="Repository" placeholder="Searching GitHub…" loading options={[]} /><R.Autocomplete label="Team" options={[]} emptyMessage="No teams match your search." /></div>),
  ],

  "components/checkbox": () => [
    ex("select-all", "Select all", "A parent checkbox shows indeterminate while some children are checked.",
      `function NotificationPreferences() {
  const all = ["Deployments", "Billing", "Security"]
  const [checked, setChecked] = useState(["Deployments"])
  const allChecked = checked.length === all.length
  return (
    <>
      <Checkbox
        label="All notifications"
        checked={allChecked}
        indeterminate={checked.length > 0 && !allChecked}
        onChange={() => setChecked(allChecked ? [] : all)}
      />
      {all.map((item) => (
        <Checkbox
          key={item}
          label={item}
          checked={checked.includes(item)}
          onChange={(event) =>
            setChecked(event.target.checked
              ? [...checked, item]
              : checked.filter((value) => value !== item))
          }
        />
      ))}
    </>
  )
}`,
      <CheckboxSelectAllExample />),
    ex("sizes", "Sizes", "sm, md and lg scale the box and label together.",
      `<Checkbox size="sm" label="Small" defaultChecked />
<Checkbox size="md" label="Medium" defaultChecked />
<Checkbox size="lg" label="Large" defaultChecked />`,
      <div className="demo-row"><R.Checkbox size="sm" label="Small" defaultChecked /><R.Checkbox size="md" label="Medium" defaultChecked /><R.Checkbox size="lg" label="Large" defaultChecked /></div>),
    ex("states", "Error and disabled", "error connects a message and sets aria-invalid.",
      `<Checkbox label="I accept the terms" error="You must accept the terms." />
<Checkbox label="Managed by SSO" disabled defaultChecked />`,
      <div className="demo-stack"><R.Checkbox label="I accept the terms" error="You must accept the terms." /><R.Checkbox label="Managed by SSO" disabled defaultChecked /></div>),
  ],

  "components/switch": () => [
    ex("settings", "Settings panel", "One state object drives several switches; each takes effect immediately.",
      `function DeploySettings() {
  const [settings, setSettings] = useState({ previews: true, autoDeploy: false })
  return (
    <Card>
      <CardBody>
        <Switch
          label="Preview deployments"
          description="Build every pull request to a unique URL."
          checked={settings.previews}
          onCheckedChange={(previews) => setSettings({ ...settings, previews })}
        />
        <Switch
          label="Auto-deploy main"
          description="Promote to production when checks pass."
          checked={settings.autoDeploy}
          onCheckedChange={(autoDeploy) => setSettings({ ...settings, autoDeploy })}
        />
      </CardBody>
    </Card>
  )
}`,
      <SwitchSettingsExample />),
    ex("sizes", "Sizes and disabled", "sm for dense rows; disabled keeps its checked state visible.",
      `<Switch size="sm" label="Compact" defaultChecked />
<Switch size="md" label="Default" defaultChecked />
<Switch label="Locked by admin" disabled defaultChecked />`,
      <div className="demo-stack"><R.Switch size="sm" label="Compact" defaultChecked /><R.Switch size="md" label="Default" defaultChecked /><R.Switch label="Locked by admin" disabled defaultChecked /></div>),
  ],

  "components/radio-group": () => [
    ex("horizontal", "Horizontal", "orientation=\"horizontal\" for short option sets, with a disabled option.",
      `function PlanPicker() {
  const [plan, setPlan] = useState("pro")
  return (
    <RadioGroup
      label="Plan"
      orientation="horizontal"
      value={plan}
      onChange={setPlan}
      hint="You can change plans at any time."
    >
      <Radio value="hobby" label="Hobby" />
      <Radio value="pro" label="Pro" />
      <Radio value="enterprise" label="Enterprise" disabled />
    </RadioGroup>
  )
}`,
      <RadioHorizontalExample />),
    ex("uncontrolled", "Uncontrolled", "defaultValue lets the group manage its own state — no useState needed. Pair with name to submit it in a form.",
      `<RadioGroup label="Notifications" name="notifications" defaultValue="mentions">
  <Radio value="all" label="All activity" />
  <Radio value="mentions" label="Mentions only" />
  <Radio value="none" label="Nothing" />
</RadioGroup>`,
      <R.RadioGroup label="Notifications" name="notifications" defaultValue="mentions"><R.Radio value="all" label="All activity" /><R.Radio value="mentions" label="Mentions only" /><R.Radio value="none" label="Nothing" /></R.RadioGroup>),
    ex("error", "Validation", "Group-level error is announced with the group.",
      `<RadioGroup label="Billing contact" value="" onChange={setContact} error="Choose a billing contact.">
  <Radio value="owner" label="Workspace owner" />
  <Radio value="finance" label="Finance team" />
</RadioGroup>`,
      <R.RadioGroup label="Billing contact" value="" onChange={() => {}} error="Choose a billing contact."><R.Radio value="owner" label="Workspace owner" /><R.Radio value="finance" label="Finance team" /></R.RadioGroup>),
  ],

  "components/slider": () => [
    ex("controlled", "Controlled with derived value", "Read the value back to compute dependent UI.",
      `function CpuSlider() {
  const [cpu, setCpu] = useState(2)
  return (
    <>
      <Slider
        label="vCPUs"
        min={1}
        max={16}
        step={1}
        value={cpu}
        onChange={(event) => setCpu(Number(event.target.value))}
        formatValue={(value) => \`\${value} vCPU\`}
      />
      <span role="status">{\`Estimated cost: $\${(cpu * 12).toFixed(2)}/month\`}</span>
    </>
  )
}`,
      <SliderControlledExample />),
    ex("states", "Hint, error and disabled", "Same field messaging as every other control.",
      `<Slider label="Retention" min={1} max={90} defaultValue={30} hint="Days to keep logs" />
<Slider label="Concurrency" min={1} max={10} defaultValue={10} error="Limit reached on this plan." />
<Slider label="Replicas" min={1} max={5} defaultValue={2} disabled />`,
      <div className="demo-stack w-full max-w-sm"><R.Slider label="Retention" min={1} max={90} defaultValue={30} hint="Days to keep logs" /><R.Slider label="Concurrency" min={1} max={10} defaultValue={10} error="Limit reached on this plan." /><R.Slider label="Replicas" min={1} max={5} defaultValue={2} disabled /></div>),
  ],

  "components/badge": () => [
    ex("dots", "Status with dot", "dot adds a leading indicator, which works well for live status.",
      `<Badge variant="success" dot>Operational</Badge>
<Badge variant="warning" dot>Degraded</Badge>
<Badge variant="danger" dot>Outage</Badge>
<Badge variant="muted" dot>Paused</Badge>`,
      <div className="demo-row"><R.Badge variant="success" dot>Operational</R.Badge><R.Badge variant="warning" dot>Degraded</R.Badge><R.Badge variant="danger" dot>Outage</R.Badge><R.Badge variant="muted" dot>Paused</R.Badge></div>),
    ex("sizes", "Sizes", "Scale badges with the text they annotate.",
      `<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>`,
      <div className="demo-row"><R.Badge size="sm">Small</R.Badge><R.Badge size="md">Medium</R.Badge><R.Badge size="lg">Large</R.Badge></div>),
    ex("in-context", "In context", "Badges annotate headings, list rows and navigation counts.",
      `<div className="flex items-center gap-2">
  <h3 className="font-semibold">api-gateway</h3>
  <Badge variant="info" size="sm">Preview</Badge>
</div>
<Button variant="secondary" icon={<Inbox size={15} />}>
  Inbox <Badge size="sm">12</Badge>
</Button>`,
      <div className="demo-row"><div className="flex items-center gap-2"><h3 className="text-sm font-semibold">api-gateway</h3><R.Badge variant="info" size="sm">Preview</R.Badge></div><R.Button variant="secondary" icon={<Inbox size={15} />}>Inbox <R.Badge size="sm">12</R.Badge></R.Button></div>),
  ],

  "components/card": () => [
    ex("variants", "Variants", "Pick the surface that matches the layer: default, elevated, bordered or flush.",
      `<Card variant="default"><CardBody>Default</CardBody></Card>
<Card variant="elevated"><CardBody>Elevated</CardBody></Card>
<Card variant="bordered"><CardBody>Bordered</CardBody></Card>
<Card variant="flush"><CardBody>Flush</CardBody></Card>`,
      <div className="grid w-full max-w-xl grid-cols-2 gap-4"><R.Card variant="default"><R.CardBody className="text-sm">Default</R.CardBody></R.Card><R.Card variant="elevated"><R.CardBody className="text-sm">Elevated</R.CardBody></R.Card><R.Card variant="bordered"><R.CardBody className="text-sm">Bordered</R.CardBody></R.Card><R.Card variant="flush"><R.CardBody className="text-sm">Flush</R.CardBody></R.Card></div>),
    ex("pricing", "Pricing card", "Cards compose with every other component.",
      `<Card className="w-72">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Pro</CardTitle>
      <Badge variant="info" size="sm">Popular</Badge>
    </div>
    <CardDescription>For growing teams shipping daily.</CardDescription>
  </CardHeader>
  <CardBody>
    <p className="text-3xl font-semibold">$20<span className="text-sm text-muted-foreground"> / seat / mo</span></p>
  </CardBody>
  <CardFooter>
    <Button className="w-full">Start free trial</Button>
  </CardFooter>
</Card>`,
      <R.Card className="w-72"><R.CardHeader><div className="flex items-center justify-between"><R.CardTitle>Pro</R.CardTitle><R.Badge variant="info" size="sm">Popular</R.Badge></div><R.CardDescription>For growing teams shipping daily.</R.CardDescription></R.CardHeader><R.CardBody><p className="text-3xl font-semibold">$20<span className="text-sm font-normal text-muted-foreground"> / seat / mo</span></p></R.CardBody><R.CardFooter><R.Button className="w-full">Start free trial</R.Button></R.CardFooter></R.Card>),
  ],

  "components/avatar": () => [
    ex("sizes", "Sizes", "Five sizes from inline mentions to profile headers.",
      `<Avatar name="Maya Chen" size="xs" />
<Avatar name="Maya Chen" size="sm" />
<Avatar name="Maya Chen" size="md" />
<Avatar name="Maya Chen" size="lg" />
<Avatar name="Maya Chen" size="xl" />`,
      <div className="demo-row"><R.Avatar name="Maya Chen" size="xs" /><R.Avatar name="Maya Chen" size="sm" /><R.Avatar name="Maya Chen" size="md" /><R.Avatar name="Maya Chen" size="lg" /><R.Avatar name="Maya Chen" size="xl" /></div>),
    ex("fallback", "Image and fallback", "Initials render when there is no src, or when the image fails to load.",
      `<Avatar name="Rui Docs" src="/favicon-32.png" size="lg" />
<Avatar name="Jordan Kim" size="lg" status="offline" />
<Avatar name="Broken Image" src="/missing.png" size="lg" />`,
      <div className="demo-row"><R.Avatar name="Rui Docs" src={`${import.meta.env.BASE_URL}favicon-32.png`} size="lg" /><R.Avatar name="Jordan Kim" size="lg" status="offline" /><R.Avatar name="Broken Image" src="/missing.png" size="lg" /></div>),
  ],

  "components/tag": () => [
    ex("removable", "Removable list", "onRemove adds a named remove button; the list is plain state.",
      `function EnvironmentTags() {
  const [tags, setTags] = useState(["production", "staging", "preview"])
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Tag key={tag} onRemove={() => setTags(tags.filter((t) => t !== tag))}>
          {tag}
        </Tag>
      ))}
    </div>
  )
}`,
      <TagListExample />),
    ex("variants", "Variants and sizes", "All tones in both sizes.",
      `<Tag variant="success">Passing</Tag>
<Tag variant="warning">Flaky</Tag>
<Tag variant="danger">Failing</Tag>
<Tag variant="info" size="sm">Beta</Tag>
<Tag variant="muted" size="sm">Archived</Tag>`,
      <div className="demo-row"><R.Tag variant="success">Passing</R.Tag><R.Tag variant="warning">Flaky</R.Tag><R.Tag variant="danger">Failing</R.Tag><R.Tag variant="info" size="sm">Beta</R.Tag><R.Tag variant="muted" size="sm">Archived</R.Tag></div>),
  ],

  "components/stat": () => [
    ex("dashboard", "KPI row", "icon, description and action slots compose a full KPI tile.",
      `<div className="grid gap-4 sm:grid-cols-3">
  <Stat label="Revenue" value="$48.2k" trend="up" trendValue="+12%" description="vs last month" />
  <Stat label="Error rate" value="0.42" unit="%" trend="down" trendValue="-0.1%" />
  <Stat label="Active users" value="3,214" trend="neutral" trendValue="0%" />
</div>`,
      <div className="grid w-full gap-4 sm:grid-cols-3"><R.Stat label="Revenue" value="$48.2k" trend="up" trendValue="+12%" description="vs last month" /><R.Stat label="Error rate" value="0.42" unit="%" trend="down" trendValue="-0.1%" /><R.Stat label="Active users" value="3,214" trend="neutral" trendValue="0%" /></div>),
  ],

  "components/status-dot": () => [
    ex("presence", "Presence and tones", "Presence states and the shared tone names.",
      `<StatusDot status="online" label="Online" />
<StatusDot status="idle" label="Idle" />
<StatusDot status="busy" label="Busy" />
<StatusDot status="offline" label="Offline" />
<StatusDot status="warning" label="Degraded" />
<StatusDot status="info" label="Maintenance" />`,
      <div className="demo-row"><R.StatusDot status="online" label="Online" /><R.StatusDot status="idle" label="Idle" /><R.StatusDot status="busy" label="Busy" /><R.StatusDot status="offline" label="Offline" /><R.StatusDot status="warning" label="Degraded" /><R.StatusDot status="info" label="Maintenance" /></div>),
    ex("sizes", "Sizes", "sm, md and lg indicators.",
      `<StatusDot status="online" size="sm" label="Small" />
<StatusDot status="online" size="md" label="Medium" />
<StatusDot status="online" size="lg" label="Large" pulse />`,
      <div className="demo-row"><R.StatusDot status="online" size="sm" label="Small" /><R.StatusDot status="online" size="md" label="Medium" /><R.StatusDot status="online" size="lg" label="Large" pulse /></div>),
  ],

  "components/alert": () => [
    ex("variants", "All tones", "Every shared tone, from neutral to danger.",
      `<Alert variant="default" title="Heads up">You can add up to 10 domains.</Alert>
<Alert variant="info" title="New region">Deploy to Singapore from today.</Alert>
<Alert variant="success" title="Domain verified">atlas.dev is live.</Alert>
<Alert variant="warning" title="Usage at 92%">Upgrade to avoid throttling.</Alert>
<Alert variant="danger" title="Build failed">Exit code 1 in step "test".</Alert>`,
      <div className="demo-stack w-full"><R.Alert variant="default" title="Heads up">You can add up to 10 domains.</R.Alert><R.Alert variant="info" title="New region">Deploy to Singapore from today.</R.Alert><R.Alert variant="success" title="Domain verified">atlas.dev is live.</R.Alert><R.Alert variant="warning" title="Usage at 92%">Upgrade to avoid throttling.</R.Alert><R.Alert variant="danger" title="Build failed">Exit code 1 in step &quot;test&quot;.</R.Alert></div>),
    ex("dismiss", "Dismissable", "dismissable renders a named close button; you own the visibility state.",
      `function MaintenanceAlert() {
  const [visible, setVisible] = useState(true)
  return visible ? (
    <Alert
      variant="info"
      title="Scheduled maintenance"
      dismissable
      onDismiss={() => setVisible(false)}
    >
      The dashboard will be read-only on Sunday from 02:00 to 03:00 UTC.
    </Alert>
  ) : (
    <Button variant="secondary" onClick={() => setVisible(true)}>Show alert again</Button>
  )
}`,
      <AlertDismissExample />),
  ],

  "components/callout": () => [
    ex("variants", "Tones", "Inline guidance within documentation and settings pages.",
      `<Callout variant="info" title="Tip">Use preview deployments to share work.</Callout>
<Callout variant="success" title="Ready">Your workspace is configured.</Callout>
<Callout variant="danger" title="Irreversible">Deleting a project removes all data.</Callout>
<Callout variant="muted">Last synced 3 minutes ago.</Callout>`,
      <div className="demo-stack w-full max-w-lg"><R.Callout variant="info" title="Tip">Use preview deployments to share work.</R.Callout><R.Callout variant="success" title="Ready">Your workspace is configured.</R.Callout><R.Callout variant="danger" title="Irreversible">Deleting a project removes all data.</R.Callout><R.Callout variant="muted">Last synced 3 minutes ago.</R.Callout></div>),
  ],

  "components/progressbar": () => [
    ex("upload", "Live upload", "Feed value from state; switch variant when complete.",
      `function UploadProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (progress === 0 || progress >= 100) return
    const timer = window.setTimeout(() => setProgress((value) => Math.min(100, value + 10)), 200)
    return () => window.clearTimeout(timer)
  }, [progress])
  return (
    <>
      <Progressbar
        value={progress}
        label="Uploading build artifacts"
        showValue
        variant={progress >= 100 ? "success" : "default"}
      />
      <Button size="sm" variant="secondary" onClick={() => setProgress(10)} disabled={progress > 0 && progress < 100}>
        {progress >= 100 ? "Upload again" : "Start upload"}
      </Button>
    </>
  )
}`,
      <ProgressUploadExample />),
    ex("variants", "Tones, steps and indeterminate", "Semantic tones, a stepped track, and an indeterminate state for unknown durations.",
      `<Progressbar value={80} variant="success" label="Storage" showValue />
<Progressbar value={92} variant="warning" label="Build minutes" showValue />
<Progressbar value={3} steps={5} label="Onboarding" showValue />
<Progressbar indeterminate label="Provisioning database" />`,
      <div className="demo-stack w-full max-w-sm"><R.Progressbar value={80} variant="success" label="Storage" showValue /><R.Progressbar value={92} variant="warning" label="Build minutes" showValue /><R.Progressbar value={3} steps={5} label="Onboarding" showValue /><R.Progressbar indeterminate label="Provisioning database" /></div>),
    ex("sizes", "Sizes", "xs to lg track heights.",
      `<Progressbar value={60} size="xs" />
<Progressbar value={60} size="sm" />
<Progressbar value={60} size="md" />
<Progressbar value={60} size="lg" />`,
      <div className="demo-stack w-full max-w-sm"><R.Progressbar value={60} size="xs" /><R.Progressbar value={60} size="sm" /><R.Progressbar value={60} size="md" /><R.Progressbar value={60} size="lg" /></div>),
  ],

  "components/skeleton": () => [
    ex("loading", "Swap with content", "Toggle loading to see the skeleton match the final layout.",
      `function ActivityCard() {
  const [loading, setLoading] = useState(true)
  return (
    <>
      <Card aria-busy={loading}>
        <CardBody className="flex items-center gap-3">
          {loading ? <Skeleton className="size-10" rounded="full" /> : <Avatar name="Maya Chen" />}
          <div className="flex-1 space-y-2">
            {loading ? (
              <>
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-48" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium">Maya Chen</p>
                <p className="text-sm text-muted-foreground">Deployed api-gateway 2m ago</p>
              </>
            )}
          </div>
        </CardBody>
      </Card>
      <Switch label="Loading" checked={loading} onCheckedChange={setLoading} />
    </>
  )
}`,
      <SkeletonLoadingExample />),
  ],

  "components/spinner": () => [
    ex("in-context", "In context", "Inside buttons, inline with text, and centred in a loading region.",
      `<Button disabled><Spinner size="xs" /> Deploying</Button>
<span className="flex items-center gap-2 text-sm"><Spinner size="sm" /> Fetching logs…</span>
<div role="status" aria-label="Loading metrics" className="grid h-24 w-48 place-items-center rounded-lg border">
  <Spinner size="lg" />
</div>`,
      <div className="demo-row"><R.Button disabled><R.Spinner size="xs" /> Deploying</R.Button><span className="flex items-center gap-2 text-sm"><R.Spinner size="sm" /> Fetching logs…</span><div role="status" aria-label="Loading metrics" className="grid h-24 w-48 place-items-center rounded-lg border border-border bg-surface"><R.Spinner size="lg" /></div></div>),
  ],

  "components/empty-state": () => [
    ex("sizes", "Sizes in a card", "Use sm inside panels and lg for whole-page empty views.",
      `<Card>
  <EmptyState
    size="sm"
    icon={<Inbox />}
    title="No notifications"
    description="You're all caught up."
  />
</Card>
<Card>
  <EmptyState
    size="lg"
    icon={<Search />}
    title="No results for “gatewy”"
    description="Check the spelling or try a broader term."
    action={<Button variant="secondary">Clear search</Button>}
  />
</Card>`,
      <div className="grid w-full gap-4 sm:grid-cols-2"><R.Card><R.EmptyState size="sm" icon={<Inbox />} title="No notifications" description="You're all caught up." /></R.Card><R.Card><R.EmptyState size="lg" icon={<Search />} title="No results for “gatewy”" description="Check the spelling or try a broader term." action={<R.Button variant="secondary">Clear search</R.Button>} /></R.Card></div>),
  ],

  "components/snackbar": () => [
    ex("tones", "Every tone", "show() accepts a message, variant and optional duration. Wrap your app once in SnackbarProvider.",
      `function Notifications() {
  const { show } = useSnackbar()
  return (
    <>
      <Button variant="secondary" onClick={() => show({ message: "Changes saved.", variant: "success" })}>Success</Button>
      <Button variant="secondary" onClick={() => show({ message: "Payment method expires soon.", variant: "warning" })}>Warning</Button>
      <Button variant="secondary" onClick={() => show({ message: "Deployment failed. Check build logs.", variant: "error" })}>Error</Button>
      <Button variant="secondary" onClick={() => show({ message: "Syncing in the background…", variant: "info" })}>Info</Button>
    </>
  )
}`,
      <SnackbarActionsExample />),
  ],

  "components/modal": () => [
    ex("form", "Form in a modal", "A real submit flow: required field, disabled submit, and a result after closing.",
      `function NewProjectModal() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [created, setCreated] = useState<string | null>(null)
  function submit(event: React.FormEvent) {
    event.preventDefault()
    setCreated(name)
    setOpen(false)
    setName("")
  }
  return (
    <>
      <Button icon={<Plus size={15} />} onClick={() => setOpen(true)}>New project</Button>
      {created && <span role="status">{\`Created “\${created}”\`}</span>}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create project"
        description="Projects group deployments, domains and environment variables."
      >
        <form onSubmit={submit}>
          <Input label="Project name" value={name} onChange={(event) => setName(event.target.value)} placeholder="api-gateway" required autoFocus />
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" disabled={!name.trim()}>Create project</Button>
        </form>
      </Modal>
    </>
  )
}`,
      <ModalFormExample />),
    ex("sizes", "Sizes", "size caps the panel width; it always fits the viewport.",
      `function ModalSizes() {
  const [size, setSize] = useState<"sm" | "lg" | "xl" | null>(null)
  return (
    <>
      {(["sm", "lg", "xl"] as const).map((value) => (
        <Button key={value} variant="secondary" onClick={() => setSize(value)}>
          {\`Open \${value}\`}
        </Button>
      ))}
      <Modal
        open={size !== null}
        onClose={() => setSize(null)}
        size={size ?? "md"}
        title={\`Modal size “\${size}”\`}
        description="Width is capped by the size token and always fits the viewport."
      >
        <p>Use sm for confirmations, md for short forms and lg or xl for richer content.</p>
      </Modal>
    </>
  )
}`,
      <ModalSizesExample />),
  ],

  "components/drawer": () => [
    ex("positions", "Positions", "Slide in from the left, right or bottom (a sheet on mobile).",
      `function FilterDrawer() {
  const [position, setPosition] = useState<"left" | "right" | "bottom" | null>(null)
  return (
    <>
      {(["left", "right", "bottom"] as const).map((value) => (
        <Button key={value} variant="secondary" onClick={() => setPosition(value)}>
          {\`Open \${value}\`}
        </Button>
      ))}
      <Drawer
        open={position !== null}
        onClose={() => setPosition(null)}
        position={position ?? "right"}
        title="Filters"
      >
        <Checkbox label="Healthy" defaultChecked />
        <Checkbox label="Building" />
        <Checkbox label="Failed" />
        <Button onClick={() => setPosition(null)}>Apply filters</Button>
      </Drawer>
    </>
  )
}`,
      <DrawerPositionsExample />),
  ],

  "components/popover": () => [
    ex("controlled", "Controlled form", "Control open to close the popover after submitting.",
      `function InvitePopover() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [invited, setInvited] = useState<string[]>([])
  return (
    <>
      <Popover open={open} onOpenChange={setOpen} trigger={<Button icon={<User size={15} />}>Invite member</Button>}>
        <PopoverContent className="w-72">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              setInvited([...invited, email])
              setEmail("")
              setOpen(false)
            }}
          >
            <Input label="Email" type="email" size="sm" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <Button type="submit" size="sm" disabled={!email}>Send invite</Button>
          </form>
        </PopoverContent>
      </Popover>
      <span role="status">{invited.length ? \`Invited: \${invited.join(", ")}\` : "No invites sent"}</span>
    </>
  )
}`,
      <PopoverControlledExample />),
  ],

  "components/confirm-dialog": () => [
    ex("async", "Async confirmation", "loading keeps the dialog open with a busy confirm button until the work finishes.",
      `function ArchiveProject() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [archived, setArchived] = useState(false)
  function confirm() {
    setLoading(true)
    window.setTimeout(() => { setLoading(false); setOpen(false); setArchived(true) }, 1200)
  }
  return (
    <>
      <Button variant="secondary" icon={<Archive size={15} />} onClick={() => setOpen(true)} disabled={archived}>
        {archived ? "Archived" : "Archive project"}
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={confirm}
        loading={loading}
        title="Archive this project?"
        description="Deployments stop serving traffic. You can restore it within 30 days."
        confirmLabel="Archive"
      />
    </>
  )
}`,
      <ConfirmAsyncExample />),
  ],

  "components/dropdown-menu": () => [
    ex("account", "Account menu", "Icons, shortcuts, groups, disabled and destructive items.",
      `<DropdownMenu
  ariaLabel="Account"
  align="end"
  trigger={<Button variant="ghost" icon={<User size={15} />}>Maya Chen</Button>}
  items={[
    { label: "Profile", icon: <User size={14} />, shortcut: "⌘P" },
    { label: "Settings", icon: <Settings size={14} />, shortcut: "⌘," },
    { label: "Billing", icon: <CreditCard size={14} />, disabled: true },
    { group: "Session", items: [
      { label: "Sign out", icon: <LogOut size={14} />, destructive: true },
    ] },
  ]}
/>`,
      <R.DropdownMenu ariaLabel="Account" align="end" trigger={<R.Button variant="ghost" icon={<User size={15} />}>Maya Chen</R.Button>} items={[{ label: "Profile", icon: <User size={14} />, shortcut: "⌘P" }, { label: "Settings", icon: <Settings size={14} />, shortcut: "⌘," }, { label: "Billing", icon: <CreditCard size={14} />, disabled: true }, { group: "Session", items: [{ label: "Sign out", icon: <LogOut size={14} />, destructive: true }] }]} />),
  ],

  "components/tooltip": () => [
    ex("positions", "Positions", "Preferred side; it flips to stay inside the viewport.",
      `<Tooltip content="Top" position="top"><Button variant="secondary">Top</Button></Tooltip>
<Tooltip content="Right" position="right"><Button variant="secondary">Right</Button></Tooltip>
<Tooltip content="Bottom" position="bottom"><Button variant="secondary">Bottom</Button></Tooltip>
<Tooltip content="Left" position="left"><Button variant="secondary">Left</Button></Tooltip>`,
      <div className="demo-row">{(["top", "right", "bottom", "left"] as const).map((position) => <R.Tooltip key={position} content={position[0].toUpperCase() + position.slice(1)} position={position}><R.Button variant="secondary">{position[0].toUpperCase() + position.slice(1)}</R.Button></R.Tooltip>)}</div>),
    ex("rich", "Delay and rich content", "delayMs avoids flicker on dense toolbars; content can be any node.",
      `<Tooltip
  delayMs={300}
  content={<span>Copy link <Kbd keys={["⌘", "C"]} /></span>}
>
  <Button size="icon" variant="secondary" aria-label="Copy link">
    <Link2 size={15} />
  </Button>
</Tooltip>`,
      <R.Tooltip delayMs={300} content={<span className="flex items-center gap-2">Copy link <R.Kbd keys={["⌘", "C"]} /></span>}><R.Button size="icon" variant="secondary" aria-label="Copy link"><Link2 size={15} /></R.Button></R.Tooltip>),
  ],

  "components/tabs": () => [
    ex("controlled", "Controlled with icons", "Drive value from state to switch tabs from elsewhere in the UI.",
      `function AccountTabs() {
  const [tab, setTab] = useState("account")
  return (
    <>
      <Tabs defaultValue="account" value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="account" icon={<User size={14} />}>Account</TabsTrigger>
          <TabsTrigger value="billing" icon={<CreditCard size={14} />}>Billing</TabsTrigger>
          <TabsTrigger value="settings" icon={<Settings size={14} />}>Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Update your name, avatar and contact email.</TabsContent>
        <TabsContent value="billing">Manage invoices and payment methods.</TabsContent>
        <TabsContent value="settings">Configure workspace defaults.</TabsContent>
      </Tabs>
      <Button size="sm" variant="ghost" icon={<ArrowRight size={14} />} iconPosition="right" onClick={() => setTab("billing")}>
        Go to billing
      </Button>
    </>
  )
}`,
      <TabsControlledExample />),
    ex("icon-position", "Icon position", "iconPosition places the icon left (default), right, or top — top suits icon tab bars.",
      `<Tabs defaultValue="inbox">
  <TabsList>
    <TabsTrigger value="inbox" icon={<Inbox size={14} />}>Inbox</TabsTrigger>
    <TabsTrigger value="export" icon={<Download size={14} />} iconPosition="right">Export</TabsTrigger>
  </TabsList>
</Tabs>
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account" icon={<User size={16} />} iconPosition="top">Account</TabsTrigger>
    <TabsTrigger value="billing" icon={<CreditCard size={16} />} iconPosition="top">Billing</TabsTrigger>
    <TabsTrigger value="settings" icon={<Settings size={16} />} iconPosition="top">Settings</TabsTrigger>
  </TabsList>
</Tabs>`,
      <div className="demo-stack items-center"><R.Tabs defaultValue="inbox"><R.TabsList><R.TabsTrigger value="inbox" icon={<Inbox size={14} />}>Inbox</R.TabsTrigger><R.TabsTrigger value="export" icon={<Download size={14} />} iconPosition="right">Export</R.TabsTrigger></R.TabsList></R.Tabs><R.Tabs defaultValue="account"><R.TabsList><R.TabsTrigger value="account" icon={<User size={16} />} iconPosition="top">Account</R.TabsTrigger><R.TabsTrigger value="billing" icon={<CreditCard size={16} />} iconPosition="top">Billing</R.TabsTrigger><R.TabsTrigger value="settings" icon={<Settings size={16} />} iconPosition="top">Settings</R.TabsTrigger></R.TabsList></R.Tabs></div>),
    ex("vertical", "Vertical", "orientation=\"vertical\" switches layout and the arrow-key axis.",
      `<Tabs defaultValue="general" orientation="vertical">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="domains">Domains</TabsTrigger>
    <TabsTrigger value="env">Environment</TabsTrigger>
  </TabsList>
  <TabsContent value="general">Project name and framework preset.</TabsContent>
  <TabsContent value="domains">Custom domains and redirects.</TabsContent>
  <TabsContent value="env">Encrypted environment variables.</TabsContent>
</Tabs>`,
      <R.Tabs defaultValue="general" orientation="vertical" className="w-full max-w-lg"><R.TabsList><R.TabsTrigger value="general">General</R.TabsTrigger><R.TabsTrigger value="domains">Domains</R.TabsTrigger><R.TabsTrigger value="env">Environment</R.TabsTrigger></R.TabsList><R.TabsContent value="general"><p className="demo-panel-copy">Project name and framework preset.</p></R.TabsContent><R.TabsContent value="domains"><p className="demo-panel-copy">Custom domains and redirects.</p></R.TabsContent><R.TabsContent value="env"><p className="demo-panel-copy">Encrypted environment variables.</p></R.TabsContent></R.Tabs>),
  ],

  "components/accordion": () => [
    ex("controlled", "Controlled: expand and collapse all", "Pass value and onValueChange to drive open panels from outside the accordion.",
      `function Faq() {
  const faqs = [
    { id: "limits", trigger: "What are the plan limits?", content: "Pro includes 1 TB bandwidth and 6,000 build minutes." },
    { id: "regions", trigger: "Which regions are available?", content: "Twelve regions across four continents." },
    { id: "support", trigger: "How do I contact support?", content: "Open a ticket from the dashboard; Pro replies within 4 hours." },
  ]
  const [open, setOpen] = useState<string[]>([])
  return (
    <>
      <Button size="sm" variant="secondary" onClick={() => setOpen(faqs.map((faq) => faq.id))}>Expand all</Button>
      <Button size="sm" variant="ghost" onClick={() => setOpen([])}>Collapse all</Button>
      <Accordion multiple items={faqs} value={open} onValueChange={setOpen} />
    </>
  )
}`,
      <AccordionControlledExample />),
    ex("multiple", "Multiple open", "multiple lets readers compare panels; disabled items stay visible.",
      `<Accordion
  multiple
  defaultOpen={["limits", "regions"]}
  items={[
    { id: "limits", trigger: "What are the plan limits?", content: "Pro includes 1 TB bandwidth and 6,000 build minutes." },
    { id: "regions", trigger: "Which regions are available?", content: "Twelve regions across four continents." },
    { id: "sla", trigger: "Is there an SLA?", content: "Enterprise only.", disabled: true },
  ]}
/>`,
      <R.Accordion className="w-full max-w-lg" multiple defaultOpen={["limits", "regions"]} items={[{ id: "limits", trigger: "What are the plan limits?", content: "Pro includes 1 TB bandwidth and 6,000 build minutes." }, { id: "regions", trigger: "Which regions are available?", content: "Twelve regions across four continents." }, { id: "sla", trigger: "Is there an SLA?", content: "Enterprise only.", disabled: true }]} />),
  ],

  "components/pagination": () => [
    ex("list", "Paginating a list", "Slice your data by page; Pagination only owns navigation.",
      `function DeploymentList() {
  const rows = Array.from({ length: 23 }, (_, index) => \`Deployment #\${1000 - index}\`)
  const pageSize = 5
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(rows.length / pageSize)
  return (
    <>
      <List>
        {rows.slice((page - 1) * pageSize, page * pageSize).map((row) => (
          <ListItem key={row}>{row}</ListItem>
        ))}
      </List>
      <span>{\`Page \${page} of \${totalPages}\`}</span>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  )
}`,
      <PaginationTableExample />),
    ex("siblings", "Sibling count", "siblingCount controls how many pages show around the current one.",
      `<Pagination page={10} totalPages={20} siblingCount={0} onPageChange={setPage} />
<Pagination page={10} totalPages={20} siblingCount={2} onPageChange={setPage} />`,
      <SiblingPaginationExample />),
  ],

  "components/stepper": () => [
    ex("wizard", "Wizard", "Keep current in state and move it with Back and Continue.",
      `function DeployWizard() {
  const steps = [
    { label: "Repository", description: "Connect Git" },
    { label: "Configure", description: "Build settings" },
    { label: "Deploy", description: "Go live" },
  ]
  const [current, setCurrent] = useState(0)
  return (
    <>
      <Stepper steps={steps} current={current} />
      <Button variant="secondary" disabled={current === 0} onClick={() => setCurrent(current - 1)}>Back</Button>
      <Button disabled={current === steps.length - 1} onClick={() => setCurrent(current + 1)}>Continue</Button>
    </>
  )
}`,
      <StepperWizardExample />),
    ex("clickable", "Revisit completed steps", "onStepClick turns completed steps into buttons; clickable=\"all\" allows jumping ahead.",
      `function Checkout() {
  const [current, setCurrent] = useState(2)
  return (
    <Stepper
      current={current}
      onStepClick={setCurrent}
      steps={[{ label: "Cart" }, { label: "Shipping" }, { label: "Payment" }, { label: "Confirm" }]}
    />
  )
}`,
      <StepperClickableExample />),
    ex("vertical", "Vertical", "orientation=\"vertical\" for narrow sidebars and long step descriptions.",
      `<Stepper
  orientation="vertical"
  current={1}
  steps={[
    { label: "Create account", description: "Completed 2 minutes ago" },
    { label: "Verify email", description: "Check your inbox for a link" },
    { label: "Invite team", description: "Optional" },
  ]}
/>`,
      <R.Stepper orientation="vertical" current={1} steps={[{ label: "Create account", description: "Completed 2 minutes ago" }, { label: "Verify email", description: "Check your inbox for a link" }, { label: "Invite team", description: "Optional" }]} />, "start"),
  ],

  "components/table": () => [
    ex("overlays", "Overlays inside a table", "Tables scroll horizontally, which clips anything positioned inside them. Menus, tooltips, selects, pickers and modals are portalled with viewport-fixed coordinates, so they always render on top and in full. Open a row menu, then Edit service.",
      `function ServicesTable() {
  const services = [
    { id: "api", name: "api-gateway", status: "Healthy" },
    { id: "worker", name: "queue-worker", status: "Degraded" },
    { id: "web", name: "web-frontend", status: "Healthy" },
  ]
  const [editing, setEditing] = useState<string | null>(null)
  return (
    <>
      <Table aria-label="Services">
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Status</TableHead>
            <TableHead><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>{service.name}</TableCell>
              <TableCell>
                <Tooltip content={service.status === "Healthy" ? "All checks passing" : "p95 latency above 800 ms"}>
                  <Badge variant={service.status === "Healthy" ? "success" : "warning"} dot tabIndex={0}>
                    {service.status}
                  </Badge>
                </Tooltip>
              </TableCell>
              <TableCell>
                <DropdownMenu
                  ariaLabel={\`\${service.name} actions\`}
                  align="end"
                  trigger={<Button variant="ghost" size="icon" aria-label={\`\${service.name} actions\`}><MoreHorizontal size={16} /></Button>}
                  items={[
                    { label: "Edit service", icon: <Settings size={14} />, onClick: () => setEditing(service.name) },
                    { label: "Delete", icon: <Trash2 size={14} />, destructive: true },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={\`Edit \${editing ?? ""}\`}
        description="Opened from a table row, rendered above the page."
      >
        <Input label="Service name" defaultValue={editing ?? ""} />
        <Select label="Region" defaultValue="iad1" options={[{ value: "iad1", label: "US East" }, { value: "fra1", label: "EU Central" }]} />
        <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
        <Button onClick={() => setEditing(null)}>Save</Button>
      </Modal>
    </>
  )
}`,
      <TableOverlaysExample />),
  ],

  "components/timeline": () => [
    ex("deploy", "Deployment history", "Variants mark outcome; description and icon add detail.",
      `<Timeline
  events={[
    { id: "4", title: "Rolled back", description: "Reverted to v2.4.0", timestamp: "Just now", variant: "warning" },
    { id: "3", title: "Health check failed", description: "p95 latency above 800 ms", timestamp: "3m ago", variant: "danger" },
    { id: "2", title: "Deployed v2.4.1", timestamp: "5m ago", variant: "success" },
    { id: "1", title: "Build started", timestamp: "8m ago" },
  ]}
/>`,
      <R.Timeline className="w-full max-w-md" events={[{ id: "4", title: "Rolled back", description: "Reverted to v2.4.0", timestamp: "Just now", variant: "warning" }, { id: "3", title: "Health check failed", description: "p95 latency above 800 ms", timestamp: "3m ago", variant: "danger" }, { id: "2", title: "Deployed v2.4.1", timestamp: "5m ago", variant: "success" }, { id: "1", title: "Build started", timestamp: "8m ago" }]} />, "start"),
  ],
}

function TableOverlaysExample() {
  const services = [
    { id: "api", name: "api-gateway", status: "Healthy" },
    { id: "worker", name: "queue-worker", status: "Degraded" },
    { id: "web", name: "web-frontend", status: "Healthy" },
  ]
  const [editing, setEditing] = useState<string | null>(null)
  return (
    <>
      <R.Table aria-label="Services" containerClassName="w-full" className="min-w-[520px]">
        <R.TableHeader>
          <R.TableRow>
            <R.TableHead>Service</R.TableHead>
            <R.TableHead>Status</R.TableHead>
            <R.TableHead className="w-12"><span className="sr-only">Actions</span></R.TableHead>
          </R.TableRow>
        </R.TableHeader>
        <R.TableBody>
          {services.map((service) => (
            <R.TableRow key={service.id}>
              <R.TableCell className="font-medium">{service.name}</R.TableCell>
              <R.TableCell>
                <R.Tooltip content={service.status === "Healthy" ? "All checks passing" : "p95 latency above 800 ms"}>
                  <R.Badge variant={service.status === "Healthy" ? "success" : "warning"} dot tabIndex={0}>{service.status}</R.Badge>
                </R.Tooltip>
              </R.TableCell>
              <R.TableCell>
                <R.DropdownMenu
                  ariaLabel={`${service.name} actions`}
                  align="end"
                  trigger={<R.Button variant="ghost" size="icon" aria-label={`${service.name} actions`}><MoreHorizontal size={16} /></R.Button>}
                  items={[
                    { label: "Edit service", icon: <Settings size={14} />, onClick: () => setEditing(service.name) },
                    { label: "Delete", icon: <Trash2 size={14} />, destructive: true },
                  ]}
                />
              </R.TableCell>
            </R.TableRow>
          ))}
        </R.TableBody>
      </R.Table>
      <R.Modal open={editing !== null} onClose={() => setEditing(null)} title={`Edit ${editing ?? ""}`} description="Opened from a table row, rendered above the page.">
        <div className="demo-stack">
          <R.Input label="Service name" defaultValue={editing ?? ""} />
          <R.Select label="Region" defaultValue="iad1" options={[{ value: "iad1", label: "US East" }, { value: "fra1", label: "EU Central" }]} />
          <div className="demo-actions"><R.Button variant="secondary" onClick={() => setEditing(null)}>Cancel</R.Button><R.Button onClick={() => setEditing(null)}>Save</R.Button></div>
        </div>
      </R.Modal>
    </>
  )
}

function AccordionControlledExample() {
  const faqs = [
    { id: "limits", trigger: "What are the plan limits?", content: "Pro includes 1 TB bandwidth and 6,000 build minutes." },
    { id: "regions", trigger: "Which regions are available?", content: "Twelve regions across four continents." },
    { id: "support", trigger: "How do I contact support?", content: "Open a ticket from the dashboard; Pro replies within 4 hours." },
  ]
  const [open, setOpen] = useState<string[]>([])
  return (
    <div className="demo-stack w-full max-w-lg">
      <div className="flex gap-2">
        <R.Button size="sm" variant="secondary" onClick={() => setOpen(faqs.map((faq) => faq.id))}>Expand all</R.Button>
        <R.Button size="sm" variant="ghost" onClick={() => setOpen([])}>Collapse all</R.Button>
      </div>
      <R.Accordion multiple items={faqs} value={open} onValueChange={setOpen} />
    </div>
  )
}

function StepperClickableExample() {
  const [current, setCurrent] = useState(2)
  return <R.Stepper className="w-full max-w-lg" current={current} onStepClick={setCurrent} steps={[{ label: "Cart" }, { label: "Shipping" }, { label: "Payment" }, { label: "Confirm" }]} />
}

function TagListExample() {
  const [tags, setTags] = useState(["production", "staging", "preview"])
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => <R.Tag key={tag} onRemove={() => setTags(tags.filter((t) => t !== tag))}>{tag}</R.Tag>)}
      {!tags.length && <R.Button size="sm" variant="secondary" onClick={() => setTags(["production", "staging", "preview"])}>Reset tags</R.Button>}
    </div>
  )
}

function SiblingPaginationExample() {
  const [page, setPage] = useState(10)
  return (
    <div className="demo-stack items-center">
      <R.Pagination page={page} totalPages={20} siblingCount={0} onPageChange={setPage} />
      <R.Pagination page={page} totalPages={20} siblingCount={2} onPageChange={setPage} />
    </div>
  )
}
