"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileText, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useTranslation } from "react-i18next"
import { ApiChatCreate } from "@/service/api"
import { useNavigate } from "react-router-dom"
import { cssnanoMinify } from "css-minimizer-webpack-plugin"

interface PDFUploaderProps {
    appId: string
    onPdfUploaded: (fileUrl: string) => void
}

// Real API upload function using XMLHttpRequest for progress tracking
const uploadAPI = (
    appId: string,
    file: File,
    onProgress: (progress: number) => void,
): Promise<{
    success: boolean; message: string; url?: string, pathname: string; id: number
}> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        const formData = new FormData()

        // Append the file to the FormData object
        formData.append("file", file)

        // Set up the request
        xhr.open("POST", `/api/app/${appId}/files/upload`, true)

        // Set up progress tracking
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100)
                onProgress(percentComplete)
            }
        }

        // Handle response
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText)
                    resolve(response.data)
                } catch (error) {
                    reject({
                        success: false,
                        message: "Invalid server response",
                    })
                }
            } else {
                reject({
                    success: false,
                    message: `Server error: ${xhr.status} ${xhr.statusText}`,
                })
            }
        }

        // Handle network errors
        xhr.onerror = () => {
            reject({
                success: false,
                message: "Network error occurred during upload",
            })
        }

        // Handle timeout
        xhr.ontimeout = () => {
            reject({
                success: false,
                message: "Upload timed out",
            })
        }

        // Send the request
        xhr.send(formData)
    })
}

export default function PDFUploader({  appId, onPdfUploaded }: PDFUploaderProps) {
    const { t } = useTranslation();
    const [isDragging, setIsDragging] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    const validateFileType = (file: File): boolean => {
        if (file.type !== "application/pdf") {
            setError("Invalid file type. Please upload a PDF file.")
            return false
        }

        // Clear any previous errors
        setError(null)
        return true
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)

        const files = e.dataTransfer.files
        if (files.length > 0) {
            const file = files[0]
            if (validateFileType(file)) {
                handleFileSelection(file)
            }
        }
    }

    const handleFileSelection = (file: File) => {
        setSelectedFile(file)
        setUploadProgress(0)
        // Automatically start processing after file selection
        processFile(appId, file)
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            if (validateFileType(file)) {
                handleFileSelection(file)
            }
        }
    }

    const processFile = async (appId: string,file: File) => {
        if (!file) return

        setIsUploading(true)
        setError(null)

        try {
            // Call the real API
            const result = await uploadAPI(appId, file, (progress) => {
                setUploadProgress(progress)
            })

            // Handle successful upload
            toast({
                title: t("pdf-upload.Upload successful"),
            })

            const { guid }  = await ApiChatCreate(appId, {
                fileId: result.id,
            })
            navigate('c/' + guid)

            onPdfUploaded(result.pathname)
        } catch (error: any) {
            // Handle upload error
            setError(error.message || t("pdf-upload.Upload failed"))
            toast({
                title: t("pdf-upload.Upload failed"),
                description: error.message || t("pdf-upload.Upload error"),
                variant: "destructive",
            })
        } finally {
            setIsUploading(false)
        }
    }

    const clearSelectedFile = () => {
        setSelectedFile(null)
        setUploadProgress(0)
        setError(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className="container mx-auto p-4 md:p-20 min-h-screen flex flex-col">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-center bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {t("pdf-upload.AI PDF Chat Assistant")}
                </h1>
                <p className="text-center text-gray-500 mt-2">
                    {t("pdf-upload.Upload description")}
                </p>
            </header>
            <Card className="w-full max-w-3xl mx-auto">
                <CardContent className="p-6">
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>{t("pdf-upload.Error")}</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div
                        className={cn(
                            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                            isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300",
                            selectedFile ? "bg-gray-50" : "hover:bg-gray-50",
                            error ? "border-red-300" : "",
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {!selectedFile ? (
                            <div className="space-y-4">
                                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                                    <Upload className="h-8 w-8 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">{t("pdf-upload.Upload your PDF")}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{t("pdf-upload.Drag and drop")}</p>
                                </div>
                                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="mt-4">
                                    {t("pdf-upload.Select PDF")}
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileInputChange}
                                    accept="application/pdf"
                                    className="hidden"
                                />
                                <p className="text-xs text-gray-400 mt-2">{t("pdf-upload.Maximum file size")}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <FileText className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div className="text-left flex-1 max-w-xs">
                                        <p className="font-medium truncate">{selectedFile.name}</p>
                                        <p className="text-sm text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={clearSelectedFile}
                                        disabled={isUploading}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                {isUploading && (
                                    <div className="space-y-2">
                                        <Progress value={uploadProgress} className="h-2" />
                                        <p className="text-sm text-gray-500">
                                            {uploadProgress < 100 ? <>{t("pdf-upload.Uploading...")} {uploadProgress}%</> : <>{t("pdf-upload.Processing")}</>}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-medium mb-4">{t("pdf-upload.Why use AI PDF Chat?")}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium">{t("pdf-upload.Quick Analysis")}</h4>
                                <p className="text-sm text-gray-500 mt-1">{t("pdf-upload.Quick Analysis description")}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium">{t("pdf-upload.Ask Questions")}</h4>
                                <p className="text-sm text-gray-500 mt-1">{t("pdf-upload.Ask Questions description")}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium">{t("pdf-upload.Summarize")}</h4>
                                <p className="text-sm text-gray-500 mt-1">{t("pdf-upload.Summarize description")}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

