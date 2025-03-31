import { ModelSelector } from '@/components/chat/model-selector';
import { Button } from '@/components/ui/button';
import { memo, useState } from 'react';
import html2canvas from 'html2canvas-pro';
import { VisibilitySelector } from '@/components/chat/visibility-selector';
import { Settings2, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRightSetting } from '@/app/front/aichat/component/rightSetting';
import { useParams } from "react-router-dom";
import { RespChannel } from "@/service/api";
import { useChatStore } from '@/store/chatStore';

function PureChatHeader({
    chatId,
    isReadonly,
    isNew,
    chatInfo,
}: {
    chatId: string;
    isReadonly: boolean;
    isNew?: boolean;
    chatInfo?: RespChannel;
}) {
    const { showSettings, setShowSettings } = useRightSetting();
    const [isExporting, setIsExporting] = useState(false);
    const { chatId: cid } = useParams();
    const currentAppInfo = useChatStore(state => state.currentAppInfo);


    return (
        <header data-name="chat-header" className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2 justify-between shadow-md">
            <div className="flex flex-auto min-w-0 items-center gap-2">
            </div>
            <div className="flex items-center gap-2">

                {!isNew && !isReadonly && chatInfo && (
                    <VisibilitySelector
                        chatInfo={chatInfo}
                        chatId={chatId}
                    />
                )}
                {!isReadonly && (
                    <ModelSelector
                    />
                )}
                <Button
                    variant="outline"
                    size="sm"
                    // onClick={() => setShowSettings(!showSettings)}
                    className={cn("flex-end", showSettings ? "text-primary" : "text-muted-foreground")}
                >
                    <Settings2 className="h-4 w-4" />
                </Button>
            </div>
        </header>
    );
}

export const ChatHeader = memo(PureChatHeader);
