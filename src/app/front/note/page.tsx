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
import DocList from "@/app/front/note/component/doc-list";

export default function Page() {
    const chatId = generateUUID();
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
                    {/*    chatId={chatId}*/}
                    {/*/>*/}
                </div>
            </div>
        </RightSettingProvider>
    );
}