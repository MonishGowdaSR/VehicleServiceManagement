import express from "express";
import {
  addVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle
} from "../controllers/vehicleController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected

router.post("/", protect, addVehicle);          // Add vehicle
router.get("/", protect, getVehicles);          // Get all vehicles
router.put("/:id", protect, updateVehicle);     // Update status
router.delete("/:id", protect, deleteVehicle);  // Delete vehicle

export default router;