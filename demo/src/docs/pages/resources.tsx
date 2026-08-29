import { componentGroups, hrefFor, type DocsPage } from "../catalog"
import { CopyCommand, DocsSection, PageIntro } from "../primitives"

export function ResourcePage({ page }: { page: DocsPage }) {
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
