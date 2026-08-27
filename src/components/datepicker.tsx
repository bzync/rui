"use client"

import { cn } from "@/lib/cn"
import { controlBaseStyles, controlInvalidStyles, fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles, iconButtonStyles } from "@/lib/component-styles"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useId, useRef, useState } from "react"

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function formatDate(d: Date): string {
  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`
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

export interface DatePickerProps {
  value?: Date | null
  onChange?: (date: Date | null) => void
  label?: string
  hint?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  minDate?: Date
  maxDate?: Date
  className?: string
}

export function DatePicker({
  value: controlledValue,
  onChange,
  label,
  hint,
  error,
  placeholder = "Select date…",
  disabled,
  clearable = true,
  minDate,
  maxDate,
  className,
}: DatePickerProps) {
  const [localValue, setLocalValue] = useState<Date | null>(null)
  const value = controlledValue !== undefined ? controlledValue : localValue

  const today = new Date()
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState((value ?? today).getFullYear())
  const [viewMonth, setViewMonth] = useState((value ?? today).getMonth())
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerId = useId()
  const messageId = `${triggerId}-message`

  function select(date: Date) {
    if (controlledValue === undefined) setLocalValue(date)
    onChange?.(date)
    setOpen(false)
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation()
    if (controlledValue === undefined) setLocalValue(null)
    onChange?.(null)
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onOutside)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onOutside)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  const totalDays = daysInMonth(viewYear, viewMonth)
  const startDay = startDayOfMonth(viewYear, viewMonth)
  const cells: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]

  return (
    <div ref={containerRef} className={cn("relative", fieldRootStyles, className)}>
      {label && (
        <label htmlFor={triggerId} className={fieldLabelStyles}>{label}</label>
      )}
      <button
        type="button"
        id={triggerId}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? messageId : undefined}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-[var(--radius-md)] px-3 text-left outline-none",
          controlBaseStyles,
          "focus:border-accent-500 focus:ring-2 focus:ring-focus-ring/20",
          error && controlInvalidStyles,
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 shrink-0">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
        </svg>
        <span className={cn("flex-1 text-sm truncate", value ? "text-foreground" : "text-muted-foreground")}>
          {value ? formatDate(value) : placeholder}
        </span>
        {clearable && value && !disabled && (
          <span
            role="button"
            tabIndex={-1}
            onClick={clear}
            className="shrink-0 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scaleY: 0.97 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.97 }}
            transition={{ duration: 0.13 }}
            style={{ originY: 0 }}
            role="dialog"
            aria-label="Choose date"
            className="absolute left-0 top-full z-50 mt-1.5 w-[min(18rem,calc(100vw-2rem))] rounded-[var(--radius-lg)] border border-border bg-surface-raised p-3 shadow-floating"
          >
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={prevMonth}
                aria-label="Previous month"
                className={cn(iconButtonStyles, "size-7")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <span aria-live="polite" className="text-sm font-semibold text-foreground">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                aria-label="Next month"
                className={cn(iconButtonStyles, "size-7")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {DAYS.map((d) => (
                <div key={d} aria-hidden="true" className="text-center text-[10px] font-semibold text-muted-foreground py-1">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {cells.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />
                const date = new Date(viewYear, viewMonth, day)
                const isSelected = value ? isSameDay(date, value) : false
                const isToday = isSameDay(date, today)
                const isDisabled =
                  (minDate && date < minDate) || (maxDate && date > maxDate)

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={!!isDisabled}
                    onClick={() => select(date)}
                    aria-label={date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    aria-pressed={isSelected}
                    aria-current={isToday ? "date" : undefined}
                    className={cn(
                      "h-8 w-full rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35",
                      isSelected
                        ? "bg-primary text-primary-foreground font-medium"
                        : isToday
                        ? "border border-accent-500/40 text-accent-400 hover:bg-accent-500/10"
                        : "text-slate-700 dark:text-slate-200 hover:bg-black/6 dark:hover:bg-white/6",
                      isDisabled && "opacity-30 cursor-not-allowed",
                    )}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {error && <p id={messageId} aria-live="polite" className={fieldErrorStyles}>{error}</p>}
      {hint && !error && <p id={messageId} className={fieldDescriptionStyles}>{hint}</p>}
    </div>
  )
}
