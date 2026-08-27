import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
export interface TableProps extends HTMLAttributes<HTMLTableElement> {
    containerClassName?: string;
    scrollAreaClassName?: string;
    density?: "compact" | "comfortable";
}
export declare function Table({ className, containerClassName, scrollAreaClassName, density, children, ...props }: TableProps): import("react").JSX.Element;
export declare function TableHeader({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>): import("react").JSX.Element;
export declare function TableBody({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>): import("react").JSX.Element;
export declare function TableRow({ className, children, ...props }: HTMLAttributes<HTMLTableRowElement>): import("react").JSX.Element;
export declare function TableHead({ className, children, ...props }: ThHTMLAttributes<HTMLTableCellElement>): import("react").JSX.Element;
export declare function TableCell({ className, children, ...props }: TdHTMLAttributes<HTMLTableCellElement>): import("react").JSX.Element;
