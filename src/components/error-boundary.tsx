"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft, Home, RefreshCw } from "lucide-react"
import { Link, useNavigate, useRouteError } from "react-router-dom"

interface ErrorBoundaryProps {
  fallback?: React.ReactNode
}

export function ErrorBoundary({ fallback }: ErrorBoundaryProps) {
  const [_error, setError] = useState<Error | null>(null)
  const error = useRouteError() as Error | null;

  useEffect(() => {
    // Add error event listener for uncaught errors
    const handleError = (event: ErrorEvent) => {
      event.preventDefault()
      setError(event.error || new Error("An unknown error occurred"))
    }

    window.addEventListener("error", handleError)

    return () => window.removeEventListener("error", handleError)
  }, [])

  if (error || _error) {
    // If a custom fallback is provided, use it
    if (fallback) return <>{fallback}</>

    // Otherwise use the default error UI
    return <ErrorDisplay error={_error! || error} reset={() => setError(null)} />
  }

  return <></>
}

interface ErrorDisplayProps {
  error: Error
  reset: () => void
}

function ErrorDisplay({ error, reset }: ErrorDisplayProps) {
  const history = useNavigate()
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[500px] p-4 bg-gradient-to-b from-background to-muted/30">
      <div className="w-full max-w-md mx-auto text-center">
        {/* Error Icon */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-red-500/10 blur-xl rounded-full"></div>
          <div className="relative bg-background border border-red-200 rounded-full p-6 inline-flex">
            <div className="bg-red-50 rounded-full p-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-3 mb-8">
          <h2 className="text-2xl font-bold tracking-tight">出现了一个问题</h2>
          <p className="text-muted-foreground">
            很抱歉，我们遇到了一个意外错误。我们的团队已经收到通知，正在努力修复。
          </p>

          {/* Error Details (collapsible for developers) */}
          <details className="mt-4 text-left bg-background border rounded-lg overflow-hidden">
            <summary className="px-4 py-2 cursor-pointer font-medium text-sm hover:bg-muted/50 focus:outline-none">
              查看技术详情
            </summary>
            <div className="p-4 bg-muted/30 border-t text-sm font-mono overflow-auto max-h-[150px]">
              {error.message}
            </div>
          </details>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            <RefreshCw className="h-4 w-4" />
            重试
          </Button>

          <Button variant="outline" asChild className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              返回首页
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

