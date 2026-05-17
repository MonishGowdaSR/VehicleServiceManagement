import express from "express";
import protect, {
  adminOnly
} from "../middleware/auth.js";

import {
  getAllBookings,
  deliverVehicle,
  generateInvoice,
  getAllUsers
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

/* ============================= */
/* GENERATE INVOICE */
/* ============================= */
router.patch(
  "/generate-invoice/:bookingId",
  protect,
  adminOnly,
  generateInvoice
);

/* =========================
   GET ALL USERS
========================= */
router.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers
);

export default router;