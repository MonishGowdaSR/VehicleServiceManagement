import express from "express";
import {
  registerUser,
  sendLoginOtp,
  verifyOtp,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login/send-otp", sendLoginOtp);
router.post("/login/verify-otp", verifyOtp);

export default router;