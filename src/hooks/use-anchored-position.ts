"use client"

import { type CSSProperties, type RefObject, useCallback, useState } from "react"
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect"

export type AnchoredSide = "top" | "bottom" | "left" | "right"
export type AnchoredAlign = "start" | "center" | "end"

export interface AnchoredPositionOptions {
  /** Whether the floating element is shown. Measuring only runs while open. */
  open: boolean
  /** The trigger the floating element is attached to. */
  anchorRef: RefObject<HTMLElement | null>
  /** Preferred side; flips to the opposite side when it does not fit. */
  side?: AnchoredSide
  /** Cross-axis alignment against the anchor. */
  align?: AnchoredAlign
  /** Distance between anchor and floating element, in px. */
  gap?: number
  /** Minimum distance kept from every viewport edge, in px. */
  padding?: number
}

export interface AnchoredPosition {
  /** Callback ref for the floating element (merge it with any ref you hold). */
  setFloating: (element: HTMLElement | null) => void
  /** `position: fixed` coordinates — apply to the floating element. Hidden until measured. */
  style: CSSProperties
  /** The side actually used after flipping. */
  placement: AnchoredSide
}

const opposite: Record<AnchoredSide, AnchoredSide> = { top: "bottom", bottom: "top", left: "right", right: "left" }

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max))

/**
 * Positions a floating element (popover, tooltip, menu, picker panel) against
 * an anchor with viewport-fixed coordinates. Render the floating element
 * through `ThemePortal` and apply `style`: because it is portalled and fixed,
 * no ancestor can clip it (`overflow: hidden`, a scrolling table, a card) or
 * trap it in a lower stacking context or a transformed containing block. It
 * flips to the opposite side when the preferred side lacks room, clamps to
 * the viewport, and follows the anchor on scroll (any scroll container),
 * resize, and size changes of either element.
 */
export function useAnchoredPosition({
  open,
  anchorRef,
  side = "bottom",
  align = "center",
  gap = 6,
  padding = 8,
}: AnchoredPositionOptions): AnchoredPosition {
  const [floating, setFloating] = useState<HTMLElement | null>(null)
  const [style, setStyle] = useState<CSSProperties>({ position: "fixed", top: 0, left: 0, visibility: "hidden" })
  const [placement, setPlacement] = useState<AnchoredSide>(side)

  const update = useCallback(() => {
    const anchor = anchorRef.current
    if (!anchor || !floating) return
    const a = anchor.getBoundingClientRect()
    // offsetWidth/Height ignore the transforms entry animations apply.
    const width = floating.offsetWidth
    const height = floating.offsetHeight
    const vw = window.innerWidth
    const vh = window.innerHeight

    const room: Record<AnchoredSide, number> = {
      top: a.top - gap - padding,
      bottom: vh - a.bottom - gap - padding,
      left: a.left - gap - padding,
      right: vw - a.right - gap - padding,
    }
    const needed = side === "top" || side === "bottom" ? height : width
    const resolved = room[side] < needed && room[opposite[side]] > room[side] ? opposite[side] : side

    let top: number
    let left: number
    if (resolved === "top" || resolved === "bottom") {
      top = resolved === "bottom" ? a.bottom + gap : a.top - gap - height
      left = align === "start" ? a.left : align === "end" ? a.right - width : a.left + a.width / 2 - width / 2
    } else {
      left = resolved === "right" ? a.right + gap : a.left - gap - width
      top = align === "start" ? a.top : align === "end" ? a.bottom - height : a.top + a.height / 2 - height / 2
    }

    setPlacement(resolved)
    setStyle({
      position: "fixed",
      top: clamp(top, padding, vh - height - padding),
      left: clamp(left, padding, vw - width - padding),
      visibility: "visible",
    })
  }, [align, anchorRef, floating, gap, padding, side])

  useIsomorphicLayoutEffect(() => {
    if (!open || !floating) {
      setStyle((current) => current.visibility === "hidden" ? current : { ...current, visibility: "hidden" })
      return
    }
    update()
    window.addEventListener("resize", update)
    // Capture phase: a scroll in any ancestor (table, scroll area, modal body) moves the anchor.
    document.addEventListener("scroll", update, true)
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update)
    observer?.observe(floating)
    if (anchorRef.current) observer?.observe(anchorRef.current)
    return () => {
      window.removeEventListener("resize", update)
      document.removeEventListener("scroll", update, true)
      observer?.disconnect()
    }
  }, [open, floating, update])

  return { setFloating, style, placement }
}
