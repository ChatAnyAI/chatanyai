"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, FileText, Plus, ChevronRight, ChevronLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCreateSpace } from "@/hooks/use-create-space"
import { AppType } from "@/lib/constants/constants"
import { ApiTemplateList, Template } from '@/service/api'
import useSWR from "swr"
import { Icon } from "@/components/nav-group"
import { cn } from "@/lib/utils"

export const BLANK_TEMPLATE = {
    id: "blank",
    name: "创建空白模板 - Create Blank",
    description: "",
    icon: "➕",
    group: "工具",
}

// Template category data
// Template category type definition
type CategoryIcon = JSX.Element | null;

type Category = {
    id: string;
    name: string;
    icon?: CategoryIcon;
    isDivider?: boolean;
}

// Format number with Chinese units
const formatNumber = (num: number) => {
    if (num >= 10000) {
        return `${(num / 10000).toFixed(1).replace(/\.0$/, "")} 10k`
    }
    return num.toString()
}

interface TemplateDialogProps {
    onClose: () => void
}

// 侧边栏类别
const categories = [
    "我的",
    "精选",
    "职业",
    "商业",
    "工具",
    "语言",
    "办公",
    "通用",
    "写作",
    "编程",
    "情感",
    "教育",
    "创意",
    "学术",
    "设计",
    "艺术",
    "娱乐",
    "生活",
]

export default function TemplateDialog({ onClose = () => { } }: TemplateDialogProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState(categories[0])
    const [templates, setTemplates] = useState<Template[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const modalContentRef = useRef<HTMLDivElement>(null)

    // 加载模板数据
    const loadTemplates = async (reset = false, newPage: number | null = null) => {
        if (reset) {
            setIsLoading(true)
            setPage(1)
            setTemplates([])
        }

        try {
            const pageToLoad = newPage || (reset ? 1 : page)
            const result = await ApiTemplateList(selectedCategory, pageToLoad)

            if (reset || newPage) {
                setTemplates(result.templates)
            } else {
                setTemplates((prev) => [...prev, ...result.templates])
            }

            setHasMore(result.hasMore)
            setTotalPages(result.totalPages)
            setPage(newPage || (reset ? 2 : page + 1))
        } catch (error) {
            console.error("Error loading templates:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // 初始加载和类别变更时重新加载
    useEffect(() => {
        loadTemplates(true)
    }, [selectedCategory])

    // 搜索处理
    const handleSearch = (value: string) => {
        setSearchQuery(value)
        // 实际应用中，这里应该调用API进行搜索
        // 为了演示，我们简单地重置并重新加载
        loadTemplates(true)
    }

    // 滚动加载更多
    const handleScroll = () => {
        if (!modalContentRef.current || isLoading || !hasMore) return

        const { scrollTop, scrollHeight, clientHeight } = modalContentRef.current
        // 当滚动到距离底部100px时触发加载
        if (scrollHeight - scrollTop - clientHeight < 100) {
            loadTemplates()
        }
    }

    // 添加滚动事件监听
    useEffect(() => {
        const contentElement = modalContentRef.current
        if (contentElement) {
            contentElement.addEventListener("scroll", handleScroll)
            return () => contentElement.removeEventListener("scroll", handleScroll)
        }
    }, [isLoading, hasMore])

    // 直接跳转到指定页
    const goToPage = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages || pageNumber === page) return
        loadTemplates(false, pageNumber)
    }



    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-background rounded-xl shadow-xl flex flex-col w-full max-w-6xl h-[100%] overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 顶部标题栏 - 更简洁 */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h1 className="text-xl font-medium">New Copilot</h1>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-muted/50">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* 主体内容 */}
                <div className="flex flex-1 overflow-hidden">
                    {/* 侧边栏 */}
                    <div className="w-28 border-r border-border bg-muted/10 flex flex-col h-full">
                        {/* 可滚动的类别列表 */}
                        <div className="flex-1 overflow-y-auto">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={cn(
                                        "w-full py-4 text-center transition-colors relative",
                                        selectedCategory === category
                                            ? "text-primary font-medium bg-primary/5"
                                            : "text-muted-foreground hover:bg-muted/20",
                                    )}
                                >
                                    {category}
                                    {selectedCategory === category && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 主内容区 */}
                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                        {/* 类别标题和搜索栏 */}
                        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
                            <div className="flex items-center">
                                <span className="text-muted-foreground mr-2">📄</span>
                                <h2 className="text-lg font-medium">{selectedCategory}</h2>
                            </div>

                            <div className="relative w-80">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search templates"
                                    className="pl-10 pr-10 h-10"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        onClick={() => handleSearch("")}
                                    >
                                        <X className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 模板网格 */}
                        <div className="flex-1 p-6 overflow-y-auto" ref={modalContentRef} onScroll={handleScroll}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* 空白模板始终显示在第一位 */}
                                <TemplateCard template={BLANK_TEMPLATE} />

                                {/* API返回的模板 */}
                                {templates?.map((template) => (
                                    <TemplateCard key={template.id} template={template} />
                                ))}

                                {/* 加载状态 */}
                                {isLoading && (
                                    <>
                                        {[...Array(3)].map((_, index) => (
                                            <TemplateCardSkeleton key={index} />
                                        ))}
                                    </>
                                )}
                            </div>

                            {/* 分页控制 */}
                            {totalPages > 1 && !isLoading && (
                                <div className="flex items-center justify-center mt-8 mb-4 space-x-2">
                                    <Button variant="outline" size="icon" disabled={page <= 2} onClick={() => goToPage(page - 1)}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    <div className="text-sm text-muted-foreground">
                                        第 <span className="font-medium text-foreground">{page - 1}</span> 页， 共{" "}
                                        <span className="font-medium text-foreground">{totalPages}</span> 页
                                    </div>

                                    <Button variant="outline" size="icon" disabled={page > totalPages} onClick={() => goToPage(page)}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            {/* 无结果提示 */}
                            {!isLoading && templates?.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
                                    <div className="text-5xl mb-4">🔍</div>
                                    <p className="text-lg">未找到模板</p>
                                    <p className="text-sm">请尝试调整搜索条件或类别</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// 模板卡片组件
function TemplateCard({ template }: { template: Template | typeof BLANK_TEMPLATE }) {
    const [isHovered, setIsHovered] = useState(false)

    const isBlank = template.id === "blank"

    return (
        <div
            className={cn(
                "group relative rounded-xl overflow-hidden bg-card transition-all duration-200 h-[280px] flex flex-col",
                "border border-border hover:shadow-lg",
                isHovered ? "ring-2 ring-primary/30" : "",
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* 卡片顶部 */}
            <div className="p-5 border-b border-border bg-muted/10">
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full bg-background border border-border shadow-sm">
                        <span className="text-2xl">{template.icon}</span>
                    </div>
                    <h3 className="font-medium line-clamp-2">{template.name}</h3>
                </div>
            </div>

            {/* 卡片内容 */}
            <div className="flex-1 p-5 overflow-y-auto">
                {template.description ? (
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                ) : isBlank ? (
                    <div className="flex items-center justify-center h-full">
                        <Plus className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                ) : null}
            </div>

            {/* 悬浮时显示的使用按钮 */}
            <div
                className={cn(
                    "absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent opacity-0 transition-opacity duration-200",
                    isHovered && "opacity-100",
                )}
            >
                <Button className="w-full transition-colors hover:bg-primary/90 hover:text-primary-foreground" size="lg">
                    使用
                </Button>
            </div>
        </div>
    )
}

// 加载中的卡片骨架屏
function TemplateCardSkeleton() {
    return (
        <div className="rounded-xl border border-border bg-card h-[280px] flex flex-col animate-pulse">
            <div className="p-5 border-b border-border">
                <div className="flex items-center space-x-4">
                    <div className="h-14 w-14 rounded-full bg-muted"></div>
                    <div className="h-5 bg-muted rounded w-3/4"></div>
                </div>
            </div>
            <div className="flex-1 p-5">
                <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-4/6"></div>
                </div>
            </div>
        </div>
    )
}