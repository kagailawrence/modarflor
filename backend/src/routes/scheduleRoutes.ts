import express from "express"
import { submitSchedule } from "../controllers/scheduleController"

const router = express.Router()

// Public schedule form submission
router.post("/", submitSchedule)

export default router
