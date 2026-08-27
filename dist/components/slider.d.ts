import { InputHTMLAttributes } from 'react';
export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
    label?: string;
    hint?: string;
    error?: string;
    showValue?: boolean;
    formatValue?: (v: number) => string;
    min?: number;
    max?: number;
    step?: number;
}
export declare const Slider: import('react').ForwardRefExoticComponent<SliderProps & import('react').RefAttributes<HTMLInputElement>>;
