import {Button} from "@/components/ui/button";
import {DialogFooter} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import React, {useEffect, useState} from "react";
import {RespApiAdminApplicationListItem} from "@/service/admin";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
    AppVisibility,
    AppVisibilityEnum,
} from "@/lib/constants/constants";
import {Switch} from "@/components/ui/switch";
import { useTranslation } from "react-i18next";

interface UpdateAppFormProps {
    onSubmit: (appId: number, data: AppFormValues) => void
    editingApp: RespApiAdminApplicationListItem  | undefined;
    isLoading: boolean
    onCancel: () => void
}

// Define form validation schema
const appFormSchema = z.object({
    visibility: z.nativeEnum(AppVisibility, {
        errorMap: () => ({ message: "Please select a valid status" }),
    }),
    enabled: z.number()
})

export type AppFormValues = z.infer<typeof appFormSchema>
export default function UpdateAppForm({ editingApp, onSubmit, isLoading,onCancel }: UpdateAppFormProps) {
  
    const [isActive, setIsActive] = useState(false)
    const { t } = useTranslation()

    const handleSubmit = async (data: AppFormValues) => {
         onSubmit(editingApp?.id!, data)
    }

    // Add form-related code in the component
    const form = useForm<AppFormValues>({
        resolver: zodResolver(appFormSchema),
        defaultValues: {
            visibility: AppVisibility.Public,
            enabled: 1,
        },
    })

    // Update form default values
    useEffect(() => {

        if (editingApp) {
            form.reset({
                visibility: editingApp.visibility,
                enabled: editingApp.enabled,
            })
            // Initialize state in useEffect
            setIsActive(editingApp.enabled === 1)
        }
    }, [editingApp, form])

    if (!editingApp) {
        return null
    }

    return (
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {editingApp && <div className="grid gap-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-medium">{editingApp.name[0].toUpperCase()}</span>
                    </div>
                    <div>
                        <div className="font-medium text-lg">{editingApp.name}</div>
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label className="text-sm font-medium">{t("edit-app.Visibility")}</Label>
                    <RadioGroup
                        defaultValue={form.getValues("visibility").toString()}
                        onValueChange={(value) => form.setValue("visibility", Number(value) as AppVisibility)}
                        className="flex flex-col space-y-3"
                    >
                        <div className="flex items-center space-x-3">
                            <RadioGroupItem value={AppVisibility.Public.toString()} id="active"/>
                            <Label htmlFor="active" className="font-normal">
                                {t("constant." + AppVisibilityEnum[AppVisibility.Public])}
                            </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                            <RadioGroupItem value={AppVisibility.Private.toString()} id="blocked"/>
                            <Label htmlFor="blocked" className="font-normal">
                                {t("constant." + AppVisibilityEnum[AppVisibility.Private])}
                            </Label>
                        </div>
                    </RadioGroup>
                    {form.formState.errors.visibility && (
                        <p className="text-sm text-destructive">{t("edit-app.Please select")}</p>
                    )}
                </div>
                <div className="grid gap-2">
                    <Label className="text-sm font-medium">{t("edit-app.Enabled")}</Label>
                    <div className="flex items-center justify-between space-x-4">
                        <div className="space-y-0.5">
                            <Label className="text-base">{t("edit-app.App Enabled")}</Label>
                        </div>
                        <Switch
                            checked={isActive}
                            onCheckedChange={(checked) => {
                                setIsActive(checked)
                                form.setValue("enabled", checked ? 1 : 0)
                            }}
                            aria-label="Toggle App status"
                        />
                    </div>
                    {form.formState.errors.enabled && (
                        <p className="text-sm text-destructive">{form.formState.errors.enabled.message}</p>
                    )}
                </div>
            </div>}
            <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    {t("edit-app.Cancel")}
                </Button>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t("edit-app.Updating") : t("edit-app.Update User")}
                </Button>
            </DialogFooter>
        </form>
    )
}