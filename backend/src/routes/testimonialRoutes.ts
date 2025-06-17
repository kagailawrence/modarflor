import express from "express"
import {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getFeaturedTestimonials,
} from "../controllers/testimonialController"
import { authenticateJWT, authorize } from "../middleware/auth"

const router = express.Router()

// Public routes
router.get("/", getAllTestimonials)
router.get("/featured", getFeaturedTestimonials)
router.get("/:id", getTestimonialById)

// Protected routes (admin only)
router.post("/", authenticateJWT, authorize(["Admin"]), createTestimonial)
router.put("/:id", authenticateJWT, authorize(["Admin"]), updateTestimonial)
router.delete("/:id", authenticateJWT, authorize(["Admin"]), deleteTestimonial)

export default router
