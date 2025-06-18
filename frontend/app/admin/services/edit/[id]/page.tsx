"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, XCircle, Loader2, ArrowLeft } from "lucide-react"
import { BASE_URL } from "@/lib/baseUrl"
import { useToast } from "@/components/ui/use-toast"

interface ServiceData { // For both fetch and payload
  id?: string
  title: string
  description: string
  image?: string
  alt?: string
  order?: number | string
  features?: string[]
}

export default function EditServicePage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const serviceId = params?.id as string

  const [loading, setLoading] = useState(false) // For form submission
  const [pageLoading, setPageLoading] = useState(true) // For initial data fetch
  const [formData, setFormData] = useState<ServiceData>({
    title: "",
    description: "",
    image: "",
    alt: "",
    order: "",
    features: [""],
  })
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails()
    }
  }, [serviceId])

  const fetchServiceDetails = async () => {
    setPageLoading(true)
    setFormError(null)
    try {
      const token = localStorage.getItem("accessToken")
      // No auth for public GET /api/services/:id - if this changes, add token
      const response = await fetch(`${BASE_URL}/api/services/${serviceId}`, {
        // headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch service details")
      }
      const service: ServiceData = await response.json()
      setFormData({
        ...service,
        order: service.order !== undefined ? String(service.order) : "",
        features: service.features && service.features.length > 0 ? service.features : [""],
      })
    } catch (err) {
      console.error("Error fetching service details:", err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."
      setFormError(errorMessage) // Show error prominently if fetch fails
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

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])]
    newFeatures[index] = value
    setFormData((prev) => ({ ...prev, features: newFeatures }))
  }

  const addFeatureInput = () => {
    setFormData((prev) => ({ ...prev, features: [...(prev.features || []), ""] }))
  }

  const removeFeatureInput = (index: number) => {
    if (!formData.features || formData.features.length <= 1) {
        setFormData(prev => ({...prev, features: [""]})); // Reset to one empty if last one removed
        return;
    }
    setFormData((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFormError(null)

    const orderValue = formData.order === "" || formData.order === undefined ? undefined : Number(formData.order)
    if (formData.order !== "" && formData.order !== undefined && (isNaN(orderValue as number) || !Number.isInteger(orderValue))) {
        setFormError("Order must be a whole number if provided.")
        setLoading(false)
        toast({ title: "Invalid Input", description: "Order must be a whole number.", variant: "destructive"})
        return
    }

    const payload: Omit<ServiceData, 'id'> = {
      ...formData,
      features: (formData.features || []).filter(f => f.trim() !== ""),
      order: orderValue,
    }

    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        setFormError("Authentication error. Please log in again.")
        toast({ title: "Authentication Error", description: "Please log in again.", variant: "destructive"})
        router.push("/admin/login")
        setLoading(false)
        return
      }

      const response = await fetch(`${BASE_URL}/api/services/${serviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update service")
      }

      toast({ title: "Success!", description: "Service updated successfully." })
      router.push("/admin/services")
    } catch (err) {
      console.error("Error updating service:", err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."
      setFormError(errorMessage)
      toast({ title: "Error Updating Service", description: errorMessage, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading service details...</p>
      </div>
    )
  }

  // If initial fetch failed and we have an error for it
  if (formError && !pageLoading && !formData.title) {
     return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to Load Service Details</h2>
        <p className="text-muted-foreground mb-4">{formError}</p>
        <Button onClick={fetchServiceDetails} className="mr-2">Try Again</Button>
        <Button variant="outline" asChild>
            <Link href="/admin/services">Back to Services</Link>
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
            <h1 className="text-3xl font-bold">Edit Service</h1>
            <p className="text-muted-foreground">Update details for: {formData.title || serviceId}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Service Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formError && !pageLoading && ( // Show formError only if not pageLoading
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{formError}</span>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Epoxy Flooring" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the service" required rows={3} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input id="image" name="image" value={formData.image || ""} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="alt">Image Alt Text</Label>
                    <Input id="alt" name="alt" value={formData.alt || ""} onChange={handleInputChange} placeholder="Descriptive alt text for image" />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="order">Display Order (Optional)</Label>
                <Input id="order" name="order" type="number" value={formData.order} onChange={handleInputChange} placeholder="e.g., 1, 2, 3..." />
            </div>

            <div>
              <Label>Features</Label>
              {(formData.features || [""]).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                  />
                  { (formData.features || []).length > 1 || (formData.features && formData.features[0] !== "") ? (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeFeatureInput(index)} aria-label="Remove feature">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </Button>
                  ) : null}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addFeatureInput}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Feature
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading || pageLoading} className="w-full md:w-auto">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating Service...
                </>
              ) : (
                "Update Service"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
