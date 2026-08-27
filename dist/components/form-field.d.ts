import { HTMLAttributes, ReactNode } from 'react';
export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
    label?: ReactNode;
    hint?: ReactNode;
    error?: string;
    required?: boolean;
    htmlFor?: string;
    children: ReactNode;
}
export declare function FormField({ label, hint, error, required, htmlFor, className, children, ...props }: FormFieldProps): import("react").JSX.Element;
