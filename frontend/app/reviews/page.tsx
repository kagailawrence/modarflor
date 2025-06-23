"use client"
import React, { useState, useEffect } from "react";
import ReviewsClient from "./ReviewsClient";
import { BASE_URL } from "@/lib/baseUrl";

export default function ReviewsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [pageError, setPageError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/testimonials`);
        if (!response.ok) throw new Error("Failed to fetch testimonials");
        setTestimonials(await response.json());
      } catch (err: any) {
        setPageError(err?.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-40">Loading...</div>;
  }
  if (pageError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p className="text-red-500 text-xl mb-4">Error: {pageError}</p>
        <p className="text-muted-foreground">
          Could not load customer reviews. Please try again later.
        </p>
      </div>
    );
  }
  return <ReviewsClient testimonials={testimonials} />;
}
