import express from "express"
import { register, login, getCurrentUser, changePassword } from "../controllers/authController"
import { authenticateJWT, refreshToken } from "../middleware/auth"

const router = express.Router()

// Public routes
router.post("/register", register)
router.post("/login", login)
router.post("/refresh-token", refreshToken)

// Protected routes
router.get("/me", authenticateJWT, getCurrentUser)
router.post("/change-password", authenticateJWT, changePassword)

export default router
