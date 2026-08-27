import { ReactNode } from 'react';
export interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
    size?: "sm" | "md" | "lg";
}
export declare function EmptyState({ icon, title, description, action, className, size, }: EmptyStateProps): import("react").JSX.Element;
