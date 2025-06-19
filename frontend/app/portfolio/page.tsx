import PortfolioClient from "./PortfolioClient"
import { BASE_URL } from "@/lib/baseUrl"

export default async function PortfolioPage() {
	let projects = []
	let pageError: string | null = null
	try {
		const response = await fetch(`${BASE_URL}/api/projects`, { cache: "no-store" })
		if (!response.ok) throw new Error("Failed to fetch projects")
		const data = await response.json()
		projects = Array.isArray(data) ? data : (data.projects || [])
	} catch (err: any) {
		pageError = err?.message || "An unknown error occurred"
	}
	if (pageError) {
		return (
			<div className="flex flex-col justify-center items-center h-screen text-center">
				<p className="text-red-500 text-xl mb-4">Error: {pageError}</p>
				<p className="text-muted-foreground">Please try refreshing the page or contact support if the problem persists.</p>
				<button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-primary text-white rounded">Refresh Page</button>
			</div>
		)
	}
	return <PortfolioClient projects={projects} />
}
