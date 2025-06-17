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

// Mock projects data
const allProjects = [
	{
		id: "1",
		title: "Modern Epoxy Garage Floor",
		category: "Residential",
		type: "Epoxy",
		description: "A sleek, durable epoxy floor installation for a modern home garage.",
		image: "/placeholder.svg?height=600&width=800",
		alt: "Modern epoxy garage floor",
	},
	{
		id: "2",
		title: "Luxury Tile Bathroom",
		category: "Residential",
		type: "Tile",
		description: "Custom tile design and installation for a luxury master bathroom.",
		image: "/placeholder.svg?height=600&width=800",
		alt: "Luxury tile bathroom",
	},
	{
		id: "3",
		title: "Commercial Office Carpet",
		category: "Commercial",
		type: "Carpet",
		description: "High-traffic carpet installation for a corporate office space.",
		image: "/placeholder.svg?height=600&width=800",
		alt: "Commercial office carpet",
	},
	{
		id: "4",
		title: "Restaurant Epoxy Flooring",
		category: "Commercial",
		type: "Epoxy",
		description: "Durable, easy-to-clean epoxy flooring for a busy restaurant kitchen.",
		image: "/placeholder.svg?height=600&width=800",
		alt: "Restaurant epoxy flooring",
	},
	{
		id: "5",
		title: "Hardwood Living Room",
		category: "Residential",
		type: "Hardwood",
		description: "Beautiful hardwood flooring installation for a family living room.",
		image: "/placeholder.svg?height=600&width=800",
		alt: "Hardwood living room floor",
	},
	{
		id: "6",
		title: "Hotel Lobby Marble Tiles",
		category: "Commercial",
		type: "Tile",
		description: "Elegant marble tile installation for a luxury hotel lobby.",
		image: "/placeholder.svg?height=600&width=800",
		alt: "Hotel lobby marble tiles",
	},
	{
		id: "7",
		title: "Basement Vinyl Flooring",
		category: "Residential",
		type: "Vinyl",
		description: "Waterproof vinyl flooring for a finished basement entertainment area.",
		image: "/placeholder.svg?height=600&width=800",
		alt: "Basement vinyl flooring",
	},
	{
		id: "8",
		title: "Retail Store Laminate Flooring",
		category: "Commercial",
		type: "Laminate",
		description: "Durable laminate flooring for a high-traffic retail environment.",
		image: "/placeholder.svg?height=600&width=800",
		alt: "Retail store laminate flooring",
	},
	{
		id: "9",
		title: "Outdoor Deck Composite",
		category: "Residential",
		type: "Composite",
		description: "Weather-resistant composite deck flooring for outdoor entertainment.",
		image: "/placeholder.svg?height=600&width=800",
		alt: "Outdoor deck composite flooring",
	},
]

const PortfolioPage = () => {
	const [searchTerm, setSearchTerm] = useState("")
	const [categoryFilter, setCategoryFilter] = useState("all")
	const [typeFilter, setTypeFilter] = useState("all")
	const [filteredProjects, setFilteredProjects] = useState(allProjects)
	const [visibleProjects, setVisibleProjects] = useState(6)
	const [loading, setLoading] = useState(false)
	const [hoveredId, setHoveredId] = useState<string | null>(null)

	// Filter projects based on search term and filters
	useEffect(() => {
		const filtered = allProjects.filter((project) => {
			const matchesSearch =
				project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				project.description.toLowerCase().includes(searchTerm.toLowerCase())

			const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
			const matchesType = typeFilter === "all" || project.type === typeFilter

			return matchesSearch && matchesCategory && matchesType
		})

		setFilteredProjects(filtered)
	}, [searchTerm, categoryFilter, typeFilter])

	// Load more projects
	const loadMore = () => {
		setLoading(true)
		// Simulate loading delay
		setTimeout(() => {
			setVisibleProjects((prev) => Math.min(prev + 3, filteredProjects.length))
			setLoading(false)
		}, 800)
	}

	// Get unique categories and types for filters
	const categories = ["all", ...new Set(allProjects.map((p) => p.category))]
	const types = ["all", ...new Set(allProjects.map((p) => p.type))]

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
						<p className="text-muted-foreground">No projects found matching your criteria.</p>
					</div>
				)}

				{/* Load more button */}
				{visibleProjects < filteredProjects.length && (
					<div className="mt-12 text-center">
						<Button onClick={loadMore} disabled={loading}>
							{loading ? (
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
