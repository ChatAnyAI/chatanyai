"use client"

import type React from "react"

import { MoreVertical, LockIcon } from "lucide-react"
import type { RespChannel } from "@/service/api"
import dayjs from "dayjs"
import { Link } from "react-router-dom"
import { useTranslation } from 'react-i18next';

interface ChatListProps {
  chats: RespChannel[]
  onMenuOpen: (chatId: string, x: number, y: number) => void
}

export function ChatList({ chats, onMenuOpen }: ChatListProps) {
  const { t } = useTranslation();
  const handleMenuClick = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault()
    onMenuOpen(chatId, e.clientX, e.clientY)
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      {chats.map((chat) => (
        <Link to={`c/${chat.id}`} className="no-underline">
          <div key={chat.id} className="border rounded-lg mb-4 overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b">
              <div className="flex items-center">
                <h3 className="font-medium">{chat.title}</h3>
                <LockIcon size={16} className="ml-2 text-gray-500" />
              </div>
            </div>

            {/* <div className="p-4">
            <p className="text-gray-600">{chat.title}</p>
          </div> */}

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded bg-linear-to-br from-pink-400 to-orange-300 mr-2"></div>
                <span className="text-gray-600">{t('chat-list.username')}</span>
                <span className="text-gray-400 text-sm ml-2">{dayjs.unix(chat.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
              </div>
              <button onClick={(e) => handleMenuClick(e, chat.id)} className="p-1 rounded-full hover:bg-gray-100">
                <MoreVertical size={16} className="text-gray-500" />
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

