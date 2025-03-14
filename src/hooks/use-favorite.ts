import { useState } from "react";
import { ApiAppFavoriteAdd, ApiAppFavoriteDelete } from "@/service/api";
import { useToast } from "@/hooks/use-toast";
import { useChatStore } from "@/store/chatStore";

export function useFavorite(initialState: boolean, appId: string) {
    const [isFavorite, setIsFavorite] = useState(initialState);
    const { toast } = useToast();
    const fetchRobotList = useChatStore(state => state.fetchFavoriteAppList);

    const handleFavoriteClick = async () => {
        try {
            if (isFavorite) {
                await ApiAppFavoriteDelete(appId);
                toast({
                    title: "Removed from favorites"
                });
            } else {
                await ApiAppFavoriteAdd(appId);
                toast({
                    title: "Added to favorites"
                });
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            toast({
                title: "Operation failed",
                variant: "destructive"
            });
        } finally {
            fetchRobotList();
        };
    };

    return {
        isFavorite,
        handleFavoriteClick
    };
}


export function useAppFavorite() {
    const { toast } = useToast();
    const fetchRobotList = useChatStore(state => state.fetchFavoriteAppList);

    const addToFavorite = async (appId: string) => {
        try {
            await ApiAppFavoriteAdd(appId);
            toast({
                title: "Removed from favorites"
            });
        } catch (error) {
            toast({
                title: "Operation failed",
                variant: "destructive"
            });
        } finally {
            fetchRobotList();
        };
    };


    const cacelToFavorite = async (appId: string) => {
        try {
            await ApiAppFavoriteDelete(appId);
            toast({
                title: "Removed from favorites"
            });
        } catch (error) {
            toast({
                title: "Operation failed",
                variant: "destructive"
            });
        } finally {
            fetchRobotList();
        };
    };

    return {
        addToFavorite,
        cacelToFavorite
    };
}
