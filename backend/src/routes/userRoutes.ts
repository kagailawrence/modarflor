import express from "express"
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController"
import { authorize } from "../middleware/auth"

const router = express.Router()

// All routes are protected
// Get all users (admin only)
router.get("/", authorize(["Admin"]), getAllUsers)

// Get user by ID (admin or self)
// For admin panel context, restricting to Admin for viewing any user by ID.
// Self-viewing is typically via /api/auth/me or similar.
router.get("/:id", authorize(["Admin"]), getUserById)

// Create user (admin only)
router.post("/", authorize(["Admin"]), createUser)

// Update user (admin or self)
// For admin panel context, Admin can update any user.
// Self-update would be via a different route or controller logic.
router.put("/:id", authorize(["Admin"]), updateUser)

// Delete user (admin only)
router.delete("/:id", authorize(["Admin"]), deleteUser)

export default router
