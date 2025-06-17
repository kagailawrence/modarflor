"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Plus, Minus, MessageCircle, Phone, Mail } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

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

const faqs = [
  {
    id: 1,
    category: "General",
    question: "How long has  ModarFlor been in business?",
    answer:
      "ModarFlor has been serving the community for over 20 years. We were founded in 2003 and have completed over 500 successful projects for both residential and commercial clients.",
  },
  {
    id: 2,
    category: "General",
    question: "Are you licensed and insured?",
    answer:
      "Yes, we are fully licensed and insured. We carry comprehensive liability insurance and workers' compensation coverage. We're also Better Business Bureau accredited with an A+ rating.",
  },
  {
    id: 3,
    category: "Pricing",
    question: "How do you calculate pricing for flooring projects?",
    answer:
      "Our pricing is based on several factors including the type of flooring, square footage, complexity of the installation, site preparation requirements, and any additional services needed. We provide detailed, transparent quotes with no hidden fees.",
  },
  {
    id: 4,
    category: "Pricing",
    question: "Do you offer financing options?",
    answer:
      "Yes, we offer flexible financing options to help make your flooring project more affordable. We work with several financing partners to provide competitive rates and terms that fit your budget.",
  },
  {
    id: 5,
    category: "Epoxy Flooring",
    question: "How long does epoxy flooring last?",
    answer:
      "When properly installed and maintained, epoxy flooring can last 10-20 years or more. The lifespan depends on factors such as traffic levels, maintenance, and environmental conditions. We use high-quality materials and proper installation techniques to maximize durability.",
  },
  {
    id: 6,
    category: "Epoxy Flooring",
    question: "Can epoxy flooring be installed over existing concrete?",
    answer:
      "In most cases, yes. Epoxy can be applied over existing concrete surfaces, but the concrete must be properly prepared. This includes cleaning, repairing any cracks or damage, and ensuring proper adhesion. We'll assess your existing surface during our consultation.",
  },
  {
    id: 7,
    category: "Tile Installation",
    question: "What types of tile do you install?",
    answer:
      "We install all types of tile including ceramic, porcelain, natural stone (marble, granite, travertine), glass tile, and specialty tiles. We work with both residential and commercial grade materials.",
  },
  {
    id: 8,
    category: "Tile Installation",
    question: "How long does tile installation take?",
    answer:
      "Installation time varies based on the size and complexity of the project. A typical bathroom might take 2-3 days, while a large kitchen or commercial space could take 1-2 weeks. We'll provide a detailed timeline during your consultation.",
  },
  {
    id: 9,
    category: "Installation Process",
    question: "What should I expect during the installation process?",
    answer:
      "Our installation process includes: 1) Initial consultation and measurement, 2) Material ordering and scheduling, 3) Site preparation, 4) Professional installation, 5) Final inspection and cleanup. We'll keep you informed throughout each step.",
  },
  {
    id: 10,
    category: "Installation Process",
    question: "Do I need to move my furniture?",
    answer:
      "We offer furniture moving services as part of our installation. For smaller items, we can handle the moving. For large or valuable pieces, we recommend professional movers or we can coordinate with your preferred moving service.",
  },
  {
    id: 11,
    category: "Maintenance",
    question: "How do I maintain my new flooring?",
    answer:
      "Maintenance requirements vary by flooring type. We provide detailed care instructions for your specific flooring. Generally, regular cleaning with appropriate products and prompt attention to spills will keep your floors looking great for years.",
  },
  {
    id: 12,
    category: "Maintenance",
    question: "Do you offer maintenance services?",
    answer:
      "Yes, we offer ongoing maintenance services including deep cleaning, refinishing, repairs, and protective treatments. We can set up a maintenance schedule that works for your needs and budget.",
  },
  {
    id: 13,
    category: "Hardwood",
    question: "What's the difference between solid and engineered hardwood?",
    answer:
      "Solid hardwood is made from a single piece of wood and can be refinished multiple times. Engineered hardwood has a real wood top layer over a plywood base, making it more stable and suitable for areas with moisture concerns. Both offer beautiful, natural wood appearance.",
  },
  {
    id: 14,
    category: "Carpet",
    question: "What carpet options do you recommend for high-traffic areas?",
    answer:
      "For high-traffic areas, we recommend commercial-grade carpets with low pile height, solution-dyed fibers, and built-in stain protection. Nylon and polyester blends offer excellent durability and easy maintenance.",
  },
  {
    id: 15,
    category: "General",
    question: "Do you provide warranties on your work?",
    answer:
      "Yes, we provide comprehensive warranties on both materials and workmanship. Warranty terms vary by product and installation type. We'll explain all warranty coverage during your consultation and provide written documentation.",
  },
  {
    id: 16,
    question: "What services does ModarFlor offer?",
    answer:
      "ModarFlor specializes in flooring solutions including epoxy, tile, carpet, hardwood, vinyl, laminate, and composite decking for both residential and commercial spaces.",
  },
  {
    id: 17,
    question: "Where is ModarFlor located?",
    answer:
      "We are based in Nairobi, Kenya, and serve clients throughout the country.",
  },
  {
    id: 18,
    question: "How can I request a quote?",
    answer:
      "You can request a quote by clicking the 'Get Quote' button in the header or visiting our Contact page.",
  },
  {
    id: 19,
    question: "Do you offer warranties on your flooring?",
    answer:
      "Yes, all our flooring installations come with a warranty. Please see our Warranty page for details.",
  },
  {
    id: 20,
    question: "How do I maintain my new floor?",
    answer:
      "We provide care instructions for each flooring type. Our team is also available for aftercare support.",
  },
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [openItems, setOpenItems] = useState<number[]>([])
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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
                          <Badge variant="outline" className="mb-2">
                            {faq.category}
                          </Badge>
                          <h3 className="text-lg font-semibold">{faq.question}</h3>
                        </div>
                        <div className="ml-4">
                          {openItems.includes(faq.id) ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
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
                          <div className="px-6 pb-6 text-muted-foreground">{faq.answer}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No FAQs found matching your search criteria.</p>
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
              Can't find what you're looking for? Our team is here to help with any questions about your flooring
              project.
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
