import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  fuelType: { type: String, required: true },
  pricePerLiter: { type: Number, required: true },
  literQuantity: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
}, { timestamps: true });

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;