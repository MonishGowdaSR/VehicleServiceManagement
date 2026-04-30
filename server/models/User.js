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

    password: {
      type: String,
      default: null
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

    profilePhoto: {
      type: String,
      default:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=User"
    },

    idType: {
      type: String,
      enum: ["AADHAR", "DL"],
      default: null
    },

    idNumber: {
      type: String,
      default: null
    },

    idDocumentUrl: {
      type: String,
      default: null
    },

    isKycVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "User",
  userSchema
);