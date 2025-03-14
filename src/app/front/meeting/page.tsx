// 'use client'
import { useRef, useState } from 'react';
import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/chat/data-stream-handler';
import { useParams } from "react-router-dom";
import { RightSettingProvider } from '@/app/front/aichat/component/rightSetting';
import { useChatStore } from '@/store/chatStore';
import MeetingChat from './components/meeting-chat';
import MeetingSetting, { MeetingData } from './components/meeting-setting';
import { ChatHeader } from '@/components/chat/chat-header';

export default function Page() {
  const selectedModelId = useChatStore(state => state.modelSelectedId)
  const { appId } = useParams();
  const idRef = useRef<string>(generateUUID());
  const id = idRef.current;
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);


  return (
    <RightSettingProvider>
      <div className="flex flex-col h-screen flex-1">
        {
          !meetingData ? null :
            <ChatHeader
              chatId={id!}
              isReadonly={false}
              isNew={true}
            />
        }
        <div className="flex justify-center px-4 flex-1 overflow-hidden">
          <MeetingSetting onStart={setMeetingData} data={meetingData!} chatId={id} />
          {!meetingData ? (
            null
          ) : (
            <>
              <div className="flex-1 flex overflow-hidden">
                {selectedModelId && <MeetingChat
                  isStoreData
                  meetingData={meetingData}
                  key={id}
                  id={id}
                  appId={appId!}
                  initialMessages={[]}
                  selectedModelId={selectedModelId}
                  isReadonly={false}
                  isNew={true}
                />}
                {selectedModelId && <DataStreamHandler id={id} />}
              </div>
            </>
          )}

        </div>
      </div>
    </RightSettingProvider>
  );
}
