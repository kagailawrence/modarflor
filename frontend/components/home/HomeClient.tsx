"use client";

import dynamic from "next/dynamic";
import FeaturedProjects from "./featured-projects";
import ServicesSection from "./services-section";
import TestimonialsSection from "./testimonials-section";

// WhatsApp floater must be dynamically imported with ssr: false
const WhatsAppFloater = dynamic(() => import("../whatsapp-floater"), { ssr: false });

export default function HomeClient() {
    return (
        <>
            <FeaturedProjects />
            <ServicesSection />
            <TestimonialsSection />
            <WhatsAppFloater />
        </>
    );
}
