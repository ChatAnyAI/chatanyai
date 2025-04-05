"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SettingsForm } from "./settings-form"
import { useTranslation } from "react-i18next"

const models = [
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Quick and efficient for most tasks" },
  { id: "gpt-4", name: "GPT-4", description: "More powerful, better at complex tasks" },
  { id: "claude-2", name: "Claude 2", description: "Anthropic's latest language model" },
  { id: "llama-2", name: "LLaMA 2", description: "Open-source model by Meta" },
  { id: "custom", name: "Custom Model", description: "Configure your own model" },
]

export function ModelList() {
  const { t } = useTranslation();
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {models.map((model) => (
        <Dialog key={model.id}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:bg-accent">
              <CardHeader>
                <CardTitle>{t(`model-list.${model.name}`)}</CardTitle>
                <CardDescription>{t(`model-list.${model.description}`)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t("model-list.Click to configure")}</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t(`model-list.${model.name}`)} {t("model-list.Settings")}</DialogTitle>
              <DialogDescription>
                {t("model-list.Configure the settings for")} {t(`model-list.${model.name}`)}. {t("model-list.Click save when you're done")}
              </DialogDescription>
            </DialogHeader>
            <SettingsForm modelId={model.id} />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}

