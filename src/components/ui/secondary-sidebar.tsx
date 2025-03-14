"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SecondarySidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  mode?: "float" | "embed"
  isOpen?: boolean
  onClose?: () => void
}

const SecondarySidebar = React.forwardRef<HTMLDivElement, SecondarySidebarProps>(
  ({ className, mode = "float", isOpen = false, onClose, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "fixed top-0 right-0 h-full bg-background transition-all duration-300 ease-in-out",
          mode === "float" ? "w-64 shadow-lg" : "w-48",
          mode === "float" ? (isOpen ? "translate-x-0" : "translate-x-full") : "",
          className
        )}
        {...props}
      >
        {mode === "float" && (
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="p-4">{children}</div>
      </div>
    )
  }
)

SecondarySidebar.displayName = "SecondarySidebar"

export { SecondarySidebar }