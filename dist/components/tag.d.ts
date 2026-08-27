import { HTMLAttributes, ReactNode } from 'react';
type TagVariant = "default" | "success" | "warning" | "error" | "info";
type TagSize = "sm" | "md";
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: TagVariant;
    size?: TagSize;
    onRemove?: () => void;
    icon?: ReactNode;
    disabled?: boolean;
}
export declare function Tag({ variant, size, onRemove, icon, disabled, className, children, ...props }: TagProps): import("react").JSX.Element;
export {};
