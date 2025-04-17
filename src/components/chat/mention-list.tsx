"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {ApiEmployeeItemResp, Employee} from "@/service/api";

type Member = {
    id: number
    name: string
    role: string
    avatar: string
    color: string
}

// Update the MentionList component to accept and use the selectedIndex prop
type MentionListProps = {
    members: ApiEmployeeItemResp[]
    onSelectMember: (employee: Employee) => void
    selectedIndex: number
}

export default function MentionList({ members, onSelectMember, selectedIndex }: MentionListProps) {
    return (
        <div className="bg-white rounded-lg overflow-hidden w-[400px] shadow-lg border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-gray-800 font-medium">Group Members</h3>
                <div className="flex items-center text-gray-500 text-sm">
                    <span className="mr-2">→|</span>
                    <span>Tab to select</span>
                </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto">
                {members.map((member, index) => (
                    <div
                        key={member.id}
                        className={`flex items-center justify-between p-4 cursor-pointer ${
                            index === selectedIndex ? "bg-blue-100" : "hover:bg-gray-100"
                        }`}
                        onClick={() => onSelectMember({
                            id: member.id,
                            name: member.name,
                            avatar: member.avatar,
                        })}
                    >
                        <div className="flex items-center">
                            <Avatar className={`mr-3`}>
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-gray-800">{member.name}</span>
                        </div>
                        <span className="text-gray-500">{member.role}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
