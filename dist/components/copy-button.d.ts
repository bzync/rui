import { ButtonHTMLAttributes } from 'react';
export interface CopyButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    value: string;
    timeout?: number;
    label?: string;
    size?: "sm" | "md";
}
export declare function CopyButton({ value, timeout, label, size, className, ...props }: CopyButtonProps): import("react").JSX.Element;
