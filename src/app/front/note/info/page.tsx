import { RightSettingProvider } from "@/app/front/aichat/component/rightSetting";
import { CoreEditor } from "@/components/editor-pro/components/editor/core-editor";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import {
    ApiChatHistory,
    ApiCreateDocResp,
    ApiGetChat,
    ApiGetDoc,
    RespChannel, RespChatHistoryMessage,
} from "@/service/api";
import { useGlobalStore } from "@/store/globalStore";
import DocList from "@/app/front/note/component/doc-list";
import { useTranslation } from "react-i18next";
import { ChatHeader } from "../component/note-header";
import {Chat} from "@/components/chat/chat";
import {convertToUIMessages} from "@/lib/utils";
import {DataStreamHandler} from "@/components/chat/data-stream-handler";
import {useChatStore} from "@/store/chatStore";
// import { Chat } from "@/components/chat/chat";

export default function Page() {
    const { t } = useTranslation();
    const { appId, channelId } = useParams();
    const user = useGlobalStore(state => state.user);
    const selectedModelId = useChatStore(state => state.modelSelectedId)

    const { data: chatResp } = useSWR<RespChannel>(
        channelId ? ['ApiGetChat', channelId] : null,
        () => ApiGetChat(channelId!),
    );

    const { data: messageHistoryResp } = useSWR<RespChatHistoryMessage[]>(
        channelId ? ['ApiChatHistory', channelId] : null,
        () => ApiChatHistory(channelId!),
    );



    const { data: docResp } = useSWR<ApiCreateDocResp>(
        channelId ? ['ApiGetDoc', channelId] : null,
        () => ApiGetDoc(channelId!),
    );

    return (
        <RightSettingProvider>
            <div className="flex flex-1  overflow-hidden" >
                {/* Sidebar */}
                <DocList />
                {/* Main content */}
                <div className="h-screen flex-col flex flex-1 overflow-hidden" >
                    {/*<ChatHeader*/}
                    {/*    chatInfo={chatResp!}*/}
                    {/*    channelId={chatResp?.guid!}*/}
                    {/*    isReadonly={user.id !== chatResp?.uid}*/}
                    {/*/>*/}

                    <div className="flex flex-1 overflow-hidden">
                        <div className="flex-1">
                            <CoreEditor
                                initialValue={docResp?.content}
                                appId={appId!}
                                channelId={channelId!}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </RightSettingProvider>
    );
}