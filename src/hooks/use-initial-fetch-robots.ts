import { useChatStore } from "@/store/chatStore";
import { useEffect } from "react";


export function useInitialFetchRobots() {
    const fetchFavoriteAppList = useChatStore(state => state.fetchFavoriteAppList);
    const fetchAppList = useChatStore(state => state.fetchAppList);
    const favoriteAppList = useChatStore(state => state.favoriteAppList);
    const appList = useChatStore(state => state.appList);


    useEffect(() => {
        fetchFavoriteAppList();
        fetchAppList();
    }, [fetchFavoriteAppList, fetchAppList])

    return {
        favoriteAppList,
        appList
    };
}