import type { Message } from '@/lib/ai-sdk/ui-utils';
import { useCopyToClipboard } from 'usehooks-ts';
import { CopyIcon, ThumbUpIcon } from './icons';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { memo, useState } from 'react';
import { Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ApiCreateDoc, ApiDocRecent } from "@/service/api";
import { RouteEnum } from "@/lib/constants/constants";
import { useTranslation } from "react-i18next";
import { SendToRecentDoc } from "@/components/doc/send-to-recent-doc";

export function PureMessageActions({
  message,
  channelId,
  isLoading,
}: {
  channelId: string;
  message: Message;
  isLoading: boolean;
}) {
  const [_, copyToClipboard] = useCopyToClipboard();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false)
  if (isLoading) return null;
  if (message.role === 'user') return null;
  if (message.toolInvocations && message.toolInvocations.length > 0)
    return null;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground cursor-pointer"
              variant="outline"
              onClick={async () => {
                await copyToClipboard(message.content as string);
                toast({
                  title: 'Copied to clipboard!',
                })
              }}
            >
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground pointer-events-auto! cursor-pointer"
              // disabled={vote?.isUpvoted}
              variant="outline"
              onClick={async () => {
                setIsOpen(true)
                // setContent(message.content as string)

                // const messageId = getMessageIdFromAnnotations(message);
                //
                // const upvote = fetch('/api/vote', {
                //   method: 'PATCH',
                //   body: JSON.stringify({
                //     channelId,
                //     messageId,
                //     type: 'up',
                //   }),
                // });

                // toast.promise("upvote", {
                //   loading: 'Upvoting Response...',
                //   success: () => {
                //     // mutate<Array<Vote>>(
                //     //   `/api/vote?channelId=${channelId}`,
                //     //   (currentVotes) => {
                //     //     if (!currentVotes) return [];
                //     //
                //     //     const votesWithoutCurrent = currentVotes.filter(
                //     //       (vote) => vote.messageId !== message.id,
                //     //     );
                //     //
                //     //     return [
                //     //       ...votesWithoutCurrent,
                //     //       {
                //     //         channelId,
                //     //         messageId: message.id,
                //     //         isUpvoted: true,
                //     //       },
                //     //     ];
                //     //   },
                //     //   { revalidate: false },
                //     // );
                //
                //     return 'Send to Doc';
                //   },
                //   error: 'Failed to upvote response.',
                // });
              }}
            >
              <Send />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Send to recent Doc</TooltipContent>
        </Tooltip>

        {/*<Tooltip>*/}
        {/*  <TooltipTrigger asChild>*/}
        {/*    <Button*/}
        {/*      className="py-1 px-2 h-fit text-muted-foreground pointer-events-auto!"*/}
        {/*      variant="outline"*/}
        {/*      disabled={vote && !vote.isUpvoted}*/}
        {/*      onClick={async () => {*/}
        {/*        const messageId = getMessageIdFromAnnotations(message);*/}

        {/*        const downvote = fetch('/api/vote', {*/}
        {/*          method: 'PATCH',*/}
        {/*          body: JSON.stringify({*/}
        {/*            channelId,*/}
        {/*            messageId,*/}
        {/*            type: 'down',*/}
        {/*          }),*/}
        {/*        });*/}

        {/*        toast.promise(downvote, {*/}
        {/*          loading: 'Downvoting Response...',*/}
        {/*          success: () => {*/}
        {/*            mutate<Array<Vote>>(*/}
        {/*              `/api/vote?channelId=${channelId}`,*/}
        {/*              (currentVotes) => {*/}
        {/*                if (!currentVotes) return [];*/}

        {/*                const votesWithoutCurrent = currentVotes.filter(*/}
        {/*                  (vote) => vote.messageId !== message.id,*/}
        {/*                );*/}

        {/*                return [*/}
        {/*                  ...votesWithoutCurrent,*/}
        {/*                  {*/}
        {/*                    channelId,*/}
        {/*                    messageId: message.id,*/}
        {/*                    isUpvoted: false,*/}
        {/*                  },*/}
        {/*                ];*/}
        {/*              },*/}
        {/*              { revalidate: false },*/}
        {/*            );*/}

        {/*            return 'Downvoted Response!';*/}
        {/*          },*/}
        {/*          error: 'Failed to downvote response.',*/}
        {/*        });*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      <ThumbDownIcon />*/}
        {/*    </Button>*/}
        {/*  </TooltipTrigger>*/}
        {/*  <TooltipContent>Downvote Response</TooltipContent>*/}
        {/*</Tooltip> */}
      </div>
      <SendToRecentDoc
        referChannelId={channelId}
        referAnchorId={message.id}
        referContent={message.content}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </TooltipProvider>
  );
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.content !== nextProps.message.content) return false;

    return true;
  },
);
