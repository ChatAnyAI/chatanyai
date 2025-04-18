import {RightSettingProvider} from "@/app/front/aichat/component/rightSetting";
import {InfoIcon, PinIcon, PlusIcon, StarIcon} from "lucide-react";
import {generateUUID} from "@/lib/utils";
import {useNavigate, useParams} from "react-router-dom";
import useSWR from "swr";
import {ApiAppShareCreate, ApiChannelListByAppId, ApiChatShareCreate, ApiCreateDoc, ApiDocList} from "@/service/api";
import {useChatStore} from "@/store/chatStore";
import {toast} from "@/hooks/use-toast";
import {RouteEnum} from "@/lib/constants/constants";
import DocList from "@/app/front/note/component/doc-list";

export default function Page() {
    const channelId = generateUUID();
    const { appId } = useParams();
    return (
        <RightSettingProvider>
            <div className="flex" >
                {/* Sidebar */}
                <DocList />
                {/* Main content */}
                <div className="h-screen " data-registry="plate">
                    {/*<CoreEditor*/}
                    {/*    appId={appId!}*/}
                    {/*    channelId={channelId}*/}
                    {/*/>*/}
                </div>
            </div>
        </RightSettingProvider>
    );
}