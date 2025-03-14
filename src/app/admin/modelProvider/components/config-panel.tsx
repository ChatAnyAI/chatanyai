"use client"

import React, {useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {ExternalLink, Eye, EyeOff, Settings} from "lucide-react"
import {RespModelProviderInfo} from "@/service/admin";
import {useForm}from "react-hook-form";
import {zodResolver}from "@hookform/resolvers/zod";
import * as z from "zod"
import {Switch}from "@/components/ui/switch";

type ProviderListProps = {
    onSubmit: (providerId: number, data: ProviderFormValues) => void
    modelProvider: string
    provider: RespModelProviderInfo|undefined
}

// define form validation schema
const providerFormSchema = z.object({
    apiKey: z.string(),
    apiHost: z.string(),
    keepAliveTime: z.number(),
    enabled: z.number(),
    // modelList: z.array(z.object({
    //     modelId: z.string(),
    //     modelName: z.string(),
    //     enabled: z.number(),
    // })),
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

export function ConfigPanel({ provider,onSubmit, modelProvider }: ProviderListProps) {
    const [isActive, setIsActive] = useState(false)

  
  const [showApiKey, setShowApiKey] = useState(false)

  const handleSubmit = async (data: ProviderFormValues) => {
        onSubmit(provider?.id!, data)
  }




    // Add form-related code in the component
    const form = useForm<ProviderFormValues>({
        resolver: zodResolver(providerFormSchema),
        defaultValues: {},
    })

    // Update default form values
    useEffect(() => {
        if (provider) {
            form.reset({
                apiKey: provider.apiKey,
                apiHost: provider.apiHost,
                keepAliveTime: provider.keepAliveTime,
                enabled: provider.enabled,
            })
            // Initialize state in useEffect
            setIsActive(provider.enabled === 1)
        }
    }, [provider, form])

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
              <h2 className="text-lg font-semibold">API Key</h2>
              <div className="flex gap-2">
                  <div className="relative flex-1">
                      <Input type={showApiKey ? "text" : "password"} placeholder="Enter your API key"
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
                  <Button  type="button" >Check</Button>
              </div>
              {form.formState.errors.apiKey && (
                  <p className="text-sm text-destructive">{form.formState.errors.apiKey.message}</p>
              )}
          </div>

          <div className="space-y-4">
              <h2 className="text-lg font-semibold">API Host</h2>
              <div className="flex gap-2">
                  <Input value={provider?.apiHost}/>
                  <Button  type="button"  variant="outline">Reset</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                  Ending with /v1/ ignores v1, ending with # forces use of input address
              </p>
              {form.formState.errors.apiHost && (
                  <p className="text-sm text-destructive">{form.formState.errors.apiHost.message}</p>
              )}
          </div>

          <div className="space-y-4">
              <h2 className="text-lg font-semibold">Keep Alive Time</h2>
              <div className="flex gap-2 items-center">
                  <Input type="number" defaultValue="0" className="w-32"   {...form.register("keepAliveTime", { valueAsNumber: true})}/>
                  <span>Minutes</span>
              </div>
              <p className="text-sm text-muted-foreground">
                  The time in minutes to keep the connection alive, default is 5 minutes.
              </p>
              {form.formState.errors.keepAliveTime && (
                  <p className="text-sm text-destructive">{form.formState.errors.keepAliveTime.message}</p>
              )}
          </div>

          <div className="space-y-4">
              <h2 className="text-lg font-semibold">Models</h2>
              {provider?.modelList?.map((model) => (
                  <div key={model.modelId} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-blue-500"/>
                          <span>{model.modelName}</span>
                          <Button  type="button"  variant="ghost" size="icon">
                              <Settings className="w-4 h-4"/>
                          </Button>
                      </div>
                      {!!model.enabled ? (
                          <Button  type="button"  variant="ghost" size="icon" className="text-emerald-500">
                              <Eye className="w-4 h-4"/>
                          </Button>
                      ) : (
                          <Button  type="button"  variant="ghost" size="icon" className="text-destructive">
                              <EyeOff className="w-4 h-4"/>
                          </Button>
                      )}
                  </div>
              ))}

              <div className="flex gap-2">
                  <Button type="submit"  className="bg-emerald-500 hover:bg-emerald-600">Save</Button>
                  <Button type="button" variant="outline">Add</Button>
              </div>

              <p className="text-sm text-muted-foreground">
                  Check{" "}
                  <a className="text-blue-500">
                      Ollama Docs
                  </a>{" "}
                  and{" "}
                  <a className="text-blue-500">
                      Models
                  </a>{" "}
                  for more details
              </p>
          </div>
      </form>
  )
}

