"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { getFocusable } from "@/utils/focus"
import { AnimatePresence, motion } from "framer-motion"
import {
  KeyboardEvent,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useId,
  useRef,
  useState,
} from "react"

export interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: ReactNode
  shortcut?: string[]
  group?: string
  keywords?: string[]
  onSelect: () => void
}

interface CommandContextValue {
  open: boolean
  setOpen: (v: boolean) => void
}

const CommandCtx = createContext<CommandContextValue | null>(null)

export function useCommand() {
  const ctx = useContext(CommandCtx)
  if (!ctx) throw new Error("useCommand must be inside <CommandProvider>")
  return ctx
}

export interface CommandProviderProps {
  children: ReactNode
  shortcut?: string
}

export function CommandProvider({ children, shortcut = "k" }: CommandProviderProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === shortcut) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [shortcut])

  return (
    <CommandCtx.Provider value={{ open, setOpen }}>
      {children}
    </CommandCtx.Provider>
  )
}

export interface CommandPaletteProps {
  items: CommandItem[]
  placeholder?: string
  emptyText?: string
  ariaLabel?: string
}

export function CommandPalette({
  items,
  placeholder = "Search commands…",
  emptyText = "No results found.",
  ariaLabel = "Command palette",
}: CommandPaletteProps) {
  const { open, setOpen } = useCommand()
  const [query, setQuery] = useState("")
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 0)
    const handleDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setOpen(false)
        return
      }
      if (event.key !== "Tab" || !dialogRef.current) return
      const focusable = getFocusable(dialogRef.current)
      if (focusable.length === 0) {
        event.preventDefault()
        dialogRef.current.focus()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    setQuery("")
    setActiveIdx(0)
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleDocumentKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", handleDocumentKeyDown)
      previouslyFocused?.focus()
    }
  }, [open, setOpen])

  const filtered = useMemo(() => {
    if (!query) return items
    const q = query.toLowerCase()
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.keywords?.some((k) => k.toLowerCase().includes(q)),
    )
  }, [query, items])

  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>()
    for (const item of filtered) {
      const g = item.group ?? ""
      if (!map.has(g)) map.set(g, [])
      map.get(g)!.push(item)
    }
    return map
  }, [filtered])
  const visibleItems = useMemo(() => Array.from(groups.values()).flat(), [groups])

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, Math.max(visibleItems.length - 1, 0)))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      visibleItems[activeIdx]?.onSelect()
      setOpen(false)
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  useEffect(() => {
    if (!listRef.current) return
    const el = listRef.current.querySelector(`[data-active="true"]`) as HTMLElement
    el?.scrollIntoView({ block: "nearest" })
  }, [activeIdx])

  let flatIdx = 0

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-overlay"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface-raised shadow-overlay"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 shrink-0">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                role="combobox"
                aria-label={ariaLabel}
                aria-autocomplete="list"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={visibleItems[activeIdx] ? `${listId}-option-${activeIdx}` : undefined}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIdx(0) }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <kbd className="shrink-0 rounded-[var(--radius-sm)] border border-border-strong bg-surface-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                ESC
              </kbd>
            </div>
            <div id={listId} ref={listRef} role="listbox" aria-label="Commands" className="max-h-80 overflow-y-auto py-1.5">
              {filtered.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">{emptyText}</p>
              ) : (
                Array.from(groups.entries()).map(([group, groupItems]) => (
                  <div key={group} role="group" aria-label={group || undefined}>
                    {group && (
                      <p className="px-4 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                        {group}
                      </p>
                    )}
                    {groupItems.map((item) => {
                      const myIdx = flatIdx++
                      const isActive = myIdx === activeIdx
                      return (
                        <button
                          key={item.id}
                          id={`${listId}-option-${myIdx}`}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          data-active={isActive}
                          onClick={() => { item.onSelect(); setOpen(false) }}
                          onMouseEnter={() => setActiveIdx(myIdx)}
                          className={cn(
                            "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                            focusRingStyles,
                            isActive
                              ? "bg-surface-muted"
                              : "hover:bg-surface-muted/70",
                          )}
                        >
                          {item.icon && (
                            <span className="shrink-0 text-slate-500 dark:text-slate-400 w-5 flex items-center justify-center">
                              {item.icon}
                            </span>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm text-foreground">{item.label}</p>
                            {item.description && (
                              <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                            )}
                          </div>
                          {item.shortcut && (
                            <div className="flex items-center gap-0.5 shrink-0">
                              {item.shortcut.map((k, i) => (
                                <kbd key={i} className="rounded-[var(--radius-sm)] border border-border bg-surface-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                                  {k}
                                </kbd>
                              ))}
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
