"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, Phone, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "About", href: "/about" },
    {
      name: "Resources",
      href: "#",
      dropdown: [
        { name: "Blog", href: "/blog" },
        { name: "Gallery", href: "/gallery" },
        { name: "Calculator", href: "/calculator" },
        { name: "FAQ", href: "/faqs" },
        { name: "Reviews", href: "/reviews" },
        { name: "Warranty", href: "/warranty" },
      ],
    },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
        
          <span className="text-2xl font-bold text-primary">MODA<span className="text-2xl font-light">FLOR</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) =>
            link.dropdown ? (
              <DropdownMenu key={link.name}>
                <DropdownMenuTrigger className="flex items-center text-foreground/80 hover:text-primary transition-colors">
                  {link.name}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {link.dropdown.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link href={item.href}>{item.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Phone size={18} className="text-primary" />
            <span className="font-medium">+254-722 843995</span>
          </div>
          <ModeToggle />
          <Button asChild>
            <Link href="/quote">Get Quote</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4 md:hidden">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.name} className="space-y-2">
                  <span className="text-foreground/80 font-medium">{link.name}</span>
                  <div className="pl-4 space-y-2">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block text-foreground/60 hover:text-primary py-1 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-foreground/80 hover:text-primary py-2 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ),
            )}
            <div className="flex items-center space-x-2 py-2">
              <Phone size={18} className="text-primary" />
              <span className="font-medium">1-800-FLOOR-PRO</span>
            </div>
            <Button className="w-full" asChild>
              <Link href="/quote">Get Quote</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
