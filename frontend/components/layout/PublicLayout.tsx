"use client"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"

import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

const WhatsAppFloater = dynamic(() => import("@/components/whatsapp-floater"), { ssr: false })

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")
  return (
    <>
      {!isAdmin && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppFloater />}
    </>
  )
}
