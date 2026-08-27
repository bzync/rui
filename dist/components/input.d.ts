import { InputHTMLAttributes, ReactNode, CSSProperties } from 'react';
type InputSize = "sm" | "md" | "lg";
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix" | "suffix" | "size"> {
    label?: string;
    hint?: string;
    error?: string;
    prefix?: ReactNode;
    suffix?: ReactNode;
    size?: InputSize;
    /** Slot customization — end-to-end */
    wrapperClassName?: string;
    wrapperStyle?: CSSProperties;
    inputClassName?: string;
    labelClassName?: string;
    hintClassName?: string;
    unstyled?: boolean;
}
export declare const Input: import('react').ForwardRefExoticComponent<InputProps & import('react').RefAttributes<HTMLInputElement>>;
export {};
