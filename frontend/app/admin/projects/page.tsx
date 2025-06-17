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

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockProjects = [
        {
          id: "1",
          title: "Modern Epoxy Garage Floor",
          description: "A sleek, durable epoxy floor installation for a modern home garage.",
          category: "Residential",
          type: "Epoxy",
          images: [{ url: "/placeholder.svg?height=300&width=400", alt: "Epoxy floor", isFeatured: true }],
          createdAt: "2024-01-15",
        },
        {
          id: "2",
          title: "Luxury Tile Bathroom",
          description: "Custom tile design and installation for a luxury master bathroom.",
          category: "Residential",
          type: "Tile",
          images: [{ url: "/placeholder.svg?height=300&width=400", alt: "Tile bathroom", isFeatured: true }],
          createdAt: "2024-01-10",
        },
        {
          id: "3",
          title: "Commercial Office Carpet",
          description: "High-traffic carpet installation for a corporate office space.",
          category: "Commercial",
          type: "Carpet",
          images: [{ url: "/placeholder.svg?height=300&width=400", alt: "Office carpet", isFeatured: true }],
          createdAt: "2024-01-05",
        },
      ]
      setProjects(mockProjects)
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    try {
      // API call to delete project
      console.log("Deleting project:", id)
      // Remove from local state
      setProjects(projects.filter((p: any) => p.id !== id))
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  const filteredProjects = projects.filter((project: any) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
    const matchesType = typeFilter === "all" || project.type === typeFilter

    return matchesSearch && matchesCategory && matchesType
  })

  if (loading) {
    return <div>Loading...</div>
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
                src={project.images[0]?.url || "/placeholder.svg"}
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
                    <Link href={`/admin/projects/${project.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the project.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteProject(project.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
