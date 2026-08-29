import type { DocsPage } from "../catalog"
import { CopyCommand, DocsCallout, DocsSection, PageIntro } from "../primitives"

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

export function FoundationPage({ page }: { page: DocsPage }) {
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
