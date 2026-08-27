export interface WaterfallItem {
    label: string;
    value: number;
    /** If true, renders as a full summary bar from zero. */
    total?: boolean;
    color?: string;
}
export interface WaterfallChartProps {
    data: WaterfallItem[];
    height?: number;
    className?: string;
    formatValue?: (v: number) => string;
}
export declare function WaterfallChart({ data, height, className, formatValue, }: WaterfallChartProps): import("react").JSX.Element;
