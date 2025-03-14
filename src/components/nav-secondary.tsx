"use client"

import { useState, useEffect } from "react"
import { NavChat } from "./nav-chat"
import { useAppSideBarHistoryListContext } from './app-sidebar';
import { SidebarDialog, SidebarOverlay } from "./sidebar/sidebar-dialog"
import React from "react"


export function NavSecondary() {
  const [isVisible, setIsVisible] = useState(false)
  const { activeMenu, toggleMenu } = useAppSideBarHistoryListContext();

  useEffect(() => {
    if (activeMenu) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [activeMenu])

  const onClose = () => {
    toggleMenu(null)
  }

  const checkSidebarClick = React.useCallback((target: HTMLElement) => {
    return target.closest('[data-marked="true"]') === null;
  }, []);

  if (!isVisible) return null

  return (
    <>
      <SidebarOverlay onClick={onClose} />
      <SidebarDialog
        title="Chat list"
        onClose={onClose}
        isSidebarClick={checkSidebarClick}
      >
        <NavChat />
      </SidebarDialog>
    </>
  )
}

