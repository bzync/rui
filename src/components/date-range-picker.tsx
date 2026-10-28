"use client"

import { cn } from "@/lib/cn"
import { controlBaseStyles, controlInvalidStyles, controlSizeStyles, fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles, focusRingStyles, iconButtonStyles, type ControlSize } from "@/lib/component-styles"
import { useAnchoredPosition } from "@/hooks/use-anchored-position"
import { useControllableState } from "@/hooks/use-controllable-state"
import { useMediaQuery } from "@/hooks/use-media-query"
import { type HTMLAttributes, type KeyboardEvent as ReactKeyboardEvent, forwardRef, useEffect, useId, useRef, useState } from "react"
import { mergeRefs } from "@/lib/merge-refs"
import { ThemePortal } from "./theme-provider"

export interface DateRange {
  from: Date | null
  to: Date | null
}

export interface DateRangePreset {
  label: string
  /** Receives "today" (midnight) and returns the range. */
  range: (today: Date) => DateRange
}

export interface DateRangePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Controlled range. */
  value?: DateRange
  /** Initial range when uncontrolled. */
  defaultValue?: DateRange
  onChange?: (range: DateRange) => void
  onValueChange?: (range: DateRange) => void
  name?: string
  required?: boolean
  label?: string
  hint?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  minDate?: Date
  maxDate?: Date
  /** Quick ranges shown beside the calendar. `false` hides the rail. */
  presets?: DateRangePreset[] | false
  /** Months shown side by side on wider screens. Default 2. */
  numberOfMonths?: 1 | 2
  size?: ControlSize
  /** Formats the trigger text. */
  formatRange?: (range: DateRange) => string
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
const addMonths = (date: Date, months: number) => new Date(date.getFullYear(), date.getMonth() + months, 1)
const sameDay = (a: Date | null, b: Date | null) => Boolean(a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate())
const dayKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

/** Sensible defaults: today, the last 7 / 30 days, this month and last month. */
export const defaultDateRangePresets: DateRangePreset[] = [
  { label: "Today", range: (today) => ({ from: today, to: today }) },
  { label: "Last 7 days", range: (today) => ({ from: addDays(today, -6), to: today }) },
  { label: "Last 30 days", range: (today) => ({ from: addDays(today, -29), to: today }) },
  { label: "This month", range: (today) => ({ from: new Date(today.getFullYear(), today.getMonth(), 1), to: today }) },
  { label: "Last month", range: (today) => ({ from: new Date(today.getFullYear(), today.getMonth() - 1, 1), to: new Date(today.getFullYear(), today.getMonth(), 0) }) },
]

const shortDate = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" })
const fullDate = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" })
const monthTitle = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" })

function defaultFormat({ from, to }: DateRange) {
  if (!from) return ""
  if (!to || sameDay(from, to)) return fullDate.format(from)
  return from.getFullYear() === to.getFullYear() ? `${shortDate.format(from)} – ${fullDate.format(to)}` : `${fullDate.format(from)} – ${fullDate.format(to)}`
}

const EMPTY: DateRange = { from: null, to: null }

export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(function DateRangePicker({
  value,
  defaultValue = EMPTY,
  onChange,
  onValueChange,
  name,
  required,
  label,
  hint,
  error,
  placeholder = "Select dates…",
  disabled,
  clearable = true,
  minDate,
  maxDate,
  presets = defaultDateRangePresets,
  numberOfMonths = 2,
  size = "md",
  formatRange = defaultFormat,
  className,
  ...props
}, ref) {
  const [range, setRange] = useControllableState({
    value,
    defaultValue,
    onChange: (next) => {
      onChange?.(next)
      onValueChange?.(next)
    },
  })
  const [open, setOpen] = useState(false)
  // In-progress selection: the anchor (first click) and the hovered end.
  const [anchor, setAnchor] = useState<Date | null>(null)
  const [hovered, setHovered] = useState<Date | null>(null)
  const today = startOfDay(new Date())
  const [viewMonth, setViewMonth] = useState(() => addMonths(range.from ?? today, 0))
  const [focusDate, setFocusDate] = useState<Date>(range.from ?? today)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const id = useId()
  const triggerId = `${id}-trigger`
  const messageId = `${id}-message`
  const isPhone = useMediaQuery("(max-width: 639px)")
  const months = isPhone ? 1 : numberOfMonths
  const { setFloating, style } = useAnchoredPosition({ open: open && !isPhone, anchorRef: triggerRef, side: "bottom", align: "start", gap: 6 })

  const unavailable = (date: Date) => Boolean((minDate && date < startOfDay(minDate)) || (maxDate && date > startOfDay(maxDate)))

  const focusDay = (date: Date) => {
    if (unavailable(date)) return
    setFocusDate(date)
    const first = viewMonth
    const last = addMonths(viewMonth, months - 1)
    const focus = () => panelRef.current?.querySelector<HTMLButtonElement>(`[data-date="${dayKey(date)}"]`)?.focus({ preventScroll: true })
    if (date < first) setViewMonth(addMonths(date, 0))
    else if (date >= addMonths(last, 1)) setViewMonth(addMonths(date, -(months - 1)))
    else { focus(); return }
    // The month changes first; focus once the new grid has rendered.
    requestAnimationFrame(focus)
  }

  function openPanel() {
    if (disabled) return
    const start = range.from ?? today
    setViewMonth(addMonths(start, 0))
    setFocusDate(start)
    setAnchor(null)
    setHovered(null)
    setOpen(true)
    requestAnimationFrame(() => requestAnimationFrame(() => panelRef.current?.querySelector<HTMLButtonElement>(`[data-date="${dayKey(start)}"]`)?.focus({ preventScroll: true })))
  }

  function close(restoreFocus = false) {
    setOpen(false)
    setAnchor(null)
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus())
  }

  function pick(date: Date) {
    if (unavailable(date)) return
    if (!anchor) {
      setAnchor(date)
      setHovered(date)
      return
    }
    const [from, to] = date < anchor ? [date, anchor] : [anchor, date]
    setRange({ from, to })
    close(true)
  }

  function applyPreset(preset: DateRangePreset) {
    const next = preset.range(today)
    setRange(next)
    close(true)
  }

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return
      close()
    }
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); close(true) } }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  function onDayKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, date: Date) {
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(date, -1),
      ArrowRight: () => addDays(date, 1),
      ArrowUp: () => addDays(date, -7),
      ArrowDown: () => addDays(date, 7),
      Home: () => addDays(date, -date.getDay()),
      End: () => addDays(date, 6 - date.getDay()),
      PageUp: () => new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()),
      PageDown: () => new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()),
    }
    const move = moves[event.key]
    if (!move) return
    event.preventDefault()
    const next = move()
    focusDay(next)
    if (anchor) setHovered(next)
  }

  // Range shown in the grid: committed, or the live preview while picking.
  const previewFrom = anchor && hovered ? (hovered < anchor ? hovered : anchor) : range.from
  const previewTo = anchor && hovered ? (hovered < anchor ? anchor : hovered) : range.to
  const inRange = (date: Date) => Boolean(previewFrom && previewTo && date >= previewFrom && date <= previewTo)

  const display = formatRange(range)
  const sizeStyles = controlSizeStyles[size]

  function renderMonth(month: Date) {
    const first = new Date(month.getFullYear(), month.getMonth(), 1)
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    const cells: (Date | null)[] = [...Array(first.getDay()).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))]
    return (
      <div key={dayKey(month)} className="w-full min-w-0 sm:w-64">
        <p className="mb-2 text-center text-sm font-semibold text-foreground" aria-live="polite">{monthTitle.format(month)}</p>
        <div role="grid" aria-label={monthTitle.format(month)} className="grid grid-cols-7 gap-y-0.5">
          {DAYS.map((day) => <span key={day} role="columnheader" aria-label={day} className="py-1 text-center text-[11px] font-semibold text-muted-foreground">{day}</span>)}
          {cells.map((date, index) => {
            if (!date) return <span key={`empty-${index}`} role="gridcell" />
            const isStart = sameDay(date, previewFrom)
            const isEnd = sameDay(date, previewTo)
            const within = inRange(date)
            const isDisabled = unavailable(date)
            return (
              <span key={dayKey(date)} role="gridcell" className={cn("relative", within && !isStart && !isEnd && "bg-accent-500/10", within && isStart && !isEnd && "rounded-l-md bg-accent-500/10", within && isEnd && !isStart && "rounded-r-md bg-accent-500/10")}>
                <button
                  type="button"
                  data-date={dayKey(date)}
                  tabIndex={sameDay(date, focusDate) ? 0 : -1}
                  disabled={isDisabled}
                  aria-pressed={isStart || isEnd}
                  aria-label={date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }) + (isStart ? ", range start" : isEnd ? ", range end" : within ? ", in range" : "")}
                  aria-current={sameDay(date, today) ? "date" : undefined}
                  onClick={() => pick(date)}
                  onMouseEnter={() => anchor && setHovered(date)}
                  onFocus={() => setFocusDate(date)}
                  onKeyDown={(event) => onDayKeyDown(event, date)}
                  className={cn(
                    "relative z-[1] h-10 w-full rounded-md text-sm tabular-nums transition-colors sm:h-8",
                    focusRingStyles,
                    isStart || isEnd ? "bg-primary font-semibold text-primary-foreground" : "text-foreground hover:bg-foreground/8",
                    sameDay(date, today) && !(isStart || isEnd) && "font-semibold text-accent-strong",
                    isDisabled && "cursor-not-allowed opacity-30 hover:bg-transparent",
                  )}
                >
                  {date.getDate()}
                </button>
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  const panel = (
    <div
      ref={(node: HTMLDivElement | null) => { panelRef.current = node; setFloating(node) }}
      role="dialog"
      aria-label={label ? `Choose ${label.toLowerCase()}` : "Choose date range"}
      style={isPhone ? undefined : style}
      className={cn(
        "z-(--z-popover) flex max-h-[calc(100dvh-1rem)] overflow-y-auto rounded-[var(--radius-lg)] border border-border bg-surface-raised shadow-floating",
        isPhone ? "fixed inset-x-2 bottom-2 flex-col" : "flex-row",
      )}
    >
      {presets && presets.length > 0 && (
        <div role="group" aria-label="Presets" className={cn("flex shrink-0 gap-1 p-2", isPhone ? "overflow-x-auto border-b border-border" : "w-36 flex-col border-r border-border")}>
          {presets.map((preset) => (
            <button key={preset.label} type="button" onClick={() => applyPreset(preset)} className={cn("whitespace-nowrap rounded-md px-2.5 py-1.5 text-left text-xs font-medium text-muted-foreground hover:bg-foreground/6 hover:text-foreground", focusRingStyles)}>
              {preset.label}
            </button>
          ))}
        </div>
      )}
      <div className="p-3">
        <div className="mb-1 flex items-center justify-between">
          <button type="button" aria-label="Previous month" onClick={() => setViewMonth(addMonths(viewMonth, -1))} className={cn(iconButtonStyles, "size-8")}>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <span className="text-xs text-muted-foreground" role="status">{anchor ? "Select an end date" : "Select a start date"}</span>
          <button type="button" aria-label="Next month" onClick={() => setViewMonth(addMonths(viewMonth, 1))} className={cn(iconButtonStyles, "size-8")}>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
        <div className="flex gap-6" onMouseLeave={() => anchor && setHovered(anchor)}>
          {Array.from({ length: months }, (_, i) => renderMonth(addMonths(viewMonth, i)))}
        </div>
      </div>
    </div>
  )

  return (
    <div ref={mergeRefs(rootRef, ref)} className={cn("relative", fieldRootStyles, className)} {...props}>
      {label && <label htmlFor={triggerId} className={fieldLabelStyles}>{label}</label>}
      {name && !disabled && (
        <input
          type="hidden"
          name={name}
          value={range.from || range.to ? `${range.from ? dayKey(range.from) : ""}/${range.to ? dayKey(range.to) : ""}` : ""}
          required={required}
        />
      )}
      <div className={cn("flex w-full items-center rounded-[var(--radius-md)]", sizeStyles.height, controlBaseStyles, error && controlInvalidStyles, disabled && "cursor-not-allowed opacity-50")}>
        <button
          ref={triggerRef}
          type="button"
          id={triggerId}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          onClick={() => (open ? close() : openPanel())}
          className={cn("flex h-full min-w-0 flex-1 items-center gap-2 rounded-[var(--radius-md)] text-left outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring/35", sizeStyles.padding)}
        >
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-foreground"><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
          <span className={cn("flex-1 truncate", sizeStyles.text, display ? "text-foreground" : "text-muted-foreground")}>{display || placeholder}</span>
        </button>
        {clearable && range.from && !disabled && (
          <button type="button" aria-label={`Clear ${label?.toLowerCase() ?? "dates"}`} onClick={() => setRange(EMPTY)} className={cn(iconButtonStyles, "mr-1 size-6")}>
            <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        )}
      </div>
      {open && (
        <ThemePortal>
          {isPhone && <div aria-hidden="true" className="fixed inset-0 z-(--z-popover) bg-overlay" onMouseDown={() => close(true)} />}
          {panel}
        </ThemePortal>
      )}
      {error && <p id={messageId} aria-live="polite" className={fieldErrorStyles}>{error}</p>}
      {hint && !error && <p id={messageId} className={fieldDescriptionStyles}>{hint}</p>}
    </div>
  )
})
DateRangePicker.displayName = "DateRangePicker"
