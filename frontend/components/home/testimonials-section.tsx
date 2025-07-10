"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { BASE_URL } from "@/lib/baseUrl"

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${BASE_URL}/api/testimonials`)
        if (!res.ok) throw new Error("Failed to fetch testimonials")
        const data = await res.json()
        let arr: any[] = []
        if (Array.isArray(data)) arr = data
        else if (Array.isArray(data.data)) arr = data.data
        else if (Array.isArray(data.testimonials)) arr = data.testimonials
        setTestimonials(arr)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (!isPaused && testimonials.length > 0) {
      intervalRef.current = setInterval(nextTestimonial, 5000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused, testimonials.length])

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">What Our Clients Say</h2>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            {loading ? (
              Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="animate-pulse bg-muted rounded-lg h-40 w-full mb-6" />
              ))
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : testimonials.length === 0 ? (
              <div className="text-center">No testimonials found.</div>
            ) : (
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
                                <AvatarImage src={testimonial.imageUrl || testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                                <AvatarFallback>
                                  {testimonial.name
                                    .split(" ")
                                    .map((n: string) => n[0])
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
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
