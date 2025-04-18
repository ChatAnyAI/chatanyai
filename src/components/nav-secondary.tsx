"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronLeft, ChevronRight, Plus, Pin, PinOff } from "lucide-react"
import { NavChat } from "./nav-chat"
import { useAppSideBarHistoryListContext } from './app-sidebar';
import { useNewChat } from "@/hooks/use-new-chat"
import { useSidebar } from "./ui/sidebar"


export function NavSecondary() {
  const [isVisible, setIsVisible] = useState(false)
  const [isFloating, setIsFloating] = useState(true)
  const { activeMenu, toggleMenu } = useAppSideBarHistoryListContext();
  const newChat = useNewChat()
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed"
  const sidebarWidth = isMobile ? 0 : isCollapsed ? "var(--sidebar-width-icon)" : "var(--sidebar-width)"
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeMenu) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [activeMenu])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isVisible && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node)
      ) {
        toggleMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [isVisible, toggleMenu]);

  const toggleFloating = () => {
    setIsFloating(!isFloating)
  }

  return (
    <div
      ref={sidebarRef}
      className={cn(
        "bg-background transition-all duration-300 ease-in-out overflow-hidden flex flex-col",
        isVisible ? "w-[400px] opacity-100" : "w-0 opacity-0",
        isFloating ? "absolute top-0 bottom-0 shadow-lg z-10" : "border-r",
      )}
      style={{
        left: isFloating ? sidebarWidth : "0"
      }}
    >
      <div className="p-2 border-b flex justify-between items-center">
        <h2 className="text-sm font-medium pl-3">Chat List</h2>
        <div className="flex">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => toggleMenu(null)}>
                  {isVisible ? <ChevronLeft className="h-8 w-8 stroke-2" /> : <ChevronRight className="h-5 w-5 stroke-2" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isVisible ? "Close sidebar" : "Open sidebar"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleFloating}>
                  {isFloating ?
                    <PinOff className="h-6 w-6 stroke-2" /> :
                    <Pin className="h-6 w-6 stroke-2" />
                  }
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFloating ? "Pin sidebar" : "Unpin sidebar"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon"
                  className="relative overflow-hidden"
                  onClick={() => {
                    toggleMenu(null);
                    newChat();
                  }}
                >
                  <span className="absolute inset-0 rounded-md" style={{
                    animation: "breathingBg 2s ease-in-out infinite",
                    opacity: 0.2
                  }}></span>
                  <Plus className="h-8 w-8 stroke-3 relative z-10" />
                
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>New chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-1 space-y-1 w-full">
          <NavChat />
        </div>
      </ScrollArea>
    </div>
  )
}

