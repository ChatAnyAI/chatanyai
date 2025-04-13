'use client';

import type { Attachment, Message } from 'ai';
import { useChat } from 'ai/react';
import { memo, useCallback, useState, useEffect } from 'react';
import { useSWRConfig } from 'swr';

import { ChatHeader } from '@/components/chat/chat-header';

import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import { useBlockSelector } from '@/hooks/use-block';
import { RightSidebar, useRightSetting } from '@/app/front/aichat/component/rightSetting';
import { ApiChatCreate, RespChannel } from "@/service/api";
import { toast } from '@/hooks/use-toast';
import { data, useNavigate } from 'react-router-dom';

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
  id?: string;
  initialMessages: Array<Message>;
  selectedModelId: string;
  isReadonly: boolean;
  appId: string;
  isNew?: boolean;
  chatInfo?: RespChannel;
}) {
  const { settingData } = useRightSetting();
  const { mutate } = useSWRConfig();
  const [channelId, setChannelId] = useState<string | undefined>(id);
  const navgate = useNavigate();

  // Create a dynamic API endpoint that updates when channelId changes
  const apiEndpoint = `/api/app/${appId}/channel/${channelId}`;

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
  } = useChat({
    api: apiEndpoint,
    id: channelId, // Use channelId instead of id to ensure consistency
    body: {
      id: channelId, // Use channelId instead of id
      modelId: selectedModelId,
      options: {
        frequency_penalty: settingData.frequencyPenalty,
        max_tokens: settingData.maxTokens,
        presence_penalty: settingData.presencePenalty,
        temperature: settingData.temperature,
        // topP: settingData.topP,
      },
      appId,
      ...(pdfLink ? { pdfLink } : {})
    },
    initialMessages,
    experimental_throttle: 100,
    onFinish: () => {
      mutate('ApiChatListByAppId');
    },
    onError: (err: Error) => {
      try {
        const data = JSON.parse(err.message).data;
        setMessages((prevMessages) => { 
          return [...prevMessages, {
            id: `error-${Date.now()}`,
            content: "An error occurred",
            role: "assistant",
            annotations: [{
              type: 3,
              data
            }]
          }]
        });
      } catch (error) {
        setMessages((prevMessages) => {
          return [...prevMessages, {
            id: `error-${Date.now()}`,
            content: "An error occurred",
            role: "assistant",
            annotations: [{
              type: 3,
              data: { msg: err.message}
            }]
          }]
        });
      }
      // toast({
      //   title: "Error",
      //   description: errmsg || "Failed to chat. Please check model provider setting.",
      //   variant: "destructive"
      // });
    },
  });

  // Reset messages when channelId changes
  useEffect(() => {
    if (channelId && channelId !== id) {
      setMessages([]); // Clear messages when switching to a new channel
    }
  }, [channelId, id, setMessages]);

  console.log('chatInfo messages', isLoading, messages);

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isBlockVisible = useBlockSelector((state) => state.isVisible);

  //@ts-ignore
  const handleMsgSubmit = useCallback((e, data) => {
    if (channelId) { 
      // If we already have a channel ID, submit directly
      handleSubmit(e, data);
    } else {
      // Create a new channel first
      ApiChatCreate(appId, {
        // fileId: pdfLink || ''
      }).then((res) => {
        setChannelId(res.guid);
        navgate(`c/${res.guid}`);
        // Use the new data with updated channel ID
        const updatedData = {
          ...data,
          body: {
            ...data.body,
            id: res.guid,
          }
        };
        // Small delay to ensure state is updated
        setTimeout(() => { 
          //@ts-ignore
          handleSubmit(e, updatedData, {
            api: `/api/app/${appId}/channel/${res.guid}`
          });
        }, 100)
      }).catch(err => {
        console.error('Failed to create channel:', err);
        toast({
          title: "Error",
          description: "Failed to create new chat channel.",
          variant: "destructive"
        });
      });
    }
  }, [appId, handleSubmit, channelId, pdfLink]);

  return (
    <>
      <div className={`flex flex-auto flex-col min-w-0 bg-background ${className}`}>
        {
          hiddenHeader ? null :
            <ChatHeader
              channelId={channelId!}
              chatInfo={chatInfo}
              isNew={isNew}
            />
        }
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden overflow-y-auto">
            {
              hiddenMessage ? null :
                <Messages
                  channelId={channelId!}
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
                  channelId={channelId!}
                  input={input}
                  setInput={setInput}
                  handleSubmit={handleMsgSubmit}
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