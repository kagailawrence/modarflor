import type { Request, Response } from "express"
import { query } from "../database/connection"
import { catchAsync, AppError } from "../middleware/errorHandler"
import { validateTestimonial } from "../utils/validation"

// Get all testimonials with pagination
export const getAllTestimonials = catchAsync(async (req: Request, res: Response) => {
  const page = Number.parseInt(req.query.page as string) || 1
  const limit = Number.parseInt(req.query.limit as string) || 10
  const offset = (page - 1) * limit

  const [testimonialsResult, countResult] = await Promise.all([
    query(
      `SELECT * FROM testimonials ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    ),
    query(`SELECT COUNT(*) as total FROM testimonials`),
  ])

  const testimonials = testimonialsResult.rows
  const total = Number.parseInt(countResult.rows[0].total)
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
  const result = await query(`SELECT * FROM testimonials WHERE id = $1`, [id])
  const testimonial = result.rows[0]
  if (!testimonial) throw new AppError("Testimonial not found", 404)
  res.json(testimonial)
})

// Create new testimonial
export const createTestimonial = catchAsync(async (req: Request, res: Response) => {
  const { error } = validateTestimonial(req.body)
  if (error) throw new AppError(error.details[0].message, 400)
  const { name, role, content, rating, imageUrl } = req.body
  const result = await query(
    `INSERT INTO testimonials (name, role, content, rating, image_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, role, content, rating, imageUrl]
  )
  res.status(201).json(result.rows[0])
})

// Update testimonial
export const updateTestimonial = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { error } = validateTestimonial(req.body)
  if (error) throw new AppError(error.details[0].message, 400)
  const { name, role, content, rating, imageUrl } = req.body
  // Check if testimonial exists
  const existing = await query(`SELECT * FROM testimonials WHERE id = $1`, [id])
  if (existing.rowCount === 0) throw new AppError("Testimonial not found", 404)
  const result = await query(
    `UPDATE testimonials SET name = $1, role = $2, content = $3, rating = $4, image_url = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *`,
    [name, role, content, rating, imageUrl, id]
  )
  res.json(result.rows[0])
})

// Delete testimonial
export const deleteTestimonial = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const existing = await query(`SELECT * FROM testimonials WHERE id = $1`, [id])
  if (existing.rowCount === 0) throw new AppError("Testimonial not found", 404)
  await query(`DELETE FROM testimonials WHERE id = $1`, [id])
  res.json({ message: "Testimonial deleted successfully" })
})

// Get featured testimonials
export const getFeaturedTestimonials = catchAsync(async (req: Request, res: Response) => {
  const limit = Number.parseInt(req.query.limit as string) || 5
  const result = await query(
    `SELECT * FROM testimonials WHERE rating >= 4 ORDER BY rating DESC, created_at DESC LIMIT $1`,
    [limit]
  )
  res.json(result.rows)
})
