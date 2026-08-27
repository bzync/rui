export declare const DAYS_SHORT: string[];
export declare const DAYS_MED: string[];
export declare const MONTHS: string[];
export type CalendarView = "month" | "week";
export interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    color?: "blue" | "green" | "red" | "yellow" | "purple" | "orange";
    time?: string;
}
export interface CalendarProps {
    value?: Date | null;
    defaultValue?: Date | null;
    onChange?: (date: Date | null) => void;
    events?: CalendarEvent[];
    defaultEvents?: CalendarEvent[];
    onEventsChange?: (events: CalendarEvent[]) => void;
    onEventClick?: (event: CalendarEvent) => void;
    onEventCreate?: (event: CalendarEvent) => void;
    onEventUpdate?: (event: CalendarEvent) => void;
    onEventDelete?: (id: string) => void;
    editable?: boolean;
    view?: CalendarView;
    defaultView?: CalendarView;
    onViewChange?: (view: CalendarView) => void;
    /** Controlled displayed month/week anchor. When provided, prev/next/Today are controlled via onViewDateChange. */
    viewDate?: Date | null;
    defaultViewDate?: Date | null;
    onViewDateChange?: (date: Date) => void;
    /** Disable dates outside range or via predicate — passed to month/week cells. */
    minDate?: Date | null;
    maxDate?: Date | null;
    disabledDates?: (date: Date) => boolean;
    className?: string;
}
export declare const EVENT_CHIP: Record<string, string>;
export declare function sameDay(a: Date, b: Date): boolean;
export declare function addDays(d: Date, n: number): Date;
export declare function weekStart(d: Date): Date;
export declare const variants: {
    enter: (dir: number) => {
        opacity: number;
        x: number;
    };
    center: {
        opacity: number;
        x: number;
    };
    exit: (dir: number) => {
        opacity: number;
        x: number;
    };
};
