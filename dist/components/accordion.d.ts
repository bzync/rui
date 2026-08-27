import { HTMLAttributes, ReactNode } from 'react';
export interface AccordionItem {
    id: string;
    trigger: ReactNode;
    content: ReactNode;
    disabled?: boolean;
}
export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
    items: AccordionItem[];
    multiple?: boolean;
    defaultOpen?: string[];
}
export declare function Accordion({ items, multiple, defaultOpen, className, ...props }: AccordionProps): import("react").JSX.Element;
export interface CollapsibleProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultOpen?: boolean;
    trigger: ReactNode;
    children: ReactNode;
    className?: string;
}
export declare function Collapsible({ open: controlledOpen, onOpenChange, defaultOpen, trigger, children, className, }: CollapsibleProps): import("react").JSX.Element;
