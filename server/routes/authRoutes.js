import express from "express";

import {
  registerUser,
  sendLoginOtp,
  verifyOtp,
  sendAdminOtp,
  verifyAdminOtp
} from "../controllers/authController.js";

const router = express.Router();

/* ================= USER ================= */
router.post(
  "/register",
  registerUser
);

router.post(
  "/login/send-otp",
  sendLoginOtp
);

router.post(
  "/login/verify-otp",
  verifyOtp
);

/* ================= ADMIN ================= */
router.post(
  "/admin/send-otp",
  sendAdminOtp
);

router.post(
  "/admin/verify-otp",
  verifyAdminOtp
);

export default router;