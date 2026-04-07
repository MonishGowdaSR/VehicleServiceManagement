import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    vehicleNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    vehicleType: {
      type: String,
      enum: ["car", "bike", "scooter"],
      required: true,
    },

    brand: {
      type: String,
      trim: true,
      default: "",
    },

    model: {
      type: String,
      trim: true,
      default: "",
    },

    fuelType: {
      type: String,
      enum: ["petrol", "diesel", "electric", "cng"],
      default: "petrol",
    },

    image: {
      type: String,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// ✅ Prevent duplicate vehicle per user
vehicleSchema.index({ user: 1, vehicleNumber: 1 }, { unique: true });

// ✅ Normalize vehicle number before saving (extra safety)
vehicleSchema.pre("save", function () {
  if (this.vehicleNumber) {
    this.vehicleNumber = this.vehicleNumber
      .replace(/[^A-Za-z0-9]/g, "")
      .toUpperCase();
  }
});

export default mongoose.model("Vehicle", vehicleSchema);