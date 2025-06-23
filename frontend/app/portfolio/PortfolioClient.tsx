"use client"
import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Search, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { getImageUrl } from "@/lib/getImageUrl"

interface ProjectImage {
  id: string
  url: string
  alt: string
  isFeatured: boolean
}

interface Project {
  id: string
  title: string
  category: string
  type: string
  description: string
  images: ProjectImage[]
}

export default function PortfolioClient({ projects }: { projects: Project[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects)
  const [visibleProjects, setVisibleProjects] = useState(6)
  const [loadMoreLoading, setLoadMoreLoading] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Filter projects based on search term and filters
  React.useEffect(() => {
    const filtered = projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
      const matchesType = typeFilter === "all" || project.type === typeFilter
      return matchesSearch && matchesCategory && matchesType
    })
    setFilteredProjects(filtered)
    setVisibleProjects(6)
  }, [searchTerm, categoryFilter, typeFilter, projects])

  // Get unique categories and types for filters
  const categories = ["all", ...new Set(projects.map((p) => p.category))]
  const types = ["all", ...new Set(projects.map((p) => p.type))]

  // Load more projects
  const loadMore = () => {
    setLoadMoreLoading(true)
    setVisibleProjects((prev) => Math.min(prev + 3, filteredProjects.length))
    setLoadMoreLoading(false)
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Hero section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Portfolio</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of completed flooring projects across residential and commercial spaces.
          </p>
        </div>
        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
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
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "all" ? "All Types" : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Projects grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.slice(0, visibleProjects).map((project) => {
              // Use the first image as the main image
              const mainImage = project.images && project.images.length > 0 ? project.images[0] : null
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg">
                    <div className="relative h-64 w-full overflow-hidden">
                      <Image
                        src={getImageUrl(mainImage?.url) || "/placeholder.svg"}
                        alt={mainImage?.alt || project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex gap-2 mb-3">
                        <Badge variant="outline">{project.category}</Badge>
                        <Badge variant="secondary">{project.type}</Badge>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-muted-foreground mb-4">{project.description}</p>
                      <Link
                        href={`/portfolio/${project.id}`}
                        className="text-primary font-medium inline-flex items-center hover:underline"
                      >
                        View Project
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {projects.length === 0
                ? "No projects available at the moment."
                : "No projects found matching your criteria."}
            </p>
          </div>
        )}
        {/* Load more button */}
        {visibleProjects < filteredProjects.length && (
          <div className="mt-12 text-center">
            <Button onClick={loadMore} disabled={loadMoreLoading}>
              {loadMoreLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More Projects"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
