import { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
export interface NavigationItem {
    id: string;
    label: string;
    href?: string;
    icon?: ReactNode;
    badge?: ReactNode;
    disabled?: boolean;
}
interface NavigationItemProps extends NavigationItem {
    active?: boolean;
    compact?: boolean;
    onSelect?: (id: string) => void;
    className?: string;
}
export declare function NavigationLink({ id, label, href, icon, badge, disabled, active, compact, onSelect, className, }: NavigationItemProps): import("react").JSX.Element;
export interface NavigationListProps extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
    items: NavigationItem[];
    activeId?: string;
    onSelect?: (id: string) => void;
    ariaLabel?: string;
}
export declare function Navbar({ items, activeId, onSelect, ariaLabel, className, children, ...props }: NavigationListProps): import("react").JSX.Element;
export declare function Topbar({ className, children, ...props }: HTMLAttributes<HTMLElement>): import("react").JSX.Element;
export declare function TopbarTitle({ as: Tag, className, children, ...props }: HTMLAttributes<HTMLHeadingElement> & {
    as?: "h1" | "h2" | "h3" | "div" | "p";
}): import("react").JSX.Element;
export interface SidebarProps extends NavigationListProps {
    header?: ReactNode;
    footer?: ReactNode;
}
export declare function Sidebar({ items, activeId, onSelect, ariaLabel, header, footer, className, ...props }: SidebarProps): import("react").JSX.Element;
export declare function BottomBar({ items, activeId, onSelect, ariaLabel, className, ...props }: NavigationListProps): import("react").JSX.Element;
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
}
export declare function IconButton({ label, className, children, type, ...props }: IconButtonProps): import("react").JSX.Element;
export interface BrandLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    mark?: ReactNode;
}
export declare function BrandLink({ mark, className, children, ...props }: BrandLinkProps): import("react").JSX.Element;
export {};
