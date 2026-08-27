import { TextareaHTMLAttributes } from 'react';
type TextareaSize = "sm" | "md" | "lg";
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    hint?: string;
    error?: string;
    size?: TextareaSize;
    wrapperClassName?: string;
    labelClassName?: string;
    messageClassName?: string;
}
export declare const Textarea: import('react').ForwardRefExoticComponent<TextareaProps & import('react').RefAttributes<HTMLTextAreaElement>>;
export {};
