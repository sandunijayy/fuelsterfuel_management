import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    fuelType: { type: String, required: true },
    priority: { type: String, required: true }, // High, Medium, Low
    fuelAmount: { type: Number, required: true },
    allocatedFuelAmount: { type: Number, default: null }, // This allows the field to be null if no value is provided
    status: { type: String, default: 'Pending' },
    phoneNumber: { type: String, required: true },
    totalPrice: { type: Number, required: true },

}, { timestamps: true });


const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;