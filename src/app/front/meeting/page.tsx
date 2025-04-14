// 'use client'
import { useRef, useState } from 'react';
import { RightSettingProvider } from '@/app/front/aichat/component/rightSetting';
import MeetingSetting, { MeetingData } from './components/meeting-setting';
import { ChatHeader } from '@/components/chat/chat-header';
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
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);


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
        <div className="flex justify-center px-4 flex-1 overflow-hidden">
          <MeetingSetting onStart={setMeetingData} data={meetingData!} channelId={'0'} />
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

        </div>
      </div>
    </RightSettingProvider>
  );
}
