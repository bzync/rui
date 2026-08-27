import { ReactNode } from 'react';
type Position = "top" | "bottom" | "left" | "right";
export interface TooltipProps {
    content: ReactNode;
    children: ReactNode;
    position?: Position;
    delayMs?: number;
    className?: string;
}
export declare function Tooltip({ content, children, position, delayMs, className, }: TooltipProps): import("react").JSX.Element;
export {};
