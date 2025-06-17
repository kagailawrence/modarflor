"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const projects = [
  {
    id: 1,
    title: "Modern Epoxy Garage Floor",
    category: "Residential",
    type: "Epoxy",
    description: "A sleek, durable epoxy floor installation for a modern home garage.",
    image: "/placeholder.svg?height=600&width=800",
    alt: "Modern epoxy garage floor",
  },
  {
    id: 2,
    title: "Luxury Tile Bathroom",
    category: "Residential",
    type: "Tile",
    description: "Custom tile design and installation for a luxury master bathroom.",
    image: "/placeholder.svg?height=600&width=800",
    alt: "Luxury tile bathroom",
  },
  {
    id: 3,
    title: "Commercial Office Carpet",
    category: "Commercial",
    type: "Carpet",
    description: "High-traffic carpet installation for a corporate office space.",
    image: "/placeholder.svg?height=600&width=800",
    alt: "Commercial office carpet",
  },
]

const FeaturedProjects = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

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
          {projects.map((project) => (
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
