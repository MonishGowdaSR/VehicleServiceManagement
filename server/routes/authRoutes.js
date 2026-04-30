import express from "express";

import {
  sendSignupOtp,
  verifySignupOtp,
  sendLoginOtp,
  verifyOtp,
  sendAdminOtp,
  verifyAdminOtp
} from "../controllers/authController.js";

const router =
  express.Router();

/* ================= USER SIGNUP ================= */
router.post(
  "/signup/send-otp",
  sendSignupOtp
);

router.post(
  "/signup/verify-otp",
  verifySignupOtp
);

/* ================= USER LOGIN ================= */
router.post(
  "/login/send-otp",
  sendLoginOtp
);

router.post(
  "/login/verify-otp",
  verifyOtp
);

/* ================= ADMIN LOGIN ================= */
router.post(
  "/admin/send-otp",
  sendAdminOtp
);

router.post(
  "/admin/verify-otp",
  verifyAdminOtp
);

export default router;