export interface HeatmapChartProps {
    data: number[][];
    rowLabels?: string[];
    colLabels?: string[];
    color?: string;
    cellSize?: number;
    className?: string;
    formatValue?: (v: number) => string;
}
export declare function HeatmapChart({ data, rowLabels, colLabels, color, cellSize, className, formatValue, }: HeatmapChartProps): import("react").JSX.Element;
