import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    customerName: String,
    vehicleType: String,
    priority: String, // High, Medium, Low
    fuelAmount: Number,
    status: { type: String, default: 'Pending' },
    phoneNumber: String,
});


const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;