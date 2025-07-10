import HeroSection from "@/components/home/hero-section"
import StatsSection from "@/components/home/stats-section"
import CTASection from "@/components/home/cta-section"
import HomeClient from "@/components/home/HomeClient"
import WhyChooseUsSection from "@/components/home/why-choose-us-section"

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <StatsSection />
      <WhyChooseUsSection />
      <HomeClient />
      <CTASection />
    </div>
  )
}
