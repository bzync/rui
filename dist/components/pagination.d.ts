export interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
    className?: string;
}
export declare function Pagination({ page, totalPages, onPageChange, siblingCount, className, }: PaginationProps): import("react").JSX.Element | null;
