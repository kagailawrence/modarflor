"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
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
import { BASE_URL } from "@/lib/baseUrl" // Import BASE_URL
import { useToast } from "@/components/ui/use-toast" // For user feedback
import { authFetch } from "@/lib/authFetch"
import { getImageUrl } from "@/lib/getImageUrl"

// Define an interface for the project structure
interface ProjectImage {
  url: string
  alt: string
  isFeatured?: boolean // Assuming this might exist
}

interface Project {
  id: string // Or number, depending on your API
  title: string
  description: string
  category: string
  type: string
  images: ProjectImage[]
  createdAt: string // Or Date
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null) // For fetch errors
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [paginationLoading, setPaginationLoading] = useState(false)
  const { toast } = useToast()
  // Add any other relevant fields from your API

  useEffect(() => {
    fetchProjects()
  }, [page])

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        setError("Authentication token not found. Please login again.")
        setLoading(false)
        return
      }
      const response = await authFetch(`${BASE_URL}/api/projects?page=${page}&limit=9`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to fetch projects: ${response.statusText}`)
      }
      const result = await response.json()
      const data = Array.isArray(result.data)
        ? result.data.map((p: any) => ({ ...p, id: String(p.id) }))
        : []
      setProjects(data)
      setTotalPages(result.pagination?.totalPages || 1)
    } catch (err) {
      console.error("Error fetching projects:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred while fetching projects.")
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" })
        return
      }

      const response = await authFetch(`${BASE_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete project")
      }

      setProjects((prevProjects) => prevProjects.filter((p) => p.id !== id))
      toast({ title: "Success", description: "Project deleted successfully." })
    } catch (err) {
      console.error("Error deleting project:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not delete project.",
        variant: "destructive",
      })
    }
  }

  const filteredProjects = projects.filter((project: Project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
    const matchesType = typeFilter === "all" || project.type === typeFilter

    return matchesSearch && matchesCategory && matchesType
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Plus className="h-8 w-8 animate-spin text-primary" /> {/* Using Plus as a spinner example */}
        <p className="ml-2">Loading projects...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-xl mb-4">Error: {error}</p>
        <Button onClick={fetchProjects}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Residential">Residential</SelectItem>
            <SelectItem value="Commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Epoxy">Epoxy</SelectItem>
            <SelectItem value="Tile">Tile</SelectItem>
            <SelectItem value="Carpet">Carpet</SelectItem>
            <SelectItem value="Hardwood">Hardwood</SelectItem>
            <SelectItem value="Vinyl">Vinyl</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project: any) => (
          <Card key={project.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={getImageUrl(project.images[0]?.url) || "/placeholder.svg"}
                alt={project.images[0]?.alt || project.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex gap-2 mb-2">
                <Badge variant="outline">{project.category}</Badge>
                <Badge variant="secondary">{project.type}</Badge>
              </div>
              <h3 className="font-semibold mb-2">{project.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/portfolio/${project.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    {/* Ensure the link is correct for your routing setup for edit page */}
                    <Link href={`/admin/projects/edit/${project.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      {/* Added text for better UX, or keep as icon-only if preferred */}
                      <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the project
                          <span className="font-semibold"> {project.title}</span>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteProject(project.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete Project
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || paginationLoading}>
            Previous
          </Button>
          <span className="px-4 py-2">Page {page} of {totalPages}</span>
          <Button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || paginationLoading}>
            Next
          </Button>
        </div>
      )}

      {projects.length > 0 && filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found matching your current filters.</p>
        </div>
      )}

      {projects.length === 0 && !loading && !error && (
         <div className="text-center py-12">
           <p className="text-muted-foreground">No projects found. Get started by adding a new project.</p>
           <Button asChild className="mt-4">
             <Link href="/admin/projects/new">
               <Plus className="h-4 w-4 mr-2" />
               Add Project
             </Link>
           </Button>
         </div>
      )}
    </div>
  )
}
