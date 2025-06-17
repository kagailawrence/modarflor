"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function AdminUsers() {
  const [users, setUsers] = useState<{id: string, name: string, email: string, role: string}[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      const mockUsers = [
        {
          id: "1",
          name: "Admin User",
          email: "admin@ ModarFlor.com",
          role: "Admin",
        },
        {
          id: "2",
          name: "Viewer User",
          email: "viewer@ ModarFlor.com",
          role: "Viewer",
        },
      ]
      setUsers(mockUsers)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ModarFlor Users</h1>
        <Button variant="default" size="sm">
          <Plus className="w-4 h-4 mr-2" /> Add User
        </Button>
      </div>
      <Input
        placeholder="Search users..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-4 max-w-xs"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          users
            .filter(u =>
              u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              u.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(u => (
              <Card key={u.id}>
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-lg">{u.name}</h2>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline"><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">{u.email}</p>
                  <p className="font-medium">Role: {u.role}</p>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  )
}
