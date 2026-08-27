import { ReactNode } from 'react';
export type SnackbarVariant = "default" | "info" | "success" | "warning" | "error";
export type SnackbarPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
export interface SnackbarOptions {
    message: ReactNode;
    variant?: SnackbarVariant;
    /** Auto-dismiss delay in ms. Set to 0 to persist until dismissed. Default: 4000 */
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
    /**
     * Stable id for deduplication — if a toast with this id is already
     * showing, calling show() again with the same id replaces it in place
     * (and resets its dismiss timer) instead of stacking a second copy.
     * Without an id, every call always adds a new toast, even if the
     * message is identical to one already on screen (e.g. two components
     * independently failing the same request in the same render pass).
     */
    id?: string;
}
interface SnackbarContextValue {
    show: (opts: SnackbarOptions) => string;
    dismiss: (id: string) => void;
    dismissAll: () => void;
}
export declare function useSnackbar(): SnackbarContextValue;
export interface SnackbarProviderProps {
    children: ReactNode;
    position?: SnackbarPosition;
    maxVisible?: number;
}
export declare function SnackbarProvider({ children, position, maxVisible, }: SnackbarProviderProps): import("react").JSX.Element;
export {};
