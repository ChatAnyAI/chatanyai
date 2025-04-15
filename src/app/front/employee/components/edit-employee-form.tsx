import type React from "react"
import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {ApiEmployeeItemResp, ApiEmployeeUpdateRequest} from "@/service/api";
import { EmployeeStatus, EmployeeStatusEnum} from "@/lib/constants/constants";

interface AIEmployeeFormProps {
    employee: ApiEmployeeItemResp | null
    onSubmit: (employeeId: number,employee: ApiEmployeeUpdateRequest) => void
    onCancel: () => void
}

export default function EditEmployeeForm({ employee, onSubmit, onCancel }: AIEmployeeFormProps) {
    const [name, setName] = useState(employee?.name || "")
    const [role, setRole] = useState(employee?.role || "")
    const [status, setStatus] = useState<EmployeeStatus>(employee?.status || EmployeeStatus.Active)
    const [avatarUrl, setAvatarUrl] = useState(employee?.avatar || "")
    const [prompt, setPrompt] = useState(employee?.prompt || "")


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim() || !role.trim() ||  !prompt.trim()) {
            return
        }

        const updatedEmployee: ApiEmployeeUpdateRequest = {
            name: name.trim(),
            role: role.trim(),
            status: status,
            avatar: avatarUrl.trim(),
            prompt: prompt.trim(),
        }

        onSubmit(employee?.id || 0,updatedEmployee)
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

    // Generate prompt template
    const generatePromptTemplate = () => {
        const template = `You are ${name || "[AI Name]"}, a professional ${role || "[Role]"}.
Your primary responsibility is [describe main responsibilities].

Capabilities:

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

        return (
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
                        <Avatar className="h-20 w-20 border border-gray-200 shadow-sm">
                            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name}/>
                            <AvatarFallback
                                className="bg-slate-600 text-lg">{getInitials(name)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2 flex-1">
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


                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-gray-700">
                            Status
                        </Label>
                        <Select value={status.toString()} onValueChange={(value)=>{
                            setStatus(Number(value) as EmployeeStatus)
                        }}>
                            <SelectTrigger id="status" className="border-gray-200 focus:ring-slate-400">
                                <SelectValue placeholder="Select status"/>
                            </SelectTrigger>
                            <SelectContent className="border-gray-200">
                                <SelectItem value={EmployeeStatus.Active.toString()}>{EmployeeStatusEnum[EmployeeStatus.Active]}</SelectItem>
                                <SelectItem value={EmployeeStatus.Blocked.toString()}>{EmployeeStatusEnum[EmployeeStatus.Blocked]}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="prompt" className="text-base font-medium text-gray-700">
                            Prompt
                        </Label>
                    </div>
                    <Textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter the AI employee's prompt, defining its behavior, capabilities, and limitations..."
                        className="min-h-[300px] font-mono text-sm border-gray-200 focus:border-slate-400 focus:ring-slate-400"
                        required
                    />
                    {/*<div className="text-sm text-gray-500 bg-slate-50 p-3 rounded-md border border-slate-200">*/}
                    {/*    <p>*/}
                    {/*        The prompt is the AI employee's "identity card" that defines how the AI understands*/}
                    {/*        and executes*/}
                    {/*        tasks. A good prompt should include:*/}
                    {/*    </p>*/}
                    {/*    <ul className="list-disc pl-5 mt-1 space-y-1">*/}
                    {/*        <li>Clear role definition</li>*/}
                    {/*        <li>Detailed capability descriptions</li>*/}
                    {/*        <li>Response style and format guidelines</li>*/}
                    {/*        <li>Behavioral limitations and boundaries</li>*/}
                    {/*    </ul>*/}
                    {/*</div>*/}
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
                        disabled={!name.trim() || !role.trim() || !prompt.trim()}
                        className="bg-slate-700 hover:bg-slate-800 text-white"
                    >
                        {"Update"}
                    </Button>
                </div>
            </form>
        )

}
