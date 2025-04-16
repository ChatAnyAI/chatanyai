"use client"

import * as React from "react"
import { LifeBuoy } from "lucide-react"
import { WorkspaceGroup } from "./workspace-group"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useState } from "react";
import { NavSecondary } from "./nav-secondary"
import { useGlobalStore } from "@/store/globalStore"
import { useInitialFetchRobots } from "@/hooks/use-initial-fetch-robots"
import { NavHeader } from "@/components/nav-header";
import { TeamSwitcher } from "@/components/team-switcher";
import { useSpaceDrag } from "@/hooks/use-space-api"
import { AppType, UserRole } from "@/lib/constants/constants";
import { i18n } from "i18next"
import { useTranslation } from "react-i18next"
import { Notespace } from "./sidebar/note-space"

const data = (t: i18n['t']) => ({
  navSupport: [
    {
      name: t("sidebar.Admin Area"),
      url: "/admin/overview",
      icon: LifeBuoy,
    },
  ],
})


export type ActiveMenu = {
  appId: string;
  name: string;
  type?:AppType;
} | null;
export const AppSideBarHistoryListContext = React.createContext<{
  activeMenu: ActiveMenu;
  toggleMenu: (menu: ActiveMenu) => void;
}>({
  activeMenu: null,
  toggleMenu: () => { },
});

export const AppSideBarHistoryListContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null);
  const toggleMenu = (menu: ActiveMenu) => {
    setActiveMenu(prevMenu => prevMenu?.appId === menu?.appId ? null : menu);
  };
  return (
    <AppSideBarHistoryListContext.Provider value={{ activeMenu, toggleMenu }}>
      {children}
    </AppSideBarHistoryListContext.Provider>
  );
}

export const useAppSideBarHistoryListContext = () => {
  const context = React.useContext(AppSideBarHistoryListContext);
  if (!context) {
    throw new Error("useAppSideBarHistoryListContext must be used within a AppSideBarHistoryListContextProvider");
  }
  return context;
}


export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const user = useGlobalStore(state => state.user);
  const { appList } = useInitialFetchRobots();
  const { onDragEnd } = useSpaceDrag();
  const { t } = useTranslation();

  return (
    <div className="flex h-full">
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher
            currentTeam={user.currentTeam}
            teams={user.teams}
          />
        </SidebarHeader>
        <SidebarContent>
          <NavHeader />
          {/*<NavGroup items={favoriteAppList} groupName="Favorite" maked />*/}
          <WorkspaceGroup items={appList} groupName={"Chatspace"} draggable onDragEnd={onDragEnd} showAdd maked />
          <Notespace />
          {user.roleId === UserRole.Admin && <WorkspaceGroup items={data(t).navSupport} className="mt-auto" />}
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>
      <NavSecondary />
    </div>
  )
}

