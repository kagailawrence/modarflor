"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle } from "lucide-react"
import { BASE_URL } from "@/lib/baseUrl"
import { getImageUrl } from "@/lib/getImageUrl"

interface ServiceFeature {
  id: string
  service_id: string
  description: string
  created_at: string
  updated_at: string
}

interface Service {
  id: string
  title: string
  description: string
  image_url: string
  order_index: number
  created_at: string
  updated_at: string
  features: ServiceFeature[]
}

export default function ServicesClient({ services }: { services: Service[] }) {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Hero section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We offer a comprehensive range of flooring solutions to meet your residential and commercial needs.
          </p>
        </div>
        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service) => {
            const imageUrl = getImageUrl(service.image_url);
            return (
              <Card key={service.id} className="overflow-hidden h-full service-card">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image src={imageUrl} alt={service.title} fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="mb-4 space-y-2">
                    {service.features.slice(0, 3).map((feature: any, idx: number) => (
                      <li key={idx} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                        {typeof feature === 'string' ? feature : feature.description}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${service.id}`}
                    className="text-primary font-medium inline-flex items-center hover:underline"
                  >
                    Learn More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {/* Process section */}
        <div className="bg-muted/30 rounded-lg p-8 md:p-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We follow a streamlined process to ensure your flooring project is completed efficiently and to the
              highest standards.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Consultation",
                description: "We discuss your needs, preferences, and budget to determine the best flooring solution.",
              },
              {
                step: 2,
                title: "Measurement & Quote",
                description: "We measure your space and provide a detailed quote with no hidden costs.",
              },
              {
                step: 3,
                title: "Installation",
                description: "Our expert team installs your new flooring with precision and attention to detail.",
              },
              {
                step: 4,
                title: "Final Inspection",
                description: "We conduct a thorough inspection to ensure everything meets our high standards.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        {/* CTA section */}
        <div className="bg-primary text-primary-foreground rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Contact us today for a free consultation and quote. Our team of experts is ready to help you choose the
            perfect flooring solution for your space.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" className="font-medium" asChild>
              <Link href="/contact">Get a Free Quote</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground font-medium"
              asChild
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
