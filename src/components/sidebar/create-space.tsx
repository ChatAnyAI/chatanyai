import { Plus } from "lucide-react"
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarGroupAction } from "@/components/ui/sidebar"
import { AppType, AppIcons, AppLabelEnum } from "@/lib/constants/constants"
import CopilotCreation from "@/app/front/space/components/copilot-creation"
import { useCreateSpace } from "@/hooks/use-create-space";



export const documentTypes = [1, 2, 3].map((k) => {
    return {
        name: AppLabelEnum[k as unknown as AppType],
        icon: AppIcons[k as unknown as AppType].icon,
        color: AppIcons[k as unknown as AppType].color,
        type: +k as unknown as AppType,
    }
})

export function CreateSpace() {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedType, setSelectedType] = useState<AppType | null>(null)
    const {createSpace} = useCreateSpace()

    const handleItemClick = (type: AppType) => {
        if (+type !== AppType.Copilot) {
            createSpace(type)
            return
        }
        setSelectedType(type)
        setIsOpen(true)
    }

    const renderCreationComponent = () => {
        switch (selectedType) {
            // case AppType.Dataset:
            //     return <DatasetCreation />
            case AppType.Copilot:
                return <CopilotCreation
                    onClose={() => {
                        setSelectedType(null)
                        setIsOpen(false)
                    }}
                />
            default:
                return null
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarGroupAction data-name="create-icon" className="opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity">
                        <Plus className="h-4 w-4" />
                    </SidebarGroupAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" className="w-[280px]" sideOffset={8}>
                    {documentTypes.map((item) => (
                        <DropdownMenuItem
                            key={item.name}
                            className="flex items-center gap-3 py-3"
                            onClick={() => handleItemClick(item.type)}
                        >
                            <item.icon className="h-6 w-6" style={{ color: item.color }} />
                            <span className="flex-1">{item.name}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-6xl p-0 gap-0 h-[90vh] max-h-[90vh]">
                    {/* <DialogHeader>
                        <DialogTitle>Create {selectedType ? documentTypes.find(dt => dt.type === selectedType)?.name : ''}</DialogTitle>
                    </DialogHeader> */}
                    <div className="py-4 overflow-y-auto max-h-[90vh]">
                        {renderCreationComponent()}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

