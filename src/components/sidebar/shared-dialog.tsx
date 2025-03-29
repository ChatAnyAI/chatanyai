"use client"

import * as React from "react"
import { File, Share2, ExternalLink } from "lucide-react"
import { SidebarDialog, SidebarOverlay } from "./sidebar-dialog"
import { ApiShareWithMeList, RespChat } from '@/service/api'
import useSWR from "swr"
import { useNavigate } from "react-router-dom"
import { AppIcons, RouteEnum, AppType } from "@/lib/constants/constants"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useTranslation } from "react-i18next"

// Initialize dayjs plugin for relative time
dayjs.extend(relativeTime)

interface SharedItemsDialogProps {
    isOpen: boolean
    onClose: () => void
}

export function SharedDialog({ isOpen, onClose }: SharedItemsDialogProps) {
    const { t } = useTranslation()
    const router = useNavigate();
    const { data: items, isLoading } = useSWR("ApiShareWithMeList", ApiShareWithMeList);

    const checkSidebarClick = React.useCallback((target: HTMLElement) => {
        return target.closest("[data-sidebar]") !== null;
    }, []);

    // Handle navigation to app or chat
    const handleItemClick = (item: any) => {
        if (item.chat?.id) {
            const route = RouteEnum[item.chat.type as AppType] || 's';
            router(`/${route}/${item.chat.appId}/c/${item.chat.id}`);
            onClose();
        } else if (item.app) {
            const route = RouteEnum[item.app.type as AppType] || 's';
            router(`/${route}/${item.app.guid}`);
            onClose();
        }
    };

    // Get icon for app or chat type
    const getItemIcon = (item: any) => {
        let type: AppType;

        if (item.app && !item.chat?.id) {
            type = item.app.type;
        } else if (item.chat) {
            type = item.chat.type;
        } else {
            return <File className="h-6 w-6 text-muted-foreground" />;
        }

        const IconComponent = AppIcons[type]?.icon || File;
        const color = AppIcons[type]?.color || "#6c757d";

        return <IconComponent className="h-8 w-8" style={{ color }} />;
    };

    if (!isOpen) return null;

    return (
        <>
            <SidebarOverlay onClick={onClose} />
            <SidebarDialog
                title={t("sidebar.Shared with me")}
                onClose={onClose}
                isSidebarClick={checkSidebarClick}
            >
                {isLoading ? (
                    <div className="p-4 space-y-4 w-full">
                        {Array(3).fill(0).map((_, i) => (
                            <div key={i} className="flex items-start gap-3 w-full">
                                <Skeleton className="h-10 w-10 shrink-0 rounded-md" />
                                <div className="space-y-2 flex-1 min-w-0">
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : items && items.length > 0 ? (
                    <ScrollArea className="h-full w-full">
                        <div className="p-3 space-y-2 w-full">
                            {items.map((item, index) => {
                                const isApp = !item.chat?.id;
                                const data = isApp ? item.app : item.chat;

                                if (!data) return null;

                                return (
                                    <React.Fragment key={index}>
                                        <div
                                            className="flex items-center p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors w-full"
                                            onClick={() => handleItemClick(item)}
                                        >
                                            <div className="flex items-center gap-2 shrink-0">
                                                {getItemIcon(item)}
                                            </div>
                                            <div className="flex-1 min-w-0 ml-2">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-medium truncate">{item.fromUser.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {t('shared-dialog.shared')}
                                                    </span>
                                                    <h3 className="text-xs truncate flex-1">
                                                        {isApp ? data.name : (data as RespChat).title}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground whitespace-nowrap">
                                                {dayjs.unix(data.createdAt).fromNow()}
                                            </div>
                                            <ExternalLink className="h-4 w-4 text-muted-foreground ml-2" />
                                        </div>
                                        {index < items.length - 1 && <hr className="my-2" />}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            <Share2 className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <h3 className="mb-1 text-base font-medium">{t('shared-dialog.Nothing shared with you yet')}</h3>
                        <p className="text-xs text-muted-foreground max-w-[240px]">
                            {t('shared-dialog.When someone shares an app or chat with you, it will appear here.')}
                        </p>
                    </div>
                )}
            </SidebarDialog>
        </>
    );
}

