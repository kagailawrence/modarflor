import { Request, Response } from "express"
import { pool } from "../database/connection"

export const getFlooringTypes = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM flooring_types ORDER BY id ASC")
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch flooring types" })
  }
}

export const createFlooringType = async (req: Request, res: Response) => {
  try {
    const { type_id, name, price_min, price_max, unit, description } = req.body
    const result = await pool.query(
      `INSERT INTO flooring_types (type_id, name, price_min, price_max, unit, description)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [type_id, name, price_min, price_max, unit, description]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: "Failed to create flooring type" })
  }
}

export const updateFlooringType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { type_id, name, price_min, price_max, unit, description } = req.body
    const result = await pool.query(
      `UPDATE flooring_types SET type_id=$1, name=$2, price_min=$3, price_max=$4, unit=$5, description=$6, updated_at=NOW()
       WHERE id=$7 RETURNING *`,
      [type_id, name, price_min, price_max, unit, description, id]
    )
    if (result.rowCount === 0) return res.status(404).json({ error: "Not found" })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: "Failed to update flooring type" })
  }
}

export const deleteFlooringType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await pool.query("DELETE FROM flooring_types WHERE id=$1", [id])
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: "Failed to delete flooring type" })
  }
}
