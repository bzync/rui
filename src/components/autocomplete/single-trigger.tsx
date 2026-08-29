"use client"

import { cn } from "@/lib/cn"
import { controlBaseStyles, controlInvalidStyles } from "@/lib/component-styles"
import { InputHTMLAttributes, KeyboardEvent, ReactNode } from "react"
import { SpinnerIcon, XIcon } from "./icons"

export function SingleTrigger({
  inputRef, inputId, listId, open, activeIdx, inputText, prefix, placeholder, disabled,
  error, loading, showClear, onInputChange, onFocus, onKeyDown, onClear,
  messageId, inputProps,
  className, inputClassName,
}: {
  inputRef: React.Ref<HTMLInputElement>
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
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus: () => void
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
  onClear: () => void
  messageId?: string
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "value" | "onChange" | "onFocus" | "onKeyDown" | "disabled" | "prefix">
  className?: string
  inputClassName?: string
}) {
  return (
    <div
      className={cn(
        "flex h-9 items-center gap-2 rounded-[var(--radius-md)] px-3",
        controlBaseStyles,
        error && controlInvalidStyles,
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {prefix && <span className="text-slate-500 shrink-0 text-sm">{prefix}</span>}
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
        placeholder={placeholder}
        disabled={disabled}
        className={cn("flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed", inputClassName)}
      />
      {loading && <SpinnerIcon />}
      {showClear && !loading && (
        <button type="button" onClick={onClear} className="shrink-0 text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors">
          <XIcon />
        </button>
      )}
    </div>
  )
}
