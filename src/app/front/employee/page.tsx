"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {ChevronDown, ChevronUp, MessageSquare, PlusCircle} from "lucide-react"
import AIEmployeesList from "./components/employee-list"
// import AIEmployeeForm from "./employee-form"
import type { AIEmployee } from "./components/employee-form"
// import SampleEmployees from "./sample-employees"
import useSWR from "swr";
import {ApiEmployeeList, ApiEmployeeListResp, ApiHomeRecent, ApiHomeRecentRes} from "@/service/api";
import {useTranslation} from "react-i18next";
import {motion} from "framer-motion";
import {useGlobalStore} from "@/store/globalStore";
import {Link} from "react-router-dom";
import {
    AppLabelEnum,
    AppVisibility,
    AppVisibilityEnum,
    EmployeeStatus,
    EmployeeStatusEnum,
    RouteEnum
} from "@/lib/constants/constants";
import {Icon} from "@/components/workspace-group";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";

export default function AIEmployeesDashboard() {
    const [employees, setEmployees] = useState<AIEmployee[]>([])
    const [isCreating, setIsCreating] = useState(false)
    const [editingEmployee, setEditingEmployee] = useState<AIEmployee | null>(null)
    const { t } = useTranslation();
    const user = useGlobalStore(state => state.user);
    const [expandedPrompts, setExpandedPrompts] = useState<Record<string, boolean>>({})
    const togglePrompt = (id: string) => {
        setExpandedPrompts((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }


    const { data: employeeList, error } = useSWR<ApiEmployeeListResp[]>('ApiEmployeeList', ApiEmployeeList);
    if (error) return <div>{t('home-page.failed-to-load')}</div>;
    if (!employeeList) return (
        <div className="w-full flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    // Load initial data from localStorage if available
    // useEffect(() => {
    //     const savedEmployees = localStorage.getItem("aiEmployees")
    //     if (savedEmployees) {
    //         try {
    //             setEmployees(JSON.parse(savedEmployees))
    //         } catch (e) {
    //             console.error("Failed to parse saved employees", e)
    //         }
    //     }
    // }, [])

    // Save to localStorage whenever employees change
    // useEffect(() => {
    //     localStorage.setItem("aiEmployees", JSON.stringify(employees))
    // }, [employees])

    const handleCreateEmployee = (employee: AIEmployee) => {
        setEmployees([...employees, employee])
        setIsCreating(false)
    }

    const handleUpdateEmployee = (updatedEmployee: AIEmployee) => {
        setEmployees(employees.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp)))
        setEditingEmployee(null)
    }

    const handleDeleteEmployee = (id: string) => {
        setEmployees(employees.filter((emp) => emp.id !== id))
    }

    return (
        <div className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
                {/* Welcome section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 p-5 sm:p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow duration-300"
                >
                    <h1 className="text-xl sm:text-2xl font-bold mb-2">{t('home-page.hello')} {user.name}</h1>
                    <p className="text-muted-foreground">Welcome to Your Team</p>
                </motion.div>
                {/*<div className="flex justify-between items-center">*/}
                {/*    <h2 className="text-2xl font-semibold">Your employees</h2>*/}
                {/*    <Button onClick={() => setIsCreating(true)}>*/}
                {/*        <PlusCircle className="mr-2 h-4 w-4"/>*/}
                {/*        创建 AI 员工*/}
                {/*    </Button>*/}
                {/*</div>*/}
                {/* Recent pages with visual categories */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8 cursor-pointer"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Your employees</h2>
                        <Button variant="ghost" size="sm" className="gap-1">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Create</span>
                        </Button>
                    </div>

                    {employeeList.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {employeeList.map((employee, index) => {
                                let color = "";
                                switch (index % 6) {
                                    case 0:
                                        color = "bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/30"
                                        break;
                                    case 1:
                                        color = "bg-yellow-50 dark:bg-yellow-950/20 hover:bg-yellow-100 dark:hover:bg-yellow-950/30"
                                        break;
                                    case 2:
                                        color = "bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/30"
                                        break;
                                    case 3:
                                        color = "bg-purple-50 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-950/30"
                                        break;
                                    case 4:
                                        color = "bg-indigo-50 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-950/30"
                                        break;
                                    case 5:
                                        color = "bg-pink-50 dark:bg-pink-950/20 hover:bg-pink-100 dark:hover:bg-pink-950/30"
                                        break;
                                }

                                return (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: 0.1 * index }}
                                        whileHover={{ scale: 1.02 }}
                                        key={index}
                                    >
                                        <div
                                              className={`block border rounded-lg p-4 shadow-xs transition-all duration-300 ${color}`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="w-full">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xl">
                                                             <Avatar className="h-16 w-16 border-2 border-background shadow-md">
                                                                <AvatarImage src={employee.avatar} alt={employee.name} />
                                                            </Avatar>
                                                        </span>
                                                        <span
                                                            className="text-xs px-2 py-0.5 rounded-full bg-background/80 text-muted-foreground">
                                                           {employee.role}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-medium truncate">My name is {employee.name}</h3>
                                                    <Collapsible
                                                        open={expandedPrompts[employee.id]}
                                                        onOpenChange={() => togglePrompt(employee.id)}
                                                        className="space-y-2"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-sm font-medium flex items-center">
                                                                My introduction
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
                                                    <div
                                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-2">
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(employee.createdAt * 1000).toLocaleString()}
                                                        </span>
                                                        <div className="flex gap-2">
                                                            <span
                                                                className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${employee.status === EmployeeStatus.Active
                                                                    ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                                                                    : "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20"
                                                                }`}
                                                            >
                                                                {EmployeeStatusEnum[employee.status]}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    ) : (
                        <></>
                        // <EmptyApplications />
                    )}
                </motion.div>


                {/*<AIEmployeesList employeeList={employeeList}/>*/}
                {/*{employees.length === 0 && <SampleEmployees onLoad={setEmployees} />}*/}
            </div>
            {/*{!isCreating && !editingEmployee ? (*/}
            {/*    <>*/}
            {/*        <div className="flex justify-between items-center">*/}
            {/*            <h2 className="text-2xl font-semibold">AI 员工列表</h2>*/}
            {/*            <Button onClick={() => setIsCreating(true)}>*/}
            {/*                <PlusCircle className="mr-2 h-4 w-4" />*/}
            {/*                创建 AI 员工*/}
            {/*            </Button>*/}
            {/*        </div>*/}
            {/*        <AIEmployeesList employees={employees} onEdit={setEditingEmployee} onDelete={handleDeleteEmployee} />*/}
            {/*        {employees.length === 0 && <SampleEmployees onLoad={setEmployees} />}*/}
            {/*    </>*/}
            {/*) : (*/}
            {/*    <AIEmployeeForm*/}
            {/*        employee={editingEmployee}*/}
            {/*        onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee}*/}
            {/*        onCancel={() => {*/}
            {/*            setIsCreating(false)*/}
            {/*            setEditingEmployee(null)*/}
            {/*        }}*/}
            {/*    />*/}
            {/*)}*/}
        </div>
    )
}

