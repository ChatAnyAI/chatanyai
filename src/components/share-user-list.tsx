"use client"

import type React from "react"

import { useState } from "react"
import { Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ApiAppShareUserList, ApiChatShareList, ApiChatShareDelete, ApiAppShareDelete } from '@/service/api';
import useSWR from "swr"
import { useToast } from "@/hooks/use-toast"

export default function UserList({ appId, chatId }: { appId: string, chatId: string }) {
    const [searchQuery, setSearchQuery] = useState("")
    const { toast } = useToast()

    const { data: respData, mutate } = useSWR(
        chatId ? ['ApiChatShareList', chatId] : ['ApiAppShareUserList', appId],
        () => chatId ? ApiChatShareList(chatId) : ApiAppShareUserList(appId)
    )

    const users = respData || [];

    const filteredUsers = users.filter((user) =>
        user?.name.toLowerCase().includes(searchQuery.toLowerCase())
        || user?.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDeleteUser = async (id: number) => {
        try {
            if (chatId) {
                await ApiChatShareDelete(chatId, id);
            } else {
                await ApiAppShareDelete(appId, id);
            }
            toast({
                title: 'User deleted successfully',
            })
            mutate();
        } catch (error) {
            toast({
                title: 'Failed to delete user',
                variant: 'destructive'
            })
        }
    }

    return (
        <div className="flex flex-col h-[350px] w-[100%] rounded-lg bg-card">
            <div className="p-2 border-b">
                <div className="relative">
                    <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        className="pl-7 h-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <ScrollArea className="flex-grow">
                <div className="p-2">
                    {filteredUsers.length === 0 ? (
                        <div className="text-center text-muted-foreground py-4 text-sm">No users found</div>
                    ) : (
                        <div className="space-y-2">
                            {filteredUsers.map((user) => (
                                <div key={user.id} className="flex items-start justify-between p-2 border rounded-lg hover:bg-accent">
                                    <div className="space-y-0.5">
                                        <p className="font-medium text-sm">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="icon" variant="ghost" className="h-7 w-7">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete this user? This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}