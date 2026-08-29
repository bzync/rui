"use client"

import { cn } from "@/lib/cn"
import { AnimatePresence, motion } from "framer-motion"
import { RefObject } from "react"
import { createPortal } from "react-dom"
import { AutocompleteOption } from "./types"
import type { MenuPos } from "../select/types"
import { Highlight, SpinnerIcon } from "./icons"

export function AutocompleteDropdown<V>({
  listRef, listId, open, pos, multiple, loading, filtered, emptyMessage,
  activeIdx, setActiveIdx, inputText, selectedValues, singleValue,
  onSelectSingle, onToggleMulti,
  className,
  optionClassName, loadingClassName, emptyClassName,
}: {
  listRef: RefObject<HTMLUListElement | null>
  listId: string
  open: boolean
  pos: MenuPos | null
  multiple: boolean | undefined
  loading: boolean
  filtered: AutocompleteOption<V>[]
  emptyMessage: string
  activeIdx: number
  setActiveIdx: (i: number) => void
  inputText: string
  selectedValues: V[]
  singleValue: V | null | undefined
  onSelectSingle: (opt: AutocompleteOption<V>) => void
  onToggleMulti: (opt: AutocompleteOption<V>) => void
  className?: string
  optionClassName?: string
  loadingClassName?: string
  emptyClassName?: string
}) {
  if (typeof document === "undefined") return null

  return createPortal(
    <AnimatePresence>
      {open && pos && (
        <motion.ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-multiselectable={multiple}
          initial={{ opacity: 0, y: pos.placement === "bottom" ? -4 : 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: pos.placement === "bottom" ? -4 : 4 }}
          transition={{ duration: 0.13 }}
          style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width, maxHeight: pos.maxHeight }}
          className={cn("z-[110] overflow-y-auto rounded-[var(--radius-lg)] border border-border bg-surface-raised py-1 shadow-floating", className)}
        >
          {loading ? (
            <li className={cn("px-4 py-3 text-sm text-slate-600 flex items-center gap-2", loadingClassName)}>
              <SpinnerIcon />
              Loading…
            </li>
          ) : filtered.length === 0 ? (
            <li className={cn("px-4 py-3 text-sm text-slate-600", emptyClassName)}>{emptyMessage}</li>
          ) : (
            filtered.map((opt, i) => {
              const isActive = i === activeIdx
              const isSel = multiple ? selectedValues.includes(opt.value) : opt.value === singleValue
              return (
                <li
                  key={String(opt.value)}
                  id={`${listId}-opt-${i}`}
                  role="option"
                  aria-selected={isSel}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => multiple ? onToggleMulti(opt) : onSelectSingle(opt)}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={cn(
                    "flex min-h-9 items-center gap-3 px-3 py-2 cursor-pointer transition-colors",
                    isActive && "bg-surface-muted",
                    isSel && !isActive && "bg-accent-50 dark:bg-accent-500/10",
                    optionClassName,
                  )}
                >
                  {opt.icon && <span className="shrink-0 text-slate-500 dark:text-slate-400">{opt.icon}</span>}
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm", isSel ? "text-accent-700 dark:text-accent-300 font-medium" : "text-foreground")}>
                      <Highlight text={opt.label} query={inputText} />
                    </p>
                    {opt.description && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{opt.description}</p>
                    )}
                  </div>
                  {isSel && (
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-600 shrink-0">
                      <path d="m20 6-11 11-5-5" />
                    </svg>
                  )}
                </li>
              )
            })
          )}
        </motion.ul>
      )}
    </AnimatePresence>,
    document.body,
  )
}
