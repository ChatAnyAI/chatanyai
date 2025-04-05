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
import { WorkspaceGroup, NavMenuItem } from "@/components/workspace-group"
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
import {useTheme} from "next-themes";
import {useTranslation} from "react-i18next";
import { i18n } from "i18next";


const menuItems = (t: i18n["t"]): NavMenuItem[] => ([
    { icon: Monitor, name: t("admin-sidebar.Overview"), url: "/admin/overview" },
    { icon: AppWindowMac, name: t("admin-sidebar.Application"), url: "/admin/application" },
    { icon: Box, name: t("admin-sidebar.Team Member"), url: "/admin/teamMember" },
    { icon: Cloud, name: t("admin-sidebar.Model Provider"), url: "/admin/modelProvider" },
    // { icon: Keyboard, name: t("admin-sidebar.Access Token"), url: "#" },
    // { icon: Bell, name: t("admin-sidebar.WebHook"), url: "#" },
    { icon: Copyright, name: t("admin-sidebar.License"), url: "/admin/license" },
    // { icon: Settings, name: t("admin-sidebar.General Setting"), url: "/admin/setting" },
    { icon: Cog, name: t("admin-sidebar.Preference"), url: "/admin/preference" }
])

export function AdminSidebar() {
    const navigate = useNavigate();
    const user = useGlobalStore(state => state.user);
    const { theme, setTheme } = useTheme();
    const { t } = useTranslation();

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
                    <WorkspaceGroup items={menuItems(t)} />
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
                                    <span> {t('admin-components-sidebar.Back to Desktop')}</span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </div>
    )
}