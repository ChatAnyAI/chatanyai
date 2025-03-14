"use client"

import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ApiDatasetUpload, ApiDatasetUpdate } from "@/service/api";

const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15MB
const ACCEPTED_FILE_TYPES = [
    "text/plain",
    "text/markdown",
    "application/pdf",
    "text/html",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/csv",
]

interface UploadDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    datasetId: string;
    onSuccess: () => void;
}

export function UploadDialog({ isOpen, onOpenChange, datasetId, onSuccess }: UploadDialogProps) {
    const { toast } = useToast()
    const [files, setFiles] = useState<File[]>([])
    const [fileIds, setFileIds] = useState<string[]>([])

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ACCEPTED_FILE_TYPES.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
        maxSize: MAX_FILE_SIZE,
    })

    const removeFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    }

    const handleUpload = async () => {
        if (files.length === 0) {
            toast({
                title: "Please select a file to upload",
                variant: "destructive"
            });
            return;
        }

        try {
            const response = await ApiDatasetUpload(files);
            setFileIds(response?.fileIds);
            toast({
                title: "File uploaded successfully"
            });
        } catch (error) {
            console.error("An issue occurred during the upload:", error);
            toast({
                title: "Update operation encountered a problem",
                variant: "destructive"
            });
        }
    }

    const handleConfirm = async () => {
        if (fileIds.length === 0) {
            toast({
                title: "Please upload files first",
                variant: "destructive"
            });
            return;
        }

        try {
            await ApiDatasetUpdate(datasetId, { fileIds });
            toast({
                title: "Dataset updated successfully"
            });
            onOpenChange(false);
            setFiles([]);
            setFileIds([]);
            onSuccess();
        } catch (error) {
            console.error("An issue occurred during the update operation:", error);
            toast({
                title: "An issue occurred during the update operation",
                variant: "destructive"
            });
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Files</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div
                        {...getRootProps()}
                        className={`flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-lg transition-colors ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25"
                            }`}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center gap-2 text-center">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                Drag & drop files here, or{" "}
                                <Button type="button" variant="link" className="p-0 h-auto">
                                    Select files
                                </Button>
                            </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Supported formats: TXT, MARKDOWN, MDX, PDF, HTML, XLSX, XLS, DOCX, CSV, MD, HTM
                        </p>
                    </div>

                    {files.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-medium mb-2">Selected Files:</h3>
                            <ul className="space-y-2">
                                {files.map((file, index) => (
                                    <li key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                                        <span className="text-sm truncate">{file.name}</span>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(index)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                            <Button className="mt-4" onClick={handleUpload}>
                                Upload
                            </Button>
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button onClick={handleConfirm}>Confirm</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}