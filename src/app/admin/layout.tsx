import { SidebarToggleMobile } from "@/components/chat/sidebar-toggle";
import { SettingsLayout } from "./components/settings-layout"
import { AdminSidebar } from "./components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom";
import {useGlobalStore} from "@/store/globalStore";
import {UserRole} from "@/lib/constants/constants";

export default function AdminPage() {
    const user = useGlobalStore(({ user }) => user);
    return (
        <SettingsLayout>
            {user.roleId === UserRole.Admin && <SidebarProvider>
                <AdminSidebar />
                <div className="flex flex-1 gap-4 p-4 pt-0">
                    <SidebarToggleMobile />
                    <Outlet />
                </div>
            </SidebarProvider>}
        </SettingsLayout>
    )
}

