"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { BASE_URL } from "@/lib/baseUrl"
import { useToast } from "@/components/ui/use-toast"

// Keep UserRole type specific if possible, or string if roles can be arbitrary
type UserRole = "Admin" | "Editor" | "Viewer" | string;

interface UserFormData {
  name: string
  email: string
  password?: string // Optional on edit, required on create
  role: UserRole
}

export default function NewUserPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    role: "Viewer", // Default role
  })
  const [formError, setFormError] = useState<string | null>(null)

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

    if (!formData.password || formData.password.length < 6) {
      setFormError("Password is required and must be at least 6 characters long.")
      setLoading(false)
      toast({ title: "Invalid Input", description: "Password must be at least 6 characters.", variant: "destructive"})
      return
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

      // POST /api/users is for user registration (public)
      // Admin creating user might be POST /api/admin/users or similar,
      // or POST /api/users with an admin token implies admin action.
      // Assuming current backend POST /api/users can be used by admin to create any role.
      const response = await fetch(`${BASE_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Admin token
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create user")
      }

      toast({ title: "Success!", description: "User created successfully." })
      router.push("/admin/users")
    } catch (err) {
      console.error("Error creating user:", err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."
      setFormError(errorMessage)
      toast({ title: "Error Creating User", description: errorMessage, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New User</h1>
          <p className="text-muted-foreground">Create a new user account and assign a role.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formError && (
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
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password || ""}
                  onChange={handleInputChange}
                  placeholder="Enter a strong password"
                  required
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
                  {/* Add other roles if applicable */}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating User...
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
