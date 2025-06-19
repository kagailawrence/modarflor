import ReviewsClient from "./ReviewsClient"
import { BASE_URL } from "@/lib/baseUrl"

export default async function ReviewsPage() {
  let testimonials = []
  let pageError: string | null = null
  try {
    const response = await fetch(`${BASE_URL}/api/testimonials`, { cache: "no-store" })
    if (!response.ok) throw new Error("Failed to fetch testimonials")
    testimonials = await response.json()
  } catch (err: any) {
    pageError = err?.message || "An unknown error occurred"
  }
  if (pageError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p className="text-red-500 text-xl mb-4">Error: {pageError}</p>
        <p className="text-muted-foreground">
          Could not load customer reviews. Please try refreshing the page or contact support if the problem persists.
        </p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-primary text-white rounded">Refresh Page</button>
      </div>
    )
  }
  return <ReviewsClient testimonials={testimonials} />
}
