import { HTMLAttributes } from 'react';
export type CardVariant = "default" | "elevated" | "bordered" | "glass" | "flush";
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant;
    /** Override variant styling end-to-end */
    variantClassName?: string;
    unstyled?: boolean;
}
export declare const cardVariants: Record<CardVariant, string>;
export declare function Card({ variant, variantClassName, unstyled, className, children, ...props }: CardProps): import("react").JSX.Element;
export declare function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>): import("react").JSX.Element;
export declare function CardTitle({ as: Tag, className, children, ...props }: HTMLAttributes<HTMLHeadingElement> & {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "p";
}): import("react").JSX.Element;
export declare function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>): import("react").JSX.Element;
export declare function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>): import("react").JSX.Element;
export declare function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>): import("react").JSX.Element;
