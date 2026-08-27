import { DataTableProps } from './datatable/types';
export type { SortDir, ColumnDef, DataTableProps } from './datatable/types';
export declare function DataTable<T extends {
    id: string | number;
}>({ columns, data, loading, emptyMessage, onRowClick, className, toolbarClassName, tableClassName, searchable, searchPlaceholder, pageSizeOptions, defaultPageSize, density, ariaLabel, getRowLabel, unstyled, }: DataTableProps<T> & {
    toolbarClassName?: string;
    tableClassName?: string;
    unstyled?: boolean;
}): import("react").JSX.Element;
