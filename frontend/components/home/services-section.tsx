"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const services = [
  {
    id: 1,
    title: "Epoxy Flooring",
    description: "Durable, seamless, and customizable epoxy floors for garages, basements, and commercial spaces.",
    image: "/Epoxy Flooring.jpg?height=400&width=600",
    alt: "Epoxy flooring installation",
    features: ["Stain Resistant", "Easy to Clean", "Customizable Designs", "Long-Lasting"],
  },
  {
    id: 2,
    title: "Tile Installation",
    description:
      "Expert installation of ceramic, porcelain, and natural stone tiles for any room in your home or business.",
    image: "/Tile Installation.jpg?height=400&width=600",
    alt: "Tile installation",
    features: ["Custom Patterns", "Waterproof Options", "Heated Floors", "Wide Selection"],
  },
  {
    id: 3,
    title: "Carpet Installation",
    description: "Professional carpet installation with a wide range of styles, colors, and textures to choose from.",
    image: "/Carpet Installation.jpg?height=400&width=600",
    alt: "Carpet installation",
    features: ["Stain Protection", "Pet-Friendly Options", "Sound Insulation", "Comfort"],
  },
  {
    id: 4,
    title: "Hardwood Flooring",
    description: "Beautiful, timeless hardwood floors installed with precision and care for lasting beauty.",
    image: "/Hardwood Flooring.jpg?height=400&width=600",
    alt: "Hardwood flooring installation",
    features: ["Solid & Engineered", "Refinishing", "Custom Stains", "Eco-Friendly Options"],
  },
]

const ServicesSection = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We offer a comprehensive range of flooring solutions to meet your residential and commercial needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: service.id * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="h-full"
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Card className="h-full service-card overflow-hidden">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.alt}
                    fill
                    className={`object-cover transition-transform duration-500 ${
                      hoveredId === service.id ? "scale-110" : "scale-100"
                    }`}
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="mb-4 space-y-1">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <span className="mr-2 text-primary">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${service.id}`}
                    className="text-primary font-medium inline-flex items-center hover:underline"
                  >
                    Learn More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild>
            <Link href="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
