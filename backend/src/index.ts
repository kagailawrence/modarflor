import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import dotenv from "dotenv"
import { errorHandler } from "./middleware/errorHandler"
import { pool } from "./database/connection"
import projectRoutes from "./routes/projectRoutes"
import testimonialRoutes from "./routes/testimonialRoutes"
import serviceRoutes from "./routes/serviceRoutes"
import userRoutes from "./routes/userRoutes"
import authRoutes from "./routes/authRoutes"
import logRoutes from "./routes/logRoutes"; // Import log routes
import faqRoutes from "./routes/faqRoutes"
import contactRoutes from "./routes/contactRoutes"
import { authenticateJWT } from "./middleware/auth"
import winston from "winston"
import fs from "fs"
import path from "path"
import scheduleRoutes from "./routes/scheduleRoutes"
import quoteRoutes from "./routes/quoteRoutes"
import flooringTypeRoutes from "./routes/flooringTypeRoutes" // Import flooring type routes

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 5000

// Configure logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  defaultMeta: { service: "floor-decoration-api" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
})

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  )
}

// Initialize database schema
const initializeDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, "database", "schema.sql")
    const schema = fs.readFileSync(schemaPath, "utf8")
    await pool.query(schema)
    logger.info("Database schema initialized")
  } catch (error) {
    logger.error("Error initializing database schema:", error)
  }
}

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`)
  next()
})

// Serve uploaded images statically (use __dirname for absolute path)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/testimonials", testimonialRoutes)
app.use("/api/services", serviceRoutes)
app.use("/api/users", authenticateJWT, userRoutes) // Protected user routes
app.use("/api/logs", logRoutes); // Protected log routes, auth handled within logRoutes
app.use("/api/faqs", faqRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/schedule", scheduleRoutes) // Register schedule routes
app.use("/api/quote", quoteRoutes) // Register quote routes
app.use("/api/flooring-types", flooringTypeRoutes) // Register flooring type routes

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" })
})

// Error handling middleware
app.use(errorHandler)

// Start server
const startServer = async () => {
  try {
    await initializeDatabase()
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    logger.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  logger.error("Unhandled Rejection:", err)
  console.error("Unhandled Rejection:", err)
})

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully")
  await pool.end()
  process.exit(0)
})
