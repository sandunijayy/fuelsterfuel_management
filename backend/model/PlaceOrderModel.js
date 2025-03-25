import mongoose from "mongoose";

const placeOrderSchema = new mongoose.Schema(
  {
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    fuelType: { type: String, required: true },
    quantity: { type: Number, required: true },
    deliveryDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const PlaceOrder = mongoose.model("PlaceOrder", placeOrderSchema);

export default PlaceOrder;