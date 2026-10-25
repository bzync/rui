"use client"

import { cn } from "@/lib/cn"
import { ThemePortal } from "../theme-provider"
import { AnimatePresence } from "framer-motion"
import { motion } from "@/lib/motion-components"
import type { FlatOption, MenuPos, SelectItem, SelectOption, SelectOptionColor } from "./types"
import { isGroup } from "./utils"

export function OptionList({
  listId,
  listRef,
  open,
  pos,
  options,
  flat,
  activeIdx,
  setActiveIdx,
  isSelected,
  onSelect,
  colorDot,
  multiselectable = false,
  className,
  optionClassName,
  groupLabelClassName,
}: {
  listId: string
  listRef: React.RefObject<HTMLUListElement | null>
  open: boolean
  pos: MenuPos | null
  options: SelectItem[]
  flat: FlatOption[]
  activeIdx: number
  setActiveIdx: (i: number) => void
  isSelected: (value: string) => boolean
  onSelect: (opt: SelectOption) => void
  colorDot: Record<SelectOptionColor, string>
  multiselectable?: boolean
  className?: string
  optionClassName?: string
  groupLabelClassName?: string
}) {
  if (typeof document === "undefined") return null

  return (
    <ThemePortal>
    <AnimatePresence>
      {open && pos && (
        <motion.ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-multiselectable={multiselectable}
          initial={{ opacity: 0, y: pos.placement === "bottom" ? -4 : 4, scaleY: 0.97 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: pos.placement === "bottom" ? -4 : 4, scaleY: 0.97 }}
          transition={{ duration: 0.13 }}
          style={{ originY: pos.placement === "bottom" ? 0 : 1, position: "fixed", top: pos.top, left: pos.left, width: pos.width, maxHeight: pos.maxHeight }}
          // --z-popover sits above --z-modal: this portals to document.body
          // like Drawer does, so stacking is purely z-index, not DOM order. A
          // Select used inside a Modal or Drawer must render above it or its
          // option list is painted over by the opaque panel.
          className={cn("z-(--z-popover) overflow-y-auto rounded-[var(--radius-lg)] border border-border bg-surface-raised py-1 shadow-floating", className)}
        >
          {options.map((item, gi) =>
            isGroup(item) ? (
              <li key={gi}>
                <p className={cn("px-3 pt-2 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-widest", groupLabelClassName)}>
                  {item.group}
                </p>
                <ul>
                  {item.options.map((opt) => {
                    const fo = flat.find((f) => f.value === opt.value)!
                    return (
                      <OptionItem
                        key={opt.value}
                        opt={opt}
                        listId={listId}
                        flatIdx={fo.flatIdx}
                        isActive={fo.flatIdx === activeIdx}
                        isSelected={isSelected(opt.value)}
                        onSelect={onSelect}
                        onHover={setActiveIdx}
                        colorDot={colorDot}
                        className={optionClassName}
                      />
                    )
                  })}
                </ul>
              </li>
            ) : (
              <OptionItem
                key={item.value}
                opt={item}
                listId={listId}
                flatIdx={flat.find((f) => f.value === item.value)!.flatIdx}
                isActive={flat.find((f) => f.value === item.value)!.flatIdx === activeIdx}
                isSelected={isSelected(item.value)}
                onSelect={onSelect}
                onHover={setActiveIdx}
                colorDot={colorDot}
                className={optionClassName}
              />
            ),
          )}
        </motion.ul>
      )}
    </AnimatePresence>
    </ThemePortal>
  )
}

function OptionItem({
  opt,
  listId,
  flatIdx,
  isActive,
  isSelected,
  onSelect,
  onHover,
  colorDot,
  className,
}: {
  opt: SelectOption
  listId: string
  flatIdx: number
  isActive: boolean
  isSelected: boolean
  onSelect: (opt: SelectOption) => void
  onHover: (idx: number) => void
  colorDot: Record<SelectOptionColor, string>
  className?: string
}) {
  return (
    <li
      id={`${listId}-opt-${flatIdx}`}
      role="option"
      aria-selected={isSelected}
      aria-disabled={opt.disabled}
      data-idx={flatIdx}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => !opt.disabled && onSelect(opt)}
      onMouseEnter={() => !opt.disabled && onHover(flatIdx)}
      className={cn(
        "flex min-h-9 items-center gap-3 px-3 py-2 cursor-pointer transition-colors select-none",
        isActive && "bg-surface-muted",
        isSelected && !isActive && "bg-accent-500/8",
        opt.disabled && "opacity-40 cursor-not-allowed pointer-events-none",
        className,
      )}
    >
      {opt.icon && <span className="shrink-0 text-muted-foreground">{opt.icon}</span>}
      {opt.color && opt.color !== "default" && (
        <span className={cn("w-2 h-2 rounded-full shrink-0", colorDot[opt.color])} />
      )}
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm leading-snug truncate", isSelected ? "text-accent-strong font-medium" : "text-foreground")}>
          {opt.label}
        </p>
        {opt.description && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{opt.description}</p>
        )}
      </div>
      {isSelected && (
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-600 shrink-0">
          <path d="m20 6-11 11-5-5" />
        </svg>
      )}
    </li>
  )
}
