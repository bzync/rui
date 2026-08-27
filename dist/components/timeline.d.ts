import { ReactNode } from 'react';
export interface TimelineEvent {
    id: string;
    title: string;
    description?: string;
    timestamp?: string;
    icon?: ReactNode;
    variant?: "default" | "success" | "warning" | "error" | "info";
}
export interface TimelineProps {
    events: TimelineEvent[];
    className?: string;
}
export declare function Timeline({ events, className }: TimelineProps): import("react").JSX.Element;
