"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<{id: string, name: string, content: string, rating: number}[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>("")

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      const mockTestimonials = [
        {
          id: "1",
          name: "Sarah Johnson",
          content: "ModarFlor transformed our outdated kitchen with beautiful tile flooring.",
          rating: 5,
        },
        {
          id: "2",
          name: "Michael Chen",
          content: "Their epoxy flooring solution was perfect - durable, easy to clean, and looks amazing.",
          rating: 5,
        },
      ]
      setTestimonials(mockTestimonials)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ModarFlor Testimonials</h1>
        <Button variant="default" size="sm">
          <Plus className="w-4 h-4 mr-2" /> Add Testimonial
        </Button>
      </div>
      <Input
        placeholder="Search testimonials..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-4 max-w-xs"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          testimonials
            .filter(t =>
              t.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(t => (
              <Card key={t.id}>
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-lg">{t.name}</h2>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline"><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">{t.content}</p>
                  <p className="font-medium">Rating: {t.rating}</p>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  )
}
