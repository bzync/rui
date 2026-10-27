"use client"

import { cn } from "@/lib/cn"
import { mergeRefs } from "@/lib/merge-refs"
import {
  Children,
  Fragment,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  forwardRef,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react"

export interface ResizableProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onResize"> {
  /** Panels; a handle is inserted between each pair. */
  children: ReactNode
  direction?: "horizontal" | "vertical"
  /** Initial sizes in percent (should sum to 100). Defaults to equal sizes. */
  defaultSizes?: number[]
  /** Controlled sizes in percent. */
  sizes?: number[]
  onResize?: (sizes: number[]) => void
  /** Minimum size per panel in percent. Default 10. */
  minSizes?: number[]
  /** Maximum size per panel in percent. Default 90. */
  maxSizes?: number[]
  /** Remembers the layout in localStorage under this key. */
  storageKey?: string
  /** Shows a grip on each handle. */
  withHandle?: boolean
  /** Accessible names for the panels, used to label the handles. */
  panelLabels?: string[]
  handleClassName?: string
}

export interface ResizablePanelProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

/** A panel inside <Resizable>. Scrolls its own content. */
export const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps>(function ResizablePanel({ className, ...props }, ref) {
  return <div ref={ref} className={cn("h-full min-h-0 min-w-0 overflow-auto", className)} {...props} />
})
ResizablePanel.displayName = "ResizablePanel"

const round = (value: number) => Math.round(value * 100) / 100

function readStored(key: string | undefined, count: number): number[] | null {
  if (!key || typeof window === "undefined") return null
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "null")
    return Array.isArray(parsed) && parsed.length === count && parsed.every((n) => typeof n === "number") ? parsed : null
  } catch {
    return null
  }
}

/**
 * Resizable split view. Drag a handle, or focus it and use the arrow keys
 * (Shift for 10% steps, Home/End for the limits). Double-click a handle to
 * restore the default layout.
 */
export const Resizable = forwardRef<HTMLDivElement, ResizableProps>(function Resizable({
  children,
  direction = "horizontal",
  defaultSizes,
  sizes: controlledSizes,
  onResize,
  minSizes,
  maxSizes,
  storageKey,
  withHandle = false,
  panelLabels,
  className,
  handleClassName,
  ...props
}, ref) {
  const panels = Children.toArray(children).filter(isValidElement)
  const count = panels.length
  const initial = defaultSizes ?? Array.from({ length: count }, () => 100 / count)
  const [localSizes, setLocalSizes] = useState<number[]>(initial)
  const sizes = controlledSizes ?? localSizes
  const containerRef = useRef<HTMLDivElement>(null)
  const horizontal = direction === "horizontal"

  // Restore a persisted layout after mount (the server has no storage).
  useEffect(() => {
    const stored = readStored(storageKey, count)
    if (stored && controlledSizes === undefined) setLocalSizes(stored)
    // Only on mount / key change.
  }, [storageKey, count])

  const commit = (next: number[]) => {
    const rounded = next.map(round)
    if (controlledSizes === undefined) setLocalSizes(rounded)
    onResize?.(rounded)
    if (storageKey) {
      try { window.localStorage.setItem(storageKey, JSON.stringify(rounded)) } catch { /* storage unavailable */ }
    }
  }

  const min = (i: number) => minSizes?.[i] ?? 10
  const max = (i: number) => maxSizes?.[i] ?? 90

  /** Moves the boundary after panel `i` by `delta` percent, within both panels' limits. */
  const resizeBoundary = (i: number, delta: number, base = sizes) => {
    const pair = base[i] + base[i + 1]
    const lower = Math.max(min(i), pair - max(i + 1))
    const upper = Math.min(max(i), pair - min(i + 1))
    const left = Math.min(upper, Math.max(lower, base[i] + delta))
    const next = [...base]
    next[i] = left
    next[i + 1] = pair - left
    commit(next)
  }

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>, i: number) => {
    event.preventDefault()
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const total = horizontal ? rect.width : rect.height
    const start = horizontal ? event.clientX : event.clientY
    const base = [...sizes]
    const handle = event.currentTarget
    handle.setPointerCapture?.(event.pointerId)
    document.body.style.cursor = horizontal ? "col-resize" : "row-resize"
    const onMove = (move: PointerEvent) => {
      const position = horizontal ? move.clientX : move.clientY
      resizeBoundary(i, ((position - start) / total) * 100, base)
    }
    const onUp = () => {
      document.body.style.cursor = ""
      handle.removeEventListener("pointermove", onMove)
      handle.removeEventListener("pointerup", onUp)
    }
    handle.addEventListener("pointermove", onMove)
    handle.addEventListener("pointerup", onUp)
  }

  const onHandleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>, i: number) => {
    const step = event.shiftKey ? 10 : 2
    const back = horizontal ? "ArrowLeft" : "ArrowUp"
    const forward = horizontal ? "ArrowRight" : "ArrowDown"
    if (event.key === back) resizeBoundary(i, -step)
    else if (event.key === forward) resizeBoundary(i, step)
    else if (event.key === "Home") resizeBoundary(i, -100)
    else if (event.key === "End") resizeBoundary(i, 100)
    else return
    event.preventDefault()
  }

  return (
    <div
      ref={mergeRefs(containerRef, ref)}
      data-direction={direction}
      className={cn("flex h-full w-full min-h-0 min-w-0 overflow-hidden", horizontal ? "flex-row" : "flex-col", className)}
      {...props}
    >
      {panels.map((panel, i) => (
        <Fragment key={panel.key ?? i}>
          {/* Sizes are grow weights over a 0 basis, so handles never push panels past 100%. */}
          <div style={{ flex: `${sizes[i]} 1 0px` }} className="relative min-h-0 min-w-0">
            {panel}
          </div>
          {i < count - 1 && (
            <div
              role="separator"
              tabIndex={0}
              aria-orientation={horizontal ? "vertical" : "horizontal"}
              aria-label={panelLabels ? `Resize ${panelLabels[i]} and ${panelLabels[i + 1]}` : `Resize panels ${i + 1} and ${i + 2}`}
              aria-valuenow={Math.round(sizes[i])}
              aria-valuemin={min(i)}
              aria-valuemax={max(i)}
              onPointerDown={(event) => startDrag(event, i)}
              onKeyDown={(event) => onHandleKeyDown(event, i)}
              onDoubleClick={() => commit(initial)}
              className={cn(
                "group/handle relative flex shrink-0 touch-none items-center justify-center outline-none",
                horizontal ? "w-2 cursor-col-resize" : "h-2 cursor-row-resize",
                // 1px line, accent while hovered / dragged / focused.
                horizontal
                  ? "before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-border"
                  : "before:absolute before:inset-x-0 before:top-1/2 before:h-px before:-translate-y-1/2 before:bg-border",
                "hover:before:bg-accent-500 focus-visible:before:bg-accent-500 active:before:bg-accent-500",
                handleClassName,
              )}
            >
              {withHandle && (
                <span aria-hidden="true" className={cn("relative z-[1] grid place-items-center rounded-sm border border-border bg-surface text-muted-foreground group-focus-visible/handle:border-accent-500", horizontal ? "h-6 w-3" : "h-3 w-6")}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" className={horizontal ? "" : "rotate-90"}><circle cx="2" cy="2" r="0.9" /><circle cx="2" cy="6" r="0.9" /><circle cx="6" cy="2" r="0.9" /><circle cx="6" cy="6" r="0.9" /></svg>
                </span>
              )}
            </div>
          )}
        </Fragment>
      ))}
    </div>
  )
})
Resizable.displayName = "Resizable"
