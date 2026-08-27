import * as React from "react"
import { Calendar, type CalendarEvent } from "@bzync/rui"
import { DatePicker } from "@bzync/rui"
import { Section } from "../../_shared/section"
import { Group } from "../../_shared/group"

export function DateFieldsSection({
  dateValue, setDateValue, calendarDate, setCalendarDate,
}: {
  dateValue: Date | null
  setDateValue: (d: Date | null) => void
  calendarDate: Date | null
  setCalendarDate: (d: Date | null) => void
}) {
  const today = new Date()
  const d = (offset: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset)
  const [events, setEvents] = React.useState<CalendarEvent[]>([
    { id: "1", title: "Deploy api-gateway",   date: d(0),  color: "blue",   time: "09:00" },
    { id: "2", title: "DB maintenance",        date: d(0),  color: "yellow", time: "02:00" },
    { id: "3", title: "Team sync",             date: d(1),  color: "green",  time: "10:30" },
    { id: "4", title: "Billing review",        date: d(2),  color: "purple", time: "14:00" },
    { id: "5", title: "Infra planning",        date: d(3),  color: "orange", time: "11:00" },
    { id: "6", title: "On-call handoff",       date: d(4),  color: "red",    time: "17:00" },
    { id: "7", title: "Release v2.5",          date: d(5),  color: "blue",   time: "12:00" },
    { id: "8", title: "Load test",             date: d(5),  color: "yellow", time: "15:00" },
    { id: "9", title: "Postmortem",            date: d(5),  color: "red",    time: "16:00" },
    { id: "10", title: "Sprint planning",      date: d(7),  color: "green",  time: "09:00" },
    { id: "11", title: "Security audit",       date: d(10), color: "purple", time: "13:00" },
    { id: "12", title: "Quarterly review",     date: d(14), color: "blue",   time: "10:00" },
  ])

  return (
    <>
      <Section
        id="datepicker"
        title="DatePicker"
        description="Calendar date picker with month navigation, today highlight, min/max date, and clearable value."
        importPath='import { DatePicker } from "@bzync/rui"'
        meta={["month navigation", "min/max date", "clearable"]}
      >
        <Group label="Examples" col>
          <div className="w-full max-w-xs space-y-4">
            <DatePicker label="Start date" value={dateValue} onChange={setDateValue} hint={dateValue ? `Selected: ${dateValue.toDateString()}` : "Pick a deployment window"} />
            <DatePicker label="Deadline" value={new Date(2026, 11, 31)} />
            <DatePicker label="With error" error="A start date is required" />
            <DatePicker label="Disabled" disabled />
          </div>
        </Group>
      </Section>
      <Section
        id="calendar"
        title="Calendar"
        description="Full calendar with month and week views, event chips, today highlight, and date selection. Hover a date for + to add, click an event to edit/delete."
        importPath='import { Calendar } from "@bzync/rui"'
        meta={["month view", "week view", "events", "controlled", "editable"]}
      >
        <Group label="Interactive — events are now manageable (add / edit / delete)" col>
          <Calendar
            value={calendarDate}
            onChange={setCalendarDate}
            events={events}
            onEventsChange={setEvents}
            onEventCreate={(ev) => setEvents((prev) => [...prev, ev])}
            onEventUpdate={(ev) => setEvents((prev) => prev.map((p) => (p.id === ev.id ? ev : p)))}
            onEventDelete={(id) => setEvents((prev) => prev.filter((p) => p.id !== id))}
            editable
            className="w-full"
          />
          {calendarDate && (
            <p className="text-xs text-slate-500">Selected: {calendarDate.toDateString()} · {events.length} events</p>
          )}
        </Group>
        <Group label="Controlled viewDate example" col>
          <p className="text-xs text-slate-500">Also supports <code>viewDate / onViewDateChange</code>, <code>defaultView / view</code>, <code>minDate / maxDate / disabledDates</code>, <code>defaultEvents / defaultValue</code>.</p>
        </Group>
      </Section>
    </>
  )
}
