"use client"

import type React from "react"

import {useState, useEffect, useRef, useCallback} from "react"
import {Search, X, Plus,  ChevronUp, ChevronDown, Wand2, } from "lucide-react"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {ApiTemplateGroupList, ApiTemplateList, Template} from '@/service/api'
import {cn} from "@/lib/utils"
import {useCreateSpace} from "@/hooks/use-create-space"
import {AppType, EmployeeStatus, EmployeeStatusEnum} from "@/lib/constants/constants"
import {motion} from "framer-motion";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";

export const BLANK_TEMPLATE = {
    id: 0,
    name: "Create Blank",
    description: "",
    icon: "➕",
} as unknown as Template

interface TemplateDialogProps {
    onClose: () => void
}

export default function TemplateDialog({
                                           onClose = () => {
                                           }
                                       }: TemplateDialogProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [categories, setCategories] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [templates, setTemplates] = useState<Template[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const modalContentRef = useRef<HTMLDivElement>(null)
    const {createSpace, chooseCopilotTemplate} = useCreateSpace()
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const throttleTimerRef = useRef<NodeJS.Timeout | null>(null)

    const loadCategories = async () => {
        try {
            const result = await ApiTemplateGroupList()
            setCategories(result)
            if (selectedCategory === "") {
                setSelectedCategory(result[0])
            }
        } catch (error) {
            console.error("Error loading categories:", error)
        }
    }

    const loadTemplates = async (reset = false, newPage: number | null = null) => {
        if (reset) {
            setIsLoading(true)
            setPage(1)
            setTemplates([])
        }

        setIsLoadingMore(true)
        try {
            const pageToLoad = newPage || (reset ? 1 : page)
            const result = await ApiTemplateList(selectedCategory, searchQuery, pageToLoad)

            let tps = result.list
            if (reset || newPage) {
                setTemplates(tps)
            } else {
                setTemplates((prev) => {
                    tps = [...prev, ...result.list];
                    return tps;
                })
            }

            setHasMore(tps.length < result.pagination.total!)
            setTotalPages(Math.ceil(result.pagination.total! / result.pagination.pageSize))
            setPage(newPage || (reset ? 2 : page + 1))
        } catch (error) {
            console.error("Error loading templates:", error)
        } finally {
            setIsLoading(false)
            setIsLoadingMore(false)
        }
    }

    // Load initially and reload when category changes
    useEffect(() => {
        if (categories.length === 0) {
            loadCategories()
        }
        loadTemplates(true)
    }, [selectedCategory])

    // Search handler
    const handleSearch = (value: string) => {
        if (value === "") {
            setSelectedCategory(categories[0])
        } else {
            setSelectedCategory("")
        }
        setSearchQuery(value)
        // In a real application, API should be called for searching
        // For demonstration, we simply reset and reload
        loadTemplates(true)
    }

    // Throttled scroll handler
    const handleScroll = useCallback(() => {
        console.log('handleScroll', isLoading, isLoadingMore, hasMore, throttleTimerRef.current);
        if (!modalContentRef.current || isLoading || isLoadingMore || !hasMore) return

        // Prevent multiple executions within 300ms
        if (throttleTimerRef.current) return

        const {scrollTop, scrollHeight, clientHeight} = modalContentRef.current
        // Trigger loading when scrolled to within 100px of the bottom
        if (scrollHeight - scrollTop - clientHeight < 100) {
            loadTemplates()

            // Set throttle timer
            const timerId = setTimeout(() => {
                throttleTimerRef.current = null
            }, 300)
            throttleTimerRef.current = timerId
        }
    }, [isLoading, isLoadingMore, hasMore, loadTemplates])

    const onCreateSpace = async (data: Template) => {
        await chooseCopilotTemplate(data.id)
        onClose()
    }

    // Add scroll event listener
    useEffect(() => {
        const contentElement = modalContentRef.current
        if (contentElement) {
            contentElement.addEventListener("scroll", handleScroll)
            return () => {
                contentElement.removeEventListener("scroll", handleScroll)
                // Clear any existing timer when unmounting
                if (throttleTimerRef.current) {
                    clearTimeout(throttleTimerRef.current)
                    throttleTimerRef.current = null
                }
            }
        }
    }, [handleScroll])

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-background rounded-xl shadow-xl flex flex-col w-full max-w-6xl h-[100%] overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top title bar - more concise */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h1 className="text-xl font-medium">New Assistant</h1>

                    <div className="relative w-80">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input
                            placeholder="Search templates"
                            className="pl-10 pr-10 h-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch(searchQuery);
                                }
                            }}
                        />
                        {searchQuery && (
                            <button
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                onClick={() => handleSearch("")}
                            >
                                <X className="h-4 w-4 text-muted-foreground"/>
                            </button>
                        )}
                    </div>

                    <button onClick={onClose} className="p-2 rounded-full hover:bg-muted/50">
                        <X className="h-5 w-5"/>
                    </button>
                </div>

                {/* Main content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-28 border-r border-border bg-muted/10 flex flex-col h-full">
                        {/* Scrollable category list */}
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
                                    {selectedCategory === category &&
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"/>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main content area */}
                    <div className="flex-1 flex flex-col h-full overflow-hidden">

                        {/* Template grid */}
                        <div className="flex-1 p-6 overflow-y-auto" ref={modalContentRef} onScroll={handleScroll}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* Blank template always displayed first */}
                                {/*<TemplateCard template={BLANK_TEMPLATE} chooseCopilotTemplate={() => onCreateSpace(null)} />*/}

                                {/* API returned templates */}
                                {templates?.map((template,index) => (
                                    <AssistantCard key={template.id} employee={template} index={index}
                                                  chooseCopilotTemplate={onCreateSpace}/>
                                ))}

                                {/* Loading state */}
                                {isLoading && (
                                    <>
                                        {[...Array(3)].map((_, index) => (
                                            <TemplateCardSkeleton key={index}/>
                                        ))}
                                    </>
                                )}
                            </div>

                            {/* No results message */}
                            {!isLoading && templates?.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
                                    <div className="text-5xl mb-4">🔍</div>
                                    <p className="text-lg">No templates found</p>
                                    <p className="text-sm">Try adjusting your search terms or category</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

function AssistantCard({employee, index, chooseCopilotTemplate}:
                       {
                           employee: Template;
                           index: number;
                           chooseCopilotTemplate: (template: Template) => void;
                       }) {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [expandedPrompts, setExpandedPrompts] = useState<{ [key: number]: boolean }>({});
    const togglePrompt = (id: number) => {
        setExpandedPrompts((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };


    let color = "";
    switch (index % 6) {
        case 0:
            color = "bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/30"
            break;
        case 1:
            color = "bg-yellow-50 dark:bg-yellow-950/20 hover:bg-yellow-100 dark:hover:bg-yellow-950/30"
            break;
        case 2:
            color = "bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/30"
            break;
        case 3:
            color = "bg-purple-50 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-950/30"
            break;
        case 4:
            color = "bg-indigo-50 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-950/30"
            break;
        case 5:
            color = "bg-pink-50 dark:bg-pink-950/20 hover:bg-pink-100 dark:hover:bg-pink-950/30"
            break;
    }

    return (
        <motion.div
            initial={{opacity: 0, scale: 0.95}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.3, delay: 0.1 * index}}
            whileHover={{scale: 1.02}}
            key={index}
            onMouseEnter={() => setHoveredCard(employee.id)}
            onMouseLeave={() => setHoveredCard(null)}
        >
            <div
                className={`block border rounded-lg p-4 shadow-xs transition-all duration-300 ${color}`}
            >
                <div className="flex items-start justify-between">
                    <div className="w-full">
                        <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">
                <Avatar className="h-16 w-16 border-2 border-background shadow-md">
                  <AvatarImage src={employee.avatar} alt={employee.name}/>
                </Avatar>
              </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-background/80 text-muted-foreground">
                {employee.role}
              </span>
                        </div>

                        <h3 className="font-medium truncate">My name is {employee.name}</h3>
                        <Collapsible open={expandedPrompts[employee.id]} onOpenChange={() => togglePrompt(employee.id)}
                                     className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium flex items-center">
                                    My introduction
                                </h4>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm" className="p-0 h-7 w-7">
                                        {expandedPrompts[employee.id] ? (
                                            <ChevronUp className="h-4 w-4"/>
                                        ) : (
                                            <ChevronDown className="h-4 w-4"/>
                                        )}
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent>
                                <div
                                    className="rounded-md bg-muted p-3 text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                                    {employee.prompt}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-2">
                            <span className="text-xs text-muted-foreground">
                            {new Date(employee.createdAt * 1000).toLocaleString()}
                            </span>
                        </div>
                        {/* Action buttons only visible on hover */}
                        <div
                            className={`absolute top-2 right-2 flex gap-1 transition-opacity duration-200 ${
                                hoveredCard === employee.id ? "opacity-100 visible" : "opacity-0 invisible"
                            }`}
                        >
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => chooseCopilotTemplate(employee)}
                                className="h-8 w-8 bg-white border-slate-200 text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                            >
                                <Wand2 className="h-4 w-4 mr-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Template card component
function TemplateCard({template, chooseCopilotTemplate}: {
    template: Template | typeof BLANK_TEMPLATE,
    chooseCopilotTemplate: (template: Template) => void
}) {
    const [isHovered, setIsHovered] = useState(false)

    const isBlank = template.id === 0

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
            {/* Card header */}
            <div className="p-5 border-b border-border bg-muted/10">
                <div className="flex items-center space-x-4">
                    <div
                        className="shrink-0 h-14 w-14 flex items-center justify-center rounded-full bg-background border border-border shadow-xs">
                        <span className="text-2xl">{}</span>
                        <img src={template.avatar} alt={"Avatar"}/>
                    </div>
                    <h3 className="font-medium line-clamp-2">{template.name}</h3>
                </div>
            </div>

            {/* Card content */}
            <div className="flex-1 p-5 overflow-y-auto">
                {template.prompt ? (
                    <p className="text-sm text-muted-foreground">{template.prompt}</p>
                ) : isBlank ? (
                    <div className="flex items-center justify-center h-full">
                        <Plus className="h-10 w-10 text-muted-foreground/50"/>
                    </div>
                ) : null}
            </div>

            {/* Use button shown on hover */}
            <div
                className={cn(
                    "absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-background via-background/95 to-transparent opacity-0 transition-opacity duration-200",
                    isHovered && "opacity-100",
                )}
            >
                <Button className="w-full transition-colors hover:bg-primary/90 hover:text-primary-foreground" size="lg"
                        onClick={() => {
                            chooseCopilotTemplate(template)
                        }}>
                    Use
                </Button>
            </div>
        </div>
    )
}

// Loading card skeleton
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