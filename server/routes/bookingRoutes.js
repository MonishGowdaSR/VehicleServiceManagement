import express from "express";
import {
  createBooking,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

/* ========================= */
/* CREATE BOOKING */
/* ========================= */
router.post("/", protect, createBooking);

/* ========================= */
/* UPDATE BOOKING STATUS */
/* ========================= */
router.patch("/status/:id", protect, updateBookingStatus);

export default router;