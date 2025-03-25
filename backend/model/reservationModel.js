import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    vehicleType: { type: String },
    fuelType: { type: String },
    priority: { type: String }, // High, Medium, Low
    fuelAmount: { type: Number },
    status: { type: String, default: 'Pending' },
    phoneNumber: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });


const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;