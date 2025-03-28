import {PlateEditor} from "@/components/editor/plate-editor";
import {RightSettingProvider} from "@/app/front/aichat/component/rightSetting";
import {CoreEditor} from "@/components/editor/core-editor";
import {InfoIcon, PinIcon, PlusIcon, StarIcon} from "lucide-react";
import {generateUUID} from "@/lib/utils";
import {useParams} from "react-router-dom";
import useSWR from "swr";
import {
    ApiChatHistory,
    ApiChatListByAppId, ApiCreateDocResp,
    ApiGetChat,
    ApiGetDoc,
    RespChat,
    RespChatHistoryMessage
} from "@/service/api";
import {useChatStore} from "@/store/chatStore";
import {useGlobalStore} from "@/store/globalStore";
import DocList from "@/app/front/note/component/doc-list";

export default function Page() {
    const { appId, chatId } = useParams();
    const user = useGlobalStore(state => state.user);
    const selectedModelId = useChatStore(state => state.modelSelectedId)

    const { data: chatResp } = useSWR<RespChat>(
        chatId ? ['ApiGetChat', chatId] : null,
        () => ApiGetChat(chatId!),
    );

    const { data: messageHistoryResp } = useSWR<RespChatHistoryMessage[]>(
        chatId ? ['ApiChatHistory', chatId] : null,
        () => ApiChatHistory(chatId!),
    );


    const { data: docResp } = useSWR<ApiCreateDocResp>(
        chatId ? ['ApiGetDoc', chatId] : null,
        () => ApiGetDoc(chatId!),
    );

    return (
        <RightSettingProvider>

            <div className="flex" >
                {/* Sidebar */}
                {/* Sidebar */}
                <DocList />
                {/* Main content */}
                <div className="h-screen " data-registry="plate">
                    {docResp && <CoreEditor
                        initialValue={docResp.content}
                        appId={appId!}
                        chatId={chatId!}
                    />}
                </div>
            </div>
        </RightSettingProvider>
    );
}