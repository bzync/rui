import { HTMLAttributes } from 'react';
export interface KbdProps extends HTMLAttributes<HTMLElement> {
    keys: string | string[];
    size?: "sm" | "md";
}
export declare function Kbd({ keys, size, className, ...props }: KbdProps): import("react").JSX.Element;
