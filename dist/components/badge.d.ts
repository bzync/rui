import { HTMLAttributes } from 'react';
export type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "muted";
export type BadgeSize = "sm" | "md" | "lg";
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    dot?: boolean;
    size?: BadgeSize;
    /** Override or extend variant map — enables end-to-end customization */
    variants?: Partial<Record<BadgeVariant, string>>;
}
export declare const badgeVariants: Record<BadgeVariant, string>;
export declare function Badge({ variant, dot, size, variants, className, children, ...props }: BadgeProps): import("react").JSX.Element;
