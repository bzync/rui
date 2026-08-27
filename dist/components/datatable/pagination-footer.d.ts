export declare function PaginationFooter({ loading, sortedLength, pageSizeOptions, pageSize, page, totalPages, hasPagination, setPage, }: {
    loading: boolean;
    sortedLength: number;
    pageSizeOptions: number[] | false;
    pageSize: number;
    page: number;
    totalPages: number;
    hasPagination: boolean;
    setPage: (p: number | ((prev: number) => number)) => void;
}): import("react").JSX.Element;
