"use client"

import { AppSidebar, AppSideBarHistoryListContextProvider } from "@/components/app-sidebar"
import { SidebarToggleMobile } from "@/components/chat/sidebar-toggle"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useChatStore } from "@/store/chatStore"
import { useEffect } from "react"
import { Outlet, useParams } from 'react-router-dom'

const Layout = () => {
    const fetchModels = useChatStore(state => state.fetchModels);
    const clearCurrentAppInfo = useChatStore(state => state.clearCurrentAppInfo);
    const fetchCurrentAppInfo = useChatStore(state => state.fetchCurrentAppInfo);

    useEffect(() => {
        fetchModels();
    }, []);

    const { appId } = useParams();

    useEffect(() => {
        if (!appId) {
            clearCurrentAppInfo();
            return;
        }
        fetchCurrentAppInfo(appId);
    }, [appId])

    return (
        <AppSideBarHistoryListContextProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarToggleMobile />
                <Outlet />
            </SidebarProvider>
        </AppSideBarHistoryListContextProvider>
    )
}

export default Layout
