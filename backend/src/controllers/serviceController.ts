import type { Request, Response } from "express"
import { prisma } from "../prismaClient"
import { catchAsync, AppError } from "../middleware/errorHandler"
import { validateService } from "../utils/validation"

// Get all services
export const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const services = await prisma.service.findMany({
    include: {
      features: true,
    },
    orderBy: { order: "asc" },
  })

  res.json(services)
})

// Get service by ID
export const getServiceById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      features: true,
    },
  })

  if (!service) {
    throw new AppError("Service not found", 404)
  }

  res.json(service)
})

// Create new service
export const createService = catchAsync(async (req: Request, res: Response) => {
  // Validate input
  const { error } = validateService(req.body)
  if (error) {
    throw new AppError(error.details[0].message, 400)
  }

  const { title, description, imageUrl, order, features } = req.body

  // Create service with features
  const service = await prisma.service.create({
    data: {
      title,
      description,
      imageUrl,
      order: order || 0,
      features: {
        create: features.map((feature: string) => ({
          description: feature,
        })),
      },
    },
    include: {
      features: true,
    },
  })

  res.status(201).json(service)
})

// Update service
export const updateService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  // Validate input
  const { error } = validateService(req.body)
  if (error) {
    throw new AppError(error.details[0].message, 400)
  }

  const { title, description, imageUrl, order, features } = req.body

  // Check if service exists
  const existingService = await prisma.service.findUnique({
    where: { id },
  })

  if (!existingService) {
    throw new AppError("Service not found", 404)
  }

  // Update service
  const updatedService = await prisma.$transaction(async (tx) => {
    // Delete existing features
    await tx.serviceFeature.deleteMany({
      where: { serviceId: id },
    })

    // Update service and create new features
    return tx.service.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl,
        order: order || existingService.order,
        features: {
          create: features.map((feature: string) => ({
            description: feature,
          })),
        },
      },
      include: {
        features: true,
      },
    })
  })

  res.json(updatedService)
})

// Delete service
export const deleteService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  // Check if service exists
  const existingService = await prisma.service.findUnique({
    where: { id },
  })

  if (!existingService) {
    throw new AppError("Service not found", 404)
  }

  // Delete service (cascade will delete features)
  await prisma.service.delete({
    where: { id },
  })

  res.json({ message: "Service deleted successfully" })
})
