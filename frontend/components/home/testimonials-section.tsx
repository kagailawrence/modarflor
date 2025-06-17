"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Homeowner",
    content:
      " ModarFlor transformed our outdated kitchen with beautiful tile flooring. The team was professional, efficient, and the results exceeded our expectations!",
    rating: 5,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Business Owner",
    content:
      "We hired  ModarFlor for our restaurant renovation. Their epoxy flooring solution was perfect - durable, easy to clean, and looks amazing. Highly recommend!",
    rating: 5,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Interior Designer",
    content:
      "As an interior designer, I've worked with many flooring companies, but  ModarFlor stands out. Their attention to detail and quality craftsmanship is unmatched.",
    rating: 5,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Property Manager",
    content:
      "Managing multiple properties means I need reliable contractors.  ModarFlor has been my go-to for all flooring needs - always on time, on budget, and excellent results.",
    rating: 4,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 5,
    name: "Jennifer Williams",
    role: "Homeowner",
    content:
      "The hardwood flooring installation in our living room is stunning! The team was knowledgeable, clean, and finished ahead of schedule. We couldn't be happier!",
    rating: 5,
    image: "/placeholder.svg?height=100&width=100",
  },
]

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(nextTestimonial, 5000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused])

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients have to say about our flooring solutions.
          </p>
        </div>

        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="bg-background shadow-md">
                    <CardContent className="p-8">
                      <div className="flex justify-center mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-center text-lg mb-6 italic">"{testimonial.content}"</p>
                      <div className="flex flex-col items-center">
                        <Avatar className="h-16 w-16 mb-3">
                          <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                          <AvatarFallback>
                            {testimonial.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          <p className="text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeIndex ? "bg-primary w-8" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
