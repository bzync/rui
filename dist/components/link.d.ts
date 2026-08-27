import { AnchorHTMLAttributes, ReactNode } from 'react';
export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    external?: boolean;
    icon?: ReactNode;
    variant?: "default" | "muted" | "underline";
    /** Override rel when external; defaults to "noopener noreferrer" */
    externalRel?: string;
}
export declare function Link({ children, className, external, icon, variant, externalRel, ...props }: LinkProps): import("react").JSX.Element;
