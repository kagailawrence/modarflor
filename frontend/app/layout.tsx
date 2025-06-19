import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { ThemeProvider } from "@/components/theme-provider"
import WhatsAppFloater from "@/components/whatsapp-floater"
import PublicLayout from "@/components/layout/PublicLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ModarFlor | Premium Floor Decoration Solutions",
  description: "Professional floor decoration services including epoxy, tiles, carpet and more.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <PublicLayout>{children}</PublicLayout>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
