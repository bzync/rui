import { HTMLAttributes, ReactNode } from 'react';
type Trend = "up" | "down" | "neutral";
export interface StatProps extends HTMLAttributes<HTMLDivElement> {
    label: string;
    value: string | number;
    unit?: string;
    valueClassName?: string;
    trend?: Trend;
    trendValue?: string;
    icon?: ReactNode;
    description?: string;
    /** Rendered next to the icon in the header row — e.g. a small toggle.
     * Clicks inside it are not stopped from bubbling; wrap with
     * `onClick={(e) => e.stopPropagation()}` if the Stat sits inside a link. */
    action?: ReactNode;
}
export declare function Stat({ label, value, unit, valueClassName, trend, trendValue, icon, description, action, className, ...props }: StatProps): import("react").JSX.Element;
export {};
