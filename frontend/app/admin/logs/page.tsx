"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { BASE_URL } from "@/lib/baseUrl"
import { useToast } from "@/components/ui/use-toast"

type LogType = "combined" | "error";

export default function AdminLogsPage() {
  const [logContent, setLogContent] = useState<string>("")
  const [selectedLogType, setSelectedLogType] = useState<LogType>("combined")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchLogs = useCallback(async (logType: LogType) => {
    setLoading(true)
    setError(null)
    setLogContent("") // Clear previous logs
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        setError("Authentication token not found. Please login again.")
        toast({ title: "Authentication Error", description: "Please log in again.", variant: "destructive"})
        // router.push("/admin/login"); // Consider redirecting
        setLoading(false)
        return
      }
      const response = await fetch(`${BASE_URL}/api/logs?file=${logType}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to fetch logs and parse error response."}))
        throw new Error(errorData.message || `Failed to fetch logs: ${response.statusText}`)
      }

      const textContent = await response.text()
      setLogContent(textContent)
    } catch (err) {
      console.error(`Error fetching ${logType} logs:`, err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."
      setError(errorMessage)
      toast({ title: `Error Fetching ${logType.replace(/^\w/, c => c.toUpperCase())} Logs`, description: errorMessage, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [toast]) // Added toast to dependency array

  useEffect(() => {
    fetchLogs(selectedLogType)
  }, [selectedLogType, fetchLogs])

  const handleLogTypeChange = (value: string) => {
    setSelectedLogType(value as LogType)
  }

  const handleRefresh = () => {
    fetchLogs(selectedLogType)
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">View System Logs</h1>
        <div className="flex gap-2 items-center">
          <Select value={selectedLogType} onValueChange={handleLogTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select log type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="combined">Combined Logs</SelectItem>
              <SelectItem value="error">Error Logs</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} variant="outline" size="icon" aria-label="Refresh logs">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <Card className="h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)] "> {/* Adjust height as needed */}
        <CardHeader>
          <CardTitle>
            {selectedLogType.replace(/^\w/, c => c.toUpperCase())} Logs
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-4.5rem)]"> {/* Adjust based on CardHeader height */}
          {loading && (
            <div className="flex flex-col justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p>Loading logs...</p>
            </div>
          )}
          {error && !loading && (
            <div className="flex flex-col justify-center items-center h-full text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to Load Logs</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleRefresh}>Try Again</Button>
            </div>
          )}
          {!loading && !error && logContent && (
            <pre className="h-full w-full overflow-auto text-xs bg-muted/30 dark:bg-muted/50 p-4 rounded-md whitespace-pre-wrap break-all">
              <code>{logContent}</code>
            </pre>
          )}
           {!loading && !error && !logContent && (
             <div className="flex flex-col justify-center items-center h-full text-center">
                <p className="text-muted-foreground">No log content to display for {selectedLogType} logs, or file is empty.</p>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  )
}
