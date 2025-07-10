import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import { query } from "../database/connection"
import { catchAsync, AppError } from "../middleware/errorHandler"
import { validateUser } from "../utils/validation"

// Get all users (admin only)
export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  // Check if user is admin
  if (req.user?.role !== "Admin") {
    throw new AppError("Unauthorized: Admin access required", 403)
  }

  const result = await query(
    `SELECT id, email, name, role, created_at, updated_at FROM users ORDER BY created_at DESC`
  )

  res.json(result.rows)
})

// Get user by ID (admin or self)
export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  // Check if user is admin or requesting their own data
  if (req.user?.role !== "Admin" && req.user?.id !== id) {
    throw new AppError("Unauthorized: You can only access your own data", 403)
  }

  const result = await query(
    `SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = $1`,
    [id]
  )
  const user = result.rows[0]

  if (!user) {
    throw new AppError("User not found", 404)
  }

  res.json(user)
})

// Create new user (admin only)
export const createUser = catchAsync(async (req: Request, res: Response) => {
  // Check if user is admin
  if (req.user?.role !== "Admin") {
    throw new AppError("Unauthorized: Admin access required", 403)
  }

  // Validate input
  const { error } = validateUser(req.body)
  if (error) {
    throw new AppError(error.details[0].message, 400)
  }

  const { email, password, name, role } = req.body

  // Check if user already exists
  const existing = await query(`SELECT * FROM users WHERE email = $1`, [email])

  if (existing && existing.rowCount && existing.rowCount > 0) {
    throw new AppError("User with this email already exists", 400)
  }

  // Hash password
  const salt = await bcrypt.genSalt(12)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const result = await query(
    `INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at, updated_at`,
    [email, hashedPassword, name, role || "Viewer"]
  )

  res.status(201).json(result.rows[0])
})

// Update user (admin or self)
export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  // Check if user is admin or updating their own data
  if (req.user?.role !== "Admin" && req.user?.id !== id) {
    throw new AppError("Unauthorized: You can only update your own data", 403)
  }

  const { name, email, role, password } = req.body

  // Check if user exists
  const existing = await query(`SELECT * FROM users WHERE id = $1`, [id])

  if (existing.rowCount === 0) {
    throw new AppError("User not found", 404)
  }

  // Prepare update data
  const updateData: any = {}

  if (name) updateData.name = name
  if (email) updateData.email = email
  if (role && req.user?.role === "Admin") updateData.role = role

  let hashedPassword
  // If password is provided, hash it
  if (password) {
    const salt = await bcrypt.genSalt(12)
    hashedPassword = await bcrypt.hash(password, salt)
  }
  let queryStr;
  let params;
  if (password) {
    queryStr = `UPDATE users SET name = $1, email = $2, role = $3::text, password = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING id, email, name, role, created_at, updated_at`;
    params = [name || existing.rows[0].name, email || existing.rows[0].email, role || existing.rows[0].role, hashedPassword, id];
  } else {
    queryStr = `UPDATE users SET name = $1, email = $2, role = $3::text, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, email, name, role, created_at, updated_at`;
    params = [name || existing.rows[0].name, email || existing.rows[0].email, role || existing.rows[0].role, id];
  }
  const result = await query(queryStr, params);

  res.json(result.rows[0])
})

// Delete user (admin only)
export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  // Check if user is admin
  if (req.user?.role !== "Admin") {
    throw new AppError("Unauthorized: Admin access required", 403)
  }

  // Prevent deleting yourself
  if (req.user?.id === id) {
    throw new AppError("You cannot delete your own account", 400)
  }

  // Check if user exists
  const existing = await query(`SELECT * FROM users WHERE id = $1`, [id])

  if (existing.rowCount === 0) {
    throw new AppError("User not found", 404)
  }

  // Delete user
  await query(`DELETE FROM users WHERE id = $1`, [id])

  res.json({ message: "User deleted successfully" })
})
