import { LabelHTMLAttributes } from 'react';
export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
    hint?: string;
}
export declare function Label({ className, children, required, hint, ...props }: LabelProps): import("react").JSX.Element;
