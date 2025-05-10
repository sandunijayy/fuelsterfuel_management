import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose"

// Load env vars
dotenv.config()

// Initialize express
const app = express()

// Debug environment variables
console.log("Environment variables loaded:")
console.log("PORT:", process.env.PORT)
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET)
console.log("JWT_LIFETIME:", process.env.JWT_LIFETIME)

// Middleware
app.use(express.json())
app.use(cors())

// Routes
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import supplierRoutes from "./routes/supplierRoutes.js"
import placeOrderRoutes from "./routes/placeOrderRoutes.js"
import inventoryRoutes from "./routes/inventoryRoutes.js"
import salesRoutes from "./routes/salesRoutes.js"
import reservationRoutes from "./routes/reservationRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/suppliers", supplierRoutes)
app.use("/api/orders", placeOrderRoutes)
app.use("/api/inventory", inventoryRoutes)
app.use("/api/sales", salesRoutes)
app.use("/api/reservations", reservationRoutes)
app.use("/api/notifications", notificationRoutes)

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("Database connection error:", error)
    process.exit(1)
  })
