export interface StepperStep {
    label: string;
    description?: string;
}
export interface StepperProps {
    steps: StepperStep[];
    current: number;
    orientation?: "horizontal" | "vertical";
    className?: string;
}
export declare function Stepper({ steps, current, orientation, className }: StepperProps): import("react").JSX.Element;
