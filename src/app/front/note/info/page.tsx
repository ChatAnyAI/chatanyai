import { RightSettingProvider } from "@/app/front/aichat/component/rightSetting";
import { CoreEditor } from "@/components/editor/core-editor";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import {
    ApiCreateDocResp,
    ApiGetChat,
    ApiGetDoc,
    RespChannel,
} from "@/service/api";
import { useGlobalStore } from "@/store/globalStore";
import DocList from "@/app/front/note/component/doc-list";
import { useTranslation } from "react-i18next";
import { ChatHeader } from "../component/note-header";
// import { Chat } from "@/components/chat/chat";

export default function Page() {
    const { t } = useTranslation();
    const { appId, chatId } = useParams();
    const user = useGlobalStore(state => state.user);

    const { data: chatResp } = useSWR<RespChannel>(
        chatId ? ['ApiGetChat', chatId] : null,
        () => ApiGetChat(chatId!),
    );

    const { data: docResp } = useSWR<ApiCreateDocResp>(
        chatId ? ['ApiGetDoc', chatId] : null,
        () => ApiGetDoc(chatId!),
    );

    return (
        <RightSettingProvider>
            <div className="flex flex-1  overflow-hidden" >
                {/* Sidebar */}
                <DocList />
                {/* Main content */}
                <div className="h-screen flex-col flex flex-1 overflow-hidden" >
                    <ChatHeader
                        chatInfo={chatResp!}
                        chatId={chatResp?.channelId!}
                        isReadonly={user.id !== chatResp?.uid}
                    />
                    
                    <div className="flex flex-1 overflow-hidden">
                        <div className="flex-1 overflow-hidden">
                            <CoreEditor
                                initialValue={docResp?.content}
                                appId={appId!}
                                chatId={chatId!}
                            />
                        </div>
                        <div className="w-[0px] border-l">
                            {/* <Chat 
                                hiddenHeader
                                chatId={chatId!} 
                            /> */}
                        </div>
                    </div>
                </div>
            </div>
        </RightSettingProvider>
    );
}