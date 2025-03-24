// 'use client'
import { useState } from 'react';
import { Chat } from '@/components/chat/chat';
import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/chat/data-stream-handler';
import { useParams } from "react-router-dom";
import { RightSettingProvider } from '@/app/front/aichat/component/rightSetting';
import { useChatStore } from '@/store/chatStore';
import ChatPDFUpload from './component/pdf-upload';
import { ChatHeader } from '@/components/chat/chat-header';
import PdfViewV2 from "@/app/front/chatpdf/component/pdfv2-preview";

export default function Page() {
    const id = generateUUID();
    const selectedModelId = useChatStore(state => state.modelSelectedId)
    const { appId } = useParams();
    const [pdfUrl, setPdfUrl] = useState<string>("");

    console.log('pdfUrl', pdfUrl);

    return (
        <RightSettingProvider>

            <div className="flex flex-col h-screen flex-1">
                {
                    !pdfUrl ? null :
                        <ChatHeader
                            chatId={id}
                            isReadonly={false}
                            isNew={true}
                        />
                }

                <div className="flex justify-center flex-1 overflow-hidden">
                    {!pdfUrl ? (
                        appId && <ChatPDFUpload appId={appId}  onPdfUploaded={setPdfUrl} />
                    ) : (
                        <>
                            <PdfViewV2 url={"/" + pdfUrl} />
                            <div className="flex-1 flex overflow-hidden h-full">
                                {selectedModelId && <Chat
                                    hiddenHeader
                                    pdfLink={pdfUrl}
                                    key={id}
                                    id={id}
                                    appId={appId!}
                                    initialMessages={[]}
                                    selectedModelId={selectedModelId}
                                    // selectedVisibilityType={VisibilityTypePrivate}
                                    isNew={true}
                                    isReadonly={false}
                                />}
                                {selectedModelId && <DataStreamHandler id={id} />}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </RightSettingProvider>

    );
}
