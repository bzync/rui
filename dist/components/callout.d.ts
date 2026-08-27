import { HTMLAttributes, ReactNode } from 'react';
type CalloutVariant = "info" | "success" | "warning" | "error" | "default";
export interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
    variant?: CalloutVariant;
    icon?: ReactNode;
    title?: string;
}
export declare function Callout({ variant, icon, title, className, children, ...props }: CalloutProps): import("react").JSX.Element;
export {};
