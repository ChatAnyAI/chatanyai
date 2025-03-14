'use client'
import { ChevronLeft, MoreVertical, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DocumentChunk from "./components/document-chunk"
import { Metadata } from "./components/metadata"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useSWR from "swr";
import { ApiDatasetDocumentPageList } from "@/service/api";
import { useNavigate, useParams } from "react-router-dom";

export default function Page() {
    const navigator = useNavigate();
    const { datasetId, fileId } = useParams();
    const { data: respData } = useSWR([datasetId, fileId], () => ApiDatasetDocumentPageList(datasetId!, fileId!));
    const pageList = respData?.list || [];
    return (
        <div className="min-h-screen bg-background flex-1">
            {/* Header */}
            <header className="border-b">
                <div className="container flex h-14 items-center px-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigator(-1)}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-blue-500" />
                            <div>
                                <span className="font-medium">dataset.md</span>
                                <span className="text-muted-foreground"> • GENERAL</span>
                            </div>
                        </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="ghost">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Chunk
                        </Button>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container grid grid-cols-[240px_1fr_320px] gap-6 px-4 py-6">
                {/* Sidebar */}
                <div className="space-y-4">
                    <div className="font-medium text-sm text-muted-foreground">LOCAL DOCS</div>
                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start">
                            dataset.md
                            <span className="ml-auto text-muted-foreground text-xs">{pageList?.length || 0} CHUNKS</span>
                        </Button>
                    </div>
                    <div className="font-medium text-sm text-muted-foreground mt-6">NO LINKED APPS</div>
                </div>

                {/* Main Content */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="text-sm">{pageList?.length || 0} CHUNKS</div>
                        <div className="ml-auto flex items-center gap-2">
                            <Select defaultValue="all">
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="enabled">Enabled</SelectItem>
                                    <SelectItem value="disabled">Disabled</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search" className="pl-8" />
                            </div>
                        </div>
                    </div>

                    {pageList && <div className="space-y-4">
                        {pageList.map((item, i) => (
                            <DocumentChunk
                                key={i}
                                id={`Chunk-0${i + 1}`}
                                characters={item.wordCount}
                                retrievalCount={0}
                                enabled={true}
                                content={item.content}
                                tags={["software", "technology", "novel", "chatgpt", "AI"]}
                            />
                        ))}
                    </div>}
                </div>

                {/* Right Sidebar */}
                <Metadata />
            </div>
        </div>
    )
}

