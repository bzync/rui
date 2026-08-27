type Status = "online" | "offline" | "idle" | "busy" | "error" | "pending";
export interface StatusDotProps {
    status: Status;
    label?: string;
    pulse?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
}
export declare function StatusDot({ status, label, pulse, size, className }: StatusDotProps): import("react").JSX.Element;
export {};
