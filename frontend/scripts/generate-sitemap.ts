import fs from "fs"
import path from "path"

const BASE_URL = process.env.SITE_URL || "https://modarflor.com" // Change to your production URL

async function fetchAPI(endpoint: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}${endpoint}`)
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`)
  return res.json()
}

async function generateSitemap() {
  // Static routes
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/faq",
    "/services",
    "/portfolio",
    "/reviews",
    "/warranty",
    "/quote",
    "/blog",
    "/gallery"
  ]

  // Dynamic content
  let projectRoutes: string[] = []
  let serviceRoutes: string[] = []
  let faqRoutes: string[] = []
  try {
    const projects = await fetchAPI("/api/projects")
    if (Array.isArray(projects.data)) {
      projectRoutes = projects.data.map((p: any) => `/portfolio/${p.id}`)
    }
    const services = await fetchAPI("/api/services")
    if (Array.isArray(services.data)) {
      serviceRoutes = services.data.map((s: any) => `/services/${s.id}`)
    }
    const faqs = await fetchAPI("/api/faqs")
    if (Array.isArray(faqs)) {
      faqRoutes = faqs.map((f: any) => `/faq#faq-${f.id}`)
    }
  } catch (e) {
    console.error("Error fetching dynamic content for sitemap:", e)
  }

  const allRoutes = [
    ...staticRoutes,
    ...projectRoutes,
    ...serviceRoutes,
    ...faqRoutes
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${
    allRoutes
      .map(
        (route) =>
          `  <url>\n    <loc>${BASE_URL}${route}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
      )
      .join("\n")
  }\n</urlset>`

  const outPath = path.join(process.cwd(), "public", "sitemap.xml")
  fs.writeFileSync(outPath, sitemap)
  console.log("Sitemap generated at:", outPath)
}

generateSitemap()
