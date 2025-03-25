import { useState } from "react"
import {ApiAllUserList, ApiChatShareList, AvatarUser, User, UserProfile} from "@/service/api"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Plus, Trash2, Users } from "lucide-react"
import { ApiAppShareUserList, ApiAppShareCreate, ApiAppShareDelete } from '@/service/api'
import { useParams } from "react-router-dom"
import {UserAvatar} from "@/components/user-avatar";
import {InviteScreen} from "@/components/share/invite-screen";
import useSWR from "swr";

export function MembersTab() {
  const [users, setUsers] = useState<User[]>([])
  const [spaceUsers, setSpaceUsers] = useState<User[]>([])
  // const [searchQuery, setSearchQuery] = useState("")
  // const [searching, setSearching] = useState(false)
  const { appId } = useParams()

    const { data: shareUser, mutate } = useSWR(
       ['ApiAppShareUserList', appId],
        () => ApiAppShareUserList(appId!)
    )

  // Initialize with some default members on component mount
  useState(() => {
    const initializeMembers = async () => {
      const allUsers = await ApiAppShareUserList(appId!)
      setSpaceUsers(allUsers || []) // First 3 users as default members
    }
    
    initializeMembers()
  })

  // Handle user search
  // const handleUserSearch = async (query: string) => {
  //   setSearchQuery(query)
  //
  //   if (query.length < 2) return
  //
  //   try {
  //     setSearching(true)
  //     const results = await ApiAllUserList()
  //     // Filter out users already in the space
  //     const filteredResults = results.filter((user) => !spaceUsers.some((spaceUser) => spaceUser.id === user.id))
  //     setUsers(filteredResults)
  //   } catch (error) {
  //     console.error("Error searching users:", error)
  //   } finally {
  //     setSearching(false)
  //   }
  // }

  // Add user to space
  // const addUserToSpace = async (user: User) => {
  //   await ApiAppShareCreate(appId!, [user.id])
  //
  //   setSpaceUsers([...spaceUsers, user])
  //   setUsers(users.filter((u) => u.id !== user.id))
  //   setSearchQuery("")
  // }

  // Remove user from space
  const removeUserFromSpace = async (user: User) => {
    await ApiAppShareDelete(appId!, user.id)
    setSpaceUsers(spaceUsers.filter((u) => u.id !== user.id))
    setUsers([...users, user])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>Manage who has access to this space</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
            <InviteScreen
                appId={appId!}
                shareUser={shareUser || []}
            />
          {/*<div className="relative">*/}
          {/*  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />*/}
          {/*  <Input*/}
          {/*    placeholder="Search users by name or email"*/}
          {/*    className="pl-10"*/}
          {/*    value={searchQuery}*/}
          {/*    onChange={(e) => handleUserSearch(e.target.value)}*/}
          {/*  />*/}
          {/*</div>*/}

          {/*{searchQuery.length > 0 && (*/}
          {/*  <div className="mt-2 border rounded-md">*/}
          {/*    {searching ? (*/}
          {/*      <div className="p-4 text-center">*/}
          {/*        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>*/}
          {/*        <p className="text-sm text-muted-foreground">Searching...</p>*/}
          {/*      </div>*/}
          {/*    ) : users.length === 0 ? (*/}
          {/*      <div className="p-4 text-center text-sm text-muted-foreground">No users found</div>*/}
          {/*    ) : (*/}
          {/*      <ScrollArea className="h-[200px]">*/}
          {/*        {users.map((user) => (*/}
          {/*          <div*/}
          {/*            key={user.id}*/}
          {/*            className="flex items-center justify-between p-3 border-b last:border-0 hover:bg-muted/30"*/}
          {/*          >*/}
          {/*            <div className="flex items-center gap-3">*/}
          {/*              <UserAvatar*/}
          {/*                  user= {user as AvatarUser}*/}
          {/*              />*/}
          {/*              <div>*/}
          {/*                <p className="text-sm font-medium">{user.name}</p>*/}
          {/*                <p className="text-xs text-muted-foreground">{user.email}</p>*/}
          {/*              </div>*/}
          {/*            </div>*/}
          {/*            <Button size="sm" variant="ghost" onClick={() => addUserToSpace(user)}>*/}
          {/*              <Plus className="h-4 w-4 mr-1" />*/}
          {/*              Add*/}
          {/*            </Button>*/}
          {/*          </div>*/}
          {/*        ))}*/}
          {/*      </ScrollArea>*/}
          {/*    )}*/}
          {/*  </div>*/}
          {/*)}*/}
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Current Members ({spaceUsers.length})</h3>

          {spaceUsers.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No members yet. Add members to collaborate.</p>
            </div>
          ) : (
            <div className="border rounded-md">
              {spaceUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border-b last:border-0 hover:bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user as AvatarUser} />
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Remove Member</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to remove {user.name} from this space?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center gap-3 py-4">
                        <UserAvatar user={user as AvatarUser} />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" className="mr-2">
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={() => removeUserFromSpace(user)}>
                          Remove
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
