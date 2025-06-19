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
import { upload } from "../middleware/upload"

const router = express.Router()

// Public routes
router.get("/", getAllProjects)
router.get("/featured", getFeaturedProjects)
router.get("/:id", getProjectById)

// Protected routes (admin only)
router.post("/", authenticateJWT, authorize(["Admin"]), upload.array("images", 10), createProject)
router.put("/:id", authenticateJWT, authorize(["Admin"]), upload.array("images", 10), updateProject)
router.delete("/:id", authenticateJWT, authorize(["Admin"]), deleteProject)

export default router
