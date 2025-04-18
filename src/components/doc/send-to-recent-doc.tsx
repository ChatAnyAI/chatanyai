import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import React from "react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {ApiChannelListByAppId, ApiDocAppendContent, ApiDocContent, ApiDocRecent} from "@/service/api";
import {toast} from "@/hooks/use-toast";
import {useTranslation} from "react-i18next";
import useSWR from "swr";
import {FileText, Send} from "lucide-react";
import {Button} from "@/components/ui/button";
import {MarkdownPlugin} from "@udecode/plate-markdown";
import {
    createPlateEditor,
} from '@udecode/plate/react';

interface SendToRecentDocProps {
    isOpen: boolean;
    referContent: string;
    referChannelId: string;
    referAnchorId: string;
    setIsOpen: (value: boolean) => void;
}

export function SendToRecentDoc(props: SendToRecentDocProps) {
    const {isOpen, setIsOpen,referContent} = props;
    const {t} = useTranslation();
    const {data: documents} = useSWR([`ApiDocRecent`], () => ApiDocRecent());
    const handleSendToDocument = async (appId: string, channelId: string) => {
        // Here you would implement the actual sending logic
        // const processor = unified().use(markdown).use(remarkToSlate);

        // const value = processor.processSync(content).result;
        const editor = createPlateEditor({
            plugins: [
                MarkdownPlugin,
            ],
        });

        const value = editor.api.markdown.deserialize(referContent);
        try {
            // js number to string
           await ApiDocAppendContent(appId, channelId, {
                referContent: value,
                referChannelId: props.referChannelId,
                referAnchorId: props.referAnchorId.toString(),
            });
            toast({
                title: 'Send to Docs Success',
                variant: 'default'
            });
        } catch (error) {
            toast({
                title: 'ApiDocContent Fail',
                description: 'ApiDocContent Fail'+String(error),
                variant: 'destructive'
            });
        }
        setIsOpen(false)
    }
    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md p-6">
                    <DialogHeader>
                        <DialogTitle>Send to recent Docs</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-72 mt-4">
                        <div className="space-y-3 p-1">
                            {documents?.map((doc) => (
                                <div
                                    key={doc.channelId}
                                    onClick={() => handleSendToDocument(doc.appId,doc.channelId)}
                                    className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-all duration-200 hover:shadow-sm"
                                >
                                    <div className="bg-primary/10 p-3 rounded-md">
                                        <FileText className="h-5 w-5 text-primary"/>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-base">{doc.name}</div>
                                        <div className="text-sm text-muted-foreground mt-0.5">
                                            Last Modified: {new Date(doc.updatedAt * 1000).toLocaleString()}
                                        </div>
                                    </div>
                                    <Button size="sm" variant="ghost"
                                            className="ml-auto hover:bg-primary/10 hover:text-primary">
                                        <Send className="h-4 w-4"/>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
}