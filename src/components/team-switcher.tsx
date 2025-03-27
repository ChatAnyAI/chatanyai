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
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
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
    return <svg width="22px" height="22px" viewBox="0 0 22 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <title>bot-message-square 2备份</title>
        <g id="页面-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
            <g id="bot-message-square" transform="translate(1.000000, 1.000000)" stroke="currentColor">
                <polyline id="路径" strokeWidth="2" points="10 4 10 0 13.7175977 0"></polyline>
                <path d="M6,16 L2,20 L2,6 C2,4.8954305 2.8954305,4 4,4 L16,4 C17.1045695,4 18,4.8954305 18,6 L18,14 C18,15.1045695 17.1045695,16 16,16 L6,16 Z" id="路径" strokeWidth="2"></path>
                <line x1="0" y1="10" x2="2" y2="10" id="路径" strokeWidth="2"></line>
                <g id="编组" transform="translate(5.716407, 8.350780)" strokeWidth="1.8">
                    <line x1="1.72529476" y1="0.0173303659" x2="0.193896086" y2="2.82710226" id="路径"></line>
                    <line x1="1.72529476" y1="0.0173303659" x2="3.14662833" y2="2.88435162" id="路径"></line>
                    <line x1="7.81480194" y1="0.0273741613" x2="7.81480194" y2="2.62737416" id="路径"></line>
                </g>
                <line x1="18" y1="10" x2="20" y2="10" id="路径" strokeWidth="2"></line>
            </g>
        </g>
    </svg>
}