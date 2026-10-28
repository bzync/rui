"use client"

import { cn } from "@/lib/cn"
import { fieldDescriptionStyles, fieldErrorStyles, focusRingStyles } from "@/lib/component-styles"
import { useControllableState } from "@/hooks/use-controllable-state"
import { CheckIcon } from "@/lib/icons"
import { mergeRefs } from "@/lib/merge-refs"
import {
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"

export interface InlineEditProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string
  defaultValue?: string
  onChange?: (val: string) => void
  onValueChange?: (val: string) => void
  onSave?: (val: string) => Promise<void> | void
  onCancel?: () => void
  label?: ReactNode
  hint?: ReactNode
  error?: string
  placeholder?: string
  multiline?: boolean
  validate?: (val: string) => string | null | undefined
  saveOnBlur?: boolean
  disabled?: boolean
  readOnly?: boolean
  ariaLabel?: string
  inputClassName?: string
}

export const InlineEdit = forwardRef<HTMLDivElement, InlineEditProps>(function InlineEdit(
  {
    value: controlledValue,
    defaultValue = "",
    onChange,
    onValueChange,
    onSave,
    onCancel,
    label,
    hint,
    error,
    placeholder = "Click to edit…",
    multiline = false,
    validate,
    saveOnBlur = true,
    disabled = false,
    readOnly = false,
    ariaLabel,
    inputClassName,
    className,
    ...props
  },
  ref,
) {
  const [val, setVal] = useControllableState({
    value: controlledValue,
    defaultValue,
    onChange: (next) => {
      onChange?.(next)
      onValueChange?.(next)
    },
  })

  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(val)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const uid = useId()
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  const displayError = error ?? errorMessage
  const errorId = displayError ? `${uid}-error` : undefined
  const hintId = hint && !displayError ? `${uid}-hint` : undefined
  const describedBy = errorId ?? hintId

  useEffect(() => {
    setDraft(val)
  }, [val])

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const startEditing = () => {
    if (disabled || readOnly || saving) return
    setDraft(val)
    setErrorMessage(null)
    setIsEditing(true)
  }

  const cancel = () => {
    setDraft(val)
    setErrorMessage(null)
    setIsEditing(false)
    onCancel?.()
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  const save = async () => {
    if (saving) return
    if (validate) {
      const err = validate(draft)
      if (err) {
        setErrorMessage(err)
        return
      }
    }
    setErrorMessage(null)

    if (draft === val) {
      setIsEditing(false)
      requestAnimationFrame(() => triggerRef.current?.focus())
      return
    }

    try {
      setSaving(true)
      await onSave?.(draft)
      setVal(draft)
      setIsEditing(false)
      requestAnimationFrame(() => triggerRef.current?.focus())
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault()
      cancel()
    } else if (e.key === "Enter" && (!multiline || e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      save()
    }
  }

  const handleBlur = (e: React.FocusEvent) => {
    // If clicking on save or cancel buttons within the container, do not auto-save yet
    if (e.currentTarget.contains(e.relatedTarget as Node)) return
    if (saveOnBlur && isEditing) {
      save()
    }
  }

  if (!isEditing) {
    return (
      <div
        ref={mergeRefs(triggerRef, ref)}
        role="button"
        tabIndex={disabled || readOnly ? -1 : 0}
        aria-label={ariaLabel ?? (typeof label === "string" ? label : "Editable text")}
        onClick={startEditing}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            startEditing()
          }
        }}
        className={cn(
          "group relative inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-2 py-1 text-sm font-medium transition-colors text-foreground",
          !disabled && !readOnly && "cursor-pointer hover:bg-foreground/5 hover:ring-1 hover:ring-border",
          (disabled || readOnly) && "cursor-default opacity-60",
          focusRingStyles,
          className,
        )}
        {...props}
      >
        <span className={cn(!val && "text-muted-foreground italic")}>
          {val || placeholder}
        </span>
        {!disabled && !readOnly && (
          <span className="opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </span>
        )}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      onBlur={handleBlur}
      className={cn("flex flex-col gap-1 w-full max-w-md", className)}
      {...props}
    >
      <div className="flex items-center gap-1.5 w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            disabled={saving}
            aria-label={ariaLabel ?? (typeof label === "string" ? label : "Inline editable value")}
            aria-invalid={Boolean(displayError) || undefined}
            aria-describedby={describedBy}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            className={cn(
              "w-full rounded-[var(--radius-md)] border border-border bg-surface px-2.5 py-1.5 text-sm text-foreground shadow-xs outline-none transition-colors",
              focusRingStyles,
              displayError && "border-danger ring-1 ring-danger",
              inputClassName,
            )}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={draft}
            disabled={saving}
            aria-label={ariaLabel ?? (typeof label === "string" ? label : "Inline editable value")}
            aria-invalid={Boolean(displayError) || undefined}
            aria-describedby={describedBy}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full rounded-[var(--radius-md)] border border-border bg-surface px-2.5 py-1 text-sm text-foreground shadow-xs outline-none transition-colors",
              focusRingStyles,
              displayError && "border-danger ring-1 ring-danger",
              inputClassName,
            )}
          />
        )}

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            aria-label="Save"
            disabled={saving}
            onClick={save}
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-accent text-accent-foreground shadow-xs transition-opacity hover:opacity-90 disabled:opacity-50",
              focusRingStyles,
            )}
          >
            {saving ? (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
            ) : (
              <CheckIcon size={13} strokeWidth={2.5} />
            )}
          </button>
          <button
            type="button"
            aria-label="Cancel"
            disabled={saving}
            onClick={cancel}
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground disabled:opacity-50",
              focusRingStyles,
            )}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {displayError && (
        <span id={errorId} className={fieldErrorStyles}>{displayError}</span>
      )}
      {hint && !displayError && (
        <span id={hintId} className={fieldDescriptionStyles}>{hint}</span>
      )}
    </div>
  )
})
InlineEdit.displayName = "InlineEdit"
