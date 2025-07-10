"use client"
import { useState, useMemo } from "react"
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

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

const ratingsFilterOptions = ["All Ratings", "5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"]

export default function ReviewsClient({ testimonials }: { testimonials: Testimonial[] | { data: Testimonial[] } }) {
  // Support both array and { data: array } shape
  const testimonialList = Array.isArray(testimonials)
    ? testimonials
    : (testimonials && Array.isArray((testimonials as any).data))
      ? (testimonials as any).data
      : [];

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedService, setSelectedService] = useState("All Services")
  const [selectedRating, setSelectedRating] = useState("All Ratings")
  const [sortBy, setSortBy] = useState("newest")
  const [showReviewForm, setShowReviewForm] = useState(false)

  const dynamicServices = useMemo(
    () => [
      "All Services",
      ...Array.from(new Set(testimonialList.map((t:any) => t.role)))
    ],
    [testimonialList]
  );

  const filteredReviews = useMemo(() => {
    let filtered = testimonialList.filter((testimonial:any) => {
      const matchesSearch =
        testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesService = selectedService === "All Services" || testimonial.role === selectedService;
      const matchesRating =
        selectedRating === "All Ratings" ||
        testimonial.rating === Number.parseInt(selectedRating.split(" ")[0]);
      return matchesSearch && matchesService && matchesRating;
    });
    filtered.sort((a:any, b:any) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });
    return filtered;
  }, [searchTerm, selectedService, selectedRating, sortBy, testimonialList]);

  const averageRating = testimonialList.length > 0 ? testimonialList.reduce((sum:any, t:any) => sum + t.rating, 0) / testimonialList.length : 0;
  const totalReviews = testimonialList.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map((r_val) => {
    const count = testimonialList.filter((t:any) => t.rating === r_val).length;
    return {
      rating: r_val,
      count,
      percentage: testimonialList.length > 0 ? (count / testimonialList.length) * 100 : 0,
    };
  });

  const renderStars = (rating: number, size = "w-4 h-4") => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
        />
      ))}
    </div>
  );

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
                  <p className="text-sm text-muted-foreground mb-4">Share your experience with ModaFlor</p>
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
                        {dynamicServices.map((service:any) => (
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
                                {dynamicServices.slice(1).map((service:any) => (
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
                          <Label htmlFor="review-text">Your Review</Label>
                          <Textarea
                            id="review-text"
                            placeholder="Share your experience with ModaFlor..."
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
                {filteredReviews.map((review:any, index:any) => (
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
                            <AvatarImage src={review.image_url || "/placeholder.svg"} alt={review.name} />
                            <AvatarFallback>
                              {review.name
                                .split(" ")
                                .map((n:any) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{review.name}</h3>
                                {/* Optionally show verified badge if needed */}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(review.created_at).toISOString().slice(0, 10)}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mb-3">
                              {renderStars(review.rating)}
                              <Badge variant="outline">{review.role}</Badge>
                            </div>
                            <p className="text-muted-foreground mb-4 leading-relaxed">{review.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              {filteredReviews.length === 0 && testimonialList.length > 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No reviews found matching your criteria.</p>
                </div>
              )}
              {testimonialList.length === 0 && (
                 <div className="text-center py-12">
                    <p className="text-muted-foreground">Be the first to write a review!</p>
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
