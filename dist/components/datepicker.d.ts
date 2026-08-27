export interface DatePickerProps {
    value?: Date | null;
    onChange?: (date: Date | null) => void;
    label?: string;
    hint?: string;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
    clearable?: boolean;
    minDate?: Date;
    maxDate?: Date;
    className?: string;
}
export declare function DatePicker({ value: controlledValue, onChange, label, hint, error, placeholder, disabled, clearable, minDate, maxDate, className, }: DatePickerProps): import("react").JSX.Element;
