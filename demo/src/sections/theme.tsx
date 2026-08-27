import { ThemeProvider, Card, Button, Badge, Input } from "@bzync/rui"
import { Section } from "../_shared/section"
import { useState } from "react"

const radiusOptions = [
  { label: "Compact", value: "6px" },
  { label: "Standard", value: "10px" },
  { label: "Relaxed", value: "12px" },
]

const fontOptions = [
  { label: "Inter (default)", value: "Inter, ui-sans-serif, system-ui" },
  { label: "Geist Sans", value: "Geist, Inter, sans-serif" },
  { label: "Mono", value: "JetBrains Mono, ui-monospace, monospace" },
  { label: "Serif Display", value: "Newsreader, Georgia, serif" },
]

const spacingOptions = [
  { label: "Compact", value: { "1": "0.25rem", "2": "0.5rem", "4": "1rem", "6": "1.5rem" } },
  { label: "Comfortable", value: { "1": "0.35rem", "2": "0.7rem", "4": "1.25rem", "6": "2rem" } },
  { label: "Spacious", value: { "1": "0.5rem", "2": "1rem", "4": "1.75rem", "6": "2.5rem" } },
]

export function ThemeSection() {
  const [radius, setRadius] = useState("12px")
  const [font, setFont] = useState(fontOptions[0].value)
  const [spacing, setSpacing] = useState(spacingOptions[1].value)
  const [colors] = useState({ bg: "#f8fafc", surface: "#ffffff" })

  return (
    <Section
      id="theme"
      title="ThemeProvider"
      description="Configure fonts, colors, palettes, padding, radius, spacing, and shadows — all via typed props. Light/dark overrides via lightPalette/darkPalette."
      importPath={`import { ThemeProvider } from "@bzync/rui"\n\n<ThemeProvider\n  palette={{ accent: {600: "#7c3aed"}, colors: {text: "#18202d", border: "#d9dee7"}, radius: {lg: "10px"} }}\n  lightPalette={{ colors: {bg: "#f8fafc", surface: "#fff"} }}\n  darkPalette={{ colors: {bg: "#090d14", surface: "#111720"} }}\n>`}
      meta={["fonts", "colors & palettes", "radius", "spacing/padding", "shadows", "light/dark tokens"]}
    >
      {/* Live playground */}
      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
        <div className="flex flex-wrap items-center gap-3 border-b border-border bg-surface-muted p-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold">Radius</span>
            {radiusOptions.map(o => (
              <button key={o.value} onClick={() => setRadius(o.value)} className={`rounded-md border px-2.5 py-1 text-xs ${radius===o.value ? "border-accent-600 bg-accent-600 text-white" : "border-border bg-surface text-foreground"}`}>{o.label}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold">Font</span>
            <select value={font} onChange={e=>setFont(e.target.value)} className="text-xs rounded-lg border px-2 py-1 bg-white dark:bg-navy-800">
              {fontOptions.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold">Spacing</span>
            {spacingOptions.map(o=>(
              <button key={o.label} onClick={()=>setSpacing(o.value)} className={`rounded-md border px-2.5 py-1 text-xs ${JSON.stringify(spacing)===JSON.stringify(o.value) ? "border-accent-600 bg-accent-600 text-white" : "border-border bg-surface text-foreground"}`}>{o.label}</button>
            ))}
          </div>
        </div>

        <ThemeProvider
          palette={{
            radius: { lg: radius, md: radius, xl: radius },
            fonts: { sans: font, display: font },
            spacing,
            colors,
          }}
          className="p-6"
        >
          <div className="flex flex-wrap gap-3">
            <Card className="p-4 min-w-[180px]"><p className="text-sm font-semibold">Card radius</p><p className="text-xs text-slate-500">Radius: {radius}</p><Button size="sm" className="mt-2">Action</Button></Card>
            <div className="flex flex-col gap-2">
              <Badge>Accent badge</Badge>
              <Input placeholder="Themed input" defaultValue="Hello" />
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">Font: <span style={{fontFamily: font}}>{font.slice(0,20)}…</span> · Spacing 4: {spacing["4"]} · Colors bg/surface configurable</p>
        </ThemeProvider>
      </div>

      {/* API reference */}
      <div className="grid md:grid-cols-2 gap-4 text-xs leading-relaxed">
        <div className="rounded-xl border p-4 bg-white dark:bg-navy-800">
          <p className="font-semibold text-slate-900 dark:text-white">Palette</p>
          <pre className="mt-2 overflow-auto rounded-md bg-surface-muted p-3 text-[11px]">{`palette={{\n  accent: {600:"#7c3aed", ...},\n  neutral: {500:"#64748b"},\n  colors: {\n    bg:"#f8fafc", surface:"#fff", surfaceRaised:"#fff",\n    text:"#18202d", mutedForeground:"#667085",\n    border:"#d9dee7", borderStrong:"#b8c1ce",\n    primary:"#7c3aed", danger:"#dc2626"\n  },\n  radius: {sm:"6px", lg:"10px"},\n  fonts: {sans:"Inter", mono:"JetBrains Mono", display:"Manrope"},\n  spacing: {"4":"1rem"},\n  shadows: {lg:"0 10px 20px rgba(0,0,0,0.1)"},\n  tokens: {"--my-var":"value"} // escape hatch\n}}`}</pre>
        </div>
        <div className="rounded-xl border p-4 bg-white dark:bg-navy-800">
          <p className="font-semibold">Mode-specific</p>
          <pre className="mt-2 text-[11px] bg-black/5 dark:bg-white/5 p-2 rounded-lg overflow-auto">{`lightPalette={{ colors: {bg:"#f8fafc"} }}\ndarkPalette={{ colors: {bg:"#040912"} }}\n// also supports radius/fonts/spacing/shadows per-mode`}</pre>
          <p className="mt-2 text-[11px] text-slate-500">Use <code>applyToRoot</code> to sync to <code>&lt;html&gt;</code> for portals.</p>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-500/10 p-3 text-xs">
        <p className="font-semibold text-amber-800 dark:text-amber-200">All are typed — no raw `tokens` required.</p>
        <p className="text-amber-700 dark:text-amber-300">`tokens` remains as an escape hatch for custom `--*` vars. Every other prop maps to the CSS variables in globals.css (`--radius-*`, `--font-*`, `--spacing-*`, `--shadow-*`, `--color-*`).</p>
      </div>
    </Section>
  )
}
