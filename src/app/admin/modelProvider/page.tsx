import { ProviderList } from "./components/provider-list"
import {ConfigPanel, ProviderFormValues} from "./components/config-panel"
import useSWR from "swr";
import {
    ApiAdminModelProviderList,
    ApiAdminProviderUpdate,
    RespModelProviderInfo
} from "@/service/admin";
import { useState} from "react";
import {toast} from "@/hooks/use-toast";

export default function SettingsPage() {

    const [modelProvider,setModelProvider] = useState<string>("siliconflow");
    // const [isLoading, setIsLoading] = useState(false)

    const { data: providerList, error } = useSWR<RespModelProviderInfo[]>('ApiAdminModelProviderList', ApiAdminModelProviderList);
    if (error) return <div>Failed to load providerList</div>;
    if (!providerList) return <div>Loading...</div>;


    const handleUpdateApp = async (providerId: number, data: ProviderFormValues) => {
        // setIsLoading(true)
        try {
            await ApiAdminProviderUpdate(providerId, data)
            toast({
                title: "Provider Update successfully",
                description: `Update provider`,
            })
            // Here you would typically update the users list or refetch data
        } catch (error) {
            // setIsCreateUserModalOpen(false)
            toast({
                title: "Error",
                description:  String(error),
                variant: "destructive",
            })
        } finally {
            // setIsLoading(false)
        }
    }



    return (
        <>
            <ProviderList modelProvider={modelProvider} providerList={providerList} setModelProvider={setModelProvider} />
            <ConfigPanel
                onSubmit={handleUpdateApp}
                modelProvider={modelProvider}
                provider={providerList.find((item) => modelProvider === item.name)}
            />
        </>
    )
}

