"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { CSSProperties, HTMLAttributes, forwardRef, useCallback, useEffect, useState } from "react"
import { ThemePortal } from "./theme-provider"

export type DevModePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right"

/** Tailwind's default breakpoints (min-width, px). */
export const devModeDefaultBreakpoints: Record<string, number> = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 }

export interface DevModeProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Renders nothing when false — gate it with e.g. `import.meta.env.DEV`. */
  enabled?: boolean
  /** Initial corner; the move button cycles through the corners. */
  defaultPosition?: DevModePosition
  /** Named min-width breakpoints in px. Below the smallest one shows as "base". */
  breakpoints?: Record<string, number>
  /** Start collapsed to the breakpoint pill. */
  defaultCollapsed?: boolean
  /** Ctrl/⌘ + Shift + key toggles visibility. `false` disables the shortcut. */
  hotkey?: string | false
  /** Fixed to a viewport corner (default). `false` renders inline, e.g. inside a debug panel. */
  floating?: boolean
  /** localStorage key that remembers position, collapsed/hidden state and active tools. `false` disables persistence. */
  storageKey?: string | false
}

interface Viewport { width: number; height: number; dpr: number }

interface DevModeSettings {
  position: DevModePosition
  collapsed: boolean
  hidden: boolean
  outlines: boolean
  inspect: boolean
}

const positionStyles: Record<DevModePosition, string> = {
  "top-left": "top-3 left-3",
  "top-right": "top-3 right-3",
  "bottom-left": "bottom-3 left-3",
  "bottom-right": "bottom-3 right-3",
}

const nextPosition: Record<DevModePosition, DevModePosition> = {
  "bottom-left": "bottom-right",
  "bottom-right": "top-right",
  "top-right": "top-left",
  "top-left": "bottom-left",
}

/** Box-model colours, from theme tokens so they follow light/dark mode. */
const boxColors = {
  margin: "color-mix(in srgb, var(--chart-3, #c17d1a) 45%, transparent)",
  border: "color-mix(in srgb, var(--chart-5, #7c5cd6) 55%, transparent)",
  padding: "color-mix(in srgb, var(--color-success, #059669) 40%, transparent)",
  content: "color-mix(in srgb, var(--color-info, #0284c7) 35%, transparent)",
} as const

const OUTLINE_ATTR = "data-rui-devmode-outline"
const OUTLINE_STYLE_ID = "rui-devmode-outline-style"
// Outlines every element except the inspector itself. outline (unlike border)
// never changes layout, so what you see is the real box model.
const OUTLINE_CSS = `[${OUTLINE_ATTR}] *:not([data-rui-devmode], [data-rui-devmode] *) { outline: 1px solid color-mix(in srgb, var(--color-accent-500, #5570ee) 45%, transparent) !important; outline-offset: -1px; }`

function readViewport(): Viewport {
  return { width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio || 1 }
}

function readSettings(key: string | false, defaults: DevModeSettings): DevModeSettings {
  if (!key) return defaults
  try {
    const stored = JSON.parse(window.localStorage.getItem(key) ?? "null") as Partial<DevModeSettings> | null
    if (!stored || typeof stored !== "object") return defaults
    return {
      position: stored.position && stored.position in positionStyles ? stored.position : defaults.position,
      collapsed: typeof stored.collapsed === "boolean" ? stored.collapsed : defaults.collapsed,
      hidden: typeof stored.hidden === "boolean" ? stored.hidden : defaults.hidden,
      outlines: typeof stored.outlines === "boolean" ? stored.outlines : defaults.outlines,
      inspect: typeof stored.inspect === "boolean" ? stored.inspect : defaults.inspect,
    }
  } catch {
    // Private mode, blocked storage or malformed JSON: fall back to defaults.
    return defaults
  }
}

/** Active breakpoint for a width: the largest one whose min-width it meets. */
export function resolveBreakpoint(width: number, breakpoints: Record<string, number> = devModeDefaultBreakpoints): string {
  let active = "base"
  for (const [name, min] of Object.entries(breakpoints).sort((a, b) => a[1] - b[1])) {
    if (width >= min) active = name
  }
  return active
}

const iconProps = { width: 13, height: 13, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const
const toolButtonStyles = "grid size-6 place-items-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-foreground/6 hover:text-foreground aria-pressed:bg-foreground/8 aria-pressed:text-foreground"

interface BoxMetrics {
  label: string
  rect: { top: number; left: number; width: number; height: number }
  margin: [number, number, number, number]
  border: [number, number, number, number]
  padding: [number, number, number, number]
}

function measure(element: Element): BoxMetrics {
  const style = getComputedStyle(element)
  const rect = element.getBoundingClientRect()
  const px = (value: string) => Number.parseFloat(value) || 0
  const sides = (prop: "margin" | "padding") => [px(style[`${prop}Top`]), px(style[`${prop}Right`]), px(style[`${prop}Bottom`]), px(style[`${prop}Left`])] as [number, number, number, number]
  const classes = typeof element.className === "string" ? element.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : []
  return {
    label: [element.tagName.toLowerCase(), ...classes].join("."),
    rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
    margin: sides("margin"),
    border: [px(style.borderTopWidth), px(style.borderRightWidth), px(style.borderBottomWidth), px(style.borderLeftWidth)],
    padding: sides("padding"),
  }
}

const fmt = (values: number[]) => {
  const rounded = values.map((value) => Math.round(value * 10) / 10)
  const [t, r, b, l] = rounded
  if (t === r && r === b && b === l) return `${t}`
  if (t === b && r === l) return `${t} ${r}`
  return rounded.join(" ")
}

/**
 * DevTools-style box-model overlay for the hovered element. Each band is a
 * box whose border widths equal that layer's size (negative margins clamp to
 * 0), so margin, border, padding and content never overlap or mix colours.
 */
function SpacingInspector({ onExit }: { onExit: () => void }) {
  const [box, setBox] = useState<BoxMetrics | null>(null)

  useEffect(() => {
    let frame = 0
    let target: Element | null = null
    const refresh = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setBox(target ? measure(target) : null))
    }
    const onMove = (event: PointerEvent) => {
      // Optional call: non-browser DOMs (jsdom, some embedded webviews) lack it.
      const element = document.elementFromPoint?.(event.clientX, event.clientY)
      if (!element || element.closest("[data-rui-devmode]")) return
      target = element
      refresh()
    }
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onExit() }
    document.addEventListener("pointermove", onMove, true)
    document.addEventListener("scroll", refresh, true)
    window.addEventListener("resize", refresh)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener("pointermove", onMove, true)
      document.removeEventListener("scroll", refresh, true)
      window.removeEventListener("resize", refresh)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [onExit])

  if (!box) return null
  const { rect, margin, border, padding } = box
  const [mt, mr, mb, ml] = margin.map((value) => Math.max(0, value))
  const band = (top: number, left: number, width: number, height: number, widths: number[], color: string): CSSProperties => ({
    position: "fixed",
    top,
    left,
    width: Math.max(0, width),
    height: Math.max(0, height),
    boxSizing: "border-box",
    borderStyle: "solid",
    borderColor: color,
    borderWidth: widths.map((value) => `${Math.max(0, value)}px`).join(" "),
  })
  const borderBox = { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
  const paddingBox = { top: borderBox.top + border[0], left: borderBox.left + border[3], width: borderBox.width - border[1] - border[3], height: borderBox.height - border[0] - border[2] }
  const contentBox = { top: paddingBox.top + padding[0], left: paddingBox.left + padding[3], width: paddingBox.width - padding[1] - padding[3], height: paddingBox.height - padding[0] - padding[2] }
  const labelTop = rect.top - mt - 30 > 4 ? rect.top - mt - 30 : rect.top + rect.height + mb + 6

  return (
    <div data-rui-devmode="" aria-hidden="true" className="pointer-events-none fixed inset-0 z-(--z-tooltip)">
      <div data-testid="devmode-margin" style={band(rect.top - mt, rect.left - ml, rect.width + ml + mr, rect.height + mt + mb, [mt, mr, mb, ml], boxColors.margin)} />
      <div data-testid="devmode-border" style={band(borderBox.top, borderBox.left, borderBox.width, borderBox.height, border, boxColors.border)} />
      <div data-testid="devmode-padding" style={band(paddingBox.top, paddingBox.left, paddingBox.width, paddingBox.height, padding, boxColors.padding)} />
      <div data-testid="devmode-content" style={{ position: "fixed", top: contentBox.top, left: contentBox.left, width: Math.max(0, contentBox.width), height: Math.max(0, contentBox.height), background: boxColors.content }} />
      <div
        className="fixed max-w-[calc(100vw-1rem)] truncate rounded-[var(--radius-sm)] border border-tooltip-border bg-tooltip px-2 py-1 font-mono text-[11px] text-tooltip-foreground shadow-floating"
        style={{ top: Math.max(4, labelTop), left: Math.min(Math.max(4, rect.left), window.innerWidth - 260) }}
      >
        <span className="font-semibold">{box.label}</span>
        <span className="opacity-80">{` ${Math.round(rect.width)}×${Math.round(rect.height)}`}</span>
        <span style={{ color: "var(--chart-3)" }}>{` m ${fmt(margin)}`}</span>
        <span style={{ color: "var(--color-success)" }}>{` p ${fmt(padding)}`}</span>
      </div>
    </div>
  )
}

/**
 * A floating viewport inspector for checking responsive UI while you build:
 * live size, the active breakpoint, pixel ratio and orientation, a breakpoint
 * scale, a layout-outline toggle and a box-model (margin / border / padding /
 * content) inspector. Settings persist across reloads. Development only —
 * render it behind a flag, e.g. `<DevMode enabled={import.meta.env.DEV} />`.
 */
export const DevMode = forwardRef<HTMLDivElement, DevModeProps>(({
  enabled = true,
  defaultPosition = "bottom-left",
  breakpoints = devModeDefaultBreakpoints,
  defaultCollapsed = false,
  hotkey = "d",
  floating = true,
  storageKey = "rui-devmode",
  className,
  ...props
}, ref) => {
  // Both null until mounted: the server has no viewport or storage, and
  // rendering nothing first keeps hydration clean and avoids a settings flash.
  const [viewport, setViewport] = useState<Viewport | null>(null)
  const [settings, setSettings] = useState<DevModeSettings | null>(null)
  const update = (patch: Partial<DevModeSettings>) => setSettings((current) => current && { ...current, ...patch })
  const exitInspect = useCallback(() => setSettings((current) => current && { ...current, inspect: false }), [])

  useEffect(() => {
    if (!enabled) return
    setSettings(readSettings(storageKey, { position: defaultPosition, collapsed: defaultCollapsed, hidden: false, outlines: false, inspect: false }))
    // Defaults only seed the first load; later changes are user-owned and persisted.
  }, [enabled, storageKey])

  useEffect(() => {
    if (!settings || !storageKey) return
    try { window.localStorage.setItem(storageKey, JSON.stringify(settings)) } catch { /* storage unavailable */ }
  }, [settings, storageKey])

  useEffect(() => {
    if (!enabled) return
    let frame = 0
    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setViewport(readViewport()))
    }
    setViewport(readViewport())
    window.addEventListener("resize", onResize)
    window.visualViewport?.addEventListener("resize", onResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", onResize)
      window.visualViewport?.removeEventListener("resize", onResize)
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled || hotkey === false) return
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === hotkey.toLowerCase()) {
        event.preventDefault()
        setSettings((current) => current && { ...current, hidden: !current.hidden })
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [enabled, hotkey])

  const outlines = Boolean(enabled && settings?.outlines && !settings.hidden)
  useEffect(() => {
    if (!outlines) return
    const root = document.documentElement
    let style = document.getElementById(OUTLINE_STYLE_ID)
    if (!style) {
      style = document.createElement("style")
      style.id = OUTLINE_STYLE_ID
      style.textContent = OUTLINE_CSS
      document.head.appendChild(style)
    }
    root.setAttribute(OUTLINE_ATTR, "")
    return () => {
      root.removeAttribute(OUTLINE_ATTR)
      document.getElementById(OUTLINE_STYLE_ID)?.remove()
    }
  }, [outlines])

  if (!enabled || !viewport || !settings || settings.hidden) return null

  const { position, collapsed, inspect } = settings
  const active = resolveBreakpoint(viewport.width, breakpoints)
  const sorted = Object.entries(breakpoints).sort((a, b) => a[1] - b[1])
  // A scale that already starts at 0 (e.g. { phone: 0, … }) needs no synthetic "base".
  const scale: (readonly [string, number])[] = sorted[0]?.[1] <= 0 ? sorted : [["base", 0], ...sorted]
  const orientation = viewport.width >= viewport.height ? "landscape" : "portrait"
  const dpr = Number.isInteger(viewport.dpr) ? `${viewport.dpr}` : viewport.dpr.toFixed(2)

  const panel = (
    <div
      ref={ref}
      data-rui-devmode=""
      role="region"
      aria-label="Viewport inspector"
      className={cn(
        "font-mono text-xs text-foreground",
        floating && cn("fixed z-(--z-tooltip)", positionStyles[position]),
        className,
      )}
      {...props}
    >
      {collapsed ? (
        <button
          type="button"
          onClick={() => update({ collapsed: false })}
          aria-label={`Expand viewport inspector (${active}, ${viewport.width}px)`}
          className={cn("flex h-7 items-center gap-1.5 rounded-full border border-border bg-surface-raised px-2.5 shadow-floating", focusRingStyles)}
        >
          <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
          <span className="font-semibold">{active}</span>
          <span className="text-muted-foreground tabular-nums">{`${viewport.width}px`}</span>
        </button>
      ) : (
        <div className="w-[min(18rem,calc(100vw-1.5rem))] rounded-[var(--radius-lg)] border border-border bg-surface-raised p-2.5 shadow-floating">
          <div className="flex items-center gap-2">
            <span className="rounded-[var(--radius-sm)] bg-primary px-1.5 py-0.5 font-semibold text-primary-foreground">{active}</span>
            <span className="tabular-nums" data-testid="devmode-size">{`${viewport.width} × ${viewport.height}`}</span>
            <span className="ml-auto flex items-center gap-0.5">
              <button
                type="button"
                aria-label="Inspect spacing"
                aria-pressed={inspect}
                title="Inspect spacing (margin, border, padding, content)"
                onClick={() => update({ inspect: !inspect })}
                className={cn(toolButtonStyles, focusRingStyles)}
              >
                <svg {...iconProps}><circle cx="12" cy="12" r="7" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>
              </button>
              <button
                type="button"
                aria-label="Outline layout boxes"
                aria-pressed={settings.outlines}
                title="Outline layout boxes"
                onClick={() => update({ outlines: !settings.outlines })}
                className={cn(toolButtonStyles, focusRingStyles)}
              >
                <svg {...iconProps}><rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="3 3" /><rect x="8" y="8" width="8" height="8" rx="1" /></svg>
              </button>
              {floating && (
                <button
                  type="button"
                  aria-label="Move to next corner"
                  title="Move to next corner"
                  onClick={() => update({ position: nextPosition[position] })}
                  className={cn(toolButtonStyles, focusRingStyles)}
                >
                  <svg {...iconProps}><path d="M5 9 2 12l3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" /></svg>
                </button>
              )}
              <button
                type="button"
                aria-label="Collapse viewport inspector"
                title="Collapse"
                onClick={() => update({ collapsed: true })}
                className={cn(toolButtonStyles, focusRingStyles)}
              >
                <svg {...iconProps}><path d="M5 12h14" /></svg>
              </button>
            </span>
          </div>
          <ol aria-label="Breakpoints" className="mt-2 flex gap-0.5">
            {scale.map(([name, min]) => (
              <li
                key={name}
                aria-current={name === active ? "true" : undefined}
                title={min ? `${name} ≥ ${min}px` : `base < ${scale[1]?.[1] ?? "∞"}px`}
                className={cn(
                  "flex-1 rounded-[var(--radius-sm)] py-1 text-center text-[11px]",
                  name === active ? "bg-primary/15 font-semibold text-accent-strong" : viewport.width >= min ? "bg-foreground/6 text-muted-foreground" : "bg-foreground/3 text-muted-foreground/60",
                )}
              >
                {name}
              </li>
            ))}
          </ol>
          {inspect && (
            <ul aria-label="Box model legend" className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              {(Object.keys(boxColors) as (keyof typeof boxColors)[]).map((layer) => (
                <li key={layer} className="flex items-center gap-1">
                  <span aria-hidden="true" className="size-2.5 rounded-[2px]" style={{ background: boxColors[layer] }} />
                  {layer}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 flex flex-wrap gap-x-2 text-[11px] text-muted-foreground">
            <span>{`@${dpr}x`}</span>
            <span aria-hidden="true">·</span>
            <span>{orientation}</span>
            {hotkey !== false && <><span aria-hidden="true">·</span><span>{`⌘/Ctrl ⇧ ${hotkey.toUpperCase()} hides`}</span></>}
          </p>
        </div>
      )}
    </div>
  )

  const inspector = inspect ? <ThemePortal><SpacingInspector onExit={exitInspect} /></ThemePortal> : null
  return <>{floating ? <ThemePortal>{panel}</ThemePortal> : panel}{inspector}</>
})
DevMode.displayName = "DevMode"
