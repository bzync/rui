import { CalendarEvent } from './types';
interface MonthViewProps {
    viewDate: Date;
    today: Date | null;
    value: Date | null;
    events: CalendarEvent[];
    onSelect: (d: Date) => void;
    onEventClick?: (ev: CalendarEvent) => void;
    isDateDisabled?: (d: Date) => boolean;
    onEventCreate?: (d: Date) => void;
    onEventDelete?: (id: string) => void;
    editingId?: string | null;
    onEditToggle?: (id: string) => void;
    onUpdateTitle?: (id: string, title: string) => void;
}
export declare function MonthView({ viewDate, today, value, events, onSelect, onEventClick, isDateDisabled, onEventCreate, onEventDelete, editingId, onEditToggle, onUpdateTitle }: MonthViewProps): import("react").JSX.Element;
export {};
