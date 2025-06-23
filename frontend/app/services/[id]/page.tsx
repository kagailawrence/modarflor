import { getImageUrl } from "@/lib/getImageUrl";
import { BASE_URL } from "@/lib/baseUrl";
import Link from "next/link";
import ServiceImageClient from "../ServiceImageClient";

interface ServiceDetailProps {
  params: { id: string }
}

export default async function ServiceDetailPage({ params }: ServiceDetailProps) {
  let service: any = null;
  let error: string | null = null;
  try {
    const res = await fetch(`${BASE_URL}/api/services/${params.id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Service not found");
    service = await res.json();
  } catch (err: any) {
    error = err?.message || "An unknown error occurred";
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Service Not Found</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Link href="/services" className="text-primary underline">← Back to Services</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Link href="/services" className="text-primary underline mb-6 inline-block">← Back to Services</Link>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <ServiceImageClient
          src={service.image_url}
          alt={service.title}
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
          <p className="text-muted-foreground mb-4">{service.description}</p>
          {service.features && service.features.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Key Features:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {service.features.map((feature: any, idx: number) => (
                  <li key={idx}>{typeof feature === 'string' ? feature : feature.description}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Service Process Section - full width */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-muted/30 rounded-lg p-8 md:p-12">
        <h2 className="text-2xl font-bold mb-4 text-center">Our Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
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
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
