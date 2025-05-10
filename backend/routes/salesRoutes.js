import express from "express"
import {
  addFuelTransaction,
  getAllFuelTransactions,
  getFuelTransactionById,
  updateFuelTransaction,
  deleteFuelTransaction,
} from "../controllers/salesController.js"
import { authenticateUser, authorizeRoles } from "../middleware/auth.js"

const router = express.Router()

// Route to add a new fuel transaction
router.post("/add-transaction", authenticateUser, authorizeRoles("staff", "admin"), addFuelTransaction)
router.get("/transactions", authenticateUser, authorizeRoles("staff", "admin"), getAllFuelTransactions)
router.get("/transaction/:id", authenticateUser, authorizeRoles("staff", "admin"), getFuelTransactionById)
router.put("/update-transaction/:id", authenticateUser, authorizeRoles("staff", "admin"), updateFuelTransaction)
router.delete("/delete-transaction/:id", authenticateUser, authorizeRoles("staff", "admin"), deleteFuelTransaction)

export default router
