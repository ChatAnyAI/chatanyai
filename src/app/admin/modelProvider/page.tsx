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
import { useTranslation } from "react-i18next";

export default function SettingsPage() {
    const { t } = useTranslation();
    const [modelProvider,setModelProvider] = useState<string>("siliconflow");
    // const [isLoading, setIsLoading] = useState(false)

    const { data: providerList, error, mutate } = useSWR<RespModelProviderInfo[]>('ApiAdminModelProviderList', ApiAdminModelProviderList);
    if (error) return <div>{t("modelProvider-page.Failed to load providerList")}</div>;
    if (!providerList) return <div>{t("modelProvider-page.Loading")}</div>;


    const handleUpdateApp = async (providerId: number, data: ProviderFormValues) => {
        // setIsLoading(true)
        try {
            await ApiAdminProviderUpdate(providerId, data)
            mutate()
            toast({
                title: t("modelProvider-page.Provider Update successfully"),
                description: t("modelProvider-page.Update provider"),
            })
            // Here you would typically update the users list or refetch data
        } catch (error) {
            // setIsCreateUserModalOpen(false)
            toast({
                title: t("modelProvider-page.Error"),
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
                provider={providerList.find((item) => modelProvider === item.name)}
            />
        </>
    )
}

