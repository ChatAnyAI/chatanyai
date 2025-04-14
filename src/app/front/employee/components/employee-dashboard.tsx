"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import AIEmployeesList from "./employee-list"
import AIEmployeeForm from "./employee-form"
import type { AIEmployee } from "./employee-form"
import SampleEmployees from "./sample-employees"

export default function AIEmployeesDashboard() {
    const [employees, setEmployees] = useState<AIEmployee[]>([])
    const [isCreating, setIsCreating] = useState(false)
    const [editingEmployee, setEditingEmployee] = useState<AIEmployee | null>(null)

    // Load initial data from localStorage if available
    useEffect(() => {
        const savedEmployees = localStorage.getItem("aiEmployees")
        if (savedEmployees) {
            try {
                setEmployees(JSON.parse(savedEmployees))
            } catch (e) {
                console.error("Failed to parse saved employees", e)
            }
        }
    }, [])

    // Save to localStorage whenever employees change
    useEffect(() => {
        localStorage.setItem("aiEmployees", JSON.stringify(employees))
    }, [employees])

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
        <div className="space-y-6">
            {!isCreating && !editingEmployee ? (
                <>
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">AI 员工列表</h2>
                        <Button onClick={() => setIsCreating(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            创建 AI 员工
                        </Button>
                    </div>
                    <AIEmployeesList employees={employees} onEdit={setEditingEmployee} onDelete={handleDeleteEmployee} />
                    {employees.length === 0 && <SampleEmployees onLoad={setEmployees} />}
                </>
            ) : (
                <AIEmployeeForm
                    employee={editingEmployee}
                    onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee}
                    onCancel={() => {
                        setIsCreating(false)
                        setEditingEmployee(null)
                    }}
                />
            )}
        </div>
    )
}

