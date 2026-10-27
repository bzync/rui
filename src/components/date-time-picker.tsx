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
  iconButtonStyles,
} from "@/lib/component-styles"
import { useAnchoredPosition } from "@/hooks/use-anchored-position"
import { useControllableState } from "@/hooks/use-controllable-state"
import { mergeRefs } from "@/lib/merge-refs"
import { ThemePortal } from "./theme-provider"
import {
  type HTMLAttributes,
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"

export type DateTimePickerSize = "sm" | "md" | "lg"
export type DateTimePickerFormat = "12" | "24"

export interface DateTimePreset {
  label: string
  getValue: () => Date
}

export interface DateTimePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: Date | null
  defaultValue?: Date | null
  onChange?: (date: Date | null) => void
  label?: string
  hint?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  format?: DateTimePickerFormat
  is24Hour?: boolean
  showSeconds?: boolean
  minuteStep?: number
  presets?: DateTimePreset[]
  minDate?: Date
  maxDate?: Date
  size?: DateTimePickerSize
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

const triggerSizes: Record<DateTimePickerSize, string> = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-9 px-3 text-sm",
  lg: "h-10 px-3.5 text-sm",
}

function formatDateTime(d: Date, format: DateTimePickerFormat, showSeconds: boolean): string {
  const month = MONTHS[d.getMonth()].slice(0, 3)
  const day = d.getDate()
  const year = d.getFullYear()

  let hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, "0")
  const seconds = showSeconds ? `:${String(d.getSeconds()).padStart(2, "0")}` : ""

  if (format === "12") {
    const ampm = hours >= 12 ? "PM" : "AM"
    hours = hours % 12 || 12
    return `${month} ${day}, ${year} ${hours}:${minutes}${seconds} ${ampm}`
  }

  return `${month} ${day}, ${year} ${String(hours).padStart(2, "0")}:${minutes}${seconds}`
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function startDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export const DateTimePicker = forwardRef<HTMLDivElement, DateTimePickerProps>(function DateTimePicker(
  {
    value: controlledValue,
    defaultValue = null,
    onChange,
    label,
    hint,
    error,
    placeholder = "Select date & time…",
    disabled = false,
    clearable = true,
    format: propFormat = "12",
    is24Hour,
    showSeconds = false,
    minuteStep = 5,
    presets,
    minDate,
    maxDate,
    size = "md",
    className,
    id,
    ...props
  },
  ref,
) {
  const format: DateTimePickerFormat = is24Hour ? "24" : propFormat
  const [selected, setSelected] = useControllableState<Date | null>({
    value: controlledValue,
    defaultValue,
    onChange,
  })

  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const uid = useId()
  const inputId = id ?? uid

  const activeDate = selected ?? new Date()
  const [viewYear, setViewYear] = useState(activeDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(activeDate.getMonth())

  // Time state
  const [tempHours, setTempHours] = useState(activeDate.getHours())
  const [tempMinutes, setTempMinutes] = useState(activeDate.getMinutes())
  const [tempSeconds, setTempSeconds] = useState(activeDate.getSeconds())

  const { setFloating, style } = useAnchoredPosition({
    open,
    anchorRef: triggerRef,
    side: "bottom",
    align: "start",
    gap: 4,
    padding: 8,
  })

  // Sync temp time with selected date when opening
  useEffect(() => {
    if (open) {
      const d = selected ?? new Date()
      setViewYear(d.getFullYear())
      setViewMonth(d.getMonth())
      setTempHours(d.getHours())
      setTempMinutes(d.getMinutes())
      setTempSeconds(d.getSeconds())
    }
  }, [open, selected])

  // Outside click & escape listeners
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("pointerdown", handlePointerDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [open])

  const handleSelectDay = (day: number) => {
    const next = new Date(viewYear, viewMonth, day, tempHours, tempMinutes, tempSeconds)
    setSelected(next)
  }

  const handleApply = () => {
    const base = selected ?? new Date(viewYear, viewMonth, 1)
    const next = new Date(base.getFullYear(), base.getMonth(), base.getDate(), tempHours, tempMinutes, tempSeconds)
    setSelected(next)
    setOpen(false)
    triggerRef.current?.focus()
  }

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const totalDays = daysInMonth(viewYear, viewMonth)
  const startDay = startDayOfMonth(viewYear, viewMonth)
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1)
  const paddingArray = Array.from({ length: startDay }, (_, i) => i)

  return (
    <div ref={ref} className={cn(fieldRootStyles, className)} {...props}>
      {label && (
        <label id={`${inputId}-label`} className={cn(fieldLabelStyles, disabled && "opacity-50")}>
          {label}
        </label>
      )}

      <div className="relative inline-block w-full">
        <button
          ref={triggerRef}
          type="button"
          id={inputId}
          aria-haspopup="dialog"
          aria-expanded={open}
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={cn(
            controlBaseStyles,
            triggerSizes[size],
            "w-full justify-between font-normal text-left",
            !selected && "text-muted-foreground",
            error && controlInvalidStyles,
            disabled && "cursor-not-allowed opacity-50",
            focusRingStyles,
          )}
        >
          <span className="flex items-center gap-2 truncate">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-foreground">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span>{selected ? formatDateTime(selected, format, showSeconds) : placeholder}</span>
          </span>

          {clearable && selected && !disabled && (
            <span
              role="button"
              aria-label="Clear selected date and time"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation()
                setSelected(null)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation()
                  setSelected(null)
                }
              }}
              className="text-muted-foreground hover:text-foreground rounded p-0.5 transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </span>
          )}
        </button>

        {open && (
          <ThemePortal>
            <div
              ref={mergeRefs(panelRef, setFloating)}
              style={style}
              role="dialog"
              aria-label="Choose date and time"
              className="z-(--z-popover) flex flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-3 shadow-floating ring-1 ring-foreground/5 animate-in fade-in zoom-in-95 duration-100"
            >
              {/* Presets header */}
              {presets && presets.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pb-2.5 mb-2.5 border-b border-border">
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        const next = preset.getValue()
                        setSelected(next)
                        setOpen(false)
                      }}
                      className="rounded-[var(--radius-sm)] border border-border bg-surface-muted px-2 py-0.5 text-xs font-medium text-foreground transition-colors hover:border-border-strong hover:bg-foreground/5"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Left: Calendar Month */}
                <div className="w-64">
                  {/* Calendar Nav */}
                  <div className="flex items-center justify-between pb-2">
                    <button
                      type="button"
                      aria-label="Previous month"
                      onClick={prevMonth}
                      className={cn(iconButtonStyles, "h-7 w-7")}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>
                    <span className="text-xs font-semibold text-foreground">
                      {MONTHS[viewMonth]} {viewYear}
                    </span>
                    <button
                      type="button"
                      aria-label="Next month"
                      onClick={nextMonth}
                      className={cn(iconButtonStyles, "h-7 w-7")}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>

                  {/* Day Names */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground pb-1">
                    {DAYS.map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {paddingArray.map((i) => (
                      <span key={`pad-${i}`} className="h-7 w-7" />
                    ))}
                    {daysArray.map((day) => {
                      const dateObj = new Date(viewYear, viewMonth, day)
                      const isSelected = selected ? isSameDay(selected, dateObj) : false
                      const isToday = isSameDay(new Date(), dateObj)

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleSelectDay(day)}
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] text-xs font-medium transition-colors",
                            isSelected
                              ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                              : "text-foreground hover:bg-foreground/6",
                            isToday && !isSelected && "border border-accent text-accent font-semibold",
                          )}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Right: Time Selector */}
                <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-4 min-w-[120px]">
                  <span className="text-xs font-semibold text-foreground pb-2">Time</span>
                  <div className="flex items-center gap-1">
                    {/* Hours */}
                    <div className="flex flex-col items-center">
                      <label className="text-[10px] text-muted-foreground mb-1">Hr</label>
                      <select
                        aria-label="Hours"
                        value={format === "12" ? (tempHours % 12 || 12) : tempHours}
                        onChange={(e) => {
                          const val = Number(e.target.value)
                          if (format === "12") {
                            const isPM = tempHours >= 12
                            setTempHours((val % 12) + (isPM ? 12 : 0))
                          } else {
                            setTempHours(val)
                          }
                        }}
                        className="rounded border border-border bg-surface px-1 py-1 text-xs text-foreground outline-none"
                      >
                        {Array.from({ length: format === "12" ? 12 : 24 }, (_, i) => (format === "12" ? i + 1 : i)).map((h) => (
                          <option key={h} value={h}>
                            {String(h).padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                    </div>

                    <span className="pt-4 text-xs font-bold text-muted-foreground">:</span>

                    {/* Minutes */}
                    <div className="flex flex-col items-center">
                      <label className="text-[10px] text-muted-foreground mb-1">Min</label>
                      <select
                        aria-label="Minutes"
                        value={Math.floor(tempMinutes / minuteStep) * minuteStep}
                        onChange={(e) => setTempMinutes(Number(e.target.value))}
                        className="rounded border border-border bg-surface px-1 py-1 text-xs text-foreground outline-none"
                      >
                        {Array.from({ length: Math.floor(60 / minuteStep) }, (_, i) => i * minuteStep).map((m) => (
                          <option key={m} value={m}>
                            {String(m).padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* AM / PM Toggle for 12h */}
                    {format === "12" && (
                      <div className="flex flex-col items-center ml-1">
                        <label className="text-[10px] text-muted-foreground mb-1">&nbsp;</label>
                        <button
                          type="button"
                          onClick={() => setTempHours((h) => (h >= 12 ? h - 12 : h + 12))}
                          className="rounded border border-border bg-surface-muted px-1.5 py-1 text-xs font-semibold text-foreground hover:bg-foreground/5 transition-colors"
                        >
                          {tempHours >= 12 ? "PM" : "AM"}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-4 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const now = new Date()
                        setSelected(now)
                        setOpen(false)
                      }}
                      className="flex-1 rounded-[var(--radius-sm)] border border-border bg-surface px-2 py-1 text-xs font-medium text-foreground hover:bg-foreground/5 transition-colors"
                    >
                      Now
                    </button>
                    <button
                      type="button"
                      onClick={handleApply}
                      className="flex-1 rounded-[var(--radius-sm)] bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground hover:opacity-90 transition-opacity"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ThemePortal>
        )}
      </div>

      {error ? (
        <p className={fieldErrorStyles}>{error}</p>
      ) : hint ? (
        <p className={fieldDescriptionStyles}>{hint}</p>
      ) : null}
    </div>
  )
})
DateTimePicker.displayName = "DateTimePicker"
