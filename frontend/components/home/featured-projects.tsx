"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { BASE_URL } from "@/lib/baseUrl"
import { getImageUrl } from "@/lib/getImageUrl"

const FeaturedProjects = () => {
  const [projects, setProjects] = useState<any[]>([])
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${BASE_URL}/api/projects?limit=3&featured=true`)
        if (!res.ok) throw new Error("Failed to fetch projects")
        const data = await res.json()
      console.log(data)
        let arr: any[] = []
        if (Array.isArray(data)) arr = data
        else if (Array.isArray(data.data)) arr = data.data
        else if (Array.isArray(data.projects)) arr = data.projects
        setProjects(arr.slice(0, 3))
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-muted-foreground max-w-2xl">
              Explore our recent work and see how we've transformed spaces with our premium flooring solutions.
            </p>
          </div>
          <Button variant="ghost" className="hidden md:flex items-center mt-4 md:mt-0" asChild>
            <Link href="/portfolio">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : projects.length === 0 ? (
            <div>No featured projects found.</div>
          ) : (
            projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: project.id * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg">
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={getImageUrl(project.images?.[0]?.url)}
                      alt={project.images?.[0]?.alt || project.title || "Project image"}
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
            ))
          )}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Button asChild>
            <Link href="/portfolio">View All Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProjects
