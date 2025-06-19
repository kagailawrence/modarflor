import express from "express"
import {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
} from "../controllers/faqController"
import { authenticateJWT, authorize } from "../middleware/auth"

const router = express.Router()

// Public
router.get("/", getAllFaqs)
router.get("/:id", getFaqById)

// Admin
router.post("/", authenticateJWT, authorize(["Admin"]), createFaq)
router.put("/:id", authenticateJWT, authorize(["Admin"]), updateFaq)
router.delete("/:id", authenticateJWT, authorize(["Admin"]), deleteFaq)

export default router
