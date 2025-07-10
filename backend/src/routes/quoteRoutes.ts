import { Router } from "express"
import { createQuote } from "../controllers/quoteController"

const router = Router()

// POST /api/quote
router.post("/", createQuote)

export default router
