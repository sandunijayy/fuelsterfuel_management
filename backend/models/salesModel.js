import mongoose from "mongoose"

const fuelTransactionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Customer or transaction name
    fuelType: {
      type: String,
      required: true,
      enum: ["Petrol 92", "Petrol 95", "Diesel", "Lanka Auto Diesel", "Lanka Super Diesel"], // Predefined fuel types
    },
    quantity: { type: Number, required: true }, // Fuel quantity in liters
    price: { type: Number, required: true }, // Total price
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Cash", "Card", "Mobile Payment"],
    }, // Payment method
  },
  { timestamps: true },
)

const FuelTransaction = mongoose.model("FuelTransaction", fuelTransactionSchema)
export default FuelTransaction
