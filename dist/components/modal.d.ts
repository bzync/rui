import { HTMLAttributes, ReactNode } from 'react';
export interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
    overlayClassName?: string;
    panelClassName?: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl" | "full";
    title?: string;
    description?: string;
    icon?: ReactNode;
    showCloseButton?: boolean;
    closeAriaLabel?: string;
    scrollable?: boolean;
    unstyled?: boolean;
    ariaLabel?: string;
    closeOnEscape?: boolean;
    closeOnOverlayClick?: boolean;
}
export declare function Modal({ open, onClose, children, className, overlayClassName, panelClassName, size, title, description, icon, showCloseButton, closeAriaLabel, scrollable, unstyled, ariaLabel, closeOnEscape, closeOnOverlayClick, }: ModalProps): import("react").JSX.Element | null;
export declare function ModalHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>): import("react").JSX.Element;
export declare function ModalTitle({ as: Tag, className, children, ...props }: HTMLAttributes<HTMLHeadingElement> & {
    as?: "h1" | "h2" | "h3" | "div";
}): import("react").JSX.Element;
export declare function ModalDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>): import("react").JSX.Element;
export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
    scrollable?: boolean;
}
export declare function ModalBody({ className, scrollable, children, ...props }: ModalBodyProps): import("react").JSX.Element;
export declare function ModalFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>): import("react").JSX.Element;
