import { ChartDataPoint } from './shared';
export interface BarChartProps {
    data: ChartDataPoint[];
    height?: number;
    /** Color applied to all bars unless each data point specifies its own */
    color?: string;
    /** Show value label on each bar */
    showValues?: boolean;
    /** Number of gridlines */
    gridLines?: number;
    /** "vertical" (default) = columns; "horizontal" = rows */
    orientation?: "vertical" | "horizontal";
    className?: string;
    formatValue?: (v: number) => string;
}
export declare function BarChart({ data, height, color, showValues, gridLines, orientation, className, formatValue, }: BarChartProps): import("react").JSX.Element;
