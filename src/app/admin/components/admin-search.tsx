import {Search, X} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useTranslation} from "react-i18next";

interface AdminSearchProps {
    searchQuery: string
    setSearchQuery: (value: string) => void;
}

export function AdminSearch({searchQuery, setSearchQuery} : AdminSearchProps) {
    const { t } = useTranslation();
    return (
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500"/>
            <Input
                placeholder={t('common.search')}
                className="pl-8"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        setSearchQuery(e.currentTarget.value);
                    }
                }}
            />
            {searchQuery && (
                <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                    type="button"
                >
                    <X className="h-4 w-4"/>
                    <span className="sr-only">Clear search</span>
                </button>
            )}
        </div>
    )
}