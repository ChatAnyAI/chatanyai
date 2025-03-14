import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import EmojiPicker from "./emoji/EmojiPicker";
import emojiData from "./emoji/emojiData";
import { ApiUpdateAppInfo } from "@/service/api";

interface AppUpdateProps {
    appId: string;
    initialName: string;
    initialIcon: string;
    onSuccess?: () => void;
}

export function AppUpdate({ appId, initialName, initialIcon, onSuccess }: AppUpdateProps) {
    const { toast } = useToast();
    const [newName, setNewName] = useState(initialName);
    const [newIcon, setNewIcon] = useState(initialIcon);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleUpdate = async () => {
        try {
            await ApiUpdateAppInfo({
                id: appId,
                name: newName,
                icon: newIcon,
            });
            toast({
                title: "Updated successfully"
            });
            onSuccess?.();
        } catch (error) {
            toast({
                title: "Failed to update",
                variant: "destructive"
            });
        }
    };

    const handleEmojiSelect = (emoji: string) => {
        setNewIcon(emoji);
        setShowEmojiPicker(false);
    };

    return (
        <div
            className="w-96"
        >
            <div className="p-2 space-y-4">
                <div className="flex items-center gap-4">
                    <div
                        className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-accent rounded-lg border"
                        onClick={() => setShowEmojiPicker(true)}
                    >
                        {newIcon}
                    </div>
                    <div className="flex-1">
                        <Input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleUpdate();
                                }
                            }}
                            placeholder="Enter application name"
                            className="h-10"
                            autoFocus
                        />
                    </div>
                </div>
                <div className="absolute z-50 mt-2">
                    <EmojiPicker
                        onEmojiSelect={handleEmojiSelect}
                        config={emojiData}
                        visible={showEmojiPicker}
                        onClose={() => setShowEmojiPicker(false)}
                    />
                </div>
            </div>
        </div>
    );
}