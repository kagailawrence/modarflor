import type { Request, Response } from "express"
import { prisma } from "../prismaClient"
import { catchAsync, AppError } from "../middleware/errorHandler"
import { validateTestimonial } from "../utils/validation"

// Get all testimonials with pagination
export const getAllTestimonials = catchAsync(async (req: Request, res: Response) => {
  const page = Number.parseInt(req.query.page as string) || 1
  const limit = Number.parseInt(req.query.limit as string) || 10
  const skip = (page - 1) * limit

  const [testimonials, total] = await Promise.all([
    prisma.testimonial.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.testimonial.count(),
  ])

  // Calculate pagination info
  const totalPages = Math.ceil(total / limit)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  res.json({
    data: testimonials,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  })
})

// Get testimonial by ID
export const getTestimonialById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  })

  if (!testimonial) {
    throw new AppError("Testimonial not found", 404)
  }

  res.json(testimonial)
})

// Create new testimonial
export const createTestimonial = catchAsync(async (req: Request, res: Response) => {
  // Validate input
  const { error } = validateTestimonial(req.body)
  if (error) {
    throw new AppError(error.details[0].message, 400)
  }

  const { name, role, content, rating, imageUrl } = req.body

  const testimonial = await prisma.testimonial.create({
    data: {
      name,
      role,
      content,
      rating,
      imageUrl,
    },
  })

  res.status(201).json(testimonial)
})

// Update testimonial
export const updateTestimonial = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  // Validate input
  const { error } = validateTestimonial(req.body)
  if (error) {
    throw new AppError(error.details[0].message, 400)
  }

  const { name, role, content, rating, imageUrl } = req.body

  // Check if testimonial exists
  const existingTestimonial = await prisma.testimonial.findUnique({
    where: { id },
  })

  if (!existingTestimonial) {
    throw new AppError("Testimonial not found", 404)
  }

  // Update testimonial
  const updatedTestimonial = await prisma.testimonial.update({
    where: { id },
    data: {
      name,
      role,
      content,
      rating,
      imageUrl,
    },
  })

  res.json(updatedTestimonial)
})

// Delete testimonial
export const deleteTestimonial = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  // Check if testimonial exists
  const existingTestimonial = await prisma.testimonial.findUnique({
    where: { id },
  })

  if (!existingTestimonial) {
    throw new AppError("Testimonial not found", 404)
  }

  // Delete testimonial
  await prisma.testimonial.delete({
    where: { id },
  })

  res.json({ message: "Testimonial deleted successfully" })
})

// Get featured testimonials
export const getFeaturedTestimonials = catchAsync(async (req: Request, res: Response) => {
  const limit = Number.parseInt(req.query.limit as string) || 5

  const testimonials = await prisma.testimonial.findMany({
    where: {
      rating: {
        gte: 4, // Get testimonials with rating >= 4
      },
    },
    take: limit,
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
  })

  res.json(testimonials)
})
