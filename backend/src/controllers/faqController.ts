import type { Request, Response } from "express"
import { query } from "../database/connection"
import { catchAsync, AppError } from "../middleware/errorHandler"

// Get all FAQs
export const getAllFaqs = catchAsync(async (_req: Request, res: Response) => {
  const result = await query("SELECT * FROM faqs ORDER BY order_index ASC, created_at DESC")
  res.json(result.rows)
})

// Get FAQ by ID
export const getFaqById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await query("SELECT * FROM faqs WHERE id = $1", [id])
  if (result.rows.length === 0) throw new AppError("FAQ not found", 404)
  res.json(result.rows[0])
})

// Create FAQ
export const createFaq = catchAsync(async (req: Request, res: Response) => {
  const { question, answer, order_index } = req.body
  if (!question || !answer) throw new AppError("Question and answer are required", 400)
  const result = await query(
    "INSERT INTO faqs (question, answer, order_index) VALUES ($1, $2, $3) RETURNING *",
    [question, answer, order_index || 0]
  )
  res.status(201).json(result.rows[0])
})

// Update FAQ
export const updateFaq = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { question, answer, order_index } = req.body
  const existing = await query("SELECT * FROM faqs WHERE id = $1", [id])
  if (existing.rows.length === 0) throw new AppError("FAQ not found", 404)
  const result = await query(
    "UPDATE faqs SET question = $1, answer = $2, order_index = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
    [question, answer, order_index || 0, id]
  )
  res.json(result.rows[0])
})

// Delete FAQ
export const deleteFaq = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const existing = await query("SELECT * FROM faqs WHERE id = $1", [id])
  if (existing.rows.length === 0) throw new AppError("FAQ not found", 404)
  await query("DELETE FROM faqs WHERE id = $1", [id])
  res.json({ message: "FAQ deleted successfully" })
})
