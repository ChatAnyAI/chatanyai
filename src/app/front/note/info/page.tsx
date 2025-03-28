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
                <div className="w-60 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                    <div className="p-4">
                        <div className="bg-white rounded-lg shadow-sm p-4 h-32 flex items-center justify-center mb-3">
                            <PlusIcon className="w-6 h-6 text-gray-400" />
                        </div>

                        {/* Document cards */}
                        <div className="space-y-3">
                            {/* First card */}
                            <div className="bg-white rounded-lg shadow-sm p-4 h-32 flex items-center justify-center">
                                <p className="text-gray-500">空白文档</p>
                            </div>

                            {/* Second card */}
                            <div className="bg-white rounded-lg shadow-sm p-4 h-32 relative">
                                <div className="absolute top-2 right-2 flex space-x-2">
                                    <div className="bg-gray-100 p-1 rounded-md">
                                        <StarIcon className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div className="bg-gray-100 p-1 rounded-md">
                                        <PinIcon className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                                <div className="absolute bottom-2 right-2">
                                    <div className="bg-gray-100 p-1 rounded-full">
                                        <InfoIcon className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-gray-500">空白文档</p>
                                </div>
                            </div>

                            {/* Third card (blue) */}
                            <div className="bg-blue-500 rounded-lg shadow-sm p-4 h-32 flex items-center justify-center">
                                <p className="text-white">空白文档</p>
                            </div>
                        </div>
                    </div>
                </div>
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