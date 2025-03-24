import { useGlobalStore } from "@/store/globalStore";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ApiUserProfile } from "@/service/api";
import useSWR from "swr";


export const useUserValidate = () => {
    const navigator = useNavigate();
    const location = useLocation();
    const user = useGlobalStore(({ user }) => user);
    const setUser = useGlobalStore(({ setUser }) => setUser);
    const { isLoading, data } = useSWR(
        'ApiUserProfile',
        () => ApiUserProfile()
    );

    useEffect(() => {
        if (data) {
            setUser(data)
        }
    }, [data, setUser])

    useEffect(() => {
        if (!isLoading && !data?.id && location.pathname !== '/login') {
            navigator('/login')
        }
    }, [isLoading, user, location.pathname, navigator])


    return user;
}