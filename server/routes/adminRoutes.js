import express from "express";
import protect from "../middleware/auth.js";

import {
  getAllBookings,
  deliverVehicle
} from "../controllers/adminController.js";

const router = express.Router();

/* =========================
   GET ALL BOOKINGS
========================= */
router.get("/bookings", protect, getAllBookings);

/* =========================
   DELIVER VEHICLE
========================= */
router.patch(
  "/deliver/:bookingId",
  protect,
  deliverVehicle
);

export default router;