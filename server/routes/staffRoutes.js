import express from "express";
import protect from "../middleware/auth.js";
import { getMyBookings } from "../controllers/staffController.js";

const router = express.Router();

router.get("/bookings", protect, getMyBookings);

export default router;
