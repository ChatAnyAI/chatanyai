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
import { usePermission } from "@/hooks/use-permission";
import { useTranslation } from "react-i18next";


export default (
    { appInfo, children }:
        { appInfo: AppResp & { isFullAccess?: boolean }; children: ReactNode; hiddenFavorite?: boolean }) => {
    const navigator = useNavigate();
    const triggerRef = React.useRef<HTMLDivElement>(null);
    const [showUpdatePopover, setShowUpdatePopover] = useState(false);
    const { visibility, handleVisibilityChange } = useVisibility(appInfo.visibility, appInfo.id, '');
    const { permission, handlePermissionChange } = usePermission(appInfo.permission, visibility, appInfo.id, '');
    const { t } = useTranslation();

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
                        <DropdownMenuItem onClick={() => {
                            if (!appInfo.id) return;
                            navigator(`/${RouteEnum[appInfo.type]}/${appInfo.id}`);
                        }}>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            {t('sidebar.New Chat')}
                        </DropdownMenuItem>
                        {
                            appInfo.isFullAccess ?
                                <>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <Users className="h-4 w-4 mr-2" />
                                            {t('sidebar.Share')}
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                            <div className="p-0">
                                                <Share
                                                    className={"w-[400px]"}
                                                    appId={appInfo.id}
                                                    channelId=""
                                                    type={appInfo.type}
                                                    visibility={visibility}
                                                    permission={permission}
                                                    handleVisibilityChange={handleVisibilityChange}
                                                    handlePermissionChange={handlePermissionChange}
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
                                        {t("sidebar.Setting")}
                                    </DropdownMenuItem>
                                </> : null
                        }


                    </DropdownMenuContent>
            }
        </DropdownMenu>

    </>
}