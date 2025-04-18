// 'use client'
import { useRef, useState } from 'react';
import { RightSettingProvider } from '@/app/front/aichat/component/rightSetting';
import MeetingSetting, { MeetingData } from './components/meeting-setting';
import { ChatHeader } from '@/components/chat/chat-header';
import {ChatList} from "@/app/front/aichat/component/chat-list";
import {EmptyState} from "@/app/front/aichat/component/empty-state";
import useSWR from "swr";
import {ApiChannelListByAppId} from "@/service/api";
import {useParams} from "react-router-dom";
// import { generateUUID } from '@/lib/utils';
// import { DataStreamHandler } from '@/components/chat/data-stream-handler';
// import { useParams } from "react-router-dom";
// import { useChatStore } from '@/store/chatStore';
// import MeetingChat from './components/meeting-chat';
// import { useTranslation } from 'react-i18next';

export default function Page() {
  // const { t } = useTranslation();
  // const selectedModelId = useChatStore(state => state.modelSelectedId)
  // const { appId } = useParams();
    const { appId } = useParams();

    const [meetingData, setMeetingData] = useState<MeetingData | null>(null);
    const { data: chats } = useSWR([`ApiChannelListByAppId`, appId], () => ApiChannelListByAppId(appId!));


  return (
    <RightSettingProvider>
      <div className="flex flex-col h-screen flex-1">
        {
          !meetingData ? null :
            <ChatHeader
              channelId={'0'}
              // isReadonly={false}
              isNew={true}
            />
        }
          <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
              <MeetingSetting onStart={setMeetingData} data={meetingData!} channelId={'0'}/>
              {/* {!meetingData ? (
            null
          ) : (
            <>
              <div className="flex-1 flex overflow-hidden">
                {selectedModelId && <MeetingChat
                  isStoreData
                  meetingData={meetingData}
                  key={'0'}
                  id={'0'}
                  appId={appId!}
                  initialMessages={[]}
                  selectedModelId={selectedModelId}
                  isReadonly={false}
                  isNew={true}
                />}
              </div>
            </>
          )} */}
              {chats?.length! > 0 ? <ChatList channelList={chats!} /> : <EmptyState />}
          </div>

      </div>
    </RightSettingProvider>
  );
}
