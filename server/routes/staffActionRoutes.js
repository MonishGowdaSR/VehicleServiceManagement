import express from "express";
import protect from "../middleware/auth.js";
import {
  startService,
  completeService,
} from "../controllers/staffActionController.js";

const router = express.Router();

router.patch("/start/:bookingId", protect, startService);
router.patch("/complete/:bookingId", protect, completeService);

export default router;