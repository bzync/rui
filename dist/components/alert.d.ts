import { HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
type Variant = "info" | "success" | "warning" | "error";
export interface AlertProps extends Omit<HTMLMotionProps<"div">, "title" | "children"> {
    variant?: Variant;
    title?: string;
    icon?: ReactNode;
    children?: ReactNode;
    dismissable?: boolean;
    onDismiss?: () => void;
}
export declare function Alert({ variant, title, icon, className, children, dismissable, onDismiss, ...props }: AlertProps): import("react").JSX.Element;
export {};
