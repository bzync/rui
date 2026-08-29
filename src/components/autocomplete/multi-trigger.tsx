"use client"

import { cn } from "@/lib/cn"
import { controlBaseStyles, controlInvalidStyles } from "@/lib/component-styles"
import { InputHTMLAttributes, KeyboardEvent, ReactNode } from "react"
import { AutocompleteOption } from "./types"
import { SpinnerIcon, XIcon } from "./icons"

export function MultiTrigger<V>({
  inputRef, inputId, listId, open, activeIdx, inputText, prefix, placeholder, disabled,
  error, loading, showClear, selected, onContainerClick, onInputChange, onFocus, onKeyDown,
  onRemove, onClearAll,
  messageId, inputProps,
  className, inputClassName,
}: {
  inputRef: (node: HTMLInputElement | null) => void
  inputId: string
  listId: string
  open: boolean
  activeIdx: number
  inputText: string
  prefix?: ReactNode
  placeholder?: string
  disabled?: boolean
  error?: string
  loading: boolean
  showClear: boolean
  selected: AutocompleteOption<V>[]
  onContainerClick: () => void
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus: () => void
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
  onRemove: (opt: AutocompleteOption<V>) => void
  onClearAll: () => void
  messageId?: string
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "value" | "onChange" | "onFocus" | "onKeyDown" | "disabled" | "prefix">
  className?: string
  inputClassName?: string
}) {
  return (
    <div
      onClick={onContainerClick}
      className={cn(
        "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-[var(--radius-md)] px-2.5 py-1.5 cursor-text",
        controlBaseStyles,
        error && controlInvalidStyles,
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {prefix && <span className="text-slate-500 shrink-0 text-sm">{prefix}</span>}

      {selected.map((opt) => (
        <span
          key={String(opt.value)}
          className="inline-flex max-w-[200px] items-center gap-1 rounded-md border border-border bg-surface-muted px-2 py-0.5 text-xs font-medium text-foreground"
        >
          {opt.icon && <span className="shrink-0 text-slate-500 dark:text-slate-400">{opt.icon}</span>}
          <span className="truncate">{opt.label}</span>
          <button
            type="button"
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => { e.stopPropagation(); onRemove(opt) }}
            disabled={disabled}
            className="shrink-0 text-slate-500 dark:text-slate-400 hover:text-foreground transition-colors cursor-pointer ml-0.5"
            aria-label={`Remove ${opt.label}`}
          >
            <XIcon size={10} />
          </button>
        </span>
      ))}

      <input
        {...inputProps}
        ref={inputRef}
        id={inputId}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={activeIdx >= 0 ? `${listId}-opt-${activeIdx}` : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={messageId}
        autoComplete="off"
        value={inputText}
        onChange={onInputChange}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        placeholder={selected.length === 0 ? placeholder : undefined}
        disabled={disabled}
        className={cn("flex-1 min-w-[80px] bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed py-0.5", inputClassName)}
      />

      <span className="ml-auto flex items-center gap-1.5 shrink-0">
        {loading && <SpinnerIcon />}
        {showClear && !loading && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => { e.stopPropagation(); onClearAll() }}
            className="text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            aria-label="Clear all"
          >
            <XIcon />
          </button>
        )}
        {selected.length > 0 && (
          <span className="text-[10px] font-medium text-slate-500 tabular-nums">{selected.length}</span>
        )}
      </span>
    </div>
  )
}
