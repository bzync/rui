export interface RadarSeries {
    label: string;
    color?: string;
    data: number[];
}
export interface RadarChartProps {
    axes: string[];
    series: RadarSeries[];
    size?: number;
    gridLines?: number;
    className?: string;
}
export declare function RadarChart({ axes, series, size, gridLines, className, }: RadarChartProps): import("react").JSX.Element;
