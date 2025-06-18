"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { BASE_URL } from "@/lib/baseUrl"
import { useToast } from "@/components/ui/use-toast"

type UserRole = "Admin" | "Editor" | "Viewer" | string;

interface UserEditFormData {
  name: string
  email: string
  password?: string // Optional: only if changing
  role: UserRole
}

// For fetching, as password won't be returned
interface UserData extends Omit<UserEditFormData, 'password'> {
  id: string;
  createdAt?: string;
}


export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const userId = params?.id as string

  const [loading, setLoading] = useState(false) // For form submission
  const [pageLoading, setPageLoading] = useState(true) // For initial data fetch
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<UserEditFormData>({
    name: "",
    email: "",
    password: "", // Keep empty initially
    role: "Viewer", // Default role
  })
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchUserDetails()
    }
  }, [userId])

  const fetchUserDetails = async () => {
    setPageLoading(true)
    setFormError(null)
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        toast({ title: "Authentication Error", description: "Please log in again.", variant: "destructive"})
        router.push("/admin/login")
        setPageLoading(false)
        return
      }
      // GET /api/users/:id requires admin or self. Admin panel context implies admin.
      const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
         headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch user details")
      }
      const user: UserData = await response.json()
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        password: "", // Password should not be pre-filled
      })
    } catch (err) {
      console.error("Error fetching user details:", err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."
      setFormError(errorMessage)
      toast({ title: "Error Fetching Data", description: errorMessage, variant: "destructive" })
    } finally {
      setPageLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormError(null)
  }

  const handleRoleChange = (value: UserRole) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFormError(null)

    const payload: Partial<UserEditFormData> = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        setFormError("New password must be at least 6 characters long.")
        setLoading(false)
        toast({ title: "Invalid Input", description: "Password must be at least 6 characters if changing.", variant: "destructive"})
        return
      }
      payload.password = formData.password
    }


    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        setFormError("Authentication error. Please log in again.")
        toast({ title: "Authentication Error", description: "Please log in again.", variant: "destructive"})
        router.push("/admin/login")
        setLoading(false)
        return
      }

      const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload), // Send only fields that can be updated
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update user")
      }

      toast({ title: "Success!", description: "User updated successfully." })
      router.push("/admin/users")
    } catch (err) {
      console.error("Error updating user:", err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."
      setFormError(errorMessage)
      toast({ title: "Error Updating User", description: errorMessage, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }


  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading user details...</p>
      </div>
    )
  }

  if (formError && !pageLoading && !formData.name) { // If initial fetch failed badly
     return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to Load User Details</h2>
        <p className="text-muted-foreground mb-4">{formError}</p>
        <Button onClick={fetchUserDetails} className="mr-2">Try Again</Button>
        <Button variant="outline" onClick={() => router.push("/admin/users")}>
            Back to Users
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
            <h1 className="text-3xl font-bold">Edit User</h1>
            <p className="text-muted-foreground">Update details for: {formData.name || userId}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formError && !pageLoading && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{formError}</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="user@example.com" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New Password (Optional)</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password || ""}
                  onChange={handleInputChange}
                  placeholder="Leave blank to keep current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
               <p className="text-xs text-muted-foreground">Enter a new password only if you want to change it. Min 6 characters.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange} required>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading || pageLoading} className="w-full md:w-auto">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating User...
                </>
              ) : (
                "Update User"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
