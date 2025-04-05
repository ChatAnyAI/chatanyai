import { InfoIcon, PinIcon, PlusIcon, StarIcon } from "lucide-react";
import { RouteEnum } from "@/lib/constants/constants";
import { cn, getFirstPathSegment } from "@/lib/utils";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { ApiChannelListByAppId, ApiCreateDoc, ApiDocList } from "@/service/api";
import { useChatStore } from "@/store/chatStore";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { fetchRecentchannelId, useRecentchannelId } from '@/hooks/use-recentchannelId'
import { useEffect } from "react";

export default function DocList() {
    const { t } = useTranslation();
    const { appId, channelId } = useParams();
    const { data: chats } = useSWR([`ApiChatHistory`, appId], () => ApiChannelListByAppId(appId!));
    const { data: docList, mutate } = useSWR([`ApiDocList`, appId], () => ApiDocList(appId!));
    const currentAppInfo = useChatStore(state => state.currentAppInfo);
    const navigate = useNavigate();
    const {
        setRecentchannelId
    } = useRecentchannelId(appId!);

    const createNote = async () => {
        try {
            const resp = await ApiCreateDoc(appId!);
            setRecentchannelId(resp.guid);
            mutate()
            navigate(`/${RouteEnum[currentAppInfo?.type!]}/${appId}/c/${resp.guid}`);
        } catch (error) {
            toast({
                title: t('note-doc-list.Create Fail'),
                description: t('note-doc-list.Create Fail'),
                variant: 'destructive'
            });
        }
    }

    const location = useLocation();
    useEffect(() => {
        if (!appId) return;
        let timer: NodeJS.Timeout | null = null;
        (async () => {
            try {
                const channelId = await fetchRecentchannelId(appId);
                timer = setTimeout(() => {
                    if (channelId) navigate(`/${getFirstPathSegment(location.pathname)}/${appId}/c/${channelId}`);
                }, 10)
            } catch (error) {
                console.error(error);
            }
        })();

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        }
    }, [appId]);

    return (
        <div className="w-60 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
                <div className="bg-white rounded-lg shadow-sm p-4 h-32 flex items-center justify-center mb-3 cursor-pointer"
                    onClick={() => {
                        createNote();
                    }}>
                    <PlusIcon className="w-6 h-6 text-gray-400" />
                </div>
                {/* Document cards */}
                <div className="space-y-3">
                    {/* First card */}
                    {/*<div className="bg-white rounded-lg shadow-sm p-4 h-32 flex items-center justify-center">*/}
                    {/*    <p className="text-gray-500">{t('note-doc-list.Blank')}</p>*/}
                    {/*</div>*/}

                    {/* Second card */}
                    {docList?.map((doc) => {
                        return (
                            <div className={cn("bg-white rounded-lg shadow-sm p-4 h-32 relative cursor-pointer", channelId === doc.channelId ? "bg-blue-500 rounded-lg shadow-sm p-4 h-32 flex items-center justify-center" : "")} onClick={() => {
                                setRecentchannelId(doc.channelId);
                                navigate(`/${RouteEnum[currentAppInfo?.type!]}/${appId}/c/${doc.channelId}`);
                            }}>
                                {/*<div className="absolute top-2 right-2 flex space-x-2">*/}
                                {/*    <div className="bg-gray-100 p-1 rounded-md">*/}
                                {/*        <StarIcon className="w-4 h-4 text-gray-400"/>*/}
                                {/*    </div>*/}
                                {/*    <div className="bg-gray-100 p-1 rounded-md">*/}
                                {/*        <PinIcon className="w-4 h-4 text-gray-400"/>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div className="absolute bottom-2 right-2">*/}
                                {/*    <div className="bg-gray-100 p-1 rounded-full">*/}
                                {/*        <InfoIcon className="w-4 h-4 text-gray-400"/>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                <div className="h-full flex items-center justify-center">
                                    <p className={cn("", channelId === doc.channelId ? "text-white" : "text-gray-500")}>{doc.name}</p>
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
                </div>
            </div>
        </div>
    )
}