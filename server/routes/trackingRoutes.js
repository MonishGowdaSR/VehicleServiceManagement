import express from "express";
import protect from "../middleware/auth.js";

import {
  startTracking,
  updateLocation,
  getTrackingLocation,
  stopTracking
} from "../controllers/trackingController.js";

const router = express.Router();

router.patch("/start/:bookingId", protect, startTracking);
router.patch("/update-location/:bookingId", protect, updateLocation);

// IMPORTANT: this must come BEFORE "/:bookingId"
router.get("/location/:bookingId", protect, getTrackingLocation);

router.patch("/stop/:bookingId", protect, stopTracking);

export default router;