"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Leaf, DollarSign, Users as UsersIcon, Sparkles } from "lucide-react"

export default function AboutPage() {
	return (
		<div className="py-12 md:py-16">
			<div className="container mx-auto px-4 max-w-3xl">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease: "easeOut" }}
					className="mb-12 text-center"
				>
					<h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
						About Modaflor Limited
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
						At Modaflor Limited, we believe flooring is more than just a surface—
						it’s the foundation of every moment, memory, and milestone. Established in
						2023 and proudly based in Nairobi, we are a mid-sized Kenyan company
						transforming spaces across homes, offices, schools, and commercial
						properties throughout Kenya and East Africa.
					</p>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.2 }}
					viewport={{ once: true }}
					className="mb-10"
				>
					<div className="rounded-xl bg-primary/5 p-6 md:p-10 shadow-lg flex flex-col gap-6">
						<p className="text-lg">
							We specialize in{" "}
							<span className="font-semibold text-primary">
								premium flooring solutions
							</span>{" "}
							that blend beauty with practicality. From SPC floors, laminates, and
							LVT, to plush kids’ mats, anti-slip bathroom mats, wall-to-wall
							carpets, carpet tiles, and artificial grass carpets—our range is
							carefully selected to deliver comfort, durability, and modern
							elegance.
						</p>
						<p className="text-lg">
							Whether you’re creating a cozy home, a child-friendly space, or a
							polished office, we walk with you every step of the way—from supply
							to expert installation.
						</p>
					</div>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.3 }}
					viewport={{ once: true }}
					className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-8"
				>
					<Card className="text-center p-6">
						<Sparkles className="mx-auto h-10 w-10 text-primary mb-3" />
						<h3 className="font-bold text-xl mb-2">Our Mission</h3>
						<p className="text-muted-foreground">
							To make quality flooring accessible to all—affordable, durable, and
							designed to elevate everyday living.
						</p>
					</Card>
					<Card className="text-center p-6">
						<UsersIcon className="mx-auto h-10 w-10 text-primary mb-3" />
						<h3 className="font-bold text-xl mb-2">Our Vision</h3>
						<p className="text-muted-foreground">
							To be East Africa’s most trusted name in flooring—one space, one
							story at a time.
						</p>
					</Card>
					<Card className="text-center p-6">
						<Leaf className="mx-auto h-10 w-10 text-primary mb-3" />
						<h3 className="font-bold text-xl mb-2">Our Values</h3>
						<ul className="text-muted-foreground space-y-1 text-left inline-block mx-auto">
							<li>• Quality you can feel</li>
							<li>• Affordability without compromise</li>
							<li>• Sustainability in every choice</li>
						</ul>
					</Card>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.4 }}
					viewport={{ once: true }}
					className="mb-12"
				>
					<Card className="p-8 text-center bg-gradient-to-br from-primary/10 to-primary/5 border-0 shadow-xl">
						<h3 className="text-2xl font-bold mb-2 text-primary">Our Clients</h3>
						<p className="text-muted-foreground mb-4">
							We’ve had the honor of serving industry leaders like{" "}
							<span className="font-semibold">M-Gas</span>, as well as countless
							homeowners who have trusted us to bring their spaces to life with
							warmth, style, and lasting impact.
						</p>
					</Card>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.5 }}
					viewport={{ once: true }}
					className="text-center"
				>
					<Button size="lg" asChild>
						<Link href="/contact">Get Free Quote</Link>
					</Button>
				</motion.div>
			</div>
		</div>
	)
}
