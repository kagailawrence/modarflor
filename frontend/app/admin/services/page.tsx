"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image" // For displaying service image
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Search, AlertCircle, Loader2 } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { authFetch } from "@/lib/authFetch"
import { getImageUrl } from "@/lib/getImageUrl"


interface Service {
  id: string
  title: string
  description: string
  image_url?: string // Use image_url from backend
  order_index?: number // Use order_index from backend
  features?: string[] // Use array of strings for features
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${BASE_URL}/api/services`, {
        // No auth needed for public GET /api/services
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch services")
      }
      const data = await response.json()
      // Normalize backend data to match frontend expectations
      const normalized = (Array.isArray(data) ? data : data.services || []).map((service: any) => ({
        ...service,
        features: service.features ? service.features.map((f: any) => f.description) : [],
      }))
      setServices(normalized)
    } catch (err) {
      console.error("Error fetching services:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred.")
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" })
        return
      }
      const response = await authFetch(`${BASE_URL}/api/services/${serviceId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete service")
      }
      setServices((prevServices) => prevServices.filter((s) => s.id !== serviceId))
      toast({ title: "Success", description: "Service deleted successfully." })
    } catch (err) {
      console.error("Error deleting service:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not delete service.",
        variant: "destructive",
      })
    }
  }

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading services...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to Load Services</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchServices}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Services</h1>
        <Button asChild>
          <Link href="/admin/services/new">
            <Plus className="w-4 h-4 mr-2" /> Add New Service
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Services ({services.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-1/3"
            />
          </div>

          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {services.length === 0 ? "No services created yet." : "No services found matching your search."}
              </p>
               {services.length === 0 && (
                 <Button asChild className="mt-4">
                   <Link href="/admin/services/new">
                     <Plus className="h-4 w-4 mr-2" /> Add First Service
                   </Link>
                 </Button>
               )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <Card key={service.id} className="flex flex-col">
                  {service.image_url && (
                    <div className="relative h-40 w-full">
                      <Image
                        src={getImageUrl(service.image_url)}
                        alt={service.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  )}
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <h2 className="font-semibold text-lg mb-1">{service.title}</h2>
                    {service.order_index !== undefined && <Badge variant="outline" className="w-fit mb-2">Order: {service.order_index}</Badge>}
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-3 flex-grow">{service.description}</p>
                    {service.features && service.features.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold mb-1">Features:</h4>
                        <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                          {service.features.slice(0,3).map((feature, idx) => <li key={idx}>{feature}</li>)}
                          {service.features.length > 3 && <li>...and more</li>}
                        </ul>
                      </div>
                    )}
                    <div className="mt-auto flex gap-2 pt-4 border-t border-muted/50">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/services/edit/${service.id}`}>
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
                              This will permanently delete the service: <span className="font-semibold">{service.title}</span>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteService(service.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete Service
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
