"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Cpu, Wand2 } from "lucide-react"
import {ApiEmployeeItemResp} from "@/service/api";

interface AIEmployeeFormProps {
    employee: ApiEmployeeItemResp | null
    onSubmit: (employee: ApiEmployeeItemResp) => void
    onCancel: () => void
    isDialog?: boolean
}

export default function AIEmployeeForm({ employee, onSubmit, onCancel, isDialog = false }: AIEmployeeFormProps) {
    const [name, setName] = useState(employee?.name || "")
    const [role, setRole] = useState(employee?.role || "")
    const [status, setStatus] = useState(employee?.status || "active")
    const [capabilities, setCapabilities] = useState<string[]>(employee?.capabilities || [])
    const [newCapability, setNewCapability] = useState("")
    const [avatarUrl, setAvatarUrl] = useState(employee?.avatarUrl || "")
    const [mcpEnabled, setMcpEnabled] = useState(employee?.mcpEnabled || false)
    const [prompt, setPrompt] = useState(employee?.prompt || "")

    const isEditing = !!employee

    const handleAddCapability = () => {
        if (newCapability.trim() && !capabilities.includes(newCapability.trim())) {
            setCapabilities([...capabilities, newCapability.trim()])
            setNewCapability("")
        }
    }

    const handleRemoveCapability = (capability: string) => {
        setCapabilities(capabilities.filter((cap) => cap !== capability))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim() || !role.trim() || capabilities.length === 0 || !prompt.trim()) {
            return
        }

        const updatedEmployee: ApiEmployeeItemResp = {
            id: employee?.id || crypto.randomUUID(),
            name: name.trim(),
            role: role.trim(),
            capabilities,
            status: status as "active" | "inactive",
            createdAt: employee?.createdAt || new Date().toISOString(),
            avatarUrl: avatarUrl.trim() || undefined,
            mcpEnabled,
            prompt: prompt.trim(),
        }

        onSubmit(updatedEmployee)
    }

    // Get initials from name for avatar fallback
    const getInitials = (name: string) => {
        return (
            name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .toUpperCase()
                .substring(0, 2) || "AI"
        )
    }

    // MCP capability suggestions
    const mcpCapabilitySuggestions = [
        "Tool Calling",
        "Context Management",
        "Structured Output",
        "Multi-turn Dialog",
        "Knowledge Retrieval",
        "Function Execution",
        "API Integration",
        "Parameter Parsing",
        "Content Moderation",
        "Image Understanding",
        "Table Analysis",
        "JSON Generation",
        "Intent Recognition",
        "Fact Verification",
        "Citation Generation",
    ]

    // Generate prompt template
    const generatePromptTemplate = () => {
        const template = `You are ${name || "[AI Name]"}, a professional ${role || "[Role]"}.
Your primary responsibility is [describe main responsibilities].

Capabilities:
${capabilities.map((cap, index) => `${index + 1}. ${cap}: [describe how this capability works]`).join("\n")}

Response Guidelines:
- [describe response style and format]
- [describe tone and expression]
- [describe how to handle uncertainty]
- [describe other important guidelines]

Limitations:
- [describe limitations and boundaries]
- [describe what not to do]
- [describe other important limitations]`

        setPrompt(template)
    }

    // If this is in a dialog, we don't need the Card wrapper
    if (isDialog) {
        return (
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-slate-100">
                            <TabsTrigger value="basic" className="data-[state=active]:bg-white data-[state=active]:text-slate-800">
                                Basic Information
                            </TabsTrigger>
                            <TabsTrigger value="prompt" className="data-[state=active]:bg-white data-[state=active]:text-slate-800">
                                Prompt Configuration
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4 mt-4">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
                                <Avatar className="h-20 w-20 border border-gray-200 shadow-sm">
                                    <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
                                    <AvatarFallback className="bg-slate-600 text-lg">{getInitials(name)}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-2 flex-1">
                                    <Label htmlFor="avatarUrl" className="text-gray-700">
                                        Avatar URL
                                    </Label>
                                    <Input
                                        id="avatarUrl"
                                        value={avatarUrl}
                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                        placeholder="Enter avatar image URL (optional)"
                                        className="border-gray-200 focus:border-slate-400 focus:ring-slate-400"
                                    />
                                    <p className="text-xs text-gray-500">If no avatar URL is provided, name initials will be used</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-700">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="AI employee name"
                                    required
                                    className="border-gray-200 focus:border-slate-400 focus:ring-slate-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-gray-700">
                                    Role
                                </Label>
                                <Input
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="e.g., Conversation Expert, Data Specialist"
                                    required
                                    className="border-gray-200 focus:border-slate-400 focus:ring-slate-400"
                                />
                            </div>

                            <div className="flex items-center space-x-2 my-4 p-3 bg-slate-50 rounded-md border border-slate-200">
                                <Checkbox
                                    id="mcpEnabled"
                                    checked={mcpEnabled}
                                    onCheckedChange={(checked) => setMcpEnabled(checked === true)}
                                    className="border-slate-300 text-slate-600 focus:ring-slate-500"
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <Label
                                        htmlFor="mcpEnabled"
                                        className="flex items-center text-sm font-medium leading-none text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        <Cpu className="h-4 w-4 mr-1 text-slate-600" /> Enable Model Context Protocol (MCP)
                                    </Label>
                                    <p className="text-sm text-slate-600">
                                        MCP allows AI employees to use advanced context management and tool calling capabilities
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-gray-700">
                                    Status
                                </Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger id="status" className="border-gray-200 focus:ring-slate-400">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent className="border-gray-200">
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="capabilities" className="text-gray-700">
                                    Capabilities
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="capabilities"
                                        value={newCapability}
                                        onChange={(e) => setNewCapability(e.target.value)}
                                        placeholder="Add capability"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                handleAddCapability()
                                            }
                                        }}
                                        className="border-gray-200 focus:border-slate-400 focus:ring-slate-400"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddCapability}
                                        disabled={!newCapability.trim()}
                                        className="bg-slate-700 hover:bg-slate-800 text-white"
                                    >
                                        Add
                                    </Button>
                                </div>

                                {mcpEnabled && (
                                    <div className="mt-2">
                                        <p className="text-sm mb-2 text-gray-600">Common capabilities:</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {mcpCapabilitySuggestions.map((capability) => (
                                                <Badge
                                                    key={capability}
                                                    variant="outline"
                                                    className={`cursor-pointer bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 ${
                                                        capabilities.includes(capability) ? "opacity-50" : ""
                                                    }`}
                                                    onClick={() => {
                                                        if (!capabilities.includes(capability)) {
                                                            setCapabilities([...capabilities, capability])
                                                        }
                                                    }}
                                                >
                                                    {capability}
                                                    {capabilities.includes(capability) && " ✓"}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {capabilities.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <p className="text-sm w-full text-gray-600">Selected capabilities:</p>
                                        {capabilities.map((capability, index) => {
                                            // Generate different colors for different capabilities
                                            const colorClasses = [
                                                "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200",
                                                "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200",
                                                "bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200",
                                                "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200",
                                                "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200",
                                                "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
                                                "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200",
                                                "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200",
                                            ]

                                            const colorClass = colorClasses[index % colorClasses.length]

                                            return (
                                                <Badge key={index} variant="secondary" className={`flex items-center gap-1 ${colorClass}`}>
                                                    {capability}
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-4 w-4 p-0 ml-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                                                        onClick={() => handleRemoveCapability(capability)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </Badge>
                                            )
                                        })}
                                    </div>
                                )}

                                {capabilities.length === 0 && (
                                    <p className="text-sm text-gray-500 mt-2">Please add at least one capability</p>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="prompt" className="space-y-4 mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <Label htmlFor="prompt" className="text-base font-medium text-gray-700">
                                    Prompt
                                </Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={generatePromptTemplate}
                                    className="flex items-center gap-1 border-slate-200 text-slate-600 hover:bg-slate-50"
                                >
                                    <Wand2 className="h-3.5 w-3.5" />
                                    Generate Template
                                </Button>
                            </div>
                            <Textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Enter the AI employee's prompt, defining its behavior, capabilities, and limitations..."
                                className="min-h-[300px] font-mono text-sm border-gray-200 focus:border-slate-400 focus:ring-slate-400"
                                required
                            />
                            <div className="text-sm text-gray-500 bg-slate-50 p-3 rounded-md border border-slate-200">
                                <p>
                                    The prompt is the AI employee's "identity card" that defines how the AI understands and executes
                                    tasks. A good prompt should include:
                                </p>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                    <li>Clear role definition</li>
                                    <li>Detailed capability descriptions</li>
                                    <li>Response style and format guidelines</li>
                                    <li>Behavioral limitations and boundaries</li>
                                </ul>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="border-gray-200 text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!name.trim() || !role.trim() || capabilities.length === 0 || !prompt.trim()}
                        className="bg-slate-700 hover:bg-slate-800 text-white"
                    >
                        {isEditing ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        )
    }

    return (
        <Card className="w-full border border-gray-200 shadow-sm bg-white">
            <CardHeader className="bg-slate-50 border-b border-gray-100">
                <CardTitle className="text-gray-800">{isEditing ? "Edit AI Employee" : "Create AI Employee"}</CardTitle>
                <CardDescription className="text-gray-500">
                    {isEditing ? "Update your AI employee's information and capabilities" : "Add a new AI employee to your team"}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="pt-6">
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-slate-100">
                            <TabsTrigger value="basic" className="data-[state=active]:bg-white data-[state=active]:text-slate-800">
                                Basic Information
                            </TabsTrigger>
                            <TabsTrigger value="prompt" className="data-[state=active]:bg-white data-[state=active]:text-slate-800">
                                Prompt Configuration
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4 mt-4">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
                                <Avatar className="h-20 w-20 border border-gray-200 shadow-sm">
                                    <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
                                    <AvatarFallback className="bg-slate-600 text-lg">{getInitials(name)}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-2 flex-1">
                                    <Label htmlFor="avatarUrl" className="text-gray-700">
                                        Avatar URL
                                    </Label>
                                    <Input
                                        id="avatarUrl"
                                        value={avatarUrl}
                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                        placeholder="Enter avatar image URL (optional)"
                                        className="border-gray-200 focus:border-slate-400 focus:ring-slate-400"
                                    />
                                    <p className="text-xs text-gray-500">If no avatar URL is provided, name initials will be used</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-700">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="AI employee name"
                                    required
                                    className="border-gray-200 focus:border-slate-400 focus:ring-slate-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-gray-700">
                                    Role
                                </Label>
                                <Input
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="e.g., Conversation Expert, Data Specialist"
                                    required
                                    className="border-gray-200 focus:border-slate-400 focus:ring-slate-400"
                                />
                            </div>

                            <div className="flex items-center space-x-2 my-4 p-3 bg-slate-50 rounded-md border border-slate-200">
                                <Checkbox
                                    id="mcpEnabled"
                                    checked={mcpEnabled}
                                    onCheckedChange={(checked) => setMcpEnabled(checked === true)}
                                    className="border-slate-300 text-slate-600 focus:ring-slate-500"
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <Label
                                        htmlFor="mcpEnabled"
                                        className="flex items-center text-sm font-medium leading-none text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        <Cpu className="h-4 w-4 mr-1 text-slate-600" /> Enable Model Context Protocol (MCP)
                                    </Label>
                                    <p className="text-sm text-slate-600">
                                        MCP allows AI employees to use advanced context management and tool calling capabilities
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-gray-700">
                                    Status
                                </Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger id="status" className="border-gray-200 focus:ring-slate-400">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent className="border-gray-200">
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="capabilities" className="text-gray-700">
                                    Capabilities
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="capabilities"
                                        value={newCapability}
                                        onChange={(e) => setNewCapability(e.target.value)}
                                        placeholder="Add capability"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                handleAddCapability()
                                            }
                                        }}
                                        className="border-gray-200 focus:border-slate-400 focus:ring-slate-400"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddCapability}
                                        disabled={!newCapability.trim()}
                                        className="bg-slate-700 hover:bg-slate-800 text-white"
                                    >
                                        Add
                                    </Button>
                                </div>

                                {mcpEnabled && (
                                    <div className="mt-2">
                                        <p className="text-sm mb-2 text-gray-600">Common capabilities:</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {mcpCapabilitySuggestions.map((capability) => (
                                                <Badge
                                                    key={capability}
                                                    variant="outline"
                                                    className={`cursor-pointer bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 ${
                                                        capabilities.includes(capability) ? "opacity-50" : ""
                                                    }`}
                                                    onClick={() => {
                                                        if (!capabilities.includes(capability)) {
                                                            setCapabilities([...capabilities, capability])
                                                        }
                                                    }}
                                                >
                                                    {capability}
                                                    {capabilities.includes(capability) && " ✓"}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {capabilities.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <p className="text-sm w-full text-gray-600">Selected capabilities:</p>
                                        {capabilities.map((capability, index) => {
                                            // Generate different colors for different capabilities
                                            const colorClasses = [
                                                "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200",
                                                "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200",
                                                "bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200",
                                                "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200",
                                                "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200",
                                                "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
                                                "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200",
                                                "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200",
                                            ]

                                            const colorClass = colorClasses[index % colorClasses.length]

                                            return (
                                                <Badge key={index} variant="secondary" className={`flex items-center gap-1 ${colorClass}`}>
                                                    {capability}
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-4 w-4 p-0 ml-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                                                        onClick={() => handleRemoveCapability(capability)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </Badge>
                                            )
                                        })}
                                    </div>
                                )}

                                {capabilities.length === 0 && (
                                    <p className="text-sm text-gray-500 mt-2">Please add at least one capability</p>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="prompt" className="space-y-4 mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <Label htmlFor="prompt" className="text-base font-medium text-gray-700">
                                    Prompt
                                </Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={generatePromptTemplate}
                                    className="flex items-center gap-1 border-slate-200 text-slate-600 hover:bg-slate-50"
                                >
                                    <Wand2 className="h-3.5 w-3.5" />
                                    Generate Template
                                </Button>
                            </div>
                            <Textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Enter the AI employee's prompt, defining its behavior, capabilities, and limitations..."
                                className="min-h-[300px] font-mono text-sm border-gray-200 focus:border-slate-400 focus:ring-slate-400"
                                required
                            />
                            <div className="text-sm text-gray-500 bg-slate-50 p-3 rounded-md border border-slate-200">
                                <p>
                                    The prompt is the AI employee's "identity card" that defines how the AI understands and executes
                                    tasks. A good prompt should include:
                                </p>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                    <li>Clear role definition</li>
                                    <li>Detailed capability descriptions</li>
                                    <li>Response style and format guidelines</li>
                                    <li>Behavioral limitations and boundaries</li>
                                </ul>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-gray-100 bg-slate-50">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="border-gray-200 text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!name.trim() || !role.trim() || capabilities.length === 0 || !prompt.trim()}
                        className="bg-slate-700 hover:bg-slate-800 text-white"
                    >
                        {isEditing ? "Update" : "Create"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
