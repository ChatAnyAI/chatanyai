import { MessageCircle, Users, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "./ui/dropdown-menu";
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RouteEnum } from "@/lib/constants/constants";
import { AppResp } from "@/service/api";
import React from "react";
import { AppUpdate } from "./app-update";
import Share from "./sharev2";
import { useVisibility } from "@/hooks/use-visibility";


export default (
    { appInfo, children }:
        { appInfo: AppResp; children: ReactNode; hiddenFavorite?: boolean }) => {
    const navigator = useNavigate();
    // const { toast } = useToast();
    // const { toggleMenu: onClickMenu, activeMenu } = useAppSideBarHistoryListContext();
    const triggerRef = React.useRef<HTMLDivElement>(null);

    // const handleDelete = async () => {
    //     try {
    //         await ApiDatasetDelete(appInfo.id);
    //         toast({
    //             title: "Dataset deleted successfully"
    //         });
    //         // You can add callback or logic to refresh the list here
    //     } catch (error) {
    //         toast({
    //             title: "Failed to delete dataset",
    //             variant: "destructive"
    //         });
    //     }
    // };

    const [showUpdatePopover, setShowUpdatePopover] = useState(false);
    const { visibility, handleVisibilityChange } = useVisibility(appInfo.visibility, appInfo.id, '');

    return <>
        <DropdownMenu onOpenChange={(state) => {
            if (!state) {
                setTimeout(() => {
                    setShowUpdatePopover(false);
                }, 100)
            }
        }}>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            {
                showUpdatePopover ?
                    <DropdownMenuContent align="end" className="w-50" >
                        <DropdownMenuItem ref={triggerRef} style={{ display: 'none' }}>
                        </DropdownMenuItem>
                        <AppUpdate
                            appId={appInfo.id}
                            initialName={appInfo.name}
                            initialIcon={appInfo.icon}
                            onSuccess={() => {
                                triggerRef.current?.click();
                            }}
                        />
                    </DropdownMenuContent> :
                    <DropdownMenuContent align="start" className="w-50">
                        {/* {
                            hiddenFavorite ? null :

                                <DropdownMenuItem onClick={handleFavoriteClick}>
                                    <Star className="h-4 w-4 mr-2" />
                                    {isFavorite ? 'Remove Favorite' : 'Add Favorite'}
                                </DropdownMenuItem>
                        } */}
                        <DropdownMenuItem onClick={() => {
                            if (!appInfo.id) return;
                            navigator(`/${RouteEnum[appInfo.type]}/${appInfo.id}`);
                        }}>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            New Chat
                        </DropdownMenuItem>

{/* 
                        {
                            appInfo.id ?
                                <DropdownMenuItem onClick={() => onClickMenu({
                                    appId: appInfo.id,
                                    name: appInfo.name,
                                })}>
                                    <MessageSquareText className="h-4 w-4 mr-2" />
                                    {activeMenu?.appId === appInfo.id ? 'Hidden' : 'Show'} Chat List
                                </DropdownMenuItem>
                                : null
                        } */}
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <Users className="h-4 w-4 mr-2" />
                                Share
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <div className="p-0">
                                    <Share
                                        appId={appInfo.id}
                                        chatId=""
                                        type={appInfo.type}
                                        visibility={visibility}
                                        handleVisibilityChange={handleVisibilityChange}
                                    />
                                </div>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                            if (!appInfo.id) return;
                            navigator(`/${RouteEnum[appInfo.type]}/${appInfo.id}/setting`);
                        }}>
                            <Settings className="h-4 w-4 mr-2" />
                            Setting
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowUpdatePopover(true)
                        }}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </DropdownMenuItem> */}
                        {/* <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </DropdownMenuItem> */}
                    </DropdownMenuContent>
            }
        </DropdownMenu>

    </>
}