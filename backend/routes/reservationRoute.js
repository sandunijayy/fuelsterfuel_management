import express from "express"
import {
     createReservation,
     getReservationsController,
     deleteReservationController,
     getReservationController,
     getUserReservations,
     updateReservationStatus,
     checkFuelAvailability
} from "../controller/reservationController.js"

const router = express.Router();

// Create reservation route
router.post("/reservation", createReservation);

//retrieve all data

router.get("/get-reserv", getReservationsController);

//retrieve by id
router.get("/onereserv/:id", getReservationController);

//delete by id
router.delete("/Deletereserv/:id", deleteReservationController);

//get reservation details according to the login details
router.get("/reservations/:email", getUserReservations);

//update reservation status
router.put("/update-status/:id", updateReservationStatus);

//check the fuel availability
router.get("/checkFuelAvailability", checkFuelAvailability);





export default router;

