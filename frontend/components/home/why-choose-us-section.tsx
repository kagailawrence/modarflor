"use client"

import { ShieldCheck, DollarSign, Leaf, Users, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

const reasons = [
	{
		icon: ShieldCheck,
		title: "Unmatched Quality",
		description:
			"We use only premium materials and expert installers for flawless, lasting results.",
	},
	{
		icon: DollarSign,
		title: "Affordable Pricing",
		description:
			"Transparent, competitive rates—no hidden fees. Get the best value for your investment.",
	},
	{
		icon: Leaf,
		title: "Eco-Friendly Options",
		description:
			"Choose from sustainable, low-VOC, and recycled flooring solutions for a greener future.",
	},
	{
		icon: Users,
		title: "Personalized Service",
		description:
			"From consultation to installation, we tailor every project to your unique needs.",
	},
	{
		icon: Sparkles,
		title: "Modern Designs",
		description:
			"Stay ahead of trends with our curated selection of stylish, contemporary flooring.",
	},
]

export default function WhyChooseUsSection() {
	return (
		<section className="py-16 bg-primary/5">
			<div className="container mx-auto px-4 max-w-5xl">
				<motion.h2
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
					viewport={{ once: true }}
					className="text-3xl md:text-4xl font-bold text-center mb-10 text-primary"
				>
					Why Choose Us
				</motion.h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
					{reasons.map((reason, i) => (
						<motion.div
							key={reason.title}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: i * 0.1 }}
							viewport={{ once: true }}
							className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
						>
							<reason.icon className="h-10 w-10 text-primary mb-4" />
							<h3 className="font-semibold text-lg mb-2">
								{reason.title}
							</h3>
							<p className="text-muted-foreground text-sm">
								{reason.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
