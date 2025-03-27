import { Chat } from '@/components/chat/chat';
import { generateUUID } from '@/lib/utils';
import { useParams } from "react-router-dom";
import { RightSettingProvider } from '@/app/front/aichat/component/rightSetting';
import { useChatStore } from '@/store/chatStore';
import { ChatList } from './component/chat-list';
import { EmptyState } from './component/empty-state';
import { ApiChatListByAppId } from '@/service/api';
import useSWR from 'swr';

export default function Page() {
  const chatId = generateUUID();
  const selectedModelId = useChatStore(state => state.modelSelectedId)
  const { appId } = useParams();
  const { data: chats } = useSWR([`ApiChatHistory`, appId], () => ApiChatListByAppId(appId!));
  const currentAppInfo = useChatStore(state => state.currentAppInfo);

  return (
    <div className="flex flex-col h-screen w-full p-4 md:p-6 bg-background">
      <div className="flex flex-col mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        <h1 className="text-2xl font-bold mb-2">{currentAppInfo?.name || appId}</h1>
        <div className="flex items-center">
          <span className="text-gray-600">{currentAppInfo?.description}</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        <RightSettingProvider>
          <Chat
            hiddenHeader
            hiddenMessage
            className='flex-none'
            key={chatId}
            id={chatId}
            isNew={true}
            appId={appId!}
            initialMessages={[]}
            selectedModelId={selectedModelId}
            isReadonly={false} />
        </RightSettingProvider>

        {chats?.length! > 0 ? <ChatList chats={chats!} onMenuOpen={() => { }} /> : <EmptyState />}
      </div>
      {/* 
      {showMenu && menuPosition && (
        <ChatMenu
          position={menuPosition}
          onClose={handleMenuClose}
          onDelete={() => selectedChatId && handleDelete(selectedChatId)}
        />
      )} */}
    </div>
  );
}
