"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, X, FileText, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCreateSpace } from "@/hooks/use-create-space"
import { AppType } from "@/lib/constants/constants"
import { ApiTemplateList, Template } from '@/service/api'
import useSWR from "swr"
import { Icon } from "@/components/nav-group"

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

export default function TemplateDialog({ onClose = () => { } }: TemplateDialogProps) {
    const [activeCategory, setActiveCategory] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredTemplates, setFilteredTemplates] = useState([] as Template[])
    const [categories, setCategories] = useState([] as Category[])
    const { createSpace, chooseCopilotTemplate } = useCreateSpace()

    const { data: templateData } = useSWR('ApiTemplateList', ApiTemplateList);

    useEffect(() => {
        setFilteredTemplates(templateData!)
        // Extract unique categories from templateData
        if (templateData) {
            // Extract unique groups from templates
            const uniqueGroups = Array.from(new Set(templateData.map(template => template.group)));

            // Create category objects from unique groups
            const categoriesFromTemplates = uniqueGroups.map(group => ({
                id: group,
                name: group.charAt(0).toUpperCase() + group.slice(1), // Capitalize first letter
                icon: null
            }));

            // Set categories state
            setCategories(categoriesFromTemplates);
            setActiveCategory(categoriesFromTemplates[0].id);
        }
    }, [templateData])

    // Get active category name
    const getActiveCategoryName = () => {
        const category = categories.find((cat) => cat.id === activeCategory)
        return category ? category.name : ""
    }

    // Filter templates based on active category and search query
    useEffect(() => {
        let filtered = templateData

        // Filter by category if not searching
        if (searchQuery === "") {
            filtered = templateData?.filter((template) => template.group === activeCategory)
        } else {
            // Filter by search query across all categories
            filtered = templateData?.filter((template) => template.name.toLowerCase().includes(searchQuery.toLowerCase()))
        }

        setFilteredTemplates(filtered || [])
    }, [activeCategory, searchQuery])

    // Handle category click
    const handleCategoryClick = (categoryId: string) => {
        setActiveCategory(categoryId)
        setSearchQuery("") // Clear search when changing category
    }

    // Handle search input
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    // Clear search
    const clearSearch = () => {
        setSearchQuery("")
    }

    const onCreateSpace = async (data: Template | null) => {

        if (!data) {
            await createSpace(AppType.Copilot);
        } else {
            await chooseCopilotTemplate(data.id)
        }
        onClose()

    }

    return (
        // <Dialog open={open} onOpenChange={onOpenChange}>
        //     <DialogContent className="max-w-6xl p-0 gap-0 h-[90vh] max-h-[90vh]">
        <div className="flex flex-col h-full max-h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b shrink-0">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-lg">New Copilot</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-[320px]">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search templates" className="pl-8 pr-8" value={searchQuery} onChange={handleSearchChange} />
                        {searchQuery && (
                            <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-6 w-6" onClick={clearSearch}>
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    {/* <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button> */}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-[200px] border-r shrink-0">
                    <ScrollArea className="h-full">
                        <div className="p-2">
                            {categories.map((category) =>
                                category.isDivider ? (
                                    <div key={category.id} className="my-2 border-t" />
                                ) : (
                                    <div
                                        key={category.id}
                                        className={`py-2 px-3 text-sm font-medium rounded-md cursor-pointer ${activeCategory === category.id
                                            ? "bg-slate-100 text-blue-500"
                                            : "hover:bg-slate-50 text-gray-700"
                                            }`}
                                        onClick={() => handleCategoryClick(category.id)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {category.icon}
                                            {category.name}
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <div className="p-4">
                            {searchQuery ? (
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium mb-2">Search results: "{searchQuery}"</h3>
                                    {filteredTemplates.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">No matching templates found</div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center mb-4">
                                    <Badge
                                        variant="outline"
                                        className="bg-slate-200 text-slate-700 h-6 w-6 p-0 flex items-center justify-center rounded-sm mr-2"
                                    >
                                        <FileText className="h-4 w-4" />
                                    </Badge>
                                    <div className="text-blue-500 font-medium">{getActiveCategoryName()}</div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Empty Template Card */}
                                <div className="border rounded-md overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group bg-white relative" onClick={() => onCreateSpace(null)}>
                                    <div className="aspect-[4/3] relative flex flex-col items-center justify-center">
                                        <div className="w-8 h-8 mb-3 flex items-center justify-center text-blue-500">
                                            <Plus className="w-8 h-8" />
                                        </div>
                                        <span className="text-sm text-gray-600">Create a blank table</span>
                                    </div>

                                    {/* Hover Button - More prominent and appears from bottom */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white py-2 px-4 flex justify-center items-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-in-out">
                                        <Button variant="ghost" size="sm" className="text-white border-white">
                                            Use
                                        </Button>
                                    </div>
                                </div>

                                {/* Existing Templates */}
                                {filteredTemplates?.map((template) => (
                                    <div
                                        key={template.id}
                                        className="border rounded-md overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group bg-white relative"
                                        onClick={() => onCreateSpace(template)}
                                    >
                                        <div className="aspect-[4/3] relative">
                                            {/* Header with icon and title */}
                                            <div className=" top-0 left-0 right-0 p-4 flex items-center gap-2">
                                                <div className="bg-white-500 text-white p-1 rounded-sm">
                                                    <Icon type={template.type} icon={template.icon} />
                                                </div>
                                                <div className="text-sm font-medium flex-1 truncate">{template.name}</div>
                                            </div>

                                            {/* Content */}
                                            <div className="px-4 max-h-24 min-h-16 overflow-y-auto">
                                                <div className="text-xs text-gray-500">
                                                    {[template.copilotPrompt].map((line, index) => (
                                                        <p key={index}>{line}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="p-2 bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
                                            <span>{formatNumber(99)}+ people already used</span>
                                        </div>

                                        {/* Hover Button - More prominent and appears from bottom */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white py-2 px-4 flex justify-center items-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-in-out">
                                            <Button variant="ghost" size="sm" className="text-white border-white">
                                                Use
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* )} */}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
        //     </DialogContent>
        // </Dialog>
    )
}

