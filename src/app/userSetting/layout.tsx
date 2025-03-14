import { SidebarToggleMobile } from "@/components/chat/sidebar-toggle";
import { SettingsLayout } from "./components/settings-layout";
import { UserSettingSidebar } from "./components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function SettingsPage() {
    return (
        <SettingsLayout>
            <SidebarProvider>
                <UserSettingSidebar />
                <div className="flex flex-1 gap-4 p-4 pt-0">
                    <SidebarToggleMobile />
                    <Outlet />
                </div>
            </SidebarProvider>
        </SettingsLayout>
    );
}