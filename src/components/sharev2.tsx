"use client"

import { useCallback, useState } from "react"
import { ChevronDown, Copy, HelpCircle, Lock, Check, Users, Earth } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InviteScreen } from "@/components/share/invite-screen"
import { AppType, AppVisibility, RouteEnum } from "@/lib/constants/constants";
import { toast } from "@/hooks/use-toast";
import { ApiAppShareUserList, ApiChatShareList, User, ApiAppShareDelete, ApiChatShareDelete } from "@/service/api";
import useSWR from "swr";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AccessLevelDropdown } from "@/components/share/access-level-dropdown";
// import { useVisibility } from "@/hooks/use-chat-visibility";

export default function ShareDialog({ appId, chatId, type, visibility: accessType, handleVisibilityChange }:
    {
        appId: string;
        chatId: string;
        type?: AppType;
        visibility: AppVisibility;
        handleVisibilityChange: (newVisibility: AppVisibility) => void;
    }) {
    const [showInviteScreen, setShowInviteScreen] = useState(false)

    const { data: shareUser, mutate } = useSWR(
        chatId ? ['ApiChatShareList', chatId] : ['ApiAppShareUserList', appId],
        () => chatId ? ApiChatShareList(chatId) : ApiAppShareUserList(appId)
    )

    const handleDelete = useCallback(async (user: User) => {
        if (chatId) {
            await ApiChatShareDelete(chatId, user.id);
        } else {
            await ApiAppShareDelete(appId, user.id);
        }
        toast({
            title: 'Delete user success',
        });
        mutate();
    }, [appId, chatId, mutate]);


    return (
        <div className="">
            <div className="w-[400px]">
                {showInviteScreen ? (
                    <InviteScreen
                        shareUser={shareUser || []}
                        appId={appId!}
                        chatId={chatId}
                        onBack={() => { 
                            setShowInviteScreen(false);
                            mutate();
                        }}
                    />
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="border-b">
                            <div className="flex">
                                <button className="px-4 py-3 font-medium text-gray-900 border-b-2 border-gray-900 text-sm">
                                    Share
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col h-full">
                            <div className="p-4 pb-0">
                                {/* Email input and invite button */}
                                <div className="flex space-x-2 mb-4">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            placeholder="Email or group, separated by commas"
                                            className="w-full px-3 py-2 text-sm border rounded-lg border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                            onClick={() => setShowInviteScreen(true)}
                                        />
                                    </div>
                                    <button className="px-4 py-2 text-sm bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors" onClick={() => setShowInviteScreen(true)}>
                                        Invite
                                    </button>
                                </div>
                            </div>

                            {/* Users list - with visible scrollbar */}
                            {shareUser && <div className="overflow-y-auto px-4 max-h-[280px]">
                                <div className="space-y-1">
                                    {shareUser.map((user) => (
                                        <div key={user.id} className="flex items-center justify-between py-2">
                                            <div className="flex items-center space-x-2">
                                                <Avatar className="h-8 w-8 rounded-lg">
                                                    <AvatarImage src={user.avatar} alt={user.name} />
                                                    <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-medium text-sm">{user.name}</span>
                                                        {/*{user.isYou && <span className="text-gray-400 text-xs">(You)</span>}*/}
                                                        {/*{user.isGuest && (*/}
                                                        {/*    <Badge*/}
                                                        {/*        variant="secondary"*/}
                                                        {/*        className="bg-orange-100 text-orange-800 hover:bg-orange-100 px-1.5 py-0 text-[10px]"*/}
                                                        {/*    >*/}
                                                        {/*        Guest*/}
                                                        {/*    </Badge>*/}
                                                        {/*)}*/}
                                                    </div>
                                                    <div className="text-gray-500 text-xs">{user.email}</div>
                                                </div>
                                            </div>
                                            <AccessLevelDropdown onDelete={() => handleDelete(user)} />
                                        </div>
                                    ))}
                                </div>
                            </div>}

                            {/* General access section - fixed at bottom */}
                            <div className="mt-auto">
                                <div className="border-t bg-white">
                                        <div className="p-4 space-y-2">
                                        <div className="text-gray-500 text-xs">General access</div>
                                        <div className="flex items-center justify-between">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                    <div className="flex items-center space-x-2 p-1.5">
                                                        {(() => {
                                                            switch (accessType) {
                                                                case AppVisibility.Private:
                                                                    return (
                                                                        <>
                                                                            <div
                                                                                className="w-8 h-8 rounded-full flex items-center justify-center">
                                                                                <Lock
                                                                                    className="h-4 w-4 text-gray-500" />
                                                                            </div>
                                                                            <div>
                                                                                <div className="flex items-center">
                                                                                    <span className="font-medium text-sm">
                                                                                        <span>Only people invited</span>
                                                                                    </span>
                                                                                    <ChevronDown className="ml-0.5 h-4 w-4 text-gray-400" />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    );
                                                                case AppVisibility.Internal:
                                                                    return (
                                                                        <>
                                                                            <div
                                                                                className="w-8 h-8 rounded-full flex items-center justify-center">
                                                                                <Users
                                                                                    className="h-4 w-4 text-gray-500" />
                                                                            </div>
                                                                            <div>
                                                                                <div className="flex items-center">
                                                                                    <span className="font-medium text-sm">
                                                                                        <span>Everyone at Your Team</span>
                                                                                    </span>
                                                                                    <ChevronDown className="ml-0.5 h-4 w-4 text-gray-400" />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    );
                                                                case AppVisibility.Public:
                                                                    return (
                                                                        <>
                                                                            <div
                                                                                className="w-8 h-8 rounded-full flex items-center justify-center">
                                                                                <Earth
                                                                                    className="h-4 w-4 text-gray-500" />
                                                                            </div>
                                                                            <div>
                                                                                <div className="flex items-center">
                                                                                    <span className="font-medium text-sm">
                                                                                        <span>Everyone with the link</span>
                                                                                    </span>
                                                                                    <ChevronDown className="ml-0.5 h-4 w-4 text-gray-400" />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    );
                                                                default:
                                                                    return null;
                                                            }
                                                        })()}
                                                    </div>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start" className="w-[250px]">
                                                    <DropdownMenuItem
                                                        className="flex items-center space-x-2 py-2 px-3"
                                                        onClick={() => handleVisibilityChange(AppVisibility.Private)}
                                                    >
                                                        <Lock className="h-4 w-4 text-gray-500" />
                                                        <span className="flex-grow text-sm">Only people invited</span>
                                                        {accessType === AppVisibility.Private && <Check className="h-3.5 w-3.5" />}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="flex items-center space-x-2 py-2 px-3"
                                                        onClick={() => handleVisibilityChange(AppVisibility.Internal)}
                                                    >
                                                        <div className="w-4 h-4 rounded-full flex items-center justify-center">
                                                            <Users />
                                                        </div>
                                                        <span className="flex-grow text-sm">Everyone at Your Team</span>
                                                        {accessType === AppVisibility.Internal && <Check className="h-3.5 w-3.5" />}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="flex items-center space-x-2 py-2 px-3"
                                                        onClick={() => handleVisibilityChange(AppVisibility.Public)}
                                                    >
                                                        <div className="w-4 h-4 rounded-full flex items-center justify-center">
                                                            <Earth />
                                                        </div>
                                                        <span className="flex-grow text-sm">Everyone with the link</span>
                                                        {accessType === AppVisibility.Public && <Check className="h-3.5 w-3.5" />}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <AccessLevelDropdown />
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-4 py-3 border-t flex justify-between items-center bg-white">
                                    <button className="flex items-center text-gray-500 hover:text-gray-700 text-xs">
                                        <HelpCircle className="h-4 w-4 mr-1" />
                                        <span>Learn about sharing</span>
                                    </button>
                                    <button className="flex items-center px-3 py-1.5 border rounded-lg hover:bg-gray-50 text-xs" onClick={async () => {
                                        try {
                                            let url;
                                            if (!appId) return;
                                            url = `/${RouteEnum[type!]}/${appId}`;
                                            await navigator.clipboard.writeText(chatId ? window.location.href : window.location.origin + url);
                                            toast({
                                                title: 'Copy OK',
                                                description: 'Copy OK'
                                            });
                                        } catch (error) {
                                            toast({
                                                title: 'Copy Error',
                                                description: 'Copy Error',
                                                variant: 'destructive'
                                            });
                                        }
                                    }}>
                                        <Copy className="h-4 w-4 mr-1" />
                                        <span>Copy link</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

