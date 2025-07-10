// Admin page for managing flooring types (quotation pricing)
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { BASE_URL } from "@/lib/baseUrl"

export default function AdminFlooringTypesPage() {
  const [types, setTypes] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [form, setForm] = useState({
    type_id: "",
    name: "",
    price_min: "",
    price_max: "",
    unit: "sq ft",
    description: "",
  })

  const fetchTypes = async () => {
    const res = await fetch(BASE_URL + "/api/flooring-types")
    setTypes(await res.json())
  }
  useEffect(() => { fetchTypes() }, [])

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleEdit = (type: any) => {
    setEditing(type)
    setForm({
      type_id: type.type_id,
      name: type.name,
      price_min: type.price_min,
      price_max: type.price_max,
      unit: type.unit,
      description: type.description,
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const method = editing ? "PUT" : "POST"
    const url = BASE_URL + "/api/flooring-types" + (editing ? "/" + editing.id : "")
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price_min: parseInt(form.price_min),
        price_max: parseInt(form.price_max),
      }),
    })
    if (res.ok) {
      toast.success(editing ? "Updated!" : "Created!")
      setEditing(null)
      setForm({ type_id: "", name: "", price_min: "", price_max: "", unit: "sq ft", description: "" })
      fetchTypes()
    } else {
      toast.error("Failed to save.")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this flooring type?")) return
    const res = await fetch(BASE_URL + "/api/flooring-types/" + id, { method: "DELETE" })
    if (res.ok) {
      toast.success("Deleted!")
      fetchTypes()
    } else {
      toast.error("Failed to delete.")
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{editing ? "Edit Flooring Type" : "Add Flooring Type"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="type_id" value={form.type_id} onChange={handleChange} placeholder="Type ID (e.g. epoxy)" required />
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
            <div className="flex gap-2">
              <Input name="price_min" value={form.price_min} onChange={handleChange} placeholder="Min Price" type="number" required />
              <Input name="price_max" value={form.price_max} onChange={handleChange} placeholder="Max Price" type="number" required />
              <Input name="unit" value={form.unit} onChange={handleChange} placeholder="Unit" />
            </div>
            <Input name="description" value={form.description} onChange={handleChange} placeholder="Description" />
            <Button type="submit">{editing ? "Update" : "Add"}</Button>
            {editing && <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm({ type_id: "", name: "", price_min: "", price_max: "", unit: "sq ft", description: "" }) }}>Cancel</Button>}
          </form>
        </CardContent>
      </Card>
      <div className="mt-8">
        <h2 className="font-bold mb-2">Flooring Types</h2>
        <div className="space-y-2">
          {types.map((type) => (
            <Card key={type.id} className="flex flex-row items-center justify-between p-4">
              <div>
                <div className="font-semibold">{type.name} <span className="text-xs text-muted-foreground">({type.type_id})</span></div>
                <div className="text-sm">Ksh {type.price_min} - {type.price_max} / {type.unit}</div>
                <div className="text-xs text-muted-foreground">{type.description}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(type)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(type.id)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
