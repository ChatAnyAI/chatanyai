// 'use client'
import { useEffect, useState } from 'react';
import { convertToUIMessages } from '@/lib/utils';
import { DataStreamHandler } from '@/components/chat/data-stream-handler';
import { RightSidebar } from "@/app/front/aichat/component/rightSetting";
import { useParams } from "react-router-dom";
import { RightSettingProvider } from '@/app/front/aichat/component/rightSetting';
import { useChatStore } from '@/store/chatStore';
import MeetingChat from '../components/meeting-chat';
import MeetingSetting, { MeetingData } from '../components/meeting-setting';
import useSWR from 'swr';
import { ApiChatHistory, ApiGetChat, RespChannel, RespChatHistoryMessage } from '@/service/api';
import { useGlobalStore } from '@/store/globalStore';
import { ChatHeader } from '@/components/chat/chat-header';
import { useTranslation } from 'react-i18next';
import { Chat } from '@/components/chat/chat';

export default function Page() {
  const { t } = useTranslation();
  const selectedModelId = useChatStore(state => state.modelSelectedId)
  const { appId, channelId } = useParams();
  const id = channelId;
  const storeData = sessionStorage.getItem(`meeting-${id}`);
  sessionStorage.removeItem(`meeting-${id}`);
  const [meetingData, setMeetingData] = useState<MeetingData | null>(storeData ? JSON.parse(storeData) : null);
  const user = useGlobalStore(state => state.user);


  const { data: chatResp } = useSWR<RespChannel>(
    !storeData ? ['ApiGetChat', id] : null,
    () => ApiGetChat(id!),
  );

  const { data: messageHistoryResp, isLoading } = useSWR<RespChatHistoryMessage[]>(
    !storeData ? ['ApiChatHistory', id] : null,
    () => ApiChatHistory(id!),
  );

  // useEffect(() => {
  //   const ragContent = messageHistoryResp?.find(item => item.ragContent)?.ragContent;
  //   if (ragContent) {
  //     setMeetingData(JSON.parse(ragContent));
  //   }
  // }, [messageHistoryResp])

  if (!storeData && isLoading) {
    return <div>{t('meeting-info-page.loading')}</div>
  }

  return (
    <RightSettingProvider>
      <div className="flex flex-col h-screen flex-1">
        <ChatHeader
          channelId={id!}
          chatInfo={chatResp!}
        />
        <div className="flex justify-center px-4 flex-1 overflow-hidden">
          <MeetingSetting onStart={setMeetingData} data={meetingData!} channelId={id!} />
          <>
            <div className="flex-1 flex overflow-hidden">
              {<Chat
                id={id!}
                initialMessages={convertToUIMessages(messageHistoryResp || [])}
                selectedModelId={selectedModelId}
                chatInfo={chatResp!}
                // isReadonly={user.id !== chatResp?.uid}
                appId={appId!}
                hiddenHeader={true}
                isMeeting={true}
                meetingData={meetingData}
              />}
              <DataStreamHandler id={id!} />
              {/*{selectedModelId && <MeetingChat*/}
              {/*  isStoreData={!!storeData}*/}
              {/*  meetingData={meetingData}*/}
              {/*  key={id}*/}
              {/*  id={id!}*/}
              {/*  appId={appId!}*/}
              {/*  initialMessages={convertToUIMessages(messageHistoryResp || [])}*/}
              {/*  selectedModelId={selectedModelId}*/}
              {/*  isReadonly={!!(chatResp && user.id !== chatResp?.uid)}*/}
              {/*/>}*/}
              {/*{selectedModelId && <DataStreamHandler id={id!} />}*/}
              {/*<RightSidebar></RightSidebar>*/}
            </div>
          </>
        </div>
      </div>
    </RightSettingProvider>
  );
}
