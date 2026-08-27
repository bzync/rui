export const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
export const DAYS_MED   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
export const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]

export type CalendarView = "month" | "week"

export interface CalendarEvent {
  id: string
  title: string
  date: Date
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "orange"
  time?: string
}

export interface CalendarProps {
  value?: Date | null
  defaultValue?: Date | null
  onChange?: (date: Date | null) => void
  events?: CalendarEvent[]
  defaultEvents?: CalendarEvent[]
  onEventsChange?: (events: CalendarEvent[]) => void
  onEventClick?: (event: CalendarEvent) => void
  onEventCreate?: (event: CalendarEvent) => void
  onEventUpdate?: (event: CalendarEvent) => void
  onEventDelete?: (id: string) => void
  editable?: boolean
  view?: CalendarView
  defaultView?: CalendarView
  onViewChange?: (view: CalendarView) => void
  /** Controlled displayed month/week anchor. When provided, prev/next/Today are controlled via onViewDateChange. */
  viewDate?: Date | null
  defaultViewDate?: Date | null
  onViewDateChange?: (date: Date) => void
  /** Disable dates outside range or via predicate — passed to month/week cells. */
  minDate?: Date | null
  maxDate?: Date | null
  disabledDates?: (date: Date) => boolean
  className?: string
}

export const EVENT_CHIP: Record<string, string> = {
  blue:   "bg-blue-500/12 text-blue-400 border-blue-500/20",
  green:  "bg-emerald-500/12 text-emerald-400 border-emerald-500/20",
  red:    "bg-red-500/12 text-red-400 border-red-500/20",
  yellow: "bg-amber-500/12 text-amber-400 border-amber-500/20",
  purple: "bg-violet-500/12 text-violet-400 border-violet-500/20",
  orange: "bg-orange-500/12 text-orange-400 border-orange-500/20",
}

export function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

export function weekStart(d: Date): Date {
  const r = new Date(d)
  r.setDate(r.getDate() - r.getDay())
  return r
}

export const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 16 }),
  center: { opacity: 1, x: 0 },
  exit:  (dir: number) => ({ opacity: 0, x: dir * -16 }),
}
