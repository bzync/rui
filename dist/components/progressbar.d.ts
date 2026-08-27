import { HTMLAttributes } from 'react';
export type ProgressVariant = "default" | "success" | "warning" | "error" | "info";
export type ProgressSize = "xs" | "sm" | "md" | "lg";
export interface ProgressbarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    value?: number;
    variant?: ProgressVariant;
    size?: ProgressSize;
    label?: string;
    showValue?: boolean;
    indeterminate?: boolean;
    /** Render as segmented steps instead of a continuous bar */
    steps?: number;
    animated?: boolean;
}
export declare function Progressbar({ value, variant, size, label, showValue, indeterminate, steps, animated, className, ...props }: ProgressbarProps): import("react").JSX.Element;
