import { HTMLAttributes, ReactNode } from 'react';
export interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: ReactNode;
}
export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
    items: BreadcrumbItem[];
    separator?: ReactNode;
}
export declare function Breadcrumb({ items, separator, className, ...props }: BreadcrumbProps): import("react").JSX.Element;
