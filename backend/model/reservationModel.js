import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    vehicleNumber: { type: String },
    fuelType: { type: String },
    priority: { type: String }, // High, Medium, Low
    fuelAmount: { type: Number },
    allocatedFuelAmount: { type: Number, default: null }, // This allows the field to be null if no value is provided
    status: { type: String, default: 'Pending' },
    phoneNumber: { type: String, required: true },
    totalPrice: { type: Number },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });


const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;