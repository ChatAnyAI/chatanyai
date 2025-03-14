// import { useState, useEffect } from "react"
// import { FileFormat, FileResp as File } from "@/service/api"
// import { FileFormatIcon } from "@/lib/files/tools"
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { toast } from "@/hooks/use-toast"
// import { Upload, Trash2, Search, FileText } from "lucide-react"

// // Format date helper
// const formatDate = (timestamp: number) => {
//   return new Date(timestamp).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   })
// }

// const mockFetchFiles = async (): Promise<File[]> => {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 300))

//   return [
//     {
//       id: "1",
//       name: "Document 1.md",
//       contentKey: "doc1",
//       fileFormat: FileFormat.DocumentMarkdown,
//       createdAt: Date.now() - 86400000,
//       updatedAt: Date.now() - 43200000,
//       deletedAt: 0,
//       hash: "abc123",
//     },
//     {
//       id: "2",
//       name: "Image.png",
//       contentKey: "img1",
//       fileFormat: FileFormat.FileImg,
//       createdAt: Date.now() - 172800000,
//       updatedAt: Date.now() - 86400000,
//       deletedAt: 0,
//       hash: "def456",
//     },
//     {
//       id: "3",
//       name: "Spreadsheet.xlsx",
//       contentKey: "sheet1",
//       fileFormat: FileFormat.FileXLS,
//       createdAt: Date.now() - 259200000,
//       updatedAt: Date.now() - 172800000,
//       deletedAt: 0,
//       hash: "ghi789",
//     },
//     {
//       id: "4",
//       name: "Presentation.pptx",
//       contentKey: "pres1",
//       fileFormat: FileFormat.FilePPT,
//       createdAt: Date.now() - 345600000,
//       updatedAt: Date.now() - 259200000,
//       deletedAt: 0,
//       hash: "jkl012",
//     },
//   ]
// }

// const mockUploadFile = async (file: { name: string; type: string }): Promise<File> => {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 1000))

//   let fileFormat = FileFormat.FileUnknown

//   if (file.type.includes("markdown")) fileFormat = FileFormat.DocumentMarkdown
//   else if (file.type.includes("image")) fileFormat = FileFormat.FileImg
//   else if (file.type.includes("pdf")) fileFormat = FileFormat.FilePDF
//   else if (file.type.includes("word")) fileFormat = FileFormat.FileDoc
//   else if (file.type.includes("excel")) fileFormat = FileFormat.FileXLS
//   else if (file.type.includes("powerpoint")) fileFormat = FileFormat.FilePPT
//   else if (file.type.includes("audio")) fileFormat = FileFormat.FileMP3
//   else if (file.type.includes("video")) fileFormat = FileFormat.FileMP4
//   else if (file.type.includes("zip")) fileFormat = FileFormat.FileZIP

//   return {
//     id: Math.random().toString(36).substring(2, 9),
//     name: file.name,
//     contentKey: Math.random().toString(36).substring(2, 9),
//     fileFormat,
//     createdAt: Date.now(),
//     updatedAt: Date.now(),
//     deletedAt: 0,
//     hash: Math.random().toString(36).substring(2, 15),
//   }
// }

// const mockDeleteFile = async (id: string): Promise<void> => {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 500))
// }

// export function FilesTab() {
//   const [files, setFiles] = useState<File[]>([])
//   const [loadingFiles, setLoadingFiles] = useState(false)
//   const [uploadingFile, setUploadingFile] = useState(false)
//   const [selectedFile, setSelectedFile] = useState<File | null>(null)

//   // Fetch files on component mount
//   useEffect(() => {
//     const fetchFiles = async () => {
//       try {
//         setLoadingFiles(true)
//         const filesData = await mockFetchFiles()
//         setFiles(filesData)
//       } catch (error) {
//         console.error("Error fetching files:", error)
//         toast({
//           title: "Error",
//           description: "Failed to load files",
//           variant: "destructive",
//         })
//       } finally {
//         setLoadingFiles(false)
//       }
//     }

//     fetchFiles()
//   }, [])

//   // Handle file upload
//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files || e.target.files.length === 0) return

//     const file = e.target.files[0]

//     try {
//       setUploadingFile(true)
//       const uploadedFile = await mockUploadFile({
//         name: file.name,
//         type: file.type,
//       })

//       setFiles([uploadedFile, ...files])

//       toast({
//         title: "Success",
//         description: "File uploaded successfully",
//       })
//     } catch (error) {
//       console.error("Error uploading file:", error)
//       toast({
//         title: "Error",
//         description: "Failed to upload file",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingFile(false)
//       // Reset file input
//       e.target.value = ""
//     }
//   }

//   // Delete file
//   const deleteFile = async (id: string) => {
//     try {
//       await mockDeleteFile(id)
//       setFiles(files.filter((file) => file.id !== id))

//       if (selectedFile?.id === id) {
//         setSelectedFile(null)
//       }

//       toast({
//         title: "Success",
//         description: "File deleted successfully",
//       })
//     } catch (error) {
//       console.error("Error deleting file:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete file",
//         variant: "destructive",
//       })
//     }
//   }

//   return (
//     <Card className="h-full">
//       <CardHeader>
//         <CardTitle>Files</CardTitle>
//         <CardDescription>Manage files in your dataset</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="flex flex-col md:flex-row gap-6 h-[600px]">
//           {/* Left side - File list */}
//           <div className="w-full md:w-1/3 flex flex-col h-full">
//             <div className="flex justify-between items-center mb-4">
//               <p className="text-sm text-muted-foreground">
//                 {files.length} file{files.length !== 1 ? "s" : ""} in this dataset
//               </p>
//               <div>
//                 <label htmlFor="file-upload">
//                   <Button size="sm" disabled={uploadingFile} className="cursor-pointer">
//                     {uploadingFile ? (
//                       <>
//                         <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
//                         Uploading...
//                       </>
//                     ) : (
//                       <>
//                         <Upload className="h-4 w-4 mr-2" />
//                         Upload
//                       </>
//                     )}
//                   </Button>
//                 </label>
//                 <input
//                   id="file-upload"
//                   type="file"
//                   className="hidden"
//                   onChange={handleFileUpload}
//                   disabled={uploadingFile}
//                 />
//               </div>
//             </div>

//             {loadingFiles ? (
//               <div className="flex items-center justify-center h-full">
//                 <div className="text-center">
//                   <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
//                   <p className="text-sm text-muted-foreground">Loading files...</p>
//                 </div>
//               </div>
//             ) : files.length === 0 ? (
//               <div className="text-center py-12 border-2 border-dashed rounded-lg h-full flex flex-col items-center justify-center">
//                 <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
//                 <h3 className="text-lg font-medium mb-1">No files yet</h3>
//                 <p className="text-sm text-muted-foreground mb-4">
//                   Upload files to add them to your dataset
//                 </p>
//                 <label htmlFor="file-upload-empty">
//                   <Button variant="outline" className="cursor-pointer">
//                     <Upload className="h-4 w-4 mr-2" />
//                     Upload File
//                   </Button>
//                 </label>
//                 <input id="file-upload-empty" type="file" className="hidden" onChange={handleFileUpload} />
//               </div>
//             ) : (
//               <div className="border rounded-md h-full flex flex-col">
//                 <div className="bg-muted/50 p-3 text-sm font-medium border-b">Files</div>
//                 <div className="p-2 border-b">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input placeholder="Search files..." className="pl-10" />
//                   </div>
//                 </div>
//                 <ScrollArea className="flex-1">
//                   {files.map((file) => (
//                     <div
//                       key={file.id}
//                       className={`flex items-center gap-2 p-3 border-b last:border-0 hover:bg-muted/30 cursor-pointer ${selectedFile?.id === file.id ? "bg-muted" : ""
//                         }`}
//                       onClick={() => setSelectedFile(file)}
//                     >
//                       <div className="shrink-0"><FileFormatIcon fileFormat={file.fileFormat} /></div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-medium truncate">{file.name}</p>
//                         <p className="text-xs text-muted-foreground">{formatDate(file.updatedAt)}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </ScrollArea>
//                 <div className="p-2 border-t bg-muted/30">
//                   <label htmlFor="quick-upload" className="w-full">
//                     <div className="flex items-center justify-center gap-2 p-2 border-2 border-dashed rounded-md hover:bg-muted/50 cursor-pointer">
//                       <Upload className="h-4 w-4 text-muted-foreground" />
//                       <span className="text-sm text-muted-foreground">
//                         Drop file here or click to upload
//                       </span>
//                     </div>
//                   </label>
//                   <input
//                     id="quick-upload"
//                     type="file"
//                     className="hidden"
//                     onChange={handleFileUpload}
//                     disabled={uploadingFile}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right side - File details */}
//           <div className="w-full md:w-2/3 h-full">
//             {selectedFile ? (
//               <div className="border rounded-md h-full flex flex-col">
//                 <div className="bg-muted/50 p-3 flex justify-between items-center border-b">
//                   <h3 className="text-sm font-medium">File Details</h3>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => deleteFile(selectedFile.id)}
//                     className="h-8 w-8 text-muted-foreground hover:text-destructive"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     <span className="sr-only">Delete</span>
//                   </Button>
//                 </div>
//                 <div className="p-6 flex-1 overflow-auto">
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="h-12 w-12 flex items-center justify-center bg-muted rounded-md">
//                       <FileFormatIcon fileFormat={selectedFile.fileFormat} />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-medium">{selectedFile.name}</h3>
//                       <p className="text-sm text-muted-foreground">
//                         {FileFormat[selectedFile.fileFormat].replace("File", "")}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <p className="text-sm font-medium text-muted-foreground mb-1">Created</p>
//                         <p className="text-sm">{formatDate(selectedFile.createdAt)}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-muted-foreground mb-1">Last Modified</p>
//                         <p className="text-sm">{formatDate(selectedFile.updatedAt)}</p>
//                       </div>
//                     </div>

//                     <div>
//                       <p className="text-sm font-medium text-muted-foreground mb-1">File ID</p>
//                       <p className="text-sm font-mono bg-muted p-2 rounded-md">{selectedFile.id}</p>
//                     </div>

//                     <div>
//                       <p className="text-sm font-medium text-muted-foreground mb-1">Content Key</p>
//                       <p className="text-sm font-mono bg-muted p-2 rounded-md">{selectedFile.contentKey}</p>
//                     </div>

//                     <div>
//                       <p className="text-sm font-medium text-muted-foreground mb-1">Hash</p>
//                       <p className="text-sm font-mono bg-muted p-2 rounded-md truncate">
//                         {selectedFile.hash}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="border rounded-md h-full flex items-center justify-center">
//                 <div className="text-center p-6">
//                   <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                   <h3 className="text-lg font-medium mb-2">No file selected</h3>
//                   <p className="text-sm text-muted-foreground">
//                     Select a file from the list to view its details
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
