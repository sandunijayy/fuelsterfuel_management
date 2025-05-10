import express from "express"
import {
  addInventory,
  getAllInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
  getFuelDetailsByType,
} from "../controllers/inventoryController.js"
import { authenticateUser, authorizeRoles } from "../middleware/auth.js"

const router = express.Router()

// Add inventory route - only admin can add inventory
router.post("/add", authenticateUser, authorizeRoles("admin"), addInventory)

// Get all inventory items
router.get("/get-all", authenticateUser, getAllInventory)

// Get a specific inventory item by ID
router.get("/get/:id", authenticateUser, getInventoryById)

// Update inventory item by ID - only admin can update
router.put("/update/:id", authenticateUser, authorizeRoles("admin"), updateInventory)

// Delete inventory item by ID - only admin can delete
router.delete("/delete/:id", authenticateUser, authorizeRoles("admin"), deleteInventory)

// Get fuel details by fuel type
router.get("/inventory/:fuelType", authenticateUser, getFuelDetailsByType)

export default router
