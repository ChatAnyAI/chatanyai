import {
    Monitor,
    ArrowLeft
} from "lucide-react"
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
import {useGlobalStore} from "@/store/globalStore";


const menuItems: NavMenuItem[] = [
    { icon: Monitor, name: "General", url: "/userSetting/general" },
]

export function UserSettingSidebar() {
    const navigate = useNavigate();
    const user = useGlobalStore(state => state.user);

    return (
        <div className="flex h-full">
            <Sidebar  collapsible="icon">
                <SidebarHeader>
                    <TeamSwitcher
                        currentTeam={user.currentTeam}
                        teams={user.teams}
                    />
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