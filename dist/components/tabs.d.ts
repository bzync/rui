import { HTMLMotionProps } from 'framer-motion';
import { HTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
export interface TabsProps {
    defaultValue: string;
    value?: string;
    children: ReactNode;
    className?: string;
    orientation?: "horizontal" | "vertical";
    onChange?: (value: string) => void;
}
export declare function Tabs({ defaultValue, value, children, className, orientation, onChange, }: TabsProps): import("react").JSX.Element;
export declare function TabsList({ className, children, ...props }: HTMLAttributes<HTMLDivElement>): import("react").JSX.Element;
export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    icon?: ReactNode;
}
export declare function TabsTrigger({ value, className, children, icon, onKeyDown, ...props }: TabsTriggerProps): import("react").JSX.Element;
export interface TabsContentProps extends Omit<HTMLMotionProps<"div">, "children"> {
    value: string;
    children?: ReactNode;
}
export declare function TabsContent({ value, className, children, ...props }: TabsContentProps): import("react").JSX.Element;
