
import Reservation from "../model/reservationModel.js";
//import twilio from "twilio"


//const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

//creating a reservation
export const createReservation = async (req, res) => {
    try {
        const { customerName, vehicleType, priority, fuelAmount, status, phoneNumber } = req.body;
        const newReservation = new Reservation({ customerName, vehicleType, priority, fuelAmount, status, phoneNumber });
        await newReservation.save();
        res.status(201).json({ message: 'reservation form submitted successfully' });
    } catch (error) {
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
