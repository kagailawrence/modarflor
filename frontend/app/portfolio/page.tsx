"use client";
import React, { useState, useEffect } from "react";
import PortfolioClient from "./PortfolioClient";
import { BASE_URL } from "@/lib/baseUrl";

export default function PortfolioPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [pageError, setPageError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/projects`);
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(
          Array.isArray(data.data)
            ? data.data.map((p: any) => ({ ...p, id: String(p.id) }))
            : []
        );
      } catch (err: any) {
        setPageError(err?.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">Loading...</div>
    );
  }
  if (pageError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p className="text-red-500 text-xl mb-4">Error: {pageError}</p>
        <p className="text-muted-foreground">Please try again later.</p>
        {/* Remove the button for static export compatibility */}
      </div>
    );
  }
  return <PortfolioClient projects={projects} />;
}
