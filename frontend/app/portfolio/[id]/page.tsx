"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getImageUrl } from "@/lib/getImageUrl"
import { BASE_URL } from "@/lib/baseUrl"

const PortfolioProjectPage = ({ params }: { params: { id: string } }) => {
	const router = useRouter()
	const [project, setProject] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [mainImage, setMainImage] = useState<string>("")
	const [lightboxOpen, setLightboxOpen] = useState(false)
	const [lightboxIdx, setLightboxIdx] = useState(0)
	const [pageUrl, setPageUrl] = useState("")

	useEffect(() => {
		const fetchProject = async () => {
			setLoading(true)
			setError(null)
			try {
				const response = await fetch(`${BASE_URL}/api/projects/${params.id}`)
				if (!response.ok) throw new Error("Project not found")
				const data = await response.json()
				setProject(data)
				setMainImage(data.images && data.images.length > 0 ? getImageUrl(data.images[0].url) : "")
			} catch (err: any) {
				setError(err?.message || "An unknown error occurred")
			} finally {
				setLoading(false)
			}
		}
		fetchProject()
	}, [params.id])

	useEffect(() => {
		if (typeof window !== "undefined") {
			setPageUrl(window.location.href);
		}
	}, []);

	if (loading) {
		return <div className="flex justify-center items-center h-40">Loading...</div>
	}
	if (error || !project) {
		return (
			<div className="py-12 md:py-16">
				<div className="container mx-auto px-4 text-center">
					<h1 className="text-3xl md:text-4xl font-bold mb-4">Project Not Found</h1>
					<p className="text-muted-foreground mb-8">Sorry, we couldn't find the project you're looking for.</p>
				</div>
			</div>
		)
	}

	const shareTitle = `Check out this project: ${project?.title || "A project"} by ModaFlor!`

	// Social links definition
	const socialLinks = [
		{
			name: "Facebook",
			icon: (
				<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
			),
			url: (title: string, url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
		},
		{
			name: "Twitter",
			icon: (
				<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.916 4.916 0 0 0 16.616 3c-2.72 0-4.924 2.206-4.924 4.924 0 .386.045.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z"/></svg>
			),
			url: (title: string, url: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
		},
		{
			name: "LinkedIn",
			icon: (
				<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
			),
			url: (title: string, url: string) => `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
		},
	];

	return (
		<div className="py-12 md:py-16">
			<div className="container mx-auto px-4">
				<h1 className="text-3xl md:text-4xl font-bold mb-2">{project.title}</h1>
				<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
					<div className="flex gap-2">
						<span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">{project.category}</span>
						<span className="inline-block bg-secondary px-3 py-1 rounded-full text-sm font-medium">{project.type}</span>
					</div>
					<div className="text-muted-foreground text-sm">
						<span>Client: {project.client || "-"}</span> &bull; <span>Location: {project.location || "-"}</span> &bull; <span>Year: {project.year || "-"}</span>
					</div>
				</div>
				{/* Main Image */}
				<div className="w-full max-w-3xl mx-auto mb-6">
					<div className="relative aspect-[4/3] rounded-lg overflow-hidden border cursor-pointer" onClick={() => { setLightboxOpen(true); setLightboxIdx(0) }}>
						{mainImage && <Image src={mainImage} alt={project.title} fill className="object-cover" />}
					</div>
					{/* Thumbnails */}
					<div className="flex gap-2 mt-3 justify-center">
						{project.images && project.images.map((img: any, idx: number) => (
							<button
								key={img.url}
								className={`border rounded-md overflow-hidden w-20 h-16 focus:outline-none ${mainImage === getImageUrl(img.url) ? "border-primary" : "border-muted"}`}
								onClick={() => { setMainImage(getImageUrl(img.url)); setLightboxIdx(idx) }}
								aria-label={`Show image ${idx + 1}`}
								type="button"
							>
								<Image src={getImageUrl(img.url)} alt={`Thumbnail ${idx + 1}`} width={80} height={64} className="object-cover" />
							</button>
						))}
					</div>
				</div>
				{/* Lightbox Modal */}
				{lightboxOpen && project.images && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
						<button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setLightboxOpen(false)} aria-label="Close">×</button>
						<div className="flex flex-col items-center">
							<img src={getImageUrl(project.images[lightboxIdx].url)} alt="Gallery" className="max-h-[70vh] max-w-[90vw] rounded-lg shadow-lg" />
							<div className="flex gap-2 mt-4">
								{project.images.map((img: any, i: number) => (
									<button
										key={img.url}
										className={`border rounded w-16 h-12 ${i === lightboxIdx ? 'border-primary' : 'border-muted'}`}
										onClick={() => setLightboxIdx(i)}
										aria-label={`Show image ${i + 1}`}
									>
										<img src={getImageUrl(img.url)} alt={`Thumb ${i + 1}`} className="object-cover w-full h-full" />
									</button>
								))}
							</div>
						</div>
					</div>
				)}
				{/* Description and Details */}
				<div className="max-w-2xl mx-auto mb-8">
					<p className="text-lg mb-4">{project.description}</p>
					<div className="bg-muted/50 rounded-lg p-4">
						<h2 className="text-xl font-semibold mb-2">Project Details</h2>
						<p className="mb-2">{project.details || ""}</p>
						<ul className="list-disc pl-5 text-muted-foreground text-sm">
							<li><strong>Client:</strong> {project.client || "-"}</li>
							<li><strong>Location:</strong> {project.location || "-"}</li>
							<li><strong>Year:</strong> {project.year || "-"}</li>
							<li><strong>Type:</strong> {project.type}</li>
						</ul>
					</div>
				</div>
				{/* Share Buttons */}
				<div className="flex gap-4 mt-8 mb-4 justify-center">
					{socialLinks.map((social:any) => (
						<a
							key={social.name}
							href={social.url(shareTitle, pageUrl)}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 px-3 py-2 rounded bg-muted hover:bg-primary/10 text-primary transition-colors"
							aria-label={`Share on ${social.name}`}
						>
							{social.icon}
							<span className="hidden sm:inline">{social.name}</span>
						</a>
					))}
				</div>
			</div>
		</div>
	)
}

export default PortfolioProjectPage
