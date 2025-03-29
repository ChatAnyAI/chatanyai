// 'use client'
import { Chat } from '@/components/chat/chat';
import { convertToUIMessages } from '@/lib/utils';
import { DataStreamHandler } from '@/components/chat/data-stream-handler';
import { useParams } from "react-router-dom";
import { RightSettingProvider } from '@/app/front/aichat/component/rightSetting';
import { useChatStore } from '@/store/chatStore';
import PDFPreview from '../component/pdfv2-preview';
import { useGlobalStore } from '@/store/globalStore';
import useSWR from 'swr';
import { ApiChatHistory, ApiGetChat, RespChat, RespChatHistoryMessage } from '@/service/api';
import { ChatHeader } from '@/components/chat/chat-header';
import { useTranslation } from 'react-i18next';

export default function Page() {
    const { t } = useTranslation();
    const { appId, chatId: id } = useParams();
    const user = useGlobalStore(state => state.user);
    const selectedModelId = useChatStore(state => state.modelSelectedId)

    const { data: chatResp, isLoading } = useSWR<RespChat>(
        id ? ['ApiGetChat', id] : null,
        () => ApiGetChat(id!),
    );

    const { data: messageHistoryResp } = useSWR<RespChatHistoryMessage[]>(
        id ? ['ApiChatHistory', id] : null,
        () => ApiChatHistory(id!),
    );


    if (isLoading) {
        return <div>{t('chatpdf-info-page.Loading...')}</div>
    }

    console.log("chatResp", chatResp)

    return (
        <RightSettingProvider>

            <div className="flex flex-col h-screen flex-1">
                {
                    !chatResp?.pdfLink! ? null :
                        <ChatHeader
                            chatInfo={chatResp!}
                            chatId={chatResp?.id!}
                            isReadonly={false}
                        />
                }
                <div className="flex justify-center flex-1 overflow-hidden">
                    <>
                        <PDFPreview url={'/' + chatResp?.pdfLink!} />
                        <div className="flex-1 flex overflow-hidden h-[100%]">
                            {<Chat
                                hiddenHeader
                                pdfLink={chatResp?.pdfLink!}
                                key={id}
                                id={id!}
                                initialMessages={convertToUIMessages(messageHistoryResp || [])}
                                selectedModelId={selectedModelId}
                                // selectedVisibilityType={chatResp?.visibility!}
                                isReadonly={user.id !== chatResp?.uid}
                                appId={appId!}
                                chatInfo={chatResp!}
                            />}
                            <DataStreamHandler id={id!} />
                        </div>
                    </>
                </div>
            </div>
        </RightSettingProvider>
    );
}
