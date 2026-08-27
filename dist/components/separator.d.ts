import { HTMLAttributes } from 'react';
export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
    orientation?: "horizontal" | "vertical";
    label?: string;
}
export declare function Separator({ orientation, label, className, ...props }: SeparatorProps): import("react").JSX.Element;
