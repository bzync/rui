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
import { AnimatePresence } from "framer-motion"
import { motion } from "@/lib/motion-components"
import { ThemePortal } from "./theme-provider"
import {
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
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

const twoDigits = (num: number) => String(num).padStart(2, "0")

function formatDateTime(d: Date, format: DateTimePickerFormat, showSeconds: boolean): string {
  const month = MONTHS[d.getMonth()].slice(0, 3)
  const day = d.getDate()
  const year = d.getFullYear()

  let hours = d.getHours()
  const minutes = twoDigits(d.getMinutes())
  const seconds = showSeconds ? `:${twoDigits(d.getSeconds())}` : ""

  if (format === "12") {
    const ampm = hours >= 12 ? "PM" : "AM"
    hours = hours % 12 || 12
    return `${month} ${day}, ${year} ${hours}:${minutes}${seconds} ${ampm}`
  }

  return `${month} ${day}, ${year} ${twoDigits(hours)}:${minutes}${seconds}`
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
  return `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())}`
}

interface TimeColumnProps {
  label: string
  name: string
  options: { label: string; value: number }[]
  value: number
  onSelect: (val: number) => void
}

function TimeColumn({ label, name, options, value, onSelect }: TimeColumnProps) {
  const listboxRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const selected = listboxRef.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')
    if (selected && listboxRef.current) {
      listboxRef.current.scrollTop = selected.offsetTop - listboxRef.current.clientHeight / 2 + selected.clientHeight / 2
    }
  }, [value])

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return
    event.preventDefault()
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? options.length - 1
          : (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length
    const next = options[nextIndex]
    if (!next) return
    onSelect(next.value)
    const buttons = listboxRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]')
    buttons?.[nextIndex]?.focus()
  }

  return (
    <div className="flex flex-col items-center">
      <span className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div
        ref={listboxRef}
        role="listbox"
        aria-label={label}
        data-time-column={name}
        className="max-h-44 w-12 overflow-y-auto overscroll-contain rounded-[var(--radius-md)] border border-border bg-surface-muted/30 p-1 scrollbar-thin"
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
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                "flex h-7 w-full items-center justify-center rounded-[var(--radius-xs)] text-xs tabular-nums transition-colors",
                focusRingStyles,
                selected
                  ? "bg-accent font-semibold text-accent-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-foreground/6 hover:text-foreground",
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
  const [mobileTab, setMobileTab] = useState<"date" | "time">("date")
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const uid = useId()
  const inputId = id ?? uid
  const dialogId = `${inputId}-dialog`
  const messageId = `${inputId}-message`

  const activeDate = selected ?? new Date()
  const [viewYear, setViewYear] = useState(activeDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(activeDate.getMonth())
  const [focusDay, setFocusDay] = useState(activeDate.getDate())

  // Time state
  const [tempHours, setTempHours] = useState(activeDate.getHours())
  const [tempMinutes, setTempMinutes] = useState(
    Math.min(55, Math.floor(activeDate.getMinutes() / minuteStep) * minuteStep),
  )
  const [tempSeconds, setTempSeconds] = useState(activeDate.getSeconds())

  const { setFloating, style, placement } = useAnchoredPosition({
    open,
    anchorRef: triggerRef,
    side: "bottom",
    align: "start",
    gap: 6,
    padding: 8,
  })

  // Sync temp time with selected date when opening
  useEffect(() => {
    if (open) {
      const d = selected ?? new Date()
      setViewYear(d.getFullYear())
      setViewMonth(d.getMonth())
      setFocusDay(d.getDate())
      setTempHours(d.getHours())
      setTempMinutes(Math.min(55, Math.floor(d.getMinutes() / minuteStep) * minuteStep))
      setTempSeconds(d.getSeconds())
      setMobileTab("date")
    }
  }, [minuteStep, open, selected])

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

  const isUnavailable = (date: Date) => {
    if (minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true
    if (maxDate && date > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 23, 59, 59)) return true
    return false
  }

  const handleSelectDay = (day: number) => {
    const next = new Date(viewYear, viewMonth, day, tempHours, tempMinutes, tempSeconds)
    if (isUnavailable(next)) return
    setSelected(next)
    setFocusDay(day)
  }

  const handleDayKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>, day: number) => {
    const date = new Date(viewYear, viewMonth, day)
    let next: Date | undefined
    if (e.key === "ArrowLeft") next = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1)
    else if (e.key === "ArrowRight") next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    else if (e.key === "ArrowUp") next = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7)
    else if (e.key === "ArrowDown") next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7)
    else if (e.key === "Home") next = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay())
    else if (e.key === "End") next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (6 - date.getDay()))
    else if (e.key === "PageUp") next = new Date(date.getFullYear(), date.getMonth() - 1, Math.min(date.getDate(), daysInMonth(date.getFullYear(), date.getMonth() - 1)))
    else if (e.key === "PageDown") next = new Date(date.getFullYear(), date.getMonth() + 1, Math.min(date.getDate(), daysInMonth(date.getFullYear(), date.getMonth() + 1)))

    if (!next) return
    e.preventDefault()
    if (isUnavailable(next)) return

    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
    setFocusDay(next.getDate())
    requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLButtonElement>(`[data-date="${dateKey(next!)}"]`)?.focus({ preventScroll: true })
    })
  }

  const handleApply = () => {
    const base = selected ?? new Date(viewYear, viewMonth, focusDay)
    const next = new Date(base.getFullYear(), base.getMonth(), base.getDate(), tempHours, tempMinutes, tempSeconds)
    setSelected(next)
    setOpen(false)
    triggerRef.current?.focus()
  }

  const handleNow = () => {
    const now = new Date()
    setSelected(now)
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

  // Options for time columns
  const is12Hour = format === "12"
  const isPM = tempHours >= 12
  const displayHour = is12Hour ? tempHours % 12 || 12 : tempHours

  const hourOptions = is12Hour
    ? Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: twoDigits(i + 1) }))
    : Array.from({ length: 24 }, (_, i) => ({ value: i, label: twoDigits(i) }))

  const stepCount = Math.floor(60 / minuteStep)
  const minuteOptions = Array.from({ length: stepCount }, (_, i) => {
    const val = i * minuteStep
    return { value: val, label: twoDigits(val) }
  })

  const secondOptions = Array.from({ length: 60 }, (_, i) => ({ value: i, label: twoDigits(i) }))

  const handleHourSelect = (val: number) => {
    if (is12Hour) {
      const newHour = (val % 12) + (isPM ? 12 : 0)
      setTempHours(newHour)
    } else {
      setTempHours(val)
    }
  }

  return (
    <div ref={ref} className={cn("relative", fieldRootStyles, className)} {...props}>
      {label && (
        <label htmlFor={inputId} id={`${inputId}-label`} className={cn(fieldLabelStyles, disabled && "opacity-50")}>
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
          aria-controls={dialogId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
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
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-muted-foreground"
              aria-hidden="true"
            >
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

        <ThemePortal>
          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  aria-hidden="true"
                  className="fixed inset-0 z-(--z-popover) bg-overlay/40 sm:hidden"
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
                <motion.div
                  ref={mergeRefs(panelRef, setFloating)}
                  id={dialogId}
                  role="dialog"
                  aria-label="Choose date and time"
                  initial={{
                    opacity: 0,
                    scale: 0.96,
                    y: placement === "top" ? 6 : -6,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                    y: placement === "top" ? 4 : -4,
                  }}
                  transition={{
                    duration: 0.16,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    ...style,
                    transformOrigin: placement === "top" ? "bottom left" : "top left",
                  }}
                  className="z-(--z-popover) flex flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-3.5 shadow-floating ring-1 ring-foreground/5 select-none"
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
                          className="rounded-[var(--radius-sm)] border border-border bg-surface px-2 py-0.5 text-xs font-medium text-foreground transition-colors hover:border-border-strong hover:bg-foreground/5"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Mobile Segmented Tab Switcher (Date vs Time) */}
                  <div className="flex sm:hidden rounded-[var(--radius-sm)] border border-border p-0.5 bg-surface-muted mb-3">
                    <button
                      type="button"
                      onClick={() => setMobileTab("date")}
                      className={cn(
                        "flex-1 py-1 text-xs font-semibold rounded-[var(--radius-xs)] transition-colors text-center",
                        mobileTab === "date"
                          ? "bg-accent text-accent-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Date
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileTab("time")}
                      className={cn(
                        "flex-1 py-1 text-xs font-semibold rounded-[var(--radius-xs)] transition-colors text-center",
                        mobileTab === "time"
                          ? "bg-accent text-accent-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Time
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Left: Calendar Month */}
                    <div className={cn("w-64", mobileTab !== "date" && "hidden sm:block")}>
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
                        <span aria-live="polite" className="text-xs font-semibold text-foreground">
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
                          const disabledDay = isUnavailable(dateObj)

                          return (
                            <button
                              key={day}
                              type="button"
                              data-date={dateKey(dateObj)}
                              disabled={disabledDay}
                              onClick={() => handleSelectDay(day)}
                              onKeyDown={(e) => handleDayKeyDown(e, day)}
                              aria-label={dateObj.toLocaleDateString(undefined, {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                              aria-selected={isSelected}
                              aria-current={isToday ? "date" : undefined}
                              tabIndex={isSelected || (!selected && day === focusDay) ? 0 : -1}
                              className={cn(
                                "flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] text-xs font-medium transition-colors",
                                focusRingStyles,
                                isSelected
                                  ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                                  : isToday
                                    ? "border border-accent text-accent font-semibold hover:bg-foreground/6"
                                    : "text-foreground hover:bg-foreground/6",
                                disabledDay && "opacity-25 cursor-not-allowed",
                              )}
                            >
                              {day}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Right: Time Selector */}
                    <div className={cn(
                      "flex flex-col border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-4 min-w-[130px]",
                      mobileTab !== "time" && "hidden sm:flex",
                    )}>
                      <div className="flex items-center justify-between pb-2">
                        <span className="text-xs font-semibold text-foreground">Time</span>
                        <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
                          {is12Hour ? `${displayHour}:${twoDigits(tempMinutes)} ${isPM ? "PM" : "AM"}` : `${twoDigits(tempHours)}:${twoDigits(tempMinutes)}`}
                        </span>
                      </div>

                      {/* AM / PM Segmented Switch for 12h */}
                      {is12Hour && (
                        <div role="radiogroup" aria-label="Period" className="flex rounded-[var(--radius-sm)] border border-border p-0.5 bg-surface-muted mb-2">
                          <button
                            type="button"
                            role="radio"
                            aria-checked={!isPM}
                            onClick={() => {
                              if (isPM) setTempHours((h) => h - 12)
                            }}
                            className={cn(
                              "flex-1 py-0.5 text-xs font-semibold rounded-[var(--radius-xs)] transition-colors text-center",
                              !isPM
                                ? "bg-accent text-accent-foreground shadow-xs"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            AM
                          </button>
                          <button
                            type="button"
                            role="radio"
                            aria-checked={isPM}
                            onClick={() => {
                              if (!isPM) setTempHours((h) => h + 12)
                            }}
                            className={cn(
                              "flex-1 py-0.5 text-xs font-semibold rounded-[var(--radius-xs)] transition-colors text-center",
                              isPM
                                ? "bg-accent text-accent-foreground shadow-xs"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            PM
                          </button>
                        </div>
                      )}

                      {/* Columns */}
                      <div className="flex items-start justify-center gap-1.5">
                        <TimeColumn
                          label="Hr"
                          name="hour"
                          options={hourOptions}
                          value={displayHour}
                          onSelect={handleHourSelect}
                        />
                        <TimeColumn
                          label="Min"
                          name="minute"
                          options={minuteOptions}
                          value={tempMinutes}
                          onSelect={setTempMinutes}
                        />
                        {showSeconds && (
                          <TimeColumn
                            label="Sec"
                            name="second"
                            options={secondOptions}
                            value={tempSeconds}
                            onSelect={setTempSeconds}
                          />
                        )}
                      </div>

                      <div className="mt-auto pt-3 flex gap-1.5">
                        <button
                          type="button"
                          onClick={handleNow}
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
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </ThemePortal>
      </div>

      {error ? (
        <p id={messageId} aria-live="polite" className={fieldErrorStyles}>{error}</p>
      ) : hint ? (
        <p id={messageId} className={fieldDescriptionStyles}>{hint}</p>
      ) : null}
    </div>
  )
})
DateTimePicker.displayName = "DateTimePicker"
