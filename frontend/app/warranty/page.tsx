"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Clock, CheckCircle, AlertCircle, FileText, Phone, Mail } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { Input } from "@/components/ui/input"

const warrantyPlans = [
	{
		id: "basic",
		name: "Basic Warranty",
		duration: "1 Year",
		price: "Included",
		description: "Standard warranty covering workmanship and installation defects",
		features: [
			"Workmanship guarantee",
			"Installation defect coverage",
			"Material defect coverage",
			"Free repair service",
			"24/7 customer support",
		],
		coverage: [
			"Installation errors",
			"Workmanship defects",
			"Material manufacturing defects",
			"Adhesive failures",
			"Seam separations",
		],
		exclusions: [
			"Normal wear and tear",
			"Damage from misuse",
			"Water damage (non-waterproof materials)",
			"Pet damage",
			"Heavy furniture indentations",
		],
	},
	{
		id: "extended",
		name: "Extended Warranty",
		duration: "3 Years",
		price: "Starting at Ksh 299",
		description: "Comprehensive coverage with extended protection period",
		features: [
			"All Basic Warranty features",
			"Extended 3-year coverage",
			"Annual maintenance check",
			"Priority service scheduling",
			"Transferable warranty",
		],
		coverage: [
			"All Basic Warranty coverage",
			"Premature wear issues",
			"Color fading (UV protection)",
			"Minor water damage",
			"Subfloor issues",
		],
		exclusions: [
			"Intentional damage",
			"Commercial use (residential installations)",
			"Extreme weather damage",
			"Chemical spills",
			"Modifications by other contractors",
		],
	},
	{
		id: "premium",
		name: "Premium Warranty",
		duration: "5 Years",
		price: "Starting at Ksh 599",
		description: "Ultimate protection with comprehensive coverage and premium services",
		features: [
			"All Extended Warranty features",
			"5-year comprehensive coverage",
			"Bi-annual maintenance visits",
			"Emergency repair service",
			"Replacement guarantee",
			"Lifetime consultation support",
		],
		coverage: [
			"All Extended Warranty coverage",
			"Accidental damage protection",
			"Pet damage coverage",
			"Moisture-related issues",
			"Structural settling damage",
			"Full replacement if unrepairable",
		],
		exclusions: [
			"Intentional vandalism",
			"Natural disasters",
			"Structural building failures",
			"Changes in building codes",
			"Discontinued materials",
		],
	},
]

const flooringWarranties = {
	epoxy: {
		name: "Epoxy Flooring",
		workmanship: "2 years",
		material: "10-15 years",
		details: "Covers delamination, cracking, and color fading under normal use",
	},
	tile: {
		name: "Tile Installation",
		workmanship: "2 years",
		material: "Lifetime (ceramic/porcelain)",
		details: "Covers installation defects, grout issues, and tile cracking",
	},
	carpet: {
		name: "Carpet Installation",
		workmanship: "1 year",
		material: "5-10 years",
		details: "Covers seam separation, stretching issues, and premature wear",
	},
	hardwood: {
		name: "Hardwood Flooring",
		workmanship: "2 years",
		material: "25+ years",
		details: "Covers installation defects, finish issues, and board separation",
	},
	vinyl: {
		name: "Vinyl & Laminate",
		workmanship: "1 year",
		material: "10-20 years",
		details: "Covers installation defects, plank separation, and wear layer issues",
	},
}

export default function WarrantyPage() {
	const [warrantyValue, setWarrantyValue] = useState(0)

	return (
		<div className="py-12 md:py-16">
			<div className="container mx-auto px-4">
				<div className="max-w-6xl mx-auto">
					{/* Header */}
					<div className="text-center mb-12">
						<h1 className="text-4xl md:text-5xl font-bold mb-4">Warranty & Protection</h1>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Your flooring investment is protected with our comprehensive warranty programs. Choose the coverage that's
							right for your project.
						</p>
					</div>

					<Tabs defaultValue="plans" className="space-y-8">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="plans">Warranty Plans</TabsTrigger>
							<TabsTrigger value="coverage">Coverage Details</TabsTrigger>
							<TabsTrigger value="claims">Claims Process</TabsTrigger>
						</TabsList>

						{/* Warranty Plans Tab */}
						<TabsContent value="plans">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
								{warrantyPlans.map((plan, index) => (
									<motion.div
										key={plan.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5, delay: index * 0.1 }}
									>
										<Card className={`h-full ${plan.id === "extended" ? "ring-2 ring-primary" : ""}`}>
											<CardHeader>
												<div className="flex items-center justify-between mb-2">
													<CardTitle className="text-xl">{plan.name}</CardTitle>
													{plan.id === "extended" && <Badge className="bg-primary">Most Popular</Badge>}
												</div>
												<div className="space-y-2">
													<div className="flex items-center gap-2">
														<Clock className="h-4 w-4 text-primary" />
														<span className="font-semibold">{plan.duration}</span>
													</div>
													<div className="text-2xl font-bold text-primary">{plan.price}</div>
													<p className="text-sm text-muted-foreground">{plan.description}</p>
												</div>
											</CardHeader>
											<CardContent className="space-y-6">
												<div>
													<h4 className="font-semibold mb-3 flex items-center">
														<CheckCircle className="h-4 w-4 mr-2 text-green-600" />
														Features Included
													</h4>
													<ul className="space-y-2">
														{plan.features.map((feature, idx) => (
															<li key={idx} className="text-sm flex items-start">
																<span className="text-green-600 mr-2">✓</span>
																{feature}
															</li>
														))}
													</ul>
												</div>

												<div>
													<h4 className="font-semibold mb-3 flex items-center">
														<Shield className="h-4 w-4 mr-2 text-blue-600" />
														Coverage
													</h4>
													<ul className="space-y-1">
														{plan.coverage.slice(0, 3).map((item, idx) => (
															<li key={idx} className="text-sm text-muted-foreground">
																• {item}
															</li>
														))}
														{plan.coverage.length > 3 && (
															<li className="text-sm text-muted-foreground">
																+ {plan.coverage.length - 3} more items
															</li>
														)}
													</ul>
												</div>

												<Button className="w-full" variant={plan.id === "basic" ? "outline" : "default"}>
													{plan.id === "basic" ? "Included with Service" : "Add to Project"}
												</Button>
											</CardContent>
										</Card>
									</motion.div>
								))}

								<div className="mt-12 bg-muted/30 rounded-lg p-8">
									<div className="text-center">
										<Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
										<h3 className="text-xl font-semibold mb-2">All Warranties Include</h3>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
											<div className="text-center">
												<CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
												<h4 className="font-medium">Quality Guarantee</h4>
												<p className="text-sm text-muted-foreground">100% satisfaction with our workmanship</p>
											</div>
											<div className="text-center">
												<Phone className="h-8 w-8 mx-auto mb-2 text-blue-600" />
												<h4 className="font-medium">24/7 Support</h4>
												<p className="text-sm text-muted-foreground">Round-the-clock customer service</p>
											</div>
											<div className="text-center">
												<FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
												<h4 className="font-medium">Documentation</h4>
												<p className="text-sm text-muted-foreground">Complete warranty documentation</p>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="mt-12 bg-muted/30 rounded-lg p-8">
								<div className="text-center">
									<Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
									<h3 className="text-xl font-semibold mb-2">All Warranties Include</h3>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
										<div className="text-center">
											<CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
											<h4 className="font-medium">Quality Guarantee</h4>
											<p className="text-sm text-muted-foreground">100% satisfaction with our workmanship</p>
										</div>
										<div className="text-center">
											<Phone className="h-8 w-8 mx-auto mb-2 text-blue-600" />
											<h4 className="font-medium">24/7 Support</h4>
											<p className="text-sm text-muted-foreground">Round-the-clock customer service</p>
										</div>
										<div className="text-center">
											<FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
											<h4 className="font-medium">Documentation</h4>
											<p className="text-sm text-muted-foreground">Complete warranty documentation</p>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>

						{/* Coverage Details Tab */}
						<TabsContent value="coverage">
							<div className="space-y-8">
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{Object.entries(flooringWarranties).map(([key, warranty]) => (
										<Card key={key}>
											<CardHeader>
												<CardTitle className="text-lg">{warranty.name}</CardTitle>
											</CardHeader>
											<CardContent className="space-y-4">
												<div className="space-y-2">
													<div className="flex justify-between">
														<span className="text-sm font-medium">Workmanship:</span>
														<span className="text-sm">{warranty.workmanship}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-sm font-medium">Material:</span>
														<span className="text-sm">{warranty.material}</span>
													</div>
												</div>
												<p className="text-sm text-muted-foreground">{warranty.details}</p>
											</CardContent>
										</Card>
									))}
								</div>

								<Card>
									<CardHeader>
										<CardTitle className="flex items-center">
											<AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
											Important Warranty Information
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<h4 className="font-semibold mb-3 text-green-700">What's Covered</h4>
												<ul className="space-y-1 text-sm">
													<li>• Manufacturing defects in materials</li>
													<li>• Installation workmanship errors</li>
													<li>• Premature wear under normal use</li>
													<li>• Adhesive or fastener failures</li>
													<li>• Finish defects and discoloration</li>
													<li>• Seam separation and buckling</li>
												</ul>
											</div>
											<div>
												<h4 className="font-semibold mb-3 text-red-700">What's Not Covered</h4>
												<ul className="space-y-1 text-sm">
													<li>• Damage from misuse or abuse</li>
													<li>• Normal wear and tear</li>
													<li>• Water damage (non-waterproof materials)</li>
													<li>• Pet damage and stains</li>
													<li>• Damage from improper maintenance</li>
													<li>• Acts of nature or accidents</li>
												</ul>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						{/* Claims Process Tab */}
						<TabsContent value="claims">
							<div className="space-y-8">
								<Card>
									<CardHeader>
										<CardTitle>How to File a Warranty Claim</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
											{[
												{
													step: 1,
													title: "Contact Us",
													description: "Call our warranty hotline or submit an online claim form",
													icon: Phone,
												},
												{
													step: 2,
													title: "Documentation",
													description: "Provide photos, warranty certificate, and description of issue",
													icon: FileText,
												},
												{
													step: 3,
													title: "Inspection",
													description: "Our technician will schedule an inspection within 48 hours",
													icon: CheckCircle,
												},
												{
													step: 4,
													title: "Resolution",
													description: "We'll repair or replace the affected area at no cost to you",
													icon: Shield,
												},
											].map((step) => (
												<div key={step.step} className="text-center">
													<div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
														<step.icon className="h-8 w-8 text-primary" />
													</div>
													<div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
														{step.step}
													</div>
													<h3 className="font-semibold mb-2">{step.title}</h3>
													<p className="text-sm text-muted-foreground">{step.description}</p>
												</div>
											))}
										</div>
									</CardContent>
								</Card>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
									<Card>
										<CardHeader>
											<CardTitle>Contact Information</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="flex items-center gap-3">
												<Phone className="h-5 w-5 text-primary" />
												<div>
													<p className="font-medium">Warranty Hotline</p>
													<p className="text-sm text-muted-foreground">1-800-WARRANTY</p>
												</div>
											</div>
											<div className="flex items-center gap-3">
												<Mail className="h-5 w-5 text-primary" />
												<div>
													<p className="font-medium">Email Support</p>
													<p className="text-sm text-muted-foreground">warranty@modarflor.com</p>
												</div>
											</div>
											<div className="flex items-center gap-3">
												<Clock className="h-5 w-5 text-primary" />
												<div>
													<p className="font-medium">Response Time</p>
													<p className="text-sm text-muted-foreground">Within 24 hours</p>
												</div>
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle>Required Documentation</CardTitle>
										</CardHeader>
										<CardContent>
											<ul className="space-y-2 text-sm">
												<li className="flex items-start">
													<CheckCircle className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
													Original warranty certificate
												</li>
												<li className="flex items-start">
													<CheckCircle className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
													Clear photos of the issue
												</li>
												<li className="flex items-start">
													<CheckCircle className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
													Installation date and invoice
												</li>
												<li className="flex items-start">
													<CheckCircle className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
													Description of the problem
												</li>
												<li className="flex items-start">
													<CheckCircle className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
													Maintenance records (if applicable)
												</li>
											</ul>
										</CardContent>
									</Card>
								</div>

								<Card className="bg-blue-50 dark:bg-blue-900/20">
									<CardContent className="p-6">
										<div className="flex items-start gap-4">
											<AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
											<div>
												<h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
													Emergency Warranty Service
												</h3>
												<p className="text-blue-700 dark:text-blue-200 mb-4">
													For urgent warranty issues that pose safety risks or cause significant damage, we offer 24/7
													emergency service. Additional fees may apply for after-hours service calls.
												</p>
												<Button
													variant="outline"
													className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
												>
													Call Emergency Line: 1-800-EMERGENCY
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>
					</Tabs>

					{/* CTA Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="mt-16 bg-primary text-primary-foreground rounded-lg p-8 text-center"
					>
						<Shield className="h-12 w-12 mx-auto mb-4" />
						<h2 className="text-2xl font-bold mb-4">Protected Investment, Peace of Mind</h2>
						<p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
							Your flooring is protected by our comprehensive warranty programs. Get started with your project today and
							enjoy years of worry-free flooring.
						</p>
						<div className="flex flex-col sm:flex-row justify-center gap-4">
							<Button variant="secondary" size="lg" asChild>
								<Link href="/quote">Get Protected Quote</Link>
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground"
								asChild
							>
								<Link href="/contact">Learn More</Link>
							</Button>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	)
}
