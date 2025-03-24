'use client';

import { SparklesIcon } from './icons';
import { MyUserAvatar, UserAvatar as UAvatar } from "@/components/user-avatar";
import {AvatarUser, UserProfile} from '@/service/api';

export interface MessageAvatarProps {
  role: string;
  name?: string;
}

export const MessageAssistantAvatar = ({ role, name }: MessageAvatarProps) => {
  if (role !== 'assistant') return null;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
        {name ? (
          <span className="text-sm font-medium">{name.charAt(0)}</span>
        ) : (
          <div className="translate-y-px">
            <SparklesIcon size={14} />
          </div>
        )}
      </div>
      {name && <span className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[3em]">{name}</span>}
    </div>
  );
};

export function UserAvatar({ user, role }: { user: { name: string; avatar: string }; role: string }) {

  if (role !== 'user') return null;
  if (!user.name) return <MyUserAvatar />;
  return <UAvatar user={user as AvatarUser} />;
}