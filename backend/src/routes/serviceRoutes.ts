import express from "express"
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController"
import { authenticateJWT, authorize } from "../middleware/auth"
import { upload } from "../middleware/upload"

const router = express.Router()

// Public routes
router.get("/", getAllServices)
router.get("/:id", getServiceById)

// Protected routes (admin only)
router.post("/", authenticateJWT, authorize(["Admin"]), upload.single("image"), createService)
router.put("/:id", authenticateJWT, authorize(["Admin"]), upload.single("image"), updateService)
router.delete("/:id", authenticateJWT, authorize(["Admin"]), deleteService)

export default router
