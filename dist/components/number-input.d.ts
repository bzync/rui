import { InputHTMLAttributes } from 'react';
export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "onChange"> {
    label?: string;
    hint?: string;
    error?: string;
    size?: "sm" | "md" | "lg";
    min?: number;
    max?: number;
    step?: number;
    value?: number;
    defaultValue?: number;
    onChange?: (value: number) => void;
    formatDisplay?: (v: number) => string;
    fullWidth?: boolean;
}
export declare const NumberInput: import('react').ForwardRefExoticComponent<NumberInputProps & import('react').RefAttributes<HTMLInputElement>>;
