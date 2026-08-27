import { ChartDataPoint } from './shared';
export interface FunnelChartProps {
    data: ChartDataPoint[];
    height?: number;
    className?: string;
    formatValue?: (v: number) => string;
}
export declare function FunnelChart({ data, className, formatValue, }: FunnelChartProps): import("react").JSX.Element;
