export interface ScatterPoint {
    x: number;
    y: number;
    /** Dot radius multiplier (0.5–2). Default 1. */
    r?: number;
    label?: string;
    color?: string;
}
export interface ScatterSeries {
    label: string;
    color?: string;
    data: ScatterPoint[];
}
export interface ScatterChartProps {
    series: ScatterSeries[];
    height?: number;
    xLabel?: string;
    yLabel?: string;
    gridLines?: number;
    className?: string;
    formatX?: (v: number) => string;
    formatY?: (v: number) => string;
}
export declare function ScatterChart({ series, height, xLabel, gridLines, className, formatX, formatY, }: ScatterChartProps): import("react").JSX.Element;
