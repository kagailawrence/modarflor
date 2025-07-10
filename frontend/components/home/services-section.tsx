"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { BASE_URL } from "@/lib/baseUrl"
import { getImageUrl } from "@/lib/getImageUrl"

const ServicesSection = () => {
  const [services, setServices] = useState<any[]>([])
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${BASE_URL}/api/services?limit=4&featured=true`)
        if (!res.ok) throw new Error("Failed to fetch services")
        const data = await res.json()
        let arr: any[] = []
        if (Array.isArray(data)) arr = data
        else if (Array.isArray(data.data)) arr = data.data
        else if (Array.isArray(data.services)) arr = data.services
        setServices(arr.slice(0, 4))
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl">
              Discover our range of flooring services designed to meet your needs and elevate your space.
            </p>
          </div>
          <Button variant="ghost" className="hidden md:flex items-center mt-4 md:mt-0" asChild>
            <Link href="/services">
              View All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="animate-pulse bg-muted rounded-lg h-96 w-full" />
            ))
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : services.length === 0 ? (
            <div>No featured services found.</div>
          ) : (
            services.map((service) => (
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
                      src={getImageUrl(service.image_url)}
                      alt={service.alt || service.title || "Service image"}
                      fill
                      className={`object-cover transition-transform duration-500 ${
                        hoveredId === service.id ? "scale-110" : "scale-100"
                      }`}
                    />
                  </div>
                  <CardContent className="p-6">
                    {getImageUrl(service.image)}

                    <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <ul className="mb-4 space-y-1">
                      {service.features.map((feature: any, index: number) => (
                        <li key={index} className="flex items-center text-sm">
                          <span className="mr-2 text-primary">✓</span>
                          {feature.description}
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
            ))
          )}
        </div>
        <div className="mt-10 text-center md:hidden">
          <Button asChild>
            <Link href="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
