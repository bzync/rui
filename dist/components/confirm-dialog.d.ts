import { ReactNode } from 'react';
export interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    loading?: boolean;
    icon?: ReactNode;
}
export declare function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel, cancelLabel, destructive, loading, icon, }: ConfirmDialogProps): import("react").JSX.Element;
