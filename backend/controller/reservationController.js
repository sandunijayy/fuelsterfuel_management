
import Reservation from "../model/reservationModel.js";
import twilio from "twilio"


const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const createReservation = async (req, res) => {
    try {
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
};

export const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
