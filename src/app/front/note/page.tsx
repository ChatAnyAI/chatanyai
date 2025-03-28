import {PlateEditor} from "@/components/editor/plate-editor";
import {RightSettingProvider} from "@/app/front/aichat/component/rightSetting";
import {CoreEditor} from "@/components/editor/core-editor";
import {InfoIcon, PinIcon, PlusIcon, StarIcon} from "lucide-react";
import {generateUUID} from "@/lib/utils";
import {useNavigate, useParams} from "react-router-dom";
import useSWR from "swr";
import {ApiAppShareCreate, ApiChatListByAppId, ApiChatShareCreate, ApiCreateDoc, ApiDocList} from "@/service/api";
import {useChatStore} from "@/store/chatStore";
import {toast} from "@/hooks/use-toast";
import {RouteEnum} from "@/lib/constants/constants";

export default function Page() {
    const chatId = generateUUID();
    const { appId } = useParams();
    const { data: chats } = useSWR([`ApiChatHistory`, appId], () => ApiChatListByAppId(appId!));
    const { data: docList } = useSWR([`ApiDocList`, appId], () => ApiDocList(appId!));
    const currentAppInfo = useChatStore(state => state.currentAppInfo);
    const navigate = useNavigate();

    const createNote = async () => {
        try {
            const resp = await ApiCreateDoc(appId!);
            navigate(`/${RouteEnum[currentAppInfo?.type!]}/${appId}/c/${resp.guid}`);
        } catch (error) {
            toast({
                title: 'Create Fail',
                description: 'Create Fail',
                variant: 'destructive'
            });
        }
    }


    return (
        <RightSettingProvider>
            <div className="flex" >
                {/* Sidebar */}
                <div className="w-60 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                    <div className="p-4">
                        <div className="bg-white rounded-lg shadow-sm p-4 h-32 flex items-center justify-center mb-3" onClick={()=>{
                            createNote();
                        }}>
                            <PlusIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        {/* Document cards */}
                        <div className="space-y-3">
                            {/* First card */}
                            {/*<div className="bg-white rounded-lg shadow-sm p-4 h-32 flex items-center justify-center">*/}
                            {/*    <p className="text-gray-500">Blank</p>*/}
                            {/*</div>*/}

                            {/* Second card */}
                            {docList?.map((doc) => {
                                return (
                                    <div className="bg-white rounded-lg shadow-sm p-4 h-32 relative" onClick={()=>{
                                        navigate(`/${RouteEnum[currentAppInfo?.type!]}/${appId}/c/${doc.chatId}`);
                                    }}>
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
                                            <p className="text-gray-500">{doc.name}</p>
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Third card (blue) */}
                            {/*<div className="bg-blue-500 rounded-lg shadow-sm p-4 h-32 flex items-center justify-center">*/}
                            {/*    <p className="text-white">空白文档</p>*/}
                            {/*</div>*/}
                            {/*<div className="bg-white rounded-lg shadow-sm p-4 h-32 relative">*/}
                            {/*    <div className="absolute top-2 right-2 flex space-x-2">*/}
                            {/*        <div className="bg-gray-100 p-1 rounded-md">*/}
                            {/*            <StarIcon className="w-4 h-4 text-gray-400" />*/}
                            {/*        </div>*/}
                            {/*        <div className="bg-gray-100 p-1 rounded-md">*/}
                            {/*            <PinIcon className="w-4 h-4 text-gray-400" />*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*    <div className="absolute bottom-2 right-2">*/}
                            {/*        <div className="bg-gray-100 p-1 rounded-full">*/}
                            {/*            <InfoIcon className="w-4 h-4 text-gray-400" />*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*    <div className="h-full flex items-center justify-center">*/}
                            {/*        <p className="text-gray-500">空白文档</p>*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            {/* Third card (blue) */}
                            {/*<div className="bg-blue-500 rounded-lg shadow-sm p-4 h-32 flex items-center justify-center">*/}
                            {/*    <p className="text-white">空白文档</p>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
                {/* Main content */}
                <div className="h-screen " data-registry="plate">
                    <CoreEditor
                        appId={appId!}
                        chatId={chatId}
                    />
                </div>
            </div>
        </RightSettingProvider>
    );
}