"use client"

import { cn } from "@/lib/cn"
import { controlBaseStyles, controlInvalidStyles, fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles, iconButtonStyles } from "@/lib/component-styles"
import { AnimatePresence, motion } from "framer-motion"
import { type CSSProperties, type HTMLAttributes, type KeyboardEvent as ReactKeyboardEvent, forwardRef, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState } from "react"

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

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

export interface DatePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
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
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(({
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
  ...props
}, forwardedRef) => {
  const [localValue, setLocalValue] = useState<Date | null>(null)
  const value = controlledValue !== undefined ? controlledValue : localValue

  const today = new Date()
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState((value ?? today).getFullYear())
  const [viewMonth, setViewMonth] = useState((value ?? today).getMonth())
  const [focusDate, setFocusDate] = useState(value ?? today)
  const [panelPosition, setPanelPosition] = useState<CSSProperties>({ visibility: "hidden" })
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(forwardedRef, () => containerRef.current as HTMLDivElement)
  const triggerId = useId()
  const dialogId = `${triggerId}-dialog`
  const messageId = `${triggerId}-message`

  function isUnavailable(date: Date) {
    return Boolean((minDate && date < minDate) || (maxDate && date > maxDate))
  }

  function focusCalendarDate(date: Date) {
    if (isUnavailable(date)) return
    const staysInView = date.getFullYear() === viewYear && date.getMonth() === viewMonth
    setFocusDate(date)
    setViewYear(date.getFullYear())
    setViewMonth(date.getMonth())
    if (staysInView) {
      panelRef.current?.querySelector<HTMLButtonElement>(`[data-date="${dateKey(date)}"]`)?.focus({ preventScroll: true })
      return
    }
    requestAnimationFrame(() => requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLButtonElement>(`[data-date="${dateKey(date)}"]`)?.focus({ preventScroll: true })
    }))
  }

  function getInitialFocusDate() {
    if (value && !isUnavailable(value)) return value
    if (!isUnavailable(today)) return today
    if (minDate && (!maxDate || minDate <= maxDate)) return minDate
    return maxDate ?? today
  }

  function openCalendar() {
    const initial = getInitialFocusDate()
    setFocusDate(initial)
    setViewYear(initial.getFullYear())
    setViewMonth(initial.getMonth())
    setPanelPosition({ visibility: "hidden" })
    setOpen(true)
    requestAnimationFrame(() => requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLButtonElement>(`[data-date="${dateKey(initial)}"]`)?.focus({ preventScroll: true })
    }))
  }

  function closeCalendar(restoreFocus = false) {
    setOpen(false)
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus())
  }

  function select(date: Date) {
    if (controlledValue === undefined) setLocalValue(date)
    onChange?.(date)
    closeCalendar(true)
  }

  function clear() {
    if (controlledValue === undefined) setLocalValue(null)
    onChange?.(null)
  }

  function monthHasAvailableDates(year: number, month: number) {
    const first = new Date(year, month, 1)
    const last = new Date(year, month + 1, 0, 23, 59, 59, 999)
    return !(minDate && minDate > last) && !(maxDate && maxDate < first)
  }

  function moveMonth(offset: -1 | 1) {
    const target = new Date(viewYear, viewMonth + offset, 1)
    const targetYear = target.getFullYear()
    const targetMonth = target.getMonth()
    if (!monthHasAvailableDates(targetYear, targetMonth)) return
    let nextFocus = new Date(targetYear, targetMonth, Math.min(focusDate.getDate(), daysInMonth(targetYear, targetMonth)))
    if (minDate && nextFocus < minDate && minDate.getFullYear() === targetYear && minDate.getMonth() === targetMonth) nextFocus = new Date(targetYear, targetMonth, minDate.getDate())
    if (maxDate && nextFocus > maxDate && maxDate.getFullYear() === targetYear && maxDate.getMonth() === targetMonth) nextFocus = new Date(targetYear, targetMonth, maxDate.getDate())
    setViewYear(targetYear)
    setViewMonth(targetMonth)
    setFocusDate(nextFocus)
  }

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) closeCalendar()
    }
    function onKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape" && open) {
        e.preventDefault()
        closeCalendar(true)
      }
    }
    document.addEventListener("mousedown", onOutside)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onOutside)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  useLayoutEffect(() => {
    if (!open) return
    const updatePosition = () => {
      const trigger = triggerRef.current
      const panel = panelRef.current
      if (!trigger || !panel) return
      const viewportPadding = 16
      const gap = 6
      const panelRect = panel.getBoundingClientRect()
      if (window.innerWidth < 640) {
        setPanelPosition({ insetInline: 8, bottom: 8, top: "auto", width: "auto", visibility: "visible" })
        return
      }
      const triggerRect = trigger.getBoundingClientRect()
      const left = Math.min(Math.max(triggerRect.left, viewportPadding), Math.max(viewportPadding, window.innerWidth - panelRect.width - viewportPadding))
      const below = triggerRect.bottom + gap
      const above = triggerRect.top - panelRect.height - gap
      const top = below + panelRect.height <= window.innerHeight - viewportPadding || above < viewportPadding ? below : above
      setPanelPosition({ left, top: Math.min(Math.max(top, viewportPadding), Math.max(viewportPadding, window.innerHeight - panelRect.height - viewportPadding)), visibility: "visible" })
    }
    updatePosition()
    window.addEventListener("resize", updatePosition)
    document.addEventListener("scroll", updatePosition, true)
    return () => {
      window.removeEventListener("resize", updatePosition)
      document.removeEventListener("scroll", updatePosition, true)
    }
  }, [open])

  useEffect(() => {
    if (!open || window.innerWidth >= 640) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = previousOverflow }
  }, [open])

  function handleDayKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, date: Date) {
    let next: Date | undefined
    if (event.key === "ArrowLeft") next = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1)
    else if (event.key === "ArrowRight") next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    else if (event.key === "ArrowUp") next = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7)
    else if (event.key === "ArrowDown") next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7)
    else if (event.key === "Home") next = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay())
    else if (event.key === "End") next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (6 - date.getDay()))
    else if (event.key === "PageUp") next = new Date(date.getFullYear(), date.getMonth() - 1, Math.min(date.getDate(), daysInMonth(date.getFullYear(), date.getMonth() - 1)))
    else if (event.key === "PageDown") next = new Date(date.getFullYear(), date.getMonth() + 1, Math.min(date.getDate(), daysInMonth(date.getFullYear(), date.getMonth() + 1)))
    if (!next) return
    event.preventDefault()
    focusCalendarDate(next)
  }

  const totalDays = daysInMonth(viewYear, viewMonth)
  const startDay = startDayOfMonth(viewYear, viewMonth)
  const cells: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]

  return (
    <div ref={containerRef} className={cn("relative", fieldRootStyles, className)} {...props}>
      {label && (
        <label htmlFor={triggerId} className={fieldLabelStyles}>{label}</label>
      )}
      <div className={cn("flex h-11 w-full items-center rounded-[var(--radius-md)] sm:h-9", controlBaseStyles, error && controlInvalidStyles, disabled && "cursor-not-allowed opacity-50")}>
      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? messageId : undefined}
        disabled={disabled}
        onClick={() => open ? closeCalendar() : openCalendar()}
        className="flex h-full min-w-0 flex-1 items-center gap-2 rounded-[var(--radius-md)] px-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 shrink-0">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
        </svg>
        <span className={cn("flex-1 text-sm truncate", value ? "text-foreground" : "text-muted-foreground")}>
          {value ? formatDate(value) : placeholder}
        </span>
      </button>
      {clearable && value && !disabled && <button type="button" aria-label={`Clear ${label?.toLowerCase() ?? "date"}`} onClick={clear} className={cn(iconButtonStyles, "mr-1 size-9 sm:size-7")}><svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg></button>}
      </div>

      <AnimatePresence>
        {open && (
          <>
          <motion.div aria-hidden="true" className="fixed inset-0 z-40 bg-overlay sm:hidden" onMouseDown={() => closeCalendar(true)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            ref={panelRef}
            id={dialogId}
            initial={{ opacity: 0, y: -4, scaleY: 0.97 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.97 }}
            transition={{ duration: 0.13 }}
            role="dialog"
            aria-label={label ? `Choose ${label.toLowerCase()}` : "Choose date"}
            className="fixed z-50 w-[min(18rem,calc(100vw-2rem))] max-h-[calc(100dvh-1rem)] overflow-y-auto rounded-[var(--radius-lg)] border border-border bg-surface-raised p-3 shadow-floating"
            style={{ ...panelPosition, originY: 0 }}
          >
            <div className="mb-2 flex items-center justify-between gap-3 sm:hidden"><strong className="text-sm text-foreground">{label ? `Choose ${label.toLowerCase()}` : "Choose date"}</strong><button type="button" onClick={() => closeCalendar(true)} className={cn(iconButtonStyles, "size-11")} aria-label="Close date picker"><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg></button></div>
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => moveMonth(-1)}
                disabled={!monthHasAvailableDates(new Date(viewYear, viewMonth - 1, 1).getFullYear(), new Date(viewYear, viewMonth - 1, 1).getMonth())}
                aria-label="Previous month"
                className={cn(iconButtonStyles, "size-11 disabled:cursor-not-allowed disabled:opacity-35 sm:size-7")}
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
                onClick={() => moveMonth(1)}
                disabled={!monthHasAvailableDates(new Date(viewYear, viewMonth + 1, 1).getFullYear(), new Date(viewYear, viewMonth + 1, 1).getMonth())}
                aria-label="Next month"
                className={cn(iconButtonStyles, "size-11 disabled:cursor-not-allowed disabled:opacity-35 sm:size-7")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {DAYS.map((d) => (
                <div key={d} aria-hidden="true" className="py-1 text-center text-[10px] font-semibold text-muted-foreground">
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
                const isDisabled = isUnavailable(date)

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={!!isDisabled}
                    onClick={() => select(date)}
                    onFocus={() => setFocusDate(date)}
                    onKeyDown={(event) => handleDayKeyDown(event, date)}
                    data-date={dateKey(date)}
                    tabIndex={isSameDay(date, focusDate) ? 0 : -1}
                    aria-label={date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    aria-pressed={isSelected}
                    aria-current={isToday ? "date" : undefined}
                    className={cn(
                      "h-11 w-full rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35 sm:h-8",
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
            <div className={cn("mt-3 flex items-center border-t border-border pt-3", isUnavailable(today) ? "justify-end" : "justify-between")}>{!isUnavailable(today) && <button type="button" onClick={() => focusCalendarDate(today)} className="h-11 rounded-md px-3 text-xs font-medium text-accent-700 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35 sm:h-10 dark:text-accent-300">Today</button>}<button type="button" onClick={() => closeCalendar(true)} className="h-11 rounded-md px-3 text-xs font-medium text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35 sm:h-10">Cancel</button></div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
      {error && <p id={messageId} aria-live="polite" className={fieldErrorStyles}>{error}</p>}
      {hint && !error && <p id={messageId} className={fieldDescriptionStyles}>{hint}</p>}
    </div>
  )
})
DatePicker.displayName = "DatePicker"
