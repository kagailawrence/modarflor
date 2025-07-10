import { Router } from "express"
import {
  getFlooringTypes,
  createFlooringType,
  updateFlooringType,
  deleteFlooringType,
} from "../controllers/flooringTypeController"

const router = Router()

router.get("/", getFlooringTypes)
router.post("/", createFlooringType)
router.put("/:id", updateFlooringType)
router.delete("/:id", deleteFlooringType)

export default router
