import express from "express"
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController"
import { authorize } from "../middleware/auth"

const router = express.Router()

// All routes are protected
// Get all users (admin only)
router.get("/", authorize(["Admin"]), getAllUsers)

// Get user by ID (admin or self)
router.get("/:id", getUserById)

// Create user (admin only)
router.post("/", authorize(["Admin"]), createUser)

// Update user (admin or self)
router.put("/:id", updateUser)

// Delete user (admin only)
router.delete("/:id", authorize(["Admin"]), deleteUser)

export default router
