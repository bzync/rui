import { ReactNode } from 'react';
export type SortDir = "asc" | "desc" | null;
export interface ColumnDef<T> {
    key: string;
    header: ReactNode;
    cell: (row: T) => ReactNode;
    sortable?: boolean;
    searchable?: boolean;
    width?: string;
    align?: "left" | "center" | "right";
}
export interface DataTableProps<T extends {
    id: string | number;
}> {
    columns: ColumnDef<T>[];
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
    onRowClick?: (row: T) => void;
    className?: string;
    /** Show search bar. Pass column keys to search — defaults to all searchable columns */
    searchable?: boolean;
    searchPlaceholder?: string;
    /** Rows per page options. Pass false to disable pagination entirely. Default: [10, 25, 50] */
    pageSizeOptions?: number[] | false;
    defaultPageSize?: number;
    density?: "compact" | "comfortable";
    ariaLabel?: string;
    getRowLabel?: (row: T) => string;
}
