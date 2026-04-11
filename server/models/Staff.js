import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      unique: true
    },

    role: {
      type: String,
      enum: ["PICKUP_AGENT", "TECHNICIAN"],
      required: true,
      index: true
    },

    profilePhoto: String,

    drivingLicenseNumber: String,

    isAvailable: {
      type: Boolean,
      default: true,
      index: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    currentBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null
    },

    // 🔥 NEW: load tracking
    currentLoad: {
      type: Number,
      default: 0
    },

    currentLocation: {
      lat: Number,
      lng: Number,
      lastUpdated: Date
    }
  },
  { timestamps: true }
);

staffSchema.index({ role: 1, isAvailable: 1 });

export default mongoose.model("Staff", staffSchema);