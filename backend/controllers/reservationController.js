import Reservation from "../models/Reservation.js"
import Inventory from "../models/Inventory.js"
import Notification from "../models/Notification.js"

// Emergency vehicles list
const emergencyVehicles = ["ABC1234", "XYZ5678", "EMS9999", "ABC4556"]

// Create a new reservation
export const createReservation = async (req, res) => {
  try {
    const { customerName, vehicleNumber, fuelType, requestedAmount, email, phoneNumber } = req.body

    // Get user ID from authenticated request
    const userId = req.user.userId

    // Check if all required fields are provided
    if (!customerName || !vehicleNumber || !fuelType || !requestedAmount || !email || !phoneNumber) {
      return res.status(400).json({ message: "Please provide all required fields" })
    }

    // Validate fuel type
    const validFuelTypes = ["Petrol 92", "Petrol 95", "Diesel", "Lanka Auto Diesel", "Lanka Super Diesel"]
    if (!validFuelTypes.includes(fuelType)) {
      return res.status(400).json({ message: "Invalid fuel type" })
    }

    // Determine priority based on vehicle number
    const priority = emergencyVehicles.includes(vehicleNumber.toUpperCase()) ? "high" : "medium"

    // Get fuel price from inventory
    const inventory = await Inventory.findOne({ fuelType })
    if (!inventory) {
      return res.status(404).json({ message: `No inventory found for ${fuelType}` })
    }

    const pricePerLiter = inventory.pricePerLiter
    const availableAmount = inventory.availableQuantity

    // Determine allocated amount based on priority and available fuel
    let allocatedAmount = requestedAmount

    if (availableAmount < 100) {
      if (priority === "high") {
        // High priority vehicles can get requested amount but max 20 liters
        allocatedAmount = Math.min(requestedAmount, 20)
      } else {
        // Low and medium priority vehicles get max 5 liters
        allocatedAmount = Math.min(requestedAmount, 5)
      }

      // If requested amount is more than what we can allocate
      if (requestedAmount > allocatedAmount) {
        return res.status(400).json({
          message: `Cannot allocate requested amount. Maximum allocation for your vehicle is ${allocatedAmount} liters due to low fuel stock.`,
        })
      }
    }

    // Check if there's enough fuel to allocate
    if (allocatedAmount > availableAmount) {
      return res.status(400).json({
        message: `Not enough fuel available. Current stock: ${availableAmount} liters`,
      })
    }

    // Calculate total price
    const totalPrice = allocatedAmount * pricePerLiter

    // Create reservation
    const reservation = await Reservation.create({
      userId,
      customerName,
      vehicleNumber: vehicleNumber.toUpperCase(),
      priority,
      fuelType,
      requestedAmount,
      allocatedAmount,
      email,
      phoneNumber,
      totalPrice,
    })

    // Create notification for admin
    await Notification.create({
      title: "New Fuel Reservation",
      message: `${customerName} has requested ${allocatedAmount} liters of ${fuelType}`,
      type: "reservation",
      relatedId: reservation._id,
      link: "/admin/orders",
    })

    res.status(201).json({
      reservation,
      message: "Reservation created successfully",
    })
  } catch (error) {
    console.error("Error creating reservation:", error)
    res.status(500).json({ message: error.message })
  }
}

// Get all reservations for the current user
export const getUserReservations = async (req, res) => {
  try {
    const userId = req.user.userId

    const reservations = await Reservation.find({ userId }).sort({ createdAt: -1 })

    res.status(200).json({ reservations })
  } catch (error) {
    console.error("Error fetching reservations:", error)
    res.status(500).json({ message: error.message })
  }
}

// Get a single reservation by ID
export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.userId

    const reservation = await Reservation.findOne({ _id: id, userId })

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" })
    }

    res.status(200).json({ reservation })
  } catch (error) {
    console.error("Error fetching reservation:", error)
    res.status(500).json({ message: error.message })
  }
}

// Delete a reservation
export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.userId

    // Find the reservation
    const reservation = await Reservation.findOne({ _id: id, userId })

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" })
    }

    // Only allow deletion of pending reservations
    if (reservation.status !== "pending") {
      return res.status(400).json({ message: "Cannot delete a non-pending reservation" })
    }

    // Delete the reservation
    await Reservation.findByIdAndDelete(id)

    res.status(200).json({ message: "Reservation deleted successfully" })
  } catch (error) {
    console.error("Error deleting reservation:", error)
    res.status(500).json({ message: error.message })
  }
}

// Get fuel price by type
export const getFuelPrice = async (req, res) => {
  try {
    const { fuelType } = req.params

    const inventory = await Inventory.findOne({ fuelType })
    if (!inventory) {
      return res.status(404).json({ message: `No inventory found for ${fuelType}` })
    }

    res.status(200).json({
      fuelType,
      pricePerLiter: inventory.pricePerLiter,
      availableQuantity: inventory.availableQuantity,
    })
  } catch (error) {
    console.error("Error fetching fuel price:", error)
    res.status(500).json({ message: error.message })
  }
}

// Get all reservations (admin only)
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 }).populate("userId", "name email")

    res.status(200).json({ reservations })
  } catch (error) {
    console.error("Error fetching all reservations:", error)
    res.status(500).json({ message: error.message })
  }
}

// Update reservation status (admin only)
export const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be 'approved', 'rejected', or 'pending'" })
    }

    // Find the reservation
    const reservation = await Reservation.findById(id)

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" })
    }

    // If status is not changing, return early
    if (reservation.status === status) {
      return res.status(200).json({
        reservation,
        message: `Reservation already ${status}`,
      })
    }

    // If approving, update inventory
    if (status === "approved") {
      // Get inventory for this fuel type
      const inventory = await Inventory.findOne({ fuelType: reservation.fuelType })

      if (!inventory) {
        return res.status(404).json({ message: `No inventory found for ${reservation.fuelType}` })
      }

      // Check if there's still enough fuel
      if (inventory.availableQuantity < reservation.allocatedAmount) {
        return res.status(400).json({
          message: `Not enough fuel available. Current stock: ${inventory.availableQuantity} liters`,
        })
      }

      // Update inventory (reduce available quantity)
      inventory.availableQuantity -= reservation.allocatedAmount
      await inventory.save()
    }

    // If changing from approved to another status, return fuel to inventory
    if (reservation.status === "approved" && status !== "approved") {
      // Get inventory for this fuel type
      const inventory = await Inventory.findOne({ fuelType: reservation.fuelType })

      if (inventory) {
        // Return fuel to inventory
        inventory.availableQuantity += reservation.allocatedAmount
        await inventory.save()
      }
    }

    // Update reservation status
    reservation.status = status
    await reservation.save()

    res.status(200).json({
      reservation,
      message: `Reservation ${status} successfully`,
    })
  } catch (error) {
    console.error("Error updating reservation status:", error)
    res.status(500).json({ message: error.message })
  }
}

// Update a reservation (for customers)
export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Find the reservation
    const reservation = await Reservation.findById(id)

    // Check if reservation exists
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      })
    }

    // Check if user owns this reservation
    if (reservation.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this reservation",
      })
    }

    // Check if reservation is pending
    if (reservation.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending reservations can be updated",
      })
    }

    // Update the reservation
    const updatedReservation = await Reservation.findByIdAndUpdate(id, updateData, { new: true })

    return res.status(200).json({
      success: true,
      message: "Reservation updated successfully",
      reservation: updatedReservation,
    })
  } catch (error) {
    console.error("Error updating reservation:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to update reservation",
      error: error.message,
    })
  }
}

// Admin delete reservation
export const adminDeleteReservation = async (req, res) => {
  try {
    const { id } = req.params

    // Find the reservation
    const reservation = await Reservation.findById(id)

    // Check if reservation exists
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      })
    }

    // Delete the reservation
    await Reservation.findByIdAndDelete(id)

    return res.status(200).json({
      success: true,
      message: "Reservation deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting reservation:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to delete reservation",
      error: error.message,
    })
  }
}
