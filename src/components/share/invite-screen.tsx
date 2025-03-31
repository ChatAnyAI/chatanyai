"use client"
import {useEffect, useState} from "react"
import {ChevronLeft, Globe, X} from "lucide-react"
import {BatchUserPermissionDropdown} from "./batch-user-permission-dropdown"
import {ApiAppShareCreate, ApiChatShareCreate, ApiTeamUsers, AvatarUser, ShareUser, User} from "@/service/api";
import {toast} from "@/hooks/use-toast";
import {useGlobalStore} from "@/store/globalStore";
import {UserAvatar} from "@/components/user-avatar";
import {PermissionType} from "@/lib/constants/constants";

interface InviteScreenProps {
    appId: string
    chatId?: string
    onBack?: () => void
    shareUser: ShareUser[]
}

export function InviteScreen({ appId, chatId, onBack, shareUser: shareUserList }: InviteScreenProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [permission, setPermission] = useState<PermissionType>(PermissionType.Full)
    // const [message, setMessage] = useState("")

    const myUser = useGlobalStore(state => state.user);

    const [teamUsers, setTeamUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])

    useEffect(() => {
        const resp =  ApiTeamUsers()
        resp.then((data) => {
            setTeamUsers(data)
            setFilteredUsers(data)
        })
    },[])

    const handleInvite = async () => {
        try {
            const userIds = selectedUsers.map(item => item.id);
            if (chatId) {
                await ApiChatShareCreate(chatId, {
                    uids: userIds,
                    permission: permission,
                });
            } else {
                await ApiAppShareCreate(appId, {
                    uids: userIds,
                    permission: permission,
                });
            }
            toast({
                title: 'Invite OK',
                description: 'Invite OK'
            });
            onBack?.();
        } catch (error) {
            toast({
                title: 'Invite Fail',
                description: 'Invite Fail',
                variant: 'destructive'
            });
        }
    }


    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = teamUsers.filter(
                (user) =>
                    user.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
                    !selectedUsers.some((selected) => selected.id === user.id),
            )
            setFilteredUsers(filtered)
        } else {
            setFilteredUsers(teamUsers.filter((user) => !selectedUsers.some((selected) => selected.id === user.id)))
        }
    }, [searchQuery, selectedUsers, teamUsers])

    const handleUserSelect = (user: User) => {
        if (myUser.id === user.id || shareUserList?.some((shareUser) => shareUser.id === user.id)) {
            return
        }

        if (!selectedUsers.some((selected) => selected.id === user.id)) {
            setSelectedUsers([...selectedUsers, user])
            setSearchQuery("")
        }
    }

    const handleRemoveUser = (userId: number) => {
        setSelectedUsers(selectedUsers.filter((user) => user.id !== userId))
    }

    return (
        <>
            {onBack && <div className="border-b p-3">
                    <div className="flex items-center">
                        <button onClick={onBack} className="p-0.5 mr-2 rounded-full hover:bg-gray-100">
                            <ChevronLeft className="h-5 w-5 text-gray-500" />
                        </button>
                        <h2 className="text-base font-medium">Invite</h2>
                    </div>
                </div>}

            <div className="p-4">
                {/* Email input and invite button */}
                <div className="relative mb-4">
                    <div
                        className="flex flex-wrap items-center gap-2 p-2 min-h-[42px] border rounded-lg focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-blue-300">
                        {selectedUsers.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center gap-1 bg-[#F5EFE6] text-gray-700 pl-2 pr-1 py-0.5 rounded-lg text-sm"
                            >
                                <Globe className="h-4 w-4"/>
                                <span>{user.email}</span>
                                <button onClick={() => handleRemoveUser(user.id)}
                                        className="hover:bg-gray-200 rounded p-0.5">
                                    <X className="h-3 w-3"/>
                                </button>
                            </div>
                        ))}
                        <input
                            type="text"
                            className="flex-1 min-w-[200px] outline-hidden text-sm"
                            placeholder={selectedUsers.length ? "" : "Email or group, separated by commas"}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {filteredUsers?.length === 0 ? (
                    // Empty state
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg width="36" height="36" viewBox="0 0 48 48" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <circle cx="24" cy="18" r="8" fill="#9CA3AF"/>
                                <path
                                    d="M12 36C12 30.4772 17.3726 26 24 26C30.6274 26 36 30.4772 36 36"
                                    stroke="#9CA3AF"
                                    strokeWidth="2"
                                />
                                <circle cx="36" cy="18" r="6" fill="#D1D5DB"/>
                                <path d="M36 18H36.01M36 18V18.01" stroke="white" strokeWidth="8"
                                      strokeLinecap="round"/>
                                <path d="M36 18H36.01M36 18V18.01" stroke="#9CA3AF" strokeWidth="2"
                                      strokeLinecap="round"/>
                            </svg>
                        </div>
                        <h3 className="text-base text-gray-500 font-medium mb-1">Members and guests will appear
                            here</h3>
                        <p className="text-gray-500 text-center text-xs max-w-md mb-8">
                            Try inviting someone with their email address or importing contacts
                        </p>
                    </div>
                ) : (
                    // Search results
                    <div className="overflow-y-auto" style={{maxHeight: "300px"}}>
                        {filteredUsers.length > 0 && (
                            <>
                                <h3 className="text-gray-500 mb-2 text-xs">Suggested</h3>
                                <div className="space-y-1">
                                    {filteredUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-lg cursor-pointer"
                                            onClick={() => handleUserSelect(user)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <UserAvatar user={user as AvatarUser} />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-sm">{user.email}</span>
                                                        {/* {user.isGuest && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="bg-orange-100 text-orange-800 hover:bg-orange-100 px-1.5 py-0 text-[10px]"
                                                            >
                                                                Guest
                                                            </Badge>
                                                        )} */}
                                                    </div>
                                                    <div className="text-gray-500 text-xs">{user.email}</div>
                                                </div>
                                            </div>
                                            {
                                                myUser.id === user.id ? (
                                                    <span className="text-sm text-gray-500">You</span>
                                                ) : (
                                                    shareUserList?.some((shareUser) => shareUser.id === user.id) ? (
                                                        <span className="text-sm text-gray-500">Already invited</span>
                                                    ) : (
                                                        <div
                                                            className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                                            {selectedUsers.some((selected) => selected.id === user.id) && (
                                                                <div className="w-3 h-3 rounded-full bg-blue-500"/>
                                                            )}
                                                        </div>
                                                    )
                                                )
                                            }
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}


                {/* Access level and Message input */}
                <div className="border-t p-4 mt-auto">
                    <div className="flex justify-end mb-3">
                        <BatchUserPermissionDropdown permission={permission} setPermission={setPermission}/>
                    </div>
                    {/*<textarea*/}
                    {/*    placeholder="Add a message to your invite..."*/}
                    {/*    className="w-full p-3 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-300 focus:border-blue-300"*/}
                    {/*    value={message}*/}
                    {/*    onChange={(e) => setMessage(e.target.value)}*/}
                    {/*    rows={3}*/}
                    {/*/>*/}
                    <button className="w-full py-2 text-sm bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors cursor-pointer" onClick={handleInvite}>
                        Invite
                    </button>
                </div>
            </div>
        </>
    )
}

