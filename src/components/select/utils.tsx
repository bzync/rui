import { cn } from "@/lib/cn"
import { RefObject, useEffect, useState } from "react"
import type { FlatOption, MenuPos, SelectItem, SelectOptionColor, SelectOptionGroup } from "./types"

export function isGroup(item: SelectItem): item is SelectOptionGroup {
  return "group" in item
}

export const colorDot: Record<SelectOptionColor, string> = {
  default: "bg-slate-400",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  error:   "bg-red-400",
  info:    "bg-sky-400",
}

export function flatten(items: SelectItem[]): FlatOption[] {
  let idx = 0
  return items.flatMap((item) =>
    isGroup(item)
      ? item.options.map((opt) => ({ ...opt, flatIdx: opt.disabled ? -1 : idx++ }))
      : [{ ...item, flatIdx: item.disabled ? -1 : idx++ }],
  )
}

// Tracks the trigger's viewport rect so the dropdown can be portaled to
// document.body — otherwise it gets clipped by any scrollable ancestor
// (e.g. a modal's scrolling list) since it's no longer positioned relative to it.
export function useMenuPosition(open: boolean, anchorRef: RefObject<HTMLElement | null>) {
  const [pos, setPos] = useState<MenuPos | null>(null)

  useEffect(() => {
    if (!open) {
      setPos(null)
      return
    }
    function update() {
      const rect = anchorRef.current?.getBoundingClientRect()
      if (!rect) return
      const gap = 6
      const viewportPadding = 8
      const desiredHeight = 256
      const below = window.innerHeight - rect.bottom - gap - viewportPadding
      const above = rect.top - gap - viewportPadding
      const placement = below >= Math.min(desiredHeight, above) ? "bottom" : "top"
      const maxHeight = Math.max(96, Math.min(desiredHeight, placement === "bottom" ? below : above))
      const top = placement === "bottom"
        ? rect.bottom + gap
        : Math.max(viewportPadding, rect.top - gap - maxHeight)
      const left = Math.max(viewportPadding, Math.min(rect.left, window.innerWidth - rect.width - viewportPadding))
      setPos({ top, left, width: rect.width, maxHeight, placement })
    }
    update()
    window.addEventListener("scroll", update, true)
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update, true)
      window.removeEventListener("resize", update)
    }
  }, [open, anchorRef])

  return pos
}

export const XIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

export const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={cn("shrink-0 text-slate-500 transition-transform duration-150", open && "rotate-180")}
    width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)
