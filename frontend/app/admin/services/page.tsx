"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2 } from "lucide-react"
import { BASE_URL } from "@/lib/baseUrl"

export default function AdminServices() {
  const [services, setServices] = useState<{id: string, title: string, description: string, price: string}[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>("")

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/api/services`)
      if (!res.ok) throw new Error("Failed to fetch services")
      const data = await res.json()
      setServices(data.services || [])
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button variant="default" size="sm">
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </Button>
      </div>
      <Input
        placeholder="Search services..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-4 max-w-xs"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          services
            .filter(service =>
              service.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(service => (
              <Card key={service.id}>
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-lg">{service.title}</h2>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline"><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                  <p className="font-medium">{service.price}</p>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  )
}
