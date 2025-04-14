import AIEmployeesDashboard from "./components/employee-dashboard"

export const metadata: any = {
    title: "AI Employee Management",
    description: "Manage your AI employees and their capabilities",
}

export default function EmployeePage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">AI Employee Management</h1>
            <AIEmployeesDashboard />
        </div>
    )
}
