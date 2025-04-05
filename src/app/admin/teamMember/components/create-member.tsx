"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {ApiAdminUserCreateRequest} from "@/service/admin";
import { useTranslation } from "react-i18next";


interface CreateUserFormProps {
    onSubmit: (data: ApiAdminUserCreateRequest) => void
    isLoading: boolean
}

export default function CreateUserForm({ onSubmit, isLoading }: CreateUserFormProps) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const data: ApiAdminUserCreateRequest = {
            name: formData.get("username") as string,
            password: formData.get("password") as string,
            role: parseInt(formData.get("role") as string),
        }
        onSubmit(data)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="username">{t('admin-teamMember-components-create-member.Username')}</Label>
                <Input id="username" name="username" placeholder={t('admin-teamMember-components-create-member.Enter username')} required disabled={isLoading} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">{t('admin-teamMember-components-create-member.Password')}</Label>
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t('admin-teamMember-components-create-member.Enter password')}
                        required
                        disabled={isLoading}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 transform"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <Label>{t('admin-teamMember-components-create-member.Role')}</Label>
                <RadioGroup name="role" defaultValue="1" className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="normal" disabled={isLoading}/>
                        <Label htmlFor="normal" className="font-normal">
                            {t('admin-teamMember-components-create-member.Normal')}
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2" id="admin" disabled={isLoading}/>
                        <Label htmlFor="admin" className="font-normal">
                            {t('admin-teamMember-components-create-member.Admin')}
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3" id="editor" disabled={isLoading}/>
                        <Label htmlFor="editor" className="font-normal">
                            {t('admin-teamMember-components-create-member.Editor')}
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('admin-teamMember-components-create-member.Creating') : t('admin-teamMember-components-create-member.Create User')}
            </Button>
        </form>
    )
}

