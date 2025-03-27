import {PlateEditor} from "@/components/editor/plate-editor";
import {RightSettingProvider} from "@/app/front/aichat/component/rightSetting";

export default function Page() {
    return (
        <RightSettingProvider>
            <div className="flex flex-col h-screen flex-1">
                    <PlateEditor />
            </div>
        </RightSettingProvider>
    );
}