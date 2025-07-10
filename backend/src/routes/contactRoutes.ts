import express from "express"
import { submitContact } from "../controllers/contactController"

const router = express.Router()

// Public contact form submission
router.post("/", submitContact)

export default router
