import ServicesClient from "./ServicesClient"
import { BASE_URL } from "@/lib/baseUrl"

export default async function ServicesPage() {
  let services = []
  let error: string | null = null
  try {
    const response = await fetch(`${BASE_URL}/api/services`, { cache: "no-store" })
    if (!response.ok) throw new Error("Failed to fetch services")
    services = await response.json()
  } catch (err: any) {
    error = err?.message || "An unknown error occurred"
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }
  return <ServicesClient services={services} />
}
