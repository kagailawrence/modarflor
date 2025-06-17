"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Award, Clock, Shield, CheckCircle, Quote } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const teamMembers = [
	{
		id: 1,
		name: "John Martinez",
		role: "Founder & CEO",
		experience: "20+ years",
		image: "/placeholder.svg?height=400&width=400",
		bio: "John founded  ModarFlor with a vision to transform spaces through exceptional flooring solutions. His expertise in commercial and residential projects has made him a trusted name in the industry.",
		specialties: [
			"Project Management",
			"Commercial Flooring",
			"Business Development",
		],
	},
	{
		id: 2,
		name: "Sarah Chen",
		role: "Lead Designer",
		experience: "15+ years",
		image: "/placeholder.svg?height=400&width=400",
		bio: "Sarah brings artistic vision and technical expertise to every project. Her innovative designs have won multiple industry awards and satisfied hundreds of clients.",
		specialties: ["Interior Design", "Custom Patterns", "Color Consultation"],
	},
	{
		id: 3,
		name: "Mike Rodriguez",
		role: "Installation Manager",
		experience: "18+ years",
		image: "/placeholder.svg?height=400&width=400",
		bio: "Mike ensures every installation meets our highest standards. His attention to detail and craftsmanship expertise guarantees exceptional results on every project.",
		specialties: ["Epoxy Installation", "Tile Work", "Quality Control"],
	},
	{
		id: 4,
		name: "Lisa Thompson",
		role: "Customer Relations",
		experience: "12+ years",
		image: "/placeholder.svg?height=400&width=400",
		bio: "Lisa is dedicated to ensuring every client has an exceptional experience from consultation to project completion. Her commitment to customer satisfaction is unmatched.",
		specialties: ["Customer Service", "Project Coordination", "Client Relations"],
	},
]

const values = [
	{
		icon: Shield,
		title: "Quality Assurance",
		description:
			"We use only premium materials and proven techniques to ensure lasting results that exceed expectations.",
	},
	{
		icon: Clock,
		title: "Timely Delivery",
		description:
			"We respect your time and complete projects on schedule without compromising on quality.",
	},
	{
		icon: Users,
		title: "Customer Focus",
		description:
			"Your satisfaction is our priority. We listen, understand, and deliver solutions tailored to your needs.",
	},
	{
		icon: Award,
		title: "Excellence",
		description:
			"We strive for perfection in every project, maintaining the highest standards of craftsmanship.",
	},
]

const certifications = [
	"Licensed & Insured",
	"Better Business Bureau A+ Rating",
	"NFCA Certified Installers",
	"EPA Lead-Safe Certified",
	"OSHA Safety Trained",
	"Manufacturer Warranties",
]

export default function AboutPage() {
	const [selectedMember, setSelectedMember] = useState<number | null>(null)

	return (
		<div className="py-12 md:py-16">
			<div className="container mx-auto px-4">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h1 className="text-4xl md:text-5xl font-bold mb-6">
							About ModarFlor
						</h1>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
							For over two decades, we've been transforming spaces with premium
							flooring solutions. Our commitment to excellence, innovation, and
							customer satisfaction has made us the trusted choice for residential
							and commercial projects.
						</p>
					</motion.div>
				</div>

				{/* Company Story */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
					>
						<h2 className="text-3xl font-bold mb-6">Our Story</h2>
						<div className="space-y-4 text-muted-foreground">
							<p>
								ModarFlor was founded in 2003 with a simple mission: to provide
								exceptional flooring solutions that transform spaces and exceed
								expectations. What started as a small family business has grown
								into a leading flooring contractor serving the entire metropolitan
								area.
							</p>
							<p>
								Our journey began when founder John Martinez recognized the need
								for a flooring company that combined traditional craftsmanship with
								modern innovation. Today, we're proud to have completed over 500
								projects, earning the trust of homeowners, businesses, and
								contractors alike.
							</p>
							<p>
								We believe that great flooring is more than just a surface – it's
								the foundation of beautiful, functional spaces where people live,
								work, and create memories. This philosophy drives everything we
								do, from our initial consultation to the final walkthrough.
							</p>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="relative"
					>
						<div className="aspect-video rounded-lg overflow-hidden">
							<Image
								src="/placeholder.svg?height=600&width=800"
								alt="ModarFlor team at work"
								fill
								className="object-cover"
							/>
						</div>
						<div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
							<div className="text-center">
								<div className="text-3xl font-bold">500+</div>
								<div className="text-sm">Projects Completed</div>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Values Section */}
				<div className="mb-20">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="text-3xl font-bold mb-4">Our Values</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							These core values guide every decision we make and every project we
							undertake.
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{values.map((value, index) => (
							<motion.div
								key={value.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								viewport={{ once: true }}
							>
								<Card className="h-full text-center p-6">
									<CardContent className="p-0">
										<div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
											<value.icon className="h-8 w-8 text-primary" />
										</div>
										<h3 className="text-xl font-semibold mb-3">
											{value.title}
										</h3>
										<p className="text-muted-foreground">
											{value.description}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</div>

				{/* Team Section */}
				<div className="mb-20">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Our experienced professionals are passionate about delivering
							exceptional results and outstanding customer service.
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{teamMembers.map((member, index) => (
							<motion.div
								key={member.id}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								viewport={{ once: true }}
							>
								<Card
									className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
									onClick={() =>
										setSelectedMember(
											selectedMember === member.id ? null : member.id
										)
									}
								>
									<div className="aspect-square relative">
										<Image
											src={member.image || "/placeholder.svg"}
											alt={member.name}
											fill
											className="object-cover"
										/>
									</div>
									<CardContent className="p-6">
										<h3 className="text-xl font-semibold mb-1">
											{member.name}
										</h3>
										<p className="text-primary font-medium mb-2">
											{member.role}
										</p>
										<p className="text-sm text-muted-foreground mb-3">
											{member.experience} experience
										</p>

										{selectedMember === member.id && (
											<motion.div
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: "auto" }}
												exit={{ opacity: 0, height: 0 }}
												className="border-t pt-4 mt-4"
											>
												<p className="text-sm text-muted-foreground mb-3">
													{member.bio}
												</p>
												<div className="flex flex-wrap gap-1">
													{member.specialties.map((specialty) => (
														<Badge
															key={specialty}
															variant="secondary"
															className="text-xs"
														>
															{specialty}
														</Badge>
													))}
												</div>
											</motion.div>
										)}
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</div>

				{/* Certifications */}
				<div className="mb-20">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="text-3xl font-bold mb-4">
							Certifications & Credentials
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							We maintain the highest industry standards through continuous
							training and certification.
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{certifications.map((cert, index) => (
							<motion.div
								key={cert}
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								viewport={{ once: true }}
								className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg"
							>
								<CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
								<span className="font-medium">{cert}</span>
							</motion.div>
						))}
					</div>
				</div>

				{/* Testimonial Quote */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="bg-primary text-primary-foreground rounded-lg p-8 md:p-12 text-center mb-20"
				>
					<Quote className="h-12 w-12 mx-auto mb-6 opacity-50" />
					<blockquote className="text-xl md:text-2xl font-medium mb-6">
						" ModarFlor doesn't just install floors – they create the
						foundations for beautiful spaces. Their attention to detail and
						commitment to excellence is unmatched in the industry."
					</blockquote>
					<cite className="text-lg opacity-90">
						— David Wilson, Commercial Property Manager
					</cite>
				</motion.div>

				{/* CTA Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="text-center"
				>
					<h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto mb-8">
						Let our experienced team help you transform your space with premium
						flooring solutions. Contact us today for a free consultation and quote.
					</p>
					<div className="flex flex-col sm:flex-row justify-center gap-4">
						<Button size="lg" asChild>
							<Link href="/contact">Get Free Quote</Link>
						</Button>
						<Button size="lg" variant="outline" asChild>
							<Link href="/portfolio">View Our Work</Link>
						</Button>
					</div>
				</motion.div>
			</div>
		</div>
	)
}
