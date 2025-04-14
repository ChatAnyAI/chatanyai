"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit2, Trash2, Activity, Calendar, Cpu, MessageSquare, ChevronDown, ChevronUp } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {AIEmployee} from "./employee-form";

interface AIEmployeesListProps {
    employees: AIEmployee[]
    onEdit: (employee: AIEmployee) => void
    onDelete: (id: string) => void
}

export default function AIEmployeesList({ employees, onEdit, onDelete }: AIEmployeesListProps) {
    const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null)
    const [expandedPrompts, setExpandedPrompts] = useState<Record<string, boolean>>({})

    const handleDeleteClick = (id: string) => {
        setEmployeeToDelete(id)
    }

    const confirmDelete = () => {
        if (employeeToDelete) {
            onDelete(employeeToDelete)
            setEmployeeToDelete(null)
        }
    }

    const togglePrompt = (id: string) => {
        setExpandedPrompts((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    // 获取员工名称的首字母作为头像备用显示
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
    }

    // 根据员工ID生成一致的颜色
    const getAvatarColor = (id: string) => {
        const colors = [
            "bg-rose-500",
            "bg-pink-500",
            "bg-fuchsia-500",
            "bg-purple-500",
            "bg-violet-500",
            "bg-indigo-500",
            "bg-sky-500",
            "bg-cyan-500",
            "bg-teal-500",
            "bg-emerald-500",
            "bg-green-500",
            "bg-lime-500",
            "bg-amber-500",
            "bg-orange-500",
            "bg-red-500",
        ]

        // 使用ID的数字部分作为索引
        const numericPart = Number.parseInt(id.replace(/\D/g, "")) || 0
        return colors[numericPart % colors.length]
    }

    if (employees.length === 0) {
        return (
            <div className="text-center p-10 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">暂无 AI 员工，请点击"创建 AI 员工"按钮添加</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map((employee) => (
                    <Card key={employee.id} className="overflow-hidden flex flex-col">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border-2 border-background shadow-md">
                                    <AvatarImage src={employee.avatarUrl || "/placeholder.svg"} alt={employee.name} />
                                    <AvatarFallback className={getAvatarColor(employee.id)}>{getInitials(employee.name)}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-xl">{employee.name}</CardTitle>
                                        {employee.mcpEnabled && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Badge
                                                            variant="outline"
                                                            className="ml-1 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                                                        >
                                                            <Cpu className="h-3 w-3 mr-1" /> MCP
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Model Context Protocol 支持</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                        <Badge variant={employee.status === "active" ? "success" : "secondary"} className="ml-auto">
                                            {employee.status === "active" ? "活跃" : "非活跃"}
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground">{employee.role}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-2 flex-1">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium flex items-center mb-2">
                                        <Activity className="h-4 w-4 mr-1" /> MCP 能力
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {employee.capabilities.map((capability, index) => (
                                            <Badge key={index} variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                                                {capability}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <Collapsible
                                    open={expandedPrompts[employee.id]}
                                    onOpenChange={() => togglePrompt(employee.id)}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium flex items-center">
                                            <MessageSquare className="h-4 w-4 mr-1" /> Prompt 提示词
                                        </h4>
                                        <CollapsibleTrigger asChild>
                                            <Button variant="ghost" size="sm" className="p-0 h-7 w-7">
                                                {expandedPrompts[employee.id] ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </CollapsibleTrigger>
                                    </div>
                                    <CollapsibleContent>
                                        <div className="rounded-md bg-muted p-3 text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                                            {employee.prompt}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>

                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="h-3.5 w-3.5 mr-1" />
                                    创建于 {new Date(employee.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 pt-2 border-t bg-muted/10 mt-auto">
                            <Button variant="ghost" size="sm" onClick={() => onEdit(employee)}>
                                <Edit2 className="h-4 w-4 mr-1" /> 编辑
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(employee.id)}>
                                <Trash2 className="h-4 w-4 mr-1" /> 删除
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <AlertDialog open={!!employeeToDelete} onOpenChange={(open) => !open && setEmployeeToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认删除</AlertDialogTitle>
                        <AlertDialogDescription>您确定要删除这个 AI 员工吗？此操作无法撤销。</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>删除</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

