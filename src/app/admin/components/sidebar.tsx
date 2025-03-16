import {
    Cloud,
    Monitor,
    Box,
    ArrowLeft,
    AppWindowMac,
    Copyright,
    Moon, Sun, Cog
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";
import type * as React from "react"
import { NavGroup, NavMenuItem } from "@/components/nav-group"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {TeamSwitcher} from "@/components/team-switcher";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {useGlobalStore} from "@/store/globalStore";
import {useTheme} from "next-themes";


const menuItems: NavMenuItem[] = [
    { icon: Monitor, name: "Overview", url: "/admin/overview" },
    { icon: AppWindowMac, name: "Application", url: "/admin/application" },
    { icon: Box, name: "Team Member", url: "/admin/teamMember" },
    { icon: Cloud, name: "Model Provider", url: "/admin/modelProvider" },
    // { icon: Keyboard, name: "Access Token", url: "#" },
    // { icon: Bell, name: "WebHook", url: "#" },
    { icon: Copyright, name: "License", url: "/admin/license" },
    // { icon: Settings, name: "General Setting", url: "/admin/setting" },
    {icon: Cog, name: "Preference", url: "/admin/preference"}
]

export function AdminSidebar() {
    const navigate = useNavigate();
    const user = useGlobalStore(state => state.user);
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex h-full">
            <Sidebar  collapsible="icon">
                <SidebarHeader>
                    <TeamSwitcher
                        currentTeam={user.currentTeam}
                        teams={user.teams}
                    />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                                className="fixed right-2 top-[6px]"
                            >
                                {theme === "light" ? (
                                    <Moon className="h-4 w-4" />
                                ) : (
                                    <Sun className="h-4 w-4" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            {theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                        </TooltipContent>
                    </Tooltip>
                </SidebarHeader>
                <SidebarContent>
                    <NavGroup items={menuItems} />
                </SidebarContent>
                <SidebarFooter className="cursor-pointer">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                onClick={() => {
                                    navigate("/")
                                }}
                            >
                                <div>
                                    <ArrowLeft className="size-4" />
                                    <span> Back to Desktop</span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </div>
    )
}