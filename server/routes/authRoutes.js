import express from "express";
import {
  registerUser,
  verifyOtp,
  completeKyc,
  sendLoginOtp,
  verifyLoginOtp,
} from "../controllers/authController.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);

router.post(
  "/kyc",

  completeKyc
);

// LOGIN
router.post("/login/send-otp", sendLoginOtp);
router.post("/login/verify-otp", verifyLoginOtp);

export default router;