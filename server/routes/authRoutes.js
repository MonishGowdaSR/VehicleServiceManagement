import express from "express";
import {
  registerUser,
  verifyOtp,
  completeKyc,
} from "../controllers/authController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);

router.post(
  "/kyc",
  upload.fields([
    { name: "idDocument", maxCount: 1 },
    { name: "profilePhoto", maxCount: 1 },
  ]),
  completeKyc
);

export default router;