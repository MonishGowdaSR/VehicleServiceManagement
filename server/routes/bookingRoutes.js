import express from "express";
import protect from "../middleware/auth.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  getAllBookings
} from "../controllers/bookingController.js";
const router =
  express.Router();

/* ========================= */
/* GET MY BOOKINGS */
/* ========================= */
router.get(
  "/",
  protect,
  getMyBookings
);

/* ========================= */
/* CREATE BOOKING */
/* Supports damage image upload */
/* field name: damageImage */
/* ========================= */
router.post(
  "/",
  protect,
  upload.single(
    "damageImage"
  ),
  createBooking
);
router.get(
  "/admin/all",
  protect,
  getAllBookings
);
/* ========================= */
/* UPDATE BOOKING STATUS */
/* ========================= */
router.patch(
  "/status/:id",
  protect,
  updateBookingStatus
);

export default router;