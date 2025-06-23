import type { Request, Response } from "express"
import { query, transaction } from "../database/connection"
import { catchAsync, AppError } from "../middleware/errorHandler"
import { validateService } from "../utils/validation"
import path from "path"

// Get all services
export const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const result = await query(
    `SELECT s.*, COALESCE(json_agg(sf.*) FILTER (WHERE sf.id IS NOT NULL), '[]') AS features
     FROM services s
     LEFT JOIN service_features sf ON sf.service_id = s.id
     GROUP BY s.id
     ORDER BY s.order_index ASC`
  )
  const services = result.rows.map((row: any) => ({
    ...row,
    features: Array.isArray(row.features) ? (row.features as any[]).filter((f: any) => f && f.id) : [],
  }))
  res.json(services)
})

// Get service by ID
export const getServiceById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await query(
    `SELECT s.*, COALESCE(json_agg(sf.*) FILTER (WHERE sf.id IS NOT NULL), '[]') AS features
     FROM services s
     LEFT JOIN service_features sf ON sf.service_id = s.id
     WHERE s.id = $1
     GROUP BY s.id`,
    [id]
  )
  const service = result.rows[0]
  if (!service) throw new AppError("Service not found", 404)
  service.features = Array.isArray(service.features) ? (service.features as any[]).filter((f: any) => f && f.id) : []
  res.json(service)
})

// Create new service
export const createService = catchAsync(async (req: Request, res: Response) => {
  // Set imageUrl from file upload if present
  if (req.file) {
    req.body.imageUrl = `/uploads/${path.basename(req.file.path)}`
  }
  const { error } = validateService(req.body)
  if (error) throw new AppError(error.details[0].message, 400)
  const { title, description, order, features } = req.body
  const imageUrl = req.body.imageUrl
  const result = await query(
    `INSERT INTO services (title, description, image_url, order_index)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, description, imageUrl, order || 0]
  )
  const service = result.rows[0]
  if (features && Array.isArray(features) && features.length > 0) {
    for (const feature of features) {
      await query(
        `INSERT INTO service_features (description, service_id) VALUES ($1, $2)`,
        [feature, service.id]
      )
    }
  }
  // Fetch with features
  const withFeatures = await query(
    `SELECT s.*, COALESCE(json_agg(sf.*) FILTER (WHERE sf.id IS NOT NULL), '[]') AS features
     FROM services s
     LEFT JOIN service_features sf ON sf.service_id = s.id
     WHERE s.id = $1
     GROUP BY s.id`,
    [service.id]
  )
  const serviceWithFeatures = withFeatures.rows[0]
  serviceWithFeatures.features = Array.isArray(serviceWithFeatures.features) ? (serviceWithFeatures.features as any[]).filter((f: any) => f && f.id) : []
  res.status(201).json(serviceWithFeatures)
})

// Update service
export const updateService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { error } = validateService(req.body)
  if (error) throw new AppError(error.details[0].message, 400)
  const { title, description, order, features } = req.body
  // Handle uploaded image
  let imageUrl = req.body.imageUrl
  if (req.file) {
    imageUrl = `/uploads/${path.basename(req.file.path)}`
  }
  // Check if service exists
  const existing = await query(`SELECT * FROM services WHERE id = $1`, [id])
  if (existing.rowCount === 0) throw new AppError("Service not found", 404)
  await transaction(async (client) => {
    await client.query(
      `UPDATE services SET title = $1, description = $2, image_url = $3, order_index = $4 WHERE id = $5`,
      [title, description, imageUrl, order || existing.rows[0].order_index, id]
    )
    await client.query(`DELETE FROM service_features WHERE service_id = $1`, [id])
    if (features && Array.isArray(features) && features.length > 0) {
      for (const feature of features) {
        await client.query(
          `INSERT INTO service_features (description, service_id) VALUES ($1, $2)`,
          [feature, id]
        )
      }
    }
  })
  // Fetch updated
  const updated = await query(
    `SELECT s.*, COALESCE(json_agg(sf.*) FILTER (WHERE sf.id IS NOT NULL), '[]') AS features
     FROM services s
     LEFT JOIN service_features sf ON sf.service_id = s.id
     WHERE s.id = $1
     GROUP BY s.id`,
    [id]
  )
  const updatedService = updated.rows[0]
  updatedService.features = Array.isArray(updatedService.features) ? (updatedService.features as any[]).filter((f: any) => f && f.id) : []
  res.json(updatedService)
})

// Delete service
export const deleteService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const existing = await query(`SELECT * FROM services WHERE id = $1`, [id])
  if (existing.rowCount === 0) throw new AppError("Service not found", 404)
  await transaction(async (client) => {
    await client.query(`DELETE FROM service_features WHERE service_id = $1`, [id])
    await client.query(`DELETE FROM services WHERE id = $1`, [id])
  })
  res.json({ message: "Service deleted successfully" })
})
