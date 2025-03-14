"use client"

import {
    SidebarGroup,
    SidebarContent,
} from "@/components/ui/sidebar"
import { SidebarHistory } from '@/components/chat/sidebar-history';

export function NavChat() {
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden h-full">
            <SidebarContent>
                <SidebarHistory/>
            </SidebarContent>
        </SidebarGroup>
    )
}

