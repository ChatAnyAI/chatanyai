"use client"

import { Search, Shuffle } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import React from "react"
import config from "./emojiData"

interface EmojiConfig {
  groups: {
    [key: string]: {
      name: string
      emojis: Array<{
        emoji: string
        description: string
        category: string
        aliases: string[]
        tags: string[]
        unicode_version: string
        ios_version: string
        skin_tones?: []
      }>
    }
  }
}

interface EmojiPickerProps {
  onEmojiSelect?: (emoji: string) => void
  visible?: boolean
  onClose?: () => void
  config?: EmojiConfig
}

export default function EmojiPicker({ onEmojiSelect = () => {}, visible = true, onClose }: EmojiPickerProps) {
  const pickerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);

  const [searchQuery, setSearchQuery] = useState("")
  const [recentEmojis, setRecentEmojis] = useState<string[]>([])

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji)
    setRecentEmojis((prev) => {
      const newRecent = [emoji, ...prev.filter((e) => e !== emoji)].slice(0, 8)
      return newRecent
    })
  }

  const filterEmojis = (emojis: EmojiConfig["groups"][string]["emojis"]) => {
    if (!searchQuery) return emojis
    return emojis.filter(
      (emoji) =>
        emoji.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emoji.aliases.some((alias) => alias.toLowerCase().includes(searchQuery.toLowerCase())) ||
        emoji.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }

  if (!visible) return null;

  return (
    <div ref={pickerRef} className="w-[320px] rounded-lg border bg-background shadow-lg">
      <div className="p-2 border-b">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline" size="icon">
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[300px] p-2">
        {recentEmojis.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-medium">Recent</h3>
            <div className="grid grid-cols-8 gap-1">
              {recentEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiClick(emoji)}
                  className="p-1.5 hover:bg-accent rounded-md transition-colors"
                >
                  <span className="text-xl">{emoji}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {Object.entries(config.groups).map(([key, group]) => {
          const filteredEmojis = filterEmojis(group.emojis)
          if (filteredEmojis.length === 0) return null

          return (
            <div key={key} className="mb-4">
              <h3 className="mb-2 text-sm font-medium">{group.name}</h3>
              <div className="grid grid-cols-8 gap-1">
                {filteredEmojis.map((emoji) => (
                  <button
                    key={emoji.emoji}
                    onClick={() => handleEmojiClick(emoji.emoji)}
                    className="p-1.5 hover:bg-accent rounded-md transition-colors"
                    title={emoji.description}
                  >
                    <span className="text-xl">{emoji.emoji}</span>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </ScrollArea>
    </div>
  )
}

