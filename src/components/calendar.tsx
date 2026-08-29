"use client"

import { cn } from "@/lib/cn"
import { focusRingStyles, iconButtonStyles } from "@/lib/component-styles"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { MonthView } from "./calendar/month-view"
import { WeekView } from "./calendar/week-view"
import { addDays, CalendarEvent, CalendarProps, CalendarView, MONTHS, variants, weekStart } from "./calendar/types"

export type { CalendarView, CalendarEvent, CalendarProps } from "./calendar/types"

function isSameDayNullable(a: Date | null, b: Date | null) {
  if (a === null || b === null) return a === b
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function Calendar({
  value: controlledValue,
  defaultValue = null,
  onChange,
  events: controlledEvents,
  defaultEvents = [],
  onEventsChange,
  onEventClick,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  editable = false,
  view: controlledView,
  defaultView = "month",
  onViewChange,
  viewDate: controlledViewDate,
  defaultViewDate,
  onViewDateChange,
  minDate,
  maxDate,
  disabledDates,
  className,
}: CalendarProps) {
  // today is client-only to avoid hydration mismatch
  const [today, setToday] = useState<Date | null>(null)

  // local state for uncontrolled modes
  const [localValue, setLocalValue] = useState<Date | null>(defaultValue)
  const [localView, setLocalView] = useState<CalendarView>(defaultView)
  const [internalViewDate, setInternalViewDate] = useState<Date | null>(defaultViewDate ?? null)
  const [localEvents, setLocalEvents] = useState<CalendarEvent[]>(() => controlledEvents ?? defaultEvents)
  const [dir, setDir] = useState(1)
  const [creatingDate, setCreatingDate] = useState<Date | null>(null)
  const [draftTitle, setDraftTitle] = useState("")
  const [draftColor, setDraftColor] = useState<CalendarEvent["color"]>("blue")
  const [draftTime, setDraftTime] = useState("09:00")
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    const t = new Date()
    setToday(t)
    if (defaultViewDate === undefined && controlledViewDate === undefined) {
      setInternalViewDate(new Date(t.getFullYear(), t.getMonth(), 1))
    }
  }, [])

  // sync defaultViewDate when it becomes available after mount (if provided as prop)
  useEffect(() => {
    if (controlledViewDate === undefined && defaultViewDate !== undefined && internalViewDate === null) {
      setInternalViewDate(defaultViewDate ? new Date(defaultViewDate) : null)
    }
  }, [defaultViewDate])

  // controlled vs uncontrolled
  const value = controlledValue !== undefined ? controlledValue : localValue
  const view = controlledView !== undefined ? controlledView : localView
  const viewDate = controlledViewDate !== undefined ? controlledViewDate : internalViewDate
  const isEventsControlled = controlledEvents !== undefined
  const events = isEventsControlled ? (controlledEvents as CalendarEvent[]) : localEvents

  function isDateDisabled(d: Date) {
    if (minDate && d < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true
    if (maxDate && d > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 23, 59, 59, 999)) return true
    if (disabledDates?.(d)) return true
    return false
  }

  function changeView(v: CalendarView) {
    if (controlledView === undefined) setLocalView(v)
    onViewChange?.(v)
  }

  function commitViewDate(next: Date | null) {
    if (next === null) return
    if (controlledViewDate === undefined) setInternalViewDate(next)
    onViewDateChange?.(next)
  }

  function select(date: Date) {
    if (isDateDisabled(date)) return
    if (controlledValue === undefined) setLocalValue(date)
    onChange?.(date)
  }

  function calcPrev(d: Date | null): Date | null {
    if (!d) return d
    if (view === "month") return new Date(d.getFullYear(), d.getMonth() - 1, 1)
    return addDays(d, -7)
  }

  function calcNext(d: Date | null): Date | null {
    if (!d) return d
    if (view === "month") return new Date(d.getFullYear(), d.getMonth() + 1, 1)
    return addDays(d, 7)
  }

  function prev() {
    setDir(-1)
    const next = calcPrev(viewDate)
    commitViewDate(next)
  }

  function next() {
    setDir(1)
    const next = calcNext(viewDate)
    commitViewDate(next)
  }

  function goToday() {
    const now = new Date()
    setDir(0)
    const anchor = new Date(now.getFullYear(), now.getMonth(), 1)
    commitViewDate(anchor)
    select(now)
  }

  function commitEvents(next: CalendarEvent[]) {
    if (!isEventsControlled) setLocalEvents(next)
    onEventsChange?.(next)
  }

  function handleCreate(date: Date, title?: string) {
    if (isDateDisabled(date)) return
    const ev: CalendarEvent = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? (crypto as any).randomUUID() : String(Date.now() + Math.random()),
      title: title?.trim() || draftTitle.trim() || "New event",
      date: new Date(date),
      color: draftColor,
      time: draftTime || undefined,
    }
    const next = [...events, ev]
    commitEvents(next)
    onEventCreate?.(ev)
    setCreatingDate(null)
    setDraftTitle("")
    setDraftTime("09:00")
  }

  function handleDelete(id: string) {
    const next = events.filter((e) => e.id !== id)
    commitEvents(next)
    onEventDelete?.(id)
    if (editingId === id) setEditingId(null)
  }

  function handleUpdate(patch: CalendarEvent) {
    const next = events.map((e) => (e.id === patch.id ? patch : e))
    commitEvents(next)
    onEventUpdate?.(patch)
    setEditingId(null)
  }

  function handleEventClick(ev: CalendarEvent) {
    if (editable) setEditingId((cur) => (cur === ev.id ? null : ev.id))
    onEventClick?.(ev)
  }

  // Header label
  let headerLabel = ""
  if (viewDate) {
    if (view === "month") {
      headerLabel = `${MONTHS[viewDate.getMonth()]} ${viewDate.getFullYear()}`
    } else {
      const ws = weekStart(viewDate)
      const we = addDays(ws, 6)
      if (ws.getMonth() === we.getMonth()) {
        headerLabel = `${MONTHS[ws.getMonth()].slice(0, 3)} ${ws.getDate()} \u2013 ${we.getDate()}, ${ws.getFullYear()}`
      } else {
        headerLabel = `${MONTHS[ws.getMonth()].slice(0, 3)} ${ws.getDate()} \u2013 ${MONTHS[we.getMonth()].slice(0, 3)} ${we.getDate()}, ${ws.getFullYear()}`
      }
    }
  }

  const isEditable = editable || !!onEventCreate || !!onEventUpdate || !!onEventDelete || !!onEventsChange
  const sharedProps = {
    today,
    value,
    events,
    onSelect: select,
    onEventClick: handleEventClick,
    onEventCreate: isEditable ? (d: Date) => setCreatingDate(d) : undefined,
    onEventDelete: isEditable || !!onEventDelete ? handleDelete : undefined,
    onEventUpdate,
    editingId,
    onEditToggle: (id: string) => setEditingId((cur) => (cur === id ? null : id)),
    onUpdateTitle: (id: string, title: string) => {
      const ev = events.find((e) => e.id === id)
      if (ev) handleUpdate({ ...ev, title })
    },
    minDate,
    maxDate,
    disabledDates,
    isDateDisabled,
  }

  const viewKey = viewDate ? `${view}-${viewDate.toISOString()}` : null

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface", className)}>
      {/* Toolbar */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border px-3 py-3 sm:px-4">
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={prev}
            aria-label={`Previous ${view}`}
            className={cn(iconButtonStyles, "size-8")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={`Next ${view}`}
            className={cn(iconButtonStyles, "size-8")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>

        <span aria-live="polite" className="min-w-[9rem] flex-1 select-none text-sm font-semibold text-foreground">{headerLabel}</span>

        <button
          type="button"
          onClick={goToday}
          className={cn("h-8 rounded-[var(--radius-md)] border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-border-strong hover:bg-muted hover:text-foreground", focusRingStyles)}
        >
          Today
        </button>

        <div role="group" aria-label="Calendar view" className="flex overflow-hidden rounded-[var(--radius-md)] border border-border">
          {(["month", "week"] as const).map((v) => (
            <button
              type="button"
              key={v}
              onClick={() => changeView(v)}
              aria-pressed={view === v}
              className={cn(
                "h-8 px-3 text-xs capitalize transition-colors focus-visible:z-10",
                focusRingStyles,
                view === v ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {creatingDate && (
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-warning/8 px-3 py-3 sm:px-4">
          <span className="text-xs font-medium text-foreground">New event on {creatingDate.toLocaleDateString()}:</span>
          <input autoFocus value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleCreate(creatingDate); if (e.key === "Escape") { setCreatingDate(null); setDraftTitle(""); setDraftTime("09:00") } }} placeholder="Event title" className="h-7 flex-1 min-w-[140px] rounded-md border border-border bg-surface px-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-[3px] focus:ring-focus-ring/25" />
          <input type="time" value={draftTime} onChange={(e) => setDraftTime(e.target.value)} className="h-7 w-[110px] rounded-md border border-border bg-surface px-2 text-xs text-foreground focus:outline-none focus:ring-[3px] focus:ring-focus-ring/25" />
          <select aria-label="Event color" value={draftColor} onChange={(e) => setDraftColor(e.target.value as CalendarEvent["color"])} className="h-7 rounded-[var(--radius-md)] border border-border bg-surface px-2 text-xs text-foreground">
            <option value="blue">Blue</option><option value="green">Green</option><option value="red">Red</option><option value="yellow">Yellow</option><option value="purple">Purple</option><option value="orange">Orange</option>
          </select>
          <button type="button" onClick={() => handleCreate(creatingDate)} className="h-7 px-3 rounded-md bg-primary text-xs font-medium text-primary-foreground hover:bg-primary-hover">Add</button>
          <button type="button" onClick={() => { setCreatingDate(null); setDraftTitle(""); setDraftTime("09:00") }} className="h-7 rounded-[var(--radius-md)] border border-border bg-surface px-2.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">Cancel</button>
        </div>
      )}
      {editingId && (() => {
        const ev = events.find((e) => e.id === editingId)
        if (!ev) return null
        return (
          <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface-muted px-3 py-3 sm:px-4">
            <span className="text-xs font-medium text-foreground">Edit event:</span>
            <input autoFocus defaultValue={ev.title} onKeyDown={(e) => { if (e.key === "Enter") { const v = (e.target as HTMLInputElement).value; const tv = (document.getElementById(`cal-edit-time-${ev.id}`) as HTMLInputElement | null)?.value ?? ev.time ?? ""; if (v.trim()) handleUpdate({ ...ev, title: v.trim(), time: tv || undefined }) } if (e.key === "Escape") setEditingId(null) }} id={`cal-edit-${ev.id}`} placeholder="Title" className="h-7 flex-1 min-w-[140px] rounded-md border border-border bg-surface px-2 text-xs text-foreground focus:outline-none focus:ring-[3px] focus:ring-focus-ring/25" />
            <input type="time" defaultValue={ev.time ?? ""} id={`cal-edit-time-${ev.id}`} className="h-7 w-[110px] rounded-md border border-border bg-surface px-2 text-xs text-foreground focus:outline-none focus:ring-[3px] focus:ring-focus-ring/25" />
            <button type="button" onClick={() => { const inp = document.getElementById(`cal-edit-${ev.id}`) as HTMLInputElement | null; const tinp = document.getElementById(`cal-edit-time-${ev.id}`) as HTMLInputElement | null; const v = inp?.value ?? ev.title; const tv = tinp?.value ?? ""; if (v.trim()) handleUpdate({ ...ev, title: v.trim(), time: tv || undefined }) }} className="h-7 px-3 rounded-md bg-primary text-xs font-medium text-primary-foreground hover:bg-primary-hover">Save</button>
            <button type="button" onClick={() => handleDelete(ev.id)} className="h-7 rounded-[var(--radius-md)] bg-destructive px-2.5 text-xs font-medium text-destructive-foreground hover:bg-destructive-hover">Delete</button>
            <button type="button" onClick={() => setEditingId(null)} className="h-7 rounded-[var(--radius-md)] border border-border bg-surface px-2.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">Cancel</button>
          </div>
        )
      })()}
      {/* Body */}
      <div className="relative flex-1 overflow-x-auto">
        <div className="min-w-[42rem]">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          {viewKey !== null && viewDate !== null && (
            <motion.div key={viewKey} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.18, ease: "easeInOut" }}>
              {view === "month" ? <MonthView viewDate={viewDate} {...sharedProps} /> : <WeekView viewDate={viewDate} {...sharedProps} />}
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
