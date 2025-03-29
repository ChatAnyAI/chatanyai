import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTranslation } from 'react-i18next';

interface SettingData {
    showDivider: boolean;
    useSerifFont: boolean;
    messageFontSize: number;
    showTokens: boolean;
    pasteLongText: boolean;
    frequencyPenalty?: number; // Optional: Frequency penalty, >= -2 and <= 2
    maxTokens?: number;        // Optional: Maximum tokens, > 1
    presencePenalty?: number;  // Optional: Presence penalty, >= -2 and <= 2
    temperature?: number;      // Optional: Sampling temperature, <= 2
    topP?: number;            // Optional: Nucleus sampling parameter, <= 1
}

interface RightSettingContextType {
    showSettings: boolean;
    setShowSettings: (showSettings: boolean) => void;
    settingData: SettingData;
    updateSettingData: (data: Partial<SettingData>) => void;
}

export const RightSettingContext = React.createContext<RightSettingContextType>({
    showSettings: true,
    setShowSettings: () => { },
    settingData: {
        temperature: 1,      // Default sampling temperature set to a moderate value
        topP: 0.9,           // Default topP set to a relatively high value for diversity
        maxTokens: 2048,     // Default max token count set to a moderate value
        frequencyPenalty: 0.2,  // Default frequency penalty set to a slightly positive value
        presencePenalty: 0.2,   // Default presence penalty set to a slightly positive value
        showDivider: true,
        useSerifFont: true,
        messageFontSize: 14,
        showTokens: true,
        pasteLongText: false
    },
    updateSettingData: () => { }
})

export function RightSettingProvider({ children }: React.PropsWithChildren<{}>) {
    const [showSettings, setShowSettings] = React.useState(false);
    const [settingData, setSettingData] = React.useState<SettingData>({
        temperature: 1,      // Default sampling temperature set to a moderate value
        topP: 0.9,           // Default topP set to a relatively high value for diversity
        maxTokens: 2048,     // Default max token count set to a moderate value
        frequencyPenalty: 0.2,  // Default frequency penalty set to a slightly positive value
        presencePenalty: 0.2,   // Default presence penalty set to a slightly positive value
        showDivider: false,
        useSerifFont: false,
        messageFontSize: 14,
        showTokens: false,
        pasteLongText: false
    });
    const updateSettingData = (data: Partial<SettingData>) => {
        setSettingData({ ...settingData, ...data });
    };
    return (
        <RightSettingContext.Provider value={{ showSettings, setShowSettings, settingData, updateSettingData }}>
            {children}
        </RightSettingContext.Provider>
    )
}

export const useRightSetting = () => {
    return React.useContext(RightSettingContext);
}

export function RightSidebar() {
    const { t } = useTranslation();
    const {
        settingData, updateSettingData, showSettings
    } = React.useContext(RightSettingContext);

    if (!showSettings) {
        return null;
    }

    return (
        <ScrollArea className="h-screen w-80 border-l p-6 space-y-8">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">{t('rightSetting.Model Settings')}</h2>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Info className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>{t('rightSetting.Temperature')}</Label>
                            <Slider value={[settingData.temperature || 0]} max={2} step={0.1} onValueChange={([value]) => updateSettingData({ temperature: value })} />
                        </div>

                        {/* <div className="space-y-2">
                        <Label>Top P</Label>
                        <Slider value={[settingData.topP || 0]} max={1} step={0.1} onValueChange={([value]) => updateSettingData({ topP: value })} />
                    </div> */}

                        <div className="space-y-2">
                            <Label>{t('rightSetting.Max Tokens')}</Label>
                            <Slider value={[settingData.maxTokens || 1]} min={1} max={4096} step={1} onValueChange={([value]) => updateSettingData({ maxTokens: value })} />
                        </div>

                        <div className="space-y-2">
                            <Label>{t('rightSetting.Frequency Penalty')}</Label>
                            <Slider value={[settingData.frequencyPenalty || 0]} min={-2} max={2} step={0.1} onValueChange={([value]) => updateSettingData({ frequencyPenalty: value })} />
                        </div>

                        <div className="space-y-2">
                            <Label>{t('rightSetting.Presence Penalty')}</Label>
                            <Slider value={[settingData.presencePenalty || 0]} min={-2} max={2} step={0.1} onValueChange={([value]) => updateSettingData({ presencePenalty: value })} />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">{t('rightSetting.Message Settings')}</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>{t('rightSetting.Show divider between messages')}</Label>
                            <Switch checked={settingData.showDivider} onCheckedChange={(checked) => updateSettingData({ showDivider: checked })} />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label>{t('rightSetting.Use serif font')}</Label>
                            <Switch checked={settingData.useSerifFont} onCheckedChange={(checked) => updateSettingData({ useSerifFont: checked })} />
                        </div>

                        <div className="space-y-2">
                            <Label>{t('rightSetting.Message Font Size')}</Label>
                            <Slider value={[settingData.messageFontSize]} max={100} step={1} onValueChange={([value]) => updateSettingData({ messageFontSize: value })} />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">{t('rightSetting.Input Settings')}</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>{t('rightSetting.Show estimated input tokens')}</Label>
                            <Switch checked={settingData.showTokens} onCheckedChange={(checked) => updateSettingData({ showTokens: checked })} />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label>{t('rightSetting.Paste long text as file')}</Label>
                            <Switch checked={settingData.pasteLongText} onCheckedChange={(checked) => updateSettingData({ pasteLongText: checked })} />
                        </div>
                    </div>
                </div>
        </ScrollArea>
    )
}

