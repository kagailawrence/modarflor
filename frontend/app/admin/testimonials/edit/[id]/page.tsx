"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft, Star } from "lucide-react"
import { BASE_URL } from "@/lib/baseUrl"
import { useToast } from "@/components/ui/use-toast"

interface TestimonialData { // For both fetch and payload
  id?: string
  name: string
  role?: string
  content: string
  rating: number | string // Store as string for select, parse to number
  image?: string
}

export default function EditTestimonialPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const testimonialId = params?.id as string

  const [loading, setLoading] = useState(false) // For form submission
  const [pageLoading, setPageLoading] = useState(true) // For initial data fetch
  const [formData, setFormData] = useState<TestimonialData>({
    name: "",
    role: "",
    content: "",
    rating: "",
    image: "",
  })
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (testimonialId) {
      fetchTestimonialDetails()
    }
  }, [testimonialId])

  const fetchTestimonialDetails = async () => {
    setPageLoading(true)
    setFormError(null)
    try {
      // Assuming GET /api/testimonials/:id is public
      const response = await fetch(`${BASE_URL}/api/testimonials/${testimonialId}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch testimonial details")
      }
      const testimonial: TestimonialData = await response.json()
      setFormData({
        ...testimonial,
        rating: String(testimonial.rating), // Convert rating to string for Select
        role: testimonial.role || "",       // Ensure role is not undefined
        image: testimonial.image || "",     // Ensure image is not undefined
      })
    } catch (err) {
      console.error("Error fetching testimonial details:", err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."
      setFormError(errorMessage)
      toast({ title: "Error Fetching Data", description: errorMessage, variant: "destructive" })
    } finally {
      setPageLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormError(null)
  }

  const handleRatingChange = (value: string) => {
    setFormData((prev) => ({ ...prev, rating: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFormError(null)

    if (!formData.rating) {
        setFormError("Please select a rating.")
        setLoading(false)
        toast({ title: "Missing Field", description: "Rating is required.", variant: "destructive"})
        return
    }

    const payload = {
      ...formData,
      rating: Number(formData.rating),
    }
    // Remove id from payload if it exists, as it's usually part of the URL path for PUT
    const { id, ...updatePayload } = payload;


    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        setFormError("Authentication error. Please log in again.")
        toast({ title: "Authentication Error", description: "Please log in again.", variant: "destructive"})
        router.push("/admin/login")
        setLoading(false)
        return
      }

      const response = await fetch(`${BASE_URL}/api/testimonials/${testimonialId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update testimonial")
      }

      toast({ title: "Success!", description: "Testimonial updated successfully." })
      router.push("/admin/testimonials")
    } catch (err) {
      console.error("Error updating testimonial:", err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."
      setFormError(errorMessage)
      toast({ title: "Error Updating Testimonial", description: errorMessage, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const renderStarSelectItems = () => {
    return [5, 4, 3, 2, 1].map(starValue => (
      <SelectItem key={starValue} value={String(starValue)}>
        <div className="flex items-center">
          {starValue} Star{starValue > 1 ? 's' : ''}
          <div className="ml-2 flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < starValue ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </SelectItem>
    ))
  }

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading testimonial details...</p>
      </div>
    )
  }

  if (formError && !pageLoading && !formData.name) { // If initial fetch failed badly
     return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to Load Testimonial</h2>
        <p className="text-muted-foreground mb-4">{formError}</p>
        <Button onClick={fetchTestimonialDetails} className="mr-2">Try Again</Button>
        <Button variant="outline" onClick={() => router.push("/admin/testimonials")}>
            Back to Testimonials
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
            <h1 className="text-3xl font-bold">Edit Testimonial</h1>
            <p className="text-muted-foreground">Update details for: {formData.name || testimonialId}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Testimonial Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formError && !pageLoading &&(
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{formError}</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role/Company (Optional)</Label>
                <Input id="role" name="role" value={formData.role} onChange={handleInputChange} placeholder="e.g., CEO, Example Inc." />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Select value={String(formData.rating)} onValueChange={handleRatingChange} required>
                <SelectTrigger id="rating">
                  <SelectValue placeholder="Select a rating" />
                </SelectTrigger>
                <SelectContent>{renderStarSelectItems()}</SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content/Review</Label>
              <Textarea id="content" name="content" value={formData.content} onChange={handleInputChange} placeholder="Write the testimonial content here..." required rows={5} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Avatar/Image URL (Optional)</Label>
              <Input id="image" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://example.com/avatar.jpg" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading || pageLoading} className="w-full md:w-auto">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating Testimonial...
                </>
              ) : (
                "Update Testimonial"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
