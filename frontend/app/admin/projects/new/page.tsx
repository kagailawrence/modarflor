"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X, Plus, Loader2 } from "lucide-react"
import Image from "next/image"
import { BASE_URL } from "@/lib/baseUrl" // Import BASE_URL
import { useToast } from "@/components/ui/use-toast" // For user feedback

interface ProjectImageInput { // For client-side state, includes File object
  id: string
  url: string // This will be a data URL for preview initially
  alt: string
  isFeatured: boolean
  file?: File
}

export default function NewProject() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "", // Ensure this is initialized if it's required by your form/logic
    type: "",     // Ensure this is initialized
  })
  const [images, setImages] = useState<ProjectImageInput[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return
    setFormError(null) // Clear previous form errors on new image upload attempt

    const newImages: ProjectImageInput[] = []
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        if (file.size > 10 * 1024 * 1024) { // 10MB size limit
          setFormError(`File ${file.name} exceeds the 10MB size limit.`)
          toast({
            title: "File too large",
            description: `Image "${file.name}" exceeds the 10MB limit.`,
            variant: "destructive",
          })
          return // Skip this file
        }
        const reader = new FileReader()
        reader.onload = (e) => {
          newImages.push({
            id: Math.random().toString(36).substr(2, 9),
            url: e.target?.result as string, // Data URL for preview
            alt: file.name,
            isFeatured: images.length + newImages.length === 1, // First image is featured
            file: file,
          })
          // Batch update after all files are processed by reader
          if (newImages.length === Array.from(files).filter(f => f.type.startsWith("image/")).length) {
            setImages((prev) => [...prev, ...newImages.filter(img => img.file && img.file.size <= 10 * 1024 * 1024)])
          }
        }
        reader.onerror = () => {
          toast({
            title: "File Read Error",
            description: `Could not read file ${file.name}.`,
            variant: "destructive",
          })
        }
        reader.readAsDataURL(file)
      } else {
        toast({
          title: "Invalid File Type",
          description: `File "${file.name}" is not a supported image type.`,
          variant: "destructive",
        })
      }
    })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
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
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const toggleFeatured = (id: string) => {
    // Ensure only one image can be featured
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        isFeatured: img.id === id, // Set only the clicked one as featured
      })),
    )
  }

  const updateImageAlt = (id: string, alt: string) => {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, alt } : img)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFormError(null)
    if (images.length === 0) {
      setFormError("Please upload at least one image for the project.")
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
        setFormError("Authentication error. Please log in again.")
        setLoading(false)
        toast({ title: "Authentication Error", description: "Please log in again.", variant: "destructive"})
        router.push("/admin/login")
        return
      }
      const fd = new FormData()
      fd.append("title", formData.title)
      fd.append("description", formData.description)
      fd.append("category", formData.category)
      fd.append("type", formData.type)
      images.forEach((img, idx) => {
        if (img.file) fd.append("images", img.file)
      })
      // Send alt/isFeatured as JSON for each image (order matches files)
      const meta = images.map(img => ({ alt: img.alt, isFeatured: img.isFeatured, url: img.url }))
      fd.append("imagesMeta", JSON.stringify(meta))
      const response = await fetch(`${BASE_URL}/api/projects`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create project")
      }
      toast({ title: "Success!", description: "Project created successfully." })
      router.push("/admin/projects")
    } catch (err) {
      console.error("Error creating project:", err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."
      setFormError(errorMessage)
      toast({ title: "Error Creating Project", description: errorMessage, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Project</h1>
        <p className="text-muted-foreground">Create a new project for your portfolio</p>
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
                      {/* Add other categories as needed */}
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
                    {/* Add other types as needed */}
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
            {/* Image Upload Area */}
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
              <p className="text-lg font-medium mb-2">Drop images here or click to upload</p>
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

            {/* Image Preview Grid */}
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
          <Button type="submit" disabled={loading || images.length === 0}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Project...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
