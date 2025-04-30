import express from "express";
import { addInventory, getAllInventory, getInventoryById, updateInventory, deleteInventory, getFuelDetailsByType } from "../controller/InventoryController.js";

const router = express.Router();

// Add inventory route
router.post("/add", addInventory);

router.get("/get-all", getAllInventory);

// Get a specific inventory item by ID
router.get("/get/:id", getInventoryById);

// Update inventory item by ID
router.put("/update/:id", updateInventory);

// Delete inventory item by ID
router.delete("/delete/:id", deleteInventory);

//get price by fuelType
//router.get("/inventory/:fuelType", getPriceByFuelType);

//get available quantity by fuelType
router.get("/inventory/:fuelType", getFuelDetailsByType);

export default router;


//insert sonar