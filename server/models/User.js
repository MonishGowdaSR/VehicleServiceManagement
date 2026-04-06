import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // OTP SYSTEM
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      code: String,
      expiresAt: Date,
    },

    // KYC
    idType: {
      type: String,
      enum: ["AADHAR", "DL"],
    },

    idNumber: {
      type: String,
    },

    idDocumentUrl: {
      type: String,
    },

    profilePhoto: {
      type: String,
    },

    isKycVerified: {
      type: Boolean,
      default: false,
    },

    // ACCOUNT STATUS
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);