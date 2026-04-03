import express from "express";
import {
  addVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
  getVehicleStats,
} from "../controllers/vehicleController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// All routes are protected

router.get("/stats", protect, adminOnly, getVehicleStats);


router.post("/", protect, addVehicle);          // user + admin
router.get("/", protect, getVehicles);          // user + admin

// admin only
router.put("/:id", protect, adminOnly, updateVehicle);
router.delete("/:id", protect, adminOnly, deleteVehicle);

export default router;