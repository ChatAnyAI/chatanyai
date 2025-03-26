"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus } from "lucide-react"
import { RespModelProviderInfo} from "@/service/admin";
import {cn} from "@/lib/utils";


type ProviderListProps = {
    modelProvider: string
    providerList: RespModelProviderInfo[]
    setModelProvider: (modelProvider: string) => void
}

export function ProviderList(props: ProviderListProps) {
    const { modelProvider, providerList } = props

    return (
        <div className="flex-1 max-w-xl border-r">
            <div className="p-4 space-y-2">
                {providerList.map((provider) => (
                    <div
                        key={provider.id}
                        className={cn("flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer",
                            "hover:text-accent-foreground",
                            modelProvider === provider.name && "bg-accent text-accent-foreground",
                        )}
                        onClick={() => props.setModelProvider(provider.name)}
                    >
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={provider.icon} alt={provider.name}/>
                                <AvatarFallback className="bg-muted">{provider.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{provider.name}</span>
                        </div>
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                provider.enabled === 1
                                    ? "bg-blue-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                                    : "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20"
                            }`}
                        >{provider.enabled === 1 ? 'Enabled': 'Disabled'}</span>


                    </div>
                ))}
                {/* <Button variant="outline" className="w-full mt-4">
                    <Plus className="w-4 h-4 mr-2"/>
                    Add
                </Button> */}
            </div>
        </div>
    )
}

