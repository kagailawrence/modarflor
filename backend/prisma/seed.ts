import bcrypt from "bcrypt"
import { query } from "../src/database/connection"

async function main() {
  console.log("Seeding database with raw SQL...")

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12)
  await query(
    `INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW()) ON CONFLICT (email) DO NOTHING`,
    ["admin@ModarFlor.com", adminPassword, "Admin User", "Admin"]
  )
  console.log("Inserted admin user")

  // Create viewer user
  const viewerPassword = await bcrypt.hash("viewer123", 12)
  await query(
    `INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW()) ON CONFLICT (email) DO NOTHING`,
    ["viewer@ModarFlor.com", viewerPassword, "Viewer User", "Viewer"]
  )
  console.log("Inserted viewer user")

  // Create services
  const services = [
    ["Epoxy Flooring", "Durable, seamless, and customizable epoxy floors for garages, basements, and commercial spaces.", "https://example.com/images/epoxy.jpg", 1],
    ["Tile Installation", "Expert installation of ceramic, porcelain, and natural stone tiles for any room in your home or business.", "https://example.com/images/tile.jpg", 2],
    ["Carpet Installation", "Professional carpet installation with a wide range of styles, colors, and textures to choose from.", "https://example.com/images/carpet.jpg", 3],
  ]
  for (const [title, description, imageUrl, order] of services) {
    await query(
      `INSERT INTO "Service" (id, title, description, "imageUrl", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW()) ON CONFLICT (title) DO NOTHING`,
      [title, description, imageUrl]
    )
    console.log("Inserted service:", title)
  }

  // Create testimonials
  const testimonials = [
    ["Amina Njoroge", "Homeowner", "ModarFlor transformed our outdated kitchen with beautiful tile flooring. The team was professional, efficient, and the results exceeded our expectations!", 5],
    ["Brian Otieno", "Business Owner", "We hired ModarFlor for our restaurant renovation. Their epoxy flooring solution was perfect - durable, easy to clean, and looks amazing. Highly recommend!", 5],
    ["Grace Wambui", "Interior Designer", "As an interior designer, I've worked with many flooring companies, but ModarFlor stands out. Their attention to detail and quality craftsmanship is unmatched.", 5],
  ]
  for (const [name, role, content, rating] of testimonials) {
    await query(
      `INSERT INTO "Testimonial" (id, name, role, content, rating, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())`,
      [name, role, content, rating]
    )
    console.log("Inserted testimonial from:", name)
  }

  // Create projects (basic, without images for simplicity)
  const projects = [
    ["Modern Epoxy Garage Floor", "A sleek, durable epoxy floor installation for a modern home garage.", "Residential", "Epoxy"],
    ["Luxury Tile Bathroom", "Custom tile design and installation for a luxury master bathroom.", "Residential", "Tile"],
    ["Commercial Office Carpet", "High-traffic carpet installation for a corporate office space.", "Commercial", "Carpet"],
  ]
  for (const [title, description, category, type] of projects) {
    await query(
      `INSERT INTO "Project" (id, title, description, category, type, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW()) ON CONFLICT (title) DO NOTHING`,
      [title, description, category, type]
    )
    console.log("Inserted project:", title)
  }

  console.log("Raw SQL database seeding completed!")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
