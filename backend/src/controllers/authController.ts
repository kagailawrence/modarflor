import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "../database/connection"
import { catchAsync, AppError } from "../middleware/errorHandler"
import { validateRegistration, validateLogin } from "../utils/validation"

// Register a new user
export const register = catchAsync(async (req: Request, res: Response) => {
  // Validate input
  const { error } = validateRegistration(req.body)
  if (error) {
    throw new AppError(error.details[0].message, 400)
  }

  const { email, password, name } = req.body

  // Check if user already exists
  const existingUser = await query("SELECT id FROM users WHERE email = $1", [email])
  if (existingUser.rows.length > 0) {
    throw new AppError("User with this email already exists", 400)
  }

  // Hash password
  const salt = await bcrypt.genSalt(12)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const userQuery = `
    INSERT INTO users (email, password, name, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, name, role, created_at
  `
  const result = await query(userQuery, [email, hashedPassword, name, "Viewer"])
  const user = result.rows[0]

  // Generate tokens
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: "2d" },
  )

  const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET || "refresh_secret", {
    expiresIn: "7d",
  })

  res.status(201).json({
    user,
    accessToken,
    refreshToken,
  })
})

// Login user
export const login = catchAsync(async (req: Request, res: Response) => {
  // Validate input
  console.log("Validating login input")
  const { error } = validateLogin(req.body)
  if (error) {
    throw new AppError(error.details[0].message, 400)
  }

  const { email, password } = req.body

  // Find user
  const userQuery = "SELECT * FROM users WHERE email = $1"
  const result = await query(userQuery, [email])

  if (result.rows.length === 0) {
    throw new AppError("Invalid email or password", 401)
  }

  const user = result.rows[0]

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401)
  }

  // Generate tokens
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: "2d" },
  )

  const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET || "refresh_secret", {
    expiresIn: "7d",
  })

  // Return user data without password
  const { password: _, ...userWithoutPassword } = user

  res.json({
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  })
})

// Get current user
export const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Not authenticated", 401)
  }

  const userQuery = `
    SELECT id, email, name, role, created_at, updated_at
    FROM users 
    WHERE id = $1
  `
  const result = await query(userQuery, [req.user.id])

  if (result.rows.length === 0) {
    throw new AppError("User not found", 404)
  }

  res.json(result.rows[0])
})

// Change password
export const changePassword = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Not authenticated", 401)
  }

  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    throw new AppError("Current password and new password are required", 400)
  }

  // Find user
  const userQuery = "SELECT password FROM users WHERE id = $1"
  const result = await query(userQuery, [req.user.id])

  if (result.rows.length === 0) {
    throw new AppError("User not found", 404)
  }

  const user = result.rows[0]

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
  if (!isPasswordValid) {
    throw new AppError("Current password is incorrect", 401)
  }

  // Hash new password
  const salt = await bcrypt.genSalt(12)
  const hashedPassword = await bcrypt.hash(newPassword, salt)

  // Update password
  await query("UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [
    hashedPassword,
    req.user.id,
  ])

  res.json({ message: "Password updated successfully" })
})
