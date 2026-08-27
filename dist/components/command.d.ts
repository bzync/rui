import { ReactNode } from 'react';
export interface CommandItem {
    id: string;
    label: string;
    description?: string;
    icon?: ReactNode;
    shortcut?: string[];
    group?: string;
    keywords?: string[];
    onSelect: () => void;
}
interface CommandContextValue {
    open: boolean;
    setOpen: (v: boolean) => void;
}
export declare function useCommand(): CommandContextValue;
export interface CommandProviderProps {
    children: ReactNode;
    shortcut?: string;
}
export declare function CommandProvider({ children, shortcut }: CommandProviderProps): import("react").JSX.Element;
export interface CommandPaletteProps {
    items: CommandItem[];
    placeholder?: string;
    emptyText?: string;
    ariaLabel?: string;
}
export declare function CommandPalette({ items, placeholder, emptyText, ariaLabel, }: CommandPaletteProps): import("react").JSX.Element;
export {};
