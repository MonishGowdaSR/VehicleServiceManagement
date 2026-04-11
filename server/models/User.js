import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    // ⚠️ Optional if OTP only
    password: {
      type: String
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
      index: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isPhoneVerified: {
      type: Boolean,
      default: false
    },

    otp: {
      code: String,
      expiresAt: Date
    },

    idType: {
      type: String,
      enum: ["AADHAR", "DL"]
    },

    idNumber: String,
    idDocumentUrl: String,
    profilePhoto: String,

    isKycVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);