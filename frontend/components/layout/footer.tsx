import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Footer = () => {
  return (
    <footer className="bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
             <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">Modar<span className="text-2xl font-light">Flor</span></span>
          
        </Link>
            <p className="text-muted-foreground">
              Premium floor decoration solutions for residential and commercial spaces.
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/profile.php?id=61577072133625" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="https://www.instagram.com/modaflor_ke/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="https://www.tiktok.com/@modaflorke?lang=en-GB" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="#010101" className="h-5 w-5">
                  <path d="M12.004 2.003c-5.523 0-10 4.477-10 10 0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18.182c-4.517 0-8.182-3.665-8.182-8.182 0-4.517 3.665-8.182 8.182-8.182 4.517 0 8.182 3.665 8.182 8.182 0 4.517-3.665 8.182-8.182 8.182zm2.727-7.273c-.6 0-1.09-.49-1.09-1.09v-3.636h-1.818v7.273c0 .6-.49 1.09-1.09 1.09s-1.09-.49-1.09-1.09.49-1.09 1.09-1.09c.6 0 1.09.49 1.09 1.09v-2.182c0-.6.49-1.09 1.09-1.09s1.09.49 1.09 1.09v2.182c0 .6-.49 1.09-1.09 1.09z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {["Services", "Portfolio", "About Us", "Testimonials", "FAQs"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Summit House Moi Avenue, Room M9</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground">+254-722 843995</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground">info@ModarFlor.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Newsletter</h3>
            <p className="text-muted-foreground">Subscribe to our newsletter for the latest updates and offers.</p>
            <form className="space-y-2">
              <Input type="email" placeholder="Your email address" className="bg-background" required />
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-6 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()}  ModarFlor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
