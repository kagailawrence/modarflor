import Joi from "joi"

// User validation schemas
export const validateRegistration = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(100),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  })
  return schema.validate(data)
}

export const validateLogin = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  })
  return schema.validate(data)
}

export const validateUser = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(100),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    role: Joi.string().valid("Admin", "Viewer"),
  })
  return schema.validate(data)
}

// Project validation schema
export const validateProject = (data: any) => {
  let images = data.images
  // If imagesMeta is present, use it (for multipart/form-data)
  if (typeof data.imagesMeta === "string") {
    try {
      images = JSON.parse(data.imagesMeta)
    } catch {
      // If parsing fails, leave as is (Joi will catch the error)
    }
  } else if (typeof images === "string") {
    try {
      images = JSON.parse(images)
    } catch {
      // If parsing fails, leave as is (Joi will catch the error)
    }
  }
  const schema = Joi.object({
    title: Joi.string().required().min(3).max(100),
    description: Joi.string().required(),
    category: Joi.string().required(),
    type: Joi.string().required(),
    images: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().required(),
          alt: Joi.string().allow('').optional(),
          isFeatured: Joi.boolean().optional(),
        }),
      )
      .min(1)
      .required(),
  })
  // Validate with possibly parsed images
  return schema.validate({ ...data, images })
}

// Testimonial validation schema
export const validateTestimonial = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(100),
    role: Joi.string().required(),
    content: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    imageUrl: Joi.string().uri(),
  })
  return schema.validate(data)
}

// Service validation schema
export const validateService = (data: any) => {
  const schema = Joi.object({
    title: Joi.string().required().min(3).max(100),
    description: Joi.string().required(),
    imageUrl: Joi.string().allow('').optional(), // Allow empty or missing, will be set from file
    order: Joi.number(),
    features: Joi.array().items(Joi.string()).min(1).required(),
    alt: Joi.string().allow('').optional(), // Allow alt text for image
  })
  return schema.validate(data)
}
