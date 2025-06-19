"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Image from "next/image"

const slides = [
  {
    id: 1,
    title: "Transform Your Space with Premium Flooring",
    description: "Expert installation of epoxy, hardwood, tile, and more for residential and commercial spaces.",
    image: "/office.jpg?height=800&width=1600",
    alt: "Modern living room with premium flooring",
  },
  {
    id: 2,
    title: "Epoxy Flooring Specialists",
    description: "Durable, seamless, and stunning epoxy floors for garages, basements, and commercial spaces.",
    image: "/new.jpg?height=800&width=1600",
    alt: "Epoxy floor installation in a garage",
  },
  {
    id: 3,
    title: "Custom Tile Design & Installation",
    description: "Unique tile patterns and expert installation to elevate your home or business.",
    image: "/tiles.jpg?height=800&width=1600",
    alt: "Custom tile installation in a bathroom",
  },
]

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 hero-slide ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          } transition-opacity duration-1000`}
        >
          {/* Image with overlay */}
          <div className="absolute inset-0">
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.alt}
              fill
              priority={index === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Content */}
          <div className="relative z-20 h-full container mx-auto px-4 flex flex-col justify-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{slide.title}</h1>
              <p className="text-lg md:text-xl opacity-90 mb-8">{slide.description}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="font-medium">
                  Get a Free Quote
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white font-medium"
                >
                  View Our Work
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-primary w-8" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default HeroSection
