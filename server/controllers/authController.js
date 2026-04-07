import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendOTP } from "../utils/sendOtp.js";
import jwt from "jsonwebtoken";

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    const existing = await User.findOne({
      $or: [{ phone }, { email }],
    });

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const otpData = {
      code: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };

    const user = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      otp: otpData,
    });

    await sendOTP(phone, otpCode);

    console.log("REGISTER OTP:", otpCode);

    res.status(201).json({
      message: "OTP sent successfully",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

// VERIFY REGISTER OTP
export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp || user.otp.code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isPhoneVerified = true;
    user.otp = undefined;

    await user.save();

    res.status(200).json({
      message: "Phone verified successfully",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// KYC (TEMP WITHOUT CLOUDINARY)
export const completeKyc = async (req, res) => {
  try {
    const { userId, idType, idNumber } = req.body;

    const user = await User.findById(userId);

    if (!user || !user.isPhoneVerified) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    if (idType === "AADHAR" && !/^\d{12}$/.test(idNumber)) {
      return res.status(400).json({ message: "Invalid Aadhar" });
    }

    if (idType === "DL" && idNumber.length < 8) {
      return res.status(400).json({ message: "Invalid DL" });
    }

    if (!req.files || !req.files.idDocument || !req.files.profilePhoto) {
      return res.status(400).json({ message: "Files missing" });
    }

    user.idType = idType;
    user.idNumber = idNumber;
    user.idDocumentUrl = "dummy-id-url";
    user.profilePhoto = "dummy-profile-url";
    user.isKycVerified = true;

    await user.save();

    res.status(200).json({
      message: "KYC completed",
    });
  } catch (error) {
    res.status(500).json({ message: "KYC failed" });
  }
};

// 🔥 LOGIN STEP 1 → SEND OTP
export const sendLoginOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = {
      code: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };

    await user.save();

    await sendOTP(phone, otpCode);

    console.log("LOGIN OTP:", otpCode);

    res.status(200).json({
      message: "Login OTP sent",
    });
  } catch (error) {
    res.status(500).json({ message: "Login OTP failed" });
  }
};
// 🔥 LOGIN STEP 2 → VERIFY OTP + JWT
export const verifyLoginOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || user.otp.code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // clear OTP
    user.otp = undefined;
    await user.save();

    // 🔐 GENERATE JWT (✅ FIXED)
    const token = jwt.sign(
      {
        id: user._id,          // ✅ IMPORTANT FIX
        role: user.role,
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};