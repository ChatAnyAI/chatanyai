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

const models = [
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Quick and efficient for most tasks" },
  { id: "gpt-4", name: "GPT-4", description: "More powerful, better at complex tasks" },
  { id: "claude-2", name: "Claude 2", description: "Anthropic's latest language model" },
  { id: "llama-2", name: "LLaMA 2", description: "Open-source model by Meta" },
  { id: "custom", name: "Custom Model", description: "Configure your own model" },
]

export function ModelList() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {models.map((model) => (
        <Dialog key={model.id}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:bg-accent">
              <CardHeader>
                <CardTitle>{model.name}</CardTitle>
                <CardDescription>{model.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Click to configure</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{model.name} Settings</DialogTitle>
              <DialogDescription>
                Configure the settings for {model.name}. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <SettingsForm modelId={model.id} />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}

