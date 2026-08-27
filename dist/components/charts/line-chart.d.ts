import { ChartDataPoint } from './shared';
export interface LineChartProps {
    data: ChartDataPoint[];
    height?: number;
    color?: string;
    area?: boolean;
    dots?: boolean;
    gridLines?: number;
    className?: string;
    formatValue?: (v: number) => string;
    smooth?: boolean;
    showXLabels?: boolean;
    /** Max number of x-axis labels to show before thinning them out evenly. Default 8. */
    maxLabels?: number;
}
export declare function LineChart({ data, height, color, area, dots, gridLines, className, formatValue, smooth, showXLabels, maxLabels, }: LineChartProps): import("react").JSX.Element;
