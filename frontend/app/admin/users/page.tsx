"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Search, AlertCircle, Loader2, UserCircle, CalendarDays } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { BASE_URL } from "@/lib/baseUrl"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { authFetch } from "@/lib/authFetch"


interface User {
  id: string
  name: string
  email: string
  role: "Admin" | "Editor" | "Viewer" | string // Allow for other roles if any
  createdAt?: string // Or Date
  // Add other fields like profile picture URL if available
  image?: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const { toast } = useToast()
  const router = useRouter() // Import useRouter for redirection

  useEffect(() => {
    fetchUsers()
  }, [])

  const clearAuthAndRedirect = () => {
    toast({ title: "Session Expired", description: "Please log in again.", variant: "destructive" });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    router.push("/admin/login");
  }

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        setError("Authentication token not found. Please login again.")
        setLoading(false)
        clearAuthAndRedirect(); // Should be caught by layout, but defensive
        return
      }
      const response = await authFetch(`${BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          clearAuthAndRedirect();
          return;
        }
        const errorData = await response.json().catch(() => ({ message: "Failed to fetch users and parse error."}));
        throw new Error(errorData.message || "Failed to fetch users")
      }
      const data: User[] = await response.json()
      setUsers(Array.isArray(data) ? data : (data as any).users || [])
    } catch (error) {
      console.error("Error fetching users:", error)
      // Avoid setting error if redirection happened or is about to happen
      if (!(error instanceof Error && (error.message.includes("401") || error.message.includes("403")))) {
         setError(error instanceof Error ? error.message : "An unknown error occurred.")
      }
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        clearAuthAndRedirect();
        return
      }
      const response = await authFetch(`${BASE_URL}/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          clearAuthAndRedirect();
          return;
        }
        const errorData = await response.json().catch(() => ({ message: "Failed to delete user and parse error."}));
        throw new Error(errorData.message || "Failed to delete user")
      }
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId))
      toast({ title: "Success", description: "User deleted successfully." })
    } catch (err) {
      console.error("Error deleting user:", err)
      if (err instanceof Error && (err.message.includes("401") || err.message.includes("403"))) {
        // Error toast is handled by clearAuthAndRedirect
      } else {
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Could not delete user.",
          variant: "destructive",
        })
      }
    }
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadgeVariant = (role: User["role"]) => {
    switch (role) {
      case "Admin": return "destructive";
      case "Editor": return "default";
      case "Viewer": return "secondary";
      default: return "outline";
    }
  }


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading users...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to Load Users</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchUsers}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="w-4 h-4 mr-2" /> Add New User
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-1/3"
            />
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {users.length === 0 ? "No users found." : "No users found matching your search."}
              </p>
              {users.length === 0 && (
                 <Button asChild className="mt-4">
                   <Link href="/admin/users/new">
                     <Plus className="h-4 w-4 mr-2" /> Add First User
                   </Link>
                 </Button>
               )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map(u => (
                <Card key={u.id} className="flex flex-col">
                  <CardContent className="p-4 flex flex-col flex-grow gap-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 border">
                        <AvatarImage src={u.image || undefined} alt={u.name} />
                        <AvatarFallback>
                          {u.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h2 className="font-semibold text-lg">{u.name}</h2>
                        <p className="text-xs text-muted-foreground break-all">{u.email}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-sm">
                        <div className="flex items-center gap-1.5">
                            <UserCircle className="w-3.5 h-3.5 text-muted-foreground"/>
                            Role: <Badge variant={getRoleBadgeVariant(u.role)}>{u.role}</Badge>
                        </div>
                        {u.createdAt && (
                            <div className="flex items-center gap-1.5">
                                <CalendarDays className="w-3.5 h-3.5 text-muted-foreground"/>
                                Joined: {new Date(u.createdAt).toLocaleDateString()}
                            </div>
                        )}
                    </div>

                    <div className="mt-auto flex gap-2 pt-3 border-t border-muted/50">
                        <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/users/edit/${u.id}`}>
                          <Edit className="w-4 h-4 mr-1.5" /> Edit
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the user: <span className="font-semibold">{u.name} ({u.email})</span>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(u.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete User
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
