"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useSWR from "swr"
import {
    ApiAdminApplicationList, ApiAdminAppUpdate,
    type RespApiAdminApplicationList, RespApiAdminApplicationListItem
} from "@/service/admin"
import {AppLabelEnum, AppVisibility, AppVisibilityEnum} from "@/lib/constants/constants";
import {AdminSearch} from "@/app/admin/components/admin-search";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import UpdateAppForm, {AppFormValues} from "@/app/admin/application/components/edit-app";
import {toast} from "@/hooks/use-toast";
import { useTranslation } from "react-i18next"

export default function Application() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [sort, setSort] = useState("name")
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()

 const [editingApp, setEditingApp] = useState<RespApiAdminApplicationListItem>()

  const {
    data: applicationList,
    error,
    mutate,
  } = useSWR<RespApiAdminApplicationList>(["ApiAdminApplicationList", searchQuery, currentPage, pageSize], () =>
    ApiAdminApplicationList({
      name: searchQuery,
      pagination: {
        currentPage: currentPage,
        pageSize: pageSize,
        sort: sort,
      },
    }),
  )

  useEffect(() => {
    mutate()
  }, [currentPage, pageSize, sort, mutate])

  if (error) return <div>Failed to load applicationList</div>
  if (!applicationList) return <div>Loading...</div>

  // const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault()
  //     setSearchQuery((e.target as HTMLInputElement).value)
  //     setCurrentPage(1) // Reset to first page on new search query
  //   }
  // }

  const handleUpdateApp = async (appId: number,data: AppFormValues) => {
        console.log("setIsUpdateUserModalOpen",data)
        setIsLoading(true)
        try {
            await ApiAdminAppUpdate(appId, data)
            toast({
                title: "App Update successfully",
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


    return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex flex-wrap gap-4">
        <Button variant="outline" className="rounded-full">
          All <span className="ml-2 rounded-full bg-muted px-2">{applicationList.total.applicationCount}</span>
        </Button>
        <Button variant="outline" className="rounded-full">
          Copilot <span className="ml-2 rounded-full bg-muted px-2">{applicationList.total.copilotCount}</span>
        </Button>
        <Button variant="outline" className="rounded-full">
          Dataset <span className="ml-2 rounded-full bg-muted px-2">{applicationList.total.datasetCount}</span>
        </Button>
        <Button variant="outline" className="rounded-full">
          Tool <span className="ml-2 rounded-full bg-muted px-2">{applicationList.total.toolCount}</span>
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
                    <Select defaultValue="name" onValueChange={(value) => setSort(value)}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="created_at">Created</SelectItem>
                            <SelectItem value="activity_at">Last activity</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>

        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Visibility</TableHead>
                        <TableHead>Created on</TableHead>
                        <TableHead>Last activity</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applicationList.list.map((application) => (
                        <TableRow key={application.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={application.icon} alt={application.name} />
                      <AvatarFallback className="bg-muted">{application.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{application.name}</div>
                      <div className="text-sm text-muted-foreground max-w-xs truncate">{application.description}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{AppLabelEnum[application.type] || "Unknown"}</TableCell>
                  <TableCell>
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            application.visibility === AppVisibility.Public
                                ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                                : "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20"
                        }`}
                    >
                            {t(AppVisibilityEnum[application.visibility] || "Unknown")}
                                    </span>
                     </TableCell>
                  <TableCell>{new Date(application.createdAt * 1000).toLocaleString()}</TableCell>
                  <TableCell>{new Date(application.activityAt * 1000).toLocaleString()}</TableCell>
                  <TableCell>
                      <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => {
                              setEditingApp(application)
                              setIsUpdateUserModalOpen(true)
                          }}>
                              Edit
                          </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </Button>
        {[...Array(Math.ceil(applicationList.total.applicationCount / pageSize)).keys()].map((page) => (
          <Button
            key={page + 1}
            variant="outline"
            size="sm"
            className={currentPage === page + 1 ? "bg-primary text-primary-foreground" : ""}
            onClick={() => setCurrentPage(page + 1)}
          >
            {page + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(applicationList.total.applicationCount / pageSize)}
        >
          Next
        </Button>
      </div>
        <Dialog open={isUpdateUserModalOpen} onOpenChange={setIsUpdateUserModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">Edit Application</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Make changes to the application here.
                    </DialogDescription>
                </DialogHeader>
                <UpdateAppForm
                    editingApp={editingApp}
                    onSubmit={handleUpdateApp}
                    isLoading={isLoading}
                    onCancel={() => setIsUpdateUserModalOpen(false)}
                />
            </DialogContent>
        </Dialog>
    </div>
  )
}
