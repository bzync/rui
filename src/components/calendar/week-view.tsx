import { cn } from "@/lib/cn"
import { addDays, CalendarEvent, DAYS_MED, EVENT_CHIP, sameDay, weekStart } from "./types"

interface WeekViewProps {
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

export function WeekView({ viewDate, today, value, events, onSelect, onEventClick, isDateDisabled, onEventCreate, onEventDelete, editingId, onEditToggle, onUpdateTitle }: WeekViewProps) {
  const ws   = weekStart(viewDate)
  const days = Array.from({ length: 7 }, (_, i) => addDays(ws, i))

  function eventsFor(d: Date) {
    return events.filter((e) => sameDay(e.date, d))
  }

  return (
    <>
      <div role="row" className="grid grid-cols-7 border-b border-border">
        {days.map((date) => {
          const isToday = today ? sameDay(date, today) : false
          const isSel   = value ? sameDay(date, value) : false
          const isDisabled = isDateDisabled?.(date) ?? false
          return (
            <div
              key={date.toISOString()}
              role="gridcell"
              tabIndex={isDisabled ? undefined : 0}
              aria-selected={isSel}
              aria-disabled={isDisabled || undefined}
              aria-label={date.toLocaleDateString(undefined, { dateStyle: "full" })}
              onClick={() => !isDisabled && onSelect(date)}
              onKeyDown={(event) => { if (!isDisabled && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onSelect(date) } }}
              className={cn("group/whead flex flex-col items-center gap-1 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring/35", isDisabled ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-surface-muted")}
            >
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                {DAYS_MED[date.getDay()]}
              </span>
              <span className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                isSel
                  ? "bg-primary text-primary-foreground"
                  : isToday
                  ? "border border-accent-500/50 text-accent-600 dark:text-accent-300"
                  : "text-slate-700 dark:text-slate-200",
              )}>
                {date.getDate()}
              </span>
              {onEventCreate && !isDisabled && (
                <button type="button" aria-label={`Add event on ${date.toLocaleDateString()}`} onClick={(e) => { e.stopPropagation(); onEventCreate(date) }} className="opacity-0 group-hover/whead:opacity-100 focus:opacity-100 h-5 px-1.5 rounded-md bg-primary text-primary-foreground text-[10px] hover:bg-primary-hover">+ Add</button>
              )}
            </div>
          )
        })}
      </div>
      <div className="grid grid-cols-7 min-h-[200px]">
        {days.map((date, i) => {
          const dayEvts   = eventsFor(date)
          const isLastCol = i === 6
          const isDisabled = isDateDisabled?.(date) ?? false
          return (
            <div
              key={date.toISOString()}
              role="gridcell"
              tabIndex={isDisabled ? undefined : 0}
              aria-disabled={isDisabled || undefined}
              aria-label={`${date.toLocaleDateString(undefined, { dateStyle: "full" })} events`}
              onClick={() => !isDisabled && onSelect(date)}
              onKeyDown={(event) => { if (!isDisabled && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onSelect(date) } }}
              className={cn(
                "space-y-1.5 p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring/35",
                !isLastCol && "border-r border-border",
                isDisabled ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-surface-muted/70",
              )}
            >
              {dayEvts.map((ev) => (
                <div key={ev.id} className={cn("group/wev flex items-start gap-1 rounded-[var(--radius-md)] border px-2 py-1.5", EVENT_CHIP[ev.color ?? "blue"], editingId === ev.id && "ring-1 ring-focus-ring")}>
                  <button type="button" onClick={(e) => { e.stopPropagation(); onEventClick?.(ev) }} className="min-w-0 flex-1 text-left">
                    {ev.time && <div className="text-[10px] opacity-60 mb-0.5">{ev.time}</div>}<div className="text-xs font-medium truncate">{ev.title}</div>
                  </button>
                  {onEventDelete && (
                    <button type="button" aria-label={`Delete ${ev.title}`} onClick={(e) => { e.stopPropagation(); onEventDelete(ev.id) }} className="flex size-5 shrink-0 items-center justify-center rounded text-xs opacity-60 hover:bg-muted hover:opacity-100">×</button>
                  )}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </>
  )
}
