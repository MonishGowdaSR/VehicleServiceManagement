import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendOTP } from "../utils/sendOtp.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

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
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };

    const user = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      otp: otpData,
    });

    await sendOTP(phone, otpCode);

    res.status(201).json({
      message: "OTP sent successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

// VERIFY OTP
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

// KYC
export const completeKyc = async (req, res) => {
  try {
    const { userId, idType, idNumber } = req.body;

    const user = await User.findById(userId);

    if (!user || !user.isPhoneVerified) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    // ID VALIDATION
    if (idType === "AADHAR" && !/^\d{12}$/.test(idNumber)) {
      return res.status(400).json({ message: "Invalid Aadhar" });
    }

    if (idType === "DL" && idNumber.length < 8) {
      return res.status(400).json({ message: "Invalid DL" });
    }

    // ⚠️ TEMP: Skip Cloudinary
    if (!req.files || !req.files.idDocument || !req.files.profilePhoto) {
      return res.status(400).json({ message: "Files missing" });
    }

    // Just store dummy values
    user.idType = idType;
    user.idNumber = idNumber;
    user.idDocumentUrl = "dummy-id-url";
    user.profilePhoto = "dummy-profile-url";
    user.isKycVerified = true;

    await user.save();

    res.status(200).json({
      message: "KYC completed (without cloudinary)",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "KYC failed" });
  }
};