
import Reservation from "../model/reservationModel.js";
//import twilio from "twilio"


//const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

//creating a reservation
export const createReservation = async (req, res) => {
    try {
        console.log("Received request:", req.body); // Log request body

        const { customerName, email, vehicleType, fuelType, priority, fuelAmount, phoneNumber } = req.body;
        
        // Check for missing fields
        if (!customerName || !email || !vehicleType || !fuelType || !fuelAmount || !phoneNumber) {
            console.log("Missing fields in request");
            return res.status(400).json({ error: "All fields are required" });
        }

        const newReservation = new Reservation({ customerName, email, vehicleType, fuelType, priority, fuelAmount, phoneNumber });
        await newReservation.save();

        console.log("Reservation saved successfully");
        res.status(201).json({ message: "Reservation form submitted successfully" });
    } catch (error) {
        console.error("Error creating reservation:", error); // Print full error in logs
        res.status(500).json({ error: error.message });
    }
};

// Controller for retrieving all reservation submissions
export const getReservationsController = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller for retrieving a specific contact us submission by ID
export const getReservationController = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'reservation not found' });
        }
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller for deleting a specific contact us submission by ID
export const deleteReservationController = async (req, res) => {
    try {
        const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);
        if (!deletedReservation) {
            return res.status(404).json({ message: 'reservation not found' });
        }
        res.status(200).json({ message: 'reservation deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//reservations for a specific user based on their email or user ID.
export const getUserReservations = async (req, res) => {
    try {
        const { email } = req.params; // Get email from request params
        if (!email) {
            return res.status(400).json({ message: "User email is required" });
        }

        const reservations = await Reservation.find({ email: email });
        
        if (!reservations.length) {
            return res.status(404).json({ message: "No reservations found for this user" });
        }

        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



/*export const createReservation = async (req, res) => {
    try {
        console.log("Request body:", req.body);

        const newReservation = new Reservation(req.body);
        await newReservation.save();

        client.messages.create({
            body: `Your fuel reservation is confirmed! Amount: ${req.body.fuelAmount}L`,
            from: '+1234567890',
            to: req.body.phoneNumber,
        });

        res.status(201).json({ message: 'Reservation successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};*/

export const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
