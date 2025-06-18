"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ThumbsUp, MessageCircle, CheckCircle, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { BASE_URL } from "../../../lib/baseUrl"

interface Testimonial {
  id: number | string // API might use string IDs
  name: string
  avatar?: string // Optional as per existing data (though all have it)
  rating: number
  date: string // Keep as string, can be parsed
  service: string // Could be service name or ID, assuming name for now
  project?: string // Optional
  review: string // Or 'testimonial_text' or similar from backend
  helpful?: number // Optional
  verified?: boolean // Optional
  images?: string[] // Optional
  // Potential backend fields:
  // userId?: string;
  // serviceId?: string;
  // projectId?: string;
}

const ratingsFilterOptions = ["All Ratings", "5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"]

export default function ReviewsPage() {
  const [allFetchedTestimonials, setAllFetchedTestimonials] = useState<Testimonial[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Testimonial[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedService, setSelectedService] = useState("All Services")
  const [selectedRating, setSelectedRating] = useState("All Ratings")
  const [sortBy, setSortBy] = useState("newest")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [pageError, setPageError] = useState<string | null>(null)

  // Derived states for filters and stats
  const [dynamicServices, setDynamicServices] = useState<string[]>(["All Services"])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [ratingDistribution, setRatingDistribution] = useState<
    { rating: number; count: number; percentage: number }[]
  >([])

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setPageLoading(true)
        const response = await fetch(`${BASE_URL}/api/testimonials`)
        if (!response.ok) {
          throw new Error("Failed to fetch testimonials")
        }
        const data: Testimonial[] = await response.json()
        // Assuming API returns 'id', 'name', 'rating', 'date', 'service', 'review'
        // And potentially 'avatar', 'project', 'helpful', 'verified', 'images'
        // If 'service' is an ID, it would need to be mapped to a name or handled differently
        setAllFetchedTestimonials(data)
        setPageError(null)
      } catch (err) {
        setPageError(err instanceof Error ? err.message : "An unknown error occurred")
        setAllFetchedTestimonials([])
      } finally {
        setPageLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  useEffect(() => {
    if (allFetchedTestimonials.length > 0) {
      // Calculate stats
      const avgRating =
        allFetchedTestimonials.reduce((sum, t) => sum + t.rating, 0) / allFetchedTestimonials.length
      setAverageRating(avgRating)
      setTotalReviews(allFetchedTestimonials.length)

      const distribution = [5, 4, 3, 2, 1].map((r_val) => {
        const count = allFetchedTestimonials.filter((t) => t.rating === r_val).length
        return {
          rating: r_val,
          count,
          percentage: (count / allFetchedTestimonials.length) * 100,
        }
      })
      setRatingDistribution(distribution)

      // Populate dynamic services filter
      const uniqueServices = ["All Services", ...new Set(allFetchedTestimonials.map((t) => t.service))]
      setDynamicServices(uniqueServices)
    } else {
      // Reset stats if no testimonials
      setAverageRating(0)
      setTotalReviews(0)
      setRatingDistribution([])
      setDynamicServices(["All Services"])
    }

    // Filtering logic
    const filtered = allFetchedTestimonials.filter((testimonial) => {
      const matchesSearch =
        testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (testimonial.project && testimonial.project.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesService = selectedService === "All Services" || testimonial.service === selectedService
      const matchesRating =
        selectedRating === "All Ratings" ||
        testimonial.rating === Number.parseInt(selectedRating.split(" ")[0])

      return matchesSearch && matchesService && matchesRating
    })

    // Sorting logic (applied to already filtered items)
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "highest":
          return b.rating - a.rating
        case "lowest":
          return a.rating - b.rating
        case "helpful":
          // Ensure 'helpful' exists and provide a default if not
          return (b.helpful || 0) - (a.helpful || 0)
        default:
          return 0
      }
    })

    setFilteredReviews(filtered)
  }, [searchTerm, selectedService, selectedRating, sortBy, allFetchedTestimonials])

  const renderStars = (rating: number, size = "w-4 h-4") => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p>Loading reviews...</p>
      </div>
    )
  }

  if (pageError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p className="text-red-500 text-xl mb-4">Error: {pageError}</p>
        <p className="text-muted-foreground">
          Could not load customer reviews. Please try refreshing the page or contact support if the problem persists.
        </p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Refresh Page
        </Button>
      </div>
    )
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Customer Reviews</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Read what our customers have to say about their flooring projects. Real reviews from real customers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Reviews Summary */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardContent className="p-6">
                  {totalReviews > 0 ? (
                    <>
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                        {renderStars(Math.round(averageRating), "w-6 h-6")}
                        <p className="text-sm text-muted-foreground mt-2">Based on {totalReviews} reviews</p>
                      </div>
                      <div className="space-y-3">
                        {ratingDistribution.map(({ rating, count, percentage }) => (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm w-6">{rating}</span>
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div
                                className="bg-yellow-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-8">{count}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground py-4">No reviews yet.</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Write a Review</h3>
                  <p className="text-sm text-muted-foreground mb-4">Share your experience with  ModarFlor</p>
                  <Button className="w-full" onClick={() => setShowReviewForm(!showReviewForm)}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Write Review
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Input
                      placeholder="Search reviews..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Service" />
                      </SelectTrigger>
                      <SelectContent>
                        {dynamicServices.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedRating} onValueChange={setSelectedRating}>
                      <SelectTrigger>
                        <SelectValue placeholder="Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {ratingsFilterOptions.map((rating) => (
                          <SelectItem key={rating} value={rating}>
                            {rating}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="highest">Highest Rating</SelectItem>
                        <SelectItem value="lowest">Lowest Rating</SelectItem>
                        <SelectItem value="helpful">Most Helpful</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Review Form */}
              {showReviewForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-6">Write Your Review</h3>
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="reviewer-name">Your Name</Label>
                            <Input id="reviewer-name" placeholder="Enter your name" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reviewer-email">Email</Label>
                            <Input id="reviewer-email" type="email" placeholder="Enter your email" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Service Type</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select service" />
                              </SelectTrigger>
                              <SelectContent>
                                {/* Use dynamicServices, excluding "All Services" */}
                                {dynamicServices.slice(1).map((service) => (
                                  <SelectItem key={service} value={service}>
                                    {service}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Rating</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select rating" />
                              </SelectTrigger>
                              <SelectContent>
                                {[5, 4, 3, 2, 1].map((rating) => (
                                  <SelectItem key={rating} value={rating.toString()}>
                                    {rating} Star{rating !== 1 ? "s" : ""}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="project-title">Project Title</Label>
                          <Input id="project-title" placeholder="e.g., Kitchen Renovation" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="review-text">Your Review</Label>
                          <Textarea
                            id="review-text"
                            placeholder="Share your experience with  ModarFlor..."
                            rows={5}
                          />
                        </div>

                        <div className="flex gap-4">
                          <Button type="submit">Submit Review</Button>
                          <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {filteredReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.name} />
                            <AvatarFallback>
                              {review.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{review.name}</h3>
                                {review.verified && (
                                  <Badge variant="secondary" className="text-xs">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(review.date).toLocaleDateString()}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mb-3">
                              {renderStars(review.rating)}
                              <Badge variant="outline">{review.service}</Badge>
                              <span className="text-sm text-muted-foreground">Project: {review.project}</span>
                            </div>

                            <p className="text-muted-foreground mb-4 leading-relaxed">{review.review}</p>

                            {review.images.length > 0 && (
                              <div className="flex gap-2 mb-4">
                                {review.images.map((image, imgIndex) => (
                                  <div key={imgIndex} className="relative w-20 h-20 rounded-lg overflow-hidden">
                                    <img
                                      src={image || "/placeholder.svg"} // Use placeholder if image is null/undefined
                                      alt={`Review image ${imgIndex + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-4">
                              <Button variant="ghost" size="sm">
                                <ThumbsUp className="w-4 h-4 mr-2" />
                                Helpful ({review.helpful || 0}) {/* Default helpful to 0 if undefined */}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredReviews.length === 0 && allFetchedTestimonials.length > 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No reviews found matching your criteria.</p>
                </div>
              )}
              {/* Show this message if there are no reviews at all from backend */}
              {allFetchedTestimonials.length === 0 && !pageLoading && !pageError && (
                 <div className="text-center py-12">
                    <p className="text-muted-foreground">Be the first to write a review!</p>
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
