"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams }
from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X, Plus, Loader2, ArrowLeft } from "lucide-react"
import { BASE_URL } from "@/lib/baseUrl"
import { useToast } from "@/components/ui/use-toast"

// Interfaces (similar to new/page.tsx but might need adjustments for existing images)
interface ProjectImageInput {
  id: string // Can be existing image ID from backend or new temporary ID for client
  url: string // Can be existing URL from backend or data URL for new preview
  alt: string
  isFeatured: boolean
  file?: File // For new uploads
  isExisting?: boolean // Flag to differentiate existing images from new ones
}

interface ProjectImagePayload {
  url: string
  alt: string
  isFeatured: boolean
}

interface ProjectData {
  title: string
  description: string
  category: string
  type: string
  images: ProjectImagePayload[]
}

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const projectId = params?.id as string

  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true) // For initial data fetch
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
  })
  const [images, setImages] = useState<ProjectImageInput[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails()
    }
  }, [projectId])

  const fetchProjectDetails = async () => {
    setPageLoading(true)
    setFormError(null)
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        toast({ title: "Authentication Error", description: "Please log in again.", variant: "destructive"})
        router.push("/admin/login")
        return
      }

      const response = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch project details")
      }
      const project: ProjectData & { id: string; images: Array<{ id?: string, url: string; alt: string; isFeatured?: boolean }> } = await response.json()

      setFormData({
        title: project.title,
        description: project.description,
        category: project.category,
        type: project.type,
      })
      // Map fetched images to ProjectImageInput format
      setImages(project.images.map(img => ({
        id: img.id || Math.random().toString(36).substr(2, 9), // Use backend image ID if available
        url: img.url,
        alt: img.alt,
        isFeatured: img.isFeatured || false,
        isExisting: true, // Mark as existing image
      })))
    } catch (err) {
      console.error("Error fetching project details:", err)
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormError(null)
  }

  // --- Image Handling Functions (adapted from new/page.tsx) ---
  const handleImageUpload = (files: FileList | null) => {
    if (!files) return
    setFormError(null)

    const newImages: ProjectImageInput[] = []
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        if (file.size > 10 * 1024 * 1024) { // 10MB size limit
            toast({ title: "File too large", description: `Image "${file.name}" exceeds the 10MB limit.`, variant: "destructive"})
            return
        }
        const reader = new FileReader()
        reader.onload = (e) => {
          newImages.push({
            id: Math.random().toString(36).substr(2, 9), // Temporary ID for new image
            url: e.target?.result as string, // Data URL for preview
            alt: file.name,
            isFeatured: images.filter(img => img.isFeatured).length === 0 && newImages.length === 0, // Feature if no other featured img
            file: file,
            isExisting: false,
          })
          if (newImages.length === Array.from(files).filter(f => f.type.startsWith("image/")).length) {
            setImages((prev) => [...prev, ...newImages.filter(img => img.file && img.file.size <= 10 * 1024 * 1024)])
          }
        }
        reader.onerror = () => toast({ title: "File Read Error", description: `Could not read file ${file.name}.`, variant: "destructive"})
        reader.readAsDataURL(file)
      } else {
        toast({ title: "Invalid File Type", description: `File "${file.name}" is not a supported image type.`, variant: "destructive"})
      }
    })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files)
    }
  }

  const removeImage = (id: string) => {
    const imageToRemove = images.find(img => img.id === id);
    // If it was a featured image and there are other images, try to set another as featured.
    if (imageToRemove?.isFeatured && images.length > 1) {
      const remainingImages = images.filter(img => img.id !== id);
      if (remainingImages.length > 0) {
        remainingImages[0].isFeatured = true; // Feature the first remaining image
      }
       setImages(remainingImages.map(img => img.id === remainingImages[0].id ? {...img, isFeatured: true} : img ));
    } else {
       setImages((prev) => prev.filter((img) => img.id !== id));
    }
  }

  const toggleFeatured = (id: string) => {
    setImages((prev) =>
      prev.map((img) => ({ ...img, isFeatured: img.id === id }))
    )
  }

  const updateImageAlt = (id: string, alt: string) => {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, alt } : img)))
  }

  // Placeholder for actual image upload logic
  const uploadImageAndGetURL = async (file: File): Promise<string> => {
    console.log("Simulating upload for:", file.name)
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `/uploads/mock/${file.name}`; // Replace with actual upload and URL retrieval
  }
  // --- End Image Handling Functions ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFormError(null)

    if (images.length === 0) {
      setFormError("A project must have at least one image.")
      setLoading(false)
      toast({ title: "Missing Images", description: "At least one image is required.", variant: "destructive"})
      return
    }
     if (!formData.category || !formData.type) {
      setFormError("Please select a category and project type.")
      setLoading(false)
      toast({ title: "Missing Fields", description: "Category and Type are required.", variant: "destructive"})
      return
    }

    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        toast({ title: "Authentication Error", description: "Please log in again.", variant: "destructive"})
        router.push("/admin/login")
        setLoading(false)
        return
      }

      const updatedImagePayloads: ProjectImagePayload[] = await Promise.all(
        images.map(async (img) => {
          let imageUrl = img.url
          // If it's a new image (has a file object), upload it. Otherwise, use existing URL.
          if (img.file && !img.isExisting) {
            imageUrl = await uploadImageAndGetURL(img.file)
          }
          return { url: imageUrl, alt: img.alt, isFeatured: img.isFeatured }
        }),
      )

      const projectUpdateData: ProjectData = {
        ...formData,
        images: updatedImagePayloads,
      }

      const response = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectUpdateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update project")
      }

      toast({ title: "Success!", description: "Project updated successfully." })
      router.push("/admin/projects")
    } catch (err) {
      console.error("Error updating project:", err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."
      setFormError(errorMessage)
      toast({ title: "Error Updating Project", description: errorMessage, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading project details...</p>
      </div>
    )
  }

  if (formError && !pageLoading && formData.title === "") { // If initial fetch failed badly
     return (
      <div className="text-center py-12">
        <p className="text-red-500 text-xl mb-4">Error: {formError}</p>
        <Button onClick={fetchProjectDetails} className="mr-2">Try Again</Button>
        <Button variant="outline" asChild>
            <Link href="/admin/projects">Back to Projects</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Project</h1>
          <p className="text-muted-foreground">Update the details for project: {formData.title || projectId}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{formError}</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter project title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select required value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Project Type</Label>
              <Select required value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Epoxy">Epoxy Flooring</SelectItem>
                  <SelectItem value="Tile">Tile Installation</SelectItem>
                  <SelectItem value="Carpet">Carpet Installation</SelectItem>
                  <SelectItem value="Hardwood">Hardwood Flooring</SelectItem>
                  <SelectItem value="Vinyl">Vinyl & Laminate</SelectItem>
                  <SelectItem value="Composite">Composite Decking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter project description"
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Drop new images here or click to upload</p>
              <p className="text-sm text-muted-foreground mb-4">Support for JPG, PNG, WebP files up to 10MB each</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
                id="image-upload"
              />
              <Button type="button" variant="outline" asChild>
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  Choose Images
                </label>
              </Button>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <Image src={image.url || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(image.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 space-y-2">
                      <Input
                        placeholder="Alt text"
                        value={image.alt}
                        onChange={(e) => updateImageAlt(image.id, e.target.value)}
                        className="text-sm"
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`featured-${image.id}`}
                          checked={image.isFeatured}
                          onCheckedChange={() => toggleFeatured(image.id)}
                        />
                        <Label htmlFor={`featured-${image.id}`} className="text-sm">
                          Featured image
                        </Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading || pageLoading || images.length === 0}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating Project...
              </>
            ) : (
              "Update Project"
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/projects")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
