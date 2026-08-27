import { HTMLAttributes } from 'react';
export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    width?: string | number;
    height?: string | number;
    rounded?: "sm" | "md" | "lg" | "full";
}
export declare function Skeleton({ className, width, height, rounded, style, ...props }: SkeletonProps): import("react").JSX.Element;
export interface SkeletonTextProps {
    lines?: number;
    className?: string;
    lastLineWidth?: string;
}
export declare function SkeletonText({ lines, className, lastLineWidth, }: SkeletonTextProps): import("react").JSX.Element;
export interface SkeletonAvatarProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}
export declare function SkeletonAvatar({ size, className }: SkeletonAvatarProps): import("react").JSX.Element;
export interface SkeletonCardProps {
    lines?: number;
    hasAvatar?: boolean;
    hasFooter?: boolean;
    className?: string;
}
export declare function SkeletonCard({ lines, hasAvatar, hasFooter, className, }: SkeletonCardProps): import("react").JSX.Element;
export interface SkeletonTopbarProps {
    hasBreadcrumb?: boolean;
    hasAction?: boolean;
    className?: string;
}
export declare function SkeletonTopbar({ hasBreadcrumb, hasAction, className, }: SkeletonTopbarProps): import("react").JSX.Element;
export interface SkeletonTableProps {
    rows?: number;
    cols?: number;
    className?: string;
}
export declare function SkeletonTable({ rows, cols, className, }: SkeletonTableProps): import("react").JSX.Element;
