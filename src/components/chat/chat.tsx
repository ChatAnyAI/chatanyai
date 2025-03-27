'use client';

import type { Attachment, Message } from 'ai';
import { useChat } from 'ai/react';
import { memo, useState } from 'react';
import { useSWRConfig } from 'swr';

import { ChatHeader } from '@/components/chat/chat-header';

import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import { useBlockSelector } from '@/hooks/use-block';
import { RightSidebar, useRightSetting } from '@/app/front/aichat/component/rightSetting';
import { RespChat } from "@/service/api";
import { toast } from '@/hooks/use-toast';

function Chat({
  hiddenHeader,
  id,
  initialMessages,
  selectedModelId,
  isReadonly,
  appId,
  pdfLink,
  isNew,
  chatInfo,
  className,
  hiddenMessage,
}: {
  className?: string;
  hiddenHeader?: boolean;
  hiddenMessage?: boolean;
  pdfLink?: string;
  id: string;
  initialMessages: Array<Message>;
  selectedModelId: string;
  isReadonly: boolean;
  appId: string;
  isNew?: boolean;
  chatInfo?: RespChat;
}) {
  const { settingData } = useRightSetting();
  const { mutate } = useSWRConfig();

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload,
    error,
  } = useChat({
    api: `/api/app/${appId}/chat/${id}`,
    id,
    body: {
      id,
      modelId: selectedModelId,
      options: {
        frequency_penalty: settingData.frequencyPenalty, // Optional: Frequency penalty, >= -2 and <= 2
        max_tokens: settingData.maxTokens,        // Optional: Maximum tokens, > 1
        presence_penalty: settingData.presencePenalty,  // Optional: Presence penalty, >= -2 and <= 2
        temperature: settingData.temperature,      // Optional: Sampling temperature, <= 2
        // topP: settingData.topP,            // Optional: Nucleus sampling parameter, <= 1
      },
      appId,
      ...(pdfLink ? { pdfLink } : {})
    },
    initialMessages,
    experimental_throttle: 100,
    onFinish: () => {
      mutate('ApiChatListByAppId');
    },
  });
  if (error) {
    console.error(error);
    stop();
    toast({
      title: "Error",
      description: "Failed to chat. Please check model provider setting.",
      variant: "destructive"
    });
  }

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isBlockVisible = useBlockSelector((state) => state.isVisible);

  return (
    <>
      <div className={`flex flex-auto flex-col min-w-0 bg-background ${className}`}>
        {
          hiddenHeader ? null :
            <ChatHeader
              chatId={id}
              chatInfo={chatInfo}
              isReadonly={isReadonly}
              isNew={isNew}
            />
        }
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden overflow-y-auto">
            {
              hiddenMessage ? null :
                <Messages
                  chatId={id}
                  isLoading={isLoading}
                  messages={messages}
                  setMessages={setMessages}
                  reload={reload}
                  isReadonly={isReadonly}
                  isBlockVisible={isBlockVisible}
                />
            }

            <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
              {!isReadonly && (
                <MultimodalInput
                  chatId={id}
                  input={input}
                  setInput={setInput}
                  handleSubmit={handleSubmit}
                  isLoading={isLoading}
                  stop={stop}
                  attachments={attachments}
                  setAttachments={setAttachments}
                  messages={messages}
                  setMessages={setMessages}
                  append={append}
                />
              )}
            </form>
          </div>
          <RightSidebar />
        </div>
      </div>
    </>
  );
}

const MemoizedChat = memo(Chat);
export { MemoizedChat as Chat };