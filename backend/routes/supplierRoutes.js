import express from "express"
import {
  addSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js"
import { authenticateUser, authorizeRoles } from "../middleware/auth.js"

const router = express.Router()

// Route to add a new supplier
router.post("/addsupplier", authenticateUser, authorizeRoles("admin"), addSupplier)
router.get("/getAllsuppliers", authenticateUser, authorizeRoles("admin"), getAllSuppliers)
router.get("/getsupplierById/:id", authenticateUser, authorizeRoles("admin"), getSupplierById)
router.put("/updatesupplier/:id", authenticateUser, authorizeRoles("admin"), updateSupplier)
router.delete("/deletesupplier/:id", authenticateUser, authorizeRoles("admin"), deleteSupplier)

export default router
