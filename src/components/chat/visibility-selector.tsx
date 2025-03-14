'use client';
import { Lock, Users, Earth} from "lucide-react"
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useVisibility } from '@/hooks/use-visibility';
import { useParams } from 'react-router-dom';
import ShareDialog from "@/components/sharev2";
import {RespChat} from "@/service/api";
import {AppVisibility} from "@/lib/constants/constants";
// import ShareDialog from "../share";

export type VisibilityType = 1 | 2 //  'private' | 'public';
export const VisibilityTypePrivate: VisibilityType = 1;
// export const VisibilityTypePublic: VisibilityType = 2;


export function VisibilitySelector({
  chatId,
  className,
  chatInfo,
}: {
  chatId: string;
  chatInfo: RespChat;
} & React.ComponentProps<typeof Button>) {
  const { appId } = useParams();
  const { visibility, handleVisibilityChange } = useVisibility(chatInfo.visibility, appId!, chatId);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className={cn(
          'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
          className,
        )}>
          <Button variant="outline" className="hidden md:flex md:px-2 md:h-[34px]">
              {(() => {
                  switch (visibility) {
                      case AppVisibility.Private:
                          return (
                            <><Lock className="h-4 w-4 mr-2" /> Only people invited</>
                          );
                      case AppVisibility.Internal:
                          return (
                            <><Users className="h-4 w-4 mr-2" />Everyone at Your Team  </>
                          );
                      case AppVisibility.Public:
                          return (
                            <><Earth className="h-4 w-4 mr-2" /> Everyone with the link</>
                          );
                      default:
                          return null;
                  }
              })()}
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <div className="p-0">
            <ShareDialog
              visibility={visibility}
              handleVisibilityChange={handleVisibilityChange}
              appId={appId!}
              chatId={chatId}
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
