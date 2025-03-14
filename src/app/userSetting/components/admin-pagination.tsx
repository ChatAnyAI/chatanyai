import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {
    Pagination as UIPagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import {useTranslation} from "react-i18next";
import {Pagination} from "@/lib/request";

interface AdminPaginationProps {
    pagination: Pagination
    pageSize: number
    currentPage: number
    totalPages: number
    handlePageSizeChange: (value: string) => void;
    handlePageChange: (page: number) => void

}

export function AdminPagination(props : AdminPaginationProps) {
    const {pageSize, currentPage, handlePageSizeChange, handlePageChange,totalPages} = props;
    const { t } = useTranslation();
    return (
        <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
                {t('common.total', {total: props?.pagination?.total || 0})}
            </div>
            <div className="flex items-center gap-4">
                <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('common.perPage', {count: pageSize})}/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">{t('common.perPage', {count: 10})}</SelectItem>
                        <SelectItem value="20">{t('common.perPage', {count: 20})}</SelectItem>
                        <SelectItem value="50">{t('common.perPage', {count: 50})}</SelectItem>
                    </SelectContent>
                </Select>
                <UIPagination>
                    <PaginationContent>
                        {currentPage > 1 && (
                            <PaginationItem>
                                <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)}/>
                            </PaginationItem>
                        )}
                        {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => {
                            if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            isActive={currentPage === page}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            } else if (
                                page === currentPage - 2 ||
                                page === currentPage + 2
                            ) {
                                return <PaginationEllipsis key={page}/>;
                            }
                            return null;
                        })}
                        {currentPage < totalPages && (
                            <PaginationItem>
                                <PaginationNext onClick={() => handlePageChange(currentPage + 1)}/>
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </UIPagination>
            </div>
        </div>
    )
}
