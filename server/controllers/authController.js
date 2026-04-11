import User from "../models/User.js";
import jwt from "jsonwebtoken";

/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
  try {
    const { name, phone, mobile, email, password } = req.body;

    console.log("REGISTER BODY:", req.body);

    const userPhone = phone || mobile;

    // validation
    if (!name || !userPhone || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // normalize
    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = userPhone.trim();

    // check existing user
    const existingUser = await User.findOne({
      $or: [{ email: cleanEmail }, { phone: cleanPhone }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // create user
    const user = await User.create({
      name,
      phone: cleanPhone,
      email: cleanEmail,
      password, // (hash later)
      role: "USER",
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* ================= SEND LOGIN OTP ================= */
export const sendLoginOtp = async (req, res) => {
  try {
    const { mobile, phone } = req.body;

    const userPhone = mobile || phone;

    if (!userPhone) {
      return res.status(400).json({
        message: "Phone number required",
      });
    }

    const user = await User.findOne({ phone: userPhone });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };

    await user.save();

    // Twilio fallback
    console.log("OTP (fallback):", otp);

    return res.json({
      success: true,
      message: "OTP sent",
    });

  } catch (error) {
    console.error("OTP ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {
  try {
    const { mobile, phone, otp } = req.body;

    const userPhone = mobile || phone;

    if (!userPhone || !otp) {
      return res.status(400).json({
        message: "Phone and OTP required",
      });
    }

    const user = await User.findOne({ phone: userPhone });

    if (!user || !user.otp) {
      return res.status(400).json({
        message: "Invalid request",
      });
    }

    // validate OTP
    if (
      user.otp.code !== otp ||
      user.otp.expiresAt < new Date()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // mark verified
    user.isPhoneVerified = true;
    user.otp = undefined;
    await user.save();

    // generate token (WITH ROLE)
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};