import { ButtonHTMLAttributes, ReactNode } from 'react';
export interface ThemeToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    lightIcon?: ReactNode;
    darkIcon?: ReactNode;
    showLabel?: boolean;
    lightLabel?: string;
    darkLabel?: string;
}
export declare function ThemeToggle({ lightIcon, darkIcon, showLabel, lightLabel, darkLabel, className, onClick, type, ...props }: ThemeToggleProps): import("react").JSX.Element;
