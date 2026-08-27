import { HTMLAttributes, ReactNode } from 'react';
type PopoverSide = "top" | "bottom" | "left" | "right";
type PopoverAlign = "start" | "center" | "end";
export interface PopoverProps {
    trigger: ReactNode;
    children: ReactNode;
    side?: PopoverSide;
    align?: PopoverAlign;
    className?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    ariaLabel?: string;
}
export declare function Popover({ trigger, children, side, align, className, open: controlledOpen, onOpenChange, ariaLabel, }: PopoverProps): import("react").JSX.Element;
export declare function PopoverContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>): import("react").JSX.Element;
export {};
