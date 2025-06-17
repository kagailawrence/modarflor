import type { Request, Response, NextFunction } from "express"
import winston from "winston"

// Configure logger
const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  defaultMeta: { service: "error-handler" },
  transports: [new winston.transports.File({ filename: "error.log", level: "error" })],
})

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  )
}

// Custom error class
export class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

// Error handler middleware
export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  })

  // Check if it's an operational error (expected error)
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    })
  }

  // For programming or other unknown errors, don't leak error details
  console.error("ERROR 💥", err)
  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  })
}

// Async error handler wrapper
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}
