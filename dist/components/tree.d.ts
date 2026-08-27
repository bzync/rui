import { ReactNode } from 'react';
export interface TreeNode {
    id: string;
    label: string;
    icon?: ReactNode;
    children?: TreeNode[];
    disabled?: boolean;
}
export interface TreeProps {
    nodes: TreeNode[];
    selected?: string;
    onSelect?: (id: string) => void;
    defaultExpanded?: string[];
    className?: string;
}
export declare function Tree({ nodes, selected, onSelect, defaultExpanded, className }: TreeProps): import("react").JSX.Element;
