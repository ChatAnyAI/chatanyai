"use client"

import * as React from "react"
import { ChevronsUpDown, Command, Plus } from "lucide-react"

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
import { TeamMemberDto } from "@/service/api";
import { ProductTypeEnum } from "@/lib/constants/constants";
import { SidebarToggle } from "@/components/chat/sidebar-toggle";

export function TeamSwitcher({ currentTeam, teams }: {
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
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <Logo />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{currentTeam.name}</span>
                                <span className="truncate text-xs">{ProductTypeEnum[currentTeam?.productId]}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">Teams</DropdownMenuLabel>
                        {teams.map((team, index) => (
                            <DropdownMenuItem key={team.name} onClick={() => setActiveTeam(team)} className="gap-2 p-2">
                                <div className="flex size-6 items-center justify-center rounded-sm border">
                                    {/* <Command className="size-4 shrink-0" /> */}
                                    <img className="size-4 shrink-0" src={'/logo.svg'} />
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

export const Logo = () => {
    return <svg width="22px" height="24px" viewBox="0 0 22 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <title>bot-message-square2 copy 2</title>
        <g id="page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="bot-message-square2-copy-2" transform="translate(1, 1)" stroke="currentColor">
                <polyline id="path" stroke-width="2" stroke-linecap="round" points="10 4 10 0 13.7175977 0"></polyline>
                <path d="M6,16 L2,20 L2,6 C2,4.8954305 2.8954305,4 4,4 L16,4 C17.1045695,4 18,4.8954305 18,6 L18,14 C18,15.1045695 17.1045695,16 16,16 L6,16 Z" id="path" stroke-width="2"></path>
                <line x1="0" y1="10" x2="2" y2="10" id="path" stroke-width="2" stroke-linecap="round"></line>
                <g id="group" transform="translate(6.1702, 8.3729)" stroke-linecap="round" stroke-width="1.8">
                    <line x1="1.96201552" y1="1.44845529" x2="-2.26709442e-18" y2="0.0662486846" id="path"></line>
                    <line x1="1.89935666" y1="1.53314281" x2="0.111873086" y2="3.1346741" id="path"></line>
                    <line x1="7.39828849" y1="0" x2="7.42520594" y2="2.99987924" id="path"></line>
                </g>
                <line x1="18" y1="10" x2="20" y2="10" id="path" stroke-width="2" stroke-linecap="round"></line>
            </g>
        </g>
    </svg>
}