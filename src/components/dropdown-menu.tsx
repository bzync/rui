"use client"

import { cn } from "@/lib/cn"
import { mergeRefs } from "@/lib/merge-refs"
import { useAnchoredPosition } from "@/hooks/use-anchored-position"
import { useControllableState } from "@/hooks/use-controllable-state"
import { HTMLAttributes, MouseEvent as ReactMouseEvent, ReactElement, ReactNode, Suspense, cloneElement, isValidElement, lazy, useEffect, useRef, useState, forwardRef } from "react"

// The animated menu surface pulls in framer-motion, so it lives in its own
// async chunk. It's fetched on the first open of any dropdown on the page and
// then kept mounted (as an empty <AnimatePresence>) so subsequent opens — and
// close/exit animations — are instant.
const DropdownMenuPanel = lazy(() => import("./dropdown-menu-panel"))

export interface DropdownMenuItem {
  label: string
  icon?: ReactNode
  shortcut?: string
  destructive?: boolean
  disabled?: boolean
  onClick?: () => void
}

export interface DropdownMenuGroup {
  group?: string
  items: DropdownMenuItem[]
}

export type DropdownMenuSection = DropdownMenuItem | DropdownMenuGroup

type Side = "bottom" | "top"
type Align = "start" | "end" | "center"

export interface DropdownMenuProps {
  trigger: ReactNode
  items: DropdownMenuSection[]
  side?: Side
  align?: Align
  className?: string
  wrapperClassName?: string
  itemClassName?: string
  groupLabelClassName?: string
  separatorClassName?: string
  ariaLabel?: string
  /** Controlled open state. */
  open?: boolean
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Called when the trigger, an item, Escape/Tab or an outside click requests a change. */
  onOpenChange?: (open: boolean) => void
}

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(function DropdownMenu({
  trigger,
  items,
  side = "bottom",
  align = "start",
  className,
  wrapperClassName,
  itemClassName,
  groupLabelClassName,
  separatorClassName,
  ariaLabel = "Actions menu",
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}, ref) {
  const [open, setOpen] = useControllableState({ value: controlledOpen, defaultValue: defaultOpen, onChange: onOpenChange })
  // Latches true on the first open so the lazy panel stays mounted for exit
  // animations and instant re-opens.
  const [panelMounted, setPanelMounted] = useState(false)
  const [menuEl, setMenuEl] = useState<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  // Portalled + fixed: a menu opened from a table row or overflow-hidden card
  // is never clipped and always stacks above it.
  const { setFloating, style, placement } = useAnchoredPosition({ open, anchorRef: containerRef, side, align, gap: 6 })

  useEffect(() => {
    if (open) setPanelMounted(true)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onOutside(e: MouseEvent) {
      const target = e.target as Node
      if (containerRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener("mousedown", onOutside)
    return () => document.removeEventListener("mousedown", onOutside)
  }, [open, setOpen])

  useEffect(() => {
    if (!open || !menuEl) return
    menuEl.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')?.focus()
  }, [open, menuEl])

  function closeAndRestoreFocus() {
    setOpen(false)
    containerRef.current?.querySelector<HTMLElement>('[aria-haspopup="menu"]')?.focus()
  }

  function handleMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? [])
    const index = items.indexOf(document.activeElement as HTMLButtonElement)
    if (event.key === "Escape" || event.key === "Tab") {
      // The portalled menu sits outside the page's tab order: Tab returns to the trigger.
      event.preventDefault()
      closeAndRestoreFocus()
    } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key) && items.length > 0) {
      event.preventDefault()
      const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : (Math.max(index, 0) + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length
      items[next]?.focus()
    }
  }

  type MenuTriggerProps = HTMLAttributes<HTMLElement> & {
    "aria-haspopup"?: "menu"
    "aria-expanded"?: boolean
  }
  const triggerElement = isValidElement(trigger) ? cloneElement(trigger as ReactElement<MenuTriggerProps>, {
    "aria-haspopup": "menu",
    "aria-expanded": open,
    onClick: (event: ReactMouseEvent<HTMLElement>) => {
      ;(trigger.props as MenuTriggerProps).onClick?.(event)
      if (!event.defaultPrevented) setOpen(!open)
    },
  }) : <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>{trigger}</button>

  return (
    <div ref={mergeRefs(containerRef, ref)} className={cn("relative inline-flex", wrapperClassName)}>
      {triggerElement}
      {panelMounted && (
        <Suspense fallback={null}>
          <DropdownMenuPanel
            open={open}
            menuRef={(element) => { menuRef.current = element; setMenuEl(element); setFloating(element) }}
            items={items}
            side={placement === "top" ? "top" : "bottom"}
            style={style}
            className={className}
            itemClassName={itemClassName}
            groupLabelClassName={groupLabelClassName}
            separatorClassName={separatorClassName}
            ariaLabel={ariaLabel}
            onKeyDown={handleMenuKeyDown}
            onSelect={closeAndRestoreFocus}
          />
        </Suspense>
      )}
    </div>
  )
})
DropdownMenu.displayName = "DropdownMenu"
