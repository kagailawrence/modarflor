"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Mock project data (should be replaced with real API call)
const allProjects = [
	{
		id: "1",
		title: "Modern Epoxy Garage Floor",
		category: "Residential",
		type: "Epoxy",
		description: "A sleek, durable epoxy floor installation for a modern home garage.",
		images: [
			"/placeholder.svg?height=600&width=800",
			"/placeholder.jpg",
			"/placeholder.jpg",
		],
		details: "This project involved transforming a standard garage into a modern, easy-to-clean space with a high-gloss epoxy finish. The client wanted a durable solution that could withstand heavy use and spills.",
		client: "Amina Njoroge",
		location: "Nairobi, Kenya",
		year: 2024,
	},
	{
		id: "2",
		title: "Luxury Tile Bathroom",
		category: "Residential",
		type: "Tile",
		description: "Custom tile design and installation for a luxury master bathroom.",
		images: [
			"/placeholder.svg?height=600&width=800",
			"/placeholder-logo.png",
		],
		details: "A full bathroom remodel with imported tiles, waterproofing, and elegant finishing. The client requested a spa-like feel with easy maintenance.",
		client: "Brian Otieno",
		location: "Mombasa, Kenya",
		year: 2023,
	},
	{
		id: "3",
		title: "Commercial Office Carpet",
		category: "Commercial",
		type: "Carpet",
		description: "High-traffic carpet installation for a corporate office space.",
		images: [
			"/placeholder.svg?height=600&width=800",
			"/placeholder-user.jpg",
		],
		details: "Installed durable, stain-resistant carpet tiles for a busy office. The project required after-hours work to minimize disruption.",
		client: "Grace Wambui",
		location: "Westlands, Nairobi",
		year: 2023,
	},
	{
		id: "4",
		title: "Restaurant Epoxy Flooring",
		category: "Commercial",
		type: "Epoxy",
		description: "Durable, easy-to-clean epoxy flooring for a busy restaurant kitchen.",
		images: [
			"/placeholder.svg?height=600&width=800",
			"/placeholder-logo.png",
		],
		details: "Provided a slip-resistant, hygienic epoxy floor for a high-traffic restaurant. Fast turnaround to meet reopening schedule.",
		client: "Mwangi Kimani",
		location: "Kisumu, Kenya",
		year: 2022,
	},
	{
		id: "5",
		title: "Hardwood Living Room",
		category: "Residential",
		type: "Hardwood",
		description: "Beautiful hardwood flooring installation for a family living room.",
		images: [
			"/placeholder.svg?height=600&width=800",
		],
		details: "Installed premium hardwood planks with a natural finish. The client wanted a warm, inviting space for family gatherings.",
		client: "Janet Otieno",
		location: "Karen, Nairobi",
		year: 2024,
	},
	{
		id: "6",
		title: "Hotel Lobby Marble Tiles",
		category: "Commercial",
		type: "Tile",
		description: "Elegant marble tile installation for a luxury hotel lobby.",
		images: [
			"/placeholder.svg?height=600&width=800",
		],
		details: "Laid imported marble tiles in a geometric pattern for a 5-star hotel. The result is a stunning, durable lobby floor.",
		client: "Hotel Sapphire",
		location: "Mombasa, Kenya",
		year: 2023,
	},
	{
		id: "7",
		title: "Basement Vinyl Flooring",
		category: "Residential",
		type: "Vinyl",
		description: "Waterproof vinyl flooring for a finished basement entertainment area.",
		images: [
			"/placeholder.svg?height=600&width=800",
		],
		details: "Transformed a damp basement into a cozy retreat with waterproof vinyl planks. Easy to clean and maintain.",
		client: "Peter Ndegwa",
		location: "Runda, Nairobi",
		year: 2022,
	},
	{
		id: "8",
		title: "Retail Store Laminate Flooring",
		category: "Commercial",
		type: "Laminate",
		description: "Durable laminate flooring for a high-traffic retail environment.",
		images: [
			"/placeholder.svg?height=600&width=800",
		],
		details: "Installed scratch-resistant laminate for a busy retail store. The new floor is stylish and easy to maintain.",
		client: "Wairimu Stores",
		location: "Thika, Kenya",
		year: 2023,
	},
	{
		id: "9",
		title: "Outdoor Deck Composite",
		category: "Residential",
		type: "Composite",
		description: "Weather-resistant composite deck flooring for outdoor entertainment.",
		images: [
			"/placeholder.svg?height=600&width=800",
		],
		details: "Built a spacious, low-maintenance composite deck for outdoor gatherings. Resistant to rain and sun.",
		client: "Susan Achieng",
		location: "Nakuru, Kenya",
		year: 2024,
	},
]

const Lightbox = ({ images, current, onClose }: { images: string[]; current: number; onClose: () => void }) => {
	const [idx, setIdx] = useState(current)
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
			<button className="absolute top-4 right-4 text-white text-2xl" onClick={onClose} aria-label="Close">×</button>
			<div className="flex flex-col items-center">
				<img src={images[idx]} alt="Gallery" className="max-h-[70vh] max-w-[90vw] rounded-lg shadow-lg" />
				<div className="flex gap-2 mt-4">
					{images.map((img, i) => (
						<button
							key={img}
							className={`border rounded w-16 h-12 ${i === idx ? 'border-primary' : 'border-muted'}`}
							onClick={() => setIdx(i)}
							aria-label={`Show image ${i + 1}`}
						>
							<img src={img} alt={`Thumb ${i + 1}`} className="object-cover w-full h-full" />
						</button>
					))}
				</div>
			</div>
		</div>
	)
}

const socialLinks = [
	{
		name: "Facebook",
		url: (title: string, url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
		icon: (
			<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12"/></svg>
		),
	},
	{
		name: "Twitter",
		url: (title: string, url: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
		icon: (
			<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.39-.58 2.19 0 1.51.77 2.84 1.95 3.62-.72-.02-1.39-.22-1.98-.55v.06c0 2.11 1.5 3.87 3.5 4.27-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.68 2.12 2.91 3.99 2.94A8.6 8.6 0 0 1 2 19.54c-.65 0-1.29-.04-1.92-.11A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.69-6.26 11.69-11.69 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 22.46 6z"/></svg>
		),
	},
	{
		name: "WhatsApp",
		url: (title: string, url: string) => `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
		icon: (
			<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.19-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.66-.5-5.22-1.44l-.37-.22-3.68.96.98-3.59-.24-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.18.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.2 0-.52.07-.8.36-.28.28-1.06 1.04-1.06 2.54 0 1.5 1.09 2.95 1.24 3.16.15.21 2.14 3.28 5.19 4.47.73.31 1.3.5 1.75.64.74.24 1.41.21 1.94.13.59-.09 1.8-.74 2.06-1.46.25-.72.25-1.34.18-1.46-.07-.12-.25-.2-.53-.34z"/></svg>
		),
	},
]

const PortfolioProjectPage = ({ params }: { params: { id: string } }) => {
	const router = useRouter()
	const project = allProjects.find((p) => p.id === params.id)
	const [mainImage, setMainImage] = useState(project?.images[0] || "")
	const [lightboxOpen, setLightboxOpen] = useState(false)
	const [lightboxIdx, setLightboxIdx] = useState(0)

	useEffect(() => {
		// Optionally, fetch project details here using params.id
	}, [params.id])

	if (!project) {
		return (
			<div className="py-12 md:py-16">
				<div className="container mx-auto px-4 text-center">
					<h1 className="text-3xl md:text-4xl font-bold mb-4">Project Not Found</h1>
					<p className="text-muted-foreground mb-8">Sorry, we couldn't find the project you're looking for.</p>
				</div>
			</div>
		)
	}

	// For share links
	const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
	const shareTitle = `Check out this project: ${project.title} by ModarFlor!`

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
						<span>Client: {project.client}</span> &bull; <span>Location: {project.location}</span> &bull; <span>Year: {project.year}</span>
					</div>
				</div>
				{/* Main Image */}
				<div className="w-full max-w-3xl mx-auto mb-6">
					<div className="relative aspect-[4/3] rounded-lg overflow-hidden border cursor-pointer" onClick={() => { setLightboxOpen(true); setLightboxIdx(project.images.indexOf(mainImage)) }}>
						<Image src={mainImage} alt={project.title} fill className="object-cover" />
					</div>
					{/* Thumbnails */}
					<div className="flex gap-2 mt-3 justify-center">
						{project.images.map((img, idx) => (
							<button
								key={img}
								className={`border rounded-md overflow-hidden w-20 h-16 focus:outline-none ${mainImage === img ? "border-primary" : "border-muted"}`}
								onClick={() => { setMainImage(img); setLightboxIdx(idx) }}
								aria-label={`Show image ${idx + 1}`}
								type="button"
							>
								<Image src={img} alt={`Thumbnail ${idx + 1}`} width={80} height={64} className="object-cover" />
							</button>
						))}
					</div>
				</div>
				{/* Lightbox Modal */}
				{lightboxOpen && (
					<Lightbox images={project.images} current={lightboxIdx} onClose={() => setLightboxOpen(false)} />
				)}
				{/* Description and Details */}
				<div className="max-w-2xl mx-auto mb-8">
					<p className="text-lg mb-4">{project.description}</p>
					<div className="bg-muted/50 rounded-lg p-4">
						<h2 className="text-xl font-semibold mb-2">Project Details</h2>
						<p className="mb-2">{project.details}</p>
						<ul className="list-disc pl-5 text-muted-foreground text-sm">
							<li><strong>Client:</strong> {project.client}</li>
							<li><strong>Location:</strong> {project.location}</li>
							<li><strong>Year:</strong> {project.year}</li>
							<li><strong>Type:</strong> {project.type}</li>
						</ul>
					</div>
				</div>
				{/* Share Buttons */}
				<div className="flex gap-4 mt-8 mb-4 justify-center">
					{socialLinks.map((social) => (
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
