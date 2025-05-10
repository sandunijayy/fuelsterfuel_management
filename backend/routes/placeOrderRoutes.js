import express from "express"
import { placeOrder, getOrdersBySupplier, deleteOrder } from "../controllers/placeOrderController.js"
import { authenticateUser, authorizeRoles } from "../middleware/auth.js"

const router = express.Router()

// Route to place an order
router.post("/placeorder", authenticateUser, authorizeRoles("admin"), placeOrder)

// Route to delete an order
router.delete("/order/:orderId", authenticateUser, authorizeRoles("admin"), deleteOrder)
router.get("/orders/:supplierId", authenticateUser, authorizeRoles("admin"), getOrdersBySupplier)

export default router
