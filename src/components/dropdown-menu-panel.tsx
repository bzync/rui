"use client"

import { cn } from "@/lib/cn"
import { AnimatePresence, motion } from "framer-motion"
import { transitions } from "@/lib/motion"
import type { DropdownMenuSection, DropdownMenuItem, DropdownMenuGroup } from "./dropdown-menu"

type Side = "bottom" | "top"
type Align = "start" | "end" | "center"

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

function isGroup(s: DropdownMenuSection): s is DropdownMenuGroup {
  return "items" in s
}

export interface DropdownMenuPanelProps {
  open: boolean
  menuRef: React.RefObject<HTMLDivElement | null>
  items: DropdownMenuSection[]
  side: Side
  align: Align
  className?: string
  itemClassName?: string
  groupLabelClassName?: string
  separatorClassName?: string
  ariaLabel: string
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void
  onSelect: () => void
}

/**
 * The framer-motion-backed menu surface for {@link DropdownMenu}, split into its
 * own async chunk so the motion runtime stays off the initial critical path —
 * it loads on first open of any dropdown, not on page load.
 */
export default function DropdownMenuPanel({
  open,
  menuRef,
  items,
  side,
  align,
  className,
  itemClassName,
  groupLabelClassName,
  separatorClassName,
  ariaLabel,
  onKeyDown,
  onSelect,
}: DropdownMenuPanelProps) {
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
          onSelect()
        }}
        className={cn(
          "flex min-h-9 items-center gap-2.5 w-full px-3 py-2 text-sm rounded-md transition-colors text-left focus-visible:outline-none focus-visible:bg-surface-muted",
          item.destructive
            ? "text-destructive hover:bg-destructive/10"
            : "text-foreground hover:bg-surface-muted",
          item.disabled && "opacity-40 cursor-not-allowed pointer-events-none",
          itemClassName,
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          role="menu"
          aria-label={ariaLabel}
          onKeyDown={onKeyDown}
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
                  {si > 0 && <div role="separator" className={cn("my-1 border-t border-border", separatorClassName)} />}
                  {section.group && (
                    <p className={cn("px-3 pt-1.5 pb-1 text-xs font-medium text-muted-foreground", groupLabelClassName)}>
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
  )
}
