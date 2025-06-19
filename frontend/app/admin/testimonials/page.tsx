"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Star, UserCircle, Search, AlertCircle, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { BASE_URL } from "@/lib/baseUrl"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


interface Testimonial {
  id: string
  name: string
  role?: string // Optional
  content: string // Or 'testimonial' or 'review'
  rating: number
  image?: string // URL for avatar/image
  // 'alt' for image is good practice but might not be in backend model, use name if missing
}

const renderStars = (rating: number, size = "w-4 h-4") => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${size} ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
      />
    ))}
    <span className="ml-1.5 text-xs text-muted-foreground">({rating}/5)</span>
  </div>
)


export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    setLoading(true)
    setError(null)
    try {
      // Assuming GET /api/testimonials is public, no auth token needed for listing
      const response = await fetch(`${BASE_URL}/api/testimonials`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch testimonials")
      }
      const data: Testimonial[] = await response.json()
      // Ensure data is an array; backend might return { testimonials: [] }
      setTestimonials(Array.isArray(data) ? data : (data as any).testimonials || [])
    } catch (err) {
      console.error("Error fetching testimonials:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred.")
      setTestimonials([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTestimonial = async (testimonialId: string) => {
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        toast({ title: "Authentication Error", description: "Please log in again.", variant: "destructive" })
        return
      }
      const response = await fetch(`${BASE_URL}/api/testimonials/${testimonialId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete testimonial")
      }
      setTestimonials((prevTestimonials) => prevTestimonials.filter((t) => t.id !== testimonialId))
      toast({ title: "Success", description: "Testimonial deleted successfully." })
    } catch (err) {
      console.error("Error deleting testimonial:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not delete testimonial.",
        variant: "destructive",
      })
    }
  }

  const filteredTestimonials = testimonials.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.role && t.role.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading testimonials...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to Load Testimonials</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchTestimonials}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Testimonials</h1>
        <Button asChild>
          <Link href="/admin/testimonials/new">
            <Plus className="w-4 h-4 mr-2" /> Add New Testimonial
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Testimonials ({testimonials.length})</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, role, or content..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-1/3"
            />
          </div>

          {filteredTestimonials.length === 0 ? (
             <div className="text-center py-12">
              <p className="text-muted-foreground">
                {testimonials.length === 0 ? "No testimonials submitted yet." : "No testimonials found matching your search."}
              </p>
               {testimonials.length === 0 && (
                 <Button asChild className="mt-4">
                   <Link href="/admin/testimonials/new">
                     <Plus className="h-4 w-4 mr-2" /> Add First Testimonial
                   </Link>
                 </Button>
               )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTestimonials.map(t => (
                <Card key={t.id} className="flex flex-col">
                  <CardContent className="p-4 flex flex-col flex-grow gap-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 border">
                        <AvatarImage src={t.image || undefined} alt={t.name} />
                        <AvatarFallback>
                          {t.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h2 className="font-semibold text-lg">{t.name}</h2>
                        {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                      </div>
                    </div>

                    <div className="my-1">{renderStars(t.rating)}</div>

                    <p className="text-sm text-muted-foreground italic line-clamp-4 flex-grow">"{t.content}"</p>

                    <div className="mt-auto flex gap-2 pt-3 border-t border-muted/50">
                       <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/testimonials/edit/${t.id}`}>
                          <Edit className="w-4 h-4 mr-1.5" /> Edit
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the testimonial from <span className="font-semibold">{t.name}</span>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteTestimonial(t.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete Testimonial
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
