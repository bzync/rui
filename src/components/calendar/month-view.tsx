import { cn } from "@/lib/cn"
import { CalendarEvent, DAYS_SHORT, EVENT_CHIP, sameDay } from "./types"

interface MonthViewProps {
  viewDate: Date
  today: Date | null
  value: Date | null
  events: CalendarEvent[]
  onSelect: (d: Date) => void
  onEventClick?: (ev: CalendarEvent) => void
  isDateDisabled?: (d: Date) => boolean
  onEventCreate?: (d: Date) => void
  onEventDelete?: (id: string) => void
  editingId?: string | null
  onEditToggle?: (id: string) => void
  onUpdateTitle?: (id: string, title: string) => void
}

export function MonthView({ viewDate, today, value, events, onSelect, onEventClick, isDateDisabled, onEventCreate, onEventDelete, editingId, onEditToggle, onUpdateTitle }: MonthViewProps) {
  const year  = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const count = new Date(year, month + 1, 0).getDate()
  const start = new Date(year, month, 1).getDay()

  const cells: (Date | null)[] = [
    ...Array(start).fill(null),
    ...Array.from({ length: count }, (_, i) => new Date(year, month, i + 1)),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function eventsFor(d: Date) {
    return events.filter((e) => sameDay(e.date, d))
  }

  return (
    <>
      <div role="row" className="grid grid-cols-7 border-b border-border">
        {DAYS_SHORT.map((d) => (
          <div key={d} role="columnheader" className="py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {d}
          </div>
        ))}
      </div>
      <div role="grid" className="grid grid-cols-7" style={{ gridTemplateRows: `repeat(${cells.length / 7}, minmax(80px, 1fr))` }}>
        {cells.map((date, i) => {
          const isLastInRow = i % 7 === 6
          const isLastRow   = i >= cells.length - 7
          if (!date) return (
            <div
              key={`e${i}`}
              role="gridcell"
              className={cn(
                "border-black/6 dark:border-white/6 bg-black/[0.015] dark:bg-white/[0.015]",
                !isLastInRow && "border-r",
                !isLastRow   && "border-b",
              )}
            />
          )
          const dayEvts    = eventsFor(date)
          const isToday    = today ? sameDay(date, today) : false
          const isSel      = value ? sameDay(date, value) : false
          const isCurMonth = date.getMonth() === month
          const isDisabled = isDateDisabled?.(date) ?? false

          return (
            <div
              key={date.toISOString()}
              role="gridcell"
              tabIndex={isDisabled ? undefined : 0}
              aria-label={date.toLocaleDateString(undefined, { dateStyle: "full" })}
              aria-disabled={isDisabled || undefined}
              aria-selected={isSel}
              onClick={() => !isDisabled && onSelect(date)}
              onKeyDown={(event) => {
                if (!isDisabled && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault()
                  onSelect(date)
                }
              }}
              className={cn(
                "p-1.5 transition-colors group/cell",
                "border-border focus-visible:z-10 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-focus-ring/35",
                !isLastInRow && "border-r",
                !isLastRow   && "border-b",
                !isCurMonth  && "bg-black/[0.015] dark:bg-white/[0.015]",
                isDisabled ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-surface-muted",
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                  isSel
                    ? "bg-primary text-primary-foreground"
                    : isToday
                    ? "border border-accent-500/50 text-accent-600 dark:text-accent-300"
                    : isCurMonth
                    ? "text-slate-700 dark:text-slate-200"
                    : "text-slate-400 dark:text-slate-600",
                )}>
                  {date.getDate()}
                </span>
                {onEventCreate && !isDisabled && (
                  <button type="button" aria-label={`Add event on ${date.toLocaleDateString()}`} onClick={(e) => { e.stopPropagation(); onEventCreate(date) }} className="opacity-0 group-hover/cell:opacity-100 focus:opacity-100 w-5 h-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-[10px] hover:bg-primary-hover transition-opacity">+</button>
                )}
              </div>
              <div className="space-y-0.5">
                {dayEvts.slice(0, 2).map((ev) => {
                  const isEditing = editingId === ev.id
                  return (
                    <div key={ev.id} className={cn("group/ev flex items-center gap-0.5 rounded border px-1 py-0.5", EVENT_CHIP[ev.color ?? "blue"], isEditing && "ring-1 ring-focus-ring")}>
                      <button type="button" onClick={(e) => { e.stopPropagation(); onEventClick?.(ev) }} className="min-w-0 flex-1 truncate text-left text-[10px] font-medium">
                        {ev.time && <span className="opacity-60 mr-1">{ev.time}</span>}{ev.title}
                      </button>
                      {onEventDelete && (
                        <button type="button" aria-label={`Delete ${ev.title}`} onClick={(e) => { e.stopPropagation(); onEventDelete(ev.id) }} className="flex size-4 shrink-0 items-center justify-center rounded text-[10px] leading-none opacity-60 hover:bg-muted hover:opacity-100">×</button>
                      )}
                    </div>
                  )
                })}
                {dayEvts.length > 2 && (
                  <p className="text-[10px] text-slate-500 px-1">+{dayEvts.length - 2} more</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
