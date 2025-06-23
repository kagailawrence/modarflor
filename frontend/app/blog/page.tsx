"use client"


import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, User, ArrowRight, Clock } from "lucide-react"
import { motion } from "framer-motion"

const blogPosts = [
  {
    id: 1,
    title: "The Ultimate Guide to Epoxy Flooring: Benefits, Installation, and Maintenance",
    excerpt:
      "Discover why epoxy flooring is becoming the top choice for garages, basements, and commercial spaces. Learn about installation process, benefits, and maintenance tips.",
    content: "Full article content here...",
    author: "John Martinez",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Epoxy Flooring",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Epoxy", "Installation", "Maintenance", "Commercial"],
    featured: true,
  },
  {
    id: 2,
    title: "2024 Flooring Trends: What's Hot in Residential Design",
    excerpt:
      "Explore the latest flooring trends that are transforming homes in 2024. From luxury vinyl to sustainable materials, discover what's popular this year.",
    content: "Full article content here...",
    author: "Sarah Chen",
    date: "2024-01-10",
    readTime: "6 min read",
    category: "Design Trends",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Trends", "Design", "Residential", "2024"],
    featured: false,
  },
  {
    id: 3,
    title: "Choosing the Right Flooring for High-Traffic Commercial Areas",
    excerpt:
      "Learn how to select durable, cost-effective flooring solutions for commercial spaces that can withstand heavy foot traffic while maintaining aesthetic appeal.",
    content: "Full article content here...",
    author: "Mike Rodriguez",
    date: "2024-01-05",
    readTime: "10 min read",
    category: "Commercial Flooring",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Commercial", "Durability", "High-Traffic", "Business"],
    featured: false,
  },
  {
    id: 4,
    title: "Tile vs. Hardwood: Making the Right Choice for Your Home",
    excerpt:
      "Compare the pros and cons of tile and hardwood flooring to help you make an informed decision for your home renovation project.",
    content: "Full article content here...",
    author: "Sarah Chen",
    date: "2023-12-28",
    readTime: "7 min read",
    category: "Comparison Guide",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Tile", "Hardwood", "Comparison", "Home"],
    featured: false,
  },
  {
    id: 5,
    title: "Sustainable Flooring Options: Eco-Friendly Choices for Modern Homes",
    excerpt:
      "Explore environmentally conscious flooring materials that don't compromise on style or durability. Perfect for eco-minded homeowners.",
    content: "Full article content here...",
    author: "Lisa Thompson",
    date: "2023-12-20",
    readTime: "9 min read",
    category: "Sustainability",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Eco-Friendly", "Sustainable", "Green", "Environment"],
    featured: false,
  },
  {
    id: 6,
    title: "Floor Maintenance 101: Keeping Your Investment Looking New",
    excerpt:
      "Essential maintenance tips and tricks to extend the life of your flooring investment. Learn proper cleaning techniques for different floor types.",
    content: "Full article content here...",
    author: "Mike Rodriguez",
    date: "2023-12-15",
    readTime: "5 min read",
    category: "Maintenance",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Maintenance", "Care", "Cleaning", "Tips"],
    featured: false,
  },
]

const categories = [
  "All",
  "Epoxy Flooring",
  "Design Trends",
  "Commercial Flooring",
  "Comparison Guide",
  "Sustainability",
  "Maintenance",
]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [filteredPosts, setFilteredPosts] = useState(blogPosts)

  useEffect(() => {
    const filtered = blogPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory

      return matchesSearch && matchesCategory
    })

    setFilteredPosts(filtered)
  }, [searchTerm, selectedCategory])

  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = filteredPosts.filter((post) => !post.featured)

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4"> ModarFlor Blog</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Expert insights, tips, and trends in the flooring industry. Stay informed with our latest articles and
            guides.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Featured Article */}
        {featuredPost && selectedCategory === "All" && !searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-1">
              <Card className="overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-64 lg:h-auto">
                    <Image
                      src={featuredPost.image || "/placeholder.svg"}
                      alt={featuredPost.title}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-4 left-4">Featured</Badge>
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <Badge variant="outline" className="w-fit mb-4">
                      {featuredPost.category}
                    </Badge>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">{featuredPost.title}</h2>
                    <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(featuredPost.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {featuredPost.readTime}
                      </div>
                    </div>
                    <Button asChild>
                      <Link href={`/blog/${featuredPost.id}`}>
                        Read Article
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                </div>
                <CardContent className="p-6 flex flex-col h-full">
                  <Badge variant="outline" className="w-fit mb-3">
                    {post.category}
                  </Badge>
                  <h3 className="text-xl font-semibold mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-muted-foreground mb-4 flex-grow line-clamp-3">{post.excerpt}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Link
                    href={`/blog/${post.id}`}
                    className="text-primary font-medium inline-flex items-center hover:underline mt-auto"
                  >
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found matching your criteria.</p>
          </div>
        )}

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 bg-primary text-primary-foreground rounded-lg p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest flooring tips, trends, and industry insights directly in
            your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/70"
            />
            <Button variant="secondary">Subscribe</Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
