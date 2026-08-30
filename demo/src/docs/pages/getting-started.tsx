import { Badge, Button, Input, Switch } from "@bzync/rui"
import { ChevronRight, Coffee, FileCheck2, Plus, ShieldCheck } from "lucide-react"
import { useState } from "react"
import { componentGroups, hrefFor, type DocsPage } from "../catalog"
import {
  ComponentPreview,
  CopyCommand,
  DocsCallout,
  DocsSection,
  PageIntro,
  PageLink,
  PropsTable,
} from "../primitives"

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
        <div><strong>{`${componentCount} documented APIs`}</strong><span>Forms, data, overlays, charts, and navigation</span></div>
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

export function GettingStartedPage({ page }: { page: DocsPage }) {
  if (page.slug === "docs/installation") return <InstallationPage />
  if (page.slug === "docs/quick-start") return <QuickStartPage />
  if (page.slug === "docs/configuration") return <ConfigurationPage />
  return <IntroductionPage />
}
