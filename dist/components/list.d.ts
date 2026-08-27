import { HTMLAttributes, ReactNode } from 'react';
export interface ListProps extends HTMLAttributes<HTMLUListElement> {
    divided?: boolean;
}
export declare function List({ divided, className, children, ...props }: ListProps): import("react").JSX.Element;
export interface ListItemProps extends HTMLAttributes<HTMLLIElement> {
    icon?: ReactNode;
    trailing?: ReactNode;
    description?: string;
    href?: string;
    active?: boolean;
}
export declare function ListItem({ icon, trailing, description, href, active, className, children, onClick, ...props }: ListItemProps): import("react").JSX.Element;
