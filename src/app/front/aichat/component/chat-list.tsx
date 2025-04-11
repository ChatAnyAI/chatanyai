"use client"

import type React from "react"
import { MoreVertical, LockIcon } from "lucide-react"
import { AvatarUser, RespChannel } from "@/service/api"
import dayjs from "dayjs"
import { Link } from "react-router-dom"
import { UserAvatar } from "@/components/user-avatar";
import { ChatItemAction } from "@/components/chat/sidebar-history"

interface ChatListProps {
  channelList: RespChannel[]
  // onMenuOpen: (channelId: string, x: number, y: number) => void
}

export function ChatList({ channelList }: ChatListProps) {

  return (
    <div className="flex-1 overflow-auto p-4">
      {channelList.map((channel) => (
        <Link to={`c/${channel.channelId}`} className="no-underline">
          <div key={channel.channelId} className="border rounded-lg mb-4 overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b">
              <div className="flex items-center">
                <h3 className="font-medium">{channel.name}</h3>
                <LockIcon size={16} className="ml-2 text-gray-500" />
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <UserAvatar className="mr-2" user={channel.user as AvatarUser} />
                <span className="text-gray-600">{channel?.user?.name}</span>
                <span className="text-gray-400 text-sm ml-2">{dayjs.unix(channel.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
              </div>
              <ChatItemAction chat={channel} onDelete={() => { }} >
                <button className="p-1 rounded-full hover:bg-gray-100">
                  <MoreVertical size={16} className="text-gray-500" />
                </button>
              </ChatItemAction>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

