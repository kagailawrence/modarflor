"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen, MessageSquare, Settings, Users, TrendingUp, Eye, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "react-day-picker";

interface RecentProject {
  id: number;
  title: string;
  category: string;
}

interface RecentTestimonial {
  id: number;
  name: string;
  rating: number;
}

interface DashboardStats {
  totalProjects: number;
  totalServices: number;
  totalTestimonials: number;
  totalUsers: number;
  recentProjects: RecentProject[];
  recentTestimonials: RecentTestimonial[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalServices: 0,
    totalTestimonials: 0,
    totalUsers: 0,
    recentProjects: [],
    recentTestimonials: [],
  })

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    // Fetch dashboard stats
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        // This should be caught by AdminLayout, but as a safeguard:
        setError("Not authenticated");
        // router.push("/admin/login"); // Or redirect
        return;
      }

      // EXAMPLE: Replace with actual API call(s)
      // const response = await fetch(`${BASE_URL}/api/admin/dashboard-stats`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // if (!response.ok) throw new Error("Failed to fetch stats");
      // const data = await response.json();
      // setStats(data);

      // Using mock data as backend endpoint for stats doesn't exist yet
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      setStats({
        totalProjects: 24,
        totalServices: 6,
        totalTestimonials: 18,
        totalUsers: 3, // This would come from an authenticated user count endpoint
        recentProjects: [
          { id: 1, title: "Modern Epoxy Garage Floor", category: "Residential" },
          { id: 2, title: "Luxury Tile Bathroom", category: "Residential" },
          { id: 3, title: "Commercial Office Carpet", category: "Commercial" },
        ],
        recentTestimonials: [
          { id: 1, name: "Amina Njoroge", rating: 5 },
          { id: 2, name: "Brian Otieno", rating: 4 },
          { id: 3, name: "Wanjiku Kamau", rating: 5 },
        ],
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: FolderOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Services",
      value: stats.totalServices,
      icon: Settings,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Testimonials",
      value: stats.totalTestimonials,
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]
  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2">Loading dashboard...</p></div>;
  }

  if (error) {
    return <div className="p-6 text-center"><AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" /><h2 className="text-xl font-semibold text-red-600">Error Loading Dashboard</h2><p>{error}</p><Button onClick={fetchDashboardStats} className="mt-4">Try Again</Button></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ModarFlor Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the ModaFlor admin dashboard. Manage all your projects, services, testimonials, users, and more from one place.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Recent ModaFlor Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentProjects.map((project: any) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{project.title}</p>
                    <p className="text-sm text-muted-foreground">{project.category}</p>
                  </div>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Recent ModaFlor Testimonials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentTestimonials.map((testimonial: any) => (
                <div key={testimonial.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-500">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
