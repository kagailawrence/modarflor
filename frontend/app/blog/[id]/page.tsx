"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, User, Clock, Facebook, Twitter, Linkedin, Mail } from "lucide-react"
import { motion } from "framer-motion"

// Mock blog post data - in real app, this would come from API
const getBlogPost = (id: string) => {
  const posts = [
    {
      id: 1,
      title: "The Ultimate Guide to Epoxy Flooring: Benefits, Installation, and Maintenance",
      excerpt: "Discover why epoxy flooring is becoming the top choice for garages, basements, and commercial spaces.",
      content: `
        <h2>What is Epoxy Flooring?</h2>
        <p>Epoxy flooring is a type of surface coating that consists of a two-part epoxy resin system. When mixed together, these components create a hard, durable surface that bonds exceptionally well to concrete floors. The result is a seamless, glossy finish that's both attractive and highly functional.</p>
        
        <h2>Benefits of Epoxy Flooring</h2>
        <h3>Durability and Longevity</h3>
        <p>One of the primary reasons homeowners and businesses choose epoxy flooring is its exceptional durability. When properly installed, epoxy floors can last 10-20 years or more, even in high-traffic areas.</p>
        
        <h3>Chemical and Stain Resistance</h3>
        <p>Epoxy floors are highly resistant to chemicals, oils, and stains. This makes them ideal for garages, workshops, and commercial kitchens where spills are common.</p>
        
        <h3>Easy Maintenance</h3>
        <p>The seamless surface of epoxy flooring makes it incredibly easy to clean. Regular sweeping and occasional mopping with mild detergent is all that's needed to keep your floor looking new.</p>
        
        <h2>Installation Process</h2>
        <p>Professional epoxy floor installation typically follows these steps:</p>
        <ol>
          <li><strong>Surface Preparation:</strong> The concrete surface is thoroughly cleaned and any cracks or imperfections are repaired.</li>
          <li><strong>Primer Application:</strong> A primer coat is applied to ensure proper adhesion of the epoxy.</li>
          <li><strong>Base Coat:</strong> The colored epoxy base coat is applied using rollers and brushes.</li>
          <li><strong>Decorative Elements:</strong> If desired, decorative flakes or patterns are added while the base coat is still wet.</li>
          <li><strong>Top Coat:</strong> A clear protective top coat is applied for added durability and shine.</li>
        </ol>
        
        <h2>Maintenance Tips</h2>
        <p>To keep your epoxy floor looking its best:</p>
        <ul>
          <li>Sweep or vacuum regularly to remove dirt and debris</li>
          <li>Clean spills immediately to prevent staining</li>
          <li>Use mild, non-abrasive cleaners</li>
          <li>Avoid dragging heavy objects across the surface</li>
          <li>Consider applying a fresh top coat every 3-5 years in high-traffic areas</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Epoxy flooring offers an excellent combination of durability, aesthetics, and functionality. Whether you're looking to upgrade your garage, basement, or commercial space, epoxy flooring provides a long-lasting solution that will serve you well for years to come.</p>
      `,
      author: "John Martinez",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "Epoxy Flooring",
      image: "/placeholder.svg?height=600&width=1200",
      tags: ["Epoxy", "Installation", "Maintenance", "Commercial"],
    },
  ]

  return posts.find((post) => post.id.toString() === id)
}

const relatedPosts = [
  {
    id: 2,
    title: "2024 Flooring Trends: What's Hot in Residential Design",
    image: "/placeholder.svg?height=200&width=300",
    category: "Design Trends",
  },
  {
    id: 3,
    title: "Choosing the Right Flooring for High-Traffic Commercial Areas",
    image: "/placeholder.svg?height=200&width=300",
    category: "Commercial Flooring",
  },
  {
    id: 6,
    title: "Floor Maintenance 101: Keeping Your Investment Looking New",
    image: "/placeholder.svg?height=200&width=300",
    category: "Maintenance",
  },
]

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const blogPost = getBlogPost(params.id as string)
    setPost(blogPost)
    setLoading(false)
  }, [params.id])

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = post?.title || ""

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
    }

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], "_blank", "width=600,height=400")
    }
  }

  if (loading) {
    return <div className="py-12 text-center">Loading...</div>
  }

  if (!post) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
        <Button asChild>
          <Link href="/blog">Back to Blog</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Badge variant="outline" className="mb-4">
              {post.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-medium">Share:</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleShare("facebook")}>
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleShare("twitter")}>
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleShare("linkedin")}>
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleShare("email")}>
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="aspect-video rounded-lg overflow-hidden">
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                width={1200}
                height={600}
                className="object-cover w-full h-full"
              />
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="prose prose-lg max-w-none mb-12"
          >
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="prose prose-lg prose-gray dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:text-foreground
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                prose-li:my-1 prose-strong:text-foreground"
            />
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12"
          >
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>

          <Separator className="mb-12" />

          {/* Related Posts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-32">
                    <Image
                      src={relatedPost.image || "/placeholder.svg"}
                      alt={relatedPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2 text-xs">
                      {relatedPost.category}
                    </Badge>
                    <h3 className="font-semibold mb-3 line-clamp-2">{relatedPost.title}</h3>
                    <Link href={`/blog/${relatedPost.id}`} className="text-primary text-sm font-medium hover:underline">
                      Read More →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-16 bg-primary text-primary-foreground rounded-lg p-8 text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Flooring Project?</h2>
            <p className="mb-6 opacity-90">Get expert advice and a free quote for your next flooring installation.</p>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/contact">Get Free Quote</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
