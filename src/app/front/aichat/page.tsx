import { Chat } from '@/components/chat/chat';
import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/chat/data-stream-handler';
import { useParams } from "react-router-dom";
import { RightSettingProvider } from '@/app/front/aichat/component/rightSetting';
import { useChatStore } from '@/store/chatStore';

export default function Page() {
  const chatId = generateUUID();
  const selectedModelId = useChatStore(state => state.modelSelectedId)
  const { appId } = useParams();


  return (
    <RightSettingProvider>
      <div className="flex-1 flex overflow-hidden h-screen">
        {selectedModelId && <Chat
          key={chatId}
          id={chatId}
          isNew={true}
          appId={appId!}
          initialMessages={[]}
          selectedModelId={selectedModelId}
          isReadonly={false}
        />}
        {selectedModelId && <DataStreamHandler id={chatId} />}
      </div>
    </RightSettingProvider>
  );
}
