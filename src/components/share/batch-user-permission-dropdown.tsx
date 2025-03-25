"use client"
import {Check, ChevronDown} from "lucide-react"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {PermissionType, PermissionTypeEnum} from "@/lib/constants/constants";

interface AccessDropdownProps {
    permission: PermissionType
    setPermission: (permission: PermissionType) => void
    className?: string
    buttonClassName?: string
}

export function BatchUserPermissionDropdown({ permission, setPermission, className = "", buttonClassName = "" }: AccessDropdownProps) {
    const getAccessLevelText = (level: PermissionType): string => {
        return PermissionTypeEnum[level]
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={`flex items-center text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-sm ${buttonClassName}`}
            >
                <span>{getAccessLevelText(permission)}</span>
                <ChevronDown className="ml-1 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`w-[280px] ${className}`}>
                <div className="py-1.5">
                    <DropdownMenuItem
                        className="flex items-start px-3 py-1.5 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setPermission(PermissionType.Full)}
                    >
                        <div className="flex-1">
                            <div className="flex items-center">
                                <span className="font-medium text-sm">Full access</span>
                                {permission === PermissionType.Full && <Check className="h-3.5 w-3.5 ml-1.5" />}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">Edit, setting, comment, and share with others</p>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="flex items-start px-3 py-1.5 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setPermission(PermissionType.Edit)}
                    >
                        <div className="flex-1">
                            <div className="flex items-center">
                                <span className="font-medium text-sm">Can edit</span>
                                <span className="ml-1.5 text-xs bg-blue-100 text-blue-600 px-1 py-0.5 rounded text-[10px]">PLUS</span>
                                {permission === PermissionType.Edit && <Check className="h-3.5 w-3.5 ml-1.5" />}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">Edit,  and comment</p>
                        </div>
                    </DropdownMenuItem>
                    {/*<DropdownMenuItem*/}
                    {/*    className="flex items-start px-3 py-1.5 hover:bg-gray-50 cursor-pointer"*/}
                    {/*    onClick={() => setAccessLevel("comment")}*/}
                    {/*>*/}
                    {/*    <div className="flex-1">*/}
                    {/*        <div className="flex items-center">*/}
                    {/*            <span className="font-medium text-sm">Can comment</span>*/}
                    {/*            {accessLevel === "comment" && <Check className="h-3.5 w-3.5 ml-1.5" />}*/}
                    {/*        </div>*/}
                    {/*        <p className="text-xs text-gray-500 mt-0.5">Comment</p>*/}
                    {/*    </div>*/}
                    {/*</DropdownMenuItem>*/}

                    <DropdownMenuItem
                        className="flex items-start px-3 py-1.5 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setPermission(PermissionType.Read)}
                    >
                        <div className="flex items-center">
                            <span className="font-medium text-sm">Can view</span>
                            {permission === PermissionType.Read && <Check className="h-3.5 w-3.5 ml-1.5" />}
                        </div>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

