"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSidebar } from "../ui/sidebar"
import { useTranslation } from "react-i18next"

const SidebarDialogContext = React.createContext<{ handleClose: () => void }>({
  handleClose: () => { }
});

export function useSidebarDialog() {
  return React.useContext(SidebarDialogContext)
}

const SidebarProvider = SidebarDialogContext.Provider

interface SidebarDialogProps {
  title: string
  onClose: () => void
  children: React.ReactNode
  isSidebarClick?: (target: HTMLElement) => boolean
}

export function SidebarDialog({
  title,
  onClose,
  children,
  isSidebarClick = () => false
}: SidebarDialogProps) {
  const { t } = useTranslation()
  const dialogRef = React.useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = React.useState(false)
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed"
  const sidebarWidth = isMobile ? 0 : isCollapsed ? "var(--sidebar-width-icon)" : "var(--sidebar-width)"

  // Handle close animation
  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300) // Animation duration
  }

  // Set initial display animation
  React.useEffect(() => {
    // Delay setting to ensure render process is complete
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 10)
    return () => clearTimeout(timer)
  }, [])

  // Add click event listener to automatically close dialog when clicking sidebar
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if clicked element is inside dialog
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        // Check if clicked element is inside sidebar
        const target = event.target as HTMLElement
        if (isSidebarClick(target)) {
          handleClose()
        }
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside)

    // Cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isSidebarClick])

  return (
    <div
      ref={dialogRef}
      className="w-[400px] fixed top-0 bottom-0 z-50 h-full border-r bg-background shadow-lg overflow-hidden max-w-[80vw]"
      style={{
        left: sidebarWidth,
        // maxWidth: isVisible ? '450px' : '0',
        opacity: isVisible ? 1 : 0,
        transition: 'all 300ms ease-in-out',
        zIndex: isMobile ? 999 : 49,
      }}
    >
      <div className="flex h-16 items-center justify-between border-b px-6 w-full">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">{t('sidebar-dialog.Close')}</span>
        </Button>
      </div>

      <div className="w-full">
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <SidebarProvider value={{ handleClose }}>
            {children}
          </SidebarProvider>
        </ScrollArea>
      </div>
    </div>
  )
}

interface SidebarOverlayProps {
  onClick: () => void
}

export function SidebarOverlay({ onClick }: SidebarOverlayProps) {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed"
  const sidebarWidth = isMobile ? 0 : isCollapsed ? "var(--sidebar-width-icon)" : "var(--sidebar-width)"
  return (
    <div
      className="fixed top-0 bottom-0 right-0 z-40 bg-black/10 backdrop-blur-xs"
      style={{ left: sidebarWidth, zIndex: isMobile ? 998 : 48, }}
      onClick={onClick}
    />
  )
}
