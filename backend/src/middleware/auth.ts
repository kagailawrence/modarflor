import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { query } from "../database/connection"

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: string
      }
    }
  }
}

// JWT authentication middleware
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" })
  }

  const token = authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Token missing" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as {
      id: string
      email: string
      role: string
    }

    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" })
  }
}

// Role-based authorization middleware
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" })
    }

    next()
  }
}

// Refresh token middleware
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" })
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "refresh_secret") as {
      id: string
    }

    // Find the user using raw SQL
    const result = await query("SELECT id, email, role FROM users WHERE id = $1", [decoded.id])
    const user = result.rows[0]

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Generate new tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1d" },
    )

    const newRefreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET || "refresh_secret", {
      expiresIn: "7d",
    })

    return res.json({
      accessToken,
      refreshToken: newRefreshToken,
    })
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" })
  }
}
