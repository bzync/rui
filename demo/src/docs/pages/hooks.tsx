import { Badge, Button, Input, Switch, useBreakpoint, useClipboard, useDebounce, useHotkeys, useLocalStorage } from "@bzync/rui"
import { useState } from "react"
import { ComponentPreview, DocsSection, PageIntro, PropsTable } from "../primitives"

function ShortcutDemo() {
  const [log, setLog] = useState<string[]>([])
  const add = (entry: string) => setLog((previous) => [entry, ...previous].slice(0, 3))
  useHotkeys("shift+n", () => add("Shift+N: new item"))
  useHotkeys(["alt+arrowup", "alt+arrowdown"], (event) => add(event.key === "ArrowUp" ? "Alt+↑: move up" : "Alt+↓: move down"))
  return (
    <div className="grid w-full max-w-sm gap-2 text-sm">
      <p className="text-muted-foreground">Click here, then press Shift+N or Alt+↑ / Alt+↓.</p>
      <ul className="grid gap-1" aria-live="polite">
        {log.length ? log.map((entry, index) => <li key={index} className="rounded-md bg-surface-muted px-3 py-1.5">{entry}</li>) : <li className="text-muted-foreground">No shortcuts pressed yet</li>}
      </ul>
    </div>
  )
}

function InviteLink() {
  const { copy, copied, error } = useClipboard({ timeout: 1500 })
  const url = "https://rui.bzync.com/invite/7f3k"
  return (
    <div className="flex w-full max-w-md items-center gap-2">
      <Input aria-label="Invite link" value={url} readOnly wrapperClassName="flex-1" />
      <Button variant="secondary" onClick={() => copy(url)}>{copied ? "Copied" : "Copy"}</Button>
      <span className="sr-only" aria-live="polite">{copied ? "Link copied" : error ? "Copy failed" : ""}</span>
    </div>
  )
}

function BreakpointBadge() {
  const { breakpoint, width, up, ready } = useBreakpoint()
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <Badge>{ready ? breakpoint : "measuring…"}</Badge>
      <span className="tabular-nums text-muted-foreground">{width}px</span>
      <span>{up("lg") ? "Desktop layout" : "Compact layout"}</span>
    </div>
  )
}

function DensityPreference() {
  const [density, setDensity, reset] = useLocalStorage<"comfortable" | "compact">("docs-density", "comfortable")
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <Switch label="Compact rows" checked={density === "compact"} onChange={(event) => setDensity(event.target.checked ? "compact" : "comfortable")} />
      <span className="text-muted-foreground">Saved: {density}. Reload the page to see it persist.</span>
      <Button size="sm" variant="ghost" onClick={reset}>Reset</Button>
    </div>
  )
}

function DebouncedFilter() {
  const [text, setText] = useState("")
  const query = useDebounce(text, 400)
  const fruits = ["Apple", "Apricot", "Banana", "Blueberry", "Cherry", "Grape", "Mango"]
  const matches = fruits.filter((fruit) => fruit.toLowerCase().includes(query.toLowerCase()))
  return (
    <div className="grid w-full max-w-sm gap-2 text-sm">
      <Input label="Filter fruit" value={text} onChange={(event) => setText(event.target.value)} hint={text !== query ? "Waiting for you to stop typing…" : `${matches.length} match${matches.length === 1 ? "" : "es"}`} />
      <p className="text-muted-foreground">{matches.join(", ") || "No matches"}</p>
    </div>
  )
}

export function HooksPage() {
  return <>
    <PageIntro eyebrow="Getting Started" title="Hooks" description="Small, SSR-safe hooks the components use internally, exported for your own UI. Import them from @bzync/rui like any component." />
    <DocsSection id="use-hotkeys" title="useHotkeys" description={"Keyboard shortcuts with platform-aware mod (⌘ on Apple, Ctrl elsewhere). Presses inside form fields are ignored unless enableOnFormTags is set."}>
      <ComponentPreview title="useHotkeys" code={`import { useHotkeys } from "@bzync/rui"

function ShortcutDemo() {
  const [log, setLog] = useState<string[]>([])
  const add = (entry: string) => setLog((previous) => [entry, ...previous].slice(0, 3))
  useHotkeys("shift+n", () => add("Shift+N: new item"))
  useHotkeys(["alt+arrowup", "alt+arrowdown"], (event) => add(event.key === "ArrowUp" ? "Alt+↑: move up" : "Alt+↓: move down"))
  return (
    <div className="grid w-full max-w-sm gap-2 text-sm">
      <p className="text-muted-foreground">Click here, then press Shift+N or Alt+↑ / Alt+↓.</p>
      <ul className="grid gap-1" aria-live="polite">
        {log.length ? log.map((entry, index) => <li key={index} className="rounded-md bg-surface-muted px-3 py-1.5">{entry}</li>) : <li className="text-muted-foreground">No shortcuts pressed yet</li>}
      </ul>
    </div>
  )
}`}><ShortcutDemo /></ComponentPreview>
      <PropsTable caption="useHotkeys API" props={[{ name: "hotkeys", type: "string | string[]", description: "Combos like \"mod+k\", \"shift+?\", \"alt+arrowup\", \"escape\"." }, { name: "handler", type: "(event) => void", description: "Called on match; always the latest closure." }, { name: "options.enabled", type: "boolean", description: "Turn the listener on or off. Default true." }, { name: "options.enableOnFormTags", type: "boolean", description: "Also fire inside inputs. Default false." }, { name: "options.preventDefault", type: "boolean", description: "Default true." }, { name: "options.target / event", type: "RefObject / \"keydown\" | \"keyup\"", description: "Scope to an element and choose the event." }]} />
    </DocsSection>
    <DocsSection id="use-clipboard" title="useClipboard" description={"Copy text with a copied flag that resets after a timeout; falls back to a hidden textarea when the Clipboard API is unavailable."}>
      <ComponentPreview title="useClipboard" code={`import { useClipboard } from "@bzync/rui"

function InviteLink() {
  const { copy, copied, error } = useClipboard({ timeout: 1500 })
  const url = "https://rui.bzync.com/invite/7f3k"
  return (
    <div className="flex w-full max-w-md items-center gap-2">
      <Input aria-label="Invite link" value={url} readOnly wrapperClassName="flex-1" />
      <Button variant="secondary" onClick={() => copy(url)}>{copied ? "Copied" : "Copy"}</Button>
      <span className="sr-only" aria-live="polite">{copied ? "Link copied" : error ? "Copy failed" : ""}</span>
    </div>
  )
}`}><InviteLink /></ComponentPreview>
      <PropsTable caption="useClipboard API" props={[{ name: "options.timeout", type: "number", description: "How long copied stays true. Default 2000." }, { name: "copy(text)", type: "Promise<boolean>", description: "Resolves true on success." }, { name: "copied / error", type: "boolean / Error | null", description: "Result state." }, { name: "reset()", type: "() => void", description: "Clears copied and error." }]} />
    </DocsSection>
    <DocsSection id="use-breakpoint" title="useBreakpoint" description={"The active Tailwind breakpoint and helpers. Server rendering and hydration see \"base\", then the real width applies, so markup never mismatches."}>
      <ComponentPreview title="useBreakpoint" code={`import { useBreakpoint } from "@bzync/rui"

function BreakpointBadge() {
  const { breakpoint, width, up, ready } = useBreakpoint()
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <Badge>{ready ? breakpoint : "measuring…"}</Badge>
      <span className="tabular-nums text-muted-foreground">{width}px</span>
      <span>{up("lg") ? "Desktop layout" : "Compact layout"}</span>
    </div>
  )
}`}><BreakpointBadge /></ComponentPreview>
      <PropsTable caption="useBreakpoint API" props={[{ name: "breakpoints", type: "Record<string, number>", description: "Min-widths; defaults to sm 640, md 768, lg 1024, xl 1280, 2xl 1536." }, { name: "breakpoint", type: "string", description: "Largest matching key, or \"base\"." }, { name: "width / ready", type: "number / boolean", description: "Viewport width; false until measured." }, { name: "up(key) / down(key)", type: "(key) => boolean", description: "At or above / below a breakpoint." }]} />
    </DocsSection>
    <DocsSection id="use-local-storage" title="useLocalStorage" description={"useState persisted to localStorage, synced across components and tabs, and safe when storage is unavailable."}>
      <ComponentPreview title="useLocalStorage" code={`import { useLocalStorage } from "@bzync/rui"

function DensityPreference() {
  const [density, setDensity, reset] = useLocalStorage<"comfortable" | "compact">("docs-density", "comfortable")
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <Switch label="Compact rows" checked={density === "compact"} onChange={(event) => setDensity(event.target.checked ? "compact" : "comfortable")} />
      <span className="text-muted-foreground">Saved: {density}. Reload the page to see it persist.</span>
      <Button size="sm" variant="ghost" onClick={reset}>Reset</Button>
    </div>
  )
}`}><DensityPreference /></ComponentPreview>
      <PropsTable caption="useLocalStorage API" props={[{ name: "key / initialValue", type: "string / T", description: "Storage key and the value used when nothing is stored." }, { name: "options.serialize / deserialize", type: "(value) => string / (raw) => T", description: "Defaults to JSON." }, { name: "returns", type: "[value, setValue, remove]", description: "setValue accepts a value or updater function." }]} />
    </DocsSection>
    <DocsSection id="use-debounce" title="useDebounce" description={"useDebounce delays a value; useDebouncedCallback delays a function and adds cancel, flush and pending."}>
      <ComponentPreview title="useDebounce" code={`import { useDebounce } from "@bzync/rui"

function DebouncedFilter() {
  const [text, setText] = useState("")
  const query = useDebounce(text, 400)
  const fruits = ["Apple", "Apricot", "Banana", "Blueberry", "Cherry", "Grape", "Mango"]
  const matches = fruits.filter((fruit) => fruit.toLowerCase().includes(query.toLowerCase()))
  return (
    <div className="grid w-full max-w-sm gap-2 text-sm">
      <Input label="Filter fruit" value={text} onChange={(event) => setText(event.target.value)} hint={text !== query ? "Waiting for you to stop typing…" : \`\${matches.length} match\${matches.length === 1 ? "" : "es"}\`} />
      <p className="text-muted-foreground">{matches.join(", ") || "No matches"}</p>
    </div>
  )
}`}><DebouncedFilter /></ComponentPreview>
      <PropsTable caption="useDebounce API" props={[{ name: "useDebounce(value, delayMs)", type: "T", description: "The value after it stops changing for delayMs (default 300)." }, { name: "useDebouncedCallback(fn, delayMs)", type: "DebouncedCallback", description: "Stable function with cancel(), flush() and pending(); cancelled on unmount." }]} />
    </DocsSection>
  </>
}
