"use client"

import { cn } from "@/lib/cn"
import {
  controlBaseStyles,
  controlInvalidStyles,
  fieldDescriptionStyles,
  fieldErrorStyles,
  fieldLabelStyles,
  fieldRootStyles,
  focusRingStyles,
} from "@/lib/component-styles"
import { HTMLAttributes, KeyboardEvent, ReactNode, forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from "react"

export type TimePickerSize = "sm" | "md" | "lg"
export type TimePickerFormat = "12" | "24"
export type TimePickerSide = "top" | "bottom"

interface TimeParts {
  hour: number
  minute: number
  second: number
}

interface TimeOption {
  label: string
  value: number
}

const triggerSizes: Record<TimePickerSize, string> = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-9 px-3 text-sm",
  lg: "h-10 px-3.5 text-sm",
}

const sideStyles: Record<TimePickerSide, string> = {
  bottom: "top-full mt-1.5",
  top: "bottom-full mb-1.5",
}

const twoDigits = (value: number) => String(value).padStart(2, "0")

function parseTime(value?: string): TimeParts | null {
  if (!value) return null
  const match = /^(?:([01]\d|2[0-3])):([0-5]\d)(?::([0-5]\d))?$/.exec(value)
  if (!match) return null
  return {
    hour: Number(match[1]),
    minute: Number(match[2]),
    second: Number(match[3] ?? 0),
  }
}

function secondsSinceMidnight(parts: TimeParts) {
  return parts.hour * 3600 + parts.minute * 60 + parts.second
}

function serializeTime(parts: TimeParts, showSeconds: boolean) {
  const base = `${twoDigits(parts.hour)}:${twoDigits(parts.minute)}`
  return showSeconds ? `${base}:${twoDigits(parts.second)}` : base
}

function formatDisplay(value: string, format: TimePickerFormat, showSeconds: boolean) {
  const parts = parseTime(value)
  if (!parts) return ""
  const minutes = twoDigits(parts.minute)
  const seconds = showSeconds ? `:${twoDigits(parts.second)}` : ""
  if (format === "24") return `${twoDigits(parts.hour)}:${minutes}${seconds}`
  const period = parts.hour >= 12 ? "PM" : "AM"
  const hour = parts.hour % 12 || 12
  return `${hour}:${minutes}${seconds} ${period}`
}

function nowParts(minuteStep: number): TimeParts {
  const now = new Date()
  const lastMinute = Math.floor(59 / minuteStep) * minuteStep
  return {
    hour: now.getHours(),
    minute: Math.min(lastMinute, Math.round(now.getMinutes() / minuteStep) * minuteStep),
    second: now.getSeconds(),
  }
}

function TimeColumn({
  label,
  name,
  options,
  value,
  onSelect,
}: {
  label: string
  name: string
  options: TimeOption[]
  value: number
  onSelect: (value: number) => void
}) {
  const labelId = `${name}-label`

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return
    event.preventDefault()
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? options.length - 1
        : (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length
    const next = options[nextIndex]
    if (!next) return
    onSelect(next.value)
    const root = event.currentTarget.closest<HTMLElement>("[data-time-column]")
    root?.querySelectorAll<HTMLButtonElement>('[role="option"]')[nextIndex]?.focus()
  }

  return (
    <div className="min-w-0">
      <p id={labelId} className="mb-1.5 truncate text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div
        role="listbox"
        aria-labelledby={labelId}
        data-time-column={name}
        className="max-h-44 min-w-0 overflow-y-auto overscroll-contain rounded-[var(--radius-md)] border border-border bg-surface p-1 scrollbar-thin"
      >
        {options.map((option, index) => {
          const selected = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect(option.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "flex h-9 w-full items-center justify-center rounded-[var(--radius-sm)] px-1 text-xs tabular-nums transition-colors",
                focusRingStyles,
                selected
                  ? "bg-primary font-semibold text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export interface TimePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  label?: string
  hint?: string
  error?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  format?: TimePickerFormat
  minuteStep?: number
  showSeconds?: boolean
  min?: string
  max?: string
  name?: string
  disabled?: boolean
  required?: boolean
  clearable?: boolean
  placeholder?: string
  size?: TimePickerSize
  side?: TimePickerSide
  triggerClassName?: string
  panelClassName?: string
  labelClassName?: string
  messageClassName?: string
}

export const TimePicker = forwardRef<HTMLButtonElement, TimePickerProps>(({
  label,
  hint,
  error,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  format = "12",
  minuteStep = 5,
  showSeconds = false,
  min,
  max,
  name,
  disabled = false,
  required = false,
  clearable = true,
  placeholder = "Select time…",
  size = "md",
  side = "bottom",
  triggerClassName,
  panelClassName,
  labelClassName,
  messageClassName,
  className,
  id,
  onBlur,
  ...props
}, forwardedRef) => {
  const generatedId = useId()
  const triggerId = id ?? generatedId
  const panelId = `${triggerId}-panel`
  const messageId = `${triggerId}-message`
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  useImperativeHandle(forwardedRef, () => triggerRef.current as HTMLButtonElement)

  const normalizedMinuteStep = Number.isFinite(minuteStep) ? Math.max(1, Math.min(30, Math.floor(minuteStep))) : 5
  const normalize = (next: string) => {
    const parsed = parseTime(next)
    return parsed ? serializeTime(parsed, showSeconds) : ""
  }
  const [localValue, setLocalValue] = useState(() => normalize(defaultValue))
  const value = normalize(controlledValue ?? localValue)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<TimeParts>(() => parseTime(value) ?? nowParts(normalizedMinuteStep))

  const hours24 = Array.from({ length: 24 }, (_, hour) => ({ value: hour, label: twoDigits(hour) }))
  const hours12 = Array.from({ length: 12 }, (_, index) => ({ value: index + 1, label: twoDigits(index + 1) }))
  const minutes = Array.from({ length: Math.floor(59 / normalizedMinuteStep) + 1 }, (_, index) => {
    const minute = index * normalizedMinuteStep
    return { value: minute, label: twoDigits(minute) }
  })
  const seconds = Array.from({ length: 60 }, (_, second) => ({ value: second, label: twoDigits(second) }))
  const periods = [{ value: 0, label: "AM" }, { value: 1, label: "PM" }]
  const minParts = parseTime(min)
  const maxParts = parseTime(max)
  const draftSeconds = secondsSinceMidnight(draft)
  const belowMinimum = minParts ? draftSeconds < secondsSinceMidnight(minParts) : false
  const aboveMaximum = maxParts ? draftSeconds > secondsSinceMidnight(maxParts) : false
  const outOfRange = belowMinimum || aboveMaximum
  const displayValue = formatDisplay(value, format, showSeconds)

  function openPicker() {
    if (disabled) return
    setDraft(parseTime(value) ?? nowParts(normalizedMinuteStep))
    setOpen(true)
  }

  function closePicker(restoreFocus = false) {
    setOpen(false)
    if (restoreFocus) triggerRef.current?.focus()
  }

  function commit(next: string) {
    if (controlledValue === undefined) setLocalValue(next)
    onValueChange?.(next)
    closePicker(true)
  }

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closePicker()
    }
    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    requestAnimationFrame(() => {
      rootRef.current?.querySelector<HTMLButtonElement>('[data-time-column="hour"] [aria-selected="true"]')?.focus()
    })
  }, [open])

  return (
    <div
      ref={rootRef}
      className={cn("relative", fieldRootStyles, className)}
      onBlur={(event) => {
        onBlur?.(event)
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closePicker()
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault()
          closePicker(true)
        }
      }}
      {...props}
    >
      {label && (
        <label htmlFor={triggerId} className={cn(fieldLabelStyles, labelClassName)}>
          {label}
          {required && <><span aria-hidden="true" className="ml-1 text-destructive">*</span><span className="sr-only"> (required)</span></>}
        </label>
      )}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={panelId}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={error || hint ? messageId : undefined}
        onClick={() => open ? closePicker() : openPicker()}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !open) {
            event.preventDefault()
            openPicker()
          }
        }}
        className={cn(
          "flex w-full min-w-0 items-center gap-2 rounded-[var(--radius-md)] text-left",
          controlBaseStyles,
          focusRingStyles,
          error && controlInvalidStyles,
          triggerSizes[size],
          triggerClassName,
        )}
      >
        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-foreground"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
        <span className={cn("min-w-0 flex-1 truncate", displayValue ? "text-foreground" : "text-muted-foreground")}>{displayValue || placeholder}</span>
        <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {name && <input type="hidden" name={name} value={value} disabled={disabled} />}

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={label ? `Choose ${label.toLowerCase()}` : "Choose time"}
          className={cn(
            "absolute left-0 z-50 w-[min(22rem,calc(100vw-2rem))] max-h-[min(30rem,calc(100dvh-2rem))] overflow-y-auto rounded-[var(--radius-lg)] border border-border bg-surface-raised p-3 shadow-floating",
            sideStyles[side],
            panelClassName,
          )}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="min-w-0"><p className="truncate text-sm font-semibold text-foreground">Choose time</p><p className="text-[11px] text-muted-foreground">{format === "12" ? "12-hour" : "24-hour"} format</p></div>
            <button type="button" onClick={() => setDraft(nowParts(normalizedMinuteStep))} className={cn("h-8 rounded-md px-2.5 text-xs font-medium text-accent-700 hover:bg-muted dark:text-accent-300", focusRingStyles)}>Now</button>
          </div>

          <div className={cn("grid gap-2", format === "12" && showSeconds ? "grid-cols-4" : showSeconds || format === "12" ? "grid-cols-3" : "grid-cols-2")}>
            <TimeColumn
              label="Hour"
              name="hour"
              options={format === "24" ? hours24 : hours12}
              value={format === "24" ? draft.hour : draft.hour % 12 || 12}
              onSelect={(hour) => setDraft((current) => ({ ...current, hour: format === "24" ? hour : (hour % 12) + (current.hour >= 12 ? 12 : 0) }))}
            />
            <TimeColumn label="Minute" name="minute" options={minutes} value={draft.minute} onSelect={(minute) => setDraft((current) => ({ ...current, minute }))} />
            {showSeconds && <TimeColumn label="Second" name="second" options={seconds} value={draft.second} onSelect={(second) => setDraft((current) => ({ ...current, second }))} />}
            {format === "12" && <TimeColumn label="Period" name="period" options={periods} value={draft.hour >= 12 ? 1 : 0} onSelect={(period) => setDraft((current) => ({ ...current, hour: (current.hour % 12) + period * 12 }))} />}
          </div>

          {outOfRange && <p role="status" className="mt-2 text-xs text-destructive">Choose a time {belowMinimum ? `at or after ${formatDisplay(serializeTime(minParts as TimeParts, showSeconds), format, showSeconds)}` : `at or before ${formatDisplay(serializeTime(maxParts as TimeParts, showSeconds), format, showSeconds)}`}.</p>}

          <div className="mt-3 flex flex-wrap items-center justify-end gap-2 border-t border-border pt-3">
            {clearable && !required && value && <button type="button" onClick={() => commit("")} className={cn("mr-auto h-8 rounded-md px-2.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground", focusRingStyles)}>Clear</button>}
            <button type="button" onClick={() => closePicker(true)} className={cn("h-8 rounded-md px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground", focusRingStyles)}>Cancel</button>
            <button type="button" disabled={outOfRange} onClick={() => commit(serializeTime(draft, showSeconds))} className={cn("h-8 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40", focusRingStyles)}>Apply</button>
          </div>
        </div>
      )}

      {error && <p id={messageId} aria-live="polite" className={cn(fieldErrorStyles, messageClassName)}>{error}</p>}
      {hint && !error && <p id={messageId} className={cn(fieldDescriptionStyles, messageClassName)}>{hint}</p>}
    </div>
  )
})
TimePicker.displayName = "TimePicker"
