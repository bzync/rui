"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles, iconButtonStyles } from "@/lib/component-styles"
import { CloseIcon } from "@/lib/icons"
import { mergeRefs } from "@/lib/merge-refs"
import { useControllableState } from "@/hooks/use-controllable-state"
import { useEventCallback } from "@/hooks/use-event-callback"
import { useFocusTrap, useRestoreFocus } from "@/hooks/use-focus-trap"
import { useHydrated } from "@/hooks/use-hydrated"
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"
import { type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode, forwardRef, useEffect, useId, useRef, useState } from "react"
import { ThemePortal } from "./theme-provider"

export interface SheetProps {
  open: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
  /**
   * Heights the sheet rests at, smallest first. Values up to 1 are fractions
   * of the viewport height; larger values are pixels. Default `[0.5, 0.92]`.
   */
  snapPoints?: number[]
  /** Controlled snap index. */
  snap?: number
  /** Snap index used when the sheet opens. Default 0. */
  defaultSnap?: number
  onSnapChange?: (index: number) => void
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode
  /** Dims the page, traps focus and locks scroll. Turn off for a persistent, map-style sheet. Default true. */
  modal?: boolean
  /** Lets a downward drag past the lowest snap point, Escape and the overlay close the sheet. Default true. */
  dismissible?: boolean
  showCloseButton?: boolean
  ariaLabel?: string
  closeAriaLabel?: string
  className?: string
  overlayClassName?: string
  headerClassName?: string
  contentClassName?: string
  handleClassName?: string
}

const DEFAULT_SNAPS = [0.5, 0.92]
const EXIT_MS = 260

const toPx = (point: number, viewport: number) => (point <= 1 ? point * viewport : Math.min(point, viewport))

/**
 * Bottom sheet that rests at snap points. Drag the handle or header to move
 * between them (a fast flick skips ahead); a drag below the lowest point
 * dismisses. The handle is a button: click or Enter cycles the snap points
 * and Arrow Up/Down step through them.
 */
export const Sheet = forwardRef<HTMLDivElement, SheetProps>(function Sheet({
  open,
  onOpenChange,
  onClose,
  snapPoints = DEFAULT_SNAPS,
  snap: snapProp,
  defaultSnap = 0,
  onSnapChange,
  title,
  description,
  children,
  modal = true,
  dismissible = true,
  showCloseButton = true,
  ariaLabel = "Sheet",
  closeAriaLabel = "Close sheet",
  className,
  overlayClassName,
  headerClassName,
  contentClassName,
  handleClassName,
}, ref) {
  const [snap, setSnap] = useControllableState({ value: snapProp, defaultValue: defaultSnap, onChange: onSnapChange })
  const [rendered, setRendered] = useState(open)
  const [shown, setShown] = useState(false)
  const [drag, setDrag] = useState<number | null>(null)
  const [viewport, setViewport] = useState(() => (typeof window === "undefined" ? 800 : window.innerHeight))
  const panelRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = useState(56)
  const titleId = useId()
  const descriptionId = useId()
  const hydrated = useHydrated()
  const close = useEventCallback(() => {
    onClose?.()
    onOpenChange?.(false)
  })
  const { restoreNow } = useRestoreFocus(open)

  useFocusTrap(panelRef, { active: open && modal && hydrated && rendered, onEscape: close, closeOnEscape: dismissible })

  useEffect(() => {
    const onResize = () => setViewport(window.innerHeight)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // Mount off-screen, then slide in on the next frame; slide out before unmounting.
  useEffect(() => {
    if (open) {
      setRendered(true)
      const frame = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
      return () => cancelAnimationFrame(frame)
    }
    setShown(false)
    const timer = window.setTimeout(() => { setRendered(false); restoreNow() }, EXIT_MS)
    return () => window.clearTimeout(timer)
  }, [open, restoreNow])

  useIsomorphicLayoutEffect(() => {
    if (rendered && headerRef.current) setHeaderHeight(headerRef.current.offsetHeight)
  }, [rendered, title, description, viewport])

  // Non-modal sheets still close on Escape while focus is inside them.
  const onPanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!modal && dismissible && event.key === "Escape") { event.preventDefault(); close() }
  }

  const heights = snapPoints.map((point) => toPx(point, viewport))
  const maxHeight = Math.max(...heights)
  const index = Math.min(Math.max(snap, 0), heights.length - 1)
  const restOffset = maxHeight - heights[index]
  const offset = !shown ? maxHeight + 24 : drag ?? restOffset

  const goTo = (next: number) => setSnap(Math.min(Math.max(next, 0), heights.length - 1))

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest("button:not([data-sheet-handle]), a, input, textarea, select")) return
    const target = event.currentTarget
    const startY = event.clientY
    const base = restOffset
    let lastY = startY
    let lastTime = event.timeStamp
    let velocity = 0
    let moved = false
    target.setPointerCapture?.(event.pointerId)

    const onMove = (move: PointerEvent) => {
      const delta = move.clientY - startY
      if (!moved && Math.abs(delta) < 4) return
      moved = true
      const dt = Math.max(move.timeStamp - lastTime, 1)
      velocity = (move.clientY - lastY) / dt
      lastY = move.clientY
      lastTime = move.timeStamp
      // Resist dragging above the tallest point.
      const next = base + delta
      setDrag(next < 0 ? next / 4 : next)
    }
    const onUp = (up: PointerEvent) => {
      target.removeEventListener("pointermove", onMove)
      target.removeEventListener("pointerup", onUp)
      target.removeEventListener("pointercancel", onUp)
      if (!moved) return
      // Suppress the click that follows a drag on the handle.
      target.addEventListener("click", (click) => click.stopPropagation(), { capture: true, once: true })
      const final = base + (up.clientY - startY)
      setDrag(null)
      const visible = maxHeight - final
      if (dismissible && (visible < heights[0] * 0.6 || (velocity > 1.2 && index === 0))) { close(); return }
      if (Math.abs(velocity) > 0.6) { goTo(index + (velocity < 0 ? 1 : -1)); return }
      let nearest = 0
      heights.forEach((height, i) => { if (Math.abs(height - visible) < Math.abs(heights[nearest] - visible)) nearest = i })
      goTo(nearest)
    }
    target.addEventListener("pointermove", onMove)
    target.addEventListener("pointerup", onUp)
    target.addEventListener("pointercancel", onUp)
  }

  const onHandleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowUp") { event.preventDefault(); goTo(index + 1) }
    else if (event.key === "ArrowDown") {
      event.preventDefault()
      if (index === 0 && dismissible) close()
      else goTo(index - 1)
    }
  }

  const expanded = index === heights.length - 1
  if (!rendered) return null

  return (
    <ThemePortal>
      {modal && (
        <div
          aria-hidden="true"
          onClick={dismissible ? close : undefined}
          className={cn("fixed inset-0 z-(--z-modal) bg-overlay transition-opacity duration-200", shown ? "opacity-100" : "opacity-0", overlayClassName)}
        />
      )}
      <div
        ref={mergeRefs(panelRef, ref)}
        role="dialog"
        aria-modal={modal || undefined}
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : ariaLabel}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        data-snap={index}
        data-state={open ? "open" : "closed"}
        onKeyDown={onPanelKeyDown}
        style={{ height: maxHeight, transform: `translateY(${offset}px)` }}
        className={cn(
          "fixed inset-x-0 bottom-0 z-(--z-modal) mx-auto flex w-full max-w-2xl flex-col rounded-t-[var(--radius-xl)] border border-b-0 border-border bg-surface-raised shadow-overlay outline-none",
          drag === null && "transition-transform duration-[260ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          className,
        )}
      >
        <div ref={headerRef} onPointerDown={startDrag} className={cn("shrink-0 touch-none select-none", drag !== null ? "cursor-grabbing" : "cursor-grab")}>
          <div className="flex justify-center pb-1 pt-2">
            <button
              type="button"
              data-sheet-handle=""
              aria-label={expanded ? "Collapse sheet" : "Expand sheet"}
              onClick={() => goTo(expanded ? 0 : index + 1)}
              onKeyDown={onHandleKeyDown}
              className={cn("grid h-5 w-12 place-items-center rounded-full", focusRingStyles)}
            >
              <span aria-hidden="true" className={cn("h-1 w-9 rounded-full bg-border-strong", handleClassName)} />
            </button>
          </div>
          {(title || description || (showCloseButton && dismissible)) && (
            <div className={cn("flex items-start justify-between gap-3 border-b border-border px-5 pb-3 pt-1", headerClassName)}>
              <div className="min-w-0">
                {title && <h2 id={titleId} className="text-sm font-semibold text-foreground">{title}</h2>}
                {description && <p id={descriptionId} className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
              </div>
              {showCloseButton && dismissible && (
                <button type="button" onClick={close} aria-label={closeAriaLabel} className={cn(iconButtonStyles, "-mr-1.5 shrink-0")}>
                  <CloseIcon size={14} aria-hidden="true" />
                </button>
              )}
            </div>
          )}
        </div>
        {/* The scroll area is only as tall as the visible part of the sheet. */}
        <div className={cn("min-h-0 overflow-y-auto overscroll-contain pb-safe-bottom", contentClassName)} style={{ height: Math.max(heights[index] - headerHeight, 0), flex: "none" }}>
          {children}
        </div>
      </div>
    </ThemePortal>
  )
})
Sheet.displayName = "Sheet"
