import express from "express";
import protect from "../middleware/auth.js";
import { deliverVehicle } from "../controllers/adminController.js";

const router = express.Router();

router.patch("/deliver/:bookingId", protect, deliverVehicle);

export default router;