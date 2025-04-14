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


export interface AIEmployee {
    id: string
    name: string
    role: string
    capabilities: string[]
    status: "active" | "inactive"
    createdAt: string
    avatarUrl?: string
    mcpEnabled?: boolean
    prompt: string // 添加提示词字段
}

interface AIEmployeeFormProps {
    employee: AIEmployee | null
    onSubmit: (employee: AIEmployee) => void
    onCancel: () => void
}

export default function AIEmployeeForm({ employee, onSubmit, onCancel }: AIEmployeeFormProps) {
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

        const updatedEmployee: AIEmployee = {
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

    // 获取员工名称的首字母作为头像备用显示
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

    // MCP 能力建议
    const mcpCapabilitySuggestions = [
        "工具调用",
        "上下文管理",
        "结构化输出",
        "多轮对话",
        "知识库检索",
        "函数执行",
        "API调用",
        "参数解析",
        "内容审核",
        "图像理解",
        "表格分析",
        "JSON生成",
        "意图识别",
        "事实验证",
        "引用生成",
    ]

    // 生成提示词模板
    const generatePromptTemplate = () => {
        const template = `你是${name || "[AI名称]"}，一个专业的${role || "[角色]"}。
你的主要职责是[描述主要职责]。

能力:
${capabilities.map((cap, index) => `${index + 1}. ${cap}：[描述该能力的具体作用]`).join("\n")}

回应指南:
- [描述回应风格和格式]
- [描述语气和表达方式]
- [描述如何处理不确定情况]
- [描述其他重要指南]

限制:
- [描述限制和边界]
- [描述不应该做什么]
- [描述其他重要限制]`

        setPrompt(template)
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{isEditing ? "编辑 AI 员工" : "创建 AI 员工"}</CardTitle>
                <CardDescription>{isEditing ? "更新 AI 员工的信息和能力" : "添加一个新的 AI 员工到您的团队"}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="basic">基本信息</TabsTrigger>
                            <TabsTrigger value="prompt">提示词设置</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4 mt-4">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
                                <Avatar className="h-20 w-20 border-2 border-muted">
                                    <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
                                    <AvatarFallback className="bg-primary text-lg">{getInitials(name)}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-2 flex-1">
                                    <Label htmlFor="avatarUrl">头像 URL</Label>
                                    <Input
                                        id="avatarUrl"
                                        value={avatarUrl}
                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                        placeholder="输入头像图片 URL（可选）"
                                    />
                                    <p className="text-xs text-muted-foreground">如不提供头像 URL，将使用名称首字母作为头像</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">名称</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="AI 员工名称"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">角色</Label>
                                <Input
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="例如：对话引擎专家、结构化数据专家"
                                    required
                                />
                            </div>

                            <div className="flex items-center space-x-2 my-4">
                                <Checkbox
                                    id="mcpEnabled"
                                    checked={mcpEnabled}
                                    onCheckedChange={(checked) => setMcpEnabled(checked === true)}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <Label
                                        htmlFor="mcpEnabled"
                                        className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        <Cpu className="h-4 w-4 mr-1 text-purple-600" /> 启用 Model Context Protocol (MCP)
                                    </Label>
                                    <p className="text-sm text-muted-foreground">MCP 允许 AI 员工使用高级上下文管理和工具调用能力</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">状态</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="选择状态" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">活跃</SelectItem>
                                        <SelectItem value="inactive">非活跃</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="capabilities">MCP 能力</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="capabilities"
                                        value={newCapability}
                                        onChange={(e) => setNewCapability(e.target.value)}
                                        placeholder="添加 MCP 能力"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                handleAddCapability()
                                            }
                                        }}
                                    />
                                    <Button type="button" onClick={handleAddCapability} disabled={!newCapability.trim()}>
                                        添加
                                    </Button>
                                </div>

                                {mcpEnabled && (
                                    <div className="mt-2">
                                        <p className="text-sm mb-2">常用 MCP 能力:</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {mcpCapabilitySuggestions.map((capability) => (
                                                <Badge
                                                    key={capability}
                                                    variant="outline"
                                                    className={`cursor-pointer bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 ${
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
                                        <p className="text-sm w-full">已选能力:</p>
                                        {capabilities.map((capability, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className={`flex items-center gap-1 ${mcpEnabled ? "bg-purple-100 text-purple-700" : ""}`}
                                            >
                                                {capability}
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-4 w-4 p-0 ml-1"
                                                    onClick={() => handleRemoveCapability(capability)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {capabilities.length === 0 && <p className="text-sm text-muted-foreground mt-2">请添加至少一项能力</p>}
                            </div>
                        </TabsContent>

                        <TabsContent value="prompt" className="space-y-4 mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <Label htmlFor="prompt" className="text-base font-medium">
                                    Prompt 提示词
                                </Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={generatePromptTemplate}
                                    className="flex items-center gap-1"
                                >
                                    <Wand2 className="h-3.5 w-3.5" />
                                    生成模板
                                </Button>
                            </div>
                            <Textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="输入 AI 员工的提示词，定义其行为、能力和限制..."
                                className="min-h-[300px] font-mono text-sm"
                                required
                            />
                            <div className="text-sm text-muted-foreground">
                                <p>提示词是 AI 员工的"身份证"，它定义了 AI 如何理解和执行任务。一个好的提示词应包含：</p>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                    <li>明确的角色定义</li>
                                    <li>详细的能力描述</li>
                                    <li>回应风格和格式指南</li>
                                    <li>行为限制和边界</li>
                                </ul>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        取消
                    </Button>
                    <Button type="submit" disabled={!name.trim() || !role.trim() || capabilities.length === 0 || !prompt.trim()}>
                        {isEditing ? "更新" : "创建"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
