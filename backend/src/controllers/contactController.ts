import type { Request, Response } from "express"
import { query } from "../database/connection"
import { catchAsync, AppError } from "../middleware/errorHandler"
import { sendContactMail } from "../utils/mailer"

export const submitContact = catchAsync(async (req: Request, res: Response) => {
  const { name, email, phone, service, message } = req.body
  if (!name || !email || !message) {
    throw new AppError("Name, email, and message are required.", 400)
  }
  // Store in DB
  await query(
    `INSERT INTO contacts (name, email, phone, service, message) VALUES ($1, $2, $3, $4, $5)`,
    [name, email, phone, service, message]
  )
  // Send email to admin and confirmation to user
  await sendContactMail({ name, email, phone, service, message })
  res.status(200).json({ message: "Contact message received." })
})
