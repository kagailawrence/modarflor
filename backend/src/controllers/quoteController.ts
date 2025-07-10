import { Request, Response } from "express"
import { pool } from "../database/connection"
import { sendQuoteMail } from "../utils/mailer"

export const createQuote = async (req: Request, res: Response) => {
  try {
    const data = req.body
    // Store in DB
    await pool.query(
      `INSERT INTO quotes (
        project_type, flooring_type, square_footage, rooms, timeline, additional_services, special_requirements,
        first_name, last_name, email, phone, address, city, zip_code, preferred_contact, project_description, budget, start_date
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
      [
        data.projectType,
        data.flooringType,
        data.squareFootage ? parseInt(data.squareFootage) : null,
        data.rooms ? parseInt(data.rooms) : null,
        data.timeline,
        (data.additionalServices || []).join(", "),
        data.specialRequirements,
        data.firstName,
        data.lastName,
        data.email,
        data.phone,
        data.address,
        data.city,
        data.zipCode,
        data.preferredContact,
        data.projectDescription,
        data.budget,
        data.startDate || null
      ]
    )
    await sendQuoteMail(data)
    res.status(200).json({ message: "Quote request received, stored, and emails sent." })
  } catch (err) {
    res.status(500).json({ error: "Failed to process quote request." })
  }
}
