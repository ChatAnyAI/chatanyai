'use client';

import type { Attachment, Message } from 'ai';
import { useChat } from 'ai/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Messages } from '@/components/chat/messages';
import { useBlockSelector } from '@/hooks/use-block';
import { useRightSetting } from '@/app/front/aichat/component/rightSetting';
import { MeetingData } from './meeting-setting';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export default function Chat({
  id,
  initialMessages,
  selectedModelId,
  isReadonly,
  appId,
  meetingData,
  isStoreData,
  isNew,
}: {
  isStoreData: boolean;
  meetingData: MeetingData | null;
  id: string;
  initialMessages: Array<Message>;
  selectedModelId: string;
  isReadonly: boolean;
  appId: string;
  isNew?: boolean;
}) {
  const { t } = useTranslation();
  const { settingData } = useRightSetting();
  const currentRound = useRef(0);
  const memberIndex = useRef(0);
  const currentName = useRef("");
  const { channelId } = useParams();
  const navigate = useNavigate();

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
    api: `/api/app/${appId}/channel/${id}/meeting`,
    id,
    body: {
      id,
      ...meetingData,
      modelId: selectedModelId,
      options: {
        frequency_penalty: settingData.frequencyPenalty, // Optional: Frequency penalty, >= -2 and <= 2
        max_tokens: settingData.maxTokens,        // Optional: Maximum tokens, > 1
        presence_penalty: settingData.presencePenalty,  // Optional: Presence penalty, >= -2 and <= 2
        temperature: settingData.temperature,      // Optional: Sampling temperature, <= 2
      },
      appId,
    },
    initialMessages,
    experimental_throttle: 100,
    onFinish: () => {
      if (isReadonly || !isStoreData
        || (currentRound.current === 0 && memberIndex.current === 0)
      ) return;
      const lastMsg = getApiMessages();
      if (!lastMsg) return;
      handleSubmit(undefined, {
        body: {
          messages: [lastMsg!],
          current: currentName.current,
        },
        allowEmptySubmit: true
      });
    },
  });

  // Generate the "Now, let {name} take the floor." prompt based on members and maxrounds
  const getApiMessages = (): null | { role: string; content: string } => {
    if (!meetingData) return null;
    if (meetingData.members.length === 0) return null;
    const members = meetingData.members;
    const maxrounds = meetingData.maxrounds;
    if (currentRound.current >= maxrounds
      || (currentRound.current === maxrounds && memberIndex.current >= members.length)
    ) {
      memberIndex.current = 0;
      currentRound.current = 0;
      return {
        role: "user",
        content: "Please summarize this meeting."
      };
    };
    const name = members[memberIndex.current].name;
    currentName.current = name;
    if (memberIndex.current === members.length - 1) {
      currentRound.current++;
      memberIndex.current = 0;
    } else {
      memberIndex.current++;
    }
    return {
      role: "system",
      content: `Now, let's welcome ${name} to speak.`,
    };
  }

  useEffect(() => {
    console.log(Date.now(), "meetingData", id, meetingData, isReadonly, isStoreData);
    if (!id || isReadonly || !isStoreData) return;
    // if (id !== channelId) {
    //   console.log(Date.now(), "id", id, channelId);
    //   navigate(`c/${id}`, { replace: true });
    //   return;
    // }
    const msgs = [{
      "role": "system",
      "content": "You are a multi-role teamwork dialogue model. Each role has its own responsibilities and revolves around a given topic."
    }, {
      "role": "system",
      "content":`When constructing a response, consider:\n- Your initial thoughts on the topic?\n- Anything from previous remarks that caught your interest?\n- Any relevant experience to share?\n- How do you want to move the discussion forward?\n\nGuide:\n- Keep it natural and real, like a real conversation\n- One person speaks per turn, response length 10-500 words\n- Include main ideas, questions, insights, or replies\n- Express emotion or use humor as appropriate\n- You don't need to mention your background each time unless it's relevant`
    }];
    meetingData?.members.forEach((member, i) => {
      msgs.push({
        "role": "system",
        "content": `Role${i + 1}: ${member.name}. ${member.description}`
      })
    })
    msgs.push({
      "role": "user",
      "content": `Today we will discuss the topic '${meetingData?.topic}'. Please start the discussion around this topic, and only one person can speak at a time.`,
    })
    const lastMsg = getApiMessages();
    msgs.push(lastMsg!);

    handleSubmit(undefined, {
      body: {
        messages: msgs,
        current: currentName.current,
      },
      allowEmptySubmit: true
    });
  }, [id, channelId, isReadonly])


  if (error) {
    console.error(error);
    toast({
      title: t('meeting-chat.error'),
      description: t('meeting-chat.chat-failed'),
      variant: "destructive"
    });
  }

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isBlockVisible = useBlockSelector((state) => state.isVisible);

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      return (msg.annotations as Array<{ type: number }>)?.some(a => a.type === 2);
    })
  }, [messages])

  console.log("filteredMessages", messages, filteredMessages)

  return (
    <>
      <div className="flex flex-auto flex-col min-w-0 bg-background">
        <div className="flex-1 flex flex-col overflow-hidden overflow-y-auto">
          <Messages
            channelId={id}
            isLoading={isLoading}
            messages={filteredMessages}
            setMessages={setMessages}
            reload={reload}
            isReadonly={isReadonly}
            isBlockVisible={isBlockVisible}
          />
        </div>
      </div>
    </>
  );
}
