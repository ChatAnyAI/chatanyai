"use client"

import { useState } from "react"
import { ChevronDown, Check } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { Switch } from "@/components/ui/switch"

type AccessLevel = "full" | "edit" | "edit-content" | "comment" | "view"

export function SingleUserPermissionDropdown({ className = "", onDelete }: { className?: string; onDelete?: () => void }) {
    const [accessLevel, setAccessLevel] = useState<AccessLevel>("view")
    // const [hideInSearch, setHideInSearch] = useState(false)

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
                className={`flex items-center text-gray-500 hover:bg-gray-50 rounded px-1.5 text-sm ${className}`}
            >
                <span>{getAccessLevelText(accessLevel)}</span>
                <ChevronDown className="ml-0.5 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px]">
                <div className="py-1.5">
                    {/* <DropdownMenuItem
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

        

                <DropdownMenuSeparator />

                <div className="px-3 py-1.5">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Hide in search</span>
                    <Switch checked={hideInSearch} onCheckedChange={setHideInSearch} className="scale-75" />
                </div>
                    </div> */}

                    <DropdownMenuItem
                        className="flex items-start px-3 py-1.5 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setAccessLevel("view")}
                    >
                        <div className="flex items-center">
                            <span className="font-medium text-sm">Can view</span>
                            {accessLevel === "view" && <Check className="h-3.5 w-3.5 ml-1.5" />}
                        </div>
                    </DropdownMenuItem>
                    {
                        onDelete ?
                            <>
                                <DropdownMenuSeparator />

                                <DropdownMenuItem className="px-3 py-1.5 text-red-600 hover:bg-red-50 cursor-pointer text-sm" onClick={onDelete}>
                                    Remove
                                </DropdownMenuItem>
                            </> : null
                    }
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

