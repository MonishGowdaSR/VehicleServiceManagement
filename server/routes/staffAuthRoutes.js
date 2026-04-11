import express from "express";
import {
  sendStaffOtp,
  verifyStaffOtp,
} from "../controllers/staffAuthController.js";

const router = express.Router();

router.post("/send-otp", sendStaffOtp);
router.post("/verify-otp", verifyStaffOtp);

export default router;