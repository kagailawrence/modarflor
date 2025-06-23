"use client";
import React, { useState, useEffect } from "react";
import { BASE_URL } from "@/lib/baseUrl";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/faqs`);
        if (!res.ok) throw new Error("Failed to fetch FAQs");
        setFaqs(await res.json());
      } catch (err: any) {
        setError(err?.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-40">Loading...</div>;
  }
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p className="text-red-500 text-xl mb-4">Error: {error}</p>
        <p className="text-muted-foreground">Please try refreshing the page or contact support if the problem persists.</p>
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <ul className="space-y-6">
        {faqs.map((faq) => (
          <li key={faq.id} className="bg-white p-4 rounded shadow">
            <div className="font-semibold mb-2">Q: {faq.question}</div>
            <div className="text-gray-700">A: {faq.answer}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
