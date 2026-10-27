"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { HTMLAttributes, forwardRef, useEffect, useState } from "react"
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
}

interface Viewport { width: number; height: number; dpr: number }

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

const OUTLINE_ATTR = "data-rui-devmode-outline"
const OUTLINE_STYLE_ID = "rui-devmode-outline-style"
// Outlines every element except the inspector itself. outline (unlike border)
// never changes layout, so what you see is the real box model.
const OUTLINE_CSS = `[${OUTLINE_ATTR}] *:not([data-rui-devmode], [data-rui-devmode] *) { outline: 1px solid color-mix(in srgb, var(--color-accent-500, #5570ee) 45%, transparent) !important; outline-offset: -1px; }`

function readViewport(): Viewport {
  return { width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio || 1 }
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

/**
 * A floating viewport inspector for checking responsive UI while you build:
 * live size, the active breakpoint, pixel ratio and orientation, a breakpoint
 * scale, and a layout-outline toggle. Development only — render it behind a
 * flag, e.g. `<DevMode enabled={import.meta.env.DEV} />`.
 */
export const DevMode = forwardRef<HTMLDivElement, DevModeProps>(({
  enabled = true,
  defaultPosition = "bottom-left",
  breakpoints = devModeDefaultBreakpoints,
  defaultCollapsed = false,
  hotkey = "d",
  floating = true,
  className,
  ...props
}, ref) => {
  // Null until mounted: the server has no viewport, and rendering nothing
  // first keeps hydration clean.
  const [viewport, setViewport] = useState<Viewport | null>(null)
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [hidden, setHidden] = useState(false)
  const [position, setPosition] = useState(defaultPosition)
  const [outlines, setOutlines] = useState(false)

  useEffect(() => {
    if (!enabled) return
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setViewport(readViewport()))
    }
    setViewport(readViewport())
    window.addEventListener("resize", update)
    window.visualViewport?.addEventListener("resize", update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", update)
      window.visualViewport?.removeEventListener("resize", update)
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled || hotkey === false) return
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === hotkey.toLowerCase()) {
        event.preventDefault()
        setHidden((current) => !current)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [enabled, hotkey])

  useEffect(() => {
    if (!enabled || !outlines) return
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
  }, [enabled, outlines])

  if (!enabled || hidden || !viewport) return null

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
          onClick={() => setCollapsed(false)}
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
                aria-label="Outline layout boxes"
                aria-pressed={outlines}
                title="Outline layout boxes"
                onClick={() => setOutlines((current) => !current)}
                className={cn("grid size-6 place-items-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-foreground/6 hover:text-foreground aria-pressed:bg-foreground/8 aria-pressed:text-foreground", focusRingStyles)}
              >
                <svg {...iconProps}><rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="3 3" /><rect x="8" y="8" width="8" height="8" rx="1" /></svg>
              </button>
              {floating && (
                <button
                  type="button"
                  aria-label="Move to next corner"
                  title="Move to next corner"
                  onClick={() => setPosition(nextPosition[position])}
                  className={cn("grid size-6 place-items-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-foreground/6 hover:text-foreground", focusRingStyles)}
                >
                  <svg {...iconProps}><path d="M5 9 2 12l3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" /></svg>
                </button>
              )}
              <button
                type="button"
                aria-label="Collapse viewport inspector"
                title="Collapse"
                onClick={() => setCollapsed(true)}
                className={cn("grid size-6 place-items-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-foreground/6 hover:text-foreground", focusRingStyles)}
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
          <p className="mt-2 flex gap-2 text-[11px] text-muted-foreground">
            <span>{`@${dpr}x`}</span>
            <span aria-hidden="true">·</span>
            <span>{orientation}</span>
            {hotkey !== false && <><span aria-hidden="true">·</span><span>{`⌘/Ctrl ⇧ ${hotkey.toUpperCase()} hides`}</span></>}
          </p>
        </div>
      )}
    </div>
  )

  return floating ? <ThemePortal>{panel}</ThemePortal> : panel
})
DevMode.displayName = "DevMode"
