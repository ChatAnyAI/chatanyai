"use client"

// import { lazy, Suspense } from 'react';
import {
    type LucideIcon,
    Plus,
    House, Share2, Folder
} from "lucide-react"
import { Collapsible } from "@/components/ui/collapsible"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { AppResp } from "@/service/api"
import { useAppSideBarHistoryListContext } from './app-sidebar';
import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { SharedDialog } from "@/components/sidebar/shared-dialog";
import RecentlyFiles from "@/components/sidebar/recently-files";
import { useTranslation } from "react-i18next"

export type NavMenuItem = Partial<Omit<AppResp, 'icon' | 'id'>> & {
    id?: string;
    url: string
    icon: LucideIcon | string
    isActive?: boolean
}

export function NavHeader({
    showAdd,
    groupName,
    groupRoute,
    className,
}: {
    groupRoute?: string;
    showAdd?: boolean,
    className?: string,
    groupName?: string,
}) {
    const location = useLocation();
    const navigator = useNavigate();
    const appSideBarContext = useAppSideBarHistoryListContext();
    const { toggleMenu: onClickMenu } = appSideBarContext;
    const [sharedDialogOpen, setSharedDialogOpen] = useState(false)
    const [recentFilesOpen, setRecentFilesOpen] = useState(false)
    const { t } = useTranslation();
    const items: NavMenuItem[] = [{
        id: "home",
        name: t("Home"),
        url: "/home",
        icon: House,
    }, {
        id: "files",
        name: t("Recently Files"),
        url: "#",
        icon: Folder
    }, {
        id: "shared",
        name: t("Shared with me"),
        url: "#",
        icon: Share2,
    }]

    return (
        <SidebarGroup className={cn(className)}>
            {
                groupName ?
                    <div className={cn("flex items-center justify-between pr-2 group", groupRoute ? "hover:bg-accent/50 hover:shadow-xs rounded-md cursor-pointer" : "")} onClick={() => {
                        if (!groupRoute) return;
                        onClickMenu(null);
                        navigator(groupRoute);
                    }}>
                        <SidebarGroupLabel>{groupName}</SidebarGroupLabel>

                        {
                            showAdd ?
                                <SidebarGroupAction
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => {
                                        navigator('/space/create');
                                    }}
                                >
                                    <Plus className="h-4 w-4" />
                                </SidebarGroupAction> : null
                        }

                    </div>
                    : null
            }

            <SidebarMenu>
                {items.map((item) => {
                    return <Collapsible key={item.name} asChild defaultOpen={item.isActive}>
                        <SidebarMenuItem data-name={item.id}>
                            <SidebarMenuButton isActive={new RegExp(item.url).test(location.pathname)}
                                asChild tooltip={item.name}
                                onClick={() => {
                                    onClickMenu(null);
                                }}>
                                {(() => {
                                    switch (item.id) {
                                        case 'files':
                                            return (
                                              <div className="cursor-pointer" onClick={() => {
                                                  setRecentFilesOpen(true)
                                              }}>
                                                  {typeof item.icon === 'string' ? <span>{item.icon}</span> : <item.icon />}
                                                  <span>{item.name}</span>
                                              </div>
                                            );
                                        case 'shared':
                                            return (
                                                <div className="cursor-pointer" onClick={() => {
                                                    setSharedDialogOpen(true)
                                                }}>
                                                    {typeof item.icon === 'string' ? <span>{item.icon}</span> : <item.icon />}
                                                    <span>{item.name}</span>
                                                </div>
                                            );
                                        default:
                                            return (
                                                <Link to={item.url}>
                                                    {typeof item.icon === 'string' ? <span>{item.icon}</span> : <item.icon />}
                                                    <span>{item.name}</span>
                                                </Link>
                                            );
                                    }
                                })()}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </Collapsible>
                })}
            </SidebarMenu>
            <SharedDialog isOpen={sharedDialogOpen} onClose={() => setSharedDialogOpen(false)} />
            <RecentlyFiles isOpen={recentFilesOpen} onClose={() => setRecentFilesOpen(false)} />
        </SidebarGroup>
    )
}

