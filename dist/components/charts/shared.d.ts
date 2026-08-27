import { ReactNode } from 'react';
export interface ChartDataPoint {
    label: string;
    value: number;
    color?: string;
}
export interface TooltipState {
    x: number;
    y: number;
    content: ReactNode;
}
export declare function visibleLabelAt(n: number, max: number): (i: number) => boolean;
export declare function ChartTooltip({ tooltip }: {
    tooltip: TooltipState | null;
}): import('react').ReactPortal | null;
