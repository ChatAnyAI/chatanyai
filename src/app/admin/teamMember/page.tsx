import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useSWR from "swr";
import {
    ApiAdminTeamMemberList,
    ApiAdminUserCreate,
    ApiAdminUserCreateRequest,
    ApiAdminUserUpdate,
    RespApiAdminTeamMemberList,
    RespApiAdminTeamMemberListItem,
} from "@/service/admin";
import {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import CreateUserForm from "@/app/admin/teamMember/components/create-member";
import {useToast} from "@/hooks/use-toast";
import {UserRole, UserRoleEnum, UserStatus, UserStatusEnum} from "@/lib/constants/constants";
import {AdminPagination} from "@/app/admin/components/admin-pagination";
import UpdateUserForm, {UserFormValues} from "@/app/admin/teamMember/components/edit-member";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {AdminSearch} from "@/app/admin/components/admin-search";


export default function TeamMember() {
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
    const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingUser, setEditingUser] = useState<RespApiAdminTeamMemberListItem>()

    const { data: teamMemberList, error } = useSWR<RespApiAdminTeamMemberList>(['ApiAdminTeamMemberList',  currentPage, pageSize, searchQuery],
        () => ApiAdminTeamMemberList({
            name: searchQuery,
            pagination: {
                currentPage,
                pageSize
            }
        }));

    if (error) return <div>Failed to load TeamMemberList</div>;
    if (!teamMemberList) return <div>Loading...</div>;


    const handleCreateUser = async (data: ApiAdminUserCreateRequest) => {
        setIsLoading(true)
        try {
            await ApiAdminUserCreate(data)
            toast({
                title: "User created successfully",
                description: `Created user ${data.name} with role ${data.role}`,
            })
            setIsCreateUserModalOpen(false)
            // Here you would typically update the users list or refetch data
        } catch (error) {
            // setIsCreateUserModalOpen(false)
            toast({
                title: "Error",
                description:  String(error),
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }


    const handleUpdateUser = async (teamMemberId: number,data: UserFormValues) => {
        console.log("setIsUpdateUserModalOpen",data)
        setIsLoading(true)
        try {
            await ApiAdminUserUpdate(teamMemberId, data)
            toast({
                title: "User created successfully",
                description: `Update user`,
            })
            setIsUpdateUserModalOpen(false)
            // Here you would typically update the users list or refetch data
        } catch (error) {
            // setIsCreateUserModalOpen(false)
            toast({
                title: "Error",
                description:  String(error),
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    // User edit handlers
    const handleEditUser = (user: RespApiAdminTeamMemberListItem) => {
        setEditingUser(user)
        setIsUpdateUserModalOpen(true)
    }

    const totalPages = Math.ceil((teamMemberList?.pagination?.total || 0) / pageSize);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: string) => {
        setPageSize(Number(size));
        setCurrentPage(1);
    };


    return (
        <div className="container mx-auto py-6">
            <div className="mb-8 flex flex-wrap gap-4">
                <Button variant="outline" className="rounded-full">
                    All <span className="ml-2 rounded-full bg-muted px-2">{teamMemberList.total.count}</span>
                </Button>
                <Button variant="outline" className="rounded-full">
                    Admins <span className="ml-2 rounded-full bg-muted px-2">{teamMemberList.total.adminCount}</span>
                </Button>
                <Button variant="outline" className="rounded-full">
                    Active <span className="ml-2 rounded-full bg-muted px-2">{teamMemberList.total.activeCount}</span>
                </Button>
                <Button variant="outline" className="rounded-full">
                    Blocked <span className="ml-2 rounded-full bg-muted px-2">{teamMemberList.total.blockCount}</span>
                </Button>

            </div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <AdminSearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Sort by</span>
                        <Select defaultValue="name">
                            <SelectTrigger className="w-[120px]">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="created">Created</SelectItem>
                                <SelectItem value="activity">Last activity</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Dialog open={isCreateUserModalOpen} onOpenChange={setIsCreateUserModalOpen}>
                        <DialogTrigger asChild>
                            <Button>New user</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New User</DialogTitle>
                                <DialogDescription>Add a new user to the system. Click save when you're
                                    done.</DialogDescription>
                            </DialogHeader>
                            <CreateUserForm onSubmit={handleCreateUser} isLoading={isLoading}/>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created on</TableHead>
                            <TableHead>Last activity</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teamMemberList.list.map((item) => (
                            <TableRow key={item.teamMemberId}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={item.avatar} alt={item.name}/>
                                            <AvatarFallback className="bg-muted">{item.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{item.name}</div>
                                            <div
                                                className="text-sm text-muted-foreground max-w-xs truncate">{item.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                  <span
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                          item.status === UserStatus.Active
                                              ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                                              : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                                      }`}
                                  >
                                    {UserStatusEnum[item.status] || "Unknown"}
                                  </span>
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            item.roleId === UserRole.Admin
                                                ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                                                : "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20"
                                        }`}
                                    >
                                        {UserRoleEnum[item.roleId] || "Unknown"}
                                    </span>

                                </TableCell>
                                <TableCell>{new Date(item.createdAt * 1000).toLocaleString()}</TableCell>
                                <TableCell>{new Date(item.activityAt * 1000).toLocaleString()}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                Edit
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEditUser(item)}>Edit user</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Delete user</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <AdminPagination
                pagination={teamMemberList?.pagination}
                pageSize={pageSize}
                currentPage={currentPage}
                handlePageSizeChange={handlePageSizeChange}
                handlePageChange={handlePageChange}
                totalPages={totalPages}
            />
             <Dialog open={isUpdateUserModalOpen} onOpenChange={setIsUpdateUserModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Edit User</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Make changes to the user account here.
                        </DialogDescription>
                    </DialogHeader>
                    <UpdateUserForm
                        editingUser={editingUser}
                        onSubmit={handleUpdateUser}
                        isLoading={isLoading}
                    />

                </DialogContent>
            </Dialog>
        </div>
    )
}

