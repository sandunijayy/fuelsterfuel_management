import express from "express";
import { placeOrder, getOrdersBySupplier, deleteOrder } from "../controller/PlaceOrderController.js";

const router = express.Router();

// Route to place an order
router.post("/placeorder", placeOrder);

// Route to get all orders


// Route to delete an order
router.delete("/order/:orderId", deleteOrder);
router.get("/orders/:supplierId", getOrdersBySupplier);



export default router;