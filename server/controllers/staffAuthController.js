import Staff from "../models/Staff.js";
import jwt from "jsonwebtoken";

/* ================= SEND OTP ================= */
export const sendStaffOtp = async (req, res) => {
  const { phone } = req.body;

  const staff = await Staff.findOne({ phone });

  if (!staff) {
    return res.status(404).json({ message: "Staff not found" });
  }

  const otp = "123456";

  staff.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  };

  await staff.save();

  res.json({ message: "OTP sent", otp });
};

/* ================= VERIFY OTP ================= */
export const verifyStaffOtp = async (req, res) => {
  const { phone, otp } = req.body;

  const staff = await Staff.findOne({ phone });

  if (!staff || staff.otp?.code !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const token = jwt.sign(
    { id: staff._id, role: staff.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  staff.otp = undefined;

res.json({
  token,
  staff,
});
};