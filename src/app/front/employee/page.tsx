"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {ChevronDown, ChevronUp, Edit2, MessageSquare, PlusCircle, Trash2} from "lucide-react"
import useSWR from "swr";
import {
    ApiEmployeeCreate,
    ApiEmployeeCreateRequest,
    ApiEmployeeList,
    ApiEmployeeItemResp, ApiEmployeeUpdateRequest, ApiEmployeeUpdate, ApiEmployeeDelete,
} from "@/service/api";
import {useTranslation} from "react-i18next";
import {motion} from "framer-motion";
import {useGlobalStore} from "@/store/globalStore";
import {
    EmployeeStatus,
    EmployeeStatusEnum,
} from "@/lib/constants/constants";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import CreateEmployeeForm from "@/app/front/employee/components/create-employee-form";
import {toast} from "@/hooks/use-toast";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import EditEmployeeForm from "@/app/front/employee/components/edit-employee-form";

export default function AIEmployeesDashboard() {
    const [isCreating, setIsCreating] = useState(false)
    const { t } = useTranslation();
    const user = useGlobalStore(state => state.user);
    const [expandedPrompts, setExpandedPrompts] = useState<Record<string, boolean>>({})
    const togglePrompt = (id: number) => {
        setExpandedPrompts((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }
    const [isLoading, setIsLoading] = useState(false)
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)
    const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null)
    const [employeeToEdit, setEmployeeToEdit] = useState<ApiEmployeeItemResp | null>(null)


    const handleEditClick = (employee: ApiEmployeeItemResp) => {
        setEmployeeToEdit(employee)
    }

    const { data: employeeList, error,mutate } = useSWR<ApiEmployeeItemResp[]>('ApiEmployeeList', ApiEmployeeList);
    if (error) return <div>{t('home-page.failed-to-load')}</div>;
    if (!employeeList) return (
        <div className="w-full flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    const handleCreateEmployee = async (data: ApiEmployeeCreateRequest) => {
        setIsLoading(true)
        try {
            await ApiEmployeeCreate(data)
            toast({
                title: t('admin-teamMember-page.User created successfully'),
                description: `${t('admin-teamMember-page.Created user')} ${data.name} ${t('admin-teamMember-page.with role')} ${data.role}`,
            })
            await mutate()
            setIsCreating(false)
            // Here you would typically update the users list or refetch data
        } catch (error) {
            // setIsCreateUserModalOpen(false)
            toast({
                title: t('admin-teamMember-page.Error'),
                description:  String(error),
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }


    const handleUpdateEmployee = async (employeeId: number,data: ApiEmployeeUpdateRequest) => {
        setIsLoading(true)
        try {
            await ApiEmployeeUpdate(employeeId, data)
            toast({
                title: t('admin-teamMember-page.User created successfully'),
                description: t('admin-teamMember-page.Update user'),
            })
            await mutate()
            setEmployeeToEdit(null)
            // Here you would typically update the users list or refetch data
        } catch (error) {
            // setIsCreateUserModalOpen(false)
            toast({
                title: t('admin-teamMember-page.Error'),
                description:  String(error),
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteEmployee = async () => {
        if (!employeeToDelete) {
           return
        }

        setIsLoading(true)
        try {
            await ApiEmployeeDelete(employeeToDelete)
            toast({
                title: t('admin-teamMember-page.User created successfully'),
                description: t('admin-teamMember-page.Update user'),
            })
            await mutate()
            setEmployeeToDelete(null)
            // Here you would typically update the users list or refetch data
        } catch (error) {
            // setIsCreateUserModalOpen(false)
            toast({
                title: t('admin-teamMember-page.Error'),
                description:  String(error),
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8 cursor-pointer"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Your assistants</h2>
                        <Button variant="ghost" size="sm" className="gap-1" onClick={() => setIsCreating(true)}>
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
                                        onMouseEnter={() => setHoveredCard(employee.id)}
                                        onMouseLeave={() => setHoveredCard(null)}
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
                                                    {/* Action buttons only visible on hover */}
                                                    <div
                                                        className={`absolute top-2 right-2 flex gap-1 transition-opacity duration-200 ${hoveredCard === employee.id ? "opacity-100" : "opacity-0"}`}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleEditClick(employee)}
                                                            className="h-8 w-8 bg-white border-slate-200 text-slate-600 hover:text-slate-700 hover:bg-slate-100"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => {
                                                                setEmployeeToDelete(employee.id)
                                                            }}
                                                            className="h-8 w-8 bg-white border-slate-200 text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
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

            </div>

            {/* Create Employee Dialog */}
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogContent className="sm:max-w-[800px] p-0 bg-white">
                    <DialogHeader className="px-6 pt-6 pb-2">
                        <DialogTitle>Create AI Employee</DialogTitle>
                        <DialogDescription>Add a new AI employee to your team</DialogDescription>
                    </DialogHeader>
                    <div className="px-6 pb-6">
                        <CreateEmployeeForm
                            employee={null}
                            onSubmit={handleCreateEmployee}
                            onCancel={() => setIsCreating(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!employeeToDelete} onOpenChange={(open) => !open && setEmployeeToDelete(null)}>
                <AlertDialogContent className="bg-white border border-gray-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this AI employee? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteEmployee} className="bg-gray-800 text-white hover:bg-gray-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Dialog */}
            <Dialog open={!!employeeToEdit} onOpenChange={(open) => !open && setEmployeeToEdit(null)}>
                <DialogContent className="sm:max-w-[800px] p-0 bg-white">
                    <DialogHeader className="px-6 pt-6 pb-2">
                        <DialogTitle>Edit AI Employee</DialogTitle>
                        <DialogDescription>Make changes to the AI employee's information and capabilities</DialogDescription>
                    </DialogHeader>
                    {employeeToEdit && (
                        <div className="px-6 pb-6">
                            <EditEmployeeForm
                                employee={employeeToEdit}
                                onSubmit={handleUpdateEmployee}
                                onCancel={() => setEmployeeToEdit(null)}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    )
}

