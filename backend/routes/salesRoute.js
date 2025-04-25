import express from "express";
import { addFuelTransaction ,getAllFuelTransactions,getFuelTransactionById,updateFuelTransaction, deleteFuelTransaction} from "../controller/salesController.js";

const router = express.Router();

// Route to add a new fuel transaction
router.post("/add-transaction", addFuelTransaction);
router.get("/transactions", getAllFuelTransactions);  
router.get("/transaction/:id", getFuelTransactionById);
router.put("/update-transaction/:id", updateFuelTransaction);
router.delete("/delete-transaction/:id", deleteFuelTransaction);

export default router;