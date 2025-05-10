import mongoose from "mongoose"

const reservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      uppercase: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
    fuelType: {
      type: String,
      enum: ["Petrol 92", "Petrol 95", "Diesel", "Lanka Auto Diesel", "Lanka Super Diesel"],
      required: true,
    },
    requestedAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    allocatedAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    reservationDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

const Reservation = mongoose.model("Reservation", reservationSchema)
export default Reservation
