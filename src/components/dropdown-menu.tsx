"use client"

import { cn } from "@/lib/cn"
import { AnimatePresence, motion } from "framer-motion"
import { transitions } from "@/lib/motion"
import { HTMLAttributes, MouseEvent as ReactMouseEvent, ReactElement, ReactNode, cloneElement, isValidElement, useEffect, useRef, useState } from "react"

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
  ariaLabel?: string
}

function isGroup(s: DropdownMenuSection): s is DropdownMenuGroup {
  return "items" in s
}

const sideStyles: Record<Side, string> = {
  bottom: "top-full mt-1.5",
  top:    "bottom-full mb-1.5",
}

const alignStyles: Record<Align, string> = {
  start:  "left-0",
  end:    "right-0",
  center: "left-1/2 -translate-x-1/2",
}

const enterFrom: Record<Side, object> = {
  bottom: { y: -4 },
  top:    { y: 4 },
}

export function DropdownMenu({
  trigger,
  items,
  side = "bottom",
  align = "start",
  className,
  ariaLabel = "Actions menu",
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

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
  }, [open])

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

  function renderItem(item: DropdownMenuItem, i: number) {
    return (
      <button
        key={i}
        type="button"
        disabled={item.disabled}
        role="menuitem"
        onClick={() => {
          if (item.disabled) return
          item.onClick?.()
          setOpen(false)
        }}
        className={cn(
          "flex min-h-9 items-center gap-2.5 w-full px-3 py-2 text-sm rounded-md transition-colors text-left focus-visible:outline-none focus-visible:bg-surface-muted",
          item.destructive
            ? "text-destructive hover:bg-destructive/10"
            : "text-foreground hover:bg-surface-muted",
          item.disabled && "opacity-40 cursor-not-allowed pointer-events-none",
        )}
      >
        {item.icon && (
          <span className={cn("shrink-0", item.destructive ? "text-red-400" : "text-slate-500 dark:text-slate-400")}>
            {item.icon}
          </span>
        )}
        <span className="flex-1 min-w-0 truncate">{item.label}</span>
        {item.shortcut && (
          <span className="text-[10px] text-slate-500 shrink-0 font-mono">{item.shortcut}</span>
        )}
      </button>
    )
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
    <div ref={containerRef} className="relative inline-flex">
      {triggerElement}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            role="menu"
            aria-label={ariaLabel}
            onKeyDown={handleMenuKeyDown}
            initial={{ opacity: 0, scaleY: 0.96, ...enterFrom[side] }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0.96, ...enterFrom[side] }}
            transition={transitions.fade}
            style={{ originY: side === "bottom" ? 0 : 1 }}
            className={cn(
              "absolute z-50 min-w-[180px] rounded-[var(--radius-lg)] border border-border bg-surface-raised shadow-floating",
              "p-1",
              sideStyles[side],
              alignStyles[align],
              className,
            )}
          >
            {items.map((section, si) => {
              if (isGroup(section)) {
                return (
                  <div key={si}>
                    {si > 0 && <div role="separator" className="my-1 border-t border-border" />}
                    {section.group && (
                      <p className="px-3 pt-1.5 pb-1 text-xs font-medium text-muted-foreground">
                        {section.group}
                      </p>
                    )}
                    {section.items.map((item, i) => renderItem(item, i))}
                  </div>
                )
              }
              return renderItem(section, si)
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
