import express from "express"
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getFeaturedProjects,
} from "../controllers/projectController"
import { authenticateJWT, authorize } from "../middleware/auth"

const router = express.Router()

// Public routes
router.get("/", getAllProjects)
router.get("/featured", getFeaturedProjects)
router.get("/:id", getProjectById)

// Protected routes (admin only)
router.post("/", authenticateJWT, authorize(["Admin"]), createProject)
router.put("/:id", authenticateJWT, authorize(["Admin"]), updateProject)
router.delete("/:id", authenticateJWT, authorize(["Admin"]), deleteProject)

export default router
