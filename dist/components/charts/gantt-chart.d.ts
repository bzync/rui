export interface GanttTask {
    id: string;
    label: string;
    start: number;
    end: number;
    color?: string;
}
export interface GanttChartProps {
    tasks: GanttTask[];
    total?: number;
    xLabels?: string[];
    rowHeight?: number;
    className?: string;
}
export declare function GanttChart({ tasks, total: totalProp, xLabels, rowHeight, className, }: GanttChartProps): import("react").JSX.Element;
