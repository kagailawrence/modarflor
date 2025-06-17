import express from "express"
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController"
import { authenticateJWT, authorize } from "../middleware/auth"

const router = express.Router()

// Public routes
router.get("/", getAllServices)
router.get("/:id", getServiceById)

// Protected routes (admin only)
router.post("/", authenticateJWT, authorize(["Admin"]), createService)
router.put("/:id", authenticateJWT, authorize(["Admin"]), updateService)
router.delete("/:id", authenticateJWT, authorize(["Admin"]), deleteService)

export default router
