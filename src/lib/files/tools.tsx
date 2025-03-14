import React from "react"
import { FileFormat } from "@/service/api"
import {
  File,
  FileArchive,
  FileAudio,
  FileIcon as FilePdf,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType,
  FileVideo,
} from "lucide-react"

export const FileFormatIcon = ({ fileFormat }: { fileFormat: FileFormat }) => {
  switch (fileFormat) {
    case FileFormat.DocumentSlate:
    case FileFormat.DocumentMarkdown:
      return <FileText className="text-blue-500" />
    case FileFormat.FileImg:
      return <FileImage className="text-purple-500" />
    case FileFormat.FilePDF:
      return <FilePdf className="text-red-500" />
    case FileFormat.FileDoc:
      return <FileText className="text-blue-600" />
    case FileFormat.FileXLS:
      return <FileSpreadsheet className="text-green-600" />
    case FileFormat.FilePPT:
      return <FileType className="text-orange-500" />
    case FileFormat.FileMP3:
      return <FileAudio className="text-yellow-600" />
    case FileFormat.FileMP4:
      return <FileVideo className="text-purple-600" />
    case FileFormat.FileZIP:
      return <FileArchive className="text-gray-600" />
    default:
      return <File className="text-gray-500" />
  }
}

// Format file type label
export const getFileTypeLabel = (fileFormat: FileFormat): string => {
  switch (fileFormat) {
    case FileFormat.DocumentSlate:
      return "Slate document"
    case FileFormat.DocumentMarkdown:
      return "Markdown document"
    case FileFormat.FileImg:
      return "Image"
    case FileFormat.FilePDF:
      return "PDF document"
    case FileFormat.FileDoc:
      return "Word document"
    case FileFormat.FileXLS:
      return "Excel spreadsheet"
    case FileFormat.FilePPT:
      return "PowerPoint"
    case FileFormat.FileMP3:
      return "Audio file"
    case FileFormat.FileMP4:
      return "Video file"
    case FileFormat.FileZIP:
      return "Archive"
    default:
      return "Unknown file"
  }
}