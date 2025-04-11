// import { ModelSelector } from '@/components/chat/model-selector';
import { Button } from '@/components/ui/button';
import { memo, useState } from 'react';
import html2canvas from 'html2canvas-pro';
import { VisibilitySelector } from './visibility-selector';
import { Settings2, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRightSetting } from '@/app/front/aichat/component/rightSetting';
import { useParams } from "react-router-dom";
import { RespChannel } from "@/service/api";
import { useChatStore } from '@/store/chatStore';

function PureChatHeader({
    channelId,
    isReadonly,
    isNew,
    chatInfo,
}: {
    channelId: string;
    isReadonly: boolean;
    isNew?: boolean;
    chatInfo?: RespChannel;
}) {
    const { showSettings, setShowSettings } = useRightSetting();
    const [isExporting, setIsExporting] = useState(false);
    const { channelId: cid } = useParams();
    const currentAppInfo = useChatStore(state => state.currentAppInfo);

    const handleExport = async () => {
        if (isExporting) return;
        setIsExporting(true);
        try {
            const messagesContainer = document.getElementById('messages-container');
            if (!messagesContainer) return;

            const canvas = await html2canvas(messagesContainer, {
                scrollX: 0,
                scrollY: -window.scrollY,
                useCORS: true,
            });

            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = canvas.width;
            finalCanvas.height = canvas.height;
            const ctx = finalCanvas.getContext('2d');

            if (!ctx) return;

            ctx.drawImage(canvas, 0, 0);

            ctx.font = '16px Arial';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const watermarkText = 'ChatAnyAI';
            const padding = 500;

            for (let x = -canvas.width; x < canvas.width * 2; x += padding) {
                for (let y = -canvas.height; y < canvas.height * 2; y += padding) {
                    ctx.fillText(watermarkText, x, y);
                }
            }

            const link = document.createElement('a');
            link.download = `chat-${channelId}.png`;
            link.href = finalCanvas.toDataURL();
            link.click();
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <header data-name="chat-header" className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2 justify-between shadow-md">
            <div className="flex flex-auto min-w-0 items-center gap-2">
                {/*<div>{chatInfo?.title || currentAppInfo?.name}</div>*/}
                {/*{!isNew && !isReadonly && chatInfo && (*/}
                {/*    <VisibilitySelector*/}
                {/*        chatInfo={chatInfo}*/}
                {/*        channelId={channelId}*/}
                {/*    />*/}
                {/*)}*/}
            </div>
            <div className="flex items-center gap-2">
                {
                    !cid ?
                        null : <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExport}
                                disabled={isExporting}
                                className="cursor-pointer"
                            >
                                <Download className={cn("h-4 w-4 mr-2", isExporting && "animate-pulse")} />
                                Export
                            </Button>
                        </>
                }
                {!isNew && !isReadonly && chatInfo && (
                    <VisibilitySelector
                        chatInfo={chatInfo}
                        channelId={channelId}
                    />
                )}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    className={cn("flex-end", showSettings ? "text-primary" : "text-muted-foreground")}
                >
                    <Settings2 className="h-4 w-4" />
                </Button>
            </div>
        </header>
    );
}

export const ChatHeader = memo(PureChatHeader);
