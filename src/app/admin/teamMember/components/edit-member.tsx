import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {DialogFooter} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import React, {useEffect} from "react";
import { RespApiAdminTeamMemberListItem} from "@/service/admin";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {UserRole, UserRoleEnum, UserStatus, UserStatusEnum} from "@/lib/constants/constants";
import {Input} from "@/components/ui/input";

interface UpdateUserFormProps {
    onSubmit: (teamMemberId: number, data: UserFormValues) => void
    editingUser: RespApiAdminTeamMemberListItem  | undefined;
    isLoading: boolean
}

// Define form validation schema
const userFormSchema = z.object({
    email: z.string().email("Invalid email address"),
    status: z.nativeEnum(UserStatus, {
        errorMap: () => ({ message: "Please select a valid status" }),
    }),
    role: z.nativeEnum(UserRole, {
        errorMap: () => ({ message: "Please select a valid role" }),
    }),
})

export type UserFormValues = z.infer<typeof userFormSchema>
export default function UpdateUserForm({ editingUser, onSubmit, isLoading }: UpdateUserFormProps) {
  
    const handleSubmit = async (data: UserFormValues) => {
         onSubmit(editingUser?.teamMemberId!, data)
    }

    // Add form related code in component
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            email: "",
            status: UserStatus.Active,
            role: UserRole.Normal,
        },
    })

    // Update form default values
    useEffect(() => {
        if (editingUser) {
            form.reset({
                email: editingUser.email,
                status: editingUser.status,
                role: editingUser.roleId,
            })
        }
    }, [editingUser, form])


    if (!editingUser) {
        return null
    }


    return (
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {editingUser && <div className="grid gap-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-medium">{editingUser.name[0].toUpperCase()}</span>
                    </div>
                    <div>
                        <div className="font-medium text-lg">{editingUser.name}</div>
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label className="text-sm font-medium">Email</Label>
                    <Input {...form.register("email")} placeholder="Enter email" type="email"/>
                    {form.formState.errors.email && (
                        <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label className="text-sm font-medium">Status</Label>
                    <RadioGroup
                        defaultValue={form.getValues("status").toString()}
                        onValueChange={(value) => form.setValue("status", Number(value) as UserStatus)}
                        className="flex flex-col space-y-3"
                    >
                        <div className="flex items-center space-x-3">
                            <RadioGroupItem value={UserStatus.Active.toString()} id="active"/>
                            <Label htmlFor="active" className="font-normal">
                                {UserStatusEnum[UserStatus.Active]}
                            </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                            <RadioGroupItem value={UserStatus.Blocked.toString()} id="blocked"/>
                            <Label htmlFor="blocked" className="font-normal">
                                {UserStatusEnum[UserStatus.Blocked]}
                            </Label>
                        </div>
                    </RadioGroup>
                    {form.formState.errors.status && (
                        <p className="text-sm text-destructive">{form.formState.errors.status.message}</p>
                    )}
                </div>
                <div className="grid gap-2">
                    <Label className="text-sm font-medium">Role</Label>
                    <Select
                        defaultValue={form.getValues("role").toString()}
                        onValueChange={(value) => form.setValue("role", Number(value) as UserRole)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={UserRole.Admin.toString()}>{UserRoleEnum[UserRole.Admin]}</SelectItem>
                            <SelectItem value={UserRole.Normal.toString()}>{UserRoleEnum[UserRole.Normal]}</SelectItem>
                        </SelectContent>
                    </Select>
                    {form.formState.errors.role && (
                        <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>
                    )}
                </div>
            </div>}
            <DialogFooter className="gap-2">
                <Button variant="outline">
                    Cancel
                </Button>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update User"}
                </Button>
            </DialogFooter>
        </form>
    )
}