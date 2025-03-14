"use client"

import { useState } from "react"
import { ChevronDown, Check } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type AccessLevel = "full" | "edit" | "edit-content" | "comment" | "view"

interface AccessDropdownProps {
    className?: string
    buttonClassName?: string
}

export function AccessDropdown({ className = "", buttonClassName = "" }: AccessDropdownProps) {
    const [accessLevel, setAccessLevel] = useState<AccessLevel>("full")

    const getAccessLevelText = (level: AccessLevel) => {
        switch (level) {
            case "full":
                return "Full access"
            case "edit":
                return "Can edit"
            case "edit-content":
                return "Can edit content"
            case "comment":
                return "Can comment"
            case "view":
                return "Can view"
            default:
                return "Full access"
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={`flex items-center text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-sm ${buttonClassName}`}
            >
                <span>{getAccessLevelText(accessLevel)}</span>
                <ChevronDown className="ml-1 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`w-[280px] ${className}`}>
                <div className="py-1.5">
                    <DropdownMenuItem
                        className="flex items-start px-3 py-1.5 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setAccessLevel("full")}
                    >
                        <div className="flex-1">
                            <div className="flex items-center">
                                <span className="font-medium text-sm">Full access</span>
                                {accessLevel === "full" && <Check className="h-3.5 w-3.5 ml-1.5" />}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">Edit, suggest, comment, and share with others</p>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="flex items-start px-3 py-1.5 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setAccessLevel("edit")}
                    >
                        <div className="flex-1">
                            <div className="flex items-center">
                                <span className="font-medium text-sm">Can edit</span>
                                <span className="ml-1.5 text-xs bg-blue-100 text-blue-600 px-1 py-0.5 rounded text-[10px]">PLUS</span>
                                {accessLevel === "edit" && <Check className="h-3.5 w-3.5 ml-1.5" />}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">Edit, suggest, and comment</p>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="flex items-start px-3 py-1.5 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setAccessLevel("edit-content")}
                    >
                        <div className="flex-1">
                            <div className="flex items-center">
                                <span className="font-medium text-sm">Can edit content</span>
                                <span className="ml-1.5 text-xs bg-blue-100 text-blue-600 px-1 py-0.5 rounded text-[10px]">PLUS</span>
                                {accessLevel === "edit-content" && <Check className="h-3.5 w-3.5 ml-1.5" />}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Can edit content, but can't edit the database's views or structure.
                            </p>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="flex items-start px-3 py-1.5 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setAccessLevel("comment")}
                    >
                        <div className="flex-1">
                            <div className="flex items-center">
                                <span className="font-medium text-sm">Can comment</span>
                                {accessLevel === "comment" && <Check className="h-3.5 w-3.5 ml-1.5" />}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">Suggest and comment</p>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="flex items-start px-3 py-1.5 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setAccessLevel("view")}
                    >
                        <div className="flex items-center">
                            <span className="font-medium text-sm">Can view</span>
                            {accessLevel === "view" && <Check className="h-3.5 w-3.5 ml-1.5" />}
                        </div>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

