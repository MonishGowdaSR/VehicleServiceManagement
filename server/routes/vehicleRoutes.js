import express from "express";
import protect from "../middleware/auth.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  addVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle
} from "../controllers/vehicleController.js";

const router =
  express.Router();

/* Upload fields */
const vehicleUpload =
  upload.fields([
    {
      name:
        "vehiclePhoto",
      maxCount: 1
    },
    {
      name:
        "licenseDocument",
      maxCount: 1
    }
  ]);

/* ================= ROUTES ================= */

/* Add vehicle */
router.post(
  "/",
  protect,
  vehicleUpload,
  addVehicle
);

/* Get my vehicles */
router.get(
  "/",
  protect,
  getVehicles
);

/* Update vehicle */
router.put(
  "/:id",
  protect,
  vehicleUpload,
  updateVehicle
);

/* Delete vehicle */
router.delete(
  "/:id",
  protect,
  deleteVehicle
);

export default router;