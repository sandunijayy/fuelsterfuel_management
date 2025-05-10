import express from "express"
import {
  createReservation,
  getUserReservations,
  getReservationById,
  deleteReservation,
  getFuelPrice,
  getAllReservations,
  updateReservationStatus,
} from "../controllers/reservationController.js"
import { authenticateUser, authorizeRoles } from "../middleware/auth.js"

const router = express.Router()

// All routes require authentication
router.use(authenticateUser)

// Create a new reservation
router.post("/create", createReservation)

// Get all reservations for the current user
router.get("/user", getUserReservations)

// Get a single reservation by ID
router.get("/:id", getReservationById)

// Delete a reservation
router.delete("/:id", deleteReservation)

// Get fuel price by type
router.get("/fuel-price/:fuelType", getFuelPrice)

// Admin routes
router.get("/admin/all", authenticateUser, authorizeRoles("admin"), getAllReservations)
router.patch("/admin/:id", authenticateUser, authorizeRoles("admin"), updateReservationStatus)

export default router
