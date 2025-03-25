import express from "express"
import { createReservation, getReservationsController, deleteReservationController } from "../controller/reservationController.js"

const router = express.Router();

// Create reservation route
router.post("/reservation", createReservation);

//retrieve all data

router.get("/get-reserv", getReservationsController);

//retrieve by id
//router.get("/Onecontact/:id", requireSignIn, getContactController);

//delete by id
router.delete("/Deletereserv/:id", deleteReservationController);



export default router;

