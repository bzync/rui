import {
  Accordion,
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Drawer,
  DropdownMenu,
  Input,
  Modal,
  Pagination,
  Progressbar,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
} from "@bzync/rui"
import { ChevronRight, CircleHelp, Layers3, MoreHorizontal, Search } from "lucide-react"
import { type ReactNode, useMemo, useRef, useState } from "react"
import { componentGroups, hrefFor, type DocsPage } from "../catalog"
import { supplementalDetails } from "../component-details"
import { ComponentPreview, CopyCommand, DocsSection, PageIntro, PropsTable, type ApiProp } from "../primitives"

const subpathCode = `import "@bzync/rui/styles.css"
import { Button } from "@bzync/rui/button"
import { Select } from "@bzync/rui/select"`

function ComponentExplorer() {
  const [query, setQuery] = useState("")
  const [activeGroup, setActiveGroup] = useState("All")
  const filteredGroups = useMemo(() => {
    const term = query.trim().toLowerCase()
    return componentGroups
      .filter(group => activeGroup === "All" || group.label === activeGroup)
      .map(group => ({
        ...group,
        pages: group.pages.filter(page => !term || [page.title, page.description, ...(page.aliases ?? [])].join(" ").toLowerCase().includes(term)),
      }))
      .filter(group => group.pages.length > 0)
  }, [activeGroup, query])
  const resultCount = filteredGroups.reduce((total, group) => total + group.pages.length, 0)

  return (
    <div className="component-explorer">
      <div className="component-explorer-toolbar">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Filter component catalog"
          placeholder="Filter components…"
          prefix={<Search size={14} aria-hidden="true" />}
        />
        <div className="component-group-filters" aria-label="Filter by category">
          {["All", ...componentGroups.map(group => group.label)].map(group => (
            <button type="button" key={group} aria-pressed={activeGroup === group} onClick={() => setActiveGroup(group)}>{group}</button>
          ))}
        </div>
      </div>
      <p className="component-result-count" role="status"><Layers3 size={13} aria-hidden="true" /> {resultCount} {resultCount === 1 ? "component" : "components"}</p>
      {filteredGroups.length ? (
        <div className="component-index-groups">
          {filteredGroups.map(group => <div key={group.label} className="component-index-group"><h3>{group.label}<span>{group.pages.length}</span></h3><div>{group.pages.map(page => <a key={page.slug} href={hrefFor(page.slug)}><span>{page.title}</span><small>{page.description}</small><ChevronRight size={14} aria-hidden="true" /></a>)}</div></div>)}
        </div>
      ) : (
        <div className="component-explorer-empty"><Search size={18} aria-hidden="true" /><strong>No matching components</strong><span>Try a component name, purpose, or a different category.</span><Button size="sm" variant="secondary" onClick={() => { setQuery(""); setActiveGroup("All") }}>Clear filters</Button></div>
      )}
    </div>
  )
}

function ComponentsOverviewPage() {
  return <>
    <PageIntro eyebrow="Components" title="Component overview" description={`${componentGroups.flatMap(group => group.pages).length} public component entries and families, grouped by the job they perform.`} />
    <DocsSection id="browse" title="Browse components">
      <ComponentExplorer />
    </DocsSection>
    <DocsSection id="importing" title="Importing"><ComponentPreview code={subpathCode}><div className="import-preview"><code>root</code><span>or</span><code>component subpath</code></div></ComponentPreview></DocsSection>
    <DocsSection id="support" title="Runtime support"><p>The package supports React 18.2 and React 19, publishes ESM and CommonJS, and includes generated TypeScript declarations for the root and per-component entries.</p></DocsSection>
  </>
}

type Detail = {
  code: string
  preview: ReactNode
  props: ApiProp[]
  usage?: string
  accessibility: string
}

function StatefulSwitchPreview() {
  const [checked, setChecked] = useState(true)
  return <div className="demo-stack"><Switch label="Deployment notifications" description="Email me when a deployment finishes." checked={checked} onCheckedChange={setChecked} /><Switch label="Weekly summary" disabled /></div>
}

function StatefulSelectPreview() {
  const [value, setValue] = useState("iad1")
  return <Select label="Region" value={value} onChange={setValue} options={[{ value: "iad1", label: "US East — Virginia" }, { value: "sfo1", label: "US West — San Francisco" }, { value: "fra1", label: "EU Central — Frankfurt" }]} wrapperClassName="w-full max-w-sm" />
}

function StatefulModalPreview() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const close = () => {
    setOpen(false)
    window.setTimeout(() => triggerRef.current?.focus(), 240)
  }
  return <><Button ref={triggerRef} onClick={() => setOpen(true)}>Create API key</Button><Modal open={open} onClose={close} title="Create API key" description="The secret is shown only once."><div className="demo-stack"><Input label="Key name" placeholder="Production deploys" autoFocus /><div className="demo-actions"><Button variant="secondary" onClick={close}>Cancel</Button><Button onClick={close}>Create key</Button></div></div></Modal></>
}

function StatefulDrawerPreview() {
  const [open, setOpen] = useState(false)
  return <><Button variant="secondary" onClick={() => setOpen(true)}>View deployment</Button><Drawer open={open} onClose={() => setOpen(false)} position="right" title="Deployment details" width={380}><div className="drawer-example"><Badge variant="success">Ready</Badge><h3>api-production-7f31</h3><p>Deployed from main by Maya Chen.</p><Button variant="secondary" onClick={() => setOpen(false)}>Close details</Button></div></Drawer></>
}

function RadioPreview() {
  const [value, setValue] = useState("team")
  return <RadioGroup label="Workspace visibility" value={value} onChange={setValue}><Radio value="private" label="Private" description="Only invited members." /><Radio value="team" label="Organization" description="Visible to everyone in your organization." /></RadioGroup>
}

function PaginationPreview() {
  const [page, setPage] = useState(2)
  return <Pagination page={page} totalPages={7} onPageChange={setPage} />
}

const details: Record<string, () => Detail> = {
  "components/button": () => ({
    code: `<Button variant="primary">Create project</Button>\n<Button variant="secondary">Save draft</Button>\n<Button variant="outline">View logs</Button>\n<Button variant="ghost">Cancel</Button>\n<Button variant="destructive">Delete project</Button>`,
    preview: <div className="demo-row"><Button>Create project</Button><Button variant="secondary">Save draft</Button><Button variant="outline">View logs</Button><Button variant="ghost">Cancel</Button><Button variant="destructive">Delete project</Button></div>,
    props: [
      { name: "variant", type: '"primary" | "secondary" | "ghost" | "outline" | "destructive" | "link"', default: '"primary"', description: "Visual and semantic treatment." },
      { name: "size", type: '"sm" | "md" | "lg" | "icon"', default: '"md"', description: "Control height and padding." },
      { name: "loading", type: "boolean", default: "false", description: "Disables the button and renders a progress spinner." },
      { name: "icon", type: "ReactNode", description: "Optional leading or trailing icon." },
      { name: "iconPosition", type: '"left" | "right"', default: '"left"', description: "Placement of the icon slot." },
      { name: "disabled", type: "boolean", default: "false", description: "Native disabled state." },
    ],
    accessibility: "Renders a native button with type=\"button\" by default. Loading sets disabled and aria-busy. Icon-only buttons should use size=\"icon\" and provide an aria-label.",
  }),
  "components/input": () => ({
    code: `<Input label="Project name" hint="Used in URLs and logs." placeholder="api-gateway" />\n<Input label="Email" error="Enter a valid email address." defaultValue="ops@" />`,
    preview: <div className="demo-form-grid"><Input label="Project name" hint="Used in URLs and logs." placeholder="api-gateway" /><Input label="Email" error="Enter a valid email address." defaultValue="ops@" /></div>,
    props: [
      { name: "label", type: "string", description: "Associated field label." }, { name: "hint", type: "string", description: "Supporting description shown when valid." },
      { name: "error", type: "string", description: "Error message; also sets aria-invalid." }, { name: "prefix / suffix", type: "ReactNode", description: "Content rendered before or after the input." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Control density." }, { name: "required", type: "boolean", default: "false", description: "Native required state with visible and screen-reader label cues." },
    ],
    accessibility: "A stable ID is generated with useId when no id is supplied. Labels use htmlFor, and hint or error text is connected through aria-describedby.",
  }),
  "components/textarea": () => ({
    code: `<Textarea label="Release notes" hint="Summarize customer-visible changes." rows={5} />`,
    preview: <Textarea label="Release notes" hint="Summarize customer-visible changes." rows={5} placeholder="Added audit log exports…" wrapperClassName="w-full max-w-lg" />,
    props: [{ name: "label", type: "string", description: "Associated field label." },{ name: "hint", type: "string", description: "Supporting field text." },{ name: "error", type: "string", description: "Validation message and invalid state." },{ name: "rows", type: "number", description: "Native visible row count." }],
    accessibility: "Uses a native textarea with generated label and message associations.",
  }),
  "components/select": () => ({
    code: `<Select\n  label="Region"\n  value={region}\n  onChange={setRegion}\n  options={[\n    { value: "iad1", label: "US East — Virginia" },\n    { value: "fra1", label: "EU Central — Frankfurt" },\n  ]}\n/>`,
    preview: <StatefulSelectPreview />,
    props: [{ name: "options", type: "SelectItem[]", description: "Options or grouped options." },{ name: "multiple", type: "boolean", default: "false", description: "Switches between scalar and array values." },{ name: "value", type: "string | string[]", description: "Controlled selected value." },{ name: "defaultValue", type: "string | string[]", description: "Initial uncontrolled value." },{ name: "onChange", type: "(value) => void", description: "Called when selection changes." },{ name: "label / hint / error", type: "string", description: "Accessible field messaging." }],
    accessibility: "The trigger exposes combobox semantics and controls a listbox. Options support keyboard navigation, selection, dismissal with Escape, and disabled states.",
  }),
  "components/checkbox": () => ({
    code: `<Checkbox label="Require review" description="A reviewer must approve production changes." defaultChecked />\n<Checkbox label="Override policy" indeterminate />`,
    preview: <div className="demo-stack"><Checkbox label="Require review" description="A reviewer must approve production changes." defaultChecked /><Checkbox label="Override policy" indeterminate /></div>,
    props: [{ name: "label", type: "string", description: "Clickable control label." },{ name: "description", type: "string", description: "Associated supporting text." },{ name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Control and label scale." },{ name: "indeterminate", type: "boolean", default: "false", description: "Mixed selection state." },{ name: "error", type: "string", description: "Associated invalid-state message." }],
    accessibility: "Uses a native checkbox. Indeterminate state is mirrored to the DOM property and aria-checked=\"mixed\".",
  }),
  "components/switch": () => ({
    code: `<Switch\n  label="Deployment notifications"\n  description="Email me when a deployment finishes."\n  checked={enabled}\n  onCheckedChange={setEnabled}\n/>`,
    preview: <StatefulSwitchPreview />,
    props: [{ name: "label", type: "string", description: "Clickable setting label." },{ name: "description", type: "string", description: "Supporting text." },{ name: "checked", type: "boolean", description: "Controlled state." },{ name: "onCheckedChange", type: "(checked: boolean) => void", description: "Called after user interaction." },{ name: "size", type: '"sm" | "md"', default: '"md"', description: "Switch scale." }],
    accessibility: "Uses a native checkbox so Space, focus, form behavior, and disabled semantics remain available.",
  }),
  "components/radio-group": () => ({
    code: `<RadioGroup label="Workspace visibility" value={value} onChange={setValue}>\n  <Radio value="private" label="Private" />\n  <Radio value="team" label="Organization" />\n</RadioGroup>`,
    preview: <RadioPreview />,
    props: [{ name: "value", type: "string", description: "Selected radio value." },{ name: "onChange", type: "(value: string) => void", description: "Selection callback." },{ name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Layout direction." },{ name: "label / hint / error", type: "string", description: "Group-level messaging." }],
    accessibility: "The group supplies one generated name to its native radio inputs and connects group-level hint and error text.",
  }),
  "components/badge": () => ({
    code: `<Badge>Active</Badge>\n<Badge variant="success" dot>Healthy</Badge>\n<Badge variant="warning">Review</Badge>\n<Badge variant="error">Failed</Badge>\n<Badge variant="info">Queued</Badge>\n<Badge variant="muted">Draft</Badge>`,
    preview: <div className="demo-row"><Badge>Active</Badge><Badge variant="success" dot>Healthy</Badge><Badge variant="warning">Review</Badge><Badge variant="error">Failed</Badge><Badge variant="info">Queued</Badge><Badge variant="muted">Draft</Badge></div>,
    props: [{ name: "variant", type: '"default" | "success" | "warning" | "error" | "info" | "muted"', default: '"default"', description: "Semantic color treatment." },{ name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Badge density." },{ name: "dot", type: "boolean", default: "false", description: "Adds a leading status dot." }],
    accessibility: "Badge is non-interactive metadata. Do not communicate meaning through color alone; keep descriptive text in the badge.",
  }),
  "components/card": () => ({
    code: `<Card>\n  <CardHeader>\n    <CardTitle>Production API</CardTitle>\n    <CardDescription>Last deployed 8 minutes ago</CardDescription>\n  </CardHeader>\n  <CardBody>99.99% availability</CardBody>\n  <CardFooter><Button size="sm">View service</Button></CardFooter>\n</Card>`,
    preview: <Card className="w-full max-w-md"><CardHeader><CardTitle>Production API</CardTitle><CardDescription>Last deployed 8 minutes ago</CardDescription></CardHeader><CardBody><div className="service-row"><span><Badge variant="success" dot>Healthy</Badge></span><strong>99.99% availability</strong></div></CardBody><CardFooter><Button size="sm">View service</Button></CardFooter></Card>,
    props: [{ name: "variant", type: '"default" | "elevated" | "bordered" | "glass" | "flush"', default: '"default"', description: "Surface treatment." },{ name: "className", type: "string", description: "Composes consumer layout and one-off styles." },{ name: "unstyled", type: "boolean", default: "false", description: "Removes library visual styles." }],
    accessibility: "Card is a visual grouping and renders a div. Choose an article, section, or accessible label in the surrounding composition when the content requires stronger semantics.",
  }),
  "components/alert": () => ({
    code: `<Alert variant="success" title="Deployment complete">\n  Production is serving the new release.\n</Alert>\n<Alert variant="warning" title="Action required">\n  Add a payment method before the next renewal.\n</Alert>`,
    preview: <div className="demo-stack w-full"><Alert variant="success" title="Deployment complete">Production is serving the new release.</Alert><Alert variant="warning" title="Action required">Add a payment method before the next renewal.</Alert></div>,
    props: [{ name: "variant", type: '"info" | "success" | "warning" | "error"', default: '"info"', description: "Feedback severity." },{ name: "title", type: "string", description: "Concise feedback heading." },{ name: "dismissable", type: "boolean", default: "false", description: "Displays a dismiss action." },{ name: "onDismiss", type: "() => void", description: "Dismiss callback." }],
    accessibility: "Warning and error variants use role=\"alert\". Other variants use role=\"status\". Dismiss actions have an accessible name.",
  }),
  "components/modal": () => ({
    code: `<Modal\n  open={open}\n  onClose={() => setOpen(false)}\n  title="Create API key"\n  description="The secret is shown only once."\n>\n  <Input label="Key name" />\n</Modal>`,
    preview: <StatefulModalPreview />,
    props: [{ name: "open", type: "boolean", description: "Controls presence of the dialog." },{ name: "onClose", type: "() => void", description: "Requested by Escape, overlay, or close button." },{ name: "size", type: '"sm" | "md" | "lg" | "xl" | "2xl" | "7xl" | "full"', default: '"md"', description: "Maximum panel width." },{ name: "title / description", type: "string", description: "Visible text connected to dialog ARIA attributes." },{ name: "closeOnEscape", type: "boolean", default: "true", description: "Enables Escape dismissal." },{ name: "closeOnOverlayClick", type: "boolean", default: "true", description: "Enables backdrop dismissal." }],
    accessibility: "Uses role=\"dialog\" and aria-modal. Focus moves inside, cycles within the panel, and returns to the previous element after close. Escape closes by default.",
  }),
  "components/drawer": () => ({
    code: `<Drawer open={open} onClose={() => setOpen(false)} position="right" title="Deployment details">\n  <DeploymentDetails />\n</Drawer>`,
    preview: <StatefulDrawerPreview />,
    props: [{ name: "open", type: "boolean", description: "Controls presence." },{ name: "onClose", type: "() => void", description: "Close request callback." },{ name: "position", type: '"left" | "right" | "bottom"', default: '"left"', description: "Viewport edge." },{ name: "width", type: "number | string", default: "320", description: "Side drawer width." },{ name: "title", type: "ReactNode", description: "Visible, associated heading." }],
    accessibility: "Portals to document.body, traps focus, locks body scrolling, closes on Escape, and restores prior focus.",
  }),
  "components/tabs": () => ({
    code: `<Tabs defaultValue="overview">\n  <TabsList>\n    <TabsTrigger value="overview">Overview</TabsTrigger>\n    <TabsTrigger value="deployments">Deployments</TabsTrigger>\n  </TabsList>\n  <TabsContent value="overview">Service details</TabsContent>\n  <TabsContent value="deployments">Deployment history</TabsContent>\n</Tabs>`,
    preview: <Tabs defaultValue="overview" className="w-full max-w-lg"><TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="deployments">Deployments</TabsTrigger><TabsTrigger value="settings">Settings</TabsTrigger></TabsList><TabsContent value="overview"><p className="demo-panel-copy">The service is healthy in three regions.</p></TabsContent><TabsContent value="deployments"><p className="demo-panel-copy">The latest deployment completed 8 minutes ago.</p></TabsContent><TabsContent value="settings"><p className="demo-panel-copy">Automatic scaling is enabled.</p></TabsContent></Tabs>,
    props: [{ name: "defaultValue", type: "string", description: "Initial uncontrolled tab." },{ name: "value", type: "string", description: "Controlled active tab." },{ name: "onChange", type: "(value: string) => void", description: "Active-value callback." },{ name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Layout and arrow-key axis." }],
    accessibility: "Uses tablist, tab, and tabpanel roles with linked IDs. Arrow keys wrap; Home and End move to the first and last enabled tab.",
  }),
  "components/accordion": () => ({
    code: `<Accordion\n  defaultOpen={["billing"]}\n  items={[{\n    id: "billing",\n    trigger: "How does billing work?",\n    content: "Usage is invoiced monthly."\n  }]}\n/>`,
    preview: <Accordion className="w-full max-w-lg" defaultOpen={["billing"]} items={[{ id: "billing", trigger: "How does usage billing work?", content: "Usage is metered per workspace and invoiced at the end of each month." },{ id: "cancel", trigger: "Can I cancel a plan?", content: "Yes. Your plan stays active until the end of the billing period." }]} />,
    props: [{ name: "items", type: "AccordionItem[]", description: "ID, trigger, content, and optional disabled state." },{ name: "multiple", type: "boolean", default: "false", description: "Allows more than one panel to stay open." },{ name: "defaultOpen", type: "string[]", default: "[]", description: "Initially open item IDs." }],
    accessibility: "Each trigger is a button with aria-expanded and aria-controls. Panels use role=\"region\" and reference their trigger.",
  }),
  "components/dropdown-menu": () => ({
    code: `<DropdownMenu\n  trigger={<Button variant="secondary">Actions</Button>}\n  items={[\n    { label: "View logs", onClick: openLogs },\n    { label: "Delete service", destructive: true, onClick: remove },\n  ]}\n/>`,
    preview: <DropdownMenu ariaLabel="Service actions" align="end" trigger={<Button variant="secondary" icon={<MoreHorizontal size={15} />}>Actions</Button>} items={[{ label: "View logs", shortcut: "⌘L" },{ label: "Duplicate service" },{ group: "Danger zone", items: [{ label: "Delete service", destructive: true }]}]} />,
    props: [{ name: "trigger", type: "ReactNode", description: "Cloned trigger with menu ARIA state." },{ name: "items", type: "DropdownMenuSection[]", description: "Action items or labeled groups." },{ name: "side", type: '"bottom" | "top"', default: '"bottom"', description: "Vertical placement." },{ name: "align", type: '"start" | "end" | "center"', default: '"start"', description: "Horizontal alignment." },{ name: "ariaLabel", type: "string", default: '"Actions menu"', description: "Accessible menu name." }],
    accessibility: "Focus moves to the first enabled item. Arrow keys, Home, End, and Escape are supported; Escape restores focus to the trigger.",
  }),
  "components/tooltip": () => ({
    code: `<Tooltip content="Copy deployment URL" position="top">\n  <Button size="icon" variant="secondary" aria-label="Copy deployment URL">\n    <CopyIcon />\n  </Button>\n</Tooltip>`,
    preview: <Tooltip content="View deployment documentation"><Button size="icon" variant="secondary" aria-label="View deployment documentation"><CircleHelp size={16} /></Button></Tooltip>,
    props: [{ name: "content", type: "ReactNode", description: "Tooltip content." },{ name: "position", type: '"top" | "bottom" | "left" | "right"', default: '"top"', description: "Preferred placement." },{ name: "delayMs", type: "number", default: "0", description: "Delay before display." }],
    accessibility: "Appears on both hover and focus. The visible tooltip is connected to its trigger through aria-describedby.",
  }),
  "components/pagination": () => ({
    code: `<Pagination page={page} totalPages={7} onPageChange={setPage} />`,
    preview: <PaginationPreview />,
    props: [{ name: "page", type: "number", description: "Current one-based page." },{ name: "totalPages", type: "number", description: "Available page count." },{ name: "onPageChange", type: "(page: number) => void", description: "Navigation callback." },{ name: "siblingCount", type: "number", default: "1", description: "Adjacent visible pages." }],
    accessibility: "Uses a named navigation landmark, accessible labels for page controls, aria-current for the active page, and native disabled buttons at boundaries.",
  }),
  "components/progressbar": () => ({
    code: `<Progressbar value={72} label="Upload progress" showValue />`,
    preview: <div className="demo-stack w-full max-w-lg"><Progressbar value={72} label="Upload progress" showValue /><Progressbar value={34} variant="warning" size="sm" /></div>,
    props: [{ name: "value", type: "number", description: "Current progress value." },{ name: "max", type: "number", default: "100", description: "Completion value." },{ name: "variant", type: '"default" | "success" | "warning" | "error" | "info"', default: '"default"', description: "Semantic treatment." },{ name: "size", type: '"xs" | "sm" | "md" | "lg"', default: '"md"', description: "Track height." }],
    accessibility: "Exposes progressbar semantics with current minimum, maximum, and value information.",
  }),
  "components/skeleton": () => ({
    code: `<div className="space-y-3">\n  <Skeleton className="h-4 w-40" />\n  <Skeleton className="h-3 w-full" />\n  <Skeleton className="h-3 w-2/3" />\n</div>`,
    preview: <div className="skeleton-demo"><div className="skeleton-avatar"><Skeleton className="size-10 rounded-full" /><div><Skeleton className="h-3 w-32" /><Skeleton className="mt-2 h-3 w-48" /></div></div><Skeleton className="h-20 w-full" /></div>,
    props: [{ name: "width", type: "string | number", description: "Inline width for the placeholder." },{ name: "height", type: "string | number", description: "Inline height for the placeholder." },{ name: "rounded", type: '"sm" | "md" | "lg" | "full"', default: '"md"', description: "Placeholder corner radius." },{ name: "className", type: "string", description: "Composes final dimensions and layout." }],
    accessibility: "Skeletons are visual placeholders. Apply an accessible busy state and label to the containing region when loading affects user understanding.",
  }),
}

function ComponentReferencePage({ page }: { page: DocsPage }) {
  const getDetail = details[page.slug] ?? supplementalDetails[page.slug]
  if (!getDetail) throw new Error(`Missing interactive demo details for ${page.slug}`)
  const detail = getDetail()
  const importName = page.importName ?? page.title.replace(/\s+/g, "")
  const importCode = `import { ${importName} } from "@bzync/rui"`
  return <>
    <PageIntro eyebrow={`Components / ${page.group}`} title={page.title} description={page.description} />
    <DocsSection id="usage" title="Usage">
      <CopyCommand>{importCode}</CopyCommand>
      <ComponentPreview key={page.slug} title={`${page.title} preview`} code={detail.code}>{detail.preview}</ComponentPreview>
    </DocsSection>
    <DocsSection id="accessibility" title="Accessibility">
      <p>{detail.accessibility}</p>
    </DocsSection>
    <DocsSection id="api-reference" title="API reference">
      <PropsTable caption={`${page.title} props`} props={detail.props} />
    </DocsSection>
  </>
}

export function ComponentsPage({ page }: { page: DocsPage }) {
  if (page.slug === "components") return <ComponentsOverviewPage />
  return <ComponentReferencePage page={page} />
}
