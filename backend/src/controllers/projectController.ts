import type { Request, Response } from "express"
import { query, transaction } from "../database/connection"
import { catchAsync, AppError } from "../middleware/errorHandler"
import { validateProject } from "../utils/validation"
import path from "path"

// Get all projects with pagination and filtering
export const getAllProjects = catchAsync(async (req: Request, res: Response) => {
  const page = Number.parseInt(req.query.page as string) || 1
  const limit = Number.parseInt(req.query.limit as string) || 10
  const offset = (page - 1) * limit

  const category = req.query.category as string
  const type = req.query.type as string
  const search = req.query.search as string

  // Build WHERE clause
  let whereClause = "WHERE 1=1"
  const queryParams: any[] = []
  let paramIndex = 1

  if (category) {
    whereClause += ` AND p.category = $${paramIndex}`
    queryParams.push(category)
    paramIndex++
  }

  if (type) {
    whereClause += ` AND p.type = $${paramIndex}`
    queryParams.push(type)
    paramIndex++
  }

  if (search) {
    whereClause += ` AND (p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`
    queryParams.push(`%${search}%`)
    paramIndex++
  }

  // Get projects with images
  const projectsQuery = `
    SELECT 
      p.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', pi.id,
            'url', pi.url,
            'alt', pi.alt,
            'isFeatured', pi.is_featured
          ) ORDER BY pi.is_featured DESC, pi.created_at
        ) FILTER (WHERE pi.id IS NOT NULL),
        '[]'::json
      ) as images
    FROM projects p
    LEFT JOIN project_images pi ON p.id = pi.project_id
    ${whereClause}
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `

  // Get total count
  const countQuery = `
    SELECT COUNT(*) as total
    FROM projects p
    ${whereClause}
  `

  const [projectsResult, countResult] = await Promise.all([
    query(projectsQuery, [...queryParams, limit, offset]),
    query(countQuery, queryParams),
  ])

  const total = Number.parseInt(countResult.rows[0].total)
  const totalPages = Math.ceil(total / limit)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  res.json({
    data: projectsResult.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  })
})

// Get project by ID
export const getProjectById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  const projectQuery = `
    SELECT 
      p.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', pi.id,
            'url', pi.url,
            'alt', pi.alt,
            'isFeatured', pi.is_featured
          ) ORDER BY pi.is_featured DESC, pi.created_at
        ) FILTER (WHERE pi.id IS NOT NULL),
        '[]'::json
      ) as images
    FROM projects p
    LEFT JOIN project_images pi ON p.id = pi.project_id
    WHERE p.id = $1
    GROUP BY p.id
  `

  const result = await query(projectQuery, [id])

  if (result.rows.length === 0) {
    throw new AppError("Project not found", 404)
  }

  res.json(result.rows[0])
})

// Create new project
export const createProject = catchAsync(async (req: Request, res: Response) => {
  // Always set req.body.images from imagesMeta if present
  if (req.body.imagesMeta) {
    try {
      req.body.images = JSON.parse(req.body.imagesMeta)
    } catch {
      req.body.images = []
    }
    delete req.body.imagesMeta
  }

  // Validate input (title, description, etc.)
  const { error } = validateProject(req.body)
  if (error) {
    throw new AppError(error.details[0].message, 400)
  }

  const { title, description, category, type } = req.body
  // Handle uploaded images
  let images: any[] = []
  if (req.files && Array.isArray(req.files)) {
    images = (req.files as Express.Multer.File[]).map((file) => ({
      url: `/uploads/${path.basename(file.path)}`,
      alt: title,
      isFeatured: false,
    }))
  } else if (req.body.images) {
    // Support for images as URLs in body (optional)
    try {
      images = JSON.parse(req.body.images)
    } catch {
      images = req.body.images
    }
  }

  const result = await transaction(async (client) => {
    // Insert project
    const projectQuery = `
      INSERT INTO projects (title, description, category, type)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
    const projectResult = await client.query(projectQuery, [title, description, category, type])
    const project = projectResult.rows[0]

    // Insert images
    if (images && images.length > 0) {
      for (const img of images) {
        await client.query(
          `INSERT INTO project_images (project_id, url, alt, is_featured) VALUES ($1, $2, $3, $4)`,
          [project.id, img.url, img.alt || title, img.isFeatured || false]
        )
      }
    }
    // Fetch with images
    const withImages = await client.query(
      `SELECT p.*, COALESCE(json_agg(pi.*) FILTER (WHERE pi.id IS NOT NULL), '[]') AS images FROM projects p LEFT JOIN project_images pi ON p.id = pi.project_id WHERE p.id = $1 GROUP BY p.id`,
      [project.id]
    )
    return withImages.rows[0]
  })

  res.status(201).json(result)
})

// Update project
export const updateProject = catchAsync(async (req: Request, res: Response) => {
  // Always set req.body.images from imagesMeta if present
  if (req.body.imagesMeta) {
    try {
      req.body.images = JSON.parse(req.body.imagesMeta)
    } catch {
      req.body.images = []
    }
    delete req.body.imagesMeta
  }

  // Remove imagesMeta from req.body before validation
  if (req.body.imagesMeta) {
    req.body.imagesMeta = undefined
    delete req.body.imagesMeta
  }
  const { id } = req.params
  // Validate input
  const { error } = validateProject(req.body)
  if (error) {
    throw new AppError(error.details[0].message, 400)
  }
  const { title, description, category, type } = req.body
  // Handle uploaded images
  let images: any[] = []
  if (req.files && Array.isArray(req.files)) {
    images = (req.files as Express.Multer.File[]).map((file) => ({
      url: `/uploads/${path.basename(file.path)}`,
      alt: title,
      isFeatured: false,
    }))
  } else if (req.body.images) {
    try {
      images = JSON.parse(req.body.images)
    } catch {
      images = req.body.images
    }
  }
  // Check if project exists
  const existingProject = await query("SELECT id FROM projects WHERE id = $1", [id])
  if (existingProject.rows.length === 0) {
    throw new AppError("Project not found", 404)
  }
  const result = await transaction(async (client) => {
    // Update project
    const projectQuery = `
      UPDATE projects 
      SET title = $1, description = $2, category = $3, type = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `
    const projectResult = await client.query(projectQuery, [title, description, category, type, id])
    const project = projectResult.rows[0]
    // Delete existing images
    await client.query("DELETE FROM project_images WHERE project_id = $1", [id])
    // Insert new images
    if (images && images.length > 0) {
      for (const img of images) {
        await client.query(
          `INSERT INTO project_images (project_id, url, alt, is_featured) VALUES ($1, $2, $3, $4)`,
          [id, img.url, img.alt || title, img.isFeatured || false]
        )
      }
    }
    // Fetch with images
    const withImages = await client.query(
      `SELECT p.*, COALESCE(json_agg(pi.*) FILTER (WHERE pi.id IS NOT NULL), '[]') AS images FROM projects p LEFT JOIN project_images pi ON p.id = pi.project_id WHERE p.id = $1 GROUP BY p.id`,
      [id]
    )
    return withImages.rows[0]
  })
  res.json(result)
})

// Delete project
export const deleteProject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  // Check if project exists
  const existingProject = await query("SELECT id FROM projects WHERE id = $1", [id])
  if (existingProject.rows.length === 0) {
    throw new AppError("Project not found", 404)
  }

  // Delete project (cascade will delete images)
  await query("DELETE FROM projects WHERE id = $1", [id])

  res.json({ message: "Project deleted successfully" })
})

// Get featured projects
export const getFeaturedProjects = catchAsync(async (req: Request, res: Response) => {
  const limit = Number.parseInt(req.query.limit as string) || 3

  const projectsQuery = `
    SELECT 
      p.*,
      json_agg(
        json_build_object(
          'id', pi.id,
          'url', pi.url,
          'alt', pi.alt,
          'isFeatured', pi.is_featured
        )
      ) as images
    FROM projects p
    INNER JOIN project_images pi ON p.id = pi.project_id
    WHERE pi.is_featured = true
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT $1
  `

  const result = await query(projectsQuery, [limit])
  res.json(result.rows)
})
