import { HTMLAttributes, ReactNode } from 'react';
export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
    /** Prevent the shell itself from scrolling and let AppShellMain own overflow. */
    fixed?: boolean;
}
/** Root frame for application layouts. Compose it with Sidebar and AppShellBody. */
export declare function AppShell({ fixed, className, children, ...props }: AppShellProps): import("react").JSX.Element;
/** Vertical region beside a sidebar. Usually contains a topbar, main, and footer. */
export declare function AppShellBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>): import("react").JSX.Element;
export interface AppShellMainProps extends HTMLAttributes<HTMLElement> {
    scrollable?: boolean;
}
export declare function AppShellMain({ scrollable, className, children, ...props }: AppShellMainProps): import("react").JSX.Element;
export interface LayoutBarProps extends HTMLAttributes<HTMLElement> {
    sticky?: boolean;
}
/** General-purpose application header; Topbar can be used inside it for navigation controls. */
export declare function AppShellHeader({ sticky, className, children, ...props }: LayoutBarProps): import("react").JSX.Element;
/** Page or application footer with safe-area padding. */
export declare function Footer({ sticky, className, children, ...props }: LayoutBarProps): import("react").JSX.Element;
type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";
export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    size?: ContainerSize;
    gutter?: boolean;
}
/** Centers content and provides consistent responsive page gutters. */
export declare function Container({ size, gutter, className, children, ...props }: ContainerProps): import("react").JSX.Element;
export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    title: ReactNode;
    /** Heading level for SEO hierarchy; defaults to h1 (one per page) */
    as?: "h1" | "h2" | "h3" | "div";
    description?: ReactNode;
    eyebrow?: ReactNode;
    breadcrumbs?: ReactNode;
    actions?: ReactNode;
}
/** Standard page heading with optional breadcrumbs, supporting copy, and actions. */
export declare function PageHeader({ title, description, eyebrow, breadcrumbs, actions, as: Tag, className, ...props }: PageHeaderProps): import("react").JSX.Element;
export interface StackProps extends HTMLAttributes<HTMLDivElement> {
    gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
}
/** Vertical spacing primitive for page sections and forms. */
export declare function Stack({ gap, className, children, ...props }: StackProps): import("react").JSX.Element;
export interface InlineProps extends StackProps {
    wrap?: boolean;
    align?: "start" | "center" | "end" | "stretch";
    justify?: "start" | "center" | "end" | "between";
}
/** Horizontal spacing primitive for toolbars, actions, and metadata. */
export declare function Inline({ gap, wrap, align, justify, className, children, ...props }: InlineProps): import("react").JSX.Element;
export {};
