import PlaceOrder from "../models/PlaceOrder.js"
import Supplier from "../models/Supplier.js"
import { sendOrderConfirmationEmail } from "../utils/emailService.js"

export const placeOrder = async (req, res) => {
  const { supplierId, fuelType, quantity, deliveryDate } = req.body

  try {
    // Validate inputs
    if (!supplierId || !fuelType || !quantity || !deliveryDate) {
      return res.status(400).json({ message: "Please fill in all fields." })
    }

    // Validate quantity is a positive number
    if (isNaN(quantity) || Number(quantity) <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number." })
    }

    // Validate delivery date is not in the past
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    const requestedDeliveryDate = new Date(deliveryDate)

    if (requestedDeliveryDate < currentDate) {
      return res.status(400).json({ message: "Delivery date cannot be in the past." })
    }

    // Get the supplier information
    const supplier = await Supplier.findById(supplierId)
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found." })
    }

    // Create the order document
    const order = await PlaceOrder.create({
      supplierId,
      fuelType,
      quantity,
      deliveryDate,
    })

    // Send email notification to the supplier
    if (process.env.NODE_ENV !== "test") {
      try {
        await sendOrderConfirmationEmail(supplier.email, supplier.fullName, {
          fuelType,
          quantity,
          deliveryDate,
        })
        console.log("Order confirmation email sent to supplier")
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError)
        // We still continue with the order process even if email fails
      }
    }

    // Return success response
    res.status(201).json({
      order: {
        id: order._id,
        supplierId: order.supplierId,
        fuelType: order.fuelType,
        quantity: order.quantity,
        deliveryDate: order.deliveryDate,
      },
      message: "Order placed successfully! Email notification sent to the supplier.",
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Fetch all orders by supplier
export const getOrdersBySupplier = async (req, res) => {
  const { supplierId } = req.params

  try {
    // Fetch orders and only select fuelType, quantity, and deliveryDate fields
    const orders = await PlaceOrder.find({ supplierId }).select("fuelType quantity deliveryDate") // Select only the required fields

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this supplier." })
    }

    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete an order by ID
export const deleteOrder = async (req, res) => {
  const { orderId } = req.params

  try {
    const order = await PlaceOrder.findByIdAndDelete(orderId)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    res.status(200).json({ message: "Order deleted successfully!" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
