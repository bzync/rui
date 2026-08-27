import { ReactNode } from 'react';
import { ChartDataPoint } from './shared';
export interface DonutChartProps {
    data: ChartDataPoint[];
    size?: number;
    thickness?: number;
    centerLabel?: ReactNode;
    className?: string;
}
export declare function DonutChart({ data, size, thickness, centerLabel, className, }: DonutChartProps): import("react").JSX.Element;
