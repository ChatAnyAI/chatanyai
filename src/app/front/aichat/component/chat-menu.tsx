"use client"

import { Share, Edit2, Star, Trash } from "lucide-react"
import { useEffect, useRef } from "react"

interface ChatMenuProps {
  position: { x: number; y: number }
  onClose: () => void
  onDelete: () => void
}

export function ChatMenu({ position, onClose, onDelete }: ChatMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-lg border z-50 w-64"
      style={{
        top: position.y,
        left: position.x,
        transform: "translateX(-90%)",
      }}
    >
      <div className="py-1">
        <button className="w-full text-left px-4 py-2 flex items-center hover:bg-gray-100">
          <Share size={18} className="mr-3 text-gray-600" />
          <span>Share</span>
        </button>
        <button className="w-full text-left px-4 py-2 flex items-center hover:bg-gray-100">
          <Edit2 size={18} className="mr-3 text-gray-600" />
          <span>Rename</span>
        </button>
        <button className="w-full text-left px-4 py-2 flex items-center hover:bg-gray-100">
          <Star size={18} className="mr-3 text-gray-600" />
          <span>Favorite</span>
        </button>
        <button
          onClick={onDelete}
          className="w-full text-left px-4 py-2 flex items-center hover:bg-gray-100 text-red-600"
        >
          <Trash size={18} className="mr-3" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  )
}

