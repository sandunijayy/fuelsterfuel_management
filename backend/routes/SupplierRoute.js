import express from "express"
import {addSupplier,getAllSuppliers,getSupplierById,updateSupplier,deleteSupplier} from "../controller/SupplierController.js"

const router = express.Router();

// Route to add a new employee
router.post("/addsupplier", addSupplier);
router.get("/getAllsuppliers", getAllSuppliers);
router.get("/getsupplierById/:id", getSupplierById);
router.put("/updatesupplier/:id", updateSupplier);
router.delete("/deletesupplier/:id", deleteSupplier);

export default router;