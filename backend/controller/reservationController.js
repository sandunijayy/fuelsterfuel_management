
import Reservation from "../model/reservationModel.js";
import Inventory from "../model/InventoryModel.js";


//import twilio from "twilio"


//const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

//creating a reservation
export const createReservation = async (req, res) => {
    try {
        console.log("Received request body:", req.body); // Debugging step

        const { customerName, email, vehicleNumber, fuelType, priority, fuelAmount, allocatedFuelAmount, phoneNumber } = req.body;

        if (!customerName || !email || !vehicleNumber || !fuelType || !priority || !fuelAmount || !allocatedFuelAmount || !phoneNumber) {
            console.log("Missing fields in request");
            return res.status(400).json({ error: "All fields are required" });
        }

        let pricePerUnit = 0;

        if (fuelType === 'Petrol92') {
            pricePerUnit = 10;
        } else if (fuelType === 'Diesel') {
            pricePerUnit = 12;
        } else {
            return res.status(400).json({ error: "Invalid fuel type" });
        }

        const totalPrice = pricePerUnit * parseFloat(fuelAmount);

        const inventoryItem = await Inventory.findOne({ fuelType });

        if (!inventoryItem || inventoryItem.availableQuantity < allocatedFuelAmount) {
            return res.status(400).json({ error: "Not enough fuel in inventory" });
        }

        // Deduct allocated fuel from inventory
        inventoryItem.availableQuantity -= allocatedFuelAmount;
        await inventoryItem.save();





        // Deduct allocated fuel from inventory
        //inventoryItem.availableQuantity -= 
        // finalAllocatedFuel;
        //await inventoryItem.save();

        // Save the reservation
        const newReservation = new Reservation({
            customerName,
            email,
            vehicleNumber,
            fuelType,
            priority,
            fuelAmount,
            allocatedFuelAmount,
            phoneNumber,
            totalPrice
        });

        await newReservation.save();
        console.log("Reservation saved successfully");
        res.status(201).json({ message: "Reservation form submitted successfully" });

    } catch (error) {
        console.error("Error creating reservation:", error);
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

// Controller for retrieving a specific reservation submission by ID
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

// Controller for deleting a specific reservation submission by ID
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

// Update reservation status by admin
export const updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const updatedReservation = await Reservation.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Returns the updated document
        );

        if (!updatedReservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//check fuel availability
export const checkFuelAvailability = async (req, res) => {
    try {
        const { fuelType, fuelAmount, priority } = req.body;

        if (!fuelType || !fuelAmount || !priority) {
            return res.status(400).json({ error: "Fuel type, fuel amount, and priority are required" });
        }

        const requestedFuelAmount = Number(fuelAmount);
        if (isNaN(requestedFuelAmount) || requestedFuelAmount <= 0) {
            return res.status(400).json({ error: "Invalid fuel amount" });
        }

        const inventoryItem = await Inventory.findOne({ fuelType });

        if (!inventoryItem) {
            return res.status(404).json({ error: "Fuel type not found in inventory" });
        }

        const availableFuel = inventoryItem.availableQuantity ?? 0;
        let allocatedFuelAmount = 0;

        // **Priority-based fuel allocation logic**
        if (availableFuel >= 100) {
            if (priority === "High") {
                allocatedFuelAmount = Math.min(requestedFuelAmount, availableFuel);
            } else if (priority === "Medium") {
                allocatedFuelAmount = Math.min(requestedFuelAmount, 10, availableFuel);
            } else if (priority === "Low") {
                allocatedFuelAmount = 0; // Low priority gets no fuel when available quantity is 100
            }
        } else if (availableFuel >= 50) {
            if (priority === "High") {
                allocatedFuelAmount = Math.min(requestedFuelAmount, availableFuel);
            } else {
                allocatedFuelAmount = 0; // Only high priority gets fuel when available quantity is 50
            }
        } else {
            allocatedFuelAmount = 0; // No fuel allocation if inventory is below 50
        }

        return res.status(200).json({ allocatedFuelAmount });

    } catch (error) {
        console.error("Error checking fuel availability:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

