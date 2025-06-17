import bcrypt from "bcrypt"
import { query } from "../src/database/connection"

async function main() {
  console.log("Seeding database...")

  try {
    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 12)
    await query(
      `
      INSERT INTO users (email, password, name, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `,
      ["admin@ModarFlor.com", adminPassword, "Admin User", "Admin"],
    )
    console.log("Created admin user")

    // Create viewer user
    const viewerPassword = await bcrypt.hash("viewer123", 12)
    await query(
      `
      INSERT INTO users (email, password, name, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `,
      ["viewer@ModarFlor.com", viewerPassword, "Viewer User", "Viewer"],
    )
    console.log("Created viewer user")

    // Create services
    const services = [
      {
        title: "Epoxy Flooring",
        description: "Durable, seamless, and customizable epoxy floors for garages, basements, and commercial spaces.",
        imageUrl: "https://example.com/images/epoxy.jpg",
        order: 1,
        features: [
          "Stain Resistant",
          "Easy to Clean",
          "Customizable Designs",
          "Long-Lasting",
          "Chemical Resistant",
          "Seamless Application",
        ],
      },
      {
        title: "Tile Installation",
        description:
          "Expert installation of ceramic, porcelain, and natural stone tiles for any room in your home or business.",
        imageUrl: "https://example.com/images/tile.jpg",
        order: 2,
        features: [
          "Custom Patterns",
          "Waterproof Options",
          "Heated Floors",
          "Wide Selection",
          "Precision Cutting",
          "Professional Grouting",
        ],
      },
      {
        title: "Carpet Installation",
        description:
          "Professional carpet installation with a wide range of styles, colors, and textures to choose from.",
        imageUrl: "https://example.com/images/carpet.jpg",
        order: 3,
        features: [
          "Stain Protection",
          "Pet-Friendly Options",
          "Sound Insulation",
          "Comfort",
          "Professional Stretching",
          "Quality Padding",
        ],
      },
    ]

    for (const service of services) {
      const serviceResult = await query(
        `
        INSERT INTO services (title, description, image_url, order_index)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `,
        [service.title, service.description, service.imageUrl, service.order],
      )

      const serviceId = serviceResult.rows[0].id

      for (const feature of service.features) {
        await query(
          `
          INSERT INTO service_features (service_id, description)
          VALUES ($1, $2)
        `,
          [serviceId, feature],
        )
      }

      console.log("Created service:", service.title)
    }

    // Create projects
    const projects = [
      {
        title: "Modern Epoxy Garage Floor",
        description: "A sleek, durable epoxy floor installation for a modern home garage.",
        category: "Residential",
        type: "Epoxy",
        images: [
          {
            url: "https://example.com/images/projects/garage1.jpg",
            alt: "Modern epoxy garage floor",
            isFeatured: true,
          },
          {
            url: "https://example.com/images/projects/garage2.jpg",
            alt: "Close-up of epoxy finish",
            isFeatured: false,
          },
        ],
      },
      {
        title: "Luxury Tile Bathroom",
        description: "Custom tile design and installation for a luxury master bathroom.",
        category: "Residential",
        type: "Tile",
        images: [
          {
            url: "https://example.com/images/projects/bathroom1.jpg",
            alt: "Luxury tile bathroom",
            isFeatured: true,
          },
          {
            url: "https://example.com/images/projects/bathroom2.jpg",
            alt: "Custom shower tile work",
            isFeatured: false,
          },
        ],
      },
      {
        title: "Commercial Office Carpet",
        description: "High-traffic carpet installation for a corporate office space.",
        category: "Commercial",
        type: "Carpet",
        images: [
          {
            url: "https://example.com/images/projects/office1.jpg",
            alt: "Commercial office carpet",
            isFeatured: true,
          },
          {
            url: "https://example.com/images/projects/office2.jpg",
            alt: "Office hallway carpet",
            isFeatured: false,
          },
        ],
      },
    ]

    for (const project of projects) {
      const projectResult = await query(
        `
        INSERT INTO projects (title, description, category, type)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `,
        [project.title, project.description, project.category, project.type],
      )

      const projectId = projectResult.rows[0].id

      for (const image of project.images) {
        await query(
          `
          INSERT INTO project_images (project_id, url, alt, is_featured)
          VALUES ($1, $2, $3, $4)
        `,
          [projectId, image.url, image.alt, image.isFeatured],
        )
      }

      console.log("Created project:", project.title)
    }

    // Create testimonials
    const testimonials = [
      {
        name: "Sarah Johnson",
        role: "Homeowner",
        content:
          " ModarFlor transformed our outdated kitchen with beautiful tile flooring. The team was professional, efficient, and the results exceeded our expectations!",
        rating: 5,
        imageUrl: "https://example.com/images/testimonials/sarah.jpg",
      },
      {
        name: "Michael Chen",
        role: "Business Owner",
        content:
          "We hired  ModarFlor for our restaurant renovation. Their epoxy flooring solution was perfect - durable, easy to clean, and looks amazing. Highly recommend!",
        rating: 5,
        imageUrl: "https://example.com/images/testimonials/michael.jpg",
      },
      {
        name: "Emily Rodriguez",
        role: "Interior Designer",
        content:
          "As an interior designer, I've worked with many flooring companies, but  ModarFlor stands out. Their attention to detail and quality craftsmanship is unmatched.",
        rating: 5,
        imageUrl: "https://example.com/images/testimonials/emily.jpg",
      },
    ]

    for (const testimonial of testimonials) {
      await query(
        `
        INSERT INTO testimonials (name, role, content, rating, image_url)
        VALUES ($1, $2, $3, $4, $5)
      `,
        [testimonial.name, testimonial.role, testimonial.content, testimonial.rating, testimonial.imageUrl],
      )

      console.log("Created testimonial from:", testimonial.name)
    }

    console.log("Database seeding completed!")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

main()
