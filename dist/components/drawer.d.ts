import { ReactNode } from 'react';
export interface DrawerProps {
    open: boolean;
    onClose: () => void;
    position?: "left" | "right" | "bottom";
    title?: ReactNode;
    children: ReactNode;
    width?: number | string;
    className?: string;
    overlayClassName?: string;
    panelClassName?: string;
    unstyled?: boolean;
    ariaLabel?: string;
    closeAriaLabel?: string;
    closeOnEscape?: boolean;
    closeOnOverlayClick?: boolean;
}
export declare function Drawer({ open, onClose, position, title, children, width, className, overlayClassName, panelClassName, unstyled, ariaLabel, closeAriaLabel, closeOnEscape, closeOnOverlayClick, }: DrawerProps): import('react').ReactPortal | null;
