import { ReactNode } from 'react';
export interface ErrorStateProps {
    title?: string;
    description?: string;
    error?: string | Error;
    onRetry?: () => void;
    action?: ReactNode;
    className?: string;
}
export declare function ErrorState({ title, description, error, onRetry, action, className, }: ErrorStateProps): import("react").JSX.Element;
