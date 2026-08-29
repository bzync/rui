"use client"

import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  DataTable,
  Drawer,
  DropdownMenu,
  EmptyState,
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
  type ColumnDef,
} from "@bzync/rui"
import {
  Check,
  ChevronRight,
  CircleHelp,
  Coffee,
  Database,
  FileCheck2,
  KeyRound,
  Layers3,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  UserPlus,
} from "lucide-react"
import { type ReactNode, useMemo, useRef, useState } from "react"
import { RuiBrandMark } from "../_shared/brand"
import { componentGroups, hrefFor, type DocsPage } from "./catalog"
import { supplementalDetails } from "./component-details"
import {
  ComponentPreview,
  CopyCommand,
  DocsCallout,
  DocsSection,
  PageIntro,
  PageLink,
  PropsTable,
  type ApiProp,
} from "./primitives"

const quickStartCode = `import "@bzync/rui/styles.css"
import { Button, ThemeProvider } from "@bzync/rui"

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" applyToRoot>
      <Button>Review orders</Button>
    </ThemeProvider>
  )
}`

const subpathCode = `import "@bzync/rui/styles.css"
import { Button } from "@bzync/rui/button"
import { Select } from "@bzync/rui/select"`

const componentCount = componentGroups.reduce((count, group) => count + group.pages.length, 0)

function IntroductionExample() {
  const [requiresApproval, setRequiresApproval] = useState(true)
  const [saved, setSaved] = useState(false)

  return (
    <div className="docs-home-example" aria-label="Interactive project settings example built with rui">
      <div className="docs-home-example-header">
        <div><strong>Project access</strong><span>Real rui components</span></div>
        <a href={hrefFor("components/input")}>View component</a>
      </div>
      <form onSubmit={(event) => { event.preventDefault(); setSaved(true) }}>
        <Input label="Project name" defaultValue="api-gateway" onChange={() => setSaved(false)} />
        <Switch
          checked={requiresApproval}
          onCheckedChange={(checked) => { setRequiresApproval(checked); setSaved(false) }}
          label="Require deployment approval"
          description="A reviewer must approve production changes."
        />
        <div className="docs-home-example-actions">
          <span role="status" aria-live="polite">{saved ? "Changes saved." : "Ready to configure."}</span>
          <Button type="submit" size="sm">Save changes</Button>
        </div>
      </form>
    </div>
  )
}

function IntroductionPage() {
  return <>
    <div className="docs-home-intro">
      <PageIntro
        eyebrow="React + Tailwind CSS"
        title="@bzync/rui"
        description="Production-ready React components built with Tailwind CSS. Typed APIs, scoped theming, accessible interaction patterns, and explicit package entry points."
      >
        <Button asChild><a href={hrefFor("docs/installation")}>Get started</a></Button>
        <Button asChild variant="secondary"><a href={hrefFor("components")}>Browse components</a></Button>
        <span className="docs-hero-note"><ShieldCheck size={14} aria-hidden="true" /> React 18.2 and 19</span>
        <a className="docs-hero-support" href="https://buymeacoffee.com/adminjw" target="_blank" rel="noreferrer">
          <Coffee size={17} aria-hidden="true" />
          <span><strong>Support</strong><small>If @bzync/rui is useful to you, you can support its continued development on Buy Me a Coffee.</small></span>
        </a>
      </PageIntro>
      <IntroductionExample />
    </div>

    <DocsSection id="install" title="Install and import">
      <CopyCommand>npm install @bzync/rui framer-motion</CopyCommand>
      <p>React 18.2 or React 19 and React DOM are peer dependencies. Import <code>@bzync/rui/styles.css</code> once at your application root, then import from the root package or a component subpath.</p>
    </DocsSection>

    <DocsSection id="first-component" title="Your first workflow" description="The provider scopes theme tokens to its children. Use applyToRoot when overlays and the whole document should share the theme.">
      <ComponentPreview title="Approval queue" code={quickStartCode}>
        <div className="intro-preview-copy">
          <div><span className="intro-preview-kicker">Procurement / Approvals</span><strong>2 purchase orders need review</strong></div>
          <Button icon={<FileCheck2 size={15} aria-hidden="true" />}>Review orders</Button>
        </div>
      </ComponentPreview>
    </DocsSection>

    <DocsSection id="package-architecture" title="Package architecture">
      <div className="docs-fact-grid">
        <div><strong>{componentCount} documented APIs</strong><span>Forms, data, overlays, charts, and navigation</span></div>
        <div><strong>React 18.2 + 19</strong><span>Stable compatibility across application stacks</span></div>
        <div><strong>ESM + CJS</strong><span>Root and component entry points</span></div>
        <div><strong>TypeScript</strong><span>Declarations for every public entry</span></div>
      </div>
      <DocsCallout title="CSS is included once">
        Import <code>@bzync/rui/styles.css</code> near your application root. Components use semantic CSS variables, so consumers do not need Tailwind configured to render the published styles.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="principles" title="Designed for product work" description="The package favors explicit behavior, compact product interfaces, and composition over a prescriptive application aesthetic.">
      <dl className="docs-principles-list">
        <div><dt>Accessible interactions</dt><dd>Focus management, keyboard behavior, labels, and native semantics are part of the component contract.</dd></div>
        <div><dt>Scoped theming</dt><dd>Accent, neutral, semantic, and mode-specific values are expressed as CSS variables inside ThemeProvider.</dd></div>
        <div><dt>Predictable distribution</dt><dd>Typed ESM and CommonJS entries are available from the root package and explicit component subpaths.</dd></div>
      </dl>
      <nav className="docs-related-links" aria-label="Related documentation">
        <a href={hrefFor("foundations/accessibility")}><span>Accessibility</span><small>Focus, keyboard behavior, semantics, and verification.</small></a>
        <a href={hrefFor("docs/configuration")}><span>Theme configuration</span><small>Accent, neutral, semantic, and mode-specific tokens.</small></a>
        <a href={hrefFor("examples/settings")}><span>Application examples</span><small>Components composed in realistic product interfaces.</small></a>
        <a href={hrefFor("resources/component-api")}><span>Component API</span><small>Public inventory and source-verified contracts.</small></a>
      </nav>
    </DocsSection>
  </>
}

function InstallationPage() {
  return <>
    <PageIntro eyebrow="Getting Started" title="Installation" description="Install the package and its runtime peer dependencies, then load the stylesheet once." />
    <DocsSection id="package" title="Package">
      <CopyCommand>npm install @bzync/rui framer-motion</CopyCommand>
      <p>This repository is published and developed with npm. The package contains both ESM and CommonJS builds.</p>
    </DocsSection>
    <DocsSection id="styles" title="Styles">
      <ComponentPreview title="Application entry" code={`import "@bzync/rui/styles.css"\n\nimport { createRoot } from "react-dom/client"\nimport App from "./App"\n\ncreateRoot(document.getElementById("root")!).render(<App />)`}>
        <div className="install-diagram"><code>main.tsx</code><ChevronRight size={15} /><code>@bzync/rui/styles.css</code><ChevronRight size={15} /><span>components</span></div>
      </ComponentPreview>
    </DocsSection>
    <DocsSection id="peer-dependencies" title="Peer dependencies">
      <div className="docs-table-wrap"><table className="docs-props-table"><thead><tr><th>Package</th><th>Supported range</th><th>Purpose</th></tr></thead><tbody>
        <tr><td><code>react</code></td><td><code>^18.2.0 || ^19.0.0</code></td><td>Component runtime</td></tr>
        <tr><td><code>react-dom</code></td><td><code>^18.2.0 || ^19.0.0</code></td><td>Portals and DOM rendering</td></tr>
        <tr><td><code>framer-motion</code></td><td><code>^13.1.0</code></td><td>Overlay and interaction motion</td></tr>
      </tbody></table></div>
    </DocsSection>
    <DocsSection id="imports" title="Imports">
      <p>Use the root entry for convenience, or component subpaths when you want explicit entry points.</p>
      <ComponentPreview title="Subpath imports" code={subpathCode}><div className="import-preview"><code>@bzync/rui/button</code><code>@bzync/rui/select</code><code>@bzync/rui/styles.css</code></div></ComponentPreview>
    </DocsSection>
  </>
}

function QuickStartPage() {
  return <>
    <PageIntro eyebrow="Getting Started" title="Quick Start" description="Create a themed application root and render a component using its real public API." />
    <DocsSection id="provider" title="Add the provider">
      <p><code>ThemeProvider</code> supplies color, surface, focus, radius, and typography variables. The default preference is <code>system</code>.</p>
      <DocsCallout title="Portals and document surfaces">Use <code>applyToRoot</code> for full-page applications so drawers, select lists, and other portals inherit the resolved theme.</DocsCallout>
    </DocsSection>
    <DocsSection id="render-a-component" title="Render a component">
      <ComponentPreview code={quickStartCode}><Button icon={<Plus size={15} />}>Create project</Button></ComponentPreview>
    </DocsSection>
    <DocsSection id="next-steps" title="Next steps">
      <div className="docs-link-grid">
        <PageLink slug="components/button" title="Button" description="Variants, sizes, loading, and accessibility." />
        <PageLink slug="docs/configuration" title="Configuration" description="Theme and typography configuration." />
        <PageLink slug="patterns/forms" title="Form pattern" description="Compose labels, validation, and actions." />
        <PageLink slug="examples/settings" title="Settings example" description="A production-oriented component composition." />
      </div>
    </DocsSection>
  </>
}

function ConfigurationPage() {
  const themeCode = `const indigo = {
  50: "#eef2ff",
  500: "#6366f1",
  600: "#4f46e5",
  700: "#4338ca",
} as const

<ThemeProvider
  defaultTheme="system"
  applyToRoot
  palette={{ accent: indigo }}
  lightPalette={{ colors: { bg: "#f8fafc" } }}
  darkPalette={{ colors: { bg: "#090d14" } }}
>
  <App />
</ThemeProvider>`
  return <>
    <PageIntro eyebrow="Getting Started" title="Configuration" description="Configure the package through providers and typed theme values; no runtime CSS-in-JS is required." />
    <DocsSection id="theme-provider" title="Theme provider"><ComponentPreview code={themeCode}><div className="theme-sample"><Button>Deploy service</Button><Badge variant="success">Healthy</Badge><Input label="Environment" defaultValue="production" /></div></ComponentPreview></DocsSection>
    <DocsSection id="palette" title="Palette and tokens">
      <p><code>palette</code> applies to both modes. <code>lightPalette</code> and <code>darkPalette</code> layer mode-specific values over it. Accent values map to both <code>--color-accent-*</code> and the legacy blue scale.</p>
      <PropsTable caption="Theme palette fields" props={[
        { name: "accent", type: "ColorPalette", description: "Primary action and selected-state scale." },
        { name: "neutral", type: "ColorPalette", description: "Slate and gray neutral scales." },
        { name: "colors", type: "ThemeColors", description: "Semantic application colors such as bg, surface, and border." },
        { name: "radius", type: "ThemeRadius", description: "sm through 2xl and full radii." },
        { name: "fonts", type: "ThemeFonts", description: "Sans, mono, display, and heading stacks." },
        { name: "tokens", type: "ThemeTokens", description: "Escape hatch for arbitrary custom properties." },
      ]} />
    </DocsSection>
    <DocsSection id="package-imports" title="Package imports"><ComponentPreview code={subpathCode}><div className="import-preview"><Badge variant="muted">root entry</Badge><Badge variant="muted">subpath entry</Badge><Badge variant="muted">single stylesheet</Badge></div></ComponentPreview></DocsSection>
  </>
}

const semanticColors = [
  ["Background", "bg-bg", "var(--color-bg)"], ["Surface", "bg-surface", "var(--color-surface)"],
  ["Raised", "bg-surface-raised", "var(--color-surface-raised)"], ["Muted", "bg-muted", "var(--color-muted)"],
  ["Primary", "bg-primary", "var(--color-primary)"], ["Destructive", "bg-destructive", "var(--color-destructive)"],
  ["Success", "bg-success", "var(--color-success)"], ["Warning", "bg-warning", "var(--color-warning)"],
]

const radiusTokens = [
  { name: "sm", value: "4px", usage: "Compact controls" },
  { name: "md", value: "6px", usage: "Inputs and buttons" },
  { name: "lg", value: "8px", usage: "Panels and previews" },
  { name: "xl", value: "10px", usage: "Menus and dialogs" },
  { name: "2xl", value: "12px", usage: "Large surfaces" },
] as const

const shadowTokens = [
  {
    name: "raised",
    level: "Low",
    usage: "Controls and static raised surfaces",
    light: "0 1px 2px rgba(9, 14, 28, 0.05)",
    dark: "0 1px 1px rgb(0 0 0 / 0.28), 0 8px 20px -16px rgb(0 0 0 / 0.75)",
  },
  {
    name: "floating",
    level: "Medium",
    usage: "Menus, popovers, and floating controls",
    light: "0 8px 24px -10px rgba(9, 14, 28, 0.20), 0 2px 6px -3px rgba(9, 14, 28, 0.10)",
    dark: "0 16px 36px -14px rgb(0 0 0 / 0.72), 0 4px 10px -5px rgb(0 0 0 / 0.60)",
  },
  {
    name: "overlay",
    level: "High",
    usage: "Modal and drawer surfaces",
    light: "0 24px 60px -24px rgba(9, 14, 28, 0.40), 0 8px 20px -12px rgba(9, 14, 28, 0.18)",
    dark: "0 28px 72px -24px rgb(0 0 0 / 0.86), 0 10px 24px -12px rgb(0 0 0 / 0.70)",
  },
] as const

function FoundationPage({ page }: { page: DocsPage }) {
  if (page.slug === "foundations/colors") return <>
    <PageIntro eyebrow="Foundations" title="Colors" description="Components use semantic color roles backed by customizable palettes and mode-specific theme values." />
    <DocsSection id="semantic-tokens" title="Semantic tokens"><div className="color-token-grid">{semanticColors.map(([name, utility, value]) => <div key={name} className="color-token"><span style={{ background: value }} /><div><strong>{name}</strong><code>{utility}</code></div></div>)}</div></DocsSection>
    <DocsSection id="accent-scale" title="Accent scale"><div className="accent-scale">{[50,100,200,300,400,500,600,700,800,900,950].map((shade) => <div key={shade}><span style={{ background: `var(--color-accent-${shade})` }} /><code>{shade}</code></div>)}</div></DocsSection>
    <DocsSection id="mode-overrides" title="Mode overrides"><p>Define shared brand values in <code>palette</code>, then override surface or semantic values in <code>lightPalette</code> and <code>darkPalette</code>. The docs theme control in the header uses the same provider.</p></DocsSection>
  </>
  if (page.slug === "foundations/typography") return <>
    <PageIntro eyebrow="Foundations" title="Typography" description="A compact type system for product interfaces, documentation, data, and source code." />
    <DocsSection id="families" title="Families"><p>One sans does interface and heading work through weight and tracking; <code>--font-display</code> mirrors <code>--font-sans</code> so nothing depends on a second face. Point <code>--font-display</code> at a display family through <code>ThemeProvider</code> to add one without touching body copy.</p><div className="type-specimens"><div><small>Interface &amp; headings</small><p className="type-sans">Inter Variable / system fallback</p><code>--font-sans</code></div><div><small>Code &amp; data</small><p className="type-mono">const status = "ready"</p><code>--font-mono</code></div></div></DocsSection>
    <DocsSection id="scale" title="Scale"><div className="type-scale"><div className="type-32">Documentation title</div><div className="type-24">Section heading</div><div className="type-16">Product interface text</div><div className="type-14">Controls and descriptions</div><div className="type-12">Metadata and labels</div></div></DocsSection>
    <DocsSection id="code" title="Code typography"><p>Commands, package names, prop values, shortcuts, and source examples use the monospace stack. Inline code stays close to the surrounding text size.</p><CopyCommand>npm install @bzync/rui framer-motion</CopyCommand></DocsSection>
  </>
  if (page.slug === "foundations/spacing") return <>
    <PageIntro eyebrow="Foundations" title="Spacing" description="A compact rhythm keeps application interfaces efficient while preserving readable grouping." />
    <DocsSection id="rhythm" title="Rhythm"><div className="spacing-list">{[1,2,3,4,6,8,10,12,16].map((unit) => <div key={unit}><code>{unit}</code><span style={{ width: `${unit * 4}px` }} /><small>{unit * 4}px</small></div>)}</div></DocsSection>
    <DocsSection id="application" title="Application"><p>Controls generally use 8–16px internal gaps. Related fields use 16–24px vertical spacing. Documentation sections use 48–64px to preserve scanability without becoming sparse.</p></DocsSection>
  </>
  if (page.slug === "foundations/radius") return <>
    <PageIntro eyebrow="Foundations" title="Radius & shadows" description="Shape and depth clarify hierarchy without turning every section into a floating card." />
    <DocsSection id="radius" title="Radius" description="Each specimen uses the published token on the same 88 × 64px shape, so only the corner geometry changes.">
      <div className="radius-grid">
        {radiusTokens.map(({ name, value, usage }) => (
          <figure key={name}>
            <div className="radius-swatch" style={{ borderRadius: `var(--radius-${name})` }}><span aria-hidden="true" /></div>
            <figcaption><code>--radius-{name}</code><strong>{value}</strong><small>{usage}</small></figcaption>
          </figure>
        ))}
      </div>
    </DocsSection>
    <DocsSection id="shadows" title="Shadows" description="The library uses separate light and dark elevation recipes. Compare each published token side by side; the page theme does not hide the opposite mode.">
      <div className="shadow-comparison">
        <div className="shadow-comparison-head" aria-hidden="true"><span>Token</span><span>Light</span><span>Dark</span></div>
        {shadowTokens.map(({ name, level, usage, light, dark }) => (
          <div className="shadow-comparison-row" key={name}>
            <div className="shadow-meta"><strong>{level} elevation</strong><code>--shadow-{name}</code><small>{usage}</small></div>
            <div className="shadow-mode-cell light-sample" aria-label={`${level} elevation in light mode`}><span className="shadow-swatch" style={{ boxShadow: light }} /></div>
            <div className="shadow-mode-cell dark-sample" aria-label={`${level} elevation in dark mode`}><span className="shadow-swatch" style={{ boxShadow: dark }} /></div>
          </div>
        ))}
      </div>
    </DocsSection>
  </>
  return <AccessibilityPage />
}

function AccessibilityPage() {
  return <>
    <PageIntro eyebrow="Foundations" title="Accessibility" description="Accessibility behavior is implemented in component semantics and interaction contracts, then verified in tests." />
    <DocsSection id="keyboard" title="Keyboard interaction"><p>Tabs use arrow keys, Home, and End. Menus use arrow keys and Escape. Select and Autocomplete expose combobox/listbox semantics. Native buttons and inputs retain their expected keyboard behavior.</p></DocsSection>
    <DocsSection id="focus" title="Focus behavior"><p>Modal and Drawer trap focus while open, close on Escape by default, lock document scrolling, and restore the previously focused element on unmount.</p></DocsSection>
    <DocsSection id="semantics" title="Semantics"><p>Field components associate labels with controls through generated IDs and connect hints or errors with <code>aria-describedby</code>. Invalid states use <code>aria-invalid</code>. Overlays expose dialog roles and accessible names.</p></DocsSection>
    <DocsSection id="motion" title="Reduced motion"><p>Animations run inside the <code>.rui-theme</code> scope. The stylesheet reduces animation and transition duration when <code>prefers-reduced-motion: reduce</code> is active.</p></DocsSection>
    <DocsSection id="verification" title="Verification"><DocsCallout title="Verify your composition">The library provides accessible primitives, but the final label, content order, contrast, and workflow remain the application’s responsibility. Test with a keyboard and your supported screen-reader/browser combinations.</DocsCallout></DocsSection>
  </>
}

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

function FormsPattern() {
  const [plan, setPlan] = useState("pro")
  return <>
    <PageIntro eyebrow="Patterns" title="Forms" description="Compose labels, supporting text, validation, and actions into a predictable form flow." />
    <DocsSection id="structure" title="Structure"><p>Use one visible label per field, keep help close to its control, and place the primary action after the final field. Reserve placeholders for examples—not labels.</p></DocsSection>
    <DocsSection id="validation" title="Validation"><p>Prefer inline errors after validation. Input, Textarea, Select, Checkbox, and RadioGroup connect error content through ARIA attributes.</p></DocsSection>
    <DocsSection id="example" title="Example"><ComponentPreview align="start" code={`<form onSubmit={save}>\n  <Input label="Workspace name" required />\n  <Select label="Plan" options={plans} />\n  <Checkbox label="Enable audit exports" />\n  <Button type="submit">Save workspace</Button>\n</form>`}><form className="pattern-form" onSubmit={(event) => event.preventDefault()}><Input label="Workspace name" defaultValue="Platform engineering" required /><Select label="Plan" value={plan} onChange={setPlan} options={[{ value: "starter", label: "Starter" }, { value: "pro", label: "Pro" }]} /><Checkbox label="Enable audit exports" description="Send a daily archive to object storage." defaultChecked /><div className="demo-actions"><Button type="submit">Save workspace</Button><Button variant="secondary">Cancel</Button></div></form></ComponentPreview></DocsSection>
  </>
}

type Member = { id: number; name: string; email: string; role: string; status: string }
const members: Member[] = [
  { id: 1, name: "Maya Chen", email: "maya@acme.dev", role: "Owner", status: "Active" },
  { id: 2, name: "Jordan Kim", email: "jordan@acme.dev", role: "Developer", status: "Active" },
  { id: 3, name: "Sam Rivera", email: "sam@acme.dev", role: "Viewer", status: "Invited" },
]
const memberColumns: ColumnDef<Member>[] = [
  { key: "name", header: "Member", searchable: true, sortable: true, cell: row => <div className="member-cell"><Avatar name={row.name} size="sm" /><span><strong>{row.name}</strong><small>{row.email}</small></span></div> },
  { key: "role", header: "Role", searchable: true, sortable: true, cell: row => row.role },
  { key: "status", header: "Status", searchable: true, cell: row => <Badge variant={row.status === "Active" ? "success" : "muted"} dot>{row.status}</Badge> },
  { key: "actions", header: <span className="sr-only">Actions</span>, align: "right", cell: () => <Button variant="ghost" size="icon" aria-label="Member actions"><MoreHorizontal size={15} /></Button> },
]

function DataPattern() {
  return <>
    <PageIntro eyebrow="Patterns" title="Data display" description="Choose semantic table primitives for static data and DataTable when users need sorting, search, and pagination." />
    <DocsSection id="table-choice" title="Choose the right table"><p>Use <code>Table</code> when the data and interactions are application-specific. Use <code>DataTable</code> for the standard searchable, sortable, paginated workflow.</p></DocsSection>
    <DocsSection id="actions" title="Actions"><p>Keep a consistent action column, give icon-only actions an accessible label, and avoid hiding the only path to a critical task inside row hover state.</p></DocsSection>
    <DocsSection id="example" title="Example"><ComponentPreview align="start" code={`<DataTable\n  ariaLabel="Team members"\n  columns={memberColumns}\n  data={members}\n  searchable\n  pageSizeOptions={false}\n/>`}><div className="w-full"><DataTable ariaLabel="Team members" columns={memberColumns} data={members} searchable searchPlaceholder="Search members…" pageSizeOptions={false} /></div></ComponentPreview></DocsSection>
  </>
}

function FeedbackPattern() {
  return <>
    <PageIntro eyebrow="Patterns" title="Feedback" description="Match the feedback surface to urgency, persistence, and whether the user must act." />
    <DocsSection id="choose" title="Choose a surface"><div className="decision-list"><div><Badge variant="info">Alert</Badge><p>Persistent page or section-level status.</p></div><div><Badge variant="success">Snackbar</Badge><p>Transient confirmation after an action.</p></div><div><Badge variant="warning">Modal</Badge><p>Blocking decision or focused task.</p></div><div><Badge variant="muted">Empty state</Badge><p>Absence of content with a useful next action.</p></div></div></DocsSection>
    <DocsSection id="severity" title="Severity"><p>Use semantic variants consistently. Error and warning alerts announce immediately; reserve those roles for information that genuinely needs attention.</p></DocsSection>
    <DocsSection id="example" title="Example"><div className="demo-stack"><Alert variant="error" title="Deployment failed">The health check did not pass. The previous release remains active.</Alert><Alert variant="info" title="Maintenance scheduled">Database maintenance starts Friday at 02:00 UTC.</Alert></div></DocsSection>
  </>
}

function EmptyStatesPattern() {
  return <>
    <PageIntro eyebrow="Patterns" title="Empty states" description="Explain why content is absent and offer the most useful available next step." />
    <DocsSection id="content" title="Content"><p>Name the missing object, explain the value of creating or connecting one, and avoid blaming the user. Keep the description short.</p></DocsSection>
    <DocsSection id="actions" title="Actions"><p>Use one primary action when the user can resolve the state. Add a secondary learning action only when it materially helps.</p></DocsSection>
    <DocsSection id="example" title="Example"><ComponentPreview code={`<EmptyState\n  icon={<Database />}\n  title="No databases yet"\n  description="Create a database to store application data."\n  action={<Button>Create database</Button>}\n/>`}><EmptyState icon={<Database />} title="No databases yet" description="Create a database to store application data." action={<Button icon={<Plus size={15} />}>Create database</Button>} /></ComponentPreview></DocsSection>
  </>
}

function PatternPage({ page }: { page: DocsPage }) {
  if (page.slug === "patterns/forms") return <FormsPattern />
  if (page.slug === "patterns/data-display") return <DataPattern />
  if (page.slug === "patterns/feedback") return <FeedbackPattern />
  return <EmptyStatesPattern />
}

function SettingsExample() {
  const [product, setProduct] = useState(true)
  const [security, setSecurity] = useState(true)
  const [summary, setSummary] = useState(false)
  return <>
    <PageIntro eyebrow="Examples" title="Settings" description="A realistic account settings composition using cards, fields, switches, and restrained feedback." />
    <DocsSection id="preview" title="Preview"><div className="app-example settings-example"><div className="example-heading"><div><h2>Notification settings</h2><p>Choose how and when the team contacts you.</p></div><Badge variant="muted">Account</Badge></div><Card><CardHeader><CardTitle>Email notifications</CardTitle><CardDescription>Sent to maya@acme.dev</CardDescription></CardHeader><CardBody className="settings-list"><Switch checked={product} onCheckedChange={setProduct} label="Product updates" description="New features and important product changes." /><Switch checked={security} onCheckedChange={setSecurity} label="Security alerts" description="New sign-ins and security recommendations." /><Switch checked={summary} onCheckedChange={setSummary} label="Weekly summary" description="Workspace activity every Monday." /></CardBody><CardFooter className="justify-between"><span className="save-status"><Check size={14} />Preferences saved locally</span><Button size="sm">Save changes</Button></CardFooter></Card><Card variant="bordered"><CardBody className="danger-row"><div><strong>Delete account</strong><p>Permanently remove your personal account and sessions.</p></div><Button variant="destructive" size="sm">Delete account</Button></CardBody></Card></div></DocsSection>
    <DocsSection id="implementation" title="Implementation"><p>The page uses controlled switches so application state remains the source of truth. The destructive action is separated from routine preferences and would normally open a ConfirmDialog.</p></DocsSection>
  </>
}

function AuthenticationExample() {
  return <>
    <PageIntro eyebrow="Examples" title="Authentication" description="A focused sign-in screen with visible labels, password recovery, and a single primary action." />
    <DocsSection id="preview" title="Preview"><div className="auth-canvas"><Card className="auth-card"><CardHeader><div className="auth-brand"><RuiBrandMark size={38} /><span>@bzync/rui</span></div><CardTitle as="h2" className="mt-4 text-base">Sign in to your account</CardTitle><CardDescription>Use your work email to continue.</CardDescription></CardHeader><CardBody><form className="pattern-form" onSubmit={(event) => event.preventDefault()}><Input label="Email" type="email" autoComplete="email" placeholder="you@company.com" prefix={<Mail size={14} />} required /><div><div className="field-inline"><label htmlFor="docs-password">Password</label><a href="#recover">Forgot password?</a></div><Input id="docs-password" type="password" autoComplete="current-password" prefix={<KeyRound size={14} />} required /></div><Button className="w-full" type="submit">Sign in</Button></form></CardBody></Card></div></DocsSection>
    <DocsSection id="implementation" title="Implementation"><p>The form uses native email and password inputs, browser autocomplete tokens, visible labels, and a submit button. Authentication errors should appear next to the affected field or as a concise form-level alert.</p></DocsSection>
  </>
}

function TeamExample() {
  return <>
    <PageIntro eyebrow="Examples" title="Team management" description="A searchable team table with explicit status and accessible row actions." />
    <DocsSection id="preview" title="Preview"><div className="app-example"><div className="example-heading"><div><h2>Team members</h2><p>Manage access to the Acme workspace.</p></div><Button icon={<UserPlus size={15} />}>Invite member</Button></div><DataTable ariaLabel="Team members" columns={memberColumns} data={members} searchable searchPlaceholder="Search by name, email, or role…" pageSizeOptions={false} /></div></DocsSection>
    <DocsSection id="implementation" title="Implementation"><p>Searchable columns are declared in the column definitions. Status combines text and color, and the action button includes an accessible name even though only an icon is visible.</p></DocsSection>
  </>
}

function ExamplePage({ page }: { page: DocsPage }) {
  if (page.slug === "examples/authentication") return <AuthenticationExample />
  if (page.slug === "examples/team-management") return <TeamExample />
  return <SettingsExample />
}

function ResourcePage({ page }: { page: DocsPage }) {
  if (page.slug === "resources/component-api") return <>
    <PageIntro eyebrow="Resources" title="Component API" description="The public inventory is derived from source exports; detailed pages document source-verified props only." />
    <DocsSection id="inventory" title="Inventory"><div className="api-inventory">{componentGroups.map(group => <div key={group.label}><h3>{group.label}</h3><p>{group.pages.map((item, index) => <span key={item.slug}><a href={hrefFor(item.slug)}><code>{item.importName}</code></a>{index < group.pages.length - 1 ? ", " : ""}</span>)}</p></div>)}</div></DocsSection>
    <DocsSection id="types" title="TypeScript source of truth"><p>Every public component entry ships a declaration file. When docs and installed types differ, the declarations bundled with your installed version are authoritative.</p><CopyCommand>import type &#123; ButtonProps, ThemePalette &#125; from "@bzync/rui"</CopyCommand></DocsSection>
  </>
  if (page.slug === "resources/accessibility") return <>
    <PageIntro eyebrow="Resources" title="Accessibility guide" description="How the component contract and consumer composition work together." />
    <DocsSection id="component-contract" title="Component contract"><p>Interactive primitives use native controls, generated associations, focus-visible styling, and explicit ARIA where a native element is insufficient.</p></DocsSection>
    <DocsSection id="consumer-checklist" title="Consumer checklist"><ul className="docs-checklist"><li>Provide visible labels or accessible names.</li><li>Keep DOM and focus order aligned with visual order.</li><li>Use status text in addition to color.</li><li>Preserve focus indicators and disabled semantics.</li><li>Test overlays at mobile viewport sizes.</li></ul></DocsSection>
    <DocsSection id="testing" title="Testing"><p>Use Testing Library for roles, labels, keyboard input, and focus restoration. Use Playwright to verify portal positioning, responsive overflow, real focus movement, and light/dark presentation.</p></DocsSection>
  </>
  return <>
    <PageIntro eyebrow="Resources" title="Contributing" description="Follow the repository contract so new work remains composable, accessible, and publishable." />
    <DocsSection id="workflow" title="Workflow"><ol className="docs-steps"><li>Inspect the existing component and domain tests.</li><li>Edit source files—not generated dist output.</li><li>Add or update a demo and regression tests.</li><li>Run the release verification sequence.</li></ol></DocsSection>
    <DocsSection id="component-contract" title="Component contract"><p>Use <code>cn()</code> for class composition, accept <code>className</code> and native props, use <code>forwardRef</code> for single DOM elements, and prefer semantic tokens over raw palette values.</p></DocsSection>
    <DocsSection id="verification" title="Verification"><CopyCommand>npm run release:check</CopyCommand></DocsSection>
  </>
}

export function DocsPageContent({ page }: { page: DocsPage }) {
  if (page.slug === "docs/introduction") return <IntroductionPage />
  if (page.slug === "docs/installation") return <InstallationPage />
  if (page.slug === "docs/quick-start") return <QuickStartPage />
  if (page.slug === "docs/configuration") return <ConfigurationPage />
  if (page.kind === "foundation") return <FoundationPage page={page} />
  if (page.slug === "components") return <ComponentsOverviewPage />
  if (page.kind === "component") return <ComponentReferencePage page={page} />
  if (page.kind === "pattern") return <PatternPage page={page} />
  if (page.kind === "example") return <ExamplePage page={page} />
  return <ResourcePage page={page} />
}
