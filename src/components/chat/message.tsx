'use client';

import type { ChatRequestOptions, Message } from 'ai';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useMemo, useState } from 'react';

import { PencilEditIcon } from './icons';
import { MessageAssistantAvatar, UserAvatar } from './message-avatar';
import { Markdown } from './markdown';
import { MessageActions } from './message-actions';
import { PreviewAttachment } from './preview-attachment';
import equal from 'fast-deep-equal';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { MessageEditor } from './message-editor';
import { useRightSetting } from '@/app/front/aichat/component/rightSetting';
import { SparklesIcon } from 'lucide-react';
import { ErrorMessage } from './error-message';

const PurePreviewMessage = ({
  channelId,
  message,
  isLoading,
  setMessages,
  reload,
  isReadonly,
  showEdit,
}: {
  channelId: string;
  message: Message;
  isLoading: boolean;
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[]),
  ) => void;
  reload: (
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  isReadonly: boolean;
  showEdit: boolean;
}) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const { settingData } = useRightSetting();
  const { showDivider, useSerifFont, messageFontSize, showTokens, } = settingData;

  const avatarInfo = useMemo(() => {
    return (message?.annotations as Array<{ type: number; data: { name: string; avatar?: string } }>)
      ?.find((a) => a.type === 2)?.data;
  }, [message.annotations]);

  const errorMsg = useMemo(() => {
    const annotation = (message?.annotations as Array<{ type: number; data: { code: number; msg: string } }>)
      ?.find((a: any) => a.type === 3);
    const data = typeof annotation === 'object' && annotation ? annotation.data : undefined;
    if (data) {
      return data;
    }
    return null;
  }, [message.annotations]);

  const anchorId = useMemo(() => {
    const annotation = (message?.annotations as Array<{ type: number; data: number }>)
      ?.find((a: any) => a.type === 4);
    const data = typeof annotation === 'object' && annotation ? annotation.data : undefined;
    if (data) {
      return data;
    }
    return message.id;
  }, [message.annotations, message.id]);


  return (
    <AnimatePresence>
      <motion.div
        className={cn("w-full mx-auto max-w-3xl px-4 group/message", {
          "border-b border-border pb-6": showDivider
        })}
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          id={`anchorId=${anchorId}`}
          className={cn(
            'flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl',
            {
              'w-full': mode === 'edit',
              'group-data-[role=user]/message:w-fit': mode !== 'edit',
            },
          )}
        >

          <MessageAssistantAvatar role={message.role} name={avatarInfo?.name} />

          <div className="flex flex-col gap-2 w-full">
            {message.experimental_attachments && (
              <div className="flex flex-row justify-end gap-2">
                {message.experimental_attachments.map((attachment) => (
                  <PreviewAttachment
                    key={attachment.url}
                    attachment={attachment}
                  />
                ))}
              </div>
            )}

            {message.content && mode === 'view' && !errorMsg && (
              <div className="flex flex-row gap-2 items-start">
                {message.role === 'user' && !isReadonly && showEdit && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                        onClick={() => {
                          setMode('edit');
                        }}
                      >
                        <PencilEditIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit message</TooltipContent>
                  </Tooltip>
                )}

                {(message.content.startsWith('https://') || message.content.startsWith('http://')) ? (
                  <img src={message.content} alt="" />
                ) : (
                  <div
                    className={cn('flex flex-col gap-4', {
                      'bg-primary text-primary-foreground px-3 py-2 rounded-xl':
                        message.role === 'user',
                      'font-serif': useSerifFont,
                    })}
                    style={{
                      fontSize: `${messageFontSize}px`,
                    }}
                  >
                    <Markdown>{message.content as string}</Markdown>
                    {showTokens && message.content && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {(message.content as string).length} token
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {message.content && mode === 'edit' && !errorMsg && (
              <div className="flex flex-row gap-2 items-start">
                <div className="size-8" />

                <MessageEditor
                  key={message.id}
                  message={message}
                  setMode={setMode}
                  setMessages={setMessages}
                  reload={reload}
                />
              </div>
            )}

            {errorMsg && <ErrorMessage code={errorMsg.code} msg={errorMsg.msg} />}

            {!isReadonly && (
              <MessageActions
                key={`action-${message.id}`}
                channelId={channelId}
                message={message}
                isLoading={isLoading}
              />
            )}
          </div>
          <UserAvatar role={message.role} user={{
            name: avatarInfo?.name!,
            avatar: avatarInfo?.avatar!,
          }} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.content !== nextProps.message.content) return false;
    if (
      !equal(
        prevProps.message.toolInvocations,
        nextProps.message.toolInvocations,
      )
    )
      return false;
    if (
      !equal(
        prevProps.message.annotations,
        nextProps.message.annotations,
      )
    )
      return false;

    return true;
  },
);

export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message "
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
          {
            'group-data-[role=user]/message:bg-muted': true,
          },
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Thinking...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
