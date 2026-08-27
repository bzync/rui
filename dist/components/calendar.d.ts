import { CalendarProps } from './calendar/types';
export type { CalendarView, CalendarEvent, CalendarProps } from './calendar/types';
export declare function Calendar({ value: controlledValue, defaultValue, onChange, events: controlledEvents, defaultEvents, onEventsChange, onEventClick, onEventCreate, onEventUpdate, onEventDelete, editable, view: controlledView, defaultView, onViewChange, viewDate: controlledViewDate, defaultViewDate, onViewDateChange, minDate, maxDate, disabledDates, className, }: CalendarProps): import("react").JSX.Element;
