import { ReactNode } from 'react';
export interface DropdownMenuItem {
    label: string;
    icon?: ReactNode;
    shortcut?: string;
    destructive?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}
export interface DropdownMenuGroup {
    group?: string;
    items: DropdownMenuItem[];
}
export type DropdownMenuSection = DropdownMenuItem | DropdownMenuGroup;
type Side = "bottom" | "top";
type Align = "start" | "end" | "center";
export interface DropdownMenuProps {
    trigger: ReactNode;
    items: DropdownMenuSection[];
    side?: Side;
    align?: Align;
    className?: string;
    ariaLabel?: string;
}
export declare function DropdownMenu({ trigger, items, side, align, className, ariaLabel, }: DropdownMenuProps): import("react").JSX.Element;
export {};
