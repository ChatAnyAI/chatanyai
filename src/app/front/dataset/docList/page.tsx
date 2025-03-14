"use client"

import { ChevronLeft, Search, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useSWR from "swr";
import { ApiDatasetDocumentList } from "@/service/api";
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from "react"
import { UploadDialog } from "./components/upload-dialog"
import dayjs from "dayjs"



export default function FileManager() {
    const { datasetId } = useParams();
    const navigator = useNavigate();
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const { data: respData, error, mutate } = useSWR(
        datasetId ? ['ApiDatasetDocumentList', datasetId] : null,
        () => ApiDatasetDocumentList(datasetId!));
    const documentList = respData?.list;
    console.log('documentList', documentList);

    return (
        <div className="flex h-screen bg-background flex-1">
            {/* Sidebar */}
            <div className="w-48 border-r bg-muted/10 p-4 space-y-2">
                <div className="flex items-center gap-2 mb-6">
                    <ChevronLeft className="h-5 w-5" onClick={() => navigator(-1)} />
                    <span>Documentation</span>
                </div>
                <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start">
                        Documents
                    </Button>
                </div>
            </div>
            {/* Main content */}
            <div className="flex-1 overflow-hidden">
                <div className="p-6">
                    {/* Top actions */}
                    <div className="flex justify-between mb-6">
                        <div className="flex gap-2">
                            <Button onClick={() => setIsUploadOpen(true)}>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload file
                            </Button>
                            <Button variant="outline">Delete</Button>
                        </div>
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input type="text" placeholder="Search by name"
                                className="pl-10 pr-4 py-2 border rounded-md w-64" />
                        </div>
                    </div>

                    <UploadDialog
                        isOpen={isUploadOpen}
                        onOpenChange={setIsUploadOpen}
                        datasetId={datasetId!}
                        onSuccess={mutate}
                    />

                    {/* Table */}
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">File Name</TableHead>
                                    <TableHead>Embedding Status</TableHead>
                                    <TableHead>Creation Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            {documentList && <TableBody>
                                {documentList.map((file) => (
                                    <TableRow key={file.fileId}>
                                        <TableCell className="font-medium" onClick={
                                            () => {
                                                navigator(`/dataset/${datasetId}/docPageList/${file.fileId}`)
                                            }
                                        }>{file.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                                {file.embedStatus}
                                            </div>
                                        </TableCell>
                                        <TableCell>{dayjs.unix(file.createdAt).format('MM-DD HH:mm')}</TableCell>
                                        {/* <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon">
                                                    <Share2 className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell> */}
                                    </TableRow>
                                ))}
                            </TableBody>}
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            Total 10 items
                            <select className="border rounded px-2 py-1">
                                <option>10/page</option>
                                <option>20/page</option>
                                <option>50/page</option>
                            </select>
                            <Button variant="outline" size="sm">
                                1
                            </Button>
                            <Button variant="ghost" size="sm">
                                2
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

