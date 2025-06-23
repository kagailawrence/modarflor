"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Plus, Minus, MessageCircle, Phone, Mail } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { BASE_URL } from "@/lib/baseUrl"

const faqCategories = [
	"All",
	"General",
	"Epoxy Flooring",
	"Tile Installation",
	"Carpet",
	"Hardwood",
	"Pricing",
	"Installation Process",
	"Maintenance",
]

export default function FAQPage() {
	const [faqs, setFaqs] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [searchTerm, setSearchTerm] = useState("")
	const [selectedCategory, setSelectedCategory] = useState("All")
	const [openItems, setOpenItems] = useState<number[]>([])

	useEffect(() => {
		const fetchFaqs = async () => {
			setLoading(true)
			setError(null)
			try {
				const res = await fetch(`${BASE_URL}/api/faqs`)
				if (!res.ok) throw new Error("Failed to fetch FAQs")
				const data = await res.json()
				setFaqs(data)
			} catch (e: any) {
				setError(e.message)
			} finally {
				setLoading(false)
			}
		}
		fetchFaqs()
	}, [])

	const filteredFAQs = faqs.filter((faq) => {
		const matchesSearch =
			faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
			faq.answer.toLowerCase().includes(searchTerm.toLowerCase())

		const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory

		return matchesSearch && matchesCategory
	})

	const toggleItem = (id: number) => {
		setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
	}

	return (
		<div className="py-12 md:py-16">
			<div className="container mx-auto px-4">
				<div className="max-w-4xl mx-auto">
					{/* Header */}
					<div className="text-center mb-12">
						<h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Find answers to common questions about our flooring services, installation process, and maintenance.
						</p>
					</div>

					{/* Search and Filter */}
					<div className="mb-8 space-y-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search FAQs..."
								className="pl-10"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>

						<div className="flex flex-wrap gap-2">
							{faqCategories.map((category) => (
								<Badge
									key={category}
									variant={selectedCategory === category ? "default" : "outline"}
									className="cursor-pointer"
									onClick={() => setSelectedCategory(category)}
								>
									{category}
								</Badge>
							))}
						</div>
					</div>

					{/* FAQ Items */}
					{loading ? (
						<div>Loading...</div>
					) : error ? (
						<div className="text-red-500">{error}</div>
					) : (
						<div className="space-y-4 mb-16">
							{filteredFAQs.map((faq, index) => (
								<motion.div
									key={faq.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.05 }}
								>
									<Card className="overflow-hidden">
										<CardContent className="p-0">
											<button
												className="w-full p-6 text-left hover:bg-muted/50 transition-colors"
												onClick={() => toggleItem(faq.id)}
											>
												<div className="flex items-center justify-between">
													<div className="flex-1">
														{faq.category && (
															<Badge variant="outline" className="mb-2">
																{faq.category}
															</Badge>
														)}
														<h3 className="text-lg font-semibold">{faq.question}</h3>
													</div>
													<div className="ml-4">
														{openItems.includes(faq.id) ? (
															<Minus className="h-5 w-5" />
														) : (
															<Plus className="h-5 w-5" />
														)}
													</div>
												</div>
											</button>

											<AnimatePresence>
												{openItems.includes(faq.id) && (
													<motion.div
														initial={{ height: 0, opacity: 0 }}
														animate={{ height: "auto", opacity: 1 }}
														exit={{ height: 0, opacity: 0 }}
														transition={{ duration: 0.3 }}
														className="overflow-hidden"
													>
														<div className="px-6 pb-6 text-muted-foreground">
															{faq.answer}
														</div>
													</motion.div>
												)}
											</AnimatePresence>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</div>
					)}

					{filteredFAQs.length === 0 && !loading && !error && (
						<div className="text-center py-12">
							<p className="text-muted-foreground">
								No FAQs found matching your search criteria.
							</p>
						</div>
					)}

					{/* Still Have Questions */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="bg-primary text-primary-foreground rounded-lg p-8 text-center"
					>
						<MessageCircle className="h-12 w-12 mx-auto mb-4" />
						<h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
						<p className="text-lg opacity-90 mb-8">
							Can't find what you're looking for? Our team is here to help with any
							questions about your flooring project.
						</p>
						<div className="flex flex-col sm:flex-row justify-center gap-4">
							<Button variant="secondary" size="lg" asChild>
								<Link href="/contact">
									<Mail className="mr-2 h-5 w-5" />
									Contact Us
								</Link>
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground"
								asChild
							>
								<Link href="tel:1-800-FLOOR-PRO">
									<Phone className="mr-2 h-5 w-5" />
									Call Now
								</Link>
							</Button>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	)
}
