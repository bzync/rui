"use client"

import { cn } from "@/lib/cn"
import { HTMLAttributes, MouseEvent as ReactMouseEvent, ReactElement, ReactNode, Suspense, cloneElement, isValidElement, lazy, useEffect, useRef, useState } from "react"

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
}

export function DropdownMenu({
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
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  // Latches true on the first open so the lazy panel stays mounted for exit
  // animations and instant re-opens.
  const [panelMounted, setPanelMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) setPanelMounted(true)
  }, [open])

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onOutside)
    return () => document.removeEventListener("mousedown", onOutside)
  }, [])

  useEffect(() => {
    if (!open) return
    menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')?.focus()
  }, [open, panelMounted])

  function closeAndRestoreFocus() {
    setOpen(false)
    containerRef.current?.querySelector<HTMLElement>('[aria-haspopup="menu"]')?.focus()
  }

  function handleMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? [])
    const index = items.indexOf(document.activeElement as HTMLButtonElement)
    if (event.key === "Escape") {
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
      if (!event.defaultPrevented) setOpen((current) => !current)
    },
  }) : <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((current) => !current)}>{trigger}</button>

  return (
    <div ref={containerRef} className={cn("relative inline-flex", wrapperClassName)}>
      {triggerElement}
      {panelMounted && (
        <Suspense fallback={null}>
          <DropdownMenuPanel
            open={open}
            menuRef={menuRef}
            items={items}
            side={side}
            align={align}
            className={className}
            itemClassName={itemClassName}
            groupLabelClassName={groupLabelClassName}
            separatorClassName={separatorClassName}
            ariaLabel={ariaLabel}
            onKeyDown={handleMenuKeyDown}
            onSelect={() => setOpen(false)}
          />
        </Suspense>
      )}
    </div>
  )
}
