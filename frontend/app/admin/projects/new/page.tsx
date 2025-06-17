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

interface ProjectImage {
  id: string
  url: string
  alt: string
  isFeatured: boolean
  file?: File
}

export default function NewProject() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
  })
  const [images, setImages] = useState<ProjectImage[]>([])
  const [dragActive, setDragActive] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newImage: ProjectImage = {
            id: Math.random().toString(36).substr(2, 9),
            url: e.target?.result as string,
            alt: file.name,
            isFeatured: images.length === 0, // First image is featured by default
            file: file,
          }
          setImages((prev) => [...prev, newImage])
        }
        reader.readAsDataURL(file)
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
    handleImageUpload(e.dataTransfer.files)
  }

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const toggleFeatured = (id: string) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        isFeatured: img.id === id ? !img.isFeatured : img.isFeatured,
      })),
    )
  }

  const updateImageAlt = (id: string, alt: string) => {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, alt } : img)))
  }

  const uploadImageToBlob = async (file: File): Promise<string> => {
    // Simulate image upload to Vercel Blob or similar service
    // In a real implementation, you would upload to your preferred storage service
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`https://example.com/uploads/${file.name}`)
      }, 1000)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Upload images first
      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          if (img.file) {
            const url = await uploadImageToBlob(img.file)
            return { url, alt: img.alt, isFeatured: img.isFeatured }
          }
          return { url: img.url, alt: img.alt, isFeatured: img.isFeatured }
        }),
      )

      // Create project
      const projectData = {
        ...formData,
        images: uploadedImages,
      }

      // API call to create project
      console.log("Creating project:", projectData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      router.push("/admin/projects")
    } catch (error) {
      console.error("Error creating project:", error)
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
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger>
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
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger>
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
