import { ApiAppInfo, ApiSpaceList, SpaceResp, ApiAiModelList, RespModel, AppResp } from "@/service/api";
import { create } from 'zustand';
import {  } from "@/service/api";
import { NavMenuItem } from "@/components/workspace-group";
import { AppType, RouteEnum } from "@/lib/constants/constants";
import Cookies from "js-cookie";
import {toast} from "@/hooks/use-toast";

type NonFunctionProperties<T> = {
    [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

export type ChatStoreState = {
    favoriteAppList: NavMenuItem[];
    appList: NavMenuItem[];
    notespaceList: NavMenuItem[];
    modelSelectedId: string;
    models: RespModel[];
    fetchAppList: () => void;
    fetchFavoriteAppList: () => void;
    fetchModels: () => void;
    setModelSelectedId: (id: string) => void;
    currentAppInfo: AppResp | null;
    clearCurrentAppInfo: () => void;
    fetchCurrentAppInfo: (appId: string) => void;
};

const initialState: NonFunctionProperties<ChatStoreState> = {
    favoriteAppList: [],
    appList: [],
    notespaceList: [],
    modelSelectedId: Cookies.get('model-id') || '',
    models: [],
    currentAppInfo: null,
};

export const useChatStore = create<ChatStoreState>((set) => ({
    ...initialState,
    fetchAppList: async () => {
        const data = await ApiSpaceList();
        const noteTypeApps: SpaceResp[] = [];
        const restTypeApps: SpaceResp[] = [];
        data.forEach(d => {
            if (d.app.type === AppType.Note) {
                noteTypeApps.push(d);
            } else {
                restTypeApps.push(d);
            }
        });
        set({
            appList: restTypeApps.map(d => {
                return {
                    ...d.app,
                    isFullAccess: d.isFullAccess,
                    spaceId: d.id,
                    url: `/${RouteEnum[d.app.type]}/${d.app.id}`,
                } as NavMenuItem
            }),
            notespaceList: noteTypeApps.map(d => {
                return {
                    ...d.app,
                    isFullAccess: d.isFullAccess,
                    spaceId: d.id,
                    url: `/${RouteEnum[d.app.type]}/${d.app.id}`,
                } as NavMenuItem
            }),
        });
    },
    fetchFavoriteAppList: async () => {
        // const data: AppResp[] = await ApiAppFavoriteList();
        // set({
        //     favoriteAppList: data.map(d => {
        //         return {
        //             ...d,
        //             url: `/${RouteEnum[d.type]}/${d.id}`,
        //         } as NavMenuItem
        //     }),
        // });
    },
    setModelSelectedId: (id: string) => {
        Cookies.set('model-id', id);
        set({
            modelSelectedId: id,
        });
    },
    fetchModels: async () => {
        const data = await ApiAiModelList();
        if (!(data && data.some(d => d.model === initialState.modelSelectedId))) {
            Cookies.set('model-id', data?.[0]?.model);
            set({
                modelSelectedId: data?.[0]?.model,
            });
        }
        set({
            models: data,
        });
    },
    fetchCurrentAppInfo: async (appId: string) => {
        try {
            const res = await ApiAppInfo(appId);
            set({
                currentAppInfo: res,
            });
        }catch (error) {
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description:  String(error),
                    variant: "destructive",
                })
            }else{
                toast({
                    title: "Error",
                    description:  (error as {msg: string}).msg || "Unknown error",
                    variant: "destructive",
                })
            }
        }
    },
    clearCurrentAppInfo: () => {
        set({
            currentAppInfo: null,
        });
    }
}));