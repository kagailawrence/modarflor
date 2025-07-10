import type { Request, Response } from "express"
import { query } from "../database/connection"
import { catchAsync, AppError } from "../middleware/errorHandler"
import { sendScheduleMail } from "../utils/mailer"

export const submitSchedule = catchAsync(async (req: Request, res: Response) => {
  const { name, email, phone, date, time, message } = req.body
  if (!name || !email || !date || !time) {
    throw new AppError("Name, email, date, and time are required.", 400)
  }
  // Store in DB
  await query(
    `INSERT INTO schedules (name, email, phone, date, time, message) VALUES ($1, $2, $3, $4, $5, $6)`,
    [name, email, phone, date, time, message]
  )
  // Send email to admin and confirmation to user
  await sendScheduleMail({ name, email, phone, date, time, message })
  res.status(200).json({ message: "Schedule received." })
})
