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
import {RespChannel} from "@/service/api";
import {AppVisibility, AppVisibilityEnum} from "@/lib/constants/constants";
import {usePermission} from "@/hooks/use-permission";


export function VisibilitySelector({
  chatId,
  className,
  chatInfo,
}: {
  chatId: string;
  chatInfo: RespChannel;
} & React.ComponentProps<typeof Button>) {
  const { appId } = useParams();
  const { visibility, handleVisibilityChange } = useVisibility(chatInfo.visibility, appId!, chatId);
  const { permission, handlePermissionChange } = usePermission(chatInfo.permission,visibility, appId!, chatId);

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
                            <><Lock className="h-4 w-4 mr-2" /> {AppVisibilityEnum[visibility]} </>
                          );
                      case AppVisibility.Internal:
                          return (
                            <><Users className="h-4 w-4 mr-2" /> {AppVisibilityEnum[visibility]}  </>
                          );
                      case AppVisibility.Public:
                          return (
                            <><Earth className="h-4 w-4 mr-2" />  {AppVisibilityEnum[visibility]}</>
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
              className={"w-[400px]"}
              visibility={visibility}
              permission={permission}
              handleVisibilityChange={handleVisibilityChange}
              handlePermissionChange={handlePermissionChange}
              appId={appId!}
              chatId={chatId}
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
