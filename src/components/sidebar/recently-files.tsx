"use client"

import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  Loader2,
  Download,
} from "lucide-react"
import { ApiFileRecent, FileResp } from "@/service/api";
import { SidebarDialog, SidebarOverlay } from "@/components/sidebar/sidebar-dialog";
import dayjs from "dayjs";
import { FileFormatIcon, getFileTypeLabel } from "@/lib/files/tools";


// File icon component

export default function RecentlyFiles({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [files, setFiles] = useState<FileResp[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef<IntersectionObserver | null>(null)
  const pageSize = 10

  // Load initial data
  useEffect(() => {
    loadMoreFiles()
  }, [])

  const loadMoreFiles = useCallback(async () => {
    if (loading) return

    setLoading(true)
    try {
      const response = await ApiFileRecent({
        pagination: {
          currentPage: page,
          pageSize,
        },
      })

      setFiles((prev) => [...prev, ...response.list])
      setPage((prev) => prev + 1)

      // Check if we've reached the end
      if (response.pagination.total && files.length + response.list.length >= response.pagination.total) {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error loading files:", error)
    } finally {
      setLoading(false)
    }
  }, [loading, page, files])

  // Last element ref for infinite scrolling
  const lastFileElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreFiles()
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, hasMore, loadMoreFiles],
  )

  // Format timestamp to readable d

  // Get description (first 10 chars of contentKey)
  const getDescription = (contentKey: string) => {
    return contentKey.substring(0, 10) + (contentKey.length > 50 ? "..." : "")
  }

  const checkSidebarClick = React.useCallback((target: HTMLElement) => {
    return target.closest("[data-sidebar]") !== null;
  }, []);

  // Handle file download
  const handleDownload = useCallback((e: React.MouseEvent, file: FileResp) => {
    e.stopPropagation();
    
    // Create an anchor element
    const anchor = document.createElement('a');
    anchor.href = `/${file.contentKey}`;
    anchor.download = file.name || 'download';
    // Required for Firefox
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    // Clean up
    document.body.removeChild(anchor);
  }, []);

  if (!isOpen) return null


  return (
    <>
      <SidebarOverlay onClick={onClose} />
      <SidebarDialog
        title="Recently Files"
        onClose={onClose}
        isSidebarClick={checkSidebarClick}
      >
        <div className="bg-white rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="divide-y divide-gray-200">
            {files.map((file, index) => {
              const isLastElement = index === files.length - 1

              return (
                <div
                  key={file.id}
                  ref={isLastElement ? lastFileElementRef : null}
                  className="flex items-center p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg mr-4">
                    <FileFormatIcon fileFormat={file.fileFormat} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{file.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{getFileTypeLabel(file.fileFormat)}</span>
                      <span className="mx-2">•</span>
                      <span>{dayjs.unix(file.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{getDescription(file.contentKey)}</p>
                  </div>
                  
                  <div 
                    className="ml-2 p-2 rounded-full hover:bg-gray-200" 
                    title="Download file"
                    onClick={(e) => handleDownload(e, file)}
                  >
                    <Download className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
              )
            })}

            {loading && (
              <div className="flex justify-center items-center p-4">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                <span className="ml-2 text-gray-600">Loading more files...</span>
              </div>
            )}

            {!hasMore && files.length > 0 && <div className="text-center p-4 text-gray-500">No more files to load</div>}

            {files.length === 0 && !loading && <div className="h-full text-center p-8 text-gray-500">No files found</div>}
          </div>
        </div>
      </SidebarDialog>
    </>
  )
}
