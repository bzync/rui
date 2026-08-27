export interface MultiLineSeries {
    label: string;
    color?: string;
    data: number[];
}
export interface MultiLineChartProps {
    labels: string[];
    series: MultiLineSeries[];
    height?: number;
    area?: boolean;
    dots?: boolean;
    gridLines?: number;
    className?: string;
    formatValue?: (v: number) => string;
    /** Max number of x-axis labels to show before thinning them out evenly. Default 8. */
    maxLabels?: number;
}
export declare function MultiLineChart({ labels, series, height, area, dots, gridLines, className, formatValue, maxLabels, }: MultiLineChartProps): import("react").JSX.Element;
