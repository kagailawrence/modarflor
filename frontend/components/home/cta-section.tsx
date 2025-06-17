import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Phone, Calendar } from "lucide-react"

const CTASection = () => {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Floors?</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Contact us today for a free consultation and quote. Our team of experts is ready to help you choose the
            perfect flooring solution for your space.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" className="font-medium" asChild>
              <Link href="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Get a Free Quote
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground font-medium"
              asChild
            >
              <Link href="/schedule">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Consultation
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
