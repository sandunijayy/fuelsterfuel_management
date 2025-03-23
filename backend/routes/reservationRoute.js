import express from "express"
import { createReservation, getReservations } from "../controller/reservationController.js"

const router = express.Router();

router.post('/reserve', createReservation);
router.get('/reservations', getReservations);

export default router;

