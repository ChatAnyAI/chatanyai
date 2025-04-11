"use client"

import React, {useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {ExternalLink, Eye, EyeOff, Trash2} from "lucide-react"
import {RespModelProviderInfo}from "@/service/admin";
import {useForm}from "react-hook-form";
import {zodResolver}from "@hookform/resolvers/zod";
import * as z from "zod"
import {Switch}from "@/components/ui/switch";
import { useTranslation } from "react-i18next";

type ProviderListProps = {
    onSubmit: (providerId: number, data: ProviderFormValues) => void
    provider: RespModelProviderInfo | undefined
}

// define form validation schema
const providerFormSchema = z.object({
    apiKey: z.string(),
    apiHost: z.string(),
    keepAliveTime: z.number(),
    enabled: z.number(),
    modelList: z.array(z.object({
        modelId: z.string(),
        modelName: z.string(),
        enabled: z.number(),
    })),
})

/**
 *     id: number;
 *     name: string;
 *     icon: string;
 *     apiKey: string;
 *     apiHost: string;
 *     enabled: number;
 *     modelList: ModelInfo[];
 */


export type ProviderFormValues = z.infer<typeof providerFormSchema>

export function ConfigPanel({ provider,onSubmit }: ProviderListProps) {
    const { t } = useTranslation();
    const [isActive, setIsActive] = useState(false)
    const [showApiKey, setShowApiKey] = useState(false)
    const [isAddingModel, setIsAddingModel] = useState(false)
    const [newModel, setNewModel] = useState({
        modelId: '',
        modelName: '',
        enabled: 1
    })
    const [modelErrors, setModelErrors] = useState({
        modelId: false,
        modelName: false
    })
    const [localModelList, setLocalModelList] = useState<any[]>([])

    const handleSubmit = async (data: ProviderFormValues) => {
        // Set the modelList in the form data before submitting
        const formData = {
            ...data,
            modelList: localModelList
        };
        
        onSubmit(provider?.id!, formData);
    }

    const handleDeleteModel = (modelId: string) => {
        if (!provider) return
        
        const updatedModelList = localModelList.filter(model => model.modelId !== modelId)
        setLocalModelList(updatedModelList)
        // You might need to update the form value as well if you're sending the model list in the form
    }

    const handleToggleModelEnabled = (modelId: string) => {
        if (!provider) return
        
        const updatedModelList = localModelList.map(model => {
            if (model.modelId === modelId) {
                return {
                    ...model,
                    enabled: model.enabled === 1 ? 0 : 1
                }
            }
            return model
        })
        setLocalModelList(updatedModelList)
    }

    const handleAddModel = () => {
        const errors = {
            modelId: newModel.modelId.trim() === '',
            modelName: newModel.modelName.trim() === ''
        };
        
        setModelErrors(errors);
        
        if (errors.modelId || errors.modelName) {
            return; // Stop execution if validation fails
        }
        
        const updatedModelList = [...localModelList, newModel]
        setLocalModelList(updatedModelList)
        // Reset the form and hide it
        setNewModel({
            modelId: '',
            modelName: '',
            enabled: 1
        })
        setIsAddingModel(false)
        setModelErrors({ modelId: false, modelName: false })
    }

    // Add form-related code in the component
    const form = useForm<ProviderFormValues>({
        resolver: zodResolver(providerFormSchema),
        defaultValues: {},
    })

    // Update default form values and initialize model list
    useEffect(() => {
        if (provider) {
            form.reset({
                apiKey: provider.apiKey,
                apiHost: provider.apiHost,
                keepAliveTime: provider.keepAliveTime,
                enabled: provider.enabled,
                modelList: provider.modelList || []
            });
            // Initialize state in useEffect
            setIsActive(provider.enabled === 1);
            // Initialize local model list
            setLocalModelList(provider.modelList || []);
        }
    }, [provider, form]);

    // Update form value whenever localModelList changes
    useEffect(() => {
        if (localModelList) {
            form.setValue("modelList", localModelList);
        }
    }, [localModelList, form]);

    if (!provider) {
        return null
    }

  return (
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex-1 p-6 space-y-6">
          {/* Provider header */}
          <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-1.5">
                  <span className="font-medium">{provider.name}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
              </div>
              <div className="flex items-center justify-between space-x-4">
                  <Switch
                      checked={isActive}
                      onCheckedChange={(checked) => {
                          setIsActive(checked)
                          form.setValue("enabled", checked ? 1 : 0)
                      }}
                  />
              </div>
              {form.formState.errors.enabled && (
                  <p className="text-sm text-destructive">{form.formState.errors.enabled.message}</p>
              )}
          </div>
          <div className="space-y-4">
              <h2 className="text-lg font-semibold">{t("config-panel.API Key")}</h2>
              <div className="flex gap-2">
                  <div className="relative flex-1">
                      <Input type={showApiKey ? "text" : "password"} placeholder={t("config-panel.Enter your API key")}
                             {...form.register("apiKey")} />
                      <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowApiKey(!showApiKey)}
                      >
                          {showApiKey ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                      </Button>
                  </div>
                  <Button type="button">{t("config-panel.Check")}</Button>
              </div>
              {form.formState.errors.apiKey && (
                  <p className="text-sm text-destructive">{form.formState.errors.apiKey.message}</p>
              )}
          </div>

          <div className="space-y-4">
              <h2 className="text-lg font-semibold">{t("config-panel.API Host")}</h2>
              <div className="flex gap-2">
                  <Input {...form.register("apiHost")} />
                  <Button type="button" variant="outline" 
                    onClick={() => form.setValue("apiHost", provider.apiHost)}>{t("config-panel.Reset")}</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                  {t("config-panel.Ending with /v1/ ignores v1, ending with # forces use of input address")}
              </p>
              {form.formState.errors.apiHost && (
                  <p className="text-sm text-destructive">{form.formState.errors.apiHost.message}</p>
              )}
          </div>

          <div className="space-y-4">
              <h2 className="text-lg font-semibold">{t("config-panel.Keep Alive Time")}</h2>
              <div className="flex gap-2 items-center">
                  <Input type="number" defaultValue="0" className="w-32"   {...form.register("keepAliveTime", { valueAsNumber: true})}/>
                  <span>{t("config-panel.Minutes")}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                  {t("config-panel.The time in minutes to keep the connection alive, default is 5 minutes")}
              </p>
              {form.formState.errors.keepAliveTime && (
                  <p className="text-sm text-destructive">{form.formState.errors.keepAliveTime.message}</p>
              )}
          </div>

          <div className="space-y-4">
              <h2 className="text-lg font-semibold">{t("config-panel.Models")}</h2>
              {localModelList.map((model, i) => (
                  <div key={model.modelId} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-white">{i}</div>
                          <span>{model.modelName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                          {!!model.enabled ? (
                              <Button type="button" variant="ghost" size="icon" className="text-emerald-500"
                                     onClick={() => handleToggleModelEnabled(model.modelId)}>
                                  <Eye className="w-4 h-4"/>
                              </Button>
                          ) : (
                              <Button type="button" variant="ghost" size="icon" className="text-destructive"
                                     onClick={() => handleToggleModelEnabled(model.modelId)}>
                                  <EyeOff className="w-4 h-4"/>
                              </Button>
                          )}
                          <Button type="button" variant="ghost" size="icon" className="text-destructive" 
                              onClick={() => handleDeleteModel(model.modelId)}>
                              <Trash2 className="w-4 h-4"/>
                          </Button>
                      </div>
                  </div>
              ))}

              {isAddingModel && (
                  <div className="p-3 border rounded-lg space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                          <div>
                              <label className="text-sm font-medium">{t("config-panel.Model ID")} <span className="text-red-500">*</span></label>
                              <Input 
                                  value={newModel.modelId}
                                  onChange={(e) => setNewModel({...newModel, modelId: e.target.value})}
                                  placeholder={t("config-panel.Model ID")}
                                  className={modelErrors.modelId ? "border-red-500" : ""}
                              />
                              {modelErrors.modelId && (
                                  <p className="text-sm text-red-500 mt-1">{t("config-panel.Model ID is required")}</p>
                              )}
                          </div>
                          <div>
                              <label className="text-sm font-medium">{t("config-panel.Model Name")} <span className="text-red-500">*</span></label>
                              <Input 
                                  value={newModel.modelName}
                                  onChange={(e) => setNewModel({...newModel, modelName: e.target.value})}
                                  placeholder={t("config-panel.Model Name")}
                                  className={modelErrors.modelName ? "border-red-500" : ""}
                              />
                              {modelErrors.modelName && (
                                  <p className="text-sm text-red-500 mt-1">{t("config-panel.Model Name is required")}</p>
                              )}
                          </div>
                      </div>
                      <div className="flex items-center gap-2">
                          <Button type="button" onClick={handleAddModel}>
                              {t("config-panel.Save Model")}
                          </Button>
                          <Button type="button" variant="outline" onClick={() => setIsAddingModel(false)}>
                              {t("config-panel.Cancel")}
                          </Button>
                      </div>
                  </div>
              )}

              <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddingModel(true)}>{t("config-panel.Add")}</Button>
              </div>

              <p className="text-sm text-muted-foreground">
                  {t("config-panel.Check")}{" "}
                  <a className="text-blue-500">
                      {provider.name} {t("config-panel.Docs")}
                  </a>{" "}
                  {t("config-panel.and")}{" "}
                  <a className="text-blue-500">
                      {t("config-panel.Models")}
                  </a>{" "}
                  {t("config-panel.for more details")}
              </p>
              <div className="flex gap-2">
                  <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">{t("config-panel.Save")}</Button>
              </div>
          </div>
      </form>
  )
}

