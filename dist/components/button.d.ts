import { ButtonHTMLAttributes, ReactNode } from 'react';
export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "destructive" | "link";
export type ButtonSize = "sm" | "md" | "lg" | "icon";
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    children?: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
    /** End-to-end override */
    variantClassName?: string;
    unstyled?: boolean;
}
export declare const buttonVariants: Record<ButtonVariant, string>;
export declare const buttonSizes: Record<ButtonSize, string>;
export declare const Button: import('react').NamedExoticComponent<ButtonProps & import('react').RefAttributes<HTMLButtonElement>>;
