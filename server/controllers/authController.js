import User from "../models/User.js";
import jwt from "jsonwebtoken";

/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
  try {
    const { name, phone, mobile, email, password } = req.body;

    const userPhone = phone || mobile;

    if (!name || !userPhone || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone: userPhone }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const user = await User.create({
      name,
      phone: userPhone,
      email,
      password,
      role: "USER"
    });

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      data: user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* ================= SEND OTP ================= */
export const sendLoginOtp = async (req, res) => {
  try {
    const { mobile, phone } = req.body;

    const userPhone = mobile || phone;

    if (!userPhone) {
      return res.status(400).json({
        message: "Phone required"
      });
    }

    let user = await User.findOne({ phone: userPhone });

    /* AUTO REGISTER NEW USER */
    if (!user) {
      user = await User.create({
        name: "New User",
        phone: userPhone,
        email: `${userPhone}@demo.com`,
        password: "123456",
        role: "USER"
      });
    }

    //const otp = "123456"; // fixed OTP for demo
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    };

    await user.save();

    console.log("OTP:", otp);

    return res.json({
      success: true,
      message: "OTP sent"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {
  try {
    const { mobile, phone, otp } = req.body;

    const userPhone = mobile || phone;

    const user = await User.findOne({ phone: userPhone });

    if (!user || !user.otp) {
      return res.status(400).json({
        message: "Invalid request"
      });
    }

    if (
      user.otp.code !== otp ||
      user.otp.expiresAt < new Date()
    ) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    user.isPhoneVerified = true;
    user.otp = undefined;

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};