import { InputHTMLAttributes } from 'react';
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
    label?: string;
    description?: string;
    size?: "sm" | "md";
    onCheckedChange?: (checked: boolean) => void;
}
export declare const Switch: import('react').ForwardRefExoticComponent<SwitchProps & import('react').RefAttributes<HTMLInputElement>>;
