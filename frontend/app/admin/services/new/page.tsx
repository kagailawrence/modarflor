"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, XCircle, Loader2, ArrowLeft } from "lucide-react"
import { BASE_URL } from "@/lib/baseUrl"
import { useToast } from "@/components/ui/use-toast"

interface ServiceFormData {
  title: string
  description: string
  image: string // URL for the image
  alt: string   // Alt text for the image
  order: number | string // Can be string then parsed
  features: string[]
}

export default function NewServicePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ServiceFormData>({
    title: "",
    description: "",
    image: "",
    alt: "",
    order: "", // Initialize as empty string, convert to number on submit
    features: [""], // Start with one empty feature input
  })
  const [formError, setFormError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormError(null)
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData((prev) => ({ ...prev, features: newFeatures }))
  }

  const addFeatureInput = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }))
  }

  const removeFeatureInput = (index: number) => {
    if (formData.features.length <= 1) return // Keep at least one input
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFormError(null)

    const orderValue = formData.order === "" ? undefined : Number(formData.order)
    if (formData.order !== "" && (isNaN(orderValue as number) || !Number.isInteger(orderValue))) {
        setFormError("Order must be a whole number if provided.")
        setLoading(false)
        toast({ title: "Invalid Input", description: "Order must be a whole number.", variant: "destructive"})
        return
    }

    const payload = {
      ...formData,
      features: formData.features.filter(f => f.trim() !== ""), // Remove empty features
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

      const response = await fetch(`${BASE_URL}/api/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create service")
      }

      toast({ title: "Success!", description: "Service created successfully." })
      router.push("/admin/services")
    } catch (err) {
      console.error("Error creating service:", err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."
      setFormError(errorMessage)
      toast({ title: "Error Creating Service", description: errorMessage, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
            <h1 className="text-3xl font-bold">Add New Service</h1>
            <p className="text-muted-foreground">Fill in the details to create a new service.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Service Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formError && (
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
                    <Input id="image" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="alt">Image Alt Text</Label>
                    <Input id="alt" name="alt" value={formData.alt} onChange={handleInputChange} placeholder="Descriptive alt text for image" />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="order">Display Order (Optional)</Label>
                <Input id="order" name="order" type="number" value={formData.order} onChange={handleInputChange} placeholder="e.g., 1, 2, 3..." />
            </div>

            <div>
              <Label>Features</Label>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                  />
                  {formData.features.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeFeatureInput(index)} aria-label="Remove feature">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addFeatureInput}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Feature
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Service...
                </>
              ) : (
                "Create Service"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
