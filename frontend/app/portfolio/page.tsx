"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Search, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

import { BASE_URL } from "../../../lib/baseUrl"

interface Project {
	id: string
	title: string
	category: string
	type: string
	description: string
	image: string
	alt: string
}

const PortfolioPage = () => {
	const [allFetchedProjects, setAllFetchedProjects] = useState<Project[]>([])
	const [searchTerm, setSearchTerm] = useState("")
	const [categoryFilter, setCategoryFilter] = useState("all")
	const [typeFilter, setTypeFilter] = useState("all")
	const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
	const [visibleProjects, setVisibleProjects] = useState(6)
	const [pageLoading, setPageLoading] = useState(true)
	const [pageError, setPageError] = useState<string | null>(null)
	const [loadMoreLoading, setLoadMoreLoading] = useState(false)
	const [hoveredId, setHoveredId] = useState<string | null>(null)

	// Fetch all projects
	useEffect(() => {
		const fetchProjects = async () => {
			try {
				setPageLoading(true)
				const response = await fetch(`${BASE_URL}/api/projects`)
				if (!response.ok) {
					throw new Error("Failed to fetch projects")
				}
				const data = await response.json()
				setAllFetchedProjects(data)
				setPageError(null)
			} catch (err) {
				setPageError(err instanceof Error ? err.message : "An unknown error occurred")
				setAllFetchedProjects([]) // Clear projects on error
			} finally {
				setPageLoading(false)
			}
		}
		fetchProjects()
	}, [])

	// Filter projects based on search term and filters
	useEffect(() => {
		const filtered = allFetchedProjects.filter((project) => {
			const matchesSearch =
				project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				project.description.toLowerCase().includes(searchTerm.toLowerCase())

			const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
			const matchesType = typeFilter === "all" || project.type === typeFilter

			return matchesSearch && matchesCategory && matchesType
		})

		setFilteredProjects(filtered)
		setVisibleProjects(6) // Reset visible projects when filters change
	}, [searchTerm, categoryFilter, typeFilter, allFetchedProjects])

	// Load more projects
	const loadMore = () => {
		setLoadMoreLoading(true)
		// Removed simulated loading delay for faster UI, can be added back if desired
		setVisibleProjects((prev) => Math.min(prev + 3, filteredProjects.length))
		setLoadMoreLoading(false)
	}

	// Get unique categories and types for filters
	const categories = ["all", ...new Set(allFetchedProjects.map((p) => p.category))]
	const types = ["all", ...new Set(allFetchedProjects.map((p) => p.type))]

	if (pageLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loader2 className="mr-2 h-8 w-8 animate-spin" />
				<p>Loading projects...</p>
			</div>
		)
	}

	if (pageError) {
		return (
			<div className="flex flex-col justify-center items-center h-screen text-center">
				<p className="text-red-500 text-xl mb-4">Error: {pageError}</p>
				<p className="text-muted-foreground">Please try refreshing the page or contact support if the problem persists.</p>
				<Button onClick={() => window.location.reload()} className="mt-4">
					Refresh Page
				</Button>
			</div>
		)
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
						{filteredProjects.slice(0, visibleProjects).map((project) => (
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
											// Assuming project.image from backend might not have query params
											// and might be a full URL or a relative path like the mock.
											// If it's just a path like "/image.jpg", it will be relative to public folder.
											// If it's a full URL, Next/Image will use it directly.
											src={project.image || "/placeholder.svg"}
											alt={project.alt}
											fill
											className={`object-cover transition-transform duration-500 ${
												hoveredId === project.id ? "scale-110" : "scale-100"
											}`}
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
						))}
					</div>
				) : (
					<div className="text-center py-12">
						<p className="text-muted-foreground">
							{allFetchedProjects.length === 0 && !pageError
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

export default PortfolioPage
