"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LayoutDashboard, FolderOpen, MessageSquare, Settings, Users, LogOut, Menu, X, Home, AlertCircle, Layers } from "lucide-react"

const sidebarItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: FolderOpen },
  { name: "Services", href: "/admin/services", icon: Settings },
  { name: "Flooring Types", href: "/admin/flooring-types", icon: Layers },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { name: "FAQs", href: "/admin/faqs", icon: AlertCircle }, // <-- Add FAQ to sidebar
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Logs", href: "/admin/logs", icon: FolderOpen },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      const userRole = localStorage.getItem("userRole"); // Expect 'Admin', 'Editor', etc.
      const userName = localStorage.getItem("userName");
      const userEmail = localStorage.getItem("userEmail");

      if (!token || userRole !== "Admin") {
        if (pathname !== "/admin/login") {
          router.replace("/admin/login");
        }
        return;
      }

      if (pathname !== "/admin/login") {
        setUser({
          name: userName || "Admin",
          email: userEmail || "admin@example.com", // Fallback if not in localStorage
          role: userRole, // Should be "Admin" at this point
        });
      }
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setUser(null); // Clear user state
    router.push("/admin/login");
  };

  // Only render layout (sidebar, header, etc) if not on login page
  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/login/";
  if (isLoginPage) {
    return <>{children}</>; // Render login page without layout
  }

  // If still checking or no token/admin role, show loading or redirect handled by useEffect
  if (!user && !isLoginPage) {
     // This state means useEffect is either still running, or has decided to redirect.
     // Showing a generic loading can prevent flicker before redirect.
    return <div className="flex h-screen items-center justify-center">Loading admin panel...</div>;
  }

  // If user object is populated (meaning token and role are valid), render the layout
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/admin" className="flex items-center space-x-2">
            <img src="/logo.png" alt="ModarFlor Logo" className="" />
            <span className="text-xl font-light">Admin</span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="mt-6">
          <div className="px-6 mb-6">
            <Link href="/" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
              <Home className="h-4 w-4 mr-2" />
              Back to ModaFlor Website
            </Link>
          </div>

          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-6">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>

             {/* Placeholder for potential breadcrumbs or page title */}
            <div></div>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.image || "/placeholder.svg"} alt={user?.name || "User"} />
                      <AvatarFallback>
                        {user?.name
                          ? user.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()
                          : "AD"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{user?.name || "Admin"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email || ""}</p>
                  </div>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
