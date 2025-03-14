"use client"

import * as React from "react"
import {ChevronsUpDown, Command, Plus} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import {TeamMemberDto} from "@/service/api";
import {ProductTypeEnum} from "@/lib/constants/constants";
import {SidebarToggle} from "@/components/chat/sidebar-toggle";

export function TeamSwitcher({currentTeam, teams}: {
    currentTeam: TeamMemberDto,
    teams: TeamMemberDto[]
}) {
    const { isMobile } = useSidebar()
    const [_, setActiveTeam] = React.useState(teams?.[0])


    if (!teams || teams.length === 0) {
        return <div></div>
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem className="flex items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <Command className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{currentTeam.name}</span>
                                <span className="truncate text-xs">{ProductTypeEnum[currentTeam?.productId]}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">Teams</DropdownMenuLabel>
                        {teams.map((team, index) => (
                            <DropdownMenuItem key={team.name} onClick={() => setActiveTeam(team)} className="gap-2 p-2">
                                <div className="flex size-6 items-center justify-center rounded-sm border">
                                    <Command className="size-4 shrink-0" />
                                </div>
                                {team.name}
                                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                <Plus className="size-4" />
                            </div>
                            <div className="font-medium text-muted-foreground">Add team</div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <SidebarToggle />
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

