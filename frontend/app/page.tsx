import HeroSection from "@/components/home/hero-section"
import StatsSection from "@/components/home/stats-section"
import FeaturedProjects from "@/components/home/featured-projects"
import ServicesSection from "@/components/home/services-section"
import TestimonialsSection from "@/components/home/testimonials-section"
import CTASection from "@/components/home/cta-section"

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <StatsSection />
      <FeaturedProjects />
      <ServicesSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
