import type { Request, Response } from "express"
import bcrypt from "bcrypt"
import { prisma } from "../prismaClient"
import { catchAsync, AppError } from "../middleware/errorHandler"
import { validateUser } from "../utils/validation"

// Get all users (admin only)
export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  // Check if user is admin
  if (req.user?.role !== "Admin") {
    throw new AppError("Unauthorized: Admin access required", 403)
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  })

  res.json(users)
})

// Get user by ID (admin or self)
export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  // Check if user is admin or requesting their own data
  if (req.user?.role !== "Admin" && req.user?.id !== id) {
    throw new AppError("Unauthorized: You can only access your own data", 403)
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  })

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
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new AppError("User with this email already exists", 400)
  }

  // Hash password
  const salt = await bcrypt.genSalt(12)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: role || "Viewer",
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  res.status(201).json(user)
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
  const existingUser = await prisma.user.findUnique({
    where: { id },
  })

  if (!existingUser) {
    throw new AppError("User not found", 404)
  }

  // Prepare update data
  const updateData: any = {}

  if (name) updateData.name = name
  if (email) updateData.email = email

  // Only admin can change roles
  if (role && req.user?.role === "Admin") {
    updateData.role = role
  }

  // If password is provided, hash it
  if (password) {
    const salt = await bcrypt.genSalt(12)
    updateData.password = await bcrypt.hash(password, salt)
  }

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  res.json(updatedUser)
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
  const existingUser = await prisma.user.findUnique({
    where: { id },
  })

  if (!existingUser) {
    throw new AppError("User not found", 404)
  }

  // Delete user
  await prisma.user.delete({
    where: { id },
  })

  res.json({ message: "User deleted successfully" })
})
