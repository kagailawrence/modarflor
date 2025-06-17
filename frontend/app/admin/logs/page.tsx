"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function AdminLogs() {
  const [logs, setLogs] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      // For now, just mock
      setLogs([
        "[2025-06-10T10:00:00Z] ContactMailSent: {\"name\":\"John Doe\",...}",
        "[2025-06-10T10:01:00Z] SubscriptionMailSent: {\"email\":\"jane@example.com\"}",
      ])
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Contact & Subscription Logs</h1>
      <Input
        placeholder="Search logs..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-4 max-w-xl"
      />
      <div className="space-y-2">
        {loading ? (
          <p>Loading...</p>
        ) : (
          logs
            .filter(log => log.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((log, idx) => (
              <Card key={idx}>
                <CardContent className="p-2 font-mono text-xs whitespace-pre-wrap">{log}</CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  )
}
