"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles } from "@/lib/component-styles"
import { mergeRefs } from "@/lib/merge-refs"
import { useControllableState } from "@/hooks/use-controllable-state"
import { useEventCallback } from "@/hooks/use-event-callback"
import { type ChangeEvent, type KeyboardEvent, forwardRef, useEffect, useRef, useState } from "react"
import { Input, type InputProps } from "./input"
import { Kbd } from "./kbd"
import { Spinner } from "./spinner"

export interface SearchInputProps extends Omit<InputProps, "type" | "value" | "defaultValue" | "onChange" | "prefix"> {
  value?: string
  defaultValue?: string
  /** Called on every keystroke with the new text. */
  onValueChange?: (value: string) => void
  /** Called with the text after `debounceMs` of inactivity, and immediately on Enter or clear. */
  onSearch?: (value: string) => void
  debounceMs?: number
  /** Global shortcut that focuses the field: a single key such as "/" or "mod+k" (⌘K on Apple, Ctrl+K elsewhere). */
  shortcut?: string
  /** Shows a spinner in place of the search icon. */
  loading?: boolean
  clearLabel?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

const SearchIcon = () => (
  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
)

const isApple = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)

function parseShortcut(shortcut: string) {
  const parts = shortcut.toLowerCase().split("+")
  return { mod: parts.includes("mod"), shift: parts.includes("shift"), key: parts[parts.length - 1] }
}

/**
 * Search field with a clear button, Escape-to-clear, debounced `onSearch`,
 * a loading state and an optional global focus shortcut shown as a key hint.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSearch,
  debounceMs = 250,
  shortcut,
  loading = false,
  clearLabel = "Clear search",
  placeholder = "Search…",
  onChange,
  onKeyDown,
  disabled,
  inputClassName,
  ...props
}, ref) {
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange })
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const search = useEventCallback((next: string) => onSearch?.(next))
  // Platform is only known on the client; resolve it after mount so hydration matches.
  const [apple, setApple] = useState(false)
  useEffect(() => setApple(isApple()), [])

  const flush = (next: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    search(next)
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  useEffect(() => {
    if (!shortcut) return
    const { mod, shift, key } = parseShortcut(shortcut)
    const onKey = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing = target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
      // Bare keys like "/" must not fire while the user is typing elsewhere.
      if (!mod && typing) return
      if (mod !== (event.metaKey || event.ctrlKey) || shift !== event.shiftKey || event.key.toLowerCase() !== key) return
      event.preventDefault()
      inputRef.current?.focus()
      inputRef.current?.select()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [shortcut])

  const update = (next: string) => {
    setValue(next)
    if (!onSearch) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => search(next), debounceMs)
  }

  const clear = () => {
    setValue("")
    flush("")
    inputRef.current?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (event.key === "Escape" && value) { event.preventDefault(); event.stopPropagation(); clear() }
    else if (event.key === "Enter") flush(value)
  }

  const shortcutKeys = shortcut ? parseShortcut(shortcut) : null
  const hint = shortcutKeys ? [...(shortcutKeys.mod ? [apple ? "⌘" : "Ctrl"] : []), ...(shortcutKeys.shift ? ["⇧"] : []), shortcutKeys.key.length === 1 ? shortcutKeys.key.toUpperCase() : shortcutKeys.key] : null

  return (
    <Input
      ref={mergeRefs(inputRef, ref)}
      {...props}
      type="search"
      role="searchbox"
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      autoComplete="off"
      enterKeyHint="search"
      aria-keyshortcuts={shortcut ? shortcut.replace(/mod/i, apple ? "Meta" : "Control") : undefined}
      onChange={(event) => { update(event.target.value); onChange?.(event) }}
      onKeyDown={handleKeyDown}
      inputClassName={cn("[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none", inputClassName)}
      prefix={loading ? <Spinner size="sm" /> : <SearchIcon />}
      suffix={
        value ? (
          <button
            type="button"
            aria-label={clearLabel}
            disabled={disabled}
            onClick={clear}
            className={cn("-mr-1.5 grid size-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground", focusRingStyles)}
          >
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        ) : hint ? <Kbd keys={hint} aria-hidden="true" className="hidden sm:inline-flex" /> : undefined
      }
    />
  )
})
SearchInput.displayName = "SearchInput"
