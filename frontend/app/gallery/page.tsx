"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Search, Grid, List, ZoomIn, Download, Share2, Heart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const galleryImages = [
  {
    id: 1,
    title: "Modern Epoxy Garage Floor",
    category: "Epoxy",
    type: "Residential",
    image: "/placeholder.svg?height=600&width=800",
    thumbnail: "/placeholder.svg?height=300&width=400",
    description: "Sleek metallic epoxy finish with decorative flakes",
    tags: ["Garage", "Metallic", "Decorative", "Residential"],
    location: "Miami, FL",
    year: "2024",
    featured: true,
  },
  {
    id: 2,
    title: "Luxury Marble Bathroom",
    category: "Tile",
    type: "Residential",
    image: "/placeholder.svg?height=600&width=800",
    thumbnail: "/placeholder.svg?height=300&width=400",
    description: "Carrara marble with herringbone pattern",
    tags: ["Bathroom", "Marble", "Herringbone", "Luxury"],
    location: "Orlando, FL",
    year: "2024",
    featured: false,
  },
  {
    id: 3,
    title: "Corporate Office Carpet",
    category: "Carpet",
    type: "Commercial",
    image: "/placeholder.svg?height=600&width=800",
    thumbnail: "/placeholder.svg?height=300&width=400",
    description: "High-traffic commercial carpet with custom logo",
    tags: ["Office", "Commercial", "Logo", "High-Traffic"],
    location: "Tampa, FL",
    year: "2023",
    featured: false,
  },
  {
    id: 4,
    title: "Rustic Hardwood Living Room",
    category: "Hardwood",
    type: "Residential",
    image: "/placeholder.svg?height=600&width=800",
    thumbnail: "/placeholder.svg?height=300&width=400",
    description: "Hand-scraped oak with natural finish",
    tags: ["Living Room", "Oak", "Hand-scraped", "Natural"],
    location: "Jacksonville, FL",
    year: "2024",
    featured: true,
  },
  {
    id: 5,
    title: "Restaurant Kitchen Epoxy",
    category: "Epoxy",
    type: "Commercial",
    image: "/placeholder.svg?height=600&width=800",
    thumbnail: "/placeholder.svg?height=300&width=400",
    description: "Food-safe epoxy flooring for commercial kitchen",
    tags: ["Kitchen", "Food-Safe", "Commercial", "Seamless"],
    location: "Fort Lauderdale, FL",
    year: "2023",
    featured: false,
  },
  {
    id: 6,
    title: "Luxury Vinyl Plank Bedroom",
    category: "Vinyl",
    type: "Residential",
    image: "/placeholder.svg?height=600&width=800",
    thumbnail: "/placeholder.svg?height=300&width=400",
    description: "Waterproof luxury vinyl with wood-look texture",
    tags: ["Bedroom", "Waterproof", "Wood-look", "LVP"],
    location: "Gainesville, FL",
    year: "2024",
    featured: false,
  },
  {
    id: 7,
    title: "Hotel Lobby Terrazzo",
    category: "Tile",
    type: "Commercial",
    image: "/placeholder.svg?height=600&width=800",
    thumbnail: "/placeholder.svg?height=300&width=400",
    description: "Custom terrazzo design with brass inlays",
    tags: ["Lobby", "Terrazzo", "Brass", "Custom"],
    location: "Key West, FL",
    year: "2023",
    featured: true,
  },
  {
    id: 8,
    title: "Basement Recreation Room",
    category: "Vinyl",
    type: "Residential",
    image: "/placeholder.svg?height=600&width=800",
    thumbnail: "/placeholder.svg?height=300&width=400",
    description: "Moisture-resistant vinyl flooring for basement",
    tags: ["Basement", "Recreation", "Moisture-resistant", "Family"],
    location: "Tallahassee, FL",
    year: "2024",
    featured: false,
  },
  {
    id: 9,
    title: "Retail Store Polished Concrete",
    category: "Concrete",
    type: "Commercial",
    image: "/placeholder.svg?height=600&width=800",
    thumbnail: "/placeholder.svg?height=300&width=400",
    description: "Polished concrete with decorative scoring",
    tags: ["Retail", "Polished", "Decorative", "Modern"],
    location: "Pensacola, FL",
    year: "2023",
    featured: false,
  },
]

const categories = ["All", "Epoxy", "Tile", "Carpet", "Hardwood", "Vinyl", "Concrete"]
const types = ["All", "Residential", "Commercial"]

export default function GalleryPage() {
  const [images, setImages] = useState(galleryImages)
  const [filteredImages, setFilteredImages] = useState(galleryImages)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedType, setSelectedType] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    const filtered = images.filter((image) => {
      const matchesSearch =
        image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || image.category === selectedCategory
      const matchesType = selectedType === "All" || image.type === selectedType

      return matchesSearch && matchesCategory && matchesType
    })

    setFilteredImages(filtered)
  }, [searchTerm, selectedCategory, selectedType, images])

  const toggleFavorite = (imageId: number) => {
    setFavorites((prev) => (prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]))
  }

  const handleShare = (image: any) => {
    if (navigator.share) {
      navigator.share({
        title: image.title,
        text: image.description,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const featuredImages = filteredImages.filter((img) => img.featured)
  const regularImages = filteredImages.filter((img) => !img.featured)

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Project Gallery</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our portfolio of completed flooring projects. From residential homes to commercial spaces, see the
            quality and craftsmanship that sets us apart.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredImages.length} of {images.length} projects
            </p>
            <div className="flex gap-2">
              {selectedCategory !== "All" && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory("All")}>
                  {selectedCategory} ×
                </Badge>
              )}
              {selectedType !== "All" && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedType("All")}>
                  {selectedType} ×
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Featured Projects */}
        {featuredImages.length > 0 && selectedCategory === "All" && !searchTerm && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={image.thumbnail || "/placeholder.svg"}
                        alt={image.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary">Featured</Badge>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(image.id)
                          }}
                        >
                          <Heart
                            className={`h-4 w-4 ${favorites.includes(image.id) ? "fill-red-500 text-red-500" : ""}`}
                          />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => setSelectedImage(image)}
                            >
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex gap-2 mb-2">
                        <Badge variant="outline">{image.category}</Badge>
                        <Badge variant="secondary">{image.type}</Badge>
                      </div>
                      <h3 className="font-semibold mb-2">{image.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{image.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{image.location}</span>
                        <span>{image.year}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Projects */}
        <div className="space-y-6">
          {regularImages.length > 0 && (
            <h2 className="text-2xl font-bold">
              {featuredImages.length > 0 && selectedCategory === "All" && !searchTerm ? "All Projects" : "Projects"}
            </h2>
          )}

          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {regularImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={image.thumbnail || "/placeholder.svg"}
                          alt={image.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(image.id)
                            }}
                          >
                            <Heart
                              className={`h-4 w-4 ${favorites.includes(image.id) ? "fill-red-500 text-red-500" : ""}`}
                            />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="secondary"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => setSelectedImage(image)}
                              >
                                <ZoomIn className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex gap-2 mb-2">
                          <Badge variant="outline">{image.category}</Badge>
                          <Badge variant="secondary">{image.type}</Badge>
                        </div>
                        <h3 className="font-semibold mb-2 line-clamp-1">{image.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{image.description}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{image.location}</span>
                          <span>{image.year}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {regularImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-64 h-48 md:h-32">
                          <Image
                            src={image.thumbnail || "/placeholder.svg"}
                            alt={image.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex gap-2">
                              <Badge variant="outline">{image.category}</Badge>
                              <Badge variant="secondary">{image.type}</Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => toggleFavorite(image.id)}
                              >
                                <Heart
                                  className={`h-4 w-4 ${
                                    favorites.includes(image.id) ? "fill-red-500 text-red-500" : ""
                                  }`}
                                />
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8"
                                    onClick={() => setSelectedImage(image)}
                                  >
                                    <ZoomIn className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                              </Dialog>
                            </div>
                          </div>
                          <h3 className="font-semibold mb-2">{image.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{image.description}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{image.location}</span>
                            <span>{image.year}</span>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found matching your criteria.</p>
          </div>
        )}

        {/* Image Modal */}
        <Dialog>
          <DialogContent className="max-w-4xl w-full p-0">
            {selectedImage && (
              <div className="relative">
                <div className="relative aspect-video">
                  <Image
                    src={selectedImage.image || "/placeholder.svg"}
                    alt={selectedImage.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex gap-2 mb-2">
                        <Badge variant="outline">{selectedImage.category}</Badge>
                        <Badge variant="secondary">{selectedImage.type}</Badge>
                      </div>
                      <h2 className="text-2xl font-bold mb-2">{selectedImage.title}</h2>
                      <p className="text-muted-foreground">{selectedImage.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" onClick={() => handleShare(selectedImage)}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedImage.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>📍 {selectedImage.location}</span>
                    <span>📅 {selectedImage.year}</span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
