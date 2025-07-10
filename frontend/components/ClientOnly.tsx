"use client"
import dynamic from "next/dynamic"
import { Suspense } from "react"

export default function ClientOnly({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
